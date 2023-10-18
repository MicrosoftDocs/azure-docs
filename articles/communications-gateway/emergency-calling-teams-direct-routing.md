---
title: Emergency calling for Microsoft Teams Direct Routing with Azure Communications Gateway
description: Understand Azure Communications Gateway's support for emergency calling with Microsoft Teams Direct Routing
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: conceptual
ms.date: 10/09/2023
ms.custom: template-concept
---

# Emergency calling for Microsoft Teams Direct Routing with Azure Communications Gateway

Azure Communications Gateway supports Microsoft Teams Direct Routing subscribers making emergency calls from Microsoft Teams clients. This article describes how Azure Communications Gateway routes these calls to your network and the key facts you need to consider.

## Overview of emergency calling with Azure Communications Gateway

If a subscriber uses a Microsoft Teams client to make an emergency call and the subscriber's number is associated with Azure Communications Gateway, Microsoft Phone System routes the call to Azure Communications Gateway. The call has location information encoded in a PIDF-LO (Presence Information Data Format Location Object) SIP body.

Azure Communications Gateway routes emergency calls to your network with this PIDF-LO location information unaltered. It is your responsibility to:

- Ensure that these emergency calls are properly routed to an appropriate Public Safety Answering Point (PSAP).
- Configure the SIP trunks to Azure Communications Gateway in your tenant to support PIDF-LO. You typically set this configuration when you [set up Direct Routing support](connect-teams-direct-routing.md#connect-your-tenant-to-azure-communications-gateway).

For more information on how Microsoft Teams handles emergency calls, see [the Microsoft Teams documentation on managing emergency calling](/microsoftteams/what-are-emergency-locations-addresses-and-call-routing) and the [considerations for Direct Routing](/microsoftteams/considerations-direct-routing).

## Emergency numbers and location information

Azure Communications Gateway identifies emergency calls based on the dialing strings configured when you [deploy Azure Communications Gateway](deploy.md). These strings are also used by Microsoft Teams to identify emergency calls.

Microsoft Teams always sends location information on SIP INVITEs for emergency calls. This information can come from:

- [Dynamic locations](/microsoftteams/configure-dynamic-emergency-calling), based on the location of the client used to make the call.
  - Enterprise administrators must add physical locations associated with network connectivity into the Location Information Server (LIS) in Microsoft Teams.
  - When Microsoft Teams clients make an emergency call, they obtain their physical location based on their network location.
- Static locations that your customers assign.

## ELIN support for Direct Routing (preview)

ELIN (Emergency Location Identifier Number) is the traditional method for signaling dynamic emergency location information for networks that don't support PIDF-LO. With Direct Routing, the Microsoft Phone System can add an ELIN (a phone number) representing the location to the message body. If ELIN support (preview) is configured, Azure Communications Gateway replaces the caller's number with this phone number when forwarding the call to your network. The Public Safety Answering Point (PSAP) can then look up this number to identify the location of the caller.

> [!IMPORTANT]
> If you require ELIN support (preview), discuss your requirements with a Microsoft representative.

## Next steps

- Learn about [the key concepts in Microsoft Teams emergency calling](/microsoftteams/what-are-emergency-locations-addresses-and-call-routing).
- Learn about [dynamic emergency calling in Microsoft Teams](/microsoftteams/configure-dynamic-emergency-calling).
