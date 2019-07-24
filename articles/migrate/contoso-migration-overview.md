---
title: Contoso migration series | Microsoft Docs
description: Provides an overview of the migration strategy and scenarios used by Contoso to migrate their on-premises datacenter to Azure.
author: rayne-wiselman
manager: carmonm
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 05/23/2019
ms.author: raynew

---
# Contoso migration series


We have a series of articles that demonstrates how the fictitious organization Contoso migrates on-premises infrastructure to the [Microsoft Azure](https://azure.microsoft.com/overview/what-is-azure/) cloud. 

The series includes information and scenarios that illustrate how to set up a migration of infrastructure, and run different types of migrations. Scenarios grow in complexity as they progress. The articles show how the Contoso company completes its migration mission, but pointers for general reading and specific instructions are provided throughout.

## Migration articles

The articles in the series are summarized in the table below.  

- Each migration scenario is driven by slightly different business goals that determine the migration strategy.
- For each deployment scenario, we provide information about business drivers and goals, a proposed architecture, steps to perform the migration, and recommendation for cleanup and next steps after migration is complete.

**Article** | **Details** 
--- | --- 
[Article 1: Overview](https://docs.microsoft.com/azure/architecture/cloud-adoption/migrate/azure-best-practices/contoso-migration-overview) | Overview of the article series, Contoso's migration strategy, and the sample apps that are used in the series. 
[Article 2: Deploy Azure infrastructure](https://docs.microsoft.com/azure/architecture/cloud-adoption/migrate/azure-best-practices/contoso-migration-infrastructure) | Contoso prepares its on-premises infrastructure and its Azure infrastructure for migration. The same infrastructure is used for all migration articles in the series. 
[Article 3: Assess on-premises resources for migration to Azure](https://docs.microsoft.com/azure/architecture/cloud-adoption/migrate/azure-best-practices/contoso-migration-assessment)  | Contoso runs an assessment of its on-premises SmartHotel360 app running on VMware. Contoso assesses app VMs using the Azure Migrate service, and the app SQL Server database using Data Migration Assistant.
[Article 4: Rehost an app on an Azure VM and SQL Database Managed Instance](https://docs.microsoft.com/azure/architecture/cloud-adoption/migrate/azure-best-practices/contoso-migration-rehost-vm-sql-managed-instance) | Contoso runs a lift-and-shift migration to Azure for its on-premises SmartHotel360 app. Contoso migrates the app front-end VM using [Azure Site Recovery](https://docs.microsoft.com/azure/site-recovery/site-recovery-overview). Contoso migrates the app database to an Azure SQL Database Managed Instance using the [Azure Database Migration Service](https://docs.microsoft.com/azure/dms/dms-overview).
[Article 5: Rehost an app on Azure VMs](https://docs.microsoft.com/azure/architecture/cloud-adoption/migrate/azure-best-practices/contoso-migration-rehost-vm) | Contoso migrates its SmartHotel360 app VMs to Azure VMs by using the Site Recovery service. 
[Article 6: Rehost an app on Azure VMs and in a  SQL Server AlwaysOn availability group](https://docs.microsoft.com/azure/architecture/cloud-adoption/migrate/azure-best-practices/contoso-migration-rehost-vm-sql-ag) |Contoso migrates the SmartHotel360 app. Contoso uses Site Recovery to migrate the app VMs. It uses the Database Migration Service to migrate the app database to a SQL Server cluster that's protected by an AlwaysOn availability group. 
[Article 7: Rehost a Linux app on Azure VMs](https://docs.microsoft.com/azure/architecture/cloud-adoption/migrate/azure-best-practices/contoso-migration-rehost-linux-vm) | Contoso completes a lift-and-shift migration of its Linux osTicket app to Azure VMs, using the Site Recovery service.
[Article 8: Rehost a Linux app on Azure VMs and Azure Database for MySQL](https://docs.microsoft.com/azure/architecture/cloud-adoption/migrate/azure-best-practices/contoso-migration-rehost-linux-vm-mysql) | Contoso migrates its Linux osTicket app to Azure VMs by using Site Recovery. It migrates the app database to Azure Database for MySQL by using MySQL Workbench. 
[Article 9: Refactor an app in an Azure web app and Azure SQL Database](https://docs.microsoft.com/azure/architecture/cloud-adoption/migrate/azure-best-practices/contoso-migration-refactor-web-app-sql) | Contoso migrates its SmartHotel360 app to an Azure web app and migrates the app database to an Azure SQL Server instance with the Database Migration Assistant. 	
[Article 10: Refactor a Linux app in an Azure web app and Azure Database for MySQL](https://docs.microsoft.com/azure/architecture/cloud-adoption/migrate/azure-best-practices/contoso-migration-refactor-linux-app-service-mysql) | Contoso migrates its Linux osTicket app to an Azure web app on multiple Azure regions using Azure Traffic Manager, integrated with GitHub for continuous delivery. Contoso migrates the app database to an Azure Database for MySQL instance. 
[Article 11: Refactor Team Foundation Server on Azure DevOps Services](https://docs.microsoft.com/azure/architecture/cloud-adoption/migrate/azure-best-practices/contoso-migration-tfs-vsts) | Contoso migrates its on-premises Team Foundation Server deployment to Azure DevOps Services in Azure.
[Article 12: Rearchitect an app in Azure containers and Azure SQL Database](https://docs.microsoft.com/azure/architecture/cloud-adoption/migrate/azure-best-practices/contoso-migration-rearchitect-container-sql) | Contoso migrates its SmartHotel app to Azure. Then, it rearchitects the app web tier as a Windows container running in Azure Service Fabric, and the database with Azure SQL Database. 
[Article 13: Rebuild an app in Azure](https://docs.microsoft.com/azure/architecture/cloud-adoption/migrate/azure-best-practices/contoso-migration-rebuild) | Contoso rebuilds its SmartHotel app by using a range of Azure capabilities and services, including Azure App Service, Azure Kubernetes Service (AKS), Azure Functions, Azure Cognitive Services, and Azure Cosmos DB. 	
[Article 14: Scale a migration to Azure](https://docs.microsoft.com/azure/architecture/cloud-adoption/migrate/azure-best-practices/contoso-migration-scale) | After trying out migration combinations, Contoso prepares to scale to a full migration to Azure. 


    

## Next steps

[Learn about](https://docs.microsoft.com/azure/architecture/cloud-adoption/migrate/) cloud migration. 

