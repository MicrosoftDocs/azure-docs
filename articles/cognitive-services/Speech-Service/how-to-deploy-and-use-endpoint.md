---
title: How to deploy and use voice model - Speech service
titleSuffix: Azure Cognitive Services
description: Learn about how to deploy and use a custom neural voice model.
services: cognitive-services
author: Ling-Cao
manager: qiliao123
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 1/20/2022
ms.author: caoling
---

# Deploy and use your voice model

After you've successfully created and tested your voice model, you deploy it in a custom text-to-speech endpoint. Use this endpoint instead of the usual endpoint when you're making text-to-speech requests through the REST API. The subscription that you've used to deploy the model is the only one that can call your custom endpoint.

## Create and use a Custom Neural Voice endpoint

To create a Custom Neural Voice endpoint:

1. On the **Deploy model** tab, select **Deploy model**. 
1. Enter a **Name** and **Description** for your custom endpoint.
1. Select a voice model that you want to associate with this endpoint. 
1. Select **Deploy** to create your endpoint.

In the endpoint table, you now see an entry for your new endpoint. It might take a few minutes to instantiate a new endpoint. When the status of the deployment is **Succeeded**, the endpoint is ready for use.

You can suspend and resume your endpoint if you don't use it all the time. When an endpoint is reactivated after suspension, the endpoint URL is retained, so you don't need to change your code in your apps. 

You can also update the endpoint to a new model. To change the model, make sure the new model is named the same as the one you want to update. 

> [!NOTE]
>- Standard subscription (S0) users can create up to 50 endpoints, each with its own custom neural voice.
>- To use your custom neural voice, you must specify the voice model name, use the custom URI directly in an HTTP request, and use the same subscription to pass through the authentication of the text-to-speech service.

After your endpoint is deployed, the endpoint name appears as a link. Select the link to display information specific to your endpoint, such as the endpoint key, endpoint URL, and sample code.

The custom endpoint is functionally identical to the standard endpoint that's used for text-to-speech requests. For more information, see the [Speech SDK](./get-started-text-to-speech.md) or [REST API](rest-text-to-speech.md).

