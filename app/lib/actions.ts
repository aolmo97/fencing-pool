"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { formatDateToLocal, getDateObject } from "./utils";
import { redirect } from "next/navigation";
import { log } from "console";

const FormSchema = z.object({
  titlePool: z.string().nonempty("Pool name is required"),
  fencers: z.array(z.string().nonempty("Fencer name is required")),
});
const CreatePool = FormSchema.omit({ id: true });

const UpdatePool = FormSchema.omit({ id: true });

export async function createPool(formData: FormData) {
  const namesFencers: string[] = [];
  formData.forEach((value, key) => {
    if (key === "fencers[]") {
      namesFencers.push(value as string);
    }
  });

  const { titlePool, fencers } = CreatePool.parse({
    titlePool: formData.get("titlePool") as string,
    fencers: namesFencers,
  });

  const date: Date = getDateObject("2024-05-03");

  const prisma = new PrismaClient();

  try {
    const pool = await prisma.pool.create({
      data: {
        name: titlePool,
        fencers: JSON.stringify(fencers),
      },
    });
    console.log("New Pool created:", pool);
  } catch (error) {
    console.error("Error creating pool:", error);
    throw new Error("Failed to create pool.");
  } finally {
    await prisma.$disconnect();
  }
  revalidatePath("/dashboard/pool");
  redirect("/dashboard/pool");
}
export async function updatePool(id: string, formData: FormData) {
  const prisma = new PrismaClient();

  const { titlePool, fencers } = UpdatePool.parse({
    titlePool: formData.get("titlePool") as string,
    fencers: namesFencers,
  });
  try {
    const updatePool = await prisma.pool.update({
      where: {
        id: id,
      },
      data: {
        name: titlePool,
        fencers: fencers,
      },
    });
    console.log("Update pool :", updatePool);
  } catch (error) {
    console.error("Error updating pool:", error);
    throw new Error("Failed to update pool.");
  } finally {
    await prisma.$disconnect();
  }
  revalidatePath("/dashboard/pool");
  redirect("/dashboard/pool");
}
// export async function deleteInvoice(id: string) {
//   const prisma = new PrismaClient();
//   try {
//     const deleteInvoice = await prisma.invoices.delete({
//       where: {
//         id: id,
//       },
//     });
//     console.log("delete invoice :", deleteInvoice);
//   } catch (error) {
//     console.error("Error updating invoice:", error);
//     throw new Error("Failed to update invoice.");
//   } finally {
//     await prisma.$disconnect();
//   }
//   revalidatePath("/dashboard/invoices");
// }
export async function deleteInvoice2(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath("/dashboard/invoices");
}
