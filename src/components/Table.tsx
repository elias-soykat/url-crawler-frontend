import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { URLItem } from "../api/api";

interface TableProps {
  readonly data: URLItem[];
  readonly selected: number[];
  readonly setSelected: (ids: number[]) => void;
  readonly onRowClick: (id: number) => void;
  readonly page: number;
  readonly setPage: (page: number) => void;
  readonly size: number;
  readonly total: number;
  readonly loading: boolean;
}

export function Table({
  data,
  selected,
  setSelected,
  onRowClick,
  page,
  setPage,
  size,
  total,
  loading,
}: TableProps) {
  const columns: ColumnDef<URLItem>[] = [
    {
      id: "select",
      header: () => (
        <input
          type="checkbox"
          checked={selected.length === data.length && data.length > 0}
          onChange={(e) =>
            setSelected(e.target.checked ? data.map((row) => row.id) : [])
          }
        />
      ),
      cell: (info) => (
        <input
          type="checkbox"
          checked={selected.includes(info.row.original.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelected([...selected, info.row.original.id]);
            } else {
              setSelected(selected.filter((id) => id !== info.row.original.id));
            }
          }}
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
    {
      accessorKey: "title",
      header: () => "Title",
      cell: (info) => {
        return info.row.original.title || "-";
      },
    },
    {
      accessorKey: "address",
      header: () => "URL",
      cell: (info) => {
        const url = info.getValue() as string;
        return (
          <span className="text-xs text-gray-700">
            {url.length > 40 ? url.slice(0, 40) + "..." : url}
          </span>
        );
      },
    },
    {
      accessorKey: "html_version",
      header: () => "HTML Version",
      cell: (info) => info.getValue() as string,
    },
    {
      accessorKey: "internal_links",
      header: () => "#Internal",
      cell: (info) => info.getValue() as number,
    },
    {
      accessorKey: "external_links",
      header: () => "#External",
      cell: (info) => info.getValue() as number,
    },
    {
      accessorKey: "broken_links",
      header: () => "#Broken",
      cell: (info) => info.getValue() as number,
    },
    {
      accessorKey: "has_login_form",
      header: () => "Login Form",
      cell: (info) =>
        info.getValue() ? (
          <span className="text-green-600 font-bold">Yes</span>
        ) : (
          <span className="text-gray-400">No</span>
        ),
    },
    {
      accessorKey: "status",
      header: () => "Status",
      cell: (info) => {
        const status = info.getValue() as string;
        const color =
          status === "done"
            ? "green"
            : status === "error"
            ? "red"
            : status === "running"
            ? "yellow"
            : "gray";
        return (
          <span className={`text-${color}-600 font-bold`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(total / size),
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div
          data-testid="loading-spinner"
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"
        />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center p-6 sm:p-10">
        <h4 className="text-gray-500">No data</h4>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border rounded bg-white">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-2 py-2 text-center font-medium text-sm"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-blue-50 cursor-pointer"
              onClick={() => onRowClick(row.original.id)}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-2 py-2 text-sm text-center">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="flex items-center justify-between p-2 mt-4">
        <span>
          Page {page} of {Math.max(1, Math.ceil(total / size))}
        </span>
        <div className="flex gap-2 mt-2">
          <button
            className="px-2 py-1 text-sm bg-gray-200 rounded"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>
          <button
            className="px-2 py-1 text-sm bg-gray-200 rounded"
            disabled={page >= Math.ceil(total / size)}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
