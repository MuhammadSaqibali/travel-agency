<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\QuotationController;
use App\Models\Client;
use App\Models\Quotation;
use App\Models\ServiceRequest;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/quotationStoreApi', function (Request $request) {
    $data = $request->data;
    //echo "<pre>";print_r($data);exit;
   // return response()->json($data);
    $clientId = null;
    $clientName = $request->input('clientName');

    try {
        $clientId = Client::where('trade_name', $clientName)->value('id');

        if (!$clientId) {
            $clientId = intval($clientName);
            $client = ServiceRequest::find($clientId);

            if ($client) {
                $clientId = $client->client_id;
            }
        }
    } catch (\Throwable $th) {
        $clientId = null;
    }
    foreach ($data as $item) {
        try {
            if ($request->has('serviceType')) {
                Quotation::create([
                    'client_id' => $clientId,
                    'airline_name' => $item['airline_name'],
                    'departure_time' => $item['departure_time'],
                    'departure_date' => $item['departure_date'],
                    'arrival_time' => $item['arrival_time'],
                    'ourcost' => $item['ourcost'],
                    'flight_number' => $item['flight_number'],
                    // 'gate' => $item['flight_gate'],
                    'fare_type' => $item['fare_type'],
                    'prf' => $item['prf'],
                    'total_cost' => $item['total_cost'],
                    'gate' => $item['flight_gate'],
                    'pnr_number' => $item['pnr_number'],
                    'seat_number' => $item['seat_number'],
                    'class' => $item['flight_class'],
                    'service_type' => $request->serviceType
                ]);
            } else {
                Quotation::create([
                    'client_id' => $clientId,
                    'airline_name' => $item['airline_name'],
                    'departure_time' => $item['departure_time'],
                    'departure_date' => $item['departure_date'],
                    'arrival_time' => $item['arrival_time'],
                    'gate' => $item['flight_gate'],
                    'ourcost' => $item['ourcost'],
                    'flight_number' => $item['flight_number'],
                    'fare_type' => $item['fare_type'],
                    'prf' => $item['prf'],
                    'gate' => $item['flight_gate'],
                    'pnr_number' => $item['pnr_number'],
                    'seat_number' => $item['seat_number'],
                    'class' => $item['flight_class'],
                    'total_cost' => $item['total_cost']
                ]);
            }
        } catch (\Throwable $th) {
            return response()->json($th);
        }
    }
    return response()->json(['success' => true]);
});



