---
title: 'Azure AD Connect: How to recover from LocalDB 10GB limit issue | Microsoft Docs'
description: This topic describes how to recover Azure AD Connect Synchronization Service when it encounters LocalDB 10GB limit issue.
services: active-directory
documentationcenter: ''
author: billmath
manager: daveba
editor: ''

ms.assetid: 41d081af-ed89-4e17-be34-14f7e80ae358
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: troubleshooting
ms.date: 07/17/2017
ms.subservice: hybrid
ms.author: billmath

ms.collection: M365-identity-device-management
---
# Azure AD Connect: How to recover from LocalDB 10-GB limit
Azure AD Connect requires a SQL Server database to store identity data. You can either use the default SQL Server 2012 Express LocalDB installed with Azure AD Connect or use your own full SQL. SQL Server Express imposes a 10-GB size limit. When using LocalDB and this limit is reached, Azure AD Connect Synchronization Service can no longer start or synchronize properly. This article provides the recovery steps.

## Symptoms
There are two common symptoms:

* Azure AD Connect Synchronization Service **is running** but fails to synchronize with *“stopped-database-disk-full”* error.

* Azure AD Connect Synchronization Service **is unable to start**. When you attempt to start the service, it fails with event 6323 and error message *"The server encountered an error because SQL Server is out of disk space."*

## Short-term recovery steps
This section provides the steps to reclaim DB space required for Azure AD Connect Synchronization Service to resume operation. The steps include:
1. [Determine the Synchronization Service status](#determine-the-synchronization-service-status)
2. [Shrink the database](#shrink-the-database)
3. [Delete run history data](#delete-run-history-data)
4. [Shorten retention period for run history data](#shorten-retention-period-for-run-history-data)

### Determine the Synchronization Service status
First, determine whether the Synchronization Service is still running or not:

1. Log in to your Azure AD Connect server as administrator.

2. Go to **Service Control Manager**.

3. Check the status of **Microsoft Azure AD Sync**.


4. If it is running, do not stop or restart the service. Skip [Shrink the database](#shrink-the-database) step and go to [Delete run 
history data](#delete-run-history-data) step.

5. If it is not running, try to start the service. If the service starts successfully, skip [Shrink the database](#shrink-the-database) step and go to [Delete run history data](#delete-run-history-data) step. Otherwise, continue with [Shrink the database](#shrink-the-database) step.

### Shrink the database
Use the Shrink operation to free up enough DB space to start the Synchronization Service. It frees up DB space by removing whitespaces in the database. This step is best-effort as it is not guaranteed that you can always recover space. To learn more about Shrink operation, read this article [Shrink a database](https://msdn.microsoft.com/library/ms189035.aspx).

> [!IMPORTANT]
> Skip this step if you can get the Synchronization Service to run. It is not recommended to shrink the SQL DB as it can lead to poor performance due to increased fragmentation.

The name of the database created for Azure AD Connect is **ADSync**. To perform a Shrink operation, you must log in either as the sysadmin or DBO of the database. During Azure AD Connect installation, the following accounts are granted sysadmin rights:
* Local Administrators
* The user account that was used to run Azure AD Connect installation.
* The Sync Service account that is used as the operating context of Azure AD Connect Synchronization Service.
* The local group ADSyncAdmins that was created during installation.

1. Back up the database by copying **ADSync.mdf** and **ADSync_log.ldf** files located under `%ProgramFiles%\Microsoft Azure AD Sync\Data` to a safe location.

2. Start a new PowerShell session.

3. Navigate to folder `%ProgramFiles%\Microsoft SQL Server\110\Tools\Binn`.

4. Start **sqlcmd** utility by running the command `./SQLCMD.EXE -S "(localdb)\.\ADSync" -U <Username> -P <Password>`, using the credential of a sysadmin or the database DBO.

5. To shrink the database, at the sqlcmd prompt (1>), enter `DBCC Shrinkdatabase(ADSync,1);`, followed by `GO` in the next line.

6. If the operation is successful, try to start the Synchronization Service again. If you can start the Synchronization Service, go to [Delete run history data](#delete-run-history-data) step. If not, contact Support.

### Delete run history data
By default, Azure AD Connect retains up to seven days’ worth of run history data. In this step, we delete the run history data to reclaim DB space so that Azure AD Connect Synchronization Service can start syncing again.

1. Start **Synchronization Service Manager** by going to START → Synchronization Service.

2. Go to the **Operations** tab.

3. Under **Actions**, select **Clear Runs**…

4. You can either choose **Clear all runs** or **Clear runs before… \<date>** option. It is recommended that you start by clearing run history data that are older than two days. If you continue to run into DB size issue, then choose the **Clear all runs** option.

### Shorten retention period for run history data
This step is to reduce the likelihood of running into the 10-GB limit issue after multiple sync cycles.

1. Open a new PowerShell session.

2. Run `Get-ADSyncScheduler` and take note of the PurgeRunHistoryInterval property, which specifies the current retention period.

3. Run `Set-ADSyncScheduler -PurgeRunHistoryInterval 2.00:00:00` to set the retention period to two days. Adjust the retention period as appropriate.

## Long-term solution – Migrate to full SQL
In general, the issue is indicative that 10-GB database size is no longer sufficient for Azure AD Connect to synchronize your on-premises Active Directory to Azure AD. It is recommended that you switch to using the full version of SQL server. You cannot directly replace the LocalDB of an existing Azure AD Connect deployment with the database of the full version of SQL. Instead, you must deploy a new Azure AD Connect server with the full version of SQL. It is recommended that you do a swing migration where the new Azure AD Connect server (with SQL DB) is deployed as a staging server, next to the existing Azure AD Connect server (with LocalDB). 
* For instruction on how to configure remote SQL with Azure AD Connect, refer to article [Custom installation of Azure AD Connect](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnect-get-started-custom).
* For instructions on swing migration for Azure AD Connect upgrade, refer to article [Azure AD Connect: Upgrade from a previous version to the latest](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnect-upgrade-previous-version#swing-migration).

## Next steps
Learn more about [Integrating your on-premises identities with Azure Active Directory](whatis-hybrid-identity.md).
