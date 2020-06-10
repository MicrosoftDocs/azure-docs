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

- Decided the distributed network name (DNN) is the appropriate [connectivity option for your HADR solution](hadr-supported-cluster-configurations.md#connectivity).
- Configured your [availability group listener](availability-group-overview.md) or [failover cluster instances (FCI)](failover-cluster-instance-overview.md). 
- The latest version of [PowerShell](/powershell/azure/install-az-ps?view=azps-4.2.0). 


## Create the DNN resource 


Use the following PowerShell command to create the DNN resource and set the DNS name for it. 

```powershell
Add-ClusterResource -Name <dnnResourceName> `
-ResourceType "Distributed Network Name" -Group "<WSFC role of SQL server instance or listener>"
```

This command adds a DNN resource to the cluster with the resource name as `<dnnResourceName>`. The resource name is used by the cluster to uniquely identify a cluster resource. Use one that makes sense to you and is unique across the cluster. The resource type must be `Distributed Network Name`. 


-------------------------

i need clarity here. Are there two separate groups? Is this saying that the DNN is being added to the same cluster group as the FCI, or it needs to be in a separate group,  but have the same name as the fci group??  Also we need to figure out if it's dynamic netmwork name or distributed netowrk name cuz this is in the powershell haha

The name of the group this DNN resource belongs to must be the cluster resource group (role) corresponding to the FCI you want to add the DNN resource to. 
The typical format of this group name is “SQL Server (instance name)”, therefore for default instance, the name will be “SQL Server (MSSQLSERVER)". You can check the name of the group in Failover Cluster Manager console.

------------------




## Set DNN name in DNS

-------------------------------------

i need clarity here, do we have two options here? we can either use the existing VNN or not? i'm guessing it's the latter and hoping for it cuz that's how i wrote it :D 


---------------------------------------


Clients connect to the DNN, and the DNS server routes traffic from the client to the DNN, which is the virtual endpoint on the network for your failover cluster instance. You can set the DNS name to the name of the DNN, and clients can connect to the failover cluster instance using the new DNN. However, to prevent needing to update a connection string, you can also update the DNN to the name of your currently active virtual network name (VNN). SQL Server will shut down in the process so proceed with caution.

   > [!CAUTION]
   > Once the DNS name is set to the current DNN, connections to the currently active VNN will fail. Update the connection string to the current DNN to connect to the failover cluster instance. To mitigate this requirement, replace the name of the currently active VNN with a placeholder VNN and then [replace the name of the current DNN](#replace-dnn-name-with-vnn-name) with the currently active VNN. Doing so will take SQL Server offline so proceed with caution.     
   

---------------------------------------------------

i'm basically guessing here about what's gana happen with the whole swap so this needs a fact check please

----------------------------------------------------


Use PowerShell to set the name of your distributed network name (DNN) in DNS. If you want clients to continue using the current virtual network name (VNN) to connect to the failover cluster instance, before proceeding, make sure you have [replaced your DNN name with your VNN name](replace-dnn-name-with-vnn-name) prior to setting the name in DNS or you will need to repeat this step again. The DNN name in DNS is the name clients use to connect to your failover cluster instance.  

To set the DNN name in DNS, run the following PowerShell command: 

```powershell
Get-ClusterResource -Name <dnnResourceName> `
Set-ClusterParameter -Name DnsName -Value <DNSName>
```

### Replace DNN name with VNN name

Clients use the virtual network name (VNN) to connect to the failover cluster instance. You can replace the DNN name with the virtual network name that clients are currently using so that updating the connection string is unnecessary. To replace the current placeholder DNN (ex: placeholder_DNN) name, first rename the currently active virtual network name (VNN) (example: active_VNN) with a placeholder name (example: placeholder_VNN), and then replace the DNN name with the currently active VNN name. 

SQL Server will go offline when the virtual network name (VNN) goes offline. This step is necessary for clients to continue to use the current active VNN to connect to your SQL Server failover cluster instance. If this is not necessary for your business, you can choose to skip this step, [set the name of your DNS to the current DNN](#set-dns-name), and then update connection strings to connect to the DNN instead. 

To rename your active VNN (active_VNN) to a placeholder name (placeholder_VNN), follow these steps: 

1. Open the failover cluster instance resource in Failover Cluster Manager. 
1. Right-click the virtual network name (VNN) for the SQL Server failover cluster instance and select **Properties**. 
1. Update the name of the VNN to a placeholder name (placeholder_VNN) different from the active VNN (active_VNN) and DNN (placeholder_DNN) names. 
1. Select **OK** to save your new name. 
1. Right-click the newly renamed VNN (placeholder_VNN) and take it offline. This will take the associated IP address and SQL Server instance offline as well, closing all connections and rolling back any uncommitted transactions. 
1. Right-click the VNN and bring it online. 

Next, replace the name of the DNN with the active VNN (active_VNN) following these steps:

1. Right-click the DNN resource, and select **Properties**. 
1. Replace the DNN name (placeholder_DNN) with the current active VNN name (active_VNN). 
1. **If you haven't done so already, set [the DNN name in DNS](set-dnn-name-in-dns) before setting the DNN resource online. **




## Set DNN resource online

Once your DNN resource is appropriately named, use PowerShell to to set the DNN resource online in the cluster. 

Use PowerShell to set the DNN resource online: 

```powershell

Start-ClusterResource -Name <dnnResourceName>

```

## Configure possible nodes

By default, the DNN name is bound to all the nodes in the cluster. Configure the possible owner of the DNN resource to only include the nodes of the failover cluster instance, if not all nodes in the cluster are part of the failover cluster instance. 

## Update SQL cllient connection string


2.	Replace the Virtual Network Name (VNN) in SQL client connection string with the DNN DNS name, and set the "MultiSubnetFailover" property to true. You can skip setting this property if the SQL client version is after 4.6.1. if sql restarts during this process you do not need to restart it a second time and can skip the next step 

## restart sql server instance

## Feature specific considerations


The following table details feature interoperability when using a distributed network name with FCI and SQL Server on Azure VMs. 


## faq 


1-	Which SQL Server version brings the support? 
SQL Server 19 CU2 and above.
2-	What is the expected failover time when DNN is used?

For DNN, the failover time will be just the FCI failover time, there is no additional time added (like probe time in load balancer case).

3-	Which scenarios requires mapping DNS names of VNN to DNN?

For regular client access, simply modify the connection string to use the DNN DNS name. For FCI DNN to integrate with other SQL server features, the configuration of these features sometimes needs to reference the FCI. The features require a network alias mapping can be found in the DNN interoperability article replication section.
4-	Is there any version requirement for SQL Clients to support DNN with OLEDB and ODBC?

The only client support needed for DNN is the MultiSubnetFailover flag  and it starts from SQL Server 2012 (11.x)  . 
5-	Is there any changes required in SQL Server configuration to use DNN?

There is no SQL server configuration change.  For other SQL server features to work with DNN, reference the corresponding interop work around.

6-	Does DNN support multi-subnet clusters?
Yes. WSFC binds DNN DNS name with the physical IP addresses of all nodes in the cluster regardless of the subnet. The SQL client try all IP addresses of the DNS name regardless of the subnet. Whether there are multiple subnets does not matter in this scheme. 



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

### Test connectivity

To test connectivity, sign in to another virtual machine in the same virtual network. Open **SQL Server Management Studio** and connect to the SQL Server FCI name.

>[!NOTE]
>If you need to, you can [download SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms).



## Next steps

If you haven't already, register your SQL Server FCI with the SQL VM resource provider in [lightweight management mode](sql-vm-resource-provider-register.md#lightweight-management-mode). Alternatively, unregistered SQL Server VMs participating in an availability group can register in [full mode][lightweight management mode](sql-vm-resource-provider-register.md#full-management-mode). 

To learn more about SQL Server HADR features in Azure, see [availability groups](availability-group-overview.md) and [failover cluster instance](failover-cluster-instance-overview.md) as well as [best practices](hadr-supported-cluster-configurations.md) for configuring your environment for high availability and disaster recovery. 




