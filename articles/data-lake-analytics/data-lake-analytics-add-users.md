---
title: Add users to an Azure Data Lake Analytics account
description: Learn how to correctly add users to your Data Lake Analytics account
services: data-lake-analytics
ms.service: data-lake-analytics
author: saveenr
ms.author: saveenr
ms.reviewer: jasonwhowell
ms.assetid: db35f16e-1565-4873-a851-bd987accdc58
ms.topic: conceptual
ms.date: 05/24/2018
---

# Adding a user in the Azure portal

## Start the Add User Wizard
1. Open your Azure Data Lake Analytics via https://portal.azure.com.
2. Click **Add User Wizard**.
3. In the **Select user** step, find the user you want to add. Click **Select**.
4. the **Select role** step, pick **Data Lake Analytics Developer**. This role has the minimum set of permissions required to submit/monitor/manage U-SQL jobs. Assign to this role if the group is not intended for managing Azure services.
5. In the **Select catalog permissions** step, select any additional databases that user will need access to. Read and Write Access to the master database is required to submit jobs. When you are done, click **OK**.
6. In the final step called **Assign selected permissions** review the changes the wizard will make. Click **OK**.


## Configure ACLs for data folders
Grant "R-X" or "RWX", as needed, on folders containing input data and output data.


## Optionally, add the user to the Azure Data Lake Storage Gen1 role **Reader** role.
1.	Find your Azure Data Lake Storage Gen1 account.
2.	Click on **Users**.
3. Click **Add**.
4.	Select an Azure RBAC Role to assign this group.
5.	Assign to Reader role. This role has the minimum set of permissions required to browse/manage data stored in ADLSGen1. Assign to this role if the Group is not intended for managing Azure services.
6.	Type in the name of the Group.
7.	Click **OK**.

## Adding a user using PowerShell

1. Follow the instructions in this guide: [How to install and configure Azure PowerShell](https://azure.microsoft.com/documentation/articles/powershell-install-configure/).
2. Download the [Add-AdlaJobUser.ps1](https://github.com/Azure/AzureDataLake/blob/master/Samples/PowerShell/ADLAUsers/Add-AdlaJobUser.ps1) PowerShell script.
3. Run the PowerShell script. 

The sample command to give user access to submit jobs, view new job metadata, and view old metadata is:

`Add-AdlaJobUser.ps1 -Account myadlsaccount -EntityToAdd 546e153e-0ecf-417b-ab7f-aa01ce4a7bff -EntityType User -FullReplication`


## Next steps

* [Overview of Azure Data Lake Analytics](data-lake-analytics-overview.md)
* [Get started with Data Lake Analytics by using the Azure portal](data-lake-analytics-get-started-portal.md)
* [Manage Azure Data Lake Analytics by using Azure PowerShell](data-lake-analytics-manage-use-powershell.md)

