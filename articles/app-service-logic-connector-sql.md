<properties 
   pageTitle="SQL Connector" 
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
   ms.date="03/20/2015"
   ms.author="sutalasi"/>


# Microsoft SQL Connector #

Connectors can be used in Logic apps to fetch, process or push data as a part of a flow. There are scenarios where you may need to work with SQL database on Azure SQL or SQL Server (which is installed on-premise and behind the firewall). By leveraging the SQL Connector in your flow you can achieve a variety of scenarios. A few examples:  

1.	Expose a section of the data residing in your SQL database via a web or mobile user front end.
2.	Insert data to your SQL database table for storage (Example: Employee Records, Sales Orders etc.)
3.	Extract data from SQL for use in a business process

For these scenarios, the following needs to be done: 

1. Create an instance of the SQL Connector API App
2. Establish hybrid connectivity for the API App to communicate with the on-premise SQL. This step is optional and required only for on-premises SQL server and not for SQL Azure.
3. Use the created API App in a logic app to achieve the desired business process

	###Basic Triggers and Actions
		
    - Poll Data (Trigger) 
    - Insert Into Table
    - Update Table
    - Select From Table
    - Delete From Table
    - Call Stored Procedure

## Create an instance of the SQL Connector API App ##

To use the SQL Connector, you need to create an instance of the SQL Connector' API App. The can be done as follows:

1. Open the Azure Marketplace using the '+ NEW' option at the bottom left of the Azure Portal
2. Browse to “Web and Mobile > API apps” and search for “SQL Connector”
3. Provide the generic details such as Name, App service plan, and so on in the first blade
4. Provide the package settings mentioned in the table below.	

<style type="text/css">
	table.tableizer-table {
	border: 1px solid #CCC; font-family: Arial, Helvetica, sans-serif;
	font-size: 12px;
} 
.tableizer-table td {
	padding: 4px;
	margin: 3px;
	border: 1px solid #ccc;
}
.tableizer-table th {
	background-color: #525B64; 
	color: #FFF;
	font-weight: bold;
}
</style><table class="tableizer-table">
<tr class="tableizer-firstrow"><th>Name</th><th>Required</th><th>Default Value</th><th>Description</th></tr>
 <tr><td>Server Name</td><td>Yes</td><td>&nbsp;</td><td>The SQL Server name. Example: "SQLserver", "SQLserver/sqlexpress", or "SQLserver.mydomain.com".</td></tr>
 <tr><td>Port</td><td>No</td><td> 1433</td><td>The port number where the connection is established. If you do not specify a value, the connector connects through the default port.</td></tr>
 <tr><td>User Name</td><td>Yes</td><td>&nbsp;</td><td>Valid user name to connect to the SQL server.</td></tr>
 <tr><td>Password</td><td>Yes</td><td>&nbsp;</td><td>Valid password to connect to the SQL server.</td></tr>
 <tr><td>Database Name</td><td>Yes</td><td>&nbsp;</td><td>A valid database name in the SQL Server. Example: "orders" or "dbo/orders" or "myaccount/employees".</td></tr>
 <tr><td>On-Premises</td><td>Yes</td><td>FALSE</td><td>Whether your SQL server is on-premises behind a firewall or not. If set to TRUE, you need to install a listener agent on a server that can access your SQL server. You can go to your API App summary page and click on 'Hybrid Connection' to install the agent.</td></tr>
 <tr><td>Service Bus Connection String</td><td>No</td><td>&nbsp;</td><td>If your SQL Server is on-premises this should be a valid Service Bus Namespace connection string. Make sure you use 'Standard' edition of Azure Service Bus and not 'Basic'.</td></tr>
 <tr><td>Partner Server Name</td><td>No</td><td>&nbsp;</td><td>The partner server to connect to when the primary server is down.</td></tr>
 <tr><td>Tables</td><td>No</td><td>&nbsp;</td><td>The tables in the database that are allowed to be modified by the connector. Ex:OrdersTable,EmployeeTable. Valid tables and/or Stored Procedures must be specified to use this connector as an action.</td></tr>
 <tr><td>Stored Procedures</td><td>No</td><td>&nbsp;</td><td>Specify the stored procedures in the database that can be called by the connector. Ex: IsEmployeeEligible,CalculateOrderDiscount. Valid tables and/or Stored Procedures must be specified to use this connector as an action.</td></tr>
 <tr><td>Data Available Query</td><td>For trigger support</td><td>&nbsp;</td><td>SQL statement to determine whether any data is available for polling a SQL Server database table. This should return a numeric value representing the number of rows of data available. Example: SELECT COUNT(*) from table_name.</td></tr>
 <tr><td>Poll Data Query</td><td>For trigger support</td><td>&nbsp;</td><td>The SQL statement to poll the SQL Server database table. You can specify any number of SQL statements separated by a semicolon. This statement is executed transactionally and only commited once the data is safely stored in your logic app instance. Example: SELECT * FROM table_name; DELETE FROM table_name. NOTE: You must provide a poll statement that avoids an infinite loop by deleting, moving or updating selected data such that it ensure it won't be polled again.</td></tr>
