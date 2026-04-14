---
title: Highly available edge applications for Azure IoT Operations
description: Learn how to develop highly available edge applications that work with Azure IoT Operations.
author: dominicbetts
ms.subservice: azure-mqtt-broker
ms.author: dobett
ms.topic: concept-article
ms.date: 4/17/2025

#CustomerIntent: As a developer, I want understand how to develop highly available edge applications for my Azure IoT Operations solution.

---

# Highly available edge applications for Azure IoT Operations

Creating a highly available application using MQTT broker involves careful consideration of session types, quality of service (QoS), message acknowledgments, parallel message processing, message retention, and shared subscriptions. MQTT broker features a distributed, in-memory message broker and store that provides message retention and built-in state management with MQTT semantics.

The following sections explain the settings and features that contribute to a robust, zero message loss, and distributed application.

## Quality of service (QoS)

Both publishers and subscribers should use [QoS-1](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html#_Toc3901236) to guarantee message delivery at least once. The MQTT broker stores and retransmits messages until it receives an acknowledgment (ACK) from the recipient, ensuring no messages are lost during transmission.

## Session type and Clean-Session flag

To ensure zero message loss, set the [clean-start](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html#_Toc3901039) flag to false when connecting to the MQTT broker. This setting informs the broker to maintain the session state for the client, preserving subscriptions and unacknowledged messages between connections. If the client disconnects and later reconnects, it resumes from where it left off, receiving any unacknowledged QoS-1 messages through [message delivery retry](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html#_Toc3901238). If configured, MQTT broker expires the client session if the client doesn't reconnect within the *Session Expiry Interval* The default is one day.

## Receive-Max in multithreaded applications

Multithreaded applications should use [receive-max](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html#_Toc3901049) (65,535 max) to process messages in parallel and apply flow control. This setting optimizes message processing by allowing multiple threads to work on messages concurrently and without the broker overloading the application with a high message rate above the application capacity. Each thread can process a message independently and send its acknowledgment upon completion. A typical practice is to configure *max-receive* proportionally to the number of threads that the application uses.

## Acknowledging messages

When a subscriber application sends an acknowledgment for a QoS-1 message, it takes ownership of the message. Upon receiving acknowledgment for a QoS-1 message, MQTT broker stops tracking the message for that application and topic. Proper transfer of ownership ensures message preservation in case of processing issues or application crashes. If an application wants to protect it from application crashes, then the application shouldn't take ownership before successfully completing its processing on that message. Applications subscribing to MQTT broker should delay acknowledging messages until processing is complete up to *receive-max* value with a maximum of 65,535. This might include relaying the message, or a derivative of the message, to MQTT broker for further dispatching.

## Message retention and broker behavior

The broker retains messages until it receives an acknowledgment from a subscriber, ensuring zero message loss. This behavior guarantees that even if a subscriber application crashes or loses connectivity temporarily, messages aren't lost and can be processed once the application reconnects. MQTT broker messages might expire if configured by the [Message-Expiry-Interval](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html#_Toc3901112) and a subscriber didn't consume the message.

## Retained messages

[Retained messages](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html#_Toc3901104) maintain temporary application state, such as the latest status or value for a specific topic. When a new client subscribes to a topic, it receives the last retained message, ensuring it has the most up-to-date information.

## Keep-Alive

To ensure high availability in case of connection errors or drops, set suitable [keep-alive intervals](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html#_Toc3901045) for client-server communication. During idle periods, clients send *PINGREQs*, awaiting *PINGRESPs*. If no response, implement auto reconnect logic in the client to re-establish connections. Most clients like [Paho](https://www.eclipse.org/paho/) have retry logic built in. As MQTT broker is fault-tolerant, a reconnection succeeds if there is at least two healthy broker instances a frontend and a backend.

## Eventual consistency with QoS-1 subscription

MQTT subscriptions with QoS-1 ensure eventual consistency across identical application instances by subscribing to a shared topic. As messages are published, instances receive and replicate data with at-least-once delivery. The instances must handle duplicates and tolerate temporary inconsistencies until data is synchronized.

## Shared subscriptions

[Shared subscriptions](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html#_Toc3901250) enable load balancing across multiple instances of a highly available application. Instead of each subscriber receiving a copy of every message, the messages are distributed evenly among the subscribers. MQTT broker currently only supports a round robin algorithm to distribute messages allowing an application to scale out. A typical use case is to deploy multiple pods using Kubernetes ReplicaSet that all subscribe to MQTT broker using the same topic filter in shared subscription.

## State store

State store is a replicated in-memory *HashMap* for managing application processing state. Unlike *etcd*, for example, state store prioritizes high-velocity throughput, horizontal scaling, and low latency through in-memory data structures, partitioning, and chain-replication. It allows applications to use the state stores distributed nature and fault tolerance while accessing a consistent state quickly across instances. To use the built-in key-value store, provided by the distributed broker:

* Implement ephemeral storage and retrieval operations using the broker's key-value store API, ensuring proper error handling and data consistency. Ephemeral state is a short-lived data storage used in stateful processing for fast access to intermediate results or metadata during real-time computations. In the context of HA application, an ephemeral state helps recover application states between crashes. It can be written to disk but remains temporary, as opposed to cold storage that is designed for long-term storage of infrequently accessed data.

* Use the state store for sharing state, caching, configuration, or other essential data among multiple instances of the application, allowing them to keep a consistent view of the data.

## Checklist to develop a highly available application

* Choose an appropriate MQTT client library for your programming language. The client should support MQTT v5. Use a C or Rust based library if your application is sensitive to latency.
* Configure the client library to connect to MQTT broker with *clean-session* flag set to `false` and the desired QoS level (QoS-1).
* Decide a suitable value for session expiry, message expiry, and keep-alive intervals.
* Implement the message processing logic for the subscriber application, including sending an acknowledgment when the message is successfully delivered or processed.
* For multithreaded applications, configure the *max-receive* parameter to enable parallel message processing.
* Utilize retained messages for keeping temporary application state.
* Utilize the distributed state store to manage ephemeral application state.
* Implement shared subscriptions to distribute messages evenly among multiple instances of the application, allowing for efficient scaling.

## Related content

- [Data persistence in the MQTT broker state store](overview-state-store.md)
