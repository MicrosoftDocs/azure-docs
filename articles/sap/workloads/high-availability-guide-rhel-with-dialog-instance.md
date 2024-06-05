---
title: Deploy SAP dialog instances with SAP ASCS/SCS high-availability VMs on RHEL | Microsoft Docs
description: Configure SAP dialog instances on SAP ASCS/SCS high-availability VMs on RHEL.
services: virtual-machines-linux,virtual-network,storage
author: dennispadia
manager: rdeltcheva
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: tutorial
ms.date: 01/21/2024
ms.author: depadia
---

# Deploy SAP dialog instances with SAP ASCS/SCS high-availability VMs on RHEL

This article describes how to install and configure Primary Application Server (PAS) and Additional Application Server (AAS) dialog instances on the same ABAP SAP Central Services (ASCS)/SAP Central Services (SCS) high-availability cluster running on Red Hat Enterprise Linux (RHEL).

## References

* [Configuring SAP S/4HANA ASCS/ERS with Standalone Enqueue Server 2 (ENSA2) in Pacemaker](https://access.redhat.com/articles/3974941)
* [Configuring SAP NetWeaver ASCS/ERS ENSA1 with Standalone Resources in RHEL 7.5+ and RHEL 8](https://access.redhat.com/articles/3569681)
* SAP Note [1928533](https://launchpad.support.sap.com/#/notes/1928533), which has:
  * A list of Azure virtual machine (VM) sizes that are supported for the deployment of SAP software.
  * Important capacity information for Azure VM sizes.
  * Supported SAP software and operating system (OS) and database combinations.
  * Required SAP kernel version for Windows and Linux on Azure.
* SAP Note [2015553](https://launchpad.support.sap.com/#/notes/2015553) lists prerequisites for SAP-supported SAP software deployments in Azure.
* SAP Note [2002167](https://launchpad.support.sap.com/#/notes/2002167) lists the recommended OS settings for Red Hat Enterprise Linux 7.x.
* SAP Note [2772999](https://launchpad.support.sap.com/#/notes/2772999) lists the recommended OS settings for Red Hat Enterprise Linux 8.x.
* SAP Note [2009879](https://launchpad.support.sap.com/#/notes/2009879) has SAP HANA guidelines for Red Hat Enterprise Linux.
* SAP Note [2178632](https://launchpad.support.sap.com/#/notes/2178632) has detailed information about all monitoring metrics reported for SAP in Azure.
* SAP Note [2191498](https://launchpad.support.sap.com/#/notes/2191498) has the required SAP Host Agent version for Linux in Azure.
* SAP Note [2243692](https://launchpad.support.sap.com/#/notes/224362) has information about SAP licensing on Linux in Azure.
* SAP Note [1999351](https://launchpad.support.sap.com/#/notes/1999351) has more troubleshooting information for the Azure Enhanced Monitoring Extension for SAP.
* [SAP Community Wiki](https://wiki.scn.sap.com/wiki/display/HOME/SAPonLinuxNotes) has all required SAP Notes for Linux.
* [Azure Virtual Machines planning and implementation for SAP on Linux](planning-guide.md)
* [Azure Virtual Machines deployment for SAP on Linux](deployment-guide.md)
* [Azure Virtual Machines DBMS deployment for SAP on Linux](dbms-guide-general.md)
* [SAP Netweaver in Pacemaker cluster](https://access.redhat.com/articles/3150081)
* General RHEL documentation:
  * [High-Availability Add-On Overview](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/high_availability_add-on_overview/index)
  * [High-Availability Add-On Administration](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/high_availability_add-on_administration/index)
  * [High-Availability Add-On Reference](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/high_availability_add-on_reference/index)
* Azure-specific RHEL documentation:
  * [Support Policies for RHEL High-Availability Clusters - Microsoft Azure Virtual Machines as Cluster Members](https://access.redhat.com/articles/3131341)
  * [Installing and Configuring a Red Hat Enterprise Linux 7.4 (and later) High-Availability Cluster on Microsoft Azure](https://access.redhat.com/articles/3252491)

## Overview

This article describes the cost optimization scenario where you deploy PAS and AAS dialog instances with SAP ASCS/SCS and Enqueue Replication Server (ERS) instances in a high-availability setup. To minimize the number of VMs for a single SAP system, you want to install PAS and AAS on the same host where SAP ASCS/SCS and SAP ERS are running. With SAP ASCS/SCS being configured in a high-availability cluster setup, you want PAS and AAS also to be managed by cluster. The configuration is basically an addition to an already configured SAP ASCS/SCS cluster setup. In this setup, PAS and AAS are installed on a virtual host name, and its instance directory is managed by the cluster.

For this setup, PAS and AAS require a highly available instance directory (`/usr/sap/<SID>/D<nr>`). You can place the instance directory file system on the same high-available storage that you used for ASCS and ERS instance configuration. The presented architecture showcases [NFS on Azure Files](../../storage/files/files-nfs-protocol.md) or [Azure NetApp Files](../../azure-netapp-files/azure-netapp-files-introduction.md) for a highly available instance directory for the setup.

The example shown in this article to describe deployment uses the following system information:

| Instance name                       | Instance number | Virtual host name | Virtual IP (Probe port) |
| ----------------------------------- | --------------- | ---------------- | ----------------------- |
| ABAP SAP Central Services (ASCS)    | 00              | sapascs          | 10.90.90.10 (62000)     |
| Enqueue Replication Server (ERS)    | 01              | sapers           | 10.90.90.9 (62001)      |
| Primary Application Server (PAS)    | 02              | sappas           | 10.90.90.30 (62002)     |
| Additional Application Server (AAS) | 03              | sapers           | 10.90.90.31 (62003)     |
| SAP system identifier               | NW1             | ---              | ---                     |

> [!NOTE]
> Install more SAP application instances on separate VMs if you want to scale out.

![Diagram that shows the architecture of dialog instance installation with an SAP ASCS/SCS cluster.](media/high-availability-guide-rhel/high-availability-rhel-dialog-instance-architecture.png)

### Important considerations for the cost-optimization solution

* Only two dialog instances, PAS and one AAS, can be deployed with an SAP ASCS/SCS cluster setup.
* If you want to scale out your SAP system with more application servers (like **sapa03** and **sapa04**), you can install them in separate VMs. With PAS and AAS being installed on virtual host names, you can install more application servers by using either a physical or virtual host name in separate VMs. To learn more about how to assign a virtual host name to a VM, see the blog [Use SAP Virtual Host Names with Linux in Azure](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/use-sap-virtual-host-names-with-linux-in-azure/ba-p/3251593).
* With a PAS and AAS deployment with an SAP ASCS/SCS cluster setup, the instance numbers of ASCS, ERS, PAS, and AAS must be different.
* Consider sizing your VM SKUs appropriately based on the sizing guidelines. You must factor in the cluster behavior where multiple SAP instances (ASCS, ERS, PAS, and AAS) might run on a single VM when another VM in the cluster is unavailable.
* The dialog instances (PAS and AAS) running with an SAP ASCS/SCS cluster setup must be installed by using a virtual host name.
* You also must use the same storage solution of the SAP ASCS/SCS cluster setup to deploy PAS and AAS instances. For example, if you configured an SAP ASCS/SCS cluster by using NFS on Azure Files, the same storage solution must be used to deploy PAS and AAS.
* The instance directory `/usr/sap/<SID>/D<nr>` of PAS and AAS must be mounted on an NFS file system and are managed as a resource by the cluster.
  > [!NOTE]
  > For SAP J2EE systems, it's not supported to place `/usr/sap/<SID>/J<nr>` on NFS on Azure Files.
* To install more application servers on separate VMs, you can either use NFS shares or a local managed disk for an instance directory file system. If you're installing more application servers for an SAP J2EE system, `/usr/sap/<SID>/J<nr>` on NFS on Azure Files isn't supported.
* In a traditional SAP ASCS/SCS high-availability configuration, application server instances running on separate VMs aren't affected when there's any effect on SAP ASCS and ERS cluster nodes. But with the cost-optimization configuration, either the PAS or AAS instance restarts when there's an effect on one of the nodes in the cluster.
* See [NFS on Azure Files considerations](high-availability-guide-rhel-nfs-azure-files.md#important-considerations-for-nfs-on-azure-files-shares) and [Azure NetApp Files considerations](high-availability-guide-rhel-netapp-files.md#important-considerations) because the same considerations apply to this setup.

## Prerequisites

The configuration described in this article is an addition to your already configured SAP ASCS/SCS cluster setup. In this configuration, PAS and AAS are installed on a virtual host name, and its instance directory is managed by the cluster. Based on your storage, use the steps described in the following articles to configure the `SAPInstance` resource for the SAP ASCS and SAP ERS instance in the cluster.

* **NFS on Azure Files**: [Azure VMs high availability for SAP NW on RHEL with NFS on Azure Files](high-availability-guide-rhel-nfs-azure-files.md)
* **Azure NetApp Files**: [Azure VMs high availability for SAP NW on RHEL with Azure NetApp Files](high-availability-guide-rhel-netapp-files.md)

After you install the **ASCS**, **ERS**, and **Database** instance by using Software Provisioning Manager (SWPM), follow the next steps to install the PAS and AAS instances.

## Configure Azure Load Balancer for PAS and AAS

This article assumes that you already configured the load balancer for the SAP ASCS/SCS cluster setup as described in [Configure Azure Load Balancer](./high-availability-guide-rhel-nfs-azure-files.md#configure-azure-load-balancer). In the same Azure Load Balancer instance, follow these steps to create more front-end IPs and load-balancing rules for PAS and AAS.

1. Open the internal load balancer that was created for the SAP ASCS/SCS cluster setup.
1. **Frontend IP Configuration**: Create two front-end IPs, one for PAS and another for AAS (for example, **10.90.90.30** and **10.90.90.31**).
1. **Backend Pool**: This pool remains the same because we're deploying PAS and AAS on the same back-end pool.
1. **Inbound rules**: Create two load-balancing rules, one for PAS and another for AAS. Follow the same steps for both load-balancing rules.
1. **Frontend IP address**: Select the front-end IP.
   1. **Backend pool**: Select the back-end pool.
   1. **High availability ports**: Select this option.
   1. **Protocol**: Select **TCP**.
   1. **Health Probe**: Create a health probe with the following details (applies for both PAS and AAS):
      1. **Protocol**: Select **TCP**.
      1. **Port**: For example, **620<Instance-no.>** for PAS and **620<Instance-no.>** for AAS.
      1. **Interval**: Enter **5**.
      1. **Probe Threshold**: Enter **2**.
   1. **Idle timeout (minutes)**: Enter **30**.
   1. **Enable Floating IP**: Select this option.

The health probe configuration property `numberOfProbes`, otherwise known as **Unhealthy threshold** in the Azure portal, isn't respected. To control the number of successful or failed consecutive probes, set the property `probeThreshold` to `2`. It's currently not possible to set this property by using the Azure portal. Use either the [Azure CLI](/cli/azure/network/lb/probe) or the [PowerShell](/powershell/module/az.network/new-azloadbalancerprobeconfig) command.

> [!IMPORTANT]
> Floating IP isn't supported on a NIC secondary IP configuration in load-balancing scenarios. For more information, see [Azure Load Balancer limitations](../../load-balancer/load-balancer-multivip-overview.md#limitations). If you need more IP addresses for the VMs, deploy a second NIC.

When VMs without public IP addresses are placed in the back-end pool of an internal (no public IP address) Standard Azure Load Balancer instance, there's no outbound internet connectivity unless more configuration is performed to allow routing to public endpoints. For steps on how to achieve outbound connectivity, see [Public endpoint connectivity for virtual machines using Azure Standard Load Balancer in SAP high-availability scenarios](high-availability-guide-standard-load-balancer-outbound-connections.md).

> [!IMPORTANT]
> Don't enable TCP timestamps on Azure VMs placed behind Azure Load Balancer. Enabling TCP timestamps causes the health probes to fail. Set the parameter `net.ipv4.tcp_timestamps` to `0`. For more information, see [Load Balancer health probes](../../load-balancer/load-balancer-custom-probe-overview.md).

## Prepare servers for PAS and AAS installation

When steps in this document are marked with the following prefixes, they mean:

- **[A]**: Applicable to all nodes.
- **[1]**: Only applicable to node 1.
- **[2]**: Only applicable to node 2.

1. **[A]** Set up host name resolution.

   You can either use a DNS server or modify `/etc/hosts` on all nodes. This example shows how to use the `/etc/hosts` file. Replace the IP address and the host name in the following commands:

   ```bash
   sudo vi /etc/hosts
   
   # IP address of cluster node 1
   10.90.90.7    sap-cl1
   # IP address of cluster node 2
   10.90.90.8     sap-cl2
   # IP address of the load balancer frontend configuration for SAP Netweaver ASCS
   10.90.90.10   sapascs
   # IP address of the load balancer frontend configuration for SAP Netweaver ERS
   10.90.90.9    sapers
   # IP address of the load balancer frontend configuration for SAP Netweaver PAS
   10.90.90.30   sappas
   # IP address of the load balancer frontend configuration for SAP Netweaver AAS
   10.90.90.31   sapaas
   ```

1. **[1]** Create the SAP directories on the NFS share. Mount the NFS share **sapnw1** temporarily on one of the VMs, and create the SAP directories to be used as nested mount points.

   1. If you're using NFS on Azure Files:

      ```bash
      # mount temporarily the volume
      sudo mkdir -p /saptmp
      sudo mount -t nfs sapnfs.file.core.windows.net:/sapnfsafs/sapnw1 /saptmp -o noresvport,vers=4,minorversion=1,sec=sys
      
      # create the SAP directories
      sudo cd /saptmp
      sudo mkdir -p usrsapNW1D02
      sudo mkdir -p usrsapNW1D03
      
      # unmount the volume and delete the temporary directory
      cd ..
      sudo umount /saptmp
      sudo rmdir /saptmp
      ```

   1. If you're using Azure NetApp Files:

      ```bash
      # mount temporarily the volume
      sudo mkdir -p /saptmp
      
      # If using NFSv3
      sudo mount -t nfs -o rw,hard,rsize=65536,wsize=65536,vers=3,tcp 10.90.91.5:/sapnw1 /saptmp
      # If using NFSv4.1
      sudo mount -t nfs -o rw,hard,rsize=65536,wsize=65536,vers=4.1,sec=sys,tcp 10.90.91.5:/sapnw1 /saptmp
      
      # create the SAP directories
      sudo cd /saptmp
      sudo mkdir -p usrsapNW1D02
      sudo mkdir -p usrsapNW1D03
      
      # unmount the volume and delete the temporary directory
      sudo cd ..
      sudo umount /saptmp
      sudo rmdir /saptmp
      ```

1. **[A]** Create the shared directories.

   ```bash
   sudo mkdir -p /usr/sap/NW1/D02
   sudo mkdir -p /usr/sap/NW1/D03
   
   sudo chattr +i /usr/sap/NW1/D02
   sudo chattr +i /usr/sap/NW1/D03
   ```

1. **[A]** Configure swap space. When you install a dialog instance with central services, you must configure more swap space.

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
   #ResourceDisk.SwapSizeMB=2000
   ResourceDisk.SwapSizeMB=10480
   ```

   Restart the agent to activate the change.

   ```bash
   sudo service waagent restart
   ```

1. **[A]** Add firewall rules for PAS and AAS.

   ```bash
   # Probe and gateway port for PAS and AAS
   sudo firewall-cmd --zone=public --add-port={62002,62003,3302,3303}/tcp --permanent
   sudo firewall-cmd --zone=public --add-port={62002,62003,3303,3303}/tcp
   ```

## Install an SAP Netweaver PAS instance

1. **[1]** Check the status of the cluster. Before you configure a PAS resource for installation, make sure the ASCS and ERS resources are configured and started.

   ```bash
   sudo pcs status
   
   # Online: [ sap-cl1 sap-cl2 ]
   #
   # Full list of resources:
   #
   # rsc_st_azure    (stonith:fence_azure_arm):      Started sap-cl1
   #  Resource Group: g-NW1_ASCS
   #      fs_NW1_ASCS        (ocf::heartbeat:Filesystem):    Started sap-cl1
   #      nc_NW1_ASCS        (ocf::heartbeat:azure-lb):      Started sap-cl1
   #      vip_NW1_ASCS       (ocf::heartbeat:IPaddr2):       Started sap-cl1
   #      rsc_sap_NW1_ASCS00 (ocf::heartbeat:SAPInstance):   Started sap-cl1
   #  Resource Group: g-NW1_AERS
   #      fs_NW1_AERS        (ocf::heartbeat:Filesystem):    Started sap-cl2
   #      nc_NW1_AERS        (ocf::heartbeat:azure-lb):      Started sap-cl2
   #      vip_NW1_AERS       (ocf::heartbeat:IPaddr2):       Started sap-cl2
   #      rsc_sap_NW1_ERS01  (ocf::heartbeat:SAPInstance):   Started sap-cl2
   ```

1. **[1]** Create file system, virtual IP, and health probe resources for the PAS instance.

   ```bash
   sudo pcs node standby sap-cl2
   sudo pcs resource create vip_NW1_PAS IPaddr2 ip=10.90.90.30 --group g-NW1_PAS
   sudo pcs resource create nc_NW1_PAS azure-lb port=62002 --group g-NW1_PAS
   
   # If using NFS on Azure files
   sudo pcs resource create fs_NW1_PAS Filesystem device='sapnfs.file.core.windows.net:/sapnfsafs/sapnw1/usrsapNW1D02' \
     directory='/usr/sap/NW1/D02' fstype='nfs' force_unmount=safe options='noresvport,vers=4,minorversion=1,sec=sys' \
     op start interval=0 timeout=60 \
     op stop interval=0 timeout=120 \
     op monitor interval=200 timeout=40 \
     --group g-NW1_PAS
    
   # If using NFsv3 on Azure NetApp Files
   sudo pcs resource create fs_NW1_PAS Filesystem device='10.90.91.5:/sapnw1/usrsapNW1D02' \
     directory='/usr/sap/NW1/D02' fstype='nfs' force_unmount=safe \
     op start interval=0 timeout=60 \
     op stop interval=0 timeout=120 \ 
     op monitor interval=200 timeout=40 \
     --group g-NW1_PAS
   
   # If using NFSv4.1 on Azure NetApp Files
   sudo pcs resource create fs_NW1_PAS Filesystem device='10.90.91.5:/sapnw1/usrsapNW1D02' \
     directory='/usr/sap/NW1/D02' fstype='nfs' force_unmount=safe options='sec=sys,vers=4.1' \
     op start interval=0 timeout=60 \
     op stop interval=0 timeout=120 \
     op monitor interval=200 timeout=105 \
     --group g-NW1_PAS
   ```

   Make sure that the cluster status is okay and that all resources are started. It isn't important on which node the resources are running.

   ```bash
   sudo pcs status
   
   # Node List:
   #   Node sap-cl2: standby
   #   Online: [ sap-cl1 ]
   #
   # Full list of resources:
   #
   # rsc_st_azure    (stonith:fence_azure_arm):      Started sap-cl1
   #  Resource Group: g-NW1_ASCS
   #      fs_NW1_ASCS        (ocf::heartbeat:Filesystem):    Started sap-cl1
   #      nc_NW1_ASCS        (ocf::heartbeat:azure-lb):      Started sap-cl1
   #      vip_NW1_ASCS       (ocf::heartbeat:IPaddr2):       Started sap-cl1
   #      rsc_sap_NW1_ASCS00 (ocf::heartbeat:SAPInstance):   Started sap-cl1
   #  Resource Group: g-NW1_AERS
   #      fs_NW1_AERS        (ocf::heartbeat:Filesystem):    Started sap-cl1
   #      nc_NW1_AERS        (ocf::heartbeat:azure-lb):      Started sap-cl1
   #      vip_NW1_AERS       (ocf::heartbeat:IPaddr2):       Started sap-cl1
   #      rsc_sap_NW1_ERS01  (ocf::heartbeat:SAPInstance):   Started sap-cl1
   #  Resource Group: g-NW1_PAS:
   #      vip_NW1_PAS       (ocf::heartbeat:IPaddr2):        Started sap-cl1
   #      nc_NW1_PAS        (ocf::heartbeat:azure-lb):       Started sap-cl1
   #      fs_NW1_PAS        (ocf::heartbeat:Filesystem):     Started sap-cl1
   ```

1. **[1]** Change the ownership of the `/usr/sap/SID/D02` folder after the file system is mounted.

   ```bash
   sudo chown nw1adm:sapsys /usr/sap/NW1/D02
   ```

1. **[1]** Install the SAP Netweaver PAS.

   Install the SAP NetWeaver PAS as a root on the first node by using a virtual host name that maps to the IP address of the load balancer front-end configuration for the PAS. For example, use **sappas**, **10.90.90.30**, and the instance number that you used for the probe of the load balancer, for example **02**.

   You can use the sapinst parameter `SAPINST_REMOTE_ACCESS_USER` to allow a nonroot user to connect to sapinst.

   ```bash
   # Allow access to SWPM. This rule is not permanent. If you reboot the machine, you have to run the command again.
   sudo firewall-cmd --zone=public  --add-port=4237/tcp
   
   sudo <swpm>/sapinst SAPINST_REMOTE_ACCESS_USER=sapadmin SAPINST_USE_HOSTNAME=<pas_virtual_hostname>
   ```

1. Update the `/usr/sap/sapservices` file.

   To prevent the start of the instances by the sapinit startup script, all instances managed by Pacemaker must be commented out from the `/usr/sap/sapservices` file.

   ```bash
   sudo vi /usr/sap/sapservices
   
   # On the node where PAS is installed, comment out the following lines. 
   # LD_LIBRARY_PATH=/usr/sap/NW1/D02/exe:$LD_LIBRARY_PATH;export LD_LIBRARY_PATH;/usr/sap/NW1/D02/exe/sapstartsrv pf=/usr/sap/NW1/SYS/profile/NW1_D02_sappas -D -u nw1adm
   ```

1. **[1]** Create the PAS cluster resource.

   ```bash
   # If using NFS on Azure Files or NFSv3 on Azure NetApp Files
   pcs resource create rsc_sap_NW1_PAS02 SAPInstance InstanceName="NW1_D02_sappas" \
    START_PROFILE=/sapmnt/NW1/profile/NW1_D02_sappas \
    op monitor interval=20 timeout=60 \
    --group g-NW1_PAS
    
   # If using NFSv4.1 on Azure NetApp Files
   pcs resource create rsc_sap_NW1_PAS02 SAPInstance InstanceName="NW1_D02_sappas" \
    START_PROFILE=/sapmnt/NW1/profile/NW1_D02_sappas \
    op monitor interval=20 timeout=105 \
    --group g-NW1_PAS
   ```

   Check the status of the cluster.

   ```bash
   sudo pcs status
   
   # Node List:
   #   Node sap-cl2: standby
   #   Online: [ sap-cl1 ]
   #
   # Full list of resources:
   #
   # rsc_st_azure    (stonith:fence_azure_arm):      Started sap-cl1
   #  Resource Group: g-NW1_ASCS
   #      fs_NW1_ASCS        (ocf::heartbeat:Filesystem):    Started sap-cl1
   #      nc_NW1_ASCS        (ocf::heartbeat:azure-lb):      Started sap-cl1
   #      vip_NW1_ASCS       (ocf::heartbeat:IPaddr2):       Started sap-cl1
   #      rsc_sap_NW1_ASCS00 (ocf::heartbeat:SAPInstance):   Started sap-cl1
   #  Resource Group: g-NW1_AERS
   #      fs_NW1_AERS        (ocf::heartbeat:Filesystem):    Started sap-cl1
   #      nc_NW1_AERS        (ocf::heartbeat:azure-lb):      Started sap-cl1
   #      vip_NW1_AERS       (ocf::heartbeat:IPaddr2):       Started sap-cl1
   #      rsc_sap_NW1_ERS01  (ocf::heartbeat:SAPInstance):   Started sap-cl1
   #  Resource Group: g-NW1_PAS:
   #      vip_NW1_PAS       (ocf::heartbeat:IPaddr2):        Started sap-cl1
   #      nc_NW1_PAS        (ocf::heartbeat:azure-lb):       Started sap-cl1
   #      fs_NW1_PAS        (ocf::heartbeat:Filesystem):     Started sap-cl1
   #      rsc_sap_NW1_PAS02 (ocf::heartbeat:SAPInstance):    Started sap-cl1
   ```

1. Configure a constraint to start the PAS resource group only after the ASCS instance is started.

   ```bash
   sudo pcs constraint order g-NW1_ASCS then g-NW1_PAS kind=Optional symmetrical=false
   ```

## Install an SAP Netweaver AAS instance

1. **[2]** Check the status of the cluster. Before you configure an AAS resource for installation, make sure the ASCS, ERS, and PAS resources are started.

   ```bash
   sudo pcs status
   
   # Node List:
   #   Node sap-cl2: standby
   #   Online: [ sap-cl1 ]
   #
   # Full list of resources:
   #
   # rsc_st_azure    (stonith:fence_azure_arm):      Started sap-cl1
   #  Resource Group: g-NW1_ASCS
   #      fs_NW1_ASCS        (ocf::heartbeat:Filesystem):    Started sap-cl1
   #      nc_NW1_ASCS        (ocf::heartbeat:azure-lb):      Started sap-cl1
   #      vip_NW1_ASCS       (ocf::heartbeat:IPaddr2):       Started sap-cl1
   #      rsc_sap_NW1_ASCS00 (ocf::heartbeat:SAPInstance):   Started sap-cl1
   #  Resource Group: g-NW1_AERS
   #      fs_NW1_AERS        (ocf::heartbeat:Filesystem):    Started sap-cl1
   #      nc_NW1_AERS        (ocf::heartbeat:azure-lb):      Started sap-cl1
   #      vip_NW1_AERS       (ocf::heartbeat:IPaddr2):       Started sap-cl1
   #      rsc_sap_NW1_ERS01  (ocf::heartbeat:SAPInstance):   Started sap-cl1
   #  Resource Group: g-NW1_PAS:
   #      vip_NW1_PAS       (ocf::heartbeat:IPaddr2):        Started sap-cl1
   #      nc_NW1_PAS        (ocf::heartbeat:azure-lb):       Started sap-cl1
   #      fs_NW1_PAS        (ocf::heartbeat:Filesystem):     Started sap-cl1
   #      rsc_sap_NW1_PAS02 (ocf::heartbeat:SAPInstance):    Started sap-cl1
   ```

1. **[2]** Create file system, virtual IP, and health probe resources for the AAS instance.

   ```bash
   sudo pcs node unstandby sap-cl2
   # Disable PAS resource as it will fail on sap-cl2 due to missing environment variables like hdbuserstore. 
   sudo pcs resource disable g-NW1_PAS
   sudo pcs node standby sap-cl1
   # Execute below command to cleanup resource, if required
   pcs resource cleanup rsc_sap_NW1_ERS01
   
   sudo pcs resource create vip_NW1_AAS IPaddr2 ip=10.90.90.31 --group g-NW1_AAS
   sudo pcs resource create nc_NW1_AAS azure-lb port=62003 --group g-NW1_AAS
   
   # If using NFS on Azure files
   sudo pcs resource create fs_NW1_AAS Filesystem device='sapnfs.file.core.windows.net:/sapnfsafs/sapnw1/usrsapNW1D03' \
     directory='/usr/sap/NW1/D03' fstype='nfs' force_unmount=safe options='noresvport,vers=4,minorversion=1,sec=sys' \
     op start interval=0 timeout=60 \
     op stop interval=0 timeout=120 \
     op monitor interval=200 timeout=40 \
     --group g-NW1_AAS
    
   # If using NFsv3 on Azure NetApp Files
   sudo pcs resource create fs_NW1_AAS Filesystem device='10.90.91.5:/sapnw1/usrsapNW1D03' \
     directory='/usr/sap/NW1/D03' fstype='nfs' force_unmount=safe \
     op start interval=0 timeout=60 \
     op stop interval=0 timeout=120 \ 
     op monitor interval=200 timeout=40 \
     --group g-NW1_AAS
   
   # If using NFSv4.1 on Azure NetApp Files
   sudo pcs resource create fs_NW1_AAS Filesystem device='10.90.91.5:/sapnw1/usrsapNW1D03' \
     directory='/usr/sap/NW1/D03' fstype='nfs' force_unmount=safe options='sec=sys,vers=4.1' \
     op start interval=0 timeout=60 \
     op stop interval=0 timeout=120 \
     op monitor interval=200 timeout=105 \
     --group g-NW1_AAS
   ```

   Make sure that the cluster status is okay and that all resources are started. It isn't important on which node the resources are running. Because the g-NW1_PAS resource group is stopped, all the PAS resources are stopped in the (disabled) state.

   ```bash
   sudo pcs status
   
   # Node List:
   #   Node sap-cl1: standby
   #   Online: [ sap-cl2 ]
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
   #      fs_NW1_AERS        (ocf::heartbeat:Filesystem):    Started sap-cl2
   #      nc_NW1_AERS        (ocf::heartbeat:azure-lb):      Started sap-cl2
   #      vip_NW1_AERS       (ocf::heartbeat:IPaddr2):       Started sap-cl2
   #      rsc_sap_NW1_ERS01  (ocf::heartbeat:SAPInstance):   Started sap-cl2
   #  Resource Group: g-NW1_PAS:
   #      vip_NW1_PAS       (ocf::heartbeat:IPaddr2):        Stopped (disabled)
   #      nc_NW1_PAS        (ocf::heartbeat:azure-lb):       Stopped (disabled)
   #      fs_NW1_PAS        (ocf::heartbeat:Filesystem):     Stopped (disabled)
   #      rsc_sap_NW1_PAS02 (ocf::heartbeat:SAPInstance):    Stopped (disabled)
   #  Resource Group: g-NW1_AAS:
   #      vip_NW1_AAS       (ocf::heartbeat:IPaddr2):        Started sap-cl2
   #      nc_NW1_AAS        (ocf::heartbeat:azure-lb):       Started sap-cl2
   #      fs_NW1_AAS        (ocf::heartbeat:Filesystem):     Started sap-cl2
   ```

1. **[2]** Change the ownership of the `/usr/sap/SID/D03` folder after the file system is mounted.

   ```bash
   sudo chown nw1adm:sapsys /usr/sap/NW1/D03
   ```

1. **[2]** Install an SAP Netweaver AAS.

   Install an SAP NetWeaver AAS as the root on the second node by using a virtual host name that maps to the IP address of the load balancer front-end configuration for the PAS. For example, use **sapaas**, **10.90.90.31**, and the instance number that you used for the probe of the load balancer, for example, **03**.

   You can use the sapinst parameter `SAPINST_REMOTE_ACCESS_USER` to allow a nonroot user to connect to sapinst.

   ```bash
   # Allow access to SWPM. This rule is not permanent. If you reboot the machine, you have to run the command again.
   sudo firewall-cmd --zone=public  --add-port=4237/tcp
   
   sudo <swpm>/sapinst SAPINST_REMOTE_ACCESS_USER=sapadmin SAPINST_USE_HOSTNAME=<aas_virtual_hostname>
   ```

1. Update the `/usr/sap/sapservices` file.

   To prevent the start of the instances by the sapinit startup script, all instances managed by Pacemaker must be commented out from the `/usr/sap/sapservices` file.

   ```bash
   sudo vi /usr/sap/sapservices
   
   # On the node where AAS is installed, comment out the following lines. 
   #LD_LIBRARY_PATH=/usr/sap/NW1/D03/exe:$LD_LIBRARY_PATH;export LD_LIBRARY_PATH;/usr/sap/NW1/D03/exe/sapstartsrv pf=/usr/sap/NW1/SYS/profile/NW1_D03_sapaas -D -u nw1adm
   ```

1. **[2]** Create an AAS cluster resource.

   ```bash
   # If using NFS on Azure Files or NFSv3 on Azure NetApp Files
   pcs resource create rsc_sap_NW1_AAS03 SAPInstance InstanceName="NW1_D03_sapaas" \
    START_PROFILE=/sapmnt/NW1/profile/NW1_D03_sapaas \
    op monitor interval=120 timeout=60 \
    --group g-NW1_AAS
    
   # If using NFSv4.1 on Azure NetApp Files
   pcs resource create rsc_sap_NW1_AAS03 SAPInstance InstanceName="NW1_D03_sapaas" \
    START_PROFILE=/sapmnt/NW1/profile/NW1_D03_sapaas \
    op monitor interval=120 timeout=105 \
    --group g-NW1_AAS
   ```

   Check the status of the cluster.

   ```bash
   sudo pcs status
   
   # Node List:
   #   Node sap-cl1: standby
   #   Online: [ sap-cl2 ]
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
   #      fs_NW1_AERS        (ocf::heartbeat:Filesystem):    Started sap-cl2
   #      nc_NW1_AERS        (ocf::heartbeat:azure-lb):      Started sap-cl2
   #      vip_NW1_AERS       (ocf::heartbeat:IPaddr2):       Started sap-cl2
   #      rsc_sap_NW1_ERS01  (ocf::heartbeat:SAPInstance):   Started sap-cl2
   #  Resource Group: g-NW1_PAS:
   #      vip_NW1_PAS       (ocf::heartbeat:IPaddr2):        Stopped (disabled)
   #      nc_NW1_PAS        (ocf::heartbeat:azure-lb):       Stopped (disabled)
   #      fs_NW1_PAS        (ocf::heartbeat:Filesystem):     Stopped (disabled)
   #      rsc_sap_NW1_PAS02 (ocf::heartbeat:SAPInstance):    Stopped (disabled)
   #  Resource Group: g-NW1_AAS:
   #      vip_NW1_AAS       (ocf::heartbeat:IPaddr2):        Started sap-cl2
   #      nc_NW1_AAS        (ocf::heartbeat:azure-lb):       Started sap-cl2
   #      fs_NW1_AAS        (ocf::heartbeat:Filesystem):     Started sap-cl2
   #      rsc_sap_NW1_AAS03 (ocf::heartbeat:SAPInstance):    Started sap-cl2
   ```

1. Configure a constraint to start the AAS resource group only after the ASCS instance is started.

   ```bash
   sudo pcs constraint order g-NW1_ASCS then g-NW1_AAS kind=Optional symmetrical=false
   ```

## Post configuration for PAS and AAS instances

1. **[1]** For PAS and AAS to run on any cluster node (sap-cl1 or sap-cl2), the content in `$HOME/.hdb` of `<sid>adm` from both cluster nodes needs to be copied.

   ```bash
   # Check current content of /home/nw1adm/.hdb on sap-cl1
   sap-cl1:nw1adm > ls -ltr $HOME/.hdb
   drwx------. 2 nw1adm sapsys 66 Aug  8 19:11 sappas
   drwx------. 2 nw1adm sapsys 84 Aug  8 19:12 sap-cl1
   # Check current content of /home/nw1adm/.hdb on sap-cl2
   sap-cl2:nw1adm > ls -ltr $HOME/.hdb
   total 0
   drwx------. 2 nw1adm sapsys 64 Aug  8 20:25 sap-cl2
   drwx------. 2 nw1adm sapsys 66 Aug  8 20:26 sapaas
   
   # As PAS and AAS is installed using virtual hostname, you need to copy virtual hostname directory in /home/nw1adm/.hdb
   # Copy sappas directory from sap-cl1 to sap-cl2
   sap-cl1:nw1adm > scp -r sappas nw1adm@sap-cl2:/home/nw1adm/.hdb
   # Copy sapaas directory from sap-cl2 to sap-cl1. Execute the command from the same sap-cl1 host. 
   sap-cl1:nw1adm > scp -r nw1adm@sap-cl2:/home/nw1adm/.hdb/sapaas . 
   ```

1. **[1]** To ensure the PAS and AAS instances don't run on the same nodes whenever both nodes are running, add a negative colocation constraint with the following command:

   ```bash
   sudo pcs constraint colocation add g-NW1_AAS with g-NW1_PAS score=-1000
   sudo pcs node unstandby sap-cl1
   sudo pcs resource enable g-NW1_PAS
   ```

   The score of -1000 ensures that if only one node is available, both the instances continue to run on the other node. If you want to keep the AAS instance down in such a situation, you can use `score=-INFINITY` to enforce this condition.

1. Check the status of the cluster.

   ```bash
   sudo pcs status
   
   # Node List:
   #   Online: [ sap-cl1 sap-cl2 ]
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
   #  Resource Group: g-NW1_PAS:
   #      vip_NW1_PAS       (ocf::heartbeat:IPaddr2):        Started sap-cl1
   #      nc_NW1_PAS        (ocf::heartbeat:azure-lb):       Started sap-cl1
   #      fs_NW1_PAS        (ocf::heartbeat:Filesystem):     Started sap-cl1
   #      rsc_sap_NW1_PAS02 (ocf::heartbeat:SAPInstance):    Started sap-cl1
   #  Resource Group: g-NW1_AAS:
   #      vip_NW1_AAS       (ocf::heartbeat:IPaddr2):        Started sap-cl2
   #      nc_NW1_AAS        (ocf::heartbeat:azure-lb):       Started sap-cl2
   #      fs_NW1_AAS        (ocf::heartbeat:Filesystem):     Started sap-cl2
   #      rsc_sap_NW1_AAS03 (ocf::heartbeat:SAPInstance):    Started sap-cl2
   ```

## Test the cluster setup

Thoroughly test your Pacemaker cluster by running [the typical failover tests](high-availability-guide-rhel.md#test-the-cluster-setup).
