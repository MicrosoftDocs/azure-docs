---
title: Emergency calling - Azure Communication Services
description: Learn how to implement emergency calling for PSTN in your Azure Communication Services application.
author: boris-bazilevskiy
manager: rcole
services: azure-communication-services
ms.author: rcole
ms.date: 07/20/2023
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: pstn
---

# Emergency calling concepts

[!INCLUDE [Emergency Calling Notice](../../includes/emergency-calling-notice-include.md)]

You can use the Azure Communication Services Calling SDK to add Enhanced Emergency dialing and Public Safety Answering Point (PSAP) callback support to your applications in the United States (US), Puerto Rico (PR), the United Kingdom (GB), Canada (CA), and Denmark (DK). The capability to dial 911 (in US, PR, and CA), to dial 112 (in DK), and to dial 999 or 112 (in GB) and receive a callback might be a requirement for your application. Verify the emergency calling requirements with your legal counsel.

Calls to an emergency number are routed over the Microsoft network. Microsoft assigns a temporary phone number as the Call Line Identity (CLI) when a user places an emergency call from US, PR, GB, CA, or DK. Microsoft temporarily maintains a mapping of the phone number to the caller's identity.

If there's a callback from the PSAP, Microsoft routes the call directly to the originating caller. The caller can accept the incoming PSAP call even if inbound calling is disabled.

The service is available for Microsoft phone numbers. It requires the Azure resource that the emergency call originates from to have a Microsoft-issued phone number enabled with outbound dialing (also known as *make calls*).

## Call flow

1. An Azure Communication Services user identity dials an emergency number by using the Calling SDK from US or PR.
1. Microsoft validates that the Azure resource has a Microsoft phone number enabled for outbound dialing.
1. The Microsoft Azure Communication Services emergency service replaces the user's phone number (the `alternateCallerId` value) with a temporary unique phone number. This number allocation remains in place for at least 60 minutes from the time that the emergency number is dialed.
1. Microsoft maintains a temporary record (for about 60 minutes) that maps the unique phone number to the user identity.
1. In US, PR, and CA, the emergency call is first routed to a call center where an agent requests the caller's address. The call center then routes the call to the appropriate PSAP in the correct country or region.
1. If the emergency call is unexpectedly dropped, the PSAP makes a callback to the user.
1. On receiving the callback within 60 minutes, Microsoft routes the inbound call directly to the user identity that initiated the emergency call.

## Enabling emergency calling

Emergency calling is automatically enabled for all users of the Azure Communication Services Calling SDK with an acquired Microsoft telephone number that's enabled for outbound dialing in the Azure resource. To use emergency calling with Microsoft phone numbers, follow these steps:

1. Acquire a Microsoft phone number in the Azure resource of the client application. At least one of the numbers in the Azure resource must have the ability to *make calls*.

1. Use the APIs in the Calling SDK to set the country/region code of the caller. Consider the following points and requirements:

    - Microsoft uses the ISO 3166-1 alpha-2 standard for country/region codes.

    - Microsoft supports US, PR, GB, CA, and DK country/region codes for emergency number dialing.

    - If you don't provide the country/region code to the SDK, Microsoft uses the IP address to determine the country or region of the caller.

      If the IP address can't provide reliable geolocation (for example, the caller is on a virtual private network), you must set the ISO code of the calling country or region by using the API in the Azure Communication Services Calling SDK. See the example in the [quickstart for adding emergency calling](../../quickstarts/telephony/emergency-calling.md).

    - If the caller is dialing from a US territory (for example, Guam, US Virgin Islands, Northern Mariana Islands, or American Samoa), you must set the ISO code to US.

    - If the caller is outside the supported countries or regions, the call to 911 won't be permitted.

1. When you test your application in the United States, dial 933 instead of 911. The 933 number is enabled for testing purposes. 

   The recorded message confirms the phone number that the emergency call originates from. You should hear a temporary number that Microsoft has assigned. This number isn't the `alternateCallerId` value that the application provides.

1. Ensure that your application supports [receiving an incoming call](../../how-tos/calling-sdk/manage-calls.md#receive-an-incoming-call) so that callbacks from the PSAP are appropriately routed to the originator of the emergency call. To test that inbound calling is working correctly, place inbound Voice over IP (VoIP) calls to the user of the Calling SDK.

For information about billing for the emergency service in Azure Communication Services, see the [pricing page](https://azure.microsoft.com/pricing/details/communication-services/).

## Emergency calling with direct routing

From the perspective of direct routing, an emergency call is a regular call. If you want to implement emergency calling with Azure Communication Services direct routing, make sure that there's a routing rule for your emergency number (for example, 911 or 112). Also make sure that your carrier processes emergency calls properly.

There's also an option to use a purchased number as a caller ID for direct routing calls. In such a case, if there's no voice routing rule for an emergency number, the call falls back to the Microsoft network, and Microsoft treats it as a regular emergency call. [Learn more about voice routing fallback](./direct-routing-provisioning.md#outbound-voice-routing-considerations).

## Next steps

Try these quickstarts:

- [Outbound call to a phone number](../../quickstarts/telephony/pstn-call.md)
- [Add emergency calling to your app](../../quickstarts/telephony/emergency-calling.md)