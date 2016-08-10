<properties
 pageTitle="Get started with Azure Scheduler in Azure portal | Microsoft Azure"
 description="Get started with Azure Scheduler in Azure portal"
 services="scheduler"
 documentationCenter=".NET"
 authors="krisragh"
 manager="dwrede"
 editor=""/>
<tags
 ms.service="scheduler"
 ms.workload="infrastructure-services"
 ms.tgt_pltfrm="na"
 ms.devlang="dotnet"
 ms.topic="hero-article"
 ms.date="06/30/2016"
 ms.author="krisragh"/>

# Get started with Azure Scheduler in Azure portal

It's easy to create scheduled jobs in Azure Scheduler. In this tutorial, you'll learn how to create a job. You'll also learn Scheduler's monitoring and management capabilities.

## Create a job

1.  Sign in to [Azure portal](https://portal.azure.com/).  

2.  Click **+New** > type _Scheduler_ in the search box >  select **Scheduler** in results > click **Create**.

     ![][marketplace-create]

3.  Let’s create a job that simply hits http://www.microsoft.com/ with a GET request. In the **Scheduler Job** screen, enter the following information:

    1.  **Name:** `getmicrosoft`  

    2.  **Subscription:** Your Azure subscription   

    3.  **Job Collection:** Select an existing job collection, or click **Create New** > enter a name.

4.  Next, in **Action Settings**, define the following values:

    1.  **Action Type:** ` HTTP`  

    2.  **Method:** `GET`  

    3.  **URL:** ` http://www.microsoft.com`  

      ![][action-settings]

5.  Finally, let's define a schedule. The job could be defined as a one-time job, but let’s pick a recurrence schedule:

    1. **Recurrence**: `Recurring`

    2. **Start**: Today's date

    3. **Recur every**: `12 Hours`

    4. **End by**: Two days from today's date  

      ![][recurrence-schedule]

6.  Click **Create**

## Manage and monitor jobs

Once a job is created, it appears in the main Azure dashboard. Click the job and a new window opens with the following tabs:

1.  Properties  

2.  Action Settings  

3.  Schedule  

4.  History

5.  Users

    ![][job-overview]

### Properties

These read-only properties describe the management metadata for the Scheduler job.

   ![][job-properties]


### Action settings

Clicking on a job in the **Jobs** screen allows you to configure that job. This lets you configure advanced settings, if you didn't configure them in the quick-create wizard.

For all action types, you may change the retry policy and the error action.

For HTTP and HTTPS job action types, you may change the method to any allowed HTTP verb. You may also add, delete, or change the headers and basic authentication information.

For storage queue action types, you may change the storage account, queue name, SAS token, and body.

For service bus action types, you may change the namespace, topic/queue path, authentication settings, transport type, message properties, and message body.

      ![][job-action-settings]

### Schedule

This lets you reconfigure the schedule, if you'd like to change the schedule you created in the quick-create wizard.

This is an opoprtunity to build [complex schedules and advanced recurrence in your job](scheduler-advanced-complexity.md)

You may change the start date and time, recurrence schedule, and the end date and time (if the job is recurring.)

   ![][job-schedule]


### History

The **History** tab displays selected metrics for every job execution in the system for the selected job. These metrics provide real-time values regarding the health of your Scheduler:

1.  Status  

2.  Details  

3.  Retry attempts

4.  Occurrence: 1st, 2nd, 3rd, etc.

5.  Start time of execution  

6.  End time of execution

   ![][job-history]

You can click on a run to view its **History Details**, including the whole response for every execution. This dialog box also allows you to copy the response to the clipboard.

   ![][job-history-details]

### Users

Azure Role-Based Access Control (RBAC) enables fine-grained access management for Azure Scheduler. To learn how to use the Users tab, refer to [Azure Role-Based Access Control](../active-directory/role-based-access-control-configure.md)


## See also

 [What is Scheduler?](scheduler-intro.md)

 [Scheduler concepts, terminology, and entity hierarchy](scheduler-concepts-terms.md)

 [Plans and billing in Azure Scheduler](scheduler-plans-billing.md)

 [How to build complex schedules and advanced recurrence with Azure Scheduler](scheduler-advanced-complexity.md)

 [Scheduler REST API reference](https://msdn.microsoft.com/library/mt629143)

 [Scheduler PowerShell cmdlets reference](scheduler-powershell-reference.md)

 [Scheduler high-availability and reliability](scheduler-high-availability-reliability.md)

 [Scheduler limits, lefaults, and error codes](scheduler-limits-defaults-errors.md)

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
