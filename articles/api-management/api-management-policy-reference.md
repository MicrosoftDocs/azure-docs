<properties 
	pageTitle="Azure API Management Policy Reference" 
	description="Learn about the policies available to configure API Management." 
	services="api-management" 
	documentationCenter="" 
	authors="steved0x" 
	manager="erikre" 
	editor=""/>

<tags 
	ms.service="api-management" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="08/09/2016" 
	ms.author="sdanie"/>

# Azure API Management Policy Reference

This section provides an index for the policies in the [API Management policy reference][]. For information on adding and configuring policies, see [Policies in API Management][].

Policy expressions can be used as attribute values or text values in any of the API Management policies, unless the policy specifies otherwise. Some policies such as the [Control flow][] and [Set variable][] policies are based on policy expressions. For more information, see [Advanced policies][] and [Policy expressions][]

## Policy reference index

-	[Access restriction policies][]
	-	[Check HTTP header][] - Enforces existence and/or value of a HTTP Header.
	-	[Limit call rate by subscription][] - Prevents API usage spikes by limiting call rate, on a per subscription basis.
	-	[Limit call rate by key](https://msdn.microsoft.com/library/azure/dn894078.aspx#LimitCallRateByKey) - Prevents API usage spikes by limiting call rate, on a per key basis.
	-	[Restrict caller IPs][] - Filters (allows/denies) calls from specific IP addresses and/or address ranges.
	-	[Set usage quota by subscription][] - Allows you to enforce a renewable or lifetime call volume and/or bandwidth quota, on a per subscription basis.
	-	[Set usage quota by key](https://msdn.microsoft.com/library/azure/dn894078.aspx#SetUsageQuotaByKey) - Allows you to enforce a renewable or lifetime call volume and/or bandwidth quota, on a per key basis.
	-	[Validate JWT][] - Enforces existence and validity of a JWT extracted from either a specified HTTP Header or a specified query parameter.
-	[Advanced policies][]
	-	[Control flow][] - Conditionally applies policy statements based on the results of the evaluation of Boolean [expressions][].
	-	[Forward request][] - Forwards the request to the backend service.
	-	[Log to Event Hub][] - Sends messages in the specified format to a message target defined by a [Logger](https://msdn.microsoft.com/library/azure/mt592020.aspx#Logger) entity.
	-	[Return response](https://msdn.microsoft.com/library/azure/dn894085.aspx#ReturnResponse) - Aborts pipeline execution and returns the specified response directly to the caller.
	-	[Send one way request](https://msdn.microsoft.com/library/azure/dn894085.aspx#SendOneWayRequest) - Sends a request to the specified URL without waiting for a response.
	-	[Send request](https://msdn.microsoft.com/library/azure/dn894085.aspx#SendRequest) - Sends a request to the specified URL.
	-	[Set request method](https://msdn.microsoft.com/library/azure/dn894085.aspx#SetRequestMethod) - Allows you to change the HTTP method for a request.
	-	[Set status](https://msdn.microsoft.com/library/azure/dn894085.aspx#SetStatus) - Changes the HTTP status code to the specified value.
	-	[Set variable][] - Persist a value in a named [context][] variable for later access.
	-	[Wait](https://msdn.microsoft.com/library/azure/dn894085.aspx#Wait) - Waits for enclosed Send request, Get value from cache, or Control flow policies to complete before proceeding.
-	[Authentication policies][]
	-	[Authenticate with Basic][] - Authenticate with a backend service using Basic authentication.
	-	[Authenticate with client certificate][] - Authenticate with a backend service using client certificates.
-	[Caching policies][] 
	-	[Get from cache][] - Perform cache look up and return a valid cached response when available.
	-	[Store to cache][] - Caches response according to the specified cache control configuration.
	-	[Get value from cache](https://msdn.microsoft.com/library/azure/dn894086.aspx#GetFromCacheByKey) - Retrieve a cached item by key.
	-	[Store value in cache](https://msdn.microsoft.com/library/azure/dn894086.aspx#StoreToCacheByKey) - Store an item in the cache by key.
-	[Cross domain policies][] 
	-	[Allow cross-domain calls][] - Makes the API accessible from Adobe Flash and Microsoft Silverlight browser-based clients.
	-	[CORS][] - Adds cross-origin resource sharing (CORS) support to an operation or an API to allow cross-domain calls from browser-based clients.
	-	[JSONP][] - Adds JSON with padding (JSONP) support to an operation or an API to allow cross-domain calls from JavaScript browser-based clients.
-	[Transformation policies][] 
	-	[Convert JSON to XML][] - Converts request or response body from JSON to XML.
	-	[Convert XML to JSON][] - Converts request or response body from XML to JSON.
	-	[Find and replace string in body][] - Finds a request or response substring and replaces it with a different substring.
	-	[Mask URLs in content][] - Re-writes (masks) links in the response body so that they point to the equivalent link via the gateway.
	-	[Set backend service][] - Changes the backend service for an incoming request.
	-	[Set body][] - Sets the message body for incoming and outgoing requests.
	-	[Set HTTP header][] - Assigns a value to an existing response and/or request header or adds a new response and/or request header.
	-	[Set query string parameter][] - Adds, replaces value of, or deletes request query string parameter.
	-	[Rewrite URL][] - Converts a request URL from its public form to the form expected by the web service.

## Next steps

For more information on policy expressions, see the following video.

> [AZURE.VIDEO policy-expressions-in-azure-api-management]

[Access restriction policies]: https://msdn.microsoft.com/library/azure/dn894078.aspx
[Check HTTP header]: https://msdn.microsoft.com/library/azure/034febe3-465f-4840-9fc6-c448ef520b0f#CheckHTTPHeader
[Limit call rate by subscription]: https://msdn.microsoft.com/library/azure/034febe3-465f-4840-9fc6-c448ef520b0f#LimitCallRate
[Restrict caller IPs]: https://msdn.microsoft.com/library/azure/034febe3-465f-4840-9fc6-c448ef520b0f#RestrictCallerIPs
[Set usage quota by subscription]: https://msdn.microsoft.com/library/azure/034febe3-465f-4840-9fc6-c448ef520b0f#SetUsageQuota
[Validate JWT]: https://msdn.microsoft.com/library/azure/034febe3-465f-4840-9fc6-c448ef520b0f#ValidateJWT

[Advanced policies]: https://msdn.microsoft.com/library/azure/dn894085.aspx
[Control flow]: https://msdn.microsoft.com/library/azure/dn894085.aspx#choose
[Set variable]: https://msdn.microsoft.com/library/azure/dn894085.aspx#set_variable
[expressions]: https://msdn.microsoft.com/library/azure/dn910913.aspx
[context]: https://msdn.microsoft.com/library/azure/ea160028-fc04-4782-aa26-4b8329df3448#ContextVariables
[Forward request]: https://msdn.microsoft.com/library/azure/dn894085.aspx#ForwardRequest
[Log to Event Hub]: https://msdn.microsoft.com/library/azure/dn894085.aspx#log-to-eventhub

[Authentication policies]: https://msdn.microsoft.com/library/azure/dn894079.aspx
[Authenticate with Basic]: https://msdn.microsoft.com/library/azure/061702a7-3a78-472b-a54a-f3b1e332490d#Basic
[Authenticate with client certificate]: https://msdn.microsoft.com/library/azure/061702a7-3a78-472b-a54a-f3b1e332490d#ClientCertificate
[Caching policies]: https://msdn.microsoft.com/library/azure/dn894086.aspx
[Get from cache]: https://msdn.microsoft.com/library/azure/8147199c-24d8-439f-b2a9-da28a70a890c#GetFromCache
[Store to cache]: https://msdn.microsoft.com/library/azure/8147199c-24d8-439f-b2a9-da28a70a890c#StoreToCache

[Cross domain policies]: https://msdn.microsoft.com/library/azure/dn894084.aspx
[Allow cross-domain calls]: https://msdn.microsoft.com/library/azure/7689d277-8abe-472a-a78c-e6d4bd43455d#AllowCrossDomainCalls
[CORS]: https://msdn.microsoft.com/library/azure/7689d277-8abe-472a-a78c-e6d4bd43455d#CORS
[JSONP]: https://msdn.microsoft.com/library/azure/7689d277-8abe-472a-a78c-e6d4bd43455d#JSONP

[Transformation policies]: https://msdn.microsoft.com/library/azure/dn894083.aspx
[Convert JSON to XML]: https://msdn.microsoft.com/library/azure/7406a8ce-5f9c-4fae-9b0f-e574befb2ee9#ConvertJSONtoXML
[Convert XML to JSON]: https://msdn.microsoft.com/library/azure/7406a8ce-5f9c-4fae-9b0f-e574befb2ee9#ConvertXMLtoJSON
[Find and replace string in body]: https://msdn.microsoft.com/library/azure/7406a8ce-5f9c-4fae-9b0f-e574befb2ee9#Findandreplacestringinbody
[Mask URLs in content]: https://msdn.microsoft.com/library/azure/7406a8ce-5f9c-4fae-9b0f-e574befb2ee9#MaskURLSContent
[Set backend service]: https://msdn.microsoft.com/library/azure/7406a8ce-5f9c-4fae-9b0f-e574befb2ee9#SetBackendService
[Set body]: https://msdn.microsoft.com/library/azure/dn894083.aspx#SetBody
[Set HTTP header]: https://msdn.microsoft.com/library/azure/7406a8ce-5f9c-4fae-9b0f-e574befb2ee9#SetHTTPheader
[Set query string parameter]: https://msdn.microsoft.com/library/azure/7406a8ce-5f9c-4fae-9b0f-e574befb2ee9#SetQueryStringParameter
[Rewrite URL]: https://msdn.microsoft.com/library/azure/7406a8ce-5f9c-4fae-9b0f-e574befb2ee9#RewriteURL



[Policies in API Management]: api-management-howto-policies.md
[API Management policy reference]: https://msdn.microsoft.com/library/azure/dn894081.aspx

[Policy expressions]: https://msdn.microsoft.com/library/azure/dn910913.aspx

 
