---
title: NIST authenticator assurance levels with Azure Active Directory
description: An overview of authenticator assurance levels as applied to Azure Active Directory
services: active-directory 
ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: how-to
author: gargi-sinha
ms.author: gasinh
manager: martinco
ms.reviewer: martinco
ms.date: 09/13/2022
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# About authenticator assurance levels

The National Institute of Standards and Technology (NIST) develops the technical requirements for US federal agencies that are implementing identity solutions. [NIST SP 800-63B](https://pages.nist.gov/800-63-3/sp800-63b.html) defines the technical guidelines for the implementation of digital authentication. It does so with a framework of authenticator assurance levels (AALs). AALs characterize the strength of the authentication of a digital identity. The guidance also covers the management of the lifecycle of authenticators, including revocation. 

The standard includes AAL requirements for these requirement categories:

* Permitted authenticator types

* Federal Information Processing Standards 140 (FIPS 140) verification level (FIPS 140 requirements are satisfied by [FIPS 140-2](https://csrc.nist.gov/publications/detail/fips/140/2/final) or newer revisions)

* Reauthentication

* Security controls

* Man-in-the-middle (MitM) resistance

* Verifier-impersonation resistance (phishing resistance)

* Verifier-compromise resistance

* Replay resistance

* Authentication intent

* Records retention policy

* Privacy controls

## Apply NIST AALs in your environment

> [!TIP]
> We recommend that you meet at least AAL2. Meet AAL3 if necessary for business reasons, industry standards, or compliance requirements.

In general, AAL1 isn't recommended because it accepts password-only solutions, and passwords are the most easily compromised form of authentication. For more information, see the following blog post: [Your Pa$$word doesn't matter](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/your-pa-word-doesn-t-matter/ba-p/731984). 

While NIST doesn't require verifier impersonation (also known as credential phishing) resistance until AAL3, we highly advise that you address this threat at all levels. You can select authenticators that provide verifier impersonation resistance, such as requiring that devices be joined to Azure Active Directory (Azure AD) or hybrid Azure AD. If you're using Office 365, you can use Office 365 Advanced Threat Protection, and specifically its [Anti-phishing policies](/microsoft-365/security/office-365-security/set-up-anti-phishing-policies).

As you evaluate the appropriate NIST AAL for your organization, consider whether your entire organization must meet NIST standards. If there are specific groups of users and resources that can be segregated, you might be able to apply the NIST AAL configurations to only a specific group of users and resources. 

## Security controls, privacy controls, records retention policy

Azure and Azure Government have earned a provisional authority to operate (P-ATO) at the [NIST SP 800-53 High Impact level](https://nvd.nist.gov/800-53/Rev4/impact/high) from the Joint Authorization Board. This level represents the highest bar for FedRAMP accreditation, and it authorizes the use of Azure and Azure Government to process highly sensitive data.

These Azure and Azure Government certifications satisfy the security controls, privacy controls, and records retention policy requirements for AAL1, AAL2, and AAL3.

The FedRAMP audit of Azure and Azure Government included the information security management system that encompasses infrastructure, development, operations, management, and support of in-scope services. When a P-ATO is granted, a cloud service provider still requires an authorization (an ATO) from any government agency it works with. For Azure, a government agency, or organizations working with them, can use the Azure P-ATO in its own security authorization process. The agency or organization can rely on it as the basis for issuing an agency ATO that also meets FedRAMP requirements.

Azure continues to support more services at FedRAMP High Impact levels than any other cloud provider. And while FedRAMP High in the Azure public cloud meets the needs of many US government customers, agencies with more stringent requirements rely on Azure Government. Azure Government provides additional safeguards, such as the heightened screening of personnel. Microsoft lists all Azure public services currently available in Azure Government to the FedRAMP High boundary, as well as services planned for the current year.

In addition, Microsoft is fully committed to [protecting and managing customer data](https://www.microsoft.com/trust-center/privacy/data-management) with clearly stated records retention policies. As a global company with customers in nearly every country in the world, Microsoft has a robust compliance portfolio to assist you. To view a complete list of our compliance offerings, see [Microsoft compliance offering](/compliance/regulatory/offering-home). 

## Next steps 

[NIST overview](nist-overview.md)

[Learn about AALs](nist-about-authenticator-assurance-levels.md)

[Authentication basics](nist-authentication-basics.md)

[NIST authenticator types](nist-authenticator-types.md)

[Achieve NIST AAL1 with Azure AD](nist-authenticator-assurance-level-1.md)

[Achieve NIST AAL2 with Azure AD](nist-authenticator-assurance-level-2.md)

[Achieve NIST AAL3 with Azure AD](nist-authenticator-assurance-level-3.md) 
‎
