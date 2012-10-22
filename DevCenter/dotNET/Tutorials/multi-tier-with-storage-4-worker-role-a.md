<div chunk="../chunks/article-left-menu.md" />

# Building worker role A (email scheduler) for the Azure Email Service application - 4 of 5. 

This is the fifth tutorial in a series of five that show how to build and deploy the Azure Email Service sample application.  For information about the application and the tutorial series, see the [first tutorial in the series][firsttutorial].

In this tutorial you'll learn:

* How to add work items to a queue for processing by another worker role.
 
You already created the worker role A project when you created the cloud service project. So all you have to do now is program the worker role and configure it to use your Windows Azure Storage account.




<h2><a name="addref"></a><span class="short-header">Add reference</span>Add a reference to the web project</h2>

You need a reference to the web project because that is where the entity classes are defined. You'll use the same entity classes in worker role B to read and write data in the Windows Azure tables that the application uses.

4. Right-click the WorkerRoleA project, and choose **Add Reference**.

   ![Add reference in WorkerRoleA project][mtas-worker-a-add-reference-menu]

4. In **Reference Manager**, add a reference to the MvcWebRole project (or to the web application project if you are running the web UI in a Windows Azure Web Site), then click **OK**.

   ![Add reference to MvcWebRole][mtas-worker-a-reference-manager]




<h2><a name="addmodel"></a><span class="short-header">Add SendEmail model</span>Add the SendEmail model</h2>

Worker role A will work with the `SendEmail` rows in the `Message` table, so it needs a model class to use in Windows Azure Table queries.  Since both worker role A and B work with these `Message` table rows, and since all of the other model classes are defined in the web project, it makes sense to define this one in the web project also.

1. In **Solution Explorer**, right-click the Models folder in the web project and choose **Add Existing Item**.

   ![Add existing item to Models folder in web project][mtas-add-existing-for-sendemail-model]

3. Navigate to the folder where you downloaded the sample application, select the SendEmail.cs file in the web project Models folder, and click Add.

4. Open SendEmail.cs and examine the code.

	    public class SendEmail : TableServiceEntity
	    {
	        public long MessageRef
	        {
	            get
	            {
	                return long.Parse(this.PartitionKey);
	            }
	            set
	            {
	                this.PartitionKey = value.ToString();
	            }
	        }
	
	        public string EmailAddress
	        {
	            get
	            {
	                return this.RowKey;
	            }
	            set
	            {
	                this.RowKey = value;
	                
	            }
	        }
	
	        public DateTime? ScheduledDate { get; set; }
	
	        public String FromEmailAddress { get; set; }
	        
	        public string SubjectLine { get; set; }
	
	        public bool? EmailSent { get; set; }
	    }
	
   The code here is similar to the other model classes, except that no DataAnnotations attributes are included because there is no UI associated with this model -- it is not used in an MVC controller.

   These rows in the Message table serve several purposes:
   * They provide all of the information that worker role B needs in order to send a single email.
   * They track whether an email has been sent, in order to prevent duplicates from being sent in case a worker role restarts after a failure.
   * They make it possible for worker role A to determine when all emails for a message have been sent, so that it can be marked as `Complete`.




<h2><a name="addcode"></a><span class="short-header">Add worker role code</span>Add code that runs when the worker role starts</h2>

4. In the WorkerRoleA project, open WorkerRole.cs and examine the code.
	
	    public class WorkerRole : RoleEntryPoint
	    {
	        public override void Run()
	        {
	            // This is a sample worker implementation. Replace with your logic.
	            Trace.WriteLine("WorkerRole1 entry point called", "Information");
	
	            while (true)
	            {
	                Thread.Sleep(10000);
	                Trace.WriteLine("Working", "Information");
	            }
	        }
	
	        public override bool OnStart()
	        {
	            // Set the maximum number of concurrent connections 
	            ServicePointManager.DefaultConnectionLimit = 12;
	
	            // For information on handling configuration changes
	            // see the MSDN topic at http://go.microsoft.com/fwlink/?LinkId=166357.
	
	            return base.OnStart();
	        }
	    }
	
   This is the default template code for the worker role. There is an `OnStart` method in which you can put initialization code that runs only when an instance of the worker role starts, and a `Run` method that is called after the `OnStart` method completes. You'll replace this code with your own initialization and run code.

