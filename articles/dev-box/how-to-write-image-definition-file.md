---
title: Create image definition files for Team Customizations
description: Set up team customizations for dev boxes with image definition files, enabling efficient resource management for developer teams.
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.custom:
  - ignite-2024
  - ai-gen-docs-bap
  - ai-gen-description
  - ai-seo-date:04/18/2025
ms.topic: how-to
ms.date: 04/18/2025

#customer intent: As a Dev Center Admin or Project Admin, I want to create image definition files so that my development teams can create customized dev boxes.
---

# Write an image definition file for Dev Box team customizations

[!INCLUDE [note-build-2025](includes/note-build-2025.md)]


The Dev Box customizations feature helps you streamline the setup of cloud-based development environments. Getting developers started on a new project or team can be complex and time-consuming. Customizations let you configure ready-to-code workstations with applications, tools, repositories, code libraries, packages, and build scripts. This article guides you through the process of creating, testing, and editing an image definition file for your dev box using Visual Studio Code (VS Code). 

There are two ways to use customizations in Microsoft Dev Box. Team customizations create a shared configuration for a team of developers. Individual customizations create a personal configuration for an individual developer. The following table summarizes the differences between the two types of customizations.

| Feature                     | Team customizations       | Individual customizations       |
|-----------------------------|---------------------------|---------------------------------|
| Configure on               | Dev box pool             | Dev box                           |
| Customizations apply to    | All dev boxes in pool    | Individual dev box                |
| Easily shareable           | Yes                      | No                                |
| Customizations file name   | Imagedefinition.yaml     | myfilename.yaml or Workload.yaml  |
| Sourced from               | Catalog                  | Uploaded or from personal repository |
| Supports key vault secrets | Yes                      | Yes                               |


## Prerequisites

To complete the steps in this article, you must:

- Have a [dev center configured with a dev box pool, and dev box project](./quickstart-configure-dev-box-service.md) so that you can create a dev box.
- Be a member of the Dev Box Users security group for at least one project.
- Have a catalog attached to the dev center with tasks that you can use in your image definition file. If you don't have a catalog, see [Add and configure a catalog from GitHub or Azure Repos](../deployment-environments/how-to-configure-catalog.md).

## Permissions required to configure customizations

| Action                                                   | Permission/Role                                                                 |
|----------------------------------------------------------|---------------------------------------------------------------------------------|
| Enable project-level catalogs for a dev center.          | Platform engineer with write access on the subscription.                        |
| Enable catalog sync settings for a project.              | Platform engineer with write access on the subscription.                        |
| Attach a catalog to a project.                           | Project Admin or Contributor permissions on the project.                        |
| Create an image definition file.                             | None specified. Anyone can create an image definition file.                         |
| Add tasks to a catalog.                                  | Permission to add to the repository that hosts the catalog.                     |

## Choose a source for customization tasks
Dev Box tasks can be sourced from tasks built-in to the platform, or custom tasks stored in a catalog. Choose the source that best aligns with your customization needs and project requirements.

- **Use WinGet and PowerShell tasks**
   Dev Box dev centers support PowerShell and WinGet tasks out of the box. If your customizations require only PowerShell and WinGet, proceed with creating your customizations file: [Create an image definition file](#create-an-image-definition-file).

- **Use a catalog to define custom tasks**
   You can create your own custom tasks. To make custom tasks available to your entire organization, attach a catalog that contains custom task definitions to your dev center. Dev Box supports Azure Repos and GitHub catalogs.
To learn more about defining custom tasks, see: [Create tasks for Dev Box team customizations](how-to-create-customization-tasks-catalog.md). 

## Create image definitions at project level
Using a project can help manage Dev Box resources efficiently. By assigning each developer team their own project, you can organize resources effectively. You can attach a catalog that stores image definitions to a project to target developer teams.

### 1. Assign permissions for project admins. 
To attach a catalog to a project, you must have Project Admin or Contributor permission for the project.
To learn how to assign Project Admin permission, see [Grant administrative access to Microsoft Dev Box projects](how-to-project-admin.md).

### 2. Enable project-level catalogs
You must enable project-level catalogs at the dev center level before you can add a catalog to a project. 
To enable the use of project-level catalogs at the dev center level:
1. In the [Azure portal](https://portal.azure.com/), navigate to your dev center.
1. In the left menu, under **Settings**, select **Dev center settings**.
1. Under **Project level catalogs**, select **Enable catalogs per project**, and then select **Apply**.

   :::image type="content" source="media/how-to-configure-team-customizations/dev-center-settings-project-catalog.png" alt-text="Screenshot showing the Dev center settings page with the Project level catalogs pane open and the Enable catalogs per project option selected.":::

For more information about adding catalogs to projects, see [Add and configure a catalog from GitHub or Azure Repos](../deployment-environments/how-to-configure-catalog.md).

## Create an image definition file
You can create and manage image definition files by using VS Code. You can use the Microsoft Dev Box extension in VS Code to discover the tasks in the attached catalog and test the image definition file.
1. Create a dev box (or use an existing dev box) for testing.
1. On the test dev box, install VS Code and then install the Dev Box extension.
1. Download an example YAML image definition file from the samples repository and open it in VS Code.
1. Discover tasks available in the catalog by using the command palette. Select **View** > **Command Palette** > **Dev Box: List Available Tasks For This Dev Box**.

   :::image type="content" source="media/how-to-configure-team-customizations/dev-box-command-list-tasks.png" alt-text="Screenshot showing the Visual Studio Code command palette with the 'Dev Box: List Available Tasks For This Dev Box' option selected.":::
 
1. Test customization in VS Code by using the command palette. Select **View** > **Command Palette** > **Dev Box: Apply Customizations Tasks**.

   :::image type="content" source="media/how-to-configure-team-customizations/dev-box-command-apply-tasks.png" alt-text="Screenshot showing the Visual Studio Code command palette with the 'Dev Box: Apply Customizations Tasks' option selected.":::
 
1. The image definition file runs and applies the specified tasks to your test dev box. Inspect the changes and check the VS Code terminal for any errors or warnings generated during the task execution.
1. When the image definition file runs successfully, upload it to your catalog.

## Optional: Customize your dev box by using existing WinGet Configuration files
WinGet configuration uses a config-as-code approach to define the software and settings needed to prepare your Windows environment for coding.

You can also use these configuration files to set up a dev box, by using a WinGet task included in the Microsoft-provided quickstart catalog.
The following example shows a dev box image definition file that calls an existing WinGet Desired State Configuration (DSC) file:

```yaml
tasks:
    - name: winget
      parameters:
          configure: "projectConfiguration.dsc.yaml"
```

To learn more, see [WinGet configuration](https://aka.ms/winget-configuration).

## Next step

Now that you have created an image definition file, upload it to a catalog and attach the catalog to a project. The image definition file will be used to configure and create dev boxes for your development teams.

> [!div class="nextstepaction"]
> [Configure imaging for Dev Box team customizations](how-to-configure-customization-imaging.md)