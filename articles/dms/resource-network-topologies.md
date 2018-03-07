---
title: Network topologies for Azure SQL DB Managed Instance migrations using the Azure Database Migration Service | Microsoft Docs
description: Learn the source and target configurations for Database Migration Service.
services: database-migration
author: HJToland3
ms.author: jtoland
manager: 
ms.reviewer: 
ms.service: database-migration
ms.workload: data-services
ms.custom: mvc
ms.topic: article
ms.date: 03/06/2018
---

# Network topologies for Azure SQL DB Managed Instance migrations using the Azure Database Migration Service
In this article, you will learn about various network topologies that Azure Database Migration Service can work with to provide seamless migration experience to Azure SQL Database Managed Instance from on-premises SQL Servers.

## Azure SQL Database Managed Instance configured for Hybrid workloads 
Use this topology if your Azure SQL Database Managed Instance is connected to your on-premises network. This approach provides the most simplified network routing and yields maximum data throughput during the migration.

![Network Topology for Hybrid Workloads](media\resource-network-topologies\hybrid-workloads.png)

**Requirements**
- In this scenario, the Azure SQL Database Managed Instance and the Azure Database Migration Service instance are created in the same Azure VNET, but they use different subnets.  
- The VNET used in this scenario is also connected to the on-premises network by using either ExpressRoute or VPN.

## Azure SQL Database Managed Instance isolated from the on-premises network
Use this network topology if your environment requires one or more of the following scenarios:
- The Azure SQL Database Managed Instance is isolated from on-premises connectivity, but your Azure Database Migration Service instance is connected to the on-premises network.
- Role Based Access Control (RBAC) policies are in place and you limit user access to the same subscription that is hosting the Azure SQL Database Managed Instance.
- The VNETs used for Azure SQL Database Managed Instance and Azure Database Migration Service are in different subscriptions.

![Network Topology for Managed Instance isolated from the on-premises network](media\resource-network-topologies\mi-isolated-workload.png)

**Requirements**
- The VNET that Azure Database Migration Service uses for this scenario must also be connected to the on-premises network by using either ExpressRoute or VPN.
- Create a VNET network peering between the VNET used for Azure SQL Database Managed Instance and Azure Database Migration Service.


## Cloud to cloud migrations
Use this topology if the source SQL Server is hosted in an Azure virtual machine.

![Network Topology for Cloud-to-Cloud migrations](media\resource-network-topologies\cloud-to-cloud.png)

**Requirements**
- Create a VNET network peering between the VNET used for Azure SQL Database Managed Instance and Azure Database Migration Service.

## See Also
- [Migrate SQL Server to Azure SQL Database Managed Instance](https://docs.microsoft.com/azure/dms/tutorial-sql-server-to-managed-instance)
- [Overview of prerequisites for using the Azure Database Migration Service](https://docs.microsoft.com/azure/dms/pre-reqs)
- [Create a virtual network using the Azure portal](https://docs.microsoft.com/azure/virtual-network/quick-create-portal)

## Next steps
For an overview of the Azure Database Migration Service and regional availability during Public Preview, see the article [What is the Azure Database Migration Service Preview](dms-overview.md). 