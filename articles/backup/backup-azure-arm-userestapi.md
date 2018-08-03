---
title: 'Azure Backup: Use REST API to manage Azure VM backups'
description: manage backup and restore operations of Azure VM Backup using REST API
services: backup
author: pvrk
manager: shivamg
keywords: REST API; Azure VM backup; Azure VM restore;
ms.service: backup
ms.topic: conceptual
ms.date: 08/03/2018
ms.author: pullabhk
---
# Manage Azure VM backups using Azure Backup via REST API

Azure backup provides the capability to manage Azure VM backups through [Azure portal](backup-azure-arm-vms-prepare.md). For automation purposes, [Powershell](backup-azure-vms-automation.md) and [CLI support](quick-backup-vm-cli.md) are also provided. This document talks about how to use [Azure REST APIs](https://docs.microsoft.com/rest/api/recoveryservices/) to manage Azure VM backup and restore operations.

Following are the important steps to be followed to use REST APIs for managing Azure backups.

## Authentication

Secure authentication using [Service principal mechanism](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-create-service-principal-portal) to the application which should connect to the REST API.

## Create vault

Refer to [create vault REST API](https://docs.microsoft.com/rest/api/recoveryservices/vaults/createorupdate) to create or connect to an existing vault.

## Creating or selecting policy

List all available policies in the selected vault with this [list policies API](https://docs.microsoft.com/rest/api/backup/backuppolicies/list). An [example](https://docs.microsoft.com/rest/api/backup/backuppolicies/list#list_protection_policies_with_backupmanagementtype_filter_as_azureiaasvm) is provided to get policies for Azure VMs only.

Then [select the relevant policy](https://docs.microsoft.com/rest/api/backup/protectionpolicies/get) by referring to it’s name (like “DefaultPolicy”).

## Configuring protection

The vault then must discover the VM which is to be protected. This involves 2 steps:

1. [**Refresh protectable containers**](https://docs.microsoft.com/rest/api/backup/protectioncontainers/refresh): Discovers all the Azure VMs which can be protected to the Recovery services vault. This is an asynchronous operation and hence the result should be tracked using the [tracking operation API](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-async-operations) (Please note that the GET URI used in the tracking operation should be obtained by referring to the “Location” header in the response of the POST operation performed previously).
2. After all the protectable containers are discovered, [list](https://docs.microsoft.com/rest/api/backup/backupprotectableitems/list#list_protectable_items_with_backupmanagementtype_filter_as_azureiaasvm) all the protectable items and select the VM you wish to protect. (Please use the value in the “Name” field in the list response to identify the Azure VM with Name and virtualMachineID in properties bag to identify with resourceID)

After you find the Name field in the list response, please note that for the upcoming APIs,

- containerName=”iaasvmcontainer;”+Name field value
- protectedItemName=”vm;”+Name field value

[Enable protection](https://docs.microsoft.com/rest/api/backup/protecteditems/createorupdate) for this virtual machine with the earlier selected policy. This is an async call and hence needs to be tracked using either the “location” header or “Azure-asyncOperation” header.

## On-demand backup

[Trigger an explicit backup operation](https://docs.microsoft.com/rest/api/backup/backups/trigger) on the backup item (The first backup is always a scheduled backup. It does not get triggered immediately after configuring protection). The containerName and protectedItemName are same as what were used in the configure protection step. This is an async call and hence needs to be tracked using either the “location” header or “Azure-asyncOperation” header.

## Restore Operations

For any restore operation, [get the available list of Recovery points](https://docs.microsoft.com/rest/api/backup/recoverypoints/list) and then select the recovery point (Use the “name” field in response to identify a particular recovery point).

### Restore VMs or disks

Once the recovery points are obtained, you can either [Restore disks](https://docs.microsoft.com/rest/api/backup/restores/trigger#restore_disks) or [Restore a VM](https://docs.microsoft.com/rest/api/backup/restores/trigger#restore_to_new_azure_iaasvm) completely

Restore disks and Restore VMs are both asynchronous operations. Track them using the location header or Azure-async header in the response.

### Restore files

After selecting the recovery point, it should be [provisioned](https://docs.microsoft.com/rest/api/backup/itemlevelrecoveryconnections/provision#examples) first. It should be noted that the name of the iSCSI initiator, in the server where you wish to run the resulting script and mount the disks/files, should be provided. The response returns the following fields “scriptContent”, “scriptNameSuffix” and “scriptExtension”. The “scriptNameSuffix” contains the password. Hence, we should extract the password, modify the scriptNameSuffix and then create a file with the extension as specified in “scriptExtension” (as explained [below](#file-name-generation-logic)). The password is required to be submitted when the file is run. Later when all the relevant files are copied, [revoke](https://docs.microsoft.com/rest/api/backup/itemlevelrecoveryconnections/revoke) the connection and the script becomes invalid.

#### File name generation logic

Extract the password from the ‘scriptNameSuffix’ using the following logic. The new ScriptNameSuffix should be without this password.

````C#
private string RemovePasswordFromSuffixAndReturn(ref string suffix)
        {
            int lastIndexOfUnderScore = suffix.LastIndexOf('_');
            int passwordOffset = lastIndexOfUnderScore +
                33;
            string password = suffix.Substring(
                passwordOffset, 15);
            suffix = suffix.Remove(
                passwordOffset, 15);
            return password;
        }
````

## Monitor jobs

Any job is created as a result of an operation (configure backup or adhoc backup or restore). The tracking result (using Azure-asyncOperation header) of the operation will display a JobID which you can then use to monitor further using the [job details API](https://docs.microsoft.com/rest/api/backup/jobdetails/get#azureiaasvmjob)
