import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AdminDashboard = () => {
  const [dataLayanan, setDataLayanan] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data } = await supabase
      .from('pelayanan_main')
      .select(`*, disposisi_internal(*)`)
      .order('nomor_register', { ascending: false });
    setDataLayanan(data);
  };

  return (
    <div className="p-4 overflow-x-auto">
      <h3 className="text-xl font-bold mb-4">BUKU REGISTER PELAYANAN DIGITAL</h3>
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">No. Reg</th>
            <th className="border p-2">Tanggal</th>
            <th className="border p-2">Pemohon</th>
            <th className="border p-2">Layanan</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {dataLayanan.map((item) => (
            <tr key={item.id} className="text-center">
              <td className="border p-2 font-mono">{item.nomor_register}</td>
              <td className="border p-2">{new Date(item.tanggal_masuk).toLocaleDateString('id-ID')}</td>
              <td className="border p-2 text-left">{item.nama_pemohon}</td>
              <td className="border p-2">{item.jenis_layanan}</td>
              <td className="border p-2 text-blue-600 font-semibold">{item.status_pelayanan}</td>
              <td className="border p-2">
                <button className="bg-blue-500 text-white px-2 py-1 rounded text-xs mr-1">Disposisi</button>
                <button className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">Cetak Tanda Terima</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;

