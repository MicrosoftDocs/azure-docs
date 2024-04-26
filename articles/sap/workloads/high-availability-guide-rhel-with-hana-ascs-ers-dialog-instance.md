---
title: Deploy SAP ASCS/SCS and SAP ERS with SAP HANA high-availability VMs on RHEL | Microsoft Docs
description: Configure SAP ASCS/SCS and SAP ERS with SAP HANA high-availability VMs on RHEL.
services: virtual-machines-linux,virtual-network,storage
author: apmsft
manager: juergent
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: tutorial
ms.date: 08/16/2022
ms.author: ampatel
---

# Deploy SAP ASCS/ERS with SAP HANA high-availability VMs on RHEL

This article describes how to install and configure SAP HANA along with ABAP SAP Central Services (ASCS)/SAP Central Services (SCS) and Enqueue Replication Server (ERS) instances on the same high-availability cluster running on Red Hat Enterprise Linux (RHEL).

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
  * [High Availability Add-On Reference](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/high_availability_add-on_reference/index)
* Azure-specific RHEL documentation:
  * [Support Policies for RHEL High-Availability Clusters - Microsoft Azure Virtual Machines as Cluster Members](https://access.redhat.com/articles/3131341)
  * [Installing and Configuring a Red Hat Enterprise Linux 7.4 (and later) High-Availability Cluster on Microsoft Azure](https://access.redhat.com/articles/3252491)

## Overview

This article describes the cost-optimization scenario where you deploy SAP HANA, SAP ASCS/SCS, and SAP ERS instances in the same high-availability setup. To minimize the number of VMs for a single SAP system, you want to install SAP ASCS/SCS and SAP ERS on the same hosts where SAP HANA is running. With SAP HANA being configured in a high-availability cluster setup, you want SAP ASCS/SCS and SAP ERS also to be managed by cluster. The configuration is basically an addition to an already configured SAP HANA cluster setup. In this setup, SAP ASCS/SCS and SAP ERS are installed on a virtual host name, and its instance directory is managed by the cluster.

The presented architecture showcases [NFS on Azure Files](../../storage/files/files-nfs-protocol.md) or [Azure NetApp Files](../../azure-netapp-files/azure-netapp-files-introduction.md) for a highly available instance directory for the setup.

The example shown in this article to describe deployment uses the following system information:

| Instance name                       | Instance number | Virtual host name | Virtual IP (Probe port) |
| ----------------------------------- | --------------- | ---------------- | ----------------------- |
| SAP HANA DB                         | 03              | saphana          | 10.66.0.13 (62503)      |
| ABAP SAP Central Services (ASCS)    | 00              | sapascs          | 10.66.0.20 (62000)      |
| Enqueue Replication Server (ERS)    | 01              | sapers           | 10.66.0.30 (62101)      |
| SAP HANA system identifier          | HN1             | ---              | ---                     |
| SAP system identifier               | NW1             | ---              | ---                     |

> [!NOTE]
> Install SAP dialog instances (PAS and AAS) on separate VMs.

![Diagram that shows the architecture of an SAP HANA, SAP ASCS/SCS, and ERS installation within the same cluster.](media/high-availability-guide-rhel/high-availability-rhel-hana-ascs-ers-dialog-instance.png)

### Important considerations for the cost-optimization solution

* SAP dialog instances (PAS and AAS) (like **sapa01** and **sapa02**) should be installed on separate VMs. Install SAP ASCS and ERS with virtual host names. To learn more about how to assign a virtual host name to a VM, see the blog [Use SAP Virtual Host Names with Linux in Azure](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/use-sap-virtual-host-names-with-linux-in-azure/ba-p/3251593).
* With an HANA DB, ASCS/SCS, and ERS deployment in the same cluster setup, the instance number of HANA DB, ASCS/SCS, and ERS must be different.
* Consider sizing your VM SKUs appropriately based on the sizing guidelines. You must factor in the cluster behavior where multiple SAP instances (HANA DB, ASCS/SCS, and ERS) might run on a single VM when another VM in the cluster is unavailable.
* You can use different storage (for example, Azure NetApp Files or NFS on Azure Files) to install the SAP ASCS and ERS instances.
  > [!NOTE]
  > For SAP J2EE systems, it's not supported to place `/usr/sap/<SID>/J<nr>` on NFS on Azure Files.
  > Database file systems like /hana/data and /hana/log aren't supported on NFS on Azure Files.
* To install more application servers on separate VMs, you can either use NFS shares or a local managed disk for an instance directory file system. If you're installing more application servers for SAP J2EE system, `/usr/sap/<SID>/J<nr>` on NFS on Azure Files isn't supported.
* See [NFS on Azure Files considerations](high-availability-guide-rhel-nfs-azure-files.md#important-considerations-for-nfs-on-azure-files-shares) and [Azure NetApp Files considerations](high-availability-guide-rhel-netapp-files.md#important-considerations) because the same considerations apply to this setup.

## Prerequisites

The configuration described in this article is an addition to your already-configured SAP HANA cluster setup. In this configuration, an SAP ASCS/SCS and ERS instance are installed on a virtual host name. The instance directory is managed by the cluster.

Install a HANA database and set up a HANA system replication (HSR) and Pacemaker cluster by following the steps in [High availability of SAP HANA on Azure VMs on Red Hat Enterprise Linux](sap-hana-high-availability-rhel.md) or [High availability of SAP HANA Scale-up with Azure NetApp Files on Red Hat Enterprise Linux](sap-hana-high-availability-netapp-files-red-hat.md) depending on what storage option you're using.

After you install, configure, and set up the **HANA Cluster**, follow the next steps to install ASCS and ERS instances.

## Configure Azure Load Balancer for ASCS and ERS

This article assumes that you already configured the load balancer for a HANA cluster setup as described in [Configure Azure Load Balancer](./sap-hana-high-availability-rhel.md#configure-azure-load-balancer). In the same Azure Load Balancer instance, follow these steps to create more front-end IPs and load-balancing rules for ASCS and ERS.

1. Open the internal load balancer that was created for SAP HANA cluster setup.
1. **Frontend IP Configuration**: Create two front-end IPs, one for ASCS and another for ERS (for example, **10.66.0.20** and **10.66.0.30**).
1. **Backend Pool**: This pool remains the same because we're deploying ASCS and ERS on the same back-end pool.
1. **Inbound rules**: Create two load-balancing rules, one for ASCS and another for ERS. Follow the same steps for both load-balancing rules.
1. **Frontend IP address**: Select the front-end IP.
   1. **Backend pool**: Select the back-end pool.
   1. **High availability ports**: Select this option.
   1. **Protocol**: Select **TCP**.
   1. **Health Probe**: Create a health probe with the following details (applies for both ASCS and ERS):
      1. **Protocol**: Select **TCP**.
      1. **Port**: For example, **620<Instance-no.>** for ASCS and **621<Instance-no.>** for ERS.
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

## SAP ASCS/SCS and ERS setup

Based on your storage, follow the steps described in the following articles to configure a `SAPInstance` resource for the SAP ASCS/SCS and SAP ERS instance in the cluster.

* **NFS on Azure Files**: [Azure VMs high availability for SAP NW on RHEL with NFS on Azure Files](high-availability-guide-rhel-nfs-azure-files.md#prepare-for-an-sap-netweaver-installation)
* **Azure NetApp Files**: [Azure VMs high availability for SAP NW on RHEL with Azure NetApp Files](high-availability-guide-rhel-netapp-files.md#prepare-for-the-sap-netweaver-installation)

## Test the cluster setup

Thoroughly test your Pacemaker cluster:

* [Run the typical Netweaver failover tests](high-availability-guide-rhel.md#test-the-cluster-setup)
* [Run the typical HANA DB failover tests](sap-hana-high-availability-rhel.md#test-the-cluster-setup)
