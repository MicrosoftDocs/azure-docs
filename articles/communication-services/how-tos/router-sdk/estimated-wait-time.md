---
title: Estimated wait time and position of a Job in queue
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services SDKs to get estimated wait time and position for a job in a queue
author: williamzhao
ms.author: williamzhao
ms.service: azure-communication-services
ms.topic: how-to 
ms.date: 06/08/2023
ms.custom: template-how-to, devx-track-extended-java, devx-track-js, devx-track-python
zone_pivot_groups: acs-js-csharp-java-python
#Customer intent: As a developer, I want to target a specific worker
---

# How to get estimated wait time and job position

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]

In the context of a call center, customers might want to know how long they need to wait before they're connected to an agent. As such, Job Router can calculate the estimated wait time or position of a job in a queue.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- Optional: Complete the quickstart to [get started with Job Router](../../quickstarts/router/get-started-router.md)
- Optional: Complete the how-to [accept job offers](../../how-tos/router-sdk/accept-decline-offer.md)

## Get estimated wait time and length of a queue

Estimated wait time for a queue with is retrieved by calling `GetQueueStatisticsAsync` and checking the `EstimatedWaitTimeMinutes` property. The estimated wait time is grouped by job priority. Job Router also returns the length of the queue and the longest waiting job in the queue.

::: zone pivot="programming-language-csharp"

```csharp
var queueStatistics = await client.GetQueueStatisticsAsync(queueId: "queue1");
Console.WriteLine($"Queue statistics: {JsonSerializer.Serialize(queueStatistics.Value)}");
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript
var queueStatistics = await client.getQueueStatistics("queue1");
console.log(`Queue statistics: ${JSON.stringify(queueStatistics)}`);
```

::: zone-end

::: zone pivot="programming-language-python"

```python
queue_statistics = client.get_queue_statistics(queue_id = "queue1")
print("Queue statistics: " + queue_statistics)
```

::: zone-end

::: zone pivot="programming-language-java"

```java
var queueStatistics = client.getQueueStatistics("queue1");
System.out.println("Queue statistics: " + new GsonBuilder().toJson(queueStatistics));
```

::: zone-end

Executing the above code should print a message similar to the following snippet (Note: the `EstimatedWaitTimeMinutes` property is grouped by job priority):

```json
Queue statistics: { "QueueId":"queue1", "Length": 15, "EstimatedWaitTimeMinutes": { "1": 10 }, "LongestJobWaitTimeMinutes": 4.724 }
```

## Get estimated wait time and position of a job in a queue

Estimated wait time for a job with ID `job1` is retrieved by calling `GetQueuePositionAsync` and checking the `EstimatedWaitTimeMinutes` property.  Job Router also returns the position of the job in the queue.

::: zone pivot="programming-language-csharp"

```csharp
var queuePositionDetails = await client.GetQueuePositionAsync(jobId: "job1");
Console.WriteLine($"Queue position details: {JsonSerializer.Serialize(queuePositionDetails.Value)}");
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript
var queuePositionDetails = await client.getQueuePosition("job1");
console.log(`Queue position details: ${JSON.stringify(queuePositionDetails)}`);
```

::: zone-end

::: zone pivot="programming-language-python"

```python
queue_position_details = client.get_queue_position(job_id = "job1")
print("Queue position details: " + queue_position_details)
```

::: zone-end

::: zone pivot="programming-language-java"

```java
var queuePositionDetails = client.getQueuePosition("job1");
System.out.println("Queue position details: " + new GsonBuilder().toJson(queuePositionDetails));
```

::: zone-end

Executing the above code should print a message similar to the following snippet:

```json
Queue position details: { "JobId": "job1", "Position": 4, "QueueId": "queue1", "QueueLength":15, "EstimatedWaitTimeMinutes": 5 }
```
