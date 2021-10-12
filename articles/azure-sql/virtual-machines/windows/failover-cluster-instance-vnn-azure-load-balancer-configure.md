---
title: Configure Azure Load Balancer a failover cluster instance VNN
description: Learn to configure an Azure Load Balancer to route traffic to the virtual network name (VNN) for your failover cluster instance (FCI) with SQL Server on Azure VMs for high availability and disaster recovery (HADR). 
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
ms.date: 06/02/2020
ms.author: mathoma
ms.reviewer: jroth

---
# Configure Azure Load Balancer for an FCI VNN
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

On Azure Virtual Machines, clusters use a load balancer to hold an IP address that needs to be on one cluster node at a time. In this solution, the load balancer holds the IP address for the virtual network name (VNN) used by the clustered resource in Azure. 

This article teaches you to configure a load balancer by using the Azure Load Balancer service. The load balancer will route traffic to your [failover cluster instance (FCI)](failover-cluster-instance-overview.md) with SQL Server on Azure VMs for high availability and disaster recovery (HADR). 

For an alternative connectivity option for SQL Server 2019 CU2 and later, consider a [distributed network name](failover-cluster-instance-distributed-network-name-dnn-configure.md) instead for simplified configuration and improved failover. 


## Prerequisites

Before you complete the steps in this article, you should already have:

