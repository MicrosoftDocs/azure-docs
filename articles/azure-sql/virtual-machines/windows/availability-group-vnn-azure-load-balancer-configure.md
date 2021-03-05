---
title: Configure load balancer for AG VNN listener
description: Learn to configure an Azure Load Balancer to route traffic to the virtual network name (VNN) listener for your availability group with SQL Server on Azure VMs for high availability and disaster recovery (HADR). 
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
# Configure load balancer for AG VNN listener
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

On Azure Virtual Machines, clusters use a load balancer to hold an IP address that needs to be on one cluster node at a time. In this solution, the load balancer holds the IP address for the virtual network name (VNN) listener for the Always On availability group (AG). 

This article teaches you to configure a load balancer by using the Azure Load Balancer service. The load balancer will route traffic to your [availability group (AG) listener](availability-group-overview.md) with SQL Server on Azure VMs for high availability and disaster recovery (HADR). 

For an alternative connectivity option for customers that are on SQL Server 2019 CU8 and later, consider a [DNN listener](availability-group-vnn-azure-load-balancer-configure.md) instead for simplified configuration and improved failover.  



## Prerequisites

Before you complete the steps in this article, you should already have:

- Decided that Azure Load Balancer is the appropriate [connectivity option for your HADR solution](hadr-cluster-best-practices.md#connectivity).
- Configured your [availability group listener](availability-group-overview.md).
- Installed the latest version of [PowerShell](/powershell/azure/install-az-ps). 


## Create load balancer

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

1. Under **Target network IP configurations**, select **VIRTUAL MACHINE** and choose the virtual machines that will participate as cluster nodes. Be sure to include all virtual machines that will host the FCI or availability group.

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

1. On the load balancer pane, select **Load-balancing rules**.

1. Select **Add**.

1. Set the load-balancing rule parameters:

   - **Name**: A name for the load-balancing rules.
   - **Frontend IP address**: The IP address for the SQL Server FCIs or the AG listener's clustered network resource.
   - **Port**: The SQL Server TCP port. The default instance port is 1433.
   - **Backend port**: The same port as the **Port** value when you enable **Floating IP (direct server return)**.
   - **Backend pool**: The backend pool name that you configured earlier.
   - **Health probe**: The health probe that you configured earlier.
   - **Session persistence**: None.
   - **Idle timeout (minutes)**: 4.
   - **Floating IP (direct server return)**: Enabled.

1. Select **OK**.

## Configure cluster probe

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
|`AG listener IP Address Resource Name`|The resource name for the SQL Server FCI's or AG listener's IP address. In **Failover Cluster Manager** > **Roles**, under the SQL Server FCI role, under **Server Name**, right-click the IP address resource and select **Properties**. The correct value is under **Name** on the **General** tab.|
|`ILBIP`|The IP address of the internal load balancer (ILB). This address is configured in the Azure portal as the ILB's frontend address. This is also the SQL Server FCI's IP address. You can find it in **Failover Cluster Manager** on the same properties page where you located the `<AG listener IP Address Resource Name>`.|
|`nnnnn`|The probe port that you configured in the load balancer's health probe. Any unused TCP port is valid.|
|"SubnetMask"| The subnet mask for the cluster parameter. It must be the TCP IP broadcast address: `255.255.255.255`.| 


After you set the cluster probe, you can see all the cluster parameters in PowerShell. Run this script:

```powershell
Get-ClusterResource $IPResourceName | Get-ClusterParameter
```


## Test failover


Test failover of the clustered resource to validate cluster functionality. 


Take the following steps:

1. Open [SQL Server Management Studio)](/sql/ssms/download-sql-server-management-studio-ssms) and connect to your availability group listener. 
1. Expand **Always On Availability Group** in **Object Explorer**. 
1. Right-click the availability group and select **Failover**. 
1. Follow the wizard prompts to fail over the availability group to a secondary replica. 

Failover succeeds when the replicas switch roles and are both synchronized. 


## Test connectivity

To test connectivity, sign in to another virtual machine in the same virtual network. Open **SQL Server Management Studio** and connect to the availability group listener.

>[!NOTE]
>If you need to, you can [download SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms).

## Next steps

Once the VNN is created, consider optimizing the [cluster settings for availability groups](availability-group-recommended-cluster-settings.md). 

To learn more about SQL Server HADR features in Azure, see [Availability groups](availability-group-overview.md) and [Failover cluster instance](failover-cluster-instance-overview.md). You can also learn [best practices](hadr-cluster-best-practices.md) for configuring your environment for high availability and disaster recovery. 



