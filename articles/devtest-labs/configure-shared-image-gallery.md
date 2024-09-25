---
title: Configure a shared image gallery
titleSuffix: Azure DevTest Labs
description: Learn how to configure a shared image gallery in Azure DevTest Labs, so users can access virtual machine images from a shared location.
ms.topic: how-to
ms.custom: devx-track-arm-template, UpdateFrequency2
ms.author: rosemalcolm
author: RoseHJM
ms.date: 06/10/2024

#customer intent: As a developer, I want to configure a shared image gallery in Azure DevTest Labs, so I can access images from a shared location to create lab machines.
---

# Configure a shared image gallery in Azure DevTest Labs

DevTest Labs supports storing and sharing images with [Azure Compute Gallery](/azure/virtual-machines/shared-image-galleries). A shared image gallery makes it easy to maintain a large number of managed images and make them widely available. It's also a great way to provide standardized images with current software for your users. Both specialized and generalized images are supported. By using a shared image gallery, you can build structure and organization around your custom-managed virtual machine (VM) images.

This article describes how to attach a shared image gallery to your lab. Users can access images from the shared location when creating lab VMs. A key advantage of this approach is that DevTest Labs lets you share VM images across labs, across subscriptions, and across regions. 

## Explore shared image galleries

Some of the benefits of using a shared image gallery with DevTest Labs include:

- Manage global replication of images
- Apply versioning and grouping for images to enable easier management
- Access highly available images with Zone Redundant Storage (ZRS) accounts in regions that support availability zones for better resilience against zonal failures
- Share images across subscriptions and between tenants by using role-based access control (RBAC)
 
Keep in mind the following considerations when working with a shared gallery:

- You can attach only one shared image gallery to your lab at a time. To attach a different gallery, you must first detach the current gallery. 
- You can only select images from an attached gallery through DevTest Labs. You can't upload images or change the images in the gallery through DevTest Labs.
- When you create a VM from a shared image, DevTest Labs uses the latest published version of the image in the attached gallery. If an image has multiple versions, you can choose an earlier version under **Advanced Settings** during VM creation.  
- DevTest Labs attempts to replicate all images in the attached gallery to the lab region. Sometimes, replication isn't possible. To avoid users having issues when creating VMs from images, ensure the images in the attached gallery fully replicate to the lab region.

