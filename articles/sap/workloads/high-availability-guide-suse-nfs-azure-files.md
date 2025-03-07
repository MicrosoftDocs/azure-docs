---
title: Azure VMs high availability for SAP NW on SLES with NFS on Azure Files| Microsoft Docs
description: High-availability guide for SAP NetWeaver on SUSE Linux Enterprise Server with NFS on Azure Files for SAP applications
services: virtual-machines-windows,virtual-network,storage
author: rdeltcheva
manager: juergent
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: tutorial
ms.custom: devx-track-azurecli, devx-track-azurepowershell, linux-related-content
ms.date: 11/19/2024
ms.author: radeltch
---

# High availability for SAP NetWeaver on Azure VMs on SUSE Linux Enterprise Server with NFS on Azure Files  

[dbms-guide]:dbms-guide-general.md
[deployment-guide]:deployment-guide.md
[planning-guide]:planning-guide.md

[afs-azure-doc]:../../storage/files/storage-files-introduction.md
[afs-avail-matrix]:https://azure.microsoft.com/global-infrastructure/services/?products=storage&regions=all

[2205917]:https://launchpad.support.sap.com/#/notes/2205917
[1928533]:https://launchpad.support.sap.com/#/notes/1928533
[2015553]:https://launchpad.support.sap.com/#/notes/2015553
[2178632]:https://launchpad.support.sap.com/#/notes/2178632
[2191498]:https://launchpad.support.sap.com/#/notes/2191498
[2243692]:https://launchpad.support.sap.com/#/notes/2243692
[1984787]:https://launchpad.support.sap.com/#/notes/1984787
[2578899]:https://launchpad.support.sap.com/#/notes/2578899
[1999351]:https://launchpad.support.sap.com/#/notes/1999351
[1410736]:https://launchpad.support.sap.com/#/notes/1410736
[2360818]:https://launchpad.support.sap.com/#/notes/2360818

[suse-ha-guide]:https://www.suse.com/products/sles-for-sap/resource-library/sap-best-practices/
[suse-relnotes]:https://www.suse.com/releasenotes/index.html

[sap-hana-ha]:sap-hana-high-availability.md

This article describes how to deploy and configure VMs, install the cluster framework, and install an HA SAP NetWeaver system, using [NFS on Azure Files](../../storage/files/files-nfs-protocol.md). The example configurations use VMs that run on SUSE Linux Enterprise Server (SLES).

