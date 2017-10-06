---
title: Manage Azure-SSIS integration runtime | Microsoft Docs
description: Learn how to reconfigure Azure-SSIS integration runtime in Azure Data Factory after you have already provisioned it.
services: data-factory
documentationcenter: ''
author: spelluru
manager: jhubbard
editor: monicar

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/25/2017
ms.author: spelluru

---

# Manage an Azure-SSIS integration runtime
This article provides information on how to stop, start, and reconfigure Azure-SSIS integration runtime.  


## Stop 
Stop the Azure-SSIS integration runtime. This command releases all of its nodes and stops billing.

```powershell
#Stop-AzureRmDataFactoryV2IntegrationRuntime -DataFactoryName $DataFactoryName -Name $AzureSSISName -ResourceGroupName $ResourceGroupName 
```

## Start 
Start the Azure-SSIS integration runtime. This command allocates all of its nodes and starts billing.   

```powershell
#Start-AzureRmDataFactoryV2IntegrationRuntime -DataFactoryName $DataFactoryName -Name $AzureSSISName -ResourceGroupName $ResourceGroupName
```

## Reconfigure
After you provision and start an instance of Azure-SSIS integration runtime, you can reconfigure it by running a sequence of `Stop` - `Set` - `Start` PowerShell cmdlets consecutively. For example, the following PowerShell script changes the number of nodes allocated for the Azure-SSIS integration runtime instance to 5.

1. First, stop the Azure-SSIS integration runtime by running the following command:

	```powershell
	Stop-AzureRmDataFactoryV2IntegrationRuntime -DataFactoryName $DataFactoryName -Name $AzureSSISName -ResourceGroupName $ResourceGroupName 
	```
2. Now, scale out your Azure-SSIS integration runtime to five nodes.

	```powershell
	Set-AzureRmDataFactoryV2IntegrationRuntime -DataFactoryName $DataFactoryName -Name $AzureSSISName -ResourceGroupName $ResourceGroupName -NodeCount 5
	```  
3. Then, start the Azure-SSIS integration runtime. This allocates all of its nodes for running SSIS packages.   

	```powershell
	Start-AzureRmDataFactoryV2IntegrationRuntime -DataFactoryName $DataFactoryName -Name $AzureSSISName -ResourceGroupName $ResourceGroupName
	```
## Next steps
For more information about Azure-SSIS runtime, see the following topics: 

- [Azure-SSIS Integration Runtime](concepts-integration-runtime.md#azure-ssis-integration-runtime)
- [Join Azure-SSIS Integration Runtime to VNET](join-azure-ssis-integration-runtime-virtual-network.md)
- [Provision an Azure-SSIS integration runtime](tutorial-deploy-ssis-packages-azure.md).