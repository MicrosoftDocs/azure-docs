---
title: Create an FCI with Azure shared disks
description: "Use Azure shared disks to create a failover cluster instance (FCI) with SQL Server on Azure Virtual Machines."
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

# Create an FCI with Azure shared disks (SQL Server on Azure VMs)
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

> [!TIP]
> Eliminate the need for an Azure Load Balancer or distributed network name (DNN) for your failover cluster instance by creating your SQL Server VMs in [multiple subnets](failover-cluster-instance-prepare-vm.md#subnets) within the same Azure virtual network.

This article explains how to create a failover cluster instance (FCI) by using Azure shared disks with SQL Server on Azure Virtual Machines (VMs). 

To learn more, see an overview of [FCI with SQL Server on Azure VMs](failover-cluster-instance-overview.md) and [cluster best practices](hadr-cluster-best-practices.md). 

> [!NOTE]
> It's now possible to lift and shift your failover cluster instance solution to SQL Server on Azure VMs using Azure Migrate. See [Migrate failover cluster instance](../../migration-guides/virtual-machines/sql-server-failover-cluster-instance-to-sql-on-azure-vm.md) to learn more. 

## Prerequisites 

Before you complete the instructions in this article, you should already have:

- An Azure subscription. Get started for [free](https://azure.microsoft.com/free/). 
- [Two or more prepared Windows Azure virtual machines](failover-cluster-instance-prepare-vm.md) in an availability set, or availability zones. 
- An account that has permissions to create objects on both Azure virtual machines and in Active Directory.
- The latest version of [Azure PowerShell](/powershell/azure/install-az-ps). 

## Add Azure shared disk

[Deploy a managed Premium SSD disk with the shared disk feature enabled](../../../virtual-machines/disks-shared-enable.md#deploy-a-premium-ssd-as-a-shared-disk). Set `maxShares` to **align with the number of cluster nodes** to make the disk shareable across all FCI nodes. 

## Attach shared disk to VMs

Once you've deployed a shared disk with maxShares > 1, you can mount the disk to the VMs that will participate as nodes in the cluster. 

To attach the shared disk to your SQL Server VMs, follow these steps: 

1. Select the VM in the Azure portal that you will attach the shared disk to. 
1. Select **Disks** in the **Settings** pane. 
1. Select **Attach existing disks** to attach the shared disk to the VM. 
1. Choose the shared disk from the **Disk name** drop-down. 
1. Select **Save**.
1. Repeat these steps for every cluster node SQL Server VM. 

After a few moments, the shared data disk is attached to the VM and appears in the list of Data disks for that VM.

## Initialize shared disk

Once the shared disk is attached on all the VMs, you can initialize the disks of the VMs that will participate as nodes in the cluster. Initialize the disks on **all** of the VMs. 


To initialize the disks for your SQL Server VM, follow these steps: 
 
1. Connect to one of the VMs.
2. From inside the VM, open the **Start** menu and type **diskmgmt.msc** in the search box to open the **Disk Management** console.
3. Disk Management recognizes that you have a new, uninitialized disk and the **Initialize Disk** window appears.
4. Verify the new disk is selected and then select **OK** to initialize it.
5. The new disk appears as **unallocated**. Right-click anywhere on the disk and select **New simple volume**. The **New Simple Volume Wizard** window opens.
6. Proceed through the wizard, keeping all of the defaults, and when you're done select **Finish**.
7. Close **Disk Management**.
8. A pop-up window appears notifying you that you need to format the new disk before you can use it. Select **Format disk**.
9. In the **Format new disk** window, check the settings, and then select **Start**.
10. A warning appears notifying you that formatting the disks erases all of the data. Select **OK**.
11. When the formatting is complete, select **OK**.
12. Repeat these steps on each SQL Server VM that will participate in the FCI. 

## Create Windows Failover Cluster

The steps to create your Windows Server Failover cluster vary depending on if you deployed your SQL Server VMs to a single subnet, or multiple subnets. To create your cluster, follow the steps in the tutorial for either a [multi-subnet scenario](availability-group-manually-configure-tutorial-multi-subnet.md#add-failover-cluster-feature) or a [single subnet scenario](availability-group-manually-configure-tutorial-single-subnet.md#create-the-cluster). Though these tutorials are for creating an availability group, the steps to create the cluster are the same. 

## Configure quorum

Since the disk witness is the most resilient quorum option, and the FCI solution uses Azure shared disks, it's recommended to configure a disk witness as the quorum solution. 

If you have an even number of votes in the cluster, configure the [quorum solution](hadr-cluster-quorum-configure-how-to.md) that best suits your business needs. For more information, see [Quorum with SQL Server VMs](hadr-windows-server-failover-cluster-overview.md#quorum). 

## Validate cluster

Validate the cluster on one of the virtual machines by using the Failover Cluster Manager UI or PowerShell. 

To validate the cluster using the UI, follow these steps: 

1. Under **Server Manager**, select **Tools**, and then select **Failover Cluster Manager**.
1. Under **Failover Cluster Manager**, select **Action**, and then select **Validate Configuration**.
1. Select **Next**.
1. Under **Select Servers or a Cluster**, enter the names of both virtual machines.
1. Under **Testing options**, select **Run only tests I select**. 
1. Select **Next**.
1. Under **Test Selection**, select all tests *except* **Storage**.
1. Select **Next**.
1. Under **Confirmation**, select **Next**.  The **Validate a Configuration** wizard runs the validation tests.


To validate the cluster by using PowerShell, run the following script from an administrator PowerShell session on one of the virtual machines:

```powershell
Test-Cluster –Node ("<node1>","<node2>") –Include "Inventory", "Network", "System Configuration"
```

## Test cluster failover

Test the failover of your cluster. In **Failover Cluster Manager**, right-click your cluster, select **More Actions** > **Move Core Cluster Resource** > **Select node**, and then select the other node of the cluster. Move the core cluster resource to every node of the cluster, and then move it back to the primary node. Ensure you can successfully move the cluster to each node before installing SQL Server.

:::image type="content" source="media/failover-cluster-instance-premium-file-share-manually-configure/test-cluster-failover.png" alt-text="Test cluster failover by moving the core resource to the other nodes":::

## Add shared disks to cluster

Use the Failover Cluster Manager to add the attached Azure shared disks to the cluster. 

To add disks to your cluster, follow these steps: 

1. In the **Server Manager** dashboard, select **Tools**, and then select **Failover Cluster Manager**.
1. Select the cluster and expand it in the navigation pane. 
1. Select **Storage** and then select **Disks**. 
1. Right click **Disks** and select **Add Disk**: 

    :::image type="content" source="./media/failover-cluster-instance-azure-shared-disk-manually-configure/cluster-add-disk.png" alt-text="Add Disk":::

1. Choose the Azure shared disk in the **Add Disks to a Cluster** window.  Select **OK**.
 
    :::image type="content" source="./media/failover-cluster-instance-azure-shared-disk-manually-configure/cluster-select-shared-disk.png" alt-text="Select Disk":::

1. After the shared disk is added to the cluster, you will see it in the Failover Cluster Manager.

    :::image type="content" source="./media/failover-cluster-instance-azure-shared-disk-manually-configure/cluster-shared-disk.png" alt-text="Cluster Disk":::



## Create SQL Server FCI

After you've configured the failover cluster and all cluster components, including storage, you can create the SQL Server FCI.

1. Connect to the first virtual machine by using Remote Desktop Protocol (RDP).

1. In **Failover Cluster Manager**, make sure that all core cluster resources are on the first virtual machine. If necessary, move the disks to that virtual machine.

1. If the version of the operating system is Windows Server 2019 and the Windows Cluster was created using the default [**Distributed Network Name (DNN)**](https://blogs.windows.com/windows-insider/2018/08/14/announcing-windows-server-2019-insider-preview-build-17733/), then the FCI installation for SQL Server 2017 and below will fail with the error `The given key was not present in the dictionary`. 

    During installation, SQL Server setup queries for the existing Virtual Network Name (VNN) and doesn't recognize the Windows Cluster DNN. The issue has been fixed in SQL Server 2019 setup. For SQL Server 2017 and below, follow these steps to avoid the installation error:
     
    - In Failover Cluster Manager, connect to the cluster, right-click  **Roles** and select **Create Empty Role**.
    - Right-click the newly created empty role, select **Add Resource** and select **Client Access Point**.
    - Enter any name and complete the wizard to create the **Client Access Point**. 
    - After the SQL Server FCI installation completes, the role containing the temporary **Client Access Point** can be deleted. 

1. Locate the installation media. If the virtual machine uses one of the Azure Marketplace images, the media is located at `C:\SQLServer_<version number>_Full`. 

1. Select **Setup**.

1. In **SQL Server Installation Center**, select **Installation**.

1. Select **New SQL Server failover cluster installation**. Follow the instructions in the wizard to install the SQL Server FCI.

1. On the **Cluster Disk Selection** page, select all the shared disks that were attached to the VM. 

    :::image type="content" source="./media/failover-cluster-instance-azure-shared-disk-manually-configure/sql-install-cluster-disk-selection.png" alt-text="Cluster Disk Selection":::

1. On the **Cluster Network Configuration** page, the IP you provide varies depending on if your SQL Server VMs were deployed to a single subnet, or multiple subnets. 

   1. For a **single subnet environment**, provide the IP address that you plan to add to the [Azure Load Balancer](failover-cluster-instance-vnn-azure-load-balancer-configure.md)
   1. For a **multi-subnet environment**, provide the secondary IP address in the subnet of the _first_ SQL Server VM that you previously designated as the [IP address of the failover cluster instance network name](failover-cluster-instance-prepare-vm.md#assign-secondary-ip-addresses):

   :::image type="content" source="./media/failover-cluster-instance-azure-shared-disk-manually-configure/sql-install-cluster-network-secondary-ip-vm-1.png" alt-text="provide the secondary IP address in the subnet of the first SQL Server VM that you previously designated as the IP address of the failover cluster instance network name":::

1. On the **Database Engine Configuration** page, ensure the database directories are on the Azure shared disk(s). 

1. After you complete the instructions in the wizard, setup installs the SQL Server FCI on the first node.

1. After FCI installation succeeds on the first node, connect to the second node by using RDP.

1. Open the **SQL Server Installation Center**, and then select **Installation**.

1. Select **Add node to a SQL Server failover cluster**. Follow the instructions in the wizard to install SQL Server and add the node to the FCI.

1. For a multi-subnet scenario, in **Cluster Network Configuration**, enter the secondary IP address in the subnet of the _second_ SQL Server VM subnet that you previously designated as the [IP address of the failover cluster instance network name](failover-cluster-instance-prepare-vm.md#assign-secondary-ip-addresses)

    :::image type="content" source="./media/failover-cluster-instance-azure-shared-disk-manually-configure/sql-install-cluster-network-secondary-ip-vm-2.png" alt-text="enter the secondary IP address in the subnet of the second SQL Server VM subnet that you previously designated as the IP address of the failover cluster instance network name":::

    After selecting **Next** in **Cluster Network Configuration**, setup shows a dialog box indicating that SQL Server Setup detected multiple subnets as in the example image.  Select **Yes** to confirm. 

    :::image type="content" source="./media/failover-cluster-instance-azure-shared-disk-manually-configure/sql-install-multi-subnet-confirmation.png" alt-text="Multi Subnet Confirmation":::

1. After you complete the instructions in the wizard, setup adds the second SQL Server FCI node. 

1. Repeat these steps on any other SQL Server VMs you want to participate in the SQL Server failover cluster instance. 


>[!NOTE]
> Azure Marketplace gallery images come with SQL Server Management Studio installed. If you didn't use a marketplace image [Download SQL Server Management Studio (SSMS)](/sql/ssms/download-sql-server-management-studio-ssms).


## Register with SQL IaaS extension 

To manage your SQL Server VM from the portal, register it with the SQL IaaS Agent extension in [lightweight management mode](sql-agent-extension-manually-register-single-vm.md#lightweight-mode), currently the only mode supported with FCI and SQL Server on Azure VMs. 

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
- Only registering with the SQL IaaS Agent extension in [lightweight management mode](sql-server-iaas-agent-extension-automate-management.md#management-modes) is supported.

## Next steps

If Azure shared disks are not the appropriate FCI storage solution for you, consider creating your FCI using [premium file shares](failover-cluster-instance-premium-file-share-manually-configure.md) or [Storage Spaces Direct](failover-cluster-instance-storage-spaces-direct-manually-configure.md) instead. 


To learn more, see:

- [Windows Server Failover Cluster with SQL Server on Azure VMs](hadr-windows-server-failover-cluster-overview.md)
- [Failover cluster instances with SQL Server on Azure VMs](failover-cluster-instance-overview.md)
- [Failover cluster instance overview](/sql/sql-server/failover-clusters/windows/always-on-failover-cluster-instances-sql-server)
- [HADR settings for SQL Server on Azure VMs](hadr-cluster-best-practices.md)
