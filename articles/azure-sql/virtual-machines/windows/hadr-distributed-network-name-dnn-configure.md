---
title: Configure distributed network name (DNN)
description: Learn how to configure a distributed network name (DNN) to route traffic to your SQL Server on Azure VM failover cluster instance (FCI). 
services: virtual-machines-windows
documentationcenter: na
author: MashaMSFT
manager: jroth
tags: azure-resource-manager
ms.service: virtual-machines-sql
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 06/02/2020
ms.author: mathoma
ms.reviewer: jroth

---
# Configure a DNN for an FCI (SQL Server on Azure VMs) 
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

On Azure Virtual Machines, the distributed network name (DNN) replaces the virtual network name (VNN) in the cluster. It routes traffic to the appropriate clustered resource without the need for Azure Load Balancer. This feature is currently in preview and is available only for SQL Server 2019 CU2 and later and Windows Server 2019. 

This article teaches you to configure a DNN to route traffic to your [failover cluster instances (FCIs)](failover-cluster-instance-overview.md) with SQL Server on Azure VMs for high availability and disaster recovery (HADR). 

## Prerequisites

Before you complete the steps in this article, you should already have:

- Decided that the distributed network name is the appropriate [connectivity option for your HADR solution](hadr-cluster-best-practices.md#connectivity).
- Configured your [failover cluster instances](failover-cluster-instance-overview.md). 
- Installed the latest version of [PowerShell](/powershell/azure/install-az-ps). 

## Create the DNN resource 

The DNN resource is created in the same cluster group as the SQL Server FCI. Use PowerShell to create the DNN resource inside the FCI cluster group. 

The following PowerShell command adds a DNN resource to the SQL Server FCI cluster group with a resource name of `<dnnResourceName>`. The resource name is used to uniquely identify a resource. Use one that makes sense to you and is unique across the cluster. The resource type must be `Distributed Network Name`. 

The `-Group` value must be the name of the cluster group that corresponds to the SQL Server FCI where you want to add the distributed network name. For a default instance, the typical format is `SQL Server (MSSQLSERVER)`. 


```powershell
Add-ClusterResource -Name <dnnResourceName> `
-ResourceType "Distributed Network Name" -Group "<WSFC role of SQL server instance>"
```

For example, to create your DNN resource `dnn-demo` for a default SQL Server FCI, use the following PowerShell command:

```powershell
Add-ClusterResource -Name dnn-demo `
-ResourceType "Distributed Network Name" -Group "SQL Server (MSSQLSERVER)"

```

## Set the cluster DNN DNS name

Set the DNS name for the DNN resource in the cluster. The cluster then uses this value to route traffic to the node that's currently hosting the SQL Server FCI. 
 
Clients use the DNS name to connect to the SQL Server FCI. You can choose a unique value. Or, if you already have an existing FCI and don't want to update client connection strings, you can configure the DNN to use the current VNN that clients are already using. To do so, you need to [rename the VNN](#rename-the-vnn) before setting the DNN in DNS.


Use this command to set the DNS name for your DNN: 

```powershell
Get-ClusterResource -Name <dnnResourceName> `
Set-ClusterParameter -Name DnsName -Value <DNSName>
```

The `DNSName` value is what clients use to connect to the SQL Server FCI. For example, for clients to connect to `FCIDNN`, use the following PowerShell command:

```powershell
Get-ClusterResource -Name dnn-demo `
Set-ClusterParameter -Name DnsName -Value FCIDNN
```

Clients will now enter `FCIDNN` into their connection string when connecting to the SQL Server FCI. 

### Rename the VNN 

If you have an existing virtual network name and you want clients to continue using this value to connect to the SQL Server FCI, you must rename the current VNN to a placeholder value. After the current VNN is renamed, you can set the DNS name value for the DNN to the VNN. 

Some restrictions apply for renaming the VNN. For more information, see [Renaming an FCI](/sql/sql-server/failover-clusters/install/rename-a-sql-server-failover-cluster-instance).

If using the current VNN is not necessary for your business, skip this section. After you've renamed the VNN, then [set the cluster DNN DNS name](#set-cluster-dnn-dns-name). 

   
## Set the DNN resource online

After your DNN resource is appropriately named, and you've set the DNS name value in the cluster, use PowerShell to set the DNN resource online in the cluster: 

```powershell
Start-ClusterResource -Name <dnnResourceName>
```

For example, to start your DNN resource `dnn-demo`, use the following PowerShell command: 

```powershell
Start-ClusterResource -Name dnn-demo
```

## Create the network alias

Some server-side components rely on a hard-coded VNN value, and require a network alias that maps the VNN to the DNN DNS name to function properly. For more information, see [DNN FCI interoperability](failover-cluster-instance-overview.md#dnn-feature-interoperability). 

To create an alias that maps the VNN to the DNN DNS name, follow the steps in [Create a server alias](/sql/database-engine/configure-windows/create-or-delete-a-server-alias-for-use-by-a-client). 

For a default instance, you can map the VNN to the DNN DNS name directly, such that `VNN` = `DNN DNS name`.
For example, suppose the VNN is `FCI1`, the instance name is `MSSQLSERVER`, and the DNN is `FCI1DNN`. (Clients previously connected to `FCI`, and now they connect to `FCI1DNN`.) You'd then map the VNN `FCI1` to the DNN `FCI1DNN`. 

For a named instance, the network alias mapping should be done for the full instance, such that `VNN\Instance` = `DNN\Instance`. 
For example, suppose the VNN is `FCI1`, the instance name is `instA`, and the DNN is `FCI1DNN`. (Clients previously connected to `FCI1\instA`, and now they connect to `FCI1DNN\instaA`.) You'd then map the VNN `FCI1\instaA` to the DNN `FCI1DNN\instaA`. 

## Update the connection string

To ensure rapid connectivity upon failover, add `MultiSubnetFailover=True` to the connection string if the SQL client version is earlier than 4.6.1. 

Additionally, if the DNN is not using the original VNN, SQL clients that connect to the SQL Server FCI will need to update their connection string to the DNN DNS name. To avoid this requirement, you can update the DNS name value to be the name of the VNN. But you'll need to [replace the existing VNN with a placeholder](#rename-the-vnn) first. 

## Test failover

Test failover of the clustered resource to validate cluster functionality. 

To test failover, follow these steps: 

1. Connect to one of the SQL Server cluster nodes by using RDP.
1. Open **Failover Cluster Manager**. Select **Roles**. Notice which node owns the SQL Server FCI role.
1. Right-click the SQL Server FCI role. 
1. Select **Move**, and then select **Best Possible Node**.

**Failover Cluster Manager** shows the role, and its resources go offline. The resources then move and come back online in the other node.

## Test connectivity

To test connectivity, sign in to another virtual machine in the same virtual network. Open **SQL Server Management Studio** and connect to the SQL Server FCI by using the DNN DNS name.

If you need to, you can [download SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms).

## Limitations

- Currently, a DNN is supported only for a SQL Server 2019 CU2 (and later) failover cluster instance on Windows Server 2019. 
- Currently, a DNN is supported only for a SQL Server FCI on Azure IaaS. It isn't supported for Always On availability group listeners. For availability group listeners, the only connectivity option for automated failover is through Azure Load Balancer.
- There are more limitations when you're working with other SQL Server features and an FCI with a DNN. For more information, see [FCI with DNN interoperability](failover-cluster-instance-overview.md#dnn-feature-interoperability). 

## Next steps

To learn more about SQL Server HADR features in Azure, see [Availability groups](availability-group-overview.md) and [Failover cluster instance](failover-cluster-instance-overview.md). You can also learn [best practices](hadr-cluster-best-practices.md) for configuring your environment for high availability and disaster recovery. 