For new implementations on SLES for SAP Applications 15, we  recommended deploying high availability for SAP ASCS/ERS in [simple mount configuration](./high-availability-guide-suse-nfs-simple-mount.md). The classic Pacemaker configuration, based on cluster-controlled file systems for the SAP central services directories, described in this article is still [supported](https://documentation.suse.com/sbp/all/single-html/SAP-nw740-sle15-setupguide/#id-introduction).

## Prerequisites  

* [Azure Files documentation][afs-azure-doc].
* SAP Note [1928533][1928533], which has:  
  * List of Azure VM sizes that are supported for the deployment of SAP software.
  * Important capacity information for Azure VM sizes.
  * Supported SAP software, and operating system (OS) and database combinations.
  * Required SAP kernel version for Windows and Linux on Microsoft Azure.
* SAP Note [2015553][2015553] lists prerequisites for SAP-supported SAP software deployments in Azure.
* SAP Note [2205917][2205917] has recommended OS settings for SUSE Linux Enterprise Server for SAP Applications.
* SAP Note [2178632][2178632] has detailed information about all monitoring metrics reported for SAP in Azure.
* SAP Note [2191498][2191498] has the required SAP Host Agent version for Linux in Azure.
* SAP Note [2243692][2243692] has information about SAP licensing on Linux in Azure.
* SAP Note [1984787][1984787] has general information about SUSE Linux Enterprise Server 12.
* SAP Note [2578899][2578899] has general information about SUSE Linux Enterprise Server 15
* SAP Note [1999351][1999351] has additional troubleshooting information for the Azure Enhanced Monitoring Extension for SAP.
* [SAP Community WIKI](https://wiki.scn.sap.com/wiki/display/HOME/SAPonLinuxNotes) has all required SAP Notes for Linux.
* [Azure Virtual Machines planning and implementation for SAP on Linux][planning-guide].
* [Azure Virtual Machines deployment for SAP on Linux][deployment-guide].
* [Azure Virtual Machines DBMS deployment for SAP on Linux][dbms-guide].
* [SUSE SAP HA Best Practice Guides][suse-ha-guide].
  The guides contain all required information to set up Netweaver HA and SAP HANA System Replication on-premises. Use these guides as a general baseline. They provide much more detailed information.
* [SUSE High Availability Extension Release Notes][suse-relnotes].

## Overview

To deploy the SAP NetWeaver application layer, you need shared directories like `/sapmnt/SID` and `/usr/sap/trans` in the environment. Additionally, when deploying an HA SAP system, you need to protect and make highly available file systems like `/sapmnt/SID` and `/usr/sap/SID/ASCS`.

Now you can place these file systems on [NFS on Azure Files](../../storage/files/files-nfs-protocol.md). NFS on Azure Files is an HA storage solution. This solution offers synchronous Zone redundant storage (ZRS) and is suitable for SAP  ASCS/ERS instances deployed across Availability Zones.  You still need a Pacemaker cluster to protect single point of failure components like SAP Netweaver central services(ASCS/SCS).  

The example configurations and installation commands use the following instance numbers:

| Instance name | Instance number |
| ---------------- | ------------------ |
| ABAP SAP Central Services (ASCS) | 00 |
| ERS | 01 |
| Primary Application Server (PAS) | 02 |
| Additional Application Server (AAS) | 03 |
| SAP system identifier | NW1 |

:::image type="complex" source="./media/high-availability-guide-suse/high-availability-guide-suse-nfs-azure-files.png" alt-text="SAP NetWeaver High Availability with NFS on Azure Files":::
   This diagram shows a typical SAP Netweaver HA architecture. The "sapmnt" and "saptrans" file systems are deployed on NFS shares on Azure Files. The SAP central services are protected by a Pacemaker cluster. The clustered VMs are behind an Azure load balancer. The NFS shares are mounted through private end point.
:::image-end:::

## Prepare infrastructure

The resource agent for SAP Instance is included in SUSE Linux Enterprise Server for SAP Applications. An image for SUSE Linux Enterprise Server for SAP Applications 12 or 15 is available in Azure Marketplace. You can use the image to deploy new VMs.

### Deploy Linux VMs manually via Azure portal

This document assumes that you've already deployed a resource group, [Azure Virtual Network](../../virtual-network/virtual-networks-overview.md), and subnet.

Deploy virtual machines with SLES for SAP Applications image. Choose a suitable version of SLES image that is supported for SAP system. You can deploy VM in any one of the availability options - virtual machine scale set, availability zone, or availability set.

### Configure Azure load balancer

During VM configuration, you have an option to create or select exiting load balancer in networking section. Follow the steps below to configure a standard load balancer for the high-availability setup of SAP ASCS and SAP ERS.

#### [Azure portal](#tab/lb-portal)

[!INCLUDE [Configure Azure standard load balancer using Azure portal](../../../includes/sap-load-balancer-ascs-ers-portal.md)]

#### [Azure CLI](#tab/lb-azurecli)

[!INCLUDE [Configure Azure standard load balancer using Azure CLI](../../../includes/sap-load-balancer-ascs-ers-azurecli.md)]

#### [PowerShell](#tab/lb-powershell)

[!INCLUDE [Configure Azure standard load balancer using PowerShell](../../../includes/sap-load-balancer-ascs-ers-powershell.md)]

---

> [!NOTE]
> When VMs without public IP addresses are placed in the backend pool of internal (no public IP address) Standard Azure load balancer, there will be no outbound internet connectivity, unless additional configuration is performed to allow routing to public end points. For details on how to achieve outbound connectivity see [Public endpoint connectivity for Virtual Machines using Azure Standard Load Balancer in SAP high-availability scenarios](./high-availability-guide-standard-load-balancer-outbound-connections.md).  

> [!IMPORTANT]
>
> * Don't enable TCP time stamps on Azure VMs placed behind Azure Load Balancer. Enabling TCP timestamps will cause the health probes to fail. Set the `net.ipv4.tcp_timestamps` parameter to `0`. For details, see [Load Balancer health probes](../../load-balancer/load-balancer-custom-probe-overview.md).
> * To prevent saptune from changing the manually set `net.ipv4.tcp_timestamps` value from `0` back to `1`, you should update saptune version to 3.1.1 or higher. For more details, see [saptune 3.1.1 – Do I Need to Update?](https://www.suse.com/c/saptune-3-1-1-do-i-need-to-update/).

### Deploy Azure Files storage account and NFS shares

NFS on Azure Files, runs on top of [Azure Files Premium storage][afs-azure-doc]. Before setting up NFS on Azure Files, see [How to create an NFS share](../../storage/files/storage-files-how-to-create-nfs-shares.md?tabs=azure-portal).

There are two options for redundancy within an Azure region:

* [Locally redundant storage (LRS)](../../storage/common/storage-redundancy.md#locally-redundant-storage), which offers local, in-zone synchronous data replication.
* [Zone redundant storage (ZRS)](../../storage/common/storage-redundancy.md#zone-redundant-storage), which replicates your data synchronously across the three [availability zones](../../reliability/availability-zones-overview.md) in the region.

Check if your selected Azure region offers NFS 4.1 on Azure Files with the appropriate redundancy. Review the [availability of Azure Files by Azure region][afs-avail-matrix] under **Premium Files Storage**. If your scenario benefits from ZRS,  [verify that Premium File shares with ZRS are supported in your Azure region](../../storage/common/storage-redundancy.md#zone-redundant-storage).

It's recommended to access your Azure Storage account through an [Azure Private Endpoint](../../storage/files/storage-files-networking-endpoints.md?tabs=azure-portal). Make sure to deploy the Azure Files storage account endpoint and the VMs, where you need to mount the NFS shares, in the same Azure VNet or peered Azure VNets.

1. Deploy a File Storage account named `sapafsnfs`. In this example, we use ZRS. If you're not familiar with the process, see [Create a storage account](../../storage/files/storage-how-to-create-file-share.md?tabs=azure-portal#create-a-storage-account) for the Azure portal.
2. In the **Basics** tab, use these settings:
    1. For **Storage account name**, enter `sapafsnfs`.
    2. For **Performance**, select **Premium**.
    3. For **Premium account type**, select **FileStorage**.
    4. For **Replication**, select zone redundancy (ZRS).
3. Select **Next**.
4. In the **Advanced** tab, deselect **Require secure transfer for REST API Operations**. If you don't deselect this option, you can't mount the NFS share to your VM. The mount operation will time out.
5. Select **Next**.
6. In the **Networking** section, configure these settings:
    1. Under **Networking connectivity**, for **Connectivity method**, select **Private endpoint**.
    2. Under **Private endpoint**, select **Add private endpoint**.
7. In the **Create private endpoint** pane, select your **Subscription**, **Resource group**, and **Location**.
    For **Name**, enter `sapafsnfs_pe`.
    For **Storage sub-resource**, select **file**.
    Under **Networking**, for **Virtual network**, select the VNet and subnet to use. Again, you can use the VNet where your SAP VMs are, or a peered VNet.
    Under **Private DNS integration**, accept the default option **Yes** for **Integrate with private DNS zone**. Make sure to select your **Private DNS Zone**.
    Select **OK**.
8. On the **Networking** tab again, select **Next**.
9. On the **Data protection** tab, keep all the default settings.
10. Select **Review + create** to validate your configuration.
11. Wait for the validation to finish. Fix any issues before continuing.
12. On the **Review + create** tab, select **Create**.

Next, deploy the NFS shares in the storage account you created. In this example, there are two NFS shares, `sapnw1` and `saptrans`.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select or search for **Storage accounts**.
3. On the **Storage accounts** page, select **sapafsnfs**.
4. On the resource menu for **sapafsnfs**, select **File shares** under **Data storage**.
5. On the **File shares** page, select **File share**.
   1. For **Name**, enter `sapnw1`, `saptrans`.
   2. Select an appropriate share size. For example, **128 GB**.  Consider the size of the data stored on the share, IOPs and throughput requirements.  For more information, see [Azure file share targets](../../storage/files/storage-files-scale-targets.md#azure-file-share-scale-targets).
   3. Select **NFS** as the protocol.
   4. Select **No root Squash**.  Otherwise, when you mount the shares on your VMs, you can't see the file owner or group.

   > [!IMPORTANT]
   > The share size above is just an example. Make sure to size your shares appropriately. Size not only based on the size of the of data stored on the share, but also based on the requirements for IOPS and throughput. For details see [Azure file share targets](../../storage/files/storage-files-scale-targets.md#azure-file-share-scale-targets).  

   The SAP file systems that don't need to be mounted via NFS can also be deployed on [Azure disk storage](/azure/virtual-machines/disks-types#premium-ssds). In this example, you can deploy `/usr/sap/NW1/D02` and `/usr/sap/NW1/D03` on Azure disk storage.

### Important considerations for NFS on Azure Files shares

When you plan your deployment with NFS on Azure Files, consider the following important points:  

* The minimum share size is 100 GiB. You only pay for the [capacity of the provisioned shares](../../storage/files/understanding-billing.md#provisioned-v1-model).
* Size your NFS shares not only based on capacity requirements, but also on IOPS and throughput requirements. For details see [Azure file share targets](../../storage/files/storage-files-scale-targets.md#azure-file-share-scale-targets).
* Test the workload to validate your sizing and ensure that it meets your performance targets. To learn how to troubleshoot performance issues on Azure Files, consult [Troubleshoot Azure file shares performance](../../storage/files/files-troubleshoot-performance.md).
* For SAP J2EE systems, it's not supported to place `/usr/sap/<SID>/J<nr>` on NFS on Azure Files.
* If your SAP system has a heavy batch jobs load, you may have millions of job logs. If the SAP batch job logs are stored in the file system, pay special attention to the sizing of the `sapmnt` share. As of SAP_BASIS 7.52 the default behavior for the batch job logs is to be stored in the database. For details see [Job log in the database][2360818].
* Deploy a separate `sapmnt` share for each SAP system.
* Don't use the `sapmnt` share for any other activity, such as interfaces, or `saptrans`.
* Don't use the `saptrans` share for any other activity, such as interfaces, or `sapmnt`.
* Avoid consolidating the shares for too many SAP systems in a single storage account. There are also [Storage account performance scale targets](../../storage/files/storage-files-scale-targets.md#storage-account-scale-targets). Be careful to not exceed the limits for the storage account, too.
* In general,  don't consolidate the shares for more than 5 SAP systems in a single storage account. This guideline helps avoid exceeding the storage account limits and simplifies performance analysis.
* In general, avoid mixing shares like `sapmnt` for non-production and production SAP systems in the same storage account.
* We recommend deploying on SLES 15 SP2 or higher to benefit from [NFS client improvements](../../storage/files/files-troubleshoot-linux-nfs.md#ls-hangs-for-large-directory-enumeration-on-some-kernels).
* Use a private endpoint. In the unlikely event of a zonal failure, your NFS sessions automatically redirect to a healthy zone. You don't have to remount the NFS shares on your VMs.
* If you're deploying your VMs across Availability Zones, use [Storage account with ZRS](../../storage/common/storage-redundancy.md#zone-redundant-storage) in the Azure regions that supports ZRS.
* Azure Files doesn't currently support automatic cross-region replication for disaster recovery scenarios.  

## Setting up (A)SCS

Next, you'll prepare and install the SAP ASCS and ERS instances.

### Create Pacemaker cluster

Follow the steps in [Setting up Pacemaker on SUSE Linux Enterprise Server in Azure](high-availability-guide-suse-pacemaker.md) to create a basic Pacemaker cluster for SAP (A)SCS.

### Installation

The following items are prefixed with either **[A]** - applicable to all nodes, **[1]** - only applicable to node 1 or **[2]** - only applicable to node 2.

1. **[A]** Install the latest version of SUSE Connector

    ```bash
    sudo zypper install sap-suse-cluster-connector
    ```

   > [!NOTE]
   > The known issue with using a dash in host names is fixed with version **3.1.1** of package **sap-suse-cluster-connector**. Make sure that you are using at least version 3.1.1 of package sap-suse-cluster-connector, if using cluster nodes with dash in the host name. Otherwise your cluster will not work.

   Make sure that you installed the new version of the SAP SUSE cluster connector. The old one was called sap_suse_cluster_connector and the new one is called **sap-suse-cluster-connector**.  

2. **[A]** Update SAP resource agents  

   A patch for the resource-agents package is required to use the new configuration that is described in this article. You can check, if the patch is already installed with the following command

    ```bash
    sudo grep 'parameter name="IS_ERS"' /usr/lib/ocf/resource.d/heartbeat/SAPInstance
    ```

   The output should be similar to

    ```bash
    <parameter name="IS_ERS" unique="0" required="0">;
    ```

   If the grep command does not find the IS_ERS parameter, you need to install the patch listed on [the SUSE download page](https://download.suse.com/patch/finder/#bu=suse&familyId=&productId=&dateRange=&startDate=&endDate=&priority=&architecture=&keywords=resource-agents)

3. **[A]** Set up host name resolution

   You can either use a DNS server or modify the /etc/hosts on all nodes. This example shows how to use the /etc/hosts file.
   Replace the IP address and the hostname in the following commands

    ```bash
    sudo vi /etc/hosts
    ```

   Insert the following lines to /etc/hosts. Change the IP address and hostname to match your environment

    ```bash
     # IP address of cluster node 1
     10.90.90.7    sap-cl1
     # IP address of cluster node 2
     10.90.90.8     sap-cl2
     # IP address of the load balancer frontend configuration for SAP Netweaver ASCS
     10.90.90.10   sapascs
     # IP address of the load balancer frontend configuration for SAP Netweaver ERS
     10.90.90.9    sapers
    ```

4. **[1]** Create the SAP directories on the NFS share.  
   Mount temporarily the NFS share **sapnw1** one of the VMs and create the SAP directories that will be used as nested mount points.  

    ```bash
    # mount temporarily the volume
    sudo mkdir -p /saptmp
    sudo mount -t nfs sapnfs.file.core.windows.net:/sapnfsafs/sapnw1 /saptmp -o noresvport,vers=4,minorversion=1,sec=sys
    # create the SAP directories
    sudo cd /saptmp
    sudo mkdir -p sapmntNW1
    sudo mkdir -p usrsapNW1ascs
    sudo mkdir -p usrsapNW1ers
    sudo mkdir -p usrsapNW1sys
    # unmount the volume and delete the temporary directory
    cd ..
    sudo umount /saptmp
    sudo rmdir /saptmp
    ```

## Prepare for SAP NetWeaver installation

1. **[A]** Create the shared directories

    ```bash
    sudo mkdir -p /sapmnt/NW1
    sudo mkdir -p /usr/sap/trans
    sudo mkdir -p /usr/sap/NW1/SYS
    sudo mkdir -p /usr/sap/NW1/ASCS00
    sudo mkdir -p /usr/sap/NW1/ERS01
    
    sudo chattr +i /sapmnt/NW1
    sudo chattr +i /usr/sap/trans
    sudo chattr +i /usr/sap/NW1/SYS
    sudo chattr +i /usr/sap/NW1/ASCS00
    sudo chattr +i /usr/sap/NW1/ERS01
    ```

2. **[A]** Mount the file systems that will not be controlled by the Pacemaker cluster.  

    ```bash
    vi /etc/fstab
    # Add the following lines to fstab, save and exit
    sapnfs.file.core.windows.net:/sapnfsafs/saptrans /usr/sap/trans  nfs noresvport,vers=4,minorversion=1,sec=sys  0  0
    sapnfs.file.core.windows.net:/sapnfsafs/sapnw1/sapmntNW1 /sapmnt/NW1  nfs noresvport,vers=4,minorversion=1,sec=sys  0  0
    sapnfs.file.core.windows.net:/sapnfsafs/sapnw1/usrsapNW1sys/ /usr/sap/NW1/SYS  nfs noresvport,vers=4,minorversion=1,sec=sys  0  0
    
    # Mount the file systems
    mount -a 
    ```

3. **[A]** Configure SWAP file

    ```bash
    sudo vi /etc/waagent.conf
    
    # Check if property ResourceDisk.Format is already set to y and if not, set it
    ResourceDisk.Format=y

    # Set the property ResourceDisk.EnableSwap to y
    # Create and use swapfile on resource disk.
    ResourceDisk.EnableSwap=y
   
    # Set the size of the SWAP file with property ResourceDisk.SwapSizeMB
    # The free space of resource disk varies by virtual machine size. Make sure that you do not set a value that is too big. You can check the SWAP space with command swapon
    # Size of the swapfile.
    ResourceDisk.SwapSizeMB=2000
    ```

   Restart the Agent to activate the change

    ```bash
    sudo service waagent restart
    ```

### Installing SAP NetWeaver ASCS/ERS

1. **[1]** Create a virtual IP resource and health-probe for the ASCS instance

   > [!IMPORTANT]
   > We recommend using azure-lb resource agent, which is part of package resource-agents, with the following package version requirements:
   >
   > * For SLES 12 SP4/SP5, the version must be at least resource-agents-4.3.018.a7fb5035-3.30.1.
   > * For SLES 15 and above, the version must be at least resource-agents-4.3.0184.6ee15eb2-4.13.1.  

    ```bash
    sudo crm node standby sap-cl2
    sudo crm configure primitive fs_NW1_ASCS Filesystem device='sapnfs.file.core.windows.net:/sapnfsafs/sapnw1/usrsapNW1ascs' directory='/usr/sap/NW1/ASCS00' fstype='nfs' options='noresvport,vers=4,minorversion=1,sec=sys' \
      op start timeout=60s interval=0 \
      op stop timeout=60s interval=0 \
      op monitor interval=20s timeout=40s
    
    sudo crm configure primitive vip_NW1_ASCS IPaddr2 \
      params ip=10.90.90.10 \
      op monitor interval=10 timeout=20
    
    sudo crm configure primitive nc_NW1_ASCS azure-lb port=62000 \
      op monitor timeout=20s interval=10
    
    sudo crm configure group g-NW1_ASCS fs_NW1_ASCS nc_NW1_ASCS vip_NW1_ASCS \
      meta resource-stickiness=3000
    ```

   Make sure that the cluster status is ok and that all resources are started. It is not important on which node the resources are running.

    ```bash
    sudo crm_mon -r
    # Node sap-cl2: standby
    # Online: [ sap-cl1 ]
    #
    # Full list of resources:
    #
    # stonith-sbd     (stonith:external/sbd): Started sap-cl1
    # Resource Group: g-NW1_ASCS
    #  fs_NW1_ASCS        (ocf::heartbeat:Filesystem):    Started sap-cl1
    #  nc_NW1_ASCS        (ocf::heartbeat:azure-lb):      Started sap-cl1
    #  vip_NW1_ASCS       (ocf::heartbeat:IPaddr2):       Started sap-cl1
   
    ```
  
2. **[1]** Install SAP NetWeaver ASCS  

   Install SAP NetWeaver ASCS as root on the first node using a virtual hostname that maps to the IP address of the load balancer frontend configuration for the ASCS, for example ***sapascs***, ***10.90.90.10*** and the instance number that you used for the probe of the load balancer, for example ***00***.

   You can use the sapinst parameter SAPINST_REMOTE_ACCESS_USER to allow a non-root user to connect to sapinst. You can use parameter SAPINST_USE_HOSTNAME to install SAP, using virtual hostname.

    ```bash
    sudo <swpm>/sapinst SAPINST_REMOTE_ACCESS_USER=sapadmin SAPINST_USE_HOSTNAME=<virtual_hostname>
    ```

   If the installation fails to create a subfolder in /usr/sap/**NW1**/ASCS**00**, try setting the owner and group of the ASCS**00**  folder and retry.

    ```bash
    chown nw1adm /usr/sap/NW1/ASCS00
    chgrp sapsys /usr/sap/NW1/ASCS00
    ```

3. **[1]** Create a virtual IP resource and health-probe for the ERS instance

    ```bash
    sudo crm node online sap-cl2
    sudo crm node standby sap-cl1
    sudo crm configure primitive fs_NW1_ERS Filesystem device='sapnfs.file.core.windows.net:/sapnfsafs/sapnw1/usrsapNW1ers' directory='/usr/sap/NW1/ERS01' fstype='nfs' options='noresvport,vers=4,minorversion=1,sec=sys' \
      op start timeout=60s interval=0 \
      op stop timeout=60s interval=0 \
      op monitor interval=20s timeout=40s
   
    sudo crm configure primitive vip_NW1_ERS IPaddr2 \
      params ip=10.90.90.9 \
      op monitor interval=10 timeout=20
   
    sudo crm configure primitive nc_NW1_ERS azure-lb port=62101 \
      op monitor timeout=20s interval=10
    
    sudo crm configure group g-NW1_ERS fs_NW1_ERS nc_NW1_ERS vip_NW1_ERS
    ```

   Make sure that the cluster status is ok and that all resources are started. It is not important on which node the resources are running.

    ```bash
    sudo crm_mon -r
   
    # Node sap-cl1: standby
    # Online: [ sap-cl2 ]
    # 
    # Full list of resources:
    #
    # stonith-sbd     (stonith:external/sbd): Started sap-cl2
    #  Resource Group: g-NW1_ASCS
    #      fs_NW1_ASCS        (ocf::heartbeat:Filesystem):    Started sap-cl2
    #      nc_NW1_ASCS        (ocf::heartbeat:azure-lb):      Started sap-cl2
    #      vip_NW1_ASCS       (ocf::heartbeat:IPaddr2):       Started sap-cl2
    #  Resource Group: g-NW1_ERS
    #      fs_NW1_ERS (ocf::heartbeat:Filesystem):    Started sap-cl2 
    #      nc_NW1_ERS (ocf::heartbeat:azure-lb):      Started sap-cl2
    #      vip_NW1_ERS  (ocf::heartbeat:IPaddr2):     Started sap-cl2
    ```

4. **[2]** Install SAP NetWeaver ERS

   Install SAP NetWeaver ERS as root on the second node using a virtual hostname that maps to the IP address of the load balancer frontend configuration for the ERS, for example **sapers**, **10.90.90.9** and the instance number that you used for the probe of the load balancer, for example **01**.

   You can use the sapinst parameter SAPINST_REMOTE_ACCESS_USER to allow a non-root user to connect to sapinst. You can use parameter SAPINST_USE_HOSTNAME to install SAP, using virtual hostname.

    ```bash
    <swpm>/sapinst SAPINST_REMOTE_ACCESS_USER=sapadmin SAPINST_USE_HOSTNAME=virtual_hostname
    ```

   > [!NOTE]
   > Use SWPM SP 20 PL 05 or higher. Lower versions do not set the permissions correctly and the installation will fail.

   If the installation fails to create a subfolder in /usr/sap/**NW1**/ERS**01**, try setting the owner and group of the ERS**01** folder and retry.

    ```bash
    chown nw1adm /usr/sap/NW1/ERS01
    chgrp sapsys /usr/sap/NW1/ERS01
    ```

5. **[1]** Adapt the ASCS/SCS and ERS instance profiles

   * ASCS/SCS profile

    ```bash
    sudo vi /sapmnt/NW1/profile/NW1_ASCS00_sapascs
    
    # Change the restart command to a start command
    #Restart_Program_01 = local $(_EN) pf=$(_PF)
    Start_Program_01 = local $(_EN) pf=$(_PF)
    
    # Add the following lines
    service/halib = $(DIR_EXECUTABLE)/saphascriptco.so
    service/halib_cluster_connector = /usr/bin/sap_suse_cluster_connector
    
    # Add the keep alive parameter, if using ENSA1
    enque/encni/set_so_keepalive = TRUE
    ```

   For both ENSA1 and ENSA2, make sure that the `keepalive` OS parameters are set as described in SAP note [1410736](https://launchpad.support.sap.com/#/notes/1410736).  

   * ERS profile

    ```bash
    sudo vi /sapmnt/NW1/profile/NW1_ERS01_sapers
     
    # Change the restart command to a start command
    #Restart_Program_00 = local $(_ER) pf=$(_PFL) NR=$(SCSID)
    Start_Program_00 = local $(_ER) pf=$(_PFL) NR=$(SCSID)
    
    # Add the following lines
    service/halib = $(DIR_EXECUTABLE)/saphascriptco.so
    service/halib_cluster_connector = /usr/bin/sap_suse_cluster_connector
    
    # remove Autostart from ERS profile
    # Autostart = 1
    ```

6. **[A]** Configure Keep Alive

   The communication between the SAP NetWeaver application server and the ASCS/SCS is routed through a software load balancer. The load balancer disconnects inactive connections after a configurable timeout. To prevent this you need to set a parameter in the SAP NetWeaver ASCS/SCS profile, if using ENSA1. Change the Linux system `keepalive` settings on all SAP servers for both ENSA1/ENSA2. Read [SAP Note 1410736][1410736] for more information.

    ```bash
    # Change the Linux system configuration
    sudo sysctl net.ipv4.tcp_keepalive_time=300
    ```

7. **[A]** Configure the SAP users after the installation

    ```bash
    # Add sidadm to the haclient group
    sudo usermod -aG haclient nw1adm
    ```

8. **[1]** Add the ASCS and ERS SAP services to the `sapservice` file

   Add the ASCS service entry to the second node and copy the ERS service entry to the first node.

    ```bash
    cat /usr/sap/sapservices | grep ASCS00 | sudo ssh sap-cl2 "cat >>/usr/sap/sapservices"
    sudo ssh sap-cl2 "cat /usr/sap/sapservices" | grep ERS01 | sudo tee -a /usr/sap/sapservices
    ```

9. **[A]** Disabling `systemd` services of the ASCS and ERS SAP instance. This step is only applicable, if SAP startup framework is managed by systemd as per SAP Note [3115048](https://me.sap.com/notes/3115048)

   > [!NOTE]
   > When managing SAP instances like SAP ASCS and SAP ERS using SLES cluster configuration, you would need to make additional modifications to integrate the cluster with the native systemd-based SAP start framework. This ensures that maintenance procedures do no compromise cluster stability. After installation or switching SAP startup framework to systemd-enabled setup as per SAP Note [3115048](https://me.sap.com/notes/3115048), you should disable the `systemd` services for the ASCS and ERS SAP instances.

   ```bash
   # Stop ASCS and ERS instances using <sid>adm
   sapcontrol -nr 00 -function Stop
   sapcontrol -nr 00 -function StopService

   sapcontrol -nr 01 -function Stop
   sapcontrol -nr 01 -function StopService

   # Execute below command on VM where you have performed ASCS instance installation (e.g. sap-cl1)
   sudo systemctl disable SAPNW1_00
   # Execute below command on VM where you have performed ERS instance installation (e.g. sap-cl2)
   sudo systemctl disable SAPNW1_01
   ```

10. **[1]** Create the SAP cluster resources

    Depending on whether you are running an ENSA1 or ENSA2 system, select respective tab to define the resources. SAP introduced support for [ENSA2](https://help.sap.com/docs/ABAP_PLATFORM_NEW/cff8531bc1d9416d91bb6781e628d4e0/6d655c383abf4c129b0e5c8683e7ecd8.html), including replication, in SAP NetWeaver 7.52. Starting with ABAP Platform 1809, ENSA2 is installed by default. For ENSA2 support, see SAP Note [2630416](https://launchpad.support.sap.com/#/notes/2630416).

    #### [ENSA1](#tab/ensa1)

    ```bash
    sudo crm configure property maintenance-mode="true"
   
    sudo crm configure primitive rsc_sap_NW1_ASCS00 SAPInstance \
     operations \$id=rsc_sap_NW1_ASCS00-operations \
     op monitor interval=11 timeout=60 on-fail=restart \
     params InstanceName=NW1_ASCS00_sapascs START_PROFILE="/sapmnt/NW1/profile/NW1_ASCS00_sapascs" \
     AUTOMATIC_RECOVER=false \
     meta resource-stickiness=5000 failure-timeout=60 migration-threshold=1 priority=10
   
    sudo crm configure primitive rsc_sap_NW1_ERS01 SAPInstance \
     operations \$id=rsc_sap_NW1_ERS01-operations \
     op monitor interval=11 timeout=60 on-fail=restart \
     params InstanceName=NW1_ERS01_sapers START_PROFILE="/sapmnt/NW1/profile/NW1_ERS01_sapers" AUTOMATIC_RECOVER=false IS_ERS=true \
     meta priority=1000
   
    sudo crm configure modgroup g-NW1_ASCS add rsc_sap_NW1_ASCS00
    sudo crm configure modgroup g-NW1_ERS add rsc_sap_NW1_ERS01
   
    sudo crm configure colocation col_sap_NW1_no_both -5000: g-NW1_ERS g-NW1_ASCS
    sudo crm configure location loc_sap_NW1_failover_to_ers rsc_sap_NW1_ASCS00 rule 2000: runs_ers_NW1 eq 1
    sudo crm configure order ord_sap_NW1_first_start_ascs Optional: rsc_sap_NW1_ASCS00:start rsc_sap_NW1_ERS01:stop symmetrical=false

    sudo crm_attribute --delete --name priority-fencing-delay
   
    sudo crm node online sap-cl1
    sudo crm configure property maintenance-mode="false"
    ```

    #### [ENSA2](#tab/ensa2)

    > [!NOTE]
    > If you have a two-node cluster running ENSA2, you have the option to configure priority-fencing-delay cluster property. This property introduces additional delay in fencing a node that has higher total resoure priority when a split-brain scenario occurs. For more information, see [SUSE Linux Enteprise Server high availability extension administration guide](https://documentation.suse.com/sle-ha/15-SP3/single-html/SLE-HA-administration/#pro-ha-storage-protect-fencing).
    >
    > The property priority-fencing-delay is only applicable for ENSA2 running on two-node cluster.

    ```bash
    sudo crm configure property maintenance-mode="true"

    sudo crm configure property priority-fencing-delay=30

    sudo crm configure primitive rsc_sap_NW1_ASCS00 SAPInstance \
     operations \$id=rsc_sap_NW1_ASCS00-operations \
     op monitor interval=11 timeout=60 on-fail=restart \
     params InstanceName=NW1_ASCS00_sapascs START_PROFILE="/sapmnt/NW1/profile/NW1_ASCS00_sapascs" \
     AUTOMATIC_RECOVER=false \
     meta resource-stickiness=5000 priority=100
  
    sudo crm configure primitive rsc_sap_NW1_ERS01 SAPInstance \
     operations \$id=rsc_sap_NW1_ERS01-operations \
     op monitor interval=11 timeout=60 on-fail=restart \
     params InstanceName=NW1_ERS01_sapers START_PROFILE="/sapmnt/NW1/profile/NW1_ERS01_sapers" AUTOMATIC_RECOVER=false IS_ERS=true
   
    sudo crm configure modgroup g-NW1_ASCS add rsc_sap_NW1_ASCS00
    sudo crm configure modgroup g-NW1_ERS add rsc_sap_NW1_ERS01
    
    sudo crm configure colocation col_sap_NW1_no_both -5000: g-NW1_ERS g-NW1_ASCS
    sudo crm configure order ord_sap_NW1_first_start_ascs Optional: rsc_sap_NW1_ASCS00:start rsc_sap_NW1_ERS01:stop symmetrical=false
   
    sudo crm node online sap-cl1
    sudo crm configure property maintenance-mode="false"
    ```

     ---

If you are upgrading from an older version and switching to enqueue server 2, see SAP note [2641019](https://launchpad.support.sap.com/#/notes/2641019).

Make sure that the cluster status is ok and that all resources are started. It is not important on which node the resources are running.

```bash
sudo crm_mon -r
# Full list of resources:
# 
# stonith-sbd     (stonith:external/sbd): Started sap-cl2
#  Resource Group: g-NW1_ASCS
#      fs_NW1_ASCS        (ocf::heartbeat:Filesystem):    Started sap-cl1
#      nc_NW1_ASCS        (ocf::heartbeat:azure-lb):      Started sap-cl1
#      vip_NW1_ASCS       (ocf::heartbeat:IPaddr2):       Started sap-cl1
#      rsc_sap_NW1_ASCS00 (ocf::heartbeat:SAPInstance):   Started sap-cl1
#  Resource Group: g-NW1_ERS
#      fs_NW1_ERS (ocf::heartbeat:Filesystem):    Started sap-cl2
#      nc_NW1_ERS (ocf::heartbeat:azure-lb):      Started sap-cl2
#      vip_NW1_ERS        (ocf::heartbeat:IPaddr2):       Started sap-cl2
#      rsc_sap_NW1_ERS01  (ocf::heartbeat:SAPInstance):   Started sap-cl1
```

## SAP NetWeaver application server preparation

Some databases require that the database instance installation is executed on an application server. Prepare the application server virtual machines to be able to use them in these cases.

The steps below assume that you install the application server on a server different from the ASCS/SCS and HANA servers. Otherwise some of the steps below (like configuring host name resolution) are not needed.

The following items are prefixed with either **[A]** - applicable to both PAS and AAS, **[P]** - only applicable to PAS or **[S]** - only applicable to AAS.

1. **[A]** Configure operating system

   Reduce the size of the dirty cache. For more information, see [Low write performance on SLES 11/12 servers with large RAM](https://www.suse.com/support/kb/doc/?id=7010287).

    ```bash
    sudo vi /etc/sysctl.conf
    # Change/set the following settings
    vm.dirty_bytes = 629145600
    vm.dirty_background_bytes = 314572800
    ```

1. **[A]** Set up host name resolution

   You can either use a DNS server or modify the /etc/hosts on all nodes. This example shows how to use the /etc/hosts file.
   Replace the IP address and the hostname in the following commands

    ```bash
    sudo vi /etc/hosts
    ```

   Insert the following lines to /etc/hosts. Change the IP address and hostname to match your environment

    ```bash
    10.90.90.7    sap-cl1
    10.90.90.8    sap-cl2
    # IP address of the load balancer frontend configuration for SAP Netweaver ASCS
    10.90.90.10   sapascs
    # IP address of the load balancer frontend configuration for SAP Netweaver ERS
    10.90.90.9    sapers
    10.90.90.12   sapa01
    10.90.90.13   sapa02
    ```

1. **[A]** Create the sapmnt directory

    ```bash
    sudo mkdir -p /sapmnt/NW1
    sudo mkdir -p /usr/sap/trans

    sudo chattr +i /sapmnt/NW1
    sudo chattr +i /usr/sap/trans
    ```

1. **[A]** Mount the file systems

    ```bash
    vi /etc/fstab
    # Add the following lines to fstab, save and exit
    sapnfs.file.core.windows.net:/sapnfsafs/saptrans /usr/sap/trans  nfs noresvport,vers=4,minorversion=1,sec=sys  0  0
    sapnfs.file.core.windows.net:/sapnfsafs/sapnw1/sapmntNW1 /sapmnt/NW1  nfs noresvport,vers=4,minorversion=1,sec=sys  0  0
    
    # Mount the file systems
    mount -a 
    ```

1. **[A]** Configure SWAP file

    ```bash
   sudo vi /etc/waagent.conf
   
   # Set the property ResourceDisk.EnableSwap to y
   # Create and use swapfile on resource disk.
   ResourceDisk.EnableSwap=y
    
   # Set the size of the SWAP file with property ResourceDisk.SwapSizeMB
   # The free space of resource disk varies by virtual machine size. Make sure that you do not set a value that is too big. You can check the SWAP space with command swapon
   # Size of the swapfile.
   ResourceDisk.SwapSizeMB=2000
   ```

   Restart the Agent to activate the change

   ```bash
   sudo service waagent restart
   ```

## Install database

In this example, SAP NetWeaver is installed on SAP HANA. You can use every supported database for this installation. For more information on how to install SAP HANA in Azure, see [High Availability of SAP HANA on Azure Virtual Machines (VMs)][sap-hana-ha]. For a list of supported databases, see [SAP Note 1928533][1928533].

Install the SAP NetWeaver database instance as root using a virtual hostname that maps to the IP address of the load balancer frontend configuration for the database.  
You can use the sapinst parameter SAPINST_REMOTE_ACCESS_USER to allow a non-root user to connect to sapinst.

```bash
sudo <swpm>/sapinst SAPINST_REMOTE_ACCESS_USER=sapadmin
```

## SAP NetWeaver application server installation

Follow these steps to install an SAP application server.

1. **[A]** Prepare application server
   Follow the steps in the chapter [SAP NetWeaver application server preparation](#sap-netweaver-application-server-preparation) above to prepare the application server.

2. **[A]** Install SAP NetWeaver application server.  
   Install a primary or additional SAP NetWeaver applications server.

   You can use the sapinst parameter SAPINST_REMOTE_ACCESS_USER to allow a non-root user to connect to sapinst.

   ```bash
   sudo <swpm>/sapinst SAPINST_REMOTE_ACCESS_USER=sapadmin
   ```

3. **[A]** Update SAP HANA secure store

   Update the SAP HANA secure store to point to the virtual name of the SAP HANA System Replication setup.

   Run the following command to list the entries

   ```bash
   hdbuserstore List
   ```

   The command should list all entries and should look similar to

   ```bash
   DATA FILE       : /home/nw1adm/.hdb/sapa01/SSFS_HDB.DAT
   KEY FILE        : /home/nw1adm/.hdb/sapa01/SSFS_HDB.KEY
   
   KEY DEFAULT 
     ENV : 10.90.90.5:30313
     USER: SAPABAP1
     DATABASE: NW1
   ```

   In this example, the IP address of the default entry points to the VM, not the load balancer. Change the entry to point to the virtual hostname of the load balancer. Make sure to use the same port and database name. For example, `30313` and `NW1` in the sample output.

   ```bash
   su - nw1adm
   hdbuserstore SET DEFAULT nw1db:30313@NW1 SAPABAP1 <password of ABAP schema>
   ```

## Test cluster setup

Thoroughly test your Pacemaker cluster. [Execute the typical failover tests](./high-availability-guide-suse.md#test-the-cluster-setup).

## Next steps

* [HA for SAP NW on Azure VMs on SLES for SAP applications multi-SID guide](./high-availability-guide-suse-multi-sid.md)
* [Azure Virtual Machines planning and implementation for SAP][planning-guide]
* [Azure Virtual Machines deployment for SAP][deployment-guide]
* [Azure Virtual Machines DBMS deployment for SAP][dbms-guide]
* To learn how to establish high availability and plan for disaster recovery of SAP HANA on Azure VMs, see [High Availability of SAP HANA on Azure Virtual Machines (VMs)][sap-hana-ha]
