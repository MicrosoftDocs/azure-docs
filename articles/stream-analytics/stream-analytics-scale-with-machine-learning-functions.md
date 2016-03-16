<properties
	pageTitle="Scale Stream Analytics with Machine Learning Functions | Microsoft Azure"
	description="Learn how to properly scale Stream Analytics jobs (partitioning, SU quantity, and more) when using Azure Machine Learning functions."
	keywords=""
	documentationCenter=""
	services="stream-analytics"
	authors="jeffstokes72"
	manager="paulettm"
	editor="cgronlun"
/>

<tags
	ms.service="stream-analytics"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="data-services"
	ms.date="03/18/2016"
	ms.author="jeffstok"
/>

# Scale Stream Analytics Job with Machine Learning Functions

It is often quite easy to set up an Stream Analytics job and run some sample data through it. What should we do when we need to run the same job with higher data volume? It requires us to understand how to configure the Stream Analytics job so that it will scale. In this document, we will focus on the special aspects of scaling Stream Analytics jobs with ML functions. Below is an article on how to scale Stream Analytics jobs in general.

https://azure.microsoft.com/en-us/documentation/articles/stream-analytics-scale-jobs/

## What is an ML function in Stream Analytics?

An ML function in Stream Analytics can be used like a regular function call in the Stream Analytics query language. However, behind the scene, ML function calls are actually Azure Machine Learning Web Service requests. ML web services support “batching” multiple rows, which is called mini-batch, in the same web service API call, to improve overall throughput. Please see the following links for more details on ML functions in Stream Analytics and Azure Machine Learning Web Service.

https://blogs.technet.microsoft.com/machinelearning/2015/12/10/azure-ml-now-available-as-a-function-in-azure-stream-analytics/

<https://azure.microsoft.com/en-us/documentation/articles/machine-learning-consume-web-services/#request-response-service-rrs>

## Configure an Stream Analytics job with ML functions

When configuring an ML function for Stream Analytics job, there are two parameters we need to consider, the batch size of ML function calls, and the SUs provisioned for the Stream Analytics job. How do we know what values to use for these parameters? First we need to decide the trade-off between latency and throughput, that is, latency of the Stream Analytics job, and throughput of each SU. We can always increase the overall throughput of an Stream Analytics job by provision more SU for a well partitioned Stream Analytics query for well partitioned Stream Analytics queries, although more SUs means more cost.

So, first we will need to answer the question – How much latency can we allow for this Stream Analytics job? The latency of the ML web service requests will increase with the batch size, and so does the latency of the Stream Analytics job. On the other side, increasing batch size allows the Stream Analytics job to process more events with the same number of ML web service requests. Also, most often, the increase of ML web service latency is sub-linear to the increase of batch size, and so you may want to find out the most cost-efficient batch size for your ML web service. The default batch size for ML web service requests is 1000, and we can change it using either using Stream Analytics REST API, or the PowerShell client of Stream Analytics.

<https://msdn.microsoft.com/en-us/library/mt653706.aspx>

<https://azure.microsoft.com/en-us/documentation/articles/stream-analytics-monitor-and-manage-jobs-use-powershell/>

Then, once we decide on the batch size, we can decide how many SUs (Streaming Units) to provision based on the number of events that the ML function needs to process per second. Follow the link to see more details about SUs.

https://azure.microsoft.com/en-us/documentation/articles/stream-analytics-scale-jobs/\#configuring-streaming-units

Currently, we have 20 concurrent connections to the ML web service behind the ML function for every 6 SUs, except that 1 SU jobs and 3 SU jobs will get 20 concurrent connections also. So, for example, suppose the input data rate is 200, 000 events per second; we use the default batch size 1000; and the ML web service latency with 1000 events mini-batch is 200ms, which means every connection can be used to make 5 requests to ML web service in a second. With 20 connections, the Stream Analytics job can process 20 \* 1000 = 20, 000 events in 200ms, can process 20, 000 \* 5 = 100,000 events in a second. Therefore, to process 200,000 events per second, the Stream Analytics job needs 40 concurrent connections, which means 12 SUs. The diagram below illustrates the requests from the Stream Analytics job to the ML web service endpoint – Every 6 SUs has 20 concurrent connections to ML web service at max.

In general, ***B*** for batch size, ***L*** for ML web service latency at batch size B in milliseconds, the throughput of an Stream Analytics job with ***N*** SUs is:

