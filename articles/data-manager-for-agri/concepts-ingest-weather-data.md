---
title: Ingesting Weather Forecast Data
description: Learn how to fetch weather data from various weather data providers through Extensions and Provider Agnostic APIs
author: lbethapudi
ms.author: lbethapudi
ms.service: data-manager-for-agri
ms.topic: conceptual #Required; leave this attribute/value as-is.
ms.date: 02/14/2023
ms.custom: template-concept #Required; leave this attribute/value as-is.
---

# Weather data overview

Weather is a highly democratized service in the agri industry. Data Manager for Agriculture wants to offer it's customers the ability to be able to work with weather provider of their choice. 

Data Manager for Agriculture provides weather data through an extension-based and provider agnostic approach. 
Customers can work with a provider of their choice by following the steps here](./how-to-write-weather-extension.md)

Out of the box we are supporting IBM TWC weather provider.

## Design overview

Data Manager for Agriculture provides weather data through provider agnostic approach where the user does not have to be familiar with the provider's APIs. Instead, they can use the same Data Manager for Agriculture APIs irrespective of the provider. 

Currently supported weather data provider is [**IBM TWC**](https://developer.ibm.com/components/weather-company/apis/)

## Behaviour of provider agnostic APIs

* These APIs provide the ability to request weather data for upto 50 locations in a single call
* The forecast data provided to the customers will not be older than 15 mins and the current conditions data will not be older than 10 mins
* The SLA for pass-through calls will be IBM SLA+200 ms. A call will considered pass-through if there is no data cached for the requested locations. 
* Once the initial call is made for a location, the data gets cached for the TTL defined above based on whether the data is current conditions or forecast.
* To keep the cache warm, there is a parameter called `apiFreshnessTimeInMinutes` in extension that can be defined by the customer. The platform will keep a job running for the amount of time defined above and update the cache. The default value will be zero which means the cache will not be kept warm by default

### Prerequisite to use IBM TWC weather APIs

To start using IBM's APIs, please go through the documentation [here](https://developer.ibm.com/components/weather-company/apis/).

>[Tip]
>If you are a customer of IBM TWC, then you can skip the above step and directly proceed to using the APIs.
 

The steps to fetch weather data and ingest into Data Manager for Agriculture platform.

## Step 1: Install weather extension

Run the install command through Azure Resource Manager ARMClient tool. Below is the command to install an extension. Refer to the extension API documentation [here](https://review.learn.microsoft.com/rest/api/data-manager-for-agri/controlplane-version2021-09-01-preview/extensions) for more information on all supported commands.

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
        "createdByType": "User",
        "createdAt": "2021-03-17T12:36:51Z",
        "lastModifiedBy": "testuser@abc.com",
        "lastModifiedByType": "User",
        "lastModifiedAt": "2021-03-17T12:36:51Z"
      },
      "properties": {
        "category": "Weather",
        "installedExtensionVersion": "1.0",
        "extensionAuthLink": "https://www.dtn.com/dtn-content-integration/",
        "extensionApiDocsLink": "https://docs.clearag.com/documentation/Weather_Data/Historical_and_Climatological_Weather/latest#_daily_historical_ag_weather_v1_0"
      },
      "eTag": "92003c91-0000-0700-0000-804752e00000",
      "name": "DTN.ClearAg"
}
```

Post successful completion of extension installation you will be able to ingest weather data (step 2) through the installed extension.

If you would like to update the `apiFreshnessTimeInMinutes` please update the extension using below PowerShell command

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
    "extensionId": "IBM.TWC",
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
  "name": "IBM.TWC"
}
```

### Supported weather provider

#### IBM TWC

To work with this extension, the `extensionId` used needs to be **IBM.TWC** and the apiNames supported are `15-day-daily-forecast`, `15-day-hourly-forecast` & `currents-on-demand`. For more information on the API inputs, read the documentation [here](https://review.learn.microsoft.com/rest/api/data-manager-for-agri/dataplane-version2022-11-01-preview/weather-data/)

## Step 2: Fetch weather data

Once the credentials required to access the APIs is obtained, you need to call the fetch weather data API [here](https://review.learn.microsoft.com/en-us/rest/api/data-manager-for-agri/dataplane-version2022-11-01-preview/weather) to fetch weather data.


