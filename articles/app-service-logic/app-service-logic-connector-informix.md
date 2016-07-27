<properties
   pageTitle="Using the Informix connector in Microsoft Azure App Service | Microsoft Azure"
   description="How to use the Informix connector with Logic app triggers and actions"
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

# Informix connector
>[AZURE.NOTE] This version of the article applies to Logic apps 2014-12-01-preview schema version.

Microsoft connector for Informix is an API app for connecting applications through Azure App Service to resources stored in an IBM Informix database. Connector includes a Microsoft Client to connect to remote Informix server computers across a TCP/IP network connection, including Azure hybrid connections to on-premises Informix servers using the Azure Service Bus Relay. Connector supports the following database operations:

- Read rows using SELECT
- Poll to read rows using SELECT COUNT followed by SELECT
- Add one row or multiple (bulk) rows using INSERT
- Alter one row or multiple (bulk) rows using UPDATE
- Remove one row or multiple (bulk) rows using DELETE
- Read to alter rows using SELECT CURSOR followed by UPDATE WHERE CURRENT OF CURSOR
- Read to remove rows using SELECT CURSOR followed by UPDATE WHERE CURRENT OF CURSOR
- Run procedure with input and output parameters, return value, resultset, using CALL
- Custom commands and composite operations using SELECT, INSERT, UPDATE, DELETE

## Triggers and actions
Connector supports the following Logic app triggers and actions:

Triggers | Actions
--- | ---
<ul><li>Poll Data</li></ul> | <ul><li>Bulk Insert</li><li>Insert</li><li>Bulk Update</li><li>Update</li><li>Call</li><li>Bulk Delete</li><li>Delete</li><li>Select</li><li>Conditional update</li><li>Post to EntitySet</li><li>Conditional delete</li><li>Select single entity</li><li>Delete</li><li>Upsert to EntitySet</li><li>Custom commands</li><li>Composite operations</li></ul>


## Create the Informix connector
You can define a connector within a Logic app or from the Azure Marketplace, like in the following example:  

1. In the Azure startboard, select **Marketplace**.
2. In the **Everything** blade, type **informix** in the **Search Everything** box, and then click the enter key.
3. In the search everything results pane, select **Informix connector**.
4. In the Informix connector description blade, select **Create**.
5. In the Informix connector package blade, enter the Name (e.g. "InformixConnectorNewOrders"), App Service Plan, and other properties.
6. Select **Package settings**, and enter the following package settings.

	Name | Required |  Description
--- | --- | ---
ConnectionString | Yes | Informix Client connection string (e.g., "Network Address=servername;Network Port=9089;User ID=username;Password=password;Initial Catalog=nwind;Default Schema=informix").
Tables | Yes | Comma separated list of table, view and alias names required for OData operations and to generate swagger documentation with examples (e.g. "NEWORDERS").
Procedures | Yes | Comma separated list of procedure and function names (e.g. "SPORDERID").
OnPremise | No | Deploy on-premises using Azure Service Bus Relay.
ServiceBusConnectionString | No | Azure Service Bus Relay connection string.
PollToCheckData | No | SELECT COUNT statement to use with a Logic app trigger (e.g. "SELECT COUNT(\*) FROM NEWORDERS WHERE SHIPDATE IS NULL").
PollToReadData | No | SELECT statement to use with a Logic app trigger (e.g. "SELECT \* FROM NEWORDERS WHERE SHIPDATE IS NULL FOR UPDATE").
PollToAlterData | No | UPDATE or DELETE statement to use with a Logic app trigger (e.g. "UPDATE NEWORDERS SET SHIPDATE = CURRENT DATE WHERE CURRENT OF &lt;CURSOR&gt;").

7. Select **OK**, and then Select **Create**.
8. When complete, the Package Settings look similar to the following:  
![][1]


