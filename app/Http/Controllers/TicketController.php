<?php

namespace App\Http\Controllers;
use Inertia\Response;
use Inertia\Inertia;
use App\Models\Client;
use App\Models\ServiceRequest;
use App\Models\Ticket;
use Illuminate\Support\Facades\Auth;

use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function index(): Response
    {
        $clients = Client::select('id', 'trade_name')->get(); // Fetch only id and trade_name
        return Inertia::render('ticket/ticketform', ['clients' => $clients]);
    }
    public function store(Request $request)
    {
        $clientId = Auth::id();

        if ($request->filled('clientName')) {
            $client = Client::where('trade_name', $request['clientName'])->first();

            // Check if the client exists
            if ($client) {
                $clientId = $client->id;
            } else {
                // Handle case where client is not found
                return redirect()->back()->with('error', 'Client not found for the selected   name.');
            }
        }
    //   dd($clientId);
        $request->validate([
            'gate' => 'required',
            'pnr_number' => 'required',
            'seat_number' => 'required',
            'flight' => 'required',
            'flight_class' => 'required',
        ]);
        // Create a new ticket instance
        $ticket = Ticket::create([
            'client_id' => $clientId,
            'gate' => $request->gate,
            'pnr_number' => $request->pnr_number,
            'seat_number' => $request->seat_number,
            'flight' => $request->flight,
            'flight_class' => $request->flight_class,
        ]);
        return redirect()->route('invoice.index')->with('success', 'Ticket created successfully');

     }
    
}
