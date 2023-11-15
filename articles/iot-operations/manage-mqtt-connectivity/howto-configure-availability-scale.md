---
title: Configure MQTT Broker availability and scale
# titleSuffix: Azure IoT MQ
description: Configure MQTT Broker availability and scale.
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 10/27/2023

#CustomerIntent: As an operator, I want to understand availability and scale options for MQTT broker.
---

# Configure availability and scale

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

The **Broker** resource is the main resource that defines the overall settings for Azure IoT MQ's MQTT Broker. It also determines the number and type of pods that run the Broker configuration, such as the frontends and the backends. You can also use the *Broker* resource to configure its memory profile. Self-healing mechanisms are built in to the broker and it can often automatically recover from component failures. For example, a node fails in a Kubernetes cluster configured for high availability. 

You can horizontally scale the Broker by adding more frontend replicas and backend chains. The frontend replicas are responsible for accepting MQTT connections from clients and forwarding them to the backend chains. The backend chains are responsible for storing and delivering messages to the clients. The frontend pods distribute message traffic across the backend pods, and the backend redundancy factor determines the number of data copies to provide resiliency against node failures in the cluster.


## Configure Azure IoT MQ scaling settings with the Broker custom resource

> [!IMPORTANT]
> At this time, the Broker resource can only be configured at initial deployment time using the Azure CLI, Portal or GitHub Action. A new deployment is required if Broker configuration changes are needed. 

To configure the scaling settings Azure IoT MQ broker, you need to specify the `mode` and `cardinality` fields in the specification of the *Broker* custom resource.

The `mode` field can be one of these values:

- `auto`: This value indicates that Azure IoT MQ operator automatically deploys the appropriate number of pods based on the cluster hardware. The default value is *auto* and used for most scenarios.
- `distributed`: This value indicates that you can manually specify the number of frontend pods and backend chains in the `cardinality` field. This option gives you more control over the deployment, but requires more configuration.

The `cardinality` field is a nested field that has these subfields:

- `frontend`: This subfield defines the settings for the frontend pods, such as:
  - `replicas`: The number of frontend pods to deploy. This subfield is required if the `mode` field is set to `distributed`.
- `backendChain`: This subfield defines the settings for the backend chains, such as:
  - `redundancyFactor`: The number of data copies in each backend chain. This subfield is required if the `mode` field is set to `distributed`.
  - `partitions`: The number of partitions to deploy. This subfield is required if the `mode` field is set to `distributed`.
  - `workers`: The number of workers to deploy, currently it must be set to `1`. This subfield is required if the `mode` field is set to `distributed`.


## Configure Azure IoT MQ memory profile

> [!IMPORTANT]
> At this time, the Broker resource can only be configured at initial deployment time using the Azure CLI, Portal or GitHub Action. A new deployment is required if Broker configuration changes are needed. 

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
