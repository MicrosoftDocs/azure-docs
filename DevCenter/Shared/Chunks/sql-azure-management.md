  <h1>Managing SQL Azure Servers and Databases Using SQL Server Management Studio</h1>
  <p>You can use either the Windows Azure Management Portal for SQL Azure or the SQL Server Management Studio client application to administer your SQL Azure server and create and manage associated databases. This common task describes how to use SQL Server Management Studio to manage several aspects of a SQL Azure server and database. For information on how to use SQL Azure data connections in application code, see <a href="http://www.windowsazure.com/en-us/develop/net/how-to-guides/sql-azure/">How to Use SQL Azure</a>.</p>
  <p>
    <strong>Note:</strong> The steps described in this task apply to SQL Server Management Server 2008 R2 or later; not all functionality is supported in SQL Server Management Studio 2008 or earlier. See <a href="#Step1">Step 1: Get SQL Server Management Studio</a> for details about how to download the free SQL Server 2008 R2 Management Studio Express version.</p>
  <h2>How to Manage SQL Azure Servers and Databases</h2>
  <p>This task includes the following steps:</p>
  <ul>
    <li>
      <a href="#Step1">Step 1: Get SQL Server Management Studio</a>
    </li>
    <li>
      <a href="#Step2">Step 2: Connect to a SQL Azure server and SQL Azure database</a>
    </li>
    <li>
      <a href="#Step3">Step 3: Create and manage databases</a>
    </li>
    <li>
      <a href="#Step4">Step 4: Create and manage logins</a>
    </li>
    <li>
      <a href="#Step5">Step 5: Monitor a SQL Azure database Using Dynamic Management Views</a>
    </li>
  </ul>
  <h2>
    <a id="Step1" name="Step1">
    </a>Step 1: Get SQL Server Management Studio</h2>
  <p>SQL Server Management Studio (SSMS) is an integrated environment for managing SQL Server and SQL Azure databases. When managing SQL Azure databases, you can use an instance of SSMS that is installed as part of a SQL Server installation, or you can install the free SQL Server 2008 R2 Management Studio Express (SSMSE) version. The steps below describe how to install SSMSE.</p>
  <ol>
    <li>
      <p>From the <a href="http://www.microsoft.com/download/en/details.aspx?id=22985">Microsoft SQL Server 2008 R2 RTM - Management Studio Express</a> page on the Microsoft Download Center, select the version that corresponds with your operating system architecture and begin running the installer.</p>
    </li>
    <li>
      <p>In <strong>SQL Server Installation Center</strong>, select <strong>New installation or add features to an existing installation</strong>, as shown in the screenshot below, and click <strong>Next</strong>.</p>
      <p>
        <img src="/media/installer_installation_type.png" alt="SSMS Installer - Select installation type" />
      </p>
    </li>
    <li>
      <p>The <strong>SQL Server 2008 R2 Setup</strong> wizard will launch. If you already have SQL Server components installed on machine (for example, SQL Server Express, which is installed as part of the Windows Azure SDK all-in-one setup), you will see the Installation Type screen. If you do not have any existing SQL Server components installed on the screen, you can proceed to step 4. On the <strong>Installation Type</strong> screen, select <strong>New installation or add shared features to an existing instance of SQL Server</strong> and click <strong>Next</strong>.</p>
    </li>
    <li>
      <p>On the <strong>License Terms</strong> screen, accept the license terms and click <strong>Next</strong>.</p>
    </li>
    <li>
      <p>On the <strong>Feature Selection</strong> screen, select <strong>Management Tools - Basic</strong>, as shown in the screenshot below, and click <strong>Next</strong>.</p>
      <p>
        <img src="/media/installer_feature_selection.png" alt="SSMS Installer - Select features" />
      </p>
    </li>
    <li>
      <p>On the <strong>Error Reporting</strong> screen, you can optionally choose to send error reports to Microsoft. This is not required to use SSMSE. Click <strong>Next</strong>. This will begin the installation.</p>
    </li>
    <li>
      <p>When the installation is complete, you will see the <strong>Complete</strong> screen, as shown in the screenshot below. Click <strong>Close</strong> to close the installer.</p>
      <p>
        <img src="/media/installer_completed.png" alt="SSMS Installer - Installation complete" />
      </p>
    </li>
  </ol>
  <h2>
    <a id="Step2" name="Step2">
    </a>Step 2: Connect to a SQL Azure server and SQL Azure database</h2>
  <h3>Prerequisites</h3>
  <p>You must complete the following prerequisites in order to connect to SQL Azure servers from SSME.</p>
  <ul>
    <li>
      <p>In the Windows Azure Management Portal, retrieve the name of the server to which you want to connect.</p>
      <ol>
        <li>
          <p>Sign in to the <a href="http://windows.azure.com/">Management Portal</a>.</p>
        </li>
        <li>
          <p>In the left pane, click on <strong>Database</strong>.</p>
        </li>
        <li>
          <p>In the left pane, expand <strong>Subscriptions</strong> and click the subscription with which the server is associated.</p>
        </li>
        <li>
          <p>A list of all servers associated with the subscription will be displayed in the middle pane. Note the name of the server to which you want to connect. The screenshot below shows an example of servers associated with a subscription.</p>
          <p>
            <img src="/media/portal_get_database_name.png" alt="Get SQL Azure server name from Management Portal" />
          </p>
        </li>
      </ol>
    </li>
    <li>
      <p>Also in the Management Portal, configure your SQL Azure firewall to allow connections from your local machine by adding your local machines IP address to the firewall exception list.</p>
      <ol>
        <li>
          <p>At the top of the navigation pane, expand <strong>Subscriptions</strong>, expand your subscription, and then click the SQL Azure server to which you want to connect.</p>
        </li>
        <li>
          <p>In the middle pane, click <strong>Firewall Rules</strong>.</p>
        </li>
        <li>
          <p>Click <strong>Add</strong> to create another firewall rule.</p>
        </li>
        <li>
          <p>Enter a rule name, and an IP range, and then click <strong>OK</strong>. The rule name must be unique. The IP address of your computer is listed on the bottom of the dialog. If this is your development computer, you can enter the IP address in both the IP range start box and the IP range end box.</p>
        </li>
      </ol>
      <p>
        <strong>Note:</strong> There can be up as much as a five-minute delay for changes to the firewall settings to take effect.</p>
    </li>
  </ul>
  <h3>Connecting to a SQL Azure server and database through SSMS</h3>
  <ol>
    <li>
      <p>On the taskbar, click <strong>Start</strong>, point to <strong>All Programs</strong>, point to <strong>Microsoft SQL Server 2008 R2</strong>, and then click <strong>SQL Server Management Studio</strong> to open SSMS or SSMSE.</p>
    </li>
    <li>
      <p>In the <strong>Connect to Server</strong> dialog, specify the fully-qualified server name <em>serverName</em>.database.windows.net.</p>
    </li>
    <li>
      <p>Select <strong>SQL Server Authentication</strong>.</p>
    </li>
    <li>
      <p>In the <strong>Login</strong> box, enter the administrator login that you specified in the portal when creating your server in the format <em>login</em>@<em>yourServerName</em>.</p>
    </li>
    <li>
      <p>In the <strong>Password</strong> box, enter the password that you specified in the portal when creating your server.</p>
      <p>
        <img src="/media/ssms_connect.png" alt="Connect to SSMS" />
      </p>
    </li>
    <li>
      <p>Click the <strong>Options</strong> button to expand the connection options.</p>
    </li>
    <li>
      <p>When connecting to SQL Azure, you must establish a connection directly to a target database. In the <strong>Connect to Database</strong> dropdown, type <strong>master</strong>. When you create a server, the provisioning process also creates a database named <strong>master</strong>. This database is not billable, and it is used only to perform server-level administration for your server and all databases associated with it.</p>
      <p>
        <img src="/media/ssms_connect_properties.png" alt="Connect to SSMS -- properties" />
      </p>
    </li>
    <li>
      <p>Click <strong>Connect</strong> to establish the connection.</p>
    </li>
  </ol>
  <p>Your SQL Azure server is an abstraction that defines a grouping of databases. Databases associated with your SQL Azure server may reside on separate physical computers in a data center. You use the <strong>master</strong> database to perform server-level administration tasks that can encompass all databases associated with your server. The following steps will describe how to perform several common management tasks through the <strong>master</strong> database. Many of the SSMS wizards you can use for tasks like creating and modifying logins and databases on a SQL Server database are not available for SQL Azure databases, so you need to utilize Transact-SQL statements to accomplish these tasks. The steps below provide examples of these statements. For more information about using Transact-SQL with SQL Azure, including details about which commands are supported, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ee336281.aspx">Transact-SQL Reference (SQL Azure Database)</a>.</p>
  <h2>
    <a id="Step3" name="Step3">
    </a>Step 3: Create and Manage Databases</h2>
  <p>When you are connected to the <strong>master</strong> database, you can create new databases on the server and modify or drop existing databases. The steps below describe how to accomplish several common database management tasks through SSMS<strong>.</strong> They assume that you are connected to the <strong>master</strong> database with the server-level principal login that you created when you set up your server.</p>
  <ul>
    <li>
      <p>Use the <strong>CREATE DATABASE</strong> statement to create a new database. For complete details about this statement, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ee336274.aspx">CREATE DATABASE (SQL Azure Database)</a>. The statement below creates a new database named <strong>myTestDB</strong>, and specifies that it is a Business Edition database with a maximum size of 150 GB.</p>
      <pre class="prettyprint">CREATE DATABASE myTestDB
