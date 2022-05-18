---
title: Deploy Bicep files by using GitHub Actions
description: In this quickstart, you learn how to deploy Bicep files by using GitHub Actions.
author: mumian
ms.author: jgao
ms.topic: conceptual
ms.date: 11/16/2021
ms.custom: github-actions-azure
---

# Quickstart: Deploy Bicep files by using GitHub Actions

[GitHub Actions](https://docs.github.com/en/actions) is a suite of features in GitHub to automate your software development workflows.

In this quickstart, you use the [GitHub Actions for Azure Resource Manager deployment](https://github.com/marketplace/actions/deploy-azure-resource-manager-arm-template) to automate deploying a Bicep file to Azure.

It provides a short introduction to GitHub Actions and Bicep files. If you want more detailed steps on setting up the GitHub Actions and project, see [Learning path: Deploy Azure resources by using Bicep and GitHub Actions](/learn/paths/bicep-github-actions).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A GitHub account. If you don't have one, sign up for [free](https://github.com/join).
- A GitHub repository to store your Bicep files and your workflow files. To create one, see [Creating a new repository](https://docs.github.com/github/creating-cloning-and-archiving-repositories/creating-a-new-repository).

## Create resource group

Create a resource group. Later in this quickstart, you'll deploy your Bicep file to this resource group.

```azurecli-interactive
az group create -n exampleRG -l westus
```

## Generate deployment credentials

Your GitHub Actions runs under an identity. Use the [az ad sp create-for-rbac](/cli/azure/ad/sp#az-ad-sp-create-for-rbac) command to create a [service principal](../../active-directory/develop/app-objects-and-service-principals.md#service-principal-object) for the identity.

Replace the placeholder `myApp` with the name of your application. Replace `{subscription-id}` with your subscription ID.

```azurecli-interactive
az ad sp create-for-rbac --name myApp --role contributor --scopes /subscriptions/{subscription-id}/resourceGroups/exampleRG --sdk-auth
```

> [!IMPORTANT]
> The scope in the previous example is limited to the resource group. We recommend that you grant minimum required access.

The output is a JSON object with the role assignment credentials that provide access to your App Service app similar to below. Copy this JSON object for later. You'll only need the sections with the `clientId`, `clientSecret`, `subscriptionId`, and `tenantId` values.

```output
  {
    "clientId": "<GUID>",
    "clientSecret": "<GUID>",
    "subscriptionId": "<GUID>",
    "tenantId": "<GUID>",
    (...)
  }
```

## Configure the GitHub secrets

Create secrets for your Azure credentials, resource group, and subscriptions.

1. In [GitHub](https://github.com/), navigate to your repository.

1. Select **Settings > Secrets > New secret**.

1. Paste the entire JSON output from the Azure CLI command into the secret's value field. Name the secret `AZURE_CREDENTIALS`.

1. Create another secret named `AZURE_RG`. Add the name of your resource group to the secret's value field (`exampleRG`).

1. Create another secret named `AZURE_SUBSCRIPTION`. Add your subscription ID to the secret's value field (example: `90fd3f9d-4c61-432d-99ba-1273f236afa2`).

## Add a Bicep file

Add a Bicep file to your GitHub repository. The following Bicep file creates a storage account:

::: code language="bicep" source="~/azure-docs-bicep-samples/samples/create-storage-account/azuredeploy.bicep" :::

The Bicep file requires one parameter called **storagePrefix** with 3 to 11 characters.

You can put the file anywhere in the repository. The workflow sample in the next section assumes the Bicep file is named **main.bicep**, and it's stored at the root of your repository.

## Create workflow

A workflow defines the steps to execute when triggered. It's a YAML (.yml) file in the **.github/workflows/** path of your repository. The workflow file extension can be either **.yml** or **.yaml**.

To create a workflow, take the following steps:

1. From your GitHub repository, select **Actions** from the top menu.
1. Select **New workflow**.
1. Select **set up a workflow yourself**.
1. Rename the workflow file if you prefer a different name other than **main.yml**. For example: **deployBicepFile.yml**.
1. Replace the content of the yml file with the following code:

    ```yml
    on: [push]
    name: Azure ARM
    jobs:
      build-and-deploy:
        runs-on: ubuntu-latest
        steps:

          # Checkout code
        - uses: actions/checkout@main

          # Log into Azure
        - uses: azure/login@v1
          with:
            creds: ${{ secrets.AZURE_CREDENTIALS }}

          # Deploy Bicep file
        - name: deploy
          uses: azure/arm-deploy@v1
          with:
            subscriptionId: ${{ secrets.AZURE_SUBSCRIPTION }}
            resourceGroupName: ${{ secrets.AZURE_RG }}
            template: ./main.bicep
            parameters: storagePrefix=mystore
            failOnStdErr: false
    ```

    Replace `mystore` with your own storage account name prefix.

    > [!NOTE]
    > You can specify a JSON format parameters file instead in the ARM Deploy action (example: `.azuredeploy.parameters.json`).

    The first section of the workflow file includes:

    - **name**: The name of the workflow.
    - **on**: The name of the GitHub events that triggers the workflow. The workflow is triggered when there's a push event on the main branch.

1. Select **Start commit**.
1. Select **Commit directly to the main branch**.
1. Select **Commit new file** (or **Commit changes**).

Updating either the workflow file or Bicep file triggers the workflow. The workflow starts right after you commit the changes.

## Check workflow status

1. Select the **Actions** tab. You'll see a **Create deployStorageAccount.yml** workflow listed. It takes 1-2 minutes to run the workflow.
1. Select the workflow to open it.
1. Select **Run ARM deploy** from the menu to verify the deployment.

## Clean up resources

When your resource group and repository are no longer needed, clean up the resources you deployed by deleting the resource group and your GitHub repository.

# [CLI](#tab/CLI)

```azurecli
az group delete --name exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell
Remove-AzResourceGroup -Name exampleRG
```

---

## Next steps

> [!div class="nextstepaction"]
> [Bicep file structure and syntax](file.md)
