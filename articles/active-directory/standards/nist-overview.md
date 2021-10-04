---
title: Achieve NIST authenticator assurance levels with Azure Active Directory
description: An overview of 
services: active-directory 
ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: how-to
author: barbaraselden
ms.author: baselden
manager: mtillman
ms.reviewer: 
ms.date: 4/26/2021
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Configure Azure Active Directory to meet NIST authenticator assurance levels

Providing services for federal agencies is complicated by the number and complexity of standards that you must meet. As a cloud service provider (CSP) or federal agency, it's your responsibility to ensure compliance with all relevant standards. Azure and Azure Active Directory (Azure AD) make this easier by enabling you to use our certifications, and then configure your specific requirements.

Azure is certified for more than 90 compliance offerings at the time of this writing. For more details, see [Trust your cloud](https://azure.microsoft.com/overview/trusted-cloud/).

## Why meet NIST standards? 

The National Institute of Standards and Technology (NIST) develops the technical requirements for US federal agencies that implement identity solutions. Organizations working with federal agencies must also meet these requirements. For more information about the NIST identity requirements, see [Special Publication 800-63 Revision 3](https://pages.nist.gov/800-63-3/sp800-63-3.html) (NIST SP 800-63-3).

NIST SP 800-63 is also referenced by:
* The Electronic Prescription of Controlled Substances [EPCS](https://deadiversion.usdoj.gov/ecomm/e_rx/) program. 
* [Financial Industry Regulatory Authority (FINRA) requirements](https://www.finra.org/rules-guidance). 
* Healthcare, defense, and other industry associations often use the NIST SP 800-63-3 as a baseline for identity and access management requirements.

NIST guidelines are referenced in other standards, most notably the Federal Risk and Authorization Management Program (FedRAMP) for CSPs. Azure is FedRAMP High Impact certified. 

The NIST digital identity guidelines cover proofing and authentication of users, such as employees, partners, suppliers, and customers or citizens. 

NIST SP 800-63-3 digital identity guidelines encompass three areas:

* [SP 800-63A](https://pages.nist.gov/800-63-3/sp800-63a.html) covers enrollment and identity proofing.

* [SP 800-63B](https://pages.nist.gov/800-63-3/sp800-63b.html) covers authentication and lifecycle management.

* [SP 800-63C](https://pages.nist.gov/800-63-3/sp800-63c.html) covers federation and assertions.

Each area has mapped out assurance levels. This article set provides guidance for attaining the authenticator assurance levels (AALs) in NIST SP 800-63B by using Azure AD and other Microsoft solutions.

## Next steps 

[Learn about AALs](nist-about-authenticator-assurance-levels.md)

[Authentication basics](nist-authentication-basics.md)

[NIST authenticator types](nist-authenticator-types.md)

[Achieve NIST AAL1 with Azure AD](nist-authenticator-assurance-level-1.md)

[Achieve NIST AAL2 with Azure AD](nist-authenticator-assurance-level-2.md)

[Achieve NIST AAL3 with Azure AD](nist-authenticator-assurance-level-3.md) 
