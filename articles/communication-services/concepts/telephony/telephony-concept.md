---
title: Public Switched Telephone Network (PSTN) integration concepts for Azure Communication Services
description: Learn how to integrate PSTN calling capabilities in your Azure Communication Services application.
author: boris-bazilevskiy
manager: nmurav
services: azure-communication-services

ms.author: bobazile
ms.date: 06/22/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: pstn
---

# Telephony concepts

[!INCLUDE [Regional Availability Notice](../../includes/regional-availability-include.md)]

Azure Communication Services Calling SDKs can be used to add telephony and Public Switched Telephone Network access to your applications. This page summarizes key telephony concepts and capabilities. See the [calling library](../../quickstarts/voice-video-calling/getting-started-with-calling.md) to learn more about specific SDK languages and capabilities.

## Overview of telephony
Whenever your users interact with a traditional telephone number, calls are facilitated by PSTN (Public Switched Telephone Network) voice calling. To make and receive PSTN calls, you need to add telephony capabilities to your Azure Communication Services resource. In this case, signaling and media use a combination of IP-based and PSTN-based technologies to connect your users. Communication Services provides two discrete ways to reach the PSTN network: Voice Calling (PSTN) and Azure direct routing.

### Voice Calling (PSTN)

An easy way of adding PSTN connectivity to your app or service, in such case, Microsoft is your telco provider. You can buy numbers directly from Microsoft. Azure Cloud Calling is an all-in-the-cloud telephony solution for Communication Services. It is the simplest option that connects Communication Services to the Public Switched Telephone Network (PSTN) to enable calls to landlines and mobile phones worldwide. Microsoft acts as your PSTN carrier, as shown in the following diagram:

![Voice Calling (PSTN) diagram.](../media/telephony-concept/azure-calling-diagram.png)

If you answer ‘yes’ to the following, then Voice Calling (PSTN) is the right solution for you:
- Voice Calling (PSTN) is available in your region.
- You do not need to retain your current PSTN carrier.
- You want to use Microsoft-managed access to the PSTN.

With this option:
- You get numbers directly from Microsoft and can call phones around the world.
- You do not require deployment or maintenance of an on-premises deployment—because Voice Calling (PSTN) operates out of Azure Communication Services.
- Note: If necessary, you can choose to connect a supported Session Border Controller (SBC) through Azure direct routing for interoperability with third-party PBXs, analog devices, and other third-party telephony equipment supported by the SBC.

This option requires an uninterrupted connection to Azure Communication Services.  

For cloud calling, outbound calls are billed at per-minute rates depending on the target country/region. See the [current rate list for PSTN calls](https://github.com/Azure/Communication/blob/master/pricing/communication-services-pstn-rates.csv).

### Azure direct routing

With this option, you can connect legacy on-premises telephony and your carrier of choice to Azure Communication Services. It provides PSTN calling capabilities to your Communication Services application even if Voice Calling (PSTN) is not available in your country/region. 

![Azure direct routing diagram.](../media/telephony-concept/sip-interface-diagram.png)

If you answer ‘yes’ to any of the following questions, then Azure direct routing is the right solution for you:

- You want to use Communication Services with PSTN calling capabilities.
- You need to retain your current PSTN carrier.
- You want to mix routing, with some calls going through Voice Calling (PSTN), some through your carrier.
- You need to interoperate with third-party PBXs and/or equipment such as overhead pagers, analog devices, and so on.

With this option:

- You connect your own supported SBC to Azure Communication Services without the need for extra on-premises software.
- You can use literally any telephony carrier with Communication Services.
- You can choose to configure and manage this option, or it can be configured and managed by your carrier or partner (ask if your carrier or partner provides this option).
- You can configure interoperability between your telephony equipment, such as a third-party PBX and analog devices, and Communication Services.

This option requires:

- Uninterrupted connection to Azure.
- Deploying and maintaining a supported SBC.
- A contract with a third-party carrier. (Unless deployed as an option to provide a connection to third-party PBX, analog devices, or other telephony equipment for users who are on Communication Services.)

## Next steps

### Conceptual documentation

- [Phone number types in Azure Communication Services](./plan-solution.md)
- [Plan for Azure direct routing](./direct-routing-infrastructure.md)
- [Session Border Controllers certified for Azure Communication Services direct routing](./certified-session-border-controllers.md)
- [Pricing](../pricing.md)
- Learn about [call automation API](../call-automation/call-automation.md) that enables you to build server-based calling workflows to control and manage calls for phone numbers and direct routing

### Quickstarts

- [Get a phone number](../../quickstarts/telephony/get-phone-number.md)
- [Outbound call to a phone number](../../quickstarts/telephony/pstn-call.md)
- [Use call automation to build calling workflow that can place calls to phone numbers, play voice prompts and more](../../quickstarts/call-automation/quickstart-make-an-outbound-call.md)