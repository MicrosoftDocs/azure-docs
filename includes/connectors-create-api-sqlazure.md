---
 title: include file
 description: include file
 services: logic-apps
 author: ecfan
 ms.service: logic-apps
 ms.topic: include
 ms.date: 05/14/2018
 ms.author: estfan
 ms.custom: include file
---

1. In the Azure portal or Visual Studio, 
open your logic app in the Logic Apps Designer. 
For this example, use the Azure portal.

2. In the search box, enter "sql server" as your filter. 
When the SQL Server connector appears, 
select either the trigger or action you want. 

   The connector works for both SQL Server and Azure SQL Database. 
   This example uses this trigger: 
   **SQL Server - When an item is created** 

   ![Find "SQL Server" connector](./media/connectors-create-api-sqlazure/sql-server-trigger.png)

Now, follow the steps for either Azure SQL Database or [SQL Server](#connect-sql-server).

### Connect to Azure SQL Database

1. If you didn't already create any SQL connections, 
follow these steps when prompted for connection details, 
for example: 

   ![Create Azure SQL Database connection](./media/connectors-create-api-sqlazure/azure-sql-database-create-connection.png)
   <br>
   Asterisks (*) indicate required values.

   | Property | Value | Details | 
   |----------|-------|---------| 
   | Connection Name | <*my-sql-connection*> | The name you provide for your connection | 
   | SQL Server Name | <*my-sql-server*> | The name for your SQL server <p>Select your SQL server first. You can then select your database. |
   | SQL Database Name | <*my-sql-database*>  | The name for your SQL database <p> Your database doesn't appear until after you select your server. | 
   | Username | <*my-sql-username*> | The user name for accessing your database, which you can find in the Azure portal under the SQL database properties or in your connection string: <p>"User ID=<*yourUserName*>" |
   | Password | <*my-sql-password*> | The password for accessing your database, which you can find in the Azure portal under the SQL database properties or in your connection string: <p>   "Password=<*yourPassword*>" | 
   |||| 

2. When you're done, choose **Create**.

After you create your connection, continue with the 
other steps in your logic app. For example, you can now 
select the table that you want your logic app to check:

![Select table](./media/connectors-create-api-sqlazure/azure-sql-database-table.png)

<a name="connect-sql-server"></a>

### Connect to SQL Server

Before you can select your gateway, make sure that you already 
[set up your data gateway](https://docs.microsoft.com/azure/logic-apps/logic-apps-gateway-connection). 
That way, your gateway appears in the gateways list when you create your connection.

1. If you didn't already create any SQL connections, 
follow these steps when prompted for connection details.

2. In the trigger or action, select **Connect via on-premise data gateway** 
so that the SQL server options appear.

   ![Create SQL Server connection](./media/connectors-create-api-sqlazure/sql-server-create-connection.png)
   <br>
   Asterisks (*) indicate required values.

   | Property | Value | Details | 
   |----------|-------|---------| 
   | Connect via on-premise gateway | Select this option first for SQL Server settings. | | 
   | Connection Name | <*my-sql-connection*> | The name you provide for your connection | 
   | SQL Server Name | <*my-sql-server*> | The name for your SQL server, which appears in your connection string: <p>"Server=<*yourServerAddress*>" |
   | SQL Database Name | <*my-sql-database*>  | The name for your SQL database, which appears in your connection string: <p>"Database=<*yourDatabaseName*>" |
   | Username | <*my-sql-username*> | The user name for accessing your database, which appears in your connection string: <p>"UserId=<*yourUserName*>" |
   | Password | <*my-sql-password*> | The password for accessing your database, which appears in your connection string: <p>"Password=<*yourPassword*>" | 
   | Authentication Type | Windows or Basic | Optionally, select the authentication type used by your SQL server. | 
   | Gateways | <*my-data-gateway*> | Select your on-premises data gateway. <p>If your gateway doesn't appear in the list, check that you correctly [set up your gateway](https://docs.microsoft.com/azure/logic-apps/logic-apps-gateway-connection). | 
   |||| 

3. When you're done, choose **Create**. 

After you create your connection, continue with the 
other steps in your logic app. For example, you can now 
select the table that you want your logic app to check:

![Select table](./media/connectors-create-api-sqlazure/azure-sql-database-table.png)
