# Managing SQL Azure Servers and Databases Using SQL Server Management Studio

You can use either the Windows Azure Management Portal for SQL Azure or
the SQL Server Management Studio client application to administer your
SQL Azure server and create and manage associated databases. This common
task describes how to use SQL Server Management Studio to manage several
aspects of a SQL Azure server and database. For information on how to
use SQL Azure data connections in application code, see [How to Use SQL
Azure][].

**Note:** The steps described in this task apply to SQL Server
Management Server 2008 R2 or later; not all functionality is supported
in SQL Server Management Studio 2008 or earlier. See [Step 1: Get SQL
Server Management Studio][] for details about how to download the free
SQL Server 2008 R2 Management Studio Express version.

## How to Manage SQL Azure Servers and Databases

This task includes the following steps:

-   [Step 1: Get SQL Server Management Studio][]
-   [Step 2: Connect to a SQL Azure server and SQL Azure database][]
-   [Step 3: Create and manage databases][]
-   [Step 4: Create and manage logins][]
-   [Step 5: Monitor a SQL Azure database Using Dynamic Management
    Views][]

## <a id="Step1" name="Step1"> </a>Step 1: Get SQL Server Management Studio

SQL Server Management Studio (SSMS) is an integrated environment for
managing SQL Server and SQL Azure databases. When managing SQL Azure
databases, you can use an instance of SSMS that is installed as part of
a SQL Server installation, or you can install the free SQL Server 2008
R2 Management Studio Express (SSMSE) version. The steps below describe
how to install SSMSE.

1.  From the [Microsoft SQL Server 2008 R2 RTM - Management Studio
    Express][] page on the Microsoft Download Center, select the version
    that corresponds with your operating system architecture and begin
    running the installer.

2.  In **SQL Server Installation Center**, select **New installation or
    add features to an existing installation**, as shown in the
    screenshot below, and click **Next**.

    ![SSMS Installer - Select installation type][]

3.  The **SQL Server 2008 R2 Setup** wizard will launch. If you already
    have SQL Server components installed on machine (for example, SQL
    Server Express, which is installed as part of the Windows Azure SDK
    all-in-one setup), you will see the Installation Type screen. If you
    do not have any existing SQL Server components installed on the
    screen, you can proceed to step 4. On the **Installation Type**
    screen, select **New installation or add shared features to an
    existing instance of SQL Server** and click **Next**.

4.  On the **License Terms** screen, accept the license terms and click
    **Next**.

5.  On the **Feature Selection** screen, select **Management Tools -
    Basic**, as shown in the screenshot below, and click **Next**.

    ![SSMS Installer - Select features][]

6.  On the **Error Reporting** screen, you can optionally choose to send
    error reports to Microsoft. This is not required to use SSMSE. Click
    **Next**. This will begin the installation.

7.  When the installation is complete, you will see the **Complete**
    screen, as shown in the screenshot below. Click **Close** to close
    the installer.

    ![SSMS Installer - Installation complete][]

## <a id="Step2" name="Step2"> </a>Step 2: Connect to a SQL Azure server and SQL Azure database

### Prerequisites

You must complete the following prerequisites in order to connect to SQL
Azure servers from SSME.

-   In the Windows Azure Management Portal, retrieve the name of the
    server to which you want to connect.

    1.  Sign in to the [Management Portal][].

    2.  In the left pane, click on **Database**.

    3.  In the left pane, expand **Subscriptions** and click the
        subscription with which the server is associated.

    4.  A list of all servers associated with the subscription will be
        displayed in the middle pane. Note the name of the server to
        which you want to connect. The screenshot below shows an example
        of servers associated with a subscription.

        ![Get SQL Azure server name from Management Portal][]

-   Also in the Management Portal, configure your SQL Azure firewall to
    allow connections from your local machine by adding your local
    machines IP address to the firewall exception list.

    1.  At the top of the navigation pane, expand **Subscriptions**,
        expand your subscription, and then click the SQL Azure server to
        which you want to connect.

    2.  In the middle pane, click **Firewall Rules**.

    3.  Click **Add** to create another firewall rule.

    4.  Enter a rule name, and an IP range, and then click **OK**. The
        rule name must be unique. The IP address of your computer is
        listed on the bottom of the dialog. If this is your development
        computer, you can enter the IP address in both the IP range
        start box and the IP range end box.

    **Note:** There can be up as much as a five-minute delay for changes
    to the firewall settings to take effect.

