---
title: Create an FCI with Storage Spaces Direct
description: "Use Storage Spaces Direct to create a failover cluster instance (FCI) with SQL Server on Azure virtual machines."
services: virtual-machines
documentationCenter: na
author: rajeshsetlem
editor: monicar
tags: azure-service-management
ms.service: virtual-machines-sql
ms.subservice: hadr
ms.custom: na, devx-track-azurepowershell
ms.topic: how-to
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 11/10/2021
ms.author: rsetlem
ms.reviewer: mathoma
---

# Create an FCI with Storage Spaces Direct (SQL Server on Azure VMs)
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

> [!TIP]
> Eliminate the need for an Azure Load Balancer or distributed network name (DNN) for your failover cluster instance by creating your SQL Server VMs in [multiple subnets](failover-cluster-instance-prepare-vm.md#subnets) within the same Azure virtual network.

This article explains how to create a failover cluster instance (FCI) by using [Storage Spaces Direct](/windows-server/storage/storage-spaces/storage-spaces-direct-overview) with SQL Server on Azure Virtual Machines (VMs). Storage Spaces Direct acts as a software-based virtual storage area network (VSAN) that synchronizes the storage (data disks) between the nodes (Azure VMs) in a Windows cluster. 

To learn more, see an overview of [FCI with SQL Server on Azure VMs](failover-cluster-instance-overview.md) and [cluster best practices](hadr-cluster-best-practices.md). 

> [!NOTE]
> It's now possible to lift and shift your failover cluster instance solution to SQL Server on Azure VMs using Azure Migrate. See [Migrate failover cluster instance](../../migration-guides/virtual-machines/sql-server-failover-cluster-instance-to-sql-on-azure-vm.md) to learn more. 


## Overview 

[Storage Spaces Direct (S2D)](/windows-server/storage/storage-spaces/storage-spaces-direct-overview) supports two types of architectures: converged and hyperconverged. A hyperconverged infrastructure places the storage on the same servers that host the clustered application, so that storage is on each SQL Server FCI node. 

The following diagram shows the complete solution, which uses hyperconverged Storage Spaces Direct with SQL Server on Azure VMs: 

![Diagram of the complete solution, using hyperconverged Storage Spaces Direct](./media/failover-cluster-instance-storage-spaces-direct-manually-configure/00-sql-fci-s2d-complete-solution.png)

The preceding diagram shows the following resources in the same resource group:

- Two virtual machines in a Windows Server failover cluster. When a virtual machine is in a failover cluster, it's also called a *cluster node* or *node*.
- Each virtual machine has two or more data disks.
- Storage Spaces Direct synchronizes the data on the data disks and presents the synchronized storage as a storage pool.
- The storage pool presents a Cluster Shared Volume (CSV) to the failover cluster.
- The SQL Server FCI cluster role uses the CSV for the data drives.
- An Azure load balancer to hold the IP address for the SQL Server FCI for a single subnet scenario.
- An Azure availability set holds all the resources.

 > [!NOTE]
> You can create this entire solution in Azure from a template. An example of a template is available on the GitHub [Azure quickstart templates](https://github.com/MSBrett/azure-quickstart-templates/tree/master/sql-server-2016-fci-existing-vnet-and-ad) page. This example isn't designed or tested for any specific workload. You can run the template to create a SQL Server FCI with Storage Spaces Direct storage connected to your domain. You can evaluate the template and modify it for your purposes.


## Prerequisites

Before you complete the instructions in this article, you should already have:

- An Azure subscription. Get started for [free](https://azure.microsoft.com/free/). 
- [Two or more prepared Windows Azure virtual machines](failover-cluster-instance-prepare-vm.md) in an [availability set](../../../virtual-machines/windows/tutorial-availability-sets.md#create-an-availability-set).
- An account that has permissions to create objects on both Azure virtual machines and in Active Directory.
- The latest version of [PowerShell](/powershell/azure/install-az-ps). 

## Create Windows Failover Cluster

The steps to create your Windows Server Failover cluster vary depending on if you deployed your SQL Server VMs to a single subnet, or multiple subnets. To create your cluster, follow the steps in the tutorial for either a [multi-subnet scenario](availability-group-manually-configure-tutorial-multi-subnet.md#add-failover-cluster-feature) or a [single subnet scenario](availability-group-manually-configure-tutorial-single-subnet.md#create-the-cluster). Though these tutorials are for creating an availability group, the steps to create the cluster are the same. 

## Configure quorum

Although the disk witness is the most resilient quorum option, it's not supported for failover cluster instances configured with Storage Spaces Direct. As such, the cloud witness is the recommended quorum solution for this type of cluster configuration for SQL Server on Azure VMs.

If you have an even number of votes in the cluster, configure the [quorum solution](hadr-cluster-quorum-configure-how-to.md) that best suits your business needs. For more information, see [Quorum with SQL Server VMs](hadr-windows-server-failover-cluster-overview.md#quorum). 

## Validate the cluster

Validate the cluster in the Failover Cluster Manager UI or by using PowerShell.

To validate the cluster by using the UI, do the following on one of the virtual machines:

1. Under **Server Manager**, select **Tools**, and then select **Failover Cluster Manager**.
1. Under **Failover Cluster Manager**, select **Action**, and then select **Validate Configuration**.
1. Select **Next**.
1. Under **Select Servers or a Cluster**, enter the names of both virtual machines.
1. Under **Testing options**, select **Run only tests I select**. 
1. Select **Next**.
1. Under **Test Selection**, select all tests except for **Storage**, as shown here:

   ![Select cluster validation tests](./media/failover-cluster-instance-storage-spaces-direct-manually-configure/10-validate-cluster-test.png)

1. Select **Next**.
1. Under **Confirmation**, select **Next**.

    The **Validate a Configuration** wizard runs the validation tests.

To validate the cluster by using PowerShell, run the following script from an administrator PowerShell session on one of the virtual machines:

   ```powershell
   Test-Cluster –Node ("<node1>","<node2>") –Include "Storage Spaces Direct", "Inventory", "Network", "System Configuration"
   ```


## Add storage

The disks for Storage Spaces Direct need to be empty. They can't contain partitions or other data. To clean the disks, follow the instructions in [Deploy Storage Spaces Direct](/windows-server/storage/storage-spaces/deploy-storage-spaces-direct#step-31-clean-drives).

1. [Enable Storage Spaces Direct](/windows-server/storage/storage-spaces/deploy-storage-spaces-direct#step-35-enable-storage-spaces-direct).

   The following PowerShell script enables Storage Spaces Direct:  

   ```powershell
   Enable-ClusterS2D
   ```

   In **Failover Cluster Manager**, you can now see the storage pool.

1. [Create a volume](/windows-server/storage/storage-spaces/deploy-storage-spaces-direct#step-36-create-volumes).

   Storage Spaces Direct automatically creates a storage pool when you enable it. You're now ready to create a volume. The PowerShell cmdlet `New-Volume` automates the volume creation process. This process includes formatting, adding the volume to the cluster, and creating a CSV. This example creates an 800 gigabyte (GB) CSV:

   ```powershell
   New-Volume -StoragePoolFriendlyName S2D* -FriendlyName VDisk01 -FileSystem CSVFS_REFS -Size 800GB
   ```   

   After you've run the preceding command, an 800-GB volume is mounted as a cluster resource. The volume is at `C:\ClusterStorage\Volume1\`.

   This screenshot shows a CSV with Storage Spaces Direct:

   ![Screenshot of a Cluster Shared Volume with Storage Spaces Direct](./media/failover-cluster-instance-storage-spaces-direct-manually-configure/15-cluster-shared-volume.png)



## Test cluster failover

Test the failover of your cluster. In **Failover Cluster Manager**, right-click your cluster, select **More Actions** > **Move Core Cluster Resource** > **Select node**, and then select the other node of the cluster. Move the core cluster resource to every node of the cluster, and then move it back to the primary node. If you can successfully move the cluster to each node, you're ready to install SQL Server.  

:::image type="content" source="media/failover-cluster-instance-premium-file-share-manually-configure/test-cluster-failover.png" alt-text="Test cluster failover by moving the core resource to the other nodes":::

## Create SQL Server FCI

After you've configured the failover cluster and all cluster components, including storage, you can create the SQL Server FCI.

1. Connect to the first virtual machine by using RDP.

1. In **Failover Cluster Manager**, make sure all core cluster resources are on the first virtual machine. If necessary, move all resources to that virtual machine.

1. Locate the installation media. If the virtual machine uses one of the Azure Marketplace images, the media is located at `C:\SQLServer_<version number>_Full`. Select **Setup**.

1. In **SQL Server Installation Center**, select **Installation**.

1. Select **New SQL Server failover cluster installation**. Follow the instructions in the wizard to install the SQL Server FCI.

1. On the **Cluster Network Configuration** page, the IP you provide varies depending on if your SQL Server VMs were deployed to a single subnet, or multiple subnets. 

   1. For a **single subnet environment**, provide the IP address that you plan to add to the [Azure Load Balancer](failover-cluster-instance-vnn-azure-load-balancer-configure.md)
   1. For a **multi-subnet environment**, provide the secondary IP address in the subnet of the _first_ SQL Server VM that you previously designated as the [IP address of the failover cluster instance network name](failover-cluster-instance-prepare-vm.md#assign-secondary-ip-addresses):

   :::image type="content" source="./media/failover-cluster-instance-azure-shared-disk-manually-configure/sql-install-cluster-network-secondary-ip-vm-1.png" alt-text="provide the secondary IP address in the subnet of the first SQL Server VM that you previously designated as the IP address of the failover cluster instance network name":::

1. In **Database Engine Configuration**, The FCI data directories need to be on clustered storage. With Storage Spaces Direct, it's not a shared disk but a mount point to a volume on each server. Storage Spaces Direct synchronizes the volume between both nodes. The volume is presented to the cluster as a CSV. Use the CSV mount point for the data directories.

   ![Data directories](./media/failover-cluster-instance-storage-spaces-direct-manually-configure/20-data-dicrectories.png)

1. After you complete the instructions in the wizard, Setup installs a SQL Server FCI on the first node.

1. After FCI installation succeeds on the first node, connect to the second node by using RDP.

1. Open the **SQL Server Installation Center**. Select **Installation**.

1. Select **Add node to a SQL Server failover cluster**. Follow the instructions in the wizard to install SQL Server and add the node to the FCI.

1. For a multi-subnet scenario, in **Cluster Network Configuration**, enter the secondary IP address in the subnet of the _second_ SQL Server VM that you previously designated as the [IP address of the failover cluster instance network name](failover-cluster-instance-prepare-vm.md#assign-secondary-ip-addresses)

    :::image type="content" source="./media/failover-cluster-instance-azure-shared-disk-manually-configure/sql-install-cluster-network-secondary-ip-vm-2.png" alt-text="enter the secondary IP address in the subnet of the second SQL Server VM subnet that you previously designated as the IP address of the failover cluster instance network name":::

    After selecting **Next** in **Cluster Network Configuration**, setup shows a dialog box indicating that SQL Server Setup detected multiple subnets as in the example image.  Select **Yes** to confirm. 

    :::image type="content" source="./media/failover-cluster-instance-azure-shared-disk-manually-configure/sql-install-multi-subnet-confirmation.png" alt-text="Multi Subnet Confirmation":::

1. After you complete the instructions in the wizard, setup adds the second SQL Server FCI node. 

1. Repeat these steps on any other nodes that you want to add to the SQL Server failover cluster instance. 


>[!NOTE]
> Azure Marketplace gallery images come with SQL Server Management Studio installed. If you didn't use a marketplace image [Download SQL Server Management Studio (SSMS)](/sql/ssms/ownload-sql-server-management-studio-ssms).


## Register with SQL IaaS extension 

To manage your SQL Server VM from the portal, register it with the SQL IaaS Agent extension  in [lightweight management mode](sql-agent-extension-manually-register-single-vm.md#lightweight-mode), currently the only mode that's supported with FCI and SQL Server on Azure VMs. 


Register a SQL Server VM in lightweight mode with PowerShell (-LicenseType can be `PAYG` or `AHUB`):

```powershell-interactive
# Get the existing compute VM
$vm = Get-AzVM -Name <vm_name> -ResourceGroupName <resource_group_name>
         
# Register SQL VM with 'Lightweight' SQL IaaS agent
New-AzSqlVM -Name $vm.Name -ResourceGroupName $vm.ResourceGroupName -Location $vm.Location `
   -LicenseType PAYG -SqlManagementType LightWeight  
```

## Configure connectivity

If you deployed your SQL Server VMs in multiple subnets, skip this step. If you deployed your SQL Server VMs to a single subnet, then you'll need to configure an additional component to route traffic to your FCI. You can configure a virtual network name (VNN) with an Azure Load Balancer, or a distributed network name for a failover cluster instance. [Review the differences between the two](hadr-windows-server-failover-cluster-overview.md#virtual-network-name-vnn) and then deploy either a [distributed network name](failover-cluster-instance-distributed-network-name-dnn-configure.md) or a [virtual network name and Azure Load Balancer](failover-cluster-instance-vnn-azure-load-balancer-configure.md) for your failover cluster instance.  


## Limitations

- Azure virtual machines support Microsoft Distributed Transaction Coordinator (MSDTC) on Windows Server 2019 with storage on CSVs and a [standard load balancer](../../../load-balancer/load-balancer-overview.md). MSDTC is not supported on Windows Server 2016 and earlier. 
- Disks that have been attached as NTFS-formatted disks can be used with Storage Spaces Direct only if the disk eligibility option is unchecked, or cleared, when storage is being added to the cluster. 
- Only registering with the SQL IaaS Agent extension in [lightweight management mode](sql-server-iaas-agent-extension-automate-management.md#management-modes) is supported.
- Failover cluster instances using Storage Spaces Direct as the shared storage do not support using a disk witness for the quorum of the cluster. Use a cloud witness instead. 

## Next steps

If Storage Spaces Direct isn't the appropriate FCI storage solution for you, consider creating your FCI by using [Azure shared disks](failover-cluster-instance-azure-shared-disks-manually-configure.md) or [Premium File Shares](failover-cluster-instance-premium-file-share-manually-configure.md) instead. 

To learn more, see:

- [Windows Server Failover Cluster with SQL Server on Azure VMs](hadr-windows-server-failover-cluster-overview.md)
- [Failover cluster instances with SQL Server on Azure VMs](failover-cluster-instance-overview.md)
- [Failover cluster instance overview](/sql/sql-server/failover-clusters/windows/always-on-failover-cluster-instances-sql-server)
- [HADR settings for SQL Server on Azure VMs](hadr-cluster-best-practices.md)
