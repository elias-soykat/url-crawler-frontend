import {
  ArrowPathIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addURL, bulkAction, fetchURLs, URLItem } from "../api/api";
import { Table } from "../components/Table";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const [urls, setUrls] = useState<URLItem[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [addError, setAddError] = useState("");
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function loadURLs() {
    setLoading(true);
    try {
      const data = await fetchURLs(page, size, search.trim() || undefined);
      setUrls(data.data);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadURLs();
    // const timer = setInterval(loadURLs, 3000);
    // return () => clearInterval(timer);
    // eslint-disable-next-line
  }, [page, search]);

  async function handleAddURL(e: React.FormEvent) {
    e.preventDefault();
    setAddError("");
    try {
      await addURL(address);
      setAddress("");
      loadURLs();
    } catch (err) {
      if (err instanceof AxiosError) {
        setAddError(
          err.response?.data.error || "Could not add URL. Invalid URL?"
        );
      } else {
        setAddError("Could not add URL. Invalid URL?");
      }
    }
  }

  async function handleBulk(action: "rerun" | "delete") {
    await bulkAction(action, selected);
    setSelected([]);
    loadURLs();
  }

  function handleRowClick(id: number) {
    navigate(`/details/${id}`);
  }

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
        <form
          className="flex gap-2 mb-4"
          onSubmit={handleAddURL}
          autoComplete="off"
        >
          <input
            className="flex-1 border border-gray-300 rounded px-3 py-2"
            type="url"
            placeholder="Enter website URL"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <button
            type="submit"
            className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 transition"
          >
            <PlusIcon className="w-4 h-4" />
            Add
          </button>
        </form>
        {addError && (
          <div className="my-4 text-red-600 text-sm text-left">{addError}</div>
        )}
        <div className="mb-4 flex gap-2">
          <input
            className="border border-gray-300 rounded px-2 py-1"
            placeholder="Global search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => loadURLs()}
          >
            Search
          </button>
        </div>
        <div className="mb-4 flex gap-2">
          <button
            className="flex items-center gap-1 px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
            disabled={selected.length === 0}
            onClick={() => handleBulk("rerun")}
          >
            <ArrowPathIcon className="w-4 h-4" />
            Rerun
          </button>
          <button
            className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            disabled={selected.length === 0}
            onClick={() => handleBulk("delete")}
          >
            <TrashIcon className="w-4 h-4" />
            Delete
          </button>
        </div>
        <Table
          data={urls}
          selected={selected}
          setSelected={setSelected}
          onRowClick={handleRowClick}
          page={page}
          setPage={setPage}
          size={size}
          total={total}
          loading={loading}
        />
      </main>
    </div>
  );
}
