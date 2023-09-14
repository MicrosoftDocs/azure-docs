---
title: Overview of customized images in Azure Update Manager (preview)
description: This article describes customized image support, how to register and validate customized images for public preview, and limitations.
ms.service: azure-update-manager
author: snehasudhirG
ms.author: sudhirsneha
ms.date: 05/02/2023
ms.topic: conceptual
---

# Manage updates for customized images

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

This article describes customized image support, how to enable a subscription, and limitations.

> [!NOTE]
> - Currently, we support [generalized Azure Compute Gallery (SIG) custom images](../virtual-machines/linux/imaging.md#generalized-images). Automatic virtual machine (VM) guest patching for generalized custom images isn't supported.
> - [Specialized Azure Compute Gallery (SIG) custom images](../virtual-machines/linux/imaging.md#specialized-images) and non-Azure Compute Gallery images (including the VMs created by Azure Migrate, Azure Backup, and Azure Site Recovery) aren't supported yet.

## Asynchronous check to validate customized image support

If you're using Azure Compute Gallery (formerly known as Shared Image Gallery) to create customized images, you can use Update Manager (preview) operations such as **Check for updates**, **One-time update**, **Schedule updates**, or **Periodic assessment** to validate if the VMs are supported for guest patching. If the VMs are supported, you can begin patching.

With marketplace images, support is validated even before Update Manager operation is triggered. Here, there are no preexisting validations in place and the Update Manager operations are triggered. Only their success or failure determines support.

For instance, an assessment call attempts to fetch the latest patch that's available from the image's OS family to check support. It stores this support-related data in an Azure Resource Graph table, which you can query to see the support status for your Azure Compute Gallery image.

## Enable a subscription for public preview

To self-register your subscription for public preview in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com) and select **More services**.

   :::image type="content" source="./media/manage-updates-customized-images/access-more-services.png" alt-text="Screenshot that shows how to access the More services option.":::

1. On the **All services** page, search for **Preview features**.
   
    :::image type="content" source="./media/manage-updates-customized-images/access-preview-services.png" alt-text="Screenshot that shows how to access preview features.":::

1. On the **Preview features** page, enter **gallery** and select **VM Guest Patch Gallery Image Preview**.

   :::image type="content" source="./media/manage-updates-customized-images/access-gallery.png" alt-text="Screenshot that shows how to access the gallery.":::
    
1. On the **VM Guest Patch Gallery Image Preview** page, select **Register** to register your subscription.
    
   :::image type="content" source="./media/manage-updates-customized-images/register-preview.png" alt-text="Screenshot that shows how to register the Preview feature.":::

## Prerequisites to test the Azure Compute Gallery custom images (preview)

- Register the subscription for preview by following the steps in [Enable a subscription for public preview](#enable-a-subscription-for-public-preview).
- Ensure that the VM where you intend to run the API calls is in the same subscription that's enrolled for the feature.

## Check the preview

Start the asynchronous support check by using either one of the following APIs:

- API Action Invocation:
  1. [Assess patches](/rest/api/compute/virtual-machines/assess-patches?tabs=HTTP).
  1. [Install patches](/rest/api/compute/virtual-machines/install-patches?tabs=HTTP).

- Portal operations. Try the preview:
  1. [On-demand check for updates](view-updates.md)
  1. [One-time update](deploy-updates.md)

Validate the VM support state for Azure Resource Graph:

- Table:

  `patchassessmentresources`
- Resource:

  `Microsoft.compute/virtualmachines/patchassessmentresults/configurationStatus.vmGuestPatchReadiness.detectedVMGuestPatchSupportState. [Possible values: Unknown, Supported, Unsupported, UnableToDetermine]`
        
  :::image type="content" source="./media/manage-updates-customized-images/resource-graph-view.png" alt-text="Screenshot that shows the resource in Azure Resource Graph Explorer.":::

We recommend that you run the Assess Patches API after the VM is provisioned and the prerequisites are set for public preview. This action validates the support state of the VM. If the VM is supported, you can run the Install Patches API to begin the patching.

## Limitations

Currently, it's only applicable to Azure Compute Gallery (SIG) images and not to non-Azure Compute Gallery custom images. The Azure Compute Gallery images are of two types: generalized and specialized. The following supported scenarios are for both types.

| Images | Currently supported scenarios | Unsupported scenarios |
|--- | --- | ---|
| Azure Compute Gallery: Generalized images | - On-demand assessment </br> - On-demand patching </br> - Periodic assessment </br> - Scheduled patching | Automatic VM guest patching | 
| Azure Compute Gallery: Specialized images | - On-demand assessment </br> - On-demand patching | - Periodic assessment </br> - Scheduled patching </br> - Automatic VM guest patching | 
| Non-Azure Compute Gallery images (non-SIG) | None | - On-demand assessment </br> - On-demand patching </br> - Periodic assessment </br> - Scheduled patching </br> - Automatic VM guest patching |

Automatic VM guest patching doesn't work on Azure Compute Gallery images even if Patch orchestration mode is set to `Azure orchestrated/AutomaticByPlatform`. You can use scheduled patching to patch the machines and define your own schedules.

## Next steps

[Learn more](support-matrix.md) about supported operating systems.
