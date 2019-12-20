---
title: Azure VMs high availability for SAP NetWeaver on SLES multi-SID guide | Microsoft Docs
description: Multi-SID high-availability guide for SAP NetWeaver on SUSE Linux Enterprise Server for SAP applications
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
ms.date: 12/16/2019
ms.author: radeltch

---

# High availability for SAP NetWeaver on Azure VMs on SUSE Linux Enterprise Server for SAP applications multi-SID guide

[dbms-guide]:dbms-guide.md
[deployment-guide]:deployment-guide.md
[planning-guide]:planning-guide.md

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

This article describes how to deploy multiple SAP NetWeaver highly available systems(that is, multi-SID) in a two node cluster on Azure VMs with SUSE Linux Enterprise Server for SAP applications.  
In the example configurations, installation commands etc. three SAP NetWeaver 7.50 systems are deployed in a single, two node high availability cluster. The SAP systems SIDs are:
* **NW1**: ASCS instance number **00** and virtual host name **msnw1ascs**; ERS instance number **02** and virtual host name **msnw1ers**.  
* **NW2**: ASCS instance number **10** and virtual hostname **msnw2ascs**; ERS instance number **12** and virtual host name **msnw2ers**.  
* **NW3**: ASCS instance number **20** and virtual hostname **msnw3ascs**; ERS instance number **22** and virtual host name **msnw3ers**.  

The article doesn't cover the database layer and the deployment of the SAP NFS shares. 
In the examples in this article, we are using virtual names nw2-nfs for the NW2 NFS shares and nw3-nfs for the NW3 NFS shares, assuming that NFS cluster was deployed.  

