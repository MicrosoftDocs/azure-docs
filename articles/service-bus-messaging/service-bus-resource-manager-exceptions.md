---
title: Azure Service Bus Resource Manager exceptions | Microsoft Docs
description: List of Service Bus exceptions surfaced by Azure Resource Manager and suggested actions.
ms.topic: article
ms.date: 06/23/2020
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
| Bad Request | 40000 | SubCode=40000. The property *'property name'* cannot be set when creating a Queue because the namespace *'namespace name'* is using the 'Basic' Tier. This operation is only supported in 'Standard' or 'Premium' tier. | On Azure Service Bus Basic Tier, the below properties cannot be set or updated - <ul> <li> RequiresDuplicateDetection </li> <li> AutoDeleteOnIdle </li> <li>RequiresSession</li> <li>DefaultMessageTimeToLive </li> <li> DuplicateDetectionHistoryTimeWindow </li> <li> EnableExpress </li> <li> ForwardTo </li> <li> Topics </li> </ul> | Consider upgrading from Basic to Standard or Premium tier to use this functionality. |
| Bad Request | 40000 | SubCode=40000. The value for the 'requiresDuplicateDetection' property of an existing Queue(or Topic) cannot be changed. | Duplicate detection must be enabled/disabled at the time of entity creation. The duplicate detection configuration parameter cannot be changed after creation. | To enable duplicate detection on a previously created queue/topic, you can create a new queue/topic with duplicate detection and then forward from the original queue to the new queue/topic. |
| Bad Request | 40000 | SubCode=40000. The specified value 16384 is invalid. The property 'MaxSizeInMegabytes', must be one of the following values: 1024;2048;3072;4096;5120. | The MaxSizeInMegabytes value is invalid. | Ensure that the MaxSizeInMegabytes is one of the following - 1024, 2048, 3072, 4096, 5120. |
| Bad Request | 40000 | SubCode=40000. Partitioning cannot be changed for Queue/Topic. | Partitioning cannot be changed for entity. | Create a new entity (queue or topic) and enable partitions. | 
| Bad Request | none | The namespace *'namespace name'* does not exist. | The namespace does not exist within your Azure subscription. | To resolve this error, please try the below <ul> <li> Ensure that the Azure Subscription is correct. </li> <li> Ensure the namespace exists. </li> <li> Verify the namespace name is correct (no spelling errors or null strings). </li> </ul> | 
| Bad Request | 40400 | SubCode=40400. The auto forwarding destination entity does not exist. | The destination for the autoforwarding destination entity doesn't exist. | The destination entity (queue or topic), must exist before the source is created. Retry after creating the destination entity. |
| Bad Request | 40000 | SubCode=40000. The supplied lock time exceeds the allowed maximum of '5' minutes. | The time for which a message can be locked must be between 1 minute (minimum) and 5 minutes (maximum). | Ensure that the supplied lock time is between 1 min and 5 mins. |
| Bad Request | 40000 | SubCode=40000. Both DelayedPersistence and RequiresDuplicateDetection property cannot be enabled together. | Entities with Duplicate detection enabled on them must be persistent, so persistence cannot be delayed. | Learn more about [Duplicate Detection](duplicate-detection.md) |
| Bad Request | 40000 | SubCode=40000. The value for RequiresSession property of an existing Queue cannot be changed. | Support for sessions should be enabled at the time of entity creation. Once created, you cannot enable/disable sessions on an existing entity (queue or subscription) | Delete and recreate a new queue (or subscription) with the "RequiresSession" property enabled. |
| Bad Request | 40000 | SubCode=40000. 'URI_PATH' contains character(s) that is not allowed by Service Bus. Entity segments can contain only letters, numbers, periods(.), hyphens(-), and underscores(_). | Entity segments can contain only letters, numbers, periods(.), hyphens(-), and underscores(_). Any other characters cause the request to fail. | Ensure that there are no invalid characters in the URI Path. |


