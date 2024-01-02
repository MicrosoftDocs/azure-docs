---
title: SAP HANA scale-out with HSR and Pacemaker on RHEL| Microsoft Docs
description: SAP HANA scale-out with HANA system replication (HSR) and Pacemaker on Red Hat Enterprise Linux (RHEL)
author: rdeltcheva
manager: juergent
tags: azure-resource-manager
ms.custom: devx-track-azurecli
ms.assetid: 5e514964-c907-4324-b659-16dd825f6f87
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 09/26/2023
ms.author: radeltch
---

# High availability of SAP HANA scale-out system on Red Hat Enterprise Linux 

[dbms-guide]:dbms-guide-general.md
[deployment-guide]:deployment-guide.md
[planning-guide]:planning-guide.md

[anf-azure-doc]:../../azure-netapp-files/index.yml
[anf-avail-matrix]:https://azure.microsoft.com/global-infrastructure/services/?products=netapp&regions=all 

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
[2292690]:https://launchpad.support.sap.com/#/notes/2292690
[2455582]:https://launchpad.support.sap.com/#/notes/2455582
[2593824]:https://launchpad.support.sap.com/#/notes/2593824
[2009879]:https://launchpad.support.sap.com/#/notes/2009879
[3108302]:https://launchpad.support.sap.com/#/notes/3108302

[sap-swcenter]:https://support.sap.com/en/my-support/software-downloads.html

[sap-hana-ha]:sap-hana-high-availability.md
[nfs-ha]:high-availability-guide-suse-nfs.md

This article describes how to deploy a highly available SAP HANA system in a scale-out configuration. Specifically, the configuration uses HANA system replication (HSR) and Pacemaker on Azure Red Hat Enterprise Linux virtual machines (VMs). The shared file systems in the presented architecture are NFS mounted and are provided by [Azure NetApp Files](../../azure-netapp-files/azure-netapp-files-introduction.md) or [NFS share on Azure Files](../../storage/files/files-nfs-protocol.md).    

In the example configurations and installation commands, the HANA instance is `03` and the HANA system ID is `HN1`.  

## Prerequisites

Some readers will benefit from consulting a variety of SAP notes and resources before proceeding further with the topics in this article:

* SAP note [1928533] includes:  
  * A list of Azure VM sizes that are supported for the deployment of SAP software.
  * Important capacity information for Azure VM sizes.
  * Supported SAP software, and operating system and database combinations.
  * The required SAP kernel version for Windows and Linux on Microsoft Azure.
