---
title: Configure local storage dataflow endpoint in Azure IoT Operations
description: Learn how to configure a local storage dataflow endpoint in Azure IoT Operations.
author: PatAltimore
ms.author: patricka
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 09/10/2024
ai-usage: ai-assisted

#CustomerIntent: As an operator, I want to understand how to configure a local storage dataflow endpoint so that I can create a dataflow.
---

# Configure dataflow endpoints for local storage

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

To send data to local storage in Azure IoT Operations Preview, you can configure a dataflow endpoint. This configuration allows you to specify the endpoint, authentication, table, and other settings.

## Prerequisites

- An instance of [Azure IoT Operations Preview](../deploy-iot-ops/howto-deploy-iot-operations.md)
- A [configured dataflow profile](howto-configure-dataflow-profile.md)
- A [PersistentVolumeClaim (PVC)](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)

## Create a local storage dataflow endpoint

Use the local storage option to send data to a locally available persistent volume, through which you can upload data via Edge Storage Accelerator edge volumes.

# [Portal](#tab/portal)

:::image type="content" source="media/howto-configure-fabric-endpoint/create-fabric-endpoint.png" alt-text="Screenshot using operations portal to create a Microsoft Fabric OneLake dataflow endpoint.":::

# [Kubernetes](#tab/kubernetes)

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: DataflowEndpoint
metadata:
  name: esa
  namespace: azure-iot-operations
spec:
  endpointType: localStorage
  localStorageSettings:
    persistentVolumeClaimRef: <PVC-NAME>
```

The PersistentVolumeClaim (PVC) must be in the same namespace as the *DataflowEndpoint*.

---

## Configure dataflow destination

Once the endpoint is created, you can use it in a dataflow by specifying the endpoint name in the dataflow's destination settings.

# [Portal](#tab/portal)

:::image type="content" source="media/howto-configure-local-storage-endpoint/dataflow-mq-local-storage.png" alt-text="Screenshot using operations portal to create a dataflow with a MQTT source and local storage.":::

# [Kubernetes](#tab/kubernetes)

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: Dataflow
metadata:
  name: my-dataflow
  namespace: azure-iot-operations
spec:
  profileRef: default
  mode: Enabled
  operations:
    - operationType: Source
      sourceSettings:
        endpointRef: mq
        dataSources:
          *
    - operationType: Destination
      destinationSettings:
        endpointRef: esa
```

---

For more information about dataflow destination settings, see [Create a dataflow](howto-create-dataflow.md).

> [!NOTE]
> Using the local storage endpoint as a source in a dataflow isn't supported. You can use the endpoint as a destination only.


## Supported serialization formats

The only supported serialization format is Parquet.