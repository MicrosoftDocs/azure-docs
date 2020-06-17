---
title: Configure Azure Load Balancer for HADR
description: Learn to configure an Azure load balancer to route traffic to your availability group or failover cluster instance (FCI) with SQL Server on Azure VMs for high availability and disaster recovery (HADR). 
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
# Configure Azure Load Balancer (SQL Server on Azure VMs)
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

On Azure Virtual Machines, clusters use a load balancer to hold an IP address that needs to be on one cluster node at a time. In this solution, the load balancer holds the IP address for the clustered resource in Azure. 

This article teaches you to configure an Azure load balancer to route traffic to your [availability group listener](availability-group-overview.md) or [failover cluster instances (FCI)](failover-cluster-instance-overview.md) with SQL Server on Azure VMs for high availability and disaster recovery (HADR). 



## Prerequisites

Before you complete the steps in this article, you should already have:

- Decided the Azure Load Balance is the appropriate [connectivity option for your HADR solution](hadr-cluster-best-practices.md#connectivity).
- Configured your [availability group listener](availability-group-overview.md) or [failover cluster instances (FCI)](failover-cluster-instance-overview.md). 
- The latest version of [PowerShell](/powershell/azure/install-az-ps?view=azps-4.2.0). 


## Create the load balancer

Use the [Azure portal](https://portal.azure.com) to create the load balancer:

1. In the Azure portal, go to the resource group that contains the virtual machines.

1. Select **Add**. Search the Azure Marketplace for **Load Balancer**. Select **Load Balancer**.

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
   

## Configure the backend pool

1. Return to the Azure resource group that contains the virtual machines and locate the new load balancer. You might need to refresh the view on the resource group. Select the load balancer.

1. Select **Backend pools**, and then select **Add**.

1. Associate the backend pool with the availability set that contains the VMs.

1. Under **Target network IP configurations**, select **VIRTUAL MACHINE** and choose the virtual machines that will participate as cluster nodes. Be sure to include all virtual machines that will host the FCI or availability group.

1. Select **OK** to create the backend pool.

### Configure a load balancer health probe

1. On the load balancer blade, select **Health probes**.

1. Select **Add**.

1. On the **Add health probe** blade, <span id="probe"> </span> set the following health probe parameters.

   - **Name**: A name for the health probe.
   - **Protocol**: TCP.
   - **Port**: The port you created in the firewall for the health probe in [this step](#ports). In this article, the example uses TCP port `59999`.
   - **Interval**: 5 Seconds.
   - **Unhealthy threshold**: 2 consecutive failures.

1. Select **OK**.

## Set load-balancing rules

1. On the load balancer blade, select **Load balancing rules**.

1. Select **Add**.

1. Set the load-balancing rule parameters:

   - **Name**: A name for the load-balancing rules.
   - **Frontend IP address**: The IP address for the SQL Server FCI or AG listener clustered network resource.
   - **Port**: The SQL Server TCP port. The default instance port is 1433.
   - **Backend port**: Uses the same port as the **Port** value when you enable **Floating IP (direct server return)**.
   - **Backend pool**: The backend pool name that you configured earlier.
   - **Health probe**: The health probe that you configured earlier.
   - **Session persistence**: None.
   - **Idle timeout (minutes)**: 4.
   - **Floating IP (direct server return)**: Enabled.

1. Select **OK**.

## Configure the probe

Set the cluster probe port parameter in PowerShell.

To set the cluster probe port parameter, update the variables in the following script with values from your environment. Remove the angle brackets (`<` and `>`) from the script.

```powershell
$ClusterNetworkName = "<Cluster Network Name>"
$IPResourceName = "<SQL Server FCI / AG Listener IP Address Resource Name>" 
$ILBIP = "<n.n.n.n>" 
[int]$ProbePort = <nnnnn>

Import-Module FailoverClusters

Get-ClusterResource $IPResourceName | Set-ClusterParameter -Multiple @{"Address"="$ILBIP";"ProbePort"=$ProbePort;"SubnetMask"="255.255.255.255";"Network"="$ClusterNetworkName";"EnableDhcp"=0}
```

The following table describes the values that you need to update:


|**Value**|**Description**|
|---------|---------|
|`Cluster Network Name`| The Windows Server Failover Cluster name for the network. In **Failover Cluster Manager** > **Networks**, right-click the network and select **Properties**. The correct value is under **Name** on the **General** tab.|
|`SQL Server FCI/AG listener IP Address Resource Name`|The SQL Server FCI/AG listener IP Address Resource Name. In **Failover Cluster Manager** > **Roles**, under the SQL Server FCI role, under **Server Name**, right-click the IP address resource and select **Properties**. The correct value is under **Name** on the **General** tab.|
|`ILBIP`|The ILB IP address. This address is configured in the Azure portal as the ILB front-end address. This is also the SQL Server FCI IP address. You can find it in **Failover Cluster Manager** on the same properties page where you located the `<SQL Server FCI/AG listener IP Address Resource Name>`.|
|`nnnnn`|The probe port you configured in the load balancer health probe. Any unused TCP port is valid.|
|"SubnetMask"| The subnet mask for the cluster parameter must be the TCP IP broadcast address: `255.255.255.255`.| 


This is text to present the same information as the table, not sure which is better, leaving both for now: 

The following list describes the values that you need to update:

   - `<Cluster Network Name>`: The Windows Server Failover Cluster name for the network. In **Failover Cluster Manager** > **Networks**, right-click the network and select **Properties**. The correct value is under **Name** on the **General** tab.

   - `<SQL Server FCI/AG listener IP Address Resource Name>`: The SQL Server IP address resource name. In **Failover Cluster Manager** > **Roles**, under the SQL Server FCI role, under **Server Name**, right-click the IP address resource and select **Properties**. The correct value is under **Name** on the **General** tab.

   - `<ILBIP>`: The ILB IP address. This address is configured in the Azure portal as the ILB front-end address. This is also the SQL Server FCI IP address. You can find it in **Failover Cluster Manager** on the same properties page where you located the `<SQL Server FCI/AG listener IP Address Resource Name>`.  

   - `<nnnnn>`: The probe port you configured in the load balancer health probe. Any unused TCP port is valid.

Same text, different format, comparing styles: 

`<Cluster Network Name>`   
The Windows Server Failover Cluster name for the network. In **Failover Cluster Manager** > **Networks**, right-click the network and select **Properties**. The correct value is under **Name** on the **General** tab.

`<SQL Server FCI/AG listener IP Address Resource Name>`   
The SQL Server IP address resource name. In **Failover Cluster Manager** > **Roles**, under the SQL Server FCI role, under **Server Name**, right-click the IP address resource and select **Properties**. The correct value is under **Name** on the **General** tab.

`<ILBIP>`   
 The ILB IP address. This address is configured in the Azure portal as the ILB front-end address. This is also the SQL Server FCI IP address. You can find it in **Failover Cluster Manager** on the same properties page where you located the `<SQL Server FCI/AG listener IP Address Resource Name>`.  

`<nnnnn>`   
 The probe port you configured in the load balancer health probe. Any unused TCP port is valid.


>[!IMPORTANT]
>The subnet mask for the cluster parameter must be the TCP IP broadcast address: `255.255.255.255`.


After you set the cluster probe, you can see all the cluster parameters in PowerShell. Run this script:

```powershell
Get-ClusterResource $IPResourceName | Get-ClusterParameter
```


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

To test connectivity, sign in to another virtual machine in the same virtual network. Open **SQL Server Management Studio** and connect to the SQL Server FCI name or to the availability group listener.

>[!NOTE]
>If you need to, you can [download SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms).



## Next steps

To learn more about SQL Server HADR features in Azure, see [availability groups](availability-group-overview.md) and [failover cluster instance](failover-cluster-instance-overview.md) as well as [best practices](hadr-cluster-best-practices.md) for configuring your environment for high availability and disaster recovery. 



