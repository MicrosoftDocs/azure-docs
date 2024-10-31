---
title: Configure core MQTT broker settings
description: Configure core MQTT broker settings for high availability, scale, memory usage, and disk-backed message buffer behavior.
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.subservice: azure-mqtt-broker
ms.custom:
  - ignite-2023
ms.date: 10/22/2024

#CustomerIntent: As an operator, I want to understand the settings for the MQTT broker so that I can configure it for high availability and scale.
ms.service: azure-iot-operations
---

# Configure core MQTT broker settings

The *Broker* resource is the main resource that defines the overall settings for MQTT broker. It also determines the number and type of pods that run the *Broker* configuration, such as the frontends and the backends. You can also use the *Broker* resource to configure its memory profile. Self-healing mechanisms are built in to the broker and it can often automatically recover from component failures. For example, a node fails in a Kubernetes cluster configured for high availability. 

You can horizontally scale the MQTT broker by adding more frontend replicas and backend chains. The frontend replicas are responsible for accepting MQTT connections from clients and forwarding them to the backend chains. The backend chains are responsible for storing and delivering messages to the clients. The frontend pods distribute message traffic across the backend pods, and the backend redundancy factor determines the number of data copies to provide resiliency against node failures in the cluster.

For a list of the available settings, see the [Broker](/rest/api/iotoperationsmq/broker) API reference.

## Configure scaling settings

> [!IMPORTANT]
> At this time, the *Broker* resource can only be configured at initial deployment time using the Azure CLI, Portal or GitHub Action. A new deployment is required if *Broker* configuration changes are needed. 

