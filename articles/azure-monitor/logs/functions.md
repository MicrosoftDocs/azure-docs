---
title: Functions in Azure Monitor log queries
description: This article describes how to use functions to call a query from another log query in Azure Monitor.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 04/19/2021

---

# Functions in Azure Monitor log queries
A function is a log query in Azure Monitor that can be used in other log queries as though it's a command. Functions allow developers to provide solutions to different customers and for you to reuse query logic in your own environment. This article provides details on how to use functions and how to create your own.

## Types of functions
There are two types of functions in Azure Monitor:

- **Solution function:** Pre-built functions included with Azure Monitor. These are available in all Log Analytics workspaces and can't be modified.
- **Workspace functions:** Functions installed in a particular Log Analytics workspace and can be modified and controlled by the user.

## Viewing functions
You can view solution functions and workspace functions in the current workspace from the **Functions** tab in the left pane of a Log Analytics workspace. Use the **Filter** button to filter the functions included in the list and **Group by** to change their grouping. Type a string into the **Search** box to locate a particular function. Hover over a function to view details about it including a description and parameters.

:::image type="content" source="media/functions/view-functions.png" alt-text="View function" lightbox="media/functions/view-functions.png":::

## Use a function
Use a function in a query by typing its name with values for any parameters just as you would type in a command. The output of the function can either be returned as results or piped to another command.

Add a function to the current query by double-clicking on its name or hovering over it and selecting **Use in editor**. Functions in the workspace will also be included in intellisense as you type in a query. 

If a query requires parameters, provide them using the syntax: `function_name(param1,param2,...)`.

:::image type="content" source="media/functions/function-use.png" alt-text="Use a function" lightbox="media/functions/function-use.png":::

## Create a function
To create a function from the current query in the editor, select **Save** and then **Save as function**. 

:::image type="content" source="media/functions/function-save.png" alt-text="Create a function" lightbox="media/functions/function-save.png":::

Create a function with Log Analytics in the Azure portal by clicking **Save** and then providing the information in the following table.

| Setting | Description |
|:---|:---|
| Function Name  | Name for the function. This may not include a space or any special characters. It also may not start with an underscore (_) since this character is reserved for solution functions. |
| Legacy category | User defined category to help filter and group functions.   |
| Save as computer group | Save the query as a [computer group](computer-groups.md).  |
| Parameters | Add a parameter for each variable in the function that requires a value when it's used. See [Function parameters](#function-parameters) for details. |

:::image type="content" source="media/functions/function-details.png" alt-text="Function details" lightbox="media/functions/function-details.png":::

## Function parameters 
You can add parameters to a function so that you can provide values for certain variables when calling it. This allows the same function to be used in different queries, each providing different values for the parameters. Parameters are defined by the following properties.

| Setting | Description |
|:---|:---|
| Type  | Data type for the value. |
| Name  | Name for the parameter. This is the name that must be used in the query to replace with the parameter value.  |
| Default value | Value to be used for the parameter if a value isn't provided. |

Parameters are ordered as they are created with any parameters that have no default value positioned in front of those that have a default value.

## Working with function code
You can view the code of a function either to gain insight into how it works or to modify the code for a workspace function. Select **Load the function code** to add the function code to the current query in the editor. If you add it to an empty query or the first line of an existing query, then it will add the function name to the tab. If it's a workspace function, then this enables the option to edit the function details.

:::image type="content" source="media/functions/function-code.png" alt-text="Load function code" lightbox="media/functions/function-code.png":::

## Edit a function
Edit the properties or the code of a function by creating a new query and then hover over the name of the function and select **load function code**. Make any modifications that you want to the code and select **Save** and then **Edit function details**. Make any changes you want to the properties and parameters of the function before clicking **Save**.

:::image type="content" source="media/functions/function-edit.png" alt-text="Edit function" lightbox="media/functions/function-edit.png":::
## Example
The following sample function returns all events in the Azure Activity log since a particular date and that match a particular category. 

Start with the following query using hardcoded values. This verifies that the query works as expected.

```Kusto
AzureActivity
| where CategoryValue == "Administrative"
| where TimeGenerated > todatetime("2021/04/05 5:40:01.032 PM")
```

:::image type="content" source="media/functions/example-query.png" alt-text="Example function - initial query" lightbox="media/functions/example-query.png":::

Next, replace the hardcoded values with parameter names and then save the function by selecting **Save** and then **Save as function**.

```Kusto
AzureActivity
| where CategoryValue == CategoryParam
| where TimeGenerated > DateParam
```

:::image type="content" source="media/functions/example-save-function.png" alt-text="Example function - save function" lightbox="media/functions/example-save-function.png":::

 Provide the following values for the function properties.

| Property | Value |
|:---|:---|
| Function name | AzureActivityByCategory |
| Legacy category | Demo functions |

Define the following parameters before saving the function.

| Type | Name | Default value |
|:---|:---|:---|
| string   | CategoryParam | "Administrative" |
| datetime | DateParam     | |

:::image type="content" source="media/functions/example-function-properties.png" alt-text="Example function - function properties" lightbox="media/functions/example-function-properties.png":::

Create a new query and view the new function by hovering over it. Note the order of the parameters since this is the order they must be specified when you use the function.

:::image type="content" source="media/functions/example-view-details.png" alt-text="Example function - view details" lightbox="media/functions/example-view-details.png":::

Select **Use in editor** to add the new function to a query and then add values for the parameters. Note that you don't need to specify a value for CategoryParam because it has a default value.

:::image type="content" source="media/functions/example-use-function.png" alt-text="Example function - use function" lightbox="media/functions/example-use-function.png":::



## Next steps
See other lessons for writing Azure Monitor log queries:

- [String operations](/azure/data-explorer/kusto/query/samples?&pivots=azuremonitor#string-operations)

