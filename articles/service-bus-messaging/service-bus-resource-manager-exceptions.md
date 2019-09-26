---
title: Azure Service Bus Resource Manager exceptions | Microsoft Docs
description: List of Service Bus exceptions surfaced by Azure Resource Manager and suggested actions.
services: service-bus-messaging
documentationcenter: na
author: axisc
manager: darosa
editor: spelluru

ms.assetid: 3d8526fe-6e47-4119-9f3e-c56d916a98f9
ms.service: service-bus-messaging
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/26/2019
ms.author: aschhab

---

# Service Bus Resource Manager exceptions

This article lists exceptions generated when interacting with Azure Service Bus using Azure Resource Manager - via templates or direct calls.

> [!IMPORTANT]
> This document is frequently updated. Please check back for updates.

Below are the various exceptions/errors that are surfaced through the Azure Resource Manager.

## Error: Bad Request

"Bad Request" implies that the request received by the Resource Manager failed validation.

| Error code | Error SubCode | Error message | Description | Recommendation |
| ---------- | ------------- | ------------- | ----------- | -------------- |
| Bad Request | 40000 | SubCode=40000. The property *'property name'* cannot be set when creating a Queue because the namespace *'namespace name'* is using the 'Basic' Tier. This operation is only supported in 'Standard' or 'Premium' tier. | On Azure Service Bus Basic Tier, the below properties cannot be set or updated - <ul> <li> RequiresDuplicateDetection </li> <li> AutoDeleteOnIdle </li> <li>RequiresSession</li> <li>DefaultMessageTimeToLive </li> <li> DuplicateDetectionHistoryTimeWindow </li> <li> EnableExpress </li> <li> ForwardTo </li> <li> Topics </li> </ul> | Consider upgrading from Basic to Standard or Premium tier to leverage this functionality. |
| Bad Request | 40000 | SubCode=40000. The value for the 'requiresDuplicateDetection' property of an existing Queue cannot be changed. | Duplicate detection must be enabled/disabled at the time of entity creation. Once created, the duplicate detection configuration parameter cannot be changed. | To enable duplicate detection on a previously created queue/subscription, you can create a new queue with duplicate detection and then forward from the original queue to the new queue. |
| Bad Request | 40000 | SubCode=40000. The specified value 16384 is invalid. The property 'MaxSizeInMegabytes', must be one of the following values: 1024;2048;3072;4096;5120. | The MaxSizeInMegabytes value is invalid. | Ensure that the MaxSizeInMegabytes is one of the following - 1024, 2048, 3072, 4096, 5120. |
| Bad Request | 40000 | SubCode=40000. Partitioning cannot be changed for Queue. | Partitioning cannot be changed for entity. | Create a new entity and enable partitions. | 
| Bad Request | none | The namespace *'namespace name'* does not exist. | The namespace does not exist within your Azure subscription. | To resolve this error, please try the below <ul> <li> Ensure that the Azure Subscription is correct. </li> <li> Ensure the namespace exists. </li> <li> Verify the namespace name is correct (no spelling errors or null strings). </li> </ul> | 
| Bad Request | 40400 | SubCode=40400. The auto forwarding destination entity does not exist. | The destination for the autoforwarding destination entity doesn't exist. | The destination entity (queue or topic), must exist before the source is created. Retry after creating the destination entity. |


## Error code: 429

| Error code | Error SubCode | Error message | Description | Recommendation |
| ---------- | ------------- | ------------- | ----------- | -------------- |
| 429 | 50004 | SubCode=50004. The request was terminated because the namespace *your namespace* is being throttled. | This error condition is hit when the number of incoming requests exceed the limitation of the resource. | Wait for a few seconds and try again. <br/> <br/> Learn more about the [quotas](service-bus-quotas.md) and [Azure Resource Manager request limits](../azure-resource-manager/resource-manager-request-limits.md)|
| 429 | 40901 | SubCode=40901. Another conflicting operation is in progress. | Another conflicting operation is in progress on the same resource/entity | Wait for the current in-progress operation to complete before trying again. |
| 429 | 40900 | SubCode=40900. Conflict. You're requesting an operation that isn't allowed in the resource's current state. | This condition may be hit when multiple requests are made to perform the operations on the same entity (queue, topic, subscription, or rule) at the same time | Wait for a few seconds and try again |
| 429 | none | Resource Conflict Occurred. Another conflicting operation may be in progress. If this is a retry for failed operation, background cleanup is still pending. Try again later. | This condition may be hit when there is a pending operation against the same entity. | Wait for the previous operation to complete before trying again. |

