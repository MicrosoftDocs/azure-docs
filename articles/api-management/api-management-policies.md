---
title: Azure API Management policy reference | Microsoft Docs
description: Reference index for all Azure API Management policies and settings. Policies allow the API publisher to change API behavior through configuration.
services: api-management
author: dlepow
ms.service: api-management
ms.custom:
  - build-2024
ms.topic: article
ms.date: 05/03/2024
ms.author: danlep
---

# API Management policy reference

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

This section provides brief descriptions and links to reference articles for all API Management policies. The API Management [gateways](api-management-gateways-overview.md) that support each policy are indicated. For detailed policy settings and examples, see the linked reference articles.

More information about policies:

+ [Policy overview](api-management-howto-policies.md)
+ [Set or edit policies](set-edit-policies.md)
+ [Policy expressions](api-management-policy-expressions.md)
+ [Author policies using Microsoft Copilot in Azure](../copilot/author-api-management-policies.md?toc=%2Fazure%2Fapi-management%2Ftoc.json&bc=/azure/api-management/breadcrumb/toc.json)

> [!IMPORTANT]
>  [Limit call rate by subscription](rate-limit-policy.md) and [Set usage quota by subscription](quota-policy.md) have a dependency on the subscription key. A subscription key isn't required when other policies are applied.

## Rate limiting and quotas

|Policy  |Description  |Classic | V2  | Consumption     | Self-hosted |
|---------|---------|---------|---------|---------|--------|
| [Limit call rate by subscription](rate-limit-policy.md) | Prevents API usage spikes by limiting call rate, on a per subscription basis. | Yes | Yes | Yes | Yes |
| [Limit call rate by key](rate-limit-by-key-policy.md) | Prevents API usage spikes by limiting call rate, on a per key basis. | Yes | Yes | No | Yes | 
| [Set usage quota by subscription](quota-policy.md) | Allows you to enforce a renewable or lifetime call volume and/or bandwidth quota, on a per subscription basis. | Yes | Yes | Yes | Yes
| [Set usage quota by key](quota-by-key-policy.md) |  Allows you to enforce a renewable or lifetime call volume and/or bandwidth quota, on a per key basis. | Yes | No | No | Yes | 
| [Limit concurrency](limit-concurrency-policy.md) | Prevents enclosed policies from executing by more than the specified number of requests at a time. | Yes | Yes | Yes | Yes |
| [Limit Azure OpenAI Service token usage](azure-openai-token-limit-policy.md) | Prevents Azure OpenAI API usage spikes by limiting language model tokens per calculated key. | Yes | Yes | No | No |

## Authentication and authorization

|Policy  |Description  | Classic | V2  | Consumption |Self-hosted  |
|---------|---------|---------|---------|---------|--------|
| [Check HTTP header](check-header-policy.md) | Enforces existence and/or value of an HTTP header. | Yes | Yes | Yes | Yes |
| [Get authorization context](get-authorization-context-policy.md) | Gets the authorization context of a specified [connection](credentials-overview.md) to a credential provider configured in the API Management instance. | Yes | Yes | Yes | No |
| [Restrict caller IPs](ip-filter-policy.md) | Filters (allows/denies) calls from specific IP addresses and/or address ranges. | Yes | Yes | Yes | Yes |
| [Validate Microsoft Entra token](validate-azure-ad-token-policy.md) | Enforces existence and validity of a Microsoft Entra (formerly called Azure Active Directory) JWT extracted from either a specified HTTP header, query parameter, or token value. | Yes | Yes | Yes | Yes |
| [Validate JWT](validate-jwt-policy.md) | Enforces existence and validity of a JWT extracted from either a specified HTTP header, query parameter, or token value. | Yes | Yes | Yes | Yes |
| [Validate client certificate](validate-client-certificate-policy.md) |Enforces that a certificate presented by a client to an API Management instance matches specified validation rules and claims. | Yes | Yes | Yes | Yes |
| [Authenticate with Basic](authentication-basic-policy.md) | Authenticates with a backend service using Basic authentication. | Yes | Yes | Yes | Yes |
| [Authenticate with client certificate](authentication-certificate-policy.md) | Authenticates with a backend service using client certificates. | Yes | Yes | Yes | Yes |
| [Authenticate with managed identity](authentication-managed-identity-policy.md) | Authenticates with a backend service using a [managed identity](../active-directory/managed-identities-azure-resources/overview.md). | Yes | Yes | Yes | Yes |

## Content validation

|Policy  |Description  | Classic | V2  | Consumption |Self-hosted  |
|---------|---------|---------|---------|---------|--------|
| [Validate content](validate-content-policy.md) | Validates the size or content of a request or response body against one or more API schemas. The supported schema formats are JSON and XML. | Yes | Yes | Yes | Yes |
| [Validate GraphQL request](validate-graphql-request-policy.md) | Validates and authorizes a request to a GraphQL API. | Yes | Yes | Yes | Yes |
| [Validate OData request](validate-odata-request-policy.md) | Validates a request to an OData API to ensure conformance with the OData specification. | Yes | Yes | Yes | Yes |
| [Validate parameters](validate-parameters-policy.md) | Validates the request header, query, or path parameters against the API schema. | Yes | Yes | Yes | Yes |
| [Validate headers](validate-headers-policy.md) | Validates the response headers against the API schema. | Yes | Yes | Yes | Yes |
| [Validate status code](validate-status-code-policy.md) | Validates the HTTP status codes in responses against the API schema. | Yes | Yes | Yes | Yes |

