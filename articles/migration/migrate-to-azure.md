---
title: Migrate Workloads to Azure
description: Learn about migration resources that might help you transition workloads from AWS, Google Cloud Platform, and on-premises to Azure.
author: reginahack
ms.author: rhackenberg
ms.date: 04/23/2026
ms.topic: concept-article
ms.service: azure
ms.custom: migration-hub
ms.collection:
 - migration
 - aws-to-azure
 - gcp-to-azure
 - onprem-to-azure
---

# Migrate workloads to Azure

The Azure Migration Hub provides prescriptive, opinionated guidance to help workload teams plan and implement their migration to Azure. It covers migrations from on-premises environments and cloud platforms such as Amazon Web Services (AWS) and Google Cloud Platform (GCP).

> [!IMPORTANT]
> This content covers single-workload migrations. It doesn't cover full datacenter migrations, region relocations, or hybrid workloads that run concurrently on multiple clouds.

Migration to Azure involves networking, identity, databases, compute, storage, and the custom integrations that your team built over the years. Multiple articles and guides provide guidance for these components.

This article helps you identify which guidance applies to your situation. Based on where your workload runs today, it directs you to the right migration guide. It also explains general migration terminology and strategies.

## Who should read this article

This article helps workload architects and engineers get started with migrating workloads to Azure from AWS, GCP, or an on-premises datacenter. Use this guidance to decide whether you should rehost, replatform, or refactor.

This guidance is for:

- **Workload architects** who redesign architecture aspects and validate the overall design to meet business requirements on Azure. Architects address gaps by considering the workload's specific characteristics and business constraints.

- **Workload team members** who need to understand how their responsibilities change during and after migration. For example, database administrators who manage scripts and perform daily backups on Amazon Relational Database Service must adapt to performing the same tasks on Azure SQL Database.

This article directs you to the specific migration guide for your scenario, so you can begin planning immediately.

## Migration strategies

Migration strategies vary in risk, effort, and reward. Choose a strategy based on your workload's complexity, timeline, and desired level of change.

- **Rehost (lift and shift):** Move the workload to Azure infrastructure without code changes. This approach is fast and low risk. It works well for straightforward workloads where speed matters most. For example, you might migrate a web application from a Windows Server virtual machine (VM) to an Azure VM. You get the benefits of Azure infrastructure without changing the workload's architecture or code. You change where the web application runs, not how it runs.

- **Replatform (lift, adjust, and shift):** Make minimal changes to take advantage of Azure platform services. For example, migrate a SQL Server database to Azure SQL Managed Instance to gain operational benefits without rewriting the application.

- **Refactor:** Restructure code to improve performance, scalability, or maintainability without changing the workload's external behavior. For example, refactor a monolithic .NET application to run on Azure App Service by replacing Windows-specific file path handling, session state handling, and local disk logging. Refactoring requires more upfront effort but reduces long-term operational overhead.

- **Rearchitect:** Redesign the workload to take full advantage of Azure-native capabilities. For example, redesign a web application to use Azure Functions and Azure Cosmos DB instead of VMs and SQL Server. This approach requires significant code changes but delivers the greatest improvements in scalability, performance, and cost.

- **Retire:** Decommission workloads that you no longer need. Use this strategy for obsolete or redundant workloads, or when a software as a service (SaaS) solution can replace the functionality. For example, retire an on-premises file server after you migrate its data to Azure Files, and train users to access files on the new location.

- **Replace:** Adopt a ready-to-use cloud service instead of migrating your existing implementation. Consider this option when a SaaS solution meets your requirements better than moving the workload to Azure.

- **Rebuild:** Create a new implementation when the cost of other migration strategies outweighs the benefits. Rebuilding works well for legacy workloads that need fundamental changes to run effectively in the cloud. For example, rebuild a custom customer relationship management (CRM) system by using Dynamics 365 when the existing codebase is difficult to maintain or doesn't align well with Azure services.

- **Retain:** Keep the workload on-premises when compliance, latency, or technical constraints make migration impractical. For example, retain a legacy mainframe system that you can't easily rehost or refactor or that lacks a clear migration path to Azure.

Most workload migrations in the Azure Migration Hub use a **rehost or replatform** approach. These strategies minimize risk by keeping the workload functionally identical. Functionality should meet the same key performance indicators (KPIs), service-level agreements (SLAs), and service-level objectives (SLOs) on Azure that it met on the source platform. Complete the migration first, then optimize and modernize.

