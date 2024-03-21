---
title: Publish revisions with GitHub Actions in Azure Container Apps
description: Learn to automatically create new revisions in Azure Container Apps using a GitHub Actions workflow
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.custom: devx-track-azurecli, ignite-2023
ms.topic: how-to
ms.date: 11/09/2022
ms.author: cshoe
---

# Deploy to Azure Container Apps with GitHub Actions

Azure Container Apps allows you to use GitHub Actions to publish [revisions](revisions.md) to your container app. As commits are pushed to your GitHub repository, a workflow is triggered which updates the container image in the container registry. Azure Container Apps creates a new revision based on the updated container image.

:::image type="content" source="media/github-actions/azure-container-apps-github-actions.png" alt-text="Changes to a GitHub repo trigger an action to create a new revision.":::

The GitHub Actions workflow is triggered by commits to a specific branch in your repository. When creating the workflow, you decide which branch triggers the workflow.

This article shows you how to create a fully customizable workflow. To generate a starter GitHub Actions workflow with Azure CLI, see [Generate GitHub Actions workflow with Azure CLI](github-actions-cli.md).

## Azure Container Apps GitHub action

To build and deploy your container app, you add the [`azure/container-apps-deploy-action`](https://github.com/marketplace/actions/azure-container-apps-build-and-deploy) action to your GitHub Actions workflow.

The action supports the following scenarios:

* Build from a Dockerfile and deploy to Container Apps
* Build from source code without a Dockerfile and deploy to Container Apps. Supported languages include .NET, Java, Node.js, PHP, and Python
* Deploy an existing container image to Container Apps

### Usage examples

Here are some common scenarios for using the action. For more information, see the [action's GitHub Marketplace page](https://github.com/marketplace/actions/azure-container-apps-build-and-deploy).

#### Build and deploy to Container Apps

The following snippet shows how to build a container image from source code and deploy it to Container Apps.

```yaml
steps:

  - name: Log in to Azure
    uses: azure/login@v1
    with:
      creds: ${{ secrets.AZURE_CREDENTIALS }}

  - name: Build and deploy Container App
    uses: azure/container-apps-deploy-action@v1
    with:
      appSourcePath: ${{ github.workspace }}/src
      acrName: myregistry
      containerAppName: my-container-app
      resourceGroup: my-rg
```

The action uses the Dockerfile in `appSourcePath` to build the container image. If no Dockerfile is found, the action attempts to build the container image from source code in `appSourcePath`.

#### Deploy an existing container image to Container Apps

The following snippet shows how to deploy an existing container image to Container Apps.

```yaml
steps:

  - name: Log in to Azure
    uses: azure/login@v1
    with:
      creds: ${{ secrets.AZURE_CREDENTIALS }}

  - name: Build and deploy Container App
    uses: azure/container-apps-deploy-action@v1
    with:
      acrName: myregistry
      containerAppName: my-container-app
      resourceGroup: my-rg
      imageToDeploy: myregistry.azurecr.io/app:${{ github.sha }}
```

> [!IMPORTANT]
> If you're building a container image in a separate step, make sure you use a unique tag such as the commit SHA instead of a stable tag like `latest`. For more information, see [Image tag best practices](../container-registry/container-registry-image-tag-version.md).

### Authenticate with Azure Container Registry

The Azure Container Apps action needs to authenticate with your Azure Container Registry to push the container image. The container app also needs to authenticate with your Azure Container Registry to pull the container image.

To push images, the action automatically authenticates with the container registry specified in `acrName` using the credentials provided to the `azure/login` action.

To pull images, Azure Container Apps uses either managed identity (recommended) or admin credentials to authenticate with the Azure Container Registry. To use managed identity, the container app the action is deploying must be [configured to use managed identity](managed-identity-image-pull.md). To authenticate with the registry's admin credentials, set the action's `acrUsername` and `acrPassword` inputs.

## Configuration

You take the following steps to configure a GitHub Actions workflow to deploy to Azure Container Apps.

> [!div class="checklist"]
> * Create a GitHub repository for your app
> * Create a container app with managed identity enabled
> * Assign the `AcrPull` role for the Azure Container Registry to the container app's managed identity
> * Configure secrets in your GitHub repository
> * Create a GitHub Actions workflow

### Prerequisites

| Requirement  | Instructions |
|--|--|
| Azure account | If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). You need the *Contributor* or *Owner* permission on the Azure subscription to proceed. Refer to [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md?tabs=current) for details. |
| GitHub Account | Sign up for [free](https://github.com/join). |
| Azure CLI | Install the [Azure CLI](/cli/azure/install-azure-cli).|

### Create a GitHub repository and clone source code

Before creating a workflow, the source code for your app must be in a GitHub repository.

1. Log in to Azure with the Azure CLI.

    ```azurecli-interactive
    az login
    ```

1. Next, install the latest Azure Container Apps extension for the CLI.

    ```azurecli-interactive
    az extension add --name containerapp --upgrade
    ```

1. If you do not have your own GitHub repository, create one from a sample.
    1. Navigate to the following location to create a new repository:
        - [https://github.com/Azure-Samples/containerapps-albumapi-csharp/generate](https://github.com/login?return_to=%2FAzure-Samples%2Fcontainerapps-albumapi-csharp%2Fgenerate)
    1. Name your repository `my-container-app`.

1. Clone the repository to your local machine.

    ```git
    git clone https://github.com/<YOUR_GITHUB_ACCOUNT_NAME>/my-container-app.git
    ```

### Create a container app with managed identity enabled

Create your container app using the `az containerapp up` command in the following steps. This command will create Azure resources, build the container image, store the image in a registry, and deploy to a container app.

After you create your app, you can add a managed identity to the app and assign the identity the `AcrPull` role to allow the identity to pull images from the registry.

[!INCLUDE [container-apps-github-devops-setup.md](../../includes/container-apps-github-devops-setup.md)]

### Configure secrets in your GitHub repository

The GitHub workflow requires a secret named `AZURE_CREDENTIALS` to authenticate with Azure. The secret contains the credentials for a service principal with the *Contributor* role on the resource group containing the container app and container registry.

1. Create a service principal with the *Contributor* role on the resource group that contains the container app and container registry.

    ```azurecli-interactive
    az ad sp create-for-rbac \
      --name my-app-credentials \
      --role contributor \
      --scopes /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/my-container-app-rg \
      --json-auth \
      --output json
    ```

    Replace `<SUBSCRIPTION_ID>` with the ID of your Azure subscription. If your container registry is in a different resource group, specify both resource groups in the `--scopes` parameter.

1. Copy the JSON output from the command.

1. In the GitHub repository, navigate to *Settings* > *Secrets* > *Actions* and select **New repository secret**.

1. Enter `AZURE_CREDENTIALS` as the name and paste the contents of the JSON output as the value.

1. Select **Add secret**.

### Create a GitHub Actions workflow

1. In the GitHub repository, navigate to *Actions* and select **New workflow**.

1. Select **Set up a workflow yourself**.

1. Paste the following YAML into the editor.

    ```yaml
    name: Azure Container Apps Deploy

    on:
      push:
        branches:
          - main

    jobs:
      build:
        runs-on: ubuntu-latest

        steps:
          - uses: actions/checkout@v3

          - name: Log in to Azure
            uses: azure/login@v1
            with:
              creds: ${{ secrets.AZURE_CREDENTIALS }}

          - name: Build and deploy Container App
            uses: azure/container-apps-deploy-action@v1
            with:
              appSourcePath: ${{ github.workspace }}/src
              acrName: <ACR_NAME>
              containerAppName: my-container-app
              resourceGroup: my-container-app-rg
    ```

    Replace `<ACR_NAME>` with the name of your Azure Container Registry. Confirm that the branch name under `branches` and values for `appSourcePath`, `containerAppName`, and `resourceGroup` match the values for your repository and Azure resources.

1. Commit the changes to the *main* branch.

A GitHub Actions workflow run should start to build and deploy your container app. To check its progress, navigate to *Actions*.

To deploy a new revision of your app, push a new commit to the *main* branch.
