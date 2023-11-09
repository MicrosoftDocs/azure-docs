---
title: Ingesting weather forecast data in Azure Data Manager for Agriculture
description: Learn how to fetch weather data from various weather data providers through extensions and provider Agnostic APIs.
author: lbethapudi
ms.author: lbethapudi
ms.service: data-manager-for-agri
ms.topic: conceptual
ms.date: 02/14/2023
ms.custom: template-concept
---

# Weather data overview

Weather is a highly democratized service in the agriculture industry. Data Manager for Agriculture offers customers the ability to work with the weather provider of their choice. 

Data Manager for Agriculture provides weather current and forecast data through an extension-based and provider agnostic approach. Customers can work with a provider of their choice by following the steps [here](./how-to-write-weather-extension.md). 

## Design overview

Data Manager for Agriculture provides weather data through provider agnostic approach where the user doesn't have to be familiar with the provider's APIs. Instead, they can use the same Data Manager for Agriculture APIs irrespective of the provider. 

## Behavior of provider agnostic APIs

* Request weather data for up to 50 locations in a single call.
* Forecast data provided isn't older than 15 mins and the current conditions data isn't older than 10 mins.
* Once the initial call is made for a location, the data gets cached for the TTL defined.
* To keep the cache warm, you can use the parameter called `apiFreshnessTimeInMinutes` in extension. The platform will keep a job running for the amount of time defined and update the cache. The default value is be zero that means the cache won't be kept warm by default

The steps to fetch weather data and ingest into Data Manager for Agriculture platform.

## Step 1: Install weather extension

Run the install command through Azure Resource Manager ARM Client tool. The command to install the extension is given here:

### Install command
```azurepowershell-interactive
armclient PUT /subscriptions/<subscriptionid>/resourceGroups/<resource-group-name>/providers/Microsoft.AgFoodPlatform/farmBeats/<farmbeats-resource-name>/extensions/<extensionid>?api-version=2020-05-12-preview '{}'
```
> [!NOTE]
> All values within < > is to be replaced with your respective environment values.
>

### Sample output
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

You can ingest weather date after completing the extension installation.

If you would like to update the `apiFreshnessTimeInMinutes` update the extension using below PowerShell command

### Update command
```azurepowershell-interactive
armclient put /subscriptions/<subscriptionid>/resourceGroups/<resource-group-name>/providers/Microsoft.AgFoodPlatform/farmBeats/<farmbeats-resource-name>/<extensionid>?api-version=2021-09-01-preview '{"additionalApiProperties": {""15-day-daily-forecast"": {"apiFreshnessTimeInMinutes": <time>}, ""currents-on-demand"": {"apiFreshnessTimeInMinutes": <time>},""15-day-hourly-forecast"":{"apiFreshnessTimeInMinutes": <time>}}}'
```

> [!NOTE]
> All values within < > is to be replaced with your respective environment values.
> The above update command does merge patch operation which means it updates Freshness Time only for the API mentioned in the command and retains the Freshness Time values for other APIs as they were before.  

### Sample output
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

Once the credentials required to access the APIs is obtained, you need to call the fetch weather data API [here](/rest/api/data-manager-for-agri/dataplane-version2022-11-01-preview/weather-data) to fetch weather data.
