---
title: Request real-time and forecasted weather data using Azure Maps Weather services
titleSuffix: Microsoft Azure Maps
description: Learn how to request real-time (current) and forecasted (minute, hourly, daily) weather data using Microsoft Azure Maps Weather services 
author: FarazGIS
ms.author: fsiddiqui
ms.date: 08/08/2024
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
ms.custom: mvc
---


# Request real-time and forecasted weather data using Azure Maps Weather services

Azure Maps [Weather services] are a set of RESTful APIs that allows developers to integrate highly dynamic historical, real-time, and forecasted weather data and visualizations into their solutions.

This article demonstrates how to request both real-time and forecasted weather data:

* Request real-time (current) weather data using the [Get Current Conditions API].
* Request severe weather alerts using the [Get Severe Weather Alerts API].
* Request daily forecasts using the [Get Daily Forecast API].
* Request hourly forecasts using the [Get Hourly Forecast API].
* Request minute by minute forecasts using the [Get Minute Forecast API].

This video provides examples for making REST calls to Azure Maps Weather services.

</br>

>[!VIDEO https://learn.microsoft.com/Shows/Internet-of-Things-Show/Azure-Maps-Weather-services-for-developers/player?format=ny]

</br>

## Prerequisites

* An [Azure Maps account]
* A [subscription key]

>[!IMPORTANT]
>
> In the URL examples in this article you will need to replace `{Your-Azure-Maps-Subscription-key}` with your Azure Maps subscription key.

This tutorial uses the [bruno] application, but you can choose a different API development environment.

## Request real-time weather data

The [Get Current Conditions API] returns detailed weather conditions such as precipitation, temperature, and wind for a given coordinate location. Also, observations from the past 6 or 24 hours for a particular location can be retrieved. The response includes details like observation date and time, description of weather conditions, weather icon, precipitation indicator flags, and temperature. RealFeel™ Temperature and ultraviolet(UV) index are also returned.

In this example, you use the [Get Current Conditions API] to retrieve current weather conditions at coordinates located in Seattle, WA.

1. Open the bruno app, select **NEW REQUEST** to create the request. In the **NEW REQUEST** window, set **Type** to **HTTP**. Enter a **Name** for the request.

1. Select the **GET** HTTP method in the **URL** drop-down list, then enter the following URL:

    ```http
    https://atlas.microsoft.com/weather/currentConditions/json?api-version=1.0&query=47.60357,-122.32945&subscription-key={Your-Azure-Maps-Subscription-key}
    ```

1. Select the blue **Create** button.

1. Select the run button.

   :::image type="content" source="./media/weather-service/bruno-run.png" alt-text="A screenshot showing the Request real-time weather data URL with the run button highlighted in the bruno app.":::

   The response body contains current weather information.

    ```json
    {
      "results": [
        {
          "dateTime": "2024-08-08T09:22:00-07:00",
          "phrase": "Sunny",
          "iconCode": 1,
          "hasPrecipitation": false,
          "isDayTime": true,
          "temperature": {
            "value": 19.5,
            "unit": "C",
            "unitType": 17
          },
          "realFeelTemperature": {
            "value": 23.7,
            "unit": "C",
            "unitType": 17
          },
          "realFeelTemperatureShade": {
            "value": 19.4,
            "unit": "C",
            "unitType": 17
          },
          "relativeHumidity": 81,
          "dewPoint": {
            "value": 16.2,
            "unit": "C",
            "unitType": 17
          },
          "wind": {
            "direction": {
              "degrees": 0,
              "localizedDescription": "N"
            },
            "speed": {
              "value": 2,
              "unit": "km/h",
              "unitType": 7
            }
          },
          "windGust": {
            "speed": {
              "value": 3.8,
              "unit": "km/h",
              "unitType": 7
            }
          },
          "uvIndex": 4,
          "uvIndexPhrase": "Moderate",
          "visibility": {
            "value": 16.1,
            "unit": "km",
            "unitType": 6
          },
          "obstructionsToVisibility": "",
          "cloudCover": 5,
          "ceiling": {
            "value": 12192,
            "unit": "m",
            "unitType": 5
          },
          "pressure": {
            "value": 1015.9,
            "unit": "mb",
            "unitType": 14
          },
          "pressureTendency": {
            "localizedDescription": "Steady",
            "code": "S"
          },
          "past24HourTemperatureDeparture": {
            "value": 3,
            "unit": "C",
            "unitType": 17
          },
          "apparentTemperature": {
            "value": 20,
            "unit": "C",
            "unitType": 17
          },
          "windChillTemperature": {
            "value": 19.4,
            "unit": "C",
            "unitType": 17
          },
          "wetBulbTemperature": {
            "value": 17.5,
            "unit": "C",
            "unitType": 17
          },
          "precipitationSummary": {
            "pastHour": {
              "value": 0,
              "unit": "mm",
              "unitType": 3
            },
            "past3Hours": {
              "value": 0,
              "unit": "mm",
              "unitType": 3
            },
            "past6Hours": {
              "value": 0,
              "unit": "mm",
              "unitType": 3
            },
            "past9Hours": {
              "value": 0,
              "unit": "mm",
              "unitType": 3
            },
            "past12Hours": {
              "value": 0,
              "unit": "mm",
              "unitType": 3
            },
            "past18Hours": {
              "value": 0,
              "unit": "mm",
              "unitType": 3
            },
            "past24Hours": {
              "value": 0,
              "unit": "mm",
              "unitType": 3
            }
          },
          "temperatureSummary": {
            "past6Hours": {
              "minimum": {
                "value": 16,
                "unit": "C",
                "unitType": 17
              },
              "maximum": {
                "value": 19.5,
                "unit": "C",
                "unitType": 17
              }
            },
            "past12Hours": {
              "minimum": {
                "value": 16,
                "unit": "C",
                "unitType": 17
              },
              "maximum": {
                "value": 20.4,
                "unit": "C",
                "unitType": 17
              }
            },
            "past24Hours": {
              "minimum": {
                "value": 16,
                "unit": "C",
                "unitType": 17
              },
              "maximum": {
                "value": 26.4,
                "unit": "C",
                "unitType": 17
              }
            }
          }
        }
      ]
    }
    ```

## Request severe weather alerts

Azure Maps [Get Severe Weather Alerts API] returns the severe weather alerts that are available worldwide from both official Government Meteorological Agencies and leading global to regional weather alert providers. The service returns details like alert type, category, level. The service also returns detailed descriptions about the active severe alerts for the requested location, such as hurricanes, thunderstorms, lightning, heat waves, or forest fires. As an example, logistics managers can visualize severe weather conditions on a map, along with business locations and planned routes, and coordinate further with drivers and local workers.

In this example, you use the [Get Severe Weather Alerts API] to retrieve current weather conditions at coordinates located in Cheyenne, WY.

> [!NOTE]
> This example retrieves severe weather alerts at the time of this writing. It is likely that there are no longer any severe weather alerts at the requested location. To retrieve actual severe alert data when running this example, you'll need to retrieve data at a different coordinate location.

1. In the bruno app, select **NEW REQUEST** to create the request. In the **NEW REQUEST** window, set **Type** to **HTTP**. Enter a **Name** for the request.

1. Select the **GET** HTTP method in the **URL** drop-down list, then enter the following URL:

    ```http
    https://atlas.microsoft.com/weather/severe/alerts/json?api-version=1.0&query=41.161079,-104.805450&subscription-key={Your-Azure-Maps-Subscription-key}
    ```

1. Select the blue **Create** button.

1. Select the run button.

   :::image type="content" source="./media/weather-service/bruno-run-request-severe-weather-alerts.png" alt-text="A screenshot showing the Request severe weather alerts URL with the run button highlighted in the bruno app.":::

    If there are no severe weather alerts, the response body contains an empty `results[]` array. If there are severe weather alerts, the response body contains something like the following JSON response:

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
                    "summary": "Red Flag Warning in effect until 7:00 PM MDT. Source: U.S. National Weather Service",
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

The [Get Daily Forecast API] returns detailed daily weather forecast such as temperature and wind. The request can specify how many days to return: 1, 5, 10, 15, 25, or 45 days for a given coordinate location. The response includes details such as temperature, wind, precipitation, air quality, and UV index. In this example, we request for five days by setting `duration=5`.

> [!IMPORTANT]
> In the S0 pricing tier, you can request daily forecast for the next 1, 5, 10, and 15 days. In either Gen1 (S1) or Gen2 pricing tier, you can request daily forecast for the next 25 days, and 45 days.
>
> **Azure Maps Gen1 pricing tier retirement**
>
> Gen1 pricing tier is now deprecated and will be retired on 9/15/26. Gen2 pricing tier replaces Gen1 (both S0 and S1) pricing tier. If your Azure Maps account has Gen1 pricing tier selected, you can switch to Gen2 pricing before it’s retired, otherwise it will automatically be updated. For more information, see [Manage the pricing tier of your Azure Maps account].

In this example, you use the [Get Daily Forecast API] to retrieve the five-day weather forecast for coordinates located in Seattle, WA.

1. In the bruno app, select **NEW REQUEST** to create the request. In the **NEW REQUEST** window, set **Type** to **HTTP**. Enter a **Name** for the request.

1. Select the **GET** HTTP method in the **URL** drop-down list, then enter the following URL:

    ```http
    https://atlas.microsoft.com/weather/forecast/daily/json?api-version=1.0&query=47.60357,-122.32945&duration=5&subscription-key={Your-Azure-Maps-Subscription-key}
    ```

1. Select the blue **Create** button.

1. Select the run button.

   :::image type="content" source="./media/weather-service/bruno-run-request-daily-weather-forecast-data.png" alt-text="A screenshot showing the Request daily weather forecast data URL with the run button highlighted in the bruno app.":::

    The response body contains the five-day weather forecast data. For the sake of brevity, the following JSON response shows the forecast for the first day.

    ```json
    {
      "summary": {
        "startDate": "2024-08-09T08:00:00-07:00",
        "endDate": "2024-08-09T20:00:00-07:00",
        "severity": 7,
        "phrase": "Very warm tomorrow",
        "category": "heat"
      },
      "forecasts": [
        {
          "date": "2024-08-08T07:00:00-07:00",
          "temperature": {
            "minimum": {
              "value": 16.2,
              "unit": "C",
              "unitType": 17
            },
            "maximum": {
              "value": 28.9,
              "unit": "C",
              "unitType": 17
            }
          },
          "realFeelTemperature": {
            "minimum": {
              "value": 16.3,
              "unit": "C",
              "unitType": 17
            },
            "maximum": {
              "value": 29.8,
              "unit": "C",
              "unitType": 17
            }
          },
          "realFeelTemperatureShade": {
            "minimum": {
              "value": 16.3,
              "unit": "C",
              "unitType": 17
            },
            "maximum": {
              "value": 27.3,
              "unit": "C",
              "unitType": 17
            }
          },
          "hoursOfSun": 12.9,
          "degreeDaySummary": {
            "heating": {
              "value": 0,
              "unit": "C",
              "unitType": 17
            },
            "cooling": {
              "value": 5,
              "unit": "C",
              "unitType": 17
            }
          },
          "airAndPollen": [
            {
              "name": "AirQuality",
              "value": 56,
              "category": "Moderate",
              "categoryValue": 2,
              "type": "Nitrogen Dioxide"
            },
            {
              "name": "Grass",
              "value": 2,
              "category": "Low",
              "categoryValue": 1
            },
            {
              "name": "Mold",
              "value": 0,
              "category": "Low",
              "categoryValue": 1
            },
            {
              "name": "Ragweed",
              "value": 5,
              "category": "Low",
              "categoryValue": 1
            },
            {
              "name": "Tree",
              "value": 0,
              "category": "Low",
              "categoryValue": 1
            },
            {
              "name": "UVIndex",
              "value": 7,
              "category": "High",
              "categoryValue": 3
            }
          ],
          "day": {
            "iconCode": 2,
            "iconPhrase": "Mostly sunny",
            "hasPrecipitation": false,
            "shortPhrase": "Mostly sunny",
            "longPhrase": "Mostly sunny; wildfire smoke will cause the sky to be hazy",
            "precipitationProbability": 0,
            "thunderstormProbability": 0,
            "rainProbability": 0,
            "snowProbability": 0,
            "iceProbability": 0,
            "wind": {
              "direction": {
                "degrees": 357,
                "localizedDescription": "N"
              },
              "speed": {
                "value": 11.1,
                "unit": "km/h",
                "unitType": 7
              }
            },
            "windGust": {
              "direction": {
                "degrees": 354,
                "localizedDescription": "N"
              },
              "speed": {
                "value": 29.6,
                "unit": "km/h",
                "unitType": 7
              }
            },
            "totalLiquid": {
              "value": 0,
              "unit": "mm",
              "unitType": 3
            },
            "rain": {
              "value": 0,
              "unit": "mm",
              "unitType": 3
            },
            "snow": {
              "value": 0,
              "unit": "cm",
              "unitType": 4
            },
            "ice": {
              "value": 0,
              "unit": "mm",
              "unitType": 3
            },
            "hoursOfPrecipitation": 0,
            "hoursOfRain": 0,
            "hoursOfSnow": 0,
            "hoursOfIce": 0,
            "cloudCover": 10
          },
          "night": {
            "iconCode": 35,
            "iconPhrase": "Partly cloudy",
            "hasPrecipitation": false,
            "shortPhrase": "Partly cloudy",
            "longPhrase": "Partly cloudy; wildfire smoke will cause the sky to be hazy",
            "precipitationProbability": 1,
            "thunderstormProbability": 0,
            "rainProbability": 1,
            "snowProbability": 0,
            "iceProbability": 0,
            "wind": {
              "direction": {
                "degrees": 7,
                "localizedDescription": "N"
              },
              "speed": {
                "value": 9.3,
                "unit": "km/h",
                "unitType": 7
              }
            },
            "windGust": {
              "direction": {
                "degrees": 3,
                "localizedDescription": "N"
              },
              "speed": {
                "value": 20.4,
                "unit": "km/h",
                "unitType": 7
              }
            },
            "totalLiquid": {
              "value": 0,
              "unit": "mm",
              "unitType": 3
            },
            "rain": {
              "value": 0,
              "unit": "mm",
              "unitType": 3
            },
            "snow": {
              "value": 0,
              "unit": "cm",
              "unitType": 4
            },
            "ice": {
              "value": 0,
              "unit": "mm",
              "unitType": 3
            },
            "hoursOfPrecipitation": 0,
            "hoursOfRain": 0,
            "hoursOfSnow": 0,
            "hoursOfIce": 0,
            "cloudCover": 26
          },
          "sources": [
            "AccuWeather"
          ]
        }
      ]
    }
    ```

## Request hourly weather forecast data

The [Get Hourly Forecast API] returns detailed weather forecast by the hour for the next 1, 12, 24 (1 day), 72 (3 days), 120 (5 days), and 240 hours (10 days) for the given coordinate location. The API returns details such as temperature, humidity, wind, precipitation, and UV index.

>[!IMPORTANT]
>In the Gen1 (S0) pricing tier, you can request hourly forecast for the next 1, 12, 24 hours (1 day), and 72 hours (3 days). In either Gen1 (S1) or Gen2 pricing tier, you can request hourly forecast for the next 120 (5 days) and 240 hours (10 days).

In this example, you use the [Get Hourly Forecast API] to retrieve the hourly weather forecast for the next 12 hours at coordinates located in Seattle, WA.

1. In the bruno app, select **NEW REQUEST** to create the request. In the **NEW REQUEST** window, set **Type** to **HTTP**. Enter a **Name** for the request.

1. Select the **GET** HTTP method in the **URL** drop-down list, then enter the following URL:

    ```http
    https://atlas.microsoft.com/weather/forecast/hourly/json?api-version=1.0&query=47.60357,-122.32945&duration=12&subscription-key={Your-Azure-Maps-Subscription-key}
    ```

1. Select the blue **Create** button.

1. Select the run button.

   :::image type="content" source="./media/weather-service/bruno-run-request-hourly-weather-forecast-data.png" alt-text="A screenshot showing the Request hourly weather forecast data URL with the run button highlighted in the bruno app.":::

    The response body contains weather forecast data for the next 12 hours. The following example JSON response only shows the first hour:

    ```json
    {
      "forecasts": [
        {
          "date": "2024-08-07T15:00:00-07:00",
          "iconCode": 2,
          "iconPhrase": "Mostly sunny",
          "hasPrecipitation": false,
          "isDaylight": true,
          "temperature": {
            "value": 24.6,
            "unit": "C",
            "unitType": 17
          },
          "realFeelTemperature": {
            "value": 26.4,
            "unit": "C",
            "unitType": 17
          },
          "wetBulbTemperature": {
            "value": 18.1,
            "unit": "C",
            "unitType": 17
          },
          "dewPoint": {
            "value": 14.5,
            "unit": "C",
            "unitType": 17
          },
          "wind": {
            "direction": {
              "degrees": 340,
              "localizedDescription": "NNW"
            },
            "speed": {
              "value": 14.8,
              "unit": "km/h",
              "unitType": 7
            }
          },
          "windGust": {
            "speed": {
              "value": 24.1,
              "unit": "km/h",
              "unitType": 7
            }
          },
          "relativeHumidity": 53,
          "visibility": {
            "value": 16.1,
            "unit": "km",
            "unitType": 6
          },
          "cloudCover": 11,
          "ceiling": {
            "value": 10211,
            "unit": "m",
            "unitType": 5
          },
          "uvIndex": 5,
          "uvIndexPhrase": "Moderate",
          "precipitationProbability": 0,
          "rainProbability": 0,
          "snowProbability": 0,
          "iceProbability": 0,
          "totalLiquid": {
            "value": 0,
            "unit": "mm",
            "unitType": 3
          },
          "rain": {
            "value": 0,
            "unit": "mm",
            "unitType": 3
          },
          "snow": {
            "value": 0,
            "unit": "cm",
            "unitType": 4
          },
          "ice": {
            "value": 0,
            "unit": "mm",
            "unitType": 3
          }
        }
      ]
    }
    ```

## Request minute-by-minute weather forecast data

 The [Get Minute Forecast API] returns minute-by-minute forecasts for a given location for the next 120 minutes. Users can request weather forecasts in intervals of 1, 5 and 15 minutes. The response includes details such as the type of precipitation (including rain, snow, or a mixture of both), start time, and precipitation intensity value (dBZ).

In this example, you use the [Get Minute Forecast API] to retrieve the minute-by-minute weather forecast at coordinates located in Seattle, WA. The weather forecast is given for the next 120 minutes. Our query requests that the forecast is given at 15-minute intervals, but you can adjust the parameter to be either 1 or 5 minutes.

1. In the bruno app, select **NEW REQUEST** to create the request. In the **NEW REQUEST** window, set **Type** to **HTTP**. Enter a **Name** for the request.

1. Select the **GET** HTTP method in the **URL** drop-down list, then enter the following URL:

    ```http
    https://atlas.microsoft.com/weather/forecast/minute/json?api-version=1.0&query=47.60357,-122.32945&interval=15&subscription-key={Your-Azure-Maps-Subscription-key}
    ```

1. Select the blue **Create** button.

1. Select the run button.

   :::image type="content" source="./media/weather-service/bruno-run-request-minute-by-minute-weather-forecast-data.png" alt-text="A screenshot showing the Request minute-by-minute weather forecast data URL with the run button highlighted in the bruno app.":::

    The response body contains weather forecast data for the next 120 minutes, in 15-minute intervals.

    ```json
    {
      "summary": {
        "briefPhrase60": "No precipitation for at least 60 min",
        "shortPhrase": "No precip for 120 min",
        "briefPhrase": "No precipitation for at least 120 min",
        "longPhrase": "No precipitation for at least 120 min",
        "iconCode": 1
      },
      "intervalSummaries": [
        {
          "startMinute": 0,
          "endMinute": 119,
          "totalMinutes": 120,
          "shortPhrase": "No precip for %MINUTE_VALUE min",
          "briefPhrase": "No precipitation for at least %MINUTE_VALUE min",
          "longPhrase": "No precipitation for at least %MINUTE_VALUE min",
          "iconCode": 1
        }
      ],
      "intervals": [
        {
          "startTime": "2024-08-08T05:58:00-07:00",
          "minute": 0,
          "dbz": 0,
          "shortPhrase": "No Precipitation",
          "iconCode": 1,
          "cloudCover": 7
        },
        {
          "startTime": "2024-08-08T06:13:00-07:00",
          "minute": 15,
          "dbz": 0,
          "shortPhrase": "No Precipitation",
          "iconCode": 1,
          "cloudCover": 3
        },
        {
          "startTime": "2024-08-08T06:28:00-07:00",
          "minute": 30,
          "dbz": 0,
          "shortPhrase": "No Precipitation",
          "iconCode": 1,
          "cloudCover": 2
        },
        {
          "startTime": "2024-08-08T06:43:00-07:00",
          "minute": 45,
          "dbz": 0,
          "shortPhrase": "No Precipitation",
          "iconCode": 1,
          "cloudCover": 2
        },
        {
          "startTime": "2024-08-08T06:58:00-07:00",
          "minute": 60,
          "dbz": 0,
          "shortPhrase": "No Precipitation",
          "iconCode": 1,
          "cloudCover": 1
        },
        {
          "startTime": "2024-08-08T07:13:00-07:00",
          "minute": 75,
          "dbz": 0,
          "shortPhrase": "No Precipitation",
          "iconCode": 1,
          "cloudCover": 1
        },
        {
          "startTime": "2024-08-08T07:28:00-07:00",
          "minute": 90,
          "dbz": 0,
          "shortPhrase": "No Precipitation",
          "iconCode": 1,
          "cloudCover": 0
        },
        {
          "startTime": "2024-08-08T07:43:00-07:00",
          "minute": 105,
          "dbz": 0,
          "shortPhrase": "No Precipitation",
          "iconCode": 1,
          "cloudCover": 0
        }
      ]
    }
    ```

## Next steps

> [!div class="nextstepaction"]
> [Weather service concepts]

> [!div class="nextstepaction"]
> [Weather services]

[Azure Maps account]: quick-demo-map-app.md#create-an-azure-maps-account
[Get Current Conditions API]: /rest/api/maps/weather/getcurrentconditions
[Get Daily Forecast API]: /rest/api/maps/weather/getdailyforecast
[Get Hourly Forecast API]: /rest/api/maps/weather/gethourlyforecast
[Get Minute Forecast API]: /rest/api/maps/weather/getminuteforecast
[Get Severe Weather Alerts API]: /rest/api/maps/weather/getsevereweatheralerts
[Manage the pricing tier of your Azure Maps account]: how-to-manage-pricing-tier.md
[bruno]: https://www.usebruno.com/
[subscription key]: quick-demo-map-app.md#get-the-subscription-key-for-your-account
[Weather service concepts]: weather-services-concepts.md
[Weather services]: /rest/api/maps/weather
