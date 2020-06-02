---
title: "Tutorial: Publish a VuePress site to Azure Static Web Apps"
description: This tutorial shows you how to deploy a VuePress application to Azure Static Web Apps.
services: static-web-apps
author: aaronpowell
ms.service: static-web-apps
ms.topic: tutorial
ms.date: 05/08/2020
ms.author: aapowell
---

# Tutorial: Publish a VuePress site to Azure Static Web Apps Preview

This article demonstrates how to create and deploy a [VuePress](https://vuepress.vuejs.org/) web application to [Azure Azure Static Web Apps](overview.md). The final result is a new Azure Static Web Apps application with the associated GitHub Actions that give you control over how the app is built and published.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Create a VuePress app
> - Setup an Azure Static Web Apps
> - Deploy the VuePress app to Azure

## Prerequisites

- An Azure account with an active subscription. If you don't have one, you can [create an account for free](https://azure.microsoft.com/free/).
- A GitHub account. If you don't have one, you can [create an account for free](https://github.com/join).
- [Node.js](https://nodejs.org) installed.

## Create a VuePress App

Create a VuePress app from the Command Line Interface (CLI):

1. Create a new folder for the VuePress app.

   ```bash
   mkdir static-site
   ```

1. Add a _README.md_ file the folder.

   ```bash
   echo '# Hello From VuePress' > README.md
   ```

1. Initialize the _package.json_ file.

   ```bash
   npm init -y
   ```

1. Add VuePress as a `devDependency`.

   ```bash
   npm install --save-dev vuepress
   ```

1. Open the _package.json_ file in a text editor and add a build command to the [`scripts`](https://docs.npmjs.com/cli-commands/run-script.html) section.

   ```json
   ...
   "scripts": {
       "build": "vuepress build"
   }
   ...
   ```

1. Create a _.gitignore_ file to exclude the _node\_modules_ folder.

    ```bash
    echo 'node_modules' > .gitignore
    ```

1. Initialize a git repo.

   ```bash
    git init
    git add -A
    git commit -m "initial commit"
   ```

## Push your application to GitHub

You need a repository on GitHub to connect to Azure Static Web Apps. The following steps show you how to create a repository for your site.

1. Create a blank GitHub repo (don't create a README) from [https://github.com/new](https://github.com/new) named **vuepress-static-app**.

1. Add the GitHub repository as a remote to your local repo. Make sure to add your GitHub username in place of the `<YOUR_USER_NAME>` placeholder in the following command.

   ```bash
   git remote add origin https://github.com/<YOUR_USER_NAME>/vuepress-static-app
   ```

1. Push your local repo up to GitHub.

   ```bash
   git push --set-upstream origin master
   ```

## Deploy your web app

The following steps show you how to create a new Static Web Apps application and deploy it to a production environment.

### Create the application

1. Navigate to the [Azure portal](https://portal.azure.com)
1. Click **Create a Resource**
1. Search for **Static Web Apps**
1. Click **Static Web Apps (Preview)**
1. Click **Create**

   :::image type="content" source="./media/publish-vuepress/create-in-portal.png" alt-text="Create a Static Web Apps (Preview) in the portal":::

1. For **Subscription**, accept the subscription that is listed or select a new one from the drop-down list.

1. In _Resource group_, select **New**. In _New resource group name_, enter **vuepress-static-app** and select **OK**.

1. Next, a name for your app in the **Name** box. Valid characters include `a-z`, `A-Z`, `0-9` and `-`.

1. For _Region_, select an available region close to you.

1. For _SKU_, select **Free**.

   :::image type="content" source="./media/publish-vuepress/basic-app-details.png" alt-text="Details filled out":::

1. Click the **Sign in with GitHub** button.

1. Select the **Organization** under which you created the repo.

1. Select the **vuepress-static-app** as the _Repository_ .

1. For the _Branch_ select **master**.

   :::image type="content" source="./media/publish-vuepress/completed-github-info.png" alt-text="Completed GitHub information":::

### Build

Next, you add configuration settings that the build process uses to build your app. The following settings configure the GitHub Action workflow file.

1. Click the **Next: Build >** button to edit the build configuration

1. Set _App location_ to **/**.

1. Set _App artifact location_ to **.vuepress/dist**.

A value for _API location_ isn't necessary as you aren't deploying an API at the moment.

   :::image type="content" source="./media/publish-vuepress/build-details.png" alt-text="Build Settings":::

### Review and create

1. Click the **Review + Create** button to verify the details are all correct.

1. Click **Create** to start the creation of the Azure Static Web Apps and provision a GitHub Action for deployment.

1. Once the deployment completes click, **Go to resource**.

1. On the resource screen, click the _URL_ link to open your deployed application. You may need to wait a minute or two for the GitHub Action to complete.

   :::image type="content" source="./media/publish-vuepress/deployed-app.png" alt-text="Deployed application":::

### Clean up resources

[!INCLUDE [cleanup-resource](../../includes/static-web-apps-cleanup-resource.md)]

## Next steps

> [!div class="nextstepaction"]
> [Add a custom domain](custom-domain.md)
