---
title: Using Azure PowerShell with Azure Storage for non-PublicAzure clouds | Microsoft Docs
description: Using Azure PowerShell with Azure Storage for the China Cloud, Government Cloud, and Germany Cloud
services: storage
documentationcenter: na
author: robinsh
manager: timlt

ms.assetid: 
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/19/2017
ms.author: robinsh
---

# How to connect to the Azure independent clouds using PowerShell

Most people use Azure Public Cloud for their global Azure deployment. There are also some independent deployments of Microsoft Azure for reasons of sovereignty and so on. These independent deployments are referred to as "environments." These are the available environments:

* [Azure Government Cloud](https://azure.microsoft.com/features/gov/)
* [Azure China Cloud operated by 21Vianet in China](http://www.windowsazure.cn/)
* [Azure Germany Cloud](../../germany/germany-welcome.md)

## Accessing storage

To use Azure Storage with one of the independent clouds available in Azure, you need to connect to that cloud instead of Azure Public. 

 The differences using one of these clouds versus Azure Public are as follows: 

	* You must specify the *environment* to which to connect.
	* You must determine the available regions.

Follow these steps to get you started:

1. Run the [Get-AzureEnvironment](/powershell/module/azure/Get-AzureRmEnvironment) cmdlet to see the available Azure environments:
   
	```powershell
	Get-AzureRmEnvironment
	```

2. Sign in to your account that has access to the cloud to which you want to connect and set the environment. This example shows how to use the Azure China Cloud.   
	```powershell
	Login-RmAccount –Environment AzureChinaCloud
	```

    For the Government cloud, use AzureUSGovernment instead of AzureChinaCloud. For the German Cloud, use AzureGermanCloud.

From here forward, you can retrieve the list of locations, create a storage account, and manage your storage accounts as described in the article [Using Azure PowerShell with Azure Storage](storage-powershell-guide-full.md).

## Next steps

* [Persisting user logins across PowerShell sessions](/powershell/azure/context-persistence)
* [Azure Government storage](../../azure-government/documentation-government-services-storage.md)
* [Connect to Azure Government Cloud with PowerShell](../../azure-government/documentation-government-get-started-connect-with-ps.md)
* [Microsoft Azure Government Developer Guide](../../azure-government/documentation-government-developer-guide.md)
* [Developer Notes for Azure China Applications](https://msdn.microsoft.com/library/azure/dn578439.aspx)
* [Azure Germany Documentation](../../germany/germany-welcome.md)
