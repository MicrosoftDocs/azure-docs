---
title: Retrain a New Azure Machine Learning web service with PowerShell | Microsoft Docs
description: Learn how to programmatically retrain a model and update the web service to use the newly trained model in Azure Machine Learning using the Machine Learning Management PowerShell cmdlets.
services: machine-learning
documentationcenter: ''
author: YasinMSFT
ms.author: yahajiza
manager: hjerez
editor: cgronlun

ms.assetid: 3953a398-6174-4d2d-8bbd-e55cf1639415
ms.service: machine-learning
ms.component: studio
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/28/2017

---
# Retrain a New Resource Manager based web service using the Machine Learning Management PowerShell cmdlets
When you retrain a New web service, you update the predictive web service definition to reference the new trained model.

## Prerequisites
You must set up a training experiment and a predictive experiment as shown in [Retrain Machine Learning models programmatically](retrain-models-programmatically.md).

> [!IMPORTANT]
> The predictive experiment must be deployed as an Azure Resource Manager (New) based machine learning web service.
> To deploy a New web service you must have sufficient permissions in the subscription to which you deploying the web service. For more information, see [Manage a Web service using the Azure Machine Learning Web Services portal](manage-new-webservice.md).

For additional information on Deploying web services, see [Deploy an Azure Machine Learning web service](publish-a-machine-learning-web-service.md).

This process requires that you have installed the Azure Machine Learning Cmdlets. For information installing the Machine Learning cmdlets, see the [Azure Machine Learning Cmdlets](https://docs.microsoft.com/powershell/module/azurerm.machinelearning/) reference on MSDN.

Copied the following information from the retraining output:

* BaseLocation
* RelativeLocation

The steps you take are:

1. Sign in to your Azure Resource Manager account.
2. Get the web service definition
3. Export the Web Service Definition as JSON
4. Update the reference to the ilearner blob in the JSON.
5. Import the JSON into a Web Service Definition
6. Update the web service with new Web Service Definition

## Sign in to your Azure Resource Manager account
You must first sign in to your Azure account from within the PowerShell environment using the [Connect-AzureRmAccount](/powershell/module/azurerm.profile/connect-azurermaccount) cmdlet.

## Get the Web Service Definition
Next, get the Web Service by calling the [Get-AzureRmMlWebService](https://docs.microsoft.com/powershell/module/azurerm.machinelearning/get-azurermmlwebservice) cmdlet. The Web Service Definition is an internal representation of the trained model of the web service and is not directly modifiable. Make sure that you are retrieving the Web Service Definition for your Predictive experiment and not your training experiment.

    $wsd = Get-AzureRmMlWebService -Name 'RetrainSamplePre.2016.8.17.0.3.51.237' -ResourceGroupName 'Default-MachineLearning-SouthCentralUS'

To determine the resource group name of an existing web service, run the Get-AzureRmMlWebService cmdlet without any parameters to display the web services in your subscription. Locate the web service, and then look at its web service ID. The name of the resource group is the fourth element in the ID, just after the *resourceGroups* element. In the following example, the resource group name is Default-MachineLearning-SouthCentralUS.

    Properties : Microsoft.Azure.Management.MachineLearning.WebServices.Models.WebServicePropertiesForGraph
    Id : /subscriptions/<subscription ID>/resourceGroups/Default-MachineLearning-SouthCentralUS/providers/Microsoft.MachineLearning/webServices/RetrainSamplePre.2016.8.17.0.3.51.237
    Name : RetrainSamplePre.2016.8.17.0.3.51.237
    Location : South Central US
    Type : Microsoft.MachineLearning/webServices
    Tags : {}

Alternatively, to determine the resource group name of an existing web service, log on to the Microsoft Azure Machine Learning Web Services portal. Select the web service. The resource group name is the fifth element of the URL of the web service, just after the *resourceGroups* element. In the following example, the resource group name is Default-MachineLearning-SouthCentralUS.

    https://services.azureml.net/subscriptions/<subcription ID>/resourceGroups/Default-MachineLearning-SouthCentralUS/providers/Microsoft.MachineLearning/webServices/RetrainSamplePre.2016.8.17.0.3.51.237


## Export the Web Service Definition as JSON
To modify the definition to the trained model to use the newly Trained Model, you must first use the [Export-AzureRmMlWebService](https://docs.microsoft.com/powershell/module/azurerm.machinelearning/export-azurermmlwebservice) cmdlet to export it to a JSON format file.

    Export-AzureRmMlWebService -WebService $wsd -OutputFile "C:\temp\mlservice_export.json"

## Update the reference to the ilearner blob in the JSON.
In the assets, locate the [trained model], update the *uri* value in the *locationInfo* node with the URI of the ilearner blob. The URI is generated by combining the *BaseLocation* and the *RelativeLocation* from the output of the BES retraining call. This updates the path to reference the new trained model.

     "asset3": {
        "name": "Retrain Samp.le [trained model]",
        "type": "Resource",
        "locationInfo": {
          "uri": "https://mltestaccount.blob.core.windows.net/azuremlassetscontainer/baca7bca650f46218633552c0bcbba0e.ilearner"
        },
        "outputPorts": {
          "Results dataset": {
            "type": "Dataset"
          }
        }
      },

## Import the JSON into a Web Service Definition
You must use the [Import-AzureRmMlWebService](https://docs.microsoft.com/powershell/module/azurerm.machinelearning/import-azurermmlwebservice) cmdlet to convert the modified JSON file back into a Web Service Definition that you can use to update the Web Service Definition.

    $wsd = Import-AzureRmMlWebService -InputFile "C:\temp\mlservice_export.json"


## Update the web service with new Web Service Definition
Finally, you use [Update-AzureRmMlWebService](https://docs.microsoft.com/powershell/module/azurerm.machinelearning/update-azurermmlwebservice) cmdlet to update the Web Service Definition.

    Update-AzureRmMlWebService -Name 'RetrainSamplePre.2016.8.17.0.3.51.237' -ResourceGroupName 'Default-MachineLearning-SouthCentralUS'  -ServiceUpdates $wsd

## Summary
Using the Machine Learning PowerShell management cmdlets, you can update the trained model of a predictive Web Service enabling scenarios such as:

* Periodic model retraining with new data.
* Distribution of a model to customers with the goal of letting them retrain the model using their own data.

