import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useState } from 'react'; // Add this import
import { useEffect } from 'react';


export default function ServiceForm({ auth, clients }) {

    const [formData, setFormData] = useState({
        service_type: '',
        passenger_number: '',
        passenger_names: [],
        domestic_international: '',
        oneway_roundway: '',
        from_location: '',
        to_location: '',
        departure_date: '',
        return_date: '',
        airline_name: '',
        name: '', // Add trade_name field
    });


    const { data, setData, post, processing, errors } = useForm(formData);

    useEffect(() => {
        // const savedFormData = JSON.parse(localStorage.getItem('formData'));
        if (window.location.href.includes('back')) {

            fetch(route('services.back'))
                .then(response => response.json())
                .then(function (r) {
                    // console.log(r.data) 
                    setData(r.data)
                })
            // setData(JSON.parse('{"service_type":"flight","passenger_number":"1","passenger_names":["ghjghj"],"domestic_international":"domestic","oneway_roundway":"oneway","from_location":"sadsad","to_location":"sadsad","departure_date":"2024-05-15","return_date":"","airline_name":"","name":"","trade_name":"Drew Boyle"}'));
        }
    }, []);


    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [message, setMessage] = useState('');
    const [selectedClient, setSelectedClient] = useState(0);
    const handleSubmit = async (e) => {
        e.preventDefault();
        localStorage.getItem('formData', {
            ...data,
            passenger_names: data.passenger_names, // Include passenger names in the request payload
        });


        post(route('services.store'), {
            data: {
                ...data,
                passenger_names: data.passenger_names, // Include passenger names in the request payload
            },
            onSuccess: () => {
                setShowSuccess(true);
                setMessage('Service Request submitted successfully');
                setTimeout(() => {
                    setShowSuccess(false);
                }, 5000);
                const tradeName = document.getElementById("trade_name").value;
                const serviceType = document.getElementById("service_type").value;
                setSelectedClient(tradeName);
                localStorage.setItem('selectedClient', tradeName);
                localStorage.setItem('selectedService', serviceType);
                window.location.href = '/quotation/form/fetch';

            },
            onError: (errors) => {
                setShowError(true);
                console.log(errors);
                setMessage('Unable to submit Service Request');
                setTimeout(() => {
                    setShowError(false);
                }, 5000);
            },
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Service Request Form" />
            {auth.user.role_id == 1 && (
                <nav style={{ marginBottom: '20px' }}>
                    <ul style={{ listStyle: 'none', paddingLeft: 120, margin: 0 }}>
                        <li style={{ display: 'inline', marginRight: '10px' }}>
                            <a href="/dashboard" style={{ textDecoration: 'none', color: 'black' }}>Home</a> /
                        </li>
                        <li style={{ display: 'inline', marginRight: '10px' }}>
                            <a href="/services/form" style={{ textDecoration: 'none', color: 'black' }}>Services Form</a> /
                        </li>
                        <li style={{ display: 'inline', marginRight: '10px' }}>
                            <a href="/quotation/form/fetch" style={{ textDecoration: 'none', color: 'black' }}>Quotation Form</a>
                        </li>
                    </ul>
                </nav>)}
            {auth.user.role_id == 1 && (

                <div className="flex justify-center items-center space-x-4">

                    <div className="flex items-center bg-green-500 px-4 py-2 rounded-xl">
                        <span className="text-sm text-white font-semibold ">Step 1</span>
                    </div>

                    <div className="h-1 w-15 bg-green-500"></div>


                    <div className="flex items-center">
                        <span className="text-sm font-semibold ml-2 bg-gray-400 text-white px-4 py-2 rounded-xl">Step 2</span>
                    </div>
                    <div className="h-1 w-15 bg-green-500"></div>


                    <div className="flex items-center">
                        <span className="text-sm font-semibold ml-2 bg-gray-400 text-white px-4 py-2 rounded-xl">Step 3</span>
                    </div>
                    <div className="h-1 w-15 bg-green-500"></div>


                    <div className="flex items-center">
                        <span className="text-sm font-semibold ml-2 bg-gray-400 text-white px-4 py-2 rounded-xl">Step 4</span>
                    </div>

                </div>)}
            <div className=' text-vermilion-700 bg-white container w-md-80 rounded-md shadow-sm p-4  mt-4'>
                <form onSubmit={handleSubmit}>
                    {showSuccess && <div className="text-green-600">{message}</div>}
                    {showError && <div className="text-red-600">{message}</div>}

                    {auth.user.role_id == 1 && (

                        <div className="mt-4">
                            <label htmlFor="name" className="block font-medium text-sm">
                                Client Name
                            </label>
                            <select
                                id="trade_name"
                                name="trade_name"
                                value={data.trade_name}
                                onChange={(e) => setData('trade_name', e.target.value)}
                                className="mt-1 block w-full rounded-md bg-white text-black"
                                style={{ border: '2px solid pink' }}
                            >
                                <option value="">Select Client Name</option>
                                {clients
                                    .filter(client => client.trade_name !== '') // Filter out clients with name "Admin"
                                    .map((client) => (
                                        <option key={client.id} value={client.trade_name}>
                                            {client.trade_name}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>)}
                    <div className="mt-4">
                        <label htmlFor="service_type" className="block font-medium text-sm ">
                            Service Type
                        </label>
                        <select
                            id="service_type"
                            name="service_type"
                            value={data.service_type}
                            onChange={(e) => setData('service_type', e.target.value)}
                            className="mt-1 block w-full rounded-md bg-white text-black"
                            style={{ border: '2px solid pink' }}
                            required
                        >
                            <option value="">Select Service Type</option>
                            <option value="flight">Flight</option>
                            <option value="cab">Cab</option>
                            <option value="visa">Visa</option>
                            <option value="hotel">Hotel</option>
                        </select>
                        {errors.service_type && <div className="text-red-600">{errors.service_type}</div>}
                    </div>

                    {/* Additional fields for flight service */}
                    {data.service_type === 'flight' && (
                        <>
                            <div className="grid grid-cols-3 gap-4">

                                <div className="mt-4">
                                    <label htmlFor="passenger_number" className="block font-medium text-sm">
                                        Passenger   Number
                                    </label>
                                    <TextInput
                                        id="passenger_number"
                                        type="number"
                                        name="passenger_number"
                                        value={data.passenger_number}
                                        onChange={(e) => setData('passenger_number', e.target.value)}
                                        className="mt-1 block w-full rounded-md bg-white text-black"
                                        style={{ border: '2px solid pink' }}
                                        required
                                    />
                                    {errors.passenger_number && <div className="text-red-600">{errors.passenger_number}</div>}
                                </div>

                                {parseInt(data.passenger_number) > 0 && (
                                    <div className="mt-4">
                                        <label htmlFor="passenger_names" className="block font-medium text-sm">
                                            Passenger Name(s)
                                        </label>
                                        {/* Render Passenger Name fields dynamically based on passenger number */}
                                        {Array.from({ length: parseInt(data.passenger_number) }).map((_, index) => (
                                            <TextInput
                                                key={index}
                                                id={`passenger_name_${index}`}
                                                type="text"
                                                name={`passenger_names[${index}]`}
                                                value={data.passenger_names[index] || ''}
                                                onChange={(e) => {
                                                    const newPassengerNames = [...data.passenger_names];
                                                    newPassengerNames[index] = e.target.value;
                                                    setData('passenger_names', newPassengerNames);
                                                }}
                                                className="mt-1 block w-full rounded-md bg-white text-black"
                                                style={{ border: '2px solid pink' }}
                                                placeholder={`Passenger ${index + 1} Name`}

                                            />
                                        ))}
                                        {errors.passenger_names && <div className="text-red-600">{errors.passenger_names}</div>}
                                    </div>
                                )}

                                <div className="mt-4">
                                    <label htmlFor="domestic_international" className="block font-medium text-sm ">
                                        Domestic/International
                                    </label>
                                    <select
                                        id="domestic_international"
                                        name="domestic_international"
                                        value={data.domestic_international}
                                        onChange={(e) => setData('domestic_international', e.target.value)}
                                        className="mt-1 block w-full rounded-md bg-white text-black"
                                        style={{ border: '2px solid pink' }}
                                        required
                                    >
                                        <option value="">Select Option</option>
                                        <option value="domestic">Domestic</option>
                                        <option value="international">International</option>
                                    </select>
                                    {errors.domestic_international && <div className="text-red-600">{errors.domestic_international}</div>}
                                </div>

                                <div className="mt-4">
                                    <label htmlFor="oneway_roundway" className="block font-medium text-sm ">
                                        One Way/Roundway
                                    </label>
                                    <select
                                        id="oneway_roundway"
                                        name="oneway_roundway"
                                        value={data.oneway_roundway}
                                        onChange={(e) => setData('oneway_roundway', e.target.value)}
                                        className="mt-1 block w-full rounded-md bg-white text-black"
                                        style={{ border: '2px solid pink' }}
                                        required
                                    >
                                        <option value="">Select Option</option>
                                        <option value="oneway">One Way</option>
                                        <option value="roundway">Roundway</option>
                                    </select>
                                    {errors.oneway_roundway && <div className="text-red-600">{errors.oneway_roundway}</div>}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">

                                <div className="mt-4">
                                    <label htmlFor="from_location" className="block font-medium text-sm">
                                        From (Location)
                                    </label>
                                    <TextInput
                                        id="from_location"
                                        type="text"
                                        name="from_location"
                                        value={data.from_location}
                                        onChange={(e) => setData('from_location', e.target.value)}
                                        className="mt-1 block w-full rounded-md bg-white text-black"
                                        style={{ border: '2px solid pink' }}
                                        required
                                    />
                                    {errors.from_location && <div className="text-red-600">{errors.from_location}</div>}
                                </div>

                                <div className="mt-4">
                                    <label htmlFor="to_location" className="block font-medium text-sm">
                                        To (Location)
                                    </label>
                                    <TextInput
                                        id="to_location"
                                        type="text"
                                        name="to_location"
                                        value={data.to_location}
                                        onChange={(e) => setData('to_location', e.target.value)}
                                        className="mt-1 block w-full rounded-md bg-white text-black"
                                        style={{ border: '2px solid pink' }}
                                        required
                                    />
                                    {errors.to_location && <div className="text-red-600">{errors.to_location}</div>}
                                </div>

                                <div className="mt-4">
                                    <label htmlFor="departure_date" className="block font-medium text-sm">
                                        Departure Date
                                    </label>
                                    <TextInput
                                        id="departure_date"
                                        type="date"
                                        name="departure_date"
                                        value={data.departure_date}
                                        onChange={(e) => setData('departure_date', e.target.value)}
                                        className="mt-1 block w-full rounded-md bg-white text-black"
                                        style={{ border: '2px solid pink' }}
                                        required
                                    />
                                    {errors.departure_date && <div className="text-red-600">{errors.departure_date}</div>}
                                </div>
                            </div>
                            {/* Return date field */}
                            <div className="grid grid-cols-3 gap-4">

                                {data.oneway_roundway === 'roundway' && (
                                    <div className="mt-4">
                                        <label htmlFor="return_date" className="block font-medium text-sm">
                                            Return Date
                                        </label>
                                        <TextInput
                                            id="return_date"
                                            type="date"
                                            name="return_date"
                                            value={data.return_date}
                                            onChange={(e) => setData('return_date', e.target.value)}
                                            className="mt-1 block w-full rounded-md bg-white text-black"
                                            style={{ border: '2px solid pink' }}
                                            required
                                        />
                                        {errors.return_date && <div className="text-red-600">{errors.return_date}</div>}
                                    </div>
                                )}

                            </div>

                        </>
                    )}

                    <div className="flex items-center justify-end mt-4">
                        <PrimaryButton className="ms-4 bg-pink-600" disabled={processing}>
                            Save
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
