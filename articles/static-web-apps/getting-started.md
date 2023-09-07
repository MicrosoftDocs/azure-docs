---
title: "Quickstart: Building your first static site with the Azure Static Web Apps"
description: Learn to deploy a static site to Azure Static Web Apps.
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic: quickstart
ms.date: 08/10/2023
ms.author: cshoe
ms.custom: mode-other
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

## Install Azure Static Web Apps extension

If you don't already have the [Azure Static Web Apps extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) extension, you can install it in Visual Studio Code.

1. Select **View** > **Extensions**.
1. In the **Search Extensions in Marketplace**, type **Azure Static Web Apps**.
1. Select **Install** for **Azure Static Web Apps**.
2. The extension installs into Visual Studio Code.

## Create a static web app

1. Inside Visual Studio Code, select the Azure logo in the Activity Bar to open the Azure extensions window.

    :::image type="content" source="media/getting-started/extension-azure-logo.png" alt-text="Azure Logo":::

    > [!NOTE]
    > You are required to sign in to Azure and GitHub in Visual Studio Code to continue. If you are not already authenticated, the extension prompts you to sign in to both services during the creation process.

2. Select <kbd>F1</kbd> to open the Visual Studio Code command palette.

3. Enter **Create static web app** in the command box.

4. Select *Azure Static Web Apps: Create static web app...*.

    # [No Framework](#tab/vanilla-javascript)

    | Setting | Value |
    | --- | --- |
    | Name | Enter **my-first-static-web-app** |
    | Region | Select the region closest to you. |
    | Framework | Select **Custom**. |

    # [Angular](#tab/angular)

    | Setting | Value |
    | --- | --- |
    | Name | Enter **my-first-static-web-app** |
    | Region | Select the region closest to you. |
    | Framework | Select **Angular**. |

    # [Blazor](#tab/blazor)

    | Setting | Value |
    | --- | --- |
    | Name | Enter **my-first-static-web-app** |
    | Region | Select the region closest to you. |
    | Framework | Select **Blazor**. |

    # [React](#tab/react)

    | Setting | Value |
    | --- | --- |
    | Name | Enter **my-first-static-web-app** |
    | Region | Select the region closest to you. |
    | Framework | Select **React**. |

    # [Vue](#tab/vue)

    | Setting | Value |
    | --- | --- |
    | Name | Enter **my-first-static-web-app** |
    | Region | Select the region closest to you. |
    | Framework | Select **Vue.js**. |

    ---

5. Enter the settings values for that match your framework preset choice.

    # [No Framework](#tab/vanilla-javascript)

    | Setting | Value |
    | --- | --- |
    | Location of application code | Enter **/src** |
    | Build location | Enter **/src** |

    # [Angular](#tab/angular)

    | Setting | Value |
    | --- | --- |
    | Location of application code | Enter **/** |
    | Build location | Enter **dist/angular-basic** |

    # [Blazor](#tab/blazor)

    | Setting | Value |
    | --- | --- |
    | Location of application code | Enter **Client** |
    | Build location | Enter **wwwroot** |

    # [React](#tab/react)

    | Setting | Value |
    | --- | --- |
    | Location of application code | Enter **/** |
    | Build location | Enter **build** |

    # [Vue](#tab/vue)

    | Setting | Value |
    | --- | --- |
    | Location of application code | Enter **/** |
    | Build location | Enter **dist** |

    ---

6. Once the app is created, a confirmation notification is shown in Visual Studio Code.

    :::image type="content" source="media/getting-started/extension-confirmation.png" alt-text="Created confirmation":::

    As the deployment is in progress, the Visual Studio Code extension reports the build status to you.

    :::image type="content" source="media/getting-started/extension-waiting-for-deployment.png" alt-text="Waiting for deployment":::

    Once the deployment is complete, you can navigate directly to your website.

7. To view the website in the browser, right-click the project in the Static Web Apps extension, and select **Browse Site**.

    :::image type="content" source="media/getting-started/extension-browse-site.png" alt-text="Browse site":::

## Clean up resources

If you're not going to continue to use this application, you can delete the Azure Static Web Apps instance through the extension.

In the Visual Studio Code Azure window, return to the _Resources_ section and under _Static Web Apps_, right-click **my-first-static-web-app** and select **Delete**.

## Next steps

> [!div class="nextstepaction"]
> [Add an API](add-api.md)
