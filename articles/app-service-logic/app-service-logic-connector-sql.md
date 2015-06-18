<properties 
   pageTitle="Using the SQL Connector in Microsoft Azure App Service" 
   description="How to use the SQL Connector" 
   services="app-service\logic" 
   documentationCenter=".net,nodejs,java" 
   authors="anuragdalmia" 
   manager="dwrede" 
   editor=""/>

<tags
   ms.service="app-service-logic"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration" 
   ms.date="06/14/2015"
   ms.author="sutalasi"/>


# Microsoft SQL Connector

Connect to an on-premises SQL Server or an Azure SQL Database to create and change your information or data. Connectors can be used in Logic Apps to retrieve, process, or push data as a part of a "flow". When you use the SQL Connector in your flow, you can achieve a variety of scenarios. For example, you can: 

- Expose a section of the data residing in your SQL database using a web or mobile application. 
- Insert data into a SQL database table for storage. For example, you can enter employee records, update sales orders, and so on.
- Get data from SQL and use it in a business process. For example, you can get customer records and put those customer records in SalesForce. 

## Triggers and Actions
*Triggers* are events that happen, like when an order is updated or when a new customer is added. An *Action* is the result of the trigger. For example, when an order is updated, send an alert to the salesperson. Or, when a new customer is added, send a welcome email to the new customer. 

The SQL Connector can be used as a trigger or an action in a Logic App and supports data in JSON and XML formats. For every table included in your package settings (more on that later in this topic), there is a set of JSON actions and a set of XML actions. 

The SQL Connector has the following Triggers and Actions available: 

Trigger | Action
--- | ---
Poll Data | <ul><li>Insert Into Table</li><li>Update Table</li><li>Select From Table</li><li>Delete From Table</li><li>Call Stored Procedure</li>

## Create the SQL Connector

A connector can be created within a Logic App or be created directly from the Azure Marketplace.

1. In the Azure startboard, select **Marketplace**.
2. Select **API Apps** and search for “SQL Connector”.
3. Enter the Name, App Service Plan, and other properties.
4. Enter the following package settings:

	Name | Required |  Description
--- | --- | ---
Server Name | Yes | Enter the SQL Server name. For example, enter *SQLserver/sqlexpress* or *SQLserver.mydomain.com*.
Port | No | Default is 1433.
User Name | Yes | Enter a user name that can log into the SQL Server. If connecting to an on-premises SQL Server, enter domain\username. 
Password | Yes | Enter the user name password.
Database Name | Yes | Enter the database you are connecting. For example, you can enter *Customers* or *dbo/orders*.
On-Premises | Yes | Default is False. Enter False if connecting to an Azure SQL database. Enter True if connecting to an on-premises SQL Server. 
Service Bus Connection String | No | If you're connecting to on-premises, enter the Service Bus relay connection string.<br/><br/>[Using the Hybrid Connection Manager](app-service-logic-hybrid-connection-manager.md)<br/>[Service Bus Pricing](http://azure.microsoft.com/pricing/details/service-bus/)
Partner Server Name | No | If the primary server is unavailable, you can enter a partner server as an alternate or backup server. 
Tables | No | List the database tables that can be updated by the connector. For example, enter *OrdersTable* or *EmployeeTable*. If no tables are entered, all tables can be used. Valid tables and/or Stored Procedures are required to use this connector as an action. 
Stored Procedures | No | Enter an existing stored procedure that can be called by the connector. For example, enter *sp_IsEmployeeEligible* or *sp_CalculateOrderDiscount*. Valid tables and/or Stored Procedures are required to use this connector as an action. 
Data Available Query | For trigger support | SQL statement to determine whether any data is available for polling a SQL Server database table. This should return a numeric value representing the number of rows of data available. Example: SELECT COUNT(*) from table_name. 
Poll Data Query | For trigger support | The SQL statement to poll the SQL Server database table. You can enter any number of SQL statements separated by a semicolon. This statement is executed transactionally and only committed when the data is safely stored in your logic app. Example: SELECT * FROM table_name; DELETE FROM table_name. <br/><br/>**Note**<br/>You must provide a poll statement that avoids an infinite loop by deleting, moving or updating selected data to ensure that same data isn't polled again. 

