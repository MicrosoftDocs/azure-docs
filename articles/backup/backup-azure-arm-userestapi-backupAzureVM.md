---
title: 'Azure Backup: Backup Azure VMs using REST API'
description: manage backup and restore operations of Azure VM Backup using REST API
services: backup
author: pvrk
manager: shivamg
keywords: REST API; Azure VM backup; Azure VM restore;
ms.service: backup
ms.topic: conceptual
ms.date: 08/03/2018
ms.author: pullabhk
ms.assetid: b80b3a41-87bf-49ca-8ef2-68e43c04c1a3
---

# Backup Azure VM using Azure Backup via REST API

This article describes how to manage backups for an Azure VM using Azure Backup via REST API. This includes configuring protection for the first time for a previously unprotected Azure VM, triggering an on-demand backup for a protected Azure VM and modifying backup properties for a protected Azure VM.

Refer to [create vault](backup-azure-arm-userestapi-createorupdatevault.md) and [create policy](backup-azure-arm-userestapi-createorupdatepolicy.md) REST API tutorials for creating new vaults and policies.

Let's assume you want to protect a VM "testVM" under a resource group "testRG" to a Recovery Services vault "testVault", present within the resource group "testVaultRG", with the default policy (which is named "DefaultPolicy").

## Configure backup for an unprotected Azure VM using REST API

### Discover unprotected Azure VMs