[Audio Content Creation](https://speech.microsoft.com/audiocontentcreation) is a tool that allows you to fine-tune audio output by using a friendly UI.

## Copy your voice model to another projects or regions

You can copy your voice model to another project or other regions. Do the following steps to easily deploy the voice model to a different region or project.

1. On the **Train model** tab, select a voice model you want to copy, and select **Copy to project** , as shown below.

   :::image type="content" source="media/custom-voice/copy-to-project.png" alt-text="Copy to project":::

2. Next, select the target **Region**, **Speech resource**, and **Project**, as shown in the screenshot below. If no speech resource or project is found in the target region, you need to follow the instructions displayed to create one. Select **Submit** to copy the model.

    :::image type="content" source="media/custom-voice/copy-voice-model.png" alt-text="Copy voice model":::

3. Then, after you successfully copy the model, select **View model** under the notification message to go into the target **Train model** page.
4. Finally, select the newly copied model and **Deploy model**.

> [!NOTE]
> Custom neural voice training is only available in the three regions: East US, Southeast Asia, and UK South. But you can easily copy a neural voice model from the three regions to other different regions. Check the regions supported for Custom Neural Voice: [regions for Custom Neural Voice](regions.md#text-to-speech).

## How to suspend and resume endpoint

You can **Suspend** and **Resume** your endpoint if you don't use it all the time. With endpoint **Suspend** and **Resume** functions, you can flexibly control the endpoint hosting status and save the hosting costs. The charging will stop once the endpoint is suspended, meanwhile it can’t be used to synthesize speech until you resume it successfully. When an endpoint is reactivated after suspension, the endpoint URL will be kept the same so you don't need to change your code in your apps.

You can suspend and resume endpoint via portal or REST API.

> [!NOTE]
> The Suspend or Resume operation will take a while to complete, the Suspend time should be short and the Resume time should be similar to the deployment time.

### Suspend and resume endpoint via portal

The following section describes how to suspend or resume a custom neural voice endpoint via portal.

#### Suspend endpoint

1. On the **Deploy model** tab of [Speech Studio](https://aka.ms/custom-voice-portal), select the endpoint you want to suspend.

   :::image type="content" source="media/custom-voice/select-endpoint.png" alt-text="select endpoint":::

2. Select **Suspend** option above or the option displayed on the endpoint details page to suspend the endpoint. 

   :::image type="content" source="media/custom-voice/select-suspend.png" alt-text="select suspend":::

3. Select **Submit** to suspend the endpoint.

   :::image type="content" source="media/custom-voice/suspend-endpoint.png" alt-text="suspend endpoint":::

#### Endpoint status after suspension

After you successfully suspend the endpoint, the status will become **Suspended** from **Succeeded**, as shown below.

:::image type="content" source="media/custom-voice/status-after-suspension.png" alt-text="status after suspension":::

#### Resume endpoint

1. To reactivate your endpoint, select **Resume** option shown below or the option displayed on the endpoint details page.

   :::image type="content" source="media/custom-voice/select-resume.png" alt-text="select resume":::

2. Select **Submit** to resume the endpoint. 

   :::image type="content" source="media/custom-voice/resume-endpoint.png" alt-text="resume endpoint":::

####  Endpoint status after resumption

After you successfully reactivate the endpoint, the status will change back to  **Succeeded**, as shown below.

:::image type="content" source="media/custom-voice/status-after-resumption.png" alt-text="status after resumption":::

### Suspend and resume endpoint via REST API

This section will show you how to suspend or resume a custom neural voice endpoint via REST API.

#### Prerequisites

For an existing endpoint you want to suspend or resume, you'll need to prepare:

* The identifier of the endpoint (Deployment ID).

* The Azure region the endpoint is associated with.

* The subscription key the endpoint is associated with (Endpoint key).

Go to **Deploy model** tab on the [Speech Studio](https://aka.ms/custom-voice-portal) to select the endpoint, then you can get the above parameters on the endpoint details page as shown below.

:::image type="content" source="media/custom-voice/endpoint-parameter-for-rest-api.png" alt-text="Endpoint parameter for rest API":::

#### Suspend endpoint

Suspend the endpoint identified by the given ID, which applies to the endpoint in `Succeeded` status.

1. Follow the sample request below to call the API, and you'll receive the response with `HTTP 202 Status code`.

   To replace the request parameters, refer to the [Request parameter](#request-parameter).

2. Follow the [Get endpoint](#get-endpoint) steps to track the operation progress. You can poll the get endpoint API in a loop until the status becomes `Disabled`, and the status property will change from `Succeeded` status, to `Disabling`, and finally to `Disabled`.

##### Sample request

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

##### Sample response

Status code: 202 Accepted

For details, see [Response header](#response-header).

#### Resume endpoint

Resume the endpoint identified by the given ID, which applies to the endpoint in `Disabled` status.

1. Follow the sample request below to call the API, and you'll receive the response with `HTTP 202 Status code`.

   To replace the request parameters, refer to the [Request parameter](#request-parameter).

2. Follow the [Get endpoint](#get-endpoint) steps to track the operation progress. You can poll the API in a loop until the status becomes `Succeeded` or `Disabled`, and the status property will change from `Disabled` status, to `Running`, and finally to `Succeeded` or `Disabled` if failed.

##### Sample request

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

##### Sample response

Status code: 202 Accepted

For details, see [Response header](#response-header).

#### Get endpoint

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

##### Sample request

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

##### Sample response

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

#### Request parameter

Replace the parameters with proper data you found at [Prerequisites](#prerequisites) step.

| Name                        | In     | Required | Type   | Description                                                                    |
| --------------------------- | ------ | -------- | ------ | ------------------------------------------------------------------------------ |
| `Region` | Path   | `True` | string | <REGION_IDENTIFIER> - The Azure region the endpoint is associated with.        |
| `Endpoint_ID` | Path   | `True` | string | <Endpoint_ID> - The identifier of the endpoint.                                |
| `Ocp-Apim-Subscription-Key` | Header | `True` | string | <YOUR_SUBSCRIPTION_KEY > The subscription key the endpoint is associated with. |

#### Response header

Status code: 202 Accepted

| Name          | Type   | Description                                                                      |
| ------------- | ------ | -------------------------------------------------------------------------------- |
| `Location` | string | The location of the endpoint that can be used as the full URL to get endpoint. |
| `Retry-After` | string | The total seconds of recommended interval to retry to get endpoint status.       |

#### HTTP status codes

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
