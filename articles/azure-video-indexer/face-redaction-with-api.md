---
title: Redact faces with Azure Video Indexer API 
description: This article shows how to use Azure Video Indexer face redaction feature using API.
ms.topic: how-to
ms.date: 07/03/2023
---

# Redact faces with Azure Video Indexer API

Azure Video Indexer enables customers to detect and identify faces. Face redaction enables you to modify your video in order to blur faces of selected individuals. A few minutes of footage that contains multiple faces can take hours to redact manually, but with this preset the face redaction process requires just a few simple steps.

This article shows how to do the face redaction with an API. The face redaction API includes a **Face Redaction** preset that offers scalable face detection and redaction (blurring) in the cloud. 

The following video shows how to redact a video with Azure Video Indexer API.

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RW16UBo]

The article demonstrates each step of how to redact faces with the API in detail.

## Compliance, privacy, and security 

As an important [reminder](limited-access-features.md), you must comply with all applicable laws in your use of analytics in Azure Video Indexer.  

Face service access is limited based on eligibility and usage criteria in order to support our Responsible AI principles. Face service is only available to Microsoft managed customers and partners. Use the [Face Recognition intake form](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xUQjA5SkYzNDM4TkcwQzNEOE1NVEdKUUlRRCQlQCN0PWcu) to apply for access. For more information, see the [Face limited access page](https://learn.microsoft.com/legal/cognitive-services/computer-vision/limited-access-identity?context=%2Fazure%2Fcognitive-services%2Fcomputer-vision%2Fcontext%2Fcontext). 

## Redactor terminology and hierarchy 

The Face Redactor in Video Indexer relies on the output of the existing Video Indexer Face Detection results provided in our Video Standard and Advanced Analysis presets. In order to redact a video, you must first upload a video to Video Indexer and perform an analysis using the **standard** or **Advanced** video presets. This can be done using the [Azure Video Indexer website](https://www.videoindexer.ai/media/library) or [API](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Upload-Video). You can then use the Redactor API to reference this video using the `videoId` and we create a new video with the redacted faces. Both the Video Analysis and Face Redaction are separate billable jobs. See our [pricing page](https://azure.microsoft.com/pricing/details/video-indexer/) for more information.

## Blurring kinds

The Face Redaction comes with several options, which can be provided in the request body. 

|Blurring Kind number |Blurring Kind name |Example|
|---|---|---|
|0| MediumBlur|:::image type="content" source="./media/face-redaction-with-api/medium-blur.png" alt-text="Picture of the Azure Video Indexer medium blur kind.":::|
|1| HighBlur|:::image type="content" source="./media/face-redaction-with-api/high-blur.png" alt-text="Picture of the Azure Video Indexer high blur kind.":::|
|2| LowBlur|:::image type="content" source="./media/face-redaction-with-api/low-blur.png" alt-text="Picture of the Azure Video Indexer low blur kind.":::|
|3| BoundingBox|:::image type="content" source="./media/face-redaction-with-api/bounding-boxes.png" alt-text="Picture of the Azure Video Indexer bounding boxes kind.":::|
|4| Black|:::image type="content" source="./media/face-redaction-with-api/black-boxes.png" alt-text="Picture of the Azure Video Indexer black boxes kind.":::|

You can specify the blurring kind in the request body using the `blurringKind`. For example:

```json
{ 
    "faces": { 
        "blurringKind": "HighBlur" 
    } 
} 
```

Or when using the BlurringKind number: 

```json
{ 
    "faces": { 
        "blurringKind": 1 
    } 
} 
```

## Filters 

You can apply filters to instruct which face IDs should be blurred. You can specify the IDs of the faces in a comma separated array in the json body. Additionally using the scope you can instruct to exclude or include these faces for redaction. This way you have the option to achieve  a behavior of “redact all faces except these IDs” or “redact only these IDs” by specifying the least number of IDs. See examples below. 

### Exclude scope

Redact all faces except 1001 and 1016, use the `Exclude` scope.

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

Redact only face IDs 1001 and 1016, use the `Include` scope.

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

To redact all faces,  remove the filter entirely.

```json
{ 
    "faces": { 
        "blurringKind": "HighBlur", 
    } 
} 
```

To retrieve the Face ID, you can go to the indexed video and retrieve the [artifact file](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Get-Video-Artifact-Download-Url). This artifact contains a faces.json and a thumbnail zip file with all the faces. You can match the face to the ID and decide which face IDs need to be redacted. 

## Create a redactor job 

To create a Redactor job, you can invoke the following API call: 

```json
POST https://api.videoindexer.ai/{location}/Accounts/{accountId}/Videos/{videoId}/redact[?name][&priority][&privacy][&externalId][&streamingPreset][&callbackUrl][&accessToken]
```

The following values are mandatory: 

|Name |Value |Description |
|---|---|---|
|**Accountid** |`{accountId}`| The ID of your Video Indexer account.| 
|**Location** |`{location}`| The location of your Video Indexer account that is, Westus.|
|**AccessToken** |`{token}`|The token with Account Contributor rights generated through the [Azure Resource Manager](https://learn.microsoft.com/rest/api/videoindexer/stable/generate/access-token?tabs=HTTP) REST API.| 
|**Videoid** |`{videoId}`|The video ID of the source video to redact. You can retrieve the video ID using the [List Video](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=List-Videos) API.|
|**Name** |`{name}`|The name of the new redacted video.|

A sample request would be: 

```
https://api.videoindexer.ai/westeurope/Accounts/<id>/Videos/<id>/redact?priority=Low&name=testredaction&privacy=Private&streamingPreset=Default 
```

We can specify the token as authorization header with a key value type of bearertoken:{token} or you can provide it as query param using `?token={token}` 

Additionally we need to add a request body in json format with the redaction job options that is: 

```json
{ 
    "faces": { 
        "blurringKind": "HighBlur" 
    } 
} 
```

When successful you receive an HTTP 202 ACCEPTED. 

## Monitor job status 

In the response of the job creation request you receive an HTTP header `Location` with a URL to the job. You can perform a GET request to this url with the same token to see the status of the redaction job. An example url would be: 

```
https://api.videoindexer.ai/westeurope/Accounts/<id>/Jobs/<id>
``` 

Response 

```json
{ 
    "creationTime": "2023-05-11T11:22:57.6114155Z", 
    "lastUpdateTime": "2023-05-11T11:23:01.7993563Z", 
    "progress": 20, 
    "jobType": "Redaction", 
    "state": "Processing" 
} 
```

Calling the same url once the redaction job has completed you get a Storage SAS url to the redacted video again in the `Location` header. For instance: 

```
https://api.videoindexer.ai/westeurope/Accounts/<id>/Videos/<id>/SourceFile/DownloadUrl 
```

This will redirect to the mp4 stored on the Azure Storage Account. 

## FAQ 

|Question|Answer|
|---|---|
|Can I upload a video and redact in one operation? |No, you need to first upload and analyze a video using the Index Video API and reference the indexed video in your redaction job.|
|Can I use the [Azure Video Indexer website](https://www.videoindexer.ai/) to redact a video? |No, Currently you can only use the API to create redaction jobs.|
|Can I play back the redacted video using the Video Indexer [website](https://www.videoindexer.ai/)?|Yes, the redacted video is visible in the Video Indexer like any other indexed video, however it doesn't contain any insights. |
|How do I delete a redacted video? |You can use the [Delete Video](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Delete-Video) API and provide the `Videoid` of the redacted video. |
|Do I need to pass Facial Identification gating to use Redactor? |Unless you're a US Police Department, no, even when you’re gated we continue to offer Face Detection. We don't offer Face Identification when gated. You can however redact all faces in a video with just the Face Detection. |
|Will the Face Redaction overwrite my original video? |No, the Redaction job will create a new video output file. |
|Not all faces are properly redacted. What can I do? |Redaction relies on the initial Face Detection and tracking output of the Analysis pipeline. While we detect all faces most of the time there can be circumstances where we haven't detected a face. This can have several reasons like face angle, number of frames the face was present and quality of the source video. See our [Face insights](face-detection.md) documentation for more information. |
|Can I redact other objects than faces? |No, currently we only have face redaction. If you have the need for other objects, provide feedback to our product in the [Azure User Voice](https://feedback.azure.com/d365community/forum/8952b9e3-e03b-ec11-8c62-00224825aadf) channel. |
|How Long is a SAS URL valid to download the redacted video? |<!--The SAS URL is valid for xxxx. -->To download the redacted video after the SAS url expired, you need to call the initial Job status URL. It's best to keep these `Jobstatus` URLs in a database in your backend for future reference. |

## Error codes 

### Response: 404 Not Found  

Account not found or video not found.  

Response headers  
Name  
Required  
Type  
Description  
x-ms-request-id  
false  
string  

A globally unique identifier (GUID) for the request which is assigned by the server for instrumentation purposes. The server makes sure all logs associated with handling the request can be linked to the server request id so a client can provide this request id in support tickets so support engineers could find the logs linked to this particular request. The server makes sure this request id never repeats itself. 

application/json  
ErrorResponse  

Name  
Required  
Type  
Description  
ErrorType  
false  
ErrorType  
Message  
false  
string  
*default*  

```json
{ 
    "ErrorType": "GENERAL", 
    "Message": "string" 
} 
```

### Response: 400 Bad Request  

Invalid input or cannot redact the video since its original upload failed. Please upload the video again.  

Response headers  
Name  
Required  
Type  
Description  
x-ms-request-id  
false  
string  

A globally unique identifier (GUID) for the request which is assigned by the server for instrumentation purposes. The server makes sure all logs associated with handling the request can be linked to the server request id so a client can provide this request id in support tickets so support engineers could find the logs linked to this particular request. The server makes sure this request id never repeats itself. 

application/json  
ErrorResponse  

Name  
Required  
Type  
Description  
ErrorType  
false  
ErrorType  
Message  
false  
string  
*default*  

```json
{ 
    "ErrorType": "GENERAL", 
    "Message": "string" 
} 
```

### Response: 409 Conflict  

Video is already being indexed.  

Response headers  
Name  
Required  
Type  
Description  
x-ms-request-id  
false  
string  

A globally unique identifier (GUID) for the request which is assigned by the server for instrumentation purposes. The server makes sure all logs associated with handling the request can be linked to the server request id so a client can provide this request id in support tickets so support engineers could find the logs linked to this particular request. The server makes sure this request id never repeats itself. 

application/json  
ErrorResponse  

Name  
Required  
Type  
Description  
ErrorType  
false  
ErrorType  
Message  
false  
string  
*default*

```json
{ 
    "ErrorType": "GENERAL", 
    "Message": "string" 
} 
```

### Response: 401 Unauthorized  

Response headers  

Name  
Required  
Type  
Description  
x-ms-request-id  
false  
string 

A globally unique identifier (GUID) for the request which is assigned by the server for instrumentation purposes. The server makes sure all logs associated with handling the request can be linked to the server request id so a client can provide this request id in support tickets so support engineers could find the logs linked to this particular request. The server makes sure this request id never repeats itself. 

application/json  
ErrorResponse  

Name  
Required  
Type  
Description  
ErrorType  
false  
ErrorType  
Message  
false  
string  
*default*  

```json
{ 
    "ErrorType": "USER_NOT_ALLOWED", 
    "Message": "Access token is not authorized to access account 'SampleAccountId'." 
} 
```

### Response: 500 Internal Server Error 

Response headers  
Name  
Required  
Type  
Description  
x-ms-request-id  
false  
string  

A globally unique identifier (GUID) for the request which is assigned by the server for instrumentation purposes. The server makes sure all logs associated with handling the request can be linked to the server request id so a client can provide this request id in support tickets so support engineers could find the logs linked to this particular request. The server makes sure this request id never repeats itself. 

application/json  
ErrorResponse 
 
Name  
Required  
Type  
Description  
ErrorType  
false 
ErrorType  
Message  
false  
string  
*default*  

```json
{ 
    "ErrorType": "GENERAL", 
    "Message": "There was an error." 
} 
```

### Response: 429 Too many requests  

Too many requests were sent, use Retry-After response header to decide when to send the next request.  

Response headers  

Name  
Required  
Type  
Description  
Retry-After  
false  
integer  
A non-negative decimal integer indicating the seconds to delay after the response is received  
x-ms-request-id  
false  
string  

A globally unique identifier (GUID) for the request which is assigned by the server for instrumentation purposes. The server makes sure all logs associated with handling the request can be linked to the server request id so a client can provide this request id in support tickets so support engineers could find the logs linked to this particular request. The server makes sure this request id never repeats itself. 

### Response: 504 Gateway Timeout  

Server didn't respond to gateway within expected time.  

Response headers  
Name  
Required  
Type  
Description  
x-ms-request-id  
false  
string  

A globally unique identifier (GUID) for the request which is assigned by the server for instrumentation purposes. The server makes sure all logs associated with handling the request can be linked to the server request id so a client can provide this request id in support tickets so support engineers could find the logs linked to this particular request. The server makes sure this request id never repeats itself. 

application/json  
*default*  

```json
{ 
    "ErrorType": "SERVER_TIMEOUT", 
    "Message": "Server did not respond to gateway within expected time" 
} 
```

## Next steps

- [Azure Video Indexer](https://azure.microsoft.com/pricing/details/video-indexer/)
- Also, see [Azure pricing](https://azure.microsoft.com/pricing/) for encoding, streaming, and storage billed by the respective Azure service providers.
