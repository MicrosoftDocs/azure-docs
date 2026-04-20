---
title: Recreate Microsoft Discovery resources in v2
description: Learn how to set up v2 infrastructure and recreate tools, bookshelves, agents, and workflows in Microsoft Discovery v2 using your exported v1 configurations.
author: leijgao
ms.author: leijiagao
ms.service: azure
ms.topic: how-to
ms.date: 04/09/2026

#CustomerIntent: As a Microsoft Discovery user, I want to recreate my v1 resources in v2 so that I can use v2-only features and prepare for v1 API retirement.
---

# Recreate Microsoft Discovery resources in v2

After you collect your v1 resource configurations, use this article to set up v2 infrastructure and recreate your tools, bookshelves, agents, and workflows in Microsoft Discovery v2.

Review the [v1 to v2 transition guide](concept-v1-to-v2-transition-guide.md) before you begin. It explains which resources require recreation and which are deprecated.

## Prerequisites

- An active [Azure subscription](https://aka.ms/discovery/publicpreviewportal) enabled for Microsoft Discovery Public Preview.
- **Microsoft Discovery Platform Administrator (Preview)** role or **Owner** role on your resource group.
- Completed v1 resource configuration collection. For detailed steps, see [Collect Microsoft Discovery v1 resource configurations](how-to-collect-v1-configurations.md).
- Azure CLI installed with the latest version. See [Install the Azure CLI](/cli/azure/install-azure-cli).

## Set up v2 infrastructure

Create the v2 infrastructure resources that host your recreated tools, agents, and workflows.

1. Create a v2 Supercomputer and Nodepools. For detailed steps, see [Manage Supercomputer and Nodepools](how-to-manage-supercomputers.md).
1. Create a v2 workspace. For detailed steps, see [Manage workspaces](how-to-manage-workspaces.md).
1. Create chat model deployments at the workspace level. For detailed steps, see [Create chat model deployment](quickstart-infrastructure-portal.md#5-create-chat-model-deployment).
1. Create v2 Storage Container and Storage Asset resources using the storage account and blob information you collected from your v1 Data Containers and Data Assets.
1. Create a v2 project under the new workspace and bind it with the Storage Container resources. For detailed steps, see [Create a project](quickstart-infrastructure-portal.md#8-create-a-project).

> [!NOTE]
> v2 uses workspace-level model deployments shared across all project agents. Deploy your preferred model, such as GPT-5.2, before you create agents.

## Recreate tools in v2

v1 tools can't be retained in v2. You must recreate each tool as a new v2 ARM resource. The JSON-based tool definition format from v1 is still accepted for v2 tool resources, so you can reuse your exported definitions.

1. Sign in to the [Azure portal](https://aka.ms/discovery/publicpreviewportal).
1. In the search bar, enter **Microsoft Discovery Tools** and select the service.
1. Select **+ Create** to create a new tool resource.
1. On the **Basics** tab, specify:

   - **Name** — Enter the tool name. You can use the same name as your v1 tool.
   - **Region** — Select the Azure region for the tool resource.

1. On the **Definition** tab, attach the `definitionContent` JSON file you extracted from the v1 export. The v2 tool resource accepts the same JSON definition format as v1.
1. Specify the tool **version** number.
1. On the **Environment Variables** tab, upload environment variables if your tool requires them. Match the values from your v1 tool configuration.
1. Select **Review + Create**, then select **Create**.
1. Repeat for all tools in your v1 configuration.

> [!NOTE]
> Tools can't be tested independently after creation. You can verify tool functionality after you attach them to an agent in a later step.

## Recreate bookshelves and knowledge bases in v2

Bookshelf is an independent ARM resource, not scoped to a workspace. You must create new bookshelves through the Azure portal and then create knowledge bases through Discovery Studio. In v2, bookshelf indexing is bound to Storage Containers and Storage Assets, which replace the v1 Data Containers and Data Assets.

### Create the bookshelf resource

1. Sign in to the [Azure portal](https://aka.ms/discovery/publicpreviewportal).
1. In the search bar, enter **Microsoft Discovery Bookshelves** and select the service.
1. Select **+ Create** to create a new bookshelf resource.
1. Create a new bookshelf with the same name and configuration as your v1 bookshelf.
1. Bind the bookshelf to the v2 Storage Container you created during [infrastructure setup](#set-up-v2-infrastructure).
1. Repeat for each bookshelf in your v1 configuration. If a v1 bookshelf had multiple knowledge bases, create a separate v2 bookshelf for each one.

### Create knowledge bases

1. Sign in to [Microsoft Discovery Studio](https://studio.discovery.microsoft.com).
1. Open your v2 project.
1. In the **Resources** pane, select the **+** button next to **Knowledge Bases**.
1. Create a new knowledge base under the bookshelf you created in the previous step with the same name as your v1 knowledge base.
1. Start the indexing process. Indexing time depends on your deployment size and data volume.
1. Wait for indexing to complete before you attach the knowledge base to agents.

> [!NOTE]
> Incremental indexing isn't supported. The full dataset is reindexed when you create a knowledge base.

## Recreate prompt agents in v2

v2 agents are data-plane resources managed through Discovery Studio. Use your exported v1 agent definitions to recreate each prompt agent.

1. In Discovery Studio, open your v2 project.
1. In the **Resources** pane, select the **+** button next to **Agents**.
1. Select **Agent** as the type.
1. Configure the agent using your v1 exported settings:

   - **Name**: Use the same agent name for consistency.
   - **Description**: Enter the agent description from your v1 export.
   - **Chat model**: Select your v2 model deployment (for example, `my-gpt-52-deployment`).
   - **Instructions**: Paste the system prompt from your v1 agent definition.

1. Attach the recreated v2 tools to the agent.
1. Attach the recreated v2 knowledge bases to the agent.
1. Select **Create agent**.
1. Test the agent in an investigation to verify that attached tools execute correctly.
1. Repeat for each prompt agent in your v1 configuration.

## Recreate workflow agents in v2

v1 workflows use a state machine model with events and transitions. v2 replaces this model with action flows that use explicit control structures. You must convert each v1 workflow to a v2 workflow agent.

1. In Discovery Studio, open your v2 project.
1. In the **Resources** pane, select the **+** button next to **Agents**.
1. Select **Workflow agent** as the type.
1. Enter the workflow **name** and **description**.
1. Convert your v1 state machine to the v2 action flow model:

   - Map v1 **states** to v2 **actions** (`InvokeAzureAgent`, `SetVariable`, `SendActivity`).
   - Replace v1 **event-based transitions** with v2 **control flow actions** (`ConditionGroup`, `GotoAction`).
   - Convert v1 **fixed entry points** to v2 `OnConversationStart` triggers.
   - Map v1 **agent references** to v2 `InvokeAzureAgent` actions that reference prompt agents by name.
   - Convert v1 **variable mappings** to v2 `Local.*` variable assignments.

1. Add human-in-the-loop steps using `Question` actions if your v1 workflow required user input.
1. Test the workflow by starting a chat with `@WorkflowAgentName` in an investigation.
1. Repeat for each workflow in your v1 configuration.

For more informationabout v2 workflow components and action types, see [Agent types in Microsoft Discovery](concept-discovery-agent-types.md).

## Validate the transition

After you recreate all resources, verify that your v2 environment matches your v1 functionality.

1. Create an investigation in your v2 project. For detailed steps, see [Quickstart: Get started with agents and investigations](quickstart-agents-studio.md#3-create-an-investigation).
1. Test each prompt agent by sending messages with `@AgentName` in the chat.
1. Verify that each tool executes correctly when invoked by agents.
1. Run each workflow agent end-to-end to confirm the action flow produces expected results.
1. Compare outputs between v1 and v2 agents to verify consistency.
1. Check that knowledge bases return relevant results for your domain queries.

After validation is complete, you can begin using your v2 resources for production workloads. Your v1 resources remain functional until the v1 APIs are retired.

## Related content

- [Collect Microsoft Discovery v1 resource configurations](how-to-collect-v1-configurations.md)
- [Microsoft Discovery v1 to v2 transition guide](concept-v1-to-v2-transition-guide.md)
- [Microsoft Discovery agents](concept-discovery-agent.md)
- [Agent types in Microsoft Discovery](concept-discovery-agent-types.md)
- [Manage workspaces in Microsoft Discovery](how-to-manage-workspaces.md)
