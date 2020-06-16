---
title: 'Adding Support for Long Data Type | Microsoft Docs'
description: Support for long data type
ms.service: time-series-insights
services: time-series-insights
author: deepakpalled
ms.author: dpalled
manager: cshankar
ms.workload: big-data
ms.topic: conceptual
ms.date: 06/15/2020
ms.custom: dpalled
---

# Adding Support for Long Data Type

These changes will be applied to Preview (PAYG) environments only. If you have a Standard (S) SKU TSI environment, you may disregard these changes.

We are making changes to how we store and index numeric data in Azure Time Series Insights Preview that might impact you. If you’re impacted by any of the cases below, please make the necessary changes as soon as possible. Your data will start being indexed as Long and Double between 29 June and 30 June 2020, depending on your region. If you have any questions or concerns regarding this change, please submit a support ticket through the Azure Portal and mention this communication.

This change impacts you in the following cases:

1. If you currently use Time Series Model variables and send only integral data types in your telemetry data.
1. If you currently use Time Series Model variables and send both integral and nonintegral data types in your telemetry data.
1. If you use categorical variables mapping integer values to categories.
1. If you use the JavaScript SDK to build a custom front-end Application.
1. If you are nearing the 1,000-property name limit in Warm Store (WS) and send both integral and nonintegral data, property count can be viewed as a metric in the [Azure portal](https://portal.azure.com/).

If any of the above cases apply to you, you will need to make changes to your model to accommodate this change. Please update the Time Series Expression in your variable definition in both TSI Explorer and in any custom client using our APIs with the recommended changes. See below for details.

Depending on your IoT solution and constraints, you might not have visibility into the data being sent to your TSI PAYG environment. If you’re unsure if your data is integral only or both integral and nonintegral, you have a few options. You can observe your data via the Explore Events feature in the explorer after the feature is released and then apply the recommended changes, you can pre-emptively make the changes below for all numeric tags, or you can start temporarily storing telemetry events now in order to better understand and explore your schema. To store events you can turn on [event capture](https://docs.microsoft.com/azure/event-hubs/event-hubs-capture-overview) for Event Hubs, or [route](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messages-d2c#azure-storage) from your IoT Hub to Azure Blob Storage. Data can also be observed through the [Event Hub Explorer](https://marketplace.visualstudio.com/items?itemName=Summer.azure-event-hub-explorer), or by using the [Event Processor Host](https://docs.microsoft.com/azure/event-hubs/event-hubs-dotnet-standard-getstarted-send#receive-events). If you use IoT Hub, see the documentation [here](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messages-read-builtin) on how to access the built-in endpoint.

Please note that if you are impacted by these changes and are unable to make them by the above dates, you may experience a disruption where the impacted Time Series Variables accessed via the query APIs or Time Series Insights Explorer will return *null* (i.e. show no data in the Explorer).

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

    "PropertyValueVariable": {

        "kind": "numeric",

        "value": {

            "tsx": "$event.propertyValue.Double"

        },

        "filter": null,

        "aggregation": {

            "tsx": "avg($value)"

*New Variable Definition:*

    "PropertyValueVariable ": {

        "kind": "numeric",

        "value": {

            "tsx": "coalesce($event.propertyValue.Long, toLong($event.propertyValue.Double))"

        },

        "filter": null,

        "aggregation": {

            "tsx": "avg($value)"

You may also use *“coalesce($event.propertyValue.Double, toDouble($event.propertyValue.Long))”* as the custom [Time Series Expression.](https://docs.microsoft.com/rest/api/time-series-insights/preview#time-series-expression-and-syntax)

> [!NOTE]
> We recommend you update these variables in all places they might be used (Time Series Model, saved queries, Power BI Connector queries).

Case 3: **Using categorical variables mapping integer values to categories**

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

*New Variable Definition:*

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

Categorical variables still require the value to be of an integer type. The DataType of all the arguments in coalesce() must be of type Long in the custom [Time Series Expression.](https://docs.microsoft.com/rest/api/time-series-insights/preview#time-series-expression-and-syntax)

> [!NOTE]
> We recommend you update these variables in all places they might be used (Time Series Model, saved queries, Power BI Connector queries).

Case 4: **Using the JavaScript SDK to build a custom front-end Application**

Case 5: **Nearing Warm Store 1,000 property limit**

If you are a Warm Store user with a large number of properties and believe that this change would push your environment over the 1,000 WS property-name limit, please submit a support ticket through the Azure Portal and mention this communication.
