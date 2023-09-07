---
title: Emergency Calling with Azure Communications Gateway
description: Understand Azure Communications Gateway's support for emergency calling
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: conceptual
ms.date: 01/09/2023
ms.custom: template-concept
---

# Emergency calling for Operator Connect and Teams Phone Mobile with Azure Communications Gateway

Azure Communications Gateway supports Operator Connect and Teams Phone Mobile subscribers making emergency calls from Microsoft Teams clients. This article describes how Azure Communications Gateway routes these calls to your network and the key facts you'll need to consider.

## Overview of emergency calling with Azure Communications Gateway

If a subscriber uses a Microsoft Teams client to make an emergency call and the subscriber's number is associated with Azure Communications Gateway, Microsoft Phone System routes the call to Azure Communications Gateway. The call has location information encoded in a PIDF-LO (Presence Information Data Format Location Object) SIP body.

Unless you choose to route emergency calls directly to an Emergency Routing Service Provider (US only), Azure Communications Gateway routes emergency calls to your network with this PIDF-LO location information unaltered. It is your responsibility to ensure that these emergency calls are properly routed to an appropriate Public Safety Answering Point (PSAP). For more information on how Microsoft Teams handles emergency calls, see [the Microsoft Teams documentation on managing emergency calling](/microsoftteams/what-are-emergency-locations-addresses-and-call-routing#considerations-for-operator-connect).

Microsoft Teams always sends location information on SIP INVITEs for emergency calls. This information can come from several sources, all supported by Azure Communications Gateway:

- [Dynamic locations](/microsoftteams/configure-dynamic-emergency-calling), based on the location of the client used to make the call.
  - Enterprise administrators must add physical locations associated with network connectivity into the Location Information Server (LIS) in Microsoft Teams.
  - When Microsoft Teams clients make an emergency call, they obtain their physical location based on their network location.
- Static locations that you assign to numbers.
  - The Operator Connect API allows you to associate numbers with locations that enterprise administrators have already configured in the Microsoft Teams Admin Center as part of uploading numbers.
  - Azure Communications Gateway's Number Management Portal also allows you to associate numbers with locations during upload. You can also manage the locations associated with numbers after the numbers have been uploaded.
- Static locations that your enterprise customers assign. When you upload numbers, you can choose whether enterprise administrators can modify the location information associated with each number.

> [!NOTE]
> If you are taking responsibility for assigning static locations to numbers, note that enterprise administrators must have created the locations within the Microsoft Teams Admin Center first.

Azure Communications Gateway identifies emergency calls based on the dialing strings configured when you [deploy the Azure Communications Gateway resource](deploy.md). These strings will also be used by Microsoft Teams to identify emergency calls.

## Emergency calling in the United States

Within the United States, Microsoft Teams supports the Emergency Routing Service Providers (ERSPs) listed in the ["911 service providers" section of the list of Session Border Controllers certified for Direct Routing)](/microsoftteams/direct-routing-border-controllers). Azure Communications Gateway has been certified to interoperate with these ERSPs.

You must route emergency calls to one of these ERSPs. If your network doesn't support PIDF-LO SIP bodies, Azure Communications Gateway can route emergency calls directly to your chosen ERSP. You must arrange this routing with your onboarding team.

## Emergency calling with Teams Phone Mobile

For Teams Phone Mobile subscribers, Azure Communications Gateway routes emergency calls from Microsoft Teams clients to your network in the same way as other originating calls. The call includes location information in accordance with the [emergency call considerations for Teams Phone Mobile](/microsoftteams/what-are-emergency-locations-addresses-and-call-routing#considerations-for-teams-phone-mobile).

Your network must not route emergency calls from native dialers to Azure Communications Gateway or Microsoft Teams.

## Next steps

- Learn about [the key concepts in Microsoft Teams emergency calling](/microsoftteams/what-are-emergency-locations-addresses-and-call-routing).
- Learn about [dynamic emergency calling in Microsoft Teams](/microsoftteams/configure-dynamic-emergency-calling).
