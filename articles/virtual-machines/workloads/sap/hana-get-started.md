---
title: Installation of SAP HANA on Azure virtual machines | Microsoft Docs'
description: Guide for installation of SAP HANA on Azure VMs
services: virtual-machines-linux
documentationcenter: ''
author: msjuergent
manager: bburns
editor: ''
tags: azure-resource-manager
keywords: ''

ms.assetid: c51a2a06-6e97-429b-a346-b433a785c9f0
ms.service: virtual-machines-linux

ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 03/19/2020
ms.author: juergent

---
# Installation of SAP HANA on Azure virtual machines
## Introduction
This guide helps you to point to the right resources to deploy HANA in Azure virtual machines successfully. This guide is going to point you to documentation resources that you need to check before installing SAP HANA in an Azure VM. So, that you are able to perform the right steps to end with a supported configuration of SAP HANA in Azure VMs.  

> [!NOTE]
> This guide describes deployments of SAP HANA into Azure VMs. For information on how to deploy SAP HANA into HANA large instances, see [How to install and configure SAP HANA (Large Instances) on Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-installation).
 
## Prerequisites
This guide also assumes that you're familiar with:
* SAP HANA and SAP NetWeaver and how to install them on-premises.
* How to install and operate SAP HANA and SAP application instances on Azure.
* The concepts and procedures documented in:
   * Planning for SAP deployment on Azure, which includes Azure Virtual Network planning and Azure Storage usage. See [SAP NetWeaver on Azure Virtual Machines - Planning and implementation guide](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/planning-guide)
   * Deployment principles and ways to deploy VMs in Azure. See [Azure Virtual Machines deployment for SAP](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/deployment-guide)
   * High availability concepts for SAP HANA as documented in [SAP HANA high availability for Azure virtual machines](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-availability-overview)

## Step-by-step before deploying
In this section, the different steps are listed that you need to perform before starting with the installation of SAP HANA in an Azure virtual machine. The order is enumerated and as such should be followed through as enumerated:

