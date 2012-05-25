# Java Developer Center - How To Guides

## Data Management and Integration

### [Blob Service][blob_service]

Blobs are the simplest way to store large amounts of unstructured text or binary data such as video, audio and images. Blobs are an ISO 27001 certified managed service can auto-scale to meet massive volume of up to 100 terabytes and throughput and accessible from virtually anywhere via REST and managed API’s.

### [Service Bus Queues][service_bus_queues]

Service Bus Queues offer simple first in, first out guaranteed message delivery and supports a range of standard protocols (REST, AMQP, WS*) and API’s to put/pull messages on/off a queue.

### [Service Bus Topics][service_bus_topics]

Service Bus Topics deliver messages to multiple subscriptions and easily fan out message delivery at scale to downstream systems.

### [Queue Service][queue_service]

Queue storage is a service for storing large numbers of messages that can be accessed from anywhere in the world via authenticated calls using HTTP or HTTPS. Common uses of Queue storage include creating a backlog of work to process asynchronously, and passing messages from a Windows Azure Web role to a Windows Azure Worker role

### [Table Service][table_service]

Tables offer NoSQL capabilities for applications that require storage of large amounts of unstructured data. Tables are an ISO 27001 certified managed service which can auto scale to meet massive volume of up to 100 terabytes and throughput and accessible from virtually anywhere via REST and managed API’s.

### [SQL Database][sql_database]

For applications that need a full featured relational database-as-a-service, Windows Azure offers SQL Database, formerly known as SQL Azure Database. SQL Database offers a high-level of interoperability, enabling customers to build applications using many of the major development frameworks.

## Additional Guides

### [Service Runtime][service_runtime]

The Windows Azure Service Runtime allows your hosted service to communicate with the Windows Azure environment.

### [SendGrid Email Service][sendgrid]

Windows Azure applications can use SendGrid to include email functionality.

### [Twilio Voice and SMS Service][twilio]

Windows Azure applications can use Twilio to incorporate phone call and Short Message Service (SMS) message functionality.

[blob_service]: ..\howto\blob-storage.md
[service_bus_queues]: ..\howto\service-bus-queues.md
[service_bus_topics]: ..\howto\service-bus-topics.md
[queue_service]: ..\howto\queue-storage.md
[table_service]: ..\howto\table-storage.md
[sql_database]: ..\howto\using_sql_azure_in_java.md
[service_runtime]: http://msdn.microsoft.com/en-us/library/windowsazure/hh690948.aspx
[sendgrid]: ..\howto\sendgrid-email-service.md
[twilio]: ..\howto\twilio_in_java.md
