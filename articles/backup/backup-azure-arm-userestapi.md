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
ms.assetid: 7600c2f0-2dbd-4478-9dbb-c4101f855513
---
# Manage Azure VM backups using Azure Backup via REST API

Azure Backup users can manage Azure VM backups through [Azure portal](backup-azure-arm-vms-prepare.md) or using [Powershell](backup-azure-vms-automation.md) and [CLI support](quick-backup-vm-cli.md) For automation purposes. This document talks about how to use [Azure REST APIs](https://docs.microsoft.com/rest/api/recoveryservices/) to manage Azure VM backup and restore operations.

Following is the sequence of steps to be followed to use REST APIs for managing Azure VM backups using REST API.

## Create vault

Refer to [create vault REST API](https://docs.microsoft.com/rest/api/recoveryservices/vaults/createorupdate) to create a Recovery Services Vault. Let's assume a Recovery Services Vault "testVault" is created.

## Creating or selecting policy

List all available policies in the selected vault with this [list policies API](https://docs.microsoft.com/rest/api/backup/backuppolicies/list). An [example](https://docs.microsoft.com/rest/api/backup/backuppolicies/list#list_protection_policies_with_backupmanagementtype_filter_as_azureiaasvm) is provided to list policies for Azure VMs only.

Then [view the details of the relevant policy](https://docs.microsoft.com/rest/api/backup/protectionpolicies/get) by referring to it’s name (like “DefaultPolicy”).

## Configuring protection

The vault then must discover the VM, which is to be protected. Discovery involves two steps:

1. [**Refresh protectable containers**](https://docs.microsoft.com/rest/api/backup/protectioncontainers/refresh): Discovers all the Azure VMs that can be protected to the Recovery services vault. The refresh operation is an asynchronous operation and the result should be tracked using the [tracking operation API](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-async-operations) (The 'GET' URI needed in the tracking operation is present as the “Location” header in the response of the async operation).
2. After all the protectable containers are discovered, [list](https://docs.microsoft.com/rest/api/backup/backupprotectableitems/list#list_protectable_items_with_backupmanagementtype_filter_as_azureiaasvm) all the protectable items and select the VM you wish to protect. (Use the value in the “Name” field in the list response to identify the Azure VM with Name and virtualMachineID in properties bag to identify with resourceID)

The "Name" field in the response is used to construct the following variables

- containerName=”iaasvmcontainer;”+Name field value
- protectedItemName=”vm;”+Name field value

[Enable protection](https://docs.microsoft.com/rest/api/backup/protecteditems/createorupdate) for this virtual machine with the earlier selected policy and track using either the “location” header or “Azure-asyncOperation” header in the response.

## On-demand backup

[Trigger an explicit backup operation](https://docs.microsoft.com/rest/api/backup/backups/trigger) on the backup item (The first backup is always a scheduled backup. It is not triggered immediately after configuring protection). The containerName and protectedItemName are same as what were used in the configure protection step above. The adhoc backup operation is an async call and should be tracked using either the “location” header or “Azure-asyncOperation” header.

## Restore Operations

For any restore operation, [get the available list of Recovery points](https://docs.microsoft.com/rest/api/backup/recoverypoints/list) and then select the recovery point (Use the “name” field in response to identify a particular recovery point).

### Restore VMs or disks

Once the relevant recovery points are identified, perform [Restore disks](https://docs.microsoft.com/rest/api/backup/restores/trigger#restore_disks) or [Restore a VM](https://docs.microsoft.com/rest/api/backup/restores/trigger#restore_to_new_azure_iaasvm).

Restore disks and Restore VMs are both asynchronous operations. Track them using the location header or Azure-async header in the response.

### Restore files

After selecting the recovery point, it should be [provisioned](https://docs.microsoft.com/rest/api/backup/itemlevelrecoveryconnections/provision#examples) first. Note the server where you wish to run the resulting script and mount the disks/files. The name of the iSCSI initiator in that machine should be provided. The response returns “scriptContent”, “scriptNameSuffix” and “scriptExtension”. The “scriptNameSuffix” contains the password. The password should be extracted and saved. The scriptNameSuffix should be modified as explained [below](#file-name-generation-logic) and is used as file name. Then a file should be created with the "scriptContent" with the extension as specified in “scriptExtension". The password is required to be submitted when the file is run. Then the disks of the recovery point are mounted. When all the relevant files are copied, [revoke](https://docs.microsoft.com/rest/api/backup/itemlevelrecoveryconnections/revoke) the connection and the script becomes invalid.

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

All async operations should be tracked and the tracking result (using Azure-asyncOperation header) will display a JobID. The JobID is used to monitor further with the [job details API](https://docs.microsoft.com/rest/api/backup/jobdetails/get#azureiaasvmjob)
