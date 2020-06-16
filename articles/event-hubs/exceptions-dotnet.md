---
title: Azure Event Hubs - .NET exceptions
description: This article provides a list of Azure Event Hubs .NET messaging exceptions and suggested actions.
services: event-hubs
documentationcenter: na
author: ShubhaVijayasarathy
manager: timlt

ms.service: event-hubs
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.custom: seodec18
ms.date: 06/16/2020
ms.author: shvija

---

# EventHubsException - .NET
An **EventHubsException** is triggered when an operation specific to Event Hubs has encountered an issue, including both errors within the service and specific to the client. 

## Exception information
The exception includes some contextual information to assist in understanding the context of the error and its relative severity. These are:

- **IsTransient**: This identifies whether or not the exception is considered recoverable. In the case where it was deemed transient, the appropriate retry policy has already been applied and retries were unsuccessful.
- **Reason**: Provides a set of well-known reasons for the failure that help to categorize and clarify the root cause. These are intended to allow for applying exception filtering and other logic where inspecting the text of an exception message wouldn't be ideal. Some key failure reasons are:
    - **Client Closed**: This occurs when an operation has been requested on an Event Hub client that has already been closed or disposed of. It is recommended to check the application code and ensure that objects from the Event Hubs client library are created and closed/disposed in the intended scope.
    - **Service Timeout**: This indicates that the Event Hubs service did not respond to an operation within the expected amount of time. This may have been caused by a transient network issue or service problem. The Event Hubs service may or may not have successfully completed the request; the status is not known. It is recommended to attempt to verify the current state and retry if necessary.
    - **Quota Exceeded**: This typically indicates that there are too many active read operations for a single consumer group. This limit depends on the tier of the Event Hubs namespace, and moving to a higher tier may be desired. An alternative would be to create additional consumer groups and ensure that the number of consumer client reads for any group is within the limit. Please see Azure Event Hubs quotas and limits for more information.
    - **Message Size Exceeded** : Event data as a maximum size allowed for both an individual event and a batch of events. This includes the data of the event, as well as any associated metadata and system overhead. The best approach for resolving this error is to reduce the number of events being sent in a batch or the size of data included in the message. Because size limits are subject to change, please refer to Azure Event Hubs quotas and limits for specifics.
    - **Consumer Disconnected**: A consumer client was disconnected by the Event Hub service from the Event Hub instance. This typically occurs when a consumer with a higher owner level asserts ownership over a partition and consumer group pairing.
    - **Resource Not Found**: An Event Hubs resource, such as an Event Hub, consumer group, or partition, could not be found by the Event Hubs service. This may indicate that it has been deleted from the service or that there is an issue with the Event Hubs service itself.

## Handling exceptions
Reacting to a specific failure reason for the **EventHubException** can be accomplished in several ways, such as by applying an exception filter clause as part of the catch block:

```csharp
try
{
    // Read events using the consumer client
}
catch (EventHubsException ex) where 
    (ex.Reason == EventHubsException.FailureReason.ConsumerDisconnected)
{
    // Take action based on a consumer being disconnected
}
```

## Next steps
There are other exception that are documented in the [legacy article](event-hubs-messaging-exceptions.md), but some of them apply only to the legacy Event Hubs client library.