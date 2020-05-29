---
title: Configure Azure-SSIS integration runtime for SQL Database failover
description: This article describes how to configure the Azure-SSIS integration runtime with Azure SQL Database geo-replication and failover for the SSISDB database
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

# Configure the Azure-SSIS integration runtime with SQL Database geo-replication and failover

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-xxx-md.md)]

This article describes how to configure the Azure-SSIS integration runtime (IR) with Azure SQL Database geo-replication for the SSISDB database. When a failover occurs, you can ensure that the Azure-SSIS IR keeps working with the secondary database.

For more info about geo-replication and failover for SQL Database, see [Overview: Active geo-replication and auto-failover groups](../sql-database/sql-database-geo-replication-overview.md).

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Azure-SSIS IR failover with a SQL Managed Instance

### Prerequisites

An Azure SQL Managed Instance uses a *database master key (DMK)* to help secure data, credentials, and connection information that's stored in a database. To enable the automatic decryption of DMK, a copy of the key is encrypted through the *server master key (SMK)*. 

The SMK is not replicated in a failover group. You need to add a password on both the primary and secondary instances for DMK decryption after failover.

1. Run the following command for SSISDB on the primary instance. This step adds a new encryption password.

    ```sql
    ALTER MASTER KEY ADD ENCRYPTION BY PASSWORD = 'password'
    ```

2. Create a failover group on an SQL Managed Instance.

3. Run **sp_control_dbmasterkey_password** on the secondary instance, by using the new encryption password.

    ```sql
    EXEC sp_control_dbmasterkey_password @db_name = N'SSISDB',   
        @password = N'<password>', @action = N'add';  
    GO
    ```

### Scenario 1: Azure-SSIS IR is pointing to a read/write listener endpoint

If you want the Azure-SSIS IR to point to a read/write listener endpoint, you need to point to the primary server endpoint first. After you put SSISDB in a failover group, you can change to the read/write listener endpoint and restart the Azure-SSIS IR.

#### Solution

When failover occurs, take the following steps:

1. Stop the Azure-SSIS IR in the primary region.

2. Edit the Azure-SSIS IR with new region, virtual network, and shared access signature (SAS) URI information for custom setup on the secondary instance. Because the Azure-SSIS IR is pointing to a read/write listener and the endpoint is transparent to the Azure-SSIS IR, you don't need to edit the endpoint.

    ```powershell
    Set-AzDataFactoryV2IntegrationRuntime -Location "new region" `
                -VNetId "new VNet" `
                -Subnet "new subnet" `
                -SetupScriptContainerSasUri "new custom setup SAS URI"
    ```

3. Restart the Azure-SSIS IR.

### Scenario 2: Azure-SSIS IR is pointing to a primary server endpoint

This scenario is suitable if the Azure-SSIS IR is pointing to a primary server endpoint.

#### Solution

When failover occurs, take the following steps:

1. Stop the Azure-SSIS IR in the primary region.

2. Edit the Azure-SSIS IR with new region, endpoint, and virtual network information for the secondary instance.

    ```powershell
      Set-AzDataFactoryV2IntegrationRuntime -Location "new region" `
                    -CatalogServerEndpoint "Azure SQL Database endpoint" `
                    -CatalogAdminCredential "Azure SQL Database admin credentials" `
                    -VNetId "new VNet" `
                    -Subnet "new subnet" `
                    -SetupScriptContainerSasUri "new custom setup SAS URI"
        ```

3. Restart the Azure-SSIS IR.

### Scenario 3: Azure-SSIS IR is pointing to a public endpoint of a SQL Managed Instance

This scenario is suitable if the Azure-SSIS IR is pointing to a public endpoint of a Azure SQL Managed Instance and it doesn't join to a virtual network. The only difference from scenario 2 is that you don't need to edit virtual network information for the Azure-SSIS IR after failover.

#### Solution

When failover occurs, take the following steps:

1. Stop the Azure-SSIS IR in the primary region.

