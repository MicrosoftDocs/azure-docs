---
title: Reconfigure the Azure-SSIS integration runtime 
description: Learn how to reconfigure an Azure-SSIS integration runtime in Azure Data Factory after you have already provisioned it.
ms.service: data-factory
ms.subservice: integration-services
ms.custom: devx-track-azurepowershell
ms.topic: conceptual
ms.date: 07/20/2023
author: chugugrace
ms.author: chugu
---

# Reconfigure the Azure-SSIS integration runtime

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article describes how to reconfigure an existing Azure-SSIS integration runtime. To create an Azure-SSIS integration runtime (IR), see [Create an Azure-SSIS integration runtime](create-azure-ssis-integration-runtime.md).  

## Azure portal

# [Azure Data Factory](#tab/data-factory)
You can use Data Factory UI to stop, edit/reconfigure, or delete an Azure-SSIS IR. 

1. Open Data Factory UI by selecting the **Author & Monitor** tile on the home page of your data factory.
2. Select the **Manage** hub below **Home**, **Edit**, and **Monitor** hubs to show the **Connections** pane.

### To reconfigure an Azure-SSIS IR
On **Manage** hub, switch to the **Integration runtimes** page and select **Refresh**. 

   :::image type="content" source="./media/tutorial-create-azure-ssis-runtime-portal/connections-pane.png" alt-text="Connections pane":::

   You can edit/reconfigure your Azure-SSIS IR by selecting its name. You can also select the relevant buttons to monitor/start/stop/delete your Azure-SSIS IR, auto-generate an ADF pipeline with Execute SSIS Package activity to run on your Azure-SSIS IR, and view the JSON code/payload of your Azure-SSIS IR.  Editing/deleting your Azure-SSIS IR can only be done when it's stopped.

# [Synapse Analytics](#tab/synapse-analytics)
You can use Synapse workspace to stop, edit/reconfigure, or delete an Azure-SSIS IR.

### To reconfigure an Azure-SSIS IR
On **Manage** hub, switch to the **Integration runtimes** page. 

   :::image type="content" source="./media/tutorial-create-azure-ssis-runtime-portal/connections-pane-synapse.png" lightbox="./media/tutorial-create-azure-ssis-runtime-portal/connections-pane-synapse.png" alt-text="Screenshot of connections pane in Synapse.":::

   You can edit/reconfigure your Azure-SSIS IR by selecting its name. You can also select the relevant buttons to monitor/start/stop/delete your Azure-SSIS IR, auto-generate an ADF pipeline with Execute SSIS Package activity to run on your Azure-SSIS IR, and view the JSON code/payload of your Azure-SSIS IR.  Editing/deleting your Azure-SSIS IR can only be done when it's stopped.

---

## Azure PowerShell

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

After you provision and start an instance of Azure-SSIS integration runtime, you can reconfigure it by running a sequence of `Stop` - `Set` - `Start` PowerShell cmdlets consecutively. For example, the following PowerShell script changes the number of nodes allocated for the Azure-SSIS integration runtime instance to five.

> [!NOTE]
> For Azure-SSIS IR in Azure Synapse Analytics, replace with corresponding Azure Synapse Analytics PowerShell interfaces:  [Get-AzSynapseIntegrationRuntime](/powershell/module/az.synapse/get-azsynapseintegrationruntime), [Set-AzSynapseIntegrationRuntime (Az.Synapse)](/powershell/module/az.synapse/set-azsynapseintegrationruntime), [Remove-AzSynapseIntegrationRuntime](/powershell/module/az.synapse/remove-azsynapseintegrationruntime), [Start-AzSynapseIntegrationRuntime](/powershell/module/az.synapse/start-azsynapseintegrationruntime) and [Stop-AzSynapseIntegrationRuntime](/powershell/module/az.synapse/stop-azsynapseintegrationruntime).

### Reconfigure an Azure-SSIS IR

