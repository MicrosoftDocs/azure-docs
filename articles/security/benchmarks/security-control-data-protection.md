---
title: Azure Security Control - Data Protection
description: Azure Security Control Data Protection
author: msmbaldwin
ms.service: security
ms.topic: conceptual
ms.date: 04/14/2020
ms.author: mbaldwin
ms.custom: security-benchmark

---

# Security Control: Data Protection

Data protection recommendations focus on addressing issues related to encryption, access control lists, identity-based access control, and audit logging for data access.

## 4.1: Maintain an inventory of sensitive Information

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 4.1 | 13.1 | Customer |

Use Tags to assist in tracking Azure resources that store or process sensitive information.

- [How to create and use Tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

## 4.2: Isolate systems storing or processing sensitive information

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 4.2 | 13.2, 2.10 | Customer |

Implement isolation using separate subscriptions and management groups for individual security domains such as environment type and data sensitivity level. You can restrict the level of access to your Azure resources that your applications and enterprise environments demand. You can control access to Azure resources via Azure Active Directory role-based access control. 

- [How to create additional Azure subscriptions](https://docs.microsoft.com/azure/billing/billing-create-subscription)

- [How to create Management Groups](https://docs.microsoft.com/azure/governance/management-groups/create)

- [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

## 4.3: Monitor and block unauthorized transfer of sensitive information

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 4.3 | 13.3 | Shared |

Leverage a third-party solution from Azure Marketplace on network perimeters that monitors for unauthorized transfer of sensitive information and blocks such transfers while alerting information security professionals.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [Understand customer data protection in Azure](https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data)

## 4.4: Encrypt all sensitive information in transit

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 4.4 | 14.4 | Shared |

Encrypt all sensitive information in transit. Ensure that any clients connecting to your Azure resources are able to negotiate TLS 1.2 or greater.

Follow Azure Security Center recommendations for encryption at rest and encryption in transit, where applicable.

- [Understand encryption in transit with Azure](https://docs.microsoft.com/azure/security/fundamentals/encryption-overview#encryption-of-data-in-transit)

## 4.5: Use an active discovery tool to identify sensitive data

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 4.5 | 14.5 | Shared |

When no feature is available for your specific service in Azure, use a third-party active discovery tool to identify all sensitive information stored, processed, or transmitted by the organization's technology systems, including those located on-site, or at a remote service provider, and update the organization's sensitive information inventory.

Use Azure Information Protection for identifying sensitive information within Office 365 documents.

Use Azure SQL Information Protection to assist in the classification and labeling of information stored in Azure SQL Databases.

- [How to implement Azure SQL Data Discovery](https://docs.microsoft.com/azure/sql-database/sql-database-data-discovery-and-classification)

- [How to implement Azure Information Protection](https://docs.microsoft.com/azure/information-protection/deployment-roadmap)

- [Understand customer data protection in Azure](https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data)

## 4.6: Use Role-based access control to control access to resources

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 4.6 | 14.6 | Customer |

Use Azure AD RBAC to control access to data and resources, otherwise use service specific access control methods.

- [How to configure RBAC in Azure](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal)

## 4.7: Use host-based data loss prevention to enforce access control

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 4.7 | 14.7 | Shared |

If required for compliance on compute resources, implement a third-party tool, such as an automated host-based Data Loss Prevention solution, to enforce access controls to data even when data is copied off a system.

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [Understand customer data protection in Azure](https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data)

## 4.8: Encrypt sensitive information at rest

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 4.8 | 14.8 | Customer |

Use  encryption at rest on all Azure resources. Microsoft recommends allowing Azure to manage your encryption keys, however there is the option for you to manage your own keys in some instances. 

- [Understand encryption at rest in Azure](https://docs.microsoft.com/azure/security/fundamentals/encryption-atrest)

- [How to configure customer managed encryption keys](https://docs.microsoft.com/azure/storage/common/storage-encryption-keys-portal)

## 4.9: Log and alert on changes to critical Azure resources

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 4.9 | 14.9 | Customer |

Use Azure Monitor with the Azure Activity Log to create alerts for when changes take place to critical Azure resources.

- [How to create alerts for Azure Activity Log events](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log)


## Next steps

- See the next Security Control:  [Vulnerability Management](security-control-vulnerability-management.md)