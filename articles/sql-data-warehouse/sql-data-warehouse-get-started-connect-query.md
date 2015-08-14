<properties
   pageTitle="Get started: Connect to SQL Data Warehouse | Microsoft Azure"
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
   ms.date="06/23/2015"
   ms.author="JRJ@BigBangData.co.uk;barbkess"/>
   
# Get Started: Connect to SQL Data Warehouse
This quick start article introduces you to connecting to and querying a provisioned instance of SQL Data Warehouse  with two different tools:

**Visual Studio** - Visual Studio's integrated code editor and debugger, SQL Server Data Tools (SSDT), is fully compatible with SQL DW, enabling you to easily connect to, query, and manage SQL Data Warehouse.  

> [AZURE.NOTE] SQL Data Warehouse requires at least SSDT Preview version 12.0.50623 or later

**sqlcmd** - sqlcmd is a commandline tool that offers simple connection and querying abilities.  

After completing this article you will have:

1. Installed and updated Visual Studio 2013
2. Created a connection to SQL Data Warehouse in SSDT
3. Executed queries against the SQL Data Warehouse database

>[AZURE.NOTE] It is assumed that you have either completed the provisioning guide or have a SQL Data Warehouse available. If you have not provisioned the SQL Data Warehouse then please refer back to the [provisioning quick start].

## Setting up Visual Studio for Development##
For development, the SQL Data Warehouse team recommends using Visual Studio 2013 or greater in combination with SQL Server Data Tools. The following will outline how to download and update Visual Studio 2013 if you do not already have a viable version of visual studio installed.

