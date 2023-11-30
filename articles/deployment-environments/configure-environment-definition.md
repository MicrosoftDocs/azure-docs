---
title: Add and configure an environment definition 
titleSuffix: Azure Deployment Environments
description: Learn how to add and configure an environment definition to use in your Azure Deployment Environments projects. Environment definitions contain an IaC template that defines the environment.
services: Azure Deployment Environments
author: RoseHJM
ms.author: rosemalcolm
ms.service: deployment-environments
ms.topic: how-to
ms.date: 04/25/2023
ms.custom: devdivchpfy22, ignite-2022, build-2023
---

# Add and configure an environment definition in Azure Deployment Environments

In this article, you learn how to add or update an environment definition in an Azure Deployment Environments catalog.

In Azure Deployment Environments, you can use a [catalog](concept-environments-key-concepts.md#catalogs) to provide your development teams with a curated set of predefined [infrastructure as code (IaC)](/devops/deliver/what-is-infrastructure-as-code) templates called [*environment definitions*](concept-environments-key-concepts.md#environment-definitions).

An environment definition is combined of least two files:

- An [Azure Resource Manager template (ARM template)](../azure-resource-manager/templates/overview.md) in JSON file format. For example, *azuredeploy.json*.
- An environment YAML file (*environment.yaml*).

>[!NOTE]
> Azure Deployment Environments currently supports only ARM templates.

The IaC template contains the environment definition (template), and the environment file, which provides metadata about the template. Your development teams use the environment definitions that you provide in the catalog to deploy environments in Azure.

We offer a [sample catalog](https://aka.ms/deployment-environments/SampleCatalog) that you can use as your repository. You also can use your own private repository, or you can fork and customize the environment definitions in the sample catalog.

After you [add a catalog](how-to-configure-catalog.md) to your dev center, the service scans the specified folder path to identify folders that contain an ARM template and an associated environment file. The specified folder path should be a folder that contains subfolders that hold the environment definition files.

In this article, you learn how to:

> [!div class="checklist"]
>
> - Add an environment definition
> - Update an environment definition
> - Delete an environment definition

<a name="add-a-new-environment-definition"></a>

## Add an environment definition

To add an environment definition to a catalog in Azure Deployment Environments, you first add the files to the repository. You then synchronize the dev center catalog with the updated repository.

To add an environment definition:

1. In your repository, create a subfolder in the repository folder path.

1. Add two files to the new repository subfolder:

   - An ARM template as a JSON file.

      To implement IaC for your Azure solutions, use ARM templates. [ARM templates](../azure-resource-manager/templates/overview.md) help you define the infrastructure and configuration of your Azure solution and repeatedly deploy it in a consistent state.

      To learn how to get started with ARM templates, see the following articles:

      - [Understand the structure and syntax of ARM templates](../azure-resource-manager/templates/syntax.md): Describes the structure of an ARM template and the properties that are available in the different sections of a template.
      - [Use linked templates](../azure-resource-manager/templates/linked-templates.md?tabs=azure-powershell#use-relative-path-for-linked-templates): Describes how to use linked templates with the new ARM template `relativePath` property to easily modularize your templates and share core components between environment definitions.

   - An environment as a YAML file.

      The *environment.yaml* file contains metadata related to the ARM template.

       The following script is an example of the contents of a *environment.yaml* file:

       ```yaml
           name: WebApp
           version: 1.0.0
           summary: Azure Web App Environment
           description: Deploys a web app in Azure without a datastore
           runner: ARM
           templatePath: azuredeploy.json
        ```  
  
       > [!NOTE]
       > The `version` field is optional. Later, the field will be used to support multiple versions of environment definitions.

      :::image type="content" source="../deployment-environments/media/configure-environment-definition/create-subfolder-path.png" alt-text="Screenshot that shows a folder path with a subfolder that contains an ARM template and an environment file.":::

      To learn more about the options and data types you can use in environment.yaml, see [Parameters and data types in environment.yaml](concept-environment-yaml.md#what-is-environmentyaml).

1. In your dev center, go to **Catalogs**, select the repository, and then select **Sync**.

    :::image type="content" source="../deployment-environments/media/configure-environment-definition/sync-catalog-list.png" alt-text="Screenshot that shows how to sync the catalog." :::

The service scans the repository to find new environment definitions. After you sync the repository, new environment definitions are available to all projects in the dev center.

### Specify parameters for an environment definition

You can specify parameters for your environment definitions to allow developers to customize their environments. 

Parameters are defined in the environment.yaml file. 

The following script is an example of a *environment.yaml* file that includes two parameters; `location` and `name`: 

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
To learn more about the parameters and their data types you can use in environment.yaml, see [Parameters and data types in environment.yaml](concept-environment-yaml.md#parameters-in-environmentyaml).

Developers can supply values for specific parameters for their environments through the developer portal.

:::image type="content" source="media/configure-environment-definition/parameters.png" alt-text="Screenshot showing the parameters pane.":::

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
Refer to the [Azure CLI devcenter extension](/cli/azure/devcenter/dev/environment) for full details of the `az devcenter dev environment create` command.

## Update an environment definition

To modify the configuration of Azure resources in an existing environment definition in Azure Deployment Environments, update the associated ARM template JSON file in the repository. The change is immediately reflected when you create a new environment by using the specific environment definition. The update also is applied when you redeploy an environment associated with that environment definition.

To update any metadata related to the ARM template, modify *environment.yaml*, and then [update the catalog](how-to-configure-catalog.md#update-a-catalog).

## Delete an environment definition

To delete an existing environment definition, in the repository, delete the subfolder that contains the ARM template JSON file and the associated environment YAML file. Then, [update the catalog](how-to-configure-catalog.md#update-a-catalog) in Azure Deployment Environments.

After you delete an environment definition, development teams can no longer use the specific environment definition to deploy a new environment. Update the environment definition reference for any existing environments that were created by using the deleted environment definition. If the reference isn't updated and the environment is redeployed, the deployment fails.

## Next steps

- Learn how to [create and configure a project](./quickstart-create-and-configure-projects.md).
- Learn how to [create and configure an environment type](quickstart-create-access-environments.md).
