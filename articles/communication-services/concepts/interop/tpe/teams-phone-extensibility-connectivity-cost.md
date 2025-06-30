---
title: Cost and Connectivity Options for Teams Phone extensibility 
titleSuffix: An Azure Communication Services article
description: This article describes available PSTN connectivity options and costs for Teams Phone extensibility.
author: henikaraa
ms.service: azure-communication-services
ms.subservice: pstn
ms.date: 05/20/2025
ms.topic: conceptual
ms.author: henikaraa
ms.custom: public_preview
services: azure-communication-services
---

# Cost and connectivity options for Teams Phone extensibility

[!INCLUDE [public-preview-notice.md](../../../includes/public-preview-include-document.md)]

Effective communication is essential for success in today's fast-paced business environment. Choosing the right public switched telephone network (PSTN) connectivity option for your organization's communication needs can significantly improve efficiency, reduce cost, and raise overall performance.

As organizations increasingly adopt Microsoft Teams for their collaboration and communication needs, understanding the various PSTN connectivity options available becomes crucial. This article explores your options for Teams Phone extensibility and provides guidance on selecting the best fit for your specific requirements. Options include Calling Plans, Operator Connect, and Direct Routing.

This article also explores the business model for Teams Phone extensibility. We offer insights into cost estimation and the associated services, helping you make informed decisions to optimize your communication infrastructure.

## PSTN connectivity options for Teams Phone extensibility

There are three primary options available:

1. **Calling Plans** are an all-in-the-cloud solution in which Microsoft acts as your PSTN carrier. Calling Plans are the simplest option, ideal for organizations that doesn't need to retain their current PSTN carrier. With Calling Plans, you get Teams Phone with added Domestic or International Calling Plans for your solution to reach phone numbers around the world.

   This option doesn't require any on-premises deployment or maintenance. For more information, see [Microsoft Teams Calling Plans](/microsoftteams/calling-plans-for-office-365).

   :::image type="content" source="./media/teams-phone-extensibility-teams-calling-plans.png" alt-text="Diagram shows the simplest solution Teams Phone system with Calling Plan using Microsoft as a public switched telephone network (PSTN) carrier."  lightbox="./media/teams-phone-extensibility-teams-calling-plans.png":::

2. **Operator Connect** enables you to bring your existing PSTN carrier into the Microsoft Teams environment. If your carrier participates in the Microsoft Operator Connect program, they can manage PSTN calling and Session Border Controllers (SBCs) for you.

   Operator Connect provides a fully managed service with no hardware footprint. This option is a great choice for organizations that want to maintain their existing PSTN infrastructure while using Teams. For more information, see [Plan for Operator Connect](/microsoftteams/operator-connect-plan).

   :::image type="content" source="./media/teams-phone-extensibility-teams-operator-connect.png" alt-text="Diagram shows Teams Operator Connect using a public switched telephone network (PSTN) and Session Border Controller as a Service (SBCaaS) through Teams Phone / Teams Admin Center to connect your operators."  lightbox="./media/teams-phone-extensibility-teams-operator-connect.png":::

3. **Direct Routing** enables you to use your own PSTN carrier by connecting your SBCs to Teams Phone. Direct Routing offers the most flexibility, enabling you to design a solution that fits complex environments or manage a multi-step migration.

   Direct Routing is suitable for organizations that need to retain their current PSTN carrier and have specific requirements for interoperability with third-party private branch exchanges (PBXs), analog devices, and other telephony equipment. For more information, see [Plan Direct Routing](/microsoftteams/direct-routing-plan).

   :::image type="content" source="./media/teams-phone-extensibility-voice-solution-with-direct-routing.png" alt-text="Diagram shows Teams Direct Routing. It features Teams users on Microsoft 365 through on premises session border controller (SBC), phone number ranges, and third party private branch exchange (PBX) / telephony equipment connecting to a telephony trunk and public switched telephone network (PSTN)."  lightbox="./media/teams-phone-extensibility-voice-solution-with-direct-routing.png":::

### How to choose a connectivity option

Choosing the best PSTN connectivity solution for Teams Phone extensibility depends on several factors. You need to consider the availability of services in your region, your existing infrastructure, and your specific needs.

- **Availability**: Find out if the PSTN connectivity option is available in your country. For example, Microsoft Calling Plans are available in specific regions, and Operator Connect requires your existing carrier to participate in the program. Make sure that the option you choose is supported in your location.

   Teams provides the Calling Plans option in multiple countries. For more information and the up-to-date list, see [Country/region availability for Calling Plans](/microsoftteams/calling-plan-overview).

   Microsoft Teams also offers the option to use integration with 105 operators worldwide using the Operator Connect option. For more information and the current list, see [Modern Work for Partners - Operator Directory](https://cloudpartners.transform.microsoft.com/partner-gtm/operators/directory).

   For the most flexible option, use Teams Direct Routing. You can connect your SBC to almost any telephony trunk or interconnect with third party PSTN equipment. This flexibility enables you to deploy your solution in any region or country. Remember that you need to configure the solution correctly for optimal performance and compliance with local regulations. For more information, see [Configure Direct Routing for Microsoft Teams](/microsoftteams/direct-routing-configure).

- **Existing Infrastructure**: Consider your current telephony setup. If you have an existing PSTN carrier and infrastructure that you want to retain, either Direct Routing or Operator Connect might be the best option. If you prefer a fully managed, cloud-based solution with minimal on-premises requirements, Calling Plans could be the ideal choice.

- **Specific Needs**: Evaluate your organization's specific needs. For example, do you need international calling, how complex is your telephony environment, and how much control do you require over your PSTN connectivity. Direct Routing offers the most flexibility and control, while Calling Plans provide simplicity and ease of use.

## Estimate Teams Phone extensibility cost

The Teams Phone Extensibility business model for independent software vendors (ISVs) includes charging contact center as a service (CCaaS) vendors for using Azure Communication Services SDKs. This model includes Calling SDK and VoIP consumption, which require charges for each leg between the call automation bot and the CCaaS agent.

This solution also includes Audio Insights with access to mixed/unmixed audio streams or direct transcriptions. Using transcription incurs an [Azure AI Speech pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/) for the selected Azure resource and Call Recording with pay-as-you-go for mixed/unmixed AV recordings. You can review current pricing for VoIP, transcription, and recording at [Azure Communication Services pricing](https://azure.microsoft.com/pricing/details/communication-services/).

End users can take advantage of their Teams Calling plans or any of the connectivity options for PSTN usage with inbound / outbound and any associated extra usage. Users must enable the required Teams licenses including Teams Phone License for any agent involved in the call including SMEs, and Resource Account license for the provisioned Teams resource account. For more information, see [Microsoft Teams Phone - Cloud Phone System](https://www.microsoft.com/microsoft-teams/microsoft-teams-phone).

## Related articles

- [Teams Phone extensibility overview](./teams-phone-extensibility-overview.md)
- [Teams Phone extensibility FAQ](./teams-phone-extensibility-faq.md)