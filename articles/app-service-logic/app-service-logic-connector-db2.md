<properties
   pageTitle="Using the DB2 connector in Microsoft Azure App Service | Microsoft Azure"
   description="How to use the DB2 connector with Logic app triggers and actions"
   services="app-service\logic"
   documentationCenter=".net,nodejs,java"
   authors="gplarsen"
   manager="erikre"
   editor=""/>

<tags
   ms.service="logic-apps"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration"
   ms.date="05/31/2016"
   ms.author="plarsen"/>

# DB2 connector
>[AZURE.NOTE] This version of the article applies to Logic apps 2014-12-01-preview schema version.

Microsoft connector for DB2 is an API app for connecting applications through Azure App Service to resources stored in an IBM DB2 database. Connector includes a Microsoft Client to connect to remote DB2 server computers across a TCP/IP network connection, including Azure hybrid connections to on-premises DB2 servers using the Azure Service Bus Relay connector supports the following database operations:

- Read rows using SELECT
- Poll to read rows using SELECT COUNT followed by SELECT
- Add one row or multiple (bulk) rows using INSERT
- Alter one row or multiple (bulk) rows using UPDATE
- Remove one row or multiple (bulk) rows using DELETE
- Read to alter rows using SELECT CURSOR followed by UPDATE WHERE CURRENT OF CURSOR
- Read to remove rows using SELECT CURSOR followed by UPDATE WHERE CURRENT OF CURSOR
- Run procedure with input and output parameters, return value, resultset, using CALL
- Custom commands and composite operations using SELECT, INSERT, UPDATE, DELETE

## Triggers and Actions
Connector supports the following Logic app triggers and actions:

Triggers | Actions
--- | ---
<ul><li>Poll Data</li></ul> | <ul><li>Bulk Insert</li><li>Insert</li><li>Bulk Update</li><li>Update</li><li>Call</li><li>Bulk Delete</li><li>Delete</li><li>Select</li><li>Conditional update</li><li>Post to EntitySet</li><li>Conditional delete</li><li>Select single entity</li><li>Delete</li><li>Upsert to EntitySet</li><li>Custom commands</li><li>Composite operations</li></ul>


## Create the DB2 connector
You can define a connector within a Logic app or from the Azure Marketplace, like in the following example:  

1. In the Azure startboard, select **Marketplace**.
2. In the **Everything** blade, type **db2** in the **Search Everything** box, and then click the enter key.
3. In the search everything results pane, select **DB2 connector**.
4. In the DB2 connector description blade, select **Create**.
5. In the DB2 connector package blade, enter the Name (e.g. "Db2ConnectorNewOrders"), App Service Plan, and other properties.
6. Select **Package settings**, and enter the following package settings:  

	Name | Required |  Description
--- | --- | ---
ConnectionString | Yes | DB2 Client connection string (e.g., "Network Address=servername;Network Port=50000;User ID=username;Password=password;Initial Catalog=SAMPLE;Package Collection=NWIND;Default Schema=NWIND").
Tables | Yes | Comma separated list of table, view and alias names required for OData operations and to generate swagger documentation with examples (e.g. "*NEWORDERS*").
Procedures | Yes | Comma separated list of procedure and function names (e.g. "SPORDERID").
OnPremise | No | Deploy on-premises using Azure Service Bus Relay.
ServiceBusConnectionString | No | Azure Service Bus Relay connection string.
PollToCheckData | No | SELECT COUNT statement to use with a Logic app trigger (e.g. "SELECT COUNT(\*) FROM NEWORDERS WHERE SHIPDATE IS NULL").
PollToReadData | No | SELECT statement to use with a Logic app trigger (e.g. "SELECT \* FROM NEWORDERS WHERE SHIPDATE IS NULL FOR UPDATE").
PollToAlterData | No | UPDATE or DELETE statement to use with a Logic app trigger (e.g. "UPDATE NEWORDERS SET SHIPDATE = CURRENT DATE WHERE CURRENT OF &lt;CURSOR&gt;").

7. Select **OK**, and then Select **Create**.
8. When complete, the Package Settings look similar to the following:  
![][1]


