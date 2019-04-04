---
title: SQL Server Availability Groups - Azure Virtual Machines - Overview | Microsoft Docs 
description: "This article introduces SQL Server Availability Groups on Azure virtual machines."
services: virtual-machines
documentationCenter: na
author: MikeRayMSFT
manager: craigg
editor: monicar
tags: azure-service-management

ms.assetid: 601eebb1-fc2c-4f5b-9c05-0e6ffd0e5334
ms.service: virtual-machines-sql
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: "01/13/2017"
ms.author: mikeray

---

# Introducing SQL Server Always On availability groups on Azure virtual machines #

This article introduces SQL Server availability groups on Azure Virtual Machines. 

Always On availability groups on Azure Virtual Machines are similar to Always On availability groups on premises. For more information, see [Always On Availability Groups (SQL Server)](https://msdn.microsoft.com/library/hh510230.aspx). 

The diagram illustrates the parts of a complete SQL Server Availability Group in Azure Virtual Machines.

![Availability Group](./media/virtual-machines-windows-portal-sql-availability-group-tutorial/00-EndstateSampleNoELB.png)

The key difference for an Availability Group in Azure Virtual Machines is that the Azure virtual machines, require a [load balancer](../../../load-balancer/load-balancer-overview.md). The load balancer holds the IP addresses for the availability group listener. If you have more than one availability group each group requires a listener. One load balancer can support multiple listeners.

Additionally, on an Azure IaaS VM guest failover cluster, we recommend a single NIC per server (cluster node) and a single subnet. Azure networking has physical redundancy which makes additional NICs and subnets unnecessary on an Azure IaaS VM guest cluster. Although the cluster validation report will issue a warning that the nodes are only reachable on a single network, this warning can be safely ignored on Azure IaaS VM guest failover clusters. 

|  | Windows Server Version | SQL Server Version | SQL Server Edition | WSFC Quorum Config | DR with Multi-region | Multi-subnet support | Support for an existing AD | DR with multi-zone same region | Dist-AG support with no AD domain | Dist-AG support with no cluster |  
| :------ | :-----| :-----| :-----| :-----| :-----| :-----| :-----| :-----| :-----| :-----|
| [SQL VM CLI](virtual-machines-windows-sql-availability-group-cli.md) | 2016 | 2017 </br>2016   | Ent | Cloud witness | No | Yes | Yes | Yes | No | No |
| [Quickstart Templates](virtual-machines-windows-sql-availability-group-quickstart-template.md) | 2016 | 2017</br>2016  | Ent | Cloud witness | No | Yes | Yes | Yes | No | No |
| [Portal Template](virtual-machines-windows-portal-sql-alwayson-availability-groups.md) | 2016 </br>2012 R2 | 2016</br>2014 | Ent | File share | No | No | No | No | No | No |
| [Manual](virtual-machines-windows-portal-sql-availability-group-prereq.md) | All | All | All | All | Yes | Yes | Yes | Yes | Yes | Yes |
| &nbsp; | &nbsp; |&nbsp; |&nbsp; |&nbsp; |&nbsp; |&nbsp; |&nbsp; |&nbsp; |&nbsp; |&nbsp; |

When you are ready to build a SQL Server availability group on Azure Virtual Machines, refer to these tutorials.

## Manually with Azure CLI
Using Azure CLI to configure and deploy an availability group is the recommended option, as it's the best in terms of simplicity and speed of deployment. With Azure CLI, the creation of the Windows Failover Cluster, joining SQL Server VMs to the cluster, as well as the creation of the listener and Internal Load Balancer can all be achieved in under 30 minutes. This option still requires a manual creation of the availability group, but automates all the other necessary configuration steps. 

For more information, see [Use Azure SQL VM CLI to configure Always On availability group for SQL Server on an Azure VM](virtual-machines-windows-sql-availability-group-cli.md). 

## Automatically with Azure Quickstart Templates
The Azure Quickstart Templates utilize the SQL VM resource provider to deploy the Windows Failover Cluster, join SQL Server VMs to it, create the listener, and configure the Internal Load Balancer. This option still requires a manual creation of the availability group, and Internal Load Balancer (ILB) but automates and simplifies all the other necessary configuration steps (including the configuration of the ILB). 

For more information, see [Use Azure Quickstart Template to configure Always On availability group for SQL Server on an Azure VM](virtual-machines-windows-sql-availability-group-quickstart-template.md).


## Automatically with an Azure Portal Template

[Configure Always On availability group in Azure VM automatically - Resource Manager](virtual-machines-windows-portal-sql-alwayson-availability-groups.md)


## Manually in Azure portal

You can also create the virtual machines yourself without the template. First, complete the prerequisites, then create the availability group. See the following topics: 

- [Configure prerequisites for SQL Server Always On availability groups on Azure Virtual Machines](virtual-machines-windows-portal-sql-availability-group-prereq.md)

- [Create Always On Availability Group to improve availability and disaster recovery](virtual-machines-windows-portal-sql-availability-group-tutorial.md)

## Next steps

[Configure a SQL Server Always On Availability Group on Azure Virtual Machines in Different Regions](virtual-machines-windows-portal-sql-availability-group-dr.md)
