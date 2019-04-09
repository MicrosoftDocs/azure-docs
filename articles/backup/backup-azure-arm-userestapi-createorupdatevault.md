---
title: 'Azure Backup: Create Recovery Services vaults using REST API'
description: manage backup and restore operations of Azure VM Backup using REST API
services: backup
author: pvrk
manager: shivamg
keywords: REST API; Azure VM backup; Azure VM restore;
ms.service: backup
ms.topic: conceptual
ms.date: 08/21/2018
ms.author: pullabhk
ms.assetid: e54750b4-4518-4262-8f23-ca2f0c7c0439
---
# Create Azure Recovery Services Vault using REST API

The steps to create an Azure Recovery Services Vault using REST API are outlined in [create vault REST API](https://docs.microsoft.com/rest/api/recoveryservices/vaults/createorupdate) documentation. Let us use this document as a reference to create a vault called "testVault" in "West US".

To create or update an Azure Recovery Services vault, use the following *PUT* operation.

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}?api-version=2016-06-01
```

## Create a request

To create the *PUT* request, the `{subscription-id}` parameter is required. If you have multiple subscriptions, see [Working with multiple subscriptions](/cli/azure/manage-azure-subscriptions-azure-cli?view=azure-cli-latest). You define a `{resourceGroupName}` and `{vaultName}` for your resources, along with the `api-version` parameter. This article uses `api-version=2016-06-01`.

The following headers are required:

| Request header   | Description |
|------------------|-----------------|
| *Content-Type:*  | Required. Set to `application/json`. |
| *Authorization:* | Required. Set to a valid `Bearer` [access token](https://docs.microsoft.com/rest/api/azure/#authorization-code-grant-interactive-clients). |

For more information about how to create the request, see [Components of a REST API request/response](/rest/api/azure/#components-of-a-rest-api-requestresponse).

## Create the request body

The following common definitions are used to build a request body:

|Name  |Required  |Type  |Description  |
|---------|---------|---------|---------|
|eTag     |         |   String      |  Optional eTag       |
|location     |  true       |String         |   Resource location      |
|properties     |         | [VaultProperties](https://docs.microsoft.com/rest/api/recoveryservices/vaults/createorupdate#vaultproperties)        |  Properties of the vault       |
|sku     |         |  [Sku](https://docs.microsoft.com/rest/api/recoveryservices/vaults/createorupdate#sku)       |    Identifies the unique system identifier for each Azure resource     |
|tags     |         | Object        |     Resource tags    |

Note that vault name and resource group name are provided in the PUT URI. The request body defines the location.

## Example request body

The following example body is used to create a vault in "West US". Specify the location. The SKU is always "Standard".

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
|200 OK     |   [Vault](https://docs.microsoft.com/rest/api/recoveryservices/vaults/createorupdate#vault)      | OK        |
|201 Created     | [Vault](https://docs.microsoft.com/rest/api/recoveryservices/vaults/createorupdate#vault)        |   Created      |

For more information about REST API responses, see [Process the response message](/rest/api/azure/#process-the-response-message).

### Example response

A condensed *201 Created* response from the previous example request body shows an *id* has been assigned and the *provisioningState* is *Succeeded*:

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
