import { PrismaClient } from "@prisma/client";
import { CustomersTableType, User } from "./definitions";
import { formatCurrency } from "./utils";

export async function fetchPools() {
  const prisma = new PrismaClient();

  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)
    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log("Fetching revenue data...");
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await prisma.pool.findMany(); // Fetch all revenue data

    // console.log('Data fetch completed after 3 seconds.');

    return data; // Remove .rows as Prisma returns the data directly
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  } finally {
    await prisma.$disconnect(); // Ensure the Prisma client is disconnected
  }
}
export async function fetchPoolById(id: string) {
  try {
    const prisma = new PrismaClient();
    const data = await prisma.pool.findMany({
      select: {
        id: true,
        name: true,
        date: true,
      },
      where: {
        id: id,
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch pool.");
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const prisma = new PrismaClient();

  try {
    const parsedAmount = parseInt(query, 10);
    const amountCondition = isNaN(parsedAmount)
      ? undefined
      : { equals: parsedAmount };

    const invoices = await prisma.invoices.findMany({
      where: {
        OR: [
          {
            customer: {
              name: {
                contains: query,
                mode: "insensitive", // Case-insensitive matching
              },
            },
          },
          {
            customer: {
              email: {
                contains: query,
                mode: "insensitive", // Case-insensitive matching
              },
            },
          },
          amountCondition ? { amount: amountCondition } : {},
          {
            status: {
              contains: query,
              mode: "insensitive", // Case-insensitive matching
            },
          },
        ],
      },
      orderBy: {
        date: "desc", // Order by date descending
      },
      take: ITEMS_PER_PAGE, // Limit the number of results
      skip: offset, // Offset for pagination
      include: {
        customer: true, // Join with customer to include related data
      },
    });
    return invoices;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoices.");
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchCustomers() {
  const prisma = new PrismaClient();

  try {
    const customers = await prisma.customers.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }); // Fetch all revenue data
    return customers; // Remove .rows as Prisma returns the data directly
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  } finally {
    await prisma.$disconnect(); // Ensure the Prisma client is disconnected
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch customer table.");
  }
}

export async function getUser(email: string) {
  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0] as User;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}
