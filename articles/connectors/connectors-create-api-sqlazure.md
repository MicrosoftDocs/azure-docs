---
title: Connect to SQL Server or Azure SQL Database - Azure Logic Apps | Microsoft Docs
description: Create connections to SQL Server and Azure SQL Database with Azure Logic Apps
services: logic-apps
documentationcenter: 
author: ecfan
manager: cfowler
editor: 
tags: connectors

ms.assetid: d8a319d0-e4df-40cf-88f0-29a6158c898c
ms.service: logic-apps
ms.workload: logic-apps
ms.devlang: 
ms.tgt_pltfrm: 
ms.topic: article
ms.date: 05/07/2018
ms.author: estfan; LADocs
---

# Connect to SQL Server or Azure SQL Database with Azure Logic Apps

This article shows you how you can access 
data in a SQL database from your logic app. 
When you want to automate workflows 
that manage data in your SQL database, 
you can build logic apps that orchestrate those 
tasks and processes by using the SQL Server connector. 

You can create logic apps that trigger on events in your 
SQL database or in other systems, such as Dynamics CRM Online. 
You can add actions to your logic apps that get, insert, 
or delete rows of data, and execute SQL queries or 
stored procedures.

For example, when a record gets created in Dynamics CRM Online, 
your logic app can automatically add an item to your SQL database, 
and then send an email.

If you're new to logic apps, see 
[What is Azure Logic Apps](../logic-apps/logic-apps-overview.md) 
and [Quickstart: Create your first logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md). 

## Prerequisites

* If you don't have an Azure subscription, 
<a href="https://azure.microsoft.com/free/" target="_blank">sign up for a free Azure account</a>.

* The logic app you want to access your SQL database. 
To start your logic app with a SQL trigger, you need a blank logic app. 
See [Quickstart: Create your first logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md). 

