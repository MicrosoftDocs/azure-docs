---
title: Azure VMs HA for SAP NW on Windows with Azure NetApp Files (SMB)| Microsoft Docs
description: High availability for SAP NetWeaver on Azure VMs on Windows with Azure NetApp Files (SMB) for SAP applications
services: virtual-machines-windows,virtual-network,storage
documentationcenter: saponazure
author: rdeltcheva
manager: juergent
editor: ''
tags: azure-resource-manager
keywords: ''
ms.assetid: 5e514964-c907-4324-b659-16dd825f6f87
ms.service: virtual-machines-sap
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 02/18/2021
ms.author: radeltch

---

# High availability for SAP NetWeaver on Azure VMs on Windows with Azure NetApp Files(SMB) for SAP applications

[dbms-guide]:dbms-guide.md
[deployment-guide]:deployment-guide.md
[planning-guide]:planning-guide.md

[anf-azure-doc]:https://docs.microsoft.com/azure/azure-netapp-files/
[anf-avail-matrix]:https://azure.microsoft.com/global-infrastructure/services/?products=storage&regions=all
[anf-register]:https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-register
[anf-sap-applications-azure]:https://www.netapp.com/us/media/tr-4746.pdf

[2205917]:https://launchpad.support.sap.com/#/notes/2205917
[1944799]:https://launchpad.support.sap.com/#/notes/1944799
[1928533]:https://launchpad.support.sap.com/#/notes/1928533
[2015553]:https://launchpad.support.sap.com/#/notes/2015553
[2178632]:https://launchpad.support.sap.com/#/notes/2178632
[2191498]:https://launchpad.support.sap.com/#/notes/2191498
[2243692]:https://launchpad.support.sap.com/#/notes/2243692
[1984787]:https://launchpad.support.sap.com/#/notes/1984787
[1999351]:https://launchpad.support.sap.com/#/notes/1999351
[1410736]:https://launchpad.support.sap.com/#/notes/1410736

[sap-swcenter]:https://support.sap.com/en/my-support/software-downloads.html

[suse-ha-guide]:https://www.suse.com/products/sles-for-sap/resource-library/sap-best-practices/
[suse-drbd-guide]:https://www.suse.com/documentation/sle-ha-12/singlehtml/book_sleha_techguides/book_sleha_techguides.html
[suse-ha-12sp3-relnotes]:https://www.suse.com/releasenotes/x86_64/SLE-HA/12-SP3/

[template-multisid-xscs]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-3-tier-marketplace-image-multi-sid-xscs-md%2Fazuredeploy.json
[template-converged]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-3-tier-marketplace-image-converged-md%2Fazuredeploy.json
[template-file-server]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-file-server-md%2Fazuredeploy.json

[sap-hana-ha]:sap-hana-high-availability.md
[nfs-ha]:high-availability-guide-suse-nfs.md

This article describes how to deploy, configure the virtual machines, install the cluster framework, and install a highly available SAP NetWeaver 7.50 system  on Windows VMs, using [SMB](/windows/win32/fileio/microsoft-smb-protocol-and-cifs-protocol-overview) on [Azure NetApp Files](../../../azure-netapp-files/azure-netapp-files-introduction.md).  

The database layer isn't covered in detail in this article. We assume that the Azure [virtual network](../../../virtual-network/virtual-networks-overview.md) has already been created.  

Read the following SAP Notes and papers first:

* [Azure NetApp Files documentation][anf-azure-doc] 
* SAP Note [1928533][1928533], which contains:  
  * A list of Azure VM sizes that are supported for the deployment of SAP software
  * Important capacity information for Azure VM sizes
  * Supported SAP software, and operating system (OS) and database combinations
  * Required SAP kernel version for Windows on Microsoft Azure
