---
title: How to deploy and use endpoint - Speech service
titleSuffix: Azure Cognitive Services
description: Learn about how to deploy and use a custom neural voice endpoint.
services: cognitive-services
author: Ling-Cao
manager: qiliao123
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 1/20/2022
ms.author: caoling
---

# Deploy and use your endpoint

After you've successfully created and tested your voice model, you deploy it in a custom Text-to-Speech endpoint. You then use this endpoint in place of the usual endpoint when making Text-to-Speech requests through the REST API. Your custom endpoint can be called only by the subscription that you've used to deploy the model.

## Deploy a custom neural voice endpoint

You can do the following to create a custom neural voice endpoint.

1. On the **Deploy model** tab, select **Deploy model**. 
2. Next, select a voice model you would like to associate with this endpoint. 
3. Then, enter a **Name** and **Description** for your custom endpoint.
4. Finally, select **Deploy** to create your endpoint.

After you've clicked the **Deploy** button, in the endpoint table, you'll see an entry for your new endpoint. It may take a few minutes to instantiate a new endpoint. When the status of the deployment is **Succeeded**, the endpoint is ready for use.

You can **Suspend** and **Resume** your endpoint if you don't use it all the time. When an endpoint is reactivated after suspension, the endpoint URL will be kept the same so you don't need to change your code in your apps.  You can also suspend and resume endpoint via REST API. Read the following section to see how to suspend and resume endpoint via REST API.

You can also update the endpoint to a new model. To change the model, make sure the new model is named the same as the one you want to update. 

> [!NOTE]
>- Standard subscription (S0) users can create up to 50 endpoints, each with its own custom neural voice.
>- To use your custom neural voice, you must specify the voice model name, use the custom URI directly in an HTTP request, and use the same subscription to pass through the authentication of TTS service.

After your endpoint is deployed, the endpoint name appears as a link. Select the endpoint name to display information specific to your endpoint, such as the endpoint key, endpoint URL, and sample code.

The custom endpoint is functionally identical to the standard endpoint that's used for Text-to-Speech requests.  For more information, see [Speech SDK](./get-started-text-to-speech.md) or [REST API](rest-text-to-speech.md).

