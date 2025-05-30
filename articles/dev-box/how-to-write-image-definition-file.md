---
title: Create Image Definition Files for Team Customizations
description: Set up team customizations for dev boxes with image definition files to enable efficient resource management for developer teams.
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.custom:
  - ignite-2024
  - ai-gen-docs-bap
  - ai-gen-description
  - ai-seo-date:04/18/2025
ms.topic: how-to
ms.date: 05/09/2025

#customer intent: As a Dev Center admin or project admin, I want to create image definition files so that my development teams can create customized dev boxes.
---

# Write an image definition file for Dev Box team customizations

The Microsoft Dev Box customizations feature helps you streamline the setup of cloud-based development environments. Getting developers started on a new project or with a new team is often complex and time-consuming. With customizations, you can configure ready-to-code workstations with applications, tools, repositories, code libraries, packages, and build scripts. This article guides you through the process of creating, testing, and editing an image definition file for your dev box by using Visual Studio Code.

There are two ways to use customizations in Dev Box. *Team customizations* create a shared configuration for a team of developers. *User customizations* create a personal configuration for an individual developer. The following table summarizes the differences between the two types of customizations.

| Feature                     | Team customizations       | User customizations                  |
|-----------------------------|---------------------------|--------------------------------------|
| Configure on                | Dev box pool              | Dev box                              |
| Customizations apply to     | All dev boxes in pool     | Individual dev box                   |
| Easily shareable            | Yes                       | No                                   |
| Customizations file name    | `Imagedefinition.yaml`    | `myfilename.yaml` or `Workload.yaml` |
| Sourced from                | Catalog                   | Uploaded or from personal repository |
| Supports key vault secrets  | Yes                       | Yes                                  |

## Prerequisites

- Have a [dev center configured with a dev box pool and a dev box project](./quickstart-configure-dev-box-service.md) so that you can create a dev box.
- Be a member of the Dev Box Users security group for at least one project.
- Have a catalog attached to the dev center with tasks that you can use in your image definition file. If you don't have a catalog, see [Add and configure a catalog from GitHub or Azure Repos](../deployment-environments/how-to-configure-catalog.md).

## Permissions required to configure customizations

| Action                                                   | Permission/Role                                                                 |
|----------------------------------------------------------|---------------------------------------------------------------------------------|
| Enable project-level catalogs for a dev center.          | Platform engineer with write access on the subscription.                        |
| Enable catalog sync settings for a project.              | Platform engineer with write access on the subscription.                        |
| Attach a catalog to a project.                           | Dev Center Project Admin or Contributor permissions on the project.                        |
| Create an image definition file.                         | None specified. Anyone can create an image definition file.                     |
| Add tasks to a catalog.                                  | Permission to add to the repository that hosts the catalog.                     |

## Choose a source for customization tasks

You can source Dev Box tasks from tasks built in to the platform, or use custom tasks that are stored in a catalog. Choose the source that best aligns with your customization needs and project requirements.