## Logic app with DB2 connector action to add data ##
You can define a Logic app action to add data to a DB2 table using an API Insert or Post to Entity OData operation. For example, you can insert a new customer order record, by processing a SQL INSERT statement against a table defined with an identity column, returning the identity value or the rows affected to the Logic app (SELECT ORDID FROM FINAL TABLE (INSERT INTO NWIND.NEWORDERS (CUSTID,SHIPNAME,SHIPADDR,SHIPCITY,SHIPREG,SHIPZIP) VALUES (?,?,?,?,?,?))).

> [AZURE.TIP] DB2 Connection "*Post to EntitySet*" returns the identity column value and "*API Insert*" returns rows affected

1. In the Azure startboard, select **+** (plus sign), **Web + Mobile**, and then **Logic app**.
2. Enter the Name (e.g. "NewOrdersDb2"), App Service Plan, other properties, and then select **Create**.
3. In the Azure startboard, select the Logic app you just created, **Settings**, and then **Triggers and actions**.
4. In the Triggers and actions blade, select **Create from Scratch** within the Logic app Templates.
5. In the API Apps panel, select **Recurrence**, set a frequency and interval, and then **checkmark**.
6. In the API Apps panel, select **DB2 connector**, expand the operations list to select **Insert into NEWORDER**.
7. Expand the parameters list to enter the following values:  

	Name | Value
--- | --- 
CUSTID | 10042
SHIPNAME | Lazy K Kountry Store 
SHIPADDR | 12 Orchestra Terrace
SHIPCITY | Walla Walla 
SHIPREG | WA
SHIPZIP | 99362 

8. Select the **checkmark** to save the action settings, and then **Save**.
9. The settings should look as follows:  
![][3]

10. In the **All runs** list under **Operations**, select the first-listed item (most recent run). 
11. In the **Logic app run** blade, select the **ACTION** item **db2connectorneworders**.
12. In the **Logic app action** blade, select the **INPUTS LINK**. DB2 connector uses the inputs to process a parameterized INSERT statement.
13. In the **Logic app action** blade, select the **OUTPUTS LINK**. The inputs should look as follows:  
![][4]

#### What you need to know

- Connector truncates DB2 table names when forming Logic app action names. For example, the operation **Insert into NEWORDERS** is truncated to **Insert into NEWORDER**.
- After saving the Logic app **Triggers and actions**, Logic app processes the operation. There may be a delay of a number of seconds (e.g. 3-5 seconds) before Logic app processes the operation. Optionally, you can click **Run Now** to process the operation.
- DB2 connector defines EntitySet members with attributes, including whether the member corresponds to a DB2 column with a default or generated columns (e.g. identity). Logic app displays a red asterisk next to the EntitySet member ID name, to denote DB2 columns that require values. You should not enter a value for the ORDID member, which corresponds to DB2 identity column. You may enter values for other optional members (ITEMS, ORDDATE, REQDATE, SHIPID, FREIGHT, SHIPCTRY), which correspond to DB2 columns with default values. 
- DB2 connector returns to Logic app the response on the Post to EntitySet that includes the values for identity columns, which is derived from the DRDA SQLDARD (SQL Data Area Reply Data) on the prepared SQL INSERT statement. DB2 server does not return the inserted values for columns with default values.  


## Logic app with DB2 connector action to add bulk data ##
You can define a Logic app action to add data to a DB2 table using an API Bulk Insert operation. For example, you can insert two new customer order records, by processing a SQL INSERT statement using an array of row values against a table defined with an identity column, returning the rows affected to the Logic app (SELECT ORDID FROM FINAL TABLE (INSERT INTO NWIND.NEWORDERS (CUSTID,SHIPNAME,SHIPADDR,SHIPCITY,SHIPREG,SHIPZIP) VALUES (?,?,?,?,?,?))).

