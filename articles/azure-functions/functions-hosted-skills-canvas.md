---
title: "Quickstart: Build and test a hosted skill with the Azure Functions hosted skills canvas"
description: "Use the Azure Functions hosted skills canvas in GitHub Copilot to create a local hosted skill, run it, inspect the result, and continue development."
ms.topic: quickstart
ms.date: 10/01/2026
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.collection:
  - ce-skilling-ai-copilot
ms.custom:
  - build-2026
#Customer intent: As a developer, I want to use an interactive canvas to create and test an Azure Functions hosted skill locally.
---

# Quickstart: Build and test a hosted skill with the Azure Functions hosted skills canvas

In this quickstart, you use the Azure Functions hosted skills canvas in GitHub Copilot to create a hosted skill that summarizes GitHub repository activity, run it locally, and inspect the result.
The canvas provides visible controls and results while GitHub Copilot helps you complete the workflow.

[!INCLUDE [functions-hosted-skills-preview](../../includes/functions-hosted-skills-preview.md)]

## Prerequisites

+ The standalone [GitHub Copilot app](https://docs.github.com/copilot/get-started/quickstart-copilot-app).
   >[!NOTE]
   >This app is separate from the GitHub Copilot extension for Visual Studio Code. For Copilot Business or Copilot Enterprise, your administrator must enable the GitHub Copilot app policy.
+ [Azure Functions Core Tools version 4](functions-run-local.md).
+ Node.js 22 or later. The canvas and Azure Functions Core Tools use Node.js.
+ [GitHub CLI](https://cli.github.com/).
+ Azurite.
+ Python 3.13 or later for the generated app, provided by either:
   + `uv` (recommended), which lets the canvas provision Python.
   + An existing Python 3.13 or later installation.
+ Access to at least one model in your GitHub Copilot app session.

## Install the plugin

Install the full Azure Functions Hosted Skills plugin. The plugin includes the canvas and the launcher skills that open it from chat.

1. Open the GitHub Copilot app, and then sign in to GitHub. If you're already signed in, continue to the next step.

1. In the model picker below the prompt box, confirm that at least one named model is available. The canvas discovers eligible models from your current session; it doesn't maintain a separate model list.

1. Select **Customize**, and then confirm that **Canvas** is available.

1. Select **Customize** > **Plugins**. Under **Available**, select **awesome-copilot** from the marketplace list, find **Azure Functions Hosted Skills**, and then select **+ Install**.

   If **awesome-copilot** isn't listed, select the settings icon. In **Source**, enter `github/awesome-copilot`, select **Add**, and then select **awesome-copilot** from the marketplace list.

1. Fully quit and reopen GitHub Copilot so that it loads the canvas and launcher skills.

## Open the canvas

For local testing, the canvas uses the GitHub CLI authentication for your currently signed-in account. You can run the sign-in command in any terminal on the same computer; the terminal isn't part of the GitHub Copilot app.

1. Open any local terminal, and then sign in to GitHub CLI:

   ```console
   gh auth login
   ```

1. In GitHub Copilot, start a new chat and enter this prompt:

   ```text
   Open Azure Functions Hosted Skills canvas
   ```

## Create and start the hosted skill

1. Select **Local Function App**.

1. Select **Start local function**.

   The canvas prepares an isolated Python environment, installs the app dependencies, and starts the local Functions host.

## Invoke the Timer skill

1. With the local Functions host running, select **Timer**.

1. Select **Invoke Trigger**.

1. In **Agent digest**, confirm that the hosted skill returned a repository activity summary.

1. Review **Trigger activity**, **Commands**, and **Local function host log** for the invocation status and execution details.

You now have a local Python Azure Functions app with a Timer-triggered hosted skill. The app files include `host.json` and at least one `.agent.md` file.

## Develop, deploy, or troubleshoot

From the canvas, choose the next step that matches what you want to do.

### [Open in VS Code](#tab/open-vs-code)

Select **Open in VS Code** to continue developing the generated app locally. You can edit the project files, add tools, or review the app configuration in Visual Studio Code.

### [Deploy to Azure](#tab/deploy-to-azure)

Select **Deploy to Azure** to deploy the hosted skill from an isolated copy by using the Azure Developer CLI (`azd`). This workflow also requires [Azure CLI](/cli/azure/install-azure-cli) authentication, an Azure subscription, a supported Azure-hosted model, and permission to create resources and assign roles. Azure resources can incur charges.

For the complete deployment workflow, see [Build an event-driven AI app with Azure Functions hosted skills](scenario-hosted-skills.md).

### [Doctor](#tab/doctor)

If you encounter a setup or startup issue, select **Doctor**, and then select **Run Doctor** to run the canvas's built-in readiness check. Follow the provided guidance to resolve any reported requirements. The check is read-only; it doesn't install software, sign you in, or change Azure resources.

---

## Clean up

Stop the local Functions host in the canvas. If you started Azurite manually, stop it by pressing Ctrl+C in its terminal. If you no longer need the sample, delete the generated app folder from your worktree. Review the folder first so that you don't delete changes that you want to keep.

## Related content

+ [Azure Functions hosted skills](functions-hosted-skills.md)
+ [Build an event-driven AI app with Azure Functions hosted skills](scenario-hosted-skills.md)
+ [Azure Functions hosted skills reference](functions-hosted-skills-reference.md)