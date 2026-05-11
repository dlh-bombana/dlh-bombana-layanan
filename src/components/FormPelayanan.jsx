import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const FormPelayanan = () => {
  const [jenisLayanan, setJenisLayanan] = useState('Pengaduan');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama_pemohon: '', identitas: '', alamat: '', nomor_hp: '',
    detail: {} // Data spesifik tiap formulir
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (['nama_pemohon', 'identitas', 'alamat', 'nomor_hp'].includes(name)) {
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({
        ...formData,
        detail: { ...formData.detail, [name]: value }
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Insert ke Tabel Utama (Register)
      const { data: mainData, error: mainError } = await supabase
        .from('pelayanan_main')
        .insert([{
          nama_pemohon: formData.nama_pemohon,
          identitas_pendukung: formData.identitas,
          alamat: formData.alamat,
          nomor_hp: formData.nomor_hp,
          jenis_layanan: jenisLayanan
        }])
        .select()
        .single();

      if (mainError) throw mainError;

      // 2. Insert ke Tabel Detail sesuai Jenis Layanan
      const tableMap = {
        'Pengaduan': 'detail_pengaduan',
        'Persampahan': 'detail_persampahan',
        'Konsultasi': 'detail_konsultasi',
        'Pohon/RTH': 'detail_pohon_rth',
        'Edukasi': 'detail_edukasi'
      };

      const { error: detailError } = await supabase
        .from(tableMap[jenisLayanan])
        .insert([{ main_id: mainData.id, ...formData.detail }]);

      if (detailError) throw detailError;

      alert('Permohonan berhasil dikirim dengan Nomor Register: ' + mainData.nomor_register);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">LAYANAN DLH KABUPATEN BOMBANA</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Identitas Umum */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="nama_pemohon" placeholder="Nama Lengkap" onChange={handleInputChange} className="border p-2 rounded" required />
          <input name="identitas" placeholder="NIK / Nama Instansi" onChange={handleInputChange} className="border p-2 rounded" required />
          <input name="nomor_hp" placeholder="Nomor HP/WA" onChange={handleInputChange} className="border p-2 rounded" required />
          <select onChange={(e) => setJenisLayanan(e.target.value)} className="border p-2 rounded bg-gray-50 font-bold">
            <option value="Pengaduan">FORM 1: Pengaduan Lingkungan</option>
            <option value="Persampahan">FORM 2: Pelayanan Persampahan</option>
            <option value="Konsultasi">FORM 3: Konsultasi/Persetujuan Lingkungan</option>
            <option value="Pohon/RTH">FORM 4: Penanganan Pohon/RTH</option>
            <option value="Edukasi">FORM 5: Informasi/Edukasi</option>
          </select>
        </div>

        <hr />

        {/* Input Dinamis Berdasarkan Jenis Layanan */}
        <div className="space-y-3 bg-blue-50 p-4 rounded">
          {jenisLayanan === 'Pengaduan' && (
            <>
              <input name="jenis_pengaduan" placeholder="Jenis Pengaduan" onChange={handleInputChange} className="w-full border p-2 rounded" />
              <input name="lokasi_kejadian" placeholder="Lokasi Kejadian" onChange={handleInputChange} className="w-full border p-2 rounded" />
              <textarea name="uraian_singkat" placeholder="Uraian Singkat" onChange={handleInputChange} className="w-full border p-2 rounded" />
            </>
          )}

          {jenisLayanan === 'Persampahan' && (
            <>
              <select name="sub_jenis_layanan" onChange={handleInputChange} className="w-full border p-2 rounded">
                <option>-- Pilih Layanan --</option>
                <option value="Rutin">Pengangkutan Rutin</option>
                <option value="Acara">Pengangkutan Acara/Kegiatan</option>
                <option value="TPS">Fasilitas TPS</option>
              </select>
              <input name="lokasi_pelayanan" placeholder="Lokasi Pelayanan" onChange={handleInputChange} className="w-full border p-2 rounded" />
              <input name="volume_perkiraan" placeholder="Volume Sampah (m3)" onChange={handleInputChange} className="w-full border p-2 rounded" />
            </>
          )}

          {/* Form 3, 4, 5 dapat ditambahkan polanya di sini sesuai kebutuhan */}
        </div>

        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 font-bold">
          {loading ? 'Mengirim...' : 'KIRIM PERMOHONAN'}
        </button>
      </form>
    </div>
  );
};

export default FormPelayanan;

