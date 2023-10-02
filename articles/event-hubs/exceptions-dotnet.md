---
title: Azure Event Hubs - .NET exceptions
description: This article provides a list of Azure Event Hubs .NET messaging exceptions and suggested actions.
services: event-hubs
documentationcenter: na
author: spelluru

ms.service: event-hubs
ms.devlang: csharp
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.custom: seodec18, devx-track-dotnet
ms.date: 09/23/2021
ms.author: spelluru
---

# EventHubsException - .NET
An **EventHubsException** is triggered when an operation specific to Event Hubs has caused an issue, including both errors within the service and specific to the client. 

## Exception information
The exception includes the following contextual information to assist in understanding the context of the error and its relative severity. 

- **IsTransient**: Identifies whether the exception is considered recoverable or not. In the case where it was considered transient, the appropriate retry policy has already been applied and retries were unsuccessful.
- **Reason**: Provides a set of well-known reasons for the failure that help to categorize and clarify the root cause. These reasons are intended to allow for applying exception filtering and other logic when inspecting the text of an exception message wouldn't be ideal. Some key failure reasons are:
    - **Client Closed**: Occurs when an Event Hub client that has already been closed or disposed. We recommend that you check the application code to ensure objects from the Event Hubs client library are created and closed in the intended scope.
    - **Service Timeout**: Indicates that the Event Hubs service didn't respond to an operation within the expected amount of time. This issue may have been caused by a transient network issue or service problem. The Event Hubs service may or may not have successfully completed the request; the status isn't known. It's recommended to attempt to verify the current state and retry if necessary.
    - **Quota Exceeded**: Indicates that there are too many active read operations for a single consumer group. This limit depends on the tier of the Event Hubs namespace, and moving to a higher tier may be needed. An alternative would be to create additional consumer groups and ensure that the number of consumer client reads for any group is within the limit. For more information, see [Azure Event Hubs quotas and limits](event-hubs-quotas.md).
    - **Message Size Exceeded**: Event data as a maximum size allowed for both an individual event and a batch of events. It includes the data of the event, and any associated metadata and system overhead. To resolve this error, reduce the number of events sent in a batch or reduce the size of data included in the message. Because size limits are subject to change, see to [Azure Event Hubs quotas and limits](event-hubs-quotas.md) for specifics.
    - **Consumer Disconnected**: A consumer client was disconnected by the Event Hub service from the Event Hub instance. It typically occurs when a consumer with a higher owner level asserts ownership over a partition and consumer group pairing.
    - **Resource Not Found**: The Event Hubs service couldn't find a resource such as an event hub, consumer group, or partition. It may have been deleted or that there's an issue with the Event Hubs service itself.

## Handling exceptions
You can react to a specific failure reason for the **EventHubException**  in several ways. One way is to apply an exception filter clause as part of the catch block.

```csharp
try
{
    // Read events using the consumer client
}
catch (EventHubsException ex) when 
    (ex.Reason == EventHubsException.FailureReason.ConsumerDisconnected)
{
    // Take action based on a consumer being disconnected
}
```

## Next steps
There are other exceptions that are documented in the [legacy article](event-hubs-messaging-exceptions.md). Some of them apply only to the legacy Event Hubs .NET client library.
