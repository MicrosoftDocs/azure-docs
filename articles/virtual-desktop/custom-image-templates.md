---
title: Custom image templates - Azure Virtual Desktop
description: Learn about custom image templates in Azure Virtual Desktop, where you can create custom images that you can use when deploying session host virtual machines.
ms.topic: conceptual
author: dknappettmsft
ms.author: daknappe
ms.date: 09/08/2023
---

# Custom image templates in Azure Virtual Desktop

Custom image templates in Azure Virtual Desktop enable you to easily create a custom image that you can use when deploying session host virtual machines (VMs). Using custom images helps you to standardize the configuration of your session host VMs for your organization. Custom image templates are built on [Azure Image Builder](../virtual-machines/image-builder-overview.md) and tailored for Azure Virtual Desktop.

## Creation process

There are two parts to creating a custom image:

1. Create a custom image template that defines what should be in the resulting image.

1. Build the image from that custom image template, by submitting the template to Azure Image Builder.

A custom image template is a JSON file that contains your choices of source image, distribution targets, build properties, and customizations. Azure Image Builder uses this template to create a custom image, which you can use as the source image for your session hosts when creating or updating a host pool. When creating the image, Azure Image Builder also takes care of generalizing the image with sysprep.

Custom images can be stored in [Azure Compute Gallery](../virtual-machines/azure-compute-gallery.md) or as a [managed image](../virtual-machines/windows/capture-image-resource.md), or both. Azure Compute Gallery allows you to manage  region replication, versioning, and sharing of custom images.

The source image must be [supported for Azure Virtual Desktop](prerequisites.md#operating-systems-and-licenses) and can be from:

- Azure Marketplace.
- An existing Azure Compute Gallery shared image.
- An existing managed image.
- An existing custom image template.

We've added several built-in scripts available for you to use that configures some of the most popular features and settings when using Azure Virtual Desktop. You can also add your own custom scripts to the template, as long as they're hosted at a publicly available location, such as GitHub or a web service. You need to specify a duration for the build, so make sure you allow enough time for your scripts to complete. Built-in scripts include restarts where needed.

Here are some examples of the built-in scripts you can add to a custom image template:

- Install language packs.
- Set the default language of the operating system.
- Enable time zone redirection.
- Disable [Storage Sense](https://support.microsoft.com/windows/manage-drive-space-with-storage-sense-654f6ada-7bfc-45e5-966b-e24aded96ad5).
- Install [FSLogix](/fslogix/) and configure [Profile Container](/fslogix/profile-container-office-container-cncpt).
- Enable FSLogix with Kerberos.
- Enable [RDP Shortpath for managed networks](rdp-shortpath.md?tabs=managed-networks).
- Enable [screen capture protection](screen-capture-protection.md).
- Configure [Teams optimizations](teams-on-avd.md).
- Configure session timeouts.
- Add or remove Microsoft Office applications.
- Apply Windows Updates.

When the custom image is being created and distributed, Azure Image Builder uses a user-assigned managed identity. Azure Image Builder uses this managed identity to create several resources in your subscription, such as a resource group, a VM used to build the image, Key Vault, and a storage account. The VM needs internet access to download the built-in scripts or your own scripts that you added. The built-in scripts are stored in the *RDS-templates* GitHub repository at [https://github.com/Azure/RDS-Templates](https://github.com/Azure/RDS-Templates).

You can choose whether you want the VM to connect to an existing virtual network and subnet, which will enable the VM to have access to other resources you may have available to that virtual network. If you don't specify an existing virtual network, a temporary virtual network, subnet, and public IP address are created for use by the VM. For more information on networking options, see [Azure VM Image Builder networking options](../virtual-machines/linux/image-builder-networking.md).

### Resources

A resource group is created when the custom image template is created. The default name is in the format `IT_<ResourceGroupName>_<TemplateName>_<GUID>` and stores the resources required during the build. Most of these resources are temporary and are deleted after the build is complete, except the storage account.

In the storage account, up to three containers are created:

- **shell** is where customization scripts are stored, if you include any customization scripts in your custom image template.

- **packerlogs** has one or more folders named with a GUID, which contain a file called *customization.log*. This file contains all the outputs from the *Hashicorp Packer* service that Azure Image Builder uses. These outputs can be downloaded at any time to review the progress, errors and completion status.

- **vhds** temporarily stores the resulting virtual hard disk (VHD) file before being stored as a managed image or in Azure Compute Gallery.

The resource group `IT_<ResourceGroupName>_<TemplateName>_<GUID>` associated with your template can be deleted after the custom image has been created successfully, providing you don't need the logs. The resource group is also deleted if you delete the resource group containing your image.

## Next steps

- Learn how to [Create Custom image templates and custom images in Azure Virtual Desktop](create-custom-image-templates.md).
