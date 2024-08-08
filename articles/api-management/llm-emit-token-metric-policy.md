---
title: Azure API Management policy reference - llm-emit-token-metric
description: Reference for the llm-emit-token-metric policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: article
ms.date: 08/07/2024
ms.author: danlep
ms.collection: ce-skilling-ai-copilot
ms.custom:
---

# Emit metrics for consumption of large language model tokens

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

The `llm-emit-token-metric` policy sends metrics to Application Insights about consumption of large language model tokens through LLM APIs. Token count metrics include: Total Tokens, Prompt Tokens, and Completion Tokens. 

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

[!INCLUDE [api-management-llm-models](../../includes/api-management-llm-models.md)]


## Prerequisites

* One or more LLM APIs must be added to your API Management instance. 
* Your API Management instance must be integrated with Application insights. For more information, see [How to integrate Azure API Management with Azure Application Insights](./api-management-howto-app-insights.md#create-a-connection-using-the-azure-portal).
* Enable Application Insights logging for your LLM APIs. 
* Enable custom metrics with dimensions in Application Insights. For more information, see [Emit custom metrics](api-management-howto-app-insights.md#emit-custom-metrics).

## Policy statement

```xml
<llm-emit-token-metric
        namespace="metric namespace" >      
        <dimension name="dimension name" value="dimension value" />
        ...additional dimensions...
</llm-emit-token-metric>
```

## Attributes

| Attribute | Description                | Required                | Default value  |
| --------- | -------------------------- |  ------------------ | -------------- |
| namespace | A string. Namespace of metric. Policy expressions aren't allowed. | No        | API Management |
| value     |  Value of metric expressed as a double. Policy expressions are allowed.   | No           | 1              |


## Elements

| Element     | Description                                                                       | Required |
| ----------- | --------------------------------------------------------------------------------- | -------- |
| dimension   | Add one or more of these elements for each dimension included in the metric.  | Yes      |

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

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) classic, v2, consumption, self-hosted, workspace

### Usage notes

* This policy can be used multiple times per policy definition.
* You can configure at most 10 custom dimensions for this policy.
* Where available, values in the usage section of the response from the LLM API are used to determine token metrics.
* Certain LLM endpoints support streaming of responses. When `stream` is set to `true` in the API request to enable streaming, token metrics are estimated.

## Example

The following example sends LLM token count metrics to Application Insights along with User ID, Client IP, and API ID as dimensions.

```xml
<policies>
  <inbound>
      <llm-emit-token-metric
            namespace="MyLLM">   
            <dimension name="User ID" />
            <dimension name="Client IP" value="@(context.Request.IpAddress)" />
            <dimension name="API ID" />
        </llm-emit-token-metric> 
  </inbound>
  <outbound>
  </outbound>
</policies>
```

## Related policies

* [Logging](api-management-policies.md#logging)
* [emit-metric](emit-metric-policy.md) policy
* [azure-openai-emit-token-metric](azure-openai-emit-token-metric-policy.md) policy
* [llm-token-limit](llm-token-limit-policy.md) policy 

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]
