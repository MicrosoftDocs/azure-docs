---
title: Azure API Management cross domain policies | Microsoft Docs
description: Reference for the cross domain policies available for use in Azure API Management, which enables cross domain calls from various clients. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: reference
ms.date: 06/03/2022
ms.author: danlep
---
# API Management cross domain policies
This article provides a reference for API Management policies used to enable cross domain calls from different clients. 

[!INCLUDE [api-management-policy-intro-links](../../includes/api-management-policy-intro-links.md)]

## <a name="CrossDomainPolicies"></a> Cross domain policies

- [Allow cross-domain calls](api-management-cross-domain-policies.md#AllowCrossDomainCalls) - Makes the API accessible from Adobe Flash and Microsoft Silverlight browser-based clients.
- [CORS](api-management-cross-domain-policies.md#CORS) - Adds cross-origin resource sharing (CORS) support to an operation or an API to allow cross-domain calls from browser-based clients.
- [JSONP](api-management-cross-domain-policies.md#JSONP) - Adds JSON with padding (JSONP) support to an operation or an API to allow cross-domain calls from JavaScript browser-based clients.

## <a name="AllowCrossDomainCalls"></a> Allow cross-domain calls
Use the `cross-domain` policy to make the API accessible from Adobe Flash and Microsoft Silverlight browser-based clients.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]


### Policy statement

```xml
<cross-domain>
    <!-Policy configuration is in the Adobe cross-domain policy file format,
        see https://www.adobe.com/devnet-docs/acrobatetk/tools/AppSec/CrossDomain_PolicyFile_Specification.pdf-->
</cross-domain>
```

### Example

```xml
<cross-domain>
    <cross-domain-policy>
        <allow-http-request-headers-from domain='*' headers='*' />
    </cross-domain-policy>
</cross-domain>
```

### Elements

|Name|Description|Required|
|----------|-----------------|--------------|
|cross-domain|Root element. Child elements must conform to the [Adobe cross-domain policy file specification](https://www.adobe.com/devnet-docs/acrobatetk/tools/AppSec/CrossDomain_PolicyFile_Specification.pdf).|Yes|

> [!CAUTION]
> Use the `*` wildcard with care in policy settings. This configuration may be overly permissive and may make an API more vulnerable to certain [API security threats](mitigate-owasp-api-threats.md#security-misconfiguration).

### Usage
This policy can be used in the following policy [sections](./api-management-howto-policies.md#sections) and [scopes](./api-management-howto-policies.md#scopes).

- **Policy sections:** inbound
- **Policy scopes:** global

## <a name="CORS"></a> CORS
The `cors` policy adds cross-origin resource sharing (CORS) support to an operation or an API to allow cross-domain calls from browser-based clients. 

> [!IMPORTANT]
> If you configure the CORS policy at the product scope, and your API uses subscription key authentication, the policy will only work when requests include a subscription key as a query parameter. 

[!INCLUDE [api-management-policy-form-alert](../../includes/api-management-policy-form-alert.md)]

### About CORS

[CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) is an HTTP header-based mechanism that allows a browser and a server to interact and determine whether or not to allow specific cross-origin requests (such as `XMLHttpRequest` calls made from JavaScript on a web page to other domains). This allows for more flexibility than only allowing same-origin requests, but is more secure than allowing all cross-origin requests.

CORS specifies two kinds of [requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#specifications):

1. **Preflighted (also called preflight) requests** - The browser first sends an HTTP request using the `OPTIONS` method to the server, to determine if the actual request is safe to send. If the server approves the preflight request and origin, the browser follows with the actual request.
    > [!NOTE]
    > Only the CORS policy is executed on a preflight request. Any remaining policies in the policy configuration execute only on the approved request.

1. **Simple requests** - These requests include extra `Origin` headers but don't trigger a CORS preflight. Only the `GET`, `HEAD`, and `POST` methods and a limited set of request headers are allowed. Normal policy execution takes place.

### CORS policy scenarios

Apply the CORS policy in API Management for the following scenarios:

* Enable the interactive test console in the developer portal. Refer to the [developer portal documentation](./developer-portal-faq.md#cors) for details.
* Enable API Management to reply to preflight requests (using the `OPTIONS` method) or to pass through simple CORS requests when the backends don't provide their own CORS support.

> [!NOTE]
> If a request matches an operation with an `OPTIONS` method defined in the API, preflight request processing logic associated with CORS policies will not be executed. Therefore, such operations can be used to implement custom preflight processing logic. 

### Preflight failures with CORS policy

Preflight requests, consisting of an `OPTIONS` HTTP request, support only CORS-specific headers. When the CORS policy is configured at the product or API scope and a request to API Management contains headers that aren't supported by CORS, a preflight failure may occur and the request will fail. Examples:

* If you configure the CORS policy at the product scope, and your API uses subscription key authentication, the policy won't work when the subscription key is passed in a header. In this case, API Management requires the subscription key to resolve the product. As a workaround, modify requests to include a subscription key as a query parameter.
* If you configure the CORS policy at the API scope, and your API uses a header-versioning scheme, the policy won't work when the version is passed in a header. In this case, API Management requires the version to resolve the API. You may need to configure an alternative versioning method such as a path or query parameter.   

### Policy statement

```xml
<cors allow-credentials="false|true" terminate-unmatched-request="true|false">
    <allowed-origins>
        <origin>origin uri</origin>
    </allowed-origins>
    <allowed-methods preflight-result-max-age="number of seconds">
        <method>http verb</method>
    </allowed-methods>
    <allowed-headers>
        <header>header name</header>
    </allowed-headers>
    <expose-headers>
        <header>header name</header>
    </expose-headers>
</cors>
```

### Example
This example demonstrates how to support [preflight requests](https://developer.mozilla.org/docs/Web/HTTP/CORS#preflighted_requests), such as those with custom headers or methods other than `GET` and `POST`. To support custom headers and additional HTTP verbs, use the `allowed-methods` and `allowed-headers` sections as shown in the following example.

```xml
<cors allow-credentials="true">
    <allowed-origins>
        <!-- Localhost useful for development -->
        <origin>http://localhost:8080/</origin>
        <origin>http://example.com/</origin>
    </allowed-origins>
    <allowed-methods preflight-result-max-age="300">
        <method>GET</method>
        <method>POST</method>
        <method>PATCH</method>
        <method>DELETE</method>
    </allowed-methods>
    <allowed-headers>
        <!-- Examples below show Azure Mobile Services headers -->
        <header>x-zumo-installation-id</header>
        <header>x-zumo-application</header>
        <header>x-zumo-version</header>
        <header>x-zumo-auth</header>
        <header>content-type</header>
        <header>accept</header>
    </allowed-headers>
    <expose-headers>
        <!-- Examples below show Azure Mobile Services headers -->
        <header>x-zumo-installation-id</header>
        <header>x-zumo-application</header>
    </expose-headers>
</cors>
```

### Elements

|Name|Description|Required|Default|
|----------|-----------------|--------------|-------------|
|cors|Root element.|Yes|N/A|
|allowed-origins|Contains `origin` elements that describe the allowed origins for cross-domain requests. `allowed-origins` can contain either a single `origin` element that specifies `*` to allow any origin, or one or more `origin` elements that contain a URI.|Yes|N/A|
|origin|The value can be either `*` to allow all origins, or a URI that specifies a single origin. The URI must include a scheme, host, and port.|Yes|If the port is omitted in a URI, port 80 is used for HTTP and port 443 is used for HTTPS.|
|allowed-methods|This element is required if methods other than `GET` or `POST` are allowed. Contains `method` elements that specify the supported HTTP verbs. The value `*` indicates all methods.|No|If this section is not present, `GET` and `POST` are supported.|
|method|Specifies an HTTP verb.|At least one `method` element is required if the `allowed-methods` section is present.|N/A|
|allowed-headers|This element contains `header` elements specifying names of the headers that are included in the request.|Yes|N/A|
|expose-headers|This element contains `header` elements specifying names of the headers that will be accessible by the client.|No|N/A|
|header|Specifies a header name.|At least one `header` element is required in `allowed-headers` and at least one in `expose-headers` if that section is present.|N/A|

> [!CAUTION]
> Use the `*` wildcard with care in policy settings. This configuration may be overly permissive and may make an API more vulnerable to certain [API security threats](mitigate-owasp-api-threats.md#security-misconfiguration).

### Attributes

|Name|Description|Required|Default|
|----------|-----------------|--------------|-------------|
|allow-credentials|The `Access-Control-Allow-Credentials` header in the preflight response will be set to the value of this attribute and affect the client's ability to submit credentials in cross-domain requests.|No|false|
|terminate-unmatched-request|This attribute controls the processing of cross-origin requests that don't match the CORS policy settings. When `OPTIONS` request is processed as a preflight request and doesn't match CORS policy settings: If the attribute is set to `true`, immediately terminate the request with an empty `200 OK` response; If the attribute is set to `false`, check inbound for other in-scope CORS policies that are direct children of the inbound element and apply them.  If no CORS policies are found, terminate the request with an empty `200 OK` response. When `GET` or `HEAD` request includes the `Origin` header (and therefore is processed as a cross-origin request) and doesn't match CORS policy settings: If the attribute is set to `true`, immediately terminate the request with an empty `200 OK` response; If the attribute is set to `false`, allow the request to proceed normally and don't add CORS headers to the response.|No|true|
|preflight-result-max-age|The `Access-Control-Max-Age` header in the preflight response will be set to the value of this attribute and affect the user agent's ability to cache the preflight response.|No|0|

### Usage
This policy can be used in the following policy [sections](./api-management-howto-policies.md#sections) and [scopes](./api-management-howto-policies.md#scopes).

- **Policy sections:** inbound
- **Policy scopes:** all scopes

> [!IMPORTANT]
> * You may configure this policy at more than one scope (for example, at the product scope and the global scope). However, API Management only evaluates the *first* occurrence of the policy in the policy definition, as determined by the [policy evaluation order](set-edit-policies.md#use-base-element-to-set-policy-evaluation-order). 
* Ensure that the `base` element is configured properly at the operation, API, and product scopes to inherit any expected policies at the parent scopes. Select **Calculate effective policy** in the policy editor in the portal to check your policy evaluation order.
> * It's recommended to order your policies so that the CORS policy is effectively the first in the `<inbound />` section. 

## <a name="JSONP"></a> JSONP
The `jsonp` policy adds JSON with padding (JSONP) support to an operation or an API to allow cross-domain calls from JavaScript browser-based clients. JSONP is a method used in JavaScript programs to request data from a server in a different domain. JSONP bypasses the limitation enforced by most web browsers where access to web pages must be in the same domain.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

### Policy statement

```xml
<jsonp callback-parameter-name="callback function name" />
```

### Example

```xml
<jsonp callback-parameter-name="cb" />
```

If you call the method without the callback parameter `?cb=XXX`, it will return plain JSON (without a function call wrapper).

If you add the callback parameter `?cb=XXX`, it will return a JSONP result, wrapping the original JSON results around the callback function like `XYZ('<json result goes here>');`

### Elements

|Name|Description|Required|
|----------|-----------------|--------------|
|jsonp|Root element.|Yes|

### Attributes

|Name|Description|Required|Default|
|----------|-----------------|--------------|-------------|
|callback-parameter-name|The cross-domain JavaScript function call prefixed with the fully qualified domain name where the function resides.|Yes|N/A|

### Usage
This policy can be used in the following policy [sections](./api-management-howto-policies.md#sections) and [scopes](./api-management-howto-policies.md#scopes).

- **Policy sections:** outbound
- **Policy scopes:** all scopes

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]
