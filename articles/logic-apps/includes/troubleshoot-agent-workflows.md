---
ms.service: azure-logic-apps
ms.author: estfan
author: ecfan
ms.date: 09/08/2025
ms.topic: include
---

## Troubleshoot problems

This section describes guidance to help troubleshoot errors or problems that you might encounter when you build or run agent workflows.

### Review tool execution data

The workflow run history provides useful information that helps you learn what happened during a specific run. For an agent workflow, you can find tool execution inputs and outputs for a specific agent loop iteration.

1. On the workflow menu, under **Tools**, select **Run history** to open the **Run history** page.

1. On the **Run history** tab, in the **Identifier** column, select the workflow run that you want.

   The monitoring view opens to show the status for each step.

1. Select the agent that you want to inspect. To the right side, the **Agent log** pane appears.

   This pane shows the agent log, including tool executions during the interaction.

1. To get tool execution data at a specific point, find that point in the agent log, and select the tool execution reference, for example:

   :::image type="content" source="media/troubleshoot-agent-workflows/tool-reference-links.png" alt-text="Screenshot shows agent log and selected tool execution link." lightbox="media/troubleshoot-agent-workflows/tool-reference-links.png":::

   This action moves you to the matching tool in monitoring view. The agent shows the current iteration count.

1. In monitoring view, select the agent or the action with the inputs, outputs, and properties that you want to review.

   The following example shows a selected action for the previously selected tool execution:

   :::image type="content" source="media/troubleshoot-agent-workflows/tool-execution-data.png" alt-text="Screenshot shows monitoring view, current agent loop iteration, and selected action with inputs and outputs at this point in time." lightbox="media/troubleshoot-agent-workflows/tool-execution-data.png":::

   If you select the agent, you can review the following information that passes into the model and returns from the model, for example:

   - Input messages passed into the model.
   - Output messages returned from the model.
   - Tools that the model asked the agent to call.
   - Tool results that passed back into the model.
   - Number of tokens that each request used.

1. To review a different agent loop iteration, in the agent, select the left or right arrow.

### Logs in Application Insights

If you set up Application Insights or advanced telemetry for your workflow, you can review the logs for agent events, like any other action. For more information, see [Enable and view enhanced telemetry in Application Insights for Standard workflows in Azure Logic Apps](/azure/logic-apps/enable-enhanced-telemetry-standard-workflows).

### Model maximum context length exceeded

If your agent's log history exceeds the model's *context length*, or the maximum number of input tokens, you get an error that looks like the following example:

**This model's maximum context length is 4097 tokens. However, you requested 4927 tokens (3927 in the messages, 1000 in the completion). Please reduce the length of the messages or completion.**

Try reducing the limit on the number of tokens or messages that your agent keeps in log and passes into the model for the next interaction. For this example, you might select **Token count reduction** and set **Maximum Token Count** to a number below the error's stated maximum context length, which is **4097**.

For more information, see [Manage chat history context length](#manage-chat-history-context-length).
