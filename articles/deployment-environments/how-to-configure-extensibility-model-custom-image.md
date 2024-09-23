---
title: ADE extensibility model for custom container images
titleSuffix: Azure Deployment Environments
description: Learn how to use the ADE extensibility model to build and utilize custom container images within your environment definitions for deployment environments.
ms.service: azure-deployment-environments
ms.custom: devx-track-azurecli, devx-track-bicep
author: RoseHJM
ms.author: rosemalcolm
ms.date: 09/23/2024
ms.topic: how-to
zone_pivot_groups: ade-extensibility-iac-framework

#customer intent: As a platform engineer, I want to learn how to build and utilize custom images within my environment definitions for deployment environments.
---

# Configure container image to execute deployments

In this article, you learn how to build custom container images to deploy your [environment definitions](configure-environment-definition.md) in Azure Deployment Environments (ADE).

An environment definition comprises at least two files: a template file, like *azuredeploy.json* or *main.bicep*, and a manifest file named *environment.yaml*. ADE uses containers to deploy environment definitions. 

ADE supports an extensibility model that enables you to create custom images that you can use in your environment definitions. To use this extensibility model, create your own custom images and store them in a container registry like Azure Container Registry (ACR) or Docker Hub. You can then reference these images in your environment definitions to deploy your environments. 

ADE supports multiple Infrastructure-as-Code (IaC) frameworks, including ARM, Bicep, Terraform, and [Pulumi](https://pulumi.com). 

The ADE team provides a selection of images to get you started, including a core image, and an Azure Resource Manager (ARM)-Bicep image. You can access these sample images in the [Runner-Images](https://aka.ms/deployment-environments/runner-images) folder.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure Deployment Environments set up in your Azure subscription. 
  - To set up ADE, follow the [Quickstart: Configure Azure Deployment Environments](quickstart-create-and-configure-devcenter.md).

## Use container images with ADE

You can take one of the following approaches to use container images with ADE:
- **Use the standard container image:** For simple scenarios, use the standard ARM-Bicep container image provided by ADE.
- **Create a custom container image:** For more complex scenarios, create a custom container image that meets your specific requirements.
 
Regardless of which approach you choose, you must specify the container image in your environment definition to deploy your Azure resources.

## Use a standard container image

ADE supports ARM and Bicep without requiring any extra configuration. You can create an environment definition that deploys Azure resources for a deployment environment by adding the template files (like *azuredeploy.json* and *environment.yaml*) to your catalog. ADE then uses the standard ARM-Bicep container image to create the deployment environment.

In the *environment.yaml* file, the runner property specifies the location of the container image you want to use. To use the sample image published on the Microsoft Artifact Registry, use the respective identifiers runner.

The following example shows a runner that references the sample ARM-Bicep container image:
```yaml
    name: WebApp
    version: 1.0.0
    summary: Azure Web App Environment
    description: Deploys a web app in Azure without a datastore
    runner: Bicep
    templatePath: azuredeploy.json
```
You can see the standard Bicep container image in the ADE sample repository under the [Runner-Images folder for the ARM-Bicep](https://github.com/Azure/deployment-environments/tree/main/Runner-Images/ARM-Bicep) image.

For more information about how to create environment definitions that use the ADE container images to deploy your Azure resources, see [Add and configure an environment definition](configure-environment-definition.md).

::: zone pivot="arm-bicep,terraform"
## Create a custom container image

Creating a custom container image allows you to customize your deployments to fit your requirements. You can create custom images based on the ADE standard container images.

After you complete the image customization, you must build the image and push it to your container registry. 

### Create and customize a container image

In this example, you learn how to build a Docker image to utilize ADE deployments and access the ADE CLI, basing your image off of one of the ADE authored images.

The ADE CLI is a tool that allows you to build custom images by using ADE base images. You can use the ADE CLI to customize your deployments and deletions to fit your workflow. The ADE CLI is preinstalled on the sample images. To learn more about the ADE CLI, see the [CLI Custom Runner Image reference](https://aka.ms/deployment-environments/ade-cli-reference).
::: zone-end

To create an image configured for ADE, follow these steps:
1. Create a custom image based on a standard image.
1. Install desired packages.
1. Configure operation shell scripts.
::zone-pivot="arm-bicep" 
1. Create operation shell scripts to deploy ARM or Bicep templates. 
::: zone-end 
::: zone pivot="terraform"
1. Create operation shell scripts that use the Terraform CLI. 
::: zone-end

## Related content

- [ADE CLI Custom Runner Image reference](https://aka.ms/deployment-environments/ade-cli-reference)
- [ADE CLI variables reference](reference-deployment-environment-variables.md)
