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
ms.date: 02/07/2017
ms.author: carlrab
ms.workload: data-management
ms.topic: article
ms.tgt_pltfrm: NA

---
# Export an Azure SQL database to a BACPAC file using the Azure portal

This article provides directions for exporting your Azure SQL database to a BACPAC file (stored in Azure blob storage) using the [Azure portal](https://portal.azure.com). For an overview of exporting to a BACPAC file, see [Export to a BACPAC](sql-database-export.md).

> [!NOTE]
> You can also export your Azure SQL database file to a BACPAC file using [SQL Server Management Studio](sql-database-export-ssms.md), [PowerShell](sql-database-export-powershell.md) or [SQLPackage](sql-database-export-sqlpackage.md).
>

## Prerequisites

To complete this article, you need the following:

* An Azure subscription.
* An Azure SQL Database. 
* An [Azure Standard Storage account](../storage/storage-create-storage-account.md) with a blob container to store the BACPAC in standard storage.

## Export your database

1. Go to the [Azure portal](https://portal.azure.com).
2. Open the SQL Database blade for the database you want to export.
3. Ensure that no transactions will occur during the export. 

   > [!IMPORTANT]
   > To guarantee a transactionally consistent BACPAC file, a good method is to [create a copy of your database](sql-database-copy.md) and then export from the database copy. 
   > 

4. Click **SQL databases**.
5. Click the database to archive.
6. In the SQL Database blade, click **Export** to open the **Export database** blade:
   
   ![export button][1]
7. Click **Storage** and select your storage account and blob container to store the BACPAC:
   
   ![export database][2]
8. Select your authentication type. 
9. Enter the appropriate authentication credentials for the Azure SQL server containing the database you are exporting.
10. Click **OK** to  export the database. Clicking **OK** creates an export database request and submits it to the service. The length of time the export takes depends on the size and complexity of your database, and your service level. 
11. View the notification you receive.
   
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

* To learn about long-term backup retention of an Azure SQL database backup as an alternative to exported a database for archive purposes, see [Long term backup retention](sql-database-long-term-retention.md)
* To learn about importing a BACPAC to a SQL Server database, see [Import a BACPCAC to a SQL Server database](https://msdn.microsoft.com/library/hh710052.aspx)

<!--Image references-->
[1]: ./media/sql-database-export/export.png
[2]: ./media/sql-database-export/export-blade.png
[3]: ./media/sql-database-export/export-notification.png
[4]: ./media/sql-database-export/export-history.png
[5]: ./media/sql-database-export/bacpac-archive.png

