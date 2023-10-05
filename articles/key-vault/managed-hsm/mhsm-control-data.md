---
title: Control your cloud data by using Managed HSM
description: Get an overview of the safeguards and technical measures that help customers meet compliance requirements in Azure Key Vault Managed HSM.
ms.service: key-vault
ms.subservice: managed-hsm
ms.topic: concept-article
author: nkondamudi
ms.author: nkondamudi
ms.date: 06/13/2022
---

# Control your data in the cloud by using Managed HSM

Microsoft values, protects, and defends privacy. We believe in transparency so that people and organizations can control their data and have meaningful choices in how it's used. We empower and defend the privacy choices of every person who uses our products and services.

In this article, we take a deep dive on [Azure Key Vault Managed HSM](./overview.md) security controls for encryption and how it provides additional safeguards and technical measures to help our customers meet their compliance requirements.

Encryption is one of the key technical measures you can take to get sole control of your data. Azure fortifies your data through state-of-the-art encryption technologies, both for data at rest and for data in transit. Our encryption products erect barriers against unauthorized access to the data, including two or more independent encryption layers to protect against compromises of any single layer. In addition, Azure has clearly defined, well-established responses, policies and processes, strong contractual commitments, and strict physical, operational, and infrastructure security controls to provide our customers the ultimate control of their data in the cloud. The fundamental premise of Azure’s key management strategy is to give our customers more control over their data. We use a [zero trust](https://www.microsoft.com/security/business/zero-trust) posture with advanced enclave technologies, hardware security modules (HSMs), and identity isolation that reduces Microsoft access to customer keys and data.

*Encryption at rest* provides data protection for stored data at rest and as required by an organization's need for data governance and compliance efforts. Microsoft’s compliance portfolio is the broadest in all public clouds worldwide, with industry standards and government regulations such as [HIPAA](https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html),  [General Data Protection Regulation](https://gdpr.eu/), and [Federal Information Processing Standards (FIPS) 140-2 and 3](https://csrc.nist.gov/publications/detail/fips/140/2/final). These standards and regulations lay out specific safeguards for data protection and encryption requirements. In most cases, a mandatory measure is required for compliance.

## How does encryption at rest work?

:::image type="content" source="../media/control-your-data-enc-at-rest.png" border="false" alt-text="Diagram that demonstrates how encryption at rest works.":::

Azure Key Vault services provide encryption and key management solutions that safeguard cryptographic keys, certificates, and other secrets that cloud applications and services use to protect and control data that's encrypted at rest.

Secure key management is essential to protect and control data in the cloud. Azure offers various solutions that you can use to manage and control access to encryption keys so that you have choice and flexibility to meet stringent data protection and compliance needs.

- **Azure platform encryption** is a *platform-managed* encryption solution that encrypts by using host-level encryption. Platform-managed keys are encryption keys that are generated, stored, and managed entirely by Azure.
- **Customer-managed keys** are keys that are created, read, deleted, updated, and administered entirely by the customer. Customer-managed keys can be stored in a cloud key management service like Azure Key Vault.
- **Azure Key Vault Standard** encrypts by using a software key and is FIPS 140-2 Level 1 compliant.
- **Azure Key Vault Premium** encrypts by using FIPS 140-2 Level 2 HSM-protected keys.
- **Azure Key Vault Managed HSM** encrypts by using single-tenant FIPS 140-2 Level 3 HSM protected keys and is fully managed by Microsoft. It provides customers with sole control of the cryptographic keys.

For added assurance, in Azure Key Vault Premium and Azure Key Vault Managed HSM, you can [bring your own key (BYOK)](../keys/hsm-protected-keys-byok.md) and import HSM-protected keys from an on-premises HSM.

## Portfolio of Azure key management products

|  | Azure Key Vault Standard | Azure Key Vault Premium | Azure Key Vault Managed HSM |
|:-|-|-|-|
| **Tenancy** | Multitenant | Multitenant | Single-tenant |
| **Compliance** | FIPS 140-2 Level 1 | FIPS 140-2 Level 2 | FIPS 140-2 Level 3 |
| **High availability** | Automatic | Automatic | Automatic |
| **Use cases** | Encryption at rest | Encryption at rest | Encryption at rest |
| **Key controls** | Customer | Customer | Customer |
| **Root of trust control** | Microsoft | Microsoft | Customer |

Azure Key Vault is a cloud service that you can use to securely store and access secrets. A secret is anything that you want to securely control access to and can include API keys, passwords, certificates, and cryptographic keys.

Key Vault supports two types of containers:

- Vaults

  - Standard tier: Vaults support storing secrets, certificates, and software-backed keys.
  - Premium tier: Vaults support storing secrets, certificates, software-backed keys, and HSM-backed keys.
- Managed hardware security module (HSM)

  - Managed HSM supports only HSM-backed keys.

For more information, see [Azure Key Vault Concepts](../general/basic-concepts.md) and [Azure Key Vault REST API overview](https://github.com/MicrosoftDocs/azure-docs/blob/main/articles/key-vault/general/about-keys-secrets-certificates.md).

## What is Azure Key Vault Managed HSM?

Azure Key Vault Managed HSM is a fully managed, highly available, single-tenant, standards-compliant cloud service that has a customer-controlled security domain that enables you to store cryptographic keys for your cloud applications by using FIPS 140-2 Level 3 validated HSMs.

## How does Azure Key Vault Managed HSM protect your keys?

Azure Key Vault Managed HSM uses a defense in depth and [zero trust](https://www.microsoft.com/security/business/zero-trust?rtc=1) security posture that uses multiple layers, including physical, technical, and administrative security controls to protect and defend your data.

Azure Key Vault and Azure Key Vault Managed HSM are designed, deployed, and operated so that *Microsoft and its agents are precluded from accessing, using, or extracting any data that's stored in the service, including cryptographic keys*.

Customer-managed keys that are securely created in or securely imported to the HSM devices, unless set otherwise by the customer, aren't extractable and are never visible in plaintext to Microsoft systems, employees, or agents.

The Key Vault team explicitly doesn't have operating procedures for granting this kind of access to Microsoft and its agents, even if authorized by a customer.

We won't attempt to defeat customer-controlled encryption features like Azure Key Vault or Azure Key Vault Managed HSM. If faced with a legal demand to do so, we would challenge such a demand on any lawful basis, consistent with our [customer commitments](https://blogs.microsoft.com/on-the-issues/2020/11/19/defending-your-data-edpb-gdpr/).

Next, we take a detailed look at how these security controls are implemented.

### Security controls in Azure Key Vault Managed HSM

Azure Key Vault Managed HSM uses the following types of security controls:

- Physical
- Technical
- Administrative

#### Physical security controls

The core of Managed HSM is the hardware security module (HSM). An HSM is a specialized, hardened, tamper-resistant, high-entropy, dedicated cryptographic processor that is validated to the FIPS 140-2 Level 3 standard. All components of the HSM are further covered in hardened epoxy and a metal casing to keep your keys safe from an attacker. The HSMs are housed in racks of servers across several datacenters, regions, and geographies. These geographically dispersed datacenters comply with key industry standards such as [ISO/IEC 27001:2013](/azure/compliance/offerings/offering-iso-27001) and [NIST SP 800-53](../../governance/policy/samples/nist-sp-800-53-r4.md) for security and reliability.

Microsoft designs, builds, and operates datacenters in a way that strictly controls physical access to the areas where your keys and data are stored. Additional layers of [physical security](../../security/fundamentals/physical-security.md), such as tall fences made of concrete and steel, dead-bolt steel doors, thermal alarm systems, closed-circuit live camera monitoring, 24x7 security personnel, need-to-access basis with approval per floor, rigorous staff training, biometrics, background checks, and access request and approval are mandated. The HSM devices and related servers are locked in a cage, and cameras film the front and back of the servers.

#### Technical security controls

Several layers of technical controls in Managed HSM further protect your key material. But most importantly, they prevent Microsoft from accessing the key material.

- **Confidentiality**: The Managed HSM service runs inside a trusted execution environment that's built on Intel Software Guard Extensions (Intel SGX). Intel SGX offers enhanced protection from internal and external attackers by using hardware isolation in enclaves that protect data in use.

  Enclaves are secured portions of the hardware's processor and memory. You can't view data or code inside the enclave, even with a debugger. If untrusted code tries to change content in the enclave memory, Intel SGX disables the environment and denies the operation.

  These unique capabilities help you protect your cryptographic key material from being accessible or visible as clear text. Also, [Azure confidential computing](../../confidential-computing/overview.md) offers solutions to enable the isolation of your sensitive data while it's being processed in the cloud.

- **Security domain**: A [security domain](./security-domain.md) is an encrypted blob that contains extremely sensitive cryptographic information. The security domain contains artifacts like the HSM backup, user credentials, the signing key, and the data encryption key that's unique to your managed HSM.

  The security domain is generated both in the managed HSM hardware and in the service software enclaves during initialization. After the managed HSM is provisioned, you must create at least three RSA key pairs. You send the public keys to the service when you request the security domain download. After the security domain is downloaded, the managed HSM moves into an activated state and is ready for you to consume. Microsoft personnel have no way of recovering the security domain, and they can't access your keys without the security domain.

- **Access controls and authorization**: Access to a managed HSM is controlled through two interfaces, the management plane and the data plane.

  The management plane is where you manage the HSM itself. Operations in this plane include creating and deleting managed HSMs and retrieving managed HSM properties.

  The data plane is where you work with the data that's stored in a managed HSM, which is HSM-backed encryption keys. From the data plane interface, you can add, delete, modify, and use keys to perform cryptographic operations, manage role assignments to control access to the keys, create a full HSM backup, restore a full backup, and manage security domain.
  
  To access a managed HSM in either plane, all callers must have proper authentication and authorization. *Authentication* establishes the identity of the caller. *Authorization* determines which operations the caller can execute. A caller can be any one of the security principals that are defined in Azure Active Directory: User, group, service principal, or managed identity.

  Both planes use Azure Active Directory for authentication. For authorization, they use different systems:

  - The management plane uses Azure role-based access control (Azure RBAC), an authorization system that's built on Azure Resource Manager.
  - The data plane uses a managed HSM-level RBAC (Managed HSM local RBAC), an authorization system that's implemented and enforced at the managed HSM level. The local RBAC control model allows designated HSM administrators to have complete control over their HSM pool that even the management group, subscription, or resource group administrators can't override.
  - **Encryption in transit**: All traffic to and from the Managed HSM is always encrypted with TLS (Transport Layer Security versions 1.3 and 1.2 are supported) to protect against data tampering and eavesdropping where the TLS termination happens inside the SGX enclave and not in the untrusted host
  - **Firewalls**: Managed HSM can be configured to restrict who can reach the service in the first place, which further shrinks the attack surface. We allow you to configure Managed HSM to deny access from the public internet and only allow traffic from trusted Azure services (such as Azure Storage)
  - **Private endpoints**: By enabling a private endpoint, you're bringing the Managed HSM service into your virtual network allowing you to isolate that service only to trusted endpoints like your virtual network and Azure services. All traffic to and from your managed HSM will travel along the secure Microsoft backbone network without having to traverse the public internet.
  - **Monitoring and logging**: The outermost layer of protection is the monitoring and logging capabilities of Managed HSM. By using the Azure Monitor service, you can check your logs for analytics and alerts to ensure that access patterns conform with your expectations. This allows members of your security team to have visibility into what is happening within the Managed HSM service. If something doesn't look right, you can always roll your keys or revoke permissions.
  - **Bring your own key (BYOK)**: BYOK enables Azure customers to use any supported on-premises HSMs to generate keys, and then import them to the managed HSM. Some customers prefer to use on-premises HSMs to generate keys to meet regulatory and compliance requirements. Then, they use BYOK to securely transfer an HSM-protected key to the managed HSM. The key to be transferred never exists outside of an HSM in plaintext form. During the import process, the key material is protected with a key that's held in the managed HSM.
  - **External HSM**: Some customers have asked us if they can explore the option of having the HSM outside the Azure cloud to keep the data and keys segregated with an external HSM, either on a third-party cloud or on-premises. Although using a third-party HSM outside of Azure seems to give customers more control over keys, it introduces several concerns, such as latency that causes performance issues, SLA slip that's caused by issues with the third-party HSM, and maintenance and training costs. Also, a third-party HSM can't use key Azure features like soft delete and purge protection. We continue to evaluate this technical option with our customers to help them navigate the complex security and compliance landscape.

#### Administrative security controls

These administrative security controls are in place in Azure Key Vault Managed HSM:

- **Data defense**. You have Microsoft’s strong commitment to challenge government requests and to [defend your data](https://blogs.microsoft.com/on-the-issues/2020/11/19/defending-your-data-edpb-gdpr/).
- **Contractual obligations**. It offers control obligations for security and customer data protection as discussed in [Microsoft Trust Center](https://www.microsoft.com/trust-center?rtc=1).
- **[Cross-region replication](../../availability-zones/cross-region-replication-azure.md)**. Soon, you can use geo replication in Managed HSM to deploy HSMs in a secondary region.
- **Disaster recovery**. Azure offers an end-to-end backup and disaster recovery solution that is simple, secure, scalable, and cost-effective:
  - [Business continuity management program](../../availability-zones/business-continuity-management-program.md)
  - [Azure Site Recovery](../../site-recovery/index.yml)
  - [Azure Backup](../../backup/index.yml)
  - [Azure well-architected framework](/azure/architecture/framework/)
- **[Microsoft Security Response Center](https://www.microsoft.com/msrc) (MSRC)**. Managed HSM service administration is tightly integrated with MSRC.
  - Security monitoring for unexpected administrative operations with full 24/7 security response
- **[Cloud resilient and secure supply chain](https://azure.microsoft.com/blog/advancing-reliability-through-a-resilient-cloud-supply-chain/)**. Managed HSM advances reliability through a resilient cloud supply chain.
- **[Regulatory compliance built-in initiative](../../governance/policy/samples/built-in-initiatives.md#regulatory-compliance)**. Compliance in Azure Policy provides built-in initiative definitions to view a list of the controls and compliance domains based on responsibility (Customer, Microsoft, Shared). For Microsoft-responsible controls, we provide additional details of our audit results based on third-party attestation and our implementation details to achieve that compliance.
- **[Audit reports](https://servicetrust.microsoft.com/ViewPage/MSComplianceGuideV3)**. Resources to help information security and compliance professionals understand cloud features, and to verify technical compliance and control requirements
- **Assume breach philosophy**. We assume that any component could be compromised at any time, and we design and test appropriately. We do regular Red Team/Blue Team exercises ([attack simulation](/compliance/assurance/assurance-monitoring-and-testing)).

Managed HSM offers robust physical, technical, and administrative security controls. Managed HSM gives you sole control of your key material for a scalable, centralized cloud key management solution that helps satisfy growing compliance, security, and privacy needs. Most importantly it provides encryption safeguards that are required for compliance. Our customers can be assured that we're committed to ensuring that their data is protected with transparency about our practices as we progress toward the implementation of the Microsoft EU Data Boundary.

For more information, reach out to your Azure account team to facilitate a discussion with the Azure Key Management product team.
