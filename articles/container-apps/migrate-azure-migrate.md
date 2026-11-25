---
title: Migrate to Azure Container Apps with Azure Catalyst
description: Learn how to use Azure Catalyst to discover, assess, and plan the migration of existing Web Apps to Azure Container Apps.
author: deepganguly
ms.author: deepganguly
ms.service: azure-container-apps
ms.topic: upgrade-and-migration-article
ms.date: 11/10/2026
ms.ai-usage: ai-assisted
---

# Migrate to Azure Container Apps with Azure Catalyst

[Azure Catalyst](../migrate/migrate-services-overview.md) provides a unified platform to discover, assess, plan, and migrate existing workloads to Azure. It supports workload identification, migration readiness evaluation, and planning for a move to Azure Container Apps.

Azure Catalyst currently supports discovery of Java web apps running on Apache Tomcat and .NET Web Apps running on .NET Core. Use the discovered inventory and assessment insights to understand existing web apps, identify migration requirements, and plan their transition to Azure Container Apps.

The migration workflow continues in GitHub Copilot app modernization for application-level execution, including code changes, containerization, and deployment. Azure Catalyst provides the discovery, assessment, and planning context; GitHub Copilot app modernization carries out the application migration to Azure Container Apps.

## Migration approach

Moving web apps to Azure Container Apps involves the following phases:

| Phase | Description |
| --- | --- |
| Discover | Use Azure Catalyst to inventory web apps and the servers that host them. Review dependencies to identify components that need to move together. |
| Assess | Review application readiness, migration issues, resource requirements, and available cost estimates. |
| Decide | Evaluate assessment findings and business requirements to select the apps and migration approach. |
| Plan migration | Generate a wave plan for the selected assessment and migration path, review the recommendations, and commit approved waves. |
| Migrate | Use GitHub Copilot app modernization to prepare, containerize, and deploy the applications to Azure Container Apps, then validate and switch traffic. |

## Prerequisites

The migration requires:

- An Azure subscription and the [permissions needed to use Azure Catalyst](../migrate/prepare-azure-accounts.md).
- An [Azure Catalyst project](../migrate/create-manage-projects.md).
- A configured [Azure Catalyst appliance](../migrate/migrate-appliance.md) with access to the servers that host the web apps.
- Supported web apps and the credentials required for discovery. Review the web app discovery requirements for the source [VMware](../migrate/migrate-support-matrix-vmware.md), [Hyper-V](../migrate/migrate-support-matrix-hyper-v.md), or [physical server](../migrate/migrate-support-matrix-physical.md) environment.
- Access to the application artifacts and configuration needed to prepare the apps for deployment.
- Tools to build and test a container image, and access to a container registry.
- A plan for databases, storage, messaging, and other services that the application uses.

Azure Container Apps supports Linux-based x86-64 (`linux/amd64`) container images. Review operating system and runtime dependencies as part of migration planning. Applications that depend on Windows-specific features need changes before they can run in Linux containers. For more information, see [Containers in Azure Container Apps](containers.md).

## Discover

Use an Azure Catalyst project to build an inventory of the web apps in the source environment.

1. Configure the Azure Catalyst appliance for the source environment and provide the credentials required to discover workloads.
1. Enable web app discovery and allow the appliance to collect application configuration data.
1. Review the discovered web apps, their hosting servers, and their dependencies.
1. Identify the apps to migrate together and confirm that the discovery data is complete.

In the Azure Catalyst project, use **Explore inventory** to review discovered workloads. Select **Web apps** to focus on the web app inventory.

When adding discovered workloads to an assessment, filter the workload list by **Web app** and select the apps to assess. The following example shows workload selection, not migration readiness.

:::image type="content" source="media/azure-migrate/discover-web-applications.png" alt-text="Screenshot of the Select workloads pane filtered by Web app, with discovered web applications selected for assessment." lightbox="media/azure-migrate/discover-web-applications.png":::

For guidance on the inventory views, see [Review discovered inventory in Azure Catalyst](../migrate/how-to-review-discovered-inventory.md).

For more information, see [Discover web apps in an existing Azure Catalyst project](../migrate/how-to-discover-sql-existing-project.md) and [Dependency analysis](../migrate/concepts-dependency-visualization.md).

## Assess

Assess the discovered web apps in Azure Catalyst to understand migration readiness and requirements before selecting a migration approach.

1. In the Azure Catalyst project, open **Assessments** under **Decide and Plan**, and select **Create assessment**.
1. Name the assessment, add the discovered web apps, and review the selected workloads.
1. Configure the applicable assessment settings, including target region, environment, and sizing criteria.
1. Create the assessment and review readiness, migration warnings, resource recommendations, and available cost estimates.

The **General** tab includes target and pricing settings and assessment criteria, such as sizing criteria and performance history.

:::image type="content" source="media/azure-migrate/create-assessment.png" alt-text="Screenshot of the Create assessment General tab showing target location, pricing settings, sizing criteria, and performance history." lightbox="media/azure-migrate/create-assessment.png":::

