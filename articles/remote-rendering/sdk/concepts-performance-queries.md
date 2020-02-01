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

## See also

* [Create performance traces](../how-tos/performance-tracing.md)
* [Configuring the model conversion](../conversion/configure-model-conversion.md)
