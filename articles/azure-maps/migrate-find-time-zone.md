---
title: Migrate Bing Maps Find Time Zone API to Azure Maps Get Timezone By Coordinates API
titleSuffix: Microsoft Azure Maps
description: Learn how to Migrate the Bing Maps Find Time Zone API to the Azure Maps Get Time Zone By Coordinates API.
author: eriklindeman
ms.author: eriklind
ms.date: 04/15/2024
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---


# Migrate Bing Maps Find Time Zone API

This article explains how to migrate from the Bing Maps [Find Time Zone] API to the Azure Maps [Get Timezone By Coordinates] API. The Azure Maps Get Timezone By Coordinates API returns current, historical, and future time zone information for a specified latitude-longitude pair, as well as sunset and sunrise times for a given location.

## Prerequisites

- An [Azure Account]
- An [Azure Maps account]
- A [subscription key] or other form of [Authentication with Azure Maps]

## Notable differences

- Bing Maps Find Time Zone API supports coordinates and location place name, administrative region, and country/region name as location input. Azure Maps Get Timezone By Coordinates API only supports coordinates. To get the coordinates for location place name, administrative region, and country/region name, you can use the Azure Maps [Get Geocoding] API.
- Bing Maps Find Time Zone API  supports both XML and JSON response formats, Azure Maps Get Timezone By Coordinates API only supports JSON.
- Bing Maps Find Time Zone API doesn't offer sunrise and sunset values for a given time zone, the Azure Maps Get Time Zone By Coordinates API does.
- Unlike Bing Maps for Enterprise, Azure Maps is a global service that supports specifying a geographic scope, which allows you to limit data residency to the European (EU) or United States (US) geographic areas (geos). All requests (including input data) are processed exclusively in the specified geographic area. For more information, see [Azure Maps service geographic scope].

## Security and authentication

