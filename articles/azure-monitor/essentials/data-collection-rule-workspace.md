---
title: Workspace transformation DCR in Azure Monitor 
description: Monitoring data collected by Azure Monitor is separated into metrics that are lightweight and capable of supporting near real-time scenarios and logs that are used for advanced analysis.
ms.topic: conceptual
ms.date: 03/18/2024
---

# Workspace transformation DCR in Azure Monitor 

The diagram below shows data collection for [resource logs](resource-logs.md) using a [workspace transformation DCR](data-collection-transformations.md#workspace-transformation-dcr). This is a special DCR that's associated with a workspace and provides a default transformation for [supported tables](../logs/tables-feature-support.md). This transformation is applied to any data sent to the table that doesn't use another DCR. The example here shows resource logs using a diagnostic setting, but this same transformation could be applied to other data collection methods such as Log Analytics agent or Container insights.

:::image type="content" source="media/data-collection-transformations/transformation-diagnostic-settings.png" lightbox="media/data-collection-transformations/transformation-diagnostic-settings.png" alt-text="Diagram showing data collection for resource logs using a transformation in the workspace transformation DCR." border="false":::

See [Workspace transformation DCR](data-collection-transformations.md#workspace-transformation-dcr) for details about workspace transformation DCRs and links to walkthroughs for creating them.

## Workspace transformation DCR
The workspace transformation DCR is a special DCR that's applied directly to a Log Analytics workspace. It includes default transformations for one or more [supported tables](../logs/tables-feature-support.md). These transformations are applied to any data sent to these tables unless that data came from another DCR.

For example, if you create a transformation in the workspace transformation DCR for the `Event` table, it would be applied to events collected by virtual machines running the [Log Analytics agent](../agents/log-analytics-agent.md) because this agent doesn't use a DCR. The transformation would be ignored by any data sent from [Azure Monitor Agent](../agents/azure-monitor-agent-overview.md) because it uses a DCR and would be expected to provide its own transformation.

A common use of the workspace transformation DCR is collection of [resource logs](resource-logs.md) that are configured with a [diagnostic setting](diagnostic-settings.md). The following example shows this process.

:::image type="content" source="media/data-collection-transformations/transformation-diagnostic-settings.png" lightbox="media/data-collection-transformations/transformation-diagnostic-settings.png" alt-text="Diagram that shows workspace transformation for resource logs configured with diagnostic settings." border="false":::

## Next steps

- Read more about [data collection rules](data-collection-rule-overview.md).
- Read more about [transformations](data-collection-transformations.md).

