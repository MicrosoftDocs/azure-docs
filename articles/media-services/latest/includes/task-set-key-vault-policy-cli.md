---
author: IngridAtMicrosoft
ms.service: media-services 
ms.topic: include
ms.date: 05/14/2021
ms.author: inhenkel
ms.custom: CLI
---

<!-- ### Set the the Key Vault policy -->

To use this command, you must include the Media Services `principalId` as the `object-id`. if you haven't already, use `az ams account show --name <your-media-services-account-name> --resource-group <your-resource-group>` to get this ID.

```azurecli-interactive
az keyvault set-policy --name <your-keyvault-name> --object-id <principalId> --key-permissions decrypt encrypt get list unwrapKey wrapKey
```

Example JSON response:

```json
{
  "id": "/subscriptions/00000000-0000-0000-000000000000/resourceGroups/your-resource-group-name/providers/Microsoft.KeyVault/vaults/your-keyvault-name",
  "location": "your-region",
  "name": "your-keyvault-name",
  "properties": {
    "accessPolicies": [
      {
        "applicationId": null,
        "objectId": "00000000-0000-0000-000000000000",
        "permissions": {
          "certificates": [
            "get",
            "list",
            "delete",
            "create",
            "import",
            "update",
            "managecontacts",
            "getissuers",
            "listissuers",
            "setissuers",
            "deleteissuers",
            "manageissuers",
            "recover"
          ],
          "keys": [
            "get",
            "create",
            "delete",
            "list",
            "update",
            "import",
            "backup",
            "restore",
            "recover"
          ],
          "secrets": [
            "get",
            "list",
            "set",
            "delete",
            "backup",
            "restore",
            "recover"
          ],
          "storage": [
            "get",
            "list",
            "delete",
            "set",
            "update",
            "regeneratekey",
            "setsas",
            "listsas",
            "getsas",
            "deletesas"
          ]
        },
        "tenantId": "00000000-0000-0000-000000000000"
      },
      {
        "applicationId": null,
        "objectId": "00000000-0000-0000-000000000000",
        "permissions": {
          "certificates": null,
          "keys": [
            "encrypt",
            "get",
            "list",
            "wrapKey",
            "decrypt",
            "unwrapKey"
          ],
          "secrets": null,
          "storage": null
        },
        "tenantId": "00000000-0000-0000-000000000000"
      }
    ],
    "createMode": null,
    "enablePurgeProtection": true,
    "enableRbacAuthorization": null,
    "enableSoftDelete": true,
    "enabledForDeployment": false,
    "enabledForDiskEncryption": null,
    "enabledForTemplateDeployment": null,
    "networkAcls": null,
    "privateEndpointConnections": null,
    "provisioningState": "Succeeded",
    "sku": {
      "name": "standard"
    },
    "softDeleteRetentionInDays": 90,
    "tenantId": "00000000-0000-0000-000000000000",
    "vaultUri": "https://your-keyvault-name.vault.azure.net/"
  },
  "resourceGroup": "your-resource-group-name",
  "tags": {},
  "type": "Microsoft.KeyVault/vaults"
}
```
