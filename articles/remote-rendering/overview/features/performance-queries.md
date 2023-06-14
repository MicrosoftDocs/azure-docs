---
title: Server-side performance queries
description: How to do server-side performance queries via API calls
author: florianborn71
ms.author: flborn
ms.date: 02/10/2020
ms.topic: article
ms.custom: devx-track-csharp
---

# Server-side performance queries

Good rendering performance on the server is critical for stable frame rates and a good user experience. It's important to monitor performance characteristics on the server carefully and optimize where necessary. Performance data can be queried through dedicated API functions.

Most impactful for the rendering performance is the model input data. You can tweak the input data as described in [Configuring the model conversion](../../how-tos/conversion/configure-model-conversion.md).

Client-side application performance might be a bottleneck, too. For an in-depth analysis of client-side performance, it's recommended to take a [:::no-loc text="performance trace":::](../../how-tos/performance-tracing.md).

## Client/server timeline

Before going into detail regarding the various latency values, it's worthwhile to have a look at the synchronization points between client and server on the timeline:

![Pipeline timeline](./media/server-client-timeline.png)

The illustration shows how:

* a *Pose estimate* is kicked off by the client at constant 60-Hz frame rate (every 16.6 ms)
* the server then starts rendering, based on the pose
* the server sends back the encoded video image
* the client decodes the image, performs some CPU and GPU work on top of it and then displays the image

## Frame statistics queries

Frame statistics provide some high-level information for the last frame, such as latency. The data provided in the `FrameStatistics` structure is measured on the client side, so the API is a synchronous call:

```cs
void QueryFrameData(RenderingSession session)
{
    FrameStatistics frameStatistics;
    if (session.GraphicsBinding.GetLastFrameStatistics(out frameStatistics) == Result.Success)
    {
        // do something with the result
    }
}
```

```cpp
void QueryFrameData(ApiHandle<RenderingSession> session)
{
    FrameStatistics frameStatistics;
    if (session->GetGraphicsBinding()->GetLastFrameStatistics(&frameStatistics) == Result::Success)
    {
        // do something with the result
    }
}
```

The retrieved `FrameStatistics` object holds the following members:

| Member | Explanation |
|:-|:-|
| LatencyPoseToReceive | Latency from camera pose estimation on the client device until a server frame for this pose is fully available to the client application. This value includes network roundtrip, server render time, video decode, and jitter compensation. See **interval 1 in the illustration above.**|
| LatencyReceiveToPresent | Latency from availability of a received remote frame until the client app calls PresentFrame on the CPU. See **interval 2 in the illustration above.**|
| LatencyPresentToDisplay  | Latency from presenting a frame on the CPU until display lights up. This value includes client GPU time, any frame buffering performed by the OS, hardware reprojection, and device-dependent display scan-out time. See **interval 3 in the illustration above.**|
| TimeSinceLastPresent | The time between subsequent calls to PresentFrame on the CPU. Values greater than the display duration (for example 16.6 ms on a 60-Hz client device) indicate issues caused by the client application not finishing its CPU workload in time.|
| VideoFramesReceived | The number of frames received from the server in the last second. |
| VideoFrameReusedCount | Number of received frames in the last second that were used on the device more than once. Non-zero values indicate that frames had to be reused and reprojected either due to network jitter or excessive server rendering time. |
| VideoFramesSkipped | Number of received frames in the last second that were decoded, but not shown on display because a newer frame has arrived. Non-zero values indicate that network jittering caused multiple frames to be delayed and then arrive on the client device together in a burst. |
| VideoFramesDiscarded | Very similar to **VideoFramesSkipped**, but the reason for being discarded is that a frame came in so late that it can't even be correlated with any pending pose anymore. If this discarding happens, there's some severe network contention.|
| VideoFrameMinDelta | Minimum amount of time between two consecutive frames arriving during the last second. Together with VideoFrameMaxDelta, this range gives an indication of jitter caused either by the network or video codec. |
| VideoFrameMaxDelta | Maximum amount of time between two consecutive frames arriving during the last second. Together with VideoFrameMinDelta, this range gives an indication of jitter caused either by the network or video codec. |

The sum of all latency values is typically much larger than the available frame time at 60 Hz. This is OK, because multiple frames are in flight in parallel, and new frame requests are kicked off at the desired frame rate, as shown in the illustration. However if latency becomes too large, it affects the quality of the [late stage reprojection](../../overview/features/late-stage-reprojection.md), and may compromise the overall experience.

