---
title: Deployment planning - Advanced MQTT options
description: Plan advanced MQTT client options for your Azure IoT Operations MQTT broker before deployment.
author: dominicbetts
ms.author: dobett
ms.topic: concept-article
ms.service: azure-iot-operations
ms.subservice: azure-mqtt-broker
ms.date: 04/21/2026
ai-usage: ai-assisted
#customer intent: As an IT administrator, I want to understand advanced MQTT client options so I can decide whether to customize them before deploying Azure IoT Operations.
---

# Deployment planning - Advanced MQTT options

Advanced MQTT options control how the MQTT broker interacts with clients. These settings are negotiated between the broker and the client at connection time, and include session expiry, message expiry, receive maximum, and keep alive. The only setting specific to Azure IoT Operations is the [subscriber queue limit](#subscriber-queue-limit). Decide before deployment whether you need to customize these options.

> [!IMPORTANT]
> These options can be configured only at initial deployment, by using the Azure CLI or the Azure portal. To change them later, you must redeploy. For more information, see [Customize default Broker](../manage-mqtt-broker/overview-broker.md#customize-default-broker).

In many scenarios, the default client settings are sufficient. To override the default client settings for the MQTT broker, edit the `advanced.clients` section in the Broker resource. Currently, this override is supported only by using the `--broker-config-file` flag when you deploy IoT Operations by using the `az iot ops create` command. For more information, see [Azure CLI support for advanced MQTT broker configuration](https://aka.ms/aziotops-broker-config).

For the complete list of available settings, see the [ClientConfig](/rest/api/iotoperations/broker/create-or-update#clientconfig) API reference.

To get started, prepare a `Broker` configuration file in JSON format. For example:

```json
{
  "advanced": {
    "clients": {
      "maxSessionExpirySeconds": 282277,
      "maxMessageExpirySeconds": 1622,
      "subscriberQueueLimit": {
        "length": 1000,
        "strategy": "DropOldest"
      },
      "maxReceiveMaximum": 15000,
      "maxKeepAliveSeconds": 300
    }
  }
}
```

Then, deploy IoT Operations by using the `az iot ops create` command with the `--broker-config-file` flag. Other parameters are omitted for brevity:

```azurecli
az iot ops create ... --broker-config-file <FILE>.json
```

## Subscriber queue limit

The MQTT broker keeps a queue for each subscriber with QoS 1 (at-least-once delivery) messages waiting to be delivered. Messages are added to this queue when they're received from the publisher. They're removed after they're delivered and acknowledged by the subscriber with a PUBACK message. If messages arrive faster than the subscriber can acknowledge them, or if the subscriber is offline with a persistent session, the queue can grow large.

The MQTT broker can [buffer these messages to disk](deployment-planning-disk-buffer.md) to save memory, but disk buffering isn't always available. The disk buffer might not be configured, or it might already be full because of other subscribers. The subscriber queue limit prevents a single subscriber from consuming too much broker memory.

The subscriber queue limit has two settings:

- **Length**: The maximum number of messages that can be queued for one subscriber. If the queue is full and a new message arrives, the broker drops a message based on the configured strategy.
- **Strategy**: How the broker behaves when the queue is full:

  - **None** (default): Messages aren't dropped. The queue can grow until the session expires.
  - **DropOldest**: The broker drops the oldest message in the queue to make room for the new one.

> [!NOTE]
> The subscriber queue limit applies to the **outgoing queue** — messages waiting to be sent to the subscriber. The **in-flight queue** (messages sent but not yet acknowledged by the subscriber) is separate and governed by the MQTT receive maximum setting.

> [!IMPORTANT]
> In multi-partition deployments, queue counts scale per partition. Each partition maintains its own subscriber queues independently. The total cluster-wide memory consumed by a single subscriber's queues can exceed what a single configured limit suggests. Plan memory capacity accordingly for multi-partition deployments.

## Slow subscribers

A slow subscriber is one that can't keep up with the incoming message rate. This problem can occur if the subscriber processes messages slowly, is disconnected, or is offline. The subscriber queue limit helps prevent a slow subscriber from consuming too much memory.

## Message expiry

The `maxMessageExpirySeconds` setting controls how long a message can stay in the queue before it expires. If a message stays in the queue longer than `maxMessageExpirySeconds`, it expires. The broker doesn't actively purge expired messages — it discards them when they reach the front of the queue. This passive cleanup keeps memory usage bounded without scanning the queue.

## Session expiry

The `maxSessionExpirySeconds` setting works with the subscriber queue limit to ensure that messages aren't kept in the queue indefinitely. If a session expires, the broker drops all messages in the queue for that session. Session expiry prevents offline subscribers from consuming memory indefinitely by eventually clearing the entire queue.

## Max message expiry and retained messages

In MQTT 5, retained messages respect the message expiry interval specified in the `PUBLISH` packet. If an expiry interval is set, the retained message is removed once the interval elapses. If no interval is provided, the message remains available indefinitely.

The `maxMessageExpirySeconds` setting defines a global upper limit for message expiry, applying to all messages, including retained ones. For example, if `maxMessageExpirySeconds` is set to `1000` seconds and a retained message specifies an expiry interval of `2000` seconds, the message is still removed after `1000` seconds.

By default, `maxMessageExpirySeconds` isn't set. In this case, retained messages don't expire unless an expiry interval is explicitly defined in the message.

## Next steps

- [Review internal traffic encryption options](deployment-planning-encryption.md)
- [Review disk-backed message buffer settings](deployment-planning-disk-buffer.md)
- [Prepare your cluster](../deploy-iot-ops/howto-prepare-cluster.md)
