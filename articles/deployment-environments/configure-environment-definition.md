---
title: Add and configure an environment definition in a catalog
titleSuffix: Azure Deployment Environments
description: Learn how to add and configure an environment definition to use in your Azure Deployment Environments projects.
services: Azure Deployment Environments
author: RoseHJM
ms.author: rosemalcolm
ms.service: deployment-environments
ms.topic: how-to
ms.date: 03/29/2024
ms.custom: devdivchpfy22, build-2023
---

# Add and configure an environment definition

This guide explains how to add or update an environment definition in an Azure Deployment Environments catalog.

In Azure Deployment Environments, you can use a [catalog](concept-environments-key-concepts.md#catalogs) to provide your development teams with a curated set of predefined [infrastructure as code (IaC)](/devops/deliver/what-is-infrastructure-as-code) templates called [environment definitions](concept-environments-key-concepts.md#environment-definitions).

An environment definition is composed of least two files:

- A template from an IaC framework. For example:
    - An Azure Resource Manager (ARM) template might use a file called *azuredeploy.json*.
    - A Bicep template might use a file called *azuredeploy.bicep*.
    - A Terraform template might use a file called *azuredeploy.tf*, or *azuredeploy.tf.json*.
- A configuration file that provides metadata about the template. This file should be named *environment.yaml*.

Your development teams use the environment definitions that you provide in the catalog to deploy environments in Azure.

Microsoft offers a [sample catalog](https://aka.ms/deployment-environments/SampleCatalog) that you can use as your repository. You can also use your own private repository, or you can fork and customize the environment definitions in the sample catalog.

After you [add a catalog](how-to-configure-catalog.md) to your dev center, the service scans the specified folder path to identify folders that contain a template and an associated environment file. The specified folder path should be a folder that contains subfolders that hold the environment definition files.

In this article, you learn how to:

> [!div class="checklist"]
>
> - Add an environment definition
> - Update an environment definition
> - Delete an environment definition

<a name="add-a-new-environment-definition"></a>

## Add an environment definition

To add an environment definition to a catalog in Azure Deployment Environments (ADE), you first add the files to the repository. You then synchronize the dev center catalog with the updated repository.

To add an environment definition:

1. In your [GitHub](https://github.com) or [Azure DevOps](https://dev.azure.com) repository, create a subfolder in the repository folder path.

1. Add two files to the new repository subfolder:

   - An IaC template file.

   - An environment as a YAML file.

      The *environment.yaml* file contains metadata related to the IaC template.

       The following script is an example of the contents of an *environment.yaml* file for an ARM template:

       ```yaml
           name: WebApp
           version: 1.0.0
           summary: Azure Web App Environment
           description: Deploys a web app in Azure without a datastore
           runner: ARM
           templatePath: azuredeploy.json
       ```  

      Use the following table to understand the fields in the *environment.yaml* file:

      | Field | Description |
      |-------|-------------|
      | name | The name of the environment definition. |
      | version | The version of the environment definition. This field is optional. |
      | summary | A brief description of the environment definition. |
      | description | A detailed description of the environment definition. |
      | runner | The IaC framework that the template uses. The value can be `ARM` or `Bicep`. You can also specify a path to a template stored in a container registry. |
      | templatePath | The path to the IaC template file. |

      To learn more about the options and data types you can use in *environment.yaml*, see [Parameters and data types in environment.yaml](concept-environment-yaml.md#what-is-environmentyaml).

1. In your dev center, go to **Catalogs**, select the repository, and then select **Sync**.

    :::image type="content" source="../deployment-environments/media/configure-environment-definition/sync-catalog-list.png" alt-text="Screenshot that shows how to sync the catalog." lightbox="../deployment-environments/media/configure-environment-definition/sync-catalog-list.png":::

The service scans the repository to find new environment definitions. After you sync the repository, new environment definitions are available to all projects in the dev center.

### Specify a Terraform image

The ADE extensibility model enables you to use your own custom container image to deploy your preferred choice of IaC framework. You can build and use your own container image to execute deployments using Terraform. Learn how to [Configure a container image to execute deployments with Terraform](https://aka.ms/deployment-environments/container-image-terraform).

When creating environment definitions that use a custom image in their deployment, the runner property provides a link to a container registry where this container image is stored.

The runner property specifies the location of the image you want to use. When you're using a Terraform image from a container registry, edit the runner property to specify the location that image, as shown in the following example:

```yaml
runner: "{YOUR_REGISTRY}.azurecr.io/{YOUR_REPOSITORY}:{YOUR_TAG}"
```

### Specify an ARM or Bicep image

The ADE team provides sample ARM and Bicep templates accessible through the Microsoft Artifact registry (also known as the Microsoft Container Registry) to help you get started. When you perform deployments by using ARM or Bicep, you can use the standard image that is published on [Microsoft Artifact Registry](https://mcr.microsoft.com/) (previously known as the Microsoft Container Registry).

To use the sample image published on the Microsoft Artifact Registry, use the respective identifiers `runner: ARM` for ARM and `runner:Bicep` for Bicep deployments.

For more information how to build and utilize ARM or Bicep container images within environment definitions, see [Configure container image to execute deployments with ARM and Bicep](https://aka.ms/deployment-environments/container-image-bicep).


### Specify parameters for an environment definition

You can specify parameters for your environment definitions to allow developers to customize their environments. 

Parameters are defined in the *environment.yaml* file. 

The following script is an example of an *environment.yaml* file for an ARM template that includes two parameters; `location` and `name`: 

```YAML
name: WebApp
summary: Azure Web App Environment
description: Deploys a web app in Azure without a datastore
runner: ARM
templatePath: azuredeploy.json
parameters:
- id: "location"
  name: "location"
  description: "Location to deploy the environment resources"
  default: "[resourceGroup().location]"
  type: "string"
  required: false
- id: "name"
  name: "name"
  description: "Name of the Web App "
  default: ""
  type: "string"
  required: false
```

To learn more about the parameters and their data types that you can use in *environment.yaml*, see [Parameters and data types in environment.yaml](concept-environment-yaml.md#parameters-in-environmentyaml).

Developers can supply values for specific parameters for their environments through the [developer portal](https://devportal.microsoft.com).

:::image type="content" source="media/configure-environment-definition/parameters.png" alt-text="Screenshot of the developer portal of the developer portal showing the parameters pane." lightbox="media/configure-environment-definition/parameters.png":::

Developers can also supply values for specific parameters for their environments through the CLI.

```azurecli
az devcenter dev environment create --environment-definition-name
                                    --catalog-name
                                    --dev-center
                                    --environment-name
                                    --environment-type
                                    --project
                                    [--description]
                                    [--no-wait]
                                    [--parameters]
                                    [--tags]
                                    [--user]
                                    [--user-id]
```

To learn more about the `az devcenter dev environment create` command, see the [Azure CLI devcenter extension](/cli/azure/devcenter/dev/environment).

## Update an environment definition

To modify the configuration of Azure resources in an existing environment definition in Azure Deployment Environments, update the associated template  file in the repository. The change is immediately reflected when you create a new environment by using the specific environment definition. The update also is applied when you redeploy an environment associated with that environment definition.

To update any metadata related to the template, modify *environment.yaml*, and then [update the catalog](how-to-configure-catalog.md#update-a-catalog).

## Delete an environment definition

To delete an existing environment definition, in the repository, delete the subfolder that contains the template file and the associated environment YAML file. Then, [update the catalog](how-to-configure-catalog.md#update-a-catalog).

After you delete an environment definition, development teams can no longer use the specific environment definition to deploy a new environment. Update the environment definition reference for any existing environments that use the deleted environment definition. If the reference isn't updated and the environment is redeployed, the deployment fails.

## Related content

- [Add and configure a catalog from GitHub or Azure DevOps](how-to-configure-catalog.md)
- [Create and configure an environment type](quickstart-create-access-environments.md)
