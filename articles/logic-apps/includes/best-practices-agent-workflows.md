---
ms.service: azure-logic-apps
ms.author: estfan
author: ecfan
ms.date: 10/18/2025
ms.topic: include
---

## Best practices for agents and tools

The following sections provide recommendations, best practices, and other guidance that can help you build better agents and tools.

### Agents

The following guidance provides best practices for agents.

##### Prototype agents and tools with 'Compose' actions

Rather than use actual actions and live connections to prototype your agent and tools, use [**Compose** actions](/azure/logic-apps/logic-apps-perform-data-operations#compose-action) to "mock" or simulate the actual actions. This approach provides the following benefits:

- **Compose** actions don't produce side effects, which make these actions useful for ideation, design, and testing.

- You can draft and refine agent instructions, prompts, tool names and descriptions plus agent parameters and descriptions - all without having to set up and use live connections.

- When you confirm that your agent and tools work with only the **Compose** actions, you're ready to swap in the actual actions.

- When you switch over to the actual actions, you have to reroute or recreate your agent parameters to work with the actual actions, which might take some time.

##### Manage chat history context length

The workflow agent maintains the chat history or *context*, including tool invocations, based on the current limit on the number of [tokens](/azure/ai-services/openai/overview#tokens) or messages to keep and pass into the model for the next interaction. Over time, the agent history grows and eventually exceeds your model's *context length* limit, or the maximum number of input tokens. Models differ in their context lengths.

For example, **gpt-4o** supports 128,000 input tokens where each token has 3-4 characters. When the agent history approaches the model's context length, consider dropping stale or irrelevant messages to stay below the limit.

Here are some approaches to reduce your agent history:

- Reduce the size of results from tools by using the [**Compose** action](/azure/logic-apps/logic-apps-perform-data-operations#compose-action). For more information, see [Tools - Best practices](#tools).

- Carefully craft your agent instructions and prompts to control the model's behavior.

- **Experimental capability**: You have the option to try chat reduction so you can reduce the maximum number of tokens or messages to keep in chat history and pass into the model.

  A workflow agent has almost the same advanced parameters as the [Azure OpenAI built-in, service provider connector](/azure/logic-apps/connectors/built-in/reference/openai/), except for the **Agent History Reduction Type** advanced parameter, which exists only in the agent. This parameter controls the history that the agent maintains, based on the maximum number of tokens or messages.

  This capability is in active development and might not work for all scenarios. You can change the **Agent History Reduction Type** option to reduce the limit on tokens or messages. You then specify the numerical limit that you want.
  
  To try the capability, follow these steps:

  1. On the designer, select the agent's title bar to open the information pane.
  1. On the **Parameters** tab, find the **Advanced parameters** section.
  1. Check whether the parameter named **Agent History Reduction Type** exists. If not, open the **Advanced parameters** list, and select that parameter.
  1. From the **Agent History Reduction Type** list, select one of the following options:

     | Option | Description |
     |--------|-------------|
     | **Token count reduction** | Shows the parameter named **Maximum Token Count**. Specifies the maximum number of tokens in agent history to keep and pass into the model for the next interaction. The default differs based on the currently used model in Azure OpenAI Service. The default limit is **128,000**. |
     | **Message count reduction** | Shows the parameter named **Message Count Limit**. Specifies the maximum number of messages in agent history to keep and pass into the model for the next interaction. No default limit exists. |

### Tools

The following guidance provides best practices for tools.

- The name is the most important value for a tool. Make sure the name is succinct and descriptive.

- The tool description provides useful and helpful context for the tool.

- Both the tool name and description have character limits.

  Some limits are enforced by the model in Azure OpenAI Service at run time, rather than when you save the changes in the agent in the workflow.

- Too many tools in the same agent can have a negative effect on agent quality.

  A good general guideline recommends that an agent includes no more than 10 tools. However, this guidance varies based on the model that you use from Azure OpenAI Service.

- In tools, actions don't need to have all their inputs come from the model.

  You can finely control which action inputs come from non-model sources and which inputs come from the model. For example, suppose a tool has an action that sends email. You can provide a plain and mostly static email body but use model-generated outputs for part of that email body.

- Customize or transform tool results before you pass them to the model.

  You can change the results from a tool before they pass into the model by using the [**Compose** action](/azure/logic-apps/logic-apps-perform-data-operations#compose-action). This approach provides the following benefits:

  - Improve response quality by reducing irrelevant [context](/azure/logic-apps/agent-workflows-concepts#key-concepts) that passes into the model. You send only the fields that you need from a large response.

  - Reduce billing charges for tokens that pass into the model and avoid exceeding the model's limit on *context length*, the maximum number of tokens that pass into the model. You send only the fields that you need.

  - Combine the results from multiple actions in the tool.

  - You can mock the tool results to simulate the expected results from actual actions. Mock actions leave data unchanged at the source and don't incur charges for resource usage outside Azure Logic Apps.

### Agent parameters

The following guidance provides best practices for agent parameters.

- The name is the most important value for an agent parameter. Make sure the name is succinct and descriptive.

- The agent parameter description provides useful and helpful context for the tool.