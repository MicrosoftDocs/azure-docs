---
title: Scale Machine Learning Studio (classic) functions in Azure Stream Analytics
description: This article describes how to scale Stream Analytics jobs that use Machine Learning Studio (classic) functions, by configuring partitioning and stream units.

ms.service: stream-analytics
ms.topic: how-to
ms.date: 01/15/2021
---
# Scale your Stream Analytics job with Machine Learning Studio (classic) functions

> [!TIP]
> It is highly recommended to use [Azure Machine Learning UDFs](machine-learning-udf.md) instead of Machine Learning Studio (classic) UDF for improved performance and reliability.

[!INCLUDE [ML Studio (classic) retirement](../../includes/machine-learning-studio-classic-deprecation.md)]

This article discusses how to efficiently scale Azure Stream Analytics jobs that use Machine Learning Studio (classic) functions. For information on how to scale Stream Analytics jobs in general see the article [Scaling jobs](stream-analytics-scale-jobs.md).

## What is a Studio (classic) function in Stream Analytics?

A Machine Learning Studio (classic) function in Stream Analytics can be used like a regular function call in the Stream Analytics query language. Behind the scenes, however, these function calls are actually Studio (classic) Web Service requests.

You can improve the throughput of Studio (classic) web service requests by "batching" multiple rows together in the same web service API call. This grouping is called a mini-batch. For more information, see [Machine Learning Studio (classic) Web Services](../machine-learning/classic/consume-web-services.md). Support for Studio (classic) in Stream Analytics.

## Configure a Stream Analytics job with Studio (classic) functions

There are two parameters to configure the Studio (classic) function used by your Stream Analytics job:

* Batch size of the Studio (classic) function calls.
* The number of Streaming Units (SUs) provisioned for the Stream Analytics job.

To determine the appropriate values for SUs, decide whether you would like to optimize latency of the Stream Analytics job or the throughput of each SU. SUs may always be added to a job to increase the throughput of a well-partitioned Stream Analytics query. Additional SUs do increase the cost of running the job.

Determine the latency *tolerance* for your Stream Analytics job. 
Increasing the batch size will increase the latency of your Studio (classic) requests and the latency of the Stream Analytics job.

Increasing the batch size allows the Stream Analytics job to process **more events** with the **same number** of Studio (classic) web service requests. The increase of Studio (classic) web service latency is usually sublinear to the increase of batch size. 

It's important to consider the most cost-efficient batch size for a Studio (classic) web service in any given situation. The default batch size for web service requests is 1000. You can change this default size using the [Stream Analytics REST API](/previous-versions/azure/mt653706(v=azure.100) "Stream Analytics REST API") or the [PowerShell client for Stream Analytics](stream-analytics-monitor-and-manage-jobs-use-powershell.md).

Once you've decided on a batch size, you can set the number of streaming units (SUs), based on the number of events that the function needs to process per second. For more information about streaming units, see [Stream Analytics scale jobs](stream-analytics-scale-jobs.md).

Every 6 SUs get 20 concurrent connections to the Studio (classic) web service. However, 1 SU job and 3 SU jobs get 20 concurrent connections.  

If your application generates 200,000 events per second, and the batch size is 1000, then the resulting web service latency is 200 ms. This rate means that every connection can make five requests to the Studio (classic) web service each second. With 20 connections, the Stream Analytics job can process 20,000 events in 200 ms and 100,000 events in a second.

To process 200,000 events per second, the Stream Analytics job needs 40 concurrent connections, which come out to 12 SUs. The following diagram illustrates the requests from the Stream Analytics job to the Studio (classic) web service endpoint – Every 6 SUs has 20 concurrent connections to Studio (classic) web service at max.

![Scale Stream Analytics with Studio (classic) Functions two job example](./media/stream-analytics-scale-with-ml-functions/stream-analytics-scale-with-ml-functions-00.png "Scale Stream Analytics with Studio (classic) Functions two job example")

In general, ***B*** for batch size, ***L*** for the web service latency at batch size B in milliseconds, the throughput of a Stream Analytics job with ***N*** SUs is:

![Scale Stream Analytics with Studio (classic) Functions Formula](./media/stream-analytics-scale-with-ml-functions/stream-analytics-scale-with-ml-functions-02.png "Scale Stream Analytics with Studio (classic) Functions Formula")

You can also configure the 'max concurrent calls' on the Studio (classic) web service. It's recommended to set this parameter to the maximum value (200 currently).

For more information on this setting, review the [Scaling article for Machine Learning Studio (classic) Web Services](../machine-learning/classic/create-endpoint.md).

## Example – Sentiment Analysis
The following example includes a Stream Analytics job with the sentiment analysis Studio (classic) function, as described in the [Stream Analytics Machine Learning Studio (classic) integration tutorial](stream-analytics-machine-learning-integration-tutorial.md).

The query is a simple fully partitioned query followed by the **sentiment** function, as shown in the following example:

```SQL
    WITH subquery AS (
        SELECT text, sentiment(text) as result from input
    )

    Select text, result.[Score]
    Into output
    From subquery
```

Let's examine the configuration necessary to create a Stream Analytics job, which does sentiment analysis of tweets at a rate of 10,000 tweets per second.

