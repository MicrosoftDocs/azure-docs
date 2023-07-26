---
title: How to use VMware Spring Cloud Gateway route filters with the Azure Spring Apps Enterprise plan
description: Shows you how to use VMware Spring Cloud Gateway route filters with the Azure Spring Apps Enterprise plan to route requests to your applications.
author: KarlErickson
ms.author: karler
ms.topic: how-to
ms.date: 07/12/2023
ms.service: spring-apps
ms.custom: devx-track-java, devx-track-azurecli, event-tier1-build-2022
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

To integrate with API portal for VMware Tanzu, VMware Spring Cloud Gateway automatically generates OpenAPI version 3 documentation after any route configuration additions or changes. For more information, see [Use API portal for VMware Tanzu®](./how-to-use-enterprise-api-portal.md).

## Prerequisites

- An already provisioned Azure Spring Apps Enterprise plan service instance with Spring Cloud Gateway enabled. For more information, see [Quickstart: Build and deploy apps to Azure Spring Apps using the Enterprise plan](quickstart-deploy-apps-enterprise.md).

  > [!NOTE]
  > You must enable VMware Spring Cloud Gateway when you provision your Azure Spring Apps service instance. You cannot enable VMware Spring Cloud Gateway after provisioning.

- Azure CLI version 2.0.67 or later. For more information, see [How to install the Azure CLI](/cli/azure/install-azure-cli).

## Filters

Filters are used in the Spring Cloud Gateway configuration to act on the incoming request, or as an outgoing response to a route configuration.

For example, a filter could be used in adding an HTTP header, or when denying access based on an authorization token.

## Use Open Source Filters

Spring Cloud Gateway OSS includes a number of `GatewayFilter` factories used to create filters for routes.

### AddRequestHeader

The `AddRequestHeader` GatewayFilter Factory takes `name` and `value` parameters. The following example configures an `AddRequestHeader` GatewayFilter:

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

This listing adds `X-Request-red:blue` header to the downstream request’s headers for all matching requests.

`AddRequestHeader` is aware of the URI variables used to match a path or host. URI variables may be used in the value and are expanded at runtime. The following example configures an `AddRequestHeader` GatewayFilter that uses a variable:

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

The `AddRequestHeadersIfNotPresent` filter adds headers if it isn't present in the original request.

The following list shows the configuration parameters:

- `headers`: comma-separated list of key-value pairs (header name, header value).

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

The `AddRequestParameter` GatewayFilter Factory takes `name` and `value` parameters. The following example configures an `AddRequestParameter` GatewayFilter:

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

This configuration adds `red=blue` parameter to the downstream request’s query string for all matching requests.

`AddRequestParameter` is aware of the URI variables used to match a path or host. URI variables may be used in the value and are expanded at runtime. The following example configures an `AddRequestParameter` GatewayFilter that uses a variable:

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

The `AddResponseHeader` GatewayFilter Factory takes `name` and `value` parameters. The following example configures an `AddResponseHeader` GatewayFilter:

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

This configuration adds `X-Response-Red:Blue` header to the downstream response’s headers for all matching requests.

`AddResponseHeader` is aware of the URI variables used to match a path or host. URI variables may be used in the value and are expanded at runtime. The following example configures an `AddResponseHeader` GatewayFilter that uses a variable:

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

The `CircuitBreaker` filter wraps routes in a circuit breaker.

The following list shows the configuration parameters:

- `name`: circuit breaker name.
- `fallbackUri`: reroute url (can be a local route or external handler).
- `status codes`: (optional) colon-separated list of status codes to match, in number or in text format.
- `failure rate`: (optional) threshold above which the circuit breaker opens (default 50%).
- `duration`: (optional) time to wait before closing again (default 60s).

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

The `DedupeResponseHeader` GatewayFilter Factory takes a `name` parameter and an optional `strategy` parameter. `name` can contain a space-separated list of header names. The following example configures a `DedupeResponseHeader` GatewayFilter:

```json
[
    {
        "predicates": [
            "Path=/api/**"
        ],
        "filters": [
            "DedupeResponseHeader=Access-Control-Allow-Credentials Access-Control-Allow-Origin"
        ]
    }
]
```