(MAXSIZE=150GB,
 EDITION='business');
</pre>
    </li>
    <li>
      <p>Use the <strong>ALTER DATABASE</strong> statement to modify an existing database, for example if you want to change the name, maximum size, or edition (business or web) of the database. For complete details about this statement, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ff394109.aspx">ALTER DATABASE (SQL Azure Database)</a>. The statement below modifies the database you created in the previous step to change the maximum size to 5 GB and change the edition to web.</p>
      <pre class="prettyprint">ALTER DATABASE myTestDB
MODIFY
(MAXSIZE=5GB,
 EDITION='web');
</pre>
    </li>
    <li>
      <p>Use <strong>the DROP DATABASE</strong> Statement to delete an existing database. For complete details about this statement, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ee336259.aspx">DROP DATABASE (SQL Azure Database)</a>. The statement below deletes the <strong>myTestDB</strong> database.</p>
      <pre class="prettyprint">DROP DATABASE myDataBase;
</pre>
    </li>
    <li>
      <p>The master database has the <strong>sys.databases</strong> view that you can use to view details about all databases. To view all existing databases, execute the following statement:</p>
      <pre class="prettyprint">SELECT * FROM sys.databases;
</pre>
    </li>
    <li>
      <p>In SQL Azure, the <strong>USE</strong> statement is not supported for switching between databases. Instead, you need to establish a connection directly to the target database.</p>
    </li>
  </ul>
  <p>NOTE: Many of the Transact-SQL statements that create or modify a database must be run within their own batch and cannot be grouped with other Transact-SQL statements. For more information, see the statement specific information available from the links listed above.</p>
  <h2>
    <a id="Step4" name="Step4">
    </a>Step 4: Create and Manage Logins</h2>
  <p>The master database keeps track of logins and which logins have permission to create databases or other logins. Manage logins by connecting to the <strong>master</strong> database with the server-level principal login that you created when you set up your server. You can use the <strong>CREATE LOGIN</strong>, <strong>ALTER LOGIN</strong>, or <strong>DROP LOGIN</strong> statements to execute queries against the master database that will manage logins across the entire server. For full details about how to manage logins in SQL Azure, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ee336235.aspx">Managing Databases and Logins in SQL Azure</a>. The steps below describe how to accomplish several common login management tasks through SSMS.</p>
  <ul>
    <li>
      <p>Use the <strong>CREATE LOGIN</strong> statement to create a new server-level login. For complete details about this statement, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ee336268.aspx">CREATE LOGIN (SQL Azure Database)</a>. The statement below creates a new login called <strong>login1</strong>. Replace <strong>password1</strong> with the password of your choice.</p>
      <pre class="prettyprint">CREATE LOGIN login1 WITH password='password1';
