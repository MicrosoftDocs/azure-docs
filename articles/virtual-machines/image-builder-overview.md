---
title: Learn about Azure Image Builder (preview)
description: Learn more about Azure Image Builder for virtual machines in Azure.
author: danielsollondon
ms.author: danis
ms.date: 03/05/2021
ms.topic: conceptual
ms.service: virtual-machines
ms.subservice: image-builder
ms.custom: references_regions
ms.reviewer: cynthn
---

# Preview: Azure Image Builder overview

Standardized virtual machine (VM) images allow organizations to migrate to the cloud and ensure consistency in the deployments. Images typically include predefined security and configuration settings and necessary software. Setting up your own imaging pipeline requires time, infrastructure and setup, but with Azure VM Image Builder, just provide a configuration describing your image, submit it to the service, and the image is built, and distributed.
 
The Azure VM Image Builder (Azure Image Builder) lets you start with a Windows or Linux-based Azure Marketplace image, existing custom images and begin to add your own customizations. Because the Image Builder is built on [HashiCorp Packer](https://packer.io/) you will see some similarities, but have the benefit of a managed service. You can also specify where you would like your images hosted, in the [Azure Shared Image Gallery](shared-image-galleries.md), as a managed image or a VHD.

> [!IMPORTANT]
> Azure Image Builder is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Preview features

For the preview, these features are supported:

- Creation of baseline images, that includes your minimum security and corporate configurations, and allow departments to customize it further.
- Integration of core applications, so VM can take on workloads after creation, or add configurations to support Windows Virtual Desktop images.
- Patching of existing images, Image Builder will allow you to continually patch existing custom images.
- Connect image builder to your existing virtual networks, so you can connect to existing configuration servers (DSC, Chef, Puppet etc.), file shares, or any other routable servers/services.
- Integration with the Azure Shared Image Gallery, allows you to distribute, version, and scale images globally, and gives you an image management system.
- Integration with existing image build pipelines, just call Image Builder from your pipeline, or use the simple Preview Image Builder Azure DevOps Task.
- Migrate an existing image customization pipeline to Azure. Use your existing scripts, commands, and processes to customize images.
- Creation of images in VHD format to support Azure Stack.
 

## Regions
The Azure Image Builder Service will be available for preview in these regions. Images can be distributed outside of these regions.
- East US
- East US 2
- West Central US
- West US
- West US 2
- North Europe
- West Europe

## OS support
AIB will support Azure Marketplace base OS images:
- Ubuntu 18.04
- Ubuntu 16.04
- RHEL 7.6, 7.7
- CentOS 7.6, 7.7
- SLES 12 SP4
- SLES 15, SLES 15 SP1
- Windows 10 RS5 Enterprise/Enterprise multi-session/Professional
- Windows 2016
- Windows 2019

## How it works

The Azure VM Image Builder is a fully managed Azure service that is accessible by an Azure resource provider. Provide a configuration to the service that specifies the source image, customization to perform and where the new image is to be distributed to, the diagram below shows a high level workflow:

![Conceptual drawing of the Azure Image Builder process showing the sources (Windows/Linux), customizations (Shell, PowerShell, Windows Restart & Update, adding files) and global distribution with the Azure Shared Image Gallery](./media/image-builder-overview/image-builder-flow.png)

Template configurations can be passed using PowerShell, Az CLI, ARM templates and using the Azure VM Image Builder DevOps task, when you submit it to the service we will create an Image Template Resource. When the Image Template Resource is created you will see a staging resource group created in your subscription, in the format: IT_\<DestinationResourceGroup>_\<TemplateName>_\(GUID). The staging resource group contains files and scripts referenced in the File, Shell, PowerShell customization in the ScriptURI property.

To run the build you will invoke `Run` on the Image Template resource, the service will then deploy additional resources for the build, such as a VM, Network, Disk, Network Adapter etc. If you build an image without using an existing VNET Image Builder will also deploy a Public IP and NSG, the service connects to the build VM using SSH or WinRM. If you select an existing VNET, then the service will deploy using Azure Private Link, and a Public IP address is not required, for more details on Image Builder networking review the [details](./linux/image-builder-networking.md).

When the build finishes all resources will be deleted, except for the staging resource group and the storage account, to remove these you will delete the Image Template resource, or you can leave them there to run the build again.

There are multiple examples and step by step guides in this documentation, which reference configuration templates and solutions in the [Azure Image Builder GitHub repository](https://github.com/azure/azvmimagebuilder).

### Move Support
The image template resource is immutable and contains links to resources and the staging resource group, therefore the resource type does not support being moved. If you wish to move the image template resource, ensure you have a copy of the configuration template (extract the existing configuration from the resource if you don't have it), create a new image template resource in the new resource group with a new name and delete the previous image template resource. 

## Permissions
When you register for the (AIB), this grants the AIB Service permission to create, manage and delete a staging resource group (IT_*), and have rights to add resources to it, that are required for the image build. This is done by an AIB Service Principal Name (SPN) being made available in your subscription during a successful registration.

To allow Azure VM Image Builder to distribute images to either the managed images or to a Shared Image Gallery, you will need to create an Azure user-assigned identity that has permissions to read and write images. If you are accessing Azure storage, then this will need permissions to read private and public containers.

Permissions are explained in more detail for [PowerShell](./linux/image-builder-permissions-powershell.md), and [AZ CLI](./linux/image-builder-permissions-cli.md).

## Costs
You will incur some compute, networking and storage costs when creating, building and storing images with Azure Image Builder. These costs are similar to the costs incurred in manually creating custom images. For the resources, you will be charged at your Azure rates. 

During the image creation process, files are downloaded and stored in the `IT_<DestinationResourceGroup>_<TemplateName>` resource group, which will incur a small storage costs. If you do not want to keep these, delete the **Image Template** after the image build.
 
Image Builder creates a VM using a D1v2 VM size, and the storage, and networking needed for the VM. These resources will last for the duration of the build process, and will be deleted once Image Builder has finished creating the image. 
 
Azure Image Builder will distribute the image to your chosen regions, which might incur network egress charges.

## Hyper-V generation
Image Builder currently only natively supports creating Hyper-V generation (Gen1) 1 images to the Azure Shared Image Gallery (SIG) or Managed Image. 
 
## Next steps 
 
To try out the Azure Image Builder, see the articles for building [Linux](./linux/image-builder.md) or [Windows](./windows/image-builder.md) images.