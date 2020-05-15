---
title: Analyze videos in near real time - Computer Vision
titleSuffix: Azure Cognitive Services
description: Learn how to perform near real-time analysis on frames that are taken from a live video stream by using the Computer Vision API.
services: cognitive-services
author: KellyDF
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: sample
ms.date: 09/09/2019
ms.author: kefre
ms.custom: seodec18
---

# Analyze videos in near real time

This article demonstrates how to perform near real-time analysis on frames that are taken from a live video stream by using the Computer Vision API. The basic elements of such an analysis are:

- Acquiring frames from a video source.
- Selecting which frames to analyze.
- Submitting these frames to the API.
- Consuming each analysis result that's returned from the API call.

The samples in this article are written in C#. To access the code, go to the [Video frame analysis sample](https://github.com/Microsoft/Cognitive-Samples-VideoFrameAnalysis/) page on GitHub.

## Approaches to running near real-time analysis

You can solve the problem of running near real-time analysis on video streams by using a variety of approaches. This article outlines three of them, in increasing levels of sophistication.

### Design an infinite loop

The simplest design for near real-time analysis is an infinite loop. In each iteration of this loop, you grab a frame, analyze it, and then consume the result:

```csharp
while (true)
{
    Frame f = GrabFrame();
    if (ShouldAnalyze(f))
    {
        AnalysisResult r = await Analyze(f);
        ConsumeResult(r);
    }
}
```

If your analysis were to consist of a lightweight, client-side algorithm, this approach would be suitable. However, when the analysis occurs in the cloud, the resulting latency means that an API call might take several seconds. During this time, you're not capturing images, and your thread is essentially doing nothing. Your maximum frame rate is limited by the latency of the API calls.

### Allow the API calls to run in parallel

Although a simple, single-threaded loop makes sense for a lightweight, client-side algorithm, it doesn't fit well with the latency of a cloud API call. The solution to this problem is to allow the long-running API call to run in parallel with the frame-grabbing. In C#, you could do this by using task-based parallelism. For example, you can run the following code:

```csharp
while (true)
{
    Frame f = GrabFrame();
    if (ShouldAnalyze(f))
    {
        var t = Task.Run(async () =>
        {
            AnalysisResult r = await Analyze(f);
            ConsumeResult(r);
        }
    }
}
```

With this approach, you launch each analysis in a separate task. The task can run in the background while you continue grabbing new frames. The approach avoids blocking the main thread as you wait for an API call to return. However, the approach can present certain disadvantages:
* It costs you some of the guarantees that the simple version provided. That is, multiple API calls might occur in parallel, and the results might get returned in the wrong order. 
* It could also cause multiple threads to enter the ConsumeResult() function simultaneously, which might be dangerous if the function isn't thread-safe. 
* Finally, this simple code doesn't keep track of the tasks that get created, so exceptions silently disappear. Thus, you need to add a "consumer" thread that tracks the analysis tasks, raises exceptions, kills long-running tasks, and ensures that the results get consumed in the correct order, one at a time.

### Design a producer-consumer system

For your final approach, designing a "producer-consumer" system, you build a producer thread that looks similar to your previously mentioned infinite loop. However, instead of consuming the analysis results as soon as they're available, the producer simply places the tasks in a queue to keep track of them.

```csharp
// Queue that will contain the API call tasks.
var taskQueue = new BlockingCollection<Task<ResultWrapper>>();

// Producer thread.
while (true)
{
    // Grab a frame.
    Frame f = GrabFrame();

    // Decide whether to analyze the frame.
    if (ShouldAnalyze(f))
    {
        // Start a task that will run in parallel with this thread.
        var analysisTask = Task.Run(async () =>
        {
            // Put the frame, and the result/exception into a wrapper object.
            var output = new ResultWrapper(f);
            try
            {
                output.Analysis = await Analyze(f);
            }
            catch (Exception e)
            {
                output.Exception = e;
            }
            return output;
        }

        // Push the task onto the queue.
        taskQueue.Add(analysisTask);
    }
}
```

You also create a consumer thread, which takes tasks off the queue, waits for them to finish, and either displays the result or raises the exception that was thrown. By using the queue, you can guarantee that the results get consumed one at a time, in the correct order, without limiting the maximum frame rate of the system.

```csharp
// Consumer thread.
while (true)
{
    // Get the oldest task.
    Task<ResultWrapper> analysisTask = taskQueue.Take();
 
    // Wait until the task is completed.
    var output = await analysisTask;

    // Consume the exception or result.
    if (output.Exception != null)
    {
        throw output.Exception;
    }
    else
    {
        ConsumeResult(output.Analysis);
    }
}
```

## Implement the solution

### Get started quickly

To help get your app up and running as quickly as possible, we've implemented the system that's described in the preceding section. It's intended to be flexible enough to accommodate many scenarios, while being easy to use. To access the code, go to the [Video frame analysis sample](https://github.com/Microsoft/Cognitive-Samples-VideoFrameAnalysis/) page on GitHub.

The library contains the `FrameGrabber` class, which implements the previously discussed producer-consumer system to process video frames from a webcam. Users can specify the exact form of the API call, and the class uses events to let the calling code know when a new frame is acquired, or when a new analysis result is available.

