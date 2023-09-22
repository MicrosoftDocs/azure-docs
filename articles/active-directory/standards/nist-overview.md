---
title: Achieve NIST authenticator assurance levels with Microsoft Entra ID
description: An overview of 
services: active-directory 
ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: how-to
author: gargi-sinha
ms.author: gasinh
manager: martinco
ms.reviewer: 
ms.date: 11/23/2022
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Configure Microsoft Entra ID to meet NIST authenticator assurance levels 

If you provide services for federal agencies, there can be challenges meeting multiple standards. As a cloud service provider (CSP) or federal agency, you ensure compliance with all relevant standards. Azure and Microsoft Entra ID make configuring requirements easier with our certifications. Azure is certified for more than 90 compliance offerings. For more details, see [Trust your cloud](https://azure.microsoft.com/overview/trusted-cloud/).

This article set has guidance on attaining the authenticator assurance levels (AALs) in NIST SP 800-63B by using Microsoft Entra ID and other Microsoft solutions. See Next steps below.

## Why meet NIST standards? 

The National Institute of Standards and Technology (NIST) develops the technical requirements for US federal agencies that implement identity solutions. Organizations working with federal agencies also must meet these requirements. For more information about the NIST identity requirements, see [Special Publication 800-63 Revision 3](https://pages.nist.gov/800-63-3/sp800-63-3.html) (NIST SP 800-63-3).

NIST SP 800-63 is referenced by:
* The Electronic Prescription of Controlled Substances [EPCS](https://deadiversion.usdoj.gov/ecomm/e_rx/) program
* [Financial Industry Regulatory Authority (FINRA) requirements](https://www.finra.org/rules-guidance)
* Healthcare, defense, and other industry associations often use the NIST SP 800-63-3 as a baseline for identity and access management requirements

NIST guidelines are referenced in other standards, most notably the Federal Risk and Authorization Management Program (FedRAMP) for CSPs. Azure is certified for FedRAMP High Impact. 

The NIST digital identity guidelines cover proofing and authentication of users, such as employees, partners, suppliers, customers, or citizens. 

NIST SP 800-63-3 digital identity guidelines encompass three areas:

* [SP 800-63A](https://pages.nist.gov/800-63-3/sp800-63a.html) - enrollment and identity proofing

* [SP 800-63B](https://pages.nist.gov/800-63-3/sp800-63b.html) - authentication and lifecycle management

* [SP 800-63C](https://pages.nist.gov/800-63-3/sp800-63c.html) - federation and assertions

Each area has assurance levels. Use the following links to help attain the authenticator assurance levels (AALs) in NIST SP 800-63B by using Microsoft Entra ID and other Microsoft solutions.

## Next steps 

[Learn about AALs](nist-about-authenticator-assurance-levels.md)

[Authentication basics](nist-authentication-basics.md)

[NIST authenticator types](nist-authenticator-types.md)

[Achieve NIST AAL1 with Microsoft Entra ID](nist-authenticator-assurance-level-1.md)

[Achieve NIST AAL2 with Microsoft Entra ID](nist-authenticator-assurance-level-2.md)

[Achieve NIST AAL3 with Microsoft Entra ID](nist-authenticator-assurance-level-3.md) 
