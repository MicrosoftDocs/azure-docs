1. In the Azure portal or Visual Studio, 
open your logic app in the Logic Apps Designer. 
For this example, use the Azure portal.

2. In the search box, enter "sql server" as your filter. 
When the SQL Server connector appears, 
select either the trigger or action you want. 
For this example, select this trigger: 
**SQL Server - When an item is created** 

   ![Find "SQL Server" connector](./media/connectors-create-api-sqlazure/sql-server-trigger.png)

   The connector works for both SQL Server and Azure SQL Database. 

3. If you didn't already create any SQL connections, 
you're prompted to create the connection with these required details: 

   * A name for your connection
   * Your server name, database name, user name, and password
   * For on-premises SQL Server, the name for your on-premises data gateway. However, before you can select your gateway, 
   you must first [set up your data gateway](https://docs.microsoft.com/azure/logic-apps/logic-apps-gateway-connection). That way, your gateway appears in the gateways list 
   when you create your connection.

   In these images, the asterisks (*) indicate required values. 

   *Azure SQL Database*

   ![Create Azure SQL Database connection](./media/connectors-create-api-sqlazure/azure-sql-database-create-connection.png) 

   > [!TIP]
   > Can't find your database? First select your SQL server. 
   > You can then select your database.

   *SQL Server* 

   ![Create SQL Server connection](./media/connectors-create-api-sqlazure/sql-server-create-connection.png)

   > [!NOTE] 
   > To get the SQL Server options, first select 
   > **Connect via on-premise data gateway**. 

   | Property | Required | Value | Details | 
   |----------|----------|-------|---------| 
   | Connection Name | Yes | <*my-sql-connection*> | The name you provide for your connection |
   | SQL Server Name | Yes | <*my-sql-server*> | The name for your SQL server <br><p>- Azure SQL Database: Select your server name from the list. <p>- SQL Server: Find this value in your connection string: <p>"Server=<*yourServerAddress*>" |
   | SQL Database Name | Yes | <*my-sql-database*>  | The name for your SQL database <br><p>- Azure SQL Database: Select your database from the list, which appears only after you select your server. <p>- SQL Server: Find this value in your connection string: <p>"Database=<*yourDatabaseName*>" |
   | Username | Yes | <*my-sql-username*> | The username for accessing your database <br><p>- Azure SQL Database: Find this value in the Azure portal under the SQL database properties or in your connection string: <p>"User ID=<*yourUserName*>" <p>- SQL Server: Find this value in your connection string: <p>"UserId=<*yourUserName*>" |
   | Password | Yes | <*my-sql-password*> | The password for accessing your database  <br><p>- Azure SQL Database: Find this value in the Azure portal under the SQL database properties or in your connection string: <p>"Password=<*yourPassword*>" <p>- SQL Server: Find this value in your connection string: <p>"Password=<*yourPassword*>" | 
   | Connect via on-premise gateway | Only for SQL Server | | Select this option when connecting to SQL Server. | 
   | Authentication Type | No | Windows | Select the authentication type used by your SQL server. | 
   | Gateways | Only for SQL Server | <*my-data-gateway*> | Select your on-premises data gateway. If your gateway doesn't appear in the list, check that you correctly [set up your gateway](https://docs.microsoft.com/azure/logic-apps/logic-apps-gateway-connection). | 
   ||||| 

4. When you're done, choose **Create**. 

After you create your connection, continue with the 
other steps in your logic app. For example, you can now 
select the table that you want your logic app to check:

![Select table](./media/connectors-create-api-sqlazure/azure-sql-database-table.png)
