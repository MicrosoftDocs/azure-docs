---
title: Configure disk-backed message buffer behavior
#titleSuffix: Azure IoT MQ
description: Configure IoT MQ message buffer behavior to enhance message management with disk backed message buffer settings in the Broker Custom Resource Definition (CRD).
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.date: 10/18/2023

#CustomerIntent: As an operator, I want to configure message buffer settings to enance message managment.
---

# Configure disk-backed message buffer behavior

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

The **diskBackedMessageBufferSettings** feature is used for efficient management of message queues within the Azure IoT MQ distributed MQTT broker. Thie benefits include:

- **Efficient queue management**: In an MQTT broker, each subscriber is associated with a message queue. The speed a subscriber processes messages directly impacts the size of the queue. If a subscriber processes messages slowly or if they disconnect but request an MQTT persistent session, the queue can grow larger than the available memory.

- **Data preservation for persistent sessions**: The **diskBackedMessageBufferSettings** feature ensures that when a queue exceeds the available memory, it's seamlessly buffered to disk. This prevents data loss and supports MQTT persistent sessions, allowing subscribers to resume their sessions with their message queues intact upon reconnection. The disk is used as ephemeral storage and serves as a spillover from memory. Data written to disk isn't durable and is lost when the pod exits.

- **Handling connectivity challenges**: [Connectors](../connect-to-cloud/overview-connect-to-cloud.md), which are treated as subscribers with persistent sessions, can face connectivity challenges, when unable to communicate with external systems like Event Grid MQTT broker due to network disconnect. In such scenarios, messages (PUBLISHes) accumulate. The Azure IoT MQ broker intelligently buffers these messages to memory or disk until connectivity is restored, ensuring message integrity.


In rare cases where numerous slow subscribers or connectors face extended communication challenges, the disk space allocated for queue buffering can become a limitation. [Configuring the `memoryProfile` to `low`](./howto-configure-availability-scale.md) temporarily offers a solution, optimizing memory usage until the persistence feature is fully implemented and enhancing system resilience. Currently, it's not possible to disable disk-backed message buffering.

Understanding and configuring the **diskBackedMessageBufferSettings** feature maintains a robust and reliable message queuing system. Proper configuration is important in scenarios where message processing speed and connectivity are critical factors.

## Configuration options

Tailor the broker message buffer options by adjusting the following settings:

- **Configure the volume**: Specify a persistent volume claim template to mount a dedicated storage volume for your message buffer.

  - **Select a storage class**: Define the desired StorageClass using the `storageClassName` property.

  - **Define access modes**: Determine the access modes you need for your volume. For more details, refer to the [official Kubernetes documentation](https://kubernetes.io/docs/concepts/storage/persistent-volumes#access-modes-1).

  - **Manage resources**: Fine-tune your resource allocation with the `requests` and `limits` properties. Learn more about resource management [here](https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/).

By default, the container filesystem is used when no storage class is provided. Currently, there is no way to set a limit on the amount of data that's written. Use a storage class with size limits to reduce the chance of exausting the disk space available on the node.

To set up your persistent volume for the message buffer in your Broker CRD, follow this example:

```yaml
spec:
  diskBackedMessageBufferSettings:
    volumeClaimSpec:
      storageClassName: 'foo'
      accessModes:
        - 'ReadWriteOnce'
      resources:
        requests:
          storage: '1G'
        limits:
          storage: '1G'
  # ...customize other properties of the `volumeClaimSpec` as needed.
```

Once configured, the broker backend transfers PUBLISH messages from memory to disk. This process continues until your specified volume is full or reaches the requested storage limit if it's supported by your storage provider. If your backend can no longer transfer messages to disk, they accumulate in memory. When this happens, backpressure begins rejecting new PUBLISH messages, maintaining the same behavior as before the disk buffer configuration.

## Considerations for storage providers

Consider the behavior of your chosen storage provider. For example, when using providers like `rancher.io/local-path`. If the provider doesn't support limits, filling up the volume consumes the node's disk space. This could lead to Kubernetes marking the node and all associated pods as unhealthy. It's crucial to understand how your storage provider behaves in such scenarios.

## Clarification on "persistence"

It's important to understand that the **diskBackedMessageBufferSettings** feature isn't synonymous with *persistence*. In this context, *persistence* refers to data that survives across pod restarts. However, this feature provides temporary storage space for data to be saved to disk, preventing memory overflows and data loss during pod restarts.

## Next step

Configure the [availability and scale](./howto-configure-availability-scale.md) of your Azure IoT MQ broker.
