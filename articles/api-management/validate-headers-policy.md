---
title: Azure API Management policy reference - validate-headers | Microsoft Docs
description: Reference for the validate-headers policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 12/05/2022
ms.author: danlep
---

# Validate headers

The `validate-headers` policy validates the response headers against the API schema.

> [!IMPORTANT]
> If you imported an API using a management API version prior to `2021-01-01-preview`, the `validate-headers` policy might not work. You may need to reimport your API using management API version `2021-01-01-preview` or later.

[!INCLUDE [api-management-validation-policy-schema-size-note](../../includes/api-management-validation-policy-schema-size-note.md)]

[!INCLUDE [api-management-policy-form-alert](../../includes/api-management-policy-form-alert.md)]

## Policy statement

```xml
<validate-headers specified-header-action="ignore | prevent | detect" unspecified-header-action="ignore | prevent | detect" errors-variable-name="variable name">
    <header name="header name" action="ignore | prevent | detect" />
</validate-headers>
```

## Attributes

| Attribute         | Description                                            | Required | Default |
| ----------------- | ------------------------------------------------------ | -------- | ------- |
| specified-header-action | [Action](#actions) to perform for response headers specified in the API schema. Policy expressions are allowed. |  Yes     | N/A   |
| unspecified-header-action | [Action](#actions) to perform for response headers that aren’t specified in the API schema. Policy expressions are allowed. |  Yes     | N/A   |
| errors-variable-name | Name of the variable in `context.Variables` to log validation errors to. Policy expressions aren't allowed. |   No    | N/A   |

## Elements

|Name|Description|Required|
|----------|-----------------|--------------|
| header | Add one or more elements for named headers to override the default validation [actions](#actions) for headers in responses. | No |

[!INCLUDE [api-management-validation-policy-actions](../../includes/api-management-validation-policy-actions.md)]

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) outbound, on-error
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption, self-hosted

### Usage notes

- This policy can only be used once in a policy section.

[!INCLUDE [api-management-validation-policy-common](../../includes/api-management-validation-policy-common.md)]


## Example

```xml
<validate-headers specified-header-action="ignore" unspecified-header-action="prevent" errors-variable-name="responseHeadersValidation" />
```

[!INCLUDE [api-management-validation-policy-error-reference](../../includes/api-management-validation-policy-error-reference.md)]

## Related policies

* [API Management validation policies](validation-policies.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]