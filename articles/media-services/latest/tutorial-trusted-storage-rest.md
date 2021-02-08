---
title: Azure Media Services Trusted Storage
description: In this tutorial, you'll learn to enable trusted storage using a Managed Identity associated with your Media Services account. The Managed Identity allows Media Services to access a storage account that has been configured with a firewall or a VNet restriction through trusted storage access.
author: IngridAtMicrosoft
ms.author: inhenkel
ms.service: media-services
ms.topic: tutorial
ms.date: 2/8/2021
---

# Tutorial: Media Services trusted storage

With the 2020-05-01 API, you can enable trusted storage by associating a Managed Identity with a Media Services account.

Media Services can automatically access your storage account using system authentication. Media Services validates that the Media Services account and the storage account are in the same subscription. It also validates that the user who is adding the association has access the storage account with Azure Resource Manager RBAC.

However, if you want to use a firewall to secure your storage account and enable trusted storage, [Managed Identities](concept-managed-identities.md) authentication is the preferred option. It allows Media Services to access the storage account that has been configured with a firewall or a VNet restriction through trusted storage access.

In this tutorial, you'll learn to:

> [!div class="checklist"]
> - 
> - 
> - 
> - 
> - 
> - 

## Prerequisites

You need an Azure subscription to get started.  If you don't have an Azure subscription, [create a free trial account](https://azure.microsoft.com/free/).

### Get your tenant ID and subscription ID

If you don't know how to get your tenant ID and subscription ID, see [How to find your tenant ID](how-to-set-azure-tenant.md) and [Find your tenant ID](how-to-set-azure-tenant.md)

### Create a service principal and secret

If you don't know how to create a service principal and secret, see [Get credentials to access Media Services API](access-api-howto.md).

### Set up Key Vault

