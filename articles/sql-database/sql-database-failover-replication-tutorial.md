---
title: Replicate and failover your Azure SQL Database solution | Microsoft Docs
description: Learn to configure your Azure SQL Database and application for failover to a replicated database, and test failover.
services: sql-database
documentationcenter: ''
author: anosov1960
manager: jstrauss
editor: ''
tags: ''

ms.assetid: 
ms.service: sql-database
ms.custom: tutorial-failover
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: ''
ms.date: 04/18/2017
ms.author: sashan

---

# Replicate and failover an Azure SQL Database solution

In this tutorial, you configure an Azure SQL database and application for failover to a remote region, and then test your failover plan. 

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

To complete this tutorial, make sure you have:

- The newest version of [SQL Server Management Studio](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms) (SSMS). Installing SSMS also installs the newest version of SQLPackage, a command-line utility that can be used to automate a range of database development tasks. 
- An Azure database to migrate. This tutorial uses the AdventureWorksLT sample database with a name of **mySampleDatabase from one of these quick starts:

   - [Create DB - Portal](sql-database-get-started-portal.md)
   - [Create DB - CLI](sql-database-get-started-cli.md)

## Step 1: Deploy Java app

1. Download from ?
2. Deploy Java app
3. Perform reads and writes against database (Jan to write and provide steps to deploy / demonstrate use)

## Step 2: Create Azure Active Directory users (optional)

