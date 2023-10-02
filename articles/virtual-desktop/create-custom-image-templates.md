---
title: Use custom image templates to create custom images - Azure Virtual Desktop
description: Learn how to use custom image templates to create custom images when deploying session hosts in Azure Virtual Desktop.
ms.topic: how-to
author: dknappettmsft
ms.author: daknappe
ms.date: 09/08/2023
---

# Use custom image templates to create custom images in Azure Virtual Desktop

Custom image templates in Azure Virtual Desktop enable you to easily create a custom image that you can use when deploying session host virtual machines (VMs). Using custom images helps you to standardize the configuration of your session host VMs for your organization. Custom image templates are built on [Azure Image Builder](../virtual-machines/image-builder-overview.md) and tailored for Azure Virtual Desktop.

This article shows you how to create a custom image template, then create a custom image using that template. For more information, see [Custom image templates](custom-image-templates.md).

## Prerequisites

Before you can create a custom image template, you need to meet the following prerequisites:

- The following resource providers registered on your subscription. For information on how you can check their registration status and how to register them if needed, see [Azure resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md).

   - Microsoft.DesktopVirtualization
   - Microsoft.VirtualMachineImages
   - Microsoft.Storage
   - Microsoft.Compute
   - Microsoft.Network
   - Microsoft.KeyVault

- A resource group to store custom image templates, and images. If you specify your own resource group for Azure Image Builder to use, then it needs to be empty before the image build starts.

- A [user-assigned managed identity](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md). We recommend you create one specifically to use with custom image templates.

- [Create a custom role](../role-based-access-control/custom-roles.md) in Azure role-based access control (RBAC) with the following permissions as *actions*:

   ```json
   "Microsoft.Compute/galleries/read",
   "Microsoft.Compute/galleries/images/read",
   "Microsoft.Compute/galleries/images/versions/read",
   "Microsoft.Compute/galleries/images/versions/write",
   "Microsoft.Compute/images/write",
   "Microsoft.Compute/images/read",
   "Microsoft.Compute/images/delete"
   ```

