import { useNavigate } from "react-router-dom";
import { BulkActions } from "../components/BulkActions";
import { SearchBar } from "../components/SearchBar";
import { Table } from "../components/Table";
import { URLForm } from "../components/URLForm";
import { useAuth } from "../context/AuthContext";
import { useURLs } from "../hooks/useURLs";
import { BulkActionType, URLFormData } from "../types";

export default function DashboardPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const {
    urls,
    total,
    page,
    size,
    selectedIds,
    isLoadingURLs,
    isAddingURL,
    isBulkActionLoading,
    addError,
    addNewURL,
    handleBulkAction,
    setPage,
    setSearchQuery,
    setSelectedIds,
  } = useURLs();

  const handleURLSubmit = async (data: URLFormData) => {
    await addNewURL(data);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleBulkActionClick = async (action: BulkActionType) => {
    try {
      await handleBulkAction(action);
    } catch (error) {
      // Error handling is managed by the hook
      console.error("Bulk action failed:", error);
    }
  };

  const handleRowClick = (id: number) => {
    navigate(`/details/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b">
        <h1 className="text-xl font-bold">URL Crawler</h1>
        <button
          className="flex items-center gap-1 text-sm px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
          onClick={logout}
        >
          Logout
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <URLForm
          onSubmit={handleURLSubmit}
          isLoading={isAddingURL}
          error={addError}
        />

        <SearchBar
          onSearch={handleSearch}
          placeholder="Global search"
          className="mb-4"
        />

        <BulkActions
          selectedCount={selectedIds.length}
          onAction={handleBulkActionClick}
          isLoading={isBulkActionLoading}
        />

        <div className="mt-4">
          <Table
            data={urls}
            selected={selectedIds}
            setSelected={setSelectedIds}
            onRowClick={handleRowClick}
            page={page}
            setPage={setPage}
            size={size}
            total={total}
            loading={isLoadingURLs}
          />
        </div>
      </main>
    </div>
  );
}
