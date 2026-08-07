const fileInput = document.getElementById("fileInput");

fileInput.addEventListener("change", function (event) {
  const file = event.target.files[0];

  if (!file) {
    console.log("No file selected");
    return;
  }

  const reader = new FileReader();

  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert sheet to array of arrays, so column A = index 0
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Extract column A values (skip header row if row 0 is a title like "Email")
    const emails = rows
      .slice(1) // remove this line if there's no header row
      .map(row => row[0])
      .filter(Boolean); // remove empty cells

    console.log("Emails from column A:", emails);
  };

  reader.readAsArrayBuffer(file);
});