---
title: Create MCP servers in API Center to automate tasks
description: Learn how to create a Model Context Protocol (MCP) server through API Center by building tools that large language models (LLMs) can use to automate tasks. To build tools, you can use connector actions available for Standard workflows in Azure Logic Apps.
services: logic-apps, azure-api-center
ms.suite: integration
ms.reviewers: estfan, azla
ms.topic: how-to
ms.collection: ce-skilling-ai-copilot
ms.date: 08/29/2025
ms.update-cycle: 180-days
#Customer intent: I want to create an MCP server that uses tools that I build by using connector actions that are available for Standard workflows in Azure Logic Apps.
---

# Build MCP servers through API Center to automate tasks with tools backed by Azure Logic Apps (Preview)

> [!NOTE]
>
> The following capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

To make a large language model (LLM) fulfill requests by running actions that work with external services, systems, apps, or data, you can create a *Model Context Protocol (MCP) server* that provides *tools* for your model to automate tasks. For example, these tools can read, update, or delete files, query databases, send emails, interact with APIs, perform computations, or even trigger workflows.

MCP is an open standard that lets AI components such as LLMs, agents, and MCP clients use tools to work with external services and systems in a secure, discoverable, and structured way. This standard defines how to describe, run, and authenticate access to tools so that AI components can interact with real-world services, systems, databases, APIs, and business workflows. An MCP server acts like a bridge between AI components and the tools that they can use.

In Azure API Center, you can create an MCP server with tools that are backed by the prebuilt connector actions available in Azure Logic Apps. Usually, you use these connector actions and triggers in Azure Logic Apps to create workflows for automation and integration solutions. With [over 1,400 connectors](/connectors/connector-reference/connector-reference-logicapps-connectors) that access and interact with a vast range of cloud services, on-premises systems, apps, and data, you can build diverse toolsets that specifically work with your enterprise resources and assets.

The following diagram shows how 

For more information, see the following articles:

- [MCP server concepts](https://modelcontextprotocol.io/docs/learn/server-concepts)
- [What is Azure API Center?](../api-center/overview.md)
- [What is Azure Logic Apps?](logic-apps-overview.md)
- [What are connectors in Azure Logic Apps](../connectors/introduction.md)

## Limitations and known issues

The following list describes restrictions or issues that exist in this release:

- You must start with an empty Standard logic app resource when you create your MCP server resource.
- Each tool can have only one action.

## Prerequisites

- An Azure account with an active subscription. If you don't have a subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

  Make sure to use the same Azure subscrition for the resources required in this scenario.

- An API center resource.

  For more information, see [Quickstart: Create your API center - portal](../api-center/set-up-api-center.md).

- An empty Standard logic app resource, which doesn't contain any workflows, for creating your MCP server.

  - This capability applies to Standard logic app resources that use any hosting option, such as the Workflow Service Plan.

  - The logic app resource must be running.

  For more information, see [Create an example Standard logic app using the Azure portal](create-single-tenant-workflows-azure-portal.md)

## Create an MCP server resource and tools

For example, suppose you want to create an MCP server with a tool that gets items from an RSS feed.

1. In the [Azure portal](https://portal.azure.com), open your API center resource.

1. On the resource sidebar, under **Discovery**, select **MCP**.

1. On the **MCP** page, find the **Azure Logic Apps** tile, and select **Register**.

1. On the **Model Context Protocol servers** page, follow these steps:

   1. Under **Resources**, from the **Logic app** list, select your empty Standard logic app resource.

   1. Under **Tools**, in the **Connectors** section, select **Add connector**.

   1. On the **Add connector** pane and the **Choose connector** tab, find and select the connector for the service, system, app, or data source for which you want to create a tool.

      You can select only one connector for each tool that you create.

   1. On the **Select actions** tab, select each action that you want to create as a tool. When you're done, select **Next**.

      You can select multiple actions, but you can create only one tool for each selected action.

   1. On the **Create connection** tab, provide any required connection information, and select **Create new**.

   1. When you're done, select **Save**, which returns you to the **Model Context Protocol servers** page.

   The **Connectors** section now shows your selected connector. The **Actions** section shows one or more actions that are now available as tools in your MCP server. By default, your LLM is the input source for any parameters in these actions. You can change this input source to user-provided, based on your scenario's needs.

   1. To describe the purpose for each action-backed tool and review the default input sources for any action parameters, select the action name or the edit (pencil) button.

   1. On the **Edit: <*task-name*>** pane, provide the following information:

      | Section | Description |
      |---------|-------------|
      | **Description** | Describe the purpose for the current task to help determine when to use the task. |
      | **Default parameters** | Lists any parameters required to perform the task. For each parameter, the input source options are **Model** and **User**. By default, your model provides the task inputs. If you select **User**, you get the appropriate UX to provide the inputs for the selected parameter. |
      | **Optional parameters** | Select any other parameters that you want to include for the current task. |

   1. When you're done, select **Save changes**.

1. After you're done, select **Register**.
