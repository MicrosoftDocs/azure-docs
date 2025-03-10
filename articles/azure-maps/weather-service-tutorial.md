---
title: 'Tutorial: Join sensor data with weather forecast data using Jupyter Notebooks (Python)'
titleSuffix: Microsoft Azure Maps
description: Tutorial on how to join sensor data with weather forecast data from Microsoft Azure Maps Weather services using Jupyter Notebooks in VS Code (Python).
author: farazgis
ms.author: fsiddiqui
ms.date: 10/28/2024
ms.topic: tutorial
ms.service: azure-maps
ms.subservice: weather
ms.custom: mvc, devx-track-python
---

# Tutorial: Join sensor data with weather forecast data using Jupyter Notebooks (Python)

Wind power is one alternative energy source for fossil fuels to combat against climate change. Because wind isn't consistent by nature, wind power operators need to build machine learning (ML) models to predict the wind power capacity. This prediction is necessary to meet electricity demand and ensure the grid stability. In this tutorial, we walk through how Azure Maps weather forecast data is combined with demo data for weather readings. Weather forecast data is requested by calling Azure Maps Weather services.

In this tutorial, you will:

> [!div class="checklist"]
>
> * Create and run a [Jupyter Notebook in VS Code].
> * Load demo data from file.
> * Call Azure Maps REST APIs in Python.
> * Render location data on the map.
> * Enrich the demo data with Azure Maps [Daily Forecast] weather data.
> * Plot forecast data in graphs.

> [!NOTE]
> The Jupyter notebook file for this project can be downloaded from the [Weather Maps Jupyter Notebook repository].

## Prerequisites

If you don't have an Azure subscription, create a [free account] before you begin.

* An [Azure Maps account]
* A [subscription key]
* [Visual Studio Code]
* A working knowledge of [Jupyter Notebooks in VS Code]
* Environment set up to work with Python in Jupyter Notebooks. For more information, see [Setting up your environment].

> [!NOTE]
> For more information on authentication in Azure Maps, see [manage authentication in Azure Maps].

## Install project level packages

The _EV Routing and Reachable Range_ project has dependencies on the [aiohttp] and [IPython] python libraries. You can install these in the Visual Studio terminal using pip:

```python
pip install aiohttp
pip install ipython
pip install pandas
```

## Open Jupyter Notebook in Visual Studio Code

Download then open the Notebook used in this tutorial:

1. Open the file [weatherDataMaps.ipynb] in the [AzureMapsJupyterSamples] repository in GitHub.
1. Select the **Download raw file** button in the upper-right corner of the screen to save the file locally.

    :::image type="content" source="./media/weather-service-tutorial/download-notebook.png"alt-text="A screenshot showing how to download the Notebook file named weatherDataMaps.ipynb from the GitHub repository.":::

1. Open the downloaded Notebook in Visual Studio Code by right-clicking on the file then selecting **Open with > Visual Studio Code**, or through the VS Code File Explorer.

## Load the required modules and frameworks

Once your code is added, you can run a cell using the **Run** icon to the left of the cell and the output is displayed below the code cell.

Run the following script to load all the required modules and frameworks.

```Python
import aiohttp
import pandas as pd
import datetime
from IPython.display import Image, display
```

:::image type="content" source="./media/weather-service-tutorial/import-libraries.png"alt-text="A screenshot showing how to download the first cell in the Notebook containing the required import statements with the run button highlighted.":::

## Import weather data

This tutorial uses weather data readings from sensors installed at four different wind turbines. The sample data consists of 30 days of weather readings. These readings are gathered from weather data centers near each turbine location. The demo data contains data readings for temperature, wind speed and, direction. You can download the demo data contained in [weather_dataset_demo.csv] from GitHub. The script below imports demo data to the Azure Notebook.

```python
df = pd.read_csv("./data/weather_dataset_demo.csv")
```

## Request daily forecast data

