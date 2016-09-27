<properties
	pageTitle="Schedule backend tasks in a .NET backend mobile service | Microsoft Azure"
	description="Use the scheduler in Azure Mobile Services to define .NET backend jobs that run on a schedule."
	services="mobile-services"
	documentationCenter=""
	authors="ggailey777"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="mobile-services"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-multiple"
	ms.devlang="multiple"
	ms.topic="article"
	ms.date="07/21/2016"
	ms.author="glenga"/>

# Schedule recurring jobs in Mobile Services

[AZURE.INCLUDE [mobile-service-note-mobile-apps](../../includes/mobile-services-note-mobile-apps.md)]

&nbsp;


> [AZURE.SELECTOR]
- [.NET backend](mobile-services-dotnet-backend-schedule-recurring-tasks.md)
- [Javascript backend](mobile-services-schedule-recurring-tasks.md)

This topic shows you how to use the job scheduler functionality in the Azure classic portal to define server script code that is executed based on a schedule that you define. In this case, the script periodically check with a remote service, in this case Twitter, and stores the results in a new table. Some other periodic tasks that can be scheduled include:

+ Archiving old or duplicate data records.
+ Requesting and storing external data, such as tweets, RSS entries, and location information.
+ Processing or resizing stored images.

This tutorial walks you through how to use the job scheduler to create a scheduled job that requests tweet data from Twitter and stores the tweets in a new Updates table.

>[AZURE.NOTE]This tutorial uses the third-party LINQ to Twitter library to simplify OAuth 2.0 access to Twitter v1.1. APIs. You must download and install the LINQ to Twitter NuGet package to complete this tutorial. For more information, see the [LINQ to Twitter CodePlex project].

##<a name="get-oauth-credentials"></a>Register for access to Twitter v1.1 APIs and store credentials

[AZURE.INCLUDE [mobile-services-register-twitter-access](../../includes/mobile-services-register-twitter-access.md)]

&nbsp;&nbsp;7. In Solution Explorer in Visual Studio, open the web.config file for the mobile service project, locate the `MS_TwitterConsumerKey` and `MS_TwitterConsumerSecret` app settings and replace the values of these keys with Twitter consumer key and consumer secret values that you set in the portal.

&nbsp;&nbsp;8. In the same section, add the following new app settings, replacing the placeholders with the Twitter access token and access token secret values that you set as app settings in the portal:

	<add key="TWITTER_ACCESS_TOKEN" value="**your_access_token**" />
	<add key="TWITTER_ACCESS_TOKEN_SECRET" value="**your_access_token_secret**" />

The mobile service uses these stored settings when it runs on the local computer, which lets you test the scheduled job before you publish it. When running in Azure, the mobile service instead uses values set in the portal and ignores these project settings.

##<a name="install-linq2twitter"></a>Download and install the LINQ to Twitter library

1. In **Solution Explorer** in Visual Studio, right-click the project name, and then select **Manage NuGet Packages**.

2. In the left pane, select the **Online** category, search for `linq2twitter`, click **Install** on the **linqtotwitter** package, then read and accept the license agreements.

  	![][1]

  	This adds the Linq to Twitter library to your mobile service project.

Next, you need to create a new table in which to store tweets.

##<a name="create-table"></a>Create the new Updates table

1. In the Solution Explorer in Visual Studio, right-click the DataObjects folder, expand **Add**, click **Class**,   type `Updates` for **Name**, then click **Add**.

	This creates a new project file for the Updates class.

2. Right-click **References** > **Add Reference...** > **Framework** under **Assemblies**, then check **System.ComponentModel.DataAnnotations** and click **OK**.

	![][7]

	This adds a new assembly reference.

2. In this new class, add the following **using** statements:

		using Microsoft.WindowsAzure.Mobile.Service;
		using System.ComponentModel.DataAnnotations;

3. Replace the **Updates** class definition with the following code:

		public class Updates
	    {
	        [Key]
	        public int UpdateId { get; set; }
	        public long TweetId { get; set; }
	        public string Text { get; set; }
	        public string Author { get; set; }
	        public DateTime Date { get; set; }
    	}

4. Expand the Models folder, open the data model context file (named *service_name*Context.cs) and add the following property that returns a typed **DbSet**:

		public DbSet<Updates> Updates { get; set; }

	The Updates table, which is created in the database when the DbSet is first accessed, is used by the service to store tweet data.

	>[AZURE.NOTE] When using the default database initializer, Entity Framework will drop and recreate the database whenever it detects a data model change in the Code First model definition. To make this data model change and maintain existing data in the database, you must use Code First Migrations. The default initializer cannot be used against a SQL Database in Azure. For more information, see [How to Use Code First Migrations to Update the Data Model](mobile-services-dotnet-backend-use-code-first-migrations.md).

