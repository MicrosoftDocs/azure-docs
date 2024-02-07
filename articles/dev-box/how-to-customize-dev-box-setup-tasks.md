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

<!-- --------------------------------------

- Use this template with pattern instructions for:

How To

- Before you sign off or merge:

Remove all comments except the customer intent.

- Feedback:

https://aka.ms/patterns-feedback

-->

# Create reusable dev box customizations

In this article, you learn how to customize dev boxes by using a catalog of setup tasks and a configuration script to install software, configure settings, and more. These tasks are applied to the new dev box in the final stage of the creation process.  

Microsoft Dev Box customization is a config-as-code approach to performing configuration tasks for dev boxes. You can customize dev boxes by adding the other settings and software they need without having to create a custom VM image. 

By using customizations, you can automate common setup steps, save time and reduce the chance of configuration errors. Some example setup tasks include: 

- Installing software with the WinGet or Chocolatey package managers. 
- Setting OS settings like enabling Windows Features. 
- Configuring applications like installing Visual Studio extensions.

<!-- The following image shows the major components you can configure to get your optimum customizations architecture. --> 
A catalog of tasks defines the customizations that is attached to the dev center. Each task specifies the parameters and options for modifying the dev center's features and behavior. A configuration script named devbox.yaml specifies the set-up tasks to apply to the dev box. You can provide the configuration script by uploading it through the developer portal, or by making it available in your code repository. 

You can implement customizations in stages, building from a simple but functional configuration to an automated process. The stages are as follows:

1. Create a customized dev box 
1. Write your own configuration script 
1. Add your configuration script to your codespace repository 
1. Create your own tasks in your own catalog 

> [!IMPORTANT]
> Customizations in Microsoft Dev Box are currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

### Dev Box customization scenarios 

Customizations are useful wherever you need to configure settings, install software, add extensions, or perform many other actions on your dev boxes after creation. Defining a set of tasks and specifying which are applied to any given dev box supports the following scenarios:   

#### Team-specific configurations 

Development teams can use customizations to preconfigure the software required for their specific development project. Developer team leads can author configuration scripts that apply the setup tasks relevant for their teams. This gives developers a way to create dev boxes that best support their development, without having to request configuration changes from IT, or having the platform engineering team create a custom VM image.  

#### Security compliance 

Organizations can create tasks to define the types of installation and configuration settings that development teams can safely use to remain compliant.  In this way, you can ensure consistency across dev boxes and save the costs associated with ensuring each dev box is compliant individually. 

### What are customization tasks? 

Catalogs contain a collection of curated setup tasks to enable development teams to customize dev boxes. You can use a GitHub repository or an Azure DevOps  repository as a catalog. You can combine tasks to create a development VM that’s unique to your team.  

Microsoft provides a quick start catalog to help you get started with customizations. It includes a default set of tasks that define common setup tasks: 

- Installing software with the WinGet or Chocolatey package managers 
- Setting common OS settings like enabling Windows Features 
- Configuring applications like installing Visual Studio extensions 
- Running a PowerShell script 

Organizations and development teams adopting Dev Box can add to this default set of tasks, or even choose to replace it completely to fit their requirements. 

Tasks are authored using a task.yaml file, which specifies a PowerShell script to execute and metadata about the task such as its name, and input parameters. Dev Box scans a specified folder of the catalog to find task definitions. 

The following example shows a catalog with choco, git-clone, install-vs-extension, and PowerShell tasks defined. Notice the task.yaml file in each task folder. Task.yaml files are used to cache scripts and the input parameters needed to reference them from devbox.yaml files. 

:::image type="content" source="media/how-to-customize-dev-box-setup-tasks/customizations-catalog-tasks.png" alt-text="Screenshot showing a catalog with choco, git-clone, install-vs-extension, and PowerShell tasks defined, with a tasks.yaml for each task.":::

### What is a devbox.yaml file?

Dev Box customizations use a configuration script named devbox.yaml to customize a dev box. A devbox.yaml file defines one or many setupTasks. This is where you specify other software to install, and settings to apply when creating a new dev box. The following example uses a choco task to install the Azure Developer CLI using the Chocolatey package manager and adds the GitHub Copilot extension to Visual Studio 2022.

:::image type="content" source="media/how-to-customize-dev-box-setup-tasks/customizations-devboxyaml-setup-tasks.png" alt-text="Screenshot showing an example that uses a choco task to install the Azure Developer CLI using the Chocolatey package manager and adds the GitHub Copilot extension to Visual Studio 2022.":::

The devbox.yaml file can be checked into a Git repository in either GitHub or Azure DevOps, and then made available to the dev team for creating new dev boxes.

### Permissions required to configure Microsoft Dev Box for customizations

To perform the actions required to create and apply customizations to a dev box, you need certain permissions. The following table describes the actions and permissions or roles you need to configure customizations.


