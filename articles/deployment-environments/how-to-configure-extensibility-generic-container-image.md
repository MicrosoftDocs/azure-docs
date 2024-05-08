---
title: ADE extensibility model for custom container images
titleSuffix: Azure Deployment Environments
description: Learn how to use the ADE extensibility model to build and utilize custom container images with your environment definitions for deployment environments.
ms.service: deployment-environments
author: RoseHJM
ms.author: rosemalcolm
ms.date: 04/13/2024
ms.topic: how-to

#customer intent: As a developer, I want to learn how to build and utilize custom images with my environment definitions for deployment environments.
---

# Configure a container image to execute deployments

In this article, you learn how to build and utilize custom images within your environment definitions for deployments in Azure Deployment Environments (ADE).

ADE uses an extensibility model to enable you to create custom images to use in your environment definitions. By using the extensibility model, you can create your own custom images, and store them in a container registry like the [Azure Container Registry](/azure/container-registry/container-registry-intro). You can then reference these images in your environment definitions to deploy your environments.

The ADE team provides a selection of images to get you started, including a core image, and an Azure Resource Manager (ARM)/Bicep image. You can access these sample images in the [Runner-Images](https://aka.ms/deployment-environments/runner-images) folder.

The ADE CLI is a tool that allows you to build custom images by using ADE base images. You can use the ADE CLI to customize your deployments and deletions to fit your workflow. The ADE CLI is preinstalled on the sample images. To learn more about the ADE CLI, see the [CLI Custom Runner Image reference](https://aka.ms/deployment-environments/ade-cli-reference).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create and build a container image

In this example, you learn how to build a Docker image to utilize ADE deployments and access the ADE CLI, basing your image on one of the ADE authored images.

To build an image configured for ADE, follow these steps:
1. Base your image on an ADE-authored sample image or the image of your choice by using the FROM statement.
1. Install any necessary packages for your image by using the RUN statement.
1. Create a *scripts* folder at the same level as your Dockerfile, store your *deploy.sh* and *delete.sh* files within it, and ensure those scripts are discoverable and executable inside your created container. This step is necessary for your deployment to work using the ADE core image.
1. Build and push your image to your container registry, and ensure it's accessible to ADE.
1. Reference your image in the `runner` property of your environment definition.

### Select an image by using the FROM statement

To build a Docker image to utilize ADE deployments and access the ADE CLI, you should base your image on one of the ADE-authored images. Including a FROM statement within a created DockerFile for your new image that points to an ADE-authored sample image hosted on Microsoft Artifact Registry. When using ADE-authored images, it's recommended you build your custom image on the ADE core image.

Here's an example FROM statement, referencing the sample core image:

```docker
FROM mcr.microsoft.com/deployment-environments/runners/core:latest
```

This statement pulls the most recently published core image, and makes it a basis for your custom image.

### Install packages in an image

You can install packages with the Azure CLI by using the RUN statement, as shown in the following example:

```azure cli
RUN az bicep install
```

The ADE sample images are based on the Azure CLI image, and have the ADE CLI and JQ packages preinstalled. You can learn more about the [Azure CLI](/cli/azure/), and the [JQ package](https://devdocs.io/jq/).

To install any more packages you need within your image, use the RUN statement.

### Execute operation shell scripts

Within the sample images, operations are determined and executed based on the operation name. Currently, the two operation names supported are *deploy* and *delete*.

To set up your custom image to utilize this structure, specify a folder at the level of your Dockerfile named *scripts*, and specify two files, *deploy.sh*, and *delete.sh*. The deploy shell script runs when your environment is created or redeployed, and the delete shell script runs when your environment is deleted. You can see examples of shell scripts in the repository under the [Runner-Images folder](https://github.com/Azure/deployment-environments/tree/custom-runner-private-preview/Runner-Images) image.

To ensure these shell scripts are executable, add the following lines to your Dockerfile:

```docker
COPY scripts/* /scripts/
RUN find /scripts/ -type f -iname "*.sh" -exec dos2unix '{}' '+'
RUN find /scripts/ -type f -iname "*.sh" -exec chmod +x {} \;
```

### Build the image

Before you build the image to be pushed to your registry, ensure the [Docker Engine is installed](https://docs.docker.com/desktop/) on your computer. Then, navigate to the directory of your Dockerfile, and run the following command:

```docker
docker build . -t {YOUR_REGISTRY}.azurecr.io/{YOUR_REPOSITORY}:{YOUR_TAG}
```

For example, if you want to save your image under a repository within your registry named `customImage`, and upload with the tag version of `1.0.0`, you would run:

```docker
docker build . -t {YOUR_REGISTRY}.azurecr.io/customImage:1.0.0
```

## Push the image to a registry

In order to use custom images, you need to set up a publicly accessible image registry with anonymous image pull enabled. This way, Azure Deployment Environments can access your custom image to execute in our container.

Azure Container Registry is an Azure offering that stores container images and similar artifacts.

To create a registry, which can be done through the Azure CLI, the Azure portal, PowerShell commands, and more, follow one of the [quickstarts](/azure/container-registry/container-registry-get-started-azure-cli).

To set up your registry to have anonymous image pull enabled, run the following commands in the Azure CLI:

```azurecli
az login
az acr login -n {YOUR_REGISTRY}
az acr update -n {YOUR_REGISTRY} --public-network-enabled true
az acr update -n {YOUR_REGISTRY} --anonymous-pull-enabled true
```

When you're ready to push your image to your registry, run the following command:

```docker
docker push {YOUR_REGISTRY}.azurecr.io/{YOUR_IMAGE_LOCATION}:{YOUR_TAG}
```

## Connect the image to your environment definition

When authoring environment definitions to use your custom image in their deployment, edit the `runner` property on the manifest file (environment.yaml or manifest.yaml).

```yaml
runner: "{YOUR_REGISTRY}.azurecr.io/{YOUR_REPOSITORY}:{YOUR_TAG}"
```

## Build a container image with a script

Microsoft provides a quickstart script to help you get started. The script builds your image and pushes it to a specified Azure Container Registry (ACR) under the repository `ade` and the tag `latest`. 

To use the script, you must:

1. Configure a Dockerfile and scripts folder to support the ADE extensibility model. 
1. Supply a registry name and directory for your custom image.
1. Have the Azure CLI and Docker Desktop installed and in your PATH variables.
1. Have permissions to push to the specified registry.

You can run the script [here](https://github.com/Azure/deployment-environments/blob/custom-runner-private-preview/Runner-Images/quickstart-image-build.ps1). 

You can call the script using the following command in PowerShell:
```powershell
.\quickstart-image-build.ps1 -Registry '{YOUR_REGISTRY}' -Directory '{DIRECTORY_TO_YOUR_IMAGE}'
```
Additionally, if you would like to push to a specific repository and tag name, you can run:
```powershell
.\quickstart-image.build.ps1 -Registry '{YOUR_REGISTRY}' -Directory '{DIRECTORY_TO_YOUR_IMAGE}' -Repository '{YOUR_REPOSITORY}' -Tag '{YOUR_TAG}'
```

## Access operation logs and error details

ADE stores error details for a failed deployment in the *$ADE_ERROR_LOG* file within the container. 

To troubleshoot a failed deployment:

1. Sign in to the [Developer Portal](https://devportal.microsoft.com/).
1. Identify the environment that failed to deploy, and select **See details**.

    :::image type="content" source="media/how-to-configure-extensibility-generic-container-image/failed-deployment-card.png" alt-text="Screenshot showing failed deployment error details, specifically an invalid name for a storage account." lightbox="media/how-to-configure-extensibility-generic-container-image/failed-deployment-card.png":::

1. Review the error details in the **Error Details** section.

    :::image type="content" source="media/how-to-configure-extensibility-generic-container-image/deployment-error-details.png" alt-text="Screenshot showing a failed deployment of an environment with the See Details button displayed." lightbox="media/how-to-configure-extensibility-generic-container-image/deployment-error-details.png":::

Additionally, you can use the Azure CLI to view an environment's error details using the following command:
```bash
az devcenter dev environment show --environment-name {YOUR_ENVIRONMENT_NAME} --project {YOUR_PROJECT_NAME}
```

To view the operation logs for an environment deployment or deletion, use the Azure CLI to retrieve the latest operation for your environment, and then view the logs for that operation ID.

```bash
# Get list of operations on the environment, choose the latest operation
az devcenter dev environment list-operation --environment-name {YOUR_ENVIRONMENT_NAME} --project {YOUR_PROJECT_NAME}
# Using the latest operation ID, view the operation logs
az devcenter dev environment show-logs-by-operation --environment-name {YOUR_ENVIRONMENT_NAME} --project {YOUR_PROJECT_NAME} --operation-id {LATEST_OPERATION_ID}
```

## Related content

- [ADE CLI Custom Runner Image reference](https://aka.ms/deployment-environments/ade-cli-reference)