In our scenario, we would like to request daily forecast for each sensor location. The following script calls the [Daily Forecast] API of the Azure Maps Weather services. This API returns weather forecast for each wind turbine, for the next 15 days from the current date.

```python
subscription_key = "Your Azure Maps key"

# Get a lists of unique station IDs and their coordinates 
station_ids = pd.unique(df[['StationID']].values.ravel())
coords = pd.unique(df[['latitude','longitude']].values.ravel())

years,months,days = [],[],[]
dates_check=set()
wind_speeds, wind_direction = [], []

# Call azure maps Weather services to get daily forecast data for 15 days from current date
session = aiohttp.ClientSession()
j=-1
for i in range(0, len(coords), 2):
    wind_speeds.append([])
    wind_direction.append([])
    
    query = str(coords[i])+', '+str(coords[i+1])
    forecast_response = await(await session.get("https://atlas.microsoft.com/weather/forecast/daily/json?query={}&api-version=1.0&subscription-key={Your-Azure-Maps-Subscription-key}&duration=15".format(query, subscription_key))).json()
    j+=1
    for day in range(len(forecast_response['forecasts'])):
            date = forecast_response['forecasts'][day]['date'][:10]
            wind_speeds[j].append(forecast_response['forecasts'][day]['day']['wind']['speed']['value'])
            wind_direction[j].append(forecast_response['forecasts'][day]['day']['windGust']['direction']['degrees'])
            
            if date not in dates_check:
                year,month,day= date.split('-')
                years.append(year)
                months.append(month)
                days.append(day)
                dates_check.add(date)
            
await session.close()
```

The following script renders the turbine locations on the map by calling the [Get Map Image service].

```python
# Render the turbine locations on the map by calling the Azure Maps Get Map Image service
session = aiohttp.ClientSession()

pins="default|la-25+60|ls12|lc003C62|co9B2F15||'Location A'{} {}|'Location B'{} {}|'Location C'{} {}|'Location D'{} {}".format(coords[1],coords[0],coords[3],coords[2],coords[5],coords[4], coords[7],coords[6])

image_response = "https://atlas.microsoft.com/map/static/png?subscription-key={Your-Azure-Maps-Subscription-key}&api-version=1.0&layer=basic&style=main&zoom=6&center={},{}&pins={}".format(subscription_key,coords[7],coords[6],pins)

static_map_response = await session.get(image_response)

poi_range_map = await static_map_response.content.read()

await session.close()

display(Image(poi_range_map))
```

:::image type="content" source="./media/weather-service-tutorial/location-map.png"alt-text="A screenshot showing turbine locations on a map.":::

Group the forecast data with the demo data based on the station ID. The station ID is for the weather data center. This grouping augments the demo data with the forecast data.

```python
# Group forecasted data for all locations
df = df.reset_index(drop=True)
forecast_data = pd.DataFrame(columns=['StationID','latitude','longitude','Year','Month','Day','DryBulbCelsius','WetBulbFarenheit','WetBulbCelsius','DewPointFarenheit','DewPointCelsius','RelativeHumidity','WindSpeed','WindDirection'])

for i in range(len(station_ids)):
    loc_forecast = pd.DataFrame({'StationID':station_ids[i], 'latitude':coords[0], 'longitude':coords[1], 'Year':years, 'Month':months, 'Day':days, 'WindSpeed':wind_speeds[i], 'WindDirection':wind_direction[i]})
    forecast_data = pd.concat([forecast_data,loc_forecast], axis=0, sort=False)
    
combined_weather_data = pd.concat([df,forecast_data])
grouped_weather_data = combined_weather_data.groupby(['StationID'])
```

The following table displays the combined historical and forecast data for one of the turbine locations.

```python
# Display data for first location
grouped_weather_data.get_group(station_ids[0]).reset_index()
```

![Grouped data](./media/weather-service-tutorial/grouped-data.png)

## Plot forecast data

