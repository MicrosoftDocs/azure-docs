---
title: Configure Microsoft Entra HIPAA additional safeguards
description: Guidance on how to configure Microsoft Entra HIPAA additional control safeguards
services: active-directory 
ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: how-to
author: janicericketts
ms.author: jricketts
manager: martinco
ms.reviewer: martinco
ms.date: 04/13/2023
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Other safeguard guidance 

Microsoft Entra ID meets identity-related practice requirements for implementing Health Insurance Portability and Accountability Act of 1996 (HIPAA) safeguards. To be HIPAA compliant, it's the responsibility of companies to implement the safeguards using this guidance along with any other configurations or processes needed. This article contains guidance for achieving HIPAA compliance for the following three controls:

* Integrity Safeguard
* Person or Entity Authentication Safeguard
* Transmission Security Safeguard

## Integrity safeguard guidance

Microsoft Entra ID meets identity-related practice requirements for implementing HIPAA safeguards. To be HIPAA compliant, implement the safeguards using this guidance along with any other configurations or processes needed.

For the **Data Modification Safeguard**:

* Protect files and emails, across all devices.

* Discover and classify sensitive data.

* Encrypt documents and emails that contain sensitive or personal data.

The following content provides the guidance from HIPAA followed by a table with Microsoft's recommendations and guidance.

**HIPAA - integrity**

```Implement security measures to ensure that electronically transmitted electronic protected health information isn't improperly modified without detection until disposed of.```

| Recommendation | Action |
| - | - |
| Enable Microsoft Purview Information Protection (IP) | Discover, classify, protect, and govern sensitive data, covering storage and data transmitted.</br>Protecting your data through [Microsoft Purview IP](/microsoft-365/compliance/information-protection-solution) helps determine the data landscape, review the framework and take active steps to identify and protect your data. |
| Configure Exchange In-place hold | Exchange online provides several settings to support eDiscovery. [In-place hold](/exchange/security-and-compliance/in-place-ediscovery/assign-ediscovery-permissions) uses specific parameters on what items should be held. The decision matrix can be based on keywords, senders, receipts, and dates.</br>[Microsoft Purview eDiscovery solutions](/microsoft-365/compliance/ediscovery) is part of the Microsoft Purview compliance portal and covers all Microsoft 365 data sources. |
| Configure Secure/Multipurpose Internet Mail extension on Exchange Online | [S/MIME](/microsoft-365/compliance/email-encryption) is a protocol that is used for sending digitally signed and encrypted messages. It's based on asymmetric key pairing, a public and private key.</br>[Exchange Online](/exchange/security-and-compliance/smime-exo/configure-smime-exo) provides encryption and protection of the content of the email and signatures that verify the identity of the sender. |
| Enable monitoring and logging. | [Logging and monitoring](/security/benchmark/azure/security-control-logging-monitoring) are essential to securing an environment. The information is used to support investigations and help detect potential threats by identifying unusual patterns. Enable logging and monitoring of services to reduce the risk of unauthorized access.</br>[Microsoft Purview](/microsoft-365/compliance/audit-solutions-overview) auditing provides visibility into audited activities across services in Microsoft 365. It helps investigations by increasing audit log retention. |

## Person or entity authentication safeguard guidance

Microsoft Entra ID meets identity-related practice requirements for implementing HIPAA safeguards. To be HIPAA compliant, implement the safeguards using this guidance along with any other configurations or processes needed.

For the Audit and Person and Entity Safeguard:

* Ensure that the end user claim is valid for data access.

* Identify and mitigate any risks for data that is stored.

The following content provides the guidance from HIPAA followed by a table with Microsoft's recommendations and guidance.

**HIPAA - person or entity authentication**

```Implement procedures to verify that a person or entity seeking access to electronic protected health information is the one claimed.```

Ensure that users and devices that access ePHI data are authorized. You must ensure devices are compliant and actions are audited to flag risks to the data owners.