To learn about costs associated with using a shared image gallery, see [Billing for Azure Compute Gallery](/azure/virtual-machines/azure-compute-gallery#billing).

## Attach gallery from the Azure portal

Follow these steps to attach a shared image gallery to your DevTest Labs resource:

1. In the [Azure portal](https://portal.azure.com), go to your DevTest Labs resource where you want to attach the shared image gallery.

1. On your lab **Overview** page, expand the **Settings** section in the left menu, and select **Configuration and policies**.

1. On the **Configuration and policies** screen, expand the **Virtual machine bases** section in the left menu, and select **Shared Image Galleries**:

   :::image type="content" source="./media/configure-shared-image-gallery/galleries-attach.png" border="false" alt-text="Screenshot that shows how to select the Attach option for shared image galleries for a DevTest Labs resource." lightbox="./media/configure-shared-image-gallery/galleries-attach-large.png":::

1. Select **Attach** to add an existing shared image gallery to your lab.

1. In the **Attach existing gallery** dropdown list, select the shared image gallery to add to your lab, and then select **OK**:

   :::image type="content" source="./media/configure-shared-image-gallery/attach-gallery.png" border="false" alt-text="Screenshot that shows how to attach a shared image gallery to a lab.":::

1. After DevTest Labs attaches the gallery to your lab, you can select the gallery name to see the full list of images:

   :::image type="content" source="./media/configure-shared-image-gallery/view-attached-gallery.png" alt-text="Screenshot that shows how to see the list of all images in the attached shared gallery for the lab.":::

   The **Shared images** page opens:

   :::image type="content" source="./media/configure-shared-image-gallery/view-allowed-images.png" alt-text="Screenshot of the list of images in the shared gallery with checkbox indicators to show the images allowed for VM creation.":::

## Control available images

The **Allow all images to be used as virtual machine bases** option lets you control which images are available for lab users to use when creating lab VMs. By default, this option is set to **Yes**, and lab users have access to all images in the attached gallery. 
    
Follow these steps to restrict access for images in the gallery:
   
1. On the **Configuration and policies** page for your lab, go to the **Virtual machine bases** > **Shared Image Galleries** screen.

1. Select the attached gallery name to open the **Shared images** page, which shows the list of images.

1. On the **Shared images** page, set the **Allow all images to be used as virtual machine bases** option to **No**.
   
1. For any image that you want to make _unavailable_ to lab users, deselect the checkbox for the image.
   
1. Select **Save**.

## Access images in attached gallery

After you attach a shared image gallery to your lab, lab users can choose from the allowed images when they create a new VM:
   
1. On the **Configuration and policies** page for your lab, go to the **Virtual machine bases** > **Shared Image Galleries** screen.

1. Select the attached gallery name to open the **Shared images** page, which shows the list of images.

1. Take note of the name of the gallery image that you want to use to create the new VM.

1. Return to your lab **Overview** page, and select **Add**.

1. On the **Choose a base** page, select the gallery image that you want to use to create the new VM. In the list of images, the allowed images from the attached shared image gallery follow images available from Azure Resource Manager (ARM) templates:

   :::image type="content" source="./media/configure-shared-image-gallery/select-image.png" alt-text="Screenshot that shows the list of available images for the VM instance, including the allowed images from the attached shared image gallery." lightbox="./media/configure-shared-image-gallery/select-image-large.png":::

Follow the steps to create the VM from the selected image.

## Detach current shared image gallery

A lab can have only one attached shared image gallery at a time. If your lab has an attached gallery, and you want to use a different gallery, you need to first detach the existing gallery. After you detach the existing gallery, you can attach a different gallery.

1. On the **Configuration and policies** page for your lab, go to the **Virtual machine bases** > **Shared Image Galleries** screen.

1. Select **More options** (...) for the attached gallery and select **Detach**:

   :::image type="content" source="./media/configure-shared-image-gallery/detach-gallery.png" alt-text="Screenshot that shows how to detach the current shared image gallery from the lab.":::

The **Detach** option is also available on the **Shared images** page for the attached gallery. 

## Attach gallery by using template

You can use an ARM template to attach a shared image gallery to your lab. You need to add the gallery as a resource for your ARM template, as shown in the following example:

```json
"resources": [
{
    "apiVersion": "2018-10-15-preview",
    "type": "Microsoft.DevTestLab/labs",
    "name": "mylab",
    "location": "eastus",
    "resources": [
    {
        "apiVersion":"2018-10-15-preview",
        "name":"myGallery",
        "type":"sharedGalleries",
        "properties": {
            "galleryId":"/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/mySharedGalleryRg/providers/Microsoft.Compute/galleries/mySharedGallery",
            "allowAllImages": "Enabled"
        }
    }
    ]
}
```

The DevTest Labs GitHub repository provides full samples that use ARM templates to attach shared image galleries. To get started, you can [Configure a shared image gallery when you create a new lab](https://github.com/Azure/azure-devtestlab/tree/master/samples/DevTestLabs/QuickStartTemplates/101-dtl-create-lab-shared-gallery-configured).

## Use REST API

The following sections provide examples for how to use the REST API to work with images from the shared image gallery.

### Get list of labs 

The following GET call returns the list of DevTest Labs resources for a subscription. In this example, you provide the following parameters:

- `subscriptionId`: The subscription ID for which to return the list of DevTest Labs resources.
- `resourceGroupName`: The name of the resource group to search for DevTest Labs resources.

```http
GET  https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DevTestLab/labs?api-version= 2018-10-15-preview
```

### Get list of shared image galleries for lab

The following GET call returns the list of shared image galleries associated with a lab. In this example, you provide the following parameters:

- `subscriptionId`: The subscription ID for the DevTest Labs resource.
- `resourceGroupName`: The name of the resource group for the DevTest Labs resource.
- `labName`: The name of the DevTest Labs resource for which to to return the list of associated shared image galleries.

```http
GET  https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DevTestLab/labs/{labName}/sharedgalleries?api-version= 2018-10-15-preview
```

### Create or update shared image gallery

The following PUT call creates or updates a shared image gallery for a specified lab. In this example, you provide the following parameters:

- `subscriptionId`: The subscription ID for the DevTest Labs resource.
- `resourceGroupName`: The name of the resource group for the DevTest Labs resource.
- `labName`: The name of the DevTest Labs resource.
- `name`: The name of the shared gallery to create or update for the lab.
- `galleryId`: The ID of the shared gallery to create or update for the lab.
- `allowAllImages`: Set to `Enabled` to allow all images in the gallery to be used with the lab resource.

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DevTestLab/labs/{labName}/sharedgalleries/{name}?api-version=2018-10-15-preview
Body: 
{
    "properties":{
        "galleryId": "[Shared Image Gallery resource Id]",
        "allowAllImages": "Enabled"
    }
}
```

### List images in shared image gallery

The following GET call returns the list of images in a specified shared image gallery for a lab. In this example, you provide the following parameters:

- `subscriptionId`: The subscription ID for the DevTest Labs resource.
- `resourceGroupName`: The name of the resource group for the DevTest Labs resource.
- `labName`: The name of the DevTest Labs resource.
- `name`: The name of the shared gallery associated with the lab for which you want to list the images.

```http
GET  https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DevTestLab/labs/{labName}/sharedgalleries/{name}/sharedimages?api-version=2018-10-15-preview
```

## Related content

- [Create VM from image in attached shared image gallery](add-vm-use-shared-image.md)
- Explore [Azure Compute Gallery documentation](/azure/virtual-machines/shared-image-galleries)