|Action  |Permission / Role  |
|---------|---------|
|Attach a catalog to a dev center |Platform engineer |
|Use developer platform options to upload and apply a yaml file during dev box creation | Dev Box User |
|Create devbox.yaml     | Anyone can create a devbox.yaml file.  |
|Add tasks to a catalog     | Permission to add to the repository hosting the catalog.        |


## Prerequisites

To complete the steps in this article, you must have a dev center configured with a dev box definition, dev box pool, and dev box project.


## 1: Create a customized dev box

In this stage, you use the default quick start catalog and a sample devbox.yaml to get started with customizations. 

### Attach the quick start catalog

A catalog is a Git repository hosted in GitHub or Azure DevOps and attached to your dev center. Dev Box uses catalogs to centrally manage customization tasks. Microsoft provides a sample repository on GitHub with a standard set of default tasks to help you get started. Here, you attach this repository (https://github.com/microsoft/devcenter-catalog) to the dev center.

1. Sign in to the [Microsoft Dev Box developer portal](https://aka.ms/devbox-portal).
1. In the left menu under **Environment configuration**, select **Catalogs**, and then select **Add**.
1. In **Add catalog**, select **Dev box customization tasks** as the quick start catalog. Then, select **Add**.
1. In your dev center, select **Catalogs**, and verify that your catalog appears.

   :::image type="content" source="media/how-to-customize-dev-box-setup-tasks/add-quick-start-catalog.png" alt-text="Screenshot of the Azure portal showing the Add catalog pane with Microsoft's quick start catalog and Dev box customization tasks highlighted.":::

   If the connection is successful, the **Status** is displayed as **Sync successful**.

### Create a customized dev box

Now that you have a catalog that defines the tasks your developers can use, you can reference them from a devbox.yaml and create a customized dev box. 

1. Download an [example yaml configuration from the samples repository](https://azure.github.io/dev-box/reference/devbox.yaml). This example configuration installs VS Code, and clones the OrchardCore .NET web app repo to your dev box.
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

1.Select **Create**.

When the creation process is complete, the dev box has nodejs and VS Code preinstalled. For more examples, see the [dev center examples repository on GitHub](https://github.com/microsoft/devcenter-examples).


## 2: Create your own setup tasks in devbox.yaml

You can define the customization tasks you want to apply to your dev boxes by creating your own devbox.yaml file. You can test your customizations in VS Code and make any required changes without the need to create a separate dev box for each test.

In this stage, there must be a catalog that contains tasks attached to the dev center. You can use a VS Code extension to discover those tasks.

1. Create a Dev Box (or use an existing Dev Box) for testing.
1. On the dev box, install VS Code and then install the [Dev Box v1.2.2 VS Code extension](https://aka.ms/devbox/preview/customizations/vsc-extension). 
1. Download an [example yaml configuration file](https://azure.github.io/dev-box/reference/devbox.yaml) from the samples repository and open it in VS Code.
1. Discover tasks available in the catalog by using the command palette.
1. Test configuration in VS Code by using f5/command palette.
1. Inspect your changes and check the VS Code terminal for any errors or warnings (your DevBox.yaml is run on your dev box immediately).
1. Once satisfied, use the new devbox.yaml file with the file upload flow or commit it to your team’s shared repository.
 
> [!NOTE]
> The ability to create and upload a file isn’t a security risk; the file uploaded can only apply settings defined in the catalog attached to the dev center. If the task isn't defined there, the developer will get an error saying the task isn't defined.


### 3: Add your devbox.yaml to your codespace repository

Make your devbox.yaml file seamlessly available to your developers by uploading it to a repository accessible to the developers, usually their coding repository.  When you create a dev box, the devbox.yaml is cloned along with the code repository, and the tasks listed in devbox.yaml are performed. This configuration provides a seamless way to perform customizations on a dev box.

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

1.Select **Create**.

The new dev box has the AzDO repository cloned, and all instructions from devbox.yaml applied. 

### 4: Create your own tasks in your own catalog

The final stage of a complete customizations architecture. In this stage, you create your own tasks in the catalog attached to the dev center, to support your dev box configuration. You might choose to add <some examples>.

1.	Create a copy of the quick-start catalog (devcenter-catalog)
2.	Learn how to write tasks by looking at Tasks using existing PowerShell scripts with help of reference docs
3.	Attach your own repository as a catalog (AzDO and GitHub supported using managed identity), or sync if it's already an existing catalog
4.	Try out your new tasks
5.	Author a devbox.yaml file for those tasks



## Related content

* [Add and configure a catalog from GitHub or Azure DevOps](/azure/deployment-environments/how-to-configure-catalog?tabs=DevOpsRepoMSI)
* [Related article title](link.md)
* [Related article title](link.md)
