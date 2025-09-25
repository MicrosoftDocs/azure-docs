---
title: Workflows with AI Agents and Models
description: Learn how workflows benefit from using AI agents with models to complete tasks in single-tenant Azure Logic Apps.
author: ecfan
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, divswa, karansin, krmitta, azla
ms.topic: concept-article
ms.collection: ce-skilling-ai-copilot
ms.date: 09/14/2025
ms.update-cycle: 180-days
# Customer intent: As an AI developer, I want to learn about the benefits and support that Azure Logic Apps provides to build flexible, adaptable, and responsive workflows that complete tasks using AI agents, models, and other AI capabilities for my integration and automation scenarios.
---

# Workflows with AI agents and models in Azure Logic Apps (Preview)

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

> [!IMPORTANT]
>
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure Logic Apps supports workflows that complete tasks by using *agents* with *large language models* (LLMs). An agent uses an iterative looped process to solve complex, multi-step problems. An LLM is a trained program that recognizes patterns and performs jobs without human interaction, for example:

- Analyze, interpret, and reason about information such as instructions, prompts, inputs, and other data.
- Make decisions, based on results and available data.
- Formulate and return answers back to the prompter, based on the agent's instructions.

You can build workflows that use autonomous or conversational agents. The agent uses natural language to communicate with you and the connected model. The agent also uses model-generated outputs to do work either with or without human interaction. The model helps the agent provide the following capabilities:

- Accept information about the agent's role, how to operate, and how to respond.
- Receive and respond to instructions and requests, or *prompts*.
- Process inputs, analyze data, and make choices, based on available information.
- Choose tools to complete the tasks necessary to fulfill requests. A *tool* is basically a sequence with one or more actions that complete a task.
- Adapt to environments that require flexibility and are fluid, dynamic, unpredictable, or unstable.

With [1,400+ connectors](/connectors/connector-reference/connector-reference-logicapps-connectors) that you can use to build tools for an agent to use, agent workflows support a vast range of scenarios that greatly benefit from agent and model capabilities. Based on your scenario, create either an autonomous agent workflow without human interaction or a conversational agent workflow with human interaction to best suit your solution's needs.

This conceptual guide describes key concepts, differences between autonomous and conversational agent workflows, differences between agent workflows and nonagent workflows, agent structure, other example scenarios, and basic billing information.

## Key concepts

The following table provides basic introductions to key concepts:

| Concept | Description |
|---------|-------------|
| **Agent** | A prebuilt action that uses a structured iterative process to solve complex, multi-step problems. The agent accomplishes this goal by iteratively following these steps: <br><br>1. **Think**: Collect, process, and analyze available information and inputs, such as text, images, audio, sensor data, and so on, from specific data sources. Apply reason, logic, or learning models to understand requests, create plans or solutions, and choose the best action to answer or fulfill requests with help from generative AI models. <br><br>2. **Act**: Based on the choices made and available tools, complete tasks in the digital or real world. <br><br>3. **Learn** (Optional): Adapt its own behavior over time by using feedback or other information. <br><br>An agent can accept instructions, work with services, systems, apps, and data by invoking tools that you create with prebuilt actions in Azure Logic Apps, and respond with the results. An agent can process information, make choices, and complete tasks by using a deployed model, for example, in Azure OpenAI Service. <br><br>**Note**: An agent workflow can include multiple agents in a sequence. You can't add an agent inline as a tool in another agent. <br><br>For more information, see [What is an AI agent](/azure/ai-services/agents/overview#what-is-an-ai-agent)? |
| **Large language model (LLM)** | A program trained to recognize patterns and perform jobs without human intervention. <br><br>For more information, see [What are large language models](https://azure.microsoft.com/resources/cloud-computing-dictionary/what-are-large-language-models-llms)? |
| **Tool** | A tool contains one or more actions that perform a task for an agent. For example, a tool can send email, work with data sources, perform calculations or conversions, interact with APIs, and so on. For example, see [Create tool to get the weather](create-autonomous-agent-workflows.md#create-tool-weather). |
| **Agent parameter** | A parameter that you create on a tool or in an action parameter, based on the use case for the agent parameter. You create agent parameters so the agent can pass model-only outputs as parameter inputs for an action in a tool. You don't need agent parameters for values from non-model sources. <br><br>Agent parameters differ from traditional parameters in the following ways: <br><br>- Agent parameters apply only to the tool where you define them. This restriction means you can't share agent parameters with other tools. In comparison, you can share traditional parameters globally with operations and control flow structures in a workflow. <br><br>- Agent parameters don't have resolved values when the workflow starts to run. An agent parameter receives a value only if the agent invokes the tool by using specific arguments. These arguments become the agent parameters for invoking the tool. <br><br>- An agent can invoke the same tool multiple times with different agent parameter values, even when that tool exists in the same loop iteration. For example, a tool can check the weather in both Seattle and London. <br><br>For more information, see [Create agent parameters for 'Get forecast' action](create-autonomous-agent-workflows.md#create-agent-parameters-get-weather). |
| **Context** | An agent maintains a log history by keeping a maximum number of tokens or messages as context and passing that context into the model for the next interaction. Each model has different *context length* limits. |

## Autonomous versus conversational agent workflows

To help you better understand how these agent workflow types differ, the following sections describe and show examples for each agent workflow type. Both workflow types use an agent and tools to get the current weather and send that information in email. All agents have an information pane where you set up the agent with the model you want and provide instructions about the agent's roles, its functions, and the way to respond.

### Autonomous agent workflow

The following high-level steps describe the behavior for a basic autonomous agent workflow:

1. The workflow starts with any available supported trigger.

   Optionally, zero or more actions might run between the trigger and the agent.

1. The agent accepts system instructions and nonhuman prompts or inputs, for example, outputs from the trigger or a preceding action.

1. The agent uses the [deployed model in Azure OpenAI Service](/azure/ai-services/openai/concepts/models) or the [deployed model in an Azure AI Foundry project](/azure/ai-foundry/foundry-models/concepts/models) to interpret and understand the instructions and request. The agent also uses the model to process and analyze the provided inputs.

1. Based on the agent instructions, the model helps plan which tools that the agent needs to invoke to perform the necessary tasks.

1. The agent returns the tool results and responds to the workflow caller or the specified recipient.

The following screenshot shows a basic example autonomous agent workflow:

:::image type="content" source="media/agents-workflows-concepts/weather-example-autonomous.png" alt-text="Screenshot shows Azure portal, Standard workflow designer, and example basic autonomous agent workflow." lightbox="media/agents-workflows-concepts/weather-example-autonomous.png":::

### Conversational agent workflow

The following high-level steps describe the behavior for a basic conversational workflow:

1. The workflow always starts with the trigger named **When a chat session starts**.

   Optionally, zero or more actions might run between the trigger and the agent.

1. The agent accepts system instructions and human-provided prompts or inputs through the integrated chat interface, for example, **What is the weather in Seattle**?

1. The agent uses the [deployed model in Azure OpenAI Service](/azure/ai-services/openai/concepts/models) to interpret and understand the instructions and request. The agent also uses the model to process and analyze the provided inputs.

1. Based on the agent instructions, the model helps plan which tools that the agent invokes for the necessary tasks.

1. The agent returns the tool results and responds through the chat interface to the human prompter.

The following screenshot shows a basic example conversational agent workflow:

:::image type="content" source="media/agents-workflows-concepts/weather-example-conversational.png" alt-text="Screenshot shows Azure portal, Standard workflow designer, and example basic conversational agent workflow." lightbox="media/agents-workflows-concepts/weather-example-conversational.png":::

The following screenshot shows the integrated chat interface that you can access from the designer toolbar or the workflow sidebar menu under **Tools**:

:::image type="content" source="media/agents-workflows-concepts/conversational-agent-chat.png" alt-text="Screenshot shows Azure portal and workflow integrated chat interface." lightbox="media/agents-workflows-concepts/conversational-agent-chat.png":::

## Agent versus nonagent workflows

Workflows that use agents can evolve beyond the limits imposed on nonagent workflows. Agent workflows can adapt to environments where unexpected events happen, choose which tools to use based on prompts, inputs, and available data, continuously improve their performance, handle unstructured data, support complex scenarios, and provide a higher level of adaptability and flexibility. Nonagent workflows function best in stable environments, follow predefined rules, and perform tasks that are static, predictable, and repetitive.

The following table provides more comparisons between agent workflows and nonagent workflows:

| Aspect | Agent | Nonagent |
|--------|-------|-----------|
| **Logic** | Make informed choices about the tasks to perform, based on inputs and other available information, and take actions. | Follow predefined rules and fixed sequences. |
| **Task management** | Treat tasks as separate entities  | Not applicable |
| **Data structure** | Handle and process unstructured data. | Handle and process structured data with predictable patterns. |
| **Adaptability** | Detect and respond to changing conditions and environments, make decisions, and adapt to new, real-time inputs. | Might struggle with environments that experience unexpected or dynamic changes. |

## Explore agent workflow structure

To build a new agent workflow in single-tenant Azure Logic Apps for your AI automation and integration solutions, you create a Standard logic app resource and add a workflow that has one of the following workflow types:

- **Autonomous Agents**
- **Conversational Agents**

These workflow types include all the capabilities in Standard stateful workflows plus agent capabilities and are specifically designed to work with agents. These workflow types automatically include an empty agent.

For example, the following screenshot shows a new autonomous agent workflow:

:::image type="content" source="media/agents-workflows-concepts/autonomous-agent-workflow-start.png" alt-text="Screenshot shows Azure portal, Standard workflow designer, and initial autonomous agent workflow structure." lightbox="media/agents-workflows-concepts/autonomous-agent-workflow-start.png":::

The following screenshot shows a new conversational agent workflow:

:::image type="content" source="media/agents-workflows-concepts/conversational-agent-workflow-start.png" alt-text="Screenshot shows Azure portal, Standard workflow designer, and initial conversational agent workflow structure." lightbox="media/agents-workflows-concepts/conversational-agent-workflow-start.png":::

If you have an existing **Stateful** workflow, the following screenshot shows how you can add an **Agent** action to include autonomous agent and LLM capabilities:

:::image type="content" source="media/agents-workflows-concepts/add-agent.png" alt-text="Screenshot shows Azure portal, Standard workflow designer, existing workflow, and option to add an agent." lightbox="media/agents-workflows-concepts/add-agent.png":::

The following screenshot shows the agent's connection pane where you specify information about the deployed model that you want to use:

:::image type="content" source="media/agents-workflows-concepts/agent-connection-pane.png" alt-text="Screenshot shows Standard workflow designer, empty agent action, and agent connection pane." lightbox="media/agents-workflows-concepts/agent-connection-pane.png":::

> [!NOTE]
>
> The connection pane shows the different connection requirements, 
> based on your workflow type and the selected model source.

After you create a connection to the model, the agent requires that you provide instructions that describe the roles that the agent can play, tasks that the agent can perform, and other specific prescriptive information that helps the agent respond to prompts, answer questions, and perform requested tasks, for example:

:::image type="content" source="media/agents-workflows-concepts/agent-information-pane.png" alt-text="Screenshot shows Standard workflow designer, empty agent action, and agent information pane." lightbox="media/agents-workflows-concepts/agent-information-pane.png":::

An empty agent connected to a model can respond to prompts that only use the model's capabilities, so an agent doesn't have to include tools. However, for the agent to use actions available in Azure Logic Apps, the agent needs you to create tools. You can start creating a tool by first adding an action from the connectors gallery.

The following diagram shows the gallery where you can browse and select actions to build tools:

:::image type="content" source="media/agents-workflows-concepts/connectors-gallery.png" alt-text="Screenshot shows Standard workflow designer, empty agent, and selected action to start creating a tool." lightbox="media/agents-workflows-concepts/connectors-gallery.png":::

The following diagram shows a weather agent that can get the weather forecast and send that forecast in email:

:::image type="content" source="media/agents-workflows-concepts/agent-tools.png" alt-text="Screenshot shows Azure portal, Standard workflow designer, and example agent with tools structure." lightbox="media/agents-workflows-concepts/agent-tools.png":::

## Other example scenarios

The following section describes a few more ways that an agent can complete tasks in a workflow:

### Mortgage loan agent

Imagine that your bank uses a mortgage loan agent that processes loans autonomously or with human intervention when necessary by performing the following tasks in a single orchestrated loop:

- Converse with customers to answer questions.
- Review loan applications.
- Collect financial information to assess loan eligibility.
- Retrieve and analyze risk data.
- Request and summarize real estate appraisals when submitted.
- Include human reviewers for edge cases.
- Approve or decline applications.
- Communicate decisions to relevant parties.

### Order fulfillment agent

Suppose your business uses an order fulfillment agent to perform the following tasks:

- Engage with customers to answer product questions, based on enterprise knowledge.
- Create orders but pass them on to humans when necessary.
- Provide 24/7 support with intelligent escalation.

You can also have an agent that orchestrates work across other agents. For example, you might have a team of agents, such as a writer, reviewer, and publisher, that work together to create and distribute sales reports.

### Facilities work order agent

To support an internal facilities team, a work order agent performs the following tasks:

- Converse with employees and provide options for service requests.
- Open work orders based on employee selections.
- Send work orders to the corresponding service teams.
- Update work orders with jobs progress and status.
- Close work orders when jobs are complete.
- Notify the appropriate parties about completed jobs.

## Billing

Although agent workflows don't incur extra charges in Azure Logic Apps, model usage in Azure OpenAI Service and Azure AI Foundry projects incur charges. For more information, see the following pages:

- [Azure OpenAI Service pricing](https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/#pricing)
- [Azure AI Foundry pricing](https://azure.microsoft.com/pricing/details/ai-foundry/)

## Related content

- [Create autonomous agent workflows in Azure Logic Apps](/azure/logic-apps/create-autonomous-agent-workflows)
- [Create conversational agent workflows in Azure Logic Apps](/azure/logic-apps/create-conversational-agent-workflows)
- [Labs: Overview for building agentic workflows with Azure Logic Apps](https://azure.github.io/logicapps-labs/docs/logicapps-ai-course/overview)
