---
title: Streamline Dev Box Customizations with AI-Powered Workflows
description: Use AI to automate Dev Box customizations. Generate YAML configurations with natural language prompts for consistent development environments.
#customer intent: As a Dev Center Admin or Project Admin, I want to understand how to use Dev Box customizations so that I can create efficient, ready-to-code configurations for my development teams.
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.custom:
  - ignite-2024
  - ai-gen-docs-bap
  - ai-gen-title
  - ai-seo-date:05/12/2025
  - ai-gen-description
  - build-2025
ms.topic: how-to
ms.date: 05/12/2025
---

# Use AI-powered workflows to generate Team Customizations (imagedefinition.yaml)

Dev Box supports an agentic workflow using GitHub Copilot agent mode to help generate the team customization file (imagedefinition.yaml) using natural language prompts. GitHub Copilot simplifies setting up your Dev Box environment by letting you describe your needs conversationally instead of manually creating YAML files.

## Supported scenarios

The Dev Box agentic workflow supports the following scenarios:

1. **Mimic your current development environment** - Generate or modify a definition that replicates the configuration of your current machine.

1. **Use repository context** - Create or modify a definition in the context of a specific GitHub repository.

1. **Natural language instructions** - Generate a customization file by describing the development environment you want.

> [!NOTE]
> The agentic workflow supports only Dev Box primitive tasks, including WinGet, PowerShell, and Git-Clone.

## Prerequisites

Before you start, ensure you install the following software:

- [Visual Studio Code](https://code.visualstudio.com/download) (latest version)

- [GitHub Copilot extension set up in VS Code](https://code.visualstudio.com/docs/copilot/setup)

## Steps to generate the team customization file (imagedefinition.yaml)

1. Open Visual Studio Code.

1. Install the Dev Box extension if it's not already installed.

   Open Extensions (Ctrl+Shift+X), search for **Dev Box**, and install the extension.

   :::image type="content" source="media/how-to-use-copilot-generate-image-definition-file/dev-box-extension.png" alt-text="Screenshot of the Extensions pane in Visual Studio Code, showing the Dev Box extension.":::

1. Make sure agent mode is enabled by setting [chat.agent.enabled](vscode://settings/chat.agent.enabled) in the [Settings editor](https://code.visualstudio.com/docs/getstarted/personalize-vscode#_configure-settings). This setting requires VS Code 1.99 or later.

1. Open Copilot Chat in VS Code.

   - Make sure **Dev Box tools** are preselected under "Select tools."

     :::image type="content" source="media/how-to-use-copilot-generate-image-definition-file/dev-box-extension-tools.png" alt-text="Screenshot of the Copilot Chat pane in Visual Studio Code, showing Dev Box tools preselected.":::

     :::image type="content" source="media/how-to-use-copilot-generate-image-definition-file/dev-box-extension-tools-list.png" alt-text="Screenshot of the Copilot Chat interface in Visual Studio Code.":::

   - Select **Agent Mode**, and choose the model: **Claude 3.5 Sonnet**.

     :::image type="content" source="media/how-to-use-copilot-generate-image-definition-file/dev-box-extension-select-agent.png" alt-text="Screenshot of the Agent Mode selection in Copilot Chat, showing the Claude 3.5 Sonnet model.":::

1. **Provide natural language prompts**, such as:

   - *"I want to configure a dev box with all the tools and packages required to work on this [repo name] repo."*

   - *"I want to preconfigure a dev box with Visual Studio 2022 Enterprise, VS Code, Git, .NET SDK 8, Node.js LTS, Docker Desktop installed, and have the team's repo [URL] cloned onto the dev box."*

   - *"I want to configure a dev box with all the dev tools and packages installed on my current machine."*

   > [!TIP]
   > Clone and open the specific repo in VS Code if you want to generate the definition in the context of a repository.

1. Follow the prompts to configure packages.

   - When prompted, select **Continue** to proceed with package configuration.

   - Copilot generates the imagedefinition.yaml file.

1. Refine with more prompts.

   - Continue interacting with the agent until the tools and packages you want are reflected in the file.

## Validating or Applying the Customizations

Perform these steps **within a Dev Box** instance.

1. Select **Continue** when prompted to proceed with validation, or provide the prompt to validate the imagedefinition.yaml.

   - Submit a prompt to the agent: *Validate my imagedefinition.yaml file.*

1. Apply customizations to the current Dev Box.

   - Open Command Palette (Ctrl+Shift+P).

   - Select **Apply Customization Tasks**.

   - Confirm the User Account Control (UAC) prompt to install tools and apply settings.

     :::image type="content" source="media/how-to-use-copilot-generate-image-definition-file/dev-box-extension-apply-customization-tasks.png" alt-text="Screenshot of the Apply Customization Tasks option in Visual Studio Code.":::

## Save and configure the project to use the image definition

After your imagedefinition.yaml is ready:

1. Save the file to a GitHub or Azure DevOps repository.

1. Attach the repository as a catalog to your project.

   - This step is necessary to make the imagedefinition.yaml available for use in your Dev Box pool.

   - For more information, see [Add and configure a catalog from GitHub or Azure Repos](../deployment-environments/how-to-configure-catalog.md).

1. Configure a Dev Box pool using the generated imagedefinition.yaml:

   - Go to **Dev Box Pools** in your project.

   - Create a new Dev Box pool or edit an existing one.

   - Select the image definition created from your imagedefinition.yaml.

   - For more information, see [Manage a dev box pool in Microsoft Dev Box](how-to-manage-dev-box-pools.md).

This method ensures that every Dev Box created from this pool uses the ready-to-code configuration.

This AI-powered workflow streamlines the process of setting up Dev Box customizations, letting platform engineers and dev managers create reusable, consistent environments with minimal effort.

## Related content

- [Dev Box customizations overview](concept-what-are-team-customizations.md)
- [Write an image definition file for Dev Box team customizations](how-to-write-image-definition-file.md)