1. In the Azure startboard, select **+** (plus sign), **Web + Mobile**, and then **Logic app**.
2. Enter the Name (e.g. "NewOrdersBulkDb2"), App Service Plan, other properties, and then select **Create**.
3. In the Azure startboard, select the Logic app you just created, **Settings**, and then **Triggers and actions**.
4. In the Triggers and actions blade, select **Create from Scratch** within the Logic app Templates.
5. In the API Apps panel, select **Recurrence**, set a frequency and interval, and then **checkmark**.
6. In the API Apps panel, select **DB2 connector**, expand the operations list to select **Bulk Insert into NEW**.
7. Enter the **rows** value as an array. For example, copy and paste the following:

	```
    [{"CUSTID":10081,"SHIPNAME":"Trail's Head Gourmet Provisioners","SHIPADDR":"722 DaVinci Blvd.","SHIPCITY":"Kirkland","SHIPREG":"WA","SHIPZIP":"98034"},{"CUSTID":10088,"SHIPNAME":"White Clover Markets","SHIPADDR":"305 14th Ave. S. Suite 3B","SHIPCITY":"Seattle","SHIPREG":"WA","SHIPZIP":"98128","SHIPCTRY":"USA"}]
	```

8. Select the **checkmark** to save the action settings, and then **Save**. The settings should look as follows:  
![][6]

9. In the **All runs** list under **Operations**, click the first-listed item (most recent run).
10. In the **Logic app run** blade, click the **ACTION** item.
11. In the **Logic app action** blade, click the **INPUTS LINK**. The outputs should look as follows:  
[][7]
12. In the **Logic app action** blade, click the **OUTPUTS LINK**. The outputs should look as follows:  
![][8]

#### What you need to know

- Connector truncates DB2 table names when forming Logic app action names. For example, the operation **Bulk Insert into NEWORDERS** is truncated to **Bulk Insert into NEW**.
- By omitting identity columns (e.g. ORDID), nullable columns (e.g. SHIPDATE), and columns with default values (e.g. ORDDATE, REQDATE, SHIPID, FREIGHT, SHIPCTRY), DB2 database generates values.
- By specifying "today" and "tomorrow", DB2 connector generates "CURRENT DATE" and "CURRENT DATE + 1 DAY" functions (e.g. REQDATE). 


## Logic app with DB2 connector trigger to read, alter or delete data ##
You can define a Logic app trigger to poll and read data from a DB2 table using an API Poll Data composite operation. For example, you can read one or more new customer order records, returning the records to the Logic app. The DB2 Connection package/app settings should look as follows:

	App Setting | Value
--- | --- | ---
PollToCheckData | SELECT COUNT(\*) FROM NEWORDERS WHERE SHIPDATE IS NULL
PollToReadData | SELECT \* FROM NEWORDERS WHERE SHIPDATE IS NULL FOR UPDATE
PollToAlterData | <no value specified>


Also, you can define a Logic app trigger to poll, read and alter data in a DB2 table using an API Poll Data composite operation. For example, you can read one or more new customer order records, update the row values, returning the selected (before update) records to the Logic app. The DB2 Connection package/app settings should look as follows:

	App Setting | Value
--- | --- | ---
PollToCheckData | SELECT COUNT(\*) FROM NEWORDERS WHERE SHIPDATE IS NULL
PollToReadData | SELECT \* FROM NEWORDERS WHERE SHIPDATE IS NULL FOR UPDATE
PollToAlterData | UPDATE NEWORDERS SET SHIPDATE = CURRENT DATE WHERE CURRENT OF &lt;CURSOR&gt;


Further, you can define a Logic app trigger to poll, read and remove data from a DB2 table using an API Poll Data composite operation. For example, you can read one or more new customer order records, delete the rows, returning the selected (before delete) records to the Logic app. The DB2 Connection package/app settings should look as follows:

	App Setting | Value
--- | --- | ---
PollToCheckData | SELECT COUNT(\*) FROM NEWORDERS WHERE SHIPDATE IS NULL
PollToReadData | SELECT \* FROM NEWORDERS WHERE SHIPDATE IS NULL FOR UPDATE
PollToAlterData | DELETE NEWORDERS WHERE CURRENT OF &lt;CURSOR&gt;

In this example, Logic app will poll, read, update, and then re-read data in the DB2 table.

