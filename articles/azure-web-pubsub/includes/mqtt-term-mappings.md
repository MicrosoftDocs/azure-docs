---
author: Y-Sindo
ms.author: zityang
ms.service: azure-web-pubsub
ms.topic: include
ms.date: 07/19/2024
---

| MQTT terms| Corresponding Web PubSub terms | Relationship |
| --- | --- | --- |
| Server/MQTT Broker | Web PubSub Service  |  Web PubSub service work as MQTT brokers to serve MQTT connections. Please note that we usually use the term *server* to refer to the upstream server instead of the MQTT brokers in the documents. |
| Session | Connection  | *Connection* in Web PubSub is a logical concept that represents a stateful relationship between the client and service, and one *Connection* is corresponding to one *Session*. Usually these two words are interchangeable.  |
| Subscribe To A Topic | Join A Group | These two actions have the same effect: the client will receive messages from that topic or group. Topic name is the group name.  |
| Publish Message To A Topic | Send Message To A Group |  These two actions have the same effect: the client who subscribes to that topic or belong to that group will receive the message |
| Client ID | Connection ID | *Connection ID* identifies a *Connection* to Web PubSub. We use the *Client ID* as the *Connection ID* of MQTT connections in Web PubSub. |