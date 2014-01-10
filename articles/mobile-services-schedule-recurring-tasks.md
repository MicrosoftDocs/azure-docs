<properties linkid="develop-mobile-tutorials-schedule-backend-tasks" urlDisplayName="Schedule Backend Tasks" pageTitle="Schedule Backend Tasks with Scheduler - Mobile Services" metaKeywords="" description="Use the Windows Azure Mobile Services Scheduler to schedule jobs for your mobile app." metaCanonical="" services="" documentationCenter="Mobile" title="Schedule recurring jobs in Mobile Services" authors=""  solutions="" writer="" manager="" editor=""  />


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

This tutorial walks you through the following steps of how to use the job scheduler to create a scheduled job that requests tweet data from Twitter and stores the tweets in a new Updates table:

+ [Register for Twitter access and store credentials]
+ [Create the new Updates table]
+ [Create a new scheduled job]

You can watch a video version of this tutorial by clicking the clip to the right.

<h2><a name="get-oauth-credentials"></a><span class="short-header">Get Twitter Access </span>Register for access to Twitter v1.1 APIs and store credentials</h2>

The new Twitter v1.1 APIs requires you to authenicate before accessing resources. First, you need to get the credentials needed to request access by using OAuth 2.0. Then, you will store them securely in the app settings for your mobile service.

1. If you haven't already done so, complete the steps in the topic <a href="/en-us/develop/mobile/how-to-guides/register-for-twitter-authentication/" target="_blank">Register your apps for Twitter login with Mobile Services</a>. 
  
  	Twitter generates the credentials needed to enable you to access Twitter v1.1 APIs. You can get these credentials from the Twitter Developers web site. 

2. Navigate to the <a href="http://go.microsoft.com/fwlink/p/?LinkId=268300" target="_blank">Twitter Developers</a> web site, sign-in with your Twitter account credentials, navigate to **My Applications**, and select your Twitter app.

    ![0][0]

3. In the **Details** tab for the app, make a note of the following values:

	+ **Consumer key**
	+ **Consumer secret**
	+ **Access token**
	+ **Access token secret**

	![1][1]

4. Log on to the [Windows Azure Management Portal], click **Mobile Services**, and then click your mobile service.

5. Click the **Identity** tab, enter the **Consumer key** and **Consumer secret** values obtained from Twitter, and click **Save**. 

	![11][11]

2. Click the **Configure** tab, scroll down to **App settings** and enter a **Name** and **Value** pair for each of the following that you obtained from the Twitter site, then click **Save**.

	+ `TWITTER_ACCESS_TOKEN`
	+ `TWITTER_ACCESS_TOKEN_SECRET`

	![10][10]

	This stores the Twitter access token in app settings. Like the consumer credentials on the **Identity** tab, the access credentials are also stored encrypted in app settings, and you can access them in your server scripts without hard-coding them in the script file. For more information, see [App settings].

<h2><a name="create-table"></a><span class="short-header">Create new table</span>Create the new Updates table</h2>

Next, you need to create a new table in which to store tweets.

2. In the Management Portal, click the **Data** tab for your mobile service, then click **+Create**.

   	![][2]

   	This displays the **Create new table** dialog.

3. In **Table name** type _Updates_, then click the check button.

   	![][3]

  	This creates a new storage table **Updates**. 

<h2><a name="add-job"></a><span class="short-header">Create a new job</span>Create a new scheduled job</h2>  

Now, you can create the scheduled job that accesses Twitter and stores tweet data in the new Updates table.

2. Click the **Scheduler** tab, then click **+Create**. 

   	![][4]

    <div class="dev-callout"><b>Note</b>
    <p>When you run your mobile service in <em>Free</em> tier, you are only able to run one scheduled job at a time. In paid tiers, you can run up to ten scheduled jobs at a time.</p>
    </div>

3. In the scheduler dialog, enter _getUpdates_ for the **Job Name**, set the schedule interval and units, then click the check button. 
   
   	![][5]

   	This creates a new job named **getUpdates**. 

4. Click the new job you just created, then click the **Script** tab.

   	![][6] 

