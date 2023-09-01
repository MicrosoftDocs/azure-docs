---
title: Create workbook parameters
description: Learn how to add parameters to your workbook to collect input from the consumers and reference it in other parts of the workbook.
services: azure-monitor
manager: carmonm
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 06/21/2023
---

# Workbook parameters

By using parameters, you can collect input from consumers and reference it in other parts of a workbook. It's usually used to scope the result set or set the right visual. You can build interactive reports and experiences by using this key capability.

When you use workbooks, you can control how your parameter controls are presented to consumers. They can be text box versus dropdown list, single- versus multi-select, and values from text, JSON, KQL, or Azure Resource Graph.

Supported parameter types include:

* [Time](workbooks-time.md): Allows you to select from pre-populated time ranges or select a custom range
* [Drop down](workbooks-dropdowns.md): Allows you to select from a value or set of values
* [Options group](workbooks-options-group.md): Allows you to select one value from a known set
* [Text](workbooks-text.md): Allows you to enter arbitrary text
* [Criteria](workbooks-criteria.md): Allows you to define a set of criteria based on previously specified parameters, which will be evaluated to provide a dynamic value
* [Resource](workbooks-resources.md): Allows you to select one or more Azure resources
* [Subscription](workbooks-resources.md): Allows you to select one or more Azure subscription resources
* [Multi-value](workbooks-multi-value.md): Allows you to set one or more arbitrary text values
* Resource type: Allows you to select one or more Azure resource type values
* Location: Allows you to select one or more Azure location values

## Reference a parameter

You can reference parameter values from other parts of workbooks either by using bindings or value expansions.

### Reference a parameter with bindings

This example shows how to reference a time range parameter with bindings:

1. Select **Add query** to add a query control, and then select an Application Insights resource.
1. Open the **Time Range** dropdown list and select the **Time Range** option from the **Parameters** section at the bottom:
   - This option binds the time range parameter to the time range of the chart.
   - The time scope of the sample query is now **Last 24 hours**.
1. Run the query to see the results.

   :::image type="content" source="media/workbooks-parameters/workbooks-time-binding.png" alt-text="Screenshot that shows a time range parameter referenced via bindings.":::

### Reference a parameter with KQL

This example shows how to reference a time range parameter with KQL:

1. Select **Add query** to add a query control, and then select an Application Insights resource.
1. In the KQL, enter a time scope filter by using the parameter `| where timestamp {TimeRange}`:
   - This parameter expands on query evaluation time to `| where timestamp > ago(1d)`.
   - This option is the time range value of the parameter.
1. Run the query to see the results.

   :::image type="content" source="media/workbooks-parameters/workbooks-time-in-code.png" alt-text="Screenshot that shows a time range referenced in the KQL query.":::

### Reference a parameter with text

This example shows how to reference a time range parameter with text:

1. Add a text control to the workbook.
1. In the Markdown, enter `The chosen time range is {TimeRange:label}`.
1. Select **Done Editing**.
1. The text control shows the text *The chosen time range is Last 24 hours*.

## Parameter formatting options
  
Each parameter type has its own formatting options. Use the **Previews** section of the **Edit Parameter** pane to see the formatting expansion options for your parameter.

   :::image type="content" source="media/workbooks-parameters/workbooks-time-settings.png" alt-text="Screenshot that shows time range parameter options.":::