This configuration removes duplicate values of `Access-Control-Allow-Credentials` and `Access-Control-Allow-Origin` response headers when both values are added by the gateway CORS logic and the downstream logic.

The `DedupeResponseHeader` filter also accepts an optional strategy parameter. The accepted values are `RETAIN_FIRST` (default), `RETAIN_LAST`, and `RETAIN_UNIQUE`.

### FallbackHeaders

The `FallbackHeaders` filter adds any circuit breaker exception to a header. This filter requires the use of the `CircuitBreaker` filter in another route.

There are no parameters for the `FallbackHeaders` filter.

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

The headers with the exception type, message, and (if available) root cause exception type and message are added to that request by the `FallbackHeaders` filter.

You can overwrite the names of the headers in the configuration by setting the values of the following arguments (shown with their default values):

- `executionExceptionTypeHeaderName` ("Execution-Exception-Type")
- `executionExceptionMessageHeaderName` ("Execution-Exception-Message")
- `rootCauseExceptionTypeHeaderName` ("Root-Cause-Exception-Type")
- `rootCauseExceptionMessageHeaderName` ("Root-Cause-Exception-Message")

### JSONToGRPC

The `JSONToGRPCFilter` GatewayFilter Factory converts a JSON payload to a gRPC request.

The filter takes the following arguments:

- `protoDescriptor`: Proto descriptor file.

This file can be generated using `protoc` and specifying the `--descriptor_set_out` flag:

```bash
protoc --proto_path=src/main/resources/proto/ \
    --descriptor_set_out=src/main/resources/proto/hello.pb  \
    src/main/resources/proto/hello.proto
```

> [!NOTE] 
> `streaming` isn't supported.

The following configuration is an example of the JSONToGRPCFilter using the output from `protoc`:

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

The `LocalResponseCache` filter overrides the local response cache configuration for specific routes when global cache is activated.

The following list shows the configuration parameters:

- `size`: maximum allowed size of the cache entries for this route before cache eviction begins (in KB, MB and GB).
- `timeToLive`: allowed lifespan of a cache entry before expiration (use the duration suffix `s` for seconds, `m` for minutes, or `h` for hours).

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

The `MapRequestHeader` GatewayFilter Factory takes the `fromHeader` and `toHeader` parameters. The `MapRequestHeader` filter creates a new named header (`toHeader`), and the value is extracted out of an existing named header (`fromHeader`) from the incoming HTTP request. If the input header doesn't exist, the filter has no impact. If the new named header already exists, its values are augmented with the new values. The following example configures a `MapRequestHeader`:

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

This configuration adds the `X-Request-Red:<values>` header to the downstream request with updated values from the incoming HTTP request’s `Blue` header.

### PrefixPath

The `PrefixPath` GatewayFilter Factory takes a single `prefix` parameter. The following example configures a `PrefixPath` GatewayFilter:

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

This configuration prefixes `/api` to the path of all matching requests. So a request to `/catalog` is sent to `/api/catalog`.

### PreserveHostHeader

The `PreserveHostHeader` GatewayFilter Factory has no parameters. This filter sets a request attribute that the routing filter inspects to determine whether to send the original host header or the host header determined by the HTTP client. The following example configures a `PreserveHostHeader` GatewayFilter:

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

The `RedirectTo` GatewayFilter Factory takes `status` and `url` parameters. The `status` parameter should be a 300 series redirect HTTP code, such as 301. The `url` parameter should be a valid URL. This is the value of the `Location` header. For relative redirects, you should use `uri: no://op` as the URI of your route definition. The following listing configures a `RedirectTo` GatewayFilter:

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

This configuration sends a status `302` with a `Location:https://acme.org` header to perform a redirect.

### RemoveJsonAttributesResponseBody

The `RemoveJsonAttributesResponseBody` filter removes the JSON attributes and their values from JSON response bodies.

The following list shows the configuration parameters:

- `attribute names`: comma-separated list of the names of attributes to remove from a JSON response.
- `delete recursively`: (optional, boolean) configures the removal of attributes only at root level (`false`), or recursively (`true`) (default, `false`).

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

