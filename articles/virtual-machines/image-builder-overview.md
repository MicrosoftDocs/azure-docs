---
title: Learn about Azure Image Builder 
description: Learn more about Azure Image Builder for virtual machines in Azure.
author: sumit-kalra
ms.author: sukalra
ms.date: 10/15/2021
ms.topic: conceptual
ms.service: virtual-machines
ms.subservice: image-builder
ms.custom: references_regions
ms.reviewer: cynthn
---

# Azure Image Builder overview

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

Standardized virtual machine (VM) images allow organizations to migrate to the cloud and ensure consistency in their deployments. Images typically include predefined security, configuration settings, and necessary software. Setting up your own imaging pipeline requires time, infrastructure, and setup. With Azure VM Image Builder (Image Builder), you just need to create a configuration describing your image and submit it to the service where the image is built and then distributed.

With Image Builder, you can migrate your existing image customization pipeline to Azure while continuing to use existing scripts, commands, and processes to customize images. Using Image Builder, you can integrate your core applications into a VM image so your VMs can take on workloads at once after creation. You can even add configurations to build images for Azure Virtual Desktop or as VHDs for use in Azure Stack or for ease of exporting.

Image Builder lets you start with Windows or Linux images, from the Azure Marketplace or existing custom images, and add your own customizations. You can also specify where you would like your resulting images hosted in the [Azure Compute Gallery](shared-image-galleries.md) (formerly known as Shared Image Gallery), as a managed image or as a VHD.

## Features

