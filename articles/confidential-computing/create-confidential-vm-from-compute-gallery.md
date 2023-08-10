---
title: Create a confidential VM from an Azure Compute Gallery image
description: Learn how to quickly create and deploy an AMD-based DCasv5 or ECasv5 series Azure confidential virtual machine (confidential VM) from an Azure Compute Gallery image
author: lakmeedee
ms.author: dejv
ms.service: virtual-machines
ms.subservice: confidential-computing
ms.workload: infrastructure
ms.topic: quickstart
ms.date: 07/14/2022
ms.custom: mode-arm
ms.devlang: azurecli
---

# Quickstart: Deploy a confidential VM from an Azure Compute Gallery image using the Azure portal

[Azure confidential virtual machines](confidential-vm-overview.md) supports the creation and sharing of custom images using Azure Compute Gallery. There are two types of images that you can create, based on the security types of the image:

- [Confidential VM (`ConfidentialVM`) images](#confidential-vm-images) are images where the source already has the [VM Guest state information](confidential-vm-faq-amd.yml). This image type might also have confidential disk encryption enabled.
- [Confidential VM supported (`ConfidentialVMSupported`) images](#confidential-vm-supported-images) are images where the source doesn't have VM Guest state information and confidential disk encryption is not enabled.

## Confidential VM images

For the following image sources, the security type on the image definition should be set to `ConfidentialVM` as the image source already has [VM Guest State information](confidential-vm-faq-amd.yml#is-there-an-extra-cost-for-using-confidential-vms-) and may also have confidential disk encryption enabled:
- Confidential VM capture
- Managed OS disk 
- Managed OS disk snapshot

The resulting image version can be used only to create confidential VMs.

This image version can be replicated within the source region **but cannot be replicated to a different region** or across subscriptions currently.

> [!NOTE]
> If you want to create an image from a Windows confidential VM that has confidential compute disk encryption enabled with a platform-managed key or a customer-managed key, you can only create a specialized image. This limitation exists because the generalization tool (**sysprep**), might not be able to generalized the encrypted image source. This limitation applies to the OS disk, which is implicitly created along with the Windows confidential VM, and the snapshot created from this OS disk.

### Create a Confidential VM type image using Confidential VM capture

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to the **Virtual machines** service.
1. Open the confidential VM that you want to use as the image source.
1. If you want to create a generalized image, [remove machine-specific information](../virtual-machines/generalize.md) before you create the image.
1. Select **Capture**.
1. In the **Create an image** page that opens, [create your image definition and version](../virtual-machines/image-version.md?tabs=portal#create-an-image).
    1. Allow the image to be shared to Azure Compute Gallery as a VM image version. Managed images aren't supported for confidential VMs.
    1. Either create a new gallery, or select an existing gallery.
    1. For the **Operating system state**, select either **Generalized** or **Specialized**, depending on your use case.
    1. Create an image definition by providing a name, publisher, offer, and SKU details. Make sure the security type is set to **Confidential**.
    1. Provide a version number for the image.
    1. For **Replication**, modify the replica count, if required.
    1. Select **Review + Create**.
    1. When the image validation succeeds, select **Create** to finish creating the image.
1. Select the image version to go to the resource directly. Or, you can go to the image version through the image definition. The image definition also shows the encryption type, so you can check that the image and source VM match.
1. On the image version page, select **Create VM**.

Now, you can [create a Confidential VM from your custom image](#create-a-confidential-vm-from-gallery-image).

### Create a Confidential VM type image from managed disk or snapshot

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If you want to create a generalized image, [remove machine-specific information](../virtual-machines/generalize.md) for the disk or snapshot before you create the image.
1. Search for and select **VM Image Versions** in the search bar.
1. Select **Create**
1. On the **Create VM image version** page's **Basics** tab:
    1. Select an Azure subscription.
    1. Select an existing resource group, or create a new resource group.
    1. Select an Azure region.
    1. Enter a version number for the image.
    1. For **Source**, select **Disks and/or Snapshots**.
    1. For **OS disk**, select either a managed disk or managed disk snapshot.
    1. For **Target Azure compute gallery**, select or create a gallery to share the image in.
    1. For **Operating system state**, select either **Generalized** or **Specialized** depending on your use case. 
    1. For **Target VM image definition**, select **Create new**.
    1. In the **Create a VM image definition** pane, enter a name for the definition. Make sure the **Security type** is **Confidential**. Enter the publisher, offer, and SKU information. Then, select **Ok**.
1. On the **Encryption** tab, make sure the **Confidential compute encryption type** matches the source disk or snapshot's type.
1. Select **Review + Create** to review your settings.
1. After the settings are validated, select **Create** to finish creating the image version.
1. After the image version is successfully created, select **Create VM**.

Now, you can [create a Confidential VM from your custom image](#create-a-confidential-vm-from-gallery-image).

## Confidential VM Supported images

For the following image sources, the security type on the image definition should be set to `ConfidentialVMSupported` as the image source does not have VM Guest state information and confidential disk encryption:
- OS Disk VHD
- Gen2 Managed Image

The resulting image version can be used to create either Azure Gen2 VMs or confidential VMs.

This image can be replicated within the source region and to different target regions.

> [!NOTE]
> The OS disk VHD or Managed Image should be created from an image that is compatible with confidential VM. The size of the VHD or managed image should be less than 32 GB

### Create a Confidential VM Supported type image

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for and select **VM image versions** in the search bar
1. On the **VM image versions** page, select **Create**.
1. On the **Create VM image version** page, on the **Basics** tab:
    1. Select the Azure subscription.
    1. Select an existing resource group or create a new resource group.
    1. Select the Azure region.
    1. Enter an image version number.
    1. For **Source**, select either **Storage Blobs (VHD)** or **Managed Image**.
    1. If you selected **Storage Blobs (VHD)**, enter an OS disk VHD (without the VM Guest state). Make sure to use a Gen 2 VHD.
    1. If you selected **Managed Image**, select an existing managed image of a Gen 2 VM.
    1. For **Target Azure compute gallery**, select or create a gallery to share the image.
    1. For **Operating system state**, select either **Generalized** or **Specialized** depending on your use case. If you're using a managed image as the source, always select **Generalized**. If you're using a storage blob (VHD) and want to select **Generalized**, follow the steps to [generalize a Linux VHD](../virtual-machines/linux/create-upload-generic.md) or [generalize a Windows VHD](../virtual-machines/windows/upload-generalized-managed.md) before you continue.
    1. For **Target VM Image Definition**, select **Create new**.
    1. In the **Create a VM image definition** pane, enter a name for the definition. Make sure the security type is set to **Confidential supported**. Enter publisher, offer, and SKU information. Then, select **Ok**.
1. On the **Replication** tab, enter the replica count and target regions for image replication, if required.
1. On the **Encryption** tab, enter SSE encryption-related information, if required.
1. Select **Review + Create**.
1. After the configuration is successfully validated, select **Create** to finish creating the image.
1. After the image version is created, select **Create VM**.

## Create a Confidential VM from gallery image
Now that you have successfully created an image, you can now use that image to create a confidential VM.

1. On the **Create a virtual machine** page, configure the **Basics** tab:
      1. Under **Project details**, for **Resource group**, create a new resource group or select an existing resource group.
      1. Under **Instance details**, enter a VM name and select a region that supports confidential VMs. For more information, find the confidential VM series in the table of [VM products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines).
      1. If you're using a *Confidential* image, the security type is set to **Confidential virtual machines** and can't be modified. If you're using a *Confidential Supported* image, you have to select the security type as **Confidential virtual machines** from **Standard**.
      1. vTPM is enabled by default and can't be modified.
      1. Secure Boot is enabled by default. To modify the setting, use ***Configure Security features***. Secure Boot is required to use confidential compute encryption.
1. On the **Disks** tab, configure your encryption settings if necessary.
      1. If you're using a *Confidential* image, the confidential compute encryption and the confidential disk encryption set (if you're using customer-managed keys) are populated based on the selected image version and can't be modified.
      1. If you're using a *Confidential supported* image, you can select confidential compute encryption, if required. Then, provide a confidential disk encryption set, if you want to use customer-managed keys.
1. Enter the administrator account information.
1. Configure any inbound port rules.
1. Select **Review + Create**.
1. On the validation page, review the details of the VM.
1. After the validation succeeds, select **Create** to finish creating the VM.


## Next steps
For more information on Confidential Computing, see the [Confidential Computing overview](overview.md) page.
