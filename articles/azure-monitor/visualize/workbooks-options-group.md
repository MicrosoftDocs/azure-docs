---
title: Azure Workbooks options group parameters.
description: Learn about adding options group parameters to your Azure workbook.
services: azure-monitor
author: AbbyMSFT
ms.author: abbyweisberg
ms.topic: conceptual
ms.date: 07/05/2022
ms.reviewer: gardnerjr
---

# Options group parameters

An options group parameter allows the user to select one value from a known set (for example, select one of your app’s requests). When there is a small number of values, an options group can be a better choice than a [drop-down parameter](workbooks-dropdowns.md), since the user can see all the possible values, and see which one is selected. Options groups are commonly used for yes/no or on/off style choices. When there are a large number of possible values, using a drop-down is a better choice. Unlike drop-down parameters, an options group always only allows one selected value.

You can specify the list by:
- providing a static list in the parameter setting
- using a KQL query to retrieve the list dynamically

## Creating a static options group parameter
1. Start with an empty workbook in edit mode.
1. Choose **Add parameters** from the links within the workbook.
1. Select **Add Parameter**.
1. In the new parameter pane that pops up enter:
    - Parameter name: `Environment`
    - Parameter type: `Options Group`
    - Required: `checked`
    - Get data from: `JSON`
1. In the JSON Input text block, insert this json snippet:
    ```json
    [
        { "value":"dev", "label":"Development" },
        { "value":"ppe", "label":"Pre-production" },
        { "value":"prod", "label":"Production", "selected":true }
    ]
    ```
    (you are not limited to JSON, you can use any query provider to provide initial values, but will be limited to the first 100 results)
1. Select **Update**.
1. Select **Save** from the toolbar to create the parameter.
1. The Environment parameter will be an options group control with the three values.

   :::image type="content" source="media/workbooks-options-group/workbooks-options-group-create.png" alt-text="Screenshot showing the creation of a static options group in a workbook.":::

## Next steps

- [Workbook parameters](workbooks-parameters.md).
- [Workbook drop down parameters](workbooks-dropdowns.md)
