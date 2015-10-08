<properties
   pageTitle="Get started: Connect to Azure SQL Data Warehouse | Microsoft Azure"
   description="Get started with connecting to SQL Data Warehouse and running some queries."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="jrowlandjones"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="10/01/2015"
   ms.author="JRJ@BigBangData.co.uk;barbkess"/>

# Get started: Connect to Azure SQL Data Warehouse
This quick start article introduces you to connecting to and querying a provisioned instance of SQL Data Warehouse  with two different tools:

- **Visual Studio** - Visual Studio's integrated code editor and debugger, SQL Server Data Tools (SSDT), is fully compatible with SQL Data Warehouse, enabling you to easily connect to, query, and manage SQL Data Warehouse.  

> [AZURE.NOTE] SQL Data Warehouse requires at least SSDT Preview version 12.0.50623 or later.

- **sqlcmd** - sqlcmd is a command-line tool that offers simple connection and querying abilities.  

After completing this article you will have:

1. Installed and updated Visual Studio 2013.
2. Created a connection to SQL Data Warehouse in SSDT.
3. Executed queries against the SQL Data Warehouse database.

>[AZURE.NOTE] It is assumed that you have either completed the provisioning guide or have a SQL Data Warehouse available. If you have not provisioned the SQL Data Warehouse then please refer back to the [provisioning quick start](sql-data-warehouse-get-started-provision.md).

## Set up Visual Studio for development##
For development, the SQL Data Warehouse team recommends using Visual Studio 2013 or later in combination with SQL Server Data Tools. The following will outline how to download and update Visual Studio 2013 if you do not already have a viable version of Visual Studio installed.

