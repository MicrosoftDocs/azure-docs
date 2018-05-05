1. After you open your logic app in the Logic Apps Designer, 
in the search box, enter "sql server" as your filter. 
Select either a SQL trigger or action, whichever applies. 
This example uses a trigger.

   The SQL Server connector works for 
   both SQL Server and Azure SQL Database. 

   ![Find "SQL Server" connector](./media/connectors-create-api-sqlazure/sql-server-trigger.png)

3. If you didn't previously create any SQL connections, 
   provide those connection details now. 
   
   The asterisks (*) identify required values. 
   Your credentials are necessary for authorizing 
   your logic app to connect and access your SQL data. 

   *Azure SQL Database*
   <br>
   Select your SQL server so that you can then select your database.

   ![Create Azure SQL Database connection](./media/connectors-create-api-sqlazure/azure-sql-database-create-connection.png) 

   *On-premises SQL Server* 
   <br>
   To get the SQL Server-specific options, 
   first select **Connect via on-premise data gateway**. 
   But, before you can select a gateway, you must have previously 
   [set up the on-premises data gateway](https://docs.microsoft.com/azure/logic-apps/logic-apps-gateway-connection).

   ![Create SQL Server connection](./media/connectors-create-api-sqlazure/sql-server-create-connection.png)

   | Property | Required | Value | Details | 
   |----------|----------|---------------|---------| 
   | Connection Name | Yes | <*my-sql-connection*> | Create a name for your connection. |
   | SQL Server Name | Yes | <*my-sql-server*> | The name for your SQL server <p>For Azure SQL Database, select your server name from the list. <p>For SQL Server, you can get this name from the connection string where: <br>"Server=tcp:<*yourServerName*>.database.windows.net" |
   | SQL Database Name | Yes | <*my-sql-database*>  | The name for your SQL database <p>For Azure SQL Database, select your database from the list, which appears only after you select your server. <p>For SQL Server, you can get this name from the connection string where: <br>"Initial Catalog=<*yourDatabaseName*>" |
   | Username | Yes | <*my-sql-username*> | The username used for creating your database <p>For Azure SQL Database, your user name appears in the Azure portal under the SQL Database properties. <p>For SQL Server, you can get this name from the connection string where: <br>"UserID=<*yourUserName*>" |
   | Password | Yes | <*my-sql-password*> | The password used for creating your database  <p>For Azure SQL Database, your user name appears in the Azure portal under the SQL Database properties. <p>For SQL Server, you can get this name from the connection string where: <br>"Password=<*yourPassword*>" | 
   | Connect via on-premise gateway | Only for on-premises SQL Server | | Select this option when connecting to SQL Server. | 
   | Authentication Type | No | Windows | Select the authentication type used by your SQL server. | 
   | Gateways | Only for on-premises SQL Server | myOnPremisesDataGateway | Select your on-premises data gateway, which automatically appears in this list if previously set up. See [Access on-premises data](https://docs.microsoft.com/azure/logic-apps/logic-apps-gateway-connection). | 
   |||| 

4. When you're done, choose **Create**. 

After you create your connection, continue with the other steps in your logic app, for example:

![SQL Azure connection creation step](./media/connectors-create-api-sqlazure/azure-sql-database-table.png)

