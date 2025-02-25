---
title: ADE Extensibility Model
description: Learn how the ADE extensibility model enables you to use custom container images to create deployment environments.
author: RoseHJM
ms.author: rosemalcolm
ms.service: azure-deployment-environments
ms.topic: concept-article
ms.date: 01/17/2025

# Customer intent: As a platform engineer, I want to know how to use custom container images to create deployment environments.

---

# What is the ADE Extensibility Model?

Azure Deployment Environments (ADE) enables you to provide a curated set of infrastructure-as-code (IaC) templates that your development teams use to perform deployments. ADE offers power and flexibility for organizations through an extensibility model which enables platform engineers to define preapproved templates using their preferred IaC framework.
The following diagram shows the full workflow for ADE. The catalog stores IaC templates, which reference container images for use in deployments. Platform engineers curate these images and templates, and configure environment settings based on the stage of development, enabling developers to create highly specific deployment environments. Developers can create improvised environments for dev/test purposes or shared environments as part of their CI/CD pipeline, or as part of an automated pipeline.

:::image type="content" source="media/concept-extensibility-model/deployment-environments-overview.svg" alt-text="Diagram showing Azure Deployment Environments components.":::

The extensibility model enables platform engineers to define the app infrastructure using their preferred IaC framework including Azure Resource Manager (ARM), Bicep, Terraform, and Pulumi. Platform engineers create and customize container images for different scenarios. They push these images to a container registry and reference them in the environment definition's metadata file. This ensures that whenever a deployment is made, the deployment execution happens based on how the container image is configured. The following diagram shows the relationship between the custom images stored in a container registry, and the environment definition within the catalog. 

:::image type="content" source="media/concept-extensibility-model/extensibility-model-detail.svg" alt-text="Diagram showing Azure Deployment Environments extensibility model components.":::

## Get started with custom images

You can choose from multiple options for creating and building custom images, depending on the IaC framework you require and the complexity of your needs.

### ARM-Bicep

**Use a standard image**

For first party frameworks - ARM and Bicep - ADE provides standard images that customers can take advantage of and can just use identifiers ARM or Bicep to configure the respective IaC template as an environment definition. For ARM or Bicep deployments, you can use the standard image by referencing it in the environment.yaml file and defining resources in the template file (*azuredeploy.json*, *main.bicep*).

For instructions, see: [Use a standard container image](https://aka.ms/ade/arm-bicep-standard).

**Create a custom image using a script**

To make the process of building a custom image and pushing it to a container registry easier, Microsoft provides a script that builds and pushes the image to a registry that you specify. 

For instructions, see: [Create a custom container image by using a script](https://aka.ms/ade/arm-bicep-custom-script).

**Create a custom image manually**

For more complex scenarios, start with the standard image and customize it by installing software packages and adjusting settings. Build the image and upload it to a container registry where ADE can access it. Specify the image's location in the environment.yaml file.

For instructions, see: [Create a custom container image manually](https://aka.ms/ade/arm-bicep-custom-manual).

### Terraform

**Create a custom image using a script**

To make the process of building a Terraform specific image and pushing it to a container registry easier, Microsoft provides a script that builds and pushes the image to a registry that you specify. 

For instructions, see: [Create a custom container image by using a script](https://aka.ms/ade/terraform-custom-script).

**Create a custom image using a GitHub workflow**

To make the process of building a Terraform specific image and pushing it to a container registry easier, you can use a published workflow that builds and pushes the image to a registry that you specify. 

For instructions, see: [Create a custom container image by using a GitHub workflow](https://aka.ms/ade/terraform-workflow).

**Create a Terraform specific container image manually**

You can use a GitHub workflow to create a Terraform specific image that includes the software, settings, and other customizations you need for your Terraform specific image. You can then upload the new image to a container registry and use it by referencing it in the environment.yaml file.

For instructions, see: [Create a custom container image manually](https://aka.ms/ade/terraform-workflow-custom-manual).

### Pulumi

**Use a standard image**

The Pulumi team provides a prebuilt image to get you started, which you can use directly from your ADE environment definitions. For Pulumi images, you can use the standard image by referencing it in the environment.yaml file and defining the resources to deploy in the project file (*pulumi.yaml*).

For instructions, see: [Use a standard container image provided by Pulumi](https://aka.ms/ade/pulumi-standard).

**Create a custom image manually**

For more complex scenarios, start with the standard image and customize it by installing software packages and adjusting settings. Build the image and upload it to a container registry where ADE can access it. Specify the image's location in the environment.yaml file.

For instructions, see: [Create a custom image](https://aka.ms/ade/pulumi-custom-manual).

## Related content 

- [Configure ARM or Bicep container image](/azure/deployment-environments/how-to-configure-extensibility-model-custom-image?tabs=sample%2Cprivate-registry&pivots=arm-bicep)
- [Configure Terraform container image](/azure/deployment-environments/how-to-configure-extensibility-model-custom-image?tabs=custom%2Cprivate-registry&pivots=terraform)
- [Configure Pulumi container image](/azure/deployment-environments/how-to-configure-extensibility-model-custom-image?tabs=sample%2Cprivate-registry&pivots=pulumi)
