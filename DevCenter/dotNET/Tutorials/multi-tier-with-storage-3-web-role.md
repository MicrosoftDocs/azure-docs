<div chunk="../chunks/article-left-menu.md" />

# .NET Multi-Tier Application Using Storage Tables, Queues, and Blobs

This tutorial series shows how to create a multi-tier ASP.NET web application that uses Windows Azure Storage tables, queues, and blobs. The tutorial assumes that you have no prior experience using Windows Azure. On completing the tutorial, you'll have a robust and scalable data-driven web application up and running in the cloud.

<h2><a name="whyanemaillistapp"></a><span class="short-header">Why Choose This App</span>Why an Email List Service Application</h2>

We chose an email list service for this sample application because it is the kind of application that needs to be robust and scalable, two features that make it especially appropriate for Windows Azure. 

### Robust 

If a server fails while sending out emails to a large list, you want to be able to stand up a new server easily and quickly, and you want the application to pick up where it left off without losing or duplicating any emails. A Windows Azure Cloud Service web or worker role (virtual machine) is automatically replaced if it fails. And Windows Azure Storage queues and tables provide a means to implement server-to-server communication that can survive a failure without losing work.

### Scalable

An email service also must be able to handle spikes in traffic, since sometimes you are sending emails to small lists and sometimes to very large lists.  In many hosting environments, you have to purchase and maintain sufficient hardware to handle the spikes in workload, and you're paying for all that capacity 100% of the time although you might only use it 5% of the time.  With Windows Azure, you pay only for the amount of computing power that you actually need for only as long as you need it.  To scale up for a large mailing, you just change a configuration setting to increase the number of servers you have available to process the workload, and this can be done programmatically.

<h2><a name="whatyoulllearn"></a><span class="short-header">What You'll Learn</span>What You'll Learn</h2>

In this tutorial series you'll learn the following:

* How to enable your machine for Windows Azure development by installing the Windows Azure SDK.
* How to create a Visual Studio cloud project with an MVC 4 web role and two worker roles.
* How to publish the cloud project to a Windows Azure Cloud Service.
* How to publish the MVC 4 project to a Windows Azure Web Site if you prefer, and still use the worker roles in the Cloud Service.
* How to use Windows Azure storage queues for communication between tiers or between worker roles.
* How to use Windows Azure storage tables as a highly scalable data store for non-relational data.
* How to use Windows Azure storage blobs to store files in the cloud.
* How to use Azure Storage Explorer to work with tables, queues, and blobs.

<h2><a name="wawsvswacs"></a><span class="short-header">Application architecture</span>Overview of application architecture</h2>

This is the first tutorial in a series, and it provides an overview of the application and its architecture.

The front-end is a set of web pages and a service method that enable administrators to manage email lists, and subscribers to subscribe and unsubscribe. The front-end uses ASP.NET MVC 4 and Web API, and it runs in a web role in a Windows Azure Cloud Service. The back-end is a pair of worker roles running in the same Cloud Service and do the work of sending emails.

The application stores email lists and subscriber information in Windows Azure storage tables.  It stores email content in blobs (a plain text file and an HTML file for each email). It uses Windows Azure storage queues for communication between the front-end service method and the one of the back-end worker roles, and between the two worker roles. 

The following diagram provides a high-level picture of the application architecture that is used in this tutorial.

![Application architecture overview][mtas-architecture-overview]

An alternative architecture that would also work is to run the front-end in a Windows Azure Web Site. 

![Alternative application architecture][mtas-alternative-architecture]

This alternative architecture might offer some cost benefits, because a Windows Azure Web Site may be less expensive for similar capacity compared to a web role running in a Cloud Service. For this tutorial we have the entire application in a Cloud Service because that simplifies configuration and deployment. The tutorial explains the differences between the two architectures, so that when you implement your own application you can choose the architecture that you prefer.

<h2><a name="frontendoverview"></a><span class="short-header">Front-end overview</span>Front-end overview</h2>

The front-end includes web pages that administrators of the service use to manage email lists and to create and schedule messages to be sent to the lists.

![Mailing List Index Page][mtas-mailing-list-index-page]

![Subscriber Index Page][mtas-subscribers-index-page]

![Message Index Page][mtas-message-index-page]

![Message Create Page][mtas-message-create-page]

