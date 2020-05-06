---
title: Configure Azure-SSIS Integration Runtime for SQL Database failover
description: This article describes how to configure the Azure-SSIS Integration Runtime with Azure SQL Database geo-replication and failover for the SSISDB database
services: data-factory
ms.service: data-factory
ms.workload: data-services
ms.devlang: powershell
author: swinarko
ms.author: sawinark
manager: mflasko
ms.reviewer: douglasl
ms.topic: conceptual
ms.custom: seo-lt-2019
ms.date: 04/09/2020
---

# Configure the Azure-SSIS Integration Runtime with Azure SQL Database geo-replication and failover

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-xxx-md.md)]

This article describes how to configure the Azure-SSIS Integration Runtime with Azure SQL Database geo-replication for the SSISDB database. When a failover occurs, you can ensure that the Azure-SSIS IR keeps working with the secondary database.

For more info about geo-replication and failover for SQL Database, see [Overview: Active geo-replication and auto-failover groups](../sql-database/sql-database-geo-replication-overview.md).

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Azure-SSIS IR failover with Azure SQL Database Managed Instance

### Prerequisites

Azure SQL Database Managed Instance uses **database master key (DMK)** to help secure data, credentials, and connection information that is stored in database. To enable the automatic decryption of DMK, a copy of the key is encrypted by using the **server master key (SMK)**. But SMK is not replicated in failover group, so you need to add an additional password on both primary and secondary instances for DMK decryption after failover.

1. Execute below command on the SSISDB on primary instance. This step is adding a new encryption password.

    ```sql
    ALTER MASTER KEY ADD ENCRYPTION BY PASSWORD = 'password'
    ```

2. Create failover group on Azure SQL Database Managed Instance.

3. Run **sp_control_dbmasterkey_password** on the secondary instance, using the new encryption password.

    ```sql
    EXEC sp_control_dbmasterkey_password @db_name = N'SSISDB',   
        @password = N'<password>', @action = N'add';  
    GO
    ```

### Scenario 1 - Azure-SSIS IR is pointing to read-write listener endpoint

If you want Azure-SSIS IR point to read-write listener endpoint, you need to point to primary server endpoint first. After putting SSISDB to failover group, you can change to read-write listener endpoint and restart Azure-SSIS IR.

#### Solution

When failover occurs, you have to do the following things:

1. Stop Azure-SSIS IR on primary region.

2. Edit Azure-SSIS IR with new region, VNET and custom setup SAS URI information of secondary instance. As Azure-SSIS IR is pointing to read-write listener and the endpoint is transparent to Azure-SSIS IR, you don't need to edit the endpoint.

    ```powershell
    Set-AzDataFactoryV2IntegrationRuntime -Location "new region" `
                -VNetId "new VNet" `
                -Subnet "new subnet" `
                -SetupScriptContainerSasUri "new custom setup SAS URI"
    ```

3. Restart Azure-SSIS IR.

### Scenario 2 - Azure-SSIS IR is pointing to primary server endpoint

The scenario is suitable if Azure-SSIS IR is pointing to primary server endpoint.

#### Solution

When failover occurs, you have to do the following things:

1. Stop Azure-SSIS IR on primary region.

2. Edit Azure-SSIS IR with new region, endpoint and VNET information of secondary instance.

    ```powershell
    Set-AzDataFactoryV2IntegrationRuntime -Location "new region" `
                -CatalogServerEndpoint "Azure SQL Database server endpoint" `
                -CatalogAdminCredential "Azure SQL Database server admin credentials" `
                -VNetId "new VNet" `
                -Subnet "new subnet" `
                -SetupScriptContainerSasUri "new custom setup SAS URI"
    ```

3. Restart Azure-SSIS IR.

### Scenario 3 - Azure-SSIS IR is pointing to public endpoint of Azure SQL Database Managed Instance

The scenario is suitable if the Azure-SSIS IR is pointing to public endpoint of Azure SQL Database Managed Instance and it doesn't join to VNET. The only difference between scenario 2 and this scenarios is that you don't need to edit VNET information of Azure-SSIS IR after failover.

#### Solution

When failover occurs, you have to do the following things:

1. Stop Azure-SSIS IR on primary region.

