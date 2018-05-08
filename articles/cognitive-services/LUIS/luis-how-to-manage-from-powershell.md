---
title: Monitor LUIS from Azure portal cloud shell | Microsoft Docs
description: Learn how to get usage information in Azure portal cloud shell for LUIS.
services: cognitive-services
author: v-geberr
manager: kaiqb
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 05/08/2017
ms.author: v-geberr
---

# Manage LUIS service from Azure portal cloud shell
The Azure portal allows you to use PowerShell cmdlets to work with Azure resources, including LUIS resources. 

These cmdlets include creating a LUIS subscription, getting information about the subscription, and removing the subscription. 

## Launch cloud shell
In order to use PowerShell in the Azure portal [cloud shell](https://docs.microsoft.com/azure/cloud-shell/quickstart-powershell), you need to have an Azure storage account. If you don't have one, the [process will create one](https://docs.microsoft.com/en-us/azure/cloud-shell/persisting-shell-storage-powershell) for you. The storage account is necessary for any PowerShell scripts you want to store in the cloud.  

You also need to authenticate to Azure in the cloud shell to access any resources. 

Once you have a storage account and are authenticated, you can run PowerShell cmdlets.

## Open Cloud Shell
There are several ways to find LUIS endpoint usage information. With PowerShell 6.x, a PowerShell cmdlet gives you endpoint hits. 

When you use the Azure portal cloud shell, you are always on the most current PowerShell version. 

Use the **Launch Cloud Shell** following below to open the Azure cloud shell or open a browser with [https://shell.azure.com](https://shell.azure.com). 

<a style="cursor:pointer" onclick='javascript:window.open("https://shell.azure.com", "_blank", "toolbar=no,scrollbars=yes,resizable=yes,menubar=no,location=no,status=no")'><image src="https://shell.azure.com/images/launchcloudshell.png" /></a>

## LUIS endpoint usage information

The PowerShell 6.x cmdlet, `Get-AzureRmCognitiveServicesAccountUsage`, provides usage information for Microsoft Cognitive Services including LUIS. [Get-AzureRmCognitiveServicesAccountUsage](https://docs.microsoft.com/powershell/module/azurerm.cognitiveservices/get-azurermcognitiveservicesaccountusage?view=azurermps-6.0.0) requires the resource group and resource name of the service. 

The command syntax is:

```
Get-AzureRmCognitiveServicesAccountUsage -ResourceGroupName luis-westus-rg -Name luis-westus-1
```

In the preceding example, the resource group name is `luis-westus-rg` and the LUIS service subscription name is `luis-westus-1`. Both these names are chosen when the LUIS service is created. 

The cmdlet returns usage information:

```
CurrentValue  : 16
Name          : LUIS.Calls
Limit         : 10000
Status        : Included
Unit          : Count
QuotaPeriod   : 30.00:00:00
NextResetTime : 2018-06-07T18:28:52Z
```

Save the command as a Powershell file in the Azure storage account associated with the cloud shell and execute at any time. 

![Run script from storage](./media/luis-how-to-manage-from-powershell/run-script-from-storage.png)

Once the script is saved in the cloud drive, you can run the PowerShell script from the Azure phone app's cloud shell. 

![Run script from storage in phone app](./media/luis-how-to-manage-from-powershell/phone-app.png)