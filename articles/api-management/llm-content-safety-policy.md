---
title: Azure API Management policy reference - llm-content-safety
description: Reference for the llm-content-safety policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.collection: ce-skilling-ai-copilot
ms.custom:
ms.topic: reference
ms.date: 03/23/2026
ms.update-cycle: 180-days
ms.author: danlep
---

# Enforce content safety checks on LLM requests

[!INCLUDE [api-management-availability-premium-dev-standard-basic-premiumv2-standardv2-basicv2](../../includes/api-management-availability-premium-dev-standard-basic-premiumv2-standardv2-basicv2.md)]

The `llm-content-safety` policy enforces content safety checks on large language model (LLM) requests (prompts) or responses (completions) by sending them to the [Azure AI Content Safety](/azure/ai-services/content-safety/overview) service. When you enable the policy and Azure AI Content Safety detects malicious content, API Management blocks the request or response and returns a `403` error code. 

> [!NOTE]
> The terms _category_ and _categories_ used in API Management are synonymous with _harm category_ and _harm categories_ in the Azure AI Content Safety service. For more information, see [Harm categories in Azure AI Content Safety](/azure/ai-services/content-safety/concepts/harm-categories).

Use the policy in scenarios such as the following:

* Block requests or responses that contain predefined categories of harmful content or hate speech.
* Apply custom blocklists to prevent specific content from being sent or received.
* Shield against prompts that match attack patterns.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Prerequisites

* An [Azure AI Content Safety](/azure/ai-services/content-safety/) resource. 
* An API Management [backend](backends.md) configured to route content safety API calls and authenticate to the Azure AI Content Safety service:
    * API Management's managed identity must be configured on the Azure AI Content Safety service with Cognitive Services User role.
    * The Azure AI Content Safety backend URL, referenced by `backend-id` in the `llm-content-safety` policy, needs to be in the form `https://<content-safety-service-name>.cognitiveservices.azure.com`.
    * The Azure AI Content Safety backend's authorization credentials need to be set to Managed Identity enabled with an exact resource ID of `https://cognitiveservices.azure.com`. 

## Policy statement

```xml
<llm-content-safety backend-id="name of backend entity" shield-prompt="true | false" enforce-on-completions="true | false" window-size="integer" window-overlap-size="integer">
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
| backend-id	| Identifier (name) of the Azure AI Content Safety backend to route content-safety API calls to. Policy expressions are allowed.	|  Yes	| N/A |
| shield-prompt	| If set to `true`, check content for user attacks. Otherwise, skip this check. Policy expressions are allowed.	| No	| `false` |
| enforce-on-completions| If set to `true` when you set the policy in the inbound section for content safety checks on requests, enforce content safety checks also on chat completions for response validation. When you set the policy in the outbound section for content safety checks on responses, this attribute is ignored. Policy expressions are allowed.	| No	| `false` |
| window-size | The size of the text window in characters that the policy sends to Azure AI Content Safety for evaluation. Configurable only for responses; for requests, the default window size is always used. Policy expressions are allowed. | No | 10,000 characters (Azure AI Content Safety limit) |
| window-overlap-size | The size of the overlap in characters between text windows when the content is split by using the `window-size` attribute. If you don't specify a value, windows don't overlap. Policy expressions are allowed. | No | N/A |


## Elements

| Element	| Description	| Required |
| -------------- | -----| -------- |
| categories	| A list of `category` elements that specify settings for blocking requests when the category is detected. | 	No |
| blocklists	| A list of [blocklist](/azure/ai-services/content-safety/how-to/use-blocklist) `id` elements from the Azure AI Content Safety instance for which detection causes the request to be blocked. Policy expressions are allowed.	| No |

### categories attributes

| Attribute           | Description                                                                                           | Required | Default |
| -------------- | ----------------------------------------------------------------------------------------------------- | -------- | ------- |
| output-type	| Specifies how severity levels are returned by Azure AI Content Safety. The attribute must have one of the following values.<br /><br />- `FourSeverityLevels`: Output severities in four levels: 0,2,4,6.<br/>- `EightSeverityLevels`: Output severities in eight levels: 0,1,2,3,4,5,6,7.<br/><br/>Policy expressions are allowed.	| No	| `FourSeverityLevels` |


### category attributes

| Attribute           | Description                                                                                           | Required | Default |
| -------------- | ----------------------------------------------------------------------------------------------------- | -------- | ------- |
| name	| Specifies the name of this category. The attribute must have one of the following values: `Hate`, `SelfHarm`, `Sexual`, `Violence`. Policy expressions are allowed.	| Yes	| N/A |
| threshold	| Specifies the threshold value for this category at which requests or responses are blocked. Requests with content severities less than the threshold aren't blocked. The value must be between 0 (most restrictive) and 7 (least restrictive). Policy expressions are allowed.	| Yes	| N/A |


## Usage

- [**Policy sections:**](./api-management-howto-policies.md#understanding-policy-configuration) inbound, outbound
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API
- [**Gateways:**](api-management-gateways-overview.md) classic, v2, consumption, self-hosted, workspace

### Usage notes

* Configure the policy in the inbound section to check requests and in the outbound section to check responses.
* For streaming responses, the stream handler buffers events in a sliding window and, if a content safety violation is detected, stops forwarding further events to the client. A `403` error isn't returned in this case. 
* If the request or response exceeds the character limit of Azure AI Content Safety, the policy returns a `403` error.
* You can use this policy multiple times per policy definition.

## Example

The following example, when configured in the inbound section, enforces content safety checks on LLM requests by using the Azure AI Content Safety service. The policy blocks requests that contain speech in the `Hate` or `Violence` category with a severity level of 4 or higher. In other words, the filter allows levels 0-3 to continue whereas levels 4-7 are blocked. Raising a category's threshold raises the tolerance and potentially decreases the number of blocked requests. Lowering the threshold lowers the tolerance and potentially increases the number of blocked requests. The `shield-prompt` attribute is set to `true` to check for adversarial attacks.

```xml
<policies>
    <inbound>
        <llm-content-safety backend-id="content-safety-backend" shield-prompt="true">
            <categories output-type="EightSeverityLevels">
                <category name="Hate" threshold="4" />
                <category name="Violence" threshold="4" />
            </categories>
        </llm-content-safety>
    </inbound>
</policies>
```

## Related policies

* [Content validation](api-management-policies.md#content-validation) policies
* [llm-token-limit](llm-token-limit-policy.md) policy
* [llm-emit-token-metric](llm-emit-token-metric-policy.md) policy

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]
