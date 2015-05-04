<properties 
	pageTitle="Schedule Backend Tasks with Scheduler - Mobile Services" 
	description="Use the Azure Mobile Services Scheduler to schedule jobs for your mobile app." 
	services="mobile-services" 
	documentationCenter="" 
	authors="ggailey777" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="" 
	ms.devlang="multiple" 
	ms.topic="article" 
	ms.date="02/26/2015" 
	ms.author="glenga"/>

# Schedule recurring jobs in Mobile Services 

> [AZURE.SELECTOR-LIST (Platform | Backend)]
- [(Any | .NET)](mobile-services-dotnet-backend-schedule-recurring-tasks.md)
- [(Any | Javascript)](mobile-services-schedule-recurring-tasks.md)
 
This topic shows you how to use the job scheduler functionality in the Management Portal to define server script code that is executed based on a schedule that you define. In this case, the script periodically check with a remote service, in this case Twitter, and stores the results in a new table. Some other periodic tasks that can be scheduled include:

+ Archiving old or duplicate data records.
+ Requesting and storing external data, such as tweets, RSS entries, and location information.
+ Processing or resizing stored images.

This tutorial walks you through the following steps of how to use the job scheduler to create a scheduled job that requests tweet data from Twitter and stores the tweets in a new Updates table:

+ [Register for Twitter access and store credentials]
+ [Create the new Updates table]
+ [Create a new scheduled job]

##<a name="get-oauth-credentials"></a>Register for access to Twitter v1.1 APIs and store credentials

[AZURE.INCLUDE [mobile-services-register-twitter-access](../includes/mobile-services-register-twitter-access.md)]

##<a name="create-table"></a>Create the new Updates table

Next, you need to create a new table in which to store tweets.

2. In the Management Portal, click the **Data** tab for your mobile service, then click **+Create**.

3. In **Table name** type _Updates_, then click the check button.

##<a name="add-job"></a>Create a new scheduled job  

Now, you can create the scheduled job that accesses Twitter and stores tweet data in the new Updates table.

2. Click the **Scheduler** tab, then click **+Create**. 

    >[AZURE.NOTE]When you run your mobile service in <em>Free</em> tier, you are only able to run one scheduled job at a time. In paid tiers, you can run up to ten scheduled jobs at a time.

3. In the scheduler dialog, enter _getUpdates_ for the **Job Name**, set the schedule interval and units, then click the check button. 

   	This creates a new job named **getUpdates**. 

4. Click the new job you just created, click the **Script** tab and replace the placeholder function **getUpdates** with the following code:

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

    >[AZURE.NOTE]This sample assumes that only a few rows are inserted into the table during each scheduled run. In cases where many rows are inserted in a loop you may run out of connections when running on the Free tier. In this case, you should perform inserts in batches. For more information, see <a href="/develop/mobile/how-to-guides/work-with-server-scripts/#bulk-inserts">How to: Perform bulk inserts</a>.

6. Click **Run Once** to test the script. 

   	This saves and executes the job while it remains disabled in the scheduler.

7. Click the back button, click **Data**, click the **Updates** table, click **Browse**, and verify that Twitter data has been inserted into the table.

8. Click the back button, click **Scheduler**, select **getUpdates**, then click **Enable**.

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
[Azure Management Portal]: https://manage.windowsazure.com/
[Register your apps for Twitter login with Mobile Services]: /develop/mobile/how-to-guides/register-for-twitter-authentication
[Twitter Developers]: http://go.microsoft.com/fwlink/p/?LinkId=268300
[App settings]: http://msdn.microsoft.com/library/windowsazure/b6bb7d2d-35ae-47eb-a03f-6ee393e170f7
