---
title: "Quickstart: Get started with agents and investigations in Microsoft Discovery Studio"
description: Create Microsoft Discovery agents and investigations to run your first AI-powered scientific research.
author: surajmb
ms.author: surmb
ms.service: azure
ms.topic: quickstart
ms.date: 03/17/2026
ms.custom:
  - template-quickstart

#customer intent: As a scientist or engineer, I want to set up Microsoft Discovery agents and investigations so that I can run AI-powered scientific research.

---

# Quickstart: Get started with agents and investigations in Microsoft Discovery Studio

In this quickstart, you will set up resources for your Microsoft Discovery project, such as agents and investigations to run your first AI-powered scientific research. You will complete the following tasks:

- Log in to Microsoft Discovery Studio
- Access Microsoft Discovery project
- Create required agents
- Create an investigation
- And then start a chat in your investigation

## Prerequisites

- An existing and functional Microsoft Discovery Workspace and Project.
- Review [Get started with Microsoft Discovery Infrastructure](quickstart-infrastructure-portal.md) before you begin this tutorial.

## 1. Log in to Microsoft Discovery Studio

Microsoft Discovery Studio is a secure, AI-powered research environment that enables scientists and engineers to accelerate innovation through autonomous agents, simulation workflows, and integrated data tools—all within a unified interface.

After your infrastructure is set up, you can log in to [Microsoft Discovery Studio](https://studio.discovery.microsoft.com) directly via the URL, or find the URL in the Workspace overview page in the Azure portal.

:::image type="content" source="media/quickstart-agents-studio/studio-home.jpg" alt-text="Screenshot of the Microsoft Discovery Studio homepage." lightbox="media/quickstart-agents-studio/studio-home.jpg":::

You must sign in with your Entra ID (work or school account) credentials. Studio supports Single Sign-On (SSO) with Entra ID so that you don't have to explicitly provide credentials if you're already signed in to another service with your Entra ID in the same browser.

> [!NOTE]
> If you have access to multiple Entra tenants, make sure the right tenant is selected when signing in by selecting your profile icon on the top right corner of the page.

## 2. Create an agent

Agents are autonomous, AI-powered systems that perform specific scientific tasks on behalf of users. Powered by large language models (LLMs), agents can use tools, models, and other agents to achieve a goal. In the Microsoft Discovery architecture, agents are the primary functional unit of execution.

In this example, create a basic Chemistry Agent that answers questions about chemical properties of molecules and provides a plan to calculate any property.

1. Sign in to [Microsoft Discovery Studio](https://studio.discovery.microsoft.com/).
1. Select the **Projects** tab in the left navigation pane.
   :::image type="content" source="media/quickstart-agents-studio/create-project-list.jpg" alt-text="Screenshot showing the Project list page in Microsoft Discovery Studio." lightbox="media/quickstart-agents-studio/create-project-list.jpg":::
1. Open the project that we created in the [previous tutorial](./quickstart-infrastructure-portal.md#9-create-a-project) by selecting the name. It will open the project in a new tab.
   :::image type="content" source="media/quickstart-agents-studio/studio-welcome.jpg" alt-text="Screenshot showing the Welcome page in Microsoft Discovery Studio." lightbox="media/quickstart-agents-studio/studio-welcome.jpg":::
1. In the Welcome tab, under the **Get started** section, select the **Create an agent** button.
1. In the **New Agent** tab, select **Agent** as the type.
1. Enter a **Name** and **Description** for the agent. For example:
   - **Name**: `ChemistryAgent`
   - **Description**: `A chemistry expert agent that answers questions about chemical properties of molecules and provides high-level plans for computational needs.`
1. Under **Chat model**, select the model deployment created in the [previous tutorial](./quickstart-infrastructure-portal.md#6-create-chat-model-deployment).
1. Enter the agent **Instructions**. For example:
   ```
   You are a chemistry expert agent who can answer questions about chemical properties of molecules and provide high-level plans for the user's computational needs.
   ```
1. Select **Create agent**.
:::image type="content" source="media/quickstart-agents-studio/create-agent.jpg" alt-text="Screenshot showing the Create Agent page in Discovery Studio." lightbox="media/quickstart-agents-studio/create-agent-lightbox.jpg":::
:::image type="content" source="media/quickstart-agents-studio/create-agent-resources.jpg" alt-text="Screenshot showing the recently created Agent and resources pane in Discovery Studio." lightbox="media/quickstart-agents-studio/create-agent-resources.jpg":::

> [!NOTE]
> Once your agent is created, you can create more agents to the project from the **Resources** pane. Just select the **+** button next to Agents and select **Create new agent** and repeat the process.

## 3. Create an investigation

Investigations are research studies within a project where you can chat with your agents, run computational analyses, and get data-driven insights to scientific questions. Once your agents are created, create an investigation to start a chat.

> [!IMPORTANT]
> Your investigation name must be no more than 20 characters long.

1. In the left navigation pane, select the **Investigations** tab.
1. Select the **Create investigation** button or **+** button.
1. Provide a name and an optional description, then select **Create**.
   :::image type="content" source="media/quickstart-agents-studio/create-investigation.jpg" alt-text="Screenshot showing the Create investigation dialog in Microsoft Discovery Studio.":::

## 4. Start a chat

After your investigation is created, follow these steps:

1. Select the investigation created in [step 3](#3-create-an-investigation) to open it in a tab.
1. In the chat input box, select the agent that we just created in [step 2](#2-create-an-agent).
1. Enter a prompt and select **Send** to get a response using the agent configured in this quickstart.
   :::image type="content" source="media/quickstart-agents-studio/studio-investigations-chat.jpg" alt-text="Screenshot showing the chat interface in a Microsoft Discovery investigation.":::

## Next steps

- Explore [Microsoft Discovery agents](concept-discovery-agent.md) to understand agent capabilities in depth.