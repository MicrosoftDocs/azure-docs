---
title: Create shared Azure Linux VM images using the portal 
description: Learn how to use Azure portal to create and share Linux virtual machine images.
ms.service: virtual-machines
ms.subservice: gallery
ms.collection: linux
ms.topic: how-to
ms.workload: infrastructure
ms.date: 06/21/2021
author: sandeepraichura
ms.author: saraic
ms.reviewer: cynthn
#Customer intent: As an IT administrator, I want to learn about how to create shared VM images to minimize the number of post-deployment configuration tasks.
---

# Create an Azure Compute Gallery using the portal

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets **Applies to:** :heavy_check_mark: :heavy_check_mark: Uniform scale sets 

An [Azure Compute Gallery](../shared-image-galleries.md) simplifies custom image sharing across your organization. Custom images are like marketplace images, but you create them yourself. Custom images can be used to bootstrap deployment tasks like preloading applications, application configurations, and other OS configurations. 

The Azure Compute Gallery lets you share your custom VM images with others in your organization, within or across regions, within an Azure AD tenant. Choose which images you want to share, which regions you want to make them available in, and who you want to share them with. You can create multiple galleries so that you can logically group images. 

The gallery is a top-level resource that provides full Azure role-based access control (Azure RBAC). Images can be versioned, and you can choose to replicate each image version to a different set of Azure regions. The gallery only works with Managed Images.

The Azure Compute Gallery feature has multiple resource types. We will be using or building these in this article:


[!INCLUDE [virtual-machines-shared-image-gallery-resources](../includes/virtual-machines-shared-image-gallery-resources.md)]

<br>


## Before you begin

To complete the example in this article, you must have an existing managed image of a generalized VM, or a snapshot of a specialized VM. You can follow [Tutorial: Create a custom image of an Azure VM with Azure PowerShell](tutorial-custom-images.md) to create a managed image, or [Create a snapshot](../windows/snapshot-copy-managed-disk.md) for a specialized VM. For both managed images and snapshots, the data disk size cannot be more than 1 TB.

When working through this article, replace the resource group and VM names where needed.

 
[!INCLUDE [virtual-machines-common-shared-images-portal](../../../includes/virtual-machines-common-shared-images-portal.md)]

## Create VMs 

Now you can create one or more new VMs. This example creates a VM named *myVMfromImage*, in the *myResourceGroup* in the *East US* datacenter.

1. Go to your image definition. You can use the resource filter to show all image definitions available.
1. On the page for your image definition, select **Create VM** from the menu at the top of the page.
1. For **Resource group**, select **Create new** and type *myResourceGroup* for the name.
1. In **Virtual machine name**, type *myVM*.
1. For **Region**, select *East US*.
1. For **Availability options**, leave the default of *No infrastructure redundancy required*.
1. The value for **Image** is automatically filled with the `latest` image version if you started from the page for the image definition.
1. For **Size**, choose a VM size from the list of available sizes and then choose **Select**.
1. Under **Administrator account**, if the source VM was generalized, enter your **Username** and **SSH public key**. If the source VM was specialized, these options will be greyed out because the information from the source VM is used.
1. If you want to allow remote access to the VM, under **Public inbound ports**, choose **Allow selected ports** and then select **SSH (22)** from the drop-down. If you don't want to allow remote access to the VM, leave **None** selected for **Public inbound ports**.
1. Select **Other** under Licensing, unless your image is based on RedHat or SLES.
1. When you are finished, select the **Review + create** button at the bottom of the page.
1. After the VM passes validation, select **Create** at the bottom of the page to start the deployment.


## Clean up resources

When no longer needed, you can delete the resource group, virtual machine, and all related resources. To do so, select the resource group for the virtual machine, select **Delete**, then confirm the name of the resource group to delete.

If you want to delete individual resources, you need to delete them in reverse order. For example, to delete an image definition, you need to delete all of the image versions created from that image.

## Next steps

You can also create Azure Compute Gallery resource using templates. There are several Azure Quickstart Templates available: 

- [Create an Azure Compute Gallery](https://azure.microsoft.com/resources/templates/sig-create/)
- [Create an Image Definition in an Azure Compute Gallery](https://azure.microsoft.com/resources/templates/sig-image-definition-create/)
- [Create an Image Version in an Azure Compute Gallery](https://azure.microsoft.com/resources/templates/sig-image-version-create/)

For more information about Azure Compute Galleries, see the [Overview](../shared-image-galleries.md). If you run into issues, see [Troubleshooting galleries](../troubleshooting-shared-images.md).