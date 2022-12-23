---
title: Configure key auto-rotation in Azure Key Vault Managed HSM
description: Use this guide to learn how to configure automated the rotation of a key in Azure Key Vault Managed HSM
services: key-vault
author: msmbaldwin
tags: 'rotation'
ms.service: key-vault
ms.subservice: managed-hsm
ms.topic: tutorial
ms.date: 11/04/2022
ms.author: mbaldwin
---
# Configure key auto-rotation in Azure Managed HSM

## Overview

> [!NOTE]
> Key auto-rotation requires the [Azure CLI version 2.42.0 or above](/cli/azure/install-azure-cli).
> 
Automated key rotation in Managed HSM allows users to configure Managed HSM to automatically generate a new key version at a specified frequency. You can set a rotation policy to configure rotation for each individual key and optionally rotate keys on demand. Our recommendation is to rotate encryption keys at least every two years to meet cryptographic best practices. For additional guidance and recommendations, see [NIST SP 800-57 Part 1](https://csrc.nist.gov/publications/detail/sp/800-57-part-1/rev-5/final).

This feature enables end-to-end zero-touch rotation for encryption at rest for Azure services with customer-managed keys (CMK) stored in Azure Managed HSM. Please refer to specific Azure service documentation to see if the service covers end-to-end rotation.

## Pricing

Managed HSM key rotation is offered at no extra cost. For more information on Managed HSM pricing, see [Azure Key Vault pricing page](https://azure.microsoft.com/pricing/details/key-vault/)

> [!WARNING]
> Managed HSM has a limit of 100 versions per key. Key versions created as part of automatic or manual rotation count toward this limit.

## Permissions required

Rotating a key or setting a key rotation policy requires specific key management permissions. You can assign the "Managed HSM Crypto User" role to get sufficient permissions to manage rotation policy and on-demand rotation.

For more information on how to configure Local RBAC permissions on Managed HSM, see:
[Managed HSM role management](role-management.md)

> [!NOTE]
> Setting a rotation policy requires the "Key Write" permission. Rotating a key on-demand requires "Rotation" permissions. Both are included with the "Managed HSM Crypto User" built-in role

## Key rotation policy

The key rotation policy allows users to configure rotation intervals and set the expiration interval for rotated keys. It must be set before keys can be rotated on-demand. 

> [!NOTE]
> Managed HSM does not support Event Grid Notifications

Key rotation policy settings:

-   Expiry time: key expiration interval (minimum 28 days). It is used to set expiration date on a newly rotated key (e.g. after rotation, the new key is set to expire in 30 days).
-   Rotation types:
    -   Automatically renew at a given time after creation
    -   Automatically renew at a given time before expiry. 'Expiration Date' must be set on the key for this event to fire.

> [!WARNING]
> An *automatic* rotation policy cannot mandate that new key versions be created more frequently than once every 28 days. For creation-based rotation policies, this means the minimum value for `timeAfterCreate`  is `P28D`. For expiration-based rotation policies, the maximum value for `timeBeforeExpiry` depends on the `expiryTime`. For example, if `expiryTime` is `P56D`, `timeBeforeExpiry` can be at most `P28D`.


## Configure a key rotation policy

### Azure CLI

Write a key rotation policy and save it to a file. Use ISO8601 Duration formats to specify time intervals. Some example policies are provided in the next section. Use the following command to apply the policy to a key. 

```azurecli
az keyvault key rotation-policy update --hsm-name <hsm-name> --name <key-name> --value </path/to/policy.json>
```
#### Example policies

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
{
  "lifetimeActions": [],
  "attributes": {}
}
```

## Rotation on demand

Once a rotation policy is set for the key, you can also rotate the key on-demand. You must set a key rotation policy first.

### Azure CLI
```azurecli
az keyvault key rotate --hsm-name <hsm-name> --name <key-name>
```

## Resources

- [Managed HSM role management](role-management.md)
- [Azure Data Encryption At Rest](../../security/fundamentals/encryption-atrest.md)
- [Azure Storage Encryption](../../storage/common/storage-service-encryption.md)