Next, you create the scheduled job that accesses Twitter and stores tweet data in the new Updates table.

##<a name="add-job"></a>Create a new scheduled job

1. Expand the ScheduledJobs folder and open the SampleJob.cs project file.

	This class, which inherits from **ScheduledJob**, represents a job that can be scheduled, in the Azure classic portal, to run on a fixed schedule or on demand.

2. Replace the contents of SampleJob.cs with the following code:

		using System;
		using System.Linq;
		using System.Threading;
		using System.Threading.Tasks;
		using System.Web.Http;
		using Microsoft.WindowsAzure.Mobile.Service;
		using Microsoft.WindowsAzure.Mobile.Service.ScheduledJobs;
		using LinqToTwitter;
		using todolistService.Models;
		using todolistService.DataObjects;

		namespace todolistService
		{
		    // A simple scheduled job which can be invoked manually by submitting an HTTP
		    // POST request to the path "/jobs/sample".
		    public class SampleJob : ScheduledJob
		    {
		        private todolistContext context;
		        private string accessToken;
		        private string accessTokenSecret;

		        protected override void Initialize(ScheduledJobDescriptor scheduledJobDescriptor,
					CancellationToken cancellationToken)
		        {
		            base.Initialize(scheduledJobDescriptor, cancellationToken);

		            // Create a new context with the supplied schema name.
		            context = new todolistContext();
		        }

		        public async override Task ExecuteAsync()
		        {
		            // Try to get the stored Twitter access token from app settings.
		            if (!(Services.Settings.TryGetValue("TWITTER_ACCESS_TOKEN", out accessToken) |
		            Services.Settings.TryGetValue("TWITTER_ACCESS_TOKEN_SECRET", out accessTokenSecret)))
		            {
		                Services.Log.Error("Could not retrieve Twitter access credentials.");
		            }

		            // Create a new authorizer to access Twitter v1.1 APIs
		            // using single-user OAUth 2.0 credentials.
		            MvcAuthorizer auth = new MvcAuthorizer();
		            SingleUserInMemoryCredentialStore store =
		                new SingleUserInMemoryCredentialStore()
		            {
		                ConsumerKey = Services.Settings.TwitterConsumerKey,
		                ConsumerSecret = Services.Settings.TwitterConsumerSecret,
		                OAuthToken = accessToken,
		                OAuthTokenSecret = accessTokenSecret
		            };

		            // Set the credentials for the authorizer.
		            auth.CredentialStore = store;

		            // Create a new LINQ to Twitter context.
		            TwitterContext twitter = new TwitterContext(auth);

		            // Get the ID of the most recent stored tweet.
		            long lastTweetId = 0;
		            if (context.Updates.Count() > 0)
		            {
		                lastTweetId = (from u in context.Updates
		                               orderby u.TweetId descending
		                               select u).Take(1).SingleOrDefault()
		                                            .TweetId;
		            }

		            // Execute a search that returns a filtered result.
		            var response = await (from s in twitter.Search
		                                  where s.Type == SearchType.Search
		                                  && s.Query == "%23mobileservices"
		                                  && s.SinceID == Convert.ToUInt64(lastTweetId + 1)
		                                  && s.ResultType == ResultType.Recent
		                                  select s).SingleOrDefaultAsync();

		            // Remove retweets and replies and log the number of tweets.
		            var filteredTweets = response.Statuses
		                .Where(t => !t.Text.StartsWith("RT") && t.InReplyToUserID == 0);
		            Services.Log.Info("Fetched " + filteredTweets.Count()
		                + " new tweets from Twitter.");

		            // Store new tweets in the Updates table.
		            foreach (Status tweet in filteredTweets)
		            {
		                Updates newTweet =
		                    new Updates
		                    {
		                        TweetId = Convert.ToInt64(tweet.StatusID),
		                        Text = tweet.Text,
		                        Author = tweet.User.Name,
		                        Date = tweet.CreatedAt
		                    };

		                context.Updates.Add(newTweet);
		            }

		            await context.SaveChangesAsync();
		        }
		        protected override void Dispose(bool disposing)
		        {
		            base.Dispose(disposing);
		            if (disposing)
		            {
		                context.Dispose();
		            }
		        }
		    }
		}

	In the above code, you must replace the strings _todolistService_ and _todolistContext_ with the namespace and DbContext of your downloaded project, which are *mobile&#95;service&#95;name*Service and *mobile&#95;service&#95;name*Context, respective.

	In the above code, the **ExecuteAsync** override method calls the Twitter query API using stored credentials to request recent tweets that contain the hashtag `#mobileservices`. Duplicate tweets and replies are removed from the results before they are stored in the table.

