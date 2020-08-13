---
title: 'Upcoming changes to the ingestion and flattening rules in Azure Time Series Insights Gen2 | Microsoft Docs'
description: Ingestion rule changes
ms.service: time-series-insights
services: time-series-insights
author: lyrana
ms.author: lyhughes
manager: dpalled
ms.workload: big-data
ms.topic: conceptual
ms.date: 08/12/2020
ms.custom: lyhughes
---

# Upcoming changes to the JSON flattening and escaping rules for new environments

**These changes will be applied to *newly created* Azure Time Series Insights Gen2 environments only. These changes do not apply to Gen1 environments.**

Your Azure Time Series Insights Gen2 environment dynamically creates your storage columns, following a particular set of naming conventions. When an event is ingested, a set of rules is applied to the JSON payload and property names. Changes to how JSON data is flattened and stored will go into effect for new Azure Time Series Insights Gen2 environments in July 2020. This change impacts you in the following cases:

* If your JSON payload contains nested objects
* If your JSON payload contains arrays
* If you use any of the following four special characters in a JSON property name: [ \ . '
* If one or more of your TS ID properties are within a nested object.

If you create a new environment and one or more of the cases above applies to your event payload, you'll see your data flattened and stored differently. Below is a summary of the changes:

| Current Rule | New Rule | Example JSON | Previous Column Name | New Column Name
|---|---| ---| ---|  ---|
| Nested JSON is flattened using an underscore as the delineator |Nested JSON is flattened using a period as the delineator  | ``{"series" : { "value" : 19.338 }}`` | `series_value_double` |`series.value_double` |
| Special characters are not escaped | JSON property names that include the special characters . [  \ and ' are escaped using [' and ']. Within [' and '] there's additional escaping of single quotes and backslashes. A single quote will be written as \' and a backslash will be written as \\\  | ```"Foo's Law Value": "17.139999389648"``` | `Foo's Law Value_double` | `['Foo\'s Law Value']_double` |
| Arrays of primitives are stored as a string | Arrays of primitive types are stored as a dynamic type  | `"values": [154, 149, 147]` | `values_string`  | `values_dynamic` |
Arrays of objects are always flattened, producing multiple events | If the objects within an array don't have either the TS ID or timestamp propert(ies), the array of objects is stored whole as a dynamic type | `"values": [{"foo" : 140}, {"bar" : 149}]` | `values_foo_long | values_bar_long` | `values_dynamic` |

## Recommended changes for new environments

### If your TS ID and/or timestamp property is nested within an object

* Any new deployments will need to match the new ingestion rules. For example, if your TS ID is `telemetry_tagId` you'll need to update any Azure Resource Manager (ARM) templates or automated deploy scripts to configure `telemetry.tagId` as the environment TS ID. This change is needed for event source timestamps in nested JSON as well.

### If your payload contains nested JSON or special characters and you automate authoring [Time Series Model](.\time-series-insights-update-tsm.md) variable expressions

* Update your client code executing [TypesBatchPut](https://docs.microsoft.com/rest/api/time-series-insights/dataaccessgen2/timeseriestypes/executebatch#typesbatchput) to match the new ingestion rules. For example, a previous [Time Series Expression](https://docs.microsoft.com/rest/api/time-series-insights/reference-time-series-expression-syntax) of `"value": {"tsx": "$event.series_value.Double"}` should be updated to one of the below options:
  * `"value": {"tsx": "$event.series.value.Double"}`
  * `"value": {"tsx": "$event['series']['value'].Double"}`

## Next steps

* Read [Azure Time Series Insights Gen2 storage and ingress](./time-series-insights-update-storage-ingress.md).

* Read more about how to query your data using [Time Series Query APIs](./concepts-query-overview.md).

* Read more about the [new Time Series Expression syntax](https://docs.microsoft.com/rest/api/time-series-insights/reference-time-series-expression-syntax).