- **Use WinGet and PowerShell built-in tasks.**
   Dev Box dev centers support PowerShell and WinGet tasks out of the box. You can get started with these built-in tasks. If your customizations require only PowerShell and WinGet, proceed with creating your customizations file. For more information, see [Create an image definition file](#create-an-image-definition-file).

   The WinGet in-built task isn't the WinGet executable. The WinGet in-built task is based on the PowerShell WinGet cmdlet.

- **Use a catalog to define custom tasks.**
   You can create your own custom tasks. To make custom tasks available to your entire organization, attach a catalog that contains custom task definitions to your dev center. Dev Box supports Azure Repos and GitHub catalogs. Because tasks are defined only at the dev center, store tasks and image definitions in separate repositories.
   
   To learn more about how to define custom tasks, see [Create tasks for Dev Box team customizations](how-to-create-customization-tasks-catalog.md).

## Create image definitions at the project level

Projects can help you manage Dev Box resources efficiently. By assigning each developer team their own project, you can organize resources effectively. You can create multiple image definitions in your catalog repository, each in their own folder to target different developer teams under your project.

### Assign permissions for project admins

To attach a catalog to a project, you must have Project Admin or Contributor permission for the project.
To learn how to assign Project Admin permission, see [Grant administrative access to Dev Box projects](how-to-project-admin.md).

### Enable project-level catalogs

You must enable project-level catalogs at the dev center level before you can add a catalog to a project.
To enable the use of project-level catalogs at the dev center level:

1. In the [Azure portal](https://portal.azure.com/), go to your dev center.
1. On the left menu, under **Settings**, select **Dev center settings**.
1. Under **Project level catalogs**, select **Enable catalogs per project**, and then select **Apply**.

   :::image type="content" source="media/how-to-configure-team-customizations/dev-center-settings-project-catalog.png" alt-text="Screenshot that shows the Dev center settings page with the Project level catalogs pane open and the Enable catalogs per project option selected.":::

For more information about how to add catalogs to projects, see [Add and configure a catalog from GitHub or Azure Repos](../deployment-environments/how-to-configure-catalog.md).

## Create an image definition file

You can create and test image definition files by using Visual Studio Code. In addition to using the built-in tasks, you can use the Dev Box extension in Visual Studio Code to discover the custom tasks that are available through your dev center.

1. Create a dev box (or use an existing dev box) for testing.
1. On the test dev box, install Visual Studio Code and then install the Dev Box extension.
1. Download an example YAML image definition file from the samples repository. Open it in Visual Studio Code.
1. Discover the tasks that are available in the catalog by using the command palette. Select **View** > **Command Palette** > **Dev Box: List Available Tasks For This Dev Box**.

   :::image type="content" source="media/how-to-configure-team-customizations/dev-box-command-list-tasks.png" alt-text="Screenshot that shows the Visual Studio Code command palette with the Dev Box: List Available Tasks For This Dev Box option selected.":::

1. Test customization in Visual Studio Code by using the command palette. Select **View** > **Command Palette** > **Dev Box: Apply Customizations Tasks**.

   :::image type="content" source="media/how-to-configure-team-customizations/dev-box-command-apply-tasks.png" alt-text="Screenshot that shows the Visual Studio Code command palette with the Dev Box: Apply Customizations Tasks option selected.":::

1. The image definition file runs and applies the specified tasks to your test dev box. Inspect the changes and check the Visual Studio Code terminal for any errors or warnings generated during the task execution.
1. When the image definition file runs successfully, upload it to your catalog.

### System tasks and user tasks

You can use both system and user tasks in your image definition file. The tasks section of the image definition file is divided into the following sections. Both sections share the same parameters based on the task definitions in your catalog.

- **System tasks**: These tasks run as `LocalSystem` during the provisioning stage of the dev box. They're typically used for system-level configurations, such as installing software or configuring system settings that require administrative privileges.
- **User tasks**: These tasks run as the user after the user's first sign-in to the dev box. They're typically used for user-level configurations, such as installing user-specific applications or configuring user settings under user context. For example, users often prefer to install Python and Visual Studio Code under user context instead of systemwide. Put WinGet tasks in the `userTasks` section for better results when they don't work under tasks.

Standard users who configure user customizations can use only user tasks. They can't use system tasks.

## Optional: Customize your dev box by using existing Desired State Configuration files

Desired State Configuration (DSC) is a management platform in PowerShell that enables you to manage your development environment with configuration as code. You can use DSC to define the desired state of your dev box, including software installations, configurations, and settings.

You can also use DSC configuration files to set up a dev box by using a built-in WinGet task.

The following example shows a dev box image definition file that calls an existing WinGet DSC file:

```yaml
tasks:
    - name: winget
      parameters:
          configure: "projectConfiguration.dsc.yaml"
```

To learn more, see [WinGet configuration](https://aka.ms/winget-configuration).

## Configure catalog sync settings for the project

Configure your project to sync image definitions from the catalog. With this setting, you can use the image definitions in the catalog to create dev box pools.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search box, enter **projects**. In the list of results, select **Projects**.
1. Open the Dev Box project for which you want to configure catalog sync settings.
1. Select **Catalogs**.
1. Select **Sync settings**.

   :::image type="content" source="./media/how-to-write-image-definition-file/customizations-project-sync-settings-small.png" alt-text="Screenshot that shows the Catalogs pane in the Azure portal, with the button for sync settings highlighted." lightbox="./media/how-to-write-image-definition-file/customizations-project-sync-settings.png":::

1. On the **Sync settings** pane, select **Image definitions**, and then select **Save**.

   :::image type="content" source="./media/how-to-write-image-definition-file/customizations-project-sync-image-definitions.png" alt-text="Screenshot that shows the pane for sync settings in the Azure portal, with the checkbox for image definitions highlighted." lightbox="./media/how-to-write-image-definition-file/customizations-project-sync-image-definitions.png":::

## Attach a catalog that contains the definition file

Before you can use a customization file as an image definition, you must attach a catalog that contains the definition file to your dev center or project. The catalog can be from GitHub or Azure Repos.

The **Image definitions** pane lists the image definitions that your project can access.

:::image type="content" source="media/how-to-write-image-definition-file/team-customizations-image-definitions-small.png" alt-text="Screenshot that shows the Azure portal pane that lists accessible image definitions for a project." lightbox="media/how-to-write-image-definition-file/team-customizations-image-definitions.png":::

For more information about how to attach catalogs, see [Add and configure a catalog from GitHub or Azure Repos](../deployment-environments/how-to-configure-catalog.md).

## Configure a dev box pool to use an image definition

Make customizations available to your development teams by configuring a dev box pool to use a customization file (`imagedefinition.yaml`). Store the customization file in a repository linked to a catalog in your dev center or project. Specify this file as the image definition for the pool, and the customizations are applied to new dev boxes.

The following steps show you how to create a dev box pool and specify an image definition:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search box, enter **projects**. In the list of results, select **Projects**.
1. Open the Dev Box project with which you want to associate the new dev box pool.
1. Select **Dev box pools**, and then select **Create**.
1. On the **Create a dev box pool** pane, enter the following values:

   | Setting | Value |
   |---|---|
   | **Name** |Enter a name for the pool. The pool name is visible to developers to select when they create dev boxes. It must be unique within a project. |
   | **Definition** | This box lists image definitions from accessible catalogs and dev box definitions. Select an image definition file. |
   | **Network connection** | Select **Deploy to a Microsoft hosted network**, or use an existing network connection. |
   |**Enable single sign-on** | Select **Yes** to enable single sign-on for the dev boxes in this pool. Single sign-on must be configured for the organization. For more information, see [Enable single sign-on for dev boxes](https://aka.ms/dev-box/single-sign-on). |
   | **Dev box Creator Privileges** | Select **Local Administrator** or **Standard User**. |
   | **Enable Auto-stop** | **Yes** is the default. Select **No** to disable an autostop schedule. You can configure an autostop schedule after the pool is created. |
   | **Stop time** | Select a time to shut down all the dev boxes in the pool. |
   | **Time zone** | Select the time zone that the stop time is in. |
   | **Licensing** | Select this checkbox to confirm that your organization has Azure Hybrid Benefit licenses that you want to apply to the dev boxes in this pool. |

   :::image type="content" source="./media/how-to-write-image-definition-file/pool-specify-image-definition.png" alt-text="Screenshot that shows the pane for creating a dev box pool." lightbox="./media/how-to-write-image-definition-file/pool-specify-image-definition.png":::

1. Select **Create**.
1. Verify that the new dev box pool appears in the list. You might need to refresh the screen.

### Create a dev box by using the developer portal

To verify that customizations from the image definition file are applied, create a dev box in the Dev Box developer portal. Follow the steps in [Quickstart: Create and connect to a dev box by using the Dev Box developer portal](quickstart-create-dev-box.md). Then connect to the newly created dev box and verify that the customizations work as you expected.

You can make adjustments to the customization file and create a new dev box to test the changes. When you're certain that the customizations are correct, you can build a reusable image.

## Next step

Now that you have an image definition file, upload it to a catalog and attach the catalog to a project. The image definition file is used to configure and create dev boxes for your development teams.

> [!div class="nextstepaction"]
> [Configure imaging for Dev Box team customizations](how-to-configure-customization-imaging.md)
