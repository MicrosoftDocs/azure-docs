---
title: "Mitigate hot partitions in Azure Blob Storage"
titleSuffix: Azure Storage
description: Learn how to detect and mitigate hot partitions in Azure Blob Storage using Azure Monitor metrics and resource logs. Apply best practices to reduce throttling.
services: storage
author: normesta

ms.service: azure-blob-storage
ms.topic: concept-article
ms.date: 07/20/2026
ms.author: normesta
---

# Hot partitions in Azure Blob Storage: detection, monitoring, and mitigation

Azure Blob Storage distributes data across partitions to deliver scalable performance. When traffic concentrates on a single partition, that partition can become a bottleneck, a condition known as a *hot partition*. This article explains what hot partitions are, how to recognize them through Azure Monitor metrics and resource logs, and what steps you can take to distribute load more evenly and reduce throttling errors.

## Understand hot partitions

Azure Blob Storage automatically distributes data across partitions to scale performance and throughput. When a single partition receives significantly more traffic than other partitions, it becomes a *hot partition*. A hot partition occurs when a large number of read, write, or update requests go to the same partition, limiting the service's ability to balance the workload effectively. As a result, requests experience increased latency, throttling, and timeout errors until the workload is redistributed or the access pattern is optimized. Partitioning or naming schemes that concentrate traffic on a small subset of data instead of spreading requests across multiple partitions often cause hot partitions. 

## Symptoms and impact of hot partitions

When a storage partition becomes hot, it can no longer process requests as efficiently. As the partition approaches its scalability limits, Azure Storage begins throttling requests to protect the service and maintain reliability for other workloads. Client applications experience increased latency, reduced throughput, and transient request failures. 

Common symptoms of a hot partition include:

- **HTTP 503 (Server Busy)** responses that indicate the partition is temporarily unable to handle more requests. 
- **HTTP 500 (Operation Timeout)** responses when requests take too long to complete because the partition is under heavy load. 
- **Increased request latency**, even for requests that ultimately succeed. 
- **Automatic client retries**, which can further increase traffic and prolong performance problems if many clients retry simultaneously. 
- **Reduced throughput**, where the application processes fewer operations per second than expected despite sufficient overall storage account capacity. 

Hot partitions are often caused by access patterns that concentrate traffic on a single partition. Common examples include sequential blob names, append-only workloads, and partition key designs that send a disproportionate amount of traffic to a single partition. When the workload isn't evenly distributed, the affected partition reaches its limits before the rest of the storage account, creating a bottleneck that impacts application performance. 

For many applications, the first indication of a hot partition is a combination of rising latency, increasing retry rates, and growing numbers of 503 or 500 errors during periods of high demand. 

## Detect throttling errors by using Azure Monitor metrics and resource logs

Azure Storage throttles requests when a workload exceeds the scalability targets of a storage account or partition. You commonly observe throttling as HTTP **503 (Server Busy)** or **500 (Operation Timeout)** responses. Azure Storage client libraries often retry throttled requests automatically, so monitoring is essential for detecting throttling before it significantly affects application performance. 

### Use Azure Monitor metrics to identify throttling errors

To detect throttling, analyze Azure Monitor metrics for a storage account. The **Transactions** metric, combined with the **ResponseType** dimension, provides visibility into the outcome of storage requests and helps you identify throttling-related failures. 

### Metrics for identifying throttling

The following Azure Monitor metrics are useful when investigating throttling:

| Metric | Purpose |
|----------|---------|
| **Transactions** | Measures the number of requests processed by the storage service. Use the **ResponseType** dimension to identify throttled requests. |
| **Availability** | Shows the percentage of successful requests. A decrease in availability can indicate throttling or other request failures. |
| **Success E2E Latency** | Measures end-to-end request latency, including network and client-side processing. Increases might indicate retries caused by throttling. |
| **Success Server Latency** | Measures the time required for the storage service to process requests. Comparing this metric with E2E latency can help distinguish service-side delays from client retries. |

A common throttling pattern is an increase in latency accompanied by an increase in throttling-related response types and a decrease in availability. 

### Use the ResponseType dimension to identify throttling

The **ResponseType** dimension is the primary tool for identifying throttling conditions in Azure Monitor metrics. Relevant values include: 

| ResponseType value | Description |
|-------------------|-------------|
| **ServerBusyError** | The storage service returned HTTP 503 because a scalability target was exceeded. |
| **ClientThrottlingError** | The request was throttled before reaching the storage service. |
| **ClientAccountRequestThrottlingError** | Account-level request-rate limits were exceeded. |
| **ClientAccountBandwidthThrottlingError** | Account bandwidth limits were exceeded. |
| **SuccessWithThrottling** | The request was initially throttled but ultimately succeeded after retries. |

Tracking these values over time can help you identify transient throttling spikes as well as sustained scalability issues. 

### Use dimensions to pinpoint the source of throttling

Azure Monitor metric dimensions can help isolate the workload responsible for throttling:

