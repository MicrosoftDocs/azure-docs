---
title: Manage data, worksheets, and tables in Excel Online
description: Manage data in worksheets and tables in Excel Online for Business or Excel Online for OneDrive by using Azure Logic Apps
services: logic-apps
ms.suite: integration
ms.reviewer: klam, logicappspm
ms.topic: conceptual
ms.date: 08/23/2018
tags: connectors
---

# Manage Excel Online data with Azure Logic Apps

With [Azure Logic Apps](../logic-apps/logic-apps-overview.md) and the 
[Excel Online for Business](/connectors/excelonlinebusiness/) connector or 
[Excel Online for OneDrive](/connectors/excelonline/) connector, 
you can create automated tasks and workflows based 
on your data in Excel Online for Business or OneDrive. 
This connector provides actions that help you work with 
your data and manage spreadsheets, for example:

* Create new worksheets and tables.
* Get and manage worksheets, tables, and rows.
* Add single rows and key columns.

You can then use the outputs from these actions with 
actions for other services. For example, 
if you use an action that creates worksheets each week, 
you can use another action that sends confirmation email 
by using the Office 365 Outlook connector.

If you're new to logic apps, review 
[What is Azure Logic Apps?](../logic-apps/logic-apps-overview.md)

> [!NOTE]
> The [Excel Online for Business](/connectors/excelonlinebusiness/) 
> and [Excel Online for OneDrive](/connectors/excelonline/) connectors 
> work with Azure Logic Apps and differ from the 
> [Excel connector for PowerApps](/connectors/excel/).

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, 
[sign up for a free Azure account](https://azure.microsoft.com/free/).

* An [Office 365 account](https://www.office.com/) 
for your work account or personal Microsoft account

  Your Excel data can exist as a comma-separated 
  value (CSV) file in a storage folder, for example, in OneDrive. 
  You can also use the same CSV file with the 
  [flat-file connector](../logic-apps/logic-apps-enterprise-integration-flatfile.md).

* Basic knowledge about 
[how to create logic apps](../logic-apps/quickstart-create-first-logic-app-workflow.md)

* The logic app where you want to access your Excel Online data. 
This connector provides only actions, so to start your logic app, 
select a separate trigger, for example, the **Recurrence** trigger.

## Add Excel action

1. In the [Azure portal](https://portal.azure.com), open your 
logic app in the Logic App Designer, if not already open.

1. Under the trigger, choose **New step**.

1. In the search box, enter "excel" as your filter. Under the actions list, 
select the action you want.

   > [!NOTE]
   > The Logic App Designer can't load tables that have 100 or more columns. 
   > If possible, reduce the number of columns in the selected table so that 
   > the designer can load the table.

1. If prompted, sign in to your Office 365 account.

   Your credentials authorize your logic app to create a 
   connection to Excel Online and access your data.

1. Continue providing the necessary details for the selected action 
and building your logic app's workflow.

## Connector reference

For technical details, such as triggers, actions, and limits, 
as described by the connector's OpenAPI (formerly Swagger) files, 
see these connector reference pages:

* [Excel Online for Business](/connectors/excelonlinebusiness/)
* [Excel Online for OneDrive](/connectors/excelonline/)

## Next steps

* Learn about other [Logic Apps connectors](../connectors/apis-list.md)
