---
title: Call Video APIs in Microsoft Cognitive Services | Microsoft Docs
description: Get guidance for calling Video APIs, with samples in C# using the Video API client library.
services: cognitive-services
author: CYokel
manager: ytkuo

ms.service: cognitive-services
ms.technology: video
ms.topic: article
ms.date: 01/20/2017
ms.author: chbryant
---

# How to Call Video APIs


The samples are written in C# using the Video API client library.

## <a name="concepts"></a>Concepts 
If you are not familiar with any of the following concepts in this guide, please refer to the definitions in our [glossary](../Glossary.md) at any time.

* Stabilization
* Face Detection and Tracking
* Motion Detection

## <a name="preparation"></a>Preparation 
In the below examples the following features are demonstrated:
* Creating a stabilized video from a shaky video
* Analyzing faces detected in a video and outputting the corresponding JSON
* Analyzing motion detected in a video and outputting the corresponding JSON

In order to implement these features, you will need a video with the below specified characteristics for each of the features you want to try.
* For stabilization: A video that is shaky or jittery.
* For face detection and tracking: A video where people's faces are facing the camera.
* For motion detection: A video with a stationary background and some movement in the foreground.

## <a name="step1"></a>Step 1: Authorize the API call 
Every call to the Video API requires a subscription key. This key needs to be either passed through a query string parameter or specified in the request header. To pass the subscription key through a query string, refer to the Video API request URL below as an example:

```

https://westus.api.cognitive.microsoft.com/video/v1.0/stabilize&subscription-key=<Your subscription key>
  
```

As an alternative, the subscription key can also be specified in the HTTP request header:
```

ocp-apim-subscription-key: <Your subscription key>
  
```

When using a client library, the subscription key is passed in through the constructor of the VideoServiceClient class. For example:

```

var videoServiceClient = new VideoServiceClient("Your subscription key");

```
 