- Determined that Azure Load Balancer is the appropriate [connectivity option for your FCI](hadr-windows-server-failover-cluster-overview.md#virtual-network-name-vnn).
- Configured your [failover cluster instances](failover-cluster-instance-overview.md). 
- Installed the latest version of [PowerShell](/powershell/scripting/install/installing-powershell-core-on-windows). 

## Create load balancer

You can create either an internal load balancer or an external load balancer. An internal load balancer can only be from accessed private resources that are internal to the network.  An external load balancer can route traffic from the public to internal resources. When you configure an internal load balancer, use the same IP address as the FCI resource for the frontend IP when configuring the load-balancing rules. When you configure an external load balancer, you cannot use the same IP address as the FCI IP address cannot be a public IP address. As such, to use an external load balancer, logically allocate an IP address in the same subnet as the FCI that does not conflict with any other IP address, and use this address as the frontend IP address for the load-balancing rules. 


Use the [Azure portal](https://portal.azure.com) to create the load balancer:

1. In the Azure portal, go to the resource group that contains the virtual machines.

1. Select **Add**. Search Azure Marketplace for **Load Balancer**. Select **Load Balancer**.

1. Select **Create**.

1. Set up the load balancer by using the following values:

   - **Subscription**: Your Azure subscription.
   - **Resource group**: The resource group that contains your virtual machines.
   - **Name**: A name that identifies the load balancer.
   - **Region**: The Azure location that contains your virtual machines.
   - **Type**: Either public or private. A private load balancer can be accessed from within the virtual network. Most Azure applications can use a private load balancer. If your application needs access to SQL Server directly over the internet, use a public load balancer.
   - **SKU**: Standard.
   - **Virtual network**: The same network as the virtual machines.
   - **IP address assignment**: Static. 
   - **Private IP address**: The IP address that you assigned to the clustered network resource.

   The following image shows the **Create load balancer** UI:

   ![Set up the load balancer](./media/failover-cluster-instance-premium-file-share-manually-configure/30-load-balancer-create.png)
   

## Configure backend pool

1. Return to the Azure resource group that contains the virtual machines and locate the new load balancer. You might need to refresh the view on the resource group. Select the load balancer.

1. Select **Backend pools**, and then select **Add**.

1. Associate the backend pool with the availability set that contains the VMs.

1. Under **Target network IP configurations**, select **VIRTUAL MACHINE** and choose the virtual machines that will participate as cluster nodes. Be sure to include all virtual machines that will host the FCI. Only add the primary IP address of each VM, do not add any secondary IP addresses. 

1. Select **OK** to create the backend pool.

## Configure health probe

1. On the load balancer pane, select **Health probes**.

1. Select **Add**.

1. On the **Add health probe** pane, <span id="probe"> </span> set the following health probe parameters:

   - **Name**: A name for the health probe.
   - **Protocol**: TCP.
   - **Port**: The port you created in the firewall for the health probe [when preparing the VM](failover-cluster-instance-prepare-vm.md#uninstall-sql-server-1). In this article, the example uses TCP port `59999`.
   - **Interval**: 5 Seconds.
   - **Unhealthy threshold**: 2 consecutive failures.

1. Select **OK**.

## Set load-balancing rules

Set the load-balancing rules for the load balancer. 


# [Private load balancer](#tab/ilb)

Set the load-balancing rules for the private load balancer by following these steps: 

1. On the load balancer pane, select **Load-balancing rules**.
1. Select **Add**.
1. Set the load-balancing rule parameters:

   - **Name**: A name for the load-balancing rules.
   - **Frontend IP address**: The IP address for the clustered network resource of the SQL Server FCI.
   - **Port**: The SQL Server TCP port. The default instance port is 1433.
   - **Backend port**: The same port as the **Port** value when you enable **Floating IP (direct server return)**.
   - **Backend pool**: The backend pool name that you configured earlier.
   - **Health probe**: The health probe that you configured earlier.
   - **Session persistence**: None.
   - **Idle timeout (minutes)**: 4.
   - **Floating IP (direct server return)**: Enabled.

1. Select **OK**.

# [Public load balancer](#tab/elb)

Set the load-balancing rules for the public load balancer by following these steps: 

1. On the load balancer pane, select **Load-balancing rules**.
1. Select **Add**.
1. Set the load-balancing rule parameters:

   - **Name**: A name for the load-balancing rules.
   - **Frontend IP address**: The public IP address that clients use to connect to the public endpoint. 
   - **Port**: The SQL Server TCP port. The default instance port is 1433.
   - **Backend port**: The port used by the FCI instance. The default is 1433. 
   - **Backend pool**: The backend pool name that you configured earlier.
   - **Health probe**: The health probe that you configured earlier.
   - **Session persistence**: None.
   - **Idle timeout (minutes)**: 4.
   - **Floating IP (direct server return)**: Disabled.

1. Select **OK**.

---



## Configure cluster probe

Set the cluster probe port parameter in PowerShell.

# [Private load balancer](#tab/ilb)

To set the cluster probe port parameter, update the variables in the following script with values from your environment. Remove the angle brackets (`<` and `>`) from the script.

```powershell
$ClusterNetworkName = "<Cluster Network Name>"
$IPResourceName = "<SQL Server FCI IP Address Resource Name>" 
$ILBIP = "<n.n.n.n>" 
[int]$ProbePort = <nnnnn>

Import-Module FailoverClusters

Get-ClusterResource $IPResourceName | Set-ClusterParameter -Multiple @{"Address"="$ILBIP";"ProbePort"=$ProbePort;"SubnetMask"="255.255.255.255";"Network"="$ClusterNetworkName";"EnableDhcp"=0}
```

The following table describes the values that you need to update:


|**Value**|**Description**|
|---------|---------|
|`Cluster Network Name`| The Windows Server Failover Cluster name for the network. In **Failover Cluster Manager** > **Networks**, right-click the network and select **Properties**. The correct value is under **Name** on the **General** tab.|
|`SQL Server FCI IP Address Resource Name`|The resource name for the SQL Server FCI IP address. In **Failover Cluster Manager** > **Roles**, under the SQL Server FCI role, under **Server Name**, right-click the IP address resource and select **Properties**. The correct value is under **Name** on the **General** tab.|
|`ILBIP`|The IP address of the internal load balancer (ILB). This address is configured in the Azure portal as the ILB's frontend address. This is also the SQL Server FCI's IP address. You can find it in **Failover Cluster Manager** on the same properties page where you located the `<SQL Server FCI/AG listener IP Address Resource Name>`.|
|`nnnnn`|The probe port that you configured in the load balancer's health probe. Any unused TCP port is valid.|
|"SubnetMask"| The subnet mask for the cluster parameter. It must be the TCP IP broadcast address: `255.255.255.255`.| 


After you set the cluster probe, you can see all the cluster parameters in PowerShell. Run this script:

```powershell
Get-ClusterResource $IPResourceName | Get-ClusterParameter
```

# [Public load balancer](#tab/elb)

To set the cluster probe port parameter, update the variables in the following script with values from your environment. Remove the angle brackets (`<` and `>`) from the script.

```powershell
$ClusterNetworkName = "<Cluster Network Name>"
$IPResourceName = "<SQL Server FCI IP Address Resource Name>" 
$ELBIP = "<n.n.n.n>" 
[int]$ProbePort = <nnnnn>

Import-Module FailoverClusters

Get-ClusterResource $IPResourceName | Set-ClusterParameter -Multiple @{"Address"="$ELBIP";"ProbePort"=$ProbePort;"SubnetMask"="255.255.255.255";"Network"="$ClusterNetworkName";"EnableDhcp"=0}
```

The following table describes the values that you need to update:


|**Value**|**Description**|
|---------|---------|
|`Cluster Network Name`| The Windows Server Failover Cluster name for the network. In **Failover Cluster Manager** > **Networks**, right-click the network and select **Properties**. The correct value is under **Name** on the **General** tab.|
|`SQL Server FCI IP Address Resource Name`|The resource name for the IP address of the SQL Server FCI. In **Failover Cluster Manager** > **Roles**, under the SQL Server FCI role, under **Server Name**, right-click the IP address resource and select **Properties**. The correct value is under **Name** on the **General** tab.|
|`ELBIP`|The IP address of the external load balancer (ELB). This address is configured in the Azure portal as the frontend address of the ELB and is used to connect to the public load balancer from external resources. |
|`nnnnn`|The probe port that you configured in the health probe of the load balancer. Any unused TCP port is valid.|
|"SubnetMask"| The subnet mask for the cluster parameter. It must be the TCP IP broadcast address: `255.255.255.255`.| 

After you set the cluster probe, you can see all the cluster parameters in PowerShell. Run this script:

```powershell
Get-ClusterResource $IPResourceName | Get-ClusterParameter
```

> [!NOTE]
> Since there is no private IP address for the external load balancer, users cannot directly use the VNN DNS name as it resolves the IP address within the subnet. Use either the public IP address of the public LB or configure another DNS mapping on the DNS server. 

---

## Modify connection string 

For clients that support it, add the `MultiSubnetFailover=True` to the connection string.  While the MultiSubnetFailover connection option is not required, it does provide the benefit of a faster subnet failover. This is because the client driver will attempt to open up a TCP socket for each IP address in parallel. The client driver will wait for the first IP to respond with success and once it does, will then use it for the connection.

If your client does not support the MultiSubnetFailover parameter, you can modify the RegisterAllProvidersIP and HostRecordTTL settings to prevent connectivity delays upon failover. 

Use PowerShell to modify the RegisterAllProvidersIp and HostRecordTTL settings: 

```powershell
Get-ClusterResource yourFCIname | Set-ClusterParameter RegisterAllProvidersIP 0  
Get-ClusterResource yourFCIname | Set-ClusterParameter HostRecordTTL 300 
```

To learn more, see the SQL Server [listener connection timeout](/troubleshoot/sql/availability-groups/listener-connection-times-out) documentation. 

> [!TIP]
> - Set the MultiSubnetFailover parameter = true in the connection string even for HADR solutions that span a single subnet to support future spanning of subnets without the need to update connection strings.  
> - By default, clients cache cluster DNS records for 20 minutes. By reducing HostRecordTTL you reduce the Time to Live (TTL) for the cached record, legacy clients may reconnect more quickly. As such, reducing the HostRecordTTL setting may result in increased traffic to the DNS servers.


## Test failover


Test failover of the clustered resource to validate cluster functionality. 

Take the following steps:

1. Connect to one of the SQL Server cluster nodes by using RDP.
1. Open **Failover Cluster Manager**. Select **Roles**. Notice which node owns the SQL Server FCI role.
1. Right-click the SQL Server FCI role. 
1. Select **Move**, and then select **Best Possible Node**.

**Failover Cluster Manager** shows the role, and its resources go offline. The resources then move and come back online in the other node.


## Test connectivity

To test connectivity, sign in to another virtual machine in the same virtual network. Open **SQL Server Management Studio** and connect to the SQL Server FCI name. 

> [!NOTE]
> If you need to, you can [download SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms).





## Next steps

To learn more, see:

- [Windows Server Failover Cluster with SQL Server on Azure VMs](hadr-windows-server-failover-cluster-overview.md)
- [Failover cluster instances with SQL Server on Azure VMs](failover-cluster-instance-overview.md)
- [Failover cluster instance overview](/sql/sql-server/failover-clusters/windows/always-on-failover-cluster-instances-sql-server)
- [HADR settings for SQL Server on Azure VMs](hadr-cluster-best-practices.md)




