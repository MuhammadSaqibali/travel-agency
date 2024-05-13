import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ServiceForm({ auth, clients }) {
    const { data, setData, post, processing, errors, reset } = useForm("");

    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [message, setMessage] = useState("");
    const [duplicateCount, setDuplicateCount] = useState(1); // Track the number of duplicates
    const [duplicateForms, setDuplicateForms] = useState([
        {
            airline_name: "",
            departure_time: "",
            arrival_time: "",
            ourcost: "",
            name: "",
            departure_date: "",
            flight_number: "",
            flight_gate: "",
            fare_type: "",
            prf: "",
            total_cost: "",
            flight_class: "",
            pnr_number: "",
            seat_number: "",
        },
    ]);

    const duplicateFields = () => {
        setDuplicateCount((prevCount) => prevCount + 1);
        setDuplicateForms((prevForms) => [
            ...prevForms,
            {
                /* initial form data */
            },
        ]);
    };

    // Function to remove duplicated fields
    const removeDuplicateFields = () => {
        if (duplicateForms.length > 1) {
            setDuplicateCount((prevCount) => Math.max(prevCount - 1, 1)); // Ensure at least one set of fields
            setDuplicateForms((prevForms) => prevForms.slice(0, -1));
        }
    };

    // Calculate total cost whenever ourcost or prf changes
    useEffect(() => {
        duplicateForms.forEach((formData, index) => {
            const ourcost = parseFloat(formData.ourcost) || 0;
            const prf = parseFloat(formData.prf) || 0;
            const totalCost = (ourcost + prf).toFixed(2);
            setDuplicateForms((prevForms) => {
                const updatedForms = [...prevForms];
                updatedForms[index] = {
                    ...updatedForms[index],
                    total_cost: totalCost,
                };
                return updatedForms;
            });
        });
    }, [duplicateForms]);
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Construct arrays for prices and airline names from duplicateForms
        const prices = duplicateForms.map((formData) => formData.ourcost);
        const airlineNames = duplicateForms.map(
            (formData) => formData.airline_name
        );

        // Construct formData object
        let selectedService = localStorage.getItem("selectedService");
        let formData = {};
        if (selectedService !== null && selectedService !== undefined) {
            formData = {
                clientName: localStorage.getItem("selectedClient"),
                serviceType: localStorage.getItem("selectedService"),
                prices: prices, // Make sure prices is always an array
                airline_names: airlineNames, // Make sure airline_names is always an array
                id: auth.user.id, // Assuming you have access to auth.user.id
                // Add other properties based on your fields
                data: duplicateForms.map(
                    ({
                        airline_name,
                        departure_time,
                        arrival_time,
                        ourcost,
                        departure_date,
                        name,
                        flight_number,
                        fare_type,
                        prf,
                        total_cost,
                        seat_number,
                        flight_gate,
                        flight_class,
                        pnr_number,
                    }) => ({
                        airline_name,
                        departure_time,
                        arrival_time,
                        ourcost,
                        departure_date,
                        name,
                        flight_number,
                        fare_type,
                        prf,
                        total_cost,
                        seat_number,
                        flight_gate,
                        flight_class,
                        pnr_number,
                    })
                ),
            };
        } else {
            formData = {
                clientName: localStorage.getItem("selectedClient"),
                prices: prices, // Make sure prices is always an array
                airline_names: airlineNames, // Make sure airline_names is always an array
                id: auth.user.id, // Assuming you have access to auth.user.id
                // Add other properties based on your fields
                data: duplicateForms.map(
                    ({
                        airline_name,
                        departure_time,
                        arrival_time,
                        ourcost,
                        departure_date,
                        name,
                        flight_number,
                        fare_type,
                        prf,
                        total_cost,
                        flight_gate,
                        seat_number,
                        flight_class,
                        pnr_number,
                    }) => ({
                        airline_name,
                        departure_time,
                        arrival_time,
                        ourcost,
                        departure_date,
                        name,
                        flight_number,
                        fare_type,
                        prf,
                        total_cost,
                        seat_number,
                        flight_class,
                        flight_gate,
                        pnr_number,
                    })
                ),
            };
        }
        fetch("/api/quotationStoreApi", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Network response was not ok.");
                }
            })
            .then((data) => {
                if (data && data.success === true) {
                    // localStorage.removeItem("selectedClient");
                    // localStorage.removeItem("selectedService");
                    window.location.href = "/ticket/form/fetch";
                } else {
                    throw new Error("API response indicates failure.");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Quotation" />
            <nav style={{ marginBottom: "20px" }}>
                <ul style={{ listStyle: "none", paddingLeft: 120, margin: 0 }}>
                    <li style={{ display: "inline", marginRight: "10px" }}>
                        <a
                            href="/dashboard"
                            style={{ textDecoration: "none", color: "black" }}
                        >
                            Home
                        </a>{" "}
                        /
                    </li>

                    <li style={{ display: "inline", marginRight: "10px" }}>
                        <a
                            href="/quotation/form/fetch"
                            style={{ textDecoration: "none", color: "black" }}
                        >
                            Quotation Form
                        </a>
                    </li>
                </ul>
            </nav>
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

                <div className="h-1 w-15 bg-green-500"></div>

                {/* Step 2 */}
                <div className="flex items-center bg-green-500 border-2 px-4 py-2 rounded-xl">
                    <span className="text-sm font-semibold  text-white">
                        Step 2
                    </span>
                </div>
                <div className="h-1 w-15 bg-green-500"></div>

                <div className="flex items-center">
                    <span className="text-sm font-semibold ml-2 bg-gray-400 text-white px-4 py-2 rounded-xl">Step 3</span>
                </div>
                <div className="h-1 w-15 bg-green-500"></div>

                <div className="flex items-center">
                    <span className="text-sm font-semibold ml-2 bg-gray-400 text-white px-4 py-2 rounded-xl">Step 4</span>
                </div>
            </div>
            <div className="text-vermilion-700 bg-white container w-md-80 rounded-md shadow-sm p-4 mt-4">
                <form onSubmit={handleSubmit}>
                    {showSuccess && (
                        <div className="text-green-600">{message}</div>
                    )}
                    {showError && <div className="text-red-600">{message}</div>}
                    {duplicateForms.map((formData, index) => (
                        <div key={index}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="mt-4">
                                    <label
                                        htmlFor={`airline_name_${index}`}
                                        className="block font-medium text-sm"
                                    >
                                        Airline Name
                                    </label>
                                    <select
                                        id={`airline_name_${index}`}
                                        name={`airline_name_${index}`}
                                        value={formData.airline_name}
                                        onChange={(e) => {
                                            const updatedForms = [
                                                ...duplicateForms,
                                            ];
                                            updatedForms[index].airline_name =
                                                e.target.value;
                                            setDuplicateForms(updatedForms);
                                        }}
                                        className="mt-1 block w-full rounded-md bg-white text-black"
                                        style={{ border: "2px solid pink" }}
                                        required
                                    >
                                        <option value="">Select Airline</option>
                                        <option value="Indigo">Indigo</option>
                                        <option value="Airindia">
                                            Airindia
                                        </option>
                                        <option value="AirAsia">AirAsia</option>
                                        <option value="Vistara">Vistara</option>
                                        <option value="Air India Express">
                                            Air India Express
                                        </option>
                                        <option value="Spicejet">
                                            Spicejet
                                        </option>
                                        <option value="Akasa Air">
                                            Akasa Air
                                        </option>
                                        <option value="Etihad Airways">
                                            Etihad Airways
                                        </option>
                                        <option value="Emirates">
                                            Emirates
                                        </option>
                                        <option value="Qatar Airways">
                                            Qatar Airways
                                        </option>
                                        <option value="Lufthansa">
                                            Lufthansa
                                        </option>
                                        <option value="British Airways">
                                            British Airways
                                        </option>
                                    </select>
                                </div>

                                {/* <div className="mt-4">
                                    <label htmlFor={`trade_name_${index}`} className="block font-medium text-sm">
                                        Client Name
                                    </label>
                                    <select
                                        id={`trade_name_${index}`}
                                        name={`trade_name_${index}`}
                                        value={formData.trade_name}
                                        onChange={(e) => {
                                            const updatedForms = [...duplicateForms];
                                            updatedForms[index].trade_name = e.target.value;
                                            setDuplicateForms(updatedForms);
                                        }}
                                        className="mt-1 block w-full rounded-md bg-white text-black"
                                        style={{ border: '2px solid pink' }}
                                    >
                                        <option value="">Select Client Name</option>
                                        {clients
                                            .filter(client => client.trade_name !== ' ') // Filter out clients with name "Admin"
                                            .map((client) => (
                                                <option key={client.id} value={client.trade_name}>
                                                    {client.trade_name}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div> */}
                                <div className="mt-4">
                                    <label
                                        htmlFor={`departure_date_${index}`}
                                        className="block font-medium text-sm"
                                    >
                                        Departure Date
                                    </label>
                                    <TextInput
                                        id={`departure_date_${index}`}
                                        type="date"
                                        name={`departure_date_${index}`}
                                        value={formData.departure_date}
                                        onChange={(e) => {
                                            const updatedForms = [
                                                ...duplicateForms,
                                            ];
                                            updatedForms[index].departure_date =
                                                e.target.value;
                                            setDuplicateForms(updatedForms);
                                        }}
                                        className="mt-1 block w-full rounded-md bg-white text-black"
                                        style={{ border: "2px solid pink" }}
                                        required
                                    />
                                </div>
                             
                             
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="mt-4">
                                    <label
                                        htmlFor={`fare_type_${index}`}
                                        className="block font-medium text-sm"
                                    >
                                        Fare Type
                                    </label>
                                    <select
                                        id={`fare_type_${index}`}
                                        name={`fare_type_${index}`}
                                        value={formData.fare_type}
                                        onChange={(e) => {
                                            const updatedForms = [
                                                ...duplicateForms,
                                            ];
                                            updatedForms[index].fare_type =
                                                e.target.value;
                                            setDuplicateForms(updatedForms);
                                        }}
                                        className="mt-1 block w-full rounded-md bg-white text-black"
                                        style={{ border: "2px solid pink" }}
                                        required
                                    >
                                        <option value="">Select Option</option>
                                        <option value="domestic">Normal</option>
                                        <option value="international">
                                            SME Fare
                                        </option>
                                        <option value="international">
                                            Special Fare
                                        </option>
                                        <option value="international">
                                            Corporate Fare
                                        </option>
                                        <option value="international">
                                            Other
                                        </option>
                                    </select>
                                </div>

                                <div className="mt-4">
                                    <label
                                        htmlFor={`departure_time_${index}`}
                                        className="block font-medium text-sm"
                                    >
                                        Departure Time
                                    </label>
                                    <TextInput
                                        id={`departure_time_${index}`}
                                        type="time"
                                        name={`departure_time_${index}`}
                                        value={formData.departure_time}
                                        onChange={(e) => {
                                            const updatedForms = [
                                                ...duplicateForms,
                                            ];
                                            updatedForms[index].departure_time =
                                                e.target.value;
                                            setDuplicateForms(updatedForms);
                                        }}
                                        className="mt-1 block w-full rounded-md bg-white text-black"
                                        style={{ border: "2px solid pink" }}
                                        required
                                    />
                                </div>

                                <div className="mt-4">
                                    <label
                                        htmlFor={`arrival_time_${index}`}
                                        className="block font-medium text-sm"
                                    >
                                        Arrival Time
                                    </label>
                                    <TextInput
                                        id={`arrival_time_${index}`}
                                        type="time"
                                        name={`arrival_time_${index}`}
                                        value={formData.arrival_time}
                                        onChange={(e) => {
                                            const updatedForms = [
                                                ...duplicateForms,
                                            ];
                                            updatedForms[index].arrival_time =
                                                e.target.value;
                                            setDuplicateForms(updatedForms);
                                        }}
                                        className="mt-1 block w-full rounded-md bg-white text-black"
                                        style={{ border: "2px solid pink" }}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="mt-4">
                                    <label
                                        htmlFor={`ourcost_${index}`}
                                        className="block font-medium text-sm"
                                    >
                                        Our Cost
                                    </label>
                                    <TextInput
                                        id={`ourcost_${index}`}
                                        type="number"
                                        name={`ourcost_${index}`}
                                        value={formData.ourcost}
                                        onChange={(e) => {
                                            const updatedForms = [
                                                ...duplicateForms,
                                            ];
                                            updatedForms[index].ourcost =
                                                e.target.value;
                                            setDuplicateForms(updatedForms);
                                        }}
                                        className="mt-1 block w-full rounded-md bg-white text-black"
                                        style={{ border: "2px solid pink" }}
                                        required
                                    />
                                </div>

                                <div className="mt-4">
                                    <label
                                        htmlFor={`prf_${index}`}
                                        className="block font-medium text-sm"
                                    >
                                        PRF
                                    </label>
                                    <TextInput
                                        id={`prf_${index}`}
                                        type="number"
                                        name={`prf_${index}`}
                                        value={formData.prf}
                                        onChange={(e) => {
                                            const updatedForms = [
                                                ...duplicateForms,
                                            ];
                                            updatedForms[index].prf =
                                                e.target.value;
                                            setDuplicateForms(updatedForms);
                                        }}
                                        className="mt-1 block w-full rounded-md bg-white text-black"
                                        style={{ border: "2px solid pink" }}
                                        required
                                    />
                                </div>

                                <div className="mt-4">
                                    <label
                                        htmlFor={`total_cost_${index}`}
                                        className="block font-medium text-sm"
                                    >
                                        Total Cost
                                    </label>
                                    <TextInput
                                        id={`total_cost_${index}`}
                                        type="number"
                                        name={`total_cost_${index}`}
                                        value={formData.total_cost}
                                        onChange={(e) => {
                                            const updatedForms = [
                                                ...duplicateForms,
                                            ];
                                            updatedForms[index].total_cost =
                                                e.target.value;
                                            setDuplicateForms(updatedForms);
                                        }}
                                        className="mt-1 block w-full rounded-md bg-white text-black"
                                        style={{ border: "2px solid pink" }}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="flex items-center justify-between mt-4">
                        <button type="button" onClick={duplicateFields}>
                            Duplicate
                        </button>
                        {duplicateCount > 1 && (
                            <button
                                type="button"
                                onClick={removeDuplicateFields}
                            >
                                Remove Duplicate
                            </button>
                        )}
                    </div>
                    <div className="flex items-center justify-end mt-4">
                        <PrimaryButton
                            onClick={() => {
                                window.location.href = "/services/form?back=1";
                            }}
                            className="ms-4 bg-pink-600"
                            disabled={processing}
                        >
                            Back
                        </PrimaryButton>

                        <PrimaryButton
                            onClick={handleSubmit}
                            className="ms-4 bg-pink-600"
                            disabled={processing}
                        >
                            Save
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
