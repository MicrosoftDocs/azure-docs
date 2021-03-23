---
title: Configure DNN listener for availability group
description: Learn how to configure a distributed network name (DNN) listener to replace your virtual network name (VNN) listener and route traffic to your Always On availability group on SQL Server on Azure VM. 
services: virtual-machines-windows
documentationcenter: na
author: MashaMSFT
manager: jroth
tags: azure-resource-manager
ms.service: virtual-machines-sql
ms.subservice: hadr
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 10/07/2020
ms.author: mathoma
ms.reviewer: jroth

---
# Configure a DNN listener for an availability group
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

With SQL Server on Azure VMs, the distributed network name (DNN) routes traffic to the appropriate clustered resource. It provides an easier way to connect to an Always On availability group (AG) than the virtual network name (VNN) listener, without the need for an Azure Load Balancer.

This article teaches you to configure a DNN listener to replace the VNN listener and route traffic to your availability group with SQL Server on Azure VMs for high availability and disaster recovery (HADR).

The DNN listener feature is currently only available starting with SQL Server 2019 CU8 on Windows Server 2016 and later.

For an alternative connectivity option, consider a [VNN listener and Azure Load Balancer](availability-group-vnn-azure-load-balancer-configure.md) instead.

## Overview

A distributed network name (DNN) listener replaces the traditional virtual network name (VNN) availability group listener when used with [Always On availability groups on SQL Server VMs](availability-group-overview.md). This negates the need for an Azure Load Balancer to route traffic, simplifying deployment, maintenance, and improving failover.

Use the DNN listener to replace an existing VNN listener, or alternatively, use it in conjunction with an existing VNN listener so that your availability group has two distinct connection points - one using the VNN listener name (and port if non-default), and one using the DNN listener name and port.

