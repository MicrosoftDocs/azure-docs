---
title: NIST authenticator assurance levels with Microsoft Entra ID
description: An overview of authenticator assurance levels as applied to Microsoft Entra ID
services: active-directory 
ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: how-to
author: gargi-sinha
ms.author: gasinh
manager: martinco
ms.reviewer: martinco
ms.date: 11/23/2022
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Authenticator assurance levels 

The National Institute of Standards and Technology (NIST) develops technical requirements for US federal agencies implementing identity solutions. [NIST SP 800-63B](https://pages.nist.gov/800-63-3/sp800-63b.html) has the technical guidelines for digital authentication implementation, using an authenticator assurance levels (AALs) framework. AALs characterize the authentication strength of a digital identity. You can also learn about authenticator lifecycle management, including revocation. 

The standard includes AAL requirements for the following categories:

* Permitted authenticator types

* Federal Information Processing Standards 140 (FIPS 140) verification level. FIPS 140 requirements are satisfied by [FIPS 140-2](https://csrc.nist.gov/publications/detail/fips/140/2/final), or newer revisions.

* Reauthentication

* Security controls

* Man-in-the-middle (MitM) resistance

* Verifier-impersonation resistance (phishing resistance)

* Verifier-compromise resistance

* Replay resistance

* Authentication intent

* Records retention policy

* Privacy controls

## NIST AALs in your environment

In general, AAL1 isn't recommended because it accepts password-only solutions, the most easily compromised authentication. For more information, see the blog post, [Your Pa$$word doesn't matter](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/your-pa-word-doesn-t-matter/ba-p/731984). 

While NIST doesn't require verifier impersonation (credential phishing) resistance until AAL3, we advise you to address this threat at all levels. You can select authenticators that provide verifier impersonation resistance, such as requiring devices are joined to Microsoft Entra ID or hybrid Microsoft Entra ID. If you're using Office 365, you can use Office 365 Advanced Threat Protection, and its [anti-phishing policies](/microsoft-365/security/office-365-security/set-up-anti-phishing-policies).

As you evaluate the needed NIST AAL for your organization, consider whether your entire organization must meet NIST standards. If there are specific user groups and resources that can be segregated, you can apply NIST AAL configurations to those user groups and resources. 

> [!TIP]
> We recommend you meet at least AAL2. If necessary, meet AAL3 for business reasons, industry standards, or compliance requirements.

## Security controls, privacy controls, records retention policy

From the Joint Authorization Board, Azure and Azure Government have provisional authority to operate (P-ATO) at the [NIST SP 800-53 High Impact](https://nvd.nist.gov/800-53/Rev4/impact/high) level. This FedRAMP accreditation authorizes Azure and Azure Government to process highly sensitive data.

> [!IMPORTANT]
> Azure and Azure Government certifications satisfy the security controls, privacy controls, and records retention policy requirements for AAL1, AAL2, and AAL3.

The FedRAMP audit of Azure and Azure Government included the information security management system for infrastructure, development, operations, management, and support of in-scope services. When a P-ATO is granted, a cloud service provider requires an authorization (an ATO) from government agencies it works with. Government agencies, or organizations, can use the Azure P-ATO in their security authorization process, and use it as the basis for issuing an agency ATO that meets FedRAMP requirements.

Azure supports multiple services at FedRAMP High Impact. FedRAMP High in the Azure public cloud meets the needs of US government customers, however agencies with more stringent requirements use Azure Government. Azure Government safeguards include heightened personnel screening. In Azure Government, Microsoft lists available Azure public services, up to the FedRAMP High boundary, and services for the current year.

In addition, Microsoft is committed to [protecting and managing customer data](https://www.microsoft.com/trust-center/privacy/data-management) with clearly stated records retention policies. Microsoft has a large compliance portfolio. To see more, go to [Microsoft compliance offerings](/compliance/regulatory/offering-home). 

## Next steps 

[NIST overview](nist-overview.md)

[Learn about AALs](nist-about-authenticator-assurance-levels.md)

[Authentication basics](nist-authentication-basics.md)

[NIST authenticator types](nist-authenticator-types.md)

[Achieve NIST AAL1 with Microsoft Entra ID](nist-authenticator-assurance-level-1.md)

[Achieve NIST AAL2 with Microsoft Entra ID](nist-authenticator-assurance-level-2.md)

[Achieve NIST AAL3 with Microsoft Entra ID](nist-authenticator-assurance-level-3.md)
