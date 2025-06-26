---
title: Azure API Management policy reference - llm-content-safety
description: Reference for the llm-content-safety policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.collection: ce-skilling-ai-copilot
ms.custom:
ms.topic: reference
ms.date: 03/04/2025
ms.update-cycle: 180-days
ms.author: danlep
---

# Enforce content safety checks on LLM requests

[!INCLUDE [api-management-availability-premium-dev-standard-basic-premiumv2-standardv2-basicv2](../../includes/api-management-availability-premium-dev-standard-basic-premiumv2-standardv2-basicv2.md)]

The `llm-content-safety` policy enforces content safety checks on large language model (LLM) requests (prompts) by transmitting them to the [Azure AI Content Safety](/azure/ai-services/content-safety/overview) service before sending to the backend LLM API. When the policy is enabled and Azure AI Content Safety detects malicious content, API Management blocks the request and returns a `403` error code. 

Use the policy in scenarios such as the following:

* Block requests that contain predefined categories of harmful content or hate speech
* Apply custom blocklists to prevent specific content from being sent
* Shield against prompts that match attack patterns

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Prerequisites

* An [Azure AI Content Safety](/azure/ai-services/content-safety/) resource. 
* An API Management [backend](backends.md) configured to route content safety API calls and authenticate to the Azure AI Content Safety service, in the form `https://<content-safety-service-name>.cognitiveservices.azure.com`. Managed identity with Cognitive Services User role is recommended for authentication.


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
| backend-id	| Identifier (name) of the Azure AI Content Safety backend to route content-safety API calls to. Policy expressions are allowed.	|  Yes	| N/A |
| shield-prompt	| If set to `true`, content is checked for user attacks. Otherwise, skip this check. Policy expressions are allowed.	| No	| `false` |


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
| threshold	| Specifies the threshold value for this category at which request are blocked. Requests with content severities less than the threshold aren't blocked. The value must be between 0 and 7. Policy expressions are allowed.	| Yes	| N/A |


## Usage

- [**Policy sections:**](./api-management-howto-policies.md#understanding-policy-configuration) inbound
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API
- [**Gateways:**](api-management-gateways-overview.md) classic, v2, consumption, self-hosted, workspace

### Usage notes

* The policy runs on a concatenation of all text content in a completion or chat completion request.
* If the request exceeds the character limit of Azure AI Content Safety, a `403` error is returned.
* This policy can be used multiple times per policy definition.

## Example

The following example enforces content safety checks on LLM requests using the Azure AI Content Safety service. The policy blocks requests that contain speech in the `Hate` or `Violence` category with a severity level of 4 or higher. The `shield-prompt` attribute is set to `true` to check for adversarial attacks.

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

* [Content validation](api-management-policies.md#content-validation)
* [llm-token-limit](llm-token-limit-policy.md) policy
* [llm-emit-token-metric](llm-emit-token-metric-policy.md) policy

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]