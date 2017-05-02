---
title: Create SQL Server Availability Group Listener - Azure Virtual Machines | Microsoft Docs
description: Step-by-step instructions for creating a listener for an Always On availability group for SQL Server in Azure Virtual Machines
services: virtual-machines
documentationcenter: na
author: MikeRayMSFT
manager: jhubbard
editor: monicar

ms.assetid: d1f291e9-9af2-41ba-9d29-9541e3adcfcf
ms.service: virtual-machines-sql
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 05/01/2017
ms.author: mikeray 

---
# Configure an internal load balancer for an Always On availability group in Azure
This topic explains how to create an internal load balancer for a SQL Server Always On availability group in Azure virtual machines running with Azure Resource Manager. An availability group requires a load balancer when the SQL Server instances are on Azure virtual machines. The load balancer stores the IP address for the availability group listener. If an availability group spans multiple regions, each region needs a load balancer.

To complete this task, you need to have a SQL Server availability group deployed on Azure virtual machines Resource Manager. Both SQL Server virtual machines must belong to the same availability set. You can use the [Microsoft template](virtual-machines-windows-portal-sql-alwayson-availability-groups.md) to automatically create the availability group in Azure Resource Manager. This template automatically creates the internal load balancer for you. 

If you prefer, you can [manually configure an availability group](virtual-machines-windows-portal-sql-alwayson-availability-groups-manual.md).

This topic requires that your availability groups are already configured.  

Related topics include:

* [Configure Always On Availability Groups in Azure VM (GUI)](virtual-machines-windows-portal-sql-alwayson-availability-groups-manual.md)   
* [Configure a VNet-to-VNet connection by using Azure Resource Manager and PowerShell](../../../vpn-gateway/vpn-gateway-vnet-vnet-rm-ps.md)

By walking through this document you create and configure a load balancer in the Azure portal. After that is complete, you will configure the cluster to use the IP address from the load balancer for the availability group listener.

## Create and configure the load balancer in the Azure portal
In this portion of the task, do the following steps in the Azure portal:

1. Create the load balancer and configure the IP address
2. Configure the backend pool
3. Create the probe 
4. Set the load balancing rules

> [!NOTE]
> If the SQL Servers are in different resource groups and regions, you will do all these steps twice, once in each resource group.
> 
> 

### 1. Create the load balancer and configure the IP address
The first step is to create the load balancer. In the Azure portal, open the resource group that contains the SQL Server virtual machines. In the resource group, click **Add**.

1. Search for **load balancer**. From the search results select **Load Balancer**, which is published by **Microsoft**.
1. On the **Load Balancer** blade, click **Create**.
1. On **Create load balancer**, configure the load balancer as follows:

   | Setting | Value |
   | --- | --- |
   | **Name** |A text name representing the load balancer. For example, **sqlLB**. |
   | **Type** |**Internal** |
   | **Virtual network** |Choose the virtual network that the SQL Servers are in. |
   | **Subnet** |Choose the subnet that the SQL Servers are in. |
   | **IP address assignment** |**Static** |
   | **Private IP address** |Specify an available IP address from the subnet. Use this IP address when you create a listener on the cluster. In a PowerShell script later in this article, use this address for the `$ILBIP` variable. |
   | **Subscription** |If you have multiple subscriptions, this field may appear. Select the subscription that you want associated with this resource. It is normally the same subscription as all the resources for the availability group. |
   | **Resource group** |Choose the resource group that the SQL Servers are in. |
   | **Location** |Choose the Azure location that the SQL Servers are in. |

1. Click **Create**. 

Azure creates the load balancer. The load balancer belongs to a specific network, subnet, resource group, and location. After Azure completes, verify the load balancer settings in Azure. 

### 2. Configure the backend pool
The next step is to create a backend address pool. Azure calls the backend address pool *backend pool*. In this case, the backend pool is the addresses of the two SQL Servers in your availability group. 

