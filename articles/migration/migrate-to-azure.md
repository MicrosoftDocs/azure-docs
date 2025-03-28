---
title: Migrate Workloads to Azure
description: Learn how to migrate workloads from AWS and Google Cloud to Azure, including planning, implementation, and optimization strategies.
author: robbyatmicrosoft
ms.author: robbymillsap
ms.date: 03/24/2025
ms.topic: conceptual
ms.custom: migration
---

# Migrate workloads to Azure from other cloud platforms

The Azure migration guide collection helps workload teams plan and implement their workload migration. It includes guidance for migrations from cloud platforms, like Amazon Web Services (AWS) and Google Cloud, to Microsoft Azure. This guidance assumes that, after you complete your migration to Azure, you decommission the workload on the source platform.

> [!IMPORTANT] 
>
> Some migration scenarios are out of scope for this collection. It doesn't cover on-premises to Azure migrations, full datacenter migrations, or region relocations. It also doesn't address workloads that concurrently run on multiple clouds.

Migration to Azure typically involves replatforming the workload, which includes transitioning both the infrastructure and management layer from the source cloud provider to Azure. During the migration process, you need to find the best match for your source components on Azure. Not all components map one-to-one. To accomplish your business objectives, you might need to redesign the architecture or revisit code to maintain functionality.

This collection provides insight into such cloud-to-cloud transitions. It compares workload components and services, and includes example migration scenarios.

## Prerequisites for workload migrations

Before you migrate workloads, ensure that you commit your organization to Azure and establish your adoption approach. We recommend that you understand the fundamental Azure concepts and have an active Azure enrollment. To achieve these goals, explore the following Cloud Adoption Framework for Azure resources:

- To learn about terms in Azure and how the concepts relate to one another, see [Azure fundamental concepts](/azure/cloud-adoption-framework/ready/considerations/fundamental-concepts).

- To develop your organization's migration plan and identify the types of workloads that you should migrate, see the training module, [Use the Cloud Adoption Framework Migrate methodology to migrate your workload to the cloud](/training/modules/cloud-adoption-framework-migrate/).

In the next phase, the workload team plans and implements the migration. They assess the current workload design, prepare a solution in Azure, make necessary code changes, and perform the migration. 

## Target audience

This collection applies to the following workload roles and functions at the team level.

- **Workload architects** who redesign various architecture aspects and validate the overall architecture to ensure that it continues to meet business requirements. Architects address gaps by considering the workload's specific characteristics and business constraints.

- **Workload team members** who need to understand how their responsibilities change during the migration process and after migration. For example, database administrators who manage scripts and perform daily backups on Amazon Relational Database Service must adapt to performing the same tasks on Azure SQL Database. 

## Content layout

The migration guide content is organized by platform, starting with your source platform. Each platform includes comparison articles. To get started, compare the capabilities of your workload and its services with their closest Azure counterparts. These articles also include example scenarios and service-level migration guides to illustrate the comparisons.

Start your learning journey based on your source platform:

> [!div class="nextstepaction"]
> [Migrate a workload from AWS](./migrate-from-aws.yml)

> [!div class="nextstepaction"]
> [Migrate a workload from Google Cloud](./migrate-from-google-cloud.yml)

This collection also includes guidance that applies to all platforms. All sections include such platform-agnostic guidance for convenience.

## Tools

In addition to content, you can explore specialized tools to assist with migration tasks or measure the success of your migration against business goals.

|Tool|Benefit|
|---|---|
|[Azure Migrate and Modernize](/azure/migrate/migrate-services-overview)| Analyze and assess migration assets, primarily infrastructure, applications, and data components. |
|Azure Well-Architected Review assessment of the source platform, if available|Review and measure the business goals of your architecture on the source platform. This assessment helps you establish a baseline for your expectations on Azure.|
|[Azure Well-Architected Review assessment](/assessments/azure-architecture-review/)| Evaluate your architecture decisions to identify any regressions from the source baseline. Also explore optimization opportunities to maximize performance on Azure.|