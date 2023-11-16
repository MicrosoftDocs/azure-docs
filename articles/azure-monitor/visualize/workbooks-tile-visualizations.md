---
title: Azure Monitor workbook tile visualizations
description: Learn about all the Azure Monitor workbook tile visualizations.
services: azure-monitor
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 06/21/2023
---

# Tile visualizations

Tiles are a useful way to present summary data in workbooks. The following example shows a common use case of tiles with app-level summary on top of a detailed grid.

:::image type="content" source="./media/workbooks-tile-visualizations/tiles-summary.png" lightbox="./media/workbooks-tile-visualizations/tiles-summary.png" alt-text="Screenshot that shows a tile summary view.":::

Workbook tiles support showing items like a title, subtitle, large text, icons, metric-based gradients, spark lines or bars, and footers.

## Add a tile

1. Switch the workbook to edit mode by selecting the **Edit** toolbar button.
1. Select **Add** > **Add query** to add a log query control to the workbook.
1. For **Query type**, select **Logs**. For **Resource type**, select, for example, **Application Insights**, and select the resources to target.
1. Use the query editor to enter the KQL for your analysis.

    ```kusto
    requests
    | summarize Requests = count() by appName, name
    | top 7 by Requests desc
    ```

1. Set **Size** to **Full**.
1. Set **Visualization** to **Tiles**.
1. Select the **Tile Settings** button to open the **Tile Settings** pane:
    1. In **Title**, set:
        * **Use column**: `name`
    1. In **Left**, set:
        * **Use column**: `Requests`
        * **Column renderer**: `Big Number`
        * **Color palette**: `Green to Red`
        * **Minimum value**: `0`
    1. In **Bottom**, set:
        * **Use column**: `appName`
1. Select the **Save and Close** button at the bottom of the pane.
<!-- convertborder later; applied Learn formatting border because the border created manually is thin. -->
:::image type="content" source="./media/workbooks-tile-visualizations/tile-settings.png" lightbox="./media/workbooks-tile-visualizations/tile-settings.png" alt-text="Screenshot that shows a tile summary view with query and tile settings.":::

The tiles in read mode:
<!-- convertborder later; applied Learn formatting border because the border created manually is thin. -->
:::image type="content" source="./media/workbooks-tile-visualizations/tiles-read-mode.png" lightbox="./media/workbooks-tile-visualizations/tiles-read-mode.png" alt-text="Screenshot that shows a tile summary view in read mode.":::

## Spark lines in tiles

1. Switch the workbook to edit mode by selecting **Edit** on the toolbar.
1. Add a time range parameter called `TimeRange`.
    1. Select **Add** > **Add parameters**.
    1. In the parameter control, select **Add Parameter**.
    1. In the **Parameter name** field, enter `TimeRange`. For **Parameter type**, choose `Time range picker`.
    1. Select **Save** at the top of the pane and then select **Done Editing** in the parameter control.
1. Select **Add** > **Add query** to add a log query control under the parameter control.
1. For **Query type**, select **Logs**. For **Resource type**, select, for example, **Application Insights**, and select the resources to target.
1. Use the query editor to enter the KQL for your analysis.

    ```kusto
    let topRequests = requests
    | summarize Requests = count() by appName, name
    | top 7 by Requests desc;
    let topRequestNames = topRequests | project name;
    requests
    | where name in (topRequestNames)
    | make-series Trend = count() default = 0 on timestamp from {TimeRange:start} to {TimeRange:end} step {TimeRange:grain} by name
    | join (topRequests) on name
    | project-away name1, timestamp
    ```

1. Select **Run Query**. Set `TimeRange` to a value of your choosing before you run the query.
1. Set **Visualization** to **Tiles**.
1. Set **Size** to **Full**.
1. Select **Tile Settings**:
    1. In **Tile**, set:
        * **Use column**: `name`
    1. In **Subtile**, set:
        *  **Use column**: `appNAme`
    1. In **Left**, set:
        * **Use column**:`Requests`
        * **Column renderer**: `Big Number`
        * **Color palette**: `Green to Red`
        * **Minimum value**: `0`
    1. In **Bottom**, set:
        * **Use column**:`Trend`
        * **Column renderer**: `Spark line`
        * **Color palette**: `Green to Red`
        * **Minimum value**: `0`
1. Select **Save and Close** at the bottom of the pane.
<!-- convertborder later -->
:::image type="content" source="./media/workbooks-tile-visualizations/spark-line.png" lightbox="./media/workbooks-tile-visualizations/spark-line.png" alt-text="Screenshot that shows tile visualization with a spark line." border="false":::

## Tile sizes

You have an option to set the tile width in the tile settings:

* `fixed` (default)

    The default behavior of tiles is to be the same fixed width, approximately 160 pixels wide, plus the space around the tiles.
    <!-- convertborder later -->
    :::image type="content" source="./media/workbooks-tile-visualizations/tiles-fixed.png" lightbox="./media/workbooks-tile-visualizations/tiles-fixed.png" alt-text="Screenshot that shows fixed-width tiles." border="false":::
* `auto`

    Each title shrinks or grows to fit their contents. The tiles are limited to the width of the tiles' view (no horizontal scrolling).
    <!-- convertborder later -->
    :::image type="content" source="./media/workbooks-tile-visualizations/tiles-auto.png" lightbox="./media/workbooks-tile-visualizations/tiles-auto.png" alt-text="Screenshot that shows auto-width tiles." border="false":::
* `full size`

    Each title is always the full width of the tiles' view, with one title per line.
     <!-- convertborder later -->
     :::image type="content" source="./media/workbooks-tile-visualizations/tiles-full.png" lightbox="./media/workbooks-tile-visualizations/tiles-full.png" alt-text="Screenshot that shows full-size-width tiles." border="false":::

## Next steps

* Tiles also support the composite bar renderer. To learn more, see [Composite bar documentation](workbooks-composite-bar.md).
* To learn more about time parameters like `TimeRange`, see [Workbook time parameters documentation](workbooks-time.md).