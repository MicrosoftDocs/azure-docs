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
ms.date: 08/23/2016
---

# Manage Excel Online data with Azure Logic Apps

With Azure Logic Apps and the Excel Online connector, 
you can create automated tasks and workflows based 
on your data in Excel Online for Business or OneDrive. 
Your workflows can perform these actions and others with 
your data, for example:

* Create new worksheets and tables.
* Get and manage worksheets, tables, and rows.
* Add single rows and key columns.

You can include actions in your logic apps that get responses from 
Excel Online and make the output available for other actions. 
For example, when a row is updated in Excel Online, 
you can send an email using Office 365 Outlook. 
You can store your Excel data as a comma-separated 
value (CSV) file in a storage folder such as 
[OneDrive](../connectors/connectors-create-api-onedrive.md). 
You can also use your CSV file with the 
[flat-file connector](../logic-apps/logic-apps-enterprise-integration-flatfile.md).
If you're new to logic apps, review 
[What is Azure Logic Apps?](../logic-apps/logic-apps-overview.md)

> [!NOTE]
> The [Excel Online for Business](/connectors/excelonlinebusiness/) 
> and [Excel Online for OneDrive](/connectors/excelonline/) connectors 
> replace the [legacy version](/connectors/excel/), which applied to PowerApps only.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, 
<a href="https://azure.microsoft.com/free/" target="_blank">sign up for a free Azure account</a>. 

* An [Office 365 account](https://www.office.com/) 
for your work account or personal Microsoft account

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

For technical details, such as triggers, actions, and limits, as described 
by the connector's Swagger file, see these connector reference pages:

* [Excel Online for Business](/connectors/excelonlinebusiness/) 
* [Excel Online for OneDrive](/connectors/excelonline/) 

> [!NOTE]
> The Excel Online for Business and OneDrive connectors 
> replace the [legacy version](connectors/excel/), 
> which applied only to Microsoft PowerApps.

## Get support

* For questions, visit the [Azure Logic Apps forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurelogicapps).
* To submit or vote on feature ideas, visit the [Logic Apps user feedback site](http://aka.ms/logicapps-wish).

## Next steps

* Learn about other [Logic Apps connectors](../connectors/apis-list.md)
