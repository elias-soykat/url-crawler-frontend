import { PlusIcon } from "@heroicons/react/24/outline";
import { useForm } from "../hooks/useForm";
import { FormErrors, URLFormData } from "../types";

interface URLFormProps {
  readonly onSubmit: (data: URLFormData) => Promise<void>;
  readonly isLoading?: boolean;
  readonly error?: string | null;
}

function validateURL(values: URLFormData): FormErrors {
  const errors: FormErrors = {};

  if (!values.address) {
    errors.address = "URL is required";
  } else if (!/^https?:\/\/.+/.test(values.address)) {
    errors.address =
      "Please enter a valid URL starting with http:// or https://";
  }

  return errors;
}

export function URLForm({ onSubmit, isLoading = false, error }: URLFormProps) {
  const { values, errors, handleChange, handleSubmit, reset } = useForm({
    initialValues: { address: "" },
    validate: validateURL,
    onSubmit: async (data) => {
      await onSubmit(data);
      reset();
    },
  });

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="flex gap-2 mb-4"
      >
        <input
          name="address"
          className="flex-1 border border-gray-300 rounded px-3 py-2"
          type="url"
          placeholder="Enter website URL"
          value={values.address}
          onChange={handleChange}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 transition disabled:opacity-50"
        >
          <PlusIcon className="w-4 h-4" />
          {isLoading ? "Adding..." : "Add"}
        </button>
      </form>

      {errors.address && (
        <div className="mb-4 text-red-600 text-sm">{errors.address}</div>
      )}

      {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
    </div>
  );
}
