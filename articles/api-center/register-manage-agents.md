---
title: Register and Manage Agents in Azure API Center
description: Learn how to register AI agents in Azure API Center to create a centralized agents registry for your organization.   

ms.service: azure-api-center
ms.topic: how-to
ms.date: 06/02/2026
ms.update-cycle: 180-days
ms.collection: ce-skilling-ai-copilot
---

# Register and manage agents in Azure API Center

This article shows you how to register AI agents, including [A2A agents](https://a2a-protocol.org/latest/specification/), in API Center, make them discoverable to users, and update and manage them. 

## Prerequisites

- An Azure API Center instance 
- An agent described by an agent card in JSON format or an agent definition in Markdown format
- Appropriate permissions to edit APIs in your API Center

## Register agent

1. Sign in to the [Azure portal](https://portal.azure.com), and go to your API center.

1. In the sidebar menu, under **Inventory**, select **Assets**.

1. Select **+ Register an asset** > **Agent**.

    :::image type="content" source="media/register-manage-agents/register-agent.png" alt-text="Screenshot of registering an agent in the portal."::: 

1. In the **Register an agent** form, enter the information described in the following table:

    | Field | Description |
    |-------|-------------|
    | **Title** | Enter a descriptive name for the agent, such as *Help Desk Agent*. |
    | **Identification** | API Center automatically generates an identifier based on the title, such as *help-desk-agent*. You can edit this identifier if needed. |
    | **Short summary** | Enter a brief one-line description of what the agent does that appears in the API Center portal and other locations. |
    | **Description** | Optionally enter a more detailed description of the skill's capabilities, use cases, and behavior. |
    | **Version** | |
    | **Version title** | Enter a version title of your choice, such as *v1*.|
    | **Version identification** | API Center automatically generates an identifier based on the version title. You can edit this identifier if needed. |
    | **Version lifecycle** | Select the current stage of the agent version's lifecycle from the dropdown menu. Learn more about [versions in API Center](key-concepts.md#api-version). |
    | **Agent details** |  |
    | **Agent definition** | Enter a URL or **Select a file** to upload an agent definition. The agent definition should be in Markdown format and include details about the agent's capabilities, skills, and other relevant information. |
    | **Protocol** | If applicable, select the **A2A** protocol if the agent adheres to it. |
    | **Agent card** | Optionally enter a URL or **Select a file** to upload an A2A agent card in JSON format. |

    :::image type="content" source="media/register-manage-agents/agent-registration-details.png" alt-text="Screenshot of the Register an agent pane in the Azure portal.":::

1. Select **Create** to add the agent.

After registration, the agent appears in your inventory on the **Inventory** > **Assets** page.

## Update a registered agent

You can update agent information at any time.

1. In the [Azure portal](https://azure.microsoft.com), go to your API center.
1. In the sidebar menu, under **Inventory**, select **Assets**.
1. From the table, select the agent name in the **Title** column.
1. Select the **Edit** button to open the **Edit** page in the working pane.
1. Make your changes and select **Save**.

## Synchronize agents from API sources

To automate agent registration and keep your inventory up to date, you can integrate the following upstream sources with your API center:

- **Azure API Management**: If you manage A2A agents in Azure API Management, you can enable automatic synchronization to keep your API center up to date. To learn more, see [Synchronize APIs from Azure API Management instance](synchronize-api-management-apis.md).

- **Git repository**: For A2A agents and other AI assets stored in a Git repository, you can enable automatic synchronization to keep your API center up to date. For more information, see [Synchronize API assets from a Git repo](synchronize-assets-git.md).

## Discover agents in the API Center portal

Set up your [API Center portal](set-up-api-center-portal.md) so that developers and other stakeholders in your organization can discover agents in your API inventory. From the API Center portal, users can:

* Browse and filter agents in the inventory.
* View detailed information about each agent.

[!INCLUDE [assess-ai-assets](includes/assess-ai-assets.md)]

## Related content

* [Synchronize API assets from a Git repo](synchronize-assets-git.md)
* [Register and discover MCP servers in your API inventory](register-discover-mcp-server.md)
* [Set up your API Center portal](set-up-api-center-portal.md)
* [Key concepts in Azure API Center](key-concepts.md)