---
title: Bicep functions - date
description: Describes the functions to use in a Bicep file to work with dates.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 10/12/2023
---

# Date functions for Bicep

This article describes the Bicep functions for working with dates.

## dateTimeAdd

`dateTimeAdd(base, duration, [format])`

Adds a time duration to a base value. ISO 8601 format is expected.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| base | Yes | string | The starting datetime value for the addition. Use [ISO 8601 timestamp format](https://en.wikipedia.org/wiki/ISO_8601). |
| duration | Yes | string | The time value to add to the base. It can be a negative value. Use [ISO 8601 duration format](https://en.wikipedia.org/wiki/ISO_8601#Durations). |
| format | No | string | The output format for the date time result. If not provided, the format of the base value is used. Use either [standard format strings](/dotnet/standard/base-types/standard-date-and-time-format-strings) or [custom format strings](/dotnet/standard/base-types/custom-date-and-time-format-strings). |

### Return value

The datetime value that results from adding the duration value to the base value.

### Remarks

The Add method takes into account leap years and the number of days in a month when performing date arithmetic. The following example adds one month to January 31:

```bicep
output add1MonthOutput string = dateTimeAdd('2023-01-31 00:00:00Z', 'P1M') //2023-03-02T00:00:00Z
output add1MonthLeapOutput string = dateTimeAdd('2024-01-31 00:00:00Z', 'P1M')  //2024-03-01T00:00:00Z
```

In this example, `dateTimeAdd` returns `2023-03-02T00:00:00Z`, not `2023-02-28T00:00:00Z`. If the base is `2024-01-31 00:00:00Z`, it returns `2024-03-01T00:00:00Z` because 2024 is a leap year.

### Examples

The following example shows different ways of adding time values.

```bicep
param baseTime string = utcNow('u')

var add3Years = dateTimeAdd(baseTime, 'P3Y')
var subtract9Days = dateTimeAdd(baseTime, '-P9D')
var add1Hour = dateTimeAdd(baseTime, 'PT1H')

output add3YearsOutput string = add3Years
output subtract9DaysOutput string = subtract9Days
output add1HourOutput string = add1Hour
```

When the preceding example is deployed with a base time of `2020-04-07 14:53:14Z`, the output is:

| Name | Type | Value |
| ---- | ---- | ----- |
| add3YearsOutput | String | 4/7/2023 2:53:14 PM |
| subtract9DaysOutput | String | 3/29/2020 2:53:14 PM |
| add1HourOutput | String | 4/7/2020 3:53:14 PM |

The next example shows how to set the start time for an Automation schedule.

```bicep
param omsAutomationAccountName string = 'demoAutomation'
param scheduleName string = 'demSchedule1'
param baseTime string = utcNow('u')

var startTime = dateTimeAdd(baseTime, 'PT1H')

...

resource scheduler 'Microsoft.Automation/automationAccounts/schedules@2022-08-08' = {
  name: concat(omsAutomationAccountName, '/', scheduleName)
  properties: {
    description: 'Demo Scheduler'
    startTime: startTime
    interval: 1
    frequency: 'Hour'
  }
}
```

## dateTimeFromEpoch

`dateTimeFromEpoch(epochTime)`

Converts an epoch time integer value to an ISO 8601 datetime.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| epochTime | Yes | int | The epoch time to convert to a datetime string. |

### Return value

An ISO 8601 datetime string.

### Remarks

This function requires **Bicep version 0.5.6 or later**.

### Example

The following example shows output values for the epoch time functions.

```bicep
param convertedEpoch int = dateTimeToEpoch(dateTimeAdd(utcNow(), 'P1Y'))

var convertedDatetime = dateTimeFromEpoch(convertedEpoch)

output epochValue int = convertedEpoch
output datetimeValue string = convertedDatetime
```

The output is:

| Name | Type | Value |
| ---- | ---- | ----- |
| datetimeValue | String | 2023-05-02T15:16:13Z |
| epochValue | Int | 1683040573 |

## dateTimeToEpoch

`dateTimeToEpoch(dateTime)`

Converts an ISO 8601 datetime string to an epoch time integer value.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| dateTime | Yes | string | The datetime string to convert to an epoch time. |

### Return value

An integer that represents the number of seconds from midnight on January 1, 1970.

### Remarks

This function requires **Bicep version 0.5.6 or later**.

### Examples

The following example shows output values for the epoch time functions.

```bicep
param convertedEpoch int = dateTimeToEpoch(dateTimeAdd(utcNow(), 'P1Y'))

var convertedDatetime = dateTimeFromEpoch(convertedEpoch)

output epochValue int = convertedEpoch
output datetimeValue string = convertedDatetime
```

The output is:

| Name | Type | Value |
| ---- | ---- | ----- |
| datetimeValue | String | 2023-05-02T15:16:13Z |
| epochValue | Int | 1683040573 |

The next example uses the epoch time value to set the expiration for a key in a key vault.

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.storage/storage-blob-encryption-with-cmk/main.bicep" highlight="20,65":::

## utcNow

`utcNow(format)`

Returns the current (UTC) datetime value in the specified format. If no format is provided, the ISO 8601 (`yyyyMMddTHHmmssZ`) format is used. **This function can only be used in the default value for a parameter.**

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| format |No |string |The URI encoded value to convert to a string. Use either [standard format strings](/dotnet/standard/base-types/standard-date-and-time-format-strings) or [custom format strings](/dotnet/standard/base-types/custom-date-and-time-format-strings). |

### Remarks

You can only use this function within an expression for the default value of a parameter. Using this function anywhere else in a Bicep file returns an error. The function isn't allowed in other parts of the Bicep file because it returns a different value each time it's called. Deploying the same Bicep file with the same parameters wouldn't reliably produce the same results.

If you use the [option to rollback on error](../templates/rollback-on-error.md) to an earlier successful deployment, and the earlier deployment includes a parameter that uses utcNow, the parameter isn't reevaluated. Instead, the parameter value from the earlier deployment is automatically reused in the rollback deployment.

Be careful redeploying a Bicep file that relies on the utcNow function for a default value. When you redeploy and don't provide a value for the parameter, the function is reevaluated. If you want to update an existing resource rather than create a new one, pass in the parameter value from the earlier deployment.

### Return value

The current UTC datetime value.

### Examples

The following example shows different formats for the datetime value.

```bicep
param utcValue string = utcNow()
param utcShortValue string = utcNow('d')
param utcCustomValue string = utcNow('M d')

output utcOutput string = utcValue
output utcShortOutput string = utcShortValue
output utcCustomOutput string = utcCustomValue
```

The output from the preceding example varies for each deployment but will be similar to:

| Name | Type | Value |
| ---- | ---- | ----- |
| utcOutput | string | 20190305T175318Z |
| utcShortOutput | string | 03/05/2019 |
| utcCustomOutput | string | 3 5 |

The next example shows how to use a value from the function when setting a tag value.

```bicep
param utcShort string = utcNow('d')
param rgName string

resource myRg 'Microsoft.Resources/resourceGroups@2022-09-01' = {
  name: rgName
  location: 'westeurope'
  tags: {
    createdDate: utcShort
  }
}

output utcShortOutput string = utcShort
```

## Next steps

* For a description of the sections in a Bicep file, see [Understand the structure and syntax of Bicep files](./file.md).
