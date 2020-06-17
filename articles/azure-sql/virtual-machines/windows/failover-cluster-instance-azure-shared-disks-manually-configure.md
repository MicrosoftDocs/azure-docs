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

To learn more, see an overview of [FCI with SQL Server on Azure VMs](failover-cluster-instance-overview.md) and [supported configurations](hadr-cluster-best-practices.md). 


## Prerequisites 

Before you complete the steps in this article, you should already have:

- A Microsoft Azure subscription.
- [Two or more prepared Windows Azure Virtual Machines](failover-cluster-instance-prepare-vm.md).
- An account that has permissions to create objects on both Azure virtual machines and in Active Directory.
- The latest version of [PowerShell](/powershell/azure/install-az-ps?view=azps-4.2.0). 

## Add Windows cluster feature




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


## Create the failover cluster



## Configure quorum

Configure the quorum solution that best suits your business needs. You can configure a [disk witness], a [cloud witness], or a [file share witness]. For more information, see [Quorum with SQL Server VMs in Azure](hadr-cluster-best-practices.md#quorum). 

## Test cluster failover

Test failover of your cluster. In **Failover Cluster Manager**, right-click your cluster and select **More Actions** > **Move Core Cluster Resource** > **Select node**, and then select the other node of the cluster. Move the core cluster resource to every node of the cluster, and then move it back to the primary node. If you can successfully move the cluster to each node, you're ready to install SQL Server.  

:::image type="content" source="media/failover-cluster-instance-premium-file-share-manually-configure/test-cluster-failover.png" alt-text="Test cluster failover by moving the core resource to the other nodes":::


## Create SQL Server FCI




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