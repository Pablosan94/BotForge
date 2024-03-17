import { Bot } from '@/lib/types';
import { useLoaderData, useNavigate } from 'react-router-dom';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { useState } from 'react';
import { Label } from '../ui/label';
import { botFormSchema } from '@/lib/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Info } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useAuthContext } from '@/contexts/AuthContext';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useToast } from '../ui/use-toast';

type Params = {
  id: string;
};

export async function loader({ params }: { params: Params }) {
  const bot: Bot = await (
    await fetch(`http://${process.env.API_URL}/bot/${params.id}`)
  ).json();
  return bot;
}

const DetailPage = () => {
  const bot = useLoaderData() as Bot;
  const { data, isFetching } = useQuery<Bot>({
    queryKey: 'details',
    queryFn: async () =>
      await (
        await fetch(`http://${process.env.API_URL}/bot/${bot._id}`)
      ).json(),
    refetchOnWindowFocus: false,
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { token } = useAuthContext();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof botFormSchema>>({
    resolver: zodResolver(botFormSchema),
    defaultValues: {
      name: data?.name ?? bot.name,
      description: data?.description ?? bot.description,
      basePersonality: data?.basePersonality ?? bot.basePersonality,
      personalityTraits:
        data?.personalityTraits.toString() ?? bot.personalityTraits.toString(),
      useCaseTemplate: data?.useCaseTemplate ?? bot.useCaseTemplate,
      status: data?.status ?? bot.status,
    },
  });

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
        id: bot._id,
      },
      {
        onSuccess: async (response) => {
          if (response.ok) {
            await Promise.all([
              queryClient.invalidateQueries({ queryKey: 'details' }),
              queryClient.invalidateQueries({ queryKey: 'bots' }),
            ]);
            toast({
              title: 'Bot updated successfully!',
              description: 'The element was successfully updated.',
              variant: 'success',
            });
            setIsEditing(false);
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
    await deleteMutation.mutate(bot._id, {
      onSuccess: async (response) => {
        if (response.ok) {
          await queryClient.invalidateQueries({ queryKey: 'bots' });
          navigate('/');
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

  return (
    <>
      {!isFetching && (
        <Form {...form}>
          <div className="flex flex-col p-6 gap-4 md:gap-8 lg:grid md:grid-cols-6">
            <div className="flex flex-col md:col-span-3 p-6 bg-neutral-100 shadow-sm rounded-md">
              {!isEditing && (
                <>
                  <Label className="text-lg">Name</Label>
                  <p className="text-sm">{data.name}</p>
                </>
              )}
              {isEditing && (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem id="name">
                      <FormLabel className="text-lg">Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <div className="flex flex-col md:col-span-3 p-6 bg-neutral-100 shadow-sm rounded-md">
              {!isEditing && (
                <>
                  <Label className="text-lg">Description</Label>
                  <p className="text-sm">{data.description}</p>
                </>
              )}
              {isEditing && (
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem id="description">
                      <FormLabel className="text-lg">Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <div className="flex flex-col md:col-span-2 p-6 bg-neutral-100 shadow-sm rounded-md">
              {!isEditing && (
                <>
                  <Label className="text-lg">Base</Label>
                  <p className="text-sm capitalize">{data.basePersonality}</p>
                </>
              )}
              {isEditing && (
                <FormField
                  control={form.control}
                  name="basePersonality"
                  render={({ field }) => (
                    <FormItem id="basePersonality">
                      <FormLabel className="text-lg">Base</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <div className="flex flex-col md:col-span-2 p-6 bg-neutral-100 shadow-sm rounded-md">
              {!isEditing && (
                <>
                  <Label className="text-lg">Traits</Label>
                  <div className="flex flex-col md:flex-row justify-between w-full">
                    {data.personalityTraits.map((trait) => (
                      <span
                        className="text-sm capitalize"
                        key={`${data._id}_${trait}`}
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </>
              )}
              {isEditing && (
                <FormField
                  control={form.control}
                  name="personalityTraits"
                  render={({ field }) => (
                    <FormItem id="personalityTraits" className="mb-2">
                      <FormLabel className="text-lg">Traits</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      {isEditing && (
                        <FormDescription>
                          <span className="flex gap-1 items-center text-xs text-neutral-900/60">
                            <Info className="h-4 w-4" />
                            Use comma-separated values with no spaces in
                            between.
                          </span>
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <div className="flex flex-col md:col-span-2 p-6 bg-neutral-100 shadow-sm rounded-md">
              {!isEditing && (
                <>
                  <Label className="text-lg">Use Case Template</Label>
                  <p className="text-sm capitalize">{data.useCaseTemplate}</p>
                </>
              )}
              {isEditing && (
                <FormField
                  control={form.control}
                  name="useCaseTemplate"
                  render={({ field }) => (
                    <FormItem id="useCaseTemplate" className="mb-2">
                      <FormLabel className="text-lg">
                        Use Case Template
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            {!isEditing && (
              <Badge
                variant={data.status}
                className="flex flex-col capitalize md:col-span-6 p-6 shadow-sm rounded-md text-3xl"
              >
                {data.status}
              </Badge>
            )}
            {isEditing && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem
                    id="status"
                    className="flex flex-col capitalize md:col-span-6 p-6 bg-neutral-100 shadow-sm rounded-md md:text-3xl"
                  >
                    <FormLabel className="text-lg">Status</FormLabel>
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
            )}
            <div className="flex gap-4 md:col-span-6 justify-end">
              {!isEditing && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    disabled={!token}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete()}
                    disabled={!token}
                  >
                    Delete
                  </Button>
                </>
              )}
              {isEditing && (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={form.handleSubmit(handleEdit)}>
                    Confirm changes
                  </Button>
                </>
              )}
            </div>
          </div>
        </Form>
      )}
    </>
  );
};

export default DetailPage;
