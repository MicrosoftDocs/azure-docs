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

Learn to use a classification policy in Job Router to dynamically resolve the queue and priority while also attaching worker selectors to a Job.

[!INCLUDE [Private Preview Disclaimer](../../includes/private-preview-include-section.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- Optional: Complete the quickstart to [get started with Job Router](../../quickstarts/router/get-started-router.md)

### Create a classification policy

The following example will leverage [PowerFx Expressions](https://powerapps.microsoft.com/en-us/blog/what-is-microsoft-power-fx/) to select both the queue and priority. The expression will attempt to match the Job label called `Region` equal to `NA` resulting in the Job being put in the `XBOX_NA_QUEUE` if found, otherwise the `XBOX_DEFAULT_QUEUE`.  If the `XBOX_DEFAULT_QUEUE` was also not found, then the job will automatically be sent to the fallback queue `DEFAULT_QUEUE` as defined by `fallbackQueueId`.  Additionally, the priority will be `10` if a label called `Hardware_VIP` was matched, otherwise it will be `1`.

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
    fallbackQueueId: "DEFAULT_QUEUE"
);
```

### Submit the job

The following example will cause the classification policy to evaluate the Job labels. The outcome will place the Job in the queue called `XBOX_NA_QUEUE` and set the priority to `1`.

```csharp
var job = await client.CreateJobAsync(
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

### Attaching Worker Selectors

You can use the classification policy to attach additional worker selectors to a job.

#### Static Attachments

In this example, we are using a static attachment, which will always attach the specified label selector to a job.

```csharp
await client.SetClassificationPolicyAsync(
    id: "policy-1",
    workerSelectors: new List<LabelSelectorAttachment>
    {
        new StaticLabelSelector(
            new LabelSelector("Foo", LabelOperator.Equal, "Bar")
        )
    }
);
```

#### Conditional Attachments

In this example, we are using a conditional attachment, which will evaluate a condition against the job labels to determine if the said label selectors should be attached to the job.

```csharp
await client.SetClassificationPolicyAsync(
    id: "policy-1",
    workerSelectors: new List<LabelSelectorAttachment>
    {
        new ConditionalLabelSelector(
            condition: new ExpressionRule("job.Urgent = true"),
            labelSelectors: new List<LabelSelector>
            {
                new LabelSelector("Foo", LabelOperator.Equal, "Bar")
            })
    }
);
```

#### Weighted Allocation Attachments

In this example, we are using a weighted allocation attachment, which will divide up jobs according to the weightings specified and attach different selectors accordingly.  Here, we are saying that 30% of jobs should go to workers with the label `Vendor` set to `A` and 70% should go to workers with the label `Vendor` set to `B`.

```csharp
await client.SetClassificationPolicyAsync(
    id: "policy-1",
    workerSelectors: new List<LabelSelectorAttachment>
    {
        new WeightedAllocationLabelSelector(new WeightedAllocation[]
        {
            new WeightedAllocation(
                weight: 0.3,
                labelSelectors: new List<LabelSelector>
                {
                    new LabelSelector("Vendor", LabelOperator.Equal, "A")
                }),
            new WeightedAllocation(
                weight: 0.7,
                labelSelectors: new List<LabelSelector>
                {
                    new LabelSelector("Vendor", LabelOperator.Equal, "B")
                })
        })
    }
);
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
