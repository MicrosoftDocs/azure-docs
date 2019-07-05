---
title: Troubleshoot errors while backing up SAP HANA databases by using Azure Backup | Microsoft Docs
description: Describes how to troubleshoot common errors that may occur when you use Azure Backup to back up SAP HANA databases.
services: backup
author: pvrk
manager: vijayts
ms.service: backup
ms.topic: conceptual
ms.date: 06/28/2019
ms.author: pullabhk
---

# Troubleshoot backup of SAP HANA Server on Azure

This article provides troubleshooting information for protecting SAP HANA databases on Azure virtual machines. First, let's cover a few key points about permissions and settings.

## Understanding prerequisites

As part of the [prerequisites](backup-azure-sap-hana-database.md#prerequisites), make sure the preregistration script has been run on the virtual machine on which HANA is installed. This sets up the correct permissions.

### Setting up permissions

What the preregistration script does:

1. Creates AZUREWLBACKUPHANAUSER in the HANA system and adds the following required roles and permissions:
    - DATABASE ADMIN  - To create new DBs during restore
    - CATALOG READ – To read the backup catalog
    - SAP_INTERNAL_HANA_SUPPORT – To access a few private tables
2. Adds a key to Hdbuserstore for the HANA plug-in to perform all operations (database queries, configuring and running backup, running restore).
   
   - To confirm that the key was created, run the HDBSQL command on the HANA machine with SIDADM credentials:

    ``` hdbsql
    hdbuserstore list
    ```
    
    The command output should display the {SID}{DBNAME} key, with the user shown as AZUREWLBACKUPHANAUSER.

> [!NOTE]
> Make sure you have a unique set of SSFS files under **/usr/sap/{SID}/home/.hdb/**. There should be only one folder in this path.

### Setting up BackInt parameters

After a database is chosen for backup, the Azure Backup service  configures backInt parameters at DATABASE level:

- [catalog_backup_using_backint:true]
- [enable_accumulated_catalog_backup:false]
- [parallel_data_backup_backint_channels:1]
- [log_backup_timeout_s:900)]
- [backint_response_timeout:7200]

> [!NOTE]
> Make sure these parameters are *not* present at HOST level. Host level parameters will override these parameters and may cause unexpected behavior.

## Understanding common user errors

### UserErrorInOpeningHanaOdbcConnection

| Error message | Possible causes | Recommended action |
|---|---|---|
| Failed to connect to HANA system. Verify that your system is up and running.| The Azure Backup service can't connect to HANA because HANA DB is down. Or HANA is running but not allowing the Azure Backup service to connect. | Check whether the HANA DB or service is down. If the HANA DB or service is up and running, check whether [all permissions are set](#setting-up-permissions). If the key is missing, rerun the preregistration script to create a new key. |

### UserErrorInvalidBackintConfiguration

| Error message | Possible causes | Recommended action |
|---|---|---|
| Detected Invalid Backint Configuration. Stop protection and reconfigure the database.| The backint parameters are incorrectly specified for Azure Backup. | Check whether [the parameters are set](#setting-up-backint-parameters). If backint-based parameters are present in HOST, remove them. If parameters are not present at HOST level but have been manually modified at a database level, revert them to the appropriate values as described above. Or, run **stop protection with retain data** from the Azure portal, and then run **resume backup**.|
