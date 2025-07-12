import { fireEvent, screen } from "@testing-library/react";
import { vi } from "vitest";
import { Table } from "../../components/Table";
import { mockURLList, renderWithProviders } from "../utils";

describe("Table", () => {
  const defaultProps = {
    data: mockURLList,
    selected: [],
    setSelected: vi.fn(),
    onRowClick: vi.fn(),
    page: 1,
    setPage: vi.fn(),
    size: 10,
    total: 2,
    loading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders table headers correctly", () => {
    renderWithProviders(<Table {...defaultProps} />);

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("URL")).toBeInTheDocument();
    expect(screen.getByText("HTML Version")).toBeInTheDocument();
    expect(screen.getByText("#Internal")).toBeInTheDocument();
    expect(screen.getByText("#External")).toBeInTheDocument();
    expect(screen.getByText("#Broken")).toBeInTheDocument();
    expect(screen.getByText("Login Form")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("renders table data correctly", () => {
    renderWithProviders(<Table {...defaultProps} />);

    expect(screen.getByText("Example Site")).toBeInTheDocument();
    expect(screen.getByText("Example Site 2")).toBeInTheDocument();
    expect(screen.getAllByText("HTML5")[0]).toBeInTheDocument();
    expect(screen.getAllByText("10")[0]).toBeInTheDocument();
    expect(screen.getAllByText("5")[0]).toBeInTheDocument();
    expect(screen.getAllByText("2")[0]).toBeInTheDocument();
  });

  it("handles row selection correctly", () => {
    const setSelectedMock = vi.fn();
    renderWithProviders(
      <Table {...defaultProps} setSelected={setSelectedMock} />
    );

    const checkboxes = screen.getAllByRole("checkbox");
    const firstRowCheckbox = checkboxes[1]; // Skip header checkbox

    fireEvent.click(firstRowCheckbox);

    expect(setSelectedMock).toHaveBeenCalledWith([1]);
  });

  it("handles select all functionality", () => {
    const setSelectedMock = vi.fn();
    renderWithProviders(
      <Table {...defaultProps} setSelected={setSelectedMock} />
    );

    const headerCheckbox = screen.getAllByRole("checkbox")[0];
    fireEvent.click(headerCheckbox);

    expect(setSelectedMock).toHaveBeenCalledWith([1, 2]);
  });

  it("handles row click events", () => {
    const onRowClickMock = vi.fn();
    renderWithProviders(
      <Table {...defaultProps} onRowClick={onRowClickMock} />
    );

    const firstRow = screen.getByText("Example Site").closest("tr");
    fireEvent.click(firstRow!);

    expect(onRowClickMock).toHaveBeenCalledWith(1);
  });

  it("prevents row click when checkbox is clicked", () => {
    const onRowClickMock = vi.fn();
    renderWithProviders(
      <Table {...defaultProps} onRowClick={onRowClickMock} />
    );

    const checkboxes = screen.getAllByRole("checkbox");
    const firstRowCheckbox = checkboxes[1];

    fireEvent.click(firstRowCheckbox);

    expect(onRowClickMock).not.toHaveBeenCalled();
  });

  it("displays loading state correctly", () => {
    renderWithProviders(<Table {...defaultProps} loading={true} />);

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("displays no data message when empty", () => {
    renderWithProviders(<Table {...defaultProps} data={[]} />);

    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  it("handles pagination correctly", () => {
    const setPageMock = vi.fn();
    renderWithProviders(
      <Table {...defaultProps} setPage={setPageMock} total={20} />
    );

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    expect(setPageMock).toHaveBeenCalledWith(2);
  });

  it("disables pagination buttons correctly", () => {
    renderWithProviders(<Table {...defaultProps} page={1} total={10} />);

    const prevButton = screen.getByText("Prev");
    expect(prevButton).toBeDisabled();
  });

  it("displays correct page information", () => {
    renderWithProviders(
      <Table {...defaultProps} page={1} total={20} size={10} />
    );

    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
  });

  it("truncates long URLs correctly", () => {
    const longURLData = [
      {
        ...mockURLList[0],
        address:
          "https://very-long-url-that-should-be-truncated-in-the-display.com/with/many/path/segments",
      },
    ];

    renderWithProviders(<Table {...defaultProps} data={longURLData} />);

    expect(
      screen.getByText("https://very-long-url-that-should-be-tru...")
    ).toBeInTheDocument();
  });

  it("displays status with correct styling", () => {
    renderWithProviders(<Table {...defaultProps} />);

    const doneStatus = screen.getByText("Done");
    expect(doneStatus).toHaveClass("text-green-600");

    const runningStatus = screen.getByText("Running");
    expect(runningStatus).toHaveClass("text-yellow-600");
  });

  it("displays login form status correctly", () => {
    renderWithProviders(<Table {...defaultProps} />);

    const yesTexts = screen.getAllByText("Yes");
    expect(yesTexts[0]).toHaveClass("text-green-600");
  });

  it("handles deselection correctly", () => {
    const setSelectedMock = vi.fn();
    renderWithProviders(
      <Table {...defaultProps} selected={[1]} setSelected={setSelectedMock} />
    );

    const checkboxes = screen.getAllByRole("checkbox");
    const firstRowCheckbox = checkboxes[1];

    fireEvent.click(firstRowCheckbox);

    expect(setSelectedMock).toHaveBeenCalledWith([]);
  });
});
