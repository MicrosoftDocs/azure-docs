<properties linkid="develop-mobile-tutorials-command-prompt-administration" urlDisplayName="Command prompt administration" pageTitle="Administer Mobile Services from the command prompt" metaKeywords="Windows Azure Mobile Services, command prompt, command line tool, mobile services" metaDescription="Learn how to use the Windows Azure command-line tool to automate the creation of management of Windows Azure Mobile Services." metaCanonical="" disqusComments="1" umbracoNaviHide="1" />

<div title="This is rendered content from macro" class="umbMacroHolder" onresizestart="return false;" umbpageid="15161" umbversionid="f1a70b05-645d-4fcd-bb15-74674509c46a" ismacro="true" umb_chunkpath="devcenter/Menu" umb_modaltrigger="" umb_chunkurl="" umb_hide="0" umb_chunkname="MobileArticleLeft" umb_modalpopup="0" umb_macroalias="AzureChunkDisplayer"><!-- startUmbMacro --><span><strong>Azure Chunk Displayer</strong><br />No macro content available for WYSIWYG editing</span><!-- endUmbMacro --></div>

# Administer Mobile Services from the command prompt 

This topic shows you how to use the job scheduler functionality in the Management Portal to define server script code that is executed based on a schedule that you define. In this case, the script removes duplicate push notification channel URIs from a table. Duplicate records can occur when you do not check for duplicates before you insert a new channel URI. Duplicate URIs might result in a push notification being sent multiple times to the same device. Some other periodic tasks that can be scheduled include:

+ Archiving old data records. 
+ Requesting and storing external data, such as tweets, RSS entries, and location information.
+ Processing or resizing stored images.

This tutorial walks you through these basic steps to demonstrate how to use the job scheduler to create a job that removes duplicate push notification channel URIs from the Channel table:

1. [Update Channel table scripts]
2. [Insert data to create duplicate channels]
3. [Create a new scheduled job]

1.	Import publish settings
2.	azure mobile delete - remove the site if it already exists
3.	azure mobile create - recreate the site
4.	Get the site master key
5.	azure mobile table create - create a table
6.	azure mobile table script create - add a script on the query operation. For example the script can add a single generated property to the returned object.
7.	Run a simple client test that verifies the property was added. We will need they key that we fetched in step 4 to be able to write this script. As we had talked, probably curl the URL and check the status code and/or compare the payload to make sure the calculated property was added as expected.
8.	We go and delete the mobile service
 
Depending on what we decide, we can try and test multiple scripts at a time using the same mobile service.
 
If it is hard, we can skip steps 1-4 and just create/delete tables when we try our scripts.


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
