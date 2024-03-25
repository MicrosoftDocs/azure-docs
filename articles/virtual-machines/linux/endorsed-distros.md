---
title: Linux distributions endorsed on Azure
description: Learn about Linux on Azure-endorsed distributions, including information about Ubuntu, CentOS, Oracle, Flatcar, Debian, Red Hat, and SUSE.
services: virtual-machines
author: srijang
ms.service: virtual-machines
ms.collection: linux
ms.topic: conceptual
ms.date: 08/02/2023
ms.author: srijangupta
ms.reviewer: cynthn
ms.custom: engagement-fy23
---

# Endorsed Linux distributions on Azure

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets 

In this article we will cover the following -
- Types of Images 
- Partners 
- Image Update Cadence 
- Azure-tuned Kernels 

There are several different sources of Linux VM images for Azure. Each source provides a different expectation for quality, utility and support. This document will summarize each source (marketplace images, platform images, custom images, and community gallery images). It will further provide more details about platform images which are images provided in partnership between Microsoft and several mainstream Linux publishers such as Red Hat, Canonical, and SUSE. 


Microsoft’s Linux distribution partners provide a multitude of Linux images in the Azure Marketplace. For distributions that are not available from the Marketplace, you can always  provide a custom built Linux image by following the guidelines found in  [Create and upload a virtual hard disk that contains the Linux operating system](create-upload-generic.md). For older versions see [Linux Kernel Requirements](create-upload-generic.md#linux-kernel-requirements).



The Azure Linux Agent is already pre-installed on Azure Marketplace images and is typically available from the distribution package repository. Source code can be found on [GitHub](https://github.com/azure/walinuxagent).  

For more information on support by distribution, see [Support for Linux images in Microsoft Azure](https://support.microsoft.com/help/2941892/support-for-linux-and-open-source-technology-in-azure).


## Types of Images
Azure Linux images can be grouped into three categories: 

### Marketplace Images  
Images published and maintained by either Microsoft or partners. There are a large variety of images from multiple publishers for various use cases (security hardened, full database / application stack, etc.), and can be available free, pay-as-you-go for BYOL (bring your own license/subscription). 

 
Platform Images are a type of Marketplace images for which Microsoft has partnered with several mainstream publishers (see table below about Partners) to create a set of “platform images” that undergo additional testing and receive predictable updates (see section below on Image Update Cadence). These platform images can be used for building your own custom images and solution stacks. These images are published by the endorsed Linux distribution partners such as Canonical (Ubuntu), Red Hat (RHEL), and Credativ (Debian). 


Microsoft CSS provides commercially reasonable support for these images. Additionally, Red Hat, Canonical, and SUSE offer integrated vendor support capabilities for their platform images.  


### Custom Images 
These images are created and maintained by the customer, often based on platform images. These images can also be created from scratch and uploaded to Azure - [learn how to create custom images](tutorial-custom-images.md). Customers can host these images in [Azure Compute Gallery](../azure-compute-gallery.md) and they can share these images with others in their organization.  

 
Microsoft CSS provides commercially reasonable support for custom images. 

### Community Gallery Images
These images are created and provided by open source projects, communities and teams. These images are provided using licensing terms set out by the publisher, often under an open source license. They do not appear as traditional marketplace listings, however, they do appear in the portal and via command line tools. More information on community galleries can be found here: [Azure Compute Gallery](../azure-compute-gallery.md#community-gallery).


Microsoft CSS provides support for Community Gallery images. 



## Platform Image Partners

|Linux Publisher / Distribution|Images (Offers)|Microsoft Support Policy|Description|
|---|---|---|---|
|**Canonical / Ubuntu**|[Ubuntu Server 20.04 LTS](https://azuremarketplace.microsoft.com/marketplace/apps/canonical.0001-com-ubuntu-server-focal?tab=Overview) <br/><br/> [Ubuntu Server 22.04 LTS](https://azuremarketplace.microsoft.com/marketplace/apps/canonical.0001-com-ubuntu-server-jammy?tab=Overview)|Microsoft CSS provides commercially reasonable support these images.|Canonical produces official Ubuntu images for Microsoft Azure and continuously tracks and delivers updates to these, ensuring security and stability are built from the moment your virtual machines launch. <br/><br/> Canonical works closely with Microsoft to optimize Ubuntu images on Azure and ensure Ubuntu supports the latest cloud features as they are released. Ubuntu powers more mission-critical workloads on Azure than any other operating system. <br/><br/> https://ubuntu.com/azure |
|**Credativ / Debian**|[Debian 11 "Bullseye"](https://azuremarketplace.microsoft.com/marketplace/apps/debian.debian-11?tab=Overview) <br/><br/> [Debian 12 "Bookworm"](https://azuremarketplace.microsoft.com/marketplace/apps/debian.debian-12?tab=Overview)|Microsoft CSS provides support for these images.|Credativ is an independent consulting and services company that specializes in the development and implementation of professional solutions by using free software. As leading open-source specialists, Credativ has international recognition with many IT departments that use their support. In conjunction with Microsoft, Credativ is preparing Debian images. The images are specially designed to run on Azure and can be easily managed via the platform. credativ will also support the long-term maintenance and updating of the Debian images for Azure through its Open Source Support Centers. <br/><br/> https://www.credativ.de/en/portfolio/support/open-source-support-center |
|**Kinvolk / Flatcar**|[Flatcar Container Linux](https://azuremarketplace.microsoft.com/marketplace/apps/kinvolk.flatcar-container-linux-free) <br/><br/> [Flatcar Container Linux (BYOL)](https://azuremarketplace.microsoft.com/marketplace/apps/kinvolk.flatcar-container-linux) <br/><br/> [Flatcar Container Linux ARM64](https://azuremarketplace.microsoft.com/marketplace/apps/kinvolk.flatcar-container-linux-corevm)|Microsoft CSS provides commercially reasonable support these images.|Kinvolk is the team behind Flatcar Container Linux, continuing the original CoreOS vision for a minimal, immutable, and auto-updating foundation for containerized applications. As a minimal distro, Flatcar contains just those packages required for deploying containers. Its immutable file system guarantees consistency and security, while its auto-update capabilities, enable you to be always up-to-date with the latest security fixes. Kinvolk was acquired by Microsoft in April 2021 and, post-acquisition, continues its mission to support the Flatcar Container Linux community. <br/><br/> https://www.flatcar-linux.org |
|**Oracle Linux**|[Oracle Linux](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/oracle.oracle-linux)|Microsoft CSS provides commercially reasonable support these images.|Oracle's strategy is to offer a broad portfolio of solutions for public and private clouds. The strategy gives customers choice and flexibility in how they deploy Oracle software in Oracle clouds and other clouds. Oracle's partnership with Microsoft enables customers to deploy Oracle software to Microsoft public and private clouds with the confidence of certification and support from Oracle. Oracle's commitment and investment in Oracle public and private cloud solutions is unchanged. <br/><br/> https://www.oracle.com/cloud/azure |
|**Red Hat / Red Hat Enterprise Linux (RHEL)**|[Red Hat Enterprise Linux](https://azuremarketplace.microsoft.com/marketplace/apps/redhat.rhel-20190605) <br/><br/> [Red Hat Enterprise Linux RAW](https://azuremarketplace.microsoft.com/marketplace/apps/redhat.rhel-raw) <br/><br/> [Red Hat Enterprise Linux ARM64](https://azuremarketplace.microsoft.com/marketplace/apps/redhat.rhel-arm64) <br/><br/> [Red Hat Enterprise Linux for SAP Apps](https://azuremarketplace.microsoft.com/marketplace/apps/redhat.rhel-sap-apps) <br/><br/> [Red Hat Enterprise Linux for SAP, HA, Updated Services](https://azuremarketplace.microsoft.com/marketplace/apps/redhat.rhel-sap-ha) <br/><br/> [Red Hat Enterprise Linux with HA add-on](https://azuremarketplace.microsoft.com/marketplace/apps/redhat.rhel-ha)|Microsoft CSS provides commercially reasonable support these images.|The world's leading provider of open-source solutions, Red Hat helps more than 90% of Fortune 500 companies solve business challenges, align their IT and business strategies, and prepare for the future of technology. Red Hat achieves this by providing secure solutions through an open business model and an affordable, predictable subscription model. <br/><br/> https://www.redhat.com/en/partners/microsoft |
|**Rogue Wave / CentOS**|[CentOS Based Images/Offers](https://azuremarketplace.microsoft.com/marketplace/apps/openlogic.centos?tab=Overview)|Microsoft CSS provides commercially reasonable support these images.|CentOS is currently on End-of-Life path scheduled to be deprecated in mid 2024.|
|**SUSE / SUSE Linux Enterprise Server (SLES)**|[SUSE Enterprise Linux 15 SP4](https://azuremarketplace.microsoft.com/marketplace/apps/suse.sles-15-sp4-basic?tab=Overview)|Microsoft CSS provides commercially reasonable support these images.|SUSE Linux Enterprise Server on Azure is a proven platform that provides superior reliability and security for cloud computing. SUSE's versatile Linux platform seamlessly integrates with Azure cloud services to deliver an easily manageable cloud environment. With more than 9,200 certified applications from more than 1,800 independent software vendors for SUSE Linux Enterprise Server, SUSE ensures that workloads running supported in the data center can be confidently deployed on Azure. <br/><br/> https://www.suse.com/partners/alliance/microsoft |


## Image Update Cadence
Azure requires that the publishers of the endorsed Linux distributions regularly update their platform images in Azure Marketplace with the latest patches and security fixes, at a quarterly or faster cadence. Updated images in the Marketplace are available automatically to customers as new versions of an image SKU. More information about how to find Linux images: Find Linux VM images in Azure Marketplace. 

## Azure-tuned Kernels 
Azure works closely with various endorsed Linux distributions to optimize the images that they published to Azure Marketplace. One aspect of this collaboration is the development of "tuned" Linux kernels that are optimized for the Azure platform and delivered as fully supported components of the Linux distribution. The Azure-Tuned kernels incorporate new features and performance improvements, and at a faster (typically quarterly) cadence compared to the default or generic kernels that are available from the distribution. 

In most cases, you will find these kernels pre-installed on the default images in Azure Marketplace so customers will immediately get the benefit of these optimized kernels. More information about these Azure-Tuned kernels can be found in the following links: 
- [CentOS Azure-Tuned Kernel - Available via the CentOS Virtualization SIG](https://wiki.centos.org/SpecialInterestGroup/Virtualization)
- [Debian Cloud Kernel - Available with the Debian 10 and Debian 9 "backports" image on Azure](https://wiki.debian.org/Cloud/MicrosoftAzure)
- [SLES Azure-Tuned Kernel](https://www.suse.com/c/a-different-builtin-kernel-for-azure-on-demand-images)
- [Ubuntu Azure-Tuned Kernel](https://blog.ubuntu.com/2017/09/21/microsoft-and-canonical-increase-velocity-with-azure-tailored-kernel)
- [Flatcar Container Linux](https://azuremarketplace.microsoft.com/marketplace/apps/kinvolk.flatcar-container-linux-corevm-amd64)


