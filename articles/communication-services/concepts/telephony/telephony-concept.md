---
title: Public Switched Telephone Network (PSTN) integration concepts for Azure Communication Services
description: Learn how to integrate PSTN calling capabilities in your Azure Communication Services application.
author: boris-bazilevskiy
manager: nmurav
services: azure-communication-services

ms.author: henikaraa
ms.date: 06/22/2026
ms.topic: concept-article
ms.service: azure-communication-services
ms.subservice: pstn
---

# Telephony concepts

[!INCLUDE [Retirement and breaking changes](../../includes/acs-retirement-breakingchange-callout.md)]

[!INCLUDE [Regional Availability Notice](../../includes/regional-availability-include.md)]

Azure Communication Services Calling SDKs enable you to add telephony and Public Switched Telephone Network (PSTN) access to your applications. This page summarizes key telephony concepts and capabilities. See the [calling library](../../quickstarts/voice-video-calling/getting-started-with-calling.md) to learn more about specific SDK languages and capabilities.

<!-- [!INCLUDE [Survey Request](../includes/survey-request.md)] -->

## Telephony overview

Whenever your users interact with a traditional telephone number, the Public Switched Telephone Network (PSTN) voice calling handles the call. To make and receive PSTN calls, you need to add telephony capabilities to your Azure Communication Services resource. In this case, signaling and media use a combination of IP-based and PSTN-based technologies to connect your users. Going forward, Communication Services supports only Teams Phone connectivity. For more information about the retirement of the legacy telephony options (Azure Communication Services Direct Offer and Direct Routing), see [Azure Communication Services telephony retirement](https://aka.ms/acs-retirement).

### Teams Phone connectivity

As organizations increasingly adopt Microsoft Teams for their collaboration and communication needs, understanding the various PSTN connectivity options available becomes crucial. With Teams Phone, you have three primary options:

1. **Calling Plans** are an all-in-the-cloud solution in which Microsoft acts as your PSTN carrier. Calling Plans are the simplest option, ideal for organizations that don't need to retain their current PSTN carrier. By using Calling Plans, you get Teams Phone with added Domestic or International Calling Plans for your solution to reach phone numbers around the world.

   This option doesn't require any on-premises deployment or maintenance. For more information, see [Microsoft Teams Calling Plans](/microsoftteams/calling-plans-for-office-365).

   :::image type="content" source="../interop/tpe/media/teams-phone-extensibility-teams-calling-plans.png" alt-text="Diagram shows the simplest solution Teams Phone system with Calling Plan using Microsoft as a public switched telephone network (PSTN) carrier."  lightbox="../interop/tpe/media/teams-phone-extensibility-teams-calling-plans.png":::

2. **Operator Connect** enables you to bring your existing PSTN carrier into the Microsoft Teams environment. If your carrier participates in the Microsoft Operator Connect program, they can manage PSTN calling and Session Border Controllers (SBCs) for you.

   Operator Connect provides a fully managed service with no hardware footprint. This option is a great choice for organizations that want to maintain their existing PSTN infrastructure while using Teams. For more information, see [Plan for Operator Connect](/microsoftteams/operator-connect-plan).

   :::image type="content" source="../interop/tpe/media/teams-phone-extensibility-teams-operator-connect.png" alt-text="Diagram shows Teams Operator Connect using a public switched telephone network (PSTN) and Session Border Controller as a Service (SBCaaS) through Teams Phone / Teams Admin Center to connect your operators."  lightbox="../interop/tpe/media/teams-phone-extensibility-teams-operator-connect.png":::

3. **Direct Routing** enables you to use your own PSTN carrier by connecting your SBCs to Teams Phone. Direct Routing offers the most flexibility, enabling you to design a solution that fits complex environments or manage a multi-step migration.

   Direct Routing is suitable for organizations that need to retain their current PSTN carrier and have specific requirements for interoperability with third-party private branch exchanges (PBXs), analog devices, and other telephony equipment. For more information, see [Plan Direct Routing](/microsoftteams/direct-routing-plan).

   :::image type="content" source="../interop/tpe/media/teams-phone-extensibility-voice-solution-with-direct-routing.png" alt-text="Diagram shows Teams Direct Routing. It features Teams users on Microsoft 365 through on premises session border controller (SBC), phone number ranges, and third party private branch exchange (PBX) / telephony equipment connecting to a telephony trunk and public switched telephone network (PSTN)."  lightbox="../interop/tpe/media/teams-phone-extensibility-voice-solution-with-direct-routing.png":::

If you answer **yes** to the following questions, then Teams Phone connectivity options are the right solution for you:

- Teams Phone services are available in your region.
- You want Microsoft‑managed PSTN access through Calling Plans, prefer simplified onboarding with Operator Connect, or want to bring your own carrier and connect your SBC.
- You plan to integrate contact center or advanced workflows by using Teams Phone Extensibility (TPE).


## Next steps

- Learn more about [Teams Phone Extensibility](../interop/tpe/teams-phone-extensibility-overview.md).
- Learn more about [how to migrate from Azure Communication Services phone numbers to Teams Phone numbers](migrate-to-teams-phone.md).
- Learn about the [call automation API](../call-automation/call-automation.md) that you can use to build server-based calling workflows that control and manage PSTN calls.
- [Outbound call to a phone number](../../quickstarts/telephony/pstn-call.md).
- [Use call automation to build calling workflow that can place calls to phone numbers, play voice prompts and more](../../quickstarts/call-automation/quickstart-make-an-outbound-call.md).
