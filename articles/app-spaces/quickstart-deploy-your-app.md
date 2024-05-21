---
title: Deploy your app with App Spaces
description: Learn how to deploy your app with App Spaces in the Azure portal.
ms.author: msangapu
author: msangapu-msft
ms.service: app-spaces
ms.topic: quickstart
ms.date: 05/20/2024
---

# Quickstart: Deploy your app with App Spaces

In this quickstart, you learn to connect to GitHub and deploy your code to a recommended Azure service with App Spaces. For more information, see [App Spaces overview](overview.md).

[!include [component types](./includes/component-types-table.md)]

## Prerequisites

To deploy your repository to App Spaces, you must have the following items:

- [Azure account and subscription](https://signup.azure.com/)
- [GitHub repository](https://docs.github.com/repositories/creating-and-managing-repositories/creating-a-new-repository). If you don't have your own repository, see [Deploy an App Spaces sample app](quickstart-deploy-starter-app.md).
- Write access to your chosen GitHub repository to deploy with GitHub Actions.

## Select your app

Follow these steps to deploy your app from a GitHub repository:

1. Browse to [https://portal.azure.com/#view/Microsoft_Azure_PaasServerless/StarshotCreate.ReactView](https://portal.azure.com/#view/Microsoft_Azure_PaasServerless/StarshotCreate.ReactView).

## Connect to GitHub to import your repository

1. Enter the following values in the *Connect to GitHub to import your repository* section.


#### [App Component (Backend)](#tab/backend/)
    | Setting | Action |
    |---|---|
    | GitHub account | Select your GitHub account. |
    | Organization | Select your organization. |
    | Repository | Select your GitHub code repository. If you can't find your repository, you may need to [enable other permissions on GitHub](https://docs.github.com/get-started/learning-about-github/access-permissions-on-github). |
    | Branch | Select your GitHub branch. |
    | App location | Enter the location of your code in your GitHub repository. Use `/` for the root directory. |
    | Listening port | Enter the location of your code in your GitHub repository. Use `/` for the root directory. |
    | Startup command (optional) | Under *Advanced configurations* enter a **Startup command**.|
#### [Static App Component (Frontend)](#tab/frontend/)
    | Setting | Action |
    |---|---|
    | GitHub account | Select your GitHub account. |
    | Organization | Select your organization. |
    | Repository | Select your GitHub code repository. If you can't find your repository, you may need to [enable other permissions on GitHub](https://docs.github.com/get-started/learning-about-github/access-permissions-on-github). |
    | Branch | Select your GitHub branch. |
    | App location | Enter the location of your code in your GitHub repository. Use `/` for the root directory. |
    | Startup command | Under *Advanced configurations* enter a **Startup command**.|

* * *

## Configure app details

1. Enter the following values in the *Configure app details* section.

    | Setting | Action |
    |---|---|
    | App Space name | Enter `myCustomAppSpace`. |
    | Subscription | Select your subscription. |
    | Region | Select your region. |

1. Select **Deploy** button at the bottom of the *Deploy App Space* page.

The deployment can take a few minutes to complete. During deployment, App Spaces uses GitHub actions to deploy to an Azure service based on the code in the repository. The Azure service is either a Container App (App component) or a Static Web App (Static app component). Go to your app's **Deployment** tab to see your code deployment logs.

#### [App Component (Backend)](#tab/backend/)
[!include [deployment note](./includes/provisioning-text-aca.md)]
#### [Static App Component (Frontend)](#tab/frontend/)
[!include [deployment note](./includes/provisioning-text-swa.md)]
* * *

## Clean up resources
[!include [deployment note](./includes/clean-up-resources.md)]

## Related content

- [App Spaces overview](overview.md)
- [Deploy an App Spaces template](quickstart-deploy-starter-app.md)