In this step, you create or identify Azure Active Directory users to add as users to your Azure SQL Database logical server and sample database.
- If your subscription is part of an Azure Active Directory corporate environment with existing user accounts, identify 3 user accounts to use as the Active Directory administrative user, the application administrative, and the application user for this tutorial and continue to Step 3: Create SQL Database logins and users. 
- If your subscription is not part of an Azure Active Directory corporate environment or is part of an Azure Active Directory corporate environment with no existing user accounts (and you have permission to create new Azure Active Directory user accounts.

1. Log in to the [Azure portal](http://portal.azure.com).
2. Click **More services** in the left hand menu.
3. In the filter text box, type **Azure** and then select **Azure Active Directory**.
4. In the **Quick tasks** pane on the **Azure Active Directory** page, click **Add a user**.
5. On the **User** form, create the following user.
   - Name: **ad-admin**
   - User name: **ad-admin@yourdomain** (Yopu4708)
6. Select the **Show Password** checkbox and record the password for this user account for later use .
7. Click **Create**.
8. Repeat the previous 3 steps to create the following 2 new users.
   - Name: **app-admin**
   - User name: **app-admin@yourdomain** (Buju4319)
   - Name: **app-user**
   - User name: **app-user@yourdomain**  (Nonu4001).

9. Open a new browser window and log in to the Azure portal using the newly created **ad-admin** account.
10. On the **Update your password** page, enter the system-generated password in the **Current password** box. 
11. In the **New password** and **Confirm password** boxes, enter a password of your choice.
12. Click **Update password and sign in**.

## Step 3: Configure SQL Database integration with Azure Active Directory

1. Click **More services** in the left hand menu., type **sql** in the filter text box, and then select **SQL servers**.
2. On the **SQL servers** page, click your SQL Database server.
3. In the Essentials pane of the **Overview** page for your server, click **Not configured** under **Active Directory admin**.
4. On the **Active Directory admin** page, click **Set admin**.
5. Select the **ad-admin** Azure Active Directory account (or other pre-existing account, such as your own account) to be the server admin for your Azure SQL Database server.
6. Click **Select**.
7. Click **Save**.

## Step 4: Create users with permissions for your database

Use SQL Server Management Studio to connect to your database and create user accounts. These user accounts will replicate automatically to your secondary server. You may need to configure a firewall rule if you are connecting from a client at an IP address for which you have not yet configured a firewall. For steps, see [Create SQL DB using the Azure portal](sql-database-get-started-portal.md).

1. Open SQL Server Management Studio.
2. Change the **Authentication** mode to **Active Directory Password Authentication**.
3. Connect to your server using the newly designed Azure Active Directory server admin account. 
4. In Object Explorer, expand **System Databases**, right-click **mySampleDatabase** and then click **New Query**.
5. In the query window, execute the following query to create an user accounts in your database, granting **db_owner** permissions to the two administrative accounts. Replace the placeholder for the domain name with your domain.

   ```tsql
   --Create Azure AD user account
   CREATE USER [app-admin@<yourdomain>] FROM EXTERNAL PROVIDER;
   --Add Azure AD user to db_owner role
   ALTER ROLE db_owner ADD MEMBER [app-admin@<yourdomain>]; 
   --Create additional Azure AD user account
   CREATE USER [app-user@<yourdomain>] FROM EXTERNAL PROVIDER;
   --Create SQL user account
   CREATE USER app_admin WITH PASSWORD = 'MyStrongPassword1';
   --Add SQL user to db_owner role
   ALTER ROLE db_owner ADD MEMBER app_admin; 
   --Create additional SQL user
   CREATE USER app_user WITH PASSWORD = 'MyStrongPassword1';
   ```

## Step 5: Create database-level firewall

Use SQL Server Management Studio to create a database-level firewall rule for your database. This database-level firewall rule will replicate automatically to your secondary server. For testing purposes, you can create a firewall rule for all IP addresses (0.0.0.0 and 255.255.255.255), can create a firewall rule for the single IP address with which you created the server-firewall rule, or you can configure one or more firewall rules for the IP addresses of the computers that you wish to use for testing of this tutorial.  

- In your open query window, replace the previous query with the following query, replacing the IP addresses with the appropriate IP addresses for your environment. 

   ```tsql
   -- Create database-level firewall setting for your publich IP address
   EXECUTE sp_set_database_firewall_rule N'mySampleDatabase','0.0.0.1','0.0.0.1';
   ```  

## Step 6: Create a failover group 
Choose a failover region, create an empty server in that region, and then create a failover group between your existing server and the new empty server.

1. Populate variables.

   ```powershell
   $secpasswd = ConvertTo-SecureString "yourstrongpassword" -AsPlainText -Force
   $mycreds = New-Object System.Management.Automation.PSCredential (“ServerAdmin”, $secpasswd)
   $myresourcegroup = "<your resource group>"
   $mylocation = "<resource group location>"
   $myserver = "<your existing server>"
   $mydatabase = "<your existing database>"
   $mydrlocation = "<your disaster recovery location>"
   $mydrserver = "<your disaster recovery server>"
   $myfailovergroup = "<your failover group"
   ```

2. Create an empty backup server in your failover region.

   ```powershell
   $mydrserver = New-AzureRmSqlServer -ResourceGroupName $myresourcegroup -Location $mydrlocation -ServerName $mydrserver -ServerVersion "12.0" -SqlAdministratorCredentials $mycreds
   ```

3. Create a failover group.

   ```powershell
   $myfailovergroup = New-AzureRMSqlDatabaseFailoverGroup –ResourceGroupName $myresourcegroup -ServerName "$myserver" -PartnerServerName $mydrserver  –FailoverGroupName $myfailovergroupname –FailoverPolicy "Automatic" -GracePeriodWithDataLossHours 2
   ```

4. Add your database to the failover group

   ```powershell
   $mydrserver | Add-AzureRMSqlDatabaseToFailoverGroup –FailoverGroupName $myfailovergroup  -Database $mydatabase
   ```

## Add empty backup server to domain

1. In the Azure portal, click **More services** in the left hand menu., type **sql** in the filter text box, and then select **SQL servers**.
2. On the **SQL servers** page, click your new SQL Database disaster recovery server.
3. In the Essentials pane of the **Overview** page for your server, click **Not configured** under **Active Directory admin**.
4. On the **Active Directory admin** page, click **Set admin**.
5. Select the **ad-admin** Azure Active Directory account (or other pre-existing account, such as your own account) to be the server admin for your new Azure SQL Database disaster recovery server.
6. Click **Select**.
7. Click **Save**.

## Manually fail over DB to secondary (Sasha to provide scripts / steps)
## Manually fail over app – Traffic Manager
##	Demonstrate success 
   - App
   - Users




## Step 1 - Prepare for migration

You are ready to prepare for migration. Follow these steps to use the **[Data Migration Assistant](https://www.microsoft.com/download/details.aspx?id=53595)** to assess the readiness of your database for migration to Azure SQL Database.

1. Open the **Data Migration Assistant**. You can run DMA on any computer with connectivity to the SQL Server instance containing the database that you plan to migrate, you do not need to install it on the computer hosting the SQL Server instance.

     ![open data migration assistant](./media/sql-database-migrate-your-sql-server-database/data-migration-assistant-open.png)

2. In the left-hand menu, click **+ New** to create an **Assessment** project. Fill in the form with a **Project name** (all other values should be left at their default values) and click **Create**. The **Options** page opens.

     ![new data migration assistant project](./media/sql-database-migrate-your-sql-server-database/data-migration-assistant-new-project.png)

3. On the **Options** page, click **Next**. The **Select sources** page opens.

     ![new data migration options](./media/sql-database-migrate-your-sql-server-database/data-migration-assistant-options.png) 

4. On the **Select sources** page, enter the name of SQL Server instance containing the server you plan to migrate. Change the other values on this page if necessary. Click **Connect**.

     ![new data migration select sources](./media/sql-database-migrate-your-sql-server-database/data-migration-assistant-sources.png)

5. In the **Add sources** portion of the **Select sources** page, select the checkboxes for the databases to be tested for compatibility. Click **Add**.

     ![new data migration select sources](./media/sql-database-migrate-your-sql-server-database/data-migration-assistant-sources-add.png)

6. Click **Start Assessment**.

     ![new data migration start assessment](./media/sql-database-migrate-your-sql-server-database/data-migration-assistant-start-assessment.png)

7. When the assessment completes, first look to see if the database is sufficiently compatible to migrate. Look for the checkmark in a green circle.

     ![new data migration assessment results compatible](./media/sql-database-migrate-your-sql-server-database/data-migration-assistant-assessment-results-compatible.png)

8. Review the results, beginning with **SQL Server feature parity**. Specifically review the information about unsupported and partially supported features, and the provided information about recommended actions. 

     ![new data migration assessment parity](./media/sql-database-migrate-your-sql-server-database/data-migration-assistant-assessment-results-parity.png)

9. Click **Compatibility issues**. Specifically review the information about migration blockers, behavior changes, and deprecated features for each compatibility level. For the AdventureWorks2008R2 database, review the changes to Full-Text Search since SQL Server 2008 and the changes to SERVERPROPERTY('LCID') since SQL Server 2000. For details on these changes, links for more information is provided. Many search options and settings for Full-Text Search have changed 

   > [!IMPORTANT] 
   > After you migrate your database to Azure SQL Database, you can choose to operate the database at its current compatibility level (level 100 for the AdventureWorks2008R2 database) or at a higher level. For more information on the implications and options for operating a database at a specific compatibility level, see [ALTER DATABASE Compatibility Level](https://docs.microsoft.com/sql/t-sql/statements/alter-database-transact-sql-compatibility-level). See also [ALTER DATABASE SCOPED CONFIGURATION](https://docs.microsoft.com/sql/t-sql/statements/alter-database-scoped-configuration-transact-sql) for information about additional database-level settings related to compatibility levels.
   >

10. Optionally, click **Export report** to save the report as a JSON file.
11. Close the Data Migration Assistant.

## Step 2 - Export to BACPAC file 

A BACPAC file is a ZIP file with an extension of BACPAC containing the metadata and data from a SQL Server database. A BACPAC file can be stored in Azure blob storage or in local storage for archiving or for migration - such as from SQL Server to Azure SQL Database. For an export to be transactionally consistent, you must ensure either that no write activity is occurring during the export.

Follow these steps to use the SQLPackage command-line utility to export the AdventureWorks2008R2 database to local storage.

1. Open a Windows command prompt and change your directory to a folder in which you have the **130** version of SQLPackage - such as **C:\Program Files (x86)\Microsoft SQL Server\130\DAC\bin**.

2. Execute the following SQLPackage command at the command prompt to export the **AdventureWorks2008R2** database from **localhost** to **AdventureWorks2008R2.bacpac**. Change any of these values as appropriate to your environment.

    ```SQLPackage
    sqlpackage.exe /Action:Export /ssn:localhost /sdn:AdventureWorks2008R2 /tf:AdventureWorks2008R2.bacpac
    ```

    ![sqlpackage export](./media/sql-database-migrate-your-sql-server-database/sqlpackage-export.png)

Once the execution is complete the generated BCPAC file is stored in the directory where the sqlpackage executable is located. In this example C:\Program Files (x86)\Microsoft SQL Server\130\DAC\bin. 

## Step 3: Log in to the Azure portal

Log in to the [Azure portal](https://portal.azure.com/). Logging on from the computer from which you are running the SQLPackage command-line utility eases the creation of the firewall rule in step 5.

## Step 4: Create a SQL Database logical server

An [Azure SQL Database logical server](sql-database-features.md) acts as a central administrative point for multiple databases. Follow these steps to create a SQL Database logical server to contain the migrated Adventure Works OLTP SQL Server database. 

1. Click the **New** button found on the upper left-hand corner of the Azure portal.

2. Type **server** in the search window on the **New** page, and select **SQL database (logical server)** from the filtered list.

    ![select logical server](./media/sql-database-migrate-your-sql-server-database/logical-server.png)

3. On the **Everything** page, click **SQL server (logical server)** and then click **Create** on the **SQL Server (logical server)** page.

    ![create logical server](./media/sql-database-migrate-your-sql-server-database/logical-server-create.png)

4. Fill out the SQL server (logical server) form with the following information, as shown on the preceding image:     

   - Server name: Specify a globally unique server name
   - Server admin login: Provide a name for the Server admin login
   - Password: Specify the password of your choice
   - Resource group: Select **Create new** and specify **myResourceGroup**
   - Location: Select a data center location

    ![create logical server completed form](./media/sql-database-migrate-your-sql-server-database/logical-server-create-completed.png)

5. Click **Create** to provision the logical server. Provisioning takes a few minutes. 

## Step 5: Create a server-level firewall rule

The SQL Database service creates a [firewall at the server-level](sql-database-firewall-configure.md) that prevents external applications and tools from connecting to the server or any databases on the server unless a firewall rule is created to open the firewall for specific IP addresses. Follow these steps to create a SQL Database server-level firewall rule for the IP address of the computer from which you are running the SQLPackage command-line utility. This enables SQLPackage to connect to the SQL Database logical server through the Azure SQL Database firewall. 

1. Click **All resources** from the left-hand menu and click your new server on the **All resources** page. The overview page for your server opens, showing you the fully qualified server name (such as **mynewserver20170403.database.windows.net**) and provides options for further configuration.

     ![logical server overview](./media/sql-database-migrate-your-sql-server-database/logical-server-overview.png)

2. Click **Firewall** in the left-hand menu under **Settings** on the overview page. The **Firewall settings** page for the SQL Database server opens. 

3. Click **Add client IP** on the toolbar to add the IP address of the computer you are currently using and then click **Save**. A server-level firewall rule is created for this IP address.

     ![set server firewall rule](./media/sql-database-migrate-your-sql-server-database/server-firewall-rule-set.png)

4. Click **OK**.

You can now connect to all databases on this server using SQL Server Management Studio or another tool of your choice from this IP address using the server admin account created previously.

> [!NOTE]
> SQL Database communicates over port 1433. If you are trying to connect from within a corporate network, outbound traffic over port 1433 may not be allowed by your network's firewall. If so, you will not be able to connect to your Azure SQL Database server unless your IT department opens port 1433.
>

## Step 6 - Import BACPAC file to Azure SQL Database 

The newest versions of the SQLPackage command-line utility provide support for creating an Azure SQL database at a specified [service tier and performance level](sql-database-service-tiers.md). For best performance during import, select a high service tier and performance level and then scale down after import if the service tier and performance level is higher than you need immediately.

Follow these steps use the SQLPackage command-line utility to import the AdventureWorks2008R2 database to Azure SQL Database.

- Execute the following SQLPackage command at the command prompt to import the **AdventureWorks2008R2** database from local storage to the Azure SQL Database logical server that you previously created with a database name of **myMigratedDatabase**, a service tier of **Premium**, and a Service Objective of **P6**. Change any of these three values as appropriate to your environment.

    ```
    SqlPackage.exe /a:import /tcs:"Data Source=mynewserver20170403.database.windows.net;Initial Catalog=myMigratedDatabase;User Id=<change_to_your_admin_user_account>;Password=<change_to_your_password>" /sf:AdventureWorks2008R2.bacpac /p:DatabaseEdition=Premium /p:DatabaseServiceObjective=P6
    ```

   ![sqlpackage import](./media/sql-database-migrate-your-sql-server-database/sqlpackage-import.png)

> [!IMPORTANT]
> An Azure SQL Database logical server listens on port 1433. If you are attempting to connect to an Azure SQL Database logical server from within a corporate firewall, this port must be open in the corporate firewall for you to successfully connect.
>

## Step 7 - Connect using SQL Server Management Studio (SSMS)

Use SQL Server Management Studio to establish a connection to your Azure SQL Database server and newly migrated database. If you are running SQL Server Management Studio on a different computer from which you ran SQLPackage, create a firewall rule for this computer using the steps in the previous procedure.

1. Open SQL Server Management Studio.

2. In the **Connect to Server** dialog box, enter the following information:
   - **Server type**: Specify Database engine
   - **Server name**: Enter your fully qualified server name, such as **mynewserver20170403.database.windows.net**
   - **Authentication**: Specify SQL Server Authentication
   - **Login**: Enter your server admin account
   - **Password**: Enter the password for your server admin account
 
    ![connect with ssms](./media/sql-database-migrate-your-sql-server-database/connect-ssms.png)

3. Click **Connect**. The Object Explorer window opens. 

4. In Object Explorer, expand **Databases** and then expand **myMigratedDatabase** to view the objects in the sample database.

## Step 8 - Change database properties

You can change the service tier, performance level, and compatibility level using SQL Server Management Studio.

1. In Object Explorer, right-click **myMigratedDatabase** and click **New Query**. A query window opens connected to your database.

2. Execute the following command to set the service tier to **Standard** and the performance level to **S1**.

    ```
    ALTER DATABASE myMigratedDatabase 
    MODIFY 
        (
        EDITION = 'Standard'
        , MAXSIZE = 250 GB
        , SERVICE_OBJECTIVE = 'S1'
    );
    ```

    ![change service tier](./media/sql-database-migrate-your-sql-server-database/service-tier.png)

3. Execute the following command to change the database compatibility level to **130**.

    ```
    ALTER DATABASE myMigratedDatabase  
    SET COMPATIBILITY_LEVEL = 130;
    ```

   ![change compatibility level](./media/sql-database-migrate-your-sql-server-database/compat-level.png)

## Next steps 

- For an overview of migration, see [Database migration](sql-database-cloud-migrate.md).
- For a discussion of T-SQL differences, see [Resolving Transact-SQL differences during migration to SQL Database](sql-database-transact-sql-information.md).
- To connect and query using Visual Studio Code, see [Connect and query with Visual Studio Code](sql-database-connect-query-vscode.md).
- To connect and query using .NET, see [Connect and query with .NET](sql-database-connect-query-dotnet.md).
- To connect and query using PHP, see [Connect and query with PHP](sql-database-connect-query-php.md).
- To connect and query using Node.js, see [Connect and query with Node.js](sql-database-connect-query-nodejs.md).
- To connect and query using Java, see [Connect and query with Java](sql-database-connect-query-java.md).
- To connect and query using Python, see [Connect and query with Python](sql-database-connect-query-python.md).
- To connect and query using Ruby, see [Connect and query with Ruby](sql-database-connect-query-ruby.md).

