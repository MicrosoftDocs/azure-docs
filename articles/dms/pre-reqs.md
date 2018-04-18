---
title: Overview of prerequisites for using the Azure Database Migration Service | Microsoft Docs
description: Learn about an overview of the prerequisites for using the Azure Database Migration Service to perform database migrations.
services: database-migration
author: HJToland3
ms.author: jtoland
manager: 
ms.reviewer: 
ms.service: database-migration
ms.workload: data-services
ms.custom: mvc
ms.topic: article
ms.date: 01/25/2018
---

# Overview of prerequisites for using the Azure Database Migration Service
There are several prerequisites required to ensure that the Azure Database Migration Service runs smoothly when performing database migrations. Some of the prerequisites apply across all scenarios (source-target pairs) supported by the service, while other prerequisites are unique to a specific scenario.

Prerequisites associated with using the Azure Database Migration Service are listed in the following sections.

## Prerequisites common across migration scenarios
Azure Database Migration Service prerequisites that are common across all supported migration scenarios include the need to:
- Create a VNET for the Azure Database Migration Service by using the Azure Resource Manager deployment model, which provides site-to-site connectivity to your on-premises source servers by using either [ExpressRoute](https://docs.microsoft.com/en-us/azure/expressroute/expressroute-introduction) or [VPN](https://docs.microsoft.com/en-us/azure/vpn-gateway/vpn-gateway-about-vpngateways).
- Ensure that your Azure Virtual Network (VNET) Network Security Group rules do not block the following communication ports 443, 53, 9354, 445, 12000. For more detail on Azure VNET NSG traffic filtering, see the article [Filter network traffic with network security groups](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-networks-nsg).
- When using a firewall appliance in front of your source database(s), you may need to add firewall rules to allow the Azure Database Migration Service to access the source database(s) for migration.

## Prerequisites for migrating SQL Server to Azure SQL Database 
In addition to Azure Database Migration Service prerequisites that are common to all migration scenarios, there are also prerequisites that apply specifically to one scenario or another.

When using the Azure Database Migration Service to perform SQL Server to Azure SQL Database migrations, in addition to the prerequisites that are common to all migration scenarios, be sure to address the following additional prerequisites:
- Configure your [Windows Firewall for database engine access](https://docs.microsoft.com/en-us/sql/database-engine/configure-windows/configure-a-windows-firewall-for-database-engine-access).
- Enable the TCP/IP protocol, which is disabled by default during SQL Server Express installation, by following the instructions in the article [Enable or Disable a Server Network Protocol](https://docs.microsoft.com/en-us/sql/database-engine/configure-windows/enable-or-disable-a-server-network-protocol#SSMSProcedure).
- Create an instance of Azure SQL Database instance, which you do by following the detail in the article C[reate an Azure SQL database in the Azure portal](https://docs.microsoft.com/en-us/azure/sql-database/sql-database-get-started-portal).
- Download and install the [Data Migration Assistant](https://www.microsoft.com/en-us/download/details.aspx?id=53595) v3.3 or later.
- Open your Windows firewall to allow the Azure Database Migration Service to access the source database(s).
- Create a server-level [firewall rule](https://docs.microsoft.com/en-us/azure/sql-database/sql-database-firewall-configure) for the Azure SQL Database server to allow the Azure Database Migration Service access to the target databases. Provide the subnet range of the VNET used for the Azure Database Migration Service.
- Ensure that the credentials used to connect to source SQL Server instance have [CONTROL SERVER](https://docs.microsoft.com/en-us/sql/t-sql/statements/grant-server-permissions-transact-sql) permissions.
- Ensure that the credentials used to connect to target Azure SQL Database instance have CONTROL DATABASE permission on the target Azure SQL databases.

   > [!NOTE]
   > For a complete listing of the prerequisites required to use the Azure Database Migration Service to perform migrations from SQL Server to Azure SQL Database, see the tutorial [Migrate SQL Server to Azure SQL Database](https://docs.microsoft.com/en-us/azure/dms/tutorial-sql-server-to-azure-sql).
   > 

## Next steps
For an overview of the Azure Database Migration Service and regional availability during Public Preview, see the article [What is the Azure Database Migration Service Preview](dms-overview.md). 