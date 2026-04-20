---
title: Collect Microsoft Discovery v1 resource configurations
description: Learn how to export and document your v1 resource configurations for tools, agents, workflows, and knowledge bases before transitioning to Microsoft Discovery v2.
author: leijgao
ms.author: leijiagao
ms.service: azure
ms.topic: how-to
ms.date: 04/09/2026

#CustomerIntent: As a Microsoft Discovery user, I want to collect my v1 resource configurations so that I can recreate them in v2 during the transition.
---

# Collect Microsoft Discovery v1 resource configurations

Before you transition from Microsoft Discovery v1 to v2, you must collect and export your existing resource configurations. There's no in-place migration path, so all resources must be recreated under v2. This article walks you through exporting the definitions you need.

Review the [v1 to v2 transition guide](concept-v1-to-v2-transition-guide.md) before you begin. It explains which resources require recreation and which are deprecated.

## Prerequisites

- An active [Azure subscription](https://aka.ms/discovery/publicpreviewportal) enabled for Microsoft Discovery Public Preview.
- **Microsoft Discovery Platform Administrator (Preview)** role or **Owner** role on your resource group.
- Access to your existing v1 Microsoft Discovery workspace, project, and resources.
- Azure CLI installed with the latest version. See [Install the Azure CLI](/cli/azure/install-azure-cli).

## Collect v1 Data Container and Data Asset configurations

Data Containers and Data Assets are deprecated in v2. They're replaced by Storage Containers and Storage Assets respectively. Because other resources such as bookshelves and projects depend on storage data, collect this information first.

1. Sign in to the [Azure portal](https://aka.ms/discovery/publicpreviewportal).
1. Identify all v1 Data Container resources in your resource group.
1. For each Data Container, record:

   - **Data Container name**
   - **Associated Data Assets** and their names

1. For each Data Asset, record the underlying backend storage information:

   - **Storage account name**
   - **Storage blob container** and **blob path**

1. Verify that the source storage blobs in the Azure Storage account are still accessible.

> [!IMPORTANT]
> v1 Data Container and Data Asset resources aren't accessible from v2 APIs. You must create equivalent Storage Container and Storage Asset resources in v2 using the storage account and blob information you recorded. For more information, see [v1 to v2 transition guide - DataContainers and DataAssets](concept-v1-to-v2-transition-guide.md#discovery-datacontainers-and-discovery-dataassets).

## Collect v1 tool definitions

Tools extend agent capabilities with domain-specific scientific operations. Before you create v2 resources, export your v1 tool definitions to preserve their configurations.

1. Sign in to the [Azure portal](https://aka.ms/discovery/publicpreviewportal).
1. In the search bar, enter **Microsoft Discovery Tools** and select the service.
1. Locate your v1 tool resources.
1. For each tool, record the following configuration details:

   - **Tool name** and **description**
   - **Container image** reference (Azure Container Registry path)
   - **Endpoint configuration** (port, protocol, health check path)
   - **Environment variables** and **secrets**
   - **Input and output schemas**

1. Export the tool definition with Azure CLI for reference:

   ```azurecli
   az resource show \
     --ids "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Discovery/tools/<tool-name>" \
     --api-version 2025-07-01-preview \
     --output json > v1-tool-<tool-name>.json
   ```

1. From the exported JSON, extract the `properties.definitionContent` object. Only the definition content is needed to recreate the tool in v2. The following example shows the structure of a typical tool definition:

   ```json
   {
     "category": "Scientific Computing",
     "code_environments": [
       {
         "command": "python \"/{{scriptName}}\"",
         "description": "Python code environment on MolToolkit container image.",
         "infra_node": "worker",
         "language": "python"
       }
     ],
     "description": "MolToolkit is a comprehensive toolkit for molecular analysis and data processing.",
     "infra": [
       {
         "compute": {
           "infiniband": false,
           "max_resources": { "cpu": 2, "gpu": 0, "ram": "16Gi", "storage": "32Gi" },
           "min_resources": { "cpu": 1, "gpu": 0, "ram": "8Gi", "storage": "8Gi" },
           "pool_size": 1,
           "pool_type": "static",
           "recommended_sku": ["Standard_D4s_v3"]
         },
         "image": {
           "acr": "<your-acr>.azurecr.io/<image-name>:<tag>"
         },
         "infra_type": "container",
         "name": "worker"
       }
     ],
     "license": "MIT",
     "name": "moltoolkit",
     "version": "1.0.0"
   }
   ```

1. Repeat this process for each tool in your resource group.

> [!TIP]
> Store all exported configurations in a dedicated folder. You reference these files when you recreate resources in v2.

## Collect v1 agent definitions

v1 agents are independent ARM resources on the control plane. Export each agent's configuration so you can recreate them as v2 data-plane resources.

1. In the Azure portal, search for **Microsoft Discovery Agents** and select the service.
1. Locate your v1 agent resources.
1. For each agent, record the following details:

   - **Agent name** and **description**
   - **Instructions** (system prompt)
   - **Model configuration** (model name, temperature, top-P)
   - **Tool references** (list of attached tools)
   - **Knowledge base references** (attached bookshelves)
   - **Structured inputs and outputs** (schemas and defaults)

1. Export the agent definition with Azure CLI:

   ```azurecli
   az resource show \
     --ids "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Discovery/agents/<agent-name>" \
     --api-version 2025-07-01-preview \
     --output json > v1-agent-<agent-name>.json
   ```

1. From the exported JSON, extract the `properties.definitionContent` object. The following example shows a typical agent definition structure:

   ```json
   {
     "agent": {
       "description": "A general Q&A agent for molecular science questions",
       "instructions": "You are an AI agent specialized in molecular science and chemistry...",
       "model": "azureml://registries/azure-openai/models/gpt-4o/versions/2024-11-20",
       "name": "ScienceQAAgent",
       "response_format": "auto",
       "temperature": 0.3,
       "top_p": 0.1
     },
     "extension": {
       "events": [],
       "inputs": [
         {
           "description": "The user request for which the plan needs to be generated.",
           "name": "userGoal",
           "type": "llm"
         }
       ],
       "outputs": [],
       "system_prompts": {}
     }
   }
   ```

   Also record the top-level `properties.knowledgeBases` and `properties.tools` arrays, which list the knowledge bases and tools attached to the agent.

1. Repeat for each agent in your resource group.

## Collect v1 workflow definitions

v1 workflows are independent ARM resources that use a state machine model with events and transitions. Export these definitions before you transition to v2's action flow model.

1. In the Azure portal, search for **Microsoft Discovery Workflows** and select the service.
1. Locate your v1 workflow resources.
1. For each workflow, record the following details:

   - **Workflow name** and **description**
   - **State definitions** (all states and their purposes)
   - **Event triggers** and **transitions** between states
   - **Agent references** within each state
   - **Input/output variable mappings**
   - **Conditional logic** and **branching rules**

1. Export the workflow definition with Azure CLI:

   ```azurecli
   az resource show \
     --ids "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Discovery/workflows/<workflow-name>" \
     --api-version 2025-07-01-preview \
     --output json > v1-workflow-<workflow-name>.json
   ```

1. From the exported JSON, extract the `properties.definitionContent` object. The following example shows a typical workflow definition with states, transitions, and variables:

   ```json
   {
     "name": "PrebioticChemistryWF",
     "startstate": "NetworkGeneration",
     "states": [
       {
         "actors": [
           {
             "agent": "SynthesisNetworkAgent",
             "humanInLoopMode": "never",
             "inputs": { "userGoal": "userGoal", "agentTeam": "agentTeam" },
             "maxTurn": 5,
             "streamOutput": false,
             "thread": "MainThread"
           }
         ],
         "isFinal": false,
         "name": "NetworkGeneration"
       },
       {
         "actors": [],
         "isFinal": true,
         "name": "End"
       }
     ],
     "transitions": [
       { "event": "GenerateNetwork", "from": "NetworkGeneration", "to": "Evaluation" },
       { "event": "ApproveNetwork", "from": "Evaluation", "to": "End" }
     ],
     "variables": [
       { "Type": "thread", "name": "MainThread" },
       { "Type": "userDefined", "name": "userGoal" }
     ]
   }
   ```

1. Repeat for each workflow in your resource group.

> [!IMPORTANT]
> v2 replaces state machines with action flows. You can't import v1 workflow definitions directly into v2. You must manually convert each workflow to the v2 action flow model.

## Collect v1 bookshelf and knowledge base configurations

Bookshelves and knowledge bases must be recreated in v2. In v1, each knowledge base is created by binding with Data Assets in a Data Container. Use the Data Container and Data Asset information you collected in the [first step](#collect-v1-data-container-and-data-asset-configurations) to map the data sources for each knowledge base.

1. In the Azure portal, search for **Microsoft Discovery Bookshelves** and select the service.
1. Locate your v1 bookshelf resources.
1. For each bookshelf and knowledge base, record:

   - **Bookshelf name** and **description**
   - **Knowledge base name**
   - **Data Container** name and the **Data Assets** used for indexing

> [!IMPORTANT]
> v2 supports only one knowledge base per bookshelf. If your v1 bookshelf contains multiple knowledge bases, plan to create a separate v2 bookshelf for each knowledge base.

## Next step

After you collect all v1 resource configurations, proceed to recreate them in v2.

> [!div class="nextstepaction"]
> [Recreate Microsoft Discovery resources in v2](how-to-recreate-v2-resources.md)

## Related content

- [Microsoft Discovery v1 to v2 transition guide](concept-v1-to-v2-transition-guide.md)
- [Recreate Microsoft Discovery resources in v2](how-to-recreate-v2-resources.md)
