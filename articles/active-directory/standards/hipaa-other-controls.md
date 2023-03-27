---
title: Configure Azure Active Directory HIPAA additional safeguards
description: Guidance on how to configure Azure Active Directory HIPAA additional control safeguards.
services: active-directory 
ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: how-to
author: janicericketts
ms.author: jricketts
manager: martinco
ms.reviewer: martinco
ms.date: 03/17/2023
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Other Safeguard guidance

Azure Active Directory meets identity-related practice requirements for implementing HIPAA safeguards. To be HIPAA compliant, it's the responsibility of companies to implement the safeguards using this guidance along with any other configurations or processes needed. This article contains guidance for achieving HIPAA compliance for the following three controls:

* Integrity Safeguard
* Person or Entity Authentication Safeguard
* Transmission Security Safeguard

## Integrity Safeguard guidance

Azure Active Directory meets identity-related practice requirements for implementing HIPAA safeguards. To be HIPAA compliant, implement the safeguards using this guidance along with any other configurations or processes needed.

For the **Data Modification Safeguard**:

* Protect files and emails, across all devices.

* Discover and classify sensitive data.

* Encrypt documents and emails that contain sensitive or personal data.

The following table provides a list of the **Integrity Safeguard** guidance from the HIPAA guidance and Microsoft’s recommendations to enable you to meet these requirements.

| <p><p><p><p>HIPAA safeguard<p> | <p><p><p><p>Recommendation<p> | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Guidance&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| - | - | - |
| **Data Modification** - Implement security measures to ensure that electronically transmitted electronic protected health information isn't improperly modified without detection until disposed of.| Classify and establish data access policies to ensure that a user without permission is blocked access. Configure monitor and audit logs for modifications and nonrepudiation of files and emails. | <p><p>Enable Microsoft Purview Information Protection (MPIP):<p>[Protect data with Microsoft Purview](/microsoft-365/compliance/information-protection-solution)<p>[Use framework for active steps](/microsoft-365/compliance/information-protection-solution)<p><p>Configure Microsoft Exchange Server eDiscovery:<p>[Microsoft Purview eDiscovery solutions](/microsoft-365/compliance/ediscovery)<p>[Create and remove an In-Place Hold](/exchange/security-and-compliance/in-place-ediscovery/assign-ediscovery-permissions)<p><p>Configure Secure/Multipurpose Internet Mail extension on Exchange Online:<p>[Configure email encryption](/microsoft-365/compliance/email-encryption)<p>[Configure S/MIME in Exchange Online](/exchange/security-and-compliance/smime-exo/configure-smime-exo)<p><p>Enable monitoring and logging:<p>[Security Control: Logging and Monitoring](/security/benchmark/azure/security-control-logging-monitoring)<p>[Microsoft Purview for auditing in Microsoft 365](/microsoft-365/compliance/audit-solutions-overview) |

## Person or Entity Authentication Safeguard guidance

Azure Active Directory meets identity-related practice requirements for implementing HIPAA safeguards. To be HIPAA compliant, implement the safeguards using this guidance along with any other configurations or processes needed.

For the Audit and Person and Entity Safeguard:

* Ensure that the end user claim is valid for data access.

* Identify and mitigate any risks for data that is stored.

The following table provides a list of the HIPAA Audit and Person or Entity Authentication Safeguard guidance in the first column. The second column has Microsoft’s recommendations to enable you to meet these requirements using Azure AD.

