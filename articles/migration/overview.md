---
title: Migrate workloads to Azure
description: Before you migrate workloads, start with a strong foundation in Azure.
author: robbyatmicrosoft
ms.author: robbymillsap
ms.date: 03/24/2025  
ms.topic: conceptual
---

# Migrate workloads to Azure from other clouds


This collection has been curated to assist workload teams in planning and executing the migration of their workloads. It covers migrations from cloud platforms like Amazon Web Services (AWS) and Google Cloud to Microsoft Azure. The expected outcome is that the source system is shut down and it runs on Azure, after the migration is complete. It doesn't cover on-premises to Azure migrations, data center migrations, or region relocations. Additionally, it doesn't address running workloads on multiple clouds or its coexistence on both platforms simultaneously.

Migration to Azure typically involves replatforming the workload, which includes transitioning both the infrastructure and management layer. Finding the best match for your source on Azure is an important step in the migration process. Keep in mind that not all components map one-to-one. You'll need to redesign the architecture to maintain functionality to accomplish your business objectives. This collection offers insights into such cloud-to-cloud transitions by comparing workload components and services, supported with example migration scenarios.


## Prerequisite to workload migration

Workloads can be migrated only after the organization is fully committed to Azure. Before migrating workloads, we recommend that you understand the fundamental concepts on Azure and have an active Azure enrollment. Explore these Cloud Adoption Framework (CAF) resources to achieve those goals:

- [Azure fundamental concepts](/azure/cloud-adoption-framework/ready/considerations/fundamental-concepts). Learn about terms used in Azure, and how the concepts relate to one another.

- [Use the Cloud Adoption Framework Migrate methodology to migrate your workload to the cloud](/training/modules/cloud-adoption-framework-migrate/). Complete the learning objectives in the training module to develop your organization's migration plan and identify the types of workloads that need to be migrated.

The next step involves the workload team planning and executing the migration. This includes assessing the current workload design, preparing a solution in Azure, making necessary code changes, and performing the migration. 


## Target audience

The content is applicable to workload roles and functions at the team level.

- **Workload architect**. They might redesign certain aspects and validate the overall architecture to ensure it meets business requirements. Architects must address gaps considering the workload's specific characteristics and business constraints.

- **Workload team members**. They must understand how their responsibilities will change during the migration process and post migration. For example, database administrators (DBAs) who manage scripts and perform daily backups on RDS must adapt to performing these tasks on Azure SQL Database. 


## Content layout

The content is organized by platform, starting with your source platform. Within each platform, you'll find a comparison sheet to help you get started on comparing the capabilities of your workload and the services used in it. Additionally, example scenarios are provided to illustrate the comparisons. 

We recommend starting your learning journey based on your source platform:

> [!div class="nextstepaction"]
> [Migrate a workload from Amazon Web Services (AWS)](./migrate-from-aws.md)


> [!div class="nextstepaction"]
> [Migrate a workload from Google Cloud](./migrate-from-google-cloud.md)

You'll also find guidance that's applicable to all platforms. Such platform-agnostic guidance is included in all sections for convenience.

> [!NOTE] 
>
> Keep checking for updates regularly. We're constantly incorporating new technology stacks and example scenarios.

## Tools

In addition to content, there are specialized tools to assist with migration tasks or might be helpful in measuring the success of the migration against business goals.

|Tools|Use this to...|
|---|---|
|[Azure Migrate](/azure/migrate/migrate-services-overview)| Perform discovery and assessment of migration assets, primarily for infrastructure, applications, and data components. |
|[Azure SQL Migration for Azure Data Studio](/azure/dms/migration-using-azure-data-studio?tabs=azure-sql-mi)| Simplify the process of migrating SQL Server databases to Azure. This tool also provides recommendations for migration, including compatibility checks and performance assessments.|
|Well-Architected Review assessment of the source platform, if available.|Review and measure the business goals of your architecture on the source platform. This will help you baseline your expectations on Azure.|
|[Microsoft Azure Well-Architected Review assessment](/assessments/azure-architecture-review/)| Evaluate your architecture decisions to identify any regressions from the source baseline. Also explore optimization opportunities to get the best on Azure.|