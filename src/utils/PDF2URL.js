export function getPDFUrlFromLocalStorage(key) {
  // Get the PDF file from localStorage
  let pdfFile = localStorage.getItem(key);

  // Convert the PDF file to a Blob object
  let blob = new Blob([pdfFile], { type: "application/pdf" });

  // Create a URL for the Blob object
  let url = URL.createObjectURL(blob);

  return url;
}