* If you don't have an Azure SQL Database or SQL Server, 
see [Create an Azure SQL Database](../sql-database/sql-database-get-started-portal.md) 
or [Create a database - SQL Server](https://docs.microsoft.com/sql/relational-databases/databases/create-a-database). 
If you create an Azure SQL Database, 
you can also create sample databases that 
are included with Azure SQL Database. 

  After you've set up your SQL database, 
  find your server name, database name, 
  user name, and password.

  * For Azure SQL Database, the connection string has this information:

    "Server=tcp:<*yourServerName*>.database.windows.net,1433;Initial Catalog=<*yourDatabaseName*>;Persist Security Info=False;User ID=<*yourUserName*>;Password=<*yourPassword*>;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"

  * For SQL Server, the connection string has this information: 

    "Server=<*yourServerAddress*>;Database=<*yourDatabaseName*>;User Id=<*yourUserName*>;Password=<*yourPassword*>;"

  > [!NOTE]
  > Before you start running your logic app, 
  > make sure your database tables have data. 
  > Logic Apps doesn't return results from 
  > empty tables, including any schema values, 
  > when you perform operations, such as the "Get rows" action.

* Before you can connect to on-premises systems, such as SQL Server, 
from logic apps, you must [set up the on-premises data gateway](../logic-apps/logic-apps-gateway-connection.md) so that you can 
select the gateway when you create the SQL connection for your logic app.

<a name="create-connection"></a>

## Connect to SQL database

For your logic app to access any service, you must create 
a *connection* from your logic app to that service. 
If you didn't previously create a SQL connection, 
you're prompted for connection information when you 
add a SQL trigger or action to your logic app. 
The Logic Apps Designer provides an easy way for you to 
create this connection directly from your logic app. 

[!INCLUDE [Create a connection to SQL Server or Azure SQL Database](../../includes/connectors-create-api-sqlazure.md)]

<a name="add-sql-trigger"></a>

## Add SQL trigger

In Azure Logic Apps, every logic app must start with a [trigger](../logic-apps/logic-apps-overview.md#logic-app-concepts), 
which fires when a specific event happens or 
when a specific condition is met. Each time the trigger fires, 
the Logic Apps engine creates a logic app instance that 
starts and runs your workflow.

1. In the Azure portal, create a blank logic app, 
which opens Logic Apps Designer. 

2. In the search box, enter "sql server" as your filter. 
From the triggers list, select the SQL trigger that you want. 

   This example uses this trigger: 
   **SQL Server - When an item is created**

   ![Select "SQL Server - When an item is created" trigger](./media/connectors-create-api-sqlazure/sql-server-trigger.png)

3. If you're prompted for connection details, 
   then [create your SQL connection first](#create-connection). 
   Or, if your connection already exists, 
   select the **Table name** that you want from the list.

   ![Select table](./media/connectors-create-api-sqlazure/azure-sql-database-table.png)

4. Set the **Interval** and **Frequency**  for how often 
you want your logic app to check the table.

   This example only monitors the selected table. 
   To do anything useful, your logic app must 
   include other actions that respond to the trigger 
   and perform the tasks that you want. 
   For example, you might want to add other actions, 
   such as create a file so that you can view the new item, 
   or send email notifications.

5. When you're done, on the designer toolbar, choose **Save**, 
which also automatically enables and makes your logic app live in Azure. 

<a name="add-sql-action"></a>

## Add SQL action

In Azure Logic Apps, an [action](../logic-apps/logic-apps-overview.md#logic-app-concepts) 
is a step in your workflow that follows the trigger or another action. 
For this example, the logic app starts with a 
[Recurrence trigger](../connectors/connectors-native-recurrence.md).

1. On the Logic App Designer, under the trigger, 
choose **New step** > **Add an action**.

   ![Choose "New step", "Add an action"](./media/connectors-create-api-sqlazure/add-action.png)

2. In the search box, enter "sql server" as your filter. 
From the actions list, select any SQL action that you want. 

   This example uses this action: 
   **SQL Server - Get row**

   ![Enter "sql server", select "SQL Server - Get row"](./media/connectors-create-api-sqlazure/select-sql-get-row.png) 

3. If you're prompted for connection details, 
   then [create your SQL connection first](#create-connection). 
   Or, if your connection already exists, 
   select the **Table name** that you want from the list, 
   and enter the **Row ID** for the row that you want.

   ![Enter the table name and row ID](./media/connectors-create-api-sqlazure/table-row-id.png)
   
   This example only returns a row from a table. 
   To view the data in this row, add a different 
   action that creates a file with the fields from the table. 
   
   For example, you might create a file in a cloud storage account, 
   by adding a OneDrive action that uses the "FirstName" and "LastName" fields. 

4. When you're done, on the designer toolbar, choose **Save**, 
which makes your updates effective immediately. 

## Process data in bulk

When you want to work with more than one record, 
you can iterate over items by using [until loops](../logic-apps/logic-apps-control-flow-loops.md#until-loop) 
in your logic app. However, [loops have their limits](../logic-apps/logic-apps-limits-and-config.md). 
Sometimes you might have to work with large record sets, 
such as thousands or millions of rows, 
but you want to minimize calling the database. 
You can divide those records into smaller sets by using *pagination*. 
This technique helps you better control the resulting output and 
provide a cleaner structure for your result set. 

To implement this solution, create a stored procedure in your SQL instance, 
and then reference that procedure by using the SQL Server 
connector's **Execute stored procedure** action inside an until loop.

For solution details, see these articles:

* <a href="https://social.technet.microsoft.com/wiki/contents/articles/40060.sql-pagination-for-bulk-data-transfer-with-logic-apps.aspx" target="_blank">SQL Pagination for bulk data transfer with Logic Apps</a>

* [SELECT - ORDER BY Clause](https://docs.microsoft.com/sql/t-sql/queries/select-order-by-clause-transact-sql) 

## Connector-specific details

For more information about the triggers, actions, 
and limits defined by the connector's Swagger, 
see the [connector's details](/connectors/sql/). 

## Next steps

* Learn about other [Logic Apps connectors](../connectors/apis-list.md)

