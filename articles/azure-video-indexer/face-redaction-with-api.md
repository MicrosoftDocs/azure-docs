---
title: Redact faces by using Azure AI Video Indexer API 
description: Learn how to use the Azure AI Video Indexer face redaction feature by using API.
ms.topic: how-to
ms.date: 08/11/2023
ms.author: inhenkel
author: IngridAtMicrosoft
---

# Redact faces by using Azure AI Video Indexer API

[!INCLUDE [AMS AVI retirement announcement](./includes/important-ams-retirement-avi-announcement.md)]

You can use Azure AI Video Indexer to detect and identify faces in video. To modify your video to blur (redact) faces of specific individuals, you can use API.

A few minutes of footage that contain multiple faces can take hours to redact manually, but by using presets in Video Indexer API, the face redaction process requires just a few simple steps.

This article shows you how to redact faces by using an API. Video Indexer API includes a **Face Redaction** preset that offers scalable face detection and redaction (blurring) in the cloud. The article demonstrates each step of how to redact faces by using the API in detail.

The following video shows how to redact a video by using Azure AI Video Indexer API.

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RW16UBo]

## Compliance, privacy, and security

As an important [reminder](limited-access-features.md), you must comply with all applicable laws in your use of analytics or insights that you derive by using Video Indexer.  

Face service access is limited based on eligibility and usage criteria to support the Microsoft Responsible AI principles. Face service is available only to Microsoft managed customers and partners. Use the [Face Recognition intake form](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xUQjA5SkYzNDM4TkcwQzNEOE1NVEdKUUlRRCQlQCN0PWcu) to apply for access. For more information, see the [Face limited access page](/legal/cognitive-services/computer-vision/limited-access-identity?context=%2Fazure%2Fcognitive-services%2Fcomputer-vision%2Fcontext%2Fcontext).

## Face redaction terminology and hierarchy

Face redaction in Video Indexer relies on the output of existing Video Indexer face detection results that we provide in our Video Standard and Advanced Analysis presets.

