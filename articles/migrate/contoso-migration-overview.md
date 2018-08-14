---
title: Overview of Contoso migration to Azure | Microsoft Docs
description: Provides an overview of the migration strategy and scenarios used by Contoso to migrate their on-premises datacenter to Azure.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 07/12/2018
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
Article 1: Overview | Provides an overview of Contoso's migration strategy, the article series, and the sample apps we use. | This article.
[Article 2: Deploy Azure infrastructure](contoso-migration-infrastructure.md) | Describes how Contoso prepares its on-premises and Azure infrastructure for migration. The same infrastructure is used for all migration articles. | Available
[Article 3: Assess on-premises resources for migration to Azure](contoso-migration-assessment.md)  | Shows how Contoso runs an assessment of an on-premises two-tier SmartHotel app running on VMware. Contoso assesses app VMs with the [Azure Migrate](migrate-overview.md) service, and the app SQL Server database with the Database Migration Assistant. | Available
[Article 4: Rehost an app on Azure VMs and a SQL Managed Instance](contoso-migration-rehost-vm-sql-managed-instance.md) | Demonstrates how Contoso runs a lift-and-shift migration to Azure for the on-premises SmartHotel app. Contoso migrates the app frontend VM using Azure Site Recovery, and the app database to a SQL Managed Instance, using the Azure Database Migration Service. | Available
[Article 5: Rehost an app on Azure VMs](contoso-migration-rehost-vm.md) | Shows how Contoso migrate the SmartHotel app VMs to Azure VMs, using the Azure Site Recovery service. | Available
[Article 6: Rehost an app on Azure VMs and SQL Server Always On Availability Group](contoso-migration-rehost-vm-sql-ag.md) | Shows how Contoso migrates the SmartHotel app using Azure Site Recovery to migrate the app VMs, and the Azure Database Migration Service to migrate the app database to a SQL Server cluster protected by an AlwaysOn Availability Group. | Available
[Article 7: Rehost a Linux app on Azure VMs](contoso-migration-rehost-linux-vm.md) | Shows how Contoso does a lift-and-shift migration of the Linux osTicket app to Azure VMs, using Azure Site Recovery | Available
[Article 8: Rehost a Linux app on Azure VMs and Azure MySQL](contoso-migration-rehost-linux-vm-mysql.md) | Demonstrates how Contoso migrates the Linux osTicket app to Azure VMs using Azure Site Recovery, and migrates the app database to an Azure MySQL Server instance using MySQL Workbench. | Available
[Article 9: Refactor an app on Azure Web Apps and Azure SQL database](contoso-migration-refactor-web-app-sql.md) | Demonstrates how Contoso migrates the SmartHotel app to an Azure Web App, and migrates the app database to an Azure SQL Server instance | Available
[Article 10: Refactor a Linux app on Azure Web Apps and Azure MySQL](contoso-migration-refactor-linux-app-service-mysql.md) | Shows how Contoso migrates the Linux osTicket app to an Azure Web App in multiple sites, integrated with GitHub for continuous delivery. They migrate the app database to an Azure MySQL Server instance. | Available
[Article 11: Refactor TFS on VSTS](contoso-migration-tfs-vsts.md) | Shows how Contoso migrates their on-premises Team Foundation Server (TFS) deployment by migrating it to Visual Studio Team Services (VSTS) in Azure. | Available
[Article 12: Rearchitect an app on Azure Containers and Azure SQL Database](contoso-migration-rearchitect-container-sql.md) | Shows how Contoso migrates and rearchitects their SmartHotel app to Azure. They rearchitect the app web tier as a Windows container, and the app database in an Azure SQL Database. | Available
[Article 13: Rebuild an app in Azure](contoso-migration-rebuild.md) | Shows how Contoso rebuild their SmartHotel app using a range of Azure capabilities and services, including App Services, Azure Kubernetes, Azure Functions, Cognitive Services, and Cosmos DB. | Available






### Demo apps

The articles use two demo apps - SmartHotel, and osTicket.

- **SmartHotel360**: This app was developed by Microsoft as a test app that you can use when working with Azure. It's provided as open source and you can download it from [GitHub](https://github.com/Microsoft/SmartHotel360). It's an ASP.NET app connected to a SQL Server database. Currently the app is on two VMware VMs running Windows Server 2008 R2, and SQL Server 2008 R2. The app VMs are hosted on-premises and managed by vCenter Server.
- **osTicket**: An open-source service desk ticketing app that runs on Linux. You can download it from [GitHub](https://github.com/osTicket/osTicket). Current the app is on two VMware VMs running Ubuntu 16.04 LTS, using Apache 2, PHP 7.0, and MySQL 5.7
    

## Next steps

[Learn how](contoso-migration-infrastructure.md) Contoso sets up an on-premises and Azure infrastructure to prepare for migration.



