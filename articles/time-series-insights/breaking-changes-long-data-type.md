---
title: 'Adding Support for Long Data Type | Microsoft Docs'
description: Support for long data type
ms.service: time-series-insights
services: time-series-insights
author: deepakpalled
ms.author: dpalled
manager: diviso
ms.workload: big-data
ms.topic: conceptual
ms.date: 07/07/2020
ms.custom: dpalled
---

# Adding support for long data type

These changes will be applied to Gen2 environments only. If you have a Gen1 environment, you may disregard these changes.

We are making changes to how we store and index numeric data in Azure Time Series Insights Gen2 that might impact you. If you’re impacted by any of the cases below, make the necessary changes as soon as possible. Your data will start being indexed as Long and Double between 29 June and 30 June 2020, depending on your region. If you have any questions or concerns about this change, submit a support ticket through the Azure portal and mention this communication.

This change impacts you in the following cases:

1. If you currently use Time Series Model variables and send only integral data types in your telemetry data.
1. If you currently use Time Series Model variables and send both integral and nonintegral data types in your telemetry data.
1. If you use categorical variables to map integer values to categories.
1. If you use the JavaScript SDK to build a custom front-end Application.
1. If you're nearing the 1,000-property name limit in Warm Store (WS) and send both integral and nonintegral data, property count can be viewed as a metric in the [Azure portal](https://portal.azure.com/).

If any of the above cases apply to you, you'll need to make changes to your model to accommodate this change. Update the Time Series Expression in your variable definition in both Azure Time Series Insights Gen2 Explorer and in any custom client using our APIs with the recommended changes. See below for details.

Depending on your IoT solution and constraints, you might not have visibility into the data being sent to your Azure Time Series Insights Gen2 environment. If you’re unsure if your data is integral only or both integral and nonintegral, you have a few options. You can wait for the feature to be released and then explore your raw events in the explorer UI to understand which properties have been saved in two separate columns. You could preemptively make the changes below for all numeric tags, or temporarily route a subset of events to storage to better understand and explore your schema. To store events, turn on [event capture](https://docs.microsoft.com/azure/event-hubs/event-hubs-capture-overview) for Event Hubs, or [route](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messages-d2c#azure-storage) from your IoT Hub to Azure Blob Storage. Data can also be observed through the [Event Hub Explorer](https://marketplace.visualstudio.com/items?itemName=Summer.azure-event-hub-explorer), or by using the [Event Processor Host](https://docs.microsoft.com/azure/event-hubs/event-hubs-dotnet-standard-getstarted-send#receive-events). If you use IoT Hub, see the documentation [here](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messages-read-builtin) on how to access the built-in endpoint.

Note that if you are affected by these changes and are unable to make them by the above dates, you may experience a disruption where the impacted Time Series Variables accessed via the query APIs or Time Series Insights Explorer will return *null* (i.e. show no data in the Explorer).

## Recommended Changes

Case 1 & 2: **Using Time Series Model variables and sending only integral data types OR sending both integral and nonintegral types in telemetry data.**

If you are currently sending integer telemetry data, your data will be divided into two columns: “propertyValue_double” and “propertyValue_long”.

Your integer data will be written to “propertyValue_long”  when the changes go into effect and previously ingested (and future ingested) numeric data in “propertyValue_double” will not be copied over.

If you wish to query data across these two columns for the “propertyValue” property, you will have to use the *coalesce()* scalar function in your TSX. The function accepts arguments of the same DataType and returns the first non-null value in the argument list (read more about usage [here](https://docs.microsoft.com/rest/api/time-series-insights/preview#other-functions)).

### Variable Definition in Time Series Explorer - Numeric

*Previous Variable Definition:*

[![Previous Variable Definition](media/time-series-insights-long-data-type/var-def-previous.png)](media/time-series-insights-long-data-type/var-def-previous.png#lightbox)

*New Variable Definition:*

[![New Variable Definition](media/time-series-insights-long-data-type/var-def.png)](media/time-series-insights-long-data-type/var-def.png#lightbox)

You may also use *“coalesce($event.propertyValue.Double, toDouble($event.propertyValue.Long))”* as the custom [Time Series Expression.](https://docs.microsoft.com/rest/api/time-series-insights/preview#time-series-expression-and-syntax)

### Inline Variable Definition using Time Series Query APIs - Numeric

*Previous Variable Definition:*

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

*New Variable Definition:*

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

You may also use *“coalesce($event.propertyValue.Double, toDouble($event.propertyValue.Long))”* as the custom [Time Series Expression.](https://docs.microsoft.com/rest/api/time-series-insights/preview#time-series-expression-and-syntax)

> [!NOTE]
> We recommend you update these variables in all places they might be used (Time Series Model, saved queries, Power BI Connector queries).

Case 3: **Using categorical variables to map integer values to categories**

If you are currently using categorical variables that map integer values to categories, you are likely using the toLong function to convert data from Double type to Long type. Like in the cases above, you will need to coalesce the Double and Long DataType columns.

### Variable Definition in Time Series Explorer - Categorical

*Previous Variable Definition:*

[![Previous Variable Definition](media/time-series-insights-long-data-type/var-def-cat-previous.png)](media/time-series-insights-long-data-type/var-def-cat-previous.png#lightbox)

*New Variable Definition:*

[![New Variable Definition](media/time-series-insights-long-data-type/var-def-cat.png)](media/time-series-insights-long-data-type/var-def-cat.png#lightbox)

You may also use *“coalesce($event.propertyValue.Double, toDouble($event.propertyValue.Long))”* as the custom [Time Series Expression.](https://docs.microsoft.com/rest/api/time-series-insights/preview#time-series-expression-and-syntax)

Categorical variables still require the value to be of an integer type. The DataType of all the arguments in coalesce() must be of type Long in the custom [Time Series Expression.](https://docs.microsoft.com/rest/api/time-series-insights/preview#time-series-expression-and-syntax)

### Inline Variable Definition using Time Series Query APIs - Categorical

*Previous Variable Definition:*

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

*New Variable Definition:*

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

Categorical variables still require the value to be of an integer type. The DataType of all the arguments in coalesce() must be of type Long in the custom [Time Series Expression.](https://docs.microsoft.com/rest/api/time-series-insights/preview#time-series-expression-and-syntax)

> [!NOTE]
> We recommend you update these variables in all places they might be used (Time Series Model, saved queries, Power BI Connector queries).

Case 4: **Using the JavaScript SDK to build a custom front-end application**

If you're impacted by cases 1-3 above and build custom applications, you need to update your queries to use the *coalesce()* function, as demonstrated in the examples above.

Case 5: **Nearing Warm Store 1,000 property limit**

If you are a Warm Store user with a large number of properties and believe that this change would push your environment over the 1,000 WS property-name limit, submit a support ticket through the Azure portal and mention this communication.

## Next steps

* See [supported data types](concepts-supported-data-types.md) to view the full list of supported data types.