For more information, see [Select a cloud migration strategy](/azure/cloud-adoption-framework/plan/select-cloud-migration-strategy).

## The migration journey

Every migration follows five phases. Some phases overlap, and you might revisit earlier phases as you learn more about the workload's requirements, but the sequence helps you track progress.

| Phase | Tasks | Outcome |
|-------|-------------|----------------------|
| **Plan** | Assess your current workload, identify dependencies, map source services to Azure equivalents, and define success criteria. | Clear documentation of migration scope, required changes, and completion criteria. |
| **Prepare** | Set up your Azure environment, including landing zones, networking, identity, and governance. Design the target-state architecture. | Configured Azure environment ready to receive the workload, with all architectural decisions resolved before migration begins. |
| **Execute** | Migrate infrastructure, data, and application components. Perform iterative testing and cutover. | Workload components migrated to Azure. Production traffic redirected to Azure after successful validation of the workload. |
| **Evaluate** | Validate that the migrated workload meets functional, performance, security, and cost requirements against the baseline that you set in phase 1. | Confirmation that the migration succeeds and the workload runs correctly on Azure. |
| **Decommission** | Retire the source environment. Remove resources, cancel subscriptions, and shut down the old platform. | Source workload is shut down. Azure now runs the workload exclusively. |

## Migration guidance

This section lists the types of migration guidance that Azure provides. Each guide helps you plan and manage your migration.

### Cloud Adoption Framework for Azure

The [Cloud Adoption Framework for Azure](/azure/cloud-adoption-framework/migrate/plan-migration) covers organization-level planning. It describes how to structure your migration, what steps to take, and what to set up before you move workloads.

If you're new to Azure, start here. The Cloud Adoption Framework guides you through organizational preparation. It describes Azure enrollment setup, platform landing zone configuration, and migration plan prioritization. Complete these foundational steps before you move workloads.

### Azure Architecture Center

The [Azure Architecture Center](/azure/architecture/browse/) provides solution ideas, architectures, design patterns, and architecture guides for building workloads on Azure.

Most migrations involve replatforming. You move both the infrastructure and management layer from your source cloud to Azure. Not all source components have a direct Azure equivalent, so you might need to redesign parts of the architecture. The Azure Architecture Center provides an overview of [technology choices](/azure/architecture/guide/technology-choices/technology-choices-overview) and helps you find the closest match.

### Azure Well-Architected Framework

The [Azure Well-Architected Framework](/azure/well-architected/) provides principles for building reliable, secure, cost-effective, and efficient cloud systems. It includes general architecture guidance and service-specific guides for Azure services. These guides describe core best practices to help you make architectural decisions for your workload. Use them to evaluate your architecture after migration and find areas to improve.

## Start with your source platform

To get started, compare the capabilities of your workload and its services with their closest Azure counterparts. The following articles include example scenarios and service-level migration guides to illustrate the comparisons.

> [!div class="nextstepaction"]
> [Migrate from AWS to Azure](./migrate-from-aws.yml)

> [!div class="nextstepaction"]
> [Migrate from GCP to Azure](./migrate-from-google-cloud.yml)

> [!div class="nextstepaction"]
> [Migrate from on-premises to Azure](./migrate-from-on-premises.yml)

## Tools for migration

Use the following tools to support migration tasks regardless of your source platform. They help you measure migration success against business goals.

| Tool | Purpose |
|------|---------|
| [Azure Migrate and Modernize](/azure/migrate/migrate-services-overview) | Discover and assess migration assets, including infrastructure, applications, and data components. |
| Well-Architected Review assessment of the source platform | Review and measure the business goals of your architecture on the source platform. This assessment from your source cloud provider helps you set a baseline for your expectations on Azure. |
| [Azure Well-Architected Review assessment](/assessments/azure-architecture-review/) | Evaluate your architecture decisions to identify regressions from the source baseline and explore optimization opportunities. |

## Next step

The Cloud Adoption Framework covers migration sequencing, wave planning, dependency mapping, and stakeholder alignment. For organization-level planning or help choosing a migration strategy, see [Plan your migration](/azure/cloud-adoption-framework/migrate/plan-migration). 