| Recommendation | Action |
| - | - |
|Enable multifactor authentication | [Microsoft Entra multifactor authentication](../authentication/concept-mfa-howitworks.md) protects identities by adding an extra layer of security. The extra layer provides an effective way to prevent unauthorized access. MFA enables the requirement of more validation of sign in credentials during the authentication process. Setting up the [Authenticator app](https://support.microsoft.com/account-billing/set-up-an-authenticator-app-as-a-two-step-verification-method-2db39828-15e1-4614-b825-6e2b524e7c95) provides one-click verification, or you can configure [Microsoft Entra passwordless configuration](../authentication/concept-authentication-passwordless.md). |
| Enable Conditional Access policies | [Conditional Access](../conditional-access/concept-conditional-access-policies.md) policies help to restrict access to only approved applications. Microsoft Entra analyses signals from either the user, device, or the location to automate decisions and enforce organizational policies for access to resources and data. |
| Set up device based Conditional Access Policy | [Conditional Access with Microsoft Intune](/mem/intune/protect/conditional-access) for device management and Microsoft Entra policies can use device status to either grant deny access to your services and data. By deploying device compliance policies, it determines if it meets security requirements to make decisions to either allow access to the resources or deny them. |
| Use role-based access control (RBAC) | [RBAC in Microsoft Entra ID](../roles/custom-overview.md) provides security on an enterprise level, with separation of duties. Adjust and review permissions to protect confidentiality, privacy and access management to resources and sensitive data, with the systems.</br>Microsoft Entra ID provides support for [built-in roles](../roles/permissions-reference.md), which is a fixed set of permissions that can't be modified. You can also create your own [custom roles](../roles/custom-create.md) where you can add a preset list. |

## Transmission security safeguard guidance

Microsoft Entra ID meets identity-related practice requirements for implementing HIPAA safeguards. To be HIPAA compliant, implement the safeguards using this guidance along with any other configurations or processes needed.

For encryption:

* Protect data confidentiality.

* Prevent data theft.

* Prevent unauthorized access to PHI.

* Ensure encryption level on data.

To protect transmission of PHI data:

* Protect sharing of PHI data.

* Protect access to PHI data.

* Ensure data transmitted is encrypted.

The following content provides a list of the Audit and Transmission Security Safeguard guidance from the HIPAA guidance and Microsoft’s recommendations to enable you to meet the safeguard implementation requirements with Microsoft Entra ID.

**HIPAA - encryption**

```Implement a mechanism to encrypt and decrypt electronic protected health information.```

Ensure that ePHI data is encrypted and decrypted with the compliant encryption key/process.

| Recommendation | Action |
| - | - |
| Review Microsoft 365 encryption points | [Encryption with Microsoft Purview in Microsoft 365](/microsoft-365/compliance/encryption) is a highly secure environment that offers extensive protection in multiple layers: the physical data center, security, network, access, application, and data security. </br>Review the encryption list and amend if more control is required. |
| Review database encryption | [Transparent data encryption](/sql/relational-databases/security/encryption/transparent-data-encryption?view=sql-server-ver16&preserve-view=true) adds a layer of security to help protect data at rest from unauthorized or offline access. It encrypts the database using AES encryption.</br>[Dynamic data masking for sensitive data](/azure/azure-sql/database/dynamic-data-masking-overview), which limits sensitive data exposure. It masks the data to nonauthorized users. The masking includes designated fields, which you define in a database schema name, table name, and column name. </br>New databases are encrypted by default, and the database encryption key is protected by a built-in server certificate. We recommend you review databases to ensure encryption is set on the data estate. |
| Review Azure Encryption points | [Azure encryption capability](../../security/fundamentals/encryption-overview.md) covers major areas from data at rest, encryption models, and key management using Azure Key Vault. Review the different encryption levels and how they match to scenarios within your organization. |
| Assess data collection and retention governance | [Microsoft Purview Data Lifecycle Management](/microsoft-365/compliance/data-lifecycle-management) enables you to apply retention policies. [Microsoft Purview Records Management](/microsoft-365/compliance/get-started-with-records-management) enables you to apply retention labels. This strategy helps you gain visibility into assets across the entire data estate. This strategy also helps you safeguard and manage sensitive data across clouds, apps, and endpoints.</br>**Important:** As noted in [45 CFR 164.316](https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-C/section-164.316): **Time limit (Required)**. Retain the documentation required by [paragraph (b)(1)](https://www.ecfr.gov/current/title-45/section-164.316) of this section for six years from the date of creation, or the date when it last was in effect, whichever is later. |

**HIPAA - protect transmission of PHI data**

```Implement technical security measures to guard against unauthorized access to electronic protected health information that is being transmitted over an electronic communications network.```

Establish policies and procedures to protect data exchange that contains PHI data.

| Recommendation | Action |
| - | - |
 | Assess the state of on-premises applications | [Microsoft Entra application proxy](../app-proxy/what-is-application-proxy.md) implementation publishes on-premises web applications externally and in a secure manner.</br>Microsoft Entra application proxy enables you to securely publish an external URL endpoint into Azure. |
| Enable multifactor authentication | [Microsoft Entra multifactor authentication](../authentication/concept-mfa-howitworks.md) protects identities by adding a layer of security. Adding more layers of security is an effective way to prevent unauthorized access. MFA enables the requirement of more validation of sign in credentials during the authentication process. You can configure the [Authenticator](https://support.microsoft.com/account-billing/set-up-an-authenticator-app-as-a-two-step-verification-method-2db39828-15e1-4614-b825-6e2b524e7c95) app to provide one-click verification or passwordless authentication. |
| Enable Conditional Access policies for application access | [Conditional Access](../conditional-access/concept-conditional-access-policies.md) policies helps to restrict access to approved applications. Microsoft Entra analyses signals from either the user, device, or the location to automate decisions and enforce organizational policies for access to resources and data. |
| Review Exchange Online Protection (EOP) policies | [Exchange Online spam and malware protection](/office365/servicedescriptions/exchange-online-protection-service-description/exchange-online-protection-feature-details?tabs=Anti-spam-and-anti-malware-protection) provides built-in malware and spam filtering. EOP protects inbound and outbound messages and is enabled by default. EOP services also provide anti-spoofing, quarantining messages, and the ability to report messages in Outlook. </br>The policies can be customized to fit company-wide settings, these take precedence over the default policies. |
| Configure sensitivity labels | [Sensitivity labels](/purview/sensitivity-labels-teams-groups-sites) from Microsoft Purview enable you to classify and protect your organizations data. The labels provide protection settings in documentation to containers. For example, the tool protects documents that are stored in Microsoft Teams and SharePoint sites, to set and enforce privacy settings. Extend labels to files and data assets such as SQL, Azure SQL, Azure Synapse, Azure Cosmos DB and AWS RDS. </br>Beyond the 200 out-of-the-box sensitive info types, there are advanced classifiers such as names entities, trainable classifiers, and EDM to protect custom sensitive types. |
| Assess whether a private connection is required to connect to services | [Azure ExpressRoute](/azure/expressroute/expressroute-introduction) creates private connections between cloud-based Azure datacenters and infrastructure that resides on-premises. Data isn't transferred over the public internet. </br>The service uses layer 3 connectivity, connects the edge router, and provides dynamic scalability. |
| Assess VPN requirements | [VPN Gateway documentation](/azure/vpn-gateway/vpn-gateway-about-vpngateways) connects an on-premises network to Azure through site-to-site, point-to-site, VNet-to-VNet and multisite VPN connection.</br>The service supports hybrid work environments by providing secure data transit. |

## Learn more

* [Zero Trust Pillar: Data](/security/zero-trust/zero-trust-overview)

* [Zero Trust Pillar: Identity, Networks, Infrastructure, Data, Applications](/security/zero-trust/zero-trust-overview)

## Next steps

* [Access Controls Safeguard guidance](hipaa-access-controls.md)

* [Audit Controls Safeguard guidance](hipaa-audit-controls.md)

* [Other Safeguard guidance](hipaa-other-controls.md)
