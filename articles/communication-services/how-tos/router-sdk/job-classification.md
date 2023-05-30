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
zone_pivot_groups: acs-js-csharp

#Customer intent: As a developer, I want Job Router to classify my Job for me.
---

# Classifying a job

Learn to use a classification policy in Job Router to dynamically resolve the queue and priority while also attaching worker selectors to a Job.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- Optional: Complete the quickstart to [get started with Job Router](../../quickstarts/router/get-started-router.md)

## Create a classification policy

The following example will leverage [PowerFx Expressions](https://powerapps.microsoft.com/en-us/blog/what-is-microsoft-power-fx/) to select both the queue and priority. The expression will attempt to match the Job label called `Region` equal to `NA` resulting in the Job being put in the `XBOX_NA_QUEUE` if found, otherwise the `XBOX_DEFAULT_QUEUE`.  If the `XBOX_DEFAULT_QUEUE` was also not found, then the job will automatically be sent to the fallback queue `DEFAULT_QUEUE` as defined by `fallbackQueueId`.  Additionally, the priority will be `10` if a label called `Hardware_VIP` was matched, otherwise it will be `1`.

::: zone pivot="programming-language-csharp"

```csharp
await routerAdministrationClient.CreateClassificationPolicyAsync(
    options: new CreateClassificationPolicyOptions("XBOX_NA_QUEUE_Priority_1_10")
    {
        Name = "Select XBOX Queue and set priority to 1 or 10",
        PrioritizationRule = new ExpressionRule("If(job.Hardware_VIP = true, 10, 1)"),
        QueueSelectors = new List<QueueSelectorAttachment>()
        {
            new ConditionalQueueSelectorAttachment(
                condition: new ExpressionRule("If(job.Region = \"NA\", true, false)"),
                labelSelectors: new List<QueueSelector>()
                {
                    new QueueSelector("Id", LabelOperator.Equal, new LabelValue("XBOX_NA_QUEUE"))
                }),
            new ConditionalQueueSelectorAttachment(
                condition: new ExpressionRule("If(job.Region != \"NA\", true, false)"),
                labelSelectors: new List<QueueSelector>()
                {
                    new QueueSelector("Id", LabelOperator.Equal, new LabelValue("XBOX_DEFAULT_QUEUE"))
                })
        }
    });
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript
await client.upsertClassificationPolicy({
        id: "XBOX_NA_QUEUE_Priority_1_10",
        fallbackQueueId: "DEFAULT_QUEUE",
        queueSelector: {            
            kind: "queue-id",
            rule: {
                kind: "expression-rule",
                expression: "If(job.Region = \"NA\", \"XBOX_NA_QUEUE\", \"XBOX_DEFAULT_QUEUE\")"
            }
        },
        prioritizationRule: {
            kind: "expression-rule",
            expression: "If(job.Hardware_VIP = true, 10, 1)"
        }
```

::: zone-end

## Submit the job

The following example will cause the classification policy to evaluate the Job labels. The outcome will place the Job in the queue called `XBOX_NA_QUEUE` and set the priority to `1`.

::: zone pivot="programming-language-csharp"

```csharp
var job = await routerClient.CreateJobAsync(
    options: new CreateJobWithClassificationPolicyOptions(
        jobId: "<job id>",
        channelId: "voice",
        classificationPolicyId: "XBOX_NA_QUEUE_Priority_1_10")
    {
        Labels = new Dictionary<string, LabelValue>()
        {
            {"Region", new LabelValue("NA")},
            {"Caller_Id", new LabelValue("tel:7805551212")},
            {"Caller_NPA_NXX", new LabelValue("780555")},
            {"XBOX_Hardware", new LabelValue(7)}
        }
    });
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript
await client.createJob({
    channelId: "voice",
    classificationPolicyId: : "XBOX_NA_QUEUE_Priority_1_10",
    labels: {
        Region: "NA",
        Caller_Id: "tel:7805551212",
        Caller_NPA_NXX: "780555",
        XBOX_Hardware: 7
    },
});
```

::: zone-end

## Attaching Worker Selectors

You can use the classification policy to attach additional worker selectors to a job.

### Static Attachments

In this example, the Classification Policy is configured with a static attachment, which will always attach the specified label selector to a job.

::: zone pivot="programming-language-csharp"

```csharp
await routerAdministrationClient.CreateClassificationPolicyAsync(
    options: new CreateClassificationPolicyOptions("policy-1")
    {
        WorkerSelectors = new List<WorkerSelectorAttachment>()
        {
            new StaticWorkerSelectorAttachment(new WorkerSelector("Foo", LabelOperator.Equal, new LabelValue("Bar")))
        }
    });
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript
await client.upsertClassificationPolicy(
    id: "policy-1",
    workerSelectors: [
        { 
            kind: "static",                
            labelSelector: { key: "foo", operator: "equal", value: "bar" }
        }
    ]
);
```

::: zone-end

### Conditional Attachments

In this example, the Classification Policy is configured with a conditional attachment. So it will evaluate a condition against the job labels to determine if the said label selectors should be attached to the job.

::: zone pivot="programming-language-csharp"

```csharp
await routerAdministrationClient.CreateClassificationPolicyAsync(
    options: new CreateClassificationPolicyOptions("policy-1")
    {
        WorkerSelectors = new List<WorkerSelectorAttachment>()
        {
            new ConditionalWorkerSelectorAttachment(
                condition: new ExpressionRule("job.Urgent = true")),
                labelSelectors: new List<WorkerSelector>()
                {
                    new WorkerSelector("Foo", LabelOperator.Equal, "Bar")
                })
        }
    });
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript
await client.upsertClassificationPolicy(
    id: "policy-1",
    workerSelectors: [
        {
            kind: "conditional",
            condition: { 
                kind: "expression-rule", 
                expression: "job.Urgent = true" 
            },
            labelSelectors: [
                { key: "Foo", operator: "equal", value: "Bar" }
            ]
        }
    ]
);
```

::: zone-end

### Passthrough Attachments

In this example, the Classification Policy is configured to attach a worker selector (`"Foo" = "<value comes from "Foo" label of the job>"`) to the job.

::: zone pivot="programming-language-csharp"

```csharp
await routerAdministrationClient.CreateClassificationPolicyAsync(
    options: new CreateClassificationPolicyOptions("policy-1")
    {
        WorkerSelectors = new List<WorkerSelectorAttachment>()
        {
            new PassThroughQueueSelectorAttachment("Foo", LabelOperator.Equal)
        }
    });
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript
await client.upsertClassificationPolicy(
    id: "policy-1",
    workerSelectors: [
        {
            kind: "pass-through",
            key: "Foo",
            operator: "equal"
        }
    ]
);
```

::: zone-end

### Weighted Allocation Attachments

In this example, the Classification Policy is configured with a weighted allocation attachment. This will divide up jobs according to the weightings specified and attach different selectors accordingly.  Here, 30% of jobs should go to workers with the label `Vendor` set to `A` and 70% should go to workers with the label `Vendor` set to `B`.

::: zone pivot="programming-language-csharp"

```csharp
await routerAdministrationClient.CreateClassificationPolicyAsync(
    options: new CreateClassificationPolicyOptions("policy-1")
    {
        WorkerSelectors = new List<WorkerSelectorAttachment>()
        {
            new WeightedAllocationWorkerSelectorAttachment(
                new List<WorkerWeightedAllocation>()
                {
                    new WorkerWeightedAllocation(0.3, 
                        new List<WorkerSelector>()
                        {
                            new WorkerSelector("Vendor", LabelOperator.Equal, "A")
                        }),
                    new WorkerWeightedAllocation(0.7, 
                        new List<WorkerSelector>()
                        {
                            new WorkerSelector("Vendor", LabelOperator.Equal, "B")
                        })
                })
        }
    });
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript

await client.upsertClassificationPolicy(
    id: "policy-1",
    workerSelectors: [
        {
            kind: "weighted-allocation",
            allocations: [
                { 
                    weight: 0.3,
                    labelSelectors: [{ key: "Vendor", operator: "equal", value: "A" }]
                },
                { 
                    weight: 0.7,
                    labelSelectors: [{ key: "Vendor", operator: "equal", value: "B" }]
                }
            ]
        }
    ]
);
```

::: zone-end

## Reclassify a job after submission

Once the Job Router has received, and classified a Job using a policy, you have the option of reclassifying it using the SDK. The following example illustrates one way to increase the priority of the Job, simply by specifying the **Job ID**, calling the `ReclassifyJobAsync` method.

::: zone pivot="programming-language-csharp"

```csharp
var reclassifiedJob = await routerClient.ReclassifyJobAsync("<job id>");
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript
await client.reclassifyJob("<jobId>");
```

::: zone-end
