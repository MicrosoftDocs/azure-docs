---
title: Create Dynamic Agentic Workflow Automation
description: Learn how to build dynamically-run, AI-driven automation workflows that make decisions to complete tasks autonomously or conversationally by using Logic Apps Automation.
services: azure-logic-apps
ms.reviewers: estfan, divswa, azla
ms.topic: quickstart
ai-usage: ai-assisted
ms.update-cycle: 180-days
ms.date: 06/02/2026
ms.custom:
  - build-2026
#customer intent: As an automation developer, I want to build my first dynamically-run, AI-first automation workflow by using Logic Apps Automation.
---

# Quickstart: Build dynamic agentic workflows with Logic Apps Automation (preview)

> [!NOTE]
>
> This preview capability, might incur charges, and is subject to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


This guide shows how to create a dynamic automation [workflow](dynamic-workflow-automation-introduction.md#key-concepts-and-terminology) by using Logic Apps Automation. You'll complete the following tasks:

## Prerequisites

- An Azure account and subscription. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).


## 1: Create your automation project

1. Visit the [Logic Apps Automation portal](), and sign in with your Azure account.

1. On the home page, under **Get started**, select **Create a project**.

   The Azure portal opens the **Automation Projects** page so you can create an automation project.

1. On the **Automation Projects** toolbar, select **+ Create**.

1. On the **Create an Automation Project** page, on the **Basics** tab, enter the following information:

   | Property | Description |
   |----------|-------------|
   | **Subscription** | Your Azure subscription. |
   | **Resource group** | The [Azure resource group](../azure-resource-manager/management/overview.md#terminology) for organizing your project resources. Enter a unique name across Azure regions that uses only alphanumeric characters, hyphens (`-`), underscores (`_`), parentheses (`()`), or periods (`.`). |
   | **Name** | Enter a unique project name across Azure regions that uses only alphanumeric characters, hyphens (`-`), underscores (`_`), parentheses (`()`), or periods (`.`). |
   | **Region** | The Azure region for your project. |

   For example:

   :::image type="content" source="media/quickstart-create-dynamic-workflow-automation/create-automation-project.png" alt-text="Screenshot that shows the Azure portal and page to create an automation project." lightbox="media/quickstart-create-dynamic-workflow-automation/create-automation-project.png":::

1. When you finish, select **Review + create** > **Create**.

   The Azure portal starts creating and deploying your automation project resource.

   > [!NOTE]
   >
   > This process might take several minutes to finish.

   After project creation completes, the automation project opens. If not, select **Go to resource**.

1. On the project toolbar, select **Open in Automation Portal** to open the Logic Apps Automation portal.

1. Sign in to the Logic Apps Automation portal.

## 2: Create your app

1. In the Logic Apps Automation portal, find and select your project. For example:

   :::image type="content" source="media/quickstart-create-dynamic-workflow-automation/project-list.png" alt-text="Screenshot that shows the Logic Apps Automation portal and project list." lightbox="media/quickstart-create-dynamic-workflow-automation/project-list.png":::

   The **Applications** page opens. New projects don't contain any apps, so create your app.

1. On the **Applications** page, select **+ Create Application**. For example:

   :::image type="content" source="media/quickstart-create-dynamic-workflow-automation/create-application.png" alt-text="Screenshot that shows the Logic Apps Automation portal and Applications page." lightbox="media/quickstart-create-dynamic-workflow-automation/create-application.png":::

1. In the **Create Application** box, for **Application name**, enter a name for your app, and select **Create**.

   > [!NOTE]
   >
   > This process might take several minutes to finish.

   After app creation completes, the app appears on the **Applications** page.

1. Select your app.

   :::image type="content" source="media/quickstart-create-dynamic-workflow-automation/new-application.png" alt-text="Screenshot that shows the Applications page and newly created app." lightbox="media/quickstart-create-dynamic-workflow-automation/new-application.png":::

1. Under **Get started with your first workflow**, choose a path:

   - Ask the AI assistant to build the workflow.

     1. In the edit box, enter the description for the process to automate.

        > [!TIP]
        >
        > To view an example, from the **Examples** list, select a sample description that you can reuse or edit.

     1. When you finish, select **Build**.

   - Build the workflow manually by using the designer.

     1. Select **Build from scratch**.

     1. For **Workflow name**, enter a name to use.

     1. Select one of the following workflow templates:

        | Template | Description |
        |----------|-------------|
        | **Blank workflow** | Start with an empty designer. Add the trigger that runs the workflow. Add actions, agents, or MCP servers as tools. |
        | **Request-Response** | Run the workflow when HTTP or HTTPS requests arrive from external callers. Return an HTTP response to the original caller when the workflow completes. |
        | **Try-Catch Error Handler** | Catch and handle errors by using structured **Scope** actions. |
        | **HTTP Request Handler** | Run the workflow when POST requests arrive from external callers. Return a JSON response to the original caller when the workflow completes. |

      1. Select **Build**.

## 3: Manage users and permissions

## 4: Set up an agent

## 5: Build your workflow

## Related content


