import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fetchURLDetails, URLItem } from "../api/api";

export default function DetailsPage() {
  const { id } = useParams();
  const [data, setData] = useState<URLItem | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchURLDetails(id!).then((d) => {
      setData(d);
      setLoading(false);
    });
  }, [id]);

  if (loading || !data)
    return <div className="p-8 text-center text-gray-500">Loading...</div>;

  const chartData = [
    { name: "Internal", value: data.internal_links },
    { name: "External", value: data.external_links },
  ];
  const pieColors = ["#60a5fa", "#34d399"];
  const barData = [
    { type: "Internal", count: data.internal_links },
    { type: "External", count: data.external_links },
  ];

  return (
    <div className="min-h-screen bg-gray-200">
      <header className="flex items-center justify-between px-6 py-3.5 bg-white border-b">
        <button
          className="flex items-center gap-2 text-sm px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
          onClick={() => navigate(-1)}
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back
        </button>
        <h1 className="text-xl font-bold">
          URL Details for "{data.title || data.address}"
        </h1>
        <span />
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8 sm:py-10">
        <div className="bg-white rounded shadow p-6 mb-6">
          <h2 className="text-lg font-bold mb-2">
            {data.title || data.address}
          </h2>
          <div className="text-sm mb-4 text-gray-700">{data.address}</div>
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div className="flex flex-col gap-3">
              <div>
                HTML Version:{" "}
                <span className="font-semibold">{data.html_version}</span>
              </div>
              <div>
                Headings:{" "}
                {Object.entries(data.heading_counts || {}).map(([key, val]) => (
                  <span key={key} className="mr-2">
                    <span className="font-semibold">{key.toUpperCase()}</span>:{" "}
                    {val}
                  </span>
                ))}
              </div>
              <div>
                Login Form:{" "}
                {data.has_login_form ? (
                  <span className="text-green-600 font-bold">Yes</span>
                ) : (
                  <span className="text-gray-400">No</span>
                )}
              </div>
              <div>
                Status:{" "}
                <span
                  className={
                    data.status === "done"
                      ? "text-green-600 font-bold"
                      : data.status === "error"
                      ? "text-red-600 font-bold"
                      : data.status === "running"
                      ? "text-yellow-600 font-bold"
                      : "text-gray-400"
                  }
                >
                  {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                </span>
              </div>
              {data.error && (
                <div className="text-red-600 font-bold">
                  Error: {data.error}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold mb-2">Links Chart</h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    label
                  >
                    {chartData.map((_, idx) => (
                      <Cell key={`cell-${idx}`} fill={pieColors[idx]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={barData}>
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Bar dataKey="count" fill="#60a5fa" />
                  <Tooltip />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="bg-white rounded shadow p-6">
          <h3 className="font-semibold mb-3">Broken Links</h3>
          {data.broken_list && data.broken_list.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left px-2 py-1">URL</th>
                  <th className="text-left px-2 py-1">Status Code</th>
                  <th className="text-left px-2 py-1">Type</th>
                </tr>
              </thead>
              <tbody>
                {data.broken_list.map((bl, i) => (
                  <tr key={i}>
                    <td className="px-2 py-1 break-all">{bl.url}</td>
                    <td className="px-2 py-1">{bl.code}</td>
                    <td className="px-2 py-1">{bl.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-gray-500">No broken links found.</div>
          )}
        </div>
      </main>
    </div>
  );
}
