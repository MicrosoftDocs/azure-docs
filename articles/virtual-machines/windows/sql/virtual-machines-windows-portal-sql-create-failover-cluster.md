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

# SQL Server Failover Cluster on Azure Virtual Machines

This article explains how to create a SQL Server Failover Cluster Instance (FCI) on Azure Virtual Machines Resource Manager model. In this solution, [Windows Server 2016 Datacenter edition Storage Spaces Direct \(S2D\)](http://technet.microsoft.com/windows-server-docs/storage/storage-spaces/storage-spaces-direct-overview) provides synchronized storage to each cluster node. S2D is new in Windows Server 2016.

The following diagram shows the complete solution on Azure Virtual Machines:

![Availability Group](./media/virtual-machines-windows-portal-sql-create-failover-cluster/00-sql-fci-s2d-complete-solution.png)

In the preceding diagram, each virtual machine has two or more data disks. S2D synchronizes the data on the data disk and presents the synchronized storage as a storage pool. Then you can create a cluster shared volume (CSV) on the storage pool. The CSV are mounted on the virtual machine system drive. The SQL Server FCI cluster role uses the storage for the cluster system and data drives. In addition, the solution requires an Azure load balancer to hold the IP address for the SQL Server FCI. Finally, a single availability set holds all the resources.

For details about S2D, see [Windows Server 2016 Datacenter edition Storage Spaces Direct \(S2D\)](http://technet.microsoft.com/windows-server-docs/storage/storage-spaces/storage-spaces-direct-overview). 

S2D supports two types of architectures - converged and hyper-converged. The architecture in this document is hyper-converged. For an in-depth article about hyper-converged solutions, see [Hyper-converged solution using Storage Spaces Direct in Windows Server 2016](http://technet.microsoft.com/windows-server-docs/storage/storage-spaces/hyper-converged-solution-using-storage-spaces-direct)

## Before you begin

Before following the instructions in this article, you should already have:

1. A Microsoft Azure subscription.
1. A Windows domain on Azure virtual machines.
1. An account with permission to create objects in the Azure virtual machine.
1. An Azure virtual network and subnet with sufficient IP address space for the following components:
   - Both virtual machines.
   - The Windows Server Failover Cluster (WSFC) IP address.
   - The Failover Cluster Instance address.

## How to Configure Failover CLuster with S2D in the UI

1. [Create the availability set](../../virtual-machines-windows-create-availability-set.md).

1. Create the virtual machines in the availability set.
   
   Choose an image from the Azure Marketplace.  For details, see [Overview of SQL Server on Azure Virtual Machines](virtual-machines-windows-sql-server-iaas-overview.md)
   
   >[!TIP]
   >Use the image with the latest service pack for SQL Server and Windows. 

   There are three types of images in the Azure Marketplace that you can use to create this solution. The following table outlines the choices.

   | Image | Notes
   | ----- | -----
   | **SQL Server 2016 Enterprise on Windows Server Datacenter 2016** | Provides SQL Server installed. <br/>After creating the VM, remove SQL Server. <br/>Use pre-installed media when it is time to create the SQL Server FCI. <br/> Billed per minute. 
   | **{BYOL} SQL Server 2016 Enterprise on Windows Server Datacenter 2016** | Provides SQL Server installed. <br/> After creating the VM, remove SQL Server. <br/>Use pre-installed media when it is time to create the SQL Server FCI. <br/> Billed according to your license agreements.
   | **Windows Server 2016 Datacenter** | Does not contain SQL Server installation media. <br/>Place the media to a location where you can run the SQL Server installation for each node. <br/>Billed according to your license agreements. 
   
   >[!IMPORTANT]
   > If you use an Azure Marketplace image with SQL Server installed, remove **SQL Server** immediately after Azure provisions the virtual machine. In a later step, Use the SQL Server installation media from `C:\SQLServer_<version number>_Full` to install the failover cluster instance. 

1. Open the firewall ports.

   On each virtual machine, open the following ports:

   | Purpose | TCP Port | Notes
   | ------ | ------ | ------
   | SQL Server | 1433 | Normal port for default instances of SQL Server. If you used an image from the gallery, this port is automatically opened. 
   | Health probe | 59999 | Any open TCP port. In a later step, configure the load balancer health probe and the cluster to use this port.  

1. Add storage to the virtual machine. [Add storage](../../articles/storage/storage-premium-storage.md#quick-start-create-and-use-a-premium-storage-account-for-a-virtual-machine-data-disk)

   Attach raw disks - not NTFS formatted disks. 
      >[!NOTE]
      >If you attach NTFS-formatted disks, you can only enable S2D with no disk eligibility check.  
   
   Attach minimum of 2 SSD 512 premium to each VM.
   
   Set host caching to **Read-only**.

   The storage capacity you use in production environments depend on your workload. The values described in this article are for demonstration and testing. 

1. Configure networking on the virtual machines. 

   Set the DNS server to the appropriate value for your domain. 

   >[!WARNING]
   >In some cases, an Azure virtual machine will become non-responsive immediately after you change the network interface settings. In this case, reboot the virtual machine. 

1. [Add the virtual machines to the domain](virtual-machines-windows-portal-sql-availability-group-prereq.md#joinDomain) 

1. [Add Failover Clustering feature to the new SQL Server](virtual-machines-windows-portal-sql-availability-group-prereq.md#add-failover-cluster-features-to-both-sql-servers).

   The preceding link shows how to add the feature in the user interface. You can also add the feature with PowerShell. For example:

   ```PowerShell
   $nodes = ("<Server-1>", "<Server-2>")
   icm $nodes {Install-WindowsFeature Failover-Clustering -IncludeManagementTools}
   ```

1. [Create a cloud witness for the failover cluster](http://technet.microsoft.com/windows-server-docs/failover-clustering/deploy-cloud-witness).

1. [Create the Failover cluster](virtual-machines-windows-portal-sql-availability-group-tutorial#CreateCluster).

   The following PowerShell creates a Windows Server failover cluster. The IP address is the same IP address specified in the load balancer front-end IP address.

   ```PowerShell
   New-Cluster -Name \<clustername\> -Node $nodes –StaticAddress \<10.0.0.10\>.
   ```
   
   >[!TIP]
   >Use a link-local address for the cluster static address. For example, \<192.254.0.1\>. This address cannot be used anywhere else within the subnet. 

1. Enable Store Spaces Direct (S2D).

  The following PowerShell enables storage spaces direct.  

   ```PowerShell
   Enable-ClusterS2D
   ```
1. Create a volume.

   One of the features of S2D is that it automatically creates a storage pool when you enable it. You are now ready to create a volume. The PowerShell commandlet `New-Volume` automates the volume creation process, including formatting, adding to the cluster, and creating a cluster shared volume (CSV). The following example creates an 800 gigabyte (GB) CSV. 

   ```PowerShell
   New-Volume -StoragePoolFriendlyName S2D* -FriendlyName VDisk01 -FileSystem CSVFS_REFS -Size 800GB
   ```   

1. [Validate the cluster](http://technet.microsoft.com/library/jj134244.aspx#BKMK_RUN_TESTS).

   Validate the cluster after you create the storage volume. SQL Server setup requires that the cluster has a current validation. The validation that you ran when you created the cluster did not include the storage resources. 

1. Install a SQL Server failover cluster.

   Connect to the node that owns all the cluster resources with RDP. [Create a single-node SQL Server failover cluster instance](http://msdn.microsoft.com/library/ms179530.aspx).

   After you create a single-node failover cluster instance, connect to the other node with RDP and run **Setup with Add Node**.

   >[!NOTE]
   >If you used an Azure Marketplace gallery image with SQL Server, SQL Server tools were included with the image. If you did not use this image, install the SQL Server tools separately. See [Download SQL Server Management Studio (SSMS)](http://msdn.microsoft.com/library/mt238290.aspx).

1. [Create and configure an Azure load balancer](virtual-machines-windows-portal-sql-availability-group-tutorial.md#configure-internal-load-balancer).

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

1. Set the cluster probe port parameter in PowerShell.

To set the cluster probe port parameter, update variables in the following script from your environment. 

   ```PowerShell
   $ClusterNetworkName = "<Cluster Network Name>" # the cluster network name (Use Get-ClusterNetwork on Windows Server 2012 of higher to find the name)
   $IPResourceName = "IP Address Resource Name" # the IP Address resource name
   $ILBIP = "<10.0.0.x>" # the IP Address of the Internal Load Balancer (ILB). This is the static IP address for the load balancer you configured in the Azure portal.
   [int]$ProbePort = 59999
   
   Import-Module FailoverClusters

   Get-ClusterResource $IPResourceName | Set-ClusterParameter -Multiple @{"Address"="$ILBIP";"ProbePort"=$ProbePort;"SubnetMask"="255.255.255.255";"Network"="$ClusterNetworkName";"EnableDhcp"=0}
   ```

1. Test connectivity.

To test connectivity, log into another virtual machine in the same virtual network. Open SQL Server management studio and connect to the SQL Server failover cluster instance name. 

## Limitations
DTC is not supported on failover cluster instances because the RPC port is not supported by the load balancer.

## Support

[Microsoft server software support for Microsoft Azure virtual machines](http://support.microsoft.com/kb/2721672) says "SQL Server Azure virtual machines do not support Failover Cluster Instances (FCI)." 

[Support policy for Microsoft SQL Server products that are running in a hardware virtualization environment](http://support.microsoft.com/kb/956893)

## See Also

[Setup S2D with remote desktop (Azure)](http://technet.microsoft.com/windows-server-docs/compute/remote-desktop-services/rds-storage-spaces-direct-deployment) 

[Hyperconverged solution with storage spaces direct](http://technet.microsoft.com/windows-server-docs/storage/storage-spaces/hyper-converged-solution-using-storage-spaces-direct).

[Storage Space Direct Overview](http://technet.microsoft.com/windows-server-docs/storage/storage-spaces/storage-spaces-direct-overview)

[SQL Server support for S2D](https://blogs.technet.microsoft.com/dataplatforminsider/2016/09/27/sql-server-2016-now-supports-windows-server-2016-storage-spaces-direct/)


## Next Steps

- Add an instance to an existing failover cluster on Azure Virtual Machines
