---
title: Create Dev Box Image Definition Files for Team Customizations
description: Learn how to create Dev Box image definition files for team customizations to speed setup and governance. Follow step-by-step instructions to test and deploy.
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.custom:
  - ignite-2024
  - ai-gen-docs-bap
  - ai-gen-description
  - ai-seo-date:04/18/2025
ms.topic: how-to
ms.date: 08/14/2025

#customer intent: As a Dev Center admin or project admin, I want to create image definition files so that my development teams can create customized dev boxes.
---

# Configure team customizations

Use the Microsoft Dev Box customizations feature to streamline setting up cloud-based development environments. Starting a new project or joining a new team can be complex and time consuming. Team customizations use an image definition file (*imagedefinition.yaml*) to preinstall tools, clone repos, and set settings for every dev box in a pool. With team customizations, administrators can provide ready-to-code workstations with apps, tools, repositories, code libraries, packages, and build scripts. This article shows you how to create, test, and edit an image definition file for your dev box in Visual Studio Code.

You can use customizations in Dev Box in two ways. *Team customizations* create a shared configuration for a team. *User customizations* create a personal configuration for an individual developer. The following list summarizes the differences between these customization types.

- Team customizations: Defined once, applied to every dev box in a pool via imagedefinition.yaml in a catalog.
- User customizations: Personal YAML uploaded during box creation; affects only that one box.
- Use team for consistency and compliance; use user for personal preferences.

To learn more, see [Microsoft Dev Box customizations](concept-what-are-dev-box-customizations.md).

Configure team customizations by following these steps:

:::image type="content" source="media/how-to-configure-team-customizations/dev-box-team-customizations-workflow.png" alt-text="Diagram showing the five-step workflow for team customizations in Microsoft Dev Box.":::

## Prerequisites

| Product | Requirements |
|---------|--------------|
| Microsoft Dev Box  | - Set up a [dev center with a dev box pool and a dev box project](./quickstart-get-started-template.md) so you can create a dev box. </br> - Attach a catalog to the dev center with tasks you can use in your image definition file. If you don't have a catalog, see [Add and configure a catalog from GitHub or Azure Repos](./how-to-configure-catalog.md). </br> **- Permissions** </br> - *To create a dev box:* Join the Dev Box Users security group for at least one project. </br> - *To enable project-level catalogs for a dev center:* Platform engineer with write access on the subscription. </br> - *To enable catalog sync settings for a project:* Platform engineer with write access on the subscription. </br> - *To attach a catalog to a project:* Dev Center Project Admin or Contributor permissions on the project. |
| Visual Studio Code | - Install the latest version |

## Create an image definition file

To define the tools, packages, and configurations your team needs, create an image definition file in YAML format that lists the required tasks for your dev box environment.

### Use built-in tasks or a catalog for custom tasks

Tasks are reusable actions that come from built-in primitives (WinGet, PowerShell, and Git-Clone) or from a catalog you attach to your dev center project. Choose the source that best fits your customization needs and project requirements.

