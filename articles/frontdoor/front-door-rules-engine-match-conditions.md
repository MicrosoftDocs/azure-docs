---
title: Azure Front Door | Microsoft Docs
description: This article provides an overview of Azure Front Door. Find out if it is the right choice for load-balancing user traffic for your application.
services: frontdoor
documentationcenter: ''
author: megan-beatty
editor: ''
ms.service: frontdoor
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 4/30/2020
ms.author: mebeatty
# customer intent: As an IT admin, I want to learn about Front Door and what new features are available. 
---

# Azure Front Door Rules Engine Match Conditions

In [AFD Rules Engine](front-door-rules-engine.md) a rule consists of zero or more match conditions and an action. This article provides detailed descriptions of the match conditions you can use in AFD Rules Engine. 

The first part of a rule is a match condition or set of match conditions. A rule can consist of up to 10 match conditions. A match condition identifies specific types of requests for which defined actions are performed. If you use multiple match conditions, the match conditions are grouped together by using AND logic. For all match conditions that support multiple values (noted below as "space-separated"), the "OR" operator is assumed. 

For example, you can use a match condition to:

- Filter requests based on a specific IP address, country, or region.
- Filter requests by header information.
- Filter requests from mobile devices or desktop devices.

The following match conditions are available to use in Azure Front Door Rules engine.  

## Device type 

Identifies requests made from a mobile device or desktop device.  

#### Required fields

Operator | Supported values
---------|----------------
Equals, Not equals | Mobile, Desktop

## Post argument

Identifies requests based on arguments defined for the POST request method that's used in the request. 

#### Required fields

Argument name | Operator | Argument value | Case transform
--------------|----------|----------------|---------------
String | [Standard operator list](#standard-operator-list) | String, Int | Lowercase, Uppercase, Trim, Remove Whitespace, URL Encode, URL decode

## Query string

Identifies requests that contain a specific query string parameter. This parameter is set to a value that matches a specific pattern. Query string parameters (for example, **parameter=value**) in the request URL determine whether this condition is met. This match condition identifies a query string parameter by its name and accepts one or more values for the parameter value.

#### Required fields

Operator | Query string | Case Transform
---------|--------------|---------------
[Standard operator list](#standard-operator-list) | String, Int | Lowercase, Uppercase, Trim, Remove Whitespace, URL Encode, URL decode

## Remote address

Identifies requests based on the requester's location or IP address.

#### Required fields

Operator | Supported values
---------|-----------------
Geo Match | Country code
IP Match | IP address (space-separated)
Not Geo Match | Country code
Not IP Match | IP address (space-separated)

#### Key information

- Use CIDR notation.
- To specify multiple IP addresses and IP address blocks, use a single space between the values:
  - **IPv4 example**: *1.2.3.4 10.20.30.40* matches any requests that arrive from either address 1.2.3.4 or 10.20.30.40.
  - **IPv6 example**: *1:2:3:4:5:6:7:8 10:20:30:40:50:60:70:80* matches any requests that arrive from either address 1:2:3:4:5:6:7:8 or 10:20:30:40:50:60:70:80.
- The syntax for an IP address block is the base IP address followed by a forward slash and the prefix size. For example:
  - **IPv4 example**: *5.5.5.64/26* matches any requests that arrive from addresses 5.5.5.64 through 5.5.5.127.
  - **IPv6 example**: *1:2:3:/48* matches any requests that arrive from addresses 1:2:3:0:0:0:0:0 through 1:2:3:ffff:ffff:ffff:ffff:ffff.

## Request body

Identifies requests based on specific text that appears in the body of the request.

#### Required fields

Operator | Request body | Case transform
---------|--------------|---------------
[Standard operator list](#standard-operator-list) | String, Int | Lowercase, Uppercase, Trim, Remove Whitespace, URL Encode, URL decode

## Request header

Identifies requests that use a specific header in the request.

#### Required fields

Header name | Operator | Header value | Case transform
------------|----------|--------------|---------------
String | [Standard operator list](#standard-operator-list) | String, Int | Lowercase, Uppercase, Trim, Remove Whitespace, URL Encode, URL decode

## Request method

Identifies requests that use the specified request method.

#### Required fields

Operator | Supported values
---------|----------------
Equals, Not equals | GET, POST, PUT, DELETE, HEAD, OPTIONS, TRACE

#### Key information

- Only the GET request method can generate cached content in Azure Front Door. All other request methods are proxied through the network. 

## Request protocol

Identifies requests that use the specified protocol used.

#### Required fields

Operator | Supported values
---------|----------------
Equals, Not equals | HTTP, HTTPS

## Request URL

Identifies requests that match the specified URL.

#### Required fields

Operator | Request URL | Case transform
---------|-------------|---------------
[Standard operator list](#standard-operator-list) | String, Int | Lowercase, Uppercase, Trim, Remove Whitespace, URL Encode, URL decode

#### Key information

- When you use this rule condition, be sure to include protocol information. For example: *https://www.\<yourdomain\>.com*.

## Request file extension

Identifies requests that include the specified file extension in the file name in the requesting URL.

#### Required fields

Operator | Extension | Case transform
---------|-----------|---------------
[Standard operator list](#standard-operator-list) | String, Int | Lowercase, Uppercase, Trim, Remove Whitespace, URL Encode, URL decode

#### Key information

- For extension, don't include a leading period; for example, use *html* instead of *.html*.

## Request file name

Identifies requests that include the specified file name in the requesting URL.

#### Required fields

Operator | File name | Case transform
---------|-----------|---------------
[Standard operator list](#standard-operator-list) | String, Int | Lowercase, Uppercase, Trim, Remove Whitespace, URL Encode, URL decode

#### Key information

- To specify multiple file names, separate each file name by pressing ENTER. 

## Request path

Identifies requests that include the specified path in the requesting URL.

#### Required fields

Operator | Value | Case Transform
---------|-------|---------------
[Standard operator list](#standard-operator-list) | String, Int | Lowercase, Uppercase, Trim, Remove Whitespace, URL Encode, URL decode

## Standard operator list

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

- Learn how to set up your first [Rules Engine configuration](front-door-tutorial-rules-engine.md). 
- Learn more about [Rules Engine actions](front-door-rules-engine-actions.md)
- Learn more about [Azure Front Door Rules Engine](front-door-rules-engine.md)
