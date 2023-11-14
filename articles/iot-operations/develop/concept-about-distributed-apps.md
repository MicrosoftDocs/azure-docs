---
title: Develop highly available distributed applications
# titleSuffix: Azure IoT MQ
description: Learn how to develop highly available distributed applications that work with Azure IoT MQ.
author: PatAltimore
ms.author: patricka
ms.topic: concept-article
ms.custom:
  - ignite-2023
ms.date: 10/26/2023

#CustomerIntent: As an developer, I want understand how to develop highly available distributed applications for my IoT Operations solution.
---

# Develop highly available applications

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Creating a highly available application using Azure IoT MQ involves careful consideration of session types, quality of service (QoS), message acknowledgments, parallel message processing, message retention, and shared subscriptions. Azure IoT MQ features a distributed, in-memory message broker and store that provides message retention and built-in state management with MQTT semantics.

The following sections explain the settings and features that contribute to a robust, zero message loss, and distributed application.

## Quality of service (QoS)

Both publishers and subscribers should use [QoS-1](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html#_Toc3901236) to guarantee message delivery at least once. The broker stores and retransmits messages until it receives an acknowledgment (ACK) from the recipient, ensuring no messages are lost during transmission.

## Session type and Clean-Session flag

To ensure zero message loss, set the [clean-start](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html#_Toc3901039) flag to false when connecting to the Azure IoT MQ MQTT broker. This setting informs the broker to maintain the session state for the client, preserving subscriptions and unacknowledged messages between connections. If the client disconnects and later reconnects, it resumes from where it left off, receiving any unacknowledged QoS-1 messages through [message delivery retry](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html#_Toc3901238). If configured, IoT MQ expires the client session if the client doesn't reconnect within the *Session Expiry Interval* The default is one day.

## Receive-Max in multithreaded applications

Multithreaded applications should use [receive-max](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html#_Toc3901049) (65,535 max) to process messages in parallel and apply flow control. This setting optimizes message processing by allowing multiple threads to work on messages concurrently and without the broker overloading the application with a high message rate above the application capacity. Each thread can process a message independently and send its acknowledgment upon completion. A typical practice is to configure *max-receive* proportionally to the number of threads that the application uses.

## Acknowledging messages

When a subscriber application sends an acknowledgment for a QoS-1 message, it takes ownership of the message. Upon receiving acknowledgment for a QoS-1 message, IoT MQ stops tracking the message for that application and topic. Proper transfer of ownership ensures message preservation in case of processing issues or application crashes. If an application wants to protect it from application crashes, then the application shouldn't take ownership before successfully completing its processing on that message. Applications subscribing to IoT MQ should delay acknowledging messages until processing is complete up to *receive-max* value with a maximum of 65,535. This might include relaying the message, or a derivative of the message, to IoT MQ for further dispatching.

## Message retention and broker behavior

The broker retains messages until it receives an acknowledgment from a subscriber, ensuring zero message loss. This behavior guarantees that even if a subscriber application crashes or loses connectivity temporarily, messages won't be lost and can be processed once the application reconnects. IoT MQ messages might expire if configured by the [Message-Expiry-Interval](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html#_Toc3901112) and a subscriber didn't consume the message.

## Retained messages

[Retained messages](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html#_Toc3901104) maintain temporary application state, such as the latest status or value for a specific topic. When a new client subscribes to a topic, it receives the last retained message, ensuring it has the most up-to-date information.

## Keep-Alive

To ensure high availability in case of connection errors or drops, set suitable [keep-alive intervals](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html#_Toc3901045) for client-server communication. During idle periods, clients send *PINGREQs*, awaiting *PINGRESPs*. If no response, implement auto reconnect logic in the client to re-establish connections. Most clients like [Paho](https://www.eclipse.org/paho/) have retry logic built in. As IoT MQ is fault-tolerant, a reconnection succeeds if there is at least two healthy broker instances a frontend and a backend.

## Eventual consistency with QoS-1 subscription

MQTT subscriptions with QoS-1 ensure eventual consistency across identical application instances by subscribing to a shared topic. As messages are published, instances receive and replicate data with at-least-once delivery. The instances must handle duplicates and tolerate temporary inconsistencies until data is synchronized.

## Shared subscriptions

[Shared subscriptions](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html#_Toc3901250) enable load balancing across multiple instances of a highly available application. Instead of each subscriber receiving a copy of every message, the messages are distributed evenly among the subscribers. IoT MQ broker currently only supports a round robin algorithm to distribute messages allowing an application to scale out. A typical use case is to deploy multiple pods using Kubernetes ReplicaSet that all subscribe to IoT MQ using the same topic filter in shared subscription.

## Use IoT MQ's built-in key-value store (distributed HashMap)

IoT MQ's built-in key-value store is a simple, replicated in-memory *HashMap* for managing application processing state. Unlike *etcd*, for example, IoT MQ prioritizes high-velocity throughput, horizontal scaling, and low latency through in-memory data structures, partitioning, and chain-replication. It allows applications to use the broker's distributed nature and fault tolerance while accessing a consistent state quickly across instances. To use the built-in key-value store provided by the distributed broker:

* Implement ephemeral storage and retrieval operations using the broker's key-value store API, ensuring proper error handling and data consistency. Ephemeral state is a short-lived data storage used in stateful processing for fast access to intermediate results or metadata during real-time computations. In the context of HA application, an ephemeral state helps recover application states between crashes. It can be written to disk but remains temporary, as opposed to cold storage that's designed for long-term storage of infrequently accessed data.

* Use the key-value store for sharing state, caching, configuration, or other essential data among multiple instances of the application, allowing them to keep a consistent view of the data.

## Use IoT MQ's built-in Dapr integration

For simpler use cases an application might utilize [Dapr](https://dapr.io) (Distributed Application Runtime). Dapr is an open-source, portable, event-driven runtime that simplifies building microservices and distributed applications. It offers a set of building blocks, such as service-to-service invocation, state management, and publish/subscribe messaging.

[Dapr is offered as part of IoT MQ](howto-develop-dapr-apps.md), abstracting away details of MQTT session management, message QoS and acknowledgment, and built-in key-value stores, making it a practical choice for developing a highly available application for simple use cases by:

* Design your application using Dapr's building blocks, such as state management for handling the key-value store, and publish/subscribe messaging for interacting with the MQTT broker. If the use case requires building blocks and abstractions that aren't supported by Dapr, consider using the before mentioned IoT MQ features.

* Implement the application using your preferred programming language and framework, leveraging Dapr SDKs or APIs for seamless integration with the broker and the key-value store.

## Checklist to develop a highly available application

  - Choose an appropriate MQTT client library for your programming language. The client should support MQTT v5. Use a C or Rust based library if your application is sensitive to latency.
  - Configure the client library to connect to IoT MQ broker with *clean-session* flag set to false and the desired QoS level (QoS-1).
  - Decide a suitable value for session expiry, message expiry, and keep-alive intervals.
  - Implement the message processing logic for the subscriber application, including sending an acknowledgment when the message has been successfully delivered or processed.
  - For multithreaded applications, configure the *max-receive* parameter to enable parallel message processing.
  - Utilize retained messages for keeping temporary application state.
  - Utilize IoT MQ built-in key-value store to manage ephemeral application state.
  - Evaluate Dapr to develop your application if your use case is simple and doesn't require detailed control over the MQTT connection or message handling.
  - Implement shared subscriptions to distribute messages evenly among multiple instances of the application, allowing for efficient scaling.

## Example

The following example implements contextualization and normalization of data with a highly available northbound connector

A northbound application consists of input and output stages, and an optional processing stage. The input stage subscribes to a distributed MQTT broker to receive data, while the output stage ingests messages into a cloud data-lake. The processing stage executes contextualization and normalization logic on the received data.

![Diagram of a highly available app architecture.](./media/concept-about-distributed-apps/highly-available-app.png)

To ensure high availability, the input stage connects to IoT MQ and sets the *clean-session* flag to false for persistent sessions, using QoS-1 for reliable message delivery, acknowledging messages post-processing by the output stage. Additionally, the application might use the built-in *HashMap* key-value store for temporary state management and the round robin algorithm to load-balance multiple instances using shared subscriptions.

## Related content

- [Use Dapr to develop distributed application workloads](howto-develop-dapr-apps.md)
