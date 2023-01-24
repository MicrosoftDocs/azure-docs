---
title: Enable end-to-end encryption using encryption at host - Azure portal - managed disks
description: Use encryption at host to enable end-to-end encryption on your Azure managed disks - Azure portal.
author: roygara
ms.service: storage
ms.topic: how-to
ms.date: 09/27/2022
ms.author: rogarana
ms.subservice: disks
ms.custom: references_regions
---

# Use the Azure portal to enable end-to-end encryption using encryption at host

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs

When you enable encryption at host, data stored on the VM host is encrypted at rest and flows encrypted to the Storage service. For conceptual information on encryption at host, and other managed disk encryption types, see: [Encryption at host - End-to-end encryption for your VM data](./disk-encryption.md#encryption-at-host---end-to-end-encryption-for-your-vm-data).

Temporary disks and ephemeral OS disks are encrypted at rest with platform-managed keys when you enable end-to-end encryption. The OS and data disk caches are encrypted at rest with either customer-managed or platform-managed keys, depending on what you select as the disk encryption type. For example, if a disk is encrypted with customer-managed keys, then the cache for the disk is encrypted with customer-managed keys, and if a disk is encrypted with platform-managed keys then the cache for the disk is encrypted with platform-managed keys.

## Restrictions

[!INCLUDE [virtual-machines-disks-encryption-at-host-restrictions](../../includes/virtual-machines-disks-encryption-at-host-restrictions.md)]


### Supported VM sizes

Legacy VM Sizes are not supported. You can find the list of supported VM sizes by either using the [Azure PowerShell module](windows/disks-enable-host-based-encryption-powershell.md#finding-supported-vm-sizes) or [Azure CLI](linux/disks-enable-host-based-encryption-cli.md#finding-supported-vm-sizes).

## Prerequisites

You must enable the feature for your subscription before you use the EncryptionAtHost property for your VM/VMSS. Use the following steps to enable the feature for your subscription:

1. **Azure portal**: Select the Cloud Shell icon on the [Azure portal](https://portal.azure.com):

    ![Icon to launch the Cloud Shell from the Azure portal](../Cloud-Shell/media/overview/portal-launch-icon.png)

1.	Execute the following command to register the feature for your subscription

    ### [Azure PowerShell](#tab/azure-powershell)

    ```powershell
     Register-AzProviderFeature -FeatureName "EncryptionAtHost" -ProviderNamespace "Microsoft.Compute" 
    ```

    ### [Azure CLI](#tab/azure-cli)

    ```azurecli
    az feature register --name EncryptionAtHost  --namespace Microsoft.Compute 
    ```

    ---

1.	Confirm that the registration state is **Registered** (takes a few minutes) using the command below before trying out the feature.

    ### [Azure PowerShell](#tab/azure-powershell)

    ```powershell
     Get-AzProviderFeature -FeatureName "EncryptionAtHost" -ProviderNamespace "Microsoft.Compute"  
    ```

    ### [Azure CLI](#tab/azure-cli)

    ```azurecli
    az feature show --name EncryptionAtHost --namespace Microsoft.Compute
    ```
    ---

## Deploy a VM with platform-managed keys

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for **Virtual Machines** and select **+ Add** to create a VM.
1. Create a new virtual machine, select an appropriate region and a supported VM size.
1. Fill in the other values on the **Basic** pane as you like, then proceed to the **Disks** pane.

    :::image type="content" source="media/virtual-machines-disks-encryption-at-host-portal/disks-encryption-at-host-basic-blade.png" alt-text="Screenshot of the virtual machine creation basics pane, region and V M size are highlighted.":::

1. On the **Disks** pane, select **Encryption at host**.
1. Make the remaining selections as you like.

    :::image type="content" source="media/virtual-machines-disks-encryption-at-host-portal/host-based-encryption-platform-keys.png" alt-text="Screenshot of the virtual machine creation disks pane, encryption at host highlighted.":::

1. Finish the VM deployment process, make selections that fit your environment.

You have now deployed a VM with encryption at host enabled, and the cache for the disk is encrypted using platform-managed keys.

## Deploy a VM with customer-managed keys

Alternatively, you can use customer-managed keys to encrypt your disk caches.

### Create an Azure Key Vault and disk encryption set

Once the feature is enabled, you'll need to set up an Azure Key Vault and a disk encryption set, if you haven't already.

[!INCLUDE [virtual-machines-disks-encryption-create-key-vault-portal](../../includes/virtual-machines-disks-encryption-create-key-vault-portal.md)]

## Deploy a VM

Now that you've setup an Azure Key Vault and disk encryption set, you can deploy a VM and it will use encryption at host.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for **Virtual Machines** and select **+ Add** to create a VM.
1. Create a new virtual machine, select an appropriate region and a supported VM size.
1. Fill in the other values on the **Basic** pane as you like, then proceed to the **Disks** pane.

    :::image type="content" source="media/virtual-machines-disks-encryption-at-host-portal/disks-encryption-at-host-basic-blade.png" alt-text="Screenshot of the virtual machine creation basics pane, region and V M size are highlighted.":::

1. On the **Disks** pane, select **Encryption at-rest for customer-managed key** for **SSE encryption type** and select your disk encryption set.
1. Select **Encryption at host**.
1. Make the remaining selections as you like.

    :::image type="content" source="media/virtual-machines-disks-encryption-at-host-portal/disks-host-based-encryption-customer-managed-keys.png" alt-text="Screenshot of the virtual machine creation disks pane, encryption at host is highlighted, customer-managed keys selected.":::

1. Finish the VM deployment process, make selections that fit your environment.

You have now deployed a VM with encryption at host enabled.

## Disable host based encryption

Make sure your VM is deallocated first, you cannot disable encryption at host unless your VM is deallocated.

1. On your VM, select **Disks** and then select **Additional settings**.

    :::image type="content" source="media/virtual-machines-disks-encryption-at-host-portal/disks-encryption-host-based-encryption-additional-settings.png" alt-text="Screenshot of the Disks pane on a VM, Additional Settings is highlighted.":::

1. Select **No** for **Encryption at host** then select **Save**.

## Next steps

[Azure Resource Manager template samples](https://github.com/Azure-Samples/managed-disks-powershell-getting-started/tree/master/EncryptionAtHost)
