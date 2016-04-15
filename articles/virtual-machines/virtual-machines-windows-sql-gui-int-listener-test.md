<properties
   pageTitle="Create Listener for AlwaysOn availabilty group for SQL Server in Azure Virtual Machines Test"
   description="Step-by-step instructions for creating a listener for an AlwaysOn availabilty group for SQL Server in Azure Virtual Machines"
   services="virtual-machines"
   documentationCenter="na"
   authors="MikeRayMSFT"
   manager="jhubbard"
   editor="monicar"/>

<tags
   ms.service="virtual-machines"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-windows-sql-server"
   ms.workload="infrastructure-services"
   ms.date="04/15/2016"
   ms.author="MikeRayMSFT"/>

# Configure an internal load balancer for an AlwaysOn availability group in Azure Test

This topic explains how to create an internal load balancer for a SQL Server AlwaysOn availability group in Azure virtual machines running in resource manager mode. An AlwaysOn availability group requires a load balancer when the SQL Server instances are on Azure virtual machines. To complete this task, you need to have a SQL Server AlwaysOn availability group deployed on Azure virtual machines in resource manager model. All Azure resources in this scenario must be in the one resource group. Both SQL Server virtual machines must be on the same network, in the same subnet, and belong to the same availability set.

Related topics include:

 - Create an internet facing load balancer for a SQL Server AlwaysOn availabilty group in Azure virtual machines running in resource manager mode.
 - Create an internal load balancer for a SQL Server AlwaysOn availability group in Azure virtual machines running in classic mode.

## Steps

By walking through this document you will create and configure a load balancer in the Azure portal. After that is complete, you will configure the cluster to use the IP address from the load balancer for the AlwaysOn availability group listener.

## Create and configure the load balancer in the Azure portal

In this portion of the task you will do the following steps in the Azure portal:

1. Create the load balancer

1. Configure the backend pool

1. Set the load balancer IP address

1. Create the probe 

1. Set the load balancing rules

## 1. Create the load balancer

The first step is to create the load balancer. In the Azure portal, open the resource group that contains the SQL Server virtual machines. In the resource group, click **Add**.

Search for **load balancer**. From the search results select **Load Balancer**, which is published by **Microsoft**.

On the **Load Balancer** blade, click **Create**.

On **Create load balancer**, configure the the load balancer as follows:

| Setting | Value |
| ----- | ----- |
| **Name** | A text name representing the load balancer. For example, **sqlLB**. |
| **Schema** | **Internal** |
| **Virtual network** | Choose the virtual network that the SQL Servers are in.   |
| **Subnet**  | Choose the subnet that the SQL Servers are in. |
| **Subscription** | If you have multiple subscriptions, this field may appear. Select the subscription that you want associated with this resource. It is normally the same subcription as all of the resources for the availability group.  |
| **Resource group** | Choose the resource group that the SQL Servers are in. | 
| **Location** | Choose the Azure location that the SQL Servers are in. |

Click **Create**. 

Azure creates the load balancer that you configured above. The load balancer belongs to a specific network, subnet, resource group, and location. After Azure completes, you can see the load balancer in the portal under your resource group. 

## 2. Configure the backend pool

The next step is to create a backend address pool. Azure calls the backend address pool *backend pool*. In this case, the backend pool is the two SQL Servers. 

In your resource group, click on the load balancer you created. 

On the load balancer, click **All settings**. 

On **Settings**, click **Backend pools**.

On **Backend address pools**, click **Add** to create a backend address pool. 

On **Add backend pool** under **Name**, type a name for the backend pool.

Under **Virtual machines** click **+ Add a virtual machine**. 

Under **Choose virtual machines** click **Choose an availability set** and specify the availablity set that the SQL Server virtual machines belong to.

After you have chosen the availability set, click **Choose the virtual machines**. Click the two virtual machines that host the SQL Server instances in the availability group. Click **Select**. 

Click **OK** to close the blades for **Choose virtual machines**, and **Add backend pool**. 

Azure will update the settings for the backend address pool. Now your availability set has a pool of two SQL Servers.

## 3. Set the load balancer IP address

The next step is to set the load balancer IP address. This IP address is also the IP address that you will use for the AlwaysOn availabilty group listener.

On the load balancer **Settings** blade, click **IP address**.

The **IP address** blade shows that this is a private load balancer on the same virtual network as your SQL Servers. Set the following settings.

| Setting | Value |
| ----- | ----- |
| **Subnet** | Choose the subnet that the SQL Servers are in. |
| **Assignment** | **Static** |
| **IP address** | Type an unused virtual IP address from the subnet.  |

Save the settings.

Now the load balancer has an IP address. Record this IP address. You will use this IP address when you create a listener on the cluster. In a PowerShell script later in this article, use this address for the $ILBIP variable.

## 4. Create a probe

The next step is to create a probe. The probe defines how Azure will verify which of the SQL Servers currently owns the availability group listener. Azure will probe the service based on IP address on a port that you define when you create the probe.

On the load balancer **Settings** blade, click **Probes**. 

On the **Probes** blade, click **Add**.

Use the **Add probe** blade to configure the probe. Use the following values to configure the probe:

| Setting | Value |
| ----- | ----- |
| **Name** | A text name representing the probe. For example, **SQLAlwaysOnEndPointProbe**. |
| **Protocol** | **TCP** |
| **Port** | You may use any available port. For example, *59999*.    |
| **Interval**  | *5* | 
| **Unhealthy threshold**  | *2* | 

