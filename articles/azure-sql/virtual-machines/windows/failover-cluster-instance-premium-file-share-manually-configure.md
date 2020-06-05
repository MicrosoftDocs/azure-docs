---
title: Configure FCI with premium file share
description: "Learn to create a failover cluster instance (FCI) using a premium file share with SQL Server on Azure virtual machines."
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
ms.date: 06/02/2020
ms.author: mathoma
---

# Configure an FCI with premium file share (SQL Server on Azure VMs)
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

This article explains how to create a failover cluster instance (FCI) with SQL Server on Azure Virtual Machines (VMs) using a [premium file share](../../../storage/files/storage-how-to-create-premium-fileshare.md).

Premium file shares are SSD-backed, consistently low-latency file shares that are fully supported for use with Failover Cluster Instances for SQL Server 2012 or later on Windows Server 2012 or later. Premium file shares give you greater flexibility, allowing you to resize and scale a file share without any downtime.

For an overview, see [Failover cluster instances with SQL Server on Azure VMs](failover-cluster-instance-overview.md).

## Prerequisites

Before you complete the steps in this article, you should already have:

- A Microsoft Azure subscription.
- [Two prepared Windows Azure Virtual Machines](failover-cluster-instance-prepare-vm.md).
- A [premium file share](../../../storage/files/storage-how-to-create-premium-fileshare.md) to be used as the clustered drive, based on the storage quota of your database for your data files.
- The latest version of [PowerShell](/powershell/azure/install-az-ps?view=azps-4.2.0). 


## Mount the premium file share

