---
title: Deploy Bicep files by using GitHub Actions
description: In this quickstart, you learn how to deploy Bicep files by using GitHub Actions.
ms.topic: how-to
ms.date: 02/11/2025
ms.custom: github-actions-azure, devx-track-bicep
---

# Quickstart: Deploy Bicep files by using GitHub Actions

[GitHub Actions](https://docs.github.com/en/actions) is a suite of features in GitHub to automate your software development workflows. In this quickstart, you use the [GitHub Actions for Azure Resource Manager deployment](https://github.com/marketplace/actions/deploy-azure-resource-manager-arm-template) to automate deploying a Bicep file to Azure.

It provides a short introduction to GitHub actions and Bicep files. If you want more detailed steps on setting up the GitHub actions and project, see [Deploy Azure resources by using Bicep and GitHub Actions](/training/paths/bicep-github-actions).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A GitHub account. If you don't have one, sign up for [free](https://github.com/join).
- A GitHub repository to store your Bicep files and your workflow files. To create one, see [Creating a new repository](https://docs.github.com/github/creating-cloning-and-archiving-repositories/creating-a-new-repository).

## Create resource group

Create a resource group. Later in this quickstart, you deploy your Bicep file to this resource group.

# [CLI](#tab/CLI)

```azurecli-interactive
az group create -n exampleRG -l westus
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
New-AzResourceGroup -Name exampleRG -Location westus
```
---

## Generate deployment credentials

[!INCLUDE [include](~/reusable-content/github-actions/generate-deployment-credentials.md)]


## Configure the GitHub secrets

[!INCLUDE [include](~/reusable-content/github-actions/create-secrets-with-openid.md)]


## Add a Bicep file

Add a Bicep file to your GitHub repository. The following Bicep file creates a storage account:

```bicep
@minLength(3)
@maxLength(11)
param storagePrefix string

@allowed([
  'Standard_LRS'
  'Standard_GRS'
  'Standard_RAGRS'
  'Standard_ZRS'
  'Premium_LRS'
  'Premium_ZRS'
  'Standard_GZRS'
  'Standard_RAGZRS'
])
param storageSKU string = 'Standard_LRS'

param location string = resourceGroup().location

var uniqueStorageName = '${storagePrefix}${uniqueString(resourceGroup().id)}'

resource stg 'Microsoft.Storage/storageAccounts@2023-04-01' = {
  name: uniqueStorageName
  location: location
  sku: {
    name: storageSKU
  }
  kind: 'StorageV2'
  properties: {
    supportsHttpsTrafficOnly: true
  }
}

output storageEndpoint object = stg.properties.primaryEndpoints
```

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

    # [OpenID Connect](#tab/openid)

    ```yml
    on: [push]
    name: Azure ARM
    permissions:
      id-token: write
      contents: read
    jobs:
      build-and-deploy:
        runs-on: ubuntu-latest
        steps:

          # Checkout code
        - uses: actions/checkout@main

          # Log into Azure
        - uses: azure/login@v2
          with:
            client-id: ${{ secrets.AZURE_CLIENT_ID }}
            tenant-id: ${{ secrets.AZURE_TENANT_ID }}
            subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}

          # Deploy Bicep file
        - name: deploy
          uses: azure/arm-deploy@v1
          with:
            subscriptionId: ${{ secrets.AZURE_SUBSCRIPTION }}
            resourceGroupName: ${{ secrets.AZURE_RG }}
            template: ./main.bicep
            parameters: 'storagePrefix=mystore storageSKU=Standard_LRS'
            failOnStdErr: false
    ```

    # [Service principal](#tab/userlevel)

    ```yml
    name: Deploy Bicep file
    on: [push]
    jobs:
      build-and-deploy:
        runs-on: ubuntu-latest
        steps:

        - name: Checkout code
          uses: actions/checkout@main

        - name: Log into Azure
          uses: azure/login@v2
          with:
            creds: ${{ secrets.AZURE_CREDENTIALS }}

        - name: Deploy Bicep file
          uses: azure/arm-deploy@v1
          with:
            subscriptionId: ${{ secrets.AZURE_SUBSCRIPTION }}
            resourceGroupName: ${{ secrets.AZURE_RG }}
            template: ./main.bicep
            parameters: 'storagePrefix=mystore storageSKU=Standard_LRS'
            failOnStdErr: false
    ```

    Replace `mystore` with your own storage account name prefix.

    > [!NOTE]
    > You can specify a JSON format parameters file instead in the ARM Deploy action (example: `.azuredeploy.parameters.json`).

    The first section of the workflow file includes:

    - **name**: The name of the workflow.
    - **on**: The name of the GitHub events that triggers the workflow. The workflow is triggered when there's a push event on the main branch.

    ---



1. Select **Commit changes**.
1. Select **Commit directly to the main branch**.
1. Select **Commit new file** (or **Commit changes**).

Updating either the workflow file or Bicep file triggers the workflow. The workflow starts right after you commit the changes.

## Check workflow status

1. Select the **Actions** tab. You see a **Create deployBicepFile.yml** workflow listed. It takes 1-2 minutes to run the workflow.
1. Select the workflow to open it, and verify the `Status` is `Success`.

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
