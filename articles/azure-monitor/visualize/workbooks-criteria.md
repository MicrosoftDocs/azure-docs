---
title: Azure Workbooks criteria parameters
description: Learn about adding criteria parameters to your workbook.
services: azure-monitor
author: AbbyMSFT
ms.author: abbyweisberg
ms.topic: conceptual
ms.date: 06/21/2023
ms.reviewer: gardnerjr
---

# Text parameter criteria

When a query depends on many parameters, the query will be stalled until each of its parameters has been resolved. Sometimes a parameter could have a simple query that concatenates a string or performs a conditional evaluation. These queries still make network calls to services that perform these basic operations, and that process increases the time it takes for a parameter to resolve a value. The result is long load times for complex workbooks.

When you use criteria parameters, you can define a set of criteria based on previously specified parameters that will be evaluated to provide a dynamic value. The main benefit of using criteria parameters is that criteria parameters can resolve values of previously specified parameters and perform simple conditional operations without making any network calls. The following example is a criteria-parameters use case.

## Example

Consider the following conditional query:

:::image type="content" source="media/workbooks-criteria/workbooks-criteria-conditional-query.png" alt-text="Screenshot that shows the conditional query.":::

```
let metric = dynamic({Counter});
print tostring((metric.object == 'Network Adapter' and (metric.counter == 'Bytes Received/sec' or metric.counter == 'Bytes Sent/sec')) or (metric.object == 'Network' and (metric.counter == 'Total Bytes Received' or metric.counter == 'Total Bytes Transmitted')))
```

If you're focused on the `metric.counter` object, the value of the parameter `isNetworkCounter` should be true if the parameter `Counter` has `Bytes Received/sec`, `Bytes Sent/sec`, `Total Bytes Received`, or `Total Bytes Transmitted`.

This can be translated to a criteria text parameter:

:::image type="content" source="media/workbooks-criteria/workbooks-criteria-example.png" alt-text="Screenshot that shows the criteria example.":::

In the preceding screenshot, the conditions will be evaluated from top to bottom and the value of the parameter `isNetworkCounter` will take the value of whichever condition evaluates to true first. All conditions except for the default condition (the "else" condition) can be reordered to get the desired outcome.

## Set up criteria

1. Start with a workbook with at least one existing parameter in edit mode.
    1. Select **Add parameters** > **Add Parameter**.
    1. In the new parameter pane that opens, enter:
        - **Parameter name**: `rand`
        - **Parameter type**: `Text`
        - **Required**: `checked`
        - **Get data from**: `Query`
        - Enter `print rand(0-1)` in the query editor. This parameter will output a value between 0-1.
    1. Select **Save** to create the parameter.

    > [!NOTE]
    > The first parameter in the workbook won't show the **Criteria** tab.

     :::image type="content" source="media/workbooks-criteria/workbooks-criteria-first-param.png" alt-text="Screenshot that shows the first parameter.":::

1. In the table with the `rand` parameter, select **Add Parameter**.
1. In the new parameter pane that opens, enter:
    - **Parameter name**: `randCriteria`
    - **Parameter type**: `Text`
    - **Required**: `checked`
    - **Get data from**: `Criteria`
1. A grid appears. Select **Edit** next to the blank text box to open the **Criteria Settings** form. For a description of each field, see [Criteria Settings form](#criteria-settings-form).

   :::image type="content" source="media/workbooks-criteria/workbooks-criteria-setting.png" alt-text="Screenshot that shows the Criteria Settings form.":::

1. Enter the following data to populate the first criteria, and then select **OK**:
    - **First operand**: `rand`
    - **Operator**: `>`
    - **Value from**: `Static Value`
    - **Second operand**: `0.25`
    - **Value from**: `Static Value`
    - **Result is**: `is over 0.25`

   :::image type="content" source="media/workbooks-criteria/workbooks-criteria-setting-filled.png" alt-text="Screenshot that shows the Criteria Settings form filled in.":::

1. Select **Edit** next to the condition `Click edit to specify a result for the default condition` to edit the default condition.

    > [!NOTE]
    > For the default condition, everything should be disabled except for the last `Value from` and `Result is` fields.

1. Enter the following data to populate the default condition, and then select **OK**:
    - **Value from**: Static Value
    - **Result is**: is 0.25 or under

   :::image type="content" source="media/workbooks-criteria/workbooks-criteria-default.png" alt-text="Screenshot that shows the Criteria Settings default form filled.":::

1. Save the parameter.
1. Refresh the workbook to see the `randCriteria` parameter in action. Its value will be based on the value of `rand`.

## Criteria Settings form

|Form fields|Description|
|-----------|----------|
|First operand| This dropdown list consists of parameter names that have already been created. The value of the parameter will be used on the left side of the comparison. |
|Operator|The operator used to compare the first and second operands. Can be a numerical or string evaluation. The operator `is empty` will disable the `Second operand` because only the `First operand` is required.|
|Value from|If set to `Parameter`, a dropdown list consisting of parameters that have already been created appears. The value of that parameter will be used on the right side of the comparison.<br/> If set to `Static Value`, a text box appears where you can enter a value for the right side of the comparison.|
|Second operand| Will be either a dropdown menu consisting of created parameters or a text box depending on the preceding `Value from` selection.|
|Value from|If set to `Parameter`, a dropdown list consisting of parameters that have already been created appears. The value of that parameter will be used for the return value of the current parameter.<br/> If set to `Static Value`:<br>- A text box appears where you can enter a value for the result.<br>- You can also dereference other parameters by using curly braces around the parameter name.<br>- It's possible to concatenate multiple parameters and create a custom string, for example, "`{paramA}`, `{paramB}`, and some string." <br><br>If set to `Expression`:<br> - A text box appears where you can enter a mathematical expression that will be evaluated as the result.<br>- Like the `Static Value` case, multiple parameters might be dereferenced in this text box.<br>- If the parameter value referenced in the text box isn't a number, it will be treated as the value `0`.|
|Result is| Will be either a dropdown menu consisting of created parameters or a textbox depending on the preceding `Value from` selection. The text box will be evaluated as the final result of this **Criteria Settings** form.
