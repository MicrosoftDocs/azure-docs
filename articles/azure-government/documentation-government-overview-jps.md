---
title: Azure support for public safety and justice
description: Guidance on using Azure cloud services for public safety and justice workloads.
ms.service: azure-government
ms.topic: article
author: stevevi
ms.author: stevevi
recommendations: false
ms.date: 02/06/2023
---

# Azure for public safety and justice

## Overview

Public safety and justice agencies are under mounting pressure to keep communities safe, reduce crime, and improve responsiveness. Cloud computing is transforming the way law enforcement agencies approach their work. It's helping with intelligent policing awareness systems, body camera systems across the country/region, and day-to-day mobile police collaboration.

When they're properly planned and secured, cloud services can deliver powerful new capabilities for public safety and justice agencies. These capabilities include digital evidence management, data analysis, and real-time decision support. Solutions can be delivered on the latest mobile devices. However, not all cloud providers are equal. As law enforcement agencies embrace the cloud, they need a cloud service provider they can trust. The core of the law enforcement mission demands partners who are committed to meeting a full range of security, compliance, and operational needs.

From devices to the cloud, Microsoft puts privacy and information security first, while increasing productivity for officers in the field and throughout the department. Public safety and justice agencies can combine highly secure mobile devices with "anytime-anywhere" access to the cloud. In doing so, they can contribute to ongoing investigations, analyze data, manage evidence, and help protect citizens from threats.

Microsoft treats Criminal Justice Information Services (CJIS) compliance as a commitment, not a check box. At Microsoft, we're committed to providing solutions that meet the applicable CJIS security controls, today and in the future. Moreover, we extend our commitment to public safety and justice through:

