---
title: Configure Azure Native Commvault Cloud service
description: Configure identity, access, and workload-protection prerequisites before you create an Azure Native Commvault Cloud account.
author: agrimayadav
ms.author: agrimayadav
ms.topic: how-to
ms.service: partner-services
ms.date: 08/27/2026
---

# Configure Azure Native Commvault Cloud service

Before you create a Commvault Cloud account, configure the required identity and access settings in your Azure subscription and Microsoft Entra tenant.

## Requirements

| Requirement | Details |
| --- | --- |
| Azure subscription | Use an active Azure subscription that can purchase the Commvault Azure Marketplace offer. |
| Tenant administrator | A tenant administrator must grant admin consent to the Commvault single sign-on application. |
| Managed identity permissions | Assign the approved custom workload-protection role to the managed identity defined by [CVbackup.json](https://github.com/Azure-Samples/Commvault-CV-Backup-Permissions/blob/main/CVbackup.json). |
| Azure management-plane access | Prepare the Microsoft Entra security groups that require access to Azure Native Commvault Cloud. After you create the account, assign the **Commvault Contributor** Azure role to these groups. |
| Workload access | Users who configure protection must have access to the Azure resources selected for protection. |

## Grant administrator consent

A tenant administrator must grant administrator consent to the Commvault single sign-on enterprise application. Administrator consent allows the application to authenticate users and request the permissions required for the integrated sign-in and authorization flow.

## Assign the workload-protection role

Download [CVbackup.json](https://github.com/Azure-Samples/Commvault-CV-Backup-Permissions/blob/main/CVbackup.json), create the approved custom Azure role from the file, and assign it to the managed identity used by the Commvault Cloud account at the supported scope.

The managed identity performs protection and recovery operations against Azure resources on behalf of the Commvault service. The workload-protection role grants the identity the Azure permissions required to discover selected virtual machines, read their configuration, and perform supported backup and recovery operations.

## Prepare Microsoft Entra security groups

Prepare the Microsoft Entra security groups that you want to map to Commvault roles during account creation. Map at least one group to the **Commvault Backup Administrator** role.

| Role | Intended access |
| --- | --- |
| **Commvault Backup Administrator** | Manages the Commvault Cloud backup service, creates and deletes resources, and grants access to other users. |
| **Commvault Backup Operator** | Manages Commvault Cloud resources but can't delete storage or backup plans. |
| **Commvault Backup User** | Creates protection groups and adds Azure resources to protection groups. |

The mapped Commvault role determines whether Commvault authorizes a requested backup or recovery operation. The **Commvault Contributor** Azure role determines whether Azure Resource Manager permits the operation. Both authorization checks must succeed.

## Next step

> [!div class="nextstepaction"]
> [Create a Commvault Cloud account](create.md)
