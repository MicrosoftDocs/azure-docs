---
title: Prepare virtual machines for an FCI  
description: "Prepare your Azure virtual machines to use them with a failover cluster instance (FCI) and SQL Server on Azure Virtual Machines." 
services: virtual-machines
documentationCenter: na
author: MashaMSFT
editor: monicar
tags: azure-service-management
ms.service: virtual-machines-sql
ms.subservice: hadr
ms.topic: how-to
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: "06/02/2020"
ms.author: mathoma

---

# Prepare virtual machines for an FCI (SQL Server on Azure VMs)
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

This article describes how to prepare Azure virtual machines (VMs) to use them with a SQL Server failover cluster instance (FCI). Configuration settings vary depending on the FCI storage solution, so validate that you're choosing the correct configuration to suit your environment and business. 

To learn more, see an overview of [FCI with SQL Server on Azure VMs](failover-cluster-instance-overview.md) and [cluster best practices](hadr-cluster-best-practices.md). 

> [!NOTE]
> It's now possible to lift and shift your failover cluster instance solution to SQL Server on Azure VMs using Azure Migrate. See [Migrate failover cluster instance](../../migration-guides/virtual-machines/sql-server-failover-cluster-instance-to-sql-on-azure-vm.md) to learn more. 

## Prerequisites 