Clients of the service are companies that give their customers an opportunity to sign up for a list on the client web site. For example, Contoso University wants a list for History Department announcements. When a student interested in History Department announcements clicks a link on the Contoso University web site, Contoso University makes a web service call to this application. The service method causes an email to be sent to the customer. That email contains a link, and when the recipient clicks the link, a page welcoming the customer to the History Department Announcements list is displayed.

![Welcome to list page][mtas-subscribe-confirmation-page]

Every email sent by the service includes a hyperlink that can be used to unsubscribe. If a recipient clicks the link, a web page asks for confirmation of intent to unsubscribe. If the recipient clicks the Confirm button, a page is displayed confirming that the person has been removed from the list.

![Confirm unsubscribe page][mtas-unsubscribe-query-page]

![!Unsubscribe confirmed page][mtas-unsubscribe-confirmation-page]

<h2><a name="backendoverview"></a><span class="short-header">Back-end overview</span>Back-end overview</h2>

Email lists and email messages scheduled to be sent are stored in Windows Azure Storage tables. When an administrator schedules an email to be sent, a row containing the scheduled date and other data is placed on the Message table. A worker role (virtual machine) running in a Windows Azure Cloud Service periodically scans the Message table looking for messages that need to be sent (we'll call this Worker Role A). When Worker Role A finds a message needing to be sent, it looks up all the email addresses in the destination email list, puts the information needed to send the email in the Message table, and creates a work item on a queue for each email that needs to be sent. A second worker role (Worker Role B) polls the queue for work items. When Worker Role B finds a work item, it processes the item by sending the email and then deletes the work item from the queue. The following diagram shows these relationships.

![Worker roles A and B][mtas-worker-roles-a-and-b]

When Worker Role A creates a queue work item, it also adds a row to the Message table.  Worker Role A reads this row to get the information it needs to send the email.

The row in the Message table that provides information for one email also includes a property that indicates whether the email has actually been sent. When Worker Role B sends an email, it updates this property to indicate that the email has been sent. If Worker Role A goes down while creating queue work items for a message, it might create duplicate queue work items when it restarts, but the tracking row ensures that duplicate emails won't be sent. (Worker Role B checks the row before sending an email.)

![Queue message creation and processing][mtas-message-processing]

<h2><a name="tables"></a><span class="short-header">Tables</span>Windows Azure Storage Tables</h2>

Windows Azure storage tables are a NoSQL data store, not a relational database. That makes them a good choice when scalability is more important than data normalization and relational integrity. For example, in this application, worker roles create a row every time a queue workitem is created and the row is updated every time an email is sent, which might be a performance bottleneck if a relational database were used.

In a Windows Azure storage table, every row has a *partition key* and a *row key* that uniquely identifies the row. The partition key divides the table up both logically and physically into partitions. Within a partition, the row key uniquely identifies a row.

### MailingList table ###

The MailingList table stores information about mailing lists and information about the subscribers to mailing lists. Administrators use web pages to create and edit mailing lists, and clients and subscribers use a set of web pages and service method to subscribe and unsubscribe.

In NoSQL tables, different rows can have different schemas, and this flexibility is commonly used to make one table store data that would require multiple tables in a relational database. For example, to store mailing list data in SQL Database you could use three tables: a MailingList table that stores information about the list, a Subscriber table that stores information about subscribers, and a MailingListSubscriber table that associates mailing lists with subscribers and vice versa. In the NoSQL table in this application, all of those functions are rolled into one table named MailingList. 

The row key for the MailingList table can be one of two things:  the constant "0" or the email address of the subscriber. Rows that have row key "0" include information about the mailing list. Rows that have the email address as the row key have information about the subscribers to the list.

In other words, rows with row key "0" are equivalent to a MailingList table in a relational database. Rows with row key = email address are equivalent to a Subscriber table and a MailingListSubscriber association table in a relational database.

Making one table serve multiple purposes in this way facilitates better performance. In a relational database three tables would have to be read, then three sets of rows would have to be sorted and matched up against each other, which takes time. Here just one table is read and its rows are automatically returned in partition key and row key order.

The following grid shows row properties for the rows that show mailing list information (row key = "0").

<table border="1">
<tr>
<th>Property</td>
<th>Data Type</td>
<th>Description</td>
</tr>
<tr>
<td>PartitionKey</td>
<td>String</td>
<td>ListName:  The name (unique identifier) of the mailing list. The typical use for the table is to retrieve all information for a mailing list, so this is an efficient way to partition the table.</td>
</tr>
<tr>
<td>RowKey</td>
<td>String</td>
<td>The constant "0".</td>
</tr>
<tr>
<td>Description</td>
<td>String</td>
<td>Description of the mailing List, for example: "Contoso University History Department announcements".</td>
</tr>
<tr>
<td>FromEmailAddress</td>
<td>String</td>
<td>The "From" email address in the emails sent to this list, for example: "contoso.edu".</td>
</tr></table>

The following grid shows row properties for the rows that contain subscriber information for the list (row key = email address).

<table border="1">
<tr>
<th>Property</td>
<th>Data Type</td>
<th>Description</td>
</tr>
<tr>
<td>PartitionKey</td>
<td>String</td>
<td>ListName:  The name (unique identifier) of the mailing list.</td>
</tr>
<tr>
<td>RowKey</td>
<td>String</td>
<td>EmailAddress:  The subscriber email address.</td>
</tr>
<tr>
<td>SubscriberGUID</td>
<td>String</td>
<td>Generated when the email address is added to a list, used in subscribe and unsubscribe links so that it's not too easy to subscribe or unsubscribe someone else's email address. Not expecting major spikes in subscribe/unsubscribe requests, so no need to create a table with this as row key for efficient retrieval..</td>
</tr>
<tr>
<td>Status</td>
<td>String</td>
<td>"Pending" or "Verified." When a customer clicks on a subscribe link in a web site, a row for the subscriber is created and set to Pending, and an email is sent to the submitted email address. That email contains a hyperlink that the recipient can click in order to confirm the subscription. When the recipient clicks that link, the status is changed to "Verified". While the status is "Pending", no emails are sent to the address except for the initial email with the Confirm Subscription link.</td>
</tr></table>

The following list shows an example of what data in the table might look like.

<table border="1">
<tr>
<th width="200">Partition Key</th>
<td>contoso1</td>
</tr>
<tr>
<th>Row Key</td>
<td>0</td>
</tr>
<tr>
<th>Description</th>
<td>Contoso University History Department announcements</td>
</tr>
<tr>
<th>FromEmailAddress</th>
<td>donotreply@contoso.edu</td>
</tr>
</table>

<hr/>

<table border="1">
<tr>
<th width="200">Partition Key</th>
<td>contoso1</td>
</tr>
<tr>
<th>Row Key</td>
<td>student1@domain.com</td>
</tr>
<tr>
<th>SubscriberGUID</th>
<td>6f32b03b-90ed-41a9-b8ac-c1310c67b66a</td>
</tr>
<tr>
<th>Status</th>
<td>Verified</td>
</tr>
</table>

<hr/>

<table border="1">
<tr>
<th width="200">Partition Key</th>
<td>contoso1</td>
</tr>
<tr>
<th>Row Key</td>
<td>student2@domain.com</td>
</tr>
<tr>
<th>SubscriberGUID</th>
<td>01234567-90ed-41a9-b8ac-c1310c67b66a</td>
</tr>
<tr>
<th>Status</th>
<td>Verified</td>
</tr>
</table>

<hr/>

<table border="1">
<tr>
<th width="200">Partition Key</th>
<td>fabrikam1</td>
</tr>
<tr>
<th>Row Key</td>
<td>0</td>
</tr>
<tr>
<th>Description</th>
<td>Fabrikam Engineering job postings</td>
</tr>
<tr>
<th>FromEmailAddress</th>
<td>donotreply@fabrikam.com</td>
</tr>
</table>

<hr/>

<table border="1">
<tr>
<th width="200">Partition Key</th>
<td>fabrikam1</td>
</tr>
<tr>
<th>Row Key</td>
<td>applicant1@domain.com</td>
</tr>
<tr>
<th>SubscriberGUID</th>
<td>76543210-90ed-41a9-b8ac-c1310c67b66a</td>
</tr>
<tr>
<th>Status</th>
<td>Verified</td>
</tr>
</table>

### Message table ###

The Message table stores information about messages that are scheduled to be sent to a mailing list. Administrators create and edit rows in this table using a web page, and the worker roles use it to pass information about each email from Worker Role A to Worker Role B.

The row key for the Message table can be one of two things:  the constant "0" or the email address of the subscriber. Rows that have row key "0" include information about the message. Rows that have the email address as the row key have information about the message, the mailing list, and the subscriber -- everything needed to send an email.

In relational database terms, rows with row key "0" are equivalent to a Message table. Rows with row key = email address are equivalent to a join query view for MailingList, Message, and Subscriber information. 

The following grid shows row properties for the Message table rows that have information about the message itself.

<table border="1">
<tr>
<th>Property</td>
<th>Data Type</td>
<th>Description</td>
</tr>
<tr>
<td>PartitionKey</td>
<td>String</td>
<td>MessageRef:  A unique value created by getting the Ticks value from <code>DateTime.Now</code> when the row is created. Since rows are returned in partition key order this ensures that when browsing through messages in the UI, they are displayed in the order in which they were created. (A GUID could be used here but would result in random order, and a sort would be necessary).</td>
</tr>
<tr>
<td>RowKey</td>
<td>String</td>
<td>The constant "0".</code>.</td>
</tr>
<td>ScheduledDate</td>
<td>String</td>
<td>The date the message is scheduled to be sent.</td>
</tr>
<tr>
<tr>
<td>SubjectLine</td>
<td>String</td>
<td>The subject line of the email.</td>
</tr>
<tr>
<td>ListName</td>
<td>String</td>
<td>The name of the list that this message is to be sent to. The same as the partition key of the MailingList table.</td>
</tr>
<tr>
<td>Status</td>
<td>String</td>
<td><ul><li>"Pending" -- Worker Role A still needs to create queue messages to schedule emails, on the scheduled date.</li>
<li>"Processing" -- Queue messages have been created for all emails in the list.</li>
<li>"Completed" -- Worker Role B has finished processing all queue messages (all emails have been sent).</li></ul></td>
</tr>
</table>

The following grid shows row properties for the rows in the Message table that contain information for an individual email.  These rows also help ensure that a message is sent to each email address only once, and they help determine when all emails for a message have been sent. When Worker Role A creates a queue message for an email to be sent to a list, it creates a row in this table. Worker Role B updates the EmailSent property to true when it sends the email. When the EmailSent property is true for all rows for a Message whose status is Processing, Worker Role A sets the Message status to Completed. 

<table border="1">
<tr>
<th>Property</td>
<th>Data Type</td>
<th>Description</td>
</tr>
<tr>
<td>PartitionKey</td>
<td>String</td>
<td>MessageRef.</td>
</tr>
<tr>
<td>RowKey</td>
<td>String</td>
<td>EmailAddress:  The destination email address from the MailingList table.</code>.
</td>
<tr>
<td>ScheduledDate</td>
<td>DateTime</td>
<td>The date the message is scheduled to be sent, from the Message table.</td>
</tr>
<tr>
</tr>
<tr>
<td>From EmailAddress</td>
<td>String</td>
<td>The "From" email address, from the MailingList table.</td>
</tr>
<tr>
<td>SubjectLine</td>
<td>String</td>
<td>The subject line of the email, from the Message table.</td>
</tr>
<tr>
<td>EmailSent</td>
<td>Boolean</td>
<td>null or false means the email has not been sent yet; true means the email has been sent.</td>
</tr>
</table>

(These rows don't have blob references for the email body .html and .txt files that contain the body of the email, because that value is derived from the MessageRef value.)

The following list shows an example of what data in the table might look like.

<table border="1">
<tr>
<th width="200">Partition Key</th>
<td>634852858215726983</td>
</tr>
<tr>
<th>Row Key</td>
<td>0</td>
</tr>
<tr>
<th>ScheduledDate</th>
<td>2012-10-15</td>
</tr>
<tr>
<th>SubjectLine</th>
<td>New lecture series</td>
</tr>
<tr>
<th>ListName</th>
<td>contoso1</td>
</tr>
<tr>
<th>Status</th>
<td>Processing</td>
</tr>
</table>

<hr/>

<table border="1">
<tr>
<th width="200">Partition Key</th>
<td>634852858215726983</td>
</tr>
<tr>
<th>Row Key</td>
<td>student1@contoso.edu</td>
</tr>
<tr>
<th>ScheduledDate</th>
<td>2012-10-15</td>
</tr>
<tr>
<th>FromEmailAddress</th>
<td>donotreply@contoso.edu</td>
</tr>
<tr>
<th>SubjectLine</th>
<td>New lecture series</td>
</tr>
<tr>
<th>EmailSent</th>
<td>true</td>
</tr>
</table>

<hr/>

<table border="1">
<tr>
<th width="200">Partition Key</th>
<td>634852858215726983</td>
</tr>
<tr>
<th>Row Key</td>
<td>student2@contoso.edu</td>
</tr>
<th>Row Key</td>
<td>student1@contoso.edu</td>
</tr>
<tr>
<th>ScheduledDate</th>
<td>2012-10-15</td>
</tr>
<tr>
<th>FromEmailAddress</th>
<td>donotreply@contoso.edu</td>
</tr>
<tr>
<tr>
<th>SubjectLine</th>
<td>New lecture series</td>
</tr>
<tr>
<th>EmailSent</th>
<td>false</td>
</tr>
</table>

<table border="1">
<tr>
<th width="200">Partition Key</th>
<td>634852858215123456</td>
</tr>
<tr>
<th>Row Key</td>
<td>0</td>
</tr>
<tr>
<th>ScheduledDate</th>
<td>2012-10-31</td>
</tr>
<tr>
<th>SubjectLine</th>
<td>New display at Henry Art Gallery</td>
</tr>
<tr>
<th>ListName</th>
<td>contoso2</td>
</tr>
<tr>
<th>Status</th>
<td>Pending</td>
</tr>
</table>

<h2><a name="queues"></a><span class="short-header">Queues</span>Windows Azure Storage Queues</h2>

Windows Azure storage queues facilitate communication between tiers of a multi-tier application, and between servers (worker roles) in the back-end tier. Windows Azure also provides another kind of queue service that has more features but is more complex to configure and program:  Service Bus queues.  For information about the difference between storage queues and Service Bus queues, see [Windows Azure Queues and Windows Azure Service Bus Queues - Compared and Contrasted][].

The Azure Email Service application uses two queues.

### AzureMailQueue ###

The AzureMailQueue queue coordinates the sending of emails to email lists.  Worker Role A places a work item on the queue for each email to be sent, and Worker Role B pulls a work item from the queue and sends the email. 

The queue message string contains MessageRef (partition key to the Message table) and EmailAddress (row key to the Message table) values. Worker Role B uses these values to look up the row in the Message table that contains all of the information needed to send the email.

When traffic spikes, the Cloud Service can be reconfigured so that multiple instances of Worker Role B are instantiated, and each of them can independently pull work items off the queue.

### AzureMailSubscribeQueue ###

The AzureMailSubscribeQueue queue coordinates the sending of subscription confirmation emails to email lists.  In response to a subscribe service call, the Web API service method places a work item on the queue for the email address that needs confirmation.  Worker Role B pulls a work item from the queue and sends the email. 

The queue message string contains the subscriber GUID.  This value uniquely identifies an email address and the list to subscribe it to, which is all Worker Role B needs to send a confirmation email. The subscriber GUID is not the partition key or the row key, but the volume of subscriptions is not expected to be high enough to cause the search for GUID to be a performance bottleneck.

<h2><a name="blobs"></a><span class="short-header">Blobs</span>Windows Azure Storage Blobs</h2>

The body of an email is stored in .html and .txt files, and in the Create and Edit pages for Messages, administrators upload both file types for each message.  When the files are uploaded, they are stored in blobs.

There is a single blob container, named AzureMailBlobContainer.  The name of the blobs in the container is derived by concatenating the MessageRef value with the file extension.

<h2><a name="nextsteps"></a><span class="short-header">Next steps</span>Next steps</h2>

In the next tutorial, you'll download the sample project, configure your environment and configure the project for your environment, and test it locally and in the cloud.  In tutorials that we'll add later, we'll show you how to build the project from scratch.


[Windows Azure Queues and Windows Azure Service Bus Queues - Compared and Contrasted]: http://msdn.microsoft.com/en-us/library/windowsazure/hh767287.aspx

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
[mtas-unsubscribe-confirmed-page]: ../Media/unsubscribe-confirmed-page.png
[mtas-unsubscribe-confirmed-page]: ../Media/unsubscribe-confirmed-page.png

