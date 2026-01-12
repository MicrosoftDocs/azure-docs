---
title: How to choose the right key management solution
titleSuffix: How to choose between Azure Key Vault, Azure Key Vault Managed HSM, Azure Cloud HSM, and Azure Payment HSM
description: This article provides a detailed explanation of how to choose the right Key Management solution in Azure.
services: security
author: chenkaren
ms.service: security
ms.topic: article
ms.date: 01/08/2026
ms.author: chenkaren
---

# How to choose the right Azure key management solution

Azure offers several solutions for cryptographic key storage and management in the cloud: Azure Key Vault (standard and premium offerings), Azure Key Vault Managed HSM, Azure Cloud HSM, and Azure Payment HSM. This article helps you choose the right solution based on your scenarios, requirements, and industry.

For an overview of key management concepts and detailed descriptions of each solution, see [Key management in Azure](key-management.md).

To narrow down a key management solution, follow the flowchart based on common high-level requirements and key management scenarios. Alternatively, use the table based on specific customer requirements that follows it. If either provides multiple products as solutions, or if you want reassurance about choosing the right product, use a combination of the flowchart and table to make a final decision. If you're curious about what other customers in the same industry use, read the table of common key management solutions by industry segment.

## Choose an Azure key management solution by scenario

The following chart describes common requirements and use case scenarios and the recommended Azure key management solution.

The chart refers to these common requirements:

- _FIPS-140_ is a US government standard with different levels of security requirements. For more information, see [Federal Information Processing Standard (FIPS) 140](/azure/compliance/offerings/offering-fips-140-2).
- _Key sovereignty_ is when the customer's organization has full and exclusive control of their keys, including control over what users and services can access the keys and key management policies.
- _Single tenancy_ refers to a single dedicated instance of an application deployed for each customer, rather than a shared instance among multiple customers. The need for single tenant products is often found as an internal compliance requirement in financial service industries.

It also refers to these various key management use cases:

- _Encryption at rest_ is typically enabled for Azure IaaS, PaaS, and SaaS models. Applications such as Microsoft 365; Microsoft Purview Information Protection; platform services in which the cloud is used for storage, analytics, and service bus functionality; and infrastructure services in which operating systems and applications are hosted and deployed in the cloud use encryption at rest. _Customer managed keys for encryption at rest_ is used with Azure Storage and Microsoft Entra. For highest security, keys should be HSM-backed, 3k or 4k RSA keys. For more information about encryption at rest, see [Azure Data Encryption at Rest](encryption-atrest.md).
- _SSL/TLS Offload_ is supported on Azure Managed HSM and Azure Cloud HSM. Customers have improved high availability, security, and the best price point on Azure Managed HSM for F5 and Nginx.
- _Lift and shift_ refer to scenarios where a PKCS11 application on-premises is migrated to Azure Virtual Machines and running software such as Oracle TDE in Azure Virtual Machines. Lift and shift requiring payment PIN processing is supported by Azure Payment HSM. All other scenarios are supported by Azure Cloud HSM. Legacy APIs and libraries such as PKCS11, JCA/JCE, and CNG/KSP are only supported by Azure Cloud HSM.
- _Payment PIN processing_ includes allowing card and mobile payment authorization and 3D-Secure authentication; PIN generation, management, and validation; payment credential issuing for cards, wearables, and connected devices; securing keys and authentication data; and sensitive data protection for point-to-point encryption, security tokenization, and EMV payment tokenization. This also includes certifications such as PCI DSS, PCI 3DS, and PCI PIN. These are only supported by Azure Payment HSM.

:::image type="content" source="./media/choosing-key-management-solutions/key-management-product-flow-chart.png" alt-text="Flow chart diagram that shows how to choose the right key management product based on requirements and scenarios." lightbox="./media/choosing-key-management-solutions/key-management-product-flow-chart.png":::

The flowchart result is a starting point to identify the solution that best matches your needs.

## Compare other customer requirements

Azure provides multiple key management solutions to allow customers to choose a product based on both high-level requirements and management responsibilities. There is a spectrum of management responsibilities ranging from Azure Key Vault, Azure Managed HSM, and Azure Cloud HSM having less customer responsibility (Microsoft handles patching and maintenance), to Azure Payment HSM having the most customer responsibility.

This trade-off of management responsibility between the customer and Microsoft and other requirements is detailed in the table below.

Provisioning and hosting are managed by Microsoft across all solutions. Key generation and management, roles and permissions granting, and monitoring and auditing are the responsibility of the customer across all solutions.

Use the table to compare all the solutions side by side. Begin from top to bottom, answering each question found on the left-most column to help you choose the solution that meets all your needs, including management overhead and costs.

