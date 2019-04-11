---
author: cynthn
ms.author: cynthn
ms.date: 3/22/2019
ms.topic: include
ms.service: virtual-machines-linux
manager: jeconnoc
---

Creating standardized virtual machine (VM) images allows organizations to migrate to the cloud and ensure consistency in the deployments. Images typically include predefined security and configuration settings and necessary software. Setting up your own image build pipeline requires infrastructure and setup, but with Azure VM Image Builder, you can take an ISO or Azure Marketplace image and start creating your own golden images in a few steps.
 
The Azure VM Image Builder (Azure Image Builder) lets you start with either a Windows or Linux-based Azure Marketplace VM or Red Hat Enterprise Linux (RHEL) ISO and begin to add your own customizations. Your customizations can be added in the documented customizations in this document, and because the VM Image Builder is built on HashiCorp Packer (https://packer.io/), you can also import your existing Packer shell provisioner scripts. As the last step, you specify where you would like your images hosted, either in the Azure Shared Image Gallery (https://docs.microsoft.com/en-us/azure/virtual-machines/windows/shared-image-galleries) or as an Azure Managed Image. See below for a quick video on how to create a custom image using the VM Image Builder.
 
## Preview feature support
For the preview, we are supporting these key features:

- Migrating an existing image customization pipeline to Azure  o Use existing scripts, commands.
- Creating golden custom images, update, and then customize them further for specific uses.
- Image management and distribution, through integration with Azure Shared Image Gallery.
- Integration with existing CI/CD pipeline. Simplify image customization as an integral part of your application build and release process as shown below.
- Create images in VHD format.
- Red Hat Bring Your Own Subscription support. Create Red Hat Enterprise Images for use with your eligible, unused Red Hat subscriptions.

## Regions
The Azure Image Builder Service will be available for preview in these regions, however, images can be distributed outside of these regions.
- East US
- East US 2
- West Central US
- West US
- West US 2

## Pipeline


The Azure Image Builder is a fully managed Azure service that is accessible by an Azure first party resource provider.  
 
The diagram below shows the end to end Azure Image Builder pipeline, where you can see the three main components, source, customize and distribute, with their inputs and outputs. 

![Conceptual drawing of the image builder pipeline](/media/virtual-machines-image-builder-overview/pipelines.png)

The pipeline steps are defined in a configuration template that is used by the service, then stored as an ImageTemplate. 
 
For the Azure Image Builder to stand up the pipeline requires an invocation call into the Azure Image Builder service referencing a stored template.

![Conceptual drawing of the submit and run command processes](/media/virtual-machines-image-builder-overview/submit-run.png)

1. Create the Image Template. 
1. Submit the Image Template. Azure Image Builder will download the RHEL ISO, and shell scripts needed, and store these in a resource group that is automatically created in your subscription, in this format: ‘IT_<DestinationResourceGroup>_<TemplateName>’. This will be removed when the Image Template artifact is deleted. You will also see the template artifact, that references these in the resource group referenced when creating the image template.
1. Create the image. Azure Image Builder will take the template, then stand up a pipeline to create it, by standing up a VM, network, and storage in the automatically created resource group, ‘IT_<DestinationResourceGroup>_<TemplateName>’. 


## Costs
You will incur some compute, networking and storage costs when creating, building and storing images with Azure Image Builder. These costs are similar to the costs incurred in manually creating custom images. For the resources, you will be charged at your Azure rates. 

- When you create an Image Template, automatically the Azure Image Builder creates a resource group, in the format, ‘IT_<DestinationResourceGroup>_<TemplateName>’, at this time the RHEL ISO and shell scripts will be stored until the Image Template is deleted, therefore you will incur small storage costs. Do not delete or modify this resource group, delete the Image Template artifact. 
 
- When you invoke Azure Image Builder to build an image, it will stand up a D1v2 VM, storage, and networking for it, these will last the time of the image build process, and will be deleted once Azure Image Builder has finished creating the image. 
 
- Azure Image Builder will distribute the image to your chosen regions, this will be backed by Azure storage.


 
## Next steps 
 
There are sample .json files for different scenarios in the [Azure Image Builder GitHub](https://github.com/danielsollondon/azvmimagebuilder).
 
 
