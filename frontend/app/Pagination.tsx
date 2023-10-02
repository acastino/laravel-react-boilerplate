import PaginationClues from "@models/PaginationClues";
import { useEffect, useState } from "react";

const Pagination = ({
  clues: { currentPage, lastPage, perPage, total },
  onChange,
}: {
  clues: PaginationClues;
  onChange: (chosenPageNum: number) => void;
}) => {
  const [isDisabled, setIsDisabled] = useState(true);
  useEffect(() => {
    setIsDisabled(total <= 0);
  }, [total]);

  const pageNumChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(parseInt(event.target.value));
  };

  const goLaterToPageNum = (targetPage: number) => {
    return () => {
      onChange(targetPage);
    };
  };
  return (
    <div>
      <fieldset style={{ border: 0 }} disabled={isDisabled}>
        <button
          disabled={currentPage <= 1}
          onClick={goLaterToPageNum(currentPage - 1)}
        >
          Previous
        </button>
        &nbsp;
        <select
          style={{ width: 75 }}
          disabled={lastPage <= 1}
          onChange={pageNumChanged}
          value={currentPage}
        >
          {lastPage &&
            Array.from({ length: lastPage }, (x, i) => i).map((count) => (
              <option key={count} value={count + 1}>
                {count + 1}
              </option>
            ))}
        </select>
        &nbsp;
        <button
          disabled={currentPage >= lastPage}
          onClick={goLaterToPageNum(currentPage + 1)}
        >
          Next
        </button>
      </fieldset>
    </div>
  );
};

export default Pagination;
