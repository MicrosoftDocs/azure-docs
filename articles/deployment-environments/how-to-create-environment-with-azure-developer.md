---
title: Create and access an environment by using the Azure Developer CLI
titleSuffix: Azure Deployment Environments
description: Learn how to create an environment in an Azure Deployment Environments project by using the Azure Developer CLI.
author: RoseHJM
ms.author: rosemalcolm
ms.service: deployment-environments
ms.custom: ignite-2023
ms.topic: how-to
ms.date: 10/26/2023
---

# Create an environment by using the Azure Developer CLI

In this article, you install the Azure Developer CLI, sign into azd to create a new deployment environment and deploy your app code onto the provisioned deployment environment.

Azure Developer CLI (AZD) is an open-source tool that accelerates the time it takes for you to get your application from local development environment to Azure. AZD provides best practice, developer-friendly commands that map to key stages in your workflow, whether you’re working in the terminal, your editor or integrated development environment (IDE), or CI/CD (continuous integration/continuous deployment).

## Prerequisites

Verify your configuration meets the following prerequisites to work with Azure Deployment Environments using AZD:

- [Created and configured a dev center](/azure/deployment-environments/quickstart-create-and-configure-devcenter) with a project, and environment types.
- A catalog containing IaC templates, attached to your dev center.

## Prepare to work with AZD 

When you work with AZD for the first time, there are some one-time setup tasks you need to complete. These tasks include installing the Azure Developer CLI, signing in to your Azure account, and enabling AZD support for Azure Deployment Environments.

### Install the Azure Developer CLI extension for Visual Studio Code

To enable Azure Developer CLI features in Visual Code, install the Azure Developer CLI extension. Select the **Extensions** icon in the Activity bar, search for **Azure Developer CLI**, and then select **Install**.

:::image type="content" source="media/how-to-create-environment-with-azd/install-azure-developer-cli-small.png" alt-text="Screenshot of Visual Studio Code, showing the Sign in command in the command palette." lightbox="media/how-to-create-environment-with-azd/install-azure-developer-cli-large.png":::

### Sign in with Azure Developer CLI

Sign in to AZD using the command palette:

:::image type="content" source="media/how-to-create-environment-with-azd/azure-developer-sign-in.png" alt-text="Screenshot of Visual Studio Code, showing the Extensions pane with the Azure Developer CLI and Install highlighted." lightbox="media/how-to-create-environment-with-azd/azure-developer-sign-in.png":::

The output of commands issued from the command palette is displayed in an **azd dev** terminal like the following example:

:::image type="content" source="media/how-to-create-environment-with-azd/press-any-key.png" alt-text="Screenshot of the azd dev terminal, showing the press any key to close message." lightbox="media/how-to-create-environment-with-azd/press-any-key.png":::

### Enable AZD support for ADE

You can configure AZD to provision and deploy resources to your deployment environments using standard commands such as `azd up` or `azd provision`. When `platform.type` is set to `devcenter`, all AZD remote environment state and provisioning uses dev center components. AZD uses one of the infrastructure templates defined in your dev center catalog for resource provisioning. In this configuration, the infra folder in your local templates isn’t used. 

:::image type="content" source="media/how-to-create-environment-with-azd/azure-developer-enable-support.png" alt-text="Screenshot of Visual Studio Code, showing the Enable support command in the command palette." lightbox="media/how-to-create-environment-with-azd/azure-developer-enable-support.png":::

## Create an environment

Now you're ready to create an environment to work in. You can begin with code in a local folder, or you can clone an existing repository. In this example, you create an environment by using code in a local folder. 

### List existing environments

Check to see if you have any existing environments.

In Explorer, right-click **azure.yaml**, and then select **Azure Developer CLI (azd)** > **View Local and Remote Environments (env list)**.

:::image type="content" source="media/how-to-create-environment-with-azd/azure-developer-menu-environment-list.png" alt-text="Screenshot of Visual Studio Code with azure.yaml highlighted, and the AZD context menu with Azure Developer CLI and View Local and Remote environments highlighted." lightbox="media/how-to-create-environment-with-azd/azure-developer-menu-environment-list.png":::

You're prompted to select a dev center, a project, and environment definition.

### Create a new environment

Create a new environment to work in.

1. In Explorer, right-click **azure.yaml**, and then select **Azure Developer CLI (azd)** > **Create environment (env list)**.

   :::image type="content" source="media/how-to-create-environment-with-azd/azure-developer-menu-environment-new.png" alt-text="Screenshot of Visual Studio Code with azure.yaml highlighted, and the AZD context menu with Azure Developer CLI and Create new environment highlighted." lightbox="media/how-to-create-environment-with-azd/azure-developer-menu-environment-new.png":::

2. Enter a name for your environment.

### Verify new environment

Verify that your new environment is created by selecting View Local and Remote Environments as described in [List existing environments](#list-existing-environments).

### Select a default environment

If you have more than one environment, you can specify the default environment to be the focus of AZD commands.

In Explorer, right-click **azure.yaml**, and then select **Azure Developer CLI (azd)** > **Select default environment (env select)**.

:::image type="content" source="media/how-to-create-environment-with-azd/azure-developer-menu-environment-select-default.png" alt-text="Screenshot of Visual Studio Code with azure.yaml highlighted, and the AZD context menu with Azure Developer CLI and Select default environment highlighted." lightbox="media/how-to-create-environment-with-azd/azure-developer-menu-environment-select-default.png":::

### Provision to Azure

When you're ready, you can provision your local environment to a remote Azure Deployment Environments environment in Azure.

In Explorer, right-click **azure.yaml**, and then select **Azure Developer CLI (azd)** > **Provision Azure Resources (provision)**.

:::image type="content" source="media/how-to-create-environment-with-azd/azure-developer-menu-environment-provision.png" alt-text="Screenshot of Visual Studio Code with azure.yaml highlighted, and the AZD context menu with Azure Developer CLI and Provision environment highlighted." lightbox="media/how-to-create-environment-with-azd/azure-developer-menu-environment-provision.png":::

## Clean up resources

When you're finished with your environment, you can delete the Azure resources.

In Explorer, right-click **azure.yaml**, and then select **Azure Developer CLI (azd)** > **Delete Deployment and Resources (down)**.

:::image type="content" source="media/how-to-create-environment-with-azd/azure-developer-menu-environment-down.png" alt-text="Screenshot of Visual Studio Code with azure.yaml highlighted, and the AZD context menu with Azure Developer CLI and Delete Deployment and Resources (down) highlighted." lightbox="media/how-to-create-environment-with-azd/azure-developer-menu-environment-down.png":::

Confirm that you want to delete the environment by entering `y` when prompted.

## Related content
- [Create and configure a dev center](/azure/deployment-environments/quickstart-create-and-configure-devcenter)
- [What is the Azure Developer CLI?](/azure/developer/azure-developer-cli/overview)
- [Install or update the Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd)