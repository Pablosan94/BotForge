import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuthContext } from '@/contexts/AuthContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { Info, Menu } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Separator } from '../ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useToast } from '../ui/use-toast';

const formSchema = z.object({
  username: z.string(),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long.',
  }),
});

const Header = () => {
  const [registerOpen, setRegisterOpen] = useState<boolean>(false);
  const [loginOpen, setLoginOpen] = useState<boolean>(false);

  const registerForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  const loginForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  const registerMutation = useMutation((user: z.infer<typeof formSchema>) => {
    return fetch(`${process.env.API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
  });
  const loginMutation = useMutation((user: z.infer<typeof formSchema>) => {
    return fetch(`${process.env.API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
  });
  const { toast } = useToast();
  const { token, setToken } = useAuthContext();
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await registerMutation.mutate(registerForm.getValues(), {
        onSuccess: async (data) => {
          const { token } = await data.json();
          if (token) {
            localStorage.setItem('token', token);
            setToken(token);
            setRegisterOpen(false);
            toast({
              title: 'Registered successfully!',
              description: 'You are now logged in.',
              variant: 'success',
            });
          }
        },
      });
    } catch (err) {
      toast({
        title: 'Something went wrong!',
        description: 'Please try again later.',
        variant: 'destructive',
      });
      console.log(err);
    }
  };

  const handleLogin = async () => {
    try {
      await loginMutation.mutate(loginForm.getValues(), {
        onSuccess: async (data) => {
          const { token } = await data.json();
          if (token) {
            localStorage.setItem('token', token);
            setToken(token);
            setLoginOpen(false);
            toast({
              title: 'Logged in successfully!',
              description: 'You are now logged in.',
              variant: 'success',
            });
          }
        },
      });
    } catch (err) {
      toast({
        title: 'Something went wrong!',
        description: 'Please try again later.',
        variant: 'destructive',
      });
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    toast({
      title: 'Logged out successfully!',
      description: 'You are now logged out.',
      variant: 'success',
    });
  };

  return (
    <header className="h-20 border-b border-neutral-300 flex items-center justify-between p-6 bg-neutral-200 text-sm">
      <Link
        data-cy="nav-logo"
        className="hidden lg:block bg-neutral-200 w-12 h-12 rounded-full border-foreground border-[10px] hover:border-sky-400 transition-colors duration-300"
        to="/"
      ></Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-neutral-200">
            <span className="sr-only">Open menu</span>
            <Menu className="block lg:hidden" data-cy="nav-menu" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" data-cy="nav-menu-content">
          <DropdownMenuLabel>Navigation menu</DropdownMenuLabel>
          <DropdownMenuItem>
            <Link to="#dashboard" data-cy="nav-menu-dashboard">
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/" data-cy="nav-menu-bot-management">
              Bot Management
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="#analytics" data-cy="nav-menu-analytics">
              Analytics
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="#user-management" data-cy="nav-menu-user-management">
              User management
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="#settings" data-cy="nav-menu-settings">
              Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <nav>
        <ul className="flex items-center gap-x-4 md:gap-x-6">
          <li className="hidden lg:block hover:cursor-pointer hover:opacity-75">
            <Link to="#dashboard" data-cy="nav-dashboard">
              Dashboard
            </Link>
          </li>
          <li className="hidden lg:block hover:cursor-pointer hover:opacity-75">
            <Link to="/" data-cy="nav-bot-management">
              Bot Management
            </Link>
          </li>
          <li className="hidden lg:block hover:cursor-pointer hover:opacity-75">
            <Link to="#analytics" data-cy="nav-analytics">
              Analytics
            </Link>
          </li>
          <li className="hidden lg:block hover:cursor-pointer hover:opacity-75">
            <Link to="#user-management" data-cy="nav-user-management">
              User management
            </Link>
          </li>
          <li className="hidden lg:block hover:cursor-pointer hover:opacity-75">
            <Link to="#settings" data-cy="nav-settings">
              Settings
            </Link>
          </li>
          <Separator className="hidden lg:block h-8" orientation="vertical" />
          {!token && (
            <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
              <DialogTrigger asChild>
                <li>
                  <Button variant="link" className="p-0">
                    Register
                  </Button>
                </li>
              </DialogTrigger>
              <DialogContent className="md:max-w-md max-w-sm rounded-md">
                <DialogHeader>
                  <DialogTitle>Register a new user</DialogTitle>
                </DialogHeader>
                <Form {...registerForm}>
                  <FormField
                    control={registerForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem id="username">
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="turing" {...field} />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem id="password">
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Secret12"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          <span className="flex gap-1 items-center text-xs text-neutral-900/60">
                            <Info className="h-4 w-4" />
                            Password must contain at least one uppercase and one
                            digit.
                          </span>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button onClick={registerForm.handleSubmit(handleRegister)}>
                      Register
                    </Button>
                  </DialogFooter>
                </Form>
              </DialogContent>
            </Dialog>
          )}
          {!token && (
            <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
              <DialogTrigger asChild>
                <li>
                  <Button variant="link" className="p-0" data-cy="login">
                    Login
                  </Button>
                </li>
              </DialogTrigger>
              <DialogContent className="md:max-w-md max-w-sm rounded-md">
                <DialogHeader>
                  <DialogTitle>Login</DialogTitle>
                </DialogHeader>
                <Form {...loginForm}>
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem id="username">
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="turing"
                            {...field}
                            data-cy="login-username"
                          />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem id="password">
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Secret12"
                            type="password"
                            {...field}
                            data-cy="login-password"
                          />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button
                      onClick={loginForm.handleSubmit(handleLogin)}
                      data-cy="login-submit"
                    >
                      Login
                    </Button>
                  </DialogFooter>
                </Form>
              </DialogContent>
            </Dialog>
          )}
          {token && (
            <li>
              <Button
                variant="link"
                className="p-0"
                onClick={handleLogout}
                data-cy="logout"
              >
                Logout
              </Button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
