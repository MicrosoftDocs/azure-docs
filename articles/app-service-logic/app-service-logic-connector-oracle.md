<properties
   pageTitle="Using the Oracle Database Connector in Logic apps | Microsoft Azure App Service"
   description="How to create and configure the Oracle Database Connector or API app and use it in a Logic app in Azure App Service"
   services="app-service\logic"
   documentationCenter=".net,nodejs,java"
   authors="anuragdalmia"
   manager="erikre"
   editor=""/>

<tags
   ms.service="logic-apps"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration"
   ms.date="05/31/2016"
   ms.author="sameerch"/>


# Get started with the Oracle database connector and add it to your Logic app
>[AZURE.NOTE] This version of the article applies to Logic apps 2014-12-01-preview schema version.

Connect to an on-premises Oracle Database server to create and change your information or data. Connectors can be used in Logic apps to retrieve, process, or push data as a part of a "workflow". When you use the Oracle connector in your workflow, you can achieve a variety of scenarios. For example, you can:

- Expose a section of the data residing in your Oracle database using a web or mobile application.
- Insert data into your Oracle database table for storage. For example, you can enter employee records, update sales orders, and so on.
- Get data from Oracle and use it in a business process. For example, you can get customer records and put those customer records in SalesForce.


## Triggers and actions
*Triggers* are events that happen. For example, when an order is updated or when a new customer is added. An *Action* is the result of the trigger. For example, when an order is updated, send an alert to the salesperson. Or, when a new customer is added, send a welcome email to the new customer.

The Oracle Database connector can be used as a trigger or an action in a Logic app and supports data in JSON and XML formats. For every table included in your package settings (more on that later in this topic), there is a set of JSON actions and a set of XML actions. If you are using an XML trigger or action, you can use the [Transform API App](app-service-logic-transform-xml-documents.md) to convert data into another XML data format.

The Oracle database connector has the following Triggers and Actions available:

Triggers | Actions
--- | ---
Poll Data | <ul><li>Insert Into Table</li><li>Update Table</li><li>Select From Table</li><li>Delete From Table</li><li>Call Stored Procedure</li>


## Create an Oracle database connector

A connector can be created within a Logic app or be created directly from the Azure Marketplace. To create a connector from the Marketplace:

1. In the Azure startboard, select **Marketplace**.
2. Select **API Apps** and search for “Oracle database connector”.
3. Enter the Name, App Service Plan, and other properties.
4. Enter the following package settings:

	Name | Required |  Description
--- | --- | ---
Data Source | Yes | A data source (net service) name that is specified in the tnsnames.ora file on the computer where the Oracle client is installed. For information about data source names and tnsnames.ora, see [Configuring the Oracle Client](http://msdn.microsoft.com/library/dd787872.aspx).
User Name | Yes | Enter a user name to connect to the Oracle server.
Password | Yes | Enter the user name password.
Service Bus Connection String | Yes | If you're connecting to on-premises, enter the Service Bus relay connection string.<br/><br/>[Using the Hybrid Connection Manager](app-service-logic-hybrid-connection-manager.md)<br/>[Service Bus Pricing](https://azure.microsoft.com/pricing/details/service-bus/)
Tables | No | Enter the tables in the database that are allowed to be modified by the connector. For example, enter *OrdersTable,EmployeeTable*.
Stored Procedures | No | Enter the stored procedures in the database that can be called by the connector. For example, enter *IsEmployeeEligible,CalculateOrderDiscount*.
Functions | No | Enter the functions in the database that can be called by the connector. For example, enter *IsEmployeeEligible,CalculateOrderDiscount*.
Package Entities | No | Enter the packages in the database that can be called by the connector. For example, enter *PackageOrderProcessing.CompleteOrder,PackageOrderProcessing.GenerateBill*.
Data Available Statement | No | Enter the statement to determine whether any data is available for polling. For example, enter *SELECT * from table_name*.
Poll Type | No | Enter the polling type. The allowed values are "Select", "Procedure", "Function" and "Package".
Poll Statement | No | Enter the statement to poll the Oracle Server database. For example, enter *SELECT * from table_name*.
Post Poll Statement | No | Enter the statement to execute after the poll. For example, enter *DELETE * from table_name*.

5. When complete, the Package Settings look similar to the following:
<br/>
![][1]  


## Use the connector as a Trigger
Let's look at a simple Logic app that polls data from a Oracle table, adds the data in another table, and updates the data.

### Add the Trigger
1. When creating or editing a Logic app, select the Oracle connector you created as the trigger. This lists the available triggers: **Poll Data (JSON)** and **Poll Data (XML)**:
<br/>
![][5]

2. Select the **Poll Data (JSON)** trigger, enter the frequency, and click the ✓:
<br/>
![][6]

3. The trigger now appears as configured in the Logic app. The output(s) of the trigger is shown and can be used as inputs in any subsequent actions:
<br/>
![][7]

## Use the connector as an Action
Using our simple Logic app that polls data from an Oracle table, adds the data in another table, and updates the data.

To use the Oracle connector as an action, enter the name of the Tables and/or Stored Procedures you entered when you created the Oracle connector:

1. Select the same Oracle connector from gallery as an action. Select one of the Insert actions, like *Insert Into TempEmployeeDetails (JSON)*:
<br/>
![][8]

2. Enter the input values of the record to be inserted, and click on the ✓:
<br/>
![][9]

3. From the gallery, select the same Oracle connector you created. As an action, select the Update action on the same table, like *Update TempEmployeeDetails*:
<br/>
![][11]

4. Enter the input values for the update action, and click on the ✓:
<br/>
![][12]

You can test the Logic app by adding a new record in the table that is being polled.

## Hybrid Configuration

> [AZURE.NOTE] This step is required only if you are using Oracle on-premises behind your firewall.

App Service uses the Hybrid Configuration Manager to connect securely to your on-premises system. If you're connector uses an on-premises Oracle, the Hybrid Connection Manager is required.

See [Using the Hybrid Connection Manager](app-service-logic-hybrid-connection-manager.md).

## Do more with your connector
Now that the connector is created, you can add it to a business workflow using a Logic app. See [What are Logic apps?](app-service-logic-what-are-logic-apps.md).

>[AZURE.NOTE] If you want to get started with Azure Logic apps before signing up for an Azure account, go to [Try Logic app](https://tryappservice.azure.com/?appservice=logic), where you can immediately create a short-lived starter Logic app in App Service. No credit cards required; no commitments.

View the Swagger REST API reference at [Connectors and API Apps Reference](http://go.microsoft.com/fwlink/p/?LinkId=529766).

You can also review performance statistics and control security to the connector. See [Manage and Monitor your built-in API Apps and connector](app-service-logic-monitor-your-connectors.md).


<!--Image references-->
[1]: ./media/app-service-logic-connector-oracle/Create.png
[5]: ./media/app-service-logic-connector-oracle/LogicApp1.png
[6]: ./media/app-service-logic-connector-oracle/LogicApp2.png
[7]: ./media/app-service-logic-connector-oracle/LogicApp3.png
[8]: ./media/app-service-logic-connector-oracle/LogicApp4.png
[9]: ./media/app-service-logic-connector-oracle/LogicApp5.png
[10]: ./media/app-service-logic-connector-oracle/LogicApp6.png
[11]: ./media/app-service-logic-connector-oracle/LogicApp7.png
[12]: ./media/app-service-logic-connector-oracle/LogicApp8.png
