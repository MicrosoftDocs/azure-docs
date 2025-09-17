---
title: Hand Off AI Agent Tasks but Keep Chat Context
description: Learn how to transfer control to specialized AI agents but preserve chat continuity in a workflow using Azure Logic Apps. In this "handoff" pattern, agents pass on control when they get questions outside their expertise or knowledge domain.
service: ecfan
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, divswa, krmitta, azla
ms.topic: how-to
ms.collection: ce-skilling-ai-copilot
ms.date: 09/17/2025
ms.update-cycle: 180-days
# Customer intent: As an AI developer, I want to set up seamless handoffs to specialized agents that handle domain-specific tasks, while keeping the same chat continuity and context in my workflow using Azure Logic Apps.
---

# Hand off tasks to specialized AI agents but keep chat continuity in workflows for Azure Logic Apps (Preview)

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

- An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A Standard logic app resource

  This resource can be empty or have other workflows. In this guide, you create the conversational agent workflows that you need. These workflows include an empty agent and the default trigger that fires when a new chat session starts. You can't delete the default trigger, which is required for the workflow.

  If you don't have this resource, see [Create conversational agent workflows](create-conversational-agent-workflows.md).

## Key concepts

The following table describes the key concepts to understand for this example handoff agent workflow:

| Concept | Description |
|---------|-------------|
| Tool separation | The handoff pattern differentiates between the following kinds of tools: <br><br>- Regular tools that run business logic like "search", "refund", and "order" <br>- Delegation tools that hand off control to other agents |
| Agent specialization | Each agent has specific, relevant tools and capabilities. <br><br>- Triage agent: Has only handoff tools for delegation - no regular tools. <br>- Sales agent: Has the **execute_order** tool and the **handoff_back_to_triage** delegation tool. <br>- Refund agent | Has the **execute_refund** and **look_up_item** tools along with the **handoff_back_to_triage** delegation tool. |

## 1 - Create a conversational agent workflow

Follow these steps to create a new conversational agent workflow:

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the resource sidebar, under **Workflows**, select **Workflows**.

1. On the **Workflows** page toolbar, select **Add**.

1. On the **Create workflow** pane, in **Workflow name**, enter **customer-service-agent-workflow**. Select **Conversational Agents** > **Create**.

   The designer opens and shows a workflow with the default trigger named **When a new chat session starts** and an empty **Agent** action.

## 2 - Set up the customer service agent

Follow these steps to add set up your triage agent:

1. On the designer, select the empty **Agent** action.

1. On the information pane that opens, select the default action name, and rename the action to **Customer service agent**.

1. On the **Parameters** tab, in the **System instructions** box, provide the following information:

   ```
   You're a customer service agent for the Fabrikam company. Start by introducing yourself and understanding the customer's request. Based on their needs, you can hand off to specialized agents within this conversation for complex issues that require specialist expertise.

   Your role performs the following tasks:

   1. Greet customers professionally.
   2. Understand their request or problem.
   3. Always use a friendly, polite, and professional voice.
   4. Hand off tasks to the appropriate specialist agents when necessary.

   You exist in a multi-agent system designed to make agent coordination and execution easy. Agents use two primary abstractions: agents and handoffs. An agent includes instructions, tools, and the capability to hand off a conversation to another agent when appropriate. A handoff calls a handoff function, generally named 'handoff_<ID>_tool'. Transfers between agents happen seamlessly in the background. Don't mention or draw attention to these transfers in your conversation with the customer.
   ```

   The completed **Customer service agent** looks like the following example:

   :::image type="content" source="media/set-up-handoff-agent-workflow/customer-service-agent.png" alt-text="Screenshot shows finished customer service agent." lightbox="media/set-up-handoff-agent-workflow/customer-service-agent.png":::

## 3 - Add specialized agents with handoff descriptions

Follow these steps to add specialized agents:

### 3.1 - Add the refund specialist agent

1. On the designer, under your customer service agent, select the plus (**+**) sign, and then select **Add a hand-off agent**.

   A new empty agent appears on the designer. Your **Customer service agent** stays selected, but the agent information pane automatically switches from the **Parameters** tab to the **Handoffs** tab.

1. In the customer service agent's **Handoffs** tab, enter the following handoff description:

   ```
   Hand off to the refund specialist agent for refunds, returns, exchanges, and billing issues. This agent specializes in understanding refund policies, processing returns, and resolving billing disputes with empathy and efficiency.
   ```

   For example:

   :::image type="content" source="media/set-up-handoff-agent-workflow/handoff-description-refund-agent.png" alt-text="Screenshot shows customer service agent with handoff description for new refund specailist agent." lightbox="media/set-up-handoff-agent-workflow/handoff-description-refund-agent.png":::

