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

To automate workflows that manage data for SQL Server or 
Azure SQL Database, you can build logic apps that orchestrate 
tasks and processes by using the SQL Server connector. 
This article shows you how to connect your logic 
app to SQL Server or Azure SQL Database. 

Here are some example tasks that you can automate and 
orchestrate with logic apps and SQL Server or Azure SQL Database:

* Get, insert, or delete rows of data. 
* Add customers to a customer database, 
or update orders in an order database. 
* When a new item gets added to a database, 
send a confirmation email.

So, for example, you can create a logic app that 
automatically inserts a row in an Azure SQL Database 
when a new record is created in Dynamics CRM Online. 
If you're new to logic apps, see 
[What is Azure Logic Apps](../logic-apps/logic-apps-overview.md) 
and [Quickstart: Create your first logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md). 

## Prerequisites

* If you don't have an Azure subscription, 
<a href="https://azure.microsoft.com/free/" target="_blank">sign up for a free Azure account</a>.

* The logic app where you want to connect to your SQL database

* If you don't have an Azure SQL Database or SQL Server, 
see [Create an Azure SQL Database](../sql-database/sql-database-get-started-portal.md) 
or [Create a database - SQL Server](https://docs.microsoft.com/sql/relational-databases/databases/create-a-database). 
If you create an Azure SQL Database, 
you can also create the sample databases that are included with SQL. 

  After you have your SQL database set up, you'll need your server name, 
  database name, user name, and password.

  * For Azure SQL Database, the connection string has this information:

    "Server=tcp:<*yourServerName*>.database.windows.net,1433;Initial Catalog=<*yourDatabaseName*>;Persist Security Info=False;User ID=<*yourUserName*>;Password=<*yourPassword*>;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"

  * For SQL Server, the connection string has this information: 

    "Server=<*yourServerAddress*>;Database=<*yourDatabaseName*>;User Id=<*yourUserName*>;Password=<*yourPassword*>;"

* Before you can use on-premises systems, such as SQL Server, 
with logic apps, you must [install and set up the on-premises data gateway](../logic-apps/gateway-connection.md). You need the gateway 
information for creating the SQL database connection in your logic app.

<a name="create-connection"></a>

## Connect to SQL database

For your logic app to access any service, you must create 
a *connection* from your logic app to that service. 
This step happens when you go to add a SQL Server or 
Azure SQL Database operation to your logic app. 
At that time, you're prompted to create the connection 
and provide your credentials for accessing the service. 
The Logic Apps Designer provides an easy way for you to 
create this connection directly from your logic app. 

<a name="add-sql-trigger"></a>

## Add SQL trigger

In Azure Logic Apps, every logic app must start with a [trigger](../logic-apps/logic-apps-overview.md#logic-app-concepts), 
which fires when a specific event happens or 
when a specific condition is met. Each time the trigger fires, 
the Logic Apps engine creates a logic app instance that starts and runs your workflow.

1. On the Logic Apps Designer, in the search box, 
enter "sql server" as your filter. 
You can select any trigger for your logic app, 
but for this example, select this trigger: 
**SQL Server - When an item is created**

   ![Find "SQL Server" connector, choose "SQL Server - When an item is created" trigger](./media/connectors-create-api-sqlazure/add-action.png)


5. On the designer toolbar, choose **Save**, 
which also automatically enables and makes your logic app live in Azure. 

<a name="add-sql-action"></a>

## Add SQL action

In Azure Logic Apps, an [action](../logic-apps/logic-apps-overview.md#logic-app-concepts) 
is a step in your workflow that follows the trigger or another action. 
For this example, the logic app starts with a [Recurrence trigger](../connectors/connectors-native-recurrence.md).

1. On the Logic App Designer, under the trigger, 
choose **New step** > **Add an action**.

   ![Choose "New step", "Add an action"](./media/connectors-create-api-sqlazure/add-action.png)

2. In the search box, enter "sql server" as your filter. 
You can select any action for your logic app, 
but for this example, select this action: **SQL Server - Get row**

   ![Enter "sql server", select "SQL Server - Get row"](./media/connectors-create-api-sqlazure/select-sql-get-row.png) 

3. If you're prompted for connection information, 
   then [enter your connection details](#create-connection). 

   Otherwise, if your connection already exists, 
   select the **Table name** from the list instead, 
   and enter the **Row ID** that you want to return.

   ![Enter the table name and row ID](./media/connectors-create-api-sqlazure/sample-table.png)
   
   In this example, we return a row from a table. 
   To see the data in this row, 
   add another action that creates a file 
   using the fields from the table. For example, 
   add a OneDrive action that uses the FirstName 
   and LastName fields to create a new file in the cloud storage account. 

4. On the designer toolbar, choose **Save**, 
which also automatically enables and makes your logic app live in Azure. 

## Connector-specific details

View any triggers and actions defined in the swagger, and also see any limits in the [connector details](/connectors/sql/). 

## Next steps

* Learn about other [Logic Apps connectors](../logic-apps/apis-list.md).

