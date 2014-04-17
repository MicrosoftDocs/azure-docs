<properties linkid="develop-net-tutorials-multi-tier-web-site-1-overview" pageTitle="Azure Cloud Service Tutorial: ASP.NET MVC Web Role, Worker Role, Azure Storage Tables, Queues, and Blobs" metaKeywords="Azure tutorial, Azure storage tutorial, Azure multi-tier tutorial, MVC Web Role tutorial, Azure worker role tutorial, Azure blobs tutorial, Azure tables tutorial, Azure queues tutorial" description="Learn how to create a multi-tier app using ASP.NET MVC and Azure. The app runs in a cloud service, with web role and worker roles, and uses Azure storage tables, queues, and blobs." metaCanonical="" services="cloud-services,storage" documentationCenter=".NET" title="Azure Cloud Service Tutorial: ASP.NET MVC Web Role, Worker Role, Azure Storage Tables, Queues, and Blobs" authors="tdykstra,riande" solutions="" manager="wpickett" editor="mollybos" />

# Azure Cloud Service Tutorial: ASP.NET MVC Web Role, Worker Role, and Azure Storage Tables, Queues, and Blobs - 1 of 5

This tutorial series shows how to create and deploy a multi-tier ASP.NET MVC web application that runs in an Azure cloud service and uses Azure Storage tables, queues, and blobs. You can [download the completed application](http://code.msdn.microsoft.com/Windows-Azure-Multi-Tier-eadceb36) from the MSDN Code Gallery. Here is a diagram that shows how the parts of the application interact:

![Email message processing][mtas-worker-roles-a-and-b]

In this tutorial series you'll learn the following:

* How to enable your machine for Azure development by installing the Azure SDK.
* How to create a Visual Studio cloud project with an ASP.NET MVC web role and two worker roles.
* How to publish the cloud project to an Azure Cloud Service.
* How to publish the MVC project to an Azure Web Site if you prefer, and still use the worker roles in a Cloud Service.
* How to use the Azure Queue storage service for communication between tiers or between worker roles.
* How to use the Azure Table storage service as a highly scalable data store for structured, non-relational data.
* How to use the Azure Blob service to store files in the cloud.
* How to view and edit Azure tables, queues, and blobs by using Visual Studio Server Explorer.
* How to use SendGrid to send emails.
* How to configure tracing and view trace data.
* How to scale an application by increasing the number of worker role instances.

<h2><a name="toc"></a>Tutorials in the Series</h2>

Here is a list of the tutorials with a summary of their contents:

1. **Introduction to the Azure Email Service application** (this tutorial). An in-depth look at the application and its architecture. You can skip this if you just want to see how to deploy or you want to see the code, and you can come back here later to better understand the architecture. 
2. [Configuring and Deploying the Azure Email Service application][tut2]. How to download the sample application, configure it, test it locally, deploy it, and test it in the cloud.  
3. [Building the web role for the Azure Email Service application][tut3]. How to build the MVC components of the application and test them locally.
4. [Building worker role A (email scheduler) for the Azure Email Service application][tut4]. How to build the back-end component that creates queue work items for sending emails, and test it locally.
5. [Building worker role B (email sender) for the Azure Email Service application][tut5]. How to build the back-end component that processes queue work items for sending emails, and test it locally.

## Segments of this tutorial

- [Prerequisites](#prerequisites)
- [Why an email list](#whyanemaillistapp)
- [Front-end overview](#frontend)
- [Back-end overview](#backend)
- [Azure tables](#tables)
- [Azure queues](#queues)
- [Data diagram](#datadiagram)
- [Azure blobs](#blobs)
- [Azure cloud service versus Azure web site](#wawsvswacs)
- [Cost](#cost)
- [Authentication and authorization](#auth)
- [Next steps](#nextsteps)


## Prerequisites

The instructions in these tutorials work for the following products:

* Visual Studio 2012
* Visual Studio 2012 Express for Web
* Visual Studio 2010
* Visual Web Developer Express 2010.

>[WACOM.NOTE] After this tutorial was written, Visual Studio 2013 was released, and the Azure Management Portal and SDK were updated. Notes like this one have been added at points where you have to do things differently if you are using Visual Studio 2013 and the latest SDK. The notes were written in March, 2014, and the revised procedures have been tested with SDK version 2.3. The main text and screen shots of the tutorial will be updated later.
This content, without the latest updates for Visual Studio 2013, is available as a free e-book in the 
[TechNet E-Book Gallery](http://social.technet.microsoft.com/wiki/contents/articles/11608.e-book-gallery-for-microsoft-technologies.aspx#ASPNETMultiTierWindowsAzureApplicationUsingStorageTablesQueuesandBlobs).

<h2><a name="whyanemaillistapp"></a><span class="short-header">Why This App</span>Why an Email List Service Application</h2>

We chose an email list service for this sample application because it is the kind of application that needs to be resilient and scalable, two features that make it especially appropriate for Azure.  

### Resilient 

If a server fails while sending out emails to a large list, you want to be able to spin up a new server easily and quickly, and you want the application to pick up where it left off without losing or duplicating any emails. An Azure Cloud Service web or worker role instance (a virtual machine) is automatically replaced if it fails. And Azure Storage queues and tables provide a means to implement server-to-server communication that can survive a failure without losing work.

### Scalable

An email service also must be able to handle spikes in workload, since sometimes you are sending emails to small lists and sometimes to very large lists.  In many hosting environments, you have to purchase and maintain sufficient hardware to handle the spikes in workload, and you're paying for all that capacity 100% of the time although you might only use it 5% of the time.  With Azure, you pay only for the amount of computing power that you actually need for only as long as you need it.  To scale up for a large mailing, you just change a configuration setting to increase the number of servers you have available to process the workload, and this can be done programmatically.  For example, you could configure the application so that if the number of work items waiting in the queue exceeds a certain number, Azure automatically spins up additional instances of the worker role that processes those work items.



<h2><a name="frontend"></a>Front-end overview</h2>

The application that you'll build is an email list service. The front-end of the application includes web pages that administrators of the service use to manage email lists.

![Mailing List Index Page][mtas-mailing-list-index-page]

![Subscriber Index Page][mtas-subscribers-index-page]

There is also a set of pages that administrators use to create messages to be sent to an email list.

![Message Index Page][mtas-message-index-page]

![Message Create Page][mtas-message-create-page]

Clients of the service are companies that give their customers an opportunity to sign up for a mailing list on the client web site. For example, an administrator sets up a list for Contoso University History Department announcements. When a student interested in History Department announcements clicks a link on the Contoso University web site, Contoso University makes a web service call to the Azure Email Service application. The service method causes an email to be sent to the customer. That email contains a hyperlink, and when the recipient clicks the link, a page welcoming the customer to the History Department Announcements list is displayed.

![Confirmation email][mtas-subscribe-email]

![Welcome to list page][mtas-subscribe-confirmation-page]

Every email sent by the service (except the subscribe confirmation) includes a hyperlink that can be used to unsubscribe. If a recipient clicks the link, a web page asks for confirmation of intent to unsubscribe. 

![Confirm unsubscribe page][mtas-unsubscribe-query-page]

If the recipient clicks the **Confirm** button, a page is displayed confirming that the person has been removed from the list.

![Unsubscribe confirmed page][mtas-unsubscribe-confirmation-page]


<h2><a name="backend"></a><span class="short-header">Back-end overview</span>Back-end overview</h2>

The front-end stores email lists and messages to be sent to them in Azure tables. When an administrator schedules a message to be sent, a table row containing the scheduled date and other data such as the subject line is added to the `message` table. A worker role periodically scans the `message` table looking for messages that need to be sent (we'll call this worker role A). 

When worker role A finds a message needing to be sent, it does the following tasks:

* Gets all the email addresses in the destination email list.
* Puts the information needed to send each email in the `message` table.
* Creates a queue work item for each email that needs to be sent. 

A second worker role (worker role B) polls the queue for work items. When worker role B finds a work item, it processes the item by sending the email, and then it deletes the work item from the queue. The following diagram shows these relationships.

![Email message processing][mtas-worker-roles-a-and-b]

No emails are missed if worker role B goes down and has to be restarted, because a queue work item for an email isn't deleted until after the email has been sent. The back-end also implements table processing that prevents multiple emails from getting sent in case worker role A goes down and has to be restarted. In that case, multiple queue work items might be generated for a given destination email address. But for each destination email address, a row in the `message` table tracks whether the email has been sent. Depending on the timing of the restart and email processing, worker A uses this row to avoid creating a second queue work item, or worker B uses this row to avoid sending a second email.

![Preventing duplicate emails][mtas-message-processing]

Worker role B also polls a subscription queue for work items put there by the Web API service method for new subscriptions. When it finds one, it sends the confirmation email. 

![Subscription queue message processing][mtas-subscribe-diagram]





<h2><a name="tables"></a><span class="short-header">Tables</span>Azure Tables</h2>

The Azure Email Service application stores data in Azure Storage tables. Azure tables are a NoSQL data store, not a relational database like [Azure SQL Database](http://msdn.microsoft.com/en-us/library/windowsazure/ee336279.aspx). That makes them a good choice when efficiency and scalability are more important than data normalization and relational integrity. For example, in this application, one worker role creates a row every time a queue work item is created, and another one retrieves and updates a row every time an email is sent, which might become a performance bottleneck if a relational database were used. Additionally,  Azure tables are cheaper than Azure SQL.  For more information about Azure tables, see the resources that are listed at the end of [the last tutorial in this series][tut5].

The following sections describe the contents of the Azure tables that are used by the Azure Email Service application. For a diagram that shows the tables and their relationships, see the [Azure Email Service data diagram](#datadiagram) later in this page.

### mailinglist table ###

The `mailinglist` table stores information about mailing lists and the subscribers to mailing lists. (The Azure table naming convention best practice is to use all lower-case letters.) Administrators use web pages to create and edit mailing lists, and clients and subscribers use a set of web pages and a service method to subscribe and unsubscribe. 

In NoSQL tables, different rows can have different schemas, and this flexibility is commonly used to make one table store data that would require multiple tables in a relational database. For example, to store mailing list data in SQL Database you could use three tables: a `mailinglist` table that stores information about the list, a `subscriber` table that stores information about subscribers, and a `mailinglistsubscriber` table that associates mailing lists with subscribers and vice versa. In the NoSQL table in this application, all of those functions are rolled into one table named `mailinglist`. 

In an Azure table, every row has a *partition key* and a *row key* that uniquely identifies the row. The partition key divides the table up logically into partitions. Within a partition, the row key uniquely identifies a row. There are no secondary indexes; therefore to make sure that the application will be scalable, it is important to design your tables so that you can always specify partition key and row key values in the Where clause of queries.

The partition key for the `mailinglist` table is the name of the mailing list. 

The row key for the `mailinglist` table can be one of two things:  the constant "mailinglist" or the email address of the subscriber. Rows that have row key "mailinglist" include information about the mailing list. Rows that have the email address as the row key have information about the subscribers to the list.

In other words, rows with row key "mailinglist" are equivalent to a `mailinglist` table in a relational database. Rows with row key = email address are equivalent to a `subscriber` table and a `mailinglistsubscriber` association table in a relational database.

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
<td>The constant "mailinglist".</td>
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
<td>PartitionKey</td>
<td>String</td>
<td>ListName:  The name (unique identifier) of the mailing list, for example: contoso1.</td>
</tr>

<tr>
<td>RowKey</td>
<td>String</td>
<td>EmailAddress:  The subscriber email address, for example: student1@contoso.edu.</td>
</tr>

<tr>
<td>SubscriberGUID</td>
<td>String</td>
<td>Generated when the email address is added to a list. Used in subscribe and unsubscribe links so that it's difficult to subscribe or unsubscribe someone else's email address. 
<br/><br/>
Some queries for the Subscribe and Unsubscribe web pages specify only the PartitionKey and this property. Querying a partition without using the RowKey limits the scalability of the application, because queries will take longer as mailing list sizes increase. An option for improving scalability is to add lookup rows that have the SubscriberGUID in the RowKey property. For example, for each email address one row could have "email:student1@domain.com" in the RowKey and another row for the same subscriber could have "guid:6f32b03b-90ed-41a9-b8ac-c1310c67b66a" in the RowKey. This is simple to implement because atomic batch transactions on rows within a partition are easy to code. We hope to implement this in the next release of the sample application. For more information, see <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh508997.aspx">Real World: Designing a Scalable Partitioning Strategy for Azure Table Storage</a>
</td>
</tr>

<tr>
<td>Verified</td>
<td>Boolean</td>
<td>When the row is initially created for a new subscriber, the value is false. It changes to true only after the new subscriber clicks the Confirm hyperlink in the welcome email or an administrator sets it to true. If a message is sent to a list while the Verified value for one of its subscribers is false, no email is sent to that subscriber.</td>
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
<td>mailinglist</td>
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
<td>mailinglist</td>
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

### message table ###

The `message` table stores information about messages that are scheduled to be sent to a mailing list. Administrators create and edit rows in this table using web pages, and the worker roles use it to pass information about each email from worker role A to worker role B.

The partition key for the message table is the date the email is scheduled to be sent, in yyyy-mm-dd format. This optimizes the table for the query that is executed most often against this table, which selects rows that have `ScheduledDate` of today or earlier. However, it does creates a potential performance bottleneck, because Azure Storage tables have a maximum throughput of 500 entities per second for a partition.  For each email to be sent, the application writes a `message` table row, reads a row, and deletes a row. Therefore the shortest possible time for processing 1,000,000 emails scheduled for a single day is almost two hours, regardless of how many worker roles are added in order to handle increased loads. 

The row key for the `message` table can be one of two things:  the constant "message" plus a unique key for the message called the `MessageRef`, or the `MessageRef` value plus the email address of the subscriber. Rows that have row key that begins with "message" include information about the message, such as the mailing list to send it to and when it should be sent. Rows that have the `MessageRef` and email address as the row key have all of the information needed to send an email to that email address.

In relational database terms, rows with row key that begins with "message" are equivalent to a `message` table. Rows with row key = `MessageRef` plus email address are equivalent to a join query view that contains `mailinglist`, `message`, and `subscriber` information. 

The following grid shows row properties for the `message` table rows that have information about the message itself.

<table border="1">

<tr bgcolor="lightgray">
<th>Property</th>
<th>Data Type</th>
<th>Description</th>
</tr>

<tr>
<td>PartitionKey</td>
<td>String</td>
<td>The date the message is scheduled to be sent, in yyyy-mm-dd format.</td>
</tr>

<tr>
<td>RowKey</td>
<td>String</td>
<td>The constant "message" concatenated with the <code>MessageRef</code> value. The <code>MessageRef</code> is a unique value created by getting the <code>Ticks</code> value from <code>DateTime.Now</code> when the row is created. <br/><br/>Note: High volume multi-threaded, multi-instance applications should be prepared to handle duplicate RowKey exceptions when using Ticks. Ticks are not guaranteed to be unique.</td>
</tr>

<tr>
<td>ScheduledDate</td>
<td>Date</td>
<td>The date the message is scheduled to be sent. (Same as <code>PartitionKey</code> but in Date format.)</td>
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
<td><ul>
<li>"Pending" -- Worker role A has not yet started to create queue messages to schedule emails.</li>
<li>"Queuing" -- Worker role A has started to create queue messages to schedule emails.</li>
<li>"Processing" -- Worker role A has created queue work items for all emails in the list, but not all emails have been sent yet.</li>
<li>"Completed" -- Worker role B has finished processing all queue work items (all emails have been sent). Completed rows are archived in the <code>messagearchive</code> table, as explained later. We hope to make this property an <code>enum</code>  in the next release.</li></ul></td>
</tr>

</table>

When worker role A creates a queue message for an email to be sent to a list, it creates an email row in the `message` table. When worker role B sends the email, it moves the email row to the `messagearchive` table and updates the `EmailSent` property to `true`. When all of the email rows for a message in Processing status have been archived, worker role A sets the status to Completed and moves the `message` row to the `messagearchive` table.

The following grid shows row properties for the email rows in the `message` table.  

<table border="1">

<tr bgcolor="lightgray">
<th>Property</th>
<th>Data Type</th>
<th>Description</th>
</tr>

<tr>
<td>PartitionKey</td>
<td>String</td>
<td>The date the message is scheduled to be sent, in yyyy-mm-dd format.</td>
</tr>

<tr>
<td>RowKey</td>
<td>String</td>
<td>The <code>MessageRef</code> value and the destination email address from the <code>subscriber</code> row of the <code>mailinglist</code> table.
</td>
</tr>

<tr>
<td>MessageRef</td>
<td>Long</td>
<td>Same as the <code>MessageRef</code> component of the <code>RowKey</code>.</td>
</tr>

<tr>
<td>ScheduledDate</td>
<td>Date</td>
<td>The scheduled date from the <code>message</code> row of the <code>message</code> table. (Same as <code>PartitionKey</code> but in Date format.)</td>
</tr>

<tr>
<td>SubjectLine</td>
<td>String</td>
<td>The email subject line from the <code>message</code> row of the <code>message</code> table.</td>
</tr>

<tr>
<td>ListName</td>
<td>String</td>
<td>The mailing list name from the <code>mailinglist</code> table.</td>
</tr>

<tr>
<td>From EmailAddress</td>
<td>String</td>
<td>The "from" email address from the <code>mailinglist</code> row of the <code>mailinglist</code> table.</td>
</tr>

<tr>
<td>EmailAddress</td>
<td>String</td>
<td>The email address from the <code>subscriber</code> row of the <code>mailinglist</code> table.</td>
</tr>

<tr>
<td>SubscriberGUID</td>
<td>String</td>
<td>The subscriber GUID from the <code>subscriber</code> row of the <code>mailinglist</code> table.</td>
</tr>

<tr>
<td>EmailSent</td>
<td>Boolean</td>
<td>False means the email has not been sent yet; true means the email has been sent.</td>
</tr>

</table>

There is redundant data in these rows, which you would typically avoid in a relational database. But in this case you are trading some of the disadvantages of redundant data for the benefit of greater processing efficiency and scalability.  Because all of the data needed for an email is present in one of these rows, worker role B only needs to read one row in order to send an email when it pulls a work item off the queue.

You might wonder where the body of the email comes from. These rows don't have blob references for the files that contain the body of the email, because that value is derived from the `MessageRef` value. For example, if the `MessageRef` is 634852858215726983, the blobs are named 634852858215726983.htm and 634852858215726983.txt.

The following list shows an example of what data in the table might look like.

<table border="1">

<tr>
<th width="200" align="right" bgcolor="lightgray">Partition Key</th>
<td>2012-10-15</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">Row Key</th>
<td>message634852858215726983</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">MessageRef</th>
<td>634852858215726983</td>
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
<td>2012-10-15</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">Row Key</th>
<td>634852858215726983student1@contoso.edu</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">MessageRef</th>
<td>634852858215726983</td>
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
<th align="right" bgcolor="lightgray">FromEmailAddress</th>
<td>donotreply@contoso.edu</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">EmailAddress</th>
<td>student1@contoso.edu</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">SubscriberGUID</th>
<td>76543210-90ed-41a9-b8ac-c1310c67b66a</td>
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
<td>2012-10-15</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">Row Key</th>
<td>634852858215726983student2@contoso.edu</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">MessageRef</th>
<td>634852858215726983</td>
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
<th align="right" bgcolor="lightgray">FromEmailAddress</th>
<td>donotreply@contoso.edu</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">EmailAddress</th>
<td>student2@contoso.edu</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">SubscriberGUID</th>
<td>12345678-90ed-41a9-b8ac-c1310c679876</td>
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
<td>2012-11-15</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">Row Key</th>
<td>message124852858215726999</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">MessageRef</th>
<td>124852858215726999</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">ScheduledDate</th>
<td>2012-11-15</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">SubjectLine</th>
<td>New job postings</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">ListName</th>
<td>fabrikam</td>
</tr>

<tr>
<th align="right" bgcolor="lightgray">Status</th>
<td>Pending</td>
</tr>

</table>

<br/>
<br/>

### messagearchive table ###

One strategy for making sure that queries execute efficiently, especially if you have to search on fields other than `PartitionKey` and `RowKey`, is to limit the size of the table. The query in worker role A that checks to see if all emails have been sent for a message needs to find email rows in the `message` table that have `EmailSent` = false. The `EmailSent` value is not in the PartitionKey or RowKey, so this would not be an efficient query for a message with a large number of email rows. Therefore, the application moves email rows to the `messagearchive` table as the emails are sent. As a result, the query to check if all emails for a message have been sent only has to query the message table on `PartitionKey` and `RowKey` because if it finds any email rows for a message at all, that means there are unsent messages and the message can't be marked `Complete`. 

The schema of rows in the `messagearchive` table is identical to that of the `message` table. Depending on what you want to do with this archival data, you could limit its size and expense by reducing the number of properties stored for each row, and by deleting rows older than a certain age.



<h2><a name="queues"></a><span class="short-header">Queues</span>Azure Queues</h2>

Azure queues facilitate communication between tiers of this multi-tier application, and between worker roles in the back-end tier. 
Queues are used to communicate between worker role A and worker role B in order to make the application scalable. Worker role A could create a row in the Message table for each email, and worker role B could scan the table for rows representing emails that haven't been sent, but you wouldn't be able to add additional instances of worker role B in order to divide up the work. The problem with using table rows to coordinate the work between worker role A and worker role B is that you have no way of ensuring that only one worker role instance will pick up any given table row for processing. Queues give you that assurance. When a worker role instance pulls a work item off a queue, the queue service makes sure that no other worker role instance can pull the same work item. This exclusive lease feature of Azure queues facilitates sharing a workload among multiple instances of a worker role.

Azure also provides the Service Bus queue service. For more information about Azure Storage queues and Service Bus queues, see the resources that are listed at the end of [the last tutorial in this series][tut5].

The Azure Email Service application uses two queues, named `AzureMailQueue` and `AzureMailSubscribeQueue`.

### AzureMailQueue ###

The `AzureMailQueue` queue coordinates the sending of emails to email lists.  Worker role A places a work item on the queue for each email to be sent, and worker role B pulls a work item from the queue and sends the email. 

A queue work item contains a comma-delimited string that consists of the scheduled date of the message (partition key to the `message` table) and the `MessageRef` and `EmailAddress` values (row key to the `message` table) values, plus a flag indicating whether the item is created after the worker role went down and restarted, for example:

      2012-10-15,634852858215726983,student1@contoso.edu,0

Worker role B uses these values to look up the row in the `message` table that contains all of the information needed to send the email. If the restart flag indicates a restart, worker B makes sure the email has not already been sent before sending it.

When traffic spikes, the Cloud Service can be reconfigured so that multiple instances of worker role B are instantiated, and each of them can independently pull work items off the queue.

### AzureMailSubscribeQueue ###

The `AzureMailSubscribeQueue` queue coordinates the sending of subscription confirmation emails.  In response to a service method call, the service method places a work item on the queue.  Worker role B pulls the work item from the queue and sends the subscription confirmation email. 

A queue work item contains the subscriber GUID.  This value uniquely identifies an email address and the list to subscribe it to, which is all that worker role B needs to send a confirmation email. As explained earlier, this requires a query on a field that is not in the `PartitionKey` or `RowKey`, which is inefficient. To make the application more scalable, the `mailinglist` table would have to be restructured to include the subscriber GUID in the `RowKey`.




<h2><a name="datadiagram"></a><span class="short-header">Data diagram</span>Azure Email Service data diagram</h2>

The following diagram shows the tables and queues and their relationships.

   ![Data diagram for Azure Email Service application][mtas-datadiagram]





<h2><a name="blobs"></a><span class="short-header">Blobs</span>Azure Blobs</h2>

Blobs are "binary large objects." The Azure Blob service provides a means for uploading and storing files in the cloud. For more information about Azure blobs, see the resources that are listed at the end of [the last tutorial in this series][tut5].

Azure Mail Service administrators put the body of an email in HTML form in an *.htm* file and in plain text in a *.txt* file. When they schedule an email, they upload these files in the **Create Message** web page, and the ASP.NET MVC controller for the page stores the uploaded file in an Azure blob.

Blobs are stored in blob containers, much like files are stored in folders. The Azure Mail Service application uses a single blob container, named **azuremailblobcontainer**.  The name of the blobs in the container is derived by concatenating the MessageRef value with the file extension, for example: 
634852858215726983.htm and 634852858215726983.txt.

Since both HTML and plain text messages are essentially strings, we could have designed the application to store the email message body in string properties in the `Message` table instead of in blobs. However, there is a 64K limit on the size of a property in a table row, so using a blob avoids that limitation on email body size. (64K is the maximum total size of the property; after allowing for encoding overhead, the maximum string size you can store in a property is actually closer to 48k.)




<h2><a name="wawsvswacs"></a><span class="short-header">Cloud Service vs. Web Site</span>Azure Cloud Service versus Azure Web Site</h2>

When you download the Azure Email Service, it is configured so that the front-end and back-end all run in a single Azure Cloud Service.

![Application architecture overview][mtas-architecture-overview]

An alternative architecture is to run the front-end in an Azure Web Site. 

![Alternative application architecture][mtas-alternative-architecture]

Keeping all components in a cloud service simplifies configuration and deployment. If you create the application with the ASP.NET MVC front end in an Azure Web Site, you will have two deployments, one to the Azure Web Site and one to the Azure Cloud Service. In addition, Azure Cloud Service web roles provide the following features that are unavailable in Azure Web Sites:

- Support for custom and wildcard certificates.
- Full control over how IIS is configured. Many IIS features cannot be enabled on Azure Web sites. With Azure web roles, you can define a startup command that runs the [AppCmd](http://www.iis.net/learn/get-started/getting-started-with-iis/getting-started-with-appcmdexe "appCmd")  program to modify IIS settings that cannot be configured in your *Web.config* file. For more information, see [How to Configure IIS Components in Azure](http://msdn.microsoft.com/en-us/library/windowsazure/gg433059.aspx)  and  [How to Block Specific IP Addresses from Accessing a Web Role
](http://msdn.microsoft.com/en-us/library/windowsazure/jj154098.aspx).
- Support for automatically scaling your web application by using the [Autoscaling Application Block][autoscalingappblock].
- The ability to run elevated startup scripts to install applications, modify registry settings, install performance counters, etc.
- Network isolation for use with [Azure Connect](http://msdn.microsoft.com/en-us/library/windowsazure/gg433122.aspx) and [Azure Virtual Network](http://msdn.microsoft.com/en-us/library/windowsazure/jj156007.aspx).
- Remote desktop access for debugging and advanced diagnostics.
- Rolling upgrades with [Virtual IP Swap](http://msdn.microsoft.com/en-us/library/windowsazure/ee517253.aspx "VIP swap"). This feature swaps the content of your staging and production deployments. 

The alternative architecture might offer some cost benefits, because an Azure Web Site might be less expensive for similar capacity compared to a web role running in a Cloud Service. Later tutorials in the series explain implementation details that differ between the two architectures.

For more information about how to choose between Azure Web Sites and Azure Cloud Services, see [Azure Execution Models](http://www.windowsazure.com/en-us/manage/windows/fundamentals/compute/).




<h2><a name="cost"></a><span class="short-header">Cost</span>Cost</h2>

This section provides a brief overview of costs for running the sample application in Azure, given rates in effect when the tutorial was published in December of 2012. Before making any business decisions based on costs, be sure to check current rates on the following web pages:

* [Azure Pricing Calculator](http://www.windowsazure.com/en-us/pricing/calculator/)
* [SendGrid Azure](http://sendgrid.com/windowsazure.html)

Costs are affected by the number of web and worker role instances you decide to maintain. In order to qualify for the [Azure Cloud Service 99.95% Service Level Agreement (SLA)](https://www.windowsazure.com/en-us/support/legal/sla/ "SLA"), you must deploy two or more instances of each role. One of the reasons you must run at least two role instances is because the virtual machines that run your application are restarted approximately twice per month for operating system upgrades. (For more information on OS Updates, see [Role Instance Restarts Due to OS Upgrades](http://blogs.msdn.com/b/kwill/archive/2012/09/19/role-instance-restarts-due-to-os-upgrades.aspx).) 

The work performed by the two worker roles in this sample is not time critical and so does not need the 99.5% SLA. Therefore, running a single instance of each worker role is feasible so long as one instance can keep up with the work load. The  web role instance is time sensitive, that is, users expect the web site to not have any down time, so a production application should have at least two instances of the web role.

The following table shows the costs for the default architecture for the Azure Email Service sample application assuming a minimal workload. The costs shown are based on using an extra small (shared) virtual machine size. The default virtual machine size when you create a Visual Studio cloud project is small, which is about six times more expensive than the extra small size.
  
<table border="1">

<tr bgcolor="lightgray">
<th>Component or Service</th>
<th>Rate</th>
<th>Cost per month</th>
</tr>

<tr>
<td>Web role</td>
<td>2 instances at $.02/hour for extra small instances</td>
<td>$29.00</td>
</tr>

<tr>
<td>Worker role A (schedules emails to be sent)</td>
<td>1 instance at $.02/hour for an extra small instance</td>
<td>$14.50
</td>
</tr>

<tr>
<td>Worker role B (sends emails)</td>
<td>1 instance at $.02/hour for an extra small instance</td>
<td>$14.50</td>
</tr>

<tr>
<td>Azure storage transactions</td>
<td>1 million transactions per month at $0.10/million (Each query counts as a transaction; worker role A continuously queries tables for messages that need to be sent. The application is also configured to write diagnostic data to Azure Storage, and each time it does that is a transaction.)</td>
<td>$0.10</td>
</tr>

<tr>
<td>Azure locally redundant storage</td>
<td>$2.33 for 25 GB (Includes storage for application tables and diagnostic data.)</td>
<td>$2.33</td>
</tr>

<tr>
<td>Bandwidth</td>
<td>5 GB egress is free</td>
<td>Free</td>
</tr>

<tr>
<td>SendGrid</td>
<td>Azure customers can send 25,000 emails per month for free</td>
<td>Free</td>
</tr>

<tr>
<td colspan="2">Total</td>
<td>$60.43</td>
</tr>

</table>

As you can see, role instances are a major component of the overall cost. Role instances incur a cost even if they are stopped; you must delete a role instance to not incur any charges. One cost saving approach would be to move all the code from worker role A and worker role B into one worker role. For these tutorials we deliberately chose to implement two worker instances in order to simplify scale out. The work that worker role B does is coordinated by the Azure Queue service, which means that you can scale out worker role B simply by increasing the number of role instances. (Worker role B is the limiting factor for high load conditions.) The work performed by worker role A is not coordinated by queues, therefore you cannot run multiple instances of worker role A. If the two worker roles were combined and you wanted to enable scale out, you would need to implement a mechanism for ensuring that worker role A tasks run in only one instance. (One such mechanism is provided by [CloudFx](http://nuget.org/packages/Microsoft.Experience.CloudFx "CloudFX"). See the [WorkerRole.cs sample](http://code.msdn.microsoft.com/windowsazure/CloudFx-Samples-60c3a852/sourcecode?fileId=57087&pathId=528472169).)

It is also possible to move all of the code from the two worker roles into the web role so that everything runs in the web role. However, performing background tasks in ASP.NET is not supported or considered robust, and this architecture would complicate scalability. For more information see [The Dangers of Implementing Recurring Background Tasks In ASP.NET](http://haacked.com/archive/2011/10/16/the-dangers-of-implementing-recurring-background-tasks-in-asp-net.aspx). See also [How to Combine a Worker and Web Role in Azure](http://www.31a2ba2a-b718-11dc-8314-0800200c9a66.com/2010/12/how-to-combine-worker-and-web-role-in.html) and [Combining Multiple Azure Worker Roles into an Azure Web Role](http://www.31a2ba2a-b718-11dc-8314-0800200c9a66.com/2012/02/combining-multiple-azure-worker-roles.html).


Another architecture alternative that would reduce cost is to use the [Autoscaling Application Block][autoscalingappblock] to automatically deploy worker roles only during scheduled periods, and delete them when work is completed. For more information on autoscaling, see the links at the end of [the last tutorial in this series][tut5].

Azure in the future might provide a notification mechanism for scheduled reboots, which would allow you to only spin up an extra web role instance for the reboot time window. You wouldn't qualify for the 99.95 SLA, but you could reduce your costs by almost half and ensure your web application remains available during the reboot interval.


<h2><a name="auth"></a><span class="short-header">Authentication and Authorization</span>Authentication and Authorization</h2>

In a production application you would implement an authentication and authorization mechanism like the ASP.NET membership system for the ASP.NET MVC web front-end, including the ASP.NET Web API service method. There are also other options, such as using a shared secret, for securing the Web API service method. Authentication and authorization functionality has been omitted from the sample application to keep it simple to set up and deploy. (The second tutorial in the series shows how to implement IP restrictions so that unauthorized persons can't use the application when you deploy it to the cloud.) 

For more information about how to implement authentication and authorization in an ASP.NET MVC web project, see the following resources:

* [Authentication and Authorization in ASP.NET Web API](http://www.asp.net/web-api/overview/security/authentication-and-authorization/authentication-and-authorization-in-aspnet-web-api)
* [Music Store Part 7: Membership and Authorization](http://www.asp.net/mvc/tutorials/mvc-music-store/mvc-music-store-part-7)

**Note**: We planned to include a mechanism for securing the Web API service method by using a shared secret, but that was not completed in time for the initial release. Therefore the third tutorial does not show how to build the Web API controller for the subscription process. We hope to include instructions for implementing a secure subscription process in the next version of this tutorial. Until then, you can test the application by using the administrator web pages to subscribe email addresses to lists.




<h2><a name="nextsteps"></a><span class="short-header">Next steps</span>Next steps</h2>

In the [next tutorial][tut2], you'll download the sample project, configure your development environment, configure the project for your environment, and test the project locally and in the cloud.  In the following tutorials you'll see how to build the project from scratch.

For links to additional resources for working with Azure Storage tables, queues, and blobs, see [the last tutorial in this series][tut5nextsteps].

<div><a href="/en-us/develop/net/tutorials/multi-tier-web-site/2-download-and-run/" class="site-arrowboxcta download-cta">Tutorial 2</a></div>

[tut2]: /en-us/develop/net/tutorials/multi-tier-web-site/2-download-and-run/
[tut3]: /en-us/develop/net/tutorials/multi-tier-web-site/3-web-role/
[tut4]: /en-us/develop/net/tutorials/multi-tier-web-site/4-worker-role-a/
[tut5]: /en-us/develop/net/tutorials/multi-tier-web-site/5-worker-role-b/
[tut5nextsteps]: /en-us/develop/net/tutorials/multi-tier-web-site/5-worker-role-b/#nextsteps
[autoscalingappblock]: /en-us/develop/net/how-to-guides/autoscaling/




[mtas-architecture-overview]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-overview/mtas-architecture-overview.png
[mtas-alternative-architecture]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-overview/mtas-alternative-architecture.png
[mtas-mailing-list-index-page]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-overview/mtas-mailing-list-index-page.png
[mtas-subscribers-index-page]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-overview/mtas-subscribers-index-page.png
[mtas-message-index-page]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-overview/mtas-message-index-page.png
[mtas-message-create-page]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-overview/mtas-message-create-page.png
[mtas-subscribe-confirmation-page]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-overview/mtas-subscribe-confirmation-page.png
[mtas-unsubscribe-query-page]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-overview/mtas-unsubscribe-query-page.png
[mtas-unsubscribe-confirmation-page]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-overview/mtas-unsubscribe-confirmation-page.png
[mtas-worker-roles-a-and-b]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-overview/mtas-worker-roles-a-and-b.png
[mtas-message-processing]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-overview/mtas-message-processing.png
[mtas-subscribe-email]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-overview/mtas-subscribe-email.png
[mtas-subscribe-diagram]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-overview/mtas-subscribe-diagram.png
[mtas-datadiagram]: ./media/cloud-services-dotnet-multi-tier-app-storage-1-overview/mtas-datadiagram.png

