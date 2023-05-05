---
title: Azure API Management policy reference - cors | Microsoft Docs
description: Reference for the cors policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 11/18/2022
ms.author: danlep
---

# CORS

The `cors` policy adds cross-origin resource sharing (CORS) support to an operation or an API to allow cross-domain calls from browser-based clients. 

[!INCLUDE [api-management-policy-form-alert](../../includes/api-management-policy-form-alert.md)]

## Policy statement

```xml
<cors allow-credentials="false | true" terminate-unmatched-request="true | false">
    <allowed-origins>
        <origin>origin uri</origin>
    </allowed-origins>
    <allowed-methods preflight-result-max-age="number of seconds">
        <method>HTTP verb</method>
    </allowed-methods>
    <allowed-headers>
        <header>header name</header>
    </allowed-headers>
    <expose-headers>
        <header>header name</header>
    </expose-headers>
</cors>
```

## Attributes

|Name|Description|Required|Default|
|----------|-----------------|--------------|-------------|
|allow-credentials|The `Access-Control-Allow-Credentials` header in the preflight response will be set to the value of this attribute and affect the client's ability to submit credentials in cross-domain requests. Policy expressions are allowed.|No|`false`|
|terminate-unmatched-request|Controls the processing of cross-origin requests that don't match the policy settings. Policy expressions are allowed.<br/><br/>When `OPTIONS` request is processed as a preflight request and `Origin` header doesn't match policy settings:<br/> - If the attribute is set to `true`, immediately terminate the request with an empty `200 OK` response<br/>- If the attribute is set to `false`, check inbound for other in-scope `cors` policies that are direct children of the inbound element and apply them. If no `cors` policies are found, terminate the request with an empty `200 OK` response. <br/><br/>When `GET` or `HEAD` request includes the `Origin` header (and therefore is processed as a simple cross-origin request), and doesn't match policy settings:<br/>- If the attribute is set to `true`, immediately terminate the request with an empty `200 OK` response.<br/> - If the attribute is set to `false`, allow the request to proceed normally and don't add CORS headers to the response.|No|`true`|

## Elements

|Name|Description|Required|Default|
|----------|-----------------|--------------|-------------|
|allowed-origins|Contains `origin` elements that describe the allowed origins for cross-domain requests. `allowed-origins` can contain either a single `origin` element that specifies `*` to allow any origin, or one or more `origin` elements that contain a URI.|Yes|N/A|
|allowed-methods|This element is required if methods other than `GET` or `POST` are allowed. Contains `method` elements that specify the supported HTTP verbs. The value `*` indicates all methods.|No|If this section isn't present, `GET` and `POST` are supported.|
|allowed-headers|This element contains `header` elements specifying names of the headers that can be included in the request.|Yes|N/A|
|expose-headers|This element contains `header` elements specifying names of the headers that will be accessible by the client.|No|N/A|

