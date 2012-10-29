# Java Developer Center - How To Guides

## Data management and integration

### [Blob Service][blob_service]

Blobs are the simplest way to store large amounts of unstructured text or binary data such as video, audio and images. Blobs are an ISO 27001 certified managed service that can auto-scale to store up to 100 terabytes of data. They are accessible from virtually anywhere via REST and client APIs.

### [Service Bus Queues][service_bus_queues]

Service Bus Queues offer simple first in, first out guaranteed message delivery and support a range of standard protocols (REST, AMQP, WS*) and APIs to put and pull messages on and off a queue.

### [Service Bus Topics][service_bus_topics]

Service Bus Topics provide a publish/subscribe messaging model to support one-to-many communication. You can optionally register filter rules for a topic on a per-subscription basis, which allows you to restrict which messages to a topic are received by which topic subscriptions.

### [Service Bus AMQP][service_bus_amqp]

The Advanced Message Queuing Protocol (AMQP) 1.0 is an efficient, reliable, wire-level messaging protocol that can be used to build robust, cross-platform, messaging applications. This How-To Guide explains how to use the Service Bus brokered messaging features (queues and publish/subscribe topics) from Java applications using the popular Java Message Service (JMS) API standard. For a complete overview of AMQP support in Windows Azure, see [AMQP 1.0 support in Windows Azure Service Bus][service_bus_amqp_overview].


### [Queue Service][queue_service]

Windows Azure Queues store large numbers of messages that can be accessed from anywhere in the world via authenticated calls using HTTP or HTTPS. Common uses of Queue storage include creating a backlog of work to process asynchronously, and passing messages from a Windows Azure Web role to a Windows Azure Worker role.

### [Table Service][table_service]
Tables offer NoSQL capabilities for applications that require storage of large amounts of unstructured data. Tables are an ISO 27001 certified managed service that can auto-scale to store up to 100 terabytes of data. They are accessible from virtually anywhere via REST and managed APIs.

### [SQL Database][sql_database]

For applications that need a full featured relational database-as-a-service, Windows Azure offers SQL Database, formerly known as SQL Azure Database. SQL Database offers a high-level of interoperability, enabling customers to build applications using many of the major development frameworks.

## Security

### [Access Control][access_control]
Access Control is a Windows Azure service that provides an easy way of authenticating users who need to access your web applications and services, without having to factor complex authentication logic into your code. It provides integration with Windows Identity Foundation (WIF), support for popular web identity providers including Windows Live ID, Google, Yahoo, and Facebook, and support for ADFS 2.0.

### [Viewing SAML returned by Access Control][access_control_view_saml]
The Access Control Service returns Security Assertion Markup Language (SAML) to your application when the user successfully logs on.

### [Single sign-on with Windows Azure Active Directory][Single sign-on with Windows Azure Active Directory]
You can use web single sign-on (also called identity federation) to provide single sign-on access through a federated mechanism that relies on a Security Token Service (STS).  This guide shows you how to accomplish this using the STS in your Office 365 tenant provided by Windows Azure Active Directory.

## Additional guides

### [Service Runtime][service_runtime]

The Windows Azure Service Runtime allows your hosted service to communicate with the Windows Azure environment.

### [SendGrid Email Service][sendgrid]

Windows Azure applications can use SendGrid to include email functionality.  SendGrid provides reliable email delivery,  real-time analytics, and flexible APIs that allow users to easily incorporate the service into their Windows Azure applications.

### [Twilio Voice and SMS Service][twilio]

Windows Azure applications can use Twilio to incorporate phone call and Short Message Service (SMS) message functionality.  Use the Twilio APIs to make and receive phone calls, make and receive SMS messages, and enable voice communication using existing internet connections, including mobile connections.

[blob_service]: ../howto/blob-storage.md
[service_bus_queues]: ../howto/service-bus-queues.md
[service_bus_topics]: ../howto/service-bus-topics.md
[service_bus_amqp]: ../howto/service-bus-amqp.md
[service_bus_amqp_overview]: ../howto/service-bus-amqp-overview.md
[queue_service]: ../howto/queue-storage.md
[table_service]: ../howto/table-storage.md
[sql_database]: ../howto/using_sql_azure_in_java.md
[service_runtime]: http://msdn.microsoft.com/en-us/library/windowsazure/hh690948.aspx
[sendgrid]: ../howto/sendgrid-email-service.md
[twilio]: ../howto/twilio_in_java.md
[access_control]: ../howto/howto-acs-java.md
[access_control_view_saml]: ../howto/howto-acs-display-saml-java.md
[Single sign-on with Windows Azure Active Directory]: /en-us/develop/java/how-to-guides/web-sso/
