---
title: Back up Azure VMs using REST API in Azure Backup
description: In this article, learn how to configure, initiate, and manage backup operations of Azure VM Backup using REST API.
ms.topic: how-to
ms.date: 02/09/2025
ms.assetid: b80b3a41-87bf-49ca-8ef2-68e43c04c1a3
author: jyothisuri
ms.author: jsuri
ms.custom: engagement-fy24
---

# Back up an Azure VM using Azure Backup via REST API

This article describes how to manage backups for an Azure VM using Azure Backup via REST API. Configure protection for the first time for a previously unprotected Azure VM, trigger an on-demand backup for a protected Azure VM and modify backup properties of a backed-up VM via REST API as explained here. To protect an Azure VM using the Azure portal, see [this article](backup-during-vm-creation.md).

Learn how to [create vault](backup-azure-arm-userestapi-createorupdatevault.md) and [create policy](backup-azure-arm-userestapi-createorupdatepolicy.md) REST API tutorials for creating new vaults and policies.

Let's assume you want to protect a VM `testVM` under a resource group `testRG` to a Recovery Services vault `testVault`, present within the resource group `testVaultRG`, with the default policy (named `DefaultPolicy`).

## Configure backup for an unprotected Azure VM using REST API

### Discover unprotected Azure VMs

First, the vault should be able to identify the Azure VM. This is triggered using the [refresh operation](/rest/api/backup/protection-containers/refresh). It's an asynchronous *POST*  operation that makes sure the vault gets the latest list of all unprotected VM in the current subscription and 'caches' them. Once the VM is 'cached', Recovery services will be able to access the VM and protect it.

```http
POST https://management.azure.com/Subscriptions/{subscriptionId}/resourceGroups/{vaultresourceGroupname}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupFabrics/{fabricName}/refreshContainers?api-version=2016-12-01
```

The POST URI has `{subscriptionId}`, `{vaultName}`, `{vaultresourceGroupName}`, `{fabricName}` parameters. The `{fabricName}` is "Azure". According to our example, `{vaultName}` is "testVault" and `{vaultresourceGroupName}` is "testVaultRG". As all the required parameters are given in the URI, there's no need for a separate request body.

```http
POST https://management.azure.com/Subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testVaultRG/providers/Microsoft.RecoveryServices/vaults/testVault/backupFabrics/Azure/refreshContainers?api-version=2016-12-01
```

#### Responses to refresh operation

The 'refresh' operation is an [asynchronous operation](../azure-resource-manager/management/async-operations.md). It means this operation creates another operation that needs to be tracked separately.

It returns two responses: 202 (Accepted) when another operation is created, and 200 (OK) when that operation completes.

|Name  |Type  |Description  |
|---------|---------|---------|
|204 No Content     |         |  OK  with No content returned      |
|202 Accepted     |         |     Accepted    |

**Example responses to refresh operation**:

Once the *POST* request is submitted, a 202 (Accepted) response is returned.

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
Location: https://management.azure.com/subscriptions//00000000-0000-0000-0000-000000000000/resourceGroups/testVaultRG/providers/microsoft.recoveryservices/vaults/testVault/backupFabrics/Azure/operationResults/aad204aa-a5cf-4be2-a7db-a224819e5890?api-version=2019-05-13
X-Powered-By: ASP.NET
```

Track the resulting operation using the "Location" header with a simple *GET* command

```http
GET https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testVaultRG/providers/microsoft.recoveryservices/vaults/testVault/backupFabrics/Azure/operationResults/aad204aa-a5cf-4be2-a7db-a224819e5890?api-version=2019-05-13
```

Once all the Azure VMs are discovered, the GET command returns a 204 (No Content) response. The vault is now able to discover any VM within the subscription.

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

 You can confirm that "caching" is done by [listing all protectable items](/rest/api/backup/backup-protectable-items/list) under the subscription and locate the desired VM in the response. [The response of this operation](#responses-to-get-operation) also gives you information on how Recovery Services identifies a VM.  Once you're familiar with the pattern, you can skip this step and directly proceed to [enabling protection](#enable-protection-for-the-azure-vm).

This operation is a *GET* operation.

```http
GET https://management.azure.com/Subscriptions/{subscriptionId}/resourceGroups/{vaultresourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupProtectableItems?api-version=2016-12-01&$filter=backupManagementType eq 'AzureIaasVM'
```

The *GET* URI has all the required parameters. No additional request body is needed.

#### Responses to get operation

|Name  |Type  |Description  |
|---------|---------|---------|
|200 OK     | [WorkloadProtectableItemResourceList](/rest/api/backup/backup-protectable-items/list#workloadprotectableitemresourcelist)        |       OK |

**Example responses to get operation**:

Once the *GET* request is submitted, 200 (OK) response is returned.

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
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testVaultRG/providers/microsoft.recoveryservices/vaults/testVault/backupFabrics/Azure/protectionContainers/IaasVMContainer;iaasvmcontainerv2;testRG;testVM/protectableItems/vm;iaasvmcontainerv2;testRG;testVM",
      "name": "iaasvmcontainerv2;testRG;testVM",
      "type": "Microsoft.RecoveryServices/vaults/backupFabrics/protectionContainers/protectableItems",
      "properties": {
        "virtualMachineId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testRG/providers/Microsoft.Compute/virtualMachines/testVM",
        "virtualMachineVersion": "Compute",
        "resourceGroup": "testRG",
        "backupManagementType": "AzureIaasVM",
        "protectableItemType": "Microsoft.Compute/virtualMachines",
        "friendlyName": "testVM",
        "protectionState": "NotProtected"
      }
    },……………..

```

