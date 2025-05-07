---
title: Azure API Management policy reference - send-one-way-request | Microsoft Docs
description: Reference for the send-one-way-request policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: reference
ms.date: 03/18/2024
ms.author: danlep
---

# Send one way request

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

The `send-one-way-request` policy sends the provided request to the specified URL without waiting for a response.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]


## Policy statement

```xml
<send-one-way-request mode="new | copy" timeout="time in seconds">
  <set-url>request URL</set-url>
  <set-method>...</set-method>
  <set-header>...</set-header>
  <set-body>...</set-body>
  <authentication-certificate thumbprint="thumbprint" />
</send-one-way-request>
```

## Attributes

| Attribute     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Required | Default  |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | -------- |
| mode | Determines whether this is a `new` request or a `copy` of the headers and body in the current request. In the outbound policy section, `mode=copy` does not initialize the request body. Policy expressions are allowed.                                                                                                                                                                                                                                                                                                                                                                                                                                                               | No       | `new`      |
| timeout| The timeout interval in seconds before the call to the URL fails. Policy expressions are allowed.	 | No | 60 |


## Elements

| Element                    | Description                                                                                                 | Required                        |
| -------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------- |
| set-url                        | The URL of the request. Policy expressions are allowed.                                                                                    | No if `mode=copy`; otherwise yes. |
| [set-method](set-method-policy.md)                     | Sets the method of the request. Policy expressions aren't allowed.                                                      | No if `mode=copy`; otherwise yes. |
| [set-header](set-header-policy.md)                     | Sets a header in the request. Use multiple `set-header` elements for multiple request headers.                                  | No                              |
| [set-body](set-body-policy.md)                       | Sets the body of the request.                   | No                              |
| authentication-certificate | [Certificate to use for client authentication](authentication-certificate-policy.md), specified in a `thumbprint` attribute. | No                              |
| [proxy](proxy-policy.md) | Routes request via HTTP proxy. | No |


## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound, outbound, backend, on-error
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) classic, v2, consumption, self-hosted

## Example

This example uses the `send-one-way-request` policy to send a message to a Slack chat room if the HTTP response code is greater than or equal to 500. For more information on this sample, see [Using external services from the Azure API Management service](./api-management-sample-send-request.md).

```xml
<choose>
    <when condition="@(context.Response.StatusCode >= 500)">
      <send-one-way-request mode="new" timeout="20">
        <set-url>https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX</set-url>
        <set-method>POST</set-method>
        <set-body>@{
                return new JObject(
                        new JProperty("username","APIM Alert"),
                        new JProperty("icon_emoji", ":ghost:"),
                        new JProperty("text", String.Format("{0} {1}\nHost: {2}\n{3} {4}\n User: {5}",
                                                context.Request.Method,
                                                context.Request.Url.Path + context.Request.Url.QueryString,
                                                context.Request.Url.Host,
                                                context.Response.StatusCode,
                                                context.Response.StatusReason,
                                                context.User.Email
                                                ))
                        ).ToString();
            }</set-body>
      </send-one-way-request>
    </when>
</choose>

```

## Related policies

* [Intergration and external communication](api-management-policies.md#integration-and-external-communication)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]