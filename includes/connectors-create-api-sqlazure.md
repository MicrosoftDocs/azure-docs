1. After you open your logic app in the Logic Apps Designer, 
in the search box, enter "sql server" as your filter. 

   The **SQL Server** connector works for 
   both SQL Server and Azure SQL Database. 

   ![Find "SQL Server" connector](./media/connectors-create-api-sqlazure/sql-server-connector.png)

2. Select either a SQL trigger or action, whichever applies.

3. If you didn't previously create any connections, 
   provide the details now for creating the SQL connection. 

   Your credentials are necessary for authorizing 
   your logic app to connect and access your SQL data. 
   The asterisk (*) identifies required values. 

   *Azure SQL Database*

   ![Create Azure SQL Database connection](./media/connectors-create-api-sqlazure/azure-sql-database-create-connection.png) 

   *On-premises SQL Server* 
   <br>
   To get these SQL Server-specific options, 
   first select **Connect via on-premise data gateway**.

   ![Create SQL Server connection](./media/connectors-create-api-sqlazure/sql-server-create-connection.png)

   | Property | Required | Example value | Details | 
   |----------|----------|---------------|---------| 
   | Connection Name | Yes | my-sql-connection | Create a name for your connection. |
   | SQL Server Name | Yes | my-sql-server | The name for your SQL server <p>For Azure SQL Database, select your server name from the list. <p>For SQL Server, you can get this name from the connection string where: <br>"Server=tcp:<*yourServerName*>.database.windows.net" |
   | SQL Database Name | Yes | my-sql-database | The name for your SQL database <p>For Azure SQL Database, select your database from the list, which appears only after you select your server. <p>For SQL Server, you can get this name from the connection string where: <br>"Initial Catalog=<*yourDatabaseName*>" |
   | Username | Yes | my-sql-username | The username used for creating your database <p>For Azure SQL Database, your user name appears in the Azure portal under the SQL Database properties. <p>For SQL Server, you can get this name from the connection string where: <br>"UserID=<*yourUserName*>" |
   | Password | Yes | my-sql-password | The password used for creating your database  <p>For Azure SQL Database, your user name appears in the Azure portal under the SQL Database properties. <p>For SQL Server, you can get this name from the connection string where: <br>"Password=<*yourPassword*>" | 
   | Connect via on-premise gateway | Only for on-premises SQL Server | | Select this option when connecting to SQL Server. | 
   | Authentication Type | No | Windows | Select the authentication type used by your SQL server. | 
   | Gateways | Only for on-premises SQL Server | myOnPremisesDataGateway | Select your on-premises data gateway, which automatically appears in this list if previously set up. See [Access on-premises data](../logic-apps/gateway-connection.md). | 
   |||| 
   
   After you're done, your connection details might look like this example:

   *Azure SQL Database*

   ![SQL Azure Database connection information](./media/connectors-create-api-sqlazure/azure-sql-database-connection-details.png) 

   *SQL Server*

   ![SQL Azure Database connection information](./media/connectors-create-api-sqlazure/sql-server-connection.png) 

4. When you're ready, choose **Create**. 

After you create your connection, continue with the other steps in your logic app.

 
   ![SQL Azure connection creation step](./media/connectors-create-api-sqlazure/table.png)

