---
title: Assess your Azure Synapse Analytics pipelines for upgrade to Fabric Data Factory
description: Learn how to assess which Azure Synapse Analytics pipelines are ready to upgrade to Fabric Data Factory.
author: ssindhub
ms.author: ssrinivasara
ms.topic: how-to
ms.date: 08/31/2026
ms.custom: pipelines
---

# Assess your Azure Synapse Analytics pipelines for upgrade to Fabric Data Factory

Use the built-in upgrade assessment to quickly check Azure Synapse Analytics pipeline readiness and identify activity compatibility issues before upgrading to Fabric.

In [Azure Synapse Analytics](https://web.azuresynapse.net), open the pipelines you'd like to assess for migration. In the Integrate hub, select **Migrate to Fabric (Preview)** > **Get started (preview)**

:::image type="content" source="media/how-to-assess-and-upgrade-your-azure-synapse-analytics-pipelines-to-fabric/start-synapse-pipelines-migration-assessment.png" alt-text="Screenshot showing how to run the Azure Synapse Analytics migration assessment." lightbox="media/how-to-assess-and-upgrade-your-azure-synapse-analytics-pipelines-to-fabric/start-synapse-pipelines-migration-assessment.png":::

This opens a side pane showing a preview of the list of pipelines in your Synapse workspace with expandable list of activities within the pipeline.

:::image type="content" source="media/how-to-assess-and-upgrade-your-azure-synapse-analytics-pipelines-to-fabric/view-synapse-pipelines-assessment-results.png" alt-text="Screenshot showing Synapse Analytics migration assessment results with option to select pipelines for migration." lightbox="media/how-to-assess-and-upgrade-your-azure-synapse-analytics-pipelines-to-fabric/view-synapse-pipelines-assessment-results.png":::

You can export both ADF and Synapse assessment results as a .csv file, which lists pipeline names, activity-level statuses, and compatibility notes.

Some results point to features that are still in progress or out of scope. Use the results to prioritize the fixes and begin migration.


## What the assessment statuses mean
You’ll see one of the four results for each pipeline (and summarized at the factory level):

[!INCLUDE [migration-assessment-statuses](includes/migration-assessment-statuses.md)]


### View activity-level compatibility for each pipeline
In the assessment side pane, expand each pipeline to see:

- Activity-level status (which activities block migration).
- A summary of Ready/Needs review/Not compatible counts across pipelines.

:::image type="content" source="media/how-to-assess-your-azure-data-factory-to-fabric-data-factory-migration/detailed-assessment-drilldown.png" alt-text="Screenshot showing a drill-down of the assessment details." lightbox="media/how-to-assess-your-azure-data-factory-to-fabric-data-factory-migration/detailed-assessment-drilldown.png":::

Use this list to build your to-do plan (what to fix, what to defer, and what to replace).


### Start migration after assessment
When your assessment shows acceptable readiness:
1. Select Next to begin the  migration flow.
1. Refer to planning guides for best practices.

## FAQ

**Why do I see Coming soon?**

Answer: It means the product team is actively adding support for those items. 
If they're critical to your pipeline, plan to migrate later when support is added, redesign the affected steps, or as an alternative use the [PowerShell upgrade tool](/fabric/data-factory/migrate-pipelines-powershell-upgrade-module-for-azure-data-factory-to-fabric) for scripted migration scenarios.

**What if only one activity is Not compatible?**

Answer: You can still migrate the pipeline after you refactor or replace that activity. The assessment helps you identify exactly where to focus.

**Can I rerun the assessment after making changes?**

Answer: Yes, you can rerun anytime to validate updates.

## Related content

[Upgrade your Azure Data Factory pipelines to Fabric (preview)](how-to-upgrade-your-azure-data-factory-pipelines-to-fabric-data-factory.md)

[Upgrade Azure Data Factory Mapping Data Flows pipelines to Fabric (preview)](/fabric/data-factory/dataflow-gen2-mapping-data-flows-transforms-upgrade)

[Upgrade your Azure Synapse Analytics pipelines to Fabric (preview)](how-to-upgrade-your-azure-synapse-analytics-pipelines-to-fabric-data-factory.md)

[Compare Azure Data Factory and Fabric Data Factory](/fabric/data-factory/compare-fabric-data-factory-and-azure-data-factory)

[Migration best practices](/fabric/data-factory/migration-best-practices)

[Connector parity](/fabric/data-factory/connector-parity)
