import { formatDateToLocal, formatCurrency } from "@/app/lib/utils";
import { fetchPools } from "@/app/lib/data";
import { Fencer } from "@prisma/client";
import { DeletePool, UpdatePool } from "./buttons";
import PDFGenerator from "@/app/components/PDFGenerator";
import { PoolDoc } from "../lib/definitions";

export default async function PoolTable() {
  const pools = await fetchPools();
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {pools?.map((pool, index) => {
              const data = pool;
              return (
                <div
                  key={pool.id}
                  className="mb-2 w-full rounded-md bg-white p-4"
                >
                  <div className="flex w-full items-center justify-between pt-4">
                    <div className="flex items-center gap-3">
                      <p>{pool.name}</p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <UpdatePool id={data.id} />
                      <DeletePool id={data.id} />
                      <PDFGenerator pool={data} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Name of Pool
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Fencers
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th
                  scope="col"
                  className="relative pb-4 pl-3 pr-6 pt-2 sm:pr-6"
                >
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {pools?.map((pool) => (
                <tr
                  key={pool.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{pool.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3"></td>
                  <td className="whitespace-nowrap px-3 py-3"></td>
                  <td className="whitespace-nowrap px-3 py-3"></td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdatePool id={pool.id} />
                      <DeletePool id={pool.id} />
                      <PDFGenerator pool={pool} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
