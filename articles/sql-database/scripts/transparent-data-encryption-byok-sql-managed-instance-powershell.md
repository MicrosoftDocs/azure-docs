---
title: "PowerShell: Enable BYOK TDE - Azure SQL Database Managed Instance | Microsoft Docs"
description: "Learn how to configure an Azure SQL Managed Instance to start using BYOK Transparent Data Encryption (TDE) for encryption-at-rest using PowerShell."
services: sql-database
ms.service: sql-database
ms.subservice: security
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: MladjoA
ms.author: mlandzic
ms.reviewer: vanto, carlrab
manager: craigg
ms.date: 04/19/2019
---
# Manage Transparent Data Encryption in a Managed Instance using your own key from Azure Key Vault (Preview)

This PowerShell script example configures Transparent Data Encryption (TDE) in Bring Your Own Key (preview) scenario for Azure SQL Managed Instance, using a key from Azure Key Vault. To learn more about the TDE with Bring Your Own Key (BYOK) Support, see [TDE Bring Your Own Key to Azure SQL](../transparent-data-encryption-byok-azure-sql.md).

## Prerequisites

- An existing Managed Instance. See [Use PowerShell to create an Azure SQL Database managed instance](sql-database-create-configure-managed-instance-powershell.md).

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]
[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]
[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

Using both PowerShell locally or using Azure Cloud Shell requires AZ PowerShell 1.1.1-preview or a later preview version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-az-ps), or run the below sample script to install the module.

`Install-Module -Name Az.Sql -RequiredVersion 1.1.1-preview -AllowPrerelease -Force`

If you are running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Sample scripts

[!code-powershell-interactive[main](../../../powershell_scripts/sql-database/transparent-data-encryption/setup-tde-byok-sqlmi.ps1 "Set up BYOK TDE for SQL Managed Instance")]

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional SQL Database PowerShell script samples can be found in the [Azure SQL Database PowerShell scripts](../sql-database-powershell-samples.md).
