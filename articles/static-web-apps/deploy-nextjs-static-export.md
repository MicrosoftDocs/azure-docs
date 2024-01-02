---
title: "Tutorial: Deploy static-rendered Next.js websites on Azure Static Web Apps"
description: "Generate and deploy Next.js static-rendered sites with Azure Static Web Apps."
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  tutorial
ms.date: 10/12/2022
ms.author: aapowell
ms.custom: devx-track-js, engagement-fy23
---

# Deploy static-rendered Next.js websites on Azure Static Web Apps

In this tutorial, learn to deploy a [Next.js](https://nextjs.org) generated static website to [Azure Static Web Apps](overview.md). For more information about Next.js specifics, see the [starter template readme](https://github.com/staticwebdev/nextjs-starter#readme).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).
- A GitHub account. [Create an account for free](https://github.com/join).
- [Node.js](https://nodejs.org) installed.

## 1. Set up a Next.js app

Rather than using the Next.js CLI to create your app, you can use a starter repository. The starter repository contains an existing Next.js app that supports dynamic routes.

To begin, create a new repository under your GitHub account from a template repository.

1. Go to [https://github.com/staticwebdev/nextjs-starter/generate](https://github.com/login?return_to=/staticwebdev/nextjs-starter/generate)
1. Name the repository **nextjs-starter**
1. Next, clone the new repo to your machine. Make sure to replace `<YOUR_GITHUB_ACCOUNT_NAME>` with your account name.

    ```bash
    git clone http://github.com/<YOUR_GITHUB_ACCOUNT_NAME>/nextjs-starter
    ```

1. Go to the newly cloned Next.js app.

   ```bash
   cd nextjs-starter
   ```

1. Install dependencies.

    ```bash
    npm install
    ```

1. Start Next.js app in development.

    ```bash
    npm run dev
    ```

1. Go to `http://localhost:3000` to open the app, where you should see the following website open in your preferred browser:

:::image type="content" source="media/deploy-nextjs/start-nextjs-app.png" alt-text="Start Next.js app":::

When you select a framework or library, you see a details page about the selected item:

:::image type="content" source="media/deploy-nextjs/start-nextjs-details.png" alt-text="Details page":::

## 2. Create a static app

The following steps show how to link your app to Azure Static Web Apps. Once in Azure, you can deploy the application to a production environment.

1. Go to the [Azure portal](https://portal.azure.com).
1. Select **Create a Resource**.
1. Search for **Static Web Apps**.
1. Select **Static Web App**.
1. Select **Create**.
1. On the _Basics_ tab, enter the following values.

    | Property | Value |
    | --- | --- |
    | _Subscription_ | Your Azure subscription name. |
    | _Resource group_ | **my-nextjs-group**  |
    | _Name_ | **my-nextjs-app** |
    | _Plan type_ | **Free** |
    | _Region for Azure Functions API and staging environments_ | Select a region closest to you. |
    | _Source_ | **GitHub** |

1. Select **Sign in with GitHub** and authenticate with GitHub, if prompted.

1. Enter the following GitHub values.

    | Property | Value |
    | --- | --- |
    | _Organization_ | Select the appropriate GitHub organization. |
    | _Repository_ | Select **nextjs-starter**. |
    | _Branch_ | Select **main**. |

1. In the _Build Details_ section, select **Custom** from the _Build Presets_. Add the following values as for the build configuration.

    | Property | Value |
    | --- | --- |
    | _App location_ | Enter **/** in the box. |
    | _Api location_ | Leave this box empty. |
    | _Output location_ | Enter **out** in the box. |

## 3. Review and create

1. Select **Review + Create** to verify the details are all correct.

1. Select **Create** to start the creation of the App Service Static Web App and provision a GitHub Actions for deployment.

1. Once the deployment completes select, **Go to resource**.

1. On the _Overview_ window, select the *URL* link to open your deployed application.

If the website doesn't load immediately, then the build is still running. To check the status of the Actions workflow, navigate to the Actions dashboard for your repository:

```url
https://github.com/<YOUR_GITHUB_USERNAME>/nextjs-starter/actions
```

Once the workflow is complete, you can refresh the browser to view your web app.

Now any changes made to the `main` branch start a new build and deployment of your website.

## 4. Sync changes

When you created the app, Azure Static Web Apps created a GitHub Actions file in your repository. Synchronize with the server by pulling down the latest to your local repository.

Return to the terminal and run the following command `git pull origin main`.

### Configuring Static Rendering

By default, the application is treated as a hybrid rendered Next.js application, but to continue using it as a static site generator, you need to update the deployment task.

1. Open the repository in Visual Studio Code.

1. Navigate to the GitHub Actions file that Azure Static Web Apps added to your repository at `.github/workflows/azure-static-web-apps-<your site ID>.yml`

1. Update the _Build and Deploy_ job to have an environment variable of `IS_STATIC_EXPORT` set to `true`:

    ### [GitHub Actions](#tab/github-actions)

    ```yaml
        - name: Build And Deploy
            id: swa
            uses: azure/static-web-apps-deploy@latest
            with:
              azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_TOKEN }}
              repo_token: ${{ secrets.GITHUB_TOKEN }} # Used for GitHub integrations (i.e. PR comments)
              action: "upload"
              app_location: "/" # App source code path
              api_location: "" # Api source code path - optional
              output_location: "" # Built app content directory - optional
            env: # Add environment variables here
              IS_STATIC_EXPORT: true
    ```

    ### [Azure Pipelines](#tab/azure-pipelines)

    ```yaml
        - task: AzureStaticWebApp@0
          inputs:
            azure_static_web_apps_api_token: $(AZURE_STATIC_WEB_APPS_TOKEN)
            ###### Repository/Build Configurations - These values can be configured to match your app requirements. ######
            # For more information regarding Static Web App workflow configurations, please visit: https://aka.ms/swaworkflowconfig
            app_location: "/" # App source code path
            api_location: "" # Api source code path - optional
            output_location: "" # Built app content directory - optional
            is_static_export: true # For running Static Next.js file - optional
    ```

1. Commit the changes to git and push them to GitHub.

    ```bash
    git commit -am "Configuring static site generation" && git push
    ```

Once the build has completed, the site will be statically rendered.

## Clean up resources

If you're not going to continue to use this app, you can delete the Azure Static Web Apps instance through the following steps.

1. Open the [Azure portal](https://portal.azure.com).
1. Search for **my-nextjs-group** from the top search bar.
1. Select on the group name.
1. Select **Delete**.
1. Select **Yes** to confirm the delete action.

## Next steps

> [!div class="nextstepaction"]
> [Set up a custom domain](custom-domain.md)

## Related articles

- [Set up authentication and authorization](authentication-authorization.md)
- [Configure app settings](application-settings.md)
- [Enable monitoring](monitor.md)
- [Azure CLI](https://github.com/Azure/static-web-apps-cli)
