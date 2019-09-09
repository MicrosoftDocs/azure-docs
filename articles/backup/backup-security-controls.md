---
title: Security controls for Azure Backup
description: A checklist of security controls for evaluating Azure Backup
ms.reviewer: mbaldwin
author: dcurwin
manager: carmonm
ms.service: backup
ms.topic: conceptual
ms.date: 04/16/2019
ms.author: dacurwin

---
# Security controls for Azure Backup

This article documents the security controls built into Azure Backup. 

[!INCLUDE [Security controls Header](../../includes/security-controls-header.md)]

## Network

| Security control | Yes/No | Notes |
|---|---|--|
| Service endpoint support| No |  |
| VNet injection support| No |  |
| Network isolation and firewalling support| Yes | Forced tunneling is supported for VM backup. Forced tunneling is not supported for workloads running inside VMs. |
| Forced tunneling support| No |  |

## Monitoring & logging

| Security control | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | Log Analytics is supported via diagnostic logs. See [Monitor Azure Backup protected workloads using Log Analytics](https://azure.microsoft.com/blog/monitor-all-azure-backup-protected-workloads-using-log-analytics/) for more information. |
| Control and management plane logging and audit| Yes | All customer triggered actions from the Azure portal are logged to activity logs. |
| Data plane logging and audit| No | Azure Backup data plane can't be reached directly.  |

## Identity

| Security control | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | Authentication is through Azure Active Directory. |
| Authorization| Yes | Customer created and built-in RBAC roles are used. See [Use Role-Based Access Control to manage Azure Backup recovery points](/azure/backup/backup-rbac-rs-vault) for more information. |

## Data protection

| Security control | Yes/No | Notes |
|---|---|--|
| Server-side encryption at rest: Microsoft managed keys | Yes | Using storage service encryption for storage accounts. |
| Server-side encryption at rest: customer managed keys (BYOK) | No |  |
| Column level encryption (Azure Data Services)| No |  |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption)| No | Using HTTPS. |
| API calls encrypted| Yes |  |

## Configuration management

| Security control | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes|  |