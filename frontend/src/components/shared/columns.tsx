import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthContext } from '@/contexts/AuthContext';
import { useTableContext } from '@/contexts/TableContext';
import { botFormSchema } from '@/lib/form';
import { Bot } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogDescription } from '@radix-ui/react-dialog';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Info, MoreHorizontal, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';
import { useToast } from '../ui/use-toast';

export const columns: ColumnDef<Bot>[] = [
  /* {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }, */
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex flex-col gap-y-0.5">
        <Link
          className="font-medium w-fit capitalize"
          to={`/bot/${row.original._id}`}
        >
          {row.getValue('name')}
        </Link>
        <p className="text-gray-500 line-clamp-2 md:line-clamp-none">
          {row.original.description}
        </p>
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as
        | 'active'
        | 'inactive'
        | 'preview';
      return (
        <Badge variant={status} className="capitalize">
          {status}
        </Badge>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'base',
    header: () => 'Base',
    cell: ({ row }) => (
      <span className="capitalize">{row.original.basePersonality}</span>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  /* {
    accessorKey: 'personalityTraits',
    header: 'Traits',
    cell: ({ row }) => {
      const personalityTraits: string[] = row.getValue('personalityTraits');
      return (
        <div className="flex flex-col text-xs gap-y-1">
          {personalityTraits.map((trait) => (
            <span className="capitalize" key={trait}>
              {trait}
            </span>
          ))}
        </div>
      );
    },
    enableSorting: false,
  }, */
  {
    accessorKey: 'useCaseTemplate',
    header: () => 'Use Case',
    cell: ({ row }) => (
      <span className="capitalize">{row.original.useCaseTemplate}</span>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const form = useForm<z.infer<typeof botFormSchema>>({
        resolver: zodResolver(botFormSchema),
        defaultValues: {
          name: row.original.name,
          description: row.original.description,
          basePersonality: row.original.basePersonality,
          personalityTraits: row.original.personalityTraits.toString(),
          useCaseTemplate: row.original.useCaseTemplate,
          status: row.original.status,
        },
      });
      const [editOpen, setEditOpen] = useState<boolean>(false);
      const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
      const { toast } = useToast();
      const { token } = useAuthContext();
      const { selectedRowId, setSelectedRowId, setSelectedRowAction } =
        useTableContext();
      const queryClient = useQueryClient();

      const updateMutation = useMutation(
        ({ body, id }: { body: Partial<Omit<Bot, '_id'>>; id: string }) => {
          return fetch(`http://${process.env.API_URL}/bot/${id}`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          });
        }
      );

      const deleteMutation = useMutation((id: string) => {
        return fetch(`http://${process.env.API_URL}/bot/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      });

      const handleEdit = async () => {
        const body = form.getValues();
        const personalityTraits = form.getValues('personalityTraits');
        await updateMutation.mutate(
          {
            body: {
              ...body,
              personalityTraits:
                personalityTraits !== '' ? personalityTraits.split(',') : [],
            },
            id: selectedRowId,
          },
          {
            onSuccess: async (response) => {
              if (response.ok) {
                await queryClient.invalidateQueries({ queryKey: 'bots' });
                setEditOpen(false);
                toast({
                  title: 'Bot updated successfully!',
                  description: 'The element was successfully updated.',
                  variant: 'success',
                });
              } else {
                toast({
                  title: 'Something went wrong!',
                  description: 'Please try again later.',
                  variant: 'destructive',
                });
              }
            },
          }
        );
      };

      const handleDelete = async () => {
        await deleteMutation.mutate(selectedRowId, {
          onSuccess: async (response) => {
            if (response.ok) {
              await queryClient.invalidateQueries({ queryKey: 'bots' });
              setDeleteOpen(false);
              toast({
                title: 'Bot deleted successfully!',
                description:
                  'The element was successfully removed from the database.',
                variant: 'success',
              });
            } else {
              toast({
                title: 'Something went wrong!',
                description: 'Please try again later.',
                variant: 'destructive',
              });
            }
          },
        });
      };

      if (!token) {
        return null;
      }

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-neutral-200"
                disabled={!token}
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                className="hover:cursor-pointer"
                disabled={!token}
                onClick={() => {
                  setSelectedRowId(row.original._id);
                  setSelectedRowAction('edit');
                  setEditOpen(true);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="bg-red-100 text-red-500 hover:text-red-600 hover:bg-red-100 hover:cursor-pointer"
                disabled={!token}
                onClick={() => {
                  setSelectedRowId(row.original._id);
                  setSelectedRowAction('delete');
                  setDeleteOpen(true);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog
            key={`edit_${selectedRowId}`}
            open={editOpen}
            onOpenChange={setEditOpen}
          >
            <DialogTrigger asChild>Edit</DialogTrigger>
            <DialogContent className="md:max-w-md max-w-sm rounded-md">
              <DialogHeader>
                <DialogTitle>Edit an existing bot</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem id="name">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem id="description">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="basePersonality"
                  render={({ field }) => (
                    <FormItem id="basePersonality">
                      <FormLabel>Base</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="personalityTraits"
                  render={({ field }) => (
                    <FormItem id="personalityTraits">
                      <FormLabel>Traits</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        <span className="flex gap-1 items-center text-xs text-neutral-900/60">
                          <Info className="h-4 w-4" />
                          Use comma-separated values with no spaces in between.
                        </span>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="useCaseTemplate"
                  render={({ field }) => (
                    <FormItem id="useCaseTemplate">
                      <FormLabel>Use Case Template</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem id="status">
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="preview">Preview</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button onClick={form.handleSubmit(handleEdit)}>
                    Submit
                  </Button>
                </DialogFooter>
              </Form>
            </DialogContent>
          </Dialog>

          <Dialog
            key={`delete_${selectedRowId}`}
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
          >
            <DialogTrigger asChild>Delete</DialogTrigger>
            <DialogContent className="md:max-w-md max-w-sm rounded-md">
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                This action cannot be undone. Are you sure you want to
                permanently delete this element?
              </DialogDescription>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={() => handleDelete()}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete permanently
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
];
