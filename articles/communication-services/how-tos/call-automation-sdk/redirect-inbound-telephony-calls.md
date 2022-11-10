---
title: Azure Communication Services Call Automation how-to for redirecting inbound PSTN calls
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

::: zone pivot="programming-language-csharp"
[!INCLUDE [Redirect inbound call with .NET](./includes/redirect-inbound-telephony-calls-csharp.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Redirect inbound call with Java](./includes/redirect-inbound-telephony-calls-java.md)]
::: zone-end

## Subscribe to IncomingCall event

IncomingCall is an Azure Event Grid event for notifying incoming calls to your Communication Services resource. To learn more about it, see [this guide](../../concepts/voice-video-calling/incoming-call-notification.md). 
1. Navigate to your resource on Azure portal and select `Events` from the left side menu.
1. Select `+ Event Subscription` to create a new subscription. 
1. Filter for Incoming Call event. 
1. Choose endpoint type as web hook and provide the public url generated for your application by ngrok. Make sure to provide the exact api route that you programmed to receive the event previously. In this case, it would be <ngrok_url>/api/incomingCall. 
1. Select create to start the creation of subscription and validation of your endpoint as mentioned previously. The subscription is ready when the provisioning status is marked as succeeded. 

This subscription currently has no filters and hence all incoming calls will be sent to your application. To filter for specific phone number or a communication user, use the Filters tab.

## Testing the application

1. Place a call to the number you acquired in the Azure portal (see prerequisites above).
2. Your Event Grid subscription to the IncomingCall should execute and call your application.
3. The call will be redirected to the endpoint(s) you specified in your application.

Since this call flow involves a redirected call instead of answering it, pre-call web hook callbacks to notify your application the other endpoint accepted the call aren't published.

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../../quickstarts/create-communication-resource.md#clean-up-resources).

## Next steps

- Learn more about [Call Automation](../../concepts/voice-video-calling/call-automation.md) and its features. 
- Learn about [Play action](../../concepts/voice-video-calling/play-Action.md) to play audio in a call.
- Learn how to build a [call workflow](../../quickstarts/voice-video-calling/callflows-for-customer-interactions.md) for a customer support scenario. 