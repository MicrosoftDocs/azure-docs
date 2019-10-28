---
 author: tomarchermsft
 ms.service: ansible
 ms.topic: include
 ms.date: 04/22/2019
 ms.author: tarcher
---

[Azure Service Bus](/azure/service-bus-messaging/service-bus-messaging-overview) is an enterprise [integration](https://azure.microsoft.com/product-categories/integration/) message broker. Service bus supports two types of communication: queues and topics. 

Queues support asynchronous communications between applications. An app sends messages to a queue, which stores the messages. The receiving application then connects to and reads the messages from the queue.

Topics support the publish-subscribe pattern, which enables a one-to-many relationship between the message originator and the messager receiver(s).