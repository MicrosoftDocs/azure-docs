---
title: Azure AI Model Inference Chat Completions
titleSuffix: Azure Machine Learning
description: Reference for Azure AI Model Inference Chat Completions API
manager: scottpolly
ms.service: azure-machine-learning
ms.subservice: inferencing
ms.topic: conceptual
ms.date: 05/03/2024
ms.reviewer: None
ms.author: mopeakande
author: msakande
ms.custom: 
 - build-2024
---

# Reference: Chat Completions | Azure Machine Learning

Creates a model response for the given chat conversation.

```http
POST /chat/completions?api-version=2024-04-01-preview
```

## URI Parameters

| Name | In  | Required | Type | Description |
| --- | --- | --- | --- | --- |
| api-version | query | True | string | The version of the API in the format "YYYY-MM-DD" or "YYYY-MM-DD-preview". |

## Request Header


| Name | Required | Type | Description |
| --- | --- | --- | --- |
| extra-parameters | | string | The behavior of the API when extra parameters are indicated in the payload. Using `pass-through` makes the API to pass the parameter to the underlying model. Use this value when you want to pass parameters that you know the underlying model can support. Using `ignore` makes the API to drop any unsupported parameter. Use this value when you need to use the same payload across different models, but one of the extra parameters may make a model to error out if not supported. Using `error` makes the API to reject any extra parameter in the payload. Only parameters specified in this API can be indicated, or a 400 error is returned. |
| azureml-model-deployment |     | string | Name of the deployment you want to route the request to. Supported for endpoints that support multiple deployments. |

## Request Body

