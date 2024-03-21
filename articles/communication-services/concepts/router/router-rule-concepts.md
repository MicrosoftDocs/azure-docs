---
title: Job Router rule engines
titleSuffix: An Azure Communication Services concept document
description: Learn about the Azure Communication Services Job Router rules engine concepts.
author: jasonshave
manager: phans
services: azure-communication-services

ms.author: jassha
ms.date: 10/14/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
zone_pivot_groups: acs-js-csharp-java-python
---

# Job Router rule engines

Job Router can use one or more rule engines to process data and make decisions about your Jobs and Workers. This document covers what the rule engines do and why you may want to apply them in your implementation.

## Rules engine overview

Controlling the behavior of your implementation can often include complex decision making. Job Router provides a flexible way to invoke behavior programmatically using various rule engines. Job Router's rule engines generally take a set of **labels** defined on objects such as a Job, a Queue, or a Worker as an input, apply the rule and produce an output.

Depending on where you apply rules in Job Router, the result can vary. For example, a Classification Policy can choose a Queue ID based on the labels defined on the input of a Job. In another example, a Distribution Policy can find the best Worker using a custom scoring rule.

## Rule engine types

The following rule engine types exist in Job Router to provide flexibility in how your Jobs are processed.

**Static rule -** Used to specify a static value such as selecting a specific Queue ID.

**Expression rule -** Uses the [PowerFx](https://powerapps.microsoft.com/en-us/blog/what-is-microsoft-power-fx/) language to define your rule as an inline expression.

**Azure Function rule -** Allows the Job Router to pass the input labels as a payload to an Azure Function and respond back with an output value.

**Webhook rule -** Allows the Job Router to pass the input labels as a payload to a Webhook and respond back with an output value.

**Direct map rule -** Takes the input labels on a job and outputs a set of worker or queue selectors with the same key and values. This should only be used in the `ConditionalQueueSelectorAttachment` or `ConditionalWorkerSelectorAttachment`.

### Example: Use a static rule to set the priority of a job

In this example a `StaticRouterRule`, which is a subtype of `RouterRule` can be used to set the priority of all Jobs, which use this classification policy.

::: zone pivot="programming-language-csharp"

```csharp
await administrationClient.CreateClassificationPolicyAsync(
    new CreateClassificationPolicyOptions(classificationPolicyId: "my-policy-id")
    {
        PrioritizationRule = new StaticRouterRule(new RouterValue(5))
    });
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript
await administrationClient.path("/routing/classificationPolicies/{classificationPolicyId}", "my-policy-id").patch({
    body: {
        prioritizationRule: { kind: "static", value: 5 }
    },
    contentType: "application/merge-patch+json"
  });
```

::: zone-end

::: zone pivot="programming-language-python"

```python
administration_client.upsert_classification_policy(
    classification_policy_id = "my-policy-id",
    prioritization_rule = StaticRouterRule(value = 5))
```

::: zone-end

::: zone pivot="programming-language-java"

```java
administrationClient.createClassificationPolicy(new CreateClassificationPolicyOptions("my-policy-id")
    .setPrioritizationRule(new StaticRouterRule(new RouterValue(5))));
```

::: zone-end

### Example: Use an expression rule to set the priority of a job

In this example an `ExpressionRouterRule` which is a subtype of `RouterRule`, evaluates a PowerFX expression to set the priority of all jobs that use this classification policy.

::: zone pivot="programming-language-csharp"

```csharp
await administrationClient.CreateClassificationPolicyAsync(
    new CreateClassificationPolicyOptions(classificationPolicyId: "my-policy-id")
    {
        PrioritizationRule = new ExpressionRouterRule(expression: "If(job.Escalated = true, 10, 5)") // this will check whether the job has a label "Escalated" set to "true"
    });
```

::: zone-end

::: zone pivot="programming-language-javascript"

```typescript
await administrationClient.path("/routing/classificationPolicies/{classificationPolicyId}", "my-policy-id").patch({
    body: {
        prioritizationRule: {
            kind: "expression",
            expression: "If(job.Escalated = true, 10, 5)"
        }
    },
    contentType: "application/merge-patch+json"
});
```

::: zone-end

::: zone pivot="programming-language-python"

```python
administration_client.upsert_classification_policy(
    classification_policy_id = "my-policy-id",
    prioritization_rule = ExpressionRouterRule(expression = "If(job.Urgent = true, 10, 5)"))
```

::: zone-end

::: zone pivot="programming-language-java"

```java
administrationClient.createClassificationPolicy(
    new CreateClassificationPolicyOptions("my-policy-id")
        .setPrioritizationRule(new ExpressionRouterRule("If(job.Urgent = true, 10, 5)")));
```

::: zone-end

## Next steps

- [Azure Function Rule How To](../../how-tos/router-sdk/azure-function.md)
