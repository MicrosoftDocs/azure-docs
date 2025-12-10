---
title: Assess your Azure Data Factory pipelines for migration to Fabric
description: Learn how to check which pipelines are ready to migrate and which ones need attention 
author: ssindhub
ms.author: ssrinivasara
ms.topic: article
ms.date: 12/02/2025
ms.custom: pipelines
---

# How to assess your Azure Data Factory to Fabric Data Factory Migration
Use the built-in upgrade assessment to quickly check pipeline readiness and identify activity compatibility issues before migrating to Fabric.

In [Azure Data Factory](https://adf.azure.com), open the factory you'd like to assess for migration. On the authoring canvas toolbar, select Start assessment (preview).
> [!NOTE]
> If you are unable to see the banner where the "Start assesssment" button is located, try clearing your browser cache and cookies. This often resolves display issues.

:::image type="content" source="media/how-to-assess-your-azure-data-factory-to-fabric-data-factory-migration/run-upgrade-assessment.png" alt-text="Screenshot showing how to run the Assessment tool.":::

This opens a side pane with the preview of list of pipelines and expandable list of activities within the pipeline.

:::image type="content" source="media/how-to-assess-your-azure-data-factory-to-fabric-data-factory-migration/pipeline-assessment.png" alt-text="Screenshot showing how to view the assessment in the side pane.":::

You can export the assessment results as a .csv file, which lists pipeline names, activity-level statuses, and compatibility notes.

Some results point to features that are still in progress or out of scope. Use the results to prioritize the fixes and to decide whether to migrate now using existing tools such as [PowerShell upgrade module](/fabric/data-factory/migrate-pipelines-powershell-upgrade-module-for-azure-data-factory-to-fabric) or wait for upcoming support.


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

 :::image type="content" source="media/how-to-assess-your-azure-data-factory-to-fabric-data-factory-migration/detailed-assessment-drilldown.png" alt-text="Diagram showing a drill-down of the assessment details.":::
  
Use this list to build your to‑do plan (what to fix, what to defer, and what to replace).

> [!VIDEO https://learn.microsoft.com/_themes/docs.theme/master/en-us/_themes/global/video-embed-one-stream.html?id=2333b246-4581-44d0-b080-cb1dcb9f6e60]

### Next steps
When your assessment shows acceptable readiness:
1. Use migration flow when available in the future.
1. Use [PowerShell upgrade tool](/fabric/data-factory/migrate-pipelines-powershell-upgrade-module-for-azure-data-factory-to-fabric) for early migration.
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

[Compare Azure Data Factory and Fabric Data Factory](/fabric/data-factory/compare-fabric-data-factory-and-azure-data-factory)

[Migration best practices](/fabric/data-factory/migration-best-practices)

[Connector parity](/fabric/data-factory/connector-parity)


