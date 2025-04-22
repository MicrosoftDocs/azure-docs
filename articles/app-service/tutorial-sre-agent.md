---
title: 'Tutorial: Troubleshoot with SRE Agent on Azure App Service'
description: Learn how to use SRE Agent and Azure App Service to identify and fix app issues with AI-assisted troubleshooting.
author: msangapu-msft
ms.author: msangapu
ms.topic: tutorial
ms.custom: devx-track-azurecli
ms.date: 04/22/2025
---

# Tutorial: Troubleshoot an App Service app using SRE Agent

This tutorial shows how to deploy a broken web app to Azure App Service, create an Agent Space, and use its AI-assisted capabilities to troubleshoot and fix application issues. You'll use the Azure Developer CLI (azd) to provision and deploy resources, simulate a bug, and use Agent Space to diagnose and resolve the error.

> [!div class="checklist"]
> * Deploy a sample broken app using azd
> * Set up Agent Space and link the resource group
> * Use AI-driven prompts to troubleshoot and fix errors

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

## Prerequisites

To complete this tutorial, you need:

- [Azure subscription](https://azure.microsoft.com/free/)
- [Azure CLI installed](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli)
- [Azure Developer CLI (azd) installed](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/install-azd)
- Git installed

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

## Create Azure resources

### Clone and deploy the app

Clone a broken app sample:

```bash
git clone https://github.com/Azure-Samples/broken-python-webapp.git
cd broken-python-webapp
```

Initialize the environment and project:

```bash
azd init --template . --environment brokenapp-env
```

Provision and deploy the app:

```bash
azd up
```

### Create Agent Space

1. Go to the [Azure Portal](https://portal.azure.com)
2. Search for **Agent Space** and select **+ Create**
3. Choose a name, region, and link the same resource group created by `azd`
4. Complete the creation

## Troubleshoot the broken app

### Verify the app is running

Browse to your app’s URL from the `azd` output. You should see the app loading or returning an error.

### Simulate a broken state

In the Azure Portal:

1. Go to your App Service
2. Select **Configuration > Application settings**
3. Remove a key like `APP_MODE` or alter it to trigger a runtime error
4. Save and restart the app

### Use Agent Space to identify and fix the issue

Open your Agent Space and begin chatting:

#### Prompt to identify the issue:

> "My App Service app in resource group `brokenapp-env-rg` is returning a 500 error. Can you help me figure out why?"

#### Prompt to confirm recent change:

> "I recently removed the `APP_MODE` setting. Could this be causing the issue?"

Agent Space will analyze logs, configurations, and suggest a fix.

### Apply the fix

Restore the environment variable in App Service or make the recommended code change, then redeploy:

```bash
azd deploy
```

## Verify the fix

- Browse to your app again
- Confirm the 500 error is resolved
- Repeat the steps that caused the issue to verify it's fixed

## Clean up resources

To remove all created resources:

```bash
azd down
```

## Next steps

* [Overview of Azure App Service](overview.md)
* [Use Azure Developer CLI for modern app development](https://learn.microsoft.com/azure/developer/azure-developer-cli/overview)
* [Agent Space documentation](https://learn.microsoft.com/azure/agent-space/overview)

