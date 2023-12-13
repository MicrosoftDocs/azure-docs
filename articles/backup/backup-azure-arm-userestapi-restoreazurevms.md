---
title: Restore Azure VMs using REST API
description: In this article, learn how to manage restore operations of Azure Virtual Machine Backup using REST API.
ms.topic: conceptual
ms.date: 08/26/2021
ms.assetid: b8487516-7ac5-4435-9680-674d9ecf5642
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Restore Azure Virtual machines using REST API

Once the backup of an Azure virtual machine using Azure Backup is completed, one can restore entire Azure Virtual machines or disks or files from the same backup copy. This article describes how to restore an Azure VM or disks using REST API.

For any restore operation, one has to identify the relevant recovery point first.

## Select Recovery point

The available recovery points of a backup item can be listed using the [list recovery point REST API](/rest/api/backup/recovery-points/list). It's a simple *GET* operation with all the relevant values.

```http
GET https://management.azure.com/Subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupFabrics/{fabricName}/protectionContainers/{containerName}/protectedItems/{protectedItemName}/recoveryPoints?api-version=2019-05-13
```

The `{containerName}` and `{protectedItemName}` are as constructed [here](backup-azure-arm-userestapi-backupazurevms.md#example-responses-to-get-operation). `{fabricName}` is "Azure".

The *GET* URI has all the required parameters. There's no need for an additional request body.

### Responses

|Name  |Type  |Description  |
|---------|---------|---------|
|200 OK     |   [RecoveryPointResourceList](/rest/api/backup/recovery-points/list#recoverypointresourcelist)      |       OK  |

#### Example response

Once the *GET* URI is submitted, a 200 (OK) response is returned.

```http
HTTP/1.1 200 OK
Pragma: no-cache
X-Content-Type-Options: nosniff
x-ms-request-id: 03453538-2f8d-46de-8374-143ccdf60f40
x-ms-client-request-id: c48f4436-ce3f-42da-b537-12710d4d1a24; c48f4436-ce3f-42da-b537-12710d4d1a24
Strict-Transport-Security: max-age=31536000; includeSubDomains
x-ms-ratelimit-remaining-subscription-reads: 14998
x-ms-correlation-request-id: 03453538-2f8d-46de-8374-143ccdf60f40
x-ms-routing-request-id: SOUTHINDIA:20180604T071851Z:03453538-2f8d-46de-8374-143ccdf60f40
Cache-Control: no-cache
Date: Mon, 04 Jun 2018 07:18:51 GMT
Server: Microsoft-IIS/8.0
X-Powered-By: ASP.NET

{
  "value": [
    {
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testVaultRG/providers/microsoft.recoveryservices/vaults/testVault/backupFabrics/Azure/protectionContainers/iaasvmcontainer;iaasvmcontainerv2;testRG;testVM/protectedItems/VM;testRG;testVM/recoveryPoints/20982486783671",
      "name": "20982486783671",
      "type": "Microsoft.RecoveryServices/vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints",
      "properties": {
        "objectType": "IaasVMRecoveryPoint",
        "recoveryPointType": "AppConsistent",
        "recoveryPointTime": "2018-06-04T06:06:00.5121087Z",
        "recoveryPointAdditionalInfo": "",
        "sourceVMStorageType": "NormalStorage",
        "isSourceVMEncrypted": false,
        "isInstantIlrSessionActive": false,
        "recoveryPointTierDetails": [
          {
            "type": 1,
            "status": 1
          },
          {
            "type": 2,
            "status": 1
          }
        ],
        "isManagedVirtualMachine": true,
        "virtualMachineSize": "Standard_A1_v2",
        "originalStorageAccountOption": false
      }
    },
    {
      "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testVaultRG/providers/microsoft.recoveryservices/vaults/testVault/backupFabrics/Azure/protectionContainers/iaasvmcontainer;iaasvmcontainerv2;testRG;testVM/protectedItems/VM;testRG;testVM/recoveryPoints/23358112038108",
      "name": "23358112038108",
      "type": "Microsoft.RecoveryServices/vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints",
      "properties": {
        "objectType": "IaasVMRecoveryPoint",
        "recoveryPointType": "CrashConsistent",
        "recoveryPointTime": "2018-06-03T06:20:56.3043878Z",
        "recoveryPointAdditionalInfo": "",
        "sourceVMStorageType": "NormalStorage",
        "isSourceVMEncrypted": false,
        "isInstantIlrSessionActive": false,
        "recoveryPointTierDetails": [
          {
            "type": 1,
            "status": 1
          },
          {
            "type": 2,
            "status": 1
          }
        ],
        "isManagedVirtualMachine": true,
        "virtualMachineSize": "Standard_A1_v2",
        "originalStorageAccountOption": false
      }
    },
......
```

The recovery point is identified with the `{name}` field in the above response.

## Restore operations

After selecting the [relevant restore point](#select-recovery-point), proceed to trigger the restore operation.

***All restore operations on the backup item are performed with the same *POST* API. Only the request body changes with the restore scenarios.***

> [!IMPORTANT]
> All details about various restore options and their dependencies are mentioned [here](./backup-azure-arm-restore-vms.md#restore-options). Please review before proceeding to triggering these operations.

Triggering restore operations is a *POST* request. To know more about the API, refer to the ["trigger restore" REST API](/rest/api/backup/restores/trigger).

```http
POST https://management.azure.com/Subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupFabrics/{fabricName}/protectionContainers/{containerName}/protectedItems/{protectedItemName}/recoveryPoints/{recoveryPointId}/restore?api-version=2019-05-13
```

The `{containerName}` and `{protectedItemName}` are as constructed [here](backup-azure-arm-userestapi-backupazurevms.md#example-responses-to-get-operation). `{fabricName}` is "Azure" and the `{recoveryPointId}` is the `{name}` field of the recovery point mentioned [above](#example-response).

Once the recovery point is obtained, we need to construct the request body for the relevant restore scenario. The following sections outline the request body for each scenario.

- [Restore disks](#restore-disks)
- [Replace disks](#replace-disks-in-a-backed-up-virtual-machine)
- [Restore as a new virtual machine](#restore-as-another-virtual-machine)

### Restore Response

The triggering of any restore operation is an [asynchronous operation](../azure-resource-manager/management/async-operations.md). It means this operation creates another operation that needs to be tracked separately.

It returns two responses: 202 (Accepted) when another operation is created, and then 200 (OK) when that operation completes.

|Name  |Type  |Description  |
|---------|---------|---------|
|202 Accepted     |         |     Accepted    |

#### Example responses

Once you submit the *POST* URI for triggering restore disks, the initial response is 202 (Accepted) with a location header or Azure-async-header.

```http
HTTP/1.1 202 Accepted
Pragma: no-cache
Retry-After: 60
Azure-AsyncOperation: https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testVaultRG/providers/microsoft.recoveryservices/vaults/testVault/backupFabrics/Azure/protectionContainers/iaasvmcontainer;iaasvmcontainerv2;testRG;testVM/protectedItems/vm;testRG;testVM/operationsStatus/781a0f18-e250-4d73-b059-5e9ffed4069e?api-version=2019-05-13
X-Content-Type-Options: nosniff
x-ms-request-id: 893fe372-8d6c-4c56-b589-45a95eeef95f
x-ms-client-request-id: a15ce064-25bd-4ac6-87e5-e3bc6ec65c0b; a15ce064-25bd-4ac6-87e5-e3bc6ec65c0b
Strict-Transport-Security: max-age=31536000; includeSubDomains
x-ms-ratelimit-remaining-subscription-writes: 1198
x-ms-correlation-request-id: 893fe372-8d6c-4c56-b589-45a95eeef95f
x-ms-routing-request-id: SOUTHINDIA:20180604T130003Z:893fe372-8d6c-4c56-b589-45a95eeef95f
Cache-Control: no-cache
Date: Mon, 04 Jun 2018 13:00:03 GMT
Location: https://management.azure.com/subscriptions//subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testVaultRG/providers/microsoft.recoveryservices/vaults/testVault/backupFabrics/Azure/protectionContainers/iaasvmcontainer;iaasvmcontainerv2;testRG;testVM/protectedItems/vm;testRG;testVM/operationResults/781a0f18-e250-4d73-b059-5e9ffed4069e?api-version=2019-05-13
X-Powered-By: ASP.NET
```

Then track the resulting operation using the location header or Azure-AsyncOperation header with a simple *GET* command.

```http
GET https://management.azure.com/subscriptions//subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testVaultRG/providers/microsoft.recoveryservices/vaults/testVault/backupFabrics/Azure/protectionContainers/iaasvmcontainer;iaasvmcontainerv2;testRG;testVM/protectedItems/vm;testRG;testVM/operationResults/781a0f18-e250-4d73-b059-5e9ffed4069e?api-version=2019-05-13
```

Once the operation completes, it returns 200 (OK) with the ID of the resulting restore job in the response body.

```http
HTTP/1.1 200 OK
Pragma: no-cache
X-Content-Type-Options: nosniff
x-ms-request-id: ea2a8011-eb83-4a4b-9ed2-e694070a966a
x-ms-client-request-id: a7f3a144-ed80-41ee-bffe-ae6a90c35a2f; a7f3a144-ed80-41ee-bffe-ae6a90c35a2f
Strict-Transport-Security: max-age=31536000; includeSubDomains
x-ms-ratelimit-remaining-subscription-reads: 14973
x-ms-correlation-request-id: ea2a8011-eb83-4a4b-9ed2-e694070a966a
x-ms-routing-request-id: SOUTHINDIA:20180604T130917Z:ea2a8011-eb83-4a4b-9ed2-e694070a966a
Cache-Control: no-cache
Date: Mon, 04 Jun 2018 13:09:17 GMT
Server: Microsoft-IIS/8.0
X-Powered-By: ASP.NET

{
  "id": "781a0f18-e250-4d73-b059-5e9ffed4069e",
  "name": "781a0f18-e250-4d73-b059-5e9ffed4069e",
  "status": "Succeeded",
  "startTime": "2018-06-04T13:00:03.8068176Z",
  "endTime": "2018-06-04T13:00:03.8068176Z",
  "properties": {
    "objectType": "OperationStatusJobExtendedInfo",
    "jobId": "3021262a-fb3a-4538-9b37-e3e97a386093"
  }
}
```

Since the restore job is a long running operation, it should be tracked as explained in the [monitor jobs using REST API document](backup-azure-arm-userestapi-managejobs.md#tracking-the-job).

### Restore disks

If there's a need to customize the creation of a VM from the backup data, you can just restore disks into a chosen storage account and create a VM from those disks according to their requirements. The storage account should be in the same region as the Recovery Services vault and shouldn't be zone redundant. The disks, as well as the configuration of the backed-up VM ("vmconfig.json"), will be stored in the given storage account. As explained [above](#restore-operations), the relevant request body for restore disks is provided below.

#### Create request body

To trigger a disk restore from an Azure VM backup, following are the components of the request body.

|Name  |Type  |Description  |
|---------|---------|---------|
|properties     | [IaaSVMRestoreRequest](/rest/api/backup/restores/trigger#iaasvmrestorerequest)        |    RestoreRequestResourceProperties     |

For the complete list of definitions of the request body and other details, refer to [trigger Restore REST API document](/rest/api/backup/restores/trigger#request-body).

##### Example request

The following request body defines properties required to trigger a disk restore.

```json
{
  "properties": {
    "objectType": "IaasVMRestoreRequest",
    "recoveryPointId": "20982486783671",
    "recoveryType": "RestoreDisks",
    "sourceResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testRG/providers/Microsoft.Compute/virtualMachines/testVM",
    "storageAccountId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testRG/providers/Microsoft.Storage/storageAccounts/testAccount",
    "region": "westus",
    "createNewCloudService": false,
    "originalStorageAccountOption": false,
    "encryptionDetails": {
      "encryptionEnabled": false
    }
  }
}
```

### Restore disks selectively

If you are [selectively backing up disks](backup-azure-arm-userestapi-backupazurevms.md#excluding-disks-in-azure-vm-backup), then the current backed-up disk list is provided in the [recovery point summary](#select-recovery-point) and [detailed response](/rest/api/backup/recovery-points/get). You can also selectively restore disks and more details are provided [here](selective-disk-backup-restore.md#selective-disk-restore). To selectively restore a disk among the list of backed up disks, find the LUN of the disk from the recovery point response and add the **restoreDiskLunList** property to the [request body above](#example-request) as shown below.

```json
{
    "properties": {
        "objectType": "IaasVMRestoreRequest",
        "recoveryPointId": "20982486783671",
        "recoveryType": "RestoreDisks",
        "sourceResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testRG/providers/Microsoft.Compute/virtualMachines/testVM",
        "storageAccountId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testRG/providers/Microsoft.Storage/storageAccounts/testAccount",
        "region": "westus",
        "createNewCloudService": false,
        "originalStorageAccountOption": false,
        "encryptionDetails": {
          "encryptionEnabled": false
        },
        "restoreDiskLunList" : [0]
    }
}

```

Once you track the response as explained [above](#responses), and the long running job is complete, the disks and the configuration of the backed up virtual machine ("VMConfig.json") will be present in the given storage account.

### Replace disks in a backed-up virtual machine

While restore disks creates disks from the recovery point, replace disks replaces the current disks of the backed-up VM with the disks from the recovery point. As explained [above](#restore-operations), the relevant request body for replacing disks is provided below.

#### Create request body

To trigger a disk replacement from an Azure VM backup, following are the components of the request body.

|Name  |Type  |Description  |
|---------|---------|---------|
|properties     | [IaaSVMRestoreRequest](/rest/api/backup/restores/trigger#iaasvmrestorerequest)        |    RestoreRequestResourceProperties     |

For the complete list of definitions of the request body and other details, refer to [trigger Restore REST API document](/rest/api/backup/restores/trigger#request-body).

#### Example request

The following request body defines properties required to trigger a disk restore.

```json
{
    "properties": {
        "objectType": "IaasVMRestoreRequest",
        "recoveryPointId": "20982486783671",
        "recoveryType": "OriginalLocation",
        "sourceResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testRG/providers/Microsoft.Compute/virtualMachines/testVM",
        "storageAccountId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testRG/providers/Microsoft.Storage/storageAccounts/testAccount",  
        "region": "westus",
        "createNewCloudService": false,
        "originalStorageAccountOption": false,
        "affinityGroup": "",
        "diskEncryptionSetId": null,
        "subnetId": null,
        "targetDomainNameId": null,
        "targetResourceGroupId": null,
        "targetVirtualMachineId": null,
        "virtualNetworkId": null
     }
}

```

### Restore as another virtual machine

As explained [above](#restore-operations), the following request body defines properties required to trigger a virtual machine restore.

```json
{
  "properties": {
          "objectType":  "IaasVMRestoreRequest",
          "recoveryPointId": "348916168024334",
          "recoveryType": "AlternateLocation",
          "sourceResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testRG/providers/Microsoft.Compute/virtualMachines/testVM",
          "targetVirtualMachineId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/targetRG/providers/Microsoft.Compute/virtualmachines/targetVM",
          "targetResourceGroupId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/targetRG",
          "storageAccountId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testRG/providers/Microsoft.Storage/storageAccounts/testingAccount",
          "virtualNetworkId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/targetRG/providers/Microsoft.Network/virtualNetworks/testNet",
          "subnetId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/targetRG/providers/Microsoft.Network/virtualNetworks/testNet/subnets/default",
          "region": "westus",
          "createNewCloudService": false,
          "originalStorageAccountOption": false,
          "encryptionDetails": {
            "encryptionEnabled": false
          }
     }
 }
```

The response should be handled in the same way as [explained above for restoring disks](#responses).

## Cross Region Restore

If Cross Region Restore (CRR) is enabled on the vault with which you've protected your VMs, the backup data is replicated to the secondary region. You can use the backup data to perform a restore operation. To trigger a restore operation in the secondary region using REST API, follow these steps:

### Select recovery point in secondary region

You can list the available recovery points of a backup item in the secondary region using the [list recovery points REST API for CRR](/rest/api/backup/recovery-points-crr/list). It's a simple GET operation with all the relevant values.

```http
GET https://management.azure.com/Subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupFabrics/{fabricName}/protectionContainers/{containerName}/protectedItems/{protectedItemName}/recoveryPoints?api-version=2018-12-20

```

The `{containerName}` and `{protectedItemName}` are as constructed [here](backup-azure-arm-userestapi-backupazurevms.md#example-responses-to-get-operation). `{fabricName}` is "Azure".

The *GET* URI has all the required parameters. An additional request body isn't required.

>[!NOTE]
>For getting recovery points in the secondary region, use API version 2018-12-20 as in the above example.

#### Responses

|Name  |Type  |Description  |
|---------|---------|---------|
|200 OK     |   [RecoveryPointResourceList](/rest/api/backup/recovery-points-crr/list#recoverypointresourcelist)      |       OK  |

#### Example response

Once the *GET* URI is submitted, a 200 (OK) response is returned.

```http
Headers:
Pragma                        : no-cache
X-Content-Type-Options        : nosniff
x-ms-request-id               : bfc4a4e6-c585-46e0-8e38-f11a86093701
x-ms-client-request-id        : 4344a9c2-70d8-482d-b200-0ca9cc498812,4344a9c2-70d8-482d-b200-0ca9cc498812
Strict-Transport-Security     : max-age=31536000; includeSubDomains
x-ms-ratelimit-remaining-subscription-resource-requests: 149
x-ms-correlation-request-id   : bfc4a4e6-c585-46e0-8e38-f11a86093701
x-ms-routing-request-id       : SOUTHINDIA:20210731T112441Z:bfc4a4e6-c585-46e0-8e38-f11a86093701
Cache-Control                 : no-cache
Date                          : Sat, 31 Jul 2021 11:24:40 GMT
Server                        : Microsoft-IIS/10.0
X-Powered-By                  : ASP.NET

Body:
{
  "value": [
    {
      "id":
"/Subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testVaultRG/providers/Microsoft.RecoveryServices/vaults/testVault/backupFabrics/Azure/protectionContainers/IaasVMContainer;iaasvmcontainerv2;testRG1;testVM/protectedItems/VM;iaasvmcontainerv2;testRG1;testVM/recoveryPoints/932895704780058094",
      "name": "932895704780058094",
      "type": "Microsoft.RecoveryServices/vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints",
      "properties": {
        "objectType": "IaasVMRecoveryPoint",
        "recoveryPointType": "CrashConsistent",
        "recoveryPointTime": "2021-07-31T09:24:34.687561Z",
        "recoveryPointAdditionalInfo": "",
        "sourceVMStorageType": "PremiumVMOnPartialPremiumStorage",
        "isSourceVMEncrypted": false,
        "isInstantIlrSessionActive": false,
        "recoveryPointTierDetails": [
          {
            "type": 1,
            "status": 1
          }
        ],
        "isManagedVirtualMachine": true,
        "virtualMachineSize": "Standard_D2s_v3",
        "originalStorageAccountOption": false,
        "osType": "Windows"
      }
    },
    {
      "id":
"/Subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testVaultRG/providers/Microsoft.RecoveryServices/vaults/testVault/backupFabrics/Azure/protectionContainers/IaasVMContainer;iaasvmcontainerv2;testRG1;testVM/protectedItems/VM;iaasvmcontainerv2;testRG1;testVM/recoveryPoints/932891484644960954",
      "name": "932891484644960954",
      "type": "Microsoft.RecoveryServices/vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints",
      "properties": {
        "objectType": "IaasVMRecoveryPoint",
        "recoveryPointType": "CrashConsistent",
        "recoveryPointTime": "2021-07-30T09:20:01.8355052Z",
        "recoveryPointAdditionalInfo": "",
        "sourceVMStorageType": "PremiumVMOnPartialPremiumStorage",
        "isSourceVMEncrypted": false,
        "isInstantIlrSessionActive": false,
        "recoveryPointTierDetails": [
          {
            "type": 1,
            "status": 1
          },
          {
            "type": 2,
            "status": 1
          }
        ],
        "isManagedVirtualMachine": true,
        "virtualMachineSize": "Standard_D2s_v3",
        "originalStorageAccountOption": false,
        "osType": "Windows"
      }
    },
.....
```

The recovery point is identified with the `{name}` field in the above response.

### Get access token

To perform cross-region restore, you'll require an access token to authorize your request to access replicated restore points in the secondary region. To get an access token, follow these steps:

#### Step 1:

Use the [AAD Properties API](/rest/api/backup/aad-properties/get) to get AAD properties for the secondary region (*westus* in the below example):

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.RecoveryServices/locations/westus/backupAadProperties?api-version=2018-12-20
```

##### Response example

The response is returned in the following format:

```json
{
  "properties": {
    "tenantId": "00000000-0000-0000-0000-000000000000",
    "audience": "https://RecoveryServices/IaasCoord/aadmgmt/wus",
    "servicePrincipalObjectId": "00000000-0000-0000-0000-000000000000"
  }
}
```

#### Step 2:

Use the [Get Access Token API](/rest/api/backup/recovery-points-get-access-token-for-crr/get-access-token) to authorize your request to access replicated restore points in the secondary region:

```http
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupFabrics/{fabricName}/protectionContainers/{containerName}/protectedItems/{protectedItemName}/recoveryPoints/{recoveryPointId}/accessToken?api-version=2018-12-20
```

For the request body, paste the contents of the response returned by the AAD Properties API in the previous step.

```json
{
  "properties": {
    "tenantId": "00000000-0000-0000-0000-000000000000",
    "audience": "https://RecoveryServices/IaasCoord/aadmgmt/wus",
    "servicePrincipalObjectId": "00000000-0000-0000-0000-000000000000"
  }
}
```

##### Response example

The response is returned in the following format:

```json
{
	"id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testVaultRG/providers/Microsoft.RecoveryServices/vaults/testVault/backupFabrics/Azure/protectionContainers/IaasVMContainer;iaasvmcontainerv2;testRG1;testVM/protectedItems/VM;iaasvmcontainerv2;testRG1;testVM/recoveryPoints/26083826328862",
  "name": "932879774590051503",
  "type": "Microsoft.RecoveryServices/vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints",
	"properties": {
		"objectType": "CrrAccessToken",
		"accessTokenString": "<access-token-string>",
		"subscriptionId": "00000000-0000-0000-0000-000000000000",
		"resourceGroupName": "testVaultRG",
		"resourceName": "testVault",
		"resourceId": "000000000000000000",
		"protectionContainerId": 000000,
		"recoveryPointId": "932879774590051503",
		"recoveryPointTime": "7/26/2021 3:35:36 PM",
		"containerName": "iaasvmcontainerv2;testRG1;testVM",
		"containerType": "IaasVMContainer",
		"backupManagementType": "AzureIaasVM",
		"datasourceType": "VM",
		"datasourceName": "testvm1234",
		"datasourceId": "000000000000000000",
		"datasourceContainerName": "iaasvmcontainerv2;testRG1;testVM",
		"coordinatorServiceStampUri": "https://pod01-coord1.eus.backup.windowsazure.com",
		"protectionServiceStampId": "00000000-0000-0000-0000-000000000000",
		"protectionServiceStampUri": "https://pod01-prot1h-int.eus.backup.windowsazure.com",
		"tokenExtendedInformation": "<IaaSVMRecoveryPointMetadataBase xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\" i:type=\"IaaSVMRecoveryPointMetadata_V2015_09\" xmlns=\"http://windowscloudbackup.com/CloudCommon/V2011_09\"><MetadataVersion>V2015_09</MetadataVersion><ContainerType i:nil=\"true\" /><InstantRpGCId>ef4ab5a7-c2c0-4304-af80-af49f48af3d1;AzureBackup_testvm1234_932843259176972511;AzureBackup_20210726_033536;AzureBackupRG_eastus_1</InstantRpGCId><IsBlockBlobEnabled>true</IsBlockBlobEnabled><IsManagedVirtualMachine>true</IsManagedVirtualMachine><OriginalSAOption>false</OriginalSAOption><OsType>Windows</OsType><ReadMetadaFromConfigBlob i:nil=\"true\" /><RecoveryPointConsistencyType>CrashConsistent</RecoveryPointConsistencyType><RpDiskDetails i:nil=\"true\" /><SourceIaaSVMRPKeyAndSecret i:nil=\"true\" /><SourceIaaSVMStorageType>PremiumVMOnPartialPremiumStorage</SourceIaaSVMStorageType><VMSizeDescription>Standard_D2s_v3</VMSizeDescription><Zones xmlns:d2p1=\"http://schemas.microsoft.com/2003/10/Serialization/Arrays\" i:nil=\"true\" /></IaaSVMRecoveryPointMetadataBase>",
		"rpTierInformation": {
			"InstantRP": "Valid",
			"HardenedRP": "Valid"
		},
		"rpOriginalSAOption": false,
		"rpIsManagedVirtualMachine": true,
		"rpVMSizeDescription": "Standard_D2s_v3",
		"bMSActiveRegion": "EastUS"
	}
}
```

### Restore disks to the secondary region

Use the [Cross-Region Restore Trigger API](/rest/api/backup/cross-region-restore/trigger) to restore an item to the secondary region.

```http
POST https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.RecoveryServices/locations/{azureRegion}/backupCrossRegionRestore?api-version=2018-12-20
```

The request body should have two parts:

1. ***crossRegionRestoreAccessDetails***: Paste the *properties* block of the response from the Get Access Token API request performed in the previous step to fill this segment of the request body.

1. ***restoreRequest***: To fill the *restoreRequest* segment of the request body, you'll need to pass the recovery point ID obtained earlier, along with the Azure Resource Manager (ARM) ID of the source VM, as well as the details of the storage account in the secondary region to be used as a staging location. To perform disk restore, specify *RestoreDisks* as the recovery type.

The following is a sample request body to restore the disks of a VM to the secondary region:

```json
 {
  "crossRegionRestoreAccessDetails": {
        "objectType": "CrrAccessToken",
	    "accessTokenString": "<access-token-string>",
	    "subscriptionId": "00000000-0000-0000-0000-000000000000",
	    "resourceGroupName": "azurefiles",
	    "resourceName": "azurefilesvault",
	    "resourceId": "000000000000000000",
	    "protectionContainerId": 000000,
	    "recoveryPointId": "932879774590051503",
	    "recoveryPointTime": "7/26/2021 3:35:36 PM",
	    "containerName": "iaasvmcontainerv2;testRG1;testVM",
	    "containerType": "IaasVMContainer",
	    "backupManagementType": "AzureIaasVM",
		"datasourceType": "VM",
		"datasourceName": "testvm1234",
		"datasourceId": "000000000000000000",
		"datasourceContainerName": "iaasvmcontainerv2;testRG1;testVM",
		"coordinatorServiceStampUri": "https://pod01-coord1.eus.backup.windowsazure.com",
		"protectionServiceStampId": "00000000-0000-0000-0000-000000000000",
		"protectionServiceStampUri": "https://pod01-prot1h-int.eus.backup.windowsazure.com",
		"tokenExtendedInformation": "<IaaSVMRecoveryPointMetadataBase xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\" i:type=\"IaaSVMRecoveryPointMetadata_V2015_09\" xmlns=\"http://windowscloudbackup.com/CloudCommon/V2011_09\"><MetadataVersion>V2015_09</MetadataVersion><ContainerType i:nil=\"true\" /><InstantRpGCId>ef4ab5a7-c2c0-4304-af80-af49f48af3d1;AzureBackup_testvm1234_932843259176972511;AzureBackup_20210726_033536;AzureBackupRG_eastus_1</InstantRpGCId><IsBlockBlobEnabled>true</IsBlockBlobEnabled><IsManagedVirtualMachine>true</IsManagedVirtualMachine><OriginalSAOption>false</OriginalSAOption><OsType>Windows</OsType><ReadMetadaFromConfigBlob i:nil=\"true\" /><RecoveryPointConsistencyType>CrashConsistent</RecoveryPointConsistencyType><RpDiskDetails i:nil=\"true\" /><SourceIaaSVMRPKeyAndSecret i:nil=\"true\" /><SourceIaaSVMStorageType>PremiumVMOnPartialPremiumStorage</SourceIaaSVMStorageType><VMSizeDescription>Standard_D2s_v3</VMSizeDescription><Zones xmlns:d2p1=\"http://schemas.microsoft.com/2003/10/Serialization/Arrays\" i:nil=\"true\" /></IaaSVMRecoveryPointMetadataBase>",
		"rpTierInformation": {
			"InstantRP": "Valid",
			"HardenedRP": "Valid"
		},
		"rpOriginalSAOption": false,
		"rpIsManagedVirtualMachine": true,
		"rpVMSizeDescription": "Standard_D2s_v3",
		"bMSActiveRegion": "EastUS"
    },
    "restoreRequest": {
        "affinityGroup": "",
        "createNewCloudService": false,
        "encryptionDetails": {
            "encryptionEnabled": false
        },
        "objectType": "IaasVMRestoreRequest",
        "recoveryPointId": "932879774590051503",
        "recoveryType": "RestoreDisks",
        "sourceResourceId":"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testRG1/providers/Microsoft.Compute/virtualMachines/testVM",
        "targetResourceGroupId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testRG1",
        "storageAccountId":"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testRG1/providers/Microsoft.Storage/storageAccounts/testStorageAccount",
        "region": "westus",
        "affinityGroup": "",
        "createNewCloudService": false,
        "originalStorageAccountOption": false,
        "restoreDiskLunList": []
    }
}
```

Similar to the primary region restore operation, this is an asynchronous operation and needs to be [tracked separately](#restore-response).



## Next steps

For more information on the Azure Backup REST APIs, see the following documents:

- [Azure Recovery Services provider REST API](/rest/api/recoveryservices/)
- [Get started with Azure REST API](/rest/api/azure/)