You can use these options to format all parameter types except for **Time range picker**. For examples of formatting times, see [Time parameter options](workbooks-time.md#time-parameter-options).

Other parameter types include:

   - **Resource picker**: Resource IDs are formatted.
   - **Subscription picker**: Subscription values are formatted.

### Convert toml to json

**Syntax**: `{param:tomltojson}`

**Original value**:

```
name = "Sam Green"

[address]
state = "New York"
country = "USA"
```

**Formatted value**:

```
{
  "name": "Sam Green",
  "address": {
    "state": "New York",
    "country": "USA"
  }
}
```

### Escape JSON

**Syntax**: `{param:escapejson}`

**Original value**:

```
{
	"name": "Sam Green",
	"address": {
		"state": "New York",
		"country": "USA"
  }
}
```

**Formatted value**:

```
{\r\n\t\"name\": \"Sam Green\",\r\n\t\"address\": {\r\n\t\t\"state\": \"New York\",\r\n\t\t\"country\": \"USA\"\r\n  }\r\n}
```

### Encode text to base64

**Syntax**: `{param:base64}`

**Original value**:

```
Sample text to test base64 encoding
```

**Formatted value**:

```
U2FtcGxlIHRleHQgdG8gdGVzdCBiYXNlNjQgZW5jb2Rpbmc=
```

## Format parameters by using JSONPath

For string parameters that are JSON content, you can use [JSONPath](workbooks-jsonpath.md) in the parameter format string.

For example, you might have a string parameter named `selection` that was the result of a query or selection in a visualization that has the following value:

```json 
{ "series":"Failures", "x": 5, "y": 10 }
```

By using JSONPath, you could get individual values from that object:

Format | Result
---|---
`{selection:$.series}` | `Failures`
`{selection:$.x}` | `5`
`{selection:$.y}`| `10`

> [!NOTE]
> If the parameter value isn't valid JSON, the result of the format will be an empty value.

## Parameter style

The following styles are available for the parameters.

### Pills

Pills style is the default style. The parameters look like text and require the user to select them once to go into the edit mode.

   :::image type="content" source="media/workbooks-parameters/workbooks-pills-read-mode.png" alt-text="Screenshot that shows Azure Workbooks pills-style read mode.":::

   :::image type="content" source="media/workbooks-parameters/workbooks-pills-edit-mode.png" alt-text="Screenshot that shows Azure Workbooks pills-style edit mode.":::

### Standard

In standard style, the controls are always visible, with a label above the control.

   :::image type="content" source="media/workbooks-parameters/workbooks-standard.png" alt-text="Screenshot that shows Azure Workbooks standard style.":::

### Form horizontal

In form horizontal style, the controls are always visible, with the label on the left side of the control.

   :::image type="content" source="media/workbooks-parameters/workbooks-form-horizontal.png" alt-text="Screenshot that shows Azure Workbooks form horizontal style.":::

### Form vertical

In form vertical style, the controls are always visible, with the label above the control. Unlike standard style, there's only one label or control in one row.

   :::image type="content" source="media/workbooks-parameters/workbooks-form-vertical.png" alt-text="Screenshot that shows Azure Workbooks form vertical style.":::
 
> [!NOTE]
> In standard, form horizontal, and form vertical layouts, there's no concept of inline editing. The controls are always in edit mode.

## Global parameters

Now that you've learned how parameters work, and the limitations about only being able to use a parameter "downstream" of where it's set, it's time to learn about global parameters, which change those rules.

With a global parameter, the parameter must still be declared before it can be used. But any step that sets a value to that parameter will affect all instances of that parameter in the workbook.

> [!NOTE]
> Because changing a global parameter has this "update all" behavior, the global setting should only be turned on for parameters that require this behavior. A combination of global parameters that depend on each other can create a cycle or oscillation where the competing globals change each other over and over. To avoid cycles, you can't "redeclare" a parameter that's been declared as global. Any subsequent declarations of a parameter with the same name will create a read-only parameter that can't be edited in that place.

Common uses of global parameters:

1. Synchronize time ranges between many charts:
    - Without a global parameter, any time range brush in a chart will only be exported after that chart. So, selecting a time range in the third chart will only update the fourth chart.
    - With a global parameter, you can create a global **timeRange** parameter, give it a default value, and have all the other charts use that as their bound time range and time brush output. In addition, set the **Only export the parameter when a range is brushed** setting. Any change of time range in any chart updates the global **timeRange** parameter at the top of the workbook. This functionality can be used to make a workbook act like a dashboard.

1. Allow changing the selected tab in a links step via links or buttons:
    - Without a global parameter, the links step only outputs a parameter for the selected tab.
    - With a global parameter, you can create a global **selectedTab** parameter. Then you can use that parameter name in the tab selections in the links step. You can pass that parameter value into the workbook from a link or by using another button or link to change the selected tab. Using buttons from a links step in this way can make a wizard-like experience, where buttons at the bottom of a step can affect the visible sections above it.

### Create a global parameter

When you create the parameter in a parameters step, use the **Treat this parameter as a global** option in **Advanced Settings**. The only way to make a global parameter is to declare it with a parameters step. The other methods of creating parameters, via selections, brushing, links, buttons, and tabs, can only update a global parameter. They can't declare one themselves.

   :::image type="content" source="media/workbooks-parameters/workbooks-parameters-global-setting.png" alt-text="Screenshot that shows setting global parameters in a workbook.":::

The parameter will be available and function as normal parameters do.

### Update the value of an existing global parameter

For the chart example, the most common way to update a global parameter is by using time brushing.

In this example, the **timerange** parameter is declared as global. In a query step below that, create and run a query that uses that **timerange** parameter in the query and returns a time chart result. In **Advanced Settings** for the query step, enable the time range brushing setting. Use the same parameter name as the output for the time brush parameter. Also, select the **Only export the parameter when a range is brushed** option.

   :::image type="content" source="media/workbooks-parameters/workbooks-global-time-range-brush.png" alt-text="Screenshot that shows the global time brush setting in a workbook.":::

Whenever a time range is brushed in this chart, it also updates the **timerange** parameter above this query, and the query step itself, because it also depends on **timerange**.

 1. Before brushing:
 
    - The time range is shown as **Last hour**.
    - The chart shows the last hour of data.

    :::image type="content" source="media/workbooks-parameters/workbooks-global-before-brush.png" alt-text="Screenshot that shows setting global parameters before brushing.":::

 1. During brushing:
 
    - The time range is still the last hour, and the brushing outlines are drawn.
    - No parameters have changed. After you let go of the brush, the time range is updated.

    :::image type="content" source="media/workbooks-parameters/workbooks-global-during-brush.png" alt-text="Screenshot that shows setting global parameters during brushing.":::

   
 1. After brushing:

    - The time range specified by the time brush is set by this step. It overrides the global value. The **timerange** dropdown list now displays that custom time range.
    - Because the global value at the top has changed, and because this chart depends on **timerange** as an input, the time range of the query used in the chart also updates. As a result, the query and the chart will update.
     - Any other steps in the workbook that depend on **timerange** will also update.

    :::image type="content" source="media/workbooks-parameters/workbooks-global-after-brush.png" alt-text="Screenshot that shows setting global parameters after brushing.":::

    > [!NOTE]
    > If you don't use a global parameter, the **timerange** parameter value will only change below this query step. Things above this step or this item itself won't update.