If you are looking for more information, general SSDT questions can be resolved using the [complete SSDT documentation](https://msdn.microsoft.com/library/azure/hh272686.aspx).

### Get Visual Studio 2013 ###
Head over to the Visual Studio 2013 website to download and install a copy of Visual Studio. Remember, for SQL Data Warehouse any of the free editions is more than adequate. Feel free to pick one that suits your needs

<a href="https://www.visualstudio.com/downloads/download-visual-studio-vs#DownloadFamilies_5" target="blank">Get Visual Studio 2013</a>

### Update Visual Studio 2013 ###
Already have Visual Studio 2013 installed? Great! To make sure it is up to date just perform the following steps. You can move on to the next step.

1. Open Visual Studio 2013
2. Choose the "Tools" menu and select "Extensions and Updates..."
3. Navigate through the tree control to "Updates" and "Product Updates"
4. If there is no update available then you can safely close the "Extensions and Updates" window and proceed to the next task in this quick start.

However, if an update exists for Visual Studio itself click on the Update button. This will initiate a download of the latest update for Visual Studio 2013.

Close the "Extensions and Updates" window and also close Visual Studio 2013 before proceeding.

5. Click on the "Run" button to install the latest update to Visual Studio 2013.

6. Agree to the license terms and click on the Install button accepting any User Account Control (UAC) prompts

7. Click the "Launch" button to complete the installation

This completes the update of Visual Studio 2013.

### Update SSDT 
> [AZURE.IMPORTANT] SQL Data Warehouse requires at least SSDT Preview version 12.0.50623 or later.

The SSDT engineers update their plugin very regularly with new features so you will find you have to update from time to time. Again this is a very simple process. To check if you need to update SSDT perform the following steps:

1. Open Visual Studio 2013.  
2. Choose the "Tools" menu and select "Extensions and Updates..."
3. Navigate through the tree control to "Updates" and "Product Updates"
4. If there is no update available then you can safely close the "Extensions and Updates" window and proceed to the next task in this quick start.

However, if an update exists called "Microsoft SQL Server Update for database tooling" click on the Update button.

This will initiate a download of the latest SSDT version. The image below shows the SSDTSetup.exe in Internet Explorer's Download Manager.

5. Click on the "Run" button to install the latest version of SSDT.

6. Agree to the license terms and click on the Install button

7. Click the "Close" button to complete the SSDT update

8. Close the "Extensions and Updates" window

You now have an up to date version of Visual Studio 2013 on your desktop with an up to date SSDT extension.

> [AZURE.NOTE] Currently we recommend the use of the [SSDT Preview for Visual Studio 2013 version 12.0.50623 or later](http://go.microsoft.com/fwlink/?LinkID=616714&clcid=0x409) 

## Connect with Visual Studio 2013
If you are running the desired version of Visual Studio you will be able to connect to the SQL Data Warehouse instance in two different ways:

### From Visual Studio
To make the connection all we need to is open the SQL Server Object Explorer and pass in the connection information

1. Open Visual Studio
2. Choose the "View" menu and select "SQL Server Object Explorer" from the drop down list

> [AZURE.NOTE] Ensure you choose the SQL Server Object Explorer and ***not*** the Server Explorer. The names sound similar but they are very different controls. They are located next to one another so please be careful and make certain you have selected the right one!

You can now see the SQL Server Object Explorer:


3. Click on the "Add Server" button on the SQL Server Object Explorer. This has been highlighted in the image below:

4. Populate the Connect to Server dialogue box with the values you chose when creating the logical server. Also, click the options button and specify the database that you are connecting to (your SQL Data Warehouse instance) before connecting.

Feel free to check the "Remember Password" tick box if you wish. It's a nice time saver but remember that this does enable anyone with physical access to your profile to execute queries using this account.

> [AZURE.NOTE] Remember that the server name needs to be fully qualified. Therefore your Server name value should follow this convention: ***ServerName***.database.windows.net where ***ServerName*** is the name you gave to your logical server.

Click Connect once you have completely filled in the credentials

You have now completed a connection and have registered your SQLDW Logical Server in the SQL Server Object Explorer.
    
### From the Azure Portal
Get to Visual Studio directly from the Azure Portal.

1. Sign into the [Azure Management Portal](http://manage.windowsazure.com/).
2. Select your desired SQL DW instance within the 'Browse' blade. 
3. At the top of your SQL DW blade select 'Open in Visual...'
4. If you have not configured your firewall with the IP of your client machine select 'Configure your firewall.'
	1. Enter a 'Rule Name,' 'Start IP,' and 'End IP.' 
	2. Click 'Save' at the top of the blade.   
5. Click 'Open in Visual Studio.' 
6. Visual Studio will open and you will be prompted for your credentials 
7. After entering your credentials and connecting, your server and DW instances will now appear in your SQL Server Object Explorer panel.  

## Connect to SQL Data Warehouse with sqlcmd

You can also connect to SQL DW with the [sqlcmd](https://msdn.microsoft.com/library/azure/ms162773.aspx) command prompt utility that is included with SQL Server or the [Microsoft Command Line Utilities 11 for SQL Server](http://go.microsoft.com/fwlink/?LinkId=321501). The sqlcmd utility lets you enter Transact-SQL statements, system procedures, and script files at the command prompt.

To connect to a specific instance of SQL DW when using sqlcmd you will need to open the command prompt and and enter *sqlcmd* followed by the connection string for your SQL DW database. The connection string will need to contain the following parameters:

+ **User (-U):** Server user in the form `<`User`>`@`<`Server Name`>`.database.windows.net
+ **Password (-P):** Password associated with User
+ **Server (-S):** Server in the form `<`Server Name`>`.database.windows.net
+ **Database (-D):** Database name 
+ **Enable Quoted Identifiers (-I):** Quoted identifiers must be enabled in order to connect to a SQL DW instance. 

Therefore to connect to a SQL DW instance, you would enter the following:

```
C:\>sqlcmd -U <User>@<Server Name>.database.windows.net -P <Password> -S <Server Name>.database.windows.net -d <Database> -I
```

After connection, you can issue any supported Transact-SQL statements against the instance. For example, the below statement leverages the [CREATE TABLE](https://msdn.microsoft.com/library/azure/dn268335.aspx) statement to create a new table

```
C:\>sqlcmd -U <User>@<Server Name>.database.windows.net -P <Password> -S <Server Name>.database.windows.net -d <Database> -I
1> CREATE TABLE table1 (Col1 int, Col2 varchar(20));
2> GO
3> QUIT
```
	
For additional information on sqlcmd refer to the [sqlcmd documentation](https://msdn.microsoft.com/library/azure/ms162773.aspx).

<!--NOTE: SQL DB does not support the -z/-Z parameters for changing users password with SQLCMD.  Do we support this? -->

## Executing Sample Queries ##

Now that we have registered our server let's go ahead and write a query.

1. Click on the user database in SSDT

2. Click on the New Query Button

   A new window has now opened

3. Write a query

	Type the following code into the query window:

	```
	SELECT  COUNT(*)
	FROM    sys.tables;
	```

4. Execute the query

	To execute the query click on the green arrow below or use the following shortcut `CTRL`+`SHIFT`+`F5`:

## Next steps ##
Now that you can connect and query try [loading sample data][] or [developing code][].

[loading sample data]: ./sql-data-warehouse-get-started-load-samples.md  
[developing code]: ./articles/sql-data-warehouse-overview-develop/