To create a Key Vault, see [How to create a Key Vault in the Azure portal](https://docs.microsoft.com/azure/key-vault/general/quick-create-portal).

You will use the following variables later:

*@keyVaultName* = name of the key vault you created<br/>
*@keyName* = name of the key you created<br/>

## Get and set variables

### AAD details

```rest
@tenantId = your tenant ID
@servicePrincipalId = your service principal ID
@servicePrincipalSecret = your service principal secret
```

### AAD resources

Depending on the REST client, you are using, you may need to change the paths below to standard path syntax for URLs.

```rest
@armResource = https%3A%2F%2Fmanagement.core.windows.net%2F
@graphResource = https%3A%2F%2Fgraph.windows.net%2F
@keyVaultResource = https%3A%2F%2Fvault.azure.net
@storageResource = https%3A%2F%2Fstorage.azure.com%2F
```

### Service endpoints

```rest
@armEndpoint = management.azure.com
@graphEndpoint = graph.windows.net
@aadEndpoint = login.microsoftonline.com
@keyVaultDomainSuffix = vault.azure.net
```

### Azure Resource Manager (ARM) details

```rest
@subscription = your subscription ID
@resourceGroup = name of the resource group you'll be creating
@storageName = storage account name you'll be creating
@accountName = AMS account name you want to use
@keyVaultName = name of the key vault you created
@keyName = name of the key you created
@resourceLocation = location in which to create the resource group
@index = I don't know what this is. (was set at 4)
```

### Get a token for Azure Resource Manager (ARM) using the service principal name and secret

```rest
// @name getArmToken
POST https://{{aadEndpoint}}/{{tenantId}}/oauth2/token
Accept: application/json
Content-Type: application/x-www-form-urlencoded

resource={{armResource}}&client_id={{servicePrincipalId}}&client_secret={{servicePrincipalSecret}}&grant_type=client_credentials
```

### Get a token for the Graph API using the Service Principal name and secret

```rest
// @name getGraphToken
POST https://{{aadEndpoint}}/{{tenantId}}/oauth2/token
Accept: application/json
Content-Type: application/x-www-form-urlencoded

resource={{graphResource}}&client_id={{servicePrincipalId}}&client_secret={{servicePrincipalSecret}}&grant_type=client_credentials
```

### Get some details about the Service Principal

```rest
// @name getServicePrincipals
GET https://{{graphEndpoint}}/{{tenantId}}/servicePrincipals?$filter=appId%20eq%20'{{servicePrincipalId}}'&api-version=1.6
x-ms-client-request-id: cae3e4f7-17a0-476a-a05a-0dab934ba959
Authorization:  Bearer {{getGraphToken.response.body.access_token}}
```

### Store the Service Principal ID

```rest
@servicePrincipalObjectId = {{getServicePrincipals.response.body.value[0].objectId}}
```

### Create a resource group

```rest
// @name createResourceGroup
PUT https://{{armEndpoint}}/subscriptions/{{subscription}}/resourceGroups/{{resourceGroup}}
    ?api-version=2016-09-01
Authorization: Bearer {{getArmToken.response.body.access_token}}
Content-Type: application/json; charset=utf-8

{
    "location": "{{resourceLocation}}"
}
```

### Create storage account1

```rest
// @name createStorageAccount
PUT https://{{armEndpoint}}/subscriptions/{{subscription}}/resourceGroups/{{resourceGroup}}/providers/Microsoft.Storage/storageAccounts/{{storageName}}
    ?api-version=2019-06-01
Authorization: Bearer {{getArmToken.response.body.access_token}}
Content-Type: application/json; charset=utf-8

{
    "sku": {
    "name": "Standard_GRS"
    },
    "kind": "StorageV2",
    "location": "{{resourceLocation}}",
    "properties": {
    }
}
```

### Get the storage account status

```rest
// @name getStorageAccountStatus
GET {{createStorageAccount.response.headers.Location}}
Authorization: Bearer {{getArmToken.response.body.access_token}}
```

### Create storage account2

```rest
// @name getStorageAccount
GET https://{{armEndpoint}}/subscriptions/{{subscription}}/resourceGroups/{{resourceGroup}}/providers/Microsoft.Storage/storageAccounts/{{storageName}}
    ?api-version=2019-06-01
Authorization: Bearer {{getArmToken.response.body.access_token}}
```

### Get a token for ARM using the Service Principal name and secret

```rest
// @name getStorageToken
POST https://{{aadEndpoint}}/{{tenantId}}/oauth2/token
Accept: application/json
Content-Type: application/x-www-form-urlencoded

resource={{storageResource}}&client_id={{servicePrincipalId}}&client_secret={{servicePrincipalSecret}}&grant_type=client_credentials
```

### Enable storage blob logging

```rest

// @name setBlobLogging
PUT https://{{storageName}}.blob.core.windows.net/?restype=service&comp=properties
Authorization: Bearer {{getStorageToken.response.body.access_token}}
x-ms-version: 2017-11-09

<StorageServiceProperties>
  <Logging>
    <Version>2.0</Version>
    <Read>true</Read>
    <Write>true</Write>
    <Delete>true</Delete>
    <RetentionPolicy>
      <Enabled>true</Enabled>
      <Days>1</Days>
    </RetentionPolicy>
  </Logging>
</StorageServiceProperties>
```

### Create a Media Services account with a System Assigned Managed Identity

```rest
// @name createMediaServicesAccount
PUT https://{{armEndpoint}}/subscriptions/{{subscription}}/resourceGroups/{{resourceGroup}}/providers/Microsoft.Media/mediaservices/{{accountName}}?api-version=2020-05-01
Authorization: Bearer {{getArmToken.response.body.access_token}}
Content-Type: application/json; charset=utf-8

{
  "identity": {
      "type": "SystemAssigned"
  },
  "properties": {
    "storageAccounts": [
      {
        "id": "{{getStorageAccountStatus.response.body.id}}"
      }
    ],
    "encryption": {
      "type": "SystemKey"
    }
  },
  "location": "{{resourceLocation}}"
}
```

### Get the storage role definitions

```rest
// @name getStorageBlobDataContributorRoleDefinition
GET https://management.azure.com/subscriptions/{{subscription}}/resourceGroups/{{resourceGroup}}/providers/Microsoft.Storage/storageAccounts/{{storageName}}/providers/Microsoft.Authorization/roleDefinitions?$filter=roleName%20eq%20%27Storage%20Blob%20Data%20Contributor%27&api-version=2015-07-01
Authorization: Bearer {{getArmToken.response.body.access_token}}
```

### Set the storage role assignment

```rest
PUT https://management.azure.com/subscriptions/{{subscription}}/resourceGroups/{{resourceGroup}}/providers/Microsoft.Storage/storageAccounts/{{storageName}}/providers/Microsoft.Authorization/roleAssignments/{{$guid}}?api-version=2020-04-01-preview
Authorization: Bearer {{getArmToken.response.body.access_token}}
Content-Type: application/json; charset=utf-8

{
  "properties": {
    "roleDefinitionId": "/subscriptions/{{subscription}}/resourceGroups/{{resourceGroup}}/providers/Microsoft.Storage/storageAccounts/{{storageName}}/providers/Microsoft.Authorization/roleDefinitions/{{getStorageBlobDataContributorRoleDefinition.response.body.value[0].name}}",
    "principalId": "{{createMediaServicesAccount.response.body.identity.principalId}}"
  }
}
```

### Create storage account

```rest
// @name setStorageAccountFirewall
PUT https://{{armEndpoint}}/subscriptions/{{subscription}}/resourceGroups/{{resourceGroup}}/providers/Microsoft.Storage/storageAccounts/{{storageName}}
    ?api-version=2019-06-01
Authorization: Bearer {{getArmToken.response.body.access_token}}
Content-Type: application/json; charset=utf-8

{
    "sku": {
    "name": "Standard_GRS"
    },
    "kind": "StorageV2",
    "location": "{{resourceLocation}}",
    "properties": {
      "minimumTlsVersion": "TLS1_2",
      "networkAcls": {
        "bypass": "AzureServices",
        "virtualNetworkRules": [],
        "ipRules": [],
        "defaultAction": "Deny"
      }
    }
}
```

### Update the Media Services account to use Managed Identity storage authorization

> [!NOTE]
> This request may need to be retried a few times as the storage role assignment can take a few minutes to propagate

```rest
// @name updateMediaServicesAccountWithManagedStorageAuth
PUT https://{{armEndpoint}}/subscriptions/{{subscription}}/resourceGroups/{{resourceGroup}}/providers/Microsoft.Media/mediaservices/{{accountName}}?api-version=2020-05-01
Authorization: Bearer {{getArmToken.response.body.access_token}}
Content-Type: application/json; charset=utf-8

{
  "identity": {
      "type": "SystemAssigned"
  },
  "properties": {
    "storageAccounts": [
      {
        "id": "{{getStorageAccountStatus.response.body.id}}"
      }
    ],
    "storageAuthentication": "ManagedIdentity",
    "encryption": {
      "type": "SystemKey"
    }
  },
  "location": "{{resourceLocation}}"
}
```

### Create an Asset

```rest
// @name createAsset
PUT https://{{armEndpoint}}/subscriptions/{{subscription}}/resourceGroups/{{resourceGroup}}/providers/Microsoft.Media/mediaservices/{{accountName}}/assets/testasset{{index}}withoutmi?api-version=2018-07-01
Authorization: Bearer {{getArmToken.response.body.access_token}}
Content-Type: application/json; charset=utf-8

{
}
```

### Stop here (for normal flow)

### Create storage account

```rest
// @name allowStorageAccountFirewall
PUT https://{{armEndpoint}}/subscriptions/{{subscription}}/resourceGroups/{{resourceGroup}}/providers/Microsoft.Storage/storageAccounts/{{storageName}}
    ?api-version=2019-06-01
Authorization: Bearer {{getArmToken.response.body.access_token}}
Content-Type: application/json; charset=utf-8

{
    "sku": {
    "name": "Standard_GRS"
    },
    "kind": "StorageV2",
    "location": "{{resourceLocation}}",
    "properties": {
      "networkAcls": {
        "bypass": "AzureServices",
        "defaultAction": "Allow"
      }
    }
}
```

### List storage logs

```rest
// @name getBlobLogs
GET https://{{storageName}}.blob.core.windows.net/$logs/blob/2020/12/09/2100/000000.log
Authorization: Bearer {{getStorageToken.response.body.access_token}}
x-ms-version: 2017-11-09
```

## Clean up resources

Delete the resources you created.  Otherwise, you will be charged for them.

### Clean up the Storage account

```rest
DELETE https://{{armEndpoint}}/subscriptions/{{subscription}}/resourceGroups/{{resourceGroup}}/providers/Microsoft.Storage/storageAccounts/{{storageName}}
    ?api-version=2019-06-01
Authorization: Bearer {{getArmToken.response.body.access_token}}
```

### Clean up the Media Services account

```rest
DELETE https://{{armEndpoint}}/subscriptions/{{subscription}}/resourceGroups/{{resourceGroup}}/providers/Microsoft.Media/mediaservices/{{accountName}}?api-version=2020-05-01
Authorization: Bearer {{getArmToken.response.body.access_token}}
```

### Clean up the Media Services account

```rest
GET https://{{armEndpoint}}/subscriptions/{{subscription}}/resourceGroups/{{resourceGroup}}/providers/Microsoft.Media/mediaservices/{{accountName}}?api-version=2020-05-01
Authorization: Bearer {{getArmToken.response.body.access_token}}
```

## Next steps

<!-- next steps go here -->