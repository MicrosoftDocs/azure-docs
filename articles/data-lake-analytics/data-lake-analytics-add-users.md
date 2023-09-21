---
title: Add users to an Azure Data Lake Analytics account
description: Learn how to correctly add users to your Data Lake Analytics account using the Add User Wizard and Azure PowerShell.
ms.service: data-lake-analytics
ms.custom: devx-track-azurepowershell
ms.reviewer: whhender
ms.topic: how-to
ms.date: 01/20/2023
---

# Adding a user in the Azure portal

[!INCLUDE [retirement-flag](includes/retirement-flag.md)]

## Start the Add User Wizard

1. Open your Azure Data Lake Analytics via the [Azure portal](https://portal.azure.com).
2. Select **Add User Wizard**.
3. In the **Select user** step, find the user you want to add. Select **Select**.
4. the **Select role** step, pick **Data Lake Analytics Developer**. This role has the minimum set of permissions required to submit/monitor/manage U-SQL jobs. Assign to this role if the group isn't intended for managing Azure services.
5. In the **Select catalog permissions** step, select any other databases that user will need access to. Read and Write Access to the default static database called "master" is required to submit jobs. When you're done, select **OK**.
6. In the final step called **Assign selected permissions** review the changes the wizard will make. Select **OK**.

## Configure ACLs for data folders

Grant "R-X" or "RWX", as needed, on folders containing input data and output data.

## Optionally, add the user to the Azure Data Lake Storage Gen1 role **Reader** role

1. Find your Azure Data Lake Storage Gen1 account.
2. Select **Users**.
3. Select **Add**.
4. Select an Azure role to assign this group.
5. Assign to Reader role. This role has the minimum set of permissions required to browse/manage data stored in ADLSGen1. Assign to this role if the Group isn't intended for managing Azure services.
6. Type in the name of the Group.
7. Select **OK**.

## Adding a user using PowerShell

1. Follow the instructions in this guide: [How to install and configure Azure PowerShell](/powershell/azure/).
2. Download the [Add-AdlaJobUser.ps1](https://github.com/Azure/AzureDataLake/blob/master/Samples/PowerShell/ADLAUsers/Add-AdlaJobUser.ps1) PowerShell script.
3. Run the PowerShell script.

The sample command to give user access to submit jobs, view new job metadata, and view old metadata is:

`.\Add-AdlaJobUser.ps1 -Account myadlsaccount -EntityIdToAdd 546e153e-0ecf-417b-ab7f-aa01ce4a7bff -EntityType User -FullReplication`

## Next steps

* [Overview of Azure Data Lake Analytics](data-lake-analytics-overview.md)
* [Get started with Data Lake Analytics by using the Azure portal](data-lake-analytics-get-started-portal.md)
* [Manage Azure Data Lake Analytics by using Azure PowerShell](data-lake-analytics-manage-use-powershell.md)
