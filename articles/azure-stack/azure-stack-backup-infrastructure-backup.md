# Backup and data recovery for Azure Stack with the Infrastructure Backup Service
<azure-stack-backup-infrastructure-backup.md>

You can back up and restore configuration and service data using the Infrastructure Backup Service. Each Azure Stack installation contains an instance of the service. You can use the backup in a redeployment for the Azure Stack cloud to restore identity, security, and Azure Resource Manager data.

Backup can only be enabled after Azure Stack deployment and once the cloud is operational. Enable backup if you are going to put your cloud into production. However, if you plan to perform testing and validation for a long period of time, then do not enable backup. You can enable backup when you are ready to put the cloud into production. 

> [!Note]  
> The Infrastructure Backup Service does not include user data and applications. For information on backing up and restore App Services, Functions, SQL, and MySQL resource providers and associated user data `in a separate document`.

Features of the 

The following table summarizes the important features of infrastructure backup.

| Feature                                            | Description                                                                                                                                                |
|----------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Backup Infrastructure Services                     | Coordinate backup across a subset of infrastructure services in Azure Stack. If there is a disaster, the data can be restored as part of redeployment. |
| Compression and Encryption of Exported Backup Data | Backup data is compressed and encrypted by the system before it is exported to the external storage location provided by the administrator.                |
| Backup Job Monitoring                              | System notifies when backup jobs fail and remediation steps.                                                                                                |
| Backup management experience                       | Backup RP supports enabling backup.                                                                                                                         |
| Cloud Recovery                                     | If there is a catastrophic data loss, backups can be used to restore core Azure Stack information as part of deployment.                                 |

## Verify requirements for the Infrastructure Backup Service

- **Storage location**  
  You need a file share accessible from Azure Stack. For more information about selecting a storage location for the Azure Stack Infrastructure Backup Service, see [Infrastructure Backup Service Best Practices](azure-stack-backup-best-pracitices.md).
- **Credentials**  
  You need a domain user account and credentials, for example, you may use the Azure Stack administrator credentials.
- **Encryption key**  
  Backup files are encrypted using this key. Make sure to store this key in a secure location. Once you set this key for the first time or rotate the key in the future, you cannot view this key from this interface. For more information on how to generate a pre-shared key, see [article Title](http://). 

## Next steps

- Learn how to [Enable Backup for Azure Stack from the administration console](azure-stack-backup-enablebackup-console.md).
- Learn how to [Enable Backup for Azure Stack with PowerShell](azure-stack-backup-enablebackup-powershell.md).
- Learn how to [Back up Azure Stack](azure-stack-backup-back-up-Azure-Stack.md)
- Learn how to [Recover from catastrophic data loss](azure-stack-backup-recover-data.md)