1. Not all possible deployment scenarios are supported on Azure. Therefore, you should check the document [SAP workload on Azure virtual machine supported scenarios](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-planning-supported-configurations) for the scenario you have in mind with your SAP HANA deployment. If the scenario is not listed, you need to assume that it has not been tested and, as a result, is not supported
2. Assuming that you have a rough idea on your memory requirement for your SAP HANA deployment, you need to find a fitting Azure VM. Not all the VMs that are certified for SAP NetWeaver, as documented in [SAP support note #1928533](https://launchpad.support.sap.com/#/notes/1928533), are SAP HANA certified. The source of truth for SAP HANA certified Azure VMs is the website [SAP HANA hardware directory](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure). The units starting with **S** are [HANA Large Instances](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-overview-architecture) units and not Azure VMs.
3. Different Azure VM types have different minimum operating system releases for SUSE Linux or Red Hat Linux. On the website [SAP HANA hardware directory](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure), you need to click on an entry in the list of SAP HANA certified units to get detailed data of this unit. Besides the supported HANA workload, the OS releases that are supported with those units for SAP HANA are listed
4. As of operating system releases, you need to consider certain minimum kernel releases. These minimum releases are documented in these SAP support notes:
	- [SAP support note #2814271 SAP HANA Backup fails on Azure with Checksum Error](https://launchpad.support.sap.com/#/notes/2814271)
	- [SAP support note #2753418 Potential Performance Degradation Due to Timer Fallback](https://launchpad.support.sap.com/#/notes/2753418)
	- [SAP support note #2791572 Performance Degradation Because of Missing VDSO Support For Hyper-V in Azure](https://launchpad.support.sap.com/#/notes/2791572)
4. Based on the OS release that is supported for the virtual machine type of choice, you need to check whether your desired SAP HANA release is supported with that operating system release. Read [SAP support note #2235581](https://launchpad.support.sap.com/#/notes/2235581) for a support matrix of SAP HANA releases with the different Operating System releases.
5. As you might have found a valid combination of Azure VM type, operating system release and SAP HANA release, you need to check in the SAP Product Availability Matrix. In the SAP Availability Matrix,  you can find out whether the SAP product you want to run against your SAP HANA database is supported.


## Step-by-step VM deployment and guest OS considerations
In this phase, you need to go through the steps deploying the VM(s) to install HANA and eventually optimize the chosen operating system after the installation.

1. Chose the base image out of the Azure gallery. If you want to build your own operating system image for SAP HANA, you need to know all the different packages that are necessary for a successful SAP HANA installation. Otherwise it is recommended using the SUSE and Red Hat images for SAP or SAP HANA out of the Azure image gallery. These images include the packages necessary for a successful HANA installation. Based on your support contract with the operating system provider, you need to choose an image where you bring your own license. Or you choose an OS image that includes support
2. If you chose a guest OS image that requires you bringing your own license, you need to register the OS image with your subscription, so, that you can download and apply the latest patches. This step is going to require public internet access. Unless you set up your private instance of, for example, an SMT server in Azure.
3. Decide the network configuration of the VM. You can read more information in the document [SAP HANA infrastructure configurations and operations on Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-vm-operations). Keep in mind that there are no network throughput quotas you can assign to virtual network cards in Azure. As a result, the only purpose of directing traffic through different vNICs is based on security considerations. We trust you to find a supportable compromise between complexity of traffic routing through multiple vNICs and the requirements enforced by security aspects.
3. Apply the latest patches to the operating system once the VM is deployed and registered. Registered  either with your own subscription. Or in case you chose an image that includes operating system support the VM should have access to the patches already. 
4. Apply the tunes necessary for SAP HANA. These tunes are listed in these SAP support notes:

	- [SAP support note #2694118 - Red Hat Enterprise Linux HA Add-On on Azure](https://launchpad.support.sap.com/#/notes/2694118)
	- [SAP support note #1984787 - SUSE LINUX Enterprise Server 12: Installation notes](https://launchpad.support.sap.com/#/notes/1984787) 
	- [SAP support note #2578899 - SUSE Linux Enterprise Server 15: Installation Note](https://launchpad.support.sap.com/#/notes/2578899)
	- [SAP support note #2002167 - Red Hat Enterprise Linux 7.x: Installation and Upgrade](https://launchpad.support.sap.com/#/notes/0002002167)
	- [SAP support note #2292690 - SAP HANA DB: Recommended OS settings for RHEL 7](https://launchpad.support.sap.com/#/notes/0002292690) 
	-  [SAP support note #2772999 - Red Hat Enterprise Linux 8.x: Installation and Configuration](https://launchpad.support.sap.com/#/notes/2772999) 
	-  [SAP support note #2777782 - SAP HANA DB: Recommended OS Settings for RHEL 8](https://launchpad.support.sap.com/#/notes/2777782)
	-  [SAP support note #2455582 - Linux: Running SAP applications compiled with GCC 6.x](https://launchpad.support.sap.com/#/notes/0002455582)
	-  [SAP support note #2382421 - Optimizing the Network Configuration on HANA- and OS-Level](https://launchpad.support.sap.com/#/notes/2382421)

1. Select the Azure storage type for SAP HANA. In this step, you need to decide on storage layout for SAP HANA installation. You are going to use either attached Azure disks or native Azure NFS shares. The Azure storage types that or supported and combinations of different Azure storage types that can be used, are documented in [SAP HANA Azure virtual machine storage configurations](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-vm-operations-storage). Take the configurations documented as starting point. For non-production systems, you might be able to configure lower throughput or IOPS. For production purposes, you might need to configure a bit more throughput and IOPS.
2. Make sure that you configured [Azure Write Accelerator](https://docs.microsoft.com/azure/virtual-machines/linux/how-to-enable-write-accelerator) for your volumes that contain the DBMS transaction logs or redo logs when you are using M-Series or Mv2-Series VMs. Be aware of the limitations for Write Accelerator as documented.
2. Check whether [Azure Accelerated Networking](https://azure.microsoft.com/blog/maximize-your-vm-s-performance-with-accelerated-networking-now-generally-available-for-both-windows-and-linux/) is enabled on the VM(s) deployed.

> [!NOTE]
> Not all the commands in the different sap-tune profiles or as described in the notes might run successfully on Azure. Commands that would manipulate the power mode of VMs usually return with an error since the power mode of the underlying Azure host hardware can not be manipulated.

## Step-by-step preparations specific to Azure virtual machines
One of the Azure specifics is the installation of an Azure VM extension that delivers monitoring data for the SAP Host Agent. The details about the installation of this monitoring extension are documented in:

-  [SAP Note 2191498](https://launchpad.support.sap.com/#/notes/2191498/E) discusses SAP enhanced monitoring with Linux VMs on Azure 
-  [SAP Note 1102124](https://launchpad.support.sap.com/#/notes/1102124/E) discusses information about SAPOSCOL on Linux 
-  [SAP Note 2178632](https://launchpad.support.sap.com/#/notes/2178632/E) discusses key monitoring metrics for SAP on Microsoft Azure
-  [Azure Virtual Machines deployment for SAP NetWeaver](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/deployment-guide#d98edcd3-f2a1-49f7-b26a-07448ceb60ca)

## SAP HANA installation
With the Azure virtual machines deployed and the operating systems registered and configured, you can install SAP HANA according to the SAP install. As a good start to get to this documentation, start with this SAP website [HANA resources](https://www.sap.com/products/hana/implementation/resources.html)

For SAP HANA scale-out configurations using direct attached disks of Azure Premium Storage or Ultra disk, read the specifics in the document [SAP HANA infrastructure configurations and operations on Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-vm-operations#configuring-azure-infrastructure-for-sap-hana-scale-out)


## Additional resources for SAP HANA backup
For information on how to back up SAP HANA databases on Azure VMs, see:
* [Backup guide for SAP HANA on Azure Virtual Machines](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-backup-guide)
* [SAP HANA Azure Backup on file level](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-hana-backup-file-level)

## Next steps
Read the documentation:

- [SAP HANA infrastructure configurations and operations on Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-vm-operations)
- [SAP HANA Azure virtual machine storage configurations](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/hana-vm-operations-storage)





