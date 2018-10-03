---
title: "Example: Call the Emotion API for Video"
titlesuffix: Azure Cognitive Services
description: Learn how to call the Emotion API for Video in Cognitive Services.
services: cognitive-services
author: anrothMSFT
manager: cgronlun

ms.service: cognitive-services
ms.component: emotion-api
ms.topic: sample
ms.date: 02/06/2017
ms.author: anroth
ROBOTS: NOINDEX
---

# Example: Call Emotion API for Video

> [!IMPORTANT]
> The Emotion API will be deprecated on February 15, 2019. The emotion recognition capability is now generally available as part of the [Face API](https://docs.microsoft.com/azure/cognitive-services/face/). 

This guide demonstrates how to call Emotion API for Video. The samples are written in C# using the Emotion API for Video client library.

### <a name="Prep">Preparation</a>
In order to use the Emotion API for Video, you will need a video that includes people, preferably video where the people are facing the camera.

### <a name="Step1">Step 1: Authorize the API call</a>
Every call to the Emotion API for Video requires a subscription key. This key needs to be either passed through a query string parameter or specified in the request header. To pass the subscription key through a query string, refer to the request URL below for the Emotion API for Video as an example:

```
https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognizeInVideo&subscription-key=<Your subscription key>
```

As an alternative, the subscription key can also be specified in the HTTP request header:

```
ocp-apim-subscription-key: <Your subscription key>
```

When using a client library, the subscription key is passed in through the constructor of the VideoServiceClient class. For example:

```
var emotionServiceClient = new emotionServiceClient("Your subscription key");
```
To obtain a subscription key, see [Subscriptions] (https://azure.microsoft.com/try/cognitive-services/).

### <a name="Step2">Step 2: Upload a video to the service and check the status</a>
The most basic way to perform any of the Emotion API for Video calls is by uploading a video directly. This is done by sending a "POST" request with application/octet-stream content type together with the data read from a video file. The maximum size of the video is 100MB.

Using the client library, stabilization by means of uploading is done by passing in a stream object. See the example below:

```
Operation videoOperation;
using (var fs = new FileStream(@"C:\Videos\Sample.mp4", FileMode.Open))
{
      videoOperation = await videoServiceClient.CreateOperationAsync(fs, OperationType.recognizeInVideo);
}
```

Please note that the CreateOperationAsync method of VideoServiceClient is async. The calling method should be marked as async as well in order to use the await clause.
If the video is already on the web and has a public URL, Emotion API for Video can be accessed by providing the URL. In this example, the request body will be a JSON string which contains the URL.

Using the client library, stabilization by means of an URL can easily be executed using another overload of the CreateOperationAsync method.


```
var videoUrl = "http://www.example.com/sample.mp4";
Operation videoOperation = await videoServiceClient.CreateOperationAsync(videoUrl, OperationType. recognizeInVideo);

```

This upload method will be the same for all the Emotion API for Video calls.

Once you have uploaded a video, the next operation you will want to perform is to check its status. Because video files are usually larger and more diverse than other files, users can expect a long processing time at this step. The time depends on the size and the length of the file.

Using the client library, you can retrieve the operation status and result using the GetOperationResultAsync method.


```
var operationResult = await videoServiceClient.GetOperationResultAsync(videoOperation);

```
Typically, the client side should periodically retrieve the operation status until the status is shown as “Succeeded” or “Failed”.

```
OperationResult operationResult;
while (true)
{
      operationResult = await videoServiceClient.GetOperationResultAsync(videoOperation);
      if (operationResult.Status == OperationStatus.Succeeded || operationResult.Status == OperationStatus.Failed)
      {
           break;
      }

      Task.Delay(30000).Wait();
}

```

When the status of VideoOperationResult is shown as “Succeeded” the result can be retrieved by casting the VideoOperationResult to a VideoOperationInfoResult<VideoAggregateRecognitionResult> and accessing the ProcessingResult field.

```
var emotionRecognitionJsonString = ((VideoOperationInfoResult<VideoAggregateRecognitionResult>)operationResult).ProcessingResult;
```

### <a name="Step3">Step 3: Retrieving and understanding the emotion recognition and tracking JSON output</a>

The output result contains the metadata from the faces within the given file in JSON format.

As explained in Step 2, the JSON output is available in the ProcessingResult field of OperationResult, when its status is shown as “Succeeded”.

The face detection and tracking JSON includes the following attributes:

Attribute |	Description
-------------|-------------
Version	| Refers to the version of the Emotion API for Video JSON.
Timescale |	“Ticks” per second of the video.
Offset	|The time offset for timestamps. In version 1.0 of Emotion API for Videos, this will always be 0. In future supported scenarios, this value may change.
Framerate |	Frames per second of the video.
Fragments	| The metadata is cut up into different smaller pieces called fragments. Each fragment contains a start, duration, interval number, and event(s).
Start	| The start time of the first event, in ticks.
Duration |	The length of the fragment, in ticks.
Interval |	The length of each event within the fragment, in ticks.
Events	| An array of events. The outer array represents one interval of time. The inner array consists of 0 or more events that happened at that point in time.
windowFaceDistribution |	Percent faces to have a particular emotion during the event.
windowMeanScores |	Mean scores for each emotion of the faces in the image.

The reason for formatting the JSON this way is to set up the APIs for future scenarios, where it will be important to retrieve metadata quickly and manage a large stream of results. This formatting is using both the techniques of fragmentation (allowing you to break up the metadata in time-based portions, where you can download only what you need), and segmentation (allowing you to break up the events if they get too large). Some simple calculations can help you transform the data. For example, if an event started at 6300 (ticks), with a timescale of 2997 (ticks/sec) and a framerate of 29.97 (frames/sec), then:

*	Start/Timescale = 2.1 seconds
*	Seconds x (Framerate/Timescale) = 63 frames

Below is a simple example of extracting the JSON into a per frame format for face detection and tracking:

```
var emotionRecognitionTrackingResultJsonString = operationResult.ProcessingResult;
var emotionRecognitionTracking = JsonConvert.DeserializeObject<EmotionRecognitionResult>(emotionRecognitionTrackingResultJsonString, settings);
```
Because emotions are smoothed over time, if you ever build a visualization to overlay your results on top the original video, subtract 250 milliseconds from the provided timestamps.

### <a name="Summary">Summary</a>
In this guide you have learned about the functionalities of the Emotion API for Video: how you can upload a video, check its status, retrieve emotion recognition metadata.

For more information about API details, see the API reference guide “[Emotion API for Video Reference](https://westus.dev.cognitive.microsoft.com/docs/services/5639d931ca73072154c1ce89/operations/56f8d40e1984551ec0a0984e)”.
