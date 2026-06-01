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

- A Microsoft work or school account that can access the [Logic Apps Automation portal](https://auto.azure.com).

- Your work or school account needs to exist in the same Microsoft Entra tenant as the project creator-owner so they can add you to the project and assign the necessary permissions. If you don't have access, work with the project creator or owner to get access and permissions.

  For more information about Microsoft Entra tenants, see [Tenant configurations](/entra/identity-platform/v2-overview#tenant-configurations).

- The project where you have either the project **Contributor** or **Author** role so you can create applications and workflows.

  > [!NOTE]
  >
  > The project **Reader** role doesn't have enough permissions to create applications.

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
   > Creating an application might take a minute or two. Monitor the **Status** column, and wait until the application is ready before you create any connections, workflows, or other components.

   When the portal finishes, your application appears on the **Applications** page.

1. Continue to the steps for creating a dynamic automation workflow.

#### Application ownership and privacy

By default, when you create an application, you automatically become the application owner.

- As the application owner, you have **Contributor** role permissions at the application level.

- By default, applications are always private. Only the creators (owners) can view and access their applications' contents.

  - Project owners and contributors can view application metadata for governance. However, they can't view workflow content, connections, or workflow run history.
  
  - Other project members can't view the application unless the application creator-owner adds them to the application and gives them the appropriate permissions.

  Applications often contain automations that connect to personal accounts. The default privacy model keeps sensitive data obscured and invisible to others unless the application creator-owner chooses otherwise.

## Add application members

By default, only the application creator-owner or contributor can access an application and its contents. Before other project members can work on your application, add them as application members by following these steps:

1. In the [Logic Apps Automation portal](https://auto.azure.com), on the **Projects** page, select the project that contains the application you want.

1. On the **Appications** page, select the application.

1. On the application sidebar, select **Settings**.

1. On the **Settings** page, select the **User permissions** tab, and complete the following steps:

   1. In the **Users** section, select **Add user**.

   1. On the **Add role assignment** pane, in the **Select user** box, enter the email address for the person you want to add.

      The **Select user** list shows only people in the same Microsoft Entra tenant as you.

   1. From the results, select the correctly matching person.

1. After the **Role** section appears, select the role the person needs, based on the principle of least privilege, and then select **Add**.

   The following table describes the available roles at the application level, what they can do, and what they can't do:

   | Role | Can | Can't |
   |------|-----|-------|
   | **Reader** (view only) | - View workflows, connections, and parameters. <br>- View workflow run history. | - Create, edit, or delete anything. <br>- Trigger or cancel workflow runs. |
   | **Contributor** | - View and edit workflows, connections, and parameters. <br>- View workflow run history. <br>- Trigger, cancel, and resubmit workflow runs. <br>- Manage application permissions. | Delete the application. (owner only) |

   > [!NOTE]
   >
   > By design, the **Author** role is unavailable at the application level.

## Troubleshoot problems

The following table describes some common problems that you might encounter and ways to resolve them:

| Problem | Cause | Resolution |
|---------|-------|------------|
| "I can't create an application." | You have the project **Reader** role. | Ask a project **Contributor** to upgrade you to project **Author** or **Contributor**. |
| "I can't view any applications in the project." | By default, applications are private and invisible to others except the application creator-owner. | Ask the application owner to add you to the application, or make you a project **Contributor**, if you only need to view the application metadata for governance. |
| "I can't manage permissions on applications." | You need the application **Contribtor** role. | Ask the application owner or a **Contributor** to make you an application **Contributor**. |
| "An application lost its owner." | When an application owner leaves your Microsoft Entra tenant, you get the following results: <br><br>- Existing members keep their access. <br><br>- Only the **Project Owner** can delete the application. <br><br>- The application still appears in the project's governance view. |
| "I can't delete applications." | Only the application owner can delete their application. | Contact the application owner. If the owner is unavailable, and the application is orphaned, the project owner can delete orphaned applications. |

## Next steps

> [!div class="nextstepaction"]
> [Create dynamic automation workflows](quickstart-create-dynamic-automation-workflows.md)
