---
title: How to choose the right key management solution
titleSuffix: How to choose between Azure Key Vault, Azure Key Vault Managed HSM, Azure Cloud HSM, and Azure Payment HSM
description: Choose the right Azure key management solution. Compare Azure Key Vault, Managed HSM, Cloud HSM, and Payment HSM by use case, compliance, and cost.
services: security
author: msmbaldwin
ms.service: security
ms.topic: article
ms.date: 07/08/2026
ms.author: mbaldwin
ai-usage: ai-assisted
---

# How to choose the right Azure key management solution

Azure offers several solutions for cryptographic key storage and management in the cloud: Azure Key Vault (standard and premium offerings), Azure Key Vault Managed HSM, Azure Cloud HSM, and Azure Payment HSM. This article helps you choose the right solution based on your scenarios, requirements, and industry.

For an overview of key management concepts and detailed descriptions of each solution, see [Key management in Azure](key-management.md).

To narrow down a key management solution, follow the flowchart based on common high-level requirements and key management scenarios. You can also use the table based on specific customer requirements that follows it. If either resource suggests multiple products, or if you want to validate your choice, use the flowchart and table together to make a final decision. To compare common choices for similar organizations, see the table of common key management solutions by industry segment.

## Choose an Azure key management solution by scenario

The following chart describes common requirements and use case scenarios and the recommended Azure key management solution.

The chart refers to these common requirements:

- _FIPS-140_ is a US government standard with different levels of security requirements. For more information, see [Federal Information Processing Standard (FIPS) 140](/azure/compliance/offerings/offering-fips-140-2).
- _Key sovereignty_ is when the customer's organization has full and exclusive control of their keys, including control over what users and services can access the keys and key management policies.
- _Single tenancy_ refers to a single dedicated instance of an application deployed for each customer, rather than a shared instance among multiple customers. The need for single-tenant products is often found as an internal compliance requirement in financial service industries.

It also refers to these various key management use cases:

- _Encryption at rest_ is typically enabled for Azure IaaS, PaaS, and SaaS models. Applications such as Microsoft 365; Microsoft Purview Information Protection; platform services in which the cloud is used for storage, analytics, and service bus functionality; and infrastructure services in which operating systems and applications are hosted and deployed in the cloud use encryption at rest. _Customer-managed keys for encryption at rest_ are used by Azure Storage and Microsoft Entra. For highest security, keys should be HSM-backed, 3072-bit or 4096-bit RSA keys. For customer-managed key scenarios, Azure Key Vault Premium is the recommended minimum; Azure Key Vault Managed HSM is required for key sovereignty. If regulatory or contractual requirements mandate that key encryption keys (KEKs) physically reside outside Microsoft infrastructure, Managed HSM external key management (preview) can delegate wrap and unwrap operations to a customer-run external key management (EKM) Proxy in front of a customer-owned, customer-operated HSM outside Azure. Use external key management only when physical key control outside Microsoft infrastructure is mandatory; it supports wrap and unwrap only and is not covered by the Managed HSM service-level agreement (SLA). For more information about encryption at rest, see [Azure Data Encryption at Rest](encryption-atrest.md).
- _SSL/TLS offload_ is supported on Azure Key Vault Managed HSM and Azure Cloud HSM. Azure Cloud HSM supports traditional SSL/TLS offloading with Apache, NGINX, and F5 BIG-IP running in Azure Virtual Machines. Azure Key Vault Managed HSM provides high availability and security for Keyless TLS with F5 and NGINX.
- _Lift and shift_ refers to scenarios where a PKCS#11 application on-premises is migrated to Azure Virtual Machines and running software such as Oracle transparent data encryption (TDE) in Azure Virtual Machines. Lift and shift requiring payment PIN processing is supported by Azure Payment HSM. All other scenarios are supported by Azure Cloud HSM. Full native PKCS#11, JCA/JCE, and CNG/KSP support is only available with Azure Cloud HSM. Azure Key Vault Managed HSM offers [limited PKCS#11 support](/azure/key-vault/managed-hsm/tls-offload-library) for TLS offload scenarios with F5 and NGINX.
- _Payment PIN processing_ includes allowing card and mobile payment authorization and 3D-Secure authentication; PIN generation, management, and validation; payment credential issuing for cards, wearables, and connected devices; securing keys and authentication data; and sensitive data protection for point-to-point encryption, security tokenization, and EMV payment tokenization. This also includes certifications such as PCI DSS, PCI 3DS, and PCI PIN. These are only supported by Azure Payment HSM.

