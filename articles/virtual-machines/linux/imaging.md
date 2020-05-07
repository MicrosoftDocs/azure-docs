---
title: Overview of creating Linux images for Azure
description: Overview of how to bring your Linux VM images or create new images to use in Azure.
author: danielsollondon
ms.service: virtual-machines-linux
ms.subservice: imaging
ms.topic: overview
ms.workload: infrastructure
ms.date: 05/04/2020
ms.author: danis
ms.reviewer: cynthn

---

# Bringing and creating Linux images in Azure

This overview covers the basic concepts around imaging and how to successfully build and use Linux images in Azure.

* Difference between Managed Disks vs Images
* Steps to bringing and creating a Linux custom image to Azure
* Image Types
    * Generalized images
    * Specialized images
* Image Storage Options
    * Azure Shared Image Gallery (SIG)
    * Managed Images
* HyperV Generation
* Building your own custom images in Azure
* Building your own custom images outside Azure

If you have a requirement to bring a custom images to Azure, you need to be aware of the types and options available to you.

This article will talk through the image decision points and requirements, explain key concepts, so that you can follow this, and be able to create your own custom images to your specification.

## Difference between managed disks and images
Azure allows you to bring a VHD to the platform, and either turn it into a [Managed Disk](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/faq-for-disks#managed-disks), or an [Image](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/shared-images). 

Azure managed disks are single VHDs. You can either take an existing VHD and create a managed disk from it, or create an empty managed disk from scratch. You can create VMs from managed disks by attaching the disk to the VM, but you can only use a VHD with one VM. You can't modify any OS properties, Azure will just try to turn on the VM and start up using that disk. 

Azure images can be made up of multiple OS disks and data disks. When you use a managed image to create a VM, the platform makes a copy of the image and uses that to create the VM, so managed images support reusing the same image for multiple VMs. Azure also provides advanced management capabilities for images, like global replication, and versioning. 


## Image Types
Azure offers two main image types, generalized and specialized. The terms generalized and specialized are originally Windows terms, which migrated in to Azure. These types define how the platform will handle the VM when it turns it on. Both types have advantages and disadvantages, and prerequisites. Before you get started, you need to know what image type you will need. Below summarizes the scenarios and type you would need to choose:

| Scenario      | Image Type  | Storage Options |
| ------------- |:-------------:| :-------------:| 
| Create an image that can be configured for use by multiple VMs, and I can set the hostname, add an admin user and perform other tasks during first boot. | Generalized | Shared Image Gallery or stand-alone managed images |
| Create an image from a VM snapshot, or a backup | Specialized |Shared Image Gallery or a managed disk |
| Quickly create an image that does not need any configuration for creating multiple VMs |Specialized |Shared Image Gallery |


### Generalized images
A generalized images is an image that requires setup to be completed on first boot. For example, on first boot you set the hostname, admin user and other VM specific configurations. This is useful when you want the image to be reused multiple times, and when you want to pass in parameters during creation. If the generalized image contains the Azure agent, the agent will process the parameters, and signal back to the platform that the initial configuration has completed. This process is called **provisioning**. 

To enable provisioning requires that a provisioning agent is baked into the image, this can be the [Azure Linux Agent](https://docs.microsoft.com/en-us/azure/virtual-machines/extensions/agent-linux), or [cloud-init](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/using-cloud-init). These are [prerequisites](<LINK>) of creating generalized images.

For more information on VM provisioning, please review this [provisioning article](./2_provisioning.md).

### Specialized images
These are images that are completely configured and not require VM Create parameters, the platform will just turn the VM on, you need handle uniqueness within the VM, such as setting hostname, to avoid DNS conflicts on the same VNET. 

Provisioning Agents are not required for these images, however, you may want to have extension handling capacility, if so, you can install the Linux Agent, and disable provisioning capabaility. Please review how to enable extension handling for an image [here](3a_DisableProvisioning.md). Even though you do not need a provisioning agent, the image must have the [prerequisites](<LINK>) for Azure Images.

## Image Storage Options
When bringing your Linux image you have two options:
1. Shared Image Gallery
2. Managed Images

### Azure Shared Image Gallery (SIG)
This should be your default option to create images, this service helps you build structure and organization around your managed images, for example it provides these features:
* Support for image types (generalized and specialized)
* Support for image [generation (Gen1 / Gen2)](Link to section below)
* Managed global replication of images.
* Versioning and grouping of images for easier management.
* Highly available images with Zone Redundant Storage (ZRS) accounts in regions that support Availability Zones. ZRS offers better resilience against zonal failures.
* Sharing across subscriptions, and even between Active Directory (AD) tenants, using RBAC.
* Scaling your deployments with image replicas in each region.

At a high level, you create a SIG, and it is made up of:
* Image Definitions - These are containers that hold groups of images.
* Image Versions - These are the actual images

*This is currently in preview for the Azure Shared Image Gallery (SIG), if you need a fully supported option to just bring an image and turn the VM on, please use Managed disks.

Example to create a SIG, SIG Definition:
```bash
# Create SIG  resource group
sigResourceGroup=aibsig

# name of the shared image gallery, e.g. myCorpGallery
sigName=my21stSIG

# name of the image definition to be created, e.g. ProdImages
imageDefName=ubuntu1804images

# create SIG
az sig create \
    -g $sigResourceGroup \
    --gallery-name $sigName

# create SIG image definition
az sig image-definition create \
   -g $sigResourceGroup \
   --gallery-name $sigName \
   --gallery-image-definition $imageDefName \
   --os-state Generalized \ #(Specialized or Generalized)
   <<<<<<<ADD GEN>>>
   --publisher corpIT \
   --offer myOffer \
   --sku 18.04-LTS \
   --os-type Linux

# create image version
az sig image-version create \
    -g $sigResourceGroup 
    --gallery-name $sigName 
    --gallery-image-definition $imageDefName 
    --gallery-image-version 1.0.0 
    --managed-image /subscriptions/00000000-0000-0000-0000-00000000xxxx/resourceGroups/imageGroups/providers/images/MyManagedImage
```
In the example, it creates a SIG version from a managed image, but this could be a OS disk Snapshot. Note, you cannot directly create a SIG version from a VHD or Managed Disk, to do this, create a Managed Image from and OS disk VHD URI or managed OS disk ID

### Managed Images
This allows you to store images, but only per region, and does not offer the benefits of SIG, or options of SIG image, such as specialized.

```bash
az image create 
    -g $imgResourceGroup \
    -n $imageName \
    --os-type Linux \
    --source <OS disk VHD URI or managed OS disk ID>
```

### HyperV Generation
Azure supports HyperV Generation 1 (Gen1) and Generation 2 (Gen2), Gen2 is the latest generation, and offers additional functionality over Gen1, for example increased memory, Intel Software Guard Extensions (Intel SGX), and virtualized persistent memory (vPMEM). Generation 2 VMs running on-premises, have some features that aren't supported in Azure yet. For more information, see the Features and capabilities section. For more information see this [article](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/generation-2). Create Gen2 images if you require the additional functionality.


## Building your own custom images
Whilst Azure allows you to create and upload an image you have created, you should consider using existing vanilla Azure images that existing in the Azure Market Place, as these are already configured and tested to run on Azure.

## Bringing custom image prerequisites <<<<<FINISH>>>>>
The primary cause of VMs failing to create from images is the OS image not satisfying prerequisites for running on Azure.

If you still need to create your own image, ensure it meets the [image prerequisites](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/create-upload-generic) below, and upload to Azure.
<<<<<<THESE NEED LINKING AND CHECKING>>>>>>

CentOS-based Distributions
Debian Linux
Oracle Linux
Red Hat Enterprise Linux
SLES & openSUSE
Ubuntu

## Building your own custom images

You have some options to build images, you can build them using exist modified pipelines, these may be on premise or in the cloud. 

Or you can use the Azure VM Image Builder, that builds custom images in Azure, these can be built from existing custom Images or Azure Market Place Images.

#### Building your own custom images and uploading them to Azure

If you are creating a custom image that you have uploaded, then you must ensure it meets the requirements for Azure. 

