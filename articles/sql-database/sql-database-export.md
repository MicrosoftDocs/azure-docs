<properties
	pageTitle="Archive an Azure SQL database to a BACPAC file using the Azure Portal"
	description="Archive an Azure SQL database to a BACPAC file  using the Azure Portal"
	services="sql-database"
	documentationCenter=""
	authors="stevestein"
	manager="jhubbard"
	editor=""/>

<tags
	ms.service="sql-database"
	ms.devlang="NA"
	ms.date="07/19/2016"
	ms.author="sstein"
	ms.workload="data-management"
	ms.topic="article"
	ms.tgt_pltfrm="NA"/>


# Archive an Azure SQL database to a BACPAC file using the Azure Portal

> [AZURE.SELECTOR]
- [Azure portal](sql-database-export.md)
- [PowerShell](sql-database-export-powershell.md)

This article provides directions for archiving your Azure SQL database to a BACPAC file stored in Azure blob storage using the [Azure portal](https://portal.azure.com).

When you need to create an archive of an Azure SQL database, you can export the database schema and data to a BACPAC file. A BACPAC file is simply a ZIP file with an extension of BACPAC. A BACPAC file can later be stored in Azure blob storage or in local storage in an on-premises location and later imported back into Azure SQL Database or into a SQL Server on-premises installation. 

***Considerations***

- For an archive to be transactionally consistent, you must either ensure that no write activity is occurring during the export or export from a [transactionally consistent copy](sql-database-copy.md) of your Azure SQL Database
- The maximum size of a BACPAC file archived to Azure blob storage is 200 GB. Use the [SqlPackage](https://msdn.microsoft.com/library/hh550080.aspx) command-prompt utility to archive a larger BACPAC file to local storage. This utility ships with both Visual Studio and SQL Server. You can also [download](https://msdn.microsoft.com/library/mt204009.aspx) the latest version of SQL Server Data Tools to get this utility.
- Archiving to Azure premium storage using a BACPAC file is not supported.
- If the export operation goes over 20 hours it may be canceled. To increase performance during export, you can:
 - Temporarily increase your service level 
 - Cease all read and write activity during the export
 - Use a clustered index on all large tables. Without clustered indexes, an export may fail if it takes longer than 6-12 hours. This is because the export services needs to complete table scan to try to export entire table

> [AZURE.NOTE] BACPACs are not intended to be used for backup and restore operations. Azure SQL Database automatically creates backups for every user database. For details, see [Business Continuity Overview](sql-database-business-continuity.md).

To complete this article you need the following:

- An Azure subscription.
- An Azure SQL Database. 
- An [Azure Standard Storage account](../storage/storage-create-storage-account.md) with a blob container to store the BACPAC in standard storage.

## Export your database

Open the SQL Database blade for the database you want to export.

> [AZURE.IMPORTANT] To guarantee a transactionally consistent BACPAC file you should first [create a copy of your database](sql-database-copy.md) and then export the database copy. 

1.	Go to the [Azure portal](https://portal.azure.com).
2.	Click **SQL databases**.
3.	Click the database to archive.
4.	In the SQL Database blade, click **Export** to open the **Export database** blade:

    ![export button][1]

5.  Click **Storage** and select your storage account and blob container where the BACPAC will be stored:

    ![export database][2]

6. Select your authentication type. 
7.  Enter the appropriate authentication credentials for the Azure SQL server containing the database you are exporting.
8.  Click **OK** to archive the database. Clicking **OK** creates an export database request and submits it to the service. The length of time the export will take depends on the size and complexity of your database, and your service level. You will receive a notification.

    ![export notification][3]

## Monitor the progress of the export operation

1.	Click **SQL servers**.
2.	Click the server containing the original (source) database you just archived.
3.  Scroll down to Operations.
4.	In the SQL server blade click **Import/Export history**:

    ![import export history][4]

## Verify the BACPAC is in your storage container

1.	Click **Storage accounts**.
2.	Click the storage account where you stored the BACPAC archive.
3.	Click **Containers** and select the container you exported the database into for details (you can download and save the BACPAC from here).

    ![.bacpac file details][5]	

## Next steps

- To learn about importing a BACPAC to an Azure SQL Database, see [Import a BACPCAC to an Azure SQL database](sql-database-import.md)
- To learn about importing a BACPAC to a SQL Server database, see [Import a BACPCAC to a SQL Server database](https://msdn.microsoft.com/library/hh710052.aspx)



<!--Image references-->
[1]: ./media/sql-database-export/export.png
[2]: ./media/sql-database-export/export-blade.png
[3]: ./media/sql-database-export/export-notification.png
[4]: ./media/sql-database-export/export-history.png
[5]: ./media/sql-database-export/bacpac-archive.png

