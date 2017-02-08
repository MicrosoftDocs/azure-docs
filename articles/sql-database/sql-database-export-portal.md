---
title: 'Azure portal: Export an Azure SQL database to a BACPAC file | Microsoft Docs'
description: Export an Azure SQL database to a BACPAC file  using the Azure Portal
services: sql-database
documentationcenter: ''
author: CarlRabeler
manager: jhubbard
editor: ''

ms.assetid: 
ms.service: sql-database
ms.custom: migrate and move
ms.devlang: NA
ms.date: 12/20/2016
ms.author: sstein;carlrab
ms.workload: data-management
ms.topic: article
ms.tgt_pltfrm: NA

---
# Export an Azure SQL database to a BACPAC file using the Azure portal

This article provides directions for exporting your Azure SQL database to a BACPAC file (stored in Azure blob storage) using the [Azure portal](https://portal.azure.com).

> [!NOTE]
> You can also export your Azure SQL database file to a BACPAC file using [SQL Server Management Studio](sql-database-export-ssms.md), [PowerShell](sql-database-export-powershell.md) or [SQLPackage](sql-database-export-sqlpackage.md).
>


To complete this article, you need the following:

* An Azure subscription.
* An Azure SQL Database. 
* An [Azure Standard Storage account](../storage/storage-create-storage-account.md) with a blob container to store the BACPAC in standard storage.

## Export your database
Open the SQL Database blade for the database you want to export.

> [!IMPORTANT]
> To guarantee a transactionally consistent BACPAC file, you should first [create a copy of your database](sql-database-copy.md) and then export the database copy. 
> 
> 

1. Go to the [Azure portal](https://portal.azure.com).
2. Click **SQL databases**.
3. Click the database to archive.
4. In the SQL Database blade, click **Export** to open the **Export database** blade:
   
   ![export button][1]
5. Click **Storage** and select your storage account and blob container to store the BACPAC:
   
   ![export database][2]
6. Select your authentication type. 
7. Enter the appropriate authentication credentials for the Azure SQL server containing the database you are exporting.
8. Click **OK** to archive the database. Clicking **OK** creates an export database request and submits it to the service. The length of time the export takes depends on the size and complexity of your database, and your service level. View the notification you receive.
   
   ![export notification][3]

## Monitor the progress of the export operation
1. Click **SQL servers**.
2. Click the server containing the original (source) database you archived.
3. Scroll down to Operations.
4. In the SQL server blade click **Import/Export history**:
   
   ![import export history][4]

## Verify the BACPAC is in your storage container
1. Click **Storage accounts**.
2. Click the storage account where you stored the BACPAC archive.
3. Click **Containers** and select the container you exported the database into for details (you can download and save the BACPAC from here).
   
   ![.bacpac file details][5]    

## Next steps
* To learn about importing a BACPAC to an Azure SQL Database using the Azure portal, see [Import a BACPCAC to an Azure SQL database](sql-database-import-portal.md)
* To learn about importing a BACPAC to a SQL Server database, see [Import a BACPCAC to a SQL Server database](https://msdn.microsoft.com/library/hh710052.aspx)

<!--Image references-->
[1]: ./media/sql-database-export/export.png
[2]: ./media/sql-database-export/export-blade.png
[3]: ./media/sql-database-export/export-notification.png
[4]: ./media/sql-database-export/export-history.png
[5]: ./media/sql-database-export/bacpac-archive.png