> [!CAUTION]
> The routing behavior when using a DNN differs when using a VNN. Do not use port 1433. To learn more, see the [Port consideration](#port-considerations) section later in this article.

## Prerequisites

Before you complete the steps in this article, you should already have:

- SQL Server 2019 on CU8 or later, on Windows Server 2016 and later
- Decided that the distributed network name is the appropriate [connectivity option for your HADR solution](hadr-cluster-best-practices.md#connectivity).
- Configured your [Always On availability group](availability-group-overview.md). 
- Installed the latest version of [PowerShell](/powershell/azure/install-az-ps). 
- Identified the unique port that you will use for the DNN listener. The port used for a DNN listener must be unique across all replicas of the availability group or failover cluster instance.  No other connection can share the same port.



## Create script

Use PowerShell to create the distributed network name (DNN) resource and associate it with your availability group.

To do so, follow these steps:

1. Open a text editor, such as Notepad.
1. Copy and paste the following script:

   ```powershell
   param (
      [Parameter(Mandatory=$true)][string]$Ag,
      [Parameter(Mandatory=$true)][string]$Dns,
      [Parameter(Mandatory=$true)][string]$Port
   )
   
   Write-Host "Add a DNN listener for availability group $Ag with DNS name $Dns and port $Port"
   
   $ErrorActionPreference = "Stop"
   
   # create the DNN resource with the port as the resource name
   Add-ClusterResource -Name $Port -ResourceType "Distributed Network Name" -Group $Ag 
   
   # set the DNS name of the DNN resource
   Get-ClusterResource -Name $Port | Set-ClusterParameter -Name DnsName -Value $Dns 
   
   # start the DNN resource
   Start-ClusterResource -Name $Port
   
   
   $Dep = Get-ClusterResourceDependency -Resource $Ag
   if ( $Dep.DependencyExpression -match '\s*\((.*)\)\s*' )
   {
   $DepStr = "$($Matches.1) or [$Port]"
   }
   else
   {
   $DepStr = "[$Port]"
   }
   
   Write-Host "$DepStr"
   
   # add the Dependency from availability group resource to the DNN resource
   Set-ClusterResourceDependency -Resource $Ag -Dependency "$DepStr"
   
   
   #bounce the AG resource
   Stop-ClusterResource -Name $Ag
   Start-ClusterResource -Name $Ag
   ```

1. Save the script as a `.ps1` file, such as `add_dnn_listener.ps1`.

## Execute script

To create the DNN listener, execute the script passing in parameters for the name of the availability group, listener name, and port.

For example, assuming an availability group name of `ag1`, listener name of `dnnlsnr`, and listener port as `6789`, follow these steps:

1. Open a command-line interface tool, such as command prompt or PowerShell.
1. Navigate to where you saved the `.ps1` script, such as c:\Documents.
1. Execute the script: ```add_dnn_listener.ps1 <ag name> <listener-name> <listener port>```. For example:

   ```console
   c:\Documents> add_dnn_listener.ps1 ag1 dnnlsnr 6789
   ```

## Verify listener

Use either SQL Server Management Studio or Transact-SQL to confirm your DNN listener is created successfully.

### SQL Server Management Studio

Expand **Availability Group Listeners** in [SQL Server Management Studio (SSMS)](/sql/ssms/download-sql-server-management-studio-ssms) to view your DNN listener:

:::image type="content" source="media/availability-group-distributed-network-name-dnn-listener-configure/dnn-listener-in-ssms.png" alt-text="View the DNN listener under availability group listeners in SQL Server Management Studio (SSMS)":::

### Transact-SQL

Use Transact-SQL to view the status of the DNN listener:

```sql
SELECT * FROM SYS.AVAILABILITY_GROUP_LISTENERS
```

A value of `1` for `is_distributed_network_name` indicates the listener is a distributed network name (DNN) listener:

:::image type="content" source="media/availability-group-distributed-network-name-dnn-listener-configure/dnn-listener-tsql.png" alt-text="Use sys.availability_group_listeners to identify DNN listeners that have a value of 1 in is_distributed_network_name":::

## Update connection string

Update connection strings for applications so that they connect to the DNN listener. To ensure rapid connectivity upon failover, add `MultiSubnetFailover=True` to the connection string if the SQL client supports it.

## Test failover

Test failover of the availability group to ensure functionality.

To test failover, follow these steps:

1. Connect to the DNN listener or one of the replicas by using [SQL Server Management Studio (SSMS)](/sql/ssms/download-sql-server-management-studio-ssms).
1. Expand **Always On Availability Group** in **Object Explorer**.
1. Right-click the availability group and choose **Failover** to open the **Failover Wizard**.
1. Follow the prompts to choose a failover target and fail the availability group over to a secondary replica.
1. Confirm the database is in a synchronized state on the new primary replica.
1. (Optional) Fail back to the original primary, or another secondary replica.

## Test connectivity

Test the connectivity to your DNN listener with these steps:

1. Open [SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms).
1. Connect to your DNN listener.
1. Open a new query window and check which replica you're connected to by running `SELECT @@SERVERNAME`.
1. Fail the availability group over to another replica.
1. After a reasonable amount of time, run `SELECT @@SERVERNAME` to confirm your availability group is now hosted on another replica.

## Limitations

- Currently, a DNN listener for an availability group is only supported for SQL Server 2019 CU8 and later on Windows Server 2016 and later. 
- DNN Listeners **MUST** be configured with a unique port.  The port cannot be shared with any other connection on any replica.
- There might be additional considerations when you're working with other SQL Server features and an availability group with a DNN. For more information, see [AG with DNN interoperability](availability-group-dnn-interoperability.md). 

## Port considerations

DNN listeners are designed to listen on all IP addresses, but on a specific, unique port. The DNS entry for the listener name should resolve to the addresses of all replicas in the availability group. This is done automatically with the PowerShell script provided in the [Create Script](#create-script) section. Since DNN listeners accept connections on all IP addresses, it is critical that the listener port be unique, and not in use by any other replica in the availability group. Since SQL Server always listens on port 1433, either directly or via the SQL Browser service, port 1433 cannot be used for any DNN listener.

## Next steps

To learn more about SQL Server HADR features in Azure, see [Availability groups](availability-group-overview.md) and [Failover cluster instance](failover-cluster-instance-overview.md). You can also learn [best practices](hadr-cluster-best-practices.md) for configuring your environment for high availability and disaster recovery. 
