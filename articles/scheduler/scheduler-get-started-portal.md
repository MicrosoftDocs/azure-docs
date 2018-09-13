---
title: Create scheduled jobs with Azure Scheduler - Azure portal | Microsoft Docs
description: Learn how to create your first scheduled job with Azure Scheduler in the Azure portal
services: scheduler
ms.service: scheduler
ms.suite: infrastructure-services
author: derek1ee
ms.author: deli
ms.reviewer: klam
ms.assetid: e69542ec-d10f-4f17-9b7a-2ee441ee7d68
ms.topic: hero-article
ms.date: 08/10/2016
---

# Create and schedule your first job with Azure Scheduler - Azure portal

> [!IMPORTANT]
> [Azure Logic Apps](../logic-apps/logic-apps-overview.md) 
> is replacing Azure Scheduler, which is being retired. 
> To schedule jobs, start using Azure Logic Apps instead, 
> not Azure Scheduler. Learn how to 
> [migrate from Azure Scheduler to Azure Logic Apps](../scheduler/migrate-from-scheduler-to-logic-apps.md).

This tutorial shows how easily you can create and schedule a job, 
and then monitor and manage that job. 

If you don't have an Azure subscription, 
<a href="https://azure.microsoft.com/free/" target="_blank">sign up for a free Azure account</a>.

## Create job

