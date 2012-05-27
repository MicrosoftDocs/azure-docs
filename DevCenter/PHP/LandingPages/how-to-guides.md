# PHP Developer Center - How To Guides #

## Data Management and Integration ##

### [Blob Service](/en-us/develop/php/how-to-guides/blob-storage/ "Blob Service") ###
Blobs are the simplest way to store large amounts of unstructured text or binary data such as video, audio and images. The Windows Azure Blob Service is an ISO 27001 certified managed service that can auto-scale to meet massive volume demands (up to 100 terabytes per container), and is accessible from virtually anywhere via REST and managed API’s. This guide will show you how to use the [PHP Client Libraries for Windows Azure][client-libs] to perform common scenarios, such as **uploading**, **listing**, **downloading**, and **deleting** blobs.

### [Table Service](/en-us/develop/php/how-to-guides/table-storage/ "Table Service") ###
Tables offer NoSQL capabilities for applications that require storage of large amounts of loosely structured data. The Windows Azure Table Service is an ISO 27001 certified managed service that can auto scale to meet massive volume demands (upto 100 terabytes per table), and is accessible from virtually anywhere via REST and managed API’s. This guide will show you how to use the [PHP Client Libraries for Windows Azure][client-libs] to perform common scenarios, such as **creating and deleting tables**, and **inserting**, **querying**, and **deleting entities** in a table.

### [Queue Service](/en-us/develop/php/how-to-guides/queue-storage/ "Queue Service") ###
Queues feature a simple REST-based Get/Put/Peek interface, providing reliable, persistent messaging within and between services. The Windows Azure Queue Service is an ISO 27001 certified managed service that can auto scale to meet massive volume demands (upto 100 terabytes per queue), and is accessible from virtually anywhere via REST and managed API’s. This guide will show you how to use the [PHP Client Libraries for Windows Azure][client-libs] to perform common scenarios, such as **creating and deleting queues**, and **inserting**, **peeking**, **getting**, and **deleting queue messages**.

### [Service Bus Queues](/en-us/develop/php/how-to-guides/service-bus-queues/ "Service Bus Queues") ###
Service Bus Queues offer simple first in, first out guaranteed message delivery and supports a range of standard protocols (REST, AMQP, WS*) and API’s to put/pull messages on/off a queue. This guide will show you how to use the [Windows Azure SDK for PHP][download-sdk] to perform common scenarios, such as **creating queues**, **sending and receiving
messages**, and **deleting queues**.

### [Service Bus Topics](/en-us/develop/net/how-to-guides/service-bus-topics/ "Service Bus Topics") ###
Service Bus Topics deliver messages to multiple subscriptions and easily fan out message delivery at scale to downstream systems. This guide will show you how to use the [PHP Client Libraries for Windows Azure][client-libs] to perform common scenarios, such as **creating topics and subscriptions**, **creating subscription filters**, **sending messages to a topic**, **receiving messages from a subscription**, and **deleting topics and subscriptions**.

### [SQL Database](/en-us/develop/php/how-to-guides/sql-azure/ "SQL Database") ###
For applications that need a full featured relational database-as-a-service, Windows Azure offers SQL Database, formerly known as SQL Azure Database. SQL Database offers a high-level of interoperability, enabling customers to build applications using many of the major development frameworks. This guide will show you the basics of using SQL Database from PHP. The samples are written in PHP, and the scenarios covered include **creating a server**, **creating a database**, and **connecting to a database**.

## Service Management ##

### [PowerShell for Windows Azure](/en-us/develop/php/how-to-guides/powershell-cmdlets/ "PowerShell for Windows Azure") ###
PowerShell for Windows Azure provides a command-line environment for developing and deploying applications for Windows Azure through a few Windows PowerShell cmdlets. This guide describes how to use Windows PowerShell cmdlets to create, test, deploy, and manage Windows Azure Services. The scenarios covered include **importing your publishing settings**, **creating Windows Azure services to host applications**, **running a service in the Windows Azure compute emulator**, **deploying and updating a cloud service**, **setting deployment options for a service**, and **stopping, starting, and removing a service**.

### [Command-Line Tools for Mac and Linux](/develop/php/how-to-guides/command-line-tools/ "Command-Line Tools for Mac and Linux") ###
The Windows Azure Command-Line Tools for Mac and Linux are a set of command-line tools for deploying and managing Windows Azure services. This guide describes how to use the Windows Azure Command-Line Tools for Mac and Linux to create and manage services in Windows Azure. The scenarios covered include **installing the tools**, **importing your publishing settings**, **creating and managing Windows Azure Websites**, and **creating and managing Windows Azure Virtual Machines**.

## Additional Guides ##

### [SendGrid Email Service](/en-us/develop/php/how-to-guides/sendgrid-email-service/ "SendGrid Email Service") ###
SendGrid is a cloud-based email service that provides reliable email delivery, scalability, and real-time analytics along with flexible APIs that make custom integration easy.This guide demonstrates how to perform common programming tasks with the SendGrid email service on Windows Azure. The samples are written in PHP and the scenarios covered include **constructing email**, **sending email**, and **adding attachments**.

### [Twilio](/en-us/develop/php/how-to-guides/twilio-voice-and-sms-service/ "Twilio") ###
Twilio is a telephony web-service API that lets you use your existing web languages and skills to build voice and SMS applications. **Twilio Voice** allows your applications to make and receive phone calls. **Twilio SMS** allows your applications to make and receive SMS messages. **Twilio Client** allows your applications to enable voice communication using existing Internet connections, including mobile connections. This guide will show you how to use the [Twilio library for PHP][twilio_php] to perform common scenarios, such as **making outgoing calls**, **sending SMS messages**, and **providing responses from your own website**.

[client-libs]: http://go.microsoft.com/fwlink/?LinkId=252719
[twilio_php]: https://github.com/twilio/twilio-php