<properties linkid="devnav-php-howto" urlDisplayName="How To Guides" pageTitle="Windows Azure PHP feature guides" metaKeywords="Azure PHP" metaDescription="Find topics about using Windows Azure services and features in PHP." metaCanonical="" disqusComments="0" umbracoNaviHide="0" />


# PHP Developer Center - How To Guides #
## Data management and integration ##

### [Blob Service](/en-us/develop/php/how-to-guides/blob-service/ "Blob Service") ###
Blobs are the simplest way to store large amounts of unstructured text or binary data such as video, audio and images. Blobs are an ISO 27001 certified managed service that can auto-scale to store up to 100 terabytes of data. They are accessible from virtually anywhere via REST and client APIs.

### [Table Service](/en-us/develop/php/how-to-guides/table-service/ "Table Service") ###
Tables offer NoSQL capabilities for applications that require storage of large amounts of unstructured data. Tables are an ISO 27001 certified managed service that can auto-scale to store up to 100 terabytes of data. They are accessible from virtually anywhere via REST and managed APIs.

### [Queue Service](/en-us/develop/php/how-to-guides/queue-service/ "Queue Service") ###
Service Bus Queues offer simple first in, first out guaranteed message delivery and support a range of standard protocols (REST, AMQP, WS*) and APIs to put and pull messages on and off a queue.

### [SQL Database](/en-us/develop/php/how-to-guides/sql-database/ "SQL Database") ###
For applications that need a full featured relational database-as-a-service, Windows Azure offers SQL Database, formerly known as SQL Azure Database. SQL Database offers a high-level of interoperability, enabling customers to build applications using many of the major development frameworks.

### [Service Bus Queues]
Service Bus Queues offer simple first in, first out guaranteed message delivery and support a range of standard protocols (REST, AMQP, WS*) and APIs to put and pull messages on and off a queue.

### [Service Bus Topics]
Service Bus Topics provide a publish/subscribe messaging model to support one-to-many communication. You can optionally register filter rules for a topic on a per-subscription basis, which allows you to restrict which messages to a topic are received by which topic subscriptions.

## Service management ##

### [PowerShell for Windows Azure](/en-us/develop/php/how-to-guides/powershell-cmdlets/ "PowerShell for Windows Azure") ###
PowerShell for Windows Azure provides a command-line environment for developing and deploying applications for Windows Azure through a  Windows PowerShell cmdlets. This guide describes how to use Windows PowerShell cmdlets to create, test, deploy, and manage Windows Azure Services. 

### [Command-Line Tools for Mac and Linux](/en-us/develop/php/how-to-guides/command-line-tools/ "Command-Line Tools for Mac and Linux") ###
The Windows Azure Command-Line Tools for Mac and Linux are a set of command-line tools for deploying and managing Windows Azure services. Use the command-line tools to create and manage web sites and virtual machines in Windows Azure.

### [Service Management]
The Service Management API is a REST API that provides programmatic access to much of the service management functionality available through the Windows Azure management portal. All API operations are performed over SSL and mutually authenticated using X.509 v3 certificates. The management service may be accessed from within a service running in Windows Azure, or directly over the Internet from any application that can send an HTTPS request and receive an HTTPS response.

## Additional guides ##

### [SendGrid Email Service](/en-us/develop/php/how-to-guides/sendgrid-email-service/ "SendGrid Email Service") ###
Windows Azure applications can use SendGrid to include email functionality.  SendGrid provides reliable email delivery,  real-time analytics, and flexible APIs that allow users to easily incorporate the service into their Windows Azure applications.

### [Twilio](/en-us/develop/php/how-to-guides/twilio-voice-and-sms-service/ "Twilio") ###
Windows Azure applications can use Twilio to incorporate phone call and Short Message Service (SMS) message functionality.  Use the Twilio APIs to make and receive phone calls, make and receive SMS messages, and enable voice communication using existing internet connections, including mobile connections.

### [Single sign-on with Windows Azure Active Directory]
You can use web single sign-on (also called identity federation) to provide single sign-on access through a federated mechanism that relies on a Security Token Service (STS).  This guide shows you how to accomplish this using the STS in your Office 365 tenant provided by Windows Azure Active Directory.

[client-libs]: http://go.microsoft.com/fwlink/?LinkId=252719
[twilio_php]: https://github.com/twilio/twilio-php
[Blob Service]: /en-us/develop/nodejs/how-to-guides/blob-storage/
[Service Bus Queues]: /en-us/develop/php/how-to-guides/service-bus-queues/
[Service Bus Topics]: /en-us/develop/php/how-to-guides/service-bus-topics/
[Single sign-on with Windows Azure Active Directory]: /en-us/develop/php/how-to-guides/web-sso/
[Service Management]: /en-us/develop/how-to-guides/service-management/