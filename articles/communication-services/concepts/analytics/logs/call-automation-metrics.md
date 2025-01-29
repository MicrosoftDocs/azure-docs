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

Call Automation operates on asynchronous operations in an action-event driven programming model. An API request results in an immediate response indicating whether the request was accepted. Subsequently, a webhook event is published to a callback URI that you specify. These webhook events are triggered after the request has been processed and contains information about the outcome of the action. For instance, the AddParticipant API will return an initial response and later trigger either an AddParticipantSucceeded or AddParticipantFailed event. 

Call Automation publishes metrics for both the API request/response and the corresponding webhook events for developers to monitor the API health and configure alerts for failing scenarios. 

This document describes the two metrics and various dimensions you can use to filter your metrics data. These dimensions can be aggregated together by using the `Count` aggregation type. They support all standard Azure Aggregation time series, including `Sum`, `Average`, `Min`, and `Max`.

For more information on supported aggregation types and time series aggregations, see [Advanced features of Azure Metrics Explorer](/azure/azure-monitor/essentials/metrics-charts#aggregation).

### Call Automation API requests

API request metric is published for all generally available [operations](../../../concepts/call-automation/call-automation.md#call-actions). This metric contains three dimensions that you can use to filter your metrics data.
- **Operation**: All operations or routes that can be called on Call Automation.
- **Status Code**: The status code response sent for this request.
- **StatusSubClass**: The status code series.

### Call Automation Callback Event

Refer to [list](../../../concepts/call-automation/call-automation.md#call-automation-webhook-events) of all the callback event types covered by this metric.

The metric can be filtered on following dimensions:
- **EventTypeName**: The callback event type name.
- **Code**: The status code of the callback event.
- **CodeClass**: The status code series of the callback event.
- **SubCode**: The sub code of the callback event.
- **Version**: The version of the callback event.
  
The Code and SubCode values are published in the metric as well as the callback event published to your callback URI. These values can be used to determine the reason for an event, such as a call being disconnected. For more details on codes published and what they mean, refer to [troubleshooting guide](../../../resources/troubleshooting/voice-video-calling/troubleshooting-codes.md).


## Next steps

Learn more about [Data Platform Metrics](/azure/azure-monitor/essentials/data-platform-metrics).
