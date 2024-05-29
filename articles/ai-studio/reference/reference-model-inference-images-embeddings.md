---
title: Azure AI Model Inference Image Embeddings
titleSuffix: Azure AI Studio
description: Reference for Azure AI Model Inference Image Embeddings API
manager: scottpolly
ms.service: azure-ai-studio
ms.topic: conceptual
ms.date: 5/21/2024
ms.reviewer: msakande 
reviewer: msakande
ms.author: fasantia
author: santiagxf
ms.custom: 
 - build-2024
---

# Reference: Image Embeddings | Azure AI Studio

[!INCLUDE [Feature preview](../includes/feature-preview.md)]

Creates an embedding vector representing the input image and text pair.

```http
POST /images/embeddings?api-version=2024-04-01-preview
```

## URI Parameters

| Name | In  | Required | Type | Description |
| --- | --- | --- | --- | --- |
| api-version | query | True | string | The version of the API in the format "YYYY-MM-DD" or "YYYY-MM-DD-preview". |

## Request Body


| Name | Required | Type | Description |
| --- | --- | --- | --- |
| input | True | [EmbeddingInput](#embeddinginput)\[\] | Input image to embed. To embed multiple inputs in a single request, pass an array. The input must not exceed the max input tokens for the model. |
| dimensions |     | integer | The number of dimensions the resulting output embeddings should have. Passing null causes the model to use its default value. Returns a 422 error if the model doesn't support the value or parameter. |
| encoding\_format |     | [EmbeddingEncodingFormat](#embeddingencodingformat) | The format to return the embeddings in. Either base64, float, int8, uint8, binary, or ubinary. Returns a 422 error if the model doesn't support the value or parameter. |


## Responses


| Name | Type | Description |
| --- | --- | --- |
| 200 OK | [CreateEmbeddingResponse](#createembeddingresponse) | OK  |
| 401 Unauthorized | [UnauthorizedError](#unauthorizederror) | Access token is missing or invalid<br><br>Headers<br><br>x-ms-error-code: string |
| 404 Not Found | [NotFoundError](#notfounderror) | Modality not supported by the model. Check the documentation of the model to see which routes are available.<br><br>Headers<br><br>x-ms-error-code: string |
| 422 Unprocessable Entity | [UnprocessableContentError](#unprocessablecontenterror) | The request contains unprocessable content<br><br>Headers<br><br>x-ms-error-code: string |
| 429 Too Many Requests | [TooManyRequestsError](#toomanyrequestserror) | You have hit your assigned rate limit and your request need to be paced.<br><br>Headers<br><br>x-ms-error-code: string |
| Other Status Codes | [ContentFilterError](#contentfiltererror) | Bad request<br><br>Headers<br><br>x-ms-error-code: string |


## Security


### Authorization

The token with the `Bearer:` prefix, e.g. `Bearer abcde12345`

**Type**: apiKey  
**In**: header  


### AADToken

Azure Active Directory OAuth2 authentication

**Type**: oauth2  
**Flow**: application  
**Token URL**: https://login.microsoftonline.com/common/oauth2/v2.0/token  


## Examples


### Creates an embedding vector representing the input text and image

#### Sample Request

```http
POST /images/embeddings?api-version=2024-04-01-preview

{
  "input": [
    {
      "text": "A nice picture of a cat",
      "image": "data:image/jpeg;base64,iVBORw0KG..."
    }
  ],
  "encoding_format": "float",
  "dimensions": 1024
}

```

#### Sample Response

Status code: 200

```json
{
  "data": [
    {
      "index": 0,
      "object": "embedding",
      "embedding": [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ]
    }
  ],
  "object": "list",
  "model": "DINO",
  "usage": {
    "prompt_tokens": 15,
    "total_tokens": 15
  }
}
```


## Definitions


| Name | Description |
| --- | --- |
| [ContentFilterError](#contentfiltererror) | The API call fails when the prompt triggers a content filter as configured. Modify the prompt and try again. |
| [CreateEmbeddingResponse](#createembeddingresponse) |     |
| [CreateImageEmbeddingRequest](#createimageembeddingrequest) |     |
| [Detail](#detail) |     |
| [Embedding](#embedding) | Represents an image generated. |
| [EmbeddingEncodingFormat](#embeddingencodingformat) | The format to return the embeddings in. Either base64, float, int8, uint8, binary, or ubinary. Returns a 422 error if the model doesn't support the value or parameter. |
| [EmbeddingObject](#embeddingobject) | The object type, which is always "embedding". |
| [EmbeddingInput](#embeddinginput) | Represents an image with optional text. |
| [ListObject](#listobject) | The object type, which is always "list". |
| [NotFoundError](#notfounderror) |     |
| [TooManyRequestsError](#toomanyrequestserror) |     |
| [UnauthorizedError](#unauthorizederror) |     |
| [UnprocessableContentError](#unprocessablecontenterror) |     |
| [Usage](#usage) | The usage information for the request. |

### ContentFilterError

The API call fails when the prompt triggers a content filter as configured. Modify the prompt and try again.


| Name | Type | Description |
| --- | --- | --- |
| code | string | The error code. |
| error | string | The error description. |
| message | string | The error message. |
| param | string | The parameter that triggered the content filter. |
| status | integer | The HTTP status code. |


### CreateEmbeddingResponse


| Name | Type | Description |
| --- | --- | --- |
| data | [Embedding](#embedding)\[\] | The list of embeddings generated by the model. |
| model | string | The name of the model used to generate the embedding. |
| object | [ListObject](#listobject) | The object type, which is always "list". |
| usage | [Usage](#usage) | The usage information for the request. |


### CreateImageEmbeddingRequest


| Name | Type | Default Value | Description |
| --- | --- | --- | --- |
| dimensions | integer |     | The number of dimensions the resulting output embeddings should have. Passing null causes the model to use its default value. Returns a 422 error if the model doesn't support the value or parameter. |
| encoding\_format | [EmbeddingEncodingFormat](#embeddingencodingformat) | float | The format to return the embeddings in. Either base64, float, int8, uint8, binary, or ubinary. Returns a 422 error if the model doesn't support the value or parameter. |
| input | [EmbeddingInput](#embeddinginput)\[\] |     | Input image to embed. To embed multiple inputs in a single request, pass an array. The input must not exceed the max input tokens for the model. |


### Detail


| Name | Type | Description |
| --- | --- | --- |
| loc | string\[\] | The parameter causing the issue |
| value | string | The value passed to the parameter causing issues. |



### Embedding

Represents an image generated.


| Name | Type | Description |
| --- | --- | --- |
| embedding | number\[\] | The embedding vector, which is a list of floats. The length of vector depends on the model used. |
| index | integer | The index of the embedding in the list of embeddings. |
| object | [EmbeddingObject](#embeddingobject) | The object type, which is always "embedding". |


### EmbeddingEncodingFormat

The format to return the embeddings in. Either base64, float, int8, uint8, binary, or ubinary. Returns a 422 error if the model doesn't support the value or parameter.


| Name | Type | Description |
| --- | --- | --- |
| base64 | string |     |
| binary | string |     |
| float | string |     |
| int8 | string |     |
| ubinary | string |     |
| uint8 | string |     |


### EmbeddingObject

The object type, which is always "embedding".


| Name | Type | Description |
| --- | --- | --- |
| embedding | string |     |


### EmbeddingInput

Represents an image with optional text.


| Name | Type | Description |
| --- | --- | --- |
| image | string | The input image encoded in `base64` string as a data URL. Example: `data:image/{format};base64,{data}`. |
| text | string | Optional. The text input to feed into the model (like DINO, CLIP). Returns a 422 error if the model doesn't support the value or parameter. |


### ListObject

The object type, which is always "list".


| Name | Type | Description |
| --- | --- | --- |
| list | string |     |


### NotFoundError


| Name | Type | Description |
| --- | --- | --- |
| error | string | The error description. |
| message | string | The error message. |
| status | integer | The HTTP status code. |


### TooManyRequestsError


| Name | Type | Description |
| --- | --- | --- |
| error | string | The error description. |
| message | string | The error message. |
| status | integer | The HTTP status code. |


### UnauthorizedError


| Name | Type | Description |
| --- | --- | --- |
| error | string | The error description. |
| message | string | The error message. |
| status | integer | The HTTP status code. |


### UnprocessableContentError


| Name | Type | Description |
| --- | --- | --- |
| code | string | The error code. |
| detail | [Detail](#detail) |     |
| error | string | The error description. |
| message | string | The error message. |
| status | integer | The HTTP status code. |


### Usage

The usage information for the request.


| Name | Type | Description |
| --- | --- | --- |
| prompt_patches | integer | The number of image patches used by the image prompt. |
| prompt_tokens | integer | The number of tokens used by the prompt. |
| total_patches | integer | The total number of patches used by the request. |
| total_tokens | integer | The total number of tokens used by the request. |