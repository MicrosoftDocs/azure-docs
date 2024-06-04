---
title: Azure AI Model Inference Completions
titleSuffix: Azure AI Studio
description: Reference for Azure AI Model Inference Completions API
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

# Reference: Completions | Azure AI Studio

[!INCLUDE [Feature preview](../includes/feature-preview.md)]

Creates a completion for the provided prompt and parameters.

```http
POST /completions?api-version=2024-04-01-preview
```

| Name | In  | Required | Type | Description |
| --- | --- | --- | --- | --- |
| api-version | query | True | string | The version of the API in the format "YYYY-MM-DD" or "YYYY-MM-DD-preview". |


## Request Body


| Name | Required | Type | Description |
| --- | --- | --- | --- |
| prompt | True |     | The prompts to generate completions for, encoded as a string, array of strings, array of tokens, or array of token arrays. Note that `<\|endoftext\|>` is the document separator that the model sees during training, so if a prompt is not specified the model generates as if from the beginning of a new document. |
| frequency\_penalty |     | number | Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim. |
| max\_tokens |     | integer | The maximum number of tokens that can be generated in the completion. The token count of your prompt plus `max_tokens` cannot exceed the model's context length. |
| presence\_penalty |     | number | Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics. |
| seed |     | integer | If specified, the model makes a best effort to sample deterministically, such that repeated requests with the same `seed` and parameters should return the same result.<br><br>Determinism is not guaranteed, and you should refer to the `system_fingerprint` response parameter to monitor changes in the backend. |
| stop |     |     | Sequences where the API will stop generating further tokens. The returned text will not contain the stop sequence. |
| stream |     | boolean | Whether to stream back partial progress. If set, tokens will be sent as data-only [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format) as they become available, with the stream terminated by a `data: [DONE]` message. |
| temperature |     | number | What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.<br><br>We generally recommend altering `temperature` or `top_p` but not both. |
| top\_p |     | number | An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top\_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.<br><br>We generally recommend altering `top_p` or `temperature` but not both. |

## Responses


