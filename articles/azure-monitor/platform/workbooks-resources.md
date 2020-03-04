---
title: Azure Monitor workbooks resource parameters
description: Simplify complex reporting with prebuilt and custom parameterized workbooks
services: azure-monitor
author: mrbullwinkle
manager: carmonm

ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 10/23/2019
ms.author: mbullwin
---

# Workbook resource parameters

Resource parameters allow picking of resources in workbooks. This is useful in setting the scope from which to get the data from. An example is allowing users to select the set of VMs, which the charts later will use when presenting the data.

Values from resource pickers can come from the workbook context, static list or from Azure Resource Graph queries.

## Creating a resource parameter (workbook resources)
1. Start with an empty workbook in edit mode.
2. Choose _Add parameters_ from the links within the workbook.
3. Click on the blue _Add Parameter_ button.
4. In the new parameter pane that pops up enter:
    1. Parameter name: `Applications`
    2. Parameter type: `Resource picker`
    3. Required: `checked`
    4. Allow multiple selections: `checked`
5. Get data from: `Workbook Resources`
6. Include only resource types: `Application Insights`
7. Choose 'Save' from the toolbar to create the parameter.

![Image showing the creation of a resource parameter using workbook resources](./media/workbooks-resources/resource-create.png)

## Creating a resource parameter (Azure Resource Graph)
1. Start with an empty workbook in edit mode.
2. Choose _Add parameters_ from the links within the workbook.
3. Click on the blue _Add Parameter_ button.
4. In the new parameter pane that pops up enter:
    1. Parameter name: `Applications`
    2. Parameter type: `Resource picker`
    3. Required: `checked`
    4. Allow multiple selections: `checked`
5. Get data from: `Query`
    1. Query Type: `Azure Resource Graph`
    2. Subscriptions: `Use default subscriptions`
    3. In the query control, add this snippet
    ```kusto
    where type == 'microsoft.insights/components'
    | project value = id, label = name, selected = false, group = resourceGroup
    ```
7. Choose 'Save' from the toolbar to create the parameter.

![Image showing the creation of a resource parameter using Azure Resource Graph](./media/workbooks-resources/resource-query.png)

> [!NOTE]
> Azure Resource Graph is not yet available in all clouds. Ensure that it is supported in your target cloud if you choose this approach.

[Azure Resource Graph documentation](https://docs.microsoft.com/azure/governance/resource-graph/overview)

## Creating a resource parameter  (JSON list)
1. Start with an empty workbook in edit mode.
2. Choose _Add parameters_ from the links within the workbook.
3. Click on the blue _Add Parameter_ button.
4. In the new parameter pane that pops up enter:
    1. Parameter name: `Applications`
    2. Parameter type: `Resource picker`
    3. Required: `checked`
    4. Allow multiple selections: `checked`
5. Get data from: `JSON`
    1. In the content control, add this json snippet
    ```json
    [
        { "value":"/subscriptions/<sub-id>/resourceGroups/<resource-group>/providers/<resource-type>/acmeauthentication", "label": "acmeauthentication", "selected":true, "group":"Acme Backend" },
        { "value":"/subscriptions/<sub-id>/resourceGroups/<resource-group>/providers/<resource-type>/acmeweb", "label": "acmeweb", "selected":false, "group":"Acme Frontend" }
    ]
    ```
    2. Hit the blue _Update_ button.
6. Optionally set the `Include only resource types` to _Application Insights_
7. Choose 'Save' from the toolbar to create the parameter.

## Referencing a resource parameter
1. Add a query control to the workbook and select an Application Insights resource.
2. Use the _Application Insights_ drop down to bind the parameter to the control. Doing this sets the scope of the query to the resources returned by the parameter at run time.
4. In the KQL control, add this snippet
    ```kusto
    requests
    | summarize Requests = count() by appName, name
    | order by Requests desc
    ```
5. Run query to see the results. 

![Image showing a resource parameter referenced in a query control](./media/workbooks-resources/resource-reference.png)

> This approach can be used to bind resources to other controls like metrics.

## Resource parameter options
| Parameter | Explanation | Example |
| ------------- |:-------------|:-------------|
| `{Applications}` | The selected resource ID | _/subscriptions/<sub-id>/resourceGroups/<resource-group>/providers/<resource-type>/acmeauthentication_ |
| `{Applications:label}` | The label of the selected resource | `acmefrontend` |
| `{Applications:value}` | The value of the selected resource | _'/subscriptions/<sub-id>/resourceGroups/<resource-group>/providers/<resource-type>/acmeauthentication'_ |
| `{Applications:name}` | The name of the selected resource | `acmefrontend` |
| `{Applications:resourceGroup}` | The resource group of the selected resource | `acmegroup` |
| `{Applications:resourceType}` | The type of the selected resource | _microsoft.insights/components_ |
| `{Applications:subscription}` | The subscription of the selected resource |  |
| `{Applications:grid}` | A grid showing the resource properties. Useful to render in a text block while debugging  |  |

## Next steps

* [Get started](workbooks-visualizations.md) learning more about workbooks many rich visualizations options.
* [Control](workbooks-access-control.md) and share access to your workbook resources.
