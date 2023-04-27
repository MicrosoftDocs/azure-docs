---
title: Build a customer interaction workflow using Call Automation
titleSuffix: An Azure Communication Services quickstart document
description: Quickstart on how to use Call Automation to answer a call, recognize DTMF input, and add a participant to a call.
author: ashwinder

ms.service: azure-communication-services
ms.topic: include
ms.date: 09/06/2022
ms.author: askaur
ms.custom: public_preview
services: azure-communication-services
zone_pivot_groups: acs-csharp-java
---

# Build a customer interaction workflow using Call Automation

[!INCLUDE [Public Preview Notice](../../includes/public-preview-include.md)]

In this quickstart, you'll learn how to build an application that uses the Azure Communication Services Call Automation SDK to handle the following scenario:
- handling the `IncomingCall` event from Event Grid
- answering a call
- playing an audio file and recognizing input(DTMF) from caller
- adding a communication user to the call such as a customer service agent who uses a web application built using Calling SDKs to connect to Azure Communication Services

::: zone pivot="programming-language-csharp"
[!INCLUDE [Call flows for customer interactions with .NET](./includes/callflow-for-customer-interactions-csharp.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Call flows for customer interactions with Java](./includes/callflow-for-customer-interactions-java.md)]
::: zone-end

## Subscribe to IncomingCall event

IncomingCall is an Azure Event Grid event for notifying incoming calls to your Communication Services resource. To learn more about it, see [this guide](../../concepts/call-automation/incoming-call-notification.md). 
1. Navigate to your resource on Azure portal and select `Events` from the left side menu.
2. Select `+ Event Subscription` to create a new subscription.
3. Filter for Incoming Call event.
4. Choose endpoint type as web hook and provide the public url generated for your application by ngrok. Make sure to provide the exact api route that you programmed to receive the event previously. In this case, it would be <ngrok_url>/api/incomingCall.

    ![Screenshot of portal page to create a new event subscription.](./media/event-susbcription.png)

    If your application does not send 200Ok back to Event Grid in time, Event Grid will use exponential backoff retry to send the incoming call event again. However, an incoming call only rings for 30 seconds, and acting on a call after that will not work. To avoid retries after a call expires, we recommend setting the retry policy in the `Additional Features` tab as: Max Event Delivery Attempts to 2 and Event Time to Live to 1 minute. Learn more about retries [here](../../../event-grid/delivery-and-retry.md).
5. Select create to start the creation of subscription and validation of your endpoint as mentioned previously. The subscription is ready when the provisioning status is marked as succeeded.

This subscription currently has no filters and hence all incoming calls will be sent to your application. To filter for specific phone number or a communication user, use the Filters tab.

## Testing the application

1. Place a call to the number you acquired in the Azure portal.
2. Your Event Grid subscription to the `IncomingCall` should execute and call your application that will request to answer the call. 
3. When the call is connected, a `CallConnected` event will be sent to your application's callback url. At this point, the application will request audio to be played and to receive input from the caller.
4. From your phone, press any three number keys, or press one number key and then # key. 
5. When the input has been received and recognized, the application will make a request to add a participant to the call.
6. Once the added user answers, you can talk to them. 


## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../create-communication-resource.md#clean-up-resources).

## Next steps
- Learn more about [Call Automation](../../concepts/call-automation/call-automation.md) and its features. 
- Learn how to [redirect inbound telephony calls](../../quickstarts/call-automation/redirect-inbound-telephony-calls.md) with Call Automation.
- Learn more about [Play action](../../concepts/call-automation/play-action.md).
- Learn more about [Recognize action](../../concepts/call-automation/recognize-action.md).
