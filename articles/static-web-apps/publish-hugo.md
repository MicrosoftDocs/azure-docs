---
title: "Tutorial: Publish a Hugo site to Azure Static Web Apps"
description: Learn how to deploy a Hugo application to Azure Static Web Apps.
services: static-web-apps
author: aaronpowell
ms.service: static-web-apps
ms.topic: tutorial
ms.date: 05/08/2020
ms.author: aapowell
---

# Tutorial: Publish a Hugo site to Azure Static Web Apps Preview

This article demonstrates how to create and deploy a [Hugo](https://gohugo.io/) web application to [Azure Static Web Apps](overview.md). The final result is a new Azure Static Web App with associated GitHub Actions that give you control over how the app is built and published.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Create a Hugo app
> - Setup an Azure Static Web Apps
> - Deploy the Hugo app to Azure

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

- An Azure account with an active subscription. If you don't have one, you can [create an account for free](https://azure.microsoft.com/free/).
- A GitHub account. If you don't have one, you can [create an account for free](https://github.com/join).

## Create a Hugo App

Create a Hugo app using the Hugo Command Line Interface (CLI):

1. Follow the [installation guide](https://gohugo.io/getting-started/installing/) for Hugo on your OS.

1. Open a terminal

1. Run the Hugo CLI to create a new app.

   ```bash
   hugo new site static-app
   ```

1. Navigate to the newly created app.

   ```bash
   cd static-app
   ```

1. Initialize a Git repo.

   ```bash
    git init
   ```

1. Next, add a theme to the site by installing a theme as a git submodule and then specifying it in the Hugo config file.

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

You need a repository on GitHub to connect to Azure Static Web Apps. The following steps show you how to create a repository for your site.

1. Create a blank GitHub repo (don't create a README) from [https://github.com/new](https://github.com/new) named **hugo-static-app**.

1. Add the GitHub repository as a remote to your local repo. Make sure to add your GitHub username in place of the `<YOUR_USER_NAME>` placeholder in the following command.

   ```bash
   git remote add origin https://github.com/<YOUR_USER_NAME>/hugo-static-app
   ```

1. Push your local repo up to GitHub.

   ```bash
   git push --set-upstream origin master
   ```

## Deploy your web app

The following steps show you how to create a new static site app and deploy it to a production environment.

### Create the application

1. Navigate to the [Azure portal](https://portal.azure.com)
1. Click **Create a Resource**
1. Search for **Static Web Apps**
1. Click **Static Web Apps (Preview)**
1. Click **Create**

   :::image type="content" source="./media/publish-hugo/create-in-portal.png" alt-text="Create a Azure Static Web Apps resource in the portal":::

1. For **Subscription**, accept the subscription that is listed or select a new one from the drop-down list.

1. In _Resource group_, select **New**. In _New resource group name_, enter **hugo-static-app** and select **OK**.

1. Next, a name for your app in the **Name** box. Valid characters include `a-z`, `A-Z`, `0-9` and `-`.

1. For _Region_, select an available region close to you.

1. For _SKU_, select **Free**.

   :::image type="content" source="./media/publish-hugo/basic-app-details.png" alt-text="Details filled out":::

1. Click the **Sign in with GitHub** button.

1. Select the **Organization** under which you created the repo.

1. Select the **hugo-static-app** as the _Repository_ .

1. For the _Branch_ select **master**.

   :::image type="content" source="./media/publish-hugo/completed-github-info.png" alt-text="Completed GitHub information":::

### Build

Next, you add configuration settings that the build process uses to build your app. The following settings configure the GitHub Action workflow file.

1. Click the **Next: Build >** button to edit the build configuration

1. Set _App location_ to **/**.

1. Set _App artifact location_ to **public**.

   A value for _API location_ isn't necessary as you aren't deploying an API at the moment.

### Review and create

1. Click the **Review + Create** button to verify the details are all correct.

1. Click **Create** to start the creation of the Azure Static Web Apps and provision a GitHub Action for deployment.

1. Wait for the GitHub Action to complete.

1. In the Azure portal's _Overview_ window of newly created Azure Static Web Apps resource, click the _URL_ link to open your deployed application.

   :::image type="content" source="./media/publish-hugo/deployed-app.png" alt-text="Deployed application":::

#### Custom Hugo version

When you generate a Static Web App, a [workflow file](./github-actions-workflow.md) is generated which contains the publishing configuration settings for the application. You can designate a specific Hugo version in the workflow file by providing a value for `HUGO_VERSION` in the `env` section. The following example configuration demonstrates how to set set Hugo to a specific version.

```yaml
jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v2
        with:
          submodules: true
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
          api_location: "api" # Api source code path - optional
          app_artifact_location: "public" # Built app content directory - optional
          ###### End of Repository/Build Configurations ######
        env:
          HUGO_VERSION: 0.58.0
```

## Clean up resources

[!INCLUDE [cleanup-resource](../../includes/static-web-apps-cleanup-resource.md)]

## Next steps

> [!div class="nextstepaction"]
> [Add a custom domain](custom-domain.md)