### Connecting to a SQL Azure server and database through SSMS

1.  On the taskbar, click **Start**, point to **All Programs**, point to
    **Microsoft SQL Server 2008 R2**, and then click **SQL Server
    Management Studio** to open SSMS or SSMSE.

2.  In the **Connect to Server** dialog, specify the fully-qualified
    server name *serverName*.database.windows.net.

3.  Select **SQL Server Authentication**.

4.  In the **Login** box, enter the administrator login that you
    specified in the portal when creating your server in the format
    *login*@*yourServerName*.

5.  In the **Password** box, enter the password that you specified in
    the portal when creating your server.

    ![Connect to SSMS][]

6.  Click the **Options** button to expand the connection options.

7.  When connecting to SQL Azure, you must establish a connection
    directly to a target database. In the **Connect to Database**
    dropdown, type **master**. When you create a server, the
    provisioning process also creates a database named **master**. This
    database is not billable, and it is used only to perform
    server-level administration for your server and all databases
    associated with it.

    ![Connect to SSMS -- properties][]

8.  Click **Connect** to establish the connection.

Your SQL Azure server is an abstraction that defines a grouping of
databases. Databases associated with your SQL Azure server may reside on
separate physical computers in a data center. You use the **master**
database to perform server-level administration tasks that can encompass
all databases associated with your server. The following steps will
describe how to perform several common management tasks through the
**master** database. Many of the SSMS wizards you can use for tasks like
creating and modifying logins and databases on a SQL Server database are
not available for SQL Azure databases, so you need to utilize
Transact-SQL statements to accomplish these tasks. The steps below
provide examples of these statements. For more information about using
Transact-SQL with SQL Azure, including details about which commands are
supported, see [Transact-SQL Reference (SQL Azure Database)][].

## <a id="Step3" name="Step3"> </a>Step 3: Create and Manage Databases

When you are connected to the **master** database, you can create new
databases on the server and modify or drop existing databases. The steps
below describe how to accomplish several common database management
tasks through SSMS**.** They assume that you are connected to the
**master** database with the server-level principal login that you
created when you set up your server.

-   Use the **CREATE DATABASE** statement to create a new database. For
    complete details about this statement, see [CREATE DATABASE (SQL
    Azure Database)][]. The statement below creates a new database named
    **myTestDB**, and specifies that it is a Business Edition database
    with a maximum size of 150 GB.

        CREATE DATABASE myTestDB
        (MAXSIZE=150GB,
         EDITION='business');

-   Use the **ALTER DATABASE** statement to modify an existing database,
    for example if you want to change the name, maximum size, or edition
    (business or web) of the database. For complete details about this
    statement, see [ALTER DATABASE (SQL Azure Database)][]. The
    statement below modifies the database you created in the previous
    step to change the maximum size to 5 GB and change the edition to
    web.

        ALTER DATABASE myTestDB
        MODIFY
        (MAXSIZE=5GB,
         EDITION='web');

-   Use **the DROP DATABASE** Statement to delete an existing database.
    For complete details about this statement, see [DROP DATABASE (SQL
    Azure Database)][]. The statement below deletes the **myTestDB**
    database.

        DROP DATABASE myDataBase;

-   The master database has the **sys.databases** view that you can use
    to view details about all databases. To view all existing databases,
    execute the following statement:

        SELECT * FROM sys.databases;

-   In SQL Azure, the **USE** statement is not supported for switching
    between databases. Instead, you need to establish a connection
    directly to the target database.

NOTE: Many of the Transact-SQL statements that create or modify a
database must be run within their own batch and cannot be grouped with
other Transact-SQL statements. For more information, see the statement
specific information available from the links listed above.

## <a id="Step4" name="Step4"> </a>Step 4: Create and Manage Logins

The master database keeps track of logins and which logins have
permission to create databases or other logins. Manage logins by
connecting to the **master** database with the server-level principal
login that you created when you set up your server. You can use the
**CREATE LOGIN**, **ALTER LOGIN**, or **DROP LOGIN** statements to
execute queries against the master database that will manage logins
across the entire server. For full details about how to manage logins in
SQL Azure, see [Managing Databases and Logins in SQL Azure][]. The steps
below describe how to accomplish several common login management tasks
through SSMS.

