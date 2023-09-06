---
title: "Tutorial: Publish a Jekyll site to Azure Static Web Apps"
description: Learn how to deploy a Jekyll application to Azure Static Web Apps.
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic: tutorial
ms.date: 05/11/2021
ms.author: cshoe
---

# Tutorial: Publish a Jekyll site to Azure Static Web Apps

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
- A Git setup installed. If you don't have one, you can [install Git](https://www.git-scm.com/downloads). 

## Create Jekyll App

Create a Jekyll app using the Jekyll Command Line Interface (CLI):

1. From the terminal, run the Jekyll CLI to create a new app.

   ```bash
   jekyll new static-app
   ```

1. Go to the newly created app.

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
   git remote add origin https://github.com/<YOUR_USER_NAME>/jekyll-azure-static
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

1. Go to the [Azure portal](https://portal.azure.com)
1. Select **Create a Resource**
1. Search for **Static Web Apps**
1. Select **Static Web Apps**
1. Select **Create**
1. On the _Basics_ tab, enter the following values.

    | Property | Value |
    | --- | --- |
    | _Subscription_ | Your Azure subscription name. |
    | _Resource group_ | **jekyll-static-app**  |
    | _Name_ | **jekyll-static-app** |
    | _Plan type_ | **Free** |
    | _Region for Azure Functions API and staging environments_ | Select a region closest to you. |
    | _Source_ | **GitHub** |

1. Select **Sign in with GitHub** and authenticate with GitHub.

1. Enter the following GitHub values.

    | Property | Value |
    | --- | --- |
    | _Organization_ | Select your desired GitHub organization. |
    | _Repository_ | Select **jekyll-static-app**. |
    | _Branch_ | Select **main**. |

    > [!NOTE]
    > If you don't see any repositories, you may need to authorize Azure Static Web Apps on GitHub.
    > Browse to your GitHub repository and go to **Settings > Applications > Authorized OAuth Apps**, select **Azure Static Web Apps**, and then select **Grant**. For organization repositories, you must be an owner of the organization to grant the permissions.

1. In the _Build Details_ section, select **Custom** from the _Build Presets_ drop-down and keep the default values.

1. In the _App location_ box, enter **./**.

1. Leave the _Api location_ box empty.

1. In the _Output location_ box, enter **_site**.

### Review and create

1. Select **Review + Create** to verify the details are all correct.

2. Select **Create** to start the creation of the App Service Static Web App and provision a GitHub Actions for deployment.

3. Once the deployment completes, select **Go to resource**.

4. On the resource screen, select the _URL_ link to open your deployed application. You may need to wait a minute or two for the GitHub Actions to complete.

   :::image type="content" source="./media/publish-jekyll/deployed-app.png" alt-text="Deployed application":::

#### Custom Jekyll settings

When you generate a static web app, a [workflow file](./build-configuration.md) is generated which contains the publishing configuration settings for the application.

To configure environment variables, such as `JEKYLL_ENV`, add an `env` section to the Azure Static Web Apps GitHub Actions in the workflow.

```yaml
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
      api_location: "" # Api source code path - optional
      output_location: "_site" # Built app content directory - optional
      ###### End of Repository/Build Configurations ######
   env:
      JEKYLL_ENV: production
```

## Clean up resources

[!INCLUDE [cleanup-resource](../../includes/static-web-apps-cleanup-resource.md)]

## Next steps

> [!div class="nextstepaction"]
> [Add a custom domain](custom-domain.md)