</pre>
    </li>
    <li>
      <p>Use the <strong>CREATE USER</strong> statement to grant database-level permissions. All logins must be created in the <strong>master</strong> database, but for a login to connect to a different SQL Azure database, you must grant it database-level permissions using the <strong>CREATE USER</strong> statement on that database. For complete details about this statement, see <a href="http://msdn.microsoft.com/en-us/library/ee336277.aspx">CREATE USER (SQL Azure Database)</a>. To give login1 permissions to a database called myTestDB, complete the following steps:</p>
      <ol>
        <li>
          <p>Connect to the myTestDB database in SQL Server Management Studio. On the <strong>File</strong> menu, select <strong>Connect Object Explorer</strong>. Then follow the instructions in <a href="#Step2">Step 2: Connect to a SQL Azure server and SQL Azure database</a> to connect to the database, replacing <strong>master</strong> with <strong>myTestDB</strong> when you specify the database to which you want to connect.</p>
        </li>
        <li>
          <p>Execute the following statement against the myTestDB database to create a database user named <strong>login1User</strong> that corresponds to the server-level login <strong>login1</strong>.</p>
          <pre class="prettyprint">CREATE USER login1User FROM LOGIN login1;
</pre>
        </li>
      </ol>
    </li>
    <li>
      <p>Use the <strong>sp_addrolemember</strong> stored procedure to give the user account the appropriate level of permissions on the database. For complete details about this stored procedure, see <a href="http://msdn.microsoft.com/en-us/library/ms187750.aspx">sp_addrolemember (Transact-SQL)</a>. The statement below gives <strong>login1User</strong> read-only permissions to the database by adding <strong>login1User</strong> to the <strong>db_datareader</strong> role.</p>
      <pre class="prettyprint">exec sp_addrolemember 'db_datareader', 'login1User';    
