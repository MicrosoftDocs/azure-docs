---
title: Azure Monitor workbook dropdown parameters
description: Use dropdown parameters to simplify complex reporting with prebuilt and custom parameterized workbooks.
services: azure-monitor
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 06/21/2023
---

# Workbook dropdown parameters

By using dropdown parameters, you can collect one or more input values from a known set. For example, you can use a dropdown parameter to select one of your app's requests. Dropdown parameters also provide a user-friendly way to collect arbitrary inputs from users. Dropdown parameters are especially useful in enabling filtering in your interactive reports.

The easiest way to specify a dropdown parameter is by providing a static list in the parameter setting. A more interesting way is to get the list dynamically via a KQL query. You can also specify whether it's single or multi-select by using parameter settings. If it's multi-select, you can specify how the result set should be formatted, for example, as delimiter or quotation.

## Building dropdown parameters (value, label, selection, and group)
When using either static JSON content or getting dynamic values from queries, dropdown parameters allow up to four fields of information, in this specific order:

1. `value` (required): the first column / field in the data is used as the literal value of the parameter. In the case of simple static JSON parameters, it can be as simple as the JSON content `["dev", "test", "prod"]`, which would create a dropdown of three items with those values as both the value and the label in the dropdown. The name of this field doesn't need to be `value`, the dropdown will use the first field in the data no matter the name.
1. `label` (optional): the second column / field in the data is used as the display name/label of the parameter in the dropdown. If not specified, the value is used as the label. The name of this field doesn't need to be `label`, the dropdown will use the second field in the data no matter the name.
1. `selected` (optional): the third column / field in the data is used to specify which value should be selected by default. If not specified, no items are selected by default. The selection behavior is based on the JavaScript "falsy" concept, so values like `0`, `false`, `null`, or empty strings are treated as not selected. The name of this field doesn't need to be `selected`, the dropdown will use the third field in the data no matter the name.

    > [!NOTE]
    > This only controls *default* selection, once a user has selected values in the dropdown, those user selected values are used. Even if a subsequent query for the parameter runs and returns new default values. To return to the default selection, the use can use the "Default Items" option in the dropdown, which will re-query the default values and apply them.
    >
    > Default values are only applied if no items have been selected by the user.
    >
    > If a subsequent query returns items that do *not* include previously selected values, the missing values are removed from the selection. The selected items in the dropdown will become the intersection of the items returned by the query and the items that were previously selected.

1. `group` (optional): unlike the other fields, the grouping column *must* be named `group` and appear after `value`, `label` and `selected`. This field in the data is used to group the items in the dropdown. If not specified, no grouping is used. If default selection isn't needed, the data/query must still return a `selected` field in at least one object/row, even if all the values are `false`.

> [!NOTE]note: any other fields in the data are  ignored by the dropdown parameter. It is suggested to limit the content to just those fields used by the dropdown to avoid complicated queries returning data that is ignored.

## Create a static dropdown parameter

1. Start with an empty workbook in edit mode.
1. Select **Add parameters** > **Add Parameter**.
1. In the new parameter pane that opens, enter:
    1. **Parameter name**: `Environment`
    1. **Parameter type**: `Drop down`
    1. **Required**: `checked`
    1. **Allow multiple selections**: `unchecked`
    1. **Get data from**: `JSON` or, select `Query` and select the `JSON` data source.
        
        The JSON data source allows the JSON content to reference any existing parameters.
1. In the **JSON Input** text block, insert this JSON snippet:

    ```json
    [
        { "value":"dev", "label":"Development" },
        { "value":"ppe", "label":"Pre-production" },
        { "value":"prod", "label":"Production", "selected":true }
    ]
    ```

1. Select **Update**.
1. Select **Save** to create the parameter.
1. The **Environment** parameter is a dropdown list with the three values.
    <!-- convertborder later -->
    :::image type="content" source="./media/workbooks-dropdowns/dropdown-create.png" lightbox="./media/workbooks-dropdowns/dropdown-create.png" alt-text="Screenshot that shows the creation of a static dropdown parameter." border="false":::