1. Sign in to the [Azure portal](https://portal.azure.com/).  

1. On the main Azure menu, select **Create a resource**. 

1. In the search box, enter "scheduler". From the results list, 
select **Scheduler**, and then choose **Create**.
   
   ![Create Scheduler resource][marketplace-create]

   Now create a job that sends a GET request to this URL: 
   `http://www.microsoft.com/` 

1. Under **Scheduler Job**, enter this information:

   | Property | Example value | Description |
   |----------|---------------|-------------| 
   | **Name** | `getMicrosoft` | The name for your job | 
   | **Job collection** | <*job-collection-name*> | Create a job collection, or select an existing collection. | 
   | **Subscription** | <*Azure-subscription-name*> | The name for your Azure subscription | 
   |||| 

1. Select **Action settings - Configure**, provide this information, 
and then choose **OK** when you're done:

   | Property | Example value | Description |
   |----------|---------------|-------------| 
   | **Action** | **Http** | The type of action to run | 
   | **Method** | **Get** | The method to call | 
   | **URL** | **http://www.microsoft.com** | The destination URL | 
   |||| 
   
   ![Define job][action-settings]

1. Select **Schedule - Configure**, define the schedule, 
and then select **OK** when you're done:

   Although you can create a one-time job, 
   this example sets up a recurrence schedule.

   | Property | Example value | Description |
   |----------|---------------|-------------| 
   | **Recurrence** | **Recurring** | Either a one-time or recurring job | 
   | **Start on** | <*today's-date*> | The job's start date | 
   | **Recur every** | **1 Hours** | The recurrence interval and frequency | 
   | **End** | **End by** two days from today's date | The job's end date | 
   | **UTC offset** | **UTC +08:00** | The difference in time between Coordinated Universal Time (UTC) and your location's observed time | 
   |||| 

   ![Define schedule][recurrence-schedule]

1. When you're ready, choose **Create**.

   After you create your job, Azure deploys 
   your job, which appears on the Azure dashboard. 

1. When Azure shows a notification that deployment succeeded, 
choose **Pin to dashboard**. Otherwise, choose the **Notifications** 
icon (bell) on the Azure toolbar, and then choose **Pin to dashboard**.

## Monitor and manage jobs

To review, monitor, and manage your job, 
on the Azure dashboard, choose your job. 
Under **Settings**, here are the areas 
you can review and manage for your job:

![Job settings][job-overview]

For more information about these areas, 
select an area:

* [**Properties**](#properties)
* [**Action settings**](#ction-settings)
* **Schedule**
* **History**
* **Users**

<a name="properties"></a>

### Properties

This section shows read-only properties that describe 
the management metadata for your Scheduler job.

![Review job read-only properties][job-properties]

<a name="action-settings"></a>

### Action settings

Clicking on a job in the **Jobs** screen allows you to configure that job. This lets you configure advanced settings, if you didn't configure them in the quick-create wizard.

For all action types, you may change the retry policy and the error action.

For HTTP and HTTPS job action types, you may change the method to any allowed HTTP verb. You may also add, delete, or change the headers and basic authentication information.

For storage queue action types, you may change the storage account, queue name, SAS token, and body.

For service bus action types, you may change the namespace, topic/queue path, authentication settings, transport type, message properties, and message body.

   ![][job-action-settings]

### Schedule

This lets you reconfigure the schedule, if you'd like to change the schedule you created in the quick-create wizard.

This is an opportunity to build [complex schedules and advanced recurrence in your job](scheduler-advanced-complexity.md)

You may change the start date and time, recurrence schedule, and the end date and time (if the job is recurring.)

   ![][job-schedule]

### History
The **History** tab displays selected metrics for every job execution in the system for the selected job. These metrics provide real-time values regarding the health of your Scheduler:

1. Status  
2. Details  
3. Retry attempts
4. Occurrence: 1st, 2nd, 3rd, etc.
5. Start time of execution  
6. End time of execution
   
   ![][job-history]

You can click on a run to view its **History Details**, including the whole response for every execution. This dialog box also allows you to copy the response to the clipboard.

   ![][job-history-details]

### Users
Azure Role-Based Access Control (RBAC) enables fine-grained access management for Azure Scheduler. To learn how to use the Users tab, refer to [Azure Role-Based Access Control](../role-based-access-control/role-assignments-portal.md)

## See also
 [What is Scheduler?](scheduler-intro.md)

 [Scheduler concepts, terminology, and entity hierarchy](scheduler-concepts-terms.md)

 [Plans and billing in Azure Scheduler](scheduler-plans-billing.md)

 [How to build complex schedules and advanced recurrence with Azure Scheduler](scheduler-advanced-complexity.md)

 [Scheduler REST API reference](https://msdn.microsoft.com/library/mt629143)

 [Scheduler PowerShell cmdlets reference](scheduler-powershell-reference.md)

 [Scheduler high-availability and reliability](scheduler-high-availability-reliability.md)

 [Scheduler limits, defaults, and error codes](scheduler-limits-defaults-errors.md)

 [Scheduler outbound authentication](scheduler-outbound-authentication.md)

[marketplace-create]: ./media/scheduler-get-started-portal/scheduler-v2-portal-marketplace-create.png
[action-settings]: ./media/scheduler-get-started-portal/scheduler-v2-portal-action-settings.png
[recurrence-schedule]: ./media/scheduler-get-started-portal/scheduler-v2-portal-recurrence-schedule.png
[job-properties]: ./media/scheduler-get-started-portal/scheduler-v2-portal-job-properties.png
[job-overview]: ./media/scheduler-get-started-portal/scheduler-v2-portal-job-overview-1.png
[job-action-settings]: ./media/scheduler-get-started-portal/scheduler-v2-portal-job-action-settings.png
[job-schedule]: ./media/scheduler-get-started-portal/scheduler-v2-portal-job-schedule.png
[job-history]: ./media/scheduler-get-started-portal/scheduler-v2-portal-job-history.png
[job-history-details]: ./media/scheduler-get-started-portal/scheduler-v2-portal-job-history-details.png


[1]: ./media/scheduler-get-started-portal/scheduler-get-started-portal001.png
[2]: ./media/scheduler-get-started-portal/scheduler-get-started-portal002.png
[3]: ./media/scheduler-get-started-portal/scheduler-get-started-portal003.png
[4]: ./media/scheduler-get-started-portal/scheduler-get-started-portal004.png
[5]: ./media/scheduler-get-started-portal/scheduler-get-started-portal005.png
[6]: ./media/scheduler-get-started-portal/scheduler-get-started-portal006.png
[7]: ./media/scheduler-get-started-portal/scheduler-get-started-portal007.png
[8]: ./media/scheduler-get-started-portal/scheduler-get-started-portal008.png
[9]: ./media/scheduler-get-started-portal/scheduler-get-started-portal009.png
[10]: ./media/scheduler-get-started-portal/scheduler-get-started-portal010.png
[11]: ./media/scheduler-get-started-portal/scheduler-get-started-portal011.png
[12]: ./media/scheduler-get-started-portal/scheduler-get-started-portal012.png
[13]: ./media/scheduler-get-started-portal/scheduler-get-started-portal013.png
[14]: ./media/scheduler-get-started-portal/scheduler-get-started-portal014.png
[15]: ./media/scheduler-get-started-portal/scheduler-get-started-portal015.png
