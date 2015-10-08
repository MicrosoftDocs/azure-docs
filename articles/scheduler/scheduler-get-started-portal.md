<properties
 pageTitle="Get started using Azure Scheduler in the Azure portal | Microsoft Azure"
 description=""
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
 ms.date="08/18/2015"
 ms.author="krisragh"/>

# Get started using Azure Scheduler in the Azure portal

## Configure Scheduler using the Azure portal to quickly and easily create jobs

To complete this tutorial, you need an Azure account that has the Azure Scheduler feature enabled. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, refer to [Azure Free Trial](https://azure.microsoft.com/en-us/pricing/free-trial/).

## Get started

It's easy to create jobs and job collections on Azure Scheduler using the Azure portal. This tutorial walks you through the creation of the job collection you will use to store jobs, the creation of a job in a job collection, and an overview of the job monitoring and management tasks available through the portal. You need prior experience with Azure to use this tutorial.

The first time you open the Azure portal, you are automatically placed at the **ALL ITEMS** tab. The columns in the **ALL ITEMS** tab can be sorted. To view your Scheduler jobs and job collections, click the **SCHEDULER** tab.

![][1]

## Create a job collection and a job

1.  Sign in to the [Azure portal](https://manage.windowsazure.com/).  

2.  Click **App Services** > **Create New** > **Scheduler**, and then click **Custom Create**. <br /><br /> ![][2]

3.  In **Job Collection**, select the name of the existing job collection under the **Job Collection** drop-down. If you don’t have an existing job collection you’d like to add the job to, select **Create New** and enter a name to identify your new job collection.<br /><br /> ![][3]

4.  In **Region**, select the geographic region for the job collection.  

5.  Click the arrow key to create the job collection and move to the next stage – creating a job.

6.  Let’s create a job that simply hits http://www.microsoft.com/ with a GET request. In the **Job action** screen, define the following values for the requested form fields:  

    1.  **Name:** ` getmicrosoft`  

    2.  **Action Type:** ` HTTP`  

    3.  **Method:** ` GET`  

    4.  **URI:** ` http://www.microsoft.com`  

   	![][4]

7.  After you create a job, define a schedule. The job could be defined as a one-time job, but let’s pick a recurrence schedule. Some screenshots in this tutorial show a recurrence of 1 minute for only illustrative purposes, but pick a recurrence of 12 hours.  

    1.  **Recur Every:** ` 12 Hours`  

    2.  **Starting:** ` Now`  

    3.  **Ending On:** ` Select date 2 days after current day and any time`  

   	![][5]

8.  Click **OK**.  
    It can take a while to create the job and the job collection. To check the status, you can monitor the notifications at the bottom of the portal.

   	![][6]

   	After you create the job and job collection, a message tells you that the job or job collection was successfully created. The job is listed in the Jobs section of the Scheduler section and the job collection is listed in the Job Collections section. To configure additional advanced settings in the job, refer to the section “Configure a Job” below.

   	![][7]

## Manage and monitor job collections and jobs

Once a job collection is created, it appears in the main Scheduler management screen.

![][8]

Click a job collection and a new window opens with the following options:

1.  Dashboard  

2.  Scale  

3.  History  

4.  Jobs  

The following topics describe these tabs in greater detail.

### Dashboard

When you click your job collection name, the **Dashboard** tab is displayed. The Dashboard displays the following information:

![][9]

#### Job usage overview and execution usage overview

A table and series of charts that shows a fixed list of metrics. These metrics provide real-time values regarding the health of your job collection including:

1.  Current jobs  

2.  Completed jobs  

3.  Faulted jobs  

4.  Enabled jobs  

5.  Disabled jobs  

6.  Job executions  

#### Quick glance

A table that shows a fixed list of status and settings metrics. These metrics provide real-time values regarding the status and settings associated with your job collection including:

1.  Status  

2.  Region  

3.  Number of Errors  

4.  Number of Occurrence Faults  

5.  URI  

### Scale

In the **Scale** tab, you can change the settings and tier of service used by your Scheduler.

![][10]

#### General

This displays whether you are on the **Free** or **Standard** plan.

#### Quotas

Azure Scheduler implements quotas based on several conditions. This section lists the quota thresholds and allows you to change them. By default, there is one set of quotas configured. The limits of these quota settings are constrained by your plan, and changing the Plan may impact pricing.. Quotas can be changed to scale your Scheduler. Options include:

1.  Max jobs  

2.  Max frequency  

3.  Max interval  

### History

The **History** tab displays the following information for the selected job:

![][11]

#### History table

A table that displays selected metrics for every job execution in the system for the selected job. These metrics provide real-time values regarding the health of your Scheduler.

#### Available metrics

The following performance counters/metrics are available:

1.  Status  

2.  Details  

3.  Retry attempt  

4.  Number of executions (1st, 2nd, 3rd, etc.)  

5.  Timestamp of execution  

You can click **View History Details** to look at the whole response for every execution. This dialog box also allows you to copy the response to the clipboard.

![][12]

### Jobs

The jobs tab displays the following information to monitor the execution history of jobs:

![][13]

#### Jobs table

A table that displays selected metrics for every job in the system. These metrics provide real-time values regarding the health of your Scheduler.

#### Disable, enable, or delete job

Clicking on a job name gives you the option to enable, disable, or delete the job. Deleted jobs may not be recoverable.

#### Available metrics

The following counters and metrics are available:

1.  Name  

2.  Last run  

3.  Next run  

4.  Status  

5.  Frequency  

6.  Failures  

7.  Faults  

8.  Executions  

9.  Action type  

### Configure a job

Clicking on a job in the **Jobs** screen allows you to configure that job. This lets you configure additional advanced settings beyond what’s available in the quick-create wizard. To configure a job, click the right arrow next to the job’s name in the **Jobs** screen.

The job configuration page lets you update job settings. The job config page is shown below for HTTP and HTTPS jobs. For HTTP and HTTPS job action types, you may change the method to any allowed HTTP verb. You may also add, delete, or change the headers and basic authentication information.

![][14]

The job config page appears as shown below for storage queue jobs. For storage queue action types, you may change the storage account, queue name, SAS token, and body. The “Schedule” section (not shown below) is identical to the “Schedule” section for HTTP/HTTPS job action types.

![][15]

Finally, for all action types, you may change the schedule itself and its recurrence behavior. You may change the start date and time, recurrence schedule, and the end date and time (if the job is recurring.) After making any changes, you may save changes by clicking **Save** or discard changes by clicking **Discard**.

## See also

 [What is Scheduler?](scheduler-intro.md)

 [Scheduler concepts, terminology, and entity hierarchy](scheduler-concepts-terms.md)

 [Plans and billing in Azure Scheduler](scheduler-plans-billing.md)

 [How to build complex schedules and advanced recurrence with Azure Scheduler](scheduler-advanced-complexity.md)

 [Scheduler REST API reference](https://msdn.microsoft.com/library/dn528946)

 [Scheduler PowerShell cmdlets reference](scheduler-powershell-reference.md)

 [Scheduler high-availability and reliability](scheduler-high-availability-reliability.md)

 [Scheduler limits, lefaults, and error codes](scheduler-limits-defaults-errors.md)

 [Scheduler outbound authentication](scheduler-outbound-authentication.md)



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
