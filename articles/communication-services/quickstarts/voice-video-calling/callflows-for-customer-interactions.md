---
title: Azure Communication Services Call Automation API tutorial for VoIP calls
titleSuffix: An Azure Communication Services tutorial document
description: Tutorial on how to use Call Automation to build call flow for customer interactions.
author: ashwinder

ms.service: azure-communication-services
ms.topic: include
ms.date: 09/06/2022
ms.author: askaur
ms.custom: private_preview
services: azure-communication-services
zone_pivot_groups: acs-csharp-java
---

# Tutorial: Build call workflows for customer interactions

> [!IMPORTANT]
> Functionality described on this document is currently in private preview. Private preview includes access to SDKs and documentation for testing purposes that are not yet available publicly.
> Apply to become an early adopter by filling out the form for [preview access to Azure Communication Services](https://aka.ms/ACS-EarlyAdopter).

In this tutorial, you'll learn how to build applications that use Azure Communication Services Call Automation to handle common customer support scenarios, such as:
- receiving notifications for incoming calls to a phone number using Event Grid
- answering the call and playing an audio file using Call Automation SDK
- adding a communication user to the call using Call Automation SDK. This user can be a customer service agent who uses a web application built using Calling SDKs to connect to Azure Communication Services


::: zone pivot="programming-language-csharp"
[!INCLUDE [Call flows for customer interactions with .NET](./includes/call-automation/Callflow-for-customer-interactions-csharp.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Call flows for customer interactions with Java](./includes/call-automation/Callflow-for-customer-interactions-java.md)]
::: zone-end

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../create-communication-resource.md#clean-up-resources).

## Next steps
- Learn more about [Call Automation](../../concepts/voice-video-calling/call-automation.md) and its features. 
- Learn how to [manage inbound telephony calls](../telephony/Manage-Inbound-Calls.md) with Call Automation.
- Learn more about [Play action](../../concepts/voice-video-calling/Play-Action.md).
