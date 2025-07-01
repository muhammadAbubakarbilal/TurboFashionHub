import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState, useEffect } from "react";

interface CartProduct {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
}

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product?: CartProduct;
}

export function useCart() {
  const queryClient = useQueryClient();
  const [sessionId, setSessionId] = useState<string>("");
  
  // Generate a session ID if one doesn't exist
  useEffect(() => {
    const storedSessionId = localStorage.getItem("cartSessionId");
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem("cartSessionId", newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  // Fetch cart items
  const { data: cartItems = [] } = useQuery<CartItem[]>({
    queryKey: ['/api/cart'],
    queryFn: async ({ queryKey }) => {
      if (!sessionId) return [];
      const res = await fetch(queryKey[0] as string, {
        headers: {
          'Session-ID': sessionId
        },
        credentials: 'include',
      });
      
      if (res.status === 401) {
        return [];
      }
      
      if (!res.ok) {
        throw new Error('Failed to fetch cart items');
      }
      
      return await res.json();
    },
    enabled: !!sessionId,
  });

  // Add item to cart
  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: number, quantity: number }) => {
      return apiRequest("POST", "/api/cart", { productId, quantity }, {
        headers: {
          'Session-ID': sessionId
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
  });

  // Update cart item quantity
  const updateCartMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: number, quantity: number }) => {
      return apiRequest("PUT", `/api/cart/${id}`, { quantity }, {
        headers: {
          'Session-ID': sessionId
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
  });

  // Remove item from cart
  const removeCartMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/cart/${id}`, undefined, {
        headers: {
          'Session-ID': sessionId
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
  });

  const addToCart = async (productId: number, quantity: number) => {
    await addToCartMutation.mutateAsync({ productId, quantity });
  };

  const updateCartQuantity = async (id: number, quantity: number) => {
    await updateCartMutation.mutateAsync({ id, quantity });
  };

  const removeFromCart = async (id: number) => {
    await removeCartMutation.mutateAsync(id);
  };

  // Clear all items from cart
  const clearCart = async () => {
    // Remove all items one by one
    const removePromises = cartItems.map(item => removeCartMutation.mutateAsync(item.id));
    await Promise.all(removePromises);
    queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return {
    cartItems,
    cartItemCount,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    isLoading: addToCartMutation.isPending || updateCartMutation.isPending || removeCartMutation.isPending,
  };
}
