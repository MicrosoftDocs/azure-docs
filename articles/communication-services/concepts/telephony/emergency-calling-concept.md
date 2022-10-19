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

# Emergency Calling concept
[!INCLUDE [Emergency Calling Notice](../../includes/emergency-calling-notice-include.md)]

## Overview  

Azure Communication Calling SDK can be used to add Enhanced 911 dialing and Public Safety Answering Point (PSAP) call-back support to your applications in the United States (US) & Puerto Rico. The capability to dial 911 and receive a call-back may be a requirement for your application. Verify the E911 requirements with your legal counsel.

Calls to 911 are routed over the Microsoft network. Microsoft assigns a temporary phone number as the Call Line Identity (CLI) when 911 calls from the US & Puerto Rico are placed. Microsoft temporarily maintains a mapping of the phone number to the caller's identity. If there is a call-back from the PSAP, we route the call directly to the originating 911 caller. The caller can accept incoming PSAP call even if inbound calling is disabled.

The service is available for Microsoft phone numbers. It requires that the Azure resource from where the 911 call originates has a Microsoft-issued phone number enabled with outbound dialing (also referred to as ‘make calls').  

Azure Communication Services direct routing is currently in public preview and not intended for production workloads. So E911 dialing is out of scope for Azure Communication Services direct routing.

## The call flow

1. An Azure Communication Services user identity dials 911 using the Calling SDK from the USA or Puerto Rico
1. Microsoft validates the Azure resource has a Microsoft phone number enabled for outbound dialing
1. Microsoft Azure Communication Services 911 service replaces the user’s phone number `alternateCallerId` with a temporary unique phone number. This number allocation remains in place for at least 60 minutes from the time that 911 is first dialed
1. Microsoft maintains a temporary record (for approximately 60 minutes) of the user’s identity to the unique phone number
1. The 911 call will be first routed to a call center where an agent will request the caller’s address
1. The call center will then route the call to the appropriate PSAP in the USA or Puerto Rico
1. If the 911 call is unexpectedly dropped, the PSAP then makes a call-back to the user
1. On receiving the call-back within 60 minutes, Microsoft will route the inbound call directly to the user identity, which initiated the 911 call

## Enabling Emergency calling

Emergency dialing is automatically enabled for all users of the Azure Communication Client Calling SDK with an acquired Microsoft telephone number that is enabled for outbound dialing in the Azure resource. To use E911 with Microsoft phone numbers, follow the below steps:

1. Acquire a Microsoft phone number in the Azure resource of the client application (at least one of the numbers in the Azure resource must have the ability to ‘Make Calls’) 

1. Use the APIs in the calling SDK to set the country code of the user

    1. Microsoft uses the ISO 3166-1 alpha-2 standard

    1. Microsoft supports a country US and Puerto Rico ISO codes for 911 dialing

    1. If the country code is not provided to the SDK, the IP address is used to determine the country of the caller

        1. If the IP address cannot provide reliable geo-location, for example the user is on a Virtual Private Network, it is required to set the ISO Code of the calling country using the API in the Azure Communication Services Calling SDK. See example in the E911 quick start

        1. If users are dialing from a US territory (for example Guam, US Virgin Islands, Northern Marianas, or American Samoa), it is required to set the ISO code to the US

    1. If the caller is outside of the US and Puerto Rico, the call to 911 will not be permitted

1. When testing your application dial 933 instead of 911. 933 number is enabled for testing purposes; the recorded message will confirm the phone number the emergency call originates from. You should hear a temporary number assigned by Microsoft and is not the `alternateCallerId` provided by the application

1. Ensure your application supports [receiving an incoming call](../../how-tos/calling-sdk/manage-calls.md#receive-an-incoming-call) so call-backs from the PSAP are appropriately routed to the originator of the 911 call. To test inbound calling is working correctly, place inbound VoIP calls to the user of the Calling SDK

The Emergency service is temporarily free to use for Azure Communication Services customers within reasonable use, however, billing for the service will be enabled in 2022. Calls to 911 are capped at 10 concurrent calls per Azure resource.

## Emergency calling with Azure Communication Services direct routing

Emergency call is a regular call from a direct routing perspective. If you want to implement emergency calling with Azure Communication Services direct routing, you need to make sure that there is a routing rule for your emergency number (911, 112, etc.). You also need to make sure that your carrier processes emergency calls properly.
There is also an option to use purchased number as a caller ID for direct routing calls, in such case if there is no voice routing rule for emergency number, the call will fall back to Microsoft network, and we will treat it as a regular emergency call. Learn more about [voice routing fall back](./direct-routing-provisioning.md#voice-routing-considerations).

## Next steps

### Quickstarts

- [Call to Phone](../../quickstarts/telephony/pstn-call.md)
- [Add Emergency Calling to your app](../../quickstarts/telephony/pstn-call.md)