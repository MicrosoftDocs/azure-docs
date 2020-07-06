---
title: Contoso migration series | Microsoft Docs
description: Links to Contoso example migration scenarios, for migration to Azure. 
ms.topic: conceptual
ms.date: 04/20/2020
ms.author: raynew

---
# Contoso migration series


We have a series of articles that demonstrate how the fictitious organization Contoso migrates its on-premises infrastructure to the [Microsoft Azure](https://azure.microsoft.com/overview/what-is-azure/) cloud. 

The series includes scenarios that illustrate how to set up an infrastructure migration, and how to run different types of migrations. Scenarios grow in complexity as they progress. The articles show how the Contoso company handles migration, but general instructions and pointers are provided throughout.

## Migration articles

The articles in the series are summarized in the table below.  

- Each migration scenario is driven by slightly different business requirements, that determine the migration strategy.
- For each deployment scenario, we provide information about business drivers and goals, a proposed architecture, steps to perform the migration, and recommendations for cleanup and next steps after migration is complete.


**Article** | **Details** 
--- | --- 
[Article 1: Overview](https://docs.microsoft.com/azure/architecture/cloud-adoption/migrate/azure-best-practices/contoso-migration-overview) | Overview of the article series, Contoso's migration strategy, and the sample apps that are used in the series. 
[Article 2: Deploy Azure infrastructure](https://docs.microsoft.com/azure/architecture/cloud-adoption/migrate/azure-best-practices/contoso-migration-infrastructure) | Contoso prepares its on-premises infrastructure, and Azure infrastructure for migration. The same infrastructure is used for all articles in the series. 
[Article 3: Assess on-premises resources for migration to Azure](https://docs.microsoft.com/azure/cloud-adoption-framework/migrate/azure-migration-guide/assess?tabs=Tools)  | Contoso runs an assessment of its on-premises SmartHotel360 app running on VMware. Contoso assesses app VMs using the Azure Migrate service, and the app SQL Server database using Data Migration Assistant.
[Article 4: Rehost an app on an Azure VM and SQL Managed Instance](https://docs.microsoft.com/azure/architecture/cloud-adoption/migrate/azure-best-practices/contoso-migration-rehost-vm-sql-managed-instance) | Contoso runs a lift-and-shift migration to Azure for its on-premises SmartHotel360 app. Contoso migrates the app front-end VM using [Azure Migrate](https://docs.microsoft.com/azure/migrate/migrate-services-overview). Contoso migrates the app database to a SQL Managed Instance, using the [Azure Database Migration Service](https://docs.microsoft.com/azure/dms/dms-overview).
[Article 5: Rehost an app on Azure VMs](https://docs.microsoft.com/azure/architecture/cloud-adoption/migrate/azure-best-practices/contoso-migration-rehost-vm) | Contoso migrates its SmartHotel360 app VMs to Azure VMs using the Azure Migrate service. 
[Article 6: Rehost an app on Azure VMs and in a  SQL Server AlwaysOn availability group](https://docs.microsoft.com/azure/architecture/cloud-adoption/migrate/azure-best-practices/contoso-migration-rehost-vm-sql-ag) | Contoso migrates the SmartHotel360 app. Contoso uses Azure Migrate to migrate the app VMs. It uses the Database Migration Service to migrate the app database to a SQL Server cluster that's protected by an AlwaysOn availability group. 
[Article 7: Rehost a Linux app on Azure VMs](https://docs.microsoft.com/azure/architecture/cloud-adoption/migrate/azure-best-practices/contoso-migration-rehost-linux-vm) | Contoso completes a lift-and-shift migration of its Linux osTicket app to Azure VMs, using Azure Migrate.
[Article 8: Rehost a Linux app on Azure VMs and Azure Database for MySQL](https://docs.microsoft.com/azure/architecture/cloud-adoption/migrate/azure-best-practices/contoso-migration-rehost-linux-vm-mysql) | Contoso migrates its Linux osTicket app to Azure VMs  using Azure Migrate. It migrates the app database to Azure Database for MySQ, using Azure Database Migration Service (includes an alternative option using MySQL Workbench).
[Article 9: Refactor an app in an Azure web app and Azure SQL Database](https://docs.microsoft.com/azure/architecture/cloud-adoption/migrate/azure-best-practices/contoso-migration-refactor-web-app-sql) | Contoso migrates its SmartHotel360 app to an Azure web app, and migrates the app database to Azure SQL Database, using the Azure Database Migration Service.
[Article 10: Refactor a Windows app using Azure App Services and SQL Managed Instance](https://docs.microsoft.com/azure/cloud-adoption-framework/migrate/azure-best-practices/contoso-migration-refactor-web-app-sql-managed-instance) | Contoso migrates an on-premises Windows-based app to an Azure web app, and migrates the app database to an Azure SQL Managed Instance, using the Azure Database Migration Service.
[Article 11: Refactor a Linux app in an Azure web app and Azure Database for MySQL](https://docs.microsoft.com/azure/architecture/cloud-adoption/migrate/azure-best-practices/contoso-migration-refactor-linux-app-service-mysql) | Contoso migrates its Linux osTicket app to an Azure web app in multiple Azure regions, using Azure Traffic Manager, integrated with GitHub for continuous delivery. Contoso migrates the app database to an Azure Database for MySQL instance. 
[Article 12: Refactor Team Foundation Server on Azure DevOps Services](https://docs.microsoft.com/azure/architecture/cloud-adoption/migrate/azure-best-practices/contoso-migration-tfs-vsts) | Contoso migrates its on-premises Team Foundation Server deployment to Azure DevOps Services in Azure.
[Article 13: Rebuild an app in Azure](https://docs.microsoft.com/azure/architecture/cloud-adoption/migrate/azure-best-practices/contoso-migration-rebuild) | Contoso rebuilds its SmartHotel app using a range of Azure capabilities and services, including Azure App Service, Azure Kubernetes Service (AKS), Azure Functions, Azure Cognitive Services, and Azure Cosmos DB.
[Article 14: Scale a migration to Azure](https://docs.microsoft.com/azure/architecture/cloud-adoption/migrate/azure-best-practices/contoso-migration-scale) | After trying out migration combinations, Contoso prepares to scale to a full migration to Azure.



## Next steps

- [Learn about](https://docs.microsoft.com/azure/architecture/cloud-adoption/migrate/) cloud migration.
- Learn about migration strategies for other scenarios (source/target pairs) in the [Database Migration Guide](https://datamigration.microsoft.com/).
