1. In the Azure portal or Visual Studio, 
open your logic app in the Logic Apps Designer. 

   This example uses the Azure portal.

2. In the search box, enter "sql server" as your filter. 
When the SQL Server connector appears, 
select either the trigger or action that you want. 

   This example uses a trigger. 

   ![Find "SQL Server" connector](./media/connectors-create-api-sqlazure/sql-server-trigger.png)

   The connector works for both SQL Server and Azure SQL Database. 

3. If you didn't create any SQL connections already, 
you're prompted to create the connection with these required details: 

   * A name for your connection
   * Your server name, database name, user name, and password
   * For on-premises SQL Server, the name for your on-premises data gateway. 
   But, before you can select your gateway, you must first 
   [set up the data gateway](https://docs.microsoft.com/azure/logic-apps/logic-apps-gateway-connection).

   The asterisks (*) indicate required values. 

   *Azure SQL Database*

   ![Create Azure SQL Database connection](./media/connectors-create-api-sqlazure/azure-sql-database-create-connection.png) 

   > [!TIP]
   > Select your SQL server first, then you can select your database.

   *SQL Server* 
   <br>
   To get the SQL Server options, first select 
   **Connect via on-premise data gateway**. 

   ![Create SQL Server connection](./media/connectors-create-api-sqlazure/sql-server-create-connection.png)

   | Property | Required | Value | Details | 
   |----------|----------|-------|---------| 
   | Connection Name | Yes | <*my-sql-connection*> | The name you provide for your connection |
   | SQL Server Name | Yes | <*my-sql-server*> | The name for your SQL server <p>- Azure SQL Database: Select your server name from the list. <p>- SQL Server: Find this value in your connection string: <br>"Server=<*yourServerAddress*>" |
   | SQL Database Name | Yes | <*my-sql-database*>  | The name for your SQL database <p>- Azure SQL Database: Select your database from the list, which appears only after you select your server. <p>- SQL Server: Find this value in your connection string: <br>"Database=<*yourDatabaseName*>" |
   | Username | Yes | <*my-sql-username*> | The username for accessing your database <p>- Azure SQL Database: Find this value in the Azure portal under the SQL database properties or in your connection string: <br>"User ID=<*yourUserName*>" <p>- SQL Server: Find this value in your connection string: <br>"UserId=<*yourUserName*>" |
   | Password | Yes | <*my-sql-password*> | The password for accessing your database  <p>- Azure SQL Database: Find this value in the Azure portal under the SQL database properties or in your connection string: <br>"Password=<*yourPassword*>" <p>- SQL Server: Find this value in your connection string: <br>"Password=<*yourPassword*>" | 
   | Connect via on-premise gateway | Only for SQL Server | | Select this option when connecting to SQL Server. | 
   | Authentication Type | No | Windows | Select the authentication type used by your SQL server. | 
   | Gateways | Only for SQL Server | <*my-data-gateway*> | Select your on-premises data gateway. If your gateway doesn't appear in the list, check that you correctly [set up your gateway](https://docs.microsoft.com/azure/logic-apps/logic-apps-gateway-connection). | 
   ||||| 

4. When you're done, choose **Create**. 

After you create your connection, continue with the 
other steps in your logic app. For example, you can now 
select the table that you want your logic app to check:

![Select table](./media/connectors-create-api-sqlazure/azure-sql-database-table.png)
