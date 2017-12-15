---
title: Infrastructure Backup Service best practices for Azure Stack | Microsoft Docs
description: You can follow set of best practices when you deploy and manage Azure Stack in your data center to help mitigate data loss if there is a catastrophic failure.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila
editor: ''

ms.assetid: 221FDE40-3EF8-4F54-A075-0C4D66EECE1A
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/15/2017
ms.author: mabrigg

---
# Infrastructure Backup Service best practices

You can follow set of best practices when you deploy and manage Azure Stack in your data center to help mitigate data loss if there is a catastrophic failure.

You should review the best practices at a regular interval to help validate that your installation is still in compliance when changes are made to the operation flow. Should you encounter any issues while implementing these best practices, contact Microsoft Support for assistance. `URL for contact information.`

## Configuration best practices

### Deployment

The recommendation is to enable Infrastructure Backup after deployment of each Azure Stack cloud. Using AzureStack-Tools you can schedule backups from any client/server with access to the operator management API endpoint. 

### Networking

UNC path must use a fully qualified domain name (FQDN). IP address is possible if name resolution is not possible. 

### Encryption

The encryption key is used to encrypt backup data that gets exported to external storage. The key can be generated using AzureStack-Tools. 

![AzureStack-Tools](media\azure-stack-backup\azure-stack-backup-encryption1.png)

The key must be stored in a secure location (for example, Azure Key Vault secret). This key must be used during redeployment of Azure Stack. 

![Stored the key a secure location.](media\azure-stack-backup\azure-stack-backup-encryption2.png)

## Operational best practices

## Backups

 - Infrastructure Backup Controller needs to be triggered on demand. Recommendation is to backup at least two times per day.
 - Backup jobs execute while the system is running so there is no downtime to the management experiences or user applications. Expect the backup jobs to take 20-40 minutes for a solution that is under reasonable load. 
 - Manual backup of network switches and Hardware Lifecycle Host should be stored on the same backup share where Infrastructure Backup Controller stores control plane backup data. Consider storing switch and HLH configurations in the region folder. If you have multiple Azure Stack instances in the same region, consider using an identifier for the scale unit the configuration belongs to. 
 - Folder structure

      - Infrastructure creates MASBACKUP folder automatically. This is a Microsoft-managed share. You can create shares at the same level as MASBACKUP. It is not recommended creating folders or storage data inside of MASBACKUP that Azure Stack does not create. 
      - User FQDN and region to differentiate backup data from different clouds. 

For example, the backup share is AzSBackups hosted on fileserver01.contoso.com. In that file share there may be a folder per Azure Stack deployment using the external domain name and a subfolder that uses the region name. 

FQDN: contoso.com
Region: nyc
`    \\fileserver01.contoso.com\AzSBackups`
`    \\fileserver01.contoso.com\AzSBackups\contoso.com`
`\\fileserver01.contoso.com\AzSBackups\contoso.com\nyc`
`\\fileserver01.contoso.com\AzSBackups\contoso.com\nyc\MASBackup`

MASBackup folder is where Azure Stack stores its backup data. You should not use this folder to store your own data. OEM should not use this folder to store any backup data either. 

OEMs are encouraged to store backup data for their components under the region folder. For example:

`    \\fileserver01.contoso.com\AzSBackups\contoso.com\nyc\HLH`
`    \\fileserver01.contoso.com\AzSBackups\contoso.com\nyc\Switches`
`    \\fileserver01.contoso.com\AzSBackups\contoso.com\nyc\DeploymentData`
`    \\fileserver01.contoso.com\AzSBackups\contoso.com\nyc\Registration`

### Restore

In the event of catastrophic data loss but the hardware is still usable, redeployment of Azure Stack is required. During redeployment, you can specify the storage location and credentials required to access backups. In this mode, there is no need to specify the services that need to be restored. Infrastructure Backup Controller injects control plane state as part of the deployment workflow. 

If there is a disaster that renders the hardware unusable, redeployment is only possible on new hardware. Redeployment can take several weeks while replacement hardware is ordered and arrives in the datacenter. Restore of control plane data is possible at any time. However, restore is not supported if the version of the redeployed instance is more than one version greater than the version used in the last backup. 

| Deployment mode | Starting point | End point                                                                                                                                                                                                     |
|-----------------|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Clean install   | Baseline build | OEM deploys Azure Stack and updates to the latest supported version.                                                                                                                                          |
| Recovery mode   | Baseline build | OEM deploys Azure Stack in recovery mode and handles the version matching requirements based on the latest backup available. The OEM completes the deployment by updating to latest supported version. |

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

- Next step...