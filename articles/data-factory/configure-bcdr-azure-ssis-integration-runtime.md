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

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article describes how to configure the Azure-SSIS Integration Runtime with Azure SQL Database geo-replication for the SSISDB database. When a failover occurs, you can ensure that the Azure-SSIS IR keeps working with the secondary database.

For more info about geo-replication and failover for SQL Database, see [Overview: Active geo-replication and auto-failover groups](../sql-database/sql-database-geo-replication-overview.md).

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Azure-SSIS IR failover with Azure SQL Database Managed Instance

### Prerequisites
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

### Solution
When a failover occurs, if you want to use existing Azure-SSIS IR on primary region:
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

4. Change the server name in **ConnectionManager** of your SSIS packages with the secondary instance server name, then redeploy these packages and run.

If you want to provision a new Azure-SSIS IR on secondary region:
> [!NOTE]
> Step 4 (creation of IR) needs to be done via PowerShell. Azure portal will report an error stating that SSISDB already exists.
1. Stop Azure-SSIS IR on primary region.

2. Execute stored procedure to update metadata in SSISDB to accept connections from **\<new_data_factory_name\>** and **\<new_integration_runtime_name\>**.
   
```SQL
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

5. Change the server name in **ConnectionManager** of your SSIS packages with the secondary instance server name, then redeploy these packages and run.



## Azure-SSIS IR failover with Azure SQL Database

### Scenario 1 - Azure-SSIS IR is pointing to read-write listener endpoint

#### Conditions

This section applies when the following conditions are true:

- The Azure-SSIS IR is pointing to the read-write listener endpoint of the failover group.

  AND

- The SQL Database server is *not* configured with the virtual network service endpoint rule.

#### Solution

When failover occurs, it is transparent to the Azure-SSIS IR. The Azure-SSIS IR automatically connects to the new primary of the failover group.


### Scenario 2 - Azure-SSIS IR is pointing to primary server endpoint

#### Conditions

This section applies when one of the following conditions is true:

- The Azure-SSIS IR is pointing to the primary server endpoint of the failover group. This endpoint changes when failover occurs.

  OR

- The Azure SQL Database server is configured with the virtual network service endpoint rule.


#### Solution

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

4. Change the server name in **ConnectionManager** of your SSIS packages with the secondary instance server name, then redeploy these packages and run.


### Scenario 3 - Attaching an existing SSISDB (SSIS catalog) to a new Azure-SSIS IR

When an ADF or Azure-SSIS IR disaster occurs in current region, you can make your SSISDB keeps working with a new Azure-SSIS IR in a new region.

#### Solution

> [!NOTE]
> Step 4 (creation of IR) needs to be done via PowerShell. Azure portal will report an error stating that SSISDB already exists.

1. Stop Azure-SSIS IR on primary region.

2. Execute stored procedure to update metadata in SSISDB to accept connections from **\<new_data_factory_name\>** and **\<new_integration_runtime_name\>**.
   
```SQL
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

5. Change the server name in **ConnectionManager** of your SSIS packages with the secondary instance server name, then redeploy these packages and run.


## Next steps

Consider these other configuration options for the Azure-SSIS IR:

- [Configure the Azure-SSIS Integration Runtime for high performance](configure-azure-ssis-integration-runtime-performance.md)

- [Customize setup for the Azure-SSIS integration runtime](how-to-configure-azure-ssis-ir-custom-setup.md)

- [Provision Enterprise Edition for the Azure-SSIS Integration Runtime](how-to-configure-azure-ssis-ir-enterprise-edition.md)
