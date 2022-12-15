---
title: Linux distributions endorsed on Azure
description: Learn about Linux on Azure-endorsed distributions, including information about Ubuntu, CentOS, Oracle, Flatcar, Debian, Red Hat, and SUSE.
services: virtual-machines
author: srijang
ms.service: virtual-machines
ms.collection: linux
ms.topic: conceptual
ms.date: 09/29/2022
ms.author: srijangupta
ms.reviewer: cynthn
ms.custom: engagement-fy23
---

# Endorsed Linux distributions on Azure

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets 

Partners provide Linux images in Azure Marketplace. For distributions that are not available from the Marketplace, you can always bring your own Linux by following the guidelines at [Create and upload a virtual hard disk that contains the Linux operating system](./create-upload-generic.md).


For more information, see [Support for Linux images in Microsoft Azure](https://support.microsoft.com/help/2941892/support-for-linux-and-open-source-technology-in-azure).

The Linux Integration Services (LIS) drivers for Hyper-V and Azure are kernel modules that Microsoft contributes directly to the upstream Linux kernel. Some LIS drivers are built into the distribution's kernel by default. Older distributions that are based on Red Hat Enterprise (RHEL)/CentOS are available as a separate download at [Linux Integration Services Version 4.2 for Hyper-V and Azure](https://www.microsoft.com/download/details.aspx?id=55106). For more information, see [Linux kernel requirements](create-upload-generic.md#linux-kernel-requirements).

The Azure Linux Agent is already pre-installed on Azure Marketplace images and is typically available from the distribution's package repository. Source code can be found on [GitHub](https://github.com/azure/walinuxagent).


## Partners


### credativ

[https://www.credativ.de/en/portfolio/support/open-source-support-center/](https://www.credativ.de/en/portfolio/support/open-source-support-center/)

credativ is an independent consulting and services company that specializes in the development and implementation of professional solutions by using free software. As leading open-source specialists, credativ has international recognition with many IT departments that use their support. In conjunction with Microsoft, credativ is preparing Debian images. The images are specially designed to run on Azure and can be easily managed via the platform. credativ will also support the long-term maintenance and updating of the Debian images for Azure through its Open Source Support Centers.

### Kinvolk
[https://www.flatcar-linux.org/](https://www.flatcar-linux.org/)

Kinvolk is the team behind Flatcar Container Linux, continuing the original CoreOS vision for a minimal, immutable, and auto-updating foundation for containerized applications. As a minimal distro, Flatcar contains just those packages required for deploying containers. Its immutable file system guarantees consistency and security, while its auto-update capabilities, enable you to be always up-to-date with the latest security fixes. Kinvolk was [acquired by Microsoft](https://azure.microsoft.com/blog/microsoft-acquires-kinvolk-to-accelerate-containeroptimized-innovation/) in April 2021 and, post-acquisition, continues its mission to support the Flatcar Container Linux community.

### Oracle

[https://www.oracle.com/technetwork/topics/cloud/faq-1963009.html](https://www.oracle.com/technetwork/topics/cloud/faq-1963009.html)

Oracle's strategy is to offer a broad portfolio of solutions for public and private clouds. The strategy gives customers choice and flexibility in how they deploy Oracle software in Oracle clouds and other clouds. Oracle's partnership with Microsoft enables customers to deploy Oracle software to Microsoft public and private clouds with the confidence of certification and support from Oracle.  Oracle's commitment and investment in Oracle public and private cloud solutions is unchanged.

### Red Hat

[https://www.redhat.com/en/partners/strategic-alliance/microsoft](https://www.redhat.com/en/partners/strategic-alliance/microsoft)

The world's leading provider of open-source solutions, Red Hat helps more than 90% of Fortune 500 companies solve business challenges, align their IT and business strategies, and prepare for the future of technology. Red Hat achieves this by providing secure solutions through an open business model and an affordable, predictable subscription model.

### SUSE

[https://www.suse.com/suse-linux-enterprise-server-on-azure](https://www.suse.com/suse-linux-enterprise-server-on-azure)

SUSE Linux Enterprise Server on Azure is a proven platform that provides superior reliability and security for cloud computing. SUSE's versatile Linux platform seamlessly integrates with Azure cloud services to deliver an easily manageable cloud environment. With more than 9,200 certified applications from more than 1,800 independent software vendors for SUSE Linux Enterprise Server, SUSE ensures that workloads running supported in the data center can be confidently deployed on Azure.

### Canonical

[https://www.ubuntu.com/cloud/azure](https://www.ubuntu.com/cloud/azure)

Canonical engineering and open community governance drive Ubuntu's success in client, server, and cloud computing, which includes personal cloud services for consumers. Canonical's vision of a unified, free platform in Ubuntu, from phone to cloud, provides a family of coherent interfaces for the phone, tablet, TV, and desktop. This vision makes Ubuntu the first choice for diverse institutions from public cloud providers to the makers of consumer electronics and a favorite among individual technologists.

With developers and engineering centers around the world, Canonical is uniquely positioned to partner with hardware makers, content providers, and software developers to bring Ubuntu solutions to market for PCs, servers, and handheld devices.


## Image update cadence

Azure requires that the publishers of the endorsed Linux distributions regularly update their images in Azure Marketplace with the latest patches and security fixes, at a quarterly or faster cadence. Updated images in the Marketplace are available automatically to customers as new versions of an image SKU. More information about how to find Linux images: [Find Linux VM images in Azure Marketplace](./cli-ps-findimage.md).

## Azure-tuned kernels

Azure works closely with various endorsed Linux distributions to optimize the images that they published to Azure Marketplace. One aspect of this collaboration is the development of "tuned" Linux kernels that are optimized for the Azure platform and delivered as fully supported components of the Linux distribution. The Azure-Tuned kernels incorporate new features and performance improvements, and at a faster (typically quarterly) cadence compared to the default or generic kernels that are available from the distribution.

In most cases, you will find these kernels pre-installed on the default images in Azure Marketplace so customers will immediately get the benefit of these optimized kernels. More information about these Azure-Tuned kernels can be found in the following links:

- [CentOS Azure-Tuned Kernel - Available via the CentOS Virtualization SIG](https://wiki.centos.org/SpecialInterestGroup/Virtualization)
- [Debian Cloud Kernel - Available with the Debian 10 and Debian 9 "backports" image on Azure](https://wiki.debian.org/Cloud/MicrosoftAzure)
- [SLES Azure-Tuned Kernel](https://www.suse.com/c/a-different-builtin-kernel-for-azure-on-demand-images/)
- [Ubuntu Azure-Tuned Kernel](https://blog.ubuntu.com/2017/09/21/microsoft-and-canonical-increase-velocity-with-azure-tailored-kernel)
- [Flatcar Container Linux Pro](https://azuremarketplace.microsoft.com/marketplace/apps/kinvolk.flatcar_pro)