| Name | Required | Type | Description |
| --- | --- | --- | --- |
| messages | True | [ChatCompletionRequestMessage](#chatcompletionrequestmessage) | A list of messages comprising the conversation so far. Returns a 422 error if at least some of the messages can't be understood by the model. |
| frequency\_penalty |     | number | Helps prevent word repetitions by reducing the chance of a word being selected if it has already been used. The higher the frequency penalty, the less likely the model is to repeat the same words in its output. Return a 422 error if value or parameter is not supported by model. |
| max\_tokens |     | integer | The maximum number of tokens that can be generated in the chat completion.<br><br>The total length of input tokens and generated tokens is limited by the model's context length. Passing null causes the model to use its max context length. |
| presence\_penalty |     | number | Helps prevent the same topics from being repeated by penalizing a word if it exists in the completion already, even just once. Return a 422 error if value or parameter is not supported by model. |
| response\_format |     | [ChatCompletionResponseFormat](#chatcompletionresponseformat) |     |
| seed |     | integer | If specified, our system will make a best effort to sample deterministically, such that repeated requests with the same `seed` and parameters should return the same result. Determinism is not guaranteed, and you should refer to the `system_fingerprint` response parameter to monitor changes in the backend. |
| stop |     |     | Sequences where the API will stop generating further tokens. |
| stream |     | boolean | If set, partial message deltas will be sent. Tokens will be sent as data-only [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format) as they become available, with the stream terminated by a `data: [DONE]` message. |
| temperature |     | number | Non-negative number. Return 422 if value is unsupported by model. |
| tool\_choice |     | [ChatCompletionToolChoiceOption](#chatcompletiontoolchoiceoption) | Controls which (if any) function is called by the model. `none` means the model will not call a function and instead generates a message. `auto` means the model can pick between generating a message or calling a function. Specifying a particular function via `{"type": "function", "function": {"name": "my_function"}}` forces the model to call that function.<br><br>`none` is the default when no functions are present. `auto` is the default if functions are present. Returns a 422 error if the tool is not supported by the model. |
| tools |     | [ChatCompletionTool](#chatcompletiontool)\[\] | A list of tools the model may call. Currently, only functions are supported as a tool. Use this to provide a list of functions the model may generate JSON inputs for. Returns a 422 error if the tool is not supported by the model. |
| top\_p |     | number | An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top\_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.<br><br>We generally recommend altering this or `temperature` but not both. |


## Responses

| Name | Type | Description |
| --- | --- | --- |
| 200 OK | [CreateChatCompletionResponse](#createchatcompletionresponse) | OK  |
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

Type: oauth2  
Flow: application  
Token URL: https://login.microsoftonline.com/common/oauth2/v2.0/token  

## Examples

### Creates a model response for the given chat conversation

#### Sample Request


```http
POST /chat/completions?api-version=2024-04-01-preview

{
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful assistant"
    },
    {
      "role": "user",
      "content": "Explain Riemann's conjecture"
    },
    {
      "role": "assistant",
      "content": "The Riemann Conjecture is a deep mathematical conjecture around prime numbers and how they can be predicted. It was first published in Riemann's groundbreaking 1859 paper. The conjecture states that the Riemann zeta function has its zeros only at the negative even integers and complex numbers with real part 1/21. Many consider it to be the most important unsolved problem in pure mathematics. The Riemann hypothesis is a way to predict the probability that numbers in a certain range are prime that was also devised by German mathematician Bernhard Riemann in 18594."
    },
    {
      "role": "user",
      "content": "Ist it proved?"
    }
  ],
  "frequency_penalty": 0,
  "presence_penalty": 0,
  "max_tokens": 256,
  "seed": 42,
  "stop": "<|endoftext|>",
  "stream": false,
  "temperature": 0,
  "top_p": 1,
  "response_format": { "type": "text" }
}
```

#### Sample Response

Status code: 200

```json
{
  "id": "1234567890",
  "model": "llama2-70b-chat",
  "choices": [
    {
      "index": 0,
      "finish_reason": "stop",
      "message": {
        "role": "assistant",
        "content": "No, it has never been proved"
      }
    }
  ],
  "created": 1234567890,
  "object": "chat.completion",
  "usage": {
    "prompt_tokens": 205,
    "completion_tokens": 5,
    "total_tokens": 210
  }
}
```

## Definitions


| Name | Description |
| --- | --- |
| [ChatCompletionRequestMessage](#chatcompletionrequestmessage) | |
| [ChatCompletionMessageContentPart](#chatcompletionmessagecontentpart) | |
| [ChatCompletionMessageContentPartType](#chatcompletionmessagecontentparttype)  | |
| [ChatCompletionToolChoiceOption](#chatcompletiontoolchoiceoption) | Controls which (if any) function is called by the model. `none` means the model will not call a function and instead generates a message. `auto` means the model can pick between generating a message or calling a function. Specifying a particular function via `{"type": "function", "function": {"name": "my_function"}}` forces the model to call that function.<br><br>`none` is the default when no functions are present. `auto` is the default if functions are present. Returns a 422 error if the tool is not supported by the model. |
| [ChatCompletionFinishReason](#chatcompletionfinishreason) | The reason the model stopped generating tokens. This will be `stop` if the model hit a natural stop point or a provided stop sequence, `length` if the maximum number of tokens specified in the request was reached, `content_filter` if content was omitted due to a flag from our content filters, `tool_calls` if the model called a tool. |
| [ChatCompletionMessageToolCall](#chatcompletionmessagetoolcall) |     |
| [ChatCompletionObject](#chatcompletionobject) | The object type, which is always `chat.completion`. |
| [ChatCompletionResponseFormat](#chatcompletionresponseformat) | The response format for the model response. Setting to `json_object` enables JSON mode, which guarantees the message the model generates is valid JSON. When using JSON mode, you **must** also instruct the model to produce JSON yourself via a system or user message. Also note that the message content may be partially cut off if `finish_reason="length"`, which indicates the generation exceeded `max_tokens` or the conversation exceeded the max context length.    |
| [ChatCompletionResponseFormatType](#chatcompletionresponseformattype) | The response format type. |
| [ChatCompletionResponseMessage](#chatcompletionresponsemessage) | A chat completion message generated by the model. |
| [ChatCompletionTool](#chatcompletiontool) |     |
| [ChatMessageRole](#chatmessagerole) | The role of the author of this message. |
| [Choices](#choices) | A list of chat completion choices. |
| [CompletionUsage](#completionusage) | Usage statistics for the completion request. |
| [ContentFilterError](#contentfiltererror) | The API call fails when the prompt triggers a content filter as configured. Modify the prompt and try again. |
| [CreateChatCompletionRequest](#createchatcompletionrequest) |     |
| [CreateChatCompletionResponse](#createchatcompletionresponse) | Represents a chat completion response returned by model, based on the provided input. |
| [Detail](#detail) | Details for the [UnprocessableContentError](#unprocessablecontenterror) error.    |
| [Function](#function) | The function that the model called. |
| [FunctionObject](#functionobject) | Definition of a function the model has access to.    |
| [ImageDetail](#imagedetail)  | Specifies the detail level of the image. |
| [NotFoundError](#notfounderror) | The route is not valid for the deployed model.    |
| [ToolType](#tooltype) | The type of the tool. Currently, only `function` is supported. |
| [TooManyRequestsError](#toomanyrequestserror) | You have hit your assigned rate limit and your requests need to be paced.     |
| [UnauthorizedError](#unauthorizederror) | Authentication is missing or invalid.    |
| [UnprocessableContentError](#unprocessablecontenterror) | The request contains unprocessable content. The error is returned when the payload indicated is valid according to this specification. However, some of the instructions indicated in the payload are not supported by the underlying model. Use the `details` section to understand the offending parameter.    |


### ChatCompletionFinishReason

The reason the model stopped generating tokens. This will be `stop` if the model hit a natural stop point or a provided stop sequence, `length` if the maximum number of tokens specified in the request was reached, `content_filter` if content was omitted due to a flag from our content filters, `tool_calls` if the model called a tool.


| Name | Type | Description |
| --- | --- | --- |
| content\_filter | string |     |
| length | string |     |
| stop | string |     |
| tool\_calls | string |     |

### ChatCompletionMessageToolCall


| Name | Type | Description |
| --- | --- | --- |
| function | [Function](#function) | The function that the model called. |
| ID  | string | The ID of the tool call. |
| type | [ToolType](#tooltype) | The type of the tool. Currently, only `function` is supported. |

### ChatCompletionObject

The object type, which is always `chat.completion`.


| Name | Type | Description |
| --- | --- | --- |
| chat.completion | string |     |

### ChatCompletionResponseFormat

The response format for the model response. Setting to `json_object` enables JSON mode, which guarantees the message the model generates is valid JSON. When using JSON mode, you **must** also instruct the model to produce JSON yourself via a system or user message. Also note that the message content may be partially cut off if `finish_reason="length"`, which indicates the generation exceeded `max_tokens` or the conversation exceeded the max context length.

| Name | Type | Description |
| --- | --- | --- |
| type | [ChatCompletionResponseFormatType](#chatcompletionresponseformattype) | The response format type. |

### ChatCompletionResponseFormatType

The response format type.

| Name | Type | Description |
| --- | --- | --- |
| json\_object | string |     |
| text | string |     |

### ChatCompletionResponseMessage

A chat completion message generated by the model.

| Name | Type | Description |
| --- | --- | --- |
| content | string | The contents of the message. |
| role | [ChatMessageRole](#chatmessagerole) | The role of the author of this message. |
| tool\_calls | [ChatCompletionMessageToolCall](#chatcompletionmessagetoolcall)\[\] | The tool calls generated by the model, such as function calls. |

### ChatCompletionTool


| Name | Type | Description |
| --- | --- | --- |
| function | [FunctionObject](#functionobject) |     |
| type | [ToolType](#tooltype) | The type of the tool. Currently, only `function` is supported. |

### ChatMessageRole

The role of the author of this message.

| Name | Type | Description |
| --- | --- | --- |
| assistant | string |     |
| system | string |     |
| tool | string |     |
| user | string |     |

### Choices

A list of chat completion choices. Can be more than one if `n` is greater than 1.

| Name | Type | Description |
| --- | --- | --- |
| finish\_reason | [ChatCompletionFinishReason](#chatcompletionfinishreason) | The reason the model stopped generating tokens. This will be `stop` if the model hit a natural stop point or a provided stop sequence, `length` if the maximum number of tokens specified in the request was reached, `content_filter` if content was omitted due to a flag from our content filters, `tool_calls` if the model called a tool. |
| index | integer | The index of the choice in the list of choices. |
| message | [ChatCompletionResponseMessage](#chatcompletionresponsemessage) | A chat completion message generated by the model. |

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

### CreateChatCompletionRequest

| Name | Type | Default Value | Description |
| --- | --- | --- | --- |
| frequency\_penalty | number | 0   | Helps prevent word repetitions by reducing the chance of a word being selected if it has already been used. The higher the frequency penalty, the less likely the model is to repeat the same words in its output. Return a 422 error if value or parameter is not supported by model. |
| max\_tokens | integer |     | The maximum number of tokens that can be generated in the chat completion.<br><br>The total length of input tokens and generated tokens is limited by the model's context length. Passing null causes the model to use its max context length. |
| messages | ChatCompletionRequestMessage\[\] |     | A list of messages comprising the conversation so far. Returns a 422 error if at least some of the messages can't be understood by the model. |
| presence\_penalty | number | 0   | Helps prevent the same topics from being repeated by penalizing a word if it exists in the completion already, even just once. Return a 422 error if value or parameter is not supported by model. |
| response\_format | [ChatCompletionResponseFormat](#chatcompletionresponseformat) | text |     |
| seed | integer |     | If specified, our system will make a best effort to sample deterministically, such that repeated requests with the same `seed` and parameters should return the same result. Determinism is not guaranteed, and you should refer to the `system_fingerprint` response parameter to monitor changes in the backend. |
| stop |     |     | Sequences where the API will stop generating further tokens. |
| stream | boolean | False | If set, partial message deltas will be sent. Tokens will be sent as data-only [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format) as they become available, with the stream terminated by a `data: [DONE]` message. |
| temperature | number | 1   | Non-negative number. Return 422 if value is unsupported by model. |
| tool\_choice | [ChatCompletionToolChoiceOption](#chatcompletiontoolchoiceoption) |     | Controls which (if any) function is called by the model. `none` means the model will not call a function and instead generates a message. `auto` means the model can pick between generating a message or calling a function. Specifying a particular function via `{"type": "function", "function": {"name": "my_function"}}` forces the model to call that function.<br><br>`none` is the default when no functions are present. `auto` is the default if functions are present. Returns a 422 error if the tool is not supported by the model. |
| tools | [ChatCompletionTool](#chatcompletiontool)\[\] |     | A list of tools the model may call. Currently, only functions are supported as a tool. Use this to provide a list of functions the model may generate JSON inputs for. Returns a 422 error if the tool is not supported by the model. |
| top\_p | number | 1   | An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top\_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.<br><br>We generally recommend altering this or `temperature` but not both. |

### ChatCompletionRequestMessage

| Name | Type | Description |
| --- | --- | --- |
| content | string or [ChatCompletionMessageContentPart](#chatcompletionmessagecontentpart)[] | The contents of the message. |
| role | [ChatMessageRole](#chatmessagerole) | The role of the author of this message. |
| tool\_calls | [ChatCompletionMessageToolCall](#chatcompletionmessagetoolcall)\[\] | The tool calls generated by the model, such as function calls. |

### ChatCompletionMessageContentPart

| Name | Type | Description |
| --- | --- | --- |
| content | string | Either a URL of the image or the base64 encoded image data. |
| detail | [ImageDetail](#imagedetail) | Specifies the detail level of the image. |
| type | [ChatCompletionMessageContentPartType](#chatcompletionmessagecontentparttype) | The type of the content part. |

### ChatCompletionMessageContentPartType

| Name | Type | Description |
| --- | --- | --- |
| text | string |  |
| image | string |  |
| image_url | string |  |

### ChatCompletionToolChoiceOption

Controls which (if any) tool is called by the model.

| Name | Type | Description |
| --- | --- | --- |
| none | string | The model will not call any tool and instead generates a message. |
| auto | string | The model can pick between generating a message or calling one or more tools. |
| required | string | The model must call one or more tools. |
| | string | Specifying a particular tool via `{"type": "function", "function": {"name": "my_function"}}` forces the model to call that tool. |

### ImageDetail

Specifies the detail level of the image.

| Name | Type | Description |
| --- | --- | --- |
| auto | string |  |
| low | string |  |
| high | string |  |


### CreateChatCompletionResponse

Represents a chat completion response returned by model, based on the provided input.

| Name | Type | Description |
| --- | --- | --- |
| choices | [Choices](#choices)\[\] | A list of chat completion choices. Can be more than one if `n` is greater than 1. |
| created | integer | The Unix timestamp (in seconds) of when the chat completion was created. |
| ID  | string | A unique identifier for the chat completion. |
| model | string | The model used for the chat completion. |
| object | [ChatCompletionObject](#chatcompletionobject) | The object type, which is always `chat.completion`. |
| system\_fingerprint | string | This fingerprint represents the backend configuration that the model runs with.<br><br>Can be used in conjunction with the `seed` request parameter to understand when backend changes have been made that might impact determinism. |
| usage | [CompletionUsage](#completionusage) | Usage statistics for the completion request. |

### Detail

Details for the [UnprocessableContentError](#unprocessablecontenterror) error.

| Name | Type | Description |
| --- | --- | --- |
| loc | string\[\] | The parameter causing the issue |
| value | string | The value passed to the parameter causing issues. |

### Function

The function that the model called.

| Name | Type | Description |
| --- | --- | --- |
| arguments | string | The arguments to call the function with, as generated by the model in JSON format. Note that the model does not always generate valid JSON, and may generate incorrect parameters not defined by your function schema. Validate the arguments in your code before calling your function. |
| name | string | The name of the function to call. |

### FunctionObject

Definition of a function the model has access to.

| Name | Type | Description |
| --- | --- | --- |
| description | string | A description of what the function does, used by the model to choose when and how to call the function. |
| name | string | The name of the function to be called. Must be a-z, A-Z, 0-9, or contain underscores and dashes, with a maximum length of 64. |
| parameters | object | The parameters the functions accepts, described as a JSON Schema object. Omitting `parameters` defines a function with an empty parameter list. |

### NotFoundError


| Name | Type | Description |
| --- | --- | --- |
| error | string | The error description. |
| message | string | The error message. |
| status | integer | The HTTP status code. |

### ToolType

The type of the tool. Currently, only `function` is supported.


| Name | Type | Description |
| --- | --- | --- |
| function | string |     |

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

The request contains unprocessable content. The error is returned when the payload indicated is valid according to this specification. However, some of the instructions indicated in the payload are not supported by the underlying model. Use the `details` section to understand the offending parameter.

| Name | Type | Description |
| --- | --- | --- |
| code | string | The error code. |
| detail | [Detail](#detail) |     |
| error | string | The error description. |
| message | string | The error message. |
| status | integer | The HTTP status code. |
