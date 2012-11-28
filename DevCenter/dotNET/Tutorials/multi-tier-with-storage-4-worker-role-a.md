<properties linkid="develop-net-tutorials-multi-tier-web-site-4-worker-role-a" urlDisplayName="Step 4: Worker Role A" pageTitle="Multi-tier web site tutorial - Step 4: Worker role A" metaKeywords="Windows Azure tutorial, .NET multi-tier app, multi-tier architecture" metaDescription="The fourth tutorial in a series that teaches how to configure your computer for Windows Azure development and deploy the Email Service app." metaCanonical="" disqusComments="1" umbracoNaviHide="1" />

<div chunk="../chunks/article-left-menu.md" />

# Building worker role A (email scheduler) for the Windows Azure Email Service application - 4 of 5. 

This is the fourth tutorial in a series of five that show how to build and deploy the Windows Azure Email Service sample application.  For information about the application and the tutorial series, see the [first tutorial in the series][firsttutorial].

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

Worker role A will work with the `SendEmail` rows in the `Message` table, so it needs a model class to use in Windows Azure Table queries.  Since both worker role A and B work with these `Message` table rows, and since all of the other model classes are defined in the web project, it makes sense to define this one in the web project also. The following image shows a `Message` row and three `SendEmail` rows in the `Message` table.

   ![message table with sendmail][mtas-sendMailTbl]

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
	
   The code here is similar to the other model classes, except that no DataAnnotations attributes are included because there is no UI associated with this model -- it is not used in an MVC controller. Notice the `MessageRef` property is just an alias for the partition key, and `EmailAddress` is an alias for the row key.

   These rows in the `Message` table serve several purposes:
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

   The `OnStart` method initializes the context objects that you need in order to work with Windows Azure storage entities. It also makes sure that all of the tables, queues, and blob containers that you'll be using in the `Run` method exist. The code that performs these tasks is similar to what you saw earlier in the MVC controller constructors. You'll configure the connection string that this method uses later.

   
        public override bool OnStart()
        {
            ServicePointManager.DefaultConnectionLimit = Environment.ProcessorCount;

            ConfigureDiagnostics();
            Trace.TraceInformation("Initializing storage account in WorkerA");
            var storageAccount = CloudStorageAccount.Parse(RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

            CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();
            this.sendEmailQueue = queueClient.GetQueueReference("azuremailqueue");
            var tableClient = storageAccount.CreateCloudTableClient();
            tableServiceContext = tableClient.GetDataServiceContext();

            // Create if not exists for queue, blob container, SentEmail table. 
            sendEmailQueue.CreateIfNotExist();
            tableClient.CreateTableIfNotExist("Message");
            tableClient.CreateTableIfNotExist("MailingList");

            return base.OnStart();
        }

   (You may have seen earlier documentation on working with Windows Azure Storage that shows the initialization code in a loop that checks for transport errors. This is no longer necessary because the API now has a built-in retry mechanism that absorbs transient network failures for up to 3 additional attempts.)
   
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


   	The `OnStop` method is called when the web role is shutting down for one of the following reasons:

	* Windows Azure needs to reboot the virtual machine that hosts you your worker role or the physical machine that hosts the virtual machine.
	* You stopped your cloud service by using the **Stop** button on the Windows Azure Management Portal.
	* You deployed an update to your cloud service project.

    `The `OnStop` method sets the global variable `onStopCalled` to true`, then it sleeps for two minutes in order to give the `Run` method plenty of time to finish any tasks it has started.

        public override void OnStop()
        {
            onStopCalled = true;
            Trace.TraceInformation("OnStop called");
            // Give the Run() method 2 minutes for a graceful exit.
            System.Threading.Thread.Sleep(1000 * 60 * 2);
        }

    The Run method monitors the variable `onStopCalled` and stops pulling any new work items to process when that variable changes to `true`. This coordination between the `OnStop` and `Run` methods enables a gracefull shutdown of the worker process.

	Windows Azure periodically installs operating system updates in order to ensure that the platform is secure, reliable, and performs well. These updates typically require the machines that host your cloud service to shut down and reboot. For more information see the following resources:

	* [Windows Azure Host Updates: Why, When, and How](http://blogs.technet.com/b/markrussinovich/archive/2012/08/22/3515679.aspx "Azure Updates")
	* [Role Instance Restarts Due to OS Upgrades](http://blogs.msdn.com/b/kwill/archive/2012/09/19/role-instance-restarts-due-to-os-upgrades.aspx)

   The `Run` method performs two functions:

   * Scans the Message table looking for messages scheduled to be sent today or earlier, for which queue work items haven't been created yet.

   * Scans the Message table looking for messages that have a status indicating that all of the queue work items were created but not all of the emails have been sent yet. If it finds one, it scans the `Message` table to see if all emails were sent, and if they were, it updates the status to `Completed`.

	The method also checks the global variable `onStopCalled`. When the variable is `true`, the method stops pulling new work items to process, and it returns when already-started tasks are completed.

        public override void Run()
        {
            Trace.TraceInformation("WorkerRoleA entering Run()");

            while (true)
            {
                var tomorrow = DateTime.Today.AddDays(1.0);

                // If OnStop has been called, return to do a graceful shutdown.
                if (onStopCalled == true)
                {
                    Trace.TraceInformation("onStopCalled WorkerRoleB");
                    return;
                }

                // Retrieve all messages that are scheduled for tomorrow or earlier
                // and are in Pending or Queueing status.
                var messagesToProcess =
                    (from e in tableServiceContext.CreateQuery<Message>("Message")
                     where e.RowKey == "Message" && e.ScheduledDate < tomorrow
                       && (e.Status == "Pending" || e.Status == "Queueing")
                     select e);

                // Process each message (queue emails to be sent).
                foreach (Message messageToProcess in messagesToProcess)
                {
                    try
                    {
                        // Set message status to Queueing before beginning, and
                        // set status to Processing when all emails for the message
                        // have been queued.
                        messageToProcess.Status = "Queueing";
                        tableServiceContext.UpdateObject(messageToProcess);
                        tableServiceContext.SaveChangesWithRetries();

                        ProcessMessage(messageToProcess);

                        messageToProcess.Status = "Processing";
                        tableServiceContext.UpdateObject(messageToProcess);
                        tableServiceContext.SaveChangesWithRetries();
                    }
                    catch (Exception ex)
                    {
                        string err = ex.Message;
                        if (ex.InnerException != null)
                        {
                            err += " Inner Exception: " + ex.InnerException.Message;
                        }
                        Trace.TraceError(err);
                        // Don't fill up Trace storage if we have a bug in queue process loop.
                        System.Threading.Thread.Sleep(1000 * 60);
                    }
                }

                // Retrieve all messages that are in Processing status.
                var messagesMarkedProcessing =
                  (from e in tableServiceContext.CreateQuery<Message>("Message")
                   where e.RowKey == "Message" && e.Status == "Processing"
                   select e);

                // For each message that is in Processing status,
                // check if every email has been sent. If all emails have been sent
                // for a message, change its status from "Processing" to "Complete"
                foreach (Message messageToPossiblyChangeStatus in messagesMarkedProcessing)
                {
                    CheckAndUpdateStatusIfComplete(messageToPossiblyChangeStatus);
                }

                // Sleep for one minute to minimize query costs. 
                System.Threading.Thread.Sleep(1000 * 60);
            }
        }

   The first loop processes a query for `Message` rows in the `Message` table that have scheduled date before tomorrow and are in `Pending` or `Queueing` status:

        var messagesToProcess =
            (from e in tableServiceContext.CreateQuery<Message>("Message")
             where e.RowKey == "Message" && e.ScheduledDate < tomorrow
               && (e.Status == "Pending" || e.Status == "Queueing")
             select e);

   If a message is in `Pending` status, processing has not yet begun; if it is in `Queueing` status, processing did begun earlier but was interrupted before all queue messages were created.

   In the loop that processes each message returned by this query, the code sets the `Message` row status to `Queueing`, calls the `ProcessMessage` method to create the queue work items to send emails for the message, then sets the `Message` row status to `Processing`.

            messageToProcess.Status = "Queueing";
            tableServiceContext.UpdateObject(messageToProcess);
            tableServiceContext.SaveChangesWithRetries();

            ProcessMessage(messageToProcess);

            messageToProcess.Status = "Processing";
            tableServiceContext.UpdateObject(messageToProcess);
            tableServiceContext.SaveChangesWithRetries();

   If worker role A aborts while it is creating queue work items for a message, when it starts up again the Message row will be in `Queueing` status, which means it will be picked up by this query again. In that case it will start all over creating queue work items. Some queue work items will then be duplicates of the ones created before the failure happened, but as you will see when you get to worker role B, the `EmailSent` flag in the email address rows of the `Message` table keeps duplicate emails from being sent.

   The second loop processes a query for `Message` rows in the `Message` table that are in `Processing` status.
 
                var messagesMarkedProcessing =
                  (from e in tableServiceContext.CreateQuery<Message>("Message")
                   where e.RowKey == "Message" && e.Status == "Processing"
                   select e);

   In the loop it calls a method that checks if all of the emails for the message were sent, and if they were, it sets the Message row status to `Complete`.

   After completing both loops, the code sleeps for one minute.  

                // Sleep for one minute to minimize query costs.
                System.Threading.Thread.Sleep(1000*60);

   There is a minimal charge for every Windows Azure Storage query, even if it doesn't return any data, so continuously re-scanning would unnecessarily add to your Windows Azure expenses. As this tutorial is being written, the cost is $0.10 per million transactions (a query counts as a transaction), so the sleep time could be made much less than a minute and the cost of scanning the tables for messages to be sent would still be minimal. For information about pricing, see the [Windows Azure pricing calculator][WApricingcalculator] page.

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
                if (subscriber.Verified == false)
                {
                    Trace.TraceInformation("Subscriber " + subscriber.EmailAddress + " Not Verified, so not enqueueing ");
                    continue;
                }

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

                // When we try to add a row, an exception might happen if this worker role went 
                // down after processing some of the email addresses and then restarted.
                // In that case the row might already be present.
                // If the exception happens, we log it and continue in order to create
                // the queue message, because it's possible that a row was created during
                // the first run before the failure but a queue message wasn't.
                // This might result in creating a duplicate queue message, but we nevertheless
                // don't send a duplicate email because worker role B checks the EmailSent
                // property of the SendEmail row before it sends an email.
                try
                {
                    tableServiceContext.AddObject("Message", sendEmailRow);
                    tableServiceContext.SaveChangesWithRetries();
                }
                catch (DataServiceRequestException DSRex)
                {
                    string err = "Error creating SendEmail row:  " + DSRex.Message;
                    if (DSRex.InnerException != null)
                    {
                        err += " Inner Exception: " + DSRex.InnerException;
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

            Trace.TraceInformation("ProcessMessage end PK: "
                + messageToProcess.PartitionKey);
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
                catch (DataServiceRequestException DSRex)
                { 
                    string err = "Error creating SendEmail row:  " + DSRex.Message;
                    if (DSRex.InnerException != null)
                    {
                        err += " Inner Exception: " + DSRex.InnerException;
                    }
                    Trace.TraceError(err);
                }

   The last task to be done for each email address is to create the queue work item that will trigger worker role B to send an email. The queue work item contains the `MessageRef` value and the email address, which are the partition key and row key to the `SendEmail` row in the `Message` table. This row contains all of the information worker role B needs in order to send an email.

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

For links to additional resources for working with Windows Azure Storage tables, queues, and blobs, see the end of [the last tutorial in this series][tut5].

[createsolution]: #cloudproject
[mailinglist]: #mailinglist
[message]: #message
[subscriber]: #subscriber
[webapi]: #webapi
[nextsteps]: #nextsteps

[firsttutorial]: http://windowsazure.com/en-us/develop/net/tutorials/multi-tier-web-site/1-overview/
[tut5]: http://windowsazure.com/en-us/develop/net/tutorials/multi-tier-web-site/5-worker-role-b/
[WApricingcalculator]: http://www.windowsazure.com/en-us/pricing/calculator/?scenario=data-management

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
[mtas-sendMailTbl]: ../Media/mtas-sendMailTbl.png

