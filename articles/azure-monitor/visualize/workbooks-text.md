---
title: Azure Monitor workbook text parameters 
description: Simplify complex reporting with prebuilt and custom parameterized workbooks. Learn more about workbook text parameters.
services: azure-monitor

ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 06/21/2023
---

# Workbook text parameters

Text box parameters provide a simple way to collect text input from workbook users. They're used when it isn't practical to use a dropdown list to collect the input, for example, with an arbitrary threshold or generic filters. By using a workbook, you can get the default value of the text box from a query. This functionality allows for interesting scenarios like setting the default threshold based on the p95 of the metric.

A common use of text boxes is as internal variables used by other workbook controls. You use a query for default values and make the input control invisible in read mode. For example, you might want a threshold to come from a formula, not a user, and then use the threshold in subsequent queries.

## Create a text parameter

1. Start with an empty workbook in edit mode.
1. Select **Add parameters** > **Add Parameter**.
1. In the new parameter pane that opens, enter:
    1. **Parameter name**: `SlowRequestThreshold`
    1. **Parameter type**: `Text`
    1. **Required**: `checked`
    1. **Get data from**: `None`
1. Select **Save** to create the parameter.

    :::image type="content" source="./media/workbooks-text/text-create.png" alt-text="Screenshot that shows the creation of a text parameter.":::

This screenshot shows how the workbook looks in read mode:

:::image type="content" source="./media/workbooks-text/text-readmode.png" alt-text="Screenshot that shows a text parameter in read mode." border="false":::

## Parameter field style

The text parameter supports the following field styles:

- **Standard**: A single line text field.

     :::image type="content" source="./media/workbooks-text/standard-text.png" alt-text="Screenshot that shows a standard text field.":::

- **Password**: A single line password field. The password value is only hidden in the UI when you type. The value is fully accessible as a parameter value when referred. It's stored unencrypted when the workbook is saved.

     :::image type="content" source="./media/workbooks-text/password-text.png" alt-text="Screenshot that shows a password field.":::

- **Multiline**: A multiline text field with support of rich IntelliSense and syntax colorization for the following languages:

    - Text
    - Markdown
    - JSON
    - SQL
    - TypeScript
    - KQL
    - TOML

    You can also specify the height for the multiline editor.

     :::image type="content" source="./media/workbooks-text/kql-text.png" alt-text="Screenshot that shows a multiline text field.":::

## Reference a text parameter

1. Select **Add query** to add a query control, and then select an Application Insights resource.
1. In the KQL box, add this snippet:

    ```kusto
    requests
    | summarize AllRequests = count(), SlowRequests = countif(duration >= {SlowRequestThreshold}) by name
    | extend SlowRequestPercent = 100.0 * SlowRequests / AllRequests
    | order by SlowRequests desc
    ```

1. By using the text parameter with a value of 500 coupled with the query control, you effectively run the following query:

    ```kusto
    requests
    | summarize AllRequests = count(), SlowRequests = countif(duration >= 500) by name
    | extend SlowRequestPercent = 100.0 * SlowRequests / AllRequests
    | order by SlowRequests desc
    ```

1. Run the query to see the results.

    :::image type="content" source="./media/workbooks-text/text-reference.png" alt-text="Screenshot that shows a text parameter referenced in KQL.":::

> [!NOTE]
> In the preceding example, `{SlowRequestThreshold}` represents an integer value. If you were querying for a string like `{ComputerName}`, you would need to modify your Kusto query to add quotation marks `"{ComputerName}"` in order for the parameter field to accept an input without quotation marks.

## Set the default values using queries

1. Start with an empty workbook in edit mode.
1. Select **Add parameters** > **Add Parameter**.
1. In the new parameter pane that opens, enter:
    1. **Parameter name**: `SlowRequestThreshold`
    1. **Parameter type**: `Text`
    1. **Required**: `checked`
    1. **Get data from**: `Query`
1. In the KQL box, add this snippet:

    ```kusto
    requests
    | summarize round(percentile(duration, 95), 2)
    ```

    This query sets the default value of the text box to the 95th percentile duration for all requests in the app.
1. Run the query to see the results.
1. Select **Save** to create the parameter.

    :::image type="content" source="./media/workbooks-text/text-default-value.png" alt-text="Screenshot that shows a text parameter with a default value from KQL.":::

> [!NOTE]
> While this example queries Application Insights data, the approach can be used for any log-based data source, such as Log Analytics and Azure Resource Graph.

## Add validations

For standard and password text parameters, you can add validation rules that are applied to the text field. Add a valid regex with an error message. If the message is set, it's shown as an error when the field is invalid.

If the match is selected, the field is valid if the value matches the regex. If the match isn't selected, the field is valid if it doesn't match the regex.

:::image type="content" source="./media/workbooks-text/validation-settings.png" alt-text="Screenshot that shows text validation settings.":::

## Format JSON data

If JSON is selected as the language for the multiline text field, the field will have a button that formats the JSON data of the field. You can also use the shortcut Ctrl + \ to format the JSON data.

If data is coming from a query, you can select the option to pre-format the JSON data that's returned by the query.

:::image type="content" source="./media/workbooks-text/pre-format-json-data.png" alt-text="Screenshot that shows the option Pre-format JSON data.":::

## Next steps

[Get started with Azure Workbooks](workbooks-getting-started.md)