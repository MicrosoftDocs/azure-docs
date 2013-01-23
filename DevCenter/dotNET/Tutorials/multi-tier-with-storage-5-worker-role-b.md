<properties linkid="develop-net-tutorials-multi-tier-web-site-5-worker-role-b" urlDisplayName="Step 5: Worker Role B" pageTitle="Multi-tier web site tutorial - Step 5: Worker role B" metaKeywords="Windows Azure tutorial, adding working role cloud service, C# worker role" metaDescription="The fifth tutorial in a series that teaches how to configure your computer for Windows Azure development and deploy the Email Service app." metaCanonical="" disqusComments="1" umbracoNaviHide="1" />


<div chunk="../chunks/article-left-menu.md" />
# Building worker role B (email sender) for the Azure Email Service application - 5 of 5. 

This is the fifth tutorial in a series of five that show how to build and deploy the Azure Email Service sample application.  For information about the application and the tutorial series, see the [first tutorial in the series][firsttutorial].

In this tutorial you'll learn:

* How to add a worker role to a cloud service project.
* How to poll a queue and process work items from the queue.
* How to send emails by using SendGrid.
 
<h2><a name="addworkerrole"></a><span class="short-header">Add worker role B</span>Add worker role B to the cloud service project</h2>

### Add the worker role B project

1. In Solution Explorer, right-click the cloud service project, and choose **New Worker Role Project**.

   ![New worker role project menu][mtas-new-worker-role-project]

3. In the **Add New Role Project** dialog box, select **C#**, select **Worker Role**, name the project WorkerRoleB, and click **Add**. 

   ![New role project dialog box][mtas-add-new-role-project-dialog]

### Add a reference to the web project

You need a reference to the web project because that is where the entity classes are defined. You'll use the entity classes in worker role B to read and write data in the Windows Azure tables that the application uses.

4. Right-click the WorkerRoleB project, and choose **Add Reference**.

   ![Add reference in WorkerRoleB project][mtas-worker-b-add-reference-menu]

4. In **Reference Manager**, add a reference to the MvcWebRole project (or to the web application project if you are running the web UI in a Windows Azure Web Site).

   ![Add reference to MvcWebRole][mtas-worker-b-reference-manager]

### Add the SendGrid NuGet package

To send email by using SendGrid, you need to install the SendGrid NuGet package.

1. In **Solution Explorer**, right-click the WorkerRoleB project and choose **Manage NuGet Packages**.

   ![Manage NuGet Packages][mtas-worker-b-manage-nuget]

2. In the **Manage NuGet Packages** dialog box, select the Online tab, enter "sendgrid" in the search box, and press Enter.

3. Click **Install** on the **Sendgrid** package.

   ![Install the Sendgrid package][mtas-worker-b-install-sendgrid]

4. Close the dialog box.

### Add code that runs when the worker role starts

4. In the WorkerRoleB project, delete WorkerRole.cs.

5. Right-click the WorkerRoleB project, and choose **Add Existing Item**.

   ![Add existing item to Worker Role B][mtas-worker-b-add-existing]

2. Navigate to the folder where you downloaded the sample application, select the WorkerRoleB.cs file in the WorkerRoleB project, and click **Add**.

