---
title: Azure API Management policy reference - send-request | Microsoft Docs
description: Reference for the send-request policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 08/02/2023
ms.author: danlep
---

# Send request

The `send-request` policy sends the provided request to the specified URL, waiting no longer than the set timeout value.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]


## Policy statement

```xml
<send-request mode="new | copy" response-variable-name="" timeout="60 sec" ignore-error
="false | true">
  <set-url>request URL</set-url>
  <set-method>...</set-method>
  <set-header>...</set-header>
  <set-body>...</set-body>
  <authentication-certificate thumbprint="thumbprint" />
  <proxy>...</proxy>
</send-request>
```

## Attributes

| Attribute                       | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Required | Default  |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | -------- |
| mode                  | Determines whether this is a `new` request or a `copy` of the headers and body in the current request. In the outbound policy section, `mode=copy` does not initialize the request body. Policy expressions are allowed.                                                                                                                                                                                                                                                                                                                                                                                                                                                              | No       | `new`      |
| response-variable-name | The name of context variable that will receive a response object. If the variable doesn't exist, it will be created upon successful execution of the policy and will become accessible via [`context.Variable`](api-management-policy-expressions.md#ContextVariables) collection. Policy expressions are allowed.                                                                                                                                                                                                                                                                                                                         | Yes      | N/A      |
| timeout               | The timeout interval in seconds before the call to the URL fails. Policy expressions are allowed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | No       | 60       |
| ignore-error                    | If `true` and the request results in an error, the error will be ignored, and the response variable will contain a null value. Policy expressions aren't allowed.                                                                                                                                                                                                                                                                                                                                                                                  | No       | `false`    |

## Elements

| Element                    | Description                                                                                                 | Required                        |
| -------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------- |
| set-url                        | The URL of the request. Policy expressions are allowed.                                                                                    | No if `mode=copy`; otherwise yes. |
| [set-method](set-method-policy.md)                     | Sets the method of the request. Policy expressions aren't allowed.                                                      | No if `mode=copy`; otherwise yes. |
| [set-header](set-header-policy.md)                     | Sets a header in the request. Use multiple `set-header` elements for multiple request headers.                                  | No                              |
| [set-body](set-body-policy.md)                       | Sets the body of the request.                   | No                              |
| authentication-certificate | [Certificate to use for client authentication](authentication-certificate-policy.md), specified in a `thumbprint` attribute. | No                          |
| [proxy](proxy-policy.md) | Routes request via HTTP proxy. | No |

## Usage

- **[Policy sections:](./api-management-howto-policies.md#sections)** inbound, outbound, backend, on-error
- **[Policy scopes:](./api-management-howto-policies.md#scopes)** global, workspace, product, API, operation
- **[Gateways:](api-management-gateways-overview.md)** dedicated, consumption, self-hosted

### Usage notes

If your API Management instance is deployed (injected) in a VNet in *internal* mode and you use this policy to send an API request to an API that's exposed in the same API Management instance, you may encounter a timeout with an HTTP 500 BackendConnectionFailure error. This is the result of an [Azure Load Balancer limitation](../load-balancer/load-balancer-troubleshoot-backend-traffic.md).  
  
To chain API requests to the gateway in this scenario, configure `set-url` to use the localhost loopback URL `https://127.0.0.1`. Additionally, set the `HOST` header to specify this API Management instance's gateway host. You may use the default `azure-api.net` or your custom domain host. For example:  
   
```xml
<send-request>
     <set-url>https://127.0.0.1/myapi/myoperation</set-url>
     <set-header name="Host">
         <value>myapim.azure-api.net</value>
     </set-header>
</send-request>
```


For more information, see this [blog post](https://techcommunity.microsoft.com/t5/azure-paas-blog/self-chained-apim-request-limitation-in-internal-virtual-network/ba-p/1940417).

## Example

This example shows one way to verify a reference token with an authorization server. For more information on this sample, see [Using external services from the Azure API Management service](./api-management-sample-send-request.md).

```xml
<inbound>
  <!-- Extract token from Authorization header parameter -->
  <set-variable name="token" value="@(context.Request.Headers.GetValueOrDefault("Authorization","scheme param").Split(' ').Last())" />

  <!-- Send request to Token Server to validate token (see RFC 7662) -->
  <send-request mode="new" response-variable-name="tokenstate" timeout="20" ignore-error="true">
    <set-url>https://microsoft-apiappec990ad4c76641c6aea22f566efc5a4e.azurewebsites.net/introspection</set-url>
    <set-method>POST</set-method>
    <set-header name="Authorization" exists-action="override">
      <value>basic dXNlcm5hbWU6cGFzc3dvcmQ=</value>
    </set-header>
    <set-header name="Content-Type" exists-action="override">
      <value>application/x-www-form-urlencoded</value>
    </set-header>
    <set-body>@($"token={(string)context.Variables["token"]}")</set-body>
  </send-request>

  <choose>
        <!-- Check active property in response -->
        <when condition="@((bool)((IResponse)context.Variables["tokenstate"]).Body.As<JObject>()["active"] == false)">
            <!-- Return 401 Unauthorized with http-problem payload -->
            <return-response>
                <set-status code="401" reason="Unauthorized" />
                <set-header name="WWW-Authenticate" exists-action="override">
                    <value>Bearer error="invalid_token"</value>
                </set-header>
            </return-response>
        </when>
    </choose>
  <base />
</inbound>
```

## Related policies

* [API Management advanced policies](api-management-advanced-policies.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]




