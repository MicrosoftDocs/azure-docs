---
title: Azure API Management policy reference - validate-odata-request | Microsoft Docs
description: Reference for the validate-odata-request policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 06/06/2023
ms.author: danlep
---

# Validate OData request

The `validate-odata-request` policy validates the request URL, headers, and parameters of a request to an OData API to ensure conformance with the [OData specification](https://www.odata.org/documentation).

> [!NOTE]
> This policy is currently in preview.

## Policy statement

```xml
<validate-odata-request error-variable-name="variable name" default-odata-version="OData version number" min-odata-version="OData version number" max-odata-version="OData version number" max-size="size in bytes" />
```

## Attributes

| Attribute         | Description                                            | Required | Default |
| ----------------- | ------------------------------------------------------ | -------- | ------- |
| error-variable-name | Name of the variable in `context.Variables` to log validation errors to.  |   No    | N/A   |
| default-odata-version | The default OData version that is assumed for parameter validation if the request doesn't contain an `OData-Version` header.  | No  | 4.0 |
| min-odata-version | The minimum OData version in the `OData-Version` header of the request that the policy accepts. | No  | N/A |
| max-odata-version | The maximum OData version in the `OData-Version` header of the request that the policy accepts. | No  | N/A |
| max-size | Maximum size of the request payload in bytes.  |  No      | N/A   |


## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API
-  [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption, self-hosted

### Usage notes

* Configure the policy for an OData API that has been [imported](import-api-from-odata.md) to API Management. 
* This policy can only be used once in a policy section.

## Example

The following example validates a request to an OData API and assumes a default OData version of 4.01 if no `OData-Version` header is present:

```xml
<validate-odata-request default-odata-version="4.01" />  
```

## Related policies

* [Validation policies](api-management-policies.md#validation-policies)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]