2. Edit the Azure-SSIS IR with the new region and endpoint information for the secondary instance.

    ```powershell
    Set-AzDataFactoryV2IntegrationRuntime -Location "new region" `
                -CatalogServerEndpoint "Azure SQL Database server endpoint" `
                -CatalogAdminCredential "Azure SQL Database server admin credentials" `
                -SetupScriptContainerSasUri "new custom setup SAS URI"
    ```

3. Restart the Azure-SSIS IR.

### Scenario 4: Attach an existing SSISDB instance (SSIS catalog) to a new Azure-SSIS IR

This scenario is suitable if you want SSISDB to work with a new Azure-SSIS IR in a new region when an Azure Data Factory or Azure-SSIS IR disaster occurs in the current region.

#### Solution

When failover occurs, take the following steps.

> [!NOTE]
> Use PowerShell for step 4 (creation of the IR). If you don't, the Azure portal will report an error that says SSISDB already exists.

1. Stop the Azure-SSIS IR in the primary region.

2. Run a stored procedure to update metadata in SSISDB to accept connections from **\<new_data_factory_name\>** and **\<new_integration_runtime_name\>**.
   
    ```sql
    EXEC [catalog].[failover_integration_runtime] @data_factory_name='<new_data_factory_name>', @integration_runtime_name='<new_integration_runtime_name>'
    ```

3. Create a new data factory named **\<new_data_factory_name\>** in the new region.

    ```powershell
    Set-AzDataFactoryV2 -ResourceGroupName "new resource group name" `
                      -Location "new region"`
                      -Name "<new_data_factory_name>"
    ```
    
    For more info about this PowerShell command, see [Create an Azure data factory using PowerShell](quickstart-create-data-factory-powershell.md).

4. Create a new Azure-SSIS IR named **\<new_integration_runtime_name\>** in the new region by using Azure PowerShell.

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

    For more info about this PowerShell command, see [Create the Azure-SSIS integration runtime in Azure Data Factory](create-azure-ssis-integration-runtime.md).



## Azure-SSIS IR failover with SQL Database

### Scenario 1: Azure-SSIS IR is pointing to a read/write listener endpoint

This scenario is suitable when:

- The Azure-SSIS IR is pointing to the read/write listener endpoint of the failover group.
- The SQL Database server is *not* configured with the rule for the virtual network service endpoint.

If you want the Azure-SSIS IR to point to a read/write listener endpoint, you need to point to the primary server endpoint first. After you put SSISDB in a failover group, you can change to a read/write listener endpoint and restart the Azure-SSIS IR.

#### Solution

When failover occurs, it's transparent to the Azure-SSIS IR. The Azure-SSIS IR automatically connects to the new primary of the failover group. 

If you want to update the region or other information in the Azure-SSIS IR, you can stop it, edit, and restart.


### Scenario 2: Azure-SSIS IR is pointing to a primary server endpoint

This scenario is suitable if the Azure-SSIS IR is pointing to a primary server endpoint.

#### Solution

When failover occurs, take the following steps:

1. Stop the Azure-SSIS IR in the primary region.

2. Edit the Azure-SSIS IR with new region, endpoint, and virtual network information for the secondary instance.

    ```powershell
      Set-AzDataFactoryV2IntegrationRuntime -Location "new region" `
                        -CatalogServerEndpoint "Azure SQL Database endpoint" `
                        -CatalogAdminCredential "Azure SQL Database admin credentials" `
                        -VNetId "new VNet" `
                        -Subnet "new subnet" `
                        -SetupScriptContainerSasUri "new custom setup SAS URI"
    ```

3. Restart the Azure-SSIS IR.

### Scenario 3: Attach an existing SSISDB (SSIS catalog) to a new Azure-SSIS IR

This scenario is suitable if you want to provision a new Azure-SSIS IR in a secondary region. It's also suitable if you want your SSISDB to keep working with a new Azure-SSIS IR in a new region when an Azure Data Factory or Azure-SSIS IR disaster occurs in the current region.

#### Solution

When failover occurs, take the following steps.

> [!NOTE]
> Use PowerShell for step 4 (creation of the IR). If you don't, the Azure portal will report an error that says SSISDB already exists.

1. Stop the Azure-SSIS IR in the primary region.

2. Run a stored procedure to update metadata in SSISDB to accept connections from **\<new_data_factory_name\>** and **\<new_integration_runtime_name\>**.
   
    ```sql
    EXEC [catalog].[failover_integration_runtime] @data_factory_name='<new_data_factory_name>', @integration_runtime_name='<new_integration_runtime_name>'
    ```

3. Create a new data factory named **\<new_data_factory_name\>** in the new region.

    ```powershell
    Set-AzDataFactoryV2 -ResourceGroupName "new resource group name" `
                         -Location "new region"`
                         -Name "<new_data_factory_name>"
    ```
    
    For more info about this PowerShell command, see [Create an Azure data factory using PowerShell](quickstart-create-data-factory-powershell.md).

4. Create a new Azure-SSIS IR named **\<new_integration_runtime_name\>** in the new region by using Azure PowerShell.

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

    For more info about this PowerShell command, see [Create the Azure-SSIS integration runtime in Azure Data Factory](create-azure-ssis-integration-runtime.md).


## Next steps

Consider these other configuration options for the Azure-SSIS IR:

- [Configure the Azure-SSIS integration runtime for high performance](configure-azure-ssis-integration-runtime-performance.md)

- [Customize setup for the Azure-SSIS integration runtime](how-to-configure-azure-ssis-ir-custom-setup.md)

- [Provision Enterprise Edition for the Azure-SSIS integration runtime](how-to-configure-azure-ssis-ir-enterprise-edition.md)
