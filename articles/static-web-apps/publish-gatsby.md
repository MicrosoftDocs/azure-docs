---
title: "Tutorial: Publish a Gatsby site to Azure Static Web Apps"
description: This tutorial shows you how to deploy a Gatsby application to Azure Static Web Apps.
services: static-web-apps
author: aaronpowell
ms.service: static-web-apps
ms.topic: tutorial
ms.date: 05/10/2021
ms.author: aapowell
ms.custom:
---

# Tutorial: Publish a Gatsby site to Azure Static Web Apps

This article demonstrates how to create and deploy a [Gatsby](https://gatsbyjs.org) web application to [Azure Static Web Apps](overview.md). The final result is a new Static Web Apps site (with the associated GitHub Actions) that give you control over how the app is built and published.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Create a Gatsby app
> - Setup an Azure Static Web Apps site
> - Deploy the Gatsby app to Azure

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

- An Azure account with an active subscription. If you don't have one, you can [create an account for free](https://azure.microsoft.com/free/).
- A GitHub account. If you don't have one, you can [create an account for free](https://github.com/join).
- A Git setup installed. If you don't have one, you can [install Git](https://www.git-scm.com/downloads). 
- [Node.js](https://nodejs.org) installed.

## Create a Gatsby App

Create a Gatsby app using the Gatsby Command Line Interface (CLI):

1. Open a terminal
1. Use the [npx](https://www.npmjs.com/package/npx) tool to create a new app with the Gatsby CLI. This may take a few minutes.

   ```bash
   npx gatsby new static-web-app
   ```

1. Go to the newly created app

   ```bash
   cd static-web-app
   ```

1. Initialize a Git repo

   ```bash
   git init
   git add -A
   git commit -m "initial commit"
   ```
> [!NOTE]
> If you are using the latest version of Gatsby you may need to modify the package.json to include
> "engines": {
> "node": ">=18.0.0"
> },
## Push your application to GitHub

You need to have a repository on GitHub to create a new Azure Static Web Apps resource.

1. Create a blank GitHub repository (don't create a README) from [https://github.com/new](https://github.com/new) named **gatsby-static-web-app**.

1. Next, add the GitHub repository you just created as a remote to your local repo. Make sure to add your GitHub username in place of the `<YOUR_USER_NAME>` placeholder in the following command.

   ```bash
   git remote add origin https://github.com/<YOUR_USER_NAME>/gatsby-static-web-app
   ```

1. Push your local repository up to GitHub.

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
    | _Resource group_ | **my-gatsby-group**  |
    | _Name_ | **my-gatsby-app** |
    | _Plan type_ | **Free** |
    | _Region for Azure Functions API and staging environments_ | Select a region closest to you. |
    | _Source_ | **GitHub** |

1. Select **Sign in with GitHub** and authenticate with GitHub.

1. Enter the following GitHub values.

    | Property | Value |
    | --- | --- |
    | _Organization_ | Select your desired GitHub organization. |
    | _Repository_ | Select **gatsby-static-web-app**. |
    | _Branch_ | Select **main**. |

    > [!NOTE]
    > If you don't see any repositories, you may need to authorize Azure Static Web Apps on GitHub.
    > Browse to your GitHub repository and go to **Settings > Applications > Authorized OAuth Apps**, select **Azure Static Web Apps**, and then select **Grant**. For organization repositories, you must be an owner of the organization to grant the permissions.

1. In the _Build Details_ section, select **Gatsby** from the _Build Presets_ drop-down and keep the default values.

### Review and create

1. Select **Review + Create** to verify the details are all correct.

2. Select **Create** to start the creation of the App Service Static Web App and provision a GitHub Actions for deployment.

3. Once the deployment completes, select **Go to resource**.

4. On the resource screen, select the _URL_ link to open your deployed application. You may need to wait a minute or two for the GitHub Actions to complete.

   :::image type="content" source="./media/publish-gatsby/deployed-app.png" alt-text="Deployed application":::

## Clean up resources

[!INCLUDE [cleanup-resource](../../includes/static-web-apps-cleanup-resource.md)]

## Next steps

> [!div class="nextstepaction"]
> [Add a custom domain](custom-domain.md)
