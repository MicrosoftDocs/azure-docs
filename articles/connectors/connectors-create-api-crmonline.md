---
title: Connect to Dynamics 365 - Azure Logic Apps | Microsoft Docs
description: Create and manage records with Dynamics 365 (online) REST APIs and Azure Logic Apps
author: Mattp123
ms.author: matp
ms.service: logic-apps
services: logic-apps
ms.reviewer: estfan, LADocs
ms.suite: integration
ms.topic: article
ms.date: 08/18/2018
tags: connectors
---

# Manage Dynamics 365 records with Azure Logic Apps

With Azure Logic Apps and the Dynamics 365 connector, you can 
create automated tasks and workflows based on your records in 
Dynamics 365. Your workflows can create records, update items, 
return records, and more in your Dynamics 365 account. 
You can include actions in your logic apps that get responses from 
Dynamics 365 and make the output available for other actions. 
For example, when an item is updated in Dynamics 365, 
you can send an email using Office 365.

This article shows how you can build a logic app that creates a task 
in Dynamics 365 whenever a new lead record is created in Dynamics 365.
If you're new to logic apps, review [What is Azure Logic Apps?](../logic-apps/logic-apps-overview.md).

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, 
<a href="https://azure.microsoft.com/free/" target="_blank">sign up for a free Azure account</a>. 

