---
title: Azure Monitor workbook text visualizations
description: Learn about all the Azure Monitor workbook text visualizations.
services: azure-monitor
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 06/21/2023
---

# Text Visualization

The text *visualization* in query steps is different from the [text *step*](workbooks-create-workbook.md#add-text). A text step is a top level item in a workbook, and supports replacing parameters in the content, and allows for error/warning styling.

The text *visualization* is similar to the Azure Data Explorer [`render card`](/azure/data-explorer/kusto/query/renderoperator?pivots=azuredataexplorer) behavior, where the first cell value returned by the query (and *only* the first cell value: row 0, column 0) is displayed in the visualization.

The text visualization has a style setting to change the style of the text displayed in the workbook.

### Text styles
The following text styles are available for text steps:

|Style   |Explanation   |
|----------|-----------|
|`plain`     |No additional formatting is applied, the text value is presumed to be plain text and no special formatting is applied       |
|`header`|The text is formatted with the same styling as step headers   |
|`bignumber`     |The text is formatted in the "big number" style used in [Tile](workbooks-tile-visualizations.md) and [Graph](workbooks-graph-visualizations.md) based visualizations.       |
|`markdown`|The text value is rendered in a markdown section, any markdown content in the text content will be interpreted as such and used for formatting.   |
|`editor`     |The text value is displayed in an editor control, respecting newlines, tab formatting.       |

### Examples

Given a query that returns text in a cell, showing in the standard grid visualization:

:::image type="content" source="./media/workbooks-text-visualizations/workbooks-text-visualization-grid-result.png" alt-text="Screenshot of a workbook in the Azure portal. The screenshot shows a text result returned by a query." lightbox="./media/workbooks-text-visualizations/workbooks-text-visualization-grid-result.png":::

You can see that this query returned a single column of data, which appears to be a very long string. In all examples the query step has the same header set.

### Plain example
When the visualization is set to `Text` and the `Plain` style is selected, the text appears as a standard portal text block:

:::image type="content" source="./media/workbooks-text-visualizations/workbooks-text-visualization-example.png" alt-text="Screenshot of a workbook in the Azure portal. The screenshot shows an example of a text visualization in plain style." lightbox="./media/workbooks-text-visualizations/workbooks-text-visualization-example.png":::

Text will wrap, and any special formatting values will be displayed as is, with no formatting.

### Header example
:::image type="content" source="./media/workbooks-text-visualizations/workbooks-text-visualization-header.png" alt-text="Screenshot of a workbook in the Azure portal. The screenshot shows an example of a text visualization in header style." lightbox="./media/workbooks-text-visualizations/workbooks-text-visualization-header.png":::

Text will be displayed in the same style as step headers.

### Big Number example
:::image type="content" source="./media/workbooks-text-visualizations/workbooks-text-visualization-big-number.png" alt-text="Screenshot of a workbook in the Azure portal. The screenshot shows an example of a text visualization in big number style." lightbox="./media/workbooks-text-visualizations/workbooks-text-visualization-big-number.png":::

Text will be displayed in big number style.


### Markdown example
For the markdown example, the query response has been adjusted to have markdown formatting elements inside. Without any markdown formatting in the text, the display will be similar to the plain style.

:::image type="content" source="./media/workbooks-text-visualizations/workbooks-text-visualization-markdown.png" alt-text="Screenshot of a workbook in the Azure portal. The screenshot shows an example of a text visualization in the markdown style." lightbox="./media/workbooks-text-visualizations/workbooks-text-visualization-markdown.png":::

### Editor example:
For the editor example, newline `\n` and tab `\t` characters have been added to the text to create multiple lines.

:::image type="content" source="./media/workbooks-text-visualizations/workbooks-text-visualization-editor.png" alt-text="Screenshot of a workbook in the Azure portal. The screenshot shows an example of a text visualization in editor style." lightbox="./media/workbooks-text-visualizations/workbooks-text-visualization-editor.png":::

Notice how in this example, the editor has horizontal scrollbar, indicating that some of the lines in this text are wider than the control.
