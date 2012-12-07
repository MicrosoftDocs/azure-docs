<properties linkid="develop-mobile-tutorials-schedule-jobs" urlDisplayName="Schedule jobs" pageTitle="Schedule jobs in Windows Azure Mobile Services" metaKeywords="Windows Azure Mobile Services, scheduler, schedule jobs, mobile services" metaDescription="Learn how to use the job scheduler functionality in the Management Portal to define server-side scripts that are executed on a scheduleby Windows Azure Mobile Services." metaCanonical="" disqusComments="1" umbracoNaviHide="1" />

<div title="This is rendered content from macro" class="umbMacroHolder" onresizestart="return false;" umbpageid="15161" umbversionid="f1a70b05-645d-4fcd-bb15-74674509c46a" ismacro="true" umb_chunkpath="devcenter/Menu" umb_modaltrigger="" umb_chunkurl="" umb_hide="0" umb_chunkname="MobileArticleLeft" umb_modalpopup="0" umb_macroalias="AzureChunkDisplayer"><!-- startUmbMacro --><span><strong>Azure Chunk Displayer</strong><br />No macro content available for WYSIWYG editing</span><!-- endUmbMacro --></div>

# Schedule backend jobs in Mobile Services 

This topic shows you how to use the job scheduler functionality in the Management Portal to define server script code that is executed based on a schedule that you define. These jobs are ...

<a name="about"></a><h2><span class="short-header">About</span>About the job scheduler</h2>

Intro material here.


<a name="add-job"></a><h2><span class="short-header">Schedule a job</span>How to: schedule a new job</h2>

1. Log on to the [Windows Azure Management Portal], click **Mobile Services**, and then click your mobile service.

   ![][1]

2. Click the **Schedule** tab, then click **+Create**. 

   ![][2]

   This displays the scheduler dialo

3. Supply a **Job Name**, set the schedule interval and units, then click the check button. 
   
   ![][3]

   This creates a new job named **cleanup_tables** that runs once an hour.

    <div class="dev-callout"> 
	<b>Note</b> 
	<p>If you want to create your job but start running it at a later date, or if you only want to run the job manually from the Management Portal, select <strong>On demand</strong> under <strong>Schedule</strong>.</p> 
	</div>

4. Replace the function **cleanup_tables** with the following code:

        // Cleanup code goes here.


6. Click the **Save** button. You have now configured a script that is executed at the scheduled interval. 

Congratulations, you have successfully created a new job schedule in your mobile service. This job will execute as scheduled until you disable or modify it.

## <a name="nextsteps"> </a>Next Steps


* [Mobile Services server script reference]
  <br/>Learn more about registering and using server scripts.

<!-- Anchors. -->
[About the job scheduler]: #about
[How to: schedule a new job]: #add-job
[Next steps]: #next-steps

<!-- Images. -->
[1]: ../Media/mobile-services-selection.png
[2]: ../Media/mobile-schedule-new-job.png
[3]: ../Media/mobile-create-job-dialog.png
[4]: ../Media/mobile-receive-email.png

<!-- URLs. -->
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/?LinkId=262293
[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/
