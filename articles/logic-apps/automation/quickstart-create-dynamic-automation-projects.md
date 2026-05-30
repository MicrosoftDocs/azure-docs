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

This quickstart shows how to create a project and add team members to your project. 

If you're new to dynamic workflow automation, see [What is Logic Apps Automation](dynamic-workflow-automation-introduction.md).

For the full list of components and terminology, see [Key concepts and terminology](dynamic-workflow-automation-introduction.md#key-concepts-and-terminology).

## Prerequisites

- An Azure account and subscription that uses a work or school account. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

  > [!NOTE]
  >
  > You need an Azure subscription to create projects. Make sure that your account can access the [Logic Apps Automation portal](https://auto.azure.com). As a builder, you only need access to the portal to create dynamic workflows - no Azure subscription necessary.

- For team members who need to work in your project, make sure they have a work or school account in the same Microsoft Entra tenant where your account exists.

  For more information about Microsoft Entra tenants, see [Tenant configurations](/entra/identity-platform/v2-overview#tenant-configurations).

## Create an automation project

A *project* organizes applications and controls who has access. Create a project for each business area or team.

1. Go to the [Logic Apps Automation portal](https://auto.azure.com), and sign in with your Azure account.

   :::image type="content" source="media/quickstart-create-dynamic-workflow-automation/logic-apps-automation-portal.png" alt-text="Screenshot that shows the Logic Apps Automation portal." lightbox="media/quickstart-create-dynamic-workflow-automation/logic-apps-automation-portal.png":::

1. On the home page, under **Get started**, select **Create a project**.

   The Azure portal opens and shows the **Automation Projects** page so you can create your automation project.

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

1. If you're signed out, sign back in to the [Logic Apps Automation portal](https://auto.azure.com).

1. From the **Projects** list, find and select your project.

   The portal opens and shows your project's home page.

Before you can start building workflows, you need create an application as a deployable package that contains these workflows. For more information, see [Create your application](quickstart-create-dynamic-workflows.md#create-application).

Before others can work in your project, you need to [add them as members](#add-project-members).

### Project ownership

By default, as the project creator, you're also the project owner and appear in the **Project Owner** project property.

- The project owner is a property, not a permission level. You can't clear or remove this property value.

- Each resource can have only a single owner.

- By default, as the project owner, you have **Contributor** role permissions at the project level.

- As the project owner, you get administrator-level permissions to delete the project and sub-resources, such as application or sandboxes, including those you don't own. Not even those with the **Contributor** role can perform these tasks.

## Add project members

Before others can create applications and workflows in your project, first add them as project members by following these steps:

1. In the [Logic Apps Automation portal](https://auto.azure.com), find and open your project.

1. On your project home page, on the sidebar, under **Manage**, select **Settings**.

1. In the **Users** section, select **Add user**.

1. On the **Add role assignment** pane, in the **Select user** box, start entering the email address for the person you want to add.

   The **Select user** list shows only people in the same Microsoft Entra tenant as you.

1. From the results, select the correctly matching person.

1. After the **Role** section appears, select the role the person needs, based on the principle of least privilege, and then select **Add**.

   | Role | Can | Can't |
   |------|-----|-------|
   | **Reader** (view only) | - View only the project settings, members list, sandbox configurations, and shared resources. <br>- View workflow run history. | - Create, edit, or delete any anything. <br>- View applications. <br>- Trigger or cancel workflow runs. <br>- Manage permissions. |
   | **Author** | - Create applications, sandbox configurations, and shared resources. <br>- View the project settings, members list, and sandbox configurations. | - Edit the project settings and manage project members. <br>- View applications or their content without explicit app-level permissions. |
   | **Contributor** | - View and edit project settings, manage the project, and manage project members. <br>- Create applications, but view only metadata for non-owned applications. <br>- Create and edit sandbox configurations. <br>- View workflows, connections, and parameters. <br>- Create, edit, and delete workflows. <br>- Create and edit connections. <br>- View workflow run history. <br>- Trigger and cancel workflow runs. <br>- Manage application permissions. | - Delete the project (owner only). <br>- View application content without explicit app-level permmissions. |

   > [!NOTE]
   >
   > By default, applications are always private, which means that only their creators (owners) can view and access their applications. They're invisible to other project members until the creator-owner explicitly shares them.
   >
   > Project contributors or owners can view application metadata for governance, but not the content. Applications often contain automation that connects to personal accounts. So, privacy by default keeps this data obscured unless explicitly shared.
   >
   > Application owners or contributs can explicitly add members by granting application-lvel roles. To grant access to a specific application, open that application, go to **Settings**, **User permissions**, and add the member you want.

## Related content

- [About Logic Apps Automation](dynamic-workflow-automation-introduction.md)
- [Create dynamic workflows for automation](quickstart-create-dynamic-workflows.md)
- [Compare automation tools](compare-automation-tools.md)