| Name | Type | Description |
| --- | --- | --- |
| 200 OK | [CreateCompletionResponse](#createcompletionresponse) | OK  |
| 401 Unauthorized         | [UnauthorizedError](#unauthorizederror)                 | Access token is missing or invalid<br><br>Headers<br><br>x-ms-error-code: string                                                                           |
| 404 Not Found            | [NotFoundError](#notfounderror)                         | Modality not supported by the model. Check the documentation of the model to see which routes are available.<br><br>Headers<br><br>x-ms-error-code: string |
| 422 Unprocessable Entity | [UnprocessableContentError](#unprocessablecontenterror) | The request contains unprocessable content<br><br>Headers<br><br>x-ms-error-code: string                                                                   |
| 429 Too Many Requests    | [TooManyRequestsError](#toomanyrequestserror)           | You have hit your assigned rate limit and your request need to be paced.<br><br>Headers<br><br>x-ms-error-code: string                                     |
| Other Status Codes       | [ContentFilterError](#contentfiltererror)               | Bad request<br><br>Headers<br><br>x-ms-error-code: string                                                                                                  |


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


### Creates a completion for the provided prompt and parameters

#### Sample Request

```http
POST /completions?api-version=2024-04-01-preview

{
  "prompt": "This is a very good text",
  "frequency_penalty": 0,
  "presence_penalty": 0,
  "max_tokens": 256,
  "seed": 42,
  "stop": "<|endoftext|>",
  "stream": false,
  "temperature": 0,
  "top_p": 1
}

```

#### Sample Response

Status code: 200

```json
{
  "id": "1234567890",
  "model": "llama2-7b",
  "choices": [
    {
      "index": 0,
      "finish_reason": "stop",
      "text": ", indeed it is a good one."
    }
  ],
  "created": 1234567890,
  "object": "text_completion",
  "usage": {
    "prompt_tokens": 15,
    "completion_tokens": 8,
    "total_tokens": 23
  }
}
```

## Definitions


| Name | Description |
| --- | --- |
| [Choices](#choices) | A list of chat completion choices. |
| [CompletionFinishReason](#completionfinishreason) | The reason the model stopped generating tokens. This is `stop` if the model hit a natural stop point or a provided stop sequence, `length` if the maximum number of tokens specified in the request was reached, `content_filter` if content was omitted due to a flag from our content filters. |
| [CompletionUsage](#completionusage) | Usage statistics for the completion request. |
| [ContentFilterError](#contentfiltererror) | The API call fails when the prompt triggers a content filter as configured. Modify the prompt and try again. |
| [CreateCompletionRequest](#createcompletionrequest) |     |
| [CreateCompletionResponse](#createcompletionresponse) | Represents a completion response from the API. |
| [Detail](#detail) |     |
| [TextCompletionObject](#textcompletionobject) | The object type, which is always "text\_completion" |
| [UnprocessableContentError](#unprocessablecontenterror) |     |


### Choices

A list of chat completion choices.


| Name | Type | Description |
| --- | --- | --- |
| finish\_reason | [CompletionFinishReason](#completionfinishreason) | The reason the model stopped generating tokens. This is `stop` if the model hit a natural stop point or a provided stop sequence, `length` if the maximum number of tokens specified in the request was reached, `content_filter` if content was omitted due to a flag from our content filters, `tool_calls` if the model called a tool. |
| index | integer | The index of the choice in the list of choices. |
| text | string | The generated text. |


### CompletionFinishReason

The reason the model stopped generating tokens. This is `stop` if the model hit a natural stop point or a provided stop sequence, `length` if the maximum number of tokens specified in the request was reached, `content_filter` if content was omitted due to a flag from our content filters.


| Name | Type | Description |
| --- | --- | --- |
| content\_filter | string |     |
| length | string |     |
| stop | string |     |

### CompletionUsage

Usage statistics for the completion request.


| Name | Type | Description |
| --- | --- | --- |
| completion\_tokens | integer | Number of tokens in the generated completion. |
| prompt\_tokens | integer | Number of tokens in the prompt. |
| total\_tokens | integer | Total number of tokens used in the request (prompt + completion). |


### ContentFilterError

The API call fails when the prompt triggers a content filter as configured. Modify the prompt and try again.


| Name | Type | Description |
| --- | --- | --- |
| code | string | The error code. |
| error | string | The error description. |
| message | string | The error message. |
| param | string | The parameter that triggered the content filter. |
| status | integer | The HTTP status code. |


### CreateCompletionRequest


| Name | Type | Default Value | Description |
| --- | --- | --- | --- |
| frequency\_penalty | number | 0   | Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim. |
| max\_tokens | integer | 256 | The maximum number of tokens that can be generated in the completion. The token count of your prompt plus `max_tokens` cannot exceed the model's context length. |
| presence\_penalty | number | 0   | Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics. |
| prompt |     | `<\|endoftext\|>` | The prompts to generate completions for, encoded as a string, array of strings, array of tokens, or array of token arrays. Note that `<\|endoftext\|>` is the document separator that the model sees during training, so if a prompt is not specified the model generates as if from the beginning of a new document. |
| seed | integer |     | If specified, our system will make a best effort to sample deterministically, such that repeated requests with the same `seed` and parameters should return the same result.<br><br>Determinism is not guaranteed, and you should refer to the `system_fingerprint` response parameter to monitor changes in the backend. |
| stop |     |     | Sequences where the API will stop generating further tokens. The returned text will not contain the stop sequence. |
| stream | boolean | False | Whether to stream back partial progress. If set, tokens will be sent as data-only [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format) as they become available, with the stream terminated by a `data: [DONE]` message. |
| temperature | number | 1   | What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.<br><br>We generally recommend altering this or `top_p` but not both. |
| top\_p | number | 1   | An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top\_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.<br><br>We generally recommend altering this or `temperature` but not both. |


### CreateCompletionResponse

Represents a completion response from the API. Note: both the streamed and nonstreamed response objects share the same shape (unlike the chat endpoint).


| Name | Type | Description |
| --- | --- | --- |
| choices | [Choices](#choices)\[\] | The list of completion choices the model generated for the input prompt. |
| created | integer | The Unix timestamp (in seconds) of when the completion was created. |
| ID  | string | A unique identifier for the completion. |
| model | string | The model used for completion. |
| object | [TextCompletionObject](#textcompletionobject) | The object type, which is always "text\_completion" |
| system\_fingerprint | string | This fingerprint represents the backend configuration that the model runs with.<br><br>Can be used with the `seed` request parameter to understand when backend changes have been made that might impact determinism. |
| usage | [CompletionUsage](#completionusage) | Usage statistics for the completion request. |

### Detail


| Name | Type | Description |
| --- | --- | --- |
| loc | string\[\] | The parameter causing the issue |
| value | string | The value passed to the parameter causing issues. |


### TextCompletionObject

The object type, which is always "text\_completion"


| Name | Type | Description |
| --- | --- | --- |
| text\_completion | string |     |

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