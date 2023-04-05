---
title: Azure API Management policy reference - set-header | Microsoft Docs
description: Reference for the set-header policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 12/08/2022
ms.author: danlep
---

# Set header

The `set-header` policy assigns a value to an existing HTTP response and/or request header or adds a new response and/or request header.

 Use the policy to insert a list of HTTP headers into an HTTP message. When placed in an inbound pipeline, this policy sets the HTTP headers for the request being passed to the target service. When placed in an outbound pipeline, this policy sets the HTTP headers for the response being sent to the gateway’s client.

[!INCLUDE [api-management-policy-form-alert](../../includes/api-management-policy-form-alert.md)]

## Policy statement

```xml
<set-header name="header name" exists-action="override | skip | append | delete">
    <value>value</value> <!--for multiple headers with the same name add additional value elements-->
</set-header>
```

## Attributes

|Name|Description|Required|Default|
|----------|-----------------|--------------|-------------|
|exists-action|Specifies  action to take when the header is already specified. This attribute must have one of the following values.<br /><br /> -   `override` - replaces the value of the existing header.<br />-   `skip` - does not replace the existing header value.<br />-   `append` - appends the value to the existing header value.<br />-   `delete` - removes the header from the request.<br /><br /> When set to `override`, enlisting multiple entries with the same name results in the header being set according to all entries (which will be listed multiple times); only listed values will be set in the result. <br/><br/>Policy expressions are allowed.|No|`override`|
|name|Specifies name of the header to be set. Policy expressions are allowed.|Yes|N/A|


## Elements

|Name|Description|Required|
|----------|-----------------|--------------|
|value|Specifies the value of the header to be set. Policy expressions are allowed. For multiple headers with the same name, add additional `value` elements.|No|

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound, outbound, backend, on-error
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption, self-hosted

### Usage notes

 Multiple values of a header are concatenated to a CSV string, for example: 

`headerName: value1,value2,value3`

Exceptions include standardized headers whose values:
- may contain commas (`User-Agent`, `WWW-Authenticate`, `Proxy-Authenticate`)
- may contain date (`Cookie`, `Set-Cookie`, `Warning`),
- contain date (`Date`, `Expires`, `If-Modified-Since`, `If-Unmodified-Since`, `Last-Modified`, `Retry-After`).

In case of those exceptions, multiple header values will not be concatenated into one string and will be passed as separate headers, for example:

```
User-Agent: value1
User-Agent: value2
User-Agent: value3
```

## Examples

### Add header, override existing

```xml
<set-header name="some header name" exists-action="override">
    <value>20</value>
</set-header>
```
### Remove header

```xml
 <set-header name="some header name" exists-action="delete" />
```

### Forward context information to the backend service

This example shows how to apply policy at the API level to supply context information to the backend service.

```xml
<!-- Copy this snippet into the inbound element to forward some context information, user id and the region the gateway is hosted in, to the backend service for logging or evaluation -->
<set-header name="x-request-context-data" exists-action="override">
  <value>@(context.User.Id)</value>
  <value>@(context.Deployment.Region)</value>
</set-header>
```

 For more information, see [Policy expressions](api-management-policy-expressions.md) and [Context variable](api-management-policy-expressions.md#ContextVariables).

## Related policies

- [API Management transformation policies](api-management-transformation-policies.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]