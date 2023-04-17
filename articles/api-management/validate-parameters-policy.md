---
title: Azure API Management policy reference - validate-parameters | Microsoft Docs
description: Reference for the validate-parameters policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 12/05/2022
ms.author: danlep
---

# Validate parameters

The `validate-parameters` policy validates the header, query, or path parameters in requests against the API schema.

> [!IMPORTANT]
> If you imported an API using a management API version prior to `2021-01-01-preview`, the `validate-parameters` policy might not work. You may need to [reimport your API](/rest/api/apimanagement/current-ga/apis/create-or-update) using management API version `2021-01-01-preview` or later.

[!INCLUDE [api-management-validation-policy-schema-size-note](../../includes/api-management-validation-policy-schema-size-note.md)]

[!INCLUDE [api-management-policy-form-alert](../../includes/api-management-policy-form-alert.md)]

## Policy statement

```xml
<validate-parameters specified-parameter-action="ignore | prevent | detect" unspecified-parameter-action="ignore | prevent | detect" errors-variable-name="variable name"> 
    <headers specified-parameter-action="ignore | prevent | detect" unspecified-parameter-action="ignore | prevent | detect">
        <parameter name="parameter name" action="ignore | prevent | detect" />
    </headers>
    <query specified-parameter-action="ignore | prevent | detect" unspecified-parameter-action="ignore | prevent | detect">
        <parameter name="parameter name" action="ignore | prevent | detect" />
    </query>
    <path specified-parameter-action="ignore | prevent | detect">
        <parameter name="parameter name" action="ignore | prevent | detect" />
    </path>
</validate-parameters>
```

## Attributes

| Attribute         | Description                                            | Required | Default |
| ----------------- | ------------------------------------------------------ | -------- | ------- |
| specified-parameter-action | [Action](#actions) to perform for request parameters specified in the API schema. <br/><br/> When provided in a `headers`, `query`, or `path` element, the value overrides the value of `specified-parameter-action` in the `validate-parameters` element. Policy expressions are allowed. |  Yes     | N/A   |
| unspecified-parameter-action | [Action](#actions) to perform for request parameters that aren’t specified in the API schema. <br/><br/>When provided in a `headers`or `query` element, the value overrides the value of `unspecified-parameter-action` in the `validate-parameters` element. Policy expressions are allowed. |  Yes     | N/A   |
| errors-variable-name | Name of the variable in `context.Variables` to log validation errors to. Policy expressions aren't allowed. |   No    | N/A   |

## Elements

|Name|Description|Required|
|----------|-----------------|--------------|
| headers | Add this element and one or more `parameter` subelements to override default validation [actions](#actions) for certain named parameters in requests. If the parameter is specified in the API schema, this value overrides the higher-level `specified-parameter-action` configuration. If the parameter isn’t specified in the API schema, this value overrides the higher-level `unspecified-parameter-action` configuration.  | No |
| query | Add this element and one or more `parameter` subelements to override default validation [actions](#actions) for certain named query parameters in requests. If the parameter is specified in the API schema, this value overrides the higher-level `specified-parameter-action` configuration. If the parameter isn’t specified in the API schema, this value overrides the higher-level `unspecified-parameter-action` configuration. | No |
| path | Add this element and one or more `parameter` subelements to override default validation [actions](#actions) for certain URL path parameters in requests. If the parameter is specified in the API schema, this value overrides the higher-level `specified-parameter-action` configuration. If the parameter isn’t specified in the API schema, this value overrides the higher-level `unspecified-parameter-action` configuration. | No |

[!INCLUDE [api-management-validation-policy-actions](../../includes/api-management-validation-policy-actions.md)]

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption, self-hosted

[!INCLUDE [api-management-validation-policy-common](../../includes/api-management-validation-policy-common.md)]


## Example

In this example, all query and path parameters are validated in the prevention mode and headers in the detection mode. Validation is overridden for several header parameters:

```xml
<validate-parameters specified-parameter-action="prevent" unspecified-parameter-action="prevent" errors-variable-name="requestParametersValidation"> 
    <headers specified-parameter-action="detect" unspecified-parameter-action="detect">
        <parameter name="Authorization" action="prevent" />
        <parameter name="User-Agent" action="ignore" />
        <parameter name="Host" action="ignore" />
        <parameter name="Referrer" action="ignore" />
    </headers>   
</validate-parameters>
```

[!INCLUDE [api-management-validation-policy-error-reference](../../includes/api-management-validation-policy-error-reference.md)]

## Related policies

* [API Management validation policies](validation-policies.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]