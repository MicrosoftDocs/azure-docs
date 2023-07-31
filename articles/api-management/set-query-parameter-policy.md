---
title: Azure API Management policy reference - set-query-parameter | Microsoft Docs
description: Reference for the set-query-parameter policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 12/08/2022
ms.author: danlep
---

# Set query string parameter

The `set-query-parameter` policy adds, replaces value of, or deletes request query string parameter. Can be used to pass query parameters expected by the backend service which are optional or never present in the request.

[!INCLUDE [api-management-policy-form-alert](../../includes/api-management-policy-form-alert.md)]

## Policy statement

```xml
<set-query-parameter name="param name" exists-action="override | skip | append | delete">
    <value>value</value> <!--for multiple parameters with the same name add additional value elements-->
</set-query-parameter>
```


## Attributes

|Name|Description|Required|Default|
|----------|-----------------|--------------|-------------|
|exists-action|Specifies what action to take when the query parameter is already specified. This attribute must have one of the following values.<br /><br /> -   `override` - replaces the value of the existing parameter.<br />-   `skip` - does not replace the existing query parameter value.<br />-   `append` - appends the value to the existing query parameter value.<br />-   `delete` - removes the query parameter from the request.<br /><br /> When set to `override` enlisting multiple entries with the same name results in the query parameter being set according to all entries (which will be listed multiple times); only listed values will be set in the result.<br/><br/>Policy expressions are allowed. |No|`override`|
|name|Specifies name of the query parameter to be set. Policy expressions are allowed. |Yes|N/A|

## Elements

|Name|Description|Required|
|----------|-----------------|--------------|
|value|Specifies the value of the query parameter to be set. For multiple query parameters with the same name, add additional `value` elements. Policy expressions are allowed. |Yes|

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound, backend
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption, self-hosted

## Examples

### Set value of query parameter

```xml

<set-query-parameter name="api-key" exists-action="skip">
  <value>12345678901</value>
</set-query-parameter>

```

### Set query parameter to forward context to the backend 

 This example shows how to apply policy at the API level to supply context information to the backend service.

```xml
<!-- Copy this snippet into the inbound element to forward a piece of context, product name in this example, to the backend service for logging or evaluation -->
<set-query-parameter name="x-product-name" exists-action="override">
  <value>@(context.Product.Name)</value>
</set-query-parameter>
```

 For more information, see [Policy expressions](api-management-policy-expressions.md) and [Context variable](api-management-policy-expressions.md#ContextVariables).

## Related policies

- [API Management transformation policies](api-management-transformation-policies.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]