---
title: Create Projects for Dynamic Automation
titleSuffix: Logic Apps Automation
description: Create projects in Logic Apps Automation so you can organize and build applications for dynamically-run, AI-driven workflows.
services: azure-logic-apps
ms.reviewers: estfan, krmitta, divswa, azla
ms.topic: quickstart
ai-usage: ai-assisted
ms.update-cycle: 180-days
ms.date: 06/02/2026
ms.custom:
- build-2026
#Customer intent: As an automation developer, I need to create my first project in Logic Apps Automation so I can build, store, and organize applications for my dynamically-run, AI-powered workflows.
---

# Quickstart: Create projects in Logic Apps Automation (preview)

> [!NOTE]
>
> This preview capability is subject to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Before you start building dynamic workloads in Logic Apps Automation, you need a *project* to store your applications, which contain the workflows, connections, and other items that your automations need. This project organizes applications into a single isolated container with its own compute, networking, security, and governance. You can create a project per team, business area, or scenario so your team can build and keep their automations separate from unrelated projects.

Logic Apps Automation organizes your work at the following levels:

| Level | Contents |
|-------|----------|
| *Project* | The top-level container that stores and groups *applications*. |
| *Application* | A deployable package that holds workflows, connections, parameters, analytics, settings, and other items that your automation needs. |
| *Workflow* | The actual automation workload or process, which includes the starting event (*trigger*) and the steps (*actions*) to perform. |

This quickstart shows how to create a project.

If you're new to dynamic workflow automation, see [What is Logic Apps Automation](dynamic-workflow-automation-introduction.md).

For the full list of components and terminology, see [Key concepts and terminology](dynamic-workflow-automation-introduction.md#key-concepts-and-terminology).

## Prerequisites

An Azure account and subscription that uses a work or school account. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

> [!NOTE]
>
> You need an Azure subscription to create projects. Make sure that your account can access the [Logic Apps Automation portal](https://auto.azure.com). As a builder, you only need access to the portal to create dynamic workflows - no Azure subscription necessary.

## Create an automation project

A *project* organizes applications and controls who has access. Create a project for each business area or team.

1. Go to the [Logic Apps Automation portal](https://auto.azure.com). Sign in with your Azure account.

   :::image type="content" source="media/quickstart-create-dynamic-workflow-automation/logic-apps-automation-portal.png" alt-text="Screenshot that shows the Logic Apps Automation portal." lightbox="media/quickstart-create-dynamic-workflow-automation/logic-apps-automation-portal.png":::

1. On the home page, under **Get started**, select **Create a project**.

   The Azure portal opens the **Automation Projects** page for you to create an automation project.

1. On the **Automation Projects** toolbar, select **+ Create**.

1. On the **Create an Automation Project** page, on the **Basics** tab, enter the following information:

   | Property | Description |
   |----------|-------------|
   | **Subscription** | Your Azure subscription. |
   | **Resource group** | The [Azure resource group](../../azure-resource-manager/management/overview.md#terminology) for organizing your project resources. Enter a unique name across Azure regions that uses only alphanumeric characters, hyphens (`-`), underscores (`_`), parentheses (`()`), or periods (`.`). |
   | **Name** | Enter a unique project name across Azure regions that uses only alphanumeric characters, hyphens (`-`), underscores (`_`), parentheses (`()`), or periods (`.`). |
   | **Region** | The Azure region closest to your end users or the components that your workflows need to use. |

   For example:

   :::image type="content" source="media/quickstart-create-dynamic-workflow-automation/create-automation-project.png" alt-text="Screenshot that shows the Azure portal and page to create an automation project." lightbox="media/quickstart-create-dynamic-workflow-automation/create-automation-project.png":::

1. Select **Review + create** > **Create**.

   Azure starts setting up, creating, and deploying your automation project.

   > [!NOTE]
   >
   > This process might take several minutes to finish.

   After setup completes, the automation project opens. If not, select **Go to resource**.

1. On the project toolbar, select **Open in Automation Portal**, which returns you to the Logic Apps Automation portal.

1. Sign in to the Logic Apps Automation portal.

## Related content

- [About Logic Apps Automation](dynamic-workflow-automation-introduction.md)
- [Create dynamic workflows for automation](quickstart-create-dynamic-workflows.md)
- [Compare automation tools](compare-automation-tools.md)