## Logic app with Informix connector action to add data ##
You can define a Logic app action to add data to an Informix table using an API Insert or Post to Entity OData operation. For example, you can insert a new customer order record, by processing a SQL INSERT statement against a table defined with an identity column, returning the identity value or the rows affected to the Logic app (SELECT ORDID FROM FINAL TABLE (INSERT INTO NEWORDERS (CUSTID,SHIPNAME,SHIPADDR,SHIPCITY,SHIPREG,SHIPZIP) VALUES (?,?,?,?,?,?))).

> [AZURE.TIP] Informix Connection "*Post to EntitySet*" returns the identity column value and "*API Insert*" returns rows affected

1. In the Azure startboard, select **+** (plus sign), **Web + Mobile**, and then **Logic app**.
2. Enter the Name (e.g. "NewOrdersInformix"), App Service Plan, other properties, and then select **Create**.
3. In the Azure startboard, select the Logic app you just created, **Settings**, and then **Triggers and actions**.
4. In the Triggers and actions blade, select **Create from Scratch** within the Logic app Templates.
5. In the API Apps panel, select **Recurrence**, set a frequency and interval, and then **checkmark**.
6. In the API Apps panel, select **Informix connector**, expand the operations list to select **Insert into NEWORDER**.
7. Expand the parameters list to enter the following values:  

	Name | Value
--- | --- 
CUSTID | 10042
SHIPID | 10000
SHIPNAME | Lazy K Kountry Store 
SHIPADDR | 12 Orchestra Terrace
SHIPCITY | Walla Walla 
SHIPREG | WA
SHIPZIP | 99362 

8. Select the **checkmark** to save the action settings, and then **Save**.
9. The settings should look as follows:  
![][3]  
10. In the **All runs** list under **Operations**, select the first-listed item (most recent run). 
11. In the **Logic app run** blade, select the **ACTION** item **informixconnectorneworders**.
12. In the **Logic app action** blade, select the **INPUTS LINK**. Informix connector uses the inputs to process a parameterized INSERT statement.
13. In the **Logic app action** blade, select the **OUTPUTS LINK**. The inputs should look as follows:  
![][4]

#### What you need to know

- Connector truncates Informix table names when forming Logic app action names. For example, the operation **Insert into NEWORDERS** is truncated to **Insert into NEWORDER**.
- After saving the Logic app **Triggers and actions**, Logic app processes the operation. There may be a delay of a number of seconds (e.g. 3-5 seconds) before Logic app processes the operation. Optionally, you can click **Run Now** to process the operation.
- Informix connector defines EntitySet members with attributes, including whether the member corresponds to an Informix column with a default or generated columns (e.g. identity). Logic app displays a red asterisk next to the EntitySet member ID name, to denote Informix columns that require values. You should not enter a value for the ORDID member, which corresponds to Informix identity column. You may enter values for other optional members (ITEMS, ORDDATE, REQDATE, SHIPID, FREIGHT, SHIPCTRY), which correspond to Informix columns with default values. 
- Informix connector returns to Logic app the response on the Post to EntitySet that includes the values for identity columns, which is derived from the DRDA SQLDARD (SQL Data Area Reply Data) on the prepared SQL INSERT statement. Informix server does not return the inserted values for columns with default values.  


## Logic app with Informix connector action to add bulk data ##
You can define a Logic app action to add data to an Informix table using an API Bulk Insert operation. For example, you can insert two new customer order records, by processing a SQL INSERT statement using an array of row values against a table defined with an identity column, returning the rows affected to the Logic app (SELECT ORDID FROM FINAL TABLE (INSERT INTO NEWORDERS (CUSTID,SHIPNAME,SHIPADDR,SHIPCITY,SHIPREG,SHIPZIP) VALUES (?,?,?,?,?,?))).

