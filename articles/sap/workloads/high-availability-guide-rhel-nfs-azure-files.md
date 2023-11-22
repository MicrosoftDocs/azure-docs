---
title: Azure VMs high availability for SAP NW on RHEL with NFS on Azure Files| Microsoft Docs
description: Establish high availability for SAP NetWeaver on Azure Virtual Machines Red Hat Enterprise Linux (RHEL) with NFS on Azure Files.
author: rdeltcheva
manager: juergent
tags: azure-resource-manager
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: tutorial
ms.workload: infrastructure-services
ms.date: 11/20/2023
ms.author: radeltch
---

# High availability for SAP NetWeaver on VMs on RHEL with NFS on Azure Files

[dbms-guide]:dbms-guide-general.md
[deployment-guide]:deployment-guide.md
[planning-guide]:planning-guide.md

[afs-azure-doc]:../../storage/files/storage-files-introduction.md
[afs-avail-matrix]:https://azure.microsoft.com/global-infrastructure/services/?products=storage&regions=all

[2002167]:https://launchpad.support.sap.com/#/notes/2002167
[2772999]:https://launchpad.support.sap.com/#/notes/2772999
[3108316]:https://launchpad.support.sap.com/#/notes/3108316
[2009879]:https://launchpad.support.sap.com/#/notes/2009879
[1928533]:https://launchpad.support.sap.com/#/notes/1928533
[2015553]:https://launchpad.support.sap.com/#/notes/2015553
[2178632]:https://launchpad.support.sap.com/#/notes/2178632
[2191498]:https://launchpad.support.sap.com/#/notes/2191498
[2243692]:https://launchpad.support.sap.com/#/notes/2243692
[1999351]:https://launchpad.support.sap.com/#/notes/1999351
[1410736]:https://launchpad.support.sap.com/#/notes/1410736
[2360818]:https://launchpad.support.sap.com/#/notes/2360818

[sap-hana-ha]:sap-hana-high-availability-rhel.md

This article describes how to deploy and configure virtual machines (VMs), install the cluster framework, and install a high-availability (HA) SAP NetWeaver system by using [NFS on Azure Files](../../storage/files/files-nfs-protocol.md). The example configurations use VMs that run on Red Hat Enterprise Linux (RHEL).  

## Prerequisites

* [Azure Files documentation][afs-azure-doc]
* SAP Note [1928533], which has:
  * A list of Azure VM sizes that are supported for the deployment of SAP software.
  * Important capacity information for Azure VM sizes.
  * Supported SAP software and operating system (OS) and database combinations.
  * Required SAP kernel version for Windows and Linux on Microsoft Azure.
