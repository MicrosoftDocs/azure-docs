---
title: 'Support for long data type in Azure Time Series Insights Gen2 | Microsoft Docs'
description: Support for long data type in Azure Time Series Insights Gen2.
ms.service: time-series-insights
services: time-series-insights
author: msrsrinivasan
ms.author: radhsrin
manager: cnovak
ms.reviewer: orspodak
ms.workload: big-data
ms.topic: conceptual
ms.date: 12/07/2020
---

# Adding support for long data type in Azure Time Series Insights Gen2

[!INCLUDE [retirement](../../includes/tsi-retirement.md)]

The addition of support for long data type affects how we store and index numeric data in Azure Time Series Insights Gen2 environments only. If you have a Gen1 environment, you can disregard these changes.

Beginning June 29 or June 30, 2020, depending on your region, your data will be indexed as **Long** and **Double**.  If you have any questions or concerns about this change, submit a support ticket through the Azure portal and mention this communication.

If you're affected by any of the following cases, make the recommended changes:

- **Case 1**: You currently use Time Series Model variables and send only integral data types in your telemetry data.
- **Case 2**: You currently use Time Series Model variables and send both integral and nonintegral data types in your telemetry data.
- **Case 3**: You use categorical variables to map integer values to categories.
- **Case 4**: You use the JavaScript SDK to build a custom front-end application.
- **Case 5**: You're nearing the 1,000-property name limit in Warm Store and send both integral and nonintegral data. The property count can be viewed as a metric in the [Azure portal](https://portal.azure.com/).

If any of the cases apply to you, make changes to your model. Update the Time Series Expression (TSX) in your variable definition with the recommended changes. Update both:

- Azure Time Series Insights Explorer
- Any custom client that uses our APIs

Depending on your IoT solution and constraints, you might not have visibility into the data that's sent to your Azure Time Series Insights Gen2 environment. If you're unsure if your data is integral only or both integral and nonintegral, you have a few options:

- You can wait for the feature to be released. Then, explore your raw events in the explorer UI to understand which properties are saved in two separate columns.
- You can preemptively make the recommended changes for all numeric tags.
- You can temporarily route a subset of events to storage to better understand and explore your schema.

