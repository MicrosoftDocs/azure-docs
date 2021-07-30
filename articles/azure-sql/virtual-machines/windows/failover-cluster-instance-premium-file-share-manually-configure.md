---
title: Create an FCI with a premium file share
description: "Use a premium file share (PFS) to create a failover cluster instance (FCI) with SQL Server on Azure virtual machines."
services: virtual-machines
documentationCenter: na
author: MashaMSFT
editor: monicar
tags: azure-service-management
ms.service: virtual-machines-sql
ms.subservice: hadr
ms.custom: na, devx-track-azurepowershell
ms.topic: how-to
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 06/18/2020
ms.author: mathoma
---

# Create an FCI with a premium file share (SQL Server on Azure VMs)
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

This article explains how to create a failover cluster instance (FCI) with SQL Server on Azure Virtual Machines (VMs) by using a [premium file share](../../../storage/files/storage-how-to-create-file-share.md).

Premium file shares are Storage Spaces Direct (SSD)-backed, consistently low-latency file shares that are fully supported for use with failover cluster instances for SQL Server 2012 or later on Windows Server 2012 or later. Premium file shares give you greater flexibility, allowing you to resize and scale a file share without any downtime.

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

1. Sign in to the [Azure portal](https://portal.azure.com). and go to your storage account.
1. Go to **File shares** under **Data storage**, and then select the premium file share you want to use for your SQL storage.
1. Select **Connect** to bring up the connection string for your file share.
1. In the drop-down list, select the drive letter you want to use, choose **Storage account key** as the authentication method, and then copy the code block to a text editor, such as Notepad.

   :::image type="content" source="media/failover-cluster-instance-premium-file-share-manually-configure/premium-file-storage-commands.png" alt-text="Copy the PowerShell command from the file share connect portal":::

1. Use Remote Desktop Protocol (RDP) to connect to the SQL Server VM with the account that your SQL Server FCI will use for the service account.
1. Open an administrative PowerShell command console.
1. Run the command that you copied earlier to your text editor from the File share portal.
1. Go to the share by using either File Explorer or the **Run** dialog box (Windows + R on your keyboard). Use the network path `\\storageaccountname.file.core.windows.net\filesharename`. For example, `\\sqlvmstorageaccount.file.core.windows.net\sqlpremiumfileshare`
1. Create at least one folder on the newly connected file share to place your SQL data files into.
1. Repeat these steps on each SQL Server VM that will participate in the cluster.

  > [!IMPORTANT]
  > - Consider using a separate file share for backup files to save the input/output operations per second (IOPS) and space capacity of this share for data and log files. You can use either a Premium or Standard File Share for backup files.


## Add Windows cluster feature

1. Connect to the first virtual machine with RDP by using a domain account that's a member of the local administrators and that has permission to create objects in Active Directory. Use this account for the rest of the configuration.

1. [Add failover clustering to each virtual machine](availability-group-manually-configure-prerequisites-tutorial.md#add-failover-clustering-features-to-both-sql-server-vms).

   To install failover clustering from the UI, do the following on both virtual machines:
   1. In **Server Manager**, select **Manage**, and then select **Add Roles and Features**.
   1. In the **Add Roles and Features** wizard, select **Next** until you get to **Select Features**.
   1. In **Select Features**, select **Failover Clustering**. Include all required features and the management tools. 
   1. Select **Add Features**.
   1. Select **Next**, and then select **Finish** to install the features.

   To install failover clustering by using PowerShell, run the following script from an administrator PowerShell session on one of the virtual machines:

   ```powershell
   $nodes = ("<node1>","<node2>")
   Invoke-Command  $nodes {Install-WindowsFeature Failover-Clustering -IncludeAllSubFeature -IncludeManagementTools}
   ```



## Create failover cluster

To create the failover cluster, you need:

- The names of the virtual machines that will become the cluster nodes.
- A name for the failover cluster.
- An IP address for the failover cluster. You can use an IP address that's not used on the same Azure virtual network and subnet as the cluster nodes.


# [Windows Server 2012 - 2016](#tab/windows2012)

The following PowerShell script creates a failover cluster for Windows Server 2012 through Windows Server 2016. Update the script with the names of the nodes (the virtual machine names) and an available IP address from the Azure virtual network.

```powershell
New-Cluster -Name <FailoverCluster-Name> -Node ("<node1>","<node2>") –StaticAddress <n.n.n.n> -NoStorage
```   

# [Windows Server 2019](#tab/windows2019)

The following PowerShell script creates a failover cluster for Windows Server 2019.  Update the script with the names of the nodes (the virtual machine names) and an available IP address from the Azure virtual network.

```powershell
New-Cluster -Name <FailoverCluster-Name> -Node ("<node1>","<node2>") –StaticAddress <n.n.n.n> -NoStorage -ManagementPointNetworkType Singleton 
```

For more information, see [Failover cluster: Cluster Network Object](https://blogs.windows.com/windowsexperience/2018/08/14/announcing-windows-server-2019-insider-preview-build-17733/#W0YAxO8BfwBRbkzG.97).

---

## Configure quorum

Although the disk witness is the most resilient quorum option, it requires an Azure shared disk which imposes some limitations to the failover cluster instance when configured with premium file shares. As such, the cloud witness is the recommended quorum solution for this type of cluster configuration for SQL Server on Azure VMs. Otherwise, configure a file share witness. 

If you have an even number of votes in the cluster, configure the [quorum solution](hadr-cluster-quorum-configure-how-to.md) that best suits your business needs. For more information, see [Quorum with SQL Server VMs](hadr-windows-server-failover-cluster-overview.md#quorum). 

## Validate cluster

Validate the cluster in the UI or by using PowerShell.

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
1. Under **Confirmation**, select **Next**.

The **Validate a Configuration** wizard runs the validation tests.

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

   The FCI data directories need to be on the premium file share. Enter the full path of the share, in this format: `\\storageaccountname.file.core.windows.net\filesharename\foldername`. A warning will appear, telling you that you've specified a file server as the data directory. This warning is expected. Ensure that the user account you used to access the VM via RDP when you persisted the file share is the same account that the SQL Server service uses to avoid possible failures.

   :::image type="content" source="media/failover-cluster-instance-premium-file-share-manually-configure/use-file-share-as-data-directories.png" alt-text="Use file share as SQL data directories":::

1. After you complete the steps in the wizard, Setup will install a SQL Server FCI on the first node.

1. After Setup installs the FCI on the first node, connect to the second node by using RDP.

1. Open the **SQL Server Installation Center**, and then select **Installation**.

1. Select **Add node to a SQL Server failover cluster**. Follow the instructions in the wizard to install SQL Server and add the server to the FCI.

   >[!NOTE]
   >If you used an Azure Marketplace gallery image with SQL Server, SQL Server tools were included with the image. If you didn't use one of those images, install the SQL Server tools separately. For more information, see [Download SQL Server Management Studio (SSMS)](/sql/ssms/download-sql-server-management-studio-ssms).

1. Repeat these steps on any other nodes that you want to add to the SQL Server failover cluster instance. 

## Register with the SQL VM RP

To manage your SQL Server VM from the portal, register it with the SQL IaaS Agent extension (RP) in [lightweight management mode](sql-agent-extension-manually-register-single-vm.md#lightweight-management-mode), currently the only mode that's supported with FCI and SQL Server on Azure VMs. 

Register a SQL Server VM in lightweight mode with PowerShell (-LicenseType can be `PAYG` or `AHUB`):

```powershell-interactive
# Get the existing compute VM
$vm = Get-AzVM -Name <vm_name> -ResourceGroupName <resource_group_name>
         
# Register SQL VM with 'Lightweight' SQL IaaS agent
New-AzSqlVM -Name $vm.Name -ResourceGroupName $vm.ResourceGroupName -Location $vm.Location `
   -LicenseType ???? -SqlManagementType LightWeight  
```

## Configure connectivity 

You can configure a virtual network name, or a distributed network name for a failover cluster instance. [Review the differences between the two](hadr-windows-server-failover-cluster-overview.md#virtual-network-name-vnn) and then deploy either a [distributed network name](failover-cluster-instance-distributed-network-name-dnn-configure.md) or a [virtual network name](failover-cluster-instance-vnn-azure-load-balancer-configure.md) for your failover cluster instance.

## Limitations

- Microsoft Distributed Transaction Coordinator (MSDTC) is not supported on Windows Server 2016 and earlier. 
- Filestream isn't supported for a failover cluster with a premium file share. To use filestream, deploy your cluster by using [Storage Spaces Direct](failover-cluster-instance-storage-spaces-direct-manually-configure.md) or [Azure shared disks](failover-cluster-instance-azure-shared-disks-manually-configure.md) instead.
- Only registering with the SQL IaaS Agent extension in [lightweight management mode](sql-server-iaas-agent-extension-automate-management.md#management-modes) is supported. 
- Database Snapshots are not currently supported with [Azure Files due to sparse files limitations](/rest/api/storageservices/features-not-supported-by-the-azure-file-service).  

## Next steps

If you haven't already done so, configure connectivity to your FCI with a [virtual network name and an Azure load balancer](failover-cluster-instance-vnn-azure-load-balancer-configure.md) or [distributed network name (DNN)](failover-cluster-instance-distributed-network-name-dnn-configure.md). 


If premium file shares are not the appropriate FCI storage solution for you, consider creating your FCI by using [Azure shared disks](failover-cluster-instance-azure-shared-disks-manually-configure.md) or [Storage Spaces Direct](failover-cluster-instance-storage-spaces-direct-manually-configure.md) instead. 

To learn more, see:

- [Windows Server Failover Cluster with SQL Server on Azure VMs](hadr-windows-server-failover-cluster-overview.md)
- [Failover cluster instances with SQL Server on Azure VMs](failover-cluster-instance-overview.md)
- [Failover cluster instance overview](/sql/sql-server/failover-clusters/windows/always-on-failover-cluster-instances-sql-server)
- [HADR settings for SQL Server on Azure VMs](hadr-cluster-best-practices.md)

