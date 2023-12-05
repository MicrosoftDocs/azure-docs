---
title: How to use VMware Spring Cloud Gateway route filters with the Azure Spring Apps Enterprise plan
description: Shows you how to use VMware Spring Cloud Gateway route filters with the Azure Spring Apps Enterprise plan to route requests to your applications.
author: KarlErickson
ms.author: karler
ms.topic: how-to
ms.date: 07/12/2023
ms.service: spring-apps
ms.custom: devx-track-java, event-tier1-build-2022
---

# How to use VMware Spring Cloud Gateway route filters with the Azure Spring Apps Enterprise plan

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard ✔️ Enterprise

This article explains how to use VMware Spring Cloud Gateway route filters with the Azure Spring Apps Enterprise plan to route requests to your applications.

[VMware Spring Cloud Gateway](https://docs.vmware.com/en/VMware-Spring-Cloud-Gateway-for-Kubernetes/index.html) is a commercial VMware Tanzu component based on the open-source Spring Cloud Gateway project. Spring Cloud Gateway handles cross-cutting concerns for API development teams, such as single sign-on (SSO), access control, rate-limiting, resiliency, security, and more. You can accelerate API delivery using modern cloud native patterns, and any programming language you choose for API development.

VMware Spring Cloud Gateway includes the following features:

- Dynamic routing configuration, independent of individual applications that can be applied and changed without recompilation.
- Commercial API route filters for transporting authorized JSON Web Token (JWT) claim to application services.
- Client certificate authorization.
- Rate-limiting approaches.
- Circuit breaker configuration.
- Support for accessing application services via HTTP Basic Authentication credentials.

To integrate with API Portal for VMware Tanzu, VMware Spring Cloud Gateway automatically generates OpenAPI version 3 documentation after any route configuration additions or changes. For more information, see [Use API Portal for VMware Tanzu](./how-to-use-enterprise-api-portal.md).

## Prerequisites

- An already provisioned Azure Spring Apps Enterprise plan service instance with Spring Cloud Gateway enabled. For more information, see [Quickstart: Build and deploy apps to Azure Spring Apps using the Enterprise plan](quickstart-deploy-apps-enterprise.md).
- [Azure CLI](/cli/azure/install-azure-cli) version 2.0.67 or later. Use the following command to install the Azure Spring Apps extension: `az extension add --name spring`.

## Use filters

You use filters in your Spring Cloud Gateway configuration to act on the incoming request or outgoing response to a route configuration.

For example, you can use a filter to add an HTTP header or to deny access based on an authorization token.

## Use open source filters

Spring Cloud Gateway OSS includes several `GatewayFilter` factories used to create filters for routes. The following sections describe these factories.

### AddRequestHeader

The `AddRequestHeader` factory adds a header to the downstream request's headers for all matching requests.

This factory accepts the following configuration parameters:

- `name`
- `value`

The following example configures an `AddRequestHeader` factory that adds the header `X-Request-red:blue` to the downstream request's headers for all matching requests:

```json
[
    {
        "predicates": [
            "Path=/api/**"
        ],
        "filters": [
            "AddRequestHeader=X-Request-red, blue"
        ]
    }
]
```

The `AddRequestHeader` factory has access to the URI variables used to match a path or host. You can use URI variables in the value, and the variables are expanded at runtime.

The following example configures an `AddRequestHeader` factory that uses a variable:

```json
[
    {
        "predicates": [
            "Path=/api/{segment}"
        ],
        "filters": [
            "AddRequestHeader=X-Request-red, blue-{segment}"
        ]
    }
]
```

### AddRequestHeadersIfNotPresent

The `AddRequestHeadersIfNotPresent` factory adds headers if they aren't present in the original request.

This factory accepts the following configuration parameter:

- `headers`: A comma-separated list of key-value pairs (header name, header value).

The following example configures an `AddRequestHeadersIfNotPresent` factory:

```json
[
    {
        "predicates": [
            "Path=/api/**"
        ],
        "filters": [
            "AddRequestHeadersIfNotPresent=Content-Type:application/json,Connection:keep-alive"
        ]
    }
]
```

### AddRequestParameter

The `AddRequestParameter` factory adds a parameter to the downstream request's query string for all matching requests.

This factory accepts the following configuration parameters:

- `name`
- `value`

The following example configures an `AddRequestParameter` factory that adds a `red=blue` parameter to the downstream request's query string for all matching requests:

```json
[
    {
        "predicates": [
            "Path=/api/**"
        ],
        "filters": [
            "AddRequestParameter=red, blue"
        ]
    }
]
```

The `AddRequestParameter` factory has access to the URI variables used to match a path or host. You can use URI variables in the value, and the variables are expanded at runtime.

The following example configures an `AddRequestParameter` factory that uses a variable:

```json
[
    {
        "predicates": [
            "Path=/api/{segment}"
        ],
        "filters": [
            "AddRequestParameter=foo, bar-{segment}"
        ]
    }
]
```

### AddResponseHeader

The `AddResponseHeader` factory adds a header to the downstream response's headers for all matching requests.

This factory accepts the following configuration parameters:

- `name`
- `value`

The following example configures an `AddResponseHeader` factory that adds a `X-Response-Red:Blue` header to the downstream response's headers for all matching requests:

```json
[
    {
        "predicates": [
            "Path=/api/**"
        ],
        "filters": [
            "AddResponseHeader=X-Response-Red, Blue"
        ]
    }
]
```

The `AddResponseHeader` factory has access to the URI variables used to match a path or host. You can use URI variables in the value, and the variables are expanded at runtime.

The following example configures an `AddResponseHeader` factory that uses a variable:

```json
[
    {
        "predicates": [
            "Path=/api/{segment}"
        ],
        "filters": [
            "AddResponseHeader=foo, bar-{segment}"
        ]
    }
]
```

### CircuitBreaker

The `CircuitBreaker` factory wraps routes in a circuit breaker.

This factory accepts the following configuration parameters:

- `name`: The circuit breaker name.
- `fallbackUri`: The reroute URI, which can be a local route or external handler.
- `status codes` (optional): The colon-separated list of status codes to match, in number or text format.
- `failure rate` (optional): The threshold above which the circuit breaker opens. The default value is 50%.
- `duration` (optional): The time to wait before closing again. The default value is 60 seconds.

The following example configures a `CircuitBreaker` factory:

```json
[
    {
        "predicates": [
            "Path=/api/**"
        ],
        "filters": [
            "CircuitBreaker=myCircuitBreaker,forward:/inCaseOfFailureUseThis,401:NOT_FOUND:500,10,30s"
        ]
    }
]
```

### DeDupeResponseHeader

The `DeDupeResponseHeader` factory removes duplicate values of response headers.

This factory accepts the following configuration parameters:

- `name`: A space-separated list of header names.
- `strategy` (optional): The accepted values are `RETAIN_FIRST`, `RETAIN_LAST`, and `RETAIN_UNIQUE`. The default value is `RETAIN_FIRST`.

The following example configures a `DeDupeResponseHeader` factory that removes duplicate values of `Access-Control-Allow-Credentials` and `Access-Control-Allow-Origin` response headers when both values are added by the gateway CORS logic and the downstream logic:

```json
[
    {
        "predicates": [
            "Path=/api/**"
        ],
        "filters": [
            "DeDupeResponseHeader=Access-Control-Allow-Credentials Access-Control-Allow-Origin"
        ]
    }
]
```

### FallbackHeaders

The `FallbackHeaders` factory adds any circuit breaker exception to a header. This filter requires the use of the `CircuitBreaker` filter in another route.

There are no parameters for this factory.

The following example configures a `FallbackHeaders` factory with the exception type, message, and (if available) root cause exception type and message that the `FallbackHeaders` filter adds to the request:

```json
[
    {
        "predicates": [
            "Path=/api/**"
        ],
        "filters": [
            "CircuitBreaker=myCircuitBreaker,forward:/inCaseOfFailureUseThis,401:NOT_FOUND:500,10,30s"
        ]
    },
    {
        "predicates": [
            "Path=/inCaseOfFailureUseThis"
        ],
        "filters": [
            "FallbackHeaders"
        ]
    }
]
```

You can overwrite the names of the headers in the configuration by setting the values of the following parameters (mentioned with their default values):

- `executionExceptionTypeHeaderName` ("Execution-Exception-Type")
- `executionExceptionMessageHeaderName` ("Execution-Exception-Message")
- `rootCauseExceptionTypeHeaderName` ("Root-Cause-Exception-Type")
- `rootCauseExceptionMessageHeaderName` ("Root-Cause-Exception-Message")

### JSONToGRPC

The `JSONToGRPCFilter` factory converts a JSON payload to a gRPC request.

This factory accepts the following configuration parameter:

- `protoDescriptor`: A proto descriptor file.

You can generate this file by using `protoc` and specifying the `--descriptor_set_out` flag, as shown in the following example:

```bash
protoc --proto_path=src/main/resources/proto/ \
    --descriptor_set_out=src/main/resources/proto/hello.pb \
    src/main/resources/proto/hello.proto
```

> [!NOTE]
> The `streaming` parameter isn't supported.

The following example configures a `JSONToGRPCFilter` factory using the output from `protoc`:

```json
[
    {
        "predicates": [
            "Path=/json/**"
        ],
        "filters": [
            "JsonToGrpc=file:proto/hello.pb,file:proto/hello.proto,HelloService,hello"
        ]
    }
]
```

### LocalResponseCache

The `LocalResponseCache` factory overrides the local response cache configuration for specific routes when the global cache is activated.

This factory accepts the following configuration parameters:

- `size`: The maximum allowed size of the cache entries for this route before cache eviction begins (in KB, MB, and GB).
- `timeToLive`: The allowed lifespan of a cache entry before expiration. Use the duration suffix `s` for seconds, `m` for minutes, or `h` for hours.

The following example configures a `LocalResponseCache` factory:

```json
[
    {
        "predicates": [
            "Path=/api/**"
        ],
        "filters": [
            "LocalResponseCache=3m,1MB"
        ]
    }
]
```

### MapRequestHeader

The `MapRequestHeader` factory adds a header to the downstream request with updated values from the incoming HTTP request's header.

This factory accepts the following configuration parameters:

- `fromHeader`
- `toHeader`

This factory creates a new named header (`toHeader`), and the value is extracted out of an existing named header (`fromHeader`) from the incoming HTTP request. If the input header doesn't exist, the filter has no effect. If the new named header already exists, its values are augmented with the new values.

The following example configures a `MapRequestHeader` factory that adds the `X-Request-Red:<values>` header to the downstream request with updated values from the incoming HTTP request's `Blue` header:

```json
[
    {
        "predicates": [
            "Path=/api/**"
        ],
        "filters": [
            "MapRequestHeader=Blue, X-Request-Red"
        ]
    }
]
```

### PrefixPath

The `PrefixPath` factory adds a prefix to the path of all requests.

This factory accepts the following configuration parameter:

- `prefix`

The following example configures a `PrefixPath` factory that adds the prefix `/api` to the path of all requests, so that a request to `/catalog` is sent to `/api/catalog`:

```json
[
    {
        "predicates": [
            "Path=/catalog/**"
        ],
        "filters": [
            "PrefixPath=/api"
        ]
    }
]
```

### PreserveHostHeader

The `PreserveHostHeader` factory sets a request attribute that the routing filter inspects to determine whether to send the original host header or the host header determined by the HTTP client.

There are no parameters for this factory.

The following example configures a `PreserveHostHeader` factory:

```json
[
    {
        "predicates": [
            "Path=/api/**"
        ],
        "filters": [
            "PreserveHostHeader"
        ]
    }
]
```

### RedirectTo

The `RedirectTo` factory adds a redirect to the original URL.

This factory accepts the following configuration parameters:

- `status`: A 300 series redirect HTTP code, such as `301`.
- `url`: The value of the `Location` header. Must be a valid URI. For relative redirects, you should use `uri: no://op` as the URI of your route definition.

The following example configures a `RedirectTo` factory that sends a status `302` with a `Location:https://acme.org` header to perform a redirect:

```json
[
    {
        "uri": "https://example.org",
        "filters": [
            "RedirectTo=302, https://acme.org"
        ]
    }
]
```

### RemoveJsonAttributesResponseBody

The `RemoveJsonAttributesResponseBody` factory removes the JSON attributes and their values from JSON response bodies.

This factory accepts the following configuration parameters:

- `attribute names`: A comma-separated list of the names of attributes to remove from a JSON response.
- `delete recursively` (optional, boolean): A configuration that removes the attributes only at root level (`false`), or recursively (`true`). The default value is `false`.

The following example configures a `RemoveJsonAttributesResponseBody` factory:

```json
[
    {
        "predicates": [
            "Path=/api/**"
        ],
        "filters": [
            "RemoveJsonAttributesResponseBody=origin,foo,true"
        ]
    }
]
```

### RemoveRequestHeader

The `RemoveRequestHeader` factory removes a header from the downstream request.

This factory accepts the following configuration parameter:

- `name`: The name of the header to be removed.

The following listing configures a `RemoveRequestHeader` factory that removes the `X-Request-Foo` header before it's sent downstream:

```json
[
    {
        "predicates": [
            "Path=/api/**"
        ],
        "filters": [
            "RemoveRequestHeader=X-Request-Foo"
        ]
    }
]
```

### RemoveRequestParameter

The `RemoveRequestParameter` factory removes a parameter before it's sent downstream.

This factory accepts the following configuration parameter:

- `name`: The name of the query parameter to be removed.

The following example configures a `RemoveRequestParameter` factory that removes the `red` parameter before it's sent downstream:

```json
[
    {
        "predicates": [
            "Path=/api/**"
        ],
        "filters": [
            "RemoveRequestParameter=red"
        ]
    }
]
```

### RemoveResponseHeader

The `RemoveResponseHeader` factory removes a header from the response before it's returned to the gateway client.

This factory accepts the following configuration parameter:

- `name`: The name of the header to be removed.

The following listing configures a `RemoveResponseHeader` factory that removes the `X-Response-Foo` header from the response before it's returned to the gateway client:

```json
[
    {
        "predicates": [
            "Path=/api/**"
        ],
        "filters": [
            "RemoveResponseHeader=X-Response-Foo"
        ]
    }
]
```

### RequestHeaderSize

The `RequestHeaderSize` factory determines the size of the request header.

This factory accepts the following configuration parameters:

- `maxSize`: The maximum data size allowed by the request header, including key and value.
- `errorHeaderName`: The name of the response header containing an error message. By default, the name of the response header is `errorMessage`.

The following listing configures a `RequestHeaderSize` factory that sends a status `431` if the size of any request header is greater than 1000 bytes:

```json
[
    {
        "predicates": [
            "Path=/api/**"
        ],
        "filters": [
            "RequestHeaderSize=1000B"
        ]
    }
]
```

### RewriteLocationResponseHeader

The `RewriteLocationResponseHeader` factory modifies the value of the `Location` response header, usually to get rid of backend-specific details.

This factory accepts the following configuration parameters:

- `stripVersionMode`: This parameter has the following possible values: `NEVER_STRIP`, `AS_IN_REQUEST`, and `ALWAYS_STRIP`. The default value is `AS_IN_REQUEST`.

  - `NEVER_STRIP`: The version isn't stripped, even if the original request path contains no version.
  - `AS_IN_REQUEST`: The version is stripped only if the original request path contains no version.
  - `ALWAYS_STRIP`: The version is always stripped, even if the original request path contains version.

- `hostValue`: This parameter is used to replace the `host:port` portion of the response `Location` header when provided. If it isn't provided, the value of the `Host` request header is used.
- `protocolsRegex`: A valid regex `String`, against which the protocol name is matched. If it isn't matched, the filter doesn't work. The default value is `http|https|ftp|ftps`.
- `locationHeaderName`

The following listing configures a `RewriteLocationResponseHeader` factory:

```json
[
    {
        "predicates": [
            "Path=/api/**"
        ],
        "filters": [
            "RewriteLocationResponseHeader=AS_IN_REQUEST, Location, ,"
        ]
    }
]
```

In this example, for a request value of `POST` `api.example.com/some/object/name`, the `Location` response header value of `object-service.prod.example.net/v2/some/object/id` is rewritten as `api.example.com/some/object/id`.

### RewritePath

The `RewritePath` factory uses Java regular expressions for a flexible way to rewrite the request path.

This factory accepts the following configuration parameters:

- `regexp`
- `replacement`

The following listing configures a `RewritePath` factory:

```json
[
    {
        "predicates": [
            "Path=/red/**"
        ],
        "filters": [
            "RewritePath=/red/?(?<segment>.*), /$\\{segment}"
        ]
    }
]
```

In this example, for a request path of `/red/blue`, this configuration sets the path to `/blue` before making the downstream request.

### RewriteResponseHeader

The `RewriteResponseHeader` factory uses Java regular expressions for a flexible way to rewrite the response header value.

This factory accepts the following configuration parameters:

- `name`
- `regexp`
- `replacement`

The following example configures a `RewriteResponseHeader` factory:

```json
[
    {
        "predicates": [
            "Path=/red/**"
        ],
        "filters": [
            "RewriteResponseHeader=X-Response-Red, , password=[^&]+, password=***"
        ]
    }
]
```

In this example, for a header value of `/42?user=ford&password=omg!what&flag=true`, the configuration is set to `/42?user=ford&password=***&flag=true` after making the downstream request.

### SetPath

The `SetPath` factory offers a simple way to manipulate the request path by allowing templated segments of the path. This filter uses the URI templates from Spring Framework and allows multiple matching segments.

This factory accepts the following configuration parameter:

- `template`

The following example configures a `SetPath` factory:

```json
[
    {
        "predicates": [
            "Path=/red/{segment}"
        ],
        "filters": [
            "SetPath=/{segment}"
        ]
    }
]
```

In this example, for a request path of `/red/blue`, this configuration sets the path to `/blue` before making the downstream request.

### SetRequestHeader

The `SetRequestHeader` factory replaces (rather than adding) all headers with the given name.

This factory accepts the following configuration parameters:

- `name`
- `value`

The following listing configures a `SetRequestHeader` factory:

```json
[
    {
        "predicates": [
            "Path=/api/**"
        ],
        "filters": [
            "SetRequestHeader=X-Request-Red, Blue"
        ]
    }
]
```

In this example, the downstream server responded with `X-Request-Red:1234`, and it's replaced with `X-Request-Red:Blue`.

The `SetRequestHeader` factory has access to the URI variables used to match a path or host. You can use URI variables in the value, and the variables are expanded at runtime.

The following example configures an `SetRequestHeader` factory that uses a variable:

```json
[
    {
        "predicates": [
            "Path=/api/{segment}"
        ],
        "filters": [
            "SetRequestHeader=foo, bar-{segment}"
        ]
    }
]
```

### SetResponseHeader

The `SetResponseHeader` factory replaces (rather than adding) all headers with the given name.

This factory accepts the following configuration parameters:

- `name`
- `value`

The following listing configures a `SetResponseHeader` factory:

```json
[
    {
        "predicates": [
            "Path=/api/**"
        ],
        "filters": [
            "SetResponseHeader=X-Response-Red, Blue"
        ]
    }
]
```

In this example, the downstream server responded with `X-Response-Red:1234`, and it's replaced with `X-Response-Red:Blue`.

The `SetResponseHeader` factory has access to the URI variables used to match a path or host. You can use URI variables in the value, and the variables are expanded at runtime.

The following example configures an `SetResponseHeader` factory that uses a variable:

```json
[
    {
        "predicates": [
            "Path=/api/{segment}"
        ],
        "filters": [
            "SetResponseHeader=foo, bar-{segment}"
        ]
    }
]
```

### SetStatus

The `SetStatus` factory configures the response status of the server request.

This factory accepts the following configuration parameter:

- `status`: A valid Spring `HttpStatus` value, which can an integer value such as `404`, or the string representation of the enumeration, such as `NOT_FOUND`.

The following listing configures a `SetStatus` factory:

```json
[
    {
        "predicates": [
            "Path=/experimental/**"
        ],
        "filters": [
            "SetStatus=UNAUTHORIZED"
        ]
    },
    {
        "predicates": [
            "Path=/unknown/**"
        ],
        "filters": [
            "SetStatus=401"
        ]
    }
]
```

### StripPrefix

The `StripPrefix` factory removes the prefix from the request before sending it downstream.

This factory accepts the following configuration parameter:

- `parts`: The number of parts in the path to strip from the request before sending it downstream. The default value is 1.

The following example configures a `StripPrefix` factory:

```json
[
    {
        "predicates": [
            "Path=/name/**"
        ],
        "filters": [
            "StripPrefix=2"
        ]
    }
]
```

In this example, a request is made through the gateway to `/name/blue/red`. The request made to `nameservice` appears as `nameservice/red`.

### Retry

The `Retry` factory determines the number of retries attempted.

This factory accepts the following configuration parameters:

- `retries`: The number of retries that should be attempted.
- `statuses`: The HTTP status codes that should be retried, represented by using `org.springframework.http.HttpStatus`.
- `methods`: The HTTP methods that should be retried, represented by using `org.springframework.http.HttpMethod`.
- `series`: The series of status codes to be retried, represented by using `org.springframework.http.HttpStatus.Series`.
- `exceptions`: The list of thrown exceptions that should be retried.
- `backoff`: The configured exponential backoff for the retries. Retries are performed after a backoff interval of `firstBackoff * (factor ^ n)`, where `n` is the iteration. If `maxBackoff` is configured, the maximum backoff applied is limited to `maxBackoff`. If `basedOnPreviousValue` is true, the `backoff` is calculated by using `prevBackoff * factor`.

The following defaults are configured for the `Retry` filter, when enabled:

- `retries`: three times.
- `series`: 5XX series.
- `methods`: GET method.
- `exceptions`: `IOException` and `TimeoutException`.
- `backoff`: disabled.

The following example configures a `Retry` factory:

```json
[
    {
        "predicates": [
            "Path=/api/**"
        ],
        "filters": [
            "Retry=3,INTERNAL_SERVER_ERROR,GET,10ms,50ms,2,false"
        ]
    }
]
```

### RequestSize

The `RequestSize` factory can restrict a request from reaching the downstream service when the request size is greater than the permissible limit.

This factory accepts the following configuration parameter:

- `maxSize`: A `DataSize` type where values are defined as a number followed by an optional `DataUnit` suffix such as `KB` or `MB`. The default suffix value is `B` for bytes. It's the permissible size limit of the request defined in bytes.

The following example configures a `RequestSize` factory:

```json
[
    {
        "predicates": [
            "Path=/upload"
        ],
        "filters": [
            "RequestSize=5000000"
        ]
    }
]
```

In this example, when the request is rejected due to size, the `RequestSize` factory sets the response status to `413 Payload Too Large` with another header `errorMessage`.

The following example shows an `errorMessage`:

```output
errorMessage : Request size is larger than permissible limit. Request size is 6.0 MB where permissible limit is 5.0 MB
```

### TokenRelay

The `TokenRelay` factory forwards an `OAuth2` access token to downstream resources. This filter is configured as a `boolean` value in the route definition rather than an explicit filter.

The following example configures a `TokenRelay` factory:

```json
[
    {
        "predicates": [
            "Path=/api/**"
        ],
        "tokenRelay": true
    }
]
```

## Use commercial filters

Spring Cloud Gateway for Kubernetes also provides many custom `GatewayFilter` factories. The following sections describe these factories.

### AllowedRequestCookieCount

The `AllowedRequestCookieCount` factory determines whether a matching request is allowed to proceed based on the number of cookies.

This factory accepts the following configuration parameter:

- `amount`: The number of allowed cookies.

The following example configures a `AllowedRequestCookieCount` factory:

```json
[
    {
        "predicates": [
            "Path=/api/**"
        ],
        "filters": [
            "AllowedRequestCookieCount=2"
        ]
    }
]
```

### AllowedRequestHeadersCount

The `AllowedRequestHeadersCount` factory determines whether a matching request is allowed to proceed based on the number of headers.

This factory accepts the following configuration parameter:

- `amount`: The number of allowed headers.

The following example configures a `AllowedRequestHeadersCount` factory:

```json
[
    {
        "predicates": [
            "Path=/api/**"
        ],
        "filters": [
            "AllowedRequestHeadersCount=4"
        ]
    }
]
```

### AllowedRequestQueryParamsCount

The `AllowedRequestQueryParamsCount` factory determines whether a matching request is allowed to proceed based on the number query parameters.

This factory accepts the following configuration parameter:

- `amount`: The number of allowed parameters.

The following example configures a `AllowedRequestQueryParamsCount` factory:

```json
[
    {
        "predicates": [
            "Path=/api/**"
        ],
        "filters": [
            "AllowedRequestQueryParamsCount=3"
        ]
    }
]
```

### BasicAuth

The `BasicAuth` factory adds a `BasicAuth` `Authorization` header to requests.

There are no parameters for this factory.

The following example configures a `BasicAuth` factory:

```json
[
    {
        "predicates": [
            "Path=/api/**"
        ],
        "filters": [
            "BasicAuth"
        ]
    }
]
```

### ClaimHeader

The `ClaimHeader` factory copies data from a JWT claim into an HTTP header.

This factory accepts the following configuration parameters:

- `Claim name`: The case sensitive name of the claim to pass.
- `Header name`: The name of the HTTP header.

The following example configures a `ClaimHeader` factory:

```json
[
    {
        "predicates": [
            "Path=/api/**"
        ],
        "filters": [
            "ClaimHeader=sub,X-Claim-Sub"
        ]
    }
]
```

### ClientCertificateHeader

The `ClientCertificateHeader` factory validates the `X-Forwarded-Client-Cert` header certificate.

This factory accepts the following configuration parameters:

- `domain pattern`: The `X-Forwarded-Client-Cert` value according to Kubernetes's ability to recognize the client certificate's CA.
- `certificate fingerprint`(optional): The TLS/SSL certificate fingerprint.

The following example configures a `ClientCertificateHeader` factory:

```json
[
    {
        "predicates": [
            "Path=/api/**"
        ],
        "filters": [
            "ClientCertificateHeader=*.example.com,sha-1:aa:bb:00:99"
        ]
    }
]
```

### Cors

The `Cors` factory activates the CORS validations on a route.

This factory accepts the following configuration parameters that are organized as key-value pairs for CORS options:

- `allowedOrigins`
- `allowedMethods`
- `allowedHeaders`
- `maxAge`
- `allowCredentials`
- `allowedOriginPatterns`

The following example configures a `Cors` factory:

```json
[
    {
        "predicates": [
            "Path=/api/**"
        ],
        "filters": [
            "Cors=[allowedOrigins:https://origin-1,allowedMethods:GET;POST;DELETE,allowedHeaders:*,maxAge:400,allowCredentials:true,allowedOriginPatterns:https://*.test.com:8080]"
        ]
    }
]
```

### JsonToXml

The `JsonToXml` factory transforms JSON response body into XML response body.

This factory accepts the following configuration parameter:

- `wrapper`: The root tag name for the XML response if another root tag is required to generate valid XML. The default value is `response`.

The following example configures a `JsonToXml` factory:

```json
[
    {
        "predicates": [
            "Path=/api/**"
        ],
        "filters": [
            "JsonToXml=custom-response"
        ]
    }
]
```

### RateLimit

The `RateLimit` factory determines whether a matching request is allowed to proceed based on request volume.

This factory accepts the following configuration parameters:

- `request limit`: The maximum number of requests accepted during the window.
- `window duration`: The window duration in milliseconds. Alternatively, you can use the `s`, `m` or `h` suffixes to specify the duration in seconds, minutes, or hours.
- `partition source` (optional): The location of the partition key (`claim`, `header`, or `IPs`).
- `partition key` (optional): The value used to partition request counters.

The following example configures a `RateLimit` factory:

```json
[
    {
        "predicates": [
            "Path=/api/**"
        ],
        "filters": [
            "RateLimit=1,10s"
        ]
    }
]
```

The following examples show other `RateLimit` configurations:

```
RateLimit=1,10s
RateLimit=1,10s,{claim:client_id}
RateLimit=1,10s,{header:client_id}
RateLimit=2,10s,{IPs:2;127.0.0.1;192.168.0.1}
```

### RestrictRequestHeaders

The `RestrictRequestHeaders` factory determines whether a matching request is allowed to proceed based on the headers.

If there are any HTTP headers that aren't in the case-insensitive `headerList` configuration, then a response of `431 Forbidden error` is returned to the client.

This factory accepts the following configuration parameter:

- `headerList`: The case-insensitive list of names of allowed headers.

The following example configures a `RestrictRequestHeaders` factory:

```json
[
    {
        "predicates": [
            "Path=/api/**"
        ],
        "filters": [
            "RestrictRequestHeaders=Content-Type,x-request-temp"
        ]
    }
]
```

### RewriteAllResponseHeaders

The `RewriteAllResponseHeaders` factory rewrites multiple response headers at once.

This factory accepts the following configuration parameters:

- `pattern to match`: The regular expression to match against header values.
- `replacement`: The replacement value.

The following example configures a `RewriteAllResponseHeaders` factory:

```json
[
    {
        "predicates": [
            "Path=/api/**"
        ],
        "filters": [
            "RewriteAllResponseHeaders=\\d,0"
        ]
    }
]
```

### RewriteResponseBody

The `RewriteResponseBody` factory modifies the body of a response.

This factory accepts the following configuration parameters that are organized as a comma-separated list of key-value pairs, where each pair accepts the form `pattern to match:replacement`:

- `pattern to match`: The regular expression to match against text in the response body.
- `replacement`: The replacement value.

The following example configures a `RewriteResponseBody` factory:

```json
[
    {
        "predicates": [
            "Path=/api/**"
        ],
        "filters": [
            "RewriteResponseBody=foo:bar,/path-one/:/path-two/"
        ]
    }
]
```

### RewriteJsonAttributesResponseBody

The `RewriteJsonAttributesResponseBody` factory rewrites JSON attributes using `JSONPath` notation.

This factory accepts the following configuration parameters that are organized as a comma-separated list of key-value pairs, where each pair accepts the form `jsonpath:replacement`:

- `jsonpath`: The `JSONPath` expression to match against the response body.
- `replacement`: The replacement value.

The following example configures a `RewriteJsonAttributesResponseBody` factory:

```json
[
    {
        "predicates": [
            "Path=/api/**"
        ],
        "filters": [
            "RewriteJsonAttributesResponseBody=slides[1].title:Welcome,date:11-11-2022"
        ]
    }
]
```

### Roles

The `Roles` factory authorizes requests that contain one of the configured roles.

This factory accepts the following configuration parameter:

- `roles`: A comma-separated list of authorized roles.

The following example configures a `Roles` factory:

```json
[
    {
        "predicates": [
            "Path=/api/**"
        ],
        "filters": [
            "Roles=role_01,role_02"
        ]
    }
]
```

### Scopes

The `Scopes` factory authorizes requests that contain one of the configured `OAuth` scopes.

This factory accepts the following configuration parameter:

- `scopes`: A comma-separated list of authorized `OAuth` scopes.

The following example configures a `Scopes` factory:

```json
[
    {
        "predicates": [
            "Path=/api/**"
        ],
        "filters": [
            "Scopes=api.read,api.write,user"
        ]
    }
]
```

### StoreIpAddress

The `StoreIPAddress` factory is used for extension development only and in the context of the application.

This factory accepts the following configuration parameter:

- `attribute name`: The name used to store the IP as an exchange attribute.

The following example configures a `StoreIPAddress` factory:

```json
[
    {
        "predicates": [
            "Path=/api/**"
        ],
        "filters": [
            "StoreIpAddress=ip"
        ]
    }
]
```

### SSO login

The `SSO login` factory redirects to authenticate if there's no valid authorization token. This factory is configured as a `boolean` value in the route definition rather than an explicit filter.

The following example configures a `SSO login` factory:

```json
[
    {
        "predicates": [
            "Path=/api/**"
        ],
        "ssoEnabled": true
    }
]
```

### StoreHeader

The `StoreHeader` factory stores a header value in the context of the application. This filter is used for extension development only.

This factory accepts the following configuration parameters:

- `headers`: A list of headers to check. The first one found is used.
- `attribute name`: The name used to store the header value as an exchange attribute.

The following example configures a `StoreHeader` factory:

```json
[
    {
        "predicates": [
            "Path=/api/**"
        ],
        "filters": [
            "StoreHeader=x-tracing-header,custom-id,x-custom-id,tracingParam"
        ]
    }
]
```

### XmlToJson

The `XmlToJson` factory transforms XML response body into JSON response body.

There are no parameters for this factory.

The following example configures a `XmlToJson` factory:

```json
[
    {
        "predicates": [
            "Path=/api/**"
        ],
        "filters": [
            "XmlToJson"
        ]
    }
]
```

## Next steps

- [Azure Spring Apps](index.yml)
- [Quickstart: Build and deploy apps to Azure Spring Apps using the Enterprise plan](./quickstart-deploy-apps-enterprise.md)
