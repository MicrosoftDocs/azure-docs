---
title: Configure Azure IoT MQ availability and scale
# titleSuffix: Azure IoT MQ
description: Configure Azure IoT MQ availability and scale.
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.date: 10/18/2023

#CustomerIntent: As an operator, I want to understand availability and scale options for MQTT broker.
---

# Configure availability and scale

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

The **Broker** custom resource is the main resource that defines the overall settings for Azure IoT MQ broker, like the name, namespace, and labels. It also determines the number and type of pods that run the broker components, such as the frontend and the backend. You can also use the *Broker* custom resource to configure the memory profile for the broker.

For high availability, horizontally scale Azure IoT MQ by adding more frontend replicas and backend chains. The frontend replicas are responsible for accepting MQTT connections from clients and forwarding them to the backend chains. The backend chains are responsible for storing and delivering messages to the clients. You can also use different topics to distribute the load across different backend chains. The same backend chain handles the same topic.

## Configure Azure IoT MQ scaling settings with the Broker custom resource

To configure the scaling settings Azure IoT MQ broker, you need to specify the `mode` and `cardinality` fields in the spec of the Broker custom resource.

The `mode` field can be one of these values:

- `auto`: This value indicates that Azure IoT MQ operator automatically deploys the appropriate number of pods based on the cluster hardware. This is the default value and the recommended option for most scenarios.
- `distributed`: This value indicates that you can manually specify the number of frontend pods and backend chains in the `cardinality` field. This option gives you more control over the deployment, but requires more configuration.

The `cardinality` field is a nested field that has these subfields:

- `frontend`: This subfield defines the settings for the frontend pods, such as:
  - `replicas`: The number of frontend pods to deploy. This subfield is required if the `mode` field is set to `distributed`.
- `backendChain`: This subfield defines the settings for the backend chains, such as:
  - `replicas`: The number of replicas in each backend chain. This subfield is required if the `mode` field is set to `distributed`.
  - `partitions`: The number of partitions to deploy. This subfield is required if the `mode` field is set to `distributed`.
  - `workers`: The numb0.6.0er of workers to deploy, currently it must be set to `1`. This subfield is required if the `mode` field is set to `distributed`.

For example, to deploy a Broker resource named **my-broker**", with **0.6.0** images, and automatic cardinality settings:

```yaml
apiVersion: az-edge.com/v1alpha4
kind: Broker
metadata:
  name: my-broker
  namespace: alice-springs
spec:
  mode: auto
  image:
    pullPolicy: Always
    repository: alicesprings.azurecr.io/dmqtt-pod
    tag: 0.6.0
  authImage:
    pullPolicy: Always
    repository: alicesprings.azurecr.io/dmqtt-authentication
    tag: 0.6.0
```

You can manually specify the number of frontend pods and backend chains:

```yaml
apiVersion: az-edge.com/v1alpha4
kind: Broker
metadata:
  name: my-broker
  namespace: alice-springs
spec:
  authImage:
    pullPolicy: Always
    repository: alicesprings.azurecr.io/dmqtt-authentication
    tag: 0.6.0
  image:
    pullPolicy: Always
    repository: alicesprings.azurecr.io/dmqtt-pod
    tag: 0.6.0
  mode: distributed
  cardinality:
    frontend:
      replicas: 3
    backendChain:
      replicas: 3
      partitions: 3
      workers: 1
```

## Configure Azure IoT MQ memory profile

To configure the memory profile settings Azure IoT MQ broker, specify the `memoryProfile` fields in the spec of the Broker custom resource.

`memoryProfile`: This subfield defines the settings for the memory profile. There are a few profiles for the memory usage you can choose:

### Tiny

When using this profile:

- Maximum memory usage of each frontend replica is approximately 99 MiB but the actual maximum memory usage might be higher.
- Maximum memory usage of each backend replica is approximately 102 MiB but the actual maximum memory usage might be higher.



Recommendations when using this profile:

- Only one frontend should be used.
- Clients shouldn't send large packets. It's recommended to only send packets smaller than 4 MiB.

### Low

When using this profile:

- Maximum memory usage of each frontend replica is approximately 387 MiB but the actual maximum memory usage might be higher.
- Maximum memory usage of each backend replica is approximately 390 MiB multiplied by the number of backend workers, but the actual maximum memory usage might be higher.

Recommendations when using this profile:

- Only one or two frontends should be used.
- Clients shouldn't send large packets. It's recommended to only send packets smaller than 10 MiB.

### Medium

Medium is the default profile.

- Maximum memory usage of each frontend replica is approximately 1.9 GiB but the actual maximum memory usage might be higher.
- Maximum memory usage of each backend replica is approximately 1.5 GiB multiplied by the number of backend workers, but the actual maximum memory usage might be higher.


### High

- Maximum memory usage of each frontend replica is approximately 4.9 GiB but the actual maximum memory usage might be higher.
- Maximum memory usage of each backend replica is approximately 5.8 GiB multiplied by the number of backend workers, but the actual maximum memory usage might be higher.

For example, you can specify the low memory profile like the following:

```yaml
apiVersion: az-edge.com/v1alpha4
kind: Broker
metadata:
  name: my-broker
  namespace: alice-springs
spec:
  mode: auto
  memoryProfile: low
```

## Broker failure recovery example

If a frontend pod fails, clients with persistent sessions can reconnect to another frontend pod and resume their sessions. The failed frontend pod restarts automatically, and can start serving clients again within 60 seconds.

For high availability, you should have at least two frontend pods and two backend chains in your deployment. You can also increase the number of frontend pods and backend chains based on your expected load and performance requirements.

| Feature | Supported |
|---|:---:|:---:|
| Horizontal scaling | ✅ |
| Dynamic reconfiguration of backend replicas | Currently requires restart |
| Frontend failure handling | ✅ |
| Frontend failure recovery | ✅ |
| Backend failure handling | ✅ |


Azure IoT MQ can now tolerate a backend replica failure up to the point when at least one good replica still exists.

In this example, one of the frontend brokers is deleted and Azure IoT MQ recovers. The Azure IoT MQ broker can run with multiple frontend brokers and, with at least one frontend is working, can handle clients.

1. Deploy and connect to Azure IoT MQ.
1. Delete one of the frontend broker pods

    While the messages are being sent, delete one of the frontend pods.
    
    ```bash
    kubectl delete pod azedge-dmqtt-frontend-798dd9bcfd-7phm8
    ```

It takes about 10 seconds until the pod gets deleted. Once the frontend pod is deleted, all clients connected to it are disconnected. The mosquitto client has a built-in retry mechanism and reconnects to the broker. Upon receiving the request to reconnect, the load balancer directs it to the frontend broker still serving clients and the communication gets restored:

```text
Client sub2 received PUBLISH (d0, q1, r0, m47, 'test', ... (10 bytes))
Client sub2 sending PUBACK (m47, rc0)
test message
Client sub2 sending CONNECT
Client sub2 received CONNACK (0)
Client sub2 sending SUBSCRIBE (Mid: 2, Topic: test, QoS: 1, Options: 0x00)
Client sub2 received SUBACK
Subscribed (mid: 2): 1
Client sub2 received PUBLISH (d0, q1, r0, m49, 'test', ... (10 bytes))
Client sub2 sending PUBACK (m49, rc0)
test message
```

## Next step

[Configure disk-backed message buffer behavior](./howto-configure-disk-buffer.md)