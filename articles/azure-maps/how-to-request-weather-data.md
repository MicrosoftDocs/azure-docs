---
title: Request real-time and forecasted weather data using Azure Maps Weather services
description: Learn how to request real-time (current) and forecasted (minute, hourly, daily) weather data using Microsoft Azure Maps Weather services
author: anastasia-ms
ms.author: v-stharr
ms.date: 10/19/2020
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
manager: philmea
ms.custom: mvc
---


# Request real-time and forecasted weather data using Azure Maps Weather services

The Azure Maps [Weather service](https://docs.microsoft.com/rest/api/maps/weather) is a set of RESTful APIs that allows developers to integrate highly dynamic historical, real-time, and forecasted weather data and visualizations into their solutions. In this article, we'll show you how to request both real-time and forecasted weather data.

In this article you’ll learn, how to:

* Request real-time (current) weather data using the [Get Current Conditions API](https://docs.microsoft.com/rest/api/maps/weather/getcurrentconditionspreview).
* Request severe weather alerts using the [Get Severe Weather Alerts API](https://docs.microsoft.com/rest/api/maps/weather/getsevereweatheralertspreview).
* Request daily forecasts using the [Get Daily Forecast API](https://docs.microsoft.com/rest/api/maps/weather/getdailyforecastpreview).
* Request hourly forecasts using the [Get Hourly Forecast API](https://docs.microsoft.com/rest/api/maps/weather/gethourlyforecastpreview).
* Request minute by minute forecasts using the [Get Minute Forecast API](https://docs.microsoft.com/rest/api/maps/weather/getminuteforecastpreview).

## Prerequisites

1. [Make an Azure Maps account](quick-demo-map-app.md#create-an-azure-maps-account)
2. [Obtain a primary subscription key](quick-demo-map-app.md#get-the-primary-key-for-your-account), also known as the primary key or the subscription key. For more information on authentication in Azure Maps, see [manage authentication in Azure Maps](./how-to-manage-authentication.md).

    >[!IMPORTANT]
    >The [Get Minute Forecast API](https://docs.microsoft.com/rest/api/maps/weather/getminuteforecastpreview) requires an S1 pricing tier key. All other APIs require an S0 pricing tier key.

This tutorial uses the [Postman](https://www.postman.com/) application, but you may choose a different API development environment.

## Request real-time weather data

The [Get Current Conditions API](https://docs.microsoft.com/rest/api/maps/weather/getcurrentconditionspreview) returns detailed weather conditions such as precipitation, temperature, and wind for a given coordinate location. Also, observations from the past 6 or 24 hours for a particular location can be retrieved. The response includes details like observation date and time, brief description of the weather conditions, weather icon, precipitation indicator flags, and temperature. RealFeel™ Temperature and ultraviolet(UV) index are also returned.

In this example, you'll use the [Get Current Conditions API](https://docs.microsoft.com/rest/api/maps/weather/getcurrentconditionspreview) to retrieve current weather conditions at coordinates located in Seattle, WA.

1. Open the Postman app. Near the top of the Postman app, select **New**. In the **Create New** window, select **Collection**.  Name the collection and select the **Create** button. You'll use this collection for the rest of the examples in this document.

2. To create the request, select **New** again. In the **Create New** window, select **Request**. Enter a **Request name** for the request. Select the collection you created in the previous step, and then select **Save**.

3. Select the **GET** HTTP method in the builder tab and enter the following URL. For this request, and other requests mentioned in this article, replace `{Azure-Maps-Primary-Subscription-key}` with your primary subscription key.

    ```http
    https://atlas.microsoft.com/weather/currentConditions/json?api-version=1.0&query=47.60357,-122.32945&subscription-key={Azure-Maps-Primary-Subscription-key}
    ```

4. Click the blue **Send** button. The response body contains current weather information.

## Request severe weather alerts

[Azure Maps Get Severe Weather Alerts API](https://docs.microsoft.com/rest/api/maps/weather/getsevereweatheralertspreview) returns the severe weather alerts that are available worldwide from both official Government Meteorological Agencies and leading global to regional weather alert providers. The service can return details such as alert type, category, level, and detailed descriptions about the active severe alerts for the requested location, such as hurricanes, thunderstorms, lightning, heat waves or forest fires. As an example, logistics managers can visualize severe weather conditions on a map, along with business locations and planned routes, and coordinate further with drivers and local workers.

In this example, you'll use the [Get Severe Weather Alerts API](https://docs.microsoft.com/rest/api/maps/weather/getsevereweatheralertspreview) to retrieve current weather conditions at coordinates located in Cheyenne, WY.

>[!NOTE]
>This example retrieves severe weather alerts at the time of this writing. It is likely that there are no longer any severe weather alerts at the requested location. To retrieve actual severe alert data when running this example, you'll need to retrieve data at a different coordinate location.

1. Open the Postman app, click **New**, and select **Request**. Enter a **Request name** for the request. Select the collection you created in the previous section or created a new one, and then select **Save**.

2. Select the **GET** HTTP method in the builder tab and enter the following URL. For this request, and other requests mentioned in this article, replace `{Azure-Maps-Primary-Subscription-key}` with your primary subscription key.

    ```http
    https://atlas.microsoft.com/weather/severe/alerts/json?api-version=1.0&query=41.161079,-104.805450&subscription-key={Azure-Maps-Primary-Subscription-key}
    ```

3. Click the blue **Send** button. If there are no severe weather alerts, the response body will contain an empty `results[]` array. If there are severe weather alerts, the response body contains something like the following JSON response:

    ```json
    {
    "results": [
        {
            "countryCode": "US",
            "alertId": 2194734,
            "description": {
                "localized": "Red Flag Warning",
                "english": "Red Flag Warning"
            },
            "category": "FIRE",
            "priority": 54,
            "source": "U.S. National Weather Service",
            "sourceId": 2,
            "alertAreas": [
                {
                    "name": "Platte/Goshen/Central and Eastern Laramie",
                    "summary": "Red Flag Warning in effect until 7:00 PM MDT.  Source: U.S. National Weather Service",
                    "startTime": "2020-10-05T15:00:00+00:00",
                    "endTime": "2020-10-06T01:00:00+00:00",
                    "latestStatus": {
                        "localized": "Continue",
                        "english": "Continue"
                    },
                    "alertDetails": "...RED FLAG WARNING REMAINS IN EFFECT FROM 9 AM THIS MORNING TO\n7 PM MDT THIS EVENING FOR STRONG GUSTY WINDS AND LOW HUMIDITY...\n\n* WHERE...Fire weather zones 303, 304, 305, 306, 307, 308, 309,\n  and 310 in southeast Wyoming. Fire weather zone 313 in Nebraska.\n\n* WIND...West to northwest 15 to 30 MPH with gusts around 40 MPH.\n\n* HUMIDITY...10 to 15 percent.\n\n* IMPACTS...Any fires that develop will likely spread rapidly.\n  Outdoor burning is not recommended.\n\nPRECAUTIONARY/PREPAREDNESS ACTIONS...\n\nA Red Flag Warning means that critical fire weather conditions\nare either occurring now...or will shortly. A combination of\nstrong winds...low relative humidity...and warm temperatures can\ncontribute to extreme fire behavior.\n\n&&",
                    "alertDetailsLanguageCode": "en"
                }
            ]
            },...
        ]
    }
    ```

## Request daily weather forecast data

The [Get Daily Forecast API](https://docs.microsoft.com/rest/api/maps/weather/getdailyforecastpreview) returns detailed daily weather forecast such as temperature and wind. The request can specify how many days to return: 1, 5, 10, 15, 25, or 45 days for a given coordinate location. The response includes details such as temperature, wind, precipitation, air quality, and UV index.  In this example, we request for five days by setting `duration=5`.

>[!IMPORTANT]
>In the S0 pricing tier, you can request daily forecast for the next 1, 5, 10, and 15 days. In the S1 pricing tier, you can also request daily forecast for the next 25 days, and 45 days.

In this example, you'll use the [Get Daily Forecast API](https://docs.microsoft.com/rest/api/maps/weather/getdailyforecastpreview) to retrieve the five-day weather forecast for coordinates located in Seattle, WA.

1. Open the Postman app, click **New**, and select **Request**. Enter a **Request name** for the request. Select the collection you created in the previous section or created a new one, and then select **Save**.

2. Select the **GET** HTTP method in the builder tab and enter the following URL. For this request, and other requests mentioned in this article, replace `{Azure-Maps-Primary-Subscription-key}` with your primary subscription key.

    ```http
    https://atlas.microsoft.com/weather/forecast/daily/json?api-version=1.0&query=47.60357,-122.32945&duration=5&subscription-key={Azure-Maps-Primary-Subscription-key}
    ```

3. Click the blue **Send** button. The response body contains the five-day weather forecast data.

## Request hourly weather forecast data

The [Get Hourly Forecast API](https://docs.microsoft.com/rest/api/maps/weather/gethourlyforecastpreview) returns detailed weather forecast by the hour for the next 1, 12, 24 (1 day), 72 (3 days), 120 (5 days), and 240 hours (10 days) for the given coordinate location. The API returns details such as temperature, humidity, wind, precipitation, and UV index.

>[!IMPORTANT]
>In the S0 pricing tier, you can request hourly forecast for the next 1, 12, 24 hours (1 day), and 72 hours (3 days). In the S1 pricing tier, you can also request hourly forecast for the next 120 (5 days) and 240 hours (10 days).

In this example, you'll use the [Get Hourly Forecast API](https://docs.microsoft.com/rest/api/maps/weather/gethourlyforecastpreview) to retrieve the hourly weather forecast for the next 12 hours at coordinates located in Seattle, WA.

1. Open the Postman app, click **New**, and select **Request**. Enter a **Request name** for the request. Select the collection you created in the previous section or created a new one, and then select **Save**.

2. Select the **GET** HTTP method in the builder tab and enter the following URL. For this request, and other requests mentioned in this article, replace `{Azure-Maps-Primary-Subscription-key}` with your primary subscription key.

    ```http
    https://atlas.microsoft.com/weather/forecast/hourly/json?api-version=1.0&query=47.60357,-122.32945&duration=12&subscription-key={Azure-Maps-Primary-Subscription-key}
    ```

3. Click the blue **Send** button. The response body contains weather forecast data for the next 12 hours.

## Request minute-by-minute weather forecast data

 The [Get Minute Forecast API](https://docs.microsoft.com/rest/api/maps/weather/getminuteforecastpreview) returns minute-by-minute forecasts for a given location for the next 120 minutes. Users can request weather forecasts in intervals of 1, 5 and 15 minutes. The response includes details such as the type of precipitation (including rain, snow, or a mixture of both), start time, and precipitation intensity value (dBZ).

In this example, you'll use the [Get Minute Forecast API](https://docs.microsoft.com/rest/api/maps/weather/getminuteforecastpreview) to retrieve the minute-by-minute weather forecast at coordinates located in Seattle, WA. The weather forecast is given for the next 120 minutes. Our query requests that the forecast be given at 15-minute intervals, but you can adjust the parameter to be either 1 or 5 minutes.

1. Open the Postman app, click **New**, and select **Request**. Enter a **Request name** for the request. Select the collection you created in the previous section or created a new one, and then select **Save**.

2. Select the **GET** HTTP method in the builder tab and enter the following URL. For this request, and other requests mentioned in this article, replace `{Azure-Maps-Primary-Subscription-key}` with your primary subscription key.

    ```http
    https://atlas.microsoft.com/weather/forecast/minute/json?api-version=1.0&query=47.60357,-122.32945&interval=15&subscription-key={Azure-Maps-Primary-Subscription-key}
    ```

3. Click the blue **Send** button. The response body contains weather forecast data for the next 120 minutes, in 15-minute intervals.

## Next steps

> [!div class="nextstepaction"]
> [Azure Maps Weather service concepts](https://docs.microsoft.com/azure/azure-maps/weather-services-concepts)

> [!div class="nextstepaction"]
> [Azure Maps Weather service REST API](https://docs.microsoft.com/rest/api/maps/weather
)
