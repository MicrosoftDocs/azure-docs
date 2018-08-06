---
title: 'Azure Backup: Use REST API to manage SQL in SQL in Azure VM backups'
description: manage backup and restore operations of SQL in Azure VM Backup using REST API
services: backup
author: pvrk
manager: shivamg
keywords: REST API; SQL in Azure VM backup; SQL in Azure VM restore;
ms.service: backup
ms.topic: conceptual
ms.date: 08/06/2018
ms.author: pullabhk
---
# Manage SQL in Azure VM backups using Azure Backup via REST API

Azure Backup users can manage SQL in Azure VM backups through [[Azure portal](backup-azure-sql-database.md)](backup-azure-arm-vms-prepare.md). This document talks about how to use [Azure REST APIs](https://docs.microsoft.com/rest/api/recoveryservices/) to manage SQL in Azure VM backup and restore operations.

Following are the important steps to be followed to use REST APIs for managing Azure backups.

## Authentication

Secure authentication using [Service principal mechanism](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-create-service-principal-portal) to the application that should connect to the REST API.

## Create vault

Refer to [create vault REST API](https://docs.microsoft.com/rest/api/recoveryservices/vaults/createorupdate) to create or connect to an existing vault.

## Creating or selecting policy

List all available policies in the selected vault with this [list policies API](https://docs.microsoft.com/rest/api/backup/backuppolicies/list). An [example](https://docs.microsoft.com/rest/api/backup/backuppolicies/list#list_protection_policies_with_backupmanagementtype_filter_as_azureworkload) is provided to get policies for Azure workloads such as SQL.

Then [select the relevant policy](https://docs.microsoft.com/rest/api/backup/protectionpolicies/get) by referring to it’s name (like “HourlyLogBackup”).

## Configuring protection

The vault then must discover the VM, which is to be protected. Discovery involves two steps:

1. [**Refresh protectable containers**](https://docs.microsoft.com/rest/api/backup/protectioncontainers/refresh): Discovers all the Azure VMs that can be protected to the Recovery services vault. The refresh operation is an asynchronous operation and the result should be tracked using the [tracking operation API](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-async-operations) (The 'GET' URI needed in the tracking operation is present as the “Location” header in the response of the async operation).
2. After all the protectable containers are discovered, [list](https://docs.microsoft.com/rest/api/backup/backupprotectableitems/list#list_protectable_items_with_backupmanagementtype_filter_as_azureiaasvm) all the protectable items and select the VM in which the required SQL server/DB, you wish to protect, is present.
3. Now, [register](https://docs.microsoft.com/rest/api/backup/protectioncontainers/register) the selected VM so that Azure Backup can interact with SQL DBs within the VM (Use the value in the “Name” header in the list command's response to identify the Azure VM container with Name. The values in the JSON request to be supplied as HTTP request body can be obtained from the properties bag of the list protectable containers result). Save this container name for future use. This is an asynchronous operation and the result should be tracked using the tracking operation API.
4. Once the Azure VM hosting the SQL server is registered with Azure Backup service, the service [can inquire the SQL server](https://docs.microsoft.com/rest/api/backup/protectioncontainers/inquire) to get more details on the DBs present in the SQL server. Inquiry is an async operation that needs to be tracked with the “Location” header in the response.
5. [List all the protectable items](https://docs.microsoft.com/rest/api/backup/backupprotectableitems/list) across all registered and inquired servers and select the relevant DB to be protected. The DB name can be found in the “Name” property in the list response. Save the DB name for future use.
6. Then you can [enable protection](https://docs.microsoft.com/rest/api/backup/protecteditems/createorupdate) for this item with the earlier selected policy. Enable protection is an asynchronous operation and should be tracked using either the “location” header or “Azure-asyncOperation” header.

## On-demand backup

[Trigger an explicit backup operation](https://docs.microsoft.com/rest/api/backup/backups/trigger) on the backup item (The first backup is always a scheduled backup. It is not triggered immediately after configuring protection). Use the container name and DB name saved earlier above. The adhoc backup operation is an async call and should be tracked using either the “location” header or “Azure-asyncOperation” header.

## Restore Operations

For any restore operation, [get the available list of Recovery points](https://docs.microsoft.com/rest/api/backup/recoverypoints/list) and then select the recovery point (Use the “name” field in response to identify a particular recovery point).

### Restore SQL DBs

Once the relevant recovery points are identified, a [SQL DB can be restored](https://docs.microsoft.com/rest/api/backup/restores/trigger). Restore is an asynchronous operation and should be tracked using the location header or Azure-async header in the response.

## Monitor jobs

All async operations should be tracked and the tracking result (using Azure-asyncOperation header) will display a JobID. The JobID is used to monitor further with the [job details API](https://docs.microsoft.com/rest/api/backup/jobdetails/get#azureiaasvmjob)
