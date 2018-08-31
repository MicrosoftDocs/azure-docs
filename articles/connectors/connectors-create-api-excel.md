---
title: Connect to Excel Online - Azure Logic Apps | Microsoft Docs
description: Manage data with Excel Online REST APIs and Azure Logic Apps
ms.service: logic-apps
services: logic-apps
author: ecfan
ms.author: estfan
ms.reviewer: klam, LADocs
ms.suite: integration
tags: connectors
ms.topic: article
ms.date: 08/23/2018
---

# Manage Excel Online data with Azure Logic Apps

With Azure Logic Apps and the Excel Online connector, 
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
<a href="https://azure.microsoft.com/free/" target="_blank">sign up for a free Azure account</a>. 

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

1. If prompted to sign in to your Office 365 account, choose **Sign in**. 

   Your credentials authorize your logic app to create a 
   connection to Excel Online and access your data.

1. Continue providing the necessary details for the selected action 
and building your logic app's workflow.

## Connector reference

For technical details, such as actions and limits, described 
by the connectors' Swagger files, see these connector reference pages:

* [Excel Online for Business](/connectors/excelonlinebusiness/) 
* [Excel Online for OneDrive](/connectors/excelonline/) 

## Get support

* For questions, visit the [Azure Logic Apps forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurelogicapps).
* To submit or vote on feature ideas, visit the [Logic Apps user feedback site](http://aka.ms/logicapps-wish).

## Next steps

* Learn about other [Logic Apps connectors](../connectors/apis-list.md)
