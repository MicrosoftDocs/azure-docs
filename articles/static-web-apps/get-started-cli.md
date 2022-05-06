---
title: "Quickstart: Building your first static site with the Azure Static Web Apps using the CLI"
description: Learn to deploy a static site to Azure Static Web Apps with the Azure CLI.
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  quickstart
ms.date: 11/17/2021
ms.author: cshoe
ms.custom: mode-api, devx-track-azurecli 
ms.devlang: azurecli
---

# Quickstart: Building your first static site using the Azure CLI

Azure Static Web Apps publishes a website to a production environment by building apps from a GitHub repository. In this quickstart, you deploy a web application to Azure Static Web apps using the Azure CLI.

If you don't have an Azure subscription, [create a free trial account](https://azure.microsoft.com/free).

## Prerequisites

- [GitHub](https://github.com) account
- [Azure](https://portal.azure.com) account
- [Azure CLI](/cli/azure/install-azure-cli) installed (version 2.29.0 or higher)

[!INCLUDE [create repository from template](../../includes/static-web-apps-get-started-create-repo.md)]

## Create a static web app

Now that the repository is created, you can create a static web app from the Azure CLI.

1. Sign in to the Azure CLI by using the following command.

    ```azurecli
    az login
    ```

1. Create a resource group.

    ```azurecli
    az group create \
      --name my-swa-group \
      --location "eastus2"
    ```

1. Create a variable to hold your GitHub user name.

    ```bash
    GITHUB_USER_NAME=<YOUR_GITHUB_USER_NAME>
    ```

    Replace the placeholder `<YOUR_GITHUB_USER_NAME>` with your GitHub user name.

1. Create a new static web app from your repository.

    # [No Framework](#tab/vanilla-javascript)

    ```azurecli
    az staticwebapp create \
        --name my-first-static-web-app \
        --resource-group my-swa-group \
        --source https://github.com/$GITHUB_USER_NAME/my-first-static-web-app \
        --location "eastus2" \
        --branch main \
        --app-location "src" \
        --login-with-github
    ```

    # [Angular](#tab/angular)

    ```azurecli
    az staticwebapp create \
        --name my-first-static-web-app \
        --resource-group my-swa-group \
        --source https://github.com/$GITHUB_USER_NAME/my-first-static-web-app \
        --location "eastus2" \
        --branch main \
        --app-location "/" \
        --output-location "dist/angular-basic" \
        --login-with-github
    ```

    # [Blazor](#tab/blazor)

    ```azurecli
    az staticwebapp create \
        --name my-first-static-web-app \
        --resource-group my-swa-group \
        --source https://github.com/$GITHUB_USER_NAME/my-first-static-web-app \
        --location "eastus2" \
        --branch main \
        --app-location "Client" \
        --output-location "wwwroot"  \
        --login-with-github
    ```

    # [React](#tab/react)

    ```azurecli
    az staticwebapp create \
        --name my-first-static-web-app \
        --resource-group my-swa-group \
        --source https://github.com/$GITHUB_USER_NAME/my-first-static-web-app \
        --location "eastus2" \
        --branch main \
        --app-location "/"  \
        --output-location "build"  \
        --login-with-github
    ```

    # [Vue](#tab/vue)

    ```azurecli
    az staticwebapp create \
        --name my-first-static-web-app \
        --resource-group my-swa-group \
        --source https://github.com/$GITHUB_USER_NAME/my-first-static-web-app \
        --location "eastus2" \
        --branch main \
        --app-location "/" \
        --output-location "dist"  \
        --login-with-github
    ```

    ---

    > [!IMPORTANT]
    > The URL passed to the `--source` parameter must not include the `.git` suffix.

    As you execute this command, the CLI starts GitHub interactive login experience. Look for a line in your console that resembles the following message.

    > Please navigate to `https://github.com/login/device` and enter the user code 329B-3945 to activate and retrieve your GitHub personal access token.

1. Navigate to **https://github.com/login/device**.

1. Enter the user code as displayed your console's message.

1. Select the **Continue** button.

1. Select the **Authorize AzureAppServiceCLI** button.

## View the website

There are two aspects to deploying a static app. The first operation creates the underlying Azure resources that make up your app. The second is a GitHub Actions workflow that builds and publishes your application.

Before you can navigate to your new static site, the deployment build must first finish running.

1. Return to your console window and run the following command to list the URLs associated with your app.

    ```azurecli
    az staticwebapp show \
      --name  my-first-static-web-app \
      --query "repositoryUrl"
    ```

    The output of this command returns the URL to your GitHub repository.

1. Copy the **repository URL** and paste it into the browser.

1. Select the **Actions** tab.

    At this point, Azure is creating the resources to support your static web app. Wait until the icon next to the running workflow turns into a check mark with green background (:::image type="icon" source="media/get-started-cli/checkmark-green-circle.png" border="false":::). This operation may take a few minutes to complete.

    Once the success icon appears, the workflow is complete and you can return back to your console window.

1. Run the following command to query for your website's URL.

    ```azurecli
    az staticwebapp show \
      --name my-first-static-web-app \
      --query "defaultHostname"
    ```

    Copy the URL into the browser and navigate to your website.

## Clean up resources

If you're not going to continue to use this application, you can delete the resource group and the static web app by running the following command:

```azurecli
az group delete \
  --name my-swa-group
```

## Next steps

> [!div class="nextstepaction"]
> [Add an API](add-api.md)