1. In your resource group, click the load balancer you created. 
1. On **Settings**, click **Backend pools**.
1. On **Backend pools**, click **Add** to create a backend address pool. 
1. On **Add backend pool** under **Name**, type a name for the backend pool.
1. Under **Virtual machines**, click **+ Add a virtual machine**. 
1. Under **Choose virtual machines**, click **Choose an availability set** and specify the availability set that the SQL Server virtual machines belong to.
1. After you have chosen the availability set, click **Choose the virtual machines**. Click the two virtual machines that host the SQL Server instances in the availability group. Click **Select**. 
1. Click **OK** to close the blades for **Choose virtual machines**, and **Add backend pool**. 

Azure updates the settings for the backend address pool. Now your availability set has a pool of two SQL Servers.

### 3. Create a probe
The next step is to create a probe. The probe defines how Azure verifies which of the SQL Servers currently owns the availability group listener. Azure probes the service based on IP address on a port that you define when you create the probe.

1. On the load balancer **Settings** blade, click **Health probes**. 
1. On the **Health probes** blade, click **Add**.
1. Configure the probe on the **Add probe** blade. Use the following values to configure the probe:

   | Setting | Value |
   | --- | --- |
   | **Name** |A text name representing the probe. For example, **SQLAlwaysOnEndPointProbe**. |
   | **Protocol** |**TCP** |
   | **Port** |You may use any available port. For example, *59999*. |
   | **Interval** |*5* |
   | **Unhealthy threshold** |*2* |

1.  Click **OK**. 

