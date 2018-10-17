---
title: Azure Resource Manager templates for Azure Backup
description: Azure Backup PowerShell Samples
services: backup
author: markgalioto
manager: carmonm
ms.service: backup
ms.topic: sample
ms.date: 04/18/2018
ms.author: markgal
ms.custom: mvc
---
# Azure Resource Manager templates for Azure Backup

The following table includes links to Azure Resource Manager templates for use with Recovery Services vaults and Azure Backup features.

|   |   |
|---|---|
|**Recovery Services vault** | |
| [Create a Recovery Services vault](https://github.com/Azure/azure-quickstart-templates/tree/master/101-recovery-services-vault-create)| Create a Recovery Services vault. The vault can be used for Azure Backup and Azure Site Recovery. |
|**Back up virtual machines**| |
| [Back up Resource Manager VMs](https://github.com/Azure/azure-quickstart-templates/tree/master/101-recovery-services-backup-vms) | Use the existing Recovery Services vault and Backup policy to back up Resource Manager-virtual machines in the same resource group.|
| [Back up IaaS VMs to Recovery Services vault](https://github.com/Azure/azure-quickstart-templates/tree/master/201-recovery-services-backup-classic-resource-manager-vms) | Template to back up classic and Resource Manager-virtual machines. |
| [Create Weekly Backup policy for IaaS VMs](https://github.com/Azure/azure-quickstart-templates/tree/master/101-recovery-services-weekly-backup-policy-create) | Template creates Recovery Services vault and a weekly backup policy which is used to back up classic and Resource Manager-virtual machines.|
| [Create Daily Backup policy for IaaS VMs](https://github.com/Azure/azure-quickstart-templates/tree/master/101-recovery-services-daily-backup-policy-create) | Template creates Recovery Services vault and a daily backup policy which is used to back up classic and Resource Manager-virtual machines.|
| [Deploy Windows Server VM with backup enabled](https://github.com/Azure/azure-quickstart-templates/tree/master/101-recovery-services-create-vm-and-configure-backup) | Template creates a Windows Server VM and Recovery Services vault with the default backup policy enabled.|
|**Monitor Backup jobs** |  |
| [Use OMS Log Analytics to monitor Azure Backup](https://github.com/Azure/azure-quickstart-templates/tree/master/101-backup-oms-monitoring) | Template deploys OMS Monitoring for Azure Backup which allows you to monitor backup and restore jobs, backup alerts and the Cloud storage used in your Recovery Services vaults.|  
|   |   |

