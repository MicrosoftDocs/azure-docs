---
title: Create and manage registries (preview)
titleSuffix: Azure Machine Learning
description: Learn how create registries with the CLI, Azure Portal and AzureML Studio 
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.author: 
author: mabables
ms.date: 9/9/2022
ms.topic: how-to
ms.custom: devx-track-python
---

# Manage Azure Machine Learning registies

In this article you will learn how to create [**Azure Machine Learning registries**](todo) using the CLI, Azure portal or the CLI.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.
* If you create the registry using CLI, you need to [Install and set up CLI (v2)](how-to-configure-cli.md).

## Prepare to create registry

You need to decide the following information carefully before proceeding to create a registry. 

### Choosing a name

Consider the following factors before picking a name.
* Registries are meant to facilitate sharing of ML assets across teams within your orgnization across all workspaces. Choose a name that is reflective of the sharing scope. The name should help identify your group, division or orgnization. 
* Registry unique with your orgnization (Azure Active Directory tenant). Its recommended to prefix your team or orgnization name and avoid generic names. 
* Registry names cannot be changed once created because they are used in IDs of models, environments and components which are referneced in code. 
  * Length can be 2-32 characters. 
  * Alphanumerics, underscore, hyphen are allowed. No other pecial charaters. No spaces - registry names are part of model, environment, and component IDs that can be referenced in code.  
  * Name can contain underscore or hyphen but cannot start with a underscore or hyphen. Needs to start with an alphanumeric. 

### Choosing Azure regions 

Registies enable sharing of assets across workspaces. To do so, a registry replicates content across multiple Azure regions using Azure resources such as [Azure Container Registry replication](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-geo-replication) and Blob storage accounts. You need to define the list of regions that a registry needs to support when creating a registry. A master list of all regions in which you have workspaces today and plan to add in near future is a good set of regions to start with. You define a primary region which cannot be changed and set of an additional regions that can be updated at a later point.

### Checking for Permissions

Make sure you are the "Owner" or "Contributor" of the subscription or resource group in which you plan to create the registry. If you don't have one of these built in roles, review the section on permissions toward the end of this article. 


## Create registry using CLI

Create the YAML definition and name it `registry.yml`.

```YAML
type: registry
description: Platform to share machine learning models, components and environments
name: HelloWorldReg
resource_group: ContosoML
primary_location: eastus
locations:
 - eastus2
 - westus
```

> [TIP]
> You typically see display names of Azure regions such as 'East US' in the Azure Portal but the registry creation YAML needs names of regions without spaces and lower case letters. Use `az account list-locations -o table` to find the mapping of region display names to the name of the region that can be specified in YAML.

Run the registry create command.

`az ml registry create --file registry.yml`

### Add or remove regions using CLI

<todo>

## Create registry using Studio UI

You can create registries in the Studio UI in the "Manage Registries" tab im "Registries" hub. If you are in a workspace, you need to navigate to the global UI by clicking your orgnization or tenant name in the navigation pane for find the "Registries" hub or you can open [https://ml.azure.com/registries](https://ml.azure.com/registries). Get started by clicking the "Create registry" button. Enter the registry name, select the subscription and resource group. Click next, and select the primary regions and additional regions. Review the entered information and click Create. You can track the progress of the create operation in the Azure Portal. Once the registry is successfully created, you can find it listed in the Manage Registries tab. 

![](./media/how-to-manage-registries/create-azureml-registry-studio.gif)

## Create registry using Azure Portal

Navigate to the Azure Machine Learning service. You can do this by searching for "Azure Machine Learning" in the search bar at the top of the page or going to "All Services" looking for "Azure Machine Learning" under the "AI + machine learning" category. 

Click on "Create" button and pick "Azure Machine Learning registry". Enter the registry name, select the subscription, resource group and primary region. Enter an optional description and click Next. Select the additional regions the registry must support and click Next. Enter tags and click "Review + Create". Review the information and click Create. You will be navigated to the deployment status page where you can track the progress. 

![](./media/how-to-manage-registries/create-azureml-registry-azure-portal.gif)

(todo: need to capture better gif)

## Add users to the registry 

Decide if you want allow the user to only use assets (models, environments and components) from the registry or both use and create assets in the registry. 

### Allow users to use assets from registry

To let a user only read assets you can grant the user the built-in "Reader" role. If don't want to use the built-in role, create a custom role with the following permissions

Permission | Description 
--|--
Microsoft.MachineLearningServices/registries/read | Allows the user to list registries and get registry metadata
Microsoft.MachineLearningServices/registries/assets/read | Allows the user to browse assets and use the assets in a workspace

### Allow users to create and use assets from registry

To let the user both read and create or delete assets, you need to grant the following write permission in addition to the above read permissions.

Permission | Description 
--|--
Microsoft.MachineLearningServices/registries/assets/write | Create assets in registries
Microsoft.MachineLearningServices/registries/assets/delete| Delete assets in registries

> [!WARNING]
> The built-in "Contributor" role allows users to create, update and delete registries. You need to create a custom role if you want the user to create and use assets from registry but not create or update registries. 

### Allow users to create and manage registries

To let users create, update and delete registries, grant the built in "Contributor" or "Owner" role. If you don't want to use built in roles, create a custom role with the following permissions, in addition to all the above permissions to read, create and delete assets in registry.

Permission | Description 
--|--
Microsoft.MachineLearningServices/registries/write| Allows the user to create or update registries
Microsoft.MachineLearningServices/registries/delete | Allows the user to delete registries


## Next steps

* [Learn how to share models, components and environments across workspaces with registries using CLI (preview)](./how-to-share-models-pipelines-across-workspaces-with-registries.md)
* [Learn how to share models, components and environments across workspaces with registries using Python SDK (preview)](./how-to-share-models-pipelines-across-workspaces-with-registries-sdk.md)

