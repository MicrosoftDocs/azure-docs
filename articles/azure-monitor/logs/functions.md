---
title: Functions in Azure Monitor log queries
description: This article describes how to use functions to call a query from another log query in Azure Monitor.
ms.topic: conceptual
author: guywild
ms.author: guywild
ms.reviewer: roygal
ms.date: 06/22/2022

---

# Functions in Azure Monitor log queries
A function is a log query in Azure Monitor that can be used in other log queries as though it's a command. You can use functions to provide solutions to different customers and also reuse query logic in your own environment. This article describes how to use functions and how to create your own.

## Permissions required

- To view or use functions, you need `Microsoft.OperationalInsights/workspaces/query/*/read` permissions to the Log Analytics workspace, as provided by the [Log Analytics Reader built-in role](./manage-access.md#log-analytics-reader), for example.

- To create or edit functions, you need `microsoft.operationalinsights/workspaces/savedSearches/write` permissions to the Log Analytics workspace, as provided by the [Log Analytics Reader built-in role](./manage-access.md#log-analytics-reader), for example.

## Types of functions
There are two types of functions in Azure Monitor:

- **Solution functions:** Prebuilt functions are included with Azure Monitor. These functions are available in all Log Analytics workspaces and can't be modified.
- **Workspace functions:** These functions are installed in a particular Log Analytics workspace. They can be modified and controlled by the user.

## View functions
You can view solution functions and workspace functions in the current workspace on the **Functions** tab in the left pane of a Log Analytics workspace. Use **Filter** to filter the functions included in the list. Use **Group by** to change their grouping. Enter a string in the **Search** box to locate a particular function. Hover over a function to view details about it, including a description and parameters.

:::image type="content" source="media/functions/view-functions.png" alt-text="Screenshot that shows viewing a function." lightbox="media/functions/view-functions.png":::

## Use a function
Use a function in a query by typing its name with values for any parameters the same as you would type in a command. The output of the function can either be returned as results or piped to another command.

Add a function to the current query by double-clicking on its name or hovering over it and selecting **Use in editor**. Functions in the workspace will also be included in IntelliSense as you type in a query.

If a query requires parameters, provide them by using the syntax `function_name(param1,param2,...)`.

:::image type="content" source="media/functions/function-use.png" alt-text="Screenshot that shows using a function." lightbox="media/functions/function-use.png":::

## Create a function
To create a function from the current query in the editor, select **Save** > **Save as function**.

:::image type="content" source="media/functions/function-save.png" alt-text="Screenshot that shows creating a function." lightbox="media/functions/function-save.png":::

Create a function with Log Analytics in the Azure portal by selecting **Save** and then providing the information in the following table:

| Setting | Description |
|:---|:---|
| Function name  | Name for the function. The name may not include a space or any special characters. It also may not start with an underscore (_) because this character is reserved for solution functions. |
| Legacy category | User-defined category to help filter and group functions.   |
| Save as computer group | Save the query as a [computer group](computer-groups.md).  |
| Parameters | Add a parameter for each variable in the function that requires a value when it's used. For more information, see [Function parameters](#function-parameters). |

:::image type="content" source="media/functions/function-details.png" alt-text="Screenshot that shows function details." lightbox="media/functions/function-details.png":::

## Function parameters 
You can add parameters to a function so that you can provide values for certain variables when you call it. As a result, the same function can be used in different queries, each providing different values for the parameters. Parameters are defined by the following properties:

| Setting | Description |
|:---|:---|
| Type  | Data type for the value. |
| Name  | Name for the parameter. This name must be used in the query to replace with the parameter value.  |
| Default value | Value to be used for the parameter if a value isn't provided. |

Parameters are ordered as they're created. Parameters that have no default value are positioned in front of parameters that have a default value.

> [!NOTE] 
> Classic Application Insights resources don't support parameterized functions. If you have a [workspace-based Application Insights resource](../app/create-workspace-resource.md), you can create parameterized functions from your Log Analytics workspace. For information on migrating your Classic Application Insights resource to a workspace-based resource, see [Migrate to workspace-based Application Insights resources](../app/convert-classic-resource.md).

## Work with function code
You can view the code of a function either to gain insight into how it works or to modify the code for a workspace function. Select **Load the function code** to add the function code to the current query in the editor.

If you add the function code to an empty query or the first line of an existing query, the function name is added to the tab. A workspace function enables the option to edit the function details.

:::image type="content" source="media/functions/function-code.png" alt-text="Screenshot that shows loading function code." lightbox="media/functions/function-code.png":::

## Edit a function
Edit the properties or the code of a function by creating a new query. Hover over the name of the function and select **Load function code**. Make any modifications that you want to the code and select **Save**. Then select **Edit function details**. Make any changes you want to the properties and parameters of the function and select **Save**.

:::image type="content" source="media/functions/function-edit.png" alt-text="Screenshot that shows editing a function." lightbox="media/functions/function-edit.png":::

## Example
The following sample function returns all events in the Azure activity log since a particular date and that match a particular category.

Start with the following query by using hardcoded values to verify that the query works as expected.

```Kusto
AzureActivity
| where CategoryValue == "Administrative"
| where TimeGenerated > todatetime("2021/04/05 5:40:01.032 PM")
```

:::image type="content" source="media/functions/example-query.png" alt-text="Screenshot that shows the initial query." lightbox="media/functions/example-query.png":::

Next, replace the hardcoded values with parameter names. Then save the function by selecting **Save** > **Save as function**.

```Kusto
AzureActivity
| where CategoryValue == CategoryParam
| where TimeGenerated > DateParam
```

:::image type="content" source="media/functions/example-save-function.png" alt-text="Screenshot that shows saving the function." lightbox="media/functions/example-save-function.png":::

 Provide the following values for the function properties:

| Property | Value |
|:---|:---|
| Function name | AzureActivityByCategory |
| Legacy category | Demo functions |

Define the following parameters before you save the function:

| Type | Name | Default value |
|:---|:---|:---|
| string   | CategoryParam | "Administrative" |
| datetime | DateParam     | |

:::image type="content" source="media/functions/example-function-properties.png" alt-text="Screenshot that shows function properties." lightbox="media/functions/example-function-properties.png":::

Create a new query and view the new function by hovering over it. Look at the order of the parameters. They must be specified in this order when you use the function.

:::image type="content" source="media/functions/example-view-details.png" alt-text="Screenshot that shows viewing details." lightbox="media/functions/example-view-details.png":::

Select **Use in editor** to add the new function to a query. Then add values for the parameters. You don't need to specify a value for `CategoryParam` because it has a default value.

:::image type="content" source="media/functions/example-use-function.png" alt-text="Screenshot that shows adding values for parameters." lightbox="media/functions/example-use-function.png":::

## Next steps
See [String operations](/azure/data-explorer/kusto/query/samples?&pivots=azuremonitor#string-operations) for more information on how to write Azure Monitor log queries.
