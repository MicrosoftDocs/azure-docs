---
title: Register and Manage Agents in Azure API Center
description: "Learn how to update agent metadata, add skills, configure capabilities, and manage provider information for A2A agents."
author: ProfessorKendrick
ms.author: kkendrick
ms.service: azure-api-center
ms.topic: how-to
ms.date: 11/11/2025
ms.update-cycle: 180-days
ms.collection: ce-skilling-ai-copilot
---

# Register and manage agents in Azure API Center

This article shows you how to register A2A agents in API Center, and how to update and manage them after registration. You can add skills, configure capabilities, and update provider information.

## Prerequisites

- An Azure API Center instance 
- An A2A agent described by an agent card
- Appropriate permissions to edit APIs in your API Center

## Register agent

Enter required values from the agent's agent card. Optionally add skills and other metadata that define the capabilities and actions your A2A agent can perform.

> [!TIP]
> For detailed skill schema information, see the [Agent2Agent (A2A) Protocol Official Specification](https://a2a-protocol.org/latest/specification/).

1. Sign in to the [Azure portal](https://portal.azure.com), then navigate to your API center.

1. In the sidebar menu, under **Assets**, select **APIs** > **+ Register an API**.

1. In the **Register an API** page, fill in the [standard properties](tutorials/register-apis.md) to register an API and choose **A2A** as the agent type.

    - The form updates to display other fields specific to the **A2A** API type.

1. In the **Agent Card** section, enter the following details:

    |Field                |Description                                                |
    |---------------------|-----------------------------------------------------------|
    |Protocol Version     |The version of the A2A protocol this agent supports.       |
    |Agent URL            |The preferred endpoint URL for interacting with the agent. |
    |Preferred Transport  |The transport protocol for the preferred endpoint.         |
    |Agent Version        |The agent's own version number.                            |

1. Locate the **Agent Skills** section.

1. Select **+ Add**.

1. On the **Agent Skills** page, define the skill by providing information for the required fields.

1. Select **Add** to add the skill.

1. In the **Agent Provider** section, enter the following details:

    |Field                 |Description                                                              |
    |----------------------|-------------------------------------------------------------------------|
    |Organization name     |The name of the agent provider's organization                            |
    |Organization URL      |A URL for the agent provider's website or relevant documentation         |

1. Enable or disable the **Agent Capabilities** as needed:

    |Field                    |Description                                                                             |
    |-------------------------|----------------------------------------------------------------------------------------|
    |Streaming Support        |Indicates if the agent supports Server-Sent Events (SSE) for streaming responses        |
    |Push Notifications       |Indicates if the agent supports sending push notifications for asynchronous task updates|
    |State Transition History | Indicates if the agent provides a history of state transitions for a task              |

1. Select **Create** to register the API.

## Update agent

1. In the [Azure portal](https://azure.microsoft.com), go to your API center.
1. In the sidebar menu, under **Assets**, select **APIs**.
1. From the table, select your A2A agent by selecting the agent name in the **Title** column.
1. Select the **Edit** button to open the **Edit** page in the working pane.

    :::image type="content" source="media/register-manage-agents/edit-agent.png" alt-text="Screenshot of the AI agent overview in Azure portal with the edit button highlighted.":::

### Add skills to your agent

Skills define the capabilities and actions your A2A agent can perform.

> [!TIP]
> For detailed skill schema information, see the [Agent2Agent (A2A) Protocol Official Specification](https://a2a-protocol.org/latest/specification/).

1. On the **Edit** page, locate the **Agent Skills** section.
1. Select **+ Add**.
1. On the **Agent Skills** page, define the skill by providing information for the required fields.
1. Select **Add** to add the skill.

### Add provider information

Provider information helps other teams identify who maintains the agent.

1. On the agent **Edit** page, locate the **Agent Provider** section.
1. Enter the following details:

    |Field                 |Description                                                              |
    |----------------------|-------------------------------------------------------------------------|
    |Organization name     |The name of the agent provider's organization                            |
    |Organization URL      |A URL for the agent provider's website or relevant documentation         |

1. Select **Save**.

### Configure agent capabilities

Agent capabilities describe what features your A2A agent supports.

1. On the **Edit** page, locate the **Agent Capabilities** section.
1. Enable or disable the following capabilities as needed:

    |Field                    |Description                                                                             |
    |-------------------------|----------------------------------------------------------------------------------------|
    |Streaming Support        |Indicates if the agent supports Server-Sent Events (SSE) for streaming responses        |
    |Push Notifications       |Indicates if the agent supports sending push notifications for asynchronous task updates|
    |State Transition History | Indicates if the agent provides a history of state transitions for a task              |

1. Select **Save**.

## Limitations

Agent-to-Agent APIs in API Management don't synchronize with API Center.

## Related content

[Agent registry in Azure API Center](agent-to-agent-overview.md)