## Error code: 429

Just like in HTTP, "Error code 429" indicates "too many requests". It implies that the specific resource (namespace) is being throttled because of too many requests (or due to conflicting operations) on that resource.

| Error code | Error SubCode | Error message | Description | Recommendation |
| ---------- | ------------- | ------------- | ----------- | -------------- |
| 429 | 50004 | SubCode=50004. The request was terminated because the namespace *your namespace* is being throttled. | This error condition is hit when the number of incoming requests exceed the limitation of the resource. | Wait for a few seconds and try again. <br/> <br/> Learn more about the [quotas](service-bus-quotas.md) and [Azure Resource Manager request limits](../azure-resource-manager/management/request-limits-and-throttling.md)|
| 429 | 40901 | SubCode=40901. Another conflicting operation is in progress. | Another conflicting operation is in progress on the same resource/entity | Wait for the current in-progress operation to complete before trying again. |
| 429 | 40900 | SubCode=40900. Conflict. You're requesting an operation that isn't allowed in the resource's current state. | This condition may be hit when multiple requests are made to perform the operations on the same entity (queue, topic, subscription, or rule) at the same time. | Wait for a few seconds and try again |
| 429 | 40901 | Request on entity *'entity name'* conflicted with another request | Another conflicting operation is in progress on the same resource/entity | Wait for the previous operation to complete before trying again |
| 429 | 40901 | Another update request is in progress for the entity *'entity name'*. | Another conflicting operation is in progress on the same resource/entity | Wait for the previous operation to complete before trying again |
| 429 | none | Resource Conflict Occurred. Another conflicting operation may be in progress. If this is a retry for failed operation, background cleanup is still pending. Try again later. | This condition may be hit when there is a pending operation against the same entity. | Wait for the previous operation to complete before trying again. |


## Error code: Not Found

This class of errors indicates that the resource was not found.

| Error code | Error SubCode | Error message | Description | Recommendation |
| ---------- | ------------- | ------------- | ----------- | -------------- |
| Not found | none | Entity *'entity name'* was not found. | The entity against which the operation was not found. | Check if the entity exists and try the operation again. |
| Not found | none | Not Found. The Operation doesn't exist. | The operation you are trying to perform does not exist. | Check the operation and try again. |
| Not found | none | The incoming request is not recognized as a namespace policy put request. | The incoming request body is null and hence cannot be executed as a put request. | Please check the request body to ensure that it is not null. | 
| Not found | none | The messaging entity *'entity name'* could not be found. | The entity that you are trying to execute the operation against could not be found. | Please check whether the entity exists and try the operation again. |

## Error code: Internal Server Error

This class of errors indicates that there was a internal server error

| Error code | Error SubCode | Error message | Description | Recommendation |
| ---------- | ------------- | ------------- | ----------- | -------------- |
| Internal Server Error | 50000 | SubCode=50000. Internal Server Error| Can happen for various reasons. Some of the symptoms are - <ul> <li> Client request/body is corrupt and leads to an error. </li> <li> The client request timed out due to processing issues on the service. </li> </ul> | To resolve this <ul> <li> Ensure that the requests parameters are not null or malformed. </li> <li> Retry the request. </li> </ul> |

## Error code: Unauthorized

This class of errors indicates the absence of authorization to run the command.

| Error code | Error SubCode | Error message | Description | Recommendation |
| ---------- | ------------- | ------------- | ----------- | -------------- |
| Unauthorized | none | Invalid operation on the Secondary namespace. Secondary namespace is read-only. | The operation was performed against the secondary namespace, which is setup as a readonly namespace. | Retry the command against the primary namespace. Learn more about [secondary namespace](service-bus-geo-dr.md) |
| Unauthorized | none | MissingToken: The authorization header was not found. | This error occurs when the authorization has null or incorrect values. | Ensure that the token value mentioned in the authorization header is correct and not null. |