* SAP Note [2015553][2015553] lists prerequisites for SAP-supported SAP software deployments in Azure.
* SAP Note [2178632][2178632] has detailed information about all monitoring metrics reported for SAP in Azure.
* SAP Note [1999351][1999351] has additional troubleshooting information for the Azure Enhanced Monitoring Extension for SAP.
* SAP Note [2287140](https://launchpad.support.sap.com/#/notes/2287140) lists prerequisites for  SAP-supported CA feature of SMB 3.x protocol.
* SAP Note [2802770](https://launchpad.support.sap.com/#/notes/2802770) has troubleshooting information for the slow running SAP transaction AL11 on Windows 2012 and 2016.
* SAP Note [1911507](https://launchpad.support.sap.com/#/notes/1911507) has information about transparent failover feature for a file share on Windows Server with the SMB 3.0 protocol.
* SAP Note [662452](https://launchpad.support.sap.com/#/notes/662452) has recommendation(deactivating 8.3 name generation) to address Poor file system performance/errors during data accesses.
* [Install SAP NetWeaver high availability on a Windows failover cluster and file share for SAP ASCS/SCS instances on Azure](./sap-high-availability-installation-wsfc-file-share.md) 
* [Azure Virtual Machines high-availability architecture and scenarios for SAP NetWeaver](./sap-high-availability-architecture-scenarios.md)
* [Add probe port in ASCS cluster configuration](sap-high-availability-installation-wsfc-file-share.md)
* [Installation of an (A)SCS Instance on a Failover Cluster](https://www.sap.com/documents/2017/07/f453332f-c97c-0010-82c7-eda71af511fa.html)
* [Create an SMB volume for Azure NetApp Files](../../../azure-netapp-files/create-active-directory-connections.md#requirements-for-active-directory-connections)
* [NetApp SAP Applications on Microsoft Azure using Azure NetApp Files][anf-sap-applications-azure]

> [!IMPORTANT]
> CAUTION: Be aware that the installation of an SAP system with SWPM on SMB share, hosted on [Azure NetApp Files][anf-azure-doc] SMB volume, may fail with installation error for insufficient permissions like "warningPerm is not defined". To avoid the error, the user under which context SWPM is executed, needs elevated privilege "Domain Admin" during the installation of the SAP system.  

## Overview

SAP developed a new approach, and an alternative to cluster shared disks, for clustering an SAP ASCS/SCS instance on a Windows failover cluster. Instead of using cluster shared disks, one can use an SMB file share to deploy SAP global host files. Azure NetApp Files supports SMBv3 (along with NFS) with NTFS ACL using Active Directory. Azure NetApp Files is automatically highly available (as it is a PaaS service). These features make Azure NetApp Files great option for hosting the SMB file share for SAP global.  
Both [Azure Active Directory (AD) Domain Services](../../../active-directory-domain-services/overview.md) and [Active Directory Domain Services (AD DS)](/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview) are supported. You can use existing Active Directory domain controllers with Azure NetApp Files. Domain controllers can be in Azure as virtual machines, or on premises via ExpressRoute or S2S VPN. In this article, we will use Domain controller in an Azure VM.  
High availability(HA) for SAP Netweaver central services requires shared storage. To achieve that on Windows, so far it was necessary to build either SOFS cluster or use cluster shared disk s/w like SIOS. Now it is possible to achieve SAP Netweaver HA by using shared storage, deployed on Azure NetApp Files. Using Azure NetApp Files for the shared storage eliminates the need for either SOFS or SIOS.  

> [!NOTE]
> Clustering SAP ASCS/SCS instances by using a file share is supported for SAP NetWeaver 7.40 (and later), with SAP Kernel 7.49 (and later).  

![SAP ASCS/SCS HA Architecture with SMB share](./media/virtual-machines-shared-sap-high-availability-guide/high-availability-windows-azure-netapp-files-smb.png)

The prerequisites for an SMB file share are:
* SMB 3.0 (or later) protocol.
* Ability to set Active Directory access control lists (ACLs) for Active Directory user groups and the computer$ computer object.
* The file share must be HA-enabled.

The share for the SAP Central services in this reference architecture is offered by Azure NetApp Files:

![SAP ASCS/SCS HA Architecture with SMB share details](./media/virtual-machines-shared-sap-high-availability-guide/high-availability-windows-azure-netapp-files-smb-detail.png)

## Create and mount SMB volume for Azure NetApp Files

Perform the following steps, as preparation for using Azure NetApp Files.  

1. Follow the steps to [Register for Azure NetApp Files](../../../azure-netapp-files/azure-netapp-files-register.md)  
2. Create Azure NetApp account, following the steps described in  [Create a NetApp account](../../../azure-netapp-files/azure-netapp-files-create-netapp-account.md)  
3. Set up capacity pool, following the instructions in [Set up a capacity pool](../../../azure-netapp-files/azure-netapp-files-set-up-capacity-pool.md)
4. Azure NetApp Files resources must reside in delegated subnet. Follow the instructions in [Delegate a subnet to Azure NetApp Files](../../../azure-netapp-files/azure-netapp-files-delegate-subnet.md) to create delegated subnet.  

   > [!IMPORTANT]
   > You need to create Active Directory connections before creating an SMB volume. Review the [requirements for Active Directory connections](../../../azure-netapp-files/create-active-directory-connections.md#requirements-for-active-directory-connections).  

5. Create Active Directory connection, as described in [Create an Active Directory connection](../../../azure-netapp-files/create-active-directory-connections.md#create-an-active-directory-connection)  
6. Create SMB Azure NetApp Files SMB volume, following the instructions in [Add an SMB volume](../../../azure-netapp-files/azure-netapp-files-create-volumes-smb.md#add-an-smb-volume)  
7. Mount the SMB volume on your Windows Virtual Machine.

> [!TIP]
> You can find the instructions on how to mount the Azure NetApp Files volume, if you navigate in [Azure Portal](https://portal.azure.com/#home) to the Azure NetApp Files object, click on the **Volumes** blade, then **Mount Instructions**.  

## Prepare the infrastructure for SAP HA by using a Windows failover cluster 

1. [Set the ASCS/SCS load balancing rules for the Azure internal load balancer](./sap-high-availability-infrastructure-wsfc-shared-disk.md#fe0bd8b5-2b43-45e3-8295-80bee5415716).
2. [Add Windows virtual machines to the domain](./sap-high-availability-infrastructure-wsfc-shared-disk.md#e69e9a34-4601-47a3-a41c-d2e11c626c0c).
3. [Add registry entries on both cluster nodes of the SAP ASCS/SCS instance](./sap-high-availability-infrastructure-wsfc-shared-disk.md#661035b2-4d0f-4d31-86f8-dc0a50d78158)
4. [Set up a Windows Server failover cluster for an SAP ASCS/SCS instance](./sap-high-availability-infrastructure-wsfc-shared-disk.md#0d67f090-7928-43e0-8772-5ccbf8f59aab)
5. If you are using Windows Server 2016, we recommend that you configure [Azure Cloud Witness](/windows-server/failover-clustering/deploy-cloud-witness).


## Install SAP ASCS instance on both nodes

You need the following software from SAP:
   * SAP Software Provisioning Manager (SWPM) installation tool version SPS25 or later.
   * SAP Kernel 7.49 or later
   * Create a virtual host name (cluster network name)  for the clustered SAP ASCS/SCS instance, as described in [Create a virtual host name for the clustered SAP ASCS/SCS instance](./sap-high-availability-installation-wsfc-shared-disk.md#a97ad604-9094-44fe-a364-f89cb39bf097).

> [!NOTE]
> Clustering SAP ASCS/SCS instances by using a file share is supported for SAP NetWeaver 7.40 (and later), with SAP Kernel 7.49 (and later).  

### Install an ASCS/SCS instance on the first ASCS/SCS cluster node

1. Install an SAP ASCS/SCS instance on the first cluster node. Start the SAP SWPM installation tool, then navigate to:
**Product** > **DBMS** > Installation > Application Server ABAP (or Java) > High-Availability System > ASCS/SCS instance > First cluster node.  

2. Select **File Share Cluster** as the Cluster share Configuration in SWPM.  
3. When prompted at step **SAP System Cluster Parameters**, enter the host name for the Azure NetApp Files SMB share you already created as **File Share Host Name**.  In this example, the SMB share host name is **anfsmb-9562**. 

   > [!IMPORTANT]
   > If Pre-requisite checker Results in SWPM shows Continuous availability feature condition not met, it  can be addressed by following the instructions in [Delayed error message when you try to access a shared folder that no longer exists in Windows](https://support.microsoft.com/help/2820470/delayed-error-message-when-you-try-to-access-a-shared-folder-that-no-l).  

   > [!TIP]
   > If Pre-requisite checker Results in SWPM shows Swap Size condition not met, you can adjust the SWAP size by navigating to My Computer>System Properties>Performance Settings> Advanced> Virtual memory> Change.  

4. Configure an SAP cluster resource, the `SAP-SID-IP` probe port, by using PowerShell. Execute this configuration on one of the SAP ASCS/SCS cluster nodes, as described in [Configure probe port](./sap-high-availability-installation-wsfc-shared-disk.md#10822f4f-32e7-4871-b63a-9b86c76ce761).

### Install an ASCS/SCS instance on the second ASCS/SCS cluster node

1. Install an SAP ASCS/SCS instance on the second cluster node. Start the SAP SWPM installation tool, then navigate to **Product** > **DBMS** > Installation > Application Server ABAP (or Java) > High-Availability System > ASCS/SCS instance > Additional cluster node.  

### Install a DBMS instance and SAP application servers

Complete your SAP installation, by installing:

   * A DBMS instance  
   * A primary SAP application server  
   * An additional SAP application server  

## Test the SAP ASCS/SCS instance failover 

### Fail over from cluster node A to cluster node B and back
In this test scenario we will refer to cluster node sapascs1 as node A,  and to cluster node sapascs2 as node B.

1. Verify that the cluster resources are running on node A. 
![Figure 1: Windows Server failover cluster resources running on node A prior before the failover test](./media/virtual-machines-shared-sap-high-availability-guide/high-availability-windows-azure-netapp-files-smb-figure-1.png)  

2. Restart cluster node A. The SAP cluster resources will move to cluster node B. 
![Figure 2: Windows Server failover cluster resources running on node B after the failover test](./media/virtual-machines-shared-sap-high-availability-guide/high-availability-windows-azure-netapp-files-smb-figure-2.png)  


## Lock entry test

1.Verify that the SAP Enqueue Replication Server (ERS) is active  
2. Log on to the SAP system, execute transaction SU01 and open a user ID in change mode. That will generate SAP lock entry.  
3. As you are logged in the SAP system, display the lock entry, by navigating to transaction ST12.  
4. Fail over ASCS resources from cluster node A to cluster node B.  
5. Verify that the lock entry, generated before the SAP ASCS/SCS cluster resources failover is retained.  

![Figure 3: Lock entry is retained after failover test](./media/virtual-machines-shared-sap-high-availability-guide/high-availability-windows-azure-netapp-files-smb-figure-3.png)  

For more information, see [Troubleshooting for Enqueue Failover in ASCS with ERS](https://wiki.scn.sap.com/wiki/display/SI/Troubleshooting+for+Enqueue+Failover+in+ASCS+with+ERS)
## Next steps

* [Azure Virtual Machines planning and implementation for SAP][planning-guide]
* [Azure Virtual Machines deployment for SAP][deployment-guide]
* [Azure Virtual Machines DBMS deployment for SAP][dbms-guide]
* To learn how to establish high availability and plan for disaster recovery of SAP 
* HANA on Azure (large instances), see [SAP HANA (large instances) high availability and disaster recovery on Azure](hana-overview-high-availability-disaster-recovery.md).
* To learn how to establish high availability and plan for disaster recovery of SAP HANA on Azure VMs, see [High Availability of SAP HANA on Azure Virtual Machines (VMs)][sap-hana-ha]
