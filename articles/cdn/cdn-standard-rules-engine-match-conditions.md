---
title: Azure CDN from Microsoft Standard Rules Engine match conditions | Microsoft Docs
description: Reference documentation for Azure Content Delivery Network from Microsoft Standard Rules Engine match conditions.
services: cdn
author: mdgattuso

ms.service: azure-cdn
ms.topic: article
ms.date: 11/01/2019
ms.author: magattus

---

# Azure CDN from Microsoft Standard Rules Engine match conditions

This article lists detailed descriptions of the available match conditions for the Azure Content Delivery Network (CDN) from Microsoft [Standard Rules Engine](cdn-standard-rules-engine.md).

The first part of a rule is a set of match conditions. Each rule may have up to 4 match conditions. A match condition identifies specific types of requests for which the actions defined in the rule will be performed. If you use multiple match conditions, they will be grouped together using AND logic.

For example, you can use a match condition to:

- Filter requests generated from a particular IP address or country/region.
- Filter requests by header information.
- Filter requests from Mobile or Desktop devices.

## Match Conditions

The following match conditions are available to use. 

### Device type 

The Device type match condition identifies requests made from a mobile or desktop device based on its properties.  

**Required fields**

Operator | Supported Value
---------|----------------
Equals, Not equals | Mobile, Desktop


### HTTP Version

The HTTP Version match condition identifies requests based on the HTTP version the request arrives with.

**Required fields**

Operator | Supported Value
---------|----------------
Equals, Not equals | 2.0, 1.1, 1.0, 0.9, All


### Request cookies

The Request cookies match condition identifies requests based on cookie information in the incoming request.

**Required fields**

Cookie Name | Operator | Cookie Value | Case Transform
------------|----------|--------------|---------------
String | [Standard operator list](#standard-operator-list) | String, Int | No transform, to uppercase, to lowercase

Key information
- Wildcard values, including asterisks (*), are not supported when specifying a cookie name, only exact cookie name matches are eligible for comparison.
- Only a single cookie name can be specified per instance of this match condition.
- Cookie name comparisons are case-insensitive.
- Specify multiple cookie values by delimiting each one with a single space. 
- Cookie values can take advantage of wildcard values.
- If a wildcard value has not been specified, only an exact match will satisfy this match condition. For example, specifying "Value" will match "Value", but not "Value1". 

### Post Argument

**Required fields**

Argument Name | Operator | Argument Value | Case Transform
--------------|----------|----------------|---------------
String | [Standard operator list](#standard-operator-list) | String, Int | No transform, to uppercase, to lowercase

### Query String

The Query String match conditions identifies requests containing a specified query string parameter. This parameter is set to a value that matches a specified pattern. Query string parameters (for example, parameter=value) in the request URL determine whether this condition is met. This match condition identifies a query string parameter by its name and accepts one or more values for the parameter value.

**Required fields**

Operator | Query String | Case Transform
---------|--------------|---------------
[Standard operator list](#standard-operator-list) | String, Int | No transform, to uppercase, to lowercase

### Remote Address

The Remote address match condition identify requests based on the requester's location or IP address.

**Required fields**

Operator | Supported Values
---------|-----------------
Any | N/A
Geo Match | Country codes
IP Match | IP addresses (space seperated)
Not Any | N/A
Not Geo Match | Country codes
Not IP Match | IP addresses (space seperated)

Key information:

- Use CIDR notation.
- Specify multiple IP addresses and/or IP address blocks by delimiting each one with a single space. For example:
  - **IPv4 example**: 1.2.3.4 10.20.30.40 matches any requests that arrive from either address 1.2.3.4 or 10.20.30.40.
  - **IPv6 example**: 1:2:3:4:5:6:7:8 10:20:30:40:50:60:70:80 matches any requests that arrive from either address 1:2:3:4:5:6:7:8 or 10:20:30:40:50:60:70:80.
- The syntax for an IP address block is the base IP address followed by a forward slash and the prefix size. For example:
  - **IPv4 example**: 5.5.5.64/26 matches any requests that arrive from addresses 5.5.5.64 through 5.5.5.127.
  - **IPv6 example**: 1:2:3:/48 matches any requests that arrive from addresses 1:2:3:0:0:0:0:0 through 1:2:3:ffff:ffff:ffff:ffff:ffff.

### Request Body

**Required fields**

Operator | Request Body | Case Transform
---------|--------------|---------------
[Standard operator list](#standard-operator-list) | String, Int | No transform, to uppercase, to lowercase

### Request Header

**Required fields**
Header Name | Operator | Header Value | Case Transform
------------|----------|--------------|---------------
String | [Standard operator list](#standard-operator-list) | String, Int | No transform, to uppercase, to lowercase

### Request Method

**Required fields**

Operator | Supported Value
---------|----------------
Equals, Not equals | GET, POST, PUT, DELETE, HEAD, OPTIONS, TRACE

Key information:

- Only the GET request method can generate cached content on the CDN. All other request methods are proxied through the network. 

### Request Protocol

**Required fields**

Operator | Supported Value
---------|----------------
Equals, Not equals | HTTP, HTTPS

### Request URL

**Required fields**

Operator | Request URL | Case Transform
---------|-------------|---------------
[Standard operator list](#standard-operator-list) | String, Int | No transform, to uppercase, to lowercase

Key information:

- When entering Request URL, ensure you include protocol information. For example "https://www.[yourdomain].com"

### URL File Extension

**Required fields**

Operator | Extension | Case Transform
---------|-----------|---------------
[Standard operator list](#standard-operator-list) | String, Int | No transform, to uppercase, to lowercase

Key information:

- For extension, do not include a leading period; for example, use html instead of .html.

### URL File Name

**Required fields**

Operator | File name | Case Transform
---------|-----------|---------------
[Standard operator list](#standard-operator-list) | String, Int | No transform, to uppercase, to lowercase

Key information:

- To specify multiple file names, separate each file name with a single space. 

### URL Path

**Required fields**

Operator | Value | Case Transform
---------|-------|---------------
[Standard operator list](#standard-operator-list) | String, Int | No transform, to uppercase, to lowercase

Key information:

- A file name value can take advantage of wildcard values. For example, each file name pattern can consist of one or more asterisks (*), where each asterisk matches a sequence of one or more characters.

## Reference for rules engine match conditions

### Standard Operator List

For rules that contain the standard operator list, the following operators are valid:

- Any
- Equals 
- Contains 
- Begins with 
- Ends with 
- Less than
- Less than or equals
- Greater than
- Greater than or equals
- Not any
- Not contains
- Not begins with 
- Not ends with 
- Not less than
- Not less than or equals
- Not greater than
- Not greater than or equals

For numeric operators, like "Less than" or "Greater than or equals", the comparison used will based on length. In this case, the value in the match condition should be an Integer, equal to the length you would like to compare. 

---

[Back to top](#match-conditions)

</br>

## Next steps

- [Azure Content Delivery Network overview](cdn-overview.md)
- [Rules engine reference](cdn-standard-rules-engine-reference.md)
- [Rules engine actions](cdn-standard-rules-engine-actions.md)
- [Enforce HTTPS using the Standard Rules Engine](cdn-standard-rules-engine.md)
