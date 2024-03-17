import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

export type RowAction = 'edit' | 'delete';

export type TableContextType = {
  selectedRowId: string;
  setSelectedRowId: Dispatch<SetStateAction<string>>;
  selectedRowAction: RowAction;
  setSelectedRowAction: Dispatch<SetStateAction<RowAction>>;
};

const TableContext = createContext<TableContextType>({
  selectedRowId: null,
  setSelectedRowId: (_: SetStateAction<string>) => {},
  selectedRowAction: null,
  setSelectedRowAction: (_: SetStateAction<RowAction>) => {},
});

export const TableContextProvider = ({ children }: PropsWithChildren) => {
  const [selectedRowId, setSelectedRowId] = useState<string>(null);
  const [selectedRowAction, setSelectedRowAction] = useState<RowAction>(null);

  return (
    <TableContext.Provider
      value={{
        selectedRowId,
        setSelectedRowId,
        selectedRowAction,
        setSelectedRowAction,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};

export const useTableContext = () => useContext(TableContext);

export default TableContextProvider;
