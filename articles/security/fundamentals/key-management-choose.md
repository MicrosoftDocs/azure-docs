---
title: How to choose the right key management solution
titleSuffix: How to choose between Azure Key Vault, Azure Managed HSM, Azure Dedicated HSM, and Azure Payment HSM
description: This article provides a detailed explanation of how to choose the right Key Management solution in Azure.
services: security
author: chenkaren

ms.service: security
ms.topic: article
ms.date: 07/25/2023
ms.author: chenkaren
ms.collection:
---

# How to choose the right key management solution

Azure offers multiple solutions for cryptographic key storage and management in the cloud: Azure Key Vault (standard and premium offerings), Azure Managed HSM, Azure Dedicated HSM, and Azure Payment HSM. It may be overwhelming for customers to decide which key management solution is correct for them. This paper aims to help customers navigate this decision-making process by presenting the range of solutions based on three different considerations: scenarios, requirements, and industry.

To begin narrowing down a key management solution, follow the flowchart based on common high-level requirements and key management scenarios. Alternatively, use the table based on specific customer requirements that directly follows it. If either provide multiple products as solutions, use a combination of the flowchart and table to help in making a final decision. If curious about what other customers in the same industry are using, read the table of common key management solutions by industry segment. To learn more about a specific solution, use the links at the end of the document.

## Choose a key management solution by scenario

The following chart describes common requirements and use case scenarios and the recommended Azure key management solution. 

The chart refers to these common requirements:

- _FIPS-140_ is a US government standard with different levels of security requirements. For more information, see [Federal Information Processing Standard (FIPS) 140](/azure/compliance/offerings/offering-fips-140-2).
- _Key sovereignty_ is when the customer's organization has full and exclusive control of their keys, including control over what users and services can access the keys and key management policies. 
- _Single tenancy_ refers to a single dedicated instance of an application deployed for each customer, rather than a shared instance amongst multiple customers. The need for single tenant products is often found as an internal compliance requirement in financial service industries.

It also refers to these various key management use cases:

- _Encryption at rest_ is typically enabled for Azure IaaS, PaaS, and SaaS models. Applications such as Microsoft 365; Microsoft Purview Information Protection; platform services in which the cloud is used for storage, analytics, and service bus functionality; and infrastructure services in which operating systems and applications are hosted and deployed in the cloud use encryption at rest. _Customer managed keys for encryption at rest_ is used with Azure Storage and Azure AD. For highest security, keys should be HSM-backed, 3k or 4k RSA keys. For more information about encryption at rest, see [Azure Data Encryption at Rest](encryption-atrest.md).
- _SSL/TLS Offload_ is supported on Azure Managed HSM and Azure Dedicated HSM. Customers have improved high availability, security, and best price point on Azure Managed HSM for F5 and Nginx.
- _Lift and shift_ refer to scenarios where a PKCS11 application on-premises is migrated to Azure Virtual Machines and running software such as Oracle TDE in Azure Virtual Machines. Lift and shift requiring payment PIN processing is supported by Azure Payment HSM. All other scenarios are supported by Azure Dedicated HSM. Legacy APIs and libraries such as PKCS11, JCA/JCE, and CNG/KSP are only supported by Azure Dedicated HSM.
- _Payment PIN processing_ includes allowing card and mobile payment authorization and 3D-Secure authentication; PIN generation, management, and validation; payment credential issuing for cards, wearables, and connected devices; securing keys and authentication data; and sensitive data protection for point-to-point encryption, security tokenization, and EMV payment tokenization. This also includes certifications such as PCI DSS, PCI 3DS, and PCI PIN. These are supported by Azure Payment HSM.

:::image type="content" source="./media/choosing-key-management-solutions/key-management-product-flow-chart.png" alt-text="Flow chart diagram that shows how to choose the right key management product based on requirements and scenarios." lightbox="./media/choosing-key-management-solutions/key-management-product-flow-chart.png":::

The flowchart result is a starting point to identify the solution that best matches your needs.

## Compare other customer requirements

Azure provides multiple key management solutions to allow customers to choose a product based on both high-level requirements and management responsibilities. There is a spectrum of management responsibilities ranging from Azure Key Vault and Azure Managed HSM having less customer responsibility, followed by Azure Dedicated HSM and Azure Payment HSM having the most customer responsibility.

