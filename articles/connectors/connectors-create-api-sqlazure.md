---
title: Add the Azure SQL Database connector in your Logic Apps | Microsoft Docs
description: Overview of Azure SQL Database connector with REST API parameters
services: ''
documentationcenter: ''
author: MandiOhlinger
manager: anneta
editor: ''
tags: connectors

ms.assetid: d8a319d0-e4df-40cf-88f0-29a6158c898c
ms.service: logic-apps
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/18/2016
ms.author: mandia; ladocs

---
# Get started with the Azure SQL Database connector
Using the Azure SQL Database connector, create workflows for your organization that manage data in your tables. 

With SQL Database, you:

* Build your workflow by adding a new customer to a customers database, or updating an order in an orders database.
* Use actions to get a row of data, insert a new row, and even delete. For example,  when a record is created in Dynamics CRM Online (a trigger), then insert a row in an Azure SQL Database (an action). 

This topic shows you how to use the SQL Database connector in a logic app, and also lists the actions.

To learn more about Logic Apps, see [What are logic apps](../logic-apps/logic-apps-what-are-logic-apps.md) and [create a logic app](../logic-apps/logic-apps-create-a-logic-app.md).

## Connect to Azure SQL Database
Before your logic app can access any service, you first create a *connection* to the service. A connection provides connectivity between a logic app and another service. For example, to connect to SQL Database, you first create a SQL Database *connection*. To create a connection, you enter the credentials you normally use to access the service you are connecting to. So, in SQL Database, enter your SQL Database credentials to create the connection. 

#### Create the connection
> [!INCLUDE [Create the connection to SQL Azure](../../includes/connectors-create-api-sqlazure.md)]
> 
> 

## Use a trigger
This connector does not have any triggers. Use other triggers to start the logic app, such as a Recurrence trigger, an HTTP Webhook trigger, triggers available with other connectors, and more. [Create a logic app](../logic-apps/logic-apps-create-a-logic-app.md) provides an example.

## Use an action
An action is an operation carried out by the workflow defined in a logic app. [Learn more about actions](../logic-apps/logic-apps-what-are-logic-apps.md#logic-app-concepts).

1. Select the plus sign. You see several choices: **Add an action**, **Add a condition**, or one of the **More** options.
   
    ![](./media/connectors-create-api-sqlazure/add-action.png)
2. Choose **Add an action**.
3. In the text box, type “sql” to get a list of all the available actions.
   
    ![](./media/connectors-create-api-sqlazure/sql-1.png) 
4. In our example, choose **SQL Server - Get row**. If a connection already exists, then select the **Table name** from the drop-down list, and enter the **Row ID** you want to return.
   
    ![](./media/connectors-create-api-sqlazure/sample-table.png)
   
    If you are prompted for the connection information, then enter the details to create the connection. [Create the connection](connectors-create-api-sqlazure.md#create-the-connection) in this topic describes these properties. 
   
   > [!NOTE]
   > In this example, we return a row from a table. To see the data in this row, add another action that creates a file using the fields from the table. For example, add a OneDrive action that uses the FirstName and LastName fields to create a new file in the cloud storage account. 
   > 
   > 
5. **Save** your changes (top left corner of the toolbar). Your logic app is saved and may be automatically enabled.

## Connector-specific details

View any triggers and actions defined in the swagger, and also see any limits in the [connector details](/connectors/sql/). 

## Next steps
[Create a logic app](../logic-apps/logic-apps-create-a-logic-app.md). Explore the other available connectors in Logic Apps at our [APIs list](apis-list.md).

