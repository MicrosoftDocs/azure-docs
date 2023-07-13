---
title: Open and save files with SSIS packages deployed in Azure
description: Learn how to open and save files on premises and in Azure when you lift and shift SSIS packages that use local file systems into SSIS in Azure
ms.date: 04/12/2023
ms.topic: conceptual
ms.service: data-factory
ms.subservice: integration-services
author: chugugrace
ms.author: chugu
ms.reviewer: jburchel
---

# Open and save files on premises and in Azure with SSIS packages deployed in Azure

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article describes how to open and save files on premises and in Azure when you lift and shift SSIS packages that use local file systems into SSIS in Azure.

## Save temporary files

If you need to store and process temporary files during a single package execution, packages can use the current working directory (`.`) or temporary folder (`%TEMP%`) of your Azure-SSIS Integration Runtime nodes.

## Use on-premises file shares

To continue to use **on-premises file shares** when you lift and shift packages that use local file systems into SSIS in Azure, do the following things:

1. Transfer files from local file systems to on-premises file shares.

2. Join the on-premises file shares to an Azure virtual network.

3. Join your Azure-SSIS IR to the same virtual network. For more info, see [Join an Azure-SSIS integration runtime to a virtual network](./join-azure-ssis-integration-runtime-virtual-network.md).

4. Connect your Azure-SSIS IR to the on-premises file shares inside the same virtual network by setting up access credentials that use Windows authentication. For more info, see [Connect to data and file shares with Windows Authentication](ssis-azure-connect-with-windows-auth.md).

5. Update local file paths in your packages to UNC paths pointing to on-premises file shares. For example, update `C:\abc.txt` to `\\<on-prem-server-name>\<share-name>\abc.txt`.

## Use Azure file shares

To use **Azure Files** when you lift and shift packages that use local file systems into SSIS in Azure, do the following things:

1. Transfer files from local file systems to Azure Files. For more info, see [Azure Files](https://azure.microsoft.com/services/storage/files/).

2. Connect your Azure-SSIS IR to Azure Files by setting up access credentials that use Windows authentication. For more info, see [Connect to data and file shares with Windows Authentication](ssis-azure-connect-with-windows-auth.md).

3. Update local file paths in your packages to UNC paths pointing to Azure Files. For example, update `C:\abc.txt` to `\\<storage-account-name>.file.core.windows.net\<share-name>\abc.txt`.

## Next steps

- Deploy your packages. For more info, see [Deploy an SSIS project to Azure with SSMS](/sql/integration-services/ssis-quickstart-deploy-ssms).
- Run your packages. For more info, see [Run SSIS packages in Azure with SSMS](/sql/integration-services/ssis-quickstart-run-ssms).
- Schedule your packages. For more info, see [Schedule SSIS packages in Azure](/sql/integration-services/lift-shift/ssis-azure-schedule-packages-ssms).