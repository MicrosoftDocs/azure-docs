---
title: "Tutorial: Publish a Gatsby site to App Service Static Apps"
description: Learn how to deploy a Gatsby application to App Service Static Apps.
services: azure-functions
author: aaronpowell
ms.service: azure-functions
ms.topic: tutorial
ms.date: 05/08/2020
ms.author: aapowell
---

# Tutorial: Publish a Gatsby site to App Service Static Apps

This article demonstrates how to create and deploy a [Gatsby](https://gatsbyjs.org) web application to [Azure App Service Static Apps](overview.md). The final result is a new App Service Static App with the associated GitHub Actions that give you control over how the app is built and published.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Create a Gatsby app
> - Setup an App Service Static App
> - Deploy the Gatsby app to Azure

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).
- A GitHub account. [Create an account for free](https://github.com/join).
- [Node.js](https://nodejs.org) installed.

## Create a Gatsby App

Create a Gatsby app using the Gatsby command line (CLI):

1. Use the [npx](https://www.npmjs.com/package/npx) tool to run the Gatsby CLI.

   ```bash
   npx gatsby new static-app
   ```

1. Navigate to the newly created app

   ```bash
   cd static-app
   ```

1. Initialize a git repo

   ```bash
    git init
    git add -A
    git commit -m "initial commit"
   ```

## Push your application to GitHub

You'll need to have a repository on GitHub to connect App Service Static Apps to:

1. Create a blank GitHub repo (don't create a README) from [https://github.com/new](https://github.com/new) named **gatsby-static-app**.

1. Add the GitHub repo as a remote to your local repo.

   ```bash
   git remote add origin https://github.com/<YOUR_USER_NAME>/gatsby-static-app
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

   ![Create a Static App (Preview) in the portal](./media/static-apps-publish-gatsby/create-in-portal.png)

1. For **Subscription**, accept the subscription that is listed or select a new one from the drop-down list.

1. In _Resource group_, select **New**. In _New resource group name_, enter **\*myStaticApp** and select **OK**.

1. Next, provide a globally unique name for your app in the **Name** box. Valid characters include `a-z`, `A-Z`, `0-9` and `-`. This value is used as the URL prefix for your static app in the format of `https://<APP_NAME>....`.

1. For _Region_, select an available region close to you.

1. For _SKU_, select **Basic**.

   ![Details filled out](./media/static-apps-publish-gatsby/basic-app-details.png)

1. Click the **Sign in with GitHub** button.

1. Select the **Organization** under which you created the repo.

1. Select the **gatsby-static-app** as the _Repository_ .

1. For the _Branch_ select **master**.

   ![Completed GitHub information](./media/static-apps-publish-gatsby/completed-github-info.png)

### Build

Next, you add configuration settings that the build process uses to build your app.

1. To configure the settings of the GitHub Action, set the _App location_ to **/** and _App artifact location_ to **public**. A value for _API location_ isn't necessary as you aren't deploying an API at the moment.

   ![Build Settings](./media/static-apps-publish-gatsby/build-details.png)

### Review and create

1. Click the **Review + Create** button to verify the details are all correct.

1. Click **Create** to start the creation of the App Service Static App and provision a GitHub Action for deployment.

1. Once the deployment completes click, **Go to resource**.

1. On the resource screen, click the _URL_ link to open your deployed application.

   ![Deployed application](./media/static-apps-publish-gatsby/deployed-app.png)

## Summary

In this how to you created a Gatsby application and deployed it to App Service Static Sites using GitHub Actions.

## Next steps

Advance to the next article to learn how to add a custom domain to your application:

> [!div class="nextstepaction"]
[setup a custom domain in app service static apps](custom-domain.md)