| <p><p><p><p>HIPAA safeguard<p> | <p><p><p><p>Recommendation<p> | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Guidance&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| - | - | - |
| **Person or Entity** - Implement procedures to verify that a person or entity seeking access to electronic protected health information is the one claimed.| Ensure that users and devices that access ePHI data are authorized. You must ensure devices are compliant and actions are audited to flag risks to the data owners. | <p><p>Enable MFA:<p>[Azure AD Multi-Factor authentication](../authentication/concept-mfa-howitworks.md)<p>[Configure Authenticator App](https://support.microsoft.com/account-billing/set-up-an-authenticator-app-as-a-two-step-verification-method-2db39828-15e1-4614-b825-6e2b524e7c95)<p>[Azure AD passwordless configuration](../authentication/concept-authentication-passwordless.md)<p><p>Enable Conditional Access policies:<p>[Build a Conditional Access policy](../conditional-access/concept-conditional-access-policies.md)<p><p>Configure device-based Conditional Access policy:<p>[Conditional Access with Microsoft Intune for device management](/mem/intune/protect/conditional-access)<p><p>Provision role-based access control (RBAC):<p>[Role-based access control in Azure AD](../roles/custom-overview.md)<p>[Use Azure AD built-in roles](../roles/permissions-reference.md)<p>[Build custom roles](../roles/custom-create.md) |

## Transmission Security Safeguard guidance

Azure Active Directory meets identity-related practice requirements for implementing HIPAA safeguards. To be HIPAA compliant, implement the safeguards using this guidance along with any other configurations or processes needed.

For encryption:

* Protect data confidentiality.

* Prevent data theft.

* Prevent unauthorized access to PHI.

* Ensure encryption level on data.

To protect transmission of PHI data:

* Protect sharing of PHI data.

* Protect access to PHI data.

* Ensure data transmitted is encrypted.

The following table provides a list of the Audit and Transmission Security Safeguard guidance from the HIPAA guidance and Microsoft’s recommendations to enable you to meet the safeguard implementation requirements with Azure AD.

| <p><p><p><p>HIPAA safeguard<p> | <p><p><p><p>Recommendation<p> | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Guidance&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| - | - | - |
| **Encryption** - Implement a mechanism to encrypt and decrypt electronic protected health information.| Ensure that ePHI data is encrypted and decrypted with the compliant encryption key/process. | <p><p>Review Microsoft 365 encryption points:<p>[Encryption with Microsoft Purview in Microsoft 365](/microsoft-365/compliance/encryption)<p><p>Review database encryption:<p>[Transparent data encryption](/sql/relational-databases/security/encryption/transparent-data-encryption?view=sql-server-ver16&preserve-view=true)<p>[Dynamic data masking for sensitive data](/azure/azure-sql/database/dynamic-data-masking-overview)<p><p>Review Azure Encryption points:<p>[Azure encryption capability](../../security/fundamentals/encryption-overview.md)<p><p>Assess data collection and retention governance:<p>[Microsoft Purview Data Lifecycle Management](/microsoft-365/compliance/data-lifecycle-management)<p>**Note:** As noted in [45 CFR 164.316](https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-C/section-164.316): **Time limit (Required)**. Retain the documentation required by [paragraph (b)(1)](https://www.ecfr.gov/current/title-45/section-164.316) of this section for six years from the date of its creation or the date when it last was in effect, whichever is later. |
| **Protect transmission of PHI data** - Implement technical security measures to guard against unauthorized access to electronic protected health information that is being transmitted over an electronic communications network.| Establish policies and procedures to protect data exchange that contains PHI data. | <p><p>Assess the state of on-premises applications:<p>[Azure AD Application Proxy to publish on-premises apps for remote users](../app-proxy/what-is-application-proxy.md)<p><p>Enable MFA:<p>[Azure AD MFA](../authentication/concept-mfa-howitworks.md)<p>[Configure Microsoft Authenticator](https://support.microsoft.com/account-billing/set-up-an-authenticator-app-as-a-two-step-verification-method-2db39828-15e1-4614-b825-6e2b524e7c95)<p><p>Enable conditional access policies for application access:<p>[Building Conditional Access policy](../conditional-access/concept-conditional-access-policies.md)<p><p>Review Exchange Online Protection (EOP) policies:<p>[Exchange Online spam and malware protection](/office365/servicedescriptions/exchange-online-protection-service-description/exchange-online-protection-feature-details?tabs=Anti-spam-and-anti-malware-protection)<p><p>Configure sensitivity labels:<p>[Microsoft Teams, Microsoft 365, SharePoint site sensitivity labels](/microsoft-365/compliance/sensitivity-labels-teams-groups-sites)<p><p>Assess whether a private connection is required to connect to services:<p>[Azure ExpressRoute](../../expressroute/expressroute-introduction.md)<p><p>Assess VPN requirements:<p>[VPN Gateway documentation](../../vpn-gateway/vpn-gateway-about-vpngateways.md) |

### Next Steps

* [Zero Trust Pillar: Data](/security/zero-trust/zero-trust-overview)

* [Zero Trust Pillar: Identity, Networks, Infrastructure, Data, Applications](/security/zero-trust/zero-trust-overview)
