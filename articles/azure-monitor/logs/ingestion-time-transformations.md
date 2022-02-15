---
title: Overview of ingestion-time transformations in Azure Monitor Logs
description: This article describes ingestion-time transformations which allow you to filter and transform data before it's stored in a Log Analytics workspace in Azure Monitor.
ms.subservice: logs
ms.topic: conceptual
ms.date: 01/19/2022
---

# Adding Ingestion-time Transformation to Azure Monitor Logs
[Ingestion-time transformations](ingestion-time-transformations.md) allow you to manipulate incoming data before it's stored in a Log Analytics workspace. You can add data filtering, parsing and extraction, and control the structure of the data that gets ingested. 


## Basic operation
Configuration for ingestion-time transformation is stored in a workspace transformation DCR. You can either [create this DCR directly](tutorial-ingestion-time-transformations-api.md) or configure transformation [through the Azure portal](tutorial-ingestion-time-transformations.md). The transformation is a [KQL query](../essentials/data-collection-rule-transformations.md) that runs against the incoming data and modifies it before it's stored in the workspace. Transformations are defined separately for each table in the workspace.

:::image type="content" source="media/ingestion-time-transformations/dcr-workspace.png" lightbox="media/ingestion-time-transformations/dcr-workspace.png" alt-text="Overview of workspace transformation DCR":::

## Workflows supporting ingestion-time transformation
Ingestion-time transformation is applied to any workflow that doesn't currently use a data collection rule sending data to a [supported table](ingestion-time-transformations-supported-tables.md). The workflows that currently use data collection rules are as follows. The transformation will not be applied to these workflows.

- [Azure Monitor agent](../agents/data-collection-rule-azure-monitor-agent.md)
- [Custom logs](../logs/custom-logs-overview.md)

## Tables supporting ingestion-time transformation
See [Supported tables for ingestion-time transformations](ingestion-time-transformations-supported-tables.md) for a complete list of tables that support ingestion-time transformations.

## Configure ingestion-time transformation
See the following tutorials for a complete walkthrough of configuring ingestion-time transformation.

- [Azure portal](../logs/tutorial-ingestion-time-transformations.md)
- [Resource manager templates and REST API](../logs/tutorial-ingestion-time-transformations-api.md)


## Next steps


