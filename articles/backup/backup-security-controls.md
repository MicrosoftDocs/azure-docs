---
title: Security controls
description: Learn about the security controls used in the Azure Backup service. These controls help the service prevent, detect, and respond to security vulnerabilities.
ms.topic: conceptual
ms.date: 09/23/2019
---
# Security controls for Azure Backup

This article documents the security controls built into Azure Backup.

[!INCLUDE [Security controls Header](../../includes/security-controls-header.md)]

## Network

| Security control | Yes/No | Notes | Documentation
|---|---|--|--|
| Service endpoint support| No |  |  |
| VNet injection support| No |  |  |
| Network isolation and firewalling support| Yes | |  |
| Forced tunneling support for Azure VMs | Yes  |  |  |
| Forced tunneling support for applications running inside Azure VMs| No  |  |  |

## Monitoring & logging

| Security control | Yes/No | Notes| Documentation
|---|---|--|--|
| Azure monitoring support (such as Log analytics, App insights)| Yes | Log Analytics is supported via resource logs. For more information, see [Monitor Azure Backup protected workloads using Log Analytics](https://azure.microsoft.com/blog/monitor-all-azure-backup-protected-workloads-using-log-analytics/). |  |
| Control and management plane logging and audit| Yes | All customer triggered actions from the Azure portal are logged to activity logs. |  |
| Data plane logging and audit| No | Azure Backup data plane can't be reached directly.  |  |

## Identity

| Security control | Yes/No | Notes| Documentation
|---|---|--|--|
| Authentication| Yes | Authentication is through Azure Active Directory. |  |
| Authorization| Yes | Customer created and Azure built-in roles are used. For more information, see [Use Azure role-based access control to manage Azure Backup recovery points](./backup-rbac-rs-vault.md). |  |

## Data protection

| Security control | Yes/No | Notes | Documentation
|---|---|--|--|
| Server-side encryption at rest: Microsoft-managed keys | Yes | Using storage service encryption for storage accounts. |  |
| Server-side encryption at rest: customer-managed keys (BYOK) | No |  |  |
| Column level encryption (Azure Data Services)| No |  |  |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption)| No | Using HTTPS. |  |
| API calls encrypted| Yes |  |  |

## Configuration management

| Security control | Yes/No | Notes| Documentation
|---|---|--|--|
| Configuration management support (versioning of configuration, and so on)| Yes|  |  |

## Next steps

- Learn more about the [built-in security controls across Azure services](../security/fundamentals/security-controls.md).