2. Edit Azure-SSIS IR with new region and endpoint information of secondary instance.

    ```powershell
    Set-AzDataFactoryV2IntegrationRuntime -Location "new region" `
                -CatalogServerEndpoint "Azure SQL Database server endpoint" `
                -CatalogAdminCredential "Azure SQL Database server admin credentials" `
                -SetupScriptContainerSasUri "new custom setup SAS URI"
    ```

3. Restart Azure-SSIS IR.

### Scenario 4 - Attaching an existing SSISDB (SSIS catalog) to a new Azure-SSIS IR

This scenario is suitable if you want to provision a new Azure-SSIS IR on secondary region or you want your SSISDB to keep working with a new Azure-SSIS IR in a new region when an ADF or Azure-SSIS IR disaster occurs in current region.

#### Solution

When failover occurs, you have to do the following things:

> [!NOTE]
> Step 4 (creation of IR) needs to be done via PowerShell. Azure portal will report an error stating that SSISDB already exists.

1. Stop Azure-SSIS IR on primary region.

2. Execute stored procedure to update metadata in SSISDB to accept connections from **\<new_data_factory_name\>** and **\<new_integration_runtime_name\>**.
   
    ```sql
    EXEC [catalog].[failover_integration_runtime] @data_factory_name='<new_data_factory_name>', @integration_runtime_name='<new_integration_runtime_name>'
    ```

3. Create a new data factory named **\<new_data_factory_name\>** in the new region. For more info, see Create a data factory.

    ```powershell
    Set-AzDataFactoryV2 -ResourceGroupName "new resource group name" `
                      -Location "new region"`
                      -Name "<new_data_factory_name>"
    ```
    
    For more info about this PowerShell command, see [Create an Azure data factory using PowerShell](quickstart-create-data-factory-powershell.md)

4. Create a new Azure-SSIS IR named **\<new_integration_runtime_name\>** in the new region using Azure PowerShell.

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



## Azure-SSIS IR failover with Azure SQL Database

### Scenario 1 - Azure-SSIS IR is pointing to read-write listener endpoint

This scenario is suitable Azure-SSIS IR is pointing to the read-write listener endpoint of the failover group and the SQL Database server is *not* configured with the virtual network service endpoint rule. 
If you want Azure-SSIS IR point to read-write listener endpoint, you need to point to primary server endpoint first. After putting SSISDB to failover group, you can change to read-write listener endpoint and restart Azure-SSIS IR.

#### Solution

When failover occurs, it is transparent to the Azure-SSIS IR. The Azure-SSIS IR automatically connects to the new primary of the failover group. 
If you want to update the region or other information in Azure-SSIS IR, you can stop it, edit and restart.


### Scenario 2 - Azure-SSIS IR is pointing to primary server endpoint

The scenario is suitable if Azure-SSIS IR is pointing to primary server endpoint.

#### Solution

When failover occurs, you have to do the following things:

1. Stop Azure-SSIS IR on primary region.

2. Edit Azure-SSIS IR with new region, endpoint, and VNET information of secondary instance.

    ```powershell
    Set-AzDataFactoryV2IntegrationRuntime -Location "new region" `
                    -CatalogServerEndpoint "Azure SQL Database server endpoint" `
                    -CatalogAdminCredential "Azure SQL Database server admin credentials" `
                    -VNetId "new VNet" `
                    -Subnet "new subnet" `
                    -SetupScriptContainerSasUri "new custom setup SAS URI"
    ```

3. Restart Azure-SSIS IR.

### Scenario 3 - Attaching an existing SSISDB (SSIS catalog) to a new Azure-SSIS IR

This scenario is suitable if you want to provision a new Azure-SSIS IR on secondary region or you want your SSISDB to keep working with a new Azure-SSIS IR in a new region when an ADF or Azure-SSIS IR disaster occurs in current region.

#### Solution

> [!NOTE]
> Step 4 (creation of IR) needs to be done via PowerShell. Azure portal will report an error stating that SSISDB already exists.

1. Stop Azure-SSIS IR on primary region.

2. Execute stored procedure to update metadata in SSISDB to accept connections from **\<new_data_factory_name\>** and **\<new_integration_runtime_name\>**.
   
    ```sql
    EXEC [catalog].[failover_integration_runtime] @data_factory_name='<new_data_factory_name>', @integration_runtime_name='<new_integration_runtime_name>'
    ```

3. Create a new data factory named **\<new_data_factory_name\>** in the new region. For more info, see Create a data factory.

    ```powershell
    Set-AzDataFactoryV2 -ResourceGroupName "new resource group name" `
                         -Location "new region"`
                         -Name "<new_data_factory_name>"
    ```
    
    For more info about this PowerShell command, see [Create an Azure data factory using PowerShell](quickstart-create-data-factory-powershell.md)

4. Create a new Azure-SSIS IR named **\<new_integration_runtime_name\>** in the new region using Azure PowerShell.

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


## Next steps

Consider these other configuration options for the Azure-SSIS IR:

- [Configure the Azure-SSIS Integration Runtime for high performance](configure-azure-ssis-integration-runtime-performance.md)

- [Customize setup for the Azure-SSIS integration runtime](how-to-configure-azure-ssis-ir-custom-setup.md)

- [Provision Enterprise Edition for the Azure-SSIS Integration Runtime](how-to-configure-azure-ssis-ir-enterprise-edition.md)
