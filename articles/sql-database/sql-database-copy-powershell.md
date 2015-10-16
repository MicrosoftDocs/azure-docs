<properties 
    pageTitle="Create a copy of an Azure SQL database using PowerShell" 
    description="Create copy of an Azure SQL database using PowerShell" 
	services="sql-database"
	documentationCenter=""
	authors="stevestein"
	manager="jeffreyg"
	editor=""/>

<tags
	ms.service="sql-database"
	ms.devlang="NA"
	ms.date="10/16/2015"
	ms.author="sstein"
	ms.workload="data-management"
	ms.topic="article"
	ms.tgt_pltfrm="NA"/>


# Create a copy of a SQL database using PowerShell

**Single database**

> [AZURE.SELECTOR]
- [Azure Preview Portal](sql-database-copy.md)
- [PowerShell](sql-database-copy-powershell.md)
- [SQL](sql-database-copy-transact-sql.md)



This following steps show you how to copy a SQL database with PowerShell. The database copy operation copies a SQL database to a new database using the [Start-AzureSqlDatabaseCopy](https://msdn.microsoft.com/library/dn720220.aspx) cmdlet. The copy is a snapshot backup of your database that you create on either the same server or a different server.

> [AZURE.NOTE] Azure SQL Database automatically creates and maintains backups for every user database that you can restore. For details, see [Business Continuity Overview](sql-database-business-continuity.md).

When the copying process completes, the new database is a fully functioning database that is independent of the source database. The new database is transactionally consistent with the source database at the time when the copy completes. The service tier and performance level (pricing tier) of the database copy are the same as the source database. After the copy is complete, the copy becomes a fully functional, independent database. The logins, users, and permissions can be managed independently.


When you copy a database to the same logical server, the same logins can be used on both databases. The security principal you use to copy the database becomes the database owner (DBO) on the new database. All database users, their permissions, and their security identifiers (SIDs) are copied to the database copy.


To complete this article you need the following:

- An Azure subscription. If you need an Azure subscription simply click **FREE TRIAL** at the top of this page, and then come back to finish this article.
- An Azure SQL Database. If you do not have a SQL database, create one following the steps in this article: [Create your first Azure SQL Database](sql-database-get-started.md).
- Azure PowerShell. You can download and install the Azure PowerShell modules by running the [Microsoft Web Platform Installer](http://go.microsoft.com/fwlink/p/?linkid=320376&clcid=0x409). For detailed information, see [How to install and configure Azure PowerShell](powershell-install-configure.md).



## Configure your credentials and select your subscription

First you must establish access to your Azure account so start PowerShell and then run the following cmdlet. In the login screen enter the same email and password that you use to sign in to the Azure portal.

	Add-AzureAccount

After successfully signing in you will see some information on screen that includes the Id you signed in with and the Azure subscriptions you have access to.


### Select your Azure subscription

To select the subscription you need your subscription Id or subscription name (**-SubscriptionName**). You can copy the subscription Id from the information displayed from previous step, or if you have multiple subscriptions and need more details you can run the **Get-AzureSubscription** cmdlet and copy the desired subscription information from the resultset. Once you have your subscription run the following cmdlet:

	Select-AzureSubscription -SubscriptionId 4cac86b0-1e56-bbbb-aaaa-000000000000

After successfully running **Select-AzureSubscription** you are returned to the PowerShell prompt. If you have more than one subscription you can run **Get-AzureSubscription** and verify the subscription you want to use shows **IsCurrent: True**.


## Setup the variables for for your specific environment

There are a few variables where you need to replace the example values with the specific values for your database and servers.

Replace the placeholder values with the values for your environment:

    # The name of the server on which the source database resides.
    $ServerName = "sourceServerName"

    # The name of the source database (the database to copy). 
    $DatabaseName = "sourceDatabaseName" 
    
    # The name of the server that hosts the target database. This server must be in the same Azure subscription as the source database server. 
    $PartnerServerName = "partnerServerName"

    # The name of the target database (the name of the copy).
    $PartnerDatabaseName = "partnerDatabaseName" 





## Copy a SQL database to the same server

This command submits the copy database request to the service. Depending on the size of your database the copy operation may take some time to complete.

    # Copy a database to the same server
    Start-AzureSqlDatabaseCopy -ServerName $ServerName -DatabaseName $DatabaseName -PartnerDatabase $PartnerDatabaseName

## Copy a SQL database to a different server

This command submits the copy database request to the service. Depending on the size of your database the copy operation may take some time to complete.

    # Copy a database to a different server
    Start-AzureSqlDatabaseCopy -ServerName $ServerName -DatabaseName $DatabaseName -PartnerServer $PartnerServerName -PartnerDatabase $PartnerDatabaseName
    

## Monitor the progress of the copy operation

After running **Start-AzureSqlDatabaseCopy** you can check the status of the copy request. Running this immediately after the request will usually return **State : Pending** or **State : Running** so you can run this multiple times until you see **State : COMPLETED** in the output. 


    Get-AzureSqlDatabaseOperation -ServerName $ServerName -DatabaseName $DatabaseName


## Copy SQL database PowerShell script

    # The name of the server where the source database resides
    $ServerName = "sourceServerName"

    # The name of the source database (the database to copy) 
    $DatabaseName = "sourceDatabaseName" 
    
    # The name of the server to host the database copy. This server must be in the same Azure subscription as the source database server
    $PartnerServerName = "partnerServerName"

    # The name of the target database (the name of the copy)
    $PartnerDatabaseName = "partnerDatabaseName" 


    Add-AzureAccount
    Select-AzureSubscription -SubscriptionName "myAzureSubscriptionName"
      
    # Copy a database to a different server (remove the -PartnerServer parameter to copy to the same server)
    Start-AzureSqlDatabaseCopy -ServerName $ServerName -DatabaseName $DatabaseName -PartnerServer $PartnerServerName -PartnerDatabase $PartnerDatabaseName
    
    # Monitor the status of the copy
    Get-AzureSqlDatabaseOperation -ServerName $ServerName -DatabaseName $DatabaseName
    

## Next steps

- [Connect with SQL Server Management Studio (SSMS)](sql-database-connect-to-database.md)
- [Export the database to a BACPAC](sql-database-export-powershell.md)


## Additional resources

- [Business Continuity Overview](sql-database-business-continuity.md)
- [Disaster Recovery Drills](sql-database-disaster-recovery-drills.md)
- [SQL Database documentation](https://azure.microsoft.com/documentation/services/sql-database/)
