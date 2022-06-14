---
title: Azure Workbooks text parameters
description: Learn about adding text parameters to your Azure workbook.
services: azure-monitor
author: AbbyMSFT
ms.author: abbyweisberg
ms.topic: conceptual
ms.date: 05/30/2022
ms.reviewer: gardnerjr
---

# Adding text to your workbook 

Workbooks allow authors to include text blocks in their workbooks. The text can be human analysis of the telemetry, information to help users interpret the data, section headings, etc. 

   :::image type="content" source="media/workbooks-add-text/workbooks-text-example.png" alt-text="Image showing a text step in workbooks.":::

Text is added through a markdown control - into which an author can add their content. An author can use the full formatting capabilities of markdown to make their documents appear just how they want it. These include different heading and font styles, hyperlinks, tables, etc. This allows authors to create rich Word- or Portal-like reports or analytic narratives.  Text Steps can contain parameter values in the markdown text, and those parameter references will be updated as the parameters change.

**Edit mode**:
   :::image type="content" source="media/workbooks-add-text/workbooks-text-control-edit-mode.png" alt-text="Image showing a text step in workbooks in edit mode.":::

**Preview mode**:
   :::image type="content" source="media/workbooks-add-text/workbooks-text-control-edit-mode-preview.png" alt-text="Image showing a text step in workbooks in preview mode.":::

## Add text 
1. Switch the workbook to edit mode by clicking on the _Edit_ toolbar item.
1. Use the _Add_ button below a step or at the bottom of the workbook, and choose "Add Text" to add a text control to the workbook. 
1. Enter markdown text into the editor field
1. Use the _Text Style_ option to switch between plain markdown, and markdown wrapped with the Azure portal's standard info/warning/success/error styling.
   
   > Tip:
   > Use this [markdown cheat sheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) to see the different formatting options.

1. Use the Preview tab to see how your content will look. While editing, the preview will show the content inside a scrollable area to limit its size, but when displayed at runtime, the markdown content will expand to fill whatever space it needs, with no scrollbars.
1. Select the _Done Editing_ button to complete editing the step

## Text styles
The following text styles are available for text steps:

| Style     | Description                                                                             |
| --------- | --------------------------------------------------------------------------------------- |
| `plain`   | No other formatting is applied                                                     |
| `info`    | The portal's "info" style, with a `ℹ` or similar icon and blue background     |
| `error`   | The portal's "error" style, with a `❌` or similar icon and red background     |
| `success` | The portal's "success" style, with a `✔` or similar icon and green background |
| `upsell`  | The portal's "upsell" style, with a `🚀` or similar icon and purple background  |
| `warning` | The portal's "warning" style, with a `⚠` or similar icon and blue background  |


Instead of picking a specific style, you may also choose a text parameter as the source of the style. The parameter value must be one of the above text values. The absence of a value, or any unrecognized value will be treated as `plain` style.

### info style example:
   :::image type="content" source="media/workbooks-add-text/workbooks-text-control-edit-mode-preview.png" alt-text="Image showing a text step in workbooks in preview mode showing info style.":::

### warning style example:
   :::image type="content" source="media/workbooks-add-text/workbooks-text-example-warning.png" alt-text="Image showing a text visualization in warning style.":::

## Next Steps
- [Add Workbook parameters](workbooks-parameters.md)