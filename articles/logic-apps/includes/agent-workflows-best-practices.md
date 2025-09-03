---
ms.service: azure-logic-apps
ms.author: estfan
author: ecfan
ms.date: 09/08/2025
ms.topic: include
---

## Best practices for agents and tools

The following sections provide recommendations, best practices, and other guidance that can help you build better agents and tools.

### Agents

The following guidance provides best practices for agents.

##### Prototype agents and tools with 'Compose' actions

Rather than use actual actions and live connections to prototype your agent and tools, use [**Compose** actions](/azure/logic-apps/logic-apps-perform-data-operations#compose-action) to "mock" or simulate the actual actions. This approach provides the following benefits:

- **Compose** actions don't produce side effects, which make these actions useful for ideation, design, and testing.

- You can draft and refine system instructions, prompts, tool names and descriptions plus agent parameters and descriptions - all without having to set up and use live connections.

- When you confirm that your agent and tools work with only the **Compose** actions, you're ready to swap in the actual actions.

- When you switch over to the actual actions, you have to reroute or recreate your agent parameters to work with the actual actions, which might take some time.

##### Manage chat history context length

The workflow agent maintains the chat history or *context*, including tool invocations, based on the current limit on the number of [tokens](/azure/ai-services/openai/overview#tokens) or messages to keep and pass into the model for the next interaction. Over time, the agent history grows and eventually exceeds your model's *context length* limit, or the maximum number of input tokens. Models differ in their context lengths.

For example, **gpt-4o** supports 128,000 input tokens where each token has 3-4 characters. When the agent history approaches the model's context length, consider dropping stale or irrelevant messages to stay below the limit.

Here are some approaches to reduce your agent history:

- Reduce the size of results from tools by using the [**Compose** action](/azure/logic-apps/logic-apps-perform-data-operations#compose-action). For more information, see [Tools - Best practices](#tools).

- Carefully craft your system instructions and prompts to control the model's behavior.

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

  - Improve response quality by reducing irrelevant [context](agent-workflows-concepts.md#key-concepts) that passes into the model. You send only the fields that you need from a large response.

  - Reduce billing charges for tokens that pass into the model and avoid exceeding the model's limit on *context length*, the maximum number of tokens that pass into the model. You send only the fields that you need.

  - Combine the results from multiple actions in the tool.

  - You can mock the tool results to simulate the expected results from actual actions. Mock actions leave data unchanged at the source and don't incur charges for resource usage outside Azure Logic Apps.

### Agent parameters

The following guidance provides best practices for agent parameters.

- The name is the most important value for an agent parameter. Make sure the name is succinct and descriptive.

- The agent parameter description provides useful and helpful context for the tool.

## Troubleshoot problems

This section describes guidance to help troubleshoot errors or problems that you might encounter when you build or run agent workflows.

#### Review tool execution data

The workflow run history provides useful information that helps you learn what happened during a specific run. For an agent workflow, you can find tool execution inputs and outputs for a specific agent loop iteration.

1. On the workflow menu, under **Tools**, select **Run history** to open the **Run history** page.

1. On the **Run history** tab, in the **Identifier** column, select the workflow run that you want.

   The monitoring view opens to show the status for each step.

1. Select the agent that you want to inspect. To the right side, the **Agent log** pane appears.

   This pane shows the agent log, including tool executions during the interaction.

1. To get tool execution data at a specific point, find that point in the agent log, and select the tool execution reference, for example:

   :::image type="content" source="media/create-autonomous-agent-workflows/tool-reference-links.png" alt-text="Screenshot shows agent log and selected tool execution link." lightbox="media/create-autonomous-agent-workflows/tool-reference-links.png":::

   This action moves you to the matching tool in monitoring view. The agent shows the current iteration count.

1. In monitoring view, select the agent or the action with the inputs, outputs, and properties that you want to review.

   The following example shows a selected action for the previously selected tool execution:

   :::image type="content" source="media/create-autonomous-agent-workflows/tool-execution-data.png" alt-text="Screenshot shows monitoring view, current agent loop iteration, and selected action with inputs and outputs at this point in time." lightbox="media/create-autonomous-agent-workflows/tool-execution-data.png":::

   If you select the agent, you can review the following information that passes into the model and returns from the model, for example:

   - Input messages passed into the model.
   - Output messages returned from the model.
   - Tools that the model asked the agent to call.
   - Tool results that passed back into the model.
   - Number of tokens that each request used.

1. To review a different agent loop iteration, in the agent, select the left or right arrow.

#### Logs in Application Insights

If you set up Application Insights or advanced telemetry for your workflow, you can review the logs for agent events, like any other action. For more information, see [Enable and view enhanced telemetry in Application Insights for Standard workflows in Azure Logic Apps](/azure/logic-apps/enable-enhanced-telemetry-standard-workflows).

#### Model maximum context length exceeded

If your agent's log history exceeds the model's *context length*, or the maximum number of input tokens, you get an error that looks like the following example:

**This model's maximum context length is 4097 tokens. However, you requested 4927 tokens (3927 in the messages, 1000 in the completion). Please reduce the length of the messages or completion.**

Try reducing the limit on the number of tokens or messages that your agent keeps in log and passes into the model for the next interaction. For this example, you might select **Token count reduction** and set **Maximum Token Count** to a number below the error's stated maximum context length, which is **4097**.

For more information, see [Manage chat history context length](#manage-chat-history-context-length).