1. In the Azure startboard, select **+** (plus sign), **Web + Mobile**, and then **Logic app**.
2. Enter the Name (e.g. "ShipOrdersDb2"), App Service Plan, other properties, and then select **Create**.
3. In the Azure startboard, select the Logic app you just created, **Settings**, and then **Triggers and actions**.
4. In the Triggers and actions blade, select **Create from Scratch** within the Logic app Templates.
5. In the API Apps panel, select **DB2 connector**, set a frequency and interval, and then **checkmark**.
6. In the API Apps panel, select **DB2 connector**, expand the operations list to select **Select from NEWORDERS**.
7. Select the **checkmark** to save the action settings, and then **Save**. The settings should look as follows:  
![][10]  
8. Click to close the **Triggers and actions** blade, and then click to close the **Settings** blade.
9. In the **All runs** list under **Operations**, click the first-listed item (most recent run).
10. In the **Logic app run** blade, click the **ACTION** item.
11. In the **Logic app action** blade, click the **OUTPUTS LINK**. The outputs should look as follows:  
![][11]


## Logic app with DB2 connector action to remove data ##
You can define a Logic app action to remove data from a DB2 table using an API Delete or Post to Entity OData operation. For example, you can insert a new customer order record, by processing a SQL INSERT statement against a table defined with an identity column, returning the identity value or the rows affected to the Logic app (SELECT ORDID FROM FINAL TABLE (INSERT INTO NWIND.NEWORDERS (CUSTID,SHIPNAME,SHIPADDR,SHIPCITY,SHIPREG,SHIPZIP) VALUES (?,?,?,?,?,?))).

## Create Logic app using DB2 connector to remove data ##
You can create a new Logic app from within the Azure Marketplace, and then use the DB2 connector as an action to remove customer orders. For example, you can use the DB2 connector conditional Delete operation to process a SQL DELETE statement (DELETE FROM NEWORDERS WHERE ORDID >= 10000).

1. In the hub menu of the Azure **Start** board, click **+** (plus sign), click **Web + Mobile**, and then click **Logic app**. 
2. In the **Create Logic app** blade, type a **Name**, for example **RemoveOrdersDb2**.
3. Select or define values for the other settings (e.g. service plan, resource group).
4. The settings should look as follows. Click **Create**:  
![][12]  
5. In the **Settings** blade, click **Triggers and actions**.
6. In the **Triggers and actions** blade, in the **Logic app Templates** list, click **Create from Scratch**.
7. In the **Triggers and actions** blade, in the **API Apps** panel, within the resource group, click **Recurrence**.
8. On the Logic app design surface, click the **Recurrence** item, set a **Frequency** and **Interval**, for example **Days** and **1**, and then click the **checkmark** to save the recurrence item settings.
9. In the **Triggers and actions** blade, in the **API Apps** panel, within the resource group, click **DB2 connector**.
10. On the Logic app design surface, click the **DB2 connector** action item, click the ellipses (**...**) to expand the operations list, and then click **Conditional delete from N**.
11. On the DB2 connector action item, type **ORDID ge 10000** for an **expression that identifies a subset of entries**.
12. Click the **checkmark** to save the action settings, and then click **Save**. The settings should look as follows:  
![][13]  
13. Click to close the **Triggers and actions** blade, and then click to close the **Settings** blade.
14. In the **All runs** list under **Operations**, click the first-listed item (most recent run).
15. In the **Logic app run** blade, click the **ACTION** item.
16. In the **Logic app action** blade, click the **OUTPUTS LINK**. The outputs should look as follows:  
![][14]

**Note:** Logic app designer truncates table names. For example, the operation **Conditional delete from NEWORDERS** is truncated to **Conditional delete from N**.


> [AZURE.TIP] Use the following SQL statements to create the sample table and stored procedures. 

