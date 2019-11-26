---
title: "PowerShell: Enable BYOK TDE - Azure SQL Database Managed Instance "
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
ms.date: 11/05/2019
---
# Manage Transparent Data Encryption in a Managed Instance using your own key from Azure Key Vault

This PowerShell script example configures Transparent Data Encryption (TDE) with customer-managed key for Azure SQL Managed Instance, using a key from Azure Key Vault. This is often referred to as a Bring Your Own Key scenario for TDE. To learn more about the TDE with customer-managed key, see [TDE Bring Your Own Key to Azure SQL](../transparent-data-encryption-byok-azure-sql.md).

## Prerequisites

- An existing Managed Instance. See [Use PowerShell to create an Azure SQL Database managed instance](sql-database-create-configure-managed-instance-powershell.md).

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]
[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]
[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

Using both PowerShell locally or using Azure Cloud Shell requires AZ PowerShell 2.3.2 or a later version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-az-ps), or run the below sample script to install the module for the current user:

`Install-Module -Name Az -AllowClobber -Scope CurrentUser`

If you are running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Sample scripts

[!code-powershell-interactive[main](../../../powershell_scripts/sql-database/transparent-data-encryption/setup-tde-byok-sqlmi.ps1 "Set up BYOK TDE for SQL Managed Instance")]

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional SQL Database PowerShell script samples can be found in the [Azure SQL Database PowerShell scripts](../sql-database-powershell-samples.md).