* SAP note [2015553]: Lists prerequisites for SAP-supported SAP software deployments in Azure.
* SAP note [2002167]: Has recommended operating system settings for RHEL.
* SAP note [2009879]: Has SAP HANA guidelines for RHEL.
* SAP Note [3108302] has SAP HANA Guidelines for Red Hat Enterprise Linux 9.x.
* SAP note [2178632]: Contains detailed information about all monitoring metrics reported for SAP in Azure.
* SAP note [2191498]: Contains the required SAP host agent version for Linux in Azure.
* SAP note [2243692]: Contains information about SAP licensing on Linux in Azure.
* SAP note [1999351]: Contains additional troubleshooting information for the Azure enhanced monitoring extension for SAP.
* SAP note [1900823]: Contains information about SAP HANA storage requirements.
* [SAP community wiki](https://wiki.scn.sap.com/wiki/display/HOME/SAPonLinuxNotes): Contains all required SAP notes for Linux.
* [Azure Virtual Machines planning and implementation for SAP on Linux][planning-guide].
* [Azure Virtual Machines deployment for SAP on Linux][deployment-guide].
* [Azure Virtual Machines DBMS deployment for SAP on Linux][dbms-guide].
* [SAP HANA network requirements](https://www.sap.com/documents/2016/08/1cd2c2fb-807c-0010-82c7-eda71af511fa.html).
* General RHEL documentation:
  * [High availability add-on overview](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/high_availability_add-on_overview/index).
  * [High availability add-on administration](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/high_availability_add-on_administration/index).
  * [High availability add-on reference](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/high_availability_add-on_reference/index).
  * [Red Hat Enterprise Linux networking guide](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/networking_guide).
  * [How do I configure SAP HANA scale-out system replication in a Pacemaker cluster with HANA file systems on NFS shares](https://access.redhat.com/solutions/5423971).
  * [Active/Active (read-enabled): RHEL HA solution for SAP HANA scale out and system replication](https://access.redhat.com/sites/default/files/attachments/v8_ha_solution_for_sap_hana_scale_out_system_replication_1.pdf).
* Azure-specific RHEL documentation:
  * [Install SAP HANA on Red Hat Enterprise Linux for use in Microsoft Azure](https://access.redhat.com/public-cloud/microsoft-azure).
  * [Red Hat Enterprise Linux Solution for SAP HANA scale-out and system replication](https://access.redhat.com/solutions/4386601).
* [Azure NetApp Files documentation][anf-azure-doc]. 
* [NFS v4.1 volumes on Azure NetApp Files for SAP HANA](./hana-vm-operations-netapp.md).
* [Azure Files documentation](../../storage/files/storage-files-introduction.md)  

## Overview

To achieve HANA high availability for HANA scale-out installations, you can configure HANA system replication, and protect the solution with a Pacemaker cluster to allow automatic failover. When an active node fails, the cluster fails over the HANA resources to the other site.  

In the following diagram, there are three HANA nodes on each site, and a majority maker node to prevent a "split-brain" scenario. The instructions can be adapted to include more VMs as HANA DB nodes.  

The HANA shared file system `/hana/shared` in the presented architecture can be provided by [Azure NetApp Files](../../azure-netapp-files/azure-netapp-files-introduction.md) or [NFS share on Azure Files](../../storage/files/files-nfs-protocol.md). The HANA shared file system is NFS mounted on each HANA node in the same HANA system replication site. File systems `/hana/data` and `/hana/log` are local file systems and aren't shared between the HANA DB nodes. SAP HANA will be installed in non-shared mode.  

For recommended SAP HANA storage configurations, see [SAP HANA Azure VMs storage configurations](./hana-vm-operations-storage.md). 

> [!IMPORTANT]
> If deploying all HANA file systems on Azure NetApp Files, for production systems, where performance is a key, we recommend to evaluate and consider using [Azure NetApp Files application volume group for SAP HANA](hana-vm-operations-netapp.md#deployment-through-azure-netapp-files-application-volume-group-for-sap-hana-avg).  


[![Diagram of SAP HANA scale-out with HSR and Pacemaker cluster.](./media/sap-hana-high-availability-rhel/sap-hana-high-availability-scale-out-hsr-rhel.png)](./media/sap-hana-high-availability-rhel/sap-hana-high-availability-scale-out-hsr-rhel-detail.png#lightbox)

The preceding diagram shows three subnets represented within one Azure virtual network, following the SAP HANA network recommendations: 

* For client communication: `client` 10.23.0.0/24  
* For internal HANA internode communication: `inter` 10.23.1.128/26  
* For HANA system replication: `hsr` 10.23.1.192/26  

Because `/hana/data` and `/hana/log` are deployed on local disks, it isn't necessary to deploy separate subnet and separate virtual network cards for communication to the storage.  

If you're using Azure NetApp Files, the NFS volumes for `/hana/shared`, are deployed in a separate subnet, [delegated to Azure NetApp Files](../../azure-netapp-files/azure-netapp-files-delegate-subnet.md): `anf` 10.23.1.0/26.  

## Set up the infrastructure

In the instructions that follow, we assume that you've already created the resource group, the Azure virtual network with three Azure network subnets: `client`, `inter` and `hsr`.

### Deploy Linux virtual machines via the Azure portal

1. Deploy the Azure VMs. For this configuration, deploy seven virtual machines: 
   
   - Three virtual machines to serve as HANA DB nodes for HANA replication site 1: **hana-s1-db1**, **hana-s1-db2** and **hana-s1-db3**.  
   - Three virtual machines to serve as HANA DB nodes for HANA replication site 2: **hana-s2-db1**, **hana-s2-db2** and **hana-s2-db3**.  
   - A small virtual machine to serve as majority maker: **hana-s-mm**.

   The VMs deployed as SAP DB HANA nodes should be certified by SAP for HANA, as published in the [SAP HANA hardware directory](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/#/solutions?filters=v:deCertified;ve:24;iaas;v:125;v:105;v:99;v:120). When you're deploying the HANA DB nodes, make sure to select [accelerated network](../../virtual-network/create-vm-accelerated-networking-cli.md).  
  
   For the majority maker node, you can deploy a small VM, because this VM doesn't run any of the SAP HANA resources. The majority maker VM is used in the cluster configuration to achieve and odd number of cluster nodes in a split-brain scenario. The majority maker VM only needs one virtual network interface in the `client` subnet in this example.        

   Deploy local managed disks for `/hana/data` and `/hana/log`. The minimum recommended storage configuration for `/hana/data` and `/hana/log` is described in [SAP HANA Azure VMs storage configurations](./hana-vm-operations-storage.md).

   Deploy the primary network interface for each VM in the `client` virtual network subnet. When the VM is deployed via Azure portal, the network interface name is automatically generated. In this article, we'll refer to the automatically generated, primary network interfaces as **hana-s1-db1-client**, **hana-s1-db2-client**, **hana-s1-db3-client**, and so on. These network interfaces are attached to the `client` Azure virtual network subnet.  

   > [!IMPORTANT]
   > Make sure that the operating system you select is SAP-certified for SAP HANA on the specific VM types that you're using. For a list of SAP HANA certified VM types and operating system releases for those types, see [SAP HANA certified IaaS platforms](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/#/solutions?filters=v:deCertified;ve:24;iaas;v:125;v:105;v:99;v:120). Drill into the details of the listed VM type to get the complete list of SAP HANA-supported operating system releases for that type.  
  
1. Create six network interfaces, one for each HANA DB virtual machine, in the `inter` virtual network subnet (in this example, **hana-s1-db1-inter**, **hana-s1-db2-inter**, **hana-s1-db3-inter**, **hana-s2-db1-inter**, **hana-s2-db2-inter**, and **hana-s2-db3-inter**).  

1. Create six network interfaces, one for each HANA DB virtual machine, in the `hsr` virtual network subnet (in this example, **hana-s1-db1-hsr**, **hana-s1-db2-hsr**, **hana-s1-db3-hsr**, **hana-s2-db1-hsr**, **hana-s2-db2-hsr**, and **hana-s2-db3-hsr**).  

1. Attach the newly created virtual network interfaces to the corresponding virtual machines:  

    1. Go to the virtual machine in the [Azure portal](https://portal.azure.com/#home).  

    1. On the left pane, select **Virtual Machines**. Filter on the virtual machine name (for example, **hana-s1-db1**), and then select the virtual machine.  

    1. On the **Overview** pane, select **Stop** to deallocate the virtual machine.  

    1. Select **Networking**, and then attach the network interface. In the **Attach network interface** dropdown list, select the already created network interfaces for the `inter` and `hsr` subnets.  
    
    1. Select **Save**. 
 
    1. Repeat steps b through e for the remaining virtual machines (in our example,  **hana-s1-db2**, **hana-s1-db3**, **hana-s2-db1**, **hana-s2-db2** and **hana-s2-db3**).
 
    1. Leave the virtual machines in the stopped state for now.   

1. Enable [accelerated networking](../../virtual-network/create-vm-accelerated-networking-cli.md) for the additional network interfaces for the `inter` and `hsr` subnets by doing the following:  

    1. Open [Azure Cloud Shell](https://azure.microsoft.com/features/cloud-shell/) in the [Azure portal](https://portal.azure.com/#home).  

    1. Run the following commands to enable accelerated networking for the additional network interfaces, which are attached to the `inter` and `hsr` subnets.  

    ```azurecli
    az network nic update --id /subscriptions/your subscription/resourceGroups/your resource group/providers/Microsoft.Network/networkInterfaces/hana-s1-db1-inter --accelerated-networking true
    az network nic update --id /subscriptions/your subscription/resourceGroups/your resource group/providers/Microsoft.Network/networkInterfaces/hana-s1-db2-inter --accelerated-networking true
    az network nic update --id /subscriptions/your subscription/resourceGroups/your resource group/providers/Microsoft.Network/networkInterfaces/hana-s1-db3-inter --accelerated-networking true
    az network nic update --id /subscriptions/your subscription/resourceGroups/your resource group/providers/Microsoft.Network/networkInterfaces/hana-s2-db1-inter --accelerated-networking true
    az network nic update --id /subscriptions/your subscription/resourceGroups/your resource group/providers/Microsoft.Network/networkInterfaces/hana-s2-db2-inter --accelerated-networking true
    az network nic update --id /subscriptions/your subscription/resourceGroups/your resource group/providers/Microsoft.Network/networkInterfaces/hana-s2-db3-inter --accelerated-networking true
    
    az network nic update --id /subscriptions/your subscription/resourceGroups/your resource group/providers/Microsoft.Network/networkInterfaces/hana-s1-db1-hsr --accelerated-networking true
    az network nic update --id /subscriptions/your subscription/resourceGroups/your resource group/providers/Microsoft.Network/networkInterfaces/hana-s1-db2-hsr --accelerated-networking true
    az network nic update --id /subscriptions/your subscription/resourceGroups/your resource group/providers/Microsoft.Network/networkInterfaces/hana-s1-db3-hsr --accelerated-networking true
    az network nic update --id /subscriptions/your subscription/resourceGroups/your resource group/providers/Microsoft.Network/networkInterfaces/hana-s2-db1-hsr --accelerated-networking true
    az network nic update --id /subscriptions/your subscription/resourceGroups/your resource group/providers/Microsoft.Network/networkInterfaces/hana-s2-db2-hsr --accelerated-networking true
    az network nic update --id /subscriptions/your subscription/resourceGroups/your resource group/providers/Microsoft.Network/networkInterfaces/hana-s2-db3-hsr --accelerated-networking true
    ```

1. Start the HANA DB virtual machines.

### Deploy Azure Load Balancer

It's best to use the standard load balancer. Here's how:

1. Create a front-end IP pool:

    1. Open the load balancer, select **frontend IP pool**, and select **Add**.
    1. Enter the name of the new front-end IP pool (for example, *hana-frontend*).
    1. Set the **Assignment** to **Static**, and enter the IP address (for example, *10.23.0.18*).
    1. Select **OK**.
    1. After the new front-end IP pool is created, note the pool IP address.

1. Create a single back-end pool: 
 
   1. Open the load balancer, select **Backend pools**, and then select **Add**.
   1. Enter the name of the new back-end pool (for example, *hana-backend*).
   2. Select **NIC** for Backend Pool Configuration. 
   1. Select **Add a virtual machine**.
   1. Select the virtual machines of the HANA cluster (the NICs for the `client` subnet).
   1. Select **Add**.     
   2. Select **Save**.

1. Create a health probe:

    1. Open the load balancer, select **health probes**, and select **Add**.
    1. Enter the name of the new health probe (for example, *hana-hp*).
    1. Select **TCP** as the protocol and port 625**03**. Keep the **Interval** value set to 5.
    1. Select **OK**.

1. Create the load-balancing rules:
   
    1. Open the load balancer, select **load balancing rules**, and select **Add**.
    1. Enter the name of the new load balancer rule (for example, *hana-lb*).
    1. Select the front-end IP address, the back-end pool, and the health probe that you created earlier (for example, **hana-frontend**, **hana-backend** and **hana-hp**).
    2. Increase idle timeout to 30 minutes
    1. Select **HA Ports**.
    1. Make sure to **enable Floating IP**.
    1. Select **OK**.

   > [!IMPORTANT]
   > Floating IP isn't supported on a NIC secondary IP configuration in load-balancing scenarios. For details, see [Azure Load Balancer limitations](../../load-balancer/load-balancer-multivip-overview.md#limitations). If you need an additional IP address for the VM, deploy a second NIC.    
   
When you're using the standard load balancer, you should be aware of the following limitation. When you place VMs without public IP addresses in the back-end pool of an internal load balancer, there's no outbound internet connectivity. To allow routing to public end points, you need to perform additional configuration. For more information, see [Public endpoint connectivity for Virtual Machines using Azure Standard Load Balancer in SAP high-availability scenarios](./high-availability-guide-standard-load-balancer-outbound-connections.md).  

   > [!IMPORTANT]
   > Don't enable TCP timestamps on Azure VMs placed behind Azure Load Balancer. Enabling TCP timestamps causes the health probes to fail. Set the parameter `net.ipv4.tcp_timestamps` to `0`. For details, see [Load Balancer health probes](../../load-balancer/load-balancer-custom-probe-overview.md) and SAP note [2382421](https://launchpad.support.sap.com/#/notes/2382421).  

### Deploy NFS

There are two options for deploying Azure native NFS for `/hana/shared`. You can deploy NFS volume on [Azure NetApp Files](../../azure-netapp-files/azure-netapp-files-introduction.md) or [NFS share on Azure Files](../../storage/files/files-nfs-protocol.md). Azure files support NFSv4.1 protocol, NFS on Azure NetApp files supports both NFSv4.1 and NFSv3.

The next sections describe the steps to deploy NFS - you'll need to select only *one* of the options.

> [!TIP]
> You chose to deploy `/hana/shared` on [NFS share on Azure Files](../../storage/files/files-nfs-protocol.md) or [NFS volume on Azure NetApp Files](../../azure-netapp-files/azure-netapp-files-introduction.md).  

#### Deploy the Azure NetApp Files infrastructure 

Deploy the Azure NetApp Files volumes for the `/hana/shared` file system. You need a separate `/hana/shared` volume for each HANA system replication site. For more information, see [Set up the Azure NetApp Files infrastructure](./sap-hana-scale-out-standby-netapp-files-rhel.md#set-up-the-azure-netapp-files-infrastructure).

In this example, you use the following Azure NetApp Files volumes: 

* volume **HN1**-shared-s1 (nfs://10.23.1.7/**HN1**-shared-s1)
* volume **HN1**-shared-s2 (nfs://10.23.1.7/**HN1**-shared-s2)

#### Deploy the NFS on Azure Files infrastructure

Deploy Azure Files NFS shares for the `/hana/shared` file system. You'll need a separate `/hana/shared` Azure Files NFS share for each HANA system replication site. For more information, see [How to create an NFS share](../../storage/files/storage-files-how-to-create-nfs-shares.md?tabs=azure-portal).

In this example, the following Azure Files NFS shares were used:

* share **hn1**-shared-s1 (sapnfsafs.file.core.windows.net:/sapnfsafs/hn1-shared-s1)
* share **hn1**-shared-s2 (sapnfsafs.file.core.windows.net:/sapnfsafs/hn1-shared-s2)

## Operating system configuration and preparation

The instructions in the next sections are prefixed with one of the following abbreviations:

* **[A]**: 		Applicable to all nodes
* **[AH]**: 	Applicable to all HANA DB nodes
* **[M]**: 		Applicable to the majority maker node
* **[AH1]**:	Applicable to all HANA DB nodes on SITE 1
* **[AH2]**:	Applicable to all HANA DB nodes on SITE 2
* **[1]**: 		Applicable only to HANA DB node 1, SITE 1
* **[2]**: 		Applicable only to HANA DB node 1, SITE 2

Configure and prepare your operating system by doing the following:

1. **[A]** Maintain the host files on the virtual machines. Include entries for all subnets. The following entries are added to `/etc/hosts` for this example.  

    ```bash
     # Client subnet
     10.23.0.11 hana-s1-db1
     10.23.0.12 hana-s1-db1
     10.23.0.13 hana-s1-db2
     10.23.0.14 hana-s2-db1
     10.23.0.15 hana-s2-db2
     10.23.0.16 hana-s2-db3
     10.23.0.17 hana-s-mm
     # Internode subnet
     10.23.1.138 hana-s1-db1-inter
     10.23.1.139 hana-s1-db2-inter
     10.23.1.140 hana-s1-db3-inter
     10.23.1.141 hana-s2-db1-inter
     10.23.1.142 hana-s2-db2-inter
     10.23.1.143 hana-s2-db3-inter
     # HSR subnet
     10.23.1.202 hana-s1-db1-hsr
     10.23.1.203 hana-s1-db2-hsr
     10.23.1.204 hana-s1-db3-hsr
     10.23.1.205 hana-s2-db1-hsr
     10.23.1.206 hana-s2-db2-hsr
     10.23.1.207 hana-s2-db3-hsr
    ```


1. **[A]** Create configuration file */etc/sysctl.d/ms-az.conf* with Microsoft for Azure configuration settings.  

    <pre><code>
    vi /etc/sysctl.d/ms-az.conf
    # Add the following entries in the configuration file
    net.ipv6.conf.all.disable_ipv6 = 1
    net.ipv4.tcp_max_syn_backlog = 16348
    net.ipv4.conf.all.rp_filter = 0
    sunrpc.tcp_slot_table_entries = 128
    vm.swappiness=10
    </code></pre>

    > [!TIP]
    > Avoid setting `net.ipv4.ip_local_port_range` and `net.ipv4.ip_local_reserved_ports` explicitly in the `sysctl` configuration files, to allow the SAP host agent to manage the port ranges. For more details, see SAP note [2382421](https://launchpad.support.sap.com/#/notes/2382421).  


1. **[A]** Install the NFS client package.  

   `yum install nfs-utils`


1. **[AH]** Red Hat for HANA configuration.  

   Configure RHEL, as described in the [Red Hat customer portal](https://access.redhat.com/solutions/2447641) and in the following SAP notes:

   - [2292690 - SAP HANA DB: Recommended OS settings for RHEL 7](https://launchpad.support.sap.com/#/notes/2292690)
   - [2777782 - SAP HANA DB: Recommended OS settings for RHEL 8](https://launchpad.support.sap.com/#/notes/2777782)
   - [2455582 - Linux: Running SAP applications compiled with GCC 6.x](https://launchpad.support.sap.com/#/notes/2455582)
   - [2593824 - Linux: Running SAP applications compiled with GCC 7.x](https://launchpad.support.sap.com/#/notes/2593824) 
   - [2886607 - Linux: Running SAP applications compiled with GCC 9.x](https://launchpad.support.sap.com/#/notes/2886607)

## Prepare the file systems

The following sections provide steps for the preparation of your file systems. You chose to deploy /hana/shared' on [NFS share on Azure Files](../../storage/files/files-nfs-protocol.md) or [NFS volume on Azure NetApp Files](../../azure-netapp-files/azure-netapp-files-introduction.md).

### Mount the shared file systems (Azure NetApp Files NFS)

In this example, the shared HANA file systems are deployed on Azure NetApp Files and mounted over NFSv4.1. Follow the steps in this section, only if you're using NFS on Azure NetApp Files.  

1. **[AH]** Prepare the OS for running SAP HANA on NetApp Systems with NFS, as described in SAP note [3024346 - Linux Kernel Settings for NetApp NFS](https://launchpad.support.sap.com/#/notes/3024346). Create configuration file */etc/sysctl.d/91-NetApp-HANA.conf* for the NetApp configuration settings.  

    ```bash
    vi /etc/sysctl.d/91-NetApp-HANA.conf
     
    # Add the following entries in the configuration file
    net.core.rmem_max = 16777216
    net.core.wmem_max = 16777216
    net.ipv4.tcp_rmem = 4096 131072 16777216
    net.ipv4.tcp_wmem = 4096 16384 16777216
    net.core.netdev_max_backlog = 300000
    net.ipv4.tcp_slow_start_after_idle=0
    net.ipv4.tcp_no_metrics_save = 1
    net.ipv4.tcp_moderate_rcvbuf = 1
    net.ipv4.tcp_window_scaling = 1
    net.ipv4.tcp_sack = 1
    ```

2. **[AH]** Adjust the sunrpc settings, as recommended in SAP note [3024346 - Linux Kernel Settings for NetApp NFS](https://launchpad.support.sap.com/#/notes/3024346).  

    ```bash
    vi /etc/modprobe.d/sunrpc.conf
     
    # Insert the following line
    options sunrpc tcp_max_slot_table_entries=128
    ```

1. **[AH]** Create mount points for the HANA database volumes.

    ```bash
    mkdir -p /hana/shared
    ```

1. **[AH]** Verify the NFS domain setting. Make sure that the domain is configured as the default Azure NetApp Files domain: `defaultv4iddomain.com`. Make sure the mapping is set to `nobody`.  
   (This step is only needed if you're using Azure NetAppFiles NFS v4.1.)  

    > [!IMPORTANT]
    > Make sure to set the NFS domain in `/etc/idmapd.conf` on the VM to match the default domain configuration on Azure NetApp Files: `defaultv4iddomain.com`. If there's a mismatch between the domain configuration on the NFS client and the NFS server, the permissions for files on Azure NetApp volumes that are mounted on the VMs will be displayed as `nobody`.  

    ```bash
    sudo cat /etc/idmapd.conf
    # Example
    [General]
    Domain = defaultv4iddomain.com
    [Mapping]
    Nobody-User = nobody
    Nobody-Group = nobody
    ```

1. **[AH]** Verify `nfs4_disable_idmapping`. It should be set to `Y`. To create the directory structure where `nfs4_disable_idmapping` is located, run the mount command. You won't be able to manually create the directory under */sys/modules*, because access is reserved for the kernel or drivers.  
   This step is only needed, if using Azure NetAppFiles NFSv4.1.  

    ```bash
    # Check nfs4_disable_idmapping 
    cat /sys/module/nfs/parameters/nfs4_disable_idmapping
    # If you need to set nfs4_disable_idmapping to Y
    mkdir /mnt/tmp
    mount 10.9.0.4:/HN1-shared /mnt/tmp
    umount  /mnt/tmp
    echo "Y" > /sys/module/nfs/parameters/nfs4_disable_idmapping
    # Make the configuration permanent
    echo "options nfs nfs4_disable_idmapping=Y" >> /etc/modprobe.d/nfs.conf
    ```

   For more information on how to change the `nfs4_disable_idmapping` parameter, see the [Red Hat customer portal](https://access.redhat.com/solutions/1749883).

1. **[AH1]** Mount the shared Azure NetApp Files volumes on the SITE1 HANA DB VMs.  

    ```bash
    sudo mount -o rw,nfsvers=4.1,hard,timeo=600,rsize=262144,wsize=262144,noatime,lock,_netdev,sec=sys 10.23.1.7:/HN1-shared-s1 /hana/shared
    ```

1. **[AH2]** Mount the shared Azure NetApp Files volumes on the SITE2 HANA DB VMs.  

    ```bash
    sudo mount -o rw,nfsvers=4.1,hard,timeo=600,rsize=262144,wsize=262144,noatime,lock,_netdev,sec=sys 10.23.1.7:/HN1-shared-s2 /hana/shared
    ```


1. **[AH]** Verify that the corresponding `/hana/shared/` file systems are mounted on all HANA DB VMs, with NFS protocol version **NFSv4**.  

    ```bash
    sudo nfsstat -m
    # Verify that flag vers is set to 4.1 
    # Example from SITE 1, hana-s1-db1
    /hana/shared from 10.23.1.7:/HN1-shared-s1
     Flags: rw,noatime,vers=4.1,rsize=262144,wsize=262144,namlen=255,hard,proto=tcp,timeo=600,retrans=2,sec=sys,clientaddr=10.23.0.11,local_lock=none,addr=10.23.1.7
    # Example from SITE 2, hana-s2-db1
    /hana/shared from 10.23.1.7:/HN1-shared-s2
     Flags: rw,noatime,vers=4.1,rsize=262144,wsize=262144,namlen=255,hard,proto=tcp,timeo=600,retrans=2,sec=sys,clientaddr=10.23.0.14,local_lock=none,addr=10.23.1.7
    ```

### Mount the shared file systems (Azure Files NFS)

In this example, the shared HANA file systems are deployed on NFS on Azure Files. Follow the steps in this section, only if you're using NFS on Azure Files.  

1. **[AH]** Create mount points for the HANA database volumes.  

    ```bash
    mkdir -p /hana/shared
    ```

2. **[AH1]** Mount the shared Azure NetApp Files volumes on the SITE1 HANA DB VMs.  

    ```bash
    sudo vi /etc/fstab
    # Add the following entry
    sapnfsafs.file.core.windows.net:/sapnfsafs/hn1-shared-s1 /hana/shared  nfs nfsvers=4.1,sec=sys  0  0
    # Mount all volumes
    sudo mount -a 
    ```

3. **[AH2]** Mount the shared Azure NetApp Files volumes on the SITE2 HANA DB VMs.  

    ```bash
    sudo vi /etc/fstab
    # Add the following entries
    sapnfsafs.file.core.windows.net:/sapnfsafs/hn1-shared-s2 /hana/shared  nfs nfsvers=4.1,sec=sys  0  0
    # Mount the volume
    sudo mount -a 
    ```

4. **[AH]** Verify that the corresponding `/hana/shared/` file systems are mounted on all HANA DB VMs with NFS protocol version **NFSv4.1**.  

    ```bash
    sudo nfsstat -m
    # Example from SITE 1, hana-s1-db1
    sapnfsafs.file.core.windows.net:/sapnfsafs/hn1-shared-s1
     Flags: rw,relatime,vers=4.1,rsize=1048576,wsize=1048576,namlen=255,hard,proto=tcp,timeo=600,retrans=2,sec=sys,clientaddr=10.23.0.19,local_lock=none,addr=10.23.0.35
    # Example from SITE 2, hana-s2-db1
    sapnfsafs.file.core.windows.net:/sapnfsafs/hn1-shared-s2
     Flags: rw,relatime,vers=4.1,rsize=1048576,wsize=1048576,namlen=255,hard,proto=tcp,timeo=600,retrans=2,sec=sys,clientaddr=10.23.0.22,local_lock=none,addr=10.23.0.35
    ```

### Prepare the data and log local file systems

In the presented configuration, you deploy file systems `/hana/data` and `/hana/log` on a managed disk, and you attach these file systems locally to each HANA DB VM. Run the following steps to create the local data and log volumes on each HANA DB virtual machine. 

Set up the disk layout with **Logical Volume Manager (LVM)**. The following example assumes that each HANA virtual machine has three data disks attached, and that these disks are used to create two volumes.

1. **[AH]** List all of the available disks:
    ```bash
    ls /dev/disk/azure/scsi1/lun*
    ```

   Example output:

    ```bash
    /dev/disk/azure/scsi1/lun0  /dev/disk/azure/scsi1/lun1  /dev/disk/azure/scsi1/lun2 
    ```

1. **[AH]** Create physical volumes for all of the disks that you want to use:
    ```bash
    sudo pvcreate /dev/disk/azure/scsi1/lun0
    sudo pvcreate /dev/disk/azure/scsi1/lun1
    sudo pvcreate /dev/disk/azure/scsi1/lun2
    ```

1. **[AH]** Create a volume group for the data files. Use one volume group for the log files and one for the shared directory of SAP HANA:
    ```bash
    sudo vgcreate vg_hana_data_HN1 /dev/disk/azure/scsi1/lun0 /dev/disk/azure/scsi1/lun1
    sudo vgcreate vg_hana_log_HN1 /dev/disk/azure/scsi1/lun2
    ```

1. **[AH]** Create the logical volumes. A *linear* volume is created when you use `lvcreate` without the `-i` switch. We suggest that you create a *striped* volume for better I/O performance. Align the stripe sizes to the values documented in [SAP HANA VM storage configurations](./hana-vm-operations-storage.md). The `-i` argument should be the number of the underlying physical volumes and the `-I` argument is the stripe size. In this article, two physical volumes are used for the data volume, so the `-i` switch argument is set to `2`. The stripe size for the data volume is `256 KiB`. One physical volume is used for the log volume, so you don't need to use explicit `-i` or `-I` switches for the log volume commands.  

   > [!IMPORTANT]
   > Use the `-i` switch, and set it to the number of the underlying physical volume, when you use more than one physical volume for each data or log volume. Use the `-I` switch to specify the stripe size when you're creating a striped volume. See [SAP HANA VM storage configurations](./hana-vm-operations-storage.md) for recommended storage configurations, including stripe sizes and number of disks.  

    ```bash
    sudo lvcreate -i 2 -I 256 -l 100%FREE -n hana_data vg_hana_data_HN1
    sudo lvcreate -l 100%FREE -n hana_log vg_hana_log_HN1
    sudo mkfs.xfs /dev/vg_hana_data_HN1/hana_data
    sudo mkfs.xfs /dev/vg_hana_log_HN1/hana_log
    ```

1. **[AH]** Create the mount directories and copy the UUID of all of the logical volumes:
    ```bash
    sudo mkdir -p /hana/data/HN1
    sudo mkdir -p /hana/log/HN1
    # Write down the ID of /dev/vg_hana_data_HN1/hana_data and /dev/vg_hana_log_HN1/hana_log
    sudo blkid
    ```

1. **[AH]** Create `fstab` entries for the logical volumes and mount:
    ```bash
    sudo vi /etc/fstab
    ```

   Insert the following line in the `/etc/fstab` file:

    ```bash
    /dev/disk/by-uuid/UUID of /dev/mapper/vg_hana_data_HN1-hana_data /hana/data/HN1 xfs  defaults,nofail  0  2
    /dev/disk/by-uuid/UUID of /dev/mapper/vg_hana_log_HN1-hana_log /hana/log/HN1 xfs  defaults,nofail  0  2
    ```

   Mount the new volumes:

    ```bash
    sudo mount -a
    ```

## Installation  

In this example for deploying SAP HANA in a scale-out configuration with HSR on Azure VMs, you're using HANA 2.0 SP4.  

### Prepare for HANA installation

1. **[AH]** Before the HANA installation, set the root password. You can disable the root password after the installation has been completed. Run as `root` command `passwd` to set the password.  

1. **[1,2]** Change the permissions on `/hana/shared`. 
    ```bash
    chmod 775 /hana/shared
    ```

1. **[1]** Verify that you can sign in **hana-s1-db2** and **hana-s1-db3** via secure shell (SSH), without being prompted for a password. If that isn't the case, exchange `ssh` keys, as documented in [Using key-based authentication](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/6/html/deployment_guide/s2-ssh-configuration-keypairs).  
    ```bash
    ssh root@hana-s1-db2
    ssh root@hana-s1-db3
    ```

1. **[2]** Verify that you can sign in **hana-s2-db2** and **hana-s2-db3** via SSH, without being prompted for a password. If that isn't the case, exchange `ssh` keys, as documented in [Using key-based authentication](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/6/html/deployment_guide/s2-ssh-configuration-keypairs).  
    ```bash
    ssh root@hana-s2-db2
    ssh root@hana-s2-db3
    ```

1. **[AH]** Install additional packages, which are required for HANA 2.0 SP4. For more information, see SAP Note [2593824](https://launchpad.support.sap.com/#/notes/2593824) for RHEL 7. 

    ```bash
    # If using RHEL 7
    yum install libgcc_s1 libstdc++6 compat-sap-c++-7 libatomic1
    # If using RHEL 8
    yum install libatomic libtool-ltdl.x86_64
    ```


1. **[A]** Disable the firewall temporarily, so that it doesn't interfere with the HANA installation. You can re-enable it after the HANA installation is done. 
    ```bash
    # Execute as root
    systemctl stop firewalld
    systemctl disable firewalld
    ```

### HANA installation on the first node on each site

1. **[1]** Install SAP HANA by following the instructions in the [SAP HANA 2.0 installation and update guide](https://help.sap.com/viewer/2c1988d620e04368aa4103bf26f17727/2.0.04/en-US/7eb0167eb35e4e2885415205b8383584.html). The following instructions show the SAP HANA installation on the first node on SITE 1.   

   1. Start the `hdblcm` program as `root` from the HANA installation software directory. Use the `internal_network` parameter and pass the address space for subnet, which is used for the internal HANA internode communication.  

      ```bash
      ./hdblcm --internal_network=10.23.1.128/26
      ```
   1. At the prompt, enter the following values:

     * For **Choose an action**, enter **1** (for install).
     * For **Additional components for installation**, enter **2, 3**.
     * For the installation path, press Enter (defaults to */hana/shared*).
     * For **Local Host Name**, press Enter to accept the default.
     * For **Do you want to add hosts to the system?**, enter **n**.
     * For **SAP HANA System ID**, enter **HN1**.
     * For **Instance number** [00], enter **03**.
     * For **Local Host Worker Group** [default], press Enter to accept the default.
     * For **Select System Usage / Enter index [4]**, enter **4** (for custom).
     * For **Location of Data Volumes** [/hana/data/HN1], press Enter to accept the default.
     * For **Location of Log Volumes** [/hana/log/HN1], press Enter to accept the default.
     * For **Restrict maximum memory allocation?** [n], enter **n**.
     * For **Certificate Host Name For Host hana-s1-db1** [hana-s1-db1], press Enter to accept the default.
     * For **SAP Host Agent User (sapadm) Password**, enter the password.
     * For **Confirm SAP Host Agent User (sapadm) Password**, enter the password.
     * For **System Administrator (hn1adm) Password**, enter the password.
     * For **System Administrator Home Directory** [/usr/sap/HN1/home], press Enter to accept the default.
	 * For **System Administrator Login Shell** [/bin/sh], press Enter to accept the default.
	 * For **System Administrator User ID** [1001], press Enter to accept the default.
	 * For **Enter ID of User Group (sapsys)** [79], press Enter to accept the default.
     * For **System Database User (system) Password**, enter the system's password.
     * For **Confirm System Database User (system) Password**, enter system's password.
     * For **Restart system after machine reboot?** [n], enter **n**. 
     * For **Do you want to continue (y/n)**, validate the summary and if everything looks good, enter **y**.

1. **[2]** Repeat the preceding step to install SAP HANA on the first node on SITE 2.   

1. **[1,2]** Verify *global.ini*.  

   Display *global.ini*, and ensure that the configuration for the internal SAP HANA internode communication is in place. Verify the `communication` section. It should have the address space for the `inter` subnet, and `listeninterface` should be set to `.internal`. Verify the `internal_hostname_resolution` section. It should have the IP addresses for the HANA virtual machines that belong to the `inter` subnet.  

   ```bash
     sudo cat /usr/sap/HN1/SYS/global/hdb/custom/config/global.ini
     # Example from SITE1 
     [communication]
     internal_network = 10.23.1.128/26
     listeninterface = .internal
     [internal_hostname_resolution]
     10.23.1.138 = hana-s1-db1
     10.23.1.139 = hana-s1-db2
     10.23.1.140 = hana-s1-db3
   ```

1. **[1,2]** Prepare *global.ini* for installation in non-shared environment, as described in SAP note [2080991](https://launchpad.support.sap.com/#/notes/0002080991).  

   ```bash
    sudo vi /usr/sap/HN1/SYS/global/hdb/custom/config/global.ini
    [persistence]
    basepath_shared = no
   ```

1. **[1,2]** Restart SAP HANA to activate the changes.  

   ```bash
    sudo -u hn1adm /usr/sap/hostctrl/exe/sapcontrol -nr 03 -function StopSystem
    sudo -u hn1adm /usr/sap/hostctrl/exe/sapcontrol -nr 03 -function StartSystem
   ```

1. **[1,2]** Verify that the client interface uses the IP addresses from the `client` subnet for communication.  

    ```bash
    # Execute as hn1adm
    /usr/sap/HN1/HDB03/exe/hdbsql -u SYSTEM -p "password" -i 03 -d SYSTEMDB 'select * from SYS.M_HOST_INFORMATION'|grep net_publicname
    # Expected result - example from SITE 2
    "hana-s2-db1","net_publicname","10.23.0.14"
   ```

   For information about how to verify the configuration, see SAP note [2183363 - Configuration of SAP HANA internal network](https://launchpad.support.sap.com/#/notes/2183363).  

1. **[AH]** Change permissions on the data and log directories to avoid a HANA installation error.  

   ```bash
    sudo chmod o+w -R /hana/data /hana/log
   ```

1. **[1]** Install the secondary HANA nodes. The example instructions in this step are for SITE 1.  
   1. Start the resident `hdblcm` program as `root`.    
      ```bash
       cd /hana/shared/HN1/hdblcm
       ./hdblcm 
      ```

   1. At the prompt, enter the following values:

     * For **Choose an action**, enter **2** (for add hosts).
     * For **Enter comma separated host names to add**, enter hana-s1-db2, hana-s1-db3.
     * For **Additional components for installation**, enter **2, 3**.
     * For **Enter Root User Name [root]**, press Enter to accept the default.
     * For **Select roles for host 'hana-s1-db2' [1]**, select 1 (for worker).
     * For **Enter Host Failover Group for host 'hana-s1-db2' [default]**, press Enter to accept the default.
     * For **Enter Storage Partition Number for host 'hana-s1-db2' [\<\<assign automatically\>\>]**, press Enter to accept the default.
     * For **Enter Worker Group for host 'hana-s1-db2' [default]**, press Enter to accept the default.
     * For **Select roles for host 'hana-s1-db3' [1]**, select 1 (for worker).
     * For **Enter Host Failover Group for host 'hana-s1-db3' [default]**, press Enter to accept the default.
     * For **Enter Storage Partition Number for host 'hana-s1-db3' [\<\<assign automatically\>\>]**, press Enter to accept the default.
     * For **Enter Worker Group for host 'hana-s1-db3' [default]**, press Enter to accept the default.
     * For **System Administrator (hn1adm) Password**, enter the password.
     * For **Enter SAP Host Agent User (sapadm) Password**, enter the password.
     * For **Confirm SAP Host Agent User (sapadm) Password**, enter the password.
     * For **Certificate Host Name For Host hana-s1-db2** [hana-s1-db2], press Enter to accept the default.
     * For **Certificate Host Name For Host hana-s1-db3** [hana-s1-db3], press Enter to accept the default.
     * For **Do you want to continue (y/n)**, validate the summary and if everything looks good, enter **y**.

1. **[2]** Repeat the preceding step to install the secondary SAP HANA nodes on SITE 2.   

## Configure SAP HANA 2.0 system replication

The following steps get you set up for system replication:

1. **[1]** Configure system replication on SITE 1:

   Back up the databases as **hn1**adm:

    ```bash
    hdbsql -d SYSTEMDB -u SYSTEM -p "passwd" -i 03 "BACKUP DATA USING FILE ('initialbackupSYS')"
    hdbsql -d HN1 -u SYSTEM -p "passwd" -i 03 "BACKUP DATA USING FILE ('initialbackupHN1')"
    ```

   Copy the system PKI files to the secondary site:

    ```bash
    scp /usr/sap/HN1/SYS/global/security/rsecssfs/data/SSFS_HN1.DAT hana-s2-db1:/usr/sap/HN1/SYS/global/security/rsecssfs/data/
    scp /usr/sap/HN1/SYS/global/security/rsecssfs/key/SSFS_HN1.KEY  hana-s2-db1:/usr/sap/HN1/SYS/global/security/rsecssfs/key/
    ```

   Create the primary site:

    ```bash
    hdbnsutil -sr_enable --name=HANA_S1
    ```

1. **[2]** Configure system replication on SITE 2:
    
   Register the second site to start the system replication. Run the following command as <hanasid\>adm:

    ```bash
    sapcontrol -nr 03 -function StopWait 600 10
    hdbnsutil -sr_register --remoteHost=hana-s1-db1 --remoteInstance=03 --replicationMode=sync --name=HANA_S2
    sapcontrol -nr 03 -function StartSystem
    ```

1. **[1]** Check the replication status and wait until all databases are in sync.

    ```bash
    sudo su - hn1adm -c "python /usr/sap/HN1/HDB03/exe/python_support/systemReplicationStatus.py"
   	# | Database | Host          | Port  | Service Name | Volume ID | Site ID | Site Name | Secondary     | Secondary | Secondary | Secondary | Secondary     | Replication | Replication | Replication    |
	# |          |               |       |              |           |         |           | Host          | Port      | Site ID   | Site Name | Active Status | Mode        | Status      | Status Details |
	# | -------- | ------------- | ----- | ------------ | --------- | ------- | --------- | ------------- | --------- | --------- | --------- | ------------- | ----------- | ----------- | -------------- |
	# | HN1      | hana-s1-db3   | 30303 | indexserver  |         5 |       1 | HANA_S1   | hana-s2-db3   |     30303 |         2 | HANA_S2   | YES           | SYNC        | ACTIVE      |                |
	# | SYSTEMDB | hana-s1-db1   | 30301 | nameserver   |         1 |       1 | HANA_S1   | hana-s2-db1   |     30301 |         2 | HANA_S2   | YES           | SYNC        | ACTIVE      |                |
	# | HN1      | hana-s1-db1   | 30307 | xsengine     |         2 |       1 | HANA_S1   | hana-s2-db1   |     30307 |         2 | HANA_S2   | YES           | SYNC        | ACTIVE      |                |
	# | HN1      | hana-s1-db1   | 30303 | indexserver  |         3 |       1 | HANA_S1   | hana-s2-db1   |     30303 |         2 | HANA_S2   | YES           | SYNC        | ACTIVE      |                |
	# | HN1      | hana-s1-db2   | 30303 | indexserver  |         4 |       1 | HANA_S1   | hana-s2-db2   |     30303 |         2 | HANA_S2   | YES           | SYNC        | ACTIVE      |                |
	#
	# status system replication site "2": ACTIVE
	# overall system replication status: ACTIVE
	#
	# Local System Replication State
	#	
	# mode: PRIMARY
	# site id: 1
	# site name: HANA_S1
    ```

1. **[1,2]** Change the HANA configuration so that communication for HANA system replication is directed though the HANA system replication virtual network interfaces.   
   1. Stop HANA on both sites.
      ```bash
      sudo -u hn1adm /usr/sap/hostctrl/exe/sapcontrol -nr 03 -function StopSystem HDB
      ```

   1. Edit *global.ini* to add the host mapping for HANA system replication. Use the IP addresses from the `hsr` subnet.  
      ```bash
      sudo vi /usr/sap/HN1/SYS/global/hdb/custom/config/global.ini
      #Add the section
      [system_replication_hostname_resolution]
      10.23.1.202 = hana-s1-db1
      10.23.1.203 = hana-s1-db2
      10.23.1.204 = hana-s1-db3
      10.23.1.205 = hana-s2-db1
      10.23.1.206 = hana-s2-db2
      10.23.1.207 = hana-s2-db3
      ```

   1. Start HANA on both sites.
     ```bash
      sudo -u hn1adm /usr/sap/hostctrl/exe/sapcontrol -nr 03 -function StartSystem HDB
     ```

   For more information, see [Host name resolution for system replication](https://help.sap.com/viewer/eb3777d5495d46c5b2fa773206bbfb46/1.0.12/en-US/c0cba1cb2ba34ec89f45b48b2157ec7b.html).  

1. **[AH]** Re-enable the firewall and open the necessary ports.  
   1. Re-enable the firewall.
       ```bash
       # Execute as root
       systemctl start firewalld
       systemctl enable firewalld
       ```

   1. Open the necessary firewall ports. You will need to adjust the ports for your HANA instance number.  

       > [!IMPORTANT]
       > Create firewall rules to allow HANA internode communication and client traffic. The required ports are listed on [TCP/IP ports of all SAP products](https://help.sap.com/viewer/ports). The following commands are just an example. In this scenario, you use system number 03.

       ```bash
        # Execute as root
        sudo firewall-cmd --zone=public --add-port=30301/tcp --permanent
        sudo firewall-cmd --zone=public --add-port=30301/tcp
        sudo firewall-cmd --zone=public --add-port=30303/tcp --permanent
        sudo firewall-cmd --zone=public --add-port=30303/tcp
        sudo firewall-cmd --zone=public --add-port=30306/tcp --permanent
        sudo firewall-cmd --zone=public --add-port=30306/tcp
        sudo firewall-cmd --zone=public --add-port=30307/tcp --permanent
        sudo firewall-cmd --zone=public --add-port=30307/tcp
        sudo firewall-cmd --zone=public --add-port=30313/tcp --permanent
        sudo firewall-cmd --zone=public --add-port=30313/tcp
        sudo firewall-cmd --zone=public --add-port=30315/tcp --permanent
        sudo firewall-cmd --zone=public --add-port=30315/tcp
        sudo firewall-cmd --zone=public --add-port=30317/tcp --permanent
        sudo firewall-cmd --zone=public --add-port=30317/tcp
        sudo firewall-cmd --zone=public --add-port=30340/tcp --permanent
        sudo firewall-cmd --zone=public --add-port=30340/tcp
        sudo firewall-cmd --zone=public --add-port=30341/tcp --permanent
        sudo firewall-cmd --zone=public --add-port=30341/tcp
        sudo firewall-cmd --zone=public --add-port=30342/tcp --permanent
        sudo firewall-cmd --zone=public --add-port=30342/tcp
        sudo firewall-cmd --zone=public --add-port=1128/tcp --permanent
        sudo firewall-cmd --zone=public --add-port=1128/tcp
        sudo firewall-cmd --zone=public --add-port=1129/tcp --permanent
        sudo firewall-cmd --zone=public --add-port=1129/tcp
        sudo firewall-cmd --zone=public --add-port=40302/tcp --permanent
        sudo firewall-cmd --zone=public --add-port=40302/tcp
        sudo firewall-cmd --zone=public --add-port=40301/tcp --permanent
        sudo firewall-cmd --zone=public --add-port=40301/tcp
        sudo firewall-cmd --zone=public --add-port=40307/tcp --permanent
        sudo firewall-cmd --zone=public --add-port=40307/tcp
        sudo firewall-cmd --zone=public --add-port=40303/tcp --permanent
        sudo firewall-cmd --zone=public --add-port=40303/tcp
        sudo firewall-cmd --zone=public --add-port=40340/tcp --permanent
        sudo firewall-cmd --zone=public --add-port=40340/tcp
        sudo firewall-cmd --zone=public --add-port=50313/tcp --permanent
        sudo firewall-cmd --zone=public --add-port=50313/tcp
        sudo firewall-cmd --zone=public --add-port=50314/tcp --permanent
        sudo firewall-cmd --zone=public --add-port=50314/tcp
        sudo firewall-cmd --zone=public --add-port=30310/tcp --permanent
        sudo firewall-cmd --zone=public --add-port=30310/tcp
        sudo firewall-cmd --zone=public --add-port=30302/tcp --permanent
        sudo firewall-cmd --zone=public --add-port=30302/tcp
       ```

## Create a Pacemaker cluster

To create a basic Pacemaker cluster, follow the steps in [Setting up Pacemaker on Red Hat Enterprise Linux in Azure](high-availability-guide-rhel-pacemaker.md). Include all virtual machines, including the majority maker in the cluster.  

> [!IMPORTANT]
> Don't set `quorum expected-votes` to 2. This isn't a two-node cluster. Make sure that the cluster property `concurrent-fencing` is enabled, so that node fencing is deserialized.   

## Create file system resources

For the next part of this process, you need to create file system resources. Here's how:

1. **[1,2]** Stop SAP HANA on both replication sites. Run as <sid\>adm.  

    ```bash
    sapcontrol -nr 03 -function StopSystem
    ```

1. **[AH]** Unmount file system `/hana/shared`, which was temporarily mounted for the installation on all HANA DB VMs. Before you can unmount it, you need to stop any processes and sessions that are using the file system. 
 
    ```bash
    umount /hana/shared 
    ```

1. **[1]** Create the file system cluster resources for `/hana/shared` in the disabled state. You use `--disabled` because you have to define the location constraints before the mounts are enabled.  
You chose to deploy /hana/shared' on [NFS share on Azure Files](../../storage/files/files-nfs-protocol.md) or [NFS volume on Azure NetApp Files](../../azure-netapp-files/azure-netapp-files-introduction.md).   

   - In this example, the '/hana/shared' file system is deployed on Azure NetApp Files and mounted over NFSv4.1. Follow the steps in this section, only if you're using NFS on Azure NetApp Files.

       ```bash
       # /hana/shared file system for site 1
       pcs resource create fs_hana_shared_s1 --disabled ocf:heartbeat:Filesystem device=10.23.1.7:/HN1-shared-s1  directory=/hana/shared \
       fstype=nfs options='defaults,rw,hard,timeo=600,rsize=262144,wsize=262144,proto=tcp,noatime,sec=sys,nfsvers=4.1,lock,_netdev' op monitor interval=20s on-fail=fence timeout=120s OCF_CHECK_LEVEL=20 \
       op start interval=0 timeout=120 op stop interval=0 timeout=120

       # /hana/shared file system for site 2	
       pcs resource create fs_hana_shared_s2 --disabled ocf:heartbeat:Filesystem device=10.23.1.7:/HN1-shared-s1 directory=/hana/shared \
       fstype=nfs options='defaults,rw,hard,timeo=600,rsize=262144,wsize=262144,proto=tcp,noatime,sec=sys,nfsvers=4.1,lock,_netdev' op monitor interval=20s on-fail=fence timeout=120s OCF_CHECK_LEVEL=20 \
       op start interval=0 timeout=120 op stop interval=0 timeout=120

    	# clone the /hana/shared file system resources for both site1 and site2
        pcs resource clone fs_hana_shared_s1 meta clone-node-max=1 interleave=true
        pcs resource clone fs_hana_shared_s2 meta clone-node-max=1 interleave=true
        ```
 
   The suggested timeouts values allow the cluster resources to withstand protocol-specific pause, related to NFSv4.1 lease renewals on Azure NetApp Files. For more information see [NFS in NetApp Best practice](https://www.netapp.com/media/10720-tr-4067.pdf).

   - In this example, the '/hana/shared' file system is deployed on NFS on Azure Files. Follow the steps in this section, only if you're using NFS on Azure Files.  

        ```bash
        # /hana/shared file system for site 1
        pcs resource create fs_hana_shared_s1 --disabled ocf:heartbeat:Filesystem device=sapnfsafs.file.core.windows.net:/sapnfsafs/hn1-shared-s1  directory=/hana/shared \
        fstype=nfs options='defaults,rw,hard,proto=tcp,noatime,nfsvers=4.1,lock' op monitor interval=20s on-fail=fence timeout=120s OCF_CHECK_LEVEL=20 \
        op start interval=0 timeout=120 op stop interval=0 timeout=120
    
        # /hana/shared file system for site 2	
        pcs resource create fs_hana_shared_s2 --disabled ocf:heartbeat:Filesystem device=sapnfsafs.file.core.windows.net:/sapnfsafs/hn1-shared-s2 directory=/hana/shared \
        fstype=nfs options='defaults,rw,hard,proto=tcp,noatime,nfsvers=4.1,lock' op monitor interval=20s on-fail=fence timeout=120s OCF_CHECK_LEVEL=20 \
        op start interval=0 timeout=120 op stop interval=0 timeout=120

    	# clone the /hana/shared file system resources for both site1 and site2
        pcs resource clone fs_hana_shared_s1 meta clone-node-max=1 interleave=true
        pcs resource clone fs_hana_shared_s2 meta clone-node-max=1 interleave=true
        ```

   The `OCF_CHECK_LEVEL=20` attribute is added to the monitor operation, so that monitor operations perform a read/write test on the file system. Without this attribute, the monitor operation only verifies that the file system is mounted. This can be a problem because when connectivity is lost, the file system might remain mounted, despite being inaccessible.  

   The `on-fail=fence` attribute is also added to the monitor operation. With this option, if the monitor operation fails on a node, that node is immediately fenced. Without this option, the default behavior is to stop all resources that depend on the failed resource, then restart the failed resource, and then start all the resources that depend on the failed resource. Not only can this behavior take a long time when an SAP HANA resource depends on the failed resource, but it also can fail altogether. The SAP HANA resource can't stop successfully, if the NFS share holding the HANA binaries is inaccessible.

   The timeouts in the above configurations may need to be adapted to the specific SAP setup.  
  

1. **[1]** Configure and verify the node attributes. All SAP HANA DB nodes on replication site 1 are assigned attribute `S1`, and all SAP HANA DB nodes on replication site 2 are assigned attribute `S2`.  

    ```bash
    # HANA replication site 1
    pcs node attribute hana-s1-db1 NFS_SID_SITE=S1
    pcs node attribute hana-s1-db2 NFS_SID_SITE=S1
    pcs node attribute hana-s1-db3 NFS_SID_SITE=S1
	# HANA replication site 2
    pcs node attribute hana-s2-db1 NFS_SID_SITE=S2
    pcs node attribute hana-s2-db2 NFS_SID_SITE=S2
    pcs node attribute hana-s2-db3 NFS_SID_SITE=S2
	#To verify the attribute assignment to nodes execute
    pcs node attribute
    ```

1. **[1]** Configure the constraints that determine where the NFS file systems will be mounted, and enable the file system resources.  
    ```bash
    # Configure the constraints
    pcs constraint location fs_hana_shared_s1-clone rule resource-discovery=never score=-INFINITY NFS_SID_SITE ne S1
    pcs constraint location fs_hana_shared_s2-clone rule resource-discovery=never score=-INFINITY NFS_SID_SITE ne S2
    # Enable the file system resources
    pcs resource enable fs_hana_shared_s1
    pcs resource enable fs_hana_shared_s2
    ```

   When you enable the file system resources, the cluster will mount the `/hana/shared` file systems.  
 
1. **[AH]** Verify that the Azure NetApp Files volumes are mounted under `/hana/shared`, on all HANA DB VMs on both sites.

   - Example, if using Azure NetApp Files:
       ```bash
       sudo nfsstat -m
       # Verify that flag vers is set to 4.1 
       # Example from SITE 1, hana-s1-db1
       /hana/shared from 10.23.1.7:/HN1-shared-s1
        Flags: rw,noatime,vers=4.1,rsize=262144,wsize=262144,namlen=255,hard,proto=tcp,timeo=600,retrans=2,sec=sys,clientaddr=10.23.0.11,local_lock=none,addr=10.23.1.7
       # Example from SITE 2, hana-s2-db1
       /hana/shared from 10.23.1.7:/HN1-shared-s2
        Flags: rw,noatime,vers=4.1,rsize=262144,wsize=262144,namlen=255,hard,proto=tcp,timeo=600,retrans=2,sec=sys,clientaddr=10.23.0.14,local_lock=none,addr=10.23.1.7
       ```
   - Example, if using Azure Files NFS: 

       ```bash
       sudo nfsstat -m
       # Example from SITE 1, hana-s1-db1
       sapnfsafs.file.core.windows.net:/sapnfsafs/hn1-shared-s1
        Flags: rw,relatime,vers=4.1,rsize=1048576,wsize=1048576,namlen=255,hard,proto=tcp,timeo=600,retrans=2,sec=sys,clientaddr=10.23.0.19,local_lock=none,addr=10.23.0.35
       # Example from SITE 2, hana-s2-db1
       sapnfsafs.file.core.windows.net:/sapnfsafs/hn1-shared-s2
        Flags: rw,relatime,vers=4.1,rsize=1048576,wsize=1048576,namlen=255,hard,proto=tcp,timeo=600,retrans=2,sec=sys,clientaddr=10.23.0.22,local_lock=none,addr=10.23.0.35
       ```

1. **[1]** Configure and clone the attribute resources, and configure the constraints, as follows:  

    ```bash
    # Configure the attribute resources
    pcs resource create hana_nfs_s1_active ocf:pacemaker:attribute active_value=true inactive_value=false name=hana_nfs_s1_active
    pcs resource create hana_nfs_s2_active ocf:pacemaker:attribute active_value=true inactive_value=false name=hana_nfs_s2_active
	# Clone the attribute resources
    pcs resource clone hana_nfs_s1_active meta clone-node-max=1 interleave=true
    pcs resource clone hana_nfs_s2_active meta clone-node-max=1 interleave=true
	# Configure the constraints, which will set the attribute values
    pcs constraint order fs_hana_shared_s1-clone then hana_nfs_s1_active-clone
    pcs constraint order fs_hana_shared_s2-clone then hana_nfs_s2_active-clone
    ```

   > [!TIP]
   > If your configuration includes file systems other than /`hana/shared`, and these file systems are NFS mounted, then include the `sequential=false` option. This option ensures that there are no ordering dependencies among the file systems. All NFS mounted file systems must start before the corresponding attribute resource, but they don't need to start in any order relative to each other. For more information, see [How do I configure SAP HANA scale-out HSR in a Pacemaker cluster when the HANA file systems are NFS shares](https://access.redhat.com/solutions/5423971).  

1. **[1]** Place Pacemaker in maintenance mode, in preparation for the creation of the HANA cluster resources.  
    ```bash
    pcs property set maintenance-mode=true
    ```

## Create SAP HANA cluster resources

Now you're ready to create the cluster resources:

1. **[A]** Install the HANA scale-out resource agent on all cluster nodes, including the majority maker.    

    ```bash
    yum install -y resource-agents-sap-hana-scaleout 
    ```


   > [!NOTE]
   > For the minimum supported version of package `resource-agents-sap-hana-scaleout` for your operating system release, see [Support policies for RHEL HA clusters - Management of SAP HANA in a cluster](https://access.redhat.com/articles/3397471) .  

1. **[1,2]** Install the HANA system replication hook on one HANA DB node on each system replication site. SAP HANA should still be down.        

   1. Prepare the hook as `root`. 
      ```bash
       mkdir -p /hana/shared/myHooks
       cp /usr/share/SAPHanaSR-ScaleOut/SAPHanaSR.py /hana/shared/myHooks
       chown -R hn1adm:sapsys /hana/shared/myHooks
      ```

   1. Adjust `global.ini`.
      ```bash
      # add to global.ini
      [ha_dr_provider_SAPHanaSR]
      provider = SAPHanaSR
      path = /hana/shared/myHooks
      execution_order = 1
    
      [trace]
      ha_dr_saphanasr = info
      ```

1. **[AH]** The cluster requires sudoers configuration on the cluster node for <sid\>adm. In this example, you achieve this by creating a new file. Run the commands as `root`.    
    ```bash
    sudo visudo -f /etc/sudoers.d/20-saphana
    # Insert the following lines and then save
    Cmnd_Alias SOK = /usr/sbin/crm_attribute -n hana_hn1_glob_srHook -v SOK -t crm_config -s SAPHanaSR
    Cmnd_Alias SFAIL = /usr/sbin/crm_attribute -n hana_hn1_glob_srHook -v SFAIL -t crm_config -s SAPHanaSR
    hn1adm ALL=(ALL) NOPASSWD: SOK, SFAIL
    Defaults!SOK, SFAIL !requiretty
    ```

1. **[1,2]** Start SAP HANA on both replication sites. Run as <sid\>adm.  

    ```bash
    sapcontrol -nr 03 -function StartSystem 
    ```

1. **[1]** Verify the hook installation. Run as <sid\>adm on the active HANA system replication site.   

    ```bash
    cdtrace
     awk '/ha_dr_SAPHanaSR.*crm_attribute/ \
     { printf "%s %s %s %s\n",$2,$3,$5,$16 }' nameserver_*

     # Example entries
	 # 2020-07-21 22:04:32.364379 ha_dr_SAPHanaSR SFAIL
	 # 2020-07-21 22:04:46.905661 ha_dr_SAPHanaSR SFAIL
     # 2020-07-21 22:04:52.092016 ha_dr_SAPHanaSR SFAIL
     # 2020-07-21 22:04:52.782774 ha_dr_SAPHanaSR SFAIL
     # 2020-07-21 22:04:53.117492 ha_dr_SAPHanaSR SFAIL
     # 2020-07-21 22:06:35.599324 ha_dr_SAPHanaSR SOK
    ```

1. **[1]** Create the HANA cluster resources. Run the following commands as `root`.    
   1. Make sure the cluster is already in maintenance mode.  
    
   1. Next, create the HANA topology resource.  
      If you're building a RHEL **7.x** cluster, use the following commands:  
      ```bash
      pcs resource create SAPHanaTopology_HN1_HDB03 SAPHanaTopologyScaleOut \
       SID=HN1 InstanceNumber=03 \
       op start timeout=600 op stop timeout=300 op monitor interval=10 timeout=600

      pcs resource clone SAPHanaTopology_HN1_HDB03 meta clone-node-max=1 interleave=true
      ```

      If you're building a RHEL >= **8.x** cluster, use the following commands:  
      ```bash
      pcs resource create SAPHanaTopology_HN1_HDB03 SAPHanaTopology \
       SID=HN1 InstanceNumber=03 meta clone-node-max=1 interleave=true \
       op methods interval=0s timeout=5 \
       op start timeout=600 op stop timeout=300 op monitor interval=10 timeout=600

      pcs resource clone SAPHanaTopology_HN1_HDB03 meta clone-node-max=1 interleave=true
      ```

   1. Create the HANA instance resource.  
      > [!NOTE]
      > This article contains references to a term that Microsoft no longer uses. When the term is removed from the software, we’ll remove it from this article.  
 
      If you're building a RHEL **7.x** cluster, use the following commands:    
      ```bash
      pcs resource create SAPHana_HN1_HDB03 SAPHanaController \
       SID=HN1 InstanceNumber=03 PREFER_SITE_TAKEOVER=true DUPLICATE_PRIMARY_TIMEOUT=7200 AUTOMATED_REGISTER=false \
       op start interval=0 timeout=3600 op stop interval=0 timeout=3600 op promote interval=0 timeout=3600 \
       op monitor interval=60 role="Master" timeout=700 op monitor interval=61 role="Slave" timeout=700
     
      pcs resource master msl_SAPHana_HN1_HDB03 SAPHana_HN1_HDB03 \
       meta master-max="1" clone-node-max=1 interleave=true
      ```

      If you're building a RHEL >= **8.x** cluster, use the following commands:  
      ```bash
      pcs resource create SAPHana_HN1_HDB03 SAPHanaController \
       SID=HN1 InstanceNumber=03 PREFER_SITE_TAKEOVER=true DUPLICATE_PRIMARY_TIMEOUT=7200 AUTOMATED_REGISTER=false \
       op demote interval=0s timeout=320 op methods interval=0s timeout=5 \
       op start interval=0 timeout=3600 op stop interval=0 timeout=3600 op promote interval=0 timeout=3600 \
       op monitor interval=60 role="Master" timeout=700 op monitor interval=61 role="Slave" timeout=700
     
      pcs resource promotable SAPHana_HN1_HDB03 \
       meta master-max="1" clone-node-max=1 interleave=true
      ```
      > [!IMPORTANT]
      > It's a good idea to set `AUTOMATED_REGISTER` to `false`, while you're performing failover tests, to prevent a failed primary instance to automatically register as secondary. After testing, as a best practice, set `AUTOMATED_REGISTER` to `true`, so that after takeover, system replication can resume automatically. 

   1. Create the virtual IP and associated resources.  
      ```bash
      pcs resource create vip_HN1_03 ocf:heartbeat:IPaddr2 ip=10.23.0.18 op monitor interval="10s" timeout="20s"
      sudo pcs resource create nc_HN1_03 azure-lb port=62503
      sudo pcs resource group add g_ip_HN1_03 nc_HN1_03 vip_HN1_03
      ```

   1. 
   2. Create the cluster constraints.  
      If you're building a RHEL **7.x** cluster, use the following commands:  
      ```bash
      #Start HANA topology, before the HANA instance
      pcs constraint order SAPHanaTopology_HN1_HDB03-clone then msl_SAPHana_HN1_HDB03

      pcs constraint colocation add g_ip_HN1_03 with master msl_SAPHana_HN1_HDB03 4000
      #HANA resources are only allowed to run on a node, if the node's NFS file systems are mounted. The constraint also avoids the majority maker node
      pcs constraint location SAPHanaTopology_HN1_HDB03-clone rule resource-discovery=never score=-INFINITY hana_nfs_s1_active ne true and hana_nfs_s2_active ne true
      ```
 
      If you're building a RHEL >= **8.x** cluster, use the following commands:  
      ```bash
      #Start HANA topology, before the HANA instance
      pcs constraint order SAPHanaTopology_HN1_HDB03-clone then SAPHana_HN1_HDB03-clone

      pcs constraint colocation add g_ip_HN1_03 with master SAPHana_HN1_HDB03-clone 4000
      #HANA resources are only allowed to run on a node, if the node's NFS file systems are mounted. The constraint also avoids the majority maker node
      pcs constraint location SAPHanaTopology_HN1_HDB03-clone rule resource-discovery=never score=-INFINITY hana_nfs_s1_active ne true and hana_nfs_s2_active ne true
      ```

1. **[1]** Place the cluster out of maintenance mode. Make sure that the cluster status is `ok`, and that all of the resources are started.  
    ```bash
    sudo pcs property set maintenance-mode=false
    #If there are failed cluster resources, you may need to run the next command
    pcs resource cleanup
    ```
  
   > [!NOTE]
   > The timeouts in the preceding configuration are just examples, and might need to be adapted to the specific HANA setup. For instance, you might need to increase the start timeout, if it takes longer to start the SAP HANA database.
  
## Configure HANA active/read-enabled system replication

Starting with SAP HANA 2.0 SPS 01, SAP allows active/read-enabled setups for SAP HANA system replication. With this capability, you can use the secondary systems of SAP HANA system replication actively for read-intensive workloads. To support such a setup in a cluster, you need a second virtual IP address, which allows clients to access the secondary read-enabled SAP HANA database. To ensure that the secondary replication site can still be accessed after a takeover has occurred, the cluster needs to move the virtual IP address around with the secondary of the SAP HANA resource.

This section describes the additional steps you must take to manage this type of system replication in a Red Hat high availability cluster, with a second virtual IP address.  

Before proceeding further, make sure you have fully configured a Red Hat high availability cluster, managing an SAP HANA database, as described earlier in this article.  

![SAP HANA scale-out high availability with read-enabled secondary](./media/sap-hana-high-availability-rhel/sap-hana-high-avalability-scale-out-hsr-rhel-read-enabled.png)

### Additional setup in Azure Load Balancer for active/read-enabled setup

To proceed with provisioning your second virtual IP, make sure you have configured Azure Load Balancer as described in [Deploy Azure Load Balancer](#deploy-azure-load-balancer).

For the *standard* load balancer, follow these additional steps on the same load balancer that you created in the earlier section.

1. Create a second front-end IP pool: 

   1. Open the load balancer, select **frontend IP pool**, and select **Add**.
   1. Enter the name of the second front-end IP pool (for example, *hana-secondaryIP*).
   1. Set the **Assignment** to **Static**, and enter the IP address (for example, **10.23.0.19**).
   1. Select **OK**.
   1. After the new front-end IP pool is created, note the pool IP address.

1. Next, create a health probe:

   1. Open the load balancer, select **health probes**, and select **Add**.
   1. Enter the name of the new health probe (for example, *hana-secondaryhp*).
   1. Select **TCP** as the protocol and port **62603**. Keep the **Interval** value set to 5, and the **Unhealthy threshold** value set to 2.
   1. Select **OK**.

1. Next, create the load-balancing rules:

   1. Open the load balancer, select **load balancing rules**, and select **Add**.
   1. Enter the name of the new load balancer rule (for example, *hana-secondarylb*).
   1. Select the front-end IP address, the back-end pool, and the health probe that you created earlier (for example, **hana-secondaryIP**, **hana-backend**, and **hana-secondaryhp**).
   1. Select **HA Ports**.
   1. Make sure to **enable Floating IP**.
   1. Select **OK**.

### Configure HANA active/read-enabled system replication

The steps to configure HANA system replication are described in the [Configure SAP HANA 2.0 system replication](#configure-sap-hana-20-system-replication) section. If you are deploying a read-enabled secondary scenario, while you're configuring system replication on the second node, run following command as **hanasid**adm:

```
sapcontrol -nr 03 -function StopWait 600 10 

hdbnsutil -sr_register --remoteHost=hana-s1-db1 --remoteInstance=03 --replicationMode=sync --name=HANA_S2 --operationMode=logreplay_readaccess 
```

### Add a secondary virtual IP address resource for an active/read-enabled setup

You can configure the second virtual IP and the additional constraints with the following commands. If the secondary instance is down, the secondary virtual IP will be switched to the primary.   

```
pcs property set maintenance-mode=true

pcs resource create secvip_HN1_03 ocf:heartbeat:IPaddr2 ip="10.23.0.19"
pcs resource create secnc_HN1_03 ocf:heartbeat:azure-lb port=62603
pcs resource group add g_secip_HN1_03 secnc_HN1_03 secvip_HN1_03

# RHEL 8.x: 
pcs constraint location g_ip_HN1_03 rule score=500 role=master hana_hn1_roles eq "master1:master:worker:master" and hana_hn1_clone_state eq PROMOTED
pcs constraint location g_secip_HN1_03 rule score=50  hana_hn1_roles eq 'master1:master:worker:master'
pcs constraint order promote  SAPHana_HN1_HDB03-clone then start g_ip_HN1_03
pcs constraint order start g_ip_HN1_03 then start g_secip_HN1_03
pcs constraint colocation add g_secip_HN1_03 with Slave SAPHana_HN1_HDB03-clone 5

# RHEL 7.x:
pcs constraint location g_ip_HN1_03 rule score=500 role=master hana_hn1_roles eq "master1:master:worker:master" and hana_hn1_clone_state eq PROMOTED
pcs constraint location g_secip_HN1_03 rule score=50  hana_hn1_roles eq 'master1:master:worker:master'
pcs constraint order promote  msl_SAPHana_HN1_HDB03 then start g_ip_HN1_03
pcs constraint order start g_ip_HN1_03 then start g_secip_HN1_03
pcs constraint colocation add g_secip_HN1_03 with Slave msl_SAPHana_HN1_HDB03 5

pcs property set maintenance-mode=false
```
Make sure that the cluster status is `ok`, and that all of the resources are started. The second virtual IP will run on the secondary site along with SAP HANA secondary resource.

```
# Example output from crm_mon
#Online: [ hana-s-mm hana-s1-db1 hana-s1-db2 hana-s1-db3 hana-s2-db1 hana-s2-db2 hana-s2-db3 ]
#
#Active resources:
#
#rsc_st_azure    (stonith:fence_azure_arm):      Started hana-s-mm
#Clone Set: fs_hana_shared_s1-clone [fs_hana_shared_s1]
#    Started: [ hana--s1-db1 hana-s1-db2 hana-s1-db3 ]
#Clone Set: fs_hana_shared_s2-clone [fs_hana_shared_s2]
#    Started: [ hana-s2-db1 hana-s2-db2 hana-s2-db3 ]
#Clone Set: hana_nfs_s1_active-clone [hana_nfs_s1_active]
#    Started: [ hana-s1-db1 hana-s1-db2 hana-s1-db3 ]
#Clone Set: hana_nfs_s2_active-clone [hana_nfs_s2_active]
#    Started: [ hana-s2-db1 hana-s2-db2 hana-s2-db3 ]
#Clone Set: SAPHanaTopology_HN1_HDB03-clone [SAPHanaTopology_HN1_HDB03]
#    Started: [ hana-s1-db1 hana-s1-db2 hana-s1-db3 hana-s2-db1 hana-s2-db2 hana-s2-db3 ]
#Master/Slave Set: msl_SAPHana_HN1_HDB03 [SAPHana_HN1_HDB03]
#    Masters: [ hana-s1-db1 ]
#    Slaves: [ hana-s1-db2 hana-s1-db3 hana-s2-db1 hana-s2-db2 hana-s2-db3 ]
#Resource Group: g_ip_HN1_03
#    nc_HN1_03  (ocf::heartbeat:azure-lb):      Started hana-s1-db1
#    vip_HN1_03 (ocf::heartbeat:IPaddr2):       Started hana-s1-db1
#Resource Group: g_secip_HN1_03
#    secnc_HN1_03       (ocf::heartbeat:azure-lb):      Started hana-s2-db1
#    secvip_HN1_03      (ocf::heartbeat:IPaddr2):       Started hana-s2-db1

```

In the next section, you can find the typical set of failover tests to run.

When you're testing a HANA cluster configured with a read-enabled secondary, be aware of the following behavior of the second virtual IP:

- When cluster resource **SAPHana_HN1_HDB03** moves to the secondary site (**S2**), the second virtual IP will move to the other site, **hana-s1-db1**. If you have configured `AUTOMATED_REGISTER="false"`, and HANA system replication isn't registered automatically, then the second virtual IP will run on **hana-s2-db1**.  

- When you're testing server crash, the second virtual IP resources (**secvip_HN1_03**) and the Azure Load Balancer port resource (**secnc_HN1_03**) run on the primary server, alongside the primary virtual IP resources. While the secondary server is down, the applications that are connected to the read-enabled HANA database will connect to the primary HANA database. This behavior is expected. It allows applications that are connected to the read-enabled HANA database to operate while a secondary server is unavailable.   
  
- During failover and fallback, the existing connections for applications that are using the second virtual IP to connect to the HANA database might be interrupted.  

## Test SAP HANA failover 

1. Before you start a test, check the cluster and SAP HANA system replication status.  

   1. Verify that there are no failed cluster actions.  
       ```bash
       #Verify that there are no failed cluster actions
       pcs status
       # Example
       #Stack: corosync
       #Current DC: hana-s-mm (version 1.1.19-8.el7_6.5-c3c624ea3d) - partition with quorum
       #Last updated: Thu Sep 24 06:00:20 2020
       #Last change: Thu Sep 24 05:59:17 2020 by root via crm_attribute on hana-s1-db1
       #
       #7 nodes configured
       #45 resources configured
       #
       #Online: [ hana-s-mm hana-s1-db1 hana-s1-db2 hana-s1-db3 hana-s2-db1 hana-s2-db2 hana-s2-db3 ]
       #
       #Active resources:
       #
       #rsc_st_azure    (stonith:fence_azure_arm):      Started hana-s-mm
       #Clone Set: fs_hana_shared_s1-clone [fs_hana_shared_s1]
       #    Started: [ hana--s1-db1 hana-s1-db2 hana-s1-db3 ]
       #Clone Set: fs_hana_shared_s2-clone [fs_hana_shared_s2]
       #    Started: [ hana-s2-db1 hana-s2-db2 hana-s2-db3 ]
       #Clone Set: hana_nfs_s1_active-clone [hana_nfs_s1_active]
       #    Started: [ hana-s1-db1 hana-s1-db2 hana-s1-db3 ]
       #Clone Set: hana_nfs_s2_active-clone [hana_nfs_s2_active]
       #    Started: [ hana-s2-db1 hana-s2-db2 hana-s2-db3 ]
       #Clone Set: SAPHanaTopology_HN1_HDB03-clone [SAPHanaTopology_HN1_HDB03]
       #    Started: [ hana-s1-db1 hana-s1-db2 hana-s1-db3 hana-s2-db1 hana-s2-db2 hana-s2-db3 ]
       #Master/Slave Set: msl_SAPHana_HN1_HDB03 [SAPHana_HN1_HDB03]
       #    Masters: [ hana-s1-db1 ]
       #    Slaves: [ hana-s1-db2 hana-s1-db3 hana-s2-db1 hana-s2-db2 hana-s2-db3 ]
       #Resource Group: g_ip_HN1_03
       #    nc_HN1_03  (ocf::heartbeat:azure-lb):      Started hana-s1-db1
       #    vip_HN1_03 (ocf::heartbeat:IPaddr2):       Started hana-s1-db1
       ```

   1. Verify that SAP HANA system replication is in sync.

      ```bash
      # Verify HANA HSR is in sync
      sudo su - hn1adm -c "python /usr/sap/HN1/HDB03/exe/python_support/systemReplicationStatus.py"
      #| Database | Host        | Port  | Service Name | Volume ID | Site ID | Site Name | Secondary     | Secondary| Secondary | Secondary | Secondary     | Replication | Replication | Replication    |
      #|          |             |       |              |           |         |           | Host          | Port     | Site ID   | Site Name | Active Status | Mode        | Status      | Status Details |
      #| -------- | ----------- | ----- | ------------ | --------- | ------- | --------- | ------------- | -------- | --------- | --------- | ------------- | ----------- | ----------- | -------------- |
      #| HN1      | hana-s1-db3 | 30303 | indexserver  |         5 |       2 | HANA_S1   | hana-s2-db3 |     30303  |         1 | HANA_S2   | YES           | SYNC        | ACTIVE      |                |
      #| HN1      | hana-s1-db2 | 30303 | indexserver  |         4 |       2 | HANA_S1   | hana-s2-db2 |     30303  |         1 | HANA_S2   | YES           | SYNC        | ACTIVE      |                |  
      #| SYSTEMDB | hana-s1-db1 | 30301 | nameserver   |         1 |       2 | HANA_S1   | hana-s2-db1 |     30301  |         1 | HANA_S2   | YES           | SYNC        | ACTIVE      |                |
      #| HN1      | hana-s1-db1 | 30307 | xsengine     |         2 |       2 | HANA_S1   | hana-s2-db1 |     30307  |         1 | HANA_S2   | YES           | SYNC        | ACTIVE      |                |
      #| HN1      | hana-s1-db1 | 30303 | indexserver  |         3 |       2 | HANA_S1   | hana-s2-db1 |     30303  |         1 | HANA_S2   | YES           | SYNC        | ACTIVE      |                |

      #status system replication site "1": ACTIVE
      #overall system replication status: ACTIVE

      #Local System Replication State
      #~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      #mode: PRIMARY
      #site id: 1
      #site name: HANA_S1
      ```

1. Verify the cluster configuration for a failure scenario, when a node loses access to the NFS share (`/hana/shared`).  

   The SAP HANA resource agents depend on binaries, stored on `/hana/shared`, to perform operations during failover. File system `/hana/shared` is mounted over NFS in the presented configuration. A test that can be performed, is to create a temporary firewall rule to block access to the `/hana/shared` NFS mounted file system on one of the primary site VMs. This approach validates that the cluster will fail over, if access to `/hana/shared` is lost on the active system replication site. 

   **Expected result**: When you block the access to the `/hana/shared` NFS mounted file system on one of the primary site VMs, the monitoring operation that performs read/write operation on file system, will fail, as it is not able to access the file system and will trigger HANA resource failover. The same result is expected when your HANA node loses access to the NFS share.    
     
   You can check the state of the cluster resources by running `crm_mon` or `pcs status`. Resource state before starting the test:
      ```bash
      # Output of crm_mon
      #7 nodes configured
      #45 resources configured

      #Online: [ hana-s-mm hana-s1-db1 hana-s1-db2 hana-s1-db3 hana-s2-db1 hana-s2-db2 hana-s2-db3 ]
      #
      #Active resources:

      #rsc_st_azure    (stonith:fence_azure_arm):      Started hana-s-mm
      # Clone Set: fs_hana_shared_s1-clone [fs_hana_shared_s1]
      #    Started: [ hana-s1-db1 hana-s1-db2 hana-s1-db3 ]
      # Clone Set: fs_hana_shared_s2-clone [fs_hana_shared_s2]
      #     Started: [ hana-s2-db1 hana-s2-db2 hana-s2-db3 ]
      # Clone Set: hana_nfs_s1_active-clone [hana_nfs_s1_active]
      #     Started: [ hana-s1-db1 hana-s1-db2 hana-s1-db3 ]
      # Clone Set: hana_nfs_s2_active-clone [hana_nfs_s2_active]
      #     Started: [ hana-s2-db1 hana-s2-db2 hana-s2-db3 ]
      # Clone Set: SAPHanaTopology_HN1_HDB03-clone [SAPHanaTopology_HN1_HDB03]
      #     Started: [ hana-s1-db1 hana-s1-db2 hana-s1-db3 hana-s2-db1 hana-s2-db2 hana-s2-db3 ]
      # Master/Slave Set: msl_SAPHana_HN1_HDB03 [SAPHana_HN1_HDB03]
      #     Masters: [ hana-s1-db1 ]
      #     Slaves: [ hana-s1-db2 hana-s1-db3 hana-s2-db1 hana-s2-db2 hana-s2-db3 ]
      # Resource Group: g_ip_HN1_03
      #     nc_HN1_03  (ocf::heartbeat:azure-lb):      Started hana-s1-db1
      #     vip_HN1_03 (ocf::heartbeat:IPaddr2):       Started hana-s1-db1
      ```

   To simulate failure for `/hana/shared`:

   * If using NFS on ANF, first confirm the IP address for the `/hana/shared` ANF volume on the primary site. You can do that by running `df -kh|grep /hana/shared`.
   * If using NFS on Azure Files, first determine the IP address of the private end point for your storage account.

   Then, set up a temporary firewall rule to block access to the IP address of the `/hana/shared` NFS file system by executing the following command on one of the primary HANA system replication site VMs.

   In this example, the command was executed on hana-s1-db1 for ANF volume `/hana/shared`.

     ```bash
     iptables -A INPUT -s 10.23.1.7 -j DROP; iptables -A OUTPUT -d 10.23.1.7 -j DROP
     ```

   The HANA VM that lost access to `/hana/shared` should restart or stop, depending on the cluster configuration. The cluster resources are migrated to the other HANA system replication site.  
         
   If the cluster hasn't started on the VM that was restarted, start the cluster by running the following: 

      ```bash
      # Start the cluster 
      pcs cluster start
      ```
   
   When the cluster starts, file system `/hana/shared` is automatically mounted. If you set `AUTOMATED_REGISTER="false"`, you will need to configure SAP HANA system replication on the secondary site. In this case, you can run these commands to reconfigure SAP HANA as secondary.   

      ```bash
      # Execute on the secondary 
      su - hn1adm
      # Make sure HANA is not running on the secondary site. If it is started, stop HANA
      sapcontrol -nr 03 -function StopWait 600 10
      # Register the HANA secondary site
      hdbnsutil -sr_register --name=HANA_S1 --remoteHost=hana-s2-db1 --remoteInstance=03 --replicationMode=sync
      # Switch back to root and clean up failed resources
      pcs resource cleanup SAPHana_HN1_HDB03
      ```

   The state of the resources, after the test: 

      ```bash
      # Output of crm_mon
      #7 nodes configured
      #45 resources configured
	
      #Online: [ hana-s-mm hana-s1-db1 hana-s1-db2 hana-s1-db3 hana-s2-db1 hana-s2-db2 hana-s2-db3 ]
	  
      #Active resources:
	
      #rsc_st_azure    (stonith:fence_azure_arm):      Started hana-s-mm
      # Clone Set: fs_hana_shared_s1-clone [fs_hana_shared_s1]
      #    Started: [ hana-s1-db1 hana-s1-db2 hana-s1-db3 ]
      # Clone Set: fs_hana_shared_s2-clone [fs_hana_shared_s2]
      #     Started: [ hana-s2-db1 hana-s2-db2 hana-s2-db3 ]
      # Clone Set: hana_nfs_s1_active-clone [hana_nfs_s1_active]
      #     Started: [ hana-s1-db1 hana-s1-db2 hana-s1-db3 ]
      # Clone Set: hana_nfs_s2_active-clone [hana_nfs_s2_active]
      #     Started: [ hana-s2-db1 hana-s2-db2 hana-s2-db3 ]
      # Clone Set: SAPHanaTopology_HN1_HDB03-clone [SAPHanaTopology_HN1_HDB03]
      #     Started: [ hana-s1-db1 hana-s1-db2 hana-s1-db3 hana-s2-db1 hana-s2-db2 hana-s2-db3 ]
      # Master/Slave Set: msl_SAPHana_HN1_HDB03 [SAPHana_HN1_HDB03]
      #     Masters: [ hana-s2-db1 ]
      #     Slaves: [ hana-s1-db1 hana-s1-db2 hana-s1-db3 hana-s2-db2 hana-s2-db3 ]
      # Resource Group: g_ip_HN1_03
      #     nc_HN1_03  (ocf::heartbeat:azure-lb):      Started hana-s2-db1
      #     vip_HN1_03 (ocf::heartbeat:IPaddr2):       Started hana-s2-db1
      ```


It's a good idea to test the SAP HANA cluster configuration thoroughly, by also performing the tests documented in [HA for SAP HANA on Azure VMs on RHEL](./sap-hana-high-availability-rhel.md#test-the-cluster-setup).

## Next steps

* [Azure Virtual Machines planning and implementation for SAP][planning-guide]
* [Azure Virtual Machines deployment for SAP][deployment-guide]
* [Azure Virtual Machines DBMS deployment for SAP][dbms-guide]
* [NFS v4.1 volumes on Azure NetApp Files for SAP HANA](./hana-vm-operations-netapp.md)
* To learn how to establish high availability and plan for disaster recovery of SAP HANA on Azure VMs, see [High Availability of SAP HANA on Azure VMs][sap-hana-ha].
