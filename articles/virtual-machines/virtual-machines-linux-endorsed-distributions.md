<properties 
	pageTitle="Endorsed distributions of Linux in Azure" 
	description="Learn about Linux on Azure-endorsed distributions, including guidelines for Ubuntu, OpenLogic, and SUSE." 
	services="virtual-machines" 
	documentationCenter="" 
	authors="szarkos" 
	manager="timlt" 
	editor="tysonn"/>

<tags 
	ms.service="virtual-machines" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="vm-linux" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/03/2015" 
	ms.author="szark"/>



#Linux on Azure-Endorsed Distributions

The Linux images in the Azure Gallery are provided by a number of partners, and we are working with various Linux communities to add even more flavors to the Endorsed Distribution list. In the meantime, for distributions not available from the Gallery you can always Bring-Your-Own-Linux by following the guidelines on [this page](virtual-machines-linux-create-upload-vhd.md).


## Supported Distributions & Versions ##

The following table lists the Linux distributions and versions that are supported on Azure.

The Linux Integration Services (LIS) drivers for Hyper-V and Azure are kernel modules that Microsoft contributes directly to the upstream Linux kernel.  The LIS drivers are either built into the distribution's kernel by default, or for older RHEL/CentOS-based distributions are available as a separate download [here](http://go.microsoft.com/fwlink/?LinkID=403033&clcid=0x409).  Please see [this article](virtual-machines-linux-create-upload-vhd-generic.md#linux-kernel-requirements) for more information about the LIS drivers.

The Azure Linux Agent is already pre-installed on the Azure Gallery images and are typically available from the distribution's package repository.  Source code can be found on [GitHub](https://github.com/azure/walinuxagent).

Distribution|Version|Drivers|Agent
---|---|---|---
Canonical Ubuntu|Ubuntu 12.04, 14.04, 14.10 and 15.04|In Kernel|Package: In repo under "walinuxagent" <p><p>Source: [GitHub](http://go.microsoft.com/fwlink/p/?LinkID=250998)
CentOS by OpenLogic |CentOS 6.3+, 7.0+| CentOS 6.3: [LIS Download](http://go.microsoft.com/fwlink/?LinkID=403033&clcid=0x409)<p>CentOS 6.4+: In Kernel|Package: In <a href="http://olcentgbl.trafficmanager.net/openlogic/6/openlogic/x86_64/RPMS/">OpenLogic repo   under "WALinuxAgent"<p><p>Source: [GitHub](http://go.microsoft.com/fwlink/p/?LinkID=250998)
[CoreOS](https://coreos.com/docs/running-coreos/cloud-providers/azure/)|494.4.0+ |In Kernel|Source: [GitHub](https://github.com/coreos/coreos-overlay/tree/master/app-emulation/wa-linux-agent)
Oracle Linux| 6.4+, 7.0+|In Kernel|Package: In repo under "WALinuxAgent"<p><p>Source: [GitHub](http://go.microsoft.com/fwlink/p/?LinkID=250998)
SUSE Linux Enterprise |SLES 11 SP3+, SLES 12+ and  <p><p> SLES for SAP 11.3+ |In Kernel|Package: In [Cloud:Tools](https://build.opensuse.org/project/show/Cloud:Tools) repo under "WALinuxAgent"<p><p>Source: [GitHub](http://go.microsoft.com/fwlink/p/?LinkID=250998)
openSUSE |openSUSE 13.1+|In Kernel|Package: In [Cloud:Tools](https://build.opensuse.org/project/show/Cloud:Tools) repo under "WALinuxAgent" <p><p>Source Code: [GitHub](http://go.microsoft.com/fwlink/p/?LinkID=250998)

## Partners

### Canonical
[http://www.ubuntu.com/cloud/azure](http://www.ubuntu.com/cloud/azure)

Canonical engineering and open community governance drive Ubuntu's success in client, server and cloud computing,  including personal cloud services for consumers. Canonical's vision of a unified free platform in Ubuntu, from phone to cloud, with a family of coherent interfaces for the phone, tablet, TV and desktop, makes Ubuntu the first choice for diverse institutions from public cloud providers to the makers of consumer electronics, and a favorite among individual technologists.

With developers and engineering centers around the world, Canonical is uniquely positioned to partner with hardware makers, content providers and software developers to bring Ubuntu solutions to market, from PCs to servers and handheld devices.


### CoreOS
[https://coreos.com/docs/running-coreos/cloud-providers/azure/](https://coreos.com/docs/running-coreos/cloud-providers/azure/)

From the CoreOS Website:

*CoreOS is designed for security, consistency, and reliability. Instead of installing packages via yum or apt, CoreOS uses Linux containers to manage your services at a higher level of abstraction. A single service's code and all dependencies are packaged within a container that can be run on one or many CoreOS machines.*


### OpenLogic
[http://www.openlogic.com/azure](http://www.openlogic.com/azure)

OpenLogic is a leading provider of enterprise open source solutions for the cloud and the data center. OpenLogic helps hundreds of leading enterprise across a wide range of industries to safely acquire, support, and control open source software. OpenLogic offers commercial-grade technical support and indemnification for 600 open source packages backed by the OpenLogic Expert Community, including enterprise level support for CentOS as well as being the launch partner for providing CentOS-based images on Azure.


### Oracle
[http://www.oracle.com/technetwork/topics/cloud/faq-1963009.html](http://www.oracle.com/technetwork/topics/cloud/faq-1963009.html)

Oracle’s strategy is to offer a broad portfolio of solutions for public and private clouds, while giving customers choice and flexibility in how they deploy Oracle software in Oracle clouds as well as other clouds.  Oracle’s partnership with Microsoft enables customers to deploy Oracle software in Microsoft public and private clouds with the confidence of certification and support from Oracle.  Oracle’s commitment and investment in Oracle public and private cloud solutions is unchanged.


### SUSE
[http://www.suse.com/suse-linux-enterprise-server-on-azure](http://www.suse.com/suse-linux-enterprise-server-on-azure)

SUSE Linux Enterprise Server on Azure is a proven platform that provides superior reliability and security for cloud computing. SUSE's versatile Linux platform seamlessly integrates with Azure cloud services to deliver an easily manageable cloud environment. And with more than 9,200 certified applications from over 1,800 independent software vendors for SUSE Linux Enterprise Server, SUSE ensures that workloads running supported in the data center can be confidently deployed on Azure.

 
