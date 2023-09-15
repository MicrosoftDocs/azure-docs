---
title: Azure VMs high availability for SAP NetWeaver on SLES for SAP Applications with simple mount and NFS| Microsoft Docs
description: Install high-availability SAP NetWeaver on SUSE Linux Enterprise Server with simple mount and NFS for SAP applications.
services: virtual-machines-windows,virtual-network,storage
documentationcenter: saponazure
author: rdeltcheva
manager: juergent
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: tutorial
ms.workload: infrastructure-services
ms.date: 07/17/2023
ms.author: radeltch
---

# High-availability SAP NetWeaver with simple mount and NFS on SLES for SAP Applications VMs

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
[2578899]:https://launchpad.support.sap.com/#/notes/2578899
[1999351]:https://launchpad.support.sap.com/#/notes/1999351
[1410736]:https://launchpad.support.sap.com/#/notes/1410736
[2360818]:https://launchpad.support.sap.com/#/notes/2360818
[1275776]:https://launchpad.support.sap.com/#/notes/1275776

[suse-ha-guide]:https://www.suse.com/products/sles-for-sap/resource-library/sap-best-practices/
[suse-relnotes]:https://www.suse.com/releasenotes/index.html

[sap-hana-ha]:sap-hana-high-availability.md

This article describes how to deploy and configure Azure virtual machines (VMs), install the cluster framework, and install a high-availability (HA) SAP NetWeaver system with a simple mount structure. You can implement the presented architecture by using one of the following Azure native Network File System (NFS) services:  

* [NFS on Azure Files](../../storage/files/files-nfs-protocol.md).
* [Azure NetApp Files](../../azure-netapp-files/azure-netapp-files-introduction.md).

