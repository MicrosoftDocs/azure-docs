<properties pageTitle="Use WebJobs to run background tasks in Microsoft Azure Websites" description="Learn how to run background tasks in Microsoft Azure Websites." services="web-sites" documentationCenter="" authors="cephalin" writer="timamm" manager="wpickett" editor="mollybos"/>

<tags ms.service="web-sites" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/12/2014" ms.author="cephalin"/>

#Use WebJobs to run background tasks in Azure Websites

Azure Websites enables you to run programs or scripts in your website in three ways: on demand, continuously, or on a schedule. There is no additional cost to use Microsoft Azure WebJobs.

This article shows how to deploy WebJobs by using the Azure management portal. For information about how to deploy by using Visual Studio or a continuous delivery process, see [How to Deploy Azure WebJobs to Azure Websites](http://azure.microsoft.com/en-us/documentation/articles/websites-dotnet-deploy-webjobs).

The Azure WebJobs SDK simplifies many WebJobs programming tasks. For more information, see [What is the WebJobs SDK](../websites-dotnet-webjobs-sdk).

## Table of Contents ##
- [Acceptable File Types for Scripts](#acceptablefiles)
- [Create an On Demand Task](#CreateOnDemand)
- [Create a Continuously Running Task](#CreateContinuous)
- [Create a Scheduled Task](#CreateScheduled)
	- [Scheduled jobs and Azure Scheduler](#Scheduler)
- [View the Job History](#ViewJobHistory)
- [Notes](#WHPNotes)
- [Next Steps](#NextSteps)

## <a name="acceptablefiles"></a>Acceptable File Types for Scripts or Programs

The following file types are accepted:

* .cmd, .bat, .exe (using windows cmd)
* .ps1 (using powershell)
* .sh (using bash)
* .php (using php)
* .py (using python)
* .js (using node)

## <a name="CreateOnDemand"></a>Create an On Demand Task

1. In the command bar of the **WebJobs** page, click **Add**. The **New Job** dialog appears.
	
	![On Demand Task][OnDemandWebJob]
	
2. Under **Name**, provide a name for the task. The name must start with a letter or a number and cannot contain any special characters other than "-" and "_".
	
3. In the **Content (Zip Files - 100MB Max)** box, browse to the zip file that contains your script. The zip file should contain your executable (.exe .cmd .bat .sh .php .py .js) as well as any supporting files needed to run the program or script.
	
4. In the **How to Run** box, choose **Run on Demand**.
	
5. Check the check mark on the bottom right of the dialog to upload the script to your website. The name you specified for the task appears in the list:
	
	![Task List][WebJobsList]
	
6. To run the script, select its name in the list and click **Run Once** in the command bar at the bottom of the portal page.
	
	![Run Once][RunOnce]

## <a name="CreateContinuous"></a>Create a Continuously Running Task

1. To create a continuously executing task, follow the same steps for creating a task that runs once, but in the **How to Run** box, choose **Run continuously**.
	
	![New Continuous Task][NewContinuousJob]
	
2. To start or stop a continuously running task, select the task in the list and click **Start** or **Stop** in the command bar.

> [AZURE.NOTE] If your website runs on more than one instance, a continuously running task will run on all of your instances. On-demand and scheduled tasks run on a single instance selected for load balancing by Microsoft Azure.

> [AZURE.NOTE]
> For continuous tasks, it is recommended that you enable **Always On** on the Configure page for your website. The Always On feature, available in Basic and Standard mode, prevents websites from being unloaded, even if they have been idle for some time. If your website is always loaded, your continuously running task may run more reliably. 

## <a name="CreateScheduled"></a>Create a Scheduled Task

1. To create a scheduled task, follow the same steps as before, but in the **How to Run** box, choose **Run on a schedule**.
	
	![New Scheduled Job][NewScheduledJob]
	
2. Choose the **Scheduler Region** for your job, and then click the arrow on the bottom right of the dialog to proceed to the next screen.

3. In the **Create Job** dialog, choose the type of **Recurrence** you want: **One-time job** or **Recurring job**.
	
	![Schedule Recurrence][SchdRecurrence]
	
4. Also choose a **Starting** time: **Now** or **At a specific time**.
	
	![Schedule Start Time][SchdStart]
	
5. If you want to start at a specific time, choose your starting time values under **Starting On**.
	
	![Schedule Start at a Specific Time][SchdStartOn]
	
6. If you chose a recurring job, you have the **Recur Every** option to specify the frequency of occurrence and the **Ending On** option to specify an ending time.
	
	![Schedule Recurrence][SchdRecurEvery]
	
7. If you choose **Weeks**, you can select the **On a Particular Schedule** box and specify the days of the week that you want the job to run.
	
	![Schedule Days of the Week][SchdWeeksOnParticular]
	
8. If you choose **Months** and select the **On a Particular Schedule** box, you can set the job to run on particular numbered **Days** in the month. 
	
	![Schedule Particular Dates in the Month][SchdMonthsOnPartDays]
	
9. If you choose **Week Days**, you can select which day or days of the week in the month you want the job to run on.
	
	![Schedule Particular Week Days in a Month][SchdMonthsOnPartWeekDays]
	
10. Finally, you can also use the **Occurrences** option to choose which week in the month (first, second, third etc.) you want the job to run on the week days you specified.
	
	![Schedule Particular Week Days on Particular Weeks in a Month][SchdMonthsOnPartWeekDaysOccurences]
	
11. After you have created one or more jobs, their names will appear on the WebJobs tab with their status, schedule type, and other information. Historical information for the last 30  tasks is maintained.
	
	![Jobs list][WebJobsListWithSeveralJobs]
	
### <a name="Scheduler"></a>Scheduled jobs and Azure Scheduler

Scheduled jobs can be further configured in the Azure Scheduler portal.

1.	On the WebJobs page, click the job's **schedule** link to navigate to the Azure Scheduler portal page. 
	
	![Link to Azure Scheduler][LinkToScheduler]
	
2. On the Scheduler page, click the job.
	
	![Job on the Scheduler portal page][SchedulerPortal]
	
3. The **Job Action** page opens, where you can further configure the job. 
	
	![Job Action PageInScheduler][JobActionPageInScheduler]
	
## <a name="ViewJobHistory"></a>View the Job History

1. To view the execution history of a job, including jobs created with the WebJobs SDK, click  its corresponding link under the **Logs** column. (You can use the clipboard icon to copy the URL of the log file page to the clipboard if you wish.)
	
	![Logs Link][WebJobLogs]
		
2. Clicking the link opens the web jobs details page for the task. This page shows you the name of the command run, the last times it ran, and its success or failure. Under **Recent job runs**, click a time to see further details.
	
	![WebJobDetails][WebJobDetails]
	
3. The **WebJob Run Details** page appears. Click **Toggle Output** to see the text of the log contents. The output log is in text format. 
	
	![Web job run details][WebJobRunDetails]
	
4. To see the output text in a separate browser window, click the **download** link. To download the text itself, right-click the link and use your browser options to save the file contents.
	
	![Download log output][DownloadLogOutput]
	
5. The **WebJobs** link at the top of the page provides a convenient way to get to a list of web jobs on the history dashboard.
	
	![Link to web jobs list][WebJobsLinkToDashboardList]
	
	![List of jobs in history dashboard][WebJobsListInJobsDashboard]
	
	Clicking one of these links takes you to the WebJob Details page for the job you selected.


## <a name="WHPNotes"></a>Notes
	
- As of March 2014, websites in Free mode can time out after 20 minutes if there are no requests to the scm (deployment) site and the website's portal is not open in Azure. Requests to the actual site will not reset this.
- Code for a continuous job needs to be written to run in an endless loop.
- Continuous jobs run continuously only when the site is up.
- Basic and Standard modes offer the Always On feature which, when enabled, prevents sites from becoming idle.

## <a name="NextSteps"></a>Next Steps
 
For more information, see [Azure WebJobs Recommended Resources][WebJobsRecommendedResources].

[PSonWebJobs]:http://blogs.msdn.com/b/nicktrog/archive/2014/01/22/running-powershell-web-jobs-on-azure-websites.aspx
[WebJobsRecommendedResources]:http://go.microsoft.com/fwlink/?LinkId=390226

[OnDemandWebJob]: ./media/web-sites-create-web-jobs/01aOnDemandWebJob.png
[WebJobsList]: ./media/web-sites-create-web-jobs/02aWebJobsList.png
[NewContinuousJob]: ./media/web-sites-create-web-jobs/03aNewContinuousJob.png
[NewScheduledJob]: ./media/web-sites-create-web-jobs/04aNewScheduledJob.png
[SchdRecurrence]: ./media/web-sites-create-web-jobs/05SchdRecurrence.png
[SchdStart]: ./media/web-sites-create-web-jobs/06SchdStart.png
[SchdStartOn]: ./media/web-sites-create-web-jobs/07SchdStartOn.png
[SchdRecurEvery]: ./media/web-sites-create-web-jobs/08SchdRecurEvery.png
[SchdWeeksOnParticular]: ./media/web-sites-create-web-jobs/09SchdWeeksOnParticular.png
[SchdMonthsOnPartDays]: ./media/web-sites-create-web-jobs/10SchdMonthsOnPartDays.png
[SchdMonthsOnPartWeekDays]: ./media/web-sites-create-web-jobs/11SchdMonthsOnPartWeekDays.png
[SchdMonthsOnPartWeekDaysOccurences]: ./media/web-sites-create-web-jobs/12SchdMonthsOnPartWeekDaysOccurences.png
[RunOnce]: ./media/web-sites-create-web-jobs/13RunOnce.png
[WebJobsListWithSeveralJobs]: ./media/web-sites-create-web-jobs/13WebJobsListWithSeveralJobs.png
[WebJobLogs]: ./media/web-sites-create-web-jobs/14WebJobLogs.png
[WebJobDetails]: ./media/web-sites-create-web-jobs/15WebJobDetails.png
[WebJobRunDetails]: ./media/web-sites-create-web-jobs/16WebJobRunDetails.png
[DownloadLogOutput]: ./media/web-sites-create-web-jobs/17DownloadLogOutput.png
[WebJobsLinkToDashboardList]: ./media/web-sites-create-web-jobs/18WebJobsLinkToDashboardList.png
[WebJobsListInJobsDashboard]: ./media/web-sites-create-web-jobs/19WebJobsListInJobsDashboard.png
[LinkToScheduler]: ./media/web-sites-create-web-jobs/31LinkToScheduler.png
[SchedulerPortal]: ./media/web-sites-create-web-jobs/32SchedulerPortal.png
[JobActionPageInScheduler]: ./media/web-sites-create-web-jobs/33JobActionPageInScheduler.png
