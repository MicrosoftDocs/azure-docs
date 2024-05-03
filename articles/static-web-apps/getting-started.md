---
title: "Quickstart: Building your first static site with the Azure Static Web Apps"
description: Learn to deploy a static site to Azure Static Web Apps.
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic: quickstart
ms.date: 04/02/2024
ms.author: cshoe
ms.custom: mode-other
---

# Quickstart: Build your first static site with Azure Static Web Apps

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

## Install Azure Static Web Apps extension

If you don't already have the [Azure Static Web Apps extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) extension, you can install it in Visual Studio Code.

1. Select **View** > **Extensions**.
1. In the **Search Extensions in Marketplace**, type **Azure Static Web Apps**.
1. Select **Install** for **Azure Static Web Apps**.

## Create a static web app

1. Inside Visual Studio Code, select the Azure logo in the Activity Bar to open the Azure extensions window.

    :::image type="content" source="media/getting-started/extension-azure-logo.png" alt-text="Azure Logo":::

    > [!NOTE]
    > You are required to sign in to Azure and GitHub in Visual Studio Code to continue. If you are not already authenticated, the extension prompts you to sign in to both services during the creation process.

1. Select <kbd>F1</kbd> to open the Visual Studio Code command palette.

1. Enter **Create static web app** in the command box.

1. Select *Azure Static Web Apps: Create static web app...*.

1. Select your Azure subscription.

1. Enter **my-first-static-web-app** for the application name.

1. Select the region closest to you.

1. Enter the settings values that match your framework choice.

    # [No Framework](#tab/vanilla-javascript)

    | Setting | Value |
    | --- | --- |
    | Framework | Select **Custom** |
    | Location of application code | Enter `/src` |
    | Build location | Enter `/src` |

    # [Angular](#tab/angular)

    | Setting | Value |
    | --- | --- |
    | Framework | Select **Angular** |
    | Location of application code | Enter `/` |
    | Build location | Enter `dist/angular-basic` |

    # [Blazor](#tab/blazor)

    | Setting | Value |
    | --- | --- |
    | Framework | Select **Blazor** |
    | Location of application code | Enter `Client` |
    | Build location | Enter `wwwroot` |

    # [React](#tab/react)

    | Setting | Value |
    | --- | --- |
    | Framework | Select **React** |
    | Location of application code | Enter `/` |
    | Build location | Enter `build` |

    # [Vue](#tab/vue)

    | Setting | Value |
    | --- | --- |
    | Framework | Select **Vue.js** |
    | Location of application code | Enter `/` |
    | Build location | Enter `dist` |

    ---

1. Once the app is created, a confirmation notification is shown in Visual Studio Code.

    :::image type="content" source="media/getting-started/extension-confirmation.png" alt-text="Created confirmation":::

    If GitHub presents you with a button labeled **Enable Actions on this repository**, select the button to allow the build action to run on your repository.

    As the deployment is in progress, the Visual Studio Code extension reports the build status to you.

    :::image type="content" source="media/getting-started/extension-waiting-for-deployment.png" alt-text="Waiting for deployment":::

    Once the deployment is complete, you can navigate directly to your website.

1. To view the website in the browser, right-click the project in the Static Web Apps extension, and select **Browse Site**.

    :::image type="content" source="media/getting-started/extension-browse-site.png" alt-text="Browse site":::

## Clean up resources

If you're not going to continue to use this application, you can delete the Azure Static Web Apps instance through the extension.

In the Visual Studio Code Azure window, return to the _Resources_ section and under _Static Web Apps_, right-click **my-first-static-web-app** and select **Delete**.

## Next steps

> [!div class="nextstepaction"]
> [Add an API](add-api.md)
