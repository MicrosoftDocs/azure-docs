---
title: Manage a Gen 2 environment - Azure Time Series | Microsoft Docs
description: Learn how to manage an Azure Time Series Insights Gen 2 environment.
author: tedvilutis
ms.author: tvilutis
manager: cnovak
ms.workload: big-data
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 03/15/2020
ms.custom: seodec18
---

# Manage Azure Time Series Insights Gen2

[!INCLUDE [retirement](../../includes/tsi-retirement.md)]

After you've created your Azure Time Series Insights Gen2 environment by using [the Azure CLI](./how-to-create-environment-using-cli.md) or [the Azure portal](./how-to-create-environment-using-portal.md), you can modify your access policies and other environment attributes to suit your business needs.

## Manage the environment

You can manage your Azure Time Series Insights Gen2 environment by using the [Azure portal](https://portal.azure.com/). There a few key differences between a Gen2 environment and Gen1 S1 or Gen1 S2 environments to bear in mind when you manage your environment through the Azure portal:

* The Azure portal Gen2 **Overview** pane has the following changes:

  * Capacity is removed because it doesn't apply to Gen2 environments.
  * The **Time series ID** property is added. It determines how your data is partitioned.
  * Reference data sets are removed.
  * The displayed URL directs you to the [Azure Time Series Insights Explorer](./concepts-ux-panels.md).
  * Your Azure Storage account name is listed.

* The Azure portal's **Configure** pane is removed because scale units don't apply to Azure Time Series Insights Gen2 environments. However, you can use **Storage Configuration** to configure the newly introduced warm store.

* The Azure portal's **Reference data** pane is removed in Azure Time Series Insights Gen2 because reference data concept has been replaced by [Time Series Model (TSM)](./concepts-model-overview.md).

:::image type="content" source="media/v2-update-manage/create-and-manage-overview-confirm.png" alt-text="Azure Time Series Insights Gen2 environment in the Azure portal":::

## Next steps

* Review the list of [streaming ingestion best practices](./concepts-streaming-ingestion-event-sources.md#streaming-ingestion-best-practices)
* Understand how to [diagnose and troubleshoot](./how-to-diagnose-troubleshoot.md)
