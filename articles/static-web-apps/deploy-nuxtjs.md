---
title: "Tutorial: Deploy Nuxt.js site with universal rendering on Azure Static Web Apps"
description: "Generate and deploy Nuxt 3 sites with universal rendering on Azure Static Web Apps."
services: static-web-apps
author: craigshoemaker, nuzhatminhaz
ms.service: static-web-apps
ms.topic:  tutorial
ms.date: 07/28/2011
ms.author: cshoe
ms.custom: devx-track-js
---

# Deploy Nuxt.js sites with universal rendering on Azure Static Web Apps

In this tutorial, you learn to deploy a [Nuxt 3](https://v3.nuxtjs.org/) generated static website to [Azure Static Web Apps](overview.md). To begin, you learn to set up, configure, and deploy a Nuxt.js app. During this process, you also learn to deal with common challenges often faced when generating static pages with Nuxt.js

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).
- A GitHub account. [Create an account for free](https://github.com/join).
- [Node.js](https://nodejs.org) installed.

## Set up a Nuxt.js app

You can set up a new Nuxt.js project using `create-nuxt-app`. Instead of a new project, in this tutorial, you will begin by cloning an existing repository. This repository is set up to demonstrate how to deploy a Nuxt 3 site with universal rendering on Azure Static Web App.

1. Create a new repository under your GitHub account from a template repository.
1. Navigate to [http://github.com/staticwebdev/nuxt-3-starter/generate](https://github.com/login?return_to=/staticwebdev/nuxtjs-starter/generate)
1. Name the repository **nuxt-3-starter**.
1. Next, clone the new repo to your machine. Make sure to replace <YOUR_GITHUB_ACCOUNT_NAME> with your account name.

    ```bash
    git clone http://github.com/<YOUR_GITHUB_ACCOUNT_NAME>/nuxt-3-starter
    ```

1. Navigate to the newly cloned Nuxt.js app:

   ```bash
   cd nuxt-3-starter
   ```

1. Install dependencies:

    ```bash
    npm install
    ```

1. Start Nuxt.js app in development:

    ```bash
    npm run dev -- -o
    ```

Navigate to `http://localhost:3000` to open the app, where you should see the following website open in your preferred browser:

:::image type="content" source="media/deploy-nuxtjs/nuxt3-app.png" alt-text="Start Nuxt.js app":::

## Deploy your Nuxt 3 site

The following steps show how to link the app you just pushed to GitHub to Azure Static Web Apps. Once in Azure, you can deploy the application to a production environment.

### Create an Azure Static Web Apps resource

1. Navigate to the [Azure portal](https://portal.azure.com).
1. Select **Create a Resource**.
1. Search for **Static Web Apps**.
1. Select **Static Web Apps**.
1. Select **Create**.
1. On the _Basics_ tab, enter the following values.

    | Property | Value |
    | --- | --- |
    | _Subscription_ | Your Azure subscription name. |
    | _Resource group_ | **my-nuxtjs-group**  |
    | _Name_ | **my-nuxt3-app** |
    | _Plan type_ | **Free** |
    | _Region for Azure Functions API and staging environments_ | Select a region closest to you. |
    | _Source_ | **GitHub** |

1. Select **Sign in with GitHub** and authenticate with GitHub.

1. Enter the following GitHub values.

    | Property | Value |
    | --- | --- |
    | _Organization_ | Select your desired GitHub organization. |
    | _Repository_ | Select the repository you created earlier. |
    | _Branch_ | Select **main**. |

1. In the _Build Details_ section, select **Custom** from the _Build Presets_ drop-down and keep the default values.

1. In the _App location_, enter **/** in the box.
1. In the _Api location_, enter **.output/server** in the box.
1. In the _Output location_, enter **.output/public** in the box.

### Review and create

1. Select the **Review + Create** button to verify the details are all correct.

1. Select **Create** to start the creation of the App Service Static Web App and provision a GitHub Actions for deployment.

1. Once the deployment completes click, **Go to resource**.

1. On the _Overview_ window, click the *URL* link to open your deployed application.

If the website does not immediately load, then the background GitHub Actions workflow is still running. Once the workflow is complete you can then click refresh the browser to view your web app.

You can check the status of the Actions workflows by navigating to the Actions for your repository:

```url
https://github.com/<YOUR_GITHUB_USERNAME>/nuxt-3-starter/actions
```

### Sync changes

When you created the app, Azure Static Web Apps created a GitHub Actions workflow file in your repository. You need to bring this file down to your local repository so your git history is synchronized.

Return to the terminal and run the following command `git pull origin main`.

> [!div class="nextstepaction"]
> [Set up a custom domain](custom-domain.md)