1. In the Azure startboard, select **+** (plus sign), **Web + Mobile**, and then **Logic app**.
2. Enter the Name (e.g. "NewOrdersBulkInformix"), App Service Plan, other properties, and then select **Create**.
3. In the Azure startboard, select the Logic app you just created, **Settings**, and then **Triggers and actions**.
4. In the Triggers and actions blade, select **Create from Scratch** within the Logic app Templates.
5. In the API Apps panel, select **Recurrence**, set a frequency and interval, and then **checkmark**.
6. In the API Apps panel, select **Informix connector**, expand the operations list to select **Bulk Insert into NEW**.
7. Enter the **rows** value as an array. For example, copy and paste the following:  

	```
    [{"custid":10081,"shipid":10000,"shipname":"Trail's Head Gourmet Provisioners","shipaddr":"722 DaVinci Blvd.","shipcity":"Kirkland","shipreg":"WA","shipzip":"98034"},{"custid":10088,"shipid":10000,"shipname":"White Clover Markets","shipaddr":"305 14th Ave. S. Suite 3B","shipcity":"Seattle","shipreg":"WA","shipzip":"98128","shipctry":"USA"}]
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

- Connector truncates Informix table names when forming Logic app action names. For example, the operation **Bulk Insert into NEWORDERS** is truncated to **Bulk Insert into NEW**.
- Informix database may be case sensitive to table and column names. For example, the Bulk Insert operation array column names may need to be specified in lower case ("custid") instead of upper case ("CUSTID").
- By omitting identity columns (e.g. ORDID), nullable columns (e.g. SHIPDATE), and columns with default values (e.g. ORDDATE, REQDATE, SHIPID, FREIGHT, SHIPCTRY), Informix database generates values.
- By specifying "today" and "tomorrow", Informix connector generates "CURRENT DATE" and "CURRENT DATE + 1 DAY" functions (e.g. REQDATE). 


## Logic app with Informix connector trigger to read, alter or delete data ##
You can define a Logic app trigger to poll and read data from an Informix table using an API Poll Data composite operation. For example, you can read one or more new customer order records, returning the records to the Logic app. The Informix Connection package/app settings should look as follows:

	App Setting | Value
--- | --- | ---
PollToCheckData | SELECT COUNT(\*) FROM NEWORDERS WHERE SHIPDATE IS NULL
PollToReadData | SELECT \* FROM NEWORDERS WHERE SHIPDATE IS NULL FOR UPDATE
PollToAlterData | <no value specified>


Also, you can define a Logic app trigger to poll, read and alter data in an Informix table using an API Poll Data composite operation. For example, you can read one or more new customer order records, update the row values, returning the selected (before update) records to the Logic app. The Informix Connection package/app settings should look as follows:

	App Setting | Value
--- | --- | ---
PollToCheckData | SELECT COUNT(\*) FROM NEWORDERS WHERE SHIPDATE IS NULL
PollToReadData | SELECT \* FROM NEWORDERS WHERE SHIPDATE IS NULL FOR UPDATE
PollToAlterData | UPDATE NEWORDERS SET SHIPDATE = CURRENT DATE WHERE CURRENT OF &lt;CURSOR&gt;


Further, you can define a Logic app trigger to poll, read and remove data from an Informix table using an API Poll Data composite operation. For example, you can read one or more new customer order records, delete the rows, returning the selected (before delete) records to the Logic app. The Informix Connection package/app settings should look as follows:

	App Setting | Value
--- | --- | ---
PollToCheckData | SELECT COUNT(\*) FROM NEWORDERS WHERE SHIPDATE IS NULL
PollToReadData | SELECT \* FROM NEWORDERS WHERE SHIPDATE IS NULL FOR UPDATE
PollToAlterData | DELETE NEWORDERS WHERE CURRENT OF &lt;CURSOR&gt;

In this example, Logic app will poll, read, update, and then re-read data in the Informix table.

1. In the Azure startboard, select **+** (plus sign), **Web + Mobile**, and then **Logic app**.
2. Enter the Name (e.g. "ShipOrdersInformix"), App Service Plan, other properties, and then select **Create**.
3. In the Azure startboard, select the Logic app you just created, **Settings**, and then **Triggers and actions**.
4. In the Triggers and actions blade, select **Create from Scratch** within the Logic app Templates.
5. In the API Apps panel, select **Informix connector**, set a frequency and interval, and then **checkmark**.
6. In the API Apps panel, select **Informix connector**, expand the operations list to select **Select from NEWORDERS**.
7. Select the **checkmark** to save the action settings, and then **Save**. The settings should look as follows:  
![][10]
8. Click to close the **Triggers and actions** blade, and then click to close the **Settings** blade.
9. In the **All runs** list under **Operations**, click the first-listed item (most recent run).
10. In the **Logic app run** blade, click the **ACTION** item.
11. In the **Logic app action** blade, click the **OUTPUTS LINK**. The outputs should look as follows:  
![][11]


## Logic app with Informix connector action to remove data ##
You can define a Logic app action to remove data from an Informix table using an API Delete or Post to Entity OData operation. For example, you can insert a new customer order record, by processing a SQL INSERT statement against a table defined with an identity column, returning the identity value or the rows affected to the Logic app (SELECT ORDID FROM FINAL TABLE (INSERT INTO NEWORDERS (CUSTID,SHIPNAME,SHIPADDR,SHIPCITY,SHIPREG,SHIPZIP) VALUES (?,?,?,?,?,?))).

## Create Logic app using Informix connector to remove data ##
You can create a new Logic app from within the Azure Marketplace, and then use the Informix connector as an action to remove customer orders. For example, you can use the Informix connector conditional Delete operation to process a SQL DELETE statement (DELETE FROM NEWORDERS WHERE ORDID >= 10000).

1. In the hub menu of the Azure **Start** board, click **+** (plus sign), click **Web + Mobile**, and then click **Logic app**. 
2. In the **Create Logic app** blade, type a **Name**, for example **RemoveOrdersInformix**.
3. Select or define values for the other settings (e.g. service plan, resource group).
4. The settings should look as follows. Click **Create**:  
![][12]
5. In the **Settings** blade, click **Triggers and actions**.
6. In the **Triggers and actions** blade, in the **Logic app Templates** list, click **Create from Scratch**.
7. In the **Triggers and actions** blade, in the **API Apps** panel, within the resource group, click **Recurrence**.
8. On the Logic app design surface, click the **Recurrence** item, set a **Frequency** and **Interval**, for example **Days** and **1**, and then click the **checkmark** to save the recurrence item settings.
9. In the **Triggers and actions** blade, in the **API Apps** panel, within the resource group, click **Informix connector**.
10. On the Logic app design surface, click the **Informix connector** action item, click the ellipses (**...**) to expand the operations list, and then click **Conditional delete from N**.
11. On the Informix connector action item, type **ordid ge 10000** for an **expression that identifies a subset of entries**.
12. Click the **checkmark** to save the action settings, and then click **Save**. The settings should look as follows:  
![][13]
13. Click to close the **Triggers and actions** blade, and then click to close the **Settings** blade.
14. In the **All runs** list under **Operations**, click the first-listed item (most recent run).
15. In the **Logic app run** blade, click the **ACTION** item.
16. In the **Logic app action** blade, click the **OUTPUTS LINK**. The outputs should look as follows:  
![][14]

**Note:** Logic app designer truncates table names. For example the operation **Conditional delete from NEWORDERS** is truncated to **Conditional delete from N**.


> [AZURE.TIP] Use the following SQL statements to create the sample table and stored procedures. 

You can create the sample NEWORDERS table using the following Informix SQL DDL statements:
 
    create table neworders (  
 		ordid serial(10000) unique ,  
 		custid int not null ,  
 		empid int not null default 10000 ,  
 		orddate date not null default today ,  
 		reqdate date default today ,  
 		shipdate date ,  
 		shipid int not null default 10000 ,  
 		freight decimal (9,2) not null default 0.00 ,  
 		shipname char (40) not null ,  
 		shipaddr char (60) not null ,  
 		shipcity char (20) not null ,  
 		shipreg char (15) not null ,  
 		shipzip char (10) not null ,  
 		shipctry char (15) not null default ''USA'' 
 		)


You can create the sample SPORDERID stored procedure using the following Informix DDL statement:
 
    create procedure sporderid ( ord_id int)  
 		returning int, int, int, date, date, date, int, decimal (9,2), char (40), char (60), char (20), char (15), char (10), char (15)  
 		define xordid, xcustid, xempid, xshipid int;  
 		define xorddate, xreqdate, xshipdate date;  
 		define xfreight decimal (9,2);  
 		define xshipname char (40);  
 		define xshipaddr char (60);  
 		define xshipcity char (20);  
 		define xshipreg, xshipctry char (15);  
 		define xshipzip char (10);  
 		select ordid, custid, empid, orddate, reqdate, shipdate, shipid, freight, shipname, shipaddr, shipcity, shipreg, shipzip, shipctry  
 			into xordid, xcustid, xempid, xorddate, xreqdate, xshipdate, xshipid, xfreight, xshipname, xshipaddr, xshipcity, xshipreg, xshipzip, xshipctry  
 			from neworders where ordid = ord_id;  
 		return xordid, xcustid, xempid, xorddate, xreqdate, xshipdate, xshipid, xfreight, xshipname, xshipaddr, xshipcity, xshipreg, xshipzip, xshipctry;  
    end procedure; 


## Hybrid configuration (Optional)

> [AZURE.NOTE] This step is required only if you are using DB2 connector on-premises behind your firewall.

App Service uses the Hybrid Configuration Manager to connect securely to your on-premises system. If connector uses an on-premises IBM DB2 Server for Windows, the Hybrid Connection Manager is required.

See [Using the Hybrid Connection Manager](app-service-logic-hybrid-connection-manager.md).


## Do more with your connector
Now that the connector is created, you can add it to a business workflow using a Logic app. See [What are Logic apps?](app-service-logic-what-are-logic-apps.md).

Create the API Apps using REST APIs. See [Connectors and API Apps Reference](http://go.microsoft.com/fwlink/p/?LinkId=529766).

You can also review performance statistics and control security to the connector. See [Manage and Monitor your built-in API Apps and connectors](app-service-logic-monitor-your-connectors.md).


<!--Image references-->
[1]: ./media/app-service-logic-connector-informix/ApiApp_InformixConnector_Create.png
[2]: ./media/app-service-logic-connector-informix/LogicApp_NewOrdersInformix_Create.png
[3]: ./media/app-service-logic-connector-informix/LogicApp_NewOrdersInformix_TriggersActions.png
[4]: ./media/app-service-logic-connector-informix/LogicApp_NewOrdersInformix_Outputs.png
[5]: ./media/app-service-logic-connector-informix/LogicApp_NewOrdersBulkInformix_Create.png
[6]: ./media/app-service-logic-connector-informix/LogicApp_NewOrdersBulkInformix_TriggersActions.png
[7]: ./media/app-service-logic-connector-informix/LogicApp_NewOrdersBulkInformix_Inputs.png
[8]: ./media/app-service-logic-connector-informix/LogicApp_NewOrdersBulkInformix_Outputs.png
[9]: ./media/app-service-logic-connector-informix/LogicApp_UpdateOrdersInformix_Create.png
[10]: ./media/app-service-logic-connector-informix/LogicApp_UpdateOrdersInformix_TriggersActions.png
[11]: ./media/app-service-logic-connector-informix/LogicApp_UpdateOrdersInformix_Outputs.png
[12]: ./media/app-service-logic-connector-informix/LogicApp_RemoveOrdersInformix_Create.png
[13]: ./media/app-service-logic-connector-informix/LogicApp_RemoveOrdersInformix_TriggersActions.png
[14]: ./media/app-service-logic-connector-informix/LogicApp_RemoveOrdersInformix_Outputs.png


