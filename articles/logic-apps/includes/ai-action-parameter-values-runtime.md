---
ms.service: azure-logic-apps
ms.author: estfan
author: ecfan
ms.date: 11/18/2025
ms.topic: include
---

<a name="runtime-value-resolution"></a>

## Learn how parameter values resolve at runtime

This section describes the options for how your MCP server sources input parameter values for action-backed tools. You can either keep the model as the default source, or you can provide hardcoded static values for all interactions.

- Model-provided inputs

  By default, the model passes in parameter values at runtime based on the conversation between the agent and the end user. These values are dynamic and unknown until runtime.

- User-provided inputs

  You specify the parameter values during development. These values are typically hardcoded and stay the same across all interactions between the agent and the end user.
