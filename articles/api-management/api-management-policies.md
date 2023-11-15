---
title: Azure API Management policy reference | Microsoft Docs
description: Reference index for all Azure API Management policies and settings. Policies allow the API publisher to change API behavior through configuration.
services: api-management
author: dlepow
ms.service: api-management
ms.topic: article
ms.date: 12/01/2022
ms.author: danlep
---

# API Management policy reference
This section provides links to reference articles for all API Management policies.

More information about policies:

+ [Policy overview](api-management-howto-policies.md)
+ [Set or edit policies](set-edit-policies.md)
+ [Policy expressions](api-management-policy-expressions.md)

> [!IMPORTANT]
>  [Limit call rate by subscription](rate-limit-policy.md) and [Set usage quota by subscription](quota-policy.md) have a dependency on the subscription key. A subscription key isn't required when other policies are applied.

## Access restriction policies
-   [Check HTTP header](check-header-policy.md) - Enforces existence and/or value of an HTTP Header.
- [Get authorization context](get-authorization-context-policy.md) - Gets the authorization context of a specified [connection](credentials-overview.md) to a credential provider configured in the API Management instance.
-   [Limit call rate by subscription](rate-limit-policy.md) - Prevents API usage spikes by limiting call rate, on a per subscription basis.
-   [Limit call rate by key](rate-limit-by-key-policy.md) - Prevents API usage spikes by limiting call rate, on a per key basis.
-   [Restrict caller IPs](ip-filter-policy.md) - Filters (allows/denies) calls from specific IP addresses and/or address ranges.
-   [Set usage quota by subscription](quota-policy.md) - Allows you to enforce a renewable or lifetime call volume and/or bandwidth quota, on a per subscription basis.
-   [Set usage quota by key](quota-by-key-policy.md) - Allows you to enforce a renewable or lifetime call volume and/or bandwidth quota, on a per key basis.
-    [Validate Microsoft Entra token](validate-azure-ad-token-policy.md) - Enforces existence and validity of a Microsoft Entra JWT extracted from either a specified HTTP header, query parameter, or token value.
-   [Validate JWT](validate-jwt-policy.md) - Enforces existence and validity of a JWT extracted from either a specified HTTP Header, query parameter, or token value.
-   [Validate client certificate](validate-client-certificate-policy.md) - Enforces that a certificate presented by a client to an API Management instance matches specified validation rules and claims.

