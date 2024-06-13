---
title: Azure Content Delivery Network from Edgio Premium rules engine match conditions
description: Reference documentation for Azure Content Delivery Network from Edgio Premium rules engine match conditions.
services: cdn
author: duongau
manager: kumudd
ms.service: azure-cdn
ms.topic: article
ms.date: 03/20/2024
ms.author: duau
---

# Azure Content Delivery Network from Edgio Premium rules engine match conditions

This article lists detailed descriptions of the available match conditions for the Azure content delivery network from Edgio Premium [rules engine](cdn-verizon-premium-rules-engine.md).

The second part of a rule is the match condition. A match condition identifies specific types of requests for which a set of features is performed.

For example, you can use a match condition to:

- Filter requests for content at a particular location.
- Filter requests generated from a particular IP address or country/region.
- Filter requests by header information.

## <a name="top"></a>Match Conditions

- [Always](#always)
- [Device](#device)
- [Location](#location)
- [Origin](#origin)
- [Request](#request)
- [URL](#url)

### <a name="always"></a>Always

The [Always match condition](https://docs.vdms.com/cdn/Content/HRE/M/Always.htm) is designed to apply a default set of features to all requests.

### <a name="device"></a>Device

These match conditions are designed to identify requests based on the client's user agent.

| Name       | Purpose                                                           |
|------------|-------------------------------------------------------------------|
| Brand Name | Identifies requests by whether the device's brand name matches a: <br> **-** Specific value ([Brand Name Literal](https://docs.vdms.com/cdn/Content/HRE/M/D-Brand-Name-Literal.htm)) <br> **-** Regular expression ([Brand Name Regex](https://docs.vdms.com/cdn/Content/HRE/M/D-Brand-Name-Regex.htm)) <br> **-** Specific pattern ([Brand Name Wildcard](https://docs.vdms.com/cdn/Content/HRE/M/D-Brand-Name-Wildcard.htm)) |
| Device OS | Identifies requests by whether the device's OS matches a: <br> **-** Specific value ([Device OS Literal](https://docs.vdms.com/cdn/Content/HRE/M/D-Device-OS-Literal.htm)) <br> **-** Regular expression ([Device OS Regex](https://docs.vdms.com/cdn/Content/HRE/M/D-Device-OS-Regex.htm)) <br> **-** Specific pattern ([Device OS Wildcard](https://docs.vdms.com/cdn/Content/HRE/M/D-Device-OS-Wildcard.htm)) |
| Device OS Version | Identifies requests by whether the device's OS version matches a: <br> **-** Specific value ([Device OS Version Literal](https://docs.vdms.com/cdn/Content/HRE/M/D-Device-OS-Version-Literal.htm)) <br> **-** Regular expression ([Device OS Version Regex](https://docs.vdms.com/cdn/Content/HRE/M/D-Device-OS-Version-Regex.htm)) <br> **-** Specific pattern ([Device OS Version Wildcard](https://docs.vdms.com/cdn/Content/HRE/M/D-Device-OS-Version-Wildcard.htm)) |
| [Dual Orientation?](https://docs.vdms.com/cdn/Content/HRE/M/D-Dual-Orientation.htm) | Identifies requests by whether the device supports dual orientation. |
| HTML Preferred DTD | Identifies requests by whether the device's HTML preferred DTD matches a: <br> **-** Specific value ([HTML Preferred DTD Literal](https://docs.vdms.com/cdn/Content/HRE/M/D-HTML-Preferred-DTD-Literal.htm)) <br> **-** Regular expression ([HTML Preferred DTD Regex](https://docs.vdms.com/cdn/Content/HRE/M/D-HTML-Preferred-DTD-Regex.htm)) <br> **-** Specific pattern ([HTML Preferred DTD Wildcard](https://docs.vdms.com/cdn/Content/HRE/M/D-HTML-Preferred-DTD-Wildcard.htm)) |
| [Image Inlining?](https://docs.vdms.com/cdn/Content/HRE/M/D-Image-Inlining.htm) | Identifies requests by whether the device supports Base64 encoded images. |
| [Is Android?](https://docs.vdms.com/cdn/Content/HRE/M/D-Is-Android.htm) | Identifies requests by whether the device uses the Android OS. |
| [Is App?](https://docs.vdms.com/cdn/Content/HRE/M/D-Is-App.htm) | Identifies requests by whether a native application requested content. |
| [Is Full Desktop?](https://docs.vdms.com/cdn/Content/HRE/M/D-Is-Full-Desktop.htm) | Identifies requests by whether the device provides a full desktop experience. |
| [Is iOS?](https://docs.vdms.com/cdn/Content/HRE/M/D-Is-iOS.htm) | Identifies requests by whether the device uses iOS. |
| [Is Robot?](https://docs.vdms.com/cdn/Content/HRE/M/D-Is-Robot.htm) | Identifies requests by whether the device is considered to be an automated HTTP client (for example, a robot crawler). |
| [Is Smart TV?](https://docs.vdms.com/cdn/Content/HRE/M/D-Is-Smart-TV.htm) | Identifies requests by whether the device is a smart TV. |
| [Is Smartphone?](https://docs.vdms.com/cdn/Content/HRE/M/D-Is-Smartphone.htm) | Identifies requests by whether the device is a smartphone.
| [Is Tablet?](https://docs.vdms.com/cdn/Content/HRE/M/D-Is-Tablet.htm) | Identifies requests by whether the device is a tablet. |
| [Is Touchscreen?](https://docs.vdms.com/cdn/Content/HRE/M/D-Is-Touchscreen.htm) | Identifies requests by whether the device's primary pointing device is a touchscreen. |
| [Is Windows Phone?](https://docs.vdms.com/cdn/Content/HRE/M/D-Is-Windows-Phone.htm) | Identifies requests by whether the device is a Windows Mobile 6.5/ Windows Phone 7 or higher. |
| [Is Wireless Device?](https://docs.vdms.com/cdn/Content/HRE/M/D-Is-Wireless-Device.htm) | Identifies requests by whether the device is wireless.
| Marketing Name | Identifies requests by whether the device's marketing name matches a: <br> **-** Specific value ([Marketing Name Literal](https://docs.vdms.com/cdn/Content/HRE/M/D-Marketing-Name-Literal.htm)) <br> **-** Regular expression ([Marketing Name Regex](https://docs.vdms.com/cdn/Content/HRE/M/D-Marketing-Name-Regex.htm)) <br> **-** Specific pattern ([Marketing Name Wildcard](https://docs.vdms.com/cdn/Content/HRE/M/D-Marketing-Name-Wildcard.htm)) |
| Mobile Browser | Identifies requests by whether the device's browser matches a: <br> **-** Specific value ([Mobile Browser Literal](https://docs.vdms.com/cdn/Content/HRE/M/D-Mobile-Browser-Literal.htm)) <br> **-** Regular expression ([Mobile Browser Regex](https://docs.vdms.com/cdn/Content/HRE/M/D-Mobile-Browser-Regex.htm)) <br> **-** Specific pattern ([Mobile Browser Wildcard](https://docs.vdms.com/cdn/Content/HRE/M/D-Mobile-Browser-Wildcard.htm)) |
| Mobile Browser Version | Identifies requests by whether the device's browser version matches a: <br> **-** Specific value ([Mobile Browser Version Literal](https://docs.vdms.com/cdn/Content/HRE/M/D-Mobile-Browser-Version-Literal.htm)) <br> **-** Regular expression ([Mobile Browser Version Regex](https://docs.vdms.com/cdn/Content/HRE/M/D-Mobile-Browser-Version-Regex.htm)) <br> **-** Specific pattern ([Mobile Browser Version Wildcard](https://docs.vdms.com/cdn/Content/HRE/M/D-Mobile-Browser-Version-Wildcard.htm)) |
| Model Name | Identifies requests by whether the device's model name matches a: <br> **-** Specific value ([Model Name Literal](https://docs.vdms.com/cdn/Content/HRE/M/D-Model-Name-Literal.htm)) <br> **-** Regular expression ([Model Name Regex](https://docs.vdms.com/cdn/Content/HRE/M/D-Model-Name-Regex.htm)) <br> **-** Specific pattern ([Model Name Wildcard](https://docs.vdms.com/cdn/Content/HRE/M/D-Model-Name-Wildcard.htm)) |
| [Progressive Download?](https://docs.vdms.com/cdn/Content/HRE/M/D-Progressive-Download.htm) | Identifies requests by whether the device supports progressive download. |
| Release Date | Identifies requests by whether the device's release date matches a: <br> **-** Specific value ([Release Date Literal](https://docs.vdms.com/cdn/Content/HRE/M/D-Release-Date-Literal.htm)) <br> **-** Regular expression ([Release Date Regex](https://docs.vdms.com/cdn/Content/HRE/M/D-Release-Date-Regex.htm)) <br> **-** Specific pattern ([Release Date Wildcard](https://docs.vdms.com/cdn/Content/HRE/M/D-Release-Date-Wildcard.htm)) |
| [Resolution Height](https://docs.vdms.com/cdn/Content/HRE/M/D-Resolution-Height.htm) | Identifies requests by the device's height. |
| [Resolution Width](https://docs.vdms.com/cdn/Content/HRE/M/D-Resolution-Width.htm) | Identifies requests by the device's width. |

**[Back to Top](#top)**

### <a name="location"></a>Location

These match conditions are designed to identify requests based on the requester's location.

| Name       | Purpose                                                           |
|------------|-------------------------------------------------------------------|
| [AS Number](https://docs.vdms.com/cdn/Content/HRE/M/AS-Number.htm) | Identifies requests that originate from a particular network. |
| City Name | Identifies requests by whether they originate from a city whose name matches a: <br> **-** Specific value ([City Name Literal](https://docs.vdms.com/cdn/Content/HRE/M/City-Name-Literal.htm)) <br> **-** Regular expression ([City Name Regex](https://docs.vdms.com/cdn/Content/HRE/M/City-Name-Regex.htm)) |
| [Continent](https://docs.vdms.com/cdn/Content/HRE/M/Continent.htm) | Identifies requests that originate from the specified continents. |
| [Country](https://docs.vdms.com/cdn/Content/HRE/M/Country.htm) | Identifies requests that originate from the specified countries/regions. |
| [Direct memory access (DMA) Code](https://docs.vdms.com/cdn/Content/HRE/M/DMA-Code.htm) | Identifies requests that originate from the specified metros (Designated Market Areas). |
| [Latitude](https://docs.vdms.com/cdn/Content/HRE/M/Latitude.htm) | Identifies requests that originate from the specified latitudes. |
| [Longitude](https://docs.vdms.com/cdn/Content/HRE/M/Longitude.htm) | Identifies requests that originate from the specified longitudes. |
| [Metro Code](https://docs.vdms.com/cdn/Content/HRE/M/Metro-Code.htm) | Identifies requests that originate from the specified metros (Designated Market Areas). |
| [Postal Code](https://docs.vdms.com/cdn/Content/HRE/M/Postal-Code.htm) | Identifies requests that originate from the specified postal codes. |
| [Region Code](https://docs.vdms.com/cdn/Content/HRE/M/Region-Code.htm) | Identifies requests that originate from the specified regions. |

> [!NOTE]
> **Should I use Metro Code or DMA Code?** <br>
Both of these match conditions provide the same capability. However, we recommend the use of the Metro Code match condition to identify requests by DMA.

**[Back to Top](#top)**

### <a name="origin"></a>Origin

These match conditions are designed to identify requests that point to content delivery network storage or a customer origin server.

| Name       | Purpose                                                           |
|------------|-------------------------------------------------------------------|
| [Content delivery network Origin](https://docs.vdms.com/cdn/Content/HRE/M/CDN-Origin.htm) | Identifies requests for content stored on content delivery network storage. |
| [Customer Origin](https://docs.vdms.com/cdn/Content/HRE/M/Customer-Origin.htm) | Identifies requests for content stored on a specific customer origin server. |

**[Back to Top](#top)**

### <a name="request"></a>Request

These match conditions are designed to identify requests based on their properties.

| Name              | Purpose                                                                |
|-------------------|------------------------------------------------------------------------|
| [Client IP Address](https://docs.vdms.com/cdn/Content/HRE/M/Client-IP-Address.htm) | Identifies requests that originate from a particular IP address. |
| Cookie Parameter  | Identifies a request by whether it contains a cookie that matches a: <br> **-** Specific Value ([Cookie Parameter Literal](https://docs.vdms.com/cdn/Content/HRE/M/Cookie-Parameter-Literal.htm)) <br> **-** Regular expression ([Cookie Parameter Regex](https://docs.vdms.com/cdn/Content/HRE/M/Cookie-Parameter-Regex.htm) <br> **-** Specific pattern ([Cookie Parameter Wildcard](https://docs.vdms.com/cdn/Content/HRE/M/Cookie-Parameter-Wildcard.htm)) |
| [Edge CNAME](https://docs.vdms.com/cdn/Content/HRE/M/Edge-CNAME.htm) | Identifies requests that point to a specific edge CNAME. |
| Referring Domain | Identifies a request by whether it gets referred by a hostname that matches a: <br> **-** Specific value ([Referring Domain Literal](https://docs.vdms.com/cdn/Content/HRE/M/Referring-Domain-Literal.htm)) <br> **-** Specific pattern ([Referring Domain Wildcard](https://docs.vdms.com/cdn/Content/HRE/M/Referring-Domain-Wildcard.htm)) |
| Request Header | Identifies a request by whether it contains a header that matches a: <br> **-** Specific value ([Request Header Literal](https://docs.vdms.com/cdn/Content/HRE/M/Request-Header-Literal.htm)) <br> **-** Regular expression ([Request Header Regex](https://docs.vdms.com/cdn/Content/HRE/M/Request-Header-Regex.htm)) <br> **-** Specific pattern ([Request Header Wildcard](https://docs.vdms.com/cdn/Content/HRE/M/Request-Header-Wildcard.htm)) |
| [Request Method](https://docs.vdms.com/cdn/Content/HRE/M/Request-Method.htm) | Identifies requests by their HTTP method. |
| [Request Scheme](https://docs.vdms.com/cdn/Content/HRE/M/Request-Scheme.htm) | Identifies requests by their HTTP protocol. |

**[Back to Top](#top)**

### <a name="url"></a>URL

| Name              | Purpose                                                                |
|-------------------|------------------------------------------------------------------------|
| URL Path | Identifies requests by whether their relative path, including filename, matches a: <br> **-** Specific value ([URL Path Literal](https://docs.vdms.com/cdn/Content/HRE/M/URL-Path-Literal.htm)) <br> **-** Regular expression ([URL Path Regex](https://docs.vdms.com/cdn/Content/HRE/M/URL-Path-Regex.htm)) <br> **-** Specific pattern ([URL Path Wildcard](https://docs.vdms.com/cdn/Content/HRE/M/URL-Path-Wildcard.htm)) |
| URL Path Directory | Identifies requests by whether their relative path matches a: <br> **-** Specific value ([URL Path Directory Literal](https://docs.vdms.com/cdn/Content/HRE/M/URL-Path-Directory-Literal.htm)) <br> **-** Specific pattern ([URL Path Directory Wildcard](https://docs.vdms.com/cdn/Content/HRE/M/URL-Path-Directory-Wildcard.htm)) |
| URL Path Extension | Identifies requests by whether their file extension matches a: <br> **-** Specific value ([URL Path Extension Literal](https://docs.vdms.com/cdn/Content/HRE/M/URL-Path-Extension-Literal.htm)) <br> **-** Specific pattern ([URL Path Extension Wildcard](https://docs.vdms.com/cdn/Content/HRE/M/URL-Path-Extension-Wildcard.htm)) |
| URL Path Filename | Identifies requests by whether their filename matches a: <br> **-** Specific value ([URL Path Filename Literal](https://docs.vdms.com/cdn/Content/HRE/M/URL-Path-Filename-Literal.htm)) <br> **-** Specific pattern ([URL Path Filename Wildcard](https://docs.vdms.com/cdn/Content/HRE/M/URL-Path-Filename-Wildcard.htm)) |
| URL Query | Identifies requests by whether their query string matches a: <br> **-** Specific value ([URL Query Literal](https://docs.vdms.com/cdn/Content/HRE/M/URL-Query-Literal.htm)) <br> **-** Regular expression ([URL Query Regex](https://docs.vdms.com/cdn/Content/HRE/M/URL-Query-Regex.htm)) <br> **-** Specific pattern ([URL Query Wildcard](https://docs.vdms.com/cdn/Content/HRE/M/URL-Query-Wildcard.htm)) |
| URL Query Parameter | Identifies requests by whether they contain a query string parameter set to a value that matches a: <br> **-** Specific value ([URL Query Parameter Literal](https://docs.vdms.com/cdn/Content/HRE/M/URL-Query-Parameter-Literal.htm)) <br> **-** Specific pattern ([URL Query Parameter Wildcard](https://docs.vdms.com/cdn/Content/HRE/M/URL-Query-Parameter-Wildcard.htm)) |

**[Back to Top](#top)**

For the most recent match conditions, see the [Edgio Rules Engine documentation](https://docs.vdms.com/cdn/index.html#Quick_References/HRE_QR.htm#Conditio).

## Next steps

- [Azure Content Delivery Network overview](cdn-overview.md)
- [Rules engine reference](cdn-verizon-premium-rules-engine-reference.md)
- [Rules engine conditional expressions](cdn-verizon-premium-rules-engine-reference-conditional-expressions.md)
- [Rules engine features](cdn-verizon-premium-rules-engine-reference-features.md)
- [Overriding default HTTP behavior using the rules engine](cdn-verizon-premium-rules-engine.md)
