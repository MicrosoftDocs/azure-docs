---	
title: Router rule engine concepts for Azure Communication Services
titleSuffix: An Azure Communication Services concept document	
description: Learn about the Azure Communication Services Job Router rule engine concepts.	
author: jasonshave	
manager: phans
services: azure-communication-services

ms.author: jassha
ms.date: 10/14/2021
ms.topic: conceptual
ms.service: azure-communication-services
---

# Job Router rule engine concepts

[!INCLUDE [Private Preview Disclaimer](../../includes/private-preview-include-section.md)]

Azure Communication Services Job Router uses an extensible rules engine to process data and make decisions about your Jobs and Workers. This document covers what the rule engine does and why you may want to apply it in your implementation.

## Rule engine overview

Controlling the behavior of your implementation can often include complex decision making. Job Router provides a flexible way to invoke behavior programmatically using various rule engines. Job Router's rule engines generally take a set of **labels** defined on objects such as a Job, a Queue, or a Worker as an input, apply the rule and produce an output.

> [!NOTE]
> Although the rule engine typically uses labels as input, it can also set values such as a Queue ID without the use of evaluating labels.

Depending on where you apply rules in Job Router, the result can vary. For example, a Classification Policy can choose a Queue ID based on the labels defined on the input of a Job. In another example, a Distribution Policy can find the best Worker using a custom scoring rule defined by the `RouterRule`.

### Example: Use a static rule in a classification policy to set the queue ID

In this example a `StaticRule`, which is a type of `RouterRule` can be used to set the Queue ID of all Jobs, which reference the Classification Policy ID `XBOX_QUEUE_POLICY`.

```csharp
await client.SetClassificationPolicyAsync(
    id: "XBOX_QUEUE_POLICY",
    queueSelector: new QueueIdSelector(new StaticRule("XBOX"))
)
```
## RouterRule types

The following `RouterRule` types exist in Job Router to provide flexibility in how your Jobs are processed.

**Static rule -** This rule can be used specify a static value such as selecting a specific Queue ID.

**Expression rule -** An expression rule uses the [PowerFx](https://powerapps.microsoft.com/en-us/blog/what-is-microsoft-power-fx/) language to process the Job labels and return an object representing the parsed value.

**Azure Function rule -** Specifying a URI and an `AzureFunctionRuleCredential`, this rule allows the Job Router to pass the input labels as a payload and respond back with an output value. This rule type can be used when your requirements are complex.

> [!NOTE]
> Although the **Direct Map rule** is part of the Job Router SDK, it is only supported in the `NearestQueueLabelSelector` at this time.
