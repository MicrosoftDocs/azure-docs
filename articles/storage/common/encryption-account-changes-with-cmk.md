---
title: "Avoid data loss with customer-managed keys on Azure Storage"
description: "Learn how to safely delete, migrate, or switch encryption on storage accounts that use customer-managed keys to avoid permanent data loss." 
#customer intent: As an Azure storage administrator using customer-managed keys, I want to understand the risks of deleting my account, so that I can avoid permanent data loss.
author: ellie-vail
ms.author: ellievail
ms.reviewer: ellievail
ms.date: 06/19/2026
ms.topic: concept-article
ms.service: azure-blob-storage
---

# Avoid data loss when changing storage accounts that use customer-managed keys

When a storage account uses customer-managed keys, certain account operations such as deleting the account, migrating it to a new Microsoft Entra ID tenant, or switching to a different encryption key type can make data permanently inaccessible if you don't perform them in the right order. The core risk in each scenario is that the managed identity linking your storage account to the key vault can't be automatically recovered or moved, which breaks the ability to decrypt data.

This article explains what happens during each of these operations and what steps you can take to avoid permanent data loss.

## Delete and recover a storage account

If you delete your account and then [recover it](/azure/storage/common/storage-account-recover), you can't recover any [managed identity](/entra/identity/managed-identities-azure-resources/overview) that was associated with the account prior to deletion.

You can recover the storage account as well as the key vault, but not the managed identity. You need to set up a new managed identity and associate that identity with the account and the key vault. If you don't, your data can't be decrypted for use, and calls to the storage data plane fail. To learn how to set up a managed identity, see [Configure managed identities for existing storage accounts](/azure/storage/common/customer-managed-keys-configure-existing-account?tabs=azure-portal).

## Migrate a storage account to another Microsoft Entra ID tenant

If you move a storage account to another Microsoft Entra ID tenant, the managed identity that is associated with the storage account and the key vault can't move along with it. Once the account is migrated, you need to create a new managed identity. Otherwise, the data in that account can't be decrypted, and any calls to that data fail. To learn how to set up managed identity, see [Managed identities](/azure/ai-services/language-service/native-document-support/managed-identities).

## Switch to another type of encryption key

If you want to switch to using Microsoft-managed keys or customer-provided keys, ensure that you make that switch before you delete the managed identity or key vault required by your customer-managed key. You need those resources to decrypt your data, including account settings. You'll need to modify those settings to make the switch.

Microsoft-managed keys and customer-provided keys don't require Azure Key Vault or managed identities, so after your account is switched to using either of those key types, and you no longer require customer-managed key access, you can safely remove the key vault and any unneeded managed identities associated with that key vault.

If you delete your key vault before you attempt to make the switch, you can recover the key vault, and then change the encryption key method used by your account as long as you do so within key vault's soft delete retention period. To learn more, see [Key Vault soft delete](/azure/key-vault/general/soft-delete-overview). However, if your deleted key vault surpasses the soft delete retention period, this condition results in **permanent data loss**, as the data remains encrypted with no key to access it.

## Troubleshooting error codes

If you recently changed your account and you run into errors when trying to access your data, you might be experiencing one of the scenarios listed earlier in this article. Review each section to determine if any of these scenarios are relevant to your account changes. If you're unsure what the error code is in reference to, the following table provides the most likely examples of what issue you're running into and the recommended fix.

| **Error code** | **HTTP status** | **Potential causes** | **Recommended fix** |
|---|---|---|---|
| **ManagedServiceIdentityNotFound** | 400 | You didn't specify encryption identity in request | Try request again with encryption identity included |
| **ManagedServiceIdentityNotFound** | 400 | Account has federated client ID configured but no valid managed identity assigned | [Set up managed identity with your account or verify that it's set up correctly](/azure/storage/common/customer-managed-keys-configure-existing-account?tabs=azure-portal) |
| **ManagedServiceIdentityNotFound** | 400 | The identity resource doesn't exist or was deleted from the tenant | [Set up managed identity with your account or verify that it's set up correctly](/azure/storage/common/customer-managed-keys-configure-existing-account?tabs=azure-portal) |
| **ManagedServiceIdentityNotFound** | 400 | Encryption scope requires managed identity but none is configured on the account | [Set up managed identity with your account or verify that it's set up correctly](/azure/storage/common/customer-managed-keys-configure-existing-account?tabs=azure-portal) |
| **ManagedServiceIdentityNotFoundOnTenant** | 400 | The managed identity exists but belongs to a different Azure tenant than the storage account | [Set up managed identity with your account or verify that it's set up correctly](/azure/storage/common/customer-managed-keys-configure-existing-account?tabs=azure-portal) |
| **CannotFetchManagedIdentityCredentials** | 400 | System-assigned identity credentials are missing or invalid | Verify that the identity credentials are included and are correct |
| **CannotFetchManagedIdentityCredentials** | 400| User-assigned identity credentials are missing or invalid | Verify that the identity credentials are included and are correct |
| **MissingUserAssignedIdentity** | 400 | You specified user-assigned identity type but didn't provide any user-assigned identities to use | Try request again with user-assigned identity included |

## See also

[Customer-managed keys overview](/azure/storage/common/customer-managed-keys-overview?toc=/azure/storage/blobs/toc.json&bc=/azure/storage/blobs/breadcrumb/toc.json)
