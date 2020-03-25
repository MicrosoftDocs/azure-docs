---
title: Azure API Management cross domain policies | Microsoft Docs
description: Learn about the cross domain policies available for use in Azure API Management.
services: api-management
documentationcenter: ''
author: vladvino
manager: erikre
editor: ''

ms.assetid: 7689d277-8abe-472a-a78c-e6d4bd43455d
ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 11/28/2017
ms.author: apimpm
---
# API Management cross domain policies
This topic provides a reference for the following API Management policies. For information on adding and configuring policies, see [Policies in API Management](https://go.microsoft.com/fwlink/?LinkID=398186).

## <a name="CrossDomainPolicies"></a> Cross domain policies

- [Allow cross-domain calls](api-management-cross-domain-policies.md#AllowCrossDomainCalls) - Makes the API accessible from Adobe Flash and Microsoft Silverlight browser-based clients.
- [CORS](api-management-cross-domain-policies.md#CORS) - Adds cross-origin resource sharing (CORS) support to an operation or an API to allow cross-domain calls from browser-based clients.
- [JSONP](api-management-cross-domain-policies.md#JSONP) - Adds JSON with padding (JSONP) support to an operation or an API to allow cross-domain calls from JavaScript browser-based clients.

## <a name="AllowCrossDomainCalls"></a> Allow cross-domain calls
Use the `cross-domain` policy to make the API accessible from Adobe Flash and Microsoft Silverlight browser-based clients.

### Policy statement

```xml
<cross-domain>
    <!-Policy configuration is in the Adobe cross-domain policy file format,
        see https://www.adobe.com/devnet/articles/crossdomain_policy_file_spec.html-->
</cross-domain>
```

### Example

```xml
<cross-domain>
    <cross-domain>
        <allow-http-request-headers-from domain='*' headers='*' />
    </cross-domain>
</cross-domain>
```

### Elements

|Name|Description|Required|
|----------|-----------------|--------------|
|cross-domain|Root element. Child elements must conform to the [Adobe cross-domain policy file specification](https://www.adobe.com/devnet/articles/crossdomain_policy_file_spec.html).|Yes|

### Usage
This policy can be used in the following policy [sections](https://azure.microsoft.com/documentation/articles/api-management-howto-policies/#sections) and [scopes](https://azure.microsoft.com/documentation/articles/api-management-howto-policies/#scopes).

- **Policy sections:** inbound
- **Policy scopes:** all scopes

## <a name="CORS"></a> CORS
The `cors` policy adds cross-origin resource sharing (CORS) support to an operation or an API to allow cross-domain calls from browser-based clients.

CORS allows a browser and a server to interact and determine whether or not to allow specific cross-origin requests (i.e. XMLHttpRequests calls made from JavaScript on a web page to other domains). This allows for more flexibility than only allowing same-origin requests, but is more secure than allowing all cross-origin requests.

### Policy statement

```xml
<cors allow-credentials="false|true">
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
This example demonstrates how to support pre-flight requests, such as those with custom headers or methods other than GET and POST. To support custom headers and additional HTTP verbs, use the `allowed-methods` and `allowed-headers` sections as shown in the following example.

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
|allowed-methods|This element is required if methods other than GET or POST are allowed. Contains `method` elements that specify the supported HTTP verbs. The value `*` indicates all methods.|No|If this section is not present, GET and POST are supported.|
|method|Specifies an HTTP verb.|At least one `method` element is required if the `allowed-methods` section is present.|N/A|
|allowed-headers|This element contains `header` elements specifying names of the headers that can be included in the request.|No|N/A|
|expose-headers|This element contains `header` elements specifying names of the headers that will be accessible by the client.|No|N/A|
|header|Specifies a header name.|At least one `header` element is required in `allowed-headers` or `expose-headers` if the section is present.|N/A|

### Attributes

|Name|Description|Required|Default|
|----------|-----------------|--------------|-------------|
|allow-credentials|The `Access-Control-Allow-Credentials` header in the preflight response will be set to the value of this attribute and affect the client's ability to submit credentials in cross-domain requests.|No|false|
|preflight-result-max-age|The `Access-Control-Max-Age` header in the preflight response will be set to the value of this attribute and affect the user agent's ability to cache pre-flight response.|No|0|

### Usage
This policy can be used in the following policy [sections](https://azure.microsoft.com/documentation/articles/api-management-howto-policies/#sections) and [scopes](https://azure.microsoft.com/documentation/articles/api-management-howto-policies/#scopes).

- **Policy sections:** inbound
- **Policy scopes:** all scopes

## <a name="JSONP"></a> JSONP
The `jsonp` policy adds JSON with padding (JSONP) support to an operation or an API to allow cross-domain calls from JavaScript browser-based clients. JSONP is a method used in JavaScript programs to request data from a server in a different domain. JSONP bypasses the limitation enforced by most web browsers where access to web pages must be in the same domain.

### Policy statement

```xml
<jsonp callback-parameter-name="callback function name" />
```

### Example

```xml
<jsonp callback-parameter-name="cb" />
```

If you call the method without the callback parameter ?cb=XXX it will return plain JSON (without a function call wrapper).

If you add the callback parameter `?cb=XXX` it will return a JSONP result, wrapping the original JSON results around the callback function like `XYZ('<json result goes here>');`

### Elements

|Name|Description|Required|
|----------|-----------------|--------------|
|jsonp|Root element.|Yes|

### Attributes

|Name|Description|Required|Default|
|----------|-----------------|--------------|-------------|
|callback-parameter-name|The cross-domain JavaScript function call prefixed with the fully qualified domain name where the function resides.|Yes|N/A|

### Usage
This policy can be used in the following policy [sections](https://azure.microsoft.com/documentation/articles/api-management-howto-policies/#sections) and [scopes](https://azure.microsoft.com/documentation/articles/api-management-howto-policies/#scopes).

- **Policy sections:** outbound
- **Policy scopes:** all scopes

## Next steps

For more information working with policies, see:

+ [Policies in API Management](api-management-howto-policies.md)
+ [Transform APIs](transform-api.md)
+ [Policy Reference](api-management-policy-reference.md) for a full list of policy statements and their settings
+ [Policy samples](policy-samples.md)
