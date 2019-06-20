---
title: Configure Azure-SSIS Integration Runtime for SQL Database failover | Microsoft Docs
description: This article describes how to configure the Azure-SSIS Integration Runtime with Azure SQL Database geo-replication and failover for the SSISDB database
services: data-factory
documentationcenter: ''
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: 
ms.devlang: powershell
ms.topic: conceptual
ms.date: 08/14/2018
author: swinarko
ms.author: sawinark
ms.reviewer: douglasl
manager: craigg
---
# Configure the Azure-SSIS Integration Runtime with Azure SQL Database geo-replication and failover

This article describes how to configure the Azure-SSIS Integration Runtime with Azure SQL Database geo-replication for the SSISDB database. When a failover occurs, you can ensure that the Azure-SSIS IR keeps working with the secondary database.

For more info about geo-replication and failover for SQL Database, see [Overview: Active geo-replication and auto-failover groups](../sql-database/sql-database-geo-replication-overview.md).

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Scenario 1 - Azure-SSIS IR is pointing to read-write listener endpoint

### Conditions

This section applies when the following conditions are true:

- The Azure-SSIS IR is pointing to the read-write listener endpoint of the failover group.

  AND

- The SQL Database server is *not* configured with the virtual network service endpoint rule.

### Solution

When failover occurs, it is transparent to the Azure-SSIS IR. The Azure-SSIS IR automatically connects to the new primary of the failover group.

## Scenario 2 - Azure-SSIS IR is pointing to primary server endpoint

### Conditions

This section applies when one of the following conditions is true:

- The Azure-SSIS IR is pointing to the primary server endpoint of the failover group. This endpoint changes when failover occurs.

  OR

- The Azure SQL Database server is configured with the virtual network service endpoint rule.

  OR

- The database server is a SQL Database Managed Instance configured with a virtual network.

### Solution

When failover occurs, you have to do the following things:

1. Stop the Azure-SSIS IR.

2. Reconfigure the IR to point to the new primary endpoint and to a virtual network in the new region.

3. Restart the IR.

The following sections describe these steps in more detail.

### Prerequisites

- Make sure that you have enabled disaster recovery for your Azure SQL Database server in case the server has an outage at the same time. For more info, see [Overview of business continuity with Azure SQL Database](../sql-database/sql-database-business-continuity.md).

- If you are using a virtual network in the current region, you need to use another virtual network in the new region to connect your Azure-SSIS integration runtime. For more info, see [Join an Azure-SSIS integration runtime to a virtual network](join-azure-ssis-integration-runtime-virtual-network.md).

- If you are using a custom setup, you may need to prepare another SAS URI for the blob container that stores your custom setup script and associated files, so it continues to be accessible during an outage. For more info, see [Configure a custom setup on an Azure-SSIS integration runtime](how-to-configure-azure-ssis-ir-custom-setup.md).

### Steps

Follow these steps to stop your Azure-SSIS IR, switch the IR to a new region, and start it again.

1. Stop the IR in the original region.

2. Call the following command in PowerShell to update the IR with the new settings.

    ```powershell
    Set-AzDataFactoryV2IntegrationRuntime -Location "new region" `
                    -CatalogServerEndpoint "Azure SQL Database server endpoint" `
                    -CatalogAdminCredential "Azure SQL Database server admin credentials" `
                    -VNetId "new VNet" `
                    -Subnet "new subnet" `
                    -SetupScriptContainerSasUri "new custom setup SAS URI"
    ```

    For more info about this PowerShell command, see [Create the Azure-SSIS integration runtime in Azure Data Factory](create-azure-ssis-integration-runtime.md)

3. Start the IR again.

## Scenario 3 - Attaching an existing SSISDB (SSIS catalog) to a new Azure-SSIS IR

When an ADF or Azure-SSIS IR disaster occurs in current region, you can make your SSISDB keeps working with a new Azure-SSIS IR in a new region.

### Prerequisites

- If you are using a virtual network in the current region, you need to use another virtual network in the new region to connect your Azure-SSIS integration runtime. For more info, see [Join an Azure-SSIS integration runtime to a virtual network](join-azure-ssis-integration-runtime-virtual-network.md).

- If you are using a custom setup, you may need to prepare another SAS URI for the blob container that stores your custom setup script and associated files, so it continues to be accessible during an outage. For more info, see [Configure a custom setup on an Azure-SSIS integration runtime](how-to-configure-azure-ssis-ir-custom-setup.md).

### Steps

Follow these steps to stop your Azure-SSIS IR, switch the IR to a new region, and start it again.

1. Execute stored procedure to make SSISDB attached to **\<new_data_factory_name\>** or **\<new_integration_runtime_name\>**.
   
  ```SQL
    EXEC [catalog].[failover_integration_runtime] @data_factory_name='<new_data_factory_name>', @integration_runtime_name='<new_integration_runtime_name>'
   ```

2. Create a new data factory named **\<new_data_factory_name\>** in the new region. For more info, see Create a data factory.

     ```powershell
     Set-AzDataFactoryV2 -ResourceGroupName "new resource group name" `
                         -Location "new region"`
                         -Name "<new_data_factory_name>"
     ```
    For more info about this PowerShell command, see [Create an Azure data factory using PowerShell](quickstart-create-data-factory-powershell.md)

3. Create a new Azure-SSIS IR named **\<new_integration_runtime_name\>** in the new region using Azure PowerShell.

    ```powershell
    Set-AzDataFactoryV2IntegrationRuntime -ResourceGroupName "new resource group name" `
                                           -DataFactoryName "new data factory name" `
                                           -Name "<new_integration_runtime_name>" `
                                           -Description $AzureSSISDescription `
                                           -Type Managed `
                                           -Location $AzureSSISLocation `
                                           -NodeSize $AzureSSISNodeSize `
                                           -NodeCount $AzureSSISNodeNumber `
                                           -Edition $AzureSSISEdition `
                                           -LicenseType $AzureSSISLicenseType `
                                           -MaxParallelExecutionsPerNode $AzureSSISMaxParallelExecutionsPerNode `
                                           -VnetId "new vnet" `
                                           -Subnet "new subnet" `
                                           -CatalogServerEndpoint $SSISDBServerEndpoint `
                                           -CatalogPricingTier $SSISDBPricingTier
    ```

    For more info about this PowerShell command, see [Create the Azure-SSIS integration runtime in Azure Data Factory](create-azure-ssis-integration-runtime.md)

4. Start the IR again.

## Next steps

Consider these other configuration options for the Azure-SSIS IR:

- [Configure the Azure-SSIS Integration Runtime for high performance](configure-azure-ssis-integration-runtime-performance.md)

- [Customize setup for the Azure-SSIS integration runtime](how-to-configure-azure-ssis-ir-custom-setup.md)

- [Provision Enterprise Edition for the Azure-SSIS Integration Runtime](how-to-configure-azure-ssis-ir-enterprise-edition.md)
