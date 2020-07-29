---
title: What is Azure Communication Services?
description: Learn how Azure Communication Services helps you develop rich user experiences with real-time communications.
author: mikben
manager: jken
services: azure-communication-services

ms.author: mikben
ms.date: 07/20/2020
ms.topic: overview
ms.service: azure-communication-services

---

# What is Azure Communication Services?

> [!IMPORTANT]
> Azure Communication Services is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure Communication Services (ACS) allows you to easily add real-time communications features to your applications.

When you use ACS, you're building on top of the same infrastructure that powers Microsoft Teams and the consumer Skype experience. These Azure native services seamlessly auto-scale for global deployments of any size. You can use ACS for voice, video, text, and data communication in a variety of scenarios:

- Browser-to-browser, browser-to-app, and app-to-app communication
- Humans engaging bots or other services
- Humans and bots engaging the public switched telephony network 

You can mix communication types intuitively, for example a single call may have end-users enjoying a browser application and interacting with end-users on traditional telephony devices. You can build services and applications to directly interact with the data plane of the voice, video, data, and text channels; for example using Azure Bots to support an interactive voice response systems (IVR).

## Scenarios 

In this section we introduce some scenarios you can build with ACS. The first step for using ACS is making a resource in the Azure portal or via Azure Resource Management APIs:

- **Quickstart:** [Create an Azure Communication Resource](./quickstarts/create-a-communication-resource.md)

### Browser communication
ACS JavaScript SDKs enable browser applications with rich text, voice, and video interaction. A typical browser application will include at least 2 components in addition to the ACS service:

 - **User Management Service**. This is a trusted service you operate for managing user accounts in ACS. This service uses ACS APIs to create ACS user access tokens and shares those tokens with endpoint devices so they can access ACS securely.
 - **Endpoint application**. This is the browser application you operate delivering end-user communication. This uses ACS SDKs to access the ACS data plane and accomplish real-time text, voice, and video communication.

![Browser architecture](./media/archdiagram-browser.png)

**Resources** 
- **Concept:** [Identity model](./concepts/identity-model.md)
- **Concept:** [User access tokens (UAT)](./concepts/user-access-tokens.md)
- **Quickstart:** [Implement browser voice chat](./quickstarts/get-started-with-voice.md)
- **Concept:** [Calling client samples](./concepts/calling-client-samples.md)

### Native app communication
Many scenarios are best served with native applications. ACS supports both browser-to-app and app-to-app communication. When building a native application experience you'll probably push notifications enabled, so users can receive calls even when the application is not running. ACS makes this easy with integrated push notifications to Google Firebase, Apple Push Notification Service, and Windows Push Notifications.

![Browser architecture](./media/archdiagram-app.png)

**Resources** 
- **Concept:** [Integrating push notifications](./concepts/notifications-azure-portal-registration.md)

### Humans communicating with bots and other service
ACS supports human-to-system communication though text and voice channels, with services directly access the ACS dataplane. For example you can have a bot answer incoming phone calls or participate in a web chat.

![Bot architecture](./media/archdiagram-bot.png)

### Voice and SMS over the public switched telephony network (PSTN)
Communicating over the phone system can dramatically increase the reach of your application. To support PSTN voice and SMS scenarios, ACS helps you acquire phone numbers quickly across a variety of geographies directly from the Azure portal or using REST APIs and SDKs.

![PSTN architecture](./media/archdiagram-pstn.png)

**Resources** 
- **Quickstart:** [Search and acquire a phone number](./quickstarts/search-and-aquire-phone-number.md)
- **Quickstart:** [Send an SMS message](./quickstarts/get-started-with-sms.md)
- **Quickstart:** [Place an outgoing telephone call](./quickstarts/get-started-with-phone.md)
- **Quickstart:** [Assigning a phone number to a bot](./quickstarts/assign-a-telephone-number-to-an-acs-bot.md)

### Networking 
You may want to exchange arbitrary data between users, for example to synchronize a shared mixed reality or gaming experience. The real-time dataplane used for text, voice, and video communication is available to you directly in two ways:

- **Calling SDK** - Devices in a call have access to APIs for sending and receiving data over the call channel. This is the easiest way to add data communication to an existing interaction.
- **STUN/TURN** - ACS makes standards-compliant STUN and TURN services available to you. This allows you to build a heavily customized transport layer on top of these standardized primitives. You can author your own standards-compliant client or use open-source libraries such as [WinRTC](https://github.com/microsoft/winrtc)


## Automation and Webhooks
You may want to configure automated workflows based on ACS activity, for example sending an email to an end-user when they are the recipient of a PSTN call. To support these scenarios ACS generates Azure Event Grid events. You can configure subscriptions to these events and use those subscriptions to fire customized webhooks and drive other automation. 

- [Concept: React to ACS Events using Event Grid](./concepts/acs-event-grid.md)

## Monitoring
You want to make sure that activity is reliably delivered and valid. Integration with Azure Monitor allows you to see visualization of application health, but also access logging data through Azure Data Explorer. 

- [Concept: Azure Monitor Logs](./concepts/logs-schema-list.md)

      
