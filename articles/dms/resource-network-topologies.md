---
title: Network topologies for Azure SQL Database Managed Instance migrations using the Azure Database Migration Service | Microsoft Docs
description: Learn the source and target configurations for Database Migration Service.
services: database-migration
author: pochiraju
ms.author: rajpo
manager: 
ms.reviewer: 
ms.service: database-migration
ms.workload: data-services
ms.custom: mvc
ms.topic: article
ms.date: 10/10/2018
---

# Network topologies for Azure SQL DB Managed Instance migrations using the Azure Database Migration Service
This article discusses various network topologies that the Azure Database Migration Service can work with to provide a comprehensive migration experience from on-premises SQL Servers to Azure SQL Database Managed Instance.

## Azure SQL Database Managed Instance configured for Hybrid workloads 
Use this topology if your Azure SQL Database Managed Instance is connected to your on-premises network. This approach provides the most simplified network routing and yields maximum data throughput during the migration.

![Network Topology for Hybrid Workloads](media\resource-network-topologies\hybrid-workloads.png)

**Requirements**
- In this scenario, the Azure SQL Database Managed Instance and the Azure Database Migration Service instance are created in the same Azure VNET, but they use different subnets.  
- The VNET used in this scenario is also connected to the on-premises network by using either [ExpressRoute](https://docs.microsoft.com/azure/expressroute/expressroute-introduction) or [VPN](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways).

## Azure SQL Database Managed Instance isolated from the on-premises network
Use this network topology if your environment requires one or more of the following scenarios:
- The Azure SQL Database Managed Instance is isolated from on-premises connectivity, but your Azure Database Migration Service instance is connected to the on-premises network.
- If Role Based Access Control (RBAC) policies are in place and you need to limit the users to accessing the same subscription that is hosting the Azure SQL Database Managed Instance.
- The VNETs used for the Azure SQL Database Managed Instance and the Azure Database Migration Service are in different subscriptions.

![Network Topology for Managed Instance isolated from the on-premises network](media\resource-network-topologies\mi-isolated-workload.png)

**Requirements**
- The VNET that Azure Database Migration Service uses for this scenario must also be connected to the on-premises network by using either (https://docs.microsoft.com/azure/expressroute/expressroute-introduction) or [VPN](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways).
- Set up [VNET network peering](https://docs.microsoft.com/azure/virtual-network/virtual-network-peering-overview) between the VNET used for Azure SQL Database Managed Instance and the Azure Database Migration Service.


## Cloud-to-cloud migrations: shared VNET

Use this topology if the source SQL Server is hosted in an Azure VM and shares the same VNET with Azure SQL Database Managed Instance and the Azure Database Migration Service.

![Network Topology for Cloud-to-Cloud migrations with a shared vnet](media\resource-network-topologies\cloud-to-cloud.png)

**Requirements**
- No additional requirements.

## Cloud to cloud migrations: isolated VNET

Use this network topology if your environment requires one or more of the following scenarios:
- The Azure SQL Database Managed Instance is provisioned in an isolated VNET.
- If Role Based Access Control (RBAC) policies are in place and you need to limit the users to accessing the same subscription that is hosting the Azure SQL Database Managed Instance.
- The VNETs used for Azure SQL Database Managed Instance and the Azure Database Migration Service are in different subscriptions.

![Network Topology for Cloud-to-Cloud migrations with an isolated vnet](media\resource-network-topologies\cloud-to-cloud-isolated.png)

**Requirements**
- Set up [VNET network peering](https://docs.microsoft.com/azure/virtual-network/virtual-network-peering-overview) between the VNET used for Azure SQL Database Managed Instance and the Azure Database Migration Service.


## See Also
- [Migrate SQL Server to Azure SQL Database Managed Instance](https://docs.microsoft.com/azure/dms/tutorial-sql-server-to-managed-instance)
- [Overview of prerequisites for using the Azure Database Migration Service](https://docs.microsoft.com/azure/dms/pre-reqs)
- [Create a virtual network using the Azure portal](https://docs.microsoft.com/azure/virtual-network/quick-create-portal)

## Next steps
For an overview of the Azure Database Migration Service and regional availability during Public Preview, see the article [What is the Azure Database Migration Service Preview](dms-overview.md). 