`VideoFramesReceived`, `VideoFrameReusedCount`, and `VideoFramesDiscarded` can be used to gauge network and server performance. A combination of a low `VideoFramesReceived` value and a high `VideoFrameReusedCount` value can indicate network congestion or poor server performance. A high `VideoFramesDiscarded` value also indicates network congestion.

Lastly,`TimeSinceLastPresent`, `VideoFrameMinDelta`, and `VideoFrameMaxDelta` give an idea of the variance of incoming video frames and local present calls. High variance means instable frame rate.

None of the values above gives clear indication of pure network latency (the red arrows in the illustration), because the exact time that the server is busy rendering needs to be subtracted from the roundtrip value `LatencyPoseToReceive`. The server-side portion of the overall latency is information that is unavailable to the client. However, the next paragraph explains how this value is approximated through extra input from the server and exposed through the `NetworkLatency` value.

## Performance assessment queries

*Performance assessment queries* provide more in-depth information about the CPU and GPU workload on the server. Since the data is requested from the server, querying a performance snapshot follows the usual async pattern:

```cs
async void QueryPerformanceAssessment(RenderingSession session)
{
    try
    {
        PerformanceAssessment result = await session.Connection.QueryServerPerformanceAssessmentAsync();
        // do something with result...
    }
    catch (RRException ex)
    {
    }
}
```

```cpp
void QueryPerformanceAssessment(ApiHandle<RenderingSession> session)
{
    session->Connection()->QueryServerPerformanceAssessmentAsync([](Status status, PerformanceAssessment result) {
        if (status == Status::OK)
        {
            // do something with result...
        }
    });
}
```

Contrary to the `FrameStatistics` object, the `PerformanceAssessment` object contains server-side information:

| Member | Explanation |
|:-|:-|
| TimeCPU | Average server CPU time per frame in milliseconds |
| TimeGPU | Average server GPU time per frame in milliseconds |
| UtilizationCPU | Total server CPU utilization in percent |
| UtilizationGPU | Total server GPU utilization in percent |
| MemoryCPU | Total server main memory utilization in percent |
| MemoryGPU | Total dedicated video memory utilization in percent of the server GPU |
| NetworkLatency | The approximate average roundtrip network latency in milliseconds. In the illustration above, this value corresponds to the sum of the red arrows. The value is computed by subtracting actual server rendering time from the `LatencyPoseToReceive` value of `FrameStatistics`. While this approximation isn't accurate, it gives some indication of the network latency, isolated from the latency values computed on the client. |
| PolygonsRendered | The number of triangles rendered in one frame. This number also includes the triangles that are culled later during rendering. That means, this number doesn't vary a lot across different camera positions, but performance can vary drastically, depending on the triangle culling rate.|
| PointsRendered | The number of points in point clouds rendered in one frame. Same culling criteria as mentioned above for `PolygonsRendered` apply here.|

To help you assess the values, each portion comes with a quality classification like **Great**, **Good**, **Mediocre**, or **Bad**.
This assessment metric provides a rough indication of the server's health, but it shouldn't be seen as absolute. For example, assume you see a 'mediocre' score for the GPU time. It's considered mediocre because it gets close to the limit for the overall frame time budget. In your case however, it might be a good value nonetheless, because you're rendering a complex model.

## Statistics debug output

The class `ServiceStatistics` is a C# class that wraps around both the frame statistics and performance assessment queries and provides convenient functionality to return statistics as aggregated values or as a pre-built string. The following code is the easiest way to show server-side statistics in your client application.

```cs
ServiceStatistics _stats = null;

void OnConnect()
{
    _stats = new ServiceStatistics();
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

The code above populates the text label with the following text:

![ArrServiceStats string output](./media/arr-service-stats.png)

The `GetStatsString` API formats a string of all the values, but each single value can also be queried programmatically from the `ServiceStatistics` instance.

There are also variants of the members, which aggregate the values over time. See members with suffix `*Avg`, `*Max`, or `*Total`. The member `FramesUsedForAverage` indicates how many frames have been used for this aggregation.

## API documentation

* [C# RenderingConnection.QueryServerPerformanceAssessmentAsync()](/dotnet/api/microsoft.azure.remoterendering.renderingconnection.queryserverperformanceassessmentasync)
* [C++ RenderingConnection::QueryServerPerformanceAssessmentAsync()](/cpp/api/remote-rendering/renderingconnection#queryserverperformanceassessmentasync)

## Next steps

* [Create performance traces](../../how-tos/performance-tracing.md)
* [Configuring the model conversion](../../how-tos/conversion/configure-model-conversion.md)