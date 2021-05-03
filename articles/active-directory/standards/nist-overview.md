---
title: Achieving NIST Authenticator Assurance Levels with Azure Active Directory
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

# Configure Azure Active Directory to meet NIST Authenticator Assurance Levels

Providing services for federal agencies is complicated by the number and complexity of standards that you must meet. As a cloud service provider (CSP) or federal agency, it is your responsibility to ensure compliance with all relevant standards. Azure and Azure Active Directory make this easier by enabling you to leverage our certifications, and then configure your specific requirements.
Azure is certified for 90+ compliance offerings. See [Trust your cloud](https://azure.microsoft.com/overview/trusted-cloud/) for details on Azure compliance and certifications.

## Why meet NIST standards? 

The National Institute of Standards and Technology (NIST) develops the technical requirements for US federal agencies implementing identity solutions. Organizations working with federal agencies must also meet these requirements. The NIST Identity requirements are found in the document [Special Publication 800-63 Revision 3](https://pages.nist.gov/800-63-3/sp800-63-3.html) (NIST SP 800-63-3).

NIST SP 800-63 is also referenced by
* the Electronic Prescription of Controlled Substances [ECPS](https://deadiversion.usdoj.gov/ecomm/e_rx/) program 
* [Financial Industry Regulatory Authority (FINRA) requirements](https://www.finra.org/rules-guidance). 
* Healthcare, defense, and other industry associations often use the NIST SP 800-63-3 as a baseline for identity and access management (IAM) requirements.

NIST guidelines are referenced in other standards, most notably the Federal Risk and Authorization Management Program (FedRAMP) for CSPs. Azure is FedRAMP High Impact certified. 

The NIST digital identity guidelines cover proofing and authentication of users such as employees, partners, suppliers, and customers or citizens. 

NIST SP 800-63-3 digital identity guidelines encompass three areas:

* [SP 800-63A](https://pages.nist.gov/800-63-3/sp800-63a.html) covers Enrollment & Identity Proofing

* [SP 800-63B](https://pages.nist.gov/800-63-3/sp800-63b.html) covers Authentication & Lifecycle management

* [SP 800-63C](https://pages.nist.gov/800-63-3/sp800-63c.html) covers Federation & Assertions

Each area has mapped out assurance levels. This article set provides guidance for attaining the Authenticator Assurance Levels (AALs) in NIST SP 800-63B by using the Azure Active Directory and other Microsoft solutions.

## Next Steps 

[Learn about AALs](nist-about-authenticator-assurance-levels.md)

[Authentication basics](nist-authentication-basics.md)

[NIST authenticator types](nist-authenticator-types.md)

[Achieving NIST AAL1 with Azure AD](nist-authenticator-assurance-level-1.md)

[Achieving NIST AAL2 with Azure AD](nist-authenticator-assurance-level-2.md)

[Achieving NIST AAL3 with Azure AD](nist-authenticator-assurance-level-3.md) 
