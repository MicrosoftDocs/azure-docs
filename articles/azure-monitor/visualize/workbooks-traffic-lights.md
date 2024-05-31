---
title: Azure Workbooks visual indicators and icons 
description: Learn about all how to create visual indicators and icons, such as traffic lights in Azure Monitor Workbooks. 
services: azure-monitor
ms.topic: conceptual
author: AbbyMSFT
ms.author: abbyweisberg
ms.date: 01/08/2024
---

# Visual indicators and icons

You can summarize status by using a simple visual indication instead of presenting the full range of data values. For example, you can categorize your computers by CPU utilization as cold, warm, or hot and categorize performance as satisfied, tolerated, or frustrated. You can use an indicator or icon that represents the status next to the underlying metric.

:::image type="content" source="media/workbooks-commonly-used-components/workbooks-traffic-light-sample.png" alt-text="Screenshot that shows a grid with traffic light status by using thresholds.":::

## Create a traffic light icon

The following example shows how to set up a traffic light icon per computer based on the CPU utilization metric.

1. [Create a new empty workbook](workbooks-create-workbook.md).
1. [Add a parameter](workbooks-create-workbook.md#add-parameters), make it a [time range parameter](workbooks-time.md), and name it **TimeRange**.
1. Select **Add query** to add a log query control to the workbook.
1. For **Query type**, select `Logs`, and for **Resource type**, select `Log Analytics`. Select a Log Analytics workspace in your subscription that has VM performance data as a resource.
1. In the query editor, enter:

    ```
    Perf
    | where ObjectName == 'Processor' and CounterName == '% Processor Time'
    | summarize Cpu = percentile(CounterValue, 95) by Computer
    | join kind = inner (Perf
        | where ObjectName == 'Processor' and CounterName == '% Processor Time'
        | make-series Trend = percentile(CounterValue, 95) default = 0 on TimeGenerated from {TimeRange:start} to {TimeRange:end} step {TimeRange:grain} by Computer
        ) on Computer
    | project-away Computer1, TimeGenerated
    | order by Cpu desc
    ```

1. Set **Visualization** to `Grid`.
1. Select **Column Settings**.
1. In the **Columns** section, set:
    - **Cpu**
       - **Column renderer**: `Thresholds`
       - **Custom number formatting**: `checked`
       - **Units**: `Percentage`
       - **Threshold settings** (last two need to be in order):
           - **Icon**: `Success`, **Operator**: `Default`
           - **Icon**: `Critical`, **Operator**: `>`, **Value**: `80`
           - **Icon**: `Warning`, **Operator**: `>`, **Value**: `60`
    - **Trend**
       - **Column renderer**: `Spark line`
       - **Color palette**: `Green to Red`
       - **Minimum value**: `60`
       - **Maximum value**: `80`
1. Select **Save and Close** to commit the changes.

:::image type="content" source="media/workbooks-commonly-used-components/workbooks-traffic-light-settings.png" lightbox="media/workbooks-commonly-used-components/workbooks-traffic-light-settings.png" alt-text="Screenshot that shows the creation of a grid with traffic light icons.":::

You can also pin this grid to a dashboard by using **Pin to dashboard**. The pinned grid automatically binds to the time range in the dashboard.

:::image type="content" source="media/workbooks-commonly-used-components/workbooks-traffic-light-pinned.png" alt-text="Screenshot that shows a grid with traffic light status by using thresholds pinned to a dashboard.":::

## Next Steps

[Learn about the types of visualizations you can use to create rich visual reports with Azure Workbooks](workbooks-visualizations.md).
