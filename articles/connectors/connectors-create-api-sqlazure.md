<properties
    pageTitle="Add the Azure SQL Database connector in your Logic Apps | Microsoft Azure"
    description="Overview of Azure SQL Database connector with REST API parameters"
    services=""
    documentationCenter="" 
    authors="MandiOhlinger"
    manager="erikre"
    editor=""
    tags="connectors"/>

<tags
   ms.service="logic-apps"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na" 
   ms.date="07/25/2016"
   ms.author="mandia"/>


# Get started with the Azure SQL Database connector
Using the Azure SQL Database connector, create workflows for your organization that manage data in your tables. 

With SQL Database, you:

- Build your workflow by adding a new customer to a customers database, or updating an order in an orders database.
- Use actions to get a row of data, insert a new row, and even delete. For example,  when a record is created in Dynamics CRM Online (a trigger), then insert a row in an Azure SQL Database (an action). 

This topic shows you how to use the SQL Database connector in a logic app, and also lists the actions.

>[AZURE.NOTE] This version of the article applies to Logic Apps general availability (GA). 

To learn more about Logic Apps, see [What are logic apps](../app-service-logic/app-service-logic-what-are-logic-apps.md) and [create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

## Connect to Azure SQL Database

Before your logic app can access any service, you first create a *connection* to the service. A connection provides connectivity between a logic app and another service. For example, to connect to SQL Database, you first create a SQL Database *connection*. To create a connection, you enter the credentials you normally use to access the service you are connecting to. So, in SQL Database, enter your SQL Database credentials to create the connection. 

#### Create the connection

>[AZURE.INCLUDE [Create the connection to SQL Azure](../../includes/connectors-create-api-sqlazure.md)]

## Use a trigger

This connector does not have any triggers. Use other triggers to start the logic app, such as a Recurrence trigger, an HTTP Webhook trigger, triggers available with other connectors, and more. [Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md) provides an example.

## Use an action
	
An action is an operation carried out by the workflow defined in a logic app. [Learn more about actions](../app-service-logic/app-service-logic-what-are-logic-apps.md#logic-app-concepts).

1. Select the plus sign. You see several choices: **Add an action**, **Add a condition**, or one of the **More** options.

	![](./media/connectors-create-api-sqlazure/add-action.png)

2. Choose **Add an action**.

3. In the text box, type “sql” to get a list of all the available actions.

	![](./media/connectors-create-api-sqlazure/sql-1.png) 

4. In our example, choose **SQL Server - Get row**. If a connection already exists, then select the **Table name** from the drop-down list, and enter the **Row ID** you want to return.

	![](./media/connectors-create-api-sqlazure/sample-table.png)

	If you are prompted for the connection information, then enter the details to create the connection. [Create the connection](connectors-create-api-sqlazure.md#create-the-connection) in this topic describes these properties. 

	> [AZURE.NOTE] In this example, we return a row from a table. To see the data in this row, add another action that creates a file using the fields from the table. For example, add a OneDrive action that uses the FirstName and LastName fields to create a new file in the cloud storage account. 

5. **Save** your changes (top left corner of the toolbar). Your logic app is saved and may be automatically enabled.


## Technical Details

## SQL Database actions
An action is an operation carried out by the workflow defined in a logic app. The SQL Database connector includes the following actions. 

|Action|Description|
|--- | ---|
|[ExecuteProcedure](connectors-create-api-sqlazure.md#execute-stored-procedure)|Executes a stored procedure in SQL|
|[GetRow](connectors-create-api-sqlazure.md#get-row)|Retrieves a single row from a SQL table|
|[GetRows](connectors-create-api-sqlazure.md#get-rows)|Retrieves rows from a SQL table|
|[InsertRow](connectors-create-api-sqlazure.md#insert-row)|Inserts a new row into a SQL table|
|[DeleteRow](connectors-create-api-sqlazure.md#delete-row)|Deletes a row from a SQL table|
|[GetTables](connectors-create-api-sqlazure.md#get-tables)|Retrieves tables from a SQL database|
|[UpdateRow](connectors-create-api-sqlazure.md#update-row)|Updates an existing row in a SQL table|

### Action Details

In this section, see the specific details about each action, including any required or optional input properties, and any corresponding output associated with the connector.


#### Execute stored procedure
Executes a stored procedure in SQL.  

| Property Name| Display Name |Description|
| ---|---|---|
|procedure * | Procedure name | The name of the stored procedure you want to execute |
|parameters * | Input parameters | The parameters are dynamic and based on the stored procedure you choose. <br/><br/> For example, if you're using the Adventure Works sample database, choose the *ufnGetCustomerInformation* stored procedure. The **Customer ID** input parameter is displayed. Enter "6" or one of the other customer IDs. |

An asterisk (*) means the property is required.

##### Output Details
ProcedureResult: Carries result of stored procedure execution

| Property Name | Data Type | Description |
|---|---|---|
|OutputParameters|object|Output parameter values |
|ReturnCode|integer|Return code of a procedure |
|ResultSets|object| Result sets|


#### Get row 
Retrieves a single row from a SQL table.  

| Property Name| Display Name |Description|
| ---|---|---|
|table * | Table name |Name of SQL table|
|id * | Row id |Unique identifier of the row to retrieve|

An asterisk (*) means the property is required.

##### Output Details
Item

| Property Name | Data Type |
|---|---|
|ItemInternalId|string|


#### Get rows 
Retrieves rows from a SQL table.  

|Property Name| Display Name|Description|
| ---|---|---|
|table*|Table name|Name of SQL table|
|$skip|Skip Count|Number of entries to skip (default = 0)|
|$top|Maximum Get Count|Maximum number of entries to retrieve (default = 256)|
|$filter|Filter Query|An ODATA filter query to restrict the number of entries|
|$orderby|Order By|An ODATA orderBy query for specifying the order of entries|

An asterisk (*) means the property is required.

##### Output Details
ItemsList

| Property Name | Data Type |
|---|---|
|value|array|


#### Insert row 
Inserts a new row into a SQL table.  

|Property Name| Display Name|Description|
| ---|---|---|
|table*|Table name|Name of SQL table|
|item*|Row|Row to insert into the specified table in SQL|

An asterisk (*) means the property is required.

##### Output Details
Item

| Property Name | Data Type |
|---|---|
|ItemInternalId|string|


#### Delete row 
Deletes a row from a SQL table.  

|Property Name| Display Name|Description|
| ---|---|---|
|table*|Table name|Name of SQL table|
|id*|Row id|Unique identifier of the row to delete|

An asterisk (*) means the property is required.

##### Output Details
None.

#### Get tables 
Retrieves tables from a SQL database.  

There are no parameters for this call. 

##### Output Details 
TablesList

| Property Name | Data Type |
|---|---|
|value|array|

#### Update row 
Updates an existing row in a SQL table.  

|Property Name| Display Name|Description|
| ---|---|---|
|table*|Table name|Name of SQL table|
|id*|Row id|Unique identifier of the row to update|
|item*|Row|Row with updated values|

An asterisk (*) means the property is required.

##### Output Details  
Item

| Property Name | Data Type |
|---|---|
|ItemInternalId|string|


### HTTP Responses

When making calls to the different actions, you may get certain responses. The following table outlines the responses and their descriptions:  

|Name|Description|
|---|---|
|200|OK|
|202|Accepted|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|500|Internal Server Error. Unknown error occurred|
|default|Operation Failed.|


## Next steps

[Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md). Explore the other available connectors in Logic Apps at our [APIs list](apis-list.md).
