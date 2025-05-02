"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Store, CreditCard, Users, Printer, Receipt, Smartphone, Lock } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const paymentGatewaySchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

export function SettingsContent() {
  const [taxRate, setTaxRate] = useState("5")
  const [printReceipts, setPrintReceipts] = useState(true)
  const [autoLogout, setAutoLogout] = useState(true)
  const [currency, setCurrency] = useState("USD")
  const [isLoading, setIsLoading] = useState(false)

  const { authState, login } = useAuth()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof paymentGatewaySchema>>({
    resolver: zodResolver(paymentGatewaySchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof paymentGatewaySchema>) => {
    setIsLoading(true)

    try {
      const success = await login(values.email, values.password)

      if (success) {
        toast({
          title: "Authentication successful",
          description: "You have successfully connected to Norah Payment Gateway",
          variant: "default",
        })
        form.reset()
      } else {
        toast({
          title: "Authentication failed",
          description: "Please check your credentials and try again",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Tabs defaultValue="general">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Restaurant Information
                </CardTitle>
                <CardDescription>Update your restaurant details</CardDescription>
              </CardHeader>
              <CardContent>
                <Form>
                  <div className="space-y-4">
                    <FormField
                      name="restaurantName"
                      render={() => (
                        <FormItem>
                          <FormLabel>Restaurant Name</FormLabel>
                          <FormControl>
                            <Input defaultValue="Chili Restaurant" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="address"
                      render={() => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input defaultValue="123 Main Street, City" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="phone"
                      render={() => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input defaultValue="+1 234 567 8900" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <Button className="w-full">Save Changes</Button>
                  </div>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Tax & Billing
                </CardTitle>
                <CardDescription>Configure tax rates and billing settings</CardDescription>
              </CardHeader>
              <CardContent>
                <Form>
                  <div className="space-y-4">
                    <FormField
                      name="taxRate"
                      render={() => (
                        <FormItem>
                          <FormLabel>Tax Rate (%)</FormLabel>
                          <FormControl>
                            <Input type="number" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="currency"
                      render={() => (
                        <FormItem>
                          <FormLabel>Currency</FormLabel>
                          <Select value={currency} onValueChange={setCurrency}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="USD">USD ($)</SelectItem>
                              <SelectItem value="EUR">EUR (€)</SelectItem>
                              <SelectItem value="GBP">GBP (£)</SelectItem>
                              <SelectItem value="JPY">JPY (¥)</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="printReceipts"
                      render={() => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Automatic Receipt Printing</FormLabel>
                            <FormDescription>Print receipts automatically after each order</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={printReceipts} onCheckedChange={setPrintReceipts} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <Button className="w-full">Save Changes</Button>
                  </div>
                </Form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payment">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Methods
                </CardTitle>
                <CardDescription>Configure available payment methods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-md">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Credit/Debit Cards</h3>
                        <p className="text-sm text-gray-500">Accept Visa, Mastercard, Amex</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between border p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-md">
                        <Smartphone className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Mobile Payments</h3>
                        <p className="text-sm text-gray-500">Apple Pay, Google Pay</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between border p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-md">
                        <Receipt className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Cash</h3>
                        <p className="text-sm text-gray-500">Accept cash payments</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Norah Payment Gateway
                </CardTitle>
                <CardDescription>Configure your Norah Payment Gateway credentials</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="your-email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="pt-2">
                      {authState.isAuthenticated ? (
                        <div className="bg-green-50 p-3 rounded-md mb-4">
                          <p className="text-green-600 text-sm font-medium">Connected to Norah Payment Gateway</p>
                          <p className="text-sm text-gray-600">
                            Logged in as {authState.user?.fullName} ({authState.user?.email})
                          </p>
                        </div>
                      ) : null}

                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Connecting..." : authState.isAuthenticated ? "Reconnect" : "Connect"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>Manage staff accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-600 font-medium">JD</span>
                    </div>
                    <div>
                      <h3 className="font-medium">John Doe</h3>
                      <p className="text-sm text-gray-500">Administrator</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>

                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-medium">JS</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Jane Smith</h3>
                      <p className="text-sm text-gray-500">Cashier</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>

                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <span className="text-orange-600 font-medium">RJ</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Robert Johnson</h3>
                      <p className="text-sm text-gray-500">Manager</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>

                <Button className="w-full">Add New User</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Printer className="h-5 w-5" />
                Connected Devices
              </CardTitle>
              <CardDescription>Manage printers and other connected devices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-md">
                      <Printer className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Kitchen Printer</h3>
                      <p className="text-sm text-gray-500">Epson TM-T88VI - Connected</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-md">
                      <Printer className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Receipt Printer</h3>
                      <p className="text-sm text-gray-500">Star TSP143III - Connected</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Button className="w-full">Add New Device</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
