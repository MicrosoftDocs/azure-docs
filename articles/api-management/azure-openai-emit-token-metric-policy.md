---
title: Azure API Management policy reference - azure-openai-emit-token-metric | Microsoft Docs
description: Reference for the azure-openai-emit-token-metric policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: article
ms.date: 09/26/2024
ms.author: danlep
ms.collection: ce-skilling-ai-copilot
ms.custom:
  - build-2024
---

# Emit metrics for consumption of Azure OpenAI tokens

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

The `azure-openai-emit-token-metric` policy sends custom metrics to Application Insights about consumption of large language model tokens through Azure OpenAI Service APIs. Token count metrics include: Total Tokens, Prompt Tokens, and Completion Tokens. 

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

[!INCLUDE [api-management-azure-openai-models](../../includes/api-management-azure-openai-models.md)]

## Limits for custom metrics

[!INCLUDE [api-management-custom-metrics-limits](../../includes/api-management-custom-metrics-limits.md)]


## Prerequisites

* One or more Azure OpenAI Service APIs must be added to your API Management instance. For more information, see [Add an Azure OpenAI Service API to Azure API Management](./azure-openai-api-from-specification.md).
* Your API Management instance must be integrated with Application insights. For more information, see [How to integrate Azure API Management with Azure Application Insights](./api-management-howto-app-insights.md).
* Enable Application Insights logging for your Azure OpenAI APIs. 
* Enable custom metrics with dimensions in Application Insights. For more information, see [Emit custom metrics](api-management-howto-app-insights.md#emit-custom-metrics).

## Policy statement

```xml
<azure-openai-emit-token-metric
        namespace="metric namespace" >      
        <dimension name="dimension name" value="dimension value" />
        ...additional dimensions...
</azure-openai-emit-token-metric>
```

## Attributes

| Attribute | Description                | Required                | Default value  |
| --------- | -------------------------- |  ------------------ | -------------- |
| namespace | A string. Namespace of metric. Policy expressions aren't allowed. | No        | API Management |


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
* This policy can optionally be configured when adding an API from the Azure OpenAI Service using the portal.
* Where available, values in the usage section of the response from the Azure OpenAI Service API are used to determine token metrics.
* Certain Azure OpenAI endpoints support streaming of responses. When `stream` is set to `true` in the API request to enable streaming, token metrics are estimated.

## Example

The following example sends Azure OpenAI token count metrics to Application Insights along with API ID as a custom dimension.

```xml
<policies>
  <inbound>
      <azure-openai-emit-token-metric
            namespace="AzureOpenAI">   
            <dimension name="API ID" />
        </azure-openai-emit-token-metric> 
  </inbound>
  <outbound>
  </outbound>
</policies>
```

## Related policies

* [Logging](api-management-policies.md#logging)
* [emit-metric](emit-metric-policy.md) policy
* [azure-openai-token-limit](azure-openai-token-limit-policy.md) policy 

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]