If you are looking for more information, general SSDT questions can be resolved using the [complete SSDT documentation](https://msdn.microsoft.com/library/azure/hh272686.aspx).

### Get Visual Studio 2013 ###
Head over to the Visual Studio 2013 website to download and install a copy of Visual Studio. Remember, for SQL Data Warehouse any of the free editions is more than adequate. Feel free to pick one that suits your needs.

<a href="https://www.visualstudio.com/downloads/download-visual-studio-vs#DownloadFamilies_5" target="blank">Get Visual Studio 2013</a>

### Update Visual Studio 2013 ###
Already have Visual Studio 2013 installed? Great! To make sure it is up to date just perform the following steps. You can move on to the next step.

1. Open Visual Studio 2013.
2. Choose the **Tools** menu and select **Extensions and Updates**.
3. Navigate through the tree control to **Updates** and **Product Updates**.
4. If there is no update available then you can safely close the **Extensions and Updates** window and proceed to the next task in this quick start.

However, if an update exists for Visual Studio itself click the **Update** button. This will initiate a download of the latest update for Visual Studio 2013.

Close the **Extensions and Updates** window and also close Visual Studio 2013 before proceeding.

5. Click the **Run** button to install the latest update to Visual Studio 2013.

6. Agree to the license terms and click the **Install** button, accepting any User Account Control (UAC) prompts.

7. Click the **Launch** button to complete the installation.

This completes the update of Visual Studio 2013.

### Update SSDT
> [AZURE.IMPORTANT] SQL Data Warehouse requires at least SSDT Preview version 12.0.50623 or later.

The SSDT engineers update their plug-in very regularly with new features, so you will find you have to update from time to time. Again, this is a very simple process. To check if you need to update SSDT, perform the following steps:

1. Open Visual Studio 2013.  
2. Choose the **Tools** menu and then select **Extensions and Updates**.
3. Navigate through the tree control to **Updates** and **Product Updates**.
4. If there is no update available then you can safely close the **Extensions and Updates** window and proceed to the next task in this quick start.

However, if an update exists called "Microsoft SQL Server Update for database tooling," click the **Update** button. This will initiate a download of the latest SSDT version.

5. Click the **Run** button to install the latest version of SSDT.

6. Agree to the license terms and then click the **Install** button.

7. Click the **Close** button to complete the SSDT update.

8. Close the **Extensions and Updates** window.

You now have an up-to-date version of Visual Studio 2013 on your desktop with an up to date SSDT extension.

> [AZURE.NOTE] Currently we recommend the [SSDT Preview for Visual Studio 2013 version 12.0.50623 or later](http://go.microsoft.com/fwlink/?LinkID=616714&clcid=0x409).

## Connect with Visual Studio 2013
If you are running the desired version of Visual Studio you will be able to connect to the SQL Data Warehouse instance in two different ways.

### Connect from Visual Studio
To make the connection all we need to do is open the SQL Server Object Explorer and pass in the connection information.

1. Open Visual Studio.
2. Choose the **View** menu and then select **SQL Server Object Explorer** from the drop-down list.

> [AZURE.NOTE] Ensure you choose the SQL Server Object Explorer and *not* the Server Explorer. The names sound similar but they are very different controls. They are located next to one another, so please be careful and make certain you have selected the right one.

You can now see the SQL Server Object Explorer:


3. Click the **Add Server** button on the SQL Server Object Explorer.

4. Populate the **Connect to Server** dialog box with the values you chose when creating the logical server. Also, click the options button and specify the database that you are connecting to (your SQL Data Warehouse instance) before connecting.

Feel free to select the **Remember Password** box if you wish. It's a nice time saver, but remember that this does enable anyone with physical access to your profile to run queries using this account.

> [AZURE.NOTE] Remember that the server name needs to be fully qualified. Therefore your server name value should follow this convention: *ServerName*.database.windows.net, where *ServerName* is the name you gave to your logical server.

Click **Connect** after you have completely filled in the credentials.

You have now completed a connection and have registered your SQL Data Warehouse logical server in the SQL Server Object Explorer.

### Connect from the Azure portal
Get to Visual Studio directly from the Azure portal.

1. Sign in to the [Azure portal](http://manage.windowsazure.com/).
2. Select your desired SQL Data Warehouse instance within the **Browse** blade.
3. At the top of your SQL Data Warehouse blade select **Open in Visual**.
4. If you have not configured your firewall with the IP of your client machine, select **Configure your firewall**.

	a. Enter a **Rule Name**: **Start IP** and **End IP**.

	b. Click **Save** at the top of the blade.
5. Click **Open in Visual Studio**.
6. Visual Studio will open and you will be prompted for your credentials.
7. After entering your credentials and connecting, your server and Data Warehouse instances will now appear in your SQL Server Object Explorer panel.  

## Connect to SQL Data Warehouse with sqlcmd

You can also connect to SQL Data Warehouse with the [sqlcmd](https://msdn.microsoft.com/library/azure/ms162773.aspx) command prompt utility that is included with SQL Server or the [Microsoft Command Line Utilities 11 for SQL Server](http://go.microsoft.com/fwlink/?LinkId=321501). The sqlcmd utility lets you enter Transact-SQL statements, system procedures, and script files at the command prompt.

To connect to a specific instance of SQL Data Warehouse when using sqlcmd you will need to open the command prompt and enter **sqlcmd** followed by the connection string for your SQL Data Warehouse database. The connection string will need to contain the following parameters:

+ **User (-U):** Server user in the form `<`User`>`@`<`Server Name`>`.database.windows.net.
+ **Password (-P):** Password associated with the user.
+ **Server (-S):** Server in the form `<`Server Name`>`.database.windows.net.
+ **Database (-D):** Database name.
+ **Enable Quoted Identifiers (-I):** Quoted identifiers must be enabled in order to connect to a SQL Data Warehouse instance.

Therefore, to connect to a SQL Data Warehouse instance, you would enter the following:

```
C:\>sqlcmd -S <Server Name>.database.windows.net -d <Database> -U <User> -P <Password> -I
```

After connection, you can issue any supported Transact-SQL statements against the instance. For example, the following statement leverages the [CREATE TABLE](https://msdn.microsoft.com/library/azure/dn268335.aspx) statement to create a new table.

```
C:\>sqlcmd -S <Server Name>.database.windows.net -d <Database> -U <User> -P <Password> -I
1> CREATE TABLE table1 (Col1 int, Col2 varchar(20));
2> GO
3> QUIT
```

For additional information about sqlcmd refer to the [sqlcmd documentation](https://msdn.microsoft.com/library/azure/ms162773.aspx).

<!--NOTE: SQL DB does not support the -z/-Z parameters for changing users password with SQLCMD.  Do we support this? -->

## Run sample queries ##

Now that we have registered our server let's go ahead and write a query.

1. Click the user database in SSDT.

2. Click the **New Query** button. A new window opens.

3. Write a query. Type the following code into the query window:

	```
	SELECT  COUNT(*)
	FROM    sys.tables;
	```

4. Run the query.

	To run the query click the green arrow or use the following shortcut: `CTRL`+`SHIFT`+`F5`.

## Next steps ##
Now that you can connect and query try [loading sample data][].

[loading sample data]: ./sql-data-warehouse-get-started-load-samples.md  
[developing code]: ./articles/sql-data-warehouse-overview-develop/
