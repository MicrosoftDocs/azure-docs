---
title: Business continuity and disaster recovery (BCDR) recommendations for Azure-SSIS Integration Runtime | Microsoft Docs
description: This article outlines business continuity and disaster recovery recommendations for Azure-SSIS Integration Runtime.
services: data-factory
documentationcenter: ''
ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: 
ms.devlang: powershell
ms.topic: conceptual
ms.date: 07/26/2018
author: swinarko
ms.author: sawinark
ms.reviewer: douglasl
manager: craigg
---
# Business continuity and disaster recovery (BCDR) recommendations for Azure-SSIS Integration Runtime

For the purpose of disaster recovery, you can stop your Azure-SSIS integration runtime in the region in which it is currently running and switch to another region to start it again. We recommend that you use [Azure Paired Regions](../best-practices-availability-paired-regions.md) for this purpose.

## Prerequisites

- Make sure that you have enabled disaster recovery for your Azure SQL Database server in case the server has an outage at the same time. For more info, see [Overview of business continuity with Azure SQL Database](../sql-database/sql-database-business-continuity.md).

- If you are using a virtual network in the current region, you need to use another virtual network in the new region to connect your Azure-SSIS integration runtime. For more info, see [Join an Azure-SSIS integration runtime to a virtual network](join-azure-ssis-integration-runtime-virtual-network.md).

- If you are using a custom setup, you may need to prepare another SAS URI for the blob container that stores your custom setup script and associated files, so it continues to be accessible during an outage. For more info, see [Configure a custom setup on an Azure-SSIS integration runtime](how-to-configure-azure-ssis-ir-custom-setup.md).

## Steps

Follow these steps to stop your Azure-SSIS IR, switch the IR to a new region, and start it again.

1. Stop the IR in the original region.

2. Call the following command in PowerShell to update the IR

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
