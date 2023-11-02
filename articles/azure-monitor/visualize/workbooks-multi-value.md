---
title: Azure Workbooks multi-value parameters
description: Learn about adding multi-value parameters to your workbook.
services: azure-monitor
author: AbbyMSFT
ms.author: abbyweisberg
ms.topic: conceptual
ms.date: 06/21/2023
ms.reviewer: gardnerjr
---

# Multi-value parameters

A multi-value parameter allows the user to set one or more arbitrary text values. Multi-value parameters are commonly used for filtering, often when a dropdown control might contain too many values to be useful.

## Create a static multi-value parameter

1. Start with an empty workbook in edit mode.
1. Select **Add parameters** > **Add Parameter**.
1. In the new parameter pane that opens, enter:
    - **Parameter name**: `Filter`
    - **Parameter type**: `Multi-value`
    - **Required**: `unchecked`
    - **Get data from**: `None`
1. Select **Save** to create the parameter.
1. The **Filter** parameter will be a multi-value parameter, initially with no values.

   :::image type="content" source="media/workbooks-multi-value/workbooks-multi-value-create.png" alt-text="Screenshot that shows the creation of a multi-value parameter in a workbook.":::

1. You can then add multiple values.

   :::image type="content" source="media/workbooks-multi-value/workbooks-multi-value-third-value.png" alt-text="Screenshot that shows adding a third value in a workbook.":::

A multi-value parameter behaves similarly to a multi-select [dropdown parameter](workbooks-dropdowns.md) and is commonly used in an "in"-like scenario.

```
    let computerFilter = dynamic([{Computer}]);
    Heartbeat
    | where array_length(computerFilter) == 0 or Computer in (computerFilter)
    | summarize Heartbeats = count() by Computer
    | order by Heartbeats desc
```

## Parameter field style

A multi-value parameter supports the following field styles:

1. **Standard**: Allows you to add or remove arbitrary text items.

   :::image type="content" source="media/workbooks-multi-value/workbooks-multi-value-standard.png" alt-text="Screenshot that shows the workbook standard multi-value field.":::

1. **Password**: Allows you to add or remove arbitrary password fields. The password values are only hidden in the UI when you type. The values are still fully accessible as a parameter value when referred. They're stored unencrypted when the workbook is saved.

   :::image type="content" source="media/workbooks-multi-value/workbooks-multi-value-password.png" alt-text="Screenshot that shows a workbook password multi-value field.":::

## Create a multi-value parameter with initial values

You can use a query to seed the multi-value parameter with initial values. You can then manually remove values or add more values. If a query is used to populate the multi-value parameter, a restore defaults button appears on the parameter to restore back to the originally queried values.

1. Start with an empty workbook in edit mode.
1. Select **Add parameters** > **Add Parameter**.
1. In the new parameter pane that opens, enter:
    - **Parameter name**: `Filter`
    - **Parameter type**: `Multi-value`
    - **Required**: `unchecked`
    - **Get data from**: `JSON`
1. In the **JSON Input** text block, insert this JSON snippet:

    ```
    ["apple", "banana", "carrot" ]
    ```

    All the items that are the result of the query are shown as multi-value items.
    You aren't limited to JSON. You can use any query provider to provide initial values, but you'll be limited to the first 100 results.
1. Select **Run Query**.
1. Select **Save** to create the parameter.
1. The **Filter** parameter will be a multi-value parameter with three initial values.

   :::image type="content" source="media/workbooks-multi-value/workbooks-multi-value-initial-values.png" alt-text="Screenshot that shows the creation of a dynamic dropdown in a workbook.":::

## Next steps

- [Workbook parameters](workbooks-parameters.md)
- [Workbook dropdown parameters](workbooks-dropdowns.md)
