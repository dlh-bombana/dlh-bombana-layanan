import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const FormLayanan = () => {
  const [jenisLayanan, setJenisLayanan] = useState('Pengaduan');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama_pemohon: '', identitas: '', alamat: '', nomor_hp: '',
    detail: {}
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
      const { data: mainData, error: mainError } = await supabase
        .from('pelayanan_main')
        .insert([{
          nama_pemohon: formData.nama_pemohon,
          identitas_pendukung: formData.identitas,
          alamat: formData.alamat,
          nomor_hp: formData.nomor_hp,
          jenis_layanan: jenisLayanan
        }])
        .select().single();

      if (mainError) throw mainError;

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
      alert(`Berhasil! Nomor Register Anda: ${mainData.nomor_register}`);
    } catch (error) {
      alert("Terjadi kesalahan: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">FORMULIR LAYANAN DIGITAL</h2>
        <p className="text-gray-500">Dinas Lingkungan Hidup Kabupaten Bombana</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <h3 className="font-semibold text-green-700">A. Identitas Pemohon</h3>
          <input name="nama_pemohon" placeholder="Nama Lengkap" onChange={handleInputChange} required />
          <input name="identitas" placeholder="NIK / Instansi" onChange={handleInputChange} required />
          <input name="alamat" placeholder="Alamat Lengkap" onChange={handleInputChange} required />
          <input name="nomor_hp" placeholder="Nomor HP/WhatsApp" onChange={handleInputChange} required />
          <select onChange={(e) => setJenisLayanan(e.target.value)} className="font-bold border-2 border-green-200">
            <option value="Pengaduan">FORM 1: Pengaduan Lingkungan</option>
            <option value="Persampahan">FORM 2: Pelayanan Persampahan</option>
            <option value="Konsultasi">FORM 3: Konsultasi/Persetujuan Lingkungan</option>
            <option value="Pohon/RTH">FORM 4: Penanganan Pohon/RTH</option>
            <option value="Edukasi">FORM 5: Informasi/Edukasi Lingkungan</option>
          </select>
        </div>

        <div className="bg-green-50 p-4 rounded-lg space-y-4">
          <h3 className="font-semibold text-green-700">B. Detail Permohonan</h3>
          
          {jenisLayanan === 'Pengaduan' && (
            <>
              <input name="jenis_pengaduan" placeholder="Jenis Pengaduan (Pencemaran, Limbah, dll)" onChange={handleInputChange} />
              <input name="lokasi_kejadian" placeholder="Lokasi Kejadian" onChange={handleInputChange} />
              <input type="date" name="tanggal_kejadian" onChange={handleInputChange} />
              <textarea name="uraian_singkat" placeholder="Uraian singkat pengaduan..." onChange={handleInputChange} rows="3" />
            </>
          )}

          {jenisLayanan === 'Persampahan' && (
            <>
              <select name="sub_jenis" onChange={handleInputChange}>
                <option value="">-- Pilih Jenis Layanan --</option>
                <option value="Rutin">Pengangkutan Rutin</option>
                <option value="Event">Pengangkutan Acara/Kegiatan</option>
                <option value="TPS">Permohonan TPS</option>
                <option value="Bank Sampah">Pembinaan Bank Sampah</option>
              </select>
              <input name="lokasi_pelayanan" placeholder="Lokasi Pelayanan" onChange={handleInputChange} />
              <input name="volume_perkiraan" placeholder="Volume Perkiraan Sampah" onChange={handleInputChange} />
            </>
          )}

          {jenisLayanan === 'Konsultasi' && (
            <>
              <input name="nama_usaha" placeholder="Nama Usaha / Kegiatan" onChange={handleInputChange} />
              <input name="alamat_usaha" placeholder="Alamat Usaha" onChange={handleInputChange} />
              <select name="jenis_layanan_konsultasi" onChange={handleInputChange}>
                <option value="SPPL">Konsultasi SPPL</option>
                <option value="UKL-UPL">Konsultasi UKL-UPL</option>
                <option value="Rekomendasi">Rekomendasi Lingkungan</option>
              </select>
              <textarea name="uraian_kegiatan" placeholder="Uraian singkat kegiatan..." onChange={handleInputChange} />
            </>
          )}

          {jenisLayanan === 'Pohon/RTH' && (
            <>
              <select name="jenis_permohonan_pohon" onChange={handleInputChange}>
                <option value="Pemangkasan">Pemangkasan Pohon</option>
                <option value="Penebangan">Penebangan Pohon</option>
                <option value="Rawan Tumbang">Laporan Pohon Rawan Tumbang</option>
              </select>
              <input name="lokasi_area" placeholder="Lokasi Pohon / Area RTH" onChange={handleInputChange} />
              <input type="number" name="jumlah_pohon" placeholder="Jumlah Pohon" onChange={handleInputChange} />
              <textarea name="alasan_permohonan" placeholder="Kondisi / Alasan..." onChange={handleInputChange} />
            </>
          )}

          {jenisLayanan === 'Edukasi' && (
            <>
              <input name="tempat_kegiatan" placeholder="Tempat Kegiatan" onChange={handleInputChange} />
              <input type="date" name="tanggal_pelaksanaan" onChange={handleInputChange} />
              <input type="number" name="jumlah_peserta" placeholder="Jumlah Peserta" onChange={handleInputChange} />
              <textarea name="materi_dimohonkan" placeholder="Materi yang dimohonkan..." onChange={handleInputChange} />
            </>
          )}
        </div>

        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white font-bold py-4 rounded-lg shadow-md hover:bg-green-700 transition duration-200">
          {loading ? 'Memproses...' : 'KIRIM PERMOHONAN SEKARANG'}
        </button>
      </form>
    </div>
  );
};

export default FormLayanan;
                  
