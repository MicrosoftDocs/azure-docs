---
title: Create Applications for Dynamic Automation
titleSuffix: Logic Apps Automation
description: Create applications in Logic Apps Automation to build and organize dynamically-run, AI-driven workflows.
services: azure-logic-apps
ms.reviewers: estfan, krmitta, divswa, azla
ms.topic: quickstart
ai-usage: ai-assisted
ms.update-cycle: 180-days
ms.date: 06/02/2026
ms.custom:
- build-2026
#Customer intent: As an automation developer, I need to create my first application in Logic Apps Automation so I can build and organize applications for my dynamically-run, AI-powered workflows.
---

# Quickstart: Create applications in Logic Apps Automation (preview)

> [!NOTE]
>
> This preview capability is subject to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

After you create an automation project, you need a way to package related workflows, connections, parameters, analytics, and settings so they deploy and scale together. Without this boundary, automations for different business processes can get disorganized, making them harder to  independently test, monitor, and update.

In Logic Apps Automation, an *application* provides this deployable and scalable package. You create one application per logical workload or related workflows, for example, `order-processing` or `daily-reports`, so each group of related automations stays self-contained inside your project.

This quickstart shows how to create an application inside an existing automation project.

For more information, see:

- [What is Logic Apps Automation](dynamic-workflow-automation-introduction.md)
- [Key concepts and terminology](dynamic-workflow-automation-introduction.md#key-concepts-and-terminology)

## Prerequisites

- A Microsoft work or school account that can access the [Logic Apps Automation portal](https://auto.azure.com), the project where you want to work, and the correct permissions level to create applications and workflows.

- Your work or school account needs to exist in the same Microsoft Entra tenant as the project creator or owner so they can add you to the project and assign the necessary permissions level. If you don't have access, work with the project creator or owner to get access and permissions.

  For more information about Microsoft Entra tenants, see [Tenant configurations](/entra/identity-platform/v2-overview#tenant-configurations).

<a id="create-application"></a>

## Create your application

To create a deployable package for your applications and their components, follow these steps:

1. In the [Logic Apps Automation portal](https://auto.azure.com), open the project where you want to work.

   For example:

   :::image type="content" source="media/quickstart-create-dynamic-workflow-automation/project-list.png" alt-text="Screenshot that shows the Logic Apps Automation portal and project list." lightbox="media/quickstart-create-dynamic-workflow-automation/project-list.png":::

1. After the **Applications** page opens, select **+ Create Application**.

   For example:

   :::image type="content" source="media/quickstart-create-dynamic-workflow-automation/create-application.png" alt-text="Screenshot that shows the Logic Apps Automation portal and Applications page." lightbox="media/quickstart-create-dynamic-workflow-automation/create-application.png":::

1. In the **Create Application** box, for **Application name**, enter a descriptive name for your application, and then select **Create**.

   > [!NOTE]
   >
   > Creating an application might take a minute or two. Monitor the **Status** column for when the application is ready.

   After the portal creates the application resource, your application appears on the **Applications** page.

1. On the **Applications** page, select your application.

   For example:

   :::image type="content" source="media/quickstart-create-dynamic-workflow-automation/new-application.png" alt-text="Screenshot that shows the Applications page and newly created application." lightbox="media/quickstart-create-dynamic-workflow-automation/new-application.png":::

   Inside your application, the **Workflows** page automatically opens and shows the workflow landing page. Any workflows that other project members previously built also appear here.

## Clean up resources

If you no longer need the resources you created in this quickstart, delete the resource group to avoid extra charges:

1. In the Azure portal search bar, enter the resource group name.

1. Select the resource group from the results.

1. On the resource group page, select **Delete resource group**.

1. Enter the resource group name to confirm, and then select **Delete**.

## Related content

- [What is Logic Apps Automation](dynamic-workflow-automation-introduction.md)
- [Build dynamic workflows with Logic Apps Automation](quickstart-create-dynamic-workflows.md)
