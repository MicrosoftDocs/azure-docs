---
title: ADE extensibility model for custom images
titleSuffix: Azure Deployment Environments
description: Learn how to use the ADE extensibility model to build and utilize custom images within your environment definitions for deployment environments.
ms.service: deployment-environments
author: RoseHJM
ms.author: rosemalcolm
ms.date: 03/27/2024
ms.topic: how-to

#customer intent: As a developer, I want to learn how to build and utilize custom images within my environment definitions for deployment environments.
---

# Custom image support in Azure Deployment Environments

In this article, you learn how to build and utilize custom images within your environment definitions for deployments in Azure Deployment Environments (ADE).

ADE uses an extensibility model to enable you to create custom images to use in your environment definitions. By using the extensibility model, you can create your own custom images, and store them in a container registry like the [Microsoft Artifact Registry](https://mcr.microsoft.com/)(also known as the Microsoft Container Registry). You can then reference these images in your environment definitions to deploy your environments.

The ADE team provides a selection of images to get you started, including a core image, and an ARM/Bicep image. You can access these sample images in the [Runner-Images](https://github.com/Azure/deployment-environments/tree/custom-runner-private-preview/Runner-Images) folder.

The ADE CLI is a tool that allows you to build custom images by using ADE base images. You can use the ADE CLI to customize your deployments and deletions to fit your workflow. The ADE CLI is preinstalled on the sample images. To learn more about the ADE CLI, see the [CLI Custom Runner Image reference](./reference-custom-runner-CLI.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create and build a Docker image

In this example, you learn how to build a Docker image to utilize ADE deployments and access the ADE CLI, basing your image off of one of the ADE authored images.

### FROM statement

Include a FROM statement within a created DockerFile for your new image pointing to a sample image hosted on Microsoft Artifact Registry.

Here's an example FROM statement, referencing the sample core image:

```docker
FROM mcr.microsoft.com/deployment-environments/runners/core:latest
```

This statement pulls the most recently published core image, and makes it a basis for your custom image.

### RUN statement

The ADE sample images are based on the Azure CLI image, and have the ADE CLI and JQ packages preinstalled. You can learn more about the [Azure CLI](/cli/azure/), and the [JQ package](https://devdocs.io/jq/).

To install any more packages you need within your image, use the RUN statement.

Here's an example used in a Bicep image, installing the Bicep package within a Dockerfile.

```docker
RUN az bicep install
```

### Execute operation shell scripts

Within the sample images, operations are determined and executed based on the operation name. Currently, the two operation names supported are `deploy` and `delete`.

To set up your custom image to utilize this structure, specify a folder at the level of your Dockerfile named `scripts`, and specify two files, `deploy.sh`, and `delete.sh`. The `deploy` shell script runs when your environment is created or redeployed, and the `delete` shell script runs when your environment is deleted. You can see examples of shell scripts in the repository under the [Runner-Images folder for the ARM-Bicep](https://github.com/Azure/deployment-environments/tree/custom-runner-private-preview/Runner-Images/ARM-Bicep) image.

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

## Push the Docker image to a registry

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

## Related content

- [ADE CLI Custom Runner Image reference](./reference-custom-runner-CLI.md)
