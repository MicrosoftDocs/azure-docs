---
title: Metric definitions for Azure Communication Service
titleSuffix: An Azure Communication Services concept document
description: This document covers definitions of metrics available in the Azure portal.
author: tophpalmer
manager: chpalm
services: azure-communication-services

ms.author: chpalm
ms.date: 06/30/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: data
---
# Metrics overview

Azure Communication Services currently provides metrics for all ACS primitives. [Azure Metrics Explorer](../../azure-monitor/essentials/metrics-getting-started.md) can be used to plot your own charts, investigate abnormalities in your metric values, and understand your API traffic by using the metrics data that Chat and SMS requests emit.

## Where to find metrics

Primitives in Azure Communication Services emit metrics for API requests. These metrics can be found in the Metrics tab under your Communication Services resource. You can also create permanent dashboards using the workbooks tab under your Communication Services resource.

## Metric definitions

Today there are various types of requests that are represented within Communication Services metrics: **Chat API requests** , **SMS API requests** , **Authentication API requests**, **Call Automation API requests** and **Network Traversal API requests**. Today there are various types of requests that are represented within Communication Services metrics: **Chat API requests** , **SMS API requests** , **Authentication API requests**, **Call Automation API requests**, **Network Traversal API requests**, **Email API requests**, **Email Delivery Staus** and **Email User Engagement**.

All API request metrics contain three dimensions that you can use to filter your metrics data. These dimensions can be aggregated together using the `Count` aggregation type and support all standard Azure Aggregation time series including `Sum`, `Average`, `Min`, and `Max`.

More information on supported aggregation types and time series aggregations can be found [Advanced features of Azure Metrics Explorer](../../azure-monitor/essentials/metrics-charts.md#aggregation)

- **Operation** - All operations or routes that can be called on the Azure Communication Services Chat gateway.
- **Status Code** - The status code response sent after the request.
- **StatusSubClass** - The status code series sent after the response. 


### Chat API request metric operations

The following operations are available on Chat API request metrics:

| Operation / Route    | Description                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| GetChatMessage       | Gets a message by message id. |
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

:::image type="content" source="./media/chat-metric.png" alt-text="Chat API Request Metric.":::

If a request is made to an operation that isn't recognized, you'll receive a "Bad Route" value response.

### SMS API requests

The following operations are available on SMS API request metrics:

| Operation / Route    | Description                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| SMSMessageSent       | Sends a SMS message. |
| SMSDeliveryReportsReceived     | Gets SMS Delivery Reports |
| SMSMessagesReceived      | Gets SMS messages. |


:::image type="content" source="./media/sms-metric.png" alt-text="SMS API Request Metric.":::

### Authentication API requests

The following operations are available on Authentication API request metrics:

| Operation / Route             | Description                                                                                    |
| ----------------------------- | ---------------------------------------------------------------------------------------------- |
| CreateIdentity                | Creates an identity representing a single user. |
| DeleteIdentity                | Deletes an identity. |
| CreateToken                   | Creates an access token. |
| RevokeToken                   | Revokes all access tokens created for an identity before a time given. |
| ExchangeTeamsUserAccessToken  | Exchange an Azure Active Directory (Azure AD) access token of a Teams user for a new Communication Identity access token with a matching expiration time.|

:::image type="content" source="./media/acs-auth-metrics.png" alt-text="Authentication Request Metric.":::

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


### Network Traversal API requests

The following operations are available on Network Traversal API request metrics:

| Operation / Route    | Description                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| IssueRelayConfiguration       | Issue configuration for an STUN/TURN server. |

:::image type="content" source="./media/acs-turn-metrics.png" alt-text="TURN Token Request Metric." lightbox="./media/acs-turn-metrics.png":::


All API request metrics contain three dimensions that you can use to filter your metrics data. These dimensions can be aggregated together using the `Count` aggregation type and support all standard Azure Aggregation time series including `Sum`, `Average`, `Min`, and `Max`.

@@ -122,6 +122,44 @@ The following operations are available on Network Traversal API request metrics:

:::image type="content" source="./media/acs-turn-metrics.png" alt-text="TURN Token Request Metric." lightbox="./media/acs-turn-metrics.png":::

### Email Service Delivery Status Updates
The `Email Service Delivery Status Updates` metric lets the email sender track SMTP and Enhanced SMTP status codes and get an idea of how many hard bounces they are encountering.

The following dimensions are available on the `Email Service Delivery Status Updates` metric:

| Dimension    | Description                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| Result       | High level status of the message delivery: Success, Failure. |
| MessageStatus       | Terminal state of the Delivered, Failed, Suppressed. Emails are suppressed when a user sends an email to an email address that is known not to exist. Sending emails to addresses that do not exist trigger a hard bounce. |
| IsHardBounce       | True when a message delivery failed due to a hard bounce or if an item was suppressed due to a previous hard bounce. |
| SenderDomain       | The domain portion the the senders email address. |
| SmtpStatusCode       | Smpt error code from for failed deliveriess. |
| EnhancedSmtpStatusCode       | The EnhancedSmtpStatusCode status code will be emitted if it is available. This status code provides additional details not available with the SmtpStatusCode. |

:::image type="content" source="./media/acs-email-delivery-status-hardbounce-metrics.png" alt-text="Email Delivery Status Update Metric - IsHardBounce.":::
:::image type="content" source="./media/acs-email-delivery-status-smtp-metrics.png" alt-text="Email Delivery Status Update Metric - SmptStatusCode.":::

### Email Service API requests

The follow operations are available for the `Email Service API Requests` metric. These standard dimensions are supported: StatusCode, StatusCodeClass, StatusCodeReason and Operation.

| Operation    | Description                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| SendMail       | Email Send API. |
| GetMessageStatus       | Get the delivery status of a messageId. |

:::image type="content" source="./media/acs-email-api-resquest-metrics.png" alt-text="Email API Request Metric.":::

### Email User Engagement

The `Email Service User Engagement` metric is supported with HTML type emails and must be opted into on your Domains resource. These dimensions are available for `Email Service User Engagement` metrics:

| Dimension    | Description                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| EngagementType       | Type of interaction performed by the reciever of the email. |

:::image type="content" source="./media/acs-email-user-engagement-metrics.png" alt-text="Email User Engagement Metric.":::

## Next steps

- Learn more about [Data Platform Metrics](../../azure-monitor/essentials/data-platform-metrics.md)