> [!TIP]
> The number of values in a *GET* response is limited to 200 for a 'page'. Use the 'nextLink' field to get the URL for next set of responses.

The response contains the list of all unprotected Azure VMs and each `{value}` contains all the information required by Azure Recovery Service to configure backup. To configure backup, note the `{name}` field and the `{virtualMachineId}` field in `{properties}` section. Construct two variables from these field values as mentioned below.

- containerName = "iaasvmcontainer;"+`{name}`
- protectedItemName = "vm;"+ `{name}`
- `{virtualMachineId}` is used later in [the request body](#enable-protection-for-the-azure-vm)

In the example, the above values translate to:

- containerName = "iaasvmcontainer;iaasvmcontainerv2;testRG;testVM"
- protectedItemName = "vm;iaasvmcontainerv2;testRG;testVM"

### Enable protection for the Azure VM

After the relevant VM is "cached" and "identified", select the policy to protect. To know more about existing policies in the vault, refer to [list Policy API](/rest/api/backup/backup-policies/list). Then select the [relevant policy](/rest/api/backup/protection-policies/get) by referring to the policy name. To create policies, refer to [create policy tutorial](backup-azure-arm-userestapi-createorupdatepolicy.md). "DefaultPolicy" is selected in the example below.

Enabling protection is an asynchronous *PUT* operation that creates a 'protected item'.

```http
https://management.azure.com/Subscriptions/{subscriptionId}/resourceGroups/{vaultresourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupFabrics/{fabricName}/protectionContainers/{containerName}/protectedItems/{protectedItemName}?api-version=2019-05-13
```

The `{containerName}` and `{protectedItemName}` are as constructed above. The `{fabricName}` is "Azure". For our example, this translates to:

```http
PUT https://management.azure.com/Subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testVaultRG/providers/Microsoft.RecoveryServices/vaults/testVault/backupFabrics/Azure/protectionContainers/iaasvmcontainer;iaasvmcontainerv2;testRG;testVM/protectedItems/vm;iaasvmcontainerv2;testRG;testVM?api-version=2019-05-13
```

#### Create the request body

To create a protected item, following are the components of the request body.

|Name  |Type  |Description  |
|---------|---------|---------|
|properties     | AzureIaaSVMProtectedItem        |ProtectedItem Resource properties         |

For the complete list of definitions of the request body and other details, refer to [create protected item REST API document](/rest/api/backup/protected-items/create-or-update#request-body).

**Example request body**:

The following request body defines properties required to create a protected item.

```json
{
  "properties": {
    "protectedItemType": "Microsoft.Compute/virtualMachines",
    "sourceResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testRG/providers/Microsoft.Compute/virtualMachines/testVM",
    "policyId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testVaultRG/providers/microsoft.recoveryservices/vaults/testVault/backupPolicies/DefaultPolicy"
  }
}
```

The `{sourceResourceId}` is the `{virtualMachineId}` mentioned above from the [response of list protectable items](#responses-to-get-operation).
Responses to create protected item operation
@01011011






#### Responses to create protected item operation

The creation of a protected item is an [asynchronous operation](../azure-resource-manager/management/async-operations.md). It means this operation creates another operation that needs to be tracked separately.

It returns two responses: 202 (Accepted) when another operation is created, and 200 (OK) when that operation completes.

|Name  |Type  |Description  |
|---------|---------|---------|
|200 OK     |    [ProtectedItemResource](/rest/api/backup/protected-item-operation-results/get#protecteditemresource)     |  OK       |
|202 Accepted     |         |     Accepted    |

**Example responses to create protected item operation**:

Once you submit the *PUT* request for protected item creation or update, the initial response is 202 (Accepted) with a location header or Azure-async-header.

```http
HTTP/1.1 202 Accepted
Pragma: no-cache
Retry-After: 60
Azure-AsyncOperation: https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testVaultRG/providers/microsoft.recoveryservices/vaults/testVault/backupFabrics/Azure/protectionContainers/iaasvmcontainer;iaasvmcontainerv2;testRG;testVM/protectedItems/vm;testRG;testVM/operationsStatus/a0866047-6fc7-4ac3-ba38-fb0ae8aa550f?api-version=2019-05-13
X-Content-Type-Options: nosniff
x-ms-request-id: db785be0-bb20-4598-bc9f-70c9428b170b
x-ms-client-request-id: e1f94eef-9b2d-45c4-85b8-151e12b07d03; e1f94eef-9b2d-45c4-85b8-151e12b07d03
Strict-Transport-Security: max-age=31536000; includeSubDomains
x-ms-ratelimit-remaining-subscription-writes: 1199
x-ms-correlation-request-id: db785be0-bb20-4598-bc9f-70c9428b170b
x-ms-routing-request-id: SOUTHINDIA:20180521T073907Z:db785be0-bb20-4598-bc9f-70c9428b170b
Cache-Control: no-cache
Date: Mon, 21 May 2018 07:39:06 GMT
Location: https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testVaultRG/providers/microsoft.recoveryservices/vaults/testVault/backupFabrics/Azure/protectionContainers/iaasvmcontainer;iaasvmcontainerv2;testRG;testVM/protectedItems/vm;testRG;testVM/operationResults/a0866047-6fc7-4ac3-ba38-fb0ae8aa550f?api-version=2019-05-13
X-Powered-By: ASP.NET
```

Then track the resulting operation using the location header or Azure-AsyncOperation header with a simple *GET* command.

```http
GET https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testVaultRG/providers/microsoft.recoveryservices/vaults/testVault/backupFabrics/Azure/protectionContainers/iaasvmcontainer;iaasvmcontainerv2;testRG;testVM/protectedItems/vm;testRG;testVM/operationsStatus/a0866047-6fc7-4ac3-ba38-fb0ae8aa550f?api-version=2019-05-13
```

Once the operation completes, it returns 200 (OK) with the protected item content in the response body.

```json
{
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testVaultRG/providers/microsoft.recoveryservices/vaults/testVault/backupFabrics/Azure/protectionContainers/iaasvmcontainer;iaasvmcontainerv2;testRG;testVM/protectedItems/vm;testRG;testVM",
  "name": "VM;testRG;testVM",
  "type": "Microsoft.RecoveryServices/vaults/backupFabrics/protectionContainers/protectedItems",
  "properties": {
    "friendlyName": "testVM",
    "virtualMachineId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testRG/providers/Microsoft.Compute/virtualMachines/testVM",
    "protectionStatus": "Healthy",
    "protectionState": "IRPending",
    "healthStatus": "Passed",
    "lastBackupStatus": "",
    "lastBackupTime": "2001-01-01T00:00:00Z",
    "protectedItemDataId": "17592691116891",
    "extendedInfo": {
      "recoveryPointCount": 0,
      "policyInconsistent": false
    },
    "protectedItemType": "Microsoft.Compute/virtualMachines",
    "backupManagementType": "AzureIaasVM",
    "workloadType": "VM",
    "containerName": "iaasvmcontainerv2;testRG;testVM",
    "sourceResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testRG/providers/Microsoft.Compute/virtualMachines/testVM",
    "policyId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testVaultRG/providers/microsoft.recoveryservices/vaults/testVault/backupPolicies/DefaultPolicy",
    "policyName": "DefaultPolicy"
  }
}
```

This confirms that protection is enabled for the VM and the first backup will be triggered according to the policy schedule.

### Excluding disks in Azure VM backup

Azure Backup also provides a way to selectively back up a subset of disks in Azure VM. More details are provided [here](selective-disk-backup-restore.md). If you want to selectively back up few disks during enabling protection, the following code snippet should be the [request body during enabling protection](#create-the-request-body-for-on-demand-backup).

```json
{
"properties": {
    "protectedItemType": "Microsoft.Compute/virtualMachines",
    "sourceResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testRG/providers/Microsoft.Compute/virtualMachines/testVM",
    "policyId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testVaultRG/providers/microsoft.recoveryservices/vaults/testVault/backupPolicies/DefaultPolicy",
    "extendedProperties":  {
      "diskExclusionProperties":{
          "diskLunList":[0,1],
          "isInclusionList":true
        }
    }
}
}
```

In the request body above, the list of disks to be backed up are provided in the extended properties section.

|Property  |Value  |
|---------|---------|
|diskLunList     | The disk LUN list is a list of *LUNs of data disks*. **OS disk is always backed up and doesn't need to be mentioned**.        |
|IsInclusionList     | Should be **true** for the LUNs to be included during backup. If it's **false**, the aforementioned LUNs will be excluded.         |

So, if the requirement is to back up only the OS disk, then _all_ data disks should be excluded. An easier way is to say that no data disks should be included. So the disk LUN list will be empty and the **IsInclusionList** will be **true**. Similarly, think of what is the easier way of selecting a subset: A few disks should be always excluded or a few disks should always be included. Choose the LUN list and the boolean variable value accordingly.

## Trigger an on-demand backup for a protected Azure VM

Once an Azure VM is configured for backup, backups happen according to the policy schedule. You can wait for the first scheduled backup or trigger an on-demand backup anytime. Retention for on-demand backups is separate from backup policy's retention and can be specified to a particular date-time. If not specified, it's assumed to be 30 days from the day of the trigger of on-demand backup.

Triggering an on-demand backup is a *POST* operation.

```http
POST https://management.azure.com/Subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupFabrics/{fabricName}/protectionContainers/{containerName}/protectedItems/{protectedItemName}/backup?api-version=2016-12-01
```

The `{containerName}` and `{protectedItemName}` are as constructed [above](#responses-to-get-operation). The `{fabricName}` is "Azure". For our example, this translates to:

```http
POST https://management.azure.com/Subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testVaultRG/providers/Microsoft.RecoveryServices/vaults/testVault/backupFabrics/Azure/protectionContainers/iaasvmcontainer;iaasvmcontainerv2;testRG;testVM/protectedItems/vm;iaasvmcontainerv2;testRG;testVM/backup?api-version=2016-12-01
```

### Create the request body for on-demand backup

To trigger an on-demand backup, following are the components of the request body.

|Name  |Type  |Description  |
|---------|---------|---------|
|properties     | [IaaSVMBackupRequest](/rest/api/backup/backups/trigger#iaasvmbackuprequest)        |BackupRequestResource properties         |

For the complete list of definitions of the request body and other details, refer to [trigger backups for protected items REST API document](/rest/api/backup/backups/trigger#request-body).

#### Example request body for on-demand backup

The following request body defines properties required to trigger a backup for a protected item. If the retention isn't specified, it will be retained for 30 days from the time of trigger of the backup job.

```json
{
   "properties": {
    "objectType": "IaasVMBackupRequest",
    "recoveryPointExpiryTimeInUTC": "2018-12-01T02:16:20.3156909Z"
  }
}
```

### Responses for on-demand backup

Triggering an on-demand backup is an [asynchronous operation](../azure-resource-manager/management/async-operations.md). It means this operation creates another operation that needs to be tracked separately.

It returns two responses: 202 (Accepted) when another operation is created, and 200 (OK) when that operation completes.

|Name  |Type  |Description  |
|---------|---------|---------|
|202 Accepted     |         |     Accepted    |

#### Example responses for on-demand backup

Once you submit the *POST* request for an on-demand backup, the initial response is 202 (Accepted) with a location header or Azure-async-header.

```http
HTTP/1.1 202 Accepted
Pragma: no-cache
Retry-After: 60
Azure-AsyncOperation: https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testVaultRG/providers/microsoft.recoveryservices/vaults/testVault/backupFabrics/Azure/protectionContainers/iaasvmcontainer;iaasvmcontainerv2;testVaultRG;testVM/protectedItems/vm;testRG;testVM/operationsStatus/b8daecaa-f8f5-44ed-9f18-491a9e9ba01f?api-version=2019-05-13
X-Content-Type-Options: nosniff
x-ms-request-id: 7885ca75-c7c6-43fb-a38c-c0cc437d8810
x-ms-client-request-id: 7df8e874-1d66-4f81-8e91-da2fe054811d; 7df8e874-1d66-4f81-8e91-da2fe054811d
Strict-Transport-Security: max-age=31536000; includeSubDomains
x-ms-ratelimit-remaining-subscription-writes: 1199
x-ms-correlation-request-id: 7885ca75-c7c6-43fb-a38c-c0cc437d8810
x-ms-routing-request-id: SOUTHINDIA:20180521T083541Z:7885ca75-c7c6-43fb-a38c-c0cc437d8810
Cache-Control: no-cache
Date: Mon, 21 May 2018 08:35:41 GMT
Location: https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testVaultRG/providers/microsoft.recoveryservices/vaults/testVault/backupFabrics/Azure/protectionContainers/iaasvmcontainer;iaasvmcontainerv2;testVaultRG;testVM/protectedItems/vm;testRG;testVM/operationResults/b8daecaa-f8f5-44ed-9f18-491a9e9ba01f?api-version=2019-05-13
X-Powered-By: ASP.NET
```

Then track the resulting operation using the location header or Azure-AsyncOperation header with a simple *GET* command.

```http
GET https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testVaultRG/providers/microsoft.recoveryservices/vaults/testVault/backupFabrics/Azure/protectionContainers/iaasvmcontainer;iaasvmcontainerv2;testRG;testVM/protectedItems/vm;testRG;testVM/operationsStatus/a0866047-6fc7-4ac3-ba38-fb0ae8aa550f?api-version=2019-05-13
```

Once the operation completes, it returns 200 (OK) with the ID of the resulting backup job in the response body.

```json
HTTP/1.1 200 OK
Pragma: no-cache
X-Content-Type-Options: nosniff
x-ms-request-id: a8b13524-2c95-445f-b107-920806f385c1
x-ms-client-request-id: 5a63209d-3708-4e69-a75f-9499f4c8977c; 5a63209d-3708-4e69-a75f-9499f4c8977c
Strict-Transport-Security: max-age=31536000; includeSubDomains
x-ms-ratelimit-remaining-subscription-reads: 14995
x-ms-correlation-request-id: a8b13524-2c95-445f-b107-920806f385c1
x-ms-routing-request-id: SOUTHINDIA:20180521T083723Z:a8b13524-2c95-445f-b107-920806f385c1
Cache-Control: no-cache
Date: Mon, 21 May 2018 08:37:22 GMT
Server: Microsoft-IIS/8.0
X-Powered-By: ASP.NET

{
  "id": "00000000-0000-0000-0000-000000000000",
  "name": "00000000-0000-0000-0000-000000000000",
  "status": "Succeeded",
  "startTime": "2018-05-21T08:35:40.9488967Z",
  "endTime": "2018-05-21T08:35:40.9488967Z",
  "properties": {
    "objectType": "OperationStatusJobExtendedInfo",
    "jobId": "7ddead57-bcb9-4269-ac31-6a1b57588700"
  }
}
```

Since the backup job is a long running operation, it needs to be tracked as explained in the [monitor jobs using REST API document](backup-azure-arm-userestapi-managejobs.md#track-the-job).

## Modify the backup configuration for a protected Azure VM

### Changing the policy of protection

To change the policy with which VM is protected, you can use the same format as [enabling protection](#enable-protection-for-the-azure-vm)). Just provide the new policy ID in [the request body](#create-the-request-body) and submit the request. For example: To change the policy of testVM from 'DefaultPolicy' to 'ProdPolicy', provide the 'ProdPolicy' ID in the request body.

```json
{
  "properties": {
    "protectedItemType": "Microsoft.Compute/virtualMachines",
    "sourceResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testRG/providers/Microsoft.Compute/virtualMachines/testVM",
    "policyId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testVaultRG/providers/microsoft.recoveryservices/vaults/testVault/backupPolicies/ProdPolicy"
  }
}
```

The response will follow the same format as mentioned [for enabling protection](#responses-to-create-protected-item-operation)

#### Excluding disks during Azure VM protection

If the Azure VM is already backed up, you can specify the list of disks to be backed up or excluded by changing the policy of protection. Just prepare the request in the same format as [excluding disks during enabling protection](#excluding-disks-in-azure-vm-backup)

> [!IMPORTANT]
> The request body above is always the final copy of data disks to be excluded or included. This doesn't *add* to the previous configuration. For example: If you first update the protection as "exclude data disk 1" and then repeat with "exclude data disk 2", *only data disk 2 is excluded* in the subsequent backups and data disk 1 will be included. This is always the final list which will be included/excluded in the subsequent backups.

To get the current list of disks which are excluded or included, get the protected item information as mentioned [here](/rest/api/backup/protected-items/get). The response will provide the list of data disk LUNs and indicates whether they're included or excluded.

### Stop protection but retain existing data

To remove protection on a protected VM but retain the data already backed up, remove the policy in the request body and submit the request. Once the association with policy is removed, backups are no longer triggered and no new recovery points are created.

```http
{
  "properties": {
    "protectedItemType": "Microsoft.Compute/virtualMachines",
    "sourceResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testRG/providers/Microsoft.Compute/virtualMachines/testVM",
    "policyId": ""
  }
}
```

The response will follow the same format as mentioned [for triggering an on-demand backup](#example-responses-for-on-demand-backup). The resultant job should be tracked as explained in the [monitor jobs using REST API document](backup-azure-arm-userestapi-managejobs.md#track-the-job).

### Stop protection and delete data

To remove the protection on a protected VM and delete the backup data as well, perform a delete operation as detailed [here](/rest/api/backup/protected-items/delete).

Stopping protection and deleting data is a *DELETE* operation.

```http
DELETE https://management.azure.com/Subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupFabrics/{fabricName}/protectionContainers/{containerName}/protectedItems/{protectedItemName}?api-version=2019-05-13
```

The `{containerName}` and `{protectedItemName}` are as constructed [above](#responses-to-get-operation). `{fabricName}` is "Azure". For our example, this translates to:

```http
DELETE https://management.azure.com//Subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testVaultRG/providers/Microsoft.RecoveryServices/vaults/testVault/backupFabrics/Azure/protectionContainers/iaasvmcontainer;iaasvmcontainerv2;testRG;testVM/protectedItems/vm;iaasvmcontainerv2;testRG;testVM?api-version=2019-05-13
```

#### Responses for delete protection

*DELETE* protection is an [asynchronous operation](../azure-resource-manager/management/async-operations.md). It means this operation creates another operation that needs to be tracked separately.

It returns two responses: 202 (Accepted) when another operation is created, and 204 (NoContent) when that operation completes.

|Name  |Type  |Description  |
|---------|---------|---------|
|204 NoContent     |         |  NoContent       |
|202 Accepted     |         |     Accepted    |

> [!IMPORTANT]
> In order to protect against accidental delete scenarios, there's a [soft-delete feature available](use-restapi-update-vault-properties.md#soft-delete-state) for Recovery Services vault. If the soft-delete state of the vault is set to enabled, then the delete operation won't immediately delete the data. It will be kept for 14 days and then permanently purged. You aren't charged for storage for this 14 days period. To undo the deletion operation, refer to the [undo-delete section](#undo-the-deletion).

### Undo the deletion

Undoing the accidental deletion is similar to creating the backup item. After you undo the deletion, the item is retained but no future backups are triggered.

Undo deletion is a *PUT* operation which is very similar to [changing the policy](#changing-the-policy-of-protection) and/or [enabling the protection](#enable-protection-for-the-azure-vm). Just provide the intent to undo the deletion with the variable *isRehydrate*  in [the request body](#create-the-request-body) and submit the request. For example: To undo the deletion for testVM, the following request body should be used.

```http
{
  "properties": {
    "protectedItemType": "Microsoft.Compute/virtualMachines",
    "protectionState": "ProtectionStopped",
    "sourceResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testRG/providers/Microsoft.Compute/virtualMachines/testVM",
    "isRehydrate": true
  }
}
```

The response will follow the same format as mentioned [for triggering an on-demand backup](#example-responses-for-on-demand-backup). The resultant job should be tracked as explained in the [monitor jobs using REST API document](backup-azure-arm-userestapi-managejobs.md#track-the-job).

## Next steps

[Restore data from an Azure Virtual machine backup](backup-azure-arm-userestapi-restoreazurevms.md).

For more information on the Azure Backup REST APIs, see the following documents:

- [Azure Recovery Services provider REST API](/rest/api/recoveryservices/)
- [Get started with Azure REST API](/rest/api/azure/)
