---
title: "Quickstart: Add agents using bundles in Microsoft Discovery Studio"
description: Use agent bundles to quickly deploy a preconfigured set of agents to your Microsoft Discovery project and run your first AI-powered scientific investigation.
author: surajmb
ms.author: surmb
ms.service: azure
ms.topic: quickstart
ms.date: 04/03/2026
ms.custom:
  - template-quickstart

#customer intent: As a scientist or engineer, I want to quickly add a set of preconfigured agents to my project using bundles so that I can start running AI-powered scientific investigations without creating each agent individually.

---

# Quickstart: Add agents using bundles in Microsoft Discovery Studio

In this quickstart, you use agent bundles to quickly deploy a preconfigured set of agents to your Microsoft Discovery project and run your first AI-powered scientific investigation. You will complete the following tasks:

- Open your project in Microsoft Discovery Studio
- Add agents using the Hello Discovery bundle
- Verify agent deployment
- Create an investigation and chat with an agent

## Prerequisites

- A fully provisioned Microsoft Discovery workspace and project with a chat model deployment. Complete the [Get started with Microsoft Discovery Infrastructure](quickstart-infrastructure-portal.md) quickstart before you begin.

## 1. Open your project in Discovery Studio

1. Sign in to [Microsoft Discovery Studio](https://studio.discovery.microsoft.com/).
1. Select the **Projects** tab in the left navigation pane.
1. Open the project that you created in the [infrastructure quickstart](./quickstart-infrastructure-portal.md#9-create-a-project) by selecting the project name. The project opens in a new tab.

## 2. Add agents using a bundle

Agent bundles provide a preconfigured set of agents and tools that work together to support common scientific workflows. Instead of creating each agent individually, you can deploy an entire bundle in one step.

1. In the project welcome page, select **Add agents**.
   :::image type="content" source="media/quickstart-agents-bundles/add-agents.jpg" alt-text="Screenshot showing the project welcome page with add agents button." lightbox="media/quickstart-agents-bundles/add-agents.jpg":::
1. In the **Add agents** wizard, select the **Bundles** tab.
1. Under **Chat model**, select the chat model deployment created in the [infrastructure quickstart](./quickstart-infrastructure-portal.md#6-create-chat-model-deployment).
1. Select the **Hello Discovery** bundle. This bundle is the only bundle available today and deploys a curated set of agents designed for scientific research workflows.
1. Select **Add** to begin the deployment.
   :::image type="content" source="media/quickstart-agents-bundles/add-agent-bundles.jpg" alt-text="Screenshot showing the add agent wizard with bundles tab." lightbox="media/quickstart-agents-bundles/add-agent-bundles.jpg":::

> [!NOTE]
> The Hello Discovery bundle deploys six agents to your project. This process may take a few minutes to complete.

## 3. Verify agent deployment

After the deployment process completes, verify that all agents were successfully created:

1. Check the deployment progress in the wizard. All six agents should show a successful status.
1. In the left navigation pane, select the **Resources** tab.
1. Under **Agents**, confirm that all six agents from the Hello Discovery bundle are listed and their status shows as active.
   :::image type="content" source="media/quickstart-agents-bundles/add-agent-bundles-successful.jpg" alt-text="Screenshot showing the resources tab and successful agent deployment." lightbox="media/quickstart-agents-bundles/add-agent-bundles-successful.jpg":::

## 4. Create an investigation

Investigations are research studies within a project where you can chat with your agents, run computational analyses, and get data-driven insights to scientific questions.

1. In the left navigation pane, select the **Investigations** tab.
1. Select the **Create investigation** button or **+** button.
1. Provide a name and an optional description, then press **Enter** to create.

## 5. Start a chat with the workflow agent

After your investigation is created, test the deployed agents by starting a conversation:

1. Select the investigation created in [step 4](#4-create-an-investigation) to open it in a tab.
1. In the chat input box, the **workflow agent** is selected by default in the agent selector.
1. Enter a sample chemistry question, for example:

   ```
   What are the key chemical properties of aspirin and how is it synthesized?
   ```

1. Select **Send** to submit the prompt. The workflow agent orchestrates the response using the agents deployed from the Hello Discovery bundle to provide a response.

## Next steps

- Learn more about [Microsoft Discovery agents](concept-discovery-agent.md) to understand agent capabilities in depth.
- Explore [Microsoft Discovery agent types](concept-discovery-agent-types.md) to understand the different types of agents available.
- Try [creating custom agents](quickstart-agents-studio.md) to build agents tailored to your specific research needs.
