---
title: Ingest weather forecast data in Azure Data Manager for Agriculture
description: Learn how to fetch weather data from various weather data providers through extensions and provider-agnostic APIs.
author: lbethapudi
ms.author: lbethapudi
ms.service: data-manager-for-agri
ms.topic: conceptual
ms.date: 02/14/2023
ms.custom: template-concept
---

# Ingest weather forecast data in Azure Data Manager for Agriculture

Weather is a highly democratized service in the agriculture industry. Azure Data Manager for Agriculture offers customers the ability to work with the weather provider of their choice.

Azure Data Manager for Agriculture provides current and forecast weather data through an extension-based and provider-agnostic approach. You can work with a provider of your choice by following the [steps for writing a weather extension](./how-to-write-weather-extension.md).

## Design overview

Because Azure Data Manager for Agriculture provides weather data through a provider-agnostic approach, you don't have to be familiar with a provider's APIs. Instead, you can use the same Azure Data Manager for Agriculture APIs irrespective of the provider.

Here are some notes about the behavior of provider-agnostic APIs:

* You can request weather data for up to 50 locations in a single call.
* Forecast data isn't older than 15 minutes. Data for current conditions isn't older than 10 minutes.
* After the initial call is made for a location, the data is cached for the defined time to live (TTL).
* To keep the cache warm, you can use the `apiFreshnessTimeInMinutes` parameter in the weather extension. The platform keeps a job running for the defined amount of time and updates the cache. The default value is zero, which means the cache isn't kept warm by default.

The following sections provide the commands to fetch weather data and ingest it into Azure Data Manager for Agriculture.

## Step 1: Install the weather extension

To install the extension, run the following command by using the Azure Resource Manager ARMClient tool.

Replace all values within angle brackets (`<>`) with your respective environment values. The extension ID that's currently supported is `IBM.TWC`.

```azurepowershell-interactive
armclient PUT /subscriptions/<subscriptionid>/resourceGroups/<resource-group-name>/providers/Microsoft.AgFoodPlatform/farmBeats/<farmbeats-resource-name>/extensions/<extensionid>?api-version=2020-05-12-preview '{}'
```

Here's sample output for the installation command:

```json
{
      "id": "/subscriptions/<subscriptionid>/resourceGroups/<resource-group-name>/providers/Microsoft.AgFoodPlatform/farmBeats/<farmbeats-resource-name>/extensions/<extensionid>",
      "type": "Microsoft.AgFoodPlatform/farmBeats/extensions",
      "systemData": {
        "createdBy": "testuser@abc.com",
        "createdByType": "User",`        
        "createdAt": "2021-03-17T12:36:51Z",
        "lastModifiedBy": "testuser@abc.com",
        "lastModifiedByType": "User",
        "lastModifiedAt": "2021-03-17T12:36:51Z"
      },
      "properties": {
        "category": "Weather",
        "installedExtensionVersion": "1.0",
        "extensionAuthLink": "https://www.<provider.com/integration/",
        "extensionApiDocsLink": "https://docs.<provider>.com/documentation/Weather_Data/Historical_and_Climatological_Weather/latest#_daily_historical_ag_weather_v1_0"
      },
      "eTag": "92003c91-0000-0700-0000-804752e00000",
      "name": "<provider>"
}
```

After you finish installing the extension, you can ingest weather data.

If you want to update `apiFreshnessTimeInMinutes`, update the extension by using the following PowerShell command. Replace all values within angle brackets with your respective environment values.

```azurepowershell-interactive
armclient put /subscriptions/<subscriptionid>/resourceGroups/<resource-group-name>/providers/Microsoft.AgFoodPlatform/farmBeats/<farmbeats-resource-name>/<extensionid>?api-version=2021-09-01-preview '{"additionalApiProperties": {""15-day-daily-forecast"": {"apiFreshnessTimeInMinutes": <time>}, ""currents-on-demand"": {"apiFreshnessTimeInMinutes": <time>},""15-day-hourly-forecast"":{"apiFreshnessTimeInMinutes": <time>}}}'
```

The preceding update command merges patch operations. It updates freshness time for only the API mentioned in the command and retains the freshness time values for other APIs as they were before.  

Here's sample output for the update command:

```json
{
  "id": "/subscriptions/<subscriptionid>/resourceGroups/<resource-group-name>/providers/Microsoft.AgFoodPlatform/farmBeats/<farmbeats-resource-name>/extensions/<extensionid>",
  "type": "Microsoft.AgFoodPlatform/farmBeats/extensions",
  "systemData": {
    "createdBy": "50e74af5-3b8f-4a8c-9521-4f506b4e0c16",
    "createdByType": "User",
    "createdAt": "2022-10-10T21:28:05Z",
    "lastModifiedBy": "50e74af5-3b8f-4a8c-9521-4f506b4e0c16",
    "lastModifiedByType": "User",
    "lastModifiedAt": "2022-11-08T13:10:17Z"
  },
  "properties": {
    "extensionId": "provider",
    "extensionCategory": "Weather",
    "installedExtensionVersion": "2.0",
    "extensionApiDocsLink": "https://go.microsoft.com/fwlink/?linkid=2192974",
    "additionalApiProperties": {
      "15-day-daily-forecast": {
        "apiFreshnessTimeInMinutes": 1600
      },
      "currents-on-demand": {
        "apiFreshnessTimeInMinutes": 1600
      },
       "15-day-hourly-forecast": {
        "apiFreshnessTimeInMinutes": 1600
      }
    }
  },
  "eTag": "ea0261d0-0000-0700-0000-636a55390000",
  "name": "provider"
}
```

## Step 2: Fetch weather data

After you get the credentials that are required to access the APIs, you need to call the [Weather Data API](/rest/api/data-manager-for-agri/dataplane-version2022-11-01-preview/weather-data) to fetch weather data.