## Create a static dropdown list with groups of items

If your query result/JSON contains a `group` field, the dropdown list displays groups of values. Follow the preceding sample, but use the following JSON instead:

```json
[
    { "value":"dev", "label":"Development", "group":"Development" },
    { "value":"dev-cloud", "label":"Development (Cloud)", "group":"Development" },
    { "value":"ppe", "label":"Pre-production", "group":"Test" },
    { "value":"ppe-test", "label":"Pre-production (Test)", "group":"Test" },
    { "value":"prod1", "label":"Prod 1", "selected":true, "group":"Production" },
    { "value":"prod2", "label":"Prod 2", "group":"Production" }
]
```
<!-- convertborder later -->
:::image type="content" source="./media/workbooks-dropdowns/grouped-dropDown.png" lightbox="./media/workbooks-dropdowns/grouped-dropDown.png" alt-text="Screenshot that shows an example of a grouped dropdown list." border="false":::

> [!NOTE] 
> When using a `group` field in your query, you must also supply a value for `label` and `selected` fields.

## Create a dynamic dropdown parameter

1. Start with an empty workbook in edit mode.
1. Select **Add parameters** > **Add Parameter**.
1. In the new parameter pane that opens, enter:
    1. **Parameter name**: `RequestName`
    1. **Parameter type**: `Drop down`
    1. **Required**: `checked`
    1. **Allow multiple selections**: `unchecked`
    1. **Get data from**: `Query`
1. In the **JSON Input** text block, insert this JSON snippet:

    ```kusto
        requests
        | summarize by name
        | order by name asc
    ```

1. Select **Run Query**.
1. Select **Save** to create the parameter.
1. The **RequestName** parameter is a dropdown list with the names of all requests in the app.
    <!-- convertborder later -->
    :::image type="content" source="./media/workbooks-dropdowns/dropdown-dynamic.png" lightbox="./media/workbooks-dropdowns/dropdown-dynamic.png" alt-text="Screenshot that shows the creation of a dynamic dropdown parameter." border="false":::

## Example: Custom labels, selecting the first item by default, and grouping by operation name
The query used in the preceding dynamic dropdown parameter returns a list of values that are rendered faithfully in the dropdown list. But what if you wanted a different display name or one of the names to be selected? Dropdown parameters use value, label, selection, and group columns for this functionality.

The following sample shows how to get a list of distinct Application Insights dependencies. The display names are styled with an emoji, the first item is selected by default, and the items are grouped by operation names:

```kusto
dependencies
| summarize by operation_Name, name
| where name !contains ('.')
| order by name asc
| serialize Rank = row_number()
| project value = name, label = strcat('🌐 ', name), selected = iff(Rank == 1, true, false), group = operation_Name
```
<!-- convertborder later -->
:::image type="content" source="./media/workbooks-dropdowns/dropdown-more-options.png" lightbox="./media/workbooks-dropdowns/dropdown-more-options.png" alt-text="Screenshot that shows a dropdown parameter using value, label, selection, and group options." border="false":::

## Reference a dropdown parameter

You can reference dropdown parameters anywhere that parameters can be used, including replacing the parameter value into queries, visualization settings, Markdown text content, or other places where you can select a parameter as an option.

### In KQL

1. Select **Add query** to add a query control, and then select an Application Insights resource.
1. In the KQL editor, enter this snippet:

    ```kusto
        requests
        | where name == '{RequestName}'
        | summarize Requests = count() by bin(timestamp, 1h)

    ```

1. The snippet expands on query evaluation time to:

    ```kusto
        requests
        | where name == 'GET Home/Index'
        | summarize Requests = count() by bin(timestamp, 1h)
    ```

