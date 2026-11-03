---
title: Troubleshoot Azure Backup Vault
description: Symptoms, causes, and resolutions of the Azure Backup Vault related operations.
ms.topic: troubleshooting
ms.date: 10/20/2026
ms.update-cycle: 1825-days
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: "As a backup administrator, I want to troubleshoot Azure Backup Vault management errors, so that I can resolve issues related to System and User Identities efficiently."
---

# Troubleshoot Azure Backup Vault related operations

This article provides troubleshooting steps that help you resolve Azure Backup Vault management errors.

## Backup configuration request errors

When you create or update a backup instance, the request can fail because the calling identity lacks access to a source resource or a source resource ID is invalid.

### 403 LinkedAuthorizationFailed

**Cause**: The identity submitting the backup configuration request doesn't have the required read permission on a source resource referenced by the request.

**Recommended action**:

1. Identify the caller used by your portal session, script, or deployment. Check this identity's permissions, not the Backup vault's managed identity.
1. Check read permission on each resource referenced by `properties.dataSourceInfo.resourceID` and `properties.dataSourceSetInfo.resourceID`, when populated. The **Reader** role on the resource grants read permission. An existing role inherited from a resource group or subscription can also provide it.
   - For cross-subscription backup, check access in the source resource's subscription.
   - For a disk in an AKS node resource group, access to the AKS cluster alone doesn't grant read permission on the disk.
1. Correct the permissions, and then retry the request.

### 400 LinkedInvalidPropertyId

**Cause**: A linked resource ID in the backup configuration request isn't a valid, full Azure Resource Manager (ARM) ID.

**Recommended action**: Check both `properties.dataSourceInfo.resourceID` and `properties.dataSourceSetInfo.resourceID`, when populated. Each must contain the full ARM ID of the referenced source resource, not just a resource name. For a storage account, use this format:

```text
/subscriptions/<source-subscription-id>/resourceGroups/<source-resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account-name>
```

Correct all invalid IDs in the request or the ARM template, Bicep, or Terraform configuration that generates it, and then retry.

## Common user errors

### UserErrorSystemIdentityNotEnabledWithVault

**Error code**: `UserErrorSystemIdentityNotEnabledWithVault`

**Cause**: Backup Vault is created with System Identity enabled by default. This error appears when System Identity of the Backup Vault is in a disabled state and a backup related operation fails with this error. 

**Recommended action**: To resolve this error, enable the System Identity of the Backup Vault and reassign all the necessary roles to it. Else use a User Identity in its place with all the roles assigned and update  Managed Identity for all the Backup Instances using the now disabled System Identity. 

### UserErrorUserIdentityNotFoundOrNotAssociatedWithVault

**Error code**: `UserErrorUserIdentityNotFoundOrNotAssociatedWithVault`

**Cause**: Backup Instances can be created with a User Identity having all the required roles assigned to it. In addition, User Identity can also be used for operations like Encryption using a Customer Managed Key. This error appears when the particular User Identity is deleted or not attached with the Backup Vault.  

**Recommended action**: To resolve this error, assign the same or alternate User Identity to the Backup Vault and update the Backup Instance to use the new identity in latter case. Otherwise, enable the System Identity of the Backup Vault, update the Backup Instance and assign all the necessary roles to it. 

### UserErrorStorageAccountKeyAccessDisallowed

**Error code**: `UserErrorStorageAccountKeyAccessDisallowed`

**Error message**: The storage account doesn't support key based authentication.

**Cause**: Storage account doesn't permit key based authentication.

**Recommended action**: Ensure that storage account key access is enabled, and then retry the operation. [Learn more](azure-kubernetes-service-backup-troubleshoot.md).

## Related content

- [About Azure Backup Vault](create-manage-backup-vault.md).
- [Create and delete Backup vaults](create-manage-backup-vault.md).
- [Manage Backup vaults](manage-backup-vault.md).