</pre>
    </li>
    <li>
      <p>Use the <strong>ALTER LOGIN</strong> statement to modify an existing login, for example if you want to change the password for the login. For complete details about this statement, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ee336254.aspx">ALTER LOGIN (SQL Azure Database)</a>. The <strong>ALTER LOGIN</strong> statement should be run against the <strong>master</strong> database. <a id="_GoBack" name="_GoBack"></a>The statement below modifies the <strong>login1</strong> login to reset the password. Replace <strong>newPassword</strong> with the password of your choice, and <strong>oldPassword</strong> with the current password for the login.</p>
      <pre class="prettyprint">ALTER LOGIN login1
WITH PASSWORD = 'newPassword'
OLD_PASSWORD = 'oldPassword';
</pre>
    </li>
    <li>
      <p>Use <strong>the DROP LOGIN</strong> statement to delete an existing login. Deleting a login at the server level also deletes any associated database user accounts. For complete details about this statement, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ee336259.aspx">DROP DATABASE (SQL Azure Database)</a>. The <strong>DROP LOGIN</strong> statement should be run against the <strong>master</strong> database. The statement below deletes the <strong>login1</strong> login.</p>
      <pre class="prettyprint">DROP LOGIN login1;
</pre>
    </li>
    <li>
      <p>The master database has the <strong>sys.sql_logins</strong> view that you can use to view logins. To view all existing logins, execute the following statement:</p>
      <pre class="prettyprint">SELECT * FROM sys.sql_logins;
</pre>
    </li>
  </ul>
  <h2>
    <a id="Step5" name="Step5">
    </a>Step 5: Monitor a SQL Azure database Using Dynamic Management Views</h2>
  <p>SQL Azure databases include several dynamic management views that you can use to monitor an individual database. Below are a few examples of the type of monitor data you can retrieve through these views. For complete details and more usage examples, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ff394114.aspx">Monitoring SQL Azure Using Dynamic Management Views</a>.</p>
  <ul>
    <li>
      <p>Querying a dynamic management view requires <strong>VIEW DATABASE STATE</strong> permissions. To grant the <strong>VIEW DATABASE STATE</strong> permission to a specific database user, connect to the database you want to manage with your server-level principle login and execute the following statement against the database:</p>
      <pre class="prettyprint">GRANT VIEW DATABASE STATE TO login1User;
</pre>
    </li>
    <li>
      <p>Calculate database size using the <strong>sys.dm_db_partition_stats</strong> view. The <strong>sys.dm_db_partition_stats</strong> view returns page and row-count information for every partition in the database, which you can use to calculate the database size. The following query returns the size of your database in megabytes:</p>
      <pre class="prettyprint">SELECT SUM(reserved_page_count)*8.0/1024
FROM sys.dm_db_partition_stats;   
</pre>
    </li>
    <li>
      <p>Use the <strong>sys.dm_exec_connections</strong> and <strong>sys.dm_exec_sessions</strong> views to retrieve information about current user connections and internal tasks associated with the database. The following query returns information about the current connection:</p>
      <pre class="prettyprint">SELECT
    e.connection_id,
    s.session_id,
    s.login_name,
    s.last_request_end_time,
    s.cpu_time
FROM
    sys.dm_exec_sessions s
    INNER JOIN sys.dm_exec_connections e
      ON s.session_id = e.session_id;
</pre>
    </li>
    <li>
      <p>Use the <strong>sys.dm_exec_query_stats</strong> view to retrieve aggregate performance statistics for cached query plans. The following query returns information about the top five queries ranked by average CPU time.</p>
      <pre class="prettyprint">SELECT TOP 5 query_stats.query_hash AS "Query Hash",
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
</pre>
    </li>
  </ul>
  <h2>Additional Resources</h2>
  <p>
    <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ee336230.aspx">Introducing SQL Azure Database</a>
    <br />
    <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ee336235.aspx">Managing Databases and Logins in SQL Azure</a>
    <br />
    <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ff394114.aspx">Monitoring SQL Azure Using Dynamic Management Views</a>
    <br />
    <a href="http://msdn.microsoft.com/en-us/library/ee336227.aspx">SQL Azure Provisioning Model</a>
    <br />
    <a href="http://blogs.msdn.com/b/sqlazure/archive/2010/06/21/10028038.aspx">Adding Users to your SQL Azure Database</a>
    <br />
    <a href="http://msdn.microsoft.com/en-us/library/windowsazure/ee336281.aspx">Transact-SQL Reference (SQL Azure Database)</a>
  </p>