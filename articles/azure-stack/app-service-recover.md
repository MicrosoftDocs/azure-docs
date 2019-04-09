---
title: Recover App Service on Azure Stack | Microsoft Docs
description: Detailed guidance for Azure Stack App Service disaster recovery
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: app-service
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/21/2019
ms.author: jeffgilb
ms.reviewer: apwestgarth
ms.lastreviewed: 03/21/2019

---
# Recovery of App Service on Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*  

This document provides instructions about actions to take for App Service disaster recovery.

The following actions must be taken to recover App Service on Azure Stack from backup:
1.	Restore the App Service databases
2.	Restore the file server share content
3.	Restore App Service roles and services

If Azure Stack storage was used for Function Apps storage, then you must also take steps to restore Function Apps.

## Restore the App Service databases
The App Service SQL Server databases should be restored on a production ready SQL Server instance. 

After [preparing the SQL Server instance](azure-stack-app-service-before-you-get-started.md#prepare-the-sql-server-instance) to host the App Service databases, use these steps to restore databases from backup:

1. Sign in to the SQL Server that will host the recovered App Service databases with administrator permissions.
2. Use the following commands to restore the App Service databases from a command prompt running with administrator permissions:
    ```dos
    sqlcmd -U <SQL admin login> -P <SQL admin password> -Q "RESTORE DATABASE appservice_hosting FROM DISK='<full path to backup>' WITH REPLACE"
    sqlcmd -U <SQL admin login> -P <SQL admin password> -Q "RESTORE DATABASE appservice_metering FROM DISK='<full path to backup>' WITH REPLACE"
    ```
3. Verify that both App Service databases have been successfully restored and exit SQL Server Management Studio.

> [!NOTE]
> To recover from a failover cluster instance failure, [these instructions](https://docs.microsoft.com/sql/sql-server/failover-clusters/windows/recover-from-failover-cluster-instance-failure?view=sql-server-2017). 

## Restore the App Service file share content
After [preparing the file server](azure-stack-app-service-before-you-get-started.md#prepare-the-file-server) to host the App Service file share, you need to restore the tenant file share content from backup. You can use whatever method you have available to copy the files into the newly created App Service file share location. Running this example on the file server will use PowerShell and robocopy to connect to a remote share and copy the files to the share:

```powershell
$source = "<remote backup storage share location>"
$destination = "<local file share location>"
net use $source /user:<account to use to connect to the remote share in the format of domain\username> *
robocopy /E $source $destination
net use $source /delete
```

In addition to copying the file share contents, you must also reset permissions on the file share itself. To do this, open an administrative command prompt on the file server computer and run the **ReACL.cmd** file. The **ReACL.cmd** file is located in the App Service installation files in the **BCDR** directory.

## Restore App Service roles and services
After the App Service databases and file share content have been restored, you next need to use PowerShell to restore the App Service roles and services. These steps will restore App Service secrets and service configurations.  

1. Log into the App Service controller **CN0-VM** VM as **roleadmin** using the password you provided during App Service installation. 
    > [!TIP]
    > You'll need to modify the VM's network security group to allow RDP connections. 
2. Copy the **SystemSecrets.JSON** file locally to the controller VM. You will need to provide the path to this file as the `$pathToExportedSecretFile` parameter in the next step. 
3. Use the following commands in an elevated PowerShell console window to restore App Service roles and services:

    ```powershell
    # Stop App Service services on the primary controller VM
    net stop WebFarmService
    net stop ResourceMetering
    net stop HostingVssService # This service was deprecated in the App Service 1.5 release and is not required after the App Service 1.4 release.

    # Restore App Service secrets. Provide the path to the App Service secrets file copied from backup. For example, C:\temp\SystemSecrets.json.
    # Press ENTER when prompted to reconfigure App Service from backup 

    # If necessary, use -OverrideDatabaseServer <restored server> with Restore-AppServiceStamp when the restored database server has a different address than backed-up deployment.
    # If necessary, use -OverrideContentShare <restored file share path> with Restore-AppServiceStamp when the restored file share has a different path from backed-up deployment.
    Restore-AppServiceStamp -FilePath $pathToExportedSecretFile 

    # Restore App Service roles
    Restore-AppServiceRoles

    # Restart App Service services
    net start WebFarmService
    net start ResourceMetering
    net start HostingVssService  # This service was deprecated in the App Service 1.5 release and is not required after the App Service 1.4 release.

    # After App Service has successfully restarted, and at least one management server is in ready state, synchronize App Service objects to complete the restore
    # Enter Y when prompted to get all sites and again for all ServerFarm entities.
    Get-AppServiceSite | Sync-AppServiceObject
    Get-AppServiceServerFarm | Sync-AppServiceObject
    ```

> [!TIP]
> It is highly recommended to close this PowerShell session when the command completes.

## Restore Function Apps 
App Service for Azure Stack does not support restoring tenant user apps or data other than file share content. Therefore, these must be backed up and recovered outside of App Service backup and restore operations. If Azure Stack storage was used for Function Apps storage, the following steps should be taken to recover lost data:

1. Create a new storage account to be used by the Function App. This storage can be Azure Stack storage, Azure storage, or any compatible storage.
2. Retrieve the connection string for the storage.
3. Open the function portal, browse to the function app.
4. Browse to the **Platform features** tab and click **Application Settings**.
5. Change **AzureWebJobsDashboard** and **AzureWebJobsStorage** to the new connection string and click **Save**.
6. Switch to **Overview**.
7. Restart the app. It might take several tries to clear all errors.

## Next steps
[App Service on Azure Stack overview](azure-stack-app-service-overview.md)