| Dimension | Purpose |
|-----------|---------|
| **ResponseType** | Identifies the specific throttling or error condition. |
| **ApiName** | Identifies the operation experiencing throttling, such as `PutBlob`, `GetBlob`, or `ListBlobs`. |
| **GeoType** | Distinguishes traffic to primary and secondary endpoints in geo-redundant storage accounts. |
| **Authentication** | Helps determine whether throttling is associated with a particular authentication method. |

For example, if throttling occurs primarily on `PutBlob` operations, the workload might be write-intensive. If a specific API operation shows elevated throttling rates, optimization efforts can focus on that operation rather than the entire application. 

### Analyze Azure Monitor resource logs

While metrics identify the presence of throttling, Azure Monitor resource logs provide request-level details that can help diagnose the root cause. Resource logs capture both successful and failed requests, including throttling, timeout, authorization, and network-related errors. 

For Azure Blob Storage, records are available in the **StorageBlobLogs** table after resource logs are sent to a Log Analytics workspace. 

### Query resource logs for throttling events

Before running these queries, ensure that resource logs are sent to a Log Analytics workspace.

Use Kusto Query Language (KQL) to identify requests that return common throttling-related status codes:

```kusto
StorageBlobLogs
| where StatusCode in (500, 503)
| summarize RequestCount = count() by OperationName, StatusCode, bin(TimeGenerated, 15m)
| order by TimeGenerated desc
```

Extend this query by grouping results by operation, authentication type, caller IP address, or application identity to identify the workload generating throttled requests. Resource logs are particularly useful for determining whether throttling is concentrated within a specific application, operation, or time period. 

### Alert conditions for throttling

Create Azure Monitor alerts for:

- Sustained occurrences of **ServerBusyError** transactions.
- Increases in throttling-related **ResponseType** values.
- Drops in the **Availability** metric below an acceptable threshold.
- Increases in latency that correlate with throttling events.
- Sudden increases in request volume that approach storage scalability limits.

### Recommended monitoring workflow

1. Monitor the **Transactions** metric and split results by **ResponseType**.
1. Look for increases in throttling-related response types such as **ServerBusyError** and **ClientThrottlingError**.
1. Use the **ApiName** dimension to identify affected operations.
1. Correlate throttling events with changes in **Availability**, **Success E2E Latency**, and **Success Server Latency**.
1. Use Azure Monitor resource logs to determine which requests, operations, or applications are generating throttled traffic.
1. Configure alerts so that throttling issues are detected before they affect users.

By combining Azure Monitor metrics, dimensions, and resource logs, you can quickly detect throttling conditions, identify the source of excessive demand, and take corrective action before application performance degrades. 

## Mitigate hot partitions

To prevent hot partitions, distribute requests evenly across partitions and ensure that applications respond appropriately when throttling occurs.

### Use efficient partitioning and naming schemes

Design partition keys, blob names, and other identifiers so that requests are distributed across multiple partitions. Avoid sequential or append-only naming patterns that direct most requests to the same partition. See [Optimize blob partitions and naming schemes](storage-performance-blob-partitions.md).

### Use exponential backoff for retries

If requests are throttled and return **503 (Server Busy)** or **500 (Operation Timeout)** errors, retry requests by using an exponential backoff strategy. This approach reduces pressure on the affected partition and gives Azure Storage time to rebalance load or recover from temporary spikes in demand. 

Exponential backoff retry behavior is most relevant for custom applications that access Azure Storage by using Azure Storage client libraries, SDKs, or REST APIs. Many Microsoft services, managed applications, and third-party clients already implement appropriate retry logic, so you might not need to configure anything extra. If you're developing a custom application, ensure that retry policies are enabled and configured according to Azure Storage best practices. See any of these articles:

- [Implement a retry policy for .NET](storage-retry-policy.md)
- [Implement a retry policy for Java](storage-retry-policy-java.md)
- [Implement a retry policy for JavaScript](storage-retry-policy-javascript.md)
- [Implement a retry policy for Python](storage-retry-policy-python.md)
- [Implement a retry policy for Go](storage-retry-policy-go.md)

### Avoid sudden surges in request volume

When introducing a new workload, running performance tests, or processing large amounts of data, increase request rates gradually instead of immediately generating peak traffic. Azure Storage automatically load-balances partitions as demand changes, but abrupt traffic spikes can temporarily overwhelm a partition and result in throttling until the service has an opportunity to adjust. 

## Next steps

For detailed implementation guidance, see:

- [Scalability and performance targets for Azure Storage](scalability-targets.md)
- [Optimize blob partitions and naming schemes](storage-performance-blob-partitions.md)
- [Monitor Azure Blob Storage](monitor-blob-storage.md)
- [Best practices for monitoring Azure Blob Storage](blob-storage-monitoring-scenarios.md)
- [Azure Monitor metrics and resource log reference documentation for Azure Storage](monitor-blob-storage-reference.md)
- [Performance checklist for Azure Blob Storage](storage-performance-checklist.md)
- [Performance checklist for developers (Azure Blob Storage)](storage-performance-checklist-developers.md)

