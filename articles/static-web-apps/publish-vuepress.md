---
title: "Tutorial: Publish a VuePress site to Azure Static Web Apps"
description: This tutorial shows you how to deploy a VuePress application to Azure Static Web Apps.
services: static-web-apps
author: aaronpowell
ms.service: static-web-apps
ms.topic: tutorial
ms.date: 05/11/2021
ms.author: aapowell
ms.custom:
---

# Tutorial: Publish a VuePress site to Azure Static Web Apps

This article demonstrates how to create and deploy a [VuePress](https://vuepress.vuejs.org/) web application to [Azure Static Web Apps](overview.md). The final result is a new Azure Static Web Apps application with the associated GitHub Actions that give you control over how the app is built and published.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Create a VuePress app
> - Setup an Azure Static Web Apps
> - Deploy the VuePress app to Azure

## Prerequisites

- An Azure account with an active subscription. If you don't have one, you can [create an account for free](https://azure.microsoft.com/free/).
- A GitHub account. If you don't have one, you can [create an account for free](https://github.com/join).
- A Git setup installed. If you don't have one, you can [install Git](https://www.git-scm.com/downloads). 
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

1. Initialize a Git repo.

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
   git push --set-upstream origin main
   ```

## Deploy your web app

The following steps show you how to create a new static site app and deploy it to a production environment.

### Create the application

1. Go to the [Azure portal](https://portal.azure.com)
1. Select **Create a Resource**
1. Search for **Static Web Apps**
1. Select **Static Web Apps**
1. Select **Create**
1. On the _Basics_ tab, enter the following values.

    | Property | Value |
    | --- | --- |
    | _Subscription_ | Your Azure subscription name. |
    | _Resource group_ | **my-vuepress-group**  |
    | _Name_ | **vuepress-static-app** |
    | _Plan type_ | **Free** |
    | _Region for Azure Functions API and staging environments_ | Select a region closest to you. |
    | _Source_ | **GitHub** |

1. Select **Sign in with GitHub** and authenticate with GitHub.

1. Enter the following GitHub values.

    | Property | Value |
    | --- | --- |
    | _Organization_ | Select your desired GitHub organization. |
    | _Repository_ | Select **vuepress-static-app**. |
    | _Branch_ | Select **main**. |

    > [!NOTE]
    > If you don't see any repositories, you may need to authorize Azure Static Web Apps on GitHub.
    > Browse to your GitHub repository and go to **Settings > Applications > Authorized OAuth Apps**, select **Azure Static Web Apps**, and then select **Grant**. For organization repositories, you must be an owner of the organization to grant the permissions.

1. In the _Build Details_ section, select **VuePress** from the _Build Presets_ drop-down and keep the default values.

### Review and create

1. Select **Review + Create** to verify the details are all correct.

2. Select **Create** to start the creation of the App Service Static Web App and provision a GitHub Actions for deployment.

3. Once the deployment completes, select **Go to resource**.

4. On the resource screen, select the _URL_ link to open your deployed application. You may need to wait a minute or two for the GitHub Actions to complete.

   :::image type="content" source="./media/publish-vuepress/deployed-app.png" alt-text="Deployed application":::

### Clean up resources

[!INCLUDE [cleanup-resource](../../includes/static-web-apps-cleanup-resource.md)]

## Next steps

> [!div class="nextstepaction"]
> [Add a custom domain](custom-domain.md)
