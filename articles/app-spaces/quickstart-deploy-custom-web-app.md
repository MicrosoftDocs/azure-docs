---
title: Deploy a web app with Azure App Spaces
description: Learn how to deploy a custom app with Azure App Spaces in the Azure portal.
ms.author: msangapu
author: msangapu-msft
ms.service: app-spaces
ms.topic: quickstart
ms.date: 05/20/2024
---

# Quickstart: Deploy a web app with Azure App Spaces

In this quickstart, you learn to connect to GitHub and deploy your code to a recommended Azure service with Azure App Spaces. For more information, see [Azure App Spaces overview](overview.md).

## Prerequisites

To deploy your repository to App Spaces, you must have the following items:

- [Azure account and subscription](https://signup.azure.com/)
- [GitHub repository](https://docs.github.com/repositories/creating-and-managing-repositories/creating-a-new-repository). If you don't have your own repository, see [Deploy an Azure App Spaces sample app](quickstart-deploy-sample-web-app-template.md).
- Write access to your chosen GitHub repository to deploy with GitHub Actions.

## Deploy your app

Follow these steps to deploy your app from a GitHub repository:

1. Browse to [https://portal.azure.com/#view/Microsoft_Azure_PaasServerless/StarshotTemplateGallery.ReactView](https://portal.azure.com/#view/Microsoft_Azure_PaasServerless/StarshotTemplateGallery.ReactView).

#### Connect to GitHub to import your repository

1. Enter the following values in the *Connect to GitHub to import your repository* section.

    | Setting | Action |
    |---|---|
    | GitHub account | Select your GitHub account. |
    | Organization | Select your organization. |
    | Repository | Select your GitHub code repository. If you can't find your repository, you may need to [enable other permissions on GitHub](https://docs.github.com/get-started/learning-about-github/access-permissions-on-github). |
    | Branch | Select your GitHub branch. |
    | App location | Enter the location of your code in your GitHub repository. Use `/` for the root directory. |
    | Startup command | Under *Advanced configurations* enter a **Startup command** or leave blank for none.|

#### Configure app details

1. Enter the following values in the *Configure app details* section.

    | Setting | Action |
    |---|---|
    | App Space name | Enter `myCustomAppSpace`. |
    | Subscription | Select your subscription. |
    | Region | Select your region. |

1. Select **Deploy** button at the bottom of the *Deploy App Space* page.

The application code deploys to App Spaces. The deployment can take a few minutes to complete. 


> [!NOTE]
> App Spaces analyzes this repository and chooses an Azure service based on the code in the repository. The Azure service can either be an Container App or a Static Web App.
>

#### [Container App](#tab/aca/)
[!include [deployment note](./includes/provisioning-note-aca.md)]
#### [Static Web App](#tab/swa/)
[!include [deployment note](./includes/provisioning-note-swa.md)]
* * *

Azure Apps uses GitHub Actions to deploy your GitHub repo to the Azure resource. Go to your app's **Deployment** tab to see your code deployment logs.

## Related articles

- [App Spaces overview](overview.md)
- [Deploy an App Spaces template](deploy-app-spaces-template.md)
