---
title: Hand Off AI Agent Tasks but Keep Chat Continuity
description: Learn how to set up transitions or transfer control to specialized AI agents, while keeping chat continuity and context in workflows for Azure Logic Apps.
service: ecfan
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, divswa, krmitta, azla
ms.topic: how-to
ms.collection: ce-skilling-ai-copilot
ms.date: 09/17/2025
ms.update-cycle: 180-days
# Customer intent: As an AI developer, I want to set up seamless handoffs between specialized agents that run domain-specific tasks, while keeping the same chat continuity and context in my workflow using Azure Logic Apps.
---

# Delegate tasks between AI agents but keep chat continuity and context in workflows for Azure Logic Apps (Preview)

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

> [!IMPORTANT]
>
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Sometimes your workflow needs to delegate tasks to specialized AI agents but preserve the chat conversation continuity and context across agent transitions. In this scenario, agents perform domain-specific tasks during different stages in the workflow or business process. These agents must also make dynamic decisions and understsand when to hand off tasks to other agents. This behavior is known as the [*handoff* pattern](single-versus-multiple-agents.md#handoff-pattern).

This guide describes how to set up specialized agents that follow the handoff pattern in your workflow. The example sets up a customer service handoff system that manages a complete customer journey from initial triage through specialized support.

The following table lists the inputs, tasks, and outputs:

| Element or agent | Description |
|------------------|-------------|
| Input | Customer service request |
| Triage agent | Classify the request and identify routing decisions. |
| Refund agent | Handle any refund requests and processing. |
| Sales agent | Handle sales inquiries and product recommendations. |
| Output | Specialized response with complete conversation context |

## Prerequisites

- Same requirements as [Create conversational agent workflows](create-conversational-agent-workflows.md)

- A conversational agent workflow with an empty agent and the default read-only trigger that fires when a chat session starts.

  If you don't have this workflow, see [Create conversational agent workflows](create-conversational-agent-workflows.md).

## Key concepts

The following table describes the key concepts to understand for this example handoff agent workflow:

| Concept | Description |
|---------|-------------|
| Tool separation | The handoff pattern differentiates between the following kinds of tools: <br><br>- Regular tools that run business logic like "search", "refund", and "order" <br>- Delegation tools that hand off control to other agents |
| Agent specialization | Each agent has specific, relevant tools and capabilities. <br><br>- Triage agent: Has only handoff tools for delegation - no regular tools. <br>- Sales agent: Has the **execute_order** tool and the **handoff_back_to_triage** delegation tool. <br>- Refund agent | Has the **execute_refund** and **look_up_item** tools along with the **handoff_back_to_triage** delegation tool. |

## Best practices

A conversational agent worklfow that follows the handoff pattern automatically maintains seamless conversation context flow. No manual context passing is required. The following best practices help agents make accurate handoffs and correct choices about the tools to use.

### Handoff best practices

The following table describes best practices for handoff patterns:

| Practice | Description |
|----------|-------------|
| Write clear handoff descriptions | Provide detailed handoff instructions in the agent's system instructions to specify exactly when and why to hand off to a specialist agent. For example, the following instructions usually increase handoff accuracy: <br><br>`You're an agent in a multi-agent system designed to make agent coordination and execution easy.` <br><br>`Agents uses two primary abstractions: agents and handoffs. An agent includes instructions, tools, and the capability to hand off a conversation to another agent when appropriate. A handoff calls a handoff function, generally named 'handoff_<ID>_tool'.` <br><br>`Transfers between agents happen seamlessly in the background. Don't mention or draw attention to these transfers in your conversation with the end user.` <br><br>**Note**: In Azure Logic Apps, handoffs are built as tools. |
| Build agents with proper specializations | Design agent roles with clear boundaries and specific expertise areas. |
| Specify natural handoff triggers | Include natural language cues and customer intent to trigger appropriate and accurate handoffs. |
| Set up bidrectional handoffs | Make sure agents can receive handoffs and return control when necessary. |
| Avoid handoff loops | Make sure agents have clear exit strategies. Don't repeatedly hand off the same conversation. |
| Monitor performance | Track handoff success rates and customer satisfaction across various agent handoffs. |

### Tool assignment best practices

The following table describes best practices for assigning tools to agents:

| Practice | Description |
|----------|-------------|
| Relevant, domain-specific tools | Agents only have tools relevant to their expertise area. For example: <br><br>- Refund agents: Item lookup, refund processing, return validation <br><br>- Sales agents: Product search, order processing, pricing tools |
| No access to cross-domain tools | Agents can't access tools outside their expertise. This practice prevents customer confusion and maintains clear boundaries. For example: <br><br>- Sales agents can't process refunds. <br><br>- Refund agents can't handle sales orders. |
| Clear tool descriptions | Provide precise information about each tool's purpose and tasks. Specify required input parameters and add usage guidelines like "Use price in US$". |

## Set up the data extractor agent

Follow these steps to set up the default empty agent:

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. Open your autonomous agent workflow in the designer.

1. On the designer, select the empty **Agent** action.

1. On the information pane that opens, select the default action name, and rename the action to **Data extractor agent**.

1. On the **Parameters** tab, provide the following information:

   | Parameter | Value |
   |-----------|-------|
   | **System instructions** | `Extract only the numerical values and their associated metrics from the text.`<br>`On a new line, format each as 'value: metric'.` <br><br>`Example format:` <br>`92%: customer satisfaction`<br>`45%: revenue growth` |
   | **User instructions** | `Data to use for extraction: @{triggerBody()?['report']}` <br><br>In this example, **`report`** is an output from the trigger named **When an HTTP request is received**. The expression, **triggerBody()?['report']**, returns the **'report'** trigger output. |

   The completed **Data extraction agent** looks like the following example:

   :::image type="content" source="media/set-up-prompt-chain-agent-workflow/data-extraction-agent.png" alt-text="Screenshot shows the finished data extraction agent." lightbox="media/set-up-prompt-chain-agent-workflow/data-extraction-agent.png":::

   Optionally, you can select the output from the **When an HTTP request is received** trigger in the dynamic content list, which creates the correct expression and includes the **`report`** trigger output.

   1. In the **User instructions** box, enter the following text, including a trailing space and keep the cursor in the position after the space:

      **`Data to use for extraction: `**

   1. From the options that appear when the cursor appears in an edit box, select the dynamic content list (lightning icon).

      :::image type="content" source="media/set-up-prompt-chain-agent-workflow/open-dynamic-content.png" alt-text="Screenshot shows data extraction agent, user instructions, example text, and selected lightning icon to open dynamic content list." lightbox="media/set-up-prompt-chain-agent-workflow/open-dynamic-content.png":::

   1. From the dynamic content list, under **When an HTTP request is received**, select **report**.

      :::image type="content" source="media/set-up-prompt-chain-agent-workflow/select-report.png" alt-text="Screenshot shows data extraction agent, user instructions, and dynamic content list with selected trigger output." lightbox="media/set-up-prompt-chain-agent-workflow/select-report.png":::

      When you're done, the **User instructions** box looks like the following example:

      :::image type="content" source="media/set-up-prompt-chain-agent-workflow/data-extraction-user-instructions.png" alt-text="Screenshot shows data extraction agent, user instructions, and resolved trigger output." lightbox="media/set-up-prompt-chain-agent-workflow/data-extraction-user-instructions.png":::

## Set up the data conversion agent

Follow these steps to set up the next agent, which receives output from the data extractor agent.

1. Under **Data extraction agent**, select the plus sign (**+**), and then select **Add an agent**.

1. On the designer, select the new empty **Agent** action.

1. On the information pane that opens, select the default action name, and rename the action to **Data conversion agent**.

1. On the **Parameters** tab, provide the following information:

   | Parameter | Value |
   |-----------|-------|
   | **System instructions** | `Convert all numerical values to percentages where possible.`<br>`If not a percentage or points, convert to decimal, for example, 92 points -> 92%.` <br>`Keep one number per line.` <br><br>`Example format:` <br>`92%: customer satisfaction`<br>`45%: revenue growth` |
   | **User instructions** | `Data to use for conversion: @{outputs('Data_extraction_agent')?['lastAssistantMessage']}` <br><br>**Note**: The expression, **outputs('Data_extraction_agent')?['lastAssistantMessage']**, inserts the last assistant message from **Data extraction agent** into the user instructions for **Data conversion agent**. |

   The completed **Data conversion agent** looks like the following example:

   :::image type="content" source="media/set-up-prompt-chain-agent-workflow/data-conversion-agent.png" alt-text="Screenshot shows the finished data conversion agent." lightbox="media/set-up-prompt-chain-agent-workflow/data-conversion-agent.png":::

   Optionally, you can select the output from the **Data extraction agent** in the dynamic content list, which creates the correct expression and includes the **`lastAssistantMessage`** output from the **Data extraction agent**.

   1. In the **User instructions** box, enter the following text, including a trailing space and keep the cursor in the position after the space:

      **`Data to use for conversion: `**

   1. From the options that appear when the cursor appears in an edit box, select the expression editor this time (function icon).

      :::image type="content" source="media/set-up-prompt-chain-agent-workflow/open-expression-editor.png" alt-text="Screenshot shows data extraction agent, user instructions, example text, and selected function icon to open expression editor." lightbox="media/set-up-prompt-chain-agent-workflow/open-expression-editor.png":::

   1. In the expression list, select **Dynamic content**.

   1. From the dynamic content list, under **Data extraction agent**, select **Last Assistant Message**, and then select **Add**.

      :::image type="content" source="media/set-up-prompt-chain-agent-workflow/select-last-assistant-message-extraction.png" alt-text="Screenshot shows data conversion agent, user instructions, and dynamic content list with selected extraction agent output." lightbox="media/set-up-prompt-chain-agent-workflow/select-last-assistant-message-extraction.png":::

      When you're done, the **User instructions** box looks like the following example:

      :::image type="content" source="media/set-up-prompt-chain-agent-workflow/data-conversion-user-instructions.png" alt-text="Screenshot shows data conversion agent, user instructions, and resolved extraction agent output." lightbox="media/set-up-prompt-chain-agent-workflow/data-conversion-user-instructions.png":::

## Set up the data sorting agent

Follow these steps to set up the next agent, which receives the formatted table from the data conversion agent.

1. Under **Data conversion agent**, add a new agent.

1. On the designer, select the new empty **Agent** action.

1. On the information pane that opens, select the default action name, and rename the action to **Data sorting agent**.

1. On the **Parameters** tab, provide the following information:

   | Parameter | Value |
   |-----------|-------|
   | **System instructions** | `Sort all lines in descending order by numerical value.`<br>`On each line, keep the format 'value: metric'.` <br><br>`Example format:` <br>`92%: customer satisfaction`<br>`87%: employee satisfaction` |
   | **User instructions** | `Data to use for sorting: @{outputs('Data_conversion_agent')?['lastAssistantMessage']}` <br><br>**Note**: The expression, **outputs('Data_conversion_agent')?['lastAssistantMessage']**, inserts the last assistant message from **Data conversion agent** into the user instructions for **Data sorting agent**. |

   The completed **Data sorting agent** looks like the following example:

   :::image type="content" source="media/set-up-prompt-chain-agent-workflow/data-sorting-agent.png" alt-text="Screenshot shows the finished data sorting agent." lightbox="media/set-up-prompt-chain-agent-workflow/data-sorting-agent.png":::

   Optionally, you can select the output from the **Data conversion agent** in the dynamic content list, which creates the correct expression and includes the **`lastAssistantMessage`** output from the **Data conversion agent**.

   1. In the **User instructions** box, enter the following text, including a trailing space and keep the cursor in the position after the space:

      **`Data to use for sorting: `**

   1. From the options that appear when the cursor appears in an edit box, select the expression editor this time (function icon).

   1. In the expression list, select **Dynamic content**.

   1. From the dynamic content list, under **Data conversion agent**, select **Last Assistant Message**, and then select **Add**.

      :::image type="content" source="media/set-up-prompt-chain-agent-workflow/select-last-assistant-message-conversion.png" alt-text="Screenshot shows data sorting agent, user instructions, and dynamic content list with selected conversion agent output." lightbox="media/set-up-prompt-chain-agent-workflow/select-last-assistant-message-conversion.png":::

      When you're done, the **User instructions** box looks like the following example:

      :::image type="content" source="media/set-up-prompt-chain-agent-workflow/data-sorting-user-instructions.png" alt-text="Screenshot shows data sorting agent, user instructions, and resolved conversion agent output." lightbox="media/set-up-prompt-chain-agent-workflow/data-sorting-user-instructions.png":::

## Set up the Response action

This example started the workflow with the **When an HTTP request is received** trigger. For workflows that start with this trigger, make sure the workflow returns the result to the caller by adding the **Response** action at the end of the workflow.

1. Follow the [general steps to add the action named **Response**](add-trigger-action-workflow.md?tabs=standard#add-action) to your workflow.

1. On the designer, select the **Response** action.

1. On the information pane, under **Parameters**, in the **Body** parameter, specify the results to return to the caller.

   For this example, the **Body** parameter specifies that the result is the **Last Assistant Message** output from the **Data sorting agent** and returns this data to the caller:

   ```json
   {
      "type": "Response",
      "kind": "Http",
      "inputs": {
         "statusCode": 200,
         "body": {
            "result": "@outputs('Data_sorting_agent')?['lastAssistantMessage']"
         }
      },
   }
   ```

   :::image type="content" source="media/set-up-prompt-chain-agent-workflow/response-action.png" alt-text="Screenshot shows Response action, which returns output from the data sorting agent to the workflow caller." lightbox="media/set-up-prompt-chain-agent-workflow/response-action.png":::

## Test your agent workflow

1. On the designer toolbar, select **Run** **>** **Run with payload**, and provide the following sample input as the "report":

   ```json
   {
      "report": "Q3 Performance Summary:
         Our customer satisfaction score rose to 92 points this quarter.
         Revenue grew by 45% compared to last year.
         Market share in our primary market is 23% .
         Customer churn decreased to 5% from 8%.
         New user acquisition cost is $43 per user.
         Product adoption rate increased to 78%.
         Employee satisfaction is at 87 points.
         Operating margin improved to 34%."
   }
   ```

   The following list shows the expected progression for the output:

   1. Extract values and metrics from raw data.
   1. Convert the extracted information to the target format.
   1. Sort the data in the formatted data.

1. To view the results, on the workflow sidebar, under **Tools**, select **Run history**.

1. On the **Run history** tab, select the most recent workflow run.

   1. In the **Agent log**, review the responses from each agent for the system instructions that you specified.

   1. To review the status, inputs, and outputs for each operation, select that operation in the monitoring view window.

[!INCLUDE [clean-up-resources](includes/clean-up-resources.md)]

## Troubleshoot common problems

The following table lists common problems that you might encounter with the handoff pattern:

| Problem | Solution |
|---------|----------|
| Incorrect agent handoffs | Refine handoff descriptions with more specific triggers and conditions. Include the handoff instructions described in [Handoff best practices](#handoff-best-practices). |
| Handoff loops between agents | Include clear exit strategies and prevent agents from repeatedly handing off the same requests. |
| Customers confused by agent transitions | Instruct agents to introduce their specialties for smoother transitions. |
| Tools unavailable to specialist agents | Check each agent for access to the appropriate tools for their specialty. |
| Poor handoff choices | Monitor and analyze handoff patterns. Update agent instructions based on performance. |

## Related content

- [Single versus multiple agents](single-versus-multiple-agents.md)
- [Create autonomous agent workflows](create-autonomous-agent-workflows.md)