> [!NOTE]
> Make sure that the port you specify is open on the firewall of both SQL Servers. Both servers require an inbound rule for the TCP port that you use. For more information, see [Add or Edit Firewall Rule](http://technet.microsoft.com/library/cc753558.aspx). 
> 
> 

Azure creates the probe. Azure uses the probe to test which SQL Server has the listener for the availability group.

### 4. Set the load balancing rules
Set the load balancing rules. The load balancing rules configure how the load balancer routes traffic to the SQL Servers. For this load balancer, enable direct server return because only one of the two SQL Servers owns the availability group listener resource at a time.

1. On the load balancer **Settings** blade, click **Load balancing rules**. 
1. On the **Load balancing rules** blade, click **Add**.
1. Use the **Add load balancing rules** blade to configure the load balancing rule. Use the following settings: 

   | Setting | Value |
   | --- | --- |
   | **Name** |A text name representing the load balancing rules. For example, **SQLAlwaysOnEndPointListener**. |
   | **Protocol** |**TCP** |
   | **Port** |*1433* |
   | **Backend Port** |*1433*. This value will be ignored because this rule uses **Floating IP (direct server return)**. |
   | **Probe** |Use the name of the probe that you created for this load balancer. |
   | **Session persistence** |**None** |
   | **Idle timeout (minutes)** |*4* |
   | **Floating IP (direct server return)** |**Enabled** |

   > [!NOTE]
   > You might have to scroll down on the blade to see all of the settings.
   > 

1. Click **OK**. 
1. Azure configures the load balancing rule. Now the load balancer is configured to route traffic to the SQL Server that hosts the listener for the availability group. 

At this point, the resource group has a load balancer, connecting to both SQL Server machines. The load balancer also contains an IP address for the SQL Server AlwaysOn availability group listener so that either machine can respond to requests for the availability groups.

> [!NOTE]
> If your SQL Servers are in two separate regions, repeat the steps in the other region. Each region requires a load balancer. 
> 
> 

## Configure the cluster to use the load balancer IP address
The next step is to configure the listener on the cluster, and bring the listener online. Do the following steps: 

1. Create the availability group listener on the failover cluster 
2. Bring the listener online

### 5. Create the availability group listener on the failover cluster
In this step, you manually create the availability group listener in Failover Cluster Manager and SQL Server Management Studio (SSMS).

[!INCLUDE [ag-listener-configure](../../../../includes/virtual-machines-ag-listener-configure.md)]

### Verify the configuration of the listener

If the cluster resources and dependencies are correctly configured, you should be able to see the listener in SQL Server management studios. Do the following steps to set the listener port:

1. Launch SQL Server Management Studio and connect to the primary replica.
2. Navigate to **AlwaysOn High Availability** | **Availability Groups** | **Availability Group Listeners**. 
1. You should now see the listener name that you created in Failover Cluster Manager. Right-click the listener name and click **Properties**.
1. In the **Port** box, specify the port number for the availability group listener by using the $EndpointPort you used earlier (1433 was the default), then click **OK**.

You now have an availability group in Azure virtual machines running in Resource Manager mode. 

## Test the connection to the listener
To test the connection:

1. RDP to a SQL Server that is in the same virtual network, but does not own the replica. This can be the other SQL Server in the cluster.
2. Use **sqlcmd** utility to test the connection. For example, the following script establishes a **sqlcmd** connection to the primary replica through the listener with Windows authentication:
   
        sqlcmd -S <listenerName> -E

The SQLCMD connection automatically connects to whichever instance of SQL Server hosts the primary replica. 

## Create an IP address - for an additional availability group

Each availability group uses a separate listener. Each listener has its own IP address. Use the same load balancer to hold the IP address for additional listeners. After you create an new availability group, add the IP address to the load balancer, and then configure the listener.

To add an IP address to a load balancer with the Azure portal do the following steps:

1. In the Azure portal, open the resource group that contains the load balancer and click the load balancer. 
2. Under **SETTINGS** click, **Frontend IP pool**. Click **+ Add**. 
3. Under **Add frontend IP address**, assign a name for the front end. 
4. Verify that the **Virtual network** and the **Subnet** are the same as the SQL Server instances.
5. Set the IP address for the listener. 
   
   >[!TIP]
   >You can set the IP address to static and type an address that is not currently used in the subnet. Alternatively you can set the IP address to dynamic and save the new frontend IP pool. When you do this, the Azure portal will automatically assign an available IP address to the pool. You can then reopen the frontend IP pool and change the assignment to static. 

   Save the IP address for the listener. 

6. Add a health probe. Use the following settings:

   |Setting |Value
   |:-----|:----
   |**Name** |A name to identify the probe.
   |**Protocol** |TCP
   |**Port** |An unused TCP port. Must be available on all virtual machines. Cannot be used for any other purpose. No two listeners can use the same probe port. 
   |**Interval** |The amount of time between probe attempts. Use the default (5).
   |**Unhealthy threshold** |The number of consecutive thresholds that should fail before a virtual machine is considered unhealthy.

   Click **OK** to save the probe. 

7. Create a new load balancing Rule. Click **Load balancing rules**, and then click **+ Add**.
8. Configure the new load balancing rule with the following settings:

   |Setting |Value
   |:-----|:----
   |**Name** |A name to identify the load balancing rule. 
   |**Frontend IP address** |Choose the IP address you created. 
   |**Protocol** |TCP
   |**Port** |Use the port that the SQL Server instances are using. A default instance uses port 1433, unless you changed it. 
   |**Backend port** |Use the same value as **Port**.
   |**Backend pool** |The pool that contains the virtual machines with the SQL Server instances. 
   |**Health probe** |Choose the probe you created.
   |**Session persistence** |None
   |**Idle timeout (minutes)** |Default (4)
   |**Floating IP (direct server return)** | Enabled

### Configure the availability group go use the new IP address

To finish configuring the cluster, repeat the steps you followed when you made the first availability group. Namely, configure the [cluster to use the new IP address](#configure-the-cluster-to-use-the-load-balancer-ip-address). 

After you have added an IP address for the listener, you can configure the additional availability group. 

1. Very that the probe port for the new IP address is open on both SQL Server virtual machines. 

2. [In cluster manager, add the client access point](#addcap).

3. [Configure the IP resource for the availability group](#congroup).

   >[!IMPORTANT]
   >When you create the IP address, use the IP address that you added to the load balancer.  

4. [Make the SQL Server availability group resource dependent on the client access point](#dependencyGroup)

5. [Make the client access point resource dependent on the IP address](#listname).
 
5. [Set the cluster parameters in PowerShell](#setparam).

After you configure the availability group to use the new IP address, configure the connection to the listener. 

## Next steps

- [Configure a SQL Server Always On Availability Group on Azure Virtual Machines in Different Regions](virtual-machines-windows-portal-sql-availability-group-dr.md)
