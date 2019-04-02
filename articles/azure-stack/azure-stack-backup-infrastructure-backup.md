---
title: Backup and data recovery for Azure Stack with the Infrastructure Backup Service | Microsoft Docs
description: You can back up and restore configuration and service data using the Infrastructure Backup Service.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/25/2019
ms.author: mabrigg
ms.reviewer: hectorl
ms.lastreviewed: 03/19/2019

---
# Backup and data recovery for Azure Stack with the Infrastructure Backup Service

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

You can back up and restore configuration and service data using the Infrastructure Backup Service. Each Azure Stack installation contains an instance of the service. You can use backups created by the service for the redeployment of the Azure Stack Cloud to restore identity, security, and Azure Resource Manager data. 

You can enable backup when you are ready to put your cloud into production. Do not enable backup if you plan to perform testing and validation for a long period of time.

Before you enable your backup service, make sure you have [requirements in place](#verify-requirements-for-the-infrastructure-backup-service).

> [!Note]  
> The Infrastructure Backup Service does not include user data and applications. Refer to [protect VMs deployed on Azure Stack](user/azure-stack-manage-vm-protect.md) for more information on how to protect IaaS VM based applications. For a comprehensive understanding of how to protect applications on Azure Stack, refer to the [Azure Stack onsiderations for business continuity and disaster recovery whitepaper](http://aka.ms/azurestackbcdrconsiderationswp).

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
- **Encryption certificate**  
  Backup files are encrypted using the public key in the certificate. Make sure to store this certificate in a secure location. 


## Next steps

Learn how to [Enable Backup for Azure Stack from the administration portal](azure-stack-backup-enable-backup-console.md).

Learn how to [Enable Backup for Azure Stack with PowerShell](azure-stack-backup-enable-backup-powershell.md).

Learn how to [Back up Azure Stack](azure-stack-backup-back-up-azure-stack.md )

Learn how to [Recover from catastrophic data loss](azure-stack-backup-recover-data.md)
