---
title: 'Upcoming changes to the ingestion and flattening rules in Azure Time Series Insights Gen2 | Microsoft Docs'
description: Ingestion rule changes
ms.service: time-series-insights
services: time-series-insights
author: tedvilutis
ms.author: tvilutis
manager: cnovak
ms.reviewer: orspodek
ms.workload: big-data
ms.topic: conceptual
ms.date: 10/02/2020
ms.custom: lyhughes
---

# Upcoming changes to JSON flattening and escaping rules for new environments

[!INCLUDE [retirement](../../includes/tsi-retirement.md)]

> [!IMPORTANT]
> These changes will be applied to *newly created* Microsoft Azure Time Series Insights Gen2 environments only. The changes don't apply to Gen1 environments.

Your Azure Time Series Insights Gen2 environment dynamically creates your storage columns, following a particular set of naming conventions. When an event is ingested, Time Series Insights applies a set of rules to the JSON payload and property names. Changes to how JSON data is flattened and stored went into effect for new Azure Time Series Insights Gen2 environments in July 2020. This change impacts you in the following cases:

* Your JSON payload contains nested objects.
* Your JSON payload contains arrays.
* You use any of the following four special characters in a JSON property name: `[` `\` `.` `'`
* One or more of your Time Series (TS) ID properties are within a nested object.

If you create a new environment and one or more of these cases applies to your event payload, your data will be flattened and stored differently. The following table summarizes the changes:

| Current rule | New rule | Example JSON | Previous column name | New column name
|---|---| ---| ---|  ---|
| Nested JSON is flattened by using an underscore as the delineator. |Nested JSON is flattened by using a period as the delineator.  | ``{"series" : { "value" : 19.338 }}`` | `series_value_double` |`series.value_double` |
| Special characters are not escaped. | JSON property names that include the special characters `.` `[`  `\` and `'` are escaped using `['` and `']`. Within `['` and `']`, there's additional escaping of single quotes and backslashes. A single quote will be written as `\'` and a backslash as `\\`.  | ```"Foo's Law Value": "17.139999389648"``` | `Foo's Law Value_double` | `['Foo\'s Law Value']_double` |
| Arrays of primitives are stored as a string. | Arrays of primitive types are stored as a dynamic type.  | `"values": [154, 149, 147]` | `values_string`  | `values_dynamic` |
Arrays of objects are always flattened, producing multiple events. | If the objects within an array don't have either the TS ID or timestamp properties, the array of objects is stored whole as a dynamic type. | `"values": [{"foo" : 140}, {"bar" : 149}]` | `values_foo_long | values_bar_long` | `values_dynamic` |

## Recommended changes for new environments

### If your TS ID and/or timestamp property is nested within an object

Any new deployments need to match the new ingestion rules. For example, if your TS ID is `telemetry_tagId`, you need to update any Azure Resource Manager templates or automated deploy scripts to configure `telemetry.tagId` as the environment TS ID. You also need this change for event source timestamps in nested JSON.

### If your payload contains nested JSON or special characters and you automate authoring [Time Series Model](./concepts-model-overview.md) variable expressions

Update your client code that executes [TypesBatchPut](/rest/api/time-series-insights/dataaccessgen2/timeseriestypes/executebatch#typesbatchput) to match the new ingestion rules. For example, you should update a previous [Time Series Expression](/rest/api/time-series-insights/reference-time-series-expression-syntax) of `"value": {"tsx": "$event.series_value.Double"}` to one of the following options:

* `"value": {"tsx": "$event.series.value.Double"}`
* `"value": {"tsx": "$event['series']['value'].Double"}`

## Next steps

* Learn about [Azure Time Series Insights Gen2 storage and ingress](./concepts-ingestion-overview.md).

* Learn how to query your data by using [Time Series Query APIs](./concepts-query-overview.md).

* Read more about the [new Time Series Expression syntax](/rest/api/time-series-insights/reference-time-series-expression-syntax).