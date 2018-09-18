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
    Set-AzureRmDataFactoryV2IntegrationRuntime -Location "new region" `
                    -CatalogServerEndpoint "Azure SQL Database server endpoint" `
                    -CatalogAdminCredential "Azure SQL Database server admin credentials" `
                    -VNetId "new VNet" `
                    -Subnet "new subnet" `
                    -SetupScriptContainerSasUri "new custom setup SAS URI"
    ```

    For more info about this PowerShell command, see [Create the Azure-SSIS integration runtime in Azure Data Factory](create-azure-ssis-integration-runtime.md)

3. Start the IR again.

## Next steps

Consider these other configuration options for the Azure-SSIS IR:

- [Configure the Azure-SSIS Integration Runtime for high performance](configure-azure-ssis-integration-runtime-performance.md)

- [Customize setup for the Azure-SSIS integration runtime](how-to-configure-azure-ssis-ir-custom-setup.md)

- [Provision Enterprise Edition for the Azure-SSIS Integration Runtime](how-to-configure-azure-ssis-ir-enterprise-edition.md)