> 20 \* ceil(**N**/6) \***B** \* (1000/**L**).

There is also setting of max concurrent calls on the ML web service side, and it’s recommended to set it to the max value, which is 200 currently.

https://azure.microsoft.com/en-us/documentation/articles/machine-learning-scaling-webservice/

## Example – Sentiment Analysis

Suppose we set up an Stream Analytics job with sentiment analysis ML function, just as described in the tutorial below.

<https://azure.microsoft.com/en-us/documentation/articles/stream-analytics-machine-learning-integration-tutorial/>

The query is a simple, fully partitioned query, and the *sentiment* function

WITH subquery AS (

SELECT text, sentiment(text) as result from input

)

Select text, result.\[Score\]

Into output

From subquery

Suppose we have 10,000 tweets per second, and we set up an Stream Analytics job for sentiment analysis of tweets. The job uses 1 SU. Could this Stream Analytics job able to handle the traffic? By default, the batch size is 1000. This Stream Analytics job should work fine – it should be able to keep up with the input, and added latency is within a second, which is the latency of the sentiment analysis ML web service at 1000 batch size. The Stream Analytics job’s overall latency should be several seconds. Let’s take a more detailed look into this Stream Analytics job, especially the ML function calls. Having batch size as 1000, we 10,000 events will take about 10 requests to ML web service. Even with 1 SU, We have enough concurrent connections for this input
traffic.

What if the input event rate increases by 100X, and we need to process 1000,000 tweets per second. We have two options here:

1.  Increase batch size
2.  Partition input to process them in parallel

With the first option, the latency will increase. And with the second option, we need to provision more SUs and invoke more ML web service requests, which means higher dollar cost.

Suppose the latency of the sentiment analysis ML web service is 200ms for 1000-event batches or below, 250ms for 5,000-event batches, 300ms for 10,000-event batches, 500ms for 25,000-event batches.

With the first option, without provisioning more SUs, we can increase the batch size to 25,000 so that 1000,000 events per second can be processed with 20 concurrent connections to ML web service with latency of 500ms for each call. And therefore, the additional latency of the Stream Analytics job due to the ML web service requests will be increased from 200ms to 500ms. Note that batch size cannot be increased infinitely, as ML web services require the payload size of a request be within 4MB, and ML web service requests time out in 100 seconds.

With the second option, if we keep the batch size the same, with 200ms latency of the sentiment analysis ML web service, every 20 concurrent connections to ML web service is able to process 1000 \* 20 \* 5 events = 100,000 per second. So, to process 1000,000 events per second, we will need 60 SUs. Also, compared to the first option, Stream Analytics job will make more ML web service requests, which mean more dollar cost.

Below is a table for the throughput in number of events per second of the Stream Analytics job for different SUs and batch sizes.

  SU       batch size (ML latency)
  -------- ------------------------- --------------- --------------- ---------------- ----------------
           500 (200ms)
  1 SU     2,500
  3 SUs    2,500
  6 SUs    2,500
  12 SUs   5,000
  18 SUs   7,500
  24 SUs   10,000
  …        …
  60 SUs   25,000

By now, you already have a good understanding of how ML functions in Stream Analytics works. You probably also know that Stream Analytics jobs “pull” data from data sources, and each “pull” returns a batch of events for the Stream Analytics job to process. How does the pull model impact the ML web service requests? Normally the batch size we set for ML functions won’t exactly divide the number of events returned by each “pull”. When it happens, the ML web service will be called with “partial” batches, so that there won’t be any additional delay to wait for the next “pull”.

## ML Function Related Metrics

We have added three ML function related metrics, FUNCTION REQUESTS, FUNCTION EVENTS, and FAILED FUNCTION REQUESTS, as shown below.

![Scale Stream Analytics with Machine Learning Functions Metrics](./media/stream-analytics-scale-with-ml-functions/stream-analytics-scale-with-ml-functions-01.png "Scale Stream Analytics with Machine Learning Functions Metrics")

FUNCTION REQUESTS: The number of ML web service requests.

FUNCTION EVENTS: The number events in the requests.

FAILED FUNCTION REQUESTS: The number of failed ML web service requests.

##Key Takeaways  

In summary, in order to scale an Stream Analytics job with ML functions, we need consider the following aspects:

1.  The input event rate
2.  The allowed latency for the Stream Analytics job and thus the batch size of the ML web service requests
3.  The provisioned Stream Analytics SUs and the number of ML web service requests (the dollar cost)

We use a fully partitioned Stream Analytics query as the example. If you have a complex query to discuss, please feel free to reach out to the Stream Analytics team.