The `RemoveRequestHeader` GatewayFilter Factory takes `name` parameter, which is the name of the header to be removed. The following listing configures a `RemoveRequestHeader` GatewayFilter:

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

This configuration removes the `X-Request-Foo` header before it's sent downstream.

### RemoveRequestParameter

The `RemoveRequestParameter` GatewayFilter Factory takes `name` parameter, which is the name of the query parameter to be removed. The following example configures a `RemoveRequestParameter` GatewayFilter:

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

This configuration removes the `red` parameter before it's sent downstream.

### RemoveResponseHeader

The `RemoveResponseHeader` GatewayFilter factory takes `name` parameter, which is the name of the header to be removed. The following listing configures a `RemoveResponseHeader` GatewayFilter:

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

This configuration removes the `X-Response-Foo` header from the response before it's returned to the gateway client.

### RequestHeaderSize

The `RequestHeaderSize` GatewayFilter Factory takes `maxSize` and `errorHeaderName` parameters. The `maxSize` parameter is the maximum data size allowed by the request header (including key and value). The `errorHeaderName` parameter sets the name of the response header containing an error message. By default, the name of the response header is `errorMessage`. The following listing configures a `RequestHeaderSize` GatewayFilter:

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

This configuration sends a status 431 if size of any request header is greater than 1000 Bytes.

### RewriteLocationResponseHeader

The `RewriteLocationResponseHeader` GatewayFilter Factory modifies the value of the `Location` response header, usually to get rid of backend-specific details. It takes the `stripVersionMode`, `locationHeaderName`, `hostValue`, and `protocolsRegex` parameters. The following listing configures a `RewriteLocationResponseHeader` GatewayFilter:

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

For example, for a request of `POST` `api.example.com/some/object/name`, the `Location` response header value of `object-service.prod.example.net/v2/some/object/id` is rewritten as `api.example.com/some/object/id`.

The `stripVersionMode` parameter has the following possible values: `NEVER_STRIP`, `AS_IN_REQUEST` (default), and `ALWAYS_STRIP`.

- `NEVER_STRIP`: The version isn't stripped, even if the original request path contains no version.
- `AS_IN_REQUEST`: The version is stripped only if the original request path contains no version.
- `ALWAYS_STRIP`: The version is always stripped, even if the original request path contains version.

The `hostValue` parameter, if provided, is used to replace the `host:port` portion of the response `Location` header. If it isn't provided, the value of the `Host` request header is used.

The `protocolsRegex` parameter must be a valid regex `String`, against which the protocol name is matched. If it isn't matched, the filter doesn't work. The default is `http|https|ftp|ftps`.

### RewritePath

The `RewritePath` GatewayFilter Factory takes a path `regexp` parameter and a `replacement` parameter. This filter uses Java regular expressions for a flexible way to rewrite the request path. The following listing configures a `RewritePath` GatewayFilter:

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

For a request path of `/red/blue`, this configuration sets the path to `/blue` before making the downstream request.

### RewriteResponseHeader

The `RewriteResponseHeader` GatewayFilter Factory takes `name`, `regexp`, and `replacement` parameters. This filter uses Java regular expressions for a flexible way to rewrite the response header value. The following example configures a `RewriteResponseHeader` GatewayFilter:

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

For a header value of `/42?user=ford&password=omg!what&flag=true`, the configuration is set to `/42?user=ford&password=***&flag=true` after making the downstream request.

### SetPath

The `SetPath` GatewayFilter Factory takes a path `template` parameter. This filter offers a simple way to manipulate the request path by allowing templated segments of the path. This filter uses the URI templates from Spring Framework and allows multiple matching segments. The following example configures a `SetPath` GatewayFilter:

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

For a request path of `/red/blue`, this configuration sets the path to `/blue` before making the downstream request.

### SetRequestHeader

The `SetRequestHeader` GatewayFilter Factory takes `name` and `value` parameters. The following listing configures a `SetRequestHeader` GatewayFilter:

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

The `SetRequestHeader` replaces (rather than adding) all headers with the given name. So, if the downstream server responded with `X-Request-Red:1234`, it's replaced with `X-Request-Red:Blue`.

