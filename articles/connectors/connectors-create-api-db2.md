<properties
    pageTitle="Add the DB2 connector in your Logic Apps | Microsoft Azure"
    description="Overview of DB2 connector with REST API parameters"
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
   ms.workload="integration" 
   ms.date="09/19/2016"
   ms.author="plarsen"/>


# Get started with the DB2 Connector
Microsoft Connector for DB2 connects Logic Apps to resources stored in an IBM DB2 database. This connector includes a Microsoft Client to communicate to remote DB2 server computers across a TCP/IP network, including cloud databases (e.g. IBM Bluemix dashDB or IBM DB2 for Windows running in Azure Virtualization) and on-premises databases using the On-premises Data Gateway. See list of supported IBM DB2 platforms and versions at the end of this topic.

The DB2 Connector supports the following database operations:

- List database tables
- Read one row using SELECT
- Read all rows using SELECT
- Add one row using INSERT
- Alter one row using UPDATE
- Remove one row using DELETE

This topic shows you how to use the Connector in a logic app to process database operations.

>[AZURE.NOTE] This version of the article applies to Logic Apps general availability (GA). 

To learn more about Logic Apps, see [create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md).

## Logic App Actions
Connector supports the following Logic app actions:

- Getables
- GetRow
- GetRows
- InsertRow
- UpdateRow
- DeleteRow


## Define Logic App to list tables
Defining a Logic App for any operation is comprised of many steps performed through the Microsoft Azure portal.
You can define a Logic app action to list tables in a DB2 database, which instructs the Connector to process a DB2 schema statement (CALL SYSIBM.SQLTABLES).

### Define Logic App instance
1.	In the **Azure start board**, select **+** (plus sign), **Web + Mobile**, and then **Logic App**.
2.	Enter the **Name** (e.g. "**Db2getTables**"), **Subscription**, **Resource group**, **Location**, and **App Service Plan**. Click **Pin to dashboard**, and then select **Create**.

### Define Logic App trigger and action
1.	In the **Logic Apps Designer**, in the **Templates** list, click **Blank LogicApp**.  
2.	In the **triggers** list, click **Recurrence**. 
3.	In the **Recurrence** trigger, click **Edit**, click **Frequency** drop-down to select **Day**, and then click **Interval** to type **7**.  
4.	Click the **+ New step** box, and then click **Add an action**.
5.	In the **actions** list, type **db2** in the **Search for more actions** edit box, and then click **DB2 - Get tables (Preview)**.

	![](./media/connectors-create-api-db2/Db2connectorActions.png)  

6.	In the **DB2 - Get tables** configuration pane, click **checkbox** to enable **Connect via on-premises data gateway**. See the settings change from cloud to on-premises.
	- Type value for **Server**, in the form of address or alias colon port number. For example, type **ibmserver01:50000**.
	- Type value for **Database**. For example, type **nwind**.
	- Select value for **Authentication**. For example, select **Basic**.
	- Type value for **Username**. For example, type **db2admin**.
	- Type value for **Password**. For example, type **Password1**.
	- Select value for **Gateway**. For example, click **datagateway01**.
7. Click **Create**, and then click **Save**. 

	![](./media/connectors-create-api-db2/Db2connectorOnPremisesDataGatewayConnection.png)

8.	In the **Db2getTables** blade, within the **All runs** list under **Summary**, click the first-listed item (most recent run).
9.	In the **Logic app run** blade, click **Run Details**. Within the **Action** list, click **Get_tables**. See the value for **Status**, which should be **Succeeded**. Click the **Inputs link**. View the inputs. Click the **Outputs link**. View the outputs, which should include a list of tables.

	![](./media/connectors-create-api-db2/Db2connectorGetTablesLogicAppRunOutputs.png)

## Define DB2 connections
Connector supports connections to both on-premises databases and cloud databases using the following connection properties. 

