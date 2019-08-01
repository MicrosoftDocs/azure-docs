---
title: Security attributes for Azure Backup
description: A checklist of security attributes for evaluating Azure Backup
ms.reviewer: mbaldwin
author: dcurwin
manager: carmonm
ms.service: backup
ms.topic: conceptual
ms.date: 04/16/2019
ms.author: dacurwin

---
# Security attributes for Azure Backup

This article documents the security attributes built into Azure Backup. 

[!INCLUDE [Security Attributes Header](../../includes/security-attributes-header.md)]

## Preventative

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Encryption at rest (such as server-side encryption, server-side encryption with customer-managed keys, and other encryption features)| Yes | Using storage service encryption for storage accounts. |
| Encryption in transit (such as ExpressRoute encryption, in VNet encryption, and VNet-VNet encryption)| No | Using HTTPS. |
| Encryption key handling (CMK, BYOK, etc.)| No |  |
| Column level encryption (Azure Data Services)| No |  |
| API calls encrypted| Yes |  |

## Network segmentation

| Security Attribute | Yes/No | Notes |
|---|---|--|
| Service endpoint support| No |  |
| VNet injection support| No |  |
| Network isolation and firewalling support| Yes | Forced tunneling is supported for VM backup. Forced tunneling is not supported for workloads running inside VMs. |
| Forced tunneling support| No |  |

## Detection

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Azure monitoring support (Log analytics, App insights, etc.)| Yes | Log Analytics is supported via diagnostic logs. See [Monitor Azure Backup protected workloads using Log Analytics](https://azure.microsoft.com/blog/monitor-all-azure-backup-protected-workloads-using-log-analytics/) for more information. |

## Identity and access management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Authentication| Yes | Authentication is through Azure Active Directory. |
| Authorization| Yes | Customer created and built-in RBAC roles are used. See [Use Role-Based Access Control to manage Azure Backup recovery points](/azure/backup/backup-rbac-rs-vault) for more information. |


## Audit trail

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Control and management plane logging and audit| Yes | All customer triggered actions from the Azure portal are logged to activity logs. |
| Data plane logging and audit| No | Azure Backup data plane can't be reached directly.  |

## Configuration management

| Security Attribute | Yes/No | Notes|
|---|---|--|
| Configuration management support (versioning of configuration, etc.)| Yes|  |