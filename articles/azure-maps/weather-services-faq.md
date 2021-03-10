---
title: Microsoft Azure Maps Weather services (Preview) frequently asked questions (FAQ) 
description: Find answer to common questions about Azure Maps Weather services (Preview) data and features.
author: anastasia-ms
ms.author: v-stharr
ms.date: 12/07/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Azure Maps Weather services (Preview) frequently asked questions (FAQ)

> [!IMPORTANT]
> Azure Maps Weather services are currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article answers to common questions about Azure Maps [Weather services](/rest/api/maps/weather) data and features. The following topics are covered:

* Data sources and data models
* Weather services coverage and availability
* Data update frequency
* Developing with Azure Maps SDKs
* Options to visualize weather data, including Microsoft Power BI integration

## Data sources and data models

**How does Azure Maps source Weather data?**

Azure Maps is built with the collaboration of world-class mobility and location technology partners, including AccuWeather, who provides the underlying weather data. To read the announcement of  Azure Maps’ collaboration with AccuWeather, see [Rain or shine: Azure Maps Weather Services will bring insights to your enterprise](https://azure.microsoft.com/blog/rain-or-shine-azure-maps-weather-services-will-bring-insights-to-your-enterprise/).

AccuWeather has real-time weather and environmental information available anywhere in the world, largely due to their partnerships with numerous national governmental weather agencies and other proprietary arrangements. A list of this foundational information is provided below.

* Publicly available global surface observations from government agencies
* Proprietary surface observation datasets from governments and private companies
* High-resolution radar data for over 40 countries/regions
* Best-in-class real-time global lightning data
* Government-issued weather warnings for over 60 countries/regions and territories
* Satellite data from geostationary weather satellites covering the entire world
* Over 150 numerical forecast models including internal, proprietary modeling, government models such as the U.S. Global Forecast System (GFS), and unique downscaled models provided by private companies
* Air quality observations
* Observations from departments of transportation

Tens of thousands of surface observations, along with other data, are incorporated to create and influence the current conditions made available to users. This includes not only freely available standard datasets, but also unique observations obtained from national meteorological services in many countries/regions including India, Brazil, and Canada and other proprietary inputs. These unique datasets increase the spatial and temporal resolution of current condition data for our users. 

These datasets are reviewed in real time for accuracy for the Digital Forecast System, which utilizes AccuWeather’s proprietary artificial intelligence algorithms to continuously modify the forecasts, ensuring they always incorporate the latest data and thereby maximizing their continual accuracy.

**What models create weather forecast data?**

Numerous weather forecast guidance systems are utilized to formulate global forecasts. Over 150 numerical forecast models are used each day, both external and internal datasets. This includes government models such as the European Centre ECMWF and the U.S. Global Forecast System (GFS). Additionally, AccuWeather incorporates proprietary high-resolution models that downscale forecasts to specific locations and strategic regional domains to predict weather with further accuracy. AccuWeather’s unique blending and weighting algorithms   have been developed over the last several decades. These algorithms optimally leverage the numerous forecast inputs to provide highly accurate forecasts.

## Weather services (Preview) coverage and availability

**What kind of coverage can I expect for different countries/regions?**

Weather service coverage varies by country/region. All features are not available in every country/region. For more information, see [coverage documentation](./weather-coverage.md).

## Data update frequency

**How often is Current Conditions data updated?**

Current Conditions data is approximately updated at least once an hour, but can be updated more frequently with rapidly changing conditions – such as large temperature changes, sky conditions changes, precipitation changes, and so on. Most observation stations around the world report many times per hour as conditions change. However, a few areas will still only update once, twice, or four times an hour at scheduled intervals.  

Azure Maps caches the Current Conditions data for up to 10 minutes to help capture the near real-time update frequency of the data as it occurs. To see when the cached response expires and avoid displaying outdated data, you can leverage the Expires Header information in the HTTP header of the Azure Maps API response.

**How often is Daily and Hourly Forecast data updated?**

Daily and Hourly Forecast data is updated multiple times per day, as updated observations are received.  For example, if a forecasted high/low temperature is surpassed, our Forecast data will adjust at the next update cycle. This can happen at different intervals but typically happens within an  hour. Many sudden weather conditions can cause a forecast data change. For example, on a hot summer afternoon, an isolated thunderstorm can suddenly emerge, bringing heavy cloud coverage and rain. The isolated storm can effectively drop temperature by as much as 10 degrees. This new temperature value will impact the Hourly and Daily Forecasts for the remainder of the day, and as such, will be updated in our datasets.

Azure Maps Forecast APIs are cached for up to 30 mins. To see when the cached response expires and avoid displaying outdated data, you can leverage the Expires Header information in the HTTP header of the Azure Maps API response. We recommend updating as necessary based on a specific product use case and UI (user interface).

## Developing with Azure Maps SDKs

**Does Azure Maps  Web SDK  natively support Weather services (Preview) integration?**

The Azure Maps Web SDK provides a services module. The services module is a helper library that makes it easy to use the Azure Maps REST services in web or Node.js applications. by using JavaScript or TypeScript. To get started, see our [documentation](./how-to-use-services-module.md).

**Does Azure Maps Android SDK natively support Weather services (Preview) integration?**

The Azure Maps Android SDKs supports Mercator tile layers, which can have x/y/zoom notation, quad key notation, or EPSG 3857 bounding box notation.

We plan to create a services module for Java/Android similar to the web SDK module. The Android services module will make it easy to access all Azure Maps services in a Java or Android app.  

## Data visualizations  

**Does Azure Maps Power BI Visual support Azure Maps weather tiles?**

Yes. To learn how to migrate radar and infrared satellite tiles to the Microsoft Power BI visual, see [Add a tile layer to Power BI visual](./power-bi-visual-add-tile-layer.md). 

**How do I interpret colors used for radar and satellite tiles?**

The Azure Maps [Weather concept article](./weather-services-concepts.md#radar-and-satellite-imagery-color-scale) includes a guide to help interpret colors used for radar and satellite tiles. The article covers color samples and HEX color codes.
 
**Can I create radar and satellite tile animations?**

Yes. In addition to real-time radar and satellite tiles, Azure Maps customers can request past and future tiles to enhance data visualizations with map overlays. This can be done by directly calling [Get Map Tile v2 API](/rest/api/maps/renderv2/getmaptilepreview) or by requesting tiles via Azure Maps web SDK. Radar tiles are provided for up to 1.5 hours in the past, and for up to 2 hours in the future. The tiles and are available in 5-minute intervals. Infrared tiles are provided for up to 3 hours in the past, and are available in 10-minute intervals. For more information, see the open-source Weather Tile Animation [code sample](https://azuremapscodesamples.azurewebsites.net/index.html?sample=Animated%20tile%20layer).  

**Do you offer icons for different weather conditions?**

Yes. You can find icons and their respective codes [here](./weather-services-concepts.md#weather-icons). Notice that only some of the Weather service (Preview) APIs, such as  [Get Current Conditions API](/rest/api/maps/weather/getcurrentconditionspreview), return the *iconCode* in the response. For more information, see the Current WeatherConditions open-source [code sample](https://azuremapscodesamples.azurewebsites.net/index.html?sample=Get%20current%20weather%20at%20a%20location).

## Next steps

If this FAQ doesn’t answer your question, you can contact us through the following channels (in escalating order):

* The comments section of this article.
* [MSFT Q&A page for Azure Maps](/answers/topics/azure-maps.html).
* Microsoft Support. To create a new support request, in the [Azure portal](https://portal.azure.com/), on the Help tab, select the **Help +** support button, and then select **New support request**.
* [Azure Maps UserVoice](https://feedback.azure.com/forums/909172-azure-maps) to submit feature requests.

Learn how to request real-time and forecasted weather data using Azure Maps Weather services (Preview):
> [!div class="nextstepaction"]
> [Request Real-time weather data ](how-to-request-weather-data.md)

Azure Maps Weather services (Preview) concepts article:
> [!div class="nextstepaction"]
> [Weather services concepts](weather-coverage.md)

Explore the Azure Maps Weather services (Preview) API documentation:

> [!div class="nextstepaction"]
> [Azure Maps Weather services](/rest/api/maps/weather)