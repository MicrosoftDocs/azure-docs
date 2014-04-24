<properties linkid="develop-net-tutorials-multi-tier-web-site-4-worker-role-a" pageTitle="Azure Cloud Service Tutorial: Worker Role with Azure Storage Tables, Queues, and Blobs" metaKeywords="Azure tutorial, Azure storage tutorial, Azure multi-tier tutorial, Azure worker role tutorial, Azure blobs tutorial, Azure tables tutorial, Azure queues tutorial" description="Learn how to create a multi-tier app using ASP.NET MVC and Azure. The app runs in a cloud service, with web role and worker roles, and uses Azure storage tables, queues, and blobs." metaCanonical="" services="cloud-services,storage" documentationCenter=".NET" title="Azure Cloud Service Tutorial: ASP.NET MVC Web Role, Worker Role, Azure Storage Tables, Queues, and Blobs" authors="tdykstra,riande" solutions="" manager="wpickett" editor="mollybos" />

# Building worker role A (email scheduler) for the Azure Email Service application - 4 of 5. 

This is the fourth tutorial in a series of five that show how to build and deploy the Azure Email Service sample application.  For information about the application and the tutorial series, see the [first tutorial in the series][firsttutorial].

In this tutorial you'll learn:

* How to query and update Azure Storage tables.
* How to add work items to a queue for processing by another worker role.
* How to handle planned shut-downs by overriding the `OnStop` method.
* How to handle unplanned shut-downs by making sure that no emails are missed and no duplicate emails are sent.
* How to test a worker role that uses Azure Storage tables, by using Azure Storage Explorer.
 
You already created the worker role A project when you created the cloud service project. So all you have to do now is program the worker role and configure it to use your Azure Storage account.

## Segments of this tutorial

