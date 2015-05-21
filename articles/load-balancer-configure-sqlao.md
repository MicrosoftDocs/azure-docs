<properties 
   pageTitle="Configure Load balancer for SQL always on | Microsoft Azure"
   description="Configure Load balancer to work with SQL always on and how to leverage powershell to create load balancer for the SQL implementation"
   services="load-balancer"
   documentationCenter="na"
   authors="joaoma"
   manager="adinah"
   editor="tysonn" />
<tags 
   ms.service="load-balancer"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="05/01/2015"
   ms.author="joaoma" />

# SQL Always on

SQL Server AlwaysOn Availability Groups can now be run with ILB. Availability Group is SQL Server’s flagship solution for high availability and disaster recovery. The Availability Group Listener allows client applications to seamlessly connect to the primary replica, irrespective of the number of the replicas in the configuration.

The listener (DNS) name is mapped to a load-balanced IP address and Azure’s load balancer directs the incoming traffic to only the primary server in the replica set. 


You can use ILB support for SQL Server AlwaysOn (listener) endpoints. You now have control over the accessibility of the listener and can choose the load-balanced IP address from a specific subnet in your Virtual Network (VNet). 

By using ILB on the listener, the SQL server endpoint (e.g. Server=tcp:ListenerName,1433;Database=DatabaseName) is accessible only by:

Services and VMs in the same Virtual network
Services and VMs from connected on-premises network
Services and VMs from inter connected VNets

![ILB_SQLAO_NewPic](./media/load-balancer-sqlao/sqlao1.jpg) 


Internal Load balancer can only be configured through PowerShell.


## Add Internal Load Balancer to the service 

### Step 1.

In the following example, we will configure a Virtual network that contains a subnet  called ‘Subnet-1’:

	Add-AzureInternalLoadBalancer -InternalLoadBalancerName ILB_SQL_AO -SubnetName Subnet-1 -ServiceName SqlSvc

Step 2.

## Add load balanced endpoints for ILB on each VM

	Get-AzureVM -ServiceName SqlSvc -Name sqlsvc1 | Add-AzureEndpoint -Name "LisEUep" -LBSetName "ILBSet1" -Protocol tcp -LocalPort 1433 -PublicPort 1433 -ProbePort 59999 -ProbeProtocol tcp -ProbeIntervalInSeconds 10 –
	DirectServerReturn $true -InternalLoadBalancerName ILB_SQL_AO | Update-AzureVM 
	Get-AzureVM -ServiceName SqlSvc -Name sqlsvc2 | Add-AzureEndpoint -Name "LisEUep" -LBSetName "ILBSet1" -Protocol tcp -LocalPort 1433 -PublicPort 1433 -ProbePort 59999 -ProbeProtocol tcp -ProbeIntervalInSeconds 10 –DirectServerReturn $true -InternalLoadBalancerName ILB_SQL_AO | Update-AzureVM


## See Also

[Get started configuring an Internet facing load balancer](load-balancer-internet-getstarted.md)

[Get started configuring an Internal load balancer](load-balancer-internal-getstarted.md)

[Configure a Load balancer distribution mode](load-balancer-distribution-mode.md)

[Configure idle TCP timeout settings for your load balancer](load-balancer-tcp-idle-timeout.md)
