---
title: include file
description: include file
services: service-bus-messaging
author: axisc
ms.service: service-bus-messaging
ms.topic: include
ms.date: 09/28/2021
ms.author: aschhab
ms.custom: "include file"
---

The following table lists the Java Message Service (JMS) features that Azure Service Bus currently supports. It also shows features that are unsupported.


| Feature | API |Status |
|---|---|---|
| Queues   | <ul> <li> JMSContext.createQueue( String queueName) </li> </ul>| **Supported** |
| Topics   | <ul> <li> JMSContext.createTopic( String topicName) </li> </ul>| **Supported** |
| Temporary queues |<ul> <li> JMSContext.createTemporaryQueue() </li> </ul>| **Supported** |
| Temporary topics |<ul> <li> JMSContext.createTemporaryTopic() </li> </ul>| **Supported** |
| Message Producer /<br/> JMSProducer |<ul> <li> JMSContext.createProducer() </li> </ul>| **Supported** |
| Queue browsers |<ul> <li> JMSContext.createBrowser(Queue queue) </li> <li> JMSContext.createBrowser(Queue queue, String messageSelector) </li> </ul> | **Supported** |
| Message Consumer/ <br/> JMSConsumer | <ul> <li> JMSContext.createConsumer( Destination destination) </li> <li> JMSContext.createConsumer( Destination destination, String messageSelector) </li> <li> JMSContext.createConsumer( Destination destination, String messageSelector, boolean noLocal)</li> </ul>  <br/> noLocal is currently not supported | **Supported** |
| Shared durable subscriptions | <ul> <li> JMSContext.createSharedDurableConsumer(Topic topic, String name) </li> <li> JMSContext.createSharedDurableConsumer(Topic topic, String name, String messageSelector) </li> </ul>| **Supported**|
| Unshared durable subscriptions | <ul> <li> JMSContext.createDurableConsumer(Topic topic, String name) </li> <li> createDurableConsumer(Topic topic, String name, String messageSelector, boolean noLocal) </li> </ul> <br/> noLocal is currently not supported and should be set to false | **Supported** |
| Shared non-durable subscriptions |<ul> <li> JMSContext.createSharedConsumer(Topic topic, String sharedSubscriptionName) </li> <li> JMSContext.createSharedConsumer(Topic topic, String sharedSubscriptionName, String messageSelector) </li> </ul> | **Supported** |
| Unshared non-durable subscriptions |<ul> <li> JMSContext.createConsumer(Destination destination) </li> <li> JMSContext.createConsumer( Destination destination, String messageSelector) </li> <li> JMSContext.createConsumer( Destination destination, String messageSelector, boolean noLocal) </li> </ul> <br/> noLocal is currently not supported and should be set to false | **Supported** |
| Message selectors | depends on the consumer created | **Supported** |
| Delivery Delay (scheduled messages) | <ul> <li> JMSProducer.setDeliveryDelay( long deliveryDelay) </li> </ul>|**Supported**|
| Message created |<ul> <li> JMSContext.createMessage() </li> <li> JMSContext.createBytesMessage() </li> <li> JMSContext.createMapMessage() </li> <li> JMSContext.createObjectMessage( Serializable object) </li> <li> JMSContext.createStreamMessage() </li> <li> JMSContext.createTextMessage() </li> <li> JMSContext.createTextMessage( String text) </li> </ul>| **Supported** |
| Cross entity transactions |<ul> <li> Connection.createSession(true, Session.SESSION_TRANSACTED) </li> </ul> | **Supported** |
| Distributed transactions || Not supported |