:::image type="content" source="./media/choosing-key-management-solutions/key-management-product-flow-chart.png" alt-text="Flowchart for choosing the right Azure key management solution based on requirements and use cases." lightbox="./media/choosing-key-management-solutions/key-management-product-flow-chart.png":::

The flowchart result is a starting point to identify the solution that best matches your needs.

## Compare key management solutions

Azure provides multiple key management solutions to allow customers to choose a product based on both high-level requirements and management responsibilities.

Provisioning and hosting are managed by Microsoft across all solutions. Key generation and management, roles and permissions granting, and monitoring and auditing are the responsibility of the customer across all solutions.

### Service characteristics and responsibilities

Use the following table to compare how each service works and who manages what. This trade-off of management responsibility ranges from Azure Key Vault having the least customer responsibility to Azure Payment HSM having the most.

|  | **Azure Key Vault Standard** | **Azure Key Vault Premium** | **Azure Key Vault Managed HSM** | **Azure Cloud HSM** | **Azure Payment HSM** |
| --- | --- | --- | --- | --- | --- |
| **Service model** | PaaS | PaaS | PaaS | IaaS-style HSM service | IaaS-style HSM service |
| **Authentication** | Microsoft Entra ID | Microsoft Entra ID | Microsoft Entra ID | HSM authentication (password) | HSM authentication (password) |
| **HSM administrative control** | Microsoft | Microsoft | Customer | Customer | Customer |
| **Patching and maintenance** | Microsoft | Microsoft | Microsoft | Microsoft | Customer |
| **Service health and hardware failover** | Microsoft | Microsoft | [Shared](/azure/key-vault/managed-hsm/disaster-recovery-guide) | [Shared](/azure/cloud-hsm/overview#customer-owned-highly-available-single-tenant-hsm-as-a-service) | [Customer](/azure/payment-hsm/deployment-scenarios#high-availability-deployment) |
| **Business continuity (within-region)** | Automatic | Automatic | [Automatic](/azure/key-vault/managed-hsm/disaster-recovery-guide) | [Automatic](/azure/cloud-hsm/overview#customer-owned-highly-available-single-tenant-hsm-as-a-service) | [Customer](/azure/payment-hsm/deployment-scenarios#high-availability-deployment) |
| **Disaster recovery (cross-region)** | Automatic | Automatic | [Manual](/azure/key-vault/managed-hsm/disaster-recovery-guide) | [Manual](/azure/cloud-hsm/backup-restore) | [Manual](/azure/payment-hsm/deployment-scenarios#disaster-recovery-deployment) |
| **Backup and restore** | [Built-in service backup](/azure/key-vault/general/backup) | [Built-in service backup](/azure/key-vault/general/backup) | [Service-managed](/azure/key-vault/managed-hsm/backup-restore) | [Manual HSM backup](/azure/cloud-hsm/backup-restore) | [Manual HSM backup](/azure/payment-hsm/support-guide#support-contacts) |

### Decision criteria

Use the following table to compare all the solutions side by side. Answer each question to help identify the solution that meets your requirements.

|  | **Azure Key Vault Standard** | **Azure Key Vault Premium** | **Azure Key Vault Managed HSM** | **Azure Cloud HSM** | **Azure Payment HSM** |
| --- | --- | --- | --- | --- | --- |
| What level of **compliance** do you need? | FIPS 140-2 Level 1 | FIPS 140-3 Level 3† | FIPS 140-3 Level 3, PCI DSS, PCI 3DS | FIPS 140-3 Level 3 | FIPS 140-2 Level 3, PCI HSM v3, PCI PTS HSM v3, PCI DSS, PCI 3DS, PCI PIN |
| Do you need **key sovereignty**? | No | No | Yes | Yes | Yes |
| Do you need **single tenancy**? | No | No | Yes | Yes | Yes |
| What are your **use cases**? | Encryption at rest, customer-managed keys, custom applications | Encryption at rest, customer-managed keys, custom applications | Encryption at rest, SSL/TLS offload, customer-managed keys, external key management (preview; wrap/unwrap only), custom applications | Lift and shift, PKCS#11, SSL/TLS offload, TDE, code signing | Payment PIN processing, custom applications |
| Do you need **HSM hardware protection**? | No | Yes | Yes | Yes | Yes |
| What kind of **objects** do you need to store? | Asymmetric keys, secrets, certificates | Asymmetric keys, secrets, certificates | Asymmetric and symmetric keys only‡ | Asymmetric and symmetric keys, certificates | Keys |
| Do you need **dedicated capacity**? | No | No | Yes | Yes | Yes |
| Do you need **customer control of root of trust**? | No | No | Yes | Yes | Yes |
| What is your **budget**? | $ | $$ | $$$ | $$$ | $$$$ |

## Common key management solution uses by industry segments

The following table lists common key management solutions by industry segment.

| **Industry** | **Suggested Azure solution** | **Considerations for suggested solutions** |
| --- | --- | --- |
| Enterprise or organization with strict security and compliance requirements, such as banking, government, or other highly regulated industries. | Azure Key Vault Managed HSM | Azure Key Vault Managed HSM provides FIPS 140-3 Level 3 compliance, and it is a PCI-compliant solution for e-commerce. It supports encryption for PCI DSS 4.0. It provides HSM-backed keys and gives customers key sovereignty and single tenancy. |
| Direct-to-consumer e-commerce merchant who needs to store, process, and transmit customers' credit cards to an external payment processor or gateway and needs a PCI-compliant solution. | Azure Key Vault Managed HSM | Azure Key Vault Managed HSM provides FIPS 140-3 Level 3 compliance, and it is a PCI-compliant solution for e-commerce. It supports encryption for PCI DSS 4.0. It provides HSM-backed keys and gives customers key sovereignty and single tenancy. |
| Service provider for financial services, an issuer, a card acquirer, a card network, a payment gateway/PSP, or 3DS solution provider looking for a single-tenant service that can meet PCI and multiple major compliance frameworks. | Azure Payment HSM | Azure Payment HSM provides FIPS 140-2 Level 3, PCI HSM v3, PCI DSS, PCI 3DS, and PCI PIN compliance. It provides key sovereignty and single tenancy, which are common internal compliance requirements for payment processing. Azure Payment HSM provides full payment transaction and PIN processing support. |
| Early-stage startup looking to prototype a cloud-native application. | Azure Key Vault Standard | Azure Key Vault Standard provides software-backed keys at an economy price. |
| Startup looking to bring a cloud-native application to production. | Azure Key Vault Premium, Azure Key Vault Managed HSM | Both Azure Key Vault Premium and Azure Key Vault Managed HSM provide HSM-backed keys* and are good fits for building cloud-native applications. |
| IaaS customer who wants to move an application to Azure Virtual Machines and HSMs. | Azure Cloud HSM | Azure Cloud HSM is designed specifically for IaaS scenarios and provides FIPS 140-3 Level 3 compliance with key sovereignty and single tenancy. It is ideal for lift-and-shift migrations requiring PKCS#11 support, such as migrating from on-premises HSMs, Azure Dedicated HSM, or AWS CloudHSM. Azure Cloud HSM does not integrate with Azure PaaS/SaaS services; for those scenarios, use Azure Key Vault Managed HSM instead. |

> [!NOTE]
> \* Azure Key Vault Premium allows the creation of both software-protected and HSM-protected keys. If you use Azure Key Vault Premium, verify that the key you create is HSM-protected.
>
> † Azure Key Vault Premium keys created on HSM Platform 2 are FIPS 140-3 Level 3. Keys created on the older HSM Platform 1 are FIPS 140-2 Level 2. For details, see [About keys](/azure/key-vault/keys/about-keys#compliance).
>
> ‡ Azure Key Vault Managed HSM stores cryptographic keys only. Unlike Key Vault vaults, it does not support secrets or certificates.

For detailed information about each Azure key management solution, including technical specifications and use cases, see [Key management in Azure](key-management.md).

## Next steps

- [Key management in Azure](key-management.md).
- [Azure Key Vault](/azure/key-vault/general/overview).
- [Azure Key Vault Managed HSM](/azure/key-vault/managed-hsm/overview).
- [Azure Cloud HSM](/azure/cloud-hsm/overview).
- [Azure Payment HSM](/azure/payment-hsm/overview).
- [What is Zero Trust?](/security/zero-trust/zero-trust-overview).
