import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AdminRegister = () => {
  const [dataLayanan, setDataLayanan] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [disposisi, setDisposisi] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const { data } = await supabase.from('pelayanan_main').select('*').order('created_at', { ascending: false });
    setDataLayanan(data);
  };

  const updateStatus = async (id, status) => {
    await supabase.from('pelayanan_main').update({ status_pelayanan: status }).eq('id', id);
    fetchData();
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-6 border-b pb-2">Buku Register Pelayanan (Admin)</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-sm">
              <th className="p-3 border">No. Reg</th>
              <th className="p-3 border">Pemohon</th>
              <th className="p-3 border">Layanan</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dataLayanan.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-3 border font-mono font-bold text-blue-600">{item.nomor_register}</td>
                <td className="p-3 border">{item.nama_pemohon}</td>
                <td className="p-3 border">{item.jenis_layanan}</td>
                <td className="p-3 border">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${item.status_pelayanan === 'Selesai' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {item.status_pelayanan}
                  </span>
                </td>
                <td className="p-3 border flex gap-2">
                  <button onClick={() => updateStatus(item.id, 'Proses')} className="text-xs bg-blue-500 text-white px-2 py-1 rounded">Proses</button>
                  <button onClick={() => updateStatus(item.id, 'Selesai')} className="text-xs bg-green-500 text-white px-2 py-1 rounded">Selesai</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRegister;

