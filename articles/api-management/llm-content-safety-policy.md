---
title: Azure API Management policy reference - llm-content-safety
description: Reference for the llm-content-safety policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.collection: ce-skilling-ai-copilot
ms.custom:
ms.topic: article
ms.date: 01/24/2025
ms.author: danlep
---

# Enforce content safety checks on LLM requests and responses

[!INCLUDE [api-management-availability-premium-dev-standard-basic-premiumv2-standardv2-basicv2](../../includes/api-management-availability-premium-dev-standard-basic-premiumv2-standardv2-basicv2.md)]

The `llm-content-safety` policy enforces content safety checks by leveraging Azure Content Safety. When enabled and the policy detects malicious content, API management returns a `403` error code. Use the policy in scenarios such as the following:

* Block requests that contain harmful content or hate speech
* Apply a blocklist to prevent specific content from being sent
* Shield against prompts that match attack patterns

> [!NOTE]
> Currently, this policy is in preview.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Prerequisites

* An [Azure AI Content Safety](/azure/ai-services/content-safety/) resource. 
* API Management [backend](backends.md) configured to route content-safety API calls to the Azure Content Safety service.




## Policy statement

```xml
<llm-content-safety backend-id="name of backend entity" shield-prompt="true | false" >
<categories output-type="FourSeverityLevels | EightSeverityLevels">
    <category name="Hate | SelfHarm | Sexual | Violence" threshold="integer" />
    <!-- If there are multiple categories, add more category elements -->
    [...]
</categories>
<blocklists>
    <id>blocklist-identifier</id>
    <!-- If there are multiple blocklists, add more id elements -->
    [...]
</blocklists>
</llm-content-safety>
```

## Attributes

| Attribute           | Description                                                                                           | Required | Default |
| -------------- | ----------------------------------------------------------------------------------------------------- | -------- | ------- |
| backend-id	| Identifier (name) of the Azure Content Safety backend to route content-safety API calls to. Policy expressions are allowed.	|  Yes	| N/A |
| shield-prompt	| If set to `true`, content is checked for user attacks. Otherwise, skip this check. Policy expressions are allowed.	| No	| `false` |


## Elements

| Element	| Description	| Required |
| -------------- | -----| -------- |
| categories	| A list of `category` elements that specify settings for blocking messages when the category is detected. | 	No |
| blocklists	| A list of blocklist `id` elements for which detection will cause the message to be blocked. Policy expressions are allowed.	| No |

### categories attributes

| Attribute           | Description                                                                                           | Required | Default |
| -------------- | ----------------------------------------------------------------------------------------------------- | -------- | ------- |
| output-type	| Specifies how severity levels are returned by Azure Content Safety. The attribute must have one of the following values.<br/><br/>
- `FourSeverityLevels`: Output severities in four levels, 0,2,4,6.<br/>
- `EightSeverityLevels`: Output severities in four levels, 0,1,2,3,4,5,6,7.<br/><br/>
Policy expressions are allowed.	| No	| `FourSeverityLevels` |


### category attributes

| Attribute           | Description                                                                                           | Required | Default |
| -------------- | ----------------------------------------------------------------------------------------------------- | -------- | ------- |
| name	| Specifies the name of this category. The attribute must have one of the following values: `Hate`, `SelfHarm`, `Sexual`, `Violence`. Policy expressions are allowed.	| Yes	| N/A |
| threshold	| Specifies the threshold value for this category at which messages are blocked. Messages with content severities less than the threshold are not blocked. The value must be between 0 and 7. Policy expressions are allowed.	| Yes	| N/A |


## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
- [**Gateways:**](api-management-gateways-overview.md) classic, v2, consumption, self-hosted, workspace

### Usage notes

* This policy can be used multiple times per policy definition.

## Examples


## Related policies

* [Rate limiting and quotas](api-management-policies.md#rate-limiting-and-quotas)
* [azure-openai-token-limit](azure-openai-token-limit-policy.md) policy
* [llm-emit-token-metric](llm-emit-token-metric-policy.md) policy

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]
 

<!-- 
Questions

1. Inbound only for now?
1. GW and SKU support? 
1. Preview for now?
1. How does admin create/config/apply a custom blocklist? Where is it?
1. Is this a content validation policy? 

-->