---
title: Configure key auto-rotation in Azure Key Vault
description: Use this guide to learn how to configure automated the rotation of a key in Azure Key Vault
services: key-vault
author: msmbaldwin
manager: rkarlin
tags: 'rotation'
ms.service: key-vault
ms.subservice: keys
ms.topic: how-to
ms.date: 11/24/2021
ms.author: mbaldwin
---
# Configure key auto-rotation in Azure Key Vault (preview)

Automated key rotation in Key Vault allows users to configure Key Vault to automatically generate a new key version at a specified frequency. You can use rotation policy to configure rotation for each individual
key. Our recommendation is to rotate encryption keys at least every two years to meet cryptographic best practices.

This feature enables end-to-end zero-touch rotation for encryption at rest for Azure services with customer-managed key (CMK) stored in Azure Key Vault. Please refer to specific Azure service documentation to see if the service covers end-to-end rotation.

## Pricing

Additional cost will occur when a key is automatically rotated. For more information, see [Azure Key Vault pricing page](https://azure.microsoft.com/pricing/details/key-vault/)

## Assign an Azure role for key rotation management

Key Vault key rotation feature requires key management permissions. You can assign a "Key Vault Crypto Officer" role to manage rotation policy and on-demand rotation.

For more information on how to use RBAC permission model and assign Azure roles, see:
[Use an Azure RBAC to control access to keys, certificates and secrets](../general/rbac-guide.md)

> [!NOTE]
> If you use an access policies permission model, it is required to set 'Rotate', 'Set Rotation Policy', and 'Get Rotation Policy' key permissions to manage rotation policy on keys. 

## Key Rotation Policy

The key rotation policy allows users to configure rotation interval, expiration interval for rotated keys, and near expiry notification period for monitoring expiration using event grid notifications.

Key rotation policy settings:

-   Expiry time: key expiration interval. It is used to set expiration date on newly rotated key. It does not affect a current key.
-   Enable auto rotation: flag to enable/disable rotation for the key
-   Rotation Types:
    -   Automatically renew at a given time after creation (default)
    -   Automatically renew at a given time before expiry. It requires 'Expiry Time' set on rotation policy and 'Expiration Date' set on the key.
-   Rotation Time -- key rotation interval, he minimum value is 7 days from creation and 7 days from expiration time
-   Notification time -- near expiry event interval for event grid notification. It requires 'Expiry Time' set on rotation policy and 'Expiration Date' set on the key. For more information about event grid notifications in Key Vault, see
[Azure Key Vault as Event Grid source](https://docs.microsoft.com/azure/event-grid/event-schema-key-vault?tabs=event-grid-event-schema)

:::image type="content" source="../media/keys/key-rotation/key-rotation-1.png" alt-text="Rotation policy configuration":::

## Configure automated key rotation policy during key creation 

Automated key rotation policy can be configured during key creation.

:::image type="content" source="../media/keys/key-rotation/key-rotation-2.png" alt-text="Configure rotation during key creation":::

## Configure automated key rotation policy for existing keys

Key rotation policy can be set or updated on existing keys.

:::image type="content" source="../media/keys/key-rotation/key-rotation-2.png" alt-text="Configure rotation on existing key":::

## Rotation on demand

Rotation of the key can also be invoked manually.

### Portal
Click 'Rotate Now' to invoke rotation

:::image type="content" source="../media/keys/key-rotation/key-rotation-2.png" alt-text="Rotation on-demand":::

### Azure CLI
```azurecli
az keyvault key rotate --vault-name <vault-name> --name <key-name>
```

## Configure automated key rotation with ARM template

Key rotation policy can also be configured using ARM templates.

> [!NOTE]
> It requires 'Key Vault Contributor' role on Key Vault configured with Azure RBAC to deploy key through management plane.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "vaultName": {
            "type": "String",
            "metadata": {
                "description": "The name of the key vault to be created."
            }
        },
        "keyName": {
            "type": "String",
            "metadata": {
                "description": "The name of the key to be created."
            }
        },
        "rotateTimeAfterCreation": {
            "defaultValue": "P18M",
            "type": "String",
            "metadata": {
                "description": "Time duration to trigger key rotation. i.e. P30D, P1M, P2Y"
            }
        },
        "expiryTime": {
            "defaultValue": "P2Y",
            "type": "String",
            "metadata": {
                "description": "The expiry time for new key version. i.e. P90D, P2M, P3Y"
            }
        },
        "notifyTime": {
            "defaultValue": "P30D",
            "type": "String",
            "metadata": {
                "description": "Near expiry event grid notification. i.e. P30D"
            }
        }

    },
    "resources": [
        {
            "type": "Microsoft.KeyVault/vaults/keys",
            "apiVersion": "2020-04-01-preview",
            "name": "[concat(parameters('vaultName'), '/', parameters('keyName'))]",
            "location": "[resourceGroup().location]",
            "properties": {
                "vaultName": "[parameters('vaultName')]",
                "kty": "RSA",
                "rotationPolicy": {
                    "lifetimeActions": [
                        {
                            "trigger": {
                                "timeAfterCreate": "[parameters('rotateTimeAfterCreation')]",
                                "timeBeforeExpiry": ""
                            },
                            "action": {
                                "type": "Rotate"
                            }
                        },
                        {
                            "trigger": {
                                "timeBeforeExpiry": "[parameters('notifyTime')]",
                            },
                            "action": {
                                "type": "Notify"
                            }
                        }

                    ],
                    "attributes": {
                        "expiryTime": "[parameters('expiryTime')]"
                    }
                }
            }
        }
    ]
}

```

## Resources

- [Monitoring Key Vault with Azure Event Grid](../general/event-grid-overview.md)
- [Use an Azure RBAC to control access to keys, certificates and secrets](../general/rbac-guide.md)
- [Azure Data Encryption At Rest](https://docs.microsoft.com/azure/security/fundamentals/encryption-atrest)
- [Azure Storage Encryption](https://docs.microsoft.com/azure/storage/common/storage-service-encryption)
- [Azure Disk Encryption](https://docs.microsoft.com/azure/virtual-machines/disk-encryption)