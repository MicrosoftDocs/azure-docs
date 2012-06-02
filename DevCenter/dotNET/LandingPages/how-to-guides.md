# .NET Developer Center - How To Guides #

## Data storage and management ##

### [Blob Service](/en-us/develop/net/how-to-guides/blob-storage/ "Blob Service") ###
Blobs are the simplest way to store large amounts of unstructured text or binary data such as video, audio and images. Blobs are an ISO 27001 certified managed service that can auto-scale to store up to 100 terabytes of data. They are accessible from virtually anywhere via REST and client APIs.

### [Table Service](/en-us/develop/net/how-to-guides/table-services/ "Table Service") ###
Tables offer NoSQL capabilities for applications that require storage of large amounts of unstructured data. Tables are an ISO 27001 certified managed service that can auto-scale to store up to 100 terabytes of data. They are accessible from virtually anywhere via REST and managed APIs.

### [SQL Database](/en-us/develop/net/how-to-guides/sql-azure/ "SQL Database") ###
For applications that need a full featured relational database-as-a-service, Windows Azure offers SQL Database, formerly known as SQL Azure Database. SQL Database offers a high-level of interoperability, enabling customers to build applications using many of the major development frameworks.

### [SQL Reporting](/en-us/develop/net/how-to-guides/sql-reporting/) ###

SQL Reporting provides many of the features you know from SQL Server Reporting to create reports with tables, charts, maps, gauges, and more and deploy them on both private and public clouds. You can export reports to various popular file formats including Excel, Word, HTML, PDF, XML, CSV, and ATOM feeds.

### [Hadoop](/en-us/develop/net/how-to-guides/hadoop/) ###

The [Apache Hadoop software library](http://hadoop.apache.org/) is a framework that allows for the distributed processing of large data sets across clusters of computers by using a simple programming model. To simplify configuring and running Hadoop jobs and interacting with the deployed clusters, Hadoop on Windows Azure provides JavaScript and Hive consoles. It also provides Open Database Connectivity (ODBC) drivers to integrate Business Intelligence (BI) tools such as Excel, SQL Server Analysis Services, and Reporting Services.

## Messaging and integration ##

### [Service Bus Queues](/en-us/develop/net/how-to-guides/service-bus-queues/ "Service Bus Queues") ###
Service Bus Queues offer simple first in, first out guaranteed message delivery and support a range of standard protocols (REST, AMQP, WS*) and APIs to put and pull messages on and off a queue.

### [Service Bus Topics](/en-us/develop/net/how-to-guides/service-bus-topics/ "Service Bus Topics") ###
Service Bus Topics provide a publish/subscribe messaging model to support one-to-many communication. You can optionally register filter rules for a topic on a per-subscription basis, which allows you to restrict which messages to a topic are received by which topic subscriptions.

### [Queue Service](/en-us/develop/net/how-to-guides/queue-service/ "Queue Service") ###
Windows Azure Queues store large numbers of messages that can be accessed from anywhere in the world via authenticated calls using HTTP or HTTPS. Common uses of Queue storage include creating a backlog of work to process asynchronously, and passing messages from a Windows Azure Web role to a Windows Azure Worker role.

### [Service Bus Relay](/en-us/develop/net/how-to-guides/service-bus-relay/ "Service Bus Relay") ###
Service Bus Relay solves the challenges of communicating between on-premises applications and the outside world by allowing on-premises web services to project public endpoints. Systems can then access these web services, which continue to run on-premises from anywhere on the planet.

## Additional guides ##

### [Caching](/en-us/develop/net/how-to-guides/cache/) ###

Caching increases performance by temporarily storing information from other backend sources, and can reduce the costs associated with database transactions in the cloud. Choose between two deployment options: Windows Azure Caching is a dedicated system you can deploy along with your application; Shared Caching is a fully managed service.

### [Access Control](/en-us/develop/net/how-to-guides/access-control/) ###

Access Control is a Windows Azure service that provides an easy way of authenticating users who need to access your web applications and services, without having to factor complex authentication logic into your code. It provides integration with Windows Identity Foundation (WIF), support for popular web identity providers including Windows Live ID, Google, Yahoo, and Facebook, and support for ADFS 2.0.

### [Diagnostics](/en-us/develop/net/common-tasks/diagnostics/) ###

Windows Azure Diagnostics enables you to collect diagnostic data from an application running in Windows Azure. You can use diagnostic data for debugging and troubleshooting, measuring performance, monitoring resource usage, traffic analysis and capacity planning, and auditing.

### [Autoscaling](/en-us/develop/net/how-to-guides/autoscaling/) ###
The Autoscaling Application Block from the Microsoft Enterprise Library 5.0 Integration Pack for Windows Azure provides tools that let you automatically scale your cloud service. You can use performance counters to understand your app's performance, and then write rules that will automatically scale your app to adjust for specified targets and thresholds.

### [Media Services](/en-us/develop/net/how-to-guides/media-services/) ###

Windows Azure Media Services provides an extensible media platform on Windows Azure. Media Services components can be used to accomplish tasks including uploading, storing, encoding and streaming content.  You can leverage the system end-to-end or integrate individual components with your existing tools and processes.

### [SendGrid Email Service](/en-us/develop/net/how-to-guides/sendgrid-email-service/) ###

Windows Azure applications can use SendGrid to include email functionality.  SendGrid provides reliable email delivery,  real-time analytics, and flexible APIs that allow users to easily incorporate the service into their Windows Azure applications.

### [Twilio](/en-us/develop/net/how-to-guides/twilio/) ###

Windows Azure applications can use Twilio to incorporate phone call and Short Message Service (SMS) message functionality.  Use the Twilio APIs to make and receive phone calls, make and receive SMS messages, and enable voice communication using existing internet connections, including mobile connections.

