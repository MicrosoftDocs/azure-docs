---
title: "Tutorial: Publish a Jekyll site to Azure Static Web Apps"
description: Learn how to deploy a Jekyll application to Azure Static Web Apps.
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic: tutorial
ms.date: 04/28/2021
ms.author: cshoe
---

# Tutorial: Publish a Jekyll site to Azure Static Web Apps Preview

This article demonstrates how to create and deploy a [Jekyll](https://jekyllrb.com/) web application to [Azure Static Web Apps](overview.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Create a Jekyll website
> - Setup an Azure Static Web Apps resource
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

1. Initialize a new Git repository.

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
   git push --set-upstream origin main
   ```

   > [!NOTE]
   > Your git branch may be named differently than `main`. Replace `main` in this command with the correct value.

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

1. In _Deployment details_, select **GitHub** for _Source_.

1. Click the **Sign in with GitHub** button.

1. Select the **Organization** under which you created the repo.

1. Select **jekyll-static-app** as the _Repository_.

1. For the _Branch_ select **main**.

### Build

Next, you add configuration settings that the build process uses to build your app. The following settings configure the GitHub Action workflow file.

1. For _Build Presets_, select **Custom**.

1. Set _App location_ to **/**.

1. Set the _Output location_ to **_site**.

   A value for _API location_ isn't necessary as you aren't deploying an API at the moment.

   :::image type="content" source="./media/publish-jekyll/github-actions-inputs.png" alt-text="GitHub Actions Inputs":::

### Review and create

1. Click the **Review + Create** button to verify the details are all correct.

1. Click **Create** to start the creation of the Azure Static Web Apps and provision a GitHub Action for deployment.

1. Wait for the GitHub Action to complete.

1. In the Azure portal's _Overview_ window of newly created Azure Static Web Apps resource, click the _URL_ link to open your deployed application.

   :::image type="content" source="./media/publish-jekyll/deployed-app.png" alt-text="Deployed application":::

#### Custom Jekyll settings

When you generate a static web app, a [workflow file](./github-actions-workflow.md) is generated which contains the publishing configuration settings for the application.

To configure environment variables, such as `JEKYLL_ENV`, add an `env` section to the Azure Static Web Apps GitHub Action in the workflow.

```yaml
- name: Build And Deploy
   id: builddeploy
   uses: Azure/static-web-apps-deploy@v0.0.1-preview
   with:
      azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
      repo_token: ${{ secrets.GITHUB_TOKEN }} # Used for Github integrations (i.e. PR comments)
      action: "upload"
      ###### Repository/Build Configurations - These values can be configured to match you app requirements. ######
      # For more information regarding Static Web App workflow configurations, please visit: https://aka.ms/swaworkflowconfig
      app_location: "/" # App source code path
      api_location: "" # Api source code path - optional
      output_location: "_site_" # Built app content directory - optional
      ###### End of Repository/Build Configurations ######
   env:
      JEKYLL_ENV: production
```

## Clean up resources

[!INCLUDE [cleanup-resource](../../includes/static-web-apps-cleanup-resource.md)]

## Next steps

> [!div class="nextstepaction"]
> [Add a custom domain](custom-domain.md)
