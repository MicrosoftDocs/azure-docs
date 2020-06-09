---
title: Create an FCI with Azure Shared Disks 
description: "Use Azure Shared Disks to create a failover cluster instance (FCI) with SQL Server on Azure Virtual Machines."
services: virtual-machines
documentationCenter: na
author: MashaMSFT
editor: monicar
tags: azure-service-management

ms.service: virtual-machines-sql

ms.custom: na
ms.topic: article
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 06/18/2020
ms.author: mathoma
---

# Create an FCI with Azure Shared Disks (SQL Server on Azure VMs)
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

This article explains how to create a failover cluster instance (FCI) using Azure Shared Disks with SQL Server on Azure Virtual Machines. 

See an overview of [FCI with SQL Server on Azure VMs](failover-cluster-instance-overview.md) and [best practices](hadr-high-availability-disaster-recovery-best-practices.md) to learn more. 

## Prerequisites 

Before you complete the steps in this article, you should already have:

- A Microsoft Azure subscription.
- [Two or more prepared Windows Azure Virtual Machines](failover-cluster-instance-prepare-vm.md).
- An account that has permissions to create objects on both Azure virtual machines and in Active Directory.
- The latest version of [PowerShell](/powershell/azure/install-az-ps?view=azps-4.2.0). 

## Add Windows Failover Clustering

1. Connect to the first virtual machine with RDP by using a domain account that's a member of the local administrators and that has permission to create objects in Active Directory. Use this account for the rest of the configuration.

