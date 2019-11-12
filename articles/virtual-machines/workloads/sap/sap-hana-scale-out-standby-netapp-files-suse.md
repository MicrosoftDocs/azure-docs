---
title: SAP HANA scale-out with standby node on Azure VMs with Azure NetApp Files on SUSE Linux Enterprise Server | Microsoft Docs
description: High-availability guide for SAP NetWeaver on SUSE Linux Enterprise Server with Azure NetApp Files for SAP applications
services: virtual-machines-windows,virtual-network,storage
documentationcenter: saponazure
author: rdeltcheva
manager: juergent
editor: ''
tags: azure-resource-manager
keywords: ''

ms.assetid: 5e514964-c907-4324-b659-16dd825f6f87
ms.service: virtual-machines-windows

ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 04/30/2019
ms.author: radeltch

---

# SAP HANA scale-out with standby node on Azure VMs with Azure NetApp Files on SUSE Linux Enterprise Server 

[dbms-guide]:dbms-guide.md
[deployment-guide]:deployment-guide.md
[planning-guide]:planning-guide.md

[anf-azure-doc]:https://docs.microsoft.com/azure/azure-netapp-files/
[anf-avail-matrix]:https://azure.microsoft.com/global-infrastructure/services/?products=netapp&regions=all 
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
[1900823]:https://launchpad.support.sap.com/#/notes/1900823

[sap-swcenter]:https://support.sap.com/en/my-support/software-downloads.html

[suse-ha-guide]:https://www.suse.com/products/sles-for-sap/resource-library/sap-best-practices/
[suse-drbd-guide]:https://www.suse.com/documentation/sle-ha-12/singlehtml/book_sleha_techguides/book_sleha_techguides.html
[suse-ha-12sp3-relnotes]:https://www.suse.com/releasenotes/x86_64/SLE-HA/12-SP3/

[sap-hana-ha]:sap-hana-high-availability.md
[nfs-ha]:high-availability-guide-suse-nfs.md


This article describes how to deploy highly available HANA system in scale-out configuration with standby on Azure virtual machines with [Azure NetApp Files](https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-introduction/) for the shared storage volumes.  
In the example configurations, installation commands and so on, the HANA instance is **03** and the HANA system ID is **HN1**. The examples are based on HANA 2.0 SP4 and SUSE Linux Enterprise Server for SAP 12 SP4. 

Read the following SAP Notes and papers first:

* [Azure NetApp Files documentation][anf-azure-doc] 
* SAP Note [1928533], which has:  
  * List of Azure VM sizes that are supported for the deployment of SAP software
  * Important capacity information for Azure VM sizes
  * Supported SAP software, and operating system (OS) and database combinations
  * Required SAP kernel version for Windows and Linux on Microsoft Azure