5. When complete, the Package Settings look similar to the following: 
<br/>
![][1]  

## Use the Connector as a Trigger
Let's look at a simple logic app that polls data from a SQL table, adds the data in another table, and updates the data.

To use the SQL connector as a trigger, enter the **Data Available Query** and **Poll Data Query** values. **Data Available Query** is executed on the schedule you enter and determines if any data is available. Since this query only returns a scalar number, it can be tuned and optimized for frequent execution.

**Poll Data Query** is only executed when the Data Available Query indicates that data is available. This statement executes within a transaction and is only committed when the extracted data is durably stored in your workflow. It is important to avoid infinitely re-extracting the same data. The transactional nature of this execution can be used to delete or update the data to ensure it isn't collected the next time data is queried.

> [AZURE.NOTE] The schema returned by this statement identifies the available properties in your connector. All columns must be named.

#### Data Available Query Example

	SELECT COUNT(*) FROM [Order] WHERE OrderStatus = 'ProcessedForCollection'

#### Poll Data Query Example

	SELECT *, GetData() as 'PollTime' FROM [Order] 
		WHERE OrderStatus = 'ProcessedForCollection' 
		ORDER BY Id DESC; 
	UPDATE [Order] SET OrderStatus = 'ProcessedForFrontDesk' 
		WHERE Id = 
		(SELECT Id FROM [Order] WHERE OrderStatus = 'ProcessedForCollection' ORDER BY Id DESC)

### Add the Trigger
1. When creating or editing a logic app, select the SQL Connector you created as the trigger. This lists the available triggers: **Poll Data (JSON)** and **Poll Data (XML)**:
<br/>
![][5] 

2. Select the **Poll Data (JSON)** trigger, enter the frequency, and click the ✓:
<br/>
![][6] 

3. The trigger now appears as configured in the logic app. The output(s) of the trigger are shown and can be used as inputs in any subsequent actions:
<br/>
![][7] 

## Use the Connector as an Action
Using our simple logic app that polls data from a SQL table, adds the data in another table, and updates the data.

To use the SQL Connector as an action, enter the name of the Tables and/or Stored Procedures you entered when you created the SQL Connector:

1. After your trigger (or choose 'run this logic manually'), add the SQL connector you created from the gallery. Select one of the Insert actions, like *Insert Into TempEmployeeDetails (JSON)*:
<br/>
![][8] 

2. Enter the input values of the record to be inserted, and click on the ✓:
<br/>
![][9] 

3. From the gallery, select the same SQL connector you created. As an action, select the Update action on the same table, like *Update EmployeeDetails*:
<br/>
![][11] 

4. Enter the input values for the update action, and click on the ✓:
<br/>
![][12] 

You can test the Logic App by adding a new record in the table that is being polled.

## Hybrid Configuration (Optional)

> [AZURE.NOTE] This step is required only if you are using SQL Server on-premises behind your firewall.

App Service uses the Hybrid Configuration Manager to connect securely to your on-premises system. If you're connector uses an on-premises SQL Server, the Hybrid Connection Manager is required. 

See [Using the Hybrid Connection Manager](app-service-logic-hybrid-connection-manager.md).


## Do more with your Connector
Now that the connector is created, you can add it to a business flow using a Logic App. See [What are Logic Apps?](app-service-logic-what-are-logic-apps.md).

You can also review performance statistics and control security to the connector. See [Manage  and Monitor API apps and connector](../app-service-api/app-service-api-manage-in-portal.md).


<!--Image references-->
[1]: ./media/app-service-logic-connector-sql/Create.jpg
[5]: ./media/app-service-logic-connector-sql/LogicApp1.jpg
[6]: ./media/app-service-logic-connector-sql/LogicApp2.jpg
[7]: ./media/app-service-logic-connector-sql/LogicApp3.jpg
[8]: ./media/app-service-logic-connector-sql/LogicApp4.jpg
[9]: ./media/app-service-logic-connector-sql/LogicApp5.jpg
[10]: ./media/app-service-logic-connector-sql/LogicApp6.jpg
[11]: ./media/app-service-logic-connector-sql/LogicApp7.jpg
[12]: ./media/app-service-logic-connector-sql/LogicApp8.jpg


 