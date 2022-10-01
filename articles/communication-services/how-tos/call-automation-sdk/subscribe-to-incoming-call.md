---
title: Subscribe to IncomingCall for Call Automation
titleSuffix: An Azure Communication Services how-to guide
description: Learn how to subscribe to the IncomingCall event from Event Grid for the Call Automation SDK
author: jasonshave
ms.author: jassha
ms.service: azure-communication-services
ms.subservice: call-automation
ms.topic: how-to 
ms.date: 09/26/2022
ms.custom: template-how-to
---

# Subscribe to IncomingCall for Call Automation

> [!IMPORTANT]
> Functionality described on this document is currently in private preview. Private preview includes access to SDKs and documentation for testing purposes that are not yet available publicly. Apply to become an early adopter by filling out the form for [preview access to Azure Communication Services](https://aka.ms/ACS-EarlyAdopter).

As described in the [Incoming Call concepts guide](../../concepts/voice-video-calling/incoming-call-notification.md), your Event Grid subscription to the `IncomingCall` notification is critical to using the Call Automation SDK for scenarios involving answering, redirecting, or rejecting a call.

## Choosing the right subscription

Event Grid offers several choices for receiving events including Azure Functions, Azure Service Bus, or simple HTTP/S web hooks. Thinking about how the Call Automation platform functions, we rely on web hook callbacks for mid-call events such as `CallConnected`, `CallTransferAccepted`, or `PlayCompleted` as a few examples. The most optimal choice would be to use a **Webhook** subscription since you need a web API for the mid-call events anyway.

> [!IMPORTANT]
> When using a Webhook subscription, you must undergo a validation of your web service endpoint as per [the following Event Grid instructions.](../../../event-grid/webhook-event-delivery.md)

## Prerequisites

- An Azure account with an active subscription.
- A deployed [Communication Service resource](../../quickstarts/create-communication-resource.md) and valid Connection String
- The [ARMClient application](https://github.com/projectkudu/ARMClient), used to configure the Event Grid subscription.

## Configure an Event Grid subscription

> [!NOTE]
> The following steps will not be necessary once the `IncomingCall` event is published to the Event Grid portal.

1. Locate and copy the following to be used in the armclient command-line statement below:
    - Azure subscription ID
    - Resource group name

    On the picture below you can see the required fields:

    :::image type="content" source="./media/portal.png" alt-text="Screenshot of Communication Services resource page on Azure portal.":::

2. Communication Service resource name
3. Determine your local development HTTP port used by your web service application.
4. Start your web service making sure you've followed the steps outlined in the above note regarding validation of your Webhook from Event Grid.
5. Since the `IncomingCall` event isn't yet published in the Azure portal, you must run the following command-line statements to configure your subscription:

    ``` console
    armclient login

    armclient put "/subscriptions/<your_azure_subscription_guid>/resourceGroups/<your_resource_group_name>/providers/Microsoft.Communication/CommunicationServices/<your_acs_resource_name>/providers/Microsoft.EventGrid/eventSubscriptions/<subscription_name>?api-version=2022-06-15" "{'properties':{'destination':{'properties':{'endpointUrl':'<your_ngrok_uri>'},'endpointType':'WebHook'},'filter':{'includedEventTypes': ['Microsoft.Communication.IncomingCall']}}}" -verbose

    ```

### How do you know it worked?

1. Click on the **Events** section of your Azure Communication Services resource.
2. Locate your subscription and check the **Provisioning state** making sure it says **Succeeded**.

    :::image type="content" source="./media/subscription-validation.png" alt-text="Event Grid Subscription Validation":::

>[!IMPORTANT]
> If you use the Azure portal to modify your Event Grid subscription by adding or removing an event or by modifying any aspect of the subscription such as an advanced filter, the `IncomingCall` subscription will be removed. This is a known issue and will only exist during Private Preview. Use the above command-line statements to simply recreate your subscription if this happens.

## Next steps
> [!div class="nextstepaction"]
> [Build a Call Automation application](../../quickstarts/voice-video-calling/callflows-for-customer-interactions.md)
> [Redirect an inbound PSTN call](../../how-tos/call-automation-sdk/redirect-inbound-telephony-calls.md)
