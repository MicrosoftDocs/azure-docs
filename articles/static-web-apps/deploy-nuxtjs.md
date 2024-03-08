---
title: "Tutorial: Deploy Nuxt sites with universal rendering on Azure Static Web Apps"
description: "Generate and deploy Nuxt 3 sites with universal rendering on Azure Static Web Apps."
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  tutorial
ms.date: 09/01/2022
ms.author: cshoe
ms.custom:
---

# Deploy Nuxt 3 sites with universal rendering on Azure Static Web Apps

In this tutorial, you learn to deploy a [Nuxt 3](https://v3.nuxtjs.org/) application to [Azure Static Web Apps](overview.md). Nuxt 3 supports [universal (client-side and server-side) rendering](https://v3.nuxtjs.org/guide/concepts/rendering/#universal-rendering), including server and API routes. Without extra configuration, you can deploy Nuxt 3 apps with universal rendering to Azure Static Web Apps. When the app is built in the Static Web Apps GitHub Action or Azure Pipelines task, Nuxt 3 automatically converts it into static assets and an Azure Functions app that are compatible with Azure Static Web Apps.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).
- A GitHub account. [Create an account for free](https://github.com/join).
- [Node.js](https://nodejs.org) 16 or later installed.

## Set up a Nuxt 3 app

You can set up a new Nuxt project using `npx nuxi init nuxt-app`. Instead of using a new project, this tutorial uses an existing repository set up to demonstrate how to deploy a Nuxt 3 site with universal rendering on Azure Static Web Apps.

1. Navigate to [http://github.com/staticwebdev/nuxt-3-starter/generate](https://github.com/login?return_to=/staticwebdev/nuxt-3-starter/generate).
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

Navigate to `http://localhost:3000` to open the app, where you should see the following website open in your preferred browser. Select the buttons to invoke server and API routes.

:::image type="content" source="media/deploy-nuxtjs/nuxt-3-app.png" alt-text="Start Nuxt.js app":::

## Deploy your Nuxt 3 site

The following steps show how to create an Azure Static Web Apps resource and configure it to deploy your app from GitHub.

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

1. Select **Review + Create** to verify the details are all correct.

1. Select **Create** to start the creation of the static web app and provision a GitHub Actions for deployment.

1. Once the deployment completes, select **Go to resource**.

1. On the _Overview_ window, select the *URL* link to open your deployed application.

If the website does not immediately load, then the background GitHub Actions workflow is still running. Once the workflow is complete you can then refresh the browser to view your web app.

You can check the status of the Actions workflows by navigating to the Actions for your repository:

```url
https://github.com/<YOUR_GITHUB_USERNAME>/nuxt-3-starter/actions
```

### Synchronize changes

When you created the app, Azure Static Web Apps created a GitHub Actions workflow file in your repository. Return to the terminal and run the following command to pull the commit containing the new file.

```bash
git pull
```

Make changes to the app by updating the code and pushing it to GitHub. GitHub Actions automatically builds and deploys the app.

For more information, see the Azure Static Web Apps Nuxt 3 deployment preset [documentation](https://nitro.unjs.io/deploy/providers/azure#azure-static-web-apps).

> [!div class="nextstepaction"]
> [Set up a custom domain](custom-domain.md)