</table>


 ![][1]  

The SQL Connector can be used as a trigger or action in a logic app and support data in both JSON and XML formats. For every table that is provided as part of your package settings, there will be a set of JSON actions and a set of XML actions. 

## Use as a trigger

Let us take a simple logic app which polls data from a SQL table, adds the data in another table and updates the data.

In order to use the SQL connector as a trigger you must specify both the 'Data Available Query' and 'Poll Data Query'. The former is executed on the schedule specified to check if any data is available. Since this query only needs to return a scalar number, it can be tuned and optimized for frequent execution.

The Poll Data Query will only be executed once the Data Available Query has indicated that data is available. This statement will be executed transactionally and only committed once the extracted data is durably stored in your workflow. It is important to avoid infinitely re-extracting the same data. The transactional nature of this execution can be used to delete or update the data to ensure it isn't collected the next time data is queried.

Note that the schema returned by this statement will identify the available properties in your connector. All columns must be named.

**Example Data Available Query:**

	SELECT COUNT(*) FROM [Order] WHERE OrderStatus = 'ProcessedForCollection'

**Example Poll Data Query:** 

	SELECT *, GetData() as 'PollTime' FROM [Order] 
		WHERE OrderStatus = 'ProcessedForCollection' 
		ORDER BY Id DESC; 
	UPDATE [Order] SET OrderStatus = 'ProcessedForFrontDesk' 
		WHERE Id = 
		(SELECT Id FROM [Order] WHERE OrderStatus = 'ProcessedForCollection' ORDER BY Id DESC)

-  When creating/editing a logic app, choose the SQL Connector API App created as the trigger. This will list the available triggers - Poll Data (JSON) and Poll Data (XML).

 ![][5] 

- Select the trigger - Poll Data (JSON), specify the frequency and click on the ✓.

![][6] 

- The trigger will now appear as configured in the logic app. The output(s) of the trigger will be shown and can be used inputs in a subsequent actions. 

![][7] 

## Use as an action

To use the SQL Connector as an action you must specify the name of the Tables and/or Stored Procedures you wish to use at configuration time.

- Add the SQL connector from the gallery after your chosen trigger (or choose 'run this logic manually'. Select one of the Insert actions - e.g.Insert Into TempEmployeeDetails (JSON).

![][8] 

- Provide the inputs of the record to be inserted and click on ✓. 

![][9] 

- Select the same SQL connector from gallery as an action. Select the Update action on the same table (Ex: Update EmployeeDetails)

![][11] 

- Provide the inputs for the update action and click on ✓. 

![][12] 

You can test the Logic App by adding a new record in the table that is being polled.

## Hybrid Configuration (Optional) ##

Note: This step is required only if you are using SQL Server on-premises behind firewall.

Browse to the just created API App via Browse -> API Apps -> <Name of the API App just created> and you will see the following behavior. The setup is incomplete as the hybrid connection is not yet established.

![][2] 

To establish hybrid connectivity do the following:

1. Copy the primary connection string
2. Click on the 'Download and Configure' link
3. Follow the install process which gets initiated and provide the primary connection string when asked for
4. Once the setup process is complete then a dialog similar to this would show up

![][3] 

Now when you browse to the created API App again then you will observe the hybrid connection status as Connected. 

![][4] 

Note: in case you wish to switch to the secondary connection string then just re-do the hybrid setup and provide the secondary connection string in place of the primary connection string  


<!--Image references-->
[1]: ./media/app-service-logic-connector-sql/Create.jpg
[2]: ./media/app-service-logic-connector-sql/BrowseSetupIncomplete.jpg
[3]: ./media/app-service-logic-connector-sql/HybridSetup.jpg
[4]: ./media/app-service-logic-connector-sql/BrowseSetupComplete.jpg
[5]: ./media/app-service-logic-connector-sql/LogicApp1.jpg
[6]: ./media/app-service-logic-connector-sql/LogicApp2.jpg
[7]: ./media/app-service-logic-connector-sql/LogicApp3.jpg
[8]: ./media/app-service-logic-connector-sql/LogicApp4.jpg
[9]: ./media/app-service-logic-connector-sql/LogicApp5.jpg
[10]: ./media/app-service-logic-connector-sql/LogicApp6.jpg
[11]: ./media/app-service-logic-connector-sql/LogicApp7.jpg
[12]: ./media/app-service-logic-connector-sql/LogicApp8.jpg


