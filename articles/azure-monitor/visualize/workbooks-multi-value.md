---
title: Azure Workbooks multi value parameters.
description: Learn about adding multi value parameters to your Azure workbook.
services: azure-monitor
author: AbbyMSFT
ms.author: abbyweisberg
ms.topic: conceptual
ms.date: 05/30/2022
ms.reviewer: gardnerjr
---

# Multi-value Parameters

A multi-value parameter allows the user to set one or more arbitrary text values. Multi-value parameters are commonly used for filtering, often when a drop-down control may contain too many values to be useful.


## Creating a static multi-value parameter
1. Start with an empty workbook in edit mode.
1. Select **Add parameters** from the links within the workbook.
1. Select the blue _Add Parameter_ button.
1. In the new parameter pane that pops up enter:
    - Parameter name: `Filter`
    - Parameter type: `Multi-value`
    - Required: `unchecked`
    - Get data from: `None`
1. Select **Save** from the toolbar to create the parameter.
1. The Filter parameter will be a multi-value parameter, initially with no values:

   :::image type="content" source="media/workbooks-multi-value/workbooks-multi-value-create.png" alt-text="Image showing the creation of mulit-value parameter in workbooks.":::

1. You can then add multiple values:

   :::image type="content" source="media/workbooks-multi-value/workbooks-multi-value-third-value.png" alt-text="Image showing the user adding a third value in workbooks.":::


A multi-value parameter behaves similarly to a multi-select [drop down parameter](workbooks-dropdowns.md). As such, it is commonly used in an "in" like scenario

```
    let computerFilter = dynamic([{Computer}]);
    Heartbeat
    | where array_length(computerFilter) == 0 or Computer in (computerFilter)
    | summarize Heartbeats = count() by Computer
    | order by Heartbeats desc
```

## Parameter field style
Multi-value parameter supports following field style:
1. Standard: Allows a user to add or remove arbitrary text items

   :::image type="content" source="media/workbooks-multi-value/workbooks-multi-value-standard.png" alt-text="Image showing standard workbooks multi-value field.":::

1. Password: Allows a user to add or remove arbitrary password fields. The password values are only hidden on UI when user types. The values are still fully accessible as a param value when referred and they are stored unencrypted when workbook is saved.

   :::image type="content" source="media/workbooks-multi-value/workbooks-multi-value-password.png" alt-text="Image showing a workbooks password multi-value field.":::

## Creating a multi-value with initial values
You can use a query to seed the multi-value parameter with initial values. The user can then manually remove values, or add more values. If a query is used to populate the multi-value parameter, a restore defaults button will appear on the parameter to restore back to the originally queried values.

1. Start with an empty workbook in edit mode.
1. Select **add parameters** from the links within the workbook.
1. Select **Add Parameter**.
1. In the new parameter pane that pops up enter:
    - Parameter name: `Filter`
    - Parameter type: `Multi-value`
    - Required: `unchecked`
    - Get data from: `JSON`
1. In the JSON Input text block, insert this json snippet:
    ```
    ["apple", "banana", "carrot" ]
    ```
    All of the items that are the result of the query will be shown as multi value items.
    (you are not limited to JSON, you can use any query provider to provide initial values, but will be limited to the first 100 results)
1. Select **Run Query**.
1. Select **Save** from the toolbar to create the parameter.
1. The Filter parameter will be a multi-value parameter with three initial values.

   :::image type="content" source="media/workbooks-multi-value/workbooks-multi-value-initial-values.png" alt-text="Image showing the creation of a dynamic drop-down in workbooks.":::
## Next steps

- [Workbook parameters](workbooks-parameters.md).
- [Workbook drop down parameters](workbooks-dropdowns.md)
