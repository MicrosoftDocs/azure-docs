---
title: ADE Extenibility Model
description: Learn how the ADE extensibility model enables you to use custom container images to create deployment environments.
author: RoseHJM
ms.author: rosemalcolm
ms.service: azure-deployment-environments
ms.topic: concept-article
ms.date: 10/17/2024

# Customer intent: As a platform engineer, I want to know how to use custom container images to create deployment environments.

---

# ADE extensibility model

The Azure Deployment Environments (ADE) extensibility model allows you to create custom images for your environment definitions, which can run actions like deploying resources to Azure, running tests, or executing scripts. The extensibility model supports popular infrastructucture-as-code (IaC) frameworks like Azure Resource Manager (ARM) templates, Bicep, Terraform, and Pulumi.

Microsoft provides a selection of sample images to get you started, including a core image and an ARM-Bicep image. 

Azure Deployment Environments (ADE) supports three approaches for creating environments:

- **Native Support with ARM/Bicep:** 
    - Use the sample ARM/Bicep image supplied by Microsoft.
    - Specify ARM or Bicep as the runner in the manifest file (*environment.yaml*). 
    - Define the resources to deploy in the template file (*azuredeploy.json*, *main.bicep*).

- **Extensibility with Third-Party Images:** 
    - This approach offers the flexibility to use trusted third-party tools.
    - Use a third-party sample image, like those from Terraform or Pulumi. 
    - Upload a copy of the image to your preferred registry and specify its location as the runner in your manifest file (*environment.yaml*). 
    - Define the resources to deploy in the template file (*main.tf*) or project file (*Pulumi.yaml*).

- **Extensibility with Custom Images:** 
    - Customize any sample image to meet your specific requirements. 
    - After customization, upload it to your registry and set its location as the runner in your manifest file (*environment.yaml*). 
    - This option provides full control over your environment setup.

An [environment definition](configure-environment-definition.md) comprises at least two files, a template file and a manifest file. The manifest file specifies the custom image to use in the environment definition. The template file contains the code that defines the resources to deploy. The specfic files depend on the framework you use: ARM, Bicep, Terraform, or Pulumi. The following table lists commonly used files for each framework:

|IaC framework   |File  |Description  |
|----------------|---------|---------|
|ARM / Bicep     |*azuredeploy.json*, or *main.bicep* </br> *environment.yaml* |Template files </br> Manifest file  |
|Terraform       |*main.tf* </br> *environment.yaml* |Template file </br> Manifest file  |
|Pulumi          |*Pulumi.yaml* </br> *environment.yaml* |Pulumi project file </br> Manifest file  |

Environment definitions might also contain a user program written in your preferred programming language like C#, TypeScript, or Python, etc.


Microsoft provides a selection of images to get you started, including a core image, and an Azure Resource Manager (ARM)-Bicep image. You can access these sample images in the [Runner-Images](https://aka.ms/deployment-environments/runner-images) folder.

To use the extensibility model, create your own custom images and store them in a container registry like Azure Container Registry (ACR) or Docker Hub. You can then reference these images in your environment definitions to deploy your environments. 

## How to use the ADE extensibility model

Sample image

<add diagram>

Use just the sample image, specify image in manifest file (runner parameter)

Custom image

<add diagram>

Base a new image on the sample image, customize, build, upload to registry, config anonymous pull or ACRPull, specify image in manifest file (runner parameter)

## Related content

[Configure container image to execute deployments](how-to-configure-extensibility-model-custom-image.md)