Assessment findings identify apps that are ready to move, require changes, or need further investigation. Review the findings together with operating system compatibility, dependencies, and application requirements for Container Apps.

For the assessment workflow and report details, see [Create a web app assessment](../migrate/create-web-app-assessment.md) and [Review a web app assessment](../migrate/review-web-app-assessment.md).

## Decide

Use the discovery and assessment results to decide which web apps to migrate to Azure Container Apps and which changes must be completed first.

- **Confirm suitability.** Evaluate runtime compatibility, application state, networking, security, and scaling requirements against Container Apps capabilities.
- **Evaluate business value and cost.** Compare expected operational benefits and hosting costs with the current environment. Include application changes and dependent services in the estimate. Review [Azure Container Apps billing](billing.md) for target-specific cost considerations.
- **Choose the migration approach.** Identify apps that can be containerized with limited changes and apps that require modernization before migration.
- **Set priorities.** Consider business criticality, technical complexity, dependencies, and acceptable downtime when choosing the initial migration scope.

In the assessment overview, expand **All Web applications to Azure Container Apps** to review target-specific readiness and estimated monthly costs. In the following example, the expanded section shows three apps ready for migration and one app that's not ready, with a cost estimate for the three ready apps. Estimates vary by workload and assessment settings.

:::image type="content" source="media/azure-migrate/assessment-results.png" alt-text="Screenshot of the assessment overview with the Azure Container Apps section expanded to show readiness and estimated monthly costs." lightbox="media/azure-migrate/assessment-results.png":::

Select the **Azure Container Apps** tab to review target-specific assessment details, including app readiness, estimated monthly costs, recommended plans, and migration issues or warnings.

:::image type="content" source="media/azure-migrate/assessment-details.png" alt-text="Screenshot of the Web apps to Azure Container Apps assessment details showing three ready apps, one app that's not ready, estimated monthly costs, migration issues, and per-app recommendations." lightbox="media/azure-migrate/assessment-details.png":::

Where applicable, use an [Azure Catalyst business case](../migrate/how-to-build-a-business-case.md) to support the broader investment decision. Review its scope and assumptions rather than treating estimates for other workload configurations as Container Apps cost estimates.

## Plan migration

After reviewing the assessment and selecting a migration path, use [wave planning in Azure Catalyst](../migrate/wave-plan-overview.md) to organize the assessed applications and workloads into migration batches. Azure Catalyst recommends wave assignments and sequencing based on the assessment, application mappings, and available dependency data.

1. In the Azure Catalyst project, open **Plan** > **Wave plan**.
1. Under **Planning based on assessment**, select the assessment. Under **Selected path**, select the migration path.
1. Generate a wave plan if one isn't available for the selection.
1. Review the proposed waves, recommended sequence, dependencies, risks, and estimates. Configure wave assignments if changes are needed.
1. Download the plan for review with application owners and stakeholders.
1. After approval, select **Review and commit waves**, select the approved waves, and commit them.

The following example shows a generated wave plan. Select the assessment and migration path appropriate to the Container Apps migration scope.

:::image type="content" source="../migrate/media/how-to-configure-wave-plan/wave-plan.png" alt-text="Screenshot of the Azure Migrate Wave plan page with assessment and migration path selectors, proposed waves, and actions to configure, download, and commit the plan." lightbox="../migrate/media/how-to-configure-wave-plan/wave-plan.png":::

Committing a wave accepts the plan; it doesn't start migration. Committed waves are available under **Execute** > **Waves**. For the complete workflow, see [Configure a wave plan in Azure Catalyst](../migrate/how-to-configure-wave-plan.md).

Use the approved application scope and assessment findings to prepare the handoff to GitHub Copilot app modernization described in the next section.

## Migrate

Continue the approved migration plan in [GitHub Copilot app modernization](/azure/developer/github-copilot-app-modernization/overview), using the Azure Catalyst assessment findings, application scope, and dependency information as context. The tooling handles application code changes, validation, containerization, and deployment to Azure Container Apps.

Follow the workflow for the application's language:

- **Java:** [Migrate with GitHub Copilot app modernization](migrate-java-github-copilot-app-modernization.md), including [containerization](migrate-java-github-copilot-app-modernization.md#containerize-your-application) and [deployment to Azure Container Apps](migrate-java-github-copilot-app-modernization.md#deploy-to-azure-container-apps).
- **.NET:** [GitHub Copilot modernization overview](/dotnet/azure/migration/appmod/overview) and [deployment workflow](/dotnet/azure/migration/appmod/deploy).

Review and approve the proposed actions, validate the deployed application, and complete the planned traffic cutover.

## Related content

- [Azure Catalyst overview](../migrate/migrate-services-overview.md)
- [Migrate Java applications with GitHub Copilot app modernization](migrate-java-github-copilot-app-modernization.md)
- [GitHub Copilot modernization for .NET](/dotnet/azure/migration/appmod/overview)
- [Azure Container Apps overview](overview.md)