To configure the scaling settings MQTT broker, you need to specify the `cardinality` fields in the specification of the *Broker* custom resource. For more information on setting the mode and cardinality settings using Azure CLI, see [az iot ops init](/cli/azure/iot/ops#az-iot-ops-init).

### Automatic deployment cardinality

To automatically determine the initial cardinality during deployment, omit the `cardinality` field in the *Broker* resource. The MQTT broker operator automatically deploys the appropriate number of pods based on the number of available nodes at the time of the deployment. This is useful for non-production scenarios where you don't need high-availability or scale.

However, this is *not* auto-scaling. The operator doesn't automatically scale the number of pods based on the load. The operator only determines the initial number of pods to deploy based on the cluster hardware. As noted above, the cardinality can only be set at initial deployment time, and a new deployment is required if the cardinality settings need to be changed.

### Configure cardinality directly

To configure the cardinality settings directly, specify the `cardinality` field. The `cardinality` field is a nested field that has these subfields:

- `frontend`: This subfield defines the settings for the frontend pods, such as:
  - `replicas`: The number of frontend pods to deploy. Increasing the number of frontend replicas provides high availability in case one of the frontend pods fails.
  - `workers`: The number of logical frontend workers per replica. Increasing the number of workers per frontend replica improves CPU core utilization because each worker can use only one CPU core at most. For example, if your cluster has 3 nodes, each with 8 CPU cores, then set the number of replicas to match the number of nodes (3) and increase the number of workers up to 8 per replica as you need more frontend throughput. This way, each frontend replica can use all the CPU cores on the node without workers competing for CPU resources.
- `backendChain`: This subfield defines the settings for the backend chains, such as:
  - `partitions`: The number of partitions to deploy. Increasing the number of partitions increases the number of messages that the broker can handle. Through a process called *sharding*, each partition is responsible for a portion of the messages, divided by topic ID and session ID. The frontend pods distribute message traffic across the partitions.
  - `redundancyFactor`: The number of backend pods to deploy per partition. Increasing the redundancy factor increases the number of data copies to provide resiliency against node failures in the cluster.
  - `workers`: The number of workers to deploy per backend replica. The workers take care of storing and delivering messages to clients together. Increasing the number of workers per backend replica increases the number of messages that the backend pod can handle. Each worker can consume up to 2 CPU cores at most, so be careful when increasing the number of workers per replica to not exceed the number of CPU cores in the cluster.

When you increase these values, the broker's capacity to handle more connections and messages improves, and it enhances high availability in case of pod or node failures. However, this also leads to higher resource consumption. So, when adjusting cardinality values, consider the memory profile settings and balance these factors to optimize the broker's resource usage.

## Configure memory profile

> [!IMPORTANT]
> At this time, the *Broker* resource can only be configured at initial deployment time using the Azure CLI, Portal or GitHub Action. A new deployment is required if *Broker* configuration changes are needed.

To configure the memory profile settings MQTT broker, specify the `memoryProfile` fields in the spec of the *Broker* custom resource. For more information on setting the memory profile setting using Azure CLI, see [az iot ops init](/cli/azure/iot/ops#az-iot-ops-init).

`memoryProfile`: This subfield defines the settings for the memory profile. There are a few profiles for the memory usage you can choose:

### Tiny

When using this profile:

- Maximum memory usage of each frontend replica is approximately 99 MiB but the actual maximum memory usage might be higher.
- Maximum memory usage of each backend replica is approximately 102 MiB but the actual maximum memory usage might be higher.

Recommendations when using this profile:

- Only one frontend should be used.
- Clients shouldn't send large packets. You should only send packets smaller than 4 MiB.

### Low

When using this profile:

- Maximum memory usage of each frontend replica is approximately 387 MiB but the actual maximum memory usage might be higher.
- Maximum memory usage of each backend replica is approximately 390 MiB multiplied by the number of backend workers, but the actual maximum memory usage might be higher.

Recommendations when using this profile:

- Only one or two frontends should be used.
- Clients shouldn't send large packets. You should only send packets smaller than 10 MiB.

### Medium

Medium is the default profile.

- Maximum memory usage of each frontend replica is approximately 1.9 GiB but the actual maximum memory usage might be higher.
- Maximum memory usage of each backend replica is approximately 1.5 GiB multiplied by the number of backend workers, but the actual maximum memory usage might be higher.

### High

- Maximum memory usage of each frontend replica is approximately 4.9 GiB but the actual maximum memory usage might be higher.
- Maximum memory usage of each backend replica is approximately 5.8 GiB multiplied by the number of backend workers, but the actual maximum memory usage might be higher.

## Default broker

By default, Azure IoT Operations deploys a default Broker resource named `default`. It's deployed in the `azure-iot-operations` namespace with cardinality and memory profile settings as configured during the initial deployment with Azure portal or Azure CLI. To see the settings, run the following command:

```bash
kubectl get broker default -n azure-iot-operations -o yaml
```

### Modify default broker by redeploying

Only [cardinality](#configure-scaling-settings) and [memory profile](#configure-memory-profile) are configurable with Azure portal or Azure CLI during initial deployment. Other settings and can only be configured by modifying the YAML file and redeploying the broker.

To delete the default broker, run the following command:

```bash
kubectl delete broker default -n azure-iot-operations
```

Then, create a YAML file with desired settings. For example, the following YAML file configures the broker with name `default` in namespace `azure-iot-operations` with `medium` memory profile and `distributed` mode with two frontend replicas and two backend chains with two partitions and two workers each. Also, the [encryption of internal traffic option](#configure-encryption-of-internal-traffic) is disabled.

```yaml
apiVersion: mqttbroker.iotoperations.azure.com/v1beta1
kind: Broker
metadata:
  name: default
  namespace: azure-iot-operations
spec:
  memoryProfile: medium
  cardinality:
    backendChain:
      partitions: 2
      redundancyFactor: 2
      workers: 2
    frontend:
      replicas: 2
      workers: 2
  encryptInternalTraffic: false
```

Then, run the following command to deploy the broker:

```bash
kubectl apply -f <path-to-yaml-file>
```

## Configure MQTT broker advanced settings

The broker advanced settings include client configurations, encryption of internal traffic, and certificate rotations. For more information on the advanced settings, see the [Broker](/rest/api/iotoperations/broker/create-or-update) API reference.

Here's an example of a *Broker* with advanced settings:

```yml
apiVersion: mqttbroker.iotoperations.azure.com/v1beta1
kind: Broker
metadata:
  name: default
  namespace: azure-iot-operations
spec:
  advanced:
    clients:
        maxSessionExpirySeconds: 282277
        maxMessageExpirySeconds: 1622
        subscriberQueueLimit:
          length: 1000
          strategy: DropOldest
        maxReceiveMaximum: 15000
        maxKeepAliveSeconds: 300
    encryptInternalTraffic: Enabled
    internalCerts:
      duration: 240h
      renewBefore: 45m
      privateKey:
        algorithm: Rsa2048
        rotationPolicy: Always
```

## Configure MQTT broker diagnostic settings

Diagnostic settings allow you to enable metrics and tracing for MQTT broker.

- Metrics provide information about the resource utilization and throughput of MQTT broker.
- Tracing provides detailed information about the requests and responses handled by MQTT broker.

To override default diagnostic settings for MQTT broker, update the `spec.diagnostics` section in  the *Broker* resource. Adjust the log level to control the amount and detail of information that is logged. The log level can be set for different components of MQTT broker. The default log level is `info`.

You can configure diagnostics using the *Broker* custom resource definition (CRD). For more information on the diagnostics settings, see the [Broker](/rest/api/iotoperationsmq/broker) API reference.

Here's an example of a *Broker* custom resource with metrics and tracing enabled and self-check disabled:

```yaml
apiVersion: mqttbroker.iotoperations.azure.com/v1beta1
kind: Broker
metadata:
  name: broker
  namespace: azure-iot-operations
spec:
  diagnostics:
    logs:
      level: "debug"
      opentelemetryExportConfig:
        otlpGrpcEndpoint: "endpoint"
    metrics:
      opentelemetryExportConfig:
        otlpGrpcEndpoint: "endpoint"
        intervalSeconds: 60
    selfCheck:
      mode: Enabled
      intervalSeconds: 120
      timeoutSeconds: 60
    traces:
      cacheSizeMegabytes: 32
      mode: Enabled
      opentelemetryExportConfig:
        otlpGrpcEndpoint: "endpoint"
      selfTracing:
        mode: Enabled
        intervalSeconds: 120
      spanChannelCapacity: 1000
```

## Configure encryption of internal traffic

> [!IMPORTANT]
> At this time, this feature can't be configured using the Azure CLI or Azure portal during initial deployment. To modify this setting, you need to modify the YAML file and [redeploy the broker](#modify-default-broker-by-redeploying).

The **encryptInternalTraffic** feature is used to encrypt the internal traffic between the frontend and backend pods. To use this feature, cert-manager must be installed in the cluster, which is installed by default when using the Azure IoT Operations.

The benefits include:

- **Secure internal traffic**: All internal traffic between the frontend and backend pods is encrypted.

- **Secure data at rest**: All data at rest is encrypted.

- **Secure data in transit**: All data in transit is encrypted.

- **Secure data in memory**: All data in memory is encrypted.

- **Secure data in the message buffer**: All data in the message buffer is encrypted.

- **Secure data in the message buffer on disk**: All data in the message buffer on disk is encrypted.

By default, the **encryptInternalTraffic** feature is enabled. To disable the feature, set the `encryptInternalTraffic` field to `false` in the spec of the *Broker* custom resource when redeploying the broker.

## Configure disk-backed message buffer behavior

> [!IMPORTANT]
> At this time, this feature can't be configured using the Azure CLI or Azure portal during initial deployment. To modify this setting, you need to modify the YAML file and [redeploy the broker](#modify-default-broker-by-redeploying).

The **diskBackedMessageBufferSettings** feature is used for efficient management of message queues within the MQTT broker distributed MQTT broker. The benefits include:

- **Efficient queue management**: In an MQTT broker, each subscriber is associated with a message queue. The speed a subscriber processes messages directly impacts the size of the queue. If a subscriber processes messages slowly or if they disconnect but request an MQTT persistent session, the queue can grow larger than the available memory.

- **Data preservation for persistent sessions**: The **diskBackedMessageBufferSettings** feature ensures that when a queue exceeds the available memory, it's seamlessly buffered to disk. This feature prevents data loss and supports MQTT persistent sessions, allowing subscribers to resume their sessions with their message queues intact upon reconnection. The disk is used as ephemeral storage and serves as a spillover from memory. Data written to disk isn't durable and is lost when the pod exits, but as long as at least one pod in each backend chain remains functional, the broker as a whole doesn't lose any data.

- **Handling connectivity challenges**: Cloud connectors are treated as subscribers with persistent sessions that can face connectivity challenges when unable to communicate with external systems like Event Grid MQTT broker due to network disconnect. In such scenarios, messages (PUBLISHes) accumulate. The MQTT broker intelligently buffers these messages to memory or disk until connectivity is restored, ensuring message integrity.

Understanding and configuring the **diskBackedMessageBufferSettings** feature maintains a robust and reliable message queuing system. Proper configuration is important in scenarios where message processing speed and connectivity are critical factors.

### Configuration options

Tailor the broker message buffer options by adjusting the following settings:

- **Configure the volume**: Specify a persistent volume claim template to mount a dedicated storage volume for your message buffer.

    - **Select a storage class**: Define the desired *StorageClass* using the `storageClassName` property.

    - **Define access modes**: Determine the access modes you need for your volume. For more information, see [persistent volume access modes](https://kubernetes.io/docs/concepts/storage/persistent-volumes#access-modes-1).

Use the following sections to understand the different volume modes.

*Ephemeral* volume is the preferred option. *Persistent* volume is preferred next then *emptyDir* volume. Both persistent volume and ephemeral volume are generally provided by the same storage classes. If you have both options, choose ephemeral. However, ephemeral requires Kubernetes 1.23 or higher.

### Disabled

If you don't want to use the disk-backed message buffer, don't include the `diskBackedMessageBufferSettings` property in your *Broker* CRD.

### Ephemeral volume

[Ephemeral volume](https://kubernetes.io/docs/concepts/storage/ephemeral-volumes#generic-ephemeral-volumes) is the preferred option for your message buffer.

For *ephemeral* volume, follow the advice in the [Considerations for storage providers](#considerations-for-storage-providers) section.

The value of the *ephemeralVolumeClaimSpec* property is used as the ephemeral.*volumeClaimTemplate.spec* property of the volume in the StatefulSet specs of the backend chains.

For example, to use an ephemeral volume with a capacity of 1 gigabyte, specify the following parameters in your Broker CRD:

```yaml
diskBackedMessageBuffer:
  maxSize: "1G"
  ephemeralVolumeClaimSpec:
    storageClassName: "foo"
    accessModes:
    - "ReadWriteOnce"
```

### Persistent volume

[Persistent volume](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) is the next preferred option for your message buffer after *ephemeral* volume.

For *persistent* volume, follow the advice in [Considerations for storage providers](#considerations-for-storage-providers) section.

The value of the *persistentVolumeClaimSpec* property is used as the *volumeClaimTemplates.spec* property of the *StatefulSet* specs of the backend chains.

For example, to use a *persistent* volume with a capacity of 1 gigabyte, specify the following parameters in your Broker CRD:

```yaml 
diskBackedMessageBuffer:
  maxSize: "1G"
  persistentVolumeClaimSpec:
    storageClassName: "foo"
    accessModes:
    - "ReadWriteOnce"
```

### emptyDir volume

Use an [emptyDir volume](https://kubernetes.io/docs/concepts/storage/volumes/#emptydir). An *emptyDir volume* is the next preferred option after persistent volume. 

Only use *emptyDir* volume when using a cluster with filesystem quotas. For more information, see details in the [Filesystem project quota tab](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#resource-emphemeralstorage-consumption). If the feature isn't enabled, the cluster does *periodic scanning* that doesn't enforce any limit and allows the host node to fill disk space and mark the whole host node as unhealthy. 

For example, to use an emptyDir volume with a capacity of 1 gigabyte, specify the following parameters in your Broker CRD:

```yaml
      diskBackedMessageBuffer:
        maxSize: "1G"
```

### Considerations for storage providers

Consider the behavior of your chosen storage provider. For example, when using providers like `rancher.io/local-path`. If the provider doesn't support limits, filling up the volume consumes the node's disk space. This could lead to Kubernetes marking the node and all associated pods as unhealthy. It's crucial to understand how your storage provider behaves in such scenarios.

### Persistence

It's important to understand that the **diskBackedMessageBufferSettings** feature isn't synonymous with *persistence*. In this context, *persistence* refers to data that survives across pod restarts. However, this feature provides temporary storage space for data to be saved to disk, preventing memory overflows and data loss during pod restarts.