* A [Dynamics 365 account](https://dynamics.microsoft.com)

* Basic knowledge about 
[how to create logic apps](../logic-apps/quickstart-create-first-logic-app-workflow.md)

* The logic app where you want to access your Dynamics 365 account. 
To start your logic app with a Dynamics 365 trigger, you need a 
[blank logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md). 

## Add Dynamics 365 trigger

[!INCLUDE [Create connection general intro](../../includes/connectors-create-connection-general-intro.md)]

First, add a Dynamics 365 trigger that fires when 
a new lead record appears in Dynamics 365.

1. In the [Azure portal](https://portal.azure.com), 
open your blank logic app in Logic App Designer, if not open already.

1. In the search box, enter "Dynamics 365" as your filter. 
For this example, under the triggers list, 
select this trigger: **When a record is created**

   ![Select trigger](./media/connectors-create-api-crmonline/select-dynamics-365-trigger.png)

1. If you're prompted to sign in to Dynamics 365, sign in now.

1. Provide these trigger details:

   | Property | Required | Description | 
   |----------|----------|-------------| 
   | **Organization Name** | Yes | The name for your organization's Dynamics 365 instance to monitor, for example, "Contoso" |
   | **Entity Name** | Yes | The name for the entity to monitor, for example, "Leads" | 
   | **Frequency** | Yes | The unit of time to use with intervals when checking for updates related to the trigger |
   | **Interval** | Yes | The number of seconds, minutes, hours, days, weeks, or months that pass before the next check |
   ||| 

   ![Trigger details](./media/connectors-create-api-crmonline/trigger-details.png)

## Add Dynamics 365 action

Now add the Dynamics 365 action that creates a task record for the new lead record.

1. Under your trigger, choose **New step**.

1. In the search box, enter "Dynamics 365" as your filter. 
From the actions list, select this action: **Create a new record**

   ![Select action](./media/connectors-create-api-crmonline/select-action.png)

1. Provide these action details:

   | Property | Required | Description | 
   |----------|----------|-------------| 
   | **Organization Name** | Yes | The Dynamics 365 instance where you want to create the record, which doesn't have to be the same instance in your trigger, but is "Contoso" in this example |
   | **Entity Name** | Yes | The entity where you want to create the record, for example, "Tasks" | 
   | | |

   ![Action details](./media/connectors-create-api-crmonline/action-details.png)

1. When the **Subject** box appears in your action, 
click inside the **Subject** box so the dynamic content 
list appears. From this list, select the field values to 
include in the task record associated with the new lead record:

   | Field | Description | 
   |-------|-------------| 
   | **Last name** | The last name from the lead as the primary contact in the record |
   | **Topic** | The descriptive name for the lead in the record | 
   | | | 

   ![Task record details](./media/connectors-create-api-crmonline/create-record-details.png)

1. On the designer toolbar, choose **Save** for your logic app. 

1. To manually start the logic app, on the designer toolbar, choose **Run**.

   ![Run logic app](./media/connectors-create-api-crmonline/designer-toolbar-run.png)

1. Now create a lead record in Dynamics 365 so you can trigger your logic app's workflow.

## Add filter or query

To specify how to filter data in a Dynamics 365 action, 
choose **Show advanced options** in that action. 
You can then add a filter or order by query.
For example, you can use a filter query to get only the 
active accounts and order those records by account name. 
For this task, follow these steps:

1. Under **Filter query**, enter this OData filter query: `statuscode eq 1`

2. Under **Order By**, when the dynamic content list appears, 
select **Account Name**. 

   ![Specify filter and order](./media/connectors-create-api-crmonline/advanced-options.png)

For more information, see these Dynamics 365 
Customer Engagement Web API system query options: 

* [$filter](https://docs.microsoft.com/dynamics365/customer-engagement/developer/webapi/query-data-web-api#filter-results)
* [$orderby](https://docs.microsoft.com/dynamics365/customer-engagement/developer/webapi/query-data-web-api#order-results)

### Best practices for advanced options

When you specify a value for a field in an action or trigger, 
the value's data type must match the field type whether you 
manually enter the value or select the value from the dynamic content list.

This table describes some of field types and 
the required data types for their values.

| Field type | Required data type | Description | 
|------------|--------------------|-------------|
| Text fields | Single line of text | These fields require a single line of text or dynamic content that has the text type. <p><p>*Example fields*: **Description** and **Category** | 
| Integer fields | Whole number | Some fields require integer or dynamic content that has the integer type. <p><p>*Example fields*: **Percent Complete** and **Duration** | 
| Date fields | Date and Time | Some fields require a date with mm/dd/yyyy format or dynamic content that has the date type. <p><p>*Example fields*: **Created On**, **Start Date**, **Actual Start**, **Actual End**, and **Due Date** | 
| Fields requiring both a record ID and lookup type | Primary key | Some fields that reference another entity record require both a record ID and a lookup type. | 
||||

Expanding on these field types, here are example fields in 
Dynamics 365 triggers and actions that require both a 
record ID and the lookup type. This requirement means 
values that you select from the dynamic list won't work. 

| Field | Description | 
|-------|-------------|
| **Owner** | Must be either a valid user ID or team record ID. | 
| **Owner Type** | Must be either **systemusers** or **teams**. | 
| **Regarding** | Must be a valid record ID, such as an account ID or contact record ID. | 
| **Regarding Type** | Must be a lookup type, such as **accounts** or **contacts**. | 
| **Customer** | Must be a valid record ID, such as an account ID or contact record ID. | 
| **Customer Type** | Must be the lookup type, such as **accounts** or **contacts**. | 
|||

In this example, the action named **Create a new record** creates a new task record: 

![Create task record with record IDs and lookup types](./media/connectors-create-api-crmonline/create-record-advanced.png)

This action assigns the task record to a specific user ID or team record ID, 
based on the record ID in the **Owner** field and the lookup type in the **Owner Type** field:

![Owner record ID and lookup type](./media/connectors-create-api-crmonline/owner-record-id-and-lookup-type.png)

This action also adds an account record that's associated with the record ID 
added in the **Regarding** field and the lookup type in the **Regarding Type** field: 

![Regarding record ID and lookup type](./media/connectors-create-api-crmonline/regarding-record-id-lookup-type-account.png)

## Find record ID

To find a record ID, follow these steps: 

1. In Dynamics 365, open a record, such as an account record.

2. On the actions toolbar, choose one of these steps:

   * Choose **Pop Out**. ![popout record](./media/connectors-create-api-crmonline/popout-record.png) 
   * Choose **EMAIL A LINK** so you can copy the full URL into your default email program.

   The record ID appears in the URL between the `%7b` and `%7d` encoding characters:

   ![Find record ID](./media/connectors-create-api-crmonline/find-record-ID.png)

## Troubleshoot failed runs

To find and review failed steps in your logic app, 
you can view your logic app's runs history, status, 
inputs, outputs, and so on.

1. In the Azure portal, on your logic app's main menu, select **Overview**. 
In the **Runs history** section, which shows all the run statuses for your logic app, 
select a failed run for more information.

   ![Logic app run status](./media/connectors-create-api-crmonline/run-history.png)

1. Expand a failed step so you can view more details. 

   ![Expand failed step](./media/connectors-create-api-crmonline/expand-failed-step.png)

1. Review the step's details, such as the inputs and outputs, 
which can help you find the cause behind the failure.

   ![Failed step - inputs and outputs](./media/connectors-create-api-crmonline/expand-failed-step-inputs-outputs.png)

For more information about troubleshooting logic apps, see 
[Diagnosing logic app failures](../logic-apps/logic-apps-diagnosing-failures.md).

## Connector reference

For technical details, such as triggers, actions, and limits, 
as described by the connector's Swagger file, 
see the [connector's reference page](/connectors/crm/). 

## Get support

* For questions, visit the [Azure Logic Apps forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurelogicapps).
* To submit or vote on feature ideas, visit the [Logic Apps user feedback site](http://aka.ms/logicapps-wish).

## Next steps

* Learn about other [Logic Apps connectors](../connectors/apis-list.md)
