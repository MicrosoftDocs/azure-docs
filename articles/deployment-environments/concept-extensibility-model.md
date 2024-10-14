---
title: ADE Extenibility Model
description: Learn how the ADE extensibility model enables you to use custom container images to create deployment environments.
author: RoseHJM
ms.author: rosemalcolm
ms.service: azure-deployment-environments
ms.topic: concept-article
ms.date: 10/11/2024

# Customer intent: As a platform engineer, I want to know how to use custom container images to create deployment environments.

---

# ADE extensibility model

The Azure Deployment Environments (ADE) extensibility model enables you to use custom container images to create deployment environments. You can use custom container images to run actions in your deployment environments, such as deploying resources to Azure, running tests, or executing scripts.

## What is the ADE extensibility model?

ADE supports an extensibility model that enables you to create custom images that you can use in your environment definitions. To use this extensibility model, create your own custom images and store them in a container registry like Azure Container Registry (ACR) or Docker Hub. You can then reference these images in your environment definitions to deploy your environments. The extensibility model supports popular infrastructucture as code (IaC) frameworks like Azure Resource Manager (ARM) templates, Bicep, Terraform, and Pulumi.

An [environment definition](configure-environment-definition.md) comprises at least two files, a template file and a manifest file. The manifest file specifies the custom image to use in the environment definition. The template file contains the code that defines the resources to deploy. The specfic files depend on the framework you use: ARM, Bicep, Terraform, or Pulumi. The following table lists commonly used files for each framework:

|IaC framework   |File  |Description  |
|----------------|---------|---------|
|ARM / Bicep     |*azuredeploy.json*, or *main.bicep* </br> *environment.yaml* |Template files </br> Manifest file  |
|Terraform       |*main.tf* </br> *environment.yaml* |Template file </br> Manifest file  |
|Pulumi          |*Pulumi.yaml* </br> *environment.yaml* |Pulumi project file </br> Manifest file  |

Environment definitions might also contain a user program written in your preferred programming language like C#, TypeScript, or Python, etc.

The ADE team provides a selection of images to get you started, including a core image, and an Azure Resource Manager (ARM)-Bicep image. You can access these sample images in the [Runner-Images](https://aka.ms/deployment-environments/runner-images) folder.

## How to use the ADE extensibility model

Sample image

<add diagram>

Use just the sample image, specify image in manifest file (runner parameter)

Custom image

<add diagram>

Base a new image on the sample image, customize, build, upload to registry, config anonymous pull or ACRPull, specify image in manifest file (runner parameter)

## Related content

[Configure container image to execute deployments](how-to-configure-extensibility-model-custom-image.md)
