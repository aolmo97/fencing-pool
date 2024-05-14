import Form from "@/app/ui/pool/edit-form";
import Breadcrumbs from "@/app/ui/pool/breadcrumbs";
import { fetchPoolById } from "@/app/lib/data";

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  //   const [pool, fencers] = await Promise.all([
  //     fetchInvoiceById(id),
  //     fetchCustomers(),
  //   ]);
  const [pool] = await Promise.all([fetchPoolById(id)]);
  // ...
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Invoices", href: "/dashboard/invoices" },
          {
            label: "Edit Invoice",
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      {/* <Form pool={pool} /> */}
    </main>
  );
}
