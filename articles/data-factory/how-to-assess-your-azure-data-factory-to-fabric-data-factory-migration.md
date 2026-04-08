---
title: Assess your Azure Data Factory and Synapse pipelines for migration to Fabric
description: Learn how to check which pipelines are ready to migrate and which ones need attention 
author: ssindhub
ms.author: ssrinivasara
ms.topic: article
ms.date: 03/30/2026
ms.custom: pipelines
---

# Assess your Pipelines for Migration to Fabric Data Factory
Use the built-in upgrade assessment to quickly check pipeline readiness and identify activity compatibility issues before migrating to Fabric.

## Assess your Azure Data Factory pipelines for migration

In [Azure Data Factory](https://adf.azure.com), open the factory you'd like to assess for migration. On the authoring canvas toolbar select **Migrate to Fabric (Preview)** > **Get started (preview)** to evaluate pipelines and activities for migration readiness.

:::image type="content" source="media/how-to-assess-and-upgrade-your-azure-data-factory-pipelines-to-fabric/migrate-to-fabric-get-started.png" alt-text="Screenshot showing how to run the Azure Data Factory migration assessment." lightbox="media/how-to-assess-and-upgrade-your-azure-data-factory-pipelines-to-fabric/migrate-to-fabric-get-started.png":::

This opens a side pane showing a preview of the list of pipelines in your data factory with expandable list of activities within the pipeline.

:::image type="content" source="media/how-to-assess-and-upgrade-your-azure-data-factory-pipelines-to-fabric/assessment-results.png" alt-text="Screenshot showing the Azure Data Factory migration assessment results." lightbox="media/how-to-assess-and-upgrade-your-azure-data-factory-pipelines-to-fabric/assessment-results.png":::

## Assess your Azure Synapse Analytics pipelines for migration

In [Azure Synapse Analytics](https://web.azuresynapse.net), open the pipelines you'd like to assess for migration. In the Integrate hub, select **Migrate to Fabric (Preview)** > **Get started (preview)**

:::image type="content" source="media/how-to-assess-and-upgrade-your-azure-synapse-analytics-pipelines-to-fabric/start-synapse-pipelines-migration-assessment.png" alt-text="Screenshot showing how to run the Azure Synapse Analytics migration assessment." lightbox="media/how-to-assess-and-upgrade-your-azure-synapse-analytics-pipelines-to-fabric/start-synapse-pipelines-migration-assessment.png":::

This opens a side pane showing a preview of the list of pipelines in your Synapse workspace with expandable list of activities within the pipeline.

:::image type="content" source="media/how-to-assess-and-upgrade-your-azure-synapse-analytics-pipelines-to-fabric/view-synapse-pipelines-assessment-results.png" alt-text="Screenshot showing Synapse Analytics migration assessment results with option to select pipelines for migration." lightbox="media/how-to-assess-and-upgrade-your-azure-synapse-analytics-pipelines-to-fabric/view-synapse-pipelines-assessment-results.png":::

You can export both ADF and Synapse assessment results as a .csv file, which lists pipeline names, activity-level statuses, and compatibility notes.

Some results point to features that are still in progress or out of scope. Use the results to prioritize the fixes and begin migration.


## Understand the results
You’ll see one of the four results for each pipeline (and summarized at the factory level):

| Status            | Meaning                                                 |
|-------------------|---------------------------------------------------------|
| **Ready**         | Good to go for migration                                |
| **Needs review**  | Requires changes before migration eg: Global parameters |
| **Coming soon**   | Support in progress; migrate later                      |
| **Not compatible**| No equivalent in Fabric; refactor required              |


### Drill into details
In the assessment side pane, expand each pipeline to see:

- Activity‑level status (which activities block migration).
- A summary of Ready/Needs review/Not compatible counts across pipelines.

:::image type="content" source="media/how-to-assess-your-azure-data-factory-to-fabric-data-factory-migration/detailed-assessment-drilldown.png" alt-text="Screenshot showing a drill-down of the assessment details." lightbox="media/how-to-assess-your-azure-data-factory-to-fabric-data-factory-migration/detailed-assessment-drilldown.png"::::::

Use this list to build your to‑do plan (what to fix, what to defer, and what to replace).


### Next steps
When your assessment shows acceptable readiness:
1. Select Next to begin the  migration flow.
1. Refer to planning guides for best practices.

## FAQ
**Does the assessment change my factory?**

Answer: No. It only scans your configuration and lists findings in the side pane. You can safely run it to understand impact before migration.

**Why do I see Coming soon?**

Answer: It means the product team is actively adding support for those items. 
If they’re critical to your pipeline, see if you could use [PowerShell upgrade tool](/fabric/data-factory/migrate-pipelines-powershell-upgrade-module-for-azure-data-factory-to-fabric) or plan to migrate later or redesign the affected steps.

**What if only one activity is Not compatible?**

Answer: You can still migrate the pipeline after you refactor or replace that activity. The assessment helps you identify exactly where to focus.

**Can I rerun the assessment after making changes?**

Answer: Yes, you can rerun anytime to validate updates.

## Related content

[Upgrade your Azure Data Factory pipelines to Fabric (preview)](how-to-upgrade-your-azure-data-factory-pipelines-to-fabric-data-factory.md)

[Upgrade your Azure Synapse Analytics pipelines to Fabric (preview)](how-to-upgrade-your-azure-synapse-analytics-pipelines-to-fabric-data-factory.md)

[Compare Azure Data Factory and Fabric Data Factory](/fabric/data-factory/compare-fabric-data-factory-and-azure-data-factory)

[Migration best practices](/fabric/data-factory/migration-best-practices)

[Connector parity](/fabric/data-factory/connector-parity)


