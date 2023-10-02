---
title: Azure Workbooks options group parameters
description: Learn about adding options group parameters to your Azure workbook.
services: azure-monitor
author: AbbyMSFT
ms.author: abbyweisberg
ms.topic: conceptual
ms.date: 06/21/2023
ms.reviewer: gardnerjr
---

# Options group parameters

When you use an options group parameter, you can select one value from a known set. For example, you can select one of your app's requests. If you're working with a few values, an options group can be a better choice than a [dropdown parameter](workbooks-dropdowns.md). You can see all the possible values and see which one is selected.

Options groups are commonly used for yes/no or on/off style choices. When there are many possible values, using a dropdown list is a better choice. Unlike dropdown parameters, an options group always allows only one selected value.

You can specify the list by:

- Providing a static list in the parameter setting.
- Using a KQL query to retrieve the list dynamically.

## Create a static options group parameter

1. Start with an empty workbook in edit mode.
1. Select **Add parameters** > **Add Parameter**.
1. In the new parameter pane that opens, enter:
    - **Parameter name**: `Environment`
    - **Parameter type**: `Options Group`
    - **Required**: `checked`
    - **Get data from**: `JSON`
1. In the **JSON Input** text block, insert this JSON snippet:

    ```json
    [
        { "value":"dev", "label":"Development" },
        { "value":"ppe", "label":"Pre-production" },
        { "value":"prod", "label":"Production", "selected":true }
    ]
    ```

    You aren't limited to JSON. You can use any query provider to provide initial values, but you'll be limited to the first 100 results.
1. Select **Update**.
1. Select **Save** to create the parameter.
1. The **Environment** parameter will be an options group control with the three values.

   :::image type="content" source="media/workbooks-options-group/workbooks-options-group-create.png" alt-text="Screenshot that shows the creation of a static options group in a workbook.":::

## Next steps

- [Workbook parameters](workbooks-parameters.md)
- [Workbook dropdown parameters](workbooks-dropdowns.md)