To obtain a subscription key, see [Subscriptions](https://www.microsoft.com/cognitive-services/en-us/sign-up).

## <a name="step2"></a>Step 2: Upload a video to the service and check the status

The most basic way to perform any of the Video API calls is by uploading a video directly. This is done by sending a "POST" request with application/octet-stream content type together with the data read from a video file. The maximum size of the video is 100MB.

Using the client library, stabilization by means of uploading is done by passing in a stream object. See the example below:

```

Operation videoOperation;
using (var fs = new FileStream(@"C:\Videos\Sample.mp4", FileMode.Open))
{
      videoOperation = await videoServiceClient.CreateOperationAsync(fs, OperationType.Stabilize);
}
  
```

*Please note that the CreateOperationAsync method of VideoServiceClient is async. The calling method should be marked as async as well in order to use the await clause.*

If the video is already on the web and has a public URL, Video APIs can be accessed by providing the URL. In this example, the request body will be a JSON string which contains the URL.

Using the client library, stabilization by means of an URL can easily be executed using another overload of the CreateOperationAsync method.


```

var videoUrl = "http://www.example.com/sample.mp4";
Operation videoOperation = await videoServiceClient.CreateOperationAsync(videoUrl, OperationType.Stabilize);

```

This upload method will be the same for all the Video API calls. The only difference will be the POST calls to the various APIs you want to execute (POST stabilize, trackFace, detectMotion).

Once you have uploaded a video to the Video API call you want to execute, the next operation you will want to perform is to check its status. Because video files are usually larger and more diverse than other files, users can expect a long processing time at this step. The time depends on the size and the length of the file. 

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

When the status of OperationResult is shown as “Succeeded”, depending on the video operation you created, the result can be retrieved in the following ways:  

Video Operation  | How to retrieve results?  | Sample code  
---------|---------|---------
Stabilization   |  The result (as a video file) can be retrieved from the URL specified in the ResourceLocation field of the OperationResult instance.  |  var stabilziationResultUrl = operationResult.ResourceLocation;     
Face Detection/Tracking and Motion Detection|The result (as a JSON string) is available in the ProcessingResult field of OperationResult. |var motionDetectionJsonString = operationResult.ProcessingResult;

## <a name="step3"></a>Step 3: Retrieving video output files for stabilization  
     
The output from the Stabilization Video API is stabilized in MP4 video format. Once your video output is ready, as informed by the GetVideoOperationResultAsync method, you can download your video using the GetResultVideoAsync method.

```

var videoStream = await videoServiceClient.GetResultVideoAsync(resultUrl);
using (var fileStream = File.Create(outputFile))
{
      videoStream.CopyTo(fileStream);
}

```

## <a name="step4"></a>Step 4: Retrieving and understanding the face detection and tracking JSON output
For the face detection and tracking operation, the output result contains the metadata from the faces within the given file in JSON format. 

As explained in Step 2, the JSON output is available in the ProcessingResult field of OperationResult, when its status is shown as “Succeeded”.

The face detection and tracking JSON includes the following attributes:  


Attribute  |Description  
---------|---------
Version     |   Refers to the version of the Video API JSON.      
Timescale    |   “Ticks” per second of the video.     
Offset     |     The time offset for timestamps. In version 1.0 of Video APIs, this will always be 0. In future supported scenarios, this value may change.    
Framerate    |   Frames per second of the video.      
Fragments    |    The metadata is cut up into different smaller pieces called fragments. Each fragment contains a start, duration, interval number, and event(s).     
Start    |    The start time of the first event, in ticks.     
Duration    |    The length of the fragment, in ticks.     
Interval     |     The length of each event within the fragment, in ticks.    
Events     |   An array of events. The outer array represents one interval of time. The inner array consists of 0 or more events that happened at that point in time.      
ID    |   Index of a face. A given individual should have the same ID throughout the overall video. Due to limitations in the detection algorithm (e.g. occlusion) this cannot be gauranteed.      
X, Y    |     The upper left X and Y coordinates of the face bounding box in a normalized scale of 0.0 to 1.0. The X and Y coordinates are relative to the landscape orientation of a video. For example, if you have a portrait video, you will have to transpose the coordinates accordingly .   
Width, Height    |    The width and height of the face bounding box in a normalized scale of 0.0 to 1.0.     
facesDetected    |    Attribute is found at the end of the JSON results and summarizes the number of faces that the algorithm detected during the video. Because the IDs can be reset if a face becomes undetected (e.g. face goes off screen, looks away), this number may not always equal the true number of faces in the video. 

The reason for formatting the JSON this way is to set up the APIs for future scenarios, where it will be important to retrieve metadata quickly and manage a large stream of results. This formatting is using both the techniques of fragmentation (allowing you to break up the metadata in time-based portions, where you can download only what you need), and segmentation (allowing you to break up the events if they get too large). Some simple calculations can help you transform the data. For example, if an event started at 6300 (ticks), with a timescale of 2997 (ticks/sec) and a framerate of 29.97 (frames/sec), then:
* Start/Timescale = 2.1 seconds
* Seconds x (Framerate/Timescale) = 63 frames

Below is a simple example of extracting the JSON into a per frame format for face detection and tracking:

```

var faceDetectionTrackingResultJsonString = operationResult.ProcessingResult;
var faceDetecionTracking = JsonConvert.DeserializeObject<FaceDetectionResult>(faceDetectionTrackingResultJsonString, settings);

```

## <a name="step5"></a>Step 5: Retrieving and understanding the motion detection JSON output  

You retrieve the motion detection JSON results in exactly the same way as with the face detection and tracking method. Please see Step 4 to learn how to retrieve the results.

The motion detection JSON has similar concepts as the face detection and tracking JSON. Because the motion detection JSON only needs to record when motion happened and the duration of motion, there are a few differences.  

Attribute  |Description  
---------|---------
Version     |   Refers to the version of the Video API JSON.      
Timescale     |    “Ticks” per second of the video.     
Offset     |     The time offset for timestamps. In version 1.0 of Video APIs, this will always be 0. In future supported scenarios, this value may change.    
Framerate     |   Frames per second of the video.      
Fragments    |    The metadata is cut up into smaller pieces called fragments. Each fragment contains a start, duration, interval number, and event(s). A fragment with no events means that no motion was detected during that start time and duration.   
Width, Height     |    Refers to the width and height of the video in pixels.     
Regions    |    Regions refer to the area(s) in your video where you care about motion.  **1. ID** represents the region area. **2. TYPE** represents the shape of the region you are concerned about in regards to motion. In this version, it is always a polygon. **3. The region** is defined by an array of polygon points, each point has X and Y coordinates in a normalized scale of 0.0 to 1.0. **4. The X and Y coordinates** are relative to the landscape orientation of a video. For example, if you have a portrait video, you will have to transpose the coordinates accordingly. 
Start     |     The start time of the first event, in ticks.   
Duration     |   The length of the fragment, in ticks.      
Interval    |   The length of each event within the fragment, in ticks.    
Event    |     An of array of events. The outer array represents one interval of time. The inner array consists of 0 or more events that happened at that point in time.  
Type    |    In the current version, the integer 2 refers to when motion happened, integer 4 refers to when light changes happen.
TypeName    |    Will be “motion” when Type is 2 and “light change” when Type is 4. (This is a string).      
Location    |    An array of motion locations indicating where motion happens. There will always be one location in this version. The motion location has dimensions in X, Y, Width, and Height. The X and Y coordinates represent the upper left hand X, Y coordinates of the location in a normalized scale of 0.0 to 1.0. The width and height represent the size of the location in a normalized scale of 0.0 to 1.0. 

Below is a simple example of extracting the JSON into a per frame motion detection result:


```

var motionDetectionJsonString = operationResult.ProcessingResult;
var motionDetection = JsonConvert.DeserializeObject<MotionDetectionResult>(motionDetectionJsonString, settings);

```  

## <a name="summary"></a>Summary
You have now learned about the functionalities of the Video API: how you can upload a video, check its status, retrieve a stabilized video, and retrieve face detection/tracking and motion detection metadata.

For more information about API details, see the API reference guide “[Video API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/565d6516778daf15800928d5)”.
 
---

 
