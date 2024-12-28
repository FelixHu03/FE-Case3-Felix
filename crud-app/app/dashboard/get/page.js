"use client";
import axios from "axios";
import { useEffect, useState } from "react";

async function getUser() {
    try {
        const res = await axios.get('http://127.0.0.1:8000/api/journals');
        console.log('API Response:', res.data);
        // Extract the nested data properly
        const users = res?.data?.data?.map(item => item.data) || [];
        console.log('Processed users:', users);
        return users;
    } catch (error) {
        console.error('Error fetching user data:', error);
        return [];
    }
}

const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    return dateString.split(' ')[0];
};

const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

const postPendaftaran = async (formData) => {
    try {
        const formattedData = {
            ...formData,
            tanggalBuat: `${formData.tanggalBuat} 00:00:00`
        };
        await axios.post('http://127.0.0.1:8000/api/journals', formattedData);
        return { success: true, message: "Data berhasil Dimasukkan" };
    } catch (error) {
        console.error("Error during form submission: ", error);
        return {
            success: false,
            message: "Terjadi Kesalahan Dalam Mengirim Data, Harap Di Cek Kembali!!!"
        };
    }
};

const deleteUser = async (id) => {
    try {
        await axios.delete(`http://127.0.0.1:8000/api/journals/${id}`);
        return { success: true, message: "Data berhasil dihapus" };
    } catch (error) {
        console.error("Error deleting user: ", error);
        return { success: false, message: "Gagal menghapus data" };
    }
};

const updateUser = async (id, updatedData) => {
    try {
        const formattedData = {
            ...updatedData,
            tanggalBuat: `${updatedData.tanggalBuat} 00:00:00`
        };
        await axios.put(`http://127.0.0.1:8000/api/journals/${id}`, formattedData);
        return { success: true, message: "Data berhasil diperbarui" };
    } catch (error) {
        console.error("Error updating user: ", error);
        return { success: false, message: "Gagal memperbarui data" };
    }
};

export default function Page() {
    // Declare all necessary states
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        judul: '',
        pembuat: '',
        isi: '',
        tema: '',
        tanggalBuat: formatDateForInput(new Date().toISOString())
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const userData = await getUser();
            setUsers(userData);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await postPendaftaran(formData);
        setMessage(res.message);
        if (res.success) {
            setFormData({
                judul: '',
                pembuat: '',
                isi: '',
                tema: '',
                tanggalBuat: formatDateForInput(new Date().toISOString())
            });
            fetchData();
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            const res = await deleteUser(id);
            setMessage(res.message);
            if (res.success) {
                fetchData();
            }
        }
    };

    const handleUpdate = async (id) => {
        const res = await updateUser(id, formData);
        setMessage(res.message);
        if (res.success) {
            setEditingId(null);
            setFormData({
                judul: '',
                pembuat: '',
                isi: '',
                tema: '',
                tanggalBuat: formatDateForInput(new Date().toISOString())
            });
            fetchData();
        }
    };

    const handleEdit = (user) => {
        setEditingId(user.id);
        setFormData({
            judul: user.judul,
            pembuat: user.pembuat,
            isi: user.isi,
            tema: user.tema,
            tanggalBuat: formatDateForInput(user.tanggalBuat)
        });
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="container mx-auto mt-8 px-4">
            {message && (
                <div className={`p-4 mb-4 rounded ${message.includes("berhasil") 
                    ? "bg-green-100 text-green-700" 
                    : "bg-red-100 text-red-700"}`}>
                    {message}
                </div>
            )}

            {error && (
                <div className="bg-red-100 text-red-700 p-4 mb-4 rounded">
                    Error: {error}
                </div>
            )}

            {isLoading ? (
                <p className="text-center">Loading...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-black shadow-md rounded-lg">
                        <thead>
                            <tr>
                                <th className="border p-3 bg-black">Id</th>
                                <th className="border p-3 bg-black">Judul</th>
                                <th className="border p-3 bg-black">Tema</th>
                                <th className="border p-3 bg-black">Pembuat</th>
                                <th className="border p-3 bg-black">Isi</th>
                                <th className="border p-3 bg-black">Tanggal Buat</th>
                                <th className="border p-3 bg-black">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(users) && users.map((user) => (
                                <tr key={user.id}>
                                    <td className="border p-3">{user.id}</td>
                                    <td className="border p-3">{user.judul}</td>
                                    <td className="border p-3">{user.tema}</td>
                                    <td className="border p-3">{user.pembuat}</td>
                                    <td className="border p-3">{user.isi}</td>
                                    <td className="border p-3">{formatDateForDisplay(user.tanggalBuat)}</td>
                                    <td className="border p-3">
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 mr-2"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => handleEdit(user)}
                                            className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-6">
                    {editingId ? 'Edit Journal' : 'Tambah Journal Baru'}
                </h2>
                <form onSubmit={editingId ? (e) => {
                    e.preventDefault();
                    handleUpdate(editingId);
                } : handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-2">Judul:</label>
                        <input
                            type="text"
                            name="judul"
                            value={formData.judul}
                            onChange={handleChange}
                            className="w-full p-2 border rounded text-black"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Pembuat:</label>
                        <input
                            type="text"
                            name="pembuat"
                            value={formData.pembuat}
                            onChange={handleChange}
                            className="w-full p-2 border rounded text-black"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Isi:</label>
                        <textarea
                            name="isi"
                            value={formData.isi}
                            onChange={handleChange}
                            className="w-full p-2 border rounded text-black"
                            required
                            rows="4"
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Tema:</label>
                        <input
                            type="text"
                            name="tema"
                            value={formData.tema}
                            onChange={handleChange}
                            className="w-full p-2 border rounded text-black"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Tanggal:</label>
                        <input
                            type="date"
                            name="tanggalBuat"
                            value={formData.tanggalBuat}
                            onChange={handleChange}
                            className="w-full p-2 border rounded text-black"
                            required
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            {editingId ? 'Update' : 'Submit'}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingId(null);
                                    setFormData({
                                        judul: '',
                                        pembuat: '',
                                        isi: '',
                                        tema: '',
                                        tanggalBuat: formatDateForInput(new Date().toISOString())
                                    });
                                }}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}