---
title: Import or export an Azure SQL Database using Private link
description: Import or export an Azure SQL Database using Private Link without allowing Azure services to access the server.
services: sql-database
ms.service: sql-database
ms.subservice: migration
ms.custom: sqldbrb=1
ms.devlang:
ms.topic: how-to
author: SudhirRaparla
ms.author: nvraparl
ms.reviewer: 
ms.date: 2/16/2022
---
# Import or export an Azure SQL Database using Private Link without allowing Azure services to access the server

[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

Running Import or Export via Azure PowerShell or Azure portal requires you to set [Allow Access to Azure Services](network-access-controls-overview.md) to ON, otherwise Import/Export operation fails with an error. Often, users want to perform Import or Export using a private end point without allowing access to all Azure services. 

## What is Import-Export Private Link?

Import Export Private Link is a Service Managed Private Endpoint created by Microsoft and that is exclusively used by the Import-Export, database and Azure Storage services for all communications. The private end point has to be manually approved by user in the Azure portal for both server and storage. 

:::image type="content" source="./media/database-import-export-private-link/import-export-private-link.png" alt-text="Screenshot of Import Export Private link architecture":::

To use Private Link with Import-Export, user database and Azure Storage blob container must be hosted on the same type of Azure Cloud. For example, either both in Azure Commercial or both on Azure Gov. Hosting across cloud types isn't supported.

This article explains how to import or export an Azure SQL Database using [Private Link](private-endpoint-overview.md) with *Allow Azure Services* is set to *OFF* on the Azure SQL server.  

> [!NOTE]
> Import Export using Private Link for Azure SQL Database is currently in preview

> [!IMPORTANT]
> Import or Export of a database from [Azure SQL Managed Instance](../managed-instance/sql-managed-instance-paas-overview.md) or from a database in the [Hyperscale service tier](service-tier-hyperscale.md) using PowerShell isn't currently supported.

---

## Configure Import-Export Private Link
Import-Export Private Link can be configured via Azure portal, PowerShell or using REST API. 

### Configure Import-Export Private link using Azure portal

#### Create Import Private Link
1.  Go to server into which you would like to import database. Select Import database from toolbar in Overview page.
2.  In Import Database page, select Use Private Link option
:::image type="content" source="./media/database-import-export-private-link/import-database-private-link.png" alt-text="Screenshot that shows how to enable Import Private link" lightbox="media/database-import-export-private-link/import-database-private-link.png"::: 
3.  Enter the storage account, server credentials, Database details and select on Ok

#### Create Export Private Link 
1. Go to the database that you would like to export. Select Export database from toolbar in Overview page
2. In Export Database page, select Use Private Link option
:::image type="content" source="./media/database-import-export-private-link/export-database-private-link.png" alt-text="Screenshot that shows how to enable Export Private Link" lightbox="media/database-import-export-private-link/export-database-private-link.png":::
3. Enter the storage account, server sign-in credentials, Database details and select Ok 

#### Approve Private End Points

##### Approve Private Endpoints in Private Link Center
1.  Go to Private Link Center
2.  Navigate to Private endpoints section
3.  Approve the private endpoints you created using Import/Export service

##### Approve Private End Point connection on Azure SQL Database
1.  Go to the server that hosts the database.
2.  Open the ‘Private endpoint connections’ page in security section on the left.
3.  Select the private endpoint you want to approve.
4.  Select Approve to approve the connection.

:::image type="content" source="media/database-import-export-private-link/approve-private-link.png" alt-text="Screenshot that shows how to approve Azure SQL Database Private Link"::: 

##### Approve Private End Point connection on Azure Storage
1.  Go to the storage account that hosts the blob container that holds BACPAC file. 
2.  Open the ‘Private endpoint connections’ page in security section on the left.
3.  Select the Import-Export private endpoints you want to approve.
4.  Select Approve to approve the connection. 

:::image type="content" source="./media/database-import-export-private-link/approve-private-link-storage.png" alt-text="Screenshot that shows how to approve Azure Storage Private Link in Azure Storage":::

After the Private End points are approved both in Azure SQL Server and Storage account, Import or Export jobs will be kicked off. Until then, the jobs will be on hold.

You can check the status of Import or Export jobs in Import-Export History page under Data Management section in Azure SQL Server page.
:::image type="content" source="./media/database-import-export-private-link/import-export-status.png" alt-text="Screenshot that shows how to check Import Export Jobs Status" lightbox="media/database-import-export-private-link/import-export-status.png":::

---

### Configure Import-Export Private Link using PowerShell

#### Import a Database using Private link in PowerShell
Use the [New-AzSqlDatabaseImport](/PowerShell/module/az.sql/new-azsqldatabaseimport) cmdlet to submit an import database request to Azure. Depending on database size, the import may take some time to complete. The DTU based provisioning model supports select database max size values for each tier. When importing a database [use one of these supported values](/sql/t-sql/statements/create-database-transact-sql). 

```PowerShell
$importRequest = New-AzSqlDatabaseImport -ResourceGroupName "<resourceGroupName>" `
        -ServerName "<serverName>" -DatabaseName "<databaseName>" `
        -DatabaseMaxSizeBytes "<databaseSizeInBytes>" -StorageKeyType "StorageAccessKey" ` 
        -StorageKey $(Get-AzStorageAccountKey -ResourceGroupName $resourceGroupName `
                        -StorageAccountName "<storageAccountName>").Value[0] 
        -StorageUri "https://myStorageAccount.blob.core.windows.net/importsample/sample.bacpac" `
        -Edition "Standard" -ServiceObjectiveName "P6" ` -UseNetworkIsolation $true `
        -StorageAccountResourceIdForPrivateLink "/subscriptions/<subscriptionId>/resourcegroups/<resource_group_name>/providers/Microsoft.Storage/storageAccounts/<storage_account_name>" `
 	    -SqlServerResourceIdForPrivateLink "/subscriptions/<subscriptionId>/resourceGroups/<resource_group_name>/providers/Microsoft.Sql/servers/<server_name>" `
        -AdministratorLogin "<userID>" `
        -AdministratorLoginPassword $(ConvertTo-SecureString -String "<password>" -AsPlainText -Force)

```

#### Export a Database using Private Link in PowerShell
Use the [New-AzSqlDatabaseExport](/PowerShell/module/az.sql/new-azsqldatabaseexport) cmdlet to submit an export database request to the Azure SQL Database service. Depending on the size of your database, the export operation may take some time to complete.

```PowerShell
$importRequest = New-AzSqlDatabaseExport -ResourceGroupName "<resourceGroupName>" `
        -ServerName "<serverName>" -DatabaseName "<databaseName>" `
        -DatabaseMaxSizeBytes "<databaseSizeInBytes>" -StorageKeyType "StorageAccessKey" ` 
        -StorageKey $(Get-AzStorageAccountKey -ResourceGroupName $resourceGroupName `
                        -StorageAccountName "<storageAccountName>").Value[0] 
        -StorageUri "https://myStorageAccount.blob.core.windows.net/importsample/sample.bacpac" `
        -Edition "Standard" -ServiceObjectiveName "P6" ` -UseNetworkIsolation $true `
        -StorageAccountResourceIdForPrivateLink "/subscriptions/<subscriptionId>/resourcegroups/<resource_group_name>/providers/Microsoft.Storage/storageAccounts/<storage_account_name>" `
 	    -SqlServerResourceIdForPrivateLink "/subscriptions/<subscriptionId>/resourceGroups/<resource_group_name>/providers/Microsoft.Sql/servers/<server_name>" `
        -AdministratorLogin "<userID>" `
        -AdministratorLoginPassword $(ConvertTo-SecureString -String "<password>" -AsPlainText -Force)
```

---

### Create Import-Export Private link using REST API
Existing APIs to perform Import and Export jobs have been enhanced to support Private Link. Refer to [Import Database API](/rest/api/sql/2021-08-01-preview/servers/import-database)

## Limitations

- Import using Private Link does not support specifying a backup storage redundancy while creating a new database and creates with the default geo-redundant backup storage redundancy. As a work around, first create an empty database with desired backup storage redundancy using Azure portal or PowerShell and then import the BACPAC into this empty database.
- Import and Export operations are not supported in Azure SQL DB Hyperscale tier yet.
- Import using REST API with private link can only be done to existing database since the API uses database extensions. To workaround this create an empty database with desired name and call Import REST API with Private link.


## Next steps
- [Import or Export Azure SQL Database without allowing Azure services to access the server](database-import-export-azure-services-off.md)
- [Import a database from a BACPAC file](database-import.md) 
