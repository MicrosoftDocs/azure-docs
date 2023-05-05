---
title: Azure API Management policy reference - proxy | Microsoft Docs
description: Reference for the proxy policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 12/08/2022
ms.author: danlep
---

# Set HTTP proxy

The `proxy` policy allows you to route requests forwarded to backends via an HTTP proxy. Only HTTP (not HTTPS) is supported between the gateway and the proxy. Basic and NTLM authentication only. 

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]


## Policy statement

```xml
<proxy url="http://hostname-or-ip:port" username="username" password="password" />
```

## Attributes

| Attribute         | Description                                            | Required | Default |
| ----------------- | ------------------------------------------------------ | -------- | ------- |
| url      | Proxy URL in the form of `http://host:port`. Policy expressions are allowed.           | Yes      | N/A     |
| username | Username to be used for authentication with the proxy. Policy expressions are allowed. | No       | N/A     |
| password | Password to be used for authentication with the proxy. Policy expressions are allowed. | No       | N/A     |

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption, self-hosted

## Example

In this example, [named values](api-management-howto-properties.md) are used for the username and password to avoid storing sensitive information in the policy document.

```xml
<proxy url="http://192.168.1.1:8080" username={{username}} password={{password}} />
```


## Related policies

* [API Management advanced policies](api-management-advanced-policies.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]