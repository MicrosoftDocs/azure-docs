---
title: Azure Security Benchmark V2 - Data Protection
description: Azure Security Benchmark V2 Data Protection
author: msmbaldwin
ms.service: security
ms.topic: conceptual
ms.date: 02/22/2021
ms.author: mbaldwin
ms.custom: security-benchmark

---

# Security Control V2: Data Protection

Data Protection covers control of data protection at rest, in transit, and via authorized access mechanisms. This includes discover, classify, protect, and monitor sensitive data assets using access control, encryption, and logging in Azure.

To see the applicable built-in Azure Policy, see [Details of the Azure Security Benchmark Regulatory Compliance built-in initiative: Data Protection](../../governance/policy/samples/azure-security-benchmark.md#data-protection)

## DP-1: Discovery, classify and label sensitive data

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP 800-53 r4 ID(s) |
|--|--|--|--|
| DP-1 | 13.1, 14.5, 14.7 | SC-28 |

Discover, classify, and label your sensitive data so that you can design the appropriate controls to ensure sensitive information is stored, processed, and transmitted securely by the organization's technology systems.

Use Azure Information Protection (and its associated scanning tool) for sensitive information within Office documents on Azure, on-premises, on Office 365, and in other locations.

You can use Azure SQL Information Protection to assist in the classification and labeling of information stored in Azure SQL Databases.

- [Tag sensitive information using Azure Information Protection](/azure/information-protection/what-is-information-protection) 

- [How to implement Azure SQL Data Discovery](../../azure-sql/database/data-discovery-and-classification-overview.md)

**Responsibility**: Shared

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Application Security and DevOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops)

- [Data Security](/azure/cloud-adoption-framework/organize/cloud-security-data-security) 

- [Infrastructure and endpoint security](/azure/cloud-adoption-framework/organize/cloud-security-infrastructure-endpoint)

## DP-2: Protect sensitive data

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP 800-53 r4 ID(s) |
|--|--|--|--|
| DP-2 | 13.2, 2.10 | SC-7, AC-4 |

Protect sensitive data by restricting access using Azure role-based access control (Azure RBAC), network-based access controls, and specific controls in Azure services (such as encryption in SQL and other databases). 

To ensure consistent access control, all types of access control should be aligned to your enterprise segmentation strategy. The enterprise segmentation strategy should also be informed by the location of sensitive or business critical data and systems.

For the underlying platform, which is managed by Microsoft, Microsoft treats all customer content as sensitive and guards against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented some default data protection controls and capabilities.

- [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md)

- [Understand customer data protection in Azure](../fundamentals/protection-customer-data.md)

**Responsibility**: Shared

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Application Security and DevOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops) 

- [Data Security](/azure/cloud-adoption-framework/organize/cloud-security-data-security)

- [Infrastructure and endpoint security](/azure/cloud-adoption-framework/organize/cloud-security-infrastructure-endpoint)

## DP-3: Monitor for unauthorized transfer of sensitive data

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP 800-53 r4 ID(s) |
|--|--|--|--|
| DP-3 | 13.3 | AC-4, SI-4 |

Monitor for unauthorized transfer of data to locations outside of enterprise visibility and control. This typically involves monitoring for anomalous activities (large or unusual transfers) that could indicate unauthorized data exfiltration. 

Azure Storage Advanced Threat Protection (ATP) and Azure SQL ATP can alert on anomalous transfer of information that might indicate unauthorized transfers of sensitive information. 

Azure Information protection (AIP) provides monitoring capabilities for information that has been classified and labeled. 

If required for compliance of data loss prevention (DLP), you can use a host-based DLP solution to enforce detective and/or preventative controls to prevent data exfiltration.

- [Azure Defender for SQL](../../azure-sql/database/azure-defender-for-sql.md)

- [Azure Defender for Storage](../../storage/common/azure-defender-storage-configure.md?tabs=azure-security-center)

**Responsibility**: Shared

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Security operations](/azure/cloud-adoption-framework/organize/cloud-security) 

- [Application security and DevOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops) 

- [Infrastructure and endpoint security](/azure/cloud-adoption-framework/organize/cloud-security-infrastructure-endpoint)

## DP-4: Encrypt sensitive information in transit

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP 800-53 r4 ID(s) |
|--|--|--|--|
| DP-4 | 14.4 | SC-8 |

To complement access controls, data in transit should be protected against "out of band" attacks (such as traffic capture) using encryption to ensure that attackers cannot easily read or modify the data.

While this is optional for traffic on private networks, this is critical for traffic on external and public networks. For HTTP traffic, ensure that any clients connecting to your Azure resources can negotiate TLS v1.2 or greater. For remote management, use SSH (for Linux) or RDP/TLS (for Windows) instead of an unencrypted protocol. Obsoleted SSL, TLS, and SSH versions and protocols, and weak ciphers should be disabled.

By default, Azure provides encryption for data in transit between Azure data centers.

- [Understand encryption in transit with Azure](../fundamentals/encryption-overview.md#encryption-of-data-in-transit)

- [Information on TLS Security](/security/engineering/solving-tls1-problem)

- [Double encryption for Azure data in transit](../fundamentals/double-encryption.md#data-in-transit)

**Responsibility**: Shared

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Security architecture](/azure/cloud-adoption-framework/organize/cloud-security-architecture) 

- [Infrastructure and endpoint security](/azure/cloud-adoption-framework/organize/cloud-security-infrastructure-endpoint)

- [Application Security and DevOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops) 

- [Data Security](/azure/cloud-adoption-framework/organize/cloud-security-data-security)

## DP-5: Encrypt sensitive data at rest

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP 800-53 r4 ID(s) |
|--|--|--|--|
| DP-5 | 14.8 | SC-28, SC-12 |

To complement access controls, data at rest should be protected against 'out of band' attacks (such as accessing underlying storage) using encryption. This helps ensure that attackers cannot easily read or modify the data. 

Azure provides encryption for data at rest by default. For highly sensitive data, you have options to implement additional encryption at rest on all Azure resources where available. Azure manages your encryption keys by default, but Azure provides options to manage your own keys (customer managed keys) for certain Azure services.

- [Understand encryption at rest in Azure](../fundamentals/encryption-atrest.md#encryption-at-rest-in-microsoft-cloud-services)

- [How to configure customer managed encryption keys](../../storage/common/customer-managed-keys-configure-key-vault.md)

- [Encryption model and key management table](../fundamentals/encryption-models.md)

- [Data at rest double encryption in Azure](../fundamentals/double-encryption.md#data-at-rest)

**Responsibility**: Shared

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Security architecture](/azure/cloud-adoption-framework/organize/cloud-security-architecture) 

- [Infrastructure and endpoint security](/azure/cloud-adoption-framework/organize/cloud-security-infrastructure-endpoint)

- [Application Security and DevOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops)

- [Data Security](/azure/cloud-adoption-framework/organize/cloud-security-data-security)