This trade-off of management responsibility between the customer and Microsoft and other requirements is detailed in the table below.

Provisioning and hosting are managed by Microsoft across all solutions. Key generation and management, roles and permissions granting, and monitoring and auditing are the responsibility of the customer across all solutions.

Use the table to compare all the solutions side by side. Begin from top to bottom, answering each question found on the left-most column to help you choose the solution that meets all your needs, including management overhead and costs.

|  | **AKV Standard** | **AKV Premium** | **Azure Managed HSM** | **Azure Dedicated HSM** | **Azure Payment HSM** |
| --- | --- | --- | --- | --- | --- |
| What level of **compliance** do you need? | FIPS 140-2 level 1 | FIPS 140-2 level 2, PCI DSS | FIPS 140-2 level 3, PCI DSS, PCI 3DS | FIPS 140-2 level 3, HIPPA, PCI DSS, PCI 3DS, eIDAS CC EAL4+, GSMA | FIPS 140-2 level 3, PCI PTS HSM v3, PCI DSS, PCI 3DS, PCI PIN |
| Do you need **key sovereignty**? | No | No | Yes | Yes | Yes |
| What kind of **tenancy** are you looking for? | Multi Tenant | Multi Tenant | Single Tenant | Single Tenant | Single Tenant |
| What are your **use cases**? | Encryption at Rest, CMK, custom | Encryption at Rest, CMK, custom | Encryption at Rest, TLS Offload, CMK, custom | PKCS11, TLS Offload, code/document signing, custom | Payment PIN processing, custom |
| Do you want **HSM hardware protection**? | No | Yes | Yes | Yes | Yes |
| What is your **budget**? | $ | $$ | $$$ | $$$$ | $$$$ |
| Who takes responsibility for **patching and maintenance**? | Microsoft | Microsoft | Microsoft | Customer | Customer |
| Who takes responsibility for **service health and hardware failover**? | Microsoft | Microsoft | Shared | Customer | Customer |
| What kind of **objects** are you using? | Asymmetric Keys, Secrets, Certs | Asymmetric Keys, Secrets, Certs | Asymmetric/Symmetric keys | Asymmetric/Symmetric keys, Certs | Local Primary Key |
| **Root of trust control** | Microsoft | Microsoft | Customer | Customer | Customer |

## Common key management solution uses by industry segments

Here is a list of the key management solutions we commonly see being utilized based on industry.

| **Industry** | **Suggested Azure solution** | **Considerations for suggested solutions** |
| --- | --- | --- |
| I am an enterprise or an organization with strict security and compliance requirements (ex: banking, government, highly regulated industries).<br /><br />I am a direct-to-consumer ecommerce merchant who needs to store, process, and transmit my customers’ credit cards to my external payment processor/gateway and looking for a PCI compliant solution. | Azure Managed HSM | Azure Managed HSM provides FIPS 140-2 Level 3 compliance, and it is a PCI compliant solution for ecommerce. It supports encryption for PCI DSS 4.0. It provides HSM backed keys and gives customers key sovereignty and single tenancy. |
| I am a service provider for financial services, an issuer, a card acquirer, a card network, a payment gateway/PSP, or 3DS solution provider looking for a single tenant service that can meet PCI and multiple major compliance frameworks. | Azure Payment HSM | Azure Payment HSM provides FIPS 140-2 Level 3, PCI HSM v3, PCI DSS, PCI 3DS, and PCI PIN compliance. It provides key sovereignty and single tenancy, common internal compliance requirements around payment processing. Azure Payment HSM provides full payment transaction and PIN processing support. |
| I am an early-stage startup customer looking to prototype a cloud-native application. | Azure Key Vault Standard | Azure Key Vault Standard provides software-backed keys at an economy price. |
| I am a startup customer looking to produce a cloud-native application. | Azure Key Vault Premium, Azure Managed HSM | Both Azure Key Vault Premium and Azure Managed HSM provide HSM-backed keys\* and are the best solutions for building cloud native applications. |
| I am an IaaS customer wanting to move my application to use Azure VM/HSMs. | Azure Dedicated HSM | Azure Dedicated HSM supports SQL IaaS customers. It is the only solution that supports PKCS11 and custom non-cloud native applications. |

## Learn more about Azure key management solutions

