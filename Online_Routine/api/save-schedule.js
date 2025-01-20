import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method === "POST") {
    const filePath = path.join(process.cwd(), "globalStatus.json");
    const newSchedule = req.body;

    fs.writeFileSync(filePath, JSON.stringify(newSchedule, null, 2));

    return res.status(200).json({ message: "Schedule updated successfully!" });
  }

  res.status(405).json({ message: "Method not allowed" });
}