1. First, stop the Azure-SSIS integration runtime by using the [Stop-AzDataFactoryV2IntegrationRuntime](/powershell/module/az.datafactory/stop-Azdatafactoryv2integrationruntime) cmdlet. This command releases all of its nodes and stops billing.

   ```powershell
   Stop-AzDataFactoryV2IntegrationRuntime -DataFactoryName $DataFactoryName -Name $AzureSSISName -ResourceGroupName $ResourceGroupName 
   ```
2. Next, reconfigure the Azure-SSIS IR by using the [Set-AzDataFactoryV2IntegrationRuntime](/powershell/module/az.datafactory/set-Azdatafactoryv2integrationruntime) cmdlet. The following sample command scales out an Azure-SSIS integration runtime to five nodes.

   ```powershell
   Set-AzDataFactoryV2IntegrationRuntime -DataFactoryName $DataFactoryName -Name $AzureSSISName -ResourceGroupName $ResourceGroupName -NodeCount 5
   ```  
3. Then, start the Azure-SSIS integration runtime by using the [Start-AzDataFactoryV2IntegrationRuntime](/powershell/module/az.datafactory/start-Azdatafactoryv2integrationruntime) cmdlet. This command allocates all of its nodes for running SSIS packages.   

   ```powershell
   Start-AzDataFactoryV2IntegrationRuntime -DataFactoryName $DataFactoryName -Name $AzureSSISName -ResourceGroupName $ResourceGroupName
   ```

### Delete an Azure-SSIS IR
1. First, list all existing Azure SSIS IRs under your data factory.

   ```powershell
   Get-AzDataFactoryV2IntegrationRuntime -DataFactoryName $DataFactoryName -ResourceGroupName $ResourceGroupName -Status
   ```
2. Next, stop all existing Azure SSIS IRs in your data factory.

   ```powershell
   Stop-AzDataFactoryV2IntegrationRuntime -DataFactoryName $DataFactoryName -Name $AzureSSISName -ResourceGroupName $ResourceGroupName -Force
   ```
3. Next, remove all existing Azure SSIS IRs in your data factory one by one.

   ```powershell
   Remove-AzDataFactoryV2IntegrationRuntime -DataFactoryName $DataFactoryName -Name $AzureSSISName -ResourceGroupName $ResourceGroupName -Force
   ```
4. Finally, remove your data factory.

   ```powershell
   Remove-AzDataFactoryV2 -Name $DataFactoryName -ResourceGroupName $ResourceGroupName -Force
   ```
5. If you had created a new resource group, remove the resource group.

   ```powershell
   Remove-AzResourceGroup -Name $ResourceGroupName -Force 
   ```

## Next steps
For more information about Azure-SSIS runtime, see the following topics: 

- [Azure-SSIS Integration Runtime](concepts-integration-runtime.md#azure-ssis-integration-runtime). This article provides conceptual information about integration runtimes in general including the Azure-SSIS IR. 
- [Tutorial: deploy SSIS packages to Azure](./tutorial-deploy-ssis-packages-azure.md). This article provides step-by-step instructions to create an Azure-SSIS IR and uses Azure SQL Database to host the SSIS catalog. 
- [How to: Create an Azure-SSIS integration runtime](create-azure-ssis-integration-runtime.md). This article expands on the tutorial and provides instructions on using Azure SQL Managed Instance and joining the IR to a virtual network. 
- [Join an Azure-SSIS IR to a virtual network](join-azure-ssis-integration-runtime-virtual-network.md). This article provides conceptual information about joining an Azure-SSIS IR to an Azure virtual network. It also provides steps to use Azure portal to configure virtual network so that Azure-SSIS IR can join the virtual network. 
- [Monitor an Azure-SSIS IR](monitor-integration-runtime.md#azure-ssis-integration-runtime). This article shows you how to retrieve information about an Azure-SSIS IR and descriptions of statuses in the returned information.
