---
title: Cross-Origin Resource Sharing (CORS) Support | Microsoft Docs
description: Learn how to enable CORS Support for the Microsoft Azure Storage Services.
services: storage
author: cbrooksmsft
ms.service: storage
ms.devlang: dotnet
ms.topic: article
ms.date: 2/22/2017
ms.author: cbrooks
ms.component: common
---
# Cross-Origin Resource Sharing (CORS) Support for the Azure Storage Services
Beginning with version 2013-08-15, the Azure storage services support Cross-Origin Resource Sharing (CORS) for the Blob, Table, Queue, and File services. CORS is an HTTP feature that enables a web application running under one domain to access resources in another domain. Web browsers implement a security restriction known as [same-origin policy](http://www.w3.org/Security/wiki/Same_Origin_Policy) that prevents a web page from calling APIs in a different domain; CORS provides a secure way to allow one domain (the origin domain) to call APIs in another domain. See the [CORS specification](http://www.w3.org/TR/cors/) for details on CORS.

You can set CORS rules individually for each of the storage services, by calling [Set Blob Service Properties](https://msdn.microsoft.com/library/hh452235.aspx), [Set Queue Service Properties](https://msdn.microsoft.com/library/hh452232.aspx), and [Set Table Service Properties](https://msdn.microsoft.com/library/hh452240.aspx). Once you set the CORS rules for the service, then a properly authorized request made against the service from a different domain will be evaluated to determine whether it is allowed according to the rules you have specified.

> [!NOTE]
> Note that CORS is not an authentication mechanism. Any request made against a storage resource when CORS is enabled must either have a proper authentication signature, or must be made against a public resource.
> 
> 

## Understanding CORS requests
A CORS request from an origin domain may consist of two separate requests:

* A preflight request, which queries the CORS restrictions imposed by the service. The preflight request is required unless the request method is a [simple method](http://www.w3.org/TR/cors/), meaning GET, HEAD, or POST.
* The actual request, made against the desired resource.

### Preflight request
The preflight request queries the CORS restrictions that have been established for the storage service by the account owner. The web browser (or other user agent) sends an OPTIONS request that includes the request headers, method and origin domain. The storage service evaluates the intended operation based on a pre-configured set of CORS rules that specify which origin domains, request methods, and request headers may be specified on an actual request against a storage resource.

If CORS is enabled for the service and there is a CORS rule that matches the preflight request, the service responds with status code 200 (OK), and includes the required Access-Control headers in the response.

If CORS is not enabled for the service or no CORS rule matches the preflight request, the service will respond with status code 403 (Forbidden).

If the OPTIONS request doesn't contain the required CORS headers (the Origin and Access-Control-Request-Method headers), the service will respond with status code 400 (Bad request).

Note that a preflight request is evaluated against the service (Blob, Queue, and Table) and not against the requested resource. The account owner must have enabled CORS as part of the account service properties in order for the request to succeed.

### Actual request
Once the preflight request is accepted and the response is returned, the browser will dispatch the actual request against the storage resource. The browser will deny the actual request immediately if the preflight request is rejected.

The actual request is treated as normal request against the storage service. The presence of the Origin header indicates that the request is a CORS request and the service will check the matching CORS rules. If a match is found, the Access-Control headers are added to the response and sent back to the client. If a match is not found, the CORS Access-Control headers are not returned.

## Enabling CORS for the Azure Storage services
CORS rules are set at the service level, so you need to enable or disable CORS for each service (Blob, Queue and Table) separately. By default, CORS is disabled for each service. To enable CORS, you need to set the appropriate service properties using version 2013-08-15 or later, and add CORS rules to the service properties. For details about how to enable or disable CORS for a service and how to set CORS rules, please refer to [Set Blob Service Properties](https://msdn.microsoft.com/library/hh452235.aspx), [Set Queue Service Properties](https://msdn.microsoft.com/library/hh452232.aspx), and [Set Table Service Properties](https://msdn.microsoft.com/library/hh452240.aspx).

Here is a sample of a single CORS rule, specified via a Set Service Properties operation:

```xml
<Cors>    
    <CorsRule>
        <AllowedOrigins>http://www.contoso.com, http://www.fabrikam.com</AllowedOrigins>
        <AllowedMethods>PUT,GET</AllowedMethods>
        <AllowedHeaders>x-ms-meta-data*,x-ms-meta-target*,x-ms-meta-abc</AllowedHeaders>
        <ExposedHeaders>x-ms-meta-*</ExposedHeaders>
        <MaxAgeInSeconds>200</MaxAgeInSeconds>
    </CorsRule>
<Cors>
```

Each element included in the CORS rule is described below:

* **AllowedOrigins**: The origin domains that are permitted to make a request against the storage service via CORS. The origin domain is the domain from which the request originates. Note that the origin must be an exact case-sensitive match with the origin that the user age sends to the service. You can also use the wildcard character '*' to allow all origin domains to make requests via CORS. In the example above, the domains [http://www.contoso.com](http://www.contoso.com) and [http://www.fabrikam.com](http://www.fabrikam.com) can make requests against the service using CORS.
* **AllowedMethods**: The methods (HTTP request verbs) that the origin domain may use for a CORS request. In the example above, only PUT and GET requests are permitted.
* **AllowedHeaders**: The request headers that the origin domain may specify on the CORS request. In the example above, all metadata headers starting with x-ms-meta-data, x-ms-meta-target, and x-ms-meta-abc are permitted. Note that the wildcard character '*' indicates that any header beginning with the specified prefix is allowed.
* **ExposedHeaders**: The response headers that may be sent in the response to the CORS request and exposed by the browser to the request issuer. In the example above, the browser is instructed to expose any header beginning with x-ms-meta.
* **MaxAgeInSeconds**: The maximum amount time that a browser should cache the preflight OPTIONS request.

The Azure storage services support specifying prefixed headers for both the **AllowedHeaders** and **ExposedHeaders** elements. To allow a category of headers, you can specify a common prefix to that category. For example, specifying *x-ms-meta** as a prefixed header establishes a rule that will match all headers that begin with x-ms-meta.

The following limitations apply to CORS rules:

* You can specify up to five CORS rules per storage service (Blob, Table, and Queue).
* The maximum size of all CORS rules settings on the request, excluding XML tags, should not exceed 2 KB.
* The length of an allowed header, exposed header, or allowed origin should not exceed 256 characters.
* Allowed headers and exposed headers may be either:
  * Literal headers, where the exact header name is provided, such as **x-ms-meta-processed**. A maximum of 64 literal headers may be specified on the request.
  * Prefixed headers, where a prefix of the header is provided, such as **x-ms-meta-data***. Specifying a prefix in this manner allows or exposes any header that begins with the given prefix. A maximum of two prefixed headers may be specified on the request.
* The methods (or HTTP verbs) specified in the **AllowedMethods** element must conform to the methods supported by Azure storage service APIs. Supported methods are DELETE, GET, HEAD, MERGE, POST, OPTIONS and PUT.

## Understanding CORS rule evaluation logic
When a storage service receives a preflight or actual request, it evaluates that request based on the CORS rules you have established for the service via the appropriate Set Service Properties operation. CORS rules are evaluated in the order in which they were set in the request body of the Set Service Properties operation.

CORS rules are evaluated as follows:

1. First, the origin domain of the request is checked against the domains listed for the **AllowedOrigins** element. If the origin domain is included in the list, or all domains are allowed with the wildcard character '*', then rules evaluation proceeds. If the origin domain is not included, then the request fails.
2. Next, the method (or HTTP verb) of the request is checked against the methods listed in the **AllowedMethods** element. If the method is included in the list, then rules evaluation proceeds; if not, then the request fails.
3. If the request matches a rule in its origin domain and its method, that rule is selected to process the request and no further rules are evaluated. Before the request can succeed, however, any headers specified on the request are checked against the headers listed in the **AllowedHeaders** element. If the headers sent do not match the allowed headers, the request fails.

Since the rules are processed in the order they are present in the request body, best practices recommend that you specify the most restrictive rules with respect to origins first in the list, so that these are evaluated first. Specify rules that are less restrictive – for example, a rule to allow all origins – at the end of the list.

### Example – CORS rules evaluation
The following example shows a partial request body for an operation to set CORS rules for the storage services. See [Set Blob Service Properties](https://msdn.microsoft.com/library/hh452235.aspx), [Set Queue Service Properties](https://msdn.microsoft.com/library/hh452232.aspx), and [Set Table Service Properties](https://msdn.microsoft.com/library/hh452240.aspx) for details on constructing the request.

```xml
<Cors>
    <CorsRule>
        <AllowedOrigins>http://www.contoso.com</AllowedOrigins>
        <AllowedMethods>PUT,HEAD</AllowedMethods>
        <MaxAgeInSeconds>5</MaxAgeInSeconds>
        <ExposedHeaders>x-ms-*</ExposedHeaders>
        <AllowedHeaders>x-ms-blob-content-type, x-ms-blob-content-disposition</AllowedHeaders>
    </CorsRule>
    <CorsRule>
        <AllowedOrigins>*</AllowedOrigins>
        <AllowedMethods>PUT,GET</AllowedMethods>
        <MaxAgeInSeconds>5</MaxAgeInSeconds>
        <ExposedHeaders>x-ms-*</ExposedHeaders>
        <AllowedHeaders>x-ms-blob-content-type, x-ms-blob-content-disposition</AllowedHeaders>
    </CorsRule>
    <CorsRule>
        <AllowedOrigins>http://www.contoso.com</AllowedOrigins>
        <AllowedMethods>GET</AllowedMethods>
        <MaxAgeInSeconds>5</MaxAgeInSeconds>
        <ExposedHeaders>x-ms-*</ExposedHeaders>
        <AllowedHeaders>x-ms-client-request-id</AllowedHeaders>
    </CorsRule>
</Cors>
```

Next, consider the following CORS requests:

| Request |  |  | Response |  |
| --- | --- | --- | --- | --- |
| **Method** |**Origin** |**Request Headers** |**Rule Match** |**Result** |
| **PUT** |http://www.contoso.com |x-ms-blob-content-type |First rule |Success |
| **GET** |http://www.contoso.com |x-ms-blob-content-type |Second rule |Success |
| **GET** |http://www.contoso.com |x-ms-client-request-id |Second rule |Failure |

The first request matches the first rule – the origin domain matches the allowed origins, the method matches the allowed methods, and the header matches the allowed headers – and so succeeds.

The second request does not match the first rule because the method does not match the allowed methods. It does, however, match the second rule, so it succeeds.

The third request matches the second rule in its origin domain and method, so no further rules are evaluated. However, the *x-ms-client-request-id header* is not allowed by the second rule, so the request fails, despite the fact that the semantics of the third rule would have allowed it to succeed.

> [!NOTE]
> Although this example shows a less restrictive rule before a more restrictive one, in general the best practice is to list the most restrictive rules first.
> 
> 

## Understanding how the Vary header is set
The *Vary* header is a standard HTTP/1.1 header consisting of a set of request header fields that advise the browser or user agent about the criteria that were selected by the server to process the request. The *Vary* header is mainly used for caching by proxies, browsers, and CDNs, which use it to determine how the response should be cached. For details, see the specification for the [Vary header](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html).

When the browser or another user agent caches the response from a CORS request, the origin domain is cached as the allowed origin. When a second domain issues the same request for a storage resource while the cache is active, the user agent retrieves the cached origin domain. The second domain does not match the cached domain, so the request fails when it would otherwise succeed. In certain cases, Azure Storage sets the Vary header to **Origin** to instruct the user agent to send the subsequent CORS request to the service when the requesting domain differs from the cached origin.

Azure Storage sets the *Vary* header to **Origin** for actual GET/HEAD requests in the following cases:

* When the request origin exactly matches the allowed origin defined by a CORS rule. To be an exact match, the CORS rule may not include a wildcard ' * ' character.
* There is no rule matching the request origin, but CORS is enabled for the storage service.

In the case where a GET/HEAD request matches a CORS rule that allows all origins, the response indicates that all origins are allowed, and the user agent cache will allow subsequent requests from any origin domain while the cache is active.

Note that for requests using methods other than GET/HEAD, the storage services will not set the Vary header, since responses to these methods are not cached by user agents.

The following table indicates how Azure storage will respond to GET/HEAD requests based on the previously mentioned cases:

| Request | Account setting and result of rule evaluation |  |  | Response |  |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Origin header present on request** |**CORS rule(s) specified for this service** |**Matching rule exists that allows all origins(*)** |**Matching rule exists for exact origin match** |**Response includes Vary header set to Origin** |**Response includes Access-Control-Allowed-Origin: "*"** |**Response includes Access-Control-Exposed-Headers** |
| No |No |No |No |No |No |No |
| No |Yes |No |No |Yes |No |No |
| No |Yes |Yes |No |No |Yes |Yes |
| Yes |No |No |No |No |No |No |
| Yes |Yes |No |Yes |Yes |No |Yes |
| Yes |Yes |No |No |Yes |No |No |
| Yes |Yes |Yes |No |No |Yes |Yes |

## Billing for CORS requests
Successful preflight requests are billed if you have enabled CORS for any of the storage services for your account (by calling [Set Blob Service Properties](https://msdn.microsoft.com/library/hh452235.aspx), [Set Queue Service Properties](https://msdn.microsoft.com/library/hh452232.aspx), or [Set Table Service Properties](https://msdn.microsoft.com/library/hh452240.aspx)). To minimize charges, consider setting the **MaxAgeInSeconds** element in your CORS rules to a large value so that the user agent caches the request.

Unsuccessful preflight requests will not be billed.

## Next steps
[Set Blob Service Properties](https://msdn.microsoft.com/library/hh452235.aspx)

[Set Queue Service Properties](https://msdn.microsoft.com/library/hh452232.aspx)

[Set Table Service Properties](https://msdn.microsoft.com/library/hh452240.aspx)

[W3C Cross-Origin Resource Sharing Specification](http://www.w3.org/TR/cors/)

