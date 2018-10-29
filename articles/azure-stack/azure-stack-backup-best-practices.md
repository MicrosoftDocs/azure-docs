---
title: Infrastructure Backup Service best practices for Azure Stack | Microsoft Docs
description: You can follow set of best practices when you deploy and manage Azure Stack in your datacenter to help mitigate data loss if there is a catastrophic failure.
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid: 221FDE40-3EF8-4F54-A075-0C4D66EECE1A
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/01/2018
ms.author: jeffgilb
ms.reviewer: hectorl

---
# Infrastructure Backup Service best practices

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

You can follow best practices when you deploy and manage Azure Stack in your datacenter to help mitigate data loss in the event of a catastrophic failure.

You should review the best practices at a regular interval to verify that your installation is still in compliance when changes are made to the operation flow. Should you encounter any issues while implementing these best practices, contact Microsoft Support for help.

## Configuration best practices

### Deployment

Enable Infrastructure Backup after deployment of each Azure Stack Cloud. Using Azure Stack PowerShell you can schedule backups from any client/server with access to the operator management API endpoint.

### Networking

The Universal Naming Convention (UNC) string for the path must use a fully qualified domain name (FQDN). IP address is possible if name resolution is not possible. A UNC string specifies the location of resources such as shared files or devices.

### Encryption

The encryption key is used to encrypt backup data that gets exported to external storage. The key is generated as part of [enabling backup for Azure Stack with PowerShell](azure-stack-backup-enable-backup-powershell.md).

The key must be stored in a secure location (for example, public Azure Key Vault secret). This key must be used during redeployment of Azure Stack. 

![Stored the key a secure location.](media\azure-stack-backup\azure-stack-backup-encryption2.png)

## Operational best practices

### Backups

 - Infrastructure Backup Controller needs to be triggered on demand. Recommendation is to backup at least two times per day.
 - Backup jobs execute while the system is running so there is no downtime to the management experiences or user applications. Expect the backup jobs to take 20-40 minutes for a solution that is under reasonable load.
 - Using OEM provided instruction, manually backup network switches and the hardware lifecycle host (HLH) should be stored on the same backup share where the Infrastructure Backup Controller stores control plane backup data. Consider storing switch and HLH configurations in the region folder. If you have multiple Azure Stack instances in the same region, consider using an identifier for each configuration that belongs to a scale unit.

### Folder Names

 - Infrastructure creates MASBACKUP folder automatically. This is a Microsoft-managed share. You can create shares at the same level as MASBACKUP. It is not recommended creating folders or storage data inside of MASBACKUP that Azure Stack does not create. 
 -  User FQDN and region in your folder name to differentiate backup data from different clouds. The fully qualified domain name (FQDN) of your Azure Stack deployment and endpoints is the combination of the Region parameter and the External Domain Name parameter. For  more information, see [Azure Stack datacenter integration - DNS](azure-stack-integrate-dns.md).

For example, the backup share is AzSBackups hosted on fileserver01.contoso.com. In that file share there may be a folder per Azure Stack deployment using the external domain name and a subfolder that uses the region name. 

FQDN: contoso.com  
Region: nyc


    \\fileserver01.contoso.com\AzSBackups
    \\fileserver01.contoso.com\AzSBackups\contoso.com
    \\fileserver01.contoso.com\AzSBackups\contoso.com\nyc
    \\fileserver01.contoso.com\AzSBackups\contoso.com\nyc\MASBackup

MASBackup folder is where Azure Stack stores its backup data. You should not use this folder to store your own data. OEM should not use this folder to store any backup data either. 

OEMs are encouraged to store backup data for their components under the region folder. Each network switches, hardware lifecycle host (HLH), and so on may be stored in its own subfolder. For example:

    \\fileserver01.contoso.com\AzSBackups\contoso.com\nyc\HLH
    \\fileserver01.contoso.com\AzSBackups\contoso.com\nyc\Switches
    \\fileserver01.contoso.com\AzSBackups\contoso.com\nyc\DeploymentData
    \\fileserver01.contoso.com\AzSBackups\contoso.com\nyc\Registration

### Monitoring

The following alerts are supported by the system:

| Alert                                                   | Description                                                                                     | Remediation                                                                                                                                |
|---------------------------------------------------------|-------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| Backup failed because the file share is out of capacity | File share is out of capacity and backup controller cannot export backup files to the location. | Add more storage capacity and try back up again. Delete existing backups (starting from oldest first) to free up space.                    |
| Backup failed due to connectivity problems.             | Network between Azure Stack and the file share is experiencing issues.                          | Address the network issue and try backup again.                                                                                            |
| Backup failed due to a fault in the path                | The file share path cannot be resolved                                                          | Map the share from a different computer to ensure the share is accessible. You may need to update the path if it is no longer valid.       |
| Backup failed due to authentication issue               | There might be an issue with the credentials or a network issue that impacts authentication.    | Map the share from a different computer to ensure the share is accessible. You may need to update credentials if they are no longer valid. |
| Backup failed due to a general fault                    | The failed request could be due to an intermittent issue. Try back up again.                    | Call support                                                                                                                               |

## Next steps

 - Review the reference material for the [Infrastructure Backup Service](azure-stack-backup-reference.md).  
 - Enable the [Infrastructure Backup Service](azure-stack-backup-enable-backup-console.md).