## Routing

|Policy  |Description  | Classic | V2  | Consumption |Self-hosted  |
|---------|---------|---------|---------|---------|--------|
|  [Forward request](forward-request-policy.md) | Forwards the request to the backend service. | Yes | Yes | Yes | Yes |
|  [Set backend service](set-backend-service-policy.md) | Changes the backend service base URL of an incoming request to a URL or a [backend](backends.md). Referencing a backend resource allows you to manage the backend service base URL and other settings in a single place. Also implement [load balancing of traffic across a pool of backend services](backends.md#load-balanced-pool) and [circuit breaker rules](backends.md#circuit-breaker) to protect the backend from too many requests. | Yes | Yes | Yes | Yes |
|  [Set HTTP proxy](proxy-policy.md) | Allows you to route forwarded requests via an HTTP proxy. | Yes | Yes | Yes | Yes |

## Caching

|Policy  |Description  | Classic | V2  | Consumption |Self-hosted  |
|---------|---------|---------|---------|---------|--------|
|  [Get from cache](cache-lookup-policy.md) | Performs cache lookup and return a valid cached response when available. | Yes | Yes | Yes | Yes |
|  [Store to cache](cache-store-policy.md) | Caches response according to the specified cache control configuration. | Yes | Yes | Yes | Yes |
|  [Get value from cache](cache-lookup-value-policy.md) | Retrieves a cached item by key. | Yes | Yes | Yes | Yes |
|  [Store value in cache](cache-store-value-policy.md) | Stores an item in the cache by key. | Yes | Yes | Yes | Yes |
|  [Remove value from cache](cache-remove-value-policy.md) | Removes an item in the cache by key. | Yes | Yes | Yes | Yes |
|  [Get cached responses of Azure OpenAI API requests](azure-openai-semantic-cache-lookup-policy.md) | Performs cache lookup using semantic search and returns a valid cached response when available. | Yes | Yes | Yes | Yes |
|  [Store responses of Azure OpenAI API requests to cache](azure-openai-semantic-cache-store-policy.md) | Caches response according to the Azure OpenAI API cache configuration. | Yes | Yes | Yes | Yes |




## Transformation

|Policy  |Description  | Classic | V2  | Consumption |Self-hosted  |
|---------|---------|---------|---------|---------|--------|
|  [Set request method](set-method-policy.md) | Allows you to change the HTTP method for a request. | Yes | Yes | Yes | Yes |
|  [Set status code](set-status-policy.md) | Changes the HTTP status code to the specified value.    | Yes | Yes | Yes | Yes |
|  [Set variable](set-variable-policy.md) | Persists a value in a named [context](api-management-policy-expressions.md#ContextVariables) variable for later access. | Yes | Yes | Yes | Yes |
| [Set body](set-body-policy.md) | Sets the message body for a request or response. | Yes | Yes | Yes | Yes |
|  [Set HTTP header](set-header-policy.md) | Assigns a value to an existing response and/or request header or adds a new response and/or request header. | Yes | Yes | Yes | Yes |
|  [Set query string parameter](set-query-parameter-policy.md) | Adds, replaces value of, or deletes request query string parameter. | Yes | Yes | Yes | Yes | 
|  [Rewrite URL](rewrite-uri-policy.md) | Converts a request URL from its public form to the form expected by the web service. | Yes | Yes | Yes | Yes |
|  [Convert JSON to XML](json-to-xml-policy.md) | Converts request or response body from JSON to XML. | Yes | Yes | Yes | Yes |
|  [Convert XML to JSON](xml-to-json-policy.md) | Converts request or response body from XML to JSON. | Yes | Yes | Yes | Yes |
|  [Find and replace string in body](find-and-replace-policy.md) | Finds a request or response substring and replaces it with a different substring. | Yes | Yes | Yes | Yes |
|  [Mask URLs in content](redirect-content-urls-policy.md) | Rewrites (masks) links in the response body so that they point to the equivalent link via the gateway. | Yes | Yes | Yes | Yes |
| [Transform XML using an XSLT](xsl-transform-policy.md) | Applies an XSL transformation to XML in the request or response body. | Yes | Yes | Yes | Yes |
|  [Return response](return-response-policy.md) | Aborts pipeline execution and returns the specified response directly to the caller. | Yes | Yes | Yes | Yes |
|  [Mock response](mock-response-policy.md) | Aborts pipeline execution and returns a mocked response directly to the caller.     | Yes | Yes | Yes | Yes |

## Cross-domain

|Policy  |Description  | Classic | V2  | Consumption |Self-hosted  |
|---------|---------|---------|---------|---------|--------|
| [Allow cross-domain calls](cross-domain-policy.md) | Makes the API accessible from Adobe Flash and Microsoft Silverlight browser-based clients. | Yes | Yes | Yes | Yes |
| [CORS](cors-policy.md) | Adds cross-origin resource sharing (CORS) support to an operation or an API to allow cross-domain calls from browser-based clients.     | Yes | Yes | Yes | Yes |
| [JSONP](jsonp-policy.md) | Adds JSON with padding (JSONP) support to an operation or an API to allow cross-domain calls from JavaScript browser-based clients. | Yes | Yes | Yes | Yes |

## Integration and external communication

|Policy  |Description  | Classic | V2  | Consumption |Self-hosted  |
|---------|---------|---------|---------|---------|--------|
 |  [Send request](send-request-policy.md) | Sends a request to the specified URL. | Yes | Yes | Yes | Yes |
 |  [Send one way request](send-one-way-request-policy.md) | Sends a request to the specified URL without waiting for a response. | Yes | Yes | Yes | Yes |
|  [Log to event hub](log-to-eventhub-policy.md) | Sends messages in the specified format to an event hub defined by a Logger entity.| Yes | Yes | Yes | Yes |
| [Send request to a service (Dapr)](set-backend-service-dapr-policy.md)| Uses Dapr runtime to locate and reliably communicate with a Dapr microservice. To learn more about service invocation in Dapr, see the description in this [README](https://github.com/dapr/docs/blob/master/README.md#service-invocation) file.     | No | No | No | Yes |
| [Send message to Pub/Sub topic (Dapr)](publish-to-dapr-policy.md) | Uses Dapr runtime to publish a message to a Publish/Subscribe topic. To learn more about Publish/Subscribe messaging in Dapr, see the description in this [README](https://github.com/dapr/docs/blob/master/README.md) file. | No | No | No | Yes |
| [Trigger output binding (Dapr)](invoke-dapr-binding-policy.md) | Uses Dapr runtime to invoke an external system via output binding. To learn more about bindings in Dapr, see the description in this [README](https://github.com/dapr/docs/blob/master/README.md) file. | No | No | No | Yes |

## Logging

|Policy  |Description  | Classic | V2  | Consumption |Self-hosted  |
|---------|---------|---------|---------|---------|--------|
|  [Trace](trace-policy.md) | Adds custom traces into the [request tracing](./api-management-howto-api-inspector.md) output in the test console, Application Insights telemetries, and resource logs. | Yes | Yes<sup>1</sup> | Yes | Yes |
|  [Emit metrics](emit-metric-policy.md) | Sends custom metrics to Application Insights at execution. | Yes | Yes | Yes | Yes |
|  [Emit Azure OpenAI token metrics](azure-openai-emit-token-metric-policy.md) | Sends metrics to Application Insights for consumption of language model tokens through Azure OpenAI service APIs. | Yes | Yes | No | No |


<sup>1</sup> In the V2 gateway, the `trace` policy currently does not add tracing output in the test console.

## GraphQL resolvers

|Policy  |Description  | Classic | V2  | Consumption |Self-hosted  |
|---------|---------|---------|---------|---------|--------|
| [Azure SQL data source for resolver](sql-data-source-policy.md) | Configures the Azure SQL request and optional response to resolve data for an object type and field in a GraphQL schema. | Yes | Yes | No | No |
| [Cosmos DB data source for resolver](cosmosdb-data-source-policy.md) | Configures the Cosmos DB request and optional response to resolve data for an object type and field in a GraphQL schema. | Yes | Yes | No | No |
| [HTTP data source for resolver](http-data-source-policy.md) | Configures the HTTP request and optionally the HTTP response to resolve data for an object type and field in a GraphQL schema. | Yes | Yes | Yes | No |
| [Publish event to GraphQL subscription](publish-event-policy.md) | Publishes an event to one or more subscriptions specified in a GraphQL API schema. Configure the policy in a GraphQL resolver for a related field in the schema for another operation type such as a mutation. | Yes | Yes | Yes | No |

## Policy control and flow

|Policy  |Description  | Classic | V2  | Consumption |Self-hosted  |
|---------|---------|---------|---------|---------|--------|
|  [Control flow](choose-policy.md) | Conditionally applies policy statements based on the results of the evaluation of Boolean [expressions](api-management-policy-expressions.md). | Yes | Yes | Yes | Yes |
|  [Include fragment](include-fragment-policy.md) | Inserts a policy fragment in the policy definition. | Yes | Yes | Yes | Yes |
|  [Retry](retry-policy.md) | Retries execution of the enclosed policy statements, if and until the condition is met. Execution will repeat at the specified time intervals and up to the specified retry count. | Yes | Yes | Yes | Yes |
 |  [Wait](wait-policy.md) | Waits for enclosed [Send request](send-request-policy.md), [Get value from cache](cache-lookup-value-policy.md), or [Control flow](choose-policy.md) policies to complete before proceeding. | Yes | Yes | Yes | Yes |

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]	