Before you begin, refer to the following SAP Notes and papers first:

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
* [SUSE Support for multi-SID cluster](https://www.suse.com/c/sap-workloads-going-green/)

## Overview

The virtual machines, that participate in the cluster must be sized to be able to run all resources, in case failover occurs. Each SAP SID can fail over independent from each other in the multi-SID high availability cluster.  If using SBD fencing, the SBD devices can be shared between multiple clusters.  
To achieve high availability, SAP NetWeaver requires highly available NFS shares. In this example we assume the SAP NFS shares are either hosted on highly available [NFS file server](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-nfs), which can be used by multiple SAP systems. Or the shares are deployed on [Azure NetApp files NFS volumes](https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-create-volumes).  

![SAP NetWeaver High Availability overview](./media/high-availability-guide-suse/ha-suse-multi-sid.png)

> [!IMPORTANT]
> The support for multi-SID clustering of SAP ASCS/ERS with SUSE Linux as guest operating system in Azure VMs is limited to **five** SAP SIDs on the same cluster. Each new SID increases the complexity. A mix of SAP Enqueue Replication Server 1 and Enqueue Replication Server 2 on the same cluster is **not supported**. Multi-SID clustering describes the installation of multiple SAP ASCS/ERS instances with different SIDs in one Pacemaker cluster. Currently multi-SID clustering is only supported for ASCS/ERS.  

> [!TIP]
> The multi-SID clustering of SAP ASCS/ERS is a solution with higher complexity. It is more complex to implement. It also involves higher administrative effort, when executing maintenance activities (like OS patching). Before you start the actual implementation, take time to carefully plan out the deployment and all involved components like VMs, NFS mounts, VIPs, load balancer configurations and so on.  

The NFS server, SAP NetWeaver ASCS, SAP NetWeaver SCS, SAP NetWeaver ERS, and the SAP HANA database use virtual hostname and virtual IP addresses. On Azure, a load balancer is required to use a virtual IP address. We recommend using [Standard load balancer](https://docs.microsoft.com/azure/load-balancer/quickstart-load-balancer-standard-public-portal).  

The following list shows the configuration of the (A)SCS and ERS load balancer for this multi-SID cluster example with three SAP systems. You will need separate frontend IP, health probes, and load-balancing rules for each ASCS and ERS instance for each of the SIDs. Assign all VMs, that are part of the ASCS/ASCS cluster to one backend pool.  

### (A)SCS

* Frontend configuration
  * IP address for NW1:  10.3.1.14
  * IP address for NW2:  10.3.1.16
  * IP address for NW3:  10.3.1.13
* Backend configuration
  * Connected to primary network interfaces of all virtual machines that should be part of the (A)SCS/ERS cluster
* Probe Ports
  * Port 620<strong>&lt;nr&gt;</strong>, therefore for NW1, NW2, and NW3 probe ports 620**00**, 620**10** and 620**20**
* Load-balancing rules - 
* create one for each instance, that is, NW1/ASCS, NW2/ASCS and NW3/ASCS.
  * If using Standard Load Balancer, select **HA ports**
  * If using Basic Load Balancer, create Load balancing rules for the following ports
    * 32<strong>&lt;nr&gt;</strong> TCP
    * 36<strong>&lt;nr&gt;</strong> TCP
    * 39<strong>&lt;nr&gt;</strong> TCP
    * 81<strong>&lt;nr&gt;</strong> TCP
    * 5<strong>&lt;nr&gt;</strong>13 TCP
    * 5<strong>&lt;nr&gt;</strong>14 TCP
    * 5<strong>&lt;nr&gt;</strong>16 TCP

### ERS

* Frontend configuration
  * IP address for NW1 10.3.1.15
  * IP address for NW1 10.3.1.17
  * IP address for NW1 10.3.1.19
* Backend configuration
  * Connected to primary network interfaces of all virtual machines that should be part of the (A)SCS/ERS cluster
* Probe Port
  * Port 621<strong>&lt;nr&gt;</strong>, therefore for NW1, NW2, and N# probe ports 621**02**, 621**12** and 621**22**
* Load-balancing rules - create one for each instance, that is, NW1/ERS, NW2/ERS and NW3/ERS.
  * If using Standard Load Balancer, select **HA ports**
  * If using Basic Load Balancer, create Load balancing rules for the following ports
    * 32<strong>&lt;nr&gt;</strong> TCP
    * 33<strong>&lt;nr&gt;</strong> TCP
    * 5<strong>&lt;nr&gt;</strong>13 TCP
    * 5<strong>&lt;nr&gt;</strong>14 TCP
    * 5<strong>&lt;nr&gt;</strong>16 TCP


> [!Note]
> When VMs without public IP addresses are placed in the backend pool of internal (no public IP address) Standard Azure load balancer, there will be no outbound internet connectivity, unless additional configuration is performed to allow routing to public end points. For details on how to achieve outbound connectivity see [Public endpoint connectivity for Virtual Machines using Azure Standard Load Balancer in SAP high-availability scenarios](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-standard-load-balancer-outbound-connections).  

> [!IMPORTANT]
> Do not enable TCP timestamps on Azure VMs placed behind Azure Load Balancer. Enabling TCP timestamps will cause the health probes to fail. Set parameter **net.ipv4.tcp_timestamps** to **0**. For details see [Load Balancer health probes](https://docs.microsoft.com/azure/load-balancer/load-balancer-custom-probe-overview).

## SAP NFS shares

SAP NetWeaver requires shared storage for the transport, profile directory, and so on. For highly available SAP system, it is important to have highly available NFS shares. You will need to decide on the architecture for your SAP NFS shares. One option is to build [Highly available NFS cluster on Azure VMs on SUSE Linux Enterprise Server][nfs-ha], which can be shared between multiple SAP systems. 

Another option is to deploy the shares on [Azure NetApp files NFS volumes](https://docs.microsoft.com/azure/azure-netapp-files/azure-netapp-files-create-volumes).  With Azure NetApp Files, you will get built-in high availability for the SAP NFS shares.

## Deploy the first SAP system in the cluster

Now that you have decided on the architecture for the SAP NFS shares, deploy the first SAP system in the cluster, following the corresponding documentation.

* If using highly available NFS server, follow [High availability for SAP NetWeaver on Azure VMs on SUSE Linux Enterprise Server for SAP applications](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse).  
* If using Azure NetApp Files NFS volumes, follow [High availability for SAP NetWeaver on Azure VMs on SUSE Linux Enterprise Server with Azure NetApp Files for SAP applications](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-netapp-files)

The documents listed above will guide you through the steps to prepare the necessary infrastructures, build the cluster, prepare the  OS for running the SAP application.  

> [!TIP]
> Always test the fail over functionality of the cluster, after the first system is deployed, before adding the additional SAP SIDs to the cluster. That way you will know that the cluster functionality works, before adding the complexity of additional SAP systems to the cluster.   

## Deploy additional SAP systems in the cluster

In this example, we assume that system **NW1** was already deployed in the cluster. We will show how to deploy in the cluster SAP systems **NW2** and **NW3**. 

The following items are prefixed with either **[A]** - applicable to all nodes, **[1]** - only applicable to node 1 or **[2]** - only applicable to node 2.

### Prerequisites 

> [!IMPORTANT]
> Before following the instructions to deploy additional SAP systems in the cluster, follow the instructions to deploy the first SAP system in the cluster, as there are steps which are only necessary during the first system deployment.  

This documentation assumes that:
* The Pacemaker cluster is already configured and running.  
* At least one SAP system (ASCS / ERS instance) is already deployed and is running in the cluster.  
* The cluster fail over functionality has been tested.  
* The NFS shares for all SAP systems are deployed.  

### Prepare for SAP NetWeaver Installation

1. Add configuration for the newly deployed system (that is, **NW2**, **NW3**) to the existing Azure Load Balancer, following the instructions [Deploy Azure Load Balancer manually via Azure portal](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-netapp-files#deploy-azure-load-balancer-manually-via-azure-portal). Adjust the IP addresses, health probe ports, load-balancing rules for your configuration.  

2. **[A]** Set up name resolution for the additional SAP systems. You can either use DNS server or modify `/etc/hosts` on all nodes. This example shows how to use the `/etc/hosts` file.  Adapt the IP addresses and the host names to your environment. 

    <pre><code>
    sudo vi /etc/hosts
    # IP address of the load balancer frontend configuration for <b>NW2</b> ASCS
    <b>10.3.1.16 msnw2ascs</b>
    # IP address of the load balancer frontend configuration for <b>NW3</b> ASCS
    <b>10.3.1.13 msnw3ascs</b>
    # IP address of the load balancer frontend configuration for <b>NW2</b> ERS
    <b>10.3.1.17 msnw2ers</b>
    # IP address of the load balancer frontend configuration for <b>NW3</b> ERS
    <b>10.3.1.19 msnw3ers</b>
    # IP address for virtual host name for the NFS server for <b>NW2</b>
    <b>10.3.1.31 nw2-nfs</b>
    # IP address for virtual host name for the NFS server for <b>NW3</b>
    <b>10.3.1.32 nw3-nfs</b>
   </code></pre>

3. **[A]** Create the shared directories for the additional **NW2** and **NW3** SAP systems that you are deploying to the cluster. 

    <pre><code>
    sudo mkdir -p /sapmnt/<b>NW2</b>
    sudo mkdir -p /usr/sap/<b>NW2</b>/SYS
    sudo mkdir -p /usr/sap/<b>NW2</b>/ASCS<b>10</b>
    sudo mkdir -p /usr/sap/<b>NW2</b>/ERS<b>12</b>
    sudo mkdir -p /sapmnt/<b>NW3</b>
    sudo mkdir -p /usr/sap/<b>NW3</b>/SYS
    sudo mkdir -p /usr/sap/<b>NW3</b>/ASCS<b>20</b>
    sudo mkdir -p /usr/sap/<b>NW3</b>/ERS<b>22</b>

    
    sudo chattr +i /sapmnt/<b>NW2</b>
    sudo chattr +i /usr/sap/<b>NW2</b>/SYS
    sudo chattr +i /usr/sap/<b>NW2</b>/ASCS<b>10</b>
    sudo chattr +i /usr/sap/<b>NW2</b>/ERS<b>12</b>
    sudo chattr +i /sapmnt/<b>NW3</b>
    sudo chattr +i /usr/sap/<b>NW3</b>/SYS
    sudo chattr +i /usr/sap/<b>NW3</b>/ASCS<b>20</b>
    sudo chattr +i /usr/sap/<b>NW3</b>/ERS<b>22</b>
   </code></pre>

4. **[A]** Configure `autofs` to mount the /sapmnt/SID and /usr/sap/SID/SYS file systems for the additional SAP systems that you are deploying to the cluster. In this example **NW2** and **NW3**.  

   Update file `/etc/auto.direct` with the file systems for the additional SAP systems that you are deploying to the cluster.  

   * If using NFS file server, follow the instructions [here](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse#prepare-for-sap-netweaver-installation)
   * If using Azure NetApp Files, follow the instructions [here](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-netapp-files#prepare-for-sap-netweaver-installation) 

   You will need to restart the `autofs` service to mount the newly added shares.  

### Install ASCS / ERS

1. Create the virtual IP and health probe cluster resources for the ASCS instance of the additional SAP system you are deploying to the cluster. The example shown here is for **NW2** and **NW3** ASCS, using highly available NFS server.  

   > [!IMPORTANT]
   > Recent testing revealed situations, where netcat stops responding to requests due to backlog and its limitation of handling only one connection. The netcat resource stops listening to the Azure Load balancer requests and the floating IP becomes unavailable.  
   > For existing Pacemaker clusters, we recommend replacing netcat with socat, following the instructions in [Azure Load-Balancer Detection Hardening](https://www.suse.com/support/kb/doc/?id=7024128). Note that the change will require brief downtime.  

    <pre><code>
      sudo crm configure primitive fs_<b>NW2</b>_ASCS Filesystem device='<b>nw2-nfs</b>:/<b>NW2</b>/ASCS' directory='/usr/sap/<b>NW2</b>/ASCS<b>10</b>' fstype='nfs4' \
       op start timeout=60s interval=0 \
       op stop timeout=60s interval=0 \
       op monitor interval=20s timeout=40s
   
      sudo crm configure primitive vip_<b>NW2</b>_ASCS IPaddr2 \
        params ip=<b>10.3.1.16</b> cidr_netmask=<b>24</b> \
        op monitor interval=10 timeout=20
   
      sudo crm configure primitive nc_<b>NW2</b>_ASCS anything \
        params binfile="/usr/bin/socat" cmdline_options="-U TCP-LISTEN:620<b>10</b>,backlog=10,fork,reuseaddr /dev/null" \
        op monitor timeout=20s interval=10 depth=0
   
      sudo crm configure group g-<b>NW2</b>_ASCS fs_<b>NW2</b>_ASCS nc_<b>NW2</b>_ASCS vip_<b>NW2</b>_ASCS \
         meta resource-stickiness=3000

      sudo crm configure primitive fs_<b>NW3</b>_ASCS Filesystem device='<b>nw3-nfs</b>:/<b>NW3</b>/ASCS' directory='/usr/sap/<b>NW3</b>/ASCS<b>20</b>' fstype='nfs4' \
        op start timeout=60s interval=0 \
        op stop timeout=60s interval=0 \
        op monitor interval=20s timeout=40s
   
      sudo crm configure primitive vip_<b>NW3</b>_ASCS IPaddr2 \
       params ip=<b>10.3.1.13</b> cidr_netmask=<b>24</b> \
       op monitor interval=10 timeout=20
   
      sudo crm configure primitive nc_<b>NW3</b>_ASCS anything \
        params binfile="/usr/bin/socat" cmdline_options="-U TCP-LISTEN:620<b>20</b>,backlog=10,fork,reuseaddr /dev/null" \
        op monitor timeout=20s interval=10 depth=0
   
      sudo crm configure group g-<b>NW3</b>_ASCS fs_<b>NW3</b>_ASCS nc_<b>NW3</b>_ASCS vip_<b>NW3</b>_ASCS \
        meta resource-stickiness=3000
    </code></pre>

   As you creating the resources they may be assigned to different cluster resources. When you group them, they will migrate to one of the cluster nodes. Make sure the cluster status is ok and that all resources are started. It is not important on which node the resources are running.

2. **[1]** Install SAP NetWeaver ASCS  

   Install SAP NetWeaver ASCS as root, using a virtual hostname that maps to the IP address of the load balancer frontend configuration for the ASCS. For example, for system **NW2**, the virtual hostname is <b>msnw2ascs</b>, <b>10.3.1.16</b> and the instance number that you used for the probe of the load balancer, for example <b>10</b>. for system **NW3**, the virtual hostname is <b>msnw3ascs</b>, <b>10.3.1.13</b> and the instance number that you used for the probe of the load balancer, for example <b>20</b>.

   You can use the sapinst parameter SAPINST_REMOTE_ACCESS_USER to allow a non-root user to connect to sapinst. You can use parameter SAPINST_USE_HOSTNAME to install SAP, using virtual host name.  

     <pre><code>
      sudo &lt;swpm&gt;/sapinst SAPINST_REMOTE_ACCESS_USER=<b>sapadmin</b> SAPINST_USE_HOSTNAME=<b>virtual_hostname</b>
     </code></pre>

   If the installation fails to create a subfolder in /usr/sap/**SID**/ASCS**Instance#**, try setting the owner to **sid**adm and group to sapsys of the ASCS**Instance#** and retry.

3. **[1]** Create a virtual IP and health-probe cluster resources for the ERS instance of the additional SAP system you are deploying to the cluster. The example shown here is for **NW2** and **NW3** ERS, using highly available NFS server. 

   <pre><code>
    sudo crm configure primitive fs_<b>NW2</b>_ERS Filesystem device='<b>nw2-nfs</b>:/<b>NW2</b>/ASCSERS' directory='/usr/sap/<b>NW2</b>/ERS<b>12</b>' fstype='nfs4' \
      op start timeout=60s interval=0 \
      op stop timeout=60s interval=0 \
      op monitor interval=20s timeout=40s
   
    sudo crm configure primitive vip_<b>NW2</b>_ERS IPaddr2 \
      params ip=<b>10.3.1.17</b> cidr_netmask=<b>24</b> \
      op monitor interval=10 timeout=20
   
    sudo crm configure primitive nc_<b>NW2</b>_ERS anything \
     params binfile="/usr/bin/socat" cmdline_options="-U TCP-LISTEN:621<b>12</b>,backlog=10,fork,reuseaddr /dev/null" \
     op monitor timeout=20s interval=10 depth=0
   
    # WARNING: Resources nc_NW2_ASCS,nc_NW2_ERS violate uniqueness for parameter "binfile": "/usr/bin/socat"
    # Do you still want to commit (y/n)? y
   
    sudo crm configure group g-<b>NW2</b>_ERS fs_<b>NW2</b>_ERS nc_<b>NW2</b>_ERS vip_<b>NW2</b>_ERS

    sudo crm configure primitive fs_<b>NW3</b>_ERS Filesystem device='<b>nw3-nfs</b>:/<b>NW3</b>/ASCSERS' directory='/usr/sap/<b>NW3</b>/ERS<b>22</b>' fstype='nfs4' \
      op start timeout=60s interval=0 \
      op stop timeout=60s interval=0 \
      op monitor interval=20s timeout=40s
   
    sudo crm configure primitive vip_<b>NW3</b>_ERS IPaddr2 \
      params ip=<b>10.3.1.19</b> cidr_netmask=<b>24</b> \
      op monitor interval=10 timeout=20
   
    sudo crm configure primitive nc_<b>NW3</b>_ERS anything \
     params binfile="/usr/bin/socat" cmdline_options="-U TCP-LISTEN:621<b>22</b>,backlog=10,fork,reuseaddr /dev/null" \
     op monitor timeout=20s interval=10 depth=0
   
    # WARNING: Resources nc_NW3_ASCS,nc_NW3_ERS violate uniqueness for parameter "binfile": "/usr/bin/socat"
    # Do you still want to commit (y/n)? y
   
    sudo crm configure group g-<b>NW3</b>_ERS fs_<b>NW3</b>_ERS nc_<b>NW3</b>_ERS vip_<b>NW3</b>_ERS
   </code></pre>

   As you creating the resources they may be assigned to different cluster nodes. When you group them, they will migrate to one of the cluster nodes. Make sure the cluster status is ok and that all resources are started.  

   Next, make sure that the resources of the newly created ERS group, are running on the cluster node, opposite to the cluster node where the ASCS instance for the same SAP system was installed.  For example, if NW2 ASCS was installed on `slesmsscl1`, then make sure the NW2 ERS group is running on `slesmsscl2`.  You can migrate the  NW2 ERS group to `slesmsscl2` by running the following command: 

    <pre><code>
      crm resource migrate g-<b>NW2</b>_ERS <b>slesmsscl2</b> force
    </code></pre>

4. **[2]** Install SAP NetWeaver ERS

   Install SAP NetWeaver ERS as root on the other node, using a virtual hostname that maps to the IP address of the load balancer frontend configuration for the ERS. For example for system **NW2**, the virtual host name will be <b>msnw2ers</b>, <b>10.3.1.17</b> and the instance number that you used for the probe of the load balancer, for example <b>12</b>. For system **NW3**, the virtual host name <b>msnw3ers</b>, <b>10.3.1.19</b> and the instance number that you used for the probe of the load balancer, for example <b>22</b>. 

   You can use the sapinst parameter SAPINST_REMOTE_ACCESS_USER to allow a non-root user to connect to sapinst. You can use parameter SAPINST_USE_HOSTNAME to install SAP, using virtual host name.  

    <pre><code>
     sudo &lt;swpm&gt;/sapinst SAPINST_REMOTE_ACCESS_USER=<b>sapadmin</b> SAPINST_USE_HOSTNAME=<b>virtual_hostname</b>
    </code></pre>

   > [!NOTE]
   > Use SWPM SP 20 PL 05 or higher. Lower versions do not set the permissions correctly and the installation will fail.

   If the installation fails to create a subfolder in /usr/sap/**NW2**/ERS**Instance#**, try setting the owner to **sid**adm and the group to sapsys of the ERS**Instance#** folder and retry.

   If it was necessary for you to migrate the ERS group of the newly deployed SAP system to a different cluster node, don't forget to remove the location constraint for the ERS group. You can remove the constraint by running the following command (the example is given for SAP systems **NW2** and **NW3**).  

    <pre><code>
      crm resource unmigrate g-<b>NW2</b>_ERS
      crm resource unmigrate g-<b>NW3</b>_ERS
    </code></pre>

5. **[1]** Adapt the ASCS/SCS and ERS instance profiles for the newly installed SAP system(s). The example shown below is for NW2. You will need to adapt the ASCS/SCS and ERS profiles for all SAP instances added to the cluster.  
 
 * ASCS/SCS profile

   <pre><code>sudo vi /sapmnt/<b>NW2</b>/profile/<b>NW2</b>_<b>ASCS10</b>_<b>msnw2ascs</b>
   
   # Change the restart command to a start command
   #Restart_Program_01 = local $(_EN) pf=$(_PF)
   Start_Program_01 = local $(_EN) pf=$(_PF)
   
   # Add the following lines
   service/halib = $(DIR_CT_RUN)/saphascriptco.so
   service/halib_cluster_connector = /usr/bin/sap_suse_cluster_connector
   
   # Add the keep alive parameter
   enque/encni/set_so_keepalive = true
   </code></pre>

 * ERS profile

   <pre><code>sudo vi /sapmnt/<b>NW2</b>/profile/<b>NW2</b>_ERS<b>12</b>_<b>msnw2ers</b>
   
   # Change the restart command to a start command
   #Restart_Program_00 = local $(_ER) pf=$(_PFL) NR=$(SCSID)
   Start_Program_00 = local $(_ER) pf=$(_PFL) NR=$(SCSID)
   
   # Add the following lines
   service/halib = $(DIR_CT_RUN)/saphascriptco.so
   service/halib_cluster_connector = /usr/bin/sap_suse_cluster_connector
   
   # remove Autostart from ERS profile
   # Autostart = 1
   </code></pre>

6. **[A]** Configure the SAP users for the newly deployed SAP system, in this example **NW2** and **NW3**. 

   <pre><code># Add sidadm to the haclient group
   sudo usermod -aG haclient <b>nw2</b>adm
   sudo usermod -aG haclient <b>nw3</b>adm
   </code></pre>

7. Add the ASCS and ERS SAP services for the newly installed SAP system to the `sapservice` file. The example shown below is for SAP systems **NW2** and **NW3**.  

   Add the ASCS service entry to the second node and copy the ERS service entry to the first node. Execute the commands for each SAP system on the node, where the ASCS instance for the SAP system was installed.  

    <pre><code>
     # Execute the following commands on <b>slesmsscl1</b>,assuming the NW2 ASCS instance was installed on <b>slesmsscl1</b>
     cat /usr/sap/sapservices | grep ASCS<b>10</b> | sudo ssh <b>slesmsscl2</b> "cat >>/usr/sap/sapservices"
     sudo ssh <b>slesmsscl2</b> "cat /usr/sap/sapservices" | grep ERS<b>12</b> | sudo tee -a /usr/sap/sapservices
     # Execute the following commands on <b>slesmsscl2</b>, assuming the NW3 ASCS instance was installed on <b>slesmsscl2</b>
     cat /usr/sap/sapservices | grep ASCS<b>20</b> | sudo ssh <b>slesmsscl1</b> "cat >>/usr/sap/sapservices"
     sudo ssh <b>slesmsscl1</b> "cat /usr/sap/sapservices" | grep ERS<b>22</b> | sudo tee -a /usr/sap/sapservices
    </code></pre>

8. **[1]** Create the SAP cluster resources for the newly installed SAP system. 

   The example shown here is for SAP systems **NW2** and **NW3**, assuming that it is using enqueue server 1 architecture (ENSA1):

    <pre><code>
     sudo crm configure property maintenance-mode="true"
    
     sudo crm configure primitive rsc_sap_<b>NW2</b>_ASCS<b>10</b> SAPInstance \
      operations \$id=rsc_sap_<b>NW2</b>_ASCS<b>10</b>-operations \
      op monitor interval=11 timeout=60 on_fail=restart \
      params InstanceName=<b>NW2</b>_ASCS<b>10</b>_<b>msnw2ascs</b> START_PROFILE="/sapmnt/<b>NW2</b>/profile/<b>NW2</b>_ASCS<b>10</b>_<b>msnw2ascs</b>" \
      AUTOMATIC_RECOVER=false \
      meta resource-stickiness=5000 failure-timeout=60 migration-threshold=1 priority=10
    
     sudo crm configure primitive rsc_sap_<b>NW2</b>_ERS<b>12</b> SAPInstance \
      operations \$id=rsc_sap_<b>NW2</b>_ERS<b>12</b>-operations \
      op monitor interval=11 timeout=60 on_fail=restart \
      params InstanceName=<b>NW2</b>_ERS<b>12</b>_<b>msnw2ers</b> START_PROFILE="/sapmnt/<b>NW2</b>/profile/<b>NW2</b>_ERS<b>12</b>_<b>msnw2ers</b>" AUTOMATIC_RECOVER=false IS_ERS=true \
      meta priority=1000
    
     sudo crm configure modgroup g-<b>NW2</b>_ASCS add rsc_sap_<b>NW2</b>_ASCS<b>10</b>
     sudo crm configure modgroup g-<b>NW2</b>_ERS add rsc_sap_<b>NW2</b>_ERS<b>12</b>
    
     sudo crm configure colocation col_sap_<b>NW2</b>_no_both -5000: g-<b>NW2</b>_ERS g-<b>NW2</b>_ASCS
     sudo crm configure location loc_sap_<b>NW2</b>_failover_to_ers rsc_sap_<b>NW2</b>_ASCS<b>10</b> rule 2000: runs_ers_<b>NW2</b> eq 1
     sudo crm configure order ord_sap_<b>NW2</b>_first_start_ascs Optional: rsc_sap_<b>NW2</b>_ASCS<b>10</b>:start rsc_sap_<b>NW2</b>_ERS<b>12</b>:stop symmetrical=false
   
     sudo crm configure primitive rsc_sap_<b>NW3</b>_ASCS<b>20</b> SAPInstance \
      operations \$id=rsc_sap_<b>NW3</b>_ASCS<b>20</b>-operations \
      op monitor interval=11 timeout=60 on_fail=restart \
      params InstanceName=<b>NW3</b>_ASCS<b>10</b>_<b>msnw3ascs</b> START_PROFILE="/sapmnt/<b>NW3</b>/profile/<b>NW3</b>_ASCS<b>20</b>_<b>msnw3ascs</b>" \
      AUTOMATIC_RECOVER=false \
      meta resource-stickiness=5000 failure-timeout=60 migration-threshold=1 priority=10
    
     sudo crm configure primitive rsc_sap_<b>NW3</b>_ERS<b>22</b> SAPInstance \
      operations \$id=rsc_sap_<b>NW3</b>_ERS<b>22</b>-operations \
      op monitor interval=11 timeout=60 on_fail=restart \
      params InstanceName=<b>NW3</b>_ERS<b>22</b>_<b>msnw3ers</b> START_PROFILE="/sapmnt/<b>NW3</b>/profile/<b>NW3</b>_ERS<b>22</b>_<b>msnw2ers</b>" AUTOMATIC_RECOVER=false IS_ERS=true \
      meta priority=1000
    
     sudo crm configure modgroup g-<b>NW3</b>_ASCS add rsc_sap_<b>NW3</b>_ASCS<b>20</b>
     sudo crm configure modgroup g-<b>NW3</b>_ERS add rsc_sap_<b>NW3</b>_ERS<b>22</b>
    
     sudo crm configure colocation col_sap_<b>NW3</b>_no_both -5000: g-<b>NW3</b>_ERS g-<b>NW3</b>_ASCS
     sudo crm configure location loc_sap_<b>NW3</b>_failover_to_ers rsc_sap_<b>NW3</b>_ASCS<b>10</b> rule 2000: runs_ers_<b>NW3</b> eq 1
     sudo crm configure order ord_sap_<b>NW3</b>_first_start_ascs Optional: rsc_sap_<b>NW3</b>_ASCS<b>20</b>:start rsc_sap_<b>NW3</b>_ERS<b>22</b>:stop symmetrical=false
     sudo crm configure property maintenance-mode="false"
    </code></pre>

   Make sure that the cluster status is ok and that all resources are started. It is not important on which node the resources are running.
   The following example shows the cluster resources status, after SAP systems **NW2** and **NW3** were added to the cluster. 

    <pre><code>
     sudo crm_mon -r
    
    # Online: [ slesmsscl1 slesmsscl2 ]
    
    #Full list of resources:
    
    #stonith-sbd     (stonith:external/sbd): Started <b>slesmsscl1</b>
    # Resource Group: g-NW1_ASCS
    #     fs_NW1_ASCS        (ocf::heartbeat:Filesystem):    <b>Started slesmsscl2</b>
    #     nc_NW1_ASCS        (ocf::heartbeat:anything):      <b>Started slesmsscl2</b>
    #     vip_NW1_ASCS       (ocf::heartbeat:IPaddr2):       <b>Started slesmsscl2</b>
    #     rsc_sap_NW1_ASCS00 (ocf::heartbeat:SAPInstance):   <b>Started slesmsscl2</b>
    # Resource Group: g-NW1_ERS
    #     fs_NW1_ERS (ocf::heartbeat:Filesystem):    <b>Started slesmsscl1</b>
    #     nc_NW1_ERS (ocf::heartbeat:anything):      <b>Started slesmsscl1</b>
    #     vip_NW1_ERS        (ocf::heartbeat:IPaddr2):       <b>Started slesmsscl1</b>
    #     rsc_sap_NW1_ERS02  (ocf::heartbeat:SAPInstance):   <b>Started slesmsscl1</b>
    # Resource Group: g-NW2_ASCS
    #     fs_NW2_ASCS        (ocf::heartbeat:Filesystem):    <b>Started slesmsscl1</b>
    #     nc_NW2_ASCS        (ocf::heartbeat:anything):      <b>Started slesmsscl1</b>
    #     vip_NW2_ASCS       (ocf::heartbeat:IPaddr2):       <b>Started slesmsscl1</b>
    #     rsc_sap_NW2_ASCS10 (ocf::heartbeat:SAPInstance):   <b>Started slesmsscl1</b>
    # Resource Group: g-NW2_ERS
    #     fs_NW2_ERS (ocf::heartbeat:Filesystem):    <b>Started slesmsscl2</b>
    #     nc_NW2_ERS (ocf::heartbeat:anything):      <b>Started slesmsscl2</b>
    #     vip_NW2_ERS        (ocf::heartbeat:IPaddr2):       <b>Started slesmsscl2</b>
    #     rsc_sap_NW2_ERS12  (ocf::heartbeat:SAPInstance):   <b>Started slesmsscl2</b>
    # Resource Group: g-NW3_ASCS
    #     fs_NW3_ASCS        (ocf::heartbeat:Filesystem):    <b>Started slesmsscl1</b>
    #     nc_NW3_ASCS        (ocf::heartbeat:anything):      <b>Started slesmsscl1</b>
    #     vip_NW3_ASCS       (ocf::heartbeat:IPaddr2):       <b>Started slesmsscl1</b>
    #     rsc_sap_NW3_ASCS20 (ocf::heartbeat:SAPInstance):   <b>Started slesmsscl1</b>
    # Resource Group: g-NW3_ERS
    #     fs_NW3_ERS (ocf::heartbeat:Filesystem):    <b>Started slesmsscl2</b>
    #     nc_NW3_ERS (ocf::heartbeat:anything):      <b>Started slesmsscl2</b>
    #     vip_NW3_ERS        (ocf::heartbeat:IPaddr2):       <b>Started slesmsscl2</b>
    #     rsc_sap_NW3_ERS22  (ocf::heartbeat:SAPInstance):   <b>Started slesmsscl2</b>
    </code></pre>

   The following picture shows how the resources would look like in the HA Web Konsole(Hawk), with the resources for SAP system **NW2** expanded.  

![SAP NetWeaver High Availability overview](./media/high-availability-guide-suse/ha-suse-multi-sid-hawk.png)

### Proceed with the SAP installation 

Complete your SAP installation by:

* [Preparing your SAP NetWeaver application servers](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse#2d6008b0-685d-426c-b59e-6cd281fd45d7)
* [Installing a DBMS instance](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse#install-database)
* [Installing A primary SAP application server](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse#sap-netweaver-application-server-installation)
* Installing one or more additional SAP application instances

## Test the multi-SID cluster setup

The following tests are a subset of the test cases in the best practices guides of SUSE. They are included for your convenience. For the full list of cluster tests, reference the following documentation:

* If using highly available NFS server, follow [High availability for SAP NetWeaver on Azure VMs on SUSE Linux Enterprise Server for SAP applications](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse).  
* If using Azure NetApp Files NFS volumes, follow [High availability for SAP NetWeaver on Azure VMs on SUSE Linux Enterprise Server with Azure NetApp Files for SAP applications](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse-netapp-files)

Always read the SUSE best practices guides and perform all additional tests that might have been added.  
The tests that are presented are in a two node, multi-SID cluster with three SAP systems installed.  

1. Test HAGetFailoverConfig and HACheckFailoverConfig

   Run the following commands as <sapsid>adm on the node where the ASCS instance is currently running. If the commands fail with FAIL: Insufficient memory, it might be caused by dashes in your hostname. This is a known issue and will be fixed by SUSE in the sap-suse-cluster-connector package.

   <pre><code>
    slesmsscl1:nw1adm 57> sapcontrol -nr 00 -function HAGetFailoverConfig

   # 10.12.2019 21:33:08
   # HAGetFailoverConfig
   # OK
   # HAActive: TRUE
   # HAProductVersion: SUSE Linux Enterprise Server for SAP Applications 12 SP4
   # HASAPInterfaceVersion: SUSE Linux Enterprise Server for SAP Applications 12 SP4 (sap_suse_cluster_connector 3.1.0)
   # HADocumentation: https://www.suse.com/products/sles-for-sap/resource-library/sap-best-practices/
   # HAActiveNode: slesmsscl1
   # HANodes: slesmsscl1, slesmsscl2

    slesmsscl1:nw1adm 53> sapcontrol -nr 00 -function HACheckFailoverConfig

    # 19.12.2019 21:19:58
    # HACheckFailoverConfig
    # OK
    # state, category, description, comment
    # SUCCESS, SAP CONFIGURATION, SAPInstance RA sufficient version, SAPInstance includes is-ers patch

    slesmsscl2:nw2adm 35> sapcontrol -nr 10 -function HAGetFailoverConfig

   # 10.12.2019 21:37:09
   # HAGetFailoverConfig
   # OK
   # HAActive: TRUE
   # HAProductVersion: SUSE Linux Enterprise Server for SAP Applications 12 SP4
   # HASAPInterfaceVersion: SUSE Linux Enterprise Server for SAP Applications 12 SP4 (sap_suse_cluster_connector 3.1.0)
   # HADocumentation: https://www.suse.com/products/sles-for-sap/resource-library/sap-best-practices/
   # HAActiveNode: slesmsscl2
   # HANodes: slesmsscl2, slesmsscl1

    slesmsscl2:nw2adm 52> sapcontrol -nr 10 -function HACheckFailoverConfig

    # 19.12.2019 21:17:39
    # HACheckFailoverConfig
    # OK
    # state, category, description, comment
    # SUCCESS, SAP CONFIGURATION, SAPInstance RA sufficient version, SAPInstance includes is-ers patch

    slesmsscl1:nw3adm 49> sapcontrol -nr 20 -function HAGetFailoverConfig

   # 10.12.2019 23:35:36
   # HAGetFailoverConfig
   # OK
   # HAActive: TRUE
   # HAProductVersion: SUSE Linux Enterprise Server for SAP Applications 12 SP4
   # HASAPInterfaceVersion: SUSE Linux Enterprise Server for SAP Applications 12 SP4 (sap_suse_cluster_connector 3.1.0)
   # HADocumentation: https://www.suse.com/products/sles-for-sap/resource-library/sap-best-practices/
   # HAActiveNode: slesmsscl1
   # HANodes: slesmsscl1, slesmsscl2

    slesmsscl1:nw3adm 52> sapcontrol -nr 20 -function HACheckFailoverConfig

    # 19.12.2019 21:10:42
    # HACheckFailoverConfig
    # OK
    # state, category, description, comment
    # SUCCESS, SAP CONFIGURATION, SAPInstance RA sufficient version, SAPInstance includes is-ers patch
   </code></pre>

2. Manually migrate the ASCS instance. The example shows migrating the ASCS instance for SAP system NW2.  
   Resource state, before starting the test:
   <pre><code>
    Full list of resources:
    stonith-sbd     (stonith:external/sbd): Started slesmsscl1
     Resource Group: g-NW1_ASCS
         fs_NW1_ASCS        (ocf::heartbeat:Filesystem):    Started slesmsscl1
         nc_NW1_ASCS        (ocf::heartbeat:anything):      Started slesmsscl1
         vip_NW1_ASCS       (ocf::heartbeat:IPaddr2):       Started slesmsscl1
         rsc_sap_NW1_ASCS00 (ocf::heartbeat:SAPInstance):   Started slesmsscl1
     Resource Group: g-NW1_ERS
         fs_NW1_ERS (ocf::heartbeat:Filesystem):    Started slesmsscl2
         nc_NW1_ERS (ocf::heartbeat:anything):      Started slesmsscl2
         vip_NW1_ERS        (ocf::heartbeat:IPaddr2):       Started slesmsscl2
         rsc_sap_NW1_ERS02  (ocf::heartbeat:SAPInstance):   Started slesmsscl2
     Resource Group: g-NW2_ASCS
         fs_NW2_ASCS        (ocf::heartbeat:Filesystem):    Started slesmsscl1
         nc_NW2_ASCS        (ocf::heartbeat:anything):      Started slesmsscl1
         vip_NW2_ASCS       (ocf::heartbeat:IPaddr2):       Started slesmsscl1
         rsc_sap_NW2_ASCS10 (ocf::heartbeat:SAPInstance):   Started slesmsscl1
     Resource Group: g-NW2_ERS
         fs_NW2_ERS (ocf::heartbeat:Filesystem):    Started slesmsscl2
         nc_NW2_ERS (ocf::heartbeat:anything):      Started slesmsscl2
         vip_NW2_ERS        (ocf::heartbeat:IPaddr2):       Started slesmsscl2
         rsc_sap_NW2_ERS12  (ocf::heartbeat:SAPInstance):   Started slesmsscl2
     Resource Group: g-NW3_ASCS
         fs_NW3_ASCS        (ocf::heartbeat:Filesystem):    Started slesmsscl2
         nc_NW3_ASCS        (ocf::heartbeat:anything):      Started slesmsscl2
         vip_NW3_ASCS       (ocf::heartbeat:IPaddr2):       Started slesmsscl2
         rsc_sap_NW3_ASCS20 (ocf::heartbeat:SAPInstance):   Started slesmsscl2
     Resource Group: g-NW3_ERS
         fs_NW3_ERS (ocf::heartbeat:Filesystem):    Started slesmsscl1
         nc_NW3_ERS (ocf::heartbeat:anything):      Started slesmsscl1
         vip_NW3_ERS        (ocf::heartbeat:IPaddr2):       Started slesmsscl1
         rsc_sap_NW3_ERS22  (ocf::heartbeat:SAPInstance):   Started slesmsscl1
   </code></pre>

   Run the following commands as root to migrate the NW2 ASCS instance.

   <pre><code>
    crm resource migrate rsc_sap_NW2_ASCS10 force
    # INFO: Move constraint created for rsc_sap_NW2_ASCS10
    
    crm resource unmigrate rsc_sap_NW2_ASCS10
   # INFO: Removed migration constraints for rsc_sap_NW2_ASCS10
   
   # Remove failed actions for the ERS that occurred as part of the migration
    crm resource cleanup rsc_sap_NW2_ERS12
   </code></pre>

   Resource state after the test:

   <pre><code>stonith-sbd     (stonith:external/sbd): Started nw1-cl-0
    Full list of resources:
    stonith-sbd     (stonith:external/sbd): Started slesmsscl1
     Resource Group: g-NW1_ASCS
         fs_NW1_ASCS        (ocf::heartbeat:Filesystem):    Started slesmsscl1
         nc_NW1_ASCS        (ocf::heartbeat:anything):      Started slesmsscl1
         vip_NW1_ASCS       (ocf::heartbeat:IPaddr2):       Started slesmsscl1
         rsc_sap_NW1_ASCS00 (ocf::heartbeat:SAPInstance):   Started slesmsscl1
     Resource Group: g-NW1_ERS
         fs_NW1_ERS (ocf::heartbeat:Filesystem):    Started slesmsscl2
         nc_NW1_ERS (ocf::heartbeat:anything):      Started slesmsscl2
         vip_NW1_ERS        (ocf::heartbeat:IPaddr2):       Started slesmsscl2
         rsc_sap_NW1_ERS02  (ocf::heartbeat:SAPInstance):   Started slesmsscl2
     Resource Group: g-NW2_ASCS
         fs_NW2_ASCS        (ocf::heartbeat:Filesystem):    Started slesmsscl2
         nc_NW2_ASCS        (ocf::heartbeat:anything):      Started slesmsscl2
         vip_NW2_ASCS       (ocf::heartbeat:IPaddr2):       Started slesmsscl2
         rsc_sap_NW2_ASCS10 (ocf::heartbeat:SAPInstance):   Started slesmsscl2
     Resource Group: g-NW2_ERS
         fs_NW2_ERS (ocf::heartbeat:Filesystem):    Started slesmsscl1
         nc_NW2_ERS (ocf::heartbeat:anything):      Started slesmsscl1
         vip_NW2_ERS        (ocf::heartbeat:IPaddr2):       Started slesmsscl1
         rsc_sap_NW2_ERS12  (ocf::heartbeat:SAPInstance):   Started slesmsscl1
     Resource Group: g-NW3_ASCS
         fs_NW3_ASCS        (ocf::heartbeat:Filesystem):    Started slesmsscl2
         nc_NW3_ASCS        (ocf::heartbeat:anything):      Started slesmsscl2
         vip_NW3_ASCS       (ocf::heartbeat:IPaddr2):       Started slesmsscl2
         rsc_sap_NW3_ASCS20 (ocf::heartbeat:SAPInstance):   Started slesmsscl2
     Resource Group: g-NW3_ERS
         fs_NW3_ERS (ocf::heartbeat:Filesystem):    Started slesmsscl1
         nc_NW3_ERS (ocf::heartbeat:anything):      Started slesmsscl1
         vip_NW3_ERS        (ocf::heartbeat:IPaddr2):       Started slesmsscl1
         rsc_sap_NW3_ERS22  (ocf::heartbeat:SAPInstance):   Started slesmsscl1
   </code></pre>

1. Test HAFailoverToNode. The test presented here shows migrating the ASCS instance for SAP system NW2.  

   Resource state before starting the test:

   <pre><code>
    Full list of resources:
    stonith-sbd     (stonith:external/sbd): Started slesmsscl1
     Resource Group: g-NW1_ASCS
         fs_NW1_ASCS        (ocf::heartbeat:Filesystem):    Started slesmsscl1
         nc_NW1_ASCS        (ocf::heartbeat:anything):      Started slesmsscl1
         vip_NW1_ASCS       (ocf::heartbeat:IPaddr2):       Started slesmsscl1
         rsc_sap_NW1_ASCS00 (ocf::heartbeat:SAPInstance):   Started slesmsscl1
     Resource Group: g-NW1_ERS
         fs_NW1_ERS (ocf::heartbeat:Filesystem):    Started slesmsscl2
         nc_NW1_ERS (ocf::heartbeat:anything):      Started slesmsscl2
         vip_NW1_ERS        (ocf::heartbeat:IPaddr2):       Started slesmsscl2
         rsc_sap_NW1_ERS02  (ocf::heartbeat:SAPInstance):   Started slesmsscl2
     Resource Group: g-NW2_ASCS
         fs_NW2_ASCS        (ocf::heartbeat:Filesystem):    Started slesmsscl2
         nc_NW2_ASCS        (ocf::heartbeat:anything):      Started slesmsscl2
         vip_NW2_ASCS       (ocf::heartbeat:IPaddr2):       Started slesmsscl2
         rsc_sap_NW2_ASCS10 (ocf::heartbeat:SAPInstance):   Started slesmsscl2
     Resource Group: g-NW2_ERS
         fs_NW2_ERS (ocf::heartbeat:Filesystem):    Started slesmsscl1
         nc_NW2_ERS (ocf::heartbeat:anything):      Started slesmsscl1
         vip_NW2_ERS        (ocf::heartbeat:IPaddr2):       Started slesmsscl1
         rsc_sap_NW2_ERS12  (ocf::heartbeat:SAPInstance):   Started slesmsscl1
     Resource Group: g-NW3_ASCS
         fs_NW3_ASCS        (ocf::heartbeat:Filesystem):    Started slesmsscl2
         nc_NW3_ASCS        (ocf::heartbeat:anything):      Started slesmsscl2
         vip_NW3_ASCS       (ocf::heartbeat:IPaddr2):       Started slesmsscl2
         rsc_sap_NW3_ASCS20 (ocf::heartbeat:SAPInstance):   Started slesmsscl2
     Resource Group: g-NW3_ERS
         fs_NW3_ERS (ocf::heartbeat:Filesystem):    Started slesmsscl1
         nc_NW3_ERS (ocf::heartbeat:anything):      Started slesmsscl1
         vip_NW3_ERS        (ocf::heartbeat:IPaddr2):       Started slesmsscl1
         rsc_sap_NW3_ERS22  (ocf::heartbeat:SAPInstance):   Started slesmsscl1
   </code></pre>

   Run the following commands as **nw2**adm to migrate the NW2 ASCS instance.

   <pre><code>
    slesmsscl2:nw2adm 53> sapcontrol -nr 10 -host msnw2ascs -user nw2adm &lt;password&gt; -function HAFailoverToNode ""
   
   # run as root
   # Remove failed actions for the ERS that occurred as part of the migration
   nw1-cl-0:~ # crm resource cleanup rsc_sap_NW2_ERS12
   # Remove migration constraints
   nw1-cl-0:~ # crm resource clear rsc_sap_NW2_ASCS10
   #INFO: Removed migration constraints for rsc_sap_NW2_ASCS10
   </code></pre>

   Resource state after the test:

   <pre><code>
    Full list of resources:
    stonith-sbd     (stonith:external/sbd): Started slesmsscl1
     Resource Group: g-NW1_ASCS
         fs_NW1_ASCS        (ocf::heartbeat:Filesystem):    Started slesmsscl1
         nc_NW1_ASCS        (ocf::heartbeat:anything):      Started slesmsscl1
         vip_NW1_ASCS       (ocf::heartbeat:IPaddr2):       Started slesmsscl1
         rsc_sap_NW1_ASCS00 (ocf::heartbeat:SAPInstance):   Started slesmsscl1
     Resource Group: g-NW1_ERS
         fs_NW1_ERS (ocf::heartbeat:Filesystem):    Started slesmsscl2
         nc_NW1_ERS (ocf::heartbeat:anything):      Started slesmsscl2
         vip_NW1_ERS        (ocf::heartbeat:IPaddr2):       Started slesmsscl2
         rsc_sap_NW1_ERS02  (ocf::heartbeat:SAPInstance):   Started slesmsscl2
     Resource Group: g-NW2_ASCS
         fs_NW2_ASCS        (ocf::heartbeat:Filesystem):    Started slesmsscl1
         nc_NW2_ASCS        (ocf::heartbeat:anything):      Started slesmsscl1
         vip_NW2_ASCS       (ocf::heartbeat:IPaddr2):       Started slesmsscl1
         rsc_sap_NW2_ASCS10 (ocf::heartbeat:SAPInstance):   Started slesmsscl1
     Resource Group: g-NW2_ERS
         fs_NW2_ERS (ocf::heartbeat:Filesystem):    Started slesmsscl2
         nc_NW2_ERS (ocf::heartbeat:anything):      Started slesmsscl2
         vip_NW2_ERS        (ocf::heartbeat:IPaddr2):       Started slesmsscl2
         rsc_sap_NW2_ERS12  (ocf::heartbeat:SAPInstance):   Started slesmsscl2
     Resource Group: g-NW3_ASCS
         fs_NW3_ASCS        (ocf::heartbeat:Filesystem):    Started slesmsscl2
         nc_NW3_ASCS        (ocf::heartbeat:anything):      Started slesmsscl2
         vip_NW3_ASCS       (ocf::heartbeat:IPaddr2):       Started slesmsscl2
         rsc_sap_NW3_ASCS20 (ocf::heartbeat:SAPInstance):   Started slesmsscl2
     Resource Group: g-NW3_ERS
         fs_NW3_ERS (ocf::heartbeat:Filesystem):    Started slesmsscl1
         nc_NW3_ERS (ocf::heartbeat:anything):      Started slesmsscl1
         vip_NW3_ERS        (ocf::heartbeat:IPaddr2):       Started slesmsscl1
         rsc_sap_NW3_ERS22  (ocf::heartbeat:SAPInstance):   Started slesmsscl1
   </code></pre>

1. Simulate node crash

   Resource state before starting the test:

   <pre><code>
    Full list of resources:
    stonith-sbd     (stonith:external/sbd): Started slesmsscl1
     Resource Group: g-NW1_ASCS
         fs_NW1_ASCS        (ocf::heartbeat:Filesystem):    Started slesmsscl2
         nc_NW1_ASCS        (ocf::heartbeat:anything):      Started slesmsscl2
         vip_NW1_ASCS       (ocf::heartbeat:IPaddr2):       Started slesmsscl2
         rsc_sap_NW1_ASCS00 (ocf::heartbeat:SAPInstance):   Started slesmsscl2
     Resource Group: g-NW1_ERS
         fs_NW1_ERS (ocf::heartbeat:Filesystem):    Started slesmsscl1
         nc_NW1_ERS (ocf::heartbeat:anything):      Started slesmsscl1
         vip_NW1_ERS        (ocf::heartbeat:IPaddr2):       Started slesmsscl1
         rsc_sap_NW1_ERS02  (ocf::heartbeat:SAPInstance):   Started slesmsscl1
     Resource Group: g-NW2_ASCS
         fs_NW2_ASCS        (ocf::heartbeat:Filesystem):    Started slesmsscl2
         nc_NW2_ASCS        (ocf::heartbeat:anything):      Started slesmsscl2
         vip_NW2_ASCS       (ocf::heartbeat:IPaddr2):       Started slesmsscl2
         rsc_sap_NW2_ASCS10 (ocf::heartbeat:SAPInstance):   Started slesmsscl2
     Resource Group: g-NW2_ERS
         fs_NW2_ERS (ocf::heartbeat:Filesystem):    Started slesmsscl1
         nc_NW2_ERS (ocf::heartbeat:anything):      Started slesmsscl1
         vip_NW2_ERS        (ocf::heartbeat:IPaddr2):       Started slesmsscl1
         rsc_sap_NW2_ERS12  (ocf::heartbeat:SAPInstance):   Started slesmsscl1
     Resource Group: g-NW3_ASCS
         fs_NW3_ASCS        (ocf::heartbeat:Filesystem):    Started slesmsscl2
         nc_NW3_ASCS        (ocf::heartbeat:anything):      Started slesmsscl2
         vip_NW3_ASCS       (ocf::heartbeat:IPaddr2):       Started slesmsscl2
         rsc_sap_NW3_ASCS20 (ocf::heartbeat:SAPInstance):   Started slesmsscl2
     Resource Group: g-NW3_ERS
         fs_NW3_ERS (ocf::heartbeat:Filesystem):    Started slesmsscl1
         nc_NW3_ERS (ocf::heartbeat:anything):      Started slesmsscl1
         vip_NW3_ERS        (ocf::heartbeat:IPaddr2):       Started slesmsscl1
         rsc_sap_NW3_ERS22  (ocf::heartbeat:SAPInstance):   Started slesmsscl1
   </code></pre>

   Run the following command as root on the node where at least one ASCS instance is running. In this example, we executed the command on `slesmsscl2`, where the ASCS instances for NW1 and NW3 are running.  

   <pre><code>
    slesmsscl2:~ # echo b > /proc/sysrq-trigger
   </code></pre>

   If you use SBD, Pacemaker should not automatically start on the killed node. The status after the node is started again should look like this.

   <pre><code>
    Online: [ slesmsscl1 ]
    OFFLINE: [ slesmsscl2 ]
    Full list of resources:

    stonith-sbd     (stonith:external/sbd): Started slesmsscl1
     Resource Group: g-NW1_ASCS
         fs_NW1_ASCS        (ocf::heartbeat:Filesystem):    Started slesmsscl1
         nc_NW1_ASCS        (ocf::heartbeat:anything):      Started slesmsscl1
         vip_NW1_ASCS       (ocf::heartbeat:IPaddr2):       Started slesmsscl1
         rsc_sap_NW1_ASCS00 (ocf::heartbeat:SAPInstance):   Started slesmsscl1
     Resource Group: g-NW1_ERS
         fs_NW1_ERS (ocf::heartbeat:Filesystem):    Started slesmsscl1
         nc_NW1_ERS (ocf::heartbeat:anything):      Started slesmsscl1
         vip_NW1_ERS        (ocf::heartbeat:IPaddr2):       Started slesmsscl1
         rsc_sap_NW1_ERS02  (ocf::heartbeat:SAPInstance):   Started slesmsscl1
     Resource Group: g-NW2_ASCS
         fs_NW2_ASCS        (ocf::heartbeat:Filesystem):    Started slesmsscl1
         nc_NW2_ASCS        (ocf::heartbeat:anything):      Started slesmsscl1
         vip_NW2_ASCS       (ocf::heartbeat:IPaddr2):       Started slesmsscl1
         rsc_sap_NW2_ASCS10 (ocf::heartbeat:SAPInstance):   Started slesmsscl1
     Resource Group: g-NW2_ERS
         fs_NW2_ERS (ocf::heartbeat:Filesystem):    Started slesmsscl1
         nc_NW2_ERS (ocf::heartbeat:anything):      Started slesmsscl1
         vip_NW2_ERS        (ocf::heartbeat:IPaddr2):       Started slesmsscl1
         rsc_sap_NW2_ERS12  (ocf::heartbeat:SAPInstance):   Started slesmsscl1
     Resource Group: g-NW3_ASCS
         fs_NW3_ASCS        (ocf::heartbeat:Filesystem):    Started slesmsscl1
         nc_NW3_ASCS        (ocf::heartbeat:anything):      Started slesmsscl1
         vip_NW3_ASCS       (ocf::heartbeat:IPaddr2):       Started slesmsscl1
         rsc_sap_NW3_ASCS20 (ocf::heartbeat:SAPInstance):   Started slesmsscl1
     Resource Group: g-NW3_ERS
         fs_NW3_ERS (ocf::heartbeat:Filesystem):    Started slesmsscl1
         nc_NW3_ERS (ocf::heartbeat:anything):      Started slesmsscl1
         vip_NW3_ERS        (ocf::heartbeat:IPaddr2):       Started slesmsscl1
         rsc_sap_NW3_ERS22  (ocf::heartbeat:SAPInstance):   Started slesmsscl1
    
    Failed Resource Actions:
    * rsc_sap_NW1_ERS02_monitor_11000 on slesmsscl1 'not running' (7): call=125, status=complete, exitreason='',
        last-rc-change='Fri Dec 13 19:32:10 2019', queued=0ms, exec=0ms
    * rsc_sap_NW2_ERS12_monitor_11000 on slesmsscl1 'not running' (7): call=126, status=complete, exitreason='',
        last-rc-change='Fri Dec 13 19:32:10 2019', queued=0ms, exec=0ms
    * rsc_sap_NW3_ERS22_monitor_11000 on slesmsscl1 'not running' (7): call=127, status=complete, exitreason='',
        last-rc-change='Fri Dec 13 19:32:10 2019', queued=0ms, exec=0ms
   </code></pre>

   Use the following commands to start Pacemaker on the killed node, clean the SBD messages, and clean the failed resources.

   <pre><code># run as root
   # list the SBD device(s)
   slesmsscl2:~ # cat /etc/sysconfig/sbd | grep SBD_DEVICE=
   # SBD_DEVICE="/dev/disk/by-id/scsi-36001405772fe8401e6240c985857e116;/dev/disk/by-id/scsi-36001405034a84428af24ddd8c3a3e9e1;/dev/disk/by-id/scsi-36001405cdd5ac8d40e548449318510c3"
   
   slesmsscl2:~ # sbd -d /dev/disk/by-id/scsi-36001405772fe8401e6240c985857e116 -d /dev/disk/by-id/scsi-36001405034a84428af24ddd8c3a3e9e1 -d /dev/disk/by-id/scsi-36001405cdd5ac8d40e548449318510c3 message slesmsscl2 clear
   
   slesmsscl2:~ # systemctl start pacemaker
   slesmsscl2:~ # crm resource cleanup rsc_sap_NW1_ERS02
   slesmsscl2:~ # crm resource cleanup rsc_sap_NW2_ERS12
   slesmsscl2:~ # crm resource cleanup rsc_sap_NW3_ERS22
   </code></pre>

   Resource state after the test:

   <pre><code>
    Full list of resources:
    stonith-sbd     (stonith:external/sbd): Started slesmsscl1
     Resource Group: g-NW1_ASCS
         fs_NW1_ASCS        (ocf::heartbeat:Filesystem):    Started slesmsscl1
         nc_NW1_ASCS        (ocf::heartbeat:anything):      Started slesmsscl1
         vip_NW1_ASCS       (ocf::heartbeat:IPaddr2):       Started slesmsscl1
         rsc_sap_NW1_ASCS00 (ocf::heartbeat:SAPInstance):   Started slesmsscl1
     Resource Group: g-NW1_ERS
         fs_NW1_ERS (ocf::heartbeat:Filesystem):    Started slesmsscl2
         nc_NW1_ERS (ocf::heartbeat:anything):      Started slesmsscl2
         vip_NW1_ERS        (ocf::heartbeat:IPaddr2):       Started slesmsscl2
         rsc_sap_NW1_ERS02  (ocf::heartbeat:SAPInstance):   Started slesmsscl2
     Resource Group: g-NW2_ASCS
         fs_NW2_ASCS        (ocf::heartbeat:Filesystem):    Started slesmsscl1
         nc_NW2_ASCS        (ocf::heartbeat:anything):      Started slesmsscl1
         vip_NW2_ASCS       (ocf::heartbeat:IPaddr2):       Started slesmsscl1
         rsc_sap_NW2_ASCS10 (ocf::heartbeat:SAPInstance):   Started slesmsscl1
     Resource Group: g-NW2_ERS
         fs_NW2_ERS (ocf::heartbeat:Filesystem):    Started slesmsscl2
         nc_NW2_ERS (ocf::heartbeat:anything):      Started slesmsscl2
         vip_NW2_ERS        (ocf::heartbeat:IPaddr2):       Started slesmsscl2
         rsc_sap_NW2_ERS12  (ocf::heartbeat:SAPInstance):   Started slesmsscl2
     Resource Group: g-NW3_ASCS
         fs_NW3_ASCS        (ocf::heartbeat:Filesystem):    Started slesmsscl1
         nc_NW3_ASCS        (ocf::heartbeat:anything):      Started slesmsscl1
         vip_NW3_ASCS       (ocf::heartbeat:IPaddr2):       Started slesmsscl1
         rsc_sap_NW3_ASCS20 (ocf::heartbeat:SAPInstance):   Started slesmsscl1
     Resource Group: g-NW3_ERS
         fs_NW3_ERS (ocf::heartbeat:Filesystem):    Started slesmsscl2
         nc_NW3_ERS (ocf::heartbeat:anything):      Started slesmsscl2
         vip_NW3_ERS        (ocf::heartbeat:IPaddr2):       Started slesmsscl2
         rsc_sap_NW3_ERS22  (ocf::heartbeat:SAPInstance):   Started slesmsscl2
   </code></pre>

## Next steps

* [Azure Virtual Machines planning and implementation for SAP][planning-guide]
* [Azure Virtual Machines deployment for SAP][deployment-guide]
* [Azure Virtual Machines DBMS deployment for SAP][dbms-guide]
* To learn how to establish high availability and plan for disaster recovery of SAP HANA on Azure (large instances), see [SAP HANA (large instances) high availability and disaster recovery on Azure](hana-overview-high-availability-disaster-recovery.md).
* To learn how to establish high availability and plan for disaster recovery of SAP HANA on Azure VMs, see [High Availability of SAP HANA on Azure Virtual Machines (VMs)][sap-hana-ha]
