<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\PaginateJsonResource;
use App\Http\Requests\StoreMessageRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Message;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $maxRowsPerPage = $request->query('perPage', config('pagination.perPage'));
        return PaginateJsonResource::collection(Message::paginate($maxRowsPerPage));
    }

    public function show(Message $message)
    {
        return $message;
    }

    public function store(StoreMessageRequest $request)
    {
        return Message::create($request->validated());
    }

    public function update(StoreMessageRequest $request, Message $message)
    {
        $message->update($request->validated());
        return $message;
    }

    public function destroy(Message $message)
    {
        return [
            'success' => $message->delete()
        ];
    }
}