3. Open WorkerRoleB.cs and examine the code.

   As you already saw in worker role A, the OnStart method initializes the context classes that you need in order to work with Windows Azure storage entities. It also makes sure that all of the tables, queues, and blob containers you need in the Run method exist.  

   The difference here compared to worker role A is the addition of the blob container and the subscribe queue among the resources to create if they don't already exist. You'll use the blob container to get the files that contain email body HTML and plain text, and subscribe queue is used for sending subscription confirmation emails.

        public override bool OnStart()
        {
            // Set the maximum number of concurrent connections 
            //todotrreview why 12?
            ServicePointManager.DefaultConnectionLimit = 12;

            // Read storage account configuration settings
            Trace.TraceInformation("Initializing storage account");            
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
            CloudTableClient tableClient = storageAccount.CreateCloudTableClient();
            tableServiceContext = tableClient.GetDataServiceContext();

            Trace.TraceInformation("Creating blob container, queue, tables, if they don't exist.");
            bool storageInitialized = false;
            while (!storageInitialized)
            {
                try
                {
                    this.blobContainer.CreateIfNotExist();
                    this.sendEmailQueue.CreateIfNotExist();
                    this.subscribeQueue.CreateIfNotExist();
                    tableClient.CreateTableIfNotExist("MailingList");
                    storageInitialized = true;
                }
                catch (StorageClientException e)
                {
                    if (e.ErrorCode == StorageErrorCode.TransportError)
                    {
                        Trace.TraceError(
                          "Storage services initialization failure. "
                        + "Check your storage account configuration settings. If running locally, "
                        + "ensure that the Development Storage service is running. Message: '{0}'",
                        e.Message);
                        System.Threading.Thread.Sleep(5000);
                    }
                    else
                    {
                        throw;
                    }
                }
            }

            return base.OnStart();
        }

   The Run method processes work items from two queues: the queue used for messages sent to email lists (work items created by worker role A), and the queue used for subscription confirmation emails (work items created by the subscribe API method in the MvcWebRole project).

        public override void Run()
        {            
            Trace.TraceInformation("WorkerRoleB listening for queue messages");
            while (true)
            {
                try
                {
                    // Retrieve and process a new message from the send-email-to-list queue.
                    var msg = this.sendEmailQueue.GetMessage();
                    if (msg != null)
                    {
                        ProcessQueueMessage(msg);
                    }
                    else
                    {
                        // todotrReview ask if this is an appropriate sleep value for this loop.
                        System.Threading.Thread.Sleep(5000);
                    }

                    // Retrieve and process a new message from the subscribe queue.
                    msg = this.subscribeQueue.GetMessage();
                    if (msg != null)
                    {
                        ProcessSubscribeQueueMessage(msg);
                    }

                }
                    //todotrreview why are we catching this?
                catch (StorageClientException e)
                {
                    Trace.TraceError("Exception when processing queue item. Message: '{0}'", e.Message);
                    System.Threading.Thread.Sleep(1000*15);
                }
            }
        }

   This code runs in an infinite loop until the worker role is shut down. If a work item is found in the main queue, the code processes it and then checks the subscribe queue. If nothing is waiting in the main queue, the code sleeps 5 seconds before continuing with the loop.  The sleep time prevents the worker role from unnecessarily using too much CPU time.

   The Run method calls ProcessQueueMessage when it finds a work item in the main queue:

        private void ProcessQueueMessage(CloudQueueMessage msg)
        {
            // Parse message retrieved from queue.
            // Example:  0123456789^email@domain.com
            var messageParts = msg.AsString.Split(new char[] { ',' });
            var messageRef = messageParts[0];
            var emailAddress = messageParts[1];

            // Get the row in the Message table that has data we need to send the email.
            var sendEmailRow =
                (from e in tableServiceContext.CreateQuery<SendEmail>("MailingList")
                 where e.PartitionKey == messageRef && e.RowKey == emailAddress
                 select e).Single();

            // Derive blob names from the MessageRef
            var htmlMessageBodyRef = messageRef + ".htm";
            var textMessageBodyRef = messageRef + ".txt";
            Trace.TraceInformation("Processing email address {0} for message {1}.", emailAddress, messageRef);

            // Send email with sendGrid.
            SendEmailToList(emailAddress, sendEmailRow.FromEmailAddress, sendEmailRow.SubjectLine, htmlMessageBodyRef, textMessageBodyRef);

            // Update the SendEmail row to indicate the email has been sent.
            sendEmailRow.EmailSent = true;
            tableServiceContext.UpdateObject(sendEmailRow);
            tableServiceContext.SaveChangesWithRetries();

            // Delete the queue message 
            this.sendEmailQueue.DeleteMessage(msg);

            Trace.TraceInformation("Completed send-email-to-list queue message processing.");
        }

   This code performs the following tasks:

   * Parses the queue message into MessageRef and EmailAddress values.
   * Gets the Message table row that has info needed to send the email.
   * Calls a method to send the email.
   * Updates the Message table row to indicate the email has been sent.   
   * Deletes the queue work item.

   The actual work of sending the email by using SendGrid is done by the SendEmailToList method. If you wanted to use a different service than SendGrid, all you have to do is change the code in this method.

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

   The Run method calls ProcessSubscribeQueueMessage when it finds a work item in the subscribe queue:

        private void ProcessSubscribeQueueMessage(CloudQueueMessage msg)
        {
            // Parse message retrieved from queue. It will consist only of a GUID value.
            var subscriberGUID = msg.AsString;
            Trace.TraceInformation("Processing subscribe email for subscriber GUID {0}.", subscriberGUID);

            // Get subscriber info. Using .Single() to throw exception if not found.
            var subscriber =
                (from e in tableServiceContext.CreateQuery<Subscriber>("MailingList")
                 where e.SubscriberGUID == subscriberGUID
                 select e).Single();

            // Get mailing list info. Using .Single() to throw exception if not found.
            var mailingList =
                (from e in tableServiceContext.CreateQuery<MailingList>("MailingList")
                 where e.PartitionKey == subscriber.ListName && e.RowKey == "0"
                 select e).Single();

            SendSubscribeEmail(subscriberGUID, subscriber, mailingList);

            this.subscribeQueue.DeleteMessage(msg);
           // this.sendEmailQueue.DeleteMessage(msg);

            Trace.TraceInformation("Completed subscribe queue message processing.");
        }

   This method performs the following tasks:

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

4. Check the email inbox where you expect to get the email. Note that there might be delays in sending of emails by SendGrid or delivery to your email client, so you might have to wait a while to see the email.




<h2><a name="nextsteps"></a><span class="short-header">Next steps</span>Next steps</h2>

You have now build the Windows Azure Email Service application from scratch, and what you have is the same as the completed project that you downloaded.  To deploy to the cloud, test in the cloud, and promote to production, you can use the same procedures you saw in [the second tutorial][tut2].

To learn more about how to work with the Windows Azure Table service, Queue service, and Blob service, see the following resources:

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

[mtas-new-worker-role-project]: ../Media/mtas-new-worker-role-project.png
[mtas-add-new-role-project-dialog]: ../Media/mtas-add-new-role-project-dialog.png
[mtas-worker-b-add-existing]: ../Media/mtas-worker-b-add-existing.png
[mtas-worker-b-add-reference-menu]: ../Media/mtas-worker-b-add-reference-menu.png
[mtas-worker-b-reference-manager]: ../Media/mtas-worker-b-reference-manager.png
[mtas-worker-b-manage-nuget]: ../Media/mtas-worker-b-manage-nuget.png
[mtas-worker-b-install-sendgrid]: ../Media/mtas-worker-b-install-sendgrid.png
[mtas-worker-b-test-completed]: ../Media/mtas-worker-b-test-completed.png
[]: ../Media/.png
[]: ../Media/.png
[]: ../Media/.png
[]: ../Media/.png
[]: ../Media/.png
[]: ../Media/.png
[]: ../Media/.png
[]: ../Media/.png
[]: ../Media/.png

