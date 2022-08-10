---
title: Configure a Catalog Item in Azure Deployment Environments 
description: This article helps you configure a Catalog Item in GitHub repo or Azure DevOps repo.
services: Azure Deployment Environments
author: anandmeg
ms.service: deployment-environments
ms.topic: how-to
ms.date: 08/03/2022
ms.custom: devdivchpfy22
ms.author: meghaanand
---
# Configure a Catalog Item in GitHub repo or Azure DevOps repo

In Azure Deployment Environments service, you can use a dev center Catalog to provide your development teams with a curated set of 'infra-as-code' templates called Catalog Items. A Catalog Item is a combination of an 'infra-as-code' template 
(Azure Resource Manager (ARM) templates during Azure Deployment Environments preview) and a manifest file. 

The environment definition will be defined in the ARM Template, and the *manifest.yaml* file will be used to provide metadata about the template. The Catalog Items that you provide in the Catalog will be used by your development teams to spin-up environments in Azure.

We offer a Sample Catalog that you can attach as-is, or you can fork and customize the Catalog Items. You can attach your private repo to use your own Catalog Items.

After you attach a Catalog to your dev center, the service will scan through the specified folder path to identify folders containing an ARM Template and the associated manifest file. 

> [!NOTE]
> The specified folder path should be a folder that contains subfolders with Catalog Item files.

## Adding a new Catalog Item

Provide a new Catalog Item to your development as follows: 

1. Create a subfolder in the specified folder path and add the *ARM_template.json* file and the associated *manifest.yaml* file.
 
    :::image type="content" source="../deployment-environments/media/configure-catalog-item/create-subfolder-in-path.png" alt-text="Screenshot to create sub folder in folder path.":::

### ARM template

[Azure Resource Manager (ARM) Templates](../azure-resource-manager/templates/overview.md): helps you to define the infrastructure/configuration of your Azure solution and repeatedly deploy it in a consistent state.

[Understand the structure and syntax of Azure Resource Manager Templates](../azure-resource-manager/templates/syntax.md): describes the structure of an Azure Resource Manager Template and the **properties** that are available in the different sections of a template.

[Use linked templates](../azure-resource-manager/templates/linked-templates.md?tabs=azure-powershell#use-relative-path-for-linked-templates): Describes how to use linked templates with the new ARM relativePath **property** to easily modularize your templates and share core components between Catalog Items.


### Manifest

The *manifest.yaml* file contains metadata related to the ARM template. The following is a sample *manifest.yaml* file.

```
    name: WebApp
    version: 1.0.0
    description: Deploys an Azure Web App without a data store
    engine:
      type: ARM
      templatePath: azuredeploy.json
 ```     
1. On the **Catalog** menu of the dev center, select the specific repo and then select **Sync**.

    :::image type="content" source="../deployment-environments/media/configure-catalog-item/sync-catalog.png" alt-text="Screenshot showing how to sync the catalog." :::

1. The service scans through the repository to discover any new Catalog Items and make them available to all the projects.

## Updating an existing Catalog Item

To modify the configuration of Azure resources in an existing Catalog Item, directly update the associated *ARM_Template.json* file in the repository. The change is immediately reflected when you either create a new environment using the specific Catalog Item or if you redeploy an Environment that is associated with the Catalog Item. 

To update any metadata related to the ARM template, modify the *manifest.yaml* and update the Catalog. 

## Deleting a Catalog Item

To delete an existing Catalog Item, delete the subfolder containing the ARM template and the associated manifest, and then update the Catalog.

Once you delete a Catalog Item, development teams will no longer be able to use the specific Catalog Item. If any existing environments were created using the deleted Catalog Item, you'll need to update the Catalog Item reference. If the reference isn't updated and the environment is redeployed, it results in a deployment failure.

## Next steps

* Create and configure Environment Types. You can use them to create new Environments.

* [Create and Configure Projects](./quickstart-create-and-configure-projects.md)