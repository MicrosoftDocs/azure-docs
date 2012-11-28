<properties linkid="develop-net-tutorials-multi-tier-web-site-5-worker-role-b" urlDisplayName="Step 5: Worker Role B" pageTitle="Multi-tier web site tutorial - Step 5: Worker role B" metaKeywords="Windows Azure tutorial, adding worker role cloud service, C# worker role" metaDescription="The fifth tutorial in a series that teaches how to configure your computer for Windows Azure development and deploy the Email Service app." metaCanonical="" disqusComments="1" umbracoNaviHide="1" />

<div chunk="../chunks/article-left-menu.md" />

# Building worker role B (email sender) for the Windows Azure Email Service application - 5 of 5. 

This is the fifth tutorial in a series of five that show how to build and deploy the Windows Azure Email Service sample application.  For information about the application and the tutorial series, see the [first tutorial in the series][firsttutorial].

In this tutorial you'll learn:

* How to add a worker role to a cloud service project.
* How to poll a queue and process work items from the queue.
* How to send emails by using SendGrid.
 
<h2><a name="addworkerrole"></a><span class="short-header">Add worker role B</span>Add worker role B project to the solution</h2>

1. In Solution Explorer, right-click the cloud service project, and choose **New Worker Role Project**.

   ![New worker role project menu][mtas-new-worker-role-project]

3. In the **Add New Role Project** dialog box, select **C#**, select **Worker Role**, name the project WorkerRoleB, and click **Add**. 

   ![New role project dialog box][mtas-add-new-role-project-dialog]

<h2><a name="addreference"></a><span class="short-header">Add reference</span>Add a reference to the web project</h2>

You need a reference to the web project because that is where the entity classes are defined. You'll use the entity classes in worker role B to read and write data in the Windows Azure tables that the application uses.

4. Right-click the WorkerRoleB project, and choose **Add Reference**.

   ![Add reference in WorkerRoleB project][mtas-worker-b-add-reference-menu]

4. In **Reference Manager**, add a reference to the MvcWebRole project (or to the web application project if you are running the web UI in a Windows Azure Web Site).

   ![Add reference to MvcWebRole][mtas-worker-b-reference-manager]







<h2><a name="addsendgrid"></a><span class="short-header">Add SendGrid package</span>Add the SendGrid NuGet package to the project</h2>

To send email by using SendGrid, you need to install the SendGrid NuGet package.

1. In **Solution Explorer**, right-click the WorkerRoleB project and choose **Manage NuGet Packages**.

   ![Manage NuGet Packages][mtas-worker-b-manage-nuget]

2. In the **Manage NuGet Packages** dialog box, select the Online tab, enter "sendgrid" in the search box, and press Enter.

3. Click **Install** on the **Sendgrid** package.

   ![Install the Sendgrid package][mtas-worker-b-install-sendgrid]

4. Close the dialog box.








<h2><a name="addsettings"></a><span class="short-header">Add project settings</span>Add project settings</h2>

Like worker role A, worker role B needs storage account credentials to work with tables, queues, and blobs. In addition, in order to send email, the worker role needs to have credentials to embed in calls to the SendGrid service. And in order to construct an unsubscribe link to include in emails that it sends, the worker role needs to know the URL of the application. These values are stored in project settings.

For storage account credentials, the procedure is the same as what you saw in [the third tutorial][tut3configstorage].

1. In **Solution Explorer**, under **Roles** in the cloud project, right-click **WorkerRoleB** and choose **Properties**.
 
2. Select the **Settings** tab.

5. In the **Service Configuration** drop down box, select **Local**.

6. Select the **StorageConnectionString** entry, and then click the ellipsis button (**...**).

7. In the **Create Storage Connection String** dialog, click the **Your subscription** radio button, and then click **OK**.

   The settings default to the same values you entered earlier for the web role and worker role A.

1. Follow the same procedure to configure settings for the **Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString** connection string.

Next you create and configure the three new settings that are only used by worker role B.

3. In the **Settings** tab of the **Properties** window, Click **Add Setting**, and then add three new settings of type **String**:

   * **Name**: SendGridUserName, **Value**: the SendGrid user name that you established in [the second tutorial][tut2].

   * **Name**: SendGridPassword, **Value**: the SendGrid password.

   * **Name**: AzureMailServiceURL, * **Value**: the base URL that the application will have when you deploy it, for example:  http://sampleurl.cloudapp.net.

   ![New settings in WorkerRoleB project][mtas-worker-b-settings]

