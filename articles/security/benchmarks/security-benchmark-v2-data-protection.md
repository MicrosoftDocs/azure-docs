---
title: Azure Security Control - Data Protection
description: Azure Security Control Data Protection
author: msmbaldwin
ms.service: security
ms.topic: conceptual
ms.date: 09/09/2020
ms.author: mbaldwin
ms.custom: security-benchmark

---

# Security Control: Data Protection

Data protection recommendations focus on addressing issues related to encryption, access control lists, identity-based access control, and audit logging for data access.

## DP-1: Discovery, classify and label sensitive data

| Azure ID | CIS IDs | NIST IDs |
|--|--|--|--|
| DP-1 | 14.5, 14.7 | SI-4, SC-28 |

Discover, classify, and label your sensitive data so that you can design the appropriate controls to ensure sensitive information is stored, processed, and transmitted securely by the organization's technology systems. 

You can use Azure Information Protection (and associated scanning tool) for sensitive information within Office documents on Azure, on-premises, Office 365, and other locations. 

You can use Azure SQL Information Protection to assist in the classification and labeling of information stored in Azure SQL Databases.

- [Tag sensitive information using Azure Information Protection](/azure/information-protection/what-is-information-protection) 

- [How to implement Azure SQL Data Discovery](/azure/sql-database/sql-database-data-discovery-and-classification)

**Responsibility**: Shared

**Customer Security Stakeholders**:

- [Application Security and DevOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops)  

- [Data Security](/azure/cloud-adoption-framework/organize/cloud-security-data-security)

- [Infrastructure and endpoint security](/azure/cloud-adoption-framework/organize/cloud-security)  

## DP-2: Protect sensitive data

| Azure ID | CIS IDs | NIST IDs |
|--|--|--|--|
| DP-2 | 13.2, 2.10 | SC-7, AC-4 |

Protect sensitive data by restricting access using Azure Role Based Access Control (RBAC), network-based access controls, and specific controls in Azure services (such as encryption in SQL and other databases). 

All types of access controls should be aligned to your enterprise segmentation strategy to ensure consistent access control. 

Note: The enterprise segmentation strategy should also be informed by the location of sensitive or business critical data and systems.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [Azure Role Based Access Control (RBAC)](../../role-based-access-control/overview.md)

- [Understand customer data protection in Azure](../fundamentals/protection-customer-data.md)

**Responsibility**: Shared

**Customer Security Stakeholders**:

- [Application Security and DevOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops) 

- [Data Security](/azure/cloud-adoption-framework/organize/cloud-security-data-security)

- [Infrastructure and endpoint security](/azure/cloud-adoption-framework/organize/cloud-security)

## DP-3: Monitor for unauthorized transfer of sensitive data

| Azure ID | CIS IDs | NIST IDs |
|--|--|--|--|
| DP-3 | 13.3 | AC-4, SI-4 |

Monitor for unauthorized transfer of data to locations outside of enterprise visibility and control. This typically involves monitoring for anomalous activities (large or unusual transfers) that could indicate unauthorized data exfiltration 

Azure Storage Advanced Threat Protection (ATP) and Azure SQL ATP can alert on anomalous transfer of information that may indicate unauthorized transfers of sensitive information. 

Azure Information protection (AIP) provides monitoring capabilities for information that has been classified and labelled. 

If required for compliance of data loss prevention (DLP), you may use host based DLP solution to enforce detective and/or preventative controls to prevent data exfiltration.

- [Enable Azure SQL ATP](../../azure-sql/database/threat-detection-overview.md)

- [Enable Azure Storage ATP](https://docs.microsoft.com/azure/storage/common/storage-advanced-threat-protection?tabs=azure-security-center)

**Responsibility**: Shared

**Customer Security Stakeholders**:

- [Security operations center (SOC)](/azure/cloud-adoption-framework/organize/cloud-security) 

- [Application Security and DevOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops) 

- [Infrastructure and endpoint security](/azure/cloud-adoption-framework/organize/cloud-security)  

## DP-4: Encrypt sensitive information in transit

| Azure ID | CIS IDs | NIST IDs |
|--|--|--|--|
| DP-4 | 14.4 | SC-8 |

To complement access controls, data in transit should be protected against ‘out of band’ attacks (e.g. traffic capture) using encryption to ensure that attackers cannot easily read or modify the data. 

While this is optional for traffic on private networks, this is critical for traffic on external and public networks. For HTTP traffic, ensure that any clients connecting to your Azure resources can negotiate TLS v1.2 or greater. For remote management, use SSH (for Linux) or RDP/TLS (for Windows) instead of unencrypted protocol. Obsoleted SSL/TLS/SSH versions, protocols, and weak ciphers should be disabled.  

At the underlying infrastructure, Azure provides data in transit encryption by default for data traffic between Azure data centers. 

- [Understand encryption in transit with Azure](../fundamentals/encryption-overview.md#encryption-of-data-in-transit)

- [Information on TLS Security](/security/engineering/solving-tls1-problem)

- [Data in transit double encryption in Azure](../fundamentals/double-encryption.md#data-in-transit)

**Responsibility**: Shared

**Customer Security Stakeholders**:

- [Security architecture](/azure/cloud-adoption-framework/organize/cloud-security-architecture) 

- [Infrastructure and endpoint security](/azure/cloud-adoption-framework/organize/cloud-security)  

- [Application Security and DevOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops)

- [Data Security](/azure/cloud-adoption-framework/organize/cloud-security-data-security)

## DP-5: Encrypt sensitive data at rest

| Azure ID | CIS IDs | NIST IDs |
|--|--|--|--|
| DP-5 | 14.8 | SC-28, SC-12 |

To complement access controls, data at rest should be protected against ‘out of band’ attacks (e.g. accessing underlying storage) using encryption. This helps ensure that attackers cannot easily read or modify the data. 

Azure provides data at rest encryption by default. For highly sensitive data, you have options to implement additional encryption at rest on all Azure resources where available. Azure manage your encryption keys by default, but Azure provides options to manage your own keys (customer managed keys) for certain Azure services.

- [Understand encryption at rest in Azure](../fundamentals/encryption-atrest.md#encryption-at-rest-in-microsoft-cloud-services)

- [How to configure customer managed encryption keys](../../storage/common/storage-encryption-keys-portal.md)

- [Encryption Model and key management table](../fundamentals/encryption-atrest.md#encryption-model-and-key-management-table)

- [Data at rest double encryption in Azure](../fundamentals/double-encryption.md#data-at-rest)

**Responsibility**: Shared

**Customer Security Stakeholders**:

- [Security architecture](/azure/cloud-adoption-framework/organize/cloud-security-architecture) 

- [Infrastructure and endpoint security](/azure/cloud-adoption-framework/organize/cloud-security)  

- [Application Security and DevOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops)

- [Data Security](/azure/cloud-adoption-framework/organize/cloud-security-data-security)

