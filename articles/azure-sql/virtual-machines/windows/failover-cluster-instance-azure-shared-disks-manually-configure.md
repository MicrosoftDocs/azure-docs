---
title: Create an FCI with Azure Shared Disks (Preview)
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

To learn more, see an overview of [FCI with SQL Server on Azure VMs](failover-cluster-instance-overview.md) and [supported configurations](hadr-cluster-best-practices.md). 


## Prerequisites 

Before you complete the steps in this article, you should already have:

- A Microsoft Azure subscription.
- [Two or more prepared Windows Azure Virtual Machines](failover-cluster-instance-prepare-vm.md).
- Both VMs should be part of the same Proximity Placement Group and Avialability Set
- The Availbility Set should be created by setting both Fault Domain and Update Domain to 1.
- Only West Central US region supports shared disks in preview.
- An account that has permissions to create objects on both Azure virtual machines and in Active Directory.
- The latest version of [PowerShell](/powershell/azure/install-az-ps?view=azps-4.2.0). 




## Add Azure Shared Disk
Deploy a managed Premium SSD disk with the shared disk feature enabled, use the new property maxShares set to 2; this will make the disk shareable across both FCI nodes.

```JSON
{ 
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "dataDiskName": {
      "type": "string",
      "defaultValue": "mySharedDisk"
    },
    "dataDiskSizeGB": {
      "type": "int",
      "defaultValue": 1024
    },
    "maxShares": {
      "type": "int",
      "defaultValue": 2
    }
  },
  "resources": [
    {
      "type": "Microsoft.Compute/disks",
      "name": "[parameters('dataDiskName')]",
      "location": "[resourceGroup().location]",
      "apiVersion": "2019-07-01",
      "sku": {
        "name": "Premium_LRS"
      },
      "properties": {
        "creationData": {
          "createOption": "Empty"
        },
        "diskSizeGB": "[parameters('dataDiskSizeGB')]",
        "maxShares": "[parameters('maxShares')]"
      }
    }
  ] 
}
```

```powershell
$rgName = < specify your resource group name>
			$location = 'westcentralus'
			New-AzResourceGroupDeployment -ResourceGroupName $rgName `
-TemplateFile "SharedDiskConfig.json"

```

Attach shared disk both VMs seperatly by executing the commands below.


```powershell
$resourceGroup = "<your resource group name>"
		$location = "WestCentralUS"
		$ppgName = "< your proximity placement groups name >"
		$vm = Get-AzVM -ResourceGroupName "<your resource group name>" 
-Name "<your VM node name>"
		$dataDisk = Get-AzDisk -ResourceGroupName $resourceGroup -DiskName "<your shared disk name>"
		$vm = Add-AzVMDataDisk -VM $vm -Name "<your shared disk name>" -CreateOption Attach -ManagedDiskId $dataDisk.Id -Lun <available LUN  check disk setting of the VM>
		update-AzVm -VM $vm -ResourceGroupName $resourceGroup

```

For each VM, initialzie the attached shared disks as GBT and format as NTFS.



## Create the failover cluster

To create the failover cluster, you need:

- The names of the virtual machines that will become the cluster nodes
- A name for the failover cluster
- An IP address for the failover cluster <br/>
  You can use an IP address that's not used on the same Azure virtual network and subnet as the cluster nodes.

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


   Shared disk will be visible as "Avialable Storage" on Failover Cluster Manager, Disks section.
   On Failover Cluster Manager, right click on the Storage/Disks/"Your Shared Disk" and select "Add to Cluster Shared Volumes" to present the shared disk as CSV.
   
   
   This screenshot shows a Cluster Shared Volume on Windows Failover Cluster:

   ![Cluster Shared Volume](./media/failover-cluster-instance-storage-spaces-direct-manually-configure/15-cluster-shared-volume.png)




## Configure quorum

Configure the quorum solution that best suits your business needs. You can configure a [disk witness], a [cloud witness], or a [file share witness]. For more information, see [Quorum with SQL Server VMs](hadr-cluster-best-practices.md#quorum). 



## Test cluster failover

Test failover of your cluster. In **Failover Cluster Manager**, right-click your cluster and select **More Actions** > **Move Core Cluster Resource** > **Select node**, and then select the other node of the cluster. Move the core cluster resource to every node of the cluster, and then move it back to the primary node. If you can successfully move the cluster to each node, you're ready to install SQL Server.  

:::image type="content" source="media/manually-configure-failover-cluster-instance-premium-file-share/test-cluster-failover.png" alt-text="Test cluster failover by moving the core resource to the other nodes":::



## Create SQL Server FCI

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
   >

## Register with the SQL VM RP

To manage your SQL Server VM from the portal, register it with the SQL VM resource provider (RP) in [lightweight management mode](sql-vm-resource-provider-register.md#lightweight-management-mode), currently the only mode supported with FCI and SQL Server on Azure VMs. 


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

- Only SQL Server 2019 on Windows Server 2019 is supported. 
- Only registering with the SQL VM resource provider in [lightweight management mode](sql-vm-resource-provider-register.md#management-modes) is supported.

## Next steps

If you haven't already, configure connectivity to your FCI with an [Azure Load Balancer](hadr-azure-load-balancer-configure.md) or [distributed network name (DNN)](hadr-distributed-network-name-dnn-configure.md). 

If Azure Shared Disks are not the appropriate FCI storage solution for you, consider creating your FCI using [Premium File Shares](failover-cluster-instance-premium-file-share-manually-configure.md) or [Storage Spaces Direct](failover-cluster-instance-storage-spaces-direct-manually-configure.md) instead. 

To learn more, see an overview of [FCI with SQL Server on Azure VMs](failover-cluster-instance-overview.md) and [best practices](hadr-cluster-best-practices.md). 


For additional information see: 
- [Windows cluster technologies](/windows-server/failover-clustering/failover-clustering-overview)   
- [SQL Server failover cluster instances](/sql/sql-server/failover-clusters/windows/always-on-failover-cluster-instances-sql-server)
