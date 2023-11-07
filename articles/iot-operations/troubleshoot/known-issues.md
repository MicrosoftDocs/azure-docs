---
title: "Known issues: Azure IoT Operations"
description: A list of known issues for Azure IoT Operations.
author: dominicbetts
ms.author: dobett
ms.topic: troubleshooting-known-issue
ms.date: 11/02/2023

---

# Known issues: Azure IoT Operations

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

This article contains known issues for Azure IoT Operations Preview.

## Azure IoT Operations

- QoS0 is not currently supported.

- You must use the Azure CLI interactive login `az login`. If you don't you might see an error such as _ERROR: AADSTS530003: Your device is required to be managed to access this resource_.

## Azure IoT MQ (preview)

- You can only access the default deployment by using the cluster IP, TLS, and a service account token. Clients outside the cluster need additional configuration before they can connect.

- You can't update the Broker custom resource after the initial deployment. You can't make configuration changes to cardinality, memory profile, or disk buffer.

- You can't configure the size of a disk-backed buffer unless your chosen storage class supports it.

- Resource synchronization isn't currently supported: updating a custom resource in the cluster doesn't reflect to Azure.

- QoS2 isn't currently available.

- Full persistence support isn't currently available.

## Azure IoT Data Processor (preview)

If edits you make to a pipeline aren't applied to messages, run the following commands to propagate the changes:

```bash
kubectl rollout restart deployment aio-dp-operator -n azure-iot-operations 

kubectl rollout restart statefulset aio-dp-runner-worker -n azure-iot-operations 

kubectl rollout restart statefulset aio-dp-reader-worker -n azure-iot-operations
```

It's possible a momentary loss of communication with MQ broker pods can pause the processing of data pipelines. If you notice this happening, run this following commands:

```bash
kubectl rollout restart statefulset aio-dp-runner-worker -n azure-iot-operations 
kubectl rollout restart statefulset aio-dp-reader-worker -n azure-iot-operations
```

## Layered Network Management (preview)

If the Layered Network Management service doesn't an IP address while running K3S on an Ubuntu host, re-install K3S without the `trafeik` ingress controller:

```bash
curl -sfL https://get.k3s.io | sh -s - --disable=traefik --write-kubeconfig-mode 644
```

To learn more, see [K3S | Traefik Ingress Controller](https://docs.k3s.io/networking#traefik-ingress-controller)

If DNS queries aren't resolving to expected IP address while using [CoreDNS](https://docs.k3s.io/networking#coredns) service running on child network level, upgrade to Ubuntu 22.04 and re-install K3S:

```bash
curl -sfL https://get.k3s.io | sh -s - --disable=traefik --write-kubeconfig-mode 644
```

## OPC PLC simulator

If the OPC PLC simulator sin't sending data to the MQ broker after you create a new asset, restart the OPC PLC simulator pod. The pod name looks like `aio-opc-opc.tcp-1-f95d76c54-w9v9c`. To restart the pod, use the `k9s` tool to kill the pod, or run the following command:

```bash
kubectl delete pod aio-opc-opc.tcp-1-f95d76c54-w9v9c -n azure-iot-operations
```
