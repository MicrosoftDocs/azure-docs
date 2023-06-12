---
title: Template functions - date
description: Describes the functions to use in an Azure Resource Manager template (ARM template) to work with dates.
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 05/22/2023
---

# Date functions for ARM templates

This article describes the functions for working with dates in your Azure Resource Manager template (ARM template).

> [!TIP]
> We recommend [Bicep](../bicep/overview.md) because it offers the same capabilities as ARM templates and the syntax is easier to use. To learn more, see [date](../bicep/bicep-functions-date.md) functions.

## dateTimeAdd

`dateTimeAdd(base, duration, [format])`

Adds a time duration to a base value. ISO 8601 format is expected.

In Bicep, use the [dateTimeAdd](../bicep/bicep-functions-date.md#datetimeadd) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| base | Yes | string | The starting datetime value for the addition. Use [ISO 8601 timestamp format](https://en.wikipedia.org/wiki/ISO_8601). |
| duration | Yes | string | The time value to add to the base. It can be a negative value. Use [ISO 8601 duration format](https://en.wikipedia.org/wiki/ISO_8601#Durations). |
| format | No | string | The output format for the date time result. If not provided, the format of the base value is used. Use either [standard format strings](/dotnet/standard/base-types/standard-date-and-time-format-strings) or [custom format strings](/dotnet/standard/base-types/custom-date-and-time-format-strings). |

### Return value

The datetime value that results from adding the duration value to the base value.

### Examples

The following example template shows different ways of adding time values.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/date/datetimeadd.json":::

When the preceding template is deployed with a base time of `2020-04-07 14:53:14Z`, the output is:

| Name | Type | Value |
| ---- | ---- | ----- |
| add3YearsOutput | String | 4/7/2023 2:53:14 PM |
| subtract9DaysOutput | String | 3/29/2020 2:53:14 PM |
| add1HourOutput | String | 4/7/2020 3:53:14 PM |

The next example template shows how to set the start time for an Automation schedule.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/date/datetimeadd-automation.json":::

## dateTimeFromEpoch

`dateTimeFromEpoch(epochTime)`

Converts an epoch time integer value to an ISO 8601 datetime.

In Bicep, use the [dateTimeFromEpoch](../bicep/bicep-functions-date.md#datetimefromepoch) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| epochTime | Yes | int | The epoch time to convert to a datetime string. |

### Return value

An ISO 8601 datetime string.

### Example

The following example shows output values for the epoch time functions.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "convertedEpoch": {
      "type": "int",
      "defaultValue": "[dateTimeToEpoch(dateTimeAdd(utcNow(), 'P1Y'))]"
    }
  },
  "variables": {
    "convertedDatetime": "[dateTimeFromEpoch(parameters('convertedEpoch'))]"
  },
  "resources": [],
  "outputs": {
    "epochValue": {
      "type": "int",
      "value": "[parameters('convertedEpoch')]"
    },
    "datetimeValue": {
      "type": "string",
      "value": "[variables('convertedDatetime')]"
    }
  }
}
```

The output is:

| Name | Type | Value |
| ---- | ---- | ----- |
| datetimeValue | String | 2023-05-02T15:16:13Z |
| epochValue | Int | 1683040573 |

## dateTimeToEpoch

`dateTimeToEpoch(dateTime)`

Converts an ISO 8601 datetime string to an epoch time integer value.

In Bicep, use the [dateTimeToEpoch](../bicep/bicep-functions-date.md#datetimetoepoch) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| dateTime | Yes | string | The datetime string to convert to an epoch time. |

### Return value

An integer that represents the number of seconds from midnight on January 1, 1970.

### Examples

The following example shows output values for the epoch time functions.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "convertedEpoch": {
      "type": "int",
      "defaultValue": "[dateTimeToEpoch(dateTimeAdd(utcNow(), 'P1Y'))]"
    }
  },
  "variables": {
    "convertedDatetime": "[dateTimeFromEpoch(parameters('convertedEpoch'))]"
  },
  "resources": [],
  "outputs": {
    "epochValue": {
      "type": "int",
      "value": "[parameters('convertedEpoch')]"
    },
    "datetimeValue": {
      "type": "string",
      "value": "[variables('convertedDatetime')]"
    }
  }
}
```

The output is:

| Name | Type | Value |
| ---- | ---- | ----- |
| datetimeValue | String | 2023-05-02T15:16:13Z |
| epochValue | Int | 1683040573 |

The next example uses the epoch time value to set the expiration for a key in a key vault.

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.storage/storage-blob-encryption-with-cmk/azuredeploy.json" highlight="54,104":::

## utcNow

`utcNow(format)`

Returns the current (UTC) datetime value in the specified format. If no format is provided, the ISO 8601 (`yyyyMMddTHHmmssZ`) format is used. **This function can only be used in the default value for a parameter.**

In Bicep, use the [utcNow](../bicep/bicep-functions-date.md#utcnow) function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| format |No |string |The URI encoded value to convert to a string. Use either [standard format strings](/dotnet/standard/base-types/standard-date-and-time-format-strings) or [custom format strings](/dotnet/standard/base-types/custom-date-and-time-format-strings). |

### Remarks

You can only use this function within an expression for the default value of a parameter. Using this function anywhere else in a template returns an error. The function isn't allowed in other parts of the template because it returns a different value each time it's called. Deploying the same template with the same parameters wouldn't reliably produce the same results.

If you use the [option to rollback on error](rollback-on-error.md) to an earlier successful deployment, and the earlier deployment includes a parameter that uses `utcNow`, the parameter isn't reevaluated. Instead, the parameter value from the earlier deployment is automatically reused in the rollback deployment.

Be careful redeploying a template that relies on the `utcNow` function for a default value. When you redeploy and don't provide a value for the parameter, the function is reevaluated. If you want to update an existing resource rather than create a new one, pass in the parameter value from the earlier deployment.

### Return value

The current UTC datetime value.

### Examples

The following example template shows different formats for the datetime value.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/date/utcnow.json":::

The output from the preceding example varies for each deployment but will be similar to:

| Name | Type | Value |
| ---- | ---- | ----- |
| utcOutput | string | 20190305T175318Z |
| utcShortOutput | string | 03/05/2019 |
| utcCustomOutput | string | 3 5 |

The next example shows how to use a value from the function when setting a tag value.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/date/utcnow-tag.json":::

## Next steps

* For a description of the sections in an ARM template, see [Understand the structure and syntax of ARM templates](./syntax.md).
