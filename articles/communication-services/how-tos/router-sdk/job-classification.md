---
title: Classify a Job
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services SDKs to change the properties of a job
author: jasonshave
ms.author: jassha
ms.service: azure-communication-services
ms.topic: how-to 
ms.date: 10/14/2021
ms.custom: template-how-to

#Customer intent: As a developer, I want Job Router to classify my Job for me.
---

# Classifying a job

Learn to use a classification policy in Job Router to dynamically define the queue and priority while also adjusting the worker selectors of a Job.

[!INCLUDE [Private Preview Disclaimer](../../includes/private-preview-include-section.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- Optional: Complete the quickstart to [get started with Job Router](../../quickstarts/router/get-started-router.md)

## Static classification

When creating a Job with the SDK, specify the queue, priority, and worker selectors only; this method is known as **static classification**. The following example would place a Job in the `XBOX_DEFAULT_QUEUE` with a priority of `1` and require workers to have a skill of `XBOX_Hardware` greater than or equal to `5`.

> [!NOTE]
> A Job can be [reclassified after submission](#reclassify-a-job-after-submission) even if it was initially created without a classification policy. In this case, Job Router will evaluate the policy's behavior against the **labels** and make the necessary adjustments to the queue, priority, and worker selectors.

```csharp
var job = await client.CreateJobAsync(
    channelId: ManagedChannels.AcsVoiceChannel,
    channelReference: "12345",
    queueId: queue.Value.Id,
    priority: 1,
    workerSelectors: new List<LabelSelector>
    {
        new (
            key: "Location",
            @operator: LabelOperator.Equal,
            value: "Edmonton")
    });

// returns a new GUID such as: 4ad7f4b9-a0ff-458d-b3ec-9f84be26012b
```

## Dynamic classification

As described above, an easy way of submitting a Job is to specify the Priority, Queue, and Worker Selectors during submission. When doing so, the sender needs to have knowledge about these characteristics. To avoid the sender having explicit knowledge about the inner workings of the Job Router's behavior, the sender can specify a **classification policy** along with a generic **labels** collection to invoke the dynamic behavior.

### Create a classification policy

The following classification policy will use the low-code [PowerFx](https://powerapps.microsoft.com/en-us/blog/what-is-microsoft-power-fx/) language to select both the queue and priority. The expression will attempt to match the Job label called `Region` equal to `NA` resulting in the Job being put in the `XBOX_NA_QUEUE` if found, otherwise the `XBOX_DEFAULT_QUEUE`.  If the `XBOX_DEFAULT_QUEUE` was also not found, then the job will automatically be sent to the fallback queue `DEFAULT_QUEUE` as defined by `fallbackQueueId`.  Additionally, the priority will be `10` if a label called `Hardware_VIP` was matched, otherwise it will be `1`.

```csharp
var policy = await client.SetClassificationPolicyAsync(
    id: "XBOX_NA_QUEUE_Priority_1_10",
    name: "Select XBOX Queue and set priority to 1 or 10",
    queueSelector: new QueueIdSelector(
        new ExpressionRule("If(job.Region = \"NA\", \"XBOX_NA_QUEUE\", \"XBOX_DEFAULT_QUEUE\")")
    ),
    workerSelectors: new List<LabelSelectorAttachment>
    {
        new StaticLabelSelector(
            new LabelSelector(
                key: "Language",
                @operator: LabelOperator.Equal,
                value: "English")
        )
    },
    prioritizationRule: new ExpressionRule("If(job.Hardware_VIP = true, 10, 1)"),
    defaultQueueId: "DEFAULT_QUEUE"
);
```

### Submit the job

The following example will cause the classification policy to evaluate the Job labels. The outcome will place the Job in the queue called `XBOX_NA_QUEUE` and set the priority to `1`.

```csharp
var dynamicJob = await client.CreateJobAsync(
    channelId: ManagedChannels.AcsVoiceChannel,
    channelReference: "my_custom_reference_number",
    classificationPolicyId: "XBOX_NA_QUEUE_Priority_1_10",
    labels: new LabelCollection()
    {
        { "Region", "NA" },
        { "Caller_Id", "tel:7805551212" },
        { "Caller_NPA_NXX", "780555" },
        { "XBOX_Hardware", 7 }
    }
);

// returns a new GUID such as: 4ad7f4b9-a0ff-458d-b3ec-9f84be26012b
```

## Reclassify a job after submission

Once the Job Router has received, and classified a Job using a policy, you have the option of reclassifying it using the SDK. The following example illustrates one way to increase the priority of the Job to `10`, simply by specifying the **Job ID**, calling the `ReclassifyJobAsync` method, and including the `Hardware_VIP` label.

```csharp
var reclassifiedJob = await client.ReclassifyJobAsync(
    jobId: "4ad7f4b9-a0ff-458d-b3ec-9f84be26012b",
    classificationPolicyId: null,
    labelsToUpdate: new LabelCollection()
    {
        { "Hardware_VIP", true }
    }
);
```