- [Add a reference to the web project](#addref)
- [Add a reference to an SCL 1.7 assembly](#addref2)
- [Add the SendEmail model](#addmodel)
- [Add code that runs when the worker role starts](#addcode)
- [Configure the storage connection string](#configure)
- [Test worker role A](#testing)
- [Next steps](#nextsteps)



<h2><a name="addref"></a><span class="short-header">Add project reference</span>Add a reference to the web project</h2>

You need a reference to the web project because that is where the entity classes are defined. You'll use the same entity classes in worker role B to read and write data in the Azure tables that the application uses.

**Note:** In a production application you wouldn't set a reference to a web project from a worker role project, because this results in referencing a number of dependent assemblies that you don't want or need in the worker role. Normally you would keep shared model classes in a class library project, and both web and worker role projects would reference the class library project. To keep the solution structure simple, model classes are stored in the web project for this tutorial.

4. Right-click the WorkerRoleA project, and choose **Add Reference**.

	![Add reference in WorkerRoleA project][mtas-worker-a-add-reference-menu]

4. In **Reference Manager**, add a reference to the MvcWebRole project (or to the web application project if you are running the web UI in an Azure Web Site), then click **OK**.

	![Add reference to MvcWebRole][mtas-worker-a-reference-manager]




<h2><a name="addref2"></a><span class="short-header">Add SCL 1.7 reference</span>Add a reference to an SCL 1.7 assembly</h2>

>[WACOM.NOTE] Skip this step if you have installed SDK 2.3 or later.

Version 2.0 of the Storage Client Library (SCL) 2.0 does not have everything needed for diagnostics, so you have to add a reference to one of the 1.7 assemblies. You already did this if you followed the steps in the previous tutorial, but the instructions are included here in case you missed that step.

4. Right-click the WorkerRoleA project, and choose **Add Reference**.

5. Click the **Browse...** button at the bottom of the dialog box.

6. Navigate to the following folder:

        C:\Program Files\Microsoft SDKs\Windows Azure\.NET SDK\2012-10\ref

7. Select *Microsoft.WindowsAzure.StorageClient.dll*, and then click **Add**.

8. In the **Reference Manager** dialog box, click **OK**.




<h2><a name="addmodel"></a><span class="short-header">Add SendEmail model</span>Add the SendEmail model</h2>

Worker role A creates the `SendEmail` rows in the `Message` table, and worker Role B reads those rows in order to get the information it needs for sending emails. The following image shows a subset of properties for two `Message` rows and three `SendEmail` rows in the `Message` table.

![message table with sendmail][mtas-sendMailTbl]

These rows in the `Message` table serve several purposes:

* They provide all of the information that worker role B needs in order to send a single email.
* They track whether an email has been sent, in order to prevent duplicates from being sent in case a worker role restarts after a failure.
* They make it possible for worker role A to determine when all emails for a message have been sent, so that it can be marked as `Complete`.

For reading and writing the `SendEmail` rows, a model class is required.  Since it must be accessible to both worker role A and worker role B, and since all of the other model classes are defined in the web project, it makes sense to define this one in the web project also. 

1. In **Solution Explorer**, right-click the Models folder in the web project and choose **Add Existing Item**.

	![Add existing item to Models folder in web project][mtas-add-existing-for-sendemail-model]

3. Navigate to the folder where you downloaded the sample application, select the *SendEmail.cs* file in the web project Models folder, and click Add.

4. Open *SendEmail.cs* and examine the code.

		public class SendEmail : TableEntity
	    {
	        public long MessageRef { get; set; }
	        public string EmailAddress { get; set; }
	        public DateTime? ScheduledDate { get; set; }
	        public String FromEmailAddress { get; set; }
	        public string SubjectLine { get; set; }
	        public bool? EmailSent { get; set; }
	        public string SubscriberGUID { get; set; }
	        public string ListName { get; set; }
	    }
	
	The code here is similar to the other model classes, except that no DataAnnotations attributes are included because there is no UI associated with this model -- it is not used in an MVC controller. 

<h2><a name="addcode"></a><span class="short-header">Add worker role code</span>Add code that runs when the worker role starts</h2>

4. In the WorkerRoleA project, open *WorkerRole.cs* and examine the code.
	
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

5. Delete *WorkerRole.cs*, then right-click the WorkerRoleA project, and choose **Add Existing Item**.

	![Add existing item to Worker Role A][mtas-worker-a-add-existing]

2. Navigate to the folder where you downloaded the sample application, select the *WorkerRoleA.cs* file in the WorkerRoleA project, and click **Add**.

3. Open *WorkerRoleA.cs* and examine the code.

	The `OnStart` method initializes the context objects that you need in order to work with Azure Storage entities. It also makes sure that all of the tables, queues, and blob containers that you'll be using in the `Run` method exist. The code that performs these tasks is similar to what you saw earlier in the MVC controller constructors. You'll configure the connection string that this method uses later.

   
        public override bool OnStart()
        {
            ServicePointManager.DefaultConnectionLimit = Environment.ProcessorCount;

            ConfigureDiagnostics();
            Trace.TraceInformation("Initializing storage account in WorkerA");
            var storageAccount = CloudStorageAccount.Parse(RoleEnvironment.GetConfigurationSettingValue("StorageConnectionString"));

            CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient(); 
            sendEmailQueue = queueClient.GetQueueReference("azuremailqueue"); 
            var tableClient = storageAccount.CreateCloudTableClient(); 
            mailingListTable = tableClient.GetTableReference("mailinglist"); 
            messageTable = tableClient.GetTableReference("message"); 
            messagearchiveTable = tableClient.GetTableReference("messagearchive"); 

            // Create if not exists for queue, blob container, SentEmail table. 
            sendEmailQueue.CreateIfNotExists(); 
            messageTable.CreateIfNotExists(); 
            mailingListTable.CreateIfNotExists(); 
            messagearchiveTable.CreateIfNotExists(); 

            return base.OnStart();
        }

	You may have seen earlier documentation on working with Azure Storage that shows the initialization code in a loop that checks for transport errors. This is no longer necessary because the API now has a built-in retry mechanism that absorbs transient network failures for up to 3 additional attempts.
   
	The `ConfigureDiagnostics` method that the `OnStart` method calls sets up tracing so that you will be able to see the output from `Trace.Information` and `Trace.Error` methods.  This method is explained in [the second tutorial][tut2].

	The `OnStop` method sets the global variable `onStopCalled` to true, then it waits for the `Run` method to set the global variable `returnedFromRunMethod` to true, which signals it is ready to do a clean shutdown. 


        public override void OnStop()
        {
            onStopCalled = true;
            while (returnedFromRunMethod == false)
            {
                System.Threading.Thread.Sleep(1000);
            }
        }

	The `OnStop` method is called when the worker role is shutting down for one of the following reasons:

	* Azure needs to reboot the virtual machine (the web role or worker role instance) or the physical machine that hosts the virtual machine.
	* You stopped your cloud service by using the **Stop** button on the Azure Management Portal.
	* You deployed an update to your cloud service project.

	The `Run` method monitors the variable `onStopCalled` and stops pulling any new work items to process when that variable changes to `true`. This coordination between the `OnStop` and `Run` methods enables a graceful shutdown of the worker process.

	Azure periodically installs operating system updates in order to ensure that the platform is secure, reliable, and performs well. These updates typically require the machines that host your cloud service to shut down and reboot. For more information, see [Role Instance Restarts Due to OS Upgrades](http://blogs.msdn.com/b/kwill/archive/2012/09/19/role-instance-restarts-due-to-os-upgrades.aspx).

	The `Run` method performs two functions:

	* Scans the `message` table looking for messages scheduled to be sent today or earlier, for which queue work items haven't been created yet.

	* Scans the `message` table looking for messages that have a status indicating that all of the queue work items were created but not all of the emails have been sent yet. If it finds one, it scans `SendEmail` rows for that message to see if all emails were sent, and if they were, it updates the status to `Completed` and archives the `message` row.

	The method also checks the global variable `onStopCalled`. When the variable is `true`, the method stops pulling new work items to process, and it returns when already-started tasks are completed.

   
        public override void Run()
        {
            Trace.TraceInformation("WorkerRoleA entering Run()");
            while (true)
            {
                try
                {
                    var tomorrow = DateTime.Today.AddDays(1.0).ToString("yyyy-MM-dd");
                    // If OnStop has been called, return to do a graceful shutdown.
                    if (onStopCalled == true)
                    {
                        Trace.TraceInformation("onStopCalled WorkerRoleB");
                        returnedFromRunMethod = true;
                        return;
                    }
                    // Retrieve all messages that are scheduled for tomorrow or earlier
                    // and are in Pending or Queuing status.
                    string typeAndDateFilter = TableQuery.CombineFilters(
                        TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.GreaterThan, "message"),
                        TableOperators.And,
                        TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.LessThan, tomorrow));
                    var query = (new TableQuery<Message>().Where(typeAndDateFilter));
                    var messagesToProcess = messageTable.ExecuteQuery(query).ToList();
                    TableOperation replaceOperation;
                    // Process each message (queue emails to be sent).
                    foreach (Message messageToProcess in messagesToProcess)
                    {
                        string restartFlag = "0";
                        // If the message is already in Queuing status,
                        // set flag to indicate this is a restart.
                        if (messageToProcess.Status == "Queuing")
                        {
                            restartFlag = "1";
                        }

                        // If the message is in Pending status, change
                        // it to Queuing.
                        if (messageToProcess.Status == "Pending")
                        {
                            messageToProcess.Status = "Queuing";
                            replaceOperation = TableOperation.Replace(messageToProcess);
                            messageTable.Execute(replaceOperation);
                        }

                        // If the message is in Queuing status, 
                        // process it and change it to Processing status;
                        // otherwise it's already in processing status, and 
                        // in that case check if processing is complete.
                        if (messageToProcess.Status == "Queuing")
                        {
                            ProcessMessage(messageToProcess, restartFlag);

                            messageToProcess.Status = "Processing";
                            replaceOperation = TableOperation.Replace(messageToProcess);
                            messageTable.Execute(replaceOperation);
                        }
                        else
                        {
                            CheckAndArchiveIfComplete(messageToProcess);
                        }
                    }

                    // Sleep for one minute to minimize query costs. 
                    System.Threading.Thread.Sleep(1000 * 60);
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
        }


	Notice that all of the work is done in an infinite loop in a `while` block, and all of the code in the `while` block is wrapped in a `try`-`catch` block to prevent an unhandled exception. If an unhandled exception occurs, Azure will raise the [UnhandledException](http://msdn.microsoft.com/en-us/library/system.appdomain.unhandledexception.aspx) event, the worker process is terminated, and the role is taken offline. The worker role will be restarted by Azure, but this takes several minutes. The `try` block calls `TraceError` to record the error and then sleeps for 60 seconds so that if the error is persistent the error message won't be repeated too many times.  In a production application you might send an email to an administrator in the `try` block.

	The `Run` method processes a query for `message` rows in the `message` table that have scheduled date before tomorrow:

                    // Retrieve all messages that are scheduled for tomorrow or earlier
                    // and are in Pending or Queuing status.
                    string typeAndDateFilter = TableQuery.CombineFilters(
                        TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.GreaterThan, "message"),
                        TableOperators.And,
                        TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.LessThan, tomorrow));
                    var query = (new TableQuery<Message>().Where(typeAndDateFilter));
                    var messagesToProcess = messageTable.ExecuteQuery(query).ToList();

	**Note:** One of the benefits of moving message rows to the `messagearchive` table after they are processed is that this query only needs to specify `PartitionKey` and `RowKey` as search criteria. If we did not archive processed rows, the query would also have to specify a non-key field (`Status`) and would have to search through more rows.  The table size would increases, and the query would take longer and could start getting continuation tokens.

	If a message is in `Pending` status, processing has not yet begun; if it is in `Queuing` status, processing did begin earlier but was interrupted before all queue messages were created. In that case an additional check has to be done in worker role B when it is sending each email to make sure the email hasn't already been sent. That is the purpose of the `restartFlag` variable.

                        string restartFlag = "0";
                        if (messageToProcess.Status == "Queuing")
                        {
                            restartFlag = "1";
                        }

	Next, the code sets `message` rows that are in `Pending` status to `Queuing`.  Then, for those rows plus any that were already in `Queuing` status, it calls the `ProcessMessage` method to create the queue work items to send emails for the message. 

                        if (messageToProcess.Status == "Pending")
                        {
                            messageToProcess.Status = "Queuing";
                            replaceOperation = TableOperation.Replace(messageToProcess);
                            messageTable.Execute(replaceOperation);
                        }

                        if (messageToProcess.Status == "Queuing")
                        {
                            ProcessMessage(messageToProcess, restartFlag);

                            messageToProcess.Status = "Processing";
                            replaceOperation = TableOperation.Replace(messageToProcess);
                            messageTable.Execute(replaceOperation);
                        }
                        else
                        {
                            CheckAndArchiveIfComplete(messageToProcess);
                        }


	After processing a message in `Queuing` status the code sets the `Message` row status to `Processing`. Rows in the `message` table that are not in `Pending` or `Queuing` status are already in `Processing` status, and for those rows the code calls a method that checks if all of the emails for the message were sent.  If all emails have been sent, the `message` row is archived.

	After processing all records retrieved by the query, the code sleeps for one minute.  

                // Sleep for one minute to minimize query costs.
                System.Threading.Thread.Sleep(1000*60);

	There is a minimal charge for every Azure Storage query, even if it doesn't return any data, so continuously re-scanning would unnecessarily add to your Azure expenses. As this tutorial is being written, the cost is $0.10 per million transactions (a query counts as a transaction), so the sleep time could be made much less than a minute and the cost of scanning the tables for messages to be sent would still be minimal. For more information about pricing, see the [first tutorial][firsttutorial].

	**Note on threading and optimal CPU utilization:** There are two tasks in the `Run` method (queuing emails and checking for completed messages), and they run sequentially in a single thread. A small virtual machine (VM) has 1.75 GB RAM and only one CPU, so it's probably OK to run these tasks sequentially with a single thread. Suppose your application needed more memory than the small VM  provided to run efficiently. A medium VM provides 3.5 GB RAM and 2 CPU's, but this application would only use one CPU, because it's single threaded. To take advantage of all the CPUs, you would need to create a worker thread for each CPU. Even so, a single CPU is not fully utilized by one thread. When a thread  makes network or I/O calls, the thread must wait for the I/O or network call to complete, and while it waits, it's not doing useful work. If the `Run` method was implemented using two threads, when one thread was waiting for a network or I/O operation to complete, the other thread could be doing useful work.

	The `ProcessMessage` method gets all of the email addresses for the destination email list, and creates a queue work item for each email address. As it creates queue work items, it also creates `SendEmail` rows in the `Message` table. These rows provide worker role B with the information it needs to send emails and includes an `EmailSent` property that tracks whether each email has been sent.
	
        private void ProcessMessage(Message messageToProcess, string restartFlag)
        {
            // Get Mailing List info to get the "From" email address.
            var retrieveOperation = TableOperation.Retrieve<MailingList>(messageToProcess.ListName, "mailinglist");
            var retrievedResult = mailingListTable.Execute(retrieveOperation);
            var mailingList = retrievedResult.Result as MailingList;
            if (mailingList == null)
            {
                Trace.TraceError("Mailing list not found: " + messageToProcess.ListName + " for message: " + messageToProcess.MessageRef);
                return;
            }
            // Get email addresses for this Mailing List.
            string filter = TableQuery.CombineFilters(
               TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, messageToProcess.ListName),
               TableOperators.And,
               TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.NotEqual, "mailinglist"));
            var query = new TableQuery<Subscriber>().Where(filter);
            var subscribers = mailingListTable.ExecuteQuery(query).ToList();

            foreach (Subscriber subscriber in subscribers)
            {
                // Verify that the subscriber email address has been verified.
                if (subscriber.Verified == false)
                {
                    Trace.TraceInformation("Subscriber " + subscriber.EmailAddress + " not Verified, so not queuing ");
                    continue;
                }

                // Create a SendEmail entity for this email.              
                var sendEmailRow = new SendEmail
                {
                    PartitionKey = messageToProcess.PartitionKey,
                    RowKey = messageToProcess.MessageRef.ToString() + subscriber.EmailAddress,
                    EmailAddress = subscriber.EmailAddress,
                    EmailSent = false,
                    MessageRef = messageToProcess.MessageRef,
                    ScheduledDate = messageToProcess.ScheduledDate,
                    FromEmailAddress = mailingList.FromEmailAddress,
                    SubjectLine = messageToProcess.SubjectLine,
                    SubscriberGUID = subscriber.SubscriberGUID,
                    ListName = mailingList.ListName
                };

                // When we try to add the entity to the SendEmail table, 
                // an exception might happen if this worker role went 
                // down after processing some of the email addresses and then restarted.
                // In that case the row might already be present, so we do an Upsert operation.
                try
                {
                    var upsertOperation = TableOperation.InsertOrReplace(sendEmailRow);
                    messageTable.Execute(upsertOperation);
                }
                catch (Exception ex)
                {
                    string err = "Error creating SendEmail row:  " + ex.Message;
                    if (ex.InnerException != null)
                    {
                        err += " Inner Exception: " + ex.InnerException;
                    }
                    Trace.TraceError(err);
                }

                // Create the queue message.
                string queueMessageString =
                    sendEmailRow.PartitionKey + "," +
                    sendEmailRow.RowKey + "," +
                    restartFlag;
                var queueMessage = new CloudQueueMessage(queueMessageString);
                sendEmailQueue.AddMessage(queueMessage);
            }

            Trace.TraceInformation("ProcessMessage end PK: "
                + messageToProcess.PartitionKey);
        }

	The code first gets the mailing list row from the `mailinglist` table for the destination mailing list.  This row has the "from" email address which needs to be provided to worker role B for sending emails.

            // Get Mailing List info to get the "From" email address.
            var retrieveOperation = TableOperation.Retrieve<MailingList>(messageToProcess.ListName, "mailinglist");
            var retrievedResult = mailingListTable.Execute(retrieveOperation);
            var mailingList = retrievedResult.Result as MailingList;
            if (mailingList == null)
            {
                Trace.TraceError("Mailing list not found: " + messageToProcess.ListName + " for message: " + messageToProcess.MessageRef);
                return;
            }

	Then it queries the `mailinglist` table for all of the subscriber rows for the destination mailing list.

            // Get email addresses for this Mailing List.
            string filter = TableQuery.CombineFilters(
               TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, messageToProcess.ListName),
               TableOperators.And,
               TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.NotEqual, "mailinglist"));
            var query = new TableQuery<Subscriber>().Where(filter);
            var subscribers = mailingListTable.ExecuteQuery(query).ToList();

	In the loop that processes the query results, the code begins by checking if subscriber email address is verified, and if not no email is queued.

                // Verify that the subscriber email address has been verified.
                if (subscriber.Verified == false)
                {
                    Trace.TraceInformation("Subscriber " + subscriber.EmailAddress + " not Verified, so not queuing ");
                    continue;
                }

	Next, the code creates a `SendEmail` row in the `message` table. This row contains the information that worker role B will use to send an email. The row is created with the `EmailSent` property set to `false`.

                // Create a SendEmail entity for this email.              
                var sendEmailRow = new SendEmail
                {
                    PartitionKey = messageToProcess.PartitionKey,
                    RowKey = messageToProcess.MessageRef.ToString() + subscriber.EmailAddress,
                    EmailAddress = subscriber.EmailAddress,
                    EmailSent = false,
                    MessageRef = messageToProcess.MessageRef,
                    ScheduledDate = messageToProcess.ScheduledDate,
                    FromEmailAddress = mailingList.FromEmailAddress,
                    SubjectLine = messageToProcess.SubjectLine,
                    SubscriberGUID = subscriber.SubscriberGUID,
                    ListName = mailingList.ListName
                };
                try
                {
                    var upsertOperation = TableOperation.InsertOrReplace(sendEmailRow);
                    messageTable.Execute(upsertOperation);
                }
                catch (Exception ex)
                {
                    string err = "Error creating SendEmail row:  " + ex.Message;
                    if (ex.InnerException != null)
                    {
                        err += " Inner Exception: " + ex.InnerException;
                    }
                    Trace.TraceError(err);
                }

	The code uses an "upsert" operation because the row might already exist if worker role A is restarting after a failure.

	The last task to be done for each email address is to create the queue work item that will trigger worker role B to send an email. The queue work item contains the partition key and row key value of the `SendEmail` row that was just created, plus the restart flag that was set earlier. The `SendEmail` row contains all of the information that worker role B needs in order to send an email.

                // Create the queue message.
                string queueMessageString =
                    sendEmailRow.PartitionKey + "," +
                    sendEmailRow.RowKey + "," +
                    restartFlag;
                var queueMessage = new CloudQueueMessage(queueMessageString);
                sendEmailQueue.AddMessage(queueMessage);

	The `CheckAndUpdateStatusIfComplete` method checks messages that are in Processing status to see if all emails have been sent. If it finds no unsent emails, it updates the row status to `Completed` and archives the row. 

        private void CheckAndArchiveIfComplete(Message messageToCheck)
        {
            // Get the list of emails to be sent for this message: all SendEmail rows
            // for this message.  
            string pkrkFilter = TableQuery.CombineFilters(
                TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, messageToCheck.PartitionKey),
                TableOperators.And,
                TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.LessThan, "message"));
            var query = new TableQuery<SendEmail>().Where(pkrkFilter);
            var emailToBeSent = messageTable.ExecuteQuery(query).FirstOrDefault();

            if (emailToBeSent != null)
            {
                return;
            }

            // All emails have been sent; copy the message row to the archive table.

            // Insert the message row in the messagearchive table
            var messageToDelete = new Message { PartitionKey = messageToCheck.PartitionKey, RowKey = messageToCheck.RowKey, ETag = "*" };
            messageToCheck.Status = "Complete";
            var insertOrReplaceOperation = TableOperation.InsertOrReplace(messageToCheck);
            messagearchiveTable.Execute(insertOrReplaceOperation);

            // Delete the message row from the message table.
            var deleteOperation = TableOperation.Delete(messageToDelete);
            messageTable.Execute(deleteOperation);
        }





<h2><a name="configure"></a><span class="short-header">Configure storage</span>Configure the storage connection string</h2>

If you didn't already configure the storage account credentials for worker role A when you did that for the web role, do it now. 

1. In Solution Explorer, right-click **WorkerRoleA** under **Roles** in the **AzureEmailService** cloud project, and then choose **Properties**.

2. Make sure that **All Configurations** is selected in the **Service Configuration** drop-down list.

2. Select the **Settings** tab and then click **Add Setting**.

3. Enter *StorageConnectionString* in the **Name** column.

4. Select **Connection String** in the **Type** drop-down list.  
  
5. Click the ellipsis (**...**) at the right end of the line to create a new connection string.

6. In the **Storage Account Connection String** dialog box, click **Your subscription**.

7. Choose the correct **Subscription** and **Account name**, and then click **OK**.

8. Set the diagnostics connection string. You can use the same storage account for the diagnostics connection string, but a best practice is to use a different storage account for trace (diagnostics) information.




<h2><a name="testing"></a><span class="short-header">Testing</span>Testing worker role A</h2>

1. Run the application by pressing F5.

>[WACOM.NOTE] With Visual Studio 2013 and the latest SDK, you might get an "ambiguous reference" error for the reference to `LogLevel`. Right-click `LogLevel`, click Resolve, and select `Microsoft.WindowsAzure.Diagnostics.LogLevel`.

2. Use the administrator web pages to create a mailing list and create subscribers to the mailing list. Set the `Verified` property to `true` for at least one of the subscribers, and set the email address to an address that you can receive mail at.

	No emails will be sent until you implement worker role B, but you'll use the same test data for testing worker role B.

3. Create a message to be sent to the mailing list you created, and set the scheduled date to today or a date in the past.

	![New message in pending status][mtas-worker-a-test-pending]

4. In a little over a minute (because of the one minute sleep time in the Run method), refresh the Messages web page and you see the status change to Processing. (You might see it change to Queuing first, but chances are it will go from Queuing to Processing so quickly that you won't see Queuing.)

	![New message in processing status][mtas-worker-a-test-processing]

5. Open Azure Storage Explorer and select your test storage account.

6. In Azure Storage Explorer, under **Storage Type** select **Queues** and then select **azuremailqueue**.

	You see one queue message for each verified subscriber in your destination email list.

	![Queue message in ASE][mtas-worker-a-tst-ase-queue]

7. Double-click a queue message, and then in the **Message Detail** dialog box select the **Message** tab.

	You see the contents of the queue message: the partition key (date of 2012-12-14), the row key (the MessageRef value and the email address), and the restart flag, delimited by a comma.

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

For links to additional resources for working with Azure Storage tables, queues, and blobs, see the end of [the last tutorial in this series][tut5].

<div><a href="/en-us/develop/net/tutorials/multi-tier-web-site/5-worker-role-b/" class="site-arrowboxcta download-cta">Tutorial 5</a></div>








[firsttutorial]: /en-us/develop/net/tutorials/multi-tier-web-site/1-overview/
[tut5]: /en-us/develop/net/tutorials/multi-tier-web-site/5-worker-role-b/
[tut2]: /en-us/develop/net/tutorials/multi-tier-web-site/2-download-and-run/




[mtas-worker-a-add-existing]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-worker-role-a/mtas-worker-a-add-existing.png
[mtas-worker-a-add-reference-menu]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-worker-role-a/mtas-worker-a-add-reference-menu.png
[mtas-worker-a-reference-manager]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-worker-role-a/mtas-worker-a-reference-manager.png
[mtas-add-existing-for-sendemail-model]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-worker-role-a/mtas-add-existing-for-sendemail-model.png
[mtas-worker-a-test-processing]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-worker-role-a/mtas-worker-a-test-processing.png
[mtas-worker-a-test-pending]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-worker-role-a/mtas-worker-a-test-pending.png
[mtas-worker-a-tst-ase-queue]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-worker-role-a/mtas-worker-a-test-ase-queue.png
[mtas-worker-a-tst-ase-queue-detail]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-worker-role-a/mtas-worker-a-test-ase-queue-detail.png
[mtas-worker-a-test-ase-message-table]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-worker-role-a/mtas-worker-a-test-ase-message-table.png
[mtas-worker-a-test-ase-sendemail-row]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-worker-role-a/mtas-worker-a-test-ase-sendemail-row.png
[mtas-sendMailTbl]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-worker-role-a/mtas-sendMailTbl.png
