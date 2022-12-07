---
author: dlepow
ms.service: api-management
ms.topic: include
ms.date: 12/05/2022
ms.author: danlep
---
## Actions

This validation policy includes an attribute that specifies an action, which API Management takes when validating an entity in an API request or response against the API schema. 

* An action may be specified for elements that are represented in the API schema and, depending on the policy, for elements that aren't represented in the API schema. 

* An action specified in a policy's child element overrides an action specified for its parent.

Available actions:

| Action         | Description          |                                                                                                                         
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `ignore` | Skip validation. |
| `prevent` | Block the request or response processing, log the verbose [validation error](#validation-errors), and return an error. Processing is interrupted when the first set of errors is detected. 
| `detect` | Log [validation errors](#validation-errors), without interrupting request or response processing. |

## Logs

Details about the validation errors during policy execution are logged to the variable in `context.Variables` specified in the `errors-variable-name` attribute in the policy's root element. When configured in a `prevent` action, a validation error blocks further request or response processing and is also propagated to the `context.LastError` property. 

To investigate errors, use a [trace](../articles/api-management/trace-policy.md) policy to log the errors from context variables to [Application Insights](../articles/api-management/api-management-howto-app-insights.md).

## Performance implications

Adding a validation policy may affect API throughput. The following general principles apply:
* The larger the API schema size, the lower the throughput will be. 
* The larger the payload in a request or response, the lower the throughput will be. 
* The size of the API schema has a larger impact on performance than the size of the payload. 
* Validation against an API schema that is several megabytes in size may cause request or response timeouts under some conditions. The effect is more pronounced in the  **Consumption** and **Developer** tiers of the service. 

We recommend performing load tests with your expected production workloads to assess the impact of validation policies on API throughput.