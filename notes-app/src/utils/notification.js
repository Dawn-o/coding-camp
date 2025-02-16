export const showError = async message => {
  await Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: message,
    confirmButtonColor: '#3085d6',
  });
};

export const showSuccess = async message => {
  await Swal.fire({
    icon: 'success',
    title: 'Berhasil!',
    text: message,
    timer: 1500,
    showConfirmButton: false,
  });
};

export const showConfirm = async message => {
  const result = await Swal.fire({
    icon: 'warning',
    title: 'Konfirmasi',
    text: message,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Ya',
    cancelButtonText: 'Batal',
  });
  return result.isConfirmed;
};
