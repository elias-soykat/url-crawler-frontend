import { ArrowPathIcon, TrashIcon } from "@heroicons/react/24/outline";
import { BulkActionType } from "../types";

interface BulkActionsProps {
  selectedCount: number;
  onAction: (action: BulkActionType) => void;
  isLoading?: boolean;
}

export function BulkActions({
  selectedCount,
  onAction,
  isLoading = false,
}: BulkActionsProps) {
  const isDisabled = selectedCount === 0 || isLoading;

  return (
    <div className="flex gap-2">
      <button
        className="flex items-center gap-1 px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
        disabled={isDisabled}
        onClick={() => onAction("rerun")}
      >
        <ArrowPathIcon className="w-4 h-4" />
        Rerun ({selectedCount})
      </button>
      <button
        className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        disabled={isDisabled}
        onClick={() => onAction("delete")}
      >
        <TrashIcon className="w-4 h-4" />
        Delete ({selectedCount})
      </button>
    </div>
  );
}
