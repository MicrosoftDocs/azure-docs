---
title: "Known issues: Azure IoT Operations"
description: A list of known issues for Azure IoT Operations.
author: dominicbetts
ms.author: dobett
ms.topic: troubleshooting-known-issue
ms.custom:
  - ignite-2023
ms.date: 11/02/2023
---

# Known issues: Azure IoT Operations

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

This article contains known issues for Azure IoT Operations Preview.

## Azure IoT Operations

- QoS0 isn't currently supported.

- You must use the Azure CLI interactive login `az login`. If you don't, you might see an error such as _ERROR: AADSTS530003: Your device is required to be managed to access this resource_.

## Azure IoT MQ (preview)

- You can only access the default deployment by using the cluster IP, TLS, and a service account token. Clients outside the cluster need extra configuration before they can connect.

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

It's possible a momentary loss of communication with MQ broker pods can pause the processing of data pipelines. If you notice this happening, run the following commands:

```bash
kubectl rollout restart statefulset aio-dp-runner-worker -n azure-iot-operations 
kubectl rollout restart statefulset aio-dp-reader-worker -n azure-iot-operations
```

## Layered Network Management (preview)

- If the Layered Network Management service isn't getting an IP address while running K3S on Ubuntu host, reinstall K3S without *trafeik ingress controller* using `--disable=traefik` option. 

    ```bash
    curl -sfL https://get.k3s.io | sh -s - --disable=traefik --write-kubeconfig-mode 644
    ```
    For more information, see [Networking | K3s](https://docs.k3s.io/networking#traefik-ingress-controller).

- If DNS queries aren't getting resolved to expected IP address while using [CoreDNS](../manage-layered-network/howto-configure-layered-network.md#configure-coredns) service running on child network level, upgrade to Ubuntu 22.04 and reinstall K3S. 


## OPC PLC simulator

If you create an asset endpoint for the OPC PLC simulator, but the OPC PLC simulator isn't sending data to the MQ broker, try the following command:

- Patch the asset endpoint with `autoAcceptUntrustedServerCertificates=true`:

```bash
ENDPOINT_NAME=<name-of-you-endpoint-here>
kubectl patch AssetEndpointProfile $ENDPOINT_NAME \
-n azure-iot-operations \
--type=merge \
-p '{"spec":{"additionalConfiguration":"{\"applicationName\":\"'"$ENDPOINT_NAME"'\",\"security\":{\"autoAcceptUntrustedServerCertificates\":true}}"}}'
```

You can also patch all your asset endpoints with the following command:

```bash
ENDPOINTS=$(kubectl get AssetEndpointProfile -n azure-iot-operations --no-headers -o custom-columns=":metadata.name")
for ENDPOINT_NAME in `echo "$ENDPOINTS"`; do \
kubectl patch AssetEndpointProfile $ENDPOINT_NAME \
   -n azure-iot-operations \
   --type=merge \
   -p '{"spec":{"additionalConfiguration":"{\"applicationName\":\"'"$ENDPOINT_NAME"'\",\"security\":{\"autoAcceptUntrustedServerCertificates\":true}}"}}'; \
done
```

> [!WARNING]
> Don't use untrusted certificates in production environments.

If the OPC PLC simulator isn't sending data to the MQ broker after you create a new asset, restart the OPC PLC simulator pod. The pod name looks like `aio-opc-opc.tcp-1-f95d76c54-w9v9c`. To restart the pod, use the `k9s` tool to kill the pod, or run the following command:

```bash
kubectl delete pod aio-opc-opc.tcp-1-f95d76c54-w9v9c -n azure-iot-operations
```
