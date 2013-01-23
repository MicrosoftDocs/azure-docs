<properties linkid="develop-net-tutorials-multi-tier-web-site-1-overview" urlDisplayName="Step 1: Overview" pageTitle="Multi-tier ASP.NET MVC 4 Web Site Tutorial - Step 1: Overview" metaKeywords="Windows Azure tutorial, email list service app, email service architecture, Azure tutorial overview" metaDescription="Learn about the five part multi-tier web site tutorial." metaCanonical="" disqusComments="1" umbracoNaviHide="1" />


<div chunk="../chunks/article-left-menu.md" />
# .NET Multi-Tier Application Using Storage Tables, Queues, and Blobs

This tutorial series shows how to create a multi-tier ASP.NET web application that uses Windows Azure Storage tables, queues, and blobs. The tutorials assume that you have no prior experience using Windows Azure. On completing the series, you'll know how to build a resilient and scalable data-driven web application and deploy it to the cloud.

The series includes the following tutorials:

1. **Introduction to the Windows Azure Email Service application** (this tutorial). An overview of the application and its architecture. You can skip to tutorial 2 if you don't want all the background and just want to get started.
2. [Configuring and Deploying the Windows Azure Email Service application][tut2]. How to download the sample application, configure it, test it locally, deploy it, and test it in the cloud. If you prefer to start by seeing how to build the solution from scratch, you can skip most of tutorial 2 and return to do the rest after you finish tutorials 3-5. The tutorial explains what you have to do and what you can skip. 
3. [Building the web role for the Windows Azure Email Service application][tut3]. How to build the MVC 4 and Web API components of the application and test them locally. (Includes instructions for running the web UI in a Windows Azure Web Site if you prefer to do that instead of using a Windows Azure Cloud Service web role.)
4. [Building worker role A (email scheduler) for the Windows Azure Email Service application][tut4]. How to build the back-end component that creates queue work items for sending emails, and test it locally.
5. [Building worker role B (email sender) for the Windows Azure Email Service application][tut5]. How to build the back-end component that processes queue work items for sending emails, and test it locally.

<h2><a name="whatyoulllearn"></a><span class="short-header">What You'll Learn</span>What You'll Learn</h2>

In this tutorial series you'll learn the following:

* How to enable your machine for Windows Azure development by installing the Windows Azure SDK.
* How to create a Visual Studio cloud project with an MVC 4 web role and two worker roles.
* How to publish the cloud project to a Windows Azure Cloud Service.
* How to publish the MVC 4 project to a Windows Azure Web Site if you prefer, and still use the worker roles in a Cloud Service.
* How to use the Windows Azure Queue storage service for communication between tiers or between worker roles.
* How to use the Windows Azure Table storage service as a highly scalable data store for non-relational data.
* How to use the Windows Azure Blob service to store files in the cloud.
* How to use Azure Storage Explorer to work with tables, queues, and blobs.
* How to use SendGrid to send emails.




<h2><a name="frontendoverview"></a><span class="short-header">Front-end overview</span>Front-end overview</h2>

The front-end of the multi-tier application that you'll build and deploy includes web pages that administrators of the service use to manage email lists.

![Mailing List Index Page][mtas-mailing-list-index-page]

![Subscriber Index Page][mtas-subscribers-index-page]

There is also a set of pages that administrators use to create messages to be sent to an email list.

![Message Index Page][mtas-message-index-page]

![Message Create Page][mtas-message-create-page]

Clients of the service are companies that give their customers an opportunity to sign up for a list on the client web site. For example, an administrator sets up a list for Contoso University History Department announcements. When a student interested in History Department announcements clicks a link on the Contoso University web site, Contoso University makes a web service call to the Windows Azure Email Service application. The service method causes an email to be sent to the customer. That email contains a hyperlink, and when the recipient clicks the link, a page welcoming the customer to the History Department Announcements list is displayed.

