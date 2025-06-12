---
title: Migrate Workloads to Azure
description: Learn about migration resources that might help you transition workloads from AWS and Google Cloud to Azure.
author: robbyatmicrosoft
ms.author: robbymillsap
ms.date: 03/24/2025
ms.topic: conceptual
ms.custom: migration
---

# Migrate workloads to Azure from other cloud platforms

This content collection is curated to help workload teams plan and implement their workload migration. It covers migrations from cloud platforms, like Amazon Web Services (AWS) and Google Cloud Platform (GCP), to Microsoft Azure. The expected outcome is that, after you complete your migration to Azure, you decommission the workload on the source platform.

> [!IMPORTANT] 
>
> Some migration scenarios are out of scope for this collection. It doesn't cover on-premises to Azure migrations, full datacenter migrations, or region relocations. It also doesn't address workloads that concurrently run on multiple clouds.

Migration to Azure typically involves _replatforming the workload_, which includes transitioning both the infrastructure and management layer from the source cloud provider to Azure. To prepare for the migration process, you need to find the best match for your source components on Azure. Keep in mind that not all components have direct equivalents. You'll need to redesign the architecture or revisit code to maintain functionality and accomplish your business objectives. This collection offers comparisons of the typical workload components and platform services, and includes example migration scenarios.

## Prerequisites for workload migrations

Workloads should be migrated only after the organization is committed to Azure and have established their approach for adopting Azure. Before migrating workloads, we recommend that you understand the fundamental concepts on Azure and have an active Azure enrollment. Explore these Cloud Adoption Framework (CAF) resources to achieve these goals:

- Learn about terms used in Azure and how the concepts relate to one another.

  [**Azure fundamental concepts**](/azure/cloud-adoption-framework/ready/considerations/fundamental-concepts)

- Complete the learning objectives in the training module to develop your organization's migration plan and identify the types of workloads that need to be migrated.

  [**Learn about the Cloud Adoption Framework Migrate methodology**](/training/modules/cloud-adoption-framework-migrate/)

In the next phase, the workload team plans and implements the migration. They assess the current workload design, prepare a solution in Azure, make necessary code changes, and perform the migration. 

## Target audience

This collection applies to the following workload roles and functions at the team level.

- **Workload architects** who might redesign various architecture aspects and validate the overall architecture to ensure that it continues to meet business requirements. Architects address gaps by considering the workload's specific characteristics and business constraints.

- **Workload team members** who need to understand how their responsibilities change during the migration process and after migration. For example, database administrators who manage scripts and perform daily backups on Amazon Relational Database Service must adapt to performing the same tasks on Azure SQL Database. 

## Content layout

The migration guide content is categorized by the source platform on which your workload currently runs. Each category includes comparison articles. To get started, compare the capabilities of your workload and its services with their closest Azure counterparts. These articles also include example scenarios and service-level migration guides to illustrate the comparisons.

Start your learning journey based on your source platform:

> [!div class="nextstepaction"]
> [Migrate a workload from AWS](./migrate-from-aws.yml)

> [!div class="nextstepaction"]
> [Migrate a workload from GCP](./migrate-from-google-cloud.yml)

This collection also includes articles that apply to all platforms. All sections include such platform-agnostic articles for convenience.

## Tools

In addition to content, you can explore specialized tools to assist with migration tasks or measure the success of your migration against business goals.

|Tool|Purpose|
|---|---|
|[Azure Migrate and Modernize](/azure/migrate/migrate-services-overview)| Discover and assess migration assets, primarily infrastructure, applications, and data components. |
|Well-Architected Review assessment of the source platform, if available| Review and measure the business goals of your architecture on the source platform. This assessment helps you establish a baseline for your expectations on Azure.|
|[Azure Well-Architected Review assessment](/assessments/azure-architecture-review/)| Evaluate your architecture decisions to identify any regressions from the source baseline. Also explore optimization opportunities to get the best on Azure.|