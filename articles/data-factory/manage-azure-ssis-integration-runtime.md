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
The [Create an Azure-SSIS integration runtime](create-azure-ssis-integration-runtime.md) article shows you how to create an Azure-SSIS integration runtime by using Azure Data Factory. This article complements it by providing information on how to stop, start, reconfigure, or remove an Azure-SSIS integration runtime.  

> [!NOTE]
> This article applies to version 2 of Data Factory, which is currently in preview. If you are using version 1 of the Data Factory service, which is generally available (GA), see [Data Factory version 1 documentation](v1/data-factory-introduction.md).

## Stop 
Stop the Azure-SSIS integration runtime. This command releases all of its nodes and stops billing.

```powershell
Stop-AzureRmDataFactoryV2IntegrationRuntime -DataFactoryName $DataFactoryName -Name $AzureSSISName -ResourceGroupName $ResourceGroupName 
```

## Start 
Start the Azure-SSIS integration runtime. This command allocates all of its nodes and starts billing.   

```powershell
Start-AzureRmDataFactoryV2IntegrationRuntime -DataFactoryName $DataFactoryName -Name $AzureSSISName -ResourceGroupName $ResourceGroupName
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

## Remove
To remove an existing Azure-SSIS integration runtime, run the following command: 

```powershell
Remove-AzureRmDataFactoryV2IntegrationRuntime -DataFactoryName $DataFactoryName -Name $AzureSSISName -ResourceGroupName $ResourceGroupName -Force
```

## Next steps
For more information about Azure-SSIS runtime, see the following topics: 

- [Azure-SSIS Integration Runtime](concepts-integration-runtime.md#azure-ssis-integration-runtime). This article provides conceptual information about integration runtimes in general including the Azure-SSIS IR. 
- [Tutorial: deploy SSIS packages to Azure](tutorial-deploy-ssis-packages-azure.md). This article provides step-by-step instructions to create an Azure-SSIS IR and uses an Azure SQL database to host the SSIS catalog. 
- [How to: Create an Azure-SSIS integration runtime](create-azure-ssis-integration-runtime.md). This article expands on the tutorial and provides instructions on using Azure SQL Managed Instance (private preview) and joining the IR to a VNet. 
- [Monitor an Azure-SSIS IR](monitor-integration-runtime.md#azure-ssis-integration-runtime). This article shows you how to retrieve information about an Azure-SSIS IR and descriptions of statuses in the returned information. 
- [Join an Azure-SSIS IR to a VNet](join-azure-ssis-integration-runtime-virtual-network.md). This article provides conceptual information about joining an Azure-SSIS IR to an Azure virtual network (VNet). It also provides steps to use Azure portal to configure VNet so that Azure-SSIS IR can join the VNet. 