To redact a video, you must first upload a video to Video Indexer and complete an analysis by using the **Standard** or **Advanced** video presets. You can do this by using the [Azure Video Indexer website](https://www.videoindexer.ai/media/library) or [API](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Upload-Video). You can then use face redaction API to reference this video by using the `videoId` value. We create a new video in which the indicated faces are redacted. Both the video analysis and face redaction are separate billable jobs. For more information, see our [pricing page](https://azure.microsoft.com/pricing/details/video-indexer/).

## Types of blurring

You can choose from different types of blurring in face redaction. To select a type, use a name or representative number for the `blurringKind` parameter in the request body:

|blurringKind number | blurringKind name | Example |
|---|---|---|
|0| MediumBlur|:::image type="content" source="./media/face-redaction-with-api/medium-blur.png" alt-text="Photo of the Azure AI Video Indexer medium blur.":::|
|1| HighBlur|:::image type="content" source="./media/face-redaction-with-api/high-blur.png" alt-text="Photo of the Azure AI Video Indexer high blur.":::|
|2| LowBlur|:::image type="content" source="./media/face-redaction-with-api/low-blur.png" alt-text="Photo of the Azure AI Video Indexer low blur.":::|
|3| BoundingBox|:::image type="content" source="./media/face-redaction-with-api/bounding-boxes.png" alt-text="Photo of Azure AI Video Indexer bounding boxes.":::|
|4| Black|:::image type="content" source="./media/face-redaction-with-api/black-boxes.png" alt-text="Photo of Azure AI Video Indexer black boxes kind.":::|

You can specify the kind of blurring in the request body by using the `blurringKind` parameter.

Here's an example:

```json
{
    "faces": {
        "blurringKind": "HighBlur"
    }
}
```

Or, use a number that represents the type of blurring that's described in the preceding table:

```json
{
    "faces": {
        "blurringKind": 1
    }
}
```

## Filters

You can apply filters to set which face IDs to blur. You can specify the IDs of the faces in a comma-separated array in the body of the JSON file. Use the `scope` parameter to exclude or include these faces for redaction. By specifying IDs, you can either redact all faces *except* the IDs that you indicate or redact *only* those IDs. See examples in the next sections.

### Exclude scope

In the following example, to redact all faces except face IDs 1001 and 1016, use the `Exclude` scope:

```json
{
    "faces": {
        "blurringKind": "HighBlur",
        "filter": {
            "ids": [1001, 1016],
            "scope": "Exclude"
        }
    }
}
```

### Include scope

In the following example, to redact only face IDs 1001 and 1016, use the `Include` scope:

```json
{
    "faces": {
        "blurringKind": "HighBlur",
        "filter": {
            "ids": [1001, 1016],
            "scope": "Include"
        }
    }
}
```

### Redact all faces

To redact all faces, remove the scope filter:

```json
{
    "faces": {
        "blurringKind": "HighBlur",
    }
}
```

To retrieve a face ID, you can go to the indexed video and retrieve the [artifact file](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Get-Video-Artifact-Download-Url). The artifact contains a *faces.json* file and a thumbnail .zip file that has all the faces that were detected in the video. You can match the face to the ID and decide which face IDs to redact.

## Create a redaction job

To create a redaction job, you can invoke the following API call:

```http
POST https://api.videoindexer.ai/{location}/Accounts/{accountId}/Videos/{videoId}/redact[?name][&priority][&privacy][&externalId][&streamingPreset][&callbackUrl][&accessToken]
```

The following values are required:

| Name | Value | Description |
|---|---|---|
|`Accountid` |`{accountId}`| The ID of your Video Indexer account. |
| `Location` |`{location}`| The Azure region where your Video Indexer account is located. For example, westus. |
|`AccessToken` |`{token}`| The token that has Account Contributor rights generated through the [Azure Resource Manager](/rest/api/videoindexer/stable/generate/access-token?tabs=HTTP) REST API. |
| `Videoid` |`{videoId}`| The video ID of the source video to redact. You can retrieve the video ID by using the [List Video](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=List-Videos) API. |
| `Name` |`{name}`|The name of the new, redacted video. |

Here's an example of a request:

```http
https://api.videoindexer.ai/westeurope/Accounts/{id}/Videos/{id}/redact?priority=Low&name=testredaction&privacy=Private&streamingPreset=Default 
```

You can specify the token as an authorization header that has a key value type of `bearertoken:{token}`, or you can provide it as query parameter by using `?token={token}`.

You also need to add a request body in JSON format with the redaction job options to apply. Here's an example:

```json
{
    "faces": {
        "blurringKind": "HighBlur"
    }
}
```

When the request is successful, you receive the response `HTTP 202 ACCEPTED`.

## Monitor job status

In the response of the job creation request, you receive an HTTP header `Location` that has a URL to the job. You can use the same token to make a GET request to this URL to see the status of the redaction job.

Here's an example URL:

```http
https://api.videoindexer.ai/westeurope/Accounts/<id>/Jobs/<id>
```

Here's an example response:

```json
{
    "creationTime": "2023-05-11T11:22:57.6114155Z",
    "lastUpdateTime": "2023-05-11T11:23:01.7993563Z",
    "progress": 20,
    "jobType": "Redaction",
    "state": "Processing"
}
```

If you call the same URL when the redaction job is completed, in the `Location` header, you get a storage shared access signature (SAS) URL to the redacted video. For example:

```http
https://api.videoindexer.ai/westeurope/Accounts/<id>/Videos/<id>/SourceFile/DownloadUrl 
```

This URL redirects to the .mp4 file that's stored in the Azure Storage account.

## FAQs

| Question | Answer |
|---|---|
| Can I upload a video and redact in one operation? | No. You need to first upload and analyze a video by using Video Indexer API. Then, reference the indexed video in your redaction job. |
| Can I use the [Azure AI Video Indexer website](https://www.videoindexer.ai/) to redact a video? | No. Currently you can use only the API to create a redaction job.|
| Can I play back the redacted video by using the Video Indexer [website](https://www.videoindexer.ai/)?| Yes. The redacted video is visible on the Video Indexer website like any other indexed video, but it doesn't contain any insights. |
| How do I delete a redacted video? | You can use the [Delete Video](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Delete-Video) API and provide the `Videoid` value for the redacted video. |
| Do I need to pass facial identification gating to use face redaction? | Unless you represent a police department in the United States, no. Even if you’re gated, we continue to offer face detection. We don't offer face identification if you're gated. However, you can redact all faces in a video by using only face detection. |
| Will face redaction overwrite my original video? | No. The face redaction job creates a new video output file. |
| Not all faces are properly redacted. What can I do? | Redaction relies on the initial face detection and tracking output of the analysis pipeline. Although we detect all faces most of the time, there are circumstances in which we can't detect a face. Factors like face angle, the number of frames the face is present, and the quality of the source video affect the quality of face redaction. For more information, see [Face insights](face-detection.md). |
| Can I redact objects other than faces? | No. Currently, we offer only face redaction. If you have a need to redact other objects, you can provide feedback about our product in the [Azure User Voice](https://feedback.azure.com/d365community/forum/8952b9e3-e03b-ec11-8c62-00224825aadf) channel. |
| How long is an SAS URL valid to download the redacted video? |<!--The SAS URL is valid for xxxx. --> To download the redacted video after the SAS URL expired, you need to call the initial job status URL. It's best to keep these `Jobstatus` URLs in a database in your back end for future reference. |

## Error codes

The following sections describe errors that might occur when you use face redaction.

### Response: 404 Not Found  

The account wasn't found or the video wasn't found.  

#### Response headers

| Name | Required | Type | Description |  
| ---- | ---- | ---- | ---- |
| `x-ms-request-id` | false | string | A globally unique identifier (GUID) for the request is assigned by the server for instrumentation purposes. The server makes sure that all logs that are associated with handling the request can be linked to the server request ID. A client can provide this request ID in a support ticket so that support engineers can find the logs that are linked to this specific request. The server makes sure that the request ID is unique for each job. |

#### Response body

| Name | Required | Type |
| ---- | ---- | ---- |
| `ErrorType` | false | `ErrorType` |
| `Message` | false | string |

#### Default JSON

```json
{
    "ErrorType": "GENERAL",
    "Message": "string"
}
```

### Response: 400 Bad Request

Invalid input or can't redact the video since its original upload failed. Please upload the video again.

Invalid input or can't redact the video because its original upload failed. Upload the video again.

#### Response headers

| Name | Required | Type | Description |  
| ---- | ---- | ---- | ---- |
| `x-ms-request-id` | false | string | A GUID for the request is assigned by the server for instrumentation purposes. The server makes sure that all logs that are associated with handling the request can be linked to the server request ID. A client can provide this request ID in a support ticket so that support engineers can find the logs that are linked to this specific request. The server makes sure that the request ID is unique for each job. |

#### Response body

| Name | Required | Type |
| ---- | ---- | ---- |
| `ErrorType` | false | `ErrorType` |
| `Message` | false | string |

#### Default JSON

```json
{
    "ErrorType": "GENERAL",
    "Message": "string"
}
```

### Response: 409 Conflict  

The video is already being indexed.  

#### Response headers

| Name | Required | Type | Description |  
| ---- | ---- | ---- | ---- |
| `x-ms-request-id` | false | string | A GUID for the request is assigned by the server for instrumentation purposes. The server makes sure that all logs that are associated with handling the request can be linked to the server request ID. A client can provide this request ID in a support ticket so that support engineers can find the logs that are linked to this specific request. The server makes sure that the request ID is unique for each job.|

#### Response body

| Name | Required | Type |
| ---- | ---- | ---- |
| `ErrorType` | false | `ErrorType` |
| `Message` | false | string |

#### Default JSON

```json
{
    "ErrorType": "GENERAL",
    "Message": "string"
}
```

### Response: 401 Unauthorized

The access token isn't authorized to access the account.

#### Response headers

| Name | Required | Type | Description |  
| ---- | ---- | ---- | ---- |
| `x-ms-request-id` | false | string | A GUID for the request is assigned by the server for instrumentation purposes. The server makes sure that all logs that are associated with handling the request can be linked to the server request ID. A client can provide this request ID in a support ticket so that support engineers can find the logs that are linked to this specific request. The server makes sure that the request ID is unique for each job. |

#### Response body

| Name | Required | Type |
| ---- | ---- | ---- |
| `ErrorType` | false | `ErrorType` |
| `Message` | false | string |

#### Default JSON

```json
{
    "ErrorType": "USER_NOT_ALLOWED",
    "Message": "Access token is not authorized to access account 'SampleAccountId'."
}
```

### Response: 500 Internal Server Error

An error occurred on the server.

#### Response headers

| Name | Required | Type | Description |  
| ---- | ---- | ---- | ---- |
| `x-ms-request-id` | false | string | A GUID for the request is assigned by the server for instrumentation purposes. The server makes sure that all logs that are associated with handling the request can be linked to the server request ID. A client can provide this request ID in a support ticket so that support engineers can find the logs that are linked to this specific request. The server makes sure that the request ID is unique for each job. |

#### Response body

| Name | Required | Type |
| ---- | ---- | ---- |
| `ErrorType` | false | `ErrorType` |
| `Message` | false | string |

#### Default JSON

```json
{
    "ErrorType": "GENERAL",
    "Message": "There was an error."
}
```

### Response: 429 Too many requests  

Too many requests were sent. Use the `Retry-After` response header to decide when to send the next request.

#### Response headers

| Name | Required | Type | Description |  
| ---- | ---- | ---- | ---- |
| `Retry-After` | false | integer | A non-negative decimal integer that indicates the number of seconds to delay after the response is received. |

### Response: 504 Gateway Timeout

The server didn't respond to the gateway within the expected time.  

#### Response headers

| Name | Required | Type | Description |  
| ---- | ---- | ---- | ---- |
| `x-ms-request-id` | false | string | A GUID for the request is assigned by the server for instrumentation purposes. The server makes sure that all logs that are associated with handling the request can be linked to the server request ID. A client can provide this request ID in a support ticket so that support engineers can find the logs that are linked to this specific request. The server makes sure that the request ID is unique for each job. |

#### Default JSON

```json
{
    "ErrorType": "SERVER_TIMEOUT",
    "Message": "Server did not respond to gateway within expected time"
}
```

## Next steps

- Learn more about [Video Indexer](https://azure.microsoft.com/pricing/details/video-indexer/).
- See [Azure pricing](https://azure.microsoft.com/pricing/) for encoding, streaming, and storage billed by Azure service providers.