##<a name="run-job-locally"></a>Test the scheduled job locally

Schedule jobs can be tested locally before being published to Azure and registered in the portal.

1. In Visual Studio, with the mobile service project set as the startup project, press F5.

	This starts the mobile service project and displays a new browser window with the welcome page.

2. Click **try it out**, then click **POST jobs/{jobName}**.

	![][8]

4. Click **try this out**, type `Sample` as the **{jobName}** parameter value, then click **Send**.

	![][9]

	This sends a new POST request to the Sample job endpoint. In the local service, the **ExecuteAsync** method is started. You can set a break point in this method to debug the code.

3. In Server Explorer, expand **Data Connections**, **MSTableConnectionString**, and **tables**; right-click **Updates** and click **Show Table Data**.

	The new tweets are entered as rows in the data table.

##<a name="register-job"></a>Publish the service and register the new job

The job must be registered in the **Scheduler** tab so that Mobile Services can run it on the schedule that you define.

3. Republish the mobile service project to Azure.

4. In the [Azure classic portal], click Mobile Services, and then click your app.

2. Click the **Scheduler** tab, then click **+Create**.

    >[AZURE.NOTE]When you run your mobile service in <em>Free</em> tier, you are only able to run one scheduled job at a time. In paid tiers, you can run up to ten scheduled jobs at a time.

3. In the scheduler dialog, enter _Sample_ for the **Job Name**, set the schedule interval and units, then click the check button.

   	![][4]

   	This creates a new job named **Sample**.

4. Click the new job you just created, then click **Run Once** to test the script.

   	This executes the job while it remains disabled in the scheduler. From this page, you can enable the job and change its schedule at any time.

	>[AZURE.NOTE]A POST request can still be used to start the scheduled job. However, the authorization defaults to user, which means that the request must include the application key in the header.

4. (Optional) In the [Azure classic portal], click manage for the database associated with your mobile service.

    ![][6]

5. In the Azure classic portal, execute a query to view the changes made by the app. Your query will be similar to the following query but use your mobile service name as schema name instead of `todolist`.

        SELECT * FROM [todolist].[Updates]

Congratulations, you have successfully created a new scheduled job in your mobile service. This job will be executed as scheduled until you disable or modify it.

<!-- Anchors. -->
[Register for Twitter access and store credentials]: #get-oauth-credentials
[Download and install the LINQ to Twitter library]: #install-linq2twitter
[Create the new Updates table]: #create-table
[Create a new scheduled job]: #add-job
[Test the scheduled job locally]: #run-job-locally
[Publish the service and register the job]: #register-job
[Next steps]: #next-steps

<!-- Images. -->
[1]: ./media/mobile-services-dotnet-backend-schedule-recurring-tasks/add-linq2twitter-nuget-package.png
[2]: ./media/mobile-services-dotnet-backend-schedule-recurring-tasks/mobile-services-selection.png
[3]: ./media/mobile-services-dotnet-backend-schedule-recurring-tasks/mobile-schedule-new-job-cli.png
[4]: ./media/mobile-services-dotnet-backend-schedule-recurring-tasks/create-new-job.png
[5]: ./media/mobile-services-dotnet-backend-schedule-recurring-tasks/sample-job-run-once.png
[6]: ./media/mobile-services-dotnet-backend-schedule-recurring-tasks/manage-sql-azure-database.png
[7]: ./media/mobile-services-dotnet-backend-schedule-recurring-tasks/add-component-model-reference.png
[8]: ./media/mobile-services-dotnet-backend-schedule-recurring-tasks/mobile-service-start-page.png
[9]: ./media/mobile-services-dotnet-backend-schedule-recurring-tasks/mobile-service-try-this-out.png

<!-- URLs. -->
[Azure classic portal]: https://manage.windowsazure.com/
[Register your apps for Twitter login with Mobile Services]: mobile-services-how-to-register-twitter-authentication.md
[Twitter Developers]: http://go.microsoft.com/fwlink/p/?LinkId=268300
[App settings]: http://msdn.microsoft.com/library/windowsazure/b6bb7d2d-35ae-47eb-a03f-6ee393e170f7
[LINQ to Twitter CodePlex project]: http://linqtotwitter.codeplex.com/