Using 1 SU, could this Stream Analytics job handle the traffic? The job can keep up with the input using the default batch size of 1000. The default latency of the sentiment analysis Studio (classic) web service (with a default batch size of 1000) creates no more than a second of latency.

The Stream Analytics job's **overall** or end-to-end latency would typically be a few seconds. Take a more detailed look into this Stream Analytics job, *especially* the Studio (classic) function calls. With a batch size of 1000, a throughput of 10,000 events takes about 10 requests to the web service. Even with one SU, there are enough concurrent connections to accommodate this input traffic.

If the input event rate increases by 100x, then the Stream Analytics job needs to process 1,000,000 tweets per second. There are two options to accomplish the increased scale:

1. Increase the batch size.
2. Partition the input stream to process the events in parallel.

With the first option, the job **latency** increases.

With the second option, you will have to provision more SUs to have more concurrent Studio (classic) web service requests. This greater number of SUs, increases the job **cost**.

Let's look at the scaling using the following latency measurements for each batch size:

| Latency | Batch size |
| --- | --- |
| 200 ms | 1000-event batches or below |
| 250 ms | 5,000-event batches |
| 300 ms | 10,000-event batches |
| 500 ms | 25,000-event batches |

1. Using the first option (**not** provisioning more SUs). The batch size could be increased to **25,000**. Increasing the batch size in this way will allow the job to process 1,000,000 events with 20 concurrent connections to the Studio (classic) web service (with a latency of 500 ms per call). So the additional latency of the Stream Analytics job due to the sentiment function requests against the Studio (classic) web service requests would be increased from **200 ms** to **500 ms**. However, batch size **can't** be increased infinitely as the Studio (classic) web services requires the payload size of a request be 4 MB or smaller, and web service requests timeout after 100 seconds of operation.
1. Using the second option, the batch size is left at 1000, with 200-ms web service latency, every 20 concurrent connections to the web service would be able to process 1000 * 20 * 5 events = 100,000 per second. So to process 1,000,000 events per second, the job would need 60 SUs. Compared to the first option, Stream Analytics job would make more web service batch requests, in turn generating an increased cost.

Below is a table for the throughput of the Stream Analytics job for different SUs and batch sizes (in number of events per second).

| batch size (ML latency) | 500 (200 ms) | 1,000 (200 ms) | 5,000 (250 ms) | 10,000 (300 ms) | 25,000 (500 ms) |
| --- | --- | --- | --- | --- | --- |
| **1 SU** |2,500 |5,000 |20,000 |30,000 |50,000 |
| **3 SUs** |2,500 |5,000 |20,000 |30,000 |50,000 |
| **6 SUs** |2,500 |5,000 |20,000 |30,000 |50,000 |
| **12 SUs** |5,000 |10,000 |40,000 |60,000 |100,000 |
| **18 SUs** |7,500 |15,000 |60,000 |90,000 |150,000 |
| **24 SUs** |10,000 |20,000 |80,000 |120,000 |200,000 |
| **…** |… |… |… |… |… |
| **60 SUs** |25,000 |50,000 |200,000 |300,000 |500,000 |

By now, you should already have a good understanding of how Studio (classic) functions in Stream Analytics work. You likely also understand that Stream Analytics jobs "pull" data from data sources and each "pull" returns a batch of events for the Stream Analytics job to process. How does this pull model impact the Studio (classic) web service requests?

Normally, the batch size we set for Studio (classic) functions won't exactly be divisible by the number of events returned by each Stream Analytics job "pull". When this occurs, the Studio (classic) web service is called with "partial" batches. Using partial batches avoids incurring additional job latency overhead in coalescing events from pull to pull.

## New function-related monitoring metrics
In the Monitor area of a Stream Analytics job, three additional function-related metrics have been added. They are **FUNCTION REQUESTS**, **FUNCTION EVENTS** and **FAILED FUNCTION REQUESTS**, as shown in the graphic below.

![Scale Stream Analytics with Studio (classic) Functions Metrics](./media/stream-analytics-scale-with-ml-functions/stream-analytics-scale-with-ml-functions-01.png "Scale Stream Analytics with Studio (classic) Functions Metrics")

The are defined as follows:

**FUNCTION REQUESTS**: The number of function requests.

**FUNCTION EVENTS**: The number events in the function requests.

**FAILED FUNCTION REQUESTS**: The number of failed function requests.

## Key Takeaways

To scale a Stream Analytics job with Studio (classic) functions, consider the following factors:

1. The input event rate.
2. The tolerated latency for the running Stream Analytics job (and thus the batch size of the Studio (classic) web service requests).
3. The provisioned Stream Analytics SUs and the number of Studio (classic) web service requests (the additional function-related costs).

A fully partitioned Stream Analytics query was used as an example. If a more complex query is needed, the [Microsoft Q&A question page for Azure Stream Analytics](/answers/topics/azure-stream-analytics.html) is a great resource for getting additional help from the Stream Analytics team.

## Next steps
To learn more about Stream Analytics, see:

* [Get started using Azure Stream Analytics](stream-analytics-real-time-fraud-detection.md)
* [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Azure Stream Analytics Query Language Reference](/stream-analytics-query/stream-analytics-query-language-reference)
* [Azure Stream Analytics Management REST API Reference](/rest/api/streamanalytics/)