To store events, turn on [event capture](../event-hubs/event-hubs-capture-overview.md) for Azure Event Hubs, or [route](../iot-hub/iot-hub-devguide-messages-d2c.md#azure-storage-as-a-routing-endpoint) from your IoT Hub to Azure Blob storage.

Data can also be observed through the [Event Hub Explorer](https://marketplace.visualstudio.com/items?itemName=Summer.azure-event-hub-explorer), or by using the [Event Processor Host](../event-hubs/event-hubs-dotnet-standard-getstarted-send.md#receive-events-from-the-event-hub).

If you use IoT Hub, go to [Read device-to-cloud messages from the built-in endpoint](../iot-hub/iot-hub-devguide-messages-read-builtin.md) for how to access the built-in endpoint.

> [!NOTE]
> You might experience a disruption if you don't make the recommended changes. For example, the affected Time Series Insights variables that are accessed via the query APIs or Time Series Insights explorer will return **null** (that is, show no data in the explorer).

## Recommended changes

### Case 1: Using Time Series Model variables and sending only integral data types in telemetry data

The recommended changes for Case 1 are the same as for Case 2. Follow the instructions in the section for Case 2.

### Case 2: Using Time Series Model variables and sending both integral and nonintegral types in telemetry data

If you currently send integer telemetry data, your data will be divided into two columns:

- **propertyValue_double**
- **propertyValue_long**

Your integer data writes to **propertyValue_long**. Previously ingested (and future ingested) numeric data in **propertyValue_double** isn't copied over.

If you want to query data across these two columns for the **propertyValue** property, you need to use the **coalesce()** scalar function in your TSX. The function accepts arguments of the same **DataType** and returns the first non-null value in the argument list. For more information, see [Azure Time Series Insights Gen2 data access concepts](/rest/api/time-series-insights/reference-time-series-expression-syntax#other-functions).

#### Variable definition in TSX - numeric

*Previous variable definition:*

[![Screenshot shows the Add a new variable dialog box for the PropertyValue Variable, numeric.](media/time-series-insights-long-data-type/var-def-previous.png)](media/time-series-insights-long-data-type/var-def-previous.png#lightbox)

*New variable definition:*

[![Screenshot shows the Add a new variable dialog box for the PropertyValue Variable with a custom value, numeric.](media/time-series-insights-long-data-type/var-def.png)](media/time-series-insights-long-data-type/var-def.png#lightbox)

You can also use **coalesce($event.propertyValue.Double, toDouble($event.propertyValue.Long))** as the custom [Time Series Expression](/rest/api/time-series-insights/reference-time-series-expression-syntax).

#### Inline variable definition using TSX query APIs - numeric

*Previous variable definition:*

```JSON
"PropertyValueVariable": {

    "kind": "numeric",

    "value": {

        "tsx": "$event.propertyValue.Double"

    },

    "filter": null,

    "aggregation": {

        "tsx": "avg($value)"
    }
}
```

*New variable definition:*

```JSON
"PropertyValueVariable ": {

    "kind": "numeric",

    "value": {

        "tsx": "coalesce($event.propertyValue.Long, toLong($event.propertyValue.Double))"

    },

    "filter": null,

    "aggregation": {

        "tsx": "avg($value)"
    }
}
```

You can also use **coalesce($event.propertyValue.Double, toDouble($event.propertyValue.Long))** as the custom [Time Series Expression](/rest/api/time-series-insights/reference-time-series-expression-syntax).

> [!NOTE]
> We recommend that you update these variables in all places they might be used. These places include Time Series Model, saved queries, and Power BI connector queries.

### Case 3: Using categorical variables to map integer values to categories

If you currently use categorical variables that map integer values to categories, you're likely using the **toLong** function to convert data from **Double** type to **Long** type. Just like Cases 1 and 2, you need to coalesce the **Double** and **Long** **DataType** columns.

#### Variable definition in Time Series Explorer - categorical

*Previous variable definition:*

[![Screenshot shows the Add a new variable dialog box for the PropertyValue Variable, categorical.](media/time-series-insights-long-data-type/var-def-cat-previous.png)](media/time-series-insights-long-data-type/var-def-cat-previous.png#lightbox)

*New variable definition:*

[![Screenshot shows the Add a new variable dialog box for the PropertyValue Variable with a custom value, categorical.](media/time-series-insights-long-data-type/var-def-cat.png)](media/time-series-insights-long-data-type/var-def-cat.png#lightbox)

You can also use **coalesce($event.propertyValue.Double, toDouble($event.propertyValue.Long))** as the custom [Time Series Expression](/rest/api/time-series-insights/preview#time-series-expression-and-syntax).

Categorical variables still require the value to be of an integer type. The **DataType** of all the arguments in **coalesce()** must be of type **Long** in the custom [Time Series Expression.](/rest/api/time-series-insights/reference-time-series-expression-syntax)

#### Inline variable definition using TSX query APIs - categorical

*Previous variable definition:*

```JSON
"PropertyValueVariable_Long": {

    "kind": "categorical",

    "value": {

        "tsx": "tolong($event.propertyValue.Double)"

    },

    "categories": [

    {
        "label": "Good",

        "values": [0, 1, 2 ]

    },

    {

        "label": "Bad",

        "values": [ 3, 4 ]

    } ],

    "defaultCategory": {

        "label": "Unknown"

    }
}
```

*New variable definition:*

```JSON
"PropertyValueVariable_Long": {

    "kind": "categorical",

    "value": {

        "tsx": "coalesce($event.propertyValue.Long, tolong($event.propertyValue.Double))"

    },

    "categories": [

    {
        "label": "Good",

        "values": [0, 1, 2 ]

    },

    {

        "label": "Bad",

        "values": [ 3, 4 ]

    } ],

    "defaultCategory": {

        "label": "Unknown"

    }
}
```

Categorical variables still require the value to be of an integer type. The **DataType** of all the arguments in **coalesce()** must be of type **Long** in the custom [Time Series Expression](/rest/api/time-series-insights/reference-time-series-expression-syntax).

> [!NOTE]
> We recommend that you update these variables in all places they might be used. These places include Time Series Model, saved queries, and Power BI connector queries.

### Case 4: Using the JavaScript SDK to build a custom front-end application

If you're affected by Cases 1 through 3 and build custom applications, you need to update your queries to use the **coalesce()** function, as demonstrated in the previous examples.

### Case 5: Nearing Warm Store 1,000 property limit

If you're a Warm Store user with a large number of properties and believe that this change would push your environment over the 1,000 Warm Store property-name limit, submit a support ticket through the Azure portal and mention this communication.

## Next steps

- View the full list of [supported data types](concepts-supported-data-types.md).
