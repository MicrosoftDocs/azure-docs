---
title: Troubleshoot a customer-managed key 
description: Learn how to troubleshoot the most common problems for a registry that's enabled with a customer-managed key.
author: tejaswikolli-web
ms.topic: tutorial
ms.date: 08/5/2022
ms.author: tejaswikolli
---

# Troubleshoot a customer-managed key 

This article is part four in a four-part tutorial series. [Part one](tutorial-customer-managed-keys.md) provides an overview of customer-managed keys, their features, and considerations before you enable one on your registry. In [part two](tutorial-enable-customer-managed-keys.md), you learn how to enable a customer-managed key by using the Azure CLI, the Azure portal, or an Azure Resource Manager template. In [part three](tutorial-rotate-revoke-customer-managed-keys.md), you learn how to rotate, update, and revoke a customer-managed key. This article helps you troubleshoot and resolve common problems with customer-managed keys.

## Error when you're removing a managed identity

If you try to remove a user-assigned or system-assigned managed identity that you used to configure encryption for your registry, you might see an error:
 
```
Azure resource '/subscriptions/xxxx/resourcegroups/myGroup/providers/Microsoft.ContainerRegistry/registries/myRegistry' does not have access to identity 'xxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx' Try forcibly adding the identity to the registry <registry name>. For more information on bring your own key, please visit 'https://aka.ms/acr/cmk'.
```
 
You're unable to change (rotate) the encryption key. The resolution steps depend on the type of identity that you used for encryption.

### Removing a user-assigned identity

If you get the error when you try to remove a user-assigned identity, follow these steps: 
 
1. Reassign the user-assigned identity by using the [az acr identity assign](/cli/azure/acr/identity/#az-acr-identity-assign) command. 
2. Pass the user-assigned identity's resource ID, or use the identity's name when it's in the same resource group as the registry. 

   For example:

   ```azurecli
   az acr identity assign -n myRegistry \
       --identities "/subscriptions/mysubscription/resourcegroups/myresourcegroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myidentity"
   ```
        
3. Change the key and assign a different identity.
4. Now, you can remove the original user-assigned identity.

### Removing a system-assigned identity

If you get the error when you try to remove a system-assigned identity, [create an Azure support ticket](https://azure.microsoft.com/support/create-ticket/) for assistance in restoring the identity.

## Error after you enable a key vault firewall

If you enable a key vault firewall or virtual network after creating an encrypted registry, you might see HTTP 403 or other errors with image import or automated key rotation. To correct this problem, reconfigure the managed identity and key that you initially used for encryption. See the steps in [Rotate a customer-managed key](tutorial-rotate-revoke-customer-managed-keys.md#rotate-a-customer-managed-key).

If the problem persists, contact Azure Support.

## Identity expiry error

The identity attached to a registry is set for autorenewal to avoid expiry. If you disassociate an identity from a registry, an error message occurs explaining to you can't remove the identity in use for CMK. Attempting to remove the identity jeopardizes the autorenewal of identity. The artifact pull/push operations work until the identity expires (Usually three months). After the identity expiration, you'll see the HTTP 403 with an error message "The identity associated with the registry is inactive. This could be due to attempted removal of the identity. Reassign the identity manually". 

You have to reassign the identity back to registry explicitly.

1. Run the [az acr identity assign](/cli/azure/acr/identity/#az-acr-identity-assign) command to reassign the identity manually.

    - For example,
   
    ```azurecli-interactive
    az acr identity assign -n myRegistry \
    --identities "/subscriptions/mysubscription/resourcegroups/myresourcegroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myidentity"
    ``` 

## Accidental deletion of a key vault or key

Deletion of the key vault, or the key, that's used to encrypt a registry with a customer-managed key makes the registry's content inaccessible. If [soft delete](../key-vault/general/soft-delete-overview.md) is enabled in the key vault (the default option), you can recover a deleted vault or key vault object and resume registry operations.

## Next steps

For key vault deletion and recovery scenarios, see [Azure Key Vault recovery management with soft delete and purge protection](../key-vault/general/key-vault-recovery.md).
