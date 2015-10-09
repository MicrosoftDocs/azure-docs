<properties
	pageTitle="Azure PowerShell 1.0 Preview Resource Manager Changes | Microsoft Azure"
	description="Describes the changes in the Resource Manager cmdlets that were made for Azure PowerShell 1.0 Preview."
	services="azure-resource-manager"
	documentationCenter="na"
	authors="ravbhatnagar"
	manager="ryjones"
	editor=""/>

<tags
	ms.service="azure-resource-manager"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="powershell"
	ms.workload="na"
	ms.date="10/09/2015"
	ms.author="gauravbh;tomfitz"/>

#Changes to Azure Resource Manager Management PowerShell Cmdlets

As part of the Azure PowerShell 1.0 Preview release, we made a few improvements to the management cmdlets. These improvements are in addition to the cmdlet name changes that are part of 1.0 Preview. 
Some of these improvements involve big changes and might break your existing scripts. Our hope is that 
your experience will be improved by these changes. We would like to hear your feedback about these changes and we will incorporate that feedback into Azure PowerShell 1.0. So, please try the new cmdlets, and provide us with feedback.

##Decoupled template deployment from Resource Groups

In 0.9.8 release, all of the template deployment parameters were also present in the resource group cmdlets. So, in New-AzureResourceGroup, you could create a new resource group, as well as, 
provide details of the templates you would like to deploy. The same template deployment functionality was also present in New-AzureResourceGroupDeployment. 
In the 1.0 preview, we have decoupled this functionality. Now, New-AzureRMResourceGroup will provide the functionality of creating new resource groups, and New-AzureRmResourceGroupDeployment will provide the 
functionality of deploying the template. You can use piping to use the two together. This makes the cmdlets easier to understand and use.

##Consolidated Audit Logs Cmdlets

For audit logs, we had numerous cmdlets to get logs at various scopes; such as, Get-AzureResourceProviderLog, Get-AzureResourceGroupLog, Get-AzureSubscriptionIdLog, and Get-AzureResourceLog. To get logs, 
you often had to run a combination of the log cmdlets. This experience was not optimal. We have consolidated this functionality into a single cmdlet which can be called at different scopes through 
the use of parameters. Now, you can call Get-AzureRmLog with the appropriate parameter to specify the scope.

##Changes to Get cmdlet for Resource and Resource Groups

We have incorporated changes to the Get-AzureRmResource and Get-AzureRmResourceGroup cmdlets so that these cmdlets now query directly against only the resource provider. We have decoupled the functionality to query against the cache into new cmdlets called Find-AzureRmResource*. If you want to find a resource group having a particular tag, you can use the new Find-AzureRmResourceGroup cmdlet. With this change, parameters for querying against tags 
have been removed from the Get-AzureRmResource and Get-AzureRmResourceGroup cmdlets.

##Removed Test-AzureResource and Test-AzureResourceGroup

These cmdlets did not work reliably for every scenario and resource type. We are working towards a better solution for this functionality. In the meantime, we did not want you 
to continue using cmdlets that were not reliable. We have removed these cmdlets in this release, and we will add a reliable solution in a future release.

##Get-AzureRmResourceProvider Improvements

Now, you can use the Get-AzureRmResourceProvider cmdlet to get location information for resource providers. It will tell you which providers and types are available in a particular region. Also, you can use this cmdlet to 
obtain the list of available locations for a particular provider. We have removed the Get-AzureLocation cmdlet as you can get all location information through 
the Get-AzureRmResourceProvider cmdlet.

##Policy Cmdlets

We have added policy support to Azure Resource Manager. The PowerShell cmdlets to manage policies have been added in this release. For more details about policies, see 
[Use Policy to manage resources and control access](https://azure.microsoft.com/documentation/articles/resource-manager-policy/). 
