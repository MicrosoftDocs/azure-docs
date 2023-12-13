---
title: Rotate and revoke a customer-managed key 
description: Learn how to rotate, update, and revoke a customer-managed key on Azure Container Registry.
ms.topic: tutorial
ms.date: 08/5/2022
ms.custom: subject-rbac-steps, devx-track-azurecli
ms.author: tejaswikolli
---

# Rotate and revoke a customer-managed key 

This article is part three in a four-part tutorial series. [Part one](tutorial-customer-managed-keys.md) provides an overview of customer-managed keys, their features, and considerations before you enable one on your registry. In [part two](tutorial-enable-customer-managed-keys.md), you learn how to enable a customer-managed key by using the Azure CLI, the Azure portal, or an Azure Resource Manager template. This article walks you through rotating, updating, and revoking a customer-managed key. 

## Rotate a customer-managed key

To rotate a key, you can either update the key version in Azure Key Vault or create a new key. While rotating the key, you can specify the same identity that you used to create the registry.

Optionally, you can:

- Configure a new user-assigned identity to access the key.
- Enable and specify the registry's system-assigned identity.

> [!NOTE]
> To enable the registry's system-assigned identity in the portal, select **Settings** > **Identity** and set the system-assigned identity's status to **On**.
> 
> Ensure that the required [key vault access](tutorial-enable-customer-managed-keys.md#enable-managed-identities-to-access-the-key-vault) is set for the identity that you configure for key access.

### Create or update the key version by using the Azure CLI

To create a new key version, run the [az keyvault key create](/cli/azure/keyvault/key#az-keyvault-key-create) command:

```azurecli
# Create new version of existing key
az keyvault key create \
  --name <key-name> \
  --vault-name <key-vault-name>
```

If you configure the registry to detect key version updates, the customer-managed key is automatically updated within one hour.

If you configure the registry for manual updating for a new key version, run the [az-acr-encryption-rotate-key](/cli/azure/acr/#az-acr-encryption-rotate-key) command. Pass the new key ID and the identity that you want to configure.

> [!TIP]
> When you run `az-acr-encryption-rotate-key`, you can pass either a versioned key ID or an unversioned key ID. If you use an unversioned key ID, the registry is then configured to automatically detect later key version updates.

To update a customer-managed key version manually, you have two options:

- Rotate the key and use a user-assigned identity.

  If you're using the key from a different key vault, verify that `principal-id-user-assigned-identity` has the `get`, `wrap`, and `unwrap` permissions on that key vault.

  ```azurecli
  az acr encryption rotate-key \
    --name <registry-name> \
    --key-encryption-key <new-key-id> \
    --identity <principal-id-user-assigned-identity>
  ```

- Rotate the key and use a system-assigned identity.

  Before you use the system-assigned identity, verify that the `get`, `wrap`, and `unwrap` permissions are assigned to it.

  ```azurecli
  az acr encryption rotate-key \
    --name <registry-name> \
    --key-encryption-key <new-key-id> \
    --identity [system]
  ```

### Create or update the key version by using the Azure portal

Use the registry's **Encryption** settings to update the key vault, key, or identity settings for a customer-managed key.

For example, to configure a new key:

1. In the portal, go to your registry.
1. Under **Settings**, select **Encryption** > **Change key**.

   :::image type="content" source="media/container-registry-customer-managed-keys/rotate-key.png" alt-text="Screenshot of encryption key options in the Azure portal.":::
1. In **Encryption**, choose one of the following options:
   * Choose **Select from Key Vault**, and then either select an existing key vault and key or select **Create new**. The key that you select is unversioned and enables automatic key rotation.
   * Select **Enter key URI**, and provide a key identifier directly. You can provide either a versioned key URI (for a key that must be rotated manually) or an unversioned key URI (which enables automatic key rotation).
1. Complete the key selection, and then select **Save**.

## Revoke a customer-managed key

You can revoke a customer-managed encryption key by changing the access policy, by changing the permissions on the key vault, or by deleting the key.

To change the access policy of the managed identity that your registry uses, run the [az-keyvault-delete-policy](/cli/azure/keyvault#az-keyvault-delete-policy) command:

```azurecli
az keyvault delete-policy \
  --resource-group <resource-group-name> \
  --name <key-vault-name> \
  --object-id <key-vault-key-id>
```

To delete the individual versions of a key, run the [az-keyvault-key-delete](/cli/azure/keyvault/key#az-keyvault-key-delete) command. This operation requires the *keys/delete* permission.

```azurecli
az keyvault key delete  \
  --name <key-vault-name> \
  -- 
  --object-id $identityPrincipalID \                     
```

> [!NOTE]
> Revoking a customer-managed key will block access to all registry data. If you enable access to the key or restore a deleted key, the registry will pick the key, and you can regain control of access to the encrypted registry data. 

## Next steps

Advance to the [next article](tutorial-troubleshoot-customer-managed-keys.md) to troubleshoot common problems like errors when you're removing a managed identity, 403 errors, and accidental key deletions.

