---
title: "Quickstart: Building your first static site with the Azure Static Web Apps using the CLI"
description: Learn to deploy a static site to Azure Static Web Apps with the Azure CLI.
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  quickstart
ms.date: 08/03/2022
ms.author: cshoe
ms.custom: mode-api, devx-track-azurecli 
ms.devlang: azurecli
---

# Quickstart: Building your first static site using the Azure CLI

Azure Static Web Apps publishes websites to production by building apps from a code repository.

In this quickstart, you deploy a web application to Azure Static Web apps using the Azure CLI.

## Prerequisites

- [GitHub](https://github.com) account
- [Azure](https://portal.azure.com) account.
  - If you don't have an Azure subscription, you can [create a free trial account](https://azure.microsoft.com/free).
- [Azure CLI](/cli/azure/install-azure-cli) installed (version 2.29.0 or higher)
- [A Git setup](https://www.git-scm.com/downloads). 

[!INCLUDE [create repository from template](../../includes/static-web-apps-get-started-create-repo.md)]

## Deploy a static web app

Now that the repository is generated from the template, you can deploy the app as a static web app from the Azure CLI.

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

    Before you execute the following command, replace the placeholder `<YOUR_GITHUB_USER_NAME>` with your GitHub user name.

    ```bash
    GITHUB_USER_NAME=<YOUR_GITHUB_USER_NAME>
    ```

1. Deploy a new static web app from your repository.

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

    As you execute this command, the CLI starts the GitHub interactive log in experience. Look for a line in your console that resembles the following message.

    > Go to `https://github.com/login/device` and enter the user code 329B-3945 to activate and retrieve your GitHub personal access token.

1. Go to **https://github.com/login/device**.

1. Enter the user code as displayed your console's message.

2. Select **Continue**.

3. Select **Authorize AzureAppServiceCLI**.

## View the website

There are two aspects to deploying a static app. The first operation creates the underlying Azure resources that make up your app. The second is a workflow that builds and publishes your application.

Before you can go to your new static site, the deployment build must first finish running.

1. Return to your console window and run the following command to list the URLs associated with your app.

    ```azurecli
    az staticwebapp show \
      --name  my-first-static-web-app \
      --query "repositoryUrl"
    ```

    The output of this command returns the URL to your GitHub repository.

1. Copy the **repository URL** and paste it into your browser.

1. Select the **Actions** tab.

    At this point, Azure is creating the resources to support your static web app. Wait until the icon next to the running workflow turns into a check mark with green background (:::image type="icon" source="media/get-started-cli/checkmark-green-circle.png" border="false":::). This operation may take a few minutes to complete.

    Once the success icon appears, the workflow is complete and you can return back to your console window.

1. Run the following command to query for your website's URL.

    ```azurecli
    az staticwebapp show \
      --name my-first-static-web-app \
      --query "defaultHostname"
    ```

    Copy the URL into your browser to go to your website.

## Clean up resources

If you're not going to continue to use this application, you can delete the resource group and the static web app by running the following command:

```azurecli
az group delete \
  --name my-swa-group
```

## Next steps

> [!div class="nextstepaction"]
> [Add an API](add-api.md)
