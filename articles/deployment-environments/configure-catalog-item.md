---
title: Add and configure a catalog item 
titleSuffix: Azure Deployment Environments
description: Learn how to add and configure a catalog item in your repository to use in your Azure Deployment Environments Preview dev center projects.
services: Azure Deployment Environments
author: RoseHJM
ms.author: rosemalcolm
ms.service: deployment-environments
ms.topic: how-to
ms.date: 10/12/2022
ms.custom: devdivchpfy22, ignite-2022

---

# Add and configure a catalog item

In Azure Deployment Environments Preview, you can use a [catalog](concept-environments-key-concepts.md#catalogs) to provide your development teams with a curated set of predefined [infrastructure as code (IaC)](/devops/deliver/what-is-infrastructure-as-code) templates called [*catalog items*](concept-environments-key-concepts.md#catalog-items).

A catalog item is combined of least two files:

- An [Azure Resource Manager template (ARM template)](../azure-resource-manager/templates/overview.md) in JSON file format. For example, *azuredeploy.json*.
- A manifest YAML file (*manifest.yaml*).

>[!NOTE]
> Azure Deployment Environments Preview currently supports only ARM templates.

The IaC template contains the environment definition (template), and the manifest file provides metadata about the template. Your development teams use the catalog items that you provide in the catalog to deploy environments in Azure.

We offer a [sample catalog](https://aka.ms/deployment-environments/SampleCatalog) that you can use as your repository. You also can use your own private repository, or you can fork and customize the catalog items in the sample catalog.

After you [add a catalog](how-to-configure-catalog.md) to your dev center, the service scans the specified folder path to identify folders that contain an ARM template and an associated manifest file. The specified folder path should be a folder that contains subfolders that hold the catalog item files.

In this article, you learn how to:

> [!div class="checklist"]
>
> - Add a catalog item
> - Update a catalog item
> - Delete a catalog item

> [!IMPORTANT]
> Azure Deployment Environments currently is in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise are not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

<a name="add-a-new-catalog-item"></a>

## Add a catalog item

To add a catalog item:

1. In your repository, create a subfolder in the repository folder path.

1. Add two files to the new repository subfolder:

   - An ARM template as a JSON file.

      To implement IaC for your Azure solutions, use ARM templates. [ARM templates](../azure-resource-manager/templates/overview.md) help you define the infrastructure and configuration of your Azure solution and repeatedly deploy it in a consistent state.

      To learn how to get started with ARM templates, see the following articles:

      - [Understand the structure and syntax of ARM templates](../azure-resource-manager/templates/syntax.md): Describes the structure of an ARM template and the properties that are available in the different sections of a template.
      - [Use linked templates](../azure-resource-manager/templates/linked-templates.md?tabs=azure-powershell#use-relative-path-for-linked-templates): Describes how to use linked templates with the new ARM template `relativePath` property to easily modularize your templates and share core components between catalog items.

   - A manifest as a YAML file.

      The *manifest.yaml* file contains metadata related to the ARM template.

       The following script is an example of the contents of a *manifest.yaml* file:

       ```yaml
           name: WebApp
           version: 1.0.0
           summary: Azure Web App Environment
           description: Deploys a web app in Azure without a datastore
           runner: ARM
           templatePath: azuredeploy.json
        ```  
  
       > [!NOTE]
       > The `version` field is optional. Later, the field will be used to support multiple versions of catalog items.

      :::image type="content" source="../deployment-environments/media/configure-catalog-item/create-subfolder-in-path.png" alt-text="Screenshot that shows a folder path with a subfolder that contains an ARM template and a manifest file.":::

1. In your dev center, go to **Catalogs**, select the repository, and then select **Sync**.

    :::image type="content" source="../deployment-environments/media/configure-catalog-item/sync-catalog-items.png" alt-text="Screenshot that shows how to sync the catalog." :::

The service scans the repository to find new catalog items. After you sync the repository, new catalog items are available to all projects in the dev center.

### Specify parameters for a catalog item

You can specify parameters for your catalog items to allow developers to customize their environments. 

Parameters are defined in the manifest.yaml file. You can use the following options for parameters: 

|Option  |Description  |
|---------|---------|
|ID     |Enter an ID for the parameter.|
|name     |Enter a name for the parameter.|
|description     |Enter a description for the parameter.|
|default     |Optional. Enter a default value for the parameter. The default value can be overwritten at creation.|
|type     |Enter the data type for the parameter.|
|required|Enter `true` for a value that's required, and  `false` for a value that's not required.|

The following script is an example of a *manifest.yaml* file that includes two parameters; `location` and `name`: 

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

Developers can supply values for specific parameters for their environments through the developer portal.

:::image type="content" source="media/configure-catalog-item/parameters.png" alt-text="Screenshot showing the parameters pane.":::

Developers can also supply values for specific parameters for their environments through the CLI.

```azurecli
az devcenter dev environment create --catalog-item-name
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
## Update a catalog item

To modify the configuration of Azure resources in an existing catalog item, update the associated ARM template JSON file in the repository. The change is immediately reflected when you create a new environment by using the specific catalog item. The update also is applied when you redeploy an environment that's associated with that catalog item.

To update any metadata related to the ARM template, modify *manifest.yaml*, and then [update the catalog](how-to-configure-catalog.md#update-a-catalog).

## Delete a catalog item

To delete an existing catalog item, in the repository, delete the subfolder that contains the ARM template JSON file and the associated manifest YAML file. Then, [update the catalog](how-to-configure-catalog.md#update-a-catalog).

After you delete a catalog item, development teams can no longer use the specific catalog item to deploy a new environment. Update the catalog item reference for any existing environments that were created by using the deleted catalog item. If the reference isn't updated and the environment is redeployed, the deployment fails.

## Next steps

- Learn how to [create and configure a project](./quickstart-create-and-configure-projects.md).
- Learn how to [create and configure an environment type](quickstart-create-access-environments.md).
