---
title: Configure a Catalog Item in Azure Deployment Environments 
description: This article helps you configure a Catalog Item in GitHub repo or Azure DevOps repo.
services: Azure Deployment Environments
author: anandmeg
ms.service: deployment-environments
ms.topic: how-to
ms.date: 10/12/2022
ms.custom: devdivchpfy22, ignite-2022
ms.author: meghaanand
---
# Configure a Catalog Item in GitHub repo or Azure DevOps repo

In Azure Deployment Environments Preview service, you can use a [Catalog](concept-environments-key-concepts.md#catalogs) to provide your development teams with a curated set of predefined [*infrastructure as code (IaC)*](/devops/deliver/what-is-infrastructure-as-code) templates called [Catalog Items](concept-environments-key-concepts.md#catalog-items). A catalog item is a combination of an *infrastructure as code (IaC)* template (for example, [Azure Resource Manager (ARM) templates](../azure-resource-manager/templates/overview.md)) and a manifest (*manifest.yml*) file.

>[!NOTE]
> Azure Deployment Environments Preview currently only supports Azure Resource Manager (ARM) templates. 

The IaC template will contain the environment definition and the manifest file will be used to provide metadata about the template. The catalog items that you provide in the catalog will be used by your development teams to deploy environments in Azure.

We offer an example [Sample Catalog](https://aka.ms/deployment-environments/SampleCatalog) that you can attach as-is, or you can fork and customize the catalog items. You can attach your private repo to use your own catalog items.

After you [attach a catalog](how-to-configure-catalog.md) to your dev center, the service will scan through the specified folder path to identify folders containing an ARM template and the associated manifest file. The specified folder path should be a folder that contains sub-folders with the catalog item files.

In this article, you'll learn how to:

* Add a new catalog item
* Update a catalog item
* Delete a catalog item

> [!IMPORTANT]
> Azure Deployment Environments is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Add a new catalog item

Provide a new catalog item to your development team as follows:

1. Create a subfolder in the specified folder path, and then add a *ARM_template.json* and the associated *manifest.yaml* file.
    :::image type="content" source="../deployment-environments/media/configure-catalog-item/create-subfolder-in-path.png" alt-text="Screenshot of subfolder in folder path containing ARM template and manifest file.":::

    1. **Add ARM template**
        
        To implement infrastructure as code for your Azure solutions, use Azure Resource Manager templates (ARM templates). 
        
        [Azure Resource Manager (ARM) templates](../azure-resource-manager/templates/overview.md) help you define the infrastructure and configuration of your Azure solution and repeatedly deploy it in a consistent state.
        
        To learn about how to get started with ARM templates, see the following:
        
        - [Understand the structure and syntax of Azure Resource Manager Templates](../azure-resource-manager/templates/syntax.md) describes the structure of an Azure Resource Manager template and the properties that are available in the different sections of a template.
        - [Use linked templates](../azure-resource-manager/templates/linked-templates.md?tabs=azure-powershell#use-relative-path-for-linked-templates) describes how to use linked templates with the new ARM `relativePath` property to easily modularize your templates and share core components between catalog items.

    1. **Add manifest file**
    
        The *manifest.yaml* file contains metadata related to the ARM template. 
        
        The following is a sample *manifest.yaml* file.
        
        ```
            name: WebApp
            version: 1.0.0
            summary: Azure Web App Environment
            description: Deploys an Azure Web App without a data store
            runner: ARM
            templatePath: azuredeploy.json
         ```     
        
        >[!NOTE]
        > `version` is an optional field, and will later be used to support multiple versions of catalog items.

1. On the **Catalogs** page of the dev center, select the specific repo, and then select **Sync**.

    :::image type="content" source="../deployment-environments/media/configure-catalog-item/sync-catalog-items.png" alt-text="Screenshot showing how to sync the catalog." :::

1. The service scans through the repository to discover any new catalog items and makes them available to all the projects.

## Update an existing catalog item

To modify the configuration of Azure resources in an existing catalog item, directly update the associated *ARM_Template.json* file in the repository. The change is immediately reflected when you create a new environment using the specific catalog item, and when you redeploy an environment associated with that catalog item. 

To update any metadata related to the ARM template, modify the *manifest.yaml* and [update the catalog](how-to-configure-catalog.md). 

## Delete a catalog item
To delete an existing Catalog Item, delete the subfolder containing the ARM template and the associated manifest, and then [update the catalog](how-to-configure-catalog.md).

Once you delete a catalog item, development teams will no longer be able to use the specific catalog item to deploy a new environment. You'll need to update the catalog item reference for any existing environments created using the deleted catalog item. Redeploying the environment without updating the reference will result in a deployment failure.

## Next steps

* [Create and configure projects](./quickstart-create-and-configure-projects.md)
* [Create and configure environment types](quickstart-create-access-environments.md).
