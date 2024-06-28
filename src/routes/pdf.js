
import { Router } from "express";
import { generatePDF } from "../utils/pdfGenerator.js";

const router = Router();

router.get("/invoice", (req, res) => {
  const stream = res.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": "attachment; filename=invoice.pdf",
  });

  generatePDF(
    (data) => stream.write(data),
    () => stream.end()
  );
});

export default router