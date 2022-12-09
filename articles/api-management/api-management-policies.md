---
title: Azure API Management policy reference | Microsoft Docs
description: Reference index for all Azure API Management policies and settings. Policies allow the API publisher to change API behavior through configuration.
services: api-management
author: dlepow
ms.service: api-management
ms.topic: reference
ms.date: 03/04/2022
ms.author: danlep
---
# API Management policy reference
This section provides links to reference articles for all API Management policies.

More information about policies:

+ [Policy overview](api-management-howto-policies.md)
+ [Set or edit policies](set-edit-policies.md)
+ [Policy expressions](api-management-policy-expressions.md)

> [!IMPORTANT]
>  [Limit call rate by subscription](api-management-access-restriction-policies.md#LimitCallRate) and [Set usage quota by subscription](api-management-access-restriction-policies.md#SetUsageQuota) have a dependency on the subscription key. A subscription key isn't required when using other policies.


## Access restriction policies
-   [Check HTTP header](api-management-access-restriction-policies.md#CheckHTTPHeader) - Enforces existence and/or value of an HTTP Header.
- [Get authorization context](api-management-access-restriction-policies.md#GetAuthorizationContext) - Gets the authorization context of a specified [authorization](authorizations-overview.md) configured in the API Management instance.
-   [Limit call rate by subscription](api-management-access-restriction-policies.md#LimitCallRate) - Prevents API usage spikes by limiting call rate, on a per subscription basis.
-   [Limit call rate by key](api-management-access-restriction-policies.md#LimitCallRateByKey) - Prevents API usage spikes by limiting call rate, on a per key basis.
-   [Restrict caller IPs](api-management-access-restriction-policies.md#RestrictCallerIPs) - Filters (allows/denies) calls from specific IP addresses and/or address ranges.
-   [Set usage quota by subscription](api-management-access-restriction-policies.md#SetUsageQuota) - Allows you to enforce a renewable or lifetime call volume and/or bandwidth quota, on a per subscription basis.
-   [Set usage quota by key](api-management-access-restriction-policies.md#SetUsageQuotaByKey) - Allows you to enforce a renewable or lifetime call volume and/or bandwidth quota, on a per key basis.
-   [Validate Azure Active Directory Token](api-management-access-restriction-policies.md#ValidateAAD) - Enforces existence and validity of an Azure Active Directory JWT extracted from either a specified HTTP Header, query parameter, or token value.
-   [Validate JWT](api-management-access-restriction-policies.md#ValidateJWT) - Enforces existence and validity of a JWT extracted from either a specified HTTP Header, query parameter, or token value.
-   [Validate client certificate](api-management-access-restriction-policies.md#validate-client-certificate) - Enforces that a certificate presented by a client to an API Management instance matches specified validation rules and claims.

## Advanced policies
-   [Control flow](api-management-advanced-policies.md#choose) - Conditionally applies policy statements based on the evaluation of Boolean expressions.
-   [Forward request](api-management-advanced-policies.md#ForwardRequest) - Forwards the request to the backend service.
-   [Limit concurrency](api-management-advanced-policies.md#LimitConcurrency) - Prevents enclosed policies from executing by more than the specified number of requests at a time.
-   [Log to event hub](api-management-advanced-policies.md#log-to-eventhub) - Sends messages in the specified format to a message target defined by a Logger entity.
-   [Emit metrics](api-management-advanced-policies.md#emit-metrics) - Sends custom metrics to Application Insights at execution.
-   [Mock response](api-management-advanced-policies.md#mock-response) - Aborts pipeline execution and returns a mocked response directly to the caller.
-   [Retry](api-management-advanced-policies.md#Retry) - Retries execution of the enclosed policy statements, if and until the condition is met. Execution will repeat at the specified time intervals and up to the specified retry count.
-   [Return response](api-management-advanced-policies.md#ReturnResponse) - Aborts pipeline execution and returns the specified response directly to the caller.
-   [Send one way request](api-management-advanced-policies.md#SendOneWayRequest) - Sends a request to the specified URL without waiting for a response.
-   [Send request](api-management-advanced-policies.md#SendRequest) - Sends a request to the specified URL.
-   [Set HTTP proxy](api-management-advanced-policies.md#SetHttpProxy) - Allows you to route forwarded requests via an HTTP proxy.
-   [Set variable](api-management-advanced-policies.md#set-variable) - Persist a value in a named context variable for later access.
-   [Set request method](api-management-advanced-policies.md#SetRequestMethod) - Allows you to change the HTTP method for a request.
-   [Set status code](api-management-advanced-policies.md#SetStatus) - Changes the HTTP status code to the specified value.
-   [Trace](api-management-advanced-policies.md#Trace) - Adds custom traces into the [API Inspector](./api-management-howto-api-inspector.md) output, Application Insights telemetries, and Resource Logs.
-   [Wait](api-management-advanced-policies.md#Wait) - Waits for enclosed [Send request](api-management-advanced-policies.md#SendRequest), [Get value from cache](api-management-caching-policies.md#GetFromCacheByKey), or [Control flow](api-management-advanced-policies.md#choose) policies to complete before proceeding.

## Authentication policies
-   [Authenticate with Basic](api-management-authentication-policies.md#Basic) - Authenticate with a backend service using Basic authentication.
-   [Authenticate with client certificate](api-management-authentication-policies.md#ClientCertificate) - Authenticate with a backend service using client certificates.
-   [Authenticate with managed identity](api-management-authentication-policies.md#ManagedIdentity) - Authenticate with a backend service using a [managed identity](../active-directory/managed-identities-azure-resources/overview.md).

## Caching policies
-   [Get from cache](api-management-caching-policies.md#GetFromCache) - Perform cache lookup and return a valid cached response when available.
-   [Store to cache](api-management-caching-policies.md#StoreToCache) - Caches response according to the specified cache control configuration.
-   [Get value from cache](api-management-caching-policies.md#GetFromCacheByKey) - Retrieve a cached item by key.
-   [Store value in cache](api-management-caching-policies.md#StoreToCacheByKey) - Store an item in the cache by key.
-   [Remove value from cache](api-management-caching-policies.md#RemoveCacheByKey) - Remove an item in the cache by key.

## Cross-domain policies
-   [Allow cross-domain calls](api-management-cross-domain-policies.md#AllowCrossDomainCalls) - Makes the API accessible from Adobe Flash and Microsoft Silverlight browser-based clients.
-   [CORS](api-management-cross-domain-policies.md#CORS) - Adds cross-origin resource sharing (CORS) support to an operation or an API to allow cross-domain calls from browser-based clients.
-   [JSONP](api-management-cross-domain-policies.md#JSONP) - Adds JSON with padding (JSONP) support to an operation or an API to allow cross-domain calls from JavaScript browser-based clients.

## Dapr integration policies
- [Send request to a service](api-management-dapr-policies.md#invoke) - uses Dapr runtime to locate and reliably communicate with a Dapr microservice.
-  [Send message to Pub/Sub topic](api-management-dapr-policies.md#pubsub) - uses Dapr runtime to publish a message to a Publish/Subscribe topic.
-  [Trigger output binding](api-management-dapr-policies.md#bind) - uses Dapr runtime to invoke an external system via output binding.

## GraphQL API policies
- [Validate GraphQL request](graphql-policies.md#validate-graphql-request) - Validates and authorizes a request to a GraphQL API.
- [Set GraphQL resolver](graphql-policies.md#set-graphql-resolver) - Retrieves or sets data for a GraphQL field in an object type specified in a GraphQL schema.

## Transformation policies
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

## Validation policies
- [Validate content](validation-policies.md#validate-content) - Validates the size or JSON schema of a request or response body against the API schema.
- [Validate parameters](validation-policies.md#validate-parameters) - Validates the request header, query, or path parameters against the API schema.
- [Validate headers](validation-policies.md#validate-headers) - Validates the response headers against the API schema.
- [Validate status code](validation-policies.md#validate-status-code) - Validates the HTTP status codes in responses against the API schema.

## Next steps

For more information about working with policies, see:

+ [Tutorial: Transform and protect your API](transform-api.md)
+ [Set or edit policies](set-edit-policies.md)
+ [Policy samples](./policies/index.md)	