**Azure Key Vault (Standard Tier)**: A FIPS 140-2 Level 1 validated multi-tenant cloud key management service that can be used to store both asymmetric and symmetric keys, secrets, and certificates. Keys stored in Azure Key Vault are software-protected and can be used for encryption-at-rest and custom applications. Azure Key Vault Standard provides a modern API and a breadth of regional deployments and integrations with Azure Services. For more information, see [About Azure Key Vault](../../key-vault/general/overview.md).

**Azure Key Vault (Premium Tier)**: A FIPS 140-2 Level 2 validated multi-tenant HSM offering that can be used to store both asymmetric and symmetric keys, secrets, and certificates. Keys are stored in a secure hardware boundary*. Microsoft manages and operates the underlying HSM, and keys stored in Azure Key Vault Premium can be used for encryption-at-rest and custom applications. Azure Key Vault Premium also provides a modern API and a breadth of regional deployments and integrations with Azure Services. If you are an AKV Premium customer looking for higher security compliance, key sovereignty, single tenancy, and/or higher crypto operations per second, you may want to consider Managed HSM instead. For more information, see [About Azure Key Vault](../../key-vault/general/overview.md).

**Azure Managed HSM**: A FIPS 140-2 Level 3 validated, PCI compliant, single-tenant HSM offering that gives customers full control of an HSM for encryption-at-rest, Keyless SSL/TLS offload, and custom applications. Azure Managed HSM is the only key management solution offering confidential keys. Customers receive a pool of three HSM partitions—together acting as one logical, highly available HSM appliance—fronted by a service that exposes crypto functionality through the Key Vault API. Microsoft handles the provisioning, patching, maintenance, and hardware failover of the HSMs, but doesn't have access to the keys themselves, because the service executes within Azure's Confidential Compute Infrastructure. Azure Managed HSM is integrated with the Azure SQL, Azure Storage, and Azure Information Protection PaaS services and offers support for Keyless TLS with F5 and Nginx. For more information, see [What is Azure Key Vault Managed HSM?](../../key-vault/managed-hsm/overview.md) 

**Azure Dedicated HSM**: A FIPS 140-2 Level 3 validated single-tenant bare metal HSM offering that lets customers lease a general-purpose HSM appliance that resides in Microsoft datacenters. The customer has complete ownership over the HSM device and is responsible for patching and updating the firmware when required. Microsoft has no permissions on the device or access to the key material, and Azure Dedicated HSM is not integrated with any Azure PaaS offerings. Customers can interact with the HSM using the PKCS#11, JCE/JCA, and KSP/CNG APIs. This offering is most useful for legacy lift-and-shift workloads, PKI, SSL Offloading and Keyless TLS (supported integrations include F5, Nginx, Apache, Palo Alto, IBM GW and more), OpenSSL applications, Oracle TDE, and Azure SQL TDE IaaS. For more information, see [What is Azure Dedicated HSM?](../../dedicated-hsm/overview.md) 

**Azure Payment HSM**: A FIPS 140-2 Level 3, PCI HSM v3, validated single-tenant bare metal HSM offering that lets customers lease a payment HSM appliance in Microsoft datacenters for payments operations, including payment PIN processing, payment credential issuing, securing keys and authentication data, and sensitive data protection. The service is PCI DSS, PCI 3DS, and PCI PIN compliant. Azure Payment HSM offers single-tenant HSMs for customers to have complete administrative control and exclusive access to the HSM. Once the HSM is allocated to a customer, Microsoft has no access to customer data. Likewise, when the HSM is no longer required, customer data is zeroized and erased as soon as the HSM is released, to ensure complete privacy and security is maintained. For more information, see [About Azure Payment HSM](../../payment-hsm/overview.md).

> [!NOTE]
> \* Azure Key Vault Premium allows the creation of both software-protected and HSM protected keys. If using Azure Key Vault Premium, check to ensure that the key created is HSM protected.

## What's next

- [Key management in Azure](key-management.md)
- [Azure Key Vault](../../key-vault/general/overview.md)
- [Azure Managed HSM](../../key-vault/managed-hsm/overview.md)
- [Azure Dedicated HSM](../../dedicated-hsm/overview.md)
- [Azure Payment HSM](../../payment-hsm/overview.md)
- [What is Zero Trust?](/security/zero-trust/zero-trust-overview)
