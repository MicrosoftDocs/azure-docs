---
title: Build a customer interaction workflow using Call Automation
titleSuffix: An Azure Communication Services quickstart document
description: Quickstart on how to use Call Automation to answer a call, recognize DTMF input, and add a participant to a call.
author: ashwinder

ms.service: azure-communication-services
ms.topic: include
ms.date: 09/06/2022
ms.author: askaur
ms.custom: private_preview
services: azure-communication-services
zone_pivot_groups: acs-csharp-java
---

# Build a customer interaction workflow using Call Automation

> [!IMPORTANT]
> Functionality described on this document is currently in private preview. Private preview includes access to SDKs and documentation for testing purposes that are not yet available publicly. Apply to become an early adopter by filling out the form for [preview access to Azure Communication Services](https://aka.ms/ACS-EarlyAdopter).

In this quickstart, you'll learn how to build an application that uses the Azure Communication Services Call Automation SDK to handle the following scenario:
- handling the `IncomingCall` event from Event Grid
- answering a call
- playing an audio file
- adding a communication user to the call such as a customer service agent who uses a web application built using Calling SDKs to connect to Azure Communication Services

::: zone pivot="programming-language-csharp"
[!INCLUDE [Call flows for customer interactions with .NET](./includes/call-automation/Callflow-for-customer-interactions-csharp.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Call flows for customer interactions with Java](./includes/call-automation/Callflow-for-customer-interactions-java.md)]
::: zone-end

## Testing the application

1. Place a call to the number you acquired in the Azure portal (see prerequisites above).
2. Your Event Grid subscription to the `IncomingCall` should execute and call your web server.
3. The call will be answered, and an asynchronous web hook callback will be sent to the NGROK callback URI.
4. When the call is connected, a `CallConnected` event will be sent to your web server, wrapped in a `CloudEvent` schema and can be easily deserialized using the Call Automation SDK parser. At this point, the application will request audio to be played and input from a targeted phone number.
5. When the input has been received and recognized, the web server will make a request to add a participant to the call.

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../create-communication-resource.md#clean-up-resources).

## Next steps
- Learn more about [Call Automation](../../concepts/voice-video-calling/call-automation.md) and its features. 
- Learn how to [redirect inbound telephony calls](../../how-tos/call-automation-sdk/redirect-inbound-telephony-calls.md) with Call Automation.
- Learn more about [Play action](../../concepts/voice-video-calling/play-action.md).
- Learn more about [Recognize action](../../concepts/voice-video-calling/recognize-action.md).
