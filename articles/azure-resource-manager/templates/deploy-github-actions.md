---
title: Deploy Resource Manager templates by using GitHub Actions
description: Describes how to deploy Azure Resource Manager templates (ARM templates) by using GitHub Actions.
ms.topic: conceptual
ms.date: 06/23/2023
ms.custom: github-actions-azure, devx-track-arm-template
---

# Deploy ARM templates by using GitHub Actions

[GitHub Actions](https://docs.github.com/en/actions) is a suite of features in GitHub to automate your software development workflows in the same place you store code and collaborate on pull requests and issues.

Use the [Deploy Azure Resource Manager Template Action](https://github.com/marketplace/actions/deploy-azure-resource-manager-arm-template) to automate deploying an Azure Resource Manager template (ARM template) to Azure.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A GitHub account. If you don't have one, sign up for [free](https://github.com/join).

  - A GitHub repository to store your Resource Manager templates and your workflow files. To create one, see [Creating a new repository](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/creating-a-new-repository).

## Workflow file overview

A workflow is defined by a YAML (.yml) file in the `/.github/workflows/` path in your repository. This definition contains the various steps and parameters that make up the workflow.

The file has two sections:

|Section  |Tasks  |
|---------|---------|
|**Authentication** | 1. Generate deployment credentials. |
|**Deploy** | 1. Deploy the Resource Manager template. |

## Generate deployment credentials

[!INCLUDE [include](~/reusable-content/github-actions/generate-deployment-credentials.md)]

## Configure the GitHub secrets

[!INCLUDE [include](~/reusable-content/github-actions/create-secrets-with-openid.md)]

## Add Resource Manager template

Add a Resource Manager template to your GitHub repository. This template creates a storage account.

```url
https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.storage/storage-account-create/azuredeploy.json
```

You can put the file anywhere in the repository. The workflow sample in the next section assumes the template file is named **azuredeploy.json**, and it is stored at the root of your repository.

## Create workflow

The workflow file must be stored in the **.github/workflows** folder at the root of your repository. The workflow file extension can be either **.yml** or **.yaml**.

1. From your GitHub repository, select **Actions** from the top menu.
1. Select **New workflow**.
1. Select **set up a workflow yourself**.
1. Rename the workflow file if you prefer a different name other than **main.yml**. For example: **deployStorageAccount.yml**.
1. Replace the content of the yml file with the following:
  # [Service principal](#tab/userlevel)

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

          # Deploy ARM template
        - name: Run ARM deploy
          uses: azure/arm-deploy@v1
          with:
            subscriptionId: ${{ secrets.AZURE_SUBSCRIPTION }}
            resourceGroupName: ${{ secrets.AZURE_RG }}
            template: ./azuredeploy.json
            parameters: storageAccountType=Standard_LRS

          # output containerName variable from template
        - run: echo ${{ steps.deploy.outputs.containerName }}
  ```

  > [!NOTE]
  > You can specify a JSON format parameters file instead in the ARM Deploy action (example: `.azuredeploy.parameters.json`).

  The first section of the workflow file includes:

  - **name**: The name of the workflow.
  - **on**: The name of the GitHub events that triggers the workflow. The workflow is trigger when there is a push event on the main branch, which modifies at least one of the two files specified. The two files are the workflow file and the template file.

  # [OpenID Connect](#tab/openid)

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
            client-id: ${{ secrets.AZURE_CLIENT_ID }}
            tenant-id: ${{ secrets.AZURE_TENANT_ID }}
            subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}

          # Deploy ARM template
        - name: Run ARM deploy
          uses: azure/arm-deploy@v1
          with:
            subscriptionId: ${{ secrets.AZURE_SUBSCRIPTION }}
            resourceGroupName: ${{ secrets.AZURE_RG }}
            template: ./azuredeploy.json
            parameters: storageAccountType=Standard_LRS

          # output containerName variable from template
        - run: echo ${{ steps.deploy.outputs.containerName }}
  ```

  > [!NOTE]
  > You can specify a JSON format parameters file instead in the ARM Deploy action (example: `.azuredeploy.parameters.json`).

  The first section of the workflow file includes:

  - **name**: The name of the workflow.
  - **on**: The name of the GitHub events that triggers the workflow. The workflow is trigger when there is a push event on the main branch, which modifies at least one of the two files specified. The two files are the workflow file and the template file.
  ---

1. Select **Start commit**.
1. Select **Commit directly to the main branch**.
1. Select **Commit new file** (or **Commit changes**).

Because the workflow is configured to be triggered by either the workflow file or the template file being updated, the workflow starts right after you commit the changes.

## Check workflow status

1. Select the **Actions** tab. You will see a **Create deployStorageAccount.yml** workflow listed. It takes 1-2 minutes to run the workflow.
1. Select the workflow to open it.
1. Select **Run ARM deploy** from the menu to verify the deployment.

## Clean up resources

When your resource group and repository are no longer needed, clean up the resources you deployed by deleting the resource group and your GitHub repository.

## Next steps

> [!div class="nextstepaction"]
> [Create your first ARM template](./template-tutorial-create-first-template.md)

> [!div class="nextstepaction"]
> [Learn module: Automate the deployment of ARM templates by using GitHub Actions](/training/modules/deploy-templates-command-line-github-actions/)
