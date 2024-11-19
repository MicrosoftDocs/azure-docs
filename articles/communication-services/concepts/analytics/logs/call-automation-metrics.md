---
title: Call automation metrics definitions for Azure Communication Service
titleSuffix: An Azure Communication Services concept document
description: This document covers definitions of call automation metrics available in the Azure portal.
author: mkhribech
services: azure-communication-services
ms.author: mkhribech
ms.date: 06/23/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: data
---
# Call automation metrics overview

Azure Communication Services currently provides metrics for all Communication Services primitives.

## Where to find metrics

Primitives in Communication Services emit metrics for API requests and callback events. To find these metrics, see the **Metrics** tab under your Communication Services resource. You can also create permanent dashboards by using the workbooks tab under your Communication Services resource.

## Metric definitions

All API request metrics contain three dimensions that you can use to filter your metrics data.
- **Operation**: All operations or routes that can be called on the Communication Services CallAutomation.
- **Status Code**: The status code response sent after the request.
- **StatusSubClass**: The status code series sent after the response.

APIs like [Call Automation](../../../concepts/call-automation/call-automation), used to program calling workflows, work with async operations in an action-event driven programming model. In this case, an API request results in a response indicating whether your request was accepted and later a webhook event, published to callback URI you specify. These webhook events are published after the request has been processed and contain info on result of the action. eg. AddPArticipant API results in an API response and later an AddParticipantSucceeded or AddParticipantFailed event. Developers can use the metric for these events to monitor and raise alerts for failing scenarios. The metric can be filtered on following dimensions:
- **EventTypeName**: The callback event type name.
- **Code**: The status code of the callback event.
- **CodeClass**: The status code series of the callback event.
- **SubCode**: The sub code of the callback event.
- **Version**: The version of the callback event.

These dimensions can be aggregated together by using the `Count` aggregation type. They support all standard Azure Aggregation time series, including `Sum`, `Average`, `Min`, and `Max`.

For more information on supported aggregation types and time series aggregations, see [Advanced features of Azure Metrics Explorer](/azure/azure-monitor/essentials/metrics-charts#aggregation).

### Call Automation API requests

The following operations are available on Call Automation API request metrics.

| Operation/Route  | Description                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| Create Call           | Create an outbound call to user.
| Answer Call           | Answer an inbound call. |
| Redirect Call         | Redirect an inbound call to another user. |
| Reject Call           | Reject an inbound call. |
| Transfer Call To Participant   |  Transfer 1:1 call to another user.   |
| Play                  | Play audio to call participants.  |
| PlayPrompt            | Play a prompt to users as part of the Recognize action. |
| Recognize             | Recognize user input from call participants. |
| Add Participants      | Add a participant to a call.    |
| Remove Participants   | Remove a participant from a call.   |
| HangUp Call           | Hang up your call leg. |
| Terminate Call        | End the call for all participants.  |
| Get Call              | Get details about a call.     |
| Get Participant       | Get details on a call participant.   |
| Get Participants      | Get all participants in a call.   |
| Delete Call           | Delete a call.    |
| Cancel All Media Operations | Cancel all ongoing or queued media operations in a call. |

### Call Automation Callback Event

The following event type names are available on Call Automation Callback Event metrics.
Please refer to [here](../../../concepts/call-automation/call-automation#call-automation-webhook-events) for the list of callback event types covered by this metric.

The Code and SubCode values within the ResultInformation of a callback event indicate the status of an operation. These values are identical and can be used to determine the reason for an event, such as a call being disconnected. For details on specific disconnection reasons, refer to the list of codes provided at [Call end troubleshooting codes](../../../resources/troubleshooting/voice-video-calling/troubleshooting-codes.md?pivots=callend).


## Next steps

Learn more about [Data Platform Metrics](/azure/azure-monitor/essentials/data-platform-metrics).