Property | Description
--- | ---
server | The required server property accepts a string value representing a TCP/IP address or alias, in either IPv4 or IPv6 format. followed (colon-delimited) by a TCP/IP port number. 
database | The required database property accepts a string value representing a DRDA Relational Database Name (RDBNAM). DB2 for z/OS accepts a 16-byte string (database is known as an IBM DB2 for z/OS location). DB2 for i5/OS accepts an 18-byte string (database is known as an IBM DB2 for i relational database). DB2 for LUW accepts an 8-byte string.
authentication | The optional authentication property accepts a list item value, either Basic or Windows (kerberos). 
username | The required username property accepts a string value. DB2 for z/OS accepts an 8-byte string. DB2 for i accepts a 10-byte string. DB2 for Linux or UNIX accepts an 8-byte string. DB2 for Windows accepts a 30-byte string.
password | The required password property accepts a string value.
gateway | The required gateway property accepts a list item  value, representing the On-premises Data Gateway defined to Logic Apps within the storage group.  

## Define an On-premises gateway connection
Connector can access an on-premises DB2 database via the On-premises Gateway. See gateway topics for more information. 

1. In the **Gateways** configuration pane, click **checkbox** to enable **Connect via gateway**. See the settings change from cloud to on-premises.
2. Type value for **Server**, in the form of address or alias colon port number. For example, type **ibmserver01:50000**.
3. Type value for **Database**. For example, type **nwind**.
4. Select value for **Authentication**. For example, select **Basic**.
5. Type value for **Username**. For example, type **db2admin**.
6. Type value for **Password**. For example, type **Password1**.
7. Select value for **Gateway**. For example, click **datagateway01**.
8. Click **Create** to continue. 

	![](./media/connectors-create-api-db2/Db2connectorOnPremisesDataGatewayConnection.png)

## Define an cloud connection
Connector can access a cloud DB2 database. 

1. In the **Gateways** configuration pane, leave the **checkbox** disabled (unclicked) **Connect via gateway**. 
2. Type value for **Connection name**. For example, type **hisdemo2**.
3. Type value for **DB2 server name**, in the form of address or alias colon port number. For example, type **hisdemo2.cloudapp.net:50000**.
3. Type value for **DB2 database name**. For example, type **nwind**.
4. Type value for **Username**. For example, type **db2admin**.
5. Type value for **Password**. For example, type **Password1**.
6. Click **Create** to continue. 

	![](./media/connectors-create-api-db2/Db2connectorCloudConnection.png)

## Define Logic App to fetch all rows using SELECT
You can define a Logic app action to fetch all rows in a DB2 table, which instructs the Connector to process a DB2 SELECT statement (e.g., **SELECT * FROM AREA**).

### Define Logic App instance
1.	In the **Azure start board**, select **+** (plus sign), **Web + Mobile**, and then **Logic App**.
2.	Enter the **Name** (e.g. "**Db2getRows**"), **Subscription**, **Resource group**, **Location**, and **App Service Plan**. Click **Pin to dashboard**, and then select **Create**.

### Define Logic App trigger and action
1.	In the **Logic Apps Designer**, in the **Templates** list, click **Blank LogicApp**.  
2.	In the **triggers** list, click **Recurrence**. 
3.	In the **Recurrence** trigger, click **Edit**, click **Frequency** drop-down to select **Day**, and then click **Interval** to type **7**. 
4.	Click the **+ New step** box, and then click **Add an action**.
5.	In the **actions** list, type **db2** in the **Search for more actions** edit box, and then click **DB2 - Get rows (Preview)**.
6. In the **Get rows (Preview)** action, click **Change connection**.
7. In the **Connections** configuration pane, click **Create new**. 

	![](./media/connectors-create-api-db2/Db2connectorNewConnection.png)
  
8. In the **Gateways** configuration pane, leave the **checkbox** disabled (unclicked) **Connect via gateway**.
	- Type value for **Connection name**. For example, type **HISDEMO2**.
	- Type value for **DB2 server name**, in the form of address or alias colon port number. For example, type **HISDEMO2.cloudapp.net:50000**.
	- Type value for **DB2 database name**. For example, type **NWIND**.
	- Type value for **Username**. For example, type **db2admin**.
	- Type value for **Password**. For example, type **Password1**.
9. Click **Create** to continue.

	![](./media/connectors-create-api-db2/Db2connectorCloudConnection.png)