While it is possible to create custom VM images by hand or by other tools, the process can be cumbersome and unreliable. Azure VM Image Builder, which is built on [HashiCorp Packer](https://www.packer.io/), provides you with benefits of a managed service.

### Simplicity

- Removes the need to use complex tooling, processes, and manual steps for creating a VM image. Image Builder abstracts out all these details and hides away Azure specific requirements like the need to generalize the image (sysprep) while also giving more advanced users the ability to override them.
- Image Builder can integrate with existing image build pipelines for a click-and-go experience. You can just call Image Builder from your pipeline, or use the [Azure Image Builder Service DevOps Task (preview)](./linux/image-builder-devops-task.md).
- Image Builder can fetch customization data from various sources removing the need to collect them all together in one place to build a VM image.
- Integration of Image Builder with the Azure Compute Gallery gives you an image management system that allows you to distribute, replicate, version, and scale images globally. Additionally, you can distribute the same resulting image as a VHD, or as one or more managed images without rebuilding from scratch.

### Infrastructure As Code

- There is no need to manage long-term infrastructure (*like Storage Accounts to hold customization data*) or transient infrastructure (*like temporary Virtual Machine to build the image*). 
- Image Builder stores your VM image build specification and customization artifacts as Azure resources removing the need of maintaining offline definitions and the risk of environment drifts caused by accidental deletions or updates.

### Security

- Image Builder enables creation of baseline images (*which can include your minimum security and corporate configurations*) and allows different departments to customize it further. These images can be kept secure and compliant by using Image Builder to quickly rebuild a golden image using the latest patched version of a source image. Image Builder also makes it easier for you to build images that meet the Azure Windows Baseline. For more information, see [Image Builder - Windows baseline template](https://github.com/Azure/azure-quickstart-templates/tree/master/demos/imagebuilder-windowsbaseline).
- You do not have to make your customization artifacts publicly accessible for Image Builder to be able to fetch them. Image Builder can use your [Azure Managed Identity](../active-directory/managed-identities-azure-resources/overview.md) to fetch these resources and you can restrict the privileges of this identity as tightly as required using Azure-RBAC. This not only means you can keep your artifacts secret, but they also cannot be tampered with by unauthorized actors.
- Copies of customization artifacts, transient compute & storage resources, and resulting images are all stored securely within your subscription with access controlled by Azure-RBAC. This includes the build VM used to create the customized image and ensuring your customization scripts and files are not being copied to an unknown VM in an unknown subscription. Furthermore, you can achieve a high degree of isolation from other customers’ workloads using [Isolated VM offerings](./isolation.md) for the build VM.
- You can connect Image Builder to your existing virtual networks so you can communicate with existing configuration servers (DSC, Chef, Puppet, etc.), file shares, or any other routable servers & services.

## Regions

The Azure Image Builder Service is available in the following regions: regions. 

>[!NOTE]
> Images can still be distributed outside of these regions.
> 
- East US
- East US 2
- West Central US
- West US
- West US 2
- West US 3
- South Central US
- North Europe
- West Europe
- South East Asia
- Australia Southeast
- Australia East
- UK South
- UK West

## OS support
Azure Image Builder will support Azure Marketplace base OS images:
- Ubuntu 18.04
- Ubuntu 16.04
- RHEL 7.6, 7.7
- CentOS 7.6, 7.7
- SLES 12 SP4
- SLES 15, SLES 15 SP1
- Windows 10 RS5 Enterprise/Enterprise multi-session/Professional
- Windows 2016
- Windows 2019

>[!IMPORTANT]
> Listed operating systems have been tested and now work with Azure Image Builder. However, Azure Image Builder should work with any Linux or Windows image in the marketplace.

## How it works

The Azure VM Image Builder is a fully managed Azure service that is accessible by an Azure resource provider. Provide a configuration to the service that specifies the source image, customization to perform and where the new image is to be distributed to, the diagram below shows a high-level workflow:

![Conceptual drawing of the Azure Image Builder process showing the sources (Windows/Linux), customizations (Shell, PowerShell, Windows Restart & Update, adding files) and global distribution with the Azure Compute Gallery](./media/image-builder-overview/image-builder-flow.png)

Template configurations can be passed using PowerShell, Azure CLI, Azure Resource Manager templates and using the Azure VM Image Builder DevOps task, when you submit it to the service we will create an Image Template Resource. When the Image Template Resource is created you will see a staging resource group created in your subscription, in the format: `IT_\<DestinationResourceGroup>_\<TemplateName>_\(GUID)`. The staging resource group contains files and scripts referenced in the File, Shell, PowerShell customization in the ScriptURI property.

To run the build you will invoke `Run` on the Image Template resource, the service will then deploy additional resources for the build, such as a VM, Network, Disk, Network Adapter etc. If you build an image without using an existing VNET Image Builder will also deploy a Public IP and NSG, the service connects to the build VM using SSH or WinRM. If you select an existing VNET, then the service will deploy using Azure Private Link, and a Public IP address is not required, for more details, see [Image Builder networking overview](./linux/image-builder-networking.md).

When the build finishes all resources will be deleted, except for the staging resource group and the storage account, to remove these you will delete the Image Template resource, or you can leave them there to run the build again.

There are multiple examples and step-by-step guides in this documentation, which reference configuration templates and solutions in the [Azure Image Builder GitHub repository](https://github.com/azure/azvmimagebuilder).

### Move Support
The image template resource is immutable and contains links to resources and the staging resource group, therefore the resource type does not support being moved. If you wish to move the image template resource, ensure you have a copy of the configuration template (extract the existing configuration from the resource if you don't have it), create a new image template resource in the new resource group with a new name and delete the previous image template resource. 

## Permissions
When you register for the (AIB), this grants the AIB Service permission to create, manage and delete a staging resource group `(IT_*)`, and have rights to add resources to it, that are required for the image build. This is done by an AIB Service Principal Name (SPN) being made available in your subscription during a successful registration.

To allow Azure VM Image Builder to distribute images to either the managed images or to an Azure Compute Gallery, you will need to create an Azure user-assigned identity that has permissions to read and write images. If you are accessing Azure storage, then this will need permissions to read private and public containers.

In API version 2021-10-01 and beyond, Azure VM Image Builder supports adding Azure user-assigned identities to the build VM to enable scenarios where you will need to authenticate with services like Azure Key Vault in your subscription.

For more information on permissions, please see the following links: [PowerShell](./linux/image-builder-permissions-powershell.md), [AZ CLI](./linux/image-builder-permissions-cli.md) and [Image Builder template reference: Identity](https://docs.microsoft.com/azure/virtual-machines/linux/image-builder-json#identity). 

## Costs
You will incur some compute, networking and storage costs when creating, building and storing images with Azure Image Builder. These costs are similar to the costs incurred in manually creating custom images. For the resources, you will be charged at your Azure rates. 

During the image creation process, files are downloaded and stored in the `IT_<DestinationResourceGroup>_<TemplateName>` resource group, which will incur a small storage costs. If you do not want to keep these, delete the **Image Template** after the image build.
 
Image Builder creates a VM using the default D1v2 VM size for Gen1 images and D2ds V4 for Gen2 images, along with the storage, and networking needed for the VM. These resources last for the duration of the build process and are deleted once Image Builder has finished creating the image. 
 
Azure Image Builder will distribute the image to your chosen regions, which might incur network egress charges.

## Hyper-V generation
Image Builder currently supports creating Hyper-V Gen1 and Gen2 images in the Azure Compute Gallery and as managed images or VHD. Please keep in mind, the image distributed will always be the same generation as the image provided. 

For Gen2 images, please ensure you are using the correct SKU. For example, the SKU for a Ubuntu Server 18.04 Gen2 image would be “18_04-lts-gen2”. The SKU for a Ubuntu Server 18.04 Gen1 image would be "18.04-lts".

How to find SKUs based on the image publisher:
```azurecli-interactive
# Find all Gen2 SKUs published by Microsoft Windows Desktop
az vm image list --publisher MicrosoftWindowsDesktop --sku g2 --output table --all

# Find all Gen2 SKUs published by Canonical
az vm image list --publisher Canonical --sku gen2 --output table --all
```

For more information on which Azure VM images support Gen2, please visit: [Generation 2 VM images in Azure Marketplace
](https://docs.microsoft.com/azure/virtual-machines/generation-2)

## Next steps 
 
To try out the Azure Image Builder, see the articles for building [Linux](./linux/image-builder.md) or [Windows](./windows/image-builder.md) images.