The simple mount configuration is expected to be the [default](https://documentation.suse.com/sbp/sap/single-html/SAP-S4HA10-setupguide-simplemount-sle15/#id-introduction) for new implementations on SLES for SAP Applications 15.

## Prerequisites  

The following guides contain all the required information to set up a NetWeaver HA system:

* [SAP S/4 HANA - Enqueue Replication 2 High Availability Cluster With Simple Mount](https://documentation.suse.com/sbp/sap/html/SAP-S4HA10-setupguide-simplemount-sle15/index.html)
* [Use of Filesystem resource for ABAP SAP Central Services (ASCS)/ERS HA setup not possible](https://www.suse.com/support/kb/doc/?id=000019944)
* SAP Note [1928533][1928533], which has:  
  * A list of Azure VM sizes that are supported for the deployment of SAP software
  * Important capacity information for Azure VM sizes
  * Supported SAP software, operating systems (OSs), and combinations
  * The required SAP kernel version for Windows and Linux on Microsoft Azure
* SAP Note [2015553][2015553], which lists prerequisites for SAP-supported SAP software deployments in Azure.
* SAP Note [2205917][2205917], which has recommended OS settings for SUSE Linux Enterprise Server (SLES) for SAP Applications
* SAP Note [2178632][2178632], which has detailed information about all monitoring metrics reported for SAP in Azure
* SAP Note [2191498][2191498], which has the required SAP Host Agent version for Linux in Azure
* SAP Note [2243692][2243692], which has information about SAP licensing on Linux in Azure
* SAP Note [2578899][2578899], which has general information about SUSE Linux Enterprise Server 15
* SAP Note [1275776][1275776], which has information about preparing SUSE Linux Enterprise Server for SAP environments
* SAP Note [1999351][1999351], which has additional troubleshooting information for the Azure Enhanced Monitoring Extension for SAP
* [SAP community wiki](https://wiki.scn.sap.com/wiki/display/HOME/SAPonLinuxNotes), which has all required SAP Notes for Linux
* [Azure Virtual Machines planning and implementation for SAP on Linux][planning-guide]
* [Azure Virtual Machines deployment for SAP on Linux][deployment-guide]
* [Azure Virtual Machines DBMS deployment for SAP on Linux][dbms-guide]
* [SUSE SAP HA best practice guides][suse-ha-guide]
* [SUSE High Availability Extension release notes][suse-relnotes]
* [Azure Files documentation][afs-azure-doc]
* [NetApp NFS best practices](https://www.netapp.com/media/10720-tr-4067.pdf)

## Overview

This article describes a high-availability configuration for ASCS with a simple mount structure. To deploy the SAP application layer, you need shared directories like `/sapmnt/SID`, `/usr/sap/SID`, and  `/usr/sap/trans`, which are highly available. You can deploy these file systems on [NFS on Azure Files](../../storage/files/files-nfs-protocol.md) *or* [Azure NetApp Files](../../azure-netapp-files/azure-netapp-files-introduction.md).

You still need a Pacemaker cluster to help protect single-point-of-failure components like SAP Central Services (SCS) and ASCS.

Compared to the classic Pacemaker cluster configuration, with the simple mount deployment, the cluster doesn't manage the file systems. This configuration is supported only on SLES for SAP Applications 15 and later. This article doesn't cover the database layer in detail.  

The example configurations and installation commands use the following instance numbers.

| Instance name | Instance number |
| ---------------- | ------------------ |
| ASCS | 00 |
| Enqueue Replication Server (ERS) | 01 |
| Primary Application Server (PAS) | 02 |
| Additional Application Server (AAS) | 03 |
| SAP system identifier | NW1 |

> [!IMPORTANT]
> The configuration with simple mount structure is supported only on SLES for SAP Applications 15 and later releases.

:::image type="complex" source="./media/high-availability-guide-suse/high-availability-guide-suse-nfs-simple-mount.png" alt-text="Diagram that shows SAP NetWeaver high availability with simple mount and NFS.":::
   This diagram shows a typical SAP NetWeaver HA architecture with a simple mount. The "sapmnt" and "saptrans" file systems are deployed on Azure native NFS: NFS shares on Azure Files or NFS volumes on Azure NetApp Files. A Pacemaker cluster protects the SAP central services. The clustered VMs are behind an Azure load balancer. The Pacemaker cluster doesn't manage the file systems, in contrast to the classic Pacemaker configuration.  
:::image-end:::

## Prepare the infrastructure

This article assumes that you've already deployed an [Azure virtual network](../../virtual-network/virtual-networks-overview.md), subnet, and resource group. To prepare the rest of your infrastructure:

1. Deploy your VMs. You can deploy VMs in availability sets or in availability zones, if the Azure region supports these options.
   > [!IMPORTANT]
   > If you need additional IP addresses for your VMs, deploy and attach a second network interface controller (NIC). Don't add secondary IP addresses to the primary NIC. [Azure Load Balancer Floating IP doesn't support this scenario](../../load-balancer/load-balancer-multivip-overview.md#limitations).
2. For your virtual IPs, deploy and configure an [Azure load balancer](../../load-balancer/load-balancer-overview.md). We recommend that you use a [Standard load balancer](../../load-balancer/quickstart-load-balancer-standard-public-portal.md).
   1. Create front-end IP address 10.27.0.9 for the ASCS instance:
      1. Open the load balancer, select **Frontend IP pool**, and then select **Add**.
      2. Enter the name of the new front-end IP pool (for example, **frontend.NW1.ASCS**).
      3. Set **Assignment** to **Static** and enter the IP address (for example, **10.27.0.9**).
      4. Select **OK**.
   2. Create front-end IP address 10.27.0.10 for the ERS instance:  
      * Repeat the preceding steps to create an IP address for ERS (for example, **10.27.0.10** and **frontend.NW1.ERS**).
   3. Create a single back-end pool:
      1. Open the load balancer, select **Backend pools**, and then select **Add**.
      2. Enter the name of the new back-end pool (for example, **backend.NW1**).
      3. Select **NIC** for Backend Pool Configuration.
      4. Select **Add a virtual machine**.
      5. Select the virtual machines of the ASCS cluster.
      6. Select **Add**.
      7. Select **Save**.
   4. Create a health probe for port 62000 for ASCS:
      1. Open the load balancer, select **Health probes**, and then select **Add**.
      2. Enter the name of the new health probe (for example, **health.NW1.ASCS**).
      3. Select **TCP** as the protocol and **62000** as the port. Keep the interval of **5**.  
      4. Select **Add**.
   5. Create a health probe for port 62101 for the ERS instance:  
      * Repeat the preceding steps to create a health probe for ERS (for example, **62101** and **health.NW1.ERS**).
   6. Create load-balancing rules for ASCS:
      1. Open the load balancer, select **Load-balancing rules**, and then select **Add**.
      2. Enter the name of the new load-balancing rule (for example, **lb.NW1.ASCS**).
      3. Select the front-end IP address for ASCS, back-end pool, and health probe that you created earlier (for example, **frontend.NW1.ASCS**, **backend.NW1**, and **health.NW1.ASCS**).
      4. Increase idle timeout to 30 minutes
      5. Select **HA ports**.
      6. Enable Floating IP.
      7. Select **OK**.
   7. Create load-balancing rules for ERS:
      * Repeat the preceding steps to create load-balancing rules for ERS (for example, **lb.NW1.ERS**).

> [!NOTE]
> When VMs without public IP addresses are placed in the back-end pool of an internal (no public IP address) Standard Azure load balancer, there will be no outbound internet connectivity unless you perform additional configuration to allow routing to public endpoints. For details on how to achieve outbound connectivity, see [Public endpoint connectivity for virtual machines using Azure Standard Load Balancer in SAP high-availability scenarios](./high-availability-guide-standard-load-balancer-outbound-connections.md).  

> [!IMPORTANT]
> Don't enable TCP time stamps on Azure VMs placed behind Azure Load Balancer. Enabling TCP timestamps will cause the health probes to fail. Set the `net.ipv4.tcp_timestamps` parameter to `0`. For details, see [Load Balancer health probes](../../load-balancer/load-balancer-custom-probe-overview.md).

## Deploy NFS

There are two options for deploying Azure native NFS to host the SAP shared directories. You can either deploy an [NFS file share on Azure Files](../../storage/files/files-nfs-protocol.md) or deploy an [NFS volume on Azure NetApp Files](../../azure-netapp-files/azure-netapp-files-introduction.md). NFS on Azure Files supports the NFSv4.1 protocol. NFS on Azure NetApp Files supports both NFSv4.1 and NFSv3.

The next sections describe the steps to deploy NFS. Select only *one* of the options.

### Deploy an Azure Files storage account and NFS shares

NFS on Azure Files runs on top of [Azure Files premium storage][afs-azure-doc]. Before you set up NFS on Azure Files, see [How to create an NFS share](../../storage/files/storage-files-how-to-create-nfs-shares.md?tabs=azure-portal).

There are two options for redundancy within an Azure region:

* [Locally redundant storage (LRS)](../../storage/common/storage-redundancy.md#locally-redundant-storage) offers local, in-zone synchronous data replication.
* [Zone-redundant storage (ZRS)](../../storage/common/storage-redundancy.md#zone-redundant-storage) replicates your data synchronously across the three [availability zones](../../availability-zones/az-overview.md) in the region.

Check if your selected Azure region offers NFSv4.1 on Azure Files with the appropriate redundancy. Review the [availability of Azure Files by Azure region][afs-avail-matrix] for **Premium Files Storage**. If your scenario benefits from ZRS, [verify that premium file shares with ZRS are supported in your Azure region](../../storage/common/storage-redundancy.md#zone-redundant-storage).

We recommend that you access your Azure storage account through an [Azure private endpoint](../../storage/files/storage-files-networking-endpoints.md?tabs=azure-portal). Be sure to deploy the Azure Files storage account endpoint, and the VMs where you need to mount the NFS shares, in the same Azure virtual network or in peered Azure virtual networks.

1. Deploy an Azure Files storage account named **sapnfsafs**. This example uses ZRS. If you're not familiar with the process, see [Create a storage account](../../storage/files/storage-how-to-create-file-share.md?tabs=azure-portal#create-a-storage-account) for the Azure portal.
2. On the **Basics** tab, use these settings:
    1. For **Storage account name**, enter **sapnfsafs**.
    2. For **Performance**, select **Premium**.
    3. For **Premium account type**, select **FileStorage**.
    4. For **Replication**, select **Zone redundancy (ZRS)**.
3. Select **Next**.
4. On the **Advanced** tab, clear **Require secure transfer for REST API**. If you don't clear this option, you can't mount the NFS share to your VM. The mount operation will time out.
5. Select **Next**.
6. In the **Networking** section, configure these settings:
    1. Under **Networking connectivity**, for **Connectivity method**, select **Private endpoint**.  
    2. Under **Private endpoint**, select **Add private endpoint**.
7. On the **Create private endpoint** pane, select your subscription, resource group, and location. Then make the following selections:
    1. For **Name**, enter **sapnfsafs_pe**.
    2. For **Storage sub-resource**, select **file**.
    3. Under **Networking**, for **Virtual network**, select the virtual network and subnet to use. Again, you can use either the virtual network where your SAP VMs are or a peered virtual network.
    4. Under **Private DNS integration**, accept the default option of **Yes** for **Integrate with private DNS zone**. Be sure to select your private DNS zone.
    5. Select **OK**.
8. On the **Networking** tab again, select **Next**.
9. On the **Data protection** tab, keep all the default settings.
10. Select **Review + create** to validate your configuration.
11. Wait for the validation to finish. Fix any issues before continuing.
12. On the **Review + create** tab, select **Create**.

Next, deploy the NFS shares in the storage account that you created. In this example, there are two NFS shares, `sapnw1` and `saptrans`.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select or search for **Storage accounts**.
3. On the **Storage accounts** page, select **sapnfsafs**.
4. On the resource menu for **sapnfsafs**, select **File shares** under **Data storage**.
5. On the **File shares** page, select **File share**, and then:
   1. For **Name**, enter **sapnw1**, **saptrans**.
   2. Select an appropriate share size. Consider the size of the data stored on the share, I/O per second (IOPS), and throughput requirements. For more information, see [Azure file share targets](../../storage/files/storage-files-scale-targets.md#azure-file-share-scale-targets).
   3. Select **NFS** as the protocol.
   4. Select **No root Squash**.  Otherwise, when you mount the shares on your VMs, you can't see the file owner or group.

The SAP file systems that don't need to be mounted via NFS can also be deployed on [Azure disk storage](../../virtual-machines/disks-types.md#premium-ssds). In this example, you can deploy `/usr/sap/NW1/D02` and `/usr/sap/NW1/D03` on Azure disk storage.

#### Important considerations for NFS on Azure Files shares

When you plan your deployment with NFS on Azure Files, consider the following important points:  

* The minimum share size is 100 gibibytes (GiB). You pay for only the [capacity of the provisioned shares](../../storage/files/understanding-billing.md#provisioned-model).
* Size your NFS shares not only based on capacity requirements, but also on IOPS and throughput requirements. For details, see [Azure file share targets](../../storage/files/storage-files-scale-targets.md#azure-file-share-scale-targets).
* Test the workload to validate your sizing and ensure that it meets your performance targets. To learn how to troubleshoot performance issues with NFS on Azure Files, consult [Troubleshoot Azure file share performance](../../storage/files/files-troubleshoot-performance.md).
* For SAP J2EE systems, placing `/usr/sap/<SID>/J<nr>` on NFS on Azure Files is not supported.
* If your SAP system has a heavy load of batch jobs, you might have millions of job logs. If the SAP batch job logs are stored in the file system, pay special attention to the sizing of the `sapmnt` share. As of SAP_BASIS 7.52, the default behavior for the batch job logs is to be stored in the database. For details, see [Job log in the database][2360818].
* Deploy a separate `sapmnt` share for each SAP system.
* Don't use the `sapmnt` share for any other activity, such as interfaces.
* Don't use the `saptrans` share for any other activity, such as interfaces.
* Avoid consolidating the shares for too many SAP systems in a single storage account. There are also [scalability and performance targets for storage accounts](../../storage/files/storage-files-scale-targets.md#storage-account-scale-targets). Be careful to not exceed the limits for the storage account, too.
* In general,  don't consolidate the shares for more than *five* SAP systems in a single storage account. This guideline helps you avoid exceeding the storage account limits and simplifies performance analysis.
* In general, avoid mixing shares like `sapmnt` for non-production and production SAP systems in the same storage account.
* We recommend that you deploy on SLES 15 SP2 or later to benefit from [NFS client improvements](../../storage/files/files-troubleshoot-linux-nfs.md#ls-hangs-for-large-directory-enumeration-on-some-kernels).
* Use a private endpoint. In the unlikely event of a zonal failure, your NFS sessions automatically redirect to a healthy zone. You don't have to remount the NFS shares on your VMs.
* If you're deploying your VMs across availability zones, use a [storage account with ZRS](../../storage/common/storage-redundancy.md#zone-redundant-storage) in the Azure regions that supports ZRS.
* Azure Files doesn't currently support automatic cross-region replication for disaster recovery scenarios.  

### Deploy Azure NetApp Files resources  

1. Check that the Azure NetApp Files service is available in your [Azure region of choice](https://azure.microsoft.com/global-infrastructure/services/?products=netapp).
2. Create the NetApp account in the selected Azure region. Follow [these instructions](../../azure-netapp-files/azure-netapp-files-create-netapp-account.md).  
3. Set up the Azure NetApp Files capacity pool. Follow [these instructions](../../azure-netapp-files/azure-netapp-files-set-up-capacity-pool.md).  

   The SAP NetWeaver architecture presented in this article uses a single Azure NetApp Files capacity pool, Premium SKU. We recommend Azure NetApp Files Premium SKU for SAP NetWeaver application workloads on Azure.  
4. Delegate a subnet to Azure NetApp Files, as described in [these instructions](../../azure-netapp-files/azure-netapp-files-delegate-subnet.md).  
5. Deploy Azure NetApp Files volumes by following [these instructions](../../azure-netapp-files/azure-netapp-files-create-volumes.md). Deploy the volumes in the designated Azure NetApp Files [subnet](/rest/api/virtualnetwork/subnets). The IP addresses of the Azure NetApp volumes are assigned automatically.

   Keep in mind that the Azure NetApp Files resources and the Azure VMs must be in the same Azure virtual network or in peered Azure virtual networks. This example uses two Azure NetApp Files volumes: `sapnw1` and `trans`. The file paths that are mounted to the corresponding mount points are:  

   * Volume `sapnw1` (`nfs://10.27.1.5/sapnw1/sapmntNW1`)
   * Volume `sapnw1` (`nfs://10.27.1.5/sapnw1/usrsapNW1`)
   * Volume `trans` (`nfs://10.27.1.5/trans`)

The SAP file systems that don't need to be shared can also be deployed on  [Azure disk storage](../../virtual-machines/disks-types.md#premium-ssds). For example, `/usr/sap/NW1/D02` and `/usr/sap/NW1/D03` could be deployed as Azure disk storage.  

#### Important considerations for NFS on Azure NetApp Files

When you're considering Azure NetApp Files for the SAP NetWeaver high-availability architecture, be aware of the following important considerations:

* The minimum capacity pool is 4 tebibytes (TiB). You can increase the size of the capacity pool in 1-TiB increments.
* The minimum volume is 100 GiB.
* Azure NetApp Files and all virtual machines where Azure NetApp Files volumes will be mounted must be in the same Azure virtual network or in [peered virtual networks](../../virtual-network/virtual-network-peering-overview.md) in the same region. Azure NetApp Files access over virtual network peering in the same region is supported. Azure NetApp Files access over global peering isn't yet supported.
* The selected virtual network must have a subnet that's delegated to Azure NetApp Files.
* The throughput and performance characteristics of an Azure NetApp Files volume is a function of the volume quota and service level, as documented in [Service level for Azure NetApp Files](../../azure-netapp-files/azure-netapp-files-service-levels.md). When you're sizing the Azure NetApp Files volumes for SAP, make sure that the resulting throughput meets the application's requirements.  
* Azure NetApp Files offers an [export policy](../../azure-netapp-files/azure-netapp-files-configure-export-policy.md). You can control the allowed clients and the access type (for example, read/write or read-only).
* Azure NetApp Files isn't zone aware yet. Currently, Azure NetApp Files isn't deployed in all availability zones in an Azure region. Be aware of the potential latency implications in some Azure regions.
* Azure NetApp Files volumes can be deployed as NFSv3 or NFSv4.1 volumes. Both protocols are supported for the SAP application layer (ASCS/ERS, SAP application servers).

## Set up ASCS

Next, you'll prepare and install the SAP ASCS and ERS instances.

### Create a Pacemaker cluster

Follow the steps in [Setting up Pacemaker on SUSE Linux Enterprise Server in Azure](high-availability-guide-suse-pacemaker.md) to create a basic Pacemaker cluster for SAP ASCS.

### Prepare for installation

The following items are prefixed with:

* **[A]**: Applicable to all nodes.
* **[1]**: Applicable to only node 1.
* **[2]**: Applicable to only node 2.

1. **[A]** Install the latest version of the SUSE connector.

    ```bash
    sudo zypper install sap-suse-cluster-connector
    ```

1. **[A]** Install the `sapstartsrv` resource agent.  

    ```bash
    sudo zypper install sapstartsrv-resource-agents
    ```

1. **[A]** Update SAP resource agents.

   To use the configuration that this article describes, you need a patch for the resource-agents package. To check if the patch is already installed, use the following command.

    ```bash
    sudo grep 'parameter name="IS_ERS"' /usr/lib/ocf/resource.d/heartbeat/SAPInstance
    ```

   The output should be similar to the following example.

    ```bash
    <parameter name="IS_ERS" unique="0" required="0">;
    ```

   If the `grep` command doesn't find the `IS_ERS` parameter, you need to install the patch listed on [the SUSE download page](https://download.suse.com/patch/finder/#bu=suse&familyId=&productId=&dateRange=&startDate=&endDate=&priority=&architecture=&keywords=resource-agents).

   > [!IMPORTANT]
   > You need to install at least `sapstartsrv-resource-agents` version 0.91 and `resource-agents` 4.x from November 2021.  

1. **[A]** Set up host name resolution.

   You can either use a DNS server or modify `/etc/hosts` on all nodes. This example shows how to use the `/etc/hosts` file.

    ```bash
    sudo vi /etc/hosts
    ```

   Insert the following lines to `/etc/hosts`. Change the IP address and host name to match your environment.

    ```bash
     # IP address of cluster node 1
     10.27.0.6    sap-cl1
     # IP address of cluster node 2
     10.27.0.7     sap-cl2
     # IP address of the load balancer's front-end configuration for SAP NetWeaver ASCS
     10.27.0.9   sapascs
     # IP address of the load balancer's front-end configuration for SAP NetWeaver ERS
     10.27.0.10    sapers
    ```

1. **[A]** Configure the SWAP file.

    ```bash
    sudo vi /etc/waagent.conf
    
    # Check if the ResourceDisk.Format property is already set to y, and if not, set it.
    ResourceDisk.Format=y

    # Set the ResourceDisk.EnableSwap property to y.
    # Create and use the SWAP file on the resource disk.
    ResourceDisk.EnableSwap=y
   
    # Set the size of the SWAP file with the ResourceDisk.SwapSizeMB property.
    # The free space of resource disk varies by virtual machine size. Don't set a value that's too big. You can check the SWAP space by using the swapon command.
    ResourceDisk.SwapSizeMB=2000
    ```

   Restart the agent to activate the change.

    ```bash
    sudo service waagent restart
    ```

### Prepare SAP directories if you're using NFS on Azure Files

1. **[1]** Create the SAP directories on the NFS share.

   Temporarily mount the NFS share `sapnw1` to one of the VMs and create the SAP directories that will be used as nested mount points.  

    ```bash
    # Temporarily mount the volume.
    sudo mkdir -p /saptmp
    sudo mount -t nfs sapnfsafs.file.core.windows.net:/sapnfsafs/sapnw1 /saptmp -o vers=4.1,sec=sys
    # Create the SAP directories.
    sudo cd /saptmp
    sudo mkdir -p sapmntNW1
    sudo mkdir -p usrsapNW1
    # Unmount the volume and delete the temporary directory.
    cd ..
    sudo umount /saptmp
    sudo rmdir /saptmp
    ```

1. **[A]** Create the shared directories.

    ```bash
    sudo mkdir -p /sapmnt/NW1
    sudo mkdir -p /usr/sap/NW1
    sudo mkdir -p /usr/sap/trans
    
    sudo chattr +i /sapmnt/NW1
    sudo chattr +i /usr/sap/NW1
    sudo chattr +i /usr/sap/trans   
    ```

1. **[A]** Mount the file systems.

   With the simple mount configuration, the Pacemaker cluster doesn't control the file systems.

    ```bash
    echo "sapnfsafs.file.core.windows.net:/sapnfsafs/sapnw1/sapmntNW1 /sapmnt/NW1 nfs vers=4.1,sec=sys  0  0" >> /etc/fstab
    echo "sapnfsafs.file.core.windows.net:/sapnfsafs/sapnw1/usrsapNW1/ /usr/sap/NW1 nfs vers=4.1,sec=sys  0  0" >> /etc/fstab
    echo "sapnfsafs.file.core.windows.net:/sapnfsafs/saptrans /usr/sap/trans nfs vers=4.1,sec=sys  0  0" >> /etc/fstab   
    # Mount the file systems.
    mount -a 
    ```

### Prepare SAP directories if you're using NFS on Azure NetApp Files

The instructions in this section are applicable only if you're using Azure NetApp Files volumes with the NFSv4.1 protocol. Perform the configuration on all VMs where Azure NetApp Files NFSv4.1 volumes will be mounted.

1. **[A]** Disable ID mapping.

   1. Verify the NFS domain setting. Make sure that the domain is configured as the default Azure NetApp Files domain, `defaultv4iddomain.com`. Also verify that the mapping is set to `nobody`.  

       ```bash
       sudo cat /etc/idmapd.conf
       # Examplepython-azure-mgmt-compute
       [General]
       Verbosity = 0
       Pipefs-Directory = /var/lib/nfs/rpc_pipefs
       Domain = defaultv4iddomain.com
       [Mapping]
       Nobody-User = nobody
       Nobody-Group = nobody
       ```

   2. Verify `nfs4_disable_idmapping`. It should be set to `Y`.

       To create the directory structure where `nfs4_disable_idmapping` is located, run the `mount` command. You won't be able to manually create the directory under `/sys/modules`, because access is reserved for the kernel and drivers.  

       ```bash
       # Check nfs4_disable_idmapping. 
       cat /sys/module/nfs/parameters/nfs4_disable_idmapping
       # If you need to set nfs4_disable_idmapping to Y:
       mkdir /mnt/tmp
       mount 10.27.1.5:/sapnw1 /mnt/tmp
       umount  /mnt/tmp
       echo "Y" > /sys/module/nfs/parameters/nfs4_disable_idmapping
       # Make the configuration permanent.
       echo "options nfs nfs4_disable_idmapping=Y" >> /etc/modprobe.d/nfs.conf
       ```

2. **[1]** Temporarily mount the Azure NetApp Files volume on one of the VMs and create the SAP directories (file paths).  

    ```bash
    # Temporarily mount the volume.
    sudo mkdir -p /saptmp
    # If you're using NFSv3:
    sudo mount -t nfs -o rw,hard,rsize=65536,wsize=65536,nfsvers=3,tcp 10.27.1.5:/sapnw1 /saptmp
    # If you're using NFSv4.1:
    sudo mount -t nfs -o rw,hard,rsize=65536,wsize=65536,nfsvers=4.1,sec=sys,tcp 10.27.1.5:/sapnw1 /saptmp
    # Create the SAP directories.
    sudo cd /saptmp
    sudo mkdir -p sapmntNW1
    sudo mkdir -p usrsapNW1
    # Unmount the volume and delete the temporary directory.
    sudo cd ..
    sudo umount /saptmp
    sudo rmdir /saptmp
    ```

3. **[A]** Create the shared directories.

   ```bash
   sudo mkdir -p /sapmnt/NW1
   sudo mkdir -p /usr/sap/NW1
   sudo mkdir -p /usr/sap/trans
   
   sudo chattr +i /sapmnt/NW1
   sudo chattr +i /usr/sap/NW1
   sudo chattr +i /usr/sap/trans
   ```

4. **[A]** Mount the file systems.

   With the simple mount configuration, the Pacemaker cluster doesn't control the file systems.

    ```bash
    # If you're using NFSv3:
    echo "10.27.1.5:/sapnw1/sapmntNW1 /sapmnt/NW1 nfs nfsvers=3,hard 0 0" >> /etc/fstab
    echo "10.27.1.5:/sapnw1/usrsapNW1 /usr/sap/NW1 nfs nfsvers=3,hard 0 0" >> /etc/fstab
    echo "10.27.1.5:/saptrans /usr/sap/trans nfs nfsvers=3,hard 0 0" >> /etc/fstab
    # If you're using NFSv4.1:
    echo "10.27.1.5:/sapnw1/sapmntNW1 /sapmnt/NW1 nfs nfsvers=4.1,sec=sys,hard 0 0" >> /etc/fstab
    echo "10.27.1.5:/sapnw1/usrsapNW1 /usr/sap/NW1 nfs nfsvers=4.1,sec=sys,hard 0 0" >> /etc/fstab
    echo "10.27.1.5:/saptrans /usr/sap/trans nfs nfsvers=4.1,sec=sys,hard 0 0" >> /etc/fstab
    # Mount the file systems.
    mount -a 
    ```

### Install SAP NetWeaver ASCS and ERS

1. **[1]** Create a virtual IP resource and health probe for the ASCS instance.

   > [!IMPORTANT]
   > We recommend using the `azure-lb` resource agent, which is part of the resource-agents package with a minimum version of `resource-agents-4.3.0184.6ee15eb2-4.13.1`.  

    ```bash
    sudo crm node standby sap-cl2   
    sudo crm configure primitive vip_NW1_ASCS IPaddr2 \
      params ip=10.27.0.9 \
      op monitor interval=10 timeout=20
    
    sudo crm configure primitive nc_NW1_ASCS azure-lb port=62000 \
      op monitor timeout=20s interval=10
    
    sudo crm configure group g-NW1_ASCS nc_NW1_ASCS vip_NW1_ASCS \
      meta resource-stickiness=3000
    ```

   Make sure that the cluster status is OK and that all resources are started. It isn't important which node the resources are running on.

    ```bash
    sudo crm_mon -r
    # Node sap-cl2: standby
    # Online: [ sap-cl1 ]
    #
    # Full list of resources:
    #
    # stonith-sbd     (stonith:external/sbd): Started sap-cl1
    # Resource Group: g-NW1_ASCS
    #  nc_NW1_ASCS        (ocf::heartbeat:azure-lb):      Started sap-cl1
    #  vip_NW1_ASCS       (ocf::heartbeat:IPaddr2):       Started sap-cl1
    ```
  
2. **[1]** Install SAP NetWeaver ASCS as root on the first node.

   Use a virtual host name that maps to the IP address of the load balancer's front-end configuration for ASCS (for example, `sapascs`, `10.27.0.9`) and the instance number that you used for the probe of the load balancer (for example, `00`).

   You can use the `sapinst` parameter `SAPINST_REMOTE_ACCESS_USER` to allow a non-root user to connect to `sapinst`. You can use the `SAPINST_USE_HOSTNAME` parameter to install SAP by using a virtual host name.

    ```bash
    sudo <swpm>/sapinst SAPINST_REMOTE_ACCESS_USER=sapadmin SAPINST_USE_HOSTNAME=<virtual_hostname>
    ```

   If the installation fails to create a subfolder in `/usr/sap/NW1/ASCS00`, set the owner and group of the `ASCS00` folder and retry.

    ```bash
    chown nw1adm /usr/sap/NW1/ASCS00
    chgrp sapsys /usr/sap/NW1/ASCS00
    ```

3. **[1]** Create a virtual IP resource and health probe for the ERS instance.

    ```bash
    sudo crm node online sap-cl2
    sudo crm node standby sap-cl1
  
    sudo crm configure primitive vip_NW1_ERS IPaddr2 \
      params ip=10.27.0.10 \
      op monitor interval=10 timeout=20
   
    sudo crm configure primitive nc_NW1_ERS azure-lb port=62101 \
      op monitor timeout=20s interval=10
    
    sudo crm configure group g-NW1_ERS nc_NW1_ERS vip_NW1_ERS
    ```

   Make sure that the cluster status is OK and that all resources are started. It isn't important which node the resources are running on.

    ```bash
    sudo crm_mon -r
   
    # Node sap-cl1: standby
    # Online: [ sap-cl2 ]
    # 
    # Full list of resources:
    #
    # stonith-sbd     (stonith:external/sbd): Started sap-cl2
    #  Resource Group: g-NW1_ASCS
    #      nc_NW1_ASCS        (ocf::heartbeat:azure-lb):      Started sap-cl2
    #      vip_NW1_ASCS       (ocf::heartbeat:IPaddr2):       Started sap-cl2
    #  Resource Group: g-NW1_ERS
    #      nc_NW1_ERS (ocf::heartbeat:azure-lb):      Started sap-cl2
    #      vip_NW1_ERS  (ocf::heartbeat:IPaddr2):     Started sap-cl2
    ```

4. **[2]** Install SAP NetWeaver ERS as root on the second node.

   Use a virtual host name that maps to the IP address of the load balancer's front-end configuration for ERS (for example, `sapers`, `10.27.0.10`) and the instance number that you used for the probe of the load balancer (for example, `01`).

   You can use the `SAPINST_REMOTE_ACCESS_USER` parameter to allow a non-root user to connect to `sapinst`. You can use the `SAPINST_USE_HOSTNAME` parameter to install SAP by using a virtual host name.

    ```bash
    <swpm>/sapinst SAPINST_REMOTE_ACCESS_USER=sapadmin SAPINST_USE_HOSTNAME=virtual_hostname
    ```

   > [!NOTE]
   > Use SWPM SP 20 PL 05 or later. Earlier versions don't set the permissions correctly, and they cause the installation to fail.

   If the installation fails to create a subfolder in `/usr/sap/NW1/ERS01`, set the owner and group of the `ERS01` folder and retry.

    ```bash
    chown nw1adm /usr/sap/NW1/ERS01
    chgrp sapsys /usr/sap/NW1/ERS01
    ```

5. **[1]** Adapt the ASCS instance profile.

    ```bash
    sudo vi /sapmnt/NW1/profile/NW1_ASCS00_sapascs
    
    # Change the restart command to a start command.
    # Restart_Program_01 = local $(_EN) pf=$(_PF).
    Start_Program_01 = local $(_EN) pf=$(_PF)
    
    # Add the following lines.
    service/halib = $(DIR_CT_RUN)/saphascriptco.so
    service/halib_cluster_connector = /usr/bin/sap_suse_cluster_connector
    
    # Add the keepalive parameter, if you're using ENSA1.
    enque/encni/set_so_keepalive = true
    ```

    For Standalone Enqueue Server 1 and 2 (ENSA1 and ENSA2), make sure that the `keepalive` OS parameters are set as described in SAP Note [1410736](https://launchpad.support.sap.com/#/notes/1410736).  

    Now adapt the ERS instance profile.

    ```bash
    sudo vi /sapmnt/NW1/profile/NW1_ERS01_sapers
     
    # Change the restart command to a start command.
    # Restart_Program_00 = local $(_ER) pf=$(_PFL) NR=$(SCSID).
    Start_Program_00 = local $(_ER) pf=$(_PFL) NR=$(SCSID)
    
    # Add the following lines.
    service/halib = $(DIR_CT_RUN)/saphascriptco.so
    service/halib_cluster_connector = /usr/bin/sap_suse_cluster_connector
    
    # Remove Autostart from the ERS profile.
    # Autostart = 1
    ```

6. **[A]** Configure `keepalive`.

   Communication between the SAP NetWeaver application server and ASCS is routed through a software load balancer. The load balancer disconnects inactive connections after a configurable timeout.

   To prevent this disconnection, you need to set a parameter in the SAP NetWeaver ASCS profile, if you're using ENSA1. Change the Linux system `keepalive` settings on all SAP servers for both ENSA1 and ENSA2. For more information, read SAP Note[1410736][1410736].

    ```bash
    # Change the Linux system configuration.
    sudo sysctl net.ipv4.tcp_keepalive_time=300
    ```

7. **[A]** Configure the SAP users after the installation.

    ```bash
    # Add sidadm to the haclient group.
    sudo usermod -aG haclient nw1adm
    ```

8. **[1]** Add the ASCS and ERS SAP services to the `sapservice` file.

   Add the ASCS service entry to the second node, and copy the ERS service entry to the first node.

    ```bash
    cat /usr/sap/sapservices | grep ASCS00 | sudo ssh sap-cl2 "cat >>/usr/sap/sapservices"
    sudo ssh sap-cl2 "cat /usr/sap/sapservices" | grep ERS01 | sudo tee -a /usr/sap/sapservices
    ```

9. **[A]** Enable  `sapping` and `sappong`. The `sapping` agent runs before `sapinit` to hide the `/usr/sap/sapservices` file. The `sappong` agent runs after `sapinit` to unhide the `sapservices` file during VM boot. `SAPStartSrv` isn't started automatically for an SAP instance at boot time, because the Pacemaker cluster manages it.  

    ```bash
    sudo systemctl enable sapping
    sudo systemctl enable sappong
    ```

10. **[1]** Create the SAP cluster resources.

    If you're using an ENSA1 architecture, define the resources as follows.

    ```bash
    sudo crm configure property maintenance-mode="true"
    
    sudo crm configure primitive rsc_sapstartsrv_NW1_ASCS00 ocf:suse:SAPStartSrv \
     params InstanceName=NW1_ASCS00_sapascs

    sudo crm configure primitive rsc_sapstartsrv_NW1_ERS01 ocf:suse:SAPStartSrv \
     params InstanceName=NW1_ERS01_sapers

    # If you're using NFS on Azure Files or NFSv3 on Azure NetApp Files:
    sudo crm configure primitive rsc_sap_NW1_ASCS00 SAPInstance \
     op monitor interval=11 timeout=60 on-fail=restart \
     params InstanceName=NW1_ASCS00_sapascs START_PROFILE="/sapmnt/NW1/profile/NW1_ASCS00_sapascs" \
     AUTOMATIC_RECOVER=false MINIMAL_PROBE=true \
     meta resource-stickiness=5000 failure-timeout=60 migration-threshold=1 priority=10
   
    # If you're using NFS on Azure Files or NFSv3 on Azure NetApp Files:
    sudo crm configure primitive rsc_sap_NW1_ERS01 SAPInstance \
     op monitor interval=11 timeout=60 on-fail=restart \
     params InstanceName=NW1_ERS01_sapers START_PROFILE="/sapmnt/NW1/profile/NW1_ERS01_sapers" \
     AUTOMATIC_RECOVER=false IS_ERS=true MINIMAL_PROBE=true \
     meta priority=1000
   
    # If you're using NFSv4.1 on Azure NetApp Files:
    sudo crm configure primitive rsc_sap_NW1_ASCS00 SAPInstance \
     op monitor interval=11 timeout=105 on-fail=restart \
     params InstanceName=NW1_ASCS00_sapascs START_PROFILE="/sapmnt/NW1/profile/NW1_ASCS00_sapascs" \
     AUTOMATIC_RECOVER=false MINIMAL_PROBE=true \
     meta resource-stickiness=5000 failure-timeout=60 migration-threshold=1 priority=10
   
    # If you're using NFSv4.1 on Azure NetApp Files:
    sudo crm configure primitive rsc_sap_NW1_ERS01 SAPInstance \
     op monitor interval=11 timeout=105 on-fail=restart \
     params InstanceName=NW1_ERS01_sapers START_PROFILE="/sapmnt/NW1/profile/NW1_ERS01_sapers" \
     AUTOMATIC_RECOVER=false IS_ERS=true MINIMAL_PROBE=true \
     meta priority=1000

    sudo crm configure modgroup g-NW1_ASCS add rsc_sapstartsrv_NW1_ASCS00
    sudo crm configure modgroup g-NW1_ASCS add rsc_sap_NW1_ASCS00
    sudo crm configure modgroup g-NW1_ERS add rsc_sapstartsrv_NW1_ERS01
    sudo crm configure modgroup g-NW1_ERS add rsc_sap_NW1_ERS01
   
    sudo crm configure colocation col_sap_NW1_no_both -5000: g-NW1_ERS g-NW1_ASCS
    sudo crm configure location loc_sap_NW1_failover_to_ers rsc_sap_NW1_ASCS00 rule 2000: runs_ers_NW1 eq 1
    sudo crm configure order ord_sap_NW1_first_start_ascs Optional: rsc_sap_NW1_ASCS00:start rsc_sap_NW1_ERS01:stop symmetrical=false
   
    sudo crm node online sap-cl1
    sudo crm configure property maintenance-mode="false"
    ```

    SAP introduced support for [ENSA2](https://help.sap.com/viewer/cff8531bc1d9416d91bb6781e628d4e0/1709%20001/en-US/6d655c383abf4c129b0e5c8683e7ecd8.html), including replication, in SAP NetWeaver 7.52. Starting with ABAP Platform 1809, ENSA2 is installed by default. For ENSA2 support, see SAP Note [2630416](https://launchpad.support.sap.com/#/notes/2630416).

    > [!NOTE]
    > If you have a two-node cluster running ENSA2, you have the option to configure priority-fencing-delay cluster property. This property introduces additional delay in fencing a node that has higher total resoure priority when a split-brain scenario occurs. For more information, see [SUSE Linux Enteprise Server high availability extension administration guide](https://documentation.suse.com/sle-ha/15-SP3/single-html/SLE-HA-administration/#pro-ha-storage-protect-fencing).
    >
    > The property priority-fencing-delay is only applicable for ENSA2 running on two-node cluster. For more information, see [Enqueue Replication 2 High Availability cluster with simple mount](https://documentation.suse.com/sbp/sap/html/SAP-S4HA10-setupguide-simplemount-sle15/index.html#multicluster)

    If you're using an ENSA2 architecture, define the resources as follows.

    ```bash
    sudo crm configure property maintenance-mode="true"

    sudo crm configure property priority-fencing-delay=30
   
    sudo crm configure primitive rsc_sapstartsrv_NW1_ASCS00 ocf:suse:SAPStartSrv \
     params InstanceName=NW1_ASCS00_sapascs

    sudo crm configure primitive rsc_sapstartsrv_NW1_ERS01 ocf:suse:SAPStartSrv \
     params InstanceName=NW1_ERS01_sapers

    # If you're using NFS on Azure Files or NFSv3 on Azure NetApp Files:
    sudo crm configure primitive rsc_sap_NW1_ASCS00 SAPInstance \
     op monitor interval=11 timeout=60 on-fail=restart \
     params InstanceName=NW1_ASCS00_sapascs START_PROFILE="/sapmnt/NW1/profile/NW1_ASCS00_sapascs" \
     AUTOMATIC_RECOVER=false MINIMAL_PROBE=true \
     meta resource-stickiness=5000 priority=100

    # If you're using NFS on Azure Files or NFSv3 on Azure NetApp Files:   
    sudo crm configure primitive rsc_sap_NW1_ERS01 SAPInstance \
     op monitor interval=11 timeout=60 on-fail=restart \
     params InstanceName=NW1_ERS01_sapers START_PROFILE="/sapmnt/NW1/profile/NW1_ERS01_sapers" \
     AUTOMATIC_RECOVER=false IS_ERS=true MINIMAL_PROBE=true
   
    # If you're using NFSv4.1 on Azure NetApp Files:
    sudo crm configure primitive rsc_sap_NW1_ASCS00 SAPInstance \
     op monitor interval=11 timeout=105 on-fail=restart \
     params InstanceName=NW1_ASCS00_sapascs START_PROFILE="/sapmnt/NW1/profile/NW1_ASCS00_sapascs" \
     AUTOMATIC_RECOVER=false MINIMAL_PROBE=true \
     meta resource-stickiness=5000 priority=100

    # If you're using NFSv4.1 on Azure NetApp Files:   
    sudo crm configure primitive rsc_sap_NW1_ERS01 SAPInstance \
     op monitor interval=11 timeout=105 on-fail=restart \
     params InstanceName=NW1_ERS01_sapers START_PROFILE="/sapmnt/NW1/profile/NW1_ERS01_sapers" \
     AUTOMATIC_RECOVER=false IS_ERS=true MINIMAL_PROBE=true

    sudo crm configure modgroup g-NW1_ASCS add rsc_sapstartsrv_NW1_ASCS00
    sudo crm configure modgroup g-NW1_ASCS add rsc_sap_NW1_ASCS00
    sudo crm configure modgroup g-NW1_ERS add rsc_sapstartsrv_NW1_ERS01
    sudo crm configure modgroup g-NW1_ERS add rsc_sap_NW1_ERS01
    
    sudo crm configure colocation col_sap_NW1_no_both -5000: g-NW1_ERS g-NW1_ASCS
    sudo crm configure order ord_sap_NW1_first_start_ascs Optional: rsc_sap_NW1_ASCS00:start rsc_sap_NW1_ERS01:stop symmetrical=false
   
    sudo crm node online sap-cl1
    sudo crm configure property maintenance-mode="false"
    ```

    If you're upgrading from an older version and switching to ENSA2, see SAP Note [2641019](https://launchpad.support.sap.com/#/notes/2641019).

    Make sure that the cluster status is OK and that all resources are started. It isn't important which node the resources are running on.

    ```bash
    sudo crm_mon -r
    # Full list of resources:
    # 
    # stonith-sbd     (stonith:external/sbd): Started sap-cl2
    #  Resource Group: g-NW1_ASCS
    #      nc_NW1_ASCS        (ocf::heartbeat:azure-lb):      Started sap-cl1
    #      vip_NW1_ASCS       (ocf::heartbeat:IPaddr2):       Started sap-cl1
    #      rsc_sapstartsrv_NW1_ASCS00 (ocf::suse:SAPStartSrv):        Started sap-cl1
    #      rsc_sap_NW1_ASCS00 (ocf::heartbeat:SAPInstance):   Started sap-cl1
    #  Resource Group: g-NW1_ERS
    #      nc_NW1_ERS (ocf::heartbeat:azure-lb):      Started sap-cl2
    #      vip_NW1_ERS        (ocf::heartbeat:IPaddr2):       Started sap-cl2
    #      rsc_sapstartsrv_NW1_ERS01  (ocf::suse:SAPStartSrv):        Started sap-cl2
    #      rsc_sap_NW1_ERS01  (ocf::heartbeat:SAPInstance):   Started sap-cl1
    ```

## Prepare the SAP application server

Some databases require you to execute the database installation on an application server. Prepare the application server VMs to be able to execute the database installation.

The following common steps assume that you install the application server on a server that's different from the ASCS and HANA servers:  

1. Set up host name resolution.

   You can either use a DNS server or modify `/etc/hosts` on all nodes. This example shows how to use the `/etc/hosts` file.

    ```bash
    sudo vi /etc/hosts
    ```

   Insert the following lines to `/etc/hosts`. Change the IP address and host name to match your environment.

    ```bash
    10.27.0.6   sap-cl1
    10.27.0.7   sap-cl2
    # IP address of the load balancer's front-end configuration for SAP NetWeaver ASCS
    10.27.0.9   sapascs
    # IP address of the load balancer's front-end configuration for SAP NetWeaver ERS
    10.27.0.10  sapers
    10.27.0.8   sapa01
    10.27.0.12  sapa02
    ```

2. Configure the SWAP file.

    ```bash
    sudo vi /etc/waagent.conf
   
    # Set the ResourceDisk.EnableSwap property to y.
    # Create and use the SWAP file on the resource disk.
    ResourceDisk.EnableSwap=y
    
    # Set the size of the SWAP file by using the ResourceDisk.SwapSizeMB property.
    # The free space of the resource disk varies by virtual machine size. Don't set a value that's too big. You can check the SWAP space by using the swapon command.
    ResourceDisk.SwapSizeMB=2000
    ```

   Restart the agent to activate the change.

    ```bash
    sudo service waagent restart
    ```

### Prepare SAP directories

If you're using NFS on Azure Files, use the following instructions to prepare the SAP directories on the SAP application server VMs:

1. Create the mount points.

    ```bash
    sudo mkdir -p /sapmnt/NW1
    sudo mkdir -p /usr/sap/trans

    sudo chattr +i /sapmnt/NW1
    sudo chattr +i /usr/sap/trans
    ```

2. Mount the file systems.

    ```bash
    echo "sapnfsafs.file.core.windows.net:/sapnfsafs/sapnw1/sapmntNW1 /sapmnt/NW1  nfs vers=4.1,sec=sys  0  0" >> /etc/fstab
    echo "sapnfsafs.file.core.windows.net:/sapnfsafs/saptrans /usr/sap/trans  nfs vers=4.1,sec=sys  0  0" >> /etc/fstab   
    # Mount the file systems.
    mount -a 
    ```

If you're using NFS on Azure NetApp Files, use the following instructions to prepare the SAP directories on the SAP application server VMs:

1. Create the mount points.

    ```bash
    sudo mkdir -p /sapmnt/NW1
    sudo mkdir -p /usr/sap/trans

    sudo chattr +i /sapmnt/NW1
    sudo chattr +i /usr/sap/trans

2. Mount the file systems.

    ```bash
    # If you're using NFSv3:
    echo "10.27.1.5:/sapnw1/sapmntNW1 /sapmnt/NW1 nfs nfsvers=3,hard 0 0" >> /etc/fstab
    echo "10.27.1.5:/saptrans /usr/sap/trans nfs nfsvers=3, hard 0 0" >> /etc/fstab
    # If you're using NFSv4.1:
    echo "10.27.1.5:/sapnw1/sapmntNW1 /sapmnt/NW1 nfs nfsvers=4.1,sec=sys,hard 0 0" >> /etc/fstab    
    echo "10.27.1.5:/saptrans /usr/sap/trans nfs nfsvers=4.1,sec=sys,hard 0 0" >> /etc/fstab
    # Mount the file systems.
    mount -a 
    ```

## Install the database

In this example, SAP NetWeaver is installed on SAP HANA. You can use any supported database for this installation. For more information on how to install SAP HANA in Azure, see [High availability of SAP HANA on Azure virtual machines][sap-hana-ha]. For a list of supported databases, see SAP Note [1928533][1928533].

Install the SAP NetWeaver database instance as root by using a virtual host name that maps to the IP address of the load balancer's front-end configuration for the database. You can use the `SAPINST_REMOTE_ACCESS_USER` parameter to allow a non-root user to connect to `sapinst`.

```bash
sudo <swpm>/sapinst SAPINST_REMOTE_ACCESS_USER=sapadmin
```

## Install the SAP NetWeaver application server

Follow these steps to install an SAP application server:

1. **[A]** Prepare the application server.  

   Follow the steps in [SAP NetWeaver application server preparation](#prepare-the-sap-application-server).

2. **[A]** Install a primary or additional SAP NetWeaver application server.

   You can use the `SAPINST_REMOTE_ACCESS_USER` parameter to allow a non-root user to connect to `sapinst`.

    ```bash
    sudo <swpm>/sapinst SAPINST_REMOTE_ACCESS_USER=sapadmin
   ```

3. **[A]** Update the SAP HANA secure store to point to the virtual name of the SAP HANA system replication setup.

   Run the following command to list the entries.

    ```bash
    hdbuserstore List
    ```

   The command should list all entries and should look similar to this example.

    ```bash
    DATA FILE       : /home/nw1adm/.hdb/sapa01/SSFS_HDB.DAT
    KEY FILE        : /home/nw1adm/.hdb/sapa01/SSFS_HDB.KEY
   
    KEY DEFAULT 
      ENV : 10.27.0.4:30313
      USER: SAPABAP1
      DATABASE: NW1
    ```

   In this example, the IP address of the default entry points to the VM, not the load balancer. Change the entry to point to the virtual host name of the load balancer. Be sure to use the same port and database name. For example, use `30313` and `NW1` in the sample output.

   ```bash
   su - nw1adm
   hdbuserstore SET DEFAULT nw1db:30313@NW1 SAPABAP1 <password of ABAP schema>
   ```

## Test your cluster setup

Thoroughly test your Pacemaker cluster. [Run the typical failover tests](./high-availability-guide-suse.md#test-the-cluster-setup).

## Next steps

* [HA for SAP NetWeaver on Azure VMs on SLES for SAP applications multi-SID guide](./high-availability-guide-suse-multi-sid.md)
* [SAP workload configurations with Azure availability zones](high-availability-zones.md)
* [Azure Virtual Machines planning and implementation for SAP][planning-guide]
* [Azure Virtual Machines deployment for SAP][deployment-guide]
* [Azure Virtual Machines DBMS deployment for SAP][dbms-guide]
* [High Availability of SAP HANA on Azure VMs][sap-hana-ha]
