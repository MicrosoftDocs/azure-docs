<properties linkid="web-sites-create-web-jobs" urlDisplayName="How to create web jobs in Windows Azure" pageTitle="How to Create Web Jobs in Windows Azure Web Sites" metaKeywords="Windows Azure Web Sites, Web Jobs" description="Learn how to create web jobs in Windows Azure Web Sites." metaCanonical="" services="web-sites" documentationCenter="" title="How to Create Web Jobs in Windows Azure Web Sites" authors=""  solutions="" writer="timamm" manager="paulettm" editor="mollybos"  />

#How to Create Web Jobs for Windows Azure Web Sites#

Windows Azure Web Sites enables you to run custom jobs (running executables or scripts) on your web site in one of three ways: on demand, continuously, or on a schedule. 


## Table of Contents ##
- [Acceptable File Types for Scripts](#acceptablefiles)
- [Create an On Demand Web Job](#CreateOnDemand)
- [Create a Continuous Web Job](#CreateContinuous)
- [Create a Scheduled Web Job](#CreateScheduled)
- [Run a Job Manually](#RunManually)
- [View the Web Job History](#ViewJobHistory)

<a name="acceptablefiles"></a>
##Acceptable File Types for Scripts##
The following file types are accepted as runnable scripts that can be used as a job:

.cmd, .bat, .exe (using windows cmd)

.sh (using bash)

.php (using php)

.py (using python)

.js (using node)

<a name="CreateOnDemand"></a>
##Create an On Demand Web Job##

1. In the command bar of the Web Jobs page, click **Add**. The **New Web Job** dialog appears.
	
	![On Demand Web Job][OnDemandWebJob]
	
2. Under **Name**, provide a name for the web job. The web job name must start with a letter or a number, cannot contain any special characters other than "-" and "_".
	
3. In the **Content (Zip Files - 200MB Max)** box, browse to the zip file that contains your script. The zip file should contain your executable (.exe .cmd .bat .sh .php .py .js) as well as any supporting files needed to run your web job.
	
4. In the **How to Run** box, choose **Run on Demand**.
	
5. Check the check mark on the bottom right of the dialog to upload the script to your web site. The job appears in the web jobs list:
	
	![Web Jobs List][WebJobsList]
	
6. To run the job, select the job in the job list and click **Run Once** in the command bar at the bottom of the portal page.
	
	![Run Once][RunOnce]

<a name="CreateContinuous"></a>
##Create a Continuous Web Job##

1. To create a continuously executing web job, follow the same steps above for creating a web job, but in the **How to Run** box, choose **Run continuously**.
	
	![New Continuous Job][NewContinuousJob]
	
2. To start or stop a continuous job, select the job in the job list and click **Start** or **Stop** in the command bar.

> WACOM.NOTE
> For continuous web jobs, it is recommended that you enable **Always On** on the Configure page for your web site. The Always On feature, available in Standard mode only, prevents web sites from being unloaded, even if they have been idle for some time. If your web site is always loaded, your continuous web job may run more reliably.

<a name="CreateScheduled"></a>
##Create a Scheduled Web Job##
1. To create a scheduled web job, follow the same steps for creating a web job, but in the **How to Run** box, choose **Run on a Schedule**.
	
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

<a name="RunManually"></a>	
##Run a Job Manually##
To run a job manually, select the job that you want to run and click **Run Once** in the command bar at the bottom of the portal.

![Run Once][RunOnce]

<a name="ViewJobHistory"></a>
##View the Web Job History##
To view the execution history of a web job, click on its link under the **Logs** column of the dashboard. (You can also use the clipboard icon to copy the URL of the log file page to the clipboard.)

![Web Job Logs][WebJobLogs]
	
Clicking the link takes you to the job history page for your web job:

![Job History Page][TriggeredHistory]

To see the actual log file for viewing, download it by clicking the **Output** link under the **Output File** column. 

An Output.log file is downloaded to your computer in text format and will be similar to the following:

	[01/08/2014 03:12:27 > 543efe: SYS INFO] Status changed to Initializing
	[01/08/2014 03:12:27 > 543efe: SYS INFO] Run script 'run.cmd' with script host - 'WindowsScriptHost'
	[01/08/2014 03:12:28 > 543efe: SYS INFO] Status changed to Running
	[01/08/2014 03:12:28] 
	[01/08/2014 03:12:28] C:\DWASFiles\Sites\Contoso\Temp\jobs\triggered\OnDemandWebJob1\knvcab4m.522>ECHO "On Demand Test Web Job" 
	[01/08/2014 03:12:28] "On Demand Test Web Job"
	[01/08/2014 03:12:28 > 543efe: SYS INFO] Status changed to Success

Historical information for the last 30 job runs is maintained.

<!-- IMAGES -->

[OnDemandWebJob]: ./media/web-sites-create-web-jobs/01OnDemandWebJob.png
[WebJobsList]: ./media/web-sites-create-web-jobs/02WebJobsList.png
[NewContinuousJob]: ./media/web-sites-create-web-jobs/03NewContinuousJob.png
[NewScheduledJob]: ./media/web-sites-create-web-jobs/04NewScheduledJob.png
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
[TriggeredHistory]: ./media/web-sites-create-web-jobs/15TriggeredHistory.png
