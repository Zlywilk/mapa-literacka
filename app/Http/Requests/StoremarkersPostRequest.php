<?php

namespace App\Http\Requests;

use App\Http\Requests\Request;
use Illuminate\Http\JsonResponse;
class StoremarkersPostRequest extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
                   'title' => 'required',
      'type' => 'required',
              'title.*' => 'required',
      'type.*' => 'required',
        ];
    }
    public function messages()
{
    return[
        'title.required' => '<li>zaraz chyba ktoś tu zapomniał o nazwie :)</li>',
        'type.required'  => '<li>a typ to kto wybierze :)</li>',
                'title.*.required' => '<li>zaraz chyba ktoś tu zapomniał o nazwie :)</li>',
        'type.*.required'  => '<li>a typ to kto wybierze :)</li>',
    ];
}

}