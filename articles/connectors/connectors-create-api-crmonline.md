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

# Create and manage records in Dynamics 365 with Azure Logic Apps

With Azure Logic Apps and the Dynamics 365 connector, 
you can create automated tasks and workflows based on 
the data you get from Dynamics 365. Your workflows can create records, 
update items, return records, and more in your Dynamics 365 account. 
You can include actions in your logic apps that get responses from 
Dynamics 365 and make the output available for other actions. 
For example, when an item is updated in Dynamics 365, 
you can send an email using Office 365.

This article shows how you create a logic app that creates a task 
in Dynamics 365 whenever a new lead record is created in Dynamics 365.
If you're new to logic apps, review 
[What is Azure Logic Apps](../logic-apps/logic-apps-overview.md).

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, 
<a href="https://azure.microsoft.com/free/" target="_blank">sign up for a free Azure account</a>. 

* A [Dynamics 365 account](https://dynamics.microsoft.com)

* The logic app where you want to access your Dynamics 365 account. 
To start your logic app with an Dynamics 365 trigger, you need a 
[blank logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md). 

* Basic knowledge about 
[how to create logic apps](../logic-apps/quickstart-create-first-logic-app-workflow.md)

## Add Dynamics 365 trigger

[!INCLUDE [Create connection general intro](../../includes/connectors-create-connection-general-intro.md)]

Add a trigger that detects when a new lead record appears in Dynamics 365.

1. In the [Azure portal](https://portal.azure.com), 
open your blank logic app in Logic App Designer, if not open already.

1. In the search box, enter `Dynamics 365` as your filter. 
For this example, under the triggers list, 
select this trigger: **When a record is created**

   ![Select trigger](./media/connectors-create-api-crmonline/select-dynamics-365-trigger.png)

1. If you're prompted to sign in to Dynamics 365, sign in now.

1. Provide these trigger details:

   | Property | Description | 
   |----------|-------------|
   | **Organization Name** | The name for your organization's Dynamics 365 instance to monitor, for example, "Contoso" |
   | **Entity Name** | The name for the entity to monitor, for example, "Leads" | 
   | **How often do you want to check for items?** | The interval and frequency for how often your logic app checks for updates related to the trigger |
   | **Frequency** | The unit of time between intervals when checking for updates |
   | **Interval** | The number of seconds, minutes, hours, days, weeks, or months that pass before the next check |
   | | |

   ![Trigger details](./media/connectors-create-api-crmonline/trigger-details.png)

## Add Dynamics 365 action

Now add the action that creates a task record for the newly added lead record.

1. Under your trigger, choose **New step**.

1. In the search box, enter "Dynamics 365" as your filter. 
From the actions list, select this action: **Create a new record**

   ![Select action](./media/connectors-create-api-crmonline/select-action.png)

1. Provide these action details:

   | Property | Description | 
   |----------|-------------| 
   | **Organization Name** | The Dynamics 365 instance where you want to create the record, which doesn't have to be the same instance in your trigger |
   | **Entity Name** | The entity where you want to create the record, for example, **Tasks** | 
   | | |

   ![Action details](./media/connectors-create-api-crmonline/action-details.png)

1. When the **Subject** box appears in your action, 
click inside the **Subject** box so the dynamic content 
list appears. From this list, select the field values 
to include in the task from the new lead record:

   | Field | Description | 
   |-------|-------------| 
   | **Last name** | The last name from the lead as the primary contact in the record |
   | **Topic** | The descriptive name for the lead in the record | 
   | | | 

   ![New record details](./media/connectors-create-api-crmonline/create-record-details.png)

1. On the designer toolbar, choose **Save** for your logic app. 
To manually start the logic app, on the designer toolbar, choose **Run**.

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

For more information, see these Dynamics 365 Customer Engagement 
Web API Web API system query options: 

* [$filter](https://docs.microsoft.com/dynamics365/customer-engagement/developer/webapi/query-data-web-api#filter-results)
* [$orderby](https://docs.microsoft.com/dynamics365/customer-engagement/developer/webapi/query-data-web-api#order-results)

### Best practices for advanced options

When you add a value to a field in an action or trigger, 
your value must match the field type whether you enter 
a value or select a value from the dynamic content list.

| Field type | Description | Where to find | Name | Data type | 
|------------|-------------|---------------|------|-----------|
| Text fields | Require a single line of text or dynamic content that has text type. <p>Examples: Category and Sub-Category fields | Settings > Customizations > Customize the System > Entities > Task > Fields | category | Single Line of Text        
Integer fields | Some fields require integer or dynamic content that is an integer type field. Examples include Percent Complete and Duration. |Settings > Customizations > Customize the System > Entities > Task > Fields |percentcomplete |Whole Number         
Date fields | Some fields require a date entered in mm/dd/yyyy format or dynamic content that is a date type field. Examples include Created On, Start Date, Actual Start, Last on Hold Time, Actual End, and Due Date. | Settings > Customizations > Customize the System > Entities > Task > Fields |createdon |Date and Time
Fields that require both a record ID and lookup type |Some fields that reference another entity record require both the record ID and the lookup type. |Settings > Customizations > Customize the System > Entities > Account > Fields  | accountid  | Primary Key
|||||

### More examples 

Expanding on the previous table, here are more examples for fields 
that don't work with the values selected from the dynamic content list. 
Instead, these fields require both a record ID and the lookup type 
for the fields in Logic Apps.

| Field | Description | 
|-------|-------------|
| **Owner** | Must be either a valid user or team record ID. | 
| **Owner Type** | Must be either **systemusers** or **teams**. | 
| **Customer** | Must be a valid account or contact record ID. | 
| **Customer Type** | Must be either **accounts** or **contacts**. | 
| **Regarding** | Must be a valid record ID, such as an account ID or contact record ID. | 
| **Regarding Type** | Must be the lookup type for the record, such as **accounts** or **contacts**. | 
|||

For example, the **Create record** action 
The following task creation action example adds an account record that corresponds to the record ID adding it to the regarding field of the task.

![Flow recordId and type account](./media/connectors-create-api-crmonline/recordid-type-account.png)

This example also assigns the task to a specific user based on the user's record ID.

![Flow recordId and type account](./media/connectors-create-api-crmonline/recordid-type-user.png)

To find a record's ID, see the following section: *Find the record ID*

## Find the record ID

1. Open a record, such as an account record.

2. On the actions toolbar, choose **Pop Out**. ![popout record](./media/connectors-create-api-crmonline/popout-record.png) 

   Alternatively, on the actions toolbar, to copy the full URL into your default email program, click **EMAIL A LINK**.

   The record ID is displayed in between the %7b and %7d encoding characters of the URL.

   ![Flow recordId and type account](./media/connectors-create-api-crmonline/recordid.png)

## Troubleshooting

To troubleshoot a failed step in a logic app, view the status details of the event.

1. Under **Logic Apps**, select your logic app, and then click **Overview**. 

   The Summary area is shown and provides the run status for the logic app. 

   ![Logic app run status](./media/connectors-create-api-crmonline/tshoot1.png)

2. To view more information about any failed runs, click the failed event. 
To expand a failed step, click that step.

   ![Expand failed step](./media/connectors-create-api-crmonline/tshoot2.png)

   The step details appear and can help troubleshoot the cause of the failure.

   ![Failed step details](./media/connectors-create-api-crmonline/tshoot3.png)

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
