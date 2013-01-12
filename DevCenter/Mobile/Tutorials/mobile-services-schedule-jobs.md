<properties linkid="develop-mobile-tutorials-schedule-jobs" urlDisplayName="Schedule jobs" pageTitle="Schedule jobs in Windows Azure Mobile Services" metaKeywords="Windows Azure Mobile Services, scheduler, schedule jobs, mobile services" metaDescription="Learn how to use the job scheduler functionality in the Management Portal to define server-side scripts that are executed on a scheduleby Windows Azure Mobile Services." metaCanonical="" disqusComments="1" umbracoNaviHide="1" />

<div chunk="../chunks/article-left-menu-windows-store.md" />

# Schedule recurring jobs in Mobile Services 
<div class="dev-onpage-video-clear clearfix">
<div class="dev-onpage-left-content">
<p>This topic shows you how to use the job scheduler functionality in the Management Portal to define server script code that is executed based on a schedule that you define. In this case, the script periodically check with a remote service, in this case Twitter, and stores the results in a new table. Some other periodic tasks that can be scheduled include:</p>
<ul>
<li>Archiving old or duplicate data records.</li>
<li>Requesting and storing external data, such as tweets, RSS entries, and location information.</li>
<li>Processing or resizing stored images.</li>
</ul>
</div>
<div class="dev-onpage-video-wrapper"><a href="http://channel9.msdn.com/Series/Windows-Azure-Mobile-Services/Windows-Store-app-Getting-Started-with-the-Windows-Azure-Mobile-Services-Scheduler" target="_blank" class="label">watch the tutorial</a> <a style="background-image: url('/media/devcenter/mobile/videos/get-started-with-scheduler-180x120.png') !important;" href="http://channel9.msdn.com/Series/Windows-Azure-Mobile-Services/Windows-Store-app-Getting-Started-with-the-Windows-Azure-Mobile-Services-Scheduler" target="_blank" class="dev-onpage-video"><span class="icon">Play Video</span></a> <span class="time">5:22</span></div>
</div>

This tutorial walks you through the basic steps of how to use the job scheduler to create a scheduled job that requests tweet data from Twitter and stores the tweets in a new Updates table. You can watch a video version of this tutorial by clicking the clip to the right.

<a name="create-table"></a><h2><span class="short-header">Create new table</span>Create the new Updates table</h2>

1. Log on to the [Windows Azure Management Portal], click **Mobile Services**, and then click your mobile service.

2. Click the **Data** tab, then click **+Create**.

   ![][2]

   This displays the **Create new table** dialog.

3. In **Table name** type _Updates_, then click the check button.

   ![][3]

  This creates a new storage table **Updates**. 

Now that you have somewhere to store Twitter data, you can create the scheduled job.

<a name="add-job"></a><h2><span class="short-header">Create a new job</span>Create a new scheduled job</h2>  

2. Click the **Scheduler** tab, then click **+Create**. 

   ![][4]

    <div class="dev-callout"><b>Note</b>
    <p>When you run your mobile service in <i>free</i> mode, you are only able to run one scheduled job at a time. In <i>reserved</i> mode, you can run up to ten scheduled jobs at a time.</p>
    </div>

3. In the scheduler dialog, enter <i>getUpdates</i> for the **Job Name**, set the schedule interval and units, then click the check button. 
   
   ![][5]

   This creates a new job named **getUpdates**. 

4. Click the new job you just created, then click the **Script** tab.

   ![][6] 

5. Replace the placeholder function **getUpdates** with the following code:

        var updatesTable = tables.getTable('Updates');
		var request = require('request');
		 
		function getUpdates() {   
			// Check what is the last tweet we stored when the job last ran
			// and ask Twitter to only give us more recent tweets
			appendLastTweetId(
				'http://search.twitter.com/search.json?q=%23mobileservices&result_type=recent', 
				function twitterUrlReady(url){
					request(url, function tweetsLoaded (error, response, body) {
						if (!error && response.statusCode == 200) {
							var results = JSON.parse(body).results;
							if(results){
								console.log('Fetched new results from Twitter');
								results.forEach(function visitResult(tweet){
									if(!filterOutTweet(tweet)){
										var update = {
											twitterId: tweet.id,
											text: tweet.text,
											author: tweet.from_user,
											date: tweet.created_at
										};
										updatesTable.insert(update);
									}
								});
							}            
						} else { 
							console.error('Could not contact Twitter');
						}
					});
					 
				});
		 }
		 
		// Find the largest (most recent) tweet ID we have already stored
		// (if we have stored any) and ask Twitter to only return more
		// recent ones
		function appendLastTweetId(url, callback){
			updatesTable
			.orderByDescending('twitterId')
			.read({success: function readUpdates(updates){
				if(updates.length){
					callback(url + '&since_id=' + updates[0].twitterId + 1);
				} else {
					callback(url);
				}
			}});
		}
 
		function filterOutTweet(tweet){
			// Remove retweets and replies
			return !((tweet.text.indexOf('RT')  !== 0) && (tweet.to_user_id === 0));
		}

   This script calls the Twitter query API to request recent tweets that contain the hashtag `#mobileservices`. Duplicate tweets and replies are removed from the results before they are stored in the table.

6. Click **Run Once** to test the script. 

  ![][7]

   This saves and executes the job while it remains disabled in the scheduler.

7. Click the back button, click **Data**, click the **Updates** table, click **Browse**, and verify that Twitter data has been inserted into the table.

   ![][8]

8. Click the back button, click **Scheduler**, select **getUpdates**, then click **Enable**.

   ![][9]

   This enables the job to run on the specified schedule, in this case every hour.

Congratulations, you have successfully created a new scheduled job in your mobile service. This job will be executed as scheduled until you disable or modify it.

## <a name="nextsteps"> </a>Next Steps

* [Mobile Services server script reference]
  <br/>Learn more about registering and using server scripts.

<!-- Anchors. -->
[Create the new Tweets table]: #create-table
[Create a new scheduled job]: #add-job
[Next steps]: #next-steps

<!-- Images. -->
[1]: ../Media/mobile-services-selection.png
[2]: ../Media/mobile-data-tab-empty-cli.png
[3]: ../Media/mobile-create-updates-table.png
[4]: ../Media/mobile-schedule-new-job-cli.png
[5]: ../Media/mobile-create-job-dialog.png
[6]: ../Media/mobile-schedule-job-script-new.png
[7]: ../Media/mobile-schedule-job-script.png
[8]: ../Media/mobile-browse-updates-table.png
[9]: ../Media/mobile-schedule-job-enabled.png

<!-- URLs. -->
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/?LinkId=262293
[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/
