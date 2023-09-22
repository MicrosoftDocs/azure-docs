---
title: Deploy a web app with Azure App Spaces
description: Learn how to deploy a web app with Azure App Spaces in the Azure portal.
ms.author: msangapu
author: msangapu-msft
ms.service: app-spaces
ms.topic: quickstart
ms.date: 05/22/2023
---

# Quickstart: Deploy a web app with Azure App Spaces

In this quickstart, you learn to connect to GitHub and deploy your code to a recommended Azure service with Azure App Spaces. For more information, see [Azure App Spaces overview](overview.md).

## Prerequisites

To deploy your repository to App Spaces, you must have the following items:

- [Azure account and subscription](https://signup.azure.com/)
- [GitHub repository](https://docs.github.com/repositories/creating-and-managing-repositories/creating-a-new-repository). If you don't have your own repository, see [Deploy an Azure App Spaces sample app](deploy-app-spaces-template.md).
- Write access to your chosen GitHub repository to deploy with GitHub Actions.

## Deploy your repo

Do the following steps to deploy an existing repository from GitHub. 

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Enter `App Spaces` in the search box, and then select **App Spaces**.
3. Choose **Start deploying**.
   
   :::image type="content" source="media/start-deploying.png" alt-text="Screenshot showing button, Start deploying, highlighted by red box.":::

4. Select an organization, repository, and branch from your GitHub account. If you can't find your repository, you may need to [enable other permissions on GitHub](https://docs.github.com/get-started/learning-about-github/access-permissions-on-github). 
   
   :::image type="content" source="media/connect-to-github.png" alt-text="Screenshot showing required selections to connect to GitHub.":::
   
   App Spaces analyzes this repository and suggests an Azure service based on the code that's contained within the repository.

5. Based on the framework or Azure service that App Spaces recommends, choose the appropriate tab for further instructions.

#### [App Services](#tab/app-service/)

6. Confirm the autoselected language,  and Azure service, as determined by the code in your repository, as well as the default plan. If you want to choose a different service or investigate other options, you can select from  **Choose another language**, **Choose another Azure service**, or **Compare plans**.
   
   :::image type="content" source="media/define-app-space-details-app-services-deployment.png" alt-text="Screenshot showing autoselected language, service, and plan in Define App Space details screen.":::

7. Enter a name for your App Space.
8. Select a **subscription** from the dropdown menu to associate with the deployed Azure resources, and then select the **region** that's closest to your users from the dropdown menu for optimal performance.
   
   :::image type="content" source="media/select-subscription-and-region-app-space.png" alt-text="Screenshot showing subscription and region selection menus for deployment to App Spaces.":::

9.  Select **Deploy App Space**.

   App Spaces loads the components of your deployment.

   :::image type="content" source="media/app-space-deployment-in-progress.png" alt-text="Screenshot showing deployment in progress.":::
   
#### [Container Apps](#tab/container-apps/)

6. Confirm the autoselected Azure service and plan, as determined by the code in your repository. If you want to choose a different service or investigate other options, you can select **Choose another Azure service**.
   
   :::image type="content" source="media/define-app-space-details-container-apps-deployment.png" alt-text="Screenshot showing autoselected language, service, and plan in Define App Space details screen.":::

7. Enter a name for your App Space, and then choose the **Dockerfile location** and **Container app environment** from the dropdown menus.

8. Select a **subscription** from the dropdown menu to associate with the deployed Azure resources, and then select the **region** that's closest to your users from the dropdown menu for optimal performance.
   
   :::image type="content" source="media/select-subscription-and-region-app-space.png" alt-text="Screenshot showing subscription and region selection menus for deployment to App Spaces.":::

9.  Select **Deploy App Space**.

#### [Static Web Apps](#tab/static-web-apps/)

6. Confirm the autoselected Azure service and plan, as determined by the code in your repository. If you want to choose a different service or investigate other options, you can select from **Choose another framework**, **Choose another Azure service**, or **Compare plans**.
   
   :::image type="content" source="media/define-app-space-details-static-web-apps-deployment.png" alt-text="Screenshot showing autoselected service, framework, and plan in Define App Space details screen.":::

7. Enter a name for your App Space.
8. Enter the following values to create a GitHub Actions workflow file for build and release, which you can modify later in your repository.
   - App location
   - API location
   - Output location

   :::image type="content" source="media/enter-values-for-github-actions-workflow-creation.png" alt-text="Screenshot showing. ":::

9. Select a **subscription** from the dropdown menu to associate with the deployed Azure resources, and then select the **region** that's closest to your users from the dropdown menu for optimal performance.
   
   :::image type="content" source="media/select-subscription-and-region-app-space.png" alt-text="Screenshot showing subscription and region selection menus for deployment to App Spaces.":::

10.  Select **Deploy App Space**.

* * *

Your web application code deploys to App Spaces.

Azure Apps uses GitHub Actions to deploy your GitHub repo to the Azure resource. Go to your app's **Deployment** tab to see your code deployment logs.

## Manage components

You can manage the components of your App Space from the Components menu, which provides information and options, based on the Azure service you're using to deploy your web application. Select the following tab associated with the Azure service.

#### [App Services](#tab/app-service/)

The following table shows the tabs you can select, which allow you to view information and perform tasks for your App Space. 

|Hosting tab  |Actions | 
|---------|---------|
|**App setting**     | Add an app setting. Enter `Name`, `Value`, and optionally check the box for `Deployment slot setting`. Select **Apply**.     |
|**Connection strings**    |Add a connection string. Enter `Name`, `Value`, select `Type` (MySQL, SQLServer, SQLAzure, PostgreSQL, or Custom), and optionally check the box for `Deployment slot setting`. Select **Apply**.         |
|**Deployment**    | View deployment name, status, and time for code deployment logs.       |

#### [Container Apps](#tab/container-apps/)

The following table shows the components tabs that you can select, which allow you to view information and perform tasks for your App Space.

|Hosting tab  |Actions | 
|---------|---------|
|**Secrets**     | Add a secret. Enter `Key` and `Value`, and then select **Apply**.  |
|**Container details**   | View container information, like name, image source, registry, and resource allocation.     |
|**Environment variables** | Add an environment variable. Enter `Name` and `Value` of manually entered or referenced secret, and then select **Apply**.        |
|**Log Stream**    | View logs.        |
|**Deployment**   |  View deployment name, status, and time for code deployment logs.|

The following image shows an example of the Hosting tab, Container details selection.

:::image type="content" source="media/hosting-container-details.png" alt-text="Screenshot showing Hosting tab with Container details selection.":::

In the Monitoring tab, you can view Log Analytics workspace information like the subscription and  resource group used for your App Space, and region.

#### [Static Web Apps](#tab/static-web-apps/)

The following table shows the components tabs that you can select, which allow you to view information and perform tasks for your App Space.

|Hosting tab  |Actions | 
|---------|---------|
|**Environments**   | View production and preview environment name, branch, last update time, and status.   |
| **Environment variables**  |Add an environment variable. Enter `Name` and `Value` , and then select **Apply**.    |
| **Backend & API**   |Bring your own API backends. Enter `Environment Name`, `Backend Type`, `Backend Resource Name`, and `Link`, and then select **Apply**.|
|**Deployment**     | View deployment name, status, and time for code deployment logs.      |


* * *

For more advanced configuration options, select **Go to advanced view**.

:::image type="content" source="media/select-go-to-advanced-view.png" alt-text="Screenshot showing red box around button, Go to advanced view for App Space.":::

You can also view the essentials for your Container Apps Environment and Managed Identities on the **Additional** tab. This view is hidden by default.

## Related articles

- [App Spaces overview](overview.md)
- [Deploy an App Spaces template](deploy-app-spaces-template.md)
