---
title: Overview of creating Linux images for Azure
description: How to bring your Linux VM images or create new images to use in Azure.
author: danielsollondon
ms.service: virtual-machines-linux
ms.subservice: imaging
ms.topic: overview
ms.workload: infrastructure
ms.date: 06/22/2020
ms.author: danis
ms.reviewer: cynthn

---

# Bringing and creating Linux images in Azure

This overview covers the basic concepts around imaging and how to successfully build and use Linux images in Azure. Before you bring a custom image to Azure, you need to be aware of the types and options available to you.

This article will talk through the image decision points and requirements, explain key concepts, so that you can follow this, and be able to create your own custom images to your specification.

## Difference between managed disks and images


Azure allows you to bring a VHD to the platform, to use as a [Managed Disk](../faq-for-disks.md#managed-disks), or use as a source for an image. 

Azure managed disks are single VHDs. You can either take an existing VHD and create a managed disk from it, or create an empty managed disk from scratch. You can create VMs from managed disks by attaching the disk to the VM, but you can only use a VHD with one VM. You can't modify any OS properties, Azure will just try to turn on the VM and start up using that disk. 

Azure images can be made up of multiple OS disks and data disks. When you use a managed image to create a VM, the platform makes a copy of the image and uses that to create the VM, so managed image support reusing the same image for multiple VMs. Azure also provides advanced management capabilities for images, like global replication, and versioning through [Shared Image Gallery](shared-image-galleries.md). 



## Generalized and specialized

Azure offers two main image types, generalized and specialized. The terms generalized and specialized are originally Windows terms, which migrated in to Azure. These types define how the platform will handle the VM when it turns it on. Both types have advantages and disadvantages, and prerequisites. Before you get started, you need to know what image type you will need. Below summarizes the scenarios and type you would need to choose:

| Scenario      | Image type  | Storage options |
| ------------- |:-------------:| :-------------:| 
| Create an image that can be configured for use by multiple VMs, and I can set the hostname, add an admin user and perform other tasks during first boot. | Generalized | Shared Image Gallery or stand-alone managed images |
| Create an image from a VM snapshot, or a backup | Specialized |Shared Image Gallery or a managed disk |
| Quickly create an image that does not need any configuration for creating multiple VMs |Specialized |Shared Image Gallery |


### Generalized images

A generalized image is an image that requires setup to be completed on first boot. For example, on first boot you set the hostname, admin user and other VM-specific configurations. This is useful when you want the image to be reused multiple times, and when you want to pass in parameters during creation. If the generalized image contains the Azure agent, the agent will process the parameters, and signal back to the platform that the initial configuration has completed. This process is called [provisioning](./provisioning.md). 

Provisioning requires that a provisioner is included in the image. There are two provisioners:
- [Azure Linux Agent](../extensions/agent-linux.md)
- [cloud-init](./using-cloud-init.md)

These are [prerequisites](./create-upload-generic.md) for creating an image.


### Specialized images
These are images that are completely configured and not require VM and special parameters, the platform will just turn the VM on, you need handle uniqueness within the VM, like setting a hostname, to avoid DNS conflicts on the same VNET. 

Provisioning agents are not required for these images, however, you may want to have extension handling capabilities. You can install the Linux Agent, but disable the provisioning option. Even though you do not need a provisioning agent, the image must fulfill [prerequisites](./create-upload-generic.md)  for Azure Images.


## Image storage options
When bringing your Linux image you have two options:

- Managed images for simple VM creation in a development and test environment.
- [Shared Image Gallery](shared-image-galleries.md) for creating and sharing images at-scale.


### Managed images

Managed images can be used to create multiple VMs, but they have a lot of limitations. Managed images can only be created from a generalized source (VM or VHD). They can only be used to create VMs in the same region and they can't be shared across subscriptions and tenants.

Managed images can be used for development and test environments, where you need a couple of simple generalized images to use within single region and subscription. 

### Azure Shared Image Gallery (SIG)

[Shared Image Galleries](shared-image-galleries.md) are recommended for creating, managing and sharing images at scale. Shared image galleries help you build structure and organization around your images.  

- Support for both generalized and specialized images.
- Support for image both generation 1 and 2 images.
- Global replication of images.
- Versioning and grouping of images for easier management.
- Highly available images with Zone Redundant Storage (ZRS), in regions that support Availability Zones. ZRS offers better resilience against zonal failures.
- Sharing across subscriptions, and even between Active Directory (AD) tenants, using RBAC.
- Scaling your deployments with image replicas in each region.

At a high level, you create a SIG, and it is made up of:
- Image Definitions - These are containers that hold groups of images.
- Image Versions - These are the actual images



## Hyper-V generation

Azure supports Hyper-V Generation 1 (Gen1) and Generation 2 (Gen2), Gen2 is the latest generation, and offers additional functionality over Gen1. For example: increased memory, Intel Software Guard Extensions (Intel SGX), and virtualized persistent memory (vPMEM). Generation 2 VMs running on-premises, have some features that aren't supported in Azure yet. For more information, see the Features and capabilities section. For more information see this [article](../generation-2.md). Create Gen2 images if you require the additional functionality.

If you still need to create your own image, ensure it meets the [image prerequisites](./create-upload-generic.md), and upload to Azure. Distribution specific requirements:


- [CentOS-based Distributions](create-upload-centos.md)
- [Debian Linux](debian-create-upload-vhd.md)
- [Flatcar Container Linux](flatcar-create-upload-vhd.md)
- [Oracle Linux](oracle-create-upload-vhd.md)
- [Red Hat Enterprise Linux](redhat-create-upload-vhd.md)
- [SLES & openSUSE](suse-create-upload-vhd.md)
- [Ubuntu](create-upload-ubuntu.md)


## Next steps

Learn how to create a [Shared Image Gallery](tutorial-custom-images.md).