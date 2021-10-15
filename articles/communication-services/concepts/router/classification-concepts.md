---	
title: Job classification concepts for Azure Communication Services
titleSuffix: An Azure Communication Services concept document	
description: Learn about the Azure Communication Services Job Router classification concepts.	
author: jasonshave	
manager: phans
services: azure-communication-services

ms.author: jassha
ms.date: 10/14/2021
ms.topic: conceptual
ms.service: azure-communication-services
---	

# Job classification concepts

[!INCLUDE [Private Preview Disclaimer](../../includes/private-preview-include-section.md)]

Azure Communication Services Job Router uses a process called **classification** when a Job is submitted. This article describes the different ways a Job can be classified and the effect this process has on it.

## Job classification overview

Job Router uses two primary methods for classifying a Job; static or dynamic. If the calling application has knowledge about the Queue ID, Priority, or Worker Selectors, the Job can be submitted without a Classification Policy; known as **static classification**. If you prefer to let Job Router decide the Queue ID, a Classification Policy can be used to modify the Job's properties; known as **dynamic classification**.

When you submit a Job using the Job Router SDK, the process of classification will result in an event being sent to your Azure Communication Services Event Grid subscription. The events generated as part of the classification lifecycle give insights into what actions the Job Router is taking. For example, a successful classification will produce a **RouterJobClassified** and a failure will produce a **RouterJobClassificationFailed**.

The process of classifying a Job involves optionally setting the following properties:

- Queue ID
- Priority
- Worker Selectors

## Static classification

Submitting a Job with a pre-defined Queue ID, Priority, and Worker selectors allows you to get started quickly. Job Router will not modify these properties after submitting the Job unless you update it by specifying a Classification Policy prior to assignment to a Worker. You can update the Classification Policy property of a Job after submission, which will trigger the dynamic classification process.

> [!NOTE]
> You have the option of overriding the result of dynamic classification by using the Job Router SDK to update the Job properties manually. For example, you could specify a static Queue ID initially, then update the Job with a Classification Policy ID to be dynamically classified, then override the Queue ID.

## Dynamic classification

Specifying a classification policy when you submit a Job will allow Job Router to dynamically assign the Queue ID, Priority, and potentially modify the Worker selectors. This type of classification is beneficial since the calling application does not need to have knowledge of any Job properties including the Queue ID at runtime.

### Queue selectors

A Classification Policy can reference a `QueueSelector`, which is used by the classification process to determine which Queue ID will be chosen for a particular Job. The following polymorphic `QueueSelector` types exist in Job Router and are applicable options to the Queue selection process during classification:

**QueueLabelSelector -** When you create a Job Router Queue you can specify labels to help the Queue selection process during Job classification. This type of selector uses a collection of `LabelSelectorAttachment` types to offer the most flexibility in selecting the Queue during the classification process. Use this selector to allow the Job classification process to select the Queue ID based on its labels. For more information See the section [below](#using-labels-and-selectors-in-classification).

**QueueIdSelector -** This selector will allow the use of a polymorphic `RouterRule` to determine the Queue ID of the Job based on the result of the rule engine. Read the [RouterRule concepts](router-rule-concepts.md) page for more information.

### Worker selectors

A Worker selector in a Classification Policy contains a collection of `LabelSelectorAttachment` types, which is used by the classification process to attach Worker selectors to a Job based on its labels. For more information See the section [below](#using-labels-and-selectors-in-classification).

### Prioritization rule

The determination of the priority of a Job during classification can be handled using a `RouterRule`; similar to how the `QueueIdSelector` works. Read the [RouterRule concepts](router-rule-concepts.md) page for more information.

## Using labels and selectors in classification

Job Router uses the key/value pair "labels" of a Job, Worker, and Queue to make various decisions about routing and queueing. When using a `LabelSelectorAttachment` on a `QueueSelector`, it acts like a filter. When used on a `WorkerSelectors` object, it attaches selectors to the existing set. The following polymorphic `LabelSelectorAttachment` types exist in Job router and are available in multiple stages of the classification process:

**Static label selector -** Uses a simple `LabelSelector` involving a key, operator, and value.

**Conditional label selector -** Uses a `RouterRule` together with a collection of `LabelSelector` types for filtering and merging.

**Passthrough label selector -** Uses a key and `LabelOperator` to check for the existence of the key. This selector can be used in the `QueueLabelSelector` to match a Queue based on the set of labels. When used with the `WorkerSelectors`, the Job's key/value pair are attached to the `WorkerSelectors` of the Job.

**Rule label selector -** Uses a `RouterRule` to determine a suitable Queue, or in the context of `WorkerSelectors`, it attaches new selectors based on the outcome of the processed rule. Read the [RouterRule concepts](router-rule-concepts.md) page for more information.

**Weighted allocation label selector -** A collection of `WeightedAllocation` types each with a collection of `LabelSelector` types can be used to attach `WorkerSelectors` to the Job for distributing work with a weighted behavior. For example, you may want 30% of the Jobs to go to "Contoso" and 70% of Jobs to go to "Fabrikam".

> [!NOTE]
> The weighted allocation label selector is currently only supported for attaching new `WorkerSelectors` to the Job and should not be used in a `QueueSelector`.

## Reclassifying a job
Once a Job has been classified by a policy, it can be reclassified in the following ways:

1. You can update the Job labels, which will cause the Job Router to evaluate the new labels with the previous Classification Policy.
2. You can update the Classification Policy ID of a Job, which will cause Job Router to process the existing Job against the new policy.
3. An Exception Policy **trigger** can take the **action** of requesting a Job be reclassified 

> [!NOTE]
> The Job Router SDK includes an `UpdateJobLabels` method which simply updates the labels without causing the Job Router to execute the reclassification process.