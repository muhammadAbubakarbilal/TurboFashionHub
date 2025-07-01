import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewsletterSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/newsletter", { email: data.email });
      toast({
        title: "Success!",
        description: "Thank you for subscribing to our newsletter.",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem subscribing to the newsletter.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-[#0F172A] text-white" aria-label="Newsletter Signup">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Join Our Community</h2>
        <p className="text-white/80 max-w-2xl mx-auto mb-8">
          Subscribe to our newsletter and be the first to know about new collections, special offers, and exclusive events.
        </p>
        
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)} 
            className="max-w-md mx-auto flex flex-col sm:flex-row gap-3"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Input
                      placeholder="Your email address"
                      className="px-4 py-3 rounded-md text-[#0F172A] focus-visible:ring-[#FB923C] focus-visible:ring-offset-0 focus-visible:outline-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-left text-xs text-red-300 mt-1" />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="bg-[#FB923C] hover:bg-[#FDBA74] text-white font-medium px-6 py-3"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        </Form>
        
        <p className="text-white/60 text-sm mt-4">
          By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
        </p>
      </div>
    </section>
  );
}
