---
title: PowerShell modules for Machine Learning Studio
titleSuffix: Azure Machine Learning Studio
description: Use PowerShell to create and manage Azure Machine Learning Studio workspaces, experiments, web services, and more. 
services: machine-learning
ms.service: machine-learning
ms.subservice: studio
ms.topic: conceptual

author: xiaoharper
ms.author: amlstudiodocs
ms.date: 04/25/2019
---
# PowerShell modules for Azure Machine Learning Studio

Using PowerShell modules, you can programmatically manage your Studio resources and assets such as workspaces, datasets, and web services.

You can interact with Studio resources using three Powershell modules:

* [Azure PowerShell Az](#az-rm) released in 2018, includes all functionality of AzureRM, although with different cmdlet names
* [AzureRM](#az-rm) released in 2016, replaced by PowerShell Az
* [Azure Machine Learning PowerShell classic](#classic) released in 2016

Although these PowerShell modules have some similarities, each is designed for particular scenarios. This article describes the differences between the PowerShell modules, and helps you decide which ones to choose.  

Check the [support table](#support-table) below to see which resources are supported by each module. 

## <a name="az-rm"></a> Azure PowerShell Az and AzureRM

Az is now the intended PowerShell module for interacting with Azure and includes all the previous functionality of AzureRM. AzureRM will continue to receive bug fixes, but it will receive no new cmdlets or features.  Az and AzureRM both manage solutions deployed using the **Azure Resource Manager** deployment model. These resources include Studio workspaces and Studio "New" web services. 

PowerShell classic can be installed alongside either Az or AzureRM to cover both "new" and "classic" resource types. However, it is not recommended to have Az and AzureRM installed at the same time. To decide between Az and AzureRM, Microsoft recommends Az for all future deployments.  Learn more about Az versus AzureRM and the migration path in [introduction to the Azure PowerShell Az](https://docs.microsoft.com/powershell/azure/new-azureps-module-az).

To get started with Az, follow the [installation instructions for Azure Az](https://docs.microsoft.com/powershell/azure/install-az-ps).

## <a name="classic"></a> PowerShell classic

The Studio [PowerShell classic module](https://aka.ms/amlps) allows you to manage resources deployed using the **classic deployment model**. These resources include Studio user assets, "classic" web services, and "classic" web service endpoints.

However, Microsoft recommends that you use the Resource Manager deployment model for all future resources to simplify the deployment and management of resources. If you would like to learn more about the deployment models, see the [Azure Resource Manager vs. classic deployment](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-deployment-model) article.

To get started with PowerShell classic, download the [release package](https://github.com/hning86/azuremlps/releases) from GitHub and follow the [instructions for installation](https://github.com/hning86/azuremlps/blob/master/README.md). The instructions explain how to unblock the downloaded/unzipped DLL and then import it into your PowerShell environment.

PowerShell classic can be installed alongside either Az or AzureRM to cover both "new" and "classic" resource types.

## <a name="support-table"></a> PowerShell support table


| | **Az** |  **PowerShell classic** |
| --- | --- | --- |
| Create/delete workspaces | [Resource Manager templates](https://docs.microsoft.com/azure/machine-learning/studio/deploy-with-resource-manager-template) |  |
| Manage workspace commitment plans | [New-AzMlCommitmentPlan](https://docs.microsoft.com/powershell/module/az.machinelearning/new-azmlcommitmentplan) | |
| Manage workspace users |  | [Add-AmlWorkspaceUsers](https://github.com/hning86/azuremlps#add-amlworkspaceusers)|
| Manage web services | [New-AzMlWebService](https://docs.microsoft.com/powershell/module/az.machinelearning/new-azmlwebservice) <br>("new" web services)|| [New-AmlWebService](https://github.com/hning86/azuremlps#manage-classic-web-service) <br>("classic" web services) |
| Manage web service endpoints/keys |  [Get-AzMlWebServiceKey](https://docs.microsoft.com/powershell/module/az.machinelearning/get-azmlwebservicekey)|  [Add-AmlWebServiceEndpoint](https://github.com/hning86/azuremlps#manage-classic-web-servcie-endpoint)|
| Manage user datasets/trained models| | [Get-AmlDataset](https://github.com/hning86/azuremlps#manage-user-assets-dataset-trained-model-transform) |
| Manage user experiments |  | [Start-AmlExperiment](https://github.com/hning86/azuremlps#manage-experiment) |
| Manage custom modules | | [New-AmlCustomModule](https://github.com/hning86/azuremlps#manage-custom-module) |


## Next steps
Consult the full documentation these PowerShell module:
* [PowerShell classic](https://aka.ms/amlps)
* [Azure PowerShell Az](https://docs.microsoft.com/powershell/module/az.machinelearning/#machine_learning)
