---
title: Azure Communication Services Call Automation how-to for PSTN calls
titleSuffix: An Azure Communication Services how-to document
description: Provides a how-to for redirecting inbound telephony calls with Call Automation.
author: ashwinder

ms.service: azure-communication-services
ms.topic: include
ms.date: 09/06/2022
ms.author: askaur
ms.custom: private_preview
services: azure-communication-services
zone_pivot_groups: acs-csharp-java
---

# Redirect inbound telephony calls with Call Automation
> [!IMPORTANT]
> Functionality described on this document is currently in private preview. Private preview includes access to SDKs and documentation for testing purposes that are not yet available publicly.
> Apply to become an early adopter by filling out the form for [preview access to Azure Communication Services](https://aka.ms/ACS-EarlyAdopter).

Get started with Azure Communication Services by using the Call Automation SDKs to build automated calling workflows that listen for and manage inbound calls placed to a phone number or received via Direct Routing.

## Obtain your connection string

From the Azure portal, locate your Communication Service resource and click on the Keys section to obtain your connection string.

:::image type="content" source="./../../quickstarts/voice-video-calling/media/call-automation/key.png" alt-text="Screenshot of Communication Services resource page on portal to access keys.":::

## Create Event Grid subscription for Incoming Call

Follow [this how-to guide](../../how-tos/call-automation-sdk/subscribe-to-incoming-call.md) to create your Event Grid subscription for the `IncomingCall` event.

::: zone pivot="programming-language-csharp"
[!INCLUDE [Redirect inbound call with .NET](./includes/redirect-inbound-telephony-calls-csharp.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Redirect inbound call with Java](./includes/redirect-inbound-telephony-calls-java.md)]
::: zone-end

## Testing the application

1. Place a call to the number you acquired in the Azure portal (see prerequisites above).
2. Your Event Grid subscription to the IncomingCall should execute and call your web server.
3. The call will be redirected to the endpoint(s) you specified in your application.

Since this call flow involves a redirected call instead of answering it, pre-call web hook callbacks to notify your application the other endpoint accepted the call aren't published.

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../../quickstarts/create-communication-resource.md#clean-up-resources).

## Next steps

- Learn more about [Call Automation](../../concepts/voice-video-calling/call-automation.md) and its features. 
- Learn more about [Play action](../../concepts/voice-video-calling/play-Action.md).
- Learn how to build a [call workflow](../../quickstarts/voice-video-calling/callflows-for-customer-interactions.md) for a customer support scenario. 