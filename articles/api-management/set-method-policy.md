---
title: Azure API Management policy reference - set-method | Microsoft Docs
description: Reference for the set-method policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 12/08/2022
ms.author: danlep
---

# Set request method

The `set-method` policy allows you to change the HTTP request method for a request.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]


## Policy statement

```xml
<set-method>HTTP method</set-method>
```

The value of the element specifies the HTTP method, such as `POST`, `GET`, and so on. Policy expressions are allowed.

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound, on-error
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption, self-hosted

## Example

This example uses the `set-method` policy to send a message to a Slack chat room if the HTTP response code is greater than or equal to 500. For more information on this sample, see [Using external services from the Azure API Management service](./api-management-sample-send-request.md).

```xml
<choose>
    <when condition="@(context.Response.StatusCode >= 500)">
      <send-one-way-request mode="new">
        <set-url>https://hooks.slack.com/services/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</set-url>
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

* [API Management advanced policies](api-management-advanced-policies.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]