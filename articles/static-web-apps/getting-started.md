---
title: "Quickstart: Building your first static site with the Azure Static Web Apps"
description: Learn to deploy a static site to Azure Static Web Apps.
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  quickstart
ms.date: 08/13/2020
ms.author: cshoe
---

# Quickstart: Building your first static site with Azure Static Web Apps

Azure Static Web Apps publishes a website to a production environment by building apps from a GitHub repository. In this quickstart, you deploy a web application to Azure Static Web apps using the Visual Studio Code extension.

If you don't have an Azure subscription, [create a free trial account](https://azure.microsoft.com/free).

## Prerequisites

- [GitHub](https://github.com) account
- [Azure](https://portal.azure.com) account
- [Visual Studio Code](https://code.visualstudio.com)
- [Azure Static Web Apps extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps)
- [Install Git](https://www.git-scm.com/downloads)

[!INCLUDE [create repository from template](../../includes/static-web-apps-get-started-create-repo.md)]

[!INCLUDE [clone the repository](../../includes/static-web-apps-get-started-clone-repo.md)]

Next, open Visual Studio Code and go to **File > Open Folder** to open the repository you just cloned to your machine in the editor.

## Create a static web app

1. Inside Visual Studio Code, select the Azure logo in the Activity Bar to open the Azure extensions window.

    :::image type="content" source="media/getting-started/extension-azure-logo.png" alt-text="Azure Logo":::

    > [!NOTE]
    > Azure and GitHub sign in are required. If you are not already signed in to Azure and GitHub from Visual Studio Code, the extension will prompt you to sign in to both during the creation process.

1. Place your mouse over the _Static Web Apps_ label and select the **plus sign**.

    :::image type="content" source="media/getting-started/extension-create-button.png" alt-text="Application name":::

1. The command palate opens at the top of the editor and prompts you to name your application.

    Type **my-first-static-web-app** and press **Enter**.

    :::image type="content" source="media/getting-started/extension-create-app.png" alt-text="Create Static Web App":::

1. Select the **main** branch and press **Enter**.

    :::image type="content" source="media/getting-started/extension-branch.png" alt-text="Branch name":::

1. Select **/** as the location for the application code and press **Enter**.

    :::image type="content" source="media/getting-started/extension-app-location.png" alt-text="Application code location":::

1. The extension is looking for the location of the API in your application. This article doesn't implement an API.

    Select **Skip for now** and press **Enter**.

    :::image type="content" source="media/getting-started/extension-api-location.png" alt-text="API location":::

1. Select the location where files are built for production in your app.

    # [No Framework](#tab/vanilla-javascript)

    Clear the box and press **Enter**.

    :::image type="content" source="media/getting-started/extension-artifact-no-framework.png" alt-text="App files path":::

    # [Angular](#tab/angular)

    Type **dist/angular-basic** and press **Enter**.

    :::image type="content" source="media/getting-started/extension-artifact-angular.png" alt-text="Angular app files path":::

    # [React](#tab/react)

    Type **build** and press **Enter**.

    :::image type="content" source="media/getting-started/extension-artifact-react.png" alt-text="React app files path":::

    # [Vue](#tab/vue)

    Type **dist** and press **Enter**.

    :::image type="content" source="media/getting-started/extension-artifact-vue.png" alt-text="Vue app files path":::

    ---

1. Select a location nearest you and press **Enter**.

    :::image type="content" source="media/getting-started/extension-location.png" alt-text="Resource location":::

1. Once the app is created, a confirmation notification is shown in Visual Studio Code.

    :::image type="content" source="media/getting-started/extension-confirmation.png" alt-text="Created confirmation":::

1. In the Visual Studio Code Explorer window, navigate to the node that has your subscription name and expand it. Please note that it might take a few minutes for the deployment to complete. Then return to the Static Web Apps section and select the name of your app and then right-click on my-first-static-web-app and select Open in Portal to view app in the Azure portal.

    :::image type="content" source="media/getting-started/extension-open-in-portal.png" alt-text="Open portal":::

[!INCLUDE [view website](../../includes/static-web-apps-get-started-view-website.md)]

## Clean up resources

If you're not going to continue to use this application, you can delete the Azure Static Web Apps instance through the extension.

In the Visual Studio Code Explorer window, return to the _Static Web Apps_ section and right-click on **my-first-static-web-app** and select **Delete**.

:::image type="content" source="media/getting-started/extension-delete.png" alt-text="Delete app":::

## Next steps

> [!div class="nextstepaction"]
> [Add an API](add-api.md)
