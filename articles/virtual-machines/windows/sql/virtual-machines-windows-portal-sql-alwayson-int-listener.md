---
title: Create a SQL Server availability group listener in Azure virtual machines | Microsoft Docs
description: Step-by-step instructions for creating a listener for an Always On availability group for SQL Server in Azure virtual machines
services: virtual-machines
documentationcenter: na
author: MikeRayMSFT
manager: craigg
editor: monicar

ms.assetid: d1f291e9-9af2-41ba-9d29-9541e3adcfcf
ms.service: virtual-machines-sql
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 02/16/2017
ms.author: mikeray 

---
# Configure a load balancer for an Always On availability group in Azure
This article explains how to create a load balancer for a SQL Server Always On availability group in Azure virtual machines that are running with Azure Resource Manager. An availability group requires a load balancer when the SQL Server instances are on Azure virtual machines. The load balancer stores the IP address for the availability group listener. If an availability group spans multiple regions, each region needs a load balancer.

To complete this task, you need to have a SQL Server availability group deployed on Azure virtual machines that are running with Resource Manager. Both SQL Server virtual machines must belong to the same availability set. You can use the [Microsoft template](virtual-machines-windows-portal-sql-alwayson-availability-groups.md) to automatically create the availability group in Resource Manager. This template automatically creates an internal load balancer for you. 

If you prefer, you can [manually configure an availability group](virtual-machines-windows-portal-sql-availability-group-tutorial.md).

This article requires that your availability groups are already configured.  

Related topics include:

* [Configure Always On availability groups in Azure VM (GUI)](virtual-machines-windows-portal-sql-availability-group-tutorial.md)   
* [Configure a VNet-to-VNet connection by using Azure Resource Manager and PowerShell](../../../vpn-gateway/vpn-gateway-vnet-vnet-rm-ps.md)

By walking through this article, you create and configure a load balancer in the Azure portal. After the process is complete, you configure the cluster to use the IP address from the load balancer for the availability group listener.

## Create and configure the load balancer in the Azure portal
In this portion of the task, do the following:

1. In the Azure portal, create the load balancer and configure the IP address.
2. Configure the back-end pool.
3. Create the probe. 
4. Set the load balancing rules.

> [!NOTE]
> If the SQL Server instances are in multiple resource groups and regions, perform each step twice, once in each resource group.
> 
> 

### Step 1: Create the load balancer and configure the IP address
First, create the load balancer. 

1. In the Azure portal, open the resource group that contains the SQL Server virtual machines. 

2. In the resource group, click **Add**.

3. Search for **load balancer** and then, in the search results, select **Load Balancer**, which is published by **Microsoft**.

4. On the **Load Balancer** blade, click **Create**.

5. In the **Create load balancer** dialog box, configure the load balancer as follows:

   | Setting | Value |
   | --- | --- |
   | **Name** |A text name representing the load balancer. For example, **sqlLB**. |
   | **Type** |**Internal**: Most implementations use an internal load balancer, which allows applications within the same virtual network to connect to the availability group.  </br> **External**: Allows applications to connect to the availability group through a public Internet connection. |
   | **Virtual network** |Select the virtual network that the SQL Server instances are in. |
   | **Subnet** |Select the subnet that the SQL Server instances are in. |
   | **IP address assignment** |**Static** |
   | **Private IP address** |Specify an available IP address from the subnet. Use this IP address when you create a listener on the cluster. In a PowerShell script, later in this article, use this address for the `$ILBIP` variable. |
   | **Subscription** |If you have multiple subscriptions, this field might appear. Select the subscription that you want to associate with this resource. It is normally the same subscription as all the resources for the availability group. |
   | **Resource group** |Select the resource group that the SQL Server instances are in. |
   | **Location** |Select the Azure location that the SQL Server instances are in. |

6. Click **Create**. 

Azure creates the load balancer. The load balancer belongs to a specific network, subnet, resource group, and location. After Azure completes the task, verify the load balancer settings in Azure. 

### Step 2: Configure the back-end pool
Azure calls the back-end address pool *backend pool*. In this case, the back-end pool is the addresses of the two SQL Server instances in your availability group. 

1. In your resource group, click the load balancer that you created. 

2. On **Settings**, click **Backend pools**.

3. On **Backend pools**, click **Add** to create a back-end address pool. 

4. On **Add backend pool**, under **Name**, type a name for the back-end pool.

5. Under **Virtual machines**, click **Add a virtual machine**. 

6. Under **Choose virtual machines**, click **Choose an availability set**, and then specify the availability set that the SQL Server virtual machines belong to.

7. After you have chosen the availability set, click **Choose the virtual machines**, select the two virtual machines that host the SQL Server instances in the availability group, and then click **Select**. 

8. Click **OK** to close the blades for **Choose virtual machines**, and **Add backend pool**. 

Azure updates the settings for the back-end address pool. Now your availability set has a pool of two SQL Server instances.

### Step 3: Create a probe
The probe defines how Azure verifies which of the SQL Server instances currently owns the availability group listener. Azure probes the service based on the IP address on a port that you define when you create the probe.

1. On the load balancer **Settings** blade, click **Health probes**. 

2. On the **Health probes** blade, click **Add**.

3. Configure the probe on the **Add probe** blade. Use the following values to configure the probe:

   | Setting | Value |
   | --- | --- |
   | **Name** |A text name representing the probe. For example, **SQLAlwaysOnEndPointProbe**. |
   | **Protocol** |**TCP** |
   | **Port** |You can use any available port. For example, *59999*. |
   | **Interval** |*5* |
   | **Unhealthy threshold** |*2* |

4.  Click **OK**. 

> [!NOTE]
> Make sure that the port you specify is open on the firewall of both SQL Server instances. Both instances require an inbound rule for the TCP port that you use. For more information, see [Add or Edit Firewall Rule](https://technet.microsoft.com/library/cc753558.aspx). 
> 
> 

Azure creates the probe and then uses it to test which SQL Server instance has the listener for the availability group.

### Step 4: Set the load balancing rules
The load balancing rules configure how the load balancer routes traffic to the SQL Server instances. For this load balancer, you enable direct server return because only one of the two SQL Server instances owns the availability group listener resource at a time.

1. On the load balancer **Settings** blade, click **Load balancing rules**. 

2. On the **Load balancing rules** blade, click **Add**.

3. On the **Add load balancing rules** blade, configure the load balancing rule. Use the following settings: 

   | Setting | Value |
   | --- | --- |
   | **Name** |A text name representing the load balancing rules. For example, **SQLAlwaysOnEndPointListener**. |
   | **Protocol** |**TCP** |
   | **Port** |*1433* |
   | **Backend Port** |*1433*. This value is ignored because this rule uses **Floating IP (direct server return)**. |
   | **Probe** |Use the name of the probe that you created for this load balancer. |
   | **Session persistence** |**None** |
   | **Idle timeout (minutes)** |*4* |
   | **Floating IP (direct server return)** |**Enabled** |

   > [!NOTE]
   > You might have to scroll down the blade to view all the settings.
   > 

4. Click **OK**. 
5. Azure configures the load balancing rule. Now the load balancer is configured to route traffic to the SQL Server instance that hosts the listener for the availability group. 

At this point, the resource group has a load balancer that connects to both SQL Server machines. The load balancer also contains an IP address for the SQL Server Always On availability group listener, so that either machine can respond to requests for the availability groups.

> [!NOTE]
> If your SQL Server instances are in two separate regions, repeat the steps in the other region. Each region requires a load balancer. 
> 
> 

## Configure the cluster to use the load balancer IP address
The next step is to configure the listener on the cluster, and bring the listener online. Do the following: 

1. Create the availability group listener on the failover cluster. 

2. Bring the listener online.

### Step 5: Create the availability group listener on the failover cluster
In this step, you manually create the availability group listener in Failover Cluster Manager and SQL Server Management Studio.

[!INCLUDE [ag-listener-configure](../../../../includes/virtual-machines-ag-listener-configure.md)]

### Verify the configuration of the listener

If the cluster resources and dependencies are correctly configured, you should be able to view the listener in SQL Server Management Studio. To set the listener port, do the following:

1. Start SQL Server Management Studio, and then connect to the primary replica.

2. Go to **AlwaysOn High Availability** > **Availability Groups** > **Availability Group Listeners**.  
    You should now see the listener name that you created in Failover Cluster Manager. 

3. Right-click the listener name, and then click **Properties**.

4. In the **Port** box, specify the port number for the availability group listener by using the $EndpointPort you used earlier (1433 was the default), and then click **OK**.

You now have an availability group in Azure virtual machines running in Resource Manager mode. 

## Test the connection to the listener
Test the connection by doing the following:

1. RDP to a SQL Server instance that is in the same virtual network, but does not own the replica. This server can be the other SQL Server instance in the cluster.

2. Use **sqlcmd** utility to test the connection. For example, the following script establishes a **sqlcmd** connection to the primary replica through the listener with Windows authentication:
   
        sqlcmd -S <listenerName> -E

The SQLCMD connection automatically connects to the SQL Server instance that hosts the primary replica. 

## Create an IP address for an additional availability group

Each availability group uses a separate listener. Each listener has its own IP address. Use the same load balancer to hold the IP address for additional listeners. After you create an availability group, add the IP address to the load balancer, and then configure the listener.

To add an IP address to a load balancer with the Azure portal, do the following:

1. In the Azure portal, open the resource group that contains the load balancer, and then click the load balancer. 

2. Under **SETTINGS**, click **Frontend IP pool**, and then click **Add**. 

3. Under **Add frontend IP address**, assign a name for the front end. 

4. Verify that the **Virtual network** and the **Subnet** are the same as the SQL Server instances.

5. Set the IP address for the listener. 
   
   >[!TIP]
   >You can set the IP address to static and type an address that is not currently used in the subnet. Alternatively, you can set the IP address to dynamic and save the new front-end IP pool. When you do so, the Azure portal automatically assigns an available IP address to the pool. You can then reopen the front-end IP pool and change the assignment to static. 

6. Save the IP address for the listener. 

7. Add a health probe by using the following settings:

   |Setting |Value
   |:-----|:----
   |**Name** |A name to identify the probe.
   |**Protocol** |TCP
   |**Port** |An unused TCP port, which must be available on all virtual machines. It cannot be used for any other purpose. No two listeners can use the same probe port. 
   |**Interval** |The amount of time between probe attempts. Use the default (5).
   |**Unhealthy threshold** |The number of consecutive thresholds that should fail before a virtual machine is considered unhealthy.

8. Click **OK** to save the probe. 

9. Create a load balancing rule. Click **Load balancing rules**, and then click **Add**.

10. Configure the new load balancing rule by using the following settings:

    |Setting |Value
    |:-----|:----
    |**Name** |A name to identify the load balancing rule. 
    |**Frontend IP address** |Select the IP address you created. 
    |**Protocol** |TCP
    |**Port** |Use the port that the SQL Server instances are using. A default instance uses port 1433, unless you changed it. 
    |**Backend port** |Use the same value as **Port**.
    |**Backend pool** |The pool that contains the virtual machines with the SQL Server instances. 
    |**Health probe** |Choose the probe you created.
    |**Session persistence** |None
    |**Idle timeout (minutes)** |Default (4)
    |**Floating IP (direct server return)** | Enabled

### Configure the availability group to use the new IP address

To finish configuring the cluster, repeat the steps that you followed when you made the first availability group. That is, configure the [cluster to use the new IP address](#configure-the-cluster-to-use-the-load-balancer-ip-address). 

After you have added an IP address for the listener, configure the additional availability group by doing the following: 

1. Verify that the probe port for the new IP address is open on both SQL Server virtual machines. 

2. [In Cluster Manager, add the client access point](#addcap).

3. [Configure the IP resource for the availability group](#congroup).

   >[!IMPORTANT]
   >When you create the IP address, use the IP address that you added to the load balancer.  

4. [Make the SQL Server availability group resource dependent on the client access point](#dependencyGroup).

5. [Make the client access point resource dependent on the IP address](#listname).
 
6. [Set the cluster parameters in PowerShell](#setparam).

After you configure the availability group to use the new IP address, configure the connection to the listener. 

## Add load balancing rule for distributed availability group

If an availability group participates in a distributed availability group, the load balancer needs an additional rule. This rule stores the port used by the distributed availability group listener.

>[!IMPORTANT]
>This step only applies if the availability group participates in a [distributed availability group](https://docs.microsoft.com/sql/database-engine/availability-groups/windows/configure-distributed-availability-groups). 

1. On each server that participates in the distributed availability group, create an inbound rule on the distributed availability group listener TCP port. In many examples, documentation uses 5022. 

1. In the Azure portal, click on the load balancer and click **Load balancing rules**, and then click **+Add**. 

1. Create the load balancing rule with the following settings:

   |Setting |Value
   |:-----|:----
   |**Name** |A name to identify the load balancing rule for the distributed availability group. 
   |**Frontend IP address** |Use the same frontend IP address as the availability group.
   |**Protocol** |TCP
   |**Port** |5022 - The port for the [distributed availability group endpoint listener](https://docs.microsoft.com/sql/database-engine/availability-groups/windows/configure-distributed-availability-groups).</br> Can be any available port.  
   |**Backend port** | 5022 - Use the same value as **Port**.
   |**Backend pool** |The pool that contains the virtual machines with the SQL Server instances. 
   |**Health probe** |Choose the probe you created.
   |**Session persistence** |None
   |**Idle timeout (minutes)** |Default (4)
   |**Floating IP (direct server return)** | Enabled

Repeat these steps for the load balancer on the other availability groups that participate in the distributed availability groups.

If you are restricting access with an Azure Network Security Group, ensure that the allow rules include the backend SQL Server VM IP addresses, and the load balancer floating IP addresses for the AG listener and the cluster core IP address, if applicable.

## Next steps

- [Configure a SQL Server Always On availability group on Azure virtual machines in different regions](virtual-machines-windows-portal-sql-availability-group-dr.md)
