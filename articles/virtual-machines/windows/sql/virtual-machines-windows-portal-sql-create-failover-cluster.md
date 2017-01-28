---
title: SQL Server FCI - Azure Virtual Machines | Microsoft Docs 
description: "This article explains how to create SQL Server Failover Cluster Instance on Azure Virtual Machines."
services: virtual-machines
documentationCenter: na
authors: MikeRayMSFT
manager: jhubbard
editor: monicar
tags: azure-service-management

ms.assetid: 9fc761b1-21ad-4d79-bebc-a2f094ec214d
ms.service: virtual-machines-sql
ms.devlang: na
ms.custom: na
ms.topic: article
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: "01/11/2017"
ms.author: mikeray

---

# Configure SQL Server Failover Cluster Instance on Azure Virtual Machines

This article explains how to create a SQL Server Failover Cluster Instance (FCI) on Azure virtual machines in Resource Manager model. In this solution, [Windows Server 2016 Datacenter edition Storage Spaces Direct \(S2D\)](http://technet.microsoft.com/windows-server-docs/storage/storage-spaces/storage-spaces-direct-overview) provides synchronized storage to each cluster node. S2D is new in Windows Server 2016.

The following diagram shows the complete solution on Azure virtual machines:

![Availability Group](./media/virtual-machines-windows-portal-sql-create-failover-cluster/00-sql-fci-s2d-complete-solution.png)

The preceding diagram shows:

- Two Azure virtual machines in a Windows Server Failover Cluster (WSFC). When a virtual machines is in a WSFC it is also called a *cluster node*, or *nodes*.
- Each virtual machine has two or more data disks.
- S2D synchronizes the data on the data disk and presents the synchronized storage as a storage pool. 
- The storage pool presents a cluster shared volume (CSV) to the WSFC.
- The SQL Server FCI cluster role uses the CSV for the data drives. 
- An Azure load balancer to hold the IP address for the SQL Server FCI.
- An Azure availability set holds all the resources.

For details about S2D, see [Windows Server 2016 Datacenter edition Storage Spaces Direct \(S2D\)](http://technet.microsoft.com/windows-server-docs/storage/storage-spaces/storage-spaces-direct-overview). 

S2D supports two types of architectures - converged and hyper-converged. The architecture in this document is hyper-converged. A hyper-converged infrastructure places the storage on the same servers that host the clustered application. In this architecture, the storage is on each SQL Server FCI node.

## Before you begin

Before following the instructions in this article, you should already have:

- Familiarity with S2D hyperconverged solution. See [Hyper-converged solution using Storage Spaces Direct in Windows Server 2016](http://technet.microsoft.com/windows-server-docs/storage/storage-spaces/hyper-converged-solution-using-storage-spaces-direct).
- A Microsoft Azure subscription.
- Familiarity with Azure Resource groups. See [Manage Azure resources through portal](../../../azure-resource-manager/resource-group-portal.md).
- A Windows domain on Azure virtual machines.
- An account with permission to create objects in the Azure virtual machine.
- An Azure virtual network and subnet with sufficient IP address space for the following components:
   - Both virtual machines.
   - The WSFC IP address.
   - An IP address for each FCI.
- DNS configured on the Azure Network, pointing to the domain controllers. 

## Configure WSFC

1. Log in to the [Azure portal](http://portal.azure.com) with your subscription.

1. [Create an Azure availability set](../../virtual-machines-windows-create-availability-set.md).

1. Create the virtual machines in the availability set.

   Provision two SQL Server virtual machines in the Azure availability set. For instructions, see [Provision a SQL Server virtual machine in the Azure portal](virtual-machines-windows-portal-sql-server-provision.md). 

   Place both virtual machines in a single Azure resource group. You can create the resource group when you create the first virtual machine. 

   Choose an image from the Azure Marketplace. You can use a Marketplace image with SQL Server or a Windows Server 2016 image. For details, see [Overview of SQL Server on Azure Virtual Machines](../../virtual-machines-windows-sql-server-iaas-overview.md)
   
   Azure Marketplace SQL Server-based virtual machine images include the licensing costs for SQL Server in the per-minute pricing of the VM you create. A separate option is to use the bring-your-own-license (BYOL) and pay only for the virtual machine. These images are prefixed with {BYOL}. The following Marketplace images come with SQL Server already installed:

   - **SQL Server 2016 Enterprise on Windows Server Datacenter 2016**
   - **SQL Server 2016 Standard on Windows Server Datacenter 2016**
   - **SQL Server 2016 Developer on Windows Server Datacenter 2016**
   - **{BYOL} SQL Server 2016 Enterprise on Windows Server Datacenter 2016**
   - **{BYOL} SQL Server 2016 Standard on Windows Server Datacenter 2016** 

   >[!TIP]
   >Use the image with the latest service pack for SQL Server. 

   After you create the virtual machine, remove SQL Server. Use pre-installed media when it is time to create the SQL Server FCI. 
   
   Alternatively, you can use Azure Marketplace images with just the operating system. Choose a **Windows Server 2016 Datacenter** image and install the SQL Server FCI after you configure the WSFC and S2D. This image does not contain SQL Server installation media. Place the installation media in a location where you can run the SQL Server installation for each server. 
   
1. Open the firewall ports.

   On each virtual machine, open the following ports:

   | Purpose | TCP Port | Notes
   | ------ | ------ | ------
   | SQL Server | 1433 | Normal port for default instances of SQL Server. If you used an image from the gallery, this port is automatically opened. 
   | Health probe | 59999 | Any open TCP port. In a later step, configure the load balancer health probe and the cluster to use this port.  

1. Add storage to the virtual machine. [Add storage](../../../storage/storage-premium-storage.md#quick-start-create-and-use-a-premium-storage-account-for-a-virtual-machine-data-disk)

   Attach raw disks - not NTFS formatted disks. 
      >[!NOTE]
      >If you attach NTFS-formatted disks, you can only enable S2D with no disk eligibility check.  
   
   Attach a minimum of two Premium Storage (SSD disks) to each VM. We recommend at least P30 (1 TB) disks.

   Set host caching to **Read-only**.

   The storage capacity you use in production environments depends on your workload. The values described in this article are for demonstration and testing. 

1. [Add the virtual machines to the domain](virtual-machines-windows-portal-sql-availability-group-prereq.md#joinDomain).

1. [Add Failover Clustering feature to each virtual machine](virtual-machines-windows-portal-sql-availability-group-prereq.md#add-failover-cluster-features-to-both-sql-servers).

   The preceding link shows how to add the **Failover Clustering** feature in the user interface. Instead, you can add the feature with PowerShell. For example:

   ```PowerShell
   $nodes = ("<Server-1>", "<Server-2>")
   icm $nodes {Install-WindowsFeature Failover-Clustering -IncludeManagementTools}
   ```

1. [Run cluster validation](http://technet.microsoft.com/windows-server-docs/storage/storage-spaces/hyper-converged-solution-using-storage-spaces-direct#step-31-run-cluster-validation).

   ```PowerShell
   Test-Cluster –Node $nodes –Include "Storage Spaces Direct", "Inventory", "Network", "System Configuration"
   ```

1. [Create the WSFC](virtual-machines-windows-portal-sql-availability-group-tutorial.md#CreateCluster).

   The following PowerShell creates a WSFC. The IP address is the same IP address specified in the load balancer front-end IP address.

   ```PowerShell
   New-Cluster -Name <clustername> -Node $nodes –StaticAddress <192.254.0.1> -NoStorage
   ```
   
   For details, refer to [Create a cluster](http://technet.microsoft.com/windows-server-docs/storage/storage-spaces/hyper-converged-solution-using-storage-spaces-direct#step-32-create-a-cluster).


   >[!TIP]
   >Use a link-local address for the cluster static address. For example, <192.254.0.1>. This address cannot be used anywhere else within the subnet. 
   
1. [Create a cloud witness for the WSFC](http://technet.microsoft.com/windows-server-docs/failover-clustering/deploy-cloud-witness). 

   Create the cloud witness in the same resource group as the Azure virtual machines. 
   
1. [Clean disks](http://technet.microsoft.com/windows-server-docs/storage/storage-spaces/hyper-converged-solution-using-storage-spaces-direct#step-34-clean-disks).
   
   The disks for S2D need to be empty and without partitions or other data. Follow the instructions in the preceding link to verify that the disks are clean.
   
1. [Enable Store Spaces Direct \(S2D\)](http://technet.microsoft.com/windows-server-docs/storage/storage-spaces/hyper-converged-solution-using-storage-spaces-direct#step-35-enable-storage-spaces-direct).

   The following PowerShell enables storage spaces direct.  

   ```PowerShell
   Enable-ClusterS2D
   ```

1. [Create a volume](http://technet.microsoft.com/windows-server-docs/storage/storage-spaces/hyper-converged-solution-using-storage-spaces-direct#step-36-create-volumes).

   One of the features of S2D is that it automatically creates a storage pool when you enable it. You are now ready to create a volume. The PowerShell commandlet `New-Volume` automates the volume creation process, including formatting, adding to the cluster, and creating a cluster shared volume (CSV). The following example creates an 800 gigabyte (GB) CSV. 

   ```PowerShell
   New-Volume -StoragePoolFriendlyName S2D* -FriendlyName VDisk01 -FileSystem CSVFS_REFS -Size 800GB
   ```   

## Create SQL Server FCI

After you have configured the WSFC and all cluster components including storage, you can create the SQL Server FCI. 

1. Connect to the first virtual machine with RDP. 

1. In **Failover Cluster Manager**, make sure all cluster core resources are on the first virtual machine. If necessary, move all resources to this virtual machine. 

1. Locate the installation media. If the virtual machine uses one of the Azure Marketplace images, the media is located at `C:\SQLServer_<version number>_Full`. Click **Setup**.

1. In the **SQL Server Installation Center**, click **Installation**.

1. Click **New SQL Server Failover Cluster Installation**. Follow the instructions in the wizard to install the SQL Server FCI. 

1. After you create the SQL Server FCI on the first node, connect to the second node with RDP.

1. Open the **SQL Server Installation Center**. Click **Installation**.

1. Click **Add node to a SQL Server failover cluster**. Follow the instructions in the wizard to install SQL server and add this server to the FCI.

   >[!NOTE]
   >If you used an Azure Marketplace gallery image with SQL Server, SQL Server tools were included with the image. If you did not use this image, install the SQL Server tools separately. See [Download SQL Server Management Studio (SSMS)](http://msdn.microsoft.com/library/mt238290.aspx).

## Configure Azure load balancer

The Azure load balancer holds the IP address for the SQL Server FCI. 

[Create and configure an Azure load balancer](virtual-machines-windows-portal-sql-availability-group-tutorial.md#configure-internal-load-balancer).

   This load balancer must:
   
   - Be in the same network and subnet as the cluster nodes.
   - Have a static IP address for the SQL Server Virtual IP.
      
      >[!TIP]
      >You can create the load balancer with a dynamic IP address and then change it to a static address after it is created. 

   - Include a backend pool consisting of the virtual machines.
   - Use the TCP port probe specific to the IP address.
   - Configure load balancer with direct server return (floating IP).

   >[!NOTE]
   >On Azure virtual machines, clusters use a load balancer to hold an IP address that needs to be on one cluster node at a time.

The load balancer for an FCI requires a floating IP address with direct server return.  

## Configure cluster probe

Set the cluster probe port parameter in PowerShell.

To set the cluster probe port parameter, update variables in the following script from your environment. 

   ```PowerShell
   $ClusterNetworkName = "<Cluster Network Name>" # the cluster network name (Use Get-ClusterNetwork on Windows Server 2012 of higher to find the name)
   $IPResourceName = "IP Address Resource Name" # the IP Address resource name
   $ILBIP = "<10.0.0.x>" # the IP Address of the Internal Load Balancer (ILB). This is the static IP address for the load balancer you configured in the Azure portal.
   [int]$ProbePort = 59999
   
   Import-Module FailoverClusters

   Get-ClusterResource $IPResourceName | Set-ClusterParameter -Multiple @{"Address"="$ILBIP";"ProbePort"=$ProbePort;"SubnetMask"="255.255.255.255";"Network"="$ClusterNetworkName";"EnableDhcp"=0}
   ```

## Test failover

Test failover of the FCI to validate cluster functionality. Do the following steps:

1. Connect to one of the SQL Server FCI cluster nodes with RDP.

1. Open **Failover Cluster Manager**. Click **Roles**. Notice which node owns the SQL Server FCI role. 

1. Right-click the SQL Server FCI role. 

1. Click **Move** and click **Best Possible Node**.

**Failover Cluster Manager** shows the role and its resources go offline. The resources then move and come online on the other node. 

## Test connectivity

To test connectivity, log in to another virtual machine in the same virtual network. Open SQL Server management studio and connect to the SQL Server FCI name. 

## Limitations
DTC is not supported on FCIs because the RPC port is not supported by the load balancer.

## See Also

[Setup S2D with remote desktop (Azure)](http://technet.microsoft.com/windows-server-docs/compute/remote-desktop-services/rds-storage-spaces-direct-deployment) 

[Hyperconverged solution with storage spaces direct](http://technet.microsoft.com/windows-server-docs/storage/storage-spaces/hyper-converged-solution-using-storage-spaces-direct).

[Storage Space Direct Overview](http://technet.microsoft.com/windows-server-docs/storage/storage-spaces/storage-spaces-direct-overview)

[SQL Server support for S2D](https://blogs.technet.microsoft.com/dataplatforminsider/2016/09/27/sql-server-2016-now-supports-windows-server-2016-storage-spaces-direct/)


## Next Steps

- Add an instance to an existing failover cluster on Azure virtual machines
