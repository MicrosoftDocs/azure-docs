---
title: Troubleshooting errors while backing up SAP HANA databases using Azure Backup | Microsoft Docs
description: This guide explains how to troubleshoot common errors while trying to backup SAP HANA databases using Azure Backup.
services: backup
author: pvrk
manager: vijayts
ms.service: backup
ms.topic: conceptual
ms.date: 06/28/2019
ms.author: pullabhk
---

# Troubleshoot back up of SAP HANA Server on Azure

This article provides troubleshooting information for protecting SAP HANA databases on Azure Virtual Machines. Before proceeding to troubleshooting, let's understand few key points about permissions and settings.

## Understanding pre-requisites

As part of [pre-requisites](backup-azure-sap-hana-database.md#prerequisites), the pre-registration script should be run on the virtual machine where HANA is installed to set up the right permissions.

### Setting up permissions

What the pre-registration script does:

1. Creates AZUREWLBACKUPHANAUSER in HANA System and adds required Roles and Permissions as listed below:
    - DATABASE ADMIN  - To create new DBs during restore
    - CATALOG READ – To read the backup catalog
    - SAP_INTERNAL_HANA_SUPPORT – To access few private tables
2. Adds key to Hdbuserstore for HANA plugin to do all operations (inquiry of database, configuring backup, doing backup, doing restore)
   
   - To confirm the key creation, run the HDBSQL command within the HANA machine with SIDADM credentials:

    ``` hdbsql
    hdbuserstore list
    ```
    
    The command output should display the key {SID}{DBNAME} with the user as ‘AZUREWLBACKUPHANAUSER’.

> [!NOTE]
> Make sure you have a unique set of SSFS files under the path “/usr/sap/{SID}/home/.hdb/”. There should be only one folder under this path.

### Setting up BackInt parameters

Once a database is chosen for backup, the Azure Backup service will configure backInt parameters at DATABASE level.

- [catalog_backup_using_backint:true]
- [enable_accumulated_catalog_backup:false]
- [parallel_data_backup_backint_channels:1]
- [log_backup_timeout_s:900)]
- [backint_response_timeout:7200]

> [!NOTE]
> Make sure these parameters are NOT present at HOST level. Host level parameters will override these parameters and may cause different behavior than expected.

## Understanding common user errors

### UserErrorInOpeningHanaOdbcConnection

| Error message | Possible causes | Recommended action |
|---|---|---|
| Failed to connect to HANA system.check your system is up and running.| Azure Backup service is not able to connect to HANA because HANA DB is down. Or HANA is running but not allowing Azure Backup service to connect | Check if the HANA DB/service is down. If HANA DB/service is up and running, check if all permissions are set up as mentioned [here](#setting-up-permissions). If the key is missing, rerun the pre-registration script to create a new key. |

### UserErrorInvalidBackintConfiguration

| Error message | Possible causes | Recommended action |
|---|---|---|
| Detected Invalid Backint Configuration. Stop protection and reconfigure the database.| The backInt parameters are incorrectly specified for Azure Backup. | Check the parameters are as mentioned [here](#setting-up-backint-parameters). If backInt based parameters are present in HOST, then remove them. If parameters are not present at HOST but have been manually modified at a database level, then revert them to the appropriate values as mentioned above. Or 'stop protection with retain data' from Azure portal and 'resume backup' once again.|
