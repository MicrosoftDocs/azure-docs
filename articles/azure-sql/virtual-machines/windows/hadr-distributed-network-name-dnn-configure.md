---
title: Configure distributed network name (DNN)
description: Learn how to configure a distributed network name (DNN) to route traffic to your SQL Server on Azure VM failover cluster instance (FCI) or your availability group listener. 
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

This article teaches you to configure a distributed network name (DNN) to route traffic to your [availability group listener](availability-group-overview.md) or [failover cluster instances (FCI)](failover-cluster-instance-overview.md) with SQL Server on Azure VMs for high availability and disaster recovery (HADR). 

## Prerequisites

Before you complete the steps in this article, you should already have:

- Decided the distributed network name (DNN) is the appropriate [connectivity option for your HADR solution](hadr-cluster-best-practices.md#connectivity).
- Configured your [availability group listener](availability-group-overview.md) or [failover cluster instances (FCI)](failover-cluster-instance-overview.md). 
- The latest version of [PowerShell](/powershell/azure/install-az-ps?view=azps-4.2.0). 


## Create the DNN resource 


Use the following PowerShell command to create the DNN resource and set the DNS name for it. 

```powershell
Add-ClusterResource -Name <dnnResourceName> `
-ResourceType "Distributed Network Name" -Group "<WSFC role of SQL server instance>"
```

This command adds a DNN resource to the cluster with the resource name as `<dnnResourceName>`. The resource name is used by the cluster to uniquely identify a cluster resource. Use one that makes sense to you and is unique across the cluster. The resource type must be `Distributed Network Name`. 


---------------------------------------------------
---------------------------------------------------

to discuss: i need clarity here. Are there two separate groups? Is this saying that the DNN is being added to the same cluster group as the FCI, or it needs to be in a separate group,  but have the same name as the fci group??  Also we need to figure out if it's dynamic netmwork name or distributed netowrk name cuz this is in the powershell haha

The name of the group this DNN resource belongs to must be the cluster resource group (role) corresponding to the FCI you want to add the DNN resource to. 
The typical format of this group name is “SQL Server (instance name)”, therefore for default instance, the name will be “SQL Server (MSSQLSERVER)". You can check the name of the group in Failover Cluster Manager console.

---------------------------------------------------
---------------------------------------------------



## Set DNN name in DNS


---------------------------------------------------
---------------------------------------------------

to discuss: i need clarity here, do we have two options here? we can either use the existing VNN or not? i'm guessing it's the latter and hoping for it cuz that's how i wrote it :D 


---------------------------------------------------
---------------------------------------------------


Clients connect to the DNN, and the DNS server routes traffic from the client to the DNN, which is the virtual endpoint on the network for your failover cluster instance. You can set the DNS name to the name of the DNN, and clients can connect to the failover cluster instance using the new DNN. However, to prevent needing to update a connection string, you can also update the DNN to the name of your currently active virtual network name (VNN). SQL Server will shut down in the process so proceed with caution.

   > [!CAUTION]
   > Once the DNS name is set to the current DNN, connections to the currently active VNN will fail. Update the connection string to the current DNN to connect to the failover cluster instance or availability group listener. To mitigate this requirement, replace the name of the currently active VNN with a placeholder VNN and then [replace the name of the current DNN](#replace-dnn-name-with-vnn-name) with the currently active VNN. Doing so will take SQL Server FCI or availability group listener offline so proceed with caution.     
   


---------------------------------------------------
---------------------------------------------------

to discuss: i'm basically guessing here about what's gana happen with the whole swap so this needs a fact check please

----------------------------------------------------
---------------------------------------------------

Use PowerShell to set the name of your distributed network name (DNN) in DNS. If you want clients to continue using the current virtual network name (VNN) to connect to the failover cluster instance, before proceeding, make sure you have [replaced your DNN name with your VNN name](replace-dnn-name-with-vnn-name) prior to setting the name in DNS or you will need to repeat this step again. The DNN name in DNS is the name clients use to connect to your failover cluster instance or availability group listener.  

To set the DNN name in DNS, run the following PowerShell command: 

```powershell
Get-ClusterResource -Name <dnnResourceName> `
Set-ClusterParameter -Name DnsName -Value <DNSName>
```

### Replace DNN name with VNN name

Clients use the virtual network name (VNN) to connect to the failover cluster instance or availability group listener. You can replace the DNN name with the virtual network name that clients are currently using so that updating the connection string is not necessary. 

To replace the current placeholder DNN (ex: placeholder_DNN), first rename the currently active virtual network name (VNN) (example: active_VNN) with a placeholder name (example: placeholder_VNN), and then replace the DNN with the currently active VNN. 

The FCI or listener will go offline when the virtual network name (VNN) goes offline. This step is necessary for clients to continue to use the current active VNN to connect to instance of listener. If connecting to the current VNN is not necessary for your business, you can choose to skip this step, [set the name of your DNS to the current DNN](#set-dns-name), and then update connection strings to connect to the DNN instead. 

To rename your active VNN (active_VNN) to a placeholder name (placeholder_VNN), follow these steps: 

1. Open the failover cluster instance resource in Failover Cluster Manager. 
1. Right-click the virtual network name (VNN) for the FCI or listener and select **Properties**. 
1. Update the current active VNN (active_VNN) to a placeholder name (placeholder_VNN) different from the names currently used for the VNN or the DNN.  
1. Select **OK** to save your new name. 
1. Right-click the newly renamed VNN (placeholder_VNN) and take it offline. This will take the associated IP address and clustered resource offline as well, closing all connections and rolling back any uncommitted transactions. 
1. Right-click the VNN and bring it online. 

Next, replace the name of the DNN with the active VNN (active_VNN) following these steps:

1. Right-click the DNN resource, and select **Properties**. 
1. Replace the DNN name (placeholder_DNN) with the current active VNN name (active_VNN). 
1. **If you haven't done so already, set [the DNN name in DNS](set-dnn-name-in-dns) before setting the DNN resource online.**




## Set DNN resource online

Once your DNN resource is appropriately named, and you've updated the name in DNS, use PowerShell to set the DNN resource online in the cluster. 

Use PowerShell to set the DNN resource online: 

```powershell

Start-ClusterResource -Name <dnnResourceName>

```

## Create network alias

There are some server-side components that rely on a hard-coded VNN value, and require a network alias that maps the VNN to the DNN to function properly. 

Follow the steps in [Create a server alias](/sql/database-engine/configure-windows/create-or-delete-a-server-alias-for-use-by-a-client) to create an alias that maps the VNN to the DNN. 

For a default instance, you can map the VNN to the DNN directly, such that VNN = DNN.   
For example, if VNN name is `FCI1`, instance name is `MSSQLSERVER`, and the DNN is `FCI1DNN` (clients previously connected to `FCI`, and now they connect to `FCI1DNN`) then map the VNN `FCI1` to the DNN `FCI1DNN`. 

For a named instance the network alias mapping should be done for the full instance, such that `VNN\Instance` = `DNN\Instance`. 
For example, if VNN name is `FCI1`, instance name is `instA`, and the DNN is `FCI1DNN` (clients previously connected to `FCI1\instA`, and now they connect to `FCI1DNN\instaA`) then map the VNN `FCI1\instaA` to the DNN `FCI1DNN\instaA`. 

## Update SQL client connection string

If the DNN name was not replaced with the existing VNN name, clients still connecting to the VNN will need to update their connection string to connect to the DNN instead. To ensure rapid connectivity upon failover, add `MultiSubnetFailover=True` to the connection string as well if the SQL client version is lower than 4.6.1. 


## Test failover

Test failover of the clustered resource to validate cluster functionality. 

# [Failover cluster instance](#tab/fci)

Take the following steps:

1. Connect to one of the SQL Server cluster nodes by using RDP.
1. Open **Failover Cluster Manager**. Select **Roles**. Notice which node owns the SQL Server FCI role.
1. Right-click the SQL Server FCI role. 
1. Select **Move**, and then select **Best Possible Node**.

**Failover Cluster Manager** shows the role, and its resources go offline. The resources then move and come back online in the other node.



# [AG Listener](#tab/ag)

Take the following steps:

1. Open [SQL Server Management Studio (SSMS)](/sql/ssms/download-sql-server-management-studio-ssms) and connect to your availability group listener.
1. Expand **Always On Availability Group** in the **Object Explorer**. 
1. Right-click the availability group and choose **Failover**. 
1. Follow the Wizard prompts to fail the availability group over to a secondary replica. 

Failover succeeds when the replicas switch roles and are both synchronized. 

---

## Test connectivity

To test connectivity, sign in to another virtual machine in the same virtual network. Open **SQL Server Management Studio** and connect to the SQL Server FCI name.

>[!NOTE]
>If you need to, you can [download SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms).



## Next steps

To learn more about SQL Server HADR features in Azure, see [availability groups](availability-group-overview.md) and [failover cluster instance](failover-cluster-instance-overview.md) as well as [best practices](hadr-cluster-best-practices.md) for configuring your environment for high availability and disaster recovery. 




