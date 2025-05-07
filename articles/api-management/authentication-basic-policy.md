---
title: Azure API Management policy reference - authentication-basic | Microsoft Docs
description: Reference for the authentication-basic policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: reference
ms.date: 07/23/2024
ms.author: danlep
---

# Authenticate with Basic

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

Use the `authentication-basic` policy to authenticate with a backend service using Basic authentication. This policy effectively sets the HTTP Authorization header to the value corresponding to the credentials provided in the policy.

[!INCLUDE [api-management-credentials-caution](../../includes/api-management-credentials-caution.md)]

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]


## Policy statement

```xml
<authentication-basic username="username" password="password" />
```


## Attributes

| Attribute         | Description                                            | Required | Default |
| ----------------- | ------------------------------------------------------ | -------- | ------- |
|username|Specifies the username of the Basic credential. Policy expressions are allowed. |Yes|N/A|
|password|Specifies the password of the Basic credential. Policy expressions are allowed. |Yes|N/A|


## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
- [**Gateways:**](api-management-gateways-overview.md) classic, v2, consumption, self-hosted, workspace

### Usage notes

- This policy can only be used once in a policy section.
- We recommend using [named values](api-management-howto-properties.md) to provide credentials, with secrets protected in a key vault.

## Example

```xml
<authentication-basic username="testuser" password="testpassword" />
```

## Related policies

* [Authentication and authorization](api-management-policies.md#authentication-and-authorization)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]