- **Use WinGet, PowerShell, and Git-Clone built-in tasks.**
   Dev Box dev centers support PowerShell and WinGet tasks out of the box. If your customizations require only PowerShell, WinGet, or Git-Clone you can get started with these built-in tasks and create your image definition file. For more information, see [Create an image definition file](#create-an-image-definition-file).

   > [!IMPORTANT]
   > The WinGet built-in task isn't the same as the WinGet executable. The WinGet built-in task is based on the PowerShell WinGet cmdlet.

- **Use a catalog to define custom tasks.**
   Create your own custom tasks. To make custom tasks available to your entire organization, attach a catalog that has custom task definitions to your dev center. Dev Box supports Azure Repos and GitHub catalogs. Because tasks are defined only at the dev center, store tasks and image definitions in separate repositories.
   
   To learn more about defining custom tasks, see [Configure tasks for Dev Box customizations](how-to-configure-customization-tasks.md).

## [AI-powered workflow](#tab/copilot-agent)

Dev Box supports an agentic workflow with GitHub Copilot agent mode. Use natural language prompts to generate the image definition file (*imagedefinition.yaml*). GitHub Copilot makes it easier to set up your Dev Box environment because you describe your needs conversationally instead of manually creating YAML files.

The Dev Box agentic workflow lets you:

- **Mimic your current development environment** - Generate or change a definition that matches the configuration of your current machine.
- **Use repository context** - Create or change a definition in the context of a specific GitHub repository.
- **Use natural language instructions** - Generate an image definition file by describing the development environment you want.

> [!NOTE]
> The agentic workflow supports only Dev Box primitive tasks, including WinGet, PowerShell, and Git-Clone.

### Generate the image definition file

1. Open Visual Studio Code.

1. Install the Dev Box extension.

   Open Extensions (Ctrl+Shift+X), search for **Dev Box**, and install the extension.
   
   :::image type="content" source="media/how-to-configure-team-customizations/dev-box-extension.png" alt-text="Screenshot of the Extensions pane in Visual Studio Code, showing the Dev Box extension.":::

1. Install the [GitHub Copilot extension set up in VS Code](https://code.visualstudio.com/docs/copilot/setup).

1. Make sure agent mode is enabled by setting [chat.agent.enabled](vscode://settings/chat.agent.enabled) in the [Settings editor](https://code.visualstudio.com/docs/getstarted/personalize-vscode#_configure-settings). This setting requires Visual Studio Code 1.99 or later.

1. Open Copilot Chat in VS Code.

   - Make sure **Dev Box tools** are preselected under **Select tools.**

     :::image type="content" source="media/how-to-configure-team-customizations/dev-box-extension-tools.png" alt-text="Screenshot of the Copilot Chat pane in Visual Studio Code, showing Dev Box tools preselected.":::
     

     :::image type="content" source="media/how-to-configure-team-customizations/dev-box-extension-tools-list.png" alt-text="Screenshot of the Copilot Chat interface in Visual Studio Code.":::

   - Select **Agent Mode**, and choose the model: **Claude 3.5 Sonnet**.

     :::image type="content" source="media/how-to-configure-team-customizations/dev-box-extension-select-agent.png" alt-text="Screenshot of the Agent Mode selection in Copilot Chat, showing the Claude 3.5 Sonnet model.":::

1. **Provide natural language prompts**, such as:

   - *"I want to set up a dev box with all the tools and packages required to work on this [repo name] repo."*

   - *"I want to preinstall Visual Studio 2022 Enterprise, Visual Studio Code, Git, .NET SDK 8, Node.js LTS, and Docker Desktop on a dev box, and have the team's repo [URL] cloned onto the dev box."*

   - *"I want to set up a dev box with all the dev tools and packages installed on my current machine."*

   > [!TIP]
   > Clone and open the specific repo in Visual Studio Code if you want to generate the definition in the context of a repository.

1. Follow the prompts to configure packages.

   - When prompted, select **Continue** to continue with package setup.

   - Copilot generates the *imagedefinition.yaml* file.

1. Refine with more prompts.

   - Continue interacting with the agent until the tools and packages you want appear in the file.


## [Visual Studio Code](#tab/vs-code)

Create and test image definition files by using Visual Studio Code. In addition to using the built-in tasks, use the Dev Box extension in Visual Studio Code to discover the custom tasks that are available through your dev center.

1. Create a dev box or use an existing dev box for testing.

1. On the test dev box, install Visual Studio Code, and then install the Dev Box extension.

1. Download an [example YAML image definition file](https://aka.ms/devcenter/preview/imaging/examples) from the samples repository, and open it in Visual Studio Code.

1. Discover the tasks that are available in the catalog by using the command palette: Select **View** > **Command Palette** > **Dev Box: List Available Tasks For This Dev Box**.

   
   :::image type="content" source="media/how-to-configure-team-customizations/dev-box-command-list-tasks.png" alt-text="Screenshot of the Visual Studio Code command palette with the Dev Box: List Available Tasks For This Dev Box option selected.":::
   

1. Test customization in Visual Studio Code by using the command palette: Select **View** > **Command Palette** > **Dev Box: Apply Customizations Tasks**.

   
   :::image type="content" source="media/how-to-configure-team-customizations/dev-box-command-apply-tasks.png" alt-text="Screenshot of the Visual Studio Code command palette with the Dev Box: Apply Customizations Tasks option selected.":::
   

1. The image definition file runs and applies the specified tasks to your test dev box. Inspect the changes and check the Visual Studio Code terminal for any errors or warnings generated during the task execution.

1. When the image definition file runs successfully, upload it to your catalog.

### Customize your dev box by using existing Desired State Configuration files

Desired State Configuration (DSC) is a management platform in PowerShell that lets you manage your development environment with configuration as code. Use DSC to define the desired state of your dev box, including software installations, configurations, and settings.

This example shows a dev box image definition file that calls an existing WinGet DSC file:

```yaml
tasks:
    - name: winget
      parameters:
          configure: "projectConfiguration.dsc.yaml"
```

Learn more in [WinGet configuration](https://aka.ms/winget-configuration).

---

## Upload the image definition file to a repository

You can use a GitHub or Azure Repos repository as a catalog to make your image definition file accessible from a dev box project. Each project can have a catalog that stores multiple image definition files, which you can configure on pools to align to your developers teams' needs.

Once you have an image definition file that you want to use, upload it to a catalog. The following sections show you how to attach your catalog to a project, and make your image definition available for selection when configuring your dev box pools.

## Configure image definitions at the project level

Projects help you manage Dev Box resources efficiently. You can assign each developer team its own project to organize resources effectively. Create multiple image definitions in your catalog repository, each in its own folder to target different developer teams under your project.

### Enable project-level catalogs

Enable project-level catalogs at the dev center level before you add a catalog to a project.
To enable project-level catalogs at the dev center level:

1. In the [Azure portal](https://portal.azure.com/), go to your dev center.
1. In the left menu, under **Settings**, select **Dev center settings**.
1. Under **Project level catalogs**, select **Enable catalogs per project**, and then select **Apply**.

   
   :::image type="content" source="media/how-to-configure-team-customizations/dev-center-settings-project-catalog.png" alt-text="Screenshot of the Dev center settings page with the Project level catalogs pane open and the Enable catalogs per project option selected.":::

For more information about how to add catalogs to projects, see [Add and configure a catalog from GitHub or Azure Repos](./how-to-configure-catalog.md).

### Configure catalog sync settings for the project

Set up your project to sync image definitions from the catalog. This setting lets you use the image definitions in the catalog to create dev box pools.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search box, enter *projects*. From the list of results, select **Projects**.
1. Open the Dev Box project where you want to set up catalog sync settings.
1. Select **Catalogs**.
1. Select **Sync settings**.
   
   :::image type="content" source="./media/how-to-configure-team-customizations/customizations-project-sync-settings-small.png" alt-text="Screenshot of the Catalogs pane in the Azure portal, with the button for sync settings highlighted.":::
 
1. On the **Sync settings** pane, select **Image definitions**, then select **Save**.
  
   :::image type="content" source="./media/how-to-configure-team-customizations/customizations-project-sync-image-definitions.png" alt-text="Screenshot of the sync settings pane in the Azure portal, with the checkbox for image definitions highlighted.":::   

### Attach the catalog that contains the image definition file

To use an image definition file, attach the catalog containing the file to your project. This makes the image definition available for selection when configuring your dev box pools.

The **Image definitions** pane shows the image definitions your project can use.

:::image type="content" source="media/how-to-configure-team-customizations/team-customizations-image-definitions-small.png" alt-text="Screenshot of the Azure portal pane showing image definitions available for a project.":::

To learn how to attach catalogs, see [Add and configure a catalog from GitHub or Azure Repos](./how-to-configure-catalog.md).

## Configure a dev box pool to use an image definition

Let your development team use customizations by setting up a dev box pool with an image definition file. Store the image definition file in a repository linked to your project as a catalog. Specify this file as the image definition for the pool, and the customizations apply to new dev boxes.

Follow these steps to create a dev box pool and specify an image definition:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search box, enter **projects**. In the list of results, select **Projects**.
1. Open the Dev Box project with which you want to associate the new dev box pool.
1. Select **Dev box pools**, and then select **Create**.
1. On the **Create a dev box pool** pane, enter the following values:

   | Setting | Value |
   |---|---|
   | **Name** | Enter a name for the pool. The pool name is visible to developers when they create dev boxes. It must be unique within a project. |
   | **Definition** | This box lists image definitions from accessible catalogs and dev box definitions. Select an image definition file. |
   | **Network connection** | Select **Deploy to a Microsoft hosted network** or use an existing network connection. |
   |**Enable single sign-on** | Select **Yes** to let single sign-on for the dev boxes in this pool. Single sign-on needs to be set up for the organization. For more information, see [Enable single sign-on for dev boxes](https://aka.ms/dev-box/single-sign-on). |
   | **Dev box Creator Privileges** | Select **Local Administrator** or **Standard User**. |
   | **Enable Auto-stop** | **Yes** is the default. Select **No** to turn off the autostop schedule. You can set up an autostop schedule after the pool is created. |
   | **Stop time** | Select a time to stop all the dev boxes in the pool. |
   | **Time zone** | Select the time zone for the stop time. |
   | **Licensing** | Select this checkbox to confirm that your organization has Azure Hybrid Benefit licenses to apply to the dev boxes in this pool. |

   :::image type="content" source="./media/how-to-configure-team-customizations/pool-specify-image-definition.png" alt-text="Screenshot of the pane for creating a dev box pool." lightbox="./media/how-to-configure-team-customizations/pool-specify-image-definition.png":::
   
1. Select **Create**.
1. Check that the new dev box pool appears in the list. You might need to refresh the screen.

## Create a dev box using the developer portal

To check that customizations from the image definition file are applied, create a dev box in the Dev Box developer portal. Follow the steps in [Quickstart: Create and connect to a dev box by using the Dev Box developer portal](quickstart-create-dev-box.md). Then connect to the new dev box and check that the customizations work as you expect.

Make changes to the image definition file and create a new dev box to test them. When you're sure the customizations are correct, build a reusable image.

[!INCLUDE [customizations-modular-scripts](includes/customizations-modular-scripts.md)]

## Next step

Now that you have an image definition file that configures and creates dev boxes for your development team, learn how to optimize dev box creation time with dev center imaging.

> [!div class="nextstepaction"]
> [Configure dev center imaging](how-to-configure-dev-center-imaging.md)
