---
title: Create Recovery Services vaults using REST API for Azure Backup
description: In this article, learn how to manage backup and restore operations of Azure VM Backup using REST API.
ms.service: azure-backup
ms.topic: how-to
ms.date: 01/17/2025
ms.assetid: e54750b4-4518-4262-8f23-ca2f0c7c0439
author: jyothisuri
ms.author: jsuri
ms.custom: engagement-fy24
---
# Create Azure Recovery Services vault using REST API for Azure Backup

This article describes how to create Azure Recovery Services vault using REST API. To create the vault using the Azure portal, see [this article](backup-create-recovery-services-vault.md#create-a-recovery-services-vault).

A Recovery Services vault is a storage entity in Azure that houses data. The data is typically copies of data, or configuration information for virtual machines (VMs), workloads, servers, or workstations. You can use Recovery Services vaults to hold backup data for various Azure services such as IaaS VMs (Linux or Windows) and SQL Server in Azure VMs. Recovery Services vaults support System Center DPM, Windows Server, Azure Backup Server, and more. Recovery Services vaults make it easy to organize your backup data, while minimizing management overhead.

## Before you start

Before you start creating the Recovery Services vault, review the following details:

- The vault creation process  uses `api-version=2016-06-01`.
- The creation of an Azure Recovery Services vault using REST API is outlined in [create vault REST API](/rest/api/recoveryservices/vaults/createorupdate) article. Let's use this article as a reference to create a vault named `testVault` in `West US`.

To create or update an Azure Recovery Services vault, use the following *PUT* operation:

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}?api-version=2016-06-01
```

## Create a request

To create the *PUT* request, the `{subscription-id}` parameter is required. If you have multiple subscriptions, see [Working with multiple subscriptions](/cli/azure/manage-azure-subscriptions-azure-cli). You define a `{resourceGroupName}` and `{vaultName}` for your resources, along with the `api-version` parameter. This article uses `api-version=2016-06-01`.

The following headers are required:

| Request header   | Description |
|------------------|-----------------|
| *Content-Type:*  | Required. Set to `application/json`. |
| *Authorization:* | Required. Set to a valid `Bearer` [access token](/rest/api/azure/#authorization-code-grant-interactive-clients). |

For more information about how to create the request, see [Components of a REST API request/response](/rest/api/azure/#components-of-a-rest-api-requestresponse).

## Create the request body

The following common definitions are used to build a request body:

|Name  |Required  |Type  |Description  |
|---------|---------|---------|---------|
|eTag     |         |   String      |  Optional eTag       |
|location     |  true       |String         |   Resource location      |
|properties     |         | [VaultProperties](/rest/api/recoveryservices/vaults/createorupdate#vaultproperties)        |  Properties of the vault       |
|sku     |         |  [Sku](/rest/api/recoveryservices/vaults/createorupdate#sku)       |    Identifies the unique system identifier for each Azure resource     |
|tags     |         | Object        |     Resource tags    |

Note that vault name and resource group name are provided in the PUT URI. The request body defines the location.

## Example request body

The following example body is used to create a vault in `West US`. Specify the location. The SKU is always `Standard`.

```json
{
  "properties": {},
  "sku": {
    "name": "Standard"
  },
  "location": "West US"
}
```

## Responses

There are two successful responses for the operation to create or update a Recovery Services vault:

|Name  |Type  |Description  |
|---------|---------|---------|
|200 OK     |   [Vault](/rest/api/recoveryservices/vaults/createorupdate#vault)      | OK        |
|201 Created     | [Vault](/rest/api/recoveryservices/vaults/createorupdate#vault)        |   Created      |

For more information about REST API responses, see [Process the response message](/rest/api/azure/#process-the-response-message).

### Example response

A condensed *201 Created* response from the previous example request body shows an *ID* has been assigned and the *provisioningState* is *Succeeded*:

```json
{
  "location": "westus",
  "name": "testVault",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "id": "/subscriptions/77777777-b0c6-47a2-b37c-d8e65a629c18/resourceGroups/Default-RecoveryServices-ResourceGroup/providers/Microsoft.RecoveryServices/vaults/testVault",
  "type": "Microsoft.RecoveryServices/vaults",
  "sku": {
    "name": "Standard"
  }
}
```

## Next steps

[Create a backup policy for backing up an Azure VM in this vault](backup-azure-arm-userestapi-createorupdatepolicy.md).

For more information on the Azure REST APIs, see the following documents:

- [Azure Recovery Services provider REST API](/rest/api/recoveryservices/)
- [Get started with Azure REST API](/rest/api/azure/)