|  | **AKV Standard** | **AKV Premium** | **Azure Key Vault Managed HSM** | **Azure Cloud HSM** | **Azure Payment HSM** |
| --- | --- | --- | --- | --- | --- |
| What level of **compliance** do you need? | FIPS 140-2 level 1 | FIPS 140-3 level 3 | FIPS 140-3 level 3, PCI DSS, PCI 3DS | FIPS 140-3 level 3 | FIPS 140-2 level 3, PCI HSM v3, PCI PTS HSM v3, PCI DSS, PCI 3DS, PCI PIN |
| Do you need **key sovereignty**? | No | No | Yes | Yes | Yes |
| What kind of **tenancy** are you looking for? | Multitenant | Multitenant | Single Tenant | Single Tenant | Single Tenant |
| What are your **use cases**? | Encryption at Rest, CMK, custom | Encryption at Rest, CMK, custom | Encryption at Rest, TLS Offload, CMK, custom | Lift and shift, PKCS#11, TLS Offload, TDE, code signing | Payment PIN processes, custom |
| Do you want **HSM hardware protection**? | No | Yes | Yes | Yes | Yes |
| What is your **budget**? | $ | $$ | $$$ | $$$ | $$$$ |
| Who takes responsibility for **patching and maintenance**? | Microsoft | Microsoft | Microsoft | Microsoft | Customer |
| Who takes responsibility for **service health and hardware failover**? | Microsoft | Microsoft | Shared | Microsoft | Customer |
| What kind of **objects** are you using? | Asym Keys, Secrets, Certs | Asym Keys, Secrets, Certs | Asym/Sym Keys | Asym/Sym Keys | Local Master Key |
| **Root of trust control** | Microsoft | Microsoft | Customer | Customer | Customer |

## Common key management solution uses by industry segments

Here is a list of the key management solutions we commonly see being utilized based on industry.

| **Industry** | **Suggested Azure solution** | **Considerations for suggested solutions** |
| --- | --- | --- |
| I am an enterprise or an organization with strict security and compliance requirements (ex: banking, government, highly regulated industries). | Azure Key Vault Managed HSM | Azure Key Vault Managed HSM provides FIPS 140-3 Level 3 compliance, and it is a PCI compliant solution for ecommerce. It supports encryption for PCI DSS 4.0. It provides HSM backed keys and gives customers key sovereignty and single tenancy. |
| I am a direct-to-consumer ecommerce merchant who needs to store, process, and transmit my customers' credit cards to my external payment processor/gateway and looking for a PCI compliant solution. | Azure Key Vault Managed HSM | Azure Key Vault Managed HSM provides FIPS 140-3 Level 3 compliance, and it is a PCI compliant solution for ecommerce. It supports encryption for PCI DSS 4.0. It provides HSM backed keys and gives customers key sovereignty and single tenancy. |
| I am a service provider for financial services, an issuer, a card acquirer, a card network, a payment gateway/PSP, or 3DS solution provider looking for a single tenant service that can meet PCI and multiple major compliance frameworks. | Azure Payment HSM | Azure Payment HSM provides FIPS 140-2 Level 3, PCI HSM v3, PCI DSS, PCI 3DS, and PCI PIN compliance. It provides key sovereignty and single tenancy, common internal compliance requirements around payment processing. Azure Payment HSM provides full payment transaction and PIN processing support. |
| I am an early-stage startup customer looking to prototype a cloud-native application. | Azure Key Vault Standard | Azure Key Vault Standard provides software-backed keys at an economy price. |
| I am a startup customer looking to produce a cloud-native application. | Azure Key Vault Premium, Azure Key Vault Managed HSM | Both Azure Key Vault Premium and Azure Key Vault Managed HSM provide HSM-backed keys* and are the best solutions for building cloud native applications. |
| I am an IaaS customer wanting to move my application to use Azure VM/HSMs. | Azure Cloud HSM | Azure Key Vault Managed HSM supports IaaS scenarios and provides FIPS 140-3 Level 3 compliance with key sovereignty. Azure Cloud HSM is ideal for lift-and-shift scenarios requiring PKCS#11 support, such as migrating from on-premises HSMs, Azure Dedicated HSM, or AWS CloudHSM. |

For detailed information about each Azure key management solution, including technical specifications and use cases, see [Key management in Azure](key-management.md).


## What's next

- [Key management in Azure](key-management.md)
- [Azure Key Vault](/azure/key-vault/general/overview)
- [Azure Key Vault Managed HSM](/azure/key-vault/managed-hsm/overview)
- [Azure Cloud HSM](/azure/cloud-hsm/overview)
- [Azure Payment HSM](/azure/payment-hsm/overview)
- [What is Zero Trust?](/security/zero-trust/zero-trust-overview)
