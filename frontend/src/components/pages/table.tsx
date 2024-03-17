import { columns } from '@/components/shared/columns';
import { DataTable } from '@/components/shared/data-table';
import { useAuthContext } from '@/contexts/AuthContext';
import { Bot } from '@/lib/types';
import { useQuery } from 'react-query';

const TablePage = () => {
  const { token } = useAuthContext();
  const { data, isFetching } = useQuery<Bot[]>({
    queryKey: 'bots',
    queryFn: async () =>
      await (await fetch(`http://${process.env.API_URL}/bot`)).json(),
    refetchOnWindowFocus: false,
  });

  return (
    <div className="md:px-6">
      {/* {isFetching && <p className="text-5xl text-center my-32">Loading...</p>} */}
      {!isFetching && <DataTable columns={columns} data={data} token={token} />}
    </div>
  );
};

export default TablePage;
