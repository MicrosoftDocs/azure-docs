---
title: Teams Phone extensibility FAQ
titleSuffix: An Azure Communication Services article
description: This article describes most common asked questions about Teams Phone extensibility.
author: henikaraa
manager: chpalm
ms.service: azure-communication-services
ms.subservice: teams-interop
ms.date: 05/20/2025
ms.topic: conceptual
ms.author: henikaraa
ms.custom: public_preview
services: azure-communication-services
---

# Teams Phone extensibility FAQ

This article answers frequently asked questions about the Teams Phone extensibility (TPE).

[!INCLUDE [public-preview-notice.md](../../../includes/public-preview-include-document.md)]

## Can I use an Azure Communication Services phone number to place and receive PSTN calls for TPE scenarios?

No, the Teams Phone extensibility calls are designed to use Teams Phone and associated public switched telephone network (PSTN) connectivity. Specifically, we currently only support Teams Phone service numbers assigned to resource accounts.

## How does inbound call routing work in TPE?

Inbound PSTN calls to the phone number assigned to the Teams Resource Account triggers an **Incoming Call** Event Grid notification to the configured endpoint in the Azure Communication Services Resource. This Resource is linked to the RA during provisioning. The CCaaS server-side application then uses the Call Automation SDK to answer the call.

## What are the benefits from having OBO instead of direct outbound calling?

Using a resource account for outbound calls ensures that the customer sees the company’s caller ID and potentially a name, maintaining a professional image and consistent branding. Using a resource account also enables the server application to have greater control over which numbers agent can call, enhancing operational efficiency and ensuring compliance with organizational policies.

## What do we offer for emergency calling?

TPE enhances emergency calling support by enabling agents to dial emergency services, provide their static address location, alert security desks, and receive callbacks from a Public Safety Answering Point (PSAP). Configure emergency calling support using shared calling policies assigned to the user and the Resource Account. Teams admins configure these policies in the Teams Admin Center (TAC) portal or with PowerShell cmdlets.

## Where do you support Emergency Calling?

This feature is available in all supported countries by Microsoft Teams for user calling. For the list of supported countries, see [Emergency call routing for Calling Plans](/microsoftteams/emergency-calling-availability).

## Which Microsoft Teams licenses are required for Teams users who want to benefit from TPE based solutions?

- Teams Phone License: Required essential for any agent using either a CCaaS client based on Azure Communication Services Calling SDK or a Teams client. The Teams Phone license enables the use of Teams Phone capabilities.
- Resource Account License: Included in the Teams Phone license and is necessary for managing resource accounts used in call automation and other functionalities.
- Enterprise Voice: Users must be Enterprise Voice enabled to ensure they can make and receive calls using the Teams Phone system.
- Calling Plan (or similar connectivity option): Applies to customers making outbound calls.

## What is Dual Persona or Multi Persona?

Agents often use multiple clients on their desktops. Typically, a CCaaS client for the contact center, and a Teams client for UCaaS. Some customers prefer to use the Standard Teams Client for both UCaaS and CCaaS calls. Personas (CCaaS & UCaaS) enable Teams Admins and independent software vendor (ISV) developers to determine which endpoints calls can be placed from or answered to.

Microsoft Teams customers using multi-persona support for TPE can now segregate their work and their calls between different Teams clients. For example, a user might have a Teams client for internal business to business collaboration, while the same user might also have a CCaaS client extended with Teams for customer care.

## Is VoIP calling supported for Teams Phone extensibility?

For the initial GA launch of this project, we support only PSTN inbound and outbound calls. Support for incoming VoIP calls is planned for a future release.

## What are the supported connectivity options?

Teams users need to ensure they enable one of the following options: Teams calling plans, Operator Connect, or Direct Routing. Enabling at least one option ensures that they can make and receive PSTN calls.

## Can we expect a new business model for Teams Phone extensibility?

The business model for TPE is consistent with Azure Communication Services regular business model. ISVs or developers are charged on pay-as-you-go model to benefit from Azure Communication Services Calling SDK for Custom Teams Endpoint (CTE) pricing per minute. When customers consume Azure Consumer Services recording, AI Action API, or any other value added service. For more information, see [Azure Communication Services pricing](https://azure.microsoft.com/pricing/details/communication-services/). Developers aren't charged for the PSTN usage because it uses the Teams users connectivity plans and licenses.

## How can I monitor and debug calling issues?

For TPE calls, we provide access to telemetry details similar to what is offered on Azure today for regular Azure Communication Services calls. These details include [Call Summary](/azure/azure-monitor/reference/tables/acscallsummary), [Call Diagnostics](/azure/azure-monitor/reference/tables/acscalldiagnostics), and what is available on the Teams admin center. You can also differentiate between Azure Communication Services and Teams Phone extensibility calls.

## How can I report issues related to TPE calls?

If the developer or ISV has issues related to Azure Communication Services SDKs or services such as Call Automation, Calling SDK, or Call Recording, follow existing support process at [https://aka.ms/ACS-Support](https://aka.ms/ACS-Support).

For questions and issues related to Teams experience or PSTN connectivity, you can follow regular Teams support options and available help resources available at [https://support.microsoft.com/teams](https://support.microsoft.com/teams). If you're part of the Teams Contact Center Certification program, you can refer to the existing support channels.

## Do I need to be Teams Contact Center Certified vendor in order to start building and selling TPE solutions?

While it's not mandatory to be certified in order to start building solutions, we recommend Teams Contact Center Certification for Teams Phone extensibility. We announced a new contact center integration model dedicated for this new architecture. For more information, see [Unify Integration Model](/microsoftteams/teams-contact-center?tabs=unify).

## What are the benefits of being Teams Contact Center Certified?

  - We recommend Teams Contact Center Certification to ensure stable overall Teams Phone extensibility experience.
  - Organizations and customers using certified solutions for Microsoft Teams trust the certification as an assurance that the partner solutions are tested and verified. Certification assures customers that you provide the quality, compatibility, and reliability they expect from Microsoft solutions, backed by best-in-class product maintenance, service operations, and support.
  - A lack of certification makes it difficult for users to identify which apps are evaluated and approved for use with Teams in context of TPE.

## Related articles

- [Teams Phone extensibility overview](./teams-phone-extensibility-overview.md)
- [Teams Phone System extensibility quickstart](../../../quickstarts/tpe/teams-phone-extensibility-quickstart.md)
- [Cost and connectivity options](teams-phone-extensibility-connectivity-cost.md)