To illustrate some of the possibilities, we've provided two sample apps that use the library. 

The first sample app is a simple console app that grabs frames from the default webcam and then submits them to the Face service for face detection. A simplified version of the app is reproduced in the following code:

```csharp
using System;
using System.Linq;
using Microsoft.Azure.CognitiveServices.Vision.Face;
using Microsoft.Azure.CognitiveServices.Vision.Face.Models;
using VideoFrameAnalyzer;

namespace BasicConsoleSample
{
    internal class Program
    {
        const string ApiKey = "<your API key>";
        const string Endpoint = "https://<your API region>.api.cognitive.microsoft.com";

        private static async Task Main(string[] args)
        {
            // Create grabber.
            FrameGrabber<DetectedFace[]> grabber = new FrameGrabber<DetectedFace[]>();

            // Create Face Client.
            FaceClient faceClient = new FaceClient(new ApiKeyServiceClientCredentials(ApiKey))
            {
                Endpoint = Endpoint
            };

            // Set up a listener for when we acquire a new frame.
            grabber.NewFrameProvided += (s, e) =>
            {
                Console.WriteLine($"New frame acquired at {e.Frame.Metadata.Timestamp}");
            };

            // Set up a Face API call.
            grabber.AnalysisFunction = async frame =>
            {
                Console.WriteLine($"Submitting frame acquired at {frame.Metadata.Timestamp}");
                // Encode image and submit to Face service.
                return (await faceClient.Face.DetectWithStreamAsync(frame.Image.ToMemoryStream(".jpg"))).ToArray();
            };

            // Set up a listener for when we receive a new result from an API call.
            grabber.NewResultAvailable += (s, e) =>
            {
                if (e.TimedOut)
                    Console.WriteLine("API call timed out.");
                else if (e.Exception != null)
                    Console.WriteLine("API call threw an exception.");
                else
                    Console.WriteLine($"New result received for frame acquired at {e.Frame.Metadata.Timestamp}. {e.Analysis.Length} faces detected");
            };

            // Tell grabber when to call the API.
            // See also TriggerAnalysisOnPredicate
            grabber.TriggerAnalysisOnInterval(TimeSpan.FromMilliseconds(3000));

            // Start running in the background.
            await grabber.StartProcessingCameraAsync();

            // Wait for key press to stop.
            Console.WriteLine("Press any key to stop...");
            Console.ReadKey();

            // Stop, blocking until done.
            await grabber.StopProcessingAsync();
        }
    }
}
```

The second sample app is a bit more interesting. It allows you to choose which API to call on the video frames. On the left side, the app shows a preview of the live video. On the right, it overlays the most recent API result on the corresponding frame.

In most modes, there's a visible delay between the live video on the left and the visualized analysis on the right. This delay is the time that it takes to make the API call. An exception is in the "EmotionsWithClientFaceDetect" mode, which performs face detection locally on the client computer by using OpenCV before it submits any images to Azure Cognitive Services. 

By using this approach, you can visualize the detected face immediately. You can then update the emotions later, after the API call returns. This demonstrates the possibility of a "hybrid" approach. That is, some simple processing can be performed on the client, and then Cognitive Services APIs can be used to augment this processing with more advanced analysis when necessary.

![The LiveCameraSample app displaying an image with tags](../../Video/Images/FramebyFrame.jpg)

### Integrate the samples into your codebase

To get started with this sample, do the following:

1. Get API keys for the Vision APIs from [Subscriptions](https://azure.microsoft.com/try/cognitive-services/). For video frame analysis, the applicable services are:
    - [Computer Vision](https://docs.microsoft.com/azure/cognitive-services/computer-vision/home)
    - [Face](https://docs.microsoft.com/azure/cognitive-services/face/overview)
2. Clone the [Cognitive-Samples-VideoFrameAnalysis](https://github.com/Microsoft/Cognitive-Samples-VideoFrameAnalysis/) GitHub repo.

3. Open the sample in Visual Studio 2015 or later, and then build and run the sample applications:
    - For BasicConsoleSample, the Face key is hard-coded directly in [BasicConsoleSample/Program.cs](https://github.com/Microsoft/Cognitive-Samples-VideoFrameAnalysis/blob/master/Windows/BasicConsoleSample/Program.cs).
    - For LiveCameraSample, enter the keys in the **Settings** pane of the app. The keys are persisted across sessions as user data.

When you're ready to integrate the samples, reference the VideoFrameAnalyzer library from your own projects.

The image-, voice-, video-, and text-understanding capabilities of VideoFrameAnalyzer use Azure Cognitive Services. Microsoft receives the images, audio, video, and other data that you upload (via this app) and might use them for service-improvement purposes. We ask for your help in protecting the people whose data your app sends to Azure Cognitive Services.

## Summary

In this article, you learned how to run near real-time analysis on live video streams by using the Face and Computer Vision services. You also learned how you can use our sample code to get started. To get started building your app by using free API keys, go to the [Azure Cognitive Services sign-up page](https://azure.microsoft.com/try/cognitive-services/).

Feel free to provide feedback and suggestions in the [GitHub repository](https://github.com/Microsoft/Cognitive-Samples-VideoFrameAnalysis/). To provide broader API feedback, go to our [UserVoice site](https://cognitive.uservoice.com/).

