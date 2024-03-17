import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuthContext } from '@/contexts/AuthContext';
import { botFormSchema } from '@/lib/form';
import { Bot } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Info, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  token: string | null;
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const { toast } = useToast();
  const { token } = useAuthContext();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof botFormSchema>>({
    resolver: zodResolver(botFormSchema),
    defaultValues: {
      name: '',
      description: '',
      basePersonality: '',
      personalityTraits: '',
      useCaseTemplate: '',
      status: 'inactive',
    },
  });

  const table = useReactTable({
    data,
    columns,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 7,
      },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const createMutation = useMutation(
    ({ body }: { body: Partial<Omit<Bot, '_id'>> }) => {
      return fetch(`http://${process.env.API_URL}/bot`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
    }
  );

  const handleCreate = async () => {
    const body = form.getValues();
    const personalityTraits = form.getValues('personalityTraits');
    await createMutation.mutate(
      {
        body: {
          ...body,
          personalityTraits:
            personalityTraits !== '' ? personalityTraits.split(',') : [],
        },
      },
      {
        onSuccess: async (response) => {
          if (response.ok) {
            await queryClient.invalidateQueries({ queryKey: 'bots' });
            toast({
              title: 'Bot created successfully!',
              description:
                'The element was successfully created in the database.',
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

  return (
    <>
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter by name..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="mx-auto max-w-xs md:max-w-sm md:mx-0 border-neutral-300 bg-neutral-100"
        />

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="w-4 h-4 mr-2" /> Create
            </Button>
          </DialogTrigger>
          <DialogContent className="md:max-w-md max-w-sm rounded-md">
            <DialogHeader>
              <DialogTitle>Create a new bot</DialogTitle>
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
                <Button onClick={form.handleSubmit(handleCreate)}>
                  Submit
                </Button>
              </DialogFooter>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-none md:rounded-md border border-neutral-300 overflow-hidden">
        <Table>
          <TableHeader className="border-neutral-300">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-inherit bg-slate-200 hover:bg-slate-200"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="border-neutral-300">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="border-inherit bg-neutral-100 hover:bg-sky-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 bg-neutral-100 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="max-w-xs mx-auto md:mx-0 md:max-w-none flex items-center justify-between md:justify-end space-x-2 py-4">
        <div className="md:flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
