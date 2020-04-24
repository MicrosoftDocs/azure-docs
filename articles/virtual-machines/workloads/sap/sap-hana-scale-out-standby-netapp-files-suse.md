---
title: SAP HANA scale-out with standby with Azure NetApp Files on SLES | Microsoft Docs
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
ms.date: 04/24/2020
ms.author: radeltch

---

# Deploy a SAP HANA scale-out system with standby node on Azure VMs by using Azure NetApp Files on SUSE Linux Enterprise Server 

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


This article describes how to deploy a highly available SAP HANA system in a scale-out configuration with standby on Azure virtual machines (VMs) by using [Azure NetApp Files](https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-introduction/) for the shared storage volumes.  

In the example configurations, installation commands, and so on, the HANA instance is **03** and the HANA system ID is **HN1**. The examples are based on HANA 2.0 SP4 and SUSE Linux Enterprise Server for SAP 12 SP4. 

Before you begin, refer to the following SAP notes and papers:

* [Azure NetApp Files documentation][anf-azure-doc] 
* SAP Note [1928533] includes:  
  * A list of Azure VM sizes that are supported for the deployment of SAP software
  * Important capacity information for Azure VM sizes
  * Supported SAP software, and operating system (OS) and database combinations
  * The required SAP kernel version for Windows and Linux on Microsoft Azure
