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
# Configure a distributed network name for an FCI 
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

On Azure Virtual Machines, the distributed network name (DNN) is used to route traffic to the appropriate clustered resource and provides an easier way to connect to the SQL Server failover cluster (FCI) than the virtual network name (VNN), without the need of an Azure load balancer. This feature is currently in preview and only available for SQL Server 2019 CU2 and later and Windows Server 2016 and later. 

This article teaches you to configure a distributed network name (DNN) to route traffic to your [failover cluster instances (FCI)](failover-cluster-instance-overview.md) with SQL Server on Azure VMs for high availability and disaster recovery (HADR). 

## Prerequisites

Before you complete the steps in this article, you should already have:

- Decided the distributed network name (DNN) is the appropriate [connectivity option for your HADR solution](hadr-cluster-best-practices.md#connectivity).
- Configured your [failover cluster instances (FCI)](failover-cluster-instance-overview.md). 
- The latest version of [PowerShell](/powershell/azure/install-az-ps). 

## Create the DNN resource 

The distributed network name (DNN) resource is created in the same cluster group as the SQL Server FCI. Use PowerShell to create the DNN resource inside the FCI cluster group. 

The following PowerShell command adds a DNN resource to the SQL Server FCI cluster group with a resource name as `<dnnResourceName>`. The resource name is used to uniquely identify a resource. Use one that makes sense to you and is unique across the cluster. The resource type must be `Distributed Network Name`. 

The `-Group` value must be the name of the cluster group corresponding to the SQL Server FCI you want to add the distributed network name to. For a default instance, the typical format is `SQL Server (MSSQLSERVER)`. 


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
Get-ClusterResource -Name <dnnResourceName> | `
Set-ClusterParameter -Name DnsName -Value <DNSName>
```

The `DNSName` value is what clients use to connect to the SQL Server FCI. For example, for clients to connect to `FCIDNN`, use the following PowerShell Command:

```powershell
Get-ClusterResource -Name dnn-demo | `
Set-ClusterParameter -Name DnsName -Value FCIDNN
```

Clients will now enter `FCIDNN` into their connection string when connecting to the SQL Server FCI. 

### Rename the VNN 

If you have an existing virtual network name (VNN) and you want clients to continue using this value to connect to the SQL Server FCI, then you must rename the current VNN to a placeholder value. Once the current VNN is renamed, you can set the DNS name value for the DNN to the VNN. Some restrictions apply for renaming the VNN, for more information, see [Renaming an FCI](/sql/sql-server/failover-clusters/install/rename-a-sql-server-failover-cluster-instance)

If using the current VNN is not necessary for your business, skip this section. Once you've renamed the VNN, then [set the cluster DNN DNS name](#set-cluster-dnn-dns-name). 

   
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

## Configure possible owners

By default, the cluster binds the DNN DNS name to all the nodes in the cluster. However, nodes in the cluster that are not part of the SQL Server FCI should be excluded from the DNN possible owner list. 

To update possible owners, follow these steps:

1. Go to your DNN resource in Failover Cluster Manager. 
1. Right-click the DNN resource and select **Properties**. 
   :::image type="content" source="media/hadr-distributed-network-name-dnn-configure/fci-dnn-properties.png" alt-text="Clear check next to the nodes that do not participate in the FCI for possible owners of the DNN resource":::
1. Clear the checkbox for any nodes that do not participate in the failover cluster instance. The possible owner list for the DNN resource should match the possible owner list for the SQL Server instance resource. For example, assuming Data3 does not participate in the FCI, the following image is an example of removing Data3 from the possible owner list of the DNN resource: 

   :::image type="content" source="media/hadr-distributed-network-name-dnn-configure/clear-check-for-nodes-not-in-fci.png" alt-text="Clear check next to the nodes that do not participate in the FCI for possible owners of the DNN resource":::

1. Select **OK** to save your settings. 


## Restart SQL Server instance 

Use the Failover Cluster Manager to restart the SQL Server instance.  Follow these steps:

1. Go to your SQL Server resource in the Failover Cluster Manager.
1. Right-click the SQL Server resource, and take it offline. 
1. After all associated resources are offline, right-click the SQL Server resource and bring it online again. 

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

- Currently, a distributed network name (DNN) is only supported for a SQL Server 2019 CU2 and above on Windows Server 2016. 
- Currently, DNN is only supported for failover cluster instances with SQL Server on Azure VMs. Use the virtual network name with an Azure load balancer for availability group listeners. 
- There may be additional considerations when working with other SQL Server features and an FCI with DNN. See [FCI with DNN interoperability](failover-cluster-instance-dnn-interoperability.md) for more information. 

## Next steps

To learn more about SQL Server HADR features in Azure, see [availability groups](availability-group-overview.md) and [failover cluster instance](failover-cluster-instance-overview.md) as well as [best practices](hadr-cluster-best-practices.md) for configuring your environment for high availability and disaster recovery. 

There may be additional configuration requirements for some specific SQL Server features when used with the DNN and FCI. See [FCI with DNN interoperability](failover-cluster-instance-dnn-interoperability.md) to learn more. 

