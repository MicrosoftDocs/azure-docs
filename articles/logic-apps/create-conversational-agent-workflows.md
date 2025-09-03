---
title: Create Workflows with Conversational AI Agents
description: Build AI agent workflows that use human interactions to complete tasks with Azure Logic Apps.
service: ecfan
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, divswa, krmitta, azla
ms.topic: how-to
ms.collection: ce-skilling-ai-copilot
ms.date: 09/08/2025
ms.update-cycle: 180-days
# Customer intent: As an integration developer, I want to build workflows that complete tasks by using AI agents, other AI capabilities, and human interactions for my integration solutions with Azure Logic Apps.
---

# Create conversational agent workflows with human interactions to complete tasks with Azure Logic Apps (Preview)

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

> [!IMPORTANT]
>
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

When your scenario requires workflows that use agents and human interactions to complete tasks, you can create a *conversational* agent workflow in Azure Logic Apps. All agent workflows perform tasks by using an agent connected to a large language models (LLM). The agent uses an iterative looped process to solve complex, multi-step problems. A large language model is a program that's trained to recognize patterns and perform jobs without human interaction.

In conversational agent workflows, an agent provides the following capabilities and benefits when connected to a model:

- Accepts instructions about the agent's role, how to operate, and how to respond.
- Receives and responds to requests (prompts) through human interactions or intervention.
- Processes inputs, analyze data, and make choices, based on available information.
- Chooses tools to complete the tasks necessary to fulfill requests. A *tool* is a sequence with one or more actions that complete a task.
- Adapts to environments that require flexibility and are fluid, dynamic, unpredictable, or unstable.

With [1,400+ connectors](/connectors/connector-reference/connector-reference-logicapps-connectors) that provide actions that you can use to create tools for an agent to use, conversational agent workflows support a vast range of scenarios that can greatly benefit from AI capabilities.

The following screenshot shows an example conversational agent workflow that you create in this guide. The workflow uses an agent to get the weather forecast and send that forecast in email. The diagram shows the agent information pane where you set up the agent and provide instructions through a chat interface for the agent to follow:

For the high-level steps that describe how the agent works and more overview information about agent workflows, see [AI agent workflows in Azure Logic Apps](/azure/logic-apps/agent-workflows-concepts).

This guide shows how to create an example Standard logic app workflow with the **Conversational Agents** type, which works through human-provided interactions or inputs. To fulfill requests, the agent uses tools that you create to complete the necessary tasks.

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A new or existing Standard logic app resource or project. You can work in either development environment:

  - Azure portal: A Standard logic app resource.

    If you don't have this resource, see [Create an example Standard workflow in the Azure portal](/azure/logic-apps/create-single-tenant-workflows-azure-portal).

  - Visual Studio Code: A Standard logic app project.

    Make sure that you have the latest **Azure Logic Apps (Standard) extension for Visual Studio Code**. If you don't have this project, see [Create Standard workflows in Visual Studio Code](/azure/logic-apps/create-standard-workflows-visual-studio-code).

  The examples in this guide use the Azure portal. However, after you open the workflow designer, the steps to use the designer are mostly similar between the portal and Visual Studio Code. Some interactions have minor differences.