## Advanced policies
-   [Control flow](choose-policy.md) - Conditionally applies policy statements based on the results of the evaluation of Boolean [expressions](api-management-policy-expressions.md).
-   [Emit metrics](emit-metric-policy.md) - Sends custom metrics to Application Insights at execution.
-   [Forward request](forward-request-policy.md) - Forwards the request to the backend service.
-   [Include fragment](include-fragment-policy.md) - Inserts a policy fragment in the policy definition.
-   [Limit concurrency](limit-concurrency-policy.md) - Prevents enclosed policies from executing by more than the specified number of requests at a time.
-   [Log to event hub](log-to-eventhub-policy.md) - Sends messages in the specified format to an event hub defined by a Logger entity.
-   [Mock response](mock-response-policy.md) - Aborts pipeline execution and returns a mocked response directly to the caller.
-   [Retry](retry-policy.md) - Retries execution of the enclosed policy statements, if and until the condition is met. Execution will repeat at the specified time intervals and up to the specified retry count.
-   [Return response](return-response-policy.md) - Aborts pipeline execution and returns the specified response directly to the caller.
-   [Send one way request](send-one-way-request-policy.md) - Sends a request to the specified URL without waiting for a response.
-   [Send request](send-request-policy.md) - Sends a request to the specified URL.
-   [Set HTTP proxy](proxy-policy.md) - Allows you to route forwarded requests via an HTTP proxy.
-   [Set request method](set-method-policy.md) - Allows you to change the HTTP method for a request.
-   [Set status code](set-status-policy.md) - Changes the HTTP status code to the specified value.
-   [Set variable](set-variable-policy.md) - Persists a value in a named [context](api-management-policy-expressions.md#ContextVariables) variable for later access.
-   [Trace](trace-policy.md) - Adds custom traces into the [request tracing](./api-management-howto-api-inspector.md) output in the test console, Application Insights telemetries, and resource logs.
-   [Wait](wait-policy.md) - Waits for enclosed [Send request](send-request-policy.md), [Get value from cache](cache-lookup-value-policy.md), or [Control flow](choose-policy.md) policies to complete before proceeding.

## Authentication policies
-   [Authenticate with Basic](authentication-basic-policy.md) - Authenticate with a backend service using Basic authentication.
-   [Authenticate with client certificate](authentication-certificate-policy.md) - Authenticate with a backend service using client certificates.
-   [Authenticate with managed identity](authentication-managed-identity-policy.md) - Authenticate with a backend service using a [managed identity](../active-directory/managed-identities-azure-resources/overview.md).

## Caching policies
-   [Get from cache](cache-lookup-policy.md) - Perform cache lookup and return a valid cached response when available.
-   [Store to cache](cache-store-policy.md) - Caches response according to the specified cache control configuration.
-   [Get value from cache](cache-lookup-value-policy.md) - Retrieve a cached item by key.
-   [Store value in cache](cache-store-value-policy.md) - Store an item in the cache by key.
-   [Remove value from cache](cache-remove-value-policy.md) - Remove an item in the cache by key.

## Cross-domain policies
- [Allow cross-domain calls](cross-domain-policy.md) - Makes the API accessible from Adobe Flash and Microsoft Silverlight browser-based clients.
- [CORS](cors-policy.md) - Adds cross-origin resource sharing (CORS) support to an operation or an API to allow cross-domain calls from browser-based clients.
- [JSONP](jsonp-policy.md) - Adds JSON with padding (JSONP) support to an operation or an API to allow cross-domain calls from JavaScript browser-based clients.

## Dapr integration policies
-  [Send request to a service](set-backend-service-dapr-policy.md): Uses Dapr runtime to locate and reliably communicate with a Dapr microservice. To learn more about service invocation in Dapr, see the description in this [README](https://github.com/dapr/docs/blob/master/README.md#service-invocation) file.
-  [Send message to Pub/Sub topic](publish-to-dapr-policy.md): Uses Dapr runtime to publish a message to a Publish/Subscribe topic. To learn more about Publish/Subscribe messaging in Dapr, see the description in this [README](https://github.com/dapr/docs/blob/master/README.md) file.
-  [Trigger output binding](invoke-dapr-binding-policy.md): Uses Dapr runtime to invoke an external system via output binding. To learn more about bindings in Dapr, see the description in this [README](https://github.com/dapr/docs/blob/master/README.md) file.

## GraphQL resolver policies
- [Azure SQL data source for resolver](sql-data-source-policy.md) - Configures the Azure SQL request and optional response to resolve data for an object type and field in a GraphQL schema.
- [Cosmos DB data source for resolver](cosmosdb-data-source-policy.md) - Configures the Cosmos DB request and optional response to resolve data for an object type and field in a GraphQL schema.
- [HTTP data source for resolver](http-data-source-policy.md) - Configures the HTTP request and optionally the HTTP response to resolve data for an object type and field in a GraphQL schema.
- [Publish event to GraphQL subscription](publish-event-policy.md) - Publishes an event to one or more subscriptions specified in a GraphQL API schema. Configure the policy in a GraphQL resolver for a related field in the schema for another operation type such as a mutation. 

## Transformation policies
-   [Convert JSON to XML](json-to-xml-policy.md) - Converts request or response body from JSON to XML.
-   [Convert XML to JSON](xml-to-json-policy.md) - Converts request or response body from XML to JSON.
-   [Find and replace string in body](find-and-replace-policy.md) - Finds a request or response substring and replaces it with a different substring.
-   [Mask URLs in content](redirect-content-urls-policy.md) - Rewrites (masks) links in the response body so that they point to the equivalent link via the gateway.
-   [Set backend service](set-backend-service-policy.md) - Changes the backend service for an incoming request.
- [Set body](set-body-policy.md) - Sets the message body for a request or response.
-   [Set HTTP header](set-header-policy.md) - Assigns a value to an existing response and/or request header or adds a new response and/or request header.
-   [Set query string parameter](set-query-parameter-policy.md) - Adds, replaces value of, or deletes request query string parameter.
-   [Rewrite URL](rewrite-uri-policy.md) - Converts a request URL from its public form to the form expected by the web service.
-   [Transform XML using an XSLT](xsl-transform-policy.md) - Applies an XSL transformation to XML in the request or response body.

## Validation policies

- [Validate content](validate-content-policy.md) - Validates the size or content of a request or response body against one or more API schemas. The supported schema formats are JSON and XML.
- [Validate GraphQL request](validate-graphql-request-policy.md) - Validates and authorizes a request to a GraphQL API. 
- [Validate OData request](validate-odata-request-policy.md) - Validates a request to an OData API to ensure conformance with the OData specification.
- [Validate parameters](validate-parameters-policy.md) - Validates the request header, query, or path parameters against the API schema.
- [Validate headers](validate-headers-policy.md) - Validates the response headers against the API schema.
- [Validate status code](validate-status-code-policy.md) - Validates the HTTP status codes in responses against the API schema.
## Next steps

For more information about working with policies, see:

+ [Tutorial: Transform and protect your API](transform-api.md)
+ [Set or edit policies](set-edit-policies.md)
+ [Policy snippets repo](https://github.com/Azure/api-management-policy-snippets)	