- [Microsoft Digital Crimes Unit](https://news.microsoft.com/on-the-issues/2021/04/15/how-microsofts-digital-crimes-unit-fights-cybercrime/)
- [Microsoft Cyber Defense Operations Center](https://www.microsoft.com/msrc/cdoc)
- [Microsoft solutions for public safety and justice](https://www.microsoft.com/industry/government/public-safety-and-justice)

## Criminal Justice Information Services (CJIS)

The [Criminal Justice Information Services](https://www.fbi.gov/services/cjis) (CJIS) Division of the US Federal Bureau of Investigation (FBI) gives state, local, and federal law enforcement and criminal justice agencies access to criminal justice information (CJI), for example, fingerprint records and criminal histories. Law enforcement and other government agencies in the United States must ensure that their use of cloud services for the transmission, storage, or processing of CJI complies with the [CJIS Security Policy](https://www.fbi.gov/services/cjis/cjis-security-policy-resource-center/view), which establishes minimum security requirements and controls to safeguard CJI.

### Azure and CJIS Security Policy

Microsoft's commitment to meeting the applicable CJIS regulatory controls help criminal justice organizations be compliant with the CJIS Security Policy when implementing cloud-based solutions. For more information about Azure support for CJIS, see [Azure CJIS compliance offering](/azure/compliance/offerings/offering-cjis).

The remainder of this article discusses technologies that you can use to safeguard CJI stored or processed in Azure cloud services. **These technologies can help you establish sole control over CJI that you're responsible for.**

> [!NOTE]
> You're wholly responsible for ensuring your own compliance with all applicable laws and regulations. Information provided in this article doesn't constitute legal advice, and you should consult your legal advisor for any questions regarding regulatory compliance.

## Location of customer data

Microsoft provides [strong customer commitments](https://www.microsoft.com/trust-center/privacy/data-location) regarding [cloud services data residency and transfer policies](https://azure.microsoft.com/global-infrastructure/data-residency/). Most Azure services are deployed regionally and enable you to specify the region into which the service will be deployed, for example, United States. This commitment helps ensure that [customer data](https://www.microsoft.com/trust-center/privacy/customer-data-definitions) stored in a US region will remain in the United States and won't be moved to another region outside the United States.

## Tenant separation

Azure is a hyperscale public multi-tenant cloud services platform that provides you with access to a feature-rich environment incorporating the latest cloud innovations such as artificial intelligence, machine learning, IoT services, big-data analytics, intelligent edge, and many more to help you increase efficiency and unlock insights into your operations and performance.

A multi-tenant cloud platform implies that multiple customer applications and data are stored on the same physical hardware. Azure uses logical isolation to segregate your applications and data from other customers. This approach provides the scale and economic benefits of multi-tenant cloud services while rigorously helping prevent other customers from accessing your data or applications.

Azure addresses the perceived risk of resource sharing by providing a trustworthy foundation for assuring multi-tenant, cryptographically certain, logically isolated cloud services using a common set of principles:

- User access controls with authentication and identity separation
- Compute isolation for processing
- Networking isolation including data encryption in transit
- Storage isolation with data encryption at rest
- Security assurance processes embedded in service design to correctly develop logically isolated services

Logical compute isolation is implemented via Hypervisor isolation, Drawbridge isolation, and User context-based isolation. Aside from logical compute isolation, Azure also provides you with physical compute isolation if you require dedicated physical servers for your workloads. For example, if you desire physical compute isolation, you can use Azure Dedicated Host or Isolated Virtual Machines, which are deployed on server hardware dedicated to a single customer. For more information, see [Azure guidance for secure isolation](./azure-secure-isolation-guidance.md).

## Data encryption

Azure has extensive support to safeguard your data using [data encryption](../security/fundamentals/encryption-overview.md), including various encryption models:

- Server-side encryption that uses service-managed keys, customer-managed keys (CMK) in Azure, or CMK in customer-controlled hardware.
- Client-side encryption that enables you to manage and store keys on-premises or in another secure location.

Data encryption provides isolation assurances that are tied directly to encryption key access. Since Azure uses strong ciphers for data encryption, only entities with access to encryption keys can have access to data. Revoking or deleting encryption keys renders the corresponding data inaccessible. **If you require extra security for your most sensitive customer data stored in Azure services, you can encrypt it using your own encryption keys you control in Azure Key Vault.**

### FIPS 140 validated cryptography

The [Federal Information Processing Standard (FIPS) 140](https://csrc.nist.gov/publications/detail/fips/140/3/final) is a US government standard that defines minimum security requirements for cryptographic modules in information technology products. Microsoft maintains an active commitment to meeting the [FIPS 140 requirements](/azure/compliance/offerings/offering-fips-140-2), having validated cryptographic modules since the standard’s inception in 2001. Microsoft validates its cryptographic modules under the US National Institute of Standards and Technology (NIST) [Cryptographic Module Validation Program](https://csrc.nist.gov/Projects/cryptographic-module-validation-program) (CMVP). Multiple Microsoft products, including many cloud services, use these cryptographic modules.

While the current CMVP FIPS 140 implementation guidance precludes a FIPS 140 validation for a cloud service, cloud service providers can obtain and operate FIPS 140 validated cryptographic modules for the computing elements that comprise their cloud services. Azure is built with a combination of hardware, commercially available operating systems (Linux and Windows), and Azure-specific version of Windows. Through the Microsoft [Security Development Lifecycle](https://www.microsoft.com/securityengineering/sdl/) (SDL), all Azure services use FIPS 140 approved algorithms for data security because the operating system uses FIPS 140 approved algorithms while operating at a hyper scale cloud. The corresponding crypto modules are FIPS 140 validated as part of the Microsoft [Windows FIPS validation program](/windows/security/threat-protection/fips-140-validation#modules-used-by-windows-server). Moreover, you can store your own cryptographic keys and other secrets in FIPS 140 validated hardware security modules (HSMs) under your control, also known as [customer-managed keys](../security/fundamentals/encryption-models.md#server-side-encryption-using-customer-managed-keys-in-azure-key-vault).

### Encryption key management

Proper protection and management of encryption keys is essential for data security. [Azure Key Vault](../key-vault/index.yml) is a cloud service for securely storing and managing secrets. Key Vault enables you to store your encryption keys in hardware security modules (HSMs) that are FIPS 140 validated. For more information, see [Data encryption key management](./azure-secure-isolation-guidance.md#data-encryption-key-management).

With Key Vault, you can import or generate encryption keys in HSMs, ensuring that keys never leave the HSM protection boundary to support *bring your own key* (BYOK) scenarios. Keys generated inside the Key Vault HSMs aren't exportable – there can be no clear-text version of the key outside the HSMs. This binding is enforced by the underlying HSM. **Azure Key Vault is designed, deployed, and operated such that Microsoft and its agents don't see or extract your cryptographic keys.** For more information, see [How does Azure Key Vault protect your keys?](../key-vault/managed-hsm/mhsm-control-data.md#how-does-azure-key-vault-managed-hsm-protect-your-keys) Therefore, if you use CMK stored in Azure Key Vault HSMs, you effectively maintain sole ownership of encryption keys.

### Data encryption in transit

Azure provides many options for [encrypting data in transit](../security/fundamentals/encryption-overview.md#encryption-of-data-in-transit). Data encryption in transit isolates your network traffic from other traffic and helps protect data from interception. For more information, see [Data encryption in transit](./azure-secure-isolation-guidance.md#data-encryption-in-transit).

### Data encryption at rest

Azure provides extensive options for [encrypting data at rest](../security/fundamentals/encryption-atrest.md) to help you safeguard your data and meet your compliance needs using both Microsoft-managed encryption keys and customer-managed encryption keys. This process relies on multiple encryption keys and services such as Azure Key Vault and Azure Active Directory to ensure secure key access and centralized key management. For more information about Azure Storage encryption and Azure Disk encryption, see [Data encryption at rest](./azure-secure-isolation-guidance.md#data-encryption-at-rest).

Azure SQL Database provides [transparent data encryption](/azure/azure-sql/database/transparent-data-encryption-tde-overview) (TDE) at rest by [default](https://azure.microsoft.com/updates/newly-created-azure-sql-databases-encrypted-by-default/). TDE performs real-time encryption and decryption operations on the data and log files. Database Encryption Key (DEK) is a symmetric key stored in the database boot record for availability during recovery. It's secured via a certificate stored in the master database of the server or an asymmetric key called TDE Protector stored under your control in [Azure Key Vault](../key-vault/general/security-features.md). Key Vault supports [bring your own key](/azure/azure-sql/database/transparent-data-encryption-byok-overview) (BYOK), which enables you to store the TDE Protector in Key Vault and control key management tasks including key rotation, permissions, deleting keys, enabling auditing/reporting on all TDE Protectors, and so on. The key can be generated by the Key Vault, imported, or [transferred to the Key Vault from an on-premises HSM device](../key-vault/keys/hsm-protected-keys.md). You can also use the [Always Encrypted](/azure/azure-sql/database/always-encrypted-azure-key-vault-configure) feature of Azure SQL Database, which is designed specifically to help protect sensitive data by allowing you to encrypt data inside your applications and [never reveal the encryption keys to the database engine](/sql/relational-databases/security/encryption/always-encrypted-database-engine). In this manner, Always Encrypted provides separation between those users who own the data (and can view it) and those users who manage the data (but should have no access).

### Data encryption in use

Microsoft enables you to protect your data throughout its entire lifecycle: at rest, in transit, and in use. **Azure confidential computing** is a set of data security capabilities that offers encryption of data while in use. With this approach, when data is in the clear, which is needed for efficient data processing in memory, the data is protected inside a hardware-based trusted execution environment (TEE), also known as an enclave.

Technologies like [Intel Software Guard Extensions](https://software.intel.com/sgx) (Intel SGX), or [AMD Secure Encrypted Virtualization](https://www.amd.com/en/processors/amd-secure-encrypted-virtualization) (SEV-SNP) are recent CPU improvements supporting confidential computing implementations. These technologies are designed as virtualization extensions and provide feature sets including memory encryption and integrity, CPU-state confidentiality and integrity, and attestation. For more information, see [Azure confidential computing](../confidential-computing/index.yml) documentation.

## Multi-factor authentication (MFA)

The CJIS Security Policy v5.9.2 revised the multi-factor authentication (MFA) requirements for CJI protection. MFA requires the use of two or more different factors defined as follows:

- Something you know, for example, username/password or personal identification number (PIN)
- Something you have, for example, a hard token such as a cryptographic key stored on or a one-time password (OTP) transmitted to a specialized hardware device
- Something you are, for example, biometric information

According to the CJIS Security Policy, identification and authentication of organizational users requires MFA to privileged and non-privileged accounts as part of CJI access control requirements. MFA is required at Authenticator Assurance Level 2 (AAL2), as described in the National Institute of Standards and Technology (NIST) [SP 800-63](https://pages.nist.gov/800-63-3/sp800-63-3.html) *Digital Identity Guidelines*. Authenticators and verifiers operated at AAL2 shall be validated to meet the requirements of FIPS 140 Level 1.

The [Microsoft Authenticator app](../active-directory/authentication/concept-authentication-authenticator-app.md) provides an extra level of security to your Azure Active Directory (Azure AD) account. It's available on mobile phones running Android and iOS. With the Microsoft Authenticator app, you can provide secondary verification for MFA scenarios to meet your CJIS Security Policy MFA requirements. As mentioned previously, CJIS Security Policy requires that solutions for hard tokens use cryptographic modules validated at FIPS 140 Level 1. The Microsoft Authenticator app meets FIPS 140 Level 1 validation requirements for all Azure AD authentications, as explained in [Authentication methods in Azure Active Directory - Microsoft Authenticator app](../active-directory/authentication/concept-authentication-authenticator-app.md#fips-140-compliant-for-azure-ad-authentication). FIPS 140 compliance for Microsoft Authenticator is currently in place for iOS and in progress for Android.

Moreover, Azure can help you meet and **exceed** your CJIS Security Policy MFA requirements by supporting the highest Authenticator Assurance Level 3 (AAL3). According to [NIST SP 800-63B Section 4.3](https://pages.nist.gov/800-63-3/sp800-63b.html#sec4), multi-factor **authenticators** used at AAL3 shall rely on hardware cryptographic modules validated at FIPS 140 Level 2 overall with at least FIPS 140 Level 3 for physical security, which exceeds the CJIS Security Policy MFA requirements. **Verifiers** at AAL3 shall be validated at FIPS 140 Level 1 or higher.

Azure Active Directory (Azure AD) supports both authenticator and verifier NIST SP 800-63B AAL3 requirements:

- **Authenticator requirements:** FIDO2 security keys, smartcards, and Windows Hello for Business can help you meet AAL3 requirements, including the underlying FIPS 140 validation requirements. Azure AD support for NIST SP 800-63B AAL3 **exceeds** the CJIS Security Policy MFA requirements.
- **Verifier requirements:** Azure AD uses the [Windows FIPS 140 Level 1](/windows/security/threat-protection/fips-140-validation) overall validated cryptographic module for all its authentication related cryptographic operations. It's therefore a FIPS 140 compliant verifier.

For more information, see [Azure NIST SP 800-63 documentation](/azure/compliance/offerings/offering-nist-800-63).

## Restrictions on insider access

Insider threat is characterized as potential for providing back-door connections and cloud service provider (CSP) privileged administrator access to your systems and data. For more information on how Microsoft restricts insider access to your data, see [Restrictions on insider access](./documentation-government-plan-security.md#restrictions-on-insider-access).

## Monitoring your Azure resources

Azure provides essential services that you can use to gain in-depth insight into your provisioned Azure resources and get alerted about suspicious activity, including outside attacks aimed at your applications and data. For more information about these services, see [Customer monitoring of Azure resources](./documentation-government-plan-security.md#customer-monitoring-of-azure-resources).

## Next steps

- [Azure Security](../security/fundamentals/overview.md)
- [Microsoft for public safety and justice](https://www.microsoft.com/industry/government/public-safety-and-justice)
- [Microsoft government solutions](https://www.microsoft.com/enterprise/government)
- [What is Azure Government?](./documentation-government-welcome.md)
- [Explore Azure Government](https://azure.microsoft.com/global-infrastructure/government/)
- [Azure Government compliance](./documentation-government-plan-compliance.md)
- [Criminal Justice Information Services](https://www.fbi.gov/services/cjis) (CJIS)
- [CJIS Security Policy](https://www.fbi.gov/services/cjis/cjis-security-policy-resource-center/view)
- [Azure CJIS compliance offering](/azure/compliance/offerings/offering-cjis)
- [Azure FedRAMP compliance offering](/azure/compliance/offerings/offering-fedramp)
- [NIST SP 800-53](https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final) *Security and Privacy Controls for Information Systems and Organizations*
