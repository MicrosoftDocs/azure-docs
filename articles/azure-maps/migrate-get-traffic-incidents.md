---
title: Migrate Bing Maps Get Traffic Incidents API to Azure Maps Get Traffic Incident Detail API
titleSuffix: Microsoft Azure Maps
description: Learn how to Migrate the Bing Maps Get Traffic Incidents API to the Azure Maps Get Traffic Incident Detail API.
author: FarazGIS
ms.author: eriklind
ms.date: 04/15/2024
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
---


# Migrate Bing Maps Get Traffic Incidents API

This article explains how to migrate the Bing Maps [Get Traffic Incidents] API to the Azure Maps [Get Traffic Incident Detail] API. The Azure Maps Get Traffic Incident Detail API provides data on construction, road closures, accidents, and other incidents that can affect traffic, and is updated every minute.

## Prerequisites

- An [Azure Account]
- An [Azure Maps account]
- A [subscription key] or other form of [Authentication with Azure Maps]

## Notable differences

- Azure Maps Get Traffic Incident Detail API is designed to display traffic incidents on map tiles.
- Azure Maps requires `boundingZoom` to be specified in addition to `boundingbox`. `boundingZoom` is the zoom level (0 - 22) for raster and vector tiles.
- Azure Maps requires `style` to be specified. The style that is used to render the tile in Azure Maps [Traffic Incident Tile] API. This affects the coordinates of traffic incidents in the reply.
- Azure Maps requires a number referencing traffic model (`trafficModelId`), obtained from the Azure Maps [Get Traffic Incident Viewport] API. It updates every minute and is valid for two minutes before it times out. If the wrong Traffic Model ID is specified, the interface returns the correct value. As an alternative to using the Azure Maps Get Traffic Incident Viewport API, passing a value of `-1` for Traffic Model ID in the Azure Maps [Traffic Incident Tile] request always invokes the most recent traffic model.
- Bing Maps Get Traffic Incidents API supports specifying traffic incident severity and types in the request. The Azure Maps Get Traffic Incident Detail API instead returns all traffic incident severity and types by default in the response.
- Azure Maps Get Traffic Incident Detail API generally provides more details regarding traffic delays than the Bing Maps Get Traffic Incidents API. Specifically, in Azure Maps, the `dl` output provides delay time in seconds that the traffic incident caused, and the [DelayMagnitude] output provides the magnitude of delay associated with incident (these values correspond to incident colors in the traffic tiles).
- Unlike Bing Maps for Enterprise, Azure Maps is a global service that supports specifying a geographic scope, which allows you to limit data residency to the European (EU) or United States (US) geographic areas (geos). All requests (including input data) are processed exclusively in the specified geographic area. For more information, see [Azure Maps service geographic scope].

## Security and authentication

