---
title: Incoming call concepts
titleSuffix: An Azure Communication Services concept document
description: Learn about Azure Communication Services IncomingCall notification
author: jasonshave

ms.service: azure-communication-services
ms.topic: include
ms.date: 09/26/2022
ms.author: jasonshave
ms.custom: private_preview
---

# Incoming call concepts

> [!IMPORTANT]
> Functionality described on this document is currently in private preview. Private preview includes access to SDKs and documentation for testing purposes that are not yet available publicly. Apply to become an early adopter by filling out the form for [preview access to Azure Communication Services](https://aka.ms/ACS-EarlyAdopter).

Azure Communication Services Call Automation provides developers the ability to build applications, which can make and receive calls. Azure Communication Services relies on Event Grid subscriptions to deliver each `IncomingCall` event, so setting up your environment to receive these notifications is critical to your application being able to redirect or answer a call.

## Calling scenarios

First, we need to define which scenarios can trigger an `IncomingCall` event. The primary concept to remember is that a call to an Azure Communication Services identity or Public Switched Telephone Network (PSTN) number will trigger an `IncomingCall` event. The following are examples of these resources:

1. An Azure Communication Services identity
2. A PSTN phone number owned by your Azure Communication Services resource

Given the above examples, the following scenarios will trigger an `IncomingCall` event sent to Event Grid:

| Source | Destination | 
| ------ | ----------- |
| Client calling SDK | Azure Communication Services identity |
| Client calling SDK | PSTN number owned by your Azure Communication Services resource  |
| Call Automation SDK | Azure Communication Services identity |
| Call Automation SDK | PSTN number owned by your Azure Communication Services resource  |
| Public PSTN | PSTN number owned by your Azure Communication Services resource  |

> [!NOTE]
> An important concept to remember is that an Azure Communication Services identity can be a user or application. Although there is no ability to explicitly assign an identity to a user or application in the platform, this can be done by your own application or supporting infrastructure. Please review the [identity concepts guide](../identity-model.md) for more information on this topic.

## Receiving an incoming call notification from Event Grid

Since Azure Communication Services relies on Event Grid to deliver the `IncomingCall` notification through a subscription, how you choose to handle the notification is up to you. Additionally, since the Call Automation API relies specifically on Webhook callbacks for events, a common Event Grid subscription used would be a 'Webhook'. However, you could choose any one of the available subscription types offered by the service.

This architecture has the following benefits:

- Using Event Grid subscription filters, you can route the `IncomingCall` notification to specific applications.
- PSTN number assignment and routing logic can exist in your application versus being statically configured online.
- As identified in the above [calling scenarios](#calling-scenarios) section, your application can be notified even when users make calls between each other. You can then combine this scenario together with the [Call Recording APIs](../voice-video-calling/call-recording.md) to meet compliance needs.

To subscribe to the `IncomingCall` notification from Event Grid, [follow this how-to guide](../../how-tos/call-automation-sdk/subscribe-to-incoming-call.md).

## Call routing

You can use advanced filters in your Event Grid subscription to route an `IncomingCall` notification to a specific endpoint such as a Webhook subscription. That endpoint application can then make a decision to **redirect** the call using the Call Automation SDK to another Azure Communication Services identity or to the PSTN.

If you need to 

