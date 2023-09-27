<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PaginateResourceCollection extends AnonymousResourceCollection
{
    public function paginationInformation($request, $paginated, $default): array
    {
        return [
            'pagination' => [
                'currentPage' => $paginated['current_page'],
                'from' => $paginated['from'],
                'lastPage' => $paginated['last_page'],
                'perPage' => $paginated['per_page'],
                'to' => $paginated['to'],
                'total' => $paginated['total'],
            ]
        ];
    }
}