10. In the **Table name** list, click the **down arrow**, and then click **AREA**.
11. Optionally, click **Show advanced options** to specify query options.
12. Click **Save**. 

	![](./media/connectors-create-api-db2/Db2connectorGetRowsTableName.png)

13.	In the **Db2getRows** blade, within the **All runs** list under **Summary**, click the first-listed item (most recent run).
14.	In the **Logic app run** blade, click **Run Details**. Within the **Action** list, click **Get_rows**. See the value for **Status**, which should be **Succeeded**. Click the **Inputs link**. View the inputs. Click the **Outputs link**. View the outputs, which should include a list of rows.

	![](./media/connectors-create-api-db2/Db2connectorGetRowsOutputs.png)

## Define Logic App to add one row using INSERT
You can define a Logic app action to add one row in a DB2 table, which instructs the Connector to process a DB2 INSERT statement (e.g., **INSERT INTO AREA (AREAID, AREADESC, REGIONID) VALUES ('99999', 'Area 99999', 102)**).

### Define Logic App instance
1.	In the **Azure start board**, select **+** (plus sign), **Web + Mobile**, and then **Logic App**.
2.	Enter the **Name** (e.g. "**Db2insertRow**"), **Subscription**, **Resource group**, **Location**, and **App Service Plan**. Click **Pin to dashboard**, and then select **Create**.

### Define Logic App trigger and action
1.	In the **Logic Apps Designer**, in the **Templates** list, click **Blank LogicApp**.  
2.	In the **triggers** list, click **Recurrence**. 
3.	In the **Recurrence** trigger, click **Edit**, click **Frequency** drop-down to select **Day**, and then click **Interval** to type **7**. 
4.	Click the **+ New step** box, and then click **Add an action**.
5.	In the **actions** list, type **db2** in the **Search for more actions** edit box, and then click **DB2 - Insert row (Preview)**.
6. In the **Get rows (Preview)** action, click **Change connection**. 
7. In the **Connections** configuration pane, click to select an connection. For example, click **hisdemo2**.

	![](./media/connectors-create-api-db2/Db2connectorChangeConnection.png)

8. In the **Table name** list, click the **down arrow**, and then click **AREA**.
9. Enter values for all required columns (see red asterisk). For example, type "**99999**" for **AREAID**, type "**Area 99999**", and type "**102**" for **REGIONID**. 
10. Click **Save**.

	![](./media/connectors-create-api-db2/Db2connectorInsertRowValues.png)
 
11.	In the **Db2insertRow** blade, within the **All runs** list under **Summary**, click the first-listed item (most recent run).
12.	In the **Logic app run** blade, click **Run Details**. Within the **Action** list, click **Get_rows**. See the value for **Status**, which should be **Succeeded**. Click the **Inputs link**. View the inputs. Click the **Outputs link**. View the outputs, which should include the new row.

	![](./media/connectors-create-api-db2/Db2connectorInsertRowOutputs.png)

## Define Logic App to fetch one row using SELECT
You can define a Logic app action to fetch one row in a DB2 table, which instructs the Connector to process a DB2 SELECT WHERE statement (e.g., **SELECT FROM AREA WHERE AREAID = '99999'**).

### Define Logic App instance
1.	In the **Azure start board**, select **+** (plus sign), **Web + Mobile**, and then **Logic App**.
2.	Enter the **Name** (e.g. "**Db2getRow**"), **Subscription**, **Resource group**, **Location**, and **App Service Plan**. Click **Pin to dashboard**, and then select **Create**.

### Define Logic App trigger and action
1.	In the **Logic Apps Designer**, in the **Templates** list, click **Blank LogicApp**.  
2.	In the **triggers** list, click **Recurrence**. 
3.	In the **Recurrence** trigger, click **Edit**, click **Frequency** drop-down to select **Day**, and then click **Interval** to type **7**. 
4.	Click the **+ New step** box, and then click **Add an action**.
5.	In the **actions** list, type **db2** in the **Search for more actions** edit box, and then click **DB2 - Get rows (Preview)**.
6. In the **Get rows (Preview)** action, click **Change connection**. 
7. In the **Connections** configurations pane, click to select an existing connection. For example, click **hisdemo2**.

	![](./media/connectors-create-api-db2/Db2connectorChangeConnection.png)