- A Microsoft Azure subscription. Get started for [free](https://azure.microsoft.com/free/). 
- A Windows domain on Azure virtual machines or an on-premises active directory extended to Azure with virtual network pairing.
- An account that has permissions to create objects on Azure virtual machines and in Active Directory.
- An Azure virtual network and one or more subnets with enough IP address space for these components:
   - Both virtual machines
   - An IP address for the Windows failover cluster
   - An IP address for each FCI
- DNS configured on the Azure network, pointing to the domain controllers.

## Choose an FCI storage option

The configuration settings for your virtual machine vary depending on the storage option you're planning to use for your SQL Server failover cluster instance. Before you prepare the virtual machine, review the [available FCI storage options](failover-cluster-instance-overview.md#storage) and choose the option that best suits your environment and business need. Then carefully select the appropriate VM configuration options throughout this article based on your storage selection. 

## Configure VM availability 

The failover cluster feature requires virtual machines to be placed in an [availability set](../../../virtual-machines/linux/tutorial-availability-sets.md) or an [availability zone](../../../availability-zones/az-overview.md#availability-zones).

Carefully select the VM availability option that matches your intended cluster configuration: 

- **Azure shared disks**: the availability option varies if you're using Premium SSD or UltraDisk:
   - Premium SSD Zone Redundant Storage (ZRS):
   [Availability Zone](../../../availability-zones/az-overview.md#availability-zones) in different zones . [Premium SSD ZRS](/azure/virtual-machines/disks-deploy-zrs?tabs=portal) replicates your Azure managed disk synchronously across three Azure availability zones in the selected region. VMs part of failover cluster can be placed in different availability zones, thus helping you achieve a zone redundant SQL Server FCI and provides VM availability SLA of 99.99%. Disk latency for ZRS is higher due to the cross zonal copy of data.
   - Premium SSD Locally Redundant Storage (LRS): 
   [Availability Set](../../../virtual-machines/windows/tutorial-availability-sets.md#create-an-availability-set) in different fault/update domains for Premium SSD LRS. You can also choose to place the VMs inside a [proximity placement group](../../../virtual-machines/windows/proximity-placement-groups-portal.md) to locate them closer to each other. Combining availability set and proximity placement group provides lowest latency for shared disk as data is replicated locally within one data center and provides VM availability SLA of 99.95%.    
   - Ultra Disk Locally Redundant Storage (LRS): 
   [Availability zone](../../../virtual-machines/windows/create-portal-availability-zone.md#confirm-zone-for-managed-disk-and-ip-address) but the VMs must be placed in the same availability zone. Ultra disk offers lowest disk latency and is best for IO intensive workloads. Since all the VMs part of FCI have be in the same availability zone, the VM availability is only 99.9%. 
- **Premium file shares**: [Availability set](../../../virtual-machines/windows/tutorial-availability-sets.md#create-an-availability-set) or [Availability Zone](../../../virtual-machines/windows/create-portal-availability-zone.md#confirm-zone-for-managed-disk-and-ip-address).
- **Storage Spaces Direct**: [Availability Set](../../../virtual-machines/windows/tutorial-availability-sets.md#create-an-availability-set).

> [!IMPORTANT]
> You can't set or change the availability set after you've created a virtual machine.

## Create the virtual machines

After you've configured your VM availability, you're ready to create your virtual machines. You can choose to use an Azure Marketplace image that does or doesn't have SQL Server already installed on it. However, if you choose an image for SQL Server on Azure VMs, you'll need to uninstall SQL Server from the virtual machine before configuring the failover cluster instance. 

### Considerations

On an Azure VM guest failover cluster, we recommend a single NIC per server (cluster node). Azure networking has physical redundancy, which makes additional NICs unnecessary on an Azure IaaS VM guest cluster. Although the cluster validation report will issue a warning that the nodes are only reachable on a single network, this warning can be safely ignored on Azure IaaS VM guest failover clusters.

Place both virtual machines:

- In the same Azure resource group as your availability set, if you're using availability sets.
- On the same virtual network as your domain controller or on a virtual network that has suitable connectivity to your domain controller.
- In the Azure availability set or availability zone.

You can create an Azure virtual machine by using an image [with](sql-vm-create-portal-quickstart.md) or [without](../../../virtual-machines/windows/quick-create-portal.md) SQL Server preinstalled to it. If you choose the SQL Server image, you'll need to manually uninstall the SQL Server instance before installing the failover cluster instance.  

### Multi subnet

Place both virtual machines in separate subnets within a virtual network and assign [secondary IPs](/azure/azure-sql/virtual-machines/windows/availability-group-manually-configure-prerequisites-tutorial-multi-subnet#add-secondary-ips-to-sql-server-vms) to be used for Windows Server Failover Cluster (Windows Server 2016 and below) and SQL Server Failover Cluster Instance. This approach eliminates the need for Azure Load Balancer while connecting to SQL Server failover cluster instance. Deploying your VMs to multiple subnets leverages OR dependency for IPs and matches the on-premises experience when connecting to your failover cluster instance.

### Single subnet

Place both virtual machines in a single subnet that has enough IP address for both virtual machines and all FCIs that you might eventually use on the cluster. This approach needs Azure Load Balancer IP for Windows Server Failover Cluster (Windows Server 2016 and below) and SQL Server Failover Cluster Instance. You can alternatively use DNN. If you choose to deploy your SQL Server VMs to a single subnet [review the differences between the Azure Load Balancer and DNN connectivity options](/azure/azure-sql/virtual-machines/windows/hadr-windows-server-failover-cluster-overview#distributed-network-name-dnn) and decide which option will work best for you before preparing the rest of your environment for your FCI.


## Uninstall SQL Server

As part of the FCI creation process, you'll install SQL Server as a clustered instance to the failover cluster. *If you deployed a virtual machine with an Azure Marketplace image without SQL Server, you can skip this step.* If you deployed an image with SQL Server preinstalled, you'll need to unregister the SQL Server VM from the SQL IaaS Agent extension, and then uninstall SQL Server. 

### Unregister from the SQL IaaS Agent extension

SQL Server VM images from Azure Marketplace are automatically registered with the SQL IaaS Agent extension. Before you uninstall the preinstalled SQL Server instance, you must first [unregister each SQL Server VM from the SQL IaaS Agent extension](sql-agent-extension-manually-register-single-vm.md#unregister-from-extension). 

### Uninstall SQL Server

After you've unregistered from the extension, you can uninstall SQL Server. Follow these steps on each virtual machine: 

1. Connect to the virtual machine by using RDP.

   When you first connect to a virtual machine by using RDP, a prompt asks you if you want to allow the PC to be discoverable on the network. Select **Yes**.

1. If you're using one of the SQL Server-based virtual machine images, remove the SQL Server instance:

   1. In **Programs and Features**, right-click **Microsoft SQL Server 201_ (64-bit)** and select **Uninstall/Change**.
   1. Select **Remove**.
   1. Select the default instance.
   1. Remove all features under **Database Engine Services**, **Analysis Services** and **Reporting Services - Native**. Don't remove anything under **Shared Features**. You'll see something like the following screenshot:

      ![Select features](./media/failover-cluster-instance-prepare-vm/remove-features-updated.png)

   1. Select **Next**, and then select **Remove**.
   1. After the instance is successfully removed, restart the virtual machine. 

## Open the firewall 

On each virtual machine, open the Windows Firewall TCP port that SQL Server uses. By default, this is port 1433. But you can change the SQL Server port on an Azure VM deployment, so open the port that SQL Server uses in your environment. This port is automatically open on SQL Server images deployed from Azure Marketplace. 

If you use a [load balancer](failover-cluster-instance-vnn-azure-load-balancer-configure.md) for single subnet scenario, you'll also need to open the port that the health probe uses. By default, this is port 59999. But it can be any TCP port that you specify when you create the load balancer. 

This table details the ports that you might need to open, depending on your FCI configuration: 

   | Purpose | Port | Notes
   | ------ | ------ | ------
   | SQL Server | TCP 1433 | Normal port for default instances of SQL Server. If you used an image from the gallery, this port is automatically opened. </br> </br> **Used by**: All FCI configurations. |
   | Health probe | TCP 59999 | Any open TCP port. Configure the load balancer [health probe](failover-cluster-instance-vnn-azure-load-balancer-configure.md#configure-health-probe) and the cluster  to use this port. </br> </br> **Used by**: FCI with load balancer in single subnet scenario. |
   | File share | UDP 445 | Port that the file share service uses. </br> </br> **Used by**: FCI with Premium file share. |

## Join the domain

You also need to join your virtual machines to the domain. You can do so by using a [quickstart template](../../../active-directory-domain-services/join-windows-vm-template.md#join-an-existing-windows-server-vm-to-a-managed-domain). 

## Review storage configuration

Virtual machines created from Azure Marketplace come with attached storage. If you plan to configure your FCI storage by using Premium file shares or Azure shared disks, you can remove the attached storage to save on costs because local storage is not used for the failover cluster instance. However, it's possible to use the attached storage for Storage Spaces Direct FCI solutions, so removing them in this case might be unhelpful. Review your FCI storage solution to determine if removing attached storage is optimal for saving costs. 


## Next steps

Now that you've prepared your virtual machine environment, you're ready to configure your failover cluster instance. 

Choose one of the following guides to configure the FCI environment that's appropriate for your business: 
- [Configure FCI with Azure shared disks](failover-cluster-instance-azure-shared-disks-manually-configure.md)
- [Configure FCI with a Premium file share](failover-cluster-instance-premium-file-share-manually-configure.md)
- [Configure FCI with Storage Spaces Direct](failover-cluster-instance-storage-spaces-direct-manually-configure.md)


To learn more, see:

- [Windows Server Failover Cluster with SQL Server on Azure VMs](hadr-windows-server-failover-cluster-overview.md)
- [Failover cluster instances with SQL Server on Azure VMs](failover-cluster-instance-overview.md)
- [Failover cluster instance overview](/sql/sql-server/failover-clusters/windows/always-on-failover-cluster-instances-sql-server)
- [HADR settings for SQL Server on Azure VMs](hadr-cluster-best-practices.md)
