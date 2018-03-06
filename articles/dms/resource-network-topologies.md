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
In this article you will learn the various source and Azure target configurations, along with the recommended network topologies, that you can use to configure the Database Migration Service network to best accommodate your environment.

## Azure SQL Database Managed Instance configured for Hybrid workloads 
Use this topology if your Azure SQL Database Managed Instance is connected to your on-premises network. This approach provides the most simplified network routing and yields maximum data throughput during the migration.

![Network Topology for Hybrid Workloads](media\resource-network-topologies\hybrid-workloads.png)

**Requirements**
- In this scenario, the Azure SQL Database Managed Instance and the Azure Database Migration Service instance are created in the same Azure VNET, but they use different subnets.  
- The VNET used in this scenario is also connected to the on-premises network by using either ExpressRoute or VPN.

## Azure SQL Database Managed Instance isolated from the on-premises network
Use this network topology if your environment requires one or more of the following scenarios:
- The Azure SQL Database Managed Instance is isolated from on-premises connectivity, but your Azure Database Migration Service instance is connected to the on-premises network.
- If Role Based Access Control (RBAC) policies are in place and you require limiting the users to access the same subscription that is hosting the Azure SQL Database Managed Instance.
- The VNETs used for Azure SQL Database Managed Instance and Azure Database Migration Service are in different subscriptions.

![Network Topology for Managed Instance isolated from the on-premises network](media\resource-network-topologies\mi-isolated-workload.png)

**Requirements**
- The VNET that Azure Database Migration Service uses for this scenario must also be connected to the on-premises network by using either ExpressRoute or VPN.
- You must create a VNET network peering between the VNET used for Azure SQL Database Managed Instance and Azure Database Migration Service.


## Cloud to cloud migrations
Use this topology if the source SQL Server is hosted in an Azure virtual machine.

![Network Topology for Cloud-to-Cloud migrations](media\resource-network-topologies\cloud-to-cloud.png)

**Requirements**
- You must create a VNET network peering between the VNET used for Azure SQL Database Managed Instance and Azure Database Migration Service.
Additional resources
- Migrate SQL Server to Azure SQL Database Managed Instance
- Overview of prerequisites for using the Azure Database Migration Service
- Create a virtual network using the Azure portal

## Next steps
For an overview of the Azure Database Migration Service and regional availability during Public Preview, see the article [What is the Azure Database Migration Service Preview](dms-overview.md). 