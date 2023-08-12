---
title: Target a Preferred Worker
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services SDKs to target a job to a specific worker
author: danielgerlag
ms.author: danielgerlag
ms.service: azure-communication-services
ms.topic: how-to 
ms.date: 01/31/2022
ms.custom: template-how-to, devx-track-extended-java, devx-track-js, devx-track-python
zone_pivot_groups: acs-js-csharp-java-python
#Customer intent: As a developer, I want to target a specific worker
---

# Target a Preferred Worker

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]

In the context of a call center, customers might be assigned an account manager or have a relationship with a specific worker. As such, You'd want to route a specific job to a specific worker if possible.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- Optional: Complete the quickstart to [get started with Job Router](../../quickstarts/router/get-started-router.md)

## Setup worker selectors

Every worker automatically has an `Id` label. You can apply worker selectors to the job, to target a specific worker.

In the following example, a job is created that targets a specific worker. If that worker does not accept the job within the offer expiry duration of 1 minute, the condition for the specific worker is no longer be valid and the job could go to any worker.

::: zone pivot="programming-language-csharp"

```csharp
await client.CreateJobAsync(
    new CreateJobOptions(jobId: "job1", channelId: "Xbox_Chat_Channel", queueId: queue.Value.Id)
    {
        RequestedWorkerSelectors =
        {
            new RouterWorkerSelector(key: "Id", labelOperator: LabelOperator.Equal, value: new LabelValue("<preferred_worker_id>")) {
                Expedite = true,
                ExpireAfterSeconds = 45
            }
        }
    });
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript
await client.createJob("job1", {
    channelId: "Xbox_Chat_Channel",
    queueId: queue.id,
    requestedWorkerSelectors: [
        {
            key: "Id",
            labelOperator: "equal",
            value: "<preferred worker id>",
            expireAfterSeconds: 45
        }
    ]
});
```

::: zone-end

::: zone pivot="programming-language-python"

```python
client.create_job(job_id = "job1", router_job = RouterJob(
    channel_id = "Xbox_Chat_Channel",
    queue_id = queue1.id,
    requested_worker_selectors = [
        RouterWorkerSelector(
            key = "Id",
            label_operator = LabelOperator.EQUAL,
            value = "<preferred worker id>",
            expire_after_seconds = 45
        )
    ]
))
```

::: zone-end

::: zone pivot="programming-language-java"

```java
client.createJob(new CreateJobOptions("job1", "Xbox_Chat_Channel", queue.getId())
    .setRequestedWorkerSelectors(List.of(
        new RouterWorkerSelector("Id", LabelOperator.EQUAL, new LabelValue("<preferred_worker_id>"))
          .setExpireAfterSeconds(45.0)
          .setExpedite(true))));
  ```

::: zone-end

> [!TIP]
> You could also use any custom label that is unique to each worker.
