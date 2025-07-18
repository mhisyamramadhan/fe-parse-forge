export const processAndDownload = async ({ file, code }) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('code', code);

  const response = await fetch('https://csv-processor-backend-production.up.railway.app/process', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Gagal memproses file.');
  }

  const disposition = response.headers.get("Content-Disposition");
  let filename = "download.csv";
  const match = disposition?.match(/filename="?([^"]+)"?/);
  if (match?.[1]) filename = match[1];

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
