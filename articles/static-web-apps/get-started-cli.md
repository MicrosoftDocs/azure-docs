---
title: "Quickstart: Building your first static site with the Azure Static Web Apps using the CLI"
description: Learn to deploy a static site to Azure Static Web Apps with the Azure CLI.
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  quickstart
ms.date: 08/13/2020
ms.author: cshoe
---

# Quickstart: Building your first static site using the Azure CLI

Azure Static Web Apps publishes a website to a production environment by building apps from a GitHub repository. In this quickstart, you deploy a web application to Azure Static Web apps using the Azure CLI.

If you don't have an Azure subscription, [create a free trial account](https://azure.microsoft.com/free).

## Prerequisites

- [GitHub](https://github.com) account
- [GitHub personal access token](https://docs.github.com/github/authenticating-to-github/creating-a-personal-access-token)
- [Azure](https://portal.azure.com) account
- [Azure CLI](/cli/azure/install-azure-cli) installed (version 2.8.0 and higher)

[!INCLUDE [create repository from template](../../includes/static-web-apps-get-started-create-repo.md)]

[!INCLUDE [clone the repository](../../includes/static-web-apps-get-started-clone-repo.md)]

Next, switch to the new folder using the following command.

```bash
cd my-first-static-web-app
```

## Create a static web app

Now that the repository is created, you can create a static web app from the Azure CLI.

> [!IMPORTANT]
> Make sure you are in the _my-first-static-web-app_ folder in your terminal.

1. Sign in to the Azure CLI by using the following command.

    ```azurecli
    az login
    ```

1. Create a new static web app from your repository.

    # [No Framework](#tab/vanilla-javascript)

    ```azurecli
    az staticwebapp create \
        -n my-first-static-web-app \
        -g <RESOURCE_GROUP_NAME> \
        -s https://github.com/<YOUR_GITHUB_ACCOUNT_NAME>/my-first-static-web-app \
        -l <LOCATION> \
        -b main \
        --token <YOUR_GITHUB_PERSONAL_ACCESS_TOKEN>
    ```

    # [Angular](#tab/angular)

    ```azurecli
    az staticwebapp create \
        -n my-first-static-web-app \
        -g <RESOURCE_GROUP_NAME> \
        -s https://github.com/<YOUR_GITHUB_ACCOUNT_NAME>/my-first-static-web-app \
        -l <LOCATION> \
        -b main \
        --app-artifact-location "dist/angular-basic" \
        --token <YOUR_GITHUB_PERSONAL_ACCESS_TOKEN>
    ```

    # [React](#tab/react)

    ```azurecli
    az staticwebapp create \
        -n my-first-static-web-app \
        -g <RESOURCE_GROUP_NAME> \
        -s https://github.com/<YOUR_GITHUB_ACCOUNT_NAME>/my-first-static-web-app \
        -l <LOCATION> \
        -b main \
        --app-artifact-location "build" \
        --token <YOUR_GITHUB_PERSONAL_ACCESS_TOKEN>
    ```

    # [Vue](#tab/vue)

    ```azurecli
    az staticwebapp create \
        -n my-first-static-web-app \
        -g <RESOURCE_GROUP_NAME> \
        -s https://github.com/<YOUR_GITHUB_ACCOUNT_NAME>/my-first-static-web-app \
        -l <LOCATION> \
        -b main \
        --app-artifact-location "dist" \
        --token <YOUR_GITHUB_PERSONAL_ACCESS_TOKEN>
    ```

    ---
    
    > [!IMPORTANT]
    > The URL passed to the `s` parameter must not include the `.git` suffix.

    - `<RESOURCE_GROUP_NAME>`: Replace this value with an existing [Azure resource group name](../azure-resource-manager/management/manage-resources-cli.md).

      - See the [az group](https://docs.microsoft.com/cli/azure/group?view=azure-cli-latest#az_group_list) documentation for details on listing resource groups.

    - `<YOUR_GITHUB_ACCOUNT_NAME>`: Replace this value with your GitHub username.

    - `<LOCATION>`: Replace this value with the location nearest you. Options include: _CentralUS_, _EastAsia_, _EastUS2_, _WestEurope_, and _WestUS2_.

    - `<YOUR_GITHUB_PERSONAL_ACCESS_TOKEN>`: Replace this  value with the [GitHub personal access token](https://docs.github.com/github/authenticating-to-github/creating-a-personal-access-token) you previously generated.

    You can now view the created app in Azure.

1. Open the [Azure portal](https://portal.azure.com).

1. Search for **my-first-web-static-app** from the top search bar.

1. Select **my-first-web-static-app**.

[!INCLUDE [view website](../../includes/static-web-apps-get-started-view-website.md)]

## Clean up resources

If you're not going to continue to use this application, you can delete the Azure Static Web Apps instance by running the following command:

```azurecli
az staticwebapp delete \
    --name my-first-static-web-app \
    --resource-group my-first-static-web-app
```

## Next steps

> [!div class="nextstepaction"]
> [Add an API](add-api.md)
