---
title: Customize your dev box with setup tasks
titleSuffix: Microsoft Dev Box
description: Customize your dev box by using a catalog of setup tasks and a configuration script to install software, configure settings, and more.
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.topic: how-to 
ms.date: 02/07/2024

#customer intent: As a platform engineer, I want to be able to complete configuration tasks on my dev boxes, so that my developers have the environment they need as soon as they start using their dev box.

---

# Create reusable dev box customizations

In this article, you learn how to customize dev boxes by using a catalog of setup tasks and a configuration script to install software, configure settings, and more. These tasks are applied to the new dev box in the final stage of the creation process.  

Microsoft Dev Box customization is a config-as-code approach to performing configuration tasks for dev boxes. You can customize dev boxes by adding the other settings and software they need without having to create a custom virtual machine (VM) image. 

By using customizations, you can automate common setup steps, save time, and reduce the chance of configuration errors. Some example setup tasks include: 

- Installing software with the WinGet or Chocolatey package managers. 
- Setting OS settings like enabling Windows Features. 
- Configuring applications like installing Visual Studio extensions.

You can implement customizations in stages, building from a simple but functional configuration to an automated process. The stages are as follows:

1. [Create a customized dev box](#create-a-customized-dev-box)
1. [Write a configuration script](#create-setup-tasks-in-devboxyaml) 
1. [Create new tasks in a catalog](#create-tasks-in-a-catalog) 
1. [Add a configuration script to a code repository](#add-a-configuration-script-to-a-code-repository) 

> [!IMPORTANT]
> Customizations in Microsoft Dev Box are currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

### Dev Box customization scenarios 

Customizations are useful wherever you need to configure settings, install software, add extensions, or perform other actions on your dev boxes during the final stage of creation. Defining resuable customizations supports the following scenarios:   

#### Team-specific configurations 

Development teams can use customizations to preconfigure the software required for their specific development project. Developer team leads can author configuration scripts that apply only the setup tasks relevant for their teams. This method lets developers make their own dev boxes that best fit their work, without needing to ask IT for changes or wait for the engineering team to create a custom VM image.  

#### Security compliance 

Organizations can create tasks to define the types of installation and configuration settings that development teams can safely use to remain compliant. This approach ensures consistency across dev boxes and saves the costs associated with ensuring each dev box is compliant individually. 

### What are customization tasks? 

A task performs a specific action, like installing software. Each task consists of one or more PowerShell scripts, along with a *task.yaml* file that provides parameters and defines how the scripts run. You can store a collection of curated setup tasks in a catalog attached to your dev center, with each task in a separate folder. Dev Box supports using a GitHub repository or an Azure DevOps repository as a catalog, and scans a specified folder of the catalog to find task definitions. 

Microsoft provides a quick start catalog to help you get started with customizations. It includes a default set of tasks that define common setup tasks: 

- Installing software with the WinGet or Chocolatey package managers 
- Setting common OS settings like enabling Windows Features 
- Configuring applications like installing Visual Studio extensions 
- Running a PowerShell script 

The following example shows a catalog with choco, git-clone, install-vs-extension, and PowerShell tasks defined. Notice that each folder contains a task.yaml file and at least one PowerShell script. Task.yaml files cache scripts and the input parameters needed to reference them from devbox.yaml files. 

:::image type="content" source="media/how-to-customize-dev-box-setup-tasks/customizations-catalog-tasks.png" alt-text="Screenshot showing a catalog with choco, git-clone, install-vs-extension, and PowerShell tasks defined, with a tasks.yaml for each task.":::

### What is a devbox.yaml file?

Dev Box customizations use a configuration script called *devbox.yaml* to specify which task to apply from the catalog when creating a new dev box. A devbox.yaml file includes one or more setupTasks, which identify the catalog task and provide input parameters like the name of the software to install. The following example uses a choco task to install the Azure Developer CLI using the Chocolatey package manager and adds the GitHub Copilot extension to Visual Studio 2022.

:::image type="content" source="media/how-to-customize-dev-box-setup-tasks/customizations-devboxyaml-setup-tasks.png" alt-text="Screenshot showing an example that uses a choco task to install the Azure Developer CLI using the Chocolatey package manager and adds the GitHub Copilot extension to Visual Studio 2022.":::

The devbox.yaml file is then made available to the developers creating new dev boxes.

### Permissions required to configure Microsoft Dev Box for customizations

To perform the actions required to create and apply customizations to a dev box, you need certain permissions. The following table describes the actions and permissions or roles you need to configure customizations.


|Action  |Permission / Role  |
|---------|---------|
|Attach a catalog to a dev center |Platform engineer |
|Use the developer portal to upload and apply a yaml file during dev box creation | Dev Box User |
|Create devbox.yaml     | Anyone can create a devbox.yaml file.  |
|Add tasks to a catalog     | Permission to add to the repository hosting the catalog.        |


## Prerequisites

To complete the steps in this article, you must have a dev center configured with a dev box definition, dev box pool, and dev box project.


## Create a customized dev box

Use the default quick start catalog and a sample devbox.yaml to get started with customizations. 

### Attach the quick start catalog

Microsoft provides a sample repository on GitHub with a standard set of default tasks to help you get started, known as the [*quick start catalog*](https://github.com/microsoft/devcenter-catalog).

To attach the quick start catalog to the dev center:

1. Sign in to the [Microsoft Dev Box developer portal](https://aka.ms/devbox-portal).
1. In the left menu under **Environment configuration**, select **Catalogs**, and then select **Add**.
1. In **Add catalog**, select **Dev box customization tasks** as the quick start catalog. Then, select **Add**.
1. In your dev center, select **Catalogs**, and verify that your catalog appears.

   :::image type="content" source="media/how-to-customize-dev-box-setup-tasks/add-quick-start-catalog.png" alt-text="Screenshot of the Azure portal showing the Add catalog pane with Microsoft's quick start catalog and Dev box customization tasks highlighted.":::

   If the connection is successful, the **Status** is displayed as **Sync successful**.

### Create your customized dev box

Now that you have a catalog that defines the tasks your developers can use, you can reference those tasks from a devbox.yaml and create a customized dev box. 

1. Download an [example yaml configuration from the samples repository](https://azure.github.io/dev-box/reference/devbox.yaml). This example configuration installs Visual Studio Code, and clones the OrchardCore .NET web app repo to your dev box.
1. Sign in to the [Microsoft Dev Box developer portal](https://aka.ms/devbox-portal).
1. Select **New** > **Dev Box**.
1. In **Add a dev box**, enter the following values:

   | Setting | Value |
   |---|---|
   | **Name** | Enter a name for your dev box. Dev box names must be unique within a project. |
   | **Project** | Select a project from the dropdown list. |
   | **Dev box pool** | Select a pool from the dropdown list, which includes all the dev box pools for that project. Choose a dev box pool near to you for least latency.|
   | **Uploaded customization files** | Select **Upload a customization file** and upload the devbox.yaml file you downloaded in step 1. |

   :::image type="content" source="media/how-to-customize-dev-box-setup-tasks/developer-portal-customization-upload.png" alt-text="Screenshot showing the dev box customization options in the developer portal with Uploaded customization files highlighted.":::

1. Select **Create**.

When the creation process is complete, the new dev box has nodejs and Visual Studio Code installed. 

For more examples, see the [dev center examples repository on GitHub](https://github.com/microsoft/devcenter-examples).


## Create setup tasks in devbox.yaml

You can define new customization tasks to apply to your dev boxes by creating your own devbox.yaml file. You can test your devbox.yaml customization script in Visual Studio Code and make any required changes without the need to create a separate dev box for each test.

Before you can create and test your own configuration script, there must be a catalog that contains tasks attached to the dev center. You can use a Visual Studio Code extension to discover the tasks in the attached catalog.

1. Create a Dev Box (or use an existing Dev Box) for testing.
1. On the test dev box, install Visual Studio Code and then install the [Dev Box v1.2.2 VS Code extension](https://aka.ms/devbox/preview/customizations/vsc-extension). 
1. Download an [example yaml configuration file](https://azure.github.io/dev-box/reference/devbox.yaml) from the samples repository and open it in Visual Studio Code.
1. Discover tasks available in the catalog by using the command palette. From **View** > **Command Palette**, select **Dev Box: List available tasks for this dev box**.
 
   :::image type="content" source="media/how-to-customize-dev-box-setup-tasks/dev-box-command-list-tasks.png" alt-text="Screenshot of Visual Studio Code showing the command palette with Dev Box List available tasks for this dev box highlighted."::: 
 
1. Test configuration in Visual Studio Code by using f5/command palette. From **View** > **Command Palette**, select **Dev Box: Apply customizations tasks**.
 
   :::image type="content" source="media/how-to-customize-dev-box-setup-tasks/dev-box-command-apply-tasks.png" alt-text="Screenshot of Visual Studio Code showing the command palette with Dev Box Apply customizations tasks highlighted."::: 
 
1. The devbox.yaml runs immediately, applying the specified tasks to your test dev box. Inspect the changes and check the Visual Studio Code terminal for any errors or warnings generated during the task execution.
1. When the devbox.yaml runs successfully, share it developers to upload when they create a new dev box.
 
> [!NOTE]
> The ability to create and upload a file isn’t a security risk; the file uploaded can only apply settings defined in the catalog attached to the dev center. If the task isn't defined there, the developer will get an error saying the task isn't defined.


### Add a configuration script to a code repository

Make your devbox.yaml file seamlessly available to your developers by uploading it to a repository accessible to the developers, usually their coding repository. When you create a dev box, you specify the repository URL and the devbox.yaml is cloned along with the rest of the repository. The tasks listed in devbox.yaml are performed. This configuration provides a seamless way to perform customizations on a dev box.

1.	Create a devbox.yaml file.
1.	Add the devbox.yaml file to the root of a private AzDO repository with your code and commit it.
1.	Sign in to the [Microsoft Dev Box developer portal](https://aka.ms/devbox-portal).
1. Select **New** > **Dev Box**.
1. In **Add a dev box**, enter the following values:

   | Setting | Value |
   |---|---|
   | **Name** | Enter a name for your dev box. Dev box names must be unique within a project. |
   | **Project** | Select a project from the dropdown list. |
   | **Dev box pool** | Select a pool from the dropdown list, which includes all the dev box pools for that project. Choose a dev box pool near to you for least latency.|
   | **Repository clone URL** | Enter the URL for the repository that contains the devbox.yaml file and your code. |

   :::image type="content" source="media/how-to-customize-dev-box-setup-tasks/developer-portal-customization-clone.png" alt-text="Screenshot showing the dev box customization options in the developer portal with Repository clone URL highlighted.":::

1. Select **Create**.

The new dev box has the AzDO repository cloned, and all instructions from devbox.yaml applied. 

### Create tasks in a catalog

Creating new tasks in a catalog allows you to create customizations tailored to your development teams. You can create tasks by modifying existing PowerShell scripts and task.yaml files or creating new ones. Use the examples given in the [dev center examples repository on GitHub](https://github.com/microsoft/devcenter-examples) as a guide.

1.	Create a copy of the [quick start catalog](https://github.com/microsoft/devcenter-catalog) in your own repository.
2.	Create tasks in your repository by modifying existing PowerShell scripts, or creating new scripts. Use the examples given in the [dev center examples repository on GitHub](https://github.com/microsoft/devcenter-examples) and [PowerShell documentation](/powershell/) to get started.
3.	[Attach your repository to your dev center as a catalog](/azure/deployment-environments/how-to-configure-catalog?tabs=DevOpsRepoMSI).
4.	Create a devbox.yaml file for those tasks by following the steps in [Create your own setup tasks in devbox.yaml](#create-setup-tasks-in-devboxyaml). 

## Related content

* [Add and configure a catalog from GitHub or Azure DevOps](/azure/deployment-environments/how-to-configure-catalog?tabs=DevOpsRepoMSI)