Click **OK**. 

Azure creates the probe. Azure will use the probe to test which SQL Server has the listener for the availability group.

## 5. Set the load balancing rules

Set the load balancing rules. The load balancing rules configure how the load balancer routes traffic to the SQL Servers. For this load balancer you will enable direct server return because only one of the two SQL Servers will ever own the availability group listener resource at a time.

On the load balancer **Settings** blade, click **Load balancing rules**. 

On the **Load balancing rules** blade, click **Add**.

Use the **Add load balancing rules** blade to configure the load balancing rule. Use the following settings: 

| Setting | Value |
| ----- | ----- |
| **Name** | A text name representing the load balancing rules. For example, **SQLAlwaysOnEndPointListener**. |
| **Protocol** | **TCP** |
| **Port** | *1433*   |
| **Backend Port** | *1433*. Note that this will be disable because this rule uses **Floating IP (direct server return**.   |
| **Probe** | Use the name of the probe that you created for this load balancer. |
| **Session persistance**  | **None** | 
| **Idle timeout (minutes)**  | *4* | 
| **Floating IP (direct server return)**  | **Enabled** | 

Note that you might have to scroll down on the blade to see all of the settings.

Click **OK**. 

Azure configures the load balancing rule. Now the load balancer is configured to route traffic to the SQL Server that hosts the listener for the availability group. 

At this point the resource group has a load balancer, connecting to both SQL Server machines. The load balancer also contains an IP address for the SQL Server AlwaysOn availablity group listener so that either machine can respond to requests for the availability groups.

## Configure the cluster to use the load balancer IP address 

The next step is to configure the listener on the cluster, and bring the listener online. 

1. Create the availablity group listener on the failover cluster 

1. Bring the listener online

## 1. Create the availablity group listener on the failover cluster

In this step, you manually create the availability group listener in Failover Cluster Manager and SQL Server Management Studio (SSMS).

1. Use RDP to connect to the Azure virtual machine that hosts the primary replica. 

1. Open Failover Cluster Manager.

1. Select the **Networks** node, and note the cluster network name. This name will be used in the $ClusterNetworkName variable in the PowerShell script.

1. Expand the cluster name, and then click **Roles**.

1. In the **Roles** pane, right-click the availability group name and then select **Add Resource** > **Client Access Point**.

1. In the **Name** box, create a name for this new listener, then click **Next** twice, and then click **Finish**. Do not bring the listener or resource online at this point.

1. Click the **Resources** tab, then expand the Client Access Point you just created. You will see the **IP Address** resource for each of the cluster networks in your cluster. If this is an Azure-only solution, you will only see one IP address resource.

1. Note the name of the IP address. You will use this name in the $IPResourceName variable in the PowerShell script.

1. Under **IP Address** click **Static IP Address** and set the static IP address to the same address that you used when you set the load balancer IP address on the Azure portal. Enable NetBIOS for this address and click **OK**. Repeat this step for each IP resource if your solution spans multiple Azure VNets. 

On the cluster node that currently hosts the primary replica, open an elevated PowerShell ISE and paste the following commands into a new script.

    $ClusterNetworkName = "<MyClusterNetworkName>" # the cluster network name (Use Get-ClusterNetwork on Windows Server 2012 of higher to find the name)
    $IPResourceName = "<IPResourceName>" # the IP Address resource name
    $ILBIP = “<X.X.X.X>” # the IP Address of the Internal Load Balancer (ILB). This is the static IP address for the load balancer you configured in the Azure portal.
    
    Import-Module FailoverClusters
    
    Get-ClusterResource $IPResourceName | Set-ClusterParameter -Multiple @{"Address"="$ILBIP";"ProbePort"="59999";"SubnetMask"="255.255.255.255";"Network"="$ClusterNetworkName";"EnableDhcp"=0}

Run the PowerShell script to configure the IP address and port for the new listener. See what it does for you.

## 2. Bring the listener online


1. Navigate back to Failover Cluster Manager. Expand **Roles** and then highlight your Availability Group. On the **Resources** tab, right-click the listener name and click **Properties**.


1. Click the **Dependencies** tab. If there are multiple resources listed, verify that the IP addresses have OR, not AND, dependencies. Click **OK**.

1. Right-click the listener name and click **Bring Online**.


1. Once the listener is online, from the **Resources** tab, right-click the availability group and click **Properties**.

1. Create a dependency on the listener name resource (not the IP address resources name). Click **OK**.


1. Launch SQL Server Management Studio and connect to the primary replica.


1. Navigate to **AlwaysOn High Availability** | **Availability Groups** | **Availability Group Listeners**. 


1. You should now see the listener name that you created in Failover Cluster Manager. Right-click the listener name and click **Properties**.


1. In the **Port** box, specify the port number for the availability group listener by using the $EndpointPort you used earlier (1433 was the default), then click **OK**.

You now have a SQL Server AlwaysOn availability group in Azure virtual machines running in resource manager mode. 

## Guidelines and limitations

Note the following guidelines on availablity group listener in Azure using internal load balancer:

- Only one internal availablity group listener is supported per cloud service because the listener is configured to the load balancer, and there is only one internal load balancer. However it is possible to create multipe external listeners. 

- With an internal load balancer you only access the listener from within the same virtual network.
 