1. Sign in to the [Azure portal](https://portal.azure.com) and go to your storage account.
1. Go to **File Shares** under **File service** and select the premium file share you want to use for your SQL storage.
1. Select **Connect** to bring up the connection string for your file share.
1. Select the drive letter you want to use from the drop-down list and then copy both code blocks to Notepad.


   :::image type="content" source="media/failover-cluster-instance-premium-file-share-manually-configure/premium-file-storage-commands.png" alt-text="Copy both PowerShell commands from the file share connect portal":::

1. Use RDP to connect to the SQL Server VM with the account that your SQL Server FCI will use for the service account.
1. Open an administrative PowerShell command console.
1. Run the commands that you saved earlier when you were working in the portal.
1. Go to the share by using either File Explorer or the **Run** dialog box (Windows logo key + r). Use the network path `\\storageaccountname.file.core.windows.net\filesharename`. For example, `\\sqlvmstorageaccount.file.core.windows.net\sqlpremiumfileshare`

1. Create at least one folder on the newly connected file share to place your SQL Data files into.
1. Repeat these steps on each SQL Server VM that will participate in the cluster.

  > [!IMPORTANT]
  > - Consider using a separate file share for backup files to save the IOPS and space capacity of this share for Data and Log files. You can use either a premium or standard file share for backup files.
  > - If you're on Windows 2012 R2 and older, follow these same steps to mount your file share that you are going to use as the file share witness. 

## Configure the cluster

The next step is to configure the failover cluster. In this step, you'll complete the following substeps:

1. Add the Windows Server Failover Clustering feature.
1. Validate the cluster.
1. Create the failover cluster.
1. Configure quorum. 


### Add Windows Server Failover Clustering

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

### Validate the cluster

Validate the cluster in the UI or by using PowerShell.

To validate the cluster by using the UI, take the following steps on one of the virtual machines:

1. Under **Server Manager**, select **Tools**, and then select **Failover Cluster Manager**.
1. Under **Failover Cluster Manager**, select **Action**, and then select **Validate Configuration**.
1. Select **Next**.
1. Under **Select Servers or a Cluster**, enter the names of both virtual machines.
1. Under **Testing options**, select **Run only tests I select**. Select **Next**.
1. Under **Test Selection**, select all tests except for **Storage** and **Storage Spaces Direct**, as shown here:

   :::image type="content" source="media/failover-cluster-instance-premium-file-share-manually-configure/cluster-validation.png" alt-text="Select cluster validation tests":::

1. Select **Next**.
1. Under **Confirmation**, select **Next**.

The **Validate a Configuration Wizard** runs the validation tests.

To validate the cluster by using PowerShell, run the following script from an administrator PowerShell session on one of the virtual machines:

   ```powershell
   Test-Cluster –Node ("<node1>","<node2>") –Include "Inventory", "Network", "System Configuration"
   ```

After you validate the cluster, create the failover cluster.

### Create the failover cluster

To create the failover cluster, you need:
- The names of the virtual machines that will become the cluster nodes.
- A name for the failover cluster
- An IP address for the failover cluster. You can use an IP address that's not used on the same Azure virtual network and subnet as the cluster nodes.

#### Windows Server 2012 through Windows Server 2016

The following PowerShell script creates a failover cluster for Windows Server 2012 through Windows Server 2016. Update the script with the names of the nodes (the virtual machine names) and an available IP address from the Azure virtual network.

```powershell
New-Cluster -Name <FailoverCluster-Name> -Node ("<node1>","<node2>") –StaticAddress <n.n.n.n> -NoStorage
```   

#### Windows Server 2019

The following PowerShell script creates a failover cluster for Windows Server 2019.  Update the script with the names of the nodes (the virtual machine names) and an available IP address from the Azure virtual network.

```powershell
New-Cluster -Name <FailoverCluster-Name> -Node ("<node1>","<node2>") –StaticAddress <n.n.n.n> -NoStorage -ManagementPointNetworkType Singleton 
```

For more information, see [Failover cluster: Cluster Network Object](https://blogs.windows.com/windowsexperience/2018/08/14/announcing-windows-server-2019-insider-preview-build-17733/#W0YAxO8BfwBRbkzG.97).

### Configure quorum

Configure the appropriate quorum for your environment and business needs:
- [Disk Witness]
- [Cloud Share Witness]
- [File Share Witness]

For more information, see [Quorum with FCI on and SQL Server on Azure VMs](failover-cluster-instance-overview.md#quorum).

### Test cluster failover

Test failover of your cluster. In **Failover Cluster Manager**, right-click your cluster and select **More Actions** > **Move Core Cluster Resource** > **Select node**, and then select the other node of the cluster. Move the core cluster resource to every node of the cluster, and then move it back to the primary node. If you can successfully move the cluster to each node, you're ready to install SQL Server.  

:::image type="content" source="media/failover-cluster-instance-premium-file-share-manually-configure/test-cluster-failover.png" alt-text="Test cluster failover by moving the core resource to the other nodes":::

## Create the SQL Server FCI

Once you've configured the failover cluster, you can create the SQL Server FCI.

1. Connect to the first virtual machine by using RDP.

1. In **Failover Cluster Manager**, make sure all the Core Cluster Resources are on the first virtual machine. If you need to, move all resources to this virtual machine.

1. Locate the installation media. If the virtual machine uses one of the Azure Marketplace images, the media is located at `C:\SQLServer_<version number>_Full`. Select **Setup**.

1. In the **SQL Server Installation Center**, select **Installation**.

1. Select **New SQL Server failover cluster installation**. Follow the instructions in the wizard to install the SQL Server FCI.

   The FCI data directories need to be on the premium file share. Enter the full path of the share, in this form: `\\storageaccountname.file.core.windows.net\filesharename\foldername`. A warning will appear, telling you that you've specified a file server as the data directory. This warning is expected. Ensure that the user account you RDP'd into the VM with when you persisted the file share is the same account that the SQL Server service uses to avoid possible failures.

   :::image type="content" source="media/failover-cluster-instance-premium-file-share-manually-configure/use-file-share-as-data-directories.png" alt-text="Use file share as SQL data directories":::

1. After you complete the steps in the wizard, Setup will install a SQL Server FCI on the first node.

1. After Setup installs the FCI on the first node, connect to the second node by using RDP.

1. Open the **SQL Server Installation Center**. Select **Installation**.

1. Select **Add node to a SQL Server failover cluster**. Follow the instructions in the wizard to install SQL Server and add the server to the FCI.

   >[!NOTE]
   >If you used an Azure Marketplace gallery image with SQL Server, SQL Server tools were included with the image. If you didn't use one of those images, install the SQL Server tools separately. See [Download SQL Server Management Studio (SSMS)](/sql/ssms/download-sql-server-management-studio-ssms).

## Limitations

- MSDTC is not supported on Windows Serer 2016 and earlier. 
- Filestream isn't supported for a failover cluster with a premium file share. To use filestream, deploy your cluster by using [Storage Spaces Direct](failover-cluster-instance-storage-spaces-direct-manually-configure.md).

## Next steps

Once your cluster is ready [configure connectivity](failover-cluster-instance-connectivity-configure.md). 

For an overview, see [Failover cluster instances with SQL Server on Azure VMs](failover-cluster-instance-overview.md). 

For additional information see: 
- [Windows cluster technologies](/windows-server/failover-clustering/failover-clustering-overview)
- [SQL Server Failover Cluster Instances](/sql/sql-server/failover-clusters/windows/always-on-failover-cluster-instances-sql-server)
