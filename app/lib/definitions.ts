// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type Fencer = {
  id: string;
  name: string;
  weapon: string;
};

export type Pool = {
  id: string;
  name: string;
  date: string;
};
export type InvoicePool = {
  id: string;
  name: string;
};
export type PoolDoc = {
  id: string;
  name: string;
  fencers: string;
  createdAt: Date;
  updatedAt: Date;
};
