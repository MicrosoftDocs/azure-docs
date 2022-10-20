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
ms.date: 3/10/2022
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Meet identity requirements of memorandum 22-09 with Azure Active Directory

US executive order [14028, Improving the Nation's Cyber Security](https://www.whitehouse.gov/briefing-room/presidential-actions/2021/05/12/executive-order-on-improving-the-nations-cybersecurity), directs federal agencies on advancing security measures that drastically reduce the risk of successful cyberattacks against the federal government's digital infrastructure. On January 26, 2022, the [Office of Management and Budget (OMB)](https://www.whitehouse.gov/omb/) released the federal Zero Trust strategy in [memorandum 22-09](https://www.whitehouse.gov/wp-content/uploads/2022/01/M-22-09.pdf), in support of EO 14028. 

This series of articles offers guidance for employing Azure Active Directory (Azure AD) as a centralized identity management system for implementing Zero Trust principles, as described in memorandum 22-09. 

The release of memorandum 22-09 is designed to support Zero Trust initiatives within federal agencies. It also provides regulatory guidance in supporting federal cybersecurity and data privacy laws. The memo cites the [Department of Defense (DoD) Zero Trust Reference Architecture](https://dodcio.defense.gov/Portals/0/Documents/Library/(U)ZT_RA_v1.1(U)_Mar21.pdf): 

>"The foundational tenet of the Zero Trust Model is that no actor, system, network, or service operating outside or within the security perimeter is trusted. Instead, we must verify anything and everything attempting to establish access. It is a dramatic paradigm shift in philosophy of how we secure our infrastructure, networks, and data, from verify once at the perimeter to continual verification of each user, device, application, and transaction."

The memo identifies five core goals that federal agencies must reach. These goals are organized through the Cybersecurity Information Systems Architecture (CISA) Maturity Model. CISA's Zero Trust model describes five complementary areas of effort, or pillars: identity, devices, networks, applications and workloads, and data. These themes cut across these areas: visibility and analytics, automation and orchestration, and governance.

## Scope of guidance

This series of articles provides practical guidance for administrators and decision makers to adapt a plan to meet memo requirements. It assumes that you're using Microsoft 365 products and therefore have an Azure AD tenant available. If this is inaccurate, see [Create a new tenant in Azure Active Directory](../fundamentals/active-directory-access-create-new-tenant.md).

The article series features guidance that encompasses existing agency investments in Microsoft technologies that align with the identity-related actions outlined in the memo:

* Agencies must employ centralized identity management systems for agency users that can be integrated into applications and common platforms.

*  Agencies must use strong multifactor authentication (MFA) throughout their enterprise:

   *  MFA must be enforced at the application layer instead of the network layer.

   *  For agency staff, contractors, and partners, phishing-resistant MFA is required. 
   
   *  For public users, phishing-resistant MFA must be an option.
   
   *  Password policies must not require the use of special characters or regular rotation.

* When agencies are authorizing users to access resources, they must consider at least one device-level signal alongside identity information about the authenticated user.

 
## Next steps

The following articles are part of this documentation set:

[Enterprise-wide identity management system](memo-22-09-enterprise-wide-identity-management-system.md)

[Multifactor authentication](memo-22-09-multi-factor-authentication.md)

[Authorization](memo-22-09-authorization.md)

[Other areas of Zero Trust](memo-22-09-other-areas-zero-trust.md)

For more information about Zero Trust, see:

[Securing identity with Zero Trust](/security/zero-trust/deploy/identity)