* SAP Note [2015553] lists prerequisites for SAP-supported SAP software deployments in Azure.
* SAP Note [2205917] has recommended OS settings for SUSE Linux Enterprise Server for SAP Applications
* SAP Note [1944799] has SAP Guidelines for SUSE Linux Enterprise Server for SAP Applications
* SAP Note [2178632] has detailed information about all monitoring metrics reported for SAP in Azure.
* SAP Note [2191498] has the required SAP Host Agent version for Linux in Azure.
* SAP Note [2243692] has information about SAP licensing on Linux in Azure.
* SAP Note [1984787] has general information about SUSE Linux Enterprise Server 12.
* SAP Note [1999351] has additional troubleshooting information for the Azure Enhanced Monitoring Extension for SAP.
* SAP Note [1900823] has information about SAP HANA storage requirements
* [SAP Community WIKI](https://wiki.scn.sap.com/wiki/display/HOME/SAPonLinuxNotes) has all required SAP Notes for Linux.
* [Azure Virtual Machines planning and implementation for SAP on Linux][planning-guide]
* [Azure Virtual Machines deployment for SAP on Linux][deployment-guide]
* [Azure Virtual Machines DBMS deployment for SAP on Linux][dbms-guide]
* [SUSE SAP HA Best Practice Guides][suse-ha-guide]
  The guides contain all required information to set up Netweaver HA and SAP HANA System Replication on-premises. Use these guides as a general baseline. They provide much more detailed information.
* [SUSE High Availability Extension 12 SP3 Release Notes][suse-ha-12sp3-relnotes]
* [NetApp SAP Applications on Microsoft Azure using Azure NetApp Files][anf-sap-applications-azure]
* [SAP HANA on NetApp Systems with NFS](https://www.netapp.com/us/media/tr-4435.pdf). The configuration guide contains information on how to set up SAP HANA, using NFS provided by Azure NetApp Files.


## Overview

One of the methods to achieve HANA high availability is host auto fail-over. To configure host auto fail-over, one or more virtual machines are added to the HANA system and configured to be standby nodes. When active node fails, a standby node automatically takes over. In the presented configuration with Azure virtual machines, that is accomplished by [NFS on Azure NetApp Files](https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-introduction/).  

The standby node needs to have access to all database volumes. The HANA volumes must be mounted as NFSv4 volumes. The improved file lease-based locking mechanism in the NFSv4 protocol is used for `I/O` fencing. 

> [!IMPORTANT]
> It is mandatory to deploy the HANA data and log volumes as NFSv4.1 volumes and mount them, using NFSv4.1 protocol, in order to have supported configuration. HANA host auto-failover configuration with standby node is not supported with NFSv3.

![SAP NetWeaver High Availability overview](./media/high-availability-guide-suse-anf/sap-hana-scale-out-standby-netapp-files-suse.png)

Following the SAP HANA network recommendations, three subnets were created within one Azure virtual network: for communication with the storage system, for internal HANA inter-node communication and for client communication. The Azure NetApp volumes are in separate subnet, [delegated to Azure NetApp Files](https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-delegate-subnet).  

For this example configuration, the subnets are:  

  - `storage` 10.23.2.0/24  
  - `hana` 10.23.3.0/24  
  - `client` 10.23.0.0/24  
  - `anf` 10.23.1.0/26  

## Setting up the Azure NetApp Files infrastructure 

Before proceeding with the setup for Azure NetApp files infrastructure, familiarize yourself with the [Azure NetApp Files documentation][anf-azure-doc]. 
Azure NetApp files is available in several [Azure regions](https://azure.microsoft.com/global-infrastructure/services/?products=netapp). Check if your selected Azure region offers Azure NetApp Files.  

The following link shows the availability of Azure NetApp Files by Azure region: [Azure NetApp Files Availability by Azure Region][anf-avail-matrix].  
Before deploying Azure NetApp Files, request onboarding to Azure NetApp Files, following the [Register for Azure NetApp files instructions][anf-register]. 

### Deploy Azure NetApp Files resources  

The following steps assume, that you have already deployed [Azure Virtual Network](https://docs.microsoft.com/azure/virtual-network/virtual-networks-overview). The Azure NetApp Files resources and the VMs, where the Azure NetApp Files resources will be mounted must be deployed in the same Azure Virtual Network or in peered Azure Virtual Networks.  

1. If you haven't done that already, request [onboarding to Azure NetApp Files](https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-register).  

2. Create the NetApp account in the selected Azure region, following the [instructions to create NetApp Account](https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-create-netapp-account).  

3. Set up Azure NetApp Files capacity pool, following the [instructions on how to set up Azure NetApp Files capacity pool](https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-set-up-capacity-pool).  
The HANA architecture presented in this article uses single Azure NetApp Files capacity pool, Ultra Service level. We recommend Azure NetApp Files Ultra or Premium [Service Level](https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-service-levels) for HANA workloads on Azure.  

4. Delegate a subnet to Azure NetApp files as described in the [instructions Delegate a subnet to Azure NetApp Files](https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-delegate-subnet).  

5. Deploy Azure NetApp Files volumes, following the [instructions to create a volume for Azure NetApp Files](https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-create-volumes).  Make sure to select **NFSv4.1** version, when deploying the volumes. Currently access to NFSv4.1 requires additional whitelisting. Deploy the volumes in the designated Azure NetApp Files [subnet](https://docs.microsoft.com/rest/api/virtualnetwork/subnets). Keep in mind that the Azure NetApp Files resources and the Azure VMs must be in the same Azure Virtual Network or in peered Azure Virtual Networks. For example <b>HN1</b>-data-mnt00001, <b>HN1</b>-log-mnt00001, etc. are the volume names and nfs://10.23.1.5/<b>HN1</b>-data-mnt00001, nfs://10.23.1.4/<b>HN1</b>-log-mnt00001, etc. are the file paths for the Azure NetApp Files volumes.  

   1. volume <b>HN1</b>-data-mnt00001 (nfs://10.23.1.5/<b>HN1</b>-data-mnt00001)
   2. volume <b>HN1</b>-data-mnt00002 (nfs://10.23.1.6/<b>HN1</b>-data-mnt00002)
   3. volume <b>HN1</b>-log-mnt00001 (nfs://10.23.1.4/<b>HN1</b>-log-mnt00001)
   4. volume <b>HN1</b>-log-mnt00002 (nfs://10.23.1.6/<b>HN1</b>-log-mnt00002)
   5. volume <b>HN1</b>-shared (nfs://10.23.1.4/<b>HN1</b>-shared)
   
   In this example, we used separate Azure NetApp Files for each HANA data and log volumes. For more cost optimized configuration on smaller or non-productive systems, it is possible to place all data mounts and all logs mounts on a single volume.  

### Important considerations

When considering Azure NetApp Files for the SAP Netweaver on SUSE High Availability architecture, be aware of the following important considerations:

- The minimum capacity pool is 4 TiB.  
- The minimum volume size is 100 GiB
- Azure NetApp Files and all virtual machines, where Azure NetApp Files volumes will be mounted, must be in the same Azure Virtual Network or in [peered virtual networks](https://docs.microsoft.com/azure/virtual-network/virtual-network-peering-overview) in the same region.  
- The selected virtual network must have a subnet, delegated to Azure NetApp Files.
- The throughput of an Azure NetApp volume is a function of the volume quota and Service level, as documented in [Service level for Azure NetApp Files](https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-service-levels). When sizing the HANA Azure NetApp volumes, make sure the resulting throughput meets the HANA system requirements.  
- Azure NetApp Files offers [export policy](https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-configure-export-policy): you can control the allowed clients, the access type (Read&Write, Read Only, etc.). 
- Azure NetApp Files feature isn't zone aware yet. Currently Azure NetApp Files feature isn't deployed in all Availability zones in an Azure region. Be aware of the potential latency implications in some Azure regions.  
- It is important to have the virtual machines deployed in close proximity to the Azure NetApp storage for low latency. For SAP HANA workloads low latency is critical. Work with your Microsoft representative to ensure that the virtual machines and the Azure NetApp Files volumes are deployed in close proximity.  
- The User ID for <b>sid</b>adm and the Group ID for `sapsys` on the virtual machines must match the configuration in Azure NetApp Files. 

> [!IMPORTANT]
> For SAP HANA workloads low latency is critical. Work with your Microsoft representative to ensure that the virtual machines and the Azure NetApp Files volumes are deployed in close proximity.  

> [!IMPORTANT]
> If there is a mismatch between User ID for <b>sid</b>adm and the Group ID for `sapsys` between the virtual machine and the Azure NetApp configuration, the permissions for files on Azure NetApp volumes, mounted on virtual machines, will be displayed as `nobody`. Make sure to specify the correct User ID for <b>sid</b>adm and the Group ID for `sapsys`, when [on-boarding a new system](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbRxjSlHBUxkJBjmARn57skvdUQlJaV0ZBOE1PUkhOVk40WjZZQVJXRzI2RC4u) to Azure NetApp Files.

### Sizing for HANA database on Azure NetApp Files

The throughput of an Azure NetApp volume is a function of the volume size and Service level, as documented in [Service level for Azure NetApp Files](https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-service-levels). 

As you design the infrastructure for SAP in Azure you should be aware of some minimum storage requirements by SAP, which translate into minimum throughput characteristics:

- Enable read/write on /hana/log of a 250 MB/sec with 1 MB I/O sizes  
- Enable read activity of at least 400 MB/sec for /hana/data for 16 MB and 64 MB I/O sizes  
- Enable write activity of at least 250 MB/sec for /hana/data with 16 MB and 64 MB I/O sizes  

The [Azure NetApp Files throughput limits](https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-service-levels) per 1 TiB of volume quota are:
- Premium Storage Tier - 64 MiB/s  
- Ultra Storage Tier - 128 MiB/s  

To meet the SAP minimum throughput requirements for data and log, and according to the guidelines for `/hana/shared`, the recommended sizes would look like:

| Volume | Size<br /> Premium Storage tier | Size<br /> Ultra Storage tier | Supported NFS protocol |
| --- | --- | --- |
| /hana/log/ | 4 TiB | 2 TiB | v4.1 |
| /hana/data | 6.3 TiB | 3.2 TiB | v4.1 |
| /hana/shared | Max(512 GB, 1xRAM) per 4 worker nodes | Max(512 GB, 1xRAM) per 4 worker nodes | v3 or v4.1 |

The SAP HANA configuration for the layout presented in this article, using Azure NetApp Files Ultra Storage tier would look like:

| Volume | Size<br /> Ultra Storage tier | Supported NFS protocol |
| --- | --- |
| /hana/log/mnt00001 | 2 TiB | v4.1 |
| /hana/log/mnt00002 | 2 TiB | v4.1 |
| /hana/data/mnt00001 | 3.2 TiB | v4.1 |
| /hana/data/mnt00002 | 3.2 TiB | v4.1 |
| /hana/shared | 2 TiB | v3 or v4.1 |

> [!NOTE]
> The Azure NetApp Files sizing recommendations stated here are targeting to meet the minimum requirements SAP expresses towards  their infrastructure providers. In real customer deployments and workload scenarios, that may not be enough. Use these recommendations as a starting point and adapt, based on the requirements of your specific workload.  

> [!TIP]
> You can re-size Azure NetApp Files volumes dynamically, without the need to `unmount` the volumes, stop the virtual machines or stop SAP HANA. That allows flexibility to meet your application both expected and unforeseen throughput demands.

## Deploy Linux virtual machines via Azure portal

First you need to create the Azure NetApp Files volumes. Create the [Azure virtual network subnets](https://docs.microsoft.com/azure/virtual-network/virtual-network-manage-subnet) in the [Azure Virtual Network](https://docs.microsoft.com/azure/virtual-network/virtual-networks-overview). Deploy the Virtual machines. Create the additional network interfaces and attach the network interfaces to the corresponding VMs. Each virtual machine has three network interfaces, corresponding to the three Azure virtual network subnets (`storage`, `hana` and `client`).  See [How to create a Linux virtual machine in Azure with multiple network interface cards](https://docs.microsoft.com/azure/virtual-machines/linux/multiple-nics).  

> [!IMPORTANT]
> For SAP HANA workloads low latency is critical. Work with your Microsoft representative to ensure that the virtual machines and the Azure NetApp Files volumes are deployed in close proximity to achieve low latency. Submit the necessary information when [on-boarding new SAP HANA system](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbRxjSlHBUxkJBjmARn57skvdUQlJaV0ZBOE1PUkhOVk40WjZZQVJXRzI2RC4u), that is using SAP HANA Azure NetApp Files.  
> 
The next steps assume that you have already created the Resource Group, the Azure Virtual network, and the three Azure Virtual Network subnets: `storage`, `hana` and `client`.  When deploying the virtual machines, select the storage subnet, so that the storage network interface is the primary interface on the virtual machines. If that is not possible, an explicit route to the Azure NetApp delegated subnet via the storage subnet gateway must be configured. 

> [!IMPORTANT]
> Make sure that the OS you select is SAP certified for SAP HANA on the specific VM types you are using. The list  of SAP HANA certified VM types and OS releases for those can be looked up in [SAP HANA Certified IaaS Platforms](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure). Make sure to click into the details of the VM type listed to get the complete list of SAP HANA supported OS releases for the specific VM type.  

1. Create an Availability Set for SAP HANA. Make sure to set max update domain.  

2. Create three Virtual Machines(**hanadb1**, **hanadb2**, **hanadb3**)  
   - Use a SLES4SAP image in the Azure gallery that is supported for SAP HANA. We used SLES4SAP 12 SP4 image in this example.  
   - Select Availability Set created earlier for SAP HANA.  
   - Select the storage Azure virtual network subnet. Select [Accelerated Network](https://docs.microsoft.com/azure/virtual-network/create-vm-accelerated-networking-cli).  
When you deploy the virtual machines, the network interface name is automatically generated. We will refer to the network interfaces, attached to the storage Azure Virtual Network subnet as **hanadb1-storage**, **hanadb2-storage**, and **hanadb3-storage**. 
3. Create three network interfaces - one for each virtual machine, for the `hana`  virtual network subnet. In this example:  **hanadb1-hana**, **hanadb2-hana**, and **hanadb3-hana**.  
4. Create three network interfaces -  one for each virtual machine, for the **client** virtual network subnet. In this example: **hanadb1-client**, **hanadb2-client**, and **hanadb3-client**.  
5. Attach the newly created virtual network interfaces to the corresponding virtual machines  

    1. Navigate to the virtual machine in [Azure portal](https://portal.azure.com/#home).  
    2. Select Virtual Machines in the left-hand navigation pane. Filter on the virtual machine name, for instance **hanadb1**. Click on the virtual machine.  
    3. As you are in Overview, select Stop to deallocate the virtual machine.  
    4. Select Networking, attach network interface. Select from the drop-down list under "Attach network interface" the already created network interfaces for **`hana`** and **client** subnets.  Save. 
    5. Repeat for the remaining virtual machines. In our example -  **hanadb2** and **hanadb3**.
    6. Leave the virtual machines in stopped state for now. Next we will enable [Accelerated Network](https://docs.microsoft.com/azure/virtual-network/create-vm-accelerated-networking-cli) for all newly attached network interfaces.  

6. Enable accelerated networking for the additional network interfaces for **`hana`** and **`client`** subnets.  

    1. Open [cloud shell](https://azure.microsoft.com/features/cloud-shell/) in [Azure portal](https://portal.azure.com/#home)  
    2. Execute the following commands to enable Accelerated Networking for the additional network interfaces, attached to **`hana`** and **`client`** subnets.  

    <pre><code>
    az network nic update --id /subscriptions/<b>your subscription</b>/resourceGroups/<b>your resource group</b>/providers/Microsoft.Network/networkInterfaces/<b>hanadb1-hana</b> --accelerated-networking true
    az network nic update --id /subscriptions/<b>your subscription</b>/resourceGroups/<b>your resource group</b>/providers/Microsoft.Network/networkInterfaces/<b>hanadb2-hana</b> --accelerated-networking true
    az network nic update --id /subscriptions/<b>your subscription</b>/resourceGroups/<b>your resource group</b>/providers/Microsoft.Network/networkInterfaces/<b>hanadb3-hana</b> --accelerated-networking true
    
    az network nic update --id /subscriptions/<b>your subscription</b>/resourceGroups/<b>your resource group</b>/providers/Microsoft.Network/networkInterfaces/<b>hanadb1-client</b> --accelerated-networking true
    az network nic update --id /subscriptions/<b>your subscription</b>/resourceGroups/<b>your resource group</b>/providers/Microsoft.Network/networkInterfaces/<b>hanadb2-client</b> --accelerated-networking true
    az network nic update --id /subscriptions/<b>your subscription</b>/resourceGroups/<b>your resource group</b>/providers/Microsoft.Network/networkInterfaces/<b>hanadb3-client</b> --accelerated-networking true
    </code></pre>
7. Start the virtual machines  

    1. Select Virtual Machines in the left-hand navigation pane. Filter on the virtual machine name, for instance **hanadb1**. Click on the virtual machine.  
    2. As you are in Overview, select Start.  

## Operating system configuration and preparation

The following items are prefixed with either **[A]** - applicable to all nodes, **[1]** - only applicable to node 1, **[2]** - only applicable to node 2 or **[3]** - only applicable to node 3.

1. **[A]** Maintain the hosts files on the virtual machines. Include entries for all subnets. The following entries were added to `/etc/hosts` for this example.  
    <pre><code>
    # Storage
    10.23.2.4   hanadb1
    10.23.2.5   hanadb2
    10.23.2.6   hanadb3
    # Client
    10.23.0.5   hanadb1-client
    10.23.0.6   hanadb2-client
    10.23.0.7   hanadb3-client
    # Hana
    10.23.3.4   hanadb1-hana
    10.23.3.5   hanadb2-hana
    10.23.3.6   hanadb3-hana
    </code></pre>

2. **[A]** Change DHCP and cloud config settings to avoid unintended hostname changes.  
    <pre><code>
    vi /etc/sysconfig/network/dhcp
    #Change the following DHCP setting to "no"
    DHCLIENT_SET_HOSTNAME="no"
    vi /etc/sysconfig/network/ifcfg-eth0
    # Edit ifcfg-eth0 
    #Change CLOUD_NETCONFIG_MANAGE='yes' to "no"
    CLOUD_NETCONFIG_MANAGE='no'
    </code></pre>

3. **[A]** Prepare the Operating system for running SAP HANA on NetApp systems with NFS as described in [SAP HANA on NetApp AFF Systems with NFS configuration guide](https://www.netapp.com/us/media/tr-4435.pdf). Create configuration file for the NetApp configuration settings: `/etc/sysctl.d/netapp-hana.conf`.  

    <pre><code>
    vi /etc/sysctl.d/netapp-hana.conf
    # Add the following entries in the configuration file
    net.core.rmem_max = 16777216
    net.core.wmem_max = 16777216
    net.core.rmem_default = 16777216
    net.core.wmem_default = 16777216
    net.core.optmem_max = 16777216
    net.ipv4.tcp_rmem = 65536 16777216 16777216
    net.ipv4.tcp_wmem = 65536 16777216 16777216
    net.core.netdev_max_backlog = 300000
    net.ipv4.tcp_slow_start_after_idle=0
    net.ipv4.tcp_no_metrics_save = 1
    net.ipv4.tcp_moderate_rcvbuf = 1
    net.ipv4.tcp_window_scaling = 1
    net.ipv4.tcp_timestamps = 1
    net.ipv4.tcp_sack = 1
    </code></pre>

4. **[A]** Create configuration file with Microsoft for Azure configuration settings: `/etc/sysctl.d/ms-az.conf`.  

    <pre><code>
    vi /etc/sysctl.d/ms-az.conf
    # Add the following entries in the configuration file
    ipv6.conf.all.disable_ipv6 = 1
    net.ipv4.tcp_max_syn_backlog = 16348
    net.ipv4.ip_local_port_range = 40000 65300
    net.ipv4.conf.all.rp_filter = 0
    sunrpc.tcp_slot_table_entries = 128
    vm.swappiness=10
    </code></pre>

4. **[A]** Adjust sunrpc settings as recommended in [SAP HANA on NetApp AFF Systems with NFS configuration guide](https://www.netapp.com/us/media/tr-4435.pdf).  
    <pre><code>
    vi /etc/modprobe.d/sunrpc.conf
    # Insert the following line
    options sunrpc tcp_max_slot_table_entries=128
    </code></pre>

## Mount the Azure NetApp Files volumes

1. **[A]** Create mount points for the HANA database volumes.  
    <pre><code>
    mkdir -p /hana/data/<b>HN1</b>/mnt00001
    mkdir -p /hana/data/<b>HN1</b>/mnt00002
    mkdir -p /hana/log/<b>HN1</b>/mnt00001
    mkdir -p /hana/log/<b>HN1</b>/mnt00002
    mkdir -p /hana/shared
    mkdir -p /usr/sap/<b>HN1</b>
    </code></pre>

2. **[1]** Create node-specific directories for `/usr/sap` on **HN1**-shared.  

    <pre><code>
    # Create a temporary directory to mount  <b>HN1</b>-shared
    mkdir /mnt/tmp
    mount <b>10.23.1.4</b>:/<b>HN1</b>-shared /mnt/tmp
    cd /mnt/tmp
    mkdir shared usr-sap-<b>hanadb1</b> usr-sap-<b>hanadb2</b> usr-sap-<b>hanadb3</b>
    # unmount /hana/shared
    cd
    umount /mnt/tmp
    </code></pre>

3. **[A]** Verify  the NFS domain setting. Make sure the domain is configured as **`localdomain`** and the mapping is set to **nobody**.  
    <pre><code>
    sudo cat  /etc/idmapd.conf
    # Example
    [General]
    Verbosity = 0
    Pipefs-Directory = /var/lib/nfs/rpc_pipefs
    Domain = <b>localdomain</b>
    [Mapping]
    Nobody-User = <b>nobody</b>
    Nobody-Group = <b>nobody</b>
    </code></pre>

4. **[A]** Disable NFSv4 ID mapping. Execute the mount command, to create the directory structure, where `nfs4_disable_idmapping` is located.  You will not be able to manually create directory under /sys/modules, as access is reserved for the kernel / drivers.  

    <pre><code>
    
    mkdir /mnt/tmp
    mount 10.23.1.4:/HN1-shared /mnt/tmp
    umount  /mnt/tmp
    # Disable NFSv4 idmapping. 
    echo "N" > /sys/module/nfs/parameters/nfs4_disable_idmapping
    </code></pre>

5. **[A]** Create the SAP HANA group and user manually. The IDs for group sapsys and user **hn1**adm must be set to the same IDs, provided during the onboarding. It this example the IDs are set to **1001**. Otherwise it will not be possible to access the volumes.  The IDs for group sapsys and user accounts **hn1**adm and sapadm, must be the same on all virtual machines.  

    <pre><code>
    # Create user group 
    sudo groupadd -g 1001 sapsys
    # Create  users 
    sudo useradd <b>hn1</b>adm -u 1001 -g 1001 -d /usr/sap/<b>HN1</b>/home -c "SAP HANA Database System" -s /bin/sh
    sudo useradd sapadm -u 1002 -g 1001 -d /home/sapadm -c "SAP Local Administrator" -s /bin/sh
    # Set the password  for both user ids
    sudo passwd hn1adm
    sudo passwd sapadm
    </code></pre>

6. **[A]** Mount the shared Azure NetApp Files volumes.  

    <pre><code>
    sudo vi /etc/fstab
    # Add the following entries
    10.23.1.5:/<b>HN1</b>-data-mnt00001 /hana/data/<b>HN1</b>/mnt00001  nfs   rw,vers=4,minorversion=1,hard,timeo=600,rsize=262144,wsize=262144,intr,noatime,lock,_netdev,sec=sys  0  0
    10.23.1.6:/<b>HN1</b>-data-mnt00002 /hana/data/<b>HN1</b>/mnt00002  nfs   rw,vers=4,minorversion=1,hard,timeo=600,rsize=262144,wsize=262144,intr,noatime,lock,_netdev,sec=sys  0  0
    10.23.1.4:/<b>HN1</b>-log-mnt00001 /hana/log/<b>HN1</b>/mnt00001  nfs   rw,vers=4,minorversion=1,hard,timeo=600,rsize=262144,wsize=262144,intr,noatime,lock,_netdev,sec=sys  0  0
    10.23.1.6:/<b>HN1</b>-log-mnt00002 /hana/log/HN1/mnt00002  nfs   rw,vers=4,minorversion=1,hard,timeo=600,rsize=262144,wsize=262144,intr,noatime,lock,_netdev,sec=sys  0  0
    10.23.1.4:/<b>HN1</b>-shared/shared /hana/shared  nfs   rw,vers=4,minorversion=1,hard,timeo=600,rsize=262144,wsize=262144,intr,noatime,lock,_netdev,sec=sys  0  0
    # Mount all volumes
    sudo mount -a 
    </code></pre>

7. **[1]** Mount the node-specific volumes on **hanadb1**.  
    <pre><code>
    sudo vi /etc/fstab
    # Add the following entries
    10.23.1.4:/<b>HN1</b>-shared/usr-sap-<b>hanadb1</b> /usr/sap/<b>HN1</b>  nfs   rw,vers=4,minorversion=1,hard,timeo=600,rsize=262144,wsize=262144,intr,noatime,lock,_netdev,sec=sys  0  0
    # Mount the volume
    sudo mount -a 
    </code></pre>

8. **[2]** Mount the node-specific volumes on **hanadb2**.  
    <pre><code>
    sudo vi /etc/fstab
    # Add the following entries
    10.23.1.4:/<b>HN1</b>-shared/usr-sap-<b>hanadb2</b> /usr/sap/<b>HN1</b>  nfs   rw,vers=4,minorversion=1,hard,timeo=600,rsize=262144,wsize=262144,intr,noatime,lock,_netdev,sec=sys  0  0
    # Mount the volume
    sudo mount -a 
    </code></pre>

9. **[3]** Mount the node-specific volumes on **hanadb3**.  
    <pre><code>
    sudo vi /etc/fstab
    # Add the following entries
    10.23.1.4:/<b>HN1</b>-shared/usr-sap-<b>hanadb3</b> /usr/sap/<b>HN1</b>  nfs   rw,vers=4,minorversion=1,hard,timeo=600,rsize=262144,wsize=262144,intr,noatime,lock,_netdev,sec=sys  0  0
    # Mount the volume
    sudo mount -a 
    </code></pre>

10. **[A]** Verify that all HANA volumes are mounted with NFS protocol version **NFSv4**.  
    <pre><code>
    sudo nfsstat -m
    # Verify that flag vers is set to <b>4.1</b> 
    # Example from <b>hanadb1</b>
    /hana/data/<b>HN1</b>/mnt00001 from 10.23.1.5:/<b>HN1</b>-data-mnt00001
     Flags: rw,noatime,vers=<b>4.1</b>,rsize=262144,wsize=262144,namlen=255,hard,proto=tcp,timeo=600,retrans=2,sec=sys,clientaddr=10.23.2.4,local_lock=none,addr=10.23.1.5
    /hana/log/<b>HN1</b>/mnt00002 from 10.23.1.6:/<b>HN1</b>-log-mnt00002
     Flags: rw,noatime,vers=<b>4.1</b>,rsize=262144,wsize=262144,namlen=255,hard,proto=tcp,timeo=600,retrans=2,sec=sys,clientaddr=10.23.2.4,local_lock=none,addr=10.23.1.6
    /hana/data/<b>HN1</b>/mnt00002 from 10.23.1.6:/<b>HN1</b>-data-mnt00002
     Flags: rw,noatime,vers=<b>4.1</b>,rsize=262144,wsize=262144,namlen=255,hard,proto=tcp,timeo=600,retrans=2,sec=sys,clientaddr=10.23.2.4,local_lock=none,addr=10.23.1.6
    /hana/log/<b>HN1</b>/mnt00001 from 10.23.1.4:/<b>HN1</b>-log-mnt00001
    Flags: rw,noatime,vers=<b>4.1</b>,rsize=262144,wsize=262144,namlen=255,hard,proto=tcp,timeo=600,retrans=2,sec=sys,clientaddr=10.23.2.4,local_lock=none,addr=10.23.1.4
    /usr/sap/<b>HN1</b> from 10.23.1.4:/<b>HN1</b>-shared/usr-sap-<b>hanadb1</b>
     Flags: rw,noatime,vers=<b>4.1</b>,rsize=262144,wsize=262144,namlen=255,hard,proto=tcp,timeo=600,retrans=2,sec=sys,clientaddr=10.23.2.4,local_lock=none,addr=10.23.1.4
    /hana/shared from 10.23.1.4:/<b>HN1</b>-shared/shared
     Flags: rw,noatime,vers=<b>4.1</b>,rsize=262144,wsize=262144,namlen=255,hard,proto=tcp,timeo=600,retrans=2,sec=sys,clientaddr=10.23.2.4,local_lock=none,addr=10.23.1.4
    </code></pre>

## Installation  

In this example for deploying SAP HANA in scale-out configuration with standby node with Azure, we used HANA 2.0 SP4.  

### Prepare for HANA installation

1. **[A]** Set the root password, before the HANA installation (you can disable the root password after the installation has competed). Execute as `root` command `passwd`.  

2. **[1]** Verify you can ssh to **hanadb2** and **hanadb3**, without being prompted for password.  
    <pre><code>
    ssh root@<b>hanadb2</b>
    ssh root@<b>hanadb3</b>
    </code></pre>

3. **[A]** Install additional packages, required for HANA 2.0 SP4. See sap note [2593824](https://launchpad.support.sap.com/#/notes/2593824) for details. 
    <pre><code>
    sudo zypper install libgcc_s1 libstdc++6 libatomic1 
    </code></pre>

4. **[2, 3]** Change ownership of SAP HANA `data` and `log` directories to **hn1**adm.   
    <pre><code>
    # Execute as root
    sudo chown hn1adm:sapsys /hana/data/<b>HN1</b>
    sudo chown hn1adm:sapsys /hana/log/<b>HN1</b>
    </code></pre>

### HANA installation

1. **[1]** Install SAP HANA, following the instructions in [SAP HANA 2.0 Installation and Update guide](https://help.sap.com/viewer/2c1988d620e04368aa4103bf26f17727/2.0.04/en-US/7eb0167eb35e4e2885415205b8383584.html). In this example, we install SAP HANA scale-out with master, one worker, and one standby node.  
   Start the **hdblcm** program from the HANA installation software directory. Use the `internal_network` parameter and pass the address space for subnet, used for the internal HANA inter-node communication.  

    <pre><code>./hdblcm --internal_network=10.23.3.0/24
    </code></pre>

   Enter the following values at the prompt.

     * Choose an action:  Enter **1** (for install)
     * Select additional components for installation: Enter **2, 3**
     * Enter installation path:  Press Enter (defaults to /hana/shared)
     * Enter Local Host Name: Press Enter to accept the default
     * Do you want to add hosts to the system? Enter **y**
     * Enter coma-separated host names to add: **hanadb2, hanadb3**
     * Enter Root User Name [root]: press Enter to accept the default
     * Enter Root User Password: Enter root's password
     * Select roles for host hanadb2: Enter **1**  (for worker)
     * Enter Host Failover Group for host hanadb2 [default]:  Press Enter to accept the default
     * Enter Storage Partition Number for host hanadb2 [<<assign automatically>>]: Press Enter to accept the default
     * Enter Worker Group for host hanadb2 [default]: Press Enter to accept the default
     * Select roles for host hanadb3: Enter **2** (for standby)
     * Enter Host Failover Group for host hanadb3 [default]: Press Enter to accept the default
     * Enter Worker Group for host hanadb3 [default]: Press Enter to accept the default
     * Enter SAP HANA System ID: Enter **HN1**
     * Enter instance number[00]: Enter **03**
     * Enter Local Host Worker Group[default]: Press Enter to accept the default
     * Select System Usage / Enter index [4]: Enter **4** (for custom)
     * Enter Location of Data Volumes [/hana/data/HN1]:  Press Enter to accept the default
     * Enter Location of Log Volumes [/hana/log/HN1]: Press Enter to accept the default
     * Restrict maximum memory allocation? [n]: Enter **n**
     * Enter Certificate Host Name For Host hanadb1 [hanadb1]: Press Enter to accept the default
     * Enter Certificate Host Name For Host hanadb2 [hanadb2]: Press Enter to accept the default
     * Enter Certificate Host Name For Host hanadb3 [hanadb3]: Press Enter to accept the default
     * Enter System Administrator (hn1adm) Password: Enter the password
     * Enter System Database User (SYSTEM) Password: Enter SYSTEM's password
     * Confirm System Database User (SYSTEM) Password: Enter SYSTEM's password
     * Restart system after machine reboot? [n]: Enter **n** 
     * Do you want to continue (y/n): Validate the Summary and if everything looks good Enter **y**


2. **[1]** Verify global.ini  

   Display global.ini and make sure the configuration for the internal SAP HANA inter-node communication is in place. Verify section **communication**. It should have the address space for **`hana`** subnet and `listeninterface` should be set to `.internal`. Verify section **internal_hostname_resolution**. It should have the IP addresses for the HANA virtual machines that belong to the **`hana`** subnet.  

   <pre><code>
    sudo cat /usr/sap/<b>HN1</b>/SYS/global/hdb/custom/config/global.ini
    # Example 
    #global.ini last modified 2019-09-10 00:12:45.192808 by hdbnameserve
    [communication]
    internal_network = <b>10.23.3/24</b>
    listeninterface = .internal
    [internal_hostname_resolution]
    <b>10.23.3.4</b> = <b>hanadb1</b>
    <b>10.23.3.5</b> = <b>hanadb2</b>
    <b>10.23.3.6</b> = <b>hanadb3</b>
   </code></pre>

3. **[1]** Add host mapping to ensure that the client IP addresses are used for client communication. Add section `public_host_resolution` and add the corresponding IP addresses from the client subnet.  

   <pre><code>
    sudo vi /usr/sap/HN1/SYS/global/hdb/custom/config/global.ini
    #Add the section
    [public_hostname_resolution]
    map_<b>hanadb1</b> = <b>10.23.0.5</b>
    map_<b>hanadb2</b> = <b>10.23.0.6</b>
    map_<b>hanadb3</b> = <b>10.23.0.7</b>
   </code></pre>

4. **[1]** Restart SAP HANA to activate the changes.  
   <pre><code>
    sudo -u <b>hn1</b>adm /usr/sap/hostctrl/exe/sapcontrol -nr <b>03</b> -function StopSystem HDB
    sudo -u <b>hn1</b>adm /usr/sap/hostctrl/exe/sapcontrol -nr <b>03</b> -function StartSystem HDB
   </code></pre>

5. **[1]** Verify that the client interface will be using the IP addresses from the **client** subnet for communication.  
   <pre><code>
    sudo -u hn1adm /usr/sap/HN1/HDB03/exe/hdbsql -u SYSTEM -p "<b>password</b>" -i 03 -d SYSTEMDB 'select * from SYS.M_HOST_INFORMATION'|grep net_publicname
    # Expected result
    "<b>hanadb3</b>","net_publicname","<b>10.23.0.7</b>"
    "<b>hanadb2</b>","net_publicname","<b>10.23.0.6</b>"
    "<b>hanadb1</b>","net_publicname","<b>10.23.0.5</b>"
   </code></pre>

   See sap note [2183363 - Configuration of SAP HANA internal network](https://launchpad.support.sap.com/#/notes/2183363) for details on how to verify the configuration.  

6. To optimize SAP HANA for the underlying Azure NetApp files storage, set the following SAP HANA Parameters:

   - `max_parallel_io_requests` **128**
   - `async_read_submit` **on**
   - `async_write_submit_active` **on**
   - `async_write_submit_blocks` **all**

   For details see [SAP HANA on NetApp AFF Systems with NFS Configuration Guide](https://www.netapp.com/us/media/tr-4435.pdf). 

   Starting with SAP HANA 2.0 systems you can set the parameters in `global.ini`. See SAP note [1999930](https://launchpad.support.sap.com/#/notes/1999930).  
   For SAP HANA 1.0 systems, versions up to SPS12, these parameters can be set during the installation, as described in SAP note [2267798](https://launchpad.support.sap.com/#/notes/2267798).  

7. The storage used by Azure NetApp Files has a file size limitation or 16 TB. SAP HANA is not implicitly aware of the storage limitation and will not automatically create new data file, when the file size limit of 16 TB is reached. As SAP HANA attempts to grow the file beyond 16 TB, that will result in errors and eventually index server crash. 

   > [!IMPORTANT]
   > To prevent SAP HANA trying to grow data files beyond the [16TB limit](https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-resource-limits) of the storage sybsystem, set the following parameters in `global.ini`.  
   > -  datavolume_striping=true
   > - datavolume_striping_size_gb = 15000
   > For details see SAP note [2400005](https://launchpad.support.sap.com/#/notes/2400005).
   > Beware of SAP note [2631285](https://launchpad.support.sap.com/#/notes/2631285). 

## Test SAP HANA failover 

1. Simulate node crash on an SAP HANA worker node  

   Run the following commands as **hn1**adm to capture the status of the environment, before simulating the node crash.  

   <pre><code>
    # Check the landscape status
    python /usr/sap/<b>HN1</b>/HDB<b>03</b>/exe/python_support/landscapeHostConfiguration.py
    | Host    | Host   | Host   | Failover | Remove | Storage   | Storage   | Failover | Failover | NameServer | NameServer | IndexServer | IndexServer | Host    | Host    | Worker  | Worker  |
    |         | Active | Status | Status   | Status | Config    | Actual    | Config   | Actual   | Config     | Actual     | Config      | Actual      | Config  | Actual  | Config  | Actual  |
    |         |        |        |          |        | Partition | Partition | Group    | Group    | Role       | Role       | Role        | Role        | Roles   | Roles   | Groups  | Groups  |
    | ------- | ------ | ------ | -------- | ------ | --------- | --------- | -------- | -------- | ---------- | ---------- | ----------- | ----------- | ------- | ------- | ------- | ------- |
    | hanadb1 | yes    | ok     |          |        |         1 |         1 | default  | default  | master 1   | master     | worker      | master      | worker  | worker  | default | default |
    | hanadb2 | yes    | ok     |          |        |         2 |         2 | default  | default  | master 2   | slave      | worker      | slave       | worker  | worker  | default | default |
    | hanadb3 | yes    | ignore |          |        |         0 |         0 | default  | default  | master 3   | slave      | standby     | standby     | standby | standby | default | -       |
    # Check the instance status
    sapcontrol -nr <b>03</b>  -function GetSystemInstanceList
    GetSystemInstanceList
    OK
    hostname, instanceNr, httpPort, httpsPort, startPriority, features, dispstatus
    hanadb2, 3, 50313, 50314, 0.3, HDB|HDB_WORKER, GREEN
    hanadb1, 3, 50313, 50314, 0.3, HDB|HDB_WORKER, GREEN
    hanadb3, 3, 50313, 50314, 0.3, HDB|HDB_STANDBY, GREEN
   </code></pre>

   Run the following command as root on the worker node, which is in this case **hanadb2** to simulate a node crash.  
   <pre><code>
    echo b > /proc/sysrq-trigger
   </code></pre>

   Monitor the system for failover completion. When the failover has completed capture the status - it should look like the status presented below.  
   <pre><code>
    # Check the instance status
    sapcontrol -nr <b>03</b>  -function GetSystemInstanceList
    GetSystemInstanceList
    OK
    hostname, instanceNr, httpPort, httpsPort, startPriority, features, dispstatus
    hanadb1, 3, 50313, 50314, 0.3, HDB|HDB_WORKER, GREEN
    hanadb3, 3, 50313, 50314, 0.3, HDB|HDB_STANDBY, GREEN
    hanadb2, 3, 50313, 50314, 0.3, HDB|HDB_WORKER, GRAY
    # Check the landscape status
    /usr/sap/HN1/HDB03/exe/python_support> python landscapeHostConfiguration.py
    | Host    | Host   | Host   | Failover | Remove | Storage   | Storage   | Failover | Failover | NameServer | NameServer | IndexServer | IndexServer | Host    | Host    | Worker  | Worker  |
    |         | Active | Status | Status   | Status | Config    | Actual    | Config   | Actual   | Config     | Actual     | Config      | Actual      | Config  | Actual  | Config  | Actual  |
    |         |        |        |          |        | Partition | Partition | Group    | Group    | Role       | Role       | Role        | Role        | Roles   | Roles   | Groups  | Groups  |
    | ------- | ------ | ------ | -------- | ------ | --------- | --------- | -------- | -------- | ---------- | ---------- | ----------- | ----------- | ------- | ------- | ------- | ------- |
    | hanadb1 | yes    | ok     |          |        |         1 |         1 | default  | default  | master 1   | master     | worker      | master      | worker  | worker  | default | default |
    | hanadb2 | no     | info   |          |        |         2 |         0 | default  | default  | master 2   | slave      | worker      | standby     | worker  | standby | default | -       |
    | hanadb3 | yes    | info   |          |        |         0 |         2 | default  | default  | master 3   | slave      | standby     | slave       | standby | worker  | default | default |
   </code></pre>

   > [!IMPORTANT]
   > To avoid delays with SAP HANA failover, when a node experiences kernel panic, set `kernel.panic` to 20 seconds on **all** HANA virtual machines. The configuration is done in `/etc/sysctl`. Reboot the virtual machines to activate the change. Failover, when a node is experiencing kernel panic can take 10 or more minutes, if this change is not performed.  

2. Kill the name server  
   Run the following commands as **hn1**adm to check the status of the environment, prior to the test:  

   <pre><code>
    #Landscape status 
    python /usr/sap/HN1/HDB03/exe/python_support/landscapeHostConfiguration.py
    | Host    | Host   | Host   | Failover | Remove | Storage   | Storage   | Failover | Failover | NameServer | NameServer | IndexServer | IndexServer | Host    | Host    | Worker | Worker  |
    |         | Active | Status | Status   | Status | Config    | Actual    | Config   | Actual   | Config     | Actual     | Config      | Actual      | Config  | Actual  | Config  | Actual  |
    |         |        |        |          |        | Partition | Partition | Group    | Group    | Role       | Role       | Role        | Role        | Roles   | Roles   | Groups  | Groups  |
    | ------- | ------ | ------ | -------- | ------ | --------- | --------- | -------- | -------- | ---------- | ---------- | ----------- | ----------- | ------- | ------- | ------- | ------- |
    | hanadb1 | yes    | ok     |          |        |         1 |         1 | default  | default  | master 1   | master     | worker      | master      | worker  | worker  | default | default |
    | hanadb2 | yes    | ok     |          |        |         2 |         2 | default  | default  | master 2   | slave      | worker      | slave       | worker  | worker  | default | default |
    | hanadb3 | no     | ignore |          |        |         0 |         0 | default  | default  | master 3   | slave      | standby     | standby     | standby | standby | default | -       |
    # Check the instance status
    sapcontrol -nr 03  -function GetSystemInstanceList
    GetSystemInstanceList
    OK
    hostname, instanceNr, httpPort, httpsPort, startPriority, features, dispstatus
    hanadb2, 3, 50313, 50314, 0.3, HDB|HDB_WORKER, GREEN
    hanadb1, 3, 50313, 50314, 0.3, HDB|HDB_WORKER, GREEN
    hanadb3, 3, 50313, 50314, 0.3, HDB|HDB_STANDBY, GRAY
   </code></pre>

   Run the following commands as **hn1**adm on the active master node, which is in this case **hanadb1**.  

   <pre><code>
    hn1adm@hanadb1:/usr/sap/HN1/HDB03> HDB kill
   </code></pre>

   The standby node **hanadb3** will take over as master node. Resource state after the failover test completed:  

   <pre><code>
    # Check the instance status
    sapcontrol -nr 03 -function GetSystemInstanceList
    GetSystemInstanceList
    OK
    hostname, instanceNr, httpPort, httpsPort, startPriority, features, dispstatus
    hanadb2, 3, 50313, 50314, 0.3, HDB|HDB_WORKER, GREEN
    hanadb1, 3, 50313, 50314, 0.3, HDB|HDB_WORKER, GRAY
    hanadb3, 3, 50313, 50314, 0.3, HDB|HDB_STANDBY, GREEN
    # Check the landscape status
    python /usr/sap/HN1/HDB03/exe/python_support/landscapeHostConfiguration.py
    | Host    | Host   | Host   | Failover | Remove | Storage   | Storage   | Failover | Failover | NameServer | NameServer | IndexServer | IndexServer | Host    | Host    | Worker  | Worker  |
    |         | Active | Status | Status   | Status | Config    | Actual    | Config   | Actual   | Config     | Actual     | Config      | Actual      | Config  | Actual  | Config  | Actual  |
    |         |        |        |          |        | Partition | Partition | Group    | Group    | Role       | Role       | Role        | Role        | Roles   | Roles   | Groups  | Groups  |
    | ------- | ------ | ------ | -------- | ------ | --------- | --------- | -------- | -------- | ---------- | ---------- | ----------- | ----------- | ------- | ------- | ------- | ------- |
    | hanadb1 | no     | info   |          |        |         1 |         0 | default  | default  | master 1   | slave      | worker      | standby     | worker  | standby | default | -       |
    | hanadb2 | yes    | ok     |          |        |         2 |         2 | default  | default  | master 2   | slave      | worker      | slave       | worker  | worker  | default | default |
    | hanadb3 | yes    | info   |          |        |         0 |         1 | default  | default  | master 3   | master     | standby     | master      | standby | worker  | default | default |
   </code></pre>

   Start again the HANA instance on **hanadb1**, that is, on the same virtual machine, where the name server was killed. The **hanadb1** node will rejoin the environment and will keep its standby role.  
   <pre><code>
    hn1adm@hanadb1:/usr/sap/HN1/HDB03> HDB start
   </code></pre>

   Expect the following status, after SAP HANA has started on **hanadb1**:  
   <pre><code>
    # Check the instance status
    sapcontrol -nr 03 -function GetSystemInstanceList
    GetSystemInstanceList
    OK
    hostname, instanceNr, httpPort, httpsPort, startPriority, features, dispstatus
    hanadb1, 3, 50313, 50314, 0.3, HDB|HDB_WORKER, GREEN
    hanadb2, 3, 50313, 50314, 0.3, HDB|HDB_WORKER, GREEN
    hanadb3, 3, 50313, 50314, 0.3, HDB|HDB_STANDBY, GREEN
    # Check the landscape status
    python /usr/sap/HN1/HDB03/exe/python_support/landscapeHostConfiguration.py
    | Host    | Host   | Host   | Failover | Remove | Storage   | Storage   | Failover | Failover | NameServer | NameServer | IndexServer | IndexServer | Host    | Host    | Worker  | Worker  |
    |         | Active | Status | Status   | Status | Config    | Actual    | Config   | Actual   | Config     | Actual     | Config      | Actual      | Config  | Actual  | Config  | Actual  |
    |         |        |        |          |        | Partition | Partition | Group    | Group    | Role       | Role       | Role        | Role        | Roles   | Roles   | Groups  | Groups  |
    | ------- | ------ | ------ | -------- | ------ | --------- | --------- | -------- | -------- | ---------- | ---------- | ----------- | ----------- | ------- | ------- | ------- | ------- |
    | hanadb1 | yes    | info   |          |        |         1 |         0 | default  | default  | master 1   | slave      | worker      | standby     | worker  | standby | default | -       |
    | hanadb2 | yes    | ok     |          |        |         2 |         2 | default  | default  | master 2   | slave      | worker      | slave       | worker  | worker  | default | default |
    | hanadb3 | yes    | info   |          |        |         0 |         1 | default  | default  | master 3   | master     | standby     | master      | standby | worker  | default | default |
   </code></pre>

   Now, kill again the name server on the currently active master node, that is, on hanadb3.  
   <pre><code>
    hn1adm@hanadb3:/usr/sap/HN1/HDB03> HDB kill
   </code></pre>

   Node **hanadb1** will resume  the role of master node. Status, after the failover test completed will look like this:
   <pre><code>
    # Check the instance status
    sapcontrol -nr 03  -function GetSystemInstanceList & python /usr/sap/HN1/HDB03/exe/python_support/landscapeHostConfiguration.py
    GetSystemInstanceList
    OK
    hostname, instanceNr, httpPort, httpsPort, startPriority, features, dispstatus
    GetSystemInstanceList
    OK
    hostname, instanceNr, httpPort, httpsPort, startPriority, features, dispstatus
    hanadb1, 3, 50313, 50314, 0.3, HDB|HDB_WORKER, GREEN
    hanadb2, 3, 50313, 50314, 0.3, HDB|HDB_WORKER, GREEN
    hanadb3, 3, 50313, 50314, 0.3, HDB|HDB_STANDBY, GRAY
    # Check the landscape status
    python /usr/sap/HN1/HDB03/exe/python_support/landscapeHostConfiguration.py
    | Host    | Host   | Host   | Failover | Remove | Storage   | Storage   | Failover | Failover | NameServer | NameServer | IndexServer | IndexServer | Host    | Host    | Worker  | Worker  |
    |         | Active | Status | Status   | Status | Config    | Actual    | Config   | Actual   | Config     | Actual     | Config      | Actual      | Config  | Actual  | Config  | Actual  |
    |         |        |        |          |        | Partition | Partition | Group    | Group    | Role       | Role       | Role        | Role        | Roles   | Roles   | Groups  | Groups  |
    | ------- | ------ | ------ | -------- | ------ | --------- | --------- | -------- | -------- | ---------- | ---------- | ----------- | ----------- | ------- | ------- | ------- | ------- |
    | hanadb1 | yes    | ok     |          |        |         1 |         1 | default  | default  | master 1   | master     | worker      | master      | worker  | worker  | default | default |
    | hanadb2 | yes    | ok     |          |        |         2 |         2 | default  | default  | master 2   | slave      | worker      | slave       | worker  | worker  | default | default |
    | hanadb3 | no     | ignore |          |        |         0 |         0 | default  | default  | master 3   | slave      | standby     | standby     | standby | standby | default | -       |
   </code></pre>

   Start SAP HANA on **hanadb3** - it will be ready to serve  as a standby node.  
   <pre><code>
    hn1adm@hanadb3:/usr/sap/HN1/HDB03> HDB start
   </code></pre>

   Status after SAP HANA has started on **hanadb3**.  
   <pre><code>
    # Check the instance status
    sapcontrol -nr 03  -function GetSystemInstanceList & python /usr/sap/HN1/HDB03/exe/python_support/landscapeHostConfiguration.py
    GetSystemInstanceList
    OK
    hostname, instanceNr, httpPort, httpsPort, startPriority, features, dispstatus
    GetSystemInstanceList
    OK
    hostname, instanceNr, httpPort, httpsPort, startPriority, features, dispstatus
    hanadb1, 3, 50313, 50314, 0.3, HDB|HDB_WORKER, GREEN
    hanadb2, 3, 50313, 50314, 0.3, HDB|HDB_WORKER, GREEN
    hanadb3, 3, 50313, 50314, 0.3, HDB|HDB_STANDBY, GRAY
    # Check the landscape status
    python /usr/sap/HN1/HDB03/exe/python_support/landscapeHostConfiguration.py
    | Host    | Host   | Host   | Failover | Remove | Storage   | Storage   | Failover | Failover | NameServer | NameServer | IndexServer | IndexServer | Host    | Host    | Worker  | Worker  |
    |         | Active | Status | Status   | Status | Config    | Actual    | Config   | Actual   | Config     | Actual     | Config      | Actual      | Config  | Actual  | Config  | Actual  |
    |         |        |        |          |        | Partition | Partition | Group    | Group    | Role       | Role       | Role        | Role        | Roles   | Roles   | Groups  | Groups  |
    | ------- | ------ | ------ | -------- | ------ | --------- | --------- | -------- | -------- | ---------- | ---------- | ----------- | ----------- | ------- | ------- | ------- | ------- |
    | hanadb1 | yes    | ok     |          |        |         1 |         1 | default  | default  | master 1   | master     | worker      | master      | worker  | worker  | default | default |
    | hanadb2 | yes    | ok     |          |        |         2 |         2 | default  | default  | master 2   | slave      | worker      | slave       | worker  | worker  | default | default |
    | hanadb3 | no     | ignore |          |        |         0 |         0 | default  | default  | master 3   | slave      | standby     | standby     | standby | standby | default | -       |
   </code></pre>

## Next steps

* [Azure Virtual Machines planning and implementation for SAP][planning-guide]
* [Azure Virtual Machines deployment for SAP][deployment-guide]
* [Azure Virtual Machines DBMS deployment for SAP][dbms-guide]
* To learn how to establish high availability and plan for disaster recovery of SAP 
* HANA on Azure (large instances), see [SAP HANA (large instances) high availability and disaster recovery on Azure](hana-overview-high-availability-disaster-recovery.md).
* To learn how to establish high availability and plan for disaster recovery of SAP HANA on Azure VMs, see [High Availability of SAP HANA on Azure Virtual Machines (VMs)][sap-hana-ha]