![Confirmation email][mtas-subscribe-email]

![Welcome to list page][mtas-subscribe-confirmation-page]

Every email sent by the service (except the subscribe confirmation) includes a hyperlink that can be used to unsubscribe. If a recipient clicks the link, a web page asks for confirmation of intent to unsubscribe. 

![Confirm unsubscribe page][mtas-unsubscribe-query-page]

If the recipient clicks the Confirm button, a page is displayed confirming that the person has been removed from the list.

![Unsubscribe confirmed page][mtas-unsubscribe-confirmation-page]




<h2><a name="whyanemaillistapp"></a><span class="short-header">Why This App</span>Why an Email List Service Application</h2>

We chose an email list service for this sample application because it is the kind of application that needs to be resilient and scalable, two features that make it especially appropriate for Windows Azure. 

### Resilient 

If a server fails while sending out emails to a large list, you want to be able to spin up a new server easily and quickly, and you want the application to pick up where it left off without losing or duplicating any emails. A Windows Azure Cloud Service web or worker role instance (a virtual machine) is automatically replaced if it fails. And Windows Azure Storage queues and tables provide a means to implement server-to-server communication that can survive a failure without losing work.

### Scalable

An email service also must be able to handle spikes in workload, since sometimes you are sending emails to small lists and sometimes to very large lists.  In many hosting environments, you have to purchase and maintain sufficient hardware to handle the spikes in workload, and you're paying for all that capacity 100% of the time although you might only use it 5% of the time.  With Windows Azure, you pay only for the amount of computing power that you actually need for only as long as you need it.  To scale up for a large mailing, you just change a configuration setting to increase the number of servers you have available to process the workload, and this can be done programmatically.  For example, you could configure the application so that if the number of work items waiting in the queue exceeds a certain number, additional instances of worker role B are automatically spun up.




<h2><a name="backendoverview"></a><span class="short-header">Back-end overview</span>Back-end overview</h2>

