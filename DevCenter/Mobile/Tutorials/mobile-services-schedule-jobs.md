<properties linkid="develop-mobile-tutorials-schedule-jobs" urlDisplayName="Schedule jobs" pageTitle="Schedule jobs in Windows Azure Mobile Services" metaKeywords="Windows Azure Mobile Services, scheduler, schedule jobs, mobile services" metaDescription="Learn how to use the job scheduler functionality in the Management Portal to define server-side scripts that are executed on a scheduleby Windows Azure Mobile Services." metaCanonical="" disqusComments="1" umbracoNaviHide="1" />

<div title="This is rendered content from macro" class="umbMacroHolder" onresizestart="return false;" umbpageid="15161" umbversionid="f1a70b05-645d-4fcd-bb15-74674509c46a" ismacro="true" umb_chunkpath="devcenter/Menu" umb_modaltrigger="" umb_chunkurl="" umb_hide="0" umb_chunkname="MobileArticleLeft" umb_modalpopup="0" umb_macroalias="AzureChunkDisplayer"><!-- startUmbMacro --><span><strong>Azure Chunk Displayer</strong><br />No macro content available for WYSIWYG editing</span><!-- endUmbMacro --></div>

# Schedule backend jobs in Mobile Services 

This topic shows you how to use the job scheduler functionality in the Management Portal to define server script code that is executed based on a schedule that you define. In this case, the script removes duplicate push notification channel URIs from a table. Duplicate records can occur when you do not check for duplicates before you insert a new channel URI. Duplicate URIs might result in a push notification being sent multiple times to the same device. Some other periodic tasks that can be scheduled include:

+ Archiving old data records. 
+ Requesting and storing external data, such as tweets, RSS entries, and location information.
+ Processing or resizing stored images.

This tutorial walks you through these basic steps to demonstrate how to use the job scheduler to create a job that removes duplicate push notification channel URIs from the Channel table:

1. [Update Channel table scripts]
2. [Insert data to create duplicate channels]
3. [Create a new scheduled job]

This tutorial uses the Channel table. This table is created when you complete the tutorial [Push notifications to app users for Windows Store apps] or [Push notifications to app users for Windows Phone 8 apps]. Completing one of these tutorials is a prerequisite for completing this tutorial. This approach can be used to clean up any duplicate data, no matter how it was generated.

<a name="update-scripts"></a><h2><span class="short-header">Update scripts</span>Update Channel table scripts</h2>

1. Log on to the [Windows Azure Management Portal], click **Mobile Services**, and then click your mobile service.

   ![][3]

2. Click the **Data** tab, then click the **Channel** table. 

   ![][1]

3. In **channel**, click the **Script** tab, select **Insert**, click **Clear**, then click **Yes** to confirm.
   
   ![][2]

   This removes the code that checks for duplicate URI values before inserting them into the Channel table.

    <div class="dev-callout"><b>Note</b>
    <p>To restore the original functionality of the push notifications tutorial, replace the copied <strong>insert</strong> function code.</p>
    </div>

Now that you have disabled duplicate checking on the Channel table, you can run the app to insert duplicate records.

<a name="insert-duplicates"></a><h2><span class="short-header">Generate duplicates</span>Insert data to create duplicate channels</h2>  

1. In the appropriate version of Visual Studio 2012 Express, open the app project from either [Push notifications to app users for Windows Store apps] or [Push notifications to app users for Windows Phone 8 apps].

2.  Press the **F5** key to rebuild the project and start the app.

3.  Stop or close the app and repeat steps 2. 

   This adds duplicate channel URIs into the Channel table.

5. Back in the Management Portal, click **Browse** 

  ![][8]

   Notice that there are two or more entries in the table with the same **Uri** value.

6. Click the back arrow to return to the mobile service page.

<a name="add-job"></a><h2><span class="short-header">Create a new job</span>Create a new scheduled job</h2>  

2. Click the **Scheduler** tab, then click **+Create**. 

   ![][4]

    <div class="dev-callout"><b>Note</b>
    <p>When you run your mobile service in <i>free</i> mode, you are only able to run one scheduled job at a time. In <i>reserved</i> mode, you can run up to ten scheduled jobs at a time.</p>
    </div>

3. In the scheduler dialog, enter <i>cleanup_channel</i> for the **Job Name**, set the schedule interval and units, then click the check button. 
   
   ![][5]

   This creates a new job named **cleanup_channels**. 

4. Click the new job you just created, then click the **Script** tab.

   ![][6] 

5. Replace the placeholder function **cleanup_channels** with the following code:

        function cleanup_channels() {
            var sql = "SELECT MAX(Id) as Id, Uri FROM Channel " + 
                "GROUP BY Uri HAVING COUNT(*) > 1";
            var channelTable = tables.getTable('Channel');
 
            mssql.query(sql, {
                success: function(results) {
                    if (results.length > 0) {
                        for (var i = 0; i < results.length; i++) {
                            channelTable.del(results[i].Id);
                            console.log('Deleted duplicate channel:' + 
                            results[i].Uri);
                        }
                    } else {
                        console.log('No duplicate rows found.');
                    }
                }
            });
        }

6. Click **Save**, then **Run Once** to test the script. 

  ![][7]

   This executes the job while it remains disabled in the scheduler.

7. Click the back button, click **Logs**, locate the **Deleted duplicate...** item, click **Details**, and verify that a duplicate row was deleted.

   ![][9]

8. Click **Scheduler**, select **cleanup_channels**, then click **Enable**.

   ![][10]

   This enables the job to run on the specified schedule, in this case every hour.

Congratulations, you have successfully created a new job schedule in your mobile service. This job will be executed as scheduled until you disable or modify it.

## <a name="nextsteps"> </a>Next Steps

* [Mobile Services server script reference]
  <br/>Learn more about registering and using server scripts.

<!-- Anchors. -->
[Update Channel table scripts]: #update-scripts
[Insert data to create duplicate channels]: #insert-duplicates
[Create a new scheduled job]: #add-job
[Next steps]: #next-steps

<!-- Images. -->
[1]: ../Media/mobile-portal-data-tables-channel.png
[2]: ../Media/mobile-insert-script-channel-clear.png
[3]: ../Media/mobile-services-selection.png
[4]: ../Media/mobile-schedule-new-job.png
[5]: ../Media/mobile-create-job-dialog.png
[6]: ../Media/mobile-schedule-job-script-new.png
[7]: ../Media/mobile-schedule-job-script.png
[8]: ../Media/mobile-verify-channel-duplicates.png
[9]: ../Media/mobile-schedule-job-logs.png
[10]: ../Media/mobile-schedule-job-enabled.png

<!-- URLs. -->
[Push notifications to app users for Windows Store apps]: ../tutorials/mobile-services-push-notifications-to-app-users-dotnet.md
[Push notifications to app users for Windows Phone 8 apps]: ../tutorials/mobile-services-push-notifications-to-app-users-wp8.md
[Push notifications to app users]: ../tutorials/mobile-services-push-notifications-to-app-users-ios.md
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/?LinkId=262293
[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/
