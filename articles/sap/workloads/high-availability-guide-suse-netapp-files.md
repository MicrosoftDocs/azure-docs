---
title: Azure VMs high availability for SAP NW on SLES with Azure NetApp Files| Microsoft Docs
description: High-availability guide for SAP NetWeaver on SUSE Linux Enterprise Server with Azure NetApp Files for SAP applications
services: virtual-machines-windows,virtual-network,storage
documentationcenter: saponazure
author: rdeltcheva
manager: juergent
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: article
ms.workload: infrastructure-services
ms.date: 09/15/2023
ms.author: radeltch
---

# High availability for SAP NetWeaver on Azure VMs on SUSE Linux Enterprise Server with Azure NetApp Files for SAP applications

[dbms-guide]:dbms-guide-general.md
[deployment-guide]:deployment-guide.md
[planning-guide]:planning-guide.md

[anf-azure-doc]:../../azure-netapp-files/azure-netapp-files-introduction.md
[anf-avail-matrix]:https://azure.microsoft.com/global-infrastructure/services/?products=storage&regions=all
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

[suse-ha-guide]:https://www.suse.com/products/sles-for-sap/resource-library/sap-best-practices/
[suse-ha-12sp3-relnotes]:https://www.suse.com/releasenotes/x86_64/SLE-HA/12-SP3/

[sap-hana-ha]:sap-hana-high-availability.md

This article explains how to configure high availability for SAP NetWeaver application with [Azure NetApp Files](../../azure-netapp-files/azure-netapp-files-introduction.md).