Bing Maps for Enterprise only supports API key authentication. Azure Maps supports multiple ways to authenticate your API calls, such as a [subscription key](azure-maps-authentication.md#shared-key-authentication), [Microsoft Entra ID], or [Shared Access Signature (SAS) Token]. For more information on security and authentication in Azure Maps, See [Authentication with Azure Maps] and the [Security section] in the Azure Maps Get Traffic Incident Detail documentation.

## Request parameters

The following table lists the Bing Maps _Get Traffic Incidents_ request parameters and the Azure Maps equivalent:

| Bing Maps request parameter  | Bing Maps request parameter alias  | Azure Maps request parameter | Required in Azure Maps  | Azure Maps data type  | Description|
|------------------------------|------------------------------------|------------------------------|-------------------------|-----------------------|------------|
| mapArea  |   | boundingbox  | True  | number[]  | The projection used to specify the `boundingbox` coordinates in the request and response is EPSG900913 (default) or EPSG4326. Use projection=EPSG4326 for compatibility with the coordinates projection used in the Bing Maps Get Traffic Incidents API.  |
| culture  | `c`  | language  | False  | string  | ISO 639-1 code for the output language. For more information, see [Azure Maps Supported Languages].|
| includeJamcidents  |  |  Not supported |  Not supported |  Not supported | Azure Maps returns abnormal traffic conditions by default. |
| severity  | `s`  |  Not supported |  Not supported |  Not supported | Azure Maps returns traffic incidents of all levels of severity by default. |
| type  | `t`  |  Not supported |  Not supported |  Not supported | Azure Maps returns traffic incidents of all types by default. |

For more information about the Azure Maps request parameters, see [URI Parameters] in the Azure Maps Get Traffic Incident Detail API documentation.

### Request examples

Bing Maps _Get Traffic Incidents_ API request:

``` http
http://dev.virtualearth.net/REST/v1/Traffic/Incidents/37.8203,-122.2763,37.8321,-122.2542?key={Your-Bing-Maps-Key}
```

Azure Maps _Get Traffic Incident Detail_ API request:

``` http
http://atlas.microsoft.com/traffic/incident/detail/json?api-version=1.0&style=s3&boundingbox=37.8203,-122.2763,37.8321,-122.2542&boundingZoom=11&projection=EPSG4326&trafficmodelid=-1&subscription-key={Your-Azure-Maps-Subscription-key} 
```

## Response fields

The following table lists the fields that can appear in the HTTP response when running the Bing Maps _Get Traffic Incidents_ API and the Azure Maps equivalent:

| Bing Maps response field | Azure Maps response field | Description |
|--------------------------|---------------------------|-------------|
| Description (Json)<br>Description (XML)  | `d`  | This output is in the [tm] response element of Azure Maps.  |
| End (Json)<br>EndTimeUTC (XML)  | `ed`  | This output is in the [tm] response element of Azure Maps. The date is described in the ISO8601 format and includes time in UTC.  |
| eventList (Json)<br>EventList (XML)  | Not supported | |
| icon (Json)<br>Icon (XML)  | `ic`  | This output is in the [tm] response element of Azure Maps. See [IconCategory] (`ic`) for more info.  |
| incidentId (Json)<br>IncidentId (XML)  | `id` | This output is in the [tm] response element of Azure Maps.  |
| isEndTimeBackfilled (Json)<br>IsEndTimeBackfilled (XML)  | Not supported | |
| isJamcident (Json)<br>IsJamcident (XML)  | Not supported |
| lastModified (Json)<br>LastModifiedUTC (XML)  | Not supported | |
| point (Json)<br>Point (XML)  | `p`  | This output is in the [tm] response element of Azure Maps. See [point] (`p`) for more info.  |
| roadClosed (Json)<br>RoadClosed (XML)  | See description | The [IconCategory] output of the [tm] response element of Azure Maps can be used to indicate a road closure.   |
| severity (Json)<br>Severity (XML)  | `ty`  | This output is in the [tm] response element. See [DelayMagnitude]:  (`ty`) for more info.  |
| severityScore (Json)<br>SeverityScore (XML)              | Not supported | |
| Start (Json)<br>StartTimeUTC (XML)  | `sd`  | This output is in the [tm] response element of Azure Maps. The date is described in the ISO8601 format and includes time in UTC.  |
| title (Json)<br>Title (XML)  | See description | The `f` output in the [tm] response element of Azure Maps provides the name of the intersection or location where the traffic caused by the the incident starts and can serve as an alternative to the Bing Maps `title` output.  |
| toPoint (Json)<br>ToPoint (XML)  | See description | The `t` output in the [tm] response element of Azure Maps provides the name of the intersection or location where the traffic due to the incident ends and can serve as an alternative to the Bing Maps `toPoint` output.  |
| type (Json)<br>Type (XML)  | `c`  | The `c` output in the [tm] response element of Azure Maps provides the cause of the incident, if available.  |

For more information about the Azure Maps Get Traffic Incident Detail API response fields, see [Responses].

## Response examples

The following JSON sample shows what is returned in the body of the HTTP response when executing the Bing Maps _Get Traffic Incidents_ request:

```JSON
{
    "authenticationResultCode": "ValidCredentials",
    "brandLogoUri": "https://dev.virtualearth.net/Branding/logo_powered_by.png",
    "copyright": "Copyright © 2024 Microsoft and its suppliers. All rights reserved. This API cannot be accessed and the content and any results may not be used, reproduced or transmitted in any manner without express written permission from Microsoft Corporation.",
    "resourceSets": [
        { 
            "estimatedTotal: 1,
            "resources": [
                {
                    "__type": "TrafficIncident:http://schemas.microsoft.com/search/local/ws/rest/v1",
                    "point": {
                        "type": "Point",
                        "coordinates": [
                            37.824025,
                            -122.265829
                        ]
                    },
                    "alertCCodes": [
                        10
                    ],
                    "delay": 0,
                    "description": "Flooding on Telegraph Ave from I-580/W MacArthur Blvd to W MacArthur Blvd.",
                    "end": "/Date(1711764788159)/",
                    "eventList": [
                        907
                    ],
                    "icon": 0,
                    "incidentId": 14648704852012000,
                    "isEndTimeBackfilled": true,
                    "isJamcident": false,
                    "lastModified": "/Date(1711757588159)/",
                    "roadClosed": false,
                    "severity": 4,
                    "severityScore": 79,
                    "source": 5,
                    "start": "/Date(1711749960000)/",
                    "title": "Telegraph Ave",
                    "toPoint": {
                        "type": "Point",
                        "coordinates": [
                            37.824601,
                            -122.265675
                        ]
                    },
                    "type": 5,
                    "verified": true
                }
            ]
        }
    ],
    "statusCode": 200,
    "statusDescription": "OK",
    "traceId": "35657cf08e01f49cd50543aa7d88c139|MWH0032BF3|0.0.0.0"
}
```

The following JSON sample shows what is returned in the body of the HTTP response when executing an Azure Maps _Get Traffic Incident Detail_ request:

```json
{
    "tm": {
        "@id": "1711765520",
        "poi": [
            {
                "id": "0043f39aed6a43411b869729bc30cba4",
                "p": {
                    "x": -122.2631419,
                    "y": 37.8235763
                },
                "ic": 11,
                "ty": 0,
                "cs": 0,
                "d": "Flooding",
                "sd": "2024-03-29T22:06:00Z",
                "f": "I-580/W MacArthur Blvd (Telegraph Ave)",
                "t": "W MacArthur Blvd (Telegraph Ave)",
                "l": 66
            }
        ]
    }
}
```

## Transactions usage

Like Bing Maps Get Traffic Incidents API, Azure Maps Get Traffic Incident Detail API logs one billable transaction per request. For more information on Azure Maps transactions, see [Understanding Azure Maps Transactions].

## Additional information

Other Azure Maps Traffic APIs

- [Get Traffic Flow Segment]. Use to get information about the speeds and travel times of the specified section of road.
- [Get Traffic Flow Tile]. Use to get 256 x 256 pixel tiles showing traffic flow.
- [Get Traffic Incident Tile]. Use to get 256 x 256 pixel tiles showing traffic incidents.
- [Get Traffic Incident Viewport]. Use to get legal and technical information for a viewport.

Support

- [Microsoft Q&A Forum]

[Authentication with Azure Maps]: azure-maps-authentication.md
[Azure Account]: https://azure.microsoft.com/
[Azure Maps account]: quick-demo-map-app.md#create-an-azure-maps-account
[Azure Maps service geographic scope]: geographic-scope.md
[Azure Maps Supported Languages]: /azure/azure-maps/supported-languages#azure-maps-supported-languages
[DelayMagnitude]: /rest/api/maps/traffic/get-traffic-incident-detail#delaymagnitude
[Get Traffic Flow Segment]: /rest/api/maps/traffic/get-traffic-flow-segment
[Get Traffic Flow Tile]: /rest/api/maps/traffic/get-traffic-flow-tile
[Get Traffic Incident Detail]: /rest/api/maps/traffic/get-traffic-incident-detail
[Get Traffic Incident Tile]: /rest/api/maps/traffic/get-traffic-incident-tile
[Get Traffic Incident Viewport]: /rest/api/maps/traffic/get-traffic-incident-viewport
[Get Traffic Incidents]: /bingmaps/rest-services/traffic/get-traffic-incidents
[IconCategory]: /rest/api/maps/traffic/get-traffic-incident-detail#iconcategory
[Microsoft Entra ID]: azure-maps-authentication.md#microsoft-entra-authentication
[Microsoft Q&A Forum]: /answers/tags/209/azure-maps/tags/209/azure-maps
[point]: /rest/api/maps/traffic/get-traffic-incident-detail#point
[Responses]: /rest/api/maps/traffic/get-traffic-incident-detail#response
[Security section]: /rest/api/maps/traffic/get-traffic-incident-viewport#security
[Shared Access Signature (SAS) Token]: azure-maps-authentication.md#shared-access-signature-token-authentication
[subscription key]: quick-demo-map-app.md#get-the-subscription-key-for-your-account
[tm]: /rest/api/maps/traffic/get-traffic-incident-detail#tm
[Traffic Incident Tile]:/rest/api/maps/traffic/gettrafficincidenttile
[Understanding Azure Maps Transactions]: understanding-azure-maps-transactions.md
[URI Parameters]: /rest/api/maps/traffic/get-traffic-incident-detail#uri-parameters
