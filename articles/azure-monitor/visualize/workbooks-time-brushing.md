---
title: Azure Workbooks time brushing
description: Learn about time brushing in Azure Monitor workbooks.
services: azure-monitor
ms.topic: conceptual
ms.date: 01/08/2024
ms.author: abbyweisberg
---

# Time range brushing 

Time range brushing allows a user to "brush" or "scrub" a range on a chart and have that range output as a parameter value.

:::image type="content" source="media/workbooks-configurations/workbooks-timebrush-metrics-settings.png" alt-text="Screenshot that shows workbook time-brush settings.":::

You can also choose to only export a parameter when a range is explicitly brushed:

 - If this setting is cleared (default), the parameter always has a value. When the parameter isn't brushed, the value is the full time range displayed in the chart.
 - If this setting is selected, the parameter has no value before the user brushes the parameter. The value is only set after a user brushes the parameter.

## Brushing in a metrics chart

When you enable time brushing on a metrics chart, you can "brush" a time by dragging the mouse on the time chart.

:::image type="content" source="media/workbooks-configurations/workbooks-timebrush-metrics-brushing.png" alt-text="Screenshot of a metrics time-brush in progress.":::

After the brush has stopped, the metrics chart zooms in to that range and exports the range as a time range parameter.
An icon on the toolbar in the upper-right corner is active to reset the time range back to its original, unzoomed time range.

## Brushing in a query chart

When you enable time brushing on a query chart, indicators appear that you can drag, or you can brush a range on the time chart.

:::image type="content" source="media/workbooks-configurations/workbooks-timebrush-query-brushing.png" alt-text="Screenshot of time-brushing a query chart.":::

After the brush has stopped, the query chart shows that range as a time range parameter but won't zoom in. This behavior is different than the behavior of metrics charts. Because of the complexity of user-written queries, it might not be possible for workbooks to correctly update the range used by the query in the query content directly. If the query is using a time range parameter, it's possible to get this behavior by using a [global parameter](workbooks-parameters.md#global-parameters) instead.

An icon on the toolbar in the upper-right corner is active to reset the time range back to its original, un-zoomed time range.
