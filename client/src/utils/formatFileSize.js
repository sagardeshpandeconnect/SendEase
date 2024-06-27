// utils/formatFileSize.js

function formatFileSize(fileSizeInBytes) {
  const fileSizeInKB = fileSizeInBytes / 1024;
  if (fileSizeInKB < 1024) {
    return `${fileSizeInKB.toFixed(2)} KB`;
  } else {
    const fileSizeInMB = fileSizeInKB / 1024;
    return `${fileSizeInMB.toFixed(2)} MB`;
  }
}

export default formatFileSize;
