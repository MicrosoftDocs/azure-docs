<properties 
	pageTitle="XEvent Event File code for SQL Database | Microsoft Azure" 
	description="Provides PowerShell and Transact-SQL for a two-phase code sample that demonstrates the Event File target in an extended event on Azure SQL Database. Azure Storage is a required part of this scenario." 
	services="sql-database" 
	documentationCenter="" 
	authors="MightyPen" 
	manager="jhubbard" 
	editor="" 
	tags=""/>


<tags 
	ms.service="sql-database" 
	ms.workload="data-management" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/24/2016" 
	ms.author="genemi"/>


# Event File target code for extended events in SQL Database

[AZURE.INCLUDE [sql-database-xevents-selectors-1-include](../../includes/sql-database-xevents-selectors-1-include.md)]

You want a complete code sample for a robust way to capture and report information for an extended event.


In Microsoft SQL Server the [Event File target](http://msdn.microsoft.com/library/ff878115.aspx) is used to store event outputs into a local hard drive file. But such files are not available to Azure SQL Database. Instead we use the Azure Storage service to support the Event File target.


This topic presents a two-phase code sample:


- PowerShell, to create an Azure Storage container in the cloud.

- Transact-SQL:
 - To assign the Azure Storage container to an Event File target.
 - To create and start the event session, and so on.


## Prerequisites


- An Azure account and subscription. You can sign up for a [free trial](https://azure.microsoft.com/pricing/free-trial/).


- Any database you can create a table in.
 - Optionally you can [create an **AdventureWorksLT** demonstration database](sql-database-get-started.md) in minutes.


- SQL Server Management Studio (ssms.exe), its August 2015 Preview or a later version. 
You can download the latest ssms.exe from:
 - Topic titled [Download SQL Server Management Studio](http://msdn.microsoft.com/library/mt238290.aspx).
 - [A direct link to the download.](http://go.microsoft.com/fwlink/?linkid=616025)
 - Microsoft recommends that you update your ssms.exe periodically. In some cases ssms.exe will be updated monthly.


- You must have the [Azure PowerShell modules](http://go.microsoft.com/?linkid=9811175) installed.
 - The modules provide commands such as - **New-AzureStorageAccount**.


## Phase 1: PowerShell code for Azure Storage container


This PowerShell is phase 1 of the two-phase code sample.

The script starts with commands to clean-up after a possible previous run, and is designed to be rerunnable.



1. Paste the PowerShell script into a simple text editor such as Notepad.exe, and save the script as a file with the extension **.ps1**.

2. Start PowerShell ISE as an Administrator.

3. At the prompt, type<br/>`Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope CurrentUser`<br/>and then press Enter.

4. In PowerShell ISE, open your **.ps1** file. Run the script.

5. The script first starts a new window in which you log in to Azure.
 - If you rerun the script without disrupting your session, you have the convenient option of commenting out the **Add-AzureAccount** command.


![PowerShell ISE, with Azure module installed, ready to run script.][30_powershell_ise]


&nbsp;


```
## TODO: Before running, find all 'TODO' and make each edit!!

#--------------- 1 -----------------------


# You can comment out or skip this Add-AzureAccount
# command after the first run.
# Current PowerShell environment retains the successful outcome.

'Expect a pop-up window in which you log in to Azure.'


Add-AzureAccount

#-------------- 2 ------------------------


'
TODO: Edit the values assigned to these variables, especially the first few!
'

# Ensure the current date is between
# the Expiry and Start time values that you edit here.

$subscriptionName    = 'YOUR_SUBSCRIPTION_NAME'
$policySasExpiryTime = '2016-01-28T23:44:56Z'
$policySasStartTime  = '2015-08-01'


$storageAccountName     = 'gmstorageaccountxevent'
$storageAccountLocation = 'West US'
$contextName            = 'gmcontext'
$containerName          = 'gmcontainerxevent'
$policySasToken         = 'gmpolicysastoken'


# Leave this value alone, as 'rwl'.
$policySasPermission = 'rwl'

#--------------- 3 -----------------------


# The ending display lists your Azure subscriptions.
# One should match the $subscriptionName value you assigned
#   earlier in this PowerShell script. 

'Choose an existing subscription for the current PowerShell environment.'


Select-AzureSubscription -SubscriptionName $subscriptionName


#-------------- 4 ------------------------


'
Clean-up the old Azure Storage Account after any previous run, 
before continuing this new run.'


If ($storageAccountName)
{
    Remove-AzureStorageAccount -StorageAccountName $storageAccountName
}

#--------------- 5 -----------------------

[System.DateTime]::Now.ToString()

'
Create a storage account. 
This might take several minutes, will beep when ready.
  ...PLEASE WAIT...'

New-AzureStorageAccount `
    -StorageAccountName $storageAccountName `
    -Location           $storageAccountLocation

[System.DateTime]::Now.ToString()

[System.Media.SystemSounds]::Beep.Play()


'
Get the primary access key for your storage account.
'


$primaryAccessKey_ForStorageAccount = `
    (Get-AzureStorageKey `
        -StorageAccountName $storageAccountName).Primary

"`$primaryAccessKey_ForStorageAccount = $primaryAccessKey_ForStorageAccount"

'Azure Storage Account cmdlet completed.
Remainder of PowerShell .ps1 script continues.
'

#--------------- 6 -----------------------


# The context will be needed to create a container within the storage account.

'Create a context object from the storage account and its primary access key.
'

$context = New-AzureStorageContext `
    -StorageAccountName $storageAccountName `
    -StorageAccountKey  $primaryAccessKey_ForStorageAccount


'Create a container within the storage account.
'


$containerObjectInStorageAccount = New-AzureStorageContainer `
    -Name    $containerName `
    -Context $context


'Create a security policy to be applied to the SAS token.
'

New-AzureStorageContainerStoredAccessPolicy `
    -Container  $containerName `
    -Context    $context `
    -Policy     $policySasToken `
    -Permission $policySasPermission `
    -ExpiryTime $policySasExpiryTime `
    -StartTime  $policySasStartTime 

'
Generate a SAS token for the container.
'
Try
{
    $sasTokenWithPolicy = New-AzureStorageContainerSASToken `
        -Name    $containerName `
        -Context $context `
        -Policy  $policySasToken
}
Catch 
{
    $Error[0].Exception.ToString()
}

#-------------- 7 ------------------------


'Display the values that YOU must edit into the Transact-SQL script next!:
'

"storageAccountName: $storageAccountName"
"containerName:      $containerName"
"sasTokenWithPolicy: $sasTokenWithPolicy"

'
REMINDER: sasTokenWithPolicy here might start with "?" character, which you must exclude from Transact-SQL.
'

'
(Later, return here to delete your Azure Storage account. See the preceding - Remove-AzureStorageAccount -StorageAccountName $storageAccountName)'

'
Now shift to the Transact-SQL portion of the two-part code sample!'

# EOFile
```


&nbsp;


Take note of the few named values that the PowerShell script prints when it ends. You must edit those values into the Transact-SQL script that follows as phase 2.


## Phase 2: Transact-SQL code that uses Azure Storage container


- In phase 1 of this code sample you ran a PowerShell script to create an Azure Storage container.
- Next in phase 2, the following Transact-SQL script must use the container.


The script starts with commands to clean-up after a possible previous run, and is designed to be rerunnable.


The PowerShell script printed a few named values when it ended. You must edit the Transact-SQL script to use those values. Find **TODO** in the Transact-SQL script to locate the edit points.


1. Open SQL Server Management Studio (ssms.exe).

2. Connect to your Azure SQL Database database.

3. Click to open a new query pane.

4. Paste the following Transact-SQL script into the query pane.

5. Find every **TODO** in the script and make the appropriate edits.

6. Save, and then run the script.


&nbsp;


> [AZURE.WARNING] The SAS key value generated by the preceding PowerShell script might begin with a '?' (question mark). When you use the SAS key in the following T-SQL script, you must *remove the leading '?'*. Otherwise your efforts might be blocked by security.


&nbsp;


```
---- TODO: First, run the PowerShell portion of this two-part code sample.
---- TODO: Second, find every 'TODO' in this Transact-SQL file, and edit each.

---- Transact-SQL code for Event File target on Azure SQL Database.


SET NOCOUNT ON;
GO


----  Step 1.  Establish one little table, and  ---------
----  insert one row of data.


IF EXISTS
	(SELECT * FROM sys.objects
		WHERE type = 'U' and name = 'gmTabEmployee')
BEGIN
	DROP TABLE gmTabEmployee;
END
GO


CREATE TABLE gmTabEmployee
(
	EmployeeGuid         uniqueIdentifier   not null  default newid()  primary key,
	EmployeeId           int                not null  identity(1,1),
	EmployeeKudosCount   int                not null  default 0,
	EmployeeDescr        nvarchar(256)          null
);
GO


INSERT INTO gmTabEmployee ( EmployeeDescr )
	VALUES ( 'Jane Doe' );
GO


------  Step 2.  Create key, and  ------------
------  Create credential (your Azure Storage container must already exist).


IF NOT EXISTS
	(SELECT * FROM sys.symmetric_keys
		WHERE symmetric_key_id = 101)
BEGIN
	CREATE MASTER KEY ENCRYPTION BY PASSWORD = '0C34C960-6621-4682-A123-C7EA08E3FC46' -- Or any newid().
END
GO


IF EXISTS
	(SELECT * FROM sys.database_scoped_credentials
		-- TODO: Assign AzureStorageAccount name, and the associated Container name.
		WHERE name = 'https://gmstorageaccountxevent.blob.core.windows.net/gmcontainerxevent')
BEGIN
	DROP DATABASE SCOPED CREDENTIAL
		-- TODO: Assign AzureStorageAccount name, and the associated Container name.
		[https://gmstorageaccountxevent.blob.core.windows.net/gmcontainerxevent] ;
END
GO


CREATE
	DATABASE SCOPED
	CREDENTIAL
		-- use '.blob.',   and not '.queue.' or '.table.' etc.
		-- TODO: Assign AzureStorageAccount name, and the associated Container name.
		[https://gmstorageaccountxevent.blob.core.windows.net/gmcontainerxevent]
	WITH
		IDENTITY = 'SHARED ACCESS SIGNATURE',  -- "SAS" token.
		-- TODO: Paste in the long SasToken string here for Secret, but exclude any leading '?'.
		SECRET = 'sv=2014-02-14&sr=c&si=gmpolicysastoken&sig=EjAqjo6Nu5xMLEZEkMkLbeF7TD9v1J8DNB2t8gOKTts%3D'
	;
GO


------  Step 3.  Create (define) an event session.  --------
------  The event session has an event with an action,
------  and a has a target.

IF EXISTS
	(SELECT * from sys.database_event_sessions
		WHERE name = 'gmeventsessionname240b')
BEGIN
	DROP
		EVENT SESSION
			gmeventsessionname240b
	    ON DATABASE;
END
GO


CREATE
	EVENT SESSION
		gmeventsessionname240b
	ON DATABASE

	ADD EVENT
		sqlserver.sql_statement_starting
			(
			ACTION (sqlserver.sql_text)
			WHERE statement LIKE 'UPDATE gmTabEmployee%'
			)
	ADD TARGET
		package0.event_file
			(
			-- TODO: Assign AzureStorageAccount name, and the associated Container name.
			-- Also, tweak the .xel file name at end, if you like.
			SET filename =
				'https://gmstorageaccountxevent.blob.core.windows.net/gmcontainerxevent/anyfilenamexel242b.xel'
			)
	WITH
		(MAX_MEMORY = 10 MB,
		MAX_DISPATCH_LATENCY = 3 SECONDS)
	;
GO


------  Step 4.  Start the event session.  ----------------
------  Issue the SQL Update statements that will be traced.
------  Then stop the session.

------  Note: If the target fails to attach,
------  the session must be stopped and restarted.

ALTER
	EVENT SESSION
		gmeventsessionname240b
	ON DATABASE
	STATE = START;
GO


SELECT 'BEFORE_Updates', EmployeeKudosCount, * FROM gmTabEmployee;

UPDATE gmTabEmployee
	SET EmployeeKudosCount = EmployeeKudosCount + 2
	WHERE EmployeeDescr = 'Jane Doe';

UPDATE gmTabEmployee
	SET EmployeeKudosCount = EmployeeKudosCount + 13
	WHERE EmployeeDescr = 'Jane Doe';

SELECT 'AFTER__Updates', EmployeeKudosCount, * FROM gmTabEmployee;
GO


ALTER
	EVENT SESSION
		gmeventsessionname240b
	ON DATABASE
	STATE = STOP;
GO


-------------- Step 5.  Select the results. ----------

SELECT
		*, 'CLICK_NEXT_CELL_TO_BROWSE_ITS_RESULTS!' as [CLICK_NEXT_CELL_TO_BROWSE_ITS_RESULTS],
		CAST(event_data AS XML) AS [event_data_XML]  -- TODO: In ssms.exe results grid, double-click this cell!
	FROM
		sys.fn_xe_file_target_read_file
			(
				-- TODO: Fill in Storage Account name, and the associated Container name.
				'https://gmstorageaccountxevent.blob.core.windows.net/gmcontainerxevent/anyfilenamexel242b',
				null, null, null
			);
GO


-------------- Step 6.  Clean up. ----------

DROP
	EVENT SESSION
		gmeventsessionname240b
	ON DATABASE;
GO

DROP DATABASE SCOPED CREDENTIAL
	-- TODO: Assign AzureStorageAccount name, and the associated Container name.
	[https://gmstorageaccountxevent.blob.core.windows.net/gmcontainerxevent]
	;
GO

DROP TABLE gmTabEmployee;
GO

PRINT 'Use PowerShell Remove-AzureStorageAccount to delete your Azure Storage account!';
GO
```


&nbsp;


If the target fails to attach when you run, you must stop and restart the event session:


```
ALTER EVENT SESSION ... STATE = STOP;
GO
ALTER EVENT SESSION ... STATE = START;
GO
```


&nbsp;


## Output


When the Transact-SQL script completes, click a cell under the **event_data_XML** column header. One **<event>** element is displayed which shows one UPDATE statement.

Here is one **<event>** element that was generated during testing:


&nbsp;


```
<event name="sql_statement_starting" package="sqlserver" timestamp="2015-09-22T19:18:45.420Z">
  <data name="state">
    <value>0</value>
    <text>Normal</text>
  </data>
  <data name="line_number">
    <value>5</value>
  </data>
  <data name="offset">
    <value>148</value>
  </data>
  <data name="offset_end">
    <value>368</value>
  </data>
  <data name="statement">
    <value>UPDATE gmTabEmployee
    SET EmployeeKudosCount = EmployeeKudosCount + 2
    WHERE EmployeeDescr = 'Jane Doe'</value>
  </data>
  <action name="sql_text" package="sqlserver">
    <value>

SELECT 'BEFORE_Updates', EmployeeKudosCount, * FROM gmTabEmployee;

UPDATE gmTabEmployee
    SET EmployeeKudosCount = EmployeeKudosCount + 2
    WHERE EmployeeDescr = 'Jane Doe';

UPDATE gmTabEmployee
    SET EmployeeKudosCount = EmployeeKudosCount + 13
    WHERE EmployeeDescr = 'Jane Doe';

SELECT 'AFTER__Updates', EmployeeKudosCount, * FROM gmTabEmployee;
</value>
  </action>
</event>
```

&nbsp;


The preceding Transact-SQL script used the following system function to read the event_file:

- [sys.fn_xe_file_target_read_file (Transact-SQL)](http://msdn.microsoft.com/library/cc280743.aspx)


An explanation of advanced options for the viewing of data from extended events is available at:

- [Advanced Viewing of Target Data from Extended Events](http://msdn.microsoft.com/library/mt752502.aspx)

&nbsp;


## Converting the code sample to run on SQL Server


Suppose you wanted to run the preceding Transact-SQL sample on Microsoft SQL Server.


- For simplicity you would want to completely replace use of the Azure Storage container with a simple file such as **C:\myeventdata.xel**. The file would be written to the local hard drive of the computer that hosts SQL Server.


- You would not need the any kind of Transact-SQL statements for **CREATE MASTER KEY** and **CREATE CREDENTIAL**.


- In the **CREATE EVENT SESSION** statement, in its **ADD TARGET** clause, you would replace the Http value assigned made to **filename=** with a full path string like **C:\myfile.xel**.
 - No Azure Storage account need be involved.


## More information


For more info about accounts and containers in the Azure Storage service, see:

- [How to use Blob storage from .NET](../storage/storage-dotnet-how-to-use-blobs.md)
- [Naming and Referencing Containers, Blobs, and Metadata](http://msdn.microsoft.com/library/azure/dd135715.aspx)
- [Working with the Root Container](http://msdn.microsoft.com/library/azure/ee395424.aspx)
- [Lesson 1: Create a stored access policy and a shared access signature on an Azure container](http://msdn.microsoft.com/library/dn466430.aspx)
    - [Lesson 2: Create a SQL Server credential using a shared access signature](http://msdn.microsoft.com/library/dn466435.aspx)




<!--
Image references.
-->

[30_powershell_ise]: ./media/sql-database-xevent-code-event-file/event-file-powershell-ise-b30.png

