---
title: Azure API Management policy reference - authentication-certificate | Microsoft Docs
description: Reference for the authentication-certificate policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: reference
ms.date: 07/23/2024
ms.author: danlep
---

# Authenticate with client certificate

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

 Use the `authentication-certificate` policy to authenticate with a backend service using a client certificate. When the certificate is [installed into API Management](./api-management-howto-mutual-certificates.md) first, identify it first by its thumbprint or certificate ID (resourcename). 

[!INCLUDE [api-management-credentials-caution](../../includes/api-management-credentials-caution.md)]

> [!CAUTION]
> If the certificate references a certificate stored in Azure Key Vault, identify it using the certificate ID. When a key vault certificate is rotated, its thumbprint in API Management will change, and the policy will not resolve the new certificate if it is identified by thumbprint.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]


## Policy statement

```xml
<authentication-certificate thumbprint="thumbprint" certificate-id="resource name" body="certificate byte array" password="optional password"/>
```

## Attributes

| Attribute         | Description                                            | Required | Default |
| ----------------- | ------------------------------------------------------ | -------- | ------- |
|thumbprint|The thumbprint for the client certificate. Policy expressions are allowed. |Either `thumbprint` or `certificate-id` can be present.|N/A|
|certificate-id|The certificate resource name. Policy expressions are allowed.|Either `thumbprint` or `certificate-id` can be present.|N/A|
|body|Client certificate as a byte array. Use if the certificate isn't retrieved from the built-in certificate store. Policy expressions are allowed.|No|N/A|
|password|Password for the client certificate. Policy expressions are allowed.|Use if certificate specified in `body` is password protected.|N/A|

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
- [**Gateways:**](api-management-gateways-overview.md) classic, v2, consumption, self-hosted, workspace

### Usage notes

- We recommend configuring [key vault certificates](api-management-howto-mutual-certificates.md) to manage certificates used to secure access to backend services.
- If you configure a certificate password in this policy, we recommend using a [named value](api-management-howto-properties.md).


## Examples

### Client certificate identified by the certificate ID

```xml  
<authentication-certificate certificate-id="544fe9ddf3b8f30fb490d90f" />  
``` 

### Client certificate identified by thumbprint

```xml
<authentication-certificate thumbprint="CA06F56B258B7A0D4F2B05470939478651151984" />
```

### Client certificate set in the policy rather than retrieved from the built-in certificate store

```xml
<authentication-certificate body="@(context.Variables.GetValueOrDefault<byte[]>("byteCertificate"))" password="optional-certificate-password" />
```

## Related policies

* [Authentication and authorization](api-management-policies.md#authentication-and-authorization)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]