-   Use the **CREATE LOGIN** statement to create a new server-level
    login. For complete details about this statement, see [CREATE LOGIN
    (SQL Azure Database)][]. The statement below creates a new login
    called **login1**. Replace **password1** with the password of your
    choice.

        CREATE LOGIN login1 WITH password='password1';

-   Use the **CREATE USER** statement to grant database-level
    permissions. All logins must be created in the **master** database,
    but for a login to connect to a different SQL Azure database, you
    must grant it database-level permissions using the **CREATE USER**
    statement on that database. For complete details about this
    statement, see [CREATE USER (SQL Azure Database)][]. To give login1
    permissions to a database called myTestDB, complete the following
    steps:

    1.  Connect to the myTestDB database in SQL Server Management
        Studio. On the **File** menu, select **Connect Object
        Explorer**. Then follow the instructions in [Step 2: Connect to
        a SQL Azure server and SQL Azure database][] to connect to the
        database, replacing **master** with **myTestDB** when you
        specify the database to which you want to connect.

    2.  Execute the following statement against the myTestDB database to
        create a database user named **login1User** that corresponds to
        the server-level login **login1**.

            CREATE USER login1User FROM LOGIN login1;

-   Use the **sp\_addrolemember** stored procedure to give the user
    account the appropriate level of permissions on the database. For
    complete details about this stored procedure, see [sp\_addrolemember
    (Transact-SQL)][]. The statement below gives **login1User**
    read-only permissions to the database by adding **login1User** to
    the **db\_datareader** role.

        exec sp_addrolemember 'db_datareader', 'login1User';    

-   Use the **ALTER LOGIN** statement to modify an existing login, for
    example if you want to change the password for the login. For
    complete details about this statement, see [ALTER LOGIN (SQL Azure
    Database)][]. The **ALTER LOGIN** statement should be run against
    the **master** database. <a id="_GoBack" name="_GoBack"></a>The
    statement below modifies the **login1** login to reset the password.
    Replace **newPassword** with the password of your choice, and
    **oldPassword** with the current password for the login.

        ALTER LOGIN login1
        WITH PASSWORD = 'newPassword'
        OLD_PASSWORD = 'oldPassword';

-   Use **the DROP LOGIN** statement to delete an existing login.
    Deleting a login at the server level also deletes any associated
    database user accounts. For complete details about this statement,
    see [DROP DATABASE (SQL Azure Database)][]. The **DROP LOGIN**
    statement should be run against the **master** database. The
    statement below deletes the **login1** login.

        DROP LOGIN login1;

-   The master database has the **sys.sql\_logins** view that you can
    use to view logins. To view all existing logins, execute the
    following statement:

        SELECT * FROM sys.sql_logins;

## <a id="Step5" name="Step5"> </a>Step 5: Monitor a SQL Azure database Using Dynamic Management Views

SQL Azure databases include several dynamic management views that you
can use to monitor an individual database. Below are a few examples of
the type of monitor data you can retrieve through these views. For
complete details and more usage examples, see [Monitoring SQL Azure
Using Dynamic Management Views][].

-   Querying a dynamic management view requires **VIEW DATABASE STATE**
    permissions. To grant the **VIEW DATABASE STATE** permission to a
    specific database user, connect to the database you want to manage
    with your server-level principle login and execute the following
    statement against the database:

        GRANT VIEW DATABASE STATE TO login1User;

-   Calculate database size using the **sys.dm\_db\_partition\_stats**
    view. The **sys.dm\_db\_partition\_stats** view returns page and
    row-count information for every partition in the database, which you
    can use to calculate the database size. The following query returns
    the size of your database in megabytes:

        SELECT SUM(reserved_page_count)*8.0/1024
        FROM sys.dm_db_partition_stats;   

-   Use the **sys.dm\_exec\_connections** and **sys.dm\_exec\_sessions**
    views to retrieve information about current user connections and
    internal tasks associated with the database. The following query
    returns information about the current connection:

        SELECT
            e.connection_id,
            s.session_id,
            s.login_name,
            s.last_request_end_time,
            s.cpu_time
        FROM
            sys.dm_exec_sessions s
            INNER JOIN sys.dm_exec_connections e
              ON s.session_id = e.session_id;