5. Delete WorkerRole.cs, then right-click the WorkerRoleA project, and choose **Add Existing Item**.

   ![Add existing item to Worker Role A][mtas-worker-a-add-existing]

2. Navigate to the folder where you downloaded the sample application, select the WorkerRoleA.cs file in the WorkerRoleA project, and click **Add**.

3. Open WorkerRoleA.cs and examine the code.

   The `OnStart` method initializes the context objects that you need in order to work with Windows Azure storage entities. It also makes sure that all of the tables, queues, and blob containers that you'll be using in the `Run` method exist. The code that performs these tasks is similar to what you saw earlier in the MVC controller constructors. You'll configure the connection strings that this method uses later.

        public override bool OnStart()
        {
            // Set the maximum number of concurrent connections 
            ServicePointManager.DefaultConnectionLimit = 12;

            ConfigDiagnostics();
            Trace.TraceInformation("Initializing storage account");
            var storageAccount = CloudStorageAccount.Parse(RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

            CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();
            this.sendEmailQueue = queueClient.GetQueueReference("azuremailqueue");
            CloudTableClient tableClient = storageAccount.CreateCloudTableClient();
            tableServiceContext = tableClient.GetDataServiceContext();

            // Create if not exists for queue, blob container, SentEmail table. 
            bool storageInitialized = false;
             while (!storageInitialized)
            {
                try
                {

                    sendEmailQueue.CreateIfNotExist();
                    tableClient.CreateTableIfNotExist("Message");
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

   The `ConfigureDiagnostics` method that the `OnStart` method calls sets up tracing so that you will be able to see the output from Trace.Information and Trace.Error methods.

        private void ConfigureDiagnostics()
        {
            DiagnosticMonitorConfiguration config = 
                DiagnosticMonitor.GetDefaultInitialConfiguration();
            config.ConfigurationChangePollInterval = 
                TimeSpan.FromMinutes(60.0);
            config.Logs.BufferQuotaInMB = 500;
            config.Logs.ScheduledTransferLogLevelFilter = 
                LogLevel.Verbose;
            config.Logs.ScheduledTransferPeriod = 
                TimeSpan.FromMinutes(30.0);

            DiagnosticMonitor.Start(
                "Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString", 
                config);
        }

   The `Run` method processes performs two functions:

   * Scans the Message table looking for messages scheduled to be sent today or earlier, for which queue work items haven't been created yet.

   * Scans the Message table looking for messages that have a status indicating that all of the queue work items were created but the all of the emails haven't been sent yet. If it finds one, it scans the Message table to see if all emails were sent, and if they were, it updates the status to `Completed`.

        public override void Run()
        {
            Trace.TraceInformation("WorkerRoleA posting queue messages");

            // In the loop we'll look for messages scheduled to be sent today or earlier.
            var tomorrow = DateTime.Today.AddDays(1.0);

            while (true)
            {
                var messagesToProcess =
                    (from e in tableServiceContext.CreateQuery<Message>("Message")
                     where e.RowKey == "Message" && e.ScheduledDate < tomorrow
                       && e.Status == "Pending"
                     select e);

                foreach (Message messageToProcess in messagesToProcess)
                {
                    ProcessMessage(messageToProcess);

                    messageToProcess.Status = "Processing";
                    tableServiceContext.UpdateObject(messageToProcess);
                    tableServiceContext.SaveChangesWithRetries();
                }

                // If message is marked Proccessing, check if every email has been sent
                // If all emails are sent, change status from "Processing" to "Complete"
                
                var messageMarkedProcessing =
                  (from e in tableServiceContext.CreateQuery<Message>("Message")
                   where e.RowKey == "Message" && e.Status == "Processing"
                   select e);

                foreach (Message messageToPossiblyChangeStatus in messageMarkedProcessing)
                {
                    CheckAndUpdateStatusIfComplete(messageToPossiblyChangeStatus);
                }
                // Sleep for one minute to minimize query costs.
                // Subscribers will have up to a one minute additional delay.
                System.Threading.Thread.Sleep(1000*60);
            }
        }

   The first loop processes a query for `Message` rows in the `Message` table that are still in `Pending` status and have scheduled date before tomorrow. 

                var messagesToProcess =
                    (from e in tableServiceContext.CreateQuery<Message>("Message")
                     where e.RowKey == "Message" && e.ScheduledDate < tomorrow
                       && e.Status == "Pending"
                     select e);

   In the loop it calls the ProcessMessage method to create the queue work items to send emails for the message, then it sets the `Message` row status to `Processing`.

                foreach (Message messageToProcess in messagesToProcess)
                {
                    ProcessMessage(messageToProcess);

                    messageToProcess.Status = "Processing";
                    tableServiceContext.UpdateObject(messageToProcess);
                    tableServiceContext.SaveChangesWithRetries();
                }

   If worker role A goes down while it is creating queue work items for a message, when it starts up again the Message row will still be in Pending status, which means it will be picked up by this query again. In that case it will start all over creating queue work items. Some queue work items will then be duplicates of the ones created before the failure happened, but as you will see when you get to worker role B, the `EmailSent` flag in the email address rows of the `Message` table keeps duplicate emails from being sent.

   The second loop processes a query for `Message` rows in the `Message` table that are in `Processing` status.
 
                var messageMarkedProcessing =
                  (from e in tableServiceContext.CreateQuery<Message>("Message")
                   where e.RowKey == "Message" && e.Status == "Processing"
                   select e);

   In the loop it calls a method that checks if all of the emails for the message were sent, and if they were, it sets the Message row status to `Complete`.

   After completing both loops, the code sleeps for one minute.  There is a minimal charge for every Windows Azure Storage query, even if it doesn't return any data, so continuously re-scanning would unnecessarily add to your Windows Azure expenses.

   The `ProcessMessage` method gets all of the email addresses for the destination email list, and creates a queue work item for each email address. As it creates queue work items, it also creates `SendEmail` rows in the `Message` table. These rows provide worker role B with the information it needs to send emails and includes an `EmailSent` property that tracks whether each email has been sent.

        private void ProcessMessage(Message messageToProcess)
        {
            // Get Mailing List info to get the "From" email address.
            var mailingList =
                (from e in tableServiceContext.CreateQuery<MailingList>("MailingList")
                 where e.PartitionKey == messageToProcess.ListName && e.RowKey == "MailingList"
                 select e).Single();

            // Get email addresses for this Mailing List.
            var subscribers =
                (from e in tableServiceContext.CreateQuery<Subscriber>("MailingList")
                 where e.PartitionKey == messageToProcess.ListName && e.RowKey != "MailingList"
                 select e);

            foreach (Subscriber subscriber in subscribers)
            {
                if (subscriber.Verified == false)                  {
                    Trace.TraceInformation("Subscriber " + subscriber.EmailAddress + " Not Verified, so not enqueueing ");
                    continue;
                }

                // Create a row in the SentEmail table.              
                var sendEmailRow = new SendEmail
                {
                    EmailAddress = subscriber.EmailAddress,
                    EmailSent = false,
                    MessageRef = messageToProcess.MessageRef,
                    ScheduledDate = messageToProcess.ScheduledDate,
                    FromEmailAddress = mailingList.FromEmailAddress,
                    SubjectLine = messageToProcess.SubjectLine
                };
                try
                {
                    tableServiceContext.AddObject("Message", sendEmailRow);
                    tableServiceContext.SaveChangesWithRetries();
                }
                // This exception will happen if this worker role goes down after creating some of
                // the rows/queue work items for emails to be sent, then restarts. In that case
                // the row will already be present and we get an exception when SaveChanges executes.
                catch (DataServiceRequestException DSRex)
                {
                    string err = DSRex.Message;
                    if (DSRex.InnerException != null)
                    {
                        err += " InnerEx: " + DSRex.InnerException;
                    }
                    Trace.TraceError(err);
                }

                // Create the queue message.
                string queueMessageString =
                    messageToProcess.MessageRef + "," +
                    subscriber.EmailAddress;
                var queueMessage = new CloudQueueMessage(queueMessageString);
                sendEmailQueue.AddMessage(queueMessage);
            }

            Trace.TraceInformation("Created queue message and tracking row.");
        }

   The code first gets the `MailingList` row from the `MailingList` table for the destination mailing list.  This row has the "from" email address which needs to be provided to worker role B for sending emails.

            // Get Mailing List info to get the "From" email address.
            var mailingList =
                (from e in tableServiceContext.CreateQuery<MailingList>("MailingList")
                 where e.PartitionKey == messageToProcess.ListName && e.RowKey == "MailingList"
                 select e).Single();

   Then it queries the `MailingList` table for all of the `Subscriber` rows for the destination mailing list.

            // Get email addresses for this Mailing List.
            var subscribers =
                (from e in tableServiceContext.CreateQuery<Subscriber>("MailingList")
                 where e.PartitionKey == messageToProcess.ListName && e.RowKey != "MailingList"
                 select e);

   In the loop that processes the query results, the code begins by creating a `SendEmail` row in the Message table. This row contains the information that worker role B will use to send an email. The row is created with the `EmailSent` property set to `false`.

                // Create a SendEmail row in the Message table.              
                var sendEmailRow = new SendEmail
                {
                    EmailAddress = subscriber.EmailAddress,
                    EmailSent = false,
                    MessageRef = messageToProcess.MessageRef,
                    ScheduledDate = messageToProcess.ScheduledDate,
                    FromEmailAddress = mailingList.FromEmailAddress,
                    SubjectLine = messageToProcess.SubjectLine
                };

   The code that saves this update to the Windows Azure table is in a try-catch block because the row might already exist if worker role A is restarting after a failure. In that case the code logs the exception.

                try
                {
                    tableServiceContext.AddObject("Message", sendEmailRow);
                    tableServiceContext.SaveChangesWithRetries();
                }
                // This exception will happen if this worker role goes down after creating some of
                // the rows/queue work items for emails to be sent, then restarts. In that case
                // the row will already be present and we get an exception when SaveChanges executes.
                catch (DataServiceRequestException DSRex)
                {
                    string err = DSRex.Message;
                    if (DSRex.InnerException != null)
                    {
                        err += " InnerEx: " + DSRex.InnerException;
                    }
                    Trace.TraceError(err);
                }

   The last task to be done for each email address is to create the queue work item that will trigger worker role B to send and email. The queue work item contains the `MessageRef` value and the email address, which are the partition key and row key to the `SendEmail` row in the `Message` table. This row contains all of the information worker role B needs in order to send an email.

                // Create the queue message.
                string queueMessageString =
                    messageToProcess.MessageRef + "," +
                    subscriber.EmailAddress;
                var queueMessage = new CloudQueueMessage(queueMessageString);
                sendEmailQueue.AddMessage(queueMessage);

   The `CheckAndUpdateStatusIfComplete` method processes `Message` rows for the second loop in the `Run` method. The query looks for any unsent emails for a message, and if it finds none, it updates the `Message` row status to `Completed`. 

        private void CheckAndUpdateStatusIfComplete(Message messageToCheck)
        {
            // Get the list of emails sent or to be sent for this message.
            var emailsToBeSent =
                (from e in tableServiceContext.CreateQuery<SendEmail>("Message")
                 where e.PartitionKey == messageToCheck.PartitionKey &&
                 e.RowKey != "Message" &&
                 e.EmailSent == false
                 select e).ToList();

            if (emailsToBeSent.Count > 0)
            {
                return;
            }

            messageToCheck.Status = "Complete";
            tableServiceContext.UpdateObject(messageToCheck);
            tableServiceContext.SaveChangesWithRetries();
        }





<h2><a name="configure"></a><span class="short-header">Configure storage</span>Configure the storage connection string</h2>

You can follow the same procedure that you used for the MVC Web Role to add the storage account setting in worker role A. 

1. In Solution Explorer, right-click **WorkerRoleA** under **Roles** in the **AzureEmailService** cloud project, and then choose **Properties**.

2. Make sure that **All Configurations** is selected in the **Service Configuration** drop-down list.

2. Select the **Settings** tab and then click **Add Setting**.

3. Enter StorageConnectionString in the **Name** column.

4. Select **Connection String** in the **Type** drop-down list.  
  
5. Click the ellipsis (**...**) at the right end of the line to create a new connection string.

6. In the **Storage Account Connection String** dialog box, select *Enter storage account credentials*.

7. In a browser window, go to the Windows Azure management portal.

8. Select the **Storage** tab, and then click **Manage keys** at the bottom of the page.

9. Copy the **Storage account name** value, and paste it into the **Account name** box in the **Storage Account Connection String** dialog box in Visual Studio.

9. Copy the **Primary access key** value, and paste it into the **Account key** box in the **Storage Account Connection String** dialog box in Visual Studio.

10. Press CTRL-S to save your changes.



<h2><a name="testing"></a><span class="short-header">Testing</span>Testing worker role A</h2>

1. Run the application by pressing F5.

2. Use the administrator web pages to create a mailing list and create subscribers to the mailing list. Set the `Verified` property to `true` for at least one of the subscribers, and set the email address to an address that you can receive mail at.

   No emails will be sent until you implement worker role B, but you'll use the same test data for testing worker role B.

3. Create a message to be sent to the mailing list you created, and set the scheduled date to today or a date in the past.

   ![New message in pending status][mtas-worker-a-test-pending]

4. In a little over a minute (because of the one minute sleep time in the Run method), refresh the Messages web page and you see the status change to Processing.  

   ![New message in processing status][mtas-worker-a-test-processing]

5. Open Azure Storage Explorer and select your test storage account.

6. In Azure Storage Explorer, under **Storage Type** select **Queues** and then select **azuremailqueue**.

   You see one queue message for each verified subscriber in your destination email list.

   ![Queue message in ASE][mtas-worker-a-tst-ase-queue]

7. Double-click a queue message, and then in the **Message Detail** dialog box select the **Message** tab.

    You see the contents of the queue message: the MessageRef value and the email address, delimited by a comma.

   ![Queue message contents in ASE][mtas-worker-a-tst-ase-queue-detail]

8. Close the **Message Detail** dialog box.

9. Under **Storage Type**, select **Tables**, and then select the **Message** table.

10. Click **Query** to see all of the rows in the table.

   You see the message you scheduled, with "Message" in the row key, followed by a row for each verified subscriber, with the email address in the row key.

   ![Message table rows in ASE][mtas-worker-a-test-ase-message-table]

11. Double-click a row that has an email address in the row key, to see the contents of the `SendEmail` row that worker role A created.

   ![SendEmail row in Message table][mtas-worker-a-test-ase-sendemail-row]

<h2><a name="nextsteps"></a><span class="short-header">Next steps</span>Next steps</h2>

You have now built worker role A and verified that it creates the queue messages and table rows that worker role B needs in order to send emails. In the [next tutorial][tut5], you'll build and test worker role B.

[createsolution]: #cloudproject
[mailinglist]: #mailinglist
[message]: #message
[subscriber]: #subscriber
[webapi]: #webapi
[nextsteps]: #nextsteps

[firsttutorial]: http://windowsazure.com/en-us/develop/net/tutorials/multi-tier-web-site/1-overview/
[tut5]: http://windowsazure.com/en-us/develop/net/tutorials/multi-tier-web-site/5-worker-role-b/

[mtas-new-worker-role-project]: ../Media/mtas-new-worker-role-project.png
[mtas-add-new-role-project-dialog]: ../Media/mtas-add-new-role-project-dialog.png
[mtas-worker-a-add-existing]: ../Media/mtas-worker-a-add-existing.png
[mtas-worker-a-add-reference-menu]: ../Media/mtas-worker-a-add-reference-menu.png
[mtas-worker-a-reference-manager]: ../Media/mtas-worker-a-reference-manager.png
[mtas-add-existing-for-sendemail-model]: ../Media/mtas-add-existing-for-sendemail-model.png
[mtas-worker-a-test-processing]: ../Media/mtas-worker-a-test-processing.png
[mtas-worker-a-test-pending]: ../Media/mtas-worker-a-test-pending.png
[mtas-worker-a-tst-ase-queue]: ../Media/mtas-worker-a-test-ase-queue.png
[mtas-worker-a-tst-ase-queue-detail]: ../Media/mtas-worker-a-test-ase-queue-detail.png
[mtas-worker-a-test-ase-message-table]: ../Media/mtas-worker-a-test-ase-message-table.png
[mtas-worker-a-test-ase-sendemail-row]: ../Media/mtas-worker-a-test-ase-sendemail-row.png


