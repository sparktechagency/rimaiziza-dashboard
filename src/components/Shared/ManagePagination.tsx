import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const ManagePagination = ({ meta }: any) => {
  const navigate = useNavigate();
  const location = useLocation();
  

  const currentPage = meta?.page;
  const totalPage = meta?.totalPage;

  const updatePage = (page: number) => {
    if (page < 1 || page > totalPage) return;

    const params = new URLSearchParams(location.search);
    params.set("page", page.toString());
    params.set("limit", meta.limit.toString());

    navigate(`?${params.toString()}`);
  };

  return (
    <div className={`${!totalPage ? "hidden" : "flex"} items-center justify-center w-full p-4`}>
      <div className="flex items-center space-x-2 md:space-x-4">

        {/* Prev */}
        <button
          disabled={currentPage === 1 || totalPage === 1}
          onClick={() => updatePage(currentPage - 1)}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft />
        </button>

        {/* Pages */}
        {Array.from({ length: totalPage }).map((_, i) => {
          const page = i + 1;
          const isActive = page === currentPage;

          return (
            <button
              key={page}
              disabled={totalPage === 1}
              onClick={() => updatePage(page)}
              className={`flex items-center justify-center w-12 h-12 rounded-full
                ${
                  isActive
                    ? "bg-primary! text-white"
                    : "border border-primary! text-primary!"
                }
                ${totalPage === 1 ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              {page}
            </button>
          );
        })}

        {/* Next */}
        <button
          disabled={currentPage === totalPage || totalPage === 1}
          onClick={() => updatePage(currentPage + 1)}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight />
        </button>

      </div>
    </div>
  );
};

export default ManagePagination;