### Add code that runs when the worker role starts

4. In the WorkerRoleB project, delete WorkerRole.cs.

5. Right-click the WorkerRoleB project, and choose **Add Existing Item**.

   ![Add existing item to Worker Role B][mtas-worker-b-add-existing]

2. Navigate to the folder where you downloaded the sample application, select the WorkerRoleB.cs file in the WorkerRoleB project, and click **Add**.

3. Open WorkerRoleB.cs and examine the code.

   As you already saw in worker role A, the `OnStart` method initializes the context classes that you need in order to work with Windows Azure storage entities. It also makes sure that all of the tables, queues, and blob containers you need in the Run method exist.  

   The difference compared to worker role A is the addition of the blob container and the subscribe queue among the resources to create if they don't already exist. You'll use the blob container to get the files that contain the HTML and plain text for the email body. The subscribe queue is used for sending subscription confirmation emails.

        public override bool OnStart()
        {
            ServicePointManager.DefaultConnectionLimit = Environment.ProcessorCount;

            // Read storage account configuration settings
            ConfigureDiagnostics();
            Trace.TraceInformation("Initializing storage account in worker role B");
            var storageAccount = CloudStorageAccount.Parse(RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

            // Initialize queue storage 
            Trace.TraceInformation("Creating queue client.");
            CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();
            this.sendEmailQueue = queueClient.GetQueueReference("azuremailqueue");
            this.subscribeQueue = queueClient.GetQueueReference("azuremailsubscribequeue");
            //trodotr0 put these queue names in class variables

            // Initialize blob storage
            CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
            this.blobContainer = blobClient.GetContainerReference("azuremailblobcontainer");

            // Initialize table storage
            var tableClient = storageAccount.CreateCloudTableClient();
            tableServiceContext = tableClient.GetDataServiceContext();

            Trace.TraceInformation("WorkerB: Creating blob container, queue, tables, if they don't exist.");
            this.blobContainer.CreateIfNotExist();
            this.sendEmailQueue.CreateIfNotExist();
            this.subscribeQueue.CreateIfNotExist();
            tableClient.CreateTableIfNotExist("Message");
            tableClient.CreateTableIfNotExist("MailingList");

            return base.OnStart();
        }

   The Run method processes work items from two queues: the queue used for messages sent to email lists (work items created by worker role A), and the queue used for subscription confirmation emails (work items created by the subscribe API method in the MvcWebRole project).

       
        public override void Run()
        {
            CloudQueueMessage msg = null;

            Trace.TraceInformation("WorkerRoleB start of Run()");
            while (true)
            {
                try
                {
                    bool messageFound = false;

                    // If OnStop has been called, return to do a graceful shutdown.
                    if (this.onStopCalled == true)
                    {
                        Trace.TraceInformation("onStopCalled WorkerRoleB");
                        this.returnedFromRunMethod = true;
                        return;
                    }
                    // Retrieve and process a new message from the send-email-to-list queue.
                    msg = this.sendEmailQueue.GetMessage();
                    if (msg != null)
                    {
                        ProcessQueueMessage(msg);
                        messageFound = true;
                    }

                    // Retrieve and process a new message from the subscribe queue.
                    msg = this.subscribeQueue.GetMessage();
                    if (msg != null)
                    {
                        ProcessSubscribeQueueMessage(msg);
                        messageFound = true;
                    }

                    if (messageFound == false)
                    {
                        System.Threading.Thread.Sleep(1000 * 60);
                    }
                }
                catch (Exception ex)
                {
                    string err = ex.Message;
                    if (ex.InnerException != null)
                    {
                        err += " Inner Exception: " + ex.InnerException.Message;
                    }
                    if (msg != null)
                    {
                        err += " Last queue message retrieved: " + msg.AsString;
                    }
                    Trace.TraceError(err);
                    // Don't fill up Trace storage if we have a bug in either process loop.
                    System.Threading.Thread.Sleep(1000 * 60);
                }
            }
        }

   This code runs in an infinite loop until the worker role is shut down. If a work item is found in the main queue, the code processes it and then checks the subscribe queue. 

                    // Retrieve and process a new message from the send-email-to-list queue.
                    msg = this.sendEmailQueue.GetMessage();
                    if (msg != null)
                    {
                        ProcessQueueMessage(msg);
                        messageFound = true;
                    }

                    // Retrieve and process a new message from the subscribe queue.
                    msg = this.subscribeQueue.GetMessage();
                    if (msg != null)
                    {
                        ProcessSubscribeQueueMessage(msg);
                        messageFound = true;
                    }

   If nothing is waiting in either queue, the code sleeps 60 seconds before continuing with the loop. 

                    if (messageFound == false)
                    {
                        System.Threading.Thread.Sleep(1000 * 60);
                    }

   The purpose of the sleep time is to minimize Windows Azure Storage transaction costs. Each time you call the [GetMessage][] method counts as one storage transaction. Currently, the [cost per queue transaction](http://msdn.microsoft.com/en-us/library/windowsazure/hh767287.aspx)  is $0.01 (one cent) per 10,000 transactions. The 60 second sleep time was chosen to balance transaction costs and application responsiveness.  

   When a queue item is pulled from the queue by the [GetMessage][]  method, that queue item becomes invisible for 30 seconds to all other worker and web roles accessing the queue. This is what ensures that only one worker role instance will pick up any given queue message for processing. You can explicitly set this *exclusive lease* time (the time the queue item is invisible) in the  `GetMessage` method by passing a  [visibility timeout](http://msdn.microsoft.com/en-us/library/windowsazure/ee758454.aspx) parameter. If the worker role could take more than 30 seconds to process a queue message, you should increase the exclusive lease time to prevent other role instances from processing the same message. 

   On the other hand, you don't want to set the exclusive lease time to an excessively large value. For example, if the exclusive lease time is set to 48 hours and your worker role unexpectedly shuts down after dequeueing a message, another worker role would not be able to process the message for 48 hours. The exclusive lease maximum is 7 days.

   The  [GetMessages](http://msdn.microsoft.com/en-us/library/windowsazure/microsoft.windowsazure.storageclient.cloudqueue.getmessages.aspx)  method can be used to pull up to 32 messages from the queue in one call. Each queue access incurs a small transaction cost, and the transaction cost is the same whether 32 messages are returned or zero messages are returned. The code below fetches up to 32 messages in one call.

    	foreach (CloudQueueMessage msg in sendEmailQueue.GetMessages(32))
	    {
	        ProcessQueueMessage(msg);
	        messageFound = true;
	    }

   When using `GetMessages` to remove multiple messages, be sure the visibility timeout gives your application enough time to process all the messages. Once the visibility timeout expires, other role instances can access the message, and once they do, the first instance will not be able to delete the message when it finishes processing the work item.

   The `Run` method calls `ProcessQueueMessage` when it finds a work item in the main queue:

        private void ProcessQueueMessage(CloudQueueMessage msg)
        {
            // Log and delete if this is a "poison" queue message (repeatedly processed
            // and always causes an error that prevents processing from completing).
            if (msg.DequeueCount > 3)
            {
                Trace.TraceError("Deleting poison message:    message {1} Role Instance {2}.",
                    msg.ToString(), GetRoleInstance());
                this.sendEmailQueue.DeleteMessage(msg);
                return;
            }

            // Parse message retrieved from queue.
            // Example:  0123456789,email@domain.com
            var messageParts = msg.AsString.Split(new char[] { ',' });
            var messageRef = messageParts[0];
            var emailAddress = messageParts[1];

            Trace.TraceInformation("ProcessQueueMessage start:    email {0}  message {1} Role Instance {2}.",
                emailAddress, messageRef, GetRoleInstance());

            // Get the row in the Message table that has data we need to send the email.
            var emailRowInMessageTable =
                 (from e in tableServiceContext.CreateQuery<SendEmail>("Message")
                  where e.PartitionKey == messageRef && e.RowKey == emailAddress
                  select e).Single();

            // Derive blob names from the MessageRef.
            var htmlMessageBodyRef = messageRef + ".htm";
            var textMessageBodyRef = messageRef + ".txt";

            // If the email hasn't already been sent, send email and update the table row to Sent.
            if (emailRowInMessageTable.EmailSent != true)
            {
                SendEmailToList(emailAddress, emailRowInMessageTable.FromEmailAddress, emailRowInMessageTable.SubjectLine, htmlMessageBodyRef, textMessageBodyRef);

                emailRowInMessageTable.EmailSent = true;
                tableServiceContext.UpdateObject(emailRowInMessageTable);
                tableServiceContext.SaveChangesWithRetries();
            }

            // Delete the queue message.
            this.sendEmailQueue.DeleteMessage(msg);

            Trace.TraceInformation("ProcessQueueMessage complete: email {0}  message {1} Role Instance {2}.",
               emailAddress, messageRef, GetRoleInstance());

        }

   This code performs the following tasks:

   * If the message is a "poison" message, it is loged and deleted.  Poison messages are those that cause the application to abort when they are processed.  If a message has been pulled from the queue more than three times, we assume that it cannot be processed and remove it from the queue so that we don't keep trying to process it. 
   * Parses the queue message into MessageRef and EmailAddress values.
   * Gets the Message table row that has info needed to send the email.
   * Calls a method to send the email.
   * Updates the Message table row to indicate the email has been sent.   
   * Deletes the queue work item.

   The actual work of sending the email by using SendGrid is done by the `SendEmailToList` method. If you want to use a different service than SendGrid, all you have to do is change the code in this method.

        private void SendEmailToList(string emailAddress, string fromEmailAddress, string subjectLine, 
            string htmlMessageBodyRef, string textMessageBodyRef)
        {
            var email = SendGrid.GenerateInstance();
            email.From = new MailAddress(fromEmailAddress);
            email.AddTo(emailAddress);
            var blob = blobContainer.GetBlobReference(htmlMessageBodyRef);
            email.Html = blob.DownloadText();
            blob = blobContainer.GetBlobReference(textMessageBodyRef);
            email.Text = blob.DownloadText();
            email.Subject = subjectLine;
            var credentials = new NetworkCredential(RoleEnvironment.GetConfigurationSettingValue("SendGridUserName"),
                RoleEnvironment.GetConfigurationSettingValue("SendGridPassword"));
            var transportREST = REST.GetInstance(credentials);
            transportREST.Deliver(email);
        }

   The `Run` method calls `ProcessSubscribeQueueMessage` when it finds a work item in the subscribe queue:

        private void ProcessSubscribeQueueMessage(CloudQueueMessage msg)
        {
            // Log and delete if this is a "poison" queue message (repeatedly processed
            // and always causes an error that prevents processing from completing).
            if (msg.DequeueCount > 3)
            {
                Trace.TraceError("Deleting poison subscribe message:    message {0}.",
                    msg.AsString, GetRoleInstance());
                this.subscribeQueue.DeleteMessage(msg);
                return;
            }

            // Parse message retrieved from queue. It will consist only of a GUID value.
            var subscriberGUID = msg.AsString;

            Trace.TraceInformation("ProcessSubscribeQueueMessage start:    subscriber GUID {0} Role Instance {1}.",
                subscriberGUID, GetRoleInstance());


            // Get subscriber info. 
            var subscriber =
                (from e in tableServiceContext.CreateQuery<Subscriber>("MailingList")
                 where e.SubscriberGUID == subscriberGUID
                 select e).Single();

            // Get mailing list info. 
            var mailingList =
                (from e in tableServiceContext.CreateQuery<MailingList>("MailingList")
                 where e.PartitionKey == subscriber.ListName && e.RowKey == "MailingList"
                 select e).Single();

            SendSubscribeEmail(subscriberGUID, subscriber, mailingList);

            this.subscribeQueue.DeleteMessage(msg);

            Trace.TraceInformation("ProcessSubscribeQueueMessage complete: subscriber GUID {0} Role Instance {1}.",
                subscriberGUID, GetRoleInstance());
        }

   This method performs the following tasks:

   * If the message is a "poison" message, logs and deletes it.
   * Gets the subscriber GUID from the queue message.
   * Uses the GUID to get subscriber information from the MailingList table.
   * Sends a confirmation email to the new subscriber.
   * Deletes the queue message.

   As with emails sent to lists, the actual sending of the email is in a separate method, making it easy for you to change to a different email service if you want to do that.

        private static void SendSubscribeEmail(string subscriberGUID, Subscriber subscriber, MailingList mailingList)
        {
            var email = SendGrid.GenerateInstance();
            email.From = new MailAddress(mailingList.FromEmailAddress);
            email.AddTo(subscriber.EmailAddress);
            string subscribeURL = RoleEnvironment.GetConfigurationSettingValue("AzureMailServiceURL") + "/subscribe?guid=" + subscriberGUID;
            email.Html = String.Format("<p>Click the link below to subscribe to {0}. " +
                "If you don't confirm your subscription, you won't be subscribed to the list.</p>" +
                "<a href=\"{1}\">Confirm Subscription</a>", mailingList.Description, subscribeURL);
            email.Text = String.Format("Copy and paste the following URL into your browser in order to subscribe to {0}. " +
                "If you don't confirm your subscription, you won't be subscribed to the list.\n" +
                "{1}", mailingList.Description, subscribeURL);
            email.Subject = "Subscribe to " + mailingList.Description;
            var credentials = new NetworkCredential(RoleEnvironment.GetConfigurationSettingValue("SendGridUserName"), RoleEnvironment.GetConfigurationSettingValue("SendGridPassword"));
            var transportREST = REST.GetInstance(credentials);
            transportREST.Deliver(email);
        }

<h2><a name="testing"></a><span class="short-header">Testing</span>Testing Worker Role B</h2>

1. Run the application by pressing F5.

2. Go to the Messages page to see the message you created to test worker role A. After a minute or so, refresh the web page and you will see the status has changed from Processing to Completed.

   ![New message in pending status][mtas-worker-b-test-completed]

4. Check the email inbox where you expect to get the email. Note that there might be delays in the sending of emails by SendGrid or delivery to your email client, so you might have to wait a while to see the email. You might need to check your junk mail folder also.




<h2><a name="nextsteps"></a><span class="short-header">Next steps</span>Next steps</h2>

You have now built the Windows Azure Email Service application from scratch, and what you have is the same as the completed project that you downloaded.  To deploy to the cloud, test in the cloud, and promote to production, you can use the same procedures you saw in [the second tutorial][tut2].  If you chose to build the alternative architecture, see [this tutorial][getstartedtutorial] for information about how to deploy the MVC project to a Windows Azure Web Site.

To learn more about how to work with the Windows Azure Table service, Queue service, and Blob service, see the following resources:

* [How to get the most out of Windows Azure Tables][getthemostoutoftables]
* [How to use the Queue Storage Service][queuehowto]
* [How to use the Table Storage Service][tablehowto]
* [How to use the Windows Azure Blob Storage Service in .NET][blobhowto]

[createsolution]: #cloudproject
[mailinglist]: #mailinglist
[message]: #message
[subscriber]: #subscriber
[webapi]: #webapi
[nextsteps]: #nextsteps

[firsttutorial]: http://windowsazure.com/en-us/develop/net/tutorials/multi-tier-web-site/1-overview/
[tut2]: http://windowsazure.com/en-us/develop/net/tutorials/multi-tier-web-site/2-download-and-run/
[tut3configstorage]: http://windowsazure.com/en-us/develop/net/tutorials/multi-tier-web-site/3-web-role/#configstorage
[getthemostoutoftables]: http://blogs.msdn.com/b/windowsazurestorage/archive/2010/11/06/how-to-get-most-out-of-windows-azure-tables.aspx
[queuehowto]: http://www.windowsazure.com/en-us/develop/net/how-to-guides/queue-service/
[tablehowto]: http://www.windowsazure.com/en-us/develop/net/how-to-guides/table-services/
[blobhowto]: http://www.windowsazure.com/en-us/develop/net/how-to-guides/blob-storage/
[GetMessage]: http://msdn.microsoft.com/en-us/library/windowsazure/ee741827.aspx
[getstartedtutorial]: http://windowsazure.com/en-us/develop/net/tutorials/get-started

[mtas-new-worker-role-project]: ../Media/mtas-new-worker-role-project.png
[mtas-add-new-role-project-dialog]: ../Media/mtas-add-new-role-project-dialog.png
[mtas-worker-b-add-existing]: ../Media/mtas-worker-b-add-existing.png
[mtas-worker-b-add-reference-menu]: ../Media/mtas-worker-b-add-reference-menu.png
[mtas-worker-b-reference-manager]: ../Media/mtas-worker-b-reference-manager.png
[mtas-worker-b-manage-nuget]: ../Media/mtas-worker-b-manage-nuget.png
[mtas-worker-b-install-sendgrid]: ../Media/mtas-worker-b-install-sendgrid.png
[mtas-worker-b-test-completed]: ../Media/mtas-worker-b-test-completed.png
[mtas-worker-b-properties-menu]: ../Media/mtas-worker-b-properties-menu.png
[mtas-worker-b-settings]: ../Media/mtas-worker-b-settings.png