Plot the forecasted values against the days for which they're forecasted. This plot allows us to see the speed and direction changes of the wind for the next 15 days.

```python
# Plot wind speed
curr_date = datetime.datetime.now().date()
windsPlot_df = pd.DataFrame({ 'Location A': wind_speeds[0], 'Location B': wind_speeds[1], 'Location C': wind_speeds[2], 'Location D': wind_speeds[3]}, index=pd.date_range(curr_date,periods=15))
windsPlot = windsPlot_df.plot.line()
windsPlot.set_xlabel("Date")
windsPlot.set_ylabel("Wind speed")
```

```python
#Plot wind direction 
windsPlot_df = pd.DataFrame({ 'Location A': wind_direction[0], 'Location B': wind_direction[1], 'Location C': wind_direction[2], 'Location D': wind_direction[3]}, index=pd.date_range(curr_date,periods=15))
windsPlot = windsPlot_df.plot.line()
windsPlot.set_xlabel("Date")
windsPlot.set_ylabel("Wind direction")
```

The following graphs visualize the forecast data. For the change of wind speed, see the left graph. For change in wind direction, see the right graph. This data is prediction for next 15 days from the day the data is requested.

:::image type="content" source="./media/weather-service-tutorial/speed-date-plot.png"alt-text="A screenshot showing wind speed plots.":::

:::image type="content" source="./media/weather-service-tutorial/direction-date-plot.png"alt-text="A screenshot showing wind direction plots.":::

In this tutorial, you learned how to call Azure Maps REST APIs to get weather forecast data. You also learned how to visualize the data on graphs.

To explore the Azure Maps APIs that are used in this tutorial, see:

* [Daily Forecast]
* [Render - Get Map Image]

For a complete list of Azure Maps REST APIs, see [Azure Maps REST APIs].

## Next steps

> [!div class="nextstepaction"]
> [Learn more about all the notebooks experiences from Microsoft and GitHub](https://visualstudio.microsoft.com/vs/features/notebooks-at-microsoft)

[aiohttp]: https://pypi.org/project/aiohttp/
[Azure Maps account]: quick-demo-map-app.md#create-an-azure-maps-account
[Azure Maps REST APIs]: /rest/api/maps
[AzureMapsJupyterSamples]: https://github.com/Azure-Samples/Azure-Maps-Jupyter-Notebook
[Daily Forecast]: /rest/api/maps/weather/getdailyforecast
[free account]: https://azure.microsoft.com/free/
[Get Map Image service]: /rest/api/maps/render/get-map-static-image
[IPython]: https://ipython.readthedocs.io/en/stable/index.html
[Jupyter Notebook in VS Code]: https://code.visualstudio.com/docs/datascience/jupyter-notebooks
[Jupyter Notebooks in VS Code]: https://code.visualstudio.com/docs/datascience/jupyter-notebooks
[Manage authentication in Azure Maps]: how-to-manage-authentication.md
[Render - Get Map Image]: /rest/api/maps/render/get-map-static-image
[Setting up your environment]: https://code.visualstudio.com/docs/datascience/jupyter-notebooks#_setting-up-your-environment
[subscription key]: quick-demo-map-app.md#get-the-subscription-key-for-your-account
[Visual Studio Code]: https://code.visualstudio.com/
[Weather Maps Jupyter Notebook repository]: https://github.com/Azure-Samples/Azure-Maps-Jupyter-Notebook/tree/master/AzureMapsJupyterSamples/Tutorials/Analyze%20Weather%20Data
[weather_dataset_demo.csv]: https://github.com/Azure-Samples/Azure-Maps-Jupyter-Notebook/tree/master/AzureMapsJupyterSamples/Tutorials/Analyze%20Weather%20Data/data
[weatherDataMaps.ipynb]: https://github.com/Azure-Samples/Azure-Maps-Jupyter-Notebook/blob/master/AzureMapsJupyterSamples/Tutorials/Analyze%20Weather%20Data/weatherDataMaps.ipynb
