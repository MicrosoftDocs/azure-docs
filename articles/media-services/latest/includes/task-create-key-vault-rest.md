---
author: IngridAtMicrosoft
ms.service: media-services 
ms.topic: include
ms.date: 10/14/2020
ms.author: inhenkel
ms.custom: REST
---

<!--Create a key vault-->

Use the following request to create a Key Vault.  Replace the `armEndpoint`, `subscription`, `resourceGroup`,`keyVaultName`, `resourceLocation`, `tenantId`, and `servicePrincipalObjectId` values. 

```rest

PUT https://{{armEndpoint}}/subscriptions/{{subscription}}/resourceGroups/{{resourceGroup}}/providers/Microsoft.KeyVault/vaults/{{keyVaultName}}
    ?api-version=2018-02-14
Authorization: Bearer {{getArmToken.response.body.access_token}}
Content-Type: application/json; charset=utf-8
Host: {{armEndpoint}}

{
  "location": "{{resourceLocation}}",
  "properties": {
    "tenantId": "{{tenantId}}",
    "sku": {
      "name": "standard",
      "family": "A"
    },
    "accessPolicies": [
      {
        "tenantId": "{{tenantId}}",
        "objectId": "{{servicePrincipalObjectId}}",
        "permissions": {
          "keys": [ "get", "list", "update", "create", "delete", "recover" ]
        }
      },
      {
        "tenantId": "{{tenantId}}",
        "objectId": "{{createMediaServicesAccount.response.body.identity.principalId}}",
        "permissions": {
          "keys": [ "decrypt", "encrypt", "unwrapKey", "wrapKey", "get", "list" ]
        }
      }
    ],
    "enableSoftDelete": true,
    "enablePurgeProtection": true,
    "networkAcls": {
      "bypass": "AzureServices",
      "defaultAction": "Allow"
    }
  }
}

```