- For your model source, you need one of the following sources:

  | Model source | Description |
  |--------------|-------------|
  | [Azure OpenAI Service resource](/azure/ai-services/openai/overview) with a deployed [Azure OpenAI Service model](/azure/ai-services/openai/concepts/models) | You need the resource name when you create a connection to your deployed model in Azure OpenAI Service from an agent in your workflow. If you don't have this resource and model, see the following articles: <br><br>- [Create and deploy an Azure OpenAI Service resource](/azure/ai-services/openai/how-to/create-resource?pivots=web-portal) <br><br>- [Deploy a model](/azure/ai-services/openai/how-to/create-resource?pivots=web-portal#deploy-a-model) <br><br>Agent workflows support only specific models. For more information, see [Supported models](#supported-models-for-agent-workflows). |
  | [Azure OpenAI resource](/azure/ai-services/openai/overview) connected to an [Azure AI Foundry project](/azure/ai-foundry/what-is-azure-ai-foundry) and a deployed [Azure OpenAI model in Azure AI Foundry](/azure/ai-foundry/openai/concepts/models) | Make sure that you have a Foundry project, not a Hub based project. If you don't have this project, resource, and model, see the following articles: <br><br>- [Create and deploy an Azure OpenAI Service resource](/azure/ai-services/openai/how-to/create-resource?pivots=web-portal)<br><br>- [Create a project for Azure AI Foundry](/azure/ai-foundry/how-to/create-projects?tabs=ai-foundry) <br><br>- [Connect Azure AI services after you create a project](/azure/ai-services/connect-services-ai-foundry-portal#connect-azure-ai-services-after-you-create-a-project) or [Create a new connection in Azure AI Foundry portal](/azure/ai-foundry/how-to/connections-add?tabs=aoai%2Cblob%2Cserp&pivots=fdp-project#create-a-new-connection) <br><br>- [Deploy a model](/azure/ai-services/openai/how-to/create-resource?pivots=web-portal#deploy-a-model) <br><br>Agent workflows support only specific models. For more information, see [Supported models](#supported-models-for-agent-workflows). |

  > [!IMPORTANT]
  >
  > Although agent workflows don't incur extra charges in Azure Logic Apps, 
  > model usage incurs charges. For more information, see the Azure 
  > [Pricing calculator](https://azure.microsoft.com/pricing/calculator/).

- The authentication to use when you create a new connection between an agent and your deployed model.

  > [!NOTE]
  >
  > For Azure AI Foundry projects, you must use managed identity authentication.

  - Managed identity authentication

    This connection supports authentication by using Microsoft Entra ID with a [managed identity](/entra/identity/managed-identities-azure-resources/overview). In production scenarios, Microsoft strongly recommends that you use a managed identity when possible because this option provides optimal and superior security at no extra cost. Azure manages this identity for you, so you don't have to provide or manage sensitive information such as credentials or secrets. This information isn't even accessible to individual users. You can use managed identities to authenticate access for any resource that supports Microsoft Entra authentication.

    To use managed identity authentication, your Standard logic app resource must enable the system-assigned managed identity. By default, the system-assigned managed identity is enabled on a Standard logic app. This release currently doesn't support using the user-assigned managed identity.

    > [!NOTE]
    >
    > If the system-assigned identity is disabled, [reenable the identity](/azure/logic-apps/authenticate-with-managed-identity?tabs=standard#enable-system-assigned-identity-in-the-azure-portal). 

    The system-assigned identity requires one of the following roles for Microsoft Entra role-based access (RBAC), based on the [principle of least privilege](/entra/identity-platform/secure-least-privileged-access):

    | Model source | Role |
    |--------------|------|
    | Azure OpenAI Service resource | - **Cognitive Services OpenAI User** (least privileged) <br>- **Cognitive Services OpenAI Contributor** |
    | Azure AI Foundry project | **Azure AI User** |

    For more information about managed identity setup, see the following resources:

    - [Authenticate access and connections with managed identities in Azure Logic Apps](/azure/logic-apps/authenticate-with-managed-identity?tabs=standard)
    - [Role-based access control for Azure OpenAI Service](/azure/ai-services/openai/how-to/role-based-access-control)
    - [Role-based access control for Azure AI Foundry](/azure/ai-foundry/concepts/rbac-azure-ai-foundry)
    - [Best practices for Microsoft Entra roles](/entra/identity/role-based-access-control/best-practices)

  - URL and key-based authentication

    This connection supports authentication by using the endpoint URL and API key for your deployed model. However, you don't have to manually find these values before you create the connection. The values automatically appear when you select your model source.

    > [!IMPORTANT]
    >
    > Use this authentication option only for the examples in this guide, exploratory scenarios, 
    > non-production scenarios, or if your organization's policy specifies that you can't use 
    > managed identity authentication.
    >
    > In general, make sure that you secure and protect sensitive data and personal 
    > data, such as credentials, secrets, access keys, connection strings, certificates, 
    > thumbprints, and similar information with the highest available or supported level 
    > of security. Don't hardcode sensitive data, share with other users, or save in plain 
    > text anywhere that others can access. Set up a plan to rotate or revoke secrets in 
    > the case they become compromised. For more information, see the following resources:
    >
    > - [Best practices for protecting secrets](/azure/security/fundamentals/secrets-best-practices)
    > - [Secrets in Azure Key Vault](/azure/key-vault/secrets/) 
    > - [Automate secrets rotation in Azure Key Vault](/azure/key-vault/secrets/tutorial-rotation)

- To follow along with the examples, you need an email account to send email.

  The examples in this guide use an Outlook.com account. For your own scenarios, you can use any supported email service or messaging app in Azure Logic Apps, such as Office 365 Outlook, Microsoft Teams, Slack, and so on. The setup for other email services or apps are generally similar to the examples, but have minor differences.

## Supported models for agent workflows

The following list identifies the models that you can use for agent workflows:

- gpt-4.1
- gpt-4.1-mini
- gpt-4.1-nano
- gpt-4o
- gpt-4o-mini
- gpt-4
- gpt-35-turbo

## Limitations and known issues

The following table describes the current limitations and any known issues in this release.

| Limitation | Description |
|------------|-------------|
| Supported workflow types | To create an autonomous agent workflow, you must select the **Autonomous Agents** workflow type. You can't start with the **Stateful** or **Stateless** workflow type, and then add an agent. |
| Authentication | For managed identity authentication, you can use only the system-assigned managed identity at this time. Support is currently unavailable for the user-assigned managed identity. <br><br>**Note**: For Azure AI Foundry projects, you must use managed identity authentication. |
| Agent tools | - To create tools, you can use only actions, not triggers. <br><br>- A tool starts with action and always contains at least one action. <br><br>- A tool works only inside the agent where that tool exists. |
| General limits | For general information about the limits in Azure OpenAI Service, Azure AI Foundry, and Azure Logic Apps, see the following articles: <br><br>- [Azure OpenAI Service quotas and limits](/azure/ai-services/openai/quotas-limits) <br>- [Azure OpenAI in Azure AI Foundry Models quotas and limits](/azure/ai-foundry/openai/quotas-limits) <br>- [Azure Logic Apps limits and configuration](/azure/logic-apps/logic-apps-limits-and-config) |

## Create a conversational agent workflow

Follow these steps to create a partial workflow with an empty **Default Agent**.

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the logic app menu, under **Workflows**, select **Workflows**.

1. On the **Workflows** page toolbar, select **Add** > **Add**.

1. On the **Create workflow** pane, complete the following steps:

   1. For **Workflow name**, provide a name for your workflow to use.

   1. Select **Conversational Agents** > **Create**.

   :::image type="content" source="media/create-autonomous-agent-workflows/create-agent-workflow.png" alt-text="Screenshot shows Standard logic app resource with open Workflows page and Create workflow pane with workflow name, selected Agent option, and Create button." lightbox="media/create-autonomous-agent-workflows/create-agent-workflow.png":::

   The designer opens and shows a partial workflow, which includes an empty **Default Agent** that you need to set up when you're ready. Before you can save your workflow, you must complete the following setup tasks for the agent:

   - Create a connection to your deployed model. You complete this task in a later section.

   - Provide system instructions that describe the roles that the agent plays, the tasks that the agent can perform, and other information to help the agent better understand how to operate. You also complete this task in a later section.

   :::image type="content" source="media/create-autonomous-agent-workflows/agent-workflow-start.png" alt-text="Screenshot shows workflow designer with Add a trigger and empty Default Agent." lightbox="media/create-autonomous-agent-workflows/agent-workflow-start.png":::

1. Continue to the next section.




## Create a tool to provide subscriber list

Finally, for this example, create a tool named **Get subscribers** to provide a subscriber list for the agent parameter values to use. This tool uses the **Compose** action to supply the subscriber name, email address, and location. Or, you might source these inputs from blob storage or a database. Azure Logic Apps offers many options that you can use as data sources.

The following example shows how the **Get subscribers** tool might look:

:::image type="content" source="media/create-autonomous-agent-workflows/add-tool-get-subscribers.png" alt-text="Screenshot shows agent with new tool named Get subscribers that contains a Compose action with subscriber information." lightbox="media/create-autonomous-agent-workflows/add-tool-get-subscribers.png":::

Optionally, on the agent, you can provide *user instructions* that the agent can use as prompts or requests. 
For better results, make each user instruction focus on a specific task, for example:

1. On the agent information pane, in the **User instructions** section, select **Add new item**.

1. In the **User instructions Item - 1** box, enter the question to ask the agent.

1. To add another item, select **Add new item** again.

1. In the **User instructions item - 2** box, enter another question to ask the agent.

1. Repeat until you finish adding all the questions to ask the agent.

1. When you're done, test your workflow.
