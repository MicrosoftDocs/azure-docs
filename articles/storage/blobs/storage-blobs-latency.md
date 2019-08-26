---
title: Latency in Blob storage - Azure Storage
description: 
services: storage
author: tamram

ms.service: storage
ms.topic: overview
ms.date: 08/26/2019
ms.author: tamram
ms.subservice: blobs
---

# Latency in Blob storage

Latency, sometimes referenced as response time, is the amount of time that an application must wait for a request to complete. Latency can directly affect an application’s performance. Low latency is often important for scenarios with humans in the loop, such as conducting credit card transactions or loading web pages. Systems that need to process incoming events at high rates, such as telemetry logging or IoT events, also require low latency. This article describes how to understand and measure latency for Blob storage operations, and how to design your Blob storage applications for low latency.

## About Azure Storage latency

Azure Storage latency depends on the request rates for Azure Storage operations. Request rates are also known as input/output operations per second (IOPS).

To understand IOPS in Azure Storage, assume that a request takes 50 milliseconds (ms) to complete. An application using one thread with one outstanding read or write operation should achieve 20 IOPS (1000ms / 50ms per request). Theoretically, if the thread count is doubled to two, then the application should be able to achieve 40 IOPS. If the outstanding read or write operations for each thread are doubled to two, then the application should be able to achieve 80 IOPS.

In practice, request rates do not always scale so linearly, due to overhead in the client from task scheduling, context switching, and so forth. On the service side, there can be variability in latency due to pressure on the Azure Storage system, differences in the storage media used, noise from other workloads, maintenance tasks, and other factors. Finally, the network connection between the client and the server may affect Azure Storage latency due to congestion, rerouting, or other disruptions.

Azure Storage bandwidth, also referred to as throughput, is related to the request rate and can be calculated by multiplying the request rate (IOPS) by the request size. For example, assuming 160 requests per second, each 256 KiB of data results in throughput of 40,960 KiB per second or 40 MiB per second.

## Latency metrics for block blobs

Azure Storage provides two latency metrics for block blobs. These metrics can be viewed in the Azure Portal:

- **End-to-end (E2E) latency** measures the interval from when Azure Storage receives the first packet of the request until Azure Storage receives a client acknowledgement on the last packet of the response.

- **Server latency** measures the interval from when Azure Storage receives the last packet of the request until the first packet of the response is returned from Azure Storage.

The following image shows the **Average Success E2E Latency** and **Average Success Server Latency** for a sample workload that calls the `Get Blob` operation:

![Screenshot showing latency metrics for Get Blob operation](media/storage-blobs-latency/latency-metrics-get-blob.png)

Under normal conditions, there is little gap between end-to-end latency and server latency, which is what the image shows for the sample workload.

## Factors influencing latency

To assess latency, first establish baseline metrics for your scenario. Baseline metrics provide you with the expected end-to-end and server latency in the context of your application environment, depending on your workload profile, application configuration settings, client resources, network pipe, and other factors. When you have baseline metrics, you can more easily identify abnormal versus normal conditions. Baseline metrics also enable you to observe the effects of changed parameters, such as application configuration or VM sizes.

The main factor influencing latency is operation size. It takes longer to complete larger operations, due to the amount of data being transferred over the network and processed by Azure Storage.

The following diagram shows the total time for operations of various sizes. For small amounts of data, the latency interval is predominantly spent handling the request, rather than transferring data. The total latency interval increases only slightly as the operation size increases (marked 1 in the diagram below). As the operation size further increases, more time is spent on transferring data, and the total operation time is roughly 50/50 (marked 2 in the diagram below). With larger operation sizes, the total time is almost exclusively spent on transferring data and the request handling is largely insignificant (marked 3 in the diagram below).

![Screenshot showing total operation time by operation size](media/storage-blobs-latency/operation-time-size-chart.png)

Another factor is client configuration such as concurrency and threading, which affects how many storage requests can be in flight at any given point in time and how your application uses threads and combined with the latency of each request determines the overall throughput. Client resources, which includes CPU, memory, local storage and network interface can also affect latency. Processing storage requests takes CPU and memory resources. If the client is under pressure due to underpowered VM or some runaway process in the system, there will be less resource to process storage requests. If the storage requests involve local storage, it too can be a resource constraint, either because it is not fast enough or contention from other processes. Any contention or lack of client resources will result in an increase in E2E latency without an increase in server latency, so essentially increasing the gap between the two.

Equally important is the network interface and network pipe between the client and Azure storage. The physical distance alone can be a significant factor, like is the client VM in the same Azure region, in another Azure region, or on-premises somewhere else? Other factors such as network hops, ISP routing, Internet state can influence overall storage latency.

## Block blob latency

Azure Blob Storage offers two different performance options: premium and standard. Azure Premium Blob Storage offers significantly lower and more consistent latency than Standard Blob Storage. If you look at your E2E and Server latency in Azure Storage Metrics, and:

- E2E is significantly higher than Server latency, you will want to investigate, determine and fix the source of latency.
- E2E and Server latency are close, and you need overall lower latency, you will want to look at Azure Premium Blob Storage.

For more performance details on Premium Blob Storage see this [blog post](https://aka.ms/premblobperf).

I hope this blog post helped you get some insights into what storage latency is, why it matters, and the performance metrics available in Azure portal to determine the source of storage latency. Look to Premium Blob Storage as the solution to reduce storage latency, and [possibly overall storage costs](https://azure.microsoft.com/en-us/blog/reducing-overall-storage-costs-with-azure-premium-blob-storage), for your critical or transaction-heavy applications.

