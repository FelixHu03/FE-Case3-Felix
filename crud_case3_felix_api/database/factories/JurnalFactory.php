<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Jurnal>
 */
class JurnalFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'judul' => fake()->randomElement(['Prabowo Resmi jadi Presiden', 'Nil Amstrong Telah Sampai ke Bulan', 'Hari ini Lampu Padam Satu Indonesia']),
            'tanggalBuat' => fake()->dateTime('Y-m-d'),
            'pembuat' => fake()->name,
            'tema' => fake()->randomElement(['Berita', 'Kisah', 'Astronomi', 'JualBeli']),
            'isi' => fake()->paragraph(5),
        ];
    }
}
