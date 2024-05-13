import { useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import NavBar from '@/Components/NavBar';
import InputLabelRequire from '@/Components/InputLabelRequire';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import AlertMessage from '@/Components/AlertMessage';

export default function Register({ auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        gate: "",
        pnr_number: "",
        seat_number: "",
        flight: "",
        flight_class: "",
        clientName:"",
    });
    const selectedClient = localStorage.getItem("selectedClient");
    
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [message, setMessage] = useState('');
    console.log(selectedClient);
    const submit = async (e) => {
        e.preventDefault();
    
        post(route('ticket.store'), {
            onSuccess: () => {
                setShowSuccess(true);
                setMessage('Ticket registered successfully');
                setTimeout(() => {
                    setShowSuccess(false);
                }, 5000);
                // Redirect to the next URL after successful submission
                visit(route('invoice.index'));
            },
            onError: (errors) => {
                setShowError(true);
                // Display error message to the user
                setMessage('Unable to register ticket');
                setTimeout(() => {
                    setShowError(false);
                }, 5000);
            },
        });
    };
    

    return (
        <Authenticated
            user={auth.user}
        >
            <Head title="Ticket " />
            <div className="flex justify-center items-center space-x-4">
                {/* Step 1 */}

                <div className="flex items-center ">
                    <span className="text-sm font-semibold flex gap-2 items-center bg-green-500 text-white px-4 py-2 rounded-xl ">
                        <span>Step 1 </span>
                        <svg
                            width="18px"
                            height="18px"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                    </span>
                </div>

                <div className="h-1 w-20 bg-green-500"></div>

                {/* Step 2 */}
                <div className="flex items-center bg-green-500 border-2 px-4 py-2 rounded-xl">
                    <span className="text-sm font-semibold  text-white">
                        Step 2
                    </span>
                </div>
                <div className="h-1 w-15 bg-green-500"></div>

                {/* Step 2 */}
                <div className="flex items-center bg-green-500 border-2 px-4 py-2 rounded-xl">
                    <span className="text-sm font-semibold  text-white">
                        Step 3
                    </span>
                </div>
                <div className="h-1 w-15 bg-green-500"></div>

                <div className="flex items-center">
                    <span className="text-sm font-semibold ml-2 bg-gray-400 text-white px-4 py-2 rounded-xl">Step 4</span>
                </div>
            </div>
            <div className='text-vermilion-700 bg-white container w-md-80 rounded-md shadow-sm p-4 mt-4'>
                <form onSubmit={submit}>
                    {showSuccess && <AlertMessage type="success" message={message} />}
                    {showError && <AlertMessage type="error" message={message} />}

                    <div className="grid grid-cols-3 gap-4">
                        <div className="mt-4">
                            <InputLabelRequire htmlFor="gate" value="gate Name" />

                            <TextInput
                                id="gate"
                                name="gate"
                                value={data.gate}
                                className="mt-1 block w-full rounded-md bg-white text-black"
                                style={{ border: '2px solid pink' }} // Set border style and color inline
                                autoComplete="organization"
                                onChange={(e) => setData('gate', e.target.value,'client')}
                                onClick={(e) => setData('clientName', selectedClient)}
                                required
                            />
                            




                            <InputError message={errors.gate} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabelRequire htmlFor="pnr_number" value="pnr_number" />

                            <TextInput
                                id="pnr_number"
                                name="pnr_number"
                                value={data.pnr_number}
                                className="mt-1 block w-full rounded-md text-black bg-white"
                                style={{ border: '2px solid pink' }} // Set border style and color inline
                                autoComplete="organization"
                                onChange={(e) => setData('pnr_number', e.target.value)}
                                required
                            />

                            <InputError message={errors.pnr_number} className="mt-2" />
                        </div>
                        <div className="mt-4">
                            <InputLabelRequire htmlFor="seat_number" value="seat_number" />

                            <TextInput
                                id="seat_number"
                                type="seat_number"
                                name="seat_number"
                                value={data.seat_number}
                                className="mt-1 block w-full rounded-md text-black bg-white"
                                style={{ border: '2px solid pink' }} // Set border style and color inline
                                autoComplete="organization"
                                onChange={(e) => setData('seat_number', e.target.value)}
                                required
                            />

                            <InputError message={errors.seat_number} className="mt-2" />
                        </div>

                        {/* Add other input fields in a similar manner */}
                    </div>
                    <div className="grid grid-cols-3 gap-4">

                        <div className="mt-4">
                            <InputLabelRequire htmlFor="flight" value="flight" />

                            <TextInput
                                id="flight"
                                type="text"
                                name="flight"
                                value={data.flight}
                                className="mt-1 block w-full rounded-md bg-white text-black"
                                style={{ border: '2px solid pink' }} // Set border style and color inline
                                autoComplete="organization"
                                onChange={(e) => setData('flight', e.target.value)}
                                required
                            />

                            <InputError message={errors.phone_flightnumber} className="mt-2" />
                        </div>
                        <div className="mt-4">
                            <InputLabel  htmlFor="flight_class" value="Class" />

                            <TextInput
                                id="flight_class"
                                name="flight_class"
                                value={data.flight_class}
                                className="mt-1 block w-full text-black"
                                style={{ border: '2px solid pink' }} // Set border style and color inline

                                autoComplete="url"
                                onChange={(e) => setData('flight_class', e.target.value)}
                            />

                            <InputError message={errors.flight_class} className="mt-2" />
                        </div>

                       
                        
                    </div>

                    

                    <div className="flex items-center justify-end mt-4">
                        <PrimaryButton className="ms-4" disabled={processing}>
                            Register
                        </PrimaryButton>
                    </div>

                </form>
            </div>
        </Authenticated>
    );
}
