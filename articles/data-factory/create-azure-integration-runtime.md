---
title: Create Azure integration runtime
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to create Azure integration runtime in Azure Data Factory and Azure Synapse Analytics, which is used to copy data and dispatch transform activities. 
ms.service: data-factory
ms.subservice: integration-runtime
ms.topic: conceptual
ms.date: 10/20/2023
author: lrtoyou1223
ms.author: lle 
ms.custom: synapse
---

# How to create and configure Azure Integration Runtime
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

The Integration Runtime (IR) is the compute infrastructure used by Azure Data Factory and Synapse pipelines to provide data integration capabilities across different network environments. For more information about IR, see [Integration runtime](concepts-integration-runtime.md).

Azure IR provides a fully managed compute to natively perform data movement and dispatch data transformation activities to compute services like HDInsight. It's hosted in Azure environment and supports connecting to resources in public network environment with public accessible endpoints.

This document introduces how you can create and configure Azure Integration Runtime. 

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Default Azure IR
By default, each data factory or Synapse workspace has an Azure IR in the backend that supports  operations on cloud data stores and compute services in public network. The location of that Azure IR is autoresolve. If **connectVia** property isn't specified in the linked service definition, the default Azure IR is used. You only need to explicitly create an Azure IR when you would like to explicitly define the location of the IR, or if you would like to virtually group the activity executions on different IRs for management purpose. 

## Create Azure IR

To create and set up an Azure IR, you can use the following procedures.

### Create an Azure IR via Azure PowerShell
Integration Runtime can be created using the **Set-AzDataFactoryV2IntegrationRuntime** PowerShell cmdlet. To create an Azure IR, you specify the name, location, and type to the command. Here's a sample command to create an Azure IR with location set to "West Europe":

```powershell
Set-AzDataFactoryV2IntegrationRuntime -DataFactoryName "SampleV2DataFactory1" -Name "MySampleAzureIR" -ResourceGroupName "ADFV2SampleRG" -Type Managed -Location "West Europe"
```
For Azure IR, the type must be set to **Managed**. You don't need to specify compute details because it's fully managed elastically in cloud. Specify compute details like node size and node count when you would like to create Azure-SSIS IR. For more information, see [Create and Configure Azure-SSIS IR](create-azure-ssis-integration-runtime.md).

You can configure an existing Azure IR to change its location using the Set-AzDataFactoryV2IntegrationRuntime PowerShell cmdlet. For more information about the location of an Azure IR, see [Introduction to integration runtime](concepts-integration-runtime.md).

### Create an Azure IR via UI
Use the following steps to create an Azure IR using UI.

1. On the home page for the service, select the [Manage tab](./author-management-hub.md) from the leftmost pane.

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/create-azure-integration-runtime/get-started-page-manage-button.png" alt-text="Screenshot showing the home page Manage button.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/get-started-page-manage-button-synapse.png" alt-text="Screenshot showing the home page Manage button.":::

    ---
       
1. Select **Integration runtimes** on the left pane, and then select **+New**.

    # [Azure Data Factory](#tab/data-factory)
    
    :::image type="content" source="media/create-azure-integration-runtime/manage-new-integration-runtime.png" alt-text="Screenshot that highlights integration runtimes in the left pane and the +New button.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/manage-new-integration-runtime-synapse.png" alt-text="Screenshot that highlights integration runtimes in the left pane and the +New button.":::
    
    ---

1. On the **Integration runtime setup** page, select **Azure, Self-Hosted**, and then select **Continue**.
   :::image type="content" source="media/create-azure-integration-runtime/integration-runtime-setup.png" alt-text="Screenshot showing the Azure self-hosted integration runtime option."::: 
1. On the following page, select **Azure** to create an Azure IR, and then select **Continue**.
   :::image type="content" source="media/create-azure-integration-runtime/new-azure-integration-runtime.png" alt-text="Screenshot that shows create an Azure integration runtime.":::
1. Enter a name for your Azure IR, and select **Create**.
   :::image type="content" source="media/create-azure-integration-runtime/create-azure-integration-runtime.png" alt-text="Screenshot that shows the final step to create the Azure integration runtime.":::
1. You see a pop-up notification when the creation completes. On the **Integration runtimes** page, make sure that you see the newly created IR in the list.
   :::image type="content" source="media/create-azure-integration-runtime/integration-runtime-in-the-list.png" alt-text="Screenshot showing the Azure integration runtime in the list.":::
1. You can repair Azure integration runtime by clicking **repair** button if the status is shown as **Limited**.
:::image type="content" source="media/create-azure-integration-runtime/repair-azure-integration-runtime.png" alt-text="Screenshot showing the Azure integration runtime repair.":::

> [!NOTE]
> If you want to enable managed virtual network on Azure IR, please see [How to enable managed virtual network](managed-virtual-network-private-endpoint.md)

## Use Azure IR

Once an Azure IR is created, you can reference it in your Linked Service definition. Below is a sample of how you can reference the Azure Integration Runtime created above from an Azure Storage Linked Service:

```json
{
    "name": "MyStorageLinkedService",
    "properties": {
      "type": "AzureStorage",
      "typeProperties": {
        "connectionString": "DefaultEndpointsProtocol=https;AccountName=myaccountname;AccountKey=..."
      },
      "connectVia": {
        "referenceName": "MySampleAzureIR",
        "type": "IntegrationRuntimeReference"
      }   
    }
}

```

## Next steps
See the following articles on how to create other types of integration runtimes:

- [Create self-hosted integration runtime](create-self-hosted-integration-runtime.md)
- [Create Azure-SSIS integration runtime](create-azure-ssis-integration-runtime.md)
