---
title: Workspace transformation data collection rule (DCR) in Azure Monitor
description: Create a transformation for data not being collected using a data collection rule (DCR).
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 03/22/2024
ms.reviwer: nikeist
---

# Workspace transformation data collection rule (DCR) in Azure Monitor

The *workspace transformation data collection rule (DCR)* is a special [DCR](./data-collection-rule-overview.md) that's applied directly to a Log Analytics workspace. The purpose of this DCR is to perform [transformations](./data-collection-transformations.md) on data that does not yet use a DCR for its data collection, and thus has no means to define a transformation.

The workspace transformation DCR includes transformations for one or more supported tables in the workspace. These transformations are applied to any data sent to these tables unless that data came from another DCR. For example, if you create a transformation in the workspace transformation DCR for the Event table, it would be applied to events collected by virtual machines running the Log Analytics agent because this agent doesn't use a DCR. The transformation would be ignored by any data sent from Azure Monitor Agent because it uses a DCR and would be expected to provide its own transformation.

A common use of the workspace transformation DCR is collection of [resource logs](./resource-logs.md) that are configured with a [diagnostic setting](./diagnostic-settings.md). You might want to apply a transformation to this data to filter out records that you don't require. Since diagnostic settings don't have transformations, you can use the workspace transformation DCR to apply a transformation to this data.

:::image type="content" source="media/data-collection-transformations/transformation-workspace.png" lightbox="media/data-collection-transformations/transformation-workspace.png" alt-text="Diagram that shows operation of the workspace transformation DCR." border="false":::

## Supported tables
See [Tables that support transformations in Azure Monitor Logs](../logs/tables-feature-support.md) for a list of the tables that can be used with transformations. You can also use the [Azure Monitor data reference](/azure/azure-monitor/reference/) which lists the attributes for each table, including whether it supports transformations. In addition to these tables, any custom tables (suffix of *_CL*) are also supported.

## Create a workspace transformation

See the following tutorials for creating a workspace transformation DCR:

- [Add workspace transformation to Azure Monitor Logs by using the Azure portal](../logs/tutorial-workspace-transformations-portal.md)
- [Add workspace transformation to Azure Monitor Logs by using Resource Manager templates](../logs/tutorial-workspace-transformations-api.md) 


## Next steps

- [Use the Azure portal to create a workspace transformation DCR.](../logs/tutorial-workspace-transformations-api.md)
- [Use ARM templates to create a workspace transformation DCR.](../logs/tutorial-workspace-transformations-portal.md)