You can create the sample NEWORDERS table using the following DB2 SQL DDL statements:
 
 	CREATE TABLE ORDERS (  
 		ORDID INT NOT NULL GENERATED BY DEFAULT AS IDENTITY (START WITH 10000, INCREMENT BY 1) ,  
 		CUSTID INT NOT NULL ,  
 		EMPID INT NOT NULL DEFAULT 10000 ,  
 		ORDDATE DATE NOT NULL DEFAULT CURRENT DATE ,  
 		REQDATE DATE DEFAULT CURRENT DATE ,  
 		SHIPDATE DATE ,  
 		SHIPID INT NOT NULL DEFAULT 10000,  
 		FREIGHT DECIMAL (9,2) NOT NULL DEFAULT 0.00 ,  
 		SHIPNAME CHAR (40) NOT NULL ,  
 		SHIPADDR CHAR (60) NOT NULL ,  
 		SHIPCITY CHAR (20) NOT NULL ,  
 		SHIPREG CHAR (15) NOT NULL ,  
 		SHIPZIP CHAR (10) NOT NULL ,  
 		SHIPCTRY CHAR (15) NOT NULL DEFAULT 'USA' ,  
 		PRIMARY KEY(ORDID)  
 		)  
 
 	CREATE UNIQUE INDEX XORDID ON ORDERS (ORDID ASC)  



You can create the sample SPOERID stored procedure using the following DB2 DDL statement:
 
 	CREATE OR REPLACE PROCEDURE NWIND.SPORDERID (IN ORDERID VARCHAR(128))  
 		DYNAMIC RESULT SETS 1  
 	P1: BEGIN  
 		DECLARE CURSOR1 CURSOR WITH RETURN FOR  
 			SELECT * FROM NWIND.NEWORDERS  
 				WHERE ORDID = ORDERID;  
 		OPEN CURSOR1;  
 	END P1  
 	') 


## Hybrid Configuration (Optional)

> [AZURE.NOTE] This step is required only if you are using DB2 connector on-premises behind your firewall.

App Service uses the Hybrid Configuration Manager to connect securely to your on-premises system. If connector uses an on-premises IBM DB2 Server for Windows, the Hybrid Connection Manager is required.

See [Using the Hybrid Connection Manager](app-service-logic-hybrid-connection-manager.md).


## Do more with your connector
Now that the connector is created, you can add it to a business workflow using a Logic app. See [What are Logic apps?](app-service-logic-what-are-logic-apps.md).

Create the API Apps using REST APIs. See [Connectors and API Apps Reference](http://go.microsoft.com/fwlink/p/?LinkId=529766).

You can also review performance statistics and control security to the connector. See [Manage and Monitor your built-in API Apps and Connectors](app-service-logic-monitor-your-connectors.md).


<!--Image references-->
[1]: ./media/app-service-logic-connector-db2/ApiApp_Db2Connector_Create.png
[2]: ./media/app-service-logic-connector-db2/LogicApp_NewOrdersDb2_Create.png
[3]: ./media/app-service-logic-connector-db2/LogicApp_NewOrdersDb2_TriggersActions.png
[4]: ./media/app-service-logic-connector-db2/LogicApp_NewOrdersDb2_Outputs.png
[5]: ./media/app-service-logic-connector-db2/LogicApp_NewOrdersBulkDb2_Create.png
[6]: ./media/app-service-logic-connector-db2/LogicApp_NewOrdersBulkDb2_TriggersActions.png
[7]: ./media/app-service-logic-connector-db2/LogicApp_NewOrdersBulkDb2_Inputs.png
[8]: ./media/app-service-logic-connector-db2/LogicApp_NewOrdersBulkDb2_Outputs.png
[9]: ./media/app-service-logic-connector-db2/LogicApp_UpdateOrdersDb2_Create.png
[10]: ./media/app-service-logic-connector-db2/LogicApp_UpdateOrdersDb2_TriggersActions.png
[11]: ./media/app-service-logic-connector-db2/LogicApp_UpdateOrdersDb2_Outputs.png
[12]: ./media/app-service-logic-connector-db2/LogicApp_RemoveOrdersDb2_Create.png
[13]: ./media/app-service-logic-connector-db2/LogicApp_RemoveOrdersDb2_TriggersActions.png
[14]: ./media/app-service-logic-connector-db2/LogicApp_RemoveOrdersDb2_Outputs.png

