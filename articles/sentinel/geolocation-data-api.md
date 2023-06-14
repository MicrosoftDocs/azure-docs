---
title: Enrich entities with geolocation data in Microsoft Sentinel using REST API
description: This article describes how you can enrich entities in Microsoft Sentinel with geolocation data via REST API.
author: yelevin
ms.topic: reference
ms.date: 01/09/2023
ms.author: yelevin
---

# Enrich entities in Microsoft Sentinel with geolocation data via REST API (Public preview)

This article shows you how to enrich entities in Microsoft Sentinel with geolocation data using the REST API.

> [!IMPORTANT]
> This feature is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Common URI parameters

The following are the common URI parameters for the geolocation API:




| Name | In | Required | Type | Description |
|-|-|-|-|-|
| **{subscriptionId}** | path | yes | GUID | The Azure subscription ID |
| **{resourceGroupName}** | path | yes | string | The name of the resource group within the subscription |
| **{api-version}** | query | yes | string | The version of the protocol used to make this request. As of April 30 2021, the geolocation API version is *2019-01-01-preview*.|
| **{ipAddress}** | query | yes | string | The IP Address for which geolocation information is needed, in an IPv4 or IPv6 format.   |
|

## Enrich IP Address with geolocation information

This command retrieves geolocation data for a given IP Address.

### Request URI

| Method | Request URI |
|-|-|
| **GET** | `https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.SecurityInsights/enrichment/ip/geodata/?ipaddress={ipAddress}&api-version={api-version}` |
|

### Responses

|Status code  |Description  |
|---------|---------|
|**200**     |   Success      |
|**400**     |      IP address not provided or is in invalid format    |
|**404**     | Geolocation data not found for this IP address         |
|**429**     |      Too many requests, try again in the specified timeframe    |


### Fields returned in the response

|Field name  |Description  |
|---------|---------|
|**ASN**     |  The autonomous system number associated with this IP address       |
|**carrier**     |  The name of the carrier for this IP address       |
|**city**     |   The city where this IP address is located      |
|**cityCf**     | A numeric rating of confidence that the value in the 'city' field is correct, on a scale of 0-100        |
|**continent**     | The continent where this IP address is located        |
|**country**     |The county where this IP address is located        |
|**countryCf**     |   A numeric rating of confidence that the value in the 'country' field is correct on a scale of 0-100      |
|**ipAddr**     |   The dotted-decimal or colon-separated string representation of the IP address      |
|**ipRoutingType**     |   A description of the connection type for this IP address      |
|**latitude**     |     The latitude of this IP address    |
|**longitude**     |  The longitude of this IP address       |
|**organization**     |  The name of the organization for this IP address       |
|**organizationType**     | The type of the organization for this IP address        |
|**region**     |    The geographic region where this IP address is located     |
|**state**     |  The state where this IP address is located       |
|**stateCf**     | A numeric rating of confidence that the value in the 'state' field is correct on a scale of 0-100        |
|**stateCode**     |   The abbreviated name for the state where this IP address is located      |



## Throttling limits for the API

This API has a limit of 100 calls, per user, per hour.

### Sample response

```rest
"body":
{
    "asn": "12345",
    "carrier": "Microsoft",
    "city": "Redmond",
    "cityCf": 90,
    "continent": "north america",
    "country": "united states",
    "countryCf": 99
    "ipAddr": "1.2.3.4",
    "ipRoutingType": "fixed",
    "latitude": "40.2436",
    "longitude": "-100.8891",
    "organization": "Microsoft",
    "organizationType": "tech",
    "region": "western usa",
    "state": "washington",
    "stateCf": null
    "stateCode": "wa"
}
```

## Next steps

To learn more about Microsoft Sentinel, see the following articles:

- Learn more about entities:

    - [Microsoft Sentinel entity types reference](entities-reference.md)
    - [Classify and analyze data using entities in Microsoft Sentinel](entities.md)
    - [Map data fields to entities in Microsoft Sentinel](map-data-fields-to-entities.md)

- Explore other uses of the [Microsoft Sentinel API](/rest/api/securityinsights/)
