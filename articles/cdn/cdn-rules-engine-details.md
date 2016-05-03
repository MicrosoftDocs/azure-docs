<properties
	pageTitle="Azure Content Delivery Network (CDN) Rules Engine Match Condition and Feature Details"
	description="This topic lists detailed descriptions of the available Match Conditions and Features for Azure Content Delivery Network (CDN) Rules Engine."
	services="cdn"
	documentationCenter=""
	authors="camsoper"
	manager="erikre"
	editor=""/>

<tags
	ms.service="cdn"
	ms.workload="media"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="02/25/2016" 
	ms.author="casoper"/>


# CDN Rules Engine Match Condition and Feature Details

This topic lists detailed descriptions of the available match conditions and features for Azure Content Delivery Network (CDN) [Rules Engine](cdn-rules-engine.md).

> [AZURE.NOTE] The Rules Engine requires the Premium CDN tier.  For more information on the features of the Standard and Premium CDN tiers, see [Overview of the Azure Content Delivery Network](cdn-overview.md).

## Match conditions

A match condition identifies specific types of requests for which a set of features will be performed.

For example, it may be used to filter requests for content at a particular location, requests generated from a particular IP address or country, or by header information.

### Always

The Always match condition is designed to apply a default set of features to all requests.

### Device

The Device match condition identifies requests made from a mobile device based on its properties.

### Location

These match conditions are designed to identify requests based on the requester's location.

Name | Purpose
-----|--------
AS Number | Identifies requests that originate from a particular network.
Country | Identifies requests that originate from the specified countries.


### Origin

These match conditions are designed to identify requests that point to CDN storage or a customer origin server.

Name | Purpose
-----|--------
CDN Origin | Identifies requests for content stored on CDN storage.
Customer Origin | Identifies requests for content stored on a specific customer origin server.


### Request

These match conditions are designed to identify requests based on their properties.

Name | Purpose
-----|--------
Client IP Address | Identifies requests that originate from a particular IP address.
Cookie Parameter | Checks the cookies associated with each request for the specified value.
Cookie Parameter Regex | Checks the cookies associated with each request for the specified regular expression.
Edge Cname | Identifies requests that point to a specific edge CNAME.
Referring Domain | Identifies requests that were referred from the specified hostname(s).
Request Header Literal | Identifies requests that contain the specified header set to a specified value(s).
Request Header Regex | Identifies requests that contain the specified header set to a value that matches the specified regular expression.
Request Header Wildcard | Identifies requests that contain the specified header set to a value that matches the specified pattern.
Request Method | Identifies requests by their HTTP method.
Request Scheme | Identifies requests by their HTTP protocol.

### URL

These match conditions are designed to identify requests based on their URLs.

Name | Purpose
-----|--------
URL Path Directory | Identifies requests by their relative path.
URL Path Extension | Identifies requests by their filename extension.
URL Path Filename | Identifies requests by their filename.
URL Path Literal | Compares a request's relative path to the specified value.
URL Path Regex | Compares a request's relative path to the specified regular expression.
URL Path Wildcard | Compares a request's relative path to the specified pattern.
URL Query Literal | Compares a request's query string to the specified value.
URL Query Parameter | Identifies requests that contain the specified query string parameter set to a value that matches a specified pattern.
URL Query Regex | Identifies requests that contain the specified query string parameter set to a value that matches a specified regular expression.
URL Query Wildcard | Compares the specified value(s) against the request's query string.

## Features

A feature defines the type of action that will be applied to the type of request identified by a set of match conditions.

### Access

These features are designed to control access to content.

> [AZURE.NOTE] Token auth is not generally available yet, but will be supported in a future release.

Name | Purpose
-----|--------
Deny Access | Determines whether all requests are rejected with a 403 Forbidden response.
Token Auth | Determines whether Token-Based Authentication will be applied to a request.
Token Auth Denial Code | Determines the type of response that will be returned to a user when a request is denied due to Token-Based Authentication.
Token Auth Ignore URL Case | Determines whether URL comparisons made by Token-Based Authentication will be case-sensitive.
Token Auth Parameter | Determines whether the Token-Based Authentication query string parameter should be renamed.

### Caching

These features are designed to customize when and how content is cached.