8. In the **Table name** list, click the **down arrow**, and then click **AREA**.
9. Enter values for all required columns (see red asterisk). For example, type "**99999**" for **AREAID**. 
10. Optionally, click **Show advanced options** to specify query options.
11. Click **Save**. 

	![](./media/connectors-create-api-db2/Db2connectorGetRowValues.png)

12.	In the **Db2getRow** blade, within the **All runs** list under **Summary**, click the first-listed item (most recent run).
13.	In the **Logic app run** blade, click **Run Details**. Within the **Action** list, click **Get_rows**. See the value for **Status**, which should be **Succeeded**. Click the **Inputs link**. View the inputs. Click the **Outputs link**. View the outputs, which should include row.

	![](./media/connectors-create-api-db2/Db2connectorGetRowOutputs.png)

## Define Logic App to change one row using UPDATE
You can define a Logic app action to change one row in a DB2 table, which instructs the Connector to process a DB2 UPDATE statement (e.g., **UPDATE AREA SET AREAID = '99999', AREADESC = 'Area 99999', REGIONID = 102)**).

### Define Logic App instance
1.	In the **Azure start board**, select **+** (plus sign), **Web + Mobile**, and then **Logic App**.
2.	Enter the **Name** (e.g. "**Db2updateRow**"), **Subscription**, **Resource group**, **Location**, and **App Service Plan**. Click **Pin to dashboard**, and then select **Create**.

### Define Logic App trigger and action
1.	In the **Logic Apps Designer**, in the **Templates** list, click **Blank LogicApp**.  
2.	In the **triggers** list, click **Recurrence**. 
3.	In the **Recurrence** trigger, click **Edit**, click **Frequency** drop-down to select **Day**, and then click **Interval** to type **7**. 
4.	Click the **+ New step** box, and then click **Add an action**.
5.	In the **actions** list, type **db2** in the **Search for more actions** edit box, and then click **DB2 - Update row (Preview)**.
6. In the **Get rows (Preview)** action, click **Change connection**. 
7. In the **Connections** configurations pane, click to select an existing connection. For example, click **hisdemo2**.

	![](./media/connectors-create-api-db2/Db2connectorChangeConnection.png)

8. In the **Table name** list, click the **down arrow**, and then click **AREA**.
9. Enter values for all required columns (see red asterisk). For example, type "**99999**" for **AREAID**, type "**Updated 99999**", and type "**102**" for **REGIONID**. 
10. Click **Save**. 

	![](./media/connectors-create-api-db2/Db2connectorUpdateRowValues.png)

11.	In the **Db2updateRow** blade, within the **All runs** list under **Summary**, click the first-listed item (most recent run).
12.	In the **Logic app run** blade, click **Run Details**. Within the **Action** list, click **Get_rows**. See the value for **Status**, which should be **Succeeded**. Click the **Inputs link**. View the inputs. Click the **Outputs link**. View the outputs, which should include the new row.

	![](./media/connectors-create-api-db2/Db2connectorUpdateRowOutputs.png)

## Define Logic App to remove one row using DELETE
You can define a Logic app action to remove one row in a DB2 table, which instructs the Connector to process a DB2 DELETE statement (e.g., **DELETE FROM AREA WHERE AREAID = '99999'**).

### Define Logic App instance
1.	In the **Azure start board**, select **+** (plus sign), **Web + Mobile**, and then **Logic App**.
2.	Enter the **Name** (e.g. "**Db2deleteRow**"), **Subscription**, **Resource group**, **Location**, and **App Service Plan**. Click **Pin to dashboard**, and then select **Create**.

### Define Logic App trigger and action
1.	In the **Logic Apps Designer**, in the **Templates** list, click **Blank LogicApp**.  
2.	In the **triggers** list, click **Recurrence**. 
3.	In the **Recurrence** trigger, click **Edit**, click **Frequency** drop-down to select **Day**, and then click **Interval** to type **7**. 
4.	Click the **+ New step** box, and then click **Add an action**.
5.	In the **actions** list, click **db2** in the **Search for more actions** edit box, and then click **DB2 - Delete row (Preview)**.
6. In the **Get rows (Preview)** action, click **Change connection**. 
7. In the **Connections** configurations pane, click to select an existing connection. For example, click **hisdemo2**.

	![](./media/connectors-create-api-db2/Db2connectorChangeConnection.png)

