---
title: Emergency calling - Azure Communication Services
description: Learn how to implement Emergency Calling for PSTN in your Azure Communication Services application.
author: boris-bazilevskiy
manager: rcole
services: azure-communication-services

ms.author: rcole
ms.date: 11/30/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: pstn
---

# Emergency Calling concepts
[!INCLUDE [Emergency Calling Notice](../../includes/emergency-calling-notice-include.md)]

## Overview  

Azure Communication Calling SDK can be used to add Enhanced Emergency dialing and Public Safety Answering Point (PSAP) call-back support to your applications in the United States (US), Puerto Rico (PR), the United Kingdom (GB), and Canada (CA). The capability to dial 911 (in US, PR, and CA) and 999 or 112 (in GB) and receive a call-back may be a requirement for your application. Verify the Emergency Calling requirements with your legal counsel.

Calls to an emergency number are routed over the Microsoft network. Microsoft assigns a temporary phone number as the Call Line Identity (CLI) when an emergency call from the US, PR, GB, or CA are placed. Microsoft temporarily maintains a mapping of the phone number to the caller's identity. If there's a call-back from the PSAP, we route the call directly to the originating caller. The caller can accept incoming PSAP call even if inbound calling is disabled.

The service is available for Microsoft phone numbers. It requires that the Azure resource from where the emergency call originates has a Microsoft-issued phone number enabled with outbound dialing (also referred to as ‘make calls').  

Azure Communication Services direct routing is currently in public preview and not intended for production workloads, so emergency dialing is out of scope for Azure Communication Services direct routing.

## The call flow

1. An Azure Communication Services user identity dials emergency number using the Calling SDK from the USA or Puerto Rico
1. Microsoft validates the Azure resource has a Microsoft phone number enabled for outbound dialing
1. Microsoft Azure Communication Services emergency service replaces the user’s phone number `alternateCallerId` with a temporary unique phone number. This number allocation remains in place for at least 60 minutes from the time that emergency number is first dialed
1. Microsoft maintains a temporary record (for approximately 60 minutes) of the user’s identity to the unique phone number
1. In the US, PR, and CA the emergency call will be first routed to a call center where an agent will request the caller’s address. The call center will then route the call to the appropriate PSAP in a proper region
1. If the emergency call is unexpectedly dropped, the PSAP then makes a call-back to the user
1. On receiving the call-back within 60 minutes, Microsoft will route the inbound call directly to the user identity, which initiated the emergency call

## Enabling Emergency Calling

Emergency dialing is automatically enabled for all users of the Azure Communication Client Calling SDK with an acquired Microsoft telephone number that is enabled for outbound dialing in the Azure resource. To use emergency calling with Microsoft phone numbers, follow the steps:

1. Acquire a Microsoft phone number in the Azure resource of the client application (at least one of the numbers in the Azure resource must have the ability to ‘Make Calls’) 

1. Use the APIs in the calling SDK to set the country code of the user

    1. Microsoft uses the ISO 3166-1 alpha-2 standard

    1. Microsoft supports a country US, PR, GB, and CA ISO codes for emergency number dialing

    1. If the country code isn't provided to the SDK, the IP address is used to determine the country of the caller

        1. If the IP address can't provide reliable geo-location, for example the user is on a Virtual Private Network, it's required to set the ISO Code of the calling country using the API in the Azure Communication Services Calling SDK. See example in the emergency calling quick start

        1. If users are dialing from a US territory (for example Guam, US Virgin Islands, Northern Marianas, or American Samoa), it's required to set the ISO code to the US

    1. If the caller is outside of the supported countries, the call to 911 won't be permitted

1. When testing your application in the US, dial 933 instead of 911. 933 is enabled for testing purposes; the recorded message confirms the phone number the emergency call originates from. You should hear a temporary number assigned by Microsoft, which isn't the `alternateCallerId` provided by the application

1. Ensure your application supports [receiving an incoming call](../../how-tos/calling-sdk/manage-calls.md#receive-an-incoming-call) so call-backs from the PSAP are appropriately routed to the originator of the emergency call. To test inbound calling is working correctly, place inbound VoIP calls to the user of the Calling SDK

The Emergency service is temporarily free to use for Azure Communication Services customers within reasonable use, however, billing for the service will be enabled in 2022. Calls to 911 are capped at 10 concurrent calls per Azure resource.

## Emergency calling with Azure Communication Services direct routing

Emergency call is a regular call from a direct routing perspective. If you want to implement emergency calling with Azure Communication Services direct routing, you need to make sure that there's a routing rule for your emergency number (911, 112, etc.). You also need to make sure that your carrier processes emergency calls properly.
There's also an option to use purchased number as a caller ID for direct routing calls. In such case, if there's no voice routing rule for emergency number, the call falls back to Microsoft network, and we treat it as a regular emergency call. Learn more about [voice routing fall back](./direct-routing-provisioning.md#outbound-voice-routing-considerations).

## Next steps

### Quickstarts

- [Outbound call to a phone number](../../quickstarts/telephony/pstn-call.md)
- [Add Emergency Calling to your app](../../quickstarts/telephony/emergency-calling.md)