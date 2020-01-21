---
title: Request time zone data
description: Learn how to request fresh time zone data using Azure Maps. You can also use the APIs to map between the IANA and the Windows time zone.
author: farah-alyasari
ms.author: v-faalya
ms.date: 01/16/2020
ms.topic: How-to-guides
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Request time zone data using Time Zone APIs in Azure Maps

This guide shows you how to use the Time Zone APIs in Azure Maps to request time zone data. Although time zone data changes frequently, the Time Zone APIs give you fresh data. You can also use the APIs to map between the IANA and the Windows time zone.

Let's learn, how to:

* Request Time Zone data by coordinates.

## Prerequisites

To make calls to any service in Azure Maps, you need a Maps account and a subscription key. You need to [Create an account](quick-demo-map-app.md#create-an-account-with-azure-maps) and [get your primary key](quick-demo-map-app.md#get-the-primary-key-for-your-account) to complete the next steps of this tutorial. For more details on authentication in Azure Maps, see [manage authentication in Azure Maps](./how-to-manage-authentication.md).

This article uses the [Postman app](https://www.getpostman.com/apps) to make REST calls, but you may choose any API development environment.

## Request Time Zone by coordinates

You can request time zone using longitude and latitude values.

1. Open the Postman app. Click **New**. Under **Create New**, select **Request** Give the **request** a name, and create a collection to store the requests. Select **New**. In the **Create New** window, select **Collection**. Name the collection and select the **Create** button.

2. Select the GET HTTP method on the builder tab and enter the following request.

```HTTP
https://atlas.microsoft.com/timezone/byCoordinates/json?subscription-key=<subscription-key>&api-version=1&query=32.533333333333331,-117.0166666666666667&timeStamp=2010-01-01T00:00:00Z
```

Replace "<subscription-key>" with your primary key for Azure Maps. Append the desired latitude and longitude after "query". The "timeStamp" parameter allows you to request timezone data at a particular time in history, for example you can request data from the year 1930. If you want the data for the present time, then remove the "timeStamp" parameter.

3. After a successful request, you will receive the following response.

```JSON
{
    "Version": "2019c",
    "ReferenceUtcTimestamp": "2010-01-01T00:00:00Z",
    "TimeZones": [
        {
            "Id": "America/Tijuana",
            "Names": {
                "ISO6391LanguageCode": "en",
                "Generic": "Pacific Time",
                "Standard": "Pacific Standard Time",
                "Daylight": "Pacific Daylight Time"
            },
            "ReferenceTime": {
                "Tag": "PST",
                "StandardOffset": "-08:00:00",
                "DaylightSavings": "00:00:00",
                "WallTime": "2009-12-31T16:00:00-08:00",
                "PosixTzValidYear": 2010,
                "PosixTz": "PST+8PDT,M3.2.0,M11.1.0",
                "Sunrise": "2009-12-31T06:49:41.896-08:00",
                "Sunset": "2009-12-31T16:52:25.764-08:00"
            }
        }
    ]
}
```
The "WallTime" parameter is the real-world time at that location. The response contains parameters which you may find helpful in developing application in need of geographical data, for example a scheduling app.

## Request Time Zone by IANA Id

The Internet Assigned Numbers Authority (IANA) publishes Time Zone data representing local time zone for many locations around the globe. This data is updated periodically.  Use the following GET request to obtain the most recent IANA TimeZone data using Azure Maps. 

```HTTP
https://atlas.microsoft.com/timezone/enumIana/json?subscription-key=<subscription-key>&api-version=1.0
```
The response contains the entire list of IANA country Ids, updated within 24 hours. Copy the id for the country of your interest. For example, 