---
title: Deploy your app with App Spaces
description: App Spaces is an intelligent service that reduces the complexity of creating and managing web apps. Learn to deploy your app in the Azure portal.
ms.author: msangapu
author: msangapu-msft
ms.service: app-spaces
ms.topic: quickstart
ms.date: 05/20/2024
#customer intent: As a new cloud developer, I want to learn how to deploy my app into App Spaces.
---

# Quickstart: Deploy your app with App Spaces

[!include [preview note](./includes/preview-note.md)]

In this quickstart, you learn to connect to GitHub and deploy your code to a recommended Azure service with App Spaces. For more information, see [App Spaces overview](overview.md).

[!include [component types](./includes/component-types-table.md)]

## Prerequisites

To deploy your repository to App Spaces, you must have the following items:

- [Azure account and subscription](https://signup.azure.com/)
- [GitHub repository](https://docs.github.com/repositories/creating-and-managing-repositories/creating-a-new-repository). If you don't have your own repository, see [Deploy an App Spaces sample app](quickstart-deploy-starter-app.md).
- Write access to your chosen GitHub repository (for GitHub Actions).

## Select your app

Follow these steps to deploy your app from a GitHub repository:

1. Browse to the [Azure portal](https://portal.azure.com/).
1. In the search bar, search for **app spaces** and select it in the results.
:::image type="content" source="media/azure-portal-search-app-spaces.png" alt-text="Screenshot of App Space in Azure portal.":::
1. In the *App Spaces page*, select **+ Create App Space**.
1. In the *Create new App Space* page, under the *Deploy code from your GitHub repository* section, select **GitHub repository**.

## Connect to GitHub to import your repository

#### [App Component (back end)](#tab/backend/)
- Enter the following values in the *Connect to GitHub to import your repository* section.

| Setting | Action |
|---|---|
| GitHub account | Select your GitHub account. |
| Organization | Select your organization. |
| Repository | Select your GitHub code repository. If you can't find your repository, you need to [enable other permissions on GitHub](https://docs.github.com/get-started/learning-about-github/access-permissions-on-github).|
| Branch | Select your GitHub branch. |
| App location | Enter the location of your code in your GitHub repository. Use `/` for the root directory. |
| Listening port |Specify the port that your web server is listening on. External requests being made to port 80 or 443 get routed to this port internally for your application to server content from.|
| Startup command (optional) | Under *Advanced configurations*, enter a **Startup command**.|

#### [Static App Component (front end)](#tab/frontend/)
- Enter the following values in the *Connect to GitHub to import your repository* section.

| Setting | Action |
|---|---|
| GitHub account | Select your GitHub account. |
| Organization | Select your organization. |
| Repository | Select your GitHub code repository. If you can't find your repository, you may need to [enable other permissions on GitHub](https://docs.github.com/get-started/learning-about-github/access-permissions-on-github). |
| Branch | Select your GitHub branch. |
| App location | Enter the location of your code in your GitHub repository. Use `/` for the root directory. |
| Startup command | Under *Advanced configurations*, enter a **Startup command**.|

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

#### [App Component (back end)](#tab/backend/)
[!include [deployment note](./includes/provision-text-aca.md)]
#### [Static App Component (front end)](#tab/frontend/)
[!include [deployment note](./includes/provision-text-swa.md)]
* * *

## Clean up resources
[!include [deployment note](./includes/clean-up-resources.md)]

## Related content

- [App Spaces overview](overview.md)
- [Deploy an App Spaces starter app](quickstart-deploy-starter-app.md)
