---
title: Create agents in Microsoft Discovery
description: Learn how to create prompt agents and workflow agents in Microsoft Discovery using Discovery Studio and the Foundry UI.
author: leijgao
ms.author: leijiagao
ms.service: azure
ms.topic: how-to
ms.date: 04/09/2026

#CustomerIntent: As a researcher or scientist, I want to create agents in Microsoft Discovery so that I can automate scientific research tasks and multi-step workflows.
---

# Create agents in Microsoft Discovery

Microsoft Discovery supports two agent types: prompt agents and workflow agents. You can author agents through the Discovery Studio UI or copy them from other projects.

This article walks you through each authoring method. Choose the approach that best fits your workflow and team needs.

## Prerequisites

- An active [Azure subscription](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- A deployed Microsoft Discovery workspace with at least one project. For setup instructions, see [Get started with Microsoft Discovery infrastructure](quickstart-infrastructure-portal.md).
- A chat model deployment configured at the workspace level. For details, see [Create a chat model deployment](quickstart-infrastructure-portal.md#6-create-chat-model-deployment).

## Create a prompt agent in Discovery Studio

A prompt agent is a declaratively defined agent that combines model configuration, instructions, tools, and natural language prompts to drive behavior. You can configure a prompt agent with knowledge bases for retrieval-augmented grounding and attach tools such as Microsoft discovery tool, code interpreter or Model Context Protocol (MCP) tools. Use the form-based experience in Discovery Studio to create one.

1. Sign in to [Microsoft Discovery Studio](https://studio.discovery.microsoft.com/).

1. Select the **Projects** tab in the left navigation pane and open your project.

1. In the **Resources** pane, select the **+** button next to **Agents**, then select **Create new agent**.

1. In the **New Agent** dialog, select **Agent** as the type.

1. Enter a **Name** and **Description** for the agent. The name serves as the agent's unique identifier within the project. Other agents and workflows reference it by this name.

1. Under **Chat model**, select your workspace-level model deployment.

1. Enter the agent **Instructions**. Instructions are natural language prompts that define the agent's behavior, persona, and reasoning approach.

1. (Optional) Attach tools to give the agent access to external capabilities:

   1. Expand the **Tools** section and select the search box. A dropdown list shows all available tools in your workspace. Select the checkbox next to each tool you want to attach.

      :::image type="content" source="media/how-to-agent-creation/agent-creation-tool-selection.jpg" alt-text="Screenshot showing the tool selection dropdown with available tools listed in the agent creation form." lightbox="media/how-to-agent-creation/agent-creation-tool-selection.jpg":::

   1. (Optional) If you want the agent to ask for user approval before running a tool, select the **Confirm before running tool** checkbox. When this option is enabled, the agent pauses and prompts the user for confirmation each time it invokes the tool during a conversation.

      :::image type="content" source="media/how-to-agent-creation/agent-creation-tool-confirmation.jpg" alt-text="Screenshot showing the Confirm before running tool checkbox in the agent creation form." lightbox="media/how-to-agent-creation/agent-creation-tool-confirmation.jpg":::

   1. Select **Done** to save your tool selections.

1. (Optional) Connect knowledge bases for retrieval-augmented grounding:

   1. Expand the **Knowledge Bases** section. A table lists all available knowledge bases with their name, associated bookshelf, and description. Select the checkbox next to each knowledge base you want the agent to use for grounding its responses.

      :::image type="content" source="media/how-to-agent-creation/agent-creation-knowledge-base-selection.jpg" alt-text="Screenshot showing the knowledge base selection table with available knowledge bases in the agent creation form." lightbox="media/how-to-agent-creation/agent-creation-knowledge-base-selection.jpg":::

1. Select **Create agent**.

Each save creates a new immutable version with full history. You can test the agent by typing `@AgentName` in an investigation chat.

## Copy a prompt agent from another project

You can reuse prompt agents across projects by copying them from an existing project.

1. Sign in to [Microsoft Discovery Studio](https://studio.discovery.microsoft.com/).

1. Select the **Projects** tab and open the target project where you want to add the agent.

1. In the **Resources** pane, select the **+** button next to **Agents**, then select **Copy from project**.

1. Select the source project that contains the agent you want to copy.

1. Select the agent to copy and confirm the operation.

The copied agent appears as a new agent in your target project. You can edit its instructions, tools, and settings independently of the original.

## Create a workflow agent

A workflow agent orchestrates multiple prompt agents through a defined sequence of actions. Creating a workflow agent requires two steps: define the agent in Discovery Studio, then build the action flow in the Foundry UI.

### Define the workflow agent in Discovery Studio

1. Sign in to [Microsoft Discovery Studio](https://studio.discovery.microsoft.com/).

1. Open your project from the **Projects** tab.

1. In the **Resources** pane, select the **+** button next to **Agents**, then select **Create new agent**.

1. In the **New Agent** dialog, select **Workflow** as the type.

1. Enter a **Name** and **Description** for the workflow agent.

1. Select **Create agent**.

### Edit the workflow in Foundry UI

After you create the workflow agent in Discovery Studio, use the Foundry UI canvas to define the action flow.

1. In Discovery Studio, select the workflow agent you created to open its details page.

1. Select the **Open in Foundry** link to open the workflow in the Foundry visual canvas editor. All changes you make in Foundry are synced back to Discovery.

   :::image type="content" source="media/how-to-agent-creation/agent-creation-workflow-edit.jpg" alt-text="Screenshot showing the workflow agent details page with the Open in Foundry link highlighted." lightbox="media/how-to-agent-creation/agent-creation-workflow-edit.jpg":::

1. In the Foundry workflow canvas, add actions to define the execution flow. Common actions include:

   | Action | Purpose |
   | --- | --- |
   | **SetVariable / SetMultipleVariables** | Initialize or update workflow variables |
   | **InvokeAzureAgent** | Invoke a prompt agent by name with argument bindings |
   | **SendActivity** | Send status messages to users during execution |
   | **ConditionGroup** | Add if/else branching based on variable expressions |
   | **Question** | Pause for user input (human-in-the-loop) |
   | **GotoAction** | Jump to a previous action for bounded iteration loops |
   | **EndConversation** | Terminate workflow execution |

1. Connect actions to create your orchestration pattern. The Foundry canvas supports sequential pipelines, conditional routing, iterative loops, and human-in-the-loop approval gates.

1. Save the workflow. Each save creates a new immutable version.

You can test the workflow by typing `@WorkflowName` in an investigation chat within Discovery Studio.

## Related content

- [Microsoft Discovery agents](concept-discovery-agent.md)
- [Agent types in Microsoft Discovery](concept-discovery-agent-types.md)
- [Quickstart: Get started with agents and investigations](quickstart-agents-studio.md)