Bing Maps for Enterprise only supports API key authentication. Azure Maps supports multiple ways to authenticate your API calls, such as a [subscription key](azure-maps-authentication.md#shared-key-authentication), [Microsoft Entra ID], or [Shared Access Signature (SAS) Token]. For more information on security and authentication in Azure Maps, See [Authentication with Azure Maps] and the [Security section] in the Azure Maps Get Time Zone By Coordinates documentation.

## Request parameters

The following table lists the Bing Maps *Find Time Zone* request parameters and the Azure Maps equivalent:

| Bing Maps Parameter | Bing Maps Parameter Alias | Azure Maps Parameter | Required in Azure Maps  | Azure Maps data type  | Description  |
|---------------------|---------------------------|----------------------|-------------------------|-----------------------|--------------|
| dateTime  | dt | timeStamp | False | string date-time | Alternatively, use alias "stamp", or "s". Reference time, if omitted, the API uses the machine time serving the request. |
| IncludeDstRules  | None  | transitionsFrom | False | string date-time | The start date from which daylight savings time (DST) transitions are requested, only applies when "options" = all or "options" = transitions. See options (Timezone Options) parameter for more info.  |
| output  | o | format | True | JSONFormat | Only JSON format is supported in this Azure Maps API.|
| point | None  | query  | True | number | Coordinates of the point for which time zone information is requested. This parameter is a list of coordinates, containing a pair of coordinate values (lat, long). When this endpoint is called directly, coordinates are passed in as a single string containing coordinates, separated by commas. |
| query | q | Not supported | Not supported| Not supported | Only coordinates of the point for which time zone information is requested are supported. Location types such as address, locality, postal code, etc. aren't supported. To get the coordinates for location place name, administrative region, and country/region name, you can use the Azure Maps Get Geocoding API. |


For more information, see the Azure Maps Get Timezone By Coordinates [URI Parameters].

## Request examples

Bing Maps *Find Time Zone* API request:

```HTTP
https://dev.virtualearth.net/REST/v1/timezone/37.7800,-122.4201?key=%7bBingMapsKey%7d
```

Azure Maps *Get Time Zone by Coordinates* API request:

```HTTP
https://atlas.microsoft.com/timezone/byCoordinates/json?api-version=1.0&query=37.7800,-122.4201&subscription-key={Your-Azure-Maps-Subscription-key}
```

## Response fields

The following table lists the fields that can appear in the HTTP response when running the Bing Maps Find Time Zone API and the Azure Maps equivalent:

| Bing Maps response field                       | Azure Maps response field           |
|------------------------------------------------|-------------------------------------|
| abbreviation (JSON) <br> Abbreviation (XML)    | ReferenceTime (Tag)                 |
| convertedTime (JSON) <br>ConvertedTime (XML)   |ReferenceTime (WallTime)             |
| dstRule (JSON)<br> DSTRule (XML)               | TimeTransitions                     |
| genericName (JSON)<br> GenericName (XML)       | TimezoneNames                       |
| ianaTimeZoneId (JSON)<br> IANATimeZoneID (XML) | ID                                  |
| utcOffset (JSON)<br> UTCOffset (XML)           | ReferenceTime (StandardOffset)      |
| windowsTimeZoneID (JSON)<br> WindowsTimeZoneID (XML)| Not supported. Use Azure Maps Get Timezone Enum Windows API to convert to Windows time zone.|

For more information about the Azure Maps Get Timezone By Coordinates response fields, see the response [Definitions].

### Response examples

The following JSON shows a sample of what is returned in the body of the HTTP response when executing the Bing Maps *Find Time Zone* API request:

```JSON
{
    "authenticationResultCode": "ValidCredentials",
    "brandLogoUri": "https://dev.virtualearth.net/Branding/logo_powered_by.png",
    "copyright": "Copyright © 2024 Microsoft and its suppliers. All rights reserved. This API cannot be accessed and the content and any results may not be used, reproduced or transmitted in any manner without express written permission from Microsoft Corporation.",
    "resourceSets": [
        {
            "estimatedTotal": 1,
            "resources": [
                {
                    "__type": "RESTTimeZone:http://schemas.microsoft.com/search/local/ws/rest/v1",
                    "timeZone": {
                        "genericName": "Pacific Standard Time",
                        "abbreviation": "PST",
                        "ianaTimeZoneId": "America/Los_Angeles",
                        "windowsTimeZoneId": "Pacific Standard Time",
                        "utcOffset": "-8:00",
                        "convertedTime": {
                            "localTime": "2024-02-11T14:21:58",
                            "utcOffsetWithDst": "-8:00",
                            "timeZoneDisplayName": "Pacific Standard Time",
                            "timeZoneDisplayAbbr": "PST"
                        }
                    }
                }
            ]
        }
    ],
    "statusCode": 200,
    "statusDescription": "OK",
    "traceId": "f02637665942c8cb21c8414bd03224aa|MWH0032BEF|0.0.0.1"
}
```

The following sample shows what is returned in the body of the HTTP response when executing an Azure Maps *Get Time Zone By Coordinates* API request:

```json
{
    "Version": "2023d",
    "ReferenceUtcTimestamp": "2024-02-11T22:32:29.4282815Z",
    "TimeZones": [
        {
            "Id": "America/Los_Angeles",
            "Aliases": [
                "US/Pacific"
            ],
            "Countries": [
                {
                    "Name": "United States",
                    "Code": "US"
                }
            ],
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
                "WallTime": "2024-02-11T14:32:29.4282815-08:00",
                "PosixTzValidYear": 2024,
                "PosixTz": "PST+8PDT,M3.2.0,M11.1.0",
                "Sunrise": "2024-02-11T07:04:33.6950704-08:00",
                "Sunset": "2024-02-11T17:43:15.3679015-08:00"
            },
            "RepresentativePoint": {
                "Latitude": 34.05222222222222,
                "Longitude": -118.24277777777777
            },
            "TimeTransitions": [
                {
                    "Tag": "PST",
                    "StandardOffset": "-08:00:00",
                    "DaylightSavings": "00:00:00",
                    "UtcStart": "2023-11-05T09:00:00Z",
                    "UtcEnd": "2024-03-10T10:00:00Z"
                },
                {
                    "Tag": "PDT",
                    "StandardOffset": "-08:00:00",
                    "DaylightSavings": "01:00:00",
                    "UtcStart": "2024-03-10T10:00:00Z",
                    "UtcEnd": "2024-11-03T09:00:00Z"
                },
                {
                    "Tag": "PST",
                    "StandardOffset": "-08:00:00",
                    "DaylightSavings": "00:00:00",
                    "UtcStart": "2024-11-03T09:00:00Z",
                    "UtcEnd": "2025-03-09T10:00:00Z"
                }
            ]
        }
    ]
}
```

## Transactions usage

Similar to Bing Maps for Enterprise Find Time Zone API, the Azure Maps Get Timezone By Coordinates API logs one billable transaction per API request. For more information on Azure Maps transactions, see [Understanding Azure Maps Transactions].

## Additional information

More Azure Maps Timezone APIs

- [Get Timezone By ID]
- [Get Timezone Enum IANA]
- [Get Timezone Enum Windows]
- [Get Timezone IANA Version]
- [Get Timezone Windows To IANA]

Support

- [Microsoft Q&A Forum]

[Authentication with Azure Maps]: azure-maps-authentication.md
[Authentication with Azure Maps]: azure-maps-authentication.md
[Azure Account]: https://azure.microsoft.com/
[Azure Maps account]: quick-demo-map-app.md#create-an-azure-maps-account
[Azure Maps service geographic scope]: geographic-scope.md
[Definitions]: /rest/api/maps/timezone/get-timezone-by-coordinates#definitions
[Find Time Zone]: /bingmaps/rest-services/timezone/find-time-zone
[Get Geocoding]: /rest/api/maps/search
[Get Timezone By Coordinates]: /rest/api/maps/timezone/get-timezone-by-coordinates
[Get Timezone By ID]: /rest/api/maps/timezone/get-timezone-by-id
[Get Timezone Enum IANA]: /rest/api/maps/timezone/get-timezone-enum-iana
[Get Timezone Enum Windows]: /rest/api/maps/timezone/get-timezone-enum-windows
[Get Timezone IANA Version]: /rest/api/maps/timezone/get-timezone-iana-version
[Get Timezone Windows To IANA]: /rest/api/maps/timezone/get-timezone-windows-to-iana
[Microsoft Entra ID]: azure-maps-authentication.md#microsoft-entra-authentication
[Microsoft Q&A Forum]: /answers/tags/209/azure-maps
[Security section]: /rest/api/maps/timezone/get-timezone-by-coordinates#security
[Shared Access Signature (SAS) Token]: azure-maps-authentication.md#shared-access-signature-token-authentication
[subscription key]: quick-demo-map-app.md#get-the-subscription-key-for-your-account
[Understanding Azure Maps Transactions]: understanding-azure-maps-transactions.md
[URI Parameters]: /rest/api/maps/timezone/get-timezone-by-coordinates#uri-parameters
