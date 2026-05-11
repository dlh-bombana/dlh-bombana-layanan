import React from 'react';

const TandaTerima = ({ data }) => {
  if (!data) return null;
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-8 bg-white border-2 border-dashed border-gray-400 max-w-xl mx-auto my-4 text-sm" id="printable-area">
      <div className="text-center border-b-2 border-black pb-4 mb-4">
        <h2 className="font-bold text-lg uppercase">Pemerintah Kabupaten Bombana</h2>
        <h1 className="font-extrabold text-xl uppercase">Dinas Lingkungan Hidup</h1>
        <p>Tanda Terima Berkas Digital</p>
      </div>
      
      <div className="space-y-2 mb-6">
        <p><strong>Nomor Register:</strong> {data.nomor_register}</p>
        <p><strong>Nama Pemohon:</strong> {data.nama_pemohon}</p>
        <p><strong>Jenis Layanan:</strong> {data.jenis_layanan}</p>
        <p><strong>Tanggal Masuk:</strong> {new Date(data.tanggal_masuk).toLocaleString('id-ID')}</p>
      </div>

      <p className="mb-8 text-xs italic">*Simpan tanda terima ini sebagai bukti permohonan Anda.</p>
      
      <button onClick={handlePrint} className="no-print bg-blue-500 text-white px-4 py-2 rounded">
        Cetak Tanda Terima
      </button>
    </div>
  );
};

export default TandaTerima;

