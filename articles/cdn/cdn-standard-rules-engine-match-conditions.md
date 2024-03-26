---
title: Match conditions in the Standard rules engine for Azure Content Delivery Network
description: Reference documentation for match conditions in the Standard rules engine for Azure Content Delivery Network.
services: cdn
author: duongau
manager: kumudd
ms.service: azure-cdn
ms.topic: article
ms.date: 03/20/2024
ms.author: duau
---

# Match conditions in the Standard rules engine for Azure Content Delivery Network

In the [Standard rules engine](cdn-standard-rules-engine.md) for Azure Content Delivery Network, a rule consists of one or more match conditions and an action. This article provides detailed descriptions of the match conditions you can use in the Standard rules engine for Azure Content Delivery Network.

The first part of a rule is a match condition or set of match conditions. In the Standard rules engine for Azure Content Delivery Network, each rule can have up to four match conditions. A match condition identifies specific types of requests for which defined actions are performed. If you use multiple match conditions, the match conditions are grouped together by using AND logic.

For example, you can use a match condition to:

- Filter requests based on a specific IP address or country/region.
- Filter requests by header information.
- Filter requests from mobile devices or desktop devices.

## Match conditions

The following match conditions are available to use in the Standard rules engine for Azure Content Delivery Network.

### Device type

Identifies requests made from a mobile device or desktop device.

#### Required fields

Operator | Supported values
---------|----------------
Equals, Not equals | Mobile, Desktop

### HTTP version

Identifies requests based on the HTTP version of the request.

#### Required fields

Operator | Supported values
---------|----------------
Equals, Not equals | 2.0, 1.1, 1.0, 0.9, All

### Request cookies

Identifies requests based on cookie information in the incoming request.

#### Required fields

Cookie name | Operator | Cookie value | Case transform
------------|----------|--------------|---------------
String | [Standard operator list](#standard-operator-list) | String, Int | No transform, to uppercase, to lowercase

#### Key information

- You can't use wildcard values (including asterisks (\*)) when you specify a cookie name; you must use an exact cookie name.
- You can specify only a single cookie name per instance of this match condition.
- Cookie name comparisons are case-insensitive.
- To specify multiple cookie values, use a single space between each cookie value.
- Cookie values can take advantage of wildcard values.
- If a wildcard value hasn't been specified, only an exact match satisfies this match condition. For example, "Value" matches "Value" but not "Value1".

### Post argument

Identifies requests based on arguments defined for the POST request method that's used in the request.

#### Required fields

Argument name | Operator | Argument value | Case transform
--------------|----------|----------------|---------------
String | [Standard operator list](#standard-operator-list) | String, Int | No transform, to uppercase, to lowercase

### Query string

Identifies requests that contain a specific query string parameter. This parameter is set to a value that matches a specific pattern. Query string parameters (for example, **parameter=value**) in the request URL determine whether this condition is met. This match condition identifies a query string parameter by its name and accepts one or more values for the parameter value.

#### Required fields

Operator | Query string | Case Transform
---------|--------------|---------------
[Standard operator list](#standard-operator-list) | String, Int | No transform, to uppercase, to lowercase

### Remote address

Identifies requests based on the requester's location or IP address.

#### Required fields

Operator | Supported values
---------|-----------------
Any | N/A
Geo Match | Country code
IP Match | IP address (space-separated)
Not Any | N/A
Not Geo Match | Country code
Not IP Match | IP address (space-separated)

#### Key information

- Use classless inter-domain routing (CIDR) notation.
- To specify multiple IP addresses and IP address blocks, use a single space between the values:
  - **IPv4 example:** *1.2.3.4 10.20.30.40* matches any requests that arrive from either address 1.2.3.4 or 10.20.30.40.
  - **IPv6 example:** *1:2:3:4:5:6:7:8 10:20:30:40:50:60:70:80* matches any requests that arrive from either address 1:2:3:4:5:6:7:8 or 10:20:30:40:50:60:70:80.
- The syntax for an IP address block is the base IP address followed by a forward slash and the prefix size. For example:
  - **IPv4 example:** *5.5.5.64/26* matches any requests that arrive from addresses 5.5.5.64 through 5.5.5.127.
  - **IPv6 example:** *1:2:3:/48* matches any requests that arrive from addresses 1:2:3:0:0:0:0:0 through 1:2:3:ffff:ffff:ffff:ffff:ffff.
- Remote Address represents the original client IP that is either from the network connection or typically the X-Forwarded-For request header if the user is behind a proxy.

### Request body

Identifies requests based on specific text that appears in the body of the request.

#### Required fields

Operator | Request body | Case transform
---------|--------------|---------------
[Standard operator list](#standard-operator-list) | String, Int | No transform, to uppercase, to lowercase

### Request header

Identifies requests that use a specific header in the request.

#### Required fields

Header name | Operator | Header value | Case transform
------------|----------|--------------|---------------
String | [Standard operator list](#standard-operator-list) | String, Int | No transform, to uppercase, to lowercase

### Request method

Identifies requests that use the specified request method.

#### Required fields

Operator | Supported values
---------|----------------
Equals, Not equals | GET, POST, PUT, DELETE, HEAD, OPTIONS, TRACE

#### Key information

- Only the GET request method can generate cached content in Azure Content Delivery Network. All other request methods are proxied through the network.

### Request protocol

Identifies requests that use the specified protocol used.

#### Required fields

Operator | Supported values
---------|----------------
Equals, Not equals | HTTP, HTTPS

### Request URL

Identifies requests that match the specified URL.

#### Required fields

Operator | Request URL | Case transform
---------|-------------|---------------
[Standard operator list](#standard-operator-list) | String, Int | No transform, to uppercase, to lowercase

#### Key information

- When you use this rule condition, be sure to include protocol information. For example: *https://www.\<yourdomain\>.com*.

### URL file extension

Identifies requests that include the specified file extension in the file name in the requesting URL.

#### Required fields

Operator | Extension | Case transform
---------|-----------|---------------
[Standard operator list](#standard-operator-list) | String, Int | No transform, to uppercase, to lowercase

#### Key information

- For extension, don't include a leading period; for example, use *html* instead of *.html*.

### URL file name

Identifies requests that include the specified file name in the requesting URL.

#### Required fields

Operator | File name | Case transform
---------|-----------|---------------
[Standard operator list](#standard-operator-list) | String, Int | No transform, to uppercase, to lowercase

#### Key information

- To specify multiple file names, separate each file name with a single space.

### URL path

Identifies requests that include the specified path in the requesting URL.

#### Required fields

Operator | Value | Case Transform
---------|-------|---------------
[Standard operator list](#standard-operator-list) | String, Int | No transform, to uppercase, to lowercase

#### Key information

- A file name value can take advantage of wildcard values. For example, each file name pattern can consist of one or more asterisks (*), where each asterisk matches a sequence of one or more characters.

## Reference for rules engine match conditions

### Standard operator list

For rules that accept values from the standard operator list, the following operators are valid:

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
- [Standard rules engine reference](cdn-standard-rules-engine-reference.md)
- [Actions in the Standard rules engine](cdn-standard-rules-engine-actions.md)
- [Enforce HTTPS by using the Standard rules engine](cdn-standard-rules-engine.md)
