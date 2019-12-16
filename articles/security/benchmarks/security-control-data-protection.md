---
title: Security Control - Data Protection
description: Security Control Data Protection
author: msmbaldwin
manager: rkarlin

ms.service: security
ms.topic: conceptual
ms.date: 12/16/2019
ms.author: mbaldwin
ms.custom: security-recommendations

---

# Security Control: Data Protection

## Maintain an Inventory of Sensitive Information

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 4.1 | 13.1 | Customer |

**Guidance**: Utilize Tags to assist in tracking Azure resources that store or process sensitive information.<br><br><br><br>How to create and utilize Tags:<br><br>https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-using-tags

## Isolate systems storing or processing sensitive information

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 4.2 | 13.2 | Customer |

**Guidance**: Customer to implement separate subscriptions and/or management groups for development, test, and production. Resources should be separated by Vnet/Subnet, tagged appropriately, and secured within an NSG or Azure Firewall. Resources storing or processing sensitive data should be sufficiently isolated. For Virtual Machines storing or processing sensitive data, implement policy and procedure(s) to turn them off when not in use.<br><br>How to create additional Azure subscriptions:<br>https://docs.microsoft.com/en-us/azure/billing/billing-create-subscription<br><br>How to create Management Groups:<br>https://docs.microsoft.com/en-us/azure/governance/management-groups/create<br><br>How to create and utilize Tags:<br>https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-using-tags<br><br>How to create a Virtual Network:<br>https://docs.microsoft.com/en-us/azure/virtual-network/quick-create-portal<br><br>How to create an NSG with a Security Config:<br>https://docs.microsoft.com/en-us/azure/virtual-network/tutorial-filter-network-traffic<br><br>How to deploy Azure Firewall:<br>https://docs.microsoft.com/en-us/azure/firewall/tutorial-firewall-deploy-portal<br><br>How to configure alert or alert and deny with Azure Firewall:<br>https://docs.microsoft.com/en-us/azure/firewall/threat-intel

## Monitor and Block unauthorized transfer of sensitive information

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 4.3 | 13.3 | Customer |

**Guidance**: Customer to implement third party solution. Deploy an automated tool on network perimeters that monitors for unauthorized transfer of sensitive information and blocks such transfers while alerting information security professionals.

## Encrypt All Sensitive Information in Transit

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 4.4 | 14.4 | Shared |

**Guidance**: Encrypt all sensitive information in transit. Ensure that any clients connecting to your Azure resources are able to negotiate TLS 1.2 or greater.<br><br>Understanding encryption in transit with Azure:<br>https://docs.microsoft.com/en-us/azure/security/fundamentals/encryption-overview#encryption-of-data-in-transit

## Utilize an Active Discovery Tool to Identify Sensitive Data

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 4.5 | 14.5 | Customer |

**Guidance**: When no feature is available for your specific service in Azure, utilize a third party active discovery tool to identify all sensitive information stored, processed, or transmitted by the organization's technology systems, including those located onsite or at a remote service provider and update the organization's sensitive information inventory.<br><br><br><br>Customer to Utilize Azure Information Protection for identifying sensitive information within Office 365 documents.<br><br><br><br>Customer to Utilize Azure SQL Information Protection to assist in the classification and labeling of information stored in Azure SQL Databases.<br><br><br><br>How to implement Azure SQL Data Discovery:<br><br>https://docs.microsoft.com/en-us/azure/sql-database/sql-database-data-discovery-and-classification<br><br><br><br>How to implement Azure Information Protection:<br><br>https://docs.microsoft.com/en-us/azure/information-protection/deployment-roadmap

## Utilize Azure RBAC to control access to resources

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 4.6 | 14.6 | Customer |

**Guidance**: Utilize Azure AD RBAC to control access to data and resources, otherwise utilize service specific access control methods.<br><br><br><br>Understanding Azure RBAC:<br><br>https://docs.microsoft.com/en-us/azure/role-based-access-control/overview<br><br><br><br>How to configure RBAC in Azure:<br><br>https://docs.microsoft.com/en-us/azure/role-based-access-control/role-assignments-portal

## Use host-based Data Loss Prevention to enforce access control

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 4.7 | 14.7 | Customer |

**Guidance**: Customer to implement a third party tool, such as an automated host-based Data Loss Prevention solution, to enforce access controls to data even when data is copied off a system.

## Encrypt Sensitive Information at Rest

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 4.8 | 14.8 | Customer |

**Guidance**: Customer to utilize encryption at rest on all Azure resources. Recommended to allow Microsoft Azure to manage your encryption keys, however there is the option for customers to manage their own keys in some instances.<br><br><br><br>Understand encryption at rest in Azure:<br><br>https://docs.microsoft.com/en-us/azure/security/fundamentals/encryption-atrest<br><br><br><br>How to configure customer managed encryption keys:<br><br>https://docs.microsoft.com/en-us/azure/storage/common/storage-encryption-keys-portal

## Log and alert on changes to critical Azure resources

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 4.9 | 14.9 | Customer |

**Guidance**: Utilize Azure Monitor with the Azure Activity Log to create alerts for when changes take place to critical Azure resources.<br><br><br><br>How to create alerts for Azure Activity Log events:<br><br>https://docs.microsoft.com/en-us/azure/azure-monitor/platform/alerts-activity-log<br><br><br><br>How to create alerts for Azure Activity Log events:<br><br>https://docs.microsoft.com/en-us/azure/azure-monitor/platform/alerts-activity-log

