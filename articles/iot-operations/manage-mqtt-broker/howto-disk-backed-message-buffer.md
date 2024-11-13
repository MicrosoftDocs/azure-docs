---
title: Disk-backed message buffer for the Azure IoT Operations MQTT broker
description: Learn how to configure the disk-backed message buffer feature for the Azure IoT Operations MQTT broker to manage message queues efficiently.
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.service: azure-iot-operations
ms.subservice: azure-mqtt-broker
ms.date: 11/11/2024

#CustomerIntent: As an operator, I want to configure MQTT broker so that I can modify the message queue behavior.
---

# Configure disk-backed message buffer behavior

> [!IMPORTANT]
> This setting requires modifying the Broker resource and can only be configured at initial deployment time using the Azure CLI or Azure Portal. A new deployment is required if Broker configuration changes are needed. To learn more, see [Customize default Broker](./overview-broker.md#customize-default-broker).

The **disk-backed message buffer** feature is used for efficient management of message queues within the MQTT broker distributed MQTT broker. The benefits include:

- **Efficient queue management**: In an MQTT broker, each subscriber is associated with a message queue. The speed a subscriber processes messages directly impacts the size of the queue. If a subscriber processes messages slowly or if they disconnect but request an MQTT persistent session, the queue can grow larger than the available memory.

- **Data preservation for persistent sessions**: The disk-backed message buffer feature ensures that when a queue exceeds the available memory, it's seamlessly buffered to disk. This feature prevents data loss and supports MQTT persistent sessions, allowing subscribers to resume their sessions with their message queues intact upon reconnection. The disk is used as ephemeral storage and serves as a spillover from memory. Data written to disk isn't durable and is lost when the pod exits, but as long as at least one pod in each backend chain remains functional, the broker as a whole doesn't lose any data.

- **Handling connectivity challenges**: Cloud connectors are treated as subscribers with persistent sessions that can face connectivity challenges when unable to communicate with external systems like Event Grid MQTT broker due to network disconnect. In such scenarios, messages (PUBLISHes) accumulate. The MQTT broker intelligently buffers these messages to memory or disk until connectivity is restored, ensuring message integrity.

<!-- TODO: accuracy check -->
By default, the disk-backed message buffer feature is disabled. In this case, messages remain in memory, and back pressure is applied to clients as the reader pool or scratch pool reaches the limit as defined by the [subscriber queue limit](./howto-broker-mqtt-client-options.md#subscriber-queue-limit). 

Configuring the disk-backed message buffer is essential for maintaining a robust and reliable message queuing system, especially in scenarios where message processing speed and connectivity are critical.

> [!NOTE]
> The MQTT broker writes data to disk exactly as received from clients, without additional encryption. Securing the disk is essential to protect the data stored by the broker.

## Configuration options

To configure the disk-backed message buffer, edit the `diskBackedMessageBuffer` section in the Broker resource. Currently this is only supported using the `--broker-config-file` flag when you deploy the Azure IoT Operations using the `az iot ops create` command. 

To get started, prepare a Broker config file following the [DiskBackedMessageBuffer](/rest/api/iotoperations/broker/create-or-update#diskbackedmessagebuffer) API reference. 

For example, the simplest configuration involves only specifying the max size. In this case, [an `emptyDir` volume](#emptydir-volume) is mounted. The `maxSize` value is used as the size limit of the `emptyDir` volume. But this is the least preferred option giving the limitations of `emptyDir` volume.

```json
{
  "diskBackedMessageBuffer": {
    "maxSize": "<SIZE>"
  }
}
```

To get a better disk-backed message buffer configuration, specify an ephemeral volume or persistent volume claim to mount a dedicated storage volume for your message buffer. For example:

```json
{
  "diskBackedMessageBuffer": {
    "maxSize": "<SIZE>",
    "ephemeralVolumeClaimSpec": {
      "storageClassName": "<NAME>",
      "accessModes": [
        "<MODE>"
      ]
    }
  }
}
```

```json
{
  "persistentVolumeClaimSpec": {
    "maxSize": "<SIZE>",
    "ephemeralVolumeClaimSpec": {
      "storageClassName": "<NAME>",
      "accessModes": [
        "<MODE>"
      ]
    }
  }
}
```

Tailor the broker message buffer options by adjusting the following settings:

- **Configure the volume**: Specify a volume claim template to mount a dedicated storage volume for your message buffer.

- **Select a storage class**: Define the desired *StorageClass* using the `storageClassName` property.

- **Define access modes**: Determine the access modes you need for your volume. For more information, see [persistent volume access modes](https://kubernetes.io/docs/concepts/storage/persistent-volumes#access-modes-1).

Use the following sections to understand the different volume modes: 

- [Ephemeral volume](#ephemeral-volume) is the preferred option,
- [Persistent volume](#persistent-volume) is preferred next, and 
- [*`emptyDir`* volume](#emptydir-volume) least preferred.

Both persistent and ephemeral volumes are generally provided by the same storage classes. If both options are available, choose ephemeral. Note that ephemeral volumes require Kubernetes 1.23 or higher.

> [!TIP]
> Specifying a Ephemeral Volume Claim (EVC) or Persistent Volume Claim (PVC) template lets you to use a storage class of your choice, increasing flexibility for some deployment scenarios. For example, Persistent Volumes (PVs) provisioned using a PVC template appear in commands like `kubectl get pv`, which can be useful for inspecting the cluster state.
> 
> If your Kubernetes nodes lack sufficient local disk space for the message buffer, use a storage class that provides network storage like Azure Blobs. However, it's generally better to use local disk with a smaller `maxSize` value, as the message buffer benefits from fast access and doesn't require durability.

### Deploy Azure IoT Operations with disk-backed message buffer

To use disk-backed message buffer, deploy Azure IoT Operations using the `az iot ops create` command with the `--broker-config-file` flag. See the following command (other parameters omitted for brevity):

```azurecli
az iot ops create ... --broker-config-file <FILE>.json
```

This setting cannot be changed after deployment. To change the disk-backed message buffer configuration, redeploy the Azure IoT Operations instance.

## Ephemeral volume

[Ephemeral volume](https://kubernetes.io/docs/concepts/storage/ephemeral-volumes#generic-ephemeral-volumes) is the preferred option for your message buffer.

For *ephemeral* volume, follow the advice in the [Considerations for storage providers](#considerations-for-storage-providers) section.

The value of the `ephemeralVolumeClaimSpec` property is used as the `ephemeral.volumeClaimTemplate.spec` property of the volume in the StatefulSet specs of the backend chains.

For example, to use an ephemeral volume with a capacity of 1 gigabyte, specify the following parameters in your Broker resource:

```json
{
  "diskBackedMessageBuffer": {
    "maxSize": "1G",
    "ephemeralVolumeClaimSpec": {
      "storageClassName": "foo",
      "accessModes": [
        "ReadWriteOnce"
      ]
    }
  }
}
```

## Persistent volume

[Persistent volume](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) is the next preferred option for your message buffer after *ephemeral* volume.

For *persistent* volume, follow the advice in [Considerations for storage providers](#considerations-for-storage-providers) section.

The value of the `persistentVolumeClaimSpec` property is used as the `volumeClaimTemplates.spec` property of the StatefulSet specs of the backend chains.

For example, to use a *persistent* volume with a capacity of 1 gigabyte, specify the following parameters in your Broker resource:

```json
{
  "diskBackedMessageBuffer": {
    "maxSize": "1G",
    "persistentVolumeClaimSpec": {
      "storageClassName": "foo",
      "accessModes": [
        "ReadWriteOnce"
      ]
    }
  }
}
```

## `emptyDir` volume

An [emptyDir volume](https://kubernetes.io/docs/concepts/storage/volumes/#emptydir) is the least preferred option after persistent volume. 

Only use *emptyDir* volume when using a cluster with filesystem quotas. For more information, see details in the [Filesystem project quota tab](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#resource-emphemeralstorage-consumption). If the feature isn't enabled, the cluster does *periodic scanning* that doesn't enforce any limit and allows the host node to fill disk space and mark the whole host node as unhealthy. 

For example, to use an emptyDir volume with a capacity of 1 gigabyte, specify the following parameters in your Broker resource:

```json
{
  "diskBackedMessageBuffer": {
    "maxSize": "1G"
  }
}
```

## Considerations for storage providers

Consider the behavior of your chosen storage provider. For example, when using providers like `rancher.io/local-path`. If the provider doesn't support limits, filling up the volume consumes the node's disk space. This could lead to Kubernetes marking the node and all associated pods as unhealthy. It's crucial to understand how your storage provider behaves in such scenarios.

## Disabled

If you don't want to use the disk-backed message buffer, don't include the `diskBackedMessageBufferSettings` property in your Broker resource. This is also the default behavior.

## Persistence

It's important to understand that the disk-backed message buffer feature isn't synonymous with *persistence*. In this context, *persistence* refers to data that survives across pod restarts. However, this feature provides temporary storage space for data to be saved to disk, preventing memory overflows and data loss during pod restarts.