8. In the **Table name** list, click the **down arrow**, and then click **AREA**.
9. Enter values for all required columns (see red asterisk). For example, type "**99999**" for **AREAID**. 
10. Click **Save**. 

	![](./media/connectors-create-api-db2/Db2connectorDeleteRowValues.png)

11.	In the **Db2deleteRow** blade, within the **All runs** list under **Summary**, click the first-listed item (most recent run).
12.	In the **Logic app run** blade, click **Run Details**. Within the **Action** list, click **Get_rows**. See the value for **Status**, which should be **Succeeded**. Click the **Inputs link**. View the inputs. Click the **Outputs link**. View the outputs, which should include the deleted row.

	![](./media/connectors-create-api-db2/Db2connectorDeleteRowOutputs.png)

## Technical Details

## Actions
An action is an operation carried out by the workflow defined in a logic app. The DB2 database connector includes the following actions. 

|Action|Description|
|--- | ---|
|[GetRow](connectors-create-api-db2.md#get-row)|Retrieves a single row from a DB2 table|
|[GetRows](connectors-create-api-db2.md#get-rows)|Retrieves rows from a DB2 table|
|[InsertRow](connectors-create-api-db2.md#insert-row)|Inserts a new row into a DB2 table|
|[DeleteRow](connectors-create-api-db2.md#delete-row)|Deletes a row from a DB2 table|
|[GetTables](connectors-create-api-db2.md#get-tables)|Retrieves tables from a DB2 database|
|[UpdateRow](connectors-create-api-db2.md#update-row)|Updates an existing row in a DB2 table|

### Action Details

In this section, see the specific details about each action, including any required or optional input properties, and any corresponding output associated with the connector.

#### Get row 
Retrieves a single row from a DB2 table.  

| Property Name| Display Name |Description|
| ---|---|---|
|table * | Table name |Name of DB2 table|
|id * | Row id |Unique identifier of the row to retrieve|

An asterisk (*) means the property is required.

##### Output Details
Item

| Property Name | Data Type |
|---|---|
|ItemInternalId|string|


#### Get rows 
Retrieves rows from a DB2 table.  

|Property Name| Display Name|Description|
| ---|---|---|
|table*|Table name|Name of DB2 table|
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
Inserts a new row into a DB2 table.  

|Property Name| Display Name|Description|
| ---|---|---|
|table*|Table name|Name of DB2 table|
|item*|Row|Row to insert into the specified table in DB2|

An asterisk (*) means the property is required.

##### Output Details
Item

| Property Name | Data Type |
|---|---|
|ItemInternalId|string|


#### Delete row 
Deletes a row from a DB2 table.  

|Property Name| Display Name|Description|
| ---|---|---|
|table*|Table name|Name of DB2 table|
|id*|Row id|Unique identifier of the row to delete|

An asterisk (*) means the property is required.

##### Output Details
None.

#### Get tables 
Retrieves tables from a DB2 database.  

There are no parameters for this call. 

##### Output Details 
TablesList

| Property Name | Data Type |
|---|---|
|value|array|

#### Update row 
Updates an existing row in a DB2 table.  

|Property Name| Display Name|Description|
| ---|---|---|
|table*|Table name|Name of DB2 table|
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


## Supported DB2 Platforms and Versions
Connector supports these IBM DB2 platforms and versions, as well as IBM DB2 compatible products (e.g. IBM Bluemix dashDB) that support Distributed Relational Database Architecture (DRDA) SQL Access Manager (SQLAM) Version 10 and 11.

- IBM DB2 for z/OS 11.1
- IBM DB2 for z/OS 10.1
- IBM DB2 for i 7.3
- IBM DB2 for i 7.2
- IBM DB2 for i 7.1
- IBM DB2 for LUW 11
- IBM DB2 for LUW 10.5


## Next steps

[Create a logic app](../app-service-logic/app-service-logic-create-a-logic-app.md). Explore the other available connectors in Logic Apps at our [APIs list](apis-list.md).