* SAP Note [2015553]: Lists prerequisites for SAP-supported SAP software deployments in Azure
* SAP Note [2205917]: Contains recommended OS settings for SUSE Linux Enterprise Server for SAP Applications
* SAP Note [1944799]: Contains SAP Guidelines for SUSE Linux Enterprise Server for SAP Applications
* SAP Note [2178632]: Contains detailed information about all monitoring metrics reported for SAP in Azure
* SAP Note [2191498]: Contains the required SAP Host Agent version for Linux in Azure
* SAP Note [2243692]: Contains information about SAP licensing on Linux in Azure
* SAP Note [1984787]: Contains general information about SUSE Linux Enterprise Server 12
* SAP Note [1999351]: Contains additional troubleshooting information for the Azure Enhanced Monitoring Extension for SAP
* SAP Note [1900823]: Contains information about SAP HANA storage requirements
* [SAP Community Wiki](https://wiki.scn.sap.com/wiki/display/HOME/SAPonLinuxNotes): Contains all required SAP notes for Linux
* [Azure Virtual Machines planning and implementation for SAP on Linux][planning-guide]
* [Azure Virtual Machines deployment for SAP on Linux][deployment-guide]
* [Azure Virtual Machines DBMS deployment for SAP on Linux][dbms-guide]
* [SUSE SAP HA Best Practice Guides][suse-ha-guide]: Contains all required information to set up NetWeaver High Availability and SAP HANA System Replication on-premises (to be used as a general baseline; they provide much more detailed information)
* [SUSE High Availability Extension 12 SP3 Release Notes][suse-ha-12sp3-relnotes]
* [NetApp SAP Applications on Microsoft Azure using Azure NetApp Files][anf-sap-applications-azure]


## Overview

One method for achieving HANA high availability is by configuring host auto failover. To configure host auto failover, you add one or more virtual machines to the HANA system and configure them as standby nodes. When active node fails, a standby node automatically takes over. In the presented configuration with Azure virtual machines, you achieve auto failover by using [NFS on Azure NetApp Files](https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-introduction/).  

> [!NOTE]
> The standby node needs access to all database volumes. The HANA volumes must be mounted as NFSv4 volumes. The improved file lease-based locking mechanism in the NFSv4 protocol is used for `I/O` fencing. 

> [!IMPORTANT]
> To build the supported configuration, you must deploy the HANA data and log volumes as NFSv4.1 volumes and mount them by using the NFSv4.1 protocol. The HANA host auto-failover configuration with standby node is not supported with NFSv3.

![SAP NetWeaver High Availability overview](./media/high-availability-guide-suse-anf/sap-hana-scale-out-standby-netapp-files-suse.png)

In the preceding diagram, which follows SAP HANA network recommendations, three subnets are represented within one Azure virtual network: 
* For client communication
* For communication with the storage system
* For internal HANA inter-node communication

The Azure NetApp volumes are in separate subnet, [delegated to Azure NetApp Files](https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-delegate-subnet).  

For this example configuration, the subnets are:  

  - `client` 10.23.0.0/24  
  - `storage` 10.23.2.0/24  
  - `hana` 10.23.3.0/24  
  - `anf` 10.23.1.0/26  

## Set up the Azure NetApp Files infrastructure 

Before you proceed with the setup for Azure NetApp Files infrastructure, familiarize yourself with the [Azure NetApp Files documentation][anf-azure-doc]. 

Azure NetApp Files is available in several [Azure regions](https://azure.microsoft.com/global-infrastructure/services/?products=netapp). Check to see whether your selected Azure region offers Azure NetApp Files.  

For information about the availability of Azure NetApp Files by Azure region, see [Azure NetApp Files Availability by Azure Region][anf-avail-matrix].  

Before you deploy Azure NetApp Files, request onboarding to Azure NetApp Files by going to [Register for Azure NetApp Files instructions][anf-register]. 

### Deploy Azure NetApp Files resources  

The following instructions assume that you've already deployed your [Azure virtual network](https://docs.microsoft.com/azure/virtual-network/virtual-networks-overview). The Azure NetApp Files resources and VMs, where the Azure NetApp Files resources will be mounted, must be deployed in the same Azure virtual network or in peered Azure virtual networks.  

1. If you haven't already deployed the resources, request [onboarding to Azure NetApp Files](https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-register).  

2. Create a NetApp account in your selected Azure region by following the instructions in [Create a NetApp account](https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-create-netapp-account).  

3. Set up an Azure NetApp Files capacity pool by following the instructions in [Set up an Azure NetApp Files capacity pool](https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-set-up-capacity-pool).  

   The HANA architecture presented in this article uses a single Azure NetApp Files capacity pool at the *Ultra Service* level. For HANA workloads on Azure, we recommend using an Azure NetApp Files *Ultra* or *Premium* [service Level](https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-service-levels).  

4. Delegate a subnet to Azure NetApp Files, as described in the instructions in [Delegate a subnet to Azure NetApp Files](https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-delegate-subnet).  

5. Deploy Azure NetApp Files volumes by following the instructions in [Create an NFS volume for Azure NetApp Files](https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-create-volumes).  

   As you're deploying the volumes, be sure to select the **NFSv4.1** version. Currently, access to NFSv4.1 requires additional whitelisting. Deploy the volumes in the designated Azure NetApp Files [subnet](https://docs.microsoft.com/rest/api/virtualnetwork/subnets). The IP addresses of the Azure NetApp volumes are assigned automatically. 
   
   Keep in mind that the Azure NetApp Files resources and the Azure VMs must be in the same Azure virtual network or in peered Azure virtual networks. For example, **HN1**-data-mnt00001, **HN1**-log-mnt00001, and so on, are the volume names and nfs://10.23.1.5/**HN1**-data-mnt00001, nfs://10.23.1.4/**HN1**-log-mnt00001, and so on, are the file paths for the Azure NetApp Files volumes.  

   * volume **HN1**-data-mnt00001 (nfs://10.23.1.5/**HN1**-data-mnt00001)
   * volume **HN1**-data-mnt00002 (nfs://10.23.1.6/**HN1**-data-mnt00002)
   * volume **HN1**-log-mnt00001 (nfs://10.23.1.4/**HN1**-log-mnt00001)
   * volume **HN1**-log-mnt00002 (nfs://10.23.1.6/**HN1**-log-mnt00002)
   * volume **HN1**-shared (nfs://10.23.1.4/**HN1**-shared)
   
   In this example, we used a separate Azure NetApp Files volume for each HANA data and log volume. For a more cost-optimized configuration on smaller or non-productive systems, it's possible to place all data mounts and all logs mounts on a single volume.  

### Important considerations

As you're creating your Azure NetApp Files for SAP NetWeaver on SUSE High Availability architecture, be aware of the following important considerations:

- The minimum capacity pool is 4 tebibytes (TiB).  
- The minimum volume size is 100 gibibytes (GiB).
- Azure NetApp Files and all virtual machines where the Azure NetApp Files volumes will be mounted must be in the same Azure virtual network or in [peered virtual networks](https://docs.microsoft.com/azure/virtual-network/virtual-network-peering-overview) in the same region.  
- The selected virtual network must have a subnet that's delegated to Azure NetApp Files.
- The throughput of an Azure NetApp Files volume is a function of the volume quota and service level, as documented in [Service level for Azure NetApp Files](https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-service-levels). When you're sizing the HANA Azure NetApp volumes, make sure that the resulting throughput meets the HANA system requirements.  
- With the Azure NetApp Files [export policy](https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-configure-export-policy), you can control the allowed clients, the access type (read-write, read only, and so on). 
- The Azure NetApp Files feature isn't zone-aware yet. Currently, the feature isn't deployed in all availability zones in an Azure region. Be aware of the potential latency implications in some Azure regions.  
-  

> [!IMPORTANT]
> For SAP HANA workloads, low latency is critical. Work with your Microsoft representative to ensure that the virtual machines and the Azure NetApp Files volumes are deployed in close proximity.  

### Sizing for HANA database on Azure NetApp Files

The throughput of an Azure NetApp Files volume is a function of the volume size and service level, as documented in [Service level for Azure NetApp Files](https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-service-levels). 

As you design the infrastructure for SAP in Azure, be aware of some minimum storage requirements by SAP, which translate into minimum throughput characteristics:

- Enable read-write on /hana/log of 250 megabytes per second (MB/s) with 1-MB I/O sizes.  
- Enable read activity of at least 400 MB/s for /hana/data for 16-MB and 64-MB I/O sizes.  
- Enable write activity of at least 250 MB/s for /hana/data with 16-MB and 64-MB I/O sizes. 

The [Azure NetApp Files throughput limits](https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-service-levels) per 1 TiB of volume quota are:
- Premium Storage tier - 64 MiB/s  
- Ultra Storage tier - 128 MiB/s  

To meet the SAP minimum throughput requirements for data and log, and the guidelines for /hana/shared, the recommended sizes would be:

| Volume | Size of<br>Premium Storage tier | Size of<br>Ultra Storage tier | Supported NFS protocol |
| --- | --- | --- | --- |
| /hana/log/ | 4 TiB | 2 TiB | v4.1 |
| /hana/data | 6.3 TiB | 3.2 TiB | v4.1 |
| /hana/shared | Max (512 GB, 1xRAM) per 4 worker nodes | Max (512 GB, 1xRAM) per 4 worker nodes | v3 or v4.1 |

The SAP HANA configuration for the layout that's presented in this article, using Azure NetApp Files Ultra Storage tier, would be:

| Volume | Size of<br>Ultra Storage tier | Supported NFS protocol |
| --- | --- | --- |
| /hana/log/mnt00001 | 2 TiB | v4.1 |
| /hana/log/mnt00002 | 2 TiB | v4.1 |
| /hana/data/mnt00001 | 3.2 TiB | v4.1 |
| /hana/data/mnt00002 | 3.2 TiB | v4.1 |
| /hana/shared | 2 TiB | v3 or v4.1 |

> [!NOTE]
> The Azure NetApp Files sizing recommendations stated here are targeted to meet the minimum requirements that SAP recommends for their infrastructure providers. In real customer deployments and workload scenarios, these sizes may not be sufficient. Use these recommendations as a starting point and adapt, based on the requirements of your specific workload.  

> [!TIP]
> You can resize Azure NetApp Files volumes dynamically, without having to *unmount* the volumes, stop the virtual machines, or stop SAP HANA. This approach allows flexibility to meet both the expected and unforeseen throughput demands of your application.

## Deploy Linux virtual machines via the Azure portal

First you need to create the Azure NetApp Files volumes. Then do the following steps:
1. Create the [Azure virtual network subnets](https://docs.microsoft.com/azure/virtual-network/virtual-network-manage-subnet) in your [Azure virtual network](https://docs.microsoft.com/azure/virtual-network/virtual-networks-overview). 
1. Deploy the VMs. 
1. Create the additional network interfaces, and attach the network interfaces to the corresponding VMs.  

   Each virtual machine has three network interfaces, which correspond to the three Azure virtual network subnets (`client`, `storage` and `hana`). 

   For more information, see [Create a Linux virtual machine in Azure with multiple network interface cards](https://docs.microsoft.com/azure/virtual-machines/linux/multiple-nics).  

> [!IMPORTANT]
> For SAP HANA workloads, low latency is critical. To achieve low latency, work with your Microsoft representative to ensure that the virtual machines and the Azure NetApp Files volumes are deployed in close proximity. When you're [onboarding new SAP HANA system](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbRxjSlHBUxkJBjmARn57skvdUQlJaV0ZBOE1PUkhOVk40WjZZQVJXRzI2RC4u) that's using SAP HANA Azure NetApp Files, submit the necessary information. 
 
The next instructions assume that you've already created the resource group, the Azure virtual network, and the three Azure virtual network subnets: `client`, `storage` and `hana`. When you deploy the VMs, select the client subnet, so that the client network interface is the primary interface on the VMs. You will also need to configure an explicit route to the Azure NetApp Files delegated subnet via the storage subnet gateway. 

> [!IMPORTANT]
> Make sure that the OS you select is SAP-certified for SAP HANA on the specific VM types you're using. For a list of SAP HANA certified VM types and OS releases for those types, go to the [SAP HANA certified IaaS platforms](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure) site. Click into the details of the listed VM type to get the complete list of SAP HANA-supported OS releases for that type.  

1. Create an availability set for SAP HANA. Make sure to set the max update domain.  

2. Create three virtual machines (**hanadb1**, **hanadb2**, **hanadb3**) by doing the following steps:  

   a. Use a SLES4SAP image in the Azure gallery that's supported for SAP HANA. We used a SLES4SAP 12 SP4 image in this example.  

   b. Select the availability set that you created earlier for SAP HANA.  

   c. Select the client Azure virtual network subnet. Select [Accelerated Network](https://docs.microsoft.com/azure/virtual-network/create-vm-accelerated-networking-cli).  

   When you deploy the virtual machines, the network interface name is automatically generated. In these instructions for simplicity we'll refer to the automatically generated network interfaces, which are attached to the client Azure virtual network subnet, as **hanadb1-client**, **hanadb2-client**, and **hanadb3-client**. 

3. Create three network interfaces, one for each virtual machine, for the `storage` virtual network subnet (in this example, **hanadb1-storage**, **hanadb2-storage**, and **hanadb3-storage**).  

4. Create three network interfaces, one for each virtual machine, for the `hana`  virtual network subnet (in this example, **hanadb1-hana**, **hanadb2-hana**, and **hanadb3-hana**).  

5. Attach the newly created virtual network interfaces to the corresponding virtual machines by doing the following steps:  

    a. Go to the virtual machine in the [Azure portal](https://portal.azure.com/#home).  

    b. In the left pane, select **Virtual Machines**. Filter on the virtual machine name (for example, **hanadb1**), and then select the virtual machine.  

    c. In the **Overview** pane, select **Stop** to deallocate the virtual machine.  

    d. Select **Networking**, and then attach the network interface. In the **Attach network interface** drop-down list, select the already created network interfaces for the `storage` and `hana` subnets.  
    
    e. Select **Save**. 
 
    f. Repeat steps b through e for the remaining virtual machines (in our example,  **hanadb2** and **hanadb3**).
 
    g. Leave the virtual machines in stopped state for now. Next, we'll enable [accelerated networking](https://docs.microsoft.com/azure/virtual-network/create-vm-accelerated-networking-cli) for all newly attached network interfaces.  

6. Enable accelerated networking for the additional network interfaces for the `storage` and `hana` subnets by doing the following steps:  

    a. Open [Azure Cloud Shell](https://azure.microsoft.com/features/cloud-shell/) in the [Azure portal](https://portal.azure.com/#home).  

    b. Execute the following commands to enable accelerated networking for the additional network interfaces, which are attached to the `storage` and `hana` subnets.  

    <pre><code>
    az network nic update --id /subscriptions/<b>your subscription</b>/resourceGroups/<b>your resource group</b>/providers/Microsoft.Network/networkInterfaces/<b>hanadb1-storage</b> --accelerated-networking true
    az network nic update --id /subscriptions/<b>your subscription</b>/resourceGroups/<b>your resource group</b>/providers/Microsoft.Network/networkInterfaces/<b>hanadb2-storage</b> --accelerated-networking true
    az network nic update --id /subscriptions/<b>your subscription</b>/resourceGroups/<b>your resource group</b>/providers/Microsoft.Network/networkInterfaces/<b>hanadb3-storage</b> --accelerated-networking true
    
    az network nic update --id /subscriptions/<b>your subscription</b>/resourceGroups/<b>your resource group</b>/providers/Microsoft.Network/networkInterfaces/<b>hanadb1-hana</b> --accelerated-networking true
    az network nic update --id /subscriptions/<b>your subscription</b>/resourceGroups/<b>your resource group</b>/providers/Microsoft.Network/networkInterfaces/<b>hanadb2-hana</b> --accelerated-networking true
    az network nic update --id /subscriptions/<b>your subscription</b>/resourceGroups/<b>your resource group</b>/providers/Microsoft.Network/networkInterfaces/<b>hanadb3-hana</b> --accelerated-networking true

    </code></pre>

7. Start the virtual machines by doing the following steps:  

    a. In the left pane, select **Virtual Machines**. Filter on the virtual machine name (for example, **hanadb1**), and then select it.  

    b. In the **Overview** pane, select **Start**.  

## Operating system configuration and preparation

The instructions in the next sections are prefixed with one of the following:
* **[A]**: Applicable to all nodes
* **[1]**: Applicable only to node 1
* **[2]**: Applicable only to node 2
* **[3]**: Applicable only to node 3

Configure and prepare your OS by doing the following steps:

1. **[A]** Maintain the host files on the virtual machines. Include entries for all subnets. The following entries were added to `/etc/hosts` for this example.  

    <pre><code>
    # Storage
    10.23.2.4   hanadb1-storage
    10.23.2.5   hanadb2-storage
    10.23.2.6   hanadb3-storage
    # Client
    10.23.0.5   hanadb1
    10.23.0.6   hanadb2
    10.23.0.7   hanadb3
    # Hana
    10.23.3.4   hanadb1-hana
    10.23.3.5   hanadb2-hana
    10.23.3.6   hanadb3-hana
    </code></pre>

2. **[A]** Change DHCP and cloud config settings for the network interface for storage to avoid unintended hostname changes.  

    The following instructions assume that the storage network interface is `eth1`. 

    <pre><code>
    vi /etc/sysconfig/network/dhcp
    # Change the following DHCP setting to "no"
    DHCLIENT_SET_HOSTNAME="no"
    vi /etc/sysconfig/network/ifcfg-<b>eth1</b>
    # Edit ifcfg-eth1 
    #Change CLOUD_NETCONFIG_MANAGE='yes' to "no"
    CLOUD_NETCONFIG_MANAGE='no'
    </code></pre>

2. **[A]** Add a network route, so that the communication to the Azure NetApp Files goes via the storage network interface.  

    The following instructions assume that the storage network interface is `eth1`.  

    <pre><code>
    vi /etc/sysconfig/network/ifroute-<b>eth1</b>
    # Add the following routes 
    # RouterIPforStorageNetwork - - -
    # ANFNetwork/cidr RouterIPforStorageNetwork - -
    <b>10.23.2.1</b> - - -
    <b>10.23.1.0/26</b> <b>10.23.2.1</b> - -
    </code></pre>

    Reboot the VM to activate the changes.  

3. **[A]** Prepare the OS for running SAP HANA on NetApp Systems with NFS, as described in [NetApp SAP Applications on Microsoft Azure using Azure NetApp Files][anf-sap-applications-azure]. Create configuration file */etc/sysctl.d/netapp-hana.conf* for the NetApp configuration settings.  

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

4. **[A]** Create configuration file */etc/sysctl.d/ms-az.conf* with Microsoft for Azure configuration settings.  

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

4. **[A]** Adjust the sunrpc settings, as recommended in the [NetApp SAP Applications on Microsoft Azure using Azure NetApp Files][anf-sap-applications-azure].  

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

2. **[1]** Create node-specific directories for /usr/sap on **HN1**-shared.  

    <pre><code>
    # Create a temporary directory to mount <b>HN1</b>-shared
    mkdir /mnt/tmp
    # if using NFSv3 for this volume, mount with the following command
    mount <b>10.23.1.4</b>:/<b>HN1</b>-shared /mnt/tmp
    # if using NFSv4.1 for this volume, mount with the following command
    mount -t nfs -o sec=sys,vers=4.1 <b>10.23.1.4</b>:/<b>HN1</b>-shared /mnt/tmp
    cd /mnt/tmp
    mkdir shared usr-sap-<b>hanadb1</b> usr-sap-<b>hanadb2</b> usr-sap-<b>hanadb3</b>
    # unmount /hana/shared
    cd
    umount /mnt/tmp
    </code></pre>

3. **[A]** Verify the NFS domain setting. Make sure that the domain is configured as the default Azure NetApp Files domain, i.e. **`defaultv4iddomain.com`** and the mapping is set to **nobody**.  

    > [!IMPORTANT]
    > Make sure to set the NFS domain in `/etc/idmapd.conf` on the VM to match the default domain configuration on Azure NetApp Files: **`defaultv4iddomain.com`**. If there's a mismatch between the domain configuration on the NFS client (i.e. the VM) and the NFS server, i.e. the Azure NetApp configuration, then the permissions for files on Azure NetApp volumes that are mounted on the VMs will be displayed as `nobody`.  

    <pre><code>
    sudo cat /etc/idmapd.conf
    # Example
    [General]
    Verbosity = 0
    Pipefs-Directory = /var/lib/nfs/rpc_pipefs
    Domain = <b>defaultv4iddomain.com</b>
    [Mapping]
    Nobody-User = <b>nobody</b>
    Nobody-Group = <b>nobody</b>
    </code></pre>

4. **[A]** Verify `nfs4_disable_idmapping`. It should be set to **Y**. To create the directory structure where `nfs4_disable_idmapping` is located, execute the mount command. You won't be able to manually create the directory under /sys/modules, because access is reserved for the kernel / drivers.  

    <pre><code>
    # Check nfs4_disable_idmapping 
    cat /sys/module/nfs/parameters/nfs4_disable_idmapping
    # If you need to set nfs4_disable_idmapping to Y
    mkdir /mnt/tmp
    mount 10.23.1.4:/HN1-shared /mnt/tmp
    umount  /mnt/tmp
    echo "Y" > /sys/module/nfs/parameters/nfs4_disable_idmapping
    # Make the configuration permanent
    echo "options nfs nfs4_disable_idmapping=Y" >> /etc/modprobe.d/nfs.conf
    </code></pre>

5. **[A]** Create the SAP HANA group and user manually. The IDs for group sapsys and user **hn1**adm must be set to the same IDs, which are provided during the onboarding. (In this example, the IDs are set to **1001**.) If the IDs aren't set correctly, you won't be able to access the volumes. The IDs for group sapsys and user accounts **hn1**adm and sapadm must be the same on all virtual machines.  

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

In this example for deploying SAP HANA in scale-out configuration with standby node with Azure, we've used HANA 2.0 SP4.  

### Prepare for HANA installation

1. **[A]** Before the HANA installation, set the root password. You can disable the root password after the installation has been completed. Execute as `root` command `passwd`.  

2. **[1]** Verify that you can log in via SSH to **hanadb2** and **hanadb3**, without being prompted for a password.  

    <pre><code>
    ssh root@<b>hanadb2</b>
    ssh root@<b>hanadb3</b>
    </code></pre>

3. **[A]** Install additional packages, which are required for HANA 2.0 SP4. For more information, see SAP Note [2593824](https://launchpad.support.sap.com/#/notes/2593824). 

    <pre><code>
    sudo zypper install libgcc_s1 libstdc++6 libatomic1 
    </code></pre>

4. **[2], [3]** Change ownership of SAP HANA `data` and `log` directories to **hn1**adm.   

    <pre><code>
    # Execute as root
    sudo chown hn1adm:sapsys /hana/data/<b>HN1</b>
    sudo chown hn1adm:sapsys /hana/log/<b>HN1</b>
    </code></pre>

### HANA installation

1. **[1]** Install SAP HANA by following the instructions in the [SAP HANA 2.0 Installation and Update guide](https://help.sap.com/viewer/2c1988d620e04368aa4103bf26f17727/2.0.04/en-US/7eb0167eb35e4e2885415205b8383584.html). In this example, we install SAP HANA scale-out with master, one worker, and one standby node.  

   a. Start the **hdblcm** program from the HANA installation software directory. Use the `internal_network` parameter and pass the address space for subnet, which is used for the internal HANA inter-node communication.  

    <pre><code>
    ./hdblcm --internal_network=10.23.3.0/24
    </code></pre>

   b. At the prompt, enter the following values:

     * For **Choose an action**: enter **1** (for install)
     * For **Additional components for installation**: enter **2, 3**
     * For installation path: press Enter (defaults to /hana/shared)
     * For **Local Host Name**: press Enter to accept the default
     * Under **Do you want to add hosts to the system?**: enter **y**
     * For **comma-separated host names to add**: enter **hanadb2, hanadb3**
     * For **Root User Name** [root]: press Enter to accept the default
     * For **Root User Password**: enter the root user's password
     * For roles for host hanadb2: enter **1**  (for worker)
     * For **Host Failover Group** for host hanadb2 [default]: press Enter to accept the default
     * For **Storage Partition Number** for host hanadb2 [<<assign automatically>>]: press Enter to accept the default
     * For **Worker Group** for host hanadb2 [default]: press Enter to accept the default
     * For **Select roles** for host hanadb3: enter **2** (for standby)
     * For **Host Failover Group** for host hanadb3 [default]: press Enter to accept the default
     * For **Worker Group** for host hanadb3 [default]: press Enter to accept the default
     * For **SAP HANA System ID**: enter **HN1**
     * For **Instance number** [00]: enter **03**
     * For **Local Host Worker Group** [default]: press Enter to accept the default
     * For **Select System Usage / Enter index [4]**: enter **4** (for custom)
     * For **Location of Data Volumes** [/hana/data/HN1]: press Enter to accept the default
     * For **Location of Log Volumes** [/hana/log/HN1]: press Enter to accept the default
     * For **Restrict maximum memory allocation?** [n]: enter **n**
     * For **Certificate Host Name For Host hanadb1** [hanadb1]: press Enter to accept the default
     * For **Certificate Host Name For Host hanadb2** [hanadb2]: press Enter to accept the default
     * For **Certificate Host Name For Host hanadb3** [hanadb3]: press Enter to accept the default
     * For **System Administrator (hn1adm) Password**: enter the password
     * For **System Database User (system) Password**: enter the system's password
     * For **Confirm System Database User (system) Password**: enter system's password
     * For **Restart system after machine reboot?** [n]: enter **n** 
     * For **Do you want to continue (y/n)**: validate the summary and if everything looks good, enter **y**


2. **[1]** Verify global.ini  

   Display global.ini, and ensure that the configuration for the internal SAP HANA inter-node communication is in place. Verify the **communication** section. It should have the address space for the `hana` subnet, and `listeninterface` should be set to `.internal`. Verify the **internal_hostname_resolution** section. It should have the IP addresses for the HANA virtual machines that belong to the `hana` subnet.  

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

3. **[1]** Add host mapping to ensure that the client IP addresses are used for client communication. Add section `public_host_resolution`, and add the corresponding IP addresses from the client subnet.  

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

5. **[1]** Verify that the client interface will be using the IP addresses from the `client` subnet for communication.  

   <pre><code>
    sudo -u hn1adm /usr/sap/HN1/HDB03/exe/hdbsql -u SYSTEM -p "<b>password</b>" -i 03 -d SYSTEMDB 'select * from SYS.M_HOST_INFORMATION'|grep net_publicname
    # Expected result
    "<b>hanadb3</b>","net_publicname","<b>10.23.0.7</b>"
    "<b>hanadb2</b>","net_publicname","<b>10.23.0.6</b>"
    "<b>hanadb1</b>","net_publicname","<b>10.23.0.5</b>"
   </code></pre>

   For information about how to verify the configuration, see SAP Note [2183363 - Configuration of SAP HANA internal network](https://launchpad.support.sap.com/#/notes/2183363).  

6. To optimize SAP HANA for the underlying Azure NetApp Files storage, set the following SAP HANA parameters:

   - `max_parallel_io_requests` **128**
   - `async_read_submit` **on**
   - `async_write_submit_active` **on**
   - `async_write_submit_blocks` **all**

   For more information, see [NetApp SAP Applications on Microsoft Azure using Azure NetApp Files][anf-sap-applications-azure]. 

   Starting with SAP HANA 2.0 systems, you can set the parameters in `global.ini`. For more information, see SAP Note [1999930](https://launchpad.support.sap.com/#/notes/1999930).  
   
   For SAP HANA 1.0 systems versions SPS12 and earlier, these parameters can be set during the installation, as described in SAP Note [2267798](https://launchpad.support.sap.com/#/notes/2267798).  

7. The storage that's used by Azure NetApp Files has a file size limitation of 16 terabytes (TB). SAP HANA is not implicitly aware of the storage limitation, and it won't automatically create a new data file when the file size limit of 16 TB is reached. As SAP HANA attempts to grow the file beyond 16 TB, that attempt will result in errors and, eventually, in an index server crash. 

   > [!IMPORTANT]
   > To prevent SAP HANA from trying to grow data files beyond the [16-TB limit](https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-resource-limits) of the storage subsystem, set the following parameters in `global.ini`.  
   > - datavolume_striping = true
   > - datavolume_striping_size_gb = 15000
   > For more information, see SAP Note [2400005](https://launchpad.support.sap.com/#/notes/2400005).
   > Be aware of SAP Note [2631285](https://launchpad.support.sap.com/#/notes/2631285). 

## Test SAP HANA failover 

1. Simulate a node crash on an SAP HANA worker node. Do the following: 

   a. Before you simulate the node crash, run the following commands as **hn1**adm to capture the status of the environment:  

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

   b. To simulate a node crash, run the following command as root on the worker node, which is **hanadb2** in this case:  
   
   <pre><code>
    echo b > /proc/sysrq-trigger
   </code></pre>

   c. Monitor the system for failover completion. When the failover has been completed, capture the status, which should look like the following:  

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
   > When a node experiences kernel panic, avoid delays with SAP HANA failover by setting `kernel.panic` to 20 seconds on *all* HANA virtual machines. The configuration is done in `/etc/sysctl`. Reboot the virtual machines to activate the change. If this change isn't performed, failover can take 10 or more minutes when a node is experiencing kernel panic.  

2. Kill the name server by doing the following:

   a. Prior to the test, check the status of the environment by running the following commands as **hn1**adm:  

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

   b. Run the following commands as **hn1**adm on the active master node, which is **hanadb1** in this case:  

    <pre><code>
        hn1adm@hanadb1:/usr/sap/HN1/HDB03> HDB kill
    </code></pre>
    
    The standby node **hanadb3** will take over as master node. Here is the resource state after the failover test is completed:  

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

   c. Restart the HANA instance on **hanadb1** (that is, on the same virtual machine, where the name server was killed). The **hanadb1** node will rejoin the environment and will keep its standby role.  

   <pre><code>
    hn1adm@hanadb1:/usr/sap/HN1/HDB03> HDB start
   </code></pre>

   After SAP HANA has started on **hanadb1**, expect the following status:  

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

   d. Again, kill the name server on the currently active master node (that is, on node **hanadb3**).  
   
   <pre><code>
    hn1adm@hanadb3:/usr/sap/HN1/HDB03> HDB kill
   </code></pre>

   Node **hanadb1** will resume the role of master node. After the failover test has been completed, the status will look like this:

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

   e. Start SAP HANA on **hanadb3**, which will be ready to serve as a standby node.  

   <pre><code>
    hn1adm@hanadb3:/usr/sap/HN1/HDB03> HDB start
   </code></pre>

   After SAP HANA has started on **hanadb3**, the status looks like the following:  

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
* To learn how to establish high availability and plan for disaster recovery of SAP HANA on Azure VMs, see [High Availability of SAP HANA on Azure Virtual Machines (VMs)][sap-hana-ha].
