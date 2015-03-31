<properties 
	pageTitle="How to Manage SQL Database" 
	description="Learn how to manage Azure SQL database." 
	headerExpose="" 
	footerExpose="" 
	authors="jeffgoll" 
	manager="jeffreyg" 
	editor="" 
	services="sql-database" 
	documentationCenter=""/>

<tags 
	ms.service="sql-database" 
	ms.workload="data-management" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="01/13/2015" 
	ms.author="jeffreyg"/>


# How to Manage SQL Database

This article shows you how to perform simple management tasks in Azure SQL Database. 

## How to: Connect to SQL Database in Azure using Management Studio

Management Studio is an administrative tool that lets you manage multiple SQL Server instances and servers in a single workspace. If you already have an on-premises SQL Server instance, you can open a connection to both the on-premises instance and a logical server on Azure to perform tasks side by side.

Management Studio includes features that are not currently available in the management portal, such as a syntax checker and the ability to save scripts and named queries for reuse. SQL Database is just a tabular data stream (TDS) endpoint. Any tools that work with TDS, including Management Studio, are valid for SQL Database operations. Scripts that you develop for on-premises server will run on a SQL Database logical server. 

In the following step, you'll use Management Studio to connect to a logical server on Azure. This step requires you to have SQL Server Management Studio version 2008 R2 or 2012. If you need help downloading or connecting to  Management Studio, see [Managing SQL Database using Management Studio][] on this site.

Before you can connect, it is sometimes necessary to create a firewall exception that allows outbound requests on port 1433 on your local system. Computers that are secure by default typically do not have port 1433 open. 

## Configure the firewall for an on-premises server

1. In Windows Firewall with Advanced Security, create a new outbound rule.

2. Choose **Port**, specify TCP 1433, specify **Allow the connection**, and be sure that the **Public** profile is selected.

3. Provide a meaningful name, such as *WindowsAzureSQLDatabase (tcp-out) port 1433*. 


## Connect to a logical server

1. In Management Studio, in Connect to Server, make sure that Database Engine is selected, then enter the logical server name in this format: *servername*.database.widnows.net

	You can also get the fully qualified server name in the management portal, on the server dashboard, in MANAGE URL.

2. In Authentication, choose **SQL Server Authentication** and then enter the administrator login that you created when you configured the logical server.

3. Click **Options**. 

4. In Connect to database, specify **master**.


## Connect to an on-premises server

1. In Management Studio, in Connect to Server, make sure that Database Engine is selected, then enter the name of a local instance in this format: *servername*\\*instancename*. If the server is local and a default instance, enter *localhost*.

2. In Authentication, choose **Windows Authentication** and then enter a Windows account that is a member of the sysadmin role.


## How to: Add logins and users to Azure SQL Database

After you deploy a database, you need to configure logins and assign permissions. In the next step, you’ll run two scripts.

For the first script, you'll connect to master and run a script that creates logins. Logins will be used to support read and write operations, and to delegate operational tasks, such as the ability to run system queries without ‘sa’ permissions.

The logins you create must be SQL Server authentication logins. If you already have ready-made scripts that use Windows user identities or claims identities, that script will not work on SQL Database.

The second script assigns database user permissions. For this script, you will connect to a database already loaded on Azure.

## Create logins

1. In Management Studio, connect to a logical server on Azure, expand the Databases folder, right-click **master**, and select **New Query**.

2. Use the following Transact-SQL statements to create logins. Replace the password with a valid password. Select each one individually, and then click **Execute**. Repeat for the remaining logins.

<div style="width:auto; height:auto; overflow:auto"><pre>
    -- run on master, execute each line separately
    -- use this login to manage other logins on this server
    CREATE LOGIN sqladmin WITH password='&lt;ProvidePassword&gt;'; 
    CREATE USER sqladmin FROM LOGIN sqladmin;
    EXEC sp_addrolemember 'loginmanager', 'sqladmin';

    -- use this login to create or copy a database
    CREATE LOGIN sqlops WITH password='&lt;ProvidePassword&gt;';
    CREATE USER sqlops FROM LOGIN sqlops;
    EXEC sp_addrolemember 'dbmanager', 'sqlops';
</pre></div>


## Create database users

1. Expand the Databases folder, right-click **school**, and select **New Query**.

2. Use the following Transact-SQL statements to add database users. Replace the password with a valid password. 

<div style="width:auto; height:auto; overflow:auto"><pre>
    -- run on a regular database, execute each line separately
    -- use this login for read operations
    CREATE LOGIN sqlreader WITH password='&lt;ProvidePassword&gt;';
    CREATE USER sqlreader FROM LOGIN sqlreader;
    EXEC sp_addrolemember 'db_datareader', 'sqlreader';

    -- use this login for write operations
    CREATE LOGIN sqlwriter WITH password='&lt;ProvidePassword&gt;';
    CREATE USER sqlwriter FROM LOGIN sqlwriter;
    EXEC sp_addrolemember 'db_datawriter', 'sqlwriter';

    -- grant DMV permissions on the school database to 'sqlops'
    GRANT VIEW DATABASE STATE to 'sqlops';
</pre></div>

## View and test logins

1. In a new query window, connect to **master** and execute the following statement: 

        SELECT * from sys.sql_logins;

2. In Management Studio, right click on **school** database and select **New Query**.

3. On the Query menu, point to **Connection**, and then click **Change Connection**.

4. Login as *sqlreader*.

5. Copy and try to run the following statement. You should get an error stating that the object does not exist.

        INSERT INTO dbo.StudentGrade (CourseID, StudentID, Grade)
        VALUES (1061, 30, 9);

6. Open a second query window and change the connection context to *sqlwriter*. The same query should now run successfully.

You have now created and tested several logins. For more information, see [Managing Databases and Logins in SQL Database][] and [Monitoring SQL Database Using Dynamic Management Views][].

[Managing Databases and Logins in SQL Database]: http://msdn.microsoft.com/library/windowsazure/ee336235.aspx
[Monitoring SQL Database Using Dynamic Management Views]: http://msdn.microsoft.com/library/windowsazure/ff394114.aspx
[Managing SQL Database using Management Studio]: http://www.windowsazure.com/develop/net/common-tasks/sql-azure-management/