Name | Purpose
-----|--------
Bandwidth Parameters | Determines whether bandwidth throttling parameters (i.e., ec_rate and ec_prebuf) will be active.
Bandwidth Throttling | Throttles the bandwidth for the response provided by our edge servers.
Bypass Cache | Determines whether the request can leverage our caching technology.
Cache-Control Header Treatment | Controls the generation of Cache-Control headers by the edge server when External Max-Age feature is active.
Cache-Key Query String | Determines whether the cache-key will include or exclude query string parameters associated with a request.
Cache-Key Rewrite | Rewrites the cache-key associated with a request.
Complete Cache Fill | Determines what happens when a request results in a partial cache miss on an edge server.
Compress File Types | Defines the file formats that will be compressed on the server.
Default Internal Max-Age | Determines the default max-age interval for edge server to origin server cache revalidation.
Expires Header Treatment | Controls the generation of Expires headers by an edge server when the External Max-Age feature is active.
External Max-Age | Determines the max-age interval for browser to edge server cache revalidation.
Force Internal Max-Age | Determines the max-age interval for edge server to origin server cache revalidation.
H.264 Support (HTTP Progressive Download) | Determines the types of H.264 file formats that may be used to stream content.
Honor No-Cache Request | Determines whether an HTTP client's no-cache requests will be forwarded to the origin server.
Ignore Origin No-Cache | Determines whether our CDN will ignore certain directives served from an origin server.
Ignore Unsatisfiable Ranges | Determines the response that will be returned to clients when a request generates a 416 Requested Range Not Satisfiable status code.
Internal Max-Stale | Controls how long past the normal expiration time a cached asset may be served from an edge server when the edge server is unable to revalidate the cached asset with the origin server.
Partial Cache Sharing | Determines whether a request can generate partially cached content.
Prevalidate Cached Content | Determines whether cached content will be eligible for early revalidation before its TTL expires.
Refresh Zero-Byte Cache Files | Determines how an HTTP client's request for a 0-byte cache asset is handled by our edge servers.
Set Cacheable Status Codes | Defines the set of status codes that can result in cached content.
Stale Content Delivery on Error | Determines whether expired cached content will be delivered when an error occurs during cache revalidation or when retrieving the requested content from the customer origin server.
Stale While Revalidate | Improves performance by allowing our edge servers to serve stale client to the requester while revalidation takes place.
Comment | The Comment feature allows a note to be added within a rule.

### Headers

These features are designed to add, modify, or delete headers from the request or response.

Name | Purpose
-----|--------
Age Response Header | Determines whether an Age response header will be included in the response sent to the requester.
Debug Cache Response Headers | Determines whether a response may include the X-EC-Debug response header which provides information on the cache policy for the requested asset.
Modify Client Request Header | Overwrites, appends, or deletes a header from a request.
Modify Client Response Header | Overwrites, appends, or deletes a header from a response.
Set Client IP Custom Header | Allows the IP address of the requesting client to be added to the request as a custom request header.

### Logs

These features are designed to customize the data stored in raw log files.

Name | Purpose
-----|--------
Custom Log Field 1 | Determines the format and the content that will be assigned to the custom log field in a raw log file.
Log Query String | Determines whether a query string will be stored along with the URL in access logs.

### Optimize

These features determine whether a request will undergo the optimizations provided by Edge Optimizer.

Name | Purpose
-----|--------
Edge Optimizer | Determines whether Edge Optimizer can be applied to a request.
Edge Optimizer – Instantiate Configuration | Instantiates or activates the Edge Optimizer configuration associated with a site.


### Origin

These features are designed to control how the CDN communicates with an origin server.

Name | Purpose
-----|--------
Maximum Keep-Alive Requests | Defines the maximum number of requests for a Keep-Alive connection before it is closed.
Proxy Special Headers | Defines the set of CDN-specific request headers that will be forwarded from an edge server to an origin server.

### Specialty

These features provide advanced functionality that should only be used by advanced users.

Name | Purpose
-----|--------
Cacheable HTTP Methods | Determines the set of additional HTTP methods that can be cached on our network.
Cacheable Request Body Size | Defines the threshold for determining whether a POST response can be cached.


### URL

These features allow a request to be redirected or rewritten to a different URL.

Name | Purpose
-----|--------
Follow Redirects | Determines whether requests can be redirected to the hostname defined in the Location header returned by a customer origin server.
URL Redirect | Redirects requests via the Location header.
URL Rewrite  | Rewrites the request URL.

### Web Application Firewall

The Web Application Firewall feature determines whether a request will be screened by Web Application Firewall.

## See also
* [Azure CDN Overview](cdn-overview.md)
* [Overriding default HTTP behavior using the rules engine](cdn-rules-engine.md)