For new implementations on SLES for SAP Applications 15, we  recommended deploying high availability for SAP ASCS/ERS in [simple mount configuration](./high-availability-guide-suse-nfs-simple-mount.md). The classic Pacemaker configuration, based on cluster-controlled file systems for the SAP central services directories, described in this article is still [supported](https://documentation.suse.com/sbp/all/single-html/SAP-nw740-sle15-setupguide/#id-introduction).

In the example configurations, installation commands etc., the ASCS instance is number 00, the ERS instance number 01, the Primary Application instance (PAS) is 02 and the Application instance (AAS) is 03. SAP System ID QAS is used. The database layer isn't covered in detail in this article.

Read the following SAP Notes and papers first:

* [Azure NetApp Files documentation][anf-azure-doc]
* SAP Note [1928533][1928533], which has:  
  * List of Azure VM sizes that are supported for the deployment of SAP software
  * Important capacity information for Azure VM sizes
  * Supported SAP software, and operating system (OS) and database combinations
  * Required SAP kernel version for Windows and Linux on Microsoft Azure
* SAP Note [2015553][2015553] lists prerequisites for SAP-supported SAP software deployments in Azure.
* SAP Note [2205917][2205917] has recommended OS settings for SUSE Linux Enterprise Server for SAP Applications
* SAP Note [1944799][1944799] has SAP HANA Guidelines for SUSE Linux Enterprise Server for SAP Applications
* SAP Note [2178632][2178632] has detailed information about all monitoring metrics reported for SAP in Azure.
* SAP Note [2191498][2191498] has the required SAP Host Agent version for Linux in Azure.
* SAP Note [2243692][2243692] has information about SAP licensing on Linux in Azure.
* SAP Note [1984787][1984787] has general information about SUSE Linux Enterprise Server 12.
* SAP Note [1999351][1999351] has additional troubleshooting information for the Azure Enhanced Monitoring Extension for SAP.
* [SAP Community WIKI](https://wiki.scn.sap.com/wiki/display/HOME/SAPonLinuxNotes) has all required SAP Notes for Linux.
* [Azure Virtual Machines planning and implementation for SAP on Linux][planning-guide]
* [Azure Virtual Machines deployment for SAP on Linux][deployment-guide]
* [Azure Virtual Machines DBMS deployment for SAP on Linux][dbms-guide]
* [SUSE SAP HA Best Practice Guides][suse-ha-guide]
  The guides contain all required information to set up Netweaver HA and SAP HANA System Replication on-premises. Use these guides as a general baseline. They provide much more detailed information.
* [SUSE High Availability Extension 12 SP3 Release Notes][suse-ha-12sp3-relnotes]
* [NetApp SAP Applications on Microsoft Azure using Azure NetApp Files][anf-sap-applications-azure]
* [NetApp NFS Best Practices](https://www.netapp.com/media/10720-tr-4067.pdf)

## Overview

High availability(HA) for SAP Netweaver central services requires shared storage.
To achieve that on SUSE Linux so far it was necessary to build separate highly available NFS cluster.

Now it's possible to achieve SAP Netweaver HA by using shared storage, deployed on Azure NetApp Files. Using Azure NetApp Files for the shared storage eliminates the need for additional [NFS cluster](./high-availability-guide-suse-nfs.md). Pacemaker is still needed for HA of the SAP Netweaver central services(ASCS/SCS).

![SAP NetWeaver High Availability overview](./media/high-availability-guide-suse-anf/high-availability-guide-suse-anf.png)

SAP NetWeaver ASCS, SAP NetWeaver SCS, SAP NetWeaver ERS, and the SAP HANA database use virtual hostname and virtual IP addresses. On Azure, a [load balancer](../../load-balancer/load-balancer-overview.md) is required to use a virtual IP address. We recommend using [Standard load balancer](../../load-balancer/quickstart-load-balancer-standard-public-portal.md). The presented configuration shows a load balancer with:

* Frontend IP address 10.1.1.20 for ASCS
* Frontend IP address 10.1.1.21 for ERS
* Probe port 62000 for ASCS
* Probe port 62101 for ERS

## Setting up the Azure NetApp Files infrastructure

SAP NetWeaver requires shared storage for the transport and profile directory.  Before proceeding with the setup for Azure NetApp files infrastructure, familiarize yourself with the [Azure NetApp Files documentation][anf-azure-doc].
Check if your selected Azure region offers Azure NetApp Files. The following link shows the availability of Azure NetApp Files by Azure region: [Azure NetApp Files Availability by Azure Region][anf-avail-matrix].

Azure NetApp files is available in several [Azure regions](https://azure.microsoft.com/global-infrastructure/services/?products=netapp).

### Deploy Azure NetApp Files resources  

The steps assume that you have already deployed [Azure Virtual Network](../../virtual-network/virtual-networks-overview.md). The Azure NetApp Files resources and the VMs, where the Azure NetApp Files resources will be mounted must be deployed in the same Azure Virtual Network or in peered Azure Virtual Networks.  

1. Create the NetApp account in the selected Azure region, following the [instructions to create NetApp Account](../../azure-netapp-files/azure-netapp-files-create-netapp-account.md).  
2. Set up Azure NetApp Files capacity pool, following the [instructions on how to set up Azure NetApp Files capacity pool](../../azure-netapp-files/azure-netapp-files-set-up-capacity-pool.md).  
The SAP Netweaver architecture presented in this article uses single Azure NetApp Files capacity pool, Premium SKU. We recommend Azure NetApp Files Premium SKU for SAP Netweaver application workload on Azure.  
3. Delegate a subnet to Azure NetApp files as described in the [instructions Delegate a subnet to Azure NetApp Files](../../azure-netapp-files/azure-netapp-files-delegate-subnet.md).  
4. Deploy Azure NetApp Files volumes, following the [instructions to create a volume for Azure NetApp Files](../../azure-netapp-files/azure-netapp-files-create-volumes.md). Deploy the volumes in the designated Azure NetApp Files [subnet](/rest/api/virtualnetwork/subnets). The IP addresses of the Azure NetApp volumes are assigned automatically. Keep in mind that the Azure NetApp Files resources and the Azure VMs must be in the same Azure Virtual Network or in peered Azure Virtual Networks. In this example we use two Azure NetApp Files volumes: sap**QAS** and trans. The file paths that are mounted to the corresponding mount points are /usrsap**qas**/sapmnt**QAS**, /usrsap**qas**/usrsap**QAS**sys, etc.  
   1. volume sap**QAS** (nfs://10.1.0.4/usrsap**qas**/sapmnt**QAS**)
   2. volume sap**QAS** (nfs://10.1.0.4/usrsap**qas**/usrsap**QAS**ascs)
   3. volume sap**QAS** (nfs://10.1.0.4/usrsap**qas**/usrsap**QAS**sys)
   4. volume sap**QAS** (nfs://10.1.0.4/usrsap**qas**/usrsap**QAS**ers)
   5. volume trans (nfs://10.1.0.4/trans)
   6. volume sap**QAS** (nfs://10.1.0.4/usrsap**qas**/usrsap**QAS**pas)
   7. volume sap**QAS** (nfs://10.1.0.4/usrsap**qas**/usrsap**QAS**aas)

In this example, we used Azure NetApp Files for all SAP Netweaver file systems to demonstrate how Azure NetApp Files can be used. The SAP file systems that don't need to be mounted via NFS can also be deployed as [Azure disk storage](../../virtual-machines/disks-types.md#premium-ssds) . In this example **a-e** must be on Azure NetApp Files and **f-g** (that is, /usr/sap/**QAS**/D**02**, /usr/sap/**QAS**/D**03**) could be deployed as Azure disk storage.

### Important considerations

When considering Azure NetApp Files for the SAP Netweaver on SUSE High Availability architecture, be aware of the following important considerations:

* The minimum capacity pool is 4 TiB. The capacity pool size can be increased in 1-TiB increments.
* The minimum volume is 100 GiB
* Azure NetApp Files and all virtual machines, where Azure NetApp Files volumes will be mounted, must be in the same Azure Virtual Network or in [peered virtual networks](../../virtual-network/virtual-network-peering-overview.md) in the same region. Azure NetApp Files access over VNET peering in the same region is supported now. Azure NetApp access over global peering is not yet supported.
* The selected virtual network must have a subnet, delegated to Azure NetApp Files.
* The throughput and performance characteristics of an Azure NetApp Files volume is a function of the volume quota and service level, as documented in [Service level for Azure NetApp Files](../../azure-netapp-files/azure-netapp-files-service-levels.md). While sizing the SAP Azure NetApp volumes, make sure that the resulting throughput meets the application requirements.  
* Azure NetApp Files offers [export policy](../../azure-netapp-files/azure-netapp-files-configure-export-policy.md): you can control the allowed clients, the access type (Read&Write, Read Only, etc.).
* Azure NetApp Files feature isn't zone aware yet. Currently Azure NetApp Files feature isn't deployed in all Availability zones in an Azure region. Be aware of the potential latency implications in some Azure regions.
* Azure NetApp Files volumes can be deployed as NFSv3 or NFSv4.1 volumes. Both protocols are supported for the SAP application layer (ASCS/ERS, SAP application servers).

## Deploy Linux VMs manually via Azure portal

This document assumes that you've already deployed a resource group, [Azure Virtual Network](../../virtual-network/virtual-networks-overview.md), and subnet.

Deploy virtual machines for SAP ASCS, ERS, and application server instances. Choose a suitable SLES image that is supported with your SAP system. You can deploy VM in any one of the availability options - scale set, availability zone or availability set.

## Disable ID mapping (if using NFSv4.1)

The instructions in this section are only applicable, if using Azure NetApp Files volumes with NFSv4.1 protocol. Perform the configuration on all VMs, where Azure NetApp Files NFSv4.1 volumes will be mounted.  

1. Verify the NFS domain setting. Make sure that the domain is configured as the default Azure NetApp Files domain, that is, **`defaultv4iddomain.com`** and the mapping is set to **nobody**.  

    > [!IMPORTANT]
    > Make sure to set the NFS domain in `/etc/idmapd.conf` on the VM to match the default domain configuration on Azure NetApp Files: **`defaultv4iddomain.com`**. If there's a mismatch between the domain configuration on the NFS client (i.e. the VM) and the NFS server, i.e. the Azure NetApp configuration, then the permissions for files on Azure NetApp volumes that are mounted on the VMs will be displayed as `nobody`.  

    ```bash
    sudo cat /etc/idmapd.conf
    
    # Example
    [General]
    Verbosity = 0
    Pipefs-Directory = /var/lib/nfs/rpc_pipefs
    Domain = defaultv4iddomain.com
    [Mapping]
    Nobody-User = nobody
    Nobody-Group = nobody
    ```

2. **[A]** Verify `nfs4_disable_idmapping`. It should be set to **Y**. To create the directory structure where `nfs4_disable_idmapping` is located, execute the mount command. You won't be able to manually create the directory under /sys/modules, because access is reserved for the kernel / drivers.  

    ```bash
    # Check nfs4_disable_idmapping 
    cat /sys/module/nfs/parameters/nfs4_disable_idmapping
    
    # If you need to set nfs4_disable_idmapping to Y
    mkdir /mnt/tmp
    mount 10.1.0.4:/sapmnt/qas /mnt/tmp
    umount  /mnt/tmp
    echo "Y" > /sys/module/nfs/parameters/nfs4_disable_idmapping
    
    # Make the configuration permanent
    echo "options nfs nfs4_disable_idmapping=Y" >> /etc/modprobe.d/nfs.conf
    ```

## Setting up (A)SCS

In this example, the resources were deployed manually via the [Azure portal](https://portal.azure.com/#home) .

### Deploy Azure Load Balancer manually via Azure portal

After you deploy the VMs for your SAP system, create a load balancer. Use VMs created for SAP ASCS/ERS instances in the backend pool.

1. Create load balancer (internal, standard):
   1. Create the frontend IP addresses
      1. IP address 10.1.1.20 for the ASCS
         1. Open the load balancer, select frontend IP pool, and click Add
         2. Enter the name of the new frontend IP pool (for example **frontend.QAS.ASCS**)
         3. Set the Assignment to Static and enter the IP address (for example **10.1.1.20**)
         4. Click OK
      2. IP address 10.1.1.21 for the ASCS ERS
         * Repeat the steps above under "a" to create an IP address for the ERS (for example **10.1.1.21** and **frontend.QAS.ERS**)
   2. Create a single back-end pool:
      1. Open the load balancer, select **Backend pools**, and then select **Add**.
      2. Enter the name of the new back-end pool (for example, **backend.QAS**).
      3. Select **NIC** for Backend Pool Configuration.
      4. Select **Add a virtual machine**.
      5. Select the virtual machines of the ASCS cluster.
      6. Select **Add**.
      7. Select **Save**.
   3. Create the health probes
      1. Port 620**00** for ASCS
         1. Open the load balancer, select health probes, and click Add
         2. Enter the name of the new health probe (for example **health.QAS.ASCS**)
         3. Select TCP as protocol, port 620**00**, keep Interval 5  
         4. Click OK
      2. Port 621**01** for ASCS ERS
            * Repeat the steps above under "c" to create a health probe for the ERS (for example 621**01** and **health.QAS.ERS**)
   4. Load-balancing rules
      1. Create a backend pool for the ASCS
         1. Open the load balancer, select Load-balancing rules and click Add
         2. Enter the name of the new load balancer rule (for example **lb.QAS.ASCS**)
         3. Select the frontend IP address for ASCS, backend pool, and health probe you created earlier (for example **frontend.QAS.ASCS**, **backend.QAS** and **health.QAS.ASCS**)
         4. Select **HA ports**
         5. Increase idle timeout to 30 minutes
         6. **Make sure to enable Floating IP**
         7. Click OK
         * Repeat the steps above to create load balancing rules for ERS (for example **lb.QAS.ERS**)

> [!IMPORTANT]
> Floating IP is not supported on a NIC secondary IP configuration in load-balancing scenarios. For details see [Azure Load balancer Limitations](../../load-balancer/load-balancer-multivip-overview.md#limitations). If you need additional IP address for the VM, deploy a second NIC.  

> [!NOTE]
> When VMs without public IP addresses are placed in the backend pool of internal (no public IP address) Standard Azure load balancer, there will be no outbound internet connectivity, unless additional configuration is performed to allow routing to public end points. For details on how to achieve outbound connectivity see [Public endpoint connectivity for Virtual Machines using Azure Standard Load Balancer in SAP high-availability scenarios](./high-availability-guide-standard-load-balancer-outbound-connections.md).  

> [!IMPORTANT]
> Do not enable TCP timestamps on Azure VMs placed behind Azure Load Balancer. Enabling TCP timestamps will cause the health probes to fail. Set parameter **net.ipv4.tcp_timestamps** to **0**. For details see [Load Balancer health probes](../../load-balancer/load-balancer-custom-probe-overview.md).

### Create Pacemaker cluster

Follow the steps in [Setting up Pacemaker on SUSE Linux Enterprise Server in Azure](high-availability-guide-suse-pacemaker.md) to create a basic Pacemaker cluster for this (A)SCS server.

### Installation

The following items are prefixed with either **[A]** - applicable to all nodes, **[1]** - only applicable to node 1 or **[2]** - only applicable to node 2.

1. **[A]** Install SUSE Connector

   ```bash
   sudo zypper install sap-suse-cluster-connector
   ```

   > [!NOTE]
   > The known issue with using a dash in host names is fixed with version **3.1.1** of package **sap-suse-cluster-connector**. Make sure that you are using at least version 3.1.1 of package sap-suse-cluster-connector, if using cluster nodes with dash in the host name. Otherwise your cluster will not work.

   Make sure that you installed the new version of the SAP SUSE cluster connector. The old one was called sap_suse_cluster_connector and the new one is called **sap-suse-cluster-connector**.

   ```bash
   sudo zypper info sap-suse-cluster-connector
   
   # Information for package sap-suse-cluster-connector:
   # ---------------------------------------------------
   # Repository     : SLE-12-SP3-SAP-Updates
   # Name           : sap-suse-cluster-connector
   # Version        : 3.1.0-8.1
   # Arch           : noarch
   # Vendor         : SUSE LLC <https://www.suse.com/>
   # Support Level  : Level 3
   # Installed Size : 45.6 KiB
   # Installed      : Yes
   # Status         : up-to-date
   # Source package : sap-suse-cluster-connector-3.1.0-8.1.src
   # Summary        : SUSE High Availability Setup for SAP Products
   ```

2. **[A]** Update SAP resource agents  

   A patch for the resource-agents package is required to use the new configuration, that is described in this article. You can check, if the patch is already installed with the following command

   ```bash
   sudo grep 'parameter name="IS_ERS"' /usr/lib/ocf/resource.d/heartbeat/SAPInstance
   ```

   The output should be similar to

   ```text
   <parameter name="IS_ERS" unique="0" required="0">
   ```

   If the grep command doesn't find the IS_ERS parameter, you need to install the patch listed on [the SUSE download page](https://download.suse.com/patch/finder/#bu=suse&familyId=&productId=&dateRange=&startDate=&endDate=&priority=&architecture=&keywords=resource-agents)

   ```bash
   # example for patch for SLES 12 SP1
   sudo zypper in -t patch SUSE-SLE-HA-12-SP1-2017-885=1
   
   # example for patch for SLES 12 SP2
   sudo zypper in -t patch SUSE-SLE-HA-12-SP2-2017-886=1
   ```

3. **[A]** Setup host name resolution

   You can either use a DNS server or modify the /etc/hosts on all nodes. This example shows how to use the /etc/hosts file.
   Replace the IP address and the hostname in the following commands

   ```bash
   sudo vi /etc/hosts
   ```

   Insert the following lines to /etc/hosts. Change the IP address and hostname to match your environment

   ```text
   # IP address of cluster node 1
   10.1.1.18    anftstsapcl1
   # IP address of cluster node 2
   10.1.1.6     anftstsapcl2
   # IP address of the load balancer frontend configuration for SAP Netweaver ASCS
   10.1.1.20    anftstsapvh
   # IP address of the load balancer frontend configuration for SAP Netweaver ERS
   10.1.1.21    anftstsapers
   ```

4. **[1]** Create SAP directories in the Azure NetApp Files volume.  

   Mount temporarily the Azure NetApp Files volume on one of the VMs and create the SAP directories(file paths).  

   ```bash
   # mount temporarily the volume
   sudo mkdir -p /saptmp
   # If using NFSv3
   sudo mount -t nfs -o rw,hard,rsize=65536,wsize=65536,nfsvers=3,tcp 10.1.0.4:/sapQAS /saptmp
   # If using NFSv4.1
   sudo mount -t nfs -o rw,hard,rsize=65536,wsize=65536,nfsvers=4.1,sec=sys,tcp 10.1.0.4:/sapQAS /saptmp
   # create the SAP directories
   sudo cd /saptmp
   sudo mkdir -p sapmntQAS
   sudo mkdir -p usrsapQASascs
   sudo mkdir -p usrsapQASers
   sudo mkdir -p usrsapQASsys
   sudo mkdir -p usrsapQASpas
   sudo mkdir -p usrsapQASaas
   # unmount the volume and delete the temporary directory
   sudo cd ..
   sudo umount /saptmp
   sudo rmdir /saptmp
   ```

## Prepare for SAP NetWeaver installation

1. **[A]** Create the shared directories

   ```bash
   sudo mkdir -p /sapmnt/QAS
   sudo mkdir -p /usr/sap/trans
   sudo mkdir -p /usr/sap/QAS/SYS
   sudo mkdir -p /usr/sap/QAS/ASCS00
   sudo mkdir -p /usr/sap/QAS/ERS01
   
   sudo chattr +i /sapmnt/QAS
   sudo chattr +i /usr/sap/trans
   sudo chattr +i /usr/sap/QAS/SYS
   sudo chattr +i /usr/sap/QAS/ASCS00
   sudo chattr +i /usr/sap/QAS/ERS01
   ```

2. **[A]** Configure `autofs`

   ```bash
   sudo vi /etc/auto.master
   
   # Add the following line to the file, save and exit
   /- /etc/auto.direct
   ```

   If using NFSv3, create a file with:

   ```bash
   sudo vi /etc/auto.direct
   
   # Add the following lines to the file, save and exit
   /sapmnt/QAS -nfsvers=3,nobind 10.1.0.4:/usrsapqas/sapmntQAS
   /usr/sap/trans -nfsvers=3,nobind 10.1.0.4:/trans
   /usr/sap/QAS/SYS -nfsvers=3,nobind 10.1.0.4:/usrsapqas/usrsapQASsys
   ```

   If using NFSv4.1, create a file with:

   ```bash
   sudo vi /etc/auto.direct
   
   # Add the following lines to the file, save and exit
   /sapmnt/QAS -nfsvers=4.1,nobind,sec=sys 10.1.0.4:/usrsapqas/sapmntQAS
   /usr/sap/trans -nfsvers=4.1,nobind,sec=sys 10.1.0.4:/trans
   /usr/sap/QAS/SYS -nfsvers=4.1,nobind,sec=sys 10.1.0.4:/usrsapqas/usrsapQASsys
   ```

   > [!NOTE]
   > Make sure to match the NFS protocol version of the Azure NetApp Files volumes, when mounting the volumes. If the Azure NetApp Files volumes are created as NFSv3 volumes, use the corresponding NFSv3 configuration. If the Azure NetApp Files volumes are created as NFSv4.1 volumes, follow the instructions to disable ID mapping and make sure to use the corresponding NFSv4.1 configuration. In this example the Azure NetApp Files volumes were created as NFSv3 volumes.  

   Restart `autofs` to mount the new shares

   ```bash
   sudo systemctl enable autofs
   sudo service autofs restart
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
   > Recent testing revealed situations, where netcat stops responding to requests due to backlog and its limitation of handling only one connection. The netcat resource stops listening to the Azure Load balancer requests and the floating IP becomes unavailable.  
   > For existing Pacemaker clusters, we recommended in the past replacing netcat with socat. Currently we recommend using azure-lb resource agent, which is part of package resource-agents, with the following package version requirements:
   >
   > * For SLES 12 SP4/SP5, the version must be at least resource-agents-4.3.018.a7fb5035-3.30.1.  
   > * For SLES 15/15 SP1, the version must be at least resource-agents-4.3.0184.6ee15eb2-4.13.1.  
   >
   > Note that the change will require brief downtime.  
   > For existing Pacemaker clusters, if the configuration was already changed to use socat as described in [Azure Load-Balancer Detection Hardening](https://www.suse.com/support/kb/doc/?id=7024128), there is no requirement to switch immediately to azure-lb resource agent.

   ```bash
   sudo crm node standby anftstsapcl2
   
   # If using NFSv3
   sudo crm configure primitive fs_QAS_ASCS Filesystem device='10.1.0.4/usrsapqas/usrsapQASascs' directory='/usr/sap/QAS/ASCS00' fstype='nfs' \
     op start timeout=60s interval=0 \
     op stop timeout=60s interval=0 \
     op monitor interval=20s timeout=40s
   
   # If using NFSv4.1
   sudo crm configure primitive fs_QAS_ASCS Filesystem device='10.1.0.4:/usrsapqas/usrsapQASascs' directory='/usr/sap/QAS/ASCS00' fstype='nfs' options='sec=sys,nfsvers=4.1' \
     op start timeout=60s interval=0 \
     op stop timeout=60s interval=0 \
     op monitor interval=20s timeout=105s
   
   sudo crm configure primitive vip_QAS_ASCS IPaddr2 \
     params ip=10.1.1.20 \
     op monitor interval=10 timeout=20
   
   sudo crm configure primitive nc_QAS_ASCS azure-lb port=62000 \
     op monitor timeout=20s interval=10
   
   sudo crm configure group g-QAS_ASCS fs_QAS_ASCS nc_QAS_ASCS vip_QAS_ASCS \
      meta resource-stickiness=3000
   ```

   Make sure that the cluster status is ok and that all resources are started. It isn't important on which node the resources are running.

   ```bash
   sudo crm_mon -r
   
   # Node anftstsapcl2: standby
   # Online: [ anftstsapcl1 ]
   # 
   # Full list of resources:
   #
   # Resource Group: g-QAS_ASCS
   #     fs_QAS_ASCS        (ocf::heartbeat:Filesystem):    Started anftstsapcl1
   #     nc_QAS_ASCS        (ocf::heartbeat:azure-lb):      Started anftstsapcl1
   #     vip_QAS_ASCS       (ocf::heartbeat:IPaddr2):       Started anftstsapcl1
   # stonith-sbd     (stonith:external/sbd): Started anftstsapcl2
   ```

2. **[1]** Install SAP NetWeaver ASCS  

   Install SAP NetWeaver ASCS as root on the first node using a virtual hostname that maps to the IP address of the load balancer frontend configuration for the ASCS, for example **anftstsapvh**, **10.1.1.20** and the instance number that you used for the probe of the load balancer, for example **00**.

   You can use the sapinst parameter SAPINST_REMOTE_ACCESS_USER to allow a non-root user to connect to sapinst. You can use parameter SAPINST_USE_HOSTNAME to install SAP, using virtual hostname.

   ```bash
   sudo <swpm>/sapinst SAPINST_REMOTE_ACCESS_USER=sapadmin SAPINST_USE_HOSTNAME=virtual_hostname
   ```

   If the installation fails to create a subfolder in /usr/sap/**QAS**/ASCS**00**, try setting the owner and group of the ASCS**00**  folder and retry.

   ```bash
   chown qasadm /usr/sap/QAS/ASCS00
   chgrp sapsys /usr/sap/QAS/ASCS00
   ```

3. **[1]** Create a virtual IP resource and health-probe for the ERS instance.

   ```bash
   sudo crm node online anftstsapcl2
   sudo crm node standby anftstsapcl1
   
   # If using NFSv3
   sudo crm configure primitive fs_QAS_ERS Filesystem device='10.1.0.4:/usrsapqas/usrsapQASers' directory='/usr/sap/QAS/ERS01' fstype='nfs' \
     op start timeout=60s interval=0 \
     op stop timeout=60s interval=0 \
     op monitor interval=20s timeout=40s
   
   # If using NFSv4.1
   sudo crm configure primitive fs_QAS_ERS Filesystem device='10.1.0.4:/usrsapqas/usrsapQASers' directory='/usr/sap/QAS/ERS01' fstype='nfs' options='sec=sys,nfsvers=4.1' \
     op start timeout=60s interval=0 \
     op stop timeout=60s interval=0 \
     op monitor interval=20s timeout=105s
   
   sudo crm configure primitive vip_QAS_ERS IPaddr2 \
     params ip=10.1.1.21 \
     op monitor interval=10 timeout=20
   
   sudo crm configure primitive nc_QAS_ERS azure-lb port=62101 \
     op monitor timeout=20s interval=10
   
   sudo crm configure group g-QAS_ERS fs_QAS_ERS nc_QAS_ERS vip_QAS_ERS
   ```

   Make sure that the cluster status is ok and that all resources are started. It isn't important on which node the resources are running.

   ```bash
   sudo crm_mon -r
   
   # Node anftstsapcl1: standby
   # Online: [ anftstsapcl2 ]
   # 
   # Full list of resources:
   #
   # stonith-sbd     (stonith:external/sbd): Started anftstsapcl2
   #  Resource Group: g-QAS_ASCS
   #      fs_QAS_ASCS        (ocf::heartbeat:Filesystem):    Started anftstsapcl2
   #      nc_QAS_ASCS        (ocf::heartbeat:azure-lb):      Started anftstsapcl2
   #      vip_QAS_ASCS       (ocf::heartbeat:IPaddr2):       Started anftstsapcl2
   #  Resource Group: g-QAS_ERS
   #      fs_QAS_ERS (ocf::heartbeat:Filesystem):    Started anftstsapcl2
   #      nc_QAS_ERS (ocf::heartbeat:azure-lb):      Started anftstsapcl2
   #      vip_QAS_ERS  (ocf::heartbeat:IPaddr2):     Started anftstsapcl2
   ```

4. **[2]** Install SAP NetWeaver ERS

   Install SAP NetWeaver ERS as root on the second node using a virtual hostname that maps to the IP address of the load balancer frontend configuration for the ERS, for example **anftstsapers**, **10.1.1.21** and the instance number that you used for the probe of the load balancer, for example **01**.

   You can use the sapinst parameter SAPINST_REMOTE_ACCESS_USER to allow a non-root user to connect to sapinst. You can use parameter SAPINST_USE_HOSTNAME to install SAP, using virtual hostname.

   ```bash
   sudo <swpm>/sapinst SAPINST_REMOTE_ACCESS_USER=sapadmin SAPINST_USE_HOSTNAME=virtual_hostname
   ```

   > [!NOTE]
   > Use SWPM SP 20 PL 05 or higher. Lower versions do not set the permissions correctly and the installation will fail.

   If the installation fails to create a subfolder in /usr/sap/**QAS**/ERS**01**, try setting the owner and group of the ERS**01** folder and retry.

   ```bash
   chown qasadm /usr/sap/QAS/ERS01
   chgrp sapsys /usr/sap/QAS/ERS01
   ```

5. **[1]** Adapt the ASCS/SCS and ERS instance profiles

   * ASCS/SCS profile

     ```bash
     sudo vi /sapmnt/QAS/profile/QAS_ASCS00_anftstsapvh
     
     # Change the restart command to a start command
     #Restart_Program_01 = local $(_EN) pf=$(_PF)
     Start_Program_01 = local $(_EN) pf=$(_PF)
     
     # Add the following lines
     service/halib = $(DIR_CT_RUN)/saphascriptco.so
     service/halib_cluster_connector = /usr/bin/sap_suse_cluster_connector
     
     # Add the keep alive parameter, if using ENSA1
     enque/encni/set_so_keepalive = true
     ```

     For both ENSA1 and ENSA2, make sure that the `keepalive` OS parameters are set as described in SAP note [1410736](https://launchpad.support.sap.com/#/notes/1410736).  

   * ERS profile

     ```bash
     sudo vi /sapmnt/QAS/profile/QAS_ERS01_anftstsapers
     
     # Change the restart command to a start command
     #Restart_Program_00 = local $(_ER) pf=$(_PFL) NR=$(SCSID)
     Start_Program_00 = local $(_ER) pf=$(_PFL) NR=$(SCSID)
     
     # Add the following lines
     service/halib = $(DIR_CT_RUN)/saphascriptco.so
     service/halib_cluster_connector = /usr/bin/sap_suse_cluster_connector
     
     # remove Autostart from ERS profile
     # Autostart = 1
     ```

6. **[A]** Configure Keep Alive

   The communication between the SAP NetWeaver application server and the ASCS/SCS is routed through a software load balancer. The load balancer disconnects inactive connections after a configurable timeout. To prevent this you need to set a parameter in the SAP NetWeaver ASCS/SCS profile, if using ENSA1, and change the Linux system `keepalive` settings on all SAP servers for both ENSA1/ENSA2. Read [SAP Note 1410736][1410736] for more information.

   ```bash
   # Change the Linux system configuration
   sudo sysctl net.ipv4.tcp_keepalive_time=300
   ```

7. **[A]** Configure the SAP users after the installation

   ```bash
   # Add sidadm to the haclient group
   sudo usermod -aG haclient qasadm
   ```

8. **[1]** Add the ASCS and ERS SAP services to the `sapservice` file

   Add the ASCS service entry to the second node and copy the ERS service entry to the first node.

   ```bash
   cat /usr/sap/sapservices | grep ASCS00 | sudo ssh anftstsapcl2 "cat >>/usr/sap/sapservices"
   sudo ssh anftstsapcl2 "cat /usr/sap/sapservices" | grep ERS01 | sudo tee -a /usr/sap/sapservices
   ```

9. **[1]** Create the SAP cluster resources.

   If using enqueue server 1 architecture (ENSA1), define the resources as follows:

   ```bash
   sudo crm configure property maintenance-mode="true"
   
   # If using NFSv3
   sudo crm configure primitive rsc_sap_QAS_ASCS00 SAPInstance \
       operations \$id=rsc_sap_QAS_ASCS00-operations \
       op monitor interval=11 timeout=60 on-fail=restart \
       params InstanceName=QAS_ASCS00_anftstsapvh START_PROFILE="/sapmnt/QAS/profile/QAS_ASCS00_anftstsapvh" \
       AUTOMATIC_RECOVER=false \
       meta resource-stickiness=5000 failure-timeout=60 migration-threshold=1 priority=10
   
   # If using NFSv4.1
   sudo crm configure primitive rsc_sap_QAS_ASCS00 SAPInstance \
       operations \$id=rsc_sap_QAS_ASCS00-operations \
       op monitor interval=11 timeout=105 on-fail=restart \
       params InstanceName=QAS_ASCS00_anftstsapvh START_PROFILE="/sapmnt/QAS/profile/QAS_ASCS00_anftstsapvh" \
       AUTOMATIC_RECOVER=false \
       meta resource-stickiness=5000 failure-timeout=105 migration-threshold=1 priority=10
   
   # If using NFSv3   
   sudo crm configure primitive rsc_sap_QAS_ERS01 SAPInstance \
       operations \$id=rsc_sap_QAS_ERS01-operations \
       op monitor interval=11 timeout=60 on-fail=restart \
       params InstanceName=QAS_ERS01_anftstsapers START_PROFILE="/sapmnt/QAS/profile/QAS_ERS01_anftstsapers" AUTOMATIC_RECOVER=false IS_ERS=true \
       meta priority=1000
   
   # If using NFSv4.1
   sudo crm configure primitive rsc_sap_QAS_ERS01 SAPInstance \
       operations \$id=rsc_sap_QAS_ERS01-operations \
       op monitor interval=11 timeout=105 on-fail=restart \
       params InstanceName=QAS_ERS01_anftstsapers START_PROFILE="/sapmnt/QAS/profile/QAS_ERS01_anftstsapers" AUTOMATIC_RECOVER=false IS_ERS=true \
       meta priority=1000
   
   sudo crm configure modgroup g-QAS_ASCS add rsc_sap_QAS_ASCS00
   sudo crm configure modgroup g-QAS_ERS add rsc_sap_QAS_ERS01
      
   sudo crm configure colocation col_sap_QAS_no_both -5000: g-QAS_ERS g-QAS_ASCS
   sudo crm configure location loc_sap_QAS_failover_to_ers rsc_sap_QAS_ASCS00 rule 2000: runs_ers_QAS eq 1
   sudo crm configure order ord_sap_QAS_first_start_ascs Optional: rsc_sap_QAS_ASCS00:start rsc_sap_QAS_ERS01:stop symmetrical=false

   sudo crm_attribute --delete --name priority-fencing-delay
      
   sudo crm node online anftstsapcl1
   sudo crm configure property maintenance-mode="false"
   ```

   SAP introduced support for enqueue server 2, including replication, as of SAP NW 7.52. Starting with ABAP Platform 1809, enqueue server 2 is installed by default. See SAP note [2630416](https://launchpad.support.sap.com/#/notes/2630416) for enqueue server 2 support.

   If using enqueue server 2 architecture ([ENSA2](https://help.sap.com/viewer/cff8531bc1d9416d91bb6781e628d4e0/1709%20001/en-US/6d655c383abf4c129b0e5c8683e7ecd8.html)), define the resources as follows:

   > [!NOTE]
   > If you have a two-node cluster running ENSA2, you have the option to configure priority-fencing-delay cluster property. This property introduces additional delay in fencing a node that has higher total resoure priority when a split-brain scenario occurs. For more information, see [SUSE Linux Enteprise Server high availability extension administration guide](https://documentation.suse.com/sle-ha/15-SP3/single-html/SLE-HA-administration/#pro-ha-storage-protect-fencing).
   >
   > The property priority-fencing-delay is only applicable for ENSA2 running on two-node cluster.

   ```bash
   sudo crm configure property maintenance-mode="true"

   sudo crm configure property priority-fencing-delay=30
      
   # If using NFSv3
   sudo crm configure primitive rsc_sap_QAS_ASCS00 SAPInstance \
       operations \$id=rsc_sap_QAS_ASCS00-operations \
       op monitor interval=11 timeout=60 on-fail=restart \
       params InstanceName=QAS_ASCS00_anftstsapvh START_PROFILE="/sapmnt/QAS/profile/QAS_ASCS00_anftstsapvh" \
       AUTOMATIC_RECOVER=false \
       meta resource-stickiness=5000 priority=100
      
   # If using NFSv4.1
   sudo crm configure primitive rsc_sap_QAS_ASCS00 SAPInstance \
       operations \$id=rsc_sap_QAS_ASCS00-operations \
       op monitor interval=11 timeout=105 on-fail=restart \
       params InstanceName=QAS_ASCS00_anftstsapvh START_PROFILE="/sapmnt/QAS/profile/QAS_ASCS00_anftstsapvh" \
       AUTOMATIC_RECOVER=false \
       meta resource-stickiness=5000 priority=100
      
   # If using NFSv3
   sudo crm configure primitive rsc_sap_QAS_ERS01 SAPInstance \
       operations \$id=rsc_sap_QAS_ERS01-operations \
       op monitor interval=11 timeout=60 on-fail=restart \
       params InstanceName=QAS_ERS01_anftstsapers START_PROFILE="/sapmnt/QAS/profile/QAS_ERS01_anftstsapers" AUTOMATIC_RECOVER=false IS_ERS=true
      
   # If using NFSv4.1
   sudo crm configure primitive rsc_sap_QAS_ERS01 SAPInstance \
       operations \$id=rsc_sap_QAS_ERS01-operations \
       op monitor interval=11 timeout=105 on-fail=restart \
       params InstanceName=QAS_ERS01_anftstsapers START_PROFILE="/sapmnt/QAS/profile/QAS_ERS01_anftstsapers" AUTOMATIC_RECOVER=false IS_ERS=true
      
   sudo crm configure modgroup g-QAS_ASCS add rsc_sap_QAS_ASCS00
   sudo crm configure modgroup g-QAS_ERS add rsc_sap_QAS_ERS01
      
   sudo crm configure colocation col_sap_QAS_no_both -5000: g-QAS_ERS g-QAS_ASCS
   sudo crm configure order ord_sap_QAS_first_start_ascs Optional: rsc_sap_QAS_ASCS00:start rsc_sap_QAS_ERS01:stop symmetrical=false
      
   sudo crm node online anftstsapcl1
   sudo crm configure property maintenance-mode="false"
   ```

   If you're upgrading from an older version and switching to enqueue server 2, see SAP note [2641019](https://launchpad.support.sap.com/#/notes/2641019).

> [!NOTE]
> The higher timeouts, suggested when using NFSv4.1 are necessary due to protocol-specific pause, related to NFSv4.1 lease renewals. For more information, see [NFS in NetApp Best practice](https://www.netapp.com/media/10720-tr-4067.pdf).
>
> The timeouts in the above configuration may need to be adapted to the specific SAP setup.

Make sure that the cluster status is ok and that all resources are started. It isn't important on which node the resources are running.

```bash
sudo crm_mon -r
  
# Full list of resources:
#
# stonith-sbd     (stonith:external/sbd): Started anftstsapcl2
#  Resource Group: g-QAS_ASCS
#      fs_QAS_ASCS        (ocf::heartbeat:Filesystem):    Started anftstsapcl1
#      nc_QAS_ASCS        (ocf::heartbeat:azure-lb):      Started anftstsapcl1
#      vip_QAS_ASCS       (ocf::heartbeat:IPaddr2):       Started anftstsapcl1
#      rsc_sap_QAS_ASCS00 (ocf::heartbeat:SAPInstance):   Started anftstsapcl1
#  Resource Group: g-QAS_ERS
#      fs_QAS_ERS (ocf::heartbeat:Filesystem):    Started anftstsapcl2
#      nc_QAS_ERS (ocf::heartbeat:azure-lb):      Started anftstsapcl2
#      vip_QAS_ERS        (ocf::heartbeat:IPaddr2):       Started anftstsapcl2
#      rsc_sap_QAS_ERS01  (ocf::heartbeat:SAPInstance):   Started anftstsapcl2
```

## SAP NetWeaver application server preparation

Some databases require that the database instance installation is executed on an application server. Prepare the application server virtual machines to be able to use them in these cases.

The steps bellow assume that you install the application server on a server different from the ASCS/SCS and HANA servers. Otherwise some of the steps below (like configuring host name resolution) aren't needed.

The following items are prefixed with either **[A]** - applicable to both PAS and AAS, **[P]** - only applicable to PAS or **[S]** - only applicable to AAS.

1. **[A]** Configure operating system

   Reduce the size of the dirty cache. For more information, see [Low write performance on SLES 11/12 servers with large RAM](https://www.suse.com/support/kb/doc/?id=7010287).

   ```bash
   sudo vi /etc/sysctl.conf
   
   # Change/set the following settings
   vm.dirty_bytes = 629145600
   vm.dirty_background_bytes = 314572800
   ```

1. **[A]** Setup host name resolution

   You can either use a DNS server or modify the /etc/hosts on all nodes. This example shows how to use the /etc/hosts file.
   Replace the IP address and the hostname in the following commands

   ```bash
   sudo vi /etc/hosts
   ```

   Insert the following lines to /etc/hosts. Change the IP address and hostname to match your environment

   ```text
   # IP address of the load balancer frontend configuration for SAP NetWeaver ASCS/SCS
   10.1.1.20 anftstsapvh
   # IP address of the load balancer frontend configuration for SAP NetWeaver ERS
   10.1.1.21 anftstsapers
   # IP address of all application servers
   10.1.1.15 anftstsapa01
   10.1.1.16 anftstsapa02
   ```

1. **[A]** Create the sapmnt directory

   ```bash
   sudo mkdir -p /sapmnt/QAS
   sudo mkdir -p /usr/sap/trans
   
   sudo chattr +i /sapmnt/QAS
   sudo chattr +i /usr/sap/trans
   ```

1. **[P]** Create the PAS directory

   ```bash
   sudo mkdir -p /usr/sap/QAS/D02
   sudo chattr +i /usr/sap/QAS/D02
   ```

1. **[S]** Create the AAS directory

   ```bash
   sudo mkdir -p /usr/sap/QAS/D03
   sudo chattr +i /usr/sap/QAS/D03
   ```

1. **[P]** Configure `autofs` on PAS

   ```bash
   sudo vi /etc/auto.master
   
   # Add the following line to the file, save and exit
   /- /etc/auto.direct
   ```

   If using NFSv3, create a new file with:

   ```bash
   sudo vi /etc/auto.direct
   
   # Add the following lines to the file, save and exit
   /sapmnt/QAS -nfsvers=3,nobind 10.1.0.4:/usrsapqas/sapmntQAS
   /usr/sap/trans -nfsvers=3,nobind 10.1.0.4:/trans
   /usr/sap/QAS/D02 -nfsvers=3,nobind 10.1.0.4:/usrsapqas/usrsapQASpas
   ```

   If using NFSv4.1, create a new file with:

   ```bash
   sudo vi /etc/auto.direct
   # Add the following lines to the file, save and exit
   /sapmnt/QAS -nfsvers=4.1,nobind,sec=sys 10.1.0.4:/usrsapqas/sapmntQAS
   /usr/sap/trans -nfsvers=4.1,nobind,sec=sys 10.1.0.4:/trans
   /usr/sap/QAS/D02 -nfsvers=4.1,nobind,sec=sys 10.1.0.4:/usrsapqas/usrsapQASpas
   ```

   Restart `autofs` to mount the new shares

   ```bash
   sudo systemctl enable autofs
   sudo service autofs restart
   ```

1. **[P]** Configure `autofs` on AAS

   ```bash
   sudo vi /etc/auto.master
   
   # Add the following line to the file, save and exit
   /- /etc/auto.direct
   ```

   If using NFSv3, create a new file with:

   ```bash
   sudo vi /etc/auto.direct
   
   # Add the following lines to the file, save and exit
   /sapmnt/QAS -nfsvers=3,nobind 10.1.0.4:/usrsapqas/sapmntQAS
   /usr/sap/trans -nfsvers=3,nobind 10.1.0.4:/trans
   /usr/sap/QAS/D03 -nfsvers=3,nobind 10.1.0.4:/usrsapqas/usrsapQASaas
   ```

   If using NFSv4.1, create a new file with:

   ```bash
   sudo vi /etc/auto.direct
   
   # Add the following lines to the file, save and exit
   /sapmnt/QAS -nfsvers=4.1,nobind,sec=sys 10.1.0.4:/usrsapqas/sapmntQAS
   /usr/sap/trans -nfsvers=4.1,nobind,sec=sys 10.1.0.4:/trans
   /usr/sap/QAS/D03 -nfsvers=4.1,nobind,sec=sys 10.1.0.4:/usrsapqas/usrsapQASaas
   ```

   Restart `autofs` to mount the new shares

   ```bash
   sudo systemctl enable autofs
   sudo service autofs restart
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

* Run the SAP database instance installation

   Install the SAP NetWeaver database instance as root using a virtual hostname that maps to the IP address of the load balancer frontend configuration for the database.

   You can use the sapinst parameter SAPINST_REMOTE_ACCESS_USER to allow a non-root user to connect to sapinst.

   ```bash
   sudo <swpm>/sapinst SAPINST_REMOTE_ACCESS_USER=sapadmin
   ```

## SAP NetWeaver application server installation

Follow these steps to install an SAP application server.

1. **[A]** Prepare application server
   Follow the steps in the chapter [SAP NetWeaver application server preparation](#sap-netweaver-application-server-preparation) above to prepare the application server.

2. **[A]** Install SAP NetWeaver application server
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

   This should list all entries and should look similar to

   ```text
   DATA FILE       : /home/qasadm/.hdb/anftstsapa01/SSFS_HDB.DAT
   KEY FILE        : /home/qasadm/.hdb/anftstsapa01/SSFS_HDB.KEY
   
   KEY DEFAULT
     ENV : 10.1.1.5:30313
     USER: SAPABAP1
     DATABASE: QAS
   ```

   The output shows that the IP address of the default entry is pointing to the virtual machine and not to the load balancer's IP address. This entry needs to be changed to point to the virtual hostname of the load balancer. Make sure to use the same port (**30313** in the output above) and database name (**QAS** in the output above)!

   ```bash
   su - qasadm
   
   hdbuserstore SET DEFAULT qasdb:30313@QAS SAPABAP1 <password of ABAP schema>
   ```

## Test the cluster setup

Thoroughly test your Pacemaker cluster. [Execute the typical failover tests](./high-availability-guide-suse.md#test-the-cluster-setup).

## Next steps

* [HA for SAP NW on Azure VMs on SLES for SAP applications multi-SID guide](./high-availability-guide-suse-multi-sid.md)
* [Azure Virtual Machines planning and implementation for SAP][planning-guide]
* [Azure Virtual Machines deployment for SAP][deployment-guide]
* [Azure Virtual Machines DBMS deployment for SAP][dbms-guide]
* To learn how to establish high availability and plan for disaster recovery of SAP HANA on Azure VMs, see [High Availability of SAP HANA on Azure Virtual Machines (VMs)][sap-hana-ha]
