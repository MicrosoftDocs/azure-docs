---
title: Configure local storage dataflow endpoint in Azure IoT Operations
description: Learn how to configure a local storage dataflow endpoint in Azure IoT Operations.
author: PatAltimore
ms.author: patricka
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 08/20/2024

#CustomerIntent: As an operator, I want to understand how to configure a local storage dataflow endpoint so that I can create a dataflow.
---

# Configure dataflow endpoints

Azure Data Lake endpoints are used for Azure Data Lake destinations. You can configure the endpoint, authentication, table, and other settings.

## Prerequisites

- **Azure IoT Operations**. See [Deploy Azure IoT Operations Preview](../deploy-iot-ops/howto-deploy-iot-operations.md)
- **Dataflow profile**. See [Configure dataflow profile](howto-configure-dataflow-profile.md)
- **A PersistentVolumeClaim (PVC)**. See [Persistent Volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)

## How to configure a local storage dataflow endpoint

Use the local storage option to send data to a locally available persistent volume, through which you can upload data via Edge Storage Accelerator edge volumes.

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: DataflowEndpoint
metadata:
  name: esa
spec:
  endpointType: localStorage
  localStorageSettings:
    persistentVolumeClaimRef: <your PVC name>
```

Here, the PersistentVolumeClaim (PVC) must be in the same namespace as the DataflowEndpoint.

### Use the endpoint in a dataflow destination

Now that you have created the endpoint, you can use it in a dataflow by specifying the endpoint name in the dataflow's destination settings. To learn more, see [Create a dataflow](howto-configure-dataflow.md).

> [!NOTE]
> Using the local storage endpoint as a source in a dataflow isn't supported. You can use the endpoint as a destination only.


## Supported serialization formats

The only supported serialization format is Parquet.