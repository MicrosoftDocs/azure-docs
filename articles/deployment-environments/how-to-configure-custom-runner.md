---
title: ADE Custom Image Support
titleSuffix: Azure Deployment Environments
description: <!-- @jack can you add a description here -->
ms.service: deployment-environments
author: RoseHJM
ms.author: rosemalcolm
ms.date: 02/16/2024
ms.topic: how-to
---

# ADE Custom Image Support
This page is designed to help customers understand how to build and utilize custom images within their environment definitions for deployments in Azure Deployment Environments. 

To see how the ADE-authored Core and ARM/Bicep images are structured, check out the Runner-Images folder [here](../../Runner-Images/README.md).

In order to use the ADE CLI, you will need to use an ADE-authored image as a base image. More information about the ADE CLI can be found [here](./ade-cli-docs/README.md).

## Creating and Building the Docker Image

### FROM Statement

If you are wanting to build a Docker image to utilize ADE deployments and access the ADE CLI, you will want to base your image off of one of the ADE-authored images. This can be done by including a FROM statement within a created DockerFile for your new image pointing to an ADE-authored image hosted on Microsoft Artifact Registry.

Here's an example of that FROM statement, pointing to the ADE-authored core image:
```docker
FROM mcr.microsoft.com/deployment-environments/runners/core:latest
```

This statement pulls the most recently-published core image, and makes it a basis for your custom image.

### RUN Statement

Next, you can use the RUN statement to install any additional packages you would need to use within your image. ADE-authored images are based off of the Azure CLI image, and have the ADE CLI and JQ packages pre-installed. You can learn more about the Azure CLI [here](https://learn.microsoft.com/en-us/cli/azure/), and the JQ package [here](https://devdocs.io/jq/).

Here's an example used in our Bicep image, installing the Bicep package within our Dockerfile.
```docker
RUN az bicep install
```

### Executing Operation Shell Scripts

Within the ADE-authored images, operations are determined and executed based off of the operation name. Currently, the two operation names supported are 'deploy' and 'delete', with plans to expand this moving forward.

To set up your custom image to utilize this structure, specify a folder at the level of your Dockerfile named 'scripts', and specify two files, 'deploy.sh', and 'delete.sh'. The 'deploy' shell script will run when your environment is created or redeployed, and the 'delete' shell script will run when your environment is deleted. You can see examples of this within this repository under the Runner-Images folder for the ARM-Bicep image.

To ensure these shell scripts are executable, add the following lines to your Dockerfile:
```docker
COPY scripts/* /scripts/
RUN find /scripts/ -type f -iname "*.sh" -exec dos2unix '{}' '+'
RUN find /scripts/ -type f -iname "*.sh" -exec chmod +x {} \;
```
### Building the Image

To build the image to be pushed to your registry, please ensure the Docker Engine is installed on your computer, navigate to the directory of your Dockerfile, and run the following command:
```
docker build . -t {YOUR_REGISTRY}.azurecr.io/{YOUR_IMAGE_LOCATION}:{YOUR_TAG}
```

For example, if you wanted to save your image under a repository within your repo named 'customImage', and you wanted to upload with the tag version of '1.0.0', you would run:

```
docker build . -t {YOUR_REGISTRY}.azurecr.io/customImage:1.0.0
```
## Pushing the Docker Image to a Registry
In order to use custom images, you will need to set up a publicly-accessible image registry with anonymous image pull enabled. This way, Azure Deployment Environments can access your custom image to execute in our container.

Azure Container Registry is an offering by Azure that provides storing of container images and similar artifacts.

To create a registry, which can be done through the Azure CLI, the Azure Portal, Powershell commands, and more, please follow one of the quickstarts [here](https://learn.microsoft.com/en-us/azure/container-registry/container-registry-get-started-azure-cli).

To set up your registry to have anonymous image pull enabled, please run the following command in the Azure CLI:
```
az login
az acr login -n {YOUR_REGISTRY}
az acr update -n {YOUR_REGISTRY} --public-network-enabled true
az acr update -n {YOUR_REGISTRY} --anonymous-pull-enabled true
```
When you are ready to push your image to your registry, run the following command:
```
docker push {YOUR_REGISTRY}.azurecr.io/{YOUR_IMAGE_LOCATION}:{YOUR_TAG}
```

## Connecting the Image to your Environment Definition

When authoring environment definitions to use your custom image in their deployment, simply edit the 'runner' property on the manifest file (environment.yaml or manifest.yaml).
```yaml
runner: "{YOUR_REGISTRY}.azurecr.io/{YOUR_IMAGE_LOCATION}:{YOUR_TAG}"
```

## Related content

- [ADE CLI Custom Runner Image reference](./reference-custom-runner-ADE-CLI.md)