1. Select the new agent, and rename the agent to **Refund specialist agent**.

   In the customer service agent's **Handoffs** tab, the default name for the refund agent automatically changes to the new name.

1. On the refund agent's **Parameters** tab, in the **System instructions** box, provide the following information:

   ```
   You're a refund specialist agent for the Fabrikam company. You handle refund requests, returns, and billing issues with empathy and efficiency. If the request is outside your refund expertise, you can hand back control to the main agent.

   Your role performs the following tasks:

   1. Understand the customer's reason for the refund.
   2. Propose appropriate solutions, for example, exchange, fix, or refund.
   3. If a refund is necessary, look up the item details and execute the refund.
   4. Alwayse use an understanding and helpful voice.
   5. Hand back control to the main agent for non-refund questions.

   You exist in a multi-agent system designed to make agent coordination and execution easy. Agents use two primary abstractions: agents and handoffs. An agent includes instructions, tools, and the capability to hand off a conversation to another agent when appropriate. A handoff calls a handoff function, generally named 'handoff_<ID>_tool'. Transfers between agents happen seamlessly in the background. Don't mention or draw attention to these transfers in your conversation with the customer.
   ```

   The completed **Refund specialist agent** looks like the following example:

   :::image type="content" source="media/set-up-handoff-agent-workflow/refund-agent.png" alt-text="Screenshot shows finished refund specialist agent." lightbox="media/set-up-handoff-agent-workflow/refund-agent.png":::

### 3.2 - Add the sales specialist agent

1. On the designer, under your customer service agent, hover over the handoff icon, and add another handoff agent.

   :::image type="content" source="media/set-up-handoff-agent-workflow/add-handoff-between-agents.png" alt-text="Screenshot shows handoff button between agents and selected option to add another handoff agent." lightbox="media/set-up-handoff-agent-workflow/add-handoff-between-agents.png":::

   After the new empty agent appears on the designer, your **Customer service agent** stays selected, but the agent information pane now shows the **Handoffs** tab with both the new agent and the refund specialist agent.

1. In the customer service agent's **Handoffs** tab, under the new agent, enter the following handoff description:

   ```
   Hand off to the sales specialist agent for product questions, purchase assistance, and sales consultations. This agent excels at understanding customer needs, recommending products, and facilitating purchases.
   ```

1. Select the new agent, and rename the agent to **Sales specialist agent**.

   In the customer service agent's **Handoffs** tab, the default name for the sales agent automatically changes to the new name.

1. On the sales agent's **Parameters** tab, in the **System instructions** box, provide the following information:

   ```
   You're a sales specialist agent for Fabrikam company. You help customers with product questions, recommendations, and purchase orders. If the question is outside your sales expertise, you can hand back control to the main agent.

   Your role performs the following tasks:

   1. Understand customer needs and problems.
   2. Recommend appropriate Fabrikam products.
   3. Discuss product features and benefits.
   4. Handle pricing and facilitate product orders when ready.
   5. Always use an enthusiastic but not pushy voice. Focus on solving customer problems.
   6. Hand back control to the main agent for non-sales questions.

   You exist in a multi-agent system designed to make agent coordination and execution easy. Agents use two primary abstractions: agents and handoffs. An agent includes instructions, tools, and the capability to hand off a conversation to another agent when appropriate. A handoff calls a handoff function, generally named 'handoff_<ID>_tool'. Transfers between agents happen seamlessly in the background. Don't mention or draw attention to these transfers in your conversation with the customer.
   ```

   The completed **Sales specialist agent** looks like the following example:

   :::image type="content" source="media/set-up-handoff-agent-workflow/sales-agent.png" alt-text="Screenshot shows finished sales specialist agent." lightbox="media/set-up-handoff-agent-workflow/sales-agent.png":::

## 4 - Add handoff tools to specialized agents

The system instructions for each specialist agent describes the capability to hand back control to the main customer service agent when they get requests outside their expertise domain. To provide this capability, you must add a handoff tool to each specialist agent.

### 4.1 - Add a handoff tool to the refund agent

Follow these steps to set up handoff capability from the refund agent to the customer service agent:

1. On the designer, select the **Refund specialist agent**. On the information pane that opens, select **Handoffs**.

