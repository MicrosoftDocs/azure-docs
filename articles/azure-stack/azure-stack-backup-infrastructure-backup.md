---
title: Backup and data recovery for Azure Stack with the Infrastructure Backup Service | Microsoft Docs
description: You can back up and restore configuration and service data using the Infrastructure Backup Service.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila
editor: ''

ms.assetid: 9B51A3FB-EEFC-4CD8-84A8-38C52CFAD2E4
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 9/10/2018
ms.author: mabrigg
ms.reviewer: hectorl

---
# Backup and data recovery for Azure Stack with the Infrastructure Backup Service

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

You can back up and restore configuration and service data using the Infrastructure Backup Service. Each Azure Stack installation contains an instance of the service. You can use backups created by the service for the redeployment of the Azure Stack Cloud to restore identity, security, and Azure Resource Manager data.

You can enable backup when you are ready to put your cloud into production. Do not enable backup if you plan to perform testing and validation for a long period of time.

Before you enable your backup service, make sure you have [requirements in place](#verify-requirements-for-the-infrastructure-backup-service).

> [!Note]  
> The Infrastructure Backup Service does not include user data and applications. See the following articles for instructions on backing up and restore [App Services](https://aka.ms/azure-stack-app-service), [SQL](https://aka.ms/azure-stack-ms-sql), and [MySQL](https://aka.ms/azure-stack-mysql) resource providers and associated user data..

## The Infrastructure Backup Service

The services contain the following features.

| Feature                                            | Description                                                                                                                                                |
|----------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Backup Infrastructure Services                     | Coordinate backup across a subset of infrastructure services in Azure Stack. If there is a disaster, the data can be restored as part of redeployment. |
| Compression and Encryption of Exported Backup Data | Backup data is compressed and encrypted by the system before it is exported to the external storage location provided by the administrator.                |
| Backup Job Monitoring                              | System notifies when backup jobs fail and remediation steps.                                                                                                |
| Backup management experience                       | Backup RP supports enabling backup.                                                                                                                         |
| Cloud Recovery                                     | If there is a catastrophic data loss, backups can be used to restore core Azure Stack information as part of deployment.                                 |

## Verify requirements for the Infrastructure Backup Service

- **Storage location**  
  You need a file share accessible from Azure Stack that can contain seven backups. Each backup is about 10 GB. Your share should be able to store 140 GB of backups. For more information about selecting a storage location for the Azure Stack Infrastructure Backup Service, see [Backup Controller requirements](azure-stack-backup-reference.md#backup-controller-requirements).
- **Credentials**  
  You need a domain user account and credentials, for example, you may use the Azure Stack administrator credentials.
- **Encryption key**  
  Backup files are encrypted using this key. Make sure to store this key in a secure location. Once you set this key for the first time or rotate the key in the future, you cannot view this key from this interface. For more instructions to generate a pre-shared key, follow the scripts at [Enable Backup for Azure Stack with PowerShell](azure-stack-backup-enable-backup-powershell.md).

## Next steps

- Learn how to [Enable Backup for Azure Stack from the administration portal](azure-stack-backup-enable-backup-console.md).
- Learn how to [Enable Backup for Azure Stack with PowerShell](azure-stack-backup-enable-backup-powershell.md).
- Learn how to [Back up Azure Stack](azure-stack-backup-back-up-azure-stack.md )
- Learn how to [Recover from catastrophic data loss](azure-stack-backup-recover-data.md)
