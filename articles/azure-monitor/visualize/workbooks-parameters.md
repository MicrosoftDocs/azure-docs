---
title: Creating Workbook parameters
description: Learn how to add parameters to your workbook to collect input from the consumers and reference it in other parts of the workbook.
services: azure-monitor
manager: carmonm

ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 07/05/2022
---

# Workbook parameters

Parameters allow workbook authors to collect input from the consumers and reference it in other parts of the workbook – usually to scope the result set or setting the right visual. It is a key capability that allows authors to build interactive reports and experiences. 

Workbooks allow you to control how your parameter controls are presented to consumers – text box vs. drop down, single- vs. multi-select, values from text, JSON, KQL, or Azure Resource Graph, etc.  

Supported parameter types include:
* [Time](workbooks-time.md) - allows a user to select from pre-populated time ranges or select a custom range
* [Drop down](workbooks-dropdowns.md) - allows a user to select from a value or set of values
* [Options group](workbooks-options-group.md)
* [Text](workbooks-text.md) - allows a user to enter arbitrary text
* [Criteria](workbooks-criteria.md)
* [Resource](workbooks-resources.md) - allows a user to select one or more Azure resources
* [Subscription](workbooks-resources.md) - allows a user to select one or more Azure subscription resources
* [Multi-value](workbooks-multi-value.md)
* Resource Type - allows a user to select one or more Azure resource type values
* Location - allows a user to select one or more Azure location values

## Reference a parameter
You can reference parameters values from other parts of workbooks either using bindings or value expansions.
### Reference a parameter with Bindings

This example shows how to reference a time range parameter with bindings:

1. Add a query control to the workbook and select an Application Insights resource.
2. Open the _Time Range_ drop-down and select the `Time Range` option from the Parameters section at the bottom.
3. This binds the time range parameter to the time range of the chart. The time scope of the sample query is now Last 24 hours.
4. Run query to see the results

   :::image type="content" source="media/workbooks-parameters/workbooks-time-binding.png" alt-text="Screenshot showing a time range parameter referenced via bindings.":::    

### Reference a parameter with KQL

This example shows how to reference a time range parameter with KQL:

1. Add a query control to the workbook and select an Application Insights resource.
2. In the KQL, enter a time scope filter using the parameter: `| where timestamp {TimeRange}`
3. This expands on query evaluation time to `| where timestamp > ago(1d)`, which is the time range value of the parameter.
4. Run query to see the results

   :::image type="content" source="media/workbooks-parameters/workbooks-time-in-code.png" alt-text="Screenshot showing a time range referenced in the K Q L query.":::    

### Reference a parameter with Text

This example shows how to reference a time range parameter with text:

1. Add a text control to the workbook.
2. In the markdown, enter `The chosen time range is {TimeRange:label}`
3. Choose _Done Editing_
4. The text control will show text: _The chosen time range is Last 24 hours_

## Parameter formatting options
  
Each parameter type has its own formatting options. Use the **Previews** section of the **Edit Parameter** pane to see the formatting expansion options for your parameter:

   :::image type="content" source="media/workbooks-parameters/workbooks-time-settings.png" alt-text="Screenshot showing a time range parameter options.":::

You can use these options to format all parameter types except for the time range picker. For examples of formatting times, see [Time parameter options](workbooks-time.md#time-parameter-options).

   - For Resource picker, resource IDs are formatted.
   - For Subscription picker, subscription values are formatted.
    
### Convert toml to json

**Syntax**: `{param:tomltojson}`

**Original Value**: 

```
name = "Sam Green"

[address]
state = "New York"
country = "USA"
```

**Formatted Value**:

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

**Original Value**: 

```
{
	"name": "Sam Green",
	"address": {
		"state": "New York",
		"country": "USA"
  }
}
```

**Formatted Value**:

```
{\r\n\t\"name\": \"Sam Green\",\r\n\t\"address\": {\r\n\t\t\"state\": \"New York\",\r\n\t\t\"country\": \"USA\"\r\n  }\r\n}
```

### Encode text to base64

**Syntax**: `{param:base64}`

**Original Value**: 

```
Sample text to test base64 encoding
```

**Formatted Value**:

```
U2FtcGxlIHRleHQgdG8gdGVzdCBiYXNlNjQgZW5jb2Rpbmc=
```

## Formatting parameters using JSONPath
For string parameters that are JSON content, you can use [JSONPath](workbooks-jsonpath.md) in the parameter format string.

For example, you may have a string parameter named `selection` that was the result of a query or selection in a visualization that has the following value
```json 
{ "series":"Failures", "x": 5, "y": 10 }
```

Using JSONPath, you could get individual values from that object:

format | result
---|---
`{selection:$.series}` | `Failures`
`{selection:$.x}` | `5`
`{selection:$.y}`| `10`

> [!NOTE]
> If the parameter value is not valid json, the result of the format will be an empty value.

## Parameter Style
The following styles are available for the parameters.
### Pills
In pills style, the default style, the parameters look like text, and require the user to select them once to go into the edit mode.

   :::image type="content" source="media/workbooks-parameters/workbooks-pills-read-mode.png" alt-text="Screenshot showing Workbooks pill style read mode.":::

   :::image type="content" source="media/workbooks-parameters/workbooks-pills-edit-mode.png" alt-text="Screenshot that shows Workbooks pill style edit mode.":::   

### Standard
In standard style, the controls are always visible, with a label above the control.

   :::image type="content" source="media/workbooks-parameters/workbooks-standard.png" alt-text="Screenshot that shows Workbooks standard style.":::

### Form Horizontal
In horizontal style form, the controls are always visible, with label on left side of the control.

   :::image type="content" source="media/workbooks-parameters/workbooks-form-horizontal.png" alt-text="Screenshot that shows Workbooks form horizontal style.":::

### Form Vertical
In vertical style from, the controls are always visible, with label above the control. Unlike standard style, there is only one label or control in one row. 

   :::image type="content" source="media/workbooks-parameters/workbooks-form-vertical.png" alt-text="Screenshot that shows Workbooks form vertical style.":::
 
> [!NOTE]
> In standard, form horizontal, and form vertical layouts, there's no concept of inline editing, the controls are always in edit mode. 

## Global parameters
Now that you've learned how parameters work, and the limitations about only being able to use a parameter "downstream" of where it is set, it is time to learn about global parameters, which change those rules.

With a global parameter, the parameter must still be declared before it can be used, but any step that sets a value to that parameter will affect all instances of that parameter in the workbook. 

> [!NOTE]
> Because changing a global parameter has this "update all" behavior, The global setting should only be turned on for parameters that require this behavior. A combination of global parameters that depend on each other can create a cycle or oscillation where the competing globals change each other over and over. In order to avoid cycles, you cannot "redeclare" a parameter that's been declared as global. Any subsequent declarations of a parameter with the same name will create a read only parameter that cannot be edited in that place.

Common uses of global parameters:

1. Synchronizing time ranges between many charts. 
    - without a global parameter, any time range brush in a chart will only be exported after that chart, so selecting a time range in the third chart will only update the fourth chart
    - with a global parameter, you can create a global **timeRange** parameter, give it a default value, and have all the other charts use that as their bound time range and as their time brush output (additionally setting the "only export the parameter when the range is brushed" setting). Any change of time range in any chart will update the global **timeRange** parameter at the top of the workbook. This can be used to make a workbook act like a dashboard.

1. Allowing changing the selected tab in a links step via links or buttons
    - without a global parameter, the links step only outputs a parameter for the selected tab
    - with a global parameter, you can create a global **selectedTab** parameter, and use that parameter name in the tab selections in the links step. This allows you to pass that parameter value into the workbook from a link, or by using another button or link to change the selected tab. Using buttons from a links step in this way can make a wizard-like experience, where buttons at the bottom of a step can affect the visible sections above it.


### Create a global parameter
When creating the parameter in a parameters step, use the "Treat this parameter as a global" option in advanced settings. The only way to make a global parameter is to declare it with a parameters step. The other methods of creating parameters (via selections, brushing, links, buttons, tabs) can only update a global parameter, they cannot themselves declare one.

   :::image type="content" source="media/workbooks-parameters/workbooks-parameters-global-setting.png" alt-text="Screenshot of setting global parameters in Workbooks.":::   

The parameter will be available and function as normal parameters do.

### Updating the value of an existing global parameter
For the chart example above, the most common way to update a global parameter is by using Time Brushing.  

In this example, the **timerange** parameter above is declared as a global. In a query step below that, create and run a query that uses that **timerange** parameter in the query and returns a time chart result. In the advanced settings for the query step, enable the time range brushing setting, and use the same parameter name as the output for the time brush parameter, and also set the only export the parameter when brushed option.

   :::image type="content" source="media/workbooks-parameters/workbooks-global-time-range-brush.png" alt-text="Screenshot of global time brush setting in Workbooks.":::

Whenever a time range is brushed in this chart, it will also update the **timerange** parameter above this query, and the query step itself (since it also depends on **timerange**!):

 1. Before brushing:
 
    - The time range is shown as "last hour".
    - The chart shows the last hour of data.

    :::image type="content" source="media/workbooks-parameters/workbooks-global-before-brush.png" alt-text="Screenshot of setting global parameters before brushing.":::  

 1. During brushing:
 
    - The time range is still last hour, and the brushing outlines are drawn.
    - No parameters/etc have changed. once you let go of the brush, the time range will be updated.

    :::image type="content" source="media/workbooks-parameters/workbooks-global-during-brush.png" alt-text="Screenshot of setting global parameters during brushing.":::  

   
 1. After brushing:

    - The time range specified by the time brush will be set by this step, overriding the global value (the timerange dropdown now displays that custom time range).
    - Because the global value at the top has changed, and because this chart depends on **timerange** as an input, the time range of the query used in the chart will also update, causing the query to and the chart to update.
     - Any other steps in the workbook that depend on **timerange** will also update.

    :::image type="content" source="media/workbooks-parameters/workbooks-global-after-brush.png" alt-text="Screenshot of setting global parameters after brushing.":::  

    > [!NOTE]
    > If you do not use a global parameter, the **timerange** parameter value will only change below this query step, things above or this item itself would not update.