---
title: Azure API Management policies | Microsoft Docs
description: Learn about the policies available for use in Azure API Management.
services: api-management
documentationcenter: ''
author: vladvino
manager: cfowler
editor: ''
 
ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/19/2017
ms.author: apimpm
---
# API Management policies
This section provides a reference for the following API Management policies. For information on adding and configuring policies, see [Policies in API Management](api-management-howto-policies.md).  
  
 Policies are a powerful capability of the system that allow the publisher to change the behavior of the API through configuration. Policies are a collection of Statements that are executed sequentially on the request or response of an API. Popular Statements include format conversion from XML to JSON and call rate limiting to restrict the amount of incoming calls from a developer. Many more policies are available out of the box.  
  
 Policy expressions can be used as attribute values or text values in any of the API Management policies, unless the policy specifies otherwise. Some policies such as the [Control flow](api-management-advanced-policies.md#choose) and [Set variable](api-management-advanced-policies.md#set-variable) policies are based on policy expressions. For more information, see [Advanced policies](api-management-advanced-policies.md#AdvancedPolicies) and [Policy expressions](api-management-policy-expressions.md).  
  
##  <a name="ProxyPolicies"></a> Policies  
  
-   [Access restriction policies](api-management-access-restriction-policies.md#AccessRestrictionPolicies)  
    -   [Check HTTP header](api-management-access-restriction-policies.md#CheckHTTPHeader) - Enforces existence and/or value of a HTTP Header.  
    -   [Limit call rate by subscription](api-management-access-restriction-policies.md#LimitCallRate) - Prevents API usage spikes by limiting call rate, on a per subscription basis.  
    -   [Limit call rate by key](api-management-access-restriction-policies.md#LimitCallRateByKey) - Prevents API usage spikes by limiting call rate, on a per key basis.  
    -   [Restrict caller IPs](api-management-access-restriction-policies.md#RestrictCallerIPs) - Filters (allows/denies) calls from specific IP addresses and/or address ranges.  
    -   [Set usage quota by subscription](api-management-access-restriction-policies.md#SetUsageQuota) - Allows you to enforce a renewable or lifetime call volume and/or bandwidth quota, on a per subscription basis.  
    -   [Set usage quota by key](api-management-access-restriction-policies.md#SetUsageQuotaByKey) - Allows you to enforce a renewable or lifetime call volume and/or bandwidth quota, on a per key basis.  
    -   [Validate JWT](api-management-access-restriction-policies.md#ValidateJWT) - Enforces existence and validity of a JWT extracted from either a specified HTTP Header or a specified query parameter.  
-   [Advanced policies](api-management-advanced-policies.md#AdvancedPolicies)  
    -   [Control flow](api-management-advanced-policies.md#choose) - Conditionally applies policy statements based on the evaluation of Boolean expressions.  
    -   [Forward request](api-management-advanced-policies.md#ForwardRequest) - Forwards the request to the backend service.
    -   [Limit concurrency](api-management-advanced-policies.md#LimitConcurrency) - Prevents enclosed policies from executing by more than the specified number of requests at a time.
    -   [Log to Event Hub](api-management-advanced-policies.md#log-to-eventhub) - Sends messages in the specified format to a message target defined by a Logger entity.
    -   [Mock response](api-management-advanced-policies.md#mock-response) - Aborts pipeline execution and returns a mocked response directly to the caller.
    -   [Retry](api-management-advanced-policies.md#Retry) - Retries execution of the enclosed policy statements, if and until the condition is met. Execution will repeat at the specified time intervals and up to the specified retry count.  
    -   [Return response](api-management-advanced-policies.md#ReturnResponse) - Aborts pipeline execution and returns the specified response directly to the caller.  
    -   [Send one way request](api-management-advanced-policies.md#SendOneWayRequest) - Sends a request to the specified URL without waiting for a response.  
    -   [Send request](api-management-advanced-policies.md#SendRequest) - Sends a request to the specified URL.
    -   [Set HTTP proxy](api-management-advanced-policies.md#SetHttpProxy) - Allows you to route forwarded requests via an HTTP proxy.
    -   [Set variable](api-management-advanced-policies.md#set-variable) - Persist a value in a named context variable for later access.  
    -   [Set request method](api-management-advanced-policies.md#SetRequestMethod) - Allows you to change the HTTP method for a request.  
    -   [Set status code](api-management-advanced-policies.md#SetStatus) - Changes the HTTP status code to the specified value.  
    -   [Trace](api-management-advanced-policies.md#Trace) - Adds a string into the [API Inspector](https://azure.microsoft.com/documentation/articles/api-management-howto-api-inspector/) output.  
    -   [Wait](api-management-advanced-policies.md#Wait) - Waits for enclosed [Send request](api-management-advanced-policies.md#SendRequest), [Get value from cache](api-management-caching-policies.md#GetFromCacheByKey), or [Control flow](api-management-advanced-policies.md#choose) policies to complete before proceeding.  
-   [Authentication policies](api-management-authentication-policies.md#AuthenticationPolicies)  
    -   [Authenticate with Basic](api-management-authentication-policies.md#Basic) - Authenticate with a backend service using Basic authentication.  
    -   [Authenticate with client certificate](api-management-authentication-policies.md#ClientCertificate) - Authenticate with a backend service using client certificates.  
    -   [Authenticate with managed identity](api-management-authentication-policies.md#ManagedIdentity) - Authenticate with a backend service using a [managed identity](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview).  
-   [Caching policies](api-management-caching-policies.md#CachingPolicies)  
    -   [Get from cache](api-management-caching-policies.md#GetFromCache) - Perform cache look up and return a valid cached response when available.  
    -   [Store to cache](api-management-caching-policies.md#StoreToCache) - Caches response according to the specified cache control configuration.  
    -   [Get value from cache](api-management-caching-policies.md#GetFromCacheByKey) - Retrieve a cached item by key.  
    -   [Store value in cache](api-management-caching-policies.md#StoreToCacheByKey) - Store an item in the cache by key.  
    -   [Remove value from cache](api-management-caching-policies.md#RemoveCacheByKey) - Remove an item in the cache by key.  
-   [Cross domain policies](api-management-cross-domain-policies.md#CrossDomainPolicies)  
    -   [Allow cross-domain calls](api-management-cross-domain-policies.md#AllowCrossDomainCalls) - Makes the API accessible from Adobe Flash and Microsoft Silverlight browser-based clients.  
    -   [CORS](api-management-cross-domain-policies.md#CORS) - Adds cross-origin resource sharing (CORS) support to an operation or an API to allow cross-domain calls from browser-based clients.  
    -   [JSONP](api-management-cross-domain-policies.md#JSONP) - Adds JSON with padding (JSONP) support to an operation or an API to allow cross-domain calls from JavaScript browser-based clients.  
-   [Transformation policies](api-management-transformation-policies.md#TransformationPolicies)  
    -   [Convert JSON to XML](api-management-transformation-policies.md#ConvertJSONtoXML) - Converts request or response body from JSON to XML.  
    -   [Convert XML to JSON](api-management-transformation-policies.md#ConvertXMLtoJSON) - Converts request or response body from XML to JSON.  
    -   [Find and replace string in body](api-management-transformation-policies.md#Findandreplacestringinbody) - Finds a request or response substring and replaces it with a different substring.  
    -   [Mask URLs in content](api-management-transformation-policies.md#MaskURLSContent) - Re-writes (masks) links in the response body so that they point to the equivalent link via the gateway.  
    -   [Set backend service](api-management-transformation-policies.md#SetBackendService) - Changes the backend service for an incoming request.  
    -   [Set body](api-management-transformation-policies.md#SetBody) - Sets the message body for incoming and outgoing requests.  
    -   [Set HTTP header](api-management-transformation-policies.md#SetHTTPheader) - Assigns a value to an existing response and/or request header or adds a new response and/or request header.  
    -   [Set query string parameter](api-management-transformation-policies.md#SetQueryStringParameter) - Adds, replaces value of, or deletes request query string parameter.  
    -   [Rewrite URL](api-management-transformation-policies.md#RewriteURL) - Converts a request URL from its public form to the form expected by the web service.  
    -   [Transform XML using an XSLT](api-management-transformation-policies.md#XSLTransform) - Applies an XSL transformation to XML in the request or response body.  



## Next steps
For more information working with policies, see:

+ [Policies in API Management](api-management-howto-policies.md)
+ [Transform APIs](transform-api.md)
+ [Policy samples](policy-samples.md)	
