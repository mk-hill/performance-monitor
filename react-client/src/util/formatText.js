export function formatBytes(bytes, decimalPoints = 2) {
  if (!bytes) return '0 Bytes';
  const mult = 1024,
    labels = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    f = Math.floor(Math.log(bytes) / Math.log(mult));
  return (
    parseFloat((bytes / Math.pow(mult, f)).toFixed(decimalPoints)) +
    ' ' +
    labels[f]
  );
}

export function formatSeconds(seconds) {
  const date = new Date(null);
  date.setSeconds(seconds);
  return date.toISOString().slice(11, -5);
}
