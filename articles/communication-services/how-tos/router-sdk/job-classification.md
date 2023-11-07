---
title: Classify a Job
titleSuffix: An Azure Communication Services how-to guide
description: Use Azure Communication Services SDKs to change the properties of a job
author: jasonshave
ms.author: jassha
ms.service: azure-communication-services
ms.topic: how-to 
ms.date: 10/14/2021
ms.custom: template-how-to, devx-track-extended-java, devx-track-js, devx-track-python
zone_pivot_groups: acs-js-csharp-java-python
#Customer intent: As a developer, I want Job Router to classify my Job for me.
---

# Classifying a job

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]

Learn to use a classification policy in Job Router to dynamically resolve the queue and priority while also attaching worker selectors to a Job.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A deployed Communication Services resource. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- Optional: Complete the quickstart to [get started with Job Router](../../quickstarts/router/get-started-router.md)

## Create a classification policy

The following example leverages [PowerFx Expressions](https://powerapps.microsoft.com/blog/what-is-microsoft-power-fx/) to select both the queue and priority. The expression attempts to match the Job label called `Region` equal to `NA` resulting in the Job being put in the `XBOX_NA_QUEUE`.  Otherwise, the job is sent to the fallback queue `XBOX_DEFAULT_QUEUE` as defined by `fallbackQueueId`.  Additionally, the priority is `10` if a label called `Hardware_VIP` was matched, otherwise it is `1`.

::: zone pivot="programming-language-csharp"

```csharp
var classificationPolicy = await administrationClient.CreateClassificationPolicyAsync(
    new CreateClassificationPolicyOptions(classificationPolicyId: "XBOX_NA_QUEUE_Priority_1_10")
    {
        Name = "Select XBOX Queue and set priority to 1 or 10",
        QueueSelectors =
        {
            new ConditionalQueueSelectorAttachment(condition: new ExpressionRouterRule("job.Region = \"NA\""),
                queueSelectors: new List<RouterQueueSelector>
                {
                    new(key: "Id", labelOperator: LabelOperator.Equal, value: new LabelValue("XBOX_NA_QUEUE"))
                })
        },
        FallbackQueueId = "XBOX_DEFAULT_QUEUE",
        PrioritizationRule = new ExpressionRouterRule("If(job.Hardware_VIP = true, 10, 1)"),
    });
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript
var classificationPolicy = await administrationClient.createClassificationPolicy("XBOX_NA_QUEUE_Priority_1_10", {
    name: "Select XBOX Queue and set priority to 1 or 10",
    queueSelectors: [{            
        kind: "conditional",
        condition: {
            kind: "expression-rule",
            expression: 'job.Region = "NA"'
        },
        queueSelectors: [{
            key: "Id",
            labelOperator: "equal",
            value: "XBOX_NA_QUEUE"
        }]
    }],
    fallbackQueueId: "XBOX_DEFAULT_QUEUE",
    prioritizationRule: {
        kind: "expression-rule",
        expression: "If(job.Hardware_VIP = true, 10, 1)"
    }});
```

::: zone-end

::: zone pivot="programming-language-python"

```python
classification_policy: ClassificationPolicy = administration_client.create_classification_policy(
    classification_policy_id = "XBOX_NA_QUEUE_Priority_1_10",
    classification_policy = ClassificationPolicy(
        name = "Select XBOX Queue and set priority to 1 or 10",
        queue_selectors = [
            ConditionalQueueSelectorAttachment(
                condition = ExpressionRouterRule(expression = 'job.Region = "NA"'),
                queue_selectors = [
                    RouterQueueSelector(key = "Id", label_operator = LabelOperator.EQUAL, value = "XBOX_NA_QUEUE")
                ]
            )
        ],
        fallback_queue_id = "XBOX_DEFAULT_QUEUE",
        prioritization_rule = ExpressionRouterRule(expression = "If(job.Hardware_VIP = true, 10, 1)")))
```

::: zone-end

::: zone pivot="programming-language-java"

```java
ClassificationPolicy classificationPolicy = administrationClient.createClassificationPolicy(
    new CreateClassificationPolicyOptions("XBOX_NA_QUEUE_Priority_1_10")
        .setName("Select XBOX Queue and set priority to 1 or 10")
        .setQueueSelectors(List.of(new ConditionalQueueSelectorAttachment(
            new ExpressionRouterRule("job.Region = \"NA\""),
            List.of(new RouterQueueSelector("Id", LabelOperator.EQUAL, new LabelValue("XBOX_NA_QUEUE"))))))
        .setFallbackQueueId("XBOX_DEFAULT_QUEUE")
        .setPrioritizationRule(new ExpressionRouterRule().setExpression("If(job.Hardware_VIP = true, 10, 1)")));
```

::: zone-end

## Submit the job

The following example causes the classification policy to evaluate the Job labels.  The outcome places the Job in the queue called `XBOX_NA_QUEUE` and sets the priority to `1`.  Before the classification policy is evaluated, the job's state is `pendingClassification`.  Once the classification policy is evaluated, the job's state is updated to `queued`.

::: zone pivot="programming-language-csharp"

```csharp
await client.CreateJobWithClassificationPolicyAsync(new CreateJobWithClassificationPolicyOptions(
    jobId: "job1",
    channelId: "voice",
    classificationPolicyId: classificationPolicy.Value.Id)
{
    Labels =
    {
        ["Region"] = new LabelValue("NA"),
        ["Caller_Id"] = new LabelValue("7805551212"),
        ["Caller_NPA_NXX"] = new LabelValue("780555"),
        ["XBOX_Hardware"] = new LabelValue(7)
    }
});
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript
await client.createJob("job1", {
    channelId: "voice",
    classificationPolicyId: "XBOX_NA_QUEUE_Priority_1_10",
    labels: {
        Region: "NA",
        Caller_Id: "7805551212",
        Caller_NPA_NXX: "780555",
        XBOX_Hardware: 7
    },
});
```

::: zone-end

::: zone pivot="programming-language-python"

```python
client.create_job(job_id = "job1", router_job = RouterJob(
    channel_id = "voice",
    classification_policy_id = "XBOX_NA_QUEUE_Priority_1_10",
    labels = {
        "Region": "NA",
        "Caller_Id": "7805551212",
        "Caller_NPA_NXX": "780555",
        "XBOX_Hardware": 7
    }    
))
```

::: zone-end

::: zone pivot="programming-language-java"

```java
client.createJob(new CreateJobWithClassificationPolicyOptions("job1", "voice", "XBOX_NA_QUEUE_Priority_1_10")
    .setLabels(Map.of(
        "Region", new LabelValue("NA"),
        "Caller_Id": new LabelValue("7805551212"),
        "Caller_NPA_NXX": new LabelValue("780555"),
        "XBOX_Hardware": new LabelValue(7)
    )));
```

::: zone-end

## Attaching Worker Selectors

You can use the classification policy to attach more worker selectors to a job.

### Static Attachments

In this example, the Classification Policy is configured with a static attachment, which always attaches the specified label selector to a job.

::: zone pivot="programming-language-csharp"

```csharp
await administrationClient.CreateClassificationPolicyAsync(
    new CreateClassificationPolicyOptions("policy-1")
    {
        WorkerSelectors =
        {
            new StaticWorkerSelectorAttachment(new RouterWorkerSelector(
                key: "Foo", labelOperator: LabelOperator.Equal, value: new LabelValue("Bar")))
        }
    });
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript
await administrationClient.createClassificationPolicy("policy-1", {
    workerSelectors: [{
        kind: "static",
        workerSelector: { key: "Foo", labelOperator: "equal", value: "Bar" }
    }]
});
```

::: zone-end

::: zone pivot="programming-language-python"

```python
administration_client.create_classification_policy(
    classification_policy_id = "policy-1",
    classification_policy = ClassificationPolicy(
        worker_selectors = [
            StaticWorkerSelectorAttachment(
                worker_selector = RouterWorkerSelector(key = "Foo", label_operator = LabelOperator.EQUAL, value = "Bar")
            )
        ]))
```

::: zone-end

::: zone pivot="programming-language-java"

```java
administrationClient.createClassificationPolicy(new CreateClassificationPolicyOptions("policy-1")
    .setWorkerSelectors(List.of(
        new StaticWorkerSelectorAttachment(new RouterWorkerSelector("Foo", LabelOperator.EQUAL, new LabelValue("Bar"))))));
```

::: zone-end

### Conditional Attachments

In this example, the Classification Policy is configured with a conditional attachment. So it evaluates a condition against the job labels to determine if the said label selectors should be attached to the job.

::: zone pivot="programming-language-csharp"

```csharp
await administrationClient.CreateClassificationPolicyAsync(
    new CreateClassificationPolicyOptions("policy-1")
    {
        WorkerSelectors =
        {
            new ConditionalRouterWorkerSelectorAttachment(
                condition: new ExpressionRouterRule("job.Urgent = true"),
                workerSelectors: new List<RouterWorkerSelector>
                {
                    new(key: "Foo", labelOperator: LabelOperator.Equal, value: new LabelValue("Bar"))
                })
        }
    });
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript
await administrationClient.createClassificationPolicy("policy-1", {
    workerSelectors: [{
        kind: "conditional",
        condition: { kind: "expression-rule", expression: "job.Urgent = true" },
        workerSelectors: [{ key: "Foo", labelOperator: "equal", value: "Bar" }]
    }]
});

```

::: zone-end

::: zone pivot="programming-language-python"

```python
administration_client.create_classification_policy(
    classification_policy_id = "policy-1",
    classification_policy = ClassificationPolicy(
        worker_selectors = [
            ConditionalWorkerSelectorAttachment(
                condition = ExpressionRouterRule(expression = "job.Urgent = true"),
                worker_selectors = [
                    RouterWorkerSelector(key = "Foo", label_operator = LabelOperator.EQUAL, value = "Bar")
                ]
            )
        ]))
```

::: zone-end

::: zone pivot="programming-language-java"

```java
administrationClient.createClassificationPolicy(new CreateClassificationPolicyOptions("policy-1")
    .setWorkerSelectors(List.of(new ConditionalRouterWorkerSelectorAttachment(
        new ExpressionRouterRule("job.Urgent = true"),
        List.of(new RouterWorkerSelector("Foo", LabelOperator.EQUAL, new LabelValue("Bar")))))));
```

::: zone-end

### Passthrough Attachments

In this example, the Classification Policy is configured to attach a worker selector (`"Foo" = "<value comes from "Foo" label of the job>"`) to the job.

::: zone pivot="programming-language-csharp"

```csharp
await administrationClient.CreateClassificationPolicyAsync(
    new CreateClassificationPolicyOptions("policy-1")
    {
        WorkerSelectors =
        {
            new PassThroughWorkerSelectorAttachment(key: "Foo", labelOperator: LabelOperator.Equal)
        }
    });
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript
await administrationClient.createClassificationPolicy("policy-1", {
    workerSelectors: [
        {
            kind: "pass-through",
            key: "Foo",
            labelOperator: "equal"
        }
    ]
});
```

::: zone-end

::: zone pivot="programming-language-python"

```python
administration_client.create_classification_policy(
    classification_policy_id = "policy-1",
    classification_policy = ClassificationPolicy(
        worker_selectors = [
            PassThroughWorkerSelectorAttachment(
                key = "Foo", label_operator = LabelOperator.EQUAL, value = "Bar")
        ]))
```

::: zone-end

::: zone pivot="programming-language-java"

```java
administrationClient.createClassificationPolicy(new CreateClassificationPolicyOptions("policy-1")
    .setWorkerSelectors(List.of(new PassThroughWorkerSelectorAttachment("Foo", LabelOperator.EQUAL))));
```

::: zone-end

### Weighted Allocation Attachments

In this example, the Classification Policy is configured with a weighted allocation attachment. This policy divides up jobs according to the weightings specified and attach different selectors accordingly.  Here, 30% of jobs should go to workers with the label `Vendor` set to `A` and 70% should go to workers with the label `Vendor` set to `B`.

::: zone pivot="programming-language-csharp"

```csharp
await administrationClient.CreateClassificationPolicyAsync(new CreateClassificationPolicyOptions("policy-1")
    {
        WorkerSelectors =
        {
            new WeightedAllocationWorkerSelectorAttachment(new List<WorkerWeightedAllocation>
            {
                new (weight: 0.3, workerSelectors: new List<RouterWorkerSelector>
                {
                    new (key: "Vendor", labelOperator: LabelOperator.Equal, value: new LabelValue("A"))
                }),
                new (weight: 0.7, workerSelectors: new List<RouterWorkerSelector>
                {
                    new (key: "Vendor", labelOperator: LabelOperator.Equal, value: new LabelValue("B"))
                })
            })
        }
    });
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript
await administrationClient.createClassificationPolicy("policy-1", {
    workerSelectors: [{
        kind: "weighted-allocation-worker-selector",
        allocations: [
        { 
            weight: 0.3,
            workerSelectors: [{ key: "Vendor", labelOperator: "equal", value: "A" }]
        },
        { 
            weight: 0.7,
            workerSelectors: [{ key: "Vendor", labelOperator: "equal", value: "B" }]
        }]
    }]
});
```

::: zone-end

::: zone pivot="programming-language-python"

```python
administration_client.create_classification_policy(
    classification_policy_id = "policy-1",
    classification_policy = ClassificationPolicy(
        worker_selectors = [ 
            WeightedAllocationWorkerSelectorAttachment(allocations = [
                WorkerWeightedAllocation(weight = 0.3, worker_selectors = [
                    RouterWorkerSelector(key = "Vendor", label_operator = LabelOperator.EQUAL, value = "A")
                ]),
                WorkerWeightedAllocation(weight = 0.7, worker_selectors = [
                    RouterWorkerSelector(key = "Vendor", label_operator = LabelOperator.EQUAL, value = "B")
                ])
            ])
        ]))
```

::: zone-end

::: zone pivot="programming-language-java"

```java
administrationClient.createClassificationPolicy(new CreateClassificationPolicyOptions("policy-1")
    .setWorkerSelectors(List.of(new WeightedAllocationWorkerSelectorAttachment(
        List.of(new WorkerWeightedAllocation(0.3, List.of(
            new RouterWorkerSelector("Vendor", LabelOperator.EQUAL, new LabelValue("A")),
            new RouterWorkerSelector("Vendor", LabelOperator.EQUAL, new LabelValue("B"))
        )))))));
```

::: zone-end

## Reclassify a job after submission

Once the Job Router has received, and classified a Job using a policy, you have the option of reclassifying it using the SDK. The following example illustrates one way of increasing the priority of the Job to `10`, simply by specifying the **Job ID**, calling the `UpdateJobAsync` method, and updating the classificationPolicyId and including the `Hardware_VIP` label.

::: zone pivot="programming-language-csharp"

```csharp
await client.UpdateJobAsync(new UpdateJobOptions("job1") {
    ClassificationPolicyId = classificationPolicy.Value.Id,
    Labels = { ["Hardware_VIP"] = new LabelValue(true) }});
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript
await client.updateJob("job1", {
    classificationPolicyId: classificationPolicy.Value.Id,
    labels: { Hardware_VIP: true }});
```

::: zone-end

::: zone pivot="programming-language-python"

```python
client.update_job(job_id = "job1",
    classification_policy_id = classification_policy.id,
    labels = { "Hardware_VIP": True }
)
```

::: zone-end

::: zone pivot="programming-language-java"

```java
client.updateJob(new UpdateJobOptions("job1")
    .setClassificationPolicyId(classificationPolicy.getId())
    .setLabels(Map.of("Hardware_VIP", new LabelValue(true))));
```

::: zone-end

> [!NOTE]
> If the job labels, queueId, channelId or worker selectors are updated, any existing offers on the job are revoked and you receive a [RouterWorkerOfferRevoked](../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterworkerofferrevoked) event for each offer from EventGrid.  The job is re-queued and you receive a [RouterJobQueued](../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterjobqueued) event.  Job offers may also be revoked when a worker's total capacity is reduced, or the channel configurations are updated.
