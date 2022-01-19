---
title: Azure Monitor workbooks text parameters 
description: Simplify complex reporting with prebuilt and custom parameterized workbooks. Learn more about workbook text parameters.
services: azure-monitor

ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 07/02/2021
---

# Workbook text parameters

Textbox parameters provide a simple way to collect text input from workbook users. They're used when it isn't practical to use a drop-down to collect the input (for example, an arbitrary threshold or generic filters). Workbooks allow authors to get the default value of the textbox from a query. This allows interesting scenarios like setting the default threshold based on the p95 of the metric.

A common use of textboxes is as internal variables used by other workbook controls. This is done by using a query for default values, and making the input control invisible in read-mode. For example, a user may want a threshold to come from a formula (not a user) and then use the threshold in subsequent queries.

## Creating a text parameter
1. Start with an empty workbook in edit mode.
2. Choose _Add parameters_ from the links within the workbook.
3. Select on the blue _Add Parameter_ button.
4. In the new parameter pane that pops up enter:
    1. Parameter name: `SlowRequestThreshold`
    2. Parameter type: `Text`
    3. Required: `checked`
    4. Get data from: `None`
5. Choose 'Save' from the toolbar to create the parameter.

    :::image type="content" source="./media/workbooks-text/text-create.png" alt-text="Screenshot showing the creation of a text parameter.":::

This is how the workbook will look like in read-mode.

:::image type="content" source="./media/workbooks-text/text-readmode.png" alt-text="Screenshot showing a text parameter in read mode." border="false":::

## Parameter field style
Text parameter supports following field style:

- Standard: A single line text field.

     :::image type="content" source="./media/workbooks-text/standard-text.png" alt-text="Screenshot showing standard text field.":::

- Password: A single line password field. The password value is only hidden on UI when user types. The value is still fully accessible as a param value when referred and it's stored unencrypted when workbook is saved.

     :::image type="content" source="./media/workbooks-text/password-text.png" alt-text="Screenshot showing password field.":::

- Multiline: A multiline text field with support of rich intellisense and syntax colorization for following languages:
    - Text
    - Markdown
    - JSON
    - SQL
    - TypeScript
    - KQL
    - TOML

    User can also specify the height for the multiline editor.

     :::image type="content" source="./media/workbooks-text/kql-text.png" alt-text="Screenshot showing multiline text field.":::

## Referencing a text parameter
1. Add a query control to the workbook by selecting the blue `Add query` link and select an Application Insights resource.
2. In the KQL box, add this snippet:
    ```kusto
    requests
    | summarize AllRequests = count(), SlowRequests = countif(duration >= {SlowRequestThreshold}) by name
    | extend SlowRequestPercent = 100.0 * SlowRequests / AllRequests
    | order by SlowRequests desc
    ```
3. By using the text parameter with a value of 500 coupled with the query control you effectively running the query below:
    ```kusto
    requests
    | summarize AllRequests = count(), SlowRequests = countif(duration >= 500) by name
    | extend SlowRequestPercent = 100.0 * SlowRequests / AllRequests
    | order by SlowRequests desc
    ```
4. Run query to see the results

    :::image type="content" source="./media/workbooks-text/text-reference.png" alt-text="Screenshot showing a text parameter referenced in KQL.":::

> [!NOTE]
> In the example above, `{SlowRequestThreshold}` represents an integer value. If you were querying for a string like `{ComputerName}` you would need to modify your Kusto query to add quotes `"{ComputerName}"` in order for the parameter field to an accept input without quotes.

## Setting default values using queries
1. Start with an empty workbook in edit mode.
2. Choose _Add parameters_ from the links within the workbook.
3. Select on the blue _Add Parameter_ button.
4. In the new parameter pane that pops up enter:
    1. Parameter name: `SlowRequestThreshold`
    2. Parameter type: `Text`
    3. Required: `checked`
    4. Get data from: `Query`
5. In the KQL box, add this snippet:
    ```kusto
    requests
    | summarize round(percentile(duration, 95), 2)
    ```
    This query sets the default value of the text box to the 95th percentile duration for all requests in the app.
6. Run query to see the result
7. Choose 'Save' from the toolbar to create the parameter.

    :::image type="content" source="./media/workbooks-text/text-default-value.png" alt-text="Screenshot showing a text parameter with default value from KQL.":::

> [!NOTE]
> While this example queries Application Insights data, the approach can be used for any log based data source - Log Analytics, Azure Resource Graph, etc.

## Adding validations 

For standard and password text parameters, user can add validation rules that are applied to the text field. Add a valid regex with error message. If message is set, it's shown as error when field is invalid.

If match is selected, the field is valid if value matches the regex and if match isn't selected then the field is valid if it doesn't match the regex.

:::image type="content" source="./media/workbooks-text/validation-settings.png" alt-text="Screenshot of text validation settings.":::

## Format JSON data 

If JSON is selected as the language for the multiline text field, then the field will have a button that will format the JSON data of the field. User can also use the shortcut `(ctrl + \)` to format the JSON data.

If data is coming from a query, user can select the option to pre-format the JSON data returned by the query.

:::image type="content" source="./media/workbooks-text/pre-format-json-data.png" alt-text="Screenshot of pre-format JSON data.":::

## Next steps

* [Get started](./workbooks-overview.md#visualizations) learning more about workbooks many rich visualizations options.
* [Control](./workbooks-access-control.md) and share access to your workbook resources.