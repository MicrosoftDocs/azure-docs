---
title: Overview of customized images in Azure Update Manager (preview).
description: The article describes about customized images, how to register, validate the customized images for public preview and its limitations.
ms.service: azure-update-manager
author: snehasudhirG
ms.author: sudhirsneha
ms.date: 05/02/2023
ms.topic: conceptual
---

# Manage updates for customized images

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

This article describes the customized image support, how to enable the subscription and its limitations.

> [!NOTE]
> - Currently, we support [generalized Azure Compute Gallery (SIG) custom images](../virtual-machines/linux/imaging.md#generalized-images). Automatic VM guest patching for generalized custom images is not supported.
> - [Specialized Azure Compute Gallery (SIG) custom images](../virtual-machines/linux/imaging.md#specialized-images) and non-Azure Compute gallery images (including the VMs created by Azure Migrate, Azure Backup, and Azure Site Recovery) are not supported yet. 

## Asynchronous check to validate customized image support

If you're using the Azure Compute Gallery (formerly known as Shared Image Gallery) to create customized images, you can use Update Manager (preview) operations such as Check for updates, One-time update, Schedule updates, or Periodic assessment to validate if the virtual machines are supported for guest patching and then initiate patching if the VMs are supported.

Unlike marketplace images where support is validated even before Update Manager operation is triggered. Here, there are no pre-existing validations in place and the Update Manager operations are triggered and only their success or failure determines support. 

For instance, assessment call, will attempt to fetch the latest patch that is available from the image's OS family to check support. It stores this support-related data in Azure Resource Graph (ARG) table, which you can query to see the support status for your Azure Compute Gallery image.


## Enable Subscription for Public Preview

To self register your subscription for Public preview in Azure portal, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and select **More services**.

   :::image type="content" source="./media/manage-updates-customized-images/access-more-services.png" alt-text="Screenshot that shows how to access more services option.":::

1. In **All services** page, search for *Preview Features*.
   
    :::image type="content" source="./media/manage-updates-customized-images/access-preview-services.png" alt-text="Screenshot that shows how to access preview features.":::

1. In **Preview features** page, enter *gallery* and select *VM Guest Patch Gallery Image Preview*.

   :::image type="content" source="./media/manage-updates-customized-images/access-gallery.png" alt-text="Screenshot that shows how to access gallery.":::
    
1. In **VM Guest Patch Gallery Image Preview**, select **Register** to register your subscription.
    
   :::image type="content" source="./media/manage-updates-customized-images/register-preview.png" alt-text="Screenshot that shows how to register the preview feature.":::


## Prerequisites to test the Azure Compute Gallery custom images (preview)

- Register the subscription for preview using the steps mentioned in [Enable Subscription for Public Preview](#enable-subscription-for-public-preview).
- Ensure that the VM in which you intend to execute the API calls must be in the same subscription that is enrolled for the feature.

## Check the preview

Initiate the asynchronous support check using either of the following APIs:

1. **API Action Invocation**
    1. [Assess patches](/rest/api/compute/virtual-machines/assess-patches?tabs=HTTP) 
    1. [Install patches](/rest/api/compute/virtual-machines/install-patches?tabs=HTTP)

1. **Portal operations**: Try the preview:
    1. [On demand check for updates](view-updates.md).
    1. [One-time update](deploy-updates.md).

**Validate the VM support state**

1. **Azure Resource Graph**
    1. Table
        - `patchassessmentresources`
    1. Resource
        - `Microsoft.compute/virtualmachines/patchassessmentresults/configurationStatus.vmGuestPatchReadiness.detectedVMGuestPatchSupportState. [Possible values: Unknown, Supported, Unsupported, UnableToDetermine]`
        
        :::image type="content" source="./media/manage-updates-customized-images/resource-graph-view.png" alt-text="Screenshot that shows the resource in Azure Resource Graph Explorer.":::

We recommend that you execute the Assess Patches API once the VM is provisioned and the prerequisites are set for Public preview. This validates the support state of the VM. If the VM is supported, you can execute the Install Patches API to initiate the patching.

## Limitations

1. Currently, it is only applicable to Azure Compute Gallery (SIG) images and not to non-Azure Compute Gallery custom images. The Azure Compute Gallery images are of two types - generalized and specialized. Following are the supported scenarios for both:

    | Images | **Currently supported scenarios** | **Unsupported scenarios** |
    |--- | --- | ---|
    | **Azure Compute Gallery: Generalized images** | - On demand assessment </br> - On demand patching </br> - Periodic assessment </br> - Scheduled patching | Automatic VM guest patching | 
    | **Azure Compute Gallery: Specialized images** | - On demand assessment </br> - On demand patching | - Periodic assessment </br> - Scheduled patching </br> - Automatic VM guest patching | 
    | **Non-Azure Compute Gallery images (non-SIG)** | None | - On demand assessment </br> - On demand patching </br> - Periodic assessment </br> - Scheduled patching </br> - Automatic VM guest patching |
    
1. Automatic VM guest patching will not work on Azure Compute Gallery images even if Patch orchestration mode is set to **Azure orchestrated/AutomaticByPlatform**. You can use scheduled patching to patch the machines and define your own schedules.


## Next steps
* [Learn more](support-matrix.md) about supported operating systems.