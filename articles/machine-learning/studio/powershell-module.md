---
title: PowerShell modules for Machine Learning Studio
titleSuffix: Azure Machine Learning Studio
description: Use PowerShell to create and manage workspaces, experiments, web services, and more. 
services: machine-learning
ms.service: machine-learning
ms.component: studio
ms.topic: article

author: ericlicoding
ms.author: amlstudiodocs
ms.custom: previous-ms.author=haining, previous-author=hning86
ms.date: 03/15/2017
---
# PowerShell modules for Azure Machine Learning Studio
PowerShell modules for Azure Machine Learning Studio are powerful tools that allow you to programmatically manage workspaces, datasets, web services, and more.

Three PowerShell modules currently support Studio:

* [AzureRM](#rm) introduced in 2015
* [PowerShell Classic](#classic) introduced in 2016
* [Azure PowerShell Az](#az) introduced in 2019

Although these modules have some similarities, each is designed for particular scenarios. This article describes the differences between the PowerShell modules, and helps you decide which one to choose.

 **Studio Workspaces** | **AzureRM -or- Az** | **PowerShell Classic** |
| --- | --- | --- | --- | --- |
| Create/Delete workspaces | [Resource Manager templates](https://docs.microsoft.com/en-us/azure/machine-learning/studio/deploy-with-resource-manager-template) | - |
| Manage workspace users | - | [Add-AmlWorkspaceUsers](https://github.com/hning86/azuremlps#add-amlworkspaceusers) |
| Manage commitment plans | [New-AzMlCommitmentPlan](https://docs.microsoft.com/en-us/powershell/module/az.machinelearning/new-azmlcommitmentplan) | - |
|||
| **Web services** | **AzureRM -or- Az** | **PowerShell Classic** |
| Manage web services |  [New-AzMlWebService](https://docs.microsoft.com/en-us/powershell/module/az.machinelearning/new-azmlwebservice) <br> (New web services)   | [Add-AmlWebService](https://github.com/hning86/azuremlps#add-amlwebservice) <br> (Classic web services) |
| Manage endpoints/keys |  [Get-AzMlWebServiceKeys](https://docs.microsoft.com/en-us/powershell/module/az.machinelearning/get-azmlwebservicekeys) <br> (New web services)  | [Add-AmlWebServiceEndpoint](https://github.com/hning86/azuremlps#add-amlwebserviceendpoint) <br> (Classic web services) |
|||
| **User assets** | **AzureRM -or- Az** | **PowerShell Classic** |
| Manage datasets/experiments | - | [Add-AmlExperiment](https://github.com/hning86/azuremlps#add-amlexperiment) |
| Manage trained models | - | [Add-AmlTrainedModel](https://github.com/hning86/azuremlps#add-amltrainedmodel) |
| Manage custom modules | - | [Add-AmlModule](https://github.com/hning86/azuremlps#add-amlmodule) |


## <a name="rm"></a> AzureRM

AzureRM, previously known as PowerShell Module (New), is used to manage Studio workspaces and Studio New web services. AzureRM manages solutions deployed using the **Azure Resource Manager** deployment model. To manage resources deployed using the classic deployment model, you should use the PowerShell Classic module. If you would like to learn more about the deployment models, see the [Azure Resource Manager vs. classic deployment](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-manager-deployment-model) article.

To get started with AzureRM, follow the installation instructions in [Install Azure Powershell.](https://docs.microsoft.com/en-us/powershell/azure/azurerm/install-azurerm-ps)

## <a name="classic"></a> PowerShell Classic
The Studio [PowerShell Classic module](https://aka.ms/amlps) allows you to fully manage resources deployed using the **classic deployment model**. These resources include Studio user assets, Classic web services, and Classic web service endpoints.

Microsoft recommends that you use Resource Manager deployment model for all new resources to simplify the deployment and management of resources.

To get started with PowerShell Classic, download the [release package](https://github.com/hning86/azuremlps/releases) from GitHub and follow the [instructions for installation](https://github.com/hning86/azuremlps/blob/master/README.md). The instructions explain how to unblock the downloaded/unzipped DLL and then import it into your PowerShell environment.

## <a name="az"></a> Azure PowerShell Az
Azure PowerShell Az is now the intended PowerShell module for interacting with Azure and includes all the functionality of AzureRM. Az offers shorter commands, improved stability, and cross-platform support.

While there is an upgrade path from AzureRM, if you encounter problems with Az PowerShell when working with Studio, report the problem and fall back to using AzureRM.

To learn more about the differences between AzureRM and Az, see the [Introducing the new Azure PowerShell Az module](https://docs.microsoft.com/en-us/powershell/azure/new-azureps-module-az) article.

To get started with Az, follow the [installation instructions for Azure Az](https://docs.microsoft.com/en-us/powershell/azure/install-az-ps).

## Next steps
You can find full documentation for the PowerShell modules at the following links:
* [AzureRM](https://docs.microsoft.com/en-us/powershell/module/azurerm.machinelearning/#machine_learning)
* [PowerShell Classic](https://aka.ms/amlps)
* [Azure PowerShell Az](https://docs.microsoft.com/en-us/powershell/module/az.machinelearning/#machine_learning)

For an extended example of how to use the PowerShell Classic module in a real-world scenario, check out the in-depth use case, [Create many Machine Learning models and web service endpoints from one experiment using PowerShell](create-models-and-endpoints-with-powershell.md).
