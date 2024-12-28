<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JurnalResoure extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        {
            // return parent::toArray($request);
            return [
                'message' => "Success",
                'code' => 200,
                'data' => [
                    'id' => $this->id,
                    'judul' => $this->judul,
                    'pembuat' => $this->pembuat,
                    'isi' => $this->isi,
                    'tema' => $this->tema,
                    'tanggalBuat' => $this->tanggalBuat
                ]
            ];
        }
    }
}