> [!CAUTION]
> Use the `*` wildcard with care in policy settings. This configuration may be overly permissive and may make an API more vulnerable to certain [API security threats](mitigate-owasp-api-threats.md#security-misconfiguration).


### allowed-origins elements

|Name|Description|Required|Default|
|----------|-----------------|--------------|-------------|
|origin|The value can be either `*` to allow all origins, or a URI that specifies a single origin. The URI must include a scheme, host, and port.|Yes|If the port is omitted in a URI, port 80 is used for HTTP and port 443 is used for HTTPS.|


### allowed-methods attributes

|Name|Description|Required|Default|
|----------|-----------------|--------------|-------------|
|preflight-result-max-age|The `Access-Control-Max-Age` header in the preflight response will be set to the value of this attribute and affect the user agent's ability to cache the preflight response. Policy expressions are allowed.|No|0|

### allowed-methods elements

|Name|Description|Required|Default|
|----------|-----------------|--------------|-------------|
|method|Specifies an HTTP verb. Policy expressions are allowed.|At least one `method` element is required if the `allowed-methods` section is present.|N/A|

### allowed-headers elements

|Name|Description|Required|Default|
|----------|-----------------|--------------|-------------|
|header|Specifies a header name.|At least one `header` element is required in `allowed-headers` if that section is present.|N/A|

### expose-headers elements

|Name|Description|Required|Default|
|----------|-----------------|--------------|-------------|
|header|Specifies a header name.|At least one `header` element is required in `expose-headers` if that section is present.|N/A|

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption, self-hosted

### Usage notes
 * You may configure the `cors` policy at more than one scope (for example, at the product scope and the global scope). Ensure that the `base` element is configured at the operation, API, and product scopes to inherit needed policies at the parent scopes. 
* Only the `cors` policy is evaluated on the `OPTIONS` request during preflight. Remaining configured policies are evaluated on the approved request. 

## About CORS

[CORS](https://developer.mozilla.org/docs/Web/HTTP/CORS) is an HTTP header-based standard that allows a browser and a server to interact and determine whether or not to allow specific cross-origin requests (`XMLHttpRequest` calls made from JavaScript on a web page to other domains). This allows for more flexibility than only allowing same-origin requests, but is more secure than allowing all cross-origin requests.

CORS specifies two types of [cross-origin requests](https://developer.mozilla.org/docs/Web/HTTP/CORS#specifications):

- **Preflighted (or "preflight") requests** - The browser first sends an HTTP request using the `OPTIONS` method to the server, to determine if the actual request is permitted to send. If the server response includes the `Access-Control-Allow-Origin` header that allows access, the browser follows with the actual request.

- **Simple requests** - These requests include one or more extra `Origin` headers but don't trigger a CORS preflight. Only requests using the `GET` and `HEAD` methods and a limited set of request headers are allowed.


## `cors` policy scenarios

Configure the `cors` policy in API Management for the following scenarios:

* Enable the interactive test console in the developer portal. Refer to the [developer portal documentation](./developer-portal-faq.md#cors) for details. 
    > [!NOTE]
    > When you enable CORS for the interactive console, by default API Management configures the `cors` policy at the global scope.

* Enable API Management to reply to preflight requests or to pass through simple CORS requests when the backends don't provide their own CORS support.

    > [!NOTE]
    > If a request matches an operation with an `OPTIONS` method defined in the API, preflight request processing logic associated with the `cors` policy will not be executed. Therefore, such operations can be used to implement custom preflight processing logic - for example, to apply the `cors` policy only under certain conditions.

## Common configuration issues

* **Subscription key in header** - If you configure the `cors` policy at the *product* scope, and your API uses subscription key authentication, the policy won't work when the subscription key is passed in a header. As a workaround, modify requests to include a subscription key as a query parameter.
* **API with header versioning** - If you configure the `cors` policy at the *API* scope, and your API uses a header-versioning scheme, the policy won't work because the version is passed in a header. You may need to configure an alternative versioning method such as a path or query parameter. 
* **Policy order** - You may experience unexpected behavior if the `cors` policy is not the first policy in the inbound section. Select **Calculate effective policy** in the policy editor to check the [policy evaluation order](set-edit-policies.md#use-base-element-to-set-policy-evaluation-order) at each scope. Generally, only the first `cors` policy is applied.
* **Empty 200 OK response** - In some policy configurations, certain cross-origin requests complete with an empty `200 OK` response. This response is expected when `terminate-unmatched-request` is set to its default value of `true` and an incoming request has an `Origin` header that doesn’t match an allowed origin configured in the `cors` policy. 

## Example

This example demonstrates how to support [preflight requests](https://developer.mozilla.org/docs/Web/HTTP/CORS#preflighted_requests), such as those with custom headers or methods other than `GET` and `POST`. To support custom headers and other HTTP verbs, use the `allowed-methods` and `allowed-headers` sections as shown in the following example.

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

## Related policies

* [API Management cross-domain policies](api-management-cross-domain-policies.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]