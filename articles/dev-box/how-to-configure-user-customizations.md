---
title: Configure a user Customization File for Your Dev Box
description: Learn how to upload and validate user customization files for dev boxes directly from your local drive or repository.
#customer intent: As a developer, I want to upload a customization file from my local drive or repository so that I can configure my dev box with my preferred tools and scripts.
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.custom:
  - ignite-2024
  - ai-gen-docs-bap
  - ai-gen-title
  - ai-seo-date:04/19/2025
  - ai-gen-description
ms.topic: how-to
ms.date: 08/15/2025
---


# Configure user customizations for dev boxes

You can personalize your Microsoft Dev Box by uploading a user customization file. User customization files let you configure your dev box with your preferred personal settings and apps, so you can start coding faster. This article explains how to create, test, and upload a user customization file from your local drive or repository using Visual Studio (VS) Code. You also learn how to validate your file and manage customization settings for projects.

Use customizations in Microsoft Dev Box in two ways: team customizations create a shared configuration for a team, and user customizations create a personal configuration for an individual developer. The following table shows the differences between the two types of customizations.

| Feature                     | Team customizations       | User customizations                  |
|-----------------------------|---------------------------|--------------------------------------|
| Set up on                   | Dev box pool              | Dev box                              |
| Customizations apply to     | All dev boxes in pool     | Individual dev box                   |
| Easily shareable            | Yes                       | No                                   |
| Customizations file name    | Imagedefinition.yaml      | *myfilename.yaml* or *workload.yaml* |
| Source                      | Catalog                   | Upload or personal repository        |
| Supports key vault secrets  | Yes                       | Yes                                  |

User customizations help ensure that developers comply with company guardrails; only tasks custom tasks preapproved through a catalog are available to developers to use in their customization files. Standard dev box users can't run built-in PowerShell and WinGet tasks in a system context, which prevents privilege escalation. 

User customizations can be enabled or disabled at the project level. When you create a project, user customizations are on by default.


## Prerequisites

To complete the steps in this article:

- Set up a [dev center with a dev box definition, dev box pool, and dev box project](./quickstart-configure-dev-box-service.md) so you can create a dev box.
- Join the Dev Box Users security group for at least one project.
- Attach a catalog to the dev center with tasks you use in your customization file. If you don't have a catalog, see [Add and configure a catalog from GitHub or Azure Repos](../deployment-environments/how-to-configure-catalog.md).


## Permissions required to set up customizations

To create and apply customizations to a dev box, you need the following permissions:

| Action                                             | Permission or role       |
|----------------------------------------------------|-------------------------|
| Enable or disable user customizations on a project | Write permission on the project. |
| Create a customization file                        | None specified. Anyone can create a customization file. |
| Use the developer portal to upload and apply a YAML file during dev box creation | Dev Box User           |

## Create a user customization file

Create and manage customization files in VS Code. Use the Microsoft Dev Box extension in VS Code to discover tasks in the attached catalog and test the customization file.

1. Create a dev box for testing, or use an existing dev box.

