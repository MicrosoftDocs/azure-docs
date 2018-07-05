---
title: Overview of Azure Maps | Microsoft Docs
description: An introduction to Azure Maps
author: dsk2015
ms.author: dkshir
ms.date: 05/07/2018
ms.topic: overview
ms.service: azure-maps
services: azure-maps
manager: timlt
ms.custom: mvc
#Customer intent: As an Azure enterprise customer, I want to know what capabilities Azure Maps has so that I can leverage my Azure cloud with the Mapping service. 
---
 
# What is Azure Maps?
Azure Maps is a collection of REST APIs for geospatial services such as Maps, Search, Routing, Traffic, and Time Zones. You may use these APIs with familiar tools to quickly develop and scale solutions that integrate location information into your Azure solutions. Azure Maps is backed by fresh mapping data so you can provide accurate geographic context to your web and mobile applications. Alongwith the REST APIs, it provides a web-based JavaScript control to make development easy, flexible, and portable across multiple mediums. 

The following video introduces Azure Maps:

<iframe src="https://channel9.msdn.com/Shows/Azure-Friday/Azure-Location-Based-Services/player" width="960" height="540" allowFullScreen frameBorder="0"></iframe>

## Geospatial services

Azure Maps consists of the following six primary services to bolster Azure applications with geographic context. 

1. The **Render service** is designed for developers to create web and mobile applications around mapping. The service uses either high-quality raster graphic images, available in 19 zoom levels, or fully customizable vector format map images.

![Azure Maps Map.png](media/about-azure-maps/Introduction_Map.png)

2. The **Route service** contains robust real-world infrastructure geometry calculations and multiple transportation mode directions. The service allows for developers to calculate directions across a number of travel modes such as car, truck, bicycle, or walking. The service can also consider inputs such as traffic conditions, weight restrictions, or hazardous material transport.

![Azure Maps Route.png](media/about-azure-maps/Introduction_Route.png)

3. The **Search service** is designed for developers to search for addresses, places, business listings by name or category, and other geographic information. The Search Service can also [reverse geocode](https://en.wikipedia.org/wiki/Reverse_geocoding) addresses and cross streets based on a latitude/longitude. 

![Azure Maps Search.png](media/about-azure-maps/Introduction_Search.png)

4. The **Time Zone service** allows you to query current, historical, and future time zone information using either latitude-longitude pairs or an [IANA ID](http://www.iana.org/). The Time Zone service also allows for converting Microsoft Windows time zone IDs to IANA time zones, fetching a time zone offset to UTC and getting the current time in a respective time zone. A typical JSON response for a query to the Time Zone Service looks like the following sample:

```JSON
{
    "Version": "2017c",
    "ReferenceUtcTimestamp": "2017-11-20T23:09:48.686173Z",
    "TimeZones": [{
        "Id": "America/Los_Angeles",
        "ReferenceTime": {
            "Tag": "PST",
            "StandardOffset": "-08:00:00",
            "DaylightSavings": "00:00:00",
            "WallTime": "2017-11-20T15:09:48.686173-08:00",
            "PosixTzValidYear": 2017,
            "PosixTz": "PST+8PDT,M3.2.0,M11.1.0"
        }
    }]
}
```

5. The **Traffic service** is a suite of web services designed for developers to create web and mobile applications requiring traffic. The service provides two data types:
* Traffic flow - real-time observed speeds and travel times for all key roads in the network. 
* Traffic incidents - an accurate view about the traffic jams and incidents around the road network.

![Azure Maps Traffic](media/about-azure-maps/Introduction_Traffic.png)

6. 

Azure Maps is built for mobility and can power cross-platform applications since the programming model is agnostic and supports JSON output through REST APIs. Additionally, Azure Maps offers a convenient JavaScript map control with a simple programming model for quick and easy development of both web and mobile applications. 

Azure Maps uses a key-based authentication scheme, so accessing the services is a matter of navigating to the [Azure portal](http://portal.azure.com) and creating an Azure Maps account. Your account comes with two keys pre-generated for you. Start integrating these location capabilities directly into your applications by using either of your keys in the requests to the Azure Maps service.

## Unsupported regions
The Azure Maps API is currently unavailable in some countries. Check your current IP address and verify that your IP address' location is not in one of the unsupported countries below:

* Argentina
* China
* India
* Morocco
* Pakistan
* South Korea

## Next steps

You now have an overview of Azure Maps. The next step is to try out a sample app showcasing the service.

> [!div class="nextstepaction"]
> [Launch a demo interactive search map](quick-demo-map-app.md)
