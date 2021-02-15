---
title: Configure Azure Front Door Standard/Premium rule set match conditions
description: This article provides a list of the various match conditions available with Azure Front Door Standard/Premium rule set. 
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.date: 02/18/2021
ms.author: yuajia
---

# Azure Front Door Standard/Premium (Preview) Rule Set match conditions

> [!Note]
> This documentation is for Azure Front Door Standard/Premium (Preview). Looking for information on Azure Front Door? View [here](../front-door-overview.md).

This tutorial shows you how to create a Rule Set with your first set of rules in the Azure portal. In Azure Front Door Standard/Premium [Rule Set](concept-rule-set.md), a rule consists of zero or more match conditions and an action. This article provides detailed descriptions of the match conditions you can use in Azure Front Door Standard/Premium Rule Set.

The first part of a rule is a match condition or set of match conditions. A rule can consist of up to 10 match conditions. A match condition identifies specific types of requests for which defined actions are done. If you use multiple match conditions, the match conditions are grouped together by using AND logic. For all match conditions that support multiple values (noted as "space-separated"), the "OR" operator is assumed.

For example, you can use a match condition to:

* Filter requests based on a specific IP address, country, or region.
* Filter requests by header information.
* Filter requests from mobile devices or desktop devices.
* Filter requests from request file name and file extension.
* Filter requests from request URL, protocol, path, query string, post args, etc.

> [!IMPORTANT]
> Azure Front Door Standard/Premium (Preview) is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

The following match conditions are available to use in Azure Front Door Standard/Premium Rules Set:

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
String | [Operator list](#operator-list) | String, Int | Lowercase, Uppercase

## Query string

Identifies requests that contain a specific query string parameter. This parameter is set to a value that matches a specific pattern. Query string parameters (for example, **parameter=value**) in the request URL determine whether this condition is met. This match condition identifies a query string parameter by its name and accepts one or more values for the parameter value.

#### Required fields

Operator | Query string | Case Transform
---------|--------------|---------------
[Operator list](#operator-list) | String, Int | Lowercase, Uppercase

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

* Use CIDR notation.
* For multiple IP addresses and IP address blocks, 'OR' logic is operated.
    * **IPv4 example**: if you add two IP addresses *1.2.3.4* and *10.20.30.40*, the condition is matched if any requests that arrive from either address 1.2.3.4 or 10.20.30.40.
    * **IPv6 example**:  if you add two IP addresses *1:2:3:4:5:6:7:8* and *10:20:30:40:50:60:70:80*, the condition is matched if any requests that arrive from either address 1:2:3:4:5:6:7:8 or 10:20:30:40:50:60:70:80.
* The syntax for an IP address block is the base IP address followed by a forward slash and the prefix size. For example:
    * **IPv4 example**: *5.5.5.64/26* matches any requests that arrive from addresses 5.5.5.64 through 5.5.5.127.
    * **IPv6 example**: *1:2:3:/48* matches any requests that arrive from addresses 1:2:3:0:0:0:0:0 through 1:2:3: ffff:ffff:ffff:ffff:ffff.

## Request body

Identifies requests based on specific text that appears in the body of the request.

#### Required fields

Operator | Request body | Case transform
---------|--------------|---------------
[Operator list](#operator-list) | String, Int | Lowercase, Uppercase

## Request header

Identifies requests that use a specific header in the request.

#### Required fields

Header name | Operator | Header value | Case transform
------------|----------|--------------|---------------
String | [Operator list](#operator-list) | String, Int | Lowercase, Uppercase

## Request method

Identifies requests that use the specified request method.

#### Required fields

Operator | Supported values
---------|----------------
Equals, Not equals | GET, POST, PUT, DELETE, HEAD, OPTIONS, TRACE

#### Key information

Only the GET request method can generate cached content in Azure Front Door. All other request methods are proxied through the network.

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
[Operator list](#operator-list) | String, Int | Lowercase, Uppercase

#### Key information

When you use this rule condition, be sure to include protocol information. For example: *https://www.\<yourdomain\>.com*.

## Request file extension

Identifies requests that include the specified file extension in the file name in the requesting URL.

#### Required fields

Operator | Extension | Case transform
---------|-----------|---------------
[Operator list](#operator-list)  | String, Int | Lowercase, Uppercase

#### Key information

For extension, don't include a leading period; for example, use *html* instead of *.html*.

## Request file name

Identifies requests that include the specified file name in the requesting URL.

#### Required fields

Operator | File name | Case transform
---------|-----------|---------------
[Operator list](#operator-list)| String, Int | Lowercase, Uppercase

## Request path

Identifies requests that include the specified path in the requesting URL.

#### Required fields

Operator | Value | Case Transform
---------|-------|---------------
[Operator list](#operator-list) | String, Int | Lowercase, Uppercase

## <a name = "operator-list"></a>Operator list

For rules that accept values from the standard operator list, the following operators are valid:

* Any
* Equals
* Contains
* Begins with
* Ends with
* Less than
* Less than or equals
* Greater than
* Greater than or equals
* Not any
* Not contains
* Not begins with
* Not ends with
* Not less than
* Not less than or equals
* Not greater than
* Not greater than or equals
* Regular Expression

For numeric operators like *Less than* and *Greater than or equals*, the comparison used is based on length. The value in the match condition should be an integer that equals the length you want to compare.

## Regular Expression

Regex doesn't support the following operations:

* Backreferences and capturing subexpressions
* Arbitrary zero-width assertions
* Subroutine references and recursive patterns
* Conditional patterns
* Backtracking control verbs
* The \C single-byte directive
* The \R newline match directive
* The \K start of match reset directive
* Callouts and embedded code
* Atomic grouping and possessive quantifiers

## Next steps

* Learn more about [Rule Set](concept-rule-set.md).
* Learn how to [configure your first Rules Set](how-to-configure-rule-set.md).
* Learn more about [Rule Set actions](concept-rule-set-actions.md).