1. Select the **Run query** to see the results. Optionally, render it as a chart.
    <!-- convertborder later -->
    :::image type="content" source="./media/workbooks-dropdowns/dropdown-reference.png" lightbox="./media/workbooks-dropdowns/dropdown-reference.png" alt-text="Screenshot that shows a dropdown parameter referenced in KQL." border="false":::

## Dropdown parameter options

| Parameter | Description | Example |
| ------------- |:-------------|:-------------|
| `{DependencyName}` | The selected value | GET fabrikamaccount |
| `{DependencyName:value}` | The selected value (same as above) | GET fabrikamaccount |
| `{DependencyName:label}` | The selected label | 🌐 GET fabrikamaccount |
| `{DependencyName:escape}` | The selected value, with any common quote characters replaced when formatted into queries | GET fabrikamaccount |

## Multiple selection

The examples so far explicitly set the parameter to select only one value in the dropdown list. Dropdown parameters also support *multiple selection*. To enable this option, select the **Allow multiple selections** checkbox.

You can specify the format of the result set via the **Delimiter** and **Quote with** settings. By default, `,` (comma) is used as the delimiter, and `'` (single quote) is used as the quote character. The default returns the values as a collection in the form of `'a', 'b', 'c'` when formatted into the query. You can also limit the maximum number of selections.

When using a multiple select parameter in a query, the KQL referencing the parameter needs to change to work with the format of the result. A single value parameter doesn't include any quotes when formatted into a query, so the usual behavior is to include the quotes in the query itself, like `where name == '{parameter}'`. When using a multiple select parameter, the quotes are included in the formatted parameter, so the query shouldn't include them, like `where name in ({parameter})`. Note how this example also switched from `name ==` to `name in`. The `==` operator only allows a single value, while the `in` operator allows multiple values.

```kusto
dependencies
| where name in ({DependencyName})
| summarize Requests = count() by bin(timestamp, 1h), name
```

This example shows the multi-select dropdown parameter at work:
<!-- convertborder later -->
:::image type="content" source="./media/workbooks-dropdowns/dropdown-multiselect.png" lightbox="./media/workbooks-dropdowns/dropdown-multiselect.png" alt-text="Screenshot that shows a multi-select dropdown parameter." border="false":::

## Dropdown special selections

Dropdown parameters also allow you to specify special values that  also appear in the dropdown:
* Any one
* Any three
* ...
* Any 100
* Any custom limit
* All

When these special items are selected, the parameter value is automatically set to the specific number of items, or all values.

### Special casing All, and allowing an empty selection to be treated as All

When you select the **All** option, an extra field appears, which allows you to specify that a special value that is used for the parameter if the **All** option is selected. This special value is useful for cases where "All" could be a large number of items and could generate a very large query.

:::image type="content" source="./media/workbooks-dropdowns/dropdown-all.png" alt-text="Screenshot of the New Parameter window in the Azure portal. The All option is selected and the All option and Select All value field are highlighted." lightbox="./media/workbooks-dropdowns/dropdown-all.png":::

In this specific case, the string `[]` is used instead of a value. This string can be used to generate an empty array in the logs query, like:

```kusto
let selection = dynamic([{Selection}]);
SomeQuery 
| where array_length(selection) == 0 or SomeField in (selection)
```

If all items are selected, the value of `Selection` is `[]`, producing an empty array for the `selection` variable in the query. If no values are selected, the value of `Selection` is formatted as empty string, also resulting in an empty array. If any values are selected, they're formatted inside the dynamic part of the query, causing the array to have those values. You can then test for `array_length` of 0 to have the filter not apply or use the `in` operator to filter on the values in the array.

Other common examples use '*' as the special marker value when a parameter is required, and then test with:

```kusto
| where "*" in ({Selection}) or SomeField in ({Selection})
```

## Next steps

[Learn about the types of visualizations you can use to create rich visual reports with Azure Workbooks](workbooks-visualizations.md).