1. From the **Select agents** list, choose the agent that gains control for the handoff, which is **Customer service agent** in this example.

1. In the **Handoff description** box for the customer service agent, provide a reason for the handoff, for example:

   `Return control to the customer service agent when the customer's request is unrelated to refunds, returns, or billing. For example, hand off when customers ask about products, orders, have general questions, or need help that's not related to refunds.`

### 4.2 - Add a handoff tool to the sales agent

1. On the designer, select the **Sales specialist agent**. On the information pane that opens, select **Handoffs**.

1. From the **Select agents** list, choose the agent that gains control for the handoff, which is **Customer service agent** in this example.

1. In the **Handoff description** box for the customer service agent, provide a reason for the handoff, for example:

   `Return control to the customer service agent when the customer's request is unrelated to sales, product recommendations, or help with purchaes or orders. For example, hand off when customers ask about refunds, returns, billing, have general questions, or need help that's not related to sales.`

## 5 - Set up agent-specific tools

Each agent has specialized tools to complete expertise-related tasks. In Azure Logic Apps, you build these tools for each agent. For simplicity, this example uses the **Compose** to mock tool calls. In reality, you'd select from available built-in or connector actions to perform real-world tasks for your specific scenario.

### 5.1 - Add tools to the refund agent

The refund specialist agent has two specialized tools: **look_up_item** and **execute_refund**.

1. On the designer, in the **Sales specialist agent**, under **Add tool**, select the plus sign (**+**) to add an action.

1. In the **Add an action** pane, find and select the **Compose** action.

   The following panes appear for the **Compose** action and the tool container.

   :::image type="content" source="{source}" alt-text="{alt-text}":::

1. Set up the tool to find product items and return an item ID:

   1. On the **Tool** pane, change pane name to **look_up_item**.

   1. In the **Description** box, provide details about the tool's purpose and tasks, for example:

      `Find the ID for the product or item. The search query can use a description or keywords.`

1. Set up the **Compose** action to implement the tool:

   1. On the **Compose** pane, change pane name to **Find item**.

   1. Select inside the **Inputs** box to display the input options.

   1. At the end of the **Inputs** box, select the stars symbol to generate the agent parameter.

   1. In the **Create agent parameter** window, provide the following information:

      | Parameter | Value |
      |-----------|-------|
      | **Name** | `order_id` |
      | **Type** | `String` |
      | **Description** | `The order ID` |

   1. When you're donem, select **Create**.

   1. 

## Best practices

A conversational agent worklfow that follows the handoff pattern automatically maintains seamless conversation context flow. No manual context passing is required. The following best practices help agents make accurate handoffs and correct choices about the tools to use.

### Handoff pattern best practices

The following table describes best practices for handoff patterns:

| Practice | Description |
|----------|-------------|
| Write clear handoff descriptions | Provide detailed handoff instructions in the agent's system instructions to specify exactly when and why to hand off to a specialist agent. For example, the following instructions usually increase handoff accuracy: <br><br>`You're an agent in a multi-agent system designed to make agent coordination and execution easy.` <br><br>`Agents use two primary abstractions: agents and handoffs. An agent includes instructions, tools, and the capability to hand off a conversation to another agent when appropriate. A handoff calls a handoff function, generally named 'handoff_<ID>_tool'.` <br><br>`Transfers between agents happen seamlessly in the background. Don't mention or draw attention to these transfers in your conversation with the end user.` <br><br>**Note**: In Azure Logic Apps, handoffs are built as tools. |
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

[!INCLUDE [clean-up-resources](includes/clean-up-resources.md)]

## Troubleshoot common problems

The following table lists common problems that you might encounter with the handoff pattern:

| Problem | Solution |
|---------|----------|
| Incorrect agent handoffs | Refine handoff descriptions with more specific triggers and conditions. Include the handoff instructions described in [Handoff pattern best practices](#handoff-pattern-best-practices). |
| Handoff loops between agents | Include clear exit strategies and prevent agents from repeatedly handing off the same requests. |
| Customers confused by agent transitions | Instruct agents to introduce their specialties for smoother transitions. |
| Tools unavailable to specialist agents | Check each agent for access to the appropriate tools for their specialty. |
| Poor handoff choices | Monitor and analyze handoff patterns. Update agent instructions based on performance. |

## Related content

- [Single agent versus multiple agents](single-versus-multiple-agents.md)
- [Create conversational agent workflows](create-conversational-agent-workflows.md)
