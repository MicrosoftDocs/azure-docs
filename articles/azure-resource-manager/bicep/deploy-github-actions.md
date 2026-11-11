---
title: Deploy Bicep files by using GitHub Actions
description: In this quickstart, you learn how to deploy Bicep files by using GitHub Actions.
ms.topic: quickstart
ms.date: 11/10/2026
ms.custom: github-actions-azure, devx-track-bicep
---

# Quickstart: Deploy Bicep files by using GitHub Actions

[GitHub Actions](https://docs.github.com/en/actions) is a suite of features in GitHub to automate your software development workflows. In this quickstart, you use the [Bicep Deploy action](https://github.com/Azure/bicep-deploy) (`azure/bicep-deploy`), the recommended action for deploying Bicep files, to automate deploying a Bicep file to Azure.

It provides a short introduction to GitHub actions and Bicep files. If you want more detailed steps on setting up the GitHub actions and project, see [Deploy Azure resources by using Bicep and GitHub Actions](/training/paths/bicep-github-actions).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
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

## Configure Azure authentication

Use OpenID Connect (OIDC) to authenticate the workflow to Azure without storing a client secret. Follow [Authenticate to Azure from GitHub Actions by OpenID Connect](/azure/developer/github/connect-from-azure-openid-connect) to configure an identity, grant it the permissions required to deploy to `exampleRG`, and create a federated identity credential for your GitHub repository. Ensure the federated credential matches the branch or environment that runs your workflow.

Follow the principle of least privilege: scope the workflow identity's Azure role-based access control (RBAC) role assignments to the `exampleRG` resource group, rather than the entire subscription. Grant only the roles and permissions required for the deployment operations you use. For more information, see [Azure RBAC best practices](/azure/role-based-access-control/best-practices#only-grant-the-access-users-need).

Add the following repository secrets as described in the OIDC guide:

- `AZURE_CLIENT_ID`: The application or user-assigned managed identity client ID.
- `AZURE_TENANT_ID`: Your Microsoft Entra tenant ID.
- `AZURE_SUBSCRIPTION_ID`: Your Azure subscription ID.

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

resource stg 'Microsoft.Storage/storageAccounts@2025-06-01' = {
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

You can put the file anywhere in the repository. The examples in this quickstart assume the Bicep file is named **main.bicep**, and it's stored at the root of your repository.

## Add a Bicep parameter file

Add a [Bicep parameter file](parameter-files.md) named **main.bicepparam** at the root of your repository:

```bicep
using './main.bicep'

param storagePrefix = 'mystore'
param storageSKU = 'Standard_LRS'
```

Replace `mystore` with your own storage account name prefix. The `using` statement associates the parameter file with **main.bicep**, so the workflows only need to specify the parameter file.

## Create workflow

A workflow defines the steps to execute when triggered. It's a YAML (.yml) file in the **.github/workflows/** path of your repository. The workflow file extension can be either **.yml** or **.yaml**.

To create a workflow, take the following steps:

1. From your GitHub repository, select **Actions** from the top menu.
1. Select **New workflow**.
1. Select **set up a workflow yourself**.
1. Rename the workflow file if you prefer a different name other than **main.yml**. For example: **deployBicepFile.yml**.

## Deploy Bicep files

The Bicep Deploy action deploys Bicep files and accepts `.bicepparam` files directly, without requiring you to precompile them to JSON ARM templates. It automatically installs the Bicep CLI. To select a specific CLI version, set the `bicep-version` input. The action supports:

- **Standard deployments** at resource group, subscription, management group, and tenant scopes.
- **[Deployment stacks](deployment-stacks.md)** at resource group, subscription, and management group scopes, with settings to control resource protection and what happens to resources that are no longer managed.
- **[What-if operations](deploy-what-if.md)** to preview changes before applying them.
- **Validation** of Bicep templates before deployment.

The following examples deploy to the existing `exampleRG` resource group and use the **main.bicepparam** file you created earlier.

### Deploy a Bicep file

1. Replace the content of the yml file with the following code:

    ```yml
    on: [push]
    name: Deploy Bicep file
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
          uses: azure/bicep-deploy@v2
          with:
            type: deployment
            operation: create
            scope: resourceGroup
            subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
            resource-group-name: exampleRG
            parameters-file: ./main.bicepparam
    ```

    If you used a different resource group name, replace `exampleRG` with that name.

    For the full list of inputs and examples, see the [Bicep Deploy action reference](https://github.com/Azure/bicep-deploy#inputs).

    The first section of the workflow file includes:

    - **name**: The name of the workflow.
    - **on**: The GitHub events that trigger the workflow. This workflow is triggered when there's a push event on any branch.

1. Select **Commit changes**.
1. Select **Commit directly to the main branch**.
1. Select **Commit new file** (or **Commit changes**).

Updating the workflow file, Bicep file, or Bicep parameter file triggers the workflow. The workflow starts right after you commit the changes.

### Check workflow status

1. Select the **Actions** tab. You see a **Create deployBicepFile.yml** workflow listed. It takes 1-2 minutes to run the workflow.
1. Select the workflow to open it, and verify the `Status` is `Success`.

### Preview changes with what-if

To preview changes without deploying resources, replace the deployment step in the workflow with the following step. Keep the checkout and Azure login steps.

```yml
- name: Preview changes
  uses: azure/bicep-deploy@v2
  with:
    type: deployment
    operation: whatIf
    scope: resourceGroup
    subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
    resource-group-name: exampleRG
    parameters-file: ./main.bicepparam
```

Review the what-if results in the workflow logs. To apply the changes, change `operation` back to `create` and run the workflow again. For more information about interpreting the results, see [Preview changes with what-if](deploy-what-if.md).

### Deploy a deployment stack

To manage resources as a [deployment stack](deployment-stacks.md), replace the deployment step with the following step. Keep the checkout and Azure login steps, and use the same **main.bicepparam** file as in your deployment.

```yml
- name: Deploy stack
  uses: azure/bicep-deploy@v2
  with:
    type: deploymentStack
    operation: create
    name: storage-stack
    scope: resourceGroup
    subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
    resource-group-name: exampleRG
    parameters-file: ./main.bicepparam
    action-on-unmanage-resources: detach
    deny-settings-mode: none
```

This step creates or updates the `storage-stack` deployment stack. The `detach` setting leaves resources in Azure when you remove them from the template or delete the stack. To delete those resources, set `action-on-unmanage-resources` to `delete`. The `none` deny setting doesn't restrict changes to managed resources outside the stack. For details about resource protection, see [Deny settings](deployment-stacks.md#protect-managed-resources).

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
