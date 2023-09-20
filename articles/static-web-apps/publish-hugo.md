---
title: "Tutorial: Publish a Hugo site to Azure Static Web Apps"
description: Learn how to deploy a Hugo application to Azure Static Web Apps.
services: static-web-apps
author: aaronpowell
ms.service: static-web-apps
ms.topic: tutorial
ms.date: 05/11/2021
ms.author: aapowell
---

# Tutorial: Publish a Hugo site to Azure Static Web Apps

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
- A Git setup installed. If you don't have one, you can [install Git](https://www.git-scm.com/downloads). 

## Create a Hugo App

Create a Hugo app using the Hugo Command Line Interface (CLI):

1. Follow the [installation guide](https://gohugo.io/getting-started/installing/) for Hugo on your OS.

1. Open a terminal

1. Run the Hugo CLI to create a new app.

   ```bash
   hugo new site static-app
   ```

1. Go to the newly created app.

   ```bash
   cd static-app
   ```

1. Initialize a Git repo.

   ```bash
   git init
   ```

1. Ensure that your branch is named `main`.

   ```bash
   git branch -M main
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
    | _Resource group_ | **my-hugo-group**  |
    | _Name_ | **hugo-static-app** |
    | _Plan type_ | **Free** |
    | _Region for Azure Functions API and staging environments_ | Select a region closest to you. |
    | _Source_ | **GitHub** |

1. Select **Sign in with GitHub** and authenticate with GitHub.

1. Enter the following GitHub values.

    | Property | Value |
    | --- | --- |
    | _Organization_ | Select your desired GitHub organization. |
    | _Repository_ | Select **hugo-static-app**. |
    | _Branch_ | Select **main**. |

    > [!NOTE]
    > If you don't see any repositories, you may need to authorize Azure Static Web Apps on GitHub.
    > Browse to your GitHub repository and go to **Settings > Applications > Authorized OAuth Apps**, select **Azure Static Web Apps**, and then select **Grant**. For organization repositories, you must be an owner of the organization to grant the permissions.

1. In the _Build Details_ section, select **Hugo** from the _Build Presets_ drop-down and keep the default values.

### Review and create

1. Select **Review + Create** to verify the details are all correct.

2. Select **Create** to start the creation of the App Service Static Web App and provision a GitHub Actions for deployment.

3. Once the deployment completes, select **Go to resource**.

4. On the resource screen, select the _URL_ link to open your deployed application. You may need to wait a minute or two for the GitHub Actions to complete.

   :::image type="content" source="./media/publish-hugo/deployed-app.png" alt-text="Deployed application":::

#### Custom Hugo version

When you generate a Static Web App, a [workflow file](./build-configuration.md) is generated which contains the publishing configuration settings for the application. You can designate a specific Hugo version in the workflow file by providing a value for `HUGO_VERSION` in the `env` section. The following example configuration demonstrates how to set Hugo to a specific version.

```yaml
jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }} # Used for GitHub integrations (i.e. PR comments)
          action: "upload"
          ###### Repository/Build Configurations - These values can be configured to match you app requirements. ######
          # For more information regarding Static Web App workflow configurations, please visit: https://aka.ms/swaworkflowconfig
          app_location: "/" # App source code path
          api_location: "api" # Api source code path - optional
          output_location: "public" # Built app content directory - optional
          ###### End of Repository/Build Configurations ######
        env:
          HUGO_VERSION: 0.58.0
```

#### Use the Git Info feature in your Hugo application

If your Hugo application uses the [Git Info feature](https://gohugo.io/variables/git/), the default [workflow file](./build-configuration.md) created for the Static Web App uses the [checkout GitHub Action](https://github.com/actions/checkout) to fetch a _shallow_ version of your Git repository, with a default depth of **1**. In this scenario, Hugo sees all your content files as coming from a _single commit_, so they have the same author, last modification timestamp, and other `.GitInfo` variables.

Update your workflow file to [fetch your full Git history](https://github.com/actions/checkout/blob/main/README.md#fetch-all-history-for-all-tags-and-branches) by adding a new parameter under the `actions/checkout` step to set the `fetch-depth` to `0` (no limit):

```yaml
      - uses: actions/checkout@v3
        with:
          submodules: true
          fetch-depth: 0
```

Fetching the full history increases the build time of your GitHub Actions workflow, but your `.Lastmod` and `.GitInfo` variables are accurate and available for each of your content files.

## Clean up resources

[!INCLUDE [cleanup-resource](../../includes/static-web-apps-cleanup-resource.md)]

## Next steps

> [!div class="nextstepaction"]
> [Add a custom domain](custom-domain.md)
