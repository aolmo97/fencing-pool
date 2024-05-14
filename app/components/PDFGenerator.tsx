"use client";

import { PDFDocument, rgb } from "pdf-lib";
import { PoolDoc } from "../lib/definitions";
import { DocumentIcon } from "@heroicons/react/24/outline";

const generatePDF = async ({ pool }) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 en orientación retrato
  const { width, height } = page.getSize();
  const fontSize = 12;
  const cellHeight = 20; // Altura de celda estándar

  // Obtener fencers
  const fencers = JSON.parse(pool.fencers || "[]");
  const numFencers = fencers.length;

  // Calcular el ancho necesario para la celda de nombres
  const maxNameLength = Math.max(...fencers.map((fencer) => fencer.length));
  const nameCellWidth = maxNameLength * fontSize * 0.6; // Ajustar el factor de multiplicación según sea necesario

  // Calcular el ancho de las celdas de resultados para ocupar todo el ancho de la página
  const remainingWidth = width - nameCellWidth - 100; // Restar márgenes y la celda de nombres
  const cellWidth = remainingWidth / (numFencers + 5); // Distribuir el ancho restante entre las celdas de resultados y adicionales

  // Título
  page.drawText("Pool Fencing Report", {
    x: 50,
    y: height - 40,
    size: 16,
    color: rgb(0, 0.53, 0.71),
  });

  // Información del torneo
  const infoY = height - 60;
  page.drawText(`Tournament Name: Unknown`, {
    x: 50,
    y: infoY,
    size: fontSize,
  });
  page.drawText(`Event Name: Unknown`, { x: 250, y: infoY, size: fontSize });
  page.drawText(`Pool Number: Unknown`, {
    x: 50,
    y: infoY - 15,
    size: fontSize,
  });
  page.drawText(`Referee: Unknown`, { x: 250, y: infoY - 15, size: fontSize });
  page.drawText(`Strip Number: Unknown`, {
    x: 50,
    y: infoY - 30,
    size: fontSize,
  });
  page.drawText(`Date: ${new Date().toLocaleDateString()}`, {
    x: 250,
    y: infoY - 30,
    size: fontSize,
  });

  // Dibujar la tabla
  const tableYStart = infoY - 60;

  // Encabezados dinámicos de columnas
  const headers = [
    "Name",
    ...Array.from({ length: numFencers }, (_, i) => (i + 1).toString()),
    "V",
    "TS",
    "TR",
    "Ind",
    "Pl",
  ];
  headers.forEach((header, i) => {
    const x = 50 + (i === 0 ? 0 : nameCellWidth + (i - 1) * cellWidth);
    const y = tableYStart;

    // Dibuja el texto del encabezado
    page.drawText(header || "", {
      x: x + 5, // Añadir un poco de margen dentro de la celda
      y: y - fontSize - 2,
      size: fontSize,
      color: rgb(0, 0, 0),
    });

    // Dibuja el borde de la celda
    page.drawRectangle({
      x,
      y: y - cellHeight,
      width: i === 0 ? nameCellWidth : cellWidth,
      height: cellHeight,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });
  });

  // Dibujar filas de datos

  fencers.forEach((fencer, rowIndex) => {
    const rowY = tableYStart - (rowIndex + 1) * cellHeight;

    // Dibuja el nombre del fencer
    page.drawText(fencer || "Unknown", {
      x: 50 + 5, // Añadir un poco de margen dentro de la celda
      y: rowY - fontSize - 2,
      size: fontSize,
      color: rgb(0, 0, 0),
    });

    // Dibuja el borde de la celda del nombre
    page.drawRectangle({
      x: 50,
      y: rowY - cellHeight,
      width: nameCellWidth,
      height: cellHeight,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });

    // Dibuja las celdas de resultados
    for (let colIndex = 0; colIndex < numFencers; colIndex++) {
      const x = 50 + nameCellWidth + colIndex * cellWidth;

      page.drawRectangle({
        x,
        y: rowY - cellHeight,
        width: cellWidth,
        height: cellHeight,
        color: rowIndex === colIndex ? rgb(0.75, 0.75, 0.75) : undefined, // Usar gris si es [i, i], de lo contrario sin color
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });
    }

    // Dibuja las celdas vacías para V, TS, TR, Ind, Pl
    const additionalColumns = ["V", "TS", "TR", "Ind", "Pl"];
    additionalColumns.forEach((_, index) => {
      const x = 50 + nameCellWidth + numFencers * cellWidth + index * cellWidth;

      // Dibuja el borde de cada celda adicional sin color de fondo
      page.drawRectangle({
        x,
        y: rowY - cellHeight,
        width: cellWidth,
        height: cellHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });
    });
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};

export default function PDFGenerator(pool) {
  const handleDownload = async () => {
    const pdfBytes = await generatePDF(pool);
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "pool-fencing-report.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleDownload}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <span className="sr-only">Download</span>
      <DocumentIcon className="w-4" />
    </button>
  );
}
