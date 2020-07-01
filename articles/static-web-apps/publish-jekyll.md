---
title: "Tutorial: Publish a Jekyll site to Azure Static Web Apps"
description: Learn how to deploy a Jekyll application to Azure Static Web Apps.
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic: tutorial
ms.date: 06/08/2020
ms.author: cshoe
---

# Tutorial: Publish a Jekyll site to Azure Static Web Apps Preview

This article demonstrates how to create and deploy a [Jekyll](https://jekyllrb.com/) web application to [Azure Azure Static Web Apps](overview.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Create a Jekyll website
> - Setup an Azure Static Web Apps
> - Deploy the Jekyll app to Azure

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

- Install [Jekyll](https://jekyllrb.com/docs/installation/)
  - You can use the Windows Subsystem for Linux and follow Ubuntu instructions, if necessary.
- An Azure account with an active subscription. If you don't have one, you can [create an account for free](https://azure.microsoft.com/free/).
- A GitHub account. If you don't have one, you can [create an account for free](https://github.com/join).

## Create Jekyll App

Create a Jekyll app using the Jekyll Command Line Interface (CLI):

1. From the terminal, run the Jekyll CLI to create a new app.

   ```bash
   jekyll new static-app
   ```

1. Navigate to the newly created app.

   ```bash
   cd static-app
   ```

1. Initialize a new git repository.

   ```bash
    git init
   ```

1. Commit the changes.

   ```bash
   git add -A
   git commit -m "initial commit"
   ```

## Push your application to GitHub

Azure Static Web Apps uses GitHub to publish your website. The following steps show you how to create a GitHub repository.

1. Create a blank GitHub repo (don't create a README) from [https://github.com/new](https://github.com/new) named **jekyll-azure-static**.

1. Add the GitHub repository as a remote to your local repo. Make sure to add your GitHub username in place of the `<YOUR_USER_NAME>` placeholder in the following command.

   ```bash
   git remote add origin https://github.com/<YOUR_USER_NAME>/jekyll-static-app
   ```

1. Push your local repo up to GitHub.

   ```bash
   git push --set-upstream origin master
   ```

## Deploy your web app

The following steps show you how to create a new static site app and deploy it to a production environment.

### Create the application

1. Navigate to the [Azure portal](https://portal.azure.com).

1. Click **Create a Resource**.

1. Search for **Static Web Apps**.

1. Click **Static Web Apps (Preview)**.

1. Click **Create**.

1. For **Subscription**, accept the subscription that is listed or select a new one from the drop-down list.

1. In _Resource group_, select **New**. In _New resource group name_, enter **jekyll-static-app** and select **OK**.

1. Next, provide a name for your app in the _Name_ box. Valid characters include `a-z`, `A-Z`, `0-9` and `-`.

1. For _Region_, select an available region close to you.

1. For _SKU_, select **Free**.

    :::image type="content" source="./media/publish-jekyll/basic-app-details.png" alt-text="Details filled out":::

1. Click the **Sign in with GitHub** button.

1. Select the **Organization** under which you created the repo.

1. Select the **jekyll-static-app** as the _Repository_.

1. For the _Branch_ select **master**.

    :::image type="content" source="./media/publish-jekyll/completed-github-info.png" alt-text="Completed GitHub information":::

### Build

Next, you add configuration settings that the build process uses to build your app. The following settings configure the GitHub Action workflow file.

1. Click the **Next: Build >** button to edit the build configuration.

1. Set _App location_ to **/_site**.

1. Leave the _App artifact location_ blank.

   A value for _API location_ isn't necessary as you aren't deploying an API at the moment.

### Review and create

1. Click the **Review + Create** button to verify the details are all correct.

1. Click **Create** to start the creation of the Azure Static Web Apps and provision a GitHub Action for deployment.

1. The deployment will first, fail because the workflow file needs some Jekyll-specific settings. To add those settings, navigate to your terminal and pull the commit with the GitHub Action to your machine.

   ```bash
   git pull
   ```

1. Open the Jekyll app in a text editor and open the _.github/workflows/azure-pages-<WORKFLOW_NAME>.yml_ file.

1. Replace the line `- uses: actions/checkout@v1` with the following configuration block.

    ```yml
    - uses: actions/checkout@v2
      with:
        submodules: true
    - name: Set up Ruby
      uses: ruby/setup-ruby@ec106b438a1ff6ff109590de34ddc62c540232e0
        with:
        ruby-version: 2.6
    - name: Install dependencies
        run: bundle install
    - name: Jekyll build
        run: jekyll build
    ```

1. Commit the updated workflow and push to GitHub.

    ```bash
    git add -A
    git commit -m "Updating GitHub Actions workflow"
    git push
    ```

1. Wait for the GitHub Action to complete.

1. In the Azure portal's _Overview_ window, click the _URL_ link to open your deployed application.

   :::image type="content" source="./media/publish-jekyll/deployed-app.png" alt-text="Deployed application":::

## Clean up resources

[!INCLUDE [cleanup-resource](../../includes/static-web-apps-cleanup-resource.md)]

## Next steps

> [!div class="nextstepaction"]
> [Add a custom domain](custom-domain.md)
