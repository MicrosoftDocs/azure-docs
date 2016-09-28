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
	ms.date="09/26/2016"
	ms.author="spelluru"/>

# Copy data from Blob Storage to SQL Database using Data Factory 
> [AZURE.SELECTOR]
- [Overview and prerequisites](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md)
- [Azure portal](data-factory-copy-activity-tutorial-using-azure-portal.md)
- [Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md)
- [PowerShell](data-factory-copy-activity-tutorial-using-powershell.md)
- [REST API](data-factory-copy-activity-tutorial-using-rest-api.md)
- [.NET API](data-factory-copy-activity-tutorial-using-dotnet-api.md)
- [Copy Wizard](data-factory-copy-data-wizard-tutorial.md)

In this tutorial, you create a data factory with a pipeline to copy data from Blob storage to SQL database.

The Copy Activity performs the data movement in Azure Data Factory. It is powered by a globally available service that can copy data between various data stores in a secure, reliable, and scalable way. See [Data Movement Activities](data-factory-data-movement-activities.md) article for details about the Copy Activity.  

> [AZURE.NOTE] For a detailed overview of the Data Factory service, see the [Introduction to Azure Data Factory](data-factory-introduction.md) article.

##Prerequisites for the tutorial
Before you begin this tutorial, you must have the following:

- **Azure subscription**.  If you don't have a subscription, you can create a free trial account in just a couple of minutes. See the [Free Trial](http://azure.microsoft.com/pricing/free-trial/) article for details.
- **Azure Storage Account**. You use the blob storage as a **source** data store in this tutorial. if you don't have an Azure storage account, see the [Create a storage account](../storage/storage-create-storage-account.md#create-a-storage-account) article for steps to create one.
- **Azure SQL Database**. You use an Azure SQL database as a **destination** data store in this tutorial. If you don't have an Azure SQL database that you can use in the tutorial, See [How to create and configure an Azure SQL Database](../sql-database/sql-database-get-started.md) to create one.
- **SQL Server 2012/2014 or Visual Studio 2013**. You use SQL Server Management Studio or Visual Studio to create a sample database and to view the result data in the database.  

## Collect blob storage account name and key 
You need the account name and account key of your Azure storage account to do this tutorial. Note down **account name** and **account key** for your Azure storage account.

1. Log in to the [Azure portal](https://portal.azure.com/).
2. Click **More services** on the left menu and select **Storage Accounts**.

	![Browse - Storage accounts](media\data-factory-copy-data-from-azure-blob-storage-to-sql-database\browse-storage-accounts.png)
3. In the **Storage Accounts** blade, select the **Azure storage account** that you want to use in this tutorial.
4. Select **Access keys** link under **SETTINGS**.
5.  Click **copy** (image) button next to **Storage account name** text box and save/paste it somewhere (for example: in a text file).
6. Repeat the previous step to copy or note down the **key1**.
	
	![Storage access key](media\data-factory-copy-data-from-azure-blob-storage-to-sql-database\storage-access-key.png)
7. Close all the blades by clicking **X**.

## Collect SQL server, database, user names
You need the names of Azure SQL server, database, and user to do this tutorial. Note down names of **server**, **database**, and **user** for your Azure SQL database.

1. In the **Azure portal**, click **More services** on the left and select **SQL databases**.
2. In the **SQL databases blade**, select the **database** that you want to use in this tutorial. Note down the **database name**.  
3. In the **SQL database** blade, click **Properties** under **SETTINGS**.
4. Note down the values for **SERVER NAME** and **SERVER ADMIN LOGIN**.
5. Close all the blades by clicking **X**.

## Allow Azure services to access SQL server 
Ensure that **Allow access to Azure services** setting turned **ON** for your Azure SQL server so that the Data Factory service can access your Azure SQL server. To verify and turn on this setting, do the following steps:

1. Click **More services** hub on the left and click **SQL servers**.
2. Select your server, and click **Firewall** under **SETTINGS**. 
4. In the **Firewall settings** blade, click **ON** for **Allow access to Azure services**.
5. Close all the blades by clicking **X**.

## Prepare Blob Storage and SQL Database 
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

	**If you have SQL Server 2012/2014 installed on your computer:** follow instructions from [Step 2: Connect to SQL Database of the Managing Azure SQL Database using SQL Server Management Studio](../sql-database/sql-database-manage-azure-ssms.md#Step2) article to connect to your Azure SQL server and run the SQL script. This article uses the [classic Azure portal](http://manage.windowsazure.com), not the [new Azure portal](https://portal.azure.com), to configure firewall for an Azure SQL server.

	If your client is not allowed to access the Azure SQL server, you need to configure firewall for your Azure SQL server to allow access from your machine (IP Address). See [this article](../sql-database/sql-database-configure-firewall-settings.md) for steps to configure the firewall for your Azure SQL server.

You have completed the prerequisites. You can create a data factory using one of the following ways. Click one of the tabs at the top or the following links to perform the tutorial.     

- [Azure portal](data-factory-copy-activity-tutorial-using-azure-portal.md)
- [Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md)
- [PowerShell](data-factory-copy-activity-tutorial-using-powershell.md)
- [REST API](data-factory-copy-activity-tutorial-using-rest-api.md)
- [.NET API](data-factory-copy-activity-tutorial-using-dotnet-api.md)
- [Copy Wizard](data-factory-copy-data-wizard-tutorial.md)
