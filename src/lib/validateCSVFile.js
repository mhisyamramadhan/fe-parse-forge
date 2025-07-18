export function validateCSVFile(file) {
    if (!file || !file.name.toLowerCase().endsWith('.csv')) {
      return { isValid: false, message: 'File Must be CSV Format (.csv)' };
    }
    return { isValid: true, message: '' };
};