We also provide an online tool, [Audio Content Creation](https://speech.microsoft.com/audiocontentcreation), that allows you to fine-tune their audio output using a friendly UI.

## How to suspend and resume endpoint via REST API

With endpoint Suspend and Resume functions, you can flexibly control the endpoint hosting status and save the hosting costs. The charging will stop once the endpoint is suspended, meanwhile it can’t be used to synthesize speech until you resume it successfully.

> [!NOTE]
> The Suspend or Resume operation will take a while to complete, the Suspend time should be short and the Resume time should be similar to the deployment time.

This section will show you how to suspend or resume a Custom Voice endpoint via REST API.

> [!Tip]
> The endpoint Suspend and Resume functions have been supported on [Speech Studio portal](https://aka.ms/custom-voice-portal) too.

### Prerequisites

For an existing endpoint you want to suspend or resume, you'll need to prepare:

* The identifier of the endpoint (Deployment ID).

* The Azure region the endpoint is associated with.

* The subscription key the endpoint is associated with (Endpoint key).

Go to [Speech Studio](https://aka.ms/custom-voice-portal) to select your custom neural voice endpoint, then you can get the above parameters on the endpoint details page as shown below.

:::image type="content" source="media/custom-voice/endpoint-parameter-for-rest-api.png" alt-text="Endpoint parameter for rest API":::

### Suspend endpoint

Suspend the endpoint identified by the given ID, which applies to the endpoint in `Succeeded` status.

1. Follow the sample request below to call the API, and you'll receive the response with `HTTP 202 Status code`.

   To replace the request parameters, refer to the [Request parameter](#request-parameter).

2. Follow the [Get endpoint](#get-endpoint) steps to track the operation progress. You can poll the get endpoint API in a loop until the status becomes `Disabled`, and the status property will change from `Succeeded` status, to `Disabling`, and finally to `Disabled`.

#### Sample request

HTTP sample

```HTTP
POST api/texttospeech/v3.0/endpoints/<Endpoint_ID>/suspend HTTP/1.1
Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY
Host: <REGION_IDENTIFIER>.customvoice.api.speech.microsoft.com
Content-Type: application/json
Content-Length: 0
```

cURL sample - Run with command-line tool in Linux (and in the Windows Subsystem for Linux).

```Console
curl -v -X POST "https://<REGION_IDENTIFIER>.customvoice.api.speech.microsoft.com/api/texttospeech/v3.0/endpoints/<Endpoint_ID>/suspend" -H "Ocp-Apim-Subscription-Key: <YOUR_SUBSCRIPTION_KEY >" -H "content-type: application/json" -H "content-length: 0"
```

#### Sample response

Status code: 202 Accepted

For details, see [Response header](#response-header).

### Resume endpoint

Resume the endpoint identified by the given ID, which applies to the endpoint in `Disabled` status.

1. Follow the sample request below to call the API, and you'll receive the response with `HTTP 202 Status code`.

   To replace the request parameters, refer to the [Request parameter](#request-parameter).

2. Follow the [Get endpoint](#get-endpoint) steps to track the operation progress. You can poll the API in a loop until the status becomes `Succeeded` or `Disabled`, and the status property will change from `Disabled` status, to `Running`, and finally to `Succeeded` or `Disabled` if failed.

#### Sample request

HTTP sample

```HTTP
POST api/texttospeech/v3.0/endpoints/<Endpoint_ID>/resume HTTP/1.1
Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY
Host: <REGION_IDENTIFIER>.customvoice.api.speech.microsoft.com
Content-Type: application/json
Content-Length: 0
```

cURL sample - Run with command-line tool in Linux (and in the Windows Subsystem for Linux).

```Console
curl -v -X POST "https://<REGION_IDENTIFIER>.customvoice.api.speech.microsoft.com/api/texttospeech/v3.0/endpoints/<Endpoint_ID>/resume" -H "Ocp-Apim-Subscription-Key: <YOUR_SUBSCRIPTION_KEY >" -H "content-type: application/json" -H "content-length: 0"
```

#### Sample response

Status code: 202 Accepted

For details, see [Response header](#response-header).

### Get endpoint

Get the endpoint identified by the given ID, this API allows you to query the details of the endpoint.

1. Follow the sample request below to call the API.

   To replace the request parameters, refer to the [Request parameter](#request-parameter).

2. Check the status property in response payload to track the progress for Suspend or Resume operation.

The definition of status property:

| Status | Description |
| ------------- | ------------------------------------------------------------ |
| `NotStarted` | The endpoint is waiting for processing for Deploy, and it's not ready to synthesize speech. |
| `Running` | The endpoint is in processing state for Deploy or Resume, and it's not ready to synthesize speech. |
| `Succeeded` | The endpoint succeeded to Deploy or Resume, and it's ready to synthesize speech. |
| `Failed` | The endpoint is in processing state for Suspend. |
| `Disabling` | The endpoint is waiting for processing for Deploy, and it's not ready to synthesize speech. |
| `Disabled` | The endpoint succeeded to Suspend or failed to Resume. |

> [!Tip]
> If the status goes to `Failed` or `Disabled` for Resume, you can check the `properties.error` for the detailed error message.

#### Sample request

HTTP sample

```HTTP
GET api/texttospeech/v3.0/endpoints/<Endpoint_ID> HTTP/1.1
Ocp-Apim-Subscription-Key: YOUR_SUBSCRIPTION_KEY
Host: <REGION_IDENTIFIER>.customvoice.api.speech.microsoft.com
```

cURL sample - Run with command-line tool in Linux (and in the Windows Subsystem for Linux).

```Console
curl -v -X GET "https://<REGION_IDENTIFIER>.customvoice.api.speech.microsoft.com/api/texttospeech/v3.0/endpoints/<Endpoint_ID>" -H "Ocp-Apim-Subscription-Key: <YOUR_SUBSCRIPTION_KEY >"
```

#### Sample response

Status code: 200 OK

```json
{
  "model": {
    "id": "a92aa4b5-30f5-40db-820c-d2d57353de44"
  },
  "project": {
    "id": "ffc87aba-9f5f-4bfa-9923-b98186591a79"
  },
  "properties": {},
  "status": "Succeeded",
  "lastActionDateTime": "2019-01-07T11:36:07Z",
  "id": "e7ffdf12-17c7-4421-9428-a7235931a653",
  "createdDateTime": "2019-01-07T11:34:12Z",
  "locale": "en-US",
  "name": "Voice endpoint",
  "description": "Example for voice endpoint"
}
```

### Request parameter

Replace the parameters with proper data you found at [Prerequisites](#prerequisites) step.

| Name                        | In     | Required | Type   | Description                                                                    |
| --------------------------- | ------ | -------- | ------ | ------------------------------------------------------------------------------ |
| `Region` | Path   | `True` | string | <REGION_IDENTIFIER> - The Azure region the endpoint is associated with.        |
| `Endpoint_ID` | Path   | `True` | string | <Endpoint_ID> - The identifier of the endpoint.                                |
| `Ocp-Apim-Subscription-Key` | Header | `True` | string | <YOUR_SUBSCRIPTION_KEY > The subscription key the endpoint is associated with. |

### Response header

Status code: 202 Accepted

| Name          | Type   | Description                                                                      |
| ------------- | ------ | -------------------------------------------------------------------------------- |
| `Location` | string | The location of the endpoint that can be used as the full URL to get endpoint. |
| `Retry-After` | string | The total seconds of recommended interval to retry to get endpoint status.       |

### HTTP status codes

The HTTP status code for each response indicates success or common errors.

| HTTP status code | Description       | Possible reason                                                                                                                                                           |
| ---------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 200              | OK                | The request was successful.                                                                                                                                               |
| 202              | Accepted          | The request has been accepted for processing, but the processing hasn't been completed.                                                                                  |
| 400              | Bad Request       | A required parameter is missing, empty, or null. Or, the value passed to either a required or optional parameter is invalid. A common issue is a header that is too long. |
| 401              | Unauthorized      | The request isn't authorized. Check to make sure your subscription key or token is valid and in the correct region.                                                      |
| 429              | Too Many Requests | You've exceeded the quota or rate of requests allowed for your subscription.                                                                                            |
| 502              | Bad Gateway       | Network or server-side issue. May also indicate invalid headers.                                                                                                          |

## Next steps

- [How to record voice samples](record-custom-voice-samples.md)
- [Text-to-Speech API reference](rest-text-to-speech.md)
- [Long Audio API](long-audio-api.md)