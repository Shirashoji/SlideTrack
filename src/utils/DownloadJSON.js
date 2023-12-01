export default function DownloadJSON(jsonData) {
  if (!jsonData || jsonData.length === 0) return null;
  const date = new Date(Date.now());
  const fileName = `record_${date.getFullYear()}${(
    "0" + String(date.getMonth() + 1)
  ).slice(-2)}${("0" + String(date.getDate())).slice(-2)}-${(
    "0" + String(date.getHours())
  ).slice(-2)}${("0" + String(date.getMinutes())).slice(-2)}${(
    "0" + String(date.getSeconds())
  ).slice(-2)}.json`;
  const blobData = new Blob([JSON.stringify(jsonData)], {
    type: "application/json",
  });
  const url = window.URL.createObjectURL(blobData);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