- [Assign the custom role to the managed identity](../role-based-access-control/role-assignments-portal-managed-identity.md#user-assigned-managed-identity). This should be scoped appropriately for your deployment, ideally to the resource group you use store custom image templates.

- *Optional*: If you want to distribute your image to Azure Compute Gallery, [create an Azure Compute Gallery](../virtual-machines/create-gallery.md), then [create a VM image definition](../virtual-machines/image-version.md). When you create a VM image definition in the gallery you need to specify the *generation* of the image you intend to create, either *generation 1* or *generation 2*. The generation of the image you want to use as the source image needs to match the generation specified in the VM image definition. Don't create a *VM image version* at this stage. This will be done by Azure Virtual Desktop.

- *Optional*: You can use an existing virtual network when building an image. If you do, the managed identity you're using needs access to the virtual network, or the resource group it's contained within. For more information, see [Permission to customize images on your virtual networks](../virtual-machines/linux/image-builder-permissions-powershell.md#permission-to-customize-images-on-your-virtual-networks).

   If this virtual network is using a *private service policy*, it needs to be disabled for Azure Image Builder to work correctly. For more information, see [Disable private service policy on the subnet](../virtual-machines/windows/image-builder-vnet.md#disable-private-service-policy-on-the-subnet).

## Create a custom image

There are two parts to creating a custom image. First you need to create a custom image template, then you need to build the image using the custom image template.

### Create a custom image template

To create a custom image using the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search bar, enter *Azure Virtual Desktop* and select the matching service entry.

1. Select **Custom image templates**, then select **+Add custom image template**.

1. On the **Basics** tab, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | Template name | Enter a name for the custom image template. |
   | Import from existing template | Select **Yes** if you have an existing custom image template that you want to use as the basis of the new template.  |
   | Subscription | Select the subscription you want to use from the list. |
   | Resource group | Select an existing resource group. |
   | Location | Select a region from the list where the custom image template will be created. |
   | Managed identity | Select the managed identity to use for creating the custom image template. |

   Once you've completed this tab, select **Next**.

1. On the **Source image** tab, for **Source type** select the source of your template from one of the options, then complete the other fields for that source type:

   - **Platform image (marketplace)** provides a list of the available images in the Azure Marketplace for Azure Virtual Desktop.

      | Parameter | Value/Description |
      |--|--|
      | Select image | Select the image you want to use from the list. The generation of the image will be shown. |
   
   - **Managed image** provides a list of managed images you have in the same subscription and location you selected on the **Basics** tab.
   
      | Parameter | Value/Description |
      |--|--|
      | Image ID | Select the image ID you want to use from the list. The generation of the image will be shown. |

   - **Azure Computer Gallery** provides a list of image definitions you have in an Azure Compute Gallery.

      | Parameter | Value/Description |
      |--|--|
      | Gallery name | Select the Azure Compute Gallery that contains the source image you want to use from the list. |
      | Gallery image definition | Select the Gallery image definition you want to use from the list. |
      | Gallery version | Select the Gallery version you want to use from the list. The generation of the image will be shown. |

   Once you've completed this tab, select **Next**.

1. On the **Distribution targets** tab, check the relevant box whether you want to create a managed image, an Azure Computer Gallery image, or both:

   - For managed image, complete the following information:
   
      | Parameter | Value/Description |
      |--|--|
      | Resource group | Select an existing resource group from the list for the managed image.<br /><br />If you choose a different resource group to the one you selected on the **Basics** tab, you'll also need to add the same role assignment for the managed identity. |
      | Image name | Select an existing managed image from the list or select **Create a managed image**. |
      | Location | Select the Azure region from the list for the managed image. |
      | Run output name | Enter a run output name for the image. This is a free text field. |

   - For Azure Computer Gallery, complete the following information:

      | Parameter | Value/Description |
      |--|--|
      | Gallery name | Select the Azure Compute Gallery you want to distribute the image to from the list. |
      | Gallery image definition | Select the Gallery image definition you want to use from the list. |
      | Gallery image version | *Optional* Enter a version number for the image. If you don't Enter a value, one is generated automatically. |
      | Run output name | Enter a run output name for the image. This is a free text field. |
      | Replicated regions | Select which Azure regions to store and replicate the image. The region you selected for the custom image template is automatically selected. |
      | Excluded from latest | Select **Yes** to prevent this image version from being used where you specify `latest` as the version of the [*ImageReference* element](/azure/templates/microsoft.compute/virtualmachines?pivots=deployment-language-arm-template#imagereference-1) when you create a VM. Otherwise, select **No**.<br /><br />To change this later, see [List, update, and delete gallery resources](../virtual-machines/update-image-resources.md). |
      | Storage account type | Select the storage account [type](../storage/common/storage-account-overview.md) and [redundancy](../storage/common/storage-redundancy.md) from the list. |

   Once you've completed this tab, select **Next**.

1. On the **Build properties** tab, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | Build timeout (minutes) | Enter the [maximum duration to wait](../virtual-machines/linux/image-builder-json.md#properties-buildtimeoutinminutes) while building the image template (includes all customizations, validations, and distributions). |
   | Build VM size | Select a size for the temporary VM created and used to build the template. You need to select a [VM size that matches the generation](../virtual-machines/generation-2.md) of your source image. |
   | OS disk size (GB) | Select the resource group you assigned the managed identity to.<br /><br />Alternatively, if you assigned the managed identity to the subscription, you can create a new resource group here. |
   | Staging group | Enter a name for a new resource group you want Azure Image Builder to use to create the Azure resources it needs to create the image. If you leave this blank Azure Image Builder creates its own default resource group. |
   | Build VM managed identity | Select a user-assigned managed identity if you want the build VM to authenticate with other Azure services. For more information, see [User-assigned identity for the Image Builder Build VM](../virtual-machines/linux/image-builder-json.md#user-assigned-identity-for-the-image-builder-build-vm). |
   | Virtual network | Select an existing virtual network for the VM used to build the template. If you don't select an existing virtual network, a temporary one is created, along with a public IP address for the temporary VM. |
   | Subnet | If you selected an existing virtual network, select a subnet from the list. |

   Once you've completed this tab, select **Next**.

1. On the **Customizations** tab, you can add built-in scripts or your own scripts that run when building the image.

   To add a built-in script:

   1. Select **+Add built-in script**.

   1. Select the scripts you want to use from the list, and complete any required information. Built-in scripts include restarts where needed.
   
   1. Select **Save**.
   
   To add your own script:

   1. Select **+Add your own script**.

   1. Enter a name for your script and the Uniform Resource Identifier (URI) for your script. This needs to be a publicly available location, such as GitHub, a web service, or your own storage account. To use a storage account, you need to assign the managed identity an appropriate RBAC role, such as **Storage Blob Data Reader**.
   
   1. Select **Save**. You can repeat these steps for each of your own scripts you want to add.

   You can change the order the scripts run by selecting **Move up**, **Move down**, **Move to top**, or **Move to bottom**. Once you've completed this tab, select **Next**.

1. On the **Tags** tab, enter any name and value pairs you can use to help organize your resources, then select **Next**. A default tag of `AVD_IMAGE_TEMPLATE : AVD_IMAGE_TEMPLATE` is automatically created. For more information, see [Resource naming and tagging decision guide](/azure/cloud-adoption-framework/decision-guides/resource-tagging/).

1. On the **Review and create** tab, review the information that is used during deployment, then select **Create**.

> [!TIP]
> The new template may take about 20 seconds to appear. From **Custom images templates**, select **Refresh** to check the status.

### Build the image

Once your custom image template has been successfully created, you need to build the custom image. To build the custom image using the Azure portal:

1. From **Custom images templates**, check the box for the custom image template you want to build.

1. Select **Start build**. The image starts to be built. The time it takes to complete depends on how long it takes any built-in scripts and your own scripts to complete.

1. Select **Refresh** to check the status. You can see more information on the build status by selecting the name of the custom image template where you can see the **Build run state**.

## Create a host pool with session hosts using the custom image

Now you've created a custom image, you can use it when creating session host VMs. If you want to create a host pool and session hosts from Azure Virtual Desktop using the Azure portal, follow the steps in [Create a host pool](create-host-pool.md). For the **Virtual Machines** tab, if you add virtual machines, follow these steps to use your custom image:

1. For **Image**, select **See all images**.

1. Select **My Items**.

1. Select **My Images** to see a list of managed images, or select **Shared Images** to see a list of images in Azure Compute Gallery. 

   > [!IMPORTANT]
   > When selecting a virtual machine size, you will need to select a [size that matches the generation](../virtual-machines/generation-2.md) of your source image.

1. Complete the steps to create a host pool and session hosts from your custom image.

## Next steps

[Connect to Azure Virtual Desktop](users/remote-desktop-clients-overview.md?toc=%2Fazure%2Fvirtual-desktop%2Ftoc.json)