First, the vault should be able to identify the Azure VM. This is triggered using the [refresh operation](https://docs.microsoft.com/rest/api/backup/protectioncontainers/refresh). It is a *POST* asynchronous operation which makes sure the vault gets the latest list of all unprotected VMs.

```http
POST https://management.azure.com/Subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupFabrics/{fabricName}/refreshContainers?api-version=2016-12-01
```

Note that the POST URI has `{subscriptionId}`, `{vaultName}`, `{resourceGroupName}`, `{fabric}` parameters. The `{resourceGroupName}` parameter refers to vault's resource group and `{fabric}` is "Azure". Since all the required parameters are given the URI there is no requirement for a request body.

#### Responses

The 'refresh' operation is a [asynchronous operation](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-async-operations). This means this operation creates another operation which needs to be tracked separately.

It returns 2 responses: 202 (Accepted) when another operation is created and then 200 (OK) when that operation completes.

|Name  |Type  |Description  |
|---------|---------|---------|
|204 No Content     |         |  OK  with No content returned      |
|202 Accepted     |         |     Accepted    |

##### Example responses

Once the *POST* URI is submitted, a 202 (Accepted) response is returned.

```http
HTTP/1.1 202 Accepted
Pragma: no-cache
Retry-After: 60
X-Content-Type-Options: nosniff
x-ms-request-id: 43cf550d-e463-421c-8922-37e4766db27d
x-ms-client-request-id: 4910609f-bb9b-4c23-8527-eb6fa2d3253f; 4910609f-bb9b-4c23-8527-eb6fa2d3253f
Strict-Transport-Security: max-age=31536000; includeSubDomains
x-ms-ratelimit-remaining-subscription-writes: 1199
x-ms-correlation-request-id: 43cf550d-e463-421c-8922-37e4766db27d
x-ms-routing-request-id: SOUTHINDIA:20180521T105701Z:43cf550d-e463-421c-8922-37e4766db27d
Cache-Control: no-cache
Date: Mon, 21 May 2018 10:57:00 GMT
Location: https://management.azure.com/subscriptions//00000000-0000-0000-0000-000000000000/resourceGroups/testVaultRG/providers/microsoft.recoveryservices/vaults/testVault/backupFabrics/Azure/operationResults/aad204aa-a5cf-4be2-a7db-a224819e5890?api-version=2016-12-01
X-Powered-By: ASP.NET
```

Track the resulting operation using the "Location" header with a simple *GET* command

```http
GET https://management.azure.com/subscriptions//00000000-0000-0000-0000-000000000000/resourceGroups/testVaultRG/providers/microsoft.recoveryservices/vaults/testVault/backupFabrics/Azure/operationResults/aad204aa-a5cf-4be2-a7db-a224819e5890?api-version=2016-12-01
```

Once all the Azure VMs are discovered the GET command returns a 204 (No Content) response which means the vault is now able to discover any VM within the subscription.

```http
HTTP/1.1 204 NoContent
Pragma: no-cache
X-Content-Type-Options: nosniff
x-ms-request-id: cf6cd73b-9189-4942-a61d-878fcf76b1c1
x-ms-client-request-id: 25bb6345-f9fc-4406-be1a-dc6db0eefafe; 25bb6345-f9fc-4406-be1a-dc6db0eefafe
Strict-Transport-Security: max-age=31536000; includeSubDomains
x-ms-ratelimit-remaining-subscription-reads: 14997
x-ms-correlation-request-id: cf6cd73b-9189-4942-a61d-878fcf76b1c1
x-ms-routing-request-id: SOUTHINDIA:20180521T105825Z:cf6cd73b-9189-4942-a61d-878fcf76b1c1
Cache-Control: no-cache
Date: Mon, 21 May 2018 10:58:25 GMT
X-Powered-By: ASP.NET
```

### Selecting the relevant Azure VM

Once all Azure VMs under the subscription are discovered, they need to be 'tagged' to the Azure Recovery Service as a 'protectable item'. This will enable Azure Recovery Service to later configure backup on the relevant VM. This is performed by [listing all protectable items](https://docs.microsoft.com/rest/api/backup/backupprotectableitems/list) under the subscription. This is a *GET* operation.

```http
GET https://management.azure.com/Subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupProtectableItems?api-version=2016-12-01&$filter=backupManagementType eq 'AzureIaasVM'
```

Note that the *GET* URI has all the required parameters and hence no additional request body is required.

#### Responses

|Name  |Type  |Description  |
|---------|---------|---------|
|200 OK     | [WorkloadProtectableItemResourceList](https://docs.microsoft.com/rest/api/backup/backupprotectableitems/list#workloadprotectableitemresourcelist)        |       OK |

##### Example responses

Once the *GET* URI is submitted, a 200 (OK) response is returned.

```http
HTTP/1.1 200 OK
Pragma: no-cache
X-Content-Type-Options: nosniff
x-ms-request-id: 7c2cf56a-e6be-4345-96df-c27ed849fe36
x-ms-client-request-id: 40c8601a-c217-4c68-87da-01db8dac93dd; 40c8601a-c217-4c68-87da-01db8dac93dd
Strict-Transport-Security: max-age=31536000; includeSubDomains
x-ms-ratelimit-remaining-subscription-reads: 14979
x-ms-correlation-request-id: 7c2cf56a-e6be-4345-96df-c27ed849fe36
x-ms-routing-request-id: SOUTHINDIA:20180521T071408Z:7c2cf56a-e6be-4345-96df-c27ed849fe36
Cache-Control: no-cache
Date: Mon, 21 May 2018 07:14:08 GMT
Server: Microsoft-IIS/8.0
X-Powered-By: ASP.NET

{
  "value": [
    {
      "id": "/subscriptions/e3d2d341-4ddb-4c5d-9121-69b7e719485e/resourceGroups/Default-RecoveryServices-ResourceGroup-centralindia/providers/microsoft.recoveryservices/vaults/abdemovault/backupFabrics/Azure/protectionContainers/IaasVMContainer;iaasvmcontainerv2;demorg;demovm1/protectableItems/vm;iaasvmcontainerv2;demorg;demovm1",
      "name": "iaasvmcontainerv2;demorg;demovm1",
      "type": "Microsoft.RecoveryServices/vaults/backupFabrics/protectionContainers/protectableItems",
      "properties": {
        "virtualMachineId": "/subscriptions/e3d2d341-4ddb-4c5d-9121-69b7e719485e/resourceGroups/DemoRG/providers/Microsoft.Compute/virtualMachines/DemoVM1",
        "virtualMachineVersion": "Compute",
        "resourceGroup": "DemoRG",
        "backupManagementType": "AzureIaasVM",
        "protectableItemType": "Microsoft.Compute/virtualMachines",
        "friendlyName": "DemoVM1",
        "protectionState": "NotProtected"
      }
    },……………..

```


### Enabling protection for the Azure VM

#### Create the request body

##### Example request body

#### Responses

##### Example responses

## Trigger an on-demand backup for a protected Azure VM

## Modify the backup configuration for a protected Azure VM