The front-end stores email lists and messages to be sent to them in Windows Azure tables. When an administrator schedules a message to be sent, a table row containing the scheduled date and other data such as the subject line is added to the Message table. A worker role periodically scans the Message table looking for messages that need to be sent (we'll call this worker role A). 

When worker role A finds a message needing to be sent, it does the following tasks:

* Gets all the email addresses in the destination email list.
* Puts the information needed to send each email in the Message table.
* Creates a queue work item for each email that needs to be sent. 

A second worker role (worker role B) polls the queue for work items. When worker role B finds a work item, it processes the item by sending the email and then deletes the work item from the queue. The following diagram shows these relationships.

![Email message processing][mtas-worker-roles-a-and-b]

No emails are missed if worker role B goes down and has to be restarted, because a queue work item for an email isn't deleted until after the email has been sent. The back-end also implements table processing that prevents multiple emails from getting sent in case worker role A goes down and has to be restarted. In that case, multiple queue work items might be generated for a given destination email address. But for each destination email address, a row in the Message table tracks whether the email has been sent. Worker role B updates this row whenever it sends an email. If it gets a second queue work item for the same destination email address, it sees the already sent flag and deletes the work item without re-sending the email.

![Preventing duplicate emails][mtas-message-processing]

Worker role B also polls a subscription queue for work items put there by the Web API service method for new subscriptions. When it finds one, it sends the confirmation email. 

![Subscription queue message processing][mtas-subscribe-diagram]





<h2><a name="tables"></a><span class="short-header">Tables</span>Windows Azure Tables</h2>

The Windows Azure Email Service application stores data in Windows Azure Storage tables. Windows Azure tables are a NoSQL data store, not a relational database. That makes them a good choice when efficiency and scalability are more important than data normalization and relational integrity. For example, in this application, one worker role creates a row every time a queue work item is created, and another one retrieves and updates a row every time an email is sent, which might become a performance bottleneck if a relational database were used.

In a Windows Azure table, every row has a *partition key* and a *row key* that uniquely identifies the row. The partition key divides the table up logically into partitions. Within a partition, the row key uniquely identifies a row.

### MailingList table ###

The `MailingList` table stores information about mailing lists and the subscribers to mailing lists. Administrators use web pages to create and edit mailing lists, and clients and subscribers use a set of web pages and service method to subscribe and unsubscribe.

In NoSQL tables, different rows can have different schemas, and this flexibility is commonly used to make one table store data that would require multiple tables in a relational database. For example, to store mailing list data in SQL Database you could use three tables: a `MailingList` table that stores information about the list, a `Subscriber` table that stores information about subscribers, and a `MailingListSubscriber` table that associates mailing lists with subscribers and vice versa. In the NoSQL table in this application, all of those functions are rolled into one table named `MailingList`. 

The row key for the `MailingList` table can be one of two things:  the constant "MailingList" or the email address of the subscriber. Rows that have row key "MailingList" include information about the mailing list. Rows that have the email address as the row key have information about the subscribers to the list.

In other words, rows with row key "MailingList" are equivalent to a `MailingList` table in a relational database. Rows with row key = email address are equivalent to a `Subscriber` table and a `MailingListSubscriber` association table in a relational database.

Making one table serve multiple purposes in this way facilitates better performance. In a relational database three tables would have to be read, and three sets of rows would have to be sorted and matched up against each other, which takes time. Here just one table is read and its rows are automatically returned in partition key and row key order.

The following grid shows row properties for the rows that contain mailing list information (row key = "MailingList").

<table border="1">

<tr bgcolor="lightgray">
<th>Property</th>
<th>Data Type</th>
<th>Description</th>
</tr>

<tr>
<td>PartitionKey</td>
<td>String</td>
<td>ListName:  A unique identifier for the mailing list, for example: contoso1. The typical use for the table is to retrieve all information for a specific mailing list, so using the list name is an efficient way to partition the table.</td>
</tr>

<tr>
<td>RowKey</td>
<td>String</td>
<td>The constant "MailingList".</td>
</tr>

<tr>
<td>Description</td>
<td>String</td>
<td>Description of the mailing List, for example: "Contoso University History Department announcements".</td>
</tr>

<tr>
<td>FromEmailAddress</td>
<td>String</td>
<td>The "From" email address in the emails sent to this list, for example: donotreply@contoso.edu.</td>
</tr>

</table>

The following grid shows row properties for the rows that contain subscriber information for the list (row key = email address).

<table border="1">

<tr bgcolor="lightgray">
<th>Property</th>
<th>Data Type</th>
<th>Description</th>
</tr>

<tr>
<td>`PartitionKey`</td>
<td>String</td>
<td>ListName:  The name (unique identifier) of the mailing list, for example: contoso1.</td>
</tr>

<tr>
<td>`RowKey`</td>
<td>String</td>
<td>EmailAddress:  The subscriber email address, for example: student1@contoso.edu.</td>
</tr>

<tr>
<td>`SubscriberGUID`</td>
<td>String</td>
<td>Generated when the email address is added to a list, used in subscribe and unsubscribe links so that it's difficult to subscribe or unsubscribe someone else's email address. Because we are not expecting major spikes in subscribe/unsubscribe requests, there is no need to create a table with this as row key for efficient retrieval.</td>
</tr>

<tr>
<td>`Verified`</td>
<td>Boolean</td>
<td>When the row is initially created for a new subscriber, the value is false. It changes to true only after the new subscriber clicks the Confirm hyperlink in the welcome email. If a message is sent to a list while one of its subscribers' Verified value is false, no email is sent to that subscriber.</td>
</tr>

</table>

The following list shows an example of what data in the table might look like.

<table border="1">
<tr>
<th width="200" align="right" bgcolor="lightgray">Partition Key</th>
<td>contoso1</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">Row Key</th>
<td>0</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">Description</th>
<td>Contoso University History Department announcements</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">FromEmailAddress</th>
<td>donotreply@contoso.edu</td>
</tr>

</table>

<hr/>

<table border="1">

<tr>
<th width="200" align="right" bgcolor="lightgray">Partition Key</th>
<td>contoso1</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">Row Key</th>
<td>student1@domain.com</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">SubscriberGUID</th>
<td>6f32b03b-90ed-41a9-b8ac-c1310c67b66a</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">Verified</th>
<td>true</td>
</tr>

</table>

<hr/>

<table border="1">

<tr>
<th width="200" align="right" bgcolor="lightgray">Partition Key</th>
<td>contoso1</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">Row Key</th>
<td>student2@domain.com</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">SubscriberGUID</th>
<td>01234567-90ed-41a9-b8ac-c1310c67b66a</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">Verified</th>
<td>false</td>
</tr>

</table>

<hr/>

<table border="1">

<tr>
<th width="200" align="right" bgcolor="lightgray">Partition Key</th>
<td>fabrikam1</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">Row Key</th>
<td>0</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">Description</th>
<td>Fabrikam Engineering job postings</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">FromEmailAddress</th>
<td>donotreply@fabrikam.com</td>
</tr>

</table>

<hr/>

<table border="1">

<tr>
<th width="200" align="right" bgcolor="lightgray">Partition Key</th>
<td>fabrikam1</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">Row Key</th>
<td>applicant1@domain.com</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">SubscriberGUID</th>
<td>76543210-90ed-41a9-b8ac-c1310c67b66a</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">Verified</th>
<td>true</td>
</tr>

</table>

### Message table ###

The `Message` table stores information about messages that are scheduled to be sent to a mailing list. Administrators create and edit rows in this table using web pages, and the worker roles use it to pass information about each email from worker role A to worker role B.

The row key for the Message table can be one of two things:  the constant "Message" or the email address of the subscriber. Rows that have row key "Message" include information about the message, such as the mailing list to send it to and when it should be sent. Rows that have the email address as the row key have all of the information needed to send an email to that email address.

In relational database terms, rows with row key "Message" are equivalent to a Message table. Rows with row key = email address are equivalent to a join query view for `MailingList`, `Message`, and `Subscriber` information. 

The following grid shows row properties for the `Message` table rows that have information about the message itself.

<table border="1">

<tr bgcolor="lightgray">
<th>Property</th>
<th>Data Type</th>
<th>Description</th>
</tr>

<tr>
<td>PartitionKey</td>
<td>String</td>
<td>MessageRef:  A unique value created by getting the Ticks value from <code>DateTime.Now</code> when the row is created. Since rows are returned in partition key order this ensures that when browsing through messages in a web page, they are displayed in the order in which they were created. (A GUID could be used here but would result in random order, and a sort would be necessary).</td>
</tr>

<tr>
<td>RowKey</td>
<td>String</td>
<td>The constant "Message".</td>
</tr>

<tr>
<td>ScheduledDate</td>
<td>Date</td>
<td>The date the message is scheduled to be sent.</td>
</tr>

<tr>
<td>SubjectLine</td>
<td>String</td>
<td>The subject line of the email.</td>
</tr>

<tr>
<td>ListName</td>
<td>String</td>
<td>The list that this message is to be sent to.</td>
</tr>

<tr>
<td>Status</td>
<td>String</td>
<td><ul><li>"Pending" -- Worker role A needs to create queue messages to schedule emails.</li>
<li>"Processing" -- Worker role A has created queue work items for all emails in the list, but not all emails have been sent yet.</li>
<li>"Completed" -- Worker role B has finished processing all queue work items (all emails have been sent).</li></ul></td>
</tr>

</table>

The following grid shows row properties for the rows in the `Message` table that contain information for an individual email.  When worker role A creates a queue message for an email to be sent to a list, it creates a row in this table. Worker role B updates the `EmailSent` property to `true` when it sends the email. When the `EmailSent` property is `true` for all rows for a `Message` whose status is Processing, worker role A sets the `Message` status to Completed. 

<table border="1">

<tr bgcolor="lightgray">
<th>Property</th>
<th>Data Type</th>
<th>Description</th>
</tr>

<tr>
<td>PartitionKey</td>
<td>String</td>
<td>MessageRef.</td>
</tr>

<tr>
<td>RowKey</td>
<td>String</td>
<td>EmailAddress:  The destination email address from the MailingList table.
</td>
</tr>

<tr>
<td>ScheduledDate</td>
<td>Date</td>
<td>The date the message is scheduled to be sent, from the "0" row of the Message table.</td>
</tr>

<tr>
<td>SubjectLine</td>
<td>String</td>
<td>The subject line of the email, from the "0" row of the Message table.</td>
</tr>

<tr>
<td>From EmailAddress</td>
<td>String</td>
<td>The "From" email address, from the MailingList table.</td>
</tr>

<tr>
<td>EmailSent</td>
<td>Boolean</td>
<td>False means the email has not been sent yet; true means the email has been sent.</td>
</tr>

</table>

There is redundant data in these rows, which you would typically avoid in a relational database. But in this case you are trading some of the disadvantages of redundant data for the benefit of greater processing efficiency and scalability.  Because all of the data needed for an email is present in one of these rows, worker role B only needs to read one row in order to send an email when it pulls a work item off the queue.

(You might wonder where the body of the email comes from. These rows don't have blob references for the files that contain the body of the email, because that value is derived from the `MessageRef` value. For example, if the `MessageRef` is 634852858215726983, the blobs are named 634852858215726983.htm and 634852858215726983.txt.)

The following list shows an example of what data in the table might look like.

<table border="1">

<tr>
<th width="200" align="right" bgcolor="lightgray">Partition Key</th>
<td>634852858215726983</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">Row Key</th>
<td>0</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">ScheduledDate</th>
<td>2012-10-15</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">SubjectLine</th>
<td>New lecture series</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">ListName</th>
<td>contoso1</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">Status</th>
<td>Processing</td>
</tr>

</table>

<hr/>

<table border="1">

<tr>
<th width="200" align="right" bgcolor="lightgray">Partition Key</th>
<td>634852858215726983</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">Row Key</th>
<td>student1@contoso.edu</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">ScheduledDate</th>
<td>2012-10-15</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">SubjectLine</th>
<td>New lecture series</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">FromEmailAddress</th>
<td>donotreply@contoso.edu</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">EmailSent</th>
<td>true</td>
</tr>

</table>

<hr/>

<table border="1">

<tr>
<th width="200" align="right" bgcolor="lightgray">Partition Key</th>
<td>634852858215726983</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">Row Key</th>
<td>student1@contoso.edu</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">ScheduledDate</th>
<td>2012-10-15</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">SubjectLine</th>
<td>New lecture series</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">FromEmailAddress</th>
<td>donotreply@contoso.edu</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">EmailSent</th>
<td>false</td>
</tr>

</table>

<hr/>

<table border="1">

<tr>
<th width="200" align="right" bgcolor="lightgray">Partition Key</th>
<td>634852858215123456</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">Row Key</th>
<td>0</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">ScheduledDate</th>
<td>2012-10-31</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">SubjectLine</th>
<td>New display at Henry Art Gallery</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">ListName</th>
<td>contoso2</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">Status</th>
<td>Pending</td>
</tr>

</table>

<br/>
<br/>





<h2><a name="queues"></a><span class="short-header">Queues</span>Windows Azure Queues</h2>

Windows Azure queues facilitate communication between tiers of this multi-tier application, and between worker roles in the back-end tier. Windows Azure also provides the Service Bus queue service. For information about Service Bus queues, see the following resource:

* [Windows Azure Queues and Windows Azure Service Bus Queues - Compared and Contrasted][sbqueuecomparison].

The `Message` table could be used alone to coordinate work between worker role A and worker role B without using the Windows Azure Queue service, but using queues makes the application scalable. Using just the table would work when you have only one instance of worker role B.  When you have multiple instances of worker role B, pulling items off the queue is an efficient and effective way to apportion work among the worker role instances.

The Windows Azure Email Service application uses two queues, named `AzureMailQueue` and `AzureMailSubscribeQueue`.

### AzureMailQueue ###

The `AzureMailQueue` queue coordinates the sending of emails to email lists.  Worker role A places a work item on the queue for each email to be sent, and worker role B pulls a work item from the queue and sends the email. 

A queue work item contains a comma-delimited string that consists of the `MessageRef` (partition key to the `Message` table) and `EmailAddress` (row key to the `Message` table) values, for example:

      634852858215726983,student1@contoso.edu

Worker role B uses these values to look up the row in the `Message` table that contains all of the information needed to send the email.

When traffic spikes, the Cloud Service can be reconfigured so that multiple instances of worker role B are instantiated, and each of them can independently pull work items off the queue.

### AzureMailSubscribeQueue ###

The `AzureMailSubscribeQueue` queue coordinates the sending of subscription confirmation emails.  In response to a service method call, the service method places a work item on the queue.  Worker role B pulls the work item from the queue and sends the subscription confirmation email. 

A queue work item contains the subscriber GUID.  This value uniquely identifies an email address and the list to subscribe it to, which is all that worker role B needs to send a confirmation email. The subscriber GUID is not the partition key or the row key, but the volume of subscriptions is not expected to be high enough to cause the search for a GUID to be a performance bottleneck.






<h2><a name="blobs"></a><span class="short-header">Blobs</span>Windows Azure Blobs</h2>

Blobs are "binary large objects." The Windows Azure Blob service provides a means for uploading and storing files in the cloud. 

Azure Mail Service administrators store the body of an email in HTML form in an .html file and in plain text in a .txt file. When they schedule an email, they upload these files in the Message Create web page, and the ASP.NET MVC controller for the page stores the uploaded file in a Windows Azure blob.

Blobs are stored in blob containers, much like files are stored in folders. The Windows Azure Mail Service application uses a single blob container, named **AzureMailBlobContainer**.  The name of the blobs in the container is derived by concatenating the MessageRef value with the file extension, for example: 
634852858215726983.htm and 634852858215726983.txt.

Since both HTML and plain text messages are essentially strings, we could have designed the application to store the email message body in string properties in the `Message` table instead of in blobs. However, there is a 64K limit on the size of a property in a table row, so using a blob avoids that limitation on email body size.




<h2><a name="wawsvswacs"></a><span class="short-header">Cloud Service vs. Web Site</span>Windows Azure Cloud Service versus Windows Azure Web Site</h2>

The Windows Azure Email Service application can be configured so that the front-end and back-end all run in a single Windows Azure Cloud Service, or the front-end can be run in a Windows Azure Web Site. The project that you can download for this tutorial has the entire application in a Cloud Service because that simplifies configuration and deployment. 

![Application architecture overview][mtas-architecture-overview]

The alternative architecture is to run the front-end in a Windows Azure Web Site. 

![Alternative application architecture][mtas-alternative-architecture]

This alternative architecture might offer some cost benefits, because a Windows Azure Web Site might be less expensive for similar capacity compared to a web role running in a Cloud Service. The tutorial explains implementation details that differ between the two architectures, so that when you implement your own application you can choose the architecture that you prefer.




<h2><a name="futurereleases"></a><span class="short-header">Future releases</span>Functionality left for future releases</h2>

Like most development projects, deadlines limited what could be included in the first release of this sample application.  Some examples of features that could be added in the future include the following:

* Authentication for the Web API service method. Since we did not have time to add authentication for the service method in the initial release, the service method and the subscription confirmation page were omitted from the tutorial and the downloadable project. You can still test the application functionality by using the administrator web pages to subscribe email addresses to lists.
* Paging in the Index web pages.
* Concurrency handling in the web pages. (Warn if one person's changes would be overwritten when two people edit the same table row at the same time.)
* Handle "poison queue messages" that cause exceptions.  When dequeuing queue messages, check the dequeue count to see if it was dequeued repeatedly, and if so log it and don't try to send the email or dequeue the message anymore.
* A search page to facilitate looking up messages when there are too many to page through.
* Enable specifying a time of day, not just a date, for sending messages.
* Schedule emails to be divided up into batches. (For example, send 1,000 a day over seven days instead of 7,000 all at once.) This might be useful to limit email service costs.
* Schedule a test email to a QA list first to verify that emails look as expected before sending to the full list. This can be done in the initial release but would require separate Message entries for the QA and the production message.
* Archival functions to delete or archive old records in the Message table.
* Monitoring functions to check for and report on messages that did not get sent because worker role B failed to send one or more email messages.
* Support for automatic unsubscribe API offered by services such as Gmail.
* Store more information to put in emails, such as name for salutation.
* Store effective dates and cancellation dates to keep history of subscription activity instead of deleting rows to unsubscribe.




<h2><a name="nextsteps"></a><span class="short-header">Next steps</span>Next steps</h2>

In the next tutorial, you'll download the sample project, configure your development environment, configure the project for your environment, and test the project locally and in the cloud.  In the following tutorials you'll see how to build the project from scratch.

[tut2]: http://windowsazure.com/en-us/develop/net/tutorials/multi-tier-web-site/2-download-and-run/
[tut3]: http://windowsazure.com/en-us/develop/net/tutorials/multi-tier-web-site/3-web-role/
[tut4]: http://windowsazure.com/en-us/develop/net/tutorials/multi-tier-web-site/4-worker-role-a/
[tut5]: http://windowsazure.com/en-us/develop/net/tutorials/multi-tier-web-site/5-worker-role-b/

[sbqueuecomparison]: http://msdn.microsoft.com/en-us/library/windowsazure/hh767287.aspx
[queuehowto]: http://www.windowsazure.com/en-us/develop/net/how-to-guides/queue-service/
[tablehowto]: http://www.windowsazure.com/en-us/develop/net/how-to-guides/table-services/
[blobhowto]: http://www.windowsazure.com/en-us/develop/net/how-to-guides/blob-storage/

[0]: ../../Shared/media/antares-iaas-preview-01.png
[1]: ../../Shared/media/antares-iaas-preview-05.png
[2]: ../../Shared/media/antares-iaas-preview-06.png
[mtas-architecture-overview]: ../Media/mtas-architecture-overview.png
[mtas-alternative-architecture]: ../Media/mtas-alternative-architecture.png
[mtas-mailing-list-index-page]: ../Media/mtas-mailing-list-index-page.png
[mtas-subscribers-index-page]: ../Media/mtas-subscribers-index-page.png
[mtas-message-index-page]: ../Media/mtas-message-index-page.png
[mtas-message-create-page]: ../Media/mtas-message-create-page.png
[mtas-subscribe-confirmation-page]: ../Media/mtas-subscribe-confirmation-page.png
[mtas-unsubscribe-query-page]: ../Media/mtas-unsubscribe-query-page.png
[mtas-unsubscribe-confirmation-page]: ../Media/mtas-unsubscribe-confirmation-page.png
[mtas-worker-roles-a-and-b]: ../Media/mtas-worker-roles-a-and-b.png
[mtas-message-processing]: ../Media/mtas-message-processing.png
[mtas-subscribe-email]: ../Media/mtas-subscribe-email.png
[mtas-subscribe-diagram]: ../Media/mtas-subscribe-diagram.png
[]: ../Media/.png
[]: ../Media/.png
[]: ../Media/.png
