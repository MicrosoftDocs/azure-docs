# Python Developer Center - How To Guides

## Data management and integration

### [Blob Service]
Blobs are the simplest way to store large amounts of unstructured text or binary data such as video, audio and images. Blobs are an ISO 27001 certified managed service that can auto-scale to store up to 100 terabytes of data. They are accessible from virtually anywhere via REST and client APIs.


### [Table Service]
Tables offer NoSQL capabilities for applications that require storage of large amounts of unstructured data. Tables are an ISO 27001 certified managed service that can auto-scale to store up to 100 terabytes of data. They are accessible from virtually anywhere via REST and managed APIs.

### [Queue Service]
Windows Azure Queues store large numbers of messages that can be accessed from anywhere in the world via authenticated calls using HTTP or HTTPS. Common uses of Queue storage include creating a backlog of work to process asynchronously, and passing messages from a Windows Azure Web role to a Windows Azure Worker role.

### [Service Bus Queues]
Service Bus Queues offer simple first in, first out guaranteed message delivery and support a range of standard protocols (REST, AMQP, WS*) and APIs to put and pull messages on and off a queue.

### [Service Bus Topics]
Service Bus Topics provide a publish/subscribe messaging model to support one-to-many communication. You can optionally register filter rules for a topic on a per-subscription basis, which allows you to restrict which messages to a topic are received by which topic subscriptions.

## Service management ##

<!--### [PowerShell for Windows Azure]
PowerShell for Windows Azure provides a command-line environment for developing and deploying applications for Windows Azure through a  Windows PowerShell cmdlets. This guide describes how to use Windows PowerShell cmdlets to create, test, deploy, and manage Windows Azure Services. -->

### [Command-Line Tools for Mac and Linux](/develop/python/how-to-guides/command-line-tools/ "Command-Line Tools for Mac and Linux")
The Windows Azure Command-Line Tools for Mac and Linux are a set of command-line tools for deploying and managing Windows Azure services. Use the command-line tools to create and manage websites and virtual machines in Windows Azure. 

[PowerShell for Windows Azure]: ../howto/powershell.md
[Command-Line Tools for Mac and Linux]: ../howto/crossplat-cmd-tools.md
[Blob Service]: ../howto/blob-storage.md
[Service Bus Queues]: ../howto/service-bus-queues.md
[Service Bus Topics]: ../howto/service-bus-topics.md
[Service Bus Relay]: ../howto/service-bus-relay.md
[Queue Service]: ../howto/queue-service.md
[Table Service]: ../howto/table-services.md