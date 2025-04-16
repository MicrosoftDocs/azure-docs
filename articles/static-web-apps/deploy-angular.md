---
title: 'Deploy an Angular app on Azure Static Web Apps'
description: Learn to deploy an Angular app in the Azure portal with Azure Static Web Apps.
services: static-web-apps
author: v1212
ms.service: azure-static-web-apps
ms.topic:  how-to
ms.date: 07/24/2024
ms.author: wujia
zone_pivot_groups: devops-or-github
---

# Deploy an Angular app on Azure Static Web Apps

In this article, you learn to deploy an Angular application to Azure Static Web Apps using the Azure portal.

## Prerequisites

[!INCLUDE [prerequisites](../../includes/static-web-apps/static-web-apps-tutorials-portal-prerequisites.md)]

## Create a repository

::: zone pivot="github"

This article uses a GitHub template repository to make it easy for you to get started. The template features a starter app to deploy to Azure Static Web Apps.

1. Navigate to the following location to create a new repository:

    [https://github.com/staticwebdev/angular-basic/generate](https://github.com/login?return_to=%2Fstaticwebdev%2Fangular-basic%2Fgenerate)

1. Name your repository **my-first-static-web-app**

1. Select **Create repository from template**.

    :::image type="content" source="media/getting-started/create-template.png" alt-text="Screenshot of create repository from template button.":::

::: zone-end

::: zone pivot="azure-devops"

This article uses an Azure DevOps repository to make it easy for you to get started. The repository features a starter app used to deploy using Azure Static Web Apps.

1. Sign in to Azure DevOps.
1. Select **New repository**.
1. In the *Create new project* window, expand the **Advanced** menu, and make the following selections:

    | Setting | Value |
    |--|--|
    | Project | Enter **my-first-web-static-app**. |
    | Visibility | Select **Private**. |
    | Version control | Select **Git**. |
    | Work item process | Select the option that best suits your development methods. |

1. Select **Create**.
1. Select the **Repos** menu item.
1. Select the **Files** menu item.
1. Under the *Import repository* card, select **Import**.
1. Copy a repository URL for the framework of your choice, and paste it into the *Clone URL* box.
  
    [https://github.com/staticwebdev/angular-basic.git](https://github.com/staticwebdev/angular-basic.git)

1. Select **Import** and wait for the import process to complete.

::: zone-end

## Create a static web app

[!INCLUDE [create steps](../../includes/static-web-apps/static-web-apps-tutorials-portal-create.md)]

In the _Build Details_ section, add configuration details specific to your preferred front-end framework.

1. Select **Angular** from the _Build Presets_ dropdown.

1. Keep the default value in the _App location_ box.

1. Leave the _Api location_ box empty.

1. Type **dist/angular-basic** in the _Output location_ box.

> [!NOTE]
> If you are using these instructions with your own code and Angular 17 or above, the output location value needs to end with **/browser**.

Select **Review + create**.

:::image type="content" source="media/getting-started-portal/review-create.png" alt-text="Screenshot of the create button.":::

::: zone pivot="github"

> [!NOTE]
> You can edit the [workflow file](build-configuration.md) to change these values after you create the app.

::: zone-end

Select **Create**.

:::image type="content" source="media/getting-started-portal/create-button.png" alt-text="Screenshot of the Create button.":::

Select **Go to resource**.

:::image type="content" source="media/getting-started-portal/resource-button.png" alt-text="Screenshot of the Go to Resource button.":::

## View the website

[!INCLUDE [view website](../../includes/static-web-apps/static-web-apps-tutorials-portal-view-website.md)]

## Clean up resources

[!INCLUDE [clean up](../../includes/static-web-apps/static-web-apps-tutorials-portal-clean-up.md)]

## Next steps

> [!div class="nextstepaction"]
> [Add an API to your application](./add-api.md?tabs=angular)
