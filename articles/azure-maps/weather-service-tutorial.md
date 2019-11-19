---
title: Join sensor data with weather forecast data by using Azure Notebooks(Python) | Microsoft Docs
description: This tutorial show you how to join sensor data with weather forecast data from Azure Maps weather service by using Azure Notebooks(Python). 
author: walsehgal
ms.author: v-musehg
ms.date: 11/19/2019
ms.topic: tutorial
ms.service: azure-maps
services: azure-maps
manager: philmea
ms.custom: mvc
---


# Join sensor data with weather forecast data by using Azure Notebooks (Python)

Wind power is one alternative energy source for fossil fuels to combat against climate change. Because wind itself is not consistent by nature, wind power operators need to build ML (machine learning) models to predict the wind power capacity to meet electricity demand and ensure the grid stability. In this tutorial, we walk through how Azure Maps weather forecast data can be combined with demo data set of sensor locations with weather readings. Weather forecast data is requested by calling Azure Maps Weather service.

In this tutorial, you will:

> [!div class="checklist"]
> * Work with data files in [Azure Notebooks](https://docs.microsoft.com/azure/notebooks) in the cloud.
> *	Call Azure Maps REST APIs in Python.
> *	Load demo data from file.
> *	Enrich the demo data with Azure Maps [Daily Forecast](https://aka.ms/AzureMapsWeatherDailyForecast) weather data.
> *	Render the joined results on a map.


## Prerequisites

To complete this tutorial, you first need to:

1. Create an Azure Maps account subscription in the S0 pricing tier by following instructions in [Manage your Azure Maps account](https://docs.microsoft.com/en-us/azure/azure-maps/how-to-manage-account-keys#create-a-new-account).
2. Get the primary subscription key for your account, follow the instructions here [Search nearby points of interest by using Azure Maps](./tutorial-search-location.md#getkey).

To get familiar with Azure notebooks and to know how to get started, please follow the instructions [Create an Azure Notebook](https://docs.microsoft.com/azure/azure-maps/tutorial-ev-routing#create-an-azure-notebook).


## Load the required modules and frameworks

```python
import aiohttp
import datetime
import numpy as np
import pandas as pd
from IPython.display import Image, display
```

## Import weather data

For the sake of this tutorial we will utilize weather data readings from four different sensors installed at four different wind turbines. The data consists of thirty days of weather readings for each turbine. 

```python
df = pd.read_csv("weather_dataset_demo.csv")
df = df.drop(['Time','DryBulbCelsius', 'WetBulbFarenheit', 'WetBulbCelsius', 'DewPointFarenheit', 'DewPointCelsius', 'RelativeHumidity'], axis=1)
```


## Request forecast data for next 15 days

In our scenario we would like to request daily forecast for the next fifteen days, for each sensor locations we have. The following script calls the [Daily Forecast API](https://aka.ms/AzureMapsWeatherDailyForecast) of the Azure Maps weather service to get daily weather forecast for each of the four wind turbine locations for the next fifteen days.


```python
subscriptionKey = "hRg7mk3gqb6XIsouruxsHPto5PWW3gBpFEtA6VTW53A"
coords = pd.unique(df[['latitude','longitude']].values.ravel())
data = {}
dates = set()
windSpeeds = []
windDirection = []

for i in range(0, len(coords), 2):
    data[tuple(coords[i:i+2])] = []
    windSpeeds.append([])
    windDirection.append([])
    
session = aiohttp.ClientSession()
i=-1

for key, vals in data.items():
    query = str(key[0])+', '+str(key[1])
    call = await(await session.get("https://t-azmaps.azurelbs.com/weather/forecast/daily/json?query={}&api-version=1.0&subscription-key={}&duration=15".format(query, subscriptionKey))).json()
    i+=1
    for day in range(len(call['forecasts'])):
            
            data[key].append(forecast)
            windSpeeds[i].append(call['forecasts'][day]['day']['wind']['speed']['value'])
            windDirection[i].append(call['forecasts'][day]['day']['windGust']['direction']['degrees'])
            dates.add(date)
    
await session.close()
```

## Plot forecast data

In order to see how the wind speeds and direction change over the course of next fifteen days, we will plot the forcasted values against the days. The graphs below visualize the change of wind speed and direction with respect to days.