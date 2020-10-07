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
ms.topic: how-to
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 06/02/2020
ms.author: mathoma
ms.reviewer: jroth

---
# Configure a distributed network name for an FCI 
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

On Azure Virtual Machines, the distributed network name (DNN) is used to route traffic to the appropriate clustered resource. It provides an easier way to connect to the SQL Server failover cluster instance (FCI) than the virtual network name (VNN), without the need for Azure Load Balancer. This feature is currently in preview and is available only for SQL Server 2019 CU2 and later and Windows Server 2016 and later. 

This article teaches you to configure a DNN to route traffic to your FCIs with SQL Server on Azure VMs for high availability and disaster recovery (HADR). 

## Prerequisites

Before you complete the steps in this article, you should already have:

- Decided that the distributed network name is the appropriate [connectivity option for your HADR solution](hadr-cluster-best-practices.md#connectivity).
- Configured your [failover cluster instances](failover-cluster-instance-overview.md). 
- Installed the latest version of [PowerShell](/powershell/azure/install-az-ps). 

## Create DNN resource 

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

## Set cluster DNN DNS name

Set the DNS name for the DNN resource in the cluster. The cluster then uses this value to route traffic to the node that's currently hosting the SQL Server FCI. 
 
Clients use the DNS name to connect to the SQL Server FCI. You can choose a unique value. Or, if you already have an existing FCI and don't want to update client connection strings, you can configure the DNN to use the current VNN that clients are already using. To do so, you need to [rename the VNN](#rename-the-vnn) before setting the DNN in DNS.


Use this command to set the DNS name for your DNN: 

```powershell
Get-ClusterResource -Name <dnnResourceName> | `
Set-ClusterParameter -Name DnsName -Value <DNSName>
```

The `DNSName` value is what clients use to connect to the SQL Server FCI. For example, for clients to connect to `FCIDNN`, use the following PowerShell command:

```powershell
Get-ClusterResource -Name dnn-demo | `
Set-ClusterParameter -Name DnsName -Value FCIDNN
```

Clients will now enter `FCIDNN` into their connection string when connecting to the SQL Server FCI. 

   > [!WARNING]
   > Do not delete the current virtual network name (VNN) as it is a necessary component of the FCI infrastructure. 


### Rename the VNN 

If you have an existing virtual network name and you want clients to continue using this value to connect to the SQL Server FCI, you must rename the current VNN to a placeholder value. After the current VNN is renamed, you can set the DNS name value for the DNN to the VNN. 

Some restrictions apply for renaming the VNN. For more information, see [Renaming an FCI](/sql/sql-server/failover-clusters/install/rename-a-sql-server-failover-cluster-instance).

If using the current VNN is not necessary for your business, skip this section. After you've renamed the VNN, then [set the cluster DNN DNS name](#set-cluster-dnn-dns-name). 

   
## Set DNN resource online

After your DNN resource is appropriately named, and you've set the DNS name value in the cluster, use PowerShell to set the DNN resource online in the cluster: 

```powershell
Start-ClusterResource -Name <dnnResourceName>
```

For example, to start your DNN resource `dnn-demo`, use the following PowerShell command: 

```powershell
Start-ClusterResource -Name dnn-demo
```

## Configure possible owners

By default, the cluster binds the DNN DNS name to all the nodes in the cluster. However, nodes in the cluster that are not part of the SQL Server FCI should be excluded from the list of DNN possible owners. 

To update possible owners, follow these steps:

1. Go to your DNN resource in Failover Cluster Manager. 
1. Right-click the DNN resource and select **Properties**. 
   :::image type="content" source="media/hadr-distributed-network-name-dnn-configure/fci-dnn-properties.png" alt-text="Shortcut menu for the DNN resource, with the Properties command highlighted.":::
1. Clear the check box for any nodes that don't participate in the failover cluster instance. The list of possible owners for the DNN resource should match the list of possible owners for the SQL Server instance resource. For example, assuming that Data3 does not participate in the FCI, the following image is an example of removing Data3 from the list of possible owners for the DNN resource: 

   :::image type="content" source="media/hadr-distributed-network-name-dnn-configure/clear-check-for-nodes-not-in-fci.png" alt-text="Clear the check box next to the nodes that do not participate in the FCI for possible owners of the DNN resource":::

1. Select **OK** to save your settings. 


## Restart SQL Server instance 

Use Failover Cluster Manager to restart the SQL Server instance. Follow these steps:

1. Go to your SQL Server resource in Failover Cluster Manager.
1. Right-click the SQL Server resource, and take it offline. 
1. After all associated resources are offline, right-click the SQL Server resource and bring it online again. 

## Update connection string

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

## Avoid IP conflict

This is an optional step to prevent the virtual IP (VIP) address used by the FCI resource from being assigned to another resource in Azure as a duplicate. 

Although customers now use the DNN to connect to the SQL Server FCI, the virtual network name (VNN) and virtual IP cannot be deleted as they are necessary components of the FCI infrastructure. However, since there is no longer a load balancer reserving the virtual IP address in Azure, there is a risk that another resource on the virtual network will be assigned the same IP address as the virtual IP address used by the FCI. This can potentially lead to a duplicate IP conflict issue. 

Configure an APIPA address or a dedicated network adapter to reserve the IP address. 

### APIPA address

To avoid using duplicate IP addresses, configure an APIPA address (also known as a link-local address). To do so, run the following command:

```powershell
Get-ClusterResource "virtual IP address" | Set-ClusterParameter 
    –Multiple @{"Address”=”169.254.1.1”;”SubnetMask”=”255.255.0.0”;"OverrideAddressMatch"=1;”EnableDhcp”=0}
```

In this command, "virtual IP address" is the name of the clustered VIP address resource, and "169.254.1.1" is the APIPA address chosen for the VIP address. Choose the address that best suits your business. Set `OverrideAddressMatch=1` to allow the IP address to be on any network, including the APIPA address space. 

### Dedicated network adapter

Alternatively, configure a network adapter in Azure to reserve the IP address used by the virtual IP address resource. However, this consumes the address in the subnet address space, and there is the additional overhead of ensuring the network adapter is not used for any other purpose.

## Limitations

- Currently, a DNN is supported only for SQL Server 2019 CU2 and later on Windows Server 2016. 
- Currently, a DNN is supported only for failover cluster instances with SQL Server on Azure VMs. Use the virtual network name with Azure Load Balancer for availability group listeners.
- There might be more considerations when you're working with other SQL Server features and an FCI with a DNN. For more information, see [FCI with DNN interoperability](failover-cluster-instance-dnn-interoperability.md). 

## Next steps

To learn more about SQL Server HADR features in Azure, see [Availability groups](availability-group-overview.md) and [Failover cluster instance](failover-cluster-instance-overview.md). You can also learn [best practices](hadr-cluster-best-practices.md) for configuring your environment for high availability and disaster recovery. 

There may be additional configuration requirements for some specific SQL Server features when used with the DNN and FCI. See [FCI with DNN interoperability](failover-cluster-instance-dnn-interoperability.md) to learn more. 

