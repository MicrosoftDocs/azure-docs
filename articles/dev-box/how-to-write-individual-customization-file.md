---
title: Write an Individual Customization File for Your Dev Box
description: Learn how to upload and validate individual customization files for dev boxes directly from your local drive or repository.
#customer intent: As a Dev Center Admin or Project Admin, I want to create image definition files so that my development teams can create customized dev boxes.
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
ms.date: 04/19/2025
---

# Write an individual customization file for a dev box

The Dev Box individual customizations feature helps you streamline the setup of your dev boxes. Starting a new project or joining a team is often complex and time consuming. With customizations, you can configure your dev boxes with the applications, tools, repositories, code libraries, packages, and build scripts that you need. This article guides you through the process of creating, testing, and editing an individual customization file for your dev box using Visual Studio Code (VS Code). 

You can use customizations in Microsoft Dev Box in two ways. Team customizations are used to create a shared configuration for a team of developers. Individual customizations are used to create a personal configuration for an individual developer. The following table summarizes the differences between the two types of customizations.

| Feature                     | Team customizations       | Individual customizations       |
|-----------------------------|---------------------------|----------------------------------|
| Configure on                | Dev box pool             | Dev box                         |
| Customizations apply to     | All dev boxes in pool    | Individual dev box              |
| Easily shareable            | Yes                      | No                              |
| Customizations file name    | Imagedefinition.yaml     | *myfilename.yaml* or *workload.yaml* |
| Sourced from                | Catalog                  | Uploaded or from personal repository |
| Supports key vault secrets  | Yes                      | Yes                             |

## Prerequisites

To complete the steps in this article, you must:

- Have a [dev center configured with a dev box definition, dev box pool, and dev box project](./quickstart-configure-dev-box-service.md) so that you can create a dev box.
- Be a member of the Dev Box Users security group for at least one project.
- Have a catalog attached to the dev center with tasks that you can use in your customization file. If you don't have a catalog, see [Add and configure a catalog from GitHub or Azure Repos](../deployment-environments/how-to-configure-catalog.md).

## Permissions required to configure customizations
  
To perform the required actions for creating and applying customizations to a dev box, you need the following permissions:

| Action                                           | Permission/Role       |
|--------------------------------------------------|-----------------------|
| Create a customization file.                    | None specified. Anyone can create a customization file. |
| Use the developer portal to upload and apply a YAML file during dev box creation. | Dev Box User          |


## Create an individual customization file

You can create and manage customization files by using VS Code. You can use the Microsoft Dev Box extension in VS Code to discover the tasks in the attached catalog and test the customization file.

