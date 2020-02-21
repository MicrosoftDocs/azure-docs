---
title: Azure Security Control - Data Protection
description: Security Control Data Protection
author: msmbaldwin
manager: rkarlin

ms.service: security
ms.topic: conceptual
ms.date: 12/30/2019
ms.author: mbaldwin
ms.custom: security-recommendations

---

# Security Control: Data Protection

Data protection recommendations focus on addressing issues related to encryption, access control lists, identity-based access control, and audit logging for data access.

## 4.1: Maintain an inventory of sensitive Information

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 4.1 | 13.1 | Customer |

Use Tags to assist in tracking Azure resources that store or process sensitive information.

How to create and use Tags:

https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

## 4.2: Isolate systems storing or processing sensitive information

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 4.2 | 13.2 | Customer |

Implement separate subscriptions and/or management groups for development, test, and production. Resources should be separated by VNet/Subnet, tagged appropriately, and secured by an NSG or Azure Firewall. Resources storing or processing sensitive data should be sufficiently isolated. For Virtual Machines storing or processing sensitive data, implement policy and procedure(s) to turn them off when not in use.

How to create additional Azure subscriptions:

https://docs.microsoft.com/azure/billing/billing-create-subscription

How to create Management Groups:

https://docs.microsoft.com/azure/governance/management-groups/create

How to create and use Tags:

https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

How to create a Virtual Network:

https://docs.microsoft.com/azure/virtual-network/quick-create-portal

How to create an NSG with a Security Config:

https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic

How to deploy Azure Firewall:

https://docs.microsoft.com/azure/firewall/tutorial-firewall-deploy-portal

How to configure alert or alert and deny with Azure Firewall:

https://docs.microsoft.com/azure/firewall/threat-intel

## 4.3: Monitor and block unauthorized transfer of sensitive information

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 4.3 | 13.3 | Customer |

Deploy an automated tool on network perimeters that monitors for unauthorized transfer of sensitive information and blocks such transfers while alerting information security professionals.

## 4.4: Encrypt all sensitive information in transit

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 4.4 | 14.4 | Shared |

Encrypt all sensitive information in transit. Ensure that any clients connecting to your Azure resources are able to negotiate TLS 1.2 or greater.

Follow Azure Security Center recommendations for encryption at rest and encryption in transit, where applicable.

Understand encryption in transit with Azure:

https://docs.microsoft.com/azure/security/fundamentals/encryption-overview#encryption-of-data-in-transit

## 4.5: Use an active discovery tool to identify sensitive data

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 4.5 | 14.5 | Customer |

When no feature is available for your specific service in Azure, use a third-party active discovery tool to identify all sensitive information stored, processed, or transmitted by the organization's technology systems, including those located on-site, or at a remote service provider, and update the organization's sensitive information inventory.

Use Azure Information Protection for identifying sensitive information within Office 365 documents.

Use Azure SQL Information Protection to assist in the classification and labeling of information stored in Azure SQL Databases.

How to implement Azure SQL Data Discovery:

https://docs.microsoft.com/azure/sql-database/sql-database-data-discovery-and-classification

How to implement Azure Information Protection:

https://docs.microsoft.com/azure/information-protection/deployment-roadmap

## 4.6: Use Azure RBAC to control access to resources

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 4.6 | 14.6 | Customer |

Use Azure AD RBAC to control access to data and resources, otherwise use service specific access control methods.

Understand Azure RBAC:

https://docs.microsoft.com/azure/role-based-access-control/overview

How to configure RBAC in Azure:

https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal

## 4.7: Use host-based data loss prevention to enforce access control

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 4.7 | 14.7 | Customer |

Implement a third-party tool, such as an automated host-based Data Loss Prevention solution, to enforce access controls to data even when data is copied off a system.

## 4.8: Encrypt sensitive information at rest

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 4.8 | 14.8 | Customer |

Use  encryption at rest on all Azure resources. Microsoft recommends allowing Azure to manage your encryption keys, however there is the option for you to manage your own keys in some instances. 

Understand encryption at rest in Azure:

https://docs.microsoft.com/azure/security/fundamentals/encryption-atrest

How to configure customer managed encryption keys:

https://docs.microsoft.com/azure/storage/common/storage-encryption-keys-portal

## 4.9: Log and alert on changes to critical Azure resources

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 4.9 | 14.9 | Customer |

Use Azure Monitor with the Azure Activity Log to create alerts for when changes take place to critical Azure resources.

How to create alerts for Azure Activity Log events:

https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log

## Next steps

See the next security control: [Vulnerability Management](security-control-vulnerability-management.md)