-   Use the **sys.dm\_exec\_query\_stats** view to retrieve aggregate
    performance statistics for cached query plans. The following query
    returns information about the top five queries ranked by average CPU
    time.

        SELECT TOP 5 query_stats.query_hash AS "Query Hash",
            SUM(query_stats.total_worker_time) SUM(query_stats.execution_count) AS "Avg CPU Time",
            MIN(query_stats.statement_text) AS "Statement Text"
        FROM
            (SELECT QS.*,
            SUBSTRING(ST.text, (QS.statement_start_offset/2) + 1,
            ((CASE statement_end_offset
                WHEN -1 THEN DATALENGTH(ST.text)
                ELSE QS.statement_end_offset END
                    - QS.statement_start_offset)/2) + 1) AS statement_text
             FROM sys.dm_exec_query_stats AS QS
             CROSS APPLY sys.dm_exec_sql_text(QS.sql_handle) as ST) as query_stats
        GROUP BY query_stats.query_hash
        ORDER BY 2 DESC;

## Additional Resources

[Introducing SQL Azure Database][]   
 [Managing Databases and Logins in SQL Azure][]   
 [Monitoring SQL Azure Using Dynamic Management Views][]   
 [SQL Azure Provisioning Model][]   
 [Adding Users to your SQL Azure Database][]   
 [Transact-SQL Reference (SQL Azure Database)][]

  [How to Use SQL Azure]: http://www.windowsazure.com/en-us/develop/net/how-to-guides/sql-azure/
  [Step 1: Get SQL Server Management Studio]: #Step1
  [Step 2: Connect to a SQL Azure server and SQL Azure database]: #Step2
  [Step 3: Create and manage databases]: #Step3
  [Step 4: Create and manage logins]: #Step4
  [Step 5: Monitor a SQL Azure database Using Dynamic Management Views]:
    #Step5
  [Microsoft SQL Server 2008 R2 RTM - Management Studio Express]: http://www.microsoft.com/download/en/details.aspx?id=22985
  [SSMS Installer - Select installation type]: /media/installer_installation_type.png
  [SSMS Installer - Select features]: /media/installer_feature_selection.png
  [SSMS Installer - Installation complete]: /media/installer_completed.png
  [Management Portal]: http://windows.azure.com/
  [Get SQL Azure server name from Management Portal]: /media/portal_get_database_name.png
  [Connect to SSMS]: /media/ssms_connect.png
  [Connect to SSMS -- properties]: /media/ssms_connect_properties.png
  [Transact-SQL Reference (SQL Azure Database)]: http://msdn.microsoft.com/en-us/library/windowsazure/ee336281.aspx
  [CREATE DATABASE (SQL Azure Database)]: http://msdn.microsoft.com/en-us/library/windowsazure/ee336274.aspx
  [ALTER DATABASE (SQL Azure Database)]: http://msdn.microsoft.com/en-us/library/windowsazure/ff394109.aspx
  [DROP DATABASE (SQL Azure Database)]: http://msdn.microsoft.com/en-us/library/windowsazure/ee336259.aspx
  [Managing Databases and Logins in SQL Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/ee336235.aspx
  [CREATE LOGIN (SQL Azure Database)]: http://msdn.microsoft.com/en-us/library/windowsazure/ee336268.aspx
  [CREATE USER (SQL Azure Database)]: http://msdn.microsoft.com/en-us/library/ee336277.aspx
  [sp\_addrolemember (Transact-SQL)]: http://msdn.microsoft.com/en-us/library/ms187750.aspx
  [ALTER LOGIN (SQL Azure Database)]: http://msdn.microsoft.com/en-us/library/windowsazure/ee336254.aspx
  [Monitoring SQL Azure Using Dynamic Management Views]: http://msdn.microsoft.com/en-us/library/windowsazure/ff394114.aspx
  [Introducing SQL Azure Database]: http://msdn.microsoft.com/en-us/library/windowsazure/ee336230.aspx
  [SQL Azure Provisioning Model]: http://msdn.microsoft.com/en-us/library/ee336227.aspx
  [Adding Users to your SQL Azure Database]: http://blogs.msdn.com/b/sqlazure/archive/2010/06/21/10028038.aspx
