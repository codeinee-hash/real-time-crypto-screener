'use client'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui-kit/pagination'
import { useRouter } from 'next/navigation'
import { buildPageNumbers, ELLIPSIS } from '@/utils/helpers'
import { cn } from '@/lib/css'

export function CoinsPagination({ currentPage, totalPages, hasMorePages }: Pagination) {
  const router = useRouter()

  const handlePageChange = (page: number) => router.push(`/coins?page=${page}`)

  const pageNumbers = buildPageNumbers(currentPage, totalPages)
  const isLastPage = !hasMorePages || currentPage === totalPages

  const handlePreviousClick = () => currentPage > 1 && handlePageChange(currentPage - 1)
  const handleNextClick = () => !isLastPage && handlePageChange(currentPage + 1)

  return (
    <Pagination id="coins-pagination">
      <PaginationContent className="pagination-content">
        <PaginationItem className="pagination-control prev">
          <PaginationPrevious
            onClick={handlePreviousClick}
            aria-disabled={currentPage === 1}
            tabIndex={currentPage === 1 ? -1 : undefined}
            className={currentPage === 1 ? 'control-disabled' : 'control-button'}
          />
        </PaginationItem>

        <div className="pagination-pages">
          {pageNumbers.map((page, idx) => (
            <PaginationItem key={idx}>
              {page === ELLIPSIS ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  className={cn('page-link', {
                    'page-link-active': currentPage === page,
                  })}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
        </div>

        <PaginationItem className="pagination-control next">
          <PaginationNext
            onClick={handleNextClick}
            aria-disabled={isLastPage}
            tabIndex={isLastPage ? -1 : undefined}
            className={isLastPage ? 'control-disabled' : 'control-button'}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