1. On the test dev box, install VS Code, then install the [Dev Box extension](https://marketplace.visualstudio.com/items?itemName=DevCenter.ms-devbox).

1. Download an [example YAML customization file](https://aka.ms/devbox/usercustomizations/samplefile) from the samples repository, then open it in VS Code.

1. Discover available tasks in the catalog by using the command palette. Select **View** > **Command Palette** > **Dev Box: List Available Tasks For This Dev Box**.

   :::image type="content" source="media/how-to-configure-user-customizations/dev-box-command-list-tasks.png" alt-text="Screenshot of the Dev Box command palette in Visual Studio Code, showing the command for listing available tasks.":::

1. Test the customization in VS Code by using the command palette. Select **View** > **Command Palette** > **Dev Box: Apply Customizations Tasks**.

   :::image type="content" source="media/how-to-configure-user-customizations/dev-box-command-apply-tasks.png" alt-text="Screenshot of the Dev Box command palette in Visual Studio Code, showing the command for applying customization tasks.":::

1. The customization file runs and applies the specified tasks to your test dev box. Inspect the changes, and check the VS Code terminal for any errors or warnings during task execution.

1. After the customization file runs successfully, upload it to your catalog.


### Optional: Customize your dev box by using existing WinGet configuration files

WinGet configuration uses a config-as-code approach to define the unique sets of software and configuration settings needed to get your Windows environment ready to code. You can also use these configuration files to set up a dev box by using a WinGet task included in the Microsoft-provided quickstart catalog.

This example shows a dev box customization file that uses an existing WinGet Desired State Configuration (DSC) file.


```yml
$schema: "1.0"
name: "devbox-customization"
userTasks:
  - name: ~/winget
    parameters:
      configure: "projectConfiguration.dsc.yaml"
```


To learn more, see [WinGet configuration](https://aka.ms/winget-configuration).


## Create a dev box using a user customization file

Use an individual customization file by uploading it from a local drive when you create your dev box, or by downloading it from a repository.
Customization files stored in a repository must be named *workload.yaml*. Customization files stored locally for upload should be named *myfilename.yaml*.

### Upload a file

1. In the [developer portal](https://aka.ms/devbox-portal), select **New** > **New dev box**.

1. In the **Add a dev box** pane, add details for your dev box.

1. Select **Apply customizations**, and then select **Continue**.

   :::image type="content" source="media/how-to-configure-user-customizations/add-dev-box-individual-customization.png" alt-text="Screenshot of the Add a dev box pane in the developer portal, showing the option to apply customizations.":::

1. Select **Upload a customization file(s)**, select **Add customizations from file**, then browse to and select your *myfilename.yaml* file.

   :::image type="content" source="media/how-to-configure-user-customizations/customize-dev-box-upload.png" alt-text="Screenshot of the Upload a customization file section in the developer portal, showing the option to add customizations from a file.":::

1. To check that the tasks in your customizations file are applied correctly, validate them before you proceed. Select **Validate**.

   :::image type="content" source="media/how-to-configure-user-customizations/customize-dev-box-validate.png" alt-text="Screenshot of the Validate button in the developer portal, showing the option to validate the customization file before proceeding.":::

1. Review the dev box creation summary, then select **Create**.

    :::image type="content" source="media/how-to-configure-user-customizations/customized-dev-box-create.png" alt-text="Screenshot of the dev box creation summary page in the developer portal, showing the option to create a customized dev box.":::

### Get a file from a repository

1. In the [developer portal](https://aka.ms/devbox-portal), select **New** > **New dev box**.

1. In the **Add a dev box** pane, add details for you dev box.

1. Select **Apply customizations**, and then select **Continue**.

   :::image type="content" source="media/how-to-configure-user-customizations/add-dev-box-individual-customization.png" alt-text="Screenshot of the Add a dev box pane in the developer portal, showing the option to apply customizations.":::

1. Select **Upload a customization file(s)**, select **Choose a customization file from a repository**, then enter the URL for the repository that stores your *workload.yaml* file.

   :::image type="content" source="media/how-to-configure-user-customizations/customize-dev-box-from-repository.png" alt-text="Screenshot of the Choose a customization file from a repository section in the developer portal, showing the option to enter a repository URL.":::

1. To verify that the tasks in your customizations file will be applied correctly, validate them before you proceed. Select **Validate**.

   :::image type="content" source="media/how-to-configure-user-customizations/customize-dev-box-validate.png" alt-text="Screenshot of the Validate button in the developer portal, showing the option to validate the customization file before proceeding.":::

1. Review the dev box creation summary, and then select **Create**.

    :::image type="content" source="media/how-to-configure-user-customizations/customized-dev-box-create.png" alt-text="Screenshot of the dev box creation summary page in the developer portal, showing the option to create a customized dev box.":::


## Disable user customizations

User customizations are controlled at the project level and are enabled by default. You can disable them during or after project creation. When disabled, developers can't apply their own customization files to new dev boxes. Enabling user customizations doesn't bypass existing project guardrails; developers can only use tasks provided in the attached catalog and can't run tasks with elevated privileges unless an administrator has explicitly included an administrative task in the catalog.

### Disable user customizations through the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter *projects*. In the list of results, select **Projects**.

1. On the **Projects** page, select the project where you want to disable user customizations.

1. Go to **Settings** > **Dev box settings**.

   :::image type="content" source="media/how-to-configure-user-customizations/user-customizations-enabled.png" alt-text="Screenshot of a dev box project showing the user customizations feature enabled in the dev box settings." lightbox="media/how-to-configure-user-customizations/user-customizations-enabled.png":::

1. To disable user customizations, clear the **Enable** checkbox, and then select **Apply**.

### Developer experience in the developer portal

When you disable user customizations for a project, developers can still upload a user customization file during dev box creation, but the validation process fails, and the customizations aren't applied to the dev box.

If you create a dev box with user customizations in a project where user customizations are disabled, you see the following in the developer portal:

1. A message on the new dev box tile shows errors applying customizations.

   :::image type="content" source="media/how-to-configure-user-customizations/user-customizations-disabled-tile-error.png" alt-text="Screenshot of a dev box tile showing the message We encountered errors while applying customizations. A See details button is highlighted.":::

1. The details say to contact your admin.

   :::image type="content" source="media/how-to-configure-user-customizations/user-customizations-disabled-error-details.png" alt-text="Screenshot of the error details pane in the developer portal, displaying a message that customizations failed and advising the user to contact their administrator.":::

1. The dev box doesn't include user customizations.

## Related content

- [Microsoft Dev Box customizations](concept-what-are-dev-box-customizations.md)
- [Configure dev center imaging](how-to-configure-dev-center-imaging.md)
- [Add and configure a catalog from GitHub or Azure Repos](../deployment-environments/how-to-configure-catalog.md)
