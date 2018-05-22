---
title: Configure Load Balancer for SQL Server Always On | Microsoft Docs
description: Configure Load Balancer to work with SQL Server Always On, and learn how to use PowerShell to create a load balancer for the SQL Server implementation
services: load-balancer
documentationcenter: na
author: KumudD
manager: timlt

ms.assetid: d7bc3790-47d3-4e95-887c-c533011e4afd
ms.service: load-balancer
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/25/2017
ms.author: kumud
---

# Configure a load balancer for SQL Server Always On



SQL Server Always On availability groups now can run with an internal load balancer. An availability group is SQL Server's flagship solution for high availability and disaster recovery. The availability group listener allows client applications to seamlessly connect to the primary replica, irrespective of the number of replicas in the configuration.

The listener (DNS) name is mapped to a load-balanced IP address. Azure Load Balancer directs the incoming traffic to only the primary server in the replica set.

You can use internal load balancer support for SQL Server Always On (listener) endpoints. You now have control over the accessibility of the listener. You can choose the load-balanced IP address from a specific subnet in your virtual network.

By using an internal load balancer on the listener, the SQL Server endpoint (for example, Server=tcp:ListenerName,1433;Database=DatabaseName) is accessible only by:

* Services and VMs in the same virtual network.
* Services and VMs from connected on-premises networks.
* Services and VMs from interconnected virtual networks.

![Internal load balancer SQL Server Always On](./media/load-balancer-configure-sqlao/sqlao1.png)

## Add an internal load balancer to the service

1. In the following example, you configure a virtual network that contains a subnet called 'Subnet-1':

    ```powershell
    Add-AzureInternalLoadBalancer -InternalLoadBalancerName ILB_SQL_AO -SubnetName Subnet-1 -ServiceName SqlSvc
    ```
2. Add load-balanced endpoints for an internal load balancer on each VM.

    ```powershell
    Get-AzureVM -ServiceName SqlSvc -Name sqlsvc1 | Add-AzureEndpoint -Name "LisEUep" -LBSetName "ILBSet1" -Protocol tcp -LocalPort 1433 -PublicPort 1433 -ProbePort 59999 -ProbeProtocol tcp -ProbeIntervalInSeconds 10 -
    DirectServerReturn $true -InternalLoadBalancerName ILB_SQL_AO | Update-AzureVM

    Get-AzureVM -ServiceName SqlSvc -Name sqlsvc2 | Add-AzureEndpoint -Name "LisEUep" -LBSetName "ILBSet1" -Protocol tcp -LocalPort 1433 -PublicPort 1433 -ProbePort 59999 -ProbeProtocol tcp -ProbeIntervalInSeconds 10 -DirectServerReturn $true -InternalLoadBalancerName ILB_SQL_AO | Update-AzureVM
    ```

    In the previous example, you have two VMs called "sqlsvc1" and "sqlsvc2" that run in the cloud service "Sqlsvc". After you create the internal load balancer with the `DirectServerReturn` switch, you add load-balanced endpoints to the internal load balancer. The load-balanced endpoints allow SQL Server to configure the listeners for the availability groups.

For more information about SQL Server Always On, see [Configure an internal load balancer for an Always On availability group in Azure](../virtual-machines/windows/sql/virtual-machines-windows-portal-sql-alwayson-int-listener.md).

## See also
* [Get started configuring a public load balancer](load-balancer-get-started-internet-arm-ps.md)
* [Get started configuring an internal load balancer](load-balancer-get-started-ilb-arm-ps.md)
* [Configure a load balancer distribution mode](load-balancer-distribution-mode.md)
* [Configure idle TCP timeout settings for your load balancer](load-balancer-tcp-idle-timeout.md)
