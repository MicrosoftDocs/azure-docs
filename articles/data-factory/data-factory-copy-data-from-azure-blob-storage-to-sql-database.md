<properties
	pageTitle="Copy data from Blob Storage to SQL Database | Microsoft Azure"
	description="This tutorial shows you how to use Copy Activity in an Azure Data Factory pipeline to copy data from Blob storage to SQL database."
	Keywords="blob sql, blob storage, data copy"
	services="data-factory"
	documentationCenter=""
	authors="spelluru"
	manager="jhubbard"
	editor="monicar"/>

<tags
	ms.service="data-factory"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article" 
	ms.date="06/27/2016"
	ms.author="spelluru"/>

# Copy data from Blob Storage to SQL Database using Data Factory 
> [AZURE.SELECTOR]
- [Tutorial Overview](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md)
- [Using Data Factory Editor](data-factory-copy-activity-tutorial-using-azure-portal.md)
- [Using PowerShell](data-factory-copy-activity-tutorial-using-powershell.md)
- [Using Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md)
- [Using Copy Wizard](data-factory-copy-data-wizard-tutorial.md)

In this tutorial, you’ll create a data factory with a pipeline to copy data from Blob storage to SQL database.

The Copy Activity performs the data movement in Azure Data Factory and the activity is powered by a globally available service that can copy data between various data stores in a secure, reliable, and scalable way. See [Data Movement Activities](data-factory-data-movement-activities.md) article for details about the Copy Activity.  

> [AZURE.NOTE] For a detailed overview of the Data Factory service, see the [Introduction to Azure Data Factory][data-factory-introduction] article .

##Prerequisites for the tutorial
Before you begin this tutorial, you must have the following:

- **Azure subscription**.  If you don't have a subscription, you can create a free trial account in just a couple of minutes. See the [Free Trial][azure-free-trial] article for details.
- **Azure Storage Account**. You will use the blob storage as a **source** data store in this tutorial. if you don't have an Azure storage account, see the [Create a storage account][data-factory-create-storage] article for steps to create one.
- **Azure SQL Database**. You will use an Azure SQL database as a **destination** data store in this tutorial. If you don't have an Azure SQL database that you can use in the tutorial, See [How to create and configure an Azure SQL Database][data-factory-create-sql-database] to create one.
- **SQL Server 2012/2014 or Visual Studio 2013**. You will use SQL Server Management Studio or Visual Studio to create a sample database and to view the result data in the database.  

## Collect blob storage account name and key 
You will need the account name and account key of your Azure storage account to do this tutorial. Note down the **account name** and **account key** for your Azure storage account by following the  instructions below:

1. Login to the [Azure Portal][azure-portal].
2. Click **BROWSE** hub on the left and select **Storage Accounts**.
3. In the **Storage Accounts** blade, select the **Azure storage account** that you want to use in this tutorial.
4. In the **STORAGE** blade, click **KEYS** tile.
5. In the **Manage Keys** blade, click **copy** (image) button next to **STORAGE ACCOUNT NAME** text box and save/paste it somewhere (for example: in a text file).  
6. Repeat the previous step to copy or note down the **PRIMARY ACCESS KEY**.
7. Close all the blades by clicking **X**.

## Collect SQL server, database, user names
You will need the names of Azure SQL server, database, and user to do this tutorial. Note down names of **server**, **database**, and **user** for your Azure SQL database by following the instructions below:

1. In the **Azure Portal**, click **BROWSE** on the left and select **SQL databases**.
2. In the **SQL databases blade**, select the **database** that you want to use in this tutorial. Note down the **database name**.  
3. In the **SQL DATABASE** blade, click **PROPERTIES** tile.
4. Note down the values for **SERVER NAME** and **SERVER ADMIN LOGIN**.
5. Close all the blades by clicking **X**.

## Allow Azure services to access SQL server 
Ensure that **Allow access to Azure services** setting turned **ON** for your Azure SQL server so that the Data Factory service can access your Azure SQL server. To verify and turn this setting on, do the following:

1. Click **BROWSE** hub on the left and click **SQL servers**.
2. Select **your server**, and click **SETTINGS** on the **SQL SERVER** blade.
3. In the **SETTINGS** blade, click **Firewall**.
4. In the **Firewall settings** blade, click **ON** for **Allow access to Azure services**.
5. Close all the blades by clicking **X**.

## Prepare Blob Storage and  SQL Database 
Now, prepare your Azure blob storage and Azure SQL database for the tutorial by performing the following steps:  

1. Launch Notepad, paste the following text, and save it as **emp.txt** to **C:\ADFGetStarted** folder on your hard drive.

        John, Doe
		Jane, Doe

2. Use tools such as [Azure Storage Explorer](https://azurestorageexplorer.codeplex.com/) to create the **adftutorial** container and to upload the **emp.txt** file to the container.

    ![Azure Storage Explorer. Copy data from Blob storage to SQL database](./media/data-factory-copy-data-from-azure-blob-storage-to-sql-database/getstarted-storage-explorer.png)
3. Use the following SQL script to create the **emp** table in your Azure SQL Database.  


        CREATE TABLE dbo.emp
		(
			ID int IDENTITY(1,1) NOT NULL,
			FirstName varchar(50),
			LastName varchar(50),
		)
		GO

		CREATE CLUSTERED INDEX IX_emp_ID ON dbo.emp (ID);

	**If you have SQL Server 2012/2014 installed on your computer:** follow instructions from [Step 2: Connect to SQL Database of the Managing Azure SQL Database using SQL Server Management Studio][sql-management-studio] article to connect to your Azure SQL server and run the SQL script. Note that this article uses the [Azure Portal](http://manage.windowsazure.com), not the [Azure Portal](https://portal.azure.com), to configure firewall for an Azure SQL server.

	**If you have Visual Studio 2013 installed on your computer:** in the [Azure Portal](https://portal.azure.com), click **BROWSE** hub on the left, click **SQL servers**, select your database, and click **Open in Visual Studio** button on toolbar to connect to your Azure SQL server and run the script. If your client is not allowed to access the Azure SQL server, you will need to configure firewall for your Azure SQL server to allow access from your machine (IP Address). See the article above for steps to configure the firewall for your Azure SQL server.


Do the following:

- Click [Using Data Factory Editor](data-factory-copy-activity-tutorial-using-azure-portal.md) link at the top to perform the tutorial by using Data Factory Editor, which is part of the Azure Portal.
- Click [Using PowerShell](data-factory-copy-activity-tutorial-using-powershell.md) link at the top to perform the tutorial by using Azure PowerShell.
- Click [Using Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md) link at the top to perform the tutorial by using Visual Studio 2013.

## Copy Activity
See [Data Movement Activities](data-factory-data-movement-activities.md) article for detailed information about the Copy Activity in Azure Data Factory.  


<!--Link references-->
[azure-free-trial]: http://azure.microsoft.com/pricing/free-trial/
[azure-portal]: https://portal.azure.com/
[sql-management-studio]: http://azure.microsoft.com/documentation/articles/sql-database-manage-azure-ssms/#Step2

[data-factory-introduction]: data-factory-introduction.md
[data-factory-create-storage]: http://azure.microsoft.com/documentation/articles/storage-create-storage-account/#create-a-storage-account
[data-factory-create-sql-database]: ../sql-database/sql-database-get-started.md 
