---
title: Overview of Contoso migration to Azure | Microsoft Docs
description: Provides an overview of the migration strategy and scenarios used by Contoso to migrate their on-premises datacenter to Azure.
author: rayne-wiselman
manager: carmonm
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 10/11/2018
ms.author: raynew

---
# Contoso migration: Overview


This article demonstrates how the fictitious organization Contoso migrates on-premises infrastructure to the [Microsoft Azure](https://azure.microsoft.com/overview/what-is-azure/) cloud. 

This document is the first in a series of articles that show how the fictitious company Contoso migrates to Azure. The series includes information and scenarios that illustrate how to set up a migration of infrastructure, and run different types of migrations. Scenarios grow in complexity, and we'll add additional articles over time. The articles show how the Contoso company completes its migration mission, but pointers for general reading and specific instructions are provided throughout.

## Introduction

Azure provides access to a comprehensive set of cloud services. As developers and IT professionals, you can use these services to build, deploy, and manage applications on a range of tools and frameworks, through a global network of datacenters. As your business faces challenges associated with the digital shift, the Azure cloud helps you to figure out how to optimize resources and operations, engage with your customers and employees, and transform your products.

However, Azure recognizes that even with all the advantages that the cloud provides in terms of speed and flexibility, minimized costs, performance, and reliability, many organizations are going to need to run on-premises datacenters for some time to come. In response to cloud adoption barriers, Azure provides a hybrid cloud strategy that builds bridges between your on-premises datacenters, and the Azure public cloud. For example, using Azure cloud resources like Azure Backup to protect on-premises resources, or using Azure analytics to gain insights into on-premises workloads. 

As part of the hybrid cloud strategy, Azure provides growing solutions for migrating on-premises apps and workloads to the cloud. With simple steps, you can comprehensively assess your on-premises resources to figure out how they'll run in the Azure cloud. Then, with a deep assessment in hand, you can confidently migrate resources to Azure. When resources are up and running in Azure, you can optimize them to retain and improve access, flexibility, security, and reliability.

## Migration strategies

Strategies for migration to the cloud fall into four broad categories: rehost, refactor, rearchitect, or rebuild. The strategy you adopt depends upon your business drivers, and migration goals. You might adopt multiple strategies. For example, you could choose to rehost (lift-and-shift) simple apps, or apps that aren't critical to your business, but rearchitect those that are more complex and business-critical. Let's look at the strategies.


**Strategy** | **Definition** | **When to use** 
--- | --- | --- 
**Rehost** | Often referred to as a "lift-and-shift" migration. This option doesn't require code changes, and let's you migrate your existing apps to Azure quickly. Each app is migrated as is, to reap the benefits of the cloud, without the risk and cost associated with code changes. | When you need to move apps quickly to the cloud.<br/><br/> When you want to move an app without modifying it.<br/><br/> When your apps are architected so that they can leverage [Azure IaaS](https://azure.microsoft.com/overview/what-is-iaas/) scalability after migration.<br/><br/> When apps are important to your business, but you don't need immediate changes to app capabilities.
**Refactor** | Often referred to as “repackaging,” refactoring requires minimal changes to apps, so that they can connect to [Azure PaaS](https://azure.microsoft.com/overview/what-is-paas/), and use cloud offerings.<br/><br/> For example, you could migrate existing apps to Azure App Service or Azure Kubernetes Service (AKS).<br/><br/> Or, you could refactor relational and non-relational databases into options such as Azure SQL Database Managed Instance, Azure Database for MySQL, Azure Database for PostgreSQL, and Azure Cosmos DB. | If your app can easily be repackaged to work in Azure.<br/><br/> If you want to apply innovative DevOps practices provided by Azure, or you're thinking about DevOps using a container strategy for workloads.<br/><br/> For refactoring, you need to think about the portability of your existing code base, and available development skills.
**Rearchitect** | Rearchitecting for migration focuses on modifying and extending app functionality and the code base to optimize the app architecture for cloud scalability.<br/><br/> For example, you could break down a monolithic application into a group of microservices that work together and scale easily.<br/><br/> Or, you could rearchitect relational and non-relational databases to a fully managed DBaaS solutions, such as Azure SQL Database Managed Instance, Azure Database for MySQL, Azure Database for PostgreSQL, and Azure Cosmos DB. | When your apps need major revisions to incorporate new capabilities, or to work effectively on a cloud platform.<br/><br/> When you want to use existing application investments, meet scalability requirements, apply innovative Azure DevOps practices, and minimize use of virtual machines.
**Rebuild** | Rebuild takes things a step further by rebuilding an app from scratch using Azure cloud technologies.<br/><br/> For example, you could build green field apps with cloud-native technologies like Azure Functions, Azure AI, Azure SQL Database Managed Instance, and Azure Cosmos DB. | When you want rapid development, and existing apps have limited functionality and lifespan.<br/><br/> When you're ready to expedite business innovation (including DevOps practices provided by Azure), build new applications using cloud-native technologies, and take advantage of advancements in AI, Blockchain, and IoT.

## Migration articles

The articles in the series are summarized in the table below.  

- Each migration scenario is driven by slightly different business goals that determine the migration strategy.
- For each deployment scenario, we provide information about business drivers and goals, a proposed architecture, steps to perform the migration, and recommendation for cleanup and next steps after migration is complete.

**Article** | **Details** | **Status**
--- | --- | ---
Article 1: Overview | Overview of the article series, Contoso's migration strategy, and the sample apps that are used in the series. | This article
[Article 2: Deploy Azure infrastructure](contoso-migration-infrastructure.md) | Contoso prepares its on-premises infrastructure and its Azure infrastructure for migration. The same infrastructure is used for all migration articles in the series. | Available
[Article 3: Assess on-premises resources for migration to Azure](contoso-migration-assessment.md)  | Contoso runs an assessment of its on-premises SmartHotel360 app running on VMware. Contoso assesses app VMs using the Azure Migrate service, and the app SQL Server database using Data Migration Assistant. | Available
[Article 4: Rehost an app on an Azure VM and SQL Database Managed Instance](contoso-migration-rehost-vm-sql-managed-instance.md) | Contoso runs a lift-and-shift migration to Azure for its on-premises SmartHotel360 app. Contoso migrates the app front-end VM using [Azure Site Recovery](https://docs.microsoft.com/azure/site-recovery/site-recovery-overview). Contoso migrates the app database to an Azure SQL Database Managed Instance using the [Azure Database Migration Service](https://docs.microsoft.com/azure/dms/dms-overview). | Available	
[Article 5: Rehost an app on Azure VMs](contoso-migration-rehost-vm.md) | Contoso migrates its SmartHotel360 app VMs to Azure VMs by using the Site Recovery service. | Available	[Article 5: Rehost an app on Azure VMs](contoso-migration-rehost-vm.md) | Contoso migrates its SmartHotel360 app VMs to Azure VMs using the Site Recovery service. | Available
[Article 6: Rehost an app on Azure VMs and in a  SQL Server AlwaysOn availability group](contoso-migration-rehost-vm-sql-ag.md) | Contoso migrates the SmartHotel360 app. Contoso uses Site Recovery to migrate the app VMs. It uses the Database Migration Service to migrate the app database to a SQL Server cluster that's protected by an AlwaysOn availability group. | Available	[Article 7: Rehost a Linux app on Azure VMs](contoso-migration-rehost-linux-vm.md) | Contoso completes a lift-and-shift migration of its Linux osTicket app to Azure VMs, using the Site Recovery service. | Available
[Article 8: Rehost a Linux app on Azure VMs and Azure Database for MySQL](contoso-migration-rehost-linux-vm-mysql.md) | Contoso migrates its Linux osTicket app to Azure VMs by using Site Recovery. It migrates the app database to Azure Database for MySQL by using MySQL Workbench. | Available
[Article 9: Refactor an app in an Azure web app and Azure SQL Database](contoso-migration-refactor-web-app-sql.md) | Contoso migrates its SmartHotel360 app to an Azure web app and migrates the app database to an Azure SQL Server instance with the Database Migration Assistant. | Available	
[Article 10: Refactor a Linux app in an Azure web app and Azure Database for MySQL](contoso-migration-refactor-linux-app-service-mysql.md) | Contoso migrates its Linux osTicket app to an Azure web app on multiple Azure regions using Azure Traffic Manager, integrated with GitHub for continuous delivery. Contoso migrates the app database to an Azure Database for MySQL instance. | Available
[Article 11: Refactor Team Foundation Server on Azure DevOps Services](contoso-migration-tfs-vsts.md) | Contoso migrates its on-premises Team Foundation Server deployment to Azure DevOps Services in Azure. | Available
[Article 12: Rearchitect an app in Azure containers and Azure SQL Database](contoso-migration-rearchitect-container-sql.md) | Contoso migrates its SmartHotel app to Azure. Then, it rearchitects the app web tier as a Windows container running in Azure Service Fabric, and the database with Azure SQL Database. | Available	
[Article 13: Rebuild an app in Azure](contoso-migration-rebuild.md) | Contoso rebuilds its SmartHotel app by using a range of Azure capabilities and services, including Azure App Service, Azure Kubernetes Service (AKS), Azure Functions, Azure Cognitive Services, and Azure Cosmos DB. | Available	
[Article 14: Scale a migration to Azure](contoso-migration-scale.md) | After trying out migration combinations, Contoso prepares to scale to a full migration to Azure. | Available

In this article Contoso sets up all the infrastructure elements it needs to complete all migration scenarios. 







### Demo apps

The articles use two demo apps - SmartHotel360, and osTicket.

- **SmartHotel360**: This app was developed by Microsoft as a test app that you can use when working with Azure. It's provided as open source and you can download it from [GitHub](https://github.com/Microsoft/SmartHotel360). It's an ASP.NET app connected to a SQL Server database. Currently the app is on two VMware VMs running Windows Server 2008 R2, and SQL Server 2008 R2. The app VMs are hosted on-premises and managed by vCenter Server.
- **osTicket**: An open-source service desk ticketing app that runs on Linux. You can download it from [GitHub](https://github.com/osTicket/osTicket). Current the app is on two VMware VMs running Ubuntu 16.04 LTS, using Apache 2, PHP 7.0, and MySQL 5.7
    

## Next steps

[Learn how](contoso-migration-infrastructure.md) Contoso sets up an on-premises and Azure infrastructure to prepare for migration.



