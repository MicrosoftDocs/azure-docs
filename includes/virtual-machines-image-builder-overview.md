---
author: cynthn
ms.author: cynthn
ms.date: 04/30/2019
ms.topic: include
ms.service: virtual-machines-linux
manager: jeconnoc
---

Standardized virtual machine (VM) images allow organizations to migrate to the cloud and ensure consistency in the deployments. Images typically include predefined security and configuration settings and necessary software. Setting up your own imaging pipeline requires infrastructure and setup, but with Azure VM Image Builder, you can take an ISO or Azure Marketplace image and start creating your own images in a few steps.
 
The Azure VM Image Builder (Azure Image Builder) lets you start with a Windows or Linux-based Azure Marketplace image, Shared Image Gallery image version or Red Hat Enterprise Linux (RHEL) ISO and begin to add your own customizations. Because the Image Builder is built on [HashiCorp Packer](https://packer.io/), you can also import your existing Packer shell provisioner scripts. You can also specify where you would like your images hosted, in the Azure Shared Image Gallery (https://docs.microsoft.com/azure/virtual-machines/windows/shared-image-galleries), as a managed image or a VHD.

## Preview features

For the preview, these features are supported:

- Migrate an existing image customization pipeline to Azure.  Use your existing scripts, commands, and processes to customize images.
- Create *golden* custom images, then update and customize them further for specific uses.
- Manage your image library and distribution, through integration with Azure Shared Image Gallery.
- Create images in VHD format.
- Use Red Hat **Bring Your Own Subscription** support. Create Red Hat Enterprise images for use with your eligible, unused Red Hat subscriptions.
- Integrate Image Builder with your existing CI/CD pipeline. Simplify image customization as an integral part of your application build and release process.
 

## Regions
The Azure Image Builder Service will be available for preview in these regions. Images can be distributed outside of these regions.
- East US
- East US 2
- West Central US
- West US
- West US 2

## How it works

The Azure Image Builder is a fully managed Azure service that is accessible by an Azure resource provider. The Azure Image Builder process has three main parts: source, customize and distribute. The process is defined in a configuration template that is used by the service, then stored as an ImageTemplate. 
 
![Conceptual drawing of Azure Image Builder](./media/virtual-machines-image-builder-overview/image-builder.png)


1. Create the ImageTemplate as a .json file and submit it to the service. Image Builder will download the source image or ISO, and scripts as needed. These are stored in a resource group that is automatically created in your subscription, in the format: `IT_<DestinationResourceGroup>_<TemplateName>`. 
1. Image Builder uses the template and source files to create a VM, network, and storage in the `IT_<DestinationResourceGroup>_<TemplateName>` resource group. 
1. Image builder creates an image and distributes it according to the template, then deletes the resource group that was created for the process.


## Costs
You will incur some compute, networking and storage costs when creating, building and storing images with Azure Image Builder. These costs are similar to the costs incurred in manually creating custom images. For the resources, you will be charged at your Azure rates. 

- During the image creation process, files are downloaded and stored in the `IT_<DestinationResourceGroup>_<TemplateName>` resource group, which will incur a small storage costs. 
 
- Image Builder creates a VM using a D1v2 VM size, and the storage, and networking needed for the VM. These resources will last for the duration of the build process, and will be deleted once Image Builder has finished creating the image. 
 
- Azure Image Builder will distribute the image to your chosen regions, which which might incur network egress charges.

 
## Next steps 
 
To try out the Azure Image Builder, see the articles for building [Linux](../articles/virtual-machines/linux/image-builder.md) or [Windows](../articles/virtual-machines/windows/image-builder.md) images.
 
 
