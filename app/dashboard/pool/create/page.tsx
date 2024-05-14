"use client";

import { Button } from "@/app/ui/button";
import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import { createPool } from "@/app/lib/actions";

export default function Page() {
  const [numFencers, setNumFencers] = useState<number>(0);
  const [names, setNames] = useState<string[]>([]);

  const handleNumFencers = (e: ChangeEvent<HTMLInputElement>) => {
    const newCount = parseInt(e.target.value, 10);
    setNumFencers(newCount || 0);
    if (parseInt(e.target.value) < 0) return 0;
    setNames(new Array(newCount || 0).fill(""));
  };

  const handleFencers = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const updatedNames = [...names];
    updatedNames[index] = e.target.value;
    setNames(updatedNames);
  };

  return (
    <form
      action={createPool}
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full md:w-4/6"
    >
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Título de la pool:
          <input
            id="titlePool"
            name="titlePool"
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Número de tiradores:
          <input
            type="number"
            id="numFencers"
            name="numFencers"
            value={numFencers}
            onChange={handleNumFencers}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </label>
      </div>

      {names.map((nombre, index) => (
        <div key={index} className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Nombre del tirador {index + 1}:
            <input
              type="text"
              id="fencers"
              name="fencers[]"
              value={nombre}
              onChange={(e) => handleFencers(index, e)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </label>
        </div>
      ))}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/pool"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Pool</Button>
      </div>
    </form>
  );
}
