---
title: "Tutorial: Publish a Hugo site to App Service Static Apps"
description: Learn how to deploy a Hugo application to App Service Static Apps.
services: azure-functions
author: aaronpowell
ms.service: azure-functions
ms.topic: tutorial
ms.date: 05/08/2020
ms.author: aapowell
---

# Tutorial: Publish a Hugo site to App Service Static Apps

This article demonstrates how to create and deploy a [Hugo](https://gohugo.io/) web application to [Azure App Service Static Apps](overview.md). The final result is a new App Service Static App with the associated GitHub Actions that give you control over how the app is built and published.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Create a Hugo app
> - Setup an App Service Static App
> - Deploy the Hugo app to Azure

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).
- A GitHub account. [Create an account for free](https://github.com/join).

## Create a Hugo App

Create a Hugo app using the Hugo command line (CLI):

1. Download the Hugo binary for your OS from their [GitHub Releases](https://github.com/gohugoio/hugo/releases) or follow their [installation guide](https://gohugo.io/getting-started/installing/).

1. Run the Hugo CLI to create a new app.

   ```bash
   hugo new site static-app
   ```

1. Navigate to the newly created app.

   ```bash
   cd static-app
   ```

1. Initialize a git repo.

   ```bash
    git init
   ```

1. Add a theme.

   ```bash
   git submodule add https://github.com/budparr/gohugo-theme-ananke.git themes/ananke
   echo 'theme = "ananke"' >> config.toml
   ```

1. Commit the changes.

   ```bash
   git add -A
   git commit -m "initial commit"
   ```

## Push your application to GitHub

You'll need to have a repository on GitHub to connect App Service Static Apps to:

1. Create a blank GitHub repo (don't create a README) from [https://github.com/new](https://github.com/new) named **hugo-static-app**.

1. Add the GitHub repo as a remote to your local repo.

   ```bash
   git remote add origin https://github.com/<YOUR_USER_NAME>/hugo-static-app
   ```

1. Push your local repo up to GitHub.

   ```bash
   git push --upstream origin master
   ```

## Deploy your web app

The following steps show you how to create a new static site app and deploy it to a production environment.

### Create the application

1. Navigate to the [Azure portal]().

1. Select **Create a Resource** and search for **Static App**.

   ![Create a Static App (Preview) in the portal](./media/static-apps-publish-hugo/create-in-portal.png)

1. For **Subscription**, accept the subscription that is listed or select a new one from the drop-down list.

1. In _Resource group_, select **New**. In _New resource group name_, enter **\*myStaticApp** and select **OK**.

1. Next, provide a globally unique name for your app in the **Name** box. Valid characters include `a-z`, `A-Z`, `0-9` and `-`. This value is used as the URL prefix for your static app in the format of `https://<APP_NAME>....`.

1. For _Region_, select an available region close to you.

1. For _SKU_, select **Basic**.

   ![Details filled out](./media/static-apps-publish-hugo/basic-app-details.png)

1. Click the **Sign in with GitHub** button.

1. Select the **Organization** under which you created the repo.

1. Select the **hugo-static-app** as the _Repository_ .

1. For the _Branch_ select **master**.

   ![Completed GitHub information](./media/static-apps-publish-hugo/completed-github-info.png)

### Build

Next, you add configuration settings that the build process uses to build your app.

1. To configure the settings of the GitHub Action, set the _App location_ to **/** and _App artifact location_ to **public**. A value for _API location_ isn't necessary as you aren't deploying an API at the moment.

   ![Build Settings](./media/static-apps-publish-hugo/build-details.png)

### Review and create

1. Click the **Review + Create** button to verify the details are all correct.

1. Click **Create** to start the creation of the App Service Static App and provision a GitHub Action for deployment.

1. Once the deployment completes, navigate to your terminal and pull the commit with the GitHub Action to your machine.

   ```bash
   git pull
   ```

1. Open the Hugo app in a text editor and open `.github/workflows/azure-pages-<WORKFLOW_NAME>.yml`.

1. Replace the line `- uses: actions/checkout@v1` (line 18) with the following, to build the Hugo application.

   ```yml
   - uses: actions/checkout@v2
        with:
          submodules: true

   - name: Setup Hugo
     uses: peaceiris/actions-hugo@v2.4.8
     with:
       hugo-version: "latest"

   - name: Build
     run: hugo
   ```

1. Commit the updated workflow and push to GitHub.

   ```bash
   git add -A
   git commit -m "Updating GitHub Actions workflow"
   git push
   ```

1. Wait for the GitHub Action to complete.

1. In the Azure Portal for the newly created App Service Static App, click the _URL_ link to open your deployed application.

   ![Deployed application](./media/static-apps-publish-hugo/deployed-app.png)

## Summary

In this how to you created a Hugo application and deployed it to App Service Static Sites using GitHub Actions.

## Next steps

Advance to the next article to learn how to add a custom domain to your application:

> [!div class="nextstepaction"]

- [Setup a custom domain in app service static apps](custom-domain.md)