* SAP Note [2015553] lists prerequisites for SAP-supported SAP software deployments in Azure.
* SAP Note [2002167] has recommended OS settings for Red Hat Enterprise Linux 7.x.
* SAP Note [2772999] has recommended OS settings for Red Hat Enterprise Linux 8.x.
* SAP Note [2009879] has SAP HANA Guidelines for Red Hat Enterprise Linux.
* SAP Note [2178632] has detailed information about all monitoring metrics reported for SAP in Azure.
* SAP Note [2191498] has the required SAP Host Agent version for Linux in Azure.
* SAP Note [2243692] has information about SAP licensing on Linux in Azure.
* SAP Note [1999351] has more troubleshooting information for the Azure Enhanced Monitoring Extension for SAP.
* [SAP Community WIKI](https://wiki.scn.sap.com/wiki/display/HOME/SAPonLinuxNotes) has all required SAP Notes for Linux.
* [Azure Virtual Machines planning and implementation for SAP on Linux][planning-guide]
* [Azure Virtual Machines deployment for SAP on Linux][deployment-guide]
* [Azure Virtual Machines DBMS deployment for SAP on Linux][dbms-guide]
* [SAP Netweaver in Pacemaker cluster](https://access.redhat.com/articles/3150081)
* General RHEL documentation:
  * [High Availability Add-On Overview](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/high_availability_add-on_overview/index)
  * [High Availability Add-On Administration](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/high_availability_add-on_administration/index)
  * [High Availability Add-On Reference](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/high_availability_add-on_reference/index)
  * [Configuring ASCS/ERS for SAP NetWeaver with Standalone Resources in RHEL 7.5](https://access.redhat.com/articles/3569681)
  * [Configure SAP S/4HANA ASCS/ERS with Standalone Enqueue Server 2 (ENSA2) in Pacemaker on RHEL](https://access.redhat.com/articles/3974941)
* Azure-specific RHEL documentation:
  * [Support Policies for RHEL High Availability Clusters - Microsoft Azure Virtual Machines as Cluster Members](https://access.redhat.com/articles/3131341)
  * [Installing and Configuring a Red Hat Enterprise Linux 7.4 (and later) High-Availability Cluster on Microsoft Azure](https://access.redhat.com/articles/3252491)

## Overview

To deploy the SAP NetWeaver application layer, you need shared directories like `/sapmnt/SID` and `/usr/sap/trans` in the environment. Additionally, when you deploy an HA SAP system, you need to protect and make highly available file systems like `/sapmnt/SID` and `/usr/sap/SID/ASCS`.

Now you can place these file systems on [NFS on Azure Files](../../storage/files/files-nfs-protocol.md). NFS on Azure Files is an HA storage solution. This solution offers synchronous zone-redundant storage (ZRS) and is suitable for SAP ASCS/ERS instances deployed across availability zones. You still need a Pacemaker cluster to protect single point of failure components like SAP NetWeaver central services (ASCS/SCS).

The example configurations and installation commands use the following instance numbers:

| Instance name | Instance number |
| ---------------- | ------------------ |
| ABAP SAP central services (ASCS) | 00 |
| ERS | 01 |
| ABAP SAP central services (ASCS) | 02 |
| Additional application server (AAS) | 03 |
| SAP system identifier | NW1 |

:::image type="complex" source="./media/high-availability-guide-rhel/high-availability-guide-rhel-nfs-azure-files.png" alt-text="Diagram that shows SAP NetWeaver high availability with NFS on Azure Files.":::
   This diagram shows a typical SAP NetWeaver HA architecture. The `sapmnt` and `saptrans` file systems are deployed on NFS shares on Azure Files. The SAP central services are protected by a Pacemaker cluster. The clustered VMs are behind an instance of Azure Load Balancer. The NFS shares are mounted through private endpoints.
:::image-end:::

## Prepare infrastructure

This document assumes that you already deployed an [Azure virtual network](../../virtual-network/virtual-networks-overview.md), subnet, and resource group.

1. Deploy your VMs. Choose a [suitable deployment type](./sap-high-availability-architecture-scenarios.md#comparison-of-different-deployment-types-for-sap-workload). You can deploy VMs in availability zones, if the Azure region supports zones, or in availability sets. If you need more IP addresses for your VMs, deploy and attach a second NIC. Don't add secondary IP addresses to the primary NIC. [Azure Load Balancer Floating IP doesn't support this scenario](../../load-balancer/load-balancer-multivip-overview.md#limitations).  

1. For your virtual IPs, deploy and configure an instance of [Load Balancer](../../load-balancer/load-balancer-overview.md). We recommend that you use a [Standard load balancer](../../load-balancer/quickstart-load-balancer-standard-public-portal.md).

    1. Configure two front-end IPs. One is for ASCS (`10.90.90.10`) and one is for ERS (`10.90.90.9`).
    1. Create a back-end pool and add both VMs, which will be part of the cluster.
    1. Create the health probe for ASCS. The probe port is `62000`. Create the probe port for ERS. The ERS probe port is `62101`. When you configure the Pacemaker resources later on, you must use matching probe ports.
    1. Configure the load-balancing rules for ASCS and ERS. Select the corresponding front IPs, health probes, and the back-end pool. Select HA ports, increase the idle timeout to 30 minutes, and enable floating IP.

### Deploy Azure Files storage account and NFS shares

NFS on Azure Files runs on top of [Azure Files premium storage][afs-azure-doc]. Before you set up NFS on Azure Files, see [How to create an NFS share](../../storage/files/storage-files-how-to-create-nfs-shares.md?tabs=azure-portal).

There are two options for redundancy within an Azure region:

* [Locally redundant storage (LRS)](../../storage/common/storage-redundancy.md#locally-redundant-storage), which offers local, in-zone synchronous data replication.
* [Zone-redundant storage (ZRS)](../../storage/common/storage-redundancy.md#zone-redundant-storage), which replicates your data synchronously across the three [availability zones](../../availability-zones/az-overview.md) in the region.

Check if your selected Azure region offers NFS 4.1 on Azure Files with the appropriate redundancy. Review the [availability of Azure Files by Azure region][afs-avail-matrix] under **Premium Files Storage**. If your scenario benefits from ZRS, [verify that premium file shares with ZRS are supported in your Azure region](../../storage/common/storage-redundancy.md#zone-redundant-storage).

We recommend that you access your Azure Storage account through an [Azure private endpoint](../../storage/files/storage-files-networking-endpoints.md?tabs=azure-portal). Make sure to deploy the Azure Files storage account endpoint and the VMs, where you need to mount the NFS shares, in the same Azure virtual network or peered Azure virtual networks.

1. Deploy an Azure Files storage account named `sapafsnfs`. In this example, we use ZRS. If you're not familiar with the process, see [Create a storage account](../../storage/files/storage-how-to-create-file-share.md?tabs=azure-portal#create-a-storage-account) for the Azure portal.

1. On the **Basics** tab, use these settings:
    1. For **Storage account name**, enter `sapafsnfs`.
    1. For **Performance**, select **Premium**.
    1. For **Premium account type**, select **FileStorage**.
    1. For **Replication**, select **zone redundancy (ZRS)**.
1. Select **Next**.
1. On the **Advanced** tab, clear **Require secure transfer for REST API Operations**. If you don't clear this option, you can't mount the NFS share to your VM. The mount operation will time out.
1. Select **Next**.
1. In the **Networking** section, configure these settings:
    1. Under **Networking connectivity**, for **Connectivity method**, select **Private endpoint**.
    1. Under **Private endpoint**, select **Add private endpoint**.
1. On the **Create private endpoint** pane, select your **Subscription**, **Resource group**, and **Location**.
   For **Name**, enter `sapafsnfs_pe`.
   For **Storage sub-resource**, select **file**.
   Under **Networking**, for **Virtual network**, select the virtual network and subnet to use. Again, you can use the virtual network where your SAP VMs are or a peered virtual network.
   Under **Private DNS integration**, accept the default option **Yes** for **Integrate with private DNS zone**. Make sure to select your **Private DNS Zone**.
   Select **OK**.
1. On the **Networking** tab again, select **Next**.
1. On the **Data protection** tab, keep all the default settings.
1. Select **Review + create** to validate your configuration.
1. Wait for the validation to finish. Fix any issues before you continue.
1. On the **Review + create** tab, select **Create**.

Next, deploy the NFS shares in the storage account you created. In this example, there are two NFS shares, `sapnw1` and `saptrans`.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select or search for **Storage accounts**.
1. On the **Storage accounts** page, select **sapafsnfs**.
1. On the resource menu for **sapafsnfs**, under **Data storage**, select **File shares**.
1. On the **File shares** page, select **File share**.
   1. For **Name**, enter `sapnw1`, `saptrans`.
   1. Select an appropriate share size. For example, **128 GB**.  Consider the size of the data stored on the share and IOPS and throughput requirements. For more information, see [Azure file share targets](../../storage/files/storage-files-scale-targets.md#azure-file-share-scale-targets).
   1. Select **NFS** as the protocol.
   1. Select **No root Squash**. Otherwise, when you mount the shares on your VMs, you can't see the file owner or group.

> [!IMPORTANT]
> The preceding share size is only an example. Make sure to size your shares appropriately. Size is not only based on the size of the of data stored on the share but also based on the requirements for IOPS and throughput. For more information, see [Azure file share targets](../../storage/files/storage-files-scale-targets.md#azure-file-share-scale-targets).  

The SAP file systems that don't need to be mounted via NFS can also be deployed on [Azure disk storage](../../virtual-machines/disks-types.md#premium-ssds). In this example, you can deploy `/usr/sap/NW1/D02` and `/usr/sap/NW1/D03` on Azure disk storage.

### Important considerations for NFS on Azure Files shares

When you plan your deployment with NFS on Azure Files, consider the following important points:  

* The minimum share size is 100 GiB. You only pay for the [capacity of the provisioned shares](../../storage/files/understanding-billing.md#provisioned-model).
* Size your NFS shares not only based on capacity requirements but also on IOPS and throughput requirements. For more information, see [Azure file share targets](../../storage/files/storage-files-scale-targets.md#azure-file-share-scale-targets).
* Test the workload to validate your sizing and ensure that it meets your performance targets. To learn how to troubleshoot performance issues with NFS on Azure Files, see [Troubleshoot Azure file share performance](../../storage/files/files-troubleshoot-performance.md).
* For SAP J2EE systems, it's not supported to place `/usr/sap/<SID>/J<nr>` on NFS on Azure Files.
* If your SAP system has a heavy batch jobs load, you might have millions of job logs. If the SAP batch job logs are stored in the file system, pay special attention to the sizing of the `sapmnt` share. As of SAP_BASIS 7.52, the default behavior for the batch job logs is to be stored in the database. For more information, see [Job log in the database][2360818].
* Deploy a separate `sapmnt` share for each SAP system.
* Don't use the `sapmnt` share for any other activity, such as interfaces, or `saptrans`.
* Don't use the `saptrans` share for any other activity, such as interfaces, or `sapmnt`.
* Avoid consolidating the shares for too many SAP systems in a single storage account. There are also [storage account performance scale targets](../../storage/files/storage-files-scale-targets.md#storage-account-scale-targets). Be careful not to exceed the limits for the storage account, too.
* In general,  don't consolidate the shares for more than five SAP systems in a single storage account. This guideline helps avoid exceeding the storage account limits and simplifies performance analysis.
* In general, avoid mixing shares like `sapmnt` for nonproduction and production SAP systems in the same storage account.
* We recommend that you deploy on RHEL 8.4 or higher to benefit from [NFS client improvements](../../storage/files/files-troubleshoot-linux-nfs.md#ls-hangs-for-large-directory-enumeration-on-some-kernels).
* Use a private endpoint. In the unlikely event of a zonal failure, your NFS sessions automatically redirect to a healthy zone. You don't have to remount the NFS shares on your VMs.
* If you're deploying your VMs across availability zones, use a [storage account with ZRS](../../storage/common/storage-redundancy.md#zone-redundant-storage) in the Azure regions that support ZRS.
* Azure Files doesn't currently support automatic cross-region replication for disaster recovery scenarios.

## Set up (A)SCS

In this example, you deploy the resources manually through the [Azure portal](https://portal.azure.com/#home).

### Deploy Azure Load Balancer via the Azure portal

After you deploy the VMs for your SAP system, create a load balancer. Then, use the VMs in the back-end pool.

1. Create an internal, Standard instance of Load Balancer.
   1. Create the front-end IP addresses.
      1. IP address 10.90.90.10 for the ASCS:
         1. Open the load balancer, select the front-end IP pool, and select **Add**.
         1. Enter the name of the new front-end IP pool (for example, **frontend.NW1.ASCS**).
         1. Set the **Assignment** to **Static** and enter the IP address (for example, **10.90.90.10**).
         1. Select **OK**.
      1. IP address 10.90.90.9 for the ASCS ERS:
         * Repeat the preceding steps under "a" to create an IP address for the ERS (for example, **10.90.90.9** and **frontend.NW1.ERS**).
   1. Create a single back-end pool:
      1. Open the load balancer, select **Backend pools**, and then select **Add**.
      1. Enter the name of the new back-end pool (for example, **backend.NW1**).
      1. Select **NIC** for **Backend Pool Configuration**.
      1. Select **Add a virtual machine**.
      1. Select the VMs of the ASCS cluster.
      1. Select **Add**.
      1. Select **Save**.
   1. Create the health probes.
      1. Port 620**00** for ASCS:
         1. Open the load balancer, select **Health probes**, and select **Add**.
         1. Enter the name of the new health probe (for example, **health.NW1.ASCS**).
         1. Select **TCP** as the protocol and the port 620**00** and keep **Interval 5**.  
         1. Select **OK**.
      1. Port 621**01** for ASCS ERS:
         * Repeat the preceding steps under "c" to create a health probe for the ERS (for example, 621**01** and **health.NW1.ERS**).
   1. Create load-balancing rules.
      1. Create a back-end pool for the ASCS:
         1. Open the load balancer, select **Load-balancing rules**, and select **Add**.
         1. Enter the name of the new load balancer rule (for example, **lb.NW1.ASCS**).
         1. Select the front-end IP address for ASCS, the back-end pool, and the health probe you created earlier (for example, **frontend.NW1.ASCS**, **backend.NW1**, and **health.NW1.ASCS**).
         1. Select **HA ports**.
         1. Increase the idle timeout to **30 minutes**.
         1. Make sure to enable **Floating IP**.
         1. Select **OK**.
         * Repeat the preceding steps to create load-balancing rules for ERS (for example, **lb.NW1.ERS**).

> [!IMPORTANT]
> Floating IP isn't supported on a NIC secondary IP configuration in load-balancing scenarios. For more information, see [Load Balancer limitations](../../load-balancer/load-balancer-multivip-overview.md#limitations). If you need another IP address for the VM, deploy a second NIC.

> [!NOTE]
> When VMs without public IP addresses are placed in the back-end pool of an internal (no public IP address) Standard instance of Load Balancer, there's no outbound internet connectivity unless more configuration is performed to allow routing to public endpoints. For more information on how to achieve outbound connectivity, see [Public endpoint connectivity for virtual machines using Azure Standard Load Balancer in SAP high-availability scenarios](./high-availability-guide-standard-load-balancer-outbound-connections.md).  

> [!IMPORTANT]
> Don't enable TCP timestamps on Azure VMs placed behind Load Balancer. Enabling TCP timestamps causes the health probes to fail. Set the parameter **net.ipv4.tcp_timestamps** to **0**. For more information, see [Load Balancer health probes](../../load-balancer/load-balancer-custom-probe-overview.md).

### Create a Pacemaker cluster

Follow the steps in [Set up Pacemaker on Red Hat Enterprise Linux in Azure](high-availability-guide-rhel-pacemaker.md) to create a basic Pacemaker cluster for this (A)SCS server.

### Prepare for an SAP NetWeaver installation

The following items are prefixed with:

- **[A]**: Applicable to all nodes
- **[1]**: Only applicable to node 1
- **[2]**: Only applicable to node 2

1. **[A]** Set up hostname resolution.

   You can either use a DNS server or modify the `/etc/hosts` file on all nodes. This example shows how to use the `/etc/hosts` file. Replace the IP address and the hostname in the following commands:

    ```bash
    sudo vi /etc/hosts
    ```

   Insert the following lines to `/etc/hosts`. Change the IP address and hostname to match your environment.

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

1. **[A]** Install the NFS client and other requirements.

    ```bash
    sudo yum -y install nfs-utils resource-agents resource-agents-sap
    ```

1. **[1]** Create the SAP directories on the NFS share.  
    Mount the NFS share **sapnw1** temporarily on one of the VMs, and create the SAP directories that will be used as nested mount points.

    ```bash
    # mount temporarily the volume
    sudo mkdir -p /saptmp
    sudo mount -t nfs sapnfs.file.core.windows.net:/sapnfsafs/sapnw1 /saptmp -o vers=4,minorversion=1,sec=sys
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

1. **[A]** Create the shared directories.

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

1. **[A]** Check the version of `resource-agents-sap`.

   Make sure that the version of the installed `resource-agents-sap` package is at least `3.9.5-124.el7`.

   ```bash
   sudo yum info resource-agents-sap
   ```

1. **[A]** Add mount entries.

    ```bash
    vi /etc/fstab
    # Add the following lines to fstab, save and exit
    sapnfs.file.core.windows.net:/sapnfsafs/saptrans /usr/sap/trans  nfs vers=4,minorversion=1,sec=sys  0  0
    sapnfs.file.core.windows.net:/sapnfsafs/sapnw1/sapmntNW1 /sapmnt/NW1  nfs vers=4,minorversion=1,sec=sys  0  0
    sapnfs.file.core.windows.net:/sapnfsafs/sapnw1/usrsapNW1sys/ /usr/sap/NW1/SYS  nfs vers=4,minorversion=1,sec=sys  0  0
    
    # Mount the file systems
    mount -a 
    ```

1. **[A]** Configure the SWAP file.

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

   Restart the agent to activate the change.

    ```bash
    sudo service waagent restart
    ```

1. **[A]** Configure RHEL.

   Configure RHEL as described in SAP Note [2002167] for RHEL 7.x, SAP Note [2772999] for RHEL 8.x, or SAP Note [3108316] for RHEL 9.x.

### Install SAP NetWeaver ASCS/ERS

1. **[1]** Configure the cluster default properties.

    ```bash
    # If using RHEL 7.x
    pcs resource defaults resource-stickiness=1
    pcs resource defaults migration-threshold=3
    # If using RHEL 8.x or later
    pcs resource defaults update resource-stickiness=1
    pcs resource defaults update migration-threshold=3
    ```

1. **[1]** Create a virtual IP resource and health probe for the ASCS instance.

    ```bash
    sudo pcs node standby sap-cl2
   
    sudo pcs resource create fs_NW1_ASCS Filesystem device='sapnfs.file.core.windows.net:/sapnfsafs/sapnw1/usrsapNW1ascs' \
      directory='/usr/sap/NW1/ASCS00' fstype='nfs' force_unmount=safe options='sec=sys,vers=4.1' \
      op start interval=0 timeout=60 op stop interval=0 timeout=120 op monitor interval=200 timeout=40 \
      --group g-NW1_ASCS
   
    sudo pcs resource create vip_NW1_ASCS IPaddr2 \
      ip=10.90.90.10 \
      --group g-NW1_ASCS
   
    sudo pcs resource create nc_NW1_ASCS azure-lb port=62000 \
      --group g-NW1_ASCS
    ```

   Make sure that the cluster status is okay and that all resources are started. Which node the resources are running on isn't important.

    ```bash
    sudo pcs status
    
    # Node sap-cl2: standby
    # Online: [ sap-cl1 ]
    #
    # Full list of resources:
    #
    # rsc_st_azure    (stonith:fence_azure_arm):      Started sap-cl1
    #  Resource Group: g-NW1_ASCS
    #      fs_NW1_ASCS        (ocf::heartbeat:Filesystem):    Started sap-cl1 
    #      nc_NW1_ASCS        (ocf::heartbeat:azure-lb):      Started sap-cl1
    #      vip_NW1_ASCS       (ocf::heartbeat:IPaddr2):       Started sap-cl1
    ```

1. **[1]** Install SAP NetWeaver ASCS.

   Install SAP NetWeaver ASCS as the root on the first node by using a virtual hostname that maps to the IP address of the load balancer front-end configuration for the ASCS, for example, **sapascs** and **10.90.90.10**, and the instance number that you used for the probe of the load balancer, for example, **00**.

   You can use the `sapinst` parameter `SAPINST_REMOTE_ACCESS_USER` to allow a nonroot user to connect to `sapinst`.

    ```bash
    # Allow access to SWPM. This rule is not permanent. If you reboot the machine, you have to run the command again.
    sudo firewall-cmd --zone=public  --add-port=4237/tcp
   
    sudo <swpm>/sapinst SAPINST_REMOTE_ACCESS_USER=sapadmin SAPINST_USE_HOSTNAME=<virtual_hostname>
    ```

    If the installation fails to create a subfolder in /usr/sap/**NW1**/ASCS**00**, try setting the owner and group of the ASCS**00** folder and retry.

    ```bash
    sudo chown nw1adm /usr/sap/NW1/ASCS00
    sudo chgrp sapsys /usr/sap/NW1/ASCS00
    ```

1. **[1]** Create a virtual IP resource and health probe for the ERS instance.

    ```bash
    sudo pcs node unstandby sap-cl2
    sudo pcs node standby sap-cl1
    
    sudo pcs resource create fs_NW1_AERS Filesystem device='sapnfs.file.core.windows.net:/sapnfsafs/sapnw1/usrsapNW1ers' \
      directory='/usr/sap/NW1/ERS01' fstype='nfs' force_unmount=safe options='sec=sys,vers=4.1' \
      op start interval=0 timeout=60 op stop interval=0 timeout=120 op monitor interval=200 timeout=40 \
     --group g-NW1_AERS
   
    sudo pcs resource create vip_NW1_AERS IPaddr2 \
      ip=10.90.90.9 \
     --group g-NW1_AERS
   
    sudo pcs resource create nc_NW1_AERS azure-lb port=62101 \
     --group g-NW1_AERS
    ```

   Make sure that the cluster status is okay and that all resources are started. Which node the resources are running on isn't important.

    ```bash
    sudo pcs status
   
    # Node sap-cl1: standby
    # Online: [ sap-cl2 ]
    #
    # Full list of resources:
    #
    # rsc_st_azure    (stonith:fence_azure_arm):      Started sap-cl2
    #  Resource Group: g-NW1_ASCS
    #      fs_NW1_ASCS        (ocf::heartbeat:Filesystem):    Started sap-cl2
    #      nc_NW1_ASCS        (ocf::heartbeat:azure-lb):      Started sap-cl2
    #      vip_NW1_ASCS       (ocf::heartbeat:IPaddr2):       Started sap-cl2
    #  Resource Group: g-NW1_AERS
    #      fs_NW1_AERS        (ocf::heartbeat:Filesystem):    Started sap-cl2
    #      nc_NW1_AERS        (ocf::heartbeat:azure-lb):      Started sap-cl2
    #      vip_NW1_AERS       (ocf::heartbeat:IPaddr2):       Started sap-cl2
    ```

1. **[2]** Install SAP NetWeaver ERS.

   Install SAP NetWeaver ERS as the root on the second node by using a virtual hostname that maps to the IP address of the load balancer front-end configuration for the ERS, for example, **sapers** and **10.90.90.9**, and the instance number that you used for the probe of the load balancer, for example, **01**.

   You can use the `sapinst` parameter `SAPINST_REMOTE_ACCESS_USER` to allow a nonroot user to connect to `sapinst`.

    ```bash
    # Allow access to SWPM. This rule is not permanent. If you reboot the machine, you have to run the command again.
    sudo firewall-cmd --zone=public  --add-port=4237/tcp

    sudo <swpm>/sapinst SAPINST_REMOTE_ACCESS_USER=sapadmin SAPINST_USE_HOSTNAME=<virtual_hostname>
    ```

   If the installation fails to create a subfolder in /usr/sap/**NW1**/ERS**01**, try setting the owner and group of the ERS**01** folder and retry.

    ```bash
    sudo chown qaadm /usr/sap/NW1/ERS01
    sudo chgrp sapsys /usr/sap/NW1/ERS01
    ```

1. **[1]** Adapt the ASCS/SCS and ERS instance profiles.

   * ASCS/SCS profile:

     ```bash
     sudo vi /sapmnt/NW1/profile/NW1_ASCS00_sapascs
   
     # Change the restart command to a start command
     #Restart_Program_01 = local $(_EN) pf=$(_PF)
     Start_Program_01 = local $(_EN) pf=$(_PF)
   
     # Add the keep alive parameter, if using ENSA1
     enque/encni/set_so_keepalive = true
     ```

     For both ENSA1 and ENSA2, make sure that the `keepalive` OS parameters are set as described in SAP Note [1410736](https://launchpad.support.sap.com/#/notes/1410736).  

   * ERS profile:

     ```bash
     sudo vi /sapmnt/NW1/profile/NW1_ERS01_sapers
   
     # Change the restart command to a start command
     #Restart_Program_00 = local $(_ER) pf=$(_PFL) NR=$(SCSID)
     Start_Program_00 = local $(_ER) pf=$(_PFL) NR=$(SCSID)
   
     # remove Autostart from ERS profile
     # Autostart = 1
     ```

1. **[A]** Configure Keep Alive.

   The communication between the SAP NetWeaver application server and the ASCS/SCS is routed through a software load balancer. The load balancer disconnects inactive connections after a configurable timeout. To prevent this action, set a parameter in the SAP NetWeaver ASCS/SCS profile, if you're using ENSA1. Change the Linux system `keepalive` settings on all SAP servers for both ENSA1 and ENSA2. For more information, see SAP Note [1410736][1410736].

    ```bash
    # Change the Linux system configuration
    sudo sysctl net.ipv4.tcp_keepalive_time=300
    ```

1. **[A]** Update the `/usr/sap/sapservices` file.

   To prevent the start of the instances by the `sapinit` startup script, all instances managed by Pacemaker must be commented out from the `/usr/sap/sapservices` file.

    ```bash
    sudo vi /usr/sap/sapservices
   
    # Depending on whether the SAP Startup framework is integrated with systemd, you will observe one of the two entries on the ASCS node. You should comment out the line(s). 
    # LD_LIBRARY_PATH=/usr/sap/NW1/ASCS00/exe:$LD_LIBRARY_PATH; export LD_LIBRARY_PATH; /usr/sap/NW1/ASCS00/exe/sapstartsrv pf=/usr/sap/NW1/SYS/profile/NW1_ASCS00_sapascs -D -u nw1adm
    # systemctl --no-ask-password start SAPNW1_00 # sapstartsrv pf=/usr/sap/NW1/SYS/profile/NW1_ASCS00_sapascs
   
    # Depending on whether the SAP Startup framework is integrated with systemd, you will observe one of the two entries on the ERS node. You should comment out the line(s). 
    # LD_LIBRARY_PATH=/usr/sap/NW1/ERS01/exe:$LD_LIBRARY_PATH; export LD_LIBRARY_PATH; /usr/sap/NW1/ERS01/exe/sapstartsrv pf=/usr/sap/NW1/ERS01/profile/NW1_ERS01_sapers -D -u nw1adm
    # systemctl --no-ask-password start SAPNW1_00 # sapstartsrv pf=/usr/sap/NW1/SYS/profile/NW1_ERS01_sapers
    ```

   > [!IMPORTANT]
   > With the systemd based SAP Startup Framework, SAP instances can now be managed by systemd. The minimum required Red Hat Enterprise Linux (RHEL) version is RHEL 8 for SAP. As described in SAP Note [3115048](https://me.sap.com/notes/3115048), a fresh installation of a SAP kernel with integrated systemd based SAP Startup Framework support will always result in a systemd controlled SAP instance. After an SAP kernel upgrade of an existing SAP installation to a kernel which has systemd based SAP Startup Framework support, however, some manual steps have to be performed as documented in SAP Note [3115048](https://me.sap.com/notes/3115048) to convert the existing SAP startup environment to one which is systemd controlled.
   >
   > When utilizing Red Hat HA services for SAP (cluster configuration) to manage SAP application server instances such as SAP ASCS and SAP ERS, additional modifications will be necessary to ensure compatibility between the SAPInstance resource agent and the new systemd-based SAP startup framework. So once the SAP application server instances has been installed or switched to a systemd enabled SAP Kernel as per SAP Note [3115048](https://me.sap.com/notes/3115048), the steps mentioned in [Red Hat KBA 6884531](https://access.redhat.com/articles/6884531) must be completed successfully on all cluster nodes.

2. **[1]** Create the SAP cluster resources.

    If you use enqueue server 1 architecture (ENSA1), define the resources as shown here:

    ```bash
    sudo pcs property set maintenance-mode=true
    
    sudo pcs resource create rsc_sap_NW1_ASCS00 SAPInstance \
     InstanceName=NW1_ASCS00_sapascs START_PROFILE="/sapmnt/NW1/profile/NW1_ASCS00_sapascs" \
     AUTOMATIC_RECOVER=false \
     meta resource-stickiness=5000 migration-threshold=1 failure-timeout=60 \
     op monitor interval=20 on-fail=restart timeout=60 \
     op start interval=0 timeout=600 op stop interval=0 timeout=600 \
     --group g-NW1_ASCS
    
    sudo pcs resource meta g-NW1_ASCS resource-stickiness=3000

    sudo pcs resource create rsc_sap_NW1_ERS01 SAPInstance \
     InstanceName=NW1_ERS01_sapers START_PROFILE="/sapmnt/NW1/profile/NW1_ERS01_sapers" \
     AUTOMATIC_RECOVER=false IS_ERS=true \
     op monitor interval=20 on-fail=restart timeout=60 op start interval=0 timeout=600 op stop interval=0 timeout=600 \
     --group g-NW1_AERS
     
    sudo pcs constraint colocation add g-NW1_AERS with g-NW1_ASCS -5000
    sudo pcs constraint location rsc_sap_NW1_ASCS00 rule score=2000 runs_ers_NW1 eq 1
    sudo pcs constraint order start g-NW1_ASCS then stop g-NW1_AERS kind=Optional symmetrical=false
    
    sudo pcs node unstandby sap-cl1
    sudo pcs property set maintenance-mode=false
    ```

    SAP introduced support for enqueue server 2, including replication, as of SAP NW 7.52. Starting with ABAP Platform 1809, enqueue server 2 is installed by default. See SAP Note [2630416](https://launchpad.support.sap.com/#/notes/2630416) for enqueue server 2 support.
    If you use enqueue server 2 architecture ([ENSA2](https://help.sap.com/viewer/cff8531bc1d9416d91bb6781e628d4e0/1709%20001/en-US/6d655c383abf4c129b0e5c8683e7ecd8.html)), install resource agent resource-agents-sap-4.1.1-12.el7.x86_64 or newer and define the resources as shown here:

    ```bash
    sudo pcs property set maintenance-mode=true
    
    sudo pcs resource create rsc_sap_NW1_ASCS00 SAPInstance \
    InstanceName=NW1_ASCS00_anftstsapvh START_PROFILE="/sapmnt/NW1/profile/NW1_ASCS00_anftstsapvh" \
    AUTOMATIC_RECOVER=false \
    meta resource-stickiness=5000 \
    op monitor interval=20 on-fail=restart timeout=60 \
    op start interval=0 timeout=600 op stop interval=0 timeout=600 \
    --group g-NW1_ASCS
   
    sudo pcs resource meta g-NW1_ASCS resource-stickiness=3000

    sudo pcs resource create rsc_sap_NW1_ERS01 SAPInstance \
    InstanceName=NW1_ERS01_sapers START_PROFILE="/sapmnt/NW1/profile/NW1_ERS01_sapers" \
    AUTOMATIC_RECOVER=false IS_ERS=true \
    op monitor interval=20 on-fail=restart timeout=60 op start interval=0 timeout=600 op stop interval=0 timeout=600 \
    --group g-NW1_AERS
      
    sudo pcs resource meta rsc_sap_NW1_ERS01  resource-stickiness=3000

    sudo pcs constraint colocation add g-NW1_AERS with g-NW1_ASCS -5000
    sudo pcs constraint order start g-NW1_ASCS then start g-NW1_AERS kind=Optional symmetrical=false
    sudo pcs constraint order start g-NW1_ASCS then stop g-NW1_AERS kind=Optional symmetrical=false
   
    sudo pcs node unstandby sap-cl1
    sudo pcs property set maintenance-mode=false
    ```

    If you're upgrading from an older version and switching to enqueue server 2, see SAP Note [2641322](https://launchpad.support.sap.com/#/notes/2641322).

    > [!NOTE]
    > The timeouts in the preceding configuration are only examples and might need to be adapted to the specific SAP setup.

    Make sure that the cluster status is okay and that all resources are started. Which node the resources are running on isn't important.

    ```bash
    sudo pcs status
    
    # Online: [ sap-cl1 sap-cl2 ]
    #
    # Full list of resources:
    #
    # rsc_st_azure    (stonith:fence_azure_arm):      Started sap-cl2
    #  Resource Group: g-NW1_ASCS
    #      fs_NW1_ASCS        (ocf::heartbeat:Filesystem):    Started sap-cl2
    #      nc_NW1_ASCS        (ocf::heartbeat:azure-lb):      Started sap-cl2
    #      vip_NW1_ASCS       (ocf::heartbeat:IPaddr2):       Started sap-cl2
    #      rsc_sap_NW1_ASCS00 (ocf::heartbeat:SAPInstance):   Started sap-cl2
    #  Resource Group: g-NW1_AERS
    #      fs_NW1_AERS        (ocf::heartbeat:Filesystem):    Started sap-cl1
    #      nc_NW1_AERS        (ocf::heartbeat:azure-lb):      Started sap-cl1
    #      vip_NW1_AERS       (ocf::heartbeat:IPaddr2):       Started sap-cl1
    #      rsc_sap_NW1_ERS01  (ocf::heartbeat:SAPInstance):   Started sap-cl1
    ```

3. **[1]** Run the following step to configure `priority-fencing-delay` (applicable only as of pacemaker-2.0.4-6.el8 or higher).

    > [!NOTE]
    > If you have a two-node cluster, you have the option to configure the `priority-fencing-delay` cluster property. This property introduces additional delay in fencing a node that has higher total resource priority when a split-brain scenario occurs. For more information, see [Can Pacemaker fence the cluster node with the fewest running resources?](https://access.redhat.com/solutions/5110521).
    >
    > The property `priority-fencing-delay` is applicable for pacemaker-2.0.4-6.el8 version or higher. If you set up `priority-fencing-delay` on an existing cluster, make sure to clear the `pcmk_delay_max` setting in the fencing device.  

    ```bash
    sudo pcs resource defaults update priority=1
    sudo pcs resource update rsc_sap_NW1_ASCS00 meta priority=10

    sudo pcs property set priority-fencing-delay=15s
    ```

4. **[A]** Add firewall rules for ASCS and ERS on both nodes.

    ```bash
    # Probe Port of ASCS
    sudo firewall-cmd --zone=public --add-port=62000/tcp --permanent
    sudo firewall-cmd --zone=public --add-port=62000/tcp
    sudo firewall-cmd --zone=public --add-port=3200/tcp --permanent
    sudo firewall-cmd --zone=public --add-port=3200/tcp
    sudo firewall-cmd --zone=public --add-port=3600/tcp --permanent
    sudo firewall-cmd --zone=public --add-port=3600/tcp
    sudo firewall-cmd --zone=public --add-port=3900/tcp --permanent
    sudo firewall-cmd --zone=public --add-port=3900/tcp
    sudo firewall-cmd --zone=public --add-port=8100/tcp --permanent
    sudo firewall-cmd --zone=public --add-port=8100/tcp
    sudo firewall-cmd --zone=public --add-port=50013/tcp --permanent
    sudo firewall-cmd --zone=public --add-port=50013/tcp
    sudo firewall-cmd --zone=public --add-port=50014/tcp --permanent
    sudo firewall-cmd --zone=public --add-port=50014/tcp
    sudo firewall-cmd --zone=public --add-port=50016/tcp --permanent
    sudo firewall-cmd --zone=public --add-port=50016/tcp
    # Probe Port of ERS
    sudo firewall-cmd --zone=public --add-port=62101/tcp --permanent
    sudo firewall-cmd --zone=public --add-port=62101/tcp
    sudo firewall-cmd --zone=public --add-port=3201/tcp --permanent
    sudo firewall-cmd --zone=public --add-port=3201/tcp
    sudo firewall-cmd --zone=public --add-port=3301/tcp --permanent
    sudo firewall-cmd --zone=public --add-port=3301/tcp
    sudo firewall-cmd --zone=public --add-port=50113/tcp --permanent
    sudo firewall-cmd --zone=public --add-port=50113/tcp
    sudo firewall-cmd --zone=public --add-port=50114/tcp --permanent
    sudo firewall-cmd --zone=public --add-port=50114/tcp
    sudo firewall-cmd --zone=public --add-port=50116/tcp --permanent
    sudo firewall-cmd --zone=public --add-port=50116/tcp
    ```

## SAP NetWeaver application server preparation

   Some databases require that the database instance installation runs on an application server. Prepare the application server VMs to be able to use them in these cases.  

   The following steps assume that you install the application server on a server different from the ASCS/SCS and HANA servers. Otherwise, some of the steps (like configuring hostname resolution) aren't needed.  

   The following items are prefixed with:

   - **[A]**: Applicable to both PAS and AAS
   - **[P]**: Only applicable to PAS
   - **[S]**: Only applicable to AAS

1. **[A]** Set up hostname resolution.
   You can either use a DNS server or modify the `/etc/hosts` file on all nodes. This example shows how to use the `/etc/hosts` file. Replace the IP address and the hostname in the following commands:  

    ```bash
    sudo vi /etc/hosts
    ```

   Insert the following lines to `/etc/hosts`. Change the IP address and hostname to match your environment.

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

1. **[A]** Create the `sapmnt` directory.

    ```bash
    sudo mkdir -p /sapmnt/NW1
    sudo mkdir -p /usr/sap/trans

    sudo chattr +i /sapmnt/NW1
    sudo chattr +i /usr/sap/trans
   ```

1. **[A]** Install the NFS client and other requirements.

    ```bash
    sudo yum -y install nfs-utils uuidd
    ```

1. **[A]** Add mount entries.

    ```bash
    vi /etc/fstab
    # Add the following lines to fstab, save and exit
    sapnfs.file.core.windows.net:/sapnfsafs/saptrans /usr/sap/trans  nfs vers=4,minorversion=1,sec=sys  0  0
    sapnfs.file.core.windows.net:/sapnfsafs/sapnw1/sapmntNW1 /sapmnt/NW1  nfs vers=4,minorversion=1,sec=sys  0  0
    
    # Mount the file systems
    mount -a 
    ```

1. **[A]** Configure the SWAP file.

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

   Restart the agent to activate the change.

    ```bash
    sudo service waagent restart
    ```

## Install the database

In this example, SAP NetWeaver is installed on SAP HANA. You can use every supported database for this installation. For more information on how to install SAP HANA in Azure, see [High availability of SAP HANA on Azure VMs on Red Hat Enterprise Linux][sap-hana-ha]. For a list of supported databases, see SAP Note [1928533][1928533].

Install the SAP NetWeaver database instance as a root by using a virtual hostname that maps to the IP address of the load balancer front-end configuration for the database.

You can use the `sapinst` parameter `SAPINST_REMOTE_ACCESS_USER` to allow a nonroot user to connect to `sapinst`.

   ```bash
   # Allow access to SWPM. This rule is not permanent. If you reboot the machine, you have to run the command again.
   sudo firewall-cmd --zone=public  --add-port=4237/tcp
   sudo <swpm>/sapinst SAPINST_REMOTE_ACCESS_USER=sapadmin
   ```

## SAP NetWeaver application server installation

Follow these steps to install an SAP application server.

1. **[A]** Prepare the application server.

   Follow the steps in the previous section [SAP NetWeaver application server preparation](#sap-netweaver-application-server-preparation) to prepare the application server.

1. **[A]** Install the SAP NetWeaver application server.  

   Install a primary or additional SAP NetWeaver applications server.

   You can use the `sapinst` parameter `SAPINST_REMOTE_ACCESS_USER` to allow a nonroot user to connect to `sapinst`.

    ```bash
    sudo <swpm>/sapinst SAPINST_REMOTE_ACCESS_USER=sapadmin
    ```

1. **[A]** Update the SAP HANA secure store.

   Update the SAP HANA secure store to point to the virtual name of the SAP HANA System Replication setup.

   Run the following command to list the entries as `<sapsid>adm`.

    ```bash
    hdbuserstore List
    ```

   All entries should be listed and look similar to:

    ```bash
    DATA FILE       : /home/nw1adm/.hdb/sapa01/SSFS_HDB.DAT
    KEY FILE        : /home/nw1adm/.hdb/sapa01/SSFS_HDB.KEY
   
    KEY DEFAULT
      ENV : 10.90.90.5:30313
      USER: SAPABAP1
      DATABASE: NW1
    ```

   In this example, the IP address of the default entry points to the VM, not the load balancer. Change the entry to point to the virtual hostname of the load balancer. Make sure to use the same port and database name. For example, use `30313` and `NW1` in the sample output.

    ```bash
    su - nw1adm
    hdbuserstore SET DEFAULT nw1db:30313@NW1 SAPABAP1 <password of ABAP schema>
    ```

## Test cluster setup

Thoroughly test your Pacemaker cluster. For more information, see [Execute the typical failover tests](./high-availability-guide-rhel.md#test-the-cluster-setup).

## Next steps

* To deploy a cost-optimization scenario where the PAS and AAS instance is deployed with SAP NetWeaver HA cluster on RHEL, see [Install SAP dialog instance with SAP ASCS/SCS high-availability VMs on RHEL](high-availability-guide-rhel-with-dialog-instance.md).
* See [HA for SAP NW on Azure VMs on RHEL for SAP applications multi-SID guide](./high-availability-guide-rhel-multi-sid.md).
* See [Azure Virtual Machines planning and implementation for SAP][planning-guide].
* See [Azure Virtual Machines deployment for SAP][deployment-guide].
* See [Azure Virtual Machines DBMS deployment for SAP][dbms-guide].
* To learn how to establish HA and plan for disaster recovery of SAP HANA on Azure (large instances), see [SAP HANA (large instances) high availability and disaster recovery on Azure](../../virtual-machines/workloads/sap/hana-overview-high-availability-disaster-recovery.md).
* To learn how to establish HA and plan for disaster recovery of SAP HANA on Azure VMs, see [High availability of SAP HANA on Azure Virtual Machines][sap-hana-ha].
