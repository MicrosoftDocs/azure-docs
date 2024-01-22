---
title: Azure API Management policy reference - check-header | Microsoft Docs
description: Reference for the check-header policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 12/08/2022
ms.author: danlep
---

# Check HTTP header

Use the `check-header` policy  to enforce that a request has a specified HTTP header. You can optionally check to see if the header has a specific value or one of a range of allowed values. If the check fails, the policy terminates request processing and returns the HTTP status code and error message specified by the policy.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Policy statement

```xml
<check-header name="header name" failed-check-httpcode="code" failed-check-error-message="message" ignore-case="true | false">
    <value>Value1</value>
    <value>Value2</value>
</check-header>
```

## Attributes

| Attribute                       | Description                                                                                                                                                            | Required | Default |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------- |
| name                | The name of the HTTP header to check. Policy expressions are allowed.                                                                                                                                  | Yes      | N/A     |
| failed-check-httpcode      | HTTP status code to return if the header doesn't exist or has an invalid value. Policy expressions are allowed.                                                                                       | Yes      | N/A     |
| failed-check-error-message | Error message to return in the HTTP response body if the header doesn't exist or has an invalid value. This message must have any special characters properly escaped. Policy expressions are allowed. | Yes      | N/A     |
| ignore-case                | Boolean. If set to `true`, case is ignored when the header value is compared against the set of acceptable values. Policy expressions are allowed.                                   | Yes      | N/A     |

## Elements

| Element         | Description                                                                                                                                   | Required |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| value        | Add one or more of these elements to specify allowed HTTP header values. When multiple `value` elements are specified, the check is considered a success if any one of the values is a match. | No       |





## Usage

- **[Policy sections:](./api-management-howto-policies.md#sections)** inbound
- **[Policy scopes:](./api-management-howto-policies.md#scopes)** global, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption, self-hosted

## Example

```xml
<check-header name="Authorization" failed-check-httpcode="401" failed-check-error-message="Not authorized" ignore-case="false">
    <value>f6dc69a089844cf6b2019bae6d36fac8</value>
</check-header>
```

## Related policies

* [API Management access restriction policies](api-management-access-restriction-policies.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]