5. Replace the placeholder function **getUpdates** with the following code:

		var updatesTable = tables.getTable('Updates');
		var request = require('request');
		var twitterUrl = "https://api.twitter.com/1.1/search/tweets.json?q=%23mobileservices&result_type=recent";

		// Get the service configuration module.
		var config = require('mobileservice-config');
		
		// Get the stored Twitter consumer key and secret. 
		var consumerKey = config.twitterConsumerKey,
		    consumerSecret = config.twitterConsumerSecret
		// Get the Twitter access token from app settings.    
		var accessToken= config.appSettings.TWITTER_ACCESS_TOKEN,
		    accessTokenSecret = config.appSettings.TWITTER_ACCESS_TOKEN_SECRET;
		
		function getUpdates() {   
		    // Check what is the last tweet we stored when the job last ran
		    // and ask Twitter to only give us more recent tweets
		    appendLastTweetId(
		        twitterUrl, 
		        function twitterUrlReady(url){            
		            // Create a new request with OAuth credentials.
		            request.get({
		                url: url,                
		                oauth: {
		                    consumer_key: consumerKey,
		                    consumer_secret: consumerSecret,
		                    token: accessToken,
		                    token_secret: accessTokenSecret
		                }},
		                function (error, response, body) {
		                if (!error && response.statusCode == 200) {
		                    var results = JSON.parse(body).statuses;
		                    if(results){
		                        console.log('Fetched ' + results.length + ' new results from Twitter');                       
		                        results.forEach(function (tweet){
		                            if(!filterOutTweet(tweet)){
		                                var update = {
		                                    twitterId: tweet.id,
		                                    text: tweet.text,
		                                    author: tweet.user.screen_name,
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
		            callback(url + '&since_id=' + (updates[0].twitterId + 1));           
		        } else {
		            callback(url);
		        }
		    }});
		}
		
		function filterOutTweet(tweet){
		    // Remove retweets and replies
		    return (tweet.text.indexOf('RT') === 0 || tweet.to_user_id);
		}


   	This script calls the Twitter query API using stored credentials to request recent tweets that contain the hashtag `#mobileservices`. Duplicate tweets and replies are removed from the results before they are stored in the table.

    <div class="dev-callout"><b>Note</b>
    <p>This sample assumes that only a few rows are inserted into the table during each scheduled run. In cases where many rows are inserted in a loop you may run out of connections when running on the Free tier. In this case, you should perform inserts in batches. For more information, see <a href="/en-us/develop/mobile/how-to-guides/work-with-server-scripts/#bulk-inserts">How to: Perform bulk inserts</a>.</p>
    </div>

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
[Register for Twitter access and store credentials]: #get-oauth-credentials
[Create the new Updates table]: #create-table
[Create a new scheduled job]: #add-job
[Next steps]: #next-steps

<!-- Images. -->
[0]: ./media/mobile-services-schedule-recurring-tasks/mobile-twitter-my-apps.png
[1]: ./media/mobile-services-schedule-recurring-tasks/mobile-twitter-app-secrets.png
[2]: ./media/mobile-services-schedule-recurring-tasks/mobile-data-tab-empty-cli.png
[3]: ./media/mobile-services-schedule-recurring-tasks/mobile-create-updates-table.png
[4]: ./media/mobile-services-schedule-recurring-tasks/mobile-schedule-new-job-cli.png
[5]: ./media/mobile-services-schedule-recurring-tasks/mobile-create-job-dialog.png
[6]: ./media/mobile-services-schedule-recurring-tasks/mobile-schedule-job-script-new.png
[7]: ./media/mobile-services-schedule-recurring-tasks/mobile-schedule-job-script.png
[8]: ./media/mobile-services-schedule-recurring-tasks/mobile-browse-updates-table.png
[9]: ./media/mobile-services-schedule-recurring-tasks/mobile-schedule-job-enabled.png
[10]: ./media/mobile-services-schedule-recurring-tasks/mobile-schedule-job-app-settings.png
[11]: ./media/mobile-services-schedule-recurring-tasks/mobile-identity-tab-twitter-only.png

<!-- URLs. -->
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/?LinkId=262293
[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/
[Register your apps for Twitter login with Mobile Services]: /en-us/develop/mobile/how-to-guides/register-for-twitter-authentication
[Twitter Developers]: http://go.microsoft.com/fwlink/p/?LinkId=268300
[App settings]: http://msdn.microsoft.com/en-us/library/windowsazure/b6bb7d2d-35ae-47eb-a03f-6ee393e170f7
