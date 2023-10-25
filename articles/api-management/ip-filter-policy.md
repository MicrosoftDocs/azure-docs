---
title: Azure API Management policy reference - ip-filter | Microsoft Docs
description: Reference for the ip-filter policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 12/08/2022
ms.author: danlep
---
# Restrict caller IPs

The `ip-filter` policy filters (allows/denies) calls from specific IP addresses and/or address ranges.

[!INCLUDE [api-management-policy-form-alert](../../includes/api-management-policy-form-alert.md)]

## Policy statement

```xml
<ip-filter action="allow | forbid">
    <address>address</address>
    <address-range from="address" to="address" />
</ip-filter>
```


## Attributes

| Attribute                                      | Description                                                                                 | Required                                           | Default |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------- |
| action    | Specifies whether calls should be allowed (`allow`) or not (`forbid`) for the specified IP addresses and ranges. Policy expressions are allowed. | Yes                                                | N/A     |

## Elements

| Element                                      | Description                                         | Required                                                       |
| ----------------------------------------- | --------------------------------------------------- | -------------------------------------------------------------- |
| address                                   | Add one or more of these elements to specify a single IP address on which to filter. Policy expressions are allowed.  | At least one `address` or `address-range` element is required. |
| address-range | Add one or more of these elements to specify a range of IP addresses `from` "address" `to` "address" on which to filter. | At least one `address` or `address-range` element is required. |


## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
- [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption, self-hosted

### Usage notes

If you configure this policy at more than one scope, IP filtering is applied in the order of [policy evaluation](set-edit-policies.md#use-base-element-to-set-policy-evaluation-order) in your policy definition. 

## Example

In the following example, the policy only allows requests coming either from the single IP address or range of IP addresses specified.

```xml
<ip-filter action="allow">
    <address>13.66.201.169</address>
    <address-range from="13.66.140.128" to="13.66.140.143" />
</ip-filter>
```

## Related policies

* [API Management access restriction policies](api-management-access-restriction-policies.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]