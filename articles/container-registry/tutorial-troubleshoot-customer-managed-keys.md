---
title: Troubleshoot a customer-managed key 
description: Tutorial to troubleshoot the most common issues from a registry enabled with a customer-managed key.
author: tejaswikolli-web
ms.topic: tutorial
ms.date: 08/5/2022
ms.author: tejaswikolli
---

# Troubleshoot a customer-managed key 

This article is part four in a four-part tutorial series. In [part one](tutorial-customer-managed-keys.md), you have an overview of the customer-managed keys, their key features, and the considerations before you enable a customer-managed key on your registry. In [part two](tutorial-enable-customer-managed-keys.md), you've learned to enable customer-managed keys using the Azure CLI, Azure portal, or a Resource Manager template. In [part three](tutorial-rotate-revoke-customer-managed-keys.md), you'll learn to rotate, update, revoke a customer-managed key. In this article, learn to troubleshoot any issues with customer-managed keys.

## Troubleshoot a customer-managed key

This article helps you to troubleshoot and resolve most common issues such as authentication issues, accidental deletions of keys, etc.
## Removing managed identity

If you try to remove a user-assigned or a system-assigned managed identity that you've used to configure encryption for your registry, you may see an error:
 
```
Azure resource '/subscriptions/xxxx/resourcegroups/myGroup/providers/Microsoft.ContainerRegistry/registries/myRegistry' does not have access to identity 'xxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx' Try forcibly adding the identity to the registry <registry name>. For more information on bring your own key, please visit 'https://aka.ms/acr/cmk'.
```
 
You'll also not be able to change (rotate) the encryption key. The resolution steps depend on the type of identity you've used for encryption.

### Removing a **user-assigned identity**:

If this issue occurs while removing a user-assigned identity, follow the steps: 
 
1. Reassign the user-assigned identity using the [az acr identity assign](/cli/azure/acr/identity/#az-acr-identity-assign) command. 
2. Pass the user-assigned identity's resource ID, or use the identity's name when it is in the same resource group as the registry. 

For example:

```azurecli
az acr identity assign -n myRegistry \
    --identities "/subscriptions/mysubscription/resourcegroups/myresourcegroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myidentity"
```
        
3. Change the key and assign a different identity.
4. Now, you can remove the original user-assigned identity.

### Removing a **System-assigned identity**

If issue occurs while you try to remove a system-assigned identity, please [create an Azure support ticket](https://azure.microsoft.com/support/create-ticket/) for assistance to restore the identity.

## Enabling the key vault firewall

If you enable a key vault firewall or virtual network after creating an encrypted registry, you might see HTTP 403 or other errors with image import or automated key rotation. To correct this problem, reconfigure the managed identity and key you used initially for encryption. See steps in [Rotate a customer-managed key.](tutorial-rotate-revoke-customer-managed-keys.md#rotate-a-customer-managed-key)

If the problem persists, please contact Azure Support.

## Accidental deletion of key vault or key

Deletion of the key vault, or the key, used to encrypt a registry with a customer-managed key will make the registry's content inaccessible. If [soft delete](../key-vault/general/soft-delete-overview.md) is enabled in the key vault (the default option), you can recover a deleted vault, or key vault object and resume registry operations.

## Next steps

For key vault deletion and recovery scenarios, see [Azure Key Vault recovery management with soft delete and purge protection](../key-vault/general/key-vault-recovery.md).