1. Create a dev box (or use an existing dev box) for testing.
1. On the test dev box, install VS Code and then install the [Dev Box extension](https://marketplace.visualstudio.com/items?itemName=DevCenter.ms-devbox).
1. Download an [example YAML customization file](https://aka.ms/devbox/usercustomizations/samplefile) from the samples repository and open it in VS Code.
1. Discover tasks available in the catalog by using the command palette. Select **View** > **Command Palette** > **Dev Box: List Available Tasks For This Dev Box**.

   :::image type="content" source="media/how-to-write-individual-customization-file/dev-box-command-list-tasks.png" alt-text="Screenshot of the Dev Box command palette in Visual Studio Code, showing the command for listing available tasks.":::

1. Test customization in VS Code by using the command palette. Select **View** > **Command Palette** > **Dev Box: Apply Customizations Tasks**.

   :::image type="content" source="media/how-to-write-individual-customization-file/dev-box-command-apply-tasks.png" alt-text="Screenshot of the Dev Box command palette in Visual Studio Code, showing the command for applying customization tasks.":::

1. The customization file runs and applies the specified tasks to your test dev box. Inspect the changes, and check the VS Code terminal for any errors or warnings generated during the task execution. Review the VS Code terminal for errors or warnings during task execution.

1. When the customization file runs successfully, upload it to your catalog.

### Optional: Customize your dev box by using existing WinGet Configuration files

WinGet configuration takes a config-as-code approach to defining the unique sets of software and configuration settings needed to get your Windows environment in a ready-to-code state. You can also use these configuration files to set up a dev box, by using a WinGet task included in the Microsoft-provided quickstart catalog.

This example shows a dev box customization file that uses an existing WinGet Desired State Configuration (DSC) file:

```yml
tasks:
    - name: winget
      parameters:
          configure: "projectConfiguration.dsc.yaml"
```

To learn more, see [WinGet configuration](https://aka.ms/winget-configuration).

## Create a dev box using an individual customization file

You can use an individual customization file by uploading it from a local drive when creating your dev box, or by downloading it from a repository. 
Customization files stored in a repository must be called *workload.yaml*. Customization files that are stored locally for upload should be called *myfilename.yaml*. Name customization files stored locally for upload as *myfilename.yaml*.

### Upload a file
1. In the [developer portal](https://aka.ms/devbox-portal), select **New** > **New dev box**.
1. In the **Add a dev box** pane, add details for you dev box.
1. Select **Apply customizations**, and then select **Continue**.

   :::image type="content" source="media/how-to-write-individual-customization-file/add-dev-box-individual-customization.png" alt-text="Screenshot of the Add a dev box pane in the developer portal, showing the option to apply customizations.":::
 
1. Select **Upload a customization file(s)**, select **Add customizations from file**, and then browse to and select your *myfilename.yaml* file.

   :::image type="content" source="media/how-to-write-individual-customization-file/customize-dev-box-upload.png" alt-text="Screenshot of the Upload a customization file section in the developer portal, showing the option to add customizations from a file.":::
 
1. To verify that the tasks in your customizations file will be applied correctly, you must validate them before you can proceed. Select **Validate**.

   :::image type="content" source="media/how-to-write-individual-customization-file/customize-dev-box-validate.png" alt-text="Screenshot of the Validate button in the developer portal, showing the option to validate the customization file before proceeding.":::
 
1. Review the dev box creation summary, and then select **Create**.
     
    :::image type="content" source="media/how-to-write-individual-customization-file/customized-dev-box-create.png" alt-text="Screenshot of the dev box creation summary page in the developer portal, showing the option to create a customized dev box."::: 

### Get a file from a repository
1. In the [developer portal](https://aka.ms/devbox-portal), select **New** > **New dev box**.
1. In the **Add a dev box** pane, add details for you dev box.
1. Select **Apply customizations**, and then select **Continue**.

   :::image type="content" source="media/how-to-write-individual-customization-file/add-dev-box-individual-customization.png" alt-text="Screenshot of the Add a dev box pane in the developer portal, showing the option to apply customizations.":::
 
1. Select **Upload a customization file(s)**, select **Choose a customization file from a repository**, and then enter the URL for the repository that stores your *workload.yaml* file.

   :::image type="content" source="media/how-to-write-individual-customization-file/customize-dev-box-from-repository.png" alt-text="Screenshot of the Choose a customization file from a repository section in the developer portal, showing the option to enter a repository URL.":::
 
1. To verify that the tasks in your customizations file will be applied correctly, you must validate them before you can proceed. Select **Validate**.

   :::image type="content" source="media/how-to-write-individual-customization-file/customize-dev-box-validate.png" alt-text="Screenshot of the Validate button in the developer portal, showing the option to validate the customization file before proceeding.":::
 
1. Review the dev box creation summary, and then select **Create**.
     
    :::image type="content" source="media/how-to-write-individual-customization-file/customized-dev-box-create.png" alt-text="Screenshot of the dev box creation summary page in the developer portal, showing the option to create a customized dev box."::: 

## Related content

- [Microsoft Dev Box team customizations](concept-what-are-team-customizations.md)
- [Configure imaging for Dev Box team customizations](how-to-configure-customization-imaging.md)
- [Add and configure a catalog from GitHub or Azure Repos](../deployment-environments/how-to-configure-catalog.md)
