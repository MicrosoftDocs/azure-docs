---
title: Memo 22-09 identity requirements overview
description: Get guidance on meeting requirements outlined in US government OMB memorandum 22-09.
services: active-directory 
ms.service: active-directory
ms.subservice: standards
ms.workload: identity
ms.topic: how-to
author: gargi-sinha
ms.author: gasinh
manager: martinco
ms.reviewer: martinco
ms.date: 04/28/2023
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Meet identity requirements of memorandum 22-09 with Microsoft Entra ID

The [Executive Order on Improving the Nation’s Cybersecurity (14028)](https://www.whitehouse.gov/briefing-room/presidential-actions/2021/05/12/executive-order-on-improving-the-nations-cybersecurity), directs federal agencies to advance security measures that significantly reduce the risk of successful cyberattacks against federal government digital infrastructure. On January 26, 2022, in support of Executive Order (EO) 14028, the [Office of Management and Budget (OMB)](https://www.whitehouse.gov/omb/) released the federal Zero Trust strategy in [M 22-09 Memorandum for Heads of Executive Departments and Agencies](https://www.whitehouse.gov/wp-content/uploads/2022/01/M-22-09.pdf). 

This article series has guidance to employ Microsoft Entra ID as a centralized identity management system when implementing Zero Trust principles, as described in memorandum 22-09. 

Memorandum 22-09 supports Zero Trust initiatives in federal agencies. It has regulatory guidance for federal cybersecurity and data privacy laws. The memo cites the [US Department of Defense (DoD) Zero Trust Reference Architecture](https://cloudsecurityalliance.org/artifacts/dod-zero-trust-reference-architecture/): 

"*The foundational tenet of the Zero Trust Model is that no actor, system, network, or service operating outside or within the security perimeter is trusted. Instead, we must verify anything and everything attempting to establish access. It is a dramatic paradigm shift in philosophy of how we secure our infrastructure, networks, and data, from verify once at the perimeter to continual verification of each user, device, application, and transaction.*"

The memo identifies five core goals for federal agencies to reach, organized with the Cybersecurity Information Systems Architecture (CISA) Maturity Model. The CISA Zero Trust model describes five complementary areas of effort, or pillars: 

* Identity
* Devices 
* Networks
* Applications and workloads
* Data

The pillars intersect with: 

* Visibility
* Analytics
* Automation 
* Orchestration
* Governance

## Scope of guidance

Use the article series to build a plan to meet memo requirements. It assumes use of Microsoft 365 products and a Microsoft Entra tenant. 

Learn more: [Quickstart: Create a new tenant in Microsoft Entra ID](../fundamentals/create-new-tenant.md).

The article series instructions encompass agency investments in Microsoft technologies that align with the memo's identity-related actions.

* For agency users, agencies employ centralized identity management systems that can be integrated with applications and common platforms
*  Agencies use enterprise-wide, strong multi-factor authentication (MFA)
   *  MFA is enforced at the application layer, not the network layer
   *  For agency staff, contractors, and partners, phishing-resistant MFA is required
   *  For public users, phishing-resistant MFA is an option
   *  Password policies don't require special characters or regular rotation
* When agencies authorize user access to resources, they consider at least one device-level signal, with identity information about the authenticated user

 
## Next steps

* [Enterprise-wide identity management system](memo-22-09-enterprise-wide-identity-management-system.md)
* [Meet multifactor authentication requirements of memorandum 22-09](memo-22-09-multi-factor-authentication.md)
* [Meet authorization requirements of memorandum 22-09](memo-22-09-authorization.md)
* [Other areas of Zero Trust addressed in memorandum 22-09](memo-22-09-other-areas-zero-trust.md)
* [Securing identity with Zero Trust](/security/zero-trust/deploy/identity)
