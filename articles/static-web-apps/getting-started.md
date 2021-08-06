---
title: "Quickstart: Building your first static site with the Azure Static Web Apps"
description: Learn to deploy a static site to Azure Static Web Apps.
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  quickstart
ms.date: 06/16/2021
ms.author: cshoe
---

# Quickstart: Building your first static site with Azure Static Web Apps

Azure Static Web Apps publishes a website by building an app from a code repository. In this quickstart, you deploy an application to Azure Static Web apps using the Visual Studio Code extension.

If you don't have an Azure subscription, [create a free trial account](https://azure.microsoft.com/free).

## Prerequisites

- [GitHub](https://github.com) account
- [Azure](https://portal.azure.com) account
- [Visual Studio Code](https://code.visualstudio.com)
- [Azure Static Web Apps extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps)
- [Install Git](https://www.git-scm.com/downloads)

[!INCLUDE [create repository from template](../../includes/static-web-apps-get-started-create-repo.md)]

[!INCLUDE [clone the repository](../../includes/static-web-apps-get-started-clone-repo.md)]

Next, open Visual Studio Code and go to **File > Open Folder** to open the cloned repository in the editor.

## Create a static web app

1. Inside Visual Studio Code, select the Azure logo in the Activity Bar to open the Azure extensions window.

    :::image type="content" source="media/getting-started/extension-azure-logo.png" alt-text="Azure Logo":::

    > [!NOTE]
    > You are required to sign in to Azure and GitHub in Visual Studio Code to continue. If you are not already authenticated, the extension will prompt you to sign in to both services during the creation process.

1. Under the _Static Web Apps_ label, select the **plus sign**.

    :::image type="content" source="media/getting-started/extension-create-button.png" alt-text="Application name":::

1. The command palette opens at the top of the editor and prompts you to select a subscription name.

    Select your subscription and press <kbd>Enter</kbd>.

    :::image type="content" source="media/getting-started/extension-subscription.png" alt-text="Select an Azure Subscription":::

1. Next, name your application.

    Type **my-first-static-web-app** and press <kbd>Enter</kbd>.

    :::image type="content" source="media/getting-started/extension-create-app.png" alt-text="Create Static Web App":::

1. Select the presets that match your application type.

    # [No Framework](#tab/vanilla-javascript)

    :::image type="content" source="media/getting-started/extension-presets-no-framework.png" alt-text="Application presets: No framework":::

    Enter **./src** as the location for the application files and press <kbd>Enter</kbd>.

    :::image type="content" source="media/getting-started/extension-build-location.png" alt-text="Application build output location":::

    Enter **./src** as the build output location and press <kbd>Enter</kbd>.

    # [Angular](#tab/angular)

    Although there is an Angular preset, select the **Custom** option so you can provide an appropriate output location for this application.

    :::image type="content" source="media/getting-started/extension-presets-no-framework.png" alt-text="Application presets: Angular":::

    Enter **./** as the location for the application files.

    :::image type="content" source="media/getting-started/extension-app-location.png" alt-text="Application files location: Angular":::

    Enter **dist/angular-basic** as the build output location.

    :::image type="content" source="media/getting-started/extension-angular.png" alt-text="Application build output location: Angular":::

    # [React](#tab/react)

    :::image type="content" source="media/getting-started/extension-presets-react.png" alt-text="Application presets: React":::

    # [Vue](#tab/vue)

    :::image type="content" source="media/getting-started/extension-presets-vue.png" alt-text="Application presets: Vue":::

    ---

1. Once the app is created, a confirmation notification is shown in Visual Studio Code.

    :::image type="content" source="media/getting-started/extension-confirmation.png" alt-text="Created confirmation":::

    As the deployment is in progress, the Visual Studio Code extension reports the build status to you.

    :::image type="content" source="media/getting-started/extension-waiting-for-deployment.png" alt-text="Waiting for deployment":::

    Once the deployment is complete, you can navigate directly to your website.

1. To view the website in the browser, right-click on the project in the Static Web Apps extension, and select **Browse Site**.

    :::image type="content" source="media/getting-started/extension-browse-site.png" alt-text="Browse site":::

## Clean up resources

If you're not going to continue to use this application, you can delete the Azure Static Web Apps instance through the extension.

In the Visual Studio Code Explorer window, return to the _Static Web Apps_ section and right-click on **my-first-static-web-app** and select **Delete**.

:::image type="content" source="media/getting-started/extension-delete.png" alt-text="Delete app":::

## Next steps

> [!div class="nextstepaction"]
> [Add an API](add-api.md)
