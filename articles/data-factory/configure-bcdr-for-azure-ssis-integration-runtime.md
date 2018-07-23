---
title: Configure disaster recovery for Azure-SSIS Integration Runtime | Microsoft Docs
description: This article describes how to configure business continuity and disaster recovery for the Azure-SSIS Integration Runtime.
services: data-factory
documentationcenter: ''
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: 
ms.devlang: powershell
ms.topic: conceptual
ms.date: 07/24/2018
author: swinarko
ms.author: sawinark
ms.reviewer: douglasl
manager: craigg
---
# Configure business continuity and disaster recovery (BCDR) for the Azure-SSIS Integration Runtime

For the purpose of disaster recovery, you can stop the Azure-SSIS integration runtime in the region in which it's running and switch to another region to start it again. We recommend that you use [Azure Paired Regions](../best-practices-availability-paired-regions.md) for this scenario.

## Prerequisites

- Make sure that you have enabled disaster recovery for your Azure SQL Database server in case the database server has an outage at the same time. For more info, see [Overview of business continuity with Azure SQL Database](../sql-database/sql-database-business-continuity.md).

- If you're using a virtual network, you may need to prepare another virtual network to which you can connect your Azure SQL Database server. For more info, see [Join an Azure-SSIS integration runtime to a virtual network](join-azure-ssis-integration-runtime-virtual-network.md).

- If you're using a custom setup or configuration script, you may need to prepare an SAS Uri at which your custom script SAS Uri can be accessed during an outage.

## Steps

Follow these steps to stop your Azure-SSIS IR, switch the IR to a new region, and start it again.

1. Stop the IR in the original region.

2. Call following command in PowerShell to update the integration runtime

    ```powershell
    Set-AzureRmDataFactoryV2IntegrationRuntime -Location "new region" `
                    -CatalogServerEndpoint "SQL Server endpoint" `
                    -CatalogAdminCredential "credential" `
                    -VNetId "new VNet" `
                    -Subnet "new subnet" `
                    -SetupScriptContainerSasUri "new script SAS Uri"
    ```

    For more info about this PowerShell command, see [Create the Azure-SSIS integration runtime in Azure Data Factory](create-azure-ssis-integration-runtime.md)

3. Start the IR again.

## Next steps

Consider these other configuration options for the Azure-SSIS IR:

- [Configure the Azure-SSIS Integration Runtime for high performance](configure-azure-ssis-integration-runtime-performance.md)

- [Customize setup for the Azure-SSIS integration runtime](how-to-configure-azure-ssis-ir-custom-setup.md)

- [Provision Enterprise Edition for the Azure-SSIS Integration Runtime](how-to-configure-azure-ssis-ir-enterprise-edition.md)