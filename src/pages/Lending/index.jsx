import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Case from "../../components/Case";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Stuff() {
    const [lendings, setStuffs] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const instance = axios.create({
        baseURL: 'http://localhost:8000/',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    });

    useEffect(() => {
        instance.get('lending')
            .then(res => {
                setStuffs(res.data.data);
            })
            .catch(err => {
                if (err.response && err.response.status === 401) {
                    navigate('/login?message=' + encodeURIComponent('Anda Belum Login!'));
                } else {
                    setError('Terjadi kesalahan saat memuat daftar barang.');
                }
            });
    }, [navigate]);
    
    const deleteStuff = (id) => {
        instance.delete(`lending/destroy/${id}`)
            .then(() => {
                setStuffs(lendings.filter(lending => lending.id !== id));
            })
            .catch(err => {
                setError(err.response.data.message);
            });
    };

    return (
        <Case>
            <div className="block w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div className="m-5 pb-10 pt-10">
                    <div className="flex justify-between">
                        <h5 className="mb-1 ml-5 text-3xl font-medium text-gray-900 dark:text-white">Lending</h5>
                        <button className="px-4 py-2 bg-teal-700 text-white shadow-md border-sky-500 rounded-lg">
                            <Link to="/lending/create">
                                <small className="text-white">Tambah</small>
                            </Link>
                            <FontAwesomeIcon icon="fa-solid fa-plus" className="pl-1 w-4 h-4 text-inherit" />
                        </button>
                    </div>
                    {error && (
                        <div role="alert">
                            <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                                Gagal!
                            </div>
                            <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                                {error}
                            </div>
                        </div>
                    )}
                    
                    <div className="flex mt-4 md:mt-6">
                        <table className="min-w-full text-left text-sm font-light">
                            <thead className="border-b font-medium dark:border-neutral-500 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-4">No</th>
                                    <th scope="col" className="px-6 py-4">Stuff ID</th>
                                    <th scope="col" className="px-6 py-4">Date Time</th>
                                    <th scope="col" className="px-6 py-4">Name</th>
                                    <th scope="col" className="px-6 py-4">User ID</th>
                                    <th scope="col" className="px-6 py-4">Notes</th>
                                    <th scope="col" className="px-6 py-4">Total Stuff</th>
                                    <th scope="col" className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                           <tbody>
    {lendings.map((lending, index) => (
        <tr key={lending.id} className="border-b dark:border-neutral-500">
            <td className="whitespace-nowrap px-6 py-4">{index + 1}</td>
            <td className="whitespace-nowrap px-6 py-4">{lending.id}</td>
            <td className="whitespace-nowrap px-6 py-4">{lending.date_time}</td>
            <td className="whitespace-nowrap px-6 py-4">{lending.name}</td>
            <td className="whitespace-nowrap px-6 py-4">{lending.user_id}</td>
            <td className="whitespace-nowrap px-6 py-4">{lending.notes}</td>
            <td className="whitespace-nowrap px-6 py-4">{lending.total_lending}</td>
            <td className="whitespace-nowrap px-6 py-4">
                <Link to={`/lending/edit/${lending.id}`}>
                    <button className="px-4 py-2 bg-orange-500 rounded-lg mr-2 font-bold text-white">Edit</button>
                </Link>
                <button onClick={() => deleteStuff(lending.id)} type="button" className="px-4 py-2 bg-red-500 rounded-lg font-bold text-white">Hapus</button>
            </td>
        </tr>
    ))}
</tbody>

                        </table>
                    </div>
                </div>
            </div>
        </Case>
    );
}
