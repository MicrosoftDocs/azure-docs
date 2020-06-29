---
author: cynthn
ms.author: cynthn
ms.date: 05/15/2020
ms.topic: include
ms.service: virtual-machines-linux
manager: gwallace
---

Standardized virtual machine (VM) images allow organizations to migrate to the cloud and ensure consistency in the deployments. Images typically include predefined security and configuration settings and necessary software. Setting up your own imaging pipeline requires time, infrastructure and setup, but with Azure VM Image Builder, just provide a simple configuration describing your image, submit it to the service, and the image is built, and distributed.
 
The Azure VM Image Builder (Azure Image Builder) lets you start with a Windows or Linux-based Azure Marketplace image, existing custom images or Red Hat Enterprise Linux (RHEL) ISO and begin to add your own customizations. Because the Image Builder is built on [HashiCorp Packer](https://packer.io/), you can also import your existing Packer shell provisioner scripts. You can also specify where you would like your images hosted, in the [Azure Shared Image Gallery](https://docs.microsoft.com/azure/virtual-machines/windows/shared-image-galleries), as a managed image or a VHD.

> [!IMPORTANT]
> Azure Image Builder is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Preview features

For the preview, these features are supported:

- Creation of golden baseline images, that includes your minimum security and corporate configurations, and allow departments to customize it further for their needs.
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

RHEL ISOs support is no longer supported.
## How it works


![Conceptual drawing of Azure Image Builder](./media/virtual-machines-image-builder-overview/image-builder.png)

The Azure Image Builder is a fully managed Azure service that is accessible by an Azure resource provider. The Azure Image Builder process has three main parts: source, customize and distribute, these are represented in a template. The diagram below shows the components, with some of their properties. 
 


**Image Builder process** 

![Conceptual drawing of the Azure Image Builder process](./media/virtual-machines-image-builder-overview/image-builder-process.png)

1. Create the Image Template as a .json file. This .json file contains information about the image source, customizations, and distribution. There are multiple examples in the [Azure Image Builder GitHub repository](https://github.com/danielsollondon/azvmimagebuilder/tree/master/quickquickstarts).
1. Submit it to the service, this will create an Image Template artifact in the resource group you specify. In the background, Image Builder will download the source image or ISO, and scripts as needed. These are stored in a separate resource group that is automatically created in your subscription, in the format: IT_\<DestinationResourceGroup>_\<TemplateName>. 
1. Once the Image Template is created, you can then build the image. In the background Image Builder uses the template and source files to create a VM (default size: Standard_D1_v2), network, public IP, NSG, and storage in the IT_\<DestinationResourceGroup>_\<TemplateName> resource group.
1. As part of the image creation, Image builder distributes the image according to the template, then deletes the additional resources in the IT_\<DestinationResourceGroup>_\<TemplateName> resource group that was created for the process.


## Permissions
When you register for the (AIB), this grants the AIB Service permission to create, manage and delete a staging resource group (IT_*), and have rights to add resources to it, that are required for the image build. This is done by an AIB Service Principal Name (SPN) being made available in your subscription during a successful registration.

To allow Azure VM Image Builder to distribute images to either the managed images or to a Shared Image Gallery, you will need to create an Azure user-assigned identity that has permissions to read and write images. If you are accessing Azure storage, then this will need permissions to read private containers.

Initially you must follow [create Azure user-assigned managed identity](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-cli) documentation on how to create an identity.

Once you have the identity you need to grant it permissions, to do this, you can use an Azure Custom Role Definition, and then assign the user-assigned managed identity to use the Custom Role Definition.

Permissions are explained in more detail [here](https://github.com/danielsollondon/azvmimagebuilder/blob/master/aibPermissions.md#azure-vm-image-builder-permissions-explained-and-requirements), and the examples show how this is implemented.

> [!Note]
> Previously with AIB, you would use the AIB SPN, and grant the SPN permissions to the image resource groups. We are moving away from this model, to allow for future capabilities. From 26th May 2020, Image Builder will not accept templates that do not have a user-assigned identity, existing templates will need to be resubmitted to the service with a [user-identity](https://docs.microsoft.com/azure/virtual-machines/linux/image-builder-json?toc=%2Fazure%2Fvirtual-machines%2Fwindows%2Ftoc.json&bc=%2Fazure%2Fvirtual-machines%2Fwindows%2Fbreadcrumb%2Ftoc.json#identity). The examples here already show how you can create a user-assigned identity and add them to a template. For more information please review this [documentation](https://github.com/danielsollondon/azvmimagebuilder#service-updates-and-latest-release-information) on this change and releases updates.

## Costs
You will incur some compute, networking and storage costs when creating, building and storing images with Azure Image Builder. These costs are similar to the costs incurred in manually creating custom images. For the resources, you will be charged at your Azure rates. 

During the image creation process, files are downloaded and stored in the `IT_<DestinationResourceGroup>_<TemplateName>` resource group, which will incur a small storage costs. If you do not want to keep these, delete the **Image Template** after the image build.
 
Image Builder creates a VM using a D1v2 VM size, and the storage, and networking needed for the VM. These resources will last for the duration of the build process, and will be deleted once Image Builder has finished creating the image. 
 
Azure Image Builder will distribute the image to your chosen regions, which might incur network egress charges.
 
## Next steps 
 
To try out the Azure Image Builder, see the articles for building [Linux](../articles/virtual-machines/linux/image-builder.md) or [Windows](../articles/virtual-machines/windows/image-builder.md) images.
 
