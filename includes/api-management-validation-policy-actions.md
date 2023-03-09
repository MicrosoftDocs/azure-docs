---
author: dlepow
ms.service: api-management
ms.topic: include
ms.date: 12/05/2022
ms.author: danlep
---
## Actions

The content validation policies include one or more attributes that specify an action, which API Management takes when validating an entity in an API request or response against the API schema. 

* An action may be specified for elements that are represented in the API schema and, depending on the policy, for elements that aren't represented in the API schema. 

* An action specified in a policy's child element overrides an action specified for its parent.

Available actions:

| Action         | Description          |                                                                                                                         
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| ignore | Skip validation. |
| prevent | Block the request or response processing, log the verbose [validation error](#validation-errors), and return an error. Processing is interrupted when the first set of errors is detected. 
| detect | Log [validation errors](#validation-errors), without interrupting request or response processing. |