---
title: Overview of Azure Maps | Microsoft Docs
description: An introduction to Azure Maps
author: walsehgal
ms.author: v-musehg
ms.date: 02/04/2019
ms.topic: overview
ms.service: azure-maps
services: azure-maps
manager: timlt
ms.custom: mvc
#Customer intent: As an Azure enterprise customer, I want to know what capabilities Azure Maps has so that I can leverage my Azure cloud with the Mapping service. 
---

# What is Azure Maps?

Azure Maps is a collection of geospatial services, unpinned by the freshest mapping data available providing accurate geographic context to your web and mobile applications. Azure Maps consists of REST APIs for rendering **Maps** in multiple styles and satellite imagery, **Searching** for addresses, places, and points of interest around the world; **Routing** point-to-point, multipoint, multipoint optimization, isochrone, commercial vehicle, traffic influenced, and matrix routing; viewing industry-leading Traffic flow and incidents; establishing user location through **Geolocation**; and converting location to **Time Zones**, as well as, fetching time at a location. Additionally, Azure Maps offers services for **Geofencing**, map **Data** storage - hosting location information in Azure; and **Spatial Operations** providing location intelligence through geospatial analytics. Azure Maps services are available directly as REST APIs or through either our robust **Web SDK** or **Android SDK**. These tools allow developers to quickly develop and scale solutions that integrate location information into Azure solutions from within the Azure cloud. Sign up for your free [Azure Maps account](https://azure.microsoft.com/services/azure-maps/) today and start developing!

The following video explains Azure Maps in depth:

<br/>

<iframe src="https://channel9.msdn.com/Shows/Internet-of-Things-Show/Azure-Maps/player?format=ny" width="960" height="540" allowFullScreen frameBorder="0"></iframe>

## Map Controls

### Web SDK

The Azure Maps Web SDK lets you customize interactive maps with your own content and imagery for display in your web or mobile applications. This control makes use of WebGL, allowing you to render large data sets with high performance. Develop with the SDK using JavaScript or TypeScript.

![Azure Maps Web SDK](media/about-azure-maps/Introduction_WebMapControl.png)

### Android SDK

The Azure Maps Android SDK lets you create powerful mobile mapping applications. 

![Azure Maps Android SDK](media/about-azure-maps/AndroidSDK.png)

## Services in Azure Maps

Azure Maps consists of the following six services that can provide geographic context to your Azure applications.

### Render service

The Render service is designed for developers to create web and mobile applications around mapping. The service uses either high-quality raster graphic images, available in 19 zoom levels, or fully customizable vector format map images.

![Azure Maps Map.png](media/about-azure-maps/Introduction_Map.png)

The Render service now offers preview APIs to allow developers to work with satellite imagery. For more details, read the [Azure Maps Render APIs](https://docs.microsoft.com/rest/api/maps/render).

### Route service

The Route service contains robust geometry calculations for real-world infrastructure and directions for multiple transportation modes. The service allows for developers to calculate directions across a number of travel modes such as car, truck, bicycle, or walking. The service can also consider inputs such as traffic conditions, weight restrictions, or hazardous material transport.

![Azure Maps Route.png](media/about-azure-maps/Introduction_Route.png)

The Route service now offers a preview of advanced features such as batch processing of multiple route requests, matrices of travel time and distance between a set of origins and destinations, and finding routes or distances you can travel based on your time or fuel requirements. For details on the routing capabilities, read the [Azure Maps Route APIs](https://docs.microsoft.com/rest/api/maps/route).

### Search service

The Search service is designed for developers to search for addresses, places, business listings by name or category, and other geographic information. The Search Service can also [reverse geocode](https://en.wikipedia.org/wiki/Reverse_geocoding) addresses and cross streets based on latitudes and longitudes.

![Azure Maps Search.png](media/about-azure-maps/Introduction_Search.png)

The Search service also provides advanced features such as search along a route, search inside a wider area, batch a group of search requests, as well as search for larger area instead of a location point. APIs for batch and area search are currently in preview. For more details on the search capabilities, read the [Azure Maps Search APIs](https://docs.microsoft.com/rest/api/maps/search) page.

### Time Zone service

The Time Zone service allows you to query current, historical, and future time zone information using either latitude-longitude pairs or an [IANA ID](https://www.iana.org/). The Time Zone service also allows for converting Microsoft Windows time zone IDs to IANA time zones, fetching a time zone offset to UTC and getting the current time in a respective time zone. A typical JSON response for a query to the Time Zone Service looks like the following sample:

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

For details on this service, visit the [Azure Maps Timezone APIs](https://docs.microsoft.com/rest/api/maps/timezone) page.

### Traffic service

The Traffic service is a suite of web services designed for developers to create web and mobile applications requiring traffic. The service provides two data types:

* Traffic flow - real-time observed speeds and travel times for all key roads in the network.
* Traffic incidents - an up-to-date view about the traffic jams and incidents around the road network.

![Azure Maps Traffic](media/about-azure-maps/Introduction_Traffic.png)

Visit the [Azure Maps Traffic APIs](https://docs.microsoft.com/rest/api/maps/traffic) page for more details.

### IP to Location

The IP to Location service allows you to preview the retrieved two letter country code for a given IP address. This service can help you to tailor and enhance the user experience by powering customized application content based on geographic location.

For information on the REST APIs for IP to Location service, visit the [Azure Maps Geolocation APIs](https://docs.microsoft.com/rest/api/maps/geolocation) page.

## Programming model

Azure Maps is built for mobility and can power cross-platform applications. It uses a programming model that is language agnostic and supports JSON output through [REST APIs](https://docs.microsoft.com/rest/api/maps/).

Additionally, Azure Maps offers a convenient [JavaScript map control](https://docs.microsoft.com/javascript/api/azure-maps-control) with a simple programming model for quick and easy development of both web and mobile applications.

## Usage

Accessing the Maps services is a matter of navigating to the [Azure portal](https://portal.azure.com) and creating an Azure Maps account.

Azure Maps uses a key-based authentication scheme. Your account comes with two keys pre-generated for you. Start integrating these location capabilities into your application by using either key and making a request to the Azure Maps service.

## Supported regions

The Azure Maps API is currently available in all countries except for the following regions:

* Argentina
* China
* India
* Morocco
* Pakistan
* South Korea

Verify that the location of your current IP address isn't in one of the unsupported countries above.

## Next steps

For more information on the new features of Azure Maps:

> [!div class="nextstepaction"]
> [Route Matrix, Isochrones, IP lookup, and more](https://azure.microsoft.com/blog/route-matrix-isochrones-ip-lookup-and-more-added-to-azure-maps/)

Try out a sample app showcasing the Azure Maps:

> [!div class="nextstepaction"]
> [Quickstart: Create a web app](quick-demo-map-app.md)
