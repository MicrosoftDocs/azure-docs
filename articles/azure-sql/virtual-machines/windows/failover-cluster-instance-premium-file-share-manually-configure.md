---
title: Create an FCI with a premium file share
description: "Use a premium file share (PFS) to create a failover cluster instance (FCI) with SQL Server on Azure virtual machines."
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
# Create an FCI with a premium file share (SQL Server on Azure VMs)
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

> [!TIP]
> Eliminate the need for an Azure Load Balancer or distributed network name (DNN) for your failover cluster instance by creating your SQL Server VMs in [multiple subnets](failover-cluster-instance-prepare-vm.md#subnets) within the same Azure virtual network.


This article explains how to create a failover cluster instance (FCI) with SQL Server on Azure Virtual Machines (VMs) by using a [premium file share](../../../storage/files/storage-how-to-create-file-share.md).

Premium file shares are SSD backed and provide consistently low-latency file shares that are fully supported for use with failover cluster instances for SQL Server 2012 or later on Windows Server 2012 or later. Premium file shares give you greater flexibility, allowing you to resize and scale a file share without any downtime.

To learn more, see an overview of [FCI with SQL Server on Azure VMs](failover-cluster-instance-overview.md) and [cluster best practices](hadr-cluster-best-practices.md). 

> [!NOTE]
> It's now possible to lift and shift your failover cluster instance solution to SQL Server on Azure VMs using Azure Migrate. See [Migrate failover cluster instance](../../migration-guides/virtual-machines/sql-server-failover-cluster-instance-to-sql-on-azure-vm.md) to learn more. 

## Prerequisites

Before you complete the instructions in this article, you should already have:

- An Azure subscription.
- An account that has permissions to create objects on both Azure virtual machines and in Active Directory.
- [Two or more prepared Windows Azure virtual machines](failover-cluster-instance-prepare-vm.md) in an [availability set](../../../virtual-machines/windows/tutorial-availability-sets.md#create-an-availability-set) or different [availability zones](../../../virtual-machines/windows/create-portal-availability-zone.md#confirm-zone-for-managed-disk-and-ip-address).
- A [premium file share](../../../storage/files/storage-how-to-create-file-share.md) to be used as the clustered drive, based on the storage quota of your database for your data files.
- The latest version of [PowerShell](/powershell/azure/install-az-ps). 

## Mount premium file share

To mount your premium file share, follow these steps: 

1. Sign in to the [Azure portal](https://portal.azure.com). and go to your storage account.
1. Go to **File shares** under **Data storage**, and then select the premium file share you want to use for your SQL storage.
1. Select **Connect** to bring up the connection string for your file share.
1. In the drop-down list, select the drive letter you want to use, choose **Storage account key** as the authentication method, and then copy the code block to a text editor, such as Notepad.

   :::image type="content" source="media/failover-cluster-instance-premium-file-share-manually-configure/premium-file-storage-commands.png" alt-text="Copy the PowerShell command from the file share connect portal":::

1. Use Remote Desktop Protocol (RDP) to connect to the SQL Server VM with the **account that your SQL Server FCI will use for the service account**.
1. Open an administrative PowerShell command console.
1. Run the command that you copied earlier to your text editor from the File share portal.
1. Go to the share by using either File Explorer or the **Run** dialog box (Windows + R on your keyboard). Use the network path `\\storageaccountname.file.core.windows.net\filesharename`. For example, `\\sqlvmstorageaccount.file.core.windows.net\sqlpremiumfileshare`
1. Create at least one folder on the newly connected file share to place your SQL data files into.
1. Repeat these steps on each SQL Server VM that will participate in the cluster.

  > [!IMPORTANT]
  > Consider using a separate file share for backup files to save the input/output operations per second (IOPS) and space capacity of this share for data and log files. You can use either a Premium or Standard File Share for backup files.

## Create Windows Failover Cluster

The steps to create your Windows Server Failover cluster vary depending on if you deployed your SQL Server VMs to a single subnet, or multiple subnets. To create your cluster, follow the steps in the tutorial for either a [multi-subnet scenario](availability-group-manually-configure-tutorial-multi-subnet.md#add-failover-cluster-feature) or a [single subnet scenario](availability-group-manually-configure-tutorial-single-subnet.md#create-the-cluster). Though these tutorials are for creating an availability group, the steps to create the cluster are the same. 


## Configure quorum

The cloud witness is the recommended quorum solution for this type of cluster configuration for SQL Server on Azure VMs.  

If you have an even number of votes in the cluster, configure the [quorum solution](hadr-cluster-quorum-configure-how-to.md) that best suits your business needs. For more information, see [Quorum with SQL Server VMs](hadr-windows-server-failover-cluster-overview.md#quorum). 

## Validate cluster

Validate the cluster on one of the virtual machines by using the Failover Cluster Manager UI or PowerShell.

To validate the cluster by using the UI, do the following on one of the virtual machines:

1. Under **Server Manager**, select **Tools**, and then select **Failover Cluster Manager**.
1. Under **Failover Cluster Manager**, select **Action**, and then select **Validate Configuration**.
1. Select **Next**.
1. Under **Select Servers or a Cluster**, enter the names of both virtual machines.
1. Under **Testing options**, select **Run only tests I select**. 
1. Select **Next**.
1. Under **Test Selection**, select all tests except for **Storage** and **Storage Spaces Direct**, as shown here:

   :::image type="content" source="media/failover-cluster-instance-premium-file-share-manually-configure/cluster-validation.png" alt-text="Select cluster validation tests":::

1. Select **Next**.
1. Under **Confirmation**, select **Next**. The **Validate a Configuration** wizard runs the validation tests.


To validate the cluster by using PowerShell, run the following script from an administrator PowerShell session on one of the virtual machines:

```powershell
Test-Cluster –Node ("<node1>","<node2>") –Include "Inventory", "Network", "System Configuration"
```



## Test cluster failover

Test the failover of your cluster. In **Failover Cluster Manager**, right-click your cluster, select **More Actions** > **Move Core Cluster Resource** > **Select node**, and then select the other node of the cluster. Move the core cluster resource to every node of the cluster, and then move it back to the primary node. If you can successfully move the cluster to each node, you're ready to install SQL Server.  

:::image type="content" source="media/failover-cluster-instance-premium-file-share-manually-configure/test-cluster-failover.png" alt-text="Test cluster failover by moving the core resource to the other nodes":::


## Create SQL Server FCI

After you've configured the failover cluster, you can create the SQL Server FCI.

1. Connect to the first virtual machine by using RDP.

1. In **Failover Cluster Manager**, make sure that all the core cluster resources are on the first virtual machine. If necessary, move all resources to this virtual machine.

1. Locate the installation media. If the virtual machine uses one of the Azure Marketplace images, the media is located at `C:\SQLServer_<version number>_Full`. 

1. Select **Setup**.

1. In the **SQL Server Installation Center**, select **Installation**.

1. Select **New SQL Server failover cluster installation**, and then follow the instructions in the wizard to install the SQL Server FCI.

1. On the **Cluster Network Configuration** page, the IP you provide varies depending on if your SQL Server VMs were deployed to a single subnet, or multiple subnets. 

   1. For a **single subnet environment**, provide the IP address that you plan to add to the [Azure Load Balancer](failover-cluster-instance-vnn-azure-load-balancer-configure.md)
   1. For a **multi-subnet environment**, provide the secondary IP address in the subnet of the _first_ SQL Server VM that you previously designated as the [IP address of the failover cluster instance network name](failover-cluster-instance-prepare-vm.md#assign-secondary-ip-addresses):

   :::image type="content" source="./media/failover-cluster-instance-azure-shared-disk-manually-configure/sql-install-cluster-network-secondary-ip-vm-1.png" alt-text="provide the secondary IP address in the subnet of the first SQL Server VM that you previously designated as the IP address of the failover cluster instance network name":::

1. In **Database Engine Configuration**, the data directories need to be on the premium file share. Enter the full path of the share, in this format: `\\storageaccountname.file.core.windows.net\filesharename\foldername`. A warning appears, telling you that you've specified a file server as the data directory. This warning is expected. Ensure that the user account you used to access the VM via RDP when you persisted the file share is the same account that the SQL Server service uses to avoid possible failures.

   :::image type="content" source="media/failover-cluster-instance-premium-file-share-manually-configure/use-file-share-as-data-directories.png" alt-text="Use file share as SQL data directories":::

1. After you complete the steps in the wizard, Setup installs a SQL Server FCI on the first node.

1. After FCI installation succeeds on the first node, connect to the second node by using RDP.

1. Open the **SQL Server Installation Center**, and then select **Installation**.

1. Select **Add node to a SQL Server failover cluster**. Follow the instructions in the wizard to install SQL Server and add the node to the FCI.

1. For a multi-subnet scenario, in **Cluster Network Configuration**, enter the secondary IP address in the subnet of the _second_ SQL Server VM that you previously designated as the [IP address of the failover cluster instance network name](failover-cluster-instance-prepare-vm.md#assign-secondary-ip-addresses)

    :::image type="content" source="./media/failover-cluster-instance-azure-shared-disk-manually-configure/sql-install-cluster-network-secondary-ip-vm-2.png" alt-text="enter the secondary IP address in the subnet of the second SQL Server VM subnet that you previously designated as the IP address of the failover cluster instance network name":::

    After selecting **Next** in **Cluster Network Configuration**, setup shows a dialog box indicating that SQL Server Setup detected multiple subnets as in the example image.  Select **Yes** to confirm. 

    :::image type="content" source="./media/failover-cluster-instance-azure-shared-disk-manually-configure/sql-install-multi-subnet-confirmation.png" alt-text="Multi Subnet Confirmation":::
   

1. After you complete the instructions in the wizard, setup adds the second SQL Server FCI node. 

1. Repeat these steps on any other nodes that you want to add to the SQL Server failover cluster instance. 


>[!NOTE]
> Azure Marketplace gallery images come with SQL Server Management Studio installed. If you didn't use a marketplace image [Download SQL Server Management Studio (SSMS)](/sql/ssms/download-sql-server-management-studio-ssms).


## Register with SQL IaaS extension 

To manage your SQL Server VM from the portal, register it with the SQL IaaS Agent extension in [lightweight management mode](sql-agent-extension-manually-register-single-vm.md#lightweight-mode), currently the only mode that's supported with FCI and SQL Server on Azure VMs. 

Register a SQL Server VM in lightweight mode with PowerShell (-LicenseType can be `PAYG` or `AHUB`):

```powershell-interactive
# Get the existing compute VM
$vm = Get-AzVM -Name <vm_name> -ResourceGroupName <resource_group_name>
         
# Register SQL VM with 'Lightweight' SQL IaaS agent
New-AzSqlVM -Name $vm.Name -ResourceGroupName $vm.ResourceGroupName -Location $vm.Location `
   -LicenseType ???? -SqlManagementType LightWeight  
```

## Configure connectivity

If you deployed your SQL Server VMs in multiple subnets, skip this step. If you deployed your SQL Server VMs to a single subnet, then you'll need to configure an additional component to route traffic to your FCI. You can configure a virtual network name (VNN) with an Azure Load Balancer, or a distributed network name for a failover cluster instance. [Review the differences between the two](hadr-windows-server-failover-cluster-overview.md#virtual-network-name-vnn) and then deploy either a [distributed network name](failover-cluster-instance-distributed-network-name-dnn-configure.md) or a [virtual network name and Azure Load Balancer](failover-cluster-instance-vnn-azure-load-balancer-configure.md) for your failover cluster instance.  

## Limitations

- Microsoft Distributed Transaction Coordinator (MSDTC) is not supported on Windows Server 2016 and earlier. 
- Filestream isn't supported for a failover cluster with a premium file share. To use filestream, deploy your cluster by using [Storage Spaces Direct](failover-cluster-instance-storage-spaces-direct-manually-configure.md) or [Azure shared disks](failover-cluster-instance-azure-shared-disks-manually-configure.md) instead.
- Only registering with the SQL IaaS Agent extension in [lightweight management mode](sql-server-iaas-agent-extension-automate-management.md#management-modes) is supported. 
- Database Snapshots are not currently supported with [Azure Files due to sparse files limitations](/rest/api/storageservices/features-not-supported-by-the-azure-file-service).
- Since database snapshots are not supported, CHECKDB for user databases falls back to CHECKDB WITH TABLOCK. TABLOCK limits the checks that are performed - DBCC CHECKCATALOG is not run on the database, and Service Broker data is not validated.
- CHECKDB on MASTER and MSDB database is not supported. 
- Databases that use the in-memory OLTP feature are not supported on a failover cluster instance deployed with a premium file share. If your business requires in-memory OLTP, consider deploying your FCI with [Azure shared disks](failover-cluster-instance-azure-shared-disks-manually-configure.md) or [Storage Spaces Direct](failover-cluster-instance-storage-spaces-direct-manually-configure.md) instead.

## Next steps

If premium file shares are not the appropriate FCI storage solution for you, consider creating your FCI by using [Azure shared disks](failover-cluster-instance-azure-shared-disks-manually-configure.md) or [Storage Spaces Direct](failover-cluster-instance-storage-spaces-direct-manually-configure.md) instead. 

To learn more, see:

- [Windows Server Failover Cluster with SQL Server on Azure VMs](hadr-windows-server-failover-cluster-overview.md)
- [Failover cluster instances with SQL Server on Azure VMs](failover-cluster-instance-overview.md)
- [Failover cluster instance overview](/sql/sql-server/failover-clusters/windows/always-on-failover-cluster-instances-sql-server)
- [HADR settings for SQL Server on Azure VMs](hadr-cluster-best-practices.md)

