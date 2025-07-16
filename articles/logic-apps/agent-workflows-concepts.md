---
title: Workflows with AI Agents and Models
description: Learn how workflows benefit from using AI agents with models in Azure OpenAI Service to complete tasks in single-tenant Azure Logic Apps.
author: ecfan
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, divswa, karansin, krmitta, kewear, azla
ms.topic: conceptual
ms.collection: ce-skilling-ai-copilot
ms.date: 05/21/2025
ms.update-cycle: 180-days
# Customer intent: As an integration solution developer, I want to learn about the benefits and support that Azure Logic Apps provides to build flexible, adaptable, and responsive workflows that complete tasks using AI agents, models, and other AI capabilities for my integration and automation scenarios.
ms.custom:
  - build-2025
---

# Workflows with AI agents and models in Azure Logic Apps (Preview)

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

> [!IMPORTANT]
>
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure Logic Apps supports workflows that complete tasks by using *agents* with *large language models* (LLMs) in Azure OpenAI Service. An agent uses an iterative looped process to solve complex, multi-step problems. A large language model is a program that's trained to recognize patterns and perform jobs without human interaction, for example:

- Analyze, interpret, and reason about information such as instructions, prompts, inputs, and other data.
- Make decisions, based on results and available data.
- Formulate and return answers back to the prompter, based on the agent's instructions.

You can build workflows that use autonomous or conversational agents. The agent uses natural language to communicate with you and the connected model. The agent also uses model-generated outputs to do work - with or without human interaction. The model helps the agent provide the following capabilities:

- Accept information about what the agent does, how to operate, and how to respond.
- Receive and respond to requests (prompts) autonomously or through chat.
- Process inputs, analyze data, and make choices, based on available information.
- Choose tools to complete the tasks necessary to fulfill requests. Basically, a *tool* is a sequence with one or more actions that complete a task. A tool can use only actions, not triggers.
- Adapt to environments that require flexibility and are fluid, dynamic, unpredictable, or unstable.

With [1,400+ connectors](/connectors/connector-reference/connector-reference-logicapps-connectors) that you can use to build tools in an agent, agent workflows support a vast range of scenarios that can greatly benefit from agent and model capabilities. Based on your use cases, the agent can perform work with or without human interaction.

The following diagram shows an example agent workflow that you create in the how-to guide [Create AI agent workflows with Azure Logic Apps](/azure/logic-apps/create-agent-workflows). The workflow uses an agent to get the weather forecast and send that forecast in email. The diagram shows the agent information pane where you set up the agent and provide instructions about what the agent does:

:::image type="content" source="media/agents-workflows-concepts/weather-example.png" alt-text="Screenshot shows Azure portal, Standard workflow designer, and example agent workflow structure." lightbox="media/agents-workflows-concepts/weather-example.png":::

These high-level steps describe how the agent works:

1. The agent accepts the provided instructions, prompts, and inputs, such as location or email address.

1. To understand a prompt (request) and the necessary task to complete for that prompt, the agent uses a [deployed model in Azure OpenAI Service](/azure/ai-services/openai/concepts/models) to process, analyze, and interpret the provided information.

1. Based on the agent instructions, the model helps plan which tools that the agent invokes for the necessary tasks.

1. The agent returns the tool results and responds to the prompter.

This conceptual guide describes key concepts, differences between agent and non-agent workflows, agent structure, other example scenarios, and basic billing information.

For more information, see the following documentation:

- [What is Azure OpenAI Service?](/azure/ai-services/openai/overview)
- [What is an AI agent?](/azure/ai-services/agents/overview#what-is-an-ai-agent)
- [Azure OpenAI Service models](/azure/ai-services/openai/concepts/models)

## Key concepts

The following table provides basic introductions to key concepts:

| Concept | Description |
|---------|-------------|
| **Agent** | A prebuilt action that uses a structured iterative process to solve complex, multi-step problems. This agent can interact with humans by using a chat interface and work with services, systems, apps, and data by invoking tools that you create with prebuilt actions in Azure Logic Apps. An agent can process information, make choices, and complete tasks by using a deployed model in Azure OpenAI Service. <br><br>**Note**: An agent workflow can include multiple agents in a sequence. You can't add an agent inline as a tool in another agent. However, an agent can use another agent by meeting the following requirements: <br><br>- The secondary agent exists in another agent workflow within the same Standard logic app. <br><br>- The secondary agent workflow must start with a trigger that creates a callable endpoint, such as a [**Request** trigger](/azure/connectors/connectors-native-reqres). <br><br>- The "parent" agent must have a tool that runs the action named **Call workflow in this logic app**. You can use this action to run the secondary agent workflow. <br><br>For more information, see [What is an AI agent?](/azure/ai-services/agents/overview#what-is-an-ai-agent) |
| **Large language model (LLM)** | A program that is trained to recognize patterns and perform jobs without human intervention. <br><br> For more information, see [Azure OpenAI Service models](/azure/ai-services/openai/concepts/models). |
| **Agentic loop** | Another name for an agent that uses a structured iterative process to solve complex, multi-step problems. The agent accomplishes this goal by iteratively following these steps: <br><br>1. **Think**: Collect, process, and analyze available information and inputs, such as text, images, audio, sensor data, and so on, from specific data sources. Apply reason, logic, or learning models to understand requests, create plans or solutions, and choose the best action to answer or fulfill requests with help from generative AI models. <br><br>2. **Act**: Based on the choices made and available tools, complete tasks in the digital or real world. <br><br>3. **Learn** (Optional): Adapt its own behavior over time by using feedback or other information. |
| **Tool** | A tool contains one or more actions that perform a task for an agent. For example, a tool can send email, work with data sources, perform calculations or conversions, interact with APIs, and so on. <br><br>For more information, see the following documentation: <br><br>- [Limitations and known issues](create-agent-workflows.md#limitations-and-known-issues) <br>- [Create a tool to get weather forecast](create-agent-workflows.md#create-a-tool-to-get-weather-forecast) |
| **Agent parameter** | A parameter that you create on a tool or in an action parameter, based on the use case for the agent parameter. You create agent parameters so the agent can pass model-only outputs as parameter inputs for an action in a tool. You don't need agent parameters for values from non-model sources. For more information, see [Create agent parameters](create-agent-workflows.md#create-agent-parameters-for-the-get-forecast-action). <br><br>Agent parameters differ from traditional parameters in the following ways: <br><br>- Agent parameters apply only to the tool where you define them. This restriction means you can't share agent parameters with other tools. In comparison, you can share traditional parameters globally with operations and control flow structures in a workflow. <br><br>- Agent parameters don't have resolved values when the workflow starts to run. An agent parameter receives a value only if the agent invokes the tool by using specific arguments. These arguments become the agent parameters for invoking the tool. <br><br>- An agent can invoke the same tool multiple times with different agent parameter values, even when that tool exists in the same loop iteration. For example, a tool can check the weather in both Seattle and London. |
| **Channels** | The input and output channels in the agent's chat interface. An agent has a **Channels** tab that controls whether you can exchange messages with the agent in the chat interface. <br><br>For more information, see the following documentation: <br><br>- [Limitations for agent chat interface - Channels tab](create-agent-workflows.md#limitations-and-known-issues) <br>- [Set up chat interactions for the agent](create-agent-workflows.md#set-up-chat-interactions-for-the-agent) |
| **Context** | An agent maintains chat history by keeping a maximum number of tokens or messages as context and passing that context into the model for the next chat interaction. Each model has different *context length* limits. For more information, see [Limitations for chat history context length (token limit)](create-agent-workflows.md#limitations-and-known-issues). |

## Differences between agent and non-agent workflows

Workflows that use agents can evolve beyond the limits imposed on non-agent workflows. Agent workflows can adapt to environments where unexpected events happen, choose which tools to use based on prompts, inputs, and available data, continuously improve their performance, handle unstructured data, support complex scenarios, and provide a higher level of adaptability and flexibility. Non-agent workflows function best in stable environments, follow predefined rules, and perform tasks that are static, predictable, and repetitive.

The following table provides more comparisons between agent workflows and non-agent workflows:

| Aspect | Agent | Non-agent |
|--------|-------|-----------|
| **Logic** | Make informed choices about the tasks to perform, based on inputs and other available information, and take actions. | Follow predefined rules and fixed sequences. |
| **Task management** | Treat tasks as separate entities  | Not applicable |
| **Data structure** | Handle and process unstructured data. | Handle and process structured data with predictable patterns. |
| **Adaptability** | Detect and respond to changing conditions and environments, make decisions, and adapt to new, real-time inputs. | Might struggle with environments that experience unexpected or dynamic changes. |

## Explore agent workflow structure

To build an agent workflow in single-tenant Azure Logic Apps for your automation and integration solutions, create a Standard workflow and select the **Agent** type. This workflow type includes all the capabilities in Standard stateful workflows plus agent capabilities and is specifically designed to work with agents. The workflow automatically includes an empty default agent.

:::image type="content" source="media/agents-workflows-concepts/agent-workflow-start.png" alt-text="Screenshot shows Azure portal, Standard workflow designer, and initial agent workflow structure." lightbox="media/agents-workflows-concepts/agent-workflow-start.png":::

In the workflow designer, the agent has information pane where you create a connection between your workflow and the deployed model in an Azure OpenAI resource. In the same interface, the agent also requires that you provide instructions that describe the roles that the agent can play, tasks that the agent can perform, and other specific prescriptive information that helps the agent respond to prompts, answer questions, and perform requested tasks:

:::image type="content" source="media/agents-workflows-concepts/agent-information-pane.png" alt-text="Screenshot shows Standard workflow designer, empty Default Agent, and agent information pane." lightbox="media/agents-workflows-concepts/agent-information-pane.png":::

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

Although agent workflows don't incur extra charges in Azure Logic Apps, model usage in Azure OpenAI Service incurs charges. For more information, see [Azure OpenAI Service pricing](https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/#pricing).

## Next steps

In this overview, you learned about the benefits that agent workflows provide and how they differ from non-agent workflows. To get started creating an agent workflow, see the following how-to guide:

> [!div class="nextstepaction"]
> [Create agent workflows in Azure Logic Apps](/azure/logic-apps/create-agent-workflows)
