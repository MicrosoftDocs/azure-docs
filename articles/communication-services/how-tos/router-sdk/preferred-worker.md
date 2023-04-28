---
title: Target a Preferred Worker
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services SDKs to target a job to a specific worker
author: danielgerlag
ms.author: danielgerlag
ms.service: azure-communication-services
ms.topic: how-to 
ms.date: 01/31/2022
ms.custom: template-how-to
zone_pivot_groups: acs-js-csharp

#Customer intent: As a developer, I want to target a specific worker
---

# Target a Preferred Worker

In the context of a call center, customers might be assigned an account manager or have a relationship with a specific worker. As such, You'd want to route a specific job to a specific worker if possible.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- Optional: Complete the quickstart to [get started with Job Router](../../quickstarts/router/get-started-router.md)

## Setup worker selectors

Every worker automatically has an `Id` label. You can apply worker selectors to the job, to target a specific worker.

In the following example, a job is created that targets a specific worker. If that worker does not accept the job within the TTL of 1 minute, the condition for the specific worker is no longer be valid and the job could go to any worker.

::: zone pivot="programming-language-csharp"

```csharp
await routerClient.CreateJobAsync(
    options: new CreateJobOptions(
            jobId: "<job id>",
            channelId: "<channel id>",
            queueId: "<queue id>")
    {
        RequestedWorkerSelectors = new List<WorkerSelector>()
          {
            new WorkerSelector("Id", LabelOperator.Equal, "<preferred worker id>", TimeSpan.FromMinutes(1))
          }
    });
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript
await client.createJob({
    channelId: "<channel id>",
    queueId: "<queue id>",
    workerSelectors: [
        {
            key: "Id",
            operator: "equal",
            value: "<preferred worker id>",
            ttl: "00:01:00"
        }
    ]
});
```

::: zone-end

> [!TIP]
> You could also use any custom label that is unique to each worker.
