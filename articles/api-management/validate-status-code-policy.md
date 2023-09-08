---
title: Azure API Management policy reference - validate-status-code | Microsoft Docs
description: Reference for the validate-status-code policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow
ms.service: api-management
ms.topic: article
ms.date: 12/05/2022
ms.author: danlep
---

# Validate status code

The `validate-status-code` policy validates the HTTP status codes in responses against the API schema. This policy may be used to prevent leakage of backend errors, which can contain stack traces.

[!INCLUDE [api-management-validation-policy-schema-size-note](../../includes/api-management-validation-policy-schema-size-note.md)]

[!INCLUDE [api-management-policy-form-alert](../../includes/api-management-policy-form-alert.md)]

## Policy statement

```xml
<validate-status-code unspecified-status-code-action="ignore | prevent | detect" errors-variable-name="variable name">
    <status-code code="HTTP status code number" action="ignore | prevent | detect" />
</validate-status-code>
```

## Attributes

| Attribute         | Description                                            | Required | Default |
| ----------------- | ------------------------------------------------------ | -------- | ------- |
| unspecified-status-code-action | [Action](#actions) to perform for HTTP status codes in responses that aren’t specified in the API schema. Policy expressions are allowed. |  Yes     | N/A   |
| errors-variable-name | Name of the variable in `context.Variables` to log validation errors to. Policy expressions aren't allowed. |   No    | N/A   |

## Elements

|Name|Description|Required|
|----------|-----------------|--------------|
| status-code | Add one or more elements for HTTP status codes to override the default validation [action](#actions) for status codes in responses. | No |

### status-code attributes

| Attribute         | Description                                            | Required | Default |
| ----------------- | ------------------------------------------------------ | -------- | ------- |
| code | HTTP status code to override validation action for. | Yes | N/A |
| action | [Action](#actions) to perform for the matching status code, which isn’t specified in the API schema. If the status code is specified in the API schema, this override doesn’t take effect. | Yes | N/A | 

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
<validate-status-code unspecified-status-code-action="prevent" errors-variable-name="responseStatusCodeValidation" />
```

[!INCLUDE [api-management-validation-policy-error-reference](../../includes/api-management-validation-policy-error-reference.md)]

## Related policies

* [API Management validation policies](validation-policies.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]