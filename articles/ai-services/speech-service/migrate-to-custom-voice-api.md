---
title: Migrate to custom voice REST API - Speech service
titleSuffix: Azure AI services
description: This document helps developers migrate code from v3 text to speech REST API to custom voice REST API.
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 11/30/2023
ms.author: eur
---

# Migrate to custom voice REST API

The custom voice REST API is a new version of the text to speech REST API. It's used to deploy and use custom neural voice models. The custom voice REST API is currently in preview. 

In this article, you'll learn how to migrate code from the v3 text to speech REST API to the custom voice REST API.

This article retains information about the v3 text to speech REST API for reference. But you should use the custom voice REST API for new development.

## Required changes

**Suspend endpoint:** Use the custom voice API [suspend endpoint](./professional-voice-deploy-endpoint.md?pivots=rest-api#suspend-an-endpoint) operation to suspend an endpoint. The v3 text to speech REST API [suspend endpoint operation](#suspend-endpoint) is retiring.

**Resume endpoint:** Use the custom voice API [resume endpoint](./professional-voice-deploy-endpoint.md?pivots=rest-api#resume-an-endpoint) operation to suspend an endpoint. The v3 text to speech REST API [resume endpoint operation](#resume-endpoint) is retiring.

## Reference documentation for v3 text to speech REST API (retiring)

### Suspend and resume endpoint via REST API

This section will show you how to [get](#get-endpoint), [suspend](#suspend-endpoint), or [resume](#resume-endpoint) a custom neural voice endpoint via REST API.


#### Get endpoint

Get the endpoint by endpoint ID. The operation returns details about an endpoint such as model ID, project ID, and status.  

For example, you might want to track the status progression for [suspend](#suspend-endpoint) or [resume](#resume-endpoint) operations. Use the `status` property in the response payload to determine the status of the endpoint.

The possible `status` property values are:

| Status | Description |
| ------------- | ------------------------------------------------------------ |
| `NotStarted` | The endpoint hasn't yet been deployed, and it's not available for speech synthesis. |
| `Running` | The endpoint is in the process of being deployed or resumed, and it's not available for speech synthesis. |
| `Succeeded` | The endpoint is active and available for speech synthesis. The endpoint has been deployed or the resume operation succeeded. |
| `Failed` | The endpoint deploy or suspend operation failed. The endpoint can only be viewed or deleted in [Speech Studio](https://aka.ms/custom-voice-portal).|
| `Disabling` | The endpoint is in the process of being suspended, and it's not available for speech synthesis. |
| `Disabled` | The endpoint is inactive, and it's not available for speech synthesis. The suspend operation succeeded or the resume operation failed. |

> [!Tip]
> If the status is `Failed` or `Disabled`, check `properties.error` for a detailed error message. However, there won't be error details if the status is `Disabled` due to a successful suspend operation. 

##### Get endpoint example

For information about endpoint ID, region, and Speech resource key parameters, see [request parameters](#request-parameters).

HTTP example:

```HTTP
GET api/texttospeech/v3.0/endpoints/<YourEndpointId> HTTP/1.1
Ocp-Apim-Subscription-Key: YourResourceKey
Host: <YourResourceRegion>.customvoice.api.speech.microsoft.com
```

cURL example:

```Console
curl -v -X GET "https://<YourResourceRegion>.customvoice.api.speech.microsoft.com/api/texttospeech/v3.0/endpoints/<YourEndpointId>" -H "Ocp-Apim-Subscription-Key: <YourResourceKey >"
```

Response header example:

```
Status code: 200 OK
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

You can suspend an endpoint to limit spend and conserve resources that aren't in use. You won't be charged while the endpoint is suspended. When you resume an endpoint, you can use the same endpoint URL in your application to synthesize speech. 

You suspend an endpoint with its unique deployment ID. The endpoint status must be `Succeeded` before you can suspend it.

Use the [get endpoint](#get-endpoint) operation to poll and track the status progression from `Succeeded`, to `Disabling`, and finally to `Disabled`. 

##### Suspend endpoint example

For information about endpoint ID, region, and Speech resource key parameters, see [request parameters](#request-parameters).

HTTP example:

```HTTP
POST api/texttospeech/v3.0/endpoints/<YourEndpointId>/suspend HTTP/1.1
Ocp-Apim-Subscription-Key: YourResourceKey
Host: <YourResourceRegion>.customvoice.api.speech.microsoft.com
Content-Type: application/json
Content-Length: 0
```

cURL example:

```Console
curl -v -X POST "https://<YourResourceRegion>.customvoice.api.speech.microsoft.com/api/texttospeech/v3.0/endpoints/<YourEndpointId>/suspend" -H "Ocp-Apim-Subscription-Key: <YourResourceKey >" -H "content-type: application/json" -H "content-length: 0"
```

Response header example:

```
Status code: 202 Accepted
```

For more information, see [response headers](#response-headers).

#### Resume endpoint

When you resume an endpoint, you can use the same endpoint URL that you used before it was suspended. 

You resume an endpoint with its unique deployment ID. The endpoint status must be `Disabled` before you can resume it.

Use the [get endpoint](#get-endpoint) operation to poll and track the status progression from `Disabled`, to `Running`, and finally to `Succeeded`. If the resume operation failed, the endpoint status will be `Disabled`. 

##### Resume endpoint example

For information about endpoint ID, region, and Speech resource key parameters, see [request parameters](#request-parameters).

HTTP example:

```HTTP
POST api/texttospeech/v3.0/endpoints/<YourEndpointId>/resume HTTP/1.1
Ocp-Apim-Subscription-Key: YourResourceKey
Host: <YourResourceRegion>.customvoice.api.speech.microsoft.com
Content-Type: application/json
Content-Length: 0
```

cURL example:

```Console
curl -v -X POST "https://<YourResourceRegion>.customvoice.api.speech.microsoft.com/api/texttospeech/v3.0/endpoints/<YourEndpointId>/resume" -H "Ocp-Apim-Subscription-Key: <YourResourceKey >" -H "content-type: application/json" -H "content-length: 0"
```

Response header example:
```
Status code: 202 Accepted
```

For more information, see [response headers](#response-headers).

#### Parameters and response codes

##### Request parameters

You use these request parameters with calls to the REST API. 

| Name                        | Location     | Required | Type   | Description                                                                    |
| --------------------------- | ------ | -------- | ------ | ------------------------------------------------------------------------------ |
| `YourResourceRegion` | Path   | `True` | string | The Azure region the endpoint is associated with. |
| `YourEndpointId` | Path   | `True` | string | The identifier of the endpoint. |
| `Ocp-Apim-Subscription-Key` | Header | `True` | string | The Speech resource key the endpoint is associated with. |

##### Response headers

Status code: 202 Accepted

| Name          | Type   | Description                                                                      |
| ------------- | ------ | -------------------------------------------------------------------------------- |
| `Location` | string | The location of the endpoint that can be used as the full URL to get endpoint. |
| `Retry-After` | string | The total seconds of recommended interval to retry to get endpoint status.       |

##### HTTP status codes

The HTTP status code for each response indicates success or common errors.

| HTTP status code | Description       | Possible reason |
| ---------------- | ----------------- | ------------- |
| 200              | OK                | The request was successful. |
| 202              | Accepted          | The request has been accepted and is being processed. |
| 400              | Bad Request       | The value of a parameter is invalid, or a required parameter is missing, empty, or null. One common issue is a header that is too long. |
| 401              | Unauthorized      | The request isn't authorized. |
| 429              | Too Many Requests | You've exceeded the quota or rate of requests allowed for your Speech resource. |
| 502              | Bad Gateway       | Network or server-side issue. May also indicate invalid headers.|

## Next steps

- [Deploy a professional voice](./professional-voice-deploy-endpoint.md)
