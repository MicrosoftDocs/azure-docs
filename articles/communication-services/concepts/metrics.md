---
title: Metric definitions for Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: This document covers definitions of metrics available in the Azure portal.
author: mkhribech
manager: timmitchell
services: azure-communication-services

ms.author: mkhribech
ms.date: 06/30/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: data
---
# Metrics overview

Azure Communication Services currently provides metrics for all Azure communication services' primitives. [Azure Metrics Explorer](../../azure-monitor/essentials/metrics-getting-started.md) can be used to plot your own charts, investigate abnormalities in your metric values, and understand your API traffic by using the metrics data that email requests emit.

## Where to find metrics

Primitives in Azure Communication Services emit metrics for API requests. These metrics can be found in the Metrics tab under your Communication Services resource. You can also create permanent dashboards using the workbooks tab under your Communication Services resource.

## Metric definitions

All API request metrics contain three dimensions that you can use to filter your metrics data. These dimensions can be aggregated together using the `Count` aggregation type and support all standard Azure Aggregation time series including `Sum`, `Average`, `Min`, and `Max`.

More information on supported aggregation types and time series aggregations can be found [Advanced features of Azure Metrics Explorer](../../azure-monitor/essentials/metrics-charts.md#aggregation)

- **Operation** - All operations or routes that can be called on the Azure Communication Services Chat gateway.
- **Status Code** - The status code response sent after the request.
- **StatusSubClass** - The status code series sent after the response.

### Chat API request metric operations

The following operations are available on Chat API request metrics:

| Operation / Route    | Description                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| GetChatMessage       | Gets a message by message ID. |
| ListChatMessages     | Gets a list of chat messages from a thread. |
| SendChatMessage      | Sends a chat message to a thread. |
| UpdateChatMessage    | Updates a chat message. |
| DeleteChatMessage    | Deletes a chat message. |
| GetChatThread        | Gets a chat thread. |
| ListChatThreads      | Gets the list of chat threads of a user. |
| UpdateChatThread     | Updates a chat thread's properties. |
| CreateChatThread     | Creates a chat thread. |
| DeleteChatThread     | Deletes a thread. |
| GetReadReceipts      | Gets read receipts for a thread. |
| SendReadReceipt      | Sends a read receipt event to a thread, on behalf of a user. |
| SendTypingIndicator           | Posts a typing event to a thread, on behalf of a user. |
| ListChatThreadParticipants    | Gets the members of a thread. |
| AddChatThreadParticipants     | Adds thread members to a thread. If members already exist, no change occurs. |
| RemoveChatThreadParticipant   | Remove a member from a thread. |

:::image type="content" source="./media/chat-metric.png" alt-text="Screenshot of Chat API Request Metric." lightbox="./media/chat-metric.png":::

If a request is made to an operation that isn't recognized, you receive a "Bad Route" value response.

### SMS API requests

The following operations are available on SMS API request metrics:

| Operation / Route    | Description                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| SMSMessageSent       | Sends an SMS message. |
| SMSDeliveryReportsReceived     | Gets SMS Delivery Reports |
| SMSMessagesReceived      | Gets SMS messages. |

:::image type="content" source="./media/sms-metric.png" alt-text="Screenshot of SMS API Request Metric." lightbox="./media/sms-metric.png":::

### Authentication API requests

The following operations are available on Authentication API request metrics:

| Operation / Route             | Description                                                                                    |
| ----------------------------- | ---------------------------------------------------------------------------------------------- |
| CreateIdentity                | Creates an identity representing a single user. |
| DeleteIdentity                | Deletes an identity. |
| CreateToken                   | Creates an access token. |
| RevokeToken                   | Revokes all access tokens created for an identity before a time given. |
| ExchangeTeamsUserAccessToken  | Exchange a Microsoft Entra access token of a Teams user for a new Communication Identity access token with a matching expiration time.|

:::image type="content" source="./media/acs-auth-metrics.png" alt-text="Screenshot of authentication Request Metric."  lightbox="./media/acs-auth-metrics.png":::

### Call Automation API requests

The following operations are available on Call Automation API request metrics:

| Operation / Route  | Description                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| Create Call           | Create an outbound call to user.
| Answer Call           | Answer an inbound call. |
| Redirect Call         | Redirect an inbound call to another user. |
| Reject Call           | Reject an inbound call. |
| Transfer Call To Participant   |  Transfer 1:1 call to another user.   |
| Play                  | Play audio to call participants.  |
| PlayPrompt            | Play a prompt to users as part of the Recognize action. |
| Recognize             | Recognize user input from call participants. |
| Add Participants      |  Add a participant to a call.    |
| Remove Participants   | Remove a participant from a call.   |
| HangUp Call           | Hang up your call leg. |
| Terminate Call        | End the call for all participants.  |
| Get Call              | Get details about a call.     |
| Get Participant       |  Get details on a call participant.   |
| Get Participants      |  Get all participants in a call.   |
| Delete Call           |  Delete a call.    |
| Cancel All Media Operations | Cancel all ongoing or queued media operations in a call. |

### Job Router API requests

The following operations are available on Job Router API request metrics:

| Operation / Route  | Description                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| UpsertClassificationPolicy | Creates or updates a classification policy.
| GetClassificationPolicy | Retrieves an existing classification policy by ID. |
| ListClassificationPolicies | Retrieves existing classification policies |
| DeleteDistributionPolicy | Delete a classification policy by ID. |
| UpsertDistributionPolicy | Creates or updates a distribution policy.
| GetDistributionPolicy | Retrieves an existing distribution policy by ID. |
| ListDistributionPolicies | Retrieves existing distribution policies |
| DeleteDistributionPolicy | Delete a distribution policy by ID. |
| UpsertExceptionPolicy | Creates or updates an exception policy. |
| GetExceptionPolicy | Retrieves an existing exception policy by ID. |
| ListExceptionPolicies | Retrieves existing exception policies |
| DeleteExceptionPolicy | Delete an exception policy by ID. |
| UpsertQueue| Creates or updates a queue.
| GetQueue | Retrieves an existing queue by ID. |
| GetQueues | Retrieves existing queues |
| DeleteQueue | Delete a queue by ID. |
| GetQueueStatistics | Retrieves a queue's statistics. |
| UpsertJob | Creates or updates a job.
| GetJob | Retrieves an existing job by ID. |
| GetJobs | Retrieves existing jobs |
| DeleteJob | Delete a queue policy by ID. |
| ReclassifyJob | Reclassify a job.
| CancelJob | Submits request to cancel an existing job by ID while supplying free-form cancellation reason. |
| CompleteJob | Completes an assigned job. |
| CloseJob | Closes a completed job. |
| AcceptJobOffer | Accepts an offer to work on a job and returns a 409/Conflict if another agent accepted the job already. |
| DeclineJobOffer| Declines an offer to work on a job. |
| UpsertWorker | Creates or updates a worker.
| GetWorker | Retrieves an existing worker by ID. |
| GetWorkers | Retrieves existing workers. |
| DeleteWorker | Deletes a worker and all of its traces. |

### Network Traversal API requests

The following operations are available on Network Traversal API request metrics:

| Operation / Route    | Description                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| IssueRelayConfiguration       | Issue configuration for an STUN/TURN server. |

:::image type="content" source="./media/acs-turn-metrics.png" alt-text="Screenshot of TURN Token Request Metric." lightbox="./media/acs-turn-metrics.png":::

### Rooms API requests

The following operations are available on Rooms API request metrics:

| Operation / Route             | Description                                                                                    |
| ----------------------------- | ---------------------------------------------------------------------------------------------- |
| CreateRoom                    | Creates a Room. |
| DeleteRoom                    | Deletes a Room. |
| GetRoom                       | Gets a Room by Room ID. |
| PatchRoom                     | Updates a Room by Room ID. |
| ListRooms                     | Lists all the Rooms for an Azure Communication Services Resource. |
| AddParticipants               | Adds participants to a Room.|
| RemoveParticipants            | Removes participants from a Room. |
| GetParticipants               | Gets list of participants for a Room. |
| UpdateParticipants            | Updates list of participants for a Room. |

:::image type="content" source="./media/rooms/rooms-metrics.png" alt-text="Screenshot of Rooms Request Metric."  lightbox="./media/rooms/rooms-metrics.png":::

## Next steps

- Learn more about [Data Platform Metrics](../../azure-monitor/essentials/data-platform-metrics.md)
