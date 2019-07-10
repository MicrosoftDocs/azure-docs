---
title: FAQ about using the Azure Database Migration Service | Microsoft Docs
description: Learn frequently asked questions about using Azure Database Migration Service to perform database migrations.
services: database-migration
author: HJToland3
ms.author: jtoland
manager: craigg
ms.reviewer: craigg
ms.service: dms
ms.workload: data-services
ms.custom: mvc
ms.topic: article
ms.date: 07/10/2019
---

# FAQ about using Azure Database Migration Service

This article lists commonly asked questions about using Azure Database Migration Service together with related answers.

## Overview

**Q. What is Azure Database Migration Service?**
Azure Database Migration Service is a fully managed service designed to enable seamless migrations from multiple database sources to Azure Data platforms with minimal downtime. The service is currently in General Availability, with ongoing development efforts focused on:

* Reliability and performance.
* Iterative addition of source-target pairs.
* Continued investment in friction-free migrations.

**Q. What source/target pairs does Azure Database Migration Service currently support?**
The service currently supports a variety of source/target pairs, or migration scenarios. For a complete listing of the status of each available migration scenario, see the article [Status of migration scenarios supported by the Azure Database Migration Service](https://docs.microsoft.com/azure/dms/resource-scenario-status).

Other migration scenarios are in preview and require submitting a nomination via the DMS Preview site. For a complete listing of the scenarios in preview and to sign up to participate in one of these offerings, see the [DMS Preview site](https://aka.ms/dms-preview/).

**Q. What versions of SQL Server does Azure Database Migration Service support as a source?**
When migrating from SQL Server, supported sources for Azure Database Migration Service are SQL Server 2005 through SQL Server 2017.

**Q: When using Azure Database Migration Service, what’s the difference between an offline and an online migration?**
You can use Azure Database Migration Service to perform offline and online migrations. With an *offline* migration, application downtime starts when the migration starts. With an *online* migration, downtime is limited to the time to cut over at the end of migration. We suggest that you test an offline migration to determine whether the downtime is acceptable; if not, do an online migration.

> [!NOTE]
> Using Azure Database Migration Service to perform an online migration requires creating an instance based on the Premium pricing tier. For more information, see the Azure Database Migration Service [pricing](https://azure.microsoft.com/pricing/details/database-migration/) page.

**Q. How does Azure Database Migration Service compare to other Microsoft database migration tools such as the Database Migration Assistant (DMA) or SQL Server Migration Assistant (SSMA)?**
Azure Database Migration Service is the preferred method for database migration to Microsoft Azure at scale. For more detail on how Azure Database Migration Service compares to other Microsoft database migration tools and for recommendations on using the service for various scenarios, see the blog posting [Differentiating Microsoft’s Database Migration Tools and Services](https://blogs.msdn.microsoft.com/datamigration/2017/10/13/differentiating-microsofts-database-migration-tools-and-services/).

**Q. How does Azure Database Migration Service compare to the Azure Migrate offering?**
Azure Migrate assists with migration of on-premises virtual machines to Azure IaaS. The service assesses migration suitability and performance-based sizing, and it provides cost estimates for running your on-premises virtual machines in Azure. Azure Migrate is useful for lift-and-shift migrations of on-premises VM-based workloads to Azure IaaS VMs. However, unlike Azure Database Migration Service, Azure Migrate isn’t a specialized database migration service offering for Azure PaaS relational database platforms such as Azure SQL Database or Azure SQL Database Managed Instance.

## Setup

**Q. What are the prerequisites for using Azure Database Migration Service?**
There are several prerequisites required to ensure that Azure Database Migration Service runs smoothly when performing database migrations. Some of the prerequisites apply across all scenarios (source-target pairs) supported by the service, while other prerequisites are unique to a specific scenario.

Azure Database Migration Service prerequisites that are common across all supported migration scenarios include the need to:

* Create a VNet for Azure Database Migration Service by using the Azure Resource Manager deployment model, which provides site-to-site connectivity to your on-premises source servers by using either [ExpressRoute](https://docs.microsoft.com/azure/expressroute/expressroute-introduction) or [VPN](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways).
* Ensure that your Azure Virtual Network (VNet) Network Security Group rules don't block the following communication ports 443, 53, 9354, 445, 12000. For more detail on Azure VNet NSG traffic filtering, see the article [Filter network traffic with network security groups](https://docs.microsoft.com/azure/virtual-network/virtual-networks-nsg).
* When using a firewall appliance in front of your source database(s), you may need to add firewall rules to allow Azure Database Migration Service to access the source database(s) for migration.

For a list of all the prerequisites required to compete specific migration scenarios using Azure Database Migration Service, see the related tutorials in the Azure Database Migration Service [documentation](https://docs.microsoft.com/azure/dms/dms-overview) on docs.microsoft.com.

**Q. How do I find the IP address for Azure Database Migration Service so that I can create an allow list for the firewall rules used to access my source database for migration?**
You may need to add firewall rules allowing Azure Database Migration Service to access to your source database for migration. The IP address for the service is dynamic, but if you're using Express Route, this address is privately assigned by your corporate network. The easiest way to identify the appropriate IP address is to look in the same resource group as your provisioned Azure Database Migration Service resource to find the associated Network Interface. Usually the name of the Network Interface resource begins with the NIC prefix and followed by a unique character and number sequence, for example NIC-jj6tnztnmarpsskr82rbndyp. By selecting this network interface resource, you can see the IP address that needs to be included in the allow list on the resource overview Azure portal page.

You may also need to include the port source that SQL Server is listening on the allow list. By default, it's port 1433, but the source SQL Server may be configured to listen on other ports as well. In this case, you need to include those ports on the allow list as well. You can determine the port that SQL Server is listening on by using a Dynamic Management View query:

```sql
    SELECT DISTINCT
        local_tcp_port
    FROM sys.dm_exec_connections
    WHERE local_tcp_port IS NOT NULL
```

You can also determine the port that SQL Server is listening by querying the SQL Server error log:

```sql
    USE master
    GO
    xp_readerrorlog 0, 1, N'Server is listening on'
    GO
```

**Q. How do I set up an Azure Virtual Network?**
While multiple Microsoft tutorials that can walk you through the process of setting up an Azure VNET, the official documentation appears in the article [Azure Virtual Network](https://docs.microsoft.com/azure/virtual-network/virtual-networks-overview).

## Usage

**Q. What is a summary of the steps required to use Azure Database Migration Service to perform a database migration?**
During a typical, simple database migration, you:

1. Create a target database(s).
2. Assess your source database(s).
    * For homogenous migrations, assess your existing database(s) by using [DMA](https://www.microsoft.com/download/details.aspx?id=53595).
    * For heterogenous migrations (from compete sources), assess your existing database(s) with [SSMA](https://aka.ms/get-ssma). You also use SSMA to convert database objects and migrate the schema to your target platform.
3. Create an instance of Azure Database Migration Service.
4. Create a migration project specifying the source database(s), target database(s), and the tables to migrate.
5. Start the full load.
6. Pick the subsequent validation.
7. Perform a manual switchover of your production environment to the new cloud-based database.

## Troubleshooting and optimization

**Q. I’m setting up a migration project in DMS, and I’m having difficulty connecting to my source database. What should I do?**
If you have trouble connecting to your source database system while working on migration, create a virtual machine in the VNet with which you set up your DMS instance. In the virtual machine, you should be able to run a connect test, such as using a UDL file to test a connection to SQL Server or downloading Robo 3T to test MongoDB connections. If the connection test succeeds, you shouldn't have an issue with connecting to your source database. If the connection test doesn't succeed, contact your network administrator.

**Q. Why is my Azure Database Migration Service unavailable or stopped?**
If the user explicitly stops Azure Database Migration Service (DMS) or if the service is inactive for a period of 24 hours, the service will be in a stopped or auto paused state. In each case, the service will be unavailable and in a stopped status.  To resume active migrations, restart the service.

**Q. Are there any recommendations for optimizing the performance of Azure Database Migration Service?**
You can do a few things to speed up your database migration using the service:

* Use the multi CPU General Purpose Pricing Tier when you create your service instance to allow the service to take advantage of multiple vCPUs for parallelization and faster data transfer.
* Temporarily scale up your Azure SQL Database target instance to the Premium tier SKU during the data migration operation to minimize Azure SQL Database throttling that may impact data transfer activities when using lower-level SKUs.

## Next steps

For an overview of the Azure Database Migration Service and regional availability, see the article [What is the Azure Database Migration Service](dms-overview.md).
