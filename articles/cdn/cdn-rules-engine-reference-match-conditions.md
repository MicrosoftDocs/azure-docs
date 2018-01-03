---
title: Match conditions for the Content Delivery Network rules engine | Microsoft Docs
description: Reference documentation for Azure Content Delivery Network rules engine match conditions and features.
services: cdn
documentationcenter: ''
author: Lichard
manager: akucer
editor: ''

ms.assetid: 669ef140-a6dd-4b62-9b9d-3f375a14215e
ms.service: cdn
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/21/2017
ms.author: rli

---

# Match conditions for the Content Delivery Network rules engine
This article lists detailed descriptions of the available match conditions for the Azure Content Delivery Network [rules engine](cdn-rules-engine.md).

The second part of a rule is the match condition. A match condition identifies specific types of requests for which a set of features will be performed.

For example, you can use a match condition to:
- Filter requests for content at a particular location.
- Filter requests generated from a particular IP address or country.
- Filter requests by header information.

## Always match condition

The Always match condition applies a default set of features to all requests.

Name | Purpose
-----|--------
[Always](#always) | Applies a default set of features to all requests.

## Device match condition

The Device match condition identifies requests made from a mobile device based on its properties.  

Name | Purpose
-----|--------
[Device](#device) | Identifies requests made from a mobile device based on its properties.

## Location match conditions

The Location match conditions identify requests based on the requester's location.

Name | Purpose
-----|--------
[AS Number](#as-number) | Identifies requests that originate from a particular network.
[Country](#country) | Identifies requests that originate from the specified countries.

## Origin match conditions

The Origin match conditions identify requests that point to Content Delivery Network storage or a customer origin server.

Name | Purpose
-----|--------
[CDN Origin](#cdn-origin) | Identifies requests for content stored in Content Delivery Network storage.
[Customer Origin](#customer-origin) | Identifies requests for content stored on a specific customer origin server.

## Request match conditions

The Request match conditions identify requests based on their properties.

Name | Purpose
-----|--------
[Client IP Address](#client-ip-address) | Identifies requests that originate from a particular IP address.
[Cookie Parameter](#cookie-parameter) | Checks the cookies associated with each request for the specified value.
[Cookie Parameter Regex](#cookie-parameter-regex) | Checks the cookies associated with each request for the specified regular expression.
[Edge Cname](#edge-cname) | Identifies requests that point to a specific edge CNAME.
[Referring Domain](#referring-domain) | Identifies requests that were referred from the specified host names.
[Request Header Literal](#request-header-literal) | Identifies requests that contain the specified header set to a specified value.
[Request Header Regex](#request-header-regex) | Identifies requests that contain the specified header set to a value that matches the specified regular expression.
[Request Header Wildcard](#request-header-wildcard) | Identifies requests that contain the specified header set to a value that matches the specified pattern.
[Request Method](#request-method) | Identifies requests by their HTTP method.
[Request Scheme](#request-scheme) | Identifies requests by their HTTP protocol.

## URL match conditions

The URL match conditions identify requests based on their URLs.

Name | Purpose
-----|--------
URL Path Directory | Identifies requests by their relative path.
URL Path Extension | Identifies requests by their file name extension.
URL Path Filename | Identifies requests by their file name.
URL Path Literal | Compares a request's relative path to the specified value.
URL Path Regex | Compares a request's relative path to the specified regular expression.
URL Path Wildcard | Compares a request's relative path to the specified pattern.
URL Query Literal | Compares a request's query string to the specified value.
URL Query Parameter | Identifies requests that contain the specified query string parameter set to a value that matches a specified pattern.
URL Query Regex | Identifies requests that contain the specified query string parameter set to a value that matches a specified regular expression.
URL Query Wildcard | Compares the specified value against the request's query string.


## Reference for rules engine match conditions

---
### Always

The Always match condition applies a default set of features to all requests.

[Back to top](#azure-cdn-rules-engine-match-conditions)

</br>

---
### AS Number 
The AS Number network is defined by its autonomous system number (ASN). An option is provided to indicate whether this condition will be met when a client's network "Matches" or "Does Not Match" the specified ASN.

Key information:
- Specify multiple ASNs by delimiting each one with a single space. For example, 64514 64515 matches requests that arrive from either 64514 or 64515.
- Certain requests might not return a valid ASN. A question mark (?) will match requests for which a valid ASN could not be determined.
- You must specify the entire ASN for the desired network. Partial values will not be matched.
- Due to the manner in which cache settings are tracked, this match condition is incompatible with the following features:
  - Complete Cache Fill
  - Default Internal Max-Age
  - Force Internal Max-Age
  - Ignore Origin No-Cache
  - Internal Max-Stale

[Back to top](#azure-cdn-rules-engine-match-conditions)

</br>

---
### CDN Origin
The CDN Origin match condition is met when both of the following conditions are met:
- Content from Content Delivery Network storage was requested.
- The request URI uses the content access point (for example, /000001) that's defined in this match condition.
  - Content Delivery Network URL: The request URI must contain the selected content access point.
  - Edge CNAME URL: The corresponding edge CNAME configuration must point to the selected content access point.
  
Key information:
 - The content access point identifies the service that should serve the requested content.
 - Don't use an AND IF statement to combine certain match conditions. For example, combining a CDN Origin match condition with a Customer Origin match condition would create a match pattern that could never be matched. For this reason, two CDN Origin match conditions cannot be combined through an AND IF statement.

[Back to top](#azure-cdn-rules-engine-match-conditions)

</br>

---
### Client IP Address
An option is provided to indicate whether the Client IP Address condition will be met when a client's IP address "Matches" or "Does Not Match" the specified IP addresses.

Key information:
- Make sure to use CIDR notation.
- Specify multiple IP addresses and/or IP address blocks by delimiting each one with a single space.
  - **IPv4 example**: 1.2.3.4 10.20.30.40 matches any requests that arrive from either 1.2.3.4 or 10.20.30.40.
  - **IPv6 example**: 1:2:3:4:5:6:7:8 10:20:30:40:50:60:70:80 matches any requests that arrive from either 1:2:3:4:5:6:7:8 or 10:20:30:40:50:60:70:80.
- The syntax for an IP address block is the base IP address followed by a forward slash and the prefix size.
  - **IPv4 example**: 5.5.5.64/26 matches any requests that arrive from 5.5.5.64 through 5.5.5.127.
  - **IPv6 example**: 1:2:3:/48 matches any requests that arrive from 1:2:3:0:0:0:0:0 through 1:2:3:ffff:ffff:ffff:ffff:ffff.
- Due to the manner in which cache settings are tracked, this match condition is incompatible with the following features:
  - Complete Cache Fill
  - Default Internal Max-Age
  - Force Internal Max-Age
  - Ignore Origin No-Cache
  - Internal Max-Stale

[Back to top](#azure-cdn-rules-engine-match-conditions)

</br>

---
### Cookie Parameter
The **Matches**/**Does Not Match** option determines the conditions under which the Cookie Parameter match condition will be satisfied.
- **Matches**: Requires a request to contain the specified cookie with a value that matches at least one of the values that are defined in this match condition.
- **Does Not Match**: Requires that the request satisfy either of the following criteria:
  - It does not contain the specified cookie.
  - It contains the specified cookie, but its value does not match any of the values that are defined in this match condition.
  
Key information:
- Cookie name: 
  - Special characters, including an asterisk, are not supported when you're specifying a cookie name. This means that only exact cookie name matches are eligible for comparison.
  - Only a single cookie name can be specified per instance of this match condition.
  - Cookie name comparisons are case-insensitive.
- Cookie value: 
  - Specify multiple cookie values by delimiting each one with a single space.
  - A cookie value can take advantage of special characters. 
  - If a wildcard character has not been specified, only an exact match will satisfy this match condition. For example, specifying "Value" will match "Value," but not "Value1" or "Value2."
  - The **Ignore Case** option determines whether a case-sensitive comparison will be made against the request's cookie value.
- Due to the manner in which cache settings are tracked, this match condition is incompatible with the following features:
  - Complete Cache Fill
  - Default Internal Max-Age
  - Force Internal Max-Age
  - Ignore Origin No-Cache
  - Internal Max-Stale

[Back to top](#azure-cdn-rules-engine-match-conditions)

</br>

---
### Cookie Parameter Regex
The Cookie Parameter Regex match condition defines a cookie name and value. You can use regular expressions to define the desired cookie value. 

The **Matches**/**Does Not Match** option determines the conditions under which this match condition will be satisfied.
- **Matches**: Requires a request to contain the specified cookie with a value that matches the specified regular expression.
- **Does Not Match**: Requires that the request satisfy either of the following criteria:
  - It does not contain the specified cookie.
  - It contains the specified cookie, but its value does not match the specified regular expression.
  
Key information:
- Cookie name: 
  - Regular expressions and special characters, including an asterisk, are not supported when you're specifying a cookie name. This means that only exact cookie name matches are eligible for comparison.
  - Only a single cookie name can be specified per instance of this match condition.
  - Cookie name comparisons are case-insensitive.
- Cookie value: 
  - A cookie value can take advantage of regular expressions.
  - The **Ignore Case** option determines whether a case-sensitive comparison will be made against the request's cookie value.
- Due to the manner in which cache settings are tracked, this match condition is incompatible with the following features:
  - Complete Cache Fill
  - Default Internal Max-Age
  - Force Internal Max-Age
  - Ignore Origin No-Cache
  - Internal Max-Stale

[Back to top](#azure-cdn-rules-engine-match-conditions)

</br>

--- 
### Country
You can specify a country through its country code. An option is provided to indicate whether this condition will be met when the country from which a request originates "Matches" or "Does Not Match" the specified values.

Key information:
- Specify multiple country codes by delimiting each one with a single space.
- Wildcards are not supported when you're specifying a country code.
- The "EU" and "AP" country codes do not encompass all IP addresses in those regions.
- Certain requests might not return a valid country code. A question mark (?) will match requests for which a valid country code could not be determined.
- Country codes are case-sensitive.
- Due to the manner in which cache settings are tracked, this match condition is incompatible with the following features:
  - Complete Cache Fill
  - Default Internal Max-Age
  - Force Internal Max-Age
  - Ignore Origin No-Cache
  - Internal Max-Stale

[Back to top](#azure-cdn-rules-engine-match-conditions)

</br>

---
### Customer Origin

Key information: 
- The Customer Origin match condition will be satisfied regardless of whether content is requested through a Content Delivery Network URL or an edge CNAME URL that points to the selected customer origin.
- A customer origin configuration that's referenced by a rule cannot be deleted from the Customer Origin page. Before you attempt to delete a customer origin configuration, make sure that the following configurations do not reference it:
  - A Customer Origin match condition
  - An edge CNAME configuration
- Don't use an AND IF statement to combine certain match conditions. For example, combining a Customer Origin match condition with a CDN Origin match condition would create a match pattern that could never be matched. For this reason, two Customer Origin match conditions cannot be combined through an AND IF statement.

[Back to top](#azure-cdn-rules-engine-match-conditions)

</br>

---
### Device

The Device match condition identifies requests made from a mobile device based on its properties. Mobile device detection is achieved through [WURFL](http://wurfl.sourceforge.net/). The following table lists WURFL capabilities and their variables for the Content Delivery Network rules engine.
<br>
> [!NOTE] 
> The following variables are supported in the **Modify Client Request Header** and **Modify Client Response Header** features.

Capability | Variable | Description | Sample values
-----------|----------|-------------|----------------
Brand Name | %{wurfl_cap_brand_name} | A string that indicates the brand name of the device. | Samsung
Device OS | %{wurfl_cap_device_os} | A string that indicates the operating system installed on the device. | IOS
Device OS Version | %{wurfl_cap_device_os_version} | A string that indicates the version number of the operating system installed on the device. | 1.0.1
Dual Orientation | %{wurfl_cap_dual_orientation} | A Boolean that indicates whether the device supports dual orientation. | true
HTML Preferred DTD | %{wurfl_cap_html_preferred_dtd} | A string that indicates the mobile device's preferred document type definition (DTD) for HTML content. | none<br/>xhtml_basic<br/>html5
Image Inlining | %{wurfl_cap_image_inlining} | A Boolean that indicates whether the device supports Base64 encoded images. | false
Is Android | %{wurfl_vcap_is_android} | A Boolean that indicates whether the device uses the Android OS. | true
Is IOS | %{wurfl_vcap_is_ios} | A Boolean that indicates whether the device uses iOS. | false
Is Smart TV | %{wurfl_cap_is_smarttv} | A Boolean that indicates whether the device is a smart TV. | false
Is Smartphone | %{wurfl_vcap_is_smartphone} | A Boolean that indicates whether the device is a smartphone. | true
Is Tablet | %{wurfl_cap_is_tablet} | A Boolean that indicates whether the device is a tablet. This is an OS-independent description. | true
Is Wireless Device | %{wurfl_cap_is_wireless_device} | A Boolean that indicates whether the device is considered a wireless device. | true
Marketing Name | %{wurfl_cap_marketing_name} | A string that indicates the device's marketing name. | BlackBerry 8100 Pearl
Mobile Browser | %{wurfl_cap_mobile_browser} | A string that indicates the browser that's used to request content from the device. | Chrome
Mobile Browser Version | %{wurfl_cap_mobile_browser_version} | A string that indicates the version of the browser that's used to request content from the device. | 31
Model Name | %{wurfl_cap_model_name} | A string that indicates the device's model name. | s3
Progressive Download | %{wurfl_cap_progressive_download} | A Boolean that indicates whether the device supports the playback of audio and video while it is still being downloaded. | true
Release Date | %{wurfl_cap_release_date} | A string that indicates the year and month on which the device was added to the WURFL database.<br/><br/>Format: `yyyy_mm` | 2013_december
Resolution Height | %{wurfl_cap_resolution_height} | An integer that indicates the device's height in pixels. | 768
Resolution Width | %{wurfl_cap_resolution_width} | An integer that indicates the device's width in pixels. | 1024

[Back to top](#azure-cdn-rules-engine-match-conditions)

</br>

---
### Edge Cname
Key information: 
- The list of available edge CNAMEs is limited to those that have been configured on the Edge CNAMEs page that corresponds to the platform on which HTTP Rules Engine is being configured.
- Before you attempt to delete an edge CNAME configuration, make sure that an Edge Cname match condition does not reference it. Edge CNAME configurations that have been defined in a rule cannot be deleted from the Edge CNAMEs page. 
- Don't use an AND IF statement to combine certain match conditions. For example, combining an Edge Cname match condition with a Customer Origin match condition would create a match pattern that could never be matched. For this reason, two Edge Cname match conditions cannot be combined through an AND IF statement.
- Due to the manner in which cache settings are tracked, this match condition is incompatible with the following features:
  - Complete Cache Fill
  - Default Internal Max-Age
  - Force Internal Max-Age
  - Ignore Origin No-Cache
  - Internal Max-Stale

[Back to top](#azure-cdn-rules-engine-match-conditions)

</br>

---
### Referring Domain
The host name associated with the referrer through which content was requested determines whether the Referring Domain condition is met. An option is provided to indicate whether this condition will be met when the referring host name "Matches" or "Does Not Match" the specified values.

Key information:
- Specify multiple host names by delimiting each one with a single space.
- This match condition supports special characters.
- If the specified value does not contain an asterisk, it must be an exact match for the referrer's host name. For example, specifying "mydomain.com" would not match "www.mydomain.com."
- The **Ignore Case** option determines whether a case-sensitive comparison will be performed.
- Due to the manner in which cache settings are tracked, this match condition is incompatible with the following features:
  - Complete Cache Fill
  - Default Internal Max-Age
  - Force Internal Max-Age
  - Ignore Origin No-Cache
  - Internal Max-Stale

[Back to top](#azure-cdn-rules-engine-match-conditions)

</br>

---  
### Request Header Literal
The **Matches**/**Does Not Match** option determines the conditions under which this match condition will be satisfied.
- **Matches**: Requires the request to contain the specified header. Its value must match the one that's defined in this match condition.
- **Does Not Match**: Requires that the request satisfy either of the following criteria:
  - It does not contain the specified header.
  - It contains the specified header, but its value does not match the one that's defined in this match condition.
  
Key information:
- Header name comparisons are always case-insensitive. The **Ignore Case** option determines the case-sensitivity of header value comparisons.
- Due to the manner in which cache settings are tracked, this match condition is incompatible with the following features:
  - Complete Cache Fill
  - Default Internal Max-Age
  - Force Internal Max-Age
  - Ignore Origin No-Cache
  - Internal Max-Stale

[Back to top](#azure-cdn-rules-engine-match-conditions)

</br>

---  
### Request Header Regex
The **Matches**/**Does Not Match** option determines the conditions under which the Request Header Regex match condition will be satisfied.
- **Matches**: Requires the request to contain the specified header. Its value must match the pattern that's defined in the specified regular expression.
- **Does Not Match**: Requires that the request satisfy either of the following criteria:
  - It does not contain the specified header.
  - It contains the specified header, but its value does not match the specified regular expression.

Key information:
- Header name: 
  - Header name comparisons are case-insensitive.
  - Spaces in the header name should be replaced with "%20." 
- Header value: 
  - A header value can take advantage of regular expressions.
  - The **Ignore Case** option determines the case-sensitivity of header value comparisons.
  - Only exact header value matches to at least one of the specified patterns will satisfy this condition.
- Due to the manner in which cache settings are tracked, this match condition is incompatible with the following features:
  - Complete Cache Fill
  - Default Internal Max-Age
  - Force Internal Max-Age
  - Ignore Origin No-Cache
  - Internal Max-Stale 

[Back to top](#azure-cdn-rules-engine-match-conditions)

</br>

---
### Request Header Wildcard
The **Matches**/**Does Not Match** option determines the conditions under which the Request Header Wildcard match condition will be satisfied.
- **Matches**: Requires the request to contain the specified header. Its value must match at least one of the values that are defined in this match condition.
- **Does Not Match**: Requires that the request satisfy either of the following criteria:
  - It does not contain the specified header.
  - It contains the specified header, but its value does not match any of the specified values.
  
Key information:
- Header name: 
  - Header name comparisons are case-insensitive.
  - Spaces in the header name should be replaced with "%20." You can also use this value to specify spaces in a header value.
- Header value: 
  - A header value can take advantage of special characters.
  - The **Ignore Case** option determines the case-sensitivity of header value comparisons.
  - Only exact header value matches to at least one of the specified patterns will satisfy this condition.
  - Specify multiple values by delimiting each one with a single space.
- Due to the manner in which cache settings are tracked, this match condition is incompatible with the following features:
  - Complete Cache Fill
  - Default Internal Max-Age
  - Force Internal Max-Age
  - Ignore Origin No-Cache
  - Internal Max-Stale

[Back to top](#azure-cdn-rules-engine-match-conditions)

</br>

---
### Request Method
Only assets that are requested through the selected request method will satisfy the Request Method condition. The available request methods are:
- GET
- HEAD 
- POST 
- OPTIONS 
- PUT 
- DELETE 
- TRACE 
- CONNECT 

Key information:
- By default, only the GET request method can generate cached content on the network. All other request methods are proxied through the network.
- Due to the manner in which cache settings are tracked, this match condition is incompatible with the following features:
  - Complete Cache Fill
  - Default Internal Max-Age
  - Force Internal Max-Age
  - Ignore Origin No-Cache
  - Internal Max-Stale

[Back to top](#azure-cdn-rules-engine-match-conditions)

</br>

---
### Request Scheme
Only assets that are requested through the selected protocol will satisfy the Request Scheme condition. The available protocols are HTTP and HTTPS.

Key information:
- Due to the manner in which cache settings are tracked, this match condition is incompatible with the following features:
  - Complete Cache Fill
  - Default Internal Max-Age
  - Force Internal Max-Age
  - Ignore Origin No-Cache
  - Internal Max-Stale

[Back to top](#azure-cdn-rules-engine-match-conditions)

</br>

## Next steps
* [Azure Content Delivery Network overview](cdn-overview.md)
* [Rules engine reference](cdn-rules-engine-reference.md)
* [Rules engine conditional expressions](cdn-rules-engine-reference-conditional-expressions.md)
* [Rules engine features](cdn-rules-engine-reference-features.md)
* [Overriding default HTTP behavior using the rules engine](cdn-rules-engine.md)

