---
title: Match conditions in the Standard rules engine for Azure Content Delivery Network | Microsoft Docs
description: Reference documentation for match conditions in the Standard rules engine for Azure Content Delivery Network (Azure CDN).
services: cdn
author: mdgattuso

ms.service: azure-cdn
ms.topic: article
ms.date: 11/01/2019
ms.author: magattus

---

# Match conditions in the Standard rules engine for Azure Content Delivery Network

This article lists detailed descriptions of the match conditions you can use in the [Standard rules engine](cdn-standard-rules-engine.md) for Azure Content Delivery Network (CDN) from Microsoft.

The first part of a rule is a set of match conditions. Each rule can have up to four match conditions. A match condition identifies specific types of requests for which the actions defined in the rule are performed. If you use multiple match conditions, the match conditions are grouped together by using AND logic.

For example, you can use a match condition to:

- Filter requests that are generated from a particular IP address, country, or region.
- Filter requests by header information.
- Filter requests from mobile or desktop devices.

## Match conditions

The following match conditions are available to use. 

### Device Type 

The Device type match condition identifies requests made from a mobile or desktop device based on its properties.  

**Required fields**

Operator | Supported value
---------|----------------
Equals, Not equals | Mobile, Desktop


### HTTP Version

The HTTP Version match condition identifies requests based on the HTTP version the request arrives with.

**Required fields**

Operator | Supported value
---------|----------------
Equals, Not equals | 2.0, 1.1, 1.0, 0.9, All


### Request cookies

The request cookies match condition identifies requests based on cookie information in the incoming request.

**Required fields**

Cookie name | Operator | Cookie value | Case transform
------------|----------|--------------|---------------
String | [Standard operator list](#standard-operator-list) | String, Int | No transform, to uppercase, to lowercase

Key information:
- Wildcard values, including asterisks (*), aren't supported when specifying a cookie name; only exact cookie name matches are eligible for comparison.
- Only a single cookie name can be specified per instance of this match condition.
- Cookie name comparisons are case-insensitive.
- Specify multiple cookie values by delimiting each value with a single space. 
- Cookie values can take advantage of wildcard values.
- If a wildcard value hasn't been specified, only an exact match will satisfy this match condition. For example, specifying "Value" will match "Value" but not "Value1". 

### Post argument

**Required fields**

Argument name | Operator | Argument value | Case transform
--------------|----------|----------------|---------------
String | [Standard operator list](#standard-operator-list) | String, Int | No transform, to uppercase, to lowercase

### Query string

The query string match condition identifies requests that contain a specified query string parameter. This parameter is set to a value that matches a specified pattern. Query string parameters (for example, **parameter=value**) in the request URL determine whether this condition is met. This match condition identifies a query string parameter by its name and accepts one or more values for the parameter value.

**Required fields**

Operator | Query string | Case Transform
---------|--------------|---------------
[Standard operator list](#standard-operator-list) | String, Int | No transform, to uppercase, to lowercase

### Remote address

The remote address match condition identifies requests based on the requester's location or IP address.

**Required fields**

Operator | Supported values
---------|-----------------
Any | N/A
Geo Match | Country code
IP Match | IP address (space-separated)
Not Any | N/A
Not Geo Match | Country code
Not IP Match | IP address (space-separated)

Key information:

- Use CIDR notation.
- Specify multiple IP addresses and IP address blocks by delimiting each one with a single space. For example:
  - **IPv4 example**: *1.2.3.4 10.20.30.40* matches any requests that arrive from either address 1.2.3.4 or 10.20.30.40.
  - **IPv6 example**: *1:2:3:4:5:6:7:8 10:20:30:40:50:60:70:8*0 matches any requests that arrive from either address 1:2:3:4:5:6:7:8 or 10:20:30:40:50:60:70:80.
- The syntax for an IP address block is the base IP address followed by a forward slash and the prefix size. For example:
  - **IPv4 example**: *5.5.5.64/26* matches any requests that arrive from addresses 5.5.5.64 through 5.5.5.127.
  - **IPv6 example**: *1:2:3:/48* matches any requests that arrive from addresses 1:2:3:0:0:0:0:0 through 1:2:3:ffff:ffff:ffff:ffff:ffff.

### Request body

**Required fields**

Operator | Request body | Case transform
---------|--------------|---------------
[Standard operator list](#standard-operator-list) | String, Int | No transform, to uppercase, to lowercase

### Request header

**Required fields**
Header name | Operator | Header value | Case transform
------------|----------|--------------|---------------
String | [Standard operator list](#standard-operator-list) | String, Int | No transform, to uppercase, to lowercase

### Request method

**Required fields**

Operator | Supported value
---------|----------------
Equals, Not equals | GET, POST, PUT, DELETE, HEAD, OPTIONS, TRACE

Key information:

- Only the GET request method can generate cached content in Azure CDN. All other request methods are proxied through the network. 

### Request protocol

**Required fields**

Operator | Supported value
---------|----------------
Equals, Not equals | HTTP, HTTPS

### Request URL

**Required fields**

Operator | Request URL | Case transform
---------|-------------|---------------
[Standard operator list](#standard-operator-list) | String, Int | No transform, to uppercase, to lowercase

Key information:

- When you use this rule condition, be sure to include protocol information. For example: *https://www.\<yourdomain\>.com*.

### URL file extension

**Required fields**

Operator | Extension | Case transform
---------|-----------|---------------
[Standard operator list](#standard-operator-list) | String, Int | No transform, to uppercase, to lowercase

Key information:

- For extension, don't include a leading period; for example, use *html* instead of *.html*.

### URL file name

**Required fields**

Operator | File name | Case transform
---------|-----------|---------------
[Standard operator list](#standard-operator-list) | String, Int | No transform, to uppercase, to lowercase

Key information:

- To specify multiple file names, separate each file name with a single space. 

### URL path

**Required fields**

Operator | Value | Case Transform
---------|-------|---------------
[Standard operator list](#standard-operator-list) | String, Int | No transform, to uppercase, to lowercase

Key information:

- A file name value can take advantage of wildcard values. For example, each file name pattern can consist of one or more asterisks (*), where each asterisk matches a sequence of one or more characters.

## Reference for rules engine match conditions

### Standard operator list

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

For numeric operators like *Less than* and *Greater than or equals*, the comparison used is based on length. In this case, the value in the match condition should be an integer that's equal to the length you want to compare. 

## Next steps

- [Azure Content Delivery Network overview](cdn-overview.md)
- [Rules engine reference](cdn-standard-rules-engine-reference.md)
- [Rules engine actions](cdn-standard-rules-engine-actions.md)
- [Enforce HTTPS using the Standard rules engine](cdn-standard-rules-engine.md)
