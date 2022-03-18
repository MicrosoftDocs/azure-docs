---
title: Configure key auto-rotation in Azure Key Vault Managed HSM
description: Use this guide to learn how to configure automated the rotation of a key in Azure Key Vault Managed HSM
services: key-vault
author: dhruviyer
tags: 'rotation'
ms.service: key-vault
ms.subservice: managed-hsm
ms.topic: tutorial
ms.date: 3/18/2021
ms.author: dhruviyer
---
# Configure key auto-rotation in Azure Managed HSM (preview)

## Overview

Automated key rotation in Managed HSM allows users to configure Managed HSM to automatically generate a new key version at a specified frequency. You can set a rotation policy to configure rotation for each individual
key and/or rotate keys on demand. Our recommendation is to rotate encryption keys at least every two years to meet cryptographic best practices.

This feature enables end-to-end zero-touch rotation for encryption at rest for Azure services with customer-managed keys (CMK) stored in Azure Managed HSM. Please refer to specific Azure service documentation to see if the service covers end-to-end rotation.

## Pricing

Managed HSM key rotation is offered at no extra cost. For more information on Managed HSM pricing, see [Azure Key Vault pricing page](https://azure.microsoft.com/pricing/details/key-vault/)

## Permissions required

Rotating a key or setting a key rotation policy requires specific key management permissions. You can assign the "Managed HSM Crypto User" role to get sufficient permissions to manage rotation policy and on-demand rotation.

For more information on how to configure Local RBAC permissions on Managed HSM, see:
[Managed HSM role management](role-management.md)

> [!NOTE]
> Setting a rotation policy requires the "Key Write" permission. Rotating a key on-demand requires "Rotation" permissions. Both are included with the "Managed HSM Crypto User" built-in role

## Key rotation policy

The key rotation policy allows users to configure rotation intervals and set the expiration interval for rotated keys. 

> [!NOTE]
> Managed HSM does not support Event Grid Notifications

> [!WARNING]
> Managed HSM has a limit of 100 versions per key. Key versions created as part of automatic or manual rotation count toward this limit.

Key rotation policy settings:

-   Expiry time: key expiration interval. It is used to set expiration date on a newly rotated key. It does not affect a current key.
-   Rotation types:
    -   Automatically renew at a given time after creation (default)
    -   Automatically renew at a given time before expiry. It requires 'Expiry Time' set on rotation policy and 'Expiration Date' set on the key.
-   Rotation time: key rotation interval, the minimum value is 28 days from creation or 28 days from expiration time

## Configure a key rotation policy

### Azure CLI

Write a key rotation policy and save it to a file. Use ISO8601 Duration formats to specify time intervals. Some example policies are provided in the next section. Use the following command to apply the policy to a key. 

```azurecli
az keyvault key rotation-policy update --hsm-name <hsm-name> --name <key-name> --value </path/to/policy.json>
```
#### Example Policies

Rotate the key 18 months after creation and set the new key to expire after two years.

```json
{
  "lifetimeActions": [
    {
      "trigger": {
        "timeAfterCreate": "P18M",
        "timeBeforeExpiry": null
      },
      "action": {
        "type": "Rotate"
      }
    }
  ],
  "attributes": {
    "expiryTime": "P2Y"
  }
}
```

Rotate the key 28 days before expiration and set the new key to expire after one year.

```json
{
  "lifetimeActions": [
    {
      "trigger": {
        "timeAfterCreate": null,
        "timeBeforeExpiry": "P28D"
      },
      "action": {
        "type": "Rotate"
      }
    }
  ],
  "attributes": {
    "expiryTime": "P1Y"
  }
}
```

Remove the key rotation policy (done by setting a blank policy)

```json
{}
```

## Rotation on demand

### Azure CLI
```azurecli
az keyvault key rotate --hsm-name <hsm-name> --name <key-name>
```

## Resources

- [Managed HSM role management](role-management.md)
- [Azure Data Encryption At Rest](../../security/fundamentals/encryption-atrest.md)
- [Azure Storage Encryption](../../storage/common/storage-service-encryption.md)
