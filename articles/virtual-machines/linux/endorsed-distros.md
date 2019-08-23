---
title: Linux distributions endorsed on Azure | Microsoft Docs
description: Learn about Linux on Azure-endorsed distributions, including guidelines for Ubuntu, CentOS, Oracle, and SUSE.
services: virtual-machines-linux
documentationcenter: ''
author: szarkos
manager: gwallace
editor: tysonn
tags: azure-service-management,azure-resource-manager

ms.assetid: 2777a526-c260-4cb9-a31a-bdfe1a55fffc
ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 05/16/2019
ms.author: szark

---
# Endorsed Linux distributions on Azure
Partners provide Linux images in the Azure Marketplace. We are working with various Linux communities to add even more flavors to the Endorsed Distribution list. In the meantime, for distributions that are not available from the Marketplace, you can always bring your own Linux by following the guidelines at [Create and upload a virtual hard disk that contains the Linux operating system](https://docs.microsoft.com/azure/virtual-machines/linux/create-upload-generic).

## Supported distributions and versions
The following table lists the Linux distributions and versions that are supported on Azure. Refer to [Support for Linux images in Microsoft Azure](https://support.microsoft.com/help/2941892/support-for-linux-and-open-source-technology-in-azure) for more detailed information about support for Linux and open-source technology in Azure.

The Linux Integration Services (LIS) drivers for Hyper-V and Azure are kernel modules that Microsoft contributes directly to the upstream Linux kernel.  Some LIS drivers are built into the distribution's kernel by default. Older distributions that are based on Red Hat Enterprise (RHEL)/CentOS are available as a separate download at [Linux Integration Services Version 4.2 for Hyper-V and Azure](https://www.microsoft.com/download/details.aspx?id=55106). See [Linux kernel requirements](create-upload-generic.md#linux-kernel-requirements) for more information about the LIS drivers.

The Azure Linux Agent is already pre-installed on the Azure Marketplace images and is typically available from the distribution's package repository. Source code can be found on [GitHub](https://github.com/azure/walinuxagent).


| Distribution | Version | Drivers | Agent |
| --- | --- | --- | --- |
| CentOS |CentOS 6.3+, 7.0+ |CentOS 6.3: [LIS download](https://www.microsoft.com/download/details.aspx?id=55106)<p>CentOS 6.4+: In kernel |Package: In [repo](http://olcentgbl.trafficmanager.net/openlogic/6/openlogic/x86_64/RPMS/) under "WALinuxAgent" <br/>Source code: [GitHub](https://github.com/Azure/WALinuxAgent) |
| [CoreOS](https://coreos.com/docs/running-coreos/cloud-providers/azure/) |494.4.0+ |In kernel |Source code: [GitHub](https://github.com/coreos/coreos-overlay/tree/master/app-emulation/wa-linux-agent) |
| Debian |Debian 7.9+, 8.2+ |In kernel |Package: In repo under "waagent" <br/>Source code: [GitHub](https://github.com/Azure/WALinuxAgent) |
| Oracle Linux |6.4+, 7.0+ |In kernel |Package: In repo under "WALinuxAgent" <br/>Source code: [GitHub](https://go.microsoft.com/fwlink/p/?LinkID=250998) |
| Red Hat Enterprise Linux |RHEL 6.7+, 7.1+, 8.0+ |In kernel |Package: In repo under "WALinuxAgent" <br/>Source code: [GitHub](https://github.com/Azure/WALinuxAgent) |
| SUSE Linux Enterprise |SLES/SLES for SAP<br>11 SP4<br>12 SP1+<br>15|In kernel |Package:<p> for 11 in [Cloud:Tools](https://build.opensuse.org/project/show/Cloud:Tools) repo<br>for 12 included in "Public Cloud" Module under "python-azure-agent"<br/>Source code: [GitHub](https://go.microsoft.com/fwlink/p/?LinkID=250998) |
| openSUSE |openSUSE Leap 42.2+ |In kernel |Package: In [Cloud:Tools](https://build.opensuse.org/project/show/Cloud:Tools) repo under "python-azure-agent" <br/>Source code: [GitHub](https://github.com/Azure/WALinuxAgent) |
| Ubuntu |Ubuntu 12.04+ **<sup>1</sup>** |In kernel |Package: In repo under "walinuxagent" <br/>Source code: [GitHub](https://github.com/Azure/WALinuxAgent) |

  - **<sup>1</sup>** Information about extended support for Ubuntu 12.04 and 14.04 can be found here: [Ubuntu Extended Security Maintenance](https://www.ubuntu.com/esm).


## Image update cadence
Azure requires that the publishers of the endorsed Linux distributions regularly update their images in the Azure Marketplace with the latest patches and security fixes, at a quarterly or faster cadence. Updated images in the Azure Marketplace are available automatically to customers as new versions of an image SKU. More information about how to find Linux images: [Find Linux VM images in the Azure Marketplace](https://docs.microsoft.com/azure/virtual-machines/linux/cli-ps-findimage).

### Additional links
 - [SUSE Public Cloud Image Lifecycle](https://www.suse.com/c/suse-public-cloud-image-life-cycle/)

## Azure-tuned kernels

Azure works closely with various endorsed Linux distributions to optimize the images that they published to the Azure Marketplace. One aspect of this collaboration is the development of "tuned" Linux kernels that are optimized for the Azure platform and delivered as fully supported components of the Linux distribution. The Azure-Tuned kernels incorporate new features and performance improvements, and at a faster (typically quarterly) cadence compared to the default or generic kernels that are available from the distribution.

In most cases you will find these kernels pre-installed on the default images in the Azure Marketplace, and so Azure customers will immediately get the benefit of these optimized kernels. More information about these Azure-Tuned kernels can be found in the following links:

 - CentOS Azure-Tuned Kernel - Available via the CentOS Virtualization SIG - [More Info](https://wiki.centos.org/SpecialInterestGroup/Virtualization)
 - Debian Cloud Kernel - Available with the Debian 10 and Debian 9 "backports" image on Azure - [More Info](https://wiki.debian.org/Cloud/MicrosoftAzure)
 - SLES Azure-Tuned Kernel - [More Info](https://www.suse.com/c/a-different-builtin-kernel-for-azure-on-demand-images/)
 - Ubuntu Azure-Tuned Kernel - [More Info](https://blog.ubuntu.com/2017/09/21/microsoft-and-canonical-increase-velocity-with-azure-tailored-kernel)


## Partners

### CoreOS
[https://coreos.com/docs/running-coreos/cloud-providers/azure/](https://coreos.com/docs/running-coreos/cloud-providers/azure/)

From the CoreOS website:

*CoreOS is designed for security, consistency, and reliability. Instead of installing packages via yum or apt, CoreOS uses Linux containers to manage your services at a higher level of abstraction. A single service's code and all dependencies are packaged within a container that can be run on one or many CoreOS machines.*

### Credativ
[https://www.credativ.co.uk/credativ-blog/debian-images-microsoft-azure](https://www.credativ.co.uk/credativ-blog/debian-images-microsoft-azure)

Credativ is an independent consulting and services company that specializes in the development and implementation of professional solutions by using free software. As leading open-source specialists, Credativ has international recognition with many IT departments that use their support. In conjunction with Microsoft, Credativ is currently preparing corresponding Debian images for Debian 8 (Jessie) and Debian before 7 (Wheezy). Both images are specially designed to run on Azure and can be easily managed via the platform. Credativ will also support the long-term maintenance and updating of the Debian images for Azure through its Open Source Support Centers.

### Oracle
[https://www.oracle.com/technetwork/topics/cloud/faq-1963009.html](https://www.oracle.com/technetwork/topics/cloud/faq-1963009.html)

Oracle’s strategy is to offer a broad portfolio of solutions for public and private clouds. The strategy gives customers choice and flexibility in how they deploy Oracle software in Oracle clouds and other clouds. Oracle’s partnership with Microsoft enables customers to deploy Oracle software in Microsoft public and private clouds with the confidence of certification and support from Oracle.  Oracle’s commitment and investment in Oracle public and private cloud solutions is unchanged.

### Red Hat
[https://www.redhat.com/en/partners/strategic-alliance/microsoft](https://www.redhat.com/en/partners/strategic-alliance/microsoft)

The world's leading provider of open source solutions, Red Hat helps more than 90% of Fortune 500 companies solve business challenges, align their IT and business strategies, and prepare for the future of technology. Red Hat does this by providing secure solutions through an open business model and an affordable, predictable subscription model.

### SUSE
[https://www.suse.com/suse-linux-enterprise-server-on-azure](https://www.suse.com/suse-linux-enterprise-server-on-azure)

SUSE Linux Enterprise Server on Azure is a proven platform that provides superior reliability and security for cloud computing. SUSE's versatile Linux platform seamlessly integrates with Azure cloud services to deliver an easily manageable cloud environment. With more than 9,200 certified applications from more than 1,800 independent software vendors for SUSE Linux Enterprise Server, SUSE ensures that workloads running supported in the data center can be confidently deployed on Azure.

### Canonical
[https://www.ubuntu.com/cloud/azure](https://www.ubuntu.com/cloud/azure)

Canonical engineering and open community governance drive Ubuntu's success in client, server, and cloud computing, which includes personal cloud services for consumers. Canonical's vision of a unified, free platform in Ubuntu, from phone to cloud, provides a family of coherent interfaces for the phone, tablet, TV, and desktop. This vision makes Ubuntu the first choice for diverse institutions from public cloud providers to the makers of consumer electronics and a favorite among individual technologists.

With developers and engineering centers around the world, Canonical is uniquely positioned to partner with hardware makers, content providers, and software developers to bring Ubuntu solutions to market for PCs, servers, and handheld devices.
