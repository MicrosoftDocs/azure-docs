---
title: Use a template to create a workspace
titleSuffix: Azure Machine Learning service
description: Learn how to use an Azure resource manager template to create a new Azure Machine Learning service workspace.
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual

ms.reviewer: larryfr
ms.author: aashishb
author: aashishb
ms.date: 02/04/2019

# Customer intent: As a DevOps person, I need to automate or customize the creation of Azure Machine Learning service by using templates.
---

In this article, you learn several ways to create an Azure Machine Learning service workspace using Azure Resource Manager templates. For more information, see [Deploy an application with Azure Resource Manager template](../../azure-resource-manager/resource-group-template-deploy.md).

## Prerequisites

* An **Azure subscription**. If you do not have one, create a free account before you begin. Try the [free or paid version of Azure Machine Learning service](http://aka.ms/AMLFree) today.

* To use a template from a CLI, you need either [Azure PowerShell](https://docs.microsoft.com/powershell/azure/overview?view=azps-1.2.0) or the [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest).

## Resource Manager template

A Resource Manager template makes it easy to create resources as a single, coordinated operation. A template is a JSON document that defines the resources that are needed for a deployment. It may also specify deployment parameters, which you can use to provide input values when using the template.

An example template to create an Azure Machine Learning service workspace and associated Azure resources is available in the [Azure quickstart template repository](https://github.com/Azure/azure-quickstart-templates/101-azure-machine-learning-service-workspace). It contains definitions for the following Azure services:

* Azure Resource Group
* Azure Storage Account
* Azure Key Vault
* Azure Application Insights
* Azure Container Registry
* Azure Machine Learning workspace

The resource group is the container that holds the services. The various services are required by the Azure Machine Learning workspace.

The example template has two parameters:

* The **location** where the resource group and services will be created.
* The **workspace name**, which is the friendly name of the Azure Machine Learning workspace.

The names of the other services are generated randomly.

For more information on templates, see the following articles:

* [Author Azure Resource Manager templates](../../azure-resource-manager/resource-group-authoring-templates.md)
* [Deploy an application with Azure Resource Manager templates](../../azure-resource-manager/resource-group-template-deploy.md)
* [Microsoft.MachineLearningServices resource types](https://docs.microsoft.com/azure/templates/microsoft.machinelearningservices/allversions)

## Use the Azure portal

From the [Azure quickstart template repository](https://github.com/Azure/azure-quickstart-templates/101-azure-machine-learning-service-workspace), select the __Deploy to Azure__ button. This button opens the template in the Azure portal. You may be prompted to login to the portal.

You must provide the following information and agree to the listed terms and conditions:

* Subscription: Select the Azure subscription to use for these resources.
* Resource group: Select or create a resource group to contain the services.
* Workspace name: The name to use for the Azure Machine Learning workspace that will be created.
* Location: Select the location where the resources will be created.

For more information, see [Deploy resources from custom template](../../azure-resource-manager/resource-group-template-deploy-portal.md#deploy-resources-from-custom-template).

## Use Azure PowerShell

The following example assumes that you are using the command from a local directory that contains the template from [Azure quickstart template repository](https://github.com/Azure/azure-quickstart-templates/101-azure-machine-learning-service-workspace). It also assumes that you have authenticated to your Azure subscription from Azure PowerShell:

```powershell
New-AzResourceGroup -Name examplegroup -Location "East US"
new-azresourcegroupdeployment -name exampledeployment `
  -resourcegroupname examplegroup -location "East US" `
  -templatefile .\azuredeploy.json -workspaceName "exampleworkspace"
```

For more information, see [Deploy resources with Resource Manager templates and Azure PowerShell](../../azure-resource-manager/resource-group-template-deploy.md) and [Deploy private Resource Manager template with SAS token and Azure PowerShell](../../azure-resource-manager/resource-manager-powershell-sas-token.md).

## Use Azure CLI

The following example assumes that you are using the command from a local directory that contains the template from [Azure quickstart template repository](https://github.com/Azure/azure-quickstart-templates/101-azure-machine-learning-service-workspace). It also assumes that you have authenticated to your Azure subscription from the Azure CLI:

```azurecli-interactive
az group create --name examplegroup --location "East US"
az group deployment create \
  --name exampledeployment \
  --resource-group examplegroup \
  --template-file azuredeploy.json \
  --parameters workspaceName=exampleworkspace
```

For more information, see [Deploy resources with Resource Manager templates and Azure CLI](../../azure-resource-manager/resource-group-template-deploy-cli.md) and [Deploy private Resource Manager template with SAS token and Azure CLI](../../azure-resource-manager/resource-manager-cli-sas-token.md).

## Next steps

* [Deploy resources with Resource Manager templates and Resource Manager REST API](../../azure-resource-manager/resource-group-template-deploy-rest.md).
* [Creating and deploying Azure resource groups through Visual Studio](../../azure-resource-manager/vs-azure-tools-resource-groups-deployment-projects-create-deploy.md).