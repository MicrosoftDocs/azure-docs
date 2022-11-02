---
title: Troubleshoot availability issues in Azure Storage accounts
description: Identify and troubleshoot availability issues in Azure Storage accounts.
author: normesta
ms.topic: troubleshooting
ms.author: normesta
ms.date: 05/23/2022
ms.service: storage
ms.subservice: common
services: storage

---

# Troubleshoot availability issues in Azure Storage accounts

This article helps you investigate changes in the availability (such as number of failed requests). These changes in availability can often be identified by monitoring storage metrics in Azure Monitor. For general information about using metrics and logs in Azure Monitor, see

- [Monitoring Azure Blob Storage](../blobs/monitor-blob-storage.md)
- [Monitoring Azure Files](../files/storage-files-monitoring.md)
- [Monitoring Azure Queue Storage](../queues/monitor-queue-storage.md)
- [Monitoring Azure Table storage](../tables/monitor-table-storage.md)

## Monitoring availability

You should monitor the availability of the storage services in your storage account by monitoring the value of the **Availability** metric. The **Availability** metric contains a percentage value and is calculated by taking the total billable requests value and dividing it by the number of applicable requests, including those requests that produced unexpected errors.

Any value less than 100% indicates that some storage requests are failing. You can see why they are failing by examining the **ResponseType** dimension for error types such as **ServerTimeoutError**. You should expect to see **Availability** fall temporarily below 100% for reasons such as transient server timeouts while the service moves partitions to better load-balance request; the retry logic in your client application should handle such intermittent conditions. 

You can use features in Azure Monitor to alert you if **Availability** for a service falls below a threshold that you specify.

## Metrics show an increase in throttling errors

Throttling errors occur when you exceed the scalability targets of a storage service. The storage service throttles to ensure that no single client or tenant can use the service at the expense of others. For more information, see [Scalability and performance targets for standard storage accounts](scalability-targets-standard-account.md) for details on scalability targets for storage accounts and performance targets for partitions within storage accounts.

If the **ClientThrottlingError** or **ServerBusyError** value of the **ResponseType** dimension shows an increase in the percentage of requests that are failing with a throttling error, you need to investigate one of two scenarios:

- Transient increase in PercentThrottlingError
- Permanent increase in PercentThrottlingError error

An increase in throttling errors often occurs at the same time as an increase in the number of storage requests, or when you are initially load testing your application. This may also manifest itself in the client as "503 Server Busy" or "500 Operation Timeout" HTTP status messages from storage operations.

### Transient increase in throttling errors

If you are seeing spikes in throttling errors that coincide with periods of high activity for the application, you implement an exponential (not linear) back-off strategy for retries in your client. Back-off retries reduce the immediate load on the partition and help your application to smooth out spikes in traffic. For more information about how to implement retry policies using the Storage Client Library, see the [RetryOptions.MaxRetries](/dotnet/api/microsoft.azure.storage.retrypolicies) property.

> [!NOTE]
> You may also see spikes in throttling errors that do not coincide with periods of high activity for the application: the most likely cause here is the storage service moving partitions to improve load balancing.

### Permanent increase in throttling errors

If you are seeing a consistently high value for throttling errors following a permanent increase in your transaction volumes, or when you are performing your initial load tests on your application, then you need to evaluate how your application is using storage partitions and whether it is approaching the scalability targets for a storage account. For example, if you are seeing throttling errors on a queue (which counts as a single partition), then you should consider using additional queues to spread the transactions across multiple partitions. If you are seeing throttling errors on a table, you need to consider using a different partitioning scheme to spread your transactions across multiple partitions by using a wider range of partition key values. One common cause of this issue is the prepend/append anti-pattern where you select the date as the partition key and then all data on a particular day is written to one partition: under load, this can result in a write bottleneck. Either consider a different partitioning design or evaluate whether using blob storage might be a better solution. Also check whether throttling is occurring as a result of spikes in your traffic and investigate ways of smoothing your pattern of requests.

If you distribute your transactions across multiple partitions, you must still be aware of the scalability limits set for the storage account. For example, if you used ten queues each processing the maximum of 2,000 1KB messages per second, you will be at the overall limit of 20,000 messages per second for the storage account. If you need to process more than 20,000 entities per second, you should consider using multiple storage accounts. You should also bear in mind that the size of your requests and entities has an impact on when the storage service throttles your clients: if you have larger requests and entities, you may be throttled sooner.

Inefficient query design can also cause you to hit the scalability limits for table partitions. For example, a query with a filter that only selects one percent of the entities in a partition but that scans all the entities in a partition will need to access each entity. Every entity read will count towards the total number of transactions in that partition; therefore, you can easily reach the scalability targets.

> [!NOTE]
> Your performance testing should reveal any inefficient query designs in your application.

## Metrics show an increase in timeout errors

Timeout errors occur when the **ResponseType** dimension is equal to **ServerTimeoutError** or **ClientTimeout**.

Your metrics show an increase in timeout errors for one of your storage services. At the same time, the client receives a high volume of "500 Operation Timeout" HTTP status messages from storage operations.

> [!NOTE]
> You may see timeout errors temporarily as the storage service load balances requests by moving a partition to a new server.

The server timeouts (**ServerTimeOutError**) are caused by an error on the server. The client timeouts (**ClientTimeout**) happen because an operation on the server has exceeded the timeout specified by the client; for example, a client using the Storage Client Library can set a timeout for an operation.

Server timeouts indicate a problem with the storage service that requires further investigation. You can use metrics to see if you are hitting the scalability limits for the service and to identify any spikes in traffic that might be causing this problem. If the problem is intermittent, it may be due to load-balancing activity in the service. If the problem is persistent and is not caused by your application hitting the scalability limits of the service, you should raise a support issue. For client timeouts, you must decide if the timeout is set to an appropriate value in the client and either change the timeout value set in the client or investigate how you can improve the performance of the operations in the storage service, for example by optimizing your table queries or reducing the size of your messages.

## Metrics show an increase in network errors

Network errors occur when the **ResponseType** dimension is equal to **NetworkError**. These occur when a storage service detects a network error when the client makes a storage request.

The most common cause of this error is a client disconnecting before a timeout expires in the storage service. Investigate the code in your client to understand why and when the client disconnects from the storage service. You can also use third-party network analysis tools to investigate network connectivity issues from the client. 

## See also

- [Troubleshoot client application errors](../common/troubleshoot-storage-client-application-errors.md?toc=/azure/storage/blobs/toc.json)
- [Troubleshoot performance issues](../common/troubleshoot-storage-performance.md?toc=/azure/storage/blobs/toc.json)
- [Monitor, diagnose, and troubleshoot your Azure Storage](/training/modules/monitor-diagnose-and-troubleshoot-azure-storage/)
