---
title: Rotate and revoke a customer-managed key 
description: Learn how to rotate, update, revoke a customer-managed key.
ms.topic: tutorial
ms.date: 08/5/2022
ms.custom: subject-rbac-steps, devx-track-azurecli
ms.author: tejaswikolli
---


# Rotate and Revoke a customer-managed key 

This article is part three in a four-part tutorial series. In [part one](tutorial-customer-managed-keys.md), you have an overview of the customer-managed key, their key features, and the considerations before you enable a customer-managed key on your registry. In [part two](tutorial-enable-customer-managed-keys.md), you've learned to enable a customer-managed key using the Azure CLI, Azure portal, or a Resource Manager template. In this article walks you to rotate a customer-managed key, update key version and revoke the key.

## Rotate a customer-managed key

>* To rotate a key, you can either update the key version in Azure Key Vault or create a new key.
>* While rotating the key, you can specify the same identity you have used to create the registry.
>* Optionally, you can also configure a new user-assigned identity to access the key, or enable and specify the registry's system-assigned identity.

> [!NOTE]
> * To enable the registry's system-assigned identity in the portal, select **Settings** > **Identity** and set the system-assigned identity's status to **On**.
> * Ensure that the required [key vault access](tutorial-enable-customer-managed-keys.md#enable-key-vault-access-by-managed-identity) is set for the identity you configure for key access.

###  Create or update key version - CLI

1. To create a new key version, run the [az keyvault key create][az-keyvault-key-create](/cli/azure/keyvault/key#az-keyvault-key-create) command:

```azurecli
# Create new version of existing key
az keyvault key create \
  –-name <key-name> \
  --vault-name <key-vault-name>
```

2. If you configure the registry to detect key version updates, the customer-managed key automatically updates within 1 hour.

3. If you configure the registry for manual updating for a new key version, run the [az-acr-encryption-rotate-key](/cli/azure/acr/#az-acr-encryption-rotate-key) command, passing the new key ID and the identity you want to configure.

> [!TIP]
> When you run `az-acr-encryption-rotate-key`, you can pass either a versioned key ID or a non-versioned key ID. If you use a non-versioned key ID, the registry is then configured to automatically detect later key version updates.

Update a customer-managed key version manually:

 1. Rotate key and use user-assigned identity

If you're using the key from a different key vault, verify the `principal-id-user-assigned-identity` has the `get`, `wrap`, and `unwrap` permissions on that key vault.

```azurecli
az acr encryption rotate-key \
  --name <registry-name> \
  --key-encryption-key <new-key-id> \
  --identity <principal-id-user-assigned-identity>
```

 2. Rotate key and use system-assigned identity

Before you use the system-assigned identity, verify for the `get`, `wrap`, and `unwrap` permissions assigned to it.

```azurecli
az acr encryption rotate-key \
  --name <registry-name> \
  --key-encryption-key <new-key-id> \
  --identity [system]
```

### Create or update key version - Portal

Use the registry's **Encryption** settings to update the key vault, key, or identity settings used for a customer-managed key.

For example, to configure a new key:

1. In the portal, navigate to your registry.
1. Under **Settings**, select  **Encryption** > **Change key**.

    :::image type="content" source="media/container-registry-customer-managed-keys/rotate-key.png" alt-text="Rotate key in the Azure portal":::
1. In **Encryption**, choose one of the following:
    * Select **Select from Key Vault**, and select an existing key vault and key, or **Create new**. The key you select is non-versioned and enables automatic key rotation.
    * Select **Enter key URI**, and provide a key identifier directly. You can provide either a versioned key URI (for a key that must be rotated manually) or a non-versioned key URI (which enables automatic key rotation).
1. Complete the key selection and select **Save**.

## Revoke a customer-managed key

>* You can revoke a customer-managed encryption key by changing the access policy, or changing the permissions on the key vault, or by deleting the key.

1. Run the [az-keyvault-delete-policy](/cli/azure/keyvault#az-keyvault-delete-policy) command to change the access policy of the managed identity used by your registry:

```azurecli
az keyvault delete-policy \
  --resource-group <resource-group-name> \
  --name <key-vault-name> \
  --key_id <key-vault-key-id>
```

2. Run the [az-keyvault-key-delete](/cli/azure/keyvault/key#az-keyvault-key-delete) command to delete the individual versions of a key. This operation requires the keys/delete permission.

```azurecli
az keyvault key delete  \
  --name <key-vault-name> \
  -- 
  --object-id $identityPrincipalID \                     
```

>* Revoking a customer-managed key will block access to all registry data. 
>* If you enable access to the key or restore a deleted key, the registry will pick the key, and you can gain back control on access to the encrypted registry data. 

## Next steps

In this tutorial, you've learned to perform key rotations, update key versions using CLI and Portal, and revoking a customer-managed key on your Azure Container Registry.

Advance to the next tutorial to [troubleshoot](tutorial-troubleshoot-customer-managed-keys.md) most common issues like removing a managed identity, 403 errors, and restoring accidental key deletes.

