---
title: Overview of ingestion-time transformations in Azure Monitor Logs
description: This article describes ingestion-time transformations which allow you to filter and transform data before it's stored in a Log Analytics workspace in Azure Monitor.
ms.topic: conceptual
ms.date: 01/19/2022
---

# Ingestion-time transformations in Azure Monitor Logs (preview)
[Ingestion-time transformations](ingestion-time-transformations.md) allow you to manipulate incoming data before it's stored in a Log Analytics workspace. You can add data filtering, parsing and extraction, and control the structure of the data that gets ingested.

[!INCLUDE [Sign up for preview](../../../includes/azure-monitor-custom-logs-signup.md)]

## Basic operation
The transformation is a [KQL query](../essentials/data-collection-rule-transformations.md) that runs against the incoming data and modifies it before it's stored in the workspace. Transformations are defined separately for each table in the workspace. This article provides an overview of this feature and guidance for further details and samples. Configuration for ingestion-time transformation is stored in a workspace transformation DCR. You can either [create this DCR directly](tutorial-ingestion-time-transformations-api.md) or configure transformation [through the Azure portal](tutorial-ingestion-time-transformations.md). 

## Supported workflows
Ingestion-time transformation is applied to any workflow that doesn't currently use a [data collection rule](../essentials/data-collection-rule-overview.md) to send data to a [supported table](tables-feature-support.md). Any transformation on a workspace will be ignored for these workflows.

The workflows that currently use data collection rules are as follows:

- [Azure Monitor agent](../agents/data-collection-rule-azure-monitor-agent.md)
- [Custom logs](../logs/custom-logs-overview.md)

## Supported tables
See [Supported tables for ingestion-time transformations](tables-feature-support.md) for a complete list of tables that support ingestion-time transformations.

## Configure ingestion-time transformation
See the following tutorials for a complete walkthrough of configuring ingestion-time transformation.

- [Azure portal](../logs/tutorial-ingestion-time-transformations.md)
- [Resource Manager templates and REST API](../logs/tutorial-ingestion-time-transformations-api.md)


## Limits

- Transformation queries use a subset of KQL. See [Supported KQL features](../essentials/data-collection-rule-transformations.md#supported-kql-features) for details.

## Next steps

- [Get details on transformation queries](../essentials/data-collection-rule-transformations.md)
- [Walk through configuration of ingestion-time transformation using the Azure portal](tutorial-ingestion-time-transformations.md)
- [Walk through configuration of ingestion-time transformation using Resource Manager templates and REST API](tutorial-ingestion-time-transformations.md)
