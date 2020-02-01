---
title: Server-side performance queries
description: How to do server-side performance queries via API calls
author: FlorianBorn71
manager: jlyons
services: azure-remote-rendering
titleSuffix: Azure Remote Rendering
ms.author: flborn
ms.date: 02/01/2020
ms.topic: conceptual
ms.service: azure-remote-rendering
---

# Server-side performance queries

Good rendering performance on the server is critical for stable frame rates and thus a good user experience. Accordingly, it is important to monitor performance characteristics on the server carefully and optimize where necessary. Performance data can be queried through dedicated API functions as described in the following paragraphs.

Most impactful for the rendering performance is the model input data. You can tweak the input data as described in the [Configuring the model conversion](../conversion/configure-model-conversion.md) chapter.

Client-side application performance might be a bottleneck, too. For an in-depth analysis of client-side performance, it is recommended to take a [performance trace](../how-tos/performance-tracing.md).

## Frame statistics queries

Frame statistics provide some high-level information for the last frame such as latency. The following API call queries the statistics from the last frame:

````c#
// C#
void QueryFrameData(AzureSession session)
{
    FrameStatistics frameStatistics;
    if (session.GraphicsBinding.GetLastFrameStatistics(out frameStatistics) == Result.Success)
    {
        // do something with the result
    }

}
````

The retrieved `FrameStatistics` object holds a range of different details about session performance:

| Member | Explanation |
|:-|:-|
| latencyPoseToReceive | Roundtrip latency from requesting a frame for a new camera pose on the client to receiving this frame |
| latencyReceiveToPresent | Latency from receiving the new frame information to using it in a present operation |
| latencyPresentToDisplay  | Delay between the present operation beginning and the display showing the next frame |
| timeSinceLastPresent | Time-delta to the most recently finished present operation |
| videoFramesReceived | The total amount of frames received from the server in the last second |
| videoFrameReusedCount | Amount of received frames per second reused in subsequent present calls due to unavailable newer frames |
| videoFramesDiscarded | Amount of received frames per second which are unused (never shown) due to newer frames already being available |
| videoFrameMinDelta | Minimum amount of time between two consecutive frames arriving |
| videoFrameMaxDelta | Maximum amount of time between two consecutive frames arriving |

The `latency*` members are notable in that they give a general indicator which part of the client-server chain in the service present problems if the framerate is insufficient. If for example latencyPoseToReceive is high but latencyReceiveToPresent and latencyPresentToDisplay are low, this indicates a problem with the network or the server. Conversely, if latencyReceiveToPresent, latencyPresentToDisplay, or both are high while latencyPoseToReceive is low this indicates a problem on the client.

videoFramesReceived, videoFrameReusedCount and videoFramesDiscarded can be used to gauge network and server performance. If videoFramesReceived is low and videoFrameReusedCount is high, this can indicate network congestion or poor server performance. A high videoFramesDiscarded value also indicates network congestion.

Lastly, timeSinceLastPresent, videoFrameMinDelta, and videoFrameMaxDelta give an idea of the variance of incomming video frames and local present calls, which can be used to judge frame stability and in consequence the user experience.

## Performance assessment queries

Performance assessment queries provide more in-depth information about the CPU and GPU workload on the server. Performance snapshots can be queries via asynchronous API calls.

A single performance snapshot is represented by class `PerformanceAssessment`. It can be queried through the regular async query pattern:

``` cs
    private PerformanceAssessmentAsync _assessmentQuery = null;

    public void QueryPerformanceAssessment(AzureSession session)
    {
        _assessmentQuery = session.Actions.QueryServerPerformanceAssessmentAsync();
 _assessmentQuery.Completed += (PerformanceAssessmentAsync res) =>
            {
                // do something with the result:
                PerformanceAssessment result = res.Result;
                // ...

                _assessmentQuery = null;
            };

    }
```

Contrary to the `FrameStatistics` object the `PerformanceAssessment` object contains mostly server side information:

| Member | Explanation |
|:-|:-|
| timeCPU | Average CPU time per frame in milliseconds |
| timeGPU | Average GPU time per frame in milliseconds |
| utilizationCPU | Total CPU utilization in percent on the server host machine |
| utilizationGPU | Total GPU utilization in percent on the server host machine |
| memoryCPU | Total main memory utilization in percent on the server host machine |
| memoryGPU | Total dedicated video memory utilization in percent of the server GPU |
| networkLatency | The approximate average roundtrip network latency in milliseconds. More accurate than latencyPoseToReceive of `FrameStatistics` |
| polygonsRendered | The average amount of polygons rendered for one frame |

The `*CPU` and `*GPU` members give an idea about the health of the VM. For all the values given by the `PerformanceAssessment` object lower values are better.

## Output statistics

API class `ARRServiceStats` wraps around the frame statistics and performance assessment queries and provides convenient functionality to return averaged statistics as a string. The following code is the easiest way to show server-side statistics in your client application.

``` cs
private ARRServiceStats _stats = null;

void OnConnect()
{
    _stats = new ARRServiceStats();
}

void OnDisconnect()
{
    _stats = null;
}

void Update()
{
    if (_stats != null)
    {
        // update once a frame to retrieve new information and build average values
        _stats.Update(Service.CurrentActiveSession);
    
        // retrieve a string with relevant stats information
        InfoLabel.text = _stats.GetStatsString();
    }
}
    
```

Beside the `GetStatsString` API, which gives a preformatted string of all the values to be used in debug outputs, the ARRServiceStats object wil also hold all of the values from `FrameStatistics` and `PerformanceAssessment` as public members. Some of these are additionally aggregated and are therefore postfixed with `*Avg`, `*Max`, or `*Total`. The special member `FramesUsedForAverage` gives the corresponding window used for this aggregation.

## See also

* [Create performance traces](../how-tos/performance-tracing.md)
* [Configuring the model conversion](../conversion/configure-model-conversion.md)
