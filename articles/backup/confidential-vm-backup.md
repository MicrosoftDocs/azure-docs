---
title: Azure Backup - Configure backup of Confidential VM using Azure Backup (preview) 
description: Learn about backing up Confidential VM with PMK or CMK using Azure Backup.
ms.topic: how-to
ms.date: 07/22/2026
ms.custom: references_regions
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-mallicka
---

# Back up Confidential VM using Azure Backup (preview)

[!INCLUDE [Confidential VM backup preview advisory.](../../includes/confidential-vm-backup-preview.md)]

Azure Backup supports [Confidential Virtual Machines (CVMs)](/azure/confidential-computing/confidential-vm-overview) that provide secure backup and restore for sensitive workloads. This capability uses Azure Disk Encryption Sets (DES) with platform-managed keys (PMKs) or customer-managed keys (CMKs) to maintain data confidentiality throughout the backup lifecycle. Confidential VMs provide strong security by creating a hardware-enforced boundary between your application and the virtualization stack.

This article describes how to configure and back up an OS-disk encrypted Confidential VM (CVM) with platform-managed key (PMK) or customer-managed key (CMK). It focuses on backup prerequisites, permission requirements, and configuration flow.

## Supported scenarios for Confidential VM backup

[!INCLUDE [Confidential VM backup support scenarios..](../../includes/confidential-vm-backup-support-matrix.md)]

The support matrix is the source of truth for supported regions, VM series, and restore capabilities.

## Prerequisites

Before you configure backup for a Confidential VM, ensure that the following prerequisites are met:

- Register for the preview feature in your Azure subscription - Name: `RestorePointSupportForConfidentialVMV2` Provider: `Microsoft.Compute`. To register, see [Preview features](../azure-resource-manager/management/preview-features.md). You can also run the following PowerShell cmdlet. The registration is autoapproved.

   ```azurepowershell-interactive
   Register-AzProviderFeature -FeatureName "RestorePointSupportForConfidentialVMV2" -ProviderNamespace "Microsoft.Compute" 

   ```

- Identify or create a Confidential VM (CVM) in a supported region. See the [supported regions](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=virtual-machines).
- Identify or [create a Recovery Services vault](backup-create-recovery-services-vault.md#create-a-recovery-services-vault) in the same region as the VM.
- Ensure that you can configure backup policies and assign key access permissions in your environment.

## Create a new Confidential VM with PMK or CMK

To back up a Confidential VM by using Azure Backup, you must have a Confidential VM configured with PMK or CMK encryption. Azure Backup uses the Disk Encryption Set (DES) associated with your VM to maintain encryption throughout the backup and restore process.

If needed, learn how to [create a new Confidential VM with PMK or CMK](/azure/confidential-computing/quick-create-confidential-vm-portal-amd).

## Backup configuration overview

For Confidential VM backup, the backup payload and policy model are the same as Azure VM backup. The additional requirement is access to encryption assets (Key Vault or Managed HSM) used by the VM.

High-level flow:

1. Validate support and prerequisites.
1. Ensure encryption asset permissions are in place for backup.
1. Configure or select a backup policy.
1. Enable backup for the Confidential VM.
1. Trigger and monitor the initial backup job.

## Assign permissions for Confidential VM backup

Azure Backup needs access to the Key Vault or Managed Hardware Security Module (HSM) that stores your keys. This access ensures the service can back up keys and recover them if they're deleted. When you configure backup in the Azure portal, Azure Backup automatically gets the required permissions. If you use other clients, such as PowerShell, CLI, or REST API, you must assign these permissions manually.

If you're using a Key Vault to store keys, [grant permission to the Azure Backup service for the backup operations](backup-azure-vms-encryption.md#provide-permissions).

To assign permissions for MHSM, follow these steps:

1. In the Azure portal, go to **Managed HSM**, and then select **Local RBAC** in **Settings**.

1. Select **Add** to add a *new Role Assignment*.

1. Select one of the following roles:

   - **Built-in roles**: If you want to use a built-in role, select the **Managed HSM Crypto User** role.

   - **Custom roles**: If you want to use a custom role, the *dataActions* of that role should have these values:

     - **Microsoft.KeyVault/managedHsm/keys/read/action**
     - **Microsoft.KeyVault/managedHsm/keys/backup/action**

     You can create a custom role using the [Managed HSM data plane role management](/azure/key-vault/managed-hsm/role-management#create-a-new-role-definition).

1. For **Scope**, select the specific key used to create Confidential VM with Customer Managed Key.

   You can also select **All Keys**. 

1. On the **Security principal**, select **Backup Management Service**.

After you assign permissions, wait for role and policy changes to propagate before triggering backup.

## Configure backup for Confidential VM

After Azure Backup gets the necessary permissions, continue with the standard Azure VM backup configuration flow. [Learn how to configure Azure VM backup](backup-azure-vms-enhanced-policy.md).

During configuration:

1. Select the Recovery Services vault and backup policy.
1. Select the Confidential VM to protect.
1. Validate there are no permission warnings for key access.
1. Enable backup and monitor the initial job completion.

## Next step

[Restore CVM using Azure Backup (preview)](confidential-vm-restore.md).

## Related content

- [Back up encrypted Azure virtual machines](backup-azure-vms-encryption.md)
- [Support matrix for Azure VM backup](backup-support-matrix-iaas.md#support-for-confidential-vm-backup-preview)