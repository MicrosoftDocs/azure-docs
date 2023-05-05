---
title: Azure API Management policy reference - emit-metric | Microsoft Docs
description: Reference for the emit-metric policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 12/08/2022
ms.author: danlep
---

# Emit custom metrics

The `emit-metric` policy sends custom metrics in the specified format to Application Insights.

> [!NOTE]
> * Custom metrics are a [preview feature](../azure-monitor/essentials/metrics-custom-overview.md) of Azure Monitor and subject to [limitations](../azure-monitor/essentials/metrics-custom-overview.md#design-limitations-and-considerations).
> * For more information about the API Management data added to Application Insights, see [How to integrate Azure API Management with Azure Application Insights](./api-management-howto-app-insights.md#what-data-is-added-to-application-insights).

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

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
| value     |  Value of custom metric expressed as an integer. Policy expressions are allowed.   | No           | 1              |


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
* Location ID
* Gateway ID

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound, outbound, backend, on-error
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption, self-hosted

## Example

The following example sends a custom metric to count the number of API requests along with user ID, client IP, and API ID as custom dimensions.

```xml
<policies>
  <inbound>
    <emit-metric name="Request" value="1" namespace="my-metrics"> 
        <dimension name="User ID" /> 
        <dimension name="Client IP" value="@(context.Request.IpAddress)" /> 
        <dimension name="API ID" /> 
    </emit-metric> 
  </inbound>
  <outbound>
  </outbound>
</policies>
```

## Related policies

* [API Management advanced policies](api-management-advanced-policies.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]