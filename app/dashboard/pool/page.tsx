import Pagination from "@/app/ui/pool/pagination";
import Search from "@/app/ui/search";
import Table from "@/app/ui/pool/table";
import { CreatePool } from "@/app/ui/pool/buttons";
import { lusitana } from "@/app/ui/fonts";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import { fetchPools } from "@/app/lib/data";
import PoolTable from "@/app/ui/pool/table";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Pools</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search pools..." />
        <CreatePool />
      </div>
      <Suspense fallback={<InvoicesTableSkeleton />}>
        <PoolTable />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        {/* <Pagination totalPages={totalPages} /> */}
      </div>
    </div>
  );
}
