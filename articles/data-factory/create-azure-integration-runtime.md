---
title: Create Azure integration runtime in Azure Data Factory | Microsoft Docs
description: Learn how to create Azure integration runtime in Azure Data Factory, which is used to copy data and dispatch transform activities. 
services: data-factory
documentationcenter: ''
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 01/15/2018
author: nabhishek
ms.author: abnarain
manager: craigg
---
# How to create and configure Azure Integration Runtime
The Integration Runtime (IR) is the compute infrastructure used by Azure Data Factory to provide data integration capabilities across different network environments. For more information about IR, see [Integration runtime](concepts-integration-runtime.md).

Azure IR provides a fully managed compute to natively perform data movement and dispatch data transformation activities to compute services like HDInsight. It is hosted in Azure environment and supports connecting to resources in public network environment with public accessible endpoints.

This document introduces how you can create and configure Azure Integration Runtime. 

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Default Azure IR
By default, each data factory has an Azure IR in the backend that supports  operations on cloud data stores and compute services in public network. The location of that Azure IR is auto-resolve. If **connectVia** property is not specified in the linked service definition, the default Azure IR is used. You only need to explicitly create an Azure IR when you would like to explicitly define the location of the IR, or if you would like to virtually group the activity executions on different IRs for management purpose. 

## Create Azure IR
Integration Runtime can be created using the **Set-AzDataFactoryV2IntegrationRuntime** PowerShell cmdlet. To create an Azure IR, you specify the name, location and type to the command. Here is a sample command to create an Azure IR with location set to "West Europe":

```powershell
Set-AzDataFactoryV2IntegrationRuntime -DataFactoryName "SampleV2DataFactory1" -Name "MySampleAzureIR" -ResourceGroupName "ADFV2SampleRG" -Type Managed -Location "West Europe"
```  
For Azure IR, the type must be set to **Managed**. You do not need to specify compute details because it is fully managed elastically in cloud. Specify compute details like node size and node count when you would like to create Azure-SSIS IR. For more information, see [Create and Configure Azure-SSIS IR](create-azure-ssis-integration-runtime.md).

You can configure an existing Azure IR to change its location using the Set-AzDataFactoryV2IntegrationRuntime PowerShell cmdlet. For more information about the location of an Azure IR, see [Introduction to integration runtime](concepts-integration-runtime.md).

## Use Azure IR

Once an Azure IR is created, you can reference it in your Linked Service definition. Below is a sample of how you can reference the Azure Integration Runtime created above from an Azure Storage Linked Service:  

```json
{
    "name": "MyStorageLinkedService",
    "properties": {
      "type": "AzureStorage",
      "typeProperties": {
        "connectionString": {
          "value": "DefaultEndpointsProtocol=https;AccountName=myaccountname;AccountKey=...",
          "type": "SecureString"
        }
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
 
