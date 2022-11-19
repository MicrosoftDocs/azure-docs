---
title: Azure API Management policy reference - send-one-way-request | Microsoft Docs
description: Reference for the send-one-way-request policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: reference
ms.date: 11/18/2022
ms.author: danlep
---

# Send one way request

The `send-one-way-request` policy sends the provided request to the specified URL without waiting for a response.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]


## Policy statement

```xml
<send-one-way-request mode="new | copy">
  <set-url>...</set-url>
  <method>...</method>
  <header name="" exists-action="override | skip | append | delete">...</header>
  <body>...</body>
  <authentication-certificate thumbprint="thumbprint" />
</send-one-way-request>
```

## Attributes

| Attribute     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Required | Default  |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | -------- |
| mode="string" | Determines whether this is a new request or a copy of the current request. In outbound mode, mode=copy does not initialize the request body.                                                                                                                                                                                                                                                                                                                                                                                                                                                                | No       | new      |

[TODO: Check if subelements are policies]

## Elements

| Element                    | Description                                                                                                 | Required                        |
| -------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------- |
| set-url                        | The URL of the request.                                                                                     | No if mode=copy; otherwise yes. |
| method                     | The HTTP method for the request.                                                                            | No if mode=copy; otherwise yes. |
| header                     | Request header. Use multiple header elements for multiple request headers.                                  | No                              |
| body                       | The request body.                                                                                           | No                              |
| authentication-certificate | [Certificate to use for client authentication](api-management-authentication-policies.md#ClientCertificate), specified in a `thumbprint` attribute. | No                              |

### header attributes

| Attribute     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Required | Default  |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | -------- |
| name          | Specifies the name of the header to be set.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Yes      | N/A      |
| exists-action | Specifies what action to take when the header is already specified. This attribute must have one of the following values.<br /><br /> - override - replaces the value of the existing header.<br />- skip - does not replace the existing header value.<br />- append - appends the value to the existing header value.<br />- delete - removes the header from the request.<br /><br /> When set to `override` enlisting multiple entries with the same name results in the header being set according to all entries (which will be listed multiple times); only listed values will be set in the result. | No       | override |


## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound, outbound, backend, on-error
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, product, API, operation
- [**Policy expressions:**](api-management-policy-expressions.md) supported
-  [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption, self-hosted
- **Multiple statements per policy document:** supported

## Examples

### Send one-way request to an external service

This example used the the `send-one-way-request` policy to send a message to a Slack chat room if the HTTP response code is greater than or equal to 500. For more information on this sample, see [Using external services from the Azure API Management service](./api-management-sample-send-request.md).

```xml
<choose>
    <when condition="@(context.Response.StatusCode >= 500)">
      <send-one-way-request mode="new">
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

* [API Management advanced policies](api-management-advanced-policies.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]