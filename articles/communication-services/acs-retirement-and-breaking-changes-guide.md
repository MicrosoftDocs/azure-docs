---
title: Retirement and breaking changes guide for Azure Communication Services
description: Central guidance for ACS retirements and breaking changes with timelines, support phases, and migration paths.
author: anujb-msft
manager: anujbh
services: azure-communication-services

ms.author: anujbh
ms.date: 08/18/2026
ms.topic: overview
ms.service: azure-communication-services
---
# Retirement and breaking changes guide for Azure Communication Services

## Guide contents

- [What's changing and why?](#whats-changing-and-why)
- [Retirement](#retirement)
- [Breaking changes](#breaking-changes)
- [Impacted services and SDKs](#impacted-services-and-sdks)
- [Services not impacted](#services-not-impacted)
- [Migration recommendations](#migration-recommendations)
- [General FAQ](#general-faq)
  - [Resource reporting tools](#resource-reporting-tools)
  - [Requirements and options](#requirements-and-options)
  - [Support during the transition](#support-during-the-transition)
  - [Resources, data, and compliance](#resources-data-and-compliance)
  - [Pricing and licensing](#pricing-and-licensing)
  - [Communications and notifications](#communications-and-notifications)
- [Retired services FAQ](#retired-services-faq)
  - [ACS Number Management (Direct Offer)](#acs-number-management-direct-offer)
  - [ACS Email](#acs-email)
  - [ACS SMS](#acs-sms)
  - [ACS Advanced Messaging (WhatsApp)](#acs-advanced-messaging-whatsapp)
  - [ACS Chat](#acs-chat)
  - [ACS Rooms](#acs-rooms)
  - [ACS UI Library (mobile and web)](#acs-ui-library-mobile-and-web)
  - [ACS Job Router](#acs-job-router)
  - [ACS Direct Routing](#acs-direct-routing)
- [Breaking changes FAQ](#breaking-changes-faq)
  - [ACS Voice and Video Calling SDK](#acs-voice-and-video-calling-sdk)
  - [ACS Call Diagnostics](#acs-call-diagnostics)
  - [ACS Call Automation](#acs-call-automation)
  - [ACS call recording](#acs-call-recording)
  - [ACS Audio Streaming](#acs-audio-streaming)
  - [ACS closed captions](#acs-closed-captions)
- [Get help and support](#get-help-and-support)
  - [Create an Azure support request](#create-an-azure-support-request)
  - [Post a question to Microsoft Q&A](#post-a-question-to-microsoft-qa)

**Action required:** To prevent disruption to your workloads, review this guide and plan your transition for impacted **Azure Communication Services (ACS)** services and SDKs before **September 30, 2028**. Microsoft announced these retirement and breaking changes in **September 2026**. See the [Impacted Services and SDKs](#impacted-services-and-sdks) table for impacted services.

---

## What's changing and why?

> [!NOTE]
> Beginning October 23, 2026, new customers can't sign up for **Azure Communication Services retiring services**. Customers with an Azure Communication Services resource created before October 23, 2026, can continue using their existing resources and retiring services to support current business workloads during the transition period.

Microsoft announced the retirement of Azure Communication Services (ACS) as a standalone offering, effective September 30, 2028. This decision reflects our evolving strategy to prioritize deeply integrated communication experiences within Microsoft platforms, specifically Teams, Dynamics 365, and Azure, while working with leading Communications Platform as a Service (CPaaS) providers to fill gaps and accelerate innovation for Azure customers.

The products listed in this document fall into one of two categories:

- **Retired**: The product, service, or SDK won't be available after **September 30, 2028**.
- **Breaking Change**: The product, service, or SDK remains available, but changes to its functionality or support requirements might require you to modify existing applications. Follow [Azure updates | Microsoft Azure](https://azure.microsoft.com/updates/) for product changes.

Refer to the [Impacted Services and SDKs](#impacted-services-and-sdks) table to determine which category applies to each ACS product.

---

## Retirement

**What is the impact of retirement?**

Retirement means a service, feature, model, or SDK is permanently removed from Azure and isn't available after **September 30, 2028**. This condition applies even when you use the retired product with other supported services described in this guide.

After **September 30, 2028**, retired services aren't supported and can't be used. API and SDK operations that depend on retired services might return errors indicating that the operation isn't supported.

---

## Breaking changes

**What do breaking changes mean?**

A breaking change is a modification to a product, service, or SDK that requires changes to existing applications or integrations. Unlike retired products, services affected by a breaking change will **continue to exist and remain available** after **September 30, 2028**. However, customers will need to update their applications, integrations, or usage patterns to remain in a supported configuration.


**What is the impact of the breaking changes?**

After **September 30, 2028**, ACS services affected by breaking changes will remain available, but they will be supported only when used with a supported Teams-aligned service. Standalone ACS scenarios that don't integrate with Teams, including human-to-human and application-to-human communications, will no longer be supported. To maintain support, update your applications to use the new SDKs and one of the Teams-aligned services described in this guide.

To continue receiving support, applications must use one of the following Teams-aligned services:

- Microsoft Teams Phone Extensibility (TPE)
- Microsoft Teams Meeting Interoperability
- Microsoft Teams Click-2-Call for Teams Voice Apps

**How do I identify which SDKs contain the breaking changes?**

SDKs that contain breaking changes will indicate the change with a new major version number, such as version 4.x.x instead of 3.x.x. If you plan to use an affected service after September 30, 2028, you must update to the latest major version of the SDK. The updated SDKs will be available in the GitHub repository and package manager for each affected service.


---

## Impacted services and SDKs

| Breaking Changes | Retired |
|---|---|
| - ACS Voice/Video Calling SDK<br>- ACS Call Diagnostics<br>- ACS Call Automation<br>- ACS Audio Streaming<br>- ACS Call Recording<br>- ACS Closed Captions | - ACS Email<br>- ACS SMS<br>- ACS Advanced Messaging with WhatsApp<br>- ACS Chat<br>- ACS Chat for Teams Meeting Interop<br>- ACS Rooms<br>- ACS Number Management (Direct Offer)<br>- ACS Direct Routing<br>- ACS Job Router<br>- ACS Web UI Library SDK<br>- ACS Mobile UI Library SDK |

---

## Services not impacted
The following integrated solutions are supported scenarios:
- Microsoft Teams: Teams Interop, Teams Phone, and Teams Phone Extensibility (TPE)
- Microsoft Foundry: Speech capabilities will be enhanced and integrated within Microsoft Foundry

---

## Migration recommendations

| Service | Change type | Microsoft alternatives or supported scenarios | Requirements | Third-Party Partner Alternatives (listed in alphabetical order) |
|---|---|---|---|---|
| Email | Retirement | Microsoft 365 High Volume Email (HVE) (internal), Exchange Online (EXO) | Microsoft 365 license | [Infobip](https://marketplace.microsoft.com/en-us/product/infobipdoo.infobip_cpaas), [Telesign](https://marketplace.microsoft.com/en-us/product/telesigncorporation1779799505747.telesign-communications-suite-azure?tab=Overview) |
| SMS | Retirement | - | - | [Infobip](https://marketplace.microsoft.com/en-us/product/infobipdoo.infobip_cpaas), [Telesign](https://marketplace.microsoft.com/en-us/product/telesigncorporation1779799505747.telesign-communications-suite-azure?tab=Overview) |
| Chat (including Teams interoperability) | Retirement | [Microsoft Graph Chat APIs](acs-chat-to-graph-chat-migration-guide.md) | Teams license | [Infobip](https://marketplace.microsoft.com/en-us/product/infobipdoo.infobip_cpaas) |
| WhatsApp (Advanced Messaging) | Retirement | Dynamics 365 Contact Center | Dynamics 365 license | [Infobip](https://marketplace.microsoft.com/en-us/product/infobipdoo.infobip_cpaas), [Telesign](https://marketplace.microsoft.com/en-us/product/telesigncorporation1779799505747.telesign-communications-suite-azure?tab=Overview) |
| PSTN (Direct Offer) | Retirement | Teams Phone Extensibility, Teams Calling Plan, Teams Direct Routing, Operator Connect | Teams and Teams Phone licenses | [Infobip](https://marketplace.microsoft.com/en-us/product/infobipdoo.infobip_cpaas), [Telesign](https://marketplace.microsoft.com/en-us/product/telesigncorporation1779799505747.telesign-communications-suite-azure?tab=Overview) |
| Direct Routing | Retirement | Teams Phone Extensibility, Teams Direct Routing | Teams and Teams Phone licenses | [Infobip](https://marketplace.microsoft.com/en-us/product/infobipdoo.infobip_cpaas), [Telesign](https://marketplace.microsoft.com/en-us/product/telesigncorporation1779799505747.telesign-communications-suite-azure?tab=Overview) |
| ACS Rooms | Retirement | Teams Meeting interoperability, Microsoft Graph APIs | Teams license | [Infobip](https://marketplace.microsoft.com/en-us/product/infobipdoo.infobip_cpaas), [Telesign](https://marketplace.microsoft.com/en-us/product/telesigncorporation1779799505747.telesign-communications-suite-azure?tab=Overview) |
| UI Library (Web and Mobile) | Retirement | - | - | - |
| Job Router | Retirement | Dynamics 365 Contact Center | - | [Luware](https://aka.ms/acs-luware), [Talkdesk](https://aka.ms/acs-talkdesk) |
| Voice and Video Calling SDK | Breaking change | Teams Meeting interoperability | SDK change; applicable Teams license | [Infobip](https://marketplace.microsoft.com/en-us/product/infobipdoo.infobip_cpaas), [Telesign](https://marketplace.microsoft.com/en-us/product/telesigncorporation1779799505747.telesign-communications-suite-azure?tab=Overview) |
| Call Automation | Breaking change | Teams Phone Extensibility for documented Call Automation scenarios; see the [Teams integration scenario matrix](#call-automation-scenario-matrix) | SDK change; applicable Teams and Teams Phone licenses, resource-account configuration, and PSTN connectivity | - |


<br></br>

---

## General FAQ
### Resource reporting tools
**How do I identify which subscriptions are using Azure Communication Services?**

| Tool | How to access | Customer / Field use |
|---|---|---|
| **Azure Advisor Recommendation** | Azure portal > Advisor > Recommendations > Operational Excellence | Customers see personalized retirement recommendations in the portal and [Azure Advisor documentation](/azure/advisor/advisor-overview). |
| **Azure Advisor Workbook** | Azure portal > Advisor > Service Retirement | Customers can track service retirements for their resources and export the results to CSV. |
| ACS Resource Explorer Agent | [ACS Resource Explorer](https://github.com/microsoft/acs-resource-explorer) | Using Copilot, customers can scan subscriptions by primitive or service and use the agent to identify impacted resources and migration paths. |
| Azure Cost Management & Billing Portal | Azure portal > Cost Management + Billing | Customers can see resource usage in the Cost Management portal and [Cost Management Portal](../cost-management-billing/manage/view-all-accounts.md). |


### Requirements and options

**What happens if I don't transition to a supported workload?**

Update your application by September 30, 2028. After that date, standalone ACS workloads that don't integrate with a supported Teams-aligned service will no longer be supported. Retired services and SDKs will no longer be available.


Review the third-party alternatives in the [Migration Recommendations](#migration-recommendations) table, or explore other communications providers on the [Microsoft Marketplace](https://marketplace.microsoft.com/).

Listed in alphabetical order:

- [Infobip](https://aka.ms/acs-infobip)
- [Luware](https://aka.ms/acs-luware)
- [Talkdesk](https://aka.ms/acs-talkdesk)
- [Telesign](https://aka.ms/acs-telesign)

**How are Dynamics 365 customers who use ACS affected?**

For information about the impact on Dynamics 365 workloads that use ACS capabilities such as SMS, Calling, and WhatsApp, see the [Dynamics 365 ACS retirement guide](https://aka.ms/acs-d365-migration).

### Support during the transition

**What kind of support, security, and bug fix updates can developers expect during the 2-year retirement phase?**

  Customers will continue to receive support, security updates, and bug fix support in accordance with their Azure support plan and applicable terms of service throughout the two-year period following the notification date.

  No immediate action is required. If you need technical assistance, wish to report an issue, or would like to submit a security or bug related request during this period, you may do so by creating a support ticket here: 
https://aka.ms/acs-retirement-support

**Will my existing ACS SDKs continue to work during the 2-year retirement period or do I need to upgrade to specific versions?**

  During the retirement period, existing SDK versions will continue to function and will remain supported during the 2-year retirement period. For services that incur breaking changes, ACS will also provide a new major-version SDK and developers will have until September 30, 2028 to migrate to the new SDKs to prevent loss of functionality to continue receiving support.

**How will Microsoft support updates to ACS SDKs during the retirement period? For example, changes to upstream dependencies (e.g. Fluent, React, .NET, etc.) and underlying system updates (Chrome, iOS, Android, Windows, etc.) be handled?**

  From September 2026 through September 30, 2028, Microsoft treats these updates as break-fix problems. [Break fix](https://azure.microsoft.com/support/legal/faq) problems are technical problems you might experience while using Azure services. To request a fix for upstream changes in dependencies, please file a [support ticket.](https://aka.ms/acs-retirement-support)

**My product has breaking changes. What kind of support can I expect when I file a support ticket?**

  For services with breaking changes, customers can request break-fix support and ask questions by filing a [support ticket](https://aka.ms/acs-retirement-support). Support continues during the retirement period in accordance with your specific [support plan](https://azure.microsoft.com/support/plans/). For customers looking for migration guidance for Microsoft Marketplace partners, contact the specific partner.

**My product is being retired. What kind of support can I expect when I file a support ticket?**

  For services incurring retirement, customers can request support for [break fix](https://azure.microsoft.com/support/legal/faq) issues by filing a [support ticket](https://aka.ms/acs-retirement-support). If customers need migration guidance and or need alternative solutions, we recommend customers look to the Microsoft Marketplace.

**Will feature requests be accepted during the retirement period?**

  For services incurring retirement customers ACS is committed to supporting existing functionality and critical security and stability updates. 

  For services incurring breaking changes customers can expect GA level support including break/fix issues, security and stability updates. As part of this prioritization, we’re not able to commit to new feature development.  We understand that reliability is essential during periods of transition. Throughout the retirement period, the service remains fully supported. 

**During the retirement period, will the service continue to receive newer SDK versions and improvements, or will updates be limited to security and basic maintenance?**

  At this time, the Azure Communication Services engineering team is focused on supporting existing functionality and critical security and stability updates.  

  We understand that reliability is essential during periods of transition. During the retirement period, the service remains fully supported. Any lifecycle changes will continue to be communicated through Azure Updates and the published guidance to ensure transparency and predictability.

### Resources, data, and compliance

**Do I need to export any data from my current ACS implementation if I do not plan to integrate my standalone ACS service with a supported service?**

  Yes, data (e.g. chat messages, call recordings, etc.) and operational telemetry (e.g. data in Azure Monitor) will be available for export. After the retirement date, the supporting data and telemetry for retired and standalone services will be decommissioned.

**Will compliance certifications (HIPAA, SOC2, GDPR, etc.) remain valid during the transition?**

Yes, all services maintain their existing compliance certifications. For more information, see the [Microsoft Trust Center](https://www.microsoft.com/trust-center).

**Will my current SLAs and up time guarantees remain the same during the retirement period?**

  Yes, all current SLA and uptime guarantees remain. You can learn more about the SLAs offered for services [here](https://aka.ms/azuresla). If you need assistance with your service, contact [Azure Support](https://aka.ms/acs-retirement-support).

**What happens to my existing ACS Azure resources (resource groups, connection strings) during the retirement period?**

  All existing Azure resources will be available from the notification date (September 2026) through the retirement end date (September 30, 2028).

**After the retirement date, can I create a new ACS identity if I intend to use supported services (for example, Teams Meeting Interop)?**

  Yes, ACS identity continues to work with supported services.

### Pricing and licensing

**Does the ACS pricing structure change when I use the supported services?**

You might incur additional service costs, licensing costs, or both for the supported services, such as a Microsoft 365 license or pay-as-you-go services.

### Communications and notifications

**How will I be notified of updates or changes?**

  Users will be notified of changes to ACS using the [Azure updates](https://azure.microsoft.com/updates) page.


**Will retiring Azure Communication Services impact Azure Service Health notifications?**

No. Azure Service Health is a separate Azure platform capability and it keeps providing subscription-level notifications for service issues, planned maintenance, and health advisories. You don't need Azure Communication Services to receive [Azure Service Health](/azure/service-health/overview) notifications.
<br></br>
<br></br>

---

## Retired services FAQ

**What customer-facing communications will be published, and what information will be available?**
 
  Microsoft publishes all customer-impacting details through the Azure portal, direct customer notifications, Azure Advisor Recommendations, Azure Updates, and the official retirement documentation.  

- **Azure portal**: View service notifications, health messages, and resource level alerts directly in the Azure portal.
	https://portal.azure.com/

- **Direct customer notifications**: Microsoft sends direct customer notifications, such as email and alerts in the Azure portal, to subscription owners for customer-impacting changes.

- **Azure Advisor Recommendations**: Personalized recommendations and retirement-related insights surfaced within [Azure Advisor](/azure/advisor/advisor-overview).

- **Azure Updates**: Public announcements for Azure service changes, including previews, general availability, and retirements.
	https://azure.microsoft.com/updates/

- **Official ACS retirement documentation**: This document is the authoritative documentation outlining Azure Communication Services retirement timelines and impacted services.

  


## The following services are being retired and will no longer be available after September 30, 2028.

### ACS Number Management (Direct Offer)

<!--
> [!WARNING]
> Azure Communication Services is introducing breaking changes, and some services are being retired.
>
> - **New Tenants:** While resource creation remains possible during the retirement period, tenants that have not received phone numbers before October 23, 2026 will not be able to purchase new phone numbers.
> - **Existing Tenants:** Tenants granted phone numbers before October 23, 2026, will continue to function and can purchase additional phone numbers throughout the retirement period.
-->

> [!TIP]
> To get started planning your migration, visit the [Teams Phone Extensibility (TPE) migration guide](https://aka.ms/acs-numbermanagement-tpe).

> [!NOTE]
> Remove ACS phone numbers before deleting an ACS resource. If phone numbers are not removed first, charges can continue on orphaned numbers. A support ticket is required to resolve this issue.

|  | Teams Direct Routing | Teams Calling Plan | Teams Operator Connect |
|---|---|---|---|
| **Current ACS Calling Service Comparison** | **Best Option for: ACS Direct Routing** | **Best Option for: ACS Direct Offer** | **Consider: Shifting to carrier managed PSTN** |
| **Best fit** | • Customer already owns SBCs or SIP trunks<br>• Complex routing, survivability, or regulatory routing<br>• Needs carrier flexibility and maximum control<br>• Wants make-before-break migration with pilot ranges | • ACS Direct Offer / ACS PSTN customers<br>• Customer wants Microsoft-managed PSTN<br>• Smaller or simpler calling deployments<br>• Calling Plan is supported in the customer geography | • Customer wants to eliminate SBC operations<br>• Certified Operator Connect carrier is available<br>• Carrier-managed PSTN and number lifecycle<br>• Calling Plan not available or not preferred |
| **Benefit** | • Reuses existing telephony investments<br>• Maximum routing and carrier control<br>• Can build Teams DR in parallel<br>• ACS can remain as rollback until validation | • Closest Microsoft-managed replacement for ACS Direct Offer<br>• No SBC or operator onboarding dependency<br>• Simpler procurement and operations model<br>• Integrated Teams Phone management | • Simpler administration through Teams Admin Center<br>• Operator handles PSTN connectivity<br>• No Microsoft Calling Plan required<br>• Good fit for carrier-standardized environments |
| **Considerations** | • Teams Direct Routing design required<br>• Review SBC capacity, certificates, and FQDNs<br>• Same SBC FQDN can't be used simultaneously for ACS and Teams DR<br>• Requires Teams Phone licensing and D365 mapping | • Validate Calling Plan coverage and service numbers<br>• Numbers might need to be ported or moved<br>• Calling Plan / Pay-As-You-Go charges apply<br>• Rollback can be difficult after number port completion | • Porting schedule controlled by operator<br>• Coverage and service-number availability vary<br>• Emergency addressing model varies by operator<br>• Support responsibility shifts to the operator |

**Will there be any changes to my existing phone number?**

Customers who already have ACS resources and acquired ACS phone numbers before the September 2026 announcement can continue to acquire more phone numbers during the two-year transition window.

Tenants that create their first ACS resource after the September 2026 announcement aren't eligible to request phone numbers.



**Can I port my existing ACS phone numbers to a third-party provider before retirement?**

Yes, you may port your number from ACS to another provider. See your destination communication provider's documentation on how to port numbers from external providers like ACS. To initiate a port request for Microsoft to release your existing number to an external provider, create a [support ticket here](https://aka.ms/acs-retirement-support). To learn more, visit the [Microsoft Phone Number Service Portal](https://pstnsd.powerappsportals.com/).

**Can I port my number from an existing external provider into ACS during the retirement period?**

Yes, existing customers with existing ACS resources can port their existing phone numbers from external providers into their ACS resource. New customers that create new ACS resources will not be able to initiate a port request into their ACS resource.

**Can I port my existing ACS phone numbers to Teams Phone Extensibility?**

Yes, you can port your number from ACS to use Teams Phone Extensibility. Customers must release their number from ACS before the port move. Please open a ticket with [Service Desk - TNM](https://pstnsd.powerappsportals.com/) and our team will enable migration of the number.

**Is there a process for customers to transfer their phone number verification to third-party providers?**

Verification status is managed by individual providers. If a customer ports a phone number outside of Microsoft, the ability to retain or reuse an existing verification status depends on the policies and processes of the new provider. Customers should plan to confirm verification requirements directly with their chosen third-party provider as part of the transition, as re-verification may be required in some cases.

**Will the phone number acquisition capabilities still be available in the portal?**

You’ll still see the Phone Numbers / Get phone number option in the Azure portal, but for new ACS resources created after the announcement, phone number capabilities are intentionally disabled as part of the ACS telephony retirement process. 

So the portal window may be visible, but actions like acquiring or starting a trial/lookup will be unavailable (greyed out) because that new resource has a zero initial usage for phone numbers.  

If you have a critical business need, please contact support and we can review what options may be available.

**Will new customers be able to buy phone numbers after the announcement?**

After the September 2026 announcement, customers who do not have existing ACS phone numbers will no longer be able to acquire new phone numbers. 

Please follow Azure Updates for notifications to changes on our ability to offer phone numbers for existing customers.


---

### ACS Email



> [!TIP]
> To plan your migration, review information about [Microsoft 365 High Volume Email (HVE)](https://aka.ms/acs-email-hve) and [Exchange Online](https://aka.ms/acs-email-exchangeonline), or explore email solutions from [Infobip](https://aka.ms/acs-infobip) and [Telesign](https://aka.ms/acs-telesign) on Microsoft Marketplace.

|  | ACS Email<br>*Current state — retiring* | M365 High Volume Email<br>*HVE* | Exchange Online<br>*For reference* | Marketplace partners<br>*Third-party CPaaS* |
|---|---|---|---|---|
| **Best fit** | Application-to-recipient (A2P) transactional, bulk, and engagement email | High-volume operational email sent from apps and devices | Person-to-person business email from user mailboxes | A2P transactional, bulk, and marketing where a third-party CPaaS is preferred |
| **Recipients** | Internal and external | Internal send (within-tenant)  | Internal and external, subject to tenant limits (TERRL) | Internal and external |
| **Sending identity** | Azure-managed or verified custom domain; no mailbox required | Dedicated HVE account; no mailbox and no license required | Licensed mailbox, accepted domain, connector, or Graph sender | Provider-managed sending domain with DNS verification |
| **How you send** | REST API, SDKs, and SMTP | SMTP at launch; SDK support planned | SMTP submission, relay, or Microsoft Graph | API and SMTP; varies by provider |
| **Scale** | High throughput; quota-based, with ramp-up guidance over 2–4 weeks | No tenant recipient-rate cap for internal send; 50 recipients per message; up to 100 HVE accounts | Designed for user mail, not bulk; rate limits apply by design | Provider-defined tiers |
| **Availability** | Available until retirement; maintenance mode — security and critical fixes only | Internal send GA today (Worldwide cloud; not GCC or sovereign) | Available now across the M365 tenant | Available via Microsoft Marketplace |
| **Commercial model** | Azure consumption | Microsoft 365 / Exchange Online licensing | Included with M365 licensing | Provider pricing; some offers may be MACC-eligible |

**Can I continue to onboard my workload to new ACS Email resources before September 30, 2028?**

Yes. You can currently onboard workloads to new ACS Email resources. However, this availability is subject to change at any time. We recommend using the two-year retirement period to migrate existing workloads off ACS Email rather than onboarding new solutions.

**How will quota requests be handled during the retirement period?**

We recommend that you migrate off the ACS Email service before the retirement date. During the retirement period, you can continue to submit support requests for quota increases, which will be handled on a case-by-case basis.

**Can I continue using and adding my verified email domains after the notification date?**

Yes, verified email domains will continue to work as expected and be supported until September 30, 2028.

**Can I use Exchange as a replacement for ACS Email?**

Exchange Online supports person-to-person business email from licensed user mailboxes for internal and external recipients, subject to tenant limits. It uses accepted domains and supports connectors, Microsoft Graph, SMTP submission, and relay. Designed for user email rather than bulk delivery, its rate limits vary by design. It is available across the Microsoft 365 tenant and included with Microsoft 365 licensing.
  
**What SDK and service updates are expected during the retirement?**

At this time, the Azure Communication Services engineering team is focused on supporting existing functionality and critical security and stability updates. As part of this prioritization, we’re not able to commit to new feature development or provide an implementation timeline for these types of requests. 

We understand that reliability is essential during periods of transition. During the retirement period, the service remains fully supported, with product fixes and updates focused on security and stability. Any lifecycle changes will continue to be communicated through the published guidance to ensure transparency and predictability.

**What help will customers receive during the migration, and how will ACS support us through the transition?**

Customers will continue to receive support for break-fix issues involving Azure Communication Services APIs. Support for issues outside these APIs is handled by the destination provider. For assistance onboarding to the destination solution, open a support ticket with the destination migration partner.

**Are there third‑party services that offer similar functionality to ACS Email and run on Azure or Microsoft 365?**

Yes. There are third‑party providers that offer similar email and messaging capabilities and run on Azure. Some of these solutions are available through the Microsoft Marketplace.

---


### ACS SMS

|  | ACS SMS<br>*Current state — retiring* | Marketplace partners<br>*Third-party CPaaS* | Dynamics 365 Contact Center<br>*For D365 customers* |
|---|---|---|---|
| **Best fit** | A2P transactional, alerts, OTP, bulk, and two-way conversational messaging | The primary destination for standalone A2P and CPaaS messaging scenarios | Omnichannel contact center messaging inside Dynamics 365 |
| **Sender types** | Toll-free, short code, 10DLC, mobile/long code, alphanumeric sender ID | Varies by provider; typically the same range plus local long codes | Toll-free, short code, and mobile numbers across supported regions |
| **Geography** | 190+ regions reachable via partner network | Provider-defined; global coverage varies by partner | Defined set of supported regions |
| **Messaging model** | One-way and two-way; group and bulk supported | One-way and two-way; varies by provider | Conversational and outbound within the contact center |
| **How you send** | REST API, SDKs, and Event Grid for inbound and delivery events | API and provider interfaces; varies by provider | Configured within Dynamics 365 channels |
| **Availability** | Available until retirement; maintenance mode only. New customers blocked from number purchase at announcement | Available now via Microsoft Marketplace | Microsoft will offer equivalent alternative SMS services before the ACS retirement date |
| **Commercial model** | Azure consumption | Provider pricing; some offers may be MACC-eligible | Dynamics 365 licensing |

**Can I continue to acquire new ACS SMS phone numbers before September 30, 2028?**

You can acquire new phone numbers only if you're an existing customer with ACS resources that have existing ACS phone numbers.

**Can I port my ACS SMS number (including short codes) to another provider?**

Yes, you can port your existing numbers to another provider using their port-in instructions. You need to contact the carrier to which you'd like to port your numbers. Most carriers require you to fill out a Letter of Authorization (LOA). Short codes are also available to port out.

**Can I continue to acquire short codes during the retirement period?**

We will continue to support short codes for existing ACS customers. For newly created ACS resources, you can't acquire new short codes.

**What are the migration options for ACS SMS?**

We recommend that you migrate off the service before the retirement date. During the retirement period, you can choose a partner through the [Microsoft Marketplace](https://marketplace.microsoft.com/). Migrating ACS numbers to another provider requires re-verification with an SMS aggregator and might cause downtime.

**If we're currently using SMS, what guidance is available to help us transition as the service is retired?**

Azure Communication Services SMS is included as part of the service retirement. Microsoft will share important dates, expectations, and next steps through official Azure communications and the retirement guidance published in this document.

As part of preparing for this change, we encourage you to review alternative SMS solutions that best meet your business, regulatory, and operational needs, including options available through Microsoft Marketplace.

**Will short code registration continue during the retirement period, and is there any consideration for customers who recently acquired a short code?**

As part of the Azure Communication Services retirement, short code registration is no longer available for new ACS resources following the retirement announcement. 

Customers who already have SMS short codes can continue to use them during the supported retirement period and can choose to port their short codes to another provider when planning their transition. This allows customers to maintain continuity while evaluating alternative solutions that best meet their needs.

Microsoft will continue to share relevant timelines and updates through official communications via Azure Updates.
 
**Will timelines for moving an existing short code to another provider vary during the retirement period?**

Because short code provisioning involves external providers and regulatory review, timelines can vary. We recommend planning ahead and engaging early with your chosen provider to confirm expected timelines.

**Will Microsoft continue to support toll-free verification?**

At this time, there are no known plans to change the current approach to bulk verification. You can continue planning with the expectation that the existing process will remain in place. Microsoft will continue to share relevant timelines and updates through official communications via Azure Updates.

**Is there a supported way to move existing 10DLC campaigns and campaign branding to Microsoft Teams?**

At this time, Azure Communication Services hasn't published a migration path from 10DLC to Microsoft Teams. Any future updates will be communicated through this document.

---

### ACS Advanced Messaging (WhatsApp)

> [!TIP]
> Dynamics 365 WhatsApp customers can review the [Dynamics 365 migration guidance](https://aka.ms/acs-d365-migration) to plan their migration. ACS WhatsApp customers should explore [Microsoft Marketplace](https://marketplace.microsoft.com/) for alternative partner solutions, such as [Infobip](https://aka.ms/acs-infobip) and [Telesign](https://aka.ms/acs-telesign).

|  | ACS WhatsApp<br>*Current state — retiring* | Dynamics WhatsApp<br>*M365 Users* | Marketplace partners<br>*Third-party CPaaS* |
|---|---|---|---|
| **Best fit** | Existing custom applications that need direct send and receive APIs while transitioning from the retiring ACS offer. | Customer-service organizations that want a Microsoft contact center, agent workspace, routing, and Copilot. | Customers preferring a managed BSP/CPaaS, partner contact center, or capabilities outside the Microsoft stack. |
| **Product model** | Azure communications primitive: ACS resource, WhatsApp Business Account, Messaging SDK, and Event Grid. | Dynamics channel configured through ACS, then connected to workstreams, routing, agent workspace, and service processes. | Varies: direct WhatsApp API, CPaaS, BSP, omnichannel inbox, or full contact-center platform. |
| **Primary users** | Developers build the application, authentication, routing, agent tooling, and operating model. | Agents, supervisors, admins, and customers using WhatsApp within a managed contact-center workflow. | Varies by offer: developers, contact-center agents, marketers, operations teams, or managed-service users. |
| **Messaging** | Business- and customer-initiated messages, templates, text/media/interactive content, and delivery reports. | Inbound and outbound WhatsApp conversations in Dynamics; approved text templates can be added to workstreams. | Typically supports WhatsApp messaging and templates; verify media, interactive messages, commerce, and emerging features. |
| **Automation and AI** | Customer integrates bots, AI, workflows, and business systems through application code and Azure services. | Supports automated messages, Copilot, AI agents, and Power Platform / Dynamics integrations. | Provider-specific bots, AI assistants, workflow builders, CRM integrations, and managed automation. |
| **Events and analytics** | Event Grid for inbound messages and delivery status; customer builds monitoring and business analytics. | Contact-center conversation and service analytics; delivery, read, and failure updates require correct Event Grid subscriptions. | Dashboards, webhooks, event streams, quality analytics, and exports vary by product and service tier. |
| **Identity and data** | App owns customer mapping and must handle WhatsApp usernames and Business-Scoped User IDs. | Dynamics contact records and routing must handle phone numbers and Business-Scoped User IDs; update dependent automations. | Provider identity model, CRM synchronization, consent, and handling of Meta identifiers vary. |
| **Commercial model** | ACS usage fee plus Meta WhatsApp fees, billed through Azure. | Dynamics licensing/capacity plus ACS usage and Meta messaging fees; confirm the customer's configuration. | Marketplace subscription, consumption, platform, support, or managed-service charges plus applicable Meta fees. |
| **Governance** | Azure security and monitoring; customer owns agent controls, retention, compliance workflows, and operational runbooks. | Dynamics security, Dataverse, contact-center administration, and service processes plus ACS/Event Grid controls. | Data residency, retention, audit, security certifications, tenant isolation, and export controls vary by provider. |


**Will my existing ACS WhatsApp integration stop working immediately?**

- Existing ACS WhatsApp integrations will continue to function.
- No new features will be added, but existing capabilities will be supported during the transition period.

**How do I migrate a phone number used in Advanced Messaging WhatsApp channel to another Business Solution Provider?**

You can use WhatsApp's phone number migration process to move an existing phone number from an ACS WhatsApp channel to another Business Solution Provider (BSP), provided the destination BSP supports this process.

**What are my options after ACS WhatsApp is retired?**

Alternatives to consider:

- Dynamics 365

- Infobip

- Telesign

Or migrate your WhatsApp Business Account to another Business Solution Provider (BSP). 
    

---

### ACS Chat

> [!TIP]
> To get started planning your migration, visit the [ACS Chat to Microsoft Graph chat migration guide](acs-chat-to-graph-chat-migration-guide.md).

|  | ACS Chat<br>*Current state — retiring* | Microsoft Graph - Chat<br>*M365 Users* | Marketplace partners<br>*Third-party CPaaS* |
|---|---|---|---|
| **Best fit** | Custom in-app chat for B2C, anonymous, or application-defined users. | Teams chat integration for Microsoft 365 users, guests, and supported external users. | Workload requires anonymous users, a white-label experience, or consumer-scale chat outside Teams. |
| **Security** | ACS access tokens, participant ACLs, endpoints, and application-managed session logic. | Entra app registration, least-privileged Graph permissions, admin consent, membership, and tenant policy. |  |
| **Identity** | Application creates ACS users and issues chat-scoped access tokens. | Microsoft Entra and Teams identities with OAuth permissions and tenant policy. |  |
| **Conversational model** | Application-controlled chat threads and participant membership. | Teams one-on-one, group, or meeting chats; one-on-one chat is unique per user pair. |  |
| **Client experience** | Custom web or mobile client using ACS Chat SDKs. | Teams client, Teams app, or a separately designed and validated Graph-based experience. |  |
| **Real-time events** | Client WebSocket notifications and server-side Event Grid events. | Graph change-notification subscriptions with validation, renewal, throttling, and missed-event recovery. |  |
| **Rich content** | Application-defined message content, metadata, attachments, typing, and read receipts. | Teams message body, mentions, reactions, hosted content, and Microsoft 365 file links; transformation may be required. |  |
| **Governance** | Azure resource configuration and ACS-specific retention behavior. | Teams policies plus Microsoft Purview retention, eDiscovery, DLP, audit, and tenant settings. |  |

**How will ACS handle storage of chat history following the retirement date?**

ACS will maintain chat history according to your [storage policies](concepts/service-limits.md#chat-storage) until the retirement date of September 30, 2028. To archive your chat history data, follow the guide to [archiving chat threads into your preferred storage solution](how-tos/chat-sdk/archive-chat-threads.md).

**If I want to migrate to use Teams Chat with a programmable SDK, what is the recommended migration approach?**

Use the Microsoft Graph APIs with Microsoft Teams to support chat-based workflows within Microsoft 365. To learn more, see the [Microsoft Graph Teams API overview](/graph/api/resources/teams-api-overview).



**Will the UI library for chat continue to receive updates and improvements?**

Chat will continue to receive security, compliance, and critical reliability updates during the retirement period.  No new features or enhancements will be introduced. Customers are encouraged to transition to alternative solutions.

**After retirement, how can I continue using chat in Teams interoperability scenarios?**

Customers can migrate from ACS Chat (Teams Interop) to [Microsoft Graph Chat APIs](/graph/api/resources/chat).




#### Migrate ACS Chat to Microsoft Graph chat

Microsoft Graph exposes Microsoft Teams chat APIs; it isn't a drop-in replacement for the ACS Chat service or its client SDKs. This path is best suited to Microsoft 365 users, guests, and supported external users whose conversations can operate under Teams identity, licensing, tenant policies, and governance. Workloads that require anonymous or application-defined identities, a white-label embedded client, or consumer-scale chat outside Teams should evaluate other communication providers or redesign the experience.

Use the [ACS Chat to Microsoft Graph chat migration guide](acs-chat-to-graph-chat-migration-guide.md) to assess fit, map ACS identities to Microsoft Entra users, choose a Teams or validated custom experience, and replace application APIs and event handling. The guide separates ongoing messaging with delegated permissions from optional historical-message import with migration permissions. It also covers the archive-and-restart alternative, reconciliation, testing, cutover, and rollback.

The migration steps focus on one-on-one and group chats. Teams meeting chat and ACS Teams interoperability scenarios require a separate fit assessment; don't assume that meeting chat supports the same history-import workflow. Complete the applicable migration and preserve required ACS history before the retirement date.


---

### ACS Rooms

> [!TIP]
> To get started planning your migration, visit the information in [Teams Meeting interoperability](https://aka.ms/acs-rooms-teamsinterop).

| ACS Rooms Function | Comparable Service |
|---|---|
| **Room creation** | Microsoft Graph API |
| **Participant management** | Microsoft Graph APIs |
| **Meeting scheduling** | Microsoft Graph APIs |
| **Meeting execution** | Teams Meetings APIs |
| **Embedded application experience** | Teams Meeting Interoperability |
| **Recording/Transcripts/Copilot** | Teams |

**What is the migration path for ACS Rooms to Teams meetings?**

ACS Rooms and Teams meetings through the Microsoft Graph API offer similar functionality, but exist in two different environments and don't offer a migration path. To learn more about APIs to create and join online meetings, see the [Microsoft Graph online meeting API guide](/graph/choose-online-meeting-api).

**Are there equivalent permissions APIs in ACS Rooms and Teams Meetings?**

ACS Rooms and Teams meetings through the Microsoft Graph API offer similar functionality, but exist in two different environments and don't offer a migration path. To learn more about programmatically managing user and role permissions in a Teams meeting, see the [Microsoft Graph online meeting update API](/graph/api/onlinemeeting-update?tabs=http).

**Customers who are currently using ACS Rooms?**

If you're currently using ACS Rooms, you need to plan a transition, as Rooms is included in the retirement scope. ACS Rooms doesn't directly interoperate with Microsoft Teams. However, if your desired outcome is a Teams meeting experience, there are alternative options to consider.

Depending on your requirements, these options might include Teams meeting interoperability or Teams native meeting creation and management APIs.


**What level of support and service should customers expect during the retirement window?**

Rooms will continue to receive security, compliance, and critical reliability updates during the retirement period.  No new features or enhancements will be introduced.    

Customers are encouraged to transition to alternative solutions.       


---

<a id="acs-ui-library-mobile-and-web"></a>

### ACS UI Library (mobile and web)

**How will Microsoft support updates to ACS UI Library for mobile and web? For example, how will Microsoft handle changes to upstream dependencies such as Fluent and React, and operating system updates for iOS and Android?**

Microsoft provides limited support for platform updates and treats these updates as break-fix issues. [Break-fix](https://azure.microsoft.com/support/legal/faq) issues are technical problems you might experience while using Azure services. To request a fix for upstream changes in dependencies, file a [support ticket](https://aka.ms/acs-retirement-support).

**How will Microsoft manage the ACS UI Library (Mobile & Web) in open source?**

The ACS UI Library remains open source during the retirement period until September 30, 2028. Microsoft doesn't proactively drive or accept upstream changes to ACS UI Library during this time, including feature additions or dependency upgrades. Incoming issues and pull requests might still be reviewed for awareness and triage, but aren't accepted. If you require ongoing evolution or dependency modernization, fork and maintain the open-source UI Library independently.

**Will Microsoft support the UI Library during the wind-down period?**

Yes. The ACS UI Library for web and mobile will continue to be available and supported throughout the two-year retirement period. You can continue using the UI Library as it exists today, and it will remain operational during this time.

**What are the support boundaries?**

Azure Communication Services UI Library SDK support focuses on keeping the library stable, secure, and compliant. Support is limited to addressing security issues, legal or regulatory requirements, and critical problems that block normal usage. New features, enhancements, UI modernization, or proactive dependency upgrades aren't planned during the wind-down period.

**If I'm using Teams interoperability, will Microsoft still retire the UI Library components?**

Teams interoperability scenarios will continue to be supported as a calling experience. However, the ACS UI Library itself is included in the retirement scope and will be retired. 

If you're using the UI Library for Teams interoperability, you can continue to use it during the retirement period as it exists today. During this time, support focuses on keeping the library operational and addressing critical issues, but no new features or enhancements are planned.

To reduce future risk and avoid last‑minute changes, customers are strongly encouraged to begin transitioning away from the UI Library as early as possible.

**Will Microsoft support Virtual Appointments during the two-year transition period?**

Yes. Microsoft continues to support Virtual Appointments scenarios throughout the full transition period, as long as they're built on supported Microsoft experiences such as Microsoft Teams and Teams interoperability. The Azure Communication Services components required to keep existing Virtual Appointments running remain available for the duration of the retirement window.

During this time, support follows Azure retirement standards. This means Microsoft focuses on addressing security issues, legal or regulatory requirements, and critical problems that could block normal usage. Other types of updates or enhancements aren't planned during the wind-down period.

**If I'm using Teams interoperability, will Microsoft continue to support and maintain the UI Library components used for Virtual Appointments?**

Microsoft will continue to support Virtual Appointments scenarios that use Teams interoperability as an end-to-end experience. However, the Azure Communication Services UI Library itself is included in the retirement scope and isn't exempt from retirement.

UI Library components used within Virtual Appointments remain available and can continue to be used during the wind-down period.

During this time, support focuses on keeping existing experiences stable and secure. New features, dependency upgrades, or UI enhancements aren't planned. Fixes are considered only for security issues, legal or regulatory requirements, or critical problems that block normal usage.

For long-term Virtual Appointments solutions, plan ahead and align with Teams native experiences or build custom user interfaces by using supported Teams extensibility options, which better align with future platform investments.

**Will the code samples remain?**

Yes. Existing public documentation and selected code samples for Virtual Appointments, including Teams interoperability scenarios, remain available throughout the transition period. These materials help you reference and maintain existing implementations during the retirement window.

However, this documentation and code aren't intended to support new Virtual Appointments solutions. If you're planning new or long-term implementations, align with supported Teams native experiences or other recommended extensibility options.

---

### ACS Job Router

> [!TIP]
> To get started planning your migration, visit the information in [Dynamics 365 Contact Center](https://aka.ms/acs-jobrouter-d365).

---

### ACS Direct Routing

> [!TIP]
> To get started planning your migration, visit the [Teams Phone Extensibility (TPE) migration guide](https://aka.ms/acs-directrouting-tpe).

|  | Teams Direct Routing | Teams Calling Plan | Teams Operator Connect |
|---|---|---|---|
| **Current ACS Calling Service Comparison** | **Best Option for: ACS Direct Routing** | **Best Option for: ACS Direct Offer** | **Consider: Shifting to carrier managed PSTN** |
| **Best fit** | • Customer already owns SBCs or SIP trunks<br>• Complex routing, survivability, or regulatory routing<br>• Needs carrier flexibility and maximum control<br>• Wants make-before-break migration with pilot ranges | • ACS Direct Offer / ACS PSTN customers<br>• Customer wants Microsoft-managed PSTN<br>• Smaller or simpler calling deployments<br>• Calling Plan is supported in the customer geography | • Customer wants to eliminate SBC operations<br>• Certified Operator Connect carrier is available<br>• Carrier-managed PSTN and number lifecycle<br>• Calling Plan not available or not preferred |
| **Benefit** | • Reuses existing telephony investments<br>• Maximum routing and carrier control<br>• Can build Teams DR in parallel<br>• ACS can remain as rollback until validation | • Closest Microsoft-managed replacement for ACS Direct Offer<br>• No SBC or operator onboarding dependency<br>• Simpler procurement and operations model<br>• Integrated Teams Phone management | • Simpler administration through Teams Admin Center<br>• Operator handles PSTN connectivity<br>• No Microsoft Calling Plan required<br>• Good fit for carrier-standardized environments |
| **Considerations** | • Teams Direct Routing design required<br>• Review SBC capacity, certificates, and FQDNs<br>• Same SBC FQDN can't be used simultaneously for ACS and Teams DR<br>• Requires Teams Phone licensing and D365 mapping | • Validate Calling Plan coverage and service numbers<br>• Numbers might need to be ported or moved<br>• Calling Plan / Pay-As-You-Go charges apply<br>• Rollback can be difficult after number port completion | • Porting schedule controlled by operator<br>• Coverage and service-number availability vary<br>• Emergency addressing model varies by operator<br>• Support responsibility shifts to the operator |

**Will my existing ACS Direct Routing inbound and outbound calling continue to work during the transition period after the retirement announcement?**

Yes. ACS Direct Routing calling continues to work during the retirement period following the announcement for customer tenants with an existing ACS resource as of the September 2026 announcement. Customers can expect no immediate changes to inbound call handling while they plan and execute a migration to Teams Direct Routing or Teams Operator Connect.


**Will I be able to make and receive calls with ACS SDK using managed carriers after the announcement?**

Yes. ACS Direct Routing calling with managed carriers continues to work during the retirement period following the announcement for customer tenants with an existing ACS resource as of the September 2026 announcement. Customers can expect no immediate changes to outbound call handling while they plan and execute a migration to Teams Direct Routing or Teams Operator Connect.
<br></br>
<br></br>

---

## Breaking changes FAQ

The following services have [breaking changes](#impacted-services-and-sdks). To continue receiving support after September 30, 2028, use capabilities documented for one of the [listed Teams integrations](#breaking-changes). Eligibility doesn't guarantee feature parity across integrations.

Dynamics 365 workloads follow the product-specific [Dynamics 365 ACS retirement guide](https://aka.ms/acs-d365-migration). A webhook or data exchange with Dynamics 365 alone doesn't establish support for an ACS workload.

<a id="acs-voice--video-calling-sdk"></a>

### ACS Voice and Video Calling SDK

> [!TIP]
> To get started planning your migration, visit the [Teams Meeting interoperability migration guide](https://aka.ms/acs-calling-teamsinterop).

**What are the migration options for Voice and Video Calling?**

There are two migration options for Voice and Video Calling:

- Teams interoperability: Customers who want to integrate voice and video calling workloads with Teams can use [ACS to Teams Interoperability](concepts/teams-interop.md). To learn more about how to use ACS SDKs with Teams interoperability, see the documentation.

- Microsoft Marketplace: You can also select an alternative partner solution from the [Microsoft Marketplace](https://marketplace.microsoft.com/).

**How will ACS ensure compatibility with updates in Microsoft Teams Meetings for ACS to Teams Meeting Interop?**

Microsoft will continue to provide support in accordance with your specific [support plan](https://azure.microsoft.com/support/plans/), including but not limited to break-fix issues and security fixes.

**Can customers still use ACS Voice and Video Calling SDKs, or will there be restrictions in the future?**

There are no immediate changes to how your existing Azure Communication Services Calling workloads function. All currently deployed calling scenarios will continue to operate until September 30, 2028. To continue receiving support, you need to use ACS SDKs in conjunction with a Microsoft Teams-aligned product or service.

---

### ACS Call Diagnostics

> [!TIP]
> To get started planning your migration, visit the [Teams Meeting interoperability migration guide](https://aka.ms/acs-calldiagnostics-teamsinterop).

---

### ACS Call Automation

> [!TIP]
> To get started planning your migration, visit the [Teams Phone Extensibility (TPE) migration](https://aka.ms/acs-tpe).

**What are the migration options for ACS Call Automation?**

Customers can choose to use [Teams Phone Extensibility](concepts/interop/tpe/teams-phone-extensibility-overview.md) (TPE) as a supported way to integrate ACS Call Automation SDKs with M365 Teams Phone. If you used ACS Direct Offer and wish to use TPE learn more using this [guide](https://aka.ms/acs-tpe). If you used ACS Direct Routing and wish to use TPE learn more using this [guide](https://aka.ms/acs-tpe).

Alternatively, customers can select a partner via the [Microsoft marketplace](https://marketplace.microsoft.com/). 

**Can I continue to onboard my workload to existing ACS Call Automation resources before September 30, 2028?**
Yes. Only tenants with existing ACS resources can acquire new phone numbers for PSTN calling scenarios.


**What is the pricing structure if I use Teams Phone Extensibility with my existing ACS Call Automation implementation?**

Teams Phone Extensibility has multiple consumption and pricing options. To learn more, see the guide on [cost and connectivity options for Teams Phone extensibility](concepts/interop/tpe/teams-phone-extensibility-connectivity-cost.md).

**If I use ACS Call Automation primarily with ACS PSTN for inbound and outbound calling scenarios, and don't intend to use Teams Phone Extensibility, what are my available options?**

ACS will support Call Automation SDKs for standalone scenarios until September 30, 2028. Customers can use Teams Phone Extensibility for PSTN scenarios with ACS Call Automation to continue receiving support, or choose an alternate communications platform provider.

**Will Call Automation support remain available after September 30, 2028?**

Call Automation remains supported under the existing support terms through September 30, 2028. After that date, support continues for capabilities documented for eligible Microsoft Teams scenarios.

Dynamics 365 customers should follow the [Dynamics 365 ACS retirement guide](https://aka.ms/acs-d365-migration).

An eligible integration path doesn't guarantee feature parity with standalone ACS or with another Teams integration. The supported call types, participants, operations, SDKs, licenses, and policies depend on the scenario. Integrating with Teams doesn't extend the availability of services separately identified as retiring in this guide.

**Does connecting Call Automation to an AI service qualify my workload for continued support?**

No. Connecting to Cognitive Services or another AI service doesn't, by itself, qualify a standalone ACS workload for support after September 30, 2028. Support eligibility is determined by the supported Teams integration or the applicable Dynamics 365 product scenario, not by the AI service connected to your application.

Existing supported AI integrations continue under the current support terms through September 30, 2028. After that date, documented AI capabilities, such as speech recognition and text-to-speech, can be used within eligible scenarios, subject to the integration's feature limitations and the AI service's own requirements and support terms.

**What Call Automation scenarios does Teams Phone Extensibility support?**

TPE supports the Call Automation workflows and capabilities listed in the [TPE overview](https://aka.ms/acs-tpe) and [capability matrix](concepts/interop/tpe/teams-phone-extensibility-capabilities.md). Continued support after September 30, 2028 applies to those supported configurations; it does not imply support for every standalone Call Automation feature.

<a id="call-automation-scenario-matrix"></a>

**How do I validate a complex Call Automation solution for continued support?**

Map each part of your solution to its documented integration surface and capabilities. The following matrix distinguishes the three Teams integration paths. It's not a commitment to add capabilities that aren't documented for a scenario.

| Teams integration path | Integration surface | Documented capabilities relevant to migration | Important boundaries |
|---|---|---|---|
| Teams Phone Extensibility (TPE) | Call Automation integrated with Teams Phone | Inbound and outbound PSTN workflows; supported participant and media controls; ACS Call Recording; audio streamed from the call to a WebSocket; real-time transcription. | Requires the applicable Teams resource-account configuration, licensing, and PSTN connectivity. Follow the [TPE capability matrix](concepts/interop/tpe/teams-phone-extensibility-capabilities.md); not every Call Automation operation or media mode is supported. |
| Teams Meeting interoperability | Client-side Calling SDK participation in Teams meetings | Joining supported Teams meetings and using the client capabilities available for the participant's identity and meeting policies. | Meeting participation doesn't itself establish support for Call Automation meeting control, ACS recording, server-side WebSocket streaming, or Call Automation transcription. Validate each required feature against the [Teams interoperability documentation](concepts/teams-interop.md). |
| Click-to-Call for Teams Voice Apps | Client-side Calling SDK calls to a Teams Auto Attendant or Call Queue | Customer-initiated calls into Teams voice-app routing. | This isn't a general replacement for Call Automation workflows. Calling an [Auto Attendant](quickstarts/voice-video-calling/get-started-teams-auto-attendant.md) or [Call Queue](quickstarts/voice-video-calling/get-started-teams-call-queue.md) doesn't by itself establish support for server-side recording, streaming, or transcription. |

For each required operation, verify the supported endpoint and participant types, SDK version, permissions, licensing, and feature limitations. If the documentation doesn't cover your configuration, contact [Azure support](https://aka.ms/acs-retirement-support) before relying on that configuration for your migration.

<a id="call-automation-real-time-transcription"></a>

**What happens to Call Automation real-time transcription after September 30, 2028?**

Call Automation real-time transcription generates live text from call audio and delivers it to your application over a WebSocket. It's a server-side capability, separate from client-side closed captions and Teams meeting transcription.

After September 30, 2028, it remains supported in eligible Teams call scenarios where real-time transcription is documented, including supported TPE configurations. Scenario-specific limitations and the requirements of the connected speech service continue to apply. Teams Meeting interoperability or Click-to-Call eligibility alone doesn't establish support for Call Automation transcription. Dynamics 365 workloads follow their [product-specific guidance](https://aka.ms/acs-d365-migration).

Your application is responsible for storing transcripts if required. See [real-time transcription](concepts/call-automation/real-time-transcription.md) and the [TPE capability matrix](concepts/interop/tpe/teams-phone-extensibility-capabilities.md).

---

### ACS call recording

> [!TIP]
> To get started planning your migration, visit the [Teams Phone Extensibility (TPE) migration guide](https://aka.ms/acs-tpe).

**What are the migration options for ACS call recording?**

After September 30, 2028, ACS call recording remains supported where it's documented for an eligible Teams call scenario, including supported TPE configurations. An eligible integration alone doesn't establish recording support. Dynamics 365 workloads follow their [product-specific guidance](https://aka.ms/acs-d365-migration).

Currently, neither Microsoft nor third-party providers in the Microsoft Marketplace offer a similar standalone solution for ACS call recording. Monitor the [Microsoft Marketplace](https://marketplace.microsoft.com/) for solutions that might be available in the future.

**What happens to existing recordings if I don't migrate to a supported scenario?**

ACS [built-in recording storage](concepts/voice-video-calling/call-recording.md#event-grid-notifications) is temporary. Recording files are available to download for **24 hours**. Retrieve and archive the recording files and associated metadata within that window; don't wait until September 30, 2028. To retain recordings longer, export them to durable storage or configure [Bring Your Own Storage](quickstarts/call-automation/call-recording/bring-your-own-storage.md?pivots=programming-language-csharp).

This ACS transition doesn't delete recordings already stored in your own Azure Blob Storage or restrict your access to those blobs. Those recordings remain subject to your storage account's permissions, retention and lifecycle policies, subscription status, and charges. Access to stored files is separate from eligibility to create new recordings with ACS after the transition.

**Does migrating to Teams Phone Extensibility change recording storage or retention?**

For supported TPE calls, you can use ACS call recording with built-in temporary storage or your own Azure Blob Storage. Built-in recording files still have a **24-hour** download window; retrieve and archive the files and associated metadata within that window. Using TPE doesn't make temporary storage a permanent archive or automatically migrate previously recorded files.

Recordings successfully saved in customer-owned Blob Storage follow that account's normal access, retention, and billing rules. See the [Bring Your Own Storage quickstart](quickstarts/call-automation/call-recording/bring-your-own-storage.md?pivots=programming-language-csharp) for configuration and export notifications.


---

### ACS Audio Streaming

> [!TIP]
> To get started planning your migration, visit the [Teams Phone Extensibility (TPE) migration information](https://aka.ms/acs-tpe).

**What does ACS Audio Streaming cover in this guide?**

This section covers **server-side audio streaming through Call Automation over WebSocket**. One-way streaming sends call audio to your application. Bidirectional streaming also allows your application to send audio back into the call. It doesn't cover the client-side raw-audio APIs in the Calling SDK.

**What are the migration options and support limitations for ACS Audio Streaming?**

Existing supported one-way and bidirectional streaming scenarios continue under the current support terms through September 30, 2028. After that date, audio streaming remains supported where the capability is documented for an eligible Teams call scenario. Dynamics 365 workloads follow the applicable [Dynamics 365 product guidance](https://aka.ms/acs-d365-migration).

TPE documents streaming call audio to a WebSocket. Verify the required streaming direction, audio format, channel mode, participants, and SDK support for your specific scenario. Support for sending audio out of a call doesn't, by itself, establish support for sending audio back into that call, and eligibility for Teams Meeting interoperability or Click-to-Call doesn't imply streaming feature parity.

See the [Audio Streaming overview](concepts/call-automation/audio-streaming-concept.md) and [TPE capability matrix](concepts/interop/tpe/teams-phone-extensibility-capabilities.md).

Currently, neither Microsoft nor third-party providers in the Microsoft Marketplace offer a similar standalone solution for ACS Audio Streaming.

---

### ACS closed captions

> [!TIP]
> To get started planning your migration, visit [Teams Phone Extensibility](https://aka.ms/acs-tpe).

**What are the migration options for ACS closed captions?**

ACS closed captions is a client-side Calling SDK capability for displaying live captions in supported calls and meetings. After September 30, 2028, use it in supported Teams interoperability scenarios, subject to the applicable SDK capabilities, Teams licensing, and meeting or calling policies. Dynamics 365 customers should follow their [product-specific guidance](https://aka.ms/acs-d365-migration).

Don't assume that every eligible Teams integration supports captions. For example, the [TPE capability matrix](concepts/interop/tpe/teams-phone-extensibility-capabilities.md) currently lists an agent turning on Teams closed captions as unsupported.

Currently, neither Microsoft nor third-party providers in the Microsoft Marketplace offer a similar standalone solution for ACS closed captions.

**What licensing is required for basic and translated captions?**

Basic captions follow the applicable Teams entitlements and meeting or calling policies; Teams Premium isn't required solely for basic captioning. Translated captions require the applicable **Teams Premium** entitlement. The required license holder depends on the scenario, such as the meeting organizer for Teams meeting translations or the Microsoft 365 user where that calling scenario requires it.

This transition doesn't change those licensing rules. See the [supported scenarios and licensing requirements](concepts/interop/enable-closed-captions.md) for the requirements that apply to your integration.

**Does ACS store live captions?**

No. Captions are available during the call or meeting to the participant who enables them; ACS doesn't store them. Captions aren't automatically saved as a durable transcript. If your application stores caption data, you're responsible for the required user notifications, consent, and compliance with applicable data-handling requirements.

---

## Get help and support

If you have an issue or question about Azure Communication Services, use one of the following support options.

### Create an Azure support request

If you need technical assistance, [create an Azure support request](https://aka.ms/acs-retirement-support).

### Post a question to Microsoft Q&A

For answers to product or technical questions about Azure Communication Services, engage with Microsoft engineers, Azure Most Valuable Professionals (MVPs), and the community on [Microsoft Q&A](https://aka.ms/acs-retirement-qa).