1. [Add Failover Clustering to each virtual machine](availability-group-manually-configure-prerequisites-tutorial.md#add-failover-clustering-features-to-both-sql-server-vms).

   To install Failover Clustering from the UI, take these steps on both virtual machines:
   1. In **Server Manager**, select **Manage**, and then select **Add Roles and Features**.
   1. In the **Add Roles and Features Wizard**, select **Next** until you get to **Select Features**.
   1. In **Select Features**, select **Failover Clustering**. Include all required features and the management tools. Select **Add Features**.
   1. Select **Next**, and then select **Finish** to install the features.

   To install Failover Clustering by using PowerShell, run the following script from an administrator PowerShell session on one of the virtual machines:

   ```powershell
   $nodes = ("<node1>","<node2>")
   Invoke-Command  $nodes {Install-WindowsFeature Failover-Clustering -IncludeAllSubFeature -IncludeManagementTools}
   ```

For further reference about the next steps, see the instructions under Step 3 of [Hyper-converged solution using Storage Spaces Direct in Windows Server 2016](https://technet.microsoft.com/windows-server-docs/storage/storage-spaces/hyper-converged-solution-using-storage-spaces-direct#step-3-configure-storage-spaces-direct).


## Create the failover cluster

To create the failover cluster, you need:
- The names of the virtual machines that will become the cluster nodes.
- A name for the failover cluster
- An IP address for the failover cluster. You can use an IP address that's not used on the same Azure virtual network and subnet as the cluster nodes.

#### Windows Server 2008 through Windows Server 2016

The following PowerShell script creates a failover cluster for Windows Server 2008 through Windows Server 2016. Update the script with the names of the nodes (the virtual machine names) and an available IP address from the Azure virtual network.

```powershell
New-Cluster -Name <FailoverCluster-Name> -Node ("<node1>","<node2>") –StaticAddress <n.n.n.n> -NoStorage
```   

#### Windows Server 2019

The following PowerShell script creates a failover cluster for Windows Server 2019. For more information, see [Failover cluster: Cluster Network Object](https://blogs.windows.com/windowsexperience/2018/08/14/announcing-windows-server-2019-insider-preview-build-17733/#W0YAxO8BfwBRbkzG.97). Update the script with the names of the nodes (the virtual machine names) and an available IP address from the Azure virtual network.

```powershell
New-Cluster -Name <FailoverCluster-Name> -Node ("<node1>","<node2>") –StaticAddress <n.n.n.n> -NoStorage -ManagementPointNetworkType Singleton 
```

## Configure quorum

Configure the quorum solution that best suits your business needs. You can configure a [disk witness], a [cloud witness], or a [file share witness]. For more information, see [Quorum with SQL Server VMs in Azure](hadr-high-availability-disaster-recovery-best-practices.md#quorum). 


## Validate the cluster

Validate the cluster in the UI or by using PowerShell.

To validate the cluster by using the UI, take the following steps on one of the virtual machines:

1. Under **Server Manager**, select **Tools**, and then select **Failover Cluster Manager**.
1. Under **Failover Cluster Manager**, select **Action**, and then select **Validate Configuration**.
1. Select **Next**.
1. Under **Select Servers or a Cluster**, enter the names of both virtual machines.
1. Under **Testing options**, select **Run only tests I select**. Select **Next**.
1. Under **Test Selection**, select all tests except for **Storage**, as shown here:

   ![Select cluster validation tests](./media/failover-cluster-instance-storage-spaces-direct-manually-configure/10-validate-cluster-test.png)

1. Select **Next**.
1. Under **Confirmation**, select **Next**.

The Validate a Configuration Wizard runs the validation tests.

To validate the cluster by using PowerShell, run the following script from an administrator PowerShell session on one of the virtual machines:

   ```powershell
   Test-Cluster –Node ("<node1>","<node2>") –Include "Storage Spaces Direct", "Inventory", "Network", "System Configuration"
   ```

##  Test failover 

In **Failover Cluster Manager**, verify that you can move the storage resource to the other cluster node. If you can connect to the failover cluster by using **Failover Cluster Manager** and move the storage from one node to the other, you're ready to configure the FCI.


##  Create the SQL Server FCI

After you've configured the failover cluster and all cluster components, including storage, you can create the SQL Server FCI.

1. Connect to the first virtual machine by using RDP.

1. In **Failover Cluster Manager**, make sure all Core Cluster Resources are on the first virtual machine. If necessary, move all resources to that virtual machine.

1. Locate the installation media. If the virtual machine uses one of the Azure Marketplace images, the media is located at `C:\SQLServer_<version number>_Full`. Select **Setup**.

1. In **SQL Server Installation Center**, select **Installation**.

1. Select **New SQL Server failover cluster installation**. Follow the instructions in the wizard to install the SQL Server FCI.

   The FCI data directories need to be on clustered storage. With Storage Spaces Direct, it's not a shared disk, but a mount point to a volume on each server. Storage Spaces Direct synchronizes the volume between both nodes. The volume is presented to the cluster as a Cluster Shared Volume. Use the CSV mount point for the data directories.

   ![Data directories](./media/failover-cluster-instance-storage-spaces-direct-manually-configure/20-data-dicrectories.png)

1. After you complete the instructions in the wizard, Setup will install a SQL Server FCI on the first node.

1. After Setup installs the FCI on the first node, connect to the second node by using RDP.

1. Open the **SQL Server Installation Center**. Select **Installation**.

1. Select **Add node to a SQL Server failover cluster**. Follow the instructions in the wizard to install SQL Server and add the server to the FCI.

   >[!NOTE]
   >If you used an Azure Marketplace gallery image that contains SQL Server, SQL Server tools were included with the image. If you didn't use one of those images, install the SQL Server tools separately. See [Download SQL Server Management Studio (SSMS)](https://msdn.microsoft.com/library/mt238290.aspx).


## Register with the SQL VM resource provider

To manage your SQL Server VM from the portal, register it with the SQL VM resource provider in [lightweight management mode](sql-vm-resource-provider-register.md#lightweight-management-mode), currently the only mode supported with FCI and SQL Server on Azure VMs. 


Register a SQL Server VM in lightweight mode with PowerShell:  

```powershell-interactive
# Get the existing compute VM
$vm = Get-AzVM -Name <vm_name> -ResourceGroupName <resource_group_name>
         
# Register SQL VM with 'Lightweight' SQL IaaS agent
New-AzSqlVM -Name $vm.Name -ResourceGroupName $vm.ResourceGroupName -Location $vm.Location `
   -LicenseType PAYG -SqlManagementType LightWeight  
```

## Configure connectivity 

To route traffic appropriately to the current primary node, configure the connectivity option that is suitable for your environment. You can create an [Azure Load  Balancer](hadr-azure-load-balancer-configure.md) or, if you're using SQL Server 2019 and Windows Server 2019, you can preview the [distributed network name](hadr-distributed-network-name-dnn-configure.md) feature instead. 

## Limitations

- MSDTC is not supported on Windows Server 2016 and earlier. 
- Currently, only registering with the SQL VM resource provider in [lightweight management mode](sql-vm-resource-provider-register.md#management-modes) is supported with FCI and SQL Server on Azure VMs. 

## Next steps

If you haven't already, configure connectivity to your cluster with an [Azure Load  Balancer](hadr-azure-load-balancer-configure.md) or [distributed network name](hadr-distributed-network-name-dnn-configure.md). Be sure to also register your SQL Server FCI with the SQL VM resource provider in [lightweight management mode](sql-vm-resource-provider-register.md#lightweight-management-mode). 

If Azure Shared Disks are not the appropriate FCI storage solution for you, consider creating your FCI using [Premium File Shares](failover-cluster-instance-premium-file-share-manually-configure.md) or [Storage Spaces Direct](failover-cluster-instance-storage-spaces-direct-manually-configure.md) instead. 

See an overview of [FCI with SQL Server on Azure VMs](failover-cluster-instance-overview.md) and [best practices](hadr-high-availability-disaster-recovery-best-practices.md) to learn more. 


For additional information see: 
- [Windows cluster technologies](/windows-server/failover-clustering/failover-clustering-overview)   
- [SQL Server Failover Cluster Instances](/sql/sql-server/failover-clusters/windows/always-on-failover-cluster-instances-sql-server)