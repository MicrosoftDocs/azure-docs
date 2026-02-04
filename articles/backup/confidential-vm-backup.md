---
title: Azure Backup - Configure backup of Confidential VM using Azure Backup (preview) 
description: Learn about backing up Confidential VM with PMK or CMK using Azure Backup.
ms.topic: how-to
ms.date: 01/28/2026
ms.custom: references_regions
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-mallicka
---

# Back up Confidential VM using Azure Backup (preview)

[!INCLUDE [Confidential VM backup preview advisory.](../../includes/confidential-vm-backup-preview.md)]

Azure Backup supports [Confidential Virtual Machines (CVMs)](/azure/confidential-computing/confidential-vm-overview) that provide secure backup and restore for sensitive workloads. This capability uses Azure Disk Encryption Sets (DES) with Platform Managed Keys (PMKs) or Customer Managed Keys (CMKs) to maintain data confidentiality throughout the backup lifecycle. Confidential VMs provide strong security by creating a hardware-enforced boundary between your application and the virtualization stack.

This article describes how to configure and back up Confidential VM (CVM) with Platform or Customer Managed Key (PMK or CMK).

## Supported scenarios for Confidential VM backup

[!INCLUDE [Confidential VM backup support scenarios..](../../includes/confidential-vm-backup-support-matrix.md)]

## Prerequisites

Before you configure backup for CVM with CMK, ensure that the following prerequisites are met:

- Register for the preview feature `RestorePointSupportForConfidentialVMV2` under the `Microsoft.Compute` provider namespace by running the following cmdlet. The registration is autoapproved.

   ```azurepowershell-interactive
   Register-AzProviderFeature -FeatureName "RestorePointSupportForConfidentialVMV2" -ProviderNamespace "Microsoft.Compute" 

   ```

- Identify or create a Confidential VM (CVM) in a supported region. See the [supported regions](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=virtual-machines).
- Identify or [create a Recovery Services Vault](backup-create-recovery-services-vault.md#create-a-recovery-services-vault) in the same region as the VM.

## Create a new Confidential VM with PMK or CMK

To back up a Confidential VM using Azure Backup, you must have a Confidential VM configured with PMK or CMK encryption. Azure Backup uses the Disk Encryption Set (DES) associated with your VM to maintain encryption throughout the backup and restore process.

Learn how to [create a new Confidential VM with PMK or CMK](/azure/confidential-computing/quick-create-confidential-vm-portal-amd), if needed.

## Assign permissions for Confidential VM backup

Azure Backup requires access to the Key vault or Managed Hardware Security Module (HSM) that stores your keys. This access ensures the service can back up keys and recover them if they're deleted. When you configure backup in the Azure portal, Azure Backup automatically gets the required permissions. If you use other clients, such as PowerShell, CLI, or REST API, you must assign these permissions manually.

If you're using a Key vault to store keys, [grant permission to the Azure Backup service for the backup operations](backup-azure-vms-encryption.md#provide-permissions). 

To assign permissions for MHSM, follow these steps:

1. In the Azure portal, go to **Managed HSM**, and then select **Local RBAC** in **Settings**.

2. Select **Add** to add a *new Role Assignment*.

3. Select one of the following roles:

   - **Built-in roles**: If you want to use a built-in role, select the **Managed HSM Crypto User** role.

   - **Custom roles**: If you want to use custom role, then *dataActions* of that role should have these values:

     - **Microsoft.KeyVault/managedHsm/keys/read/action**
     - **Microsoft.KeyVault/managedHsm/keys/backup/action**

     You can create a custom role using the [Managed HSM data plane role management](/azure/key-vault/managed-hsm/role-management#create-a-new-role-definition).

4. For **Scope**, select the specific key used to create Confidential VM with Customer Managed Key.

   You can also select **All Keys**. 

5. On the **Security principal**, select **Backup Management Service**.

## Configure backup for Confidential VM

Once Azure Backup has the necessary permissions, you can continue configuring backup. [Learn how to configure Azure VM backup](backup-azure-vms-enhanced-policy.md).

## Next step

[Restore CVM using Azure Backup (preview)](confidential-vm-restore.md).

## Related content

[Back up encrypted Azure virtual machines](backup-azure-vms-encryption.md).