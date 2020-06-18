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

On Azure Virtual Machines, the distributed network name (DNN) replaces the virtual network name (VNN) in the cluster, routing traffic to the appropriate clustered resource without the need of an Azure Load Balancer. This feature is currently in preview and only available for SQL Server 2019 and Windows Server 2019. 

This article teaches you to configure a distributed network name (DNN) to route traffic to your [failover cluster instances (FCI)](failover-cluster-instance-overview.md) with SQL Server on Azure VMs for high availability and disaster recovery (HADR). 

## Prerequisites

Before you complete the steps in this article, you should already have:

- Decided the distributed network name (DNN) is the appropriate [connectivity option for your HADR solution](hadr-cluster-best-practices.md#connectivity).
- Configured your [failover cluster instances (FCI)](failover-cluster-instance-overview.md). 
- The latest version of [PowerShell](/powershell/azure/install-az-ps?view=azps-4.2.0). 

## Create the DNN resource 


The distributed name resource (DNN) resource is created in the same cluster group as the SQL Server FCI. Use PowerShell to create the DNN resource inside the FCI cluster group. 

The following PowerShell command adds a DNN resource to the SQL Server FCI cluster group with a resource name as `<dnnResourceName>`. The resource name is used to uniquely identify a resource. Use one that makes sense to you and is unique across the cluster. The resource type must be `Distributed Network Name`. 

The `-Group` value must be the name of the cluster group corresponding to the SQL Server FCI you want to add the Distributed Network Name to. For a default instance, the typical format is `SQL Server (MSSQLSERVER)`. 


```powershell
Add-ClusterResource -Name <dnnResourceName> `
-ResourceType "Distributed Network Name" -Group "<WSFC role of SQL server instance>"
```

For example, to create your DNN resource `dnn-demo` for a default SQL Server FCI, use the following PowerShell command:

```powershell
Add-ClusterResource -Name dnn-demo `
-ResourceType "Distributed Network Name" -Group "SQL Server (MSSQLSERVER)"

```

## Set cluster DNN DNS name

Set the DNS name for the distributed network name (DNN) resource in the cluster. The cluster then uses this value to route traffic to the appropriate node currently hosting the SQL Server FCI. 
 
Clients use the DNS name to connect to the SQL Server FCI. You can choose a unique value, or, if you already have an existing FCI and don't want to update client connection strings, you can configure the DNN to use the current virtual network name (VNN) that clients are already using. To do so, you need to [rename the VNN](#rename-the-vnn) prior to setting the DNN name in DNS.


Use this command to set the DNS name for your DNN: 

```powershell
Get-ClusterResource -Name <dnnResourceName> `
Set-ClusterParameter -Name DnsName -Value <DNSName>
```

The `DNSName` value is what clients use to connect to the SQL Server FCI. For example, for clients to connect to `FCIDNN`, use the following PowerShell Command:

```powershell
Get-ClusterResource -Name dnn-demo `
Set-ClusterParameter -Name DnsName -Value FCIDNN
```

Clients will now enter `FCIDNN` into their connection string when connecting to the SQL Server FCI. 

### Rename the VNN 

If you have an existing virtual network name (VNN)  and you want clients to continue using this value to connect to the SQL Server FCI, then you must rename the current VNN to a placeholder value. Once the current VNN is renamed, you can set the DNS name value for the DNN to the VNN. 

If using the current VNN is not necessary for your business, skip this section. 

   > [!CAUTION]
   > Renaming the VNN will take the SQL Server service offline, closing client connections, and rolling back any uncommitted transactions. Proceed with caution during a maintenance window. 

If you want to use your existing VNN with your DNN, then follow these steps to rename your VNN: 

To rename your active VNN (active_VNN) to a placeholder name (placeholder_VNN), follow these steps: 

1. Open the failover cluster instance resource in Failover Cluster Manager. 
1. Right-click the virtual network name (VNN) for the FCI and select **Properties**. 
1. Update the current active VNN (active_VNN) to a placeholder name (placeholder_VNN) different from the names currently used for the VNN or the DNN.  
1. Select **OK** to save your new name. 
1. Right-click the newly renamed VNN (placeholder_VNN) and take it offline. This will take the associated IP address and clustered resource offline as well, closing all connections and rolling back any uncommitted transactions. 
1. Right-click the VNN and bring it online. 


## Set DNN resource online

Once your DNN resource is appropriately named, and you've set the DNS name value in the cluster, use PowerShell to set the DNN resource online in the cluster. 

Use PowerShell to set the DNN resource online: 

```powershell
Start-ClusterResource -Name <dnnResourceName>
```

For example, to start your DNN resource `dnn-demo` use the following PowerShell command: 

```powershell
Start-ClusterResource -Name dnn-demo
```

## Create network alias

There are some server-side components that rely on a hard-coded VNN value, and require a network alias that maps the VNN to the DNN DNS name to function properly. See [DNN FCI interoperability](failover-cluster-instance-overview.md#dnn-feature-interoperability) for more information. 

Follow the steps in [Create a server alias](/sql/database-engine/configure-windows/create-or-delete-a-server-alias-for-use-by-a-client) to create an alias that maps the VNN to the DNN DNS name. 

For a default instance, you can map the VNN to the DNN DNS name directly, such that VNN = DNN DNS name.
For example, if VNN name is `FCI1`, instance name is `MSSQLSERVER`, and the DNN is `FCI1DNN` (clients previously connected to `FCI`, and now they connect to `FCI1DNN`) then map the VNN `FCI1` to the DNN `FCI1DNN`. 

For a named instance the network alias mapping should be done for the full instance, such that `VNN\Instance` = `DNN\Instance`. 
For example, if VNN name is `FCI1`, instance name is `instA`, and the DNN is `FCI1DNN` (clients previously connected to `FCI1\instA`, and now they connect to `FCI1DNN\instaA`) then map the VNN `FCI1\instaA` to the DNN `FCI1DNN\instaA`. 

## Update connection string

To ensure rapid connectivity upon failover, add `MultiSubnetFailover=True` to the connection string if the SQL client version is lower than 4.6.1. 

Additionally, if the DNN name is not using the original VNN name, SQL clients connecting to the SQL Server FCI will need to update their connection string to the DNN DNS name. To avoid having to do so, you can update the DNS name value to be the name of the VNN, but you'll need to [replace the existing VNN name with a placeholder](#rename-the-vnn) first. 

## Test failover

Test failover of the clustered resource to validate cluster functionality. 

To test failover, follow these steps: 

1. Connect to one of the SQL Server cluster nodes by using RDP.
1. Open **Failover Cluster Manager**. Select **Roles**. Notice which node owns the SQL Server FCI role.
1. Right-click the SQL Server FCI role. 
1. Select **Move**, and then select **Best Possible Node**.

**Failover Cluster Manager** shows the role, and its resources go offline. The resources then move and come back online in the other node.



## Test connectivity

To test connectivity, sign in to another virtual machine in the same virtual network. Open **SQL Server Management Studio** and connect to the SQL Server FCI using the DNS DNN name.

If you need to, you can [download SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms).

## Limitations

- Currently, a distributed network name (DNN) is only supported for a SQL Server 2019 failover cluster instance on Windows Server 2019. 
- There are additional limitations when working with other SQL Server features and an FCI with DNN. See [DNN FCI interoperability](failover-cluster-instance-overview.md#dnn-feature-interoperability) for more information. 

## Next steps

To learn more about SQL Server HADR features in Azure, see [availability groups](availability-group-overview.md) and [failover cluster instance](failover-cluster-instance-overview.md) as well as [best practices](hadr-cluster-best-practices.md) for configuring your environment for high availability and disaster recovery. 

