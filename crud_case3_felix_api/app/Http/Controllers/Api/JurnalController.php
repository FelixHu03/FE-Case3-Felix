<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\JurnalResoure;
use App\Models\jurnal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class JurnalController extends Controller
{
    public function index()
    {
        $jurnal = jurnal::get();
        if ($jurnal) {
            return JurnalResoure::collection($jurnal);
        } else {
            return response()->json(['status' => 400, 'message' => 'Failed'], 200);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'judul' => 'required|string|max:255',
            'pembuat' => 'required|string|max:255',
            'isi' => 'required|string|max:100000',
            'tema' => 'required|string|max:255',
            'tanggalBuat' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Failed',
                'code' => 400,
                'error' => $validator->messages(),
            ], 422);
        }

        $jurnal = jurnal::create([
            'judul' => $request->judul,
            'pembuat' => $request->pembuat,
            'isi' => $request->isi,
            'tema' => $request->tema,
            'tanggalBuat' => $request->tanggalBuat,
        ]);

        return response()->json([
            'message' => 'Success',
            'code' => 200,
            'data' => new JurnalResoure($jurnal),
        ], 200);
    }

    public function show($id)
    {
        $jurnal = jurnal::findOrFail($id);
        return new JurnalResoure($jurnal);
    }

    public function update(Request $request, $id)
    {
        $jurnal = jurnal::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'judul' => 'required|string|max:255',
            'pembuat' => 'required|string|max:255',
            'isi' => 'required|string',
            'tema' => 'required|string|max:255',
            'tanggalBuat' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'All fields are mandatory',
                'error' => $validator->messages(),
            ], 422);
        }

        $jurnal->update([
            'judul' => $request->judul,
            'pembuat' => $request->pembuat,
            'isi' => $request->isi,
            'tema' => $request->tema,
            'tanggalBuat' => $request->tanggalBuat,
        ]);

        $jurnal->refresh();

        return response()->json([
            'message' => 'Data Berhasil di Update',
            'data' => new JurnalResoure($jurnal),
        ], 200);
    }

    public function destroy($id)
    {
        $pendaftaran = jurnal::findOrFail($id);
        $pendaftaran->delete();

        return response()->json([
            'message' => "Jurnal Berhasil dihapus",
        ], 200);
    }
}