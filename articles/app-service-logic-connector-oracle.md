<properties 
   pageTitle="Oracle Connector" 
   description="How to use the Oracle Connector" 
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


# Oracle Database Connector #

Connectors can be used in Logic apps to fetch, process or push data as a part of a flow. By leveraging the Oracle Connector in your flow you can achieve a variety of scenarios. A few examples:  

1.	Expose a section of the data residing in your Oracle database via a web or mobile user front end.
2.	Insert data to your Oracle database table for storage (Example: Employee Records, Sales Orders etc.)
3.	Extract data from Oracle for use in a business process

For these scenarios, the following needs to be done: 

1. Create an instance of the Oracle Connector API App
2. Establish hybrid connectivity for the API App to communicate with the on-premise Oracle server.
3. Use the created API App in a logic app to achieve the desired business process

	###Basic Triggers and Actions
		
    - Poll Data (Trigger) 
    - Insert Into Table
    - Update Table
    - Select From Table
    - Delete From Table
    - Call Stored Procedure

## Create an instance of the Oracle Database Connector API App ##

To use the Oracle Connector, you need to create an instance of the Oracle Connector' API App. The can be done as follows:

1. Open the Azure Marketplace using the '+ NEW' option at the bottom left of the Azure Portal
2. Browse to “Web and Mobile > API apps” and search for “Oracle Connector”
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
<tr class="tableizer-firstrow"><th>Name</th><th>Required</th><th>Description</th></tr>
 <tr><td>Data Source</td><td>Yes</td><td>A data source (net service) name that is specified in the tnsnames.ora file on the machine where the Oracle client is installed. For more information about data source names and tnsnames.ora, see [Configuring the Oracle Client]</td></tr>
 <tr><td>User Name</td><td>Yes</td><td>Specify a valid user name to connect to the Oracle server.</td></tr>
 <tr><td>Password</td><td>Yes</td><td>Specify a valid password to connect to the Oracle server.</td></tr>
 <tr><td>Service Bus Connection String</td><td>Yes</td><td>Optional. Specify this parameter if your Oracle Server is on-premises. This should be a valid Service Bus Namespace connection string. You need to install a listener agent on a server that can access your Oracle server. You can go to your API App summary page and click on 'Hybrid Connection' to install the agent.</td></tr>
 <tr><td>Tables</td><td>No</td><td>Optional. Specify the tables in the database that are allowed to be modified by the connector. Ex:OrdersTable,EmployeeTable</td></tr>
 <tr><td>Stored Procedures</td><td>No</td><td>Optional. Specify the stored procedures in the database that can be called by the connector. Ex: IsEmployeeEligible,CalculateOrderDiscount</td></tr>
 <tr><td>Functions</td><td>No</td><td>Optional. Specify the functions in the database that can be called by the connector. Ex: IsEmployeeEligible,CalculateOrderDiscount</td></tr>
 <tr><td>Package Entities</td><td>No</td><td>Optional. Specify the packages in the database that can be called by the connector. Ex: PackageOrderProcessing.CompleteOrder,PackageOrderProcessing.GenerateBill</td></tr>
 <tr><td>Data Available Statement</td><td>No</td><td>Optional. Specify the statement to determine whether any data is available for polling. Example: SELECT * from table_name</td></tr>
 <tr><td>Poll Type</td><td>No</td><td>Optional. Specify the polling type. The allowed values are "Select", "Procedure", "Function" and "Package"</td></tr>
 <tr><td>Poll Statement</td><td>No</td><td>Optional. Specify the statement to poll the Oracle Server database. Example: SELECT * from table_name</td></tr>
 <tr><td>Post Poll Statement</td><td>No</td><td>Optional. Specify the statement to execute after the poll. Example: DELETE * from table_name.</td></tr>
</table>



 ![][1]  

## Hybrid Configuration ##

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

## Usage in a Logic App ##

Oracle Connector can be used as an trigger/action in a logic app. The trigger and all the actions support both JSON and XML data format. For every table that is provided as part of package settings, there will be a set of JSON actions and a set of XML actions. If you are using XML trigger/action, you can use Transform API App to convert data into another XML data format. 

Let us take a simple logic app which polls data from a Oracle table, adds the data in another table and updates the data.



-  When creating/editing a logic app, choose the Oracle Connector API App created as the trigger. This will list the available triggers - Poll Data (JSON) and Poll Data (XML).

 ![][5] 


- Select the trigger - Poll Data (JSON), specify the frequency and click on the ✓.

![][6] 



- The trigger will now appear as configured in the logic app. The output(s) of the trigger will be shown and can be used inputs in a subsequent actions. 

![][7] 


- Select the same Oracle connector from gallery as an action. Select one of the Insert actions - Insert Into TempEmployeeDetails (JSON).

![][8] 



- Provide the inputs of the record to be inserted and click on ✓. 

![][9] 



- Select the same Oracle connector from gallery as an action. Select the Update action on the same table (Ex: Update EmployeeDetails)

![][11] 



- Provide the inputs for the update action and click on ✓. 

![][12] 

You can test the Logic App by adding a new record in the table that is being polled.

<!--Image references-->
[1]: ./media/app-service-logic-connector-oracle/Create.jpg
[2]: ./media/app-service-logic-connector-oracle/BrowseSetupIncomplete.jpg
[3]: ./media/app-service-logic-connector-oracle/HybridSetup.jpg
[4]: ./media/app-service-logic-connector-oracle/BrowseSetupComplete.jpg
[5]: ./media/app-service-logic-connector-oracle/LogicApp1.jpg
[6]: ./media/app-service-logic-connector-oracle/LogicApp2.jpg
[7]: ./media/app-service-logic-connector-oracle/LogicApp3.jpg
[8]: ./media/app-service-logic-connector-oracle/LogicApp4.jpg
[9]: ./media/app-service-logic-connector-oracle/LogicApp5.jpg
[10]: ./media/app-service-logic-connector-oracle/LogicApp6.jpg
[11]: ./media/app-service-logic-connector-oracle/LogicApp7.jpg
[12]: ./media/app-service-logic-connector-oracle/LogicApp8.jpg

<!--Links-->
[Configuring the Oracle Client]: https://msdn.microsoft.com/en-us/library/dd787872.aspx

