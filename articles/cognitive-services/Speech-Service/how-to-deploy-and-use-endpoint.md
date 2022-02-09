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

## Create a Custom Neural Voice endpoint

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

## Copy your voice model to another project

You can copy your voice model to another project for the same region or another region. Do the following steps to easily deploy the voice model to a different region or project.

To Copy your voice model to another project:

1. On the **Train model** tab, select a voice model that you want to copy, and then select **Copy to project**.

   :::image type="content" source="media/custom-voice/copy-to-project.png" alt-text="Copy to project":::

1. Select the **Region**, **Speech resource**, and **Project** where you want to copy the model. You must have a speech resource and project in the target region, otherwise you need to create them first. 

    :::image type="content" source="media/custom-voice/copy-voice-model.png" alt-text="Copy voice model":::

1. Select **Submit** to copy the model.
1. Select **View model** under the notification message for copy success. 
1. On the **Train model** page, select the newly copied model and then select **Deploy model**.

> [!NOTE]
> Custom Neural Voice training is only available in the three regions: East US, Southeast Asia, and UK South. But you can easily copy a neural voice model from the three regions to other regions. For more information, see the [regions for Custom Neural Voice](regions.md#text-to-speech).

## Suspend and resume an endpoint

You can suspend or resume an endpoint, to limit spend and conserve resources that are not in use. You will not be charged while the endpoint is suspended. When you resume an endpoint, you can use the same endpoint URL in your application to synthesize speech. 

You can suspend and resume an endpoint in Speech Studio or via the REST API.

> [!NOTE]
> The suspend operation will complete almost immediately. The resume operation completes in about the same amount of time as a new deployment. 

### Suspend and resume an endpoint in Speech Studio

This section describes how to suspend or resume a custom neural voice endpoint in the Speech Studio portal.

#### Suspend endpoint

1. To suspend and deactivate your endpoint, select **Suspend** from the **Deploy** tab in [Speech Studio](https://aka.ms/custom-voice-portal).

   :::image type="content" source="media/custom-voice/cnv-endpoint-suspend.png" alt-text="Screenshot of the select suspend endpoint option":::

1. In the dialog box that appears, select **Submit**. After the endpoint is suspended, Speech Studio will show the **Successfully suspended endpoint** notification.

#### Resume endpoint

1. To resume and activate your endpoint, select **Resume** from the **Deploy** tab in [Speech Studio](https://aka.ms/custom-voice-portal).

   :::image type="content" source="media/custom-voice/cnv-endpoint-resume.png" alt-text="Screenshot of the select resume endpoint option":::

1. In the dialog box that appears, select **Submit**. After you successfully reactivate the endpoint, the status will change from **Suspended** to **Succeeded**.

### Suspend and resume endpoint via REST API

This section will show you how to [get](#get-endpoint), [suspend](#suspend-endpoint), or [resume](#resume-endpoint) a custom neural voice endpoint via REST API.

#### Request parameters

You use these request parameters with calls to the REST API.

| Name                        | Location     | Required | Type   | Description                                                                    |
| --------------------------- | ------ | -------- | ------ | ------------------------------------------------------------------------------ |
| `YourServiceRegion` | Path   | `True` | string | The Azure region the endpoint is associated with.        |
| `YourEndpointId` | Path   | `True` | string | The identifier of the endpoint.                                |
| `Ocp-Apim-Subscription-Key` | Header | `True` | string | The subscription key the endpoint is associated with. |

The application settings are available on the **Deploy model** tab in [Speech Studio](https://aka.ms/custom-voice-portal).

:::image type="content" source="./media/custom-voice/cnv-endpoint-app-settings-zoom.png" alt-text="Screenshot of custom endpoint app settings in Speech Studio." lightbox="./media/custom-voice/cnv-endpoint-app-settings-full.png":::

* The **Endpoint key** shows the subscription key the endpoint is associated with. Use the endpoint key as the value of your `Ocp-Apim-Subscription-Key` request header. 
* The **Endpoint URL** shows your service region. Use the value that precedes `voice.speech.microsoft.com` as your service region request parameter. For example, use `eastus` if the endpoint URL is `https://eastus.voice.speech.microsoft.com/cognitiveservices/v1`.
* The **Endpoint URL** shows your endpoint ID. Use the value appended to the `?deploymentId=` query parameter as the value of your endpoint ID request parameter.
* The Azure region the endpoint is associated with.


#### Get endpoint

Get the endpoint by endpoint ID. The operation returns details about an endpoint such as model ID, project ID, and status.  

For example, you can check the status property in response payload to track the progress for [suspend](#suspend-endpoint) or [resume](#resume-endpoint) operations.

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

##### Request example

For information about endpoint ID, region, and subscription key parameters, see [request parameters](#request-parameters) and [application settings](#application-settings).

HTTP example:

```HTTP
GET api/texttospeech/v3.0/endpoints/<YourEndpointId> HTTP/1.1
Ocp-Apim-Subscription-Key: YourSubscriptionKey
Host: <YourServiceRegion>.customvoice.api.speech.microsoft.com
```

cURL example:

```Console
curl -v -X GET "https://<YourServiceRegion>.customvoice.api.speech.microsoft.com/api/texttospeech/v3.0/endpoints/<YourEndpointId>" -H "Ocp-Apim-Subscription-Key: <YourSubscriptionKey >"
```

Response header example:

```
Status code: 202 OK
```

Response body example:

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

#### Suspend endpoint

Suspend the endpoint identified by the given ID, which applies to the endpoint in `Succeeded` status.

Follow the sample request below to call the API, and you'll receive the response with `HTTP 202 Status code`.

Follow the [Get endpoint](#get-endpoint) steps to track the operation progress. You can poll the get endpoint API in a loop until the status becomes `Disabled`, and the status property will change from `Succeeded` status, to `Disabling`, and finally to `Disabled`.

##### Request example

For information about endpoint ID, region, and subscription key parameters, see [request parameters](#request-parameters) and [application settings](#application-settings).

HTTP example:

```HTTP
POST api/texttospeech/v3.0/endpoints/<YourEndpointId>/suspend HTTP/1.1
Ocp-Apim-Subscription-Key: YourSubscriptionKey
Host: <YourServiceRegion>.customvoice.api.speech.microsoft.com
Content-Type: application/json
Content-Length: 0
```

cURL example:

```Console
curl -v -X POST "https://<YourServiceRegion>.customvoice.api.speech.microsoft.com/api/texttospeech/v3.0/endpoints/<YourEndpointId>/suspend" -H "Ocp-Apim-Subscription-Key: <YourSubscriptionKey >" -H "content-type: application/json" -H "content-length: 0"
```

Response header example:

```
Status code: 202 Accepted
```

For more information, see [response header](#response-header).

#### Resume endpoint

Resume the endpoint identified by the given ID, which applies to the endpoint in `Disabled` status.

Follow the sample request below to call the API, and you'll receive the response with `HTTP 202 Status code`.

Follow the [Get endpoint](#get-endpoint) steps to track the operation progress. You can poll the API in a loop until the status becomes `Succeeded` or `Disabled`, and the status property will change from `Disabled` status, to `Running`, and finally to `Succeeded` or `Disabled` if failed.

For information about endpoint ID, region, and subscription key parameters, see [request parameters](#request-parameters) and [application settings](#application-settings).

HTTP example:

```HTTP
POST api/texttospeech/v3.0/endpoints/<YourEndpointId>/resume HTTP/1.1
Ocp-Apim-Subscription-Key: YourSubscriptionKey
Host: <YourServiceRegion>.customvoice.api.speech.microsoft.com
Content-Type: application/json
Content-Length: 0
```

cURL example:

```Console
curl -v -X POST "https://<YourServiceRegion>.customvoice.api.speech.microsoft.com/api/texttospeech/v3.0/endpoints/<YourEndpointId>/resume" -H "Ocp-Apim-Subscription-Key: <YourSubscriptionKey >" -H "content-type: application/json" -H "content-length: 0"
```

Response header example:
```
Status code: 202 Accepted
```

For more information, see [response header](#response-header).

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
