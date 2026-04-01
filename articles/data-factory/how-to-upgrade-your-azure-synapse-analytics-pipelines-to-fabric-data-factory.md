---
title: Modernize your Azure Synapse Analytics pipelines with Fabric
description: Learn how to assess and upgrade your Azure Synapse Analytics pipelines to Fabric Data Factory.
author: ssindhub
ms.author: ssrinivasara
ms.topic: how-to
ms.date: 03/15/2026
ms.custom: pipelines
ai-usage: ai-assisted
---

# Upgrade your Azure Synapse Analytics pipelines to Fabric (preview)

Modernizing your workflows in Microsoft Fabric often starts with bringing your existing Azure Synapse Analytics pipelines forward. The migration experience helps you assess pipeline readiness, understand compatibility gaps, and migrate supported pipelines into a Fabric workspace—so you can move in a controlled, low-risk way.

## What you can do with the migration experience

With the Synapse pipelines migration experience, you can:

- Assess pipeline readiness directly in your Synapse workspace.
- See compatibility gaps at the pipeline and activity level.
- Migrate supported pipelines to a Fabric workspace.
- Export assessment and migration results to CSV to plan upgrade, remediation, and phased validation.

## Prerequisites

Before you start:

- You have an **Azure Synapse Analytics workspace** that contains pipelines.
- You have access to a **Microsoft Fabric tenant** and a **Fabric workspace**.

## Migrate Spark items to Fabric first

If your Synapse pipelines include Notebook and/or Spark job definition (SJD) activities, migrate those Spark artifacts to Fabric first. This separation ensures the pipeline migration experience can map those activities to the correct Fabric items instead of leaving them unmapped.

Use the  [Synapse-to-Fabric Spark Migration Assistant](/fabric/data-engineering/synapse-to-fabric-spark-migration-assistant) to migrate Spark-related items from your Synapse workspace into a Fabric workspace.

## Migrate Synapse pipelines

After creating your Spark artifacts in Fabric, migrate pipelines using the Synapse pipelines migration experience.

When the pipelines migration runs:

- If matching Fabric notebooks/SJDs already exist, the migration can map the corresponding activities to those Fabric items.
- If the target Fabric notebooks/SJDs don’t exist yet, those activities could be left unmapped/deactivated until you create the required Fabric items and update the reference.

To migrate your Synapse pipelines to Fabric:

1. [Run an assessment in Azure Synapse Analytics](#run-an-assessment-in-azure-synapse-analytics)
1. [Select pipelines to migrate](#select-pipelines-to-migrate)
1. [Map linked services to Fabric connections](#map-linked-services-to-fabric-connections)
1. [Complete migration](#complete-migration)

### Run an assessment in Azure Synapse Analytics

1. In **Azure Synapse Analytics**, open the workspace you want to assess.
1. In the **Integrate** hub, select **Migrate to Fabric (Preview)**, then select **Get started**.
1. Review the [assessment](#understand-assessment-statuses) pane. Expand pipelines to see activity-level details.
1. (Optional) Export assessment results as a **.csv** file to support offline planning and remediation.

:::image type="content" source="media/how-to-assess-and-upgrade-your-azure-synapse-analytics-pipelines-to-fabric/start-synapse-pipelines-migration-assessment.png" alt-text="Screenshot showing how to run the Azure Synapse Analytics migration assessment." lightbox="media/how-to-assess-and-upgrade-your-azure-synapse-analytics-pipelines-to-fabric/start-synapse-pipelines-migration-assessment.png":::

#### Understand assessment statuses

Each pipeline is categorized using one of the following statuses:

| Status | What it means |
|---|---|
| **Ready** | Good to go for migration. |
| **Needs review** | Changes are required before/after migration. |
| **Coming soon** | Support is in progress; migrate later. |
| **Unsupported / Not compatible** | No equivalent in Fabric; refactor required. |

### Select pipelines to migrate

After reviewing results, select the Synapse pipelines you want to migrate to your Fabric workspace.

:::image type="content" source="media/how-to-assess-and-upgrade-your-azure-synapse-analytics-pipelines-to-fabric/view-synapse-pipelines-assessment-results.png" alt-text="Screenshot showing Synapse Analytics migration assessment results with option to select pipelines for migration." lightbox="media/how-to-assess-and-upgrade-your-azure-synapse-analytics-pipelines-to-fabric/view-synapse-pipelines-assessment-results.png":::

A phased approach works well:

- Start with **Ready** pipelines to validate end-to-end behavior.
- Then address **Needs review** items and rerun assessment to confirm progress.

### Map linked services to Fabric connections

In the migration flow, select a destination **Fabric workspace**, then map **Synapse linked services** to **Fabric connections**.

- If you already created the required Fabric connections, select them from the dropdown.
- Otherwise, create new Fabric connections from workspace settings.

For guidance on creating and managing connections in Fabric, see: [Data source management in Fabric](/fabric/data-factory/data-source-management).

:::image type="content" source="media/how-to-assess-and-upgrade-your-azure-synapse-analytics-pipelines-to-fabric/synapse-linked-service-to-connection-mapping.png" alt-text="Screenshot showing Fabric migration workspace selection followed by Synapse linked services to Fabric connection mapping." lightbox="media/how-to-assess-and-upgrade-your-azure-synapse-analytics-pipelines-to-fabric/synapse-linked-service-to-connection-mapping.png":::

> [!IMPORTANT]
> Pipelines can migrate even if you don’t map connections, but **activities that use those connections remain deactivated** until you configure them in Fabric and reactivate them.

### Complete migration

After you map linked services to Fabric connections, select **Confirm** to complete migration.

:::image type="content" source="media/how-to-assess-and-upgrade-your-azure-synapse-analytics-pipelines-to-fabric/successful-migration-completion.png" alt-text="Screenshot showing successful migration." lightbox="media/how-to-assess-and-upgrade-your-azure-synapse-analytics-pipelines-to-fabric/successful-migration-completion.png":::

After migration completes, go to your Fabric workspace to review the migrated pipelines. Each pipeline is created under the workspace and prefixed with its source factory name.

> [!NOTE]
> Pipelines migrate safely with **triggers disabled by default**, so you stay in control of execution.

## Post-migration validation

After migration:

1. Validate connections and credentials.
2. Re-enable and configure triggers as needed (triggers are disabled by default).
3. Run end-to-end tests to confirm behavior.
4. Validate in a nonproduction environment before switching production workloads.

## Related migration resources

Use these resources to round out your end-to-end Synapse-to-Fabric migration plan:

- [Assess your Azure Data Factory and Synapse pipelines for migration to Fabric](/azure/data-factory/how-to-assess-your-azure-data-factory-to-fabric-data-factory-migration)
- [Upgrade your Azure Data Factory pipelines to Fabric](/azure/data-factory/how-to-upgrade-your-azure-data-factory-pipelines-to-fabric-data-factory)
- [Migration Assistant for Fabric Data Warehouse - Microsoft Fabric | Microsoft Learn](/fabric/data-warehouse/migration-assistant)
- [Synapse-to-Fabric Spark Migration Assistant](/fabric/data-engineering/synapse-to-fabric-spark-migration-assistant)
