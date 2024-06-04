---
title: Azure API Management policy reference - azure-openai-emit-token-metric | Microsoft Docs
description: Reference for the azure-openai-emit-token-metric policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 05/10/2024
ms.author: danlep
ms.custom:
  - build-2024
---

# Emit metrics for consumption of Azure OpenAI tokens

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

The `azure-openai-emit-token-metric` policy sends metrics to Application Insights about consumption of large language model tokens through Azure OpenAI Service APIs. Token count metrics include: Total Tokens, Prompt Tokens, and Completion Tokens. 

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]


## Prerequisites

* One or more Azure OpenAI Service APIs must be added to your API Management instance. For more information, see [Add an Azure OpenAI Service API to Azure API Management](./azure-openai-api-from-specification.md).
* Your API Management instance must be integrated with Application insights. For more information, see [How to integrate Azure API Management with Azure Application Insights](./api-management-howto-app-insights.md#create-a-connection-using-the-azure-portal).
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
-  [**Gateways:**](api-management-gateways-overview.md) classic, v2

### Usage notes

* This policy can be used multiple times per policy definition.
* You can configure at most 10 custom definitions for this policy.
* This policy can optionally be configured when adding an API from the Azure OpenAI Service using the portal.

## Example

The following example sends Azure OpenAI token count metrics to Application Insights along with User ID, Client IP, and API ID as dimensions.

```xml
<policies>
  <inbound>
      <azure-openai-emit-token-metric
            namespace="AzureOpenAI">   
            <dimension name="User ID" />
            <dimension name="Client IP" value="@(context.Request.IpAddress)" />
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
