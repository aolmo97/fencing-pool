import { formatDateToLocal, formatCurrency } from "@/app/lib/utils";
import { fetchPools } from "@/app/lib/data";
import { Fencer } from "@prisma/client";

export default async function PoolTable() {
  const pools = await fetchPools();

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {pools?.map((pool) => {
              const fencers = JSON.parse(pool.fencers);

              return (
                <div
                  key={pool.id}
                  className="mb-2 w-full rounded-md bg-white p-4"
                >
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="mb-2 flex items-center">
                        <p>{pool.name}</p>
                      </div>
                      <p className="text-sm text-gray-500">
                        {fencers.map((fencer: Fencer) => (
                          <div key={fencer.id}>{fencer.name}</div>
                        ))}
                      </p>
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between pt-4">
                    <div className="flex justify-end gap-2">
                      {/* Aquí puedes agregar botones u otras acciones */}
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
                  Pool name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Weapon
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Points
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th
                  scope="col"
                  className="relative pb-4 pl-3 pr-6 pt-2 sm:pr-6"
                >
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {pools?.map((pool) => {
                const fencers = JSON.parse(pool.fencers);
                return fencers.map((fencer: Fencer) => (
                  <tr key={fencer.id}>
                    <td className="px-4 py-5 sm:pl-6">{fencer.name}</td>
                    <td className="px-3 py-5">{fencer.weapon}</td>
                    <td className="px-3 py-5">{fencer.points}</td>
                    <td className="px-3 py-5">
                      {/* {formatDateToLocal(fencer.date)} */}
                    </td>
                    <td className="px-3 py-5">
                      {/* Aquí puedes agregar un botón de edición */}
                    </td>
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
