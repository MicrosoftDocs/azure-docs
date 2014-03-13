<properties linkid="web-sites-create-web-jobs" urlDisplayName="How to create web jobs in Windows Azure" pageTitle="How to Create Web Jobs in Windows Azure Web Sites" metaKeywords="Windows Azure Web Sites, Web Jobs" description="Learn how to create web jobs in Windows Azure Web Sites." metaCanonical="" services="web-sites" documentationCenter="" title="How to Create Web Jobs in Windows Azure Web Sites" authors="timamm" solutions="" manager="paulettm" editor="mollybos" />

#How to Use the WebJobs feature in Windows Azure Web Sites#

Windows Azure Web Sites enables you to run programs or scripts in your web site in one of three ways: on demand, continuously, or on a schedule. There is no additional cost to use Windows Azure WebJobs unless you wish to enable the Always On feature described later in this article.


## Table of Contents ##
- [Acceptable File Types for Scripts](#acceptablefiles)
- [Create an On Demand Task](#CreateOnDemand)
- [Create a Continuously Running Task](#CreateContinuous)
- [Create a Scheduled Task](#CreateScheduled)
- [View the History](#ViewJobHistory)
- [Next Steps](#NextSteps)
	- [Do More with the Windows Azure WebJobs SDK](#WebJobsSDK)
	- [Alternative Methods of Deployment](#AlternateDeployments)
	- [Additional Resources](#AdditionalResources)

<a name="acceptablefiles"></a>
##Acceptable File Types for Scripts##
The following file types are accepted as runnable scripts:

.cmd, .bat, .exe (using windows cmd)

.ps1 (using powershell)

.sh (using bash)

.php (using php)

.py (using python)

.js (using node)

<a name="CreateOnDemand"></a>
##Create an On Demand Task##

1. In the command bar of the **WebJobs** page, click **Add**. The **New WebJob** dialog appears.
	
	![On Demand Task][OnDemandWebJob]
	
2. Under **Name**, provide a name for the task. The name must start with a letter or a number and cannot contain any special characters other than "-" and "_".
	
3. In the **Content (Zip Files - 200MB Max)** box, browse to the zip file that contains your script. The zip file should contain your executable (.exe .cmd .bat .sh .php .py .js) as well as any supporting files needed to run the program or script.
	
4. In the **How to Run** box, choose **Run on Demand**.
	
5. Check the check mark on the bottom right of the dialog to upload the script to your web site. The name you specified for the task appears in the list:
	
	![Task List][WebJobsList]
	
6. To run the script, select its name in the list and click **Run Once** in the command bar at the bottom of the portal page.
	
	![Run Once][RunOnce]

<a name="CreateContinuous"></a>
##Create a Continuously Running Task##

1. To create a continuously executing task, follow the same steps for creating a task that runs once, but in the **How to Run** box, choose **Run continuously**.
	
	![New Continuous Task][NewContinuousJob]
	
2. To start or stop a continuously running task, select the task in the list and click **Start** or **Stop** in the command bar.

> [WACOM.NOTE] If your website runs on more than one instance, a continuously running task will run on all of your instances. On demand and scheduled tasks run on a single instance selected for load balancing by Windows Azure.

> [WACOM.NOTE]
> For continuous tasks, it is recommended that you enable **Always On** on the Configure page for your web site. The Always On feature, available in Standard mode only, prevents web sites from being unloaded, even if they have been idle for some time. If your web site is always loaded, your continuously running task may run more reliably. 

<a name="CreateScheduled"></a>
##Create a Scheduled Task##
1. To create a scheduled task, follow the same steps as before, but in the **How to Run** box, choose **Run on a Schedule**.
	
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

<a name="ViewJobHistory"></a>
##View the Task History##
To view the execution history of a task, click on its link under the **Logs** column of the dashboard. (You can also use the clipboard icon to copy the URL of the log file page to the clipboard.)

![Logs Link][WebJobLogs]
	
Clicking the link takes you to the history page for your task:

![Triggered job history][TriggeredHistory]

To see the log contents, click the **Download** link in the **Output File** column. 

The output log is in text format and will be similar to the following:

	[01/08/2014 03:12:27 > 543efe: SYS INFO] Status changed to Initializing
	[01/08/2014 03:12:27 > 543efe: SYS INFO] Run script 'run.cmd' with script host - 'WindowsScriptHost'
	[01/08/2014 03:12:28 > 543efe: SYS INFO] Status changed to Running
	[01/08/2014 03:12:28] 
	[01/08/2014 03:12:28] C:\DWASFiles\Sites\Contoso\Temp\jobs\triggered\OnDemandWebJob1\knvcab4m.522>ECHO "On Demand Task Test" 
	[01/08/2014 03:12:28] "On Demand Task Test"
	[01/08/2014 03:12:28 > 543efe: SYS INFO] Status changed to Success

Historical information for the last 30 tasks that were run is maintained.

<a name="NextSteps"></a>
##Next Steps##

<a name="WebJobsSDK"></a>
###Do More with the Windows Azure WebJobs SDK###
The Windows Azure WebJobs SDK simplifies the task of adding background processing to your Windows Azure web sites. The SDK integrates Windows Azure Storage, triggering a function in your program when items are added to Queues, Blobs or Tables. A dashboard provides rich monitoring and diagnostics for the programs that you write by using the SDK. The monitoring and diagnostics features are built into the SDK and do not require you to add any special code in your program.
 
For more information, see the tutorial [Getting Started with Windows Azure WebJobs SDK](http://asp.net/aspnet/overview/developing-apps-with-windows-azure/getting-started-with-windows-azure-webjobs). The tutorial provides an overview of the features of the WebJobs SDK and walks you through creating and running a simple Hello World background process. 

To see a walkthrough of a sample command line app created with the Windows Azure WebJobs SDK, see [Introducing Windows Azure WebJobs][HanselIntro].

<a name="AlternateDeployments"></a>
###Alternative Methods of Deployment###
If you don't want to use the WebJobs portal page to upload your scripts, you can use FTP, git, or Web Deploy. For more information, see  [How to deploy Windows Azure WebJobs][AmitDeploy] and [Git deploying a .NET console app to Azure using WebJobs][AmitConsole].

<a name="AdditionalResources"></a>
###Additional Resources###
For additional resources, see the annotated list of links [Using the WebJobs feature of Windows Azure Web Sites][RickWebJobsCurah]. 



[PSonWebJobs]:http://blogs.msdn.com/b/nicktrog/archive/2014/01/22/running-powershell-web-jobs-on-azure-websites.aspx

[HanselIntro]:http://www.hanselman.com/blog/IntroducingWindowsAzureWebJobs.aspx

[AmitDeploy]:http://blog.amitapple.com/post/74215124623/deploy-azure-webjobs

[AmitConsole]:http://blog.amitapple.com/post/73574681678/git-deploy-console-app

[RickWebJobsCurah]:http://go.microsoft.com/fwlink/?LinkId=390226


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
[WebJobLogs]: ./media/web-sites-create-web-jobs/14WebJobLogs.png
[TriggeredHistory]: ./media/web-sites-create-web-jobs/15aTriggeredHistory.png
