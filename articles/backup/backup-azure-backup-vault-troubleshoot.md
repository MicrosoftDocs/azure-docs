---
title: Troubleshoot Azure Backup Vault
description: Symptoms, causes, and resolutions of the Azure Backup Vault related operations.
ms.topic: troubleshooting
ms.date: 07/18/2024
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Troubleshoot Azure Backup Vault related operations

This article provides troubleshooting steps that help you resolve Azure Backup Vault management errors.

## Common user errors

#### Error code: UserErrorSystemIdentityNotEnabledWithVault

**Possible Cause:** Backup Vault is created with System Identity enabled by default. This error appears when System Identity of the Backup Vault is in a disabled state and a backup related operation fails with this error. 

**Resolution:** To resolve this error, enable the System Identity of the Backup Vault and reassign all the necessary roles to it. Else use a User Identity in its place with all the roles assigned and update  Managed Identity for all the Backup Instances using the now disabled System Identity. 

#### Error code: UserErrorUserIdentityNotFoundOrNotAssociatedWithVault

**Possible Cause:** Backup Instances can be created with a User Identity having all the required roles assigned to it. In addition, User Identity can also be used for operations like Encryption using a Customer Managed Key. This error appears when the particular User Identity is deleted or not attached with the Backup Vault.  

**Resolution:** To resolve this error, assign the same or alternate User Identity to the Backup Vault and update the Backup Instance to use the new identity in latter case. Otherwise, enable the System Identity of the Backup Vault, update the Backup Instance and assign all the necessary roles to it. 

## Next steps

- [About Azure Backup Vault](create-manage-backup-vault.md)
