---
title: Publish revisions with GitHub Actions in Azure Container Apps
description: Learn to automatically create new revisions using GitHub Actions in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: how-to
ms.date: 11/09/2022
ms.author: cshoe
---

# Set up GitHub Actions in Azure Container Apps

Azure Container Apps allows you to use GitHub Actions to publish [revisions](revisions.md) to your container app. As commits are pushed to your GitHub repository, a GitHub Actions workflow is triggered which updates the [container](containers.md) image in the container registry. Once the container is updated in the registry, Azure Container Apps creates a new revision based on the updated container image.

:::image type="content" source="media/github-actions/azure-container-apps-github-actions.png" alt-text="Changes to a GitHub repo trigger an action to create a new revision.":::

The GitHub Actions workflow is triggered by commits to a specific branch in your repository. When creating the workflow, you decide which branch triggers the action.

This article shows you how to create your own workflow that you can fully customize. To generate a starter GitHub Actions workflow with Azure CLI, see [Generate GitHub Actions workflow with Azure CLI](github-actions-cli.md).

## Container Apps action

To build and deploy your container app, you add the [`azure/container-apps-deploy-action`](https://github.com/marketplace/actions/oryx-builder-github-action) action to your GitHub Actions workflow. It supports the following scenarios:

* Build from a Dockerfile and deploy to Container Apps.
* Build from source code without a Dockerfile and deploy to Container Apps. Supported languages include .NET, Node.js, PHP, Python, and Ruby.
* Deploy an existing container image to Container Apps.

Here are some common scenarios for using the action. For more information, see the [action's GitHub Marketplace page](https://github.com/marketplace/actions/oryx-builder-github-action).

### Build and deploy to Container Apps

The following snippet shows how to build a container image and deploy it to Container Apps.

```yaml
steps:

  - name: Log in to Azure
    uses: azure/login@v1
    with:
      creds: ${{ secrets.AZURE_CREDENTIALS }}

  - name: Build and deploy Container App
    uses: azure/container-apps-deploy-action@v0
    with:
      appSourcePath: ${{ github.workspace }}/src
      acrName: mytestacr
      containerAppName: my-test-container-app
      resourceGroup: my-test-rg
      containerAppEnvironment: my-test-container-app-env
```

The action uses the Dockerfile in `appSourcePath` to build the container image. If no Dockerfile is found, the action attempts to build the container image from source code in `appSourcePath`.

### Deploy an existing container image to Container Apps

The following snippet shows how to deploy an existing container image to Container Apps.

```yaml
steps:

  - name: Log in to Azure
    uses: azure/login@v1
    with:
      creds: ${{ secrets.AZURE_CREDENTIALS }}
        
  - name: Build and deploy Container App
    uses: azure/container-apps-deploy-action@v0
    with:
      appSourcePath: ${{ github.workspace }}
      acrName: mytestacr
      imageToDeploy: mytestacr.azurecr.io/app:latest
```

### Authenticate with Azure Container Registry

To deploy and run your app, the action needs to authenticate with your Azure Container Registry to push the container image and the container app needs to authenticate with your Azure Container Registry to pull the container image.

To push the image, the action automatically authenticates with the container registry specified in `acrName` using the credentials provided to the `azure/login` action.

To pull the image, Azure Container Apps uses either managed identity (recommended) or admin credentials to authenticate with the Azure Container Registry. To use managed identity, the container app the action is deploying to must be [configured to use managed identity](managed-identity-image-pull.md). To authenticate with the registry's admin credentials, set the action's `acrUsername` and `acrPassword` inputs.

