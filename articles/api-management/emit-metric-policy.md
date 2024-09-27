---
title: Azure API Management policy reference - emit-metric | Microsoft Docs
description: Reference for the emit-metric policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: article
ms.date: 09/25/2024
ms.author: danlep
ms.custom: engagement-fy23
---

# Emit custom metrics

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

The `emit-metric` policy sends custom metrics in the specified format to Application Insights.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Limits for custom metrics

[!INCLUDE [api-management-custom-metrics-limits](../../includes/api-management-custom-metrics-limits.md)]

## Prerequisites

* Your API Management instance must be integrated with Application insights. For more information, see [How to integrate Azure API Management with Azure Application Insights](./api-management-howto-app-insights.md).
* Enable Application Insights logging for your APIs. 
* Enable custom metrics with dimensions in Application Insights. For more information, see [Emit custom metrics](api-management-howto-app-insights.md#emit-custom-metrics).

## Policy statement

```xml
<emit-metric name="name of custom metric" value="value of custom metric" namespace="metric namespace"> 
    <dimension name="dimension name" value="dimension value" /> 
</emit-metric> 
```

## Attributes

| Attribute | Description                | Required                | Default value  |
| --------- | -------------------------- |  ------------------ | -------------- |
| name      | A string. Name of custom metric. Policy expressions aren't allowed.      | Yes       | N/A            |
| namespace | A string. Namespace of custom metric. Policy expressions aren't allowed. | No        | API Management |
| value     |  Value of custom metric expressed as a double. Policy expressions are allowed.   | No           | 1              |


## Elements

| Element     | Description                                                                       | Required |
| ----------- | --------------------------------------------------------------------------------- | -------- |
| dimension   | Add one or more of these elements for each dimension included in the custom metric.  | Yes      |

### dimension attributes

| Attribute | Description                | Required |  Default value  |
| --------- | -------------------------- |  ------------------ | -------------- |
| name      | A string or policy expression. Name of dimension.      | Yes      |  N/A            |
| value     | A string or policy expression. Value of dimension. Can only be omitted if `name` matches one of the default dimensions. If so, value is provided as per dimension name. | No        | N/A |

 ### Default dimension names that may be used without value

* API ID
* Operation ID
* Product ID
* User ID
* Subscription ID
* Location
* Gateway ID

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound, outbound, backend, on-error
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) classic, v2, consumption, self-hosted, workspace

### Usage notes

* You can configure at most 10 custom dimensions for this policy.

## Example

The following example sends a custom metric to count the number of API requests along with API ID as a custom dimension.

```xml
<policies>
  <inbound>
    <emit-metric name="Request" value="1" namespace="my-metrics"> 
        <dimension name="API ID" /> 
    </emit-metric> 
  </inbound>
  <outbound>
  </outbound>
</policies>
```

## Related policies

* [Logging](api-management-policies.md#logging)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]
