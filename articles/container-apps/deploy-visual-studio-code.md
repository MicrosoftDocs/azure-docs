---
title: 'Deploy to Azure Container Apps using Visual Studio Code'
description: Deploy containerized .NET applications to Azure Container Apps using Visual Studio Code
services: container-apps
author: alexwolfmsft
ms.author: alexwolf
ms.service: container-apps
ms.topic: tutorial
ms.date: 10/29/2023
ms.custom: vscode-azure-extension-update-completed, devx-track-dotnet, devx-track-linux
---

# Quickstart: Deploy to Azure Container Apps using Visual Studio Code

Azure Container Apps enables you to run microservices and containerized applications on a serverless platform. With Container Apps, you enjoy the benefits of running containers while leaving behind the concerns of manually configuring cloud infrastructure and complex container orchestrators.

In this tutorial, you'll deploy a containerized application to Azure Container Apps using Visual Studio Code.

## Prerequisites

- An Azure account with an active subscription is required. If you don't already have one, you can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Visual Studio Code, available as a [free download](https://code.visualstudio.com/).
- The following Visual Studio Code extensions installed:
    - The [Azure Account extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-account)
    - The [Azure Container Apps extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurecontainerapps)
    - The [Docker extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker) 

## Clone the project

1. Open a new Visual Studio Code window.

1. Select <kbd>F1</kbd> to open the command palette.

1. Enter **Git: Clone** and press enter.

1. Enter the following URL to clone the sample project:

    ```git
    https://github.com/Azure-Samples/containerapps-albumapi-javascript.git
    ```

    > [!NOTE]
    > This tutorial uses a JavaScript project, but the steps are language agnostic.

1. Select a folder to clone the project into.

1. Select **Open** to open the project in Visual Studio Code.

## Sign in to Azure

1. Select <kbd>F1</kbd> to open the command palette.

1. Select **Azure: Sign In** and follow the prompts to authenticate.

1. Once signed in, return to Visual Studio Code.

## Create and deploy to Azure Container Apps

The Azure Container Apps extension for Visual Studio Code enables you to choose existing Container Apps resources, or create new ones to deploy your applications to. In this scenario, you create a new Container App environment and container app to host your application. After installing the Container Apps extension, you can access its features under the Azure control panel in Visual Studio Code.

1. Select <kbd>F1</kbd> to open the command palette and run the **Azure Container Apps: Deploy Project from Workspace** command.

1. Enter the following values as prompted by the extension.

    | Prompt | Value |
    |--|--|
    | Select subscription | Select the Azure subscription you want to use. |
    | Select a container apps environment | Select **Create new container apps environment**. You're only asked this question if you have existing Container Apps environments. |
    | Enter a name for the new container app resource(s) | Enter **my-container-app**. |
    | Select a location | Select an Azure region close to you. |
    | Would you like to save your deployment configuration? | Select **Save**. |

    The Azure activity log panel opens and displays the deployment progress. This process might take a few minutes to complete.

1. Once this process finishes, Visual Studio Code displays a notification. Select **Browse** to open the deployed app in a browser.

    In the browser's location bar, append the `/albums` path at the end of the app URL to view data from a sample API request.

Congratulations! You successfully created and deployed your first container app using Visual Studio code.

## Clean up resources

If you're not going to continue to use this application, you can delete the Azure Container Apps instance and all the associated services at once by removing the resource group.

Follow these steps in the Azure portal to remove the resources you created:

1. Select the **my-container-app** resource group from the *Overview* section.
1. Select the **Delete resource group** button at the top of the resource group *Overview*.
1. Enter the resource group name **my-container-app** in the *Are you sure you want to delete "my-container-apps"* confirmation dialog.
1. Select **Delete**.  
    The process to delete the resource group might take a few minutes to complete.

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next steps

> [!div class="nextstepaction"]
> [Environments in Azure Container Apps](environment.md)