`SetRequestHeader` is aware of URI variables used to match a path or host. URI variables may be used in the value and are expanded at runtime. The following example configures an `SetRequestHeader` GatewayFilter that uses a variable:

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

The `SetResponseHeader` GatewayFilter Factory takes `name` and `value` parameters. The following listing configures a `SetResponseHeader` GatewayFilter:

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

The `SetResponseHeader` replaces (rather than adding) all headers with the given name. So, if the downstream server responded with `X-Response-Red:1234`, it's replaced with `X-Response-Red:Blue`.

`SetResponseHeader` is aware of URI variables used to match a path or host. URI variables may be used in the value and is expanded at runtime. The following example configures an `SetResponseHeader` GatewayFilter that uses a variable:

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

The `SetStatus` GatewayFilter Factory takes the `status` parameter, which must be a valid Spring `HttpStatus`. It may be the integer value `404` or the string representation of the enumeration: `NOT_FOUND`. The following listing configures a `SetStatus` GatewayFilter:

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

The `StripPrefix` GatewayFilter Factory takes the `parts` parameter. The `parts` parameter indicates the number of parts in the path to strip from the request before sending it downstream. The default value of the `parts` parameter is 1. The following listing configures a `StripPrefix` GatewayFilter:

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

When a request is made through the gateway to `/name/blue/red`, the request made to `nameservice` appears as `nameservice/red`.

### Retry

The `Retry` GatewayFilter Factory supports the following parameters:

- `retries`: The number of retries that should be attempted.
- `statuses`: The HTTP status codes that should be retried, represented by using `org.springframework.http.HttpStatus`.
- `methods`: The HTTP methods that should be retried, represented by using `org.springframework.http.HttpMethod`.
- `series`: The series of status codes to be retried, represented by using `org.springframework.http.HttpStatus.Series`.
- `exceptions`: A list of thrown exceptions that should be retried.
- `backoff`: The configured exponential backoff for the retries. Retries are performed after a backoff interval of `firstBackoff * (factor ^ n)`, where `n` is the iteration. If `maxBackoff` is configured, the maximum backoff applied is limited to `maxBackoff`. If `basedOnPreviousValue` is true, the `backoff` is calculated by using `prevBackoff * factor`.

The following defaults are configured for the `Retry` filter, when enabled:

- `retries`: Three times.
- `series`: 5XX series.
- `methods`: GET method.
- `exceptions`: IOException and TimeoutException.
- `backoff`: disabled.

The following listing configures a `Retry` GatewayFilter:

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

When the request size is greater than the permissible limit, the `RequestSize` GatewayFilter Factory can restrict a request from reaching the downstream service. The filter takes a `maxSize` parameter. The `maxSize` is a `DataSize` type, where values are defined as a number followed by an optional `DataUnit` suffix such as 'KB' or 'MB'. The default is 'B' for bytes. It's the permissible size limit of the request defined in bytes. The following listing configures a `RequestSize` GatewayFilter:

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

When the request is rejected due to size, the `RequestSize` GatewayFilter Factory sets the response status as `413 Payload Too Large` with an additional header `errorMessage`. The following example shows an `errorMessage`:

```bash
errorMessage : Request size is larger than permissible limit. Request size is 6.0 MB where permissible limit is 5.0 MB
```

### TokenRelay

The `TokenRelay` filter forwards `OAuth2` access token to downstream resources. This filter is configured as a `boolean` value in the route definition rather than an explicit filter:

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

## Use Commercial Filters

Spring Cloud Gateway for Kubernetes also provides many custom filters in addition to those included in the OSS project.

### AllowedRequestCookieCount

The `AllowedRequestCookieCount` filter determines if a matching request is allowed to proceed based on the number of cookies.

The following list shows the configuration parameters:

- `amount`: number of allowed cookies.

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

 The `AllowedRequestHeadersCount` filter determines if a matching request is allowed to proceed based on the number of headers.

The following list shows the configuration parameters:

- `amount`: number of allowed headers.

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

The `AllowedRequestQueryParamsCount` filter determines if a matching request is allowed to proceed based on the number query params.

The following list shows the configuration parameters:

- `amount`: number of allowed parameters.

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

The `BasicAuth` filter adds a `BasicAuth` `Authorization` header to requests. There are no parameters for this filter.

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

The `ClaimHeader` filter copies data from a JWT claim into an HTTP header.

The following list shows the configuration parameters:

- `Claim name`: case sensitive name of the claim to pass.
- `Header name`: name of the HTTP header.

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

The `ClientCertificateHeader` filter validates the `X-Forwarded-Client-Cert` header certificate.

The following list shows the configuration parameters:

- `domain pattern`: `X-Forwarded-Client-Cert` value according to Kubernetes's ability to recognize client certificate's CA.
- `certificate fingerprint`: (optional) SSL certificate's fingerprint.

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

The `Cors` filter activates the CORS validations on a route.

The following list shows the configuration parameters that are organized as key-value pairs for CORS options:

- `allowedOrigins`
- `allowedMethods`
- `allowedHeaders`
- `maxAge`
- `allowCredentials`
- `allowedOriginPatterns`

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

The `JsonToXml` filter transforms JSON response body into XML response body.

The following list shows the configuration parameters:

- `wrapper`: root tag name for the XML response if an additional root tag is required to generate valid XML. The default root tag name is `response`.

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

The `RateLimit` filter determines if a matching request is allowed to proceed based on request volume.

The following list shows the configuration parameters:

- `request limit`: maximum number of requests accepted during the window.
- `window duration`: window duration in milliseconds. Alternatively the `s`, `m` or `h` suffixes can be used to specify the duration in seconds, minutes, or hours.
- `partition source`: (optional) location of the partition key ('claim', 'header', or 'IPs').
- `partition key`: (optional) value used to partition request counters.

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

Following are some examples of other `RateLimit` configurations:

```
    RateLimit=1,10s
    RateLimit=1,10s,{claim:client_id}
    RateLimit=1,10s,{header:client_id}
    RateLimit=2,10s,{IPs:2;127.0.0.1;192.168.0.1}
```

### RestrictRequestHeaders

The `RestrictRequestHeaders` filter determines if a matching request is allowed to proceed based on the headers.

If there are any HTTP headers that are not in the `headerList` configuration (case insensitive), then a response of `431 Forbidden error` is returned to the client.

The following list shows the configuration parameters:

- `headerList`: list of names of allowed headers (case insensitive).

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

The `RewriteAllResponseHeaders` filter rewrites multiple response headers at once.

The following list shows the configuration parameters:

- `pattern to match`: regular expression to match against header values.
- `replacement`: replacement value.

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

The `RewriteResponseBody` filter modifies the body of a response.

The following list shows the configuration parameters that are organized as a comma-separated list of key-value pairs, where each pair takes the form `pattern to match:replacement`:

- `pattern to match`: regular expression to match against text in the response body.
- `replacement`: replacement value.

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

The `RewriteJsonAttributesResponseBody` rewrites JSON attributes using `JSONPath` notation.

The following list shows the configuration parameters that are organized as a comma-separated list of key-value pairs, where each pair takes the form `jsonpath:replacement`:

- `jsonpath`: `JSONPath` expression to match against the response body.
- `replacement`: replacement value.

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

The `Roles` filter authorizes requests that contain one of the configured roles.

The following list shows the configuration parameters:

- `roles`: comma-separated list of authorized roles.

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

The `Scopes` filter authorizes requests that contains one of the configured OAuth scopes.

The following list shows the configuration parameters:

- `scopes`: comma-separated list of authorized OAuth scopes.

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

The `StoreIPAddress` filter is used for extension development only and in context of the application.

The following list shows the configuration parameters:

- `attribute name`: name used to store the IP as an exchange attribute.

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

The `SSO login` filter redirects to authenticate if there's no valid authorization token. This filter is configured as a `boolean` value in the route definition rather than an explicit filter:

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

The `StoreHeader` filter stores a header value in the context of the application. This filter is used for extension development only.

The following list shows the configuration parameters:

- `headers`: list of headers to check (the first one found is used).
- `attribute name`: name used to store the header value as an exchange attribute.

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

The `XmlToJson` filter transforms XML response body into JSON